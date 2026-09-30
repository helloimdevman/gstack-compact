---
name: gpact-verify
description: |
  Verify the changed interface with executable evidence. Report by default;
  fix only in an authorized fix mode. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-verify

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "verify" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-verify steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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
