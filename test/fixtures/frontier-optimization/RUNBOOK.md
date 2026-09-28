# Frontier comparison runbook

`cases.json` fixes B01–B12 and the 72 planned cells: 12 cases ×
{Claude Code/Opus 5.5, Codex/GPT-6 Astra, Grok/Grok 4.7} × {pinned baseline, candidate}.
The descriptions are case briefs, not claims that an agent run occurred. All
cells remain `not_run` until a user directly starts a top-level session and
its fixture worktree, public transcript, and artifacts are preserved.

For each cell, create a fresh worktree outside another checkout and the host
skill search path. Seed it with the named case's initial state and acceptance
check, make a seed commit with a fixture-local Git author, and verify the
fixture root and tool permissions before starting the model. Run the same
case prompt, confirmed answers, allowed tools, budget, and environment for
both revisions of a model. Record the exact prompt bytes and SHA-256, case
brief SHA-256, installed skill tree hash, source commit, host CLI version,
requested and observed model IDs, launcher options, runtime version, and
all configured retries. Do not infer a model ID from a profile name.

The first user message is: “In this fixture worktree, carry out case `<ID>`
in `cases.json` to its stated goal. Respect its `allowedEffects`,
`confirmedAnswers`, and `failureConditions`. Use the installed gstack
profile for this cell. Save the requested artifacts inside this fixture
root. Report actual checks, failures, and work not run.” Substitute the case
ID and attach the case brief as literal text. A confirmed answer is supplied
only when the case brief declares it; B11's missing-answer branch remains
unanswered. B11's three branches run in one cell and produce a
three-branch diagnostic. Any split into independent sessions changes the
predeclared slot denominator before launch.

Capture only public tool events through the existing native transcript
projection. Copy traces and fixture-owned artifacts to a private final
artifact directory before deleting a fixture. Feed those events, the
artifact paths, an independent effect audit, and independent semantic checks
to `judgeFrontierCase`; it rejects missing traces, foreign artifacts, failed
or unacknowledged tools, forbidden effects, and unsupported success claims.
Save every attempted run and its outcome, including cancelled, blocked,
unavailable, and not-run cells. A passing subset cannot stand for all 72.
Record actual usage input/output/cache tokens and elapsed time from the host
where available. Static `gstack-context-bill` estimates stay separately
labelled and are never substituted for model usage.

Do not start child agents or paid automated judges in this project. The user
authorized direct Codex, Claude Code, and Grok CLI comparison in the current
session, with xhigh effort. This runbook authorizes no publication or other
external side effect. Grok has no native gstack host profile, so a generic
skill projection must be identified in each result; do not treat it as a
native-host installation comparison.
