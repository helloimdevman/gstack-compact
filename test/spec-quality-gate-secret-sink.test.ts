/** Current /spec issue publication scans the body before the gh sink. */
import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(import.meta.dir, '..');
const tempDirs: string[] = [];
afterEach(() => { for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true }); });

for (const file of ['plan/sections/spec.md', '.agents/skills/gstack-plan/sections/spec.md']) {
  test(`${file} scans the exact body before issue creation`, () => {
    const content = readFileSync(join(ROOT, file), 'utf8');
    const scan = content.indexOf('gstack-redact" --from-file "$ISSUE_BODY_FILE"');
    const publish = content.indexOf('gh issue create --body-file "$ISSUE_BODY_FILE"');
    expect(scan).toBeGreaterThan(0);
    expect(publish).toBeGreaterThan(scan);
    expect(content).toContain('Exit 3 (HIGH) or a scan error blocks filing');
    expect(content).toContain('Exit 2 requires each MEDIUM finding');
    expect(content).toContain('gstack-issue-guard` only when *reading* existing issue text');
  });
}

test.each([
  ['credential', 'Deploy using ' + ['AKIA', '1234567890ABCDEF'].join(''), 3],
  ['contact', 'Notify owner@private-customer.io', 2],
  ['clean', 'Add a greeting command with a unit test.', 0],
] as const)('the real scanner returns the %s gate for the same body file', (_name, body, expected) => {
  const dir = mkdtempSync(join(tmpdir(), 'gstack-spec-scan-'));
  tempDirs.push(dir);
  const file = join(dir, 'body.md');
  writeFileSync(file, body, { mode: 0o600 });
  const result = spawnSync('bun', [join(ROOT, 'bin/gstack-redact'), '--from-file', file, '--repo-visibility', 'unknown'], {
    cwd: ROOT, encoding: 'utf8', timeout: 10_000,
  });
  expect(result.status).toBe(expected);
});
