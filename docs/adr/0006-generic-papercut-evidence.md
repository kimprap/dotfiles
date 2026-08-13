# Generic papercut evidence

**Status:** SUPERSEDED by ADR-0007  
**Date:** 2026-08-12  
**Decision IDs:** D24  
**Superseded by:** ADR-0007  
**Related authority:** ADR-0001 D15; ADR-0004 D07, D23

## Scope

This decision governs cross-workflow capture, storage, review, promotion, and resolution of small reusable friction in repository-owned surfaces. It applies to `.config/agents/rules/papercut.md`, the portable `papercut` skill and its helper/schema/evals, and an explicitly initialized repository `.agents/papercuts.json`. It does not create a workflow stage, issue tracker, repair queue, transcript miner, memory backend, or shipping authority.

## Context / problem

Agents often work around small tool, configuration, documentation, and workflow friction without surfacing a reusable repository improvement. Existing terminal continual learning is intentionally narrow and belongs to the generic engineering lifecycle; product, custom-workflow, and direct work need the same lightweight evidence interface without inheriting a dev-only route. Capturing everything, mining transcripts, or treating a count as proof would instead create noisy hidden state and blur the owners of real defects, security findings, outages, memory, and durable guidance.

## Decision

### D24 — Generic papercut evidence

- **Scope:** candidate-triggered cross-workflow activation; semantic qualification and redaction; repository-opt-in persistence; proposal-only review; Learning Candidate delivery; compact resolution; and separation from memory, trackers, repair, and delivery.
- **Decision:** Use one tiny always-applied activation rule to notice only plausible current repository-owned reusable friction and load one portable `papercut` skill after a candidate exists. The skill owns four modes: automatic `capture`, and explicit `init`, `review`, and `resolve`. It semantically qualifies and redacts one current observation, rejects or routes already-owned defects and sensitive material, chooses at most one matching record, and writes only through the standard-library v1 helper when `.agents/papercuts.json` is already initialized with `capture_mode: automatic` and current authority permits that exact path. Absence, narrower read-only/exact-target/delivery authority, collision, unsafe state, or repeated digest drift yields a disclosed report-only result. Records store generalized repository evidence, ordered observation digests, and only an explicitly unverified hypothesis; exact duplicates are no-ops, independent semantic recurrences may merge, and candidate readiness is never stored or inferred from a count. Explicit review validates and proposes only. A complete existing Learning Candidate, including its reporter-authored evaluation proposal, returns to the current lifecycle owner or final response; it does not dispatch or curate itself. Explicit resolution requires a durable fixed, rejected, or superseded reference and removes observation prose while retaining generalized identity, dates, digests, and disposition. Papercut evidence remains non-authoritative and is never automatically read.
- **Why:** A small foreground seam makes friction visible where it occurs while repository opt-in, semantic qualification, redaction, explicit write authority, compact data, and owner-preserving delivery prevent it from becoming ambient surveillance or a second workflow. Keeping semantic decisions in the skill and mechanical validation/persistence in one helper gives callers a narrow interface and makes concurrency and failure behavior independently testable.
- **Rejected alternatives / why not:** A dev-only curation stage would exclude product, custom, and direct work. Mutating the human-managed global `AGENTS.md`, duplicating procedures in OMP/Grok adapters, or adding one rule per workflow would create competing policy. TTSR-only relevance, capture-everything, recurrence-only thresholds, calendars, counters, background review, automatic repair, and automatic promotion mistake activity for evidence and create hidden scheduling. Markdown append logs, response-only capture, rich transcript/task/model provenance, memory-path storage, Mnemopi retention, or a new SQLite service blur privacy and authority boundaries. Stored candidate states, automatic expiry/compaction, semantic search in the helper, or a generic storage abstraction add lifecycle or abstraction without a demonstrated need. Ledger writes may not override read-only, immutable-target, verification, staging, shipping, or exact Task Contract authority.
- **Consequences:** The same skill body and modes apply in dev, product, custom, and direct work in OMP and Grok; host syntax changes invocation only. Ordinary no-candidate work loads no skill, reads no ledger, and emits no papercut output. Automatic capture never creates a ledger. Every actual mutation is disclosed, uses expected-digest concurrency and atomic persistence, and can fall back safely to one report-only line. The ledger is evidence, not durable guidance, memory, a task queue, or proof of improvement. Guidance changes still require their current owner, bound evaluation, verification, and review.
- **Reopen when:** qualification or redaction changes; another store or repository scope is required; candidate readiness becomes persisted; automatic capture needs broader authority; review, resolution, or promotion ownership changes; a workflow-specific policy needs more than a narrowing adapter; transcript/memory/background integration is proposed; or a real second storage implementation justifies an abstraction.

## Affected contracts

- `.config/agents/rules/papercut.md` owns only candidate-triggered activation.
- `.config/agents/skills/papercut/SKILL.md` owns qualification, redaction, record selection, mode behavior, reporting, and owner-preserving candidate delivery.
- `papercut_ledger.py` and `papercuts.schema.json` own only v1 schema, path, digest, lock, atomic-write, deduplication, and compaction mechanics.
- `.agents/papercuts.json` is repository-local opt-in evidence with no authority beyond its validated records.
- ADR-0004 D07 remains the sole owner of generic engineering continual-learning curation and its evaluation boundary. D23 keeps decision provenance in focused ADRs; this evidence ledger is not a decision-provenance ledger.
- Mnemopi, future `.agents/memory/`, issue trackers, product workflow, and shipping remain separate owners and are unchanged.

Executable rule, skill, schema, helper, and eval contracts define current behavior. This ADR alone owns the rationale, rejected alternatives, source qualification, and reopen triggers for D24.

## Evidence / source revisions

- Governing authority: `local://self-improving-evaluation-papercuts-plan.md`, Datetime `2026-08-12-0107`, approved revision `b919e29f11e991a1a3594b13c9bcca83c6dc0159494ae4a2985029fb71b9c84f`, especially the human-confirmed papercut interface, qualification, persistence, data, lifecycle, authority, memory-boundary, and rejected-alternative decisions.
- Steve Ruiz, X status [`2075303919664734295`](https://x.com/steveruizok/status/2075303919664734295), first-party post at `2026-07-09T19:39:46.387Z`, and replies [`2075304096328798401`](https://x.com/steveruizok/status/2075304096328798401) at `2026-07-09T19:40:28.507Z` and [`2075329969169850651`](https://x.com/steveruizok/status/2075329969169850651) at `2026-07-09T21:23:17.073Z`, rechecked 2026-08-12: support proactive in-the-moment capture of small friction agents would otherwise push through and later human-requested cleanup.
- Ruiz first-party media [`HM0NkRFXEAAOLHv`](https://pbs.twimg.com/media/HM0NkRFXEAAOLHv.jpg:large), rechecked 2026-08-12: shows concise activity-to-friction capture, distinguishes papercuts from accomplishments and real tracked bugs, and makes whole-session transcript review explicitly user-triggered rather than unprompted.
- Ruiz first-party media [`HMz1tvqWoAA6wh2`](https://pbs.twimg.com/media/HMz1tvqWoAA6wh2.png:large), rechecked 2026-08-12: shows example friction entries with timestamps, model/user identity, and task-specific detail. It demonstrates the source behavior but also why this repository deliberately rejects rich provenance in favor of redacted generalized observations.
- These sources do not establish this repository's recurrence/independence test, repository-ownership filter, exclusions, JSON schema, redaction, opt-in, deduplication, evaluation binding, promotion, resolution, or memory boundary. Those are human-confirmed local design choices. No source claim is treated as independent enforcement.

## Human authority

The human owner approved `SELF-IMPROVEMENT-DESIGN-20260812-r1` and the exact executor plan revision above. That authority selects the local activation, qualification, storage, retention, review, routing, and memory boundaries. External sources are advisory evidence only.

## Supersession

ADR-0006 and its v1 D24 contract are historical-only. ADR-0007 is the sole active D24 authority. Ledger records, Learning Candidates, task plans, transcripts, and memory never supersede either decision.

## Verification expectations

- Dev, product, custom-workflow, and direct cases load the same portable skill only after equivalent qualifying friction appears; ordinary no-candidate work has no skill, ledger, output, inventory, or background effect.
- Excluded task state, owned defects, secrets, security incidents, outages, harness defects, and operator mistakes remain with their existing owner and do not mutate the ledger.
- An absent ledger is never created automatically; narrower authority and repeated concurrent drift remain report-only.
- Helper tests cover all five commands, stable failures, dry-run, canonical schema, path/symlink safety, expected-digest concurrency, atomic writes, duplicate observations, independent recurrence mechanics, and fixed/rejected compact resolution.
- Review and Learning Candidate delivery are proposal-only and produce no dispatch, guidance mutation, repair, tracker, memory, staging, or shipping effect.
