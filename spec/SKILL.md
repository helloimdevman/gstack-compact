---
name: spec
version: 1.0.0
description: |
  Write an executable spec; file an issue only when the user requested issue publication. (gstack)
allowed-tools:
  - Read
triggers:
  - spec this out
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /spec

Write an executable spec; file an issue only when the user requested issue publication.
Carry the user request, named plan path, existing decisions, and restrictions into /plan.

Read `../plan/SKILL.md` relative to this installed SKILL.md and execute its `spec` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
