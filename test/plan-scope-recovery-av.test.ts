import {expect, test} from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import {ALL_HOST_CONFIGS} from '../hosts';
import {HOST_PATHS, type TemplateContext} from '../scripts/resolvers/types';
import {nativeSeededPlanSelection} from './helpers/plan-scope-selection';
import {E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES, selectTests} from './helpers/touchfiles';
import observedFailures from './fixtures/plan-scope-recovery-av.json';

const skills = ['plan-eng-review', 'plan-design-review'] as const;
const read = (skill: string) => fs.readFileSync(path.join(import.meta.dir, '..', skill, 'SKILL.md.tmpl'), 'utf8');
const recovery = (text: string) => text.split('\n').find(line => line.startsWith('> Before ') && line.includes('publicly identified'))!;

test('the review handoff repairs a missing public declaration without claiming timely compliance', () => {
  for (const skill of skills) {
    const text = read(skill);
    const gate = text.indexOf('## Scope gate');
    const reviewStart = text.indexOf('{{SECTION:review-sections}}');
    expect(gate).toBeGreaterThan(text.indexOf('{{PREAMBLE}}'));
    expect(reviewStart).toBeGreaterThan(gate);
    expect(text.slice(gate, reviewStart)).toContain('The plan under review is already the target.');
    if (skill === 'plan-eng-review') {
      const section = fs.readFileSync(path.join(import.meta.dir, '..', skill, 'sections/review-sections.md.tmpl'), 'utf8');
      expect(section).toContain('### A. Assess the target');
      expect(section).toContain('Complete these checks before the complexity decision in B');
      expect(section.indexOf('### A. Assess the target')).toBeLessThan(section.indexOf('### B. Resolve complexity selectors'));
    }
  }
});

test('unseeded, explicit-target and early announcement rules remain authoritative on every host', () => {
  for (const skill of skills) {
    const template = read(skill);
    const gateStart = template.indexOf('## Scope gate');
    const gateEnd = template.indexOf('{{SECTION:review-sections}}');
    const gate = template.slice(gateStart, gateEnd);
    expect(gate).toContain('The plan under review is already the target.');
    expect(gate).toContain('Do not reopen a scope the user has locked.');
    expect(template.indexOf('## Scope gate')).toBeLessThan(template.indexOf('{{SECTION:review-sections}}'));
    expect(template.toLowerCase()).not.toContain('one question per turn');
  }
});

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
