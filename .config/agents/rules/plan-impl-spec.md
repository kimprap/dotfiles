---
description: Use before authoring or revising lean implementation plans, including harness-local drafts and plans linked to technical specifications.
---

# Lean implementation plan

Apply with `plan.md` before the first substantive implementation-plan draft or
revision, including a harness-local draft intended for repository copying.
Before drafting, resolve the current authority, bound specification and
applicable canonical project contracts; read the task-sizing source for new
boundaries and the proof-selection source for checks this author may select.
Reuse current material already loaded and retrieve missing or stale sources.
Load repository storage and the actual harness companion only when publishing.
A specification or ordinary design note is not itself an execution plan.

## Authoring and linked specifications

- Apply
  `skill://dev-implementation/references/test-value.md` before selecting checks
  for self-contained acceptance. Keep material rationale in existing
  surrounding prose, not new fields or sections. Linked acceptance remains an
  exact projection, not another opportunity to optimize approved checks.
- Keep a self-contained lean plan when it expresses the work clearly. If required
  technical detail, procedures, or fixtures need more space or structure, reuse a
  suitable repository specification; create one only when that gap remains. Do
  not require a second document or a universal specification directory.
- Link supporting detail through the existing `Authority` field using a readable
  repository locator and an exact revision or content identity. Keep outcome,
  authority, scope/effects, task ownership/dependencies, direct acceptance,
  recovery, and lifecycle in the lean plan. Do not embed the executable plan in
  a larger document submitted to the plan-copy adapter, or pack that document
  into a lean field to evade the grammar.
- Keep one semantic source for each requirement. When acceptance is projected
  from a specification, follow `dev-ticketing`'s existing contract: preserve
  stable IDs and the exact `Behavior` and `Check` text. Do not maintain those
  copies as independently editable requirements.
- After accepted specification changes, refresh affected plan content and its
  revision binding before approval or execution. Confirm that the referenced
  content is readable, its identity matches, and the projection remains
  consistent. A refreshed binding does not authorize unapproved requirements;
  missing or conflicting authority stops rather than being silently adopted.
  Use `plan.md`'s existing approval and drift rules, without a new approval gate
  merely because a specification or link exists.
- Use `plan-repo-storage.md` and the applicable harness companion for publication
  and active-path authority. Local drafts are copies, not alternate execution
  sources. This guidance adds no parser fields, workflow stage, or runtime state.
- `plan.md` owns the single post-candidate planning rethink and its inline or
  delegated same-author timing. Apply it once before final approval or execution
  readiness; do not repeat it for publication, exact projection, or lifecycle
  operations.

## Header and sections

The header is followed by these H2 sections exactly once and in this order:

1. `## Outcome and authority`
2. `## Scope and effects`
3. `## Tasks`
4. `## Acceptance`
5. `## Recovery and stops`
6. `## Completion Summary` only when status is `DONE`

No other H2 section is valid. Historical detailed plans remain historical data; the active validator accepts only this lean format.

## Outcome and authority

Use these nonempty fields once:

```markdown
- Outcome: <observable result>
- Authority: <current approved human/product/engineering authority>
- Assurance: compact | standard | high
```

Authority must be sufficient for the outcome and effects. A plan records current authority; it does not create it.

## Scope and effects

Use these nonempty fields once:

```markdown
- Scope: <included repository paths/surfaces and behavior>
- Effects: <allowed repository and non-repository effects, or repository changes only>
- Non-goals: <explicit exclusions>
```

Name destructive, credential, network, deployment, shipping, and external-system effects explicitly when authorized. Silence grants none.

## Tasks

Each task uses one stable `T*` label and exactly these fields:

```markdown
- [ ] T1. <vertical implementation intent>
  - Owner: <one child owner>
  - Depends on: none | <comma-separated T IDs>
  - Targets: <comma-separated exact owned paths/surfaces>
  - Acceptance: <comma-separated AC IDs>
  - Receiver: <one owner>
```

Checked tasks use `[x]` and immediately add their immutable completion record before the fields:

```markdown
- [x] T1. <vertical implementation intent>
  completed YYYY-MM-DD-HHMM
  - Owner: <one child owner>
  - Depends on: none
  - Targets: <exact owned path/surface>
  - Acceptance: AC-1
  - Receiver: <one owner>
```

Task IDs begin at `T1` and increase monotonically. Every task has one owner, at least one unique target, at least one acceptance ID, and one receiver. Each exact target and acceptance item belongs to one task. Dependencies resolve to authored tasks and form an acyclic graph. Parent control, review, verification, learning, audit, shipping, and presentation are not implementation tasks.

## Acceptance

Each item uses one stable unique `AC-*` label, one checkbox, and exactly the two indented lines shown:

```markdown
- [ ] AC-1. <short criterion name>
  Behavior: <observable>
  Check: <command or direct static proof>; expect <exact result>
```

The `Behavior` line describes externally observable behavior or an inherently structural invariant. The `Check` line names a runnable command/scenario or direct static inspection and one exact expected result. This is the only acceptance-check shape; indirect evidence and future validation notes do not substitute.

Every acceptance item is referenced by exactly one task. `DONE` requires every acceptance checkbox to be `[x]`; other statuses preserve observed progress.

## Recovery and stops

Use these nonempty fields once:

```markdown
- Recovery: <how to preserve completed work and resume within current authority, or none>
- Stops: <conditions that halt rather than weaken ownership, checks, assurance, or effects>
```

No recovery text authorizes another semantic attempt, scope change, destructive effect, or shipping action.

When execution recovery is relevant, point to
`skill://dev-implementation/references/execution-recovery.md` rather than
copying its eligibility, recurrence, or transient algorithm into the plan.
Preserve concrete cause and used allowance through existing execution evidence
and Handoffs. The plan's recovery field creates no retry state or reset.

## Completion Summary

Add this final section only after all tasks and acceptance items are checked, task completion records exist, assurance is settled, `Completed At` exists, and status is `DONE`. Record the delivered outcome, material changes, exact check results, residual risks, and next destination. Keep the completed plan at its active path.

`CLOSED`, `PENDING`, and `IN_PROGRESS` plans must not contain this section.

## Structural validation

Run:

```text
python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN
```

A valid result proves only lean structure and lifecycle: header, ordered sections, unique IDs, dependency DAG, one owner per exact target and criterion, direct-check grammar, checkbox/completion consistency, and terminal summary rules. The validator derives transient parse state and returns no plan digest. It does not establish design correctness, approval, dependency availability, or referenced specification freshness; those remain review and execution-preflight responsibilities, alongside command success and implementation quality.