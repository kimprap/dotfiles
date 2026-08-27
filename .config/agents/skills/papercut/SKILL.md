---
name: papercut
description: Capture, review, initialize, or resolve redacted repository-owned reusable-friction evidence. Use automatically only after plausible current friction exists, or explicitly for papercut init, review, or resolution.
---

# Papercut evidence

Own one portable current-work evidence module. Papercut is never a task, Methods token, workflow or route stage, todo phase, assurance event, or per-task continual-learning trigger; capture changes no task state. Do not create a host adapter. Resolve `scripts/papercut_ledger.py` relative to this skill. Read `WORKFLOW.md` only when maintaining, auditing, or extending this module.

## Activation and post-work look

Candidate-triggered activation remains available throughout current dev, product, custom, and direct work. After a work-task Common Handoff is emitted, the same work child applies the always-applied rule exactly once and may qualify at most one current candidate; the root falls back only when that child is unavailable. Run the Handoff first, bind any compact capture or report-only result to that Handoff, and retain accounting in deterministic work-Handoff order. The look is state-neutral and dispatches no learning. No candidate means this skill is not loaded, no ledger is accessed, and no papercut output is emitted.

## Modes

- `capture`: automatic only after the always-applied rule qualifies one plausible current-work candidate, either while work is active or in the single post-Handoff soft look.
- `init`: explicit repository opt-in only.
- `review`: explicit proposal-only maintenance.
- `resolve`: explicit maintenance, or automatic exact-record settlement after an authoritative workflow result.

An explicit invocation without a mode returns these four modes without reading storage. OMP `/skill:papercut` and Grok `/papercut` use this same body; invocation syntax changes no semantics.

## Qualification

Capture one candidate only when it is current, repository-owned friction; plausibly reproducible and reusable; redacted without secrets, personal data, transcript text, or unrelated payload; and not an already-owned defect or lifecycle event. A reproduction or independently described recurrence can establish reuse; a count cannot.

Exclude task or plan state, tracked/blocking/product defects, secrets, security findings, external outages, harness tool-contract inconsistencies, one-off operator mistakes, preferences, and any case whose capture would weaken scope, authority, immutable targets, verification, or delivery restrictions. Route each excluded case to its existing owner without ledger access.

## Capture and candidate delivery

1. Determine repository root and exact write authority only after the always-applied rule has qualified the candidate. Do not inspect memory, transcripts, history, trackers, timers, or background state.
2. Generalize `surface`, `summary`, current `friction`, optional `workaround`, and observation date. Select at most one current record semantically; never by count alone.
3. If the ledger is absent, malformed, unsafe, or outside authority, report the redacted candidate without initializing or repairing storage.
4. Otherwise call `list`, then call `record --repo PATH --input FILE` once with exactly `surface`, `summary`, `observed_on`, and observation `{friction, workaround}`. The helper computes identity, deduplicates exact observations, locks, validates, and writes atomically. Do not retry semantically. Use `--dry-run` only to report the prospective result without mutation.
5. Disclose `recorded`, `updated`, `reopened`, `unchanged`, or report-only with the exact `PC-ID` when known and the work-Handoff identity that preceded the look. No candidate means no skill load, storage access, or papercut output.

Independent evidence may support one Learning Candidate. Include the proposed durable statement; exact source revisions; project scope and destination; recurrence or severity; prevention; redaction; conflicts or supersession; and one complete Evaluation proposal with source case, independent adjacent case, frozen expectations, proof methods, freshness, and deterministic, semantic, or mixed mode. Carry exactly one immutable originating `PC-ID`. Deliver it only to the current authorized lifecycle owner, or in the final response when none exists. Incomplete evidence remains evidence-only with its missing field named. Never dispatch, curate, repair, retain memory, create tracker state, stage, ship, or persist candidate/workflow state.

## Init, review, and resolve

`init` rechecks root and authority, then calls `init --repo PATH`. It creates absent v2, migrates only the exact valid empty v1 ledger, leaves valid v2 unchanged, and reports every other state without repair. `--dry-run` reports the prospective result without persistence. Automatic capture never initializes.

`review` calls `list --repo PATH`, then `list --repo PATH --id PC-ID` only for selected full records. It may propose deduplication, resolution, or a complete Learning Candidate. It writes nothing and does not initialize, dispatch, curate, retain, track, stage, or ship.

`resolve` requires one exact `PC-ID`, `fixed | rejected | superseded`, valid date, durable reference, summary, and authority. Call `resolve --repo PATH --id PC-ID --input FILE` once. Use `--dry-run` only for a prospective result. Under narrower authority, return a proposal only.

After an originating Learning Candidate reaches its authoritative terminal result, settle only its immutable `PC-ID`: verified durable correction to `fixed`; candidate-specific final rejection or failed frozen evaluation to `rejected`; replacement by another record or decision to `superseded`; blocked, incomplete, deferred, global, or unrelated outcomes remain open. The current workflow owner supplies the exact terminal payload; the helper never interprets outcomes.

## Helper boundary

Use only `init --repo PATH [--dry-run]`, `list --repo PATH [--id PC-ID]`, `record --repo PATH --input FILE [--dry-run]`, and `resolve --repo PATH --id PC-ID --input FILE [--dry-run]`. Treat JSON statuses and stable errors as mechanics, not semantic judgment. The helper owns v2 schema, stable IDs, exact deduplication, bounded locking, compact resolution, recurrence, and atomic persistence. This skill owns qualification, redaction, semantic record selection, candidate readiness, routing, result mapping, and disclosure.
