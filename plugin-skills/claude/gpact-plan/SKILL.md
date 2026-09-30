---
name: gpact-plan
version: 1.0.0
description: Frame a product idea, plan implementation, review an existing plan, or write an executable spec. (gstack)
preamble-tier: 2
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
  - WebSearch
triggers:
  - plan this
  - review this plan
  - frame this idea
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Choose only the perspectives the request needs.

## Start /gpact-plan

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "plan" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-plan steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-plan

Input: the user's goal or plan path, optional mode `frame | review-product | review-design | review-dx | review-engineering | review-all | spec`, and any existing decisions. If no mode is given, select the smallest set of perspectives needed by the input. Read the plan and relevant code before reviewing. Carry the user's constraints and prior authorization through every mode.

Work in one plan document. Record the goal, non-goals, relevant code, chosen approach, interfaces, failure paths, implementation steps, checks, and open decisions. For a small change, keep this short. Do not run implementation, publish an issue, or open a PR unless the user's request separately authorizes that action. Stop after the plan or requested spec. Missing product-defining information may be asked once with a recommendation; continue independent analysis while waiting.

For `review-all`, run product first, then design only if UI scope exists, then DX only if users install or integrate a developer-facing interface, then engineering last. Incorporate accepted changes into the same document before the next perspective. Skip an inapplicable perspective without reading its section. A specific review mode reads only its own section and the plan; `frame` and `spec` read their named sections. At the end, distinguish settled decisions from open ones and verify the plan remains executable.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| framing an unclear idea or running frame mode | `sections/frame.md` |
| reviewing product scope or the product phase of review-all | `sections/product-review.md` |
| reviewing a UI plan or the applicable design phase of review-all | `sections/design-review.md` |
| reviewing a developer-facing plan or the applicable DX phase of review-all | `sections/dx-review.md` |
| reviewing engineering details or the final phase of review-all | `sections/engineering-review.md` |
| writing a spec or a requested issue | `sections/spec.md` |

> **STOP.** Before framing an unclear idea or running frame mode, Read `sections/frame.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before reviewing product scope or the product phase of review-all, Read `sections/product-review.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before reviewing a UI plan or the applicable design phase of review-all, Read `sections/design-review.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before reviewing a developer-facing plan or the applicable DX phase of review-all, Read `sections/dx-review.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before reviewing engineering details or the final phase of review-all, Read `sections/engineering-review.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before writing a spec or a requested issue, Read `sections/spec.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
