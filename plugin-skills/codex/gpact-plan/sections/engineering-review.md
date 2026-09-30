<!-- AUTO-GENERATED from engineering-review.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->
# Engineering review

Review the latest plan after earlier applicable perspectives have amended it. Trace affected code, callers, data flow, ownership of shared files, and failure/recovery paths. Check concurrency, migration, compatibility, security and data-loss boundaries only where the change touches them. Map each acceptance condition to the smallest meaningful proof. Identify environment prerequisites, unavailable checks, and the point at which release evidence becomes stale.

Lock the implementation sequence and explicit interfaces. Correct genuine contradictions and circular prerequisites. Do not demand speculative architecture or a full test suite for a trivial edit. Leave unresolved product choices visible with a recommendation; do not silently decide them for the user. Stop with an executable plan, not code or a PR.
