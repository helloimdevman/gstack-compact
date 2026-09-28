/**
 * Canonical carved-skill guard registry — the single source of truth for which
 * skills are carved (skeleton SKILL.md + on-demand sections/*.md) and what each
 * carve must guarantee.
 *
 * PURE LEAF DATA MODULE (codex outside-voice #1, refined-plan pass): this file
 * has NO runtime imports — `import type` only. parity-harness.ts and
 * skill-size-budget.test.ts derive their carved-skill lists FROM here (no
 * parallel hand-maintained lists), so a runtime import back into either of them
 * would create a cycle. Keep it data.
 *
 * Consumers:
 *   - test/carve-section-ordering.test.ts   (E2, gate)  → staticInvariants
 *   - test/carve-section-loading-*.test.ts    (T2, periodic) → requiredReads + scenario
 *   - test/carve-guard-completeness.test.ts (E1, gate)  → the set must equal the
 *                                                          filesystem carved set
 *   - test/carve-guards-negative.test.ts    (ET1, gate) → injects a broken fixture
 *   - test/helpers/parity-harness.ts        → sectioned/maxSkeletonBytes/minBytes/mustContain
 *   - test/skill-size-budget.test.ts        → SECTIONS_EXTRACTED = CARVED_SKILLS
 *
 * Adding a carve = add one entry here (atomically, in the same commit as the
 * skeleton + manifest + sections — codex #4 — so E1's bidirectional parity never
 * false-positives mid-commit).
 */

/** Static (skeleton-shape) invariants the per-PR ordering guard (E2) asserts. */
export interface CarveStaticInvariants {
  /**
   * Substrings that MUST remain in the always-loaded skeleton. Empty = skip
   * (the skill has no distinctive pre-STOP anchor worth pinning beyond the
   * universal STOP/section-index checks E2 already runs).
   */
  mustStayInSkeleton: string[];
  /**
   * Substrings that MUST appear in the skeleton BEFORE the first STOP-Read
   * (earliest-use, codex #6). For cso: mode-dispatch directives (## Arguments,
   * ## Mode Resolution) must be resolved before any section is read — a dispatch
   * directive stranded after the STOP can't govern which sections to read.
   * Empty/undefined = skip (most skills).
   */
  mustPrecedeStop?: string[];
  /**
   * Substrings that MUST be in the union (skeleton + sections) but MUST NOT be in
   * the skeleton — i.e. the heavy body that the carve relocated. Empty = skip.
   */
  mustMoveToSection: string[];
  /**
   * If set, this marker must appear in the skeleton AFTER the last STOP-Read
   * directive (e.g. the EXIT PLAN MODE GATE that fires once section work returns).
   * Undefined = the skill has no post-STOP gate (operational/conversational carve).
   */
  gateAfterStop?: string;
}

export interface CarveGuard {
  skill: string;
  /** Section .md filenames the manifest lists and the skeleton must STOP-Read. */
  expectedSections: string[];
  /**
   * Sections the behavioral test (T2) asserts the agent actually Read when driven
   * by `scenario`. A non-empty subset of expectedSections — the ones the scenario
   * is built to require. The registry owns this so "registered ⇒ asserted" is
   * structural (codex #2), not policed.
   */
  requiredReads: string[];
  /**
   * Fixture prompt that drives a real `claude -p` run down the STOP-Read path for
   * this skill (codex #7). The behavioral test asserts the run reached the STOP
   * (read requiredReads), not merely that nothing was read.
   */
  scenario: string;
  staticInvariants: CarveStaticInvariants;
  /**
   * How the behavioral guard (T2) exercises this skill:
   *  - 'plan'     → write a PLAN.md fixture, run the review against it
   *  - 'prompt'   → no fixture file; the scenario prompt alone drives the run
   *  - 'external' → covered by a dedicated bespoke test (complex fixtures, e.g.
   *                 ship's git/VERSION/CHANGELOG state). The data-driven loop
   *                 skips it; E1 asserts `externalTest` exists instead.
   */
  behavioral: 'plan' | 'prompt' | 'external';
  /** Required when behavioral === 'external': path (repo-relative) to the dedicated test. */
  externalTest?: string;
  /** Parity: max bytes for the always-loaded skeleton (asserts the carve shrank it). */
  maxSkeletonBytes: number;
  /** Parity: min bytes for the skeleton+sections union (total behavior preserved). */
  minUnionBytes: number;
  /** Parity: content phrases the union must preserve. */
  mustContain: string[];
  /**
   * Parity: optional per-skill override for the union size-growth ceiling vs the
   * v1.53.0.0 baseline (default 1.05). Bumped only when a deliberate cross-cutting
   * preamble feature legitimately grows a smaller carved skeleton past 5%.
   */
  maxSizeRatio?: number;
}

export const CARVE_GUARDS: Record<string, CarveGuard> = {
  ship: {
    skill: 'ship',
    expectedSections: ['apple-release.md', 'tests.md', 'changelog.md', 'pr-body.md', 'greptile.md', 'third-party.md'],
    requiredReads: ['tests.md', 'pr-body.md'],
    scenario: 'Prepare a feature branch for a PR, verify and review the final candidate, then explain the publication gate without actually pushing or creating a PR.',
    staticInvariants: {
      mustStayInSkeleton: ['## 1. Prepare', '## 2. Verify', '## 3. Review', '## 4. Publish', 'Do not dispatch an agent'],
      mustPrecedeStop: ['## 1. Prepare', '## 2. Verify', '## 3. Review', '## 4. Publish'],
      mustMoveToSection: ['gh pr create --base', 'gh pr edit --title'],
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 8_000,
    minUnionBytes: 15_000,
    mustContain: ['VERSION', 'CHANGELOG', 'reviewFreshness', 'merge', 'PR'],
    maxSizeRatio: 1.322,
  },
  plan: {
    skill: 'plan',
    expectedSections: ['frame.md', 'product-review.md', 'design-review.md', 'dx-review.md', 'engineering-review.md', 'spec.md'],
    requiredReads: ['product-review.md', 'engineering-review.md'],
    scenario: 'Review the existing CLI plan in PLAN.md using review-all. There is no UI. Update the plan and stop before implementation.',
    staticInvariants: {
      mustStayInSkeleton: ['Skip an inapplicable perspective without reading its section'],
      mustMoveToSection: ['# Engineering review'],
    },
    behavioral: 'plan',
    maxSkeletonBytes: 6_000,
    minUnionBytes: 3_000,
    mustContain: ['non-goals', 'acceptance checks', 'failure paths', 'stop after the plan'],
  },
  verify: {
    skill: 'verify',
    expectedSections: ['browser.md', 'visual.md', 'developer-flow.md', 'health.md'],
    requiredReads: ['browser.md'],
    scenario: 'Run browser-report on the web application URL. Capture findings and do not edit source.',
    staticInvariants: {
      mustStayInSkeleton: ['Default: report'],
      mustMoveToSection: ['# Browser QA'],
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 5_000,
    minUnionBytes: 5_000,
    mustContain: ['browser-report', 'browser-fix', 'not_applicable', 'unavailable'],
  },
  'document-release': {
    skill: 'document-release',
    expectedSections: ['release-body.md'],
    requiredReads: ['release-body.md'],
    scenario:
      'A PR has shipped a new CLI flag and touched README.md and CHANGELOG.md. Skip the git pre-flight shell commands (assume the diff adds --new-flag and updates those two docs). Run the documentation workflow: build the coverage map, then audit the docs, apply updates, and polish the CHANGELOG voice. Produce the documentation health summary.',
    staticInvariants: {
      mustStayInSkeleton: ['## Step 1: Pre-flight', '## Step 1.5: Coverage Map'],
      mustMoveToSection: ['## Step 2: Per-File Documentation Audit', '## Step 5: CHANGELOG Voice Polish'],
      // Operational skill (no plan-mode review gate).
      gateAfterStop: undefined,
    },
    behavioral: 'prompt',
    // +Conductor AUQ-default-prose rule + one-way/continuation safety in the
    // always-loaded AskUserQuestion Format section.
    // v1.2.0 activation lift: first-run-guidance section in the shared preamble.
    maxSkeletonBytes: 41_000, // + v1.78 AUQ objectivity + v1.79 spawned contract incl. echo-failure tie-breaker; measured 40_575
    minUnionBytes: 56_700, // token-reduction Phases 1-2 (v1.69.x branch): preamble bash -> bin/gstack-skill-start, onboarding -> gated emission; measured union 63,018
    mustContain: ['CHANGELOG', 'Diataxis', 'coverage'],
    // Two intentional additions stack on this small skill: the AUQ-failure prose
    // fallback (v1.57.2.0, ~2KB to every preamble) AND the new default-on Codex
    // documentation-review section (codexPreflight + prompt + apply-gate, carved
    // into release-body so the SKELETON stays under maxSkeletonBytes). On a ~55KB
    // baseline that whole new capability is ~18.6% of union bytes. The doc review
    // is a deliberate new feature, not preamble creep; the union ceiling is raised
    // to match while the skeleton budget (50_000) still holds the always-loaded
    // cost flat.
    maxSizeRatio: 1.20,
  },
  // ── Token-reduction Phase 4 wave 1 (v1.69.x branch) ──────────────────────
  review: {
    skill: 'review',
    expectedSections: ['plan-completion.md', 'risk.md', 'shared-libs.md'],
    requiredReads: ['plan-completion.md', 'risk.md'],
    scenario: 'Review the diff and PLAN.md for supported defects. Report findings without editing.',
    staticInvariants: {
      mustStayInSkeleton: ['gstack-review-log --start review', 'untracked source'],
      mustMoveToSection: ['# Focused risk review'],
    },
    behavioral: 'plan',
    maxSkeletonBytes: 5_000,
    minUnionBytes: 2_000,
    mustContain: ['current diff', 'completed', 'converged', 'evidence_paths'],
  },
  'land-and-deploy': {
    skill: 'land-and-deploy',
    expectedSections: ['first-run-validation.md', 'readiness-gate.md', 'merge-and-deploy.md'],
    requiredReads: ['readiness-gate.md', 'merge-and-deploy.md'],
    scenario:
      'This project has a confirmed prior /land-and-deploy run (treat the Step 1.5 check as CONFIRMED). A PR exists for this branch and CI is green. Simulate — do not run gh or actually merge: run the pre-merge readiness gate and produce the readiness report, then walk the merge and deploy-strategy steps, stating which merge path and deploy strategy you would take. Do NOT use AskUserQuestion.',
    staticInvariants: {
      mustStayInSkeleton: [
        'land-deploy-confirmed',
        '## Step 3.4: VERSION drift detection',
        '## Step 6: Wait for deploy',
      ],
      mustPrecedeStop: ['land-deploy-confirmed'],
      mustMoveToSection: [
        'PRE-MERGE READINESS REPORT',
        'gh pr merge "$MERGE_FLAG" --auto --delete-branch',
        'DEPLOY INFRASTRUCTURE VALIDATION',
      ],
      gateAfterStop: undefined, // operational skill
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 74_500, // + Aside browser contract for Step 7 canary ({{ASIDE_SETUP}}); measured 73_523
    maxSizeRatio: 1.10, // + v1.81 Aside contract + gstack-browser fallback block; measured 1.077
    minUnionBytes: 91_000, // Phase 4 wave 1; estimated union ~94.9KB
    mustContain: ['readiness', 'merge', 'canary', 'revert', 'staging'],
  },
  // ── Token-reduction Phase 4 wave 2 (v1.69.x branch) ──────────────────────
  retro: {
    skill: 'retro',
    expectedSections: ['report-format.md'],
    requiredReads: ['report-format.md'],
    scenario:
      'Run the repo-scoped weekly retrospective for the last 7 days on this repo. There is no origin remote — proceed with the local branch per the guard disclosure rules. The gstack-retro-metrics script is not installed, so follow the degraded path (compute the metrics manually with git). Skip any AskUserQuestion calls — this is non-interactive. Produce the full narrative retrospective report.',
    staticInvariants: {
      mustStayInSkeleton: ['gstack-retro-metrics', '### Step 2: Compute Metrics', '### Step 13: Save Retro History'],
      mustPrecedeStop: ['### Step 2: Compute Metrics'],
      mustMoveToSection: ['## Engineering Retro: [date range]', '### Team Breakdown', 'Plan Completion This Period'],
      gateAfterStop: undefined,
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 73_450, // + v1.78 AUQ spawned-trigger objectivity (explicit declaration + interactive fence); measured 73_059
    minUnionBytes: 66_000, // measured union 73,496
    mustContain: ['retrospective', '45-minute gap', 'Ship of the week', 'Praise'],
  },

  // ── Token-reduction Phase 4 wave 4 (v1.69.x branch): design doctrine carve ──
  // (D3A: read-on-demand doctrine, requiredReads-guarded + loading eval)
  design: {
    skill: 'design',
    expectedSections: ['system.md', 'variants.md', 'html.md', 'detector-install-offer.md'],
    requiredReads: ['html.md'],
    scenario: 'Produce a responsive Pretext-native HTML page from an approved design.',
    staticInvariants: {
      mustStayInSkeleton: ['system | variants | html'],
      mustMoveToSection: ['# Pretext-native HTML and CSS'],
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 5_000,
    minUnionBytes: 5_000,
    mustContain: ['Pretext', 'DESIGN.md', 'keyboard', 'detector'],
  },
  context: {
    skill: 'context',
    expectedSections: ['save.md', 'restore.md', 'learn.md'],
    requiredReads: ['restore.md'],
    scenario: 'Restore the named task snapshot in a different worktree and report what must be reverified.',
    staticInvariants: {
      mustStayInSkeleton: ['save | restore | learn'],
      mustMoveToSection: ['# Restore context'],
    },
    behavioral: 'prompt',
    maxSkeletonBytes: 4_000,
    minUnionBytes: 2_000,
    mustContain: ['worktree', 'base commit', 'permissions', 'gstack-learnings-search'],
  },

};

/** Sorted carved-skill names. Consumers derive their lists from this — no parallel lists. */
export const CARVED_SKILLS: readonly string[] = Object.freeze(
  Object.keys(CARVE_GUARDS).sort(),
);
