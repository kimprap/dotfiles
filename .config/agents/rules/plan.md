---
description: Apply when creating, revising, executing, or completing a durable execution plan, whether repository- or harness-managed.
---

# Execution plan contract

Apply this portable contract to durable repository plans, harness/session artifacts, and handoffs intended for later execution. Skip informal suggestions, conversational checklists, non-execution meanings of “plan,” and read-only summaries of archived plans.

## Ownership and transport

- A harness-assigned path changes only storage and naming; this content and lifecycle contract still applies.
- Update the authoritative artifact. Copies, forks, and repository projections preserve its complete header and never become authority merely through presence or equality.
- Implementation-body, repository-storage, and harness-transport companions own their specialized mechanics; do not duplicate them here.

## Required structure

### Header metadata

Place one contiguous block immediately after the H1 and before the first H2, in this order:

```markdown
**Datetime**: <YYYY-MM-DD-HHMM>
**Authority kind**: <local-authority|direct-repository>
**Mode**: <optional nonempty canonical value>
**Scope**: <bounded area of work>
**Summary**: <one or two sentences describing the intended outcome>
**Status**: PENDING
**Completed At**: <YYYY-MM-DD-HHMM>
```

- Omit `Mode` when unused. Omit `Completed At` unless `Status` is `DONE`. No other field may occupy this block. Use exact `**Field**: value` spelling with nonempty, unpadded values. Never write an empty `Completed At` line.
- Input is nonempty strict UTF-8 without a BOM. Validation accepts LF, CRLF, and mixed LF/CRLF by removing at most one terminal `\r` per physical line; residual `\r` in the H1/header and any `Authority kind` outside the block are invalid. Complete bytes—including line endings and final-newline presence—define the revision; never normalize them.
- `Authority kind` records provenance, not approval: `local-authority` means the harness/session artifact is authoritative; `direct-repository` means the exact repository plan path is authoritative. The transport selects it from actual storage, never provider or context.
- `Datetime` and `Authority kind` are immutable. Never infer, add, switch, adopt, or promote them during editing or synchronization. Unmarked plans fail closed until separately migrated per identity and freshly approved.
- Start at `PENDING`; change to `IN_PROGRESS` when `T1` starts. Approval alone never changes status. Use `CLOSED` only for explicit user cancellation. `CLOSED` does not take `Completed At`.
- Add `Completed At` once, in the same edit that sets `Status: DONE`, using the same `YYYY-MM-DD-HHMM` calendar form as `Datetime`. It is then immutable. Do not rewrite historical `DONE` or `CLOSED` bytes solely to add the field.

### Tasks

- `## Tasks` is the canonical execution order.
- Use stable monotonic codes and unchecked boxes: `- [ ] T1. Task description`.
- Keep codes and historical outcomes stable. On completion, check the task and add an indented `completed <YYYY-MM-DD-HHMM>` line immediately below it.
- Detailed execution sections, when present, map one-to-one to task codes in the same order.

### Verification and completion

- Include `## Verification / Done criteria` with objective, observable checks; check a criterion only after observing it.
- Do not complete the final task until every required criterion passes.
- Set `Status: DONE` only when every task is checked and timestamped, a nonempty final `## Completion Summary` records material findings, decisions, delivered behavior, and residual risks, and the header includes `**Completed At**: <YYYY-MM-DD-HHMM>`.
- Append later user overrides to the Completion Summary without changing plan identity or rewriting historical outcomes.

## Plan quality

Plans are execution contracts, not transcripts. Include only the context, anchors, sequence, decisions, and proof a fresh executor needs. Scale detail with risk, reference canonical authority instead of copying it, and leave no material implementation choice unresolved. Apply the implementation-plan companion only when a later executor needs implementation-grade detail.

When breaking work into `## Tasks`, prefer vertical implementation leaves a fresh worker can finish in one session. Use your best rough estimate of that worker attempt (read, reason, edit, smoke) and aim for about 150k tokens. The number is guidance only: do not block publication, invent an estimate field, split coupled work, or turn verification, review, or learning into numbered tasks to hit it.

## Approval and execution boundary

- A plan records authority but cannot approve itself. At every new or resumed start, native harness review remains the sole plan-execution approval authority and binds the exact authority identity/URI, complete bytes and SHA-256 revision, current status, and explicit human approval. Missing or stale approval, changed identity/bytes, or `DONE`/`CLOSED` status stops execution.
- Executor Plans use the single planner/backend validation and readiness contract in `plan-impl-spec.md`; no other rule, adapter, report, marker, synchronization receipt, or approval creates an alternate ready transition.
- New or revised executable plans must not contain the obsolete `## Execution gate`. Revise active old-contract plans under their own authority; do not rewrite immutable historical plans or add compatibility aliases.
- Plan approval authorizes only plan execution. Repository, shared configuration, delivery, profile, vault, instance, shipping, and other effects retain their own authority gates. Synchronization and archival are storage effects, never approval or readiness evidence.

## Activation checks

Use this rule when creating or changing a durable plan artifact, executing its tasks, or completing its lifecycle. Do not use it for pricing/subscription plans, database query plans, informal conversational bullets, or read-only archived-plan review.
