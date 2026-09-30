---
name: gpact-verify
version: 1.0.0
description: |
  Verify the changed interface with executable evidence. Report by default;
  fix only in an authorized fix mode. (gstack)
preamble-tier: 2
triggers:
  - verify this
  - test this
  - qa this
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-verify

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "verify" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-verify steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-verify

## When to invoke

Input: request, current diff or artifact, and optional `browser-report | browser-fix | visual-fix | developer-flow | health` mode. Default: report findings and evidence without source edits. `browser-report` checks a browser flow without editing; `browser-fix` fixes requested browser defects and re-verifies them. Fix only scoped defects when the user asks for a fix.

Exercise the changed interface: CLI valid/invalid commands and effects, API public behavior and edge cases, and docs links and commands. For a UI flow, use a browser already supplied by the host if available; otherwise report it as `unavailable`. Run relevant tests and retain failures. Report pass, fail, skipped, `unavailable` for missing tools, or `not_applicable` for absent interfaces. Unavailable is not pass.

Use `developer-flow` to measure first success and recovery. Use `health` for the code-quality dashboard. Report what ran, what failed, what remains unrun, and any files changed.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| running browser-fix or browser-report on a web flow | `sections/browser.md` |
| running visual-fix on a rendered UI | `sections/visual.md` |
| running developer-flow on an install or integration flow | `sections/developer-flow.md` |
| running health mode for code-quality status | `sections/health.md` |

> **STOP.** Before running developer-flow on an install or integration flow, Read `sections/developer-flow.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before running health mode for code-quality status, Read `sections/health.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
