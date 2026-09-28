# gstack development

Follow the user's scope and authorization. Do not use subagents in this repository.
Read [AGENTS.md](AGENTS.md), especially its validation discipline, before changing code.

## Commands

```bash
bun install
bun run test:quick               # focused edit feedback, not acceptance
bun test test/<affected>.test.ts # explicit focused files only
bun run gen:skill-docs --host all
bun run build                   # all host docs + Bun source bundles
bun run skill:check
bun run test                    # final complete free acceptance
```

Never use bare `bun test` for the complete suite. Paid evaluations are separate;
read the evaluation procedures below before launching one. Keep source fixed
while tests use live links. Preserve failures and report unrun coverage.

## Editing rules

- Edit `SKILL.md.tmpl` and section templates, then regenerate; never hand-edit
  generated skills or resolve their merge conflicts by accepting one side.
- `lib/design-catalog.ts` and `lib/dom-dump-script.ts` own the generated design
  checklist and DOM helper. Regenerate those outputs with the skills.
- Use existing helpers and the runtime/platform before adding code. Keep shell
  examples self-contained: variables do not survive separate tool calls.
- Preserve existing work, install ownership checks, and user files. Resolve a
  fixture's links before writing through them; targets must stay in its temp root.
- Use the host's browser capability. Report unavailable capabilities honestly.
- Before an external send, scan the exact bytes with the redaction guard and
  record the egress receipt through the existing helpers. Never weaken HIGH
  credential blocking or claim these guards prevent intentional bypasses.
- Keep commits scoped. Version and CHANGELOG work happens at shipping time;
  version choices do not authorize merging, deploying, or skipping validation.
- Do not change `ETHOS.md`. Community changes to promotional material or Garry's
  voice require the explicit approval described in the community PR guardrails.

## Read when relevant

Read only the relevant section of [the development reference](docs/DEVELOPMENT.md)
before the corresponding operation. These are required procedures, not optional
background; follow existing authorization and the user's instructions.

| Task | Required reference |
|------|--------------------|
| Edit templates, generators, host/model profiles | [Skill workflow](docs/DEVELOPMENT.md#skillmd-workflow), [template rules](docs/DEVELOPMENT.md#writing-skill-templates) |
| Change installation, links, migrations | [Install ownership and live links](docs/DEVELOPMENT.md#dev-symlink-awareness) |
| Add or run evaluations | [Commands and tiers](docs/DEVELOPMENT.md#commands), [testing](docs/DEVELOPMENT.md#testing), [detached runs](docs/DEVELOPMENT.md#running-evals-as-an-agent-always-detach-sigterm-proof), [fixtures](docs/DEVELOPMENT.md#e2e-test-fixtures-extract-dont-copy) |
| Diagnose a failed evaluation | [Failure attribution](docs/DEVELOPMENT.md#e2e-eval-failure-blame-protocol) |
| Add an external sink or publish content | [Egress](docs/DEVELOPMENT.md#browser-interaction), [redaction](docs/DEVELOPMENT.md#redaction-guard-pii--secrets--legal-content) |
| Prepare a release | [Version and CHANGELOG rules](docs/DEVELOPMENT.md#changelog--version-style), [entry format](docs/CHANGELOG_STYLE.md) |
| Review community or fork PRs | [Community guardrails](docs/DEVELOPMENT.md#community-pr-guardrails), [fork PRs](docs/DEVELOPMENT.md#checking-out-prs-from-garrytan-agents) |
| Change active installations | [Deployment](docs/DEVELOPMENT.md#deploying-to-the-active-skill) |
| Investigate slop-scan findings | [Slop-scan policy](docs/SLOP_SCAN.md) |
| Capture durable decisions | [Decision memory](docs/DEVELOPMENT.md#cross-session-decision-memory) |

## Skill routing

Use an available skill when it fits the requested work. The default catalog is
`/plan`, `/build`, `/review`, `/verify`, `/ship`, `/investigate`, `/design`,
`/context`, `/gstack`, `/browse`, and `/sprint`. Specialist commands require
`compat`. Routing does not add authorization or require a repeated approval.
