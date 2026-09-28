---
name: plan-devex-review
version: 1.0.0
description: |
  Review installation, first success, and recovery in a developer-facing plan. (gstack)
allowed-tools:
  - Read
triggers:
  - developer experience plan review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /plan-devex-review

Review installation, first success, and recovery in a developer-facing plan.
Carry the user request, named plan path, existing decisions, and restrictions into /plan.

Read `../plan/SKILL.md` relative to this installed SKILL.md and execute its `review-dx` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
