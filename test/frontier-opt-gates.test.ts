/**
 * Frontier optimization gates. Sizes are computed from the working tree.
 * Upstream denominators are the pinned garrytan/gstack commit
 * 2a113ae7e623f590095bcaaa0cc581c9a10a6632.
 */
import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { generateModelOverlay, readOverlay } from '../scripts/resolvers/model-overlay';
import { runGeneration } from '../scripts/gen-skill-docs';
import type { TemplateContext } from '../scripts/resolvers/types';
import { HOST_PATHS } from '../scripts/resolvers/types';
import { gitArgvIn } from './helpers/scratch-repo';

const ROOT = path.resolve(import.meta.dir, '..');
const PRODUCT_MD_BASELINE = 2_468_333;
const TMPL_BASELINE = 729_116;
const CORE_SEVEN_BASELINE = 500_046;

const JOBS = {
  'product-framing': '/plan',
  'ceo-scope-challenge': '/plan',
  'engineering-plan': '/plan',
  'design-critique': '/plan',
  'code-review': '/review',
  'browser-qa': '/verify',
  ship: '/ship',
  investigate: '/investigate',
  retro: '/retro',
  sprint: '/sprint',
} as const;

const SEVEN = [
  'plan/SKILL.md',
  'build/SKILL.md',
  'review/SKILL.md',
  'verify/SKILL.md',
  'ship/SKILL.md',
  'browse/SKILL.md',
  'sprint/SKILL.md',
];

function walk(basename: string): string[] {
  const found: string[] = [];
  const visit = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'test' || entry.name === 'node_modules' || entry.name === '.git' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.name === basename) found.push(full);
    }
  };
  visit(ROOT);
  return found;
}

function bytes(file: string): number {
  return fs.statSync(file).size;
}

function routerMap(): { version: number; core: string[]; jobs: Record<string, string>; commands: Record<string, { skill: string; mode?: string }> } {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'gstack/router-map.json'), 'utf-8'));
}

function overlayCtx(model: TemplateContext['model']): TemplateContext {
  return {
    skillName: 'review',
    tmplPath: 'review/SKILL.md.tmpl',
    host: 'claude',
    paths: HOST_PATHS.claude,
    preambleTier: 2,
    model,
  };
}

function norm(text: string): string {
  return text.split(/\s+/).join(' ').trim();
}

describe('frontier size gate', () => {
  test('product skills and the sprint path stay under the upstream caps', () => {
    const mdFiles = walk('SKILL.md');
    const tmplFiles = walk('SKILL.md.tmpl');
    const mdBytes = mdFiles.reduce((sum, file) => sum + bytes(file), 0);
    const tmplBytes = tmplFiles.reduce((sum, file) => sum + bytes(file), 0);
    const sevenPaths = SEVEN;
    const contract = path.join(ROOT, 'CONTRACT.md');
    const sprintBytes = sevenPaths.reduce((sum, rel) => sum + bytes(path.join(ROOT, rel)), 0) + bytes(contract);

    const scratch = process.env.GSTACK_GOAL_SCRATCH;
    if (scratch) {
      fs.mkdirSync(scratch, { recursive: true });
      fs.writeFileSync(path.join(scratch, 'optimized.txt'), [
        `product SKILL.md files=${mdFiles.length} bytes=${mdBytes}`,
        `product SKILL.md.tmpl files=${tmplFiles.length} bytes=${tmplBytes}`,
        `sprint path bytes=${sprintBytes}`,
        `caps md=${Math.floor(PRODUCT_MD_BASELINE * 0.5)} tmpl=${Math.floor(TMPL_BASELINE * 0.5)} sprint=${Math.floor(CORE_SEVEN_BASELINE * 0.4)}`,
      ].join('\n') + '\n');
    }

    expect(mdBytes).toBeLessThanOrEqual(PRODUCT_MD_BASELINE * 0.5);
    expect(tmplBytes).toBeLessThanOrEqual(TMPL_BASELINE * 0.5);
    expect(sprintBytes).toBeLessThanOrEqual(CORE_SEVEN_BASELINE * 0.4);
  });
});

describe('frontier router gate', () => {
  test('v2 jobs and public commands resolve directly to a non-empty canonical skill', () => {
    const map = routerMap();
    expect(map.version).toBe(2);
    expect(map.core).toHaveLength(11);
    expect(Object.keys(map.jobs).sort()).toEqual(Object.keys(JOBS).sort());
    for (const [job, expected] of Object.entries(JOBS)) {
      expect(map.jobs[job], job).toBe(expected);
      const target = path.join(ROOT, map.commands[expected].skill, 'SKILL.md');
      expect(fs.statSync(target).size).toBeGreaterThan(0);
    }
    expect(Object.keys(map.commands).length).toBeGreaterThanOrEqual(map.core.length);
    for (const command of Object.keys(map.commands)) {
      const route = map.commands[command];
      expect(route, command).toBeTruthy();
      const file = route.skill === 'gstack' ? path.join(ROOT, 'SKILL.md') : path.join(ROOT, route.skill, 'SKILL.md');
      expect(fs.statSync(file).size).toBeGreaterThan(0);
    }
  });
});

describe('frontier dedup gate', () => {
  test('no 500-character normalized substring is shared by three product skills', () => {
    const texts = walk('SKILL.md.tmpl').map(file => ({
      file: path.relative(ROOT, file),
      text: norm(fs.readFileSync(file, 'utf-8').split('{{PREAMBLE}}').at(-1)!.split('{{SECTION_MANIFEST}}')[0]),
    }));
    const owners = new Map<string, Set<string>>();
    for (const { file, text } of texts) {
      if (text.length < 500) continue;
      const seen = new Set<string>();
      for (let i = 0; i <= text.length - 500; i++) {
        const slice = text.slice(i, i + 500);
        if (seen.has(slice)) continue;
        seen.add(slice);
        let bucket = owners.get(slice);
        if (!bucket) {
          bucket = new Set();
          owners.set(slice, bucket);
        }
        bucket.add(file);
      }
    }
    const hits = [...owners.entries()].filter(([, files]) => files.size >= 3);
    expect(hits.map(([, files]) => [...files].sort().join(','))).toEqual([]);
  });

  test('per-skill bodies omit Boil the Ocean and one-question pacing', () => {
    for (const file of walk('SKILL.md')) {
      const body = fs.readFileSync(file, 'utf-8');
      expect(body, file).not.toContain('Completeness Principle — Boil the Ocean');
      expect(body.toLowerCase(), file).not.toContain('one question per turn');
      expect(body.toLowerCase(), file).not.toContain('pace one question per turn');
    }
  });
});

describe('frontier overlay gate', () => {
  test('unmeasured target models add no speculative behavioral patch', () => {
    const opus48 = generateModelOverlay(overlayCtx('opus-4-8'));
    expect(opus48).toContain('one question per turn');
    for (const id of ['gpt-6-astra', 'opus-5.5'] as const) {
      const first = generateModelOverlay(overlayCtx(id));
      const second = generateModelOverlay(overlayCtx(id));
      expect(first).toBe(second);
      expect(first).toBe('');
      expect(readOverlay(id)).toBe('');
    }
  });
});

describe('frontier workflow gate', () => {
  test('sprint skill owns the ordered workflow and legacy file points to it', () => {
    const map = routerMap();
    expect(map.commands['/autoplan']).toEqual({ skill: 'plan', mode: 'review-all' });
    expect(map.commands['/sprint']).toEqual({ skill: 'sprint' });
    const workflow = fs.readFileSync(path.join(ROOT, 'sprint/SKILL.md'), 'utf-8');
    const stages = ['## 0. Scope', '## 1. Plan', '## 2. Build', '## 3. Prepare', '## 4. Verify', '## 5. Review', '## 6. Publish'];
    let cursor = -1;
    for (const stage of stages) {
      const at = workflow.indexOf(stage);
      expect(at).toBeGreaterThan(cursor);
      cursor = at;
    }
    expect(fs.readFileSync(path.join(ROOT, 'workflows/sprint.md'), 'utf-8')).toContain('sprint/SKILL.md');
  });
});

describe('frontier safety behavior', () => {
  test('ship, browse, and QA text keep the gates', () => {
    const ship = fs.readFileSync(path.join(ROOT, 'ship/SKILL.md'), 'utf-8');
    expect(ship).toContain('run required tests, build, generated-content freshness and credential scan');
    expect(ship).toContain('Run `/review` on the final diff');
    expect(ship).toContain('Unresolved blockers or missing required evidence stop publication');
    const verify = fs.readFileSync(path.join(ROOT, 'verify/SKILL.md'), 'utf-8');
    expect(verify).toContain('browser-report');
    expect(verify).toContain('Default: report findings and evidence without source edits');
    const contract = fs.readFileSync(path.join(ROOT, 'CONTRACT.md'), 'utf-8');
    expect(contract).toContain('rm -rf');
    expect(contract).toContain('$HOME');
    expect(contract.toLowerCase()).toContain('force-push');
    expect(contract.toLowerCase()).toContain('default branch');
  });

  test('careful guard asks on ordinary deletes and denies root delete and default-branch force-push', () => {
    const script = path.join(ROOT, 'careful/bin/check-careful.sh');
    const run = (command: string, cwd?: string) => {
      const result = spawnSync('bash', [script], {
        input: JSON.stringify({ tool_input: { command } }),
        encoding: 'utf-8',
        cwd,
        timeout: 30_000,
      });
      expect(result.status).toBe(0);
      return JSON.parse(result.stdout.trim());
    };
    expect(run('rm -rf /var/data').hookSpecificOutput.permissionDecision).toBe('ask');
    expect(run('rm -rf /').hookSpecificOutput.permissionDecision).toBe('deny');
    expect(run('rm -rf $HOME').hookSpecificOutput.permissionDecision).toBe('deny');

    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-frontier-careful-'));
    try {
      const git = (args: string[]) => gitArgvIn(repo, args);
      git(['init', '-q', '-b', 'main']);
      git(['commit', '--allow-empty', '-q', '-m', 'init']);
      git(['symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/main']);
      const denied = run('git push --force origin main', repo);
      expect(denied.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(denied.hookSpecificOutput.permissionDecisionReason).toContain('default branch');
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe('skill doc generation idempotency', () => {
  test('two clean renders match', async () => {
    const left = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-frontier-gen-a-'));
    const right = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-frontier-gen-b-'));
    try {
      const first = await runGeneration({ outputRoot: left, host: 'claude' });
      const second = await runGeneration({ outputRoot: right, host: 'claude' });
      expect(first.exitCode).toBe(0);
      expect(second.exitCode).toBe(0);
      const files = first.artifacts.map(artifact => artifact.relativePath).sort();
      expect(second.artifacts.map(artifact => artifact.relativePath).sort()).toEqual(files);
      for (const rel of files) {
        const a = fs.readFileSync(path.join(left, rel));
        const b = fs.readFileSync(path.join(right, rel));
        expect(Buffer.compare(a, b), rel).toBe(0);
      }
    } finally {
      fs.rmSync(left, { recursive: true, force: true });
      fs.rmSync(right, { recursive: true, force: true });
    }
  }, 120_000);
});
