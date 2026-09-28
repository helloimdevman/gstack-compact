import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

test('ship fixes authorized findings in one bounded invocation and refreshes both gates', () => {
  const body = fs.readFileSync(path.join(import.meta.dir, '..', 'ship/SKILL.md'), 'utf8');
  const review = body.slice(body.indexOf('## 3. Review'), body.indexOf('## 4. Publish'));
  expect(review).toContain('Fix authorized findings in this invocation');
  expect(review).toContain('return to affected tests, and start a fresh review');
  expect(review).toContain('stop after three unsuccessful fix cycles and report the blocker');
  expect(review).toContain('Do not ask the user to restart `/ship`');
  expect(review).toContain('Unresolved blockers or missing required evidence stop publication');
});
