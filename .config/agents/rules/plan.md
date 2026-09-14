---
description: Governs durable engineering plan identity, approval, lifecycle, completion, and active-path behavior.
paths: ["**"]
---

# Plan

Use this rule only for a durable future-execution engineering plan. A cohesive result owned by one implementation child remains a planless direct contract unless the user explicitly asks for a plan. A repository plan is required for multiple owners/dependencies, fan-in, ordered effects or migration, or likely cross-context recovery.

Before drafting or substantively revising a plan, resolve the current approved
authority and any bound specification or applicable canonical project contract.
Read `skill://dev-ticketing/references/task-sizing.md` for new task boundaries
and `rule://plan-impl-spec` for the implementation body. Reuse current material
already loaded, retrieve missing or stale sources, and record any material
boundary rationale in existing plan prose. Add no sizing field or validator
rule. Once a graph is approved, later estimates alone do not repartition it.

This base owns identity and lifecycle. Implementation body grammar belongs to `plan-impl-spec`; repository location and harness transport belong to their companion rules.

After a substantive candidate exists, apply
`~/.agents/references/plan-rethink.md` once before final submission for approval
or execution readiness. An inline author explicitly reads it as a separate
post-candidate step. A delegated author first returns the candidate, then
applies the caller's explicit follow-up in that same author. Make at most one
bounded correction to decisions the author owns. A newly authored graph is
substantive even when acceptance is an exact projection; an unchanged approved
contract, exact projection or storage copy, and checkbox or lifecycle-only
update do not trigger another pass.

Automatic draft persistence may occur before this pass. The pass gates final
submission or readiness, not initial storage, and changes no publication or
approval mechanics.

## Identity and header

Name the active plan `YYYY-MM-DD-HHMM_<slug>.md`. Start with one H1 followed by this contiguous metadata block in exact order:

```markdown
# <Outcome-oriented title>

**Datetime**: YYYY-MM-DD-HHMM
**Scope**: <short scope>
**Summary**: <one-sentence outcome>
**Status**: PENDING
```

Use strict UTF-8 without a BOM. LF and CRLF line endings are valid; bare or residual carriage returns are not. `Completed At` is absent until `DONE`, then appears immediately after `Status`:

```markdown
**Completed At**: YYYY-MM-DD-HHMM
```

The plan's current approved content is its authority and identity.

## Approval

Present one Route Overview and obtain one approval for the current outcome, authority, scope/effects, task graph, acceptance, and recovery boundary. Execution phases do not need repeated approval. A semantic change to those facts requires a revised plan and new approval; mechanical completion records and lifecycle fields do not.

## Lifecycle

Use exactly:

- `PENDING`: approved but no task or criterion has started or completed.
- `IN_PROGRESS`: execution has started and incomplete work remains.
- `DONE`: every task and acceptance item is checked, every completed task has its record, assurance is settled, `Completed At` exists, and the final Completion Summary is nonempty.
- `CLOSED`: explicitly stopped without claiming completion; unfinished checkboxes may remain and `Completed At` and Completion Summary are absent.

Set `IN_PROGRESS` before the first implementation dispatch. When a task completes, change its checkbox to `[x]` and insert this exact line immediately after it:

```text
  completed YYYY-MM-DD-HHMM
```

Check an acceptance item only after its exact direct check observes the expected result. Never mark evidence optimistically, rewrite earlier completion records, or infer completion from broad suite status.

`## Completion Summary` appears only for `DONE` and is the final H2 section. Completed plans remain `DONE` at the same active path. Storage companions may copy exact bytes but grant no authority.

## Stops

An execution-mechanism failure follows `skill://dev-implementation/references/execution-recovery.md` under the unchanged approved plan; the same execution owner applies its recovery rethink before every retry, and existing evidence or Handoffs preserve cause and allowance without new plan fields. Recovery does not alter plan identity, grant effects, or replenish semantic attempts. Validation failure, stale approval, undeclared mutation/effect, unavailable required child or assurance role, unresolved direct-check failure after permitted recovery, exhausted semantic attempt, or a stop required by the shared recovery policy halts execution with completed work preserved. Record the blocker under the plan's recovery section. `CLOSED` requires explicit authority to stop the plan; it is not an automatic error fallback.