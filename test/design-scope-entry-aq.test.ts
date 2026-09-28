import {expect, test} from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import {E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES, selectTests} from './helpers/touchfiles';
import failedScopes from './fixtures/design-scope-checkpoint-at.json';
import {nativeSeededPlanSelection} from './helpers/plan-scope-selection';
import {isScopeGateAutoSelectVisible} from './helpers/claude-pty-runner';

const read = (file: string) => fs.readFileSync(path.join(import.meta.dir, '..', file), 'utf8');
const announcement = 'Scope gate: plan mode — auto-selected B (reviewing <target>).';

test('Design alias carries the named plan and decisions into canonical design review', () => {
  const alias = read('plan-design-review/SKILL.md.tmpl');
  expect(alias).toContain('named plan path, existing decisions, and restrictions');
  expect(alias).toContain('{{INVOKE_SKILL:plan:mode=review-design}}');
  expect(alias).not.toContain('{{PREAMBLE}}');
  const plan = read('plan/SKILL.md.tmpl');
  expect(plan).toContain("Carry the user's constraints and prior authorization through every mode");
  expect(plan).toContain('A specific review mode reads only its own section and the plan');
});

test('the unique draft is a valid current target without rewriting earlier paid observations', () => {
  expect(read('plan-design-review/SKILL.md.tmpl')).not.toContain('After this skill finishes loading');
  for (const row of failedScopes) {
    expect(row.observed.scopeGateAutoSelectObserved).toBe(false);
    expect(nativeSeededPlanSelection(row.transcript as any, row.tools as any, row.opts)).toBe(true);
    const title = /^# Plan: (.+)$/m.exec(row.opts.seed)![1]!;
    expect(isScopeGateAutoSelectVisible(announcement.replace('<target>', title))).toBe(true);
  }
});

test('the regression selects the same paid owners as the Design template', () => {
  for (const map of [E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES]) {
    expect(selectTests(['test/design-scope-entry-aq.test.ts'], map, []).selected)
      .toEqual(selectTests(['plan-design-review/SKILL.md.tmpl'], map, []).selected);
    expect(selectTests(['test/fixtures/design-scope-checkpoint-at.json'], map, []).selected)
      .toEqual(selectTests(['plan-design-review/SKILL.md.tmpl'], map, []).selected);
    for (const paths of Object.values(map)) for (let i = 0; i < paths.length; i++) {
      expect(Object.hasOwn(paths, i)).toBe(true);
      expect(typeof paths[i]).toBe('string');
    }
  }
});
