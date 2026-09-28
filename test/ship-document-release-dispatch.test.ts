import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const root = path.join(import.meta.dir, '..');
const read = (name: string) => fs.readFileSync(path.join(root, name), 'utf8');

test('ship completes required docs in the same session before freezing tests', () => {
  const ship = read('ship/SKILL.md');
  const prepare = ship.indexOf('Complete VERSION, CHANGELOG, docs, generation, and build before final tests');
  const verify = ship.indexOf('## 2. Verify');
  const publish = ship.indexOf('## 4. Publish');
  expect(prepare).toBeGreaterThan(-1);
  expect(verify).toBeGreaterThan(prepare);
  expect(publish).toBeGreaterThan(verify);
  expect(ship).toContain('do not dispatch `/document-release` as a subagent.');
  expect(ship).toContain('Code or release-file edits return to affected checks.');
});

test('PR publication section remains conditional and requires an accurate body', () => {
  const manifest = JSON.parse(read('ship/sections/manifest.json'));
  const pr = manifest.sections.find((section: { id: string }) => section.id === 'pr-body');
  expect(pr?.trigger).toBe('creating or updating an authorized PR');
  const ship = read('ship/SKILL.md');
  expect(ship).toContain('Read the PR-body section for the existing GitHub tooling and redaction rules.');
  expect(ship).toContain('Confirm the PR URL before marking a sprint task `shipped`.');
});
