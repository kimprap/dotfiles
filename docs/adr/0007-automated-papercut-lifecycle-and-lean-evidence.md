# Automated papercut lifecycle and lean evidence

**Status:** ACTIVE  
**Date:** 2026-08-12  
**Decision IDs:** D24  
**Supersedes:** ADR-0006  
**Related authority:** ADR-0001 D15; ADR-0004 D07, D23; ADR-0005 P07

## Scope

This decision governs current-work papercut capture, repository-opt-in evidence, Learning Candidate delivery, exact-record workflow settlement, compact storage, and framework documentation. It applies to `.config/agents/rules/papercut.md`, the portable `papercut` skill and its helper/evals/current-workflow reference, `.agents/papercuts.json`, and the settlement seam consumed by workflow owners. It supersedes ADR-0006 D24. It does not create product authority, a workflow stage, issue tracker, repair queue, transcript miner, memory backend, background process, or shipping authority.

## Context / problem

ADR-0006 made papercut capture portable, redacted, repository-owned, and opt-in, but exposed storage choreography to callers and left the final loop disconnected. Callers had to understand a separate JSON Schema, five helper commands, expected digests, and retries. A complete papercut Learning Candidate could reach an authorized workflow outcome without settling the exact source record, so users still had to review and resolve evidence manually. The empty dotfiles ledger permits a clean format cutover without transforming observations.

## Decision

### D24 — Automated papercut lifecycle and lean evidence

- **Scope:** candidate-triggered activation; semantic qualification and redaction; explicit repository opt-in; automatic current-work capture and candidate delivery; exact-record settlement after an authoritative workflow result; compact v2 storage; proposal-only review; and separation from memory, trackers, product authority, repair, and delivery.
- **Decision:** Keep one tiny always-applied activation rule and one portable `papercut` skill with exactly four public modes: automatic `capture`, and explicit `init`, `review`, and `resolve`. The skill owns qualification, redaction, semantic record selection, Learning Candidate construction, immutable `PC-ID` delivery, workflow-result mapping, and authority boundaries. One private standard-library helper owns exactly `init`, `list`, `record`, and `resolve`, including strict validation, stable IDs, bounded locking, exact mechanical deduplication, and atomic persistence. Callers do not manage schema files, ledger digests, retries, locks, or normalization.
- **Decision:** Candidate-triggered activation remains available throughout current dev, product, custom, and direct work. After every work-task Handoff, apply the always-applied rule once as a soft look and capture at most one current candidate; no candidate means no papercut access or output. Capture changes no task state and dispatches no learning. Papercut is never a task, Methods token, workflow or route stage, todo phase, or per-task learning trigger.
- **Decision:** A complete candidate carries one exact originating `PC-ID`. The current workflow caller supplies that ID to the portable continual-learning assessor, which returns the unchanged ID and candidate-specific mapping evidence without reading or writing the ledger. After the current authorized workflow consumes its terminal result, that workflow caller settles only the exact originating record: a verified durable correction maps to `fixed`; a candidate-specific final rejection or failed frozen evaluation maps to `rejected`; replacement by another record or decision maps to `superseded`; and blocked, incomplete, deferred, or non-candidate-specific outcomes keep it open. Product strategy, scope, PRD publication, and ADR-0005 P07 remain human-owned. Custom workflows retain ownership of their result. Direct no-workflow and read-only work do not start curation or mutate evidence outside their authority.
- **Decision:** Store one canonical JSON v2 ledger with only `version` and `records`. Each stable record keeps its ID, surface, summary, first/last dates, monotonic occurrence count, current short observations, and latest resolution. Resolution removes detailed observation prose. A later recurrence reopens the same record while retaining its previous resolution, so maintainers can distinguish regression or changed circumstances without duplicating the promotion. Candidate, evaluation, task, workflow, scheduling, and memory state are never persisted.
- **Decision:** `init` creates v2 when absent, is idempotent on valid v2, and automatically migrates only the exact valid empty v1 shape. A nonempty v1 or malformed/unsafe ledger fails closed with no mutation. Remove the separate schema file, `validate`/`summary`/`upsert`, expected-digest orchestration, legacy aliases, and dual-reading after the clean cutover.
- **Decision:** Keep explicit `review` proposal-only and explicit `resolve` available for manual maintenance, but require neither in the normal workflow. Document current behavior in one maintenance-only five-section `WORKFLOW.md`: human overview, module design, current flow, included/excluded/deferred behavior, and authority/maintenance. Ordinary capture does not load it.
- **Why:** The smaller public interface hides validation and concurrency mechanics while preserving one safe mutation seam. Exact `PC-ID` settlement closes the user-visible loop without letting a broad workflow result affect unrelated evidence. Compact resolved records retain enough history to recognize recurrence without turning evidence into guidance, memory, or workflow state. Explicit opt-in and existing authority owners prevent automation from bypassing consequential decisions.
- **Rejected alternatives / why not:** Separate CRUD scripts duplicate storage policy and weaken locality. Raw deletion loses stable identity and recurrence history. Manual review or resolution after every workflow keeps the loop incomplete. Automatic ledger-wide review, record-count thresholds, timers, queues, transcript or memory mining, and stored candidate states create hidden scheduling or mistake activity for proof. Workflow-specific adapters fork semantics. Automatic product/ADR authority, repair, tracker effects, or shipping bypass existing owners. A dual v1/v2 reader or compatibility aliases preserve obsolete surface after an empty-ledger cutover.
- **Consequences:** OMP and Grok use the same rule, skill body, modes, ledger, and settlement semantics; only invocation syntax differs. Ordinary no-candidate work performs no papercut access or output. Automatic capture never initializes a repository. Every mutation remains redacted, repository-local, disclosed, locked, validated, and atomic, with report-only/open fallback at narrower authority or unsafe state. Resolved evidence remains non-authoritative. Durable guidance still requires its current owner, bound evaluation, independent verification, and final review.
- **Reopen when:** qualification or redaction changes; another storage implementation or repository scope is required; record identity or recurrence semantics change; automatic capture gains broader authority; settlement ownership or outcome mapping changes; candidate/evaluation state becomes persisted; a workflow-specific policy requires more than narrowing; or transcript, memory, background, tracker, repair, product-authority, or delivery integration is proposed.

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