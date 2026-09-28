---
name: design-consultation
version: 1.0.0
description: |
  Propose a complete design system with a reviewable artifact. (gstack)
allowed-tools:
  - Read
triggers:
  - design consultation
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /design-consultation

Propose a complete design system with a reviewable artifact.
Carry the user's request, existing decisions, paths, and constraints into /design.

Read `../design/SKILL.md` relative to this installed SKILL.md and execute its `system` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
