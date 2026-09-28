// ─── Shared Design Constants ────────────────────────────────

import { DESIGN_SLOP_CATALOG } from '../../lib/design-catalog';

/**
 * gstack's AI slop anti-patterns — shared between DESIGN_METHODOLOGY and DESIGN_HARD_RULES.
 *
 * Derived from the typed catalog in lib/design-catalog.ts: the 11 entries flagged
 * `legacyBlacklist`, prose verbatim, in catalog order. Overused fonts live there
 * too (OVERUSED_FONTS_DISPLAY), role-scoped: banned as the display voice, several
 * still fine as body/UI on an Operate or Read surface.
 */
export const AI_SLOP_BLACKLIST: string[] = DESIGN_SLOP_CATALOG
  .filter(e => e.legacyBlacklist)
  .map(e => e.prose);

/** OpenAI hard rejection criteria (from "Designing Delightful Frontends with GPT-5.4", Mar 2026) */
export const OPENAI_HARD_REJECTIONS = [
  'Generic SaaS card grid as first impression',
  'Beautiful image with weak brand',
  'Strong headline with no clear action',
  'Busy imagery behind text',
  'Sections repeating same mood statement',
  'Carousel with no narrative purpose',
  'App UI made of stacked cards instead of layout',
];

/** OpenAI litmus checks — 7 yes/no design review checks */
export const OPENAI_LITMUS_CHECKS = [
  'Brand/product unmistakable in first screen?',
  'One strong visual anchor present?',
  'Page understandable by scanning headlines only?',
  'Each section has one job?',
  'Are cards actually necessary?',
  'Does motion improve hierarchy or atmosphere?',
  'Would design feel premium with all decorative shadows removed?',
];

/**
 * Canonical foreground-dispatch guidance (#497 → #2440 → third recurrence at
 * /ship Step 18). Claude Code v2.1.198 made Agent-tool subagents run in the
 * BACKGROUND by default; a synchronous dispatch site must pass the flag
 * explicitly or the parent waits on output that never arrives. Rendered via
 * {{FOREGROUND_DISPATCH_NOTE}} in section templates; resolver sites may
 * interpolate it directly. Same name as the placeholder for grep-ability.
 */
/** The Claude Code release that flipped Agent-tool subagents to background-by-default (#497/#2440 class). Interpolated at every RESOLVER site — grep 'Claude Code v2.1' when bumping. */
export const CC_BACKGROUND_DEFAULT_SINCE = 'Claude Code v2.1.198';

export const FOREGROUND_DISPATCH_NOTE =
  `**Foreground required:** pass \`run_in_background: false\` on the Agent call — subagents run in the BACKGROUND by default since ${CC_BACKGROUND_DEFAULT_SINCE}. (Merely omitting the flag no longer produces a foreground run; it must be explicitly false.) The dispatch happens ONLY via the Agent tool: invoking the target as a Skill, or executing its workflow inline in your own context, is WRONG even though the skill may appear in your available-skills list — inline execution forfeits the fresh-context isolation this dispatch exists for, and the explicit flag already makes the Agent call block. (Where a step defines an inline FALLBACK, it applies only after a dispatched subagent has failed.)`;
