---
name: gpact-plan
description: |
  Frame a product idea, plan implementation, review an existing plan, or write
  an executable spec. Choose only the perspectives the request needs. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-plan

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "plan" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-plan steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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
