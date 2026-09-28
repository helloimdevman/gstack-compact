---
name: build
version: 1.0.0
description: Implement an approved change, including focused regression checks and a reviewable diff. (gstack)
preamble-tier: 2
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
triggers:
  - implement this
  - build this
  - fix this
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Start directly when the task is already clear.

## Start /build

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "build" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /build steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /build

Input: the user's implementation request or plan path and its acceptance conditions. A small, clear change needs only a brief scope check; do not require a product interview or architecture redesign. Use the user's existing authorization and project rules.

1. Inspect the relevant code, callers, inputs, outputs, and current behavior. For a bug, preserve the original failure and establish its cause before editing.
2. Reuse an existing helper, standard library, or platform feature where it covers the job. Make the smallest change that meets the acceptance conditions. Keep adjacent findings separate unless authorized.
3. For nontrivial logic or a security/data boundary, leave a focused check that fails on the original defect. For a CLI change, exercise valid input, an invalid argument, exit status, stderr, and file effects. Do not start a browser for a non-web change.
4. Run affected tests and required project checks. Classify a failure as product, test, detector, or environment before changing the code or the test. Recheck after any fix.
5. Inspect the final diff and report the implemented behavior, checks with outcomes, and remaining limitations. Finish when the requested implementation is verified. Continue to review, PR, or deployment only when the user or a selected workflow requested it.

If a missing product decision changes the result or a protected action lacks authority, ask only that decision with a recommendation and keep independent work moving. Do not mark an unrun check as passed.
