import { expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('print HTML is created with an offline CSP and does not overwrite an existing file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gstack-print-html-'));
  try {
    const input = join(dir, 'note.md');
    const output = join(dir, 'note.html');
    writeFileSync(input, '# Note\n\nHello.');
    const cmd = ['bun', 'run', join(import.meta.dir, '../src/html.ts'), input, output];
    const first = Bun.spawnSync(cmd, { timeout: 10_000 });
    expect(first.exitCode).toBe(0);
    const html = readFileSync(output, 'utf8');
    expect(html).toContain('Content-Security-Policy');
    expect(html).toContain("default-src 'none'");
    expect(html).toContain('<h1');
    const second = Bun.spawnSync(cmd, { timeout: 10_000 });
    expect(second.exitCode).not.toBe(0);
    expect(readFileSync(output, 'utf8')).toBe(html);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
