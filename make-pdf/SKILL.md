---
name: make-pdf
preamble-tier: 1
version: 1.0.0
description: Turn Markdown into print-ready HTML, then export a PDF through the user's host-provided browser when its tools support PDF printing. (gstack)
triggers:
  - markdown to pdf
  - generate pdf
  - make pdf
  - export pdf
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Voice triggers (speech-to-text aliases): "make this a pdf", "make it a pdf", "export to pdf", "turn this into a pdf", "turn this markdown into a pdf", "generate a pdf", "make a pdf from", "pdf this markdown".

## Start /make-pdf

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "make-pdf" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /make-pdf steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /make-pdf

## Outcome
`/make-pdf` is finished when the requested PDF exists and has been checked. If the user's browser tool cannot export PDF, retain the print-ready HTML and report PDF export unavailable.

## Constraints
Stay on the `/make-pdf` job. Do not expand `/make-pdf` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/make-pdf` says to hand off. Do not read `/make-pdf` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/make-pdf` when the outcome above is verified, or when `/make-pdf` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/make-pdf` or stop.

## Tool contract
Read the installed `/browse` skill. Run `bun run "$P" <input.md> <new-output.html>` to prepare print HTML with a cover and table of contents. Open that HTML in the user's host-provided browser and use its documented print/PDF export capability. Verify the output starts with `%PDF` and inspect the result. Do not launch another browser, use a separate profile, or treat a screenshot as a PDF. The HTML blocks scripts and remote resources through its Content Security Policy.
