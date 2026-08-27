# Automated papercut lifecycle and lean evidence

**Status:** ACTIVE  
**Date:** 2026-08-12  
**Updated:** 2026-08-26  
**Decision IDs:** D24  
**Supersedes:** ADR-0006  
**Related authority:** ADR-0001 D15; ADR-0004 D07, D23; ADR-0005 P07

## Scope

This decision governs current-work papercut capture, repository-opt-in evidence, Learning Candidate delivery, exact-record workflow settlement, compact storage, and framework documentation. It applies to `.config/agents/rules/papercut.md`, the portable `papercut` skill and its helper/evals/current-workflow reference, `.agents/papercuts.json`, and the settlement seam consumed by workflow owners. It supersedes ADR-0006 D24. It does not create product authority, a workflow stage, issue tracker, repair queue, transcript miner, memory backend, background process, or shipping authority.

## Context / problem

ADR-0006 made papercut capture portable, redacted, repository-owned, and opt-in, but exposed storage choreography to callers and left the final loop disconnected. Callers had to understand a separate JSON Schema, five helper commands, expected digests, and retries. A complete papercut Learning Candidate could reach an authorized workflow outcome without settling the exact source record, so users still had to review and resolve evidence manually. The empty dotfiles ledger permits a clean format cutover without transforming observations.

## Decision

### D24 — Automated papercut lifecycle and lean evidence

- **Scope:** Candidate-triggered activation; semantic qualification/redaction; repository opt-in evidence; one post-work-Handoff soft look; deterministic completion accounting; exact-record settlement; compact v2 storage; proposal-only review; and separation from memory, trackers, product authority, repair, and delivery.
- **Decision:** Keep one tiny always-applied activation rule and one portable `papercut` skill with four public modes: automatic `capture`, and explicit `init`, `review`, and `resolve`. The skill owns qualification, redaction, record selection, Learning Candidate construction, immutable `PC-ID` delivery, workflow-result mapping, and authority boundaries. One private standard-library helper owns storage mechanics: strict validation, stable IDs, bounded locking, exact mechanical deduplication, and atomic persistence.
- **Decision:** After every work Common Handoff, the same child applies the soft look once and captures at most one current candidate. Only child unavailability permits root fallback. No candidate means no papercut access or papercut output. Capture changes no task state and dispatches no learning. Papercut is never a task, Methods token, route stage, todo phase, worker-closure round, or per-task learning trigger.
- **Decision:** The lifecycle caller retains every result or none-only accounting item in deterministic work-Handoff order. Terminal normalization sends only material existing results as the ordered `papercuts` array; none-only accounting becomes `[]`. Papercut output never creates a second completion envelope.
- **Decision:** A complete candidate carries one originating `PC-ID`. The current authorized workflow may supply that ID to portable continual learning, which returns the unchanged ID and candidate-specific evidence without ledger access. After the terminal result, the workflow settles only that exact record: verified durable correction maps to `fixed`; candidate-specific rejection maps to `rejected`; replacement maps to `superseded`; blocked, incomplete, deferred, or non-specific outcomes keep it open.
- **Decision:** Store one canonical JSON v2 ledger with only `version` and `records`. Each record keeps stable ID, surface, summary, first/last dates, monotonic occurrence count, bounded observations, and latest resolution. Resolution removes detailed prose; recurrence reopens the same record while retaining prior resolution. Candidate, evaluation, task, workflow, scheduling, and memory state are never persisted.
- **Decision:** `init` creates v2 when absent, is idempotent on valid v2, and migrates only the exact valid empty v1 shape. Nonempty v1 or malformed/unsafe state fails closed without mutation. Explicit `review` stays proposal-only and explicit `resolve` remains available, but neither is required in the normal lifecycle.
- **Why:** Same-child observation retains the local evidence without expanding the control-plane root. Exact-ID settlement closes the loop without letting a broad result affect unrelated evidence. Ordered material-only presentation preserves every receipt internally while keeping terminal output bounded.
- **Rejected alternatives / why not:** Root-first capture, fallback while the child is available, manual review after every task, ledger-wide review, counters, timers, queues, transcript/memory mining, stored candidate state, workflow-specific adapters, automatic product/ADR authority, repair, tracker effects, shipping, dual readers, or compatibility aliases duplicate authority or create hidden scheduling.
- **Consequences:** OMP and Grok use the same rule, skill, ledger, and settlement semantics. Ordinary no-candidate work performs no papercut access or output, but lifecycle accounting still records that the required look occurred. Every mutation remains redacted, repository-local, disclosed, locked, validated, and atomic. Resolved evidence remains non-authoritative.
- **Reopen when:** qualification/redaction, same-child ownership, fallback eligibility, deterministic ordering, completion projection, storage, settlement, record identity, recurrence, repository scope, or authority boundaries change.
## Affected contracts

- `.config/agents/rules/papercut.md` owns only candidate-triggered activation.
- `.config/agents/skills/papercut/SKILL.md` owns the four public modes, semantic decisions, candidate delivery, settlement mapping, reporting, and authority boundaries.
- `.config/agents/skills/papercut/scripts/papercut_ledger.py` owns only v2 path, schema, identity, validation, lock, deduplication, compaction, and atomic-write mechanics.
- `.config/agents/skills/papercut/WORKFLOW.md` describes current behavior for maintenance only.
- `.agents/papercuts.json` is repository-local opt-in evidence with no authority beyond its validated records.
- ADR-0004 D07 remains the sole owner of generic engineering continual-learning evaluation and terminal curation. Its backend seam carries and settles an originating `PC-ID`; this decision does not create another curation lifecycle.
- ADR-0005 P07, product owners, custom-workflow owners, Mnemopi, future `.agents/memory/`, issue trackers, and shipping remain separate and unchanged.

Executable rule, skill, helper, eval, and workflow contracts define current behavior. This ADR alone owns D24 rationale, rejected alternatives, source qualification, and reopen triggers.

## Evidence / source revisions

- Governing specification: `local://papercut-automation-init-ask-spec.md`, revision `PAPERCUT-AUTOMATION-SPEC-20260812-r1`, SHA-256 `83252a629a21a87281d84a780c687672b8e0112233d0a4b5cc093a439231bd16`.
- Superseded baseline: ADR-0006 and `SELF-IMPROVEMENT-DESIGN-20260812-r1`, approved executor-plan revision `b919e29f11e991a1a3594b13c9bcca83c6dc0159494ae4a2985029fb71b9c84f`.
- Steve Ruiz's first-party post and media cited in ADR-0006 support proactive in-the-moment capture and later human cleanup. They do not establish this repository's v2 schema, exact settlement mapping, authority boundaries, recurrence behavior, or memory separation; those remain human-approved local decisions.

## Human authority

The human owner approved the lean automated papercut design, exact specification revision above, clean empty-ledger cutover, automatic exact-record settlement, framework documentation, and high-consequence implementation route on 2026-08-12.