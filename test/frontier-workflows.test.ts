import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
const source = (file: string) => readFileSync(join(root, file), 'utf8');

test('direct and routed autoplan stop after planning', () => {
  const map = JSON.parse(source('gstack/router-map.json'));
  expect(map.commands['/autoplan']).toEqual({ skill: 'plan', mode: 'review-all' });
  expect(map.commands['/sprint']).toEqual({ skill: 'sprint' });
  expect(source('autoplan/SKILL.md.tmpl')).toContain('review-all');
  const plan = source('plan/SKILL.md.tmpl');
  expect(plan).toContain('review-all');
  expect(plan).toContain('Stop after the plan');
  expect(plan).not.toContain('gh pr create');
});

test('plan loads only the selected perspective and engineering follows prior applicable reviews', () => {
  const plan = source('plan/SKILL.md.tmpl');
  expect(plan).toContain('{{SECTION:frame}}');
  expect(plan).toContain('{{SECTION:product-review}}');
  expect(plan).toContain('{{SECTION:design-review}}');
  expect(plan).toContain('{{SECTION:dx-review}}');
  expect(plan).toContain('{{SECTION:engineering-review}}');
  expect(plan.indexOf('{{SECTION:engineering-review}}')).toBeGreaterThan(plan.indexOf('{{SECTION:dx-review}}'));
  expect(plan).toContain('Skip an inapplicable perspective without reading its section');
});

test('build implements a clear CLI request without product interview or browser', () => {
  const build = source('build/SKILL.md.tmpl');
  expect(build).toContain('small, clear change');
  expect(build).toContain('callers');
  expect(build).toContain('CLI');
  expect(build).toContain('Do not start a browser for a non-web change');
  expect(build).not.toContain('AskUserQuestion for every');
});

test('sprint implements before verification and stops before publication when requested', () => {
  const sprint = source('sprint/SKILL.md.tmpl');
  const positions = ['## 0. Scope', '## 1. Plan', '## 2. Build', '## 3. Prepare', '## 4. Verify', '## 5. Review', '## 6. Publish']
    .map(marker => sprint.indexOf(marker));
  expect(positions.every(position => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
  expect(sprint).toContain('stop_after=verified');
  expect(sprint).toContain('not_applicable');
  expect(sprint).toContain('unavailable');
  expect(sprint).toContain('task.md');
  expect(source('workflows/sprint.md')).toContain('sprint/SKILL.md');
  expect(source('workflows/sprint.md')).not.toContain('Stage 4 — Browser QA');
});

test('verify defaults to reporting and browser aliases preserve fix versus report authority', () => {
  const verify = source('verify/SKILL.md.tmpl');
  expect(verify).toContain('Default: report');
  expect(verify).toContain('browser-fix');
  expect(verify).toContain('browser-report');
  expect(verify).toContain('not_applicable');
  expect(verify).toContain('unavailable');
  expect(source('qa/SKILL.md.tmpl')).toContain('{{INVOKE_SKILL:verify:mode=browser-fix}}');
  expect(source('qa-only/SKILL.md.tmpl')).toContain('{{INVOKE_SKILL:verify:mode=browser-report}}');
});

test('review uses current diff evidence and keeps shared-library advice read-only', () => {
  const review = source('review/SKILL.md.tmpl');
  expect(review).toContain('gstack-review-log --start review');
  expect(review).toContain('untracked');
  expect(review).toContain('fix mode');
  expect(review).not.toContain('{{REVIEW_ARMY}}');
  expect(source('deslop-shared-libs/SKILL.md.tmpl')).toContain('{{INVOKE_SKILL:review:mode=shared-libs}}');
  expect(source('review/sections/shared-libs.md.tmpl')).toContain('evidence_paths');
});

test('ship freezes release inputs before testing and checks freshness before publication', () => {
  const ship = source('ship/SKILL.md.tmpl');
  const steps = ['## 1. Prepare', '## 2. Verify', '## 3. Review', '## 4. Publish'].map(marker => ship.indexOf(marker));
  expect(steps.every(step => step >= 0)).toBe(true);
  expect(steps).toEqual([...steps].sort((a, b) => a - b));
  expect(ship).toContain('reviewFreshness');
  expect(ship).toContain('base commit');
  expect(ship).toContain('untracked');
  expect(ship).toContain('do not dispatch an agent or external model');
  expect(ship).toContain('A PR body-only edit');
  expect(ship).toContain('Do not merge or deploy');
});

test('design and context aliases resolve to explicit canonical modes', () => {
  expect(source('design/SKILL.md.tmpl')).toContain('system | variants | html');
  expect(source('design/sections/html.md.tmpl')).toContain('Pretext');
  expect(source('context/SKILL.md.tmpl')).toContain('save | restore | learn');
  expect(source('context/sections/restore.md.tmpl')).toContain('worktree');
  for (const [alias, target, mode] of [
    ['design-consultation', 'design', 'system'],
    ['design-shotgun', 'design', 'variants'],
    ['design-html', 'design', 'html'],
    ['context-save', 'context', 'save'],
    ['context-restore', 'context', 'restore'],
    ['learn', 'context', 'learn'],
  ]) expect(source(`${alias}/SKILL.md.tmpl`)).toContain(`{{INVOKE_SKILL:${target}:mode=${mode}}}`);
});
