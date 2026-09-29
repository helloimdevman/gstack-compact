/** Free regression coverage for the file bundle sent to workflow judges. */
import { afterEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { readWorkflowJudgeInput, buildWorkflowJudgePrompt } from './helpers/workflow-judge-input';
import { ENG_REVIEW_EXCERPT } from './helpers/workflow-excerpt';

const ROOT = resolve(import.meta.dir, '..');
const scratchRoots: string[] = [];

test('cache extraction preserves every byte of the original workflow request and rubric', () => {
  // Captured from runWorkflowJudge's pre-cache template literal, not from the
  // new builder: moving request construction must not change the paid metric.
  const prompt = buildWorkflowJudgePrompt({ judgeContext: 'test workflow', judgeGoal: 'test goal' },
    { files: [], text: 'full prompt\nincluding lines' });
  expect(createHash('sha256').update(prompt).digest('hex')).toBe('71cc9c777bf28ff0efd610259b411e3539852f83a0888fa0e92469331f8b9a43');
});

afterEach(() => {
  for (const root of scratchRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'gstack-workflow-judge-'));
  scratchRoots.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function occurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

function sectionPaths(skill: string): string[] {
  return readdirSync(join(ROOT, skill, 'sections'))
    .filter(name => name.endsWith('.md'))
    .sort()
    .map(name => `${skill}/sections/${name}`);
}

describe('workflow judge file bundle', () => {
  test('registered engineering judge reads the current /plan owner and its sections', () => {
    const source = readFileSync(join(ROOT, 'test/skill-llm-eval.test.ts'), 'utf8');
    const registration = source.match(/testIfSelected\('plan-eng-review\/SKILL\.md sections',[\s\S]*?await runWorkflowJudge\(\{([\s\S]*?)\n    \}\);/);
    expect(registration).not.toBeNull();
    const options = new Function('ENG_REVIEW_EXCERPT', `return ({${registration![1]}});`)(ENG_REVIEW_EXCERPT);
    const input = readWorkflowJudgeInput({ root: ROOT, ...options });
    expect(options.skillPath).toBe('plan/SKILL.md');
    expect(input.files[0]?.content).toContain('# /plan');
    expect(input.files.map(file => file.path)).toContain('plan/sections/engineering-review.md');
    expect(input.text).toContain('Trace affected code, callers, data flow');
  });

  test('ship judge bundles the current entrypoint and each lazy section once', () => {
    const source = readFileSync(join(ROOT, 'test/skill-llm-eval.test.ts'), 'utf8');
    expect(source).toContain("skillPath: 'ship/SKILL.md',\n      startMarker: '# /ship',\n      endMarker: null");
    const input = readWorkflowJudgeInput({ root: ROOT, skillPath: 'ship/SKILL.md', startMarker: '# /ship', endMarker: null });
    expect(input.files[0]?.content).toContain('## 2. Verify');
    expect(input.files[0]?.content).toContain('## 4. Publish');
    expect(input.files.filter(file => file.kind === 'section').map(file => file.path)).toEqual(sectionPaths('ship'));
    for (const file of input.files) expect(occurrences(input.text, file.content)).toBe(1);
  });

  test('design and browser judges consume current /plan and /verify sections', () => {
    for (const [skill, section] of [['plan', 'design-review'], ['verify', 'browser'], ['verify', 'visual']] as const) {
      const input = readWorkflowJudgeInput({ root: ROOT, skillPath: `${skill}/SKILL.md`, startMarker: `# /${skill}`, endMarker: null });
      expect(input.files.map(file => file.path)).toContain(`${skill}/sections/${section}.md`);
    }
  });


  test('preserves the exact entrypoint excerpt and each complete section in sorted named files', () => {
    const entrypoint = 'excluded preamble\n## Begin\nRead sections/z-last.md when directed.\n## End\nexcluded epilogue';
    const sections = {
      'example/sections/z-last.md': 'Z section prefix\nZ section suffix',
      'example/sections/a-first.md': 'A section prefix\nA section suffix',
    };
    const root = fixture({
      'example/SKILL.md': entrypoint,
      ...sections,
      'example/sections/ignored.md.tmpl': 'DO NOT EVALUATE TEMPLATE',
      'example/sections/manifest.json': '{"ignored": true}',
    });
    const input = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## End' });

    expect(input.files).toEqual([
      { path: 'example/SKILL.md', kind: 'entrypoint', content: '## Begin\nRead sections/z-last.md when directed.\n', startLine: 2, endLine: 3 },
      { path: 'example/sections/a-first.md', kind: 'section', content: sections['example/sections/a-first.md'], startLine: 1, endLine: 2 },
      { path: 'example/sections/z-last.md', kind: 'section', content: sections['example/sections/z-last.md'], startLine: 1, endLine: 2 },
    ]);
    expect(input.text).not.toContain('excluded preamble');
    expect(input.text).not.toContain('excluded epilogue');
    expect(input.text).not.toContain('DO NOT EVALUATE TEMPLATE');
    expect(input.text).not.toContain('manifest.json');
    for (const file of input.files) {
      expect(occurrences(input.text, file.content)).toBe(1);
      const begin = input.text.split('\n').filter(line => line.includes('BEGIN FILE') && line.includes(file.path));
      const end = input.text.split('\n').filter(line => line.includes('END FILE') && line.includes(file.path));
      expect(begin).toHaveLength(1);
      expect(end).toHaveLength(1);
      expect(begin[0]).toContain(`${file.startLine}-${file.endLine}`);
    }
  });

  test('describes lazy file loading without presenting bundle order as execution order', () => {
    const root = fixture({
      'example/SKILL.md': '## Begin\nSTOP and read sections/step.md.\n## End',
      'example/sections/step.md': 'Run the separately loaded step.',
    });
    const { text } = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## End' });
    const header = text.slice(0, text.indexOf('BEGIN FILE'));
    expect(header).toMatch(/bundle/i);
    expect(header).toMatch(/file/i);
    expect(header).toMatch(/separate|separately/i);
    expect(header).toMatch(/lazy|on-demand/i);
    expect(header).toMatch(/directives|instructions/i);
    expect(header).toMatch(/(?:not|isn't|does not)[^.\n]*execution order/i);
    expect(text).toContain('STOP and read sections/step.md.');
  });

  test('retains section prelude and suffix exactly once when both markers are inside a section', () => {
    // Generated comments made the old 120-character prefix heuristic append
    // this whole file after its partial slice, duplicating every review pass.
    const section = [
      '<!-- AUTO-GENERATED from review-sections.md.tmpl — do not edit directly -->',
      '<!-- Regenerate: bun run gen:skill-docs -->',
      'section context before the selected marker',
      '## Review Sections',
      '### Pass 1: Information Architecture',
      'Evaluate the first pass.',
      '## CRITICAL RULE',
      'section context after the selected marker',
    ].join('\n');
    const root = fixture({
      'example/SKILL.md': 'Entrypoint preamble.\nSTOP and read sections/review-sections.md.',
      'example/sections/review-sections.md': section,
    });
    const input = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Review Sections', endMarker: '## CRITICAL RULE' });

    expect(input.files).toEqual([
      { path: 'example/sections/review-sections.md', kind: 'section', content: section, startLine: 1, endLine: 8 },
    ]);
    expect(occurrences(input.text, '### Pass 1: Information Architecture')).toBe(1);
    expect(occurrences(input.text, 'section context before the selected marker')).toBe(1);
    expect(occurrences(input.text, 'section context after the selected marker')).toBe(1);
    expect(occurrences(input.text, section)).toBe(1);
    expect(input.text).not.toContain('Entrypoint preamble.');
  });

  test('handles marker windows spanning files without losing section prefixes or suffixes', () => {
    const root = fixture({
      'example/SKILL.md': 'omitted\n## Begin\nEntrypoint tail',
      'example/sections/a.md': 'First section prefix\nFirst section body\nFirst section suffix',
      'example/sections/b.md': 'Second section prefix\n## End\nSecond section suffix',
    });
    const input = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## End' });

    expect(input.files[0]).toEqual({
      path: 'example/SKILL.md', kind: 'entrypoint', content: '## Begin\nEntrypoint tail', startLine: 2, endLine: 3,
    });
    expect(input.files.slice(1).map(file => file.content)).toEqual([
      'First section prefix\nFirst section body\nFirst section suffix',
      'Second section prefix\n## End\nSecond section suffix',
    ]);
    expect(occurrences(input.text, 'Second section prefix')).toBe(1);
    expect(occurrences(input.text, 'Second section suffix')).toBe(1);
  });

  test('keeps separate files even when their generated preludes and contents match', () => {
    const body = '<!-- AUTO-GENERATED -->\nShared instruction';
    const root = fixture({
      'example/SKILL.md': '## Begin\nRead both sections.\n## End',
      'example/sections/a.md': body,
      'example/sections/b.md': body,
    });
    const input = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## End' });
    expect(input.files.filter(file => file.kind === 'section').map(file => file.path)).toEqual([
      'example/sections/a.md', 'example/sections/b.md',
    ]);
    expect(occurrences(input.text, body)).toBe(2);
  });

  test('supports an uncarved workflow and an open-ended slice', () => {
    const root = fixture({ 'example/SKILL.md': 'omitted\n## Begin\nRetain this final line' });
    const input = readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: null });
    expect(input.files).toEqual([
      { path: 'example/SKILL.md', kind: 'entrypoint', content: '## Begin\nRetain this final line', startLine: 2, endLine: 3 },
    ]);
  });

  test('rejects missing start markers, missing end markers, and end markers preceding the start', () => {
    const root = fixture({ 'example/SKILL.md': '## Earlier\n## Begin\nBody' });
    expect(() => readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Missing', endMarker: null })).toThrow(/Start marker not found/);
    expect(() => readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## Missing' })).toThrow(/End marker not found/);
    expect(() => readWorkflowJudgeInput({ root, skillPath: 'example/SKILL.md', startMarker: '## Begin', endMarker: '## Earlier' })).toThrow(/End marker not found/);
  });








});
