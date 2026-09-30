import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dir, '..');

test.skipIf(process.platform === 'win32')('setup installs source CLIs without Bun or build artifacts', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-node-setup-'));
  const source = path.join(temp, 'checkout');
  const home = path.join(temp, 'home');
  const bin = path.join(temp, 'bin');
  try {
    fs.cpSync(ROOT, source, { recursive: true, filter: file => {
      const parts = path.relative(ROOT, file).split(path.sep);
      return parts.join('/') !== 'bin/gstack-global-discover'
        && !parts.some(part => part.startsWith('.') || ['node_modules', 'test', 'dist', 'docs'].includes(part));
    } });
    fs.mkdirSync(bin); fs.mkdirSync(home);
    const node = Bun.which(process.env.GSTACK_NODE_BIN ?? 'node');
    if (!node) throw new Error('Node.js is required for the installation regression');
    fs.symlinkSync(node, path.join(bin, 'node'));
    // Keep this free check offline: the registry install is stubbed and its
    // exact contract asserted; copy the already locked production packages.
    for (const name of ['marked', 'yaml', 'semver', 'smol-toml']) {
      fs.cpSync(path.join(ROOT, 'node_modules', name), path.join(source, 'node_modules', name), { recursive: true });
    }
    fs.writeFileSync(path.join(bin, 'npm'), '#!/bin/sh\nprintf "%s\\n" "$@" > "$GSTACK_NPM_TRACE"\n', { mode: 0o755 });
    const trace = path.join(temp, 'npm-args');
    const env = { ...process.env, PATH: `${bin}:/usr/bin:/bin`, HOME: home, USERPROFILE: home,
      CODEX_HOME: path.join(home, '.codex'), CLAUDE_CONFIG_DIR: path.join(home, '.claude'),
      GSTACK_HOME: path.join(home, '.gstack'), GSTACK_STATE_ROOT: path.join(home, '.gstack'),
      GSTACK_NODE_BIN: 'node', GSTACK_NPM_TRACE: trace };
    const run = (args: string[]) => spawnSync('bash', ['setup', ...args], {
      cwd: source, env, encoding: 'utf8', timeout: 30_000,
    });
    const noBun = spawnSync('bash', ['-c', 'command -v bun'], { env, encoding: 'utf8', timeout: 5_000 });
    expect(noBun.status).not.toBe(0);
    for (const host of ['claude', 'codex']) {
      const installed = run(['--host', host, '--skill-profile', 'core', '--no-plan-tune-hooks']);
      expect(installed.status, installed.stderr).toBe(0);
      expect(fs.readFileSync(trace, 'utf8').trim().split('\n')).toEqual(['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund']);
      const skills = path.join(home, host === 'codex' ? '.codex/skills' : '.claude/skills');
      expect(fs.readdirSync(skills)).toHaveLength(11);
      expect(fs.existsSync(path.join(skills, 'gstack/design/design'))).toBe(true);
      expect(fs.existsSync(path.join(skills, 'gstack/bin/gstack-markdown-html'))).toBe(true);
    }
    expect(fs.existsSync(path.join(source, 'design/dist'))).toBe(false);
    expect(fs.existsSync(path.join(source, 'bin/gstack-global-discover'))).toBe(false);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}, 60_000);
