/**
 * Skill coverage matrix (v1.45.0.0 T1, cathedral Phase 0).
 *
 * Single source of truth mapping each gstack skill to its E2E test files.
 * The CI gate at test/skill-coverage-matrix.test.ts fails if a skill has
 * no gate-tier entry, ensuring the eval-first foundation holds: every
 * skill has at least one CI-blocking check that asserts must-have
 * behavior.
 *
 * Two tiers per entry:
 *   gate     CI-blocking, runs on every PR, target <$0.50/test or free.
 *   periodic Weekly cron, deeper coverage, can cost ~$1-$3/test.
 *
 * The 'floor' entry refers to test/skill-coverage-floor.test.ts —
 * a structural-compliance smoke test that covers every skill with
 * file-IO checks (free, no LLM cost). When a skill has only 'floor'
 * coverage, that's the eval-first minimum; future work can layer
 * behavioral checks on top.
 */

export interface SkillCoverage {
  /** Gate-tier test file paths (relative to repo root). At least one required per skill. */
  gate: string[];
  /** Periodic-tier test file paths. Optional but recommended. */
  periodic: string[];
  /** Brief note on why this coverage is the right shape for this skill. */
  rationale?: string;
}

/**
 * Per-skill coverage. Keys MUST match the top-level skill directory name.
 * The CI test asserts every skill in the repo has an entry here AND that
 * gate[] is non-empty.
 *
 * Adding a new skill: add an entry here AND either reference an existing
 * test that covers it OR add 'test/skill-coverage-floor.test.ts' as the
 * minimum gate-tier check.
 */
export const SKILL_COVERAGE: Record<string, SkillCoverage> = {
  // ─── Core loop ──────────────────────────────────────────────
  build: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  context: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  design: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  plan: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  sprint: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  verify: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  ship: {
    gate: ['test/skill-e2e-ship-idempotency.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: ['test/skill-e2e-workflow.test.ts'],
  },
  review: {
    gate: ['test/skill-e2e-review.test.ts', 'test/skill-e2e-shared-libs.test.ts', 'test/skill-e2e-shared-libs-paths.test.ts', 'test/shared-libs-evidence.test.ts', 'test/shared-libs-rendering.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: [],
  },
  'deslop-shared-libs': {
    gate: ['test/shared-libs-rendering.test.ts', 'test/skill-e2e-shared-libs.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: ['test/skill-e2e-shared-libs-periodic.test.ts'],
    rationale: 'Free host/discovery checks; native gate traces enforce read-only source access and the actual review advisory lifecycle. Periodic evaluates opportunity and PR coverage judgment.',
  },
  qa: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'Browser QA uses the host-provided user browser; the generated skill is checked structurally.',
  },
  'qa-only': {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'qa-only is qa with --report-only; behavior tested via /qa coverage.',
  },
  investigate: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
  },
  browse: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: '/browse uses the host-provided user browser; its selection contract is checked structurally.',
  },
  spec: {
    gate: [
      'test/spec-template-invariants.test.ts',
      'test/spec-template-sync.test.ts',
      'test/skill-coverage-floor.test.ts',
    ],
    periodic: [
      'test/skill-e2e-spec-execute.test.ts',
      'test/skill-llm-eval-spec.test.ts',
    ],
    rationale: '37 deterministic invariants pin Phase 1/3 gating, --execute race/security hardening, quality-gate redaction, archive contract, plan-mode-aware Phase 5. Periodic adds full PTY pipeline + LLM-judge.',
  },

  // ─── Plan triad ─────────────────────────────────────────────
  'plan-ceo-review': {
    gate: [
      'test/skill-e2e-plan-ceo-finding-floor.test.ts',
      'test/skill-e2e-plan-ceo-plan-mode.test.ts',
      'test/skill-coverage-floor.test.ts',
    ],
    periodic: [
      'test/skill-e2e-plan-ceo-finding-count.test.ts',
      'test/skill-e2e-plan-ceo-mode-routing.test.ts',
    ],
  },
  'plan-eng-review': {
    gate: [
      'test/shared-libs-rendering.test.ts',
      'test/skill-e2e-plan-eng-finding-floor.test.ts',
      'test/skill-e2e-plan-eng-plan-mode.test.ts',
      'test/skill-coverage-floor.test.ts',
    ],
    periodic: [
      'test/skill-e2e-shared-libs-periodic.test.ts',
      'test/skill-e2e-plan-eng-finding-count.test.ts',
      'test/skill-e2e-plan-eng-multi-finding-batching.test.ts',
    ],
  },
  'plan-design-review': {
    gate: [
      'test/skill-e2e-plan-design-finding-floor.test.ts',
      'test/skill-coverage-floor.test.ts',
    ],
    periodic: ['test/skill-e2e-plan-design-finding-count.test.ts'],
  },
  'plan-devex-review': {
    gate: [
      'test/skill-e2e-plan-devex-finding-floor.test.ts',
      'test/skill-e2e-plan-devex-plan-mode.test.ts',
      'test/skill-coverage-floor.test.ts',
    ],
    periodic: ['test/skill-e2e-plan-devex-finding-count.test.ts'],
  },
  autoplan: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: ['test/skill-e2e-autoplan-chain.test.ts'],
  },
  'office-hours': {
    gate: ['test/skill-e2e-office-hours.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: ['test/skill-e2e-office-hours-auto-mode.test.ts', 'test/skill-e2e-office-hours-phase4.test.ts'],
  },

  // ─── Polish + design ────────────────────────────────────────
  'design-review': {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'Design review uses the host-provided user browser; the generated skill is checked structurally.',
  },
  'design-consultation': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'design-shotgun': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'design-html': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  diagram: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'Diagram rendering depends on the host-provided user browser; the generated skill is checked structurally.',
  },
  'document-release': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'document-generate': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },

  // ─── Ops + integrations ─────────────────────────────────────
  'land-and-deploy': { gate: ['test/skill-e2e-deploy.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: [] },
  canary: {
    gate: ['test/skill-e2e-deploy.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'canary-workflow runs the skill in simulation without a browser.',
  },
  benchmark: {
    gate: ['test/skill-e2e-deploy.test.ts', 'test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'benchmark-workflow (gate) runs the skill in simulation without a browser.',
  },
  retro: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: ['test/regression-1624-retro-stale-base.test.ts'],
  },
  'gstack-upgrade': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'context-save': { gate: ['test/skill-e2e-context-skills.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: [] },
  'context-restore': { gate: ['test/skill-e2e-context-skills.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: [] },
  'setup-deploy': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  scrape: {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: '/scrape uses the host-provided user browser; the generated skill is checked structurally.',
  },
  learn: { gate: ['test/skill-e2e-learnings.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: [] },
  'plan-tune': { gate: ['test/skill-e2e-plan-tune.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: [] },

  // ─── iOS family ─────────────────────────────────────────────
  'ios-qa': { gate: ['test/skill-e2e-ios.test.ts', 'test/skill-coverage-floor.test.ts'], periodic: ['test/skill-e2e-ios-device.test.ts', 'test/skill-e2e-ios-swift-build.test.ts'] },
  'ios-fix': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'ios-clean': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'ios-sync': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'ios-design-review': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },

  // ─── Safety / housekeeping ──────────────────────────────────
  careful: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  freeze: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  unfreeze: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  guard: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'landing-report': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  health: { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
  'make-pdf': {
    gate: ['test/skill-coverage-floor.test.ts'],
    periodic: [],
    rationale: 'The HTML helper has free tests; PDF export depends on the host-provided user browser.',
  },
  'devex-review': { gate: ['test/skill-coverage-floor.test.ts'], periodic: [] },
};
