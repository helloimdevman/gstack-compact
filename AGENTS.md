# gstack — AI Engineering Workflow

gstack is a collection of SKILL.md files that give AI agents structured roles for
software development. Each skill is a specialist: CEO reviewer, eng manager,
designer, QA lead, release engineer, debugger, and more.

## Available skills

Skills live in `.agents/skills/` (or the Claude Code skill directory).
New Claude/Codex installs register the 11 core commands below. The specialist
commands in the later tables require `./setup --skill-profile compat`.

| Core command | Result |
|--------------|--------|
| `/plan` | Frame, write, or review a plan or spec. |
| `/build` | Implement an authorized change. |
| `/review` | Review the current diff; report by default. |
| `/verify` | Check code, CLI, or UI behavior; report by default. |
| `/ship` | Prepare, verify, review, and publish an authorized PR. |
| `/investigate` | Reproduce and repair a defect within scope. |
| `/design` | Create a design system, variants, or HTML. |
| `/context` | Save, restore, or manage learnings. |
| `/gstack` | Route to an installed skill. |
| `/browse` | Drive the available browser. |
| `/sprint` | Carry one task from plan through authorized PR publication. |

### Plan-mode reviews

| Skill | What it does |
|-------|-------------|
| `/office-hours` | Start here. Reframes your product idea before you write code. |
| `/plan-ceo-review` | CEO-level review: find the 10-star product in the request. |
| `/plan-eng-review` | Lock architecture, data flow, edge cases, and tests. |
| `/plan-design-review` | Rate each design dimension 0-10, explain what a 10 looks like. |
| `/plan-devex-review` | DX-mode review: TTHW, magical moments, friction points, persona traces. |
| `/plan-tune` | Self-tune AskUserQuestion sensitivity per question. |
| `/autoplan` | Compatibility alias for `/plan` review-all; applicable perspectives only, engineering last, then stop. |
| `/design-consultation` | Build a complete design system from scratch. |
| `/spec` | Compatibility alias for `/plan` spec; files an issue only when the user requested it. |

### Implementation + review

| Skill | What it does |
|-------|-------------|
| `/review` | Pre-landing PR review. Finds bugs that pass CI but break in prod. |
| `/deslop-shared-libs` | Find worthwhile shared-code extractions in recent work. Recommendations only. |
| `/investigate` | Systematic root-cause debugging. No fixes without investigation. |
| `/design-review` | Live-site visual audit + fix loop with atomic commits. |
| `/design-shotgun` | Generate multiple AI design variants, comparison board, iterate. |
| `/design-html` | Generate production-quality Pretext-native HTML/CSS. |
| `/devex-review` | Live developer experience audit (TTHW measured against the real flow). |
| `/qa` | Open a real browser, find bugs, fix them, re-verify. |
| `/qa-only` | Same methodology as /qa but report only — no code changes. |
| `/scrape` | Pull data from a web page in the browser supplied by the user's agent host. Read-only. |

### Release + deploy

| Skill | What it does |
|-------|-------------|
| `/ship` | Run tests, review, push, open PR. Workspace-aware version queue. |
| `/land-and-deploy` | Merge the PR, wait for CI and deploy, verify production health. |
| `/canary` | Post-deploy monitoring loop in the user's host-provided browser. |
| `/landing-report` | Read-only dashboard for the workspace-aware ship queue. |
| `/document-release` | Update all docs to match what you just shipped. |
| `/document-generate` | Generate Diataxis docs (tutorial / how-to / reference / explanation) from code. |
| `/setup-deploy` | One-time deploy config detection (Fly.io, Render, Vercel, etc.). |
| `/gstack-upgrade` | Update gstack to the latest version. |

### Operational + memory

| Skill | What it does |
|-------|-------------|
| `/context-save` | Save working context (git state, decisions, remaining work). |
| `/context-restore` | Resume from a saved context, even across Conductor workspaces. |
| `/learn` | Manage what gstack learned across sessions. |
| `/retro` | Weekly retro with per-person breakdowns and shipping streaks. |
| `/health` | Code quality dashboard (type checker, linter, tests, dead code). |
| `/benchmark` | Performance regression detection (page load, Core Web Vitals). |

### Browser integration

Browser skills use the browser capability supplied by the user's agent host,
connected to the browser and profile the user uses. gstack does not install
or launch another browser. If the host lacks that capability, browser steps
report unavailable; the other skills remain available.

| Skill | What it does |
|-------|-------------|
| `/browse` | Open a page, read it, click through a flow, take screenshots, and check console errors in the user's browser. |

### iOS QA — drive real iPhones over USB or Tailscale (v1.43.0.0+)

| Skill | What it does |
|-------|-------------|
| `/ios-qa` | Live-device iOS QA via USB CoreDevice tunnel + embedded StateServer. Optionally exposes the device over Tailscale so remote agents can drive it. |
| `/ios-fix` | Autonomous iOS bug fixer with regression snapshot capture. |
| `/ios-design-review` | Designer's-eye QA on a real iPhone — 10-dimension Apple HIG rubric. |
| `/ios-clean` | Convenience: strip DebugBridge + #if DEBUG wiring before a Release build. |
| `/ios-sync` | Regenerate the iOS debug bridge against the latest upstream templates. |

Companion CLIs (run on the Mac that's plugged into the device):

| Command | What it does |
|---------|-------------|
| `gstack-ios-qa-daemon` | Mac-side broker. Loopback by default; `--tailnet` adds a Tailscale-facing listener with capability tiers and audit logging. |
| `gstack-ios-qa-mint` | Owner-grant CLI for the tailnet allowlist (`grant`/`revoke`/`list`). |
| `gstack-ios-qa-regen` | Regenerate the canonical local DebugBridge package and typed accessors (`--app-source` / `--bridge-dir`). |

End-to-end walkthrough: [docs/howto-ios-testing-with-gstack.md](docs/howto-ios-testing-with-gstack.md).

### Safety + scoping

| Skill | What it does |
|-------|-------------|
| `/careful` | Warn before destructive commands (rm -rf, DROP TABLE, force-push). |
| `/freeze` | Lock edits to one directory. Hard block, not just a warning. |
| `/guard` | Activate both careful + freeze at once. |
| `/unfreeze` | Remove directory edit restrictions. |
| `/make-pdf` | Prepare print-ready HTML from Markdown; export PDF through the user's browser when the host supports it. |
| `/diagram` | English in, diagram out: mermaid source and, when the host browser supports offline page evaluation, editable .excalidraw + SVG/PNG. |

## Validation discipline

When fixing failures or preparing `/ship`, follow this order:

1. List the known failing cases, their logs and source revision, the demonstrated
   cause, and the smallest check that can prove each repair. Keep one current
   list in `.context/`; update it instead of starting overlapping repair plans.
   Reconcile the runner's failure total with named failures and unhandled or
   module-load errors; the named-test footer alone is not the complete inventory.
2. Resolve base-branch integration and assign one owner per shared file before
   editing. Keep repairs within the observed failures and the user's scope.
   Before a fixture writes through a link, resolve its target and verify it stays
   inside that fixture's temporary root; live skill registrations can point back
   into this checkout.
   When upstream replaces a helper API, inventory every direct caller, mock
   adapter, source snapshot, generated golden, and selection edge before choosing
   focused checks. Verify extracted test adapters supply the current imports and
   result schema; an adapter failure is not evidence that production failed.
   Schedule independent checks independently. Gate a check only on inputs or
   prerequisites it actually needs; an unrelated failure must not serialize the
   whole validation plan. Keep source fixed while tests live-link its files.
3. Diagnose before changing code. Distinguish a product defect, an invalid test
   expectation, a detector/fixture defect, and a launch/environment failure.
   Preserve the original failure. Do not call it pre-existing without evidence.
   Verify pinned runtime tool schemas and defaults before treating omitted fields
   as model noncompliance.
   Check that a bounded evaluation’s fixture scope and automated answers support
   its metric. Do not let the driver approve unrelated expansion, then blame the
   skill for the extra work; preserve required findings and evidence limits.
4. Reproduce with the smallest relevant test. For agent tests, reuse captured
   public events in free regressions, including negative controls, before paying
   for another agent run. Check behavior and acknowledgments; match exact prose
   only when that prose is the contract. Do not lower thresholds, increase model
   budgets, skip cases, or rejudge a failure to manufacture a pass.
   For policy or validation repairs, exercise the actual registered callback with
   representative native input and assert that it uses the helper’s result.
   When renderer or parser failures recur at the same boundary, verify the
   supported input class against the pinned runtime. Keep adversarial controls;
   do not add one spelling or glyph per paid failure.
   For workflow clarity failures, read the complete evaluated excerpt and its
   referenced source. Resolve all demonstrated ambiguities together: order,
   definitions, ownership and approval. Consolidate dense instructions into
   executable steps instead of appending more clauses. Review the resulting
   workflow as a whole; prose snapshots alone do not prove it is clear.
   For each gate, identify when its inputs exist and trace normal,
   skipped/unavailable and late-change paths to catch circular prerequisites or
   bypassed checks.
5. Run required cheap CI checks, including credential scanning, before paid work.
   Also run adjacent cheap checks: generated-content freshness, prompt-size/parity
   limits, source assertions, fixture checks, and dependency selection as
   applicable. A changed prompt must clear these before its eval.
   For skill edits, include `bun test test/parity-suite.test.ts`: its historical
   union-size cap is separate from the other prompt-size and context budgets.
   When workflow wording changes, search the entire test tree for removed
   clauses, including always-loaded prompt guards. Test fixtures containing
   subprocess examples must pass `test/spawnsync-timeout-tripwire.test.ts`;
   its scanner also checks quoted code.
   Run its selected quality judge before long behavioral evaluations that read
   the same changed prompt. If a repair supersedes an active run's inputs, cancel
   that run, preserve completed outcomes, and label unfinished cases as cancelled.
   Check each edit or setup command’s result before running dependent checks. A
   failed edit is not a reason to test the unchanged input again.
6. Declare a fixture actor’s supported interactions before the model starts.
   Keep its answers and permission handling within that declared interface.
   Bind artifact ownership to the same isolated state passed to the child;
   ambient environment paths do not establish ownership. Check whole-file and
   CI supervision against every case and configured retry, not just one attempt.
   Preflight the actual launcher: required binaries, isolated state, display when
   needed, explicit test tier, selection, and expected executed-case counts.
   Match the runtime versions pinned by the workflow and its container image.
   Keep socket-bearing temporary paths short after the runner adds its nested
   directories; exercise that exact layout in the smoke check. Store long-lived
   logs separately from socket directories.
   Verify required tool execution with a no-cost smoke check under that launch
   environment; versions and authentication alone do not prove it works. Set
   private artifact modes explicitly and preserve normal fixture permissions.
   Prove a diagnostic snapshot survives fixture cleanup in the final artifact
   directory before paid work; native snapshots require EVALS_RUN_ID or GSTACK_EVAL_DIR.
   Bind complete spool filenames and classify Bun's out-of-tier describe.skip
   placeholders separately, with zero selected-case credit.
   Put standalone Git fixtures outside another checkout; verify their resolved
   project slug and state root before interpreting a failure.
   Prove a seed commit succeeds there: repository-local author configuration
   does not establish the identity available to a fresh fixture repository.
   Reject missing explicit test files before invoking Bun; it can silently ignore
   a nonexistent file selector and pass the remaining files.
   Preserve exit status through logging. Use the documented detached runner and
   eval lock. Review the final launcher after edits; preparation and `--list`
   modes must not start monitors, retainers, or test processes. Verify this with
   a before/after process check. During long runs, inspect the last public tool
   result and pending permission state; diagnose a blocked actor before waiting
   through its deadline. Preserve cancellation separately from a test verdict.
   Skipped or unstarted cases
   do not satisfy coverage; preserve configured retries and every attempt.
7. Prove all known repairs with focused tests, including affected paid cases.
   Rerun a failed case only after a concrete repair or a demonstrated launch
   correction. Run the remaining required selected evaluations on the integrated
   code. Do not use the full free suite to discover predictable adjacent failures.
   Reuse a passing check when its consumed inputs and relevant environment are
   unchanged. For model judges, compare the expanded prompt, rubric, parameters
   and dependencies; a different commit alone does not invalidate the result.
   Do not resample an unchanged passing judge to simplify launcher configuration.
   Preserve its original source and label the result as reused evidence.
   Use actual prompt builders and compare complete bytes when proving model-input
   identity; preserve literal text in excerpts and record the consumed inputs.
8. Finish review fixes, generation, release metadata, and build before final
   acceptance. Freeze the code, then run `bun run test` once at the end. During
   repair, focused checks replace a full-suite run before every commit. If final
   acceptance unexpectedly fails, retain the failure, diagnose it narrowly, and
   report the changed validation plan before another full run; never retry it
   blindly or claim a pass from an older revision.
9. Publish only with passing required checks, unless the user explicitly grants
   an exception for identified failures. Report revision, actual pass/fail/skip
   counts, and incomplete coverage. A passing subset is not release acceptance.

## Build commands

```bash
bun install              # install dependencies
bun run test:quick       # fast measured free subset for edit feedback (not acceptance)
bun run test             # complete free suite via the strict shard runner (no API spend)
bun run eval:bg:pr       # changed fast live probes + selected judges, with explicit deferrals
bun run eval:bg:release  # fresh complete gate + periodic live coverage
bun run test:windows     # curated Windows-safe subset (runs on windows-latest)
bun run build            # generate docs + compile binaries
bun run gen:skill-docs   # regenerate SKILL.md files from templates
bun run skill:check      # health dashboard for all skills
```

## Platform support

- **macOS** + **Linux**: full test suite supported.
- **Windows**: curated Windows-safe subset runs on `windows-latest` via the
  `windows-free-tests` CI job. Setup script (`./setup`) requires Git Bash or
  MSYS today; native PowerShell support is a future expansion. The `bin/gstack-paths`
  helper resolves state roots through `CLAUDE_PLUGIN_DATA` / `GSTACK_HOME` so plugin
  installs work on every platform.
- **Browser and renderer**: browser skills and PDF/diagram export use the browser
  capability supplied by the agent host. Unsupported steps report unavailable.

## Key conventions

- SKILL.md files are **generated** from `.tmpl` templates. Edit the template, not the output.
- Run `bun run gen:skill-docs --host codex` to regenerate Codex-specific output.
- Browser steps follow `scripts/resolvers/browser.ts` and the host's own browser tool instructions.
- Safety skills (careful, freeze, guard) use inline advisory prose — always confirm before destructive operations.
- State paths resolve via `bin/gstack-paths` (sourced via `eval "$(...)"`). Honors `GSTACK_HOME`, `CLAUDE_PLUGIN_DATA`, `CLAUDE_PLANS_DIR`.
- The `claude` CLI binary resolves via `lib/claude-bin.ts` (`Bun.which()` + `GSTACK_CLAUDE_BIN` override). Set `GSTACK_CLAUDE_BIN=wsl` plus `GSTACK_CLAUDE_BIN_ARGS='["claude"]'` to run Claude through WSL on Windows.
