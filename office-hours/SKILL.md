---
name: office-hours
version: 1.0.0
description: |
  Frame a product idea and write a short problem, approach, and non-goals document. (gstack)
allowed-tools:
  - Read
triggers:
  - office hours
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /office-hours

Frame a product idea and write a short problem, approach, and non-goals document.
Carry the user request, named plan path, existing decisions, and restrictions into /plan.

Read `../plan/SKILL.md` relative to this installed SKILL.md and execute its `frame` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
