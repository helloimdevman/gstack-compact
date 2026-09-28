---
name: gstack
preamble-tier: 1
version: 1.2.0
description: Router for the gstack skill suite. (gstack)
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
triggers:
  - gstack
  - which gstack skill
  - route this with gstack

---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Sends any gstack request to the right skill
(planning, review, QA, shipping, debugging, docs, design). For browser/QA
and dogfooding it points you at /browse. Use when you invoke gstack without a specific
skill, or ask "which gstack skill fits this?".

## Start /gstack

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "gstack" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gstack steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gstack

## Route first

When the map matches, open its installed canonical `skill` and pass any `mode`. A bug report routes to `/investigate`. A page routes to `/browse` when the host supplies the user's browser.

## Outcome
Route the request to one installed skill. A job that has a route is not answered inline.

## Constraints
Follow the route map below. Every public command still performs its job. Explicit provider requests are outside this router.

## Stop
Stop when the target file is open and the chosen skill or workflow is the one being followed. Do not launch a second skill from the router.

## Tool contract
Use the embedded map, whose command values are logical `{skill, mode}` routes. Open the installed skill entry for that ID and pass the mode and user constraints. `unavailableCommands` and `unavailableJobs` name missing specialists; report them unavailable and give `./setup --host <host> --skill-profile compat` as the installation route. Do not silently substitute a general skill. `/autoplan` ends after planning; `/sprint` runs the implementation workflow.

```bash
~/.claude/skills/gstack/bin/gstack-telemetry-log '{"skill":"gstack","event":"route"}' 2>/dev/null || true
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
    "product-framing": "/plan",
    "ceo-scope-challenge": "/plan",
    "engineering-plan": "/plan",
    "design-critique": "/plan",
    "code-review": "/review",
    "browser-qa": "/verify",
    "ship": "/ship",
    "investigate": "/investigate",
    "retro": "/retro",
    "sprint": "/sprint"
  },
  "commands": {
    "/autoplan": {
      "skill": "plan",
      "mode": "review-all"
    },
    "/benchmark": {
      "skill": "benchmark"
    },
    "/browse": {
      "skill": "browse"
    },
    "/build": {
      "skill": "build"
    },
    "/canary": {
      "skill": "canary"
    },
    "/careful": {
      "skill": "careful"
    },
    "/context": {
      "skill": "context"
    },
    "/context-restore": {
      "skill": "context",
      "mode": "restore"
    },
    "/context-save": {
      "skill": "context",
      "mode": "save"
    },
    "/design": {
      "skill": "design"
    },
    "/design-consultation": {
      "skill": "design",
      "mode": "system"
    },
    "/design-html": {
      "skill": "design",
      "mode": "html"
    },
    "/design-review": {
      "skill": "verify",
      "mode": "visual-fix"
    },
    "/design-shotgun": {
      "skill": "design",
      "mode": "variants"
    },
    "/deslop-shared-libs": {
      "skill": "review",
      "mode": "shared-libs"
    },
    "/devex-review": {
      "skill": "verify",
      "mode": "developer-flow"
    },
    "/diagram": {
      "skill": "diagram"
    },
    "/document-generate": {
      "skill": "document-generate"
    },
    "/document-release": {
      "skill": "document-release"
    },
    "/freeze": {
      "skill": "freeze"
    },
    "/gstack": {
      "skill": "gstack"
    },
    "/gstack-upgrade": {
      "skill": "gstack-upgrade"
    },
    "/guard": {
      "skill": "guard"
    },
    "/health": {
      "skill": "verify",
      "mode": "health"
    },
    "/investigate": {
      "skill": "investigate"
    },
    "/ios-clean": {
      "skill": "ios-clean"
    },
    "/ios-design-review": {
      "skill": "ios-design-review"
    },
    "/ios-fix": {
      "skill": "ios-fix"
    },
    "/ios-qa": {
      "skill": "ios-qa"
    },
    "/ios-sync": {
      "skill": "ios-sync"
    },
    "/land-and-deploy": {
      "skill": "land-and-deploy"
    },
    "/landing-report": {
      "skill": "landing-report"
    },
    "/learn": {
      "skill": "context",
      "mode": "learn"
    },
    "/make-pdf": {
      "skill": "make-pdf"
    },
    "/office-hours": {
      "skill": "plan",
      "mode": "frame"
    },
    "/plan": {
      "skill": "plan"
    },
    "/plan-ceo-review": {
      "skill": "plan",
      "mode": "review-product"
    },
    "/plan-design-review": {
      "skill": "plan",
      "mode": "review-design"
    },
    "/plan-devex-review": {
      "skill": "plan",
      "mode": "review-dx"
    },
    "/plan-eng-review": {
      "skill": "plan",
      "mode": "review-engineering"
    },
    "/plan-tune": {
      "skill": "plan-tune"
    },
    "/qa": {
      "skill": "verify",
      "mode": "browser-fix"
    },
    "/qa-only": {
      "skill": "verify",
      "mode": "browser-report"
    },
    "/retro": {
      "skill": "retro"
    },
    "/review": {
      "skill": "review"
    },
    "/scrape": {
      "skill": "scrape"
    },
    "/setup-deploy": {
      "skill": "setup-deploy"
    },
    "/ship": {
      "skill": "ship"
    },
    "/spec": {
      "skill": "plan",
      "mode": "spec"
    },
    "/sprint": {
      "skill": "sprint"
    },
    "/unfreeze": {
      "skill": "unfreeze"
    },
    "/verify": {
      "skill": "verify"
    }
  }
}
```
