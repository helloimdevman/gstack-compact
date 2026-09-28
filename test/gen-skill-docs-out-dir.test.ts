import { describe, test, expect } from 'bun:test';
import { spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

const ROOT = path.resolve(import.meta.dir, '..');

describe('gen-skill-docs --out-dir (B2 render isolation)', () => {
  function porcelain(): string {
    const r = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf-8', timeout: 30_000 });
    return r.status === 0 ? r.stdout : '';
  }

  // #2692: the swap-in callers render
  // into claude.tmp.<pid> then RENAME it into place — so section refs must be
  // rewritten to the FINAL serving dir (--link-root), never the tmp out-dir,
  // or every rendered Read dies the moment the swap completes.
  test('--link-root repoints section refs at the FINAL dir, not the tmp out-dir (#2692)', () => {
    const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-home-'));
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-swap-'));
    // Mirror the real caller shape, including a `$`-bearing path segment so a
    // replacement-string regression ($& expansion) fails loudly.
    const finalDir = path.join(base, 'render$live', 'claude');
    const outDir = `${finalDir}.tmp.12345`;
    fs.mkdirSync(path.dirname(finalDir), { recursive: true });
    try {
      const res = spawnSync(
        'bun',
        ['run', 'scripts/gen-skill-docs.ts', '--host', 'claude',
         '--out-dir', outDir, '--link-root', finalDir],
        { cwd: ROOT, encoding: 'utf-8', timeout: 120_000, env: { ...process.env, GSTACK_HOME: tmpHome } },
      );
      expect(res.status).toBe(0);
      const skillContent = fs.readFileSync(path.join(outDir, 'ship', 'SKILL.md'), 'utf-8');
      // Files land in the tmp out-dir; their CONTENT references the final dir.
      expect(skillContent).toContain(`${finalDir}/ship/sections/`);
      expect(skillContent).not.toContain(`${outDir}/ship/sections/`);
      expect(skillContent).not.toContain('~/.claude/skills/gstack/ship/sections/');
    } finally {
      fs.rmSync(tmpHome, { recursive: true, force: true });
      fs.rmSync(base, { recursive: true, force: true });
    }
  });

  test('both swap-in callers pass --link-root with the final render dir (#2692 wiring)', () => {
    const setupSrc = fs.readFileSync(path.join(ROOT, 'setup'), 'utf-8');
    const configSrc = fs.readFileSync(path.join(ROOT, 'bin', 'gstack-config'), 'utf-8');
    expect(setupSrc).toContain('--out-dir "$_GSTACK_RENDER_TMP" --link-root "$_GSTACK_RENDER_DIR"');
    expect(configSrc).toContain('--out-dir "$RENDER_TMP" --link-root "$RENDER_DIR"');
  });

  test('retired global extras (proactive-suggestions.json) are not written anywhere', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-out-'));
    try {
      const res = spawnSync(
        'bun',
        ['run', 'scripts/gen-skill-docs.ts', '--host', 'claude', '--out-dir', outDir],
        { cwd: ROOT, encoding: 'utf-8', timeout: 120_000 },
      );
      expect(res.status).toBe(0);
      // The proactive-suggestions registry was removed (never had a consumer).
      // A gen run must not resurrect it in the out-dir or at the repo path.
      expect(fs.existsSync(path.join(outDir, 'scripts', 'proactive-suggestions.json'))).toBe(false);
      expect(fs.existsSync(path.join(ROOT, 'scripts', 'proactive-suggestions.json'))).toBe(false);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  // ── External-host out-dir cases ─────────────────────────────
  // The former tree-mutating tests read codex/factory artifacts from out-dir
  // renders. That is only sound if an out-dir external render is (a) clean —
  // zero tracked-tree dirt — and (b) byte-identical to what the in-place
  // render would have produced. Both halves are pinned here.

  test('--host codex --out-dir adds no tracked dirt and is byte-identical to the in-place render', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-out-codex-'));
    const inPlaceShip = path.join(ROOT, '.agents', 'skills', 'gstack-ship', 'SKILL.md');
    // Compared before/after rather than asserting empty, so a dev's own
    // unrelated dirty files can't false-fail the suite (#2569 pattern).
    const beforePorcelain = porcelain();
    try {
      // 1) Fresh IN-PLACE codex render — the existing behavior: it writes
      //    only the gitignored .agents/ tree (itself invisible to porcelain).
      const inPlace = spawnSync(
        'bun',
        ['run', 'scripts/gen-skill-docs.ts', '--host', 'codex'],
        { cwd: ROOT, encoding: 'utf-8', timeout: 120_000 },
      );
      expect(inPlace.status).toBe(0);
      expect(porcelain()).toBe(beforePorcelain);
      const inPlaceBytes = fs.readFileSync(inPlaceShip);

      // 2) Out-dir render: zero new dirt, same bytes.
      const res = spawnSync(
        'bun',
        ['run', 'scripts/gen-skill-docs.ts', '--host', 'codex', '--out-dir', outDir],
        { cwd: ROOT, encoding: 'utf-8', timeout: 120_000 },
      );
      expect(res.status).toBe(0);
      expect(porcelain()).toBe(beforePorcelain);

      const outShip = path.join(outDir, '.agents', 'skills', 'gstack-ship', 'SKILL.md');
      expect(fs.existsSync(outShip)).toBe(true);
      expect(fs.readFileSync(outShip).equals(inPlaceBytes)).toBe(true);

      // Codex metadata (agents/openai.yaml) mirrors into the out-dir too.
      expect(fs.existsSync(path.join(outDir, '.agents', 'skills', 'gstack-ship', 'agents', 'openai.yaml'))).toBe(true);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  }, 120_000);

  test('--host all --out-dir renders every host tree into the out-dir; tracked tree stays clean', () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-out-all-'));
    const beforePorcelain = porcelain();
    try {
      const res = spawnSync(
        'bun',
        ['run', 'scripts/gen-skill-docs.ts', '--host', 'all', '--out-dir', outDir],
        { cwd: ROOT, encoding: 'utf-8', timeout: 300_000 },
      );
      expect(res.status).toBe(0);
      // Zero new dirt in the source checkout.
      expect(porcelain()).toBe(beforePorcelain);

      // Claude host + external hosts + openclaw docs + llms.txt all landed in the out-dir.
      for (const rel of [
        'ship/SKILL.md',
        '.agents/skills/gstack-ship/SKILL.md',
        '.factory/skills/gstack-ship/SKILL.md',
        'gstack/llms.txt',
        'openclaw/gstack-lite-CLAUDE.md',
      ]) {
        expect({ file: rel, exists: fs.existsSync(path.join(outDir, rel)) })
          .toEqual({ file: rel, exists: true });
      }
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  }, 300_000);
});
