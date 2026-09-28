import { expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');

test('runtime-only builds portable source bundles with working daemon spawn, attach and stop', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack 번들 '));
  const state = path.join(root, 'state.json');
  const env = {
    ...process.env, HOME: root, USERPROFILE: root, BUN_CMD: process.execPath,
    PATH: path.join(root, 'shims') + path.delimiter + process.env.PATH,
    DESIGN_DAEMON_STATE_FILE: state, DESIGN_DAEMON_VERSION: '',
    DESIGN_DAEMON_IDLE_MS: '3000', DESIGN_DAEMON_CHECK_MS: '100',
  };
  const run = (args: string[]) => spawnSync(process.execPath, ['run', ...args], {
    cwd: root, env, encoding: 'utf8', timeout: 20_000,
  });
  const cli = (...args: string[]) => run(['design/dist/design', ...args]);
  try {
    for (const file of [
      'scripts/build.sh', 'scripts/write-version-files.sh', 'package.json', 'VERSION',
      'design/src', 'make-pdf/src', 'bin/gstack-global-discover.ts',
      ...['design-catalog', 'design-md', 'design-detect-contract', 'fs-atomic', 'egress-receipt'].map(name => `lib/${name}.ts`),
    ]) {
      const dest = path.join(root, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.cpSync(path.join(ROOT, file), dest, { recursive: true });
    }
    // Copy the sole renderer dependency; never write through a live registration.
    fs.cpSync(path.dirname(require.resolve('marked/package.json')), path.join(root, 'node_modules/marked'), { recursive: true });
    fs.mkdirSync(path.join(root, 'shims'));
    for (const opener of ['open', 'xdg-open']) {
      fs.writeFileSync(path.join(root, 'shims', opener), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    }
    fs.mkdirSync(path.join(root, 'design/dist'), { recursive: true });
    for (const file of ['design/dist/design.exe', 'bin/gstack-global-discover.exe']) {
      fs.writeFileSync(path.join(root, file), 'obsolete executable');
    }
    const built = spawnSync('bash', ['scripts/build.sh', '--runtime-only'], {
      cwd: root, env, encoding: 'utf8', timeout: 30_000,
    });
    expect(built.status, built.stderr).toBe(0);
    expect(fs.existsSync(path.join(root, '.agents'))).toBe(false);
    expect(fs.readFileSync(path.join(root, 'design/dist/.build-complete'), 'utf8')).toBe('bun-source-v1\n');
    for (const file of ['design/dist/design', 'bin/gstack-global-discover']) {
      expect(fs.readFileSync(path.join(root, file), 'utf8')).toStartWith('#!/usr/bin/env bun\n');
      expect(fs.statSync(path.join(root, file)).size).toBeLessThan(1_000_000);
      expect(fs.existsSync(path.join(root, `${file}.exe`))).toBe(false);
    }
    const help = cli();
    expect(help.status, help.stderr).toBe(0);
    expect(cli('nonexistent-command').status).toBe(1);
    expect(run(['bin/gstack-global-discover', '--help']).status).toBe(0);
    expect(run(['bin/gstack-global-discover', '--format', 'invalid']).status).toBe(1);
    if (process.platform !== 'win32') {
      const direct = spawnSync(path.join(root, 'design/dist/design'), [], { cwd: root, env, timeout: 10_000 });
      expect(direct.status).toBe(0);
    }
    // No source tree or dependencies at runtime: daemon must come from dist.
    fs.rmSync(path.join(root, 'design/src'), { recursive: true });
    fs.rmSync(path.join(root, 'node_modules'), { recursive: true });
    fs.writeFileSync(path.join(root, 'design/dist/.version'), 'bundle-version\n');
    fs.writeFileSync(path.join(root, 'board.html'), '<html><body>bundle board</body></html>');
    const started = cli('serve', '--html', path.join(root, 'board.html'));
    expect(started.status, started.stderr).toBe(0);
    expect(started.stderr).toContain('DAEMON_STARTED');
    const running = JSON.parse(cli('daemon', 'status').stdout);
    expect(running.running).toBe(true);
    expect(running.version).toBe('bundle-version');
    expect(running.activeBoards).toBe(1);
    const attached = cli('serve', '--html', path.join(root, 'board.html'));
    expect(attached.status, attached.stderr).toBe(0);
    expect(attached.stderr).toContain('DAEMON_ATTACHED');
    expect(cli('daemon', 'stop').status).toBe(1); // Active-board protection survives bundling.
    const stopped = cli('daemon', 'stop', '--force');
    expect(stopped.status, stopped.stderr).toBe(0);
    expect(JSON.parse(cli('daemon', 'status').stdout).running).toBe(false);
    fs.writeFileSync(path.join(root, 'input.md'), '# Bundle smoke\n');
    const rendered = run(['lib/gstack-markdown-html.js', 'input.md', 'output.html']);
    expect(rendered.status, rendered.stderr).toBe(0);
    expect(fs.readFileSync(path.join(root, 'output.html'), 'utf8')).toContain('Bundle smoke');
  } finally {
    if (fs.existsSync(state)) cli('daemon', 'stop', '--force');
    fs.rmSync(root, { recursive: true, force: true });
  }
}, 60_000);
