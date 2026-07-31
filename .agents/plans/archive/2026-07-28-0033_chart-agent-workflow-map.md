# Chart Agent Workflow Map

**Datetime**: 2026-07-28-0033
**Scope**: Chart Agent Workflow Map
**Summary**: Mirrored OMP plan artifact for Chart Agent Workflow Map.
**Status**: CLOSED


## Context

The invoked Wayfinder workflow should run in normal mode, not OMP plan mode. Charting creates and updates a canonical map, child decision tickets, dependency edges, claims, and research resolutions on the repository issue tracker—or under `.scratch/<effort>/` when the repository has no tracker adapter—so plan mode's read-only system and working-tree semantics prevent the workflow from operating correctly. The destination is a decision-complete map for a portable, adaptive end-to-end agent workflow that selects appropriate Matt Pocock- and Cursor-derived skills without embedding harness or model details.

## Approach

1. From `/Users/kim/.dotfiles`, inspect `docs/agents/issue-tracker.md`; if it exists, use its repository-specific map, child-ticket, blocking, claim, and resolution operations. If it does not exist, use `.config/agents/skills/wayfinder/references/issue-tracker-local.md` exactly, storing the map at `.scratch/<effort>/map.md` and tickets at `.scratch/<effort>/issues/NN-<slug>.md`.
2. Invoke `eng-grilling`, `eng-domain-modeling`, and `craft-skill` to settle the map destination before creating artifacts. Treat the supplied workflow description and the prior research handoff as the seed, not as settled design authority. Preserve these fixed constraints: shared skill bodies are harness/model agnostic; provider-specific transports and model IDs live only in adapters or verification; the default implementation path is one agent; parallel or full orchestration requires genuinely independent slices with settled interfaces and acceptance criteria; planners do not code, verifiers do not repair, and integration is a separate neutral task; humans retain product, architecture, destructive, and scope decisions.
3. During the destination round, ask the full dependency-safe frontier in one batch, with a concrete recommendation per question. Include the destination artifact's intended form, whether the workflow router and implementation backend are one skill or two cooperating skills, and whether the map ends at a portable skill specification or also decides the exact local skill inventory. Do not decide naming yet; create the user-requested naming decision as its own later `grilling` ticket and apply `craft-name` when that ticket reaches the frontier.
4. Breadth-first map the first visible decisions across: skill inventory and `eng-` naming; the single user-facing router; pre-implementation intent/spec/ticket flow; adaptive execution gating; portable planner/worker/verifier/integrator contracts; harness adapters; durable artifact policy; failure/retry/escalation rules; evaluation scenarios; and migration of current local skills. Put only precisely worded decisions into tickets; keep dependent, still-fuzzy areas in `Not yet specified`.
5. Create one `wayfinder:map` issue with the settled Destination, Notes, empty Decisions-so-far index, visible fog, and explicit scope boundary. Create every currently sharp child ticket, then add blocking relationships in a second pass. Shared `CONTEXT.md`, `CONTEXT-MAP.md`, and ADR creation must remain a human decision ticket when the corresponding canonical artifact is absent; its question must briefly explain that a glossary preserves resolved terminology and an ADR preserves hard-to-reverse, surprising trade-offs. Never create those artifacts implicitly.
6. Resolve only the charting research batch: launch one independent read-only worker per new research ticket when supported, otherwise perform each lookup sequentially and keep results isolated. Record source-linked answers in their tickets, close those research tickets, and append only named gist/link pointers to Decisions-so-far. Do not install, edit, rename, or remove skills; do not implement the eventual workflow; stop after charting and the permitted research batch.

## Critical files & anchors

- `.config/agents/skills/` — current portable skill inventory whose exact additions, updates, grouping, and removals the map must decide before implementation.
- `.config/agents/skills/eng-grilling/SKILL.md` — breadth-first, dependency-safe interview primitive and portable fact-finding contract.
- `.config/agents/skills/wayfinder/SKILL.md` — canonical map/ticket lifecycle and one-non-research-ticket-per-session boundary.
- `.config/agents/skills/wayfinder/references/issue-tracker-local.md` — fallback storage contract when no repository-specific tracker adapter exists.
- `.agents/plans/archive/2026-07-26-1752_sync-matt-skills-wayfinder.md` — completed prior synchronization decisions; use as historical context, not current authority.

## Verification

- Working directory: `/Users/kim/.dotfiles`. Confirm the selected tracker adapter contains exactly one map labelled or represented as `wayfinder:map`, with the settled Destination, Notes, an empty-or-research-only Decisions-so-far index, visible `Not yet specified` fog, and Out-of-scope boundaries.
- Query or inspect child tickets and confirm each has exactly one type (`research`, `prototype`, `grilling`, or `task`), one precise `## Question`, a parent link to the map, and dependency edges added only after all ticket identities exist.
- Confirm the frontier query returns only open, unblocked, unclaimed children. For the local fallback, scan `.scratch/<effort>/issues/` and verify that tickets with unresolved `Blocked by:` entries do not appear in the frontier.
- For every charting research ticket, inspect its source-linked resolution and the map pointer, then confirm the ticket is closed/resolved. Confirm every non-research ticket remains open and unclaimed at the end of charting.
- Inspect `.config/agents/skills/`, canonical Markdown artifacts, and repository plans after charting; expected observable result is no implementation mutation outside the tracker map/ticket artifacts.

## Assumptions & contingencies

- Normal mode is required because both remote tracker mutation and the documented local Markdown fallback are state-changing operations. If the repository-specific adapter uses only an external tracker, use it; do not create `.scratch/` in addition.
- The current request is a loose idea suitable for Wayfinder rather than a decision-complete implementation plan. If the destination and breadth-first round surface no fog and the work is demonstrably one-session sized, follow Wayfinder's stop condition and ask the user how to proceed instead of creating a map.
- The prior handoff is evidence and context, not authority. When it conflicts with current upstream sources, the current repository, or a new user decision, record the newer grounded decision in the relevant ticket.

## Closure Summary

Closed and archived after the resolved workflow map was consumed by the completed [Eng Flow Implementation Plan](2026-07-28-2309_eng-flow-implementation.md). This plan no longer owns active work; its historical charting instructions remain unchanged.
