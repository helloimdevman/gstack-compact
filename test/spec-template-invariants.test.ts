/** Current /spec contract: a thin /plan alias with an opt-in issue sink. */
import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dir, '..');
const source = (file: string) => readFileSync(join(ROOT, file), 'utf8');

test('/spec delegates to plan without publishing by default', () => {
  const alias = source('spec/SKILL.md.tmpl');
  expect(alias).toContain('{{INVOKE_SKILL:plan:mode=spec}}');
  expect(alias).toContain('only when the user requested issue publication');
  expect(alias).not.toContain('gh issue create');
});

test('the plan spec includes the user, behavior, evidence and acceptance checks', () => {
  const section = source('plan/sections/spec.md.tmpl');
  for (const phrase of ['who needs the change', 'current and desired behavior', 'acceptance checks', 'relevant file or document']) {
    expect(section).toContain(phrase);
  }
  expect(section).toContain('An unrequested document-only spec does not publish');
});

test('issue publication scans the accepted body and does not spawn implementation', () => {
  const section = source('plan/sections/spec.md.tmpl');
  expect(section.indexOf('gstack-redact" --from-file "$ISSUE_BODY_FILE"'))
    .toBeLessThan(section.indexOf('gh issue create --body-file "$ISSUE_BODY_FILE"'));
  expect(section).toContain('Exit 3 (HIGH) or a scan error blocks filing');
  expect(section).toContain('gstack-issue-guard` only when *reading* existing issue text');
  expect(section).toContain('Implementation and agent spawning are separate user requests');
});
