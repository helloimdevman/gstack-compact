---
name: document-release
preamble-tier: 2
version: 1.0.0
description: Post-ship documentation update. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
triggers:
  - update docs after ship
  - document what changed
  - post-ship docs
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Reads all project docs, cross-references the
diff, builds a Diataxis coverage map (reference/how-to/tutorial/explanation),
updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md to match what shipped,
detects architecture diagram drift, polishes CHANGELOG voice with a sell-test
rubric, cleans up TODOS, and optionally bumps VERSION. Surfaces documentation
debt in the PR body. Use when asked to "update the docs", "sync documentation",
or "post-ship docs". Proactively suggest after a PR is merged or code is shipped.

## Start /document-release

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "document-release" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /document-release steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /document-release

## Outcome
`/document-release` is finished only when this is true: Post-ship documentation update. Reads all project docs, cross-references the diff, builds a Diataxis coverage map (reference/how-to/tutorial/explanation), updates README/ARCHITECTURE/CONTRIBUTING/CLAUDE.md to match what shipped, detects architecture diagram drift, polishes CHANGELOG voice with a sell-test rubric, cleans up TODOS, and optionally bumps VERSION. Surfaces documentation debt in the PR body. Use when asked to "update the docs", "sync documentation", or "post-ship docs". Proactively suggest after a PR is merged or code is shipped. (gstack) Verify that outcome for `/document-release`, then stop.

## Constraints
Stay on the `/document-release` job. Do not expand `/document-release` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/document-release` says to hand off. Read a section only when its trigger below applies.

## Stop
Stop `/document-release` when the outcome above is verified, or when `/document-release` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/document-release` or stop.

## Tool contract
When dispatched as a subagent, follow the spawn contract. NEVER trigger it on their own. The NEVER-do invariants below do apply.
Update the docs the diff made stale: README, ARCHITECTURE, CONTRIBUTING, and the changelog voice. Map coverage with Diataxis. Do not rewrite docs the diff did not touch.

## Carve routing

## Step 1: Pre-flight
Read the diff and the docs it touched.

## Step 1.5: Coverage Map
Map the diff onto Diataxis (tutorial, how-to, reference, explanation) before editing docs.

# Document Release:

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| auditing each doc file and applying updates, polishing CHANGELOG voice, checking cross-doc consistency, cleaning up TODOS, the VERSION bump, and committing (Steps 2-9, after the coverage map in Step 1.5) | `sections/release-body.md` |
> **STOP.** Before auditing each doc file and applying updates, polishing CHANGELOG voice, checking cross-doc consistency, cleaning up TODOS, the VERSION bump, and committing (Steps 2-9, after the coverage map in Step 1.5), Read `sections/release-body.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.

## Important Rules
Do not rewrite docs the diff did not touch. Do not skip the redaction check before commit.
