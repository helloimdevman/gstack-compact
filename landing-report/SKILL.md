---
name: landing-report
preamble-tier: 2
version: 0.1.0
description: Read-only queue dashboard for workspace-aware ship. (gstack)
triggers:
  - landing report
  - version queue
  - ship queue
  - what version comes next
  - show open PR versions
allowed-tools:
  - Bash
  - Read
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Shows which VERSION slots
are currently claimed by open PRs, which sibling Conductor workspaces have
WIP work likely to ship soon, and what slot /ship would pick next. No
mutations — just a snapshot. Use when asked to "landing report", "what's in
the queue", "show me open PRs", or "which version do I claim next".

## Start /landing-report

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "landing-report" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /landing-report steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /landing-report

## Outcome
`/landing-report` is finished only when this is true: Read-only queue dashboard for workspace-aware ship. Shows which VERSION slots are currently claimed by open PRs, which sibling Conductor workspaces have WIP work likely to ship soon, and what slot /ship would pick next. No mutations — just a snapshot. Use when asked to "landing report", "what's in the queue", "show me open PRs", or "which version do I claim next". (gstack) Verify that outcome for `/landing-report`, then stop.

## Constraints
Stay on the `/landing-report` job. Do not expand `/landing-report` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/landing-report` says to hand off. Do not read `/landing-report` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/landing-report` when the outcome above is verified, or when `/landing-report` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/landing-report` or stop.

## Tool contract
Read-only. List open PRs, claimed VERSION slots, and which slot `/ship` would take next. Do not merge, push, or edit.
