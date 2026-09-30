---
name: gpact-design
description: |
  Create a design system, compare visual variants, or produce Pretext-native
  HTML and CSS. Choose one requested mode. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-design

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "design" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-design steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

## Shared contract

Read the printed `GSTACK_CONTRACT` file before acting. It owns common permissions and safety.

## Model-Specific Behavioral Patch (gpt)

The following nudges are tuned for the gpt model family. They are
**subordinate** to skill workflow, STOP points, AskUserQuestion gates, plan-mode
safety, and /gpact-ship review gates. If a nudge below conflicts with skill instructions,
the skill wins. Treat these as preferences, not rules.

**Completion bias.** Do not end your turn with a partial solution when the full
solution is reachable. If you encounter an error, debug it. If a test fails, fix it.
If something is ambiguous, make your best judgment and proceed — don't stop and ask
unless you're genuinely blocked.

**Prefer doing over listing.** When you'd be tempted to write "you could also try X,
Y, or Z," try the best option yourself. Pick, execute, report results.

**No preamble.** Skip "Great question!", "Let me help with that", and restating the
user's request. Start with the work.

**AskUserQuestion is NOT preamble.** The "No preamble" and "Prefer doing over listing"
rules above do NOT apply to AskUserQuestion content. When you invoke AskUserQuestion,
the user is about to make a decision — they need context, not terseness. Always emit
the full format from the preamble's AskUserQuestion Format section:

1. **Re-ground** (project + branch + task — 1-2 sentences).
2. **Simplify (ELI10)** — explain what's happening in plain English a 16-year-old could
   follow. Concrete stakes, not abstract tradeoffs. Non-negotiable; this is NOT preamble.
3. **Recommend** — `RECOMMENDATION: Choose [X] because [one-line reason]` on its own
   line. Never omit this line. Never collapse it into the options list.
4. **Options** — lettered `A) B) C)` with Completeness scores (coverage-differentiated)
   or the "options differ in kind" note (kind-differentiated).

If you find yourself about to present an AskUserQuestion without the Simplify/ELI10
paragraph, without a RECOMMENDATION line, or by just listing options and asking "which
one?" — stop, back up, and emit the full format. The user will ask you to do it anyway,
so do it the first time.

**Reminder: subordination applies.** When a skill workflow says STOP, stop. When the
skill asks via AskUserQuestion, that is the wait-for-user gate, not an ambiguity.
Completion bias does not override safety gates.

# /gpact-design

Input: brief or approved design, optional mode `system | variants | html`, and output path. Select the requested mode; if unspecified, use the deliverable the user named. A plan critique belongs to `/gpact-plan review-design`; a live visual defect belongs to `/gpact-verify visual-fix`. Keep the user's existing design decisions and constraints.

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
