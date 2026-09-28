---
name: health
version: 1.0.0
description: |
  Report current code-quality checks and tool gaps. (gstack)
allowed-tools:
  - Read
triggers:
  - project health
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /health

Report current code-quality checks and tool gaps.
Carry the user request, scope, permissions, target, and existing evidence into /verify.

Read `../verify/SKILL.md` relative to this installed SKILL.md and execute its `health` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
