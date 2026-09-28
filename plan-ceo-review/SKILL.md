---
name: plan-ceo-review
version: 1.0.0
description: |
  Review product scope, alternatives, and user value in an existing plan. (gstack)
allowed-tools:
  - Read
triggers:
  - product plan review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /plan-ceo-review

Review product scope, alternatives, and user value in an existing plan.
Carry the user request, named plan path, existing decisions, and restrictions into /plan.

Read `../plan/SKILL.md` relative to this installed SKILL.md and execute its `review-product` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
