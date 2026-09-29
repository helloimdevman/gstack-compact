import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ALL_HOST_CONFIGS } from '../hosts';
import { discoverTemplates } from '../scripts/discover-skills';

const ROOT = resolve(import.meta.dir, '..');
let output: string;

function rendered(host: (typeof ALL_HOST_CONFIGS)[number], skill: string): string {
  const dir = host.name === 'claude' ? join(output, skill)
    : join(output, host.hostSubdir, 'skills', `gstack-${skill}`);
  const sections = join(dir, 'sections');
  return readFileSync(join(dir, 'SKILL.md'), 'utf8') + (existsSync(sections)
    ? readdirSync(sections).filter(f => f.endsWith('.md')).sort()
      .map(f => '\n' + readFileSync(join(sections, f), 'utf8')).join('') : '');
}

describe('shared-code skill distribution', () => {
  beforeAll(() => {
    output = mkdtempSync(join(tmpdir(), 'gstack-shared-libs-render-'));
    const result = spawnSync('bun', ['run', 'scripts/gen-skill-docs.ts', '--host', 'all', '--out-dir', output],
      { cwd: ROOT, encoding: 'utf8', timeout: 120_000 });
    expect(result.status, result.stderr).toBe(0);
  }, 120_000);
  afterAll(() => { if (output) rmSync(output, { recursive: true, force: true }); });

  test('authored compatibility command remains discoverable', () => {
    expect(discoverTemplates(ROOT)).toContainEqual({
      tmpl: 'deslop-shared-libs/SKILL.md.tmpl', output: 'deslop-shared-libs/SKILL.md',
    });
    expect(readFileSync(join(output, 'gstack/llms.txt'), 'utf8')).toContain('deslop-shared-libs');
  });

  for (const host of ALL_HOST_CONFIGS) {
    test(`${host.name}: advice routes to the current review section`, () => {
      const alias = rendered(host, 'deslop-shared-libs');
      const review = rendered(host, 'review');
      expect(alias).toContain('Recommendations only');
      expect(alias).toContain('shared-libs');
      expect(review).toContain('# Shared-library advice');
      expect(review).toContain('evidence_paths');
      expect(review).toContain('helper_target');
      expect(review).toContain('Do not edit code in this mode');
    });
  }
});
