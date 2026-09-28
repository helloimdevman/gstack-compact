import { test, expect } from 'bun:test';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { discoverTemplates } from '../scripts/discover-skills';
import * as router from '../scripts/resolvers/router-map';
import { runGeneration } from '../scripts/gen-skill-docs';

const root = join(import.meta.dir, '..');
const ids = new Set(discoverTemplates(root).map(t => t.tmpl === 'SKILL.md.tmpl' ? 'gstack' : t.tmpl.split('/')[0]));
const map = JSON.parse(readFileSync(join(root, 'gstack/router-map.json'), 'utf8'));

test('v2 map covers every discovered command and validates direct canonical routes', () => {
  const validate = (router as any).validateRouterMap;
  expect(typeof validate).toBe('function');
  expect(validate(map, ids)).toEqual([]);
  expect(map.core).toHaveLength(11);
  expect(map.commands['/autoplan']).toEqual({ skill: 'plan', mode: 'review-all' });
  expect(map.commands['/qa-only']).toEqual({ skill: 'verify', mode: 'browser-report' });
  expect(map.commands['/sprint']).toEqual({ skill: 'sprint' });
  const core = JSON.parse(router.generateRouterMap({ skillProfile: 'core' } as any).replace(/^```json\n|\n```$/g, ''));
  expect(core.commands['/cso']).toBeUndefined();
  expect(core.unavailableCommands).toContain('/cso');
  expect(core.unavailableJobs['security-audit']).toBe('/cso');
});

test('v2 map rejects missing targets, invalid modes, aliases, and duplicate core ids', () => {
  const validate = (router as any).validateRouterMap;
  const bad = structuredClone(map);
  bad.core.push('plan');
  bad.commands['/autoplan'] = { skill: 'office-hours', mode: 'review-all' };
  bad.commands['/qa-only'] = { skill: 'verify', mode: 'nonexistent' };
  bad.jobs.sprint = '/missing';
  bad.commands['/escape'] = { skill: '../escape' };
  const errors: string[] = validate(bad, ids);
  expect(errors.join(' ')).toContain('duplicate core');
  expect(errors.join(' ')).toContain('alias chain');
  expect(errors.join(' ')).toContain('unknown mode');
  expect(errors.join(' ')).toContain('missing job');
  expect(errors.join(' ')).toContain('invalid skill');
});

test('core render exposes only eleven entrypoints with needed sections', async () => {
  const temp = mkdtempSync(join(tmpdir(), 'gstack-core-render-'));
  try {
    for (const host of ['claude', 'codex'] as const) {
      const outputRoot = join(temp, host);
      const result = await runGeneration({ host, skillProfile: 'core', outputRoot, contentLinkRoot: outputRoot });
      expect(result.exitCode, JSON.stringify(result.diagnostics)).toBe(0);
      const skills = result.artifacts.filter(a => a.kind === 'skill' && a.host === host);
      expect(skills).toHaveLength(11);
      expect(skills.some(a => a.relativePath.includes('autoplan/SKILL.md'))).toBe(false);
      expect(skills.some(a => a.relativePath.includes('gstack-autoplan/SKILL.md'))).toBe(false);
      expect(result.artifacts.some(a => a.kind === 'section' && a.relativePath.includes('plan/sections'))).toBe(true);
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
