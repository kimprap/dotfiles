# Research Framework Vault Skill Implementation Plan

**Datetime**: 2026-06-30-1230
**Scope**: `.config/agents/skills/digest/` skill instructions/templates and `vault://digest/summaries/` starter index files for a general-purpose research framework.
**Summary**: Expand the existing `digest` skill from URL-only summaries into one entrypoint for source digestion, topic research, incremental refreshes, and index maintenance. Store source artifacts by datetime, store topic research under `research/topics/<primary-domain>/<topic-slug>/`, and use consistent multi-axis assessment tables across source and research artifacts.
**Status**: PENDING

## Context

This plan is the repository copy of the local `research-framework-vault` plan, normalized to `.config/agents/rules/plan.md` and `.config/agents/rules/plan-impl-spec.md`. The literal implementation ask is to turn the existing `digest` skill into a general-purpose research framework entrypoint, preserve source artifacts as datetime-bucketed storage, adopt a more scalable topic path than `summaries/research/<domain>/<topic>/`, make source and research assessment formats consistent, and create the starter vault index pages under `vault://digest/summaries/`.

Grounded current state:

- `.config/agents/skills/digest/SKILL.md` is still URL-summary-only and still points at `local://source-summaries/<YYYY-MM-DD>/` in both the opening text and the filename/output section.
- `.config/agents/skills/digest/assets/source-summary-template.md` is the only digest asset today.
- `vault://digest/` currently contains `.obsidian/`, `AI/`, `summaries/`, and `todos/`; `vault://digest/summaries/` is empty.
- `.config/agents/skills/skill-craft/SKILL.md` requires preserving existing skill identity unless explicitly renamed and prefers the smallest durable asset/reference set that removes future guesswork.

The end state is a single `/digest` entrypoint with three deterministic modes: source digestion, topic research/refresh, and rollup maintenance. Source artifacts remain durable source snapshots stored chronologically under `summaries/sources/`; topic research becomes a non-canonical, incrementally updated layer under `summaries/research/topics/<primary-domain>/<topic-slug>/`.

## Tasks

- [ ] T1. Rewrite `.config/agents/skills/digest/SKILL.md` so the entrypoint, routing rules, vault layout, filenames, and output policy describe source digestion, topic research, and rollup maintenance under `vault://digest/summaries/`.
- [ ] T2. Revise `.config/agents/skills/digest/assets/source-summary-template.md` to add the shared machine-readable assessment fields and rendered assessment table while keeping `coverage`/`confidence` narrow.
- [ ] T3. Create `.config/agents/skills/digest/assets/research-topic-templates.md` with exact templates for `BRIEF.md`, `OVERVIEW.md`, `UPDATES.md`, `SOURCES.md`, and dated research pass files.
- [ ] T4. Create `vault://digest/summaries/INDEX.md` and `vault://digest/summaries/research/INDEX.md` with the approved artifact model and topic-folder guidance, without pre-creating empty domain/topic files.
- [ ] T5. Verify the changed skill instructions, new template asset, and starter vault indexes with both file-level checks and a manual skill-behavior smoke test.

## Verification / Done criteria

- [ ] `read .config/agents/skills/digest/SKILL.md` shows the default source root as `vault://digest/summaries/sources/<YYYY>/<YYYY-MM>/` and the default research topic root as `vault://digest/summaries/research/topics/<primary-domain>/<topic-slug>/`.
- [ ] `grep` on `.config/agents/skills/digest/SKILL.md` for `research/topics/<primary-domain>/<topic-slug>` returns a match.
- [ ] `grep` on `.config/agents/skills/digest/SKILL.md` for `local://source-summaries` returns no matches.
- [ ] `read .config/agents/skills/digest/assets/source-summary-template.md` shows frontmatter keys for `evidence_strength`, `practicality`, `stability`, `reuse_value`, and `recommended_posture`, plus a rendered `## Assessment` table with those same signals.
- [ ] `read .config/agents/skills/digest/assets/research-topic-templates.md` shows the exact five template headings `BRIEF.md`, `OVERVIEW.md`, `UPDATES.md`, `SOURCES.md`, and `passes/YYYY-MM-DD--<pass-slug>.md`.
- [ ] `read vault://digest/summaries/INDEX.md` shows the three artifact classes `source-summary`, `research-pass`, and `topic-overview`, and points readers to `sources/`, `research/`, and `domains/`.
- [ ] `read vault://digest/summaries/research/INDEX.md` states that topic folders live under `topics/<primary-domain>/<topic-slug>/` and that topic overviews are non-canonical/incremental.
- [ ] Manual smoke test — source mode: in an OMP session rooted at `~/.dotfiles`, invoke `/digest https://github.com/karpathy/autoresearch` (or, if slash-command dispatch is unavailable, prompt the agent to use the `digest` skill on that URL). Expected result: one file appears under `vault://digest/summaries/sources/<current-year>/<current-year-month>/`, the file contains the `## Assessment` table, and `vault://digest/summaries/INDEX.md` gains or updates the matching domain entry.
- [ ] Manual smoke test — research mode: in the same or a fresh OMP session, invoke `/digest research programmatic agent engineering` (or explicitly ask the agent to use the `digest` skill for that topic). Expected result: `vault://digest/summaries/research/topics/agentic/programmatic-agent-engineering/` is created with `BRIEF.md`, `OVERVIEW.md`, `UPDATES.md`, `SOURCES.md`, and `passes/`, plus index updates in `summaries/INDEX.md` and `summaries/research/INDEX.md`.

## Approach

### T1. Rewrite the digest skill entrypoint and routing rules

Edit `.config/agents/skills/digest/SKILL.md` only; preserve frontmatter `name: digest` and `disableModelInvocation: true`. Update the description to this exact text so the one entrypoint covers all three lanes without renaming the skill:

```yaml
description: >
  Turn public URLs or research requests into reusable Obsidian Markdown artifacts.
  Use when the user provides links for source summaries, asks to research or refresh
  a topic, or wants digest indexes/rollups maintained for later agent browsing.
```

Replace the opening behavior text with these exact defaults:

```md
Turn links and research prompts into compact, agent-readable Obsidian notes under `vault://digest/summaries/`.

Default source output root: `vault://digest/summaries/sources/<YYYY>/<YYYY-MM>/` unless the caller gives a path.
Default research topic root: `vault://digest/summaries/research/topics/<primary-domain>/<topic-slug>/`.

Suggested manual invocations:

- `/digest <url...>` — summarize sources.
- `/digest research <topic>` — create or refresh a topic research folder.
- `/digest rollup` — refresh summary indexes and domain rollups.
```

Add a `## Modes` section immediately after `## Read first` with these exact triggers:

1. **Source mode** — the user provides one or more URLs and no broader research question; write one source artifact per canonical URL using `assets/source-summary-template.md`.
2. **Research mode** — the user asks to research, investigate, compare, evaluate, or refresh a topic; resolve the topic folder first, then use `assets/research-topic-templates.md` for the topic files.
3. **Rollup mode** — the user asks to update indexes/rollups without new source digestion; update `summaries/INDEX.md`, `summaries/domains/<domain>.md`, and `summaries/research/INDEX.md` from existing artifacts.

Add a `## Vault layout` section with this exact structure and rationale:

```text
vault://digest/
├── todos/
│   └── TODOs.md
└── summaries/
    ├── INDEX.md
    ├── domains/
    │   └── <domain>.md
    ├── sources/
    │   └── <YYYY>/
    │       └── <YYYY-MM>/
    │           └── <YYYY-MM-DD>--<kind>--<slug>.md
    └── research/
        ├── INDEX.md
        └── topics/
            └── <primary-domain>/
                └── <topic-slug>/
                    ├── BRIEF.md
                    ├── OVERVIEW.md
                    ├── UPDATES.md
                    ├── SOURCES.md
                    └── passes/
                        └── <YYYY-MM-DD>--<pass-slug>.md
```

State these folder decisions verbatim in that section:

- `summaries/sources/` stays domain-free and datetime-bucketed; domain belongs in frontmatter/tags, indexes, and source slug text only.
- `summaries/research/topics/` is the generic parent for all durable topic folders; this supersedes `summaries/research/<domain>/<topic>/` because `research/` must also hold `INDEX.md` and future research-level support files without mixing them with topic folders.
- `<primary-domain>` is an open-ended human browsing category, not a fixed ontology. Valid examples include `agentic`, `finance`, `accounting`, `seo`, `cooking`, `health`, `robotics`, `design`, and `misc`.
- Do not add deeper folder levels for subdomains. Put subdomain meaning in `<topic-slug>` and tags instead, e.g. `topics/accounting/small-business-tax-deductions/` or `topics/seo/programmatic-seo-site-architecture/`.

Replace the current filename/output section with:

```md
## Filename pattern

Unless the caller specifies otherwise, write source files under:

`vault://digest/summaries/sources/<YYYY>/<YYYY-MM>/`

Use:

`<YYYY-MM-DD>--<kind>--<slug>.md`
```

Keep the existing slug-generation guidance, but update the examples to include the date prefix.

Add a `## Domain and topic routing checklist` section after `## Canonical source types` with these exact rules:

1. Extract the durable user intent as a noun phrase.
2. Assign exactly one primary domain for folder placement using the rule “where would a human look first?”
3. Add secondary domains only as tags, never as extra folders.
4. Normalize the topic slug to lowercase kebab-case.
5. Search `vault://digest/summaries/research/topics/<primary-domain>/` for an existing topic folder whose `BRIEF.md` covers the same question family.
6. Append/refresh an existing topic if the new ask keeps the same title, scope, and TL;DR.
7. Create a sibling topic if the new ask would force a new title, scope, or TL;DR.
8. Add a subsection instead of a sibling only when the new material is clearly a branch of the same topic and a future agent should still start from the same `OVERVIEW.md`.
9. Do not create topic folders for single URLs, one-off source notes, or source-specific claims; those belong in `summaries/sources/`.

Update the existing `## Checklist` bullets to keep the current canonicalization/fetch/metadata/tagging guidance, but change the storage/output bullets so source mode explicitly writes under `vault://digest/summaries/sources/<YYYY>/<YYYY-MM>/`, requires the `## Assessment` table, and updates `vault://digest/summaries/INDEX.md` plus the matching `summaries/domains/<domain>.md` page when present.

Add a `## Research workflow` section with these exact ordered steps:

1. Resolve primary domain/topic folder using the routing checklist.
2. If the topic folder is missing, create `BRIEF.md`, `OVERVIEW.md`, `UPDATES.md`, `SOURCES.md`, and `passes/` using `assets/research-topic-templates.md`.
3. If the topic folder exists, read `BRIEF.md`, `OVERVIEW.md`, `UPDATES.md`, and `SOURCES.md` before searching externally.
4. Search existing source artifacts first, then perform fresh external web search.
5. Create source artifacts for new high-signal sources before writing the research pass.
6. Write one dated research pass under `passes/<YYYY-MM-DD>--<pass-slug>.md`.
7. Patch only affected sections of `OVERVIEW.md`; do not full-rewrite a topic overview unless the existing file is empty or structurally broken.
8. Append a dated delta entry to `UPDATES.md`.
9. Update `SOURCES.md`, `summaries/research/INDEX.md`, `summaries/INDEX.md`, and the matching domain rollup.

Update `## Output policy` to require:

- source mode: one source summary per canonical URL; do not merge multiple URLs unless the caller explicitly asks for synthesis;
- research mode: one dated pass per invocation plus incremental updates to the topic folder files;
- final research summaries must link to source artifacts first, not only raw web URLs;
- markdown content inside the vault should use Obsidian-relative links or wiki links, while `vault://digest/...` remains a tool-path convention.

Copy the existing tagging convention; do not introduce a second parallel tagging pattern.

### T2. Revise the source summary template to use the shared assessment model

Edit `.config/agents/skills/digest/assets/source-summary-template.md`. Keep the existing frontmatter keys and add these exact keys after `confidence`:

```yaml
evidence_strength: "high|medium|low"
practicality: "high|medium|low|n/a"
stability: "stable|moving|speculative"
reuse_value: "high|medium|low"
recommended_posture: "adopt|trial|watch|reference-only|ignore"
```

Update the template comments so they explicitly say those keys are machine-readable and the rendered table must stay in sync with frontmatter.

Insert this exact rendered section between `## Evidence / examples` and `## Caveats / open questions`:

```md
## Assessment

| Signal | Rating | Reason |
|---|---|---|
| Evidence strength | high\|medium\|low | Source quality, specificity, corroboration, and whether concrete evidence is provided. |
| Practicality / actionability | high\|medium\|low\|n/a | Whether the approach can be used directly, trialed with modest work, or is only conceptual. Use `n/a` when the source is descriptive and proposes no approach. |
| Stability | stable\|moving\|speculative | Whether the claim is likely durable, fast-changing, or mostly conjecture. |
| Reuse value | high\|medium\|low | Whether future agents should reopen this note for decisions, comparisons, implementation, or background only. |
| Recommended posture | adopt\|trial\|watch\|reference-only\|ignore | Best next stance for a future human or agent. |
```

Keep `coverage` and `confidence` narrow: `coverage` is fetch completeness; `confidence` is summary fidelity. Do not repurpose either field to mean source quality or usefulness.

### T3. Create the research-topic template asset

Create `.config/agents/skills/digest/assets/research-topic-templates.md` as a single durable asset, not a directory of multiple template files. The file must contain these exact top-level headings:

```md
# Research Topic Templates

## BRIEF.md
## OVERVIEW.md
## UPDATES.md
## SOURCES.md
## passes/YYYY-MM-DD--<pass-slug>.md
```

Fill those sections with these exact contracts:

- `BRIEF.md`
  - frontmatter: `note_type: research-brief`, `topic`, `primary_domain`, `secondary_domains`, `status: active`, `created`, `last_updated`, `tags`;
  - body sections: `# <Topic>`, `## Scope`, `## Belongs here`, `## Does not belong here`, `## Refresh triggers`, `## Split rules`;
  - `## Split rules` must explicitly say to create a sibling topic when a new ask changes the title, scope, or TL;DR of `OVERVIEW.md`.
- `OVERVIEW.md`
  - frontmatter: `note_type: topic-overview`, `topic`, `primary_domain`, `last_researched`, `status: active`, `confidence: high|medium|low`, `tags`;
  - sections in exact order: `# <Topic>`, `## Current view`, `## What changed this pass`, `## Stable conclusions`, `## Approach matrix`, `## Active disagreements / uncertainty`, `## Open questions`, `## Read next`;
  - `## Current view` is 5–8 bullets max;
  - `## Approach matrix` uses this exact table:

```md
| Approach | Evidence | Practicality | Stability | Posture | Source artifacts |
|---|---|---|---|---|---|
| <approach> | high\|medium\|low | high\|medium\|low\|n/a | stable\|moving\|speculative | adopt\|trial\|watch\|reference-only\|ignore | [[path|label]] |
```

- `UPDATES.md`
  - frontmatter: `note_type: topic-updates`, `topic`, `primary_domain`;
  - append-only entries newest first;
  - each entry format:

```md
## YYYY-MM-DD — <pass title>

- **Trigger**: <human request or reason>
- **New source artifacts**: [[path|label]], ...
- **Changed conclusions**: <bullets>
- **Unchanged conclusions**: <bullets>
- **Superseded / weakened claims**: <bullets or none>
- **Next refresh cue**: <when/why to revisit>
```

- `SOURCES.md`
  - frontmatter: `note_type: topic-sources`, `topic`, `primary_domain`;
  - sections: `# Sources for <Topic>`, `## Primary evidence`, `## Background`, `## Counterpoints`, `## Superseded / stale`, `## Raw external sources not yet digested`;
  - rows use this exact table:

```md
| Artifact | Role | Evidence | Practicality | Stability | Notes |
|---|---|---|---|---|---|
| [[path|label]] | primary\|background\|counterpoint\|superseded | high\|medium\|low | high\|medium\|low\|n/a | stable\|moving\|speculative | <why it matters> |
```

- `passes/YYYY-MM-DD--<pass-slug>.md`
  - frontmatter: `note_type: research-pass`, `topic`, `primary_domain`, `requested`, `completed`, `coverage: complete|partial|scout`, `confidence: high|medium|low`, `tags`;
  - sections: `# <Pass title>`, `## Research question`, `## Search plan`, `## Source artifacts created`, `## Existing artifacts consulted`, `## Findings`, `## Changes to overview`, `## Open questions`, `## Next actions`;
  - `## Changes to overview` must state exactly which `OVERVIEW.md` sections were patched, or explicitly say no patch was made.

Do not add extra template files unless a later request shows one asset is insufficient.

### T4. Create the starter vault indexes

Create `vault://digest/summaries/INDEX.md` only if it does not exist or is empty. If it exists with user content, merge the required sections into the existing note instead of overwriting it.

Use this exact structure:

```md
# Digest Summaries

Agent-first index for source summaries and topic research in this vault.

## Artifact classes

- `source-summary` — one durable artifact per URL, repo, paper, video, or thread. Stored under `sources/YYYY/YYYY-MM/`.
- `research-pass` — one non-canonical artifact per topic research invocation. Stored under `research/topics/<primary-domain>/<topic-slug>/passes/`.
- `topic-overview` — current best synthesis for a durable topic. Stored at `research/topics/<primary-domain>/<topic-slug>/OVERVIEW.md` and updated incrementally.

## Domains

_Add domain links here as artifacts are created._

## Recent source summaries

_Add newest source artifacts here._

## Active research topics

_Add durable topic folders here._
```

Create `vault://digest/summaries/research/INDEX.md` only if it does not exist or is empty; otherwise merge. Use this exact structure:

```md
# Research Topics

Topic research folders live under `topics/<primary-domain>/<topic-slug>/`.

A topic overview is not canonical truth. It is the current best synthesis as of its latest update. Every manual research invocation should create a dated pass, digest new source artifacts when useful, and patch the topic overview incrementally.

## Active topics

_Add topic links here._

## Domain routing rule

Choose one primary domain by asking where a human would look first. Store secondary domains as tags, not folders. Do not add deeper subdomain folders; use the topic slug and tags for subdomain meaning.
```

Do not pre-create `summaries/domains/<domain>.md` pages or any topic folders during this task. Those pages/folders are created on first real artifact/topic creation so the vault does not fill with empty placeholders.

### T5. Verify changed behavior and plan lifecycle

Run the file-level verification checks in `## Verification / Done criteria` using `read` and `grep`, not shell search tools.

Then run the two manual smoke tests exactly as written:

1. source-mode `/digest` invocation on `https://github.com/karpathy/autoresearch`;
2. research-mode `/digest research programmatic agent engineering` invocation.

If slash-command dispatch is unavailable in the harness, use an explicit prompt that instructs the agent to use the `digest` skill. The smoke tests fail if files are created outside `vault://digest/summaries/`, if the assessment model is missing, if the topic path skips the `topics/` parent, or if the indexes are not updated.

When implementation is complete, update this plan file in place: set `Status: DONE`, mark each task complete with `completed <timestamp>`, append a concise `## Completion Summary`, create `.agents/plans/archive/` if missing, and move the finished plan with exactly `mv .agents/plans/2026-06-30-1230_research-framework-vault.md .agents/plans/archive/`.

## Critical files & anchors

- `.config/agents/rules/plan.md:16-23,27-43,59-111` — filename format, metadata, stable task-code requirement, completion summary, and archive behavior.
- `.config/agents/rules/plan-impl-spec.md:14-30` — implementation-plan completeness, ordered task mapping, verification, and fallback expectations.
- `.config/agents/skills/skill-craft/SKILL.md:86-94,118-145` — preserve skill identity, prefer the smallest durable asset set, and keep behavior predictable.
- `.config/agents/skills/digest/SKILL.md:1-17,65-115` — current frontmatter, source checklist, filename/output policy, and old local-root language that must be replaced.
- `.config/agents/skills/digest/assets/source-summary-template.md:1-68` — existing frontmatter/body order into which the shared assessment model must be inserted.

## Assumptions & contingencies

- Keep the skill directory/name as `digest`; the user approved one entrypoint, not a rename. If a future request wants a renamed framework skill, do that in a separate plan.
- Use `summaries/research/topics/<primary-domain>/<topic-slug>/`, not `summaries/research/<domain>/<topic>/`, because the extra `topics/` parent cleanly separates durable topic folders from `research/INDEX.md` and any future research-level support files.
- Domains are open-ended lowercase kebab-case browsing labels. If a topic is cross-domain, choose the one domain a human would browse first and store the others as tags.
- Do not create deeper subdomain folders. If a topic needs finer granularity, encode it in `<topic-slug>` and tags or split it into sibling topic folders according to the `BRIEF.md` split rules.
- If `vault://digest/summaries/INDEX.md` or `vault://digest/summaries/research/INDEX.md` already exists with user content when execution starts, merge missing required sections instead of overwriting user notes.
- If the manual smoke tests cannot be run because the harness session is unavailable, stop after file-level verification and reopen a harness session before marking T5 complete; do not claim behavior verification from static file inspection alone.

