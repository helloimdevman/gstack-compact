---
name: ios-sync
preamble-tier: 2
version: 1.0.0
description: Regenerate the iOS debug bridge against the latest upstream gstack templates. (gstack)
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
triggers:
  - resync the ios debug bridge
  - regenerate ios accessors
  - update the gstack ios instrumentation
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Updates StateServer.swift, DebugOverlay.swift, Package.swift,
and the typed @Observable state accessors. Use after you upgrade gstack
or add new ViewModels/properties that need accessor coverage.
Use when asked to "resync the iOS debug bridge", "regenerate iOS
accessors", or "update the gstack iOS instrumentation".

Voice triggers (speech-to-text aliases): "resync the iOS debug bridge", "regenerate iOS accessors", "update the gstack iOS instrumentation".

## Start /ios-sync

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "ios-sync" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /ios-sync steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /ios-sync

## Outcome
`/ios-sync` is finished only when this is true: Regenerate the iOS debug bridge against the latest upstream gstack templates. Updates StateServer.swift, DebugOverlay.swift, Package.swift, and the typed @Observable state accessors. Use after you upgrade gstack or add new ViewModels/properties that need accessor coverage. Use when asked to "resync the iOS debug bridge", "regenerate iOS accessors", or "update the gstack iOS instrumentation". (gstack) Verify that outcome for `/ios-sync`, then stop.

## Constraints
Stay on the `/ios-sync` job. Do not expand `/ios-sync` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/ios-sync` says to hand off. Do not read `/ios-sync` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/ios-sync` when the outcome above is verified, or when `/ios-sync` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/ios-sync` or stop.

## Tool contract
Regenerate DebugBridge accessors after an upgrade or after new view-model properties land. Do not hand-edit generated accessors.
