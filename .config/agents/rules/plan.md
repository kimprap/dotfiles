---
description: Apply when creating, revising, executing, or completing a durable execution plan, whether repository- or harness-managed.
---

# Execution plan contract

Apply this portable contract to durable repository plans, harness/session artifacts, and handoffs intended for later execution. Skip informal suggestions, conversational checklists, non-execution meanings of “plan,” and read-only summaries of archived plans.

## Ownership and transport

- The portable body contains no harness or provenance metadata. Its `Datetime` plus canonical slug derive the repository identity defined by the storage companion.
- Execute, update, and continue from the active repository artifact. A harness-local file may be an adapter-owned draft copy source, never an execution or continuation locator.
- Implementation-body, repository-storage, and harness-transport companions own their specialized mechanics; do not duplicate them here.

## Required structure

### Header metadata

Place one contiguous block immediately after the H1 and before the first H2, in this order:

```markdown
**Datetime**: <YYYY-MM-DD-HHMM>
**Mode**: <optional nonempty canonical value>
**Scope**: <bounded area of work>
**Summary**: <one or two sentences describing the intended outcome>
**Status**: PENDING
**Completed At**: <YYYY-MM-DD-HHMM>
```

- Omit `Mode` when unused. Omit `Completed At` unless `Status` is `DONE`. No other field may occupy this block. Use exact `**Field**: value` spelling with nonempty, unpadded values. Never write an empty `Completed At` line.
- Input is nonempty strict UTF-8 without a BOM. Validation accepts LF, CRLF, and mixed LF/CRLF by removing at most one terminal `\r` per physical line; residual `\r` in the H1/header is invalid. Complete bytes—including line endings and final-newline presence—define the revision; never normalize them.
- `Datetime` is immutable and, with the canonical slug, fixes the active and archive repository paths. Never infer or rewrite it during copying, execution, continuation, or archival.
- Start at `PENDING`; change to `IN_PROGRESS` when `T1` starts. Use `CLOSED` only for explicit human cancellation; it is terminal, permits unfinished work, takes no `Completed At`, and needs no Completion Summary.
- Status, task and criterion checkboxes, valid task completion records, `Completed At`, and the final Completion Summary are lifecycle bookkeeping and do not require reapproval. Every other contract change follows ADR-0001 D02.
- Add `Completed At` once, in the same edit that sets `Status: DONE`, using the same `YYYY-MM-DD-HHMM` calendar form as `Datetime`. It is then immutable.

### Tasks

- `## Tasks` is the canonical execution order.
- Use one stable monotonic `T*` family and unchecked boxes: `- [ ] T1. Task description`.
- Give every authored task exactly one `Owner`, one `Receiver`, one short human `Intent` sentence, and one `Methods` value. Intent contains no IDs, paths, or procedure.
- Keep codes and historical outcomes stable. On completion, check the task and add exactly `  completed <YYYY-MM-DD-HHMM>` or `  - completed <YYYY-MM-DD-HHMM>` immediately below it.
- Detailed execution sections, when present, map one-to-one to task codes in the same order.

### Verification and completion

- Include `## Verification / Done criteria` with objective, observable checks; check a criterion only after observing it.
- Do not complete the final task until every required criterion passes.
- Set `Status: DONE` only when every task and criterion is checked, every task has exactly one valid immediate completion record, a nonempty final `## Completion Summary` records the delivered outcome, material findings and decisions, immutable evidence identities, current residual risks, and the exact target manifest reference, and the header includes a valid `**Completed At**: <YYYY-MM-DD-HHMM>`. Keep exhaustive changed-path inventory in that manifest and/or the existing Handoff rather than copying it into the summary.

- Append later user overrides to the Completion Summary without changing plan identity or rewriting historical outcomes.

## Plan quality

Plans are execution contracts, not transcripts. Include only the context, anchors, sequence, decisions, and proof a fresh executor needs. Scale detail with risk, reference canonical authority instead of copying it, and leave no material implementation choice unresolved. Apply the implementation-plan companion only when a later executor needs implementation-grade detail.

When breaking work into `## Tasks`, prefer vertical implementation leaves a fresh worker can finish in one session. Use your best rough estimate of that worker attempt (read, reason, edit, smoke) and aim for about 150k tokens. The number is guidance only: do not block publication, invent an estimate field, split coupled work, or invent verification, review, learning, or any other lifecycle task to hit it.

Standard and high-consequence plans may optionally number one exact final `dev-verification` → `dev-code-review` → `dev-continual-learning` suffix for human readability. When present, that suffix consumes the existing backend profile tail once; when absent, the backend schedules the same profile tail once. Compact work may remain planless; any authored compact plan contains work tasks only and has no numbered profile tail.

## Approval and execution boundary

- A plan records authority but cannot approve itself. At every new or resumed start, native harness review remains the sole plan-execution approval authority and binds the exact active repository identity, complete bytes and SHA-256 revision, current status, and explicit human approval. Missing or stale approval, changed contract bytes, or `DONE`/`CLOSED` status stops execution.
- Executor Plans use the single repository validation and readiness contract in `plan-impl-spec.md`; no adapter, copy receipt, archive receipt, or approval creates an alternate ready transition.
- Initial readiness binds the exact approved SHA-256. Continuation may consume parser-valid lifecycle bookkeeping without reapproval; any other semantic change follows ADR-0001 D02.
- Plan approval authorizes only plan execution. Repository, shared configuration, delivery, profile, vault, instance, shipping, and other effects retain their own authority gates. Copying and archival are storage effects, never approval, readiness, or completion evidence.

## Activation checks

Use this rule when creating or changing a durable plan artifact, executing its tasks, or completing its lifecycle. Do not use it for pricing/subscription plans, database query plans, informal conversational bullets, or read-only archived-plan review.
