---
description: Defines the exact lean executable body and structural validation contract for implementation plans.
paths: ["**/.agents/plans/*.md"]
---

# Lean implementation plan

Apply with `plan.md`. The header is followed by these H2 sections exactly once and in this order:

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

## Completion Summary

Add this final section only after all tasks and acceptance items are checked, task completion records exist, assurance is settled, `Completed At` exists, and status is `DONE`. Record the delivered outcome, material changes, exact check results, residual risks, and next destination. Keep the completed plan at its active path.

`CLOSED`, `PENDING`, and `IN_PROGRESS` plans must not contain this section.

## Structural validation

Run:

```text
python3 skill://dev-implementation/scripts/executor_plan.py validate PLAN
```

A valid result proves only lean structure and lifecycle: header, ordered sections, unique IDs, dependency DAG, one owner per exact target and criterion, direct-check grammar, checkbox/completion consistency, and terminal summary rules. The validator derives transient parse state and returns no plan digest. Product correctness, approval truth, command success, and implementation quality remain runtime responsibilities.