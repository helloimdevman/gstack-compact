<!-- AUTO-GENERATED from version.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->
# Version allocation

After fetching the base, run `gstack-version-bump classify --base <base>`.
`DRIFT_UNEXPECTED` stops the release for inspection. For `DRIFT_STALE_PKG`,
run `gstack-version-bump repair`, then classify again; repair changes no
version level. For `ALREADY_BUMPED`, infer the first changed major/minor/patch/
micro component from `currentVersion` versus `baseVersion`; a missing fourth component is zero. This recovers the existing level, not approval to bump again.

Use `gstack-next-version --base <base> --bump <level> --current-version
<baseVersion> --json` to inspect open PRs, sibling worktrees, and the next
candidate. A result with `offline:true` and `fallback:"git"` still has a usable
candidate when it includes one; keep its warnings and claimed queue visible.
Do not treat an empty candidate as permission to allocate a potentially
colliding version. In `FRESH`, write the chosen candidate once with
`gstack-version-bump write --version <candidate>` after the user's release
intent supplies the level. In `ALREADY_BUMPED`, keep `currentVersion` unless
the user authorizes a change after seeing a real collision. Reclassify after
any write or repair and include the final version state in review evidence.
