import {expect, test} from 'bun:test';
import {nativeSeededPlanSelection} from './helpers/plan-scope-selection';
import {E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES, selectTests} from './helpers/touchfiles';
import observedFailures from './fixtures/plan-scope-recovery-av.json';

const skills = ['plan-eng-review', 'plan-design-review'] as const;

test('recorded failures stay intact while fresh unique-draft introductions now bind', () => {
  expect(observedFailures).toHaveLength(4);
  for (const [index, row] of observedFailures.entries()) {
    expect(row.observed.scopeGateAutoSelectObserved).toBe(false);
    expect(nativeSeededPlanSelection(row.transcript as any, row.tools as any, row.opts)).toBe(index !== 0);
    const title = /^#\s+(?:Plan:\s*)?(.+)$/m.exec(row.opts.seed)![1]!;
    const loaded = row.tools.find(tool => tool.kind === 'result')!;
    const timestamp = new Date(Date.parse(loaded.timestamp) + 1).toISOString();
    const message = {sessionId: row.opts.sessionId, timestamp, text: `I'll review "${title}" plan.`};
    const amended = {...row.transcript, assistantMessages: [message]};
    // Explicit synthetic control only: no changed message is paid evidence.
    expect(nativeSeededPlanSelection(amended as any, row.tools as any, row.opts)).toBe(true);
    for (const text of [`> ${message.text}`, `Example:\n${message.text}`, `I'll review "Another plan" plan.`]) {
      expect(nativeSeededPlanSelection({...amended, assistantMessages: [{...message, text}]} as any, row.tools as any, row.opts)).toBe(false);
    }
  }
});

test('regression sources select exactly the union of the two template owners', () => {
  for (const map of [E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES]) {
    const expected = selectTests(skills.map(skill => `${skill}/SKILL.md.tmpl`), map, []).selected;
    for (const file of ['test/plan-scope-recovery-av.test.ts', 'test/fixtures/plan-scope-recovery-av.json']) {
      expect(selectTests([file], map, []).selected).toEqual(expected);
    }
  }
});
