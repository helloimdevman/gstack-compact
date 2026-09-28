---
name: document-generate
preamble-tier: 2
version: 1.0.0
description: Generate missing documentation from scratch for a feature, module, or entire project. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
triggers:
  - write docs for this
  - generate documentation
  - document this feature
  - create a tutorial
  - write a how-to
  - explain this module
  - docs for this project
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Uses the Diataxis framework (tutorial / how-to / reference / explanation) to produce
complete, structured documentation. Can be invoked standalone or called by
/document-release when it finds coverage gaps. Use when asked to "write docs",
"generate documentation", "document this feature", "create a tutorial", or
"explain this module".

## Start /document-generate

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "document-generate" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /document-generate steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /document-generate

## Outcome
`/document-generate` is finished only when this is true: Generate missing documentation from scratch for a feature, module, or entire project. Uses the Diataxis framework (tutorial / how-to / reference / explanation) to produce complete, structured documentation. Can be invoked standalone or called by /document-release when it finds coverage gaps. Use when asked to "write docs", "generate documentation", "document this feature", "create a tutorial", or "explain this module". (gstack) Verify that outcome for `/document-generate`, then stop.

## Constraints
Stay on the `/document-generate` job. Do not expand `/document-generate` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/document-generate` says to hand off. Do not read `/document-generate` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/document-generate` when the outcome above is verified, or when `/document-generate` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/document-generate` or stop.

## Tool contract
Write the missing doc in one Diataxis mode: tutorial, how-to, reference, or explanation. Match the repo's existing docs voice. Do not invent APIs.

Before commit, scan the staged doc diff:

```bash
git diff --cached | ~/.claude/skills/gstack/bin/gstack-redact --repo-visibility "${REDACT_VIS:-unknown}" --json
# exit 3 (HIGH) → unstage the offending doc, remove the secret, re-stage. Do NOT commit.
```

Then `git commit -m` only if the scan is clean.
