// Existing inline helpers mix require() with top-level await.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
const [source, ...args] = process.argv.slice(2);
if (source === undefined) throw new Error('gstack-js -e requires JavaScript');
process.argv = [process.execPath, ...args];
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
let stdin;
try {
  await new AsyncFunction('require', 'readStdin', source)(createRequire(resolve('gstack-eval.cjs')), () => stdin ??= readFileSync(0, 'utf8'));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
