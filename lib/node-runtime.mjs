// Execute repository TypeScript with Node's built-in transformer; no compiler install.
import * as module from 'node:module';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 24 || (major === 24 && minor < 2)) {
  throw new Error('gstack requires Node.js 24.2 or newer');
}
const root = new URL('../', import.meta.url).href;
// Node 24.2 does not mark a native .ts entry outside a module package as main.
const entry = process.argv[1] ? pathToFileURL(realpathSync(process.argv[1])).href : undefined;
const isFile = url => { try { return statSync(fileURLToPath(url)).isFile(); } catch { return false; } };
module.registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === new URL('./node-eval.mjs', import.meta.url).href && specifier.startsWith('.')) {
      specifier = pathToFileURL(process.cwd() + '/' + specifier).href;
    }
    try { return nextResolve(specifier, context); }
    catch (error) {
      if (error.code !== 'ERR_MODULE_NOT_FOUND' && error.code !== 'ERR_UNSUPPORTED_DIR_IMPORT') throw error;
      if (!specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.startsWith('file:')) throw error;
      const url = specifier.startsWith('/') ? pathToFileURL(specifier).href : new URL(specifier, context.parentURL).href;
      if (url.startsWith(root) && !url.includes('/node_modules/')) {
        for (const candidate of [url + '.ts', url + '/index.ts']) {
          if (isFile(candidate)) return nextResolve(candidate, context);
        }
      }
      throw error;
    }
  },
  load(url, context, nextLoad) {
    if (url === entry || (url.startsWith(root) && !url.includes('/node_modules/'))) {
      const ext = extname(fileURLToPath(url));
      if (ext === '.ts' || ext === '') {
        const source = readFileSync(fileURLToPath(url), 'utf8');
        return { format: 'module', shortCircuit: true,
          source: module.stripTypeScriptTypes(source, { mode: 'strip', sourceUrl: url }) };
      }
    }
    return nextLoad(url, context);
  },
});
