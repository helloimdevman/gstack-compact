---
name: land-and-deploy
preamble-tier: 4
version: 1.0.0
description: Land and deploy workflow. (gstack)
triggers:
  - merge and deploy
  - land the pr
  - ship to production
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Merges the PR, waits for CI and deploy,
verifies production health via canary checks. Takes over after /ship
creates the PR. Use when: "merge", "land", "deploy", "merge and verify",
"land it", "ship it to production".

## Start /land-and-deploy

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "land-and-deploy" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /land-and-deploy steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /land-and-deploy

## Outcome
`/land-and-deploy` is finished only when this is true: Land and deploy workflow. Merges the PR, waits for CI and deploy, verifies production health via canary checks. Takes over after /ship creates the PR. Use when: "merge", "land", "deploy", "merge and verify", "land it", "ship it to production". (gstack) Verify that outcome for `/land-and-deploy`, then stop.

## Constraints
Stay on the `/land-and-deploy` job. Do not expand `/land-and-deploy` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/land-and-deploy` says to hand off. Read a section only when its trigger below applies.

## Stop
Stop `/land-and-deploy` when the outcome above is verified, or when `/land-and-deploy` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/land-and-deploy` or stop.

## Tool contract
After `/ship` has a PR, merge it, watch CI and the deploy command from `setup-deploy`, and hit the production health URL. Stop when production matches the merge or the health check fails. A failed check, unknown target, or missing approval stops the merge.

## Carve routing

land-deploy-confirmed means a prior setup exists. If it does not, read first-run-validation and confirm the actual deployment configuration before continuing.

## Step 1: Pin the PR and local evidence

Accept an explicit PR number or detect the current branch's PR once. Check `gh auth status`. Resolve `REPO` with `gh repo view --json nameWithOwner`; query the selected PR, never an implicit current PR after this point:

```bash
PR_JSON=$(gh pr view "$PR_NUMBER" --repo "$REPO" --json number,state,title,url,mergeable,baseRefName,headRefName,headRefOid,baseRefOid) || exit 1
PR_HEAD=$(printf '%s' "$PR_JSON" | jq -er .headRefOid) || exit 1
HEAD_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .headRefName) || exit 1
BASE_BRANCH=$(printf '%s' "$PR_JSON" | jq -er .baseRefName) || exit 1
```

Only an OPEN PR continues. A query error or unknown state stops. Print the repository, PR number, head, base, and SHA. Bind the local tests and review to that exact head; do not switch, stash, or reset the user's work:

```bash
LOCAL_HEAD=$(git rev-parse HEAD) || exit 1
LOCAL_BRANCH=$(git branch --show-current) || exit 1
LOCAL_STATUS=$(git status --porcelain) || exit 1
if [ "$LOCAL_HEAD" != "$PR_HEAD" ] || [ "$LOCAL_BRANCH" != "$HEAD_BRANCH" ] || [ -n "$LOCAL_STATUS" ]; then
  echo "LOCAL_TARGET_MISMATCH"
  exit 1
fi
git fetch "https://github.com/$REPO.git" "$BASE_BRANCH" || exit 1
BASE_SHA=$(git rev-parse FETCH_HEAD) || exit 1
SCOPE_RESULT=$("$GSTACK_BIN/gstack-diff-scope" "$BASE_SHA") || exit 1
eval "$SCOPE_RESULT"
```

## Step 2: Required CI and readiness

Query `gh pr checks "$PR_NUMBER" --repo "$REPO" --required --json name,state,bucket,link`; use native `bucket` values. Auth/network/schema errors stop, never "no required checks". An empty successful response or the CLI's explicit no-required-checks response means none are configured. Failed/cancelled checks, conflicts, or an unknown `mergeable` state block. Wait for pending checks with a bounded deadline, then query again. Resolve VERSION drift on this pinned head; a changed head/base invalidates every approval. Read the readiness gate and obtain explicit merge approval for `REPO`, `PR_NUMBER`, `PR_HEAD`, and `BASE_BRANCH` only when there are no blockers.

## Step 3.4: VERSION drift detection
Compare VERSION on the branch with the base. Resolve drift, then complete Step 3.5 before merging.

## Step 6: Wait for deploy
Use the configured deployment status command or workflow and match its revision to `MERGE_SHA`; a reachable URL alone does not prove this revision is live. Poll with a bounded deadline. A failed or unknown deploy remains failed or unknown even if the old site answers. An explicit verification URL or observed deployment takes precedence over a docs-only skip.

## Step 7: Verify production

Use the host-provided browser on the configured production URL when available. Record the response, page content, critical console errors, and a screenshot. Missing browser access is SKIPPED, not healthy. Staging choice A returns to its production route; C goes to Step 9 without claiming production is verified. A failed canary remains DEGRADED if the user accepts it; it cannot be approved into a pass. Offer a rollback only as a separate explicit decision.

## Step 8: Rollback after approval

Explain that a revert is a new commit and does not restore production until its deploy and health are checked. Inspect `git show --no-patch --format='%H %P' "$MERGE_SHA"` and require a clean base checkout. For a two-parent merge with parent 1 verified as the base side, run `git revert -m 1 "$MERGE_SHA" --no-edit`; for a confirmed squash, revert its one landed commit. For a rebase, establish the exact landed commit range and revert newest first. If method, range, worktree, or parentage is unknown, stop with ROLLBACK PENDING. Never guess, reset, force-push, or replay a merge. After a successful revert push, set `ROLLBACK=true`, `TARGET=production`, `DEPLOY_SHA=REVERT_SHA`, and reset production deployment/health evidence before returning to Steps 6-7.

## Step 9: Evidence-based verdict

Report the pinned PR and head, merge SHA, required CI, deploy revision, production and staging health, missing evidence, and next action. Only a confirmed matching deployment and healthy production is DEPLOYED AND VERIFIED. A confirmed no-deploy route is MERGED — NO DEPLOY NEEDED. Failed health is DEGRADED; a merge with missing deploy or health evidence is MERGED (UNVERIFIED). An unfinished rollback is ROLLBACK PENDING. Do not mark a failed canary healthy or infer a successful deploy from HTTP reachability.

## Section index — Read each section when its situation applies

This skill is a decision-tree skeleton. The steps below point to on-demand
sections relative to this SKILL.md. Read one in full when its trigger applies.

| When | Read this section |
|------|-------------------|
| running the first-run dry-run validation — Step 1.5's check returned FIRST_RUN or CONFIG_CHANGED (skip on CONFIRMED) | `sections/first-run-validation.md` |
| the pre-merge readiness gate (Step 3.5) — the last check before the irreversible merge | `sections/readiness-gate.md` |
| merging the PR and detecting the deploy strategy (Steps 4-5) | `sections/merge-and-deploy.md` |
> **STOP.** Before running the first-run dry-run validation — Step 1.5's check returned FIRST_RUN or CONFIG_CHANGED (skip on CONFIRMED), Read `sections/first-run-validation.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before the pre-merge readiness gate (Step 3.5) — the last check before the irreversible merge, Read `sections/readiness-gate.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
> **STOP.** Before merging the PR and detecting the deploy strategy (Steps 4-5), Read `sections/merge-and-deploy.md` relative to this SKILL.md
> and execute it in full. That section is the source for this step.
