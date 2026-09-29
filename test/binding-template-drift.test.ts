import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Template-drift tripwire for the content-binding wave. The bins are
 * code-enforced; the GRADING rules live as prose in rendered templates that
 * agents follow. This test pins the load-bearing rule text in the GENERATED
 * files so a template refactor can't silently drop a rule while the bins keep
 * working. (Prompt-followed prose is honest tier-2 enforcement — this tripwire
 * is what keeps it from being tier-3 vibes.)
 */

const ROOT = path.resolve(import.meta.dir, '..');

function rendered(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), 'utf-8');
}

describe('content-binding template drift', () => {










  test('land-and-deploy grades staleness content-first (wtree rule) and checks evidence', () => {
    // Carved (prompt-token-load-reduction): Step 3.5 moved out of the skeleton
    // into the on-demand readiness-gate section — the grading rules live there.
    const land = rendered('land-and-deploy/sections/readiness-gate.md');
    expect(land).toContain('wtree');
    expect(land).toContain('---WTREE---');
    expect(land).toContain('gstack-evidence check --label tests --expect-cmd "$TEST_COMMAND" --max-age 24');
    expect(land).toContain('gstack-evidence run --label tests -- "$TEST_COMMAND"');
    expect(land).toContain('UNKNOWN');
  });









  test('release-body write side carries the banner tripwire (and it actually fires)', () => {
    const body = rendered('document-release/sections/release-body.md');
    expect(body).toContain('grep -c "UNTRUSTED TRACKER CONTENT" "<run-dir>/body.md"');
    expect(body).toContain('grep -c "UNTRUSTED TRACKER CONTENT" "<run-dir>/body-original.md"');
    // The fail-open shape: grep -c prints 0 AND exits 1 on no-match, so an
    // `|| echo 0` double-emits and breaks the -gt into the clean branch.
    expect(body).not.toContain('|| echo 0');
    expect(body).toContain('banner tripwire clean');

    // Functional: execute the template's tripwire block against a 0-banner
    // original and a 1-banner outgoing body — the ABORT branch must fire.
    //
    // Pass the script as an ARGV element (spawnSync array form), never by
    // interpolating JSON.stringify into a shell line: JSON escaping is not
    // shell escaping. Inside shell double quotes a JSON "\n" stays a literal
    // backslash-n, which collapsed this multi-line script onto one line where
    // `then\n` became the command word `thenn` and `>&2\nelse\n` became the
    // redirect `>&2nelsen` — silently littering a `2nelsen` file (containing
    // "bash: thenn: command not found") in the repo root on every suite run,
    // while the old not-contains assertion passed vacuously because ALL
    // output had been redirected into that file.
    const block = body.match(/_ORIG_BANNERS=\$\(grep[\s\S]*?fi\n/);
    expect(block).not.toBeNull();
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const { spawnSync } = require('child_process');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-banner-'));
    try {
      const scriptFor = (origContent: string, newContent: string) => {
        fs.writeFileSync(path.join(dir, 'orig.md'), origContent);
        fs.writeFileSync(path.join(dir, 'new.md'), newContent);
        return block![0]
          .replaceAll('<run-dir>/body-original.md', path.join(dir, 'orig.md'))
          .replaceAll('<run-dir>/body.md', path.join(dir, 'new.md'));
      };

      // Banner leaked into the outgoing body → the ABORT branch fires, loudly.
      const abort = spawnSync('bash', ['-c', scriptFor(
        'clean body\n',
        'body with UNTRUSTED TRACKER CONTENT banner leak\n',
      )], { encoding: 'utf-8', timeout: 30_000 });
      expect(abort.stderr).toContain('ABORT: envelope banner leaked');
      expect(abort.stdout).not.toContain('banner tripwire clean');

      // No banner delta → the clean branch fires.
      const clean = spawnSync('bash', ['-c', scriptFor(
        'clean body\n',
        'also clean body\n',
      )], { encoding: 'utf-8', timeout: 30_000 });
      expect(clean.stdout).toContain('banner tripwire clean');
      expect(clean.stderr).not.toContain('ABORT');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('greptile triage reads bodies through the guard (metadata/body split)', () => {
    const triage = rendered('review/greptile-triage.md');
    expect(triage).toContain('gstack-issue-guard --stdin --source greptile-line');
    expect(triage).toContain('gstack-issue-guard --stdin --source greptile-replies');
  });
});
