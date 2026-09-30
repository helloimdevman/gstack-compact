---
name: gpact-investigate
preamble-tier: 2
version: 1.0.0
description: Systematic debugging with root cause investigation. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
  - WebSearch
triggers:
  - debug this
  - fix this bug
  - why is this broken
  - root cause analysis
  - investigate this error
hooks:
  PreToolUse:
    - matcher: "Edit"
      hooks:
        - type: command
          command: 'bash -c ''S="$HOME/.claude/skills/gstack/freeze/bin/check-freeze.sh"; [ -x "$S" ] && exec bash "$S"; exit 0'''
          statusMessage: "Checking debug scope boundary..."
    - matcher: "Write"
      hooks:
        - type: command
          command: 'bash -c ''S="$HOME/.claude/skills/gstack/freeze/bin/check-freeze.sh"; [ -x "$S" ] && exec bash "$S"; exit 0'''
          statusMessage: "Checking debug scope boundary..."
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Four phases: investigate,
analyze, hypothesize, implement. Iron Law: no fixes without root cause.
Use when asked to "debug this", "fix this bug", "why is this broken",
"investigate this error", or "root cause analysis".
Proactively invoke this skill (do NOT debug directly) when the user reports
errors, 500 errors, stack traces, unexpected behavior, "it was working
yesterday", or is troubleshooting why something stopped working.

## Start /gpact-investigate

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "investigate" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-investigate steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

## Shared contract

Read the printed `GSTACK_CONTRACT` file before acting. It owns common permissions and safety.

## Model-Specific Behavioral Patch (claude)

The following nudges are tuned for the claude model family. They are
**subordinate** to skill workflow, STOP points, AskUserQuestion gates, plan-mode
safety, and /gpact-ship review gates. If a nudge below conflicts with skill instructions,
the skill wins. Treat these as preferences, not rules.

**Todo-list discipline.** When working through a multi-step plan, mark each task
complete individually as you finish it. Do not batch-complete at the end. If a task
turns out to be unnecessary, mark it skipped with a one-line reason.

**Think before heavy actions.** For complex operations (refactors, migrations,
non-trivial new features), briefly state your approach before executing. This lets
the user course-correct cheaply instead of mid-flight.

**Dedicated tools over Bash.** Prefer Read, Edit, Write, Glob, Grep over shell
equivalents (cat, sed, find, grep). The dedicated tools are cheaper and clearer.

# /gpact-investigate

## Outcome
`/gpact-investigate` is finished only when this is true: Systematic debugging with root cause investigation. Four phases: investigate, analyze, hypothesize, implement. Iron Law: no fixes without root cause. Use when asked to "debug this", "fix this bug", "why is this broken", "investigate this error", or "root cause analysis". Proactively invoke this skill (do NOT debug directly) when the user reports errors, 500 errors, stack traces, unexpected behavior, "it was working yesterday", or is troubleshooting why something stopped working. (gstack) Verify that outcome for `/gpact-investigate`, then stop.

## Constraints
Stay on the `/gpact-investigate` job. Do not expand `/gpact-investigate` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/gpact-investigate` says to hand off. Do not read `/gpact-investigate` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/gpact-investigate` when the outcome above is verified, or when `/gpact-investigate` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/gpact-investigate` or stop.

## Tool contract
Find the root cause before changing code. State the hypothesis, the check that would falsify it, and the result. A fix without a cause is not done.

```bash
S="$HOME/.claude/skills/gstack/freeze/bin/check-freeze.sh"
[ -x "$S" ] && exec bash "$S"; exit 0
_FREEZE_SCRIPT="$HOME/.claude/skills/gstack/freeze/bin/check-freeze.sh"
[ -x "$_FREEZE_SCRIPT" ] && echo "FREEZE_AVAILABLE" || echo "FREEZE_UNAVAILABLE"
```
