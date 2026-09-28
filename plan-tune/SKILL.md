---
name: plan-tune
preamble-tier: 2
version: 1.0.0
description: "Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). (gstack)"
triggers:
  - tune questions
  - stop asking me that
  - too many questions
  - show my profile
  - show my vibe
  - developer profile
  - turn off question tuning
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - AskUserQuestion
  - Glob
  - Grep
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Review which AskUserQuestion prompts fire across gstack skills, set per-question preferences
(never-ask / always-ask / ask-only-for-one-way), inspect the dual-track
profile (what you declared vs what your behavior suggests), and enable/disable
question tuning. Conversational interface — no CLI syntax required.

Use when asked to "tune questions", "stop asking me that", "too many questions",
"show my profile", "what questions have I been asked", "show my vibe",
"developer profile", or "turn off question tuning". 

Proactively suggest when the user says the same gstack question has come up before,
or when they explicitly override a recommendation for the Nth time.

## Start /plan-tune

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "plan-tune" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /plan-tune steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /plan-tune

## Outcome
`/plan-tune` is finished only when this is true: Self-tuning question sensitivity + developer psychographic for gstack (v1: observational). Review which AskUserQuestion prompts fire across gstack skills, set per-question preferences (never-ask / always-ask / ask-only-for-one-way), inspect the dual-track profile (what you declared vs what your behavior suggests), and enable/disable question tuning. Conversational interface — no CLI syntax required. Use when asked to "tune questions", "stop asking me that", "too many questions", "show my profile", "what questions have I been asked", "show my vibe", "developer profile", or "turn off question tuning". (gstack) Proactively suggest when the user says the same gstack question has come up before, or when they explicitly override a recommendation for the Nth time. Verify that outcome for `/plan-tune`, then stop.

## Constraints
Stay on the `/plan-tune` job. Do not expand `/plan-tune` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/plan-tune` says to hand off. Do not read `/plan-tune` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/plan-tune` when the outcome above is verified, or when `/plan-tune` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/plan-tune` or stop.

## Tool contract
## Implicit gates run first
Consent gate: when question_tuning is false and ~/.gstack/.question-tuning-prompted is missing, ask once, then `touch ~/.gstack/.question-tuning-prompted`.
Setup gate: when question_tuning is true and declared answers are empty and ~/.gstack/.declared-setup-prompted is missing, run the 5-question setup, then `touch ~/.gstack/.declared-setup-prompted`.
Show which questions gstack has been asking and set never-ask, always-ask, or ask-only-for-one-way for the question the user names. Do not change question policy they did not mention.
