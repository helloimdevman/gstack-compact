#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$ROOT"

BUN_CMD="${BUN_CMD:-bun}"
BUILD_STAMP="$ROOT/design/dist/.build-complete"
BUILD_STAMP_TMP="$BUILD_STAMP.tmp.$$"

# Developer build; setup executes the runtime source directly.
[ "$#" -le 1 ] || { echo "Usage: scripts/build.sh [--runtime-only]" >&2; exit 2; }
case "${1:-}" in
  '') "$BUN_CMD" run gen:skill-docs --host all; "$BUN_CMD" run gen:plugin ;;
  --runtime-only) ;;
  *) echo "Usage: scripts/build.sh [--runtime-only]" >&2; exit 2 ;;
esac

# Publish only after all source bundles have built successfully.
rm -f "$BUILD_STAMP" "$BUILD_STAMP_TMP"

"$BUN_CMD" build --target=node design/src/cli.ts --outfile design/dist/design
"$BUN_CMD" build --target=node design/src/daemon.ts --outfile design/dist/daemon.ts
"$BUN_CMD" build --target=node bin/gstack-global-discover.ts --outfile bin/gstack-global-discover
"$BUN_CMD" build make-pdf/src/html.ts --target=node --outfile lib/gstack-markdown-html.js
bash scripts/write-version-files.sh design/dist/.version
chmod +x design/dist/design bin/gstack-global-discover
# Retire only the old generated Windows executables; callers use the bundles.
rm -f design/dist/design.exe bin/gstack-global-discover.exe

printf 'node-source-v1\n' > "$BUILD_STAMP_TMP"
mv -f "$BUILD_STAMP_TMP" "$BUILD_STAMP"
