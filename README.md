# gstack-compact

English | [한국어](docs/README.ko.md)

**A personal fork of [gstack](https://github.com/garrytan/gstack), trimmed and organized around the workflows I use most.**

The plan → build → verify → review → ship workflow stays intact, with fewer commands in the default installation and less instruction text to read at the start of a task. Install the `compat` profile when you need specialist workflows.

| | Upstream gstack | gstack-compact defaults |
| --- | --- | --- |
| Commands | Specialist skills registered individually | 11 core commands for everyday work |
| Instructions | Detailed procedures for each skill | Shared rules and sections loaded as needed |
| Browser | Bundled browser tools | The browser provided by the agent host |
| Specialist workflows | Included by default | Available through the `compat` profile |

The compact defaults make everyday use lighter. The repository retains the specialist capabilities available through `compat`.

## Install as a plugin

Install this repository as the **gpact plugin**. You need Git and Node.js 24.2 or later, including npm.

```bash
# Claude Code
claude plugin marketplace add helloimdevman/gstack-compact
claude plugin install gpact@gpact-marketplace

# Codex
codex plugin marketplace add helloimdevman/gstack-compact
codex plugin add gpact@gpact-marketplace
```

Start a new session after installation. Use `/gpact-plan` in Claude Code and `$gpact:gpact-plan` in Codex. If a Claude Code command name conflicts with another plugin, include the plugin name: `/gpact:gpact-plan`. The plugin provides all 11 core commands. On first use, npm installs only the locked runtime dependencies. Bun and a separate build are not required.

To try a local checkout, replace the repository name in `marketplace add` with the checkout path. Claude Code also supports `claude --plugin-dir .`.

## Install skills directly

Prepare Git and [Node.js](https://nodejs.org/) 24.2 or later, including npm. Check out this repository outside your AI tool's skill directory, then run these commands from the repository root:

```bash
# Claude Code: /gpact-plan, /gpact-build, /gpact-verify, etc.
./setup --host claude --skill-profile core

# Codex: $gpact-plan, $gpact-build, $gpact-verify, etc.
./setup --host codex --skill-profile core
```

Start a new session after installation. Standalone installations share runtime locations and state paths with gstack, so check registration locations and names if you use both. For shorter Claude Code command names, use `--no-prefix`; `/plan` and `/context` overlap with built-in commands.

To include specialist commands, replace `core` with `compat`. Run `./setup --help` for installation options.

## Core commands

| Command | What it does |
| --- | --- |
| `/gpact-plan` | Frame an idea, write a plan or spec, and review it |
| `/gpact-build` | Implement a change |
| `/gpact-verify` | Check behavior |
| `/gpact-review` | Review changes |
| `/gpact-ship` | Verify, review, and publish an authorized PR |
| `/gpact-investigate` | Reproduce a defect and repair its cause |
| `/gpact-design` | Create a design system, variants, or HTML |
| `/gpact-context` | Save and restore working context |
| `/gpact-browse` | Browse with the host's browser |
| `/gpact` | Route a request to an installed skill |
| `/gpact-sprint` | Carry one task through planning, implementation, verification, and review |

Both installation methods use the `gpact` namespace. In Codex, invoke directly installed skills with `$gpact-plan` and plugin skills with `$gpact:gpact-plan`. See the [skill guide](docs/skills.md) for the full workflow reference.

## Validation

As of 2026-09-30, the complete free test suite (`bun run test`) reports **18,203 passed / 0 failed / 1 skipped**. The build, generated-document checks, and credential scan also passed. Claude Code and Codex installation, along with local helper execution, were verified on Node.js 24.2 without Bun.

"Compact" describes the default command set and the amount of instruction text loaded at the start of a task. This fork does not claim measured improvements in token usage, execution speed, or success rate over upstream.

Upstream: [garrytan/gstack](https://github.com/garrytan/gstack) · License: [MIT](LICENSE)

For development, edit the skill templates and regenerate documentation with `bun run gen:skill-docs --host all` and `bun run gen:plugin`. Plugin files are generated from the same templates.
