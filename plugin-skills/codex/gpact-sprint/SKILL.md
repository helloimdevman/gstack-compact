---
name: gpact-sprint
description: |
  Carry one authorized task from scope through plan, implementation, verification,
  review, and optionally a pull request. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-sprint

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "sprint" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-sprint steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-sprint

Input: the task and `stop_after=verified | pr` (default `pr`). Work sequentially in this session. Do not delegate to agents or assume that starting a skill proves its outcome. Keep one `task.md` for the work; update it after each completed stage. Use the path the user named, otherwise use `GSTACK_STATE_ROOT/projects/<slug>/tasks/<uuid>/task.md` from the installed `gstack-paths` and `gstack-slug` tools. Generate one UUID at intake, then reuse it. Record task ID, repository, worktree, branch, base ref and commit, stop_after, status, request, authorization, plan, implementation, verification, review, publication, and next action. Large logs belong beside it, linked from the document. Keep private state out of Git unless the user requested it.

## 0. Scope
Read the request, project rules, and Git state. Record acceptance conditions, permitted file and external effects, and the intended endpoint. Ask only a missing product or authorization decision that changes the outcome. `stop_after=verified` authorizes no PR action.

## 1. Plan
Use `/gpact-plan` only to the depth the task needs. A small, clear change can use short acceptance conditions. Write the chosen approach and checks in the same task document. Do not turn `/gpact-autoplan` into implementation.

## 2. Build
Use `/gpact-build` to implement and verify the changed behavior locally. Record the diff and focused checks. A plan without a working diff does not complete this stage.

## 3. Prepare
For a PR endpoint, use `/gpact-ship prepare` to finish required release metadata, generated files, and build before final gates. For `stop_after=verified`, prepare only files needed to test the local result; skip PR-only VERSION and CHANGELOG work. If preparation changes code, later checks must use the changed candidate.

## 4. Verify
Use `/gpact-verify` on the candidate. Select checks by changed interface: CLI commands for a CLI, public calls for an API, real flows for a web UI, documentation commands and links for docs. Record pass, fail, skipped, `unavailable` for a needed tool that cannot run, and `not_applicable` when the interface does not exist. A non-web task does not require browser QA. A failed required check blocks progression until repaired or explicitly excepted.

## 5. Review
Use `/gpact-review` on the current diff and base. Record findings, scope, review evidence, and any unresolved blocker. A code fix returns to the affected build, verification, and review steps; it does not restart unaffected planning. Verify that the candidate is unchanged since the evidence was collected.

## 6. Publish
For `stop_after=verified`, record status `verified` and stop before PR metadata or publication. For `stop_after=pr`, use `/gpact-ship publish` only after current tests and review pass (or a user-authorized exception to identified failures). Confirm the PR URL before recording status `shipped`. A failed publication leaves the task unshipped. Merge and deployment require separate authorization.
