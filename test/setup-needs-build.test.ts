import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { runBashScript } from './helpers/bash-script';

const setup = fs.readFileSync(new URL('../setup', import.meta.url), 'utf8');
const start = setup.indexOf('BUILD_STAMP=');
const end = setup.indexOf('\nif [ "$NEEDS_BUILD" -eq 1 ]; then', start);
if (start < 0 || end < 0) throw new Error('setup build decision block missing');
const decision = setup.slice(start, end);

function write(file: string, time: Date, executable = false) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, file.endsWith('.build-complete') ? 'bun-source-v1\n' : 'fixture');
  fs.chmodSync(file, executable ? 0o755 : 0o644);
  fs.utimesSync(file, time, time);
}

test('setup rebuilds when a local tool is missing or a source is newer', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-build-decision-'));
  try {
    const old = new Date('2024-01-01T00:00:00Z');
    const stamp = new Date('2024-06-01T00:00:00Z');
    const newer = new Date('2024-12-01T00:00:00Z');
    for (const file of ['design/src/index.ts', 'bin/gstack-global-discover.ts', 'make-pdf/src/html.ts', 'lib/design-catalog.ts', 'package.json', 'bun.lock', 'scripts/build.sh']) write(path.join(root, file), old);
    for (const file of ['design/dist/design', 'bin/gstack-global-discover']) write(path.join(root, file), old, true);
    write(path.join(root, 'lib/gstack-markdown-html.js'), old);
    write(path.join(root, 'design/dist/daemon.ts'), old);
    write(path.join(root, 'design/dist/.build-complete'), stamp);
    const decide = () => {
      const result = runBashScript(`SOURCE_GSTACK_DIR="${root}"; IS_WINDOWS=0; ${decision}; echo "$NEEDS_BUILD"`, { timeout: 10_000 });
      expect(result.status).toBe(0);
      return result.stdout.trim();
    };
    expect(decide()).toBe('0');
    fs.writeFileSync(path.join(root, 'design/dist/.build-complete'), 'complete\n');
    expect(decide()).toBe('1');
    write(path.join(root, 'design/dist/.build-complete'), stamp);
    fs.unlinkSync(path.join(root, 'design/dist/daemon.ts'));
    expect(decide()).toBe('1');
    write(path.join(root, 'design/dist/daemon.ts'), old);
    fs.unlinkSync(path.join(root, 'design/dist/design'));
    expect(decide()).toBe('1');
    write(path.join(root, 'design/dist/design'), old, true);
    write(path.join(root, 'bin/gstack-global-discover.ts'), newer);
    expect(decide()).toBe('1');
    write(path.join(root, 'bin/gstack-global-discover.ts'), old);
    write(path.join(root, 'lib/design-catalog.ts'), newer);
    expect(decide()).toBe('1');
  } finally {
    fs.rmSync(root, { recursive: true });
  }
});
