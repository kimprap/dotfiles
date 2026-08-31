---
name: papercut
description: Capture, review, initialize, or resolve redacted repository-owned reusable-friction evidence from current work or a bounded structured execution lineage. Use automatically only after plausible friction exists, or explicitly for papercut init, review, or resolution.
---

# Papercut evidence

Own one portable current-work evidence module. Papercut is never a task, Methods token, workflow or route stage, todo phase, assurance event, or per-task continual-learning trigger; capture changes no task state. Do not create a host adapter. Resolve `scripts/papercut_ledger.py` relative to this skill. Read `WORKFLOW.md` only when maintaining, auditing, or extending this module.

## Activation and post-work look

Candidate-triggered activation remains available throughout current dev, product, custom, and direct work. Current includes the active attempt and the bounded execution lineage ending at its work-task Common Handoff. After that Handoff is emitted, the same work child applies the always-applied rule exactly once; the root falls back only when that child is unavailable. Run the Handoff first, select at most one qualified candidate for automatic capture, bind the single compact capture or report-only result to that Handoff, and retain accounting in deterministic work-Handoff order. The look is state-neutral and dispatches no learning. No candidate means this skill is not loaded, no ledger is accessed, and no papercut output is emitted.

## Modes

- `capture`: automatic only after the always-applied rule qualifies plausible friction during active work or the single post-Handoff soft look and selects at most one candidate.
- `init`: explicit repository opt-in only.
- `review`: explicit proposal-only maintenance.
- `resolve`: explicit maintenance, or automatic exact-record settlement after an authoritative workflow result.

An explicit invocation without a mode returns these four modes without reading storage. OMP `/skill:papercut` and Grok `/papercut` use this same body; invocation syntax changes no semantics.

## Qualification

Capture one selected candidate only when the friction belongs to active work or the bounded execution lineage ending at the just-emitted Handoff; is repository-owned; is plausibly reproducible and reusable; can be redacted without secrets, personal data, transcript text, or unrelated payload; and is not an already-owned defect or lifecycle event. A reproduction or independently described recurrence can establish reuse. A count, exhausted budget, or authority revision alone cannot.

During the single post-Handoff look, inspect the bounded lineage only when directly referenced structured evidence shows at least one escalation marker:

- an attempt or repair budget was exhausted;
- the same blocker or root-cause class recurred;
- an otherwise completed semantic or proof result was lost before persistence; or
- new human authority was repeatedly required solely to overcome execution mechanics.

Markers permit lineage inspection; they do not establish qualification. Follow only the current plan blocker table, Common Handoffs from the same work lineage, and immutable attempt receipts they directly reference. Stop at that work lineage. Never inspect raw transcripts, session history, memory, provider logs, trackers, timers, background state, or repository- or session-wide inventories.

Consolidate repeated symptoms into stable surface and root-cause classes rather than one candidate per attempt. Express the root-cause class in a stable `summary`. Keep attempt IDs, hashes, timestamps, provider or model details, and paths in redacted observation evidence only; never put them in `surface` or `summary`. A clean final attempt cannot supersede severe structured friction from earlier attempts.
Run-lineage blindness qualifies when a repository-owned post-Handoff look or accounting step considered only terminal-attempt observations and therefore omitted severe friction already available through the allowed structured sources. Generalize the qualification policy as the surface and terminal-only evidence scope as the root-cause summary; the failed attempts remain evidence, not identity. Bounded structured-lineage escalation is the durable prevention seam.

Repository-owned means the repository can provide durable prevention through a policy, default, tool, proof recipe, or caller it owns. A lost completed result qualifies when it reached such a caller but was not persisted and capture-before-analysis can prevent recurrence. Reject it with an explicit repository-ownership rationale when the result never reached repository control or only external provider or runtime code can fix it.

Treat task or plan state, retry counts, authority revisions, and blocker rows only as evidence, never as papercut identity. Exclude tracked, blocking, product, or security defects; secrets; external outages or provider behavior; external harness or tool-contract inconsistencies without a repository-owned prevention seam; ordinary assertion failures; intentional boundaries; concurrent or unattributed activity; harmless acknowledgements; one-off operator mistakes; preferences; and any case whose capture would weaken scope, authority, immutable targets, verification, or delivery restrictions. Route each excluded case to its existing owner without ledger access.

## Capture and candidate delivery

1. Determine repository root and exact write authority only after the always-applied rule has qualified plausible friction and selected one candidate. Use only the bounded sources above; do not inspect memory, transcripts, history, trackers, timers, or background state.
2. Generalize `surface`, stable root-cause `summary`, current `friction`, optional `workaround`, and observation date. Put volatile receipt metadata only in redacted `friction` or `workaround` evidence. Select at most one current record semantically; never by count alone.
3. If the ledger is absent, malformed, unsafe, or outside authority, report the selected redacted candidate without initializing or repairing storage.
4. Otherwise call `list`, then call `record --repo PATH --input FILE` once with exactly `surface`, `summary`, `observed_on`, and observation `{friction, workaround}`. The helper computes identity, deduplicates exact observations, locks, validates, and writes atomically. Do not retry semantically. Use `--dry-run` only to report the prospective result without mutation.
5. Disclose `recorded`, `updated`, `reopened`, `unchanged`, or report-only with the exact `PC-ID` when known and the work-Handoff identity that preceded the look. In the same compact result, explicitly classify any other stable root-cause candidate as report-only or reject it with its repository-ownership rationale; make no second ledger call. No candidate means no skill load, storage access, or papercut output.

Independent evidence may support one Learning Candidate. Include the proposed durable statement; exact source revisions; project scope and destination; recurrence or severity; prevention; redaction; conflicts or supersession; and one complete Evaluation proposal with source case, independent adjacent case, frozen expectations, proof methods, freshness, and deterministic, semantic, or mixed mode. Carry exactly one immutable originating `PC-ID`. Deliver it only to the current authorized lifecycle owner, or in the final response when none exists. Incomplete evidence remains evidence-only with its missing field named. Never dispatch, curate, repair, retain memory, create tracker state, stage, ship, or persist candidate/workflow state.

## Init, review, and resolve

`init` rechecks root and authority, then calls `init --repo PATH`. It creates absent v2, migrates only the exact valid empty v1 ledger, leaves valid v2 unchanged, and reports every other state without repair. `--dry-run` reports the prospective result without persistence. Automatic capture never initializes.

`review` calls `list --repo PATH`, then `list --repo PATH --id PC-ID` only for selected full records. It may propose deduplication, resolution, or a complete Learning Candidate. It writes nothing and does not initialize, dispatch, curate, retain, track, stage, or ship.

`resolve` requires one exact `PC-ID`, `fixed | rejected | superseded`, valid date, durable reference, summary, and authority. Call `resolve --repo PATH --id PC-ID --input FILE` once. Use `--dry-run` only for a prospective result. Under narrower authority, return a proposal only.

After an originating Learning Candidate reaches its authoritative terminal result, settle only its immutable `PC-ID`: verified durable correction to `fixed`; candidate-specific final rejection or failed frozen evaluation to `rejected`; replacement by another record or decision to `superseded`; blocked, incomplete, deferred, global, or unrelated outcomes remain open. The current workflow owner supplies the exact terminal payload; the helper never interprets outcomes.

## Helper boundary

Use only `init --repo PATH [--dry-run]`, `list --repo PATH [--id PC-ID]`, `record --repo PATH --input FILE [--dry-run]`, and `resolve --repo PATH --id PC-ID --input FILE [--dry-run]`. Treat JSON statuses and stable errors as mechanics, not semantic judgment. The helper owns v2 schema, stable IDs, exact deduplication, bounded locking, compact resolution, recurrence, and atomic persistence. This skill owns qualification, redaction, semantic record selection, candidate readiness, routing, result mapping, and disclosure.
