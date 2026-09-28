---
name: context-restore
version: 1.0.0
description: |
  Resume a saved task against the current checkout. (gstack)
allowed-tools:
  - Read
triggers:
  - context restore
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /context-restore

Resume a saved task against the current checkout.
Carry the user's request, existing decisions, paths, and constraints into /context.

Read `../context/SKILL.md` relative to this installed SKILL.md and execute its `restore` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
