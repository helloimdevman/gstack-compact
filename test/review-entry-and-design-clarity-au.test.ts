import {expect, test} from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import {ALL_HOST_CONFIGS} from '../hosts';
import {HOST_PATHS} from '../scripts/resolvers/types';
import {generateInstalledPreamble} from '../scripts/resolvers/preamble';

const read = (file: string) => fs.readFileSync(path.join(import.meta.dir, '..', file), 'utf8');

test('review aliases delegate once and the canonical plan owns bootstrap and scope', () => {
  for (const [skill, mode] of [['plan-design-review', 'review-design'], ['plan-eng-review', 'review-engineering']]) {
    const alias = read(`${skill}/SKILL.md.tmpl`);
    expect(alias).toContain(`{{INVOKE_SKILL:plan:mode=${mode}}}`);
    expect(alias).not.toContain('{{PREAMBLE}}');
  }
  const plan = read('plan/SKILL.md.tmpl');
  expect(plan.match(/\{\{PREAMBLE\}\}/g)).toHaveLength(1);
  expect(plan).toContain('Do not run implementation, publish an issue, or open a PR');
  for (const host of ALL_HOST_CONFIGS) {
    const out = generateInstalledPreamble({ skillName: 'plan', tmplPath: 'plan/SKILL.md.tmpl',
      host: host.name, paths: HOST_PATHS[host.name]!, preambleTier: 2 });
    expect(out).toContain('blocks protected /plan steps');
    expect(out).not.toContain('starting from Step 0');
  }
});

test('shared scope and permission boundaries stay independent of the retired review passes', () => {
  const contract = read('CONTRACT.md');
  expect(contract).toContain("Keep the user's existing authorization");
  expect(contract).toContain('Do not ask again for a choice the user already made');
  expect(contract).toContain('without silently expanding the task');
  const design = read('plan/sections/design-review.md.tmpl');
  expect(design).toContain('accessibility, keyboard operation, contrast');
  expect(design).toContain('no UI');
  expect(design).toContain('without opening unrelated design material');
  expect(read('plan/sections/engineering-review.md.tmpl')).toContain('do not silently decide them for the user');
});
