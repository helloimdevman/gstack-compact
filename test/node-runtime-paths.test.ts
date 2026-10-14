import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { copyNodeRuntimeFixture } from './helpers/node-runtime-fixture';

test('actual launcher encodes its preload path and preserves inline and entry arguments', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'node-launch # %-'));
  try {
    copyNodeRuntimeFixture(directory);
    const node = Bun.which(process.env.GSTACK_NODE_BIN ?? 'node');
    const bash = Bun.which('bash');
    if (!node || !bash) throw new Error('Node.js and Bash are required for launcher regressions');
    const source = 'console.log(JSON.stringify([JSON.parse(require("node:fs").readFileSync(0,"utf8")),process.argv[1]]))';
    const entry = path.join(directory, 'entry # %.ts');
    fs.writeFileSync(entry, 'const value: string = process.argv[2]; console.log(value);\n');
    for (const args of [['-e', source, 'literal $(not-a-command)'], ['run', entry, 'entry value']]) {
      const child = spawnSync(bash, [path.join(directory, 'bin/gstack-js'), ...args], {
        cwd: directory, env: { ...process.env, GSTACK_NODE_BIN: node }, input: '{"value":3}',
        encoding: 'utf8', timeout: 5_000,
      });
      expect(child.status, child.stderr).toBe(0);
      if (args[0] === '-e') expect(JSON.parse(child.stdout)).toEqual([{ value: 3 }, 'literal $(not-a-command)']);
      else expect(child.stdout.trim()).toBe('entry value');
    }
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test('Node runtime imports native absolute paths with spaces and URL punctuation', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'node-native-path-'));
  const module = path.join(directory, 'fixture # %.mjs');
  fs.writeFileSync(module, 'export const value = 42;\n');
  try {
    const node = Bun.which(process.env.GSTACK_NODE_BIN ?? 'node');
    if (!node) throw new Error('Node.js is required for runtime regressions');
    const preload = pathToFileURL(path.resolve(import.meta.dir, '../lib/node-runtime.mjs')).href;
    const child = spawnSync(node, ['--import', preload, '--input-type=module', '-e',
      `const { value } = await import(${JSON.stringify(module)}); const fs = await import('node:fs'); const data = await import('data:text/javascript,export default 7'); console.log(JSON.stringify([value, typeof fs.statSync, data.default]));`,
    ], { cwd: directory, encoding: 'utf8', timeout: 5_000 });
    expect(child.status, child.stderr).toBe(0);
    expect(JSON.parse(child.stdout)).toEqual([42, 'function', 7]);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
