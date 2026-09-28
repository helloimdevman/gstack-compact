---
name: context-save
version: 1.0.0
description: |
  Save this task and its evidence for later work. (gstack)
allowed-tools:
  - Read
triggers:
  - context save
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /context-save

Save this task and its evidence for later work.
Carry the user's request, existing decisions, paths, and constraints into /context.

Read `../context/SKILL.md` relative to this installed SKILL.md and execute its `save` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
