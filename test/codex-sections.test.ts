import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { runGeneration } from '../scripts/gen-skill-docs';
import { getHostConfig } from '../hosts';

const ROOT = path.resolve(import.meta.dir, '..');

test('Claude and Codex install referenced sections beside each entry', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-sections-'));
  try {
    expect(getHostConfig('claude').generation.sectionMode).toBe('files');
    expect(getHostConfig('codex').generation.sectionMode).toBe('files');
    for (const host of ['claude', 'codex'] as const) {
      const outputRoot = path.join(temp, host);
      const result = await runGeneration({ host, outputRoot, contentLinkRoot: outputRoot });
      expect(result.exitCode, JSON.stringify(result.diagnostics)).toBe(0);
      for (const skill of ['review', 'verify', 'ship']) {
        const dir = host === 'claude' ? path.join(outputRoot, skill)
          : path.join(outputRoot, '.agents/skills', `gstack-${skill}`);
        const entry = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
        const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, skill, 'sections/manifest.json'), 'utf8'));
        for (const section of manifest.sections) {
          const relative = `sections/${section.file}`;
          expect(entry, `${host}/${skill} references ${relative}`).toContain(relative);
          const body = fs.readFileSync(path.join(dir, relative), 'utf8');
          expect(body.length).toBeGreaterThan(100);
          expect(entry).not.toContain(body.slice(100, 220));
        }
        expect(entry).not.toContain('Do not read `/' + skill + '` sections/ unless');
      }
      const ship = host === 'claude' ? path.join(outputRoot, 'ship/SKILL.md')
        : path.join(outputRoot, '.agents/skills/gstack-ship/SKILL.md');
      expect(fs.statSync(ship).size).toBeLessThan(160_000);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('other hosts retain inline sections', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-sections-inline-'));
  try {
    const result = await runGeneration({ host: 'factory', outputRoot: temp });
    expect(result.exitCode, JSON.stringify(result.diagnostics)).toBe(0);
    const dir = path.join(temp, '.factory/skills/gstack-ship');
    expect(fs.existsSync(path.join(dir, 'sections'))).toBe(false);
    expect(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8')).toContain('CHANGELOG');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
