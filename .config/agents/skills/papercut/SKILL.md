---
name: papercut
description: Discover, qualify, redact, consolidate, capture, review, initialize, or resolve repository-owned reusable-friction evidence. Automatic use occurs once after every completed repository-work boundary; explicit init, review, and resolution keep their existing opt-in authority.
---

# Papercut evidence

Papercut is a portable repository-friction module. It is never a task, route or workflow stage, Methods token, todo phase, assurance event, code review, test review, or learning trigger. It changes no completed-work state. Resolve `scripts/papercut_ledger.py` relative to this skill and read `WORKFLOW.md` only when maintaining or auditing ledger mechanics.

## Automatic boundary look

The generic papercut rule schedules exactly one `capture` look after every completed repository-work boundary:

- workflow work: after the owner emits its completed lean Handoff, the same child loads this skill; the parent falls back only when that child is unavailable;
- direct non-workflow implementation: after verification and before completion, the direct owner loads this skill.

The rule decides only when and who. This skill owns discovery, qualification, redaction, consolidation, persistence, and the compact result. Load it even when the completed boundary reports no candidate; in that case return `Papercut: none` without ledger access. A workflow boundary is complete when its final lean Handoff is emitted, including a Handoff that preserves repository work and reports a blocker. Read-only work and work abandoned before a repository-work Handoff are not boundaries.

## Modes

- `capture`: perform the automatic boundary look and return every qualifying result.
- `init`: explicit repository opt-in only.
- `review`: explicit proposal-only maintenance.
- `resolve`: explicit maintenance or exact-record settlement authorized by a completed learning result.

An explicit invocation without a mode returns these modes without reading storage. OMP `/skill:papercut` and Grok `/papercut` use this same body.

## Bounded discovery and order

Start with the just-completed work and its lean Handoff or direct-work verification evidence. Inspect only directly referenced dependency Handoffs, current-plan task/check/blocker records for that outcome, and other structured evidence explicitly carried by those artifacts. Do not mine transcripts, session history, long-term memory, provider logs, trackers, timers, background state, or repository-wide inventories.

Discover all plausible friction in that bounded evidence. Consolidate repeated symptoms that share the same stable surface and repository-owned root-cause class. Do not split recurrences by attempt, timestamp, path, model, provider, hash, or error wording. Order distinct candidates by authored task order and then by first qualifying observation within the task. Direct work without authored tasks uses first qualifying observation order. Preserve that order in recording, return, Handoff accounting, and completion. There is no numeric result cap.

## Qualification and exclusions

A result qualifies only when all of these are true:

- the friction is material to completing or safely repeating repository work;
- the repository owns a durable prevention seam such as its policy, default, tool, check, or caller;
- the root cause is plausibly reproducible and reusable, established by a reproduction or independent recurrence;
- the evidence can be redacted without secrets, personal data, raw transcript text, or unrelated payload; and
- capture does not weaken authority, scope, targets, verification, delivery, or shipping restrictions.

A stable severe root cause remains visible even when a later attempt succeeds. Counts, retries, budget exhaustion, authority revisions, and blocker rows are evidence only; none establishes qualification or identity by itself.

Exclude task or plan progress; tracked blocking, product, security, privacy, or data-loss defects; secrets; external outages or provider behavior; external harness or tool-contract inconsistency without a repository-owned prevention seam; ordinary assertion failures; intentional boundaries; concurrent or unattributed activity; harmless acknowledgements; one-off operator mistakes; preferences; and speculative or unverified causes. Route an excluded observation to its existing owner without ledger access.

Papercut does not judge changed-code correctness, test value, review sufficiency, or architecture taste and does not derive such policy from implementation, code-rethink, test-rethink, or review sources. Those concerns remain with their existing owners.

## Capture and compact return

1. Discover, qualify, redact, and consolidate the complete bounded set before accessing storage.
2. For each distinct qualifying root cause, derive stable `surface` and root-cause `summary`, plus current `friction`, `workaround` (the key is required; its value may be `null`), and observation date. Volatile evidence belongs only in the redacted observation, never identity.
3. If no result qualifies, return exactly `Papercut: none` and do not inspect the ledger.
4. Determine repository root and write authority only after qualification. If the ledger is absent, malformed, unsafe, or outside authority, keep every result report-only. Automatic capture never initializes or repairs storage.
5. For an initialized writable ledger, call `list --repo PATH` once, then call `record --repo PATH --input FILE` once for each distinct result in stable order. The input file holds exactly these keys and no others: `{"surface": "…", "summary": "…", "observed_on": "YYYY-MM-DD", "observation": {"friction": "…", "workaround": "…" or null}}`. The helper computes identity, exact deduplication, locking, validation, and atomic writes. Do not retry a failed call. After a write failure, keep that and any unsafe-to-write remaining results report-only rather than dropping them.
6. Return one compact line per qualifying root cause in stable order:

```text
Papercut: <PC-ID> <recorded | updated | reopened | unchanged>
Papercut: report-only — <surface>: <root-cause summary>
```

A ledger-backed line omits surface and summary because its record holds them (`list --repo PATH --id PC-ID`); a report-only line keeps both because nothing else holds that result.

Every distinct qualifying root cause appears exactly once in the return, including report-only results. Do not sort by `PC-ID`, ledger order, completion time, or severity.

A qualifying result may also produce a complete Learning Candidate with proposed durable statement, exact source evidence, project scope and authorized destination, recurrence or severity, prevention relationship, sensitivity/redaction, conflicts or supersession, and source plus independent adjacent checks. Carry the unchanged originating `PC-ID` when known. Deliver every complete candidate and identify missing fields for incomplete candidates; never dispatch learning, mutate guidance, retain memory, create tracker state, stage, commit, or ship.

## Init, review, and resolve

`init` rechecks repository root and authority, then calls `init --repo PATH`. It creates an absent v2 ledger, migrates only the exact canonical empty v1 ledger, leaves valid v2 unchanged, and reports every other state without repair. `--dry-run` reports only. Automatic capture never calls `init`.

`review` calls `list --repo PATH`, then `list --repo PATH --id PC-ID` only for selected full records. It may propose deduplication, resolution, or Learning Candidates. It writes nothing and does not initialize, dispatch, curate, retain, track, stage, commit, or ship.

`resolve` requires one exact `PC-ID`, `fixed | rejected | superseded`, valid date, durable reference, summary, and authority. Call `resolve --repo PATH --id PC-ID --input FILE` once. Use `--dry-run` only for a prospective result. Under narrower authority, return a proposal only.

After a papercut-originated Learning Candidate reaches an authoritative result, settle only its unchanged `PC-ID`: verified durable correction may be `fixed`, candidate-specific final rejection may be `rejected`, and replacement by another record or decision may be `superseded`. Blocked, incomplete, deferred, global, or unrelated learning leaves the record open. The workflow owner supplies the exact disposition; the helper never interprets learning.

## Helper boundary

Use only `init --repo PATH [--dry-run]`, `list --repo PATH [--id PC-ID]`, `record --repo PATH --input FILE [--dry-run]`, and `resolve --repo PATH --id PC-ID --input FILE [--dry-run]`. Treat JSON statuses and stable errors as mechanics, not semantic judgment. The helper continues to own the v2 schema, stable IDs, exact deduplication, bounded locking, compact resolution, recurrence, and atomic persistence. This skill owns meaning and disclosure.
