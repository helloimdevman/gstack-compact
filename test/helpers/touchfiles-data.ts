/**
 * Touchfile maps — the DATA half of diff-based test selection.
 *
 * LITERALS ONLY. This file must contain zero import statements and zero
 * executable logic: no function calls, no spreads, no template literals —
 * just string / array / Record literals. That property is load-bearing:
 * map-diff selection evaluates OLD git versions of this file standalone to
 * diff the maps across commits, which only works while the file stays pure,
 * importable data. test/touchfiles-facade.test.ts enforces this with a
 * comment-and-string-stripping tripwire.
 *
 * The selection logic (matchGlob, detectBaseBranch, getChangedFiles,
 * selectTests) lives in ./test-selection.ts. Import sites should keep using
 * the ./touchfiles facade, which re-exports both halves.
 */

// --- Touchfile maps ---

/**
 * E2E test touchfiles — keyed by testName (the string passed to runSkillTest).
 * Each test lists the file patterns that, if changed, require the test to run.
 */
export const E2E_TOUCHFILES: Record<string, string[]> = {
  'shared-libs-review-path-eligibility': ['review/**', 'scripts/resolvers/shared-libs.ts', 'lib/review-evidence.ts', 'bin/gstack-review-log', 'bin/gstack-review-read', 'bin/gstack-wtree', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs-paths.test.ts', 'test/helpers/shared-libs-path-fixture.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/agent-sdk-runner.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-index-flags-*.json', 'test/shared-libs-revalidation-prompt.test.ts', 'test/shared-libs-source-reads.test.ts', 'test/fixtures/shared-libs-resolved-reads-public.json'],
  'shared-libs-review-index-flags': ['review/**', 'scripts/resolvers/shared-libs.ts', 'lib/review-evidence.ts', 'bin/gstack-review-log', 'bin/gstack-review-read', 'bin/gstack-wtree', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs-paths.test.ts', 'test/helpers/shared-libs-path-fixture.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/agent-sdk-runner.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-index-flags-*.json', 'test/shared-libs-revalidation-prompt.test.ts', 'test/fixtures/shared-libs-paths-max-turns-public.json', 'test/shared-libs-source-reads.test.ts', 'test/fixtures/shared-libs-resolved-reads-public.json'],
  'shared-libs-review-prior-coverage': ['review/**', 'scripts/resolvers/shared-libs.ts', 'lib/review-evidence.ts', 'bin/gstack-review-log', 'bin/gstack-review-read', 'bin/gstack-wtree', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs-paths.test.ts', 'test/helpers/shared-libs-path-fixture.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/agent-sdk-runner.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-index-flags-*.json', 'test/shared-libs-revalidation-prompt.test.ts', 'test/shared-libs-source-reads.test.ts', 'test/fixtures/shared-libs-resolved-reads-public.json'],
  'shared-libs-codex-read-only': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'test/helpers/codex-session-runner.ts', 'test/helpers/skill-fixture.ts', 'test/helpers/hermetic-env.ts', 'test/helpers/eval-budgets.ts', 'test/codex-e2e-shared-libs.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'hosts/codex.ts', 'hosts/define-host.ts', 'scripts/resolvers/constants.ts', 'test/fixtures/shared-libs-readonly-substitution-ci16358.json'],
  // Shared-code audit and scoped review lifecycle
  'shared-libs-read-only': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-readonly-substitution-ci16358.json'],
  'shared-libs-unsupported-git': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-readonly-substitution-ci16358.json'],
  'shared-libs-review-lifecycle': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'review/**', 'lib/review-evidence.ts', 'bin/gstack-review-log', 'bin/gstack-review-read', 'bin/gstack-wtree', 'test/skill-e2e-shared-libs.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/agent-sdk-runner.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-index-flags-*.json'],
  'shared-libs-review-revalidation': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'review/**', 'lib/review-evidence.ts', 'bin/gstack-review-log', 'bin/gstack-review-read', 'bin/gstack-wtree', 'test/skill-e2e-shared-libs.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/agent-sdk-runner.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/helpers/shared-libs-review-start-evidence.ts', 'test/shared-libs-review-start-evidence.test.ts', 'test/fixtures/shared-libs-review-start-public.json', 'test/shared-libs-revalidation-prompt.test.ts', 'test/fixtures/shared-libs-revalidation-max-turns-public.json', 'test/fixtures/shared-libs-index-flags-*.json'],
  'shared-libs-opportunity-judgment': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs-periodic.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/llm-judge.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-readonly-substitution-ci16358.json'],
  'shared-libs-pr-coverage': ['deslop-shared-libs/**', 'scripts/resolvers/shared-libs.ts', 'scripts/resolvers/index.ts', 'test/helpers/shared-libs-eval-fixture.ts', 'test/skill-e2e-shared-libs-periodic.test.ts', 'test/shared-libs-fixture.test.ts', 'test/helpers/e2e-gate.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/llm-judge.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts', 'test/fixtures/shared-libs-readonly-substitution-ci16358.json'],
  'hermetic-canary':   ['test/session-runner-stream-lifecycle.test.ts', 'test/helpers/hermetic-env.ts', 'test/helpers/session-runner.ts', 'test/skill-e2e-hermetic-canary.test.ts', 'lib/conductor-env-shim.ts'],
  'hermetic-sentinel': ['test/session-runner-stream-lifecycle.test.ts', 'test/helpers/hermetic-env.ts', 'test/helpers/session-runner.ts', 'test/skill-e2e-hermetic-canary.test.ts', 'lib/conductor-env-shim.ts'],

  // P4 first-run scaffold (activation lift) — the detection binary end-to-end
  // through the real runner, plus the script wiring that gates + maps it
  // (token-reduction Phase 2: generate-first-run-guidance.ts was deleted; the
  // gate + token→tip map live in bin/gstack-skill-start's emission layer).
  'first-task-scaffold': ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'bin/gstack-first-task-detect', 'test/skill-e2e-first-task-scaffold.test.ts', 'test/helpers/session-runner.ts'],

  // SKILL.md setup + preamble (depend on ROOT SKILL.md + gen-skill-docs)
  'review-sql-injection':     ['test/session-runner-stream-lifecycle.test.ts', 'review/**', 'test/fixtures/review-eval-vuln.rb', 'test/skill-e2e-review.test.ts',
    'test/review-finalization-budget.test.ts'
  ],
  'review-enum-completeness': ['test/session-runner-stream-lifecycle.test.ts', 'review/**', 'test/fixtures/review-eval-enum*.rb', 'test/skill-e2e-review.test.ts', 'test/review-enum-lifecycle.test.ts',
    'test/review-finalization-budget.test.ts'
  ],
  'review-base-branch':       ['test/session-runner-stream-lifecycle.test.ts', 'review/**', 'test/skill-e2e-review-attribution.test.ts'],
  'review-design-lite':       ['test/session-runner-stream-lifecycle.test.ts', 'review/**', 'test/fixtures/review-eval-design-slop.*', 'test/helpers/fake-impeccable.ts', 'test/fixtures/fake-impeccable.ts', 'test/fixtures/impeccable-detect-sample.json', 'lib/design-catalog.ts', 'lib/design-detect-contract.ts', 'bin/gstack-design-detect.ts', 'scripts/resolvers/design-checklist.ts', 'test/skill-e2e-review.test.ts',
    'test/review-finalization-budget.test.ts'
  ],

  // Office Hours
  'office-hours-forcing-energy':  ['test/session-runner-stream-lifecycle.test.ts', 'office-hours/**', 'scripts/resolvers/preamble.ts', 'test/fixtures/mode-posture/**', 'test/helpers/llm-judge.ts', 'test/skill-e2e-office-hours.test.ts', 'test/office-posture-recording.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts'
  ],
  'office-hours-builder-wildness': ['test/session-runner-stream-lifecycle.test.ts', 'office-hours/**', 'scripts/resolvers/preamble.ts', 'test/fixtures/mode-posture/**', 'test/helpers/llm-judge.ts', 'test/skill-e2e-office-hours.test.ts', 'test/office-posture-recording.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts'
  ],

  // Plan reviews
  'plan-ceo-review':                  ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'test/skill-e2e-plan.test.ts',
    'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-review-selective':        ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'test/skill-e2e-plan.test.ts',
    'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-review-benefits':         ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-plan.test.ts',
    'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-review-expansion-energy': ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'test/fixtures/mode-posture/**', 'test/helpers/llm-judge.ts', 'test/skill-e2e-plan.test.ts',
    'scripts/resolvers/tasks-section.ts'
  ],
  'plan-eng-review':           ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'plan-eng-review/**', 'test/skill-e2e-plan.test.ts',
    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts'
  ],
  'plan-eng-review-artifact':  ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'plan-eng-review/**', 'test/skill-e2e-plan.test.ts',
    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts'
  ],

  // Plan-mode smoke tests — gate-tier safety regression tests. Each test file
  // contains TWO test cases as of v1.21: the baseline plan-mode case and the
  // AskUserQuestion-blocked regression case (--disallowedTools AskUserQuestion
  // parameterized — the flag set Conductor uses by default). Touchfiles
  // include question-tuning.ts and generate-ask-user-format.ts because the
  // AUTO_DECIDE preamble injection lives there and changes can flip the
  // regression test outcome between 'asked' and 'auto_decided'.
  'plan-ceo-review-plan-mode':    [
    'test/ceo-plan-mode-fixture.test.ts',
    'test/helpers/plan-count-fixture.ts',
    'test/plan-count-fixture.test.ts',
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',

    "test/fixtures/plan-scope-target-aw.json",
'test/pty-screen-unicode-ap.test.ts',
    'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-ceo-review/**', 'scripts/resolvers/question-tuning.ts', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-plan-ceo-plan-mode.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-scope-selection.ts', 'test/plan-scope-selection.test.ts', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    'test/design-scope-declaration-ak.test.ts',
    'test/design-scope-announcement-ao.test.ts', 'test/fixtures/design-scope-announcement-ao.json',
    'test/fixtures/design-scope-declaration-ak.json',
    "test/eng-option-b-scope-al.test.ts",
    "test/fixtures/eng-option-b-scope-al.json",
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-eng-review-plan-mode':    [
    'lib/claude-public-transcript.ts',
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',
'test/paid-retry-supervision.test.ts',
    'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json',
    'test/helpers/plan-count-transcript.ts', 'test/plan-count-cross-cwd-ancestry.test.ts', 'test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json', 'test/plan-count-session-cwd.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/fixtures/plan-scope-target-aw.json",

    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'test/pty-screen-unicode-ap.test.ts', 'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-eng-review/**', 'scripts/resolvers/question-tuning.ts', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-plan-eng-plan-mode.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-scope-selection.ts', 'test/plan-scope-selection.test.ts', 'test/fixtures/design-plan-scope-ag.json', 'test/design-scope-selection-aj.test.ts', 'test/fixtures/design-scope-selection-aj.json', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    'test/design-scope-declaration-ak.test.ts',
    'test/design-scope-announcement-ao.test.ts', 'test/fixtures/design-scope-announcement-ao.json',
    'test/fixtures/design-scope-declaration-ak.json',
    "test/eng-option-b-scope-al.test.ts",
    "test/fixtures/eng-option-b-scope-al.json",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/helpers/owned-claude-transcript.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/testing.ts', 'test/helpers/plan-mode-evidence.ts', 'test/plan-mode-evidence.test.ts', 'lib/redact-engine.ts', 'lib/redact-patterns.ts'
  ],
  'plan-devex-review-plan-mode':  [
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',

    "test/fixtures/plan-scope-target-aw.json",
'test/pty-screen-unicode-ap.test.ts',
    'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-devex-review/**', 'scripts/resolvers/question-tuning.ts', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-plan-devex-plan-mode.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-scope-selection.ts', 'test/plan-scope-selection.test.ts', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    'test/design-scope-declaration-ak.test.ts',
    'test/design-scope-announcement-ao.test.ts', 'test/fixtures/design-scope-announcement-ao.json',
    'test/fixtures/design-scope-declaration-ak.json',
    "test/eng-option-b-scope-al.test.ts",
    "test/fixtures/eng-option-b-scope-al.json",
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts'
  ],
  // Covers ceo (preamble misfire) + eng/design (scope-gate bypass must not
  // fire outside plan mode) + the named-target exception case. 4 PTY runs;
  // in CI these run CONCURRENT with the rest of the pty-plan-smoke suite
  // (--max-concurrency + --retry 1), so worst-case cost is ~2x a single
  // pass of each, sharing the API budget with sibling tests — not the
  // sequential ~+10min a local read suggests.
  'plan-mode-no-op':              [
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',
'test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/fixtures/plan-scope-target-aw.json",

    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-ceo-review/**', 'plan-eng-review/**', 'plan-design-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-plan-mode-no-op.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-scope-selection.ts', 'test/plan-scope-selection.test.ts', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    'test/design-scope-declaration-ak.test.ts',
    'test/design-scope-announcement-ao.test.ts', 'test/fixtures/design-scope-announcement-ao.json',
    'test/fixtures/design-scope-declaration-ak.json',
    "test/eng-option-b-scope-al.test.ts",
    "test/fixtures/eng-option-b-scope-al.json",
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/helpers/owned-claude-transcript.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/testing.ts', 'scripts/resolvers/tasks-section.ts'
  ],

  // v1.21+ AskUserQuestion-blocked regression tests — Conductor launches
  // claude with `--disallowedTools AskUserQuestion --permission-mode default`
  // (verified via `ps`); skills must still surface user-decisions through a
  // fallback path (mcp__conductor__AskUserQuestion or plan-file flow) rather
  // than silently auto-deciding. Parameterized regression test cases live
  // INSIDE the existing 4 plan-X-review-plan-mode test files (covered
  // transitively by the entries above). Two new standalone files exist for
  // skills with no prior plan-mode test:
  'office-hours-auto-mode':       [
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',
'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'office-hours/**', 'scripts/resolvers/question-tuning.ts', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-office-hours-auto-mode.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt',
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts'
  ],
  'office-hours-phase4-fork':     ['test/session-runner-stream-lifecycle.test.ts', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'office-hours/**', 'scripts/resolvers/preamble.ts', 'scripts/resolvers/question-tuning.ts', 'test/helpers/llm-judge.ts', 'test/skill-e2e-office-hours-phase4.test.ts', 'test/office-hours-phase4-caller.test.ts'],
  'llm-judge-recommendation':     ['scripts/resolvers/preamble.ts', 'test/helpers/llm-judge.ts', 'test/llm-judge-recommendation.test.ts'],
  // v1.21+ AUTO_DECIDE preserve eval (periodic). Verifies the Tool resolution
  // fix doesn't trip the legitimate /plan-tune opt-in path: when the user has
  // written a never-ask preference, AUQ should still auto-decide rather than
  // surfacing the question. Touches the question-tuning + preference
  // infrastructure plus the resolvers that own the AUTO_DECIDE preamble.
  'auto-decide-preserved':        ['scripts/resolvers/preamble.ts',
    'lib/claude-public-transcript.ts',
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',
'test/paid-retry-supervision.test.ts',
    'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json',
    'test/fixtures/auto-decide-completed-mode-f359.json',
    'test/helpers/plan-count-transcript.ts', 'test/plan-count-cross-cwd-ancestry.test.ts', 'test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json', 'test/plan-count-session-cwd.test.ts','test/pty-screen-unicode-ap.test.ts',
    'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'bin/gstack-session-kind', 'scripts/resolvers/question-tuning.ts', 'plan-ceo-review/**', 'bin/gstack-question-preference', 'bin/gstack-config', 'bin/gstack-slug', 'hosts/claude/hooks/question-preference-hook.ts', 'hosts/claude/hooks/spawned-directive.ts', 'lib/is-conductor.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-auto-decide-preserved.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts',
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/auto-decide-fixture.test.ts', 'test/fixtures/auto-decide-mode-selector-749df.json', 'lib/redact-engine.ts', 'lib/redact-patterns.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'scripts/resolvers/tasks-section.ts'
  ],

  // Conductor → prose decision brief (Conductor signal makes prose the default;
  // the PreToolUse hook denies the flaky tool). Touches the resolver that owns
  // the Conductor rule, the preamble signal, the hook, and the detection helper.
  'conductor-prose':              [
    'lib/claude-public-transcript.ts',
    'test/auto-decide-recommendation-scope.test.ts',
    'test/fixtures/auto-decide-recommendation-361c.json',
    'test/auto-decide-target-identity.test.ts',
    'test/fixtures/auto-decide-target-361c.json',

    'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json',
    'test/helpers/plan-count-transcript.ts', 'test/plan-count-cross-cwd-ancestry.test.ts', 'test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json', 'test/plan-count-session-cwd.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'test/pty-screen-unicode-ap.test.ts', 'test/conductor-prose-observation-ao.test.ts', 'test/fixtures/conductor-prose-ao.json',
    'test/auto-decide-saved-ai.test.ts', 'test/fixtures/auto-decide-saved-ai.json', 'test/fixtures/auto-decide-retry-ai.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'bin/gstack-session-kind', 'scripts/resolvers/preamble.ts', 'plan-eng-review/**', 'hosts/claude/hooks/question-preference-hook.ts', 'hosts/claude/hooks/spawned-directive.ts', 'lib/is-conductor.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-conductor-prose.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/native-auto-decide.ts', 'test/auto-decide-current-declaration.test.ts', 'test/fixtures/auto-decide-current-declaration-6aef.json', 'test/auto-decide-explanatory-mode.test.ts', 'test/fixtures/auto-decide-explanatory-mode-043a.json', 'test/fixtures/auto-decide-explanatory-mode-749df.json', 'test/auto-decide-structured.test.ts', 'test/fixtures/auto-decide-structured-77.json', 'test/helpers/auto-decision-state.ts', 'test/auto-decision-state.test.ts', 'test/fixtures/auto-decide-state-cab3.json', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'test/native-auto-decide.test.ts', 'test/native-auto-decide-pty.test.ts', 'test/helpers/fake-plan-seed.ts', 'test/fixtures/native-auto-decide-ag.json', 'test/eng-seeded-completion-ai.test.ts', 'test/fixtures/eng-seeded-completion-ai.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**',
    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/plan-seed-submission.ts', 'test/plan-seed-submission.test.ts', 'test/fixtures/plan-seed-cli.ts', 'test/helpers/owned-claude-transcript.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/testing.ts'
  ],

  // Native question capture and interactive workflow probes.
  'auq-format-gate':                           ['test/session-runner-stream-lifecycle.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/auq-sdk-capture.ts', 'test/helpers/session-runner.ts', 'test/helpers/llm-judge.ts', 'test/skill-e2e-ask-user-question-format-compliance.test.ts',
    'test/auq-mode-capture.test.ts', 'test/skill-ceo-section-ordering.test.ts',
    'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts',
    'test/helpers/auq-native-capture.ts', 'test/helpers/hermetic-env.ts',
    'test/helpers/eval-store.ts', 'lib/claude-bin.ts', 'lib/eval-model.ts',
    'test/workflow-excerpt.test.ts', 'test/session-runner-tools.test.ts',
    'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-mode-routing':       [
    'lib/claude-public-transcript.ts',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/ceo-expansion-pacing-native.test.ts', 'test/fixtures/ceo-expansion-pacing-fb10.json', 'test/helpers/ceo-hold-posture-review.ts', 'test/ceo-hold-posture-review.test.ts', 'test/fixtures/ceo-hold-proof-fb10.json', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts','test/paid-retry-supervision.test.ts',
    'test/fixtures/ceo-hold-preservation-f359.json',
    'test/fixtures/ceo-expansion-complete-inventory-6f.json',
    'test/fixtures/ceo-expansion-posture-kind-dacc.json',
    'test/fixtures/ceo-expansion-pause-6714.json',
    'test/ceo-mode-pending-submit.test.ts', 'test/fixtures/ceo-mode-pending-submit.json',
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/ceo-mode-colon-at.test.ts", "test/fixtures/ceo-mode-colon-at.json",'test/pty-screen-unicode-ap.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/ceo-mode-option.ts', 'test/ceo-mode-expansion-disposition.test.ts', 'test/fixtures/ceo-expansion-disposition-77.json', 'test/ceo-mode-option.test.ts', 'test/pty-option-selection.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/skill-e2e-plan-ceo-mode-routing.test.ts', 'test/ceo-mode-posture-native.test.ts', 'test/fixtures/ceo-hold-posture-l.json', 'test/ceo-mode-labels-native.test.ts', 'test/fixtures/ceo-mode-labels-l.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/ceo-mode-prerequisite.test.ts', 'test/fixtures/ceo-mode-prerequisite-o-calls.json', 'test/fixtures/ceo-mode-prerequisite-q-call.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/ceo-posture-packet.test.ts', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/fixtures/ceo-mode-preview-aa-screen.txt', 'test/fixtures/ceo-count-mode-preview-aa-screen.txt', 'test/ceo-expansion-auq.test.ts', 'test/fixtures/ceo-expansion-auq-ac.json', 'test/helpers/plan-count-pending-question.ts', 'test/autoplan-pending-question.test.ts', 'test/plan-pending-question-pty.test.ts', 'test/ceo-barless-submit.test.ts', 'test/fixtures/ceo-barless-submit-ac.json', 'test/pending-question-completion.test.ts', 'test/fixtures/pending-question-completion-ad.json', 'test/ceo-mode-posture-ad.test.ts', 'test/fixtures/ceo-mode-posture-ad.json', 'test/ceo-mode-full-ad.test.ts', 'test/fixtures/ceo-mode-full-ad.json', 'test/ceo-prerequisite-ad-v2.test.ts', 'test/fixtures/ceo-prerequisite-ad-v2.json', 'test/ceo-hold-posture-ag.test.ts', 'test/fixtures/ceo-hold-posture-ag.json',
    "test/ceo-hold-commitment-ar.test.ts", "test/fixtures/ceo-hold-commitment-ar.json",
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/ceo-mode-routing-fixture.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'scripts/resolvers/tasks-section.ts',
    'test/fixtures/ceo-expansion-pacing-77.json',
  ],
  'ship-idempotency-pty':        ['ship/**', 'bin/gstack-next-version', 'bin/gstack-version-bump', 'scripts/resolvers/sections.ts', 'lib/worktree.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/skill-e2e-ship-idempotency.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt',
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/testing.ts'
  ],
  'ship-section-loading':        ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'scripts/resolvers/sections.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/auq-sdk-capture.ts', 'test/helpers/session-runner.ts', 'test/session-runner-tools.test.ts', 'test/skill-e2e-ship-section-loading.test.ts',
    'test/section-capture-native-tools.test.ts', 'test/ship-section-fixture.test.ts', 'scripts/resolvers/testing.ts'
  ],
  'plan-ceo-section-loading':    ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/fixtures/ceo-fill-lifetime.json','plan-ceo-review/**', 'test/skill-ceo-section-ordering.test.ts', 'scripts/resolvers/sections.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/auq-sdk-capture.ts', 'test/helpers/session-runner.ts', 'test/session-runner-tools.test.ts', 'test/helpers/ceo-section-loading-fixture.ts', 'test/ceo-section-loading-fixture.test.ts', 'test/skill-e2e-plan-ceo-review-section-loading.test.ts', 'test/fixtures/ceo-section-loading-l-report.md', 'test/fixtures/ceo-section-loading-q-report.md', 'test/fixtures/ceo-section-r-rejected-report.md', 'test/fixtures/ceo-section-s-trace-report.md', 'test/fixtures/ceo-section-u-report.md', 'test/fixtures/ceo-section-y-report.md', 'test/fixtures/ceo-section-aa-report.md', 'test/sdk-stale-table-ad-v3.test.ts', 'test/fixtures/sdk-stale-table-ad-v3.json', 'test/sdk-ordering-ae.test.ts', 'test/fixtures/sdk-ordering-ae.json', 'test/sdk-columnar-af.test.ts', 'test/fixtures/sdk-columnar-af.json', 'test/sdk-order-b-ag.test.ts', 'test/fixtures/sdk-order-b-ag.json', 'test/sdk-schedule-continuation-ah.test.ts', 'test/fixtures/sdk-schedule-continuation-ah.json', 'test/sdk-original-order-ai.test.ts', 'test/fixtures/sdk-original-order-ai.json', 'test/sdk-compact-sequence-aj.test.ts', 'test/fixtures/sdk-compact-sequence-aj.json',
    "test/sdk-reported-coordination-ar.test.ts", "test/fixtures/sdk-reported-coordination-ar.md", "test/sdk-ordered-schedule-ar.test.ts", "test/fixtures/sdk-ordered-schedule-ar.md",
    'test/section-capture-native-tools.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  // Data-driven behavioral guard for the 'plan'/'prompt' carves (eng, design,
  // devex, office-hours + future PR2 carves). One file iterating CARVE_GUARDS;
  // the selector sets GSTACK_CARVE_SKILL=<name> to scope cost to the changed
  // skill (D-CODEX A). Touching the registry/helper or sections.ts runs all.
  'carve-section-loading':       ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'bin/gstack-review-log', 'bin/gstack-review-read', 'lib/review-evidence.ts',
    'bin/gstack-slug', 'bin/gstack-wtree', 'bin/gstack-config', 'test/fixtures/autoplan-amend-input-77.json',
    'test/fixtures/autoplan-phase-handoff-6714.json','scripts/resolvers/learnings.ts', 'test/gstack-paths.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'scripts/resolvers/composition.ts', 'design-html/**', 'design-shotgun/**', 'qa/**', 'browse/**', 'retro/**', 'autoplan/**', 'spec/**', 'review/**', 'land-and-deploy/**', 'plan-eng-review/**', 'plan-design-review/**', 'plan-devex-review/**', 'document-release/**', 'design-consultation/**', 'test/helpers/carve-guards.ts', 'scripts/resolvers/sections.ts', 'scripts/resolvers/redact-doc.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/auq-sdk-capture.ts', 'test/helpers/session-runner.ts', 'test/session-runner-tools.test.ts', 'bin/gstack-autoplan-snapshot.ts', 'test/fixtures/autoplan/t-ceo-omitted-obligations.json', 'test/fixtures/autoplan/u-ceo-original-loss.json', 'test/fixtures/autoplan/v-ceo-dangling-references.json',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/section-capture-native-tools.test.ts', 'test/carve-section-loading*.test.ts', 'test/carve-section-loading-ship.test.ts', 'test/carve-section-loading-plan.test.ts', 'test/carve-section-loading-verify.test.ts', 'test/carve-section-loading-design.test.ts', 'test/carve-section-loading-context.test.ts', 'test/helpers/carve-section-case.ts', 'test/carve-section-sharding.test.ts', 'test/carve-section-loading-document-release.test.ts', 'test/carve-section-loading-land-and-deploy.test.ts', 'test/carve-section-loading-retro.test.ts', 'test/carve-section-loading-review.test.ts', 'scripts/resolvers/testing.ts', 'test/helpers/carve-plan-fixture.ts', 'test/carve-plan-fixture.test.ts', 'test/fixtures/carve-existing-repository/**'
  ],
  'autoplan-chain-pty':          ['scripts/resolvers/preamble.ts',
    'lib/claude-public-transcript.ts', 'lib/autoplan-phase-publication.ts', 'autoplan/bin/phase-publication-hook.ts', 'test/autoplan-publication-hook.test.ts', 'test/autoplan-publication-generation.test.ts', 'test/fixtures/autoplan-publication-boundary-361c.json', 'test/fixtures/autoplan-phase-consumption-491.json',
    'test/fixtures/autoplan-home-phase-entry-fb10.json',
    'test/fixtures/autoplan-amend-input-77.json',
    'test/fixtures/autoplan-phase-handoff-6714.json',
    'test/eng-test-plan-edit-approval.test.ts',
    'test/fixtures/eng-test-plan-edit-dacc.json',
    'test/fixtures/eng-test-plan-edit-cli.js',
    'test/autoplan-owned-state.test.ts', 'test/fixtures/autoplan-owned-state-edit.json',
    'test/eng-finding-retry-budget.test.ts','scripts/resolvers/learnings.ts', "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/autoplan-cropped-gate-av.test.ts",
    "test/fixtures/autoplan-cropped-gate-av.json",
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/autoplan-cropped-command-av.test.ts",
    "test/fixtures/autoplan-cropped-command-av.json",
    "test/autoplan-overwrite-progress-ax.test.ts",
    "test/fixtures/autoplan-overwrite-progress-ax.json",
    "test/fixtures/design-scope-checkpoint-at.json",
    "test/autoplan-rendered-batch-at.test.ts", "test/fixtures/autoplan-rendered-batch-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/autoplan-routing-label-ap.test.ts', 'test/fixtures/autoplan-routing-label-ap.json', 'scripts/resolvers/composition.ts', 'autoplan/**', 'plan-ceo-review/**', 'plan-design-review/**', 'plan-eng-review/**', 'plan-devex-review/**', 'test/fixtures/plans/autoplan-dashboard.md', 'test/autoplan-chain-fixture.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'bin/gstack-config', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/autoplan-setup-question.ts', 'test/autoplan-setup-question.test.ts', 'test/helpers/autoplan-phase-observer.ts', 'test/autoplan-phase-observer.test.ts', 'test/autoplan-phase-dash-ao.test.ts', 'test/fixtures/autoplan-phase-dash-ao.json', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/skill-e2e-autoplan-chain.test.ts', 'bin/gstack-autoplan-snapshot.ts', 'test/fixtures/autoplan/t-ceo-omitted-obligations.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/helpers/eval-budgets.ts', 'test/autoplan-eval-budget.test.ts', 'test/eval-budgets-policy.test.ts', 'test/eval-detach-timeout-floor.test.ts', 'scripts/test-paid-shards.ts', '.github/workflows/evals-periodic.yml', 'test/fixtures/autoplan-routing-n-screen.txt', 'test/autoplan-routing-o.test.ts', 'test/fixtures/autoplan-routing-o-screen.txt', 'test/autoplan-setup-packet-o.test.ts', 'test/fixtures/autoplan-setup-packet-o-screen.txt', 'test/fixtures/autoplan-setup-packet-o-call.json', 'test/fixtures/autoplan/u-ceo-original-loss.json', 'test/fixtures/autoplan/v-ceo-dangling-references.json', 'test/fixtures/autoplan-setup-z-packet.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/autoplan-method-read-audit.ts', 'test/fixtures/autoplan-method-read-aa-events.json', 'test/fixtures/autoplan-phase-entry-cf74.json', 'test/fixtures/autoplan-phase-entry-alias-f359.json', 'test/autoplan-routing-manual-skills.test.ts', 'test/fixtures/autoplan-routing-manual-skills-ac.json', 'test/helpers/plan-count-pending-question.ts', 'test/autoplan-pending-question.test.ts', 'test/plan-pending-question-pty.test.ts', 'test/pending-question-completion.test.ts', 'test/fixtures/pending-question-completion-ad.json', 'test/fixtures/autoplan-setup-ad-v2-packet.json', 'test/helpers/autoplan-artifact-permission.ts', 'test/autoplan-artifact-permission.test.ts', 'test/fixtures/autoplan-artifact-permission-ad-v3.json', 'scripts/resolvers/testing.ts', 'test/helpers/autoplan-artifact-recorder.ts', 'test/autoplan-artifact-recorder.test.ts', 'test/autoplan-artifact-windows-argv.test.ts', 'test/autoplan-pending-artifact.test.ts', 'test/fixtures/autoplan-pending-artifact-ae.json', 'test/autoplan-edit-header-ag.test.ts', 'test/fixtures/autoplan-edit-header-ag.json', 'test/autoplan-edit-prefix-ai.test.ts', 'test/fixtures/autoplan-edit-prefix-ai.json', 'test/autoplan-edit-panel-aj.test.ts', 'test/fixtures/autoplan-edit-panel-aj.json',
    'test/autoplan-repeated-header-ak.test.ts',
    'test/fixtures/autoplan-repeated-header-ak.json',
    "test/helpers/autoplan-artifact-digest.ts",
    "test/autoplan-edit-digests-al.test.ts",
    "test/fixtures/autoplan-edit-digests-al.json",
    "test/autoplan-edit-queue-am.test.ts",
    "test/fixtures/autoplan-edit-queue-am.json",
    "test/autoplan-edit-edges-an.test.ts",
    "test/fixtures/autoplan-edit-edges-an.json",
      'test/autoplan-final-gate-ao.test.ts',
    'test/fixtures/autoplan-final-gate-ao.json',
    "test/autoplan-clipped-suffix-aq.test.ts", "test/fixtures/autoplan-clipped-suffix-aq.json", "test/design-scope-entry-aq.test.ts",
    "test/helpers/autoplan-preconfigured-fixture.ts", "test/autoplan-preconfigured-onboarding-ar.test.ts",
    "test/autoplan-artifact-stall-as.test.ts", "test/fixtures/autoplan-artifact-stall-as.json",

    "test/review-entry-and-design-clarity-au.test.ts", "test/autoplan-with-result-au.test.ts", "test/fixtures/autoplan-with-result-au.json", "test/autoplan-command-prefix-au.test.ts", "test/fixtures/autoplan-command-prefix-au.json",
    'scripts/resolvers/design-doc-discovery.ts', 'bin/gstack-skill-start', 'bin/gstack-paths', 'test/gstack-paths.test.ts', 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/autoplan-permission-viewport.test.ts', 'scripts/resolvers/tasks-section.ts', 'scripts/resolvers/design.ts', 'test/fixtures/autoplan-settings-overwrite.json'
  ],

  // Per-finding AskUserQuestion count + review-report-at-bottom assertion.
  // Each test drives its skill end-to-end; touchfiles include preamble +
  // completion-status resolvers because they affect question cadence and
  // terminal output (the regression surface this test catches).
  'plan-ceo-finding-count':      [
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json',
    'test/ceo-current-decision-record.test.ts', 'test/fixtures/ceo-current-decision-cdd-public.json',
    'test/ceo-native-fields-f359.test.ts', 'test/fixtures/ceo-native-fields-f359.json', 'test/fixtures/ceo-plain-fields-f359.json',
    'test/ceo-conditional-option-facts.test.ts', 'test/fixtures/ceo-conditional-option-facts-c6fc.json',
    'test/ceo-incomplete-save-b176.test.ts', 'test/fixtures/ceo-incomplete-save-b176.json',
    'test/fixtures/ceo-recorded-decisions-67147822.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/eng-finding-retry-budget.test.ts',
    'test/ceo-native-ledger-replay.test.ts', 'test/fixtures/ceo-native-ledger-8525.json',
    'test/fixtures/ceo-option-metadata-list-6f6730f4.json',
    'test/fixtures/ceo-zero-test-absence-6f6730f4.json',
    'test/fixtures/ceo-onboarding-packet-90f.json', 'test/fixtures/ceo-baseline-alternatives-90f.json',
    'test/fixtures/ceo-recorded-decisions-dacc95ea.json',
    'test/helpers/ceo-payment-findings.ts', 'test/ceo-source-attribution.test.ts', 'test/fixtures/ceo-source-attribution-6aef.json', 'test/fixtures/ceo-current-record-6aef.json', 'test/ceo-payment-findings.test.ts', 'test/fixtures/ceo-payment-ledger-decisions.json',
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/ceo-annotation-header-at.test.ts", "test/fixtures/ceo-annotation-header-at.json", "test/ceo-section-parenthesis-at.test.ts", "test/fixtures/ceo-section-parenthesis-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/ceo-current-omission-ap.test.ts', 'test/fixtures/ceo-current-omission-ap.json', 'test/ceo-declarative-premise-ap.test.ts', 'test/fixtures/ceo-declarative-premise-ap.json', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/helpers/dx-selected-navigation.ts', 'test/dx-selected-navigation-ap.test.ts', 'test/fixtures/dx-selected-navigation-ap.json', 'test/dx-manual-handoff-ao.test.ts', 'test/fixtures/dx-manual-handoff-ao.json', 'bin/gstack-config', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-ceo-review/**', 'test/skill-ceo-section-ordering.test.ts', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/plan-count-completion.test.ts', 'test/plan-count-dx-handoff.test.ts', 'test/fixtures/devex-handoff-n-call.json', 'test/helpers/ceo-completion-handoff.ts', 'test/ceo-completion-handoff.test.ts', 'test/ceo-count-s-terminals.test.ts', 'test/fixtures/ceo-count-s-paired.json', 'test/fixtures/ceo-completion-handoff-calls.json', 'test/fixtures/ceo-completion-handoff-j-calls.json', 'test/fixtures/ceo-completion-handoff-k-calls.json', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/skill-e2e-plan-ceo-finding-count.test.ts', 'test/ceo-completion-handoff-l.test.ts', 'test/fixtures/ceo-completion-handoff-l-calls.json', 'test/ceo-completion-handoff-m.test.ts', 'test/fixtures/ceo-completion-handoff-m-call.json', 'test/fixtures/devex-review-l-calls.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/fixtures/ceo-handoff-n-calls.json', 'test/ceo-completion-handoff-o.test.ts', 'test/fixtures/ceo-completion-handoff-o-call.json', 'test/plan-count-empty-review.test.ts', 'test/fixtures/ceo-count-s-distinct.json', 'test/fixtures/plan-count-design-questionless-report.md', 'test/plan-count-dx-handoff-o.test.ts', 'test/fixtures/devex-handoff-o-call.json', 'test/helpers/ceo-approach-pick.ts', 'test/ceo-approach-pick.test.ts', 'test/fixtures/ceo-approach-q-call.json', 'test/fixtures/ceo-approach-r-call.json', 'test/fixtures/ceo-approach-r-distinct-call.json', 'test/fixtures/ceo-approach-q-paired-call.json', 'test/fixtures/ceo-completion-handoff-q-call.json', 'test/fixtures/ceo-completion-handoff-r-calls.json', 'test/fixtures/ceo-completion-handoff-t-call.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/fixtures/ceo-completion-handoff-u-call.json', 'test/fixtures/ceo-completion-handoff-v-call.json', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/plan-count-ceo-body-finding.test.ts', 'test/fixtures/ceo-count-w-paired.json', 'test/fixtures/ceo-completion-handoff-w-call.json', 'test/fixtures/ceo-approach-y-call.json', 'test/fixtures/ceo-approach-y-screen.txt', 'test/ceo-handoff-y.test.ts', 'test/fixtures/ceo-handoff-y-call.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/fixtures/ceo-handoff-z-call.json', 'test/fixtures/ceo-approach-aa-call.json', 'test/review-handoffs-aa.test.ts', 'test/fixtures/review-handoff-aa-ceo.json', 'test/fixtures/review-handoff-aa-dx.json', 'test/helpers/ceo-mode-option.ts', 'test/ceo-mode-expansion-disposition.test.ts', 'test/fixtures/ceo-expansion-disposition-77.json', 'test/ceo-count-mode.test.ts', 'test/fixtures/ceo-count-mode-ab-call.json', 'test/ceo-count-ac.test.ts', 'test/fixtures/ceo-count-ac-calls.json', 'test/fixtures/ceo-count-ac-later-calls.json', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/ceo-count-ad-v2.test.ts', 'test/fixtures/ceo-count-ad-v2.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/fixtures/ceo-finding-alias-af.json', 'test/fixtures/ceo-numbered-brief-af.json', 'test/ceo-contract-assertions-ag.test.ts', 'test/fixtures/ceo-contract-assertions-ag.json', 'test/fixtures/ceo-contract-assertions-ag-retry.json', 'test/fixtures/plan-count-permission-ah.json', 'test/ceo-parenthesized-issue-ah.test.ts', 'test/fixtures/ceo-parenthesized-issue-ah.json', 'test/ceo-section-choice-ai.test.ts', 'test/fixtures/ceo-section-choice-ai.json', 'test/fixtures/ceo-metadata-brief-ax.json', 'test/ceo-annotation-aj.test.ts', 'test/fixtures/ceo-annotation-aj.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/ceo-numbered-brief-ak.test.ts',
    'test/fixtures/ceo-numbered-brief-ak.json',
    'test/ceo-finding-brief-ak.test.ts',
    'test/fixtures/ceo-finding-brief-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    "test/ceo-decision-prefix-al.test.ts",
    "test/fixtures/ceo-decision-prefix-al.json",
    "test/ceo-assertion-header-am.test.ts",
    "test/fixtures/ceo-assertion-header-am-calls.json",
    "test/ceo-contract-question-an.test.ts",
    "test/fixtures/ceo-contract-question-an.json",
    "test/fixtures/ceo-section-finding-an.json",
    "test/fixtures/ceo-current-contract-an.json",
      'test/ceo-test-subject-ao.test.ts',
    'test/fixtures/ceo-test-subject-ao.json',
    "test/ceo-sequence-aq.test.ts", "test/fixtures/ceo-sequence-aq.json", "test/ceo-section-ordering-aq.test.ts", "test/fixtures/ceo-section-ordering-aq.json",
    "test/ceo-transaction-contract-ar.test.ts", "test/fixtures/ceo-transaction-contract-ar.json", "test/ceo-section-declarative-ar.test.ts", "test/fixtures/ceo-section-declarative-ar.json",
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/skill-e2e-plan-ceo-finding-count.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'test/helpers/ceo-paired-fixture.ts', 'test/ceo-paired-payment-fixture.test.ts', 'test/fixtures/ceo-paired-option-values.json', 'test/fixtures/paired-payment/**', 'test/fixtures/ceo-existing-payment/**', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-eng-finding-count':      [
    'test/helpers/eng-count-question-policy.ts', 'test/eng-count-question-policy.test.ts', 'test/fixtures/eng-count-actor-491.json',
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/eng-semantic-terminal.test.ts', 'test/fixtures/eng-fb10-count-public.json', 'test/fixtures/ceo-report-permission-fb10.json',
    'test/eng-error-flow-seed.test.ts', 'test/fixtures/eng-69193-count-public.json', 'test/fixtures/eng-e366-count-public.json',
    'test/eng-initial-selector-043a.test.ts',
    'test/fixtures/eng-initial-selector-043a.json',
    'test/fixtures/eng-count-c6fc-public.json',
    'test/fixtures/eng-cdd-regression-task.json',
    'test/eng-resolution-block-position.test.ts',
    'test/eng-count-owned-outcomes.test.ts', 'test/fixtures/eng-count-owned-outcomes-f359.json',
    'test/eng-task-pause-navigation-f359.test.ts', 'test/fixtures/eng-task-pause-navigation-f359.json',
    'test/fixtures/eng-current-choice-cab3.json', 'test/fixtures/eng-completed-navigation-cab3.json',
    'test/eng-native-seed-contract.test.ts', 'test/fixtures/eng-native-seed-contract-6f.json',
    'test/fixtures/eng-native-packets-b955.json',
    'test/fixtures/eng-structure-choice-90f.json',
    'test/fixtures/eng-idp-choice-90f.json',
    'test/fixtures/eng-legacy-declaration-90f.json',
    'test/review-count-markdown.test.ts', 'test/fixtures/review-count-markdown-6f.json',
    'test/eng-current-native-seeds.test.ts',
    'test/fixtures/eng-current-native-seeds-6714.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/eng-batching-saved-ledger.test.ts',
    'test/fixtures/eng-batching-saved-ledger-dacc.json',
    'test/fixtures/eng-batching-expanded-ledger-6714.json',
    'test/fixtures/eng-native-review-identities-6714.json',
    'test/eng-test-plan-edit-approval.test.ts',
    'test/fixtures/eng-test-plan-edit-dacc.json',
    'test/fixtures/eng-test-plan-edit-cli.js',
    'test/helpers/autoplan-artifact-recorder.ts',
    'test/helpers/autoplan-artifact-permission.ts',
    'test/helpers/autoplan-artifact-digest.ts',
    'test/autoplan-artifact-recorder.test.ts', 'test/autoplan-artifact-windows-argv.test.ts',
    'test/autoplan-artifact-permission.test.ts',
    'test/autoplan-edit-digests-al.test.ts',
    'test/fixtures/autoplan-edit-digests-al.json',
    'test/eng-finding-retry-budget.test.ts',
    'test/eng-published-navigation.test.ts', 'test/fixtures/eng-published-navigation.json',
    'test/fixtures/eng-current-ledger-seeds.json',
    'scripts/resolvers/learnings.ts',
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",
    "test/eng-scheduled-regression.test.ts",
    "test/eng-owned-explanation.test.ts", "test/fixtures/eng-owned-explanation.json",

    "test/eng-architecture-cache-av.test.ts",
    "test/fixtures/eng-architecture-cache-av-calls.json",
    "test/eng-paired-regression-av.test.ts",
    "test/fixtures/eng-paired-regression-av.md",
    "test/eng-owned-seeds-av.test.ts",
    "test/fixtures/eng-owned-seeds-av.json",
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/eng-retry-coverage-at.test.ts", "test/fixtures/eng-retry-coverage-at.json", "test/fixtures/eng-retry-baseline-at.md",
    "test/eng-blocking-baseline-at.test.ts", "test/fixtures/eng-blocking-baseline-at.md",'test/pty-screen-unicode-ap.test.ts', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/helpers/dx-selected-navigation.ts', 'test/dx-selected-navigation-ap.test.ts', 'test/fixtures/dx-selected-navigation-ap.json', 'test/dx-manual-handoff-ao.test.ts', 'test/fixtures/dx-manual-handoff-ao.json', 'bin/gstack-config', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-eng-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/plan-count-completion.test.ts', 'test/plan-count-dx-handoff.test.ts', 'test/fixtures/devex-handoff-n-call.json', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/skill-e2e-plan-eng-finding-count.test.ts', 'test/fixtures/devex-review-l-calls.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/plan-count-empty-review.test.ts', 'test/fixtures/ceo-count-s-distinct.json', 'test/fixtures/plan-count-design-questionless-report.md', 'test/plan-count-dx-handoff-o.test.ts', 'test/fixtures/devex-handoff-o-call.json', 'test/eng-devex-s-count.test.ts', 'test/fixtures/eng-devex-s-first-calls.json', 'test/fixtures/eng-devex-s-retry-calls.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/eng-first-review-t.test.ts', 'test/fixtures/eng-batching-t-calls.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/eng-scope-y.test.ts', 'test/fixtures/eng-scope-y-calls.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/eng-binding-z.test.ts', 'test/fixtures/eng-binding-z-calls.json', 'test/eng-binding-retry-z.test.ts', 'test/fixtures/eng-binding-retry-z-calls.json', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/helpers/eng-completion-handoff.ts', 'test/eng-count-ad-v2.test.ts', 'test/fixtures/eng-count-ad-v2.json', 'test/helpers/eng-seeded-coverage.ts', 'test/fixtures/eng-neutral-seed-749df.json', 'test/fixtures/eng-paired-suite-749df.json', 'test/fixtures/eng-a689-count-public.json', 'test/fixtures/eng-6aef-count-public.json', 'test/fixtures/eng-a689-retry-public.json', 'test/eng-seeded-coverage.test.ts', 'test/eng-seeded-packet-ae.test.ts', 'test/fixtures/eng-seeded-packet-ae.json', 'test/eng-first-category-af.test.ts', 'test/fixtures/eng-first-category-af.json', 'test/eng-regression-pinning-ag.test.ts', 'test/fixtures/eng-regression-pinning-ag.json', 'test/fixtures/plan-count-permission-ah.json', 'test/eng-next-handoff-ah.test.ts', 'test/fixtures/eng-next-handoff-ah.json', 'test/eng-declared-regression-ai.test.ts', 'test/fixtures/eng-declared-regression-ai.json', 'test/eng-snapshot-adapter-aj.test.ts', 'test/fixtures/eng-snapshot-adapter-aj.json',
    'test/eng-declared-suite-ak.test.ts',
    'test/fixtures/eng-declared-suite-ak.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    "test/eng-golden-master-al.test.ts",
    "test/fixtures/eng-golden-master-al.json",
    "test/eng-cache-brief-am.test.ts",
    "test/fixtures/eng-cache-brief-am.json",
    "test/eng-legacy-contract-am.test.ts",
    "test/fixtures/eng-legacy-contract-am.json",
    "test/eng-retry-contract-am.test.ts",
    "test/fixtures/eng-retry-contract-am.json",
    "test/eng-cache-owner-an.test.ts",
    "test/fixtures/eng-cache-owner-an.json",
    "test/eng-golden-parity-an.test.ts",
    "test/fixtures/eng-golden-parity-an.json",
    "test/eng-injected-export-aq.test.ts", "test/fixtures/eng-injected-export-aq.json", "test/eng-staged-regression-aq.test.ts", "test/fixtures/eng-staged-regression-aq.md", "test/eng-library-hooks-aq.test.ts", "test/fixtures/eng-library-hooks-aq.json",
    "test/eng-before-rewrite-ar.test.ts", "test/fixtures/eng-before-rewrite-ar.md",
    "test/eng-declarative-as.test.ts", "test/fixtures/eng-declarative-as.json", "test/eng-mandatory-baseline-as.test.ts", "test/fixtures/eng-mandatory-baseline-as.md", "test/helpers/eng-cache-writer-decision.ts", "test/eng-cache-writes-as.test.ts", "test/fixtures/eng-cache-writes-as.json", "test/eng-retry-coverage-as.test.ts", "test/fixtures/eng-retry-coverage-as.json", "test/fixtures/eng-retry-baseline-as.md",

    "test/eng-required-parity-au.test.ts", "test/fixtures/eng-required-parity-au.md", "test/helpers/eng-retained-corpus.ts", "test/eng-retained-corpus-au.test.ts", "test/fixtures/eng-retained-corpus-au.md", "test/eng-annotated-cache-au.test.ts", "test/fixtures/eng-annotated-cache-au.json", "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'scripts/resolvers/testing.ts', 'test/helpers/eng-finding-fixture.ts', 'test/eng-finding-fixture.test.ts', 'test/fixtures/eng-existing-auth/**'
  ],
  'plan-design-finding-count':   [
    'test/helpers/design-count-fixture.ts', 'test/design-count-fixture.test.ts', 'test/fixtures/design-count-sep20-calls.json', 'test/fixtures/design-count-sep21-first-call.json', 'test/fixtures/design-count-sep21-confirm-first-call.json',
    'test/design-count-primary-facts.test.ts', 'test/fixtures/design-count-sep21-declared-first-call.json', 'test/fixtures/design-count-sep21-header-first-call.json',
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json',
    'test/review-count-markdown.test.ts', 'test/fixtures/review-count-markdown-6f.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/design-count-current-pass.test.ts',
    'test/fixtures/design-count-current-pass.json',
    'test/eng-finding-retry-budget.test.ts',
    'test/design-count-native-8525.test.ts', 'test/fixtures/design-count-native-8525.json', 'test/fixtures/design-phase-entry-77.json',
    'test/design-count-native-issue-fields.test.ts', 'test/fixtures/design-count-native-issue-fields.json',
    'test/fixtures/design-completion-envelope-90f.json',
    "test/design-compact-primary-aw.test.ts",
    "test/fixtures/design-compact-primary-aw-call.json",
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/design-primary-emphasis-av.test.ts",
    "test/fixtures/design-primary-emphasis-av-calls.json",
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/helpers/dx-selected-navigation.ts', 'test/dx-selected-navigation-ap.test.ts', 'test/fixtures/dx-selected-navigation-ap.json', 'test/dx-manual-handoff-ao.test.ts', 'test/fixtures/dx-manual-handoff-ao.json', 'bin/gstack-config', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-design-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/plan-count-completion.test.ts', 'test/plan-count-dx-handoff.test.ts', 'test/fixtures/devex-handoff-n-call.json', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/helpers/design-count-review.ts', 'test/design-count-review.test.ts', 'test/fixtures/design-review-j-calls.json', 'test/skill-e2e-plan-design-finding-count.test.ts', 'test/fixtures/design-review-l-calls.json', 'test/design-completion-handoff.test.ts', 'test/fixtures/design-handoff-l-calls.json', 'test/fixtures/devex-review-l-calls.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/fixtures/design-review-n-calls.json', 'test/design-completion-handoff-scored.test.ts', 'test/fixtures/design-handoff-n-calls.json', 'test/fixtures/design-handoff-q-calls.json', 'test/plan-count-empty-review.test.ts', 'test/fixtures/ceo-count-s-distinct.json', 'test/fixtures/plan-count-design-questionless-report.md', 'test/plan-count-dx-handoff-o.test.ts', 'test/fixtures/devex-handoff-o-call.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/design-completion-handoff-u.test.ts', 'test/fixtures/design-handoff-u-calls.json', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/helpers/design-artifact-question.ts', 'test/design-artifact-question.test.ts', 'test/fixtures/design-artifacts-w-calls.json', 'test/fixtures/design-boundaries-y-calls.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/fixtures/design-gap-z-calls.json', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/design-count-ad-v2.test.ts', 'test/fixtures/design-count-ad-v2.json', 'test/design-first-decision-af.test.ts', 'test/fixtures/design-first-decision-af.json', 'test/fixtures/design-first-decision-af-retry.json', 'test/fixtures/plan-count-permission-ah.json', 'test/design-first-issue-ai.test.ts', 'test/fixtures/design-first-issue-ai.json', 'test/design-primary-action-aj.test.ts', 'test/fixtures/design-primary-action-aj.json', 'test/fixtures/design-future-todo-aj.json',
    'test/design-primary-contract-ak.test.ts',
    'test/fixtures/design-primary-contract-ak.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    "test/design-primary-decision-al.test.ts",
    "test/fixtures/design-primary-decision-al.json",
    "test/design-variant-choice-am.test.ts",
    "test/fixtures/design-variant-choice-am.json",
    "test/fixtures/design-variant-choice-am-retry.json",
    "test/design-primary-composition-an.test.ts",
    "test/fixtures/design-primary-composition-an.json",
    "test/design-primary-treatment-ao.test.ts",
    "test/fixtures/design-primary-treatment-ao.json",
    "test/design-primary-assignment-ao.test.ts",
    "test/fixtures/design-primary-assignment-ao.json",
    "test/design-primary-header-aq.test.ts", "test/fixtures/design-primary-header-aq.json", "test/design-scope-entry-aq.test.ts",
    "test/design-primary-group-as.test.ts", "test/fixtures/design-primary-group-as-calls.json",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'design/src/daemon-state.ts', 'design/src/daemon.ts', 'design/test/daemon-tests-fixtures.ts', 'design/src/daemon-client.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'test/design-finding-fixture.test.ts', 'bin/gstack-paths', 'bin/gstack-slug', 'scripts/resolvers/design.ts'
  ],
  'plan-devex-finding-count':    [
    'test/fixtures/devex-seed-sep21-calls.json',
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json',
    'test/fixtures/devex-journey-evidence-cab3.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/eng-finding-retry-budget.test.ts',
    "test/dx-upgrade-transition-aw.test.ts",
    "test/fixtures/dx-upgrade-transition-aw.json",
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/dx-reversed-tuples-av.test.ts",
    "test/fixtures/dx-reversed-tuples-av.json",
    "test/dx-journey-field-at.test.ts", "test/fixtures/dx-journey-field-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/helpers/dx-selected-navigation.ts', 'test/dx-selected-navigation-ap.test.ts', 'test/fixtures/dx-selected-navigation-ap.json', 'test/dx-manual-handoff-ao.test.ts', 'test/fixtures/dx-manual-handoff-ao.json', 'bin/gstack-config', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-devex-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/plan-count-completion.test.ts', 'test/plan-count-dx-handoff.test.ts', 'test/fixtures/devex-handoff-n-call.json', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/helpers/devex-count-fixture.ts', 'test/devex-count-fixture.test.ts', 'test/skill-e2e-plan-devex-finding-count.test.ts', 'test/fixtures/dx-prerequisite-r-call.json', 'test/fixtures/devex-review-l-calls.json', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/fixtures/devex-review-n-calls.json', 'test/plan-count-empty-review.test.ts', 'test/fixtures/ceo-count-s-distinct.json', 'test/fixtures/plan-count-design-questionless-report.md', 'test/devex-output-o.test.ts', 'test/fixtures/devex-review-o-calls.json', 'test/fixtures/devex-output-o-retry-call.json', 'test/devex-setup-remedy-o.test.ts', 'test/fixtures/devex-review-o-retry-calls.json', 'test/plan-count-dx-handoff-o.test.ts', 'test/fixtures/devex-handoff-o-call.json', 'test/eng-devex-s-count.test.ts', 'test/fixtures/eng-devex-s-first-calls.json', 'test/fixtures/eng-devex-s-retry-calls.json', 'test/fixtures/devex-review-t-calls.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/fixtures/devex-count-u-calls.json', 'test/fixtures/devex-count-u-retry-calls.json', 'test/fixtures/devex-empathy-v-calls.json', 'test/fixtures/devex-handoff-v-call.json', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/fixtures/devex-count-y-calls.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/fixtures/devex-count-z-calls.json', 'test/fixtures/devex-handoff-z-call.json', 'test/review-handoffs-aa.test.ts', 'test/fixtures/review-handoff-aa-ceo.json', 'test/fixtures/review-handoff-aa-dx.json', 'test/devex-empathy-ab.test.ts', 'test/fixtures/devex-empathy-ab-calls.json', 'test/devex-ac-accounting.test.ts', 'test/fixtures/devex-ac-first-attempt-calls.json', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/devex-reconfirmation-ad-v2.test.ts', 'test/fixtures/devex-reconfirmation-ad-v2.json', 'test/plan-count-history.test.ts', 'test/helpers/devex-seed-coverage.ts', 'test/devex-seed-coverage.test.ts', 'test/fixtures/devex-seed-coverage-ad-v3.json', 'test/fixtures/plan-count-permission-ah.json',
    'test/dx-signature-identity-ak.test.ts',
    'test/fixtures/dx-signature-identity-ak.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    "test/fixtures/dx-declarative-choices-am.json",
    "test/dx-declarative-stage-ar.test.ts", "test/fixtures/dx-declarative-stage-ar.json",
    "test/dx-asserted-defect-as.test.ts", "test/fixtures/dx-asserted-defect-as.json", "test/fixtures/dx-asserted-defect-as-retry.json",
    'bin/gstack-decision-log', 'lib/gstack-decision.ts', 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/devex-finding-fixture.test.ts', 'test/fixtures/devex-checkpoint-todos.json', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'test/fixtures/devex-existing-sdk/README.md', 'test/fixtures/devex-existing-sdk/docs/getting-started.md', 'test/fixtures/devex-existing-sdk/docs/feedback.md', 'test/fixtures/devex-existing-sdk/docs/reference-v1.md'
  ],

  // Gate-tier reviewCount-floor counterparts. Catch the May 2026 transcript
  // bug (model wrote a plan-mode plan and ExitPlanMode'd without firing any
  // review-phase AskUserQuestion). Uses runPlanSkillFloorCheck — minimal
  // "did agent fire ANY AUQ?" observer that exits early on first non-permission
  // numbered-option render. ~1-3 min typical wall time per test, ~$2-6 total.
  'plan-eng-finding-floor':      [
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json', 'test/fixtures/plan-floor-quote-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/helpers/plan-floor-review.ts',
    'test/plan-floor-review.test.ts',
    'test/fixtures/plan-floor-routing-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json', 'test/plan-floor-permission.test.ts', 'test/fixtures/plan-floor-permission-fb10.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/plan-count-crop-ak.test.ts', 'test/fixtures/plan-count-crop-ak.json', 'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts', 'test/fixtures/plan-count-cropped-wrap-6714.json','test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-eng-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-eng-finding-floor.test.ts', 'test/eng-first-review-t.test.ts', 'test/fixtures/eng-batching-t-calls.json', 'test/eng-scope-y.test.ts', 'test/fixtures/eng-scope-y-calls.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/eng-binding-z.test.ts', 'test/fixtures/eng-binding-z-calls.json', 'test/eng-binding-retry-z.test.ts', 'test/fixtures/eng-binding-retry-z-calls.json', 'test/helpers/plan-floor-target.ts', 'test/plan-floor-target.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts',
    "test/eng-injected-export-aq.test.ts", "test/fixtures/eng-injected-export-aq.json", "test/eng-library-hooks-aq.test.ts", "test/fixtures/eng-library-hooks-aq.json",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/testing.ts'
  ],
  'plan-ceo-finding-floor':      [
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json', 'test/fixtures/plan-floor-quote-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/helpers/plan-floor-review.ts',
    'test/plan-floor-review.test.ts',
    'test/fixtures/plan-floor-routing-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json', 'test/plan-floor-permission.test.ts', 'test/fixtures/plan-floor-permission-fb10.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/plan-count-crop-ak.test.ts', 'test/fixtures/plan-count-crop-ak.json', 'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts', 'test/fixtures/plan-count-cropped-wrap-6714.json','test/paid-retry-supervision.test.ts', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-ceo-finding-floor.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-floor-target.ts', 'test/plan-floor-target.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts',
    "test/ceo-section-ordering-aq.test.ts", "test/fixtures/ceo-section-ordering-aq.json",
    "test/ceo-transaction-contract-ar.test.ts", "test/fixtures/ceo-transaction-contract-ar.json", "test/ceo-section-declarative-ar.test.ts", "test/fixtures/ceo-section-declarative-ar.json",
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-design-finding-floor':   [
    'test/paid-retry-supervision.test.ts',
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json', 'test/fixtures/plan-floor-quote-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/helpers/plan-floor-review.ts',
    'test/plan-floor-review.test.ts',
    'test/fixtures/plan-floor-routing-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json', 'test/plan-floor-permission.test.ts', 'test/fixtures/plan-floor-permission-fb10.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/plan-count-crop-ak.test.ts', 'test/fixtures/plan-count-crop-ak.json', 'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts', 'test/fixtures/plan-count-cropped-wrap-6714.json',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-design-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-design-finding-floor.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-floor-target.ts', 'test/plan-floor-target.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/plan-design-floor-fixture.test.ts'
  ],
  'plan-devex-finding-floor':    [
    'test/plan-floor-dx-actor.test.ts', 'test/fixtures/plan-floor-dx-custom-491.json', 'test/fixtures/plan-floor-dx-editor-hint.json',
    'test/paid-retry-supervision.test.ts',
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json', 'test/fixtures/plan-floor-quote-70b.json', 'test/fixtures/plan-floor-product-type-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/helpers/plan-floor-review.ts',
    'test/plan-floor-review.test.ts',
    'test/fixtures/plan-floor-routing-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json', 'test/plan-floor-permission.test.ts', 'test/fixtures/plan-floor-permission-fb10.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'test/plan-count-crop-ak.test.ts', 'test/fixtures/plan-count-crop-ak.json', 'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts', 'test/fixtures/plan-count-cropped-wrap-6714.json','bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-devex-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-devex-finding-floor.test.ts', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/helpers/plan-floor-target.ts', 'test/plan-floor-target.test.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts',
    'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'lib/fs-atomic.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts'
  ],

  // Multi-finding batching regression — periodic tier complement to the
  // gate-tier finding-floor. Catches the May 2026 transcript shape where
  // a model fires one AUQ then batches the rest into a "## Decisions to
  // confirm" plan write. runPlanSkillFloorCheck cannot detect that shape
  // (it exits on first AUQ); runPlanSkillCounting can.
  'plan-eng-multi-finding-batching': [
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',

    'test/fixtures/ceo-report-permission-fb10.json',
    'test/eng-error-flow-seed.test.ts', 'test/fixtures/eng-69193-count-public.json', 'test/fixtures/eng-e366-count-public.json',
    'test/eng-initial-selector-043a.test.ts',
    'test/fixtures/eng-initial-selector-043a.json',
    'test/fixtures/eng-batching-prefixed-ledger-f359.json',
    'test/eng-batching-current-ledger.test.ts', 'test/fixtures/eng-batching-saved-ledger-b176.json',
    'test/review-count-markdown.test.ts', 'test/fixtures/review-count-markdown-6f.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/fixtures/eng-batching-expanded-ledger-6714.json',
    'test/fixtures/eng-native-review-identities-6714.json',
    'test/eng-finding-retry-budget.test.ts',
    'test/eng-batching-native-replay.test.ts', 'test/fixtures/eng-batching-native-8525.json',
    'test/eng-batching-saved-ledger.test.ts', 'test/fixtures/eng-batching-saved-ledger-dacc.json',
    'scripts/resolvers/learnings.ts',
    'test/helpers/eng-seeded-coverage.ts', 'test/fixtures/eng-neutral-seed-749df.json', 'test/fixtures/eng-paired-suite-749df.json', 'test/fixtures/eng-a689-count-public.json', 'test/fixtures/eng-6aef-count-public.json', 'test/fixtures/eng-a689-retry-public.json', 'test/eng-seeded-coverage.test.ts',
    'test/eng-resolution-block-position.test.ts',
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",

    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/batching-permission-at.test.ts", "test/fixtures/batching-permission-at.json",
    "test/eng-declared-retry-at.test.ts", "test/fixtures/eng-declared-retry-at.json",'test/pty-screen-unicode-ap.test.ts', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'bin/gstack-config', 'bin/gstack-skill-start', 'bin/gstack-skill-end', 'plan-eng-review/**', 'scripts/resolvers/preamble.ts', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-eng-multi-finding-batching.test.ts', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/eng-devex-s-count.test.ts', 'test/fixtures/eng-devex-s-first-calls.json', 'test/fixtures/eng-devex-s-retry-calls.json', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/eng-first-review-t.test.ts', 'test/fixtures/eng-batching-t-calls.json', 'test/plan-count-preview-footer.test.ts', 'test/fixtures/ceo-preview-u-call.json', 'test/fixtures/ceo-preview-u-screen.txt', 'test/fixtures/design-preview-v-screen.txt', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/eng-scope-y.test.ts', 'test/fixtures/eng-scope-y-calls.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/eng-binding-z.test.ts', 'test/fixtures/eng-binding-z-calls.json', 'test/eng-binding-retry-z.test.ts', 'test/fixtures/eng-binding-retry-z-calls.json', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/eng-count-ad-v2.test.ts', 'test/fixtures/eng-count-ad-v2.json', 'test/eng-first-category-af.test.ts', 'test/fixtures/eng-first-category-af.json', 'test/eng-regression-pinning-ag.test.ts', 'test/fixtures/eng-regression-pinning-ag.json', 'test/fixtures/plan-count-permission-ah.json', 'test/eng-declared-regression-ai.test.ts', 'test/fixtures/eng-declared-regression-ai.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    "test/eng-injected-export-aq.test.ts", "test/fixtures/eng-injected-export-aq.json", "test/eng-library-hooks-aq.test.ts", "test/fixtures/eng-library-hooks-aq.json",
    "test/eng-declarative-as.test.ts", "test/fixtures/eng-declarative-as.json", "test/helpers/eng-cache-writer-decision.ts", "test/eng-cache-writes-as.test.ts", "test/fixtures/eng-cache-writes-as.json",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'scripts/resolvers/testing.ts', 'test/fixtures/eng-file-permission-repaint.json'
  ],
  'plan-ceo-split-overflow': [
    'lib/claude-public-transcript.ts', 'test/plan-create-prepublication.test.ts', 'test/fixtures/plan-create-prepublication-491.json', 'test/plan-create-combined-permission.test.ts', 'test/fixtures/plan-create-combined-permission-70b.json',
    'test/plan-create-permission.test.ts',
    'test/fixtures/plan-create-permission-361c.json',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',
    'test/fixtures/ceo-split-padding-361c-public.json',
    'test/fixtures/ceo-split-edit-permission-361c-public.json',

    'test/fixtures/ceo-report-permission-fb10.json',
    'test/plan-count-long-edit.test.ts', 'test/fixtures/plan-count-long-edit-0bcd.json', 'test/plan-count-cropped-wrap.test.ts',
    'test/fixtures/plan-count-cropped-wrap-6714.json',
    'test/eng-finding-retry-budget.test.ts',
    "test/plan-count-cross-cwd-ancestry.test.ts", "test/fixtures/plan-count-cross-cwd-ancestry-0bcd.json", "test/plan-count-session-cwd.test.ts",
'test/pty-screen-unicode-ap.test.ts', 'test/design-crop-gutter-ap.test.ts', 'test/fixtures/design-crop-gutter-ap.json', 'bin/gstack-config', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'bin/gstack-question-preference', 'test/helpers/claude-pty-runner.ts', 'test/plan-count-design-ui-recovery.test.ts', 'test/fixtures/design-ui-boxed-question.json', 'test/plan-count-native-input.test.ts', 'test/helpers/pty-screen.ts', 'test/pty-screen.test.ts', 'test/pty-screen-session.test.ts', 'test/fixtures/pty-screen/**', 'test/helpers/hermetic-skill-runtime.ts', 'test/hermetic-skill-runtime.test.ts', 'test/helpers/claude-pty-runner.unit.test.ts', 'test/helpers/pty-trust-dialog.ts', 'test/pty-trust-dialog.test.ts', 'test/helpers/plan-count-transcript.ts', 'test/autoplan-public-narration.test.ts', 'test/fixtures/autoplan-public-narration-ad.json', 'test/helpers/plan-count-pending-exit.ts', 'test/plan-count-pending-exit.test.ts', 'test/plan-count-transcript.test.ts', 'test/helpers/plan-count-artifacts.ts', 'test/plan-count-artifacts.test.ts', 'test/helpers/eval-store.ts', 'test/helpers/plan-count-fixture.ts', 'test/plan-count-fixture.test.ts', 'test/plan-count-collection-completion.test.ts', 'test/plan-count-timeout.test.ts', 'test/plan-count-navigation-r.test.ts', 'test/plan-count-prerequisite-n.test.ts', 'test/fixtures/ceo-prerequisite-n-call.json', 'test/fixtures/eng-prerequisite-77.json', 'test/fixtures/forcing-finding-seeds.ts', 'test/skill-e2e-plan-ceo-split-overflow.test.ts', 'test/plan-count-checkbox.test.ts', 'test/fixtures/ceo-checkbox-l.screen.txt', 'test/helpers/plan-count-file-permission.ts', 'test/plan-edit-cropped-permission.test.ts', 'test/fixtures/plan-edit-cropped-permission-1579.json', 'test/plan-count-file-permission.test.ts', 'test/fixtures/plan-count-edit-permission-t.json', 'test/plan-count-owned-permission.test.ts', 'test/fixtures/plan-count-owned-permission-v.json', 'test/fixtures/ceo-questionless-w-native.json', 'test/plan-count-truncated-border.test.ts', 'test/fixtures/eng-d2-truncated-border-0bcd.json', 'test/plan-count-truncated-question.test.ts', 'test/plan-count-clipped-elision.test.ts', 'test/fixtures/eng-d1-clipped-elision-1579.json', 'test/fixtures/eng-d2-planning-prelude-4d.json', 'test/fixtures/ceo-approach-z-call.json', 'test/fixtures/ceo-approach-z-screen.txt', 'test/plan-count-permission-ac.test.ts', 'test/fixtures/plan-count-permission-ac.json', 'test/fixtures/plan-count-permission-ad.json', 'test/fixtures/plan-count-permission-ae.json', 'test/fixtures/plan-count-permission-target-ad-v2.json', 'test/fixtures/plan-count-permission-ah.json',
    'test/plan-count-crop-ak.test.ts',
    'test/fixtures/plan-count-crop-ak.json',
    'test/plan-count-quoted-frame-ak.test.ts',
    'test/fixtures/plan-count-quoted-frame-ak.json',
    'docs/askuserquestion-split.md', 'test/resolver-ask-user-format.test.ts', 'bin/gstack-slug', 'test/helpers/hermetic-env.test.ts', 'test/pty-workspace-trust.test.ts', 'test/fixtures/pty-companion-cli.ts', 'test/helpers/autoplan-phase-order.ts', 'test/autoplan-phase-observation.test.ts', 'lib/fs-atomic.ts', 'test/helpers/ceo-finding-fixture.ts', 'test/ceo-finding-fixture.test.ts', 'test/helpers/owned-claude-transcript.ts', 'test/helpers/plan-skill-completion.ts', 'test/plan-skill-completion.test.ts', 'test/eval-budgets-policy.test.ts', 'test/fixtures/webfetch-permission.json', 'test/plan-skill-webfetch-permission.test.ts', 'test/helpers/plan-skill-questions.ts', 'test/fixtures/eng-auq-validation-error.json', 'test/fixtures/bash-directory-permission.json', 'test/fixtures/design-tasks-bash-permission.json', 'test/plan-skill-read-permission.test.ts', 'test/fixtures/read-permission.json', 'test/pty-numbered-option-indent-native.test.ts', 'test/fixtures/ceo-split-e5-numbered-description-491.json', 'test/plan-skill-questions.test.ts', 'test/helpers/plan-skill-question-events.ts', 'test/plan-skill-question-events.test.ts', 'test/helpers/plan-skill-question-hook-scope.ts', 'test/helpers/skill-census.ts', 'test/plan-skill-question-hook-scope.test.ts', 'test/helpers/pty-current-screen.ts', 'test/pty-current-screen.test.ts', 'test/fixtures/native-viewport.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'test/helpers/ceo-split-question-policy.ts', 'test/fixtures/ceo-split-actor-6aef.json', 'test/helpers/ceo-mode-option.ts', 'test/ceo-mode-option.test.ts', 'test/ceo-split-collection.test.ts', 'test/fixtures/ceo-split-collection-0bcd.json', 'test/ceo-split-question-policy.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-review-format-mode':      ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/helpers/llm-judge.ts', 'test/skill-e2e-plan-format.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-ceo-review-format-approach':  ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/helpers/llm-judge.ts', 'test/skill-e2e-plan-format.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-eng-review-format-coverage':  ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'plan-eng-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/helpers/llm-judge.ts', 'test/skill-e2e-plan-format.test.ts',
    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts', 'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts'
  ],
  'plan-eng-review-format-kind':      ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    'scripts/resolvers/learnings.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'plan-eng-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/helpers/llm-judge.ts', 'test/skill-e2e-plan-format.test.ts',
    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts', 'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts'
  ],

  // v1.7.0.0 Pros/Cons format cadence + format + negative-escape evals.
  // Dependencies: same as format-mode + the 4 plan-review templates + overlay.
  // All periodic-tier (non-deterministic Opus 4.7 behavior).
  'plan-ceo-review-prosons-cadence':  ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'plan-ceo-review/**', 'plan-eng-review/**', 'plan-design-review/**', 'plan-devex-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/skill-e2e-plan-prosons.test.ts',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts', 'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-review-prosons-format':       ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'plan-ceo-review/**', 'plan-eng-review/**', 'plan-design-review/**', 'plan-devex-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/skill-e2e-plan-prosons.test.ts',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/testing.ts', 'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-review-prosons-hardstop-neg': ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/skill-e2e-plan-prosons.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],
  'plan-review-prosons-neutral-neg':  ['test/session-runner-stream-lifecycle.test.ts', 'test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/resolvers/preamble.ts', 'model-overlays/opus-4-7.md', 'test/skill-e2e-plan-prosons.test.ts',
    'test/helpers/office-hours-attempt.ts', 'test/office-hours-attempt.test.ts', 'scripts/resolvers/tasks-section.ts'
  ],

  // Expanded coverage (CT3) — 6 non-plan-review skills inherit Pros/Cons via preamble

  // /plan-tune (v1 observational)
  'plan-tune-inspect':         ['test/session-runner-stream-lifecycle.test.ts', 'plan-tune/**', 'scripts/question-registry.ts', 'scripts/psychographic-signals.ts', 'scripts/one-way-doors.ts', 'bin/gstack-question-log', 'bin/gstack-question-preference', 'bin/gstack-developer-profile', 'test/skill-e2e-plan-tune.test.ts'],

  // /plan-tune cathedral (T16 — 5 E2E scenarios, all gate per D12)
  'plan-tune-hook-capture':      ['hosts/claude/hooks/**', 'bin/gstack-question-log', 'bin/gstack-developer-profile', 'plan-tune/**', 'test/skill-e2e-plan-tune-cathedral.test.ts', 'lib/jsonl-store.ts', 'lib/is-conductor.ts', 'test/plan-tune-cathedral-fixture.test.ts', 'test/helpers/node-runtime-fixture.ts'],
  'plan-tune-enforcement':       ['hosts/claude/hooks/**', 'bin/gstack-question-preference', 'scripts/question-registry.ts', 'test/skill-e2e-plan-tune-cathedral.test.ts', 'lib/jsonl-store.ts', 'lib/is-conductor.ts', 'test/plan-tune-cathedral-fixture.test.ts', 'test/helpers/node-runtime-fixture.ts'],
  'plan-tune-annotation':        ['hosts/claude/hooks/**', 'scripts/declared-annotation.ts', 'scripts/psychographic-signals.ts', 'scripts/question-registry.ts', 'test/skill-e2e-plan-tune-cathedral.test.ts', 'lib/jsonl-store.ts', 'lib/is-conductor.ts', 'test/plan-tune-cathedral-fixture.test.ts', 'test/helpers/node-runtime-fixture.ts'],
  'plan-tune-dream-cycle':       ['bin/gstack-distill-free-text', 'bin/gstack-distill-apply', 'hosts/claude/hooks/**', 'plan-tune/**', 'test/skill-e2e-plan-tune-cathedral.test.ts', 'lib/jsonl-store.ts', 'lib/is-conductor.ts', 'test/plan-tune-cathedral-fixture.test.ts', 'test/helpers/node-runtime-fixture.ts'],

  // Codex offering verification
  'ship-base-branch': ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'bin/gstack-repo-mode', 'test/skill-e2e-review-attribution.test.ts',
    'scripts/resolvers/testing.ts'
  ],
  'ship-local-workflow': ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-workflow.test.ts',
    'scripts/resolvers/testing.ts'
  ],
  'review-dashboard-via': ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'autoplan/**', 'land-and-deploy/**', 'test/skill-e2e-review-attribution.test.ts',
    'scripts/resolvers/testing.ts'
  ],

  // Retro
  'retro':             ['test/session-runner-stream-lifecycle.test.ts', 'bin/gstack-retro-metrics', 'retro/**', 'test/skill-e2e-retro.test.ts'],
  'retro-base-branch': ['test/session-runner-stream-lifecycle.test.ts', 'bin/gstack-retro-metrics', 'retro/**', 'test/skill-e2e-retro.test.ts'],

  'learnings-show': ['test/session-runner-stream-lifecycle.test.ts', 'learn/**', 'bin/gstack-learnings-search', 'bin/gstack-learnings-log', 'scripts/resolvers/learnings.ts', 'test/skill-e2e-learnings.test.ts'],

  // Session Intelligence (timeline, context recovery, /context-save + /context-restore)
  'timeline-event-flow':            ['test/session-runner-stream-lifecycle.test.ts', 'bin/gstack-timeline-log', 'bin/gstack-timeline-read', 'test/skill-e2e-session-intelligence.test.ts'],
  'context-recovery-artifacts':     ['test/session-runner-stream-lifecycle.test.ts', 'scripts/resolvers/preamble.ts', 'bin/gstack-timeline-log', 'bin/gstack-slug', 'learn/**', 'test/skill-e2e-session-intelligence.test.ts'],
  'context-save-writes-file':       ['test/session-runner-stream-lifecycle.test.ts', 'context-save/**', 'bin/gstack-slug', 'test/skill-e2e-session-intelligence.test.ts'],
  'context-restore-loads-latest':   ['test/session-runner-stream-lifecycle.test.ts', 'context-restore/**', 'bin/gstack-slug', 'test/skill-e2e-session-intelligence.test.ts'],

  // Context skills E2E (live-fire, Skill-tool routing path) — see
  // test/skill-e2e-context-skills.test.ts. These are periodic-tier because
  // each one spawns claude -p and costs ~$0.20-$0.40. Collectively they
  // verify the thing the /checkpoint → /context-save rename was for.
  'context-save-routing':                  ['test/session-runner-stream-lifecycle.test.ts', 'context-save/**', 'scripts/resolvers/preamble.ts', 'test/skill-e2e-context-skills.test.ts'],
  'context-save-then-restore-roundtrip':   ['test/session-runner-stream-lifecycle.test.ts', 'context-save/**', 'context-restore/**', 'bin/gstack-slug', 'test/skill-e2e-context-skills.test.ts'],
  'context-restore-fragment-match':        ['test/session-runner-stream-lifecycle.test.ts', 'context-restore/**', 'test/skill-e2e-context-skills.test.ts'],
  'context-restore-empty-state':           ['test/session-runner-stream-lifecycle.test.ts', 'context-restore/**', 'test/skill-e2e-context-skills.test.ts'],
  'context-restore-list-delegates':        ['test/session-runner-stream-lifecycle.test.ts', 'context-restore/**', 'test/skill-e2e-context-skills.test.ts'],
  'context-restore-legacy-compat':         ['test/session-runner-stream-lifecycle.test.ts', 'context-restore/**', 'test/skill-e2e-context-skills.test.ts'],
  'context-save-list-current-branch':      ['test/session-runner-stream-lifecycle.test.ts', 'context-save/**', 'test/skill-e2e-context-skills.test.ts'],
  'context-save-list-all-branches':        ['test/session-runner-stream-lifecycle.test.ts', 'context-save/**', 'test/skill-e2e-context-skills.test.ts'],

  // Document-release
  'document-release': ['test/session-runner-stream-lifecycle.test.ts', 'document-release/**', 'test/skill-e2e-workflow.test.ts'],

  // Codex (Claude E2E — tests /codex skill via Claude)
  'codex-discover-skill':  ['review/**', 'scripts/gen-skill-docs.ts', 'test/helpers/codex-session-runner.ts', 'lib/worktree.ts', 'test/codex-e2e.test.ts',
    'test/helpers/codex-eval.ts'
  ],
  'codex-review-findings': ['review/**', 'scripts/gen-skill-docs.ts', 'test/helpers/codex-session-runner.ts', 'lib/worktree.ts', 'test/codex-e2e.test.ts',
    'test/helpers/codex-eval.ts'
  ],

  // Real cross-harness workflow dispatch and independent seeded-defect detection.
  'codex-sol-scope-termination': ['model-overlays/gpt-5.6-sol.md', 'scripts/models.ts', 'scripts/resolvers/model-overlay.ts', 'scripts/resolvers/preamble/**', 'investigate/**', 'test/helpers/codex-session-runner.ts', 'test/codex-e2e-sol-scope.test.ts',
    'test/helpers/codex-eval.ts', 'test/helpers/sol-skill-fixture.ts', 'test/sol-skill-fixture.test.ts'
  ],

  // Gemini E2E — smoke test only (Gemini gets lost in worktrees on complex tasks)
  'gemini-smoke':  ['scripts/gen-skill-docs.ts', 'test/helpers/gemini-session-runner.ts', 'lib/worktree.ts', 'test/gemini-e2e.test.ts'],


  // Coverage audit (shared fixture) + triage + gates
  'review-coverage-audit': ['test/session-runner-stream-lifecycle.test.ts',
    'test/fixtures/coverage-audit-ci-diagrams.json',
    "test/coverage-audit-aw.test.ts", "test/fixtures/coverage-audit-aw.json",
    "test/coverage-checkbox-tail-av.test.ts", "test/fixtures/coverage-checkbox-tail-av.json",
    "test/coverage-audit-shell-legend-at.test.ts", "test/fixtures/coverage-audit-shell-legend-at.json",
    'review/**', 'test/fixtures/coverage-audit-fixture.ts', 'test/skill-e2e-coverage-audit.test.ts',
    'test/helpers/coverage-audit-evidence.ts', 'test/coverage-audit-evidence.test.ts',
    'test/fixtures/coverage-audit-ae.json', 'test/coverage-audit-af.test.ts', 'test/fixtures/coverage-audit-af.json',
    "test/coverage-shell-display-aq.test.ts", "test/fixtures/coverage-shell-display-aq.json",
    "test/coverage-diagram-legend-as.test.ts", "test/fixtures/coverage-diagram-legend-as.json",
    'test/helpers/coverage-audit.ts', 'test/helpers/office-hours-attempt.ts', 'test/coverage-audit.test.ts'
  ],
  'plan-eng-coverage-audit': ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'scripts/resolvers/learnings.ts',
    'test/fixtures/coverage-audit-ci-diagrams.json',
    "test/coverage-audit-aw.test.ts",
    "test/fixtures/coverage-audit-aw.json",

    "test/coverage-checkbox-tail-av.test.ts",
    "test/fixtures/coverage-checkbox-tail-av.json",
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/coverage-audit-shell-legend-at.test.ts", "test/fixtures/coverage-audit-shell-legend-at.json",'plan-eng-review/**', 'test/fixtures/coverage-audit-fixture.ts', 'test/skill-e2e-coverage-audit.test.ts', 'test/helpers/coverage-audit-evidence.ts', 'test/coverage-audit-evidence.test.ts', 'test/fixtures/coverage-audit-ae.json', 'test/coverage-audit-af.test.ts', 'test/fixtures/coverage-audit-af.json',
    "test/coverage-shell-display-aq.test.ts", "test/fixtures/coverage-shell-display-aq.json",
    "test/coverage-diagram-legend-as.test.ts", "test/fixtures/coverage-diagram-legend-as.json",

    "test/review-entry-and-design-clarity-au.test.ts", 'test/helpers/coverage-audit.ts', 'test/helpers/office-hours-attempt.ts', 'test/coverage-audit.test.ts', 'scripts/resolvers/testing.ts'
  ],
  'ship-triage': ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'bin/gstack-repo-mode', 'test/skill-e2e-triage.test.ts',
    'scripts/resolvers/testing.ts'
  ],
  'ship-docsync': ['test/session-runner-stream-lifecycle.test.ts', 'ship/**', 'document-release/**', 'scripts/gen-skill-docs.ts', 'scripts/resolvers/sections.ts', 'test/skill-e2e-ship-docsync.test.ts',
    'scripts/resolvers/testing.ts'
  ],
  // #2733 behavioral proof: the JSON contract survives a firing gate inside a
  // spawned-marked subagent. Deps name every behavior under test — the
  // session-kind override, the skill-start gates, both hooks + the shared
  // directive, and the AUQ prose rule — so changing any of them selects it.
  'docsync-spawned': ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'document-release/**',
    'ship/sections/pr-body.md',
    'bin/gstack-session-kind',
    'bin/gstack-skill-start',
    'hosts/claude/hooks/question-preference-hook.ts',
    'hosts/claude/hooks/auq-error-fallback-hook.ts',
    'hosts/claude/hooks/spawned-directive.ts',
    'test/skill-e2e-docsync-spawned.test.ts',
  ],

  // Design
  'design-consultation-core':       ['test/session-runner-stream-lifecycle.test.ts', 'design-consultation/**', 'lib/design-catalog.ts', 'lib/design-md.ts', 'scripts/gen-skill-docs.ts', 'test/helpers/llm-judge.ts', 'test/skill-e2e-design.test.ts', 'scripts/resolvers/design.ts'],
  'design-consultation-existing':   ['test/session-runner-stream-lifecycle.test.ts', 'design-consultation/**', 'lib/design-md.ts', 'bin/gstack-design-md.ts', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-design.test.ts'],
  'design-consultation-preview':    ['test/session-runner-stream-lifecycle.test.ts', 'design-consultation/**', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-design.test.ts', 'test/design-board-reload.test.ts'],
  'design-review-plugin-handoff': ['test/session-runner-stream-lifecycle.test.ts', 'design-review/**', 'scripts/resolvers/design.ts', 'scripts/resolvers/testing.ts', 'lib/design-catalog.ts', 'lib/design-detect-contract.ts', 'bin/gstack-design-detect.ts', 'test/helpers/hermetic-env.ts', 'test/helpers/fake-impeccable.ts', 'test/fixtures/fake-impeccable.ts', 'test/fixtures/impeccable-detect-sample.json', 'test/fixtures/review-eval-design-slop.html', 'test/skill-e2e-design.test.ts'],
  'design-html-slop-gate':          ['test/session-runner-stream-lifecycle.test.ts', 'test/gstack-paths.test.ts', 'design-html/**', 'scripts/resolvers/design.ts', 'lib/design-detect-contract.ts', 'bin/gstack-design-detect.ts', 'test/helpers/fake-impeccable.ts', 'test/fixtures/fake-impeccable.ts', 'test/fixtures/impeccable-detect-sample.json', 'test/skill-e2e-design.test.ts'],


  // gstack-upgrade
  'gstack-upgrade-happy-path': ['test/session-runner-stream-lifecycle.test.ts', 'gstack-upgrade/**', 'test/skill-e2e-workflow.test.ts'],

  // Deploy skills
  'land-and-deploy-workflow':      ['test/session-runner-stream-lifecycle.test.ts', 'land-and-deploy/**', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-deploy.test.ts'],
  'land-and-deploy-first-run':     ['test/session-runner-stream-lifecycle.test.ts', 'land-and-deploy/**', 'scripts/gen-skill-docs.ts', 'bin/gstack-slug', 'test/skill-e2e-deploy.test.ts'],
  'land-and-deploy-review-gate':   ['test/session-runner-stream-lifecycle.test.ts', 'land-and-deploy/**', 'bin/gstack-review-read', 'test/skill-e2e-deploy.test.ts'],
  'canary-workflow':               ['test/session-runner-stream-lifecycle.test.ts', 'canary/**', 'scripts/resolvers/browser.ts', 'test/skill-e2e-deploy.test.ts'],
  'benchmark-workflow':            ['test/session-runner-stream-lifecycle.test.ts', 'benchmark/**', 'scripts/resolvers/browser.ts', 'test/skill-e2e-deploy.test.ts'],
  'setup-deploy-workflow':         ['test/session-runner-stream-lifecycle.test.ts', 'setup-deploy/**', 'scripts/gen-skill-docs.ts', 'test/skill-e2e-deploy.test.ts'],


  // Autoplan
  'journey-ideation':       ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-plan-eng':       ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-debug':          ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-qa':             ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-code-review':    ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-ship':           ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-docs':           ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-retro':          ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-design-system':  ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],
  'journey-visual-qa':      ['scripts/resolvers/preamble.ts', 'test/session-runner-stream-lifecycle.test.ts',
    'test/skill-fixture.test.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'*/SKILL.md.tmpl', 'SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-routing-e2e.test.ts', 'CLAUDE.md', 'AGENTS.md', 'docs/DEVELOPMENT.md', 'docs/CHANGELOG_STYLE.md', 'docs/SLOP_SCAN.md',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", ],

  // Opus 4.7 behavior evals — keys match testName: values in the test file.
  // Routing sub-tests use template literal `routing-${c.name}` testNames,
  // which the touchfile completeness scanner skips; they inherit selection
  // from the file-level touchfile entry via GLOBAL_TOUCHFILES.
  'fanout-arm-overlay-on':
    ['test/session-runner-stream-lifecycle.test.ts', 'model-overlays/claude.md', 'model-overlays/opus-4-7.md', 'scripts/models.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-opus-47.test.ts'],
  'fanout-arm-overlay-off':
    ['test/session-runner-stream-lifecycle.test.ts', 'model-overlays/claude.md', 'model-overlays/opus-4-7.md', 'scripts/models.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-opus-47.test.ts'],

  // Overlay efficacy harness (SDK) — measures whether overlay nudges change
  // behavior under @anthropic-ai/claude-agent-sdk (closer to real Claude Code
  // than `claude -p`). testNames in the file are template literals so the
  // completeness scanner doesn't require them; these entries exist for
  // diff-based selection accuracy.

  // /ios-qa — agent flow E2E. Daemon + stub StateServer + codegen
  // exercised end-to-end. The no-device path is gate-tier; the with-device
  // path requires GSTACK_HAS_IOS_DEVICE=1 and is periodic-tier.
  'ios-qa-e2e':       ['ios-qa/**', 'ios-fix/**', 'ios-design-review/**', 'ios-clean/**', 'ios-sync/**', 'test/skill-e2e-ios.test.ts'],
  // Swift-build invariant test — requires the Swift toolchain. Compiles the
  // fixture SPM package + runs the XCTest suite that validates the real
  // Swift StateServer implementation (loopback bind, boot token rotation,
  // session lock). Periodic-tier — Swift build is heavier than TS unit tests.
  'ios-qa-swift-build': ['ios-qa/templates/**', 'test/fixtures/ios-qa/FixtureApp/**', 'test/skill-e2e-ios-swift-build.test.ts'],
  // Real-device path — only runs with GSTACK_HAS_IOS_DEVICE=1 + a paired
  // iPhone. Validates the CoreDevice agent + iOS SDK toolchain. Periodic-tier.
  'ios-qa-device':    ['ios-qa/templates/**', 'test/fixtures/ios-qa/FixtureApp/**', 'test/skill-e2e-ios-device.test.ts'],

  // /spec end-to-end via PTY — exercises the full Phase 1→5 pipeline
  // including --execute spawn. Periodic-tier — paid + non-deterministic.
  'spec-execute':     ['spec/**', 'scripts/resolvers/redact-doc.ts', 'scripts/resolvers/constants.ts', 'lib/outside-review-result.ts', 'bin/gstack-redact', 'lib/redact-engine.ts', 'test/skill-e2e-spec-execute.test.ts'],

  'arm-benchmark-native-overbuild': ['test/session-runner-stream-lifecycle.test.ts',
    'build/SKILL.md.tmpl',
    'test/fixtures/arm-benchmark/**',
    'test/helpers/llm-judge.ts',
    'test/helpers/arm-benchmark-harness.ts',
    'test/skill-e2e-arm-benchmark.test.ts',
    'ship/SKILL.md',
  ],
  'arm-benchmark-crud-endpoint': ['test/session-runner-stream-lifecycle.test.ts',
    'build/SKILL.md.tmpl',
    'test/fixtures/arm-benchmark/**',
    'test/helpers/llm-judge.ts',
    'test/helpers/arm-benchmark-harness.ts',
    'test/skill-e2e-arm-benchmark.test.ts',
    'ship/SKILL.md',
  ],
  'arm-benchmark-bugfix-decoys': ['test/session-runner-stream-lifecycle.test.ts',
    'build/SKILL.md.tmpl',
    'test/fixtures/arm-benchmark/**',
    'test/helpers/llm-judge.ts',
    'test/helpers/arm-benchmark-harness.ts',
    'test/skill-e2e-arm-benchmark.test.ts',
    'ship/SKILL.md',
  ],

  'plan-devex-peer-comparison-classification': ['scripts/resolvers/preamble.ts',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',
'test/skill-e2e-plan-devex-peer-comparison-classification.test.ts', 'test/fixtures/devex-peer-comparison-classification.ts', 'test/devex-peer-comparison-calibration.test.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/helpers/e2e-helpers.ts', 'test/helpers/eval-store.ts', 'test/helpers/eval-budgets.ts', 'docs/askuserquestion-split.md', 'plan-devex-review/SKILL.md.tmpl'],
  'plan-decision-classification': ['scripts/resolvers/preamble.ts',
    'test/plan-review-native-default.test.ts',
    'test/fixtures/eng-omitted-select-361c.json',
'test/skill-e2e-plan-decision-classification.test.ts', 'test/fixtures/plan-decision-classification.ts', 'test/plan-review-calibration.test.ts', 'test/helpers/plan-review-decisions.ts', 'test/plan-review-decisions.test.ts', 'test/helpers/plan-review-cases.ts', 'test/helpers/llm-judge.ts', 'lib/eval-model.ts', 'test/helpers/e2e-helpers.ts', 'test/helpers/eval-store.ts', 'test/helpers/eval-budgets.ts', 'docs/askuserquestion-split.md', 'plan-ceo-review/SKILL.md.tmpl', 'scripts/resolvers/tasks-section.ts'],
  'codex-plan-ceo-format-mode': ['test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/gen-skill-docs.ts', 'scripts/resolvers/**', 'model-overlays/gpt.md', 'model-overlays/gpt-5.4.md', 'test/helpers/codex-session-runner.ts', 'test/helpers/codex-eval.ts', 'test/codex-e2e-plan-format.test.ts'],
  'codex-plan-ceo-format-approach': ['test/paid-retry-supervision.test.ts', 'plan-ceo-review/**', 'scripts/gen-skill-docs.ts', 'scripts/resolvers/**', 'model-overlays/gpt.md', 'model-overlays/gpt-5.4.md', 'test/helpers/codex-session-runner.ts', 'test/helpers/codex-eval.ts', 'test/codex-e2e-plan-format.test.ts'],
  'codex-plan-eng-format-coverage': ['test/paid-retry-supervision.test.ts', 'scripts/resolvers/learnings.ts', 'test/review-entry-and-design-clarity-au.test.ts', 'test/fixtures/plan-scope-recovery-av.json', 'test/plan-scope-recovery-av.test.ts', 'plan-eng-review/**', 'scripts/gen-skill-docs.ts', 'scripts/resolvers/**', 'model-overlays/gpt.md', 'model-overlays/gpt-5.4.md', 'test/helpers/codex-session-runner.ts', 'test/helpers/codex-eval.ts', 'test/codex-e2e-plan-format.test.ts'],
  'codex-plan-eng-format-kind': ['test/paid-retry-supervision.test.ts', 'scripts/resolvers/learnings.ts', 'test/review-entry-and-design-clarity-au.test.ts', 'test/fixtures/plan-scope-recovery-av.json', 'test/plan-scope-recovery-av.test.ts', 'plan-eng-review/**', 'scripts/gen-skill-docs.ts', 'scripts/resolvers/**', 'model-overlays/gpt.md', 'model-overlays/gpt-5.4.md', 'test/helpers/codex-session-runner.ts', 'test/helpers/codex-eval.ts', 'test/codex-e2e-plan-format.test.ts'],
  'overlay-harness-claude-dedicated-tools-vs-bash': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-claude-dedicated-tools-vs-bash.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
  'overlay-harness-opus-4-7-effort-match-trivial': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-opus-4-7-effort-match-trivial.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
  'overlay-harness-opus-4-7-literal-interpretation': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-opus-4-7-literal-interpretation.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
  'overlay-harness-claude-dedicated-tools-vs-bash-sonnet': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-claude-dedicated-tools-vs-bash-sonnet.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
  'overlay-harness-opus-4-7-effort-match-trivial-sonnet': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-opus-4-7-effort-match-trivial-sonnet.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
  'overlay-harness-opus-4-7-literal-interpretation-sonnet': ['model-overlays/**', 'test/fixtures/overlay-nudges.ts', 'test/helpers/agent-sdk-runner.ts', 'test/agent-sdk-runner.test.ts', 'scripts/resolvers/model-overlay.ts', 'test/skill-e2e-overlay-harness-opus-4-7-literal-interpretation-sonnet.test.ts', 'test/helpers/overlay-measurement.ts', 'test/helpers/overlay-workspace.ts', 'test/helpers/overlay-attempt.ts', 'test/overlay-measurement.test.ts', 'test/helpers/overlay-case.ts', 'test/helpers/overlay-case-policy.ts', 'test/helpers/overlay-lifecycle.ts', 'test/overlay-lifecycle.test.ts', 'test/overlay-sdk-cancel-eof.test.ts', 'test/overlay-recording-order.test.ts', 'test/paid-overlay-scheduling.test.ts', 'test/fixtures/overlay-admission-child.ts'],
};

/**
 * E2E test tiers — 'gate' blocks PRs, 'periodic' runs weekly/on-demand.
 * Must have exactly the same keys as E2E_TOUCHFILES.
 */
export const E2E_TIERS: Record<string, 'gate' | 'periodic'> = {
  'shared-libs-review-path-eligibility': 'gate',
  'shared-libs-review-index-flags': 'gate',
  'shared-libs-review-prior-coverage': 'gate',
  'shared-libs-codex-read-only': 'periodic',
  'shared-libs-read-only': 'gate',
  'shared-libs-unsupported-git': 'gate',
  'shared-libs-review-lifecycle': 'gate',
  'shared-libs-review-revalidation': 'gate',
  'shared-libs-opportunity-judgment': 'periodic',
  'shared-libs-pr-coverage': 'periodic',
  // Browse core — gate (if browse breaks, everything breaks)

  // Hermetic isolation — gate (deterministic env/config assertions; if the
  // clean room breaks, every other eval's signal is contaminated)
  'hermetic-canary': 'gate',
  'hermetic-sentinel': 'gate',

  // SKILL.md setup — gate (if setup breaks, no skill works)

  // P4 first-run scaffold — periodic (onboarding, non-safety, model-touched marker)
  'first-task-scaffold': 'periodic',

  // QA — gate for functional, periodic for quality/benchmarks

  // Review — gate for functional/guardrails, periodic for quality
  'review-sql-injection': 'gate',     // Security guardrail
  'review-enum-completeness': 'gate',
  'review-base-branch': 'gate',
  'review-design-lite': 'periodic',   // 4/7 threshold is subjective
  'review-coverage-audit': 'gate',
  'review-dashboard-via': 'gate',

  // Office Hours
  'office-hours-forcing-energy': 'periodic',   // D2a demotion 2026-08: posture score, periodic-grade signal (sibling precedent at office-hours-tone)
  // 'office-hours-builder-wildness' retiered to periodic in v1.32 contributor
  // wave: this is an LLM-judge creativity score (axis_a ≥4 on a "wildness"
  // posture). Per CLAUDE.md tier-classification rules, non-deterministic
  // quality benchmarks belong in periodic, not gate. The wave's +21-line
  // CJK preamble cascade (#1205) pushed the score from 5/5 → 3/3 on the
  // same /office-hours BUILDER prompt — same model, same fixture — proving
  // the bar is sensitive to preamble-byte changes that have nothing to do
  // with the test's intent (creativity, not preamble compliance).
  'office-hours-builder-wildness': 'periodic',

  // Plan reviews — gate for cheap functional, periodic for Opus quality
  'plan-ceo-review': 'periodic',
  'plan-ceo-review-selective': 'periodic',
  'plan-ceo-review-benefits': 'gate',
  'plan-ceo-review-expansion-energy': 'periodic',  // Demoted from gate (2026-08 audit): Opus generator + subjective 2-axis >=4/5 LLM-judge threshold in the merge lane — the exact class siblings were demoted for (a +21-line preamble change once flipped the score). CLAUDE.md's own rule: Opus model test -> periodic.
  'plan-eng-review': 'periodic',
  'plan-eng-review-artifact': 'periodic',
  'plan-eng-coverage-audit': 'gate',

  // Plan-mode handshake. plan-ceo/plan-devex ask-first reliably (gate-tier);
  // plan-eng/plan-design run a long explore/audit before their first
  // AskUserQuestion, so whether they reach a terminal outcome within the 300s
  // budget hinges on stochastic ask-first compliance (~50-67%/run measured).
  // Per the "non-deterministic -> periodic" tiering rule they are periodic:
  // the hardened ask-first gate + the collapsed-form detector lifted them from
  // always-failing to mostly-passing, but they are not deterministic gates.
  'plan-ceo-review-plan-mode': 'gate',
  'plan-eng-review-plan-mode': 'periodic',
  'plan-devex-review-plan-mode': 'gate',
  'plan-mode-no-op': 'gate',
  // v1.21+ auto-mode regression tests
  'office-hours-auto-mode': 'gate',
  'auto-decide-preserved': 'periodic',
  'conductor-prose': 'periodic',

  // Real-PTY E2E batch — tier classification:
  //   gate: cheap, deterministic, run on every PR
  //   periodic: long-running or expensive (>$3/run), run weekly
  'auq-format-gate':                         'gate',       // ~$0.50/run, native SDK question capture, single skill probe
  'plan-ceo-mode-routing':     'periodic',   // ~$3/run, deep navigation through 8-12 prior AskUserQuestions
  'ship-idempotency-pty':      'periodic',   // ~$3/run, real /ship in plan mode

  'ship-section-loading':      'periodic',   // ~$3/run, real /ship; asserts section reads
  'plan-ceo-section-loading':  'periodic',   // ~$3-5/run, real /plan-ceo-review; asserts section read
  'carve-section-loading':     'periodic',   // ~$1-2/skill, data-driven; GSTACK_CARVE_SKILL scopes to one
  'autoplan-chain-pty':        'periodic',   // ~$8/run, full native CEO → Design → DX → Eng sequence; outside disabled

  // Per-finding count + review-report-at-bottom — periodic because each
  // run drives a full skill end-to-end (~25 min, ~$5/run). Sequential
  // execution during calibration; concurrent opt-in only after measured
  // comparison agrees (plan §D15).
  'plan-ceo-finding-count':    'periodic',
  'plan-eng-finding-count':    'periodic',
  'plan-design-finding-count': 'periodic',
  'plan-devex-finding-count':  'periodic',
  'plan-eng-finding-floor':    'periodic',  // stochastic ask-first (see plan-mode-handshake note); periodic
  'plan-ceo-finding-floor':    'gate',
  'plan-design-finding-floor': 'periodic',  // stochastic ask-first (see plan-mode-handshake note); periodic
  'plan-devex-finding-floor':  'gate',
  'plan-eng-multi-finding-batching': 'periodic',
  'plan-ceo-split-overflow': 'periodic',

  // AskUserQuestion format regression — periodic (Opus 4.7 non-deterministic benchmark)
  'plan-ceo-review-format-mode': 'periodic',
  'plan-ceo-review-format-approach': 'periodic',
  'plan-eng-review-format-coverage': 'periodic',
  'plan-eng-review-format-kind': 'periodic',

  // Office-hours Phase 4 silent-auto-decide regression — periodic (Phase 4
  // requires the agent to invent 2-3 architectures, more open-ended than the
  // 4 plan-format cases above). Reclassify to gate if it turns out stable.
  'office-hours-phase4-fork': 'periodic',
  // judgeRecommendation rubric sanity (fixture-based, ~$0.04/run via Haiku)
  'llm-judge-recommendation': 'periodic',

  // v1.7.0.0 Pros/Cons format — cadence + negative-escape evals (all periodic)
  'plan-ceo-review-prosons-cadence': 'periodic',
  'plan-review-prosons-format': 'periodic',
  'plan-review-prosons-hardstop-neg': 'periodic',
  'plan-review-prosons-neutral-neg': 'periodic',

  // CT3 expanded coverage — non-plan-review skills inheriting Pros/Cons (all periodic)

  // /plan-tune — gate (core v1 DX promise: plain-English intent routing)
  'plan-tune-inspect': 'gate',

  // /plan-tune cathedral (T16 per D12 — all gate)
  'plan-tune-hook-capture': 'gate',
  'plan-tune-enforcement': 'gate',
  'plan-tune-annotation': 'gate',
  'plan-tune-dream-cycle': 'gate',

  // Codex offering verification

  // Session Intelligence — gate for data flow, periodic for agent integration
  'timeline-event-flow': 'gate',                   // Binary data flow (no LLM needed)
  'context-recovery-artifacts': 'gate',            // Preamble reads seeded artifacts
  'context-save-writes-file': 'gate',              // /context-save writes a file
  'context-restore-loads-latest': 'gate',          // Cross-branch newest-by-filename restore

  // Context skills live-fire — periodic (each test spawns claude -p, ~$0.20-$0.40)
  'context-save-routing': 'periodic',              // Proves /context-save routes via Skill tool
  'context-save-then-restore-roundtrip': 'periodic', // Full cycle in one session
  'context-restore-fragment-match': 'periodic',    // /context-restore <fragment>
  'context-restore-empty-state': 'periodic',       // Graceful zero-saves message
  'context-restore-list-delegates': 'periodic',    // /context-restore list redirect
  'context-restore-legacy-compat': 'periodic',     // Pre-rename files still load
  'context-save-list-current-branch': 'periodic',  // Default branch filter
  'context-save-list-all-branches': 'periodic',    // --all flag

  // Ship — gate (end-to-end ship path)
  'ship-base-branch': 'gate',
  'ship-local-workflow': 'gate',
  'ship-triage': 'gate',
  'ship-docsync': 'gate',
  'docsync-spawned': 'gate',   // #2733 JSON-contract-through-a-firing-gate proof (deterministic safety)
  // (merge note: main's side also re-added ship-plan-completion /
  // ship-plan-verification here — phantom keys with no declaring test,
  // deleted by the census-integrity commit; the reverse invariant in
  // test/touchfiles.test.ts now fails the suite if they come back.)

  // Retro — gate for cheap branch detection, periodic for full Opus retro
  'retro': 'periodic',
  'retro-base-branch': 'gate',

  // Learnings — gate (functional guardrail: seeded learnings must appear)
  'learnings-show': 'gate',

  // Document-release — gate (CHANGELOG guardrail)
  'document-release': 'gate',

  // Codex — periodic (Opus, requires codex CLI)

  // Multi-AI — periodic (require external CLIs)
  'codex-discover-skill': 'periodic',
  'codex-review-findings': 'periodic',
  'codex-sol-scope-termination': 'periodic',
  'gemini-smoke': 'periodic',

  // Design — gate for cheap functional, periodic for Opus/quality
  'design-consultation-core': 'periodic',
  'design-consultation-existing': 'periodic',
  'design-consultation-preview': 'periodic',   // D2a demotion 2026-08 ($0.89/481s)
  'design-review-plugin-handoff': 'gate',
  'design-html-slop-gate': 'periodic',         // one-pass gate behavior is a judgment call on a fake engine's fixed output


  // gstack-upgrade
  'gstack-upgrade-happy-path': 'gate',

  // Deploy skills
  'land-and-deploy-workflow': 'gate',
  'land-and-deploy-first-run': 'gate',
  'land-and-deploy-review-gate': 'gate',
  'canary-workflow': 'gate',
  'benchmark-workflow': 'gate',
  'setup-deploy-workflow': 'gate',


  // Autoplan — periodic (not yet implemented)

  // Skill routing — periodic (LLM routing is non-deterministic)
  'journey-ideation': 'periodic',
  'journey-plan-eng': 'periodic',
  'journey-debug': 'periodic',
  'journey-qa': 'periodic',
  'journey-code-review': 'periodic',
  'journey-ship': 'periodic',
  'journey-docs': 'periodic',
  'journey-retro': 'periodic',
  'journey-design-system': 'periodic',
  'journey-visual-qa': 'periodic',

  // Opus 4.7 overlay evals — periodic (non-deterministic LLM behavior + Opus cost)
  'fanout-arm-overlay-on': 'periodic',
  'fanout-arm-overlay-off': 'periodic',

  // Overlay efficacy harness (SDK, paid) — periodic only

  // /ios-qa daemon + codegen. Demoted gate -> periodic (2026-08 audit): the
  // gate declaration was never executable in CI — the file sits in
  // PERIODIC_CI_EXCLUDE ("not a CI runner capability"), but that exclusion
  // only applies at tier=periodic, so the gate lane planned a HOLLOW shard
  // on every Linux PR. Periodic keeps it in the weekly census on capable
  // hosts; re-promote if a macOS runner lands (flagged decision in the
  // test-infra overhaul plan).
  'ios-qa-e2e': 'periodic',
  // Swift toolchain only, no device required, but heavier than TS unit tests.
  'ios-qa-swift-build': 'periodic',
  // Requires a real connected + paired iPhone. Manual-trigger only.
  'ios-qa-device': 'periodic',
  // /spec end-to-end PTY pipeline (paid, non-deterministic — periodic-tier).
  'spec-execute': 'periodic',

  // WS2 arm benchmark — periodic: full build-shaped agentic workflows, paid,
  // non-deterministic by construction (research instrument, not a gate).
  'arm-benchmark-native-overbuild': 'periodic',
  'arm-benchmark-crud-endpoint': 'periodic',
  'arm-benchmark-bugfix-decoys': 'periodic',
  'plan-decision-classification': 'periodic',
  'plan-devex-peer-comparison-classification': 'periodic',
  'codex-plan-ceo-format-mode': 'periodic',
  'codex-plan-ceo-format-approach': 'periodic',
  'codex-plan-eng-format-coverage': 'periodic',
  'codex-plan-eng-format-kind': 'periodic',
  'overlay-harness-claude-dedicated-tools-vs-bash': 'periodic',
  'overlay-harness-opus-4-7-effort-match-trivial': 'periodic',
  'overlay-harness-opus-4-7-literal-interpretation': 'periodic',
  'overlay-harness-claude-dedicated-tools-vs-bash-sonnet': 'periodic',
  'overlay-harness-opus-4-7-effort-match-trivial-sonnet': 'periodic',
  'overlay-harness-opus-4-7-literal-interpretation-sonnet': 'periodic',
};

/**
 * LLM-judge test touchfiles — keyed by test description string.
 */
export const LLM_JUDGE_TOUCHFILES: Record<string, string[]> = {
  'qa/SKILL.md workflow':             ['qa/SKILL.md', 'qa/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts'],
  'qa/SKILL.md health rubric':        ['qa/SKILL.md', 'qa/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts'],
  'qa/SKILL.md anti-refusal':         ['qa/SKILL.md', 'qa/SKILL.md.tmpl', 'qa-only/SKILL.md', 'qa-only/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts'],
  'cross-skill greptile consistency': ['review/SKILL.md', 'review/SKILL.md.tmpl', 'ship/SKILL.md', 'ship/SKILL.md.tmpl', 'review/greptile-triage.md', 'retro/SKILL.md', 'retro/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts'],

  // Ship & Release
  'ship/SKILL.md workflow':               ['ship/SKILL.md', 'ship/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts',
    'test/ship-workflow-clarity.test.ts', 'ship/sections/**'
  ],
  'document-release/SKILL.md workflow':   ['document-release/SKILL.md', 'document-release/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],

  // Plan Reviews
  'plan-ceo-review/SKILL.md modes':       ['plan/**', 'scripts/resolvers/preamble.ts', 'plan-ceo-review/SKILL.md', 'plan-ceo-review/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts',
    ],
  'plan-eng-review/SKILL.md sections':    ['plan/**', 'scripts/resolvers/preamble.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json", 'plan-eng-review/SKILL.md', 'plan-eng-review/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts',
    "test/review-entry-and-design-clarity-au.test.ts"
  ],

  // /spec authored-spec quality (paid LLM-judge — periodic-tier).
  'plan-design-review/SKILL.md passes':   ['plan/**', 'scripts/resolvers/preamble.ts',
    "test/plan-scope-recovery-av.test.ts",
    "test/fixtures/plan-scope-recovery-av.json",
    "test/fixtures/design-scope-checkpoint-at.json",'plan-design-review/SKILL.md', 'plan-design-review/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts',
    "test/design-scope-entry-aq.test.ts",

    "test/review-entry-and-design-clarity-au.test.ts", 'scripts/resolvers/design.ts'
  ],

  // Design skills
  'design-review/SKILL.md fix loop':      ['verify/**', 'design-review/SKILL.md', 'design-review/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'design-consultation/SKILL.md research': ['design-consultation/SKILL.md', 'design-consultation/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts', 'scripts/resolvers/design.ts'],

  // Deploy skills
  'land-and-deploy/SKILL.md workflow':    ['land-and-deploy/SKILL.md', 'land-and-deploy/SKILL.md.tmpl', 'land-and-deploy/sections/**', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'canary/SKILL.md monitoring loop':      ['canary/SKILL.md', 'canary/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'benchmark/SKILL.md perf collection':   ['benchmark/SKILL.md', 'benchmark/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'setup-deploy/SKILL.md platform setup': ['setup-deploy/SKILL.md', 'setup-deploy/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],

  // Other skills
  'retro/SKILL.md instructions':          ['scripts/resolvers/learnings.ts', 'retro/sections/**', 'retro/SKILL.md', 'retro/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'qa-only/SKILL.md workflow':            ['scripts/resolvers/testing.ts', 'verify/**', 'qa-only/SKILL.md', 'qa-only/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],
  'gstack-upgrade/SKILL.md upgrade flow': ['gstack-upgrade/SKILL.md', 'gstack-upgrade/SKILL.md.tmpl', 'test/skill-llm-eval.test.ts', 'test/helpers/workflow-judge-input.ts', 'test/helpers/workflow-judge-cache.ts', 'test/workflow-judge-cache.test.ts', 'scripts/eval-input-cache.ts', 'test/eval-input-cache.test.ts', 'test/workflow-judge-input.test.ts', 'test/helpers/workflow-excerpt.ts'],

  // Voice directive
  'voice directive tone':                 ['scripts/resolvers/preamble.ts', 'review/SKILL.md', 'review/SKILL.md.tmpl', 'scripts/gen-skill-docs.ts', 'test/skill-llm-eval.test.ts'],
};

/**
 * Changes to any of these files trigger ALL tests (both E2E and LLM-judge).
 *
 * Keep this list minimal — only files that genuinely affect every test.
 * Scoped dependencies (gen-skill-docs, llm-judge, test-server, worktree,
 * codex/gemini session runners) belong in individual test entries instead.
 */
export const GLOBAL_TOUCHFILES = [
  'scripts/test-strict-output.ts',
  // Canonical paid execution and its shared time allocations affect every paid test.
  'scripts/test-paid-shards.ts',
  'scripts/test-pr-profile.ts',
  'test/helpers/eval-budgets.ts',

  'test/helpers/session-runner.ts',  // All E2E tests use this runner
  'test/helpers/hermetic-env.ts',    // Changes every E2E child's environment
  'test/helpers/eval-store.ts',      // All E2E tests store results here
  'test/helpers/test-selection.ts',  // Selection logic itself — a bug here mis-selects every test
  'test/helpers/touchfiles.ts',      // The facade is executable selection-path code; an edit must run everything (it should never change, so the cost is ~zero)
  'test/helpers/e2e-helpers.ts',     // Shared harness every paid test imports (selection wiring, preflight, describeIfSelected) — an edit here changes every test's behavior
  'test/helpers/paid-test-set.ts',   // Paid-vs-free classification — an edit moves files between suites
  'test/helpers/skill-fixture.ts',   // SKILL.md fixture extraction — reshapes the skill content most E2E suites read
  // NOTE: this file (touchfiles-data.ts) is deliberately NOT a global
  // touchfile. Changes to it route through map-diff selection in
  // test-selection.ts: the old git version is evaluated and the maps are
  // diffed per key, so a data-only edit runs just the affected tests.
  // Map-diff fails CLOSED — any error on that path still runs everything.
];
