---
name: gpact-context
version: 1.0.0
description: Save working state, restore it against the current checkout, or manage project learnings. (gstack)
preamble-tier: 2
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
triggers:
  - save context
  - restore context
  - show learnings
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Select one requested mode.

## Start /gpact-context

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "context" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-context steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-context

Input: mode `save | restore | learn`, optional task ID or snapshot path, and the user's scope. Select the mode from the request when omitted. Use the installed `gstack-paths` and `gstack-slug` state roots or the user's path. Saved context stays local. A saved approval or passing check is history, not current authority or proof.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| saving this task for a later session | `sections/save.md` |
| resuming a saved task in the current checkout | `sections/restore.md` |
| searching, showing, pruning, or exporting project learnings | `sections/learn.md` |

> **STOP.** Before saving this task for a later session, Read `sections/save.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before resuming a saved task in the current checkout, Read `sections/restore.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before searching, showing, pruning, or exporting project learnings, Read `sections/learn.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
