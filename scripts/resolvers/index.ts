/**
 * RESOLVERS record — maps {{PLACEHOLDER}} names to generator functions
 * or gated entries.
 *
 * Each resolver takes a TemplateContext and returns the replacement string.
 * Resolvers may be either a bare function (always fires) or a gated entry
 * ({ resolve, appliesTo }) where appliesTo can return false to skip the
 * resolver for a given skill. See ./types.ts: ResolverEntry.
 *
 * Most resolvers don't need a gate — the {{NAME}} placeholder system is
 * already conditional at the template level (the resolver only fires for
 * skills that reference it). Use a gate when you want a structural
 * guardrail that says "this placeholder is meaningful only in skills X, Y, Z"
 * even if someone later adds {{NAME}} to skill W.
 */

import type { TemplateContext, ResolverFn } from './types';

// Domain modules
import { generateInstalledPreamble } from './preamble';
import { generateQuestionTuning } from './question-tuning';
import { generateRouterMap } from './router-map';
import { generateTestFailureTriage } from './preamble';
import { generateDesignMethodology, generateDesignHardRules, generateDesignReviewLite, generateDesignSketch, generateDesignSetup, generateDesignMockup, generateDesignShotgunLoop, generateTasteProfile, generateUXPrinciples, generateOverusedFonts, generateDesignSlopBullets, generateDesignDetector, generateDesignMdCheck } from './design';
import { generateTestBootstrap, generateTestCoverageAuditPlan, generateTestCoverageAuditShip, generateTestCoverageGateShip } from './testing';
import { generateSlugEval, generateSlugSetup, generateBaseBranchDetect, generateDeployBootstrap, generateQAMethodology, generateCoAuthorTrailer, generateChangelogWorkflow, generateClaudeModelFlag, generateSetupCommand } from './utility';
import { generateLearningsSearch, generateLearningsLog } from './learnings';
import { generateConfidenceCalibration } from './confidence';
import { generateInvokeSkill, generateAutoplanReviewFile, generateAutoplanSnapshotTool, generateAutoplanPublicationHook } from './composition';
import { generateDxFramework } from './dx';
import { generateModelOverlay } from './model-overlay';
import { generateTasksSectionEmit, generateTasksSectionAggregate } from './tasks-section';
import { SECTION, SECTION_INDEX } from './sections';
import { generateRedactInvocationBlock } from './redact-doc';
import { FOREGROUND_DISPATCH_NOTE } from './constants';
import { generateBrowserSetup, generateUntrustedContentWarning } from './browser';
import { generateDesignDocDiscovery } from './design-doc-discovery';
import { generateSharedLibsRubric } from './shared-libs';

export const RESOLVERS: Record<string, ResolverFn> = {
  AUTOPLAN_PUBLICATION_HOOK: generateAutoplanPublicationHook,
  HOST_ID: (ctx) => ctx.host,
  SLUG_EVAL: generateSlugEval,
  SLUG_SETUP: generateSlugSetup,
  CLAUDE_MODEL_FLAG: generateClaudeModelFlag,
  REDACT_INVOCATION_BLOCK: generateRedactInvocationBlock,
  DESIGN_DOC_DISCOVERY: generateDesignDocDiscovery,
  SHARED_LIBS_RUBRIC: generateSharedLibsRubric,
  UNTRUSTED_CONTENT_WARNING: generateUntrustedContentWarning,
  PREAMBLE: generateInstalledPreamble,
  QUESTION_TUNING: generateQuestionTuning,
  ROUTER_MAP: generateRouterMap,
  BROWSER_SETUP: generateBrowserSetup,
  BASE_BRANCH_DETECT: generateBaseBranchDetect,
  QA_METHODOLOGY: generateQAMethodology,
  DESIGN_METHODOLOGY: generateDesignMethodology,
  DESIGN_HARD_RULES: generateDesignHardRules,
  OVERUSED_FONTS: generateOverusedFonts,
  DESIGN_DETECTOR: generateDesignDetector,
  DESIGN_MD_CHECK: generateDesignMdCheck,
  DESIGN_SLOP_BULLETS: generateDesignSlopBullets,
  UX_PRINCIPLES: generateUXPrinciples,
  DESIGN_REVIEW_LITE: generateDesignReviewLite,
  TEST_BOOTSTRAP: generateTestBootstrap,
  TEST_COVERAGE_AUDIT_PLAN: generateTestCoverageAuditPlan,
  TEST_COVERAGE_AUDIT_SHIP: generateTestCoverageAuditShip,
  TEST_COVERAGE_GATE_SHIP: generateTestCoverageGateShip,
  TEST_FAILURE_TRIAGE: generateTestFailureTriage,
  DESIGN_SKETCH: generateDesignSketch,
  DESIGN_SETUP: generateDesignSetup,
  DESIGN_MOCKUP: generateDesignMockup,
  DESIGN_SHOTGUN_LOOP: generateDesignShotgunLoop,
  DEPLOY_BOOTSTRAP: generateDeployBootstrap,
  CO_AUTHOR_TRAILER: generateCoAuthorTrailer,
  SETUP_COMMAND: generateSetupCommand,
  LEARNINGS_SEARCH: generateLearningsSearch,
  LEARNINGS_LOG: generateLearningsLog,
  CONFIDENCE_CALIBRATION: generateConfidenceCalibration,
  INVOKE_SKILL: generateInvokeSkill,
  AUTOPLAN_REVIEW_FILE: generateAutoplanReviewFile,
  AUTOPLAN_SNAPSHOT_TOOL: generateAutoplanSnapshotTool,
  CHANGELOG_WORKFLOW: generateChangelogWorkflow,
  DX_FRAMEWORK: generateDxFramework,
  TASTE_PROFILE: generateTasteProfile,
  BIN_DIR: (ctx) => ctx.paths.binDir,
  FOREGROUND_DISPATCH_NOTE: () => FOREGROUND_DISPATCH_NOTE,
  MODEL_OVERLAY: generateModelOverlay,
  TASKS_SECTION_EMIT: generateTasksSectionEmit,
  TASKS_SECTION_AGGREGATE: generateTasksSectionAggregate,
  SECTION,
  SECTION_INDEX,
};
