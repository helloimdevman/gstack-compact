import { describe, expect, test } from 'bun:test';
import { E2E_TIERS, E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES, selectTests } from './helpers/touchfiles';
import { OVERLAY_FIXTURES } from './fixtures/overlay-nudges';

describe('periodic fixture dependencies select their behavioral cases', () => {
  const cases: Array<[string, string[]]> = [
    ['test/ceo-expansion-pacing-native.test.ts', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-expansion-pacing-fb10.json', ['plan-ceo-mode-routing']],
    ['test/helpers/ceo-hold-posture-review.ts', ['plan-ceo-mode-routing']],
    ['test/ceo-hold-posture-review.test.ts', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-hold-proof-fb10.json', ['plan-ceo-mode-routing']],
    ['test/eng-semantic-terminal.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-fb10-count-public.json', ['plan-eng-finding-count']],
    ['test/fixtures/autoplan-home-phase-entry-fb10.json', ['autoplan-chain-pty']],
    ['test/eng-error-flow-seed.test.ts', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-69193-count-public.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-e366-count-public.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/ceo-current-decision-record.test.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-current-decision-cdd-public.json', ['plan-ceo-finding-count']],
    ['test/fixtures/eng-count-c6fc-public.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-cdd-regression-task.json', ['plan-eng-finding-count']],
    ['test/eng-resolution-block-position.test.ts', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/eng-initial-selector-043a.test.ts', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-initial-selector-043a.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-a689-count-public.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-a689-retry-public.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-neutral-seed-749df.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-paired-suite-749df.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/auto-decide-mode-selector-749df.json', ['auto-decide-preserved']],
    ['test/eng-count-owned-outcomes.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-count-owned-outcomes-f359.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-batching-prefixed-ledger-f359.json', ['plan-eng-multi-finding-batching']],
    ['test/fixtures/ceo-hold-preservation-f359.json', ['plan-ceo-mode-routing']],
    ['test/ceo-native-fields-f359.test.ts', ['plan-ceo-finding-count']],
    ['test/ceo-conditional-option-facts.test.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-conditional-option-facts-c6fc.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-native-fields-f359.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-plain-fields-f359.json', ['plan-ceo-finding-count']],
    ['test/eng-task-pause-navigation-f359.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-task-pause-navigation-f359.json', ['plan-eng-finding-count']],
    ['test/fixtures/auto-decide-completed-mode-f359.json', ['auto-decide-preserved']],
    ['test/fixtures/ceo-onboarding-packet-90f.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-baseline-alternatives-90f.json', ['plan-ceo-finding-count']],
    ['test/fixtures/eng-structure-choice-90f.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-idp-choice-90f.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-legacy-declaration-90f.json', ['plan-eng-finding-count']],
    ['test/fixtures/design-completion-envelope-90f.json', ['plan-design-finding-count']],
    ['test/eng-native-seed-contract.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-native-seed-contract-6f.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-native-packets-b955.json', ['plan-eng-finding-count']],
    ['test/review-count-markdown.test.ts', ['plan-eng-finding-count', 'plan-design-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/review-count-markdown-6f.json', ['plan-eng-finding-count', 'plan-design-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/eng-current-native-seeds.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-current-native-seeds-6714.json', ['plan-eng-finding-count']],
    ['test/fixtures/ceo-recorded-decisions-67147822.json', ['plan-ceo-finding-count']],
    ['test/fixtures/eng-batching-expanded-ledger-6714.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-native-review-identities-6714.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/design-count-current-pass.test.ts', ['plan-design-finding-count']],
    ['test/fixtures/design-count-current-pass.json', ['plan-design-finding-count']],
    ['test/eng-test-plan-edit-approval.test.ts', ['autoplan-chain-pty', 'plan-eng-finding-count']],
    ['test/fixtures/eng-test-plan-edit-dacc.json', ['autoplan-chain-pty', 'plan-eng-finding-count']],
    ['test/fixtures/eng-test-plan-edit-cli.js', ['autoplan-chain-pty', 'plan-eng-finding-count']],
    ['test/autoplan-owned-state.test.ts', ['autoplan-chain-pty']],
    ['test/autoplan-artifact-windows-argv.test.ts', ['autoplan-chain-pty', 'plan-eng-finding-count']],
    ['test/fixtures/eng-current-choice-cab3.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-completed-navigation-cab3.json', ['plan-eng-finding-count']],
    ['test/helpers/autoplan-method-read-audit.ts', ['autoplan-chain-pty']],
    ['test/fixtures/autoplan-phase-entry-alias-f359.json', ['autoplan-chain-pty']],
    ['test/fixtures/autoplan-method-read-aa-events.json', ['autoplan-chain-pty']],
    ['test/fixtures/devex-journey-evidence-cab3.json', ['plan-devex-finding-count']],
    ['test/fixtures/autoplan-amend-input-77.json', ['carve-section-loading', 'autoplan-chain-pty']],
    ['test/fixtures/autoplan-phase-handoff-6714.json', ['carve-section-loading', 'autoplan-chain-pty']],
    ['test/fixtures/autoplan-owned-state-edit.json', ['autoplan-chain-pty']],
    ['test/eng-finding-retry-budget.test.ts', ['plan-ceo-finding-count', 'plan-ceo-split-overflow', 'plan-design-finding-count', 'plan-devex-finding-count', 'plan-eng-finding-count', 'plan-eng-multi-finding-batching', 'autoplan-chain-pty']],
    ['test/design-count-native-8525.test.ts', ['plan-design-finding-count']],
    ['test/fixtures/design-count-native-8525.json', ['plan-design-finding-count']],
    ['test/fixtures/design-phase-entry-77.json', ['plan-design-finding-count']],
    ['test/fixtures/ceo-expansion-pacing-77.json', ['plan-ceo-mode-routing']],
    ['test/eng-published-navigation.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-published-navigation.json', ['plan-eng-finding-count']],
    ['test/fixtures/eng-6aef-count-public.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/ceo-native-ledger-replay.test.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-native-ledger-8525.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-option-metadata-list-6f6730f4.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-zero-test-absence-6f6730f4.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-recorded-decisions-dacc95ea.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-expansion-posture-kind-dacc.json', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-expansion-pause-6714.json', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-expansion-complete-inventory-6f.json', ['plan-ceo-mode-routing']],
    ['test/ceo-mode-pending-submit.test.ts', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-mode-pending-submit.json', ['plan-ceo-mode-routing']],
    ['test/fixtures/ceo-fill-lifetime.json', ['plan-ceo-section-loading']],
    ['test/fixtures/eng-current-ledger-seeds.json', ['plan-eng-finding-count']],
    ['test/eng-batching-native-replay.test.ts', ['plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-batching-native-8525.json', ['plan-eng-multi-finding-batching']],
    ['test/eng-batching-saved-ledger.test.ts', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/fixtures/eng-batching-saved-ledger-dacc.json', ['plan-eng-finding-count', 'plan-eng-multi-finding-batching']],
    ['test/design-count-native-issue-fields.test.ts', ['plan-design-finding-count']],
    ['test/fixtures/design-count-native-issue-fields.json', ['plan-design-finding-count']],
    ['test/helpers/ceo-payment-findings.ts', ['plan-ceo-finding-count']],
    ['test/ceo-payment-findings.test.ts', ['plan-ceo-finding-count']],
    ['test/ceo-source-attribution.test.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-source-attribution-6aef.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-current-record-6aef.json', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-payment-ledger-decisions.json', ['plan-ceo-finding-count']],
    ['test/skill-fixture.test.ts', ['journey-ideation', 'journey-plan-eng', 'journey-debug', 'journey-qa', 'journey-code-review', 'journey-ship', 'journey-docs', 'journey-retro', 'journey-design-system', 'journey-visual-qa']],
    ['test/gstack-paths.test.ts', ['autoplan-chain-pty', 'carve-section-loading', 'design-html-slop-gate']],
    ['test/autoplan-permission-viewport.test.ts', ['autoplan-chain-pty']],
    ['test/fixtures/autoplan-settings-overwrite.json', ['autoplan-chain-pty']],
    ['test/fixtures/eng-file-permission-repaint.json', ['plan-eng-multi-finding-batching']],
    ['test/helpers/carve-section-case.ts', ['carve-section-loading']],
    ['test/helpers/carve-plan-fixture.ts', ['carve-section-loading']],
    ['test/carve-plan-fixture.test.ts', ['carve-section-loading']],
    ['test/fixtures/carve-existing-repository/src/repository.ts', ['carve-section-loading']],
    ['test/fixtures/carve-existing-repository/README.md', ['carve-section-loading']],
    ['test/fixtures/carve-existing-repository/example.ts', ['carve-section-loading']],
    ['test/helpers/eng-finding-fixture.ts', ['plan-eng-finding-count']],
    ['test/eng-finding-fixture.test.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-existing-auth/legacy-auth.ts', ['plan-eng-finding-count']],
    ['test/fixtures/eng-existing-auth/package.json', ['plan-eng-finding-count']],
    ['test/plan-design-floor-fixture.test.ts', ['plan-design-finding-floor']],
    ['test/devex-finding-fixture.test.ts', ['plan-devex-finding-count']],
    ['test/fixtures/devex-checkpoint-todos.json', ['plan-devex-finding-count']],
    ['test/fixtures/devex-existing-sdk/README.md', ['plan-devex-finding-count']],
    ['test/fixtures/devex-existing-sdk/docs/getting-started.md', ['plan-devex-finding-count']],
    ['test/fixtures/devex-existing-sdk/docs/feedback.md', ['plan-devex-finding-count']],
    ['test/fixtures/devex-existing-sdk/docs/reference-v1.md', ['plan-devex-finding-count']],
    ['test/design-finding-fixture.test.ts', ['plan-design-finding-count']],
    ['test/helpers/hermetic-env.test.ts', ['plan-ceo-split-overflow']],
    ['test/helpers/ceo-split-question-policy.ts', ['plan-ceo-split-overflow']],
    ['test/ceo-split-question-policy.test.ts', ['plan-ceo-split-overflow']],
    ['test/ceo-split-collection.test.ts', ['plan-ceo-split-overflow']],
    ['test/fixtures/ceo-split-collection-0bcd.json', ['plan-ceo-split-overflow']],
    ['test/fixtures/ceo-split-actor-6aef.json', ['plan-ceo-split-overflow']],
    ['test/helpers/ceo-mode-option.ts', ['plan-ceo-mode-routing', 'plan-ceo-finding-count', 'plan-ceo-split-overflow']],
    ['docs/askuserquestion-split.md', ['plan-ceo-split-overflow', 'plan-decision-classification', 'plan-devex-peer-comparison-classification']],
    ['test/resolver-ask-user-format.test.ts', ['plan-ceo-split-overflow']],
    ['test/skill-e2e-plan-ceo-finding-count.test.ts', ['plan-ceo-finding-count']],
    ['test/section-capture-native-tools.test.ts', ['ship-section-loading', 'plan-ceo-section-loading', 'carve-section-loading']],
    ['test/helpers/ceo-paired-fixture.ts', ['plan-ceo-finding-count']],
    ['test/ceo-paired-payment-fixture.test.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/ceo-paired-option-values.json', ['plan-ceo-finding-count']],
    ['test/fixtures/paired-payment/src/payment.ts', ['plan-ceo-finding-count']],
    ['test/fixtures/paired-payment/contract.test.ts.fixture', ['plan-ceo-finding-count']],
    ['test/fixtures/paired-payment/README.md', ['plan-ceo-finding-count']],
    ...['README.md', 'platform.ts', 'existing-invoice-handler.ts', 'schema.sql', 'contract.test.ts.fixture'].map((file): [string, string[]] =>
      [`test/fixtures/ceo-existing-payment/${file}`, ['plan-ceo-finding-count']]),
    ...['test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts'].map((file): [string, string[]] => [file,
      ['plan-ceo-finding-count', 'plan-eng-finding-count', 'plan-design-finding-count',
        'plan-devex-finding-count', 'plan-eng-multi-finding-batching', 'plan-ceo-split-overflow'],
    ]),
    ['test/helpers/plan-mode-evidence.ts', ['plan-eng-review-plan-mode']],
    ['test/plan-mode-evidence.test.ts', ['plan-eng-review-plan-mode']],
    ...['test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts'].map((file): [string, string[]] => [file,
      ['autoplan-chain-pty', 'plan-ceo-finding-count', 'plan-eng-finding-count', 'plan-design-finding-count',
        'plan-devex-finding-count', 'plan-eng-multi-finding-batching', 'plan-ceo-split-overflow'],
    ]),
    ...['overlay-measurement', 'overlay-workspace', 'overlay-attempt', 'overlay-case', 'overlay-case-policy', 'overlay-lifecycle'].map((helper): [string, string[]] => [
      `test/helpers/${helper}.ts`, OVERLAY_FIXTURES.map(fixture => `overlay-harness-${fixture.id}`),
    ]),
  ];

  for (const file of ['test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts']) {
    cases.push([file, OVERLAY_FIXTURES.map(fixture => `overlay-harness-${fixture.id}`)]);
  }

  for (const fixture of OVERLAY_FIXTURES) {
    cases.push([`test/skill-e2e-overlay-harness-${fixture.id}.test.ts`, [`overlay-harness-${fixture.id}`]]);
  }

  test('SDK runner changes retain the native gate and existing periodic consumers', () => {
    const periodic = OVERLAY_FIXTURES.map(fixture => `overlay-harness-${fixture.id}`);
    const result = selectTests(['test/agent-sdk-runner.test.ts'], E2E_TOUCHFILES);
    expect(result.reason).toBe('diff');
    expect(result.selected.sort()).toEqual(['auq-format-gate', ...periodic].sort());
    expect(E2E_TIERS['auq-format-gate']).toBe('gate');
    for (const id of periodic) expect(E2E_TIERS[id]).toBe('periodic');
  });

  for (const [file, expected] of cases) {
    test(file, () => {
      const result = selectTests([file], E2E_TOUCHFILES);
      expect(result.reason).toBe('diff');
      expect(result.selected.sort()).toEqual([...expected].sort());
      for (const id of expected) expect(E2E_TIERS[id]).toBe('periodic');
    });
  }
});



test('shared attempt regressions select their periodic callers', () => {
  const periodic = ['office-hours-forcing-energy', 'office-hours-builder-wildness', 'plan-ceo-review-format-mode', 'plan-ceo-review-format-approach', 'plan-eng-review-format-coverage', 'plan-eng-review-format-kind', 'plan-ceo-review-prosons-cadence', 'plan-review-prosons-format', 'plan-review-prosons-hardstop-neg', 'plan-review-prosons-neutral-neg'];
  const result = selectTests(['test/office-hours-attempt.test.ts'], E2E_TOUCHFILES);
  expect(result.reason).toBe('diff');
  expect(result.selected.sort()).toEqual(periodic.sort());
  for (const id of periodic) expect(E2E_TIERS[id]).toBe('periodic');
});

test('decision-log CLI and validator select the demonstrated DX consumer without global or quality fanout', () => {
  for (const file of ['bin/gstack-decision-log', 'lib/gstack-decision.ts']) {
    const selected = selectTests([file], E2E_TOUCHFILES);
    expect(selected.reason).toBe('diff');
    expect(selected.selected).toEqual(['plan-devex-finding-count']);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
  expect(E2E_TIERS['plan-devex-finding-count']).toBe('periodic');
});

test('native fixture dependencies include the migrated auto-decision and seeded CEO smoke callers', () => {
  const expected = [
    'auto-decide-preserved', 'autoplan-chain-pty',
    'plan-ceo-finding-count', 'plan-ceo-finding-floor', 'plan-ceo-mode-routing', 'plan-ceo-review-plan-mode', 'plan-ceo-split-overflow',
    'plan-design-finding-count', 'plan-design-finding-floor',
    'plan-devex-finding-count', 'plan-devex-finding-floor',
    'plan-eng-finding-count', 'plan-eng-finding-floor', 'plan-eng-multi-finding-batching',
  ];
  for (const file of ['test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts']) {
    const result = selectTests([file], E2E_TOUCHFILES);
    expect(result.reason).toBe('diff');
    expect(result.selected.sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
  expect(E2E_TIERS['auto-decide-preserved']).toBe('periodic');
  expect(E2E_TIERS['plan-ceo-review-plan-mode']).toBe('gate');
});

test('shared native input dependencies select every PTY consumer without changing tiers', () => {
  const expected = selectTests(['test/helpers/claude-pty-runner.ts'], E2E_TOUCHFILES).selected.sort();
  expect(expected).toHaveLength(20);
  expect(expected.filter(id => E2E_TIERS[id] === 'gate')).toHaveLength(6);
  expect(expected.filter(id => E2E_TIERS[id] === 'periodic')).toHaveLength(14);
  for (const file of ['test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts',
    'test/helpers/plan-skill-questions.ts', 'test/plan-skill-questions.test.ts', 'test/fixtures/design-tasks-bash-permission.json', 'test/fixtures/eng-auq-validation-error.json',
    'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts',
    'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts']) {
    const result = selectTests([file], E2E_TOUCHFILES);
    expect(result.reason).toBe('diff');
    expect(result.selected.sort()).toEqual(expected);
  }
});


test('seed submission dependencies select every seeded caller with its existing tier', () => {
  const expected = ['auto-decide-preserved', 'conductor-prose', 'plan-ceo-review-plan-mode',
    'plan-devex-review-plan-mode', 'plan-eng-review-plan-mode', 'plan-mode-no-op'];
  for (const file of ['test/helpers/fake-plan-seed.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts']) {
    const result = selectTests([file], E2E_TOUCHFILES);
    expect(result.reason).toBe('diff');
    expect(result.selected.sort()).toEqual(expected);
  }
  expect(expected.map(id => E2E_TIERS[id])).toEqual(['periodic', 'periodic', 'gate', 'gate', 'periodic', 'gate']);
});

test('task emission source selects CEO completion consumers', () => {
  const selected = selectTests(['scripts/resolvers/tasks-section.ts'], E2E_TOUCHFILES);
  expect(selected.reason).toBe('diff');
  for (const id of [
    'plan-ceo-finding-count', 'plan-ceo-finding-floor', 'plan-ceo-split-overflow',
    'plan-ceo-section-loading', 'plan-ceo-review-plan-mode', 'autoplan-chain-pty',
  ]) expect(selected.selected).toContain(id);
  expect(selectTests(['scripts/resolvers/tasks-section.ts'], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
});




test('shared installed preamble selects every generated review consumer', () => {
  const source = 'scripts/resolvers/preamble.ts';
  const renders = ['plan-ceo-review', 'plan-eng-review', 'plan-design-review', 'plan-devex-review']
    .map(skill => `${skill}/SKILL.md`);
  for (const map of [E2E_TOUCHFILES, LLM_JUDGE_TOUCHFILES]) {
    const expected = selectTests(renders, map);
    const actual = selectTests([source], map);
    expect(expected.reason).toBe('diff');
    expect(actual.reason).toBe('diff');
    expect(expected.selected.length).toBeGreaterThan(0);
    expect(expected.selected.filter(id => !actual.selected.includes(id))).toEqual([]);
  }
});




// This actor is used by the bounded native Design UI case, not the optional
// outside-review evaluations. Its captured inputs must select that same case.



test('native compact-boundary ancestry selects every consuming callback', () => {
  const expected = [
    'plan-ceo-mode-routing', 'autoplan-chain-pty', 'plan-ceo-finding-count',
    'plan-eng-finding-count', 'plan-design-finding-count', 'plan-devex-finding-count',
    'plan-eng-multi-finding-batching', 'plan-ceo-split-overflow',
    'plan-eng-review-plan-mode',
    'auto-decide-preserved', 'conductor-prose',
  ].sort();
  for (const file of ['test/helpers/plan-count-transcript.ts', 'test/plan-count-session-cwd.test.ts']) {
    const selected = selectTests([file], E2E_TOUCHFILES);
    expect(selected.reason).toBe('diff');
    expect(selected.selected.sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});


test('same-plan expansion disposition replay selects the existing mode helper consumers', () => {
  for (const dependency of ['test/ceo-mode-expansion-disposition.test.ts', 'test/fixtures/ceo-expansion-disposition-77.json']) {
    expect([...selectTests([dependency], E2E_TOUCHFILES).selected].sort()).toEqual(['plan-ceo-finding-count', 'plan-ceo-mode-routing']);
    expect(selectTests([dependency], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});


test('structured auto-decision evidence selects every native observer', () => {
  const expected = ['auto-decide-preserved', 'conductor-prose', 'plan-ceo-review-plan-mode',
    'plan-devex-review-plan-mode', 'plan-eng-review-plan-mode', 'plan-mode-no-op'];
  for (const file of ['test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json',
    'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json']) {
    expect([...selectTests([file], E2E_TOUCHFILES).selected].sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
  for (const file of ['bin/gstack-question-log', 'bin/gstack-question-preference']) {
    const producers = selectTests([file], E2E_TOUCHFILES).selected;
    for (const id of expected) expect(producers).toContain(id);
  }
});


test('explanatory native mode evidence selects all observers with their existing tiers', () => {
  const expected = ['auto-decide-preserved', 'conductor-prose', 'office-hours-auto-mode',
    'plan-ceo-review-plan-mode', 'plan-devex-review-plan-mode',
    'plan-eng-review-plan-mode', 'plan-mode-no-op'];
  for (const file of ['test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts',
    'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts',
    'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json']) {
    expect([...selectTests([file], E2E_TOUCHFILES).selected].sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
  expect(expected.map(id => E2E_TIERS[id])).toEqual([
    'periodic', 'periodic', 'gate', 'gate', 'gate', 'periodic', 'gate',
  ]);
});

// The workflow judge includes all carved sections, including those outside the
// entrypoint marker window (readWorkflowJudgeInput).



test('file supervision regression selects all affected callers with their existing tiers', () => {
  const gate = [
    'plan-ceo-finding-floor',
    'plan-ceo-review-benefits', 'plan-devex-finding-floor', 'plan-mode-no-op',
  ];
  const periodic = [
    'auto-decide-preserved', 'codex-plan-ceo-format-approach', 'codex-plan-ceo-format-mode',
    'codex-plan-eng-format-coverage', 'codex-plan-eng-format-kind', 'plan-ceo-mode-routing',
    'plan-ceo-review', 'plan-ceo-review-expansion-energy', 'plan-ceo-review-format-approach',
    'plan-ceo-review-format-mode', 'plan-ceo-review-prosons-cadence', 'plan-ceo-review-selective',
    'plan-design-finding-floor', 'plan-eng-finding-floor', 'plan-eng-review', 'plan-eng-review-artifact',
    'plan-eng-review-format-coverage', 'plan-eng-review-format-kind', 'plan-eng-review-plan-mode',
    'plan-review-prosons-format', 'plan-review-prosons-hardstop-neg', 'plan-review-prosons-neutral-neg',
  ];
  const changed = ['test/paid-retry-supervision.test.ts'];
  const result = selectTests(changed, E2E_TOUCHFILES);
  expect(result.reason).toBe('diff');
  expect(result.selected.sort()).toEqual([...gate, ...periodic].sort());
  for (const id of gate) expect(E2E_TIERS[id]).toBe('gate');
  for (const id of periodic) expect(E2E_TIERS[id]).toBe('periodic');
  expect(selectTests(changed, LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
});

test('floor permissions and large-report fixtures select their actual consumers', () => {
  const floors = ['plan-ceo-finding-floor', 'plan-eng-finding-floor', 'plan-design-finding-floor', 'plan-devex-finding-floor'];
  for (const file of ['test/plan-floor-permission.test.ts', 'test/fixtures/plan-floor-permission-fb10.json'])
    expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual([...floors].sort());
  const filePermissionConsumers = selectTests(['test/helpers/plan-count-file-permission.ts'], E2E_TOUCHFILES).selected;
  expect(filePermissionConsumers.sort()).toEqual([...floors, 'plan-ceo-finding-count', 'plan-eng-finding-count',
    'plan-design-finding-count', 'plan-devex-finding-count', 'plan-eng-multi-finding-batching', 'plan-ceo-split-overflow'].sort());
  expect(selectTests(['test/fixtures/ceo-report-permission-fb10.json'], E2E_TOUCHFILES).selected.sort())
    .toEqual(filePermissionConsumers);
  expect(E2E_TIERS['plan-ceo-finding-floor']).toBe('gate');
  expect(E2E_TIERS['plan-devex-finding-floor']).toBe('gate');
  expect(E2E_TIERS['plan-eng-finding-floor']).toBe('periodic');
  expect(E2E_TIERS['plan-design-finding-floor']).toBe('periodic');
});

// These existing permission checks now also serve gate floor actors.
for (const file of ['test/plan-count-cropped-wrap.test.ts', 'test/fixtures/plan-count-cropped-wrap-6714.json']) {
  test(file, () => {
    const gate = ['plan-ceo-finding-floor', 'plan-devex-finding-floor'];
    const periodic = ['plan-ceo-finding-count', 'plan-eng-finding-count', 'plan-design-finding-count',
      'plan-devex-finding-count', 'plan-eng-multi-finding-batching', 'plan-ceo-split-overflow',
      'plan-eng-finding-floor', 'plan-design-finding-floor'];
    const result = selectTests([file], E2E_TOUCHFILES);
    expect(result.reason).toBe('diff');
    expect(result.selected.sort()).toEqual([...gate, ...periodic].sort());
    for (const id of gate) expect(E2E_TIERS[id]).toBe('gate');
    for (const id of periodic) expect(E2E_TIERS[id]).toBe('periodic');
  });
}


// Shared harness repairs must select every existing consumer, including gate floors.
const nativeRepairDependencies = [
  {
    "name": "AUTO mode declarations",
    "files": [
      "test/auto-decide-recommendation-scope.test.ts",
      "test/fixtures/auto-decide-recommendation-361c.json",
      "test/auto-decide-target-identity.test.ts",
      "test/fixtures/auto-decide-target-361c.json"
    ],
    "owners": [
      "plan-ceo-review-plan-mode",
      "plan-eng-review-plan-mode",
      "plan-devex-review-plan-mode",
      "plan-mode-no-op",
      "office-hours-auto-mode",
      "auto-decide-preserved",
      "conductor-prose"
    ]
  },
  {
    "name": "owned cropped Create previews",
    "files": [
      "test/plan-create-permission.test.ts",
      "test/fixtures/plan-create-permission-361c.json"
    ],
    "owners": [
      "plan-ceo-finding-count",
      "plan-eng-finding-count",
      "plan-design-finding-count",
      "plan-devex-finding-count",
      "plan-eng-finding-floor",
      "plan-ceo-finding-floor",
      "plan-design-finding-floor",
      "plan-devex-finding-floor",
      "plan-eng-multi-finding-batching",
      "plan-ceo-split-overflow"
    ]
  },
  {
    "name": "native selection defaults",
    "files": [
      "test/plan-review-native-default.test.ts",
      "test/fixtures/eng-omitted-select-361c.json"
    ],
    "owners": [
      "plan-ceo-mode-routing",
      "plan-ceo-finding-count",
      "plan-eng-finding-count",
      "plan-design-finding-count",
      "plan-devex-finding-count",
      "plan-eng-multi-finding-batching",
      "plan-ceo-split-overflow",
      "plan-devex-peer-comparison-classification",
      "plan-decision-classification"
    ]
  },
  {
    "name": "split native question and report permission",
    "files": [
      "test/fixtures/ceo-split-padding-361c-public.json",
      "test/fixtures/ceo-split-edit-permission-361c-public.json"
    ],
    "owners": [
      "plan-ceo-split-overflow"
    ]
  },
  {
    "name": "finding-qualified floors",
    "files": [
      "test/helpers/plan-floor-review.ts",
      "test/plan-floor-review.test.ts",
      "test/fixtures/plan-floor-routing-361c.json"
    ],
    "owners": [
      "plan-ceo-finding-floor",
      "plan-eng-finding-floor",
      "plan-design-finding-floor",
      "plan-devex-finding-floor"
    ]
  },
  {
    "name": "complete long native Edit panes",
    "files": [
      "test/plan-count-long-edit.test.ts",
      "test/fixtures/plan-count-long-edit-0bcd.json"
    ],
    "owners": [
      "plan-ceo-finding-count",
      "plan-eng-finding-count",
      "plan-design-finding-count",
      "plan-devex-finding-count",
      "plan-eng-finding-floor",
      "plan-ceo-finding-floor",
      "plan-design-finding-floor",
      "plan-devex-finding-floor",
      "plan-eng-multi-finding-batching",
      "plan-ceo-split-overflow"
    ]
  },
  {
    "name": "native border on truncated questions",
    "files": [
      "test/plan-count-truncated-border.test.ts",
      "test/fixtures/eng-d2-truncated-border-0bcd.json"
    ],
    "owners": [
      "plan-ceo-review-plan-mode",
      "plan-eng-review-plan-mode",
      "plan-devex-review-plan-mode",
      "plan-mode-no-op",
      "office-hours-auto-mode",
      "auto-decide-preserved",
      "conductor-prose",
      "plan-ceo-mode-routing",
      "ship-idempotency-pty",
      "autoplan-chain-pty",
      "plan-ceo-finding-count",
      "plan-eng-finding-count",
      "plan-design-finding-count",
      "plan-devex-finding-count",
      "plan-eng-finding-floor",
      "plan-ceo-finding-floor",
      "plan-design-finding-floor",
      "plan-devex-finding-floor",
      "plan-eng-multi-finding-batching",
      "plan-ceo-split-overflow"
    ]
  }
];
for (const group of nativeRepairDependencies) {
  test(`native repair dependencies: ${group.name}`, () => {
    for (const file of group.files) {
      const selected = selectTests([file], E2E_TOUCHFILES);
      expect(selected.reason).toBe('diff');
      expect(selected.selected.sort()).toEqual([...group.owners].sort());
      expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
    }
  });
}
test('native repair dependencies preserve every original tier', () => {
  expect(E2E_TIERS).toMatchObject({
  "plan-ceo-review-plan-mode": "gate",
  "plan-eng-review-plan-mode": "periodic",
  "plan-devex-review-plan-mode": "gate",
  "plan-mode-no-op": "gate",
  "office-hours-auto-mode": "gate",
  "auto-decide-preserved": "periodic",
  "conductor-prose": "periodic",
  "plan-ceo-finding-count": "periodic",
  "plan-eng-finding-count": "periodic",
  "plan-design-finding-count": "periodic",
  "plan-devex-finding-count": "periodic",
  "plan-eng-finding-floor": "periodic",
  "plan-ceo-finding-floor": "gate",
  "plan-design-finding-floor": "periodic",
  "plan-devex-finding-floor": "gate",
  "plan-eng-multi-finding-batching": "periodic",
  "plan-ceo-split-overflow": "periodic",
  "plan-ceo-mode-routing": "periodic",
  "plan-devex-peer-comparison-classification": "periodic",
  "plan-decision-classification": "periodic"
});
});


// These dependency edges do not create new paid identities. Reuse of unchanged
// model inputs is qualified separately before a paid run.
test('promoted public transcript decoder keeps its actual callers selected', () => {
  const expected = [
    'plan-eng-review-plan-mode',
    'auto-decide-preserved',
    'conductor-prose',
    'plan-ceo-mode-routing',
    'autoplan-chain-pty',
    'plan-ceo-finding-count',
    'plan-eng-finding-count',
    'plan-design-finding-count',
    'plan-devex-finding-count',
    'plan-eng-multi-finding-batching',
    'plan-ceo-split-overflow',
    'plan-ceo-finding-floor',
    'plan-eng-finding-floor',
    'plan-design-finding-floor',
    'plan-devex-finding-floor',
  ];
  expect(selectTests(['lib/claude-public-transcript.ts'], E2E_TOUCHFILES).selected.sort())
    .toEqual(expected.sort());
  expect(selectTests(['lib/claude-public-transcript.ts'], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
});

test('Autoplan publication libraries and captured hook controls select the native chain', () => {
  for (const file of [
    'lib/autoplan-phase-publication.ts',
    'test/autoplan-publication-hook.test.ts',
    'test/autoplan-publication-generation.test.ts',
    'test/fixtures/autoplan-publication-boundary-361c.json',
    'test/fixtures/autoplan-phase-consumption-491.json',
  ]) {
    expect(selectTests([file], E2E_TOUCHFILES).selected).toEqual(['autoplan-chain-pty']);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
  // Preserve the existing autoplan/** edges; native hook controls select only
  // the chain, while a skill file change can select the existing broad owners.
  expect(selectTests(['autoplan/bin/phase-publication-hook.ts'], E2E_TOUCHFILES).selected.sort())
    .toEqual(selectTests(['autoplan/SKILL.md'], E2E_TOUCHFILES).selected.sort());
  expect(E2E_TIERS['autoplan-chain-pty']).toBe('periodic');
});

test('combined Create captures select the existing owned file-permission consumers', () => {
  const expected = [
    'plan-ceo-finding-count',
    'plan-eng-finding-count',
    'plan-design-finding-count',
    'plan-devex-finding-count',
    'plan-eng-finding-floor',
    'plan-ceo-finding-floor',
    'plan-design-finding-floor',
    'plan-devex-finding-floor',
    'plan-eng-multi-finding-batching',
    'plan-ceo-split-overflow',
  ];
  for (const file of ['test/plan-create-combined-permission.test.ts',
    'test/fixtures/plan-create-combined-permission-70b.json']) {
    expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual([...expected].sort());
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});

test('floor quotation evidence selects four assessors and product-type evidence selects only DX', () => {
  const floors = [
    'plan-ceo-finding-floor',
    'plan-eng-finding-floor',
    'plan-design-finding-floor',
    'plan-devex-finding-floor',
  ];
  expect(selectTests(['test/fixtures/plan-floor-quote-70b.json'], E2E_TOUCHFILES).selected.sort())
    .toEqual([...floors].sort());
  expect(selectTests(['test/fixtures/plan-floor-product-type-70b.json'], E2E_TOUCHFILES).selected)
    .toEqual(['plan-devex-finding-floor']);
  for (const file of ['test/plan-floor-review.test.ts', 'test/plan-floor-permission.test.ts'])
    expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual([...floors].sort());
  for (const file of ['test/fixtures/plan-floor-quote-70b.json', 'test/fixtures/plan-floor-product-type-70b.json'])
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  expect(E2E_TIERS['plan-ceo-finding-floor']).toBe('gate');
  expect(E2E_TIERS['plan-devex-finding-floor']).toBe('gate');
  expect(E2E_TIERS['plan-design-finding-floor']).toBe('periodic');
  expect(E2E_TIERS['plan-eng-finding-floor']).toBe('periodic');
});

test('DX custom setup transport selects its existing floor case without quality resampling', () => {
  for (const file of ['test/plan-floor-dx-actor.test.ts', 'test/fixtures/plan-floor-dx-custom-491.json']) {
    expect(selectTests([file], E2E_TOUCHFILES).selected).toEqual(['plan-devex-finding-floor']);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});


test('numbered native-menu captures select the existing parser consumers', () => {
  const expected = Object.entries(E2E_TOUCHFILES)
    .filter(([, files]) => files.includes('test/plan-skill-questions.test.ts'))
    .map(([id]) => id).sort();
  expect(expected).toHaveLength(20);
  for (const file of ['test/pty-numbered-option-indent-native.test.ts',
    'test/fixtures/ceo-split-e5-numbered-description-491.json']) {
    expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});


test('pending native Write captures select the existing owned-permission consumers', () => {
  const expected = Object.entries(E2E_TOUCHFILES)
    .filter(([, files]) => files.includes('test/plan-create-combined-permission.test.ts'))
    .map(([id]) => id).sort();
  expect(expected).toHaveLength(10);
  for (const file of ['test/plan-create-prepublication.test.ts',
    'test/fixtures/plan-create-prepublication-491.json']) {
    expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual(expected);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});

test('the declared engineering actor selects its existing count case', () => {
  for (const file of ['test/helpers/eng-count-question-policy.ts',
    'test/eng-count-question-policy.test.ts', 'test/fixtures/eng-count-actor-491.json']) {
    expect(selectTests([file], E2E_TOUCHFILES).selected).toEqual(['plan-eng-finding-count']);
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  }
});


test('stderr lifecycle regression selects runtime consumers without a quality-map edge', () => {
  const expected = [
    'hermetic-canary', 'hermetic-sentinel', 'first-task-scaffold',
    'review-sql-injection', 'review-enum-completeness', 'review-base-branch',
    'review-design-lite',
    'office-hours-forcing-energy', 'office-hours-builder-wildness', 'plan-ceo-review', 'plan-ceo-review-selective',
    'plan-ceo-review-benefits', 'plan-ceo-review-expansion-energy', 'plan-eng-review', 'plan-eng-review-artifact',
    'office-hours-phase4-fork', 'auq-format-gate', 'ship-section-loading', 'plan-ceo-section-loading',
    'carve-section-loading', 'plan-ceo-review-format-mode',
    'plan-ceo-review-format-approach', 'plan-eng-review-format-coverage', 'plan-eng-review-format-kind', 'plan-ceo-review-prosons-cadence', 'plan-review-prosons-format',
    'plan-review-prosons-hardstop-neg', 'plan-review-prosons-neutral-neg', 'plan-tune-inspect',
    'ship-base-branch', 'ship-local-workflow', 'review-dashboard-via',
    'retro', 'retro-base-branch',
    'learnings-show', 'timeline-event-flow', 'context-recovery-artifacts', 'context-save-writes-file', 'context-restore-loads-latest',
    'context-save-routing', 'context-save-then-restore-roundtrip', 'context-restore-fragment-match', 'context-restore-empty-state', 'context-restore-list-delegates',
    'context-restore-legacy-compat', 'context-save-list-current-branch', 'context-save-list-all-branches', 'document-release',
    'review-coverage-audit',
    'plan-eng-coverage-audit', 'ship-triage', 'ship-docsync', 'docsync-spawned', 'design-consultation-core',
    'design-consultation-existing', 'design-consultation-preview', 'design-review-plugin-handoff', 'design-html-slop-gate',
    'gstack-upgrade-happy-path', 'land-and-deploy-workflow', 'land-and-deploy-first-run', 'land-and-deploy-review-gate', 'canary-workflow',
    'benchmark-workflow', 'setup-deploy-workflow',
    'journey-ideation', 'journey-plan-eng',
    'journey-debug', 'journey-qa', 'journey-code-review', 'journey-ship', 'journey-docs',
    'journey-retro', 'journey-design-system', 'journey-visual-qa', 'fanout-arm-overlay-on', 'fanout-arm-overlay-off',
    'arm-benchmark-native-overbuild', 'arm-benchmark-crud-endpoint', 'arm-benchmark-bugfix-decoys',
  ];
  const file = 'test/session-runner-stream-lifecycle.test.ts';
  expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual(expected.sort());
  expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
});


test('collection completion lifecycle selects the existing native counter consumers', () => {
  const selected = selectTests(['test/plan-count-collection-completion.test.ts'], E2E_TOUCHFILES);
  expect(selected.reason).toBe('diff');
  expect(selected.selected.length).toBeGreaterThan(0);
  expect(selected.selected.sort()).toEqual(
    selectTests(['test/plan-count-timeout.test.ts'], E2E_TOUCHFILES).selected.sort());
  expect(selectTests(['test/plan-count-collection-completion.test.ts'], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
});

for (const file of ['test/plan-count-cross-cwd-ancestry.test.ts', 'test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json']) {
  test(`${file} selects native cwd continuation consumers`, () => {
    const selected = selectTests([file], E2E_TOUCHFILES);
    expect(selected.reason).toBe('diff');
    expect(selected.selected.sort()).toEqual([
      'auto-decide-preserved', 'autoplan-chain-pty', 'conductor-prose',
      'plan-ceo-finding-count', 'plan-ceo-mode-routing', 'plan-ceo-split-overflow',
      'plan-design-finding-count',
      'plan-devex-finding-count', 'plan-eng-finding-count', 'plan-eng-multi-finding-batching',
      'plan-eng-review-plan-mode',
    ].sort());
    expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
  });
}


test('native clipped regressions retain the existing parser and owned-permission selection', () => {
  for (const [dependency, count, files] of [
    ['test/helpers/claude-pty-runner.ts', 20, [
      'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json',
    ]],
    ['test/helpers/plan-count-file-permission.ts', 10, [
      'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json',
    ]],
  ] as const) {
    const expected = selectTests([dependency], E2E_TOUCHFILES).selected.sort();
    expect(expected).toHaveLength(count);
    for (const file of files) {
      expect(selectTests([file], E2E_TOUCHFILES).selected.sort()).toEqual(expected);
      expect(selectTests([file], LLM_JUDGE_TOUCHFILES).selected).toEqual([]);
    }
  }
});
