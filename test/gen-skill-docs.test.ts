import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');

test('generation uses the host-provided user browser and omits removed commands', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-generated-skills-'));
  try {
    const result = Bun.spawnSync(['bun', 'run', 'scripts/gen-skill-docs.ts', '--host', 'claude', '--out-dir', out], {
      cwd: ROOT, stdout: 'pipe', stderr: 'pipe', timeout: 30_000,
    });
    expect(result.exitCode).toBe(0);
    const browse = fs.readFileSync(path.join(out, 'browse/SKILL.md'), 'utf8');
    expect(browse).toContain('browser capability supplied by the current agent host');
    expect(browse).not.toContain('Aside');
    expect(browse).not.toContain('$B ');
    for (const removed of ['cso', 'pair-agent', 'setup-gbrain', 'sync-gbrain', 'codex', 'claude-code', 'benchmark-models', 'open-gstack-browser', 'setup-browser-cookies']) {
      expect(fs.existsSync(path.join(out, removed, 'SKILL.md'))).toBe(false);
    }
  } finally {
    fs.rmSync(out, { recursive: true });
  }
});
