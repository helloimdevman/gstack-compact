---
name: gpact-review
description: |
  Review a current diff for supported defects and release blockers. Report by
  default; fix only when authorized. Shared-library mode is advice only. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-review

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "review" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-review steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-review

## Outcome

Supported findings and current review evidence for the requested diff.

Input: current diff, base ref, optional plan, and `report | fix | shared-libs` mode. Default to report. Read-only stays read-only; shared-libs gives advice only. Do not delegate or invoke an external model in this project.

1. Resolve worktree, branch, full base commit, and scope, including staged, unstaged, and untracked source. Inspect callers. Set `GSTACK_REVIEW_BASE_COMMIT` and capture a `gstack-review-log --start review` token before reading the diff.
2. Read the diff and surrounding code. Compare behavior with the request and plan, run meaningful tests, and examine changed data, auth, injection, trust, error, concurrency, and compatibility boundaries. Read applicable sections below.
3. Report findings by severity with path, line, trigger, consequence, and evidence. Separate defects, uncertain risks, and suggestions. A clean result names the checked changes and evidence; never invent a finding.
4. In fix mode, repair only authorized defects and rerun focused checks and review. A code edit invalidates the start token. Preserve failures and blockers.
5. Finish `gstack-review-log` with the token and actual `completed`, `converged`, `status`, and issue counts. Mark `clean` only after a full pass with no unresolved findings and unchanged content. Return findings and gate status.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| checking accepted plan items against the diff | `sections/plan-completion.md` |
| reviewing changed auth, data, money, security, or UI boundaries | `sections/risk.md` |
| running shared-libs mode or considering a supported extraction | `sections/shared-libs.md` |

> **STOP.** Before checking accepted plan items against the diff, Read `sections/plan-completion.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before reviewing changed auth, data, money, security, or UI boundaries, Read `sections/risk.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before running shared-libs mode or considering a supported extraction, Read `sections/shared-libs.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
