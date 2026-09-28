---
name: ios-fix
preamble-tier: 2
version: 1.0.0
description: Autonomous iOS bug fixer. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
triggers:
  - fix this ios bug
  - patch the iphone app
  - auto-fix the ios issue
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Takes a bug found by /ios-qa, reads the source,
writes the fix, rebuilds, redeploys, and verifies the fix on the real
device. Closes the loop: find bug → fix bug → confirm fix — zero human
intervention. Captures the pre-bug state snapshot as a regression test
fixture, so the bug can never recur silently.
Use when /ios-qa reports a bug and you want it fixed automatically, or
when asked to "fix this iOS bug", "patch the iPhone app", or "auto-fix
the iOS issue".

Voice triggers (speech-to-text aliases): "fix the iOS bug", "patch the iPhone app", "auto-fix the iOS issue".

## Start /ios-fix

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "ios-fix" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /ios-fix steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /ios-fix

## Outcome
`/ios-fix` is finished only when this is true: Autonomous iOS bug fixer. Takes a bug found by /ios-qa, reads the source, writes the fix, rebuilds, redeploys, and verifies the fix on the real device. Closes the loop: find bug → fix bug → confirm fix — zero human intervention. Captures the pre-bug state snapshot as a regression test fixture, so the bug can never recur silently. Use when /ios-qa reports a bug and you want it fixed automatically, or when asked to "fix this iOS bug", "patch the iPhone app", or "auto-fix the iOS issue". (gstack) Verify that outcome for `/ios-fix`, then stop.

## Constraints
Stay on the `/ios-fix` job. Do not expand `/ios-fix` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/ios-fix` says to hand off. Do not read `/ios-fix` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/ios-fix` when the outcome above is verified, or when `/ios-fix` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/ios-fix` or stop.

## Tool contract
Reproduce the iOS bug through the debug bridge, then patch the smallest source change that the bridge can re-check.
