<!-- AUTO-GENERATED from spec.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->
# Executable spec

Establish who needs the change, current and desired behavior, why it matters, acceptance checks, constraints, non-goals, and related source evidence. Inspect at least one relevant file or document before technical interrogation; if none exists, state what project structure was inspected. Search for a matching open issue when possible, but an unavailable issue search does not block the document.

Draft the spec at the user's path or a worktree-specific task path. Ask for correction only if a missing decision would change the result. An unrequested document-only spec does not publish.

If the user requested an issue and the target repository is known, write the exact accepted body to a private `ISSUE_BODY_FILE` (mode 0600). Run `"$GSTACK_BIN/gstack-redact" --from-file "$ISSUE_BODY_FILE" --repo-visibility unknown` immediately before filing; check its exit status even without shell `errexit`. Exit 3 (HIGH) or a scan error blocks filing. Exit 2 requires each MEDIUM finding to be removed or explicitly acknowledged; rescan edited bytes. Only then run `gh issue create --body-file "$ISSUE_BODY_FILE"` with the same scanned file. Remove the temporary file after the command and preserve the issue URL. Use `gstack-issue-guard` only when *reading* existing issue text. If scanning or filing fails, retain the draft and report the failure; do not call it filed. Implementation and agent spawning are separate user requests.
