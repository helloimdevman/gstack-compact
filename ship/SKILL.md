---
name: ship
version: 1.0.0
description: Prepare a release candidate, verify and review that candidate, then create or update its PR when authorized. (gstack)
preamble-tier: 2
triggers:
  - ship it
  - create a pr
  - prepare a release
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Merge and deployment are separate.

## Start /ship

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "ship" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /ship steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /ship

## Outcome

Verified PR URL or Apple release outcome, backed by current checks.

Input: worktree, base branch, `prepare | publish`; direct `/ship` runs both. Honor publication authority; do not dispatch an agent or external model. For App Store/TestFlight, read `sections/apple-release.md` first. Store distribution proceeds through that adapter; the branch gate and repository-landing pipeline below apply ONLY to repository-landing asks. A repository-landing ship opens a PR, never merges or deploys.

## 1. Prepare

Resolve branch, base commit, remote, worktree, and PR target. If on the base branch or the repo's default branch, **abort**: "You're on the base branch. Ship from a feature branch." Ask once for an unknown distribution target; never invent a registry or credentials. Inspect staged, unstaged, and untracked files. Fetch the base when available; a changed base invalidates prior reviews. Complete VERSION, CHANGELOG, docs, generation, and build before final tests. Read the version section for a bump; an existing bump gives no permission to rebump. Update docs here, preserving user files; do not dispatch `/document-release` as a subagent. Read changelog when needed. `/ship prepare` returns candidate and remaining gates without push or PR.

## 2. Verify

Freeze candidate inputs; run required tests, build, generated-content freshness and credential scan. Read the tests section for command discovery and failure handling. Reuse a result only when its exact command, cwd, source inputs, lockfile, runtime, environment, and completed exit status match this candidate; otherwise run it. A passing subset is not release acceptance. Record pass/fail/skip/unavailable counts and logs. Code or release-file edits return to affected checks.

## 3. Review

Run `/review` on the final diff against the recorded base commit, including untracked source. Before reading the diff, set `GSTACK_REVIEW_BASE_COMMIT` to that commit and capture a real `gstack-review-log --start review` token; finish the actual pass with its result. Reuse a review only when `reviewFreshness(rec, currentWtree, { baseCommit, repo, branch }).status === 'CURRENT'` and its diff scope matches this candidate. A dashboard CLEAR, telemetry success string, or review from another worktree is insufficient. Fix authorized findings in this invocation, return to affected tests, and start a fresh review; stop after three unsuccessful fix cycles and report the blocker. Do not ask the user to restart `/ship` for a fix you can make here. Unresolved blockers or missing required evidence stop publication unless the user explicitly grants an exception for identified failures.

## 4. Publish

`/ship publish` performs the same verification and review freshness checks even if prepare ran earlier. Confirm the recorded base commit, branch, candidate fingerprint, and user authority immediately before publication. If anything changed, refresh the affected gates first. Commit only the reviewed candidate, push without force, and create or update the PR with the current title, diff summary, checks, risks, and explicit exceptions. Read the PR-body section for the existing GitHub tooling and redaction rules. A PR body-only edit refreshes body accuracy and secret scanning; it does not rerun unchanged code tests. Confirm the PR URL before marking a sprint task `shipped`. If push or PR creation fails, retain the candidate and report the failure. Do not merge or deploy from this skill.

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
