---
name: plan-design-review
version: 1.0.0
description: |
  Review the UI and accessibility decisions in an existing plan. (gstack)
allowed-tools:
  - Read
triggers:
  - design plan review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /plan-design-review

Review the UI and accessibility decisions in an existing plan.
Carry the user request, named plan path, existing decisions, and restrictions into /plan.

Read `../plan/SKILL.md` relative to this installed SKILL.md and execute its `review-design` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
