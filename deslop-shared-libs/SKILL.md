---
name: deslop-shared-libs
version: 1.0.0
description: |
  Find worthwhile shared-code extractions in recent work. Recommendations
  only; no edits. (gstack)
allowed-tools:
  - Read
triggers:
  - find code worth sharing
  - shared-code extraction opportunities
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /deslop-shared-libs

Recommendations only. Carry the current diff and user constraints into /review.

Read `../review/SKILL.md` relative to this installed SKILL.md and execute its `shared-libs` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
