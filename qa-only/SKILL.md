---
name: qa-only
version: 1.0.0
description: |
  Report browser defects with evidence; leave source and commits unchanged. (gstack)
triggers:
  - qa report only
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /qa-only

Report browser defects with evidence; leave source and commits unchanged.
Carry the user request, scope, permissions, target, and existing evidence into /verify.

Read `../verify/SKILL.md` relative to this installed SKILL.md and execute its `browser-report` mode with the user's original request, scope, decisions, and paths. If the target is missing or unreadable, report that exact missing path and stop this mode; do not mark it complete. The target owns bootstrap and completion reporting.
