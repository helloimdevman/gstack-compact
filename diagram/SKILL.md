---
name: diagram
preamble-tier: 1
version: 1.0.0
description: "Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open on excalidraw.com, and rendered SVG + PNG. (gstack)"
triggers:
  - make a diagram
  - draw a diagram
  - create a flowchart
  - diagram this
  - visualize this flow
  - architecture diagram
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

The SVG/PNG use clean mermaid style; the
.excalidraw carries the hand-drawn aesthetic. Fully offline.
Use when asked to "make a diagram", "draw the architecture", "create a
flowchart", "diagram this", or "visualize this flow".

## Start /diagram

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "diagram" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /diagram steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /diagram

## Outcome
`/diagram` is finished only when this is true: Turn an English description (or mermaid source) into a diagram triplet: the source, an editable .excalidraw file you can open on excalidraw.com, and rendered SVG + PNG. The SVG/PNG use clean mermaid style; the .excalidraw carries the hand-drawn aesthetic. Fully offline. Use when asked to "make a diagram", "draw the architecture", "create a flowchart", "diagram this", or "visualize this flow". (gstack) Verify that outcome for `/diagram`, then stop.

## Constraints
Stay on the `/diagram` job. Do not expand `/diagram` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/diagram` says to hand off. Do not read `/diagram` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/diagram` when the outcome above is verified, or when `/diagram` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/diagram` or stop.

## Tool contract
Read the installed `/browse` skill. Create the Mermaid source. If the user's host-provided browser can open and evaluate the offline `lib/diagram-render/dist/diagram-render.html` page, use its `__renderMermaid`, `__mermaidToExcalidraw`, and `__rasterize` functions to export SVG, editable `.excalidraw`, and PNG beside the source. Keep the render offline. If the browser cannot run the page or return the artifacts, retain the Mermaid source and report the other formats unavailable. Never launch a separate browser.
