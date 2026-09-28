import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (file: string) => readFileSync(new URL(`../ship/${file}`, import.meta.url), 'utf8');

test('missing required review evidence stops publication', () => {
  const ship = read('SKILL.md');
  expect(ship).toContain('Unresolved blockers or missing required evidence stop publication');
  expect(ship).toContain("reviewFreshness(rec, currentWtree, { baseCommit, repo, branch }).status === 'CURRENT'");
  expect(ship).toContain('do not dispatch an agent or external model');
});

test('external-comment fixes refresh tests and mandatory review without repeating prior decisions', () => {
  const section = read('sections/greptile.md');
  expect(section).toContain('rerun affected checks, and repeat review on the changed diff');
  expect(section).toContain('do not repeat unchanged comment decisions');
  expect(section).toContain('If no source changed, update only the PR response or body');
});

test('existing release levels have an explicit recovery rule, not implicit rebump approval', () => {
  const version = read('sections/version.md');
  expect(version).toContain('first changed major/minor/patch/');
  expect(version).toContain('a missing fourth component is zero');
  expect(version).toContain('not approval to bump again');
  expect(version).toContain('keep `currentVersion` unless');
});

test('distribution setup asks for unknown targets and cannot release before review', () => {
  const root = read('SKILL.md');
  expect(root).toContain('Ask once for an unknown distribution target');
  expect(root).toContain('never invent a registry or credentials');
  expect(root.indexOf('## 2. Verify')).toBeLessThan(root.indexOf('## 3. Review'));
  expect(root.indexOf('## 3. Review')).toBeLessThan(root.indexOf('## 4. Publish'));
  expect(root).toContain('A repository-landing ship opens a PR, never merges or deploys');
  expect(root).toContain('Store distribution proceeds through that adapter');
});
