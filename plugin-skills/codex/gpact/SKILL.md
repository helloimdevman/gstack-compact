---
name: gpact
description: |
  Router for the gpact skill suite. Sends any gpact request to the right skill
  (planning, review, QA, shipping, debugging, docs, design). For browser/QA
  and dogfooding it points you at /gpact-browse. Use when you invoke gpact without a specific
  skill, or ask "which gpact skill fits this?". (gpact)
---

The plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

## Start /gpact

```bash
_G="$GSTACK_ROOT"
"$_G/bin/gpact-plugin-init" || exit 1
"$_G/bin/gstack-skill-start" --skill "gstack" --model "gpt" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gpact steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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
$GSTACK_ROOT/bin/gstack-telemetry-log '{"skill":"gstack","event":"route"}' 2>/dev/null || true
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
