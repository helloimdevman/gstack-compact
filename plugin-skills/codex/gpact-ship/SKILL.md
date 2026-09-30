---
name: gpact-ship
description: |
  Prepare a release candidate, verify and review that candidate, then create
  or update its PR when authorized. Merge and deployment are separate. (gstack)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-ship

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "ship" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-ship steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact-ship

## Outcome

Verified PR URL or Apple release outcome, backed by current checks.

Input: worktree, base branch, `prepare | publish`; direct `/gpact-ship` runs both. Honor publication authority; do not dispatch an agent or external model. For App Store/TestFlight, read `sections/apple-release.md` first. Store distribution proceeds through that adapter; the branch gate and repository-landing pipeline below apply ONLY to repository-landing asks. A repository-landing ship opens a PR, never merges or deploys.

## 1. Prepare

Resolve branch, base commit, remote, worktree, and PR target. If on the base branch or the repo's default branch, **abort**: "You're on the base branch. Ship from a feature branch." Ask once for an unknown distribution target; never invent a registry or credentials. Inspect staged, unstaged, and untracked files. Fetch the base when available; a changed base invalidates prior reviews. Complete VERSION, CHANGELOG, docs, generation, and build before final tests. Read the version section for a bump; an existing bump gives no permission to rebump. Update docs here, preserving user files; do not dispatch `/gpact-document-release` as a subagent. Read changelog when needed. `/gpact-ship prepare` returns candidate and remaining gates without push or PR.

## 2. Verify

Freeze candidate inputs; run required tests, build, generated-content freshness and credential scan. Read the tests section for command discovery and failure handling. Reuse a result only when its exact command, cwd, source inputs, lockfile, runtime, environment, and completed exit status match this candidate; otherwise run it. A passing subset is not release acceptance. Record pass/fail/skip/unavailable counts and logs. Code or release-file edits return to affected checks.

## 3. Review

Run `/gpact-review` on the final diff against the recorded base commit, including untracked source. Before reading the diff, set `GSTACK_REVIEW_BASE_COMMIT` to that commit and capture a real `gstack-review-log --start review` token; finish the actual pass with its result. Reuse a review only when `reviewFreshness(rec, currentWtree, { baseCommit, repo, branch }).status === 'CURRENT'` and its diff scope matches this candidate. A dashboard CLEAR, telemetry success string, or review from another worktree is insufficient. Fix authorized findings in this invocation, return to affected tests, and start a fresh review; stop after three unsuccessful fix cycles and report the blocker. Do not ask the user to restart `/gpact-ship` for a fix you can make here. Unresolved blockers or missing required evidence stop publication unless the user explicitly grants an exception for identified failures.

## 4. Publish

`/gpact-ship publish` performs the same verification and review freshness checks even if prepare ran earlier. Confirm the recorded base commit, branch, candidate fingerprint, and user authority immediately before publication. If anything changed, refresh the affected gates first. Commit only the reviewed candidate, push without force, and create or update the PR with the current title, diff summary, checks, risks, and explicit exceptions. Read the PR-body section for the existing GitHub tooling and redaction rules. A PR body-only edit refreshes body accuracy and secret scanning; it does not rerun unchanged code tests. Confirm the PR URL before marking a sprint task `shipped`. If push or PR creation fails, retain the candidate and report the failure. Do not merge or deploy from this skill.

Read Greptile only for existing PR comments. Read third-party before an authorized web action. A blocked protected action stays incomplete.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| shipping an App Store or TestFlight app | `sections/apple-release.md` |
| selecting and running release checks | `sections/tests.md` |
| a versioned release candidate needs a bump or version drift repair | `sections/version.md` |
| writing a required release entry | `sections/changelog.md` |
| creating or updating an authorized PR | `sections/pr-body.md` |
| triaging Greptile comments on an existing PR | `sections/greptile.md` |
| performing an authorized third-party website action | `sections/third-party.md` |

> **STOP.** Before shipping an App Store or TestFlight app, Read `sections/apple-release.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before selecting and running release checks, Read `sections/tests.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before a versioned release candidate needs a bump or version drift repair, Read `sections/version.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before writing a required release entry, Read `sections/changelog.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before creating or updating an authorized PR, Read `sections/pr-body.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before triaging Greptile comments on an existing PR, Read `sections/greptile.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before performing an authorized third-party website action, Read `sections/third-party.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
