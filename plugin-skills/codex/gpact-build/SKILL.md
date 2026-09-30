---
name: gpact-build
description: |
  Implement an approved change, including focused regression checks and a
  reviewable diff. Start directly when the task is already clear. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-build

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "build" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-build steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-build

Input: the user's implementation request or plan path and its acceptance conditions. A small, clear change needs only a brief scope check; do not require a product interview or architecture redesign. Use the user's existing authorization and project rules.

1. Inspect the relevant code, callers, inputs, outputs, and current behavior. For a bug, preserve the original failure and establish its cause before editing.
2. Reuse an existing helper, standard library, or platform feature where it covers the job. Make the smallest change that meets the acceptance conditions. Keep adjacent findings separate unless authorized.
3. For nontrivial logic or a security/data boundary, leave a focused check that fails on the original defect. For a CLI change, exercise valid input, an invalid argument, exit status, stderr, and file effects. Do not start a browser for a non-web change.
4. Run affected tests and required project checks. Classify a failure as product, test, detector, or environment before changing the code or the test. Recheck after any fix.
5. Inspect the final diff and report the implemented behavior, checks with outcomes, and remaining limitations. Finish when the requested implementation is verified. Continue to review, PR, or deployment only when the user or a selected workflow requested it.

If a missing product decision changes the result or a protected action lacks authority, ask only that decision with a recommendation and keep independent work moving. Do not mark an unrun check as passed.
