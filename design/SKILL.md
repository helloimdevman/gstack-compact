---
name: design
version: 1.0.0
description: Create a design system, compare visual variants, or produce Pretext-native HTML and CSS. (gstack)
preamble-tier: 2
triggers:
  - design a system
  - design variants
  - design html
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Choose one requested mode.

## Start /design

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "design" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /design steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /design

Input: brief or approved design, optional mode `system | variants | html`, and output path. Select the requested mode; if unspecified, use the deliverable the user named. A plan critique belongs to `/plan review-design`; a live visual defect belongs to `/verify visual-fix`. Keep the user's existing design decisions and constraints.

`system` writes a reviewable token and component specification. `variants` produces distinct options and a comparison board. `html` produces working, responsive Pretext-native HTML/CSS using the installed renderer contract. Read only the chosen mode's section and any explicitly triggered detector setup. Do not force a new system for a local page. Record output files and rendered checks; ask only when a choice changes the requested result. Do not install tools or use external design providers without their actual authorization.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| running system mode for a design-system proposal | `sections/system.md` |
| running variants mode for a comparison board | `sections/variants.md` |
| running html mode for production HTML and CSS | `sections/html.md` |
| the design detector probe explicitly prints DESIGN_DETECTOR_INSTALL_OFFER | `sections/detector-install-offer.md` |

> **STOP.** Before running system mode for a design-system proposal, Read `sections/system.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before running variants mode for a comparison board, Read `sections/variants.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before running html mode for production HTML and CSS, Read `sections/html.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before the design detector probe explicitly prints DESIGN_DETECTOR_INSTALL_OFFER, Read `sections/detector-install-offer.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
