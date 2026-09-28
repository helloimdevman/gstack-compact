# Skill Deep Dives

New Claude/Codex installations expose `/plan`, `/build`, `/review`, `/verify`,
`/ship`, `/investigate`, `/design`, `/context`, `/gstack`, `/browse`, and
`/sprint`. Run `./setup --skill-profile compat` for the specialist commands
below. Converted names such as `/autoplan` and `/qa-only` enter a canonical
mode; their current executable contracts live in the installed `SKILL.md`
and selected sections. The older deep dives below are background and examples,
not the current command contract.

| Core skill | Current behavior |
|------------|------------------|
| `/plan` | Frame, write, or review plans and specs; stop before implementation. |
| `/build` | Implement the authorized change and run relevant checks. |
| `/review` | Review a current diff; fix only when authorized. |
| `/verify` | Check the changed interface; report by default. |
| `/ship` | Prepare, verify, review, and publish an authorized PR. |
| `/investigate` | Reproduce, fix the cause, and verify a defect. |
| `/design` | Design system, variants, or HTML mode. |
| `/context` | Save, restore, or manage learnings. |
| `/gstack` | Route to one installed skill. |
| `/browse` | Drive the user's browser through the agent host. |
| `/sprint` | Run one task through planning, build, verification, review, and authorized publication. |

Historical guides for the compat specialist catalog follow.

| Skill | Your specialist | What they do |
|-------|----------------|--------------|
| [`/office-hours`](#office-hours) | **YC Office Hours** | Start here. Six forcing questions that reframe your product before you write code. Pushes back on your framing, challenges premises, generates implementation alternatives. Design doc feeds into every downstream skill. |
| [`/spec`](#spec) | **Spec Author** | Turn vague intent into a precise, executable spec in five phases. Backlog-ready output that downstream skills can pick up. Optional agent spawn at the end. |
| [`/plan-ceo-review`](#plan-ceo-review) | **CEO / Founder** | Rethink the problem. Find the 10-star product hiding inside the request. Four modes: Expansion, Selective Expansion, Hold Scope, Reduction. |
| [`/plan-eng-review`](#plan-eng-review) | **Eng Manager** | Lock in architecture, data flow, diagrams, edge cases, and tests. Forces hidden assumptions into the open. |
| [`/plan-design-review`](#plan-design-review) | **Senior Designer** | Interactive plan-mode design review. Rates each dimension 0-10, explains what a 10 looks like, fixes the plan. Works in plan mode. |
| [`/design-consultation`](#design-consultation) | **Design Partner** | Build a complete design system from scratch. Knows the landscape, proposes creative risks, generates realistic product mockups. Design at the heart of all other phases. |
| [`/review`](#review) | **Staff Engineer** | Find the bugs that pass CI but blow up in production. Auto-fixes the obvious ones. Flags completeness gaps. Advisory simplification lens flags over-built code — never blocks, never auto-applies. |
| [`/investigate`](#investigate) | **Debugger** | Systematic root-cause debugging. Iron Law: no fixes without investigation. Traces data flow, tests hypotheses, stops after 3 failed fixes. |
| [`/design-review`](#design-review) | **Designer Who Codes** | Live-site visual audit + fix loop. 80-item audit, then fixes what it finds. Atomic commits, before/after screenshots. |
| [`/design-shotgun`](#design-shotgun) | **Design Explorer** | Generate multiple AI design variants, open a comparison board in your browser, and iterate until you approve a direction. Taste memory biases toward your preferences. |
| [`/design-html`](#design-html) | **Design Engineer** | Generates production-quality Pretext-native HTML. Works with approved mockups, CEO plans, design reviews, or from scratch. Text reflows on resize, heights adjust to content. Smart API routing per design type. Framework detection for React/Svelte/Vue. Previews use the browser supplied by your agent host. |
| [`/qa`](#qa) | **QA Lead** | Test your app, find bugs, fix them with atomic commits, re-verify. Auto-generates regression tests for every fix. |
| [`/qa-only`](#qa) | **QA Reporter** | Same methodology as /qa but report only. Use when you want a pure bug report without code changes. |
| [`/scrape`](#browse) | **Browser Data Extractor** | Pull structured data off a web page — tables, lists, prices — in your host-provided browser. Same contract as `/browse`.  |
| [`/ship`](#ship) | **Release Engineer** | Sync main, run tests, audit coverage, push, open PR. Bootstraps test frameworks if you don't have one. One command. |
| [`/land-and-deploy`](#land-and-deploy) | **Release Engineer** | Merge the PR, wait for CI and deploy, verify production health. One command from "approved" to "verified in production." |
| [`/canary`](#canary) | **SRE** | Post-deploy monitoring loop. Watches for console errors, performance regressions, and page failures in your host-provided browser. |
| [`/benchmark`](#benchmark) | **Performance Engineer** | Baseline page load times, Core Web Vitals, and resource sizes. Compare before/after on every PR. Track trends over time. |
| [`/document-release`](#document-release) | **Technical Writer** | Update all project docs to match what you just shipped. Catches stale READMEs automatically. |
| [`/document-generate`](#document-generate) | **Technical Writer** | Generate Diataxis docs (tutorial / how-to / reference / explanation) for a feature from code. |
| [`/retro`](#retro) | **Eng Manager** | Team-aware weekly retro. Per-person breakdowns, shipping streaks, test health trends, growth opportunities. |
| [`/browse`](#browse) | **QA Engineer** | Give the agent eyes through the browser supplied by your agent host. |
| [`/autoplan`](#autoplan) | **Review Pipeline** | One command, fully reviewed plan. Runs CEO → design → DX → eng review automatically (eng always last, so the shipping gate reviews the final amended plan) with encoded decision principles. Surfaces only taste decisions for your approval. |
| [`/plan-devex-review`](#plan-devex-review) | **DX Reviewer** | Plan-stage DX review. TTHW (time-to-hello-world), magical moments, friction points, persona traces. Three modes: Expansion, Polish, Triage. |
| [`/devex-review`](#devex-review) | **DX Reviewer (live)** | Live developer experience audit. Walks the actual onboarding flow, measures TTHW, catches the docs lies. |
| [`/plan-tune`](#plan-tune) | **Question Tuner** | Self-tune AskUserQuestion sensitivity per question. Mark questions as never-ask, always-ask, or only-for-one-way. |
| [`/spec`](#spec) | **Spec Author** | Turn vague intent into a precise, executable spec in five phases. Files a GitHub issue, optionally spawns a Claude Code agent in a fresh worktree, and lets `/ship` close the source issue on merge. |
| [`/learn`](#learn) | **Memory** | Manage what gstack learned across sessions. Review, search, prune, and export project-specific patterns and preferences. |
| [`/context-save`](#context-save) | **Save State** | Save working context (git state, decisions, remaining work) so any future session can resume. |
| [`/context-restore`](#context-restore) | **Restore State** | Resume from a saved context, even across Conductor workspace handoffs. |
| [`/health`](#health) | **Code Quality Dashboard** | Wraps type checker, linter, tests, dead code detection. Computes a weighted 0-10 score; tracks trends over time. |
| [`/deslop-shared-libs`](#deslop-shared-libs) | **Shared Code Reviewer** | Find worthwhile shared-code extractions in recent work. Recommendations only. |
| [`/landing-report`](#landing-report) | **Ship Queue Dashboard** | Read-only snapshot of the workspace-aware ship queue. Which version slots are claimed, which sibling workspaces have WIP. |
| | | |
| | | |
| **Safety & Utility** | | |
| [`/careful`](#safety--guardrails) | **Safety Guardrails** | Warns before destructive commands (rm -rf, DROP TABLE, force-push, git reset --hard). Override any MEDIUM warning; root/home recursive deletes and default-branch force-pushes are hard-denied. Common build cleanups whitelisted. |
| [`/freeze`](#safety--guardrails) | **Edit Lock** | Restrict all file edits to a single directory. Blocks Edit and Write outside the boundary. Accident prevention for debugging. |
| [`/guard`](#safety--guardrails) | **Full Safety** | Combines /careful + /freeze in one command. Maximum safety for prod work. |
| [`/unfreeze`](#safety--guardrails) | **Unlock** | Remove the /freeze boundary, allowing edits everywhere again. |
| [`/setup-deploy`](#setup-deploy) | **Deploy Configurator** | One-time setup for `/land-and-deploy`. Detects your platform, production URL, and deploy commands. |
| [`/gstack-upgrade`](#gstack-upgrade) | **Self-Updater** | Upgrade gstack to the latest version. Detects global vs vendored install, syncs both, shows what changed. |
| [`/make-pdf`](#make-pdf) | **PDF Generator** | Prepare print-ready HTML from Markdown and export PDF when the host's user-browser tool supports it. |
| [`/diagram`](#diagram) | **Diagram Maker** | English in, Mermaid source out; SVG, PNG, and editable Excalidraw exports use the host-provided browser when supported. |
| [`/ios-qa`](#ios-qa) | **iOS QA Lead** | Live-device iOS QA via USB CoreDevice tunnel + embedded StateServer. Reads Swift source, codegens accessors, drives the real iPhone. Optionally exposes the device over Tailscale for remote agents. |
| [`/ios-fix`](#ios-fix) | **iOS Autonomous Fixer** | Closes the find→fix→verify loop on a real iPhone. Captures a reproducing snapshot, fixes the source, rebuilds, redeploys, verifies. |
| [`/ios-design-review`](#ios-design-review) | **iOS Designer's Eye** | 10-dimension Apple HIG audit on a real iPhone. Rates each screen, says what would make it a 10. |
| [`/ios-clean`](#ios-clean) | **iOS Bridge Cleanup** | Convenience wrapper to strip DebugBridge SPM + `#if DEBUG` wiring. The structural Release-build guard is in Package.swift + CI; this skill is for guided manual removals. |
| [`/ios-sync`](#ios-sync) | **iOS Bridge Resync** | Regenerate accessors and Swift templates against the latest upstream gstack. Run when you add new `@Observable` classes or upgrade gstack. |

---

## `/office-hours`

This is where every project should start.

Before you plan, before you review, before you write code — sit down with a YC-style partner and think about what you're actually building. Not what you think you're building. What you're *actually* building.

### The reframe

Here's what happened on a real project. The user said: "I want to build a daily briefing app for my calendar." Reasonable request. Then it asked about the pain — specific examples, not hypotheticals. They described an assistant missing things, calendar items across multiple Google accounts with stale info, prep docs that were AI slop, events with wrong locations that took forever to track down.

It came back with: *"I'm going to push back on the framing, because I think you've outgrown it. You said 'daily briefing app for multi-Google-Calendar management.' But what you actually described is a personal chief of staff AI."*

Then it extracted five capabilities the user didn't realize they were describing:

1. **Watches your calendar** across all accounts and detects stale info, missing locations, permission gaps
2. **Generates real prep work** — not logistics summaries, but *the intellectual work* of preparing for a board meeting, a podcast, a fundraiser
3. **Manages your CRM** — who are you meeting, what's the relationship, what do they want, what's the history
4. **Prioritizes your time** — flags when prep needs to start early, blocks time proactively, ranks events by importance
5. **Trades money for leverage** — actively looks for ways to delegate or automate

That reframe changed the entire project. They were about to build a calendar app. Now they're building something ten times more valuable — because the skill listened to their pain instead of their feature request.

### Premise challenge

After the reframe, it presents premises for you to validate. Not "does this sound good?" — actual falsifiable claims about the product:

1. The calendar is the anchor data source, but the value is in the intelligence layer on top
2. The assistant doesn't get replaced — they get superpowered
3. The narrowest wedge is a daily briefing that actually works
4. CRM integration is a must-have, not a nice-to-have

You agree, disagree, or adjust. Every premise you accept becomes load-bearing in the design doc.

### Implementation alternatives

Then it generates 2-3 concrete implementation approaches with honest effort estimates:

- **Approach A: Daily Briefing First** — narrowest wedge, ships tomorrow, M effort (human: ~3 weeks / CC: ~2 days)
- **Approach B: CRM-First** — build the relationship graph first, L effort (human: ~6 weeks / CC: ~4 days)
- **Approach C: Full Vision** — everything at once, XL effort (human: ~3 months / CC: ~1.5 weeks)

Recommends A because you learn from real usage. CRM data comes naturally in week two.

### Two modes

**Startup mode** — for founders and intrapreneurs building a business. You get six forcing questions distilled from how YC partners evaluate products: demand reality, status quo, desperate specificity, narrowest wedge, observation & surprise, and future-fit. These questions are uncomfortable on purpose. If you can't name a specific human who needs your product, that's the most important thing to learn before writing any code.

**Builder mode** — for hackathons, side projects, open source, learning, and having fun. You get an enthusiastic collaborator who helps you find the coolest version of your idea. What would make someone say "whoa"? What's the fastest path to something you can share? The questions are generative, not interrogative.

### The design doc

Both modes end with a design doc written to `~/.gstack/projects/` — and that doc feeds directly into `/plan-ceo-review` and `/plan-eng-review`. The full lifecycle is now: `office-hours → plan → implement → review → QA → ship → retro`.

After the design doc is approved, `/office-hours` reflects on what it noticed about how you think — not generic praise, but specific callbacks to things you said during the session. The observations appear in the design doc too, so you re-encounter them when you re-read later.

---

## `/plan-ceo-review`

This is my **founder mode**.

This is where I want the model to think with taste, ambition, user empathy, and a long time horizon. I do not want it taking the request literally. I want it asking a more important question first:

**What is this product actually for?**

I think of this as **Brian Chesky mode**.

The point is not to implement the obvious ticket. The point is to rethink the problem from the user's point of view and find the version that feels inevitable, delightful, and maybe even a little magical.

### Example

Say I am building a Craigslist-style listing app and I say:

> "Let sellers upload a photo for their item."

A weak assistant will add a file picker and save an image.

That is not the real product.

In `/plan-ceo-review`, I want the model to ask whether "photo upload" is even the feature. Maybe the real feature is helping someone create a listing that actually sells.

If that is the real job, the whole plan changes.

Now the model should ask:

* Can we identify the product from the photo?
* Can we infer the SKU or model number?
* Can we search the web and draft the title and description automatically?
* Can we pull specs, category, and pricing comps?
* Can we suggest which photo will convert best as the hero image?
* Can we detect when the uploaded photo is ugly, dark, cluttered, or low-trust?
* Can we make the experience feel premium instead of like a dead form from 2007?

That is what `/plan-ceo-review` does for me.

It does not just ask, "how do I add this feature?"
It asks, **"what is the 10-star product hiding inside this request?"**

### Four modes

- **SCOPE EXPANSION** — dream big. The agent proposes the ambitious version. Every expansion is presented as an individual decision you opt into. Recommends enthusiastically.
- **SELECTIVE EXPANSION** — hold your current scope as the baseline, but see what else is possible. The agent surfaces opportunities one by one with neutral recommendations — you cherry-pick the ones worth doing.
- **HOLD SCOPE** — maximum rigor on the existing plan. No expansions surfaced.
- **SCOPE REDUCTION** — find the minimum viable version. Cut everything else.

Visions and decisions are persisted to `~/.gstack/projects/` so they survive beyond the conversation. Exceptional visions can be promoted to `docs/designs/` in your repo for the team.

---

## `/plan-eng-review`

This is my **eng manager mode**.

Once the product direction is right, I want a different kind of intelligence entirely. I do not want more sprawling ideation. I do not want more "wouldn't it be cool if." I want the model to become my best technical lead.

This mode should nail:

* architecture
* system boundaries
* data flow
* state transitions
* failure modes
* edge cases
* trust boundaries
* test coverage

And one surprisingly big unlock for me: **diagrams**.

LLMs get way more complete when you force them to draw the system. Sequence diagrams, state diagrams, component diagrams, data-flow diagrams, even test matrices. Diagrams force hidden assumptions into the open. They make hand-wavy planning much harder.

So `/plan-eng-review` is where I want the model to build the technical spine that can carry the product vision.

### Example

Take the same listing app example.

Let's say `/plan-ceo-review` already did its job. We decided the real feature is not just photo upload. It is a smart listing flow that:

* uploads photos
* identifies the product
* enriches the listing from the web
* drafts a strong title and description
* suggests the best hero image

Now `/plan-eng-review` takes over.

Now I want the model to answer questions like:

* What is the architecture for upload, classification, enrichment, and draft generation?
* Which steps happen synchronously, and which go to background jobs?
* Where are the boundaries between app server, object storage, vision model, search/enrichment APIs, and the listing database?
* What happens if upload succeeds but enrichment fails?
* What happens if product identification is low-confidence?
* How do retries work?
* How do we prevent duplicate jobs?
* What gets persisted when, and what can be safely recomputed?

And this is where I want diagrams — architecture diagrams, state models, data-flow diagrams, test matrices. Diagrams force hidden assumptions into the open. They make hand-wavy planning much harder.

That is `/plan-eng-review`.

Not "make the idea smaller."
**Make the idea buildable.**

One note on invocation: in plan mode, the skill skips the "what should I review?" scope question and reviews your active plan automatically, announcing its pick in one line ("Scope gate: plan mode — auto-selected B") so you can redirect it. Name a target explicitly ("review PLAN.md") and your choice wins in any mode. Outside plan mode with nothing named, it asks first — that gate is a hard stop.

### Review Readiness Dashboard

Every review (CEO, Eng, Design) logs its result. At the end of each review, you see a dashboard:

```
+====================================================================+
|                    REVIEW READINESS DASHBOARD                       |
+====================================================================+
| Review          | Runs | Last Run            | Status    | Required |
|-----------------|------|---------------------|-----------|----------|
| Eng Review      |  1   | 2026-03-16 15:00    | CLEAR     | YES      |
| CEO Review      |  1   | 2026-03-16 14:30    | CLEAR     | no       |
| Design Review   |  0   | —                   | —         | no       |
+--------------------------------------------------------------------+
| VERDICT: CLEARED — Eng Review passed                                |
+====================================================================+
```

Eng Review is the only required gate (disable with `gstack-config set skip_eng_review true`). CEO and Design are informational — recommended for product and UI changes respectively.

Diff reviews use the `review_freshness` grade computed by `gstack-review-read`, shared by `/ship` and `/land-and-deploy`. CURRENT requires a clean, reviewer-reported completed and converged pass whose captured start and finish fingerprints match the current working-tree content. Tracked edits and non-ignored untracked source both count; an identical commit hash or zero commits since review is not a fallback.

A captured pass with different start/end content grades STALE, as does a previously verified pass whose fingerprint no longer matches. Missing or reused start receipts, legacy log-only records, incomplete or nonconverged passes, and unresolved findings cannot grade CURRENT; missing evidence grades UNVERIFIED. Ship telemetry is not a review pass. After fixes, run a genuine full re-review with a new start receipt rather than capturing one only to log the result. Completion remains reviewer-reported, not independent proof that a model read the source.

Plan-file reviews retain their existing seven-day freshness handling and optional plan-hash comparison; repository-content rules do not apply to them. A diff review must grade CURRENT before it can clear Eng Review, in addition to the dashboard's existing age and clean-status requirements.

### Plan-to-QA flow

When `/plan-eng-review` finishes the test review section, it writes a test plan artifact to `~/.gstack/projects/`. When you later run `/qa`, it picks up that test plan automatically — your engineering review feeds directly into QA testing with no manual copy-paste.

---

## `/plan-design-review`

This is my **senior designer reviewing your plan** — before you write a single line of code.

Most plans describe what the backend does but never specify what the user actually sees. Empty states? Error states? Loading states? Mobile layout? AI slop risk? These decisions get deferred to "figure it out during implementation" — and then an engineer ships "No items found." as the empty state because nobody specified anything better.

`/plan-design-review` catches all of this during planning, when it's cheap to fix.

It works like `/plan-ceo-review` and `/plan-eng-review` — interactive, one issue at a time, with the **STOP + AskUserQuestion** pattern. It rates each design dimension 0-10, explains what a 10 looks like, then edits the plan to get there. The rating drives the work: rate low = lots of fixes, rate high = quick pass. Like `/plan-eng-review`, it skips the "what should I review?" scope question in plan mode and targets your active plan automatically (announced in one line so you can redirect); an explicitly named target wins in any mode.

Seven passes over the plan: information architecture, interaction state coverage, user journey, AI slop risk, design system alignment, responsive/accessibility, and unresolved design decisions. For each pass, it finds gaps and either fixes them directly (obvious ones) or asks you to make a design choice (genuine tradeoffs).

### Example

```
You:   /plan-design-review

Claude: Initial Design Rating: 4/10

        "This plan describes a user dashboard but never specifies
         what the user sees first. It says 'cards with icons' —
         which looks like every SaaS template. It mentions zero
         loading states, zero empty states, and no mobile behavior."

        Pass 1 (Info Architecture): 3/10
        "A 10 would define primary/secondary/tertiary content
         hierarchy for every screen."
        → Added information hierarchy section to plan

        Pass 2 (Interaction States): 2/10
        "The plan has 4 UI features but specifies 0 out of 20
         interaction states (4 features × 5 states each)."
        → Added interaction state table to plan

        Pass 4 (AI Slop): 4/10
        "The plan says 'clean, modern UI with cards and icons'
         and 'hero section with gradient'. These are the top 2
         AI-generated-looking patterns."
        → Rewrote UI descriptions with specific, intentional alternatives

        Overall: 4/10 → 8/10 after fixes
        "Plan is design-complete. Run /design-review after
         implementation for visual QA."
```

When you re-run it, sections already at 8+ get a quick pass. Sections below 8 get full treatment. For live-site visual audits post-implementation, use `/design-review`.

---

## `/design-consultation`

This is my **design partner mode**.

`/plan-design-review` audits a site that already exists. `/design-consultation` is for when you have nothing yet — no design system, no font choices, no color palette. You are starting from zero and you want a senior designer to sit down with you and build the whole visual identity together.

It is a conversation, not a form. The agent asks about your product, your users, and your audience. It thinks about what your product needs to communicate — trust, speed, craft, warmth, whatever fits — and works backward from that to concrete choices. Then it proposes a complete, coherent design system: aesthetic direction, typography (3+ fonts with specific roles), color palette with hex values, spacing scale, layout approach, and motion strategy. Every recommendation comes with a rationale. Every choice reinforces every other choice.

But coherence is table stakes. Every dev tool dashboard looks the same — clean sans-serif, muted grays, a blue accent. They are all coherent. They are all forgettable. The difference between a product that looks "nice" and one that people actually recognize is the **deliberate creative risks**: the unexpected serif for headings, the bold accent nobody else in your category uses, the tighter spacing that makes your data feel authoritative instead of airy.

That is what `/design-consultation` is really about. It does not just propose a safe system. It proposes safe choices AND risks — and tells you which is which. "Here are the choices that keep you literate in your category. And here is where I think you should break from convention, and why." You pick which risks to take. The agent checks that the whole system still coheres either way.

If you want, the agent will research what's already out there in your space — take screenshots of real sites, analyze their fonts and colors and spacing — so you can see the landscape before you make choices. This is not about copying. It is about getting in the ballpark so you know what the conventions are, and then deciding which ones are worth breaking.

After you agree on the system, it generates an interactive HTML preview page — not just swatches and font samples, but realistic product pages. If you are building a dashboard, you see a dashboard with a sidebar, data tables, and stat cards. If you are building a marketing site, you see a hero section with real copy and a CTA. Everything rendered in your design system, with your product name, in light and dark mode. You see what your product could feel like before a single line of production code is written.

Then it writes `DESIGN.md` to your repo root — your project's design source of truth — and updates `CLAUDE.md` so every future Claude Code session respects the system. From that point on, `/design-review` can audit against it, and any agent working on your frontend knows the rules.

The file is written in the open DESIGN.md format ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)): every token in YAML front matter (`colors`, `typography`, `rounded`, `spacing`, `components`), the rationale in the spec's canonical sections, so impeccable, Google Stitch, and anything else that reads the format share one file. If you already have a legacy gstack `DESIGN.md`, the skill offers a conversion once (a backup is kept) and records your answer in the file so it never asks again. A `PRODUCT.md` in the repo root prefills the product questions instead of re-asking them.

### Example

```
You:   /design-consultation

Claude: From the README, this looks like a developer analytics dashboard
        for engineering teams. Sound right? Tell me about the feeling
        you want — and would you like me to look at what's out there
        first so we can see the landscape?

You:    Yes, it's for eng managers. Show me what's out there.

Claude: [browses Linear, Vercel, Datadog, Posthog — takes screenshots]

        Here's the landscape. They all converge on clean sans-serifs
        and muted blue-gray palettes. Linear stands out with dark-first
        and tight spacing. The rest feel interchangeable.

        Here's my proposal — and where I'd play it safe vs. take risks:

        AESTHETIC: Industrial/Utilitarian — data-first, every pixel earns its place
        TYPOGRAPHY: Geist (body + UI), Instrument Serif (display), JetBrains Mono (data)
        COLOR: Restrained — slate neutrals, single teal accent (#0D9488)
        SPACING: 4px base, compact density
        LAYOUT: Grid-disciplined, 12-column
        MOTION: Minimal-functional — only transitions that aid comprehension

        SAFE CHOICES (match category expectations):
          Geist for body — your users already know this font from Vercel
          Slate neutrals — warm grays feel right for data-heavy UIs
          Grid-disciplined layout — dashboards need predictable alignment

        RISKS (where you'd stand out):
          Instrument Serif for display headings — nobody in dev tools
            uses a serif. It creates instant hierarchy contrast and
            signals "we care about craft" in a space full of sans-serifs.
          Single teal accent instead of blue — everyone else in this space uses blue.
            Teal is close enough to feel trustworthy, different enough
            to be recognizable.
          4px compact density — tighter than Linear, says "we respect
            your screen real estate."

        The safe choices keep you literate. The risks are where your
        product gets its own face. Which risks appeal to you?

You:    Love the serif risk. Let's see it.

Claude: Preview opened in your browser.
        [/tmp/design-consultation-preview-1710000000.html]

        The page shows a realistic dashboard: sidebar nav, header with
        avatar, stat cards, data table — all in your design system.
        Instrument Serif at hero scale, Geist in body text, JetBrains
        Mono in the data table. Teal accent on buttons and active states.
        Light and dark mode toggle in the corner.

        How does it feel? Want to adjust anything before I write DESIGN.md?

You:    Ship it.

Claude: Wrote DESIGN.md (typography, color, spacing, layout, motion).
        Updated CLAUDE.md with design system guidelines.
        All future sessions will respect these choices.
```

---

## `/design-review`

This is my **designer who codes mode**.

`/plan-design-review` reviews your plan before implementation. `/design-review` audits and fixes the live site after.

It runs a visual audit on your live site in the browser supplied by your agent host, then enters a fix loop: for each confirmed finding, it locates the source file, makes a scoped change, reopens the page, and captures before/after evidence when the host supports screenshots.

The self-regulation heuristic is tuned for design work — CSS-only changes get a free pass (they are inherently safe and reversible), but changes to component JSX/TSX files count against the risk budget. Hard cap at 30 fixes. If the risk score exceeds 20%, it stops and asks.

**Design detector.** When you have [impeccable](https://impeccable.style) installed, its engine runs first: on a URL the page's rendered DOM is dumped (linked styles inlined) and scanned; on a feature branch with no URL the changed frontend files are scanned. Every mechanical finding arrives as a `FINDING-NNN` tagged with its rule id (`[nested-cards]`, `[low-contrast]`), and the report closes with `Detector: N → M`. gstack never runs impeccable's installer; when no engine is present it offers, once, to download the engine binary (checksum-pinned, logged in the egress ledger) and remembers the answer; without it the audit is unchanged. `gstack-config set design_detector off` disables the pre-pass.

### Example

```
You:   /design-review https://myapp.com

Claude: [Runs full 80-item visual audit on the live site]
        Design Score: C  |  AI Slop Score: D
        12 findings (4 high, 5 medium, 3 polish)

        Fixing 9 design issues...

        style(design): FINDING-001 — replace 3-column icon grid with asymmetric layout
        style(design): FINDING-002 — add heading scale 48/32/24/18/16
        style(design): FINDING-003 — remove gradient hero, use bold typography
        style(design): FINDING-004 — add second font for headings
        style(design): FINDING-005 — vary border-radius by element role
        style(design): FINDING-006 — left-align body text, reserve center for headings
        style(design): FINDING-007 — add hover/focus states to all interactive elements
        style(design): FINDING-008 — add prefers-reduced-motion media query
        style(design): FINDING-009 — set max content width to 680px for body text

        Final audit:
        Design Score: C → B+  |  AI Slop Score: D → A
        9 fixes applied (8 verified, 1 best-effort). 3 deferred.

        [Report with before/after screenshots saved to .gstack/design-reports/]
```

Nine commits, each touching one concern. The AI Slop score went from D to A because the three most recognizable patterns (gradient hero, 3-column grid, uniform radius) are gone.

---

## `/design-shotgun`

This is my **design exploration mode**.

You know the feeling. You have a feature, a page, a landing screen... and you're not sure what it should look like. You could describe it to Claude and get one answer. But one answer means one perspective, and design is a taste game. You need to see options.

`/design-shotgun` generates 3 visual design variants using the GPT Image API, opens a comparison board in your browser, and waits for your feedback. You pick a direction, request changes, or ask for entirely new variants. The board supports remix, regenerate, and approval actions.

### The loop

1. You describe what you want (or point at an existing page)
2. The skill reads your `DESIGN.md` for brand constraints (if it exists)
3. It generates 3 distinct design variants as PNGs
4. A comparison board opens in your browser with all 3 side-by-side
5. You click "Approve" on the one you like, or give feedback for another round
6. The approved variant saves to `~/.gstack/projects/$SLUG/designs/` with an `approved.json`

That `approved.json` is one way to feed `/design-html`. The design pipeline chains: shotgun picks the direction, design-html renders it as working code. But `/design-html` also works with CEO plans, design reviews, or just a description.

### Taste memory

The skill remembers your preferences across sessions. If you consistently prefer minimal designs over busy ones, it biases future generations. This isn't a setting you configure... it emerges from your approvals.

### Example

```
You:   /design-shotgun — hero section for a developer tools landing page

Claude: [Generates 3 variants]
        Variant A: Bold typography, dark background, code snippet hero
        Variant B: Split layout, product screenshot left, copy right
        Variant C: Minimal, centered headline, gradient accent

        [Opens comparison board at localhost:PORT]

You:    [Clicks "Approve" on Variant A in the browser]

Claude: Approved Variant A. Saved to ~/.gstack/projects/myapp/designs/
        Next: run /design-html to generate production HTML from this mockup.
```

---

## `/design-html`

This is my **design-to-code mode**.

Every AI code generation tool produces static CSS. Hardcoded heights. Text that overflows on resize. Breakpoints that snap instead of flowing. The output looks right at exactly one viewport size and breaks at every other.

`/design-html` fixes this. It generates HTML using [Pretext](https://github.com/chenglou/pretext) by Cheng Lou (ex-React core, Midjourney frontend). Pretext is a 15KB library that computes text layout without DOM measurement. Text reflows. Heights adjust to content. Cards size themselves. Chat bubbles shrinkwrap. All sub-millisecond, all dynamic.

It works with multiple input sources: an approved mockup from `/design-shotgun`, a CEO plan from `/plan-ceo-review`, design review context from `/plan-design-review`, a PNG you provide, or just a description of what you want. It detects what context exists and asks how you want to proceed.

### Smart API routing

Not every page needs the full Pretext engine. The skill reads the design and picks the right tools:

- **Simple layouts** (landing, marketing): `prepare()` + `layout()` for resize-aware heights
- **Card grids** (dashboard, listing): `prepare()` + `layout()` for self-sizing cards
- **Chat UIs**: `walkLineRanges()` for tight-fit bubbles with zero wasted pixels
- **Editorial layouts**: `layoutNextLine()` for text flowing around obstacles
- **Complex editorial**: Full engine with `layoutWithLines()` for manual line rendering

### The refinement loop

1. Reads the approved mockup from `approved.json`
2. Uses GPT-4o vision to extract implementation spec (colors, typography, layout)
3. Generates self-contained HTML with Pretext inlined (15KB, zero network dependency)
4. Spins up a live-reload server so you see changes instantly
5. Screenshots at 3 viewports (mobile, tablet, desktop) to verify layout
6. AskUserQuestion: what needs to change?
7. Surgical edits via the Edit tool (not full regeneration)
8. Repeat until you say "done"

**Slop gate.** If you have [impeccable](https://impeccable.style) installed, the finalized page gets one scan through its engine before the verification screenshots: findings trigger a single surgical fix pass over the non-advisory rules, then one more scan. Whatever remains is presented as accepted-with-reason (the approved mockup contains it, `DESIGN.md` blesses it, or you agreed to an inline `impeccable-disable` comment). One pass, never a loop; without impeccable the step is skipped silently. The skill's never-include list carries the same rule ids the detector reports, from `lib/design-catalog.ts`.

### Framework detection

If your project uses React, Svelte, or Vue (detected from `package.json`), the skill offers to generate a framework component instead of vanilla HTML. Framework output uses `npm install @chenglou/pretext` instead of inline vendoring.

### Example

```
You:   /design-html

Claude: Found approved mockup: variant-A.png (hero section)
        Design type: simple layout → using prepare() + layout()

        [Generates HTML with Pretext, opens live-reload server]
        [Screenshots at 375px, 768px, 1440px — all verified]

        The HTML is live at localhost:3456. Resize your browser.
        Text reflows dynamically. What needs to change?

You:    Make the headline bigger and add more spacing below the CTA

Claude: [Edits font-size and margin, browser auto-reloads]
        Updated. Two changes applied.

You:    Done

Claude: Saved to ~/.gstack/projects/myapp/designs/hero-20260330/finalized.html
```

---

## `/review`

This is my **paranoid staff engineer mode**.

Passing tests do not mean the branch is safe.

`/review` exists because there is a whole class of bugs that can survive CI and still punch you in the face in production. This mode is not about dreaming bigger. It is not about making the plan prettier. It is about asking:

**What can still break?**

This is a structural audit, not a style nitpick pass. I want the model to look for things like:

* N+1 queries
* stale reads
* race conditions
* bad trust boundaries
* missing indexes
* escaping bugs
* broken invariants
* bad retry logic
* tests that pass while missing the real failure mode
* forgotten enum handlers — add a new status or type constant, and `/review` traces it through every switch statement and allowlist in your codebase, not just the files you changed

### Fix-First

Findings get action, not just listed. Obvious mechanical fixes (dead code, stale comments, N+1 queries) are applied automatically — you see `[AUTO-FIXED] file:line Problem → what was done` for each one. Genuinely ambiguous issues (security, race conditions, design decisions) get surfaced for your call.

### Completeness gaps

`/review` now flags shortcut implementations where the complete version costs less than 30 minutes of CC time. If you chose the 80% solution and the 100% solution is a lake, not an ocean, the review will call it out.

One exception: a shortcut you took deliberately and logged. A `gstack-shortcut(dec-<id>)` marker whose decision id resolves in the decision ledger downgrades the finding to acknowledged debt. An orphan marker — one with no ledger entry behind it — doesn't suppress anything; the gap is reported normally and the marker itself gets flagged.

**Design pass.** When the diff touches frontend files, the Design specialist reads `review/design-checklist.md`, which is generated from `lib/design-catalog.ts`, so `/review`, `/ship`, and `/design-review` flag the same patterns under the same rule ids. If you have [impeccable](https://impeccable.style) installed, its engine scans the changed frontend files first: its rows bucket by tier (auto-fix, ask, possible), a detector hit and a checklist hit at the same file:line collapse into one row, and your repo's `.impeccable/config*.json` ignores are read as settled decisions. Without it, the checklist pass runs alone.

### Example

Suppose the smart listing flow is implemented and the tests are green.

`/review` should still ask:

* Did I introduce an N+1 query when rendering listing photos or draft suggestions?
* Am I trusting client-provided file metadata instead of validating the actual file?
* Can two tabs race and overwrite cover-photo selection or item details?
* Do failed uploads leave orphaned files in storage forever?
* Can the "exactly one hero image" rule break under concurrency?
* If enrichment APIs partially fail, do I degrade gracefully or save garbage?
* Did I accidentally create a prompt injection or trust-boundary problem by pulling web data into draft generation?

That is the point of `/review`.

I do not want flattery here.
I want the model imagining the production incident before it happens.

---

## `/investigate`

When something is broken and you don't know why, `/investigate` is your systematic debugger. It follows the Iron Law: **no fixes without root cause investigation first.**

Instead of guessing and patching, it traces data flow, matches against known bug patterns, and tests hypotheses one at a time. If three fix attempts fail, it stops and questions the architecture instead of thrashing. This prevents the "let me try one more thing" spiral that wastes hours.

---

## `/qa`

This is my **QA lead mode**.

`/browse` gives the agent eyes. `/qa` gives it a testing methodology.

The most common use case: you're on a feature branch and want to verify the changed pages. `/qa` reads the diff, identifies affected routes, and tests them in the browser supplied by your agent host. No URL is needed when it can find the running app.

Four modes:

- **Diff-aware** (automatic on feature branches) — reads `git diff main`, identifies affected pages, tests them specifically
- **Full** — systematic exploration of the entire app. 5-15 minutes. Documents 5-10 well-evidenced issues.
- **Quick** (`--quick`) — 30-second smoke test. Homepage + top 5 nav targets.
- **Regression** (`--regression baseline.json`) — run full mode, then diff against a previous baseline.

### Automatic regression tests

When `/qa` fixes a bug and verifies it, it automatically generates a regression test that catches the exact scenario that broke. Tests include full attribution tracing back to the QA report.

### Example

```
You:   /qa https://staging.myapp.com

Claude: [Explores 12 pages, fills 3 forms, tests 2 flows]

        QA Report: staging.myapp.com — Health Score: 72/100

        Top 3 Issues:
        1. CRITICAL: Checkout form submits with empty required fields
        2. HIGH: Mobile nav menu doesn't close after selecting an item
        3. MEDIUM: Dashboard chart overlaps sidebar below 1024px

        [Full report with screenshots saved to .gstack/qa-reports/]
```

**Testing authenticated pages:** The host must connect to the browser profile you use. If `/qa` hits a sign-in wall, sign in yourself in that browser and tell the agent when to continue.

---

## `/ship`

This is my **release machine mode**.

Once I have decided what to build, nailed the technical plan, and run a serious review, I do not want more talking. I want execution.

`/ship` is for the final mile. It is for a ready branch, not for deciding what to build.

This is where the model should stop behaving like a brainstorm partner and start behaving like a disciplined release engineer: sync with main, run the right tests, make sure the branch state is sane, update changelog or versioning if the repo expects it, push, and create or update the PR.

### Test bootstrap

If your project doesn't have a test framework, `/ship` sets one up — detects your runtime, researches the best framework, installs it, writes 3-5 real tests for your actual code, sets up CI/CD (GitHub Actions), and creates TESTING.md. 100% test coverage is the goal — tests make vibe coding safe instead of yolo coding.

### Coverage audit

Every `/ship` run builds a code path map from your diff, searches for corresponding tests, and produces an ASCII coverage diagram with quality stars. Gaps get tests auto-generated. Your PR body shows the coverage: `Tests: 42 → 47 (+5 new)`.

### Review gate

`/ship` checks the [Review Readiness Dashboard](#review-readiness-dashboard) before creating the PR. If the Eng Review is missing, it asks — but won't block you. Decisions are saved per-branch so you're never re-asked.

A lot of branches die when the interesting work is done and only the boring release work is left. Humans procrastinate that part. AI should not.

### Third-party web actions (v1.72.0.0+)

Sometimes release work needs a vendor dashboard. `/ship` and the related release skills use the browser capability supplied by the agent host for the browser and profile you use. If the host cannot reach it, they give you the specific manual step.

The agent uses authorization already given for the named site and actions, and asks when it is missing. Passwords, payment, CAPTCHAs, and identity verification stay yours; Apple credential creation is never a drive target. A captured secret stays out of chat and lands only in an owner-only file or your secret store.

---

## `/land-and-deploy`

This is my **deploy pipeline mode**.

`/ship` creates the PR. `/land-and-deploy` finishes the job: merge, deploy, verify.

It confirms PR readiness and your merge approval, merges, then monitors CI and deployment before checking production. If deployment breaks, it reports what failed and whether rollback is available. If the new revision's deployment cannot be confirmed, it reports that uncertainty rather than treating a healthy old page as proof.

The first run, or a changed deployment configuration, triggers a dry-run walk-through so you can verify the pipeline before anything irreversible happens. An unchanged, previously confirmed configuration skips that walkthrough, not readiness checks or merge approval. Approval is bound to the exact PR head and destination branch; changing either requires fresh readiness and approval.

### Setup

Run `/setup-deploy` first. It detects your platform (Fly.io, Render, Vercel, Netlify, Heroku, GitHub Actions, or custom), discovers your production URL and health check endpoints, and writes the config to CLAUDE.md. One-time, 60 seconds.

### Example

```
You:   /land-and-deploy

Claude: Merging PR #42...
        CI: 3/3 checks passed
        Deploy: Fly.io — deploying v2.1.0...
        Health check: https://myapp.fly.dev/health → 200 OK
        Canary: 5 pages checked, 0 console errors, p95 < 800ms

        Production verified. v2.1.0 is live.
```

---

## `/canary`

This is my **post-deploy monitoring mode**.

After deploy, `/canary` checks key pages in the browser supplied by your agent host for console errors, performance regressions, page failures, and visual anomalies. It captures screenshots when the host supports them and compares with available pre-deploy baselines.

Use it right after `/land-and-deploy`, or schedule it to run periodically after a risky deploy.

```
You:   /canary https://myapp.com

Claude: Monitoring 8 pages every 2 minutes...

        Cycle 1: ✓ All pages healthy. p95: 340ms. 0 console errors.
        Cycle 2: ✓ All pages healthy. p95: 380ms. 0 console errors.
        Cycle 3: ⚠ /dashboard — new console error: "TypeError: Cannot read
                   property 'map' of undefined" at dashboard.js:142
                 Screenshot saved.

        Alert: 1 new console error after 3 monitoring cycles.
```

---

## `/deslop-shared-libs`

Find shared code worth extracting from recent work. By default, the skill reviews
the preceding 14 UTC days of commits and PRs, plus relevant current-branch work.
It checks existing helpers, verifies compatible authored callers, and compares
up to five new opportunities before recommending up to three. Estimates include
tests and integration, so moving code into a new file does not count as savings.
Fewer recommendations, including none, are valid.

```text
You: /deslop-shared-libs
You: /deslop-shared-libs — focus on the API and workers over the past 30 days
```

The report links the reviewed source, names the smallest useful helper and its
callers, explains reliability gains and shared-failure risks, and separates work
already covered by PRs. It checks older open PRs for candidate overlap within a
bounded scan and discloses inaccessible history or incomplete coverage. It reads
raw uncommitted source without running project hooks or filters. It never edits
code, runs project tests, saves a report, or creates issues or PRs.

`/plan-eng-review` applies the same criteria to the plan and proposed callers.
`/review` checks the diff and related callers even on tiny changes. These scoped
checks do not run the history audit. Optional extractions are advisory and require
approval; they do not block a clean review or reduce its score. Actual defects
keep their normal fix handling.

## `/benchmark`

This is my **performance engineer mode**.

`/benchmark` establishes performance baselines for your pages: load time, Core Web Vitals (LCP, CLS, INP), resource counts, and total transfer size. Run it before and after a PR to catch regressions.

It measures in your host-provided browser when performance entries are available. Multiple runs are averaged and results persist for comparison across PRs.

```
You:   /benchmark https://myapp.com

Claude: Benchmarking 5 pages (3 runs each)...

        /           load: 1.2s  LCP: 0.9s  CLS: 0.01  resources: 24 (890KB)
        /dashboard  load: 2.1s  LCP: 1.8s  CLS: 0.03  resources: 31 (1.4MB)
        /settings   load: 0.8s  LCP: 0.6s  CLS: 0.00  resources: 18 (420KB)

        Baseline saved. Run again after changes to compare.
```

---

## `/document-release`

This is my **technical writer mode**.

After `/ship` creates the PR but before it merges, `/document-release` reads every documentation file in the project and cross-references it against the diff. It updates file paths, command lists, project structure trees, and anything else that drifted. Risky or subjective changes get surfaced as questions — everything else is handled automatically.

```
You:   /document-release

Claude: Analyzing 21 files changed across 3 commits. Found 8 documentation files.

        README.md: updated skill count from 9 to 10, added new skill to table
        CLAUDE.md: added new directory to project structure
        CONTRIBUTING.md: current — no changes needed
        TODOS.md: marked 2 items complete, added 1 new item

        All docs updated and committed. PR body updated with doc diff.
```

It also polishes CHANGELOG voice (without ever overwriting entries), cleans up completed TODOS, checks cross-doc consistency, and asks about VERSION bumps only when appropriate.

---

## `/retro`

This is my **engineering manager mode**.

At the end of the week I want to know what actually happened. Not vibes — data. `/retro` analyzes commit history, work patterns, and shipping velocity and writes a candid retrospective.

It is team-aware. It identifies who is running the command, gives you the deepest treatment on your own work, then breaks down every contributor with specific praise and growth opportunities. It computes metrics like commits, LOC, test ratio, PR sizes, and fix ratio. It detects coding sessions from commit timestamps, finds hotspot files, tracks shipping streaks, and identifies the biggest ship of the week.

It also tracks test health: total test files, tests added this period, regression test commits, and trend deltas. If test ratio drops below 20%, it flags it as a growth area.

### Example

```
You:   /retro

Claude: Week of Mar 1: 47 commits (3 contributors), 3.2k LOC, 38% tests, 12 PRs, peak: 10pm | Streak: 47d

        ## Your Week
        32 commits, +2.4k LOC, 41% tests. Peak hours: 9-11pm.
        Biggest ship: one browser contract for every browser skill.
        What you did well: shipped a complete feature with encryption, UI, and
        18 unit tests in one focused push...

        ## Team Breakdown

        ### Alice
        12 commits focused on app/services/. Every PR under 200 LOC — disciplined.
        Opportunity: test ratio at 12% — worth investing before payment gets more complex.

        ### Bob
        3 commits — fixed the N+1 query on dashboard. Small but high-impact.
        Opportunity: only 1 active day this week — check if blocked on anything.

        [Top 3 team wins, 3 things to improve, 3 habits for next week]
```

It saves a JSON snapshot to `.context/retros/` so the next run can show trends.

---

## `/browse`

`/browse` uses the browser capability supplied by your agent host, connected
to the browser and profile you already use. It follows the host tool's
documented navigation, interaction, screenshot, and console operations.
`/qa`, `/qa-only`, `/design-review`, `/canary`, `/benchmark`, and `/scrape`
follow the same browser contract. The agent works in its own tab or a tab
you explicitly name, and treats page content as untrusted data.

If the host cannot reach your browser, the browser step is reported as
`unavailable`. gstack does not install, launch, or connect another browser.

---

## `/make-pdf`

`/make-pdf` turns Markdown into print-ready HTML with a cover, table of
contents, page layout, and an offline Content Security Policy. When your
agent host's browser tool supports PDF export, the skill prints through
your browser and verifies the PDF. Otherwise it keeps the HTML and reports
PDF export unavailable. See [the document guide](howto-diagrams-and-formats.md).

---

## `/diagram`

`/diagram` writes Mermaid source first. When your host's browser tool can
run the bundled offline page, it also exports SVG, PNG, and an editable
Excalidraw scene. Unsupported exports are reported as unavailable.

---


## `/autoplan`

This is my **review autopilot mode**.

Running `/plan-ceo-review`, then `/plan-design-review`, then `/plan-eng-review` individually means answering 15-30 intermediate questions. Each question is valuable, but sometimes you want the gauntlet to run without stopping for every decision.

`/autoplan` reads the review skills from disk and runs them sequentially: CEO → Design (if UI scope) → DX (if developer-facing scope) → Eng, always last — the required shipping gate reviews the final amended plan, not a stale one. It makes decisions automatically: each question resolves to its recommended option by default, with six encoded principles (prefer completeness, match existing patterns, choose reversible options, prefer the option the user chose for similar past decisions, defer ambiguous items, and escalate security) breaking ties and deciding questions that carry no recommendation. Taste decisions (close approaches, borderline scope expansions, cross-model disagreements) get saved and presented at a final approval gate.

One command, fully reviewed plan out.

```
You:   /autoplan

Claude: Running CEO review... [4 scope decisions auto-resolved]
        Running design review... [3 design dimensions auto-scored]
        Running eng review... [2 architecture decisions auto-resolved]

        TASTE DECISIONS (need your input):
        1. Scope: A reviewer suggested adding search — borderline expansion. Add?
        2. Design: Two approaches scored within 1 point. Which feels right?

        [Shows both options with context]

You:    1) Yes, add search. 2) Option A.

Claude: Plan complete. 9 decisions auto-resolved, 2 taste decisions approved.
```

---

## `/learn`

This is my **institutional memory mode**.

gstack learns from every session. Patterns, pitfalls, preferences, architectural decisions... they accumulate in `~/.gstack/projects/$SLUG/learnings.jsonl`. Each learning has a confidence score, source attribution, and the files it references.

`/learn` lets you see what gstack has absorbed, search for specific patterns, prune stale entries (when referenced files no longer exist), and export learnings for team sharing. The real magic is in other skills... they automatically search learnings before making recommendations, and display "Prior learning applied" when a past insight is relevant.

```
You:   /learn

Claude: 23 learnings for this project (14 high confidence, 6 medium, 3 low)

        Top patterns:
        - [9/10] API responses always wrapped in { data, error } envelope
        - [8/10] Tests use factory helpers in test/support/factories.ts
        - [8/10] All DB queries go through repository pattern, never direct

        3 potentially stale (referenced files deleted):
        - "auth middleware uses JWT" — auth/middleware.ts was deleted
        [Prune these? Y/N]
```

---

## `/setup-deploy`

One-time deploy configuration. Run this before your first `/land-and-deploy`.

It auto-detects your deploy platform (Fly.io, Render, Vercel, Netlify, Heroku, GitHub Actions, or custom), discovers your production URL, health check endpoints, and deploy status commands. Writes everything to CLAUDE.md so all future deploys are automatic.

```
You:   /setup-deploy

Claude: Detected: Fly.io (fly.toml found)
        Production URL: https://myapp.fly.dev
        Health check: /health → expects 200
        Deploy command: fly deploy
        Status command: fly status

        Written to CLAUDE.md. Run /land-and-deploy when ready.
```

---

## Safety & Guardrails

Four skills that add safety rails to any Claude Code session. They work via Claude Code's PreToolUse hooks — transparent, session-scoped, no configuration required.

### `/careful`

Say "be careful" or run `/careful` when you're working near production, running destructive commands, or just want a safety net. Every Bash command gets checked against known-dangerous patterns:

- `rm -rf` / `rm -r` — recursive delete
- `DROP TABLE` / `DROP DATABASE` / `TRUNCATE` — data loss
- `git push --force` / `git push -f` — history rewrite
- `git reset --hard` — discard commits
- `git checkout .` / `git restore .` — discard uncommitted work
- `kubectl delete` — production resource deletion
- `docker rm -f` / `docker system prune` — container/image loss

Common build artifact cleanups (`rm -rf node_modules`, `dist`, `.next`, `__pycache__`, `build`, `coverage`) are whitelisted — no false alarms on routine operations.

You can override any MEDIUM warning. Two catastrophic shapes are hard-denied instead of asked: recursive deletes of the filesystem root or your home directory (including the `/*`, `~/`, and `$HOME/` forms), and force-pushes to the repo's default branch (`--force-with-lease` never triggers the deny; the escape hatch is ending the session-scoped `/careful` session). You can also add your own warn rules — one POSIX ERE per line — in `~/.gstack/careful-patterns.txt` (global) or `~/.gstack/projects/<slug>/careful-patterns.txt` (per-project); custom patterns only ever add warnings, never suppress the built-ins. The guardrails are accident prevention, not access control.

### `/freeze`

Restrict all file edits to a single directory. When you're debugging a billing bug, you don't want Claude accidentally "fixing" unrelated code in `src/auth/`. `/freeze src/billing` blocks all Edit and Write operations outside that path.

`/investigate` activates this automatically — it detects the module being debugged and freezes edits to that directory.

```
You:   /freeze src/billing

Claude: Edits restricted to src/billing/. Run /unfreeze to remove.

        [Later, Claude tries to edit src/auth/middleware.ts]

Claude: BLOCKED — Edit outside freeze boundary (src/billing/).
        Skipping this change.
```

Note: this blocks Edit and Write tools only. Bash commands like `sed` can still modify files outside the boundary — it's accident prevention, not a security sandbox.

### `/guard`

Full safety mode — combines `/careful` + `/freeze` in one command. Destructive command warnings plus directory-scoped edits. Use when touching prod or debugging live systems.

### `/unfreeze`

Remove the `/freeze` boundary, allowing edits everywhere again. The hooks stay registered for the session — they just allow everything. Run `/freeze` again to set a new boundary.

---

## `/gstack-upgrade`

Keep gstack current with one command. It detects your install type (global at `~/.claude/skills/gstack` vs vendored in your project at `.claude/skills/gstack`), runs the upgrade, syncs both copies if you have dual installs, and shows you what changed.

```
You:   /gstack-upgrade

Claude: Current version: 0.7.4
        Latest version: 0.8.2

        What's new:
        - Browser skills use the browser supplied by your agent host
        - /qa always uses browser now
        - Safety skills: /careful, /freeze, /guard
        - Proactive skill suggestions

        Upgraded to 0.8.2. Both global and project installs synced.
```

Set `auto_upgrade: true` in `~/.gstack/config.yaml` to skip the prompt entirely — gstack upgrades silently at the start of each session when a new version is available.

---

## Greptile integration

[Greptile](https://greptile.com) is a YC company that reviews your PRs automatically. It catches real bugs — race conditions, security issues, things that pass CI and blow up in production. It has genuinely saved my ass more than once. I love these guys.

### Setup

Install Greptile on your GitHub repo at [greptile.com](https://greptile.com) — it takes about 30 seconds. Once it's reviewing your PRs, gstack picks up its comments automatically. No additional configuration.

### How it works

The problem with any automated reviewer is triage. Greptile is good, but not every comment is a real issue. Some are false positives. Some flag things you already fixed three commits ago. Without a triage layer, the comments pile up and you start ignoring them — which defeats the purpose.

gstack solves this. `/review` and `/ship` are now Greptile-aware. They read Greptile's comments, classify each one, and take action:

- **Valid issues** get added to the critical findings and fixed before shipping
- **Already-fixed issues** get an auto-reply acknowledging the catch
- **False positives** get pushed back — you confirm, and a reply goes out explaining why it's wrong

The result is a two-layer review: Greptile catches things asynchronously on the PR, then `/review` and `/ship` triage those findings as part of the normal workflow. Nothing falls through the cracks.

### Learning from history

Every false positive you confirm gets saved to `~/.gstack/greptile-history.md`. Future runs auto-skip known FP patterns for your codebase. And `/retro` tracks Greptile's batting average over time — so you can see whether the signal-to-noise ratio is improving.

### Example

```
You:   /ship

Claude: [syncs main, runs tests, pre-landing review...]

        Greptile found 3 comments on this PR:

        [VALID] app/services/payment_service.rb:47 — Race condition:
        concurrent charges can double-debit. Recommend DB-level advisory
        lock around the charge block.

        [ALREADY FIXED] app/models/user.rb:12 — Missing null check
        on email before downcase.
        → Already fixed in commit abc1234. Auto-replying.

        [FALSE POSITIVE] lib/auth.rb:88 — "Token comparison should
        use constant-time comparison." We already use
        ActiveSupport::SecurityUtils.secure_compare here.

        Fixing the race condition in payment_service.rb...

        The auth token comment is a false positive.
        Options: A) Reply to Greptile explaining  B) Fix anyway  C) Ignore

You:    A

Claude: Replied to Greptile. All tests pass.
        PR: github.com/you/app/pull/42
```

Three Greptile comments. One real fix. One auto-acknowledged. One false positive pushed back with a reply. Total extra time: about 30 seconds.

---

## `/ios-qa`

Live-device iOS QA. The fork's load-bearing insight was: don't simulate, don't run XCTest, don't bring up WebDriverAgent. Embed an HTTP server in the app under test, drive it from a Mac-side daemon over the USB CoreDevice IPv6 tunnel.

The agent reads your Swift source, finds `@Observable` classes with `@Snapshotable`-marked fields, codegens typed accessors, deploys a debug bridge, then runs a closed find→fix→verify loop.

### Architecture in one diagram

```
       ┌──────────────────────┐   USB CoreDevice (IPv6)   ┌──────────────────┐
       │ gstack-ios-qa daemon │ ────────────────────────▶ │ iOS app          │
       │ (Mac, bun/TS)        │   bearer + X-Session-Id   │ StateServer      │
       │ - rotates boot token │                           │ (loopback only)  │
       │ - mints session toks │                           └──────────────────┘
       │ - capability tiers   │
       │ - audit + redact     │
       └──────────────────────┘
                ▲
                │ Tailscale (optional, --tailnet)
                │
       ┌──────────────────────┐
       │ Remote agent         │
       │ (OpenClaw, etc.)     │
       └──────────────────────┘
```

The iOS app's `StateServer` binds loopback only (`::1` + `127.0.0.1`). The Mac daemon owns tailnet identity validation, capability tiers, and the audit trail. Remote agents NEVER see the boot token — only short-lived session tokens (1h default, 24h hard cap) minted via Tailscale identity gating.

### The unlock: USB-tethered + Tailscale = remote iOS QA from any agent

A Mac plus an iPhone you already own plus the Tailscale free tier replaces what most teams pay BrowserStack/Sauce Labs for. Any HTTP-capable agent on your tailnet can drive the iOS app once you've minted them a session token. Tailscale ACLs scope which identities can reach the Mac at which capability tier.

See `ios-qa/docs/tailscale-acl-example.md` for the runnable setup.

### Capability tiers

| Tier | Endpoints |
|------|-----------|
| observe | `/screenshot`, `/elements`, `GET /state/*`, `/state/snapshot`, `/healthz` |
| interact | observe + `/tap`, `/swipe`, `/type`, `/session/*` |
| mutate | interact + `POST /state/<key>` |
| restore | mutate + `POST /state/restore` |

Default minted tokens get `interact`. Higher tiers require explicit owner mint.

---

## `/ios-fix`

Iron Law: no fix without a reproducing snapshot. The agent captures pre-bug state via `GET /state/snapshot`, writes the fix, rebuilds, redeploys, restores the snapshot, and verifies the bug is gone. The snapshot becomes a regression test fixture so the bug can't recur silently.

Mirrors `/qa`'s find-bug → fix → re-verify loop for iOS.

---

## `/ios-design-review`

Designer's-eye QA on a real iPhone. Connects to the same `/ios-qa` daemon in observe-tier mode and screenshots every screen. Scores 10 dimensions 0-10: typography hierarchy, spacing rhythm, color hierarchy, touch targets, loading/empty/error states, accessibility, animation discipline, iOS idiom alignment, information density, AI-slop check.

For each score < 7, uses AskUserQuestion to present the issue with recommended fix.

---

## `/ios-clean`

Convenience wrapper. The structural Release-build guard against shipping DebugBridge is in `Package.swift` (`.when(configuration: .debug)`) plus a CI invariant test. `/ios-clean` is for developers who want a guided removal flow or who manually added the SPM dependency without going through `/ios-qa`.

---

## `/ios-sync`

Run after upgrading gstack or adding new `@Observable` classes. Detects what's installed, runs gen-accessors against the latest upstream templates, refreshes any changed Swift files, verifies the app rebuilds. Cache-key invalidation handles Swift version changes, generator git rev changes, and source changes.
