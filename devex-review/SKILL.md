---
name: devex-review
version: 1.0.0
description: |
  Measure installation, first success, and recovery in the actual developer flow. (gstack)
allowed-tools:
  - Read
triggers:
  - developer experience review
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /devex-review

Measure installation, first success, and recovery in the actual developer flow.
Carry the user request, scope, permissions, target, and existing evidence into /verify.

Read `../verify/SKILL.md` relative to this installed SKILL.md and execute its `developer-flow` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
