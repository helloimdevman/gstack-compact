import { describe, test, expect } from 'bun:test';
import { runBashScript } from './helpers/bash-script';
import { spawnSync } from 'node:child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const ROOT = path.resolve(import.meta.dir, '..');
const SETUP_SRC = fs.readFileSync(path.join(ROOT, 'setup'), 'utf-8');

// Run a bash snippet, return {stdout, stderr, status}.
function runBash(script: string): { stdout: string; stderr: string; status: number } {
  const r = runBashScript(script, { timeout: 30_000 });
  return { stdout: r.stdout || '', stderr: r.stderr || '', status: r.status ?? -1 };
}

describe('setup: gen:skill-docs:user exit-code propagation (pipe-masking fix)', () => {
  // The bug: `cmd 2>&1 | tail -3` makes the subshell exit status `tail`'s,
  // so `(...) || log "warning"` never fires when `cmd` fails. The fix removes
  // the pipe. These tests RUN the pattern (not grep source) to prove the
  // exit-code semantics actually change.

  test('without pipe: failing js_cmd triggers the || warning clause', () => {
    const r = runBash(`
      set +e
      js_cmd() { return 1; }      # stub: gen:skill-docs:user failed
      log() { echo "LOG:$*"; }
      (
        cd /tmp
        js_cmd run gen:skill-docs:user --host claude
      ) || log "  warning: gen:skill-docs:user failed"
    `);
    expect(r.stdout).toContain('LOG:  warning: gen:skill-docs:user failed');
  });

  test('with pipe (the bug shape): failing js_cmd does NOT trigger the warning', () => {
    const r = runBash(`
      set +e
      js_cmd() { return 1; }      # stub: gen:skill-docs:user failed
      log() { echo "LOG:$*"; }
      (
        cd /tmp
        js_cmd run gen:skill-docs:user --host claude 2>&1 | tail -3
      ) || log "  warning: gen:skill-docs:user failed"
    `);
    expect(r.stdout).not.toContain('LOG:  warning');
  });


});

describe('setup: js_cmd routing in link_*_skill_dirs (Windows non-ASCII path fix)', () => {
  test('the actual Node launcher honors a quoted executable path and literal argv', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-nodecmd-'));
    try {
      const marker = path.join(tmp, 'args');
      const sentinel = path.join(tmp, 'node with spaces');
      fs.writeFileSync(sentinel, '#!/bin/sh\nprintf "%s\\n" "$@" > "$TRACE"\n', { mode: 0o755 });
      const literal = 'literal $(not-a-command)';
      const result = spawnSync('bash', [path.join(ROOT, 'bin/gstack-js'), '-e', 'await Promise.resolve()', literal], {
        env: { ...process.env, GSTACK_NODE_BIN: sentinel, TRACE: marker }, encoding: 'utf8', timeout: 10_000,
      });
      expect(result.status, result.stderr).toBe(0);
      const args = fs.readFileSync(marker, 'utf8').trim().split('\n');
      expect(path.resolve(args[args.indexOf('--import') + 1])).toBe(path.join(ROOT, 'lib/node-runtime.mjs'));
      expect(args.slice(-2)).toEqual(['await Promise.resolve()', literal]);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });

  test('setup: the three link_*_skill_dirs helpers all use js_cmd, not literal bun', () => {
    // Extract each helper body and check the gen:skill-docs invocation
    // inside it. Source-anchored (not line-number) and not a global grep,
    // so we only assert about the actual code path the bug fix touches.
    for (const fn of [
      'link_codex_skill_dirs',
      'link_factory_skill_dirs',
      'link_opencode_skill_dirs',
    ]) {
      const start = SETUP_SRC.indexOf(`${fn}() {`);
      expect(start).toBeGreaterThan(-1);
      const end = SETUP_SRC.indexOf('\n}\n', start);
      expect(end).toBeGreaterThan(start);
      const body = SETUP_SRC.slice(start, end);
      // Must call through the wrapper.
      expect(body).toMatch(/js_cmd run gen:skill-docs/);
      // Bug shape: a literal `bun run gen:skill-docs` in executable position
      // (skipping any comment / warning-string mentions that aren't being run).
      const lines = body.split('\n').filter((l) => {
        const t = l.trim();
        if (!t || t.startsWith('#')) return false;
        // Strings inside echo/warning messages don't execute bun.
        if (/echo\s+['"]/.test(t)) return false;
        return true;
      });
      for (const l of lines) {
        // `js_cmd run ...` is fine; a bare `bun run ...` is the bug.
        const stripped = l.replace(/js_cmd run/g, '');
        expect(stripped).not.toMatch(/\bbun run gen:skill-docs/);
      }
    }
  });
});
