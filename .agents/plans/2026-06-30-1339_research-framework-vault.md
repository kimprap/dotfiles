# Research Framework Vault Skill Implementation Plan

**Datetime**: 2026-06-30-1339
**Scope**: `vault://atlas/` research-library architecture, `.config/agents/skills/digest/` instructions/templates, and starter indexes/manifests under `vault://atlas/summaries/`.
**Summary**: Refine the research vault into an agent-first “atlas” with a stable `ARCHITECTURE.md` source of truth, source-summary dedupe, vault-only topic synthesis, optional acquisition-first refresh, lean topic files, and future-proof schema/versioning hooks. Source artifacts are time-bucketed evidence; research topics are deterministic answer contracts backed by source artifacts.
**Status**: PENDING

## Context

This revision incorporates the user's latest framework decisions:

- The parent vault/root has already been renamed to `atlas`; implementation should verify `vault://atlas/` resolves and must not create a duplicate `digest` root.
- `vault://atlas/todos/` is a legacy folder and must not be removed, renamed, cleaned up, or treated as part of the new summaries architecture.
- Source artifacts should not be domain/subdomain organized. Domains and subdomains belong in frontmatter, tags, indexes, and research links.
- A single `summaries/sources/MANIFEST.md` is acceptable for expected scale. If it eventually grows beyond practical lookup size, shard later without changing source artifact identity.
- Per-topic folders should be lean: one canonical topic `INDEX.md` plus immutable dated passes by default. Extra split files are created only when thresholds are met.
- `ARCHITECTURE.md` should be the comprehensive source of truth for the framework. Future agents improving or using the framework should read it before making decisions.
- `ARCHITECTURE.md` should end with a succinct framework philosophy so future changes preserve the lean, robust, deterministic, and flexible design intent.
- Skills relevant to the framework will be created separately. This plan must make the vault architecture self-explanatory enough that future skills can rely on `ARCHITECTURE.md` instead of hallucinating conventions.

Decision: keep source ingestion, source acquisition, research synthesis, answer lookup, and rollups as separate modes with narrow file ownership. Research synthesis is vault-only by default. Live web search is allowed only in acquisition-first mode, where new web results must first become source-summary artifacts before they can affect topic research.

## Tasks

- [ ] T1. Verify `vault://atlas/` resolves and preserve legacy `vault://atlas/todos/` without removing, renaming, or migrating it.
- [ ] T2. Establish `vault://atlas/ARCHITECTURE.md` as the framework source of truth, covering layout, artifact roles, mode ownership, schema/versioning, dedupe, split thresholds, future migration policy, and framework philosophy.
- [ ] T3. Rewrite `.config/agents/skills/digest/SKILL.md` so the current entrypoint reads `vault://atlas/ARCHITECTURE.md`, uses `vault://atlas/summaries/`, and defines source digest, acquisition, vault-only research, acquisition-first research, and rollup modes.
- [ ] T4. Revise `.config/agents/skills/digest/assets/source-summary-template.md` so source summaries include canonical URL identity, dedupe metadata, refresh metadata, and shared assessment signals.
- [ ] T5. Create `.config/agents/skills/digest/assets/research-library-templates.md` with templates for subdomain indexes, topic `INDEX.md`, dated passes, optional split files, and source acquisition run logs.
- [ ] T6. Create starter vault files at `vault://atlas/summaries/INDEX.md`, `vault://atlas/summaries/sources/MANIFEST.md`, `vault://atlas/summaries/sources/INDEX.md`, and `vault://atlas/summaries/research/INDEX.md` without pre-creating empty domains, subdomains, or topics, while preserving `vault://atlas/todos/`.
- [ ] T7. Verify the revised architecture, skill instructions, templates, source dedupe flow, topic split rules, legacy todos preservation, and smoke-test behavior.

## Verification / Done criteria

- [ ] `read vault://atlas/` confirms the Atlas vault root resolves.
- [ ] `read vault://atlas/todos/` confirms the legacy todos folder still exists and was not removed or migrated.
- [ ] `read vault://atlas/ARCHITECTURE.md` shows the sections `Framework invariants`, `Directory layout`, `Artifact roles`, `Mode ownership`, `Source identity and dedupe`, `Topic routing`, `Topic split policy`, `Managed sections`, `Schema migration`, `Future skill contract`, and `Framework philosophy`.
- [ ] The end of `vault://atlas/ARCHITECTURE.md` succinctly states the philosophy: lean default structure, robust provenance, deterministic answers, vault-only synthesis by default, optional expansion by threshold, and schema/versioned flexibility for future framework changes.
- [ ] `read .config/agents/skills/digest/SKILL.md` says to read `vault://atlas/ARCHITECTURE.md` before changing framework behavior.
- [ ] `read .config/agents/skills/digest/SKILL.md` shows the source artifact root as `vault://atlas/summaries/sources/artifacts/<YYYY>/<YYYY-MM>/`.
- [ ] `grep` on `.config/agents/skills/digest/SKILL.md` for `vault://digest` returns no matches.
- [ ] `read .config/agents/skills/digest/assets/source-summary-template.md` shows frontmatter keys for `source_id`, `canonical_url`, `content_hash`, `first_seen`, `last_checked`, `last_summarized`, `refresh_after`, `primary_domain`, `subdomains`, `evidence_strength`, `practicality`, `stability`, `reuse_value`, and `recommended_posture`.
- [ ] `read .config/agents/skills/digest/assets/research-library-templates.md` shows template headings for `SUBDOMAIN-INDEX.md`, `TOPIC-INDEX.md`, `passes/YYYY-MM-DD--<pass-slug>.md`, `optional/SOURCES.md`, `optional/DECISIONS.md`, `optional/HISTORY.md`, and `sources/runs/YYYY-MM-DD--<run-slug>.md`.
- [ ] `read vault://atlas/summaries/sources/MANIFEST.md` shows a canonical URL/source-id table with columns for `Source ID`, `Canonical URL`, `Artifact`, `First seen`, `Last checked`, `Last summarized`, `Content hash`, `Refresh after`, and `Status`.
- [ ] `read vault://atlas/summaries/research/INDEX.md` states that research subdomains live under `<domain>/<subdomain>/`, each subdomain has `INDEX.md`, and durable topics live under `topics/<topic-slug>/INDEX.md`.
- [ ] Source smoke test: invoke `/digest https://github.com/karpathy/autoresearch` or explicitly prompt the agent to use the `digest` skill on that URL. Expected result: one source artifact appears under `vault://atlas/summaries/sources/artifacts/<current-year>/<current-year-month>/`, the manifest gains one row keyed by canonical URL/source-id, and repeating the same URL skips duplicate summarization.
- [ ] Vault-only research smoke test: after at least one relevant source artifact exists, invoke `/digest research --vault-only programmatic agent engineering`. Expected result: topic files appear under `vault://atlas/summaries/research/agentic-development/agent-research/topics/programmatic-agent-engineering/`; no raw web URL is cited unless a corresponding source artifact exists; any insufficiency is recorded as `coverage_state: partial|insufficient` instead of overclaiming.
- [ ] Acquisition-first smoke test: invoke `/digest research --acquire "best way to create sourdough"` or explicitly ask for research with acquisition allowed. Expected result: new source summaries are created first under `sources/artifacts/...`; the topic synthesis under `research/cooking/bread/topics/sourdough-method/INDEX.md` links to those source artifacts.

## Approach

### T1. Verify Atlas root and preserve legacy todos

Before writing framework files, verify `vault://atlas/` resolves. The user has already renamed the vault/root from `digest` to `atlas`; implementation should treat `atlas` as canonical and should not create a duplicate `digest` root.

Also verify `vault://atlas/todos/` exists. This is a legacy folder. Do not remove, rename, migrate, clean, or fold it into `summaries/`. The new framework may leave it untouched and may mention it in `ARCHITECTURE.md` only as legacy state.

### T2. Establish `ARCHITECTURE.md`

Create `vault://atlas/ARCHITECTURE.md` as the source of truth for the framework. Future agents that use, audit, or improve the research framework must read this file before changing behavior.

`ARCHITECTURE.md` must include these sections:

```md
# Atlas Architecture

## Framework invariants
## Directory layout
## Artifact roles
## Mode ownership
## Source identity and dedupe
## Source refresh policy
## Topic routing
## Topic split policy
## Managed sections
## Schema migration
## Future skill contract
## Framework philosophy
```

Required invariants:

- Source artifacts are evidence snapshots and are stored by time, not by domain/subdomain.
- Research topics are deterministic answer contracts backed by source artifacts.
- Research synthesis is vault-only unless the caller explicitly chooses acquisition-first mode.
- Acquisition-first mode must materialize source artifacts before synthesis.
- Indexes route agents to the right artifact; they must not duplicate full research bodies.
- Topic folders start lean and split only when thresholds are met.
- Every managed artifact has `schema_version`, `note_type`, and `managed_by: atlas`.
- Future skills are separate from this plan; they should rely on `ARCHITECTURE.md` and the artifact contracts instead of inventing conventions.
- `vault://atlas/todos/` is legacy state. Preserve it unchanged; do not make it part of the managed summaries architecture.

Directory layout:

```text
vault://atlas/
├── ARCHITECTURE.md
├── todos/                 # legacy; preserve untouched
└── summaries/
    ├── INDEX.md
    ├── domains/
    │   └── <domain>.md
    ├── sources/
    │   ├── INDEX.md
    │   ├── MANIFEST.md
    │   ├── runs/
    │   │   └── <YYYY>/
    │   │       └── <YYYY-MM>/
    │   │           └── <YYYY-MM-DD>--<run-slug>.md
    │   └── artifacts/
    │       └── <YYYY>/
    │           └── <YYYY-MM>/
    │               └── <YYYY-MM-DD>--<kind>--<slug>--<source-id>.md
    └── research/
        ├── INDEX.md
        └── <domain>/
            └── <subdomain>/
                ├── INDEX.md
                └── topics/
                    └── <topic-slug>/
                        ├── INDEX.md
                        ├── passes/
                        │   └── <YYYY-MM-DD>--<pass-slug>.md
                        ├── SOURCES.md optional
                        ├── DECISIONS.md optional
                        └── HISTORY.md optional
```

Mode ownership:

| Mode | Reads | Writes |
|---|---|---|
| source digest | source manifest | one source artifact, source manifest, source index |
| source acquisition | feeds/inbox/watchlists, source manifest | source artifacts, source manifest, acquisition run log |
| research vault-only | architecture, source manifest, source artifacts, subdomain/topic indexes | topic `INDEX.md`, one pass file, subdomain index |
| research acquisition-first | same as source acquisition, then vault-only research | source artifacts first, then topic files |
| answer lookup | subdomain index, topic index, source artifacts when provenance is needed | nothing |
| rollup | managed artifacts | root/domain/source/research/subdomain indexes |

Managed section convention:

```md
<!-- atlas:managed:start <section-name> -->
...
<!-- atlas:managed:end <section-name> -->
```

Agents should patch managed sections instead of rewriting whole files unless a file is empty or structurally broken.

Framework philosophy must appear near the end of `ARCHITECTURE.md`, after operational contracts. Keep it succinct but explicit:

- Lean by default: start with the fewest files that preserve deterministic lookup.
- Robust by provenance: every research answer traces back to source-summary artifacts.
- Flexible by schema: version artifacts and migrate intentionally instead of relying on implicit conventions.
- Deterministic by contract: when evidence is missing, report the gap rather than filling it with model priors.
- Expand by threshold: create optional split files only when topic size or complexity makes them necessary.
- Separate framework from skills: future skills can change, but they must honor `ARCHITECTURE.md` unless explicitly revising the framework.

### T3. Rewrite the digest skill entrypoint and routing rules

Edit `.config/agents/skills/digest/SKILL.md`; preserve `name: digest`. Update the description so this current skill can operate against the Atlas framework while future framework-specific skills remain separate:

```yaml
description: >
  Turn URLs, source-discovery runs, and research requests into reusable Atlas
  Obsidian artifacts. Use when the user provides links for source summaries,
  asks to acquire sources, researches or refreshes a topic, or wants Atlas
  indexes and rollups maintained for deterministic agent lookup.
```

Opening defaults:

```md
Use `vault://atlas/ARCHITECTURE.md` as the source of truth for the research framework.

Default source artifact root: `vault://atlas/summaries/sources/artifacts/<YYYY>/<YYYY-MM>/`.
Default source manifest: `vault://atlas/summaries/sources/MANIFEST.md`.
Default research topic root: `vault://atlas/summaries/research/<domain>/<subdomain>/topics/<topic-slug>/`.

Suggested manual invocations:

- `/digest <url...>` — summarize explicit sources.
- `/digest acquire <watchlist-or-query>` — discover sources and write source artifacts only.
- `/digest research --vault-only <topic>` — synthesize or refresh a topic from existing source artifacts only.
- `/digest research --acquire <topic>` — acquire source artifacts first, then synthesize from those artifacts.
- `/digest rollup` — refresh Atlas indexes and rollups from existing artifacts.
```

Mode rules:

1. **Source mode** — explicit URLs only. Canonicalize each URL, lookup `source_id` in `MANIFEST.md`, skip duplicates unless refresh is due, then write one source artifact per new/changed canonical URL.
2. **Acquisition mode** — scheduled or manual source discovery. Search feeds, inboxes, or query watchlists; dedupe through `MANIFEST.md`; create source artifacts; write a run log. Do not update topic answers.
3. **Research mode, vault-only default** — synthesize durable research questions using existing source artifacts and topic files. If coverage is insufficient, record the gap; do not invent an answer from raw web results.
4. **Research mode, acquisition-first escape hatch** — when the caller explicitly allows acquisition, perform source acquisition first, materialize source artifacts, then synthesize from those artifacts.
5. **Rollup mode** — update `summaries/INDEX.md`, `summaries/sources/INDEX.md`, `summaries/research/INDEX.md`, `summaries/domains/<domain>.md`, and subdomain `INDEX.md` files from existing artifacts.

Routing examples:

- “What's the best way to create sourdough?” -> `research/cooking/bread/topics/sourdough-method/INDEX.md`.
- “Best cost-effective yet performant cloud infrastructure to host Flue AI for programmatic agent harness services” -> `research/infrastructure/agent-service-hosting/topics/flue-agent-harness-hosting/INDEX.md`.
- “Best framework to implement Flue as a personal intelligent assistant as a chatbot in Telegram/Line/etc.” -> `research/agentic-development/personal-assistants/topics/flue-chatbot-assistant-framework/INDEX.md`.
- “Research frontend motion and subliminal micro-detail design skills for agents” -> `research/coding/frontend-design/topics/frontend-motion-and-microinteraction-skills/INDEX.md` with secondary tags for `agentic-development` and `design`.

### T4. Revise the source summary template and dedupe policy

Edit `.config/agents/skills/digest/assets/source-summary-template.md`. Preserve useful existing fields and add or normalize:

```yaml
schema_version: 1
note_type: source-summary
managed_by: atlas
source_id: ""
canonical_url: ""
source_kind: "article|paper|repo|thread|video|docs|other"
title: ""
primary_domain: ""
subdomains: []
secondary_domains: []
tags: []
first_seen: "YYYY-MM-DD"
last_checked: "YYYY-MM-DD"
last_summarized: "YYYY-MM-DD"
refresh_after: "YYYY-MM-DD"
content_hash: ""
acquired_by: "manual|acquisition-run|research-acquire"
acquisition_run: ""
coverage: "complete|partial|failed"
confidence: "high|medium|low"
evidence_strength: "high|medium|low"
practicality: "high|medium|low|n/a"
stability: "stable|moving|speculative"
reuse_value: "high|medium|low"
recommended_posture: "adopt|trial|watch|reference-only|ignore"
```

Deduplication rules:

1. Canonicalize URL before fetch/summarize.
2. Compute `source_id` from canonical URL, e.g. `sha256(canonical_url)` shortened for filenames.
3. Lookup `source_id` and canonical URL in `summaries/sources/MANIFEST.md`.
4. If present and not due for refresh, skip summarization.
5. If present and refresh is due, fetch and compare `content_hash`.
6. If content is unchanged, update `last_checked` only.
7. If content materially changed, update the existing source artifact or create a revision only when historical snapshots are needed.
8. If absent, create a new source artifact and append one manifest row.

Single manifest policy:

- Keep one `summaries/sources/MANIFEST.md` by default. Thousands of rows are acceptable for the expected scale and simpler for agents.
- If the manifest exceeds roughly 10,000 rows or lookup becomes slow/noisy, shard by year under `summaries/sources/manifests/<YYYY>.md` and keep `MANIFEST.md` as a compact routing index.

Keep meanings narrow:

- `coverage` = fetch/read completeness.
- `confidence` = summary fidelity.
- `evidence_strength` = source quality, specificity, corroboration, and concrete proof.
- `practicality` = whether a future human/agent can use the approach.
- `stability` = expected durability.
- `reuse_value` = likelihood future agents should reopen this artifact.
- `recommended_posture` = best next stance.

Insert a rendered `## Assessment` table with the same five assessment signals and require it to stay in sync with frontmatter.

### T5. Create the research library template asset

Create `.config/agents/skills/digest/assets/research-library-templates.md` as one durable asset. It must contain these top-level headings:

```md
# Research Library Templates

## SUBDOMAIN-INDEX.md
## TOPIC-INDEX.md
## passes/YYYY-MM-DD--<pass-slug>.md
## optional/SOURCES.md
## optional/DECISIONS.md
## optional/HISTORY.md
## sources/runs/YYYY-MM-DD--<run-slug>.md
```

`SUBDOMAIN-INDEX.md` contract:

- frontmatter: `schema_version`, `note_type: subdomain-index`, `managed_by: atlas`, `domain`, `subdomain`, `last_updated`, `tags`;
- sections: `# <Subdomain>`, `## Routing scope`, `## Topic map`, `## Default lookup order`, `## Coverage map`, `## Stale or weak areas`, `## Acquisition watchlist`;
- `## Topic map` table: `Topic | Default answer | Coverage | Freshness | Last updated | Link`;
- keep this file concise; it routes agents to topic folders and must not become the research body.

`TOPIC-INDEX.md` contract:

- stored at `research/<domain>/<subdomain>/topics/<topic-slug>/INDEX.md`;
- frontmatter: `schema_version`, `note_type: research-topic`, `managed_by: atlas`, `topic`, `domain`, `subdomain`, `aliases`, `status`, `coverage_state: sufficient|partial|insufficient|stale`, `confidence: high|medium|low`, `last_researched`, `freshness_window`, `tags`;
- sections in exact order:
  - `# <Topic>`
  - `## Agent answer contract`
  - `## Scope and routing`
  - `## Current answer`
  - `## Decision tree`
  - `## Recommendation matrix`
  - `## Edge cases`
  - `## Caveats / failure modes`
  - `## Evidence map`
  - `## Gaps and acquisition needs`
  - `## Recent changes`
  - `## Read next`
- `## Current answer` is 5-8 bullets max and must be directly usable by an answering agent.
- `## Evidence map` links to source artifacts first. Raw external URLs may appear only in a clearly marked not-yet-digested subsection.

`passes/YYYY-MM-DD--<pass-slug>.md` contract:

- frontmatter: `schema_version`, `note_type: research-pass`, `managed_by: atlas`, `topic`, `domain`, `subdomain`, `requested`, `completed`, `mode: vault-only|acquisition-first`, `coverage_state`, `confidence`, `tags`;
- sections: `# <Pass title>`, `## Request`, `## Mode`, `## Coverage gate`, `## Existing artifacts consulted`, `## New source artifacts created`, `## Findings`, `## Changes applied to topic INDEX.md`, `## Gaps left open`, `## Next acquisition needs`;
- pass files are immutable provenance except typo/link fixes.

Optional split files:

- `SOURCES.md` — create when the topic `INDEX.md` evidence map exceeds about 25-40 rows or makes the topic index hard to scan. Keep a short source summary in `INDEX.md` and move the full evidence table here.
- `DECISIONS.md` — create when the topic needs more than three distinct decision matrices, personas, environments, or recommendation branches.
- `HISTORY.md` — create when `## Recent changes` exceeds about 10 entries. Keep the latest 3 entries in `INDEX.md` and move older entries here.

Split-file rules:

- Do not create optional split files for new/small topics.
- When a split file is created, add it to the topic `INDEX.md` under `## Read next`.
- Future agents should prefer reading topic `INDEX.md` first, then optional split files only when the relevant section points to them.
- Optional split files use the same frontmatter base: `schema_version`, `note_type`, `managed_by: atlas`, `topic`, `domain`, `subdomain`, `last_updated`.

`sources/runs/YYYY-MM-DD--<run-slug>.md` contract:

- frontmatter: `schema_version`, `note_type: source-acquisition-run`, `managed_by: atlas`, `started`, `completed`, `trigger: manual|cron|research-acquire`, `query_or_watchlist`, `created_sources`, `skipped_duplicates`, `coverage_notes`;
- sections: `# Source acquisition run`, `## Trigger`, `## Queries / feeds`, `## Created source artifacts`, `## Skipped duplicates`, `## Rejected sources`, `## Follow-up acquisition gaps`;
- run logs are provenance for scheduled jobs and must not contain topic synthesis.

### T6. Create starter vault files

Create or merge these files without overwriting user content:

1. `vault://atlas/summaries/INDEX.md`
2. `vault://atlas/summaries/sources/MANIFEST.md`
3. `vault://atlas/summaries/sources/INDEX.md`
4. `vault://atlas/summaries/research/INDEX.md`

`summaries/INDEX.md` must define artifact classes:

- `source-summary` — evidence snapshot for one URL/repo/paper/thread/video/doc.
- `source-manifest` — canonical URL/source-id registry used for dedupe.
- `source-acquisition-run` — provenance log for a manual or scheduled discovery run.
- `subdomain-index` — agent router and coverage map for one domain/subdomain.
- `research-topic` — current deterministic answer contract for one durable topic.
- `research-pass` — dated, non-canonical investigation record.

`summaries/sources/MANIFEST.md` starts with this table:

```md
# Source Manifest

Canonical URL registry for Atlas source dedupe.

| Source ID | Canonical URL | Artifact | First seen | Last checked | Last summarized | Content hash | Refresh after | Status |
|---|---|---|---|---|---|---|---|---|
```

`summaries/sources/INDEX.md` must state:

- source summaries live under `artifacts/<YYYY>/<YYYY-MM>/`;
- acquisition run logs live under `runs/<YYYY>/<YYYY-MM>/`;
- dedupe is driven by `MANIFEST.md`;
- scheduled acquisition should use feeds, inboxes, or watchlists, not unconstrained web scraping;
- source acquisition does not directly mutate research topics.

`summaries/research/INDEX.md` must state:

- research subdomains live under `<domain>/<subdomain>/`;
- each subdomain has `INDEX.md`;
- durable topics live under `topics/<topic-slug>/INDEX.md`;
- topic indexes are deterministic answer contracts backed by source artifacts;
- vault-only synthesis is default, and acquisition-first must materialize source artifacts before synthesis;
- optional split files are created only when the split thresholds in `ARCHITECTURE.md` are met.

Do not pre-create `domains/<domain>.md`, subdomain directories, or topic folders until the first real source/topic requires them.

Preserve `vault://atlas/todos/` exactly as-is. Do not move legacy todos into `summaries/` and do not delete the folder even if it appears unrelated to the new Atlas architecture.

### T7. Verify changed behavior and lifecycle

Run the file-level checks in `## Verification / Done criteria` using `read` and `grep`.

Run smoke tests in this order:

1. source mode with `https://github.com/karpathy/autoresearch`;
2. repeat source mode with the same URL to prove manifest dedupe skips duplicate summarization;
3. vault-only research mode for `programmatic agent engineering`;
4. acquisition-first research mode for `best way to create sourdough`.

The smoke tests fail if:

- duplicate source artifacts are created for the same canonical URL without a refresh reason;
- source artifacts are stored under domain/subdomain folders;
- research synthesis cites raw web results without source artifacts;
- topic paths skip the subdomain layer;
- a new small topic creates optional split files prematurely;
- indexes or the manifest are not updated.

When implementation is complete, update this plan file in place: set `Status: DONE`, mark each task complete with `completed <timestamp>`, append `## Completion Summary`, create `.agents/plans/archive/` if missing, and move the finished plan with:

```bash
mv .agents/plans/2026-06-30-1339_research-framework-vault.md .agents/plans/archive/
```

## Critical files & anchors

- `.config/agents/rules/plan.md` — filename, metadata, stable task codes, verification, completion summary, archive move.
- `.config/agents/rules/plan-impl-spec.md` — implementation-plan completeness and handoff expectations.
- `.config/agents/skills/skill-craft/SKILL.md` — preserve skill identity and prefer the smallest durable asset set.
- `.config/agents/skills/digest/SKILL.md` — existing entrypoint to rewrite for Atlas.
- `.config/agents/skills/digest/assets/source-summary-template.md` — existing source template to extend.

## Assumptions & contingencies

- The user has already renamed the vault/root to `atlas`; implementation should verify `vault://atlas/` resolves and should not create or use `vault://digest/`.
- `vault://atlas/todos/` is legacy state. Preserve it unchanged unless the user separately asks to migrate or remove it.
- Keep the user-facing skill name `digest` for this plan unless the user explicitly asks to rename it. Future Atlas-specific skills will be created separately.
- `ARCHITECTURE.md` is the contract future agents and skills must read before modifying or using the framework.
- The framework should optimize for deterministic future lookup, not maximum same-session freshness.
- Vault-only synthesis is the default because it preserves provenance and repeatability. Acquisition-first is the explicit escape hatch for stale or missing evidence.
- If source coverage is insufficient, the correct output is a coverage gap or acquisition request, not a confident answer.
- A single manifest is acceptable at expected scale. Shard only after lookup performance or file size becomes a real problem.
- If the vault grows too large, split by workflow skill or manifest shard; do not change source identity, topic identity, or artifact roles without an `ARCHITECTURE.md` schema migration note.
