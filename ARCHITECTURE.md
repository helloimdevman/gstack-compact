# Architecture

gstack is a repository of generated AI workflow skills, a setup script, and a
small set of local CLIs. `gstack/router-map.json` defines the core commands and
compatibility routes. The skills themselves are Markdown, with no resident
server required for ordinary planning, implementation, review, or release work.

## Skills and installation

Source instructions live in `*/SKILL.md.tmpl` and optional
`*/sections/*.md.tmpl`. `scripts/gen-skill-docs.ts` resolves shared prose from
`scripts/resolvers/`, applies host settings from `hosts/`, and writes `SKILL.md`
files for Claude Code, Codex, and the other supported hosts. Edit templates,
then run `bun run gen:skill-docs`; generated files are output, not the source.

`./setup` installs runtime dependencies with npm, renders host-specific
skills, and registers the selected profile. `core` installs the 11 routine
workflow commands; `compat` adds specialist skills. The setup path does not
install a browser, native CSO helper, remote tunnel, or model-provider CLI.
`bin/gstack-paths` resolves state roots from `GSTACK_HOME` and host settings.

## Local tools

`bin/gstack-js` runs the TypeScript source with Node.js 24.2 or newer.
Setup installs only production packages from `package-lock.json`, skips builds,
and renders each selected host/profile once. Shell helpers use the same Node
launcher and shared modules in `lib/`.

For development, `bun run build` generates every host and bundles the design,
discovery, and Markdown CLIs for Node. `bun.lock` pins developer dependencies;
Bun is required for building and testing, not installation or ordinary use.

`/browse`, browser QA, visual design checks, PDF printing, and diagram
rendering use the user's browser through the agent host's browser capability.
The shared rules come from `scripts/resolvers/browser.ts`. The Markdown helper
produces print-ready HTML without a browser. PDF and diagram exports require
the corresponding host-browser operation; unsupported steps report unavailable.

## Release and deployment

`/ship` uses the installed `gh` CLI for GitHub PR creation and CI status.
`/land-and-deploy` uses `gh` for merge and checks the deployment with the
project's configured commands and health URL. `/setup-deploy` detects and
records the project's Fly.io, Render, Vercel, or other deployment command;
it does not run a hosted deployment service inside gstack.

## Validation

`test/` contains free checks and optional paid model evaluations. The free
suite runs through `scripts/test-free-shards.ts`, which enumerates test files,
shards them, and checks the child output as well as exit status. Use
`bun run test:quick` while editing and `bun run test` for final acceptance.
Browser-dependent live checks run only when the agent host supplies the user's browser.
Paid evaluations are separate and need an explicit `EVALS=1` tier.

For setup and contributor commands, see [README.md](README.md) and
[CONTRIBUTING.md](CONTRIBUTING.md).
