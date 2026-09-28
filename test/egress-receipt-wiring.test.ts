import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');
const read = (file: string) => fs.readFileSync(path.join(ROOT, file), 'utf8');

test('remaining network sinks write egress receipts', () => {
  expect(read('bin/gstack-update-check')).toContain('_receipted_curl open update-check');
  expect(read('bin/gstack-update-check')).toContain('_receipted_git open update-check');
  expect(read('bin/gstack-session-update')).toContain('_receipted_git open session-update');
  expect(read('design/src/receipted-fetch.ts')).toContain('writeReceipt({');
  for (const file of fs.readdirSync(path.join(ROOT, 'design/src')).filter(name => name.endsWith('.ts') && name !== 'receipted-fetch.ts')) {
    const source = read(`design/src/${file}`);
    if (source.includes('https://api.openai.com/')) expect(source).toContain('receiptedFetch(');
  }
});
