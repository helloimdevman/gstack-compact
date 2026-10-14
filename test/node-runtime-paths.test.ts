import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

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
