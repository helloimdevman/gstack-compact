---
name: gstack-upgrade
version: 1.1.0
description: Upgrade gstack to the latest version.
triggers:
  - upgrade gstack
  - update gstack version
  - get latest gstack
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
preamble-tier: 2
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->


## When to invoke this skill

Detects global vs vendored install,
runs the upgrade, and shows what's new. Use when asked to "upgrade gstack",
"update gstack", or "get latest version".

Voice triggers (speech-to-text aliases): "upgrade the tools", "update the tools", "gee stack upgrade", "g stack upgrade".

## Start /gstack-upgrade

```bash
_G="$HOME/.claude/skills/gstack"
_R=$(git rev-parse --show-toplevel 2>/dev/null)
[ -n "$_R" ] && [ -x "$_R/.claude/skills/gstack/bin/gstack-skill-start" ] && _G="$_R/.claude/skills/gstack"
"$_G/bin/gstack-skill-start" --skill "gstack-upgrade" --model "claude" --parent-pid "$PPID" || echo 'SKILL_START: unavailable'
```

Reuse printed `GSTACK_BIN`; shell variables reset. Missing `GSTACK_CONTRACT` or `SKILL_START_PROTO: 1` blocks protected /gstack-upgrade steps. If `SESSION_KIND` is absent, treat `SESSION_KIND` as `interactive`; do NOT assume Conductor. Onboarding/telemetry: DEFERRED to the next healthy run. Keep `SESSION_ID` and `TEL_START`.

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

# /gstack-upgrade

## Outcome
`/gstack-upgrade` is finished only when this is true: Upgrade gstack to the latest version. Detects global vs vendored install, runs the upgrade, and shows what's new. Use when asked to "upgrade gstack", "update gstack", or "get latest version". Verify that outcome for `/gstack-upgrade`, then stop.

## Constraints
Stay on the `/gstack-upgrade` job. Do not expand `/gstack-upgrade` into adjacent cleanup or speculative hardening. Do not start another gstack skill unless the tool contract for `/gstack-upgrade` says to hand off. Do not read `/gstack-upgrade` sections/ unless the user asks for the legacy checklist.

## Stop
Stop `/gstack-upgrade` when the outcome above is verified, or when `/gstack-upgrade` is blocked on a destructive, irreversible, or product-defining fact. If blocked, ask that decision with a recommendation and wait for the answer. Then finish `/gstack-upgrade` or stop.

## Tool contract
Detect the source checkout from the runtime root's `.gstack-install.json` when present. Update that checkout from the gstack git remote and run `./setup` for the current host; setup preserves its recorded core/compat selection and generation model. Do not replace the runtime root with a clone or remove the install record. Show the version change. Do not touch the user's project code.

## Vendored upgrade guard

```bash
PARENT=$(dirname "$INSTALL_DIR")
[ -e "$INSTALL_DIR.bak" ] && { echo "ERROR: stale backup exists at $INSTALL_DIR.bak (from a previous failed upgrade?) — inspect it, salvage/remove it, then re-run." >&2; exit 1; }
TMP_DIR=$(mktemp -d) || { echo "ERROR: mktemp failed — aborting upgrade (install untouched)." >&2; exit 1; }
git clone --depth 1 https://github.com/garrytan/gstack.git "$TMP_DIR/gstack" || { echo "ERROR: clone failed — aborting upgrade (install untouched)." >&2; rm -rf "$TMP_DIR"; exit 1; }
mv "$INSTALL_DIR" "$INSTALL_DIR.bak" || { rm -rf "$TMP_DIR"; exit 1; }
if mv "$TMP_DIR/gstack" "$INSTALL_DIR"; then
  if (cd "$INSTALL_DIR" && ./setup); then
    rm -rf "$INSTALL_DIR.bak" "$TMP_DIR"
  else
    rm -rf "$INSTALL_DIR"
    mv "$INSTALL_DIR.bak" "$INSTALL_DIR" || { echo "ERROR: restore failed; backup retained." >&2; exit 1; }
    rm -rf "$TMP_DIR"
    echo "ERROR: setup failed; previous install restored." >&2
    exit 1
  fi
else
  mv "$INSTALL_DIR.bak" "$INSTALL_DIR"
  echo "ERROR: swap failed — previous install restored; upgrade aborted." >&2
  rm -rf "$TMP_DIR"
  exit 1
fi
```


**For git installs** (global-git, local-git):

Fast-forward first (#2517) — the same policy the session-update auto-upgrade
uses. `--autostash` carries local edits over the pull:
```bash
cd "$INSTALL_DIR"
git fetch origin
PRE_UPGRADE_COMMIT=$(git rev-parse HEAD)
echo "PRE_UPGRADE_COMMIT=$PRE_UPGRADE_COMMIT"
if git pull --ff-only --autostash origin main; then
  if ./setup; then echo "FF_OK"; else echo "SETUP_FAILED: git update succeeded; stop and inspect setup output (previous commit: $PRE_UPGRADE_COMMIT)" >&2; exit 1; fi
else
  echo "FF_REFUSED"
fi
```

If the output ends with `FF_OK`, the upgrade is done — skip the fallback
below entirely.
On `SETUP_FAILED`, STOP; keep user changes and report the recovery commit. There is no `.bak` on the git path. Do not enter the divergence fallback merely because setup failed. Enter it only on `FF_REFUSED`, after inspecting the pull error; network/auth failures stop for repair, not reset.

**Fallback (ff-only refused — local commits or divergence).** `git reset
--hard` DESTROYS things: a clean tree with unpushed local commits still loses
those commits. Gate it (#2517):

1. Run `git status --porcelain` and `git rev-list origin/main..HEAD --oneline`
   in `$INSTALL_DIR`.
2. If BOTH are empty, the reset is provably safe — run the fallback block
   below without asking.
3. Otherwise ask via AskUserQuestion (one-way door — destructive), listing
   exactly what will be discarded: each dirty file and each unpushed commit
   by hash + subject. Options: **A)** Discard them and upgrade (reset) —
   requires the explicit letter; **B)** Abort the upgrade so the user can
   rescue their work first (recommended when local commits exist). Never
   proceed on a vague reply.

```bash
cd "$INSTALL_DIR"
STASH_OUTPUT=$(git stash 2>&1)
git reset --hard origin/main
./setup
```
If `$STASH_OUTPUT` contains "Saved working directory", tell the user how to restore those changes with `git stash pop` in the skill directory.

**For vendored installs** (vendored, vendored-global):
```bash
PARENT=$(dirname "$INSTALL_DIR")
# A stale .bak from a previously crashed upgrade would make the mv below NEST
# the live install inside it and the failure-restore arm would "restore" the
# stale backup. It may also be the only good copy from that crashed run —
# abort and let the human inspect, never delete it silently.
[ -e "$INSTALL_DIR.bak" ] && { echo "ERROR: stale backup exists at $INSTALL_DIR.bak (from a previous failed upgrade?) — inspect it, salvage/remove it, then re-run." >&2; exit 1; }
TMP_DIR=$(mktemp -d) || { echo "ERROR: mktemp failed — aborting upgrade (install untouched)." >&2; exit 1; }
git clone --depth 1 https://github.com/garrytan/gstack.git "$TMP_DIR/gstack" || { echo "ERROR: clone failed — aborting upgrade (install untouched)." >&2; rm -rf "$TMP_DIR"; exit 1; }
mv "$INSTALL_DIR" "$INSTALL_DIR.bak" || { rm -rf "$TMP_DIR"; exit 1; }
if mv "$TMP_DIR/gstack" "$INSTALL_DIR"; then
  if (cd "$INSTALL_DIR" && ./setup); then
    rm -rf "$INSTALL_DIR.bak" "$TMP_DIR"
  else
    rm -rf "$INSTALL_DIR"
    mv "$INSTALL_DIR.bak" "$INSTALL_DIR" || { echo "ERROR: restore failed; backup retained." >&2; exit 1; }
    rm -rf "$TMP_DIR"
    echo "ERROR: setup failed; previous install restored." >&2
    exit 1
  fi
else
  mv "$INSTALL_DIR.bak" "$INSTALL_DIR"
  echo "ERROR: swap failed — previous install restored; upgrade aborted." >&2
  rm -rf "$TMP_DIR"
  exit 1
fi
```

### Step 4.5: Handle local vendored copy

Use the install directory from Step 2. Check if there's also a local vendored copy, and whether team mode is active:

```bash
_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
LOCAL_GSTACK=""
if [ -n "$_ROOT" ] && [ -d "$_ROOT/.claude/skills/gstack" ]; then
  _RESOLVED_LOCAL=$(cd "$_ROOT/.claude/skills/gstack" && pwd -P)
  _RESOLVED_PRIMARY=$(cd "$INSTALL_DIR" && pwd -P)
  if [ "$_RESOLVED_LOCAL" != "$_RESOLVED_PRIMARY" ]; then
    LOCAL_GSTACK="$_ROOT/.claude/skills/gstack"
  fi
fi
_TEAM_MODE=$(~/.claude/skills/gstack/bin/gstack-config get team_mode 2>/dev/null || echo "false")
echo "LOCAL_GSTACK=$LOCAL_GSTACK"
echo "TEAM_MODE=$_TEAM_MODE"
```

**If `LOCAL_GSTACK` is non-empty AND `TEAM_MODE` is `true`:** Remove the vendored copy. Team mode uses the global install as the single source of truth.

```bash
cd "$_ROOT"
git rm -r --cached .claude/skills/gstack/ 2>/dev/null || true
if ! grep -qF '.claude/skills/gstack/' .gitignore 2>/dev/null; then
  echo '.claude/skills/gstack/' >> .gitignore
fi
rm -rf "$LOCAL_GSTACK"
```
Tell user: "Removed vendored copy at `$LOCAL_GSTACK` (team mode active — global install is the source of truth). Commit the `.gitignore` change when ready."

**If `LOCAL_GSTACK` is non-empty AND `TEAM_MODE` is NOT `true`:** Update it by copying from the freshly-upgraded primary install (same approach as README vendored install):
```bash
[ -e "$LOCAL_GSTACK.bak" ] && { echo "ERROR: stale vendored backup; inspect it before retrying." >&2; exit 1; }
mv "$LOCAL_GSTACK" "$LOCAL_GSTACK.bak" || exit 1
if cp -Rf "$INSTALL_DIR" "$LOCAL_GSTACK" && rm -rf "$LOCAL_GSTACK/.git" && (cd "$LOCAL_GSTACK" && ./setup); then
  rm -rf "$LOCAL_GSTACK.bak"
  echo "LOCAL_SYNC_OK"
else
  rm -rf "$LOCAL_GSTACK"
  mv "$LOCAL_GSTACK.bak" "$LOCAL_GSTACK" || { echo "ERROR: restore failed; backup retained." >&2; exit 1; }
  echo "ERROR: sync failed; previous vendored copy restored." >&2
  exit 1
fi
```
Only on `LOCAL_SYNC_OK`, tell user: "Also updated vendored copy at `$LOCAL_GSTACK` — commit `.claude/skills/gstack/` when you're ready." Otherwise stop and report the recovery outcome; do not continue migrations or announce success.
