---
name: gpact
preamble-tier: 1
version: 1.2.0
description: Router for the gpact skill suite. (gpact)
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
triggers:
  - gpact
  - which gpact skill
  - route this with gpact

---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Sends any gstack request to the right skill
(planning, review, QA, shipping, debugging, docs, design). For browser/QA
and dogfooding it points you at /gpact-browse. Use when you invoke gstack without a specific
skill, or ask "which gstack skill fits this?".

## Start /gpact

```bash
_G="${CLAUDE_PLUGIN_ROOT}"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "gstack" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gpact

## Route first

When the map matches, open its installed canonical `skill` and pass any `mode`. A bug report routes to `/gpact-investigate`. A page routes to `/gpact-browse` when the host supplies the user's browser.

## Outcome
Route the request to one installed skill. A job that has a route is not answered inline.

## Constraints
Follow the route map below. Every public command still performs its job. Explicit provider requests are outside this router.

## Stop
Stop when the target file is open and the chosen skill or workflow is the one being followed. Do not launch a second skill from the router.

## Tool contract
Use the embedded map, whose command values are logical `{skill, mode}` routes. For a logical skill ID, read its installed sibling `../gpact-<id>/SKILL.md` and pass the mode and user constraints. The logical ID `gstack` refers to this router itself. `unavailableCommands` and `unavailableJobs` name missing specialists; report them unavailable and give `./setup --host <host> --skill-profile compat` as the installation route. Do not silently substitute a general skill. `/gpact-autoplan` ends after planning; `/gpact-sprint` runs the implementation workflow.

```bash
"${CLAUDE_PLUGIN_ROOT}"/bin/gstack-telemetry-log '{"skill":"gstack","event":"route"}' 2>/dev/null || true
```

```json
{
  "version": 2,
  "core": [
    "plan",
    "build",
    "review",
    "verify",
    "ship",
    "investigate",
    "design",
    "context",
    "gstack",
    "browse",
    "sprint"
  ],
  "modes": {
    "plan": [
      "frame",
      "review-product",
      "review-design",
      "review-dx",
      "review-engineering",
      "review-all",
      "spec"
    ],
    "review": [
      "report",
      "fix",
      "shared-libs"
    ],
    "verify": [
      "browser-fix",
      "browser-report",
      "visual-fix",
      "developer-flow",
      "health"
    ],
    "ship": [
      "prepare",
      "publish"
    ],
    "design": [
      "system",
      "variants",
      "html"
    ],
    "context": [
      "save",
      "restore",
      "learn"
    ]
  },
  "jobs": {
    "product-framing": "/gpact-plan",
    "ceo-scope-challenge": "/gpact-plan",
    "engineering-plan": "/gpact-plan",
    "design-critique": "/gpact-plan",
    "code-review": "/gpact-review",
    "browser-qa": "/gpact-verify",
    "ship": "/gpact-ship",
    "investigate": "/gpact-investigate",
    "sprint": "/gpact-sprint"
  },
  "commands": {
    "/gpact-browse": {
      "skill": "browse"
    },
    "/gpact-build": {
      "skill": "build"
    },
    "/gpact-context": {
      "skill": "context"
    },
    "/gpact-design": {
      "skill": "design"
    },
    "/gpact": {
      "skill": "gstack"
    },
    "/gpact-investigate": {
      "skill": "investigate"
    },
    "/gpact-plan": {
      "skill": "plan"
    },
    "/gpact-review": {
      "skill": "review"
    },
    "/gpact-ship": {
      "skill": "ship"
    },
    "/gpact-sprint": {
      "skill": "sprint"
    },
    "/gpact-verify": {
      "skill": "verify"
    }
  },
  "unavailableCommands": [
    "/gpact-autoplan",
    "/gpact-benchmark",
    "/gpact-canary",
    "/gpact-careful",
    "/gpact-context-restore",
    "/gpact-context-save",
    "/gpact-design-consultation",
    "/gpact-design-html",
    "/gpact-design-review",
    "/gpact-design-shotgun",
    "/gpact-deslop-shared-libs",
    "/gpact-devex-review",
    "/gpact-diagram",
    "/gpact-document-generate",
    "/gpact-document-release",
    "/gpact-freeze",
    "/gpact-upgrade",
    "/gpact-guard",
    "/gpact-health",
    "/gpact-ios-clean",
    "/gpact-ios-design-review",
    "/gpact-ios-fix",
    "/gpact-ios-qa",
    "/gpact-ios-sync",
    "/gpact-land-and-deploy",
    "/gpact-landing-report",
    "/gpact-learn",
    "/gpact-make-pdf",
    "/gpact-office-hours",
    "/gpact-plan-ceo-review",
    "/gpact-plan-design-review",
    "/gpact-plan-devex-review",
    "/gpact-plan-eng-review",
    "/gpact-plan-tune",
    "/gpact-qa",
    "/gpact-qa-only",
    "/gpact-retro",
    "/gpact-scrape",
    "/gpact-setup-deploy",
    "/gpact-spec",
    "/gpact-unfreeze"
  ],
  "unavailableJobs": {
    "retro": "/gpact-retro"
  }
}
```
