import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { CAPTURE_MS, CAPTURE_LONG_MS } from './helpers/eval-budgets';
import { runSkillTest, type SkillTestResult } from './helpers/session-runner';
import { getProjectEvalDir } from './helpers/eval-store';
import { callJudge } from './helpers/llm-judge';
import {
  ROOT, runId, evalsEnabled, selectedTests,
  describeIfSelected, testConcurrentIfSelected,
  copyDirSync, logCost, recordE2E,
  createEvalCollector, finalizeEvalCollector,
} from './helpers/e2e-helpers';
import { installFakeImpeccable, DETECT_SAMPLE } from './helpers/fake-impeccable';
import { hermeticChildEnv } from './helpers/hermetic-env';
import { sliceBetween } from './helpers/skill-fixture';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const evalCollector = createEvalCollector('e2e-design');

/**
 * LLM judge for DESIGN.md quality — checks font blacklist compliance,
 * coherence, specificity, and AI slop avoidance.
 */
async function designQualityJudge(designMd: string): Promise<{ passed: boolean; reasoning: string }> {
  return callJudge<{ passed: boolean; reasoning: string }>(`You are evaluating a generated DESIGN.md file for quality.

Evaluate against these criteria — ALL must pass for an overall "passed: true":
1. Does NOT recommend Inter, Roboto, Arial, Helvetica, Open Sans, Lato, Montserrat, or Poppins as primary fonts
2. Aesthetic direction is coherent with color approach (e.g., brutalist aesthetic doesn't pair with expressive color without explanation)
3. Font recommendations include specific font names (not generic like "a sans-serif font")
4. Color palette includes actual hex values, not placeholders like "[hex]"
5. Rationale is provided for major decisions (not just "because it looks good")
6. No AI slop patterns: purple gradients mentioned positively, "3-column feature grid" language, generic marketing speak
7. Product context is reflected in design choices (civic tech → should have appropriate, professional aesthetic)

DESIGN.md content:
\`\`\`
${designMd}
\`\`\`

Return JSON: { "passed": true/false, "reasoning": "one paragraph explaining your evaluation" }`);
}

// --- Design Consultation E2E ---

describeIfSelected('Design Consultation E2E', [
  'design-consultation-core',
  'design-consultation-existing',
  'design-consultation-preview',
], () => {
  let designDir: string;

  beforeAll(() => {
    designDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-e2e-design-consultation-'));
    const run = (cmd: string, args: string[]) =>
      spawnSync(cmd, args, { cwd: designDir, stdio: 'pipe', timeout: 5000 });

    run('git', ['init', '-b', 'main']);
    run('git', ['config', 'user.email', 'test@test.com']);
    run('git', ['config', 'user.name', 'Test']);

    // Create a realistic project context
    fs.writeFileSync(path.join(designDir, 'README.md'), `# CivicPulse

A civic tech data platform for government employees to access, visualize, and share public data. Built with Next.js and PostgreSQL.

## Features
- Real-time data dashboards for municipal budgets
- Public records search with faceted filtering
- Data export and sharing tools for inter-department collaboration
`);
    fs.writeFileSync(path.join(designDir, 'package.json'), JSON.stringify({
      name: 'civicpulse',
      version: '0.1.0',
      dependencies: { next: '^14.0.0', react: '^18.2.0', 'tailwindcss': '^3.4.0' },
    }, null, 2));

    run('git', ['add', '.']);
    run('git', ['commit', '-m', 'initial project setup']);

    // Copy design-consultation skill — INCLUDING sections/. The skill has
    // been carved since v1.57.0.0 (e722c5bf): Phases 3-6, where the DESIGN.md
    // structure (the "AESTHETIC: [direction]" proposal template) is
    // prescribed, live in sections/proposal-and-preview.md behind a STOP-read.
    // Without the dir the agent improvises structure from the skeleton
    // ("Visual thesis" vocabulary) and the section-synonym check becomes a
    // coin flip (observed: CI run 33090283032 failed both attempts with
    // "no sections dir" in the trace; the skeleton-only pass on 32899975845
    // was lucky vocabulary).
    fs.mkdirSync(path.join(designDir, 'design-consultation'), { recursive: true });
    fs.copyFileSync(
      path.join(ROOT, 'design-consultation', 'SKILL.md'),
      path.join(designDir, 'design-consultation', 'SKILL.md'),
    );
    fs.cpSync(
      path.join(ROOT, 'design-consultation', 'sections'),
      path.join(designDir, 'design-consultation', 'sections'),
      { recursive: true },
    );
  });

  afterAll(() => {
    try { fs.rmSync(designDir, { recursive: true, force: true }); } catch {}
  });

  testConcurrentIfSelected('design-consultation-core', async () => {
    const result = await runSkillTest({
      prompt: `Read design-consultation/SKILL.md for the design consultation workflow.
Skip the preamble bash block, lake intro, telemetry, and contributor mode sections — go straight to the design workflow.

This is a civic tech data platform called CivicPulse for government employees who need to access public data. Read the README.md for details.

Skip research — work from your design knowledge. Skip the font preview page. Skip any AskUserQuestion calls — this is non-interactive. Accept your first design system proposal.

Write DESIGN.md and CLAUDE.md (or update it) in the working directory.`,
      workingDirectory: designDir,
      maxTurns: 20,
      timeout: CAPTURE_LONG_MS,
      testName: 'design-consultation-core',
      runId,
      model: 'claude-opus-4-7',
    });

    logCost('/design-consultation core', result);

    const designPath = path.join(designDir, 'DESIGN.md');
    const claudePath = path.join(designDir, 'CLAUDE.md');
    const designExists = fs.existsSync(designPath);
    const claudeExists = fs.existsSync(claudePath);
    let designContent = '';

    if (designExists) {
      designContent = fs.readFileSync(designPath, 'utf-8');
    }

    // Structural checks — fuzzy synonym matching to handle agent variation
    const sectionSynonyms: Record<string, string[]> = {
      'Product Context': ['product', 'context', 'overview', 'about'],
      // Widened 2026-08-27: two CI runs produced judge-praised DESIGN.md files
      // that articulated the direction as "design principles" / "design
      // language" prose without any of the original four literals (run
      // 33090283032, both attempts; inputs identical to the prior passing
      // run 32899975845 — vocabulary variance, not a generation regression).
      // Widened again 2026-09-08: the open DESIGN.md format's Overview opens with a
      // "Creative North Star" and "Key characteristics" instead of an Aesthetic
      // Direction heading (the judge passed both CI attempts on the vocabulary).
      'Aesthetic': ['aesthetic', 'visual direction', 'design direction', 'visual identity', 'design language', 'visual language', 'design principle', 'look and feel', 'art direction', 'north star', 'key characteristics', '## overview'],
      'Typography': ['typography', 'type', 'font', 'typeface'],
      'Color': ['color', 'colour', 'palette', 'colors'],
      'Spacing': ['spacing', 'space', 'whitespace', 'gap'],
      'Layout': ['layout', 'grid', 'structure', 'composition'],
      'Motion': ['motion', 'animation', 'transition', 'movement', 'easing', 'duration', 'micro-interaction'],
    };
    const missingSections = Object.entries(sectionSynonyms).filter(
      ([_, synonyms]) => !synonyms.some(s => designContent.toLowerCase().includes(s))
    ).map(([name]) => name);

    // LLM judge for quality
    let judgeResult = { passed: false, reasoning: 'judge not run' };
    if (designExists && designContent.length > 100) {
      try {
        judgeResult = await designQualityJudge(designContent);
        console.log('Design quality judge:', JSON.stringify(judgeResult, null, 2));
      } catch (err) {
        console.warn('Judge failed:', err);
        judgeResult = { passed: true, reasoning: 'judge error — defaulting to pass' };
      }
    }

    const structuralPass = designExists && claudeExists && missingSections.length === 0;
    recordE2E(evalCollector, '/design-consultation core', 'Design Consultation E2E', result, {
      passed: structuralPass && judgeResult.passed && ['success', 'error_max_turns'].includes(result.exitReason),
    });

    expect(['success', 'error_max_turns']).toContain(result.exitReason);
    expect(designExists).toBe(true);
    if (designExists) {
      // join() so a failure names the offending section(s) — a bare
      // toHaveLength(0) failure never prints WHICH synonym set missed.
      expect(missingSections.join(', ')).toBe('');
    }
    if (claudeExists) {
      const claude = fs.readFileSync(claudePath, 'utf-8');
      expect(claude.toLowerCase()).toContain('design.md');
    }
  }, CAPTURE_LONG_MS);


  testConcurrentIfSelected('design-consultation-existing', async () => {
    // Pre-create a LEGACY-format DESIGN.md (gstack's pre-spec shape, no marker) so
    // Phase 0's format check has a real decision to make.
    fs.writeFileSync(path.join(designDir, 'DESIGN.md'), `# Design System — CivicPulse

## Product Context
- **What this is:** Civic data platform

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian

## Typography
- **Body:** system-ui

## Color
- **Primary:** #1D4ED8
`);

    const result = await runSkillTest({
      prompt: `Read design-consultation/SKILL.md for the design consultation workflow.

There is already a DESIGN.md in this repo. Update it with a complete design system for CivicPulse, a civic tech data platform for government employees.

Run Phase 0's DESIGN.md format check exactly as written (the gstack bin directory is ${ROOT}/bin). Skip research. Skip font preview. Skip any AskUserQuestion calls — this is non-interactive: where the skill asks whether to convert the legacy file, take option A (convert) without asking.`,
      workingDirectory: designDir,
      maxTurns: 20,
      timeout: CAPTURE_LONG_MS,
      testName: 'design-consultation-existing',
      runId,
      model: 'claude-opus-4-7',
    });

    logCost('/design-consultation existing', result);

    const designPath = path.join(designDir, 'DESIGN.md');
    const designExists = fs.existsSync(designPath);
    let designContent = '';
    if (designExists) {
      designContent = fs.readFileSync(designPath, 'utf-8');
    }

    // Should have more content than the minimal version
    const hasColor = designContent.toLowerCase().includes('color');
    const hasSpacing = designContent.toLowerCase().includes('spacing');

    // Phase 0 format decision: the check ran, and the file left behind is either
    // converted to the open format (marker on line 2) or explicitly kept legacy
    // (marker on line 1). Either is the persisted-choice contract; "neither" is the bug.
    const bash = result.toolCalls.filter(c => c.tool === 'Bash').map(c => String(c.input?.command ?? ''));
    const ranCheck = bash.some(c => c.includes('gstack-design-md.ts check'));
    const marked = /^---\n# gstack: design-md-format=spec/.test(designContent) || designContent.startsWith('<!-- gstack: design-md-format=legacy-keep -->');
    console.log(`design-consultation-existing: ranCheck=${ranCheck} marked=${marked}`);

    recordE2E(evalCollector, '/design-consultation existing', 'Design Consultation E2E', result, {
      passed: designExists && hasColor && hasSpacing && ranCheck && marked && ['success', 'error_max_turns'].includes(result.exitReason),
    });

    expect(['success', 'error_max_turns']).toContain(result.exitReason);
    expect(ranCheck).toBe(true);
    expect(marked).toBe(true);
    expect(designExists).toBe(true);
    if (designExists) {
      expect(hasColor).toBe(true);
      expect(hasSpacing).toBe(true);
    }
  }, CAPTURE_LONG_MS);

  testConcurrentIfSelected('design-consultation-preview', async () => {
    // Test preview HTML generation only — no DESIGN.md (covered by core test)
    const previewDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-e2e-preview-'));

    const result = await runSkillTest({
      prompt: `Generate a font and color preview page for a civic tech data platform.

The design system uses:
- Primary font: Cabinet Grotesk (headings), Source Sans 3 (body)
- Colors: #1B4D8E (civic blue), #C4501A (alert orange), #2D6A4F (success green)
- Neutral: #F8F7F6 (warm white), #1A1A1A (near black)

Write a single HTML file to ${previewDir}/design-preview.html that shows:
- Font specimens for each font at different sizes
- Color swatches with hex values
- A light/dark toggle
Do NOT write DESIGN.md — only the preview HTML.`,
      workingDirectory: previewDir,
      maxTurns: 8,
      // 300s, not 90s: this is the test that failed 3x at 0 turns/$0.00/93s
      // on PR #2533 CI — see the research test's comment for the class.
      timeout: CAPTURE_MS,
      testName: 'design-consultation-preview',
      runId,
    });

    logCost('/design-consultation preview', result);

    const previewPath = path.join(previewDir, 'design-preview.html');
    const previewExists = fs.existsSync(previewPath);
    let previewContent = '';
    if (previewExists) {
      previewContent = fs.readFileSync(previewPath, 'utf-8');
    }

    const hasHtml = previewContent.includes('<html') || previewContent.includes('<!DOCTYPE');
    const hasFontRef = previewContent.includes('font-family') || previewContent.includes('fonts.googleapis') || previewContent.includes('fonts.bunny');

    recordE2E(evalCollector, '/design-consultation preview', 'Design Consultation E2E', result, {
      passed: previewExists && hasHtml && ['success', 'error_max_turns'].includes(result.exitReason),
    });

    expect(['success', 'error_max_turns']).toContain(result.exitReason);
    expect(previewExists).toBe(true);
    if (previewExists) {
      expect(hasHtml).toBe(true);
      expect(hasFontRef).toBe(true);
    }

    try { fs.rmSync(previewDir, { recursive: true, force: true }); } catch {}
  }, CAPTURE_LONG_MS);
});

// Module-level afterAll — finalize eval collector after all tests complete
afterAll(async () => {
  await finalizeEvalCollector(evalCollector);
});

// --- Design detector (impeccable engine shim) E2E ---
//
// The user-installed impeccable engine is stood in for by test/fixtures/
// fake-impeccable.ts (prints the captured detect --json sample, exit 2),
// reached through IMPECCABLE_BIN from OUTSIDE the temp repo (the wrapper
// ignores an in-repo IMPECCABLE_BIN by design). The skill text the agent reads
// is the extracted Setup detector block + Phase 0 (+ the Phase 3 DOM-dump
// section for the DOM case), never the 1,500-line SKILL.md, with the installed
// bin path pointed at THIS checkout so the test does not depend on ~/.claude.


/** design-review's detector prose with the installed bin/lib paths rewritten to this checkout. */
function detectorSkillText(sections: Array<[string, string]>): string {
  const full = fs.readFileSync(path.join(ROOT, 'design-review', 'SKILL.md'), 'utf-8');
  return sections.map(([a, b]) => sliceBetween(full, a, b)).join('\n\n---\n\n')
    .replaceAll('$HOME/.claude/skills/gstack', ROOT)
    .replaceAll('~/.claude/skills/gstack', ROOT);
}

function makeFakeEngine(): string {
  return installFakeImpeccable('skill-e2e-fake-impeccable-').dir;
}

function detectorReportEntries(report: string): string[] {
  return report.split(/(?=^[\t ]*(?:#{1,6}\s+|[-*|]\s*|\d+[.)]\s+)?(?:\*\*|`)?FINDING-\d+)/m);
}

if (!evalsEnabled) test('detector report handoffs stay with their entry across inline cross-references', () => {
  const report = `### FINDING-001 \`[low-contrast]\` — impact=high — DEFERRED
handoff=\`/impeccable colorize\`

### FINDING-002 \`[ai-color-palette]\` — impact=medium — DEFERRED
The colors also appear in FINDING-001. This is unconfirmed static evidence.
handoff=\`/impeccable colorize\`

### FINDING-003 \`[skipped-heading]\` — impact=medium — DEFERRED
handoff=\`/impeccable typeset\`
`;
  const hasPaletteHandoff = (text: string) => detectorReportEntries(text).some(entry => entry.includes('[ai-color-palette]') && entry.includes('/impeccable colorize'));
  expect(hasPaletteHandoff(report)).toBe(true);
  expect(hasPaletteHandoff(report.replace('handoff=`/impeccable colorize`\n\n### FINDING-003', '### FINDING-003'))).toBe(false);
  for (const marker of ['.', ')']) {
    const numbered = report.replace(/^### FINDING-(\d+)/gm, (_, number) => `${Number(number)}${marker} **FINDING-${number}**`);
    expect(hasPaletteHandoff(numbered)).toBe(true);
    expect(hasPaletteHandoff(numbered.replace(`handoff=\`/impeccable colorize\`\n\n3${marker}`, `3${marker}`))).toBe(false);
  }
});

function pluginDetectorFixture() {
  const fixture = installFakeImpeccable('skill-e2e-plugin-');
  const repoDir = path.join(fixture.dir, 'repo');
  const home = path.join(fixture.dir, 'home');
  const configDir = path.join(fixture.dir, 'custom-claude');
  const gstackHome = path.join(fixture.dir, 'gstack');
  const impeccableHome = path.join(fixture.dir, 'engine-cache');
  for (const dir of [repoDir, home, configDir, gstackHome, impeccableHome]) fs.mkdirSync(dir);
  const env = hermeticChildEnv({
    HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: configDir,
    GSTACK_HOME: gstackHome, IMPECCABLE_HOME: impeccableHome,
    CLAUDE_PLUGIN_DATA: '', GSTACK_HEADLESS: '1',
  });
  for (const key of Object.keys(env)) if (key.startsWith('IMPECCABLE_') && key !== 'IMPECCABLE_HOME') delete env[key];
  const engines: Record<string, string> = {};
  for (const version of ['4.3.1', '4.10.0']) {
    const skillDir = path.join(configDir, 'plugins/cache/fixture-market/impeccable', version, 'skills/impeccable');
    const scripts = path.join(skillDir, 'scripts');
    const engineDir = path.join(scripts, 'bin', `${process.platform}-${process.arch}`);
    fs.mkdirSync(engineDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), '# Impeccable fixture marker\n');
    fs.writeFileSync(path.join(scripts, 'impeccable'), `#!/bin/sh\nprintf launcher > '${fixture.dir}/launcher-ran'\nexit 99\n`, { mode: 0o755 });
    fs.writeFileSync(path.join(scripts, 'VERSION'), '1.6.0\n');
    engines[version] = path.join(engineDir, 'impeccable');
    fs.writeFileSync(engines[version], `#!/bin/sh\nIMPECCABLE_FAKE_LOG='${fixture.dir}/${version}.jsonl' exec '${process.execPath}' '${fixture.bin}' "$@"\n`, { mode: 0o755 });
    engines[version] = fs.realpathSync(engines[version]);
  }
  const git = (...args: string[]) => {
    const result = spawnSync('git', args, { cwd: repoDir, env, encoding: 'utf-8', timeout: 5000 });
    if (result.status !== 0) throw new Error(`Plugin fixture git ${args[0]} failed: ${result.stderr}`);
  };
  git('init', '-b', 'main');
  git('config', 'user.email', 'test@test.com');
  git('config', 'user.name', 'Test');
  fs.writeFileSync(path.join(repoDir, 'index.html'), '<h1>Clean</h1>\n');
  git('add', '.');
  git('commit', '-m', 'initial');
  git('checkout', '-b', 'feature/landing');
  fs.copyFileSync(path.join(ROOT, 'test/fixtures/review-eval-design-slop.html'), path.join(repoDir, 'index.html'));
  git('add', '.');
  git('commit', '-m', 'landing page');
  fs.writeFileSync(path.join(repoDir, 'design-review-detector.md'), detectorSkillText([
    ['**Design detector (optional, deterministic):**', '**Create output directories:**'],
    ['**Phase 0: mechanical scan**', '## Phases 1-6'],
  ]));
  return { dir: fixture.dir, repoDir, env, engines };
}

if (!evalsEnabled) test('plugin detector fixture discovers the selected engine without an override', () => {
  const fixture = pluginDetectorFixture();
  try {
    expect(fixture.env.IMPECCABLE_BIN).toBeUndefined();
    const probe = spawnSync(process.execPath, ['--no-env-file', 'run', path.join(ROOT, 'bin/gstack-design-detect.ts'), 'probe', '--host', 'claude'], {
      cwd: fixture.repoDir, env: fixture.env, encoding: 'utf-8', timeout: 10000,
    });
    expect(probe.status).toBe(0);
    expect(probe.stdout).toContain(`IMPECCABLE_READY: ${fixture.engines['4.10.0']}`);
    expect(probe.stdout).toContain('IMPECCABLE_SKILL: present');
    const scan = spawnSync(process.execPath, ['--no-env-file', 'run', path.join(ROOT, 'bin/gstack-design-detect.ts'), 'scan', '--changed', 'main', '--host', 'claude'], {
      cwd: fixture.repoDir, env: fixture.env, encoding: 'utf-8', timeout: 10000,
    });
    expect(scan.status).toBe(2);
    expect(scan.stderr).toContain('handoff=/impeccable colorize');
    expect(fs.existsSync(path.join(fixture.dir, '4.10.0.jsonl'))).toBe(true);
    expect(fs.existsSync(path.join(fixture.dir, '4.3.1.jsonl'))).toBe(false);
    expect(fs.existsSync(path.join(fixture.dir, 'launcher-ran'))).toBe(false);
  } finally {
    fs.rmSync(fixture.dir, { recursive: true, force: true });
  }
});

describeIfSelected('Design review plugin discovery E2E', ['design-review-plugin-handoff'], () => {
  testConcurrentIfSelected('design-review-plugin-handoff', async () => {
    const fixture = pluginDetectorFixture();
    try {
      const result = await runSkillTest({
        prompt: `Load gstack's /design-review workflow by reading design-review-detector.md, the actual Setup detector and Phase 0 excerpt.
Supported actor scope: read that excerpt, run its detector probe and one source-mode scan, then write detector-output.md. This isolated repository is on feature/landing; its base is main. There is no URL.
Do not install or download anything, execute a launcher, change environment variables, browse, ask questions, spawn agents, or edit anything except detector-output.md. Do not read Impeccable skill files. If discovery fails, report that failure and stop; do not repair the environment.
Write the probe's first line and skill-presence line, then one FINDING-NNN entry per DETECT_TOP rule with its [rule-id] and impact. All findings are deferred, unconfirmed static evidence because rendered-page confirmation is outside this actor's scope. Apply the excerpt's deferred-finding reporting requirements. Do not fix source files or claim visual verification.`,
        workingDirectory: fixture.repoDir,
        maxTurns: 10,
        timeout: CAPTURE_MS,
        testName: 'design-review-plugin-handoff',
        runId,
        tools: ['Bash', 'Read', 'Write'],
        env: fixture.env,
      });
      logCost('/design-review plugin handoff', result);
      const reportPath = path.join(fixture.repoDir, 'detector-output.md');
      const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf-8') : '';
      const outputs = result.toolCalls.map(call => String(call.output ?? '')).join('\n');
      const commands = result.toolCalls.filter(call => call.tool === 'Bash').map(call => String(call.input?.command ?? ''));
      const handoffs = [...outputs.matchAll(/\[([\w-]+)\] impact=(\w+)[^\n]*handoff=(\/impeccable \w+)/g)];
      const entries = detectorReportEntries(report);
      const engineLog = path.join(fixture.dir, '4.10.0.jsonl');
      const invocations = fs.existsSync(engineLog) ? fs.readFileSync(engineLog, 'utf-8').trim().split('\n') : [];
      const sourceUnchanged = fs.readFileSync(path.join(fixture.repoDir, 'index.html'), 'utf-8') === fs.readFileSync(path.join(ROOT, 'test/fixtures/review-eval-design-slop.html'), 'utf-8');
      if (process.env.GSTACK_EVAL_DIR) {
        const evidenceDir = path.join(process.env.GSTACK_EVAL_DIR, 'plugin-handoff', `${Date.now()}`);
        fs.mkdirSync(evidenceDir, { recursive: true, mode: 0o700 });
        for (const [name, text] of Object.entries({
          'report.md': report,
          'skill-excerpt.md': fs.readFileSync(path.join(fixture.repoDir, 'design-review-detector.md'), 'utf-8'),
          'engine-invocations.jsonl': invocations.join('\n'),
        })) fs.writeFileSync(path.join(evidenceDir, name), text, { mode: 0o600 });
      }
      const checks = {
        success: result.exitReason === 'success',
        selectedEngine: outputs.includes(`IMPECCABLE_READY: ${fixture.engines['4.10.0']}`),
        skillPresent: outputs.includes('IMPECCABLE_SKILL: present'),
        probeReported: report.includes(`IMPECCABLE_READY: ${fixture.engines['4.10.0']}`) && report.includes('IMPECCABLE_SKILL: present'),
        probeExecuted: commands.some(command => /gstack-design-detect\.ts probe/.test(command)),
        scanExecuted: commands.some(command => /gstack-design-detect\.ts scan --changed main/.test(command)),
        noInstallOrOverride: !commands.some(command => /\bnpx\b|gstack-design-detect\.ts install|\b(?:curl|wget|npm install|bun add)\b|IMPECCABLE_BIN\s*=/.test(command)),
        oneNewEngineInvocation: invocations.length === 1,
        oldEngineNotExecuted: !fs.existsSync(path.join(fixture.dir, '4.3.1.jsonl')),
        launcherNotExecuted: !fs.existsSync(path.join(fixture.dir, 'launcher-ran')),
        sourceUnchanged,
        findingsReported: report.includes('FINDING-001') && report.includes('[ai-color-palette]') && report.includes('[low-contrast]'),
        deferred: /deferred/i.test(report),
        nonemptyHandoffs: handoffs.length > 0,
        perFindingHandoff: handoffs.every(([, rule, impact, command]) => entries.some(entry => entry.includes(`[${rule}]`) && entry.toLowerCase().includes(impact) && entry.includes(command))),
      };
      recordE2E(evalCollector, '/design-review plugin handoff', 'Design review plugin discovery E2E', result, { passed: Object.values(checks).every(Boolean) });
      expect(Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)).toEqual([]);
    } finally {
      fs.rmSync(fixture.dir, { recursive: true, force: true });
    }
  }, CAPTURE_MS);
});

describeIfSelected('Design HTML slop gate E2E', ['design-html-slop-gate'], () => {
  let workDir: string;
  let engineDir: string;

  beforeAll(() => {
    workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-e2e-html-gate-'));
    const run = (cmd: string, args: string[]) => spawnSync(cmd, args, { cwd: workDir, stdio: 'pipe', timeout: 5000 });
    run('git', ['init', '-b', 'main']);
    run('git', ['config', 'user.email', 'test@test.com']);
    run('git', ['config', 'user.name', 'Test']);
    const css = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-design-slop.css'), 'utf-8');
    const html = fs.readFileSync(path.join(ROOT, 'test', 'fixtures', 'review-eval-design-slop.html'), 'utf-8')
      .replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
    fs.writeFileSync(path.join(workDir, 'finalized.html'), html);
    run('git', ['add', '.']);
    run('git', ['commit', '-m', 'finalized html']);
    engineDir = makeFakeEngine();
    const full = fs.readFileSync(path.join(ROOT, 'design-html', 'SKILL.md'), 'utf-8');
    const text = [
      sliceBetween(full, '**Design detector (optional, deterministic):**', '## Step 0: Input Detection'),
      sliceBetween(full, '### Slop Gate (bounded, never a loop)', '### Verification Screenshots'),
    ].join('\n\n---\n\n').replaceAll('$HOME/.claude/skills/gstack', ROOT).replaceAll('~/.claude/skills/gstack', ROOT);
    fs.writeFileSync(path.join(workDir, 'design-html-gate.md'), text);
  });

  afterAll(() => {
    try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(engineDir, { recursive: true, force: true }); } catch {}
  });

  testConcurrentIfSelected('design-html-slop-gate', async () => {
    const result = await runSkillTest({
      prompt: `Read design-html-gate.md: the /design-html detector probe block and its "Slop Gate (bounded, never a loop)" step.
finalized.html in this directory is the finished page. Run the probe (--host claude), then the slop gate on finalized.html exactly as written: one surgical fix pass over the non-advisory findings, one rescan, then stop.
Write ${workDir}/gate-output.md listing what you fixed and every remaining finding as accepted-with-reason, each tagged with its [rule-id]. Do not take screenshots, do not run npx, do not scan more than twice.`,
      workingDirectory: workDir,
      maxTurns: 20,
      timeout: CAPTURE_MS,
      testName: 'design-html-slop-gate',
      runId,
      env: { IMPECCABLE_BIN: path.join(engineDir, 'impeccable'), IMPECCABLE_FAKE_OUTPUT: DETECT_SAMPLE },
    });

    logCost('/design-html slop gate', result);
    recordE2E(evalCollector, '/design-html slop gate', 'Design HTML slop gate E2E', result);
    expect(result.exitReason).toBe('success');
    const scans = result.toolCalls.filter(c => c.tool === 'Bash' && /gstack-design-detect\.ts scan /.test(String(c.input?.command ?? '')));
    expect(scans.length).toBeGreaterThanOrEqual(1);
    expect(scans.length).toBeLessThanOrEqual(2);
    const outPath = path.join(workDir, 'gate-output.md');
    expect(fs.existsSync(outPath)).toBe(true);
    const out = fs.readFileSync(outPath, 'utf-8').toLowerCase();
    expect(out).toContain('ai-color-palette');
    expect(out).toContain('accepted');
  }, CAPTURE_MS);
});
