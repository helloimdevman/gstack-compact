import * as fs from 'node:fs';
import * as path from 'node:path';

const SOURCE = path.resolve(import.meta.dir, '../..');

/** Partial CLI installs still need the launcher and its Node preload/evaluator. */
export function copyNodeRuntimeFixture(target: string): void {
  const root = fs.realpathSync(target);
  const source = fs.realpathSync(SOURCE);
  if (root === source || root.startsWith(source + path.sep)) throw new Error('Runtime fixture must be outside the checkout');
  for (const relative of ['bin/gstack-js', 'lib/node-runtime.mjs', 'lib/node-eval.mjs']) {
    const dest = path.join(root, relative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!fs.realpathSync(path.dirname(dest)).startsWith(root + path.sep)) throw new Error('Runtime fixture link escapes its temporary root');
    if (fs.lstatSync(dest, { throwIfNoEntry: false })?.isSymbolicLink()) throw new Error('Runtime fixture cannot overwrite a linked file');
    fs.copyFileSync(path.join(SOURCE, relative), dest);
  }
}
