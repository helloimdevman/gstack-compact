---
name: design-review
version: 1.0.0
description: |
  Review and fix visual defects in an actual rendered UI. (gstack)
triggers:
  - visual design review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /design-review

Review and fix visual defects in an actual rendered UI.
Carry the user request, scope, permissions, target, and existing evidence into /verify.

Read `../verify/SKILL.md` relative to this installed SKILL.md and execute its `visual-fix` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
