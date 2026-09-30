---
name: gpact-sprint
version: 1.0.0
description: |
  Carry one authorized task from scope through plan, implementation, verification,
  review, and optionally a pull request. (gstack)
preamble-tier: 2
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
  - Write
  - Edit
  - AskUserQuestion
triggers:
  - sprint this
  - take this through pr
  - plan build verify and ship
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact-sprint

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "sprint" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-sprint steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

## Shared contract

Read the printed `GSTACK_CONTRACT` file before acting. It owns common permissions and safety.

## Model-Specific Behavioral Patch (claude)

The following nudges are tuned for the claude model family. They are
**subordinate** to skill workflow, STOP points, AskUserQuestion gates, plan-mode
safety, and /gpact-ship review gates. If a nudge below conflicts with skill instructions,
the skill wins. Treat these as preferences, not rules.

**Todo-list discipline.** When working through a multi-step plan, mark each task
complete individually as you finish it. Do not batch-complete at the end. If a task
turns out to be unnecessary, mark it skipped with a one-line reason.

**Think before heavy actions.** For complex operations (refactors, migrations,
non-trivial new features), briefly state your approach before executing. This lets
the user course-correct cheaply instead of mid-flight.

**Dedicated tools over Bash.** Prefer Read, Edit, Write, Glob, Grep over shell
equivalents (cat, sed, find, grep). The dedicated tools are cheaper and clearer.

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
