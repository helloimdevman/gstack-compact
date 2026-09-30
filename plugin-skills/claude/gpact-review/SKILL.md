---
name: gpact-review
version: 1.0.0
description: Review a current diff for supported defects and release blockers. (gstack)
preamble-tier: 2
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Grep
  - Glob
  - AskUserQuestion
triggers:
  - review this pr
  - code review
  - check my diff
  - pre-landing review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Report by
default; fix only when authorized. Shared-library mode is advice only.

## Start /gpact-review

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "review" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact-review steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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
