import { expect, test } from 'bun:test';
import { ENG_REVIEW_EXCERPT, readWorkflowExcerpt } from './helpers/workflow-excerpt';
import { LLM_JUDGE_TOUCHFILES, selectTests } from './helpers/touchfiles';

test('workflow excerpt helper changes select every registered workflow judge', () => {
  const selected = selectTests(['test/helpers/workflow-excerpt.ts'], LLM_JUDGE_TOUCHFILES, []).selected;
  expect(selected).toHaveLength(14);
  expect(selected).toContain('ship/SKILL.md workflow');
  expect(selected).toContain('plan-design-review/SKILL.md passes');
});

test('ship excerpt follows the current prepare, verify, review, publish order', () => {
  const text = readWorkflowExcerpt('ship/SKILL.md', '# /ship', null);
  const positions = ['## 1. Prepare', '## 2. Verify', '## 3. Review', '## 4. Publish']
    .map(marker => text.indexOf(marker));
  expect(positions.every(position => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(text).toContain('Unresolved blockers or missing required evidence stop publication');
  expect(text).toContain('push without force');
});

test('engineering judge excerpt reads the current plan owner', () => {
  const { skillPath, startMarker, endMarker } = ENG_REVIEW_EXCERPT;
  expect(skillPath).toBe('plan/SKILL.md');
  const text = readWorkflowExcerpt(skillPath, startMarker, endMarker);
  expect(text).toContain('# /plan');
  expect(text).toContain('review-engineering');
});

test('workflow excerpt rejects missing markers and inverted windows', () => {
  expect(() => readWorkflowExcerpt('ship/SKILL.md', 'missing start', null)).toThrow(/Start marker not found/);
  expect(() => readWorkflowExcerpt('ship/SKILL.md', '# /ship', 'missing end')).toThrow(/End marker not found/);
  expect(() => readWorkflowExcerpt('ship/SKILL.md', '## 4. Publish', '## 1. Prepare')).toThrow(/End marker not found/);
});
