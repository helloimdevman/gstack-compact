---
name: retro
preamble-tier: 2
version: 2.0.0
description: Weekly engineering retrospective. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Glob
  - AskUserQuestion
triggers:
  - weekly retro
  - what did we ship
  - engineering retrospective
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Analyzes commit history, work patterns,
and code quality metrics with persistent history and trend tracking.
Team-aware: breaks down per-person contributions with praise and growth areas.
Use when asked to "weekly retro", "what did we ship", or "engineering retrospective".
Proactively suggest at the end of a work week or sprint.

## Start /retro

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "retro" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /retro steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

## Shared contract

Read the printed `GSTACK_CONTRACT` file before acting. It owns common permissions and safety.

## Model-Specific Behavioral Patch (claude)

The following nudges are tuned for the claude model family. They are
**subordinate** to skill workflow, STOP points, AskUserQuestion gates, plan-mode
safety, and /ship review gates. If a nudge below conflicts with skill instructions,
the skill wins. Treat these as preferences, not rules.

**Todo-list discipline.** When working through a multi-step plan, mark each task
complete individually as you finish it. Do not batch-complete at the end. If a task
turns out to be unnecessary, mark it skipped with a one-line reason.

**Think before heavy actions.** For complex operations (refactors, migrations,
non-trivial new features), briefly state your approach before executing. This lets
the user course-correct cheaply instead of mid-flight.

**Dedicated tools over Bash.** Prefer Read, Edit, Write, Glob, Grep over shell
equivalents (cat, sed, find, grep). The dedicated tools are cheaper and clearer.

# /retro

## Outcome
`/retro` is finished only when this is true: Weekly engineering retrospective. Analyzes commit history, work patterns, and code quality metrics with persistent history and trend tracking. Team-aware: breaks down per-person contributions with praise and growth areas. Use when asked to "weekly retro", "what did we ship", or "engineering retrospective". Proactively suggest at the end of a work week or sprint. (gstack) Verify that outcome for `/retro`, then stop.

## Constraints
Stay on the `/retro` job. Do not expand `/retro` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/retro` says to hand off. Read `/retro` sections/ when a STOP in this skill names that section.

## Stop
Stop `/retro` when the outcome above is verified, or when `/retro` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/retro` or stop.

## Tool contract
Summarize what merged in the window the user named. Attribute work, note a trend if history exists, and stop. Do not file new projects.

## Carve routing

gstack-retro-metrics is optional. If it is missing, compute the metrics with git. The first output line must be `RETRO_METRICS_PROTO: 1`.

```bash
_M="$HOME/.claude/skills/gstack/bin/gstack-retro-metrics"
[ -x "$_M" ] || _M=".claude/skills/gstack/bin/gstack-retro-metrics"
"$_M" --base "<default>" --since "<since>" || echo "RETRO_METRICS: unavailable — stale install (read the helper source for manual computation)"
```

### Step 2: Compute Metrics
Use the last 7 days unless the user names a window.

### Step 13: Save Retro History
Write the retro where the next run can read it. Do not file new projects.

## Instructions
Collect the window, the metrics, and the compare-mode inputs before writing the narrative.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| collecting the retro window, metrics, and compare-mode report inputs (before the narrative template) | `sections/instructions.md` |
| writing the retrospective narrative (Step 14, after all metrics are computed and compared) | `sections/report-format.md` |
> **STOP.** Before collecting the retro window, metrics, and compare-mode report inputs (before the narrative template), Read `sections/instructions.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.

## Tone
Keep the report concrete and attributed. Do not invent metrics.

> **STOP.** Before writing the retrospective narrative (Step 14, after all metrics are computed and compared), Read `sections/report-format.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
