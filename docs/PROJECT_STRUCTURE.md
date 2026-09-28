# Project structure

gstack is a set of generated `SKILL.md` workflows plus a few local tools.
`./setup` installs the selected skill profile and builds the design and
discovery binaries. It does not install a browser.

| Path | Purpose |
|---|---|
| `SKILL.md.tmpl`, `<skill>/SKILL.md.tmpl` | Source templates for the generated skill docs. |
| `browse/` | `/browse` instructions for the browser supplied by the user's agent host. |
| `plan/`, `build/`, `review/`, `verify/`, `ship/`, `investigate/`, `design/`, `context/`, `gstack/`, `sprint/` | Core workflow skills. |
| Other top-level skill directories | Compatibility specialists for QA, design, release, operations, iOS QA, and safety. |
| `hosts/` | Host configuration and hooks. |
| `scripts/` | Skill-doc generation, build tooling, and test runners. `scripts/resolvers/browser.ts` provides shared browser rules. |
| `bin/` | CLI helpers for setup, state, review, and skill workflows. |
| `lib/` | Shared libraries and the offline diagram page bundle. |
| `make-pdf/` | Markdown-to-print-HTML helper and pure rendering tests. PDF export uses the host's user-browser capability. |
| `diagram/`, `lib/diagram-render/` | Diagram skill and offline Mermaid/Excalidraw page bundle. |
| `test/` | Free tests, fixtures, and opt-in paid evaluations. |
| `.github/` | CI workflows and build image. |
| `docs/`, `contrib/` | Documentation and contributor tools. |

`./setup --skill-profile core` registers the core commands. The `compat`
profile also installs the specialist skills. Browser-based QA, scraping,
canary checks, PDF printing, and diagram export depend on capabilities of the
agent host connected to the user's browser. Unsupported browser steps are
reported as unavailable.
