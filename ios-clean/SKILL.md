---
name: ios-clean
preamble-tier: 2
version: 1.0.0
description: "Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. (gstack)"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Glob
  - Grep
  - AskUserQuestion
triggers:
  - clean the ios debug bridge
  - remove debugbridge
  - strip the gstack ios instrumentation
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Cleans up StateServer, DebugOverlay, accessor codegen output, and
app-side hooks installed by /ios-qa. This is a convenience wrapper —
the structural Release-build guard (Package.swift conditional + CI
swift build -c release check) is the safety-critical path.
Use when asked to "clean the iOS debug bridge", "remove DebugBridge",
or "strip the gstack iOS instrumentation".

Voice triggers (speech-to-text aliases): "clean the iOS debug bridge", "remove DebugBridge", "strip the gstack iOS instrumentation".

## Start /ios-clean

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "ios-clean" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /ios-clean steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /ios-clean

## Outcome
`/ios-clean` is finished only when this is true: Remove the DebugBridge SPM package and all #if DEBUG wiring from an iOS app. Cleans up StateServer, DebugOverlay, accessor codegen output, and app-side hooks installed by /ios-qa. This is a convenience wrapper — the structural Release-build guard (Package.swift conditional + CI swift build -c release check) is the safety-critical path. Use when asked to "clean the iOS debug bridge", "remove DebugBridge", or "strip the gstack iOS instrumentation". (gstack) Verify that outcome for `/ios-clean`, then stop.

## Constraints
Stay on the `/ios-clean` job. Do not expand `/ios-clean` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/ios-clean` says to hand off. Do not read `/ios-clean` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/ios-clean` when the outcome above is verified, or when `/ios-clean` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/ios-clean` or stop.

## Tool contract
Remove the DebugBridge package and the `#if DEBUG` wiring this repo added. Leave the app's own debug code in place.
