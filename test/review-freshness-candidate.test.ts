import { test, expect } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { captureReviewStart, bindReview, reviewFreshness } from '../lib/review-evidence';

test('review binding rejects changed content, base, worktree and incomplete passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'gstack-review-candidate-'));
  const wtree = 'a'.repeat(40);
  const base = 'b'.repeat(40);
  const env = {
    GSTACK_REVIEW_DIR: dir,
    GSTACK_REVIEW_REPO: '/tmp/project-a',
    GSTACK_REVIEW_BRANCH: 'feature',
    GSTACK_REVIEW_BASE_COMMIT: base,
    GSTACK_STAMP_WTREE: wtree,
  } as NodeJS.ProcessEnv;
  try {
    const token = captureReviewStart('review', env);
    const rec = bindReview({ skill: 'review', status: 'clean', completed: true, converged: true, issues_found: 0, base_commit: 'forged' }, token, env);
    expect(rec.base_commit).toBe(base);
    expect(reviewFreshness(rec, wtree, { baseCommit: base, repo: '/tmp/project-a', branch: 'feature' })?.status).toBe('CURRENT');
    expect(reviewFreshness(rec, 'c'.repeat(40), { baseCommit: base, repo: '/tmp/project-a', branch: 'feature' })?.status).toBe('STALE');
    expect(reviewFreshness(rec, wtree, { baseCommit: 'd'.repeat(40), repo: '/tmp/project-a', branch: 'feature' })?.status).toBe('STALE');
    expect(reviewFreshness(rec, wtree, { baseCommit: base, repo: '/tmp/project-b', branch: 'feature' })?.status).toBe('STALE');
    expect(reviewFreshness(rec, wtree, { baseCommit: base, repo: '/tmp/project-a', branch: 'other' })?.status).toBe('STALE');
    expect(reviewFreshness({ ...rec, completed: false }, wtree, { baseCommit: base, repo: '/tmp/project-a', branch: 'feature' })?.status).toBe('UNVERIFIED');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
