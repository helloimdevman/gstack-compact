<!-- AUTO-GENERATED from spec.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->
# Executable spec

Establish who needs the change, current and desired behavior, why it matters, acceptance checks, constraints, non-goals, and related source evidence. Inspect at least one relevant file or document before technical interrogation; if none exists, state what project structure was inspected. Search for a matching open issue when possible, but an unavailable issue search does not block the document.

Draft the spec at the user's path or a worktree-specific task path. Ask for correction only if a missing decision would change the result. If the user requested an issue and the target repository is known, run the existing `gstack-issue-guard` redaction gate and file the accepted body with `gh`, preserving the issue URL. An unrequested document-only spec does not publish. If guard or filing fails, retain the draft and report the failure; do not call it filed. Implementation and agent spawning are separate user requests.
