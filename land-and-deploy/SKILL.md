---
name: land-and-deploy
preamble-tier: 4
version: 1.0.0
description: Land and deploy workflow. (gstack)
triggers:
  - merge and deploy
  - land the pr
  - ship to production
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Merges the PR, waits for CI and deploy,
verifies production health via canary checks. Takes over after /ship
creates the PR. Use when: "merge", "land", "deploy", "merge and verify",
"land it", "ship it to production".

## Start /land-and-deploy

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "land-and-deploy" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /land-and-deploy steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /land-and-deploy

## Outcome
`/land-and-deploy` is finished only when this is true: Land and deploy workflow. Merges the PR, waits for CI and deploy, verifies production health via canary checks. Takes over after /ship creates the PR. Use when: "merge", "land", "deploy", "merge and verify", "land it", "ship it to production". (gstack) Verify that outcome for `/land-and-deploy`, then stop.

## Constraints
Stay on the `/land-and-deploy` job. Do not expand `/land-and-deploy` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/land-and-deploy` says to hand off. Read a section only when its trigger below applies.

## Stop
Stop `/land-and-deploy` when the outcome above is verified, or when `/land-and-deploy` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/land-and-deploy` or stop.

## Tool contract
After `/ship` has a PR, merge it, watch CI and the deploy command from `setup-deploy`, and hit the production health URL. Stop when production matches the merge or the health check fails.

## Carve routing

land-deploy-confirmed means a prior setup exists. If it does not, stop and run /setup-deploy.

## Step 3.4: VERSION drift detection
Compare VERSION on the branch with the base. On a clean compare, continue to Step 3.4, then Step 3.5 before merging.

## Step 6: Wait for deploy
Poll the health URL after merge. Do not claim production is healthy early.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| running the first-run dry-run validation — Step 1.5's check returned FIRST_RUN or CONFIG_CHANGED (skip on CONFIRMED) | `sections/first-run-validation.md` |
| the pre-merge readiness gate (Step 3.5) — the last check before the irreversible merge | `sections/readiness-gate.md` |
| merging the PR and detecting the deploy strategy (Steps 4-5) | `sections/merge-and-deploy.md` |
> **STOP.** Before running the first-run dry-run validation — Step 1.5's check returned FIRST_RUN or CONFIG_CHANGED (skip on CONFIRMED), Read `sections/first-run-validation.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before the pre-merge readiness gate (Step 3.5) — the last check before the irreversible merge, Read `sections/readiness-gate.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before merging the PR and detecting the deploy strategy (Steps 4-5), Read `sections/merge-and-deploy.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
