---
description: Governs durable engineering plan identity, approval, lifecycle, completion, repository storage and host draft adapters under .agents/plans, and on-request archiving.
paths: [".agents/plans/**"]
---

# Plan

Use this rule only for a durable future-execution engineering plan. A cohesive result owned by one implementation child remains a planless direct contract unless the user explicitly asks for a plan. A repository plan is required for multiple owners/dependencies, fan-in, ordered effects or migration, or likely cross-context recovery.
Apply it when drafting, materializing, copying, editing, archiving on request, or resolving an identity conflict for a repository plan. Skip unrelated meanings of “plan” and read-only historical archive review.

Before drafting or substantively revising a plan, resolve the current approved
authority and any bound specification or applicable canonical project contract.
Read `skill://dev-ticketing/references/task-sizing.md` for new task boundaries
and `rule://plan-impl-spec` for the implementation body. Reuse current material
already loaded, retrieve missing or stale sources, and record any material
boundary rationale in existing plan prose. Add no sizing field or validator
rule. Once a graph is approved, later estimates alone do not repartition it.

This rule owns plan identity, approval, lifecycle, completion, repository storage, and on-request archiving. Implementation body grammar belongs to `plan-impl-spec`; a host draft adapter owns only its own copy mechanics.

After a substantive candidate exists, apply
`~/.agents/references/plan-rethink.md` once as it directs.

Automatic draft persistence may occur before this pass. The pass gates final
submission or readiness, not initial storage, and changes no publication or
approval mechanics.

## Identity and header

Name the active plan `YYYY-MM-DD-HHMM_<slug>.md`. Its sole identity is `<Datetime>_<slug>`: the immutable header Datetime and a canonical lowercase kebab-case slug. Start with one H1 followed by this contiguous metadata block in exact order:

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

`## Completion Summary` appears only for `DONE` and is the final H2 section. Completion leaves the plan `DONE` at its active path and cites that path. Any later archive follows `## Archiving on request`.

## Repository storage

- The active path `.agents/plans/<Datetime>_<slug>.md` is the only execution, update, continuation, and completion source for every lifecycle state. A host-local file may supply draft bytes to its adapter, never an execution source.
- Hosts without a local-draft adapter create and revise the complete portable plan directly at the active path with ordinary repository tools for every lifecycle state, including `DONE` and `CLOSED`.
- Host adapters: OMP drafts locally and copies through `~/.agents/harnesses/omp/plan-transport.md`; Grok has no local-draft adapter and uses the direct path (discovery note: `~/.agents/harnesses/grok/plan-transport.md`). Every other host uses the direct path. Load the actual host's adapter only when publishing.
- Validate the exact active file, or the adapter's exact snapshot, with `executor_plan.py validate PLAN` before publication and readiness.
- Inspect only the two exact identity paths: the active path and `.agents/plans/archive/<Datetime>_<slug>.md`. Both present is a visible storage conflict; preserve both and stop. An archive identity without an active identity is also a visible conflict for materialization; preserve it and stop. An existing archive identity is a read-only conflict surface; resolve it deliberately, outside automatic storage behavior. Reserve both directories for deliberate plan files.
- Persistence, whether a direct edit or an adapter copy of exact bytes, grants no approval, alternate ready or runtime transition, execution state, completion, Handoff, or presentation eligibility. A storage error remains visible but does not replace specialty completion evidence.
- Host-specific identity presentation, model, role, tools, and recovery stay in the host adapter and out of the portable artifact. Disclose actual mechanics without promising transport equivalence.

## Archiving on request

- Archive paths: `.agents/plans/archive/<Datetime>_<slug>.md`; archived artifacts use `.agents/artifacts/archive/<name>`.
- Archive only on explicit human request, any time after the plan reaches `DONE` or `CLOSED`, including right after the completion report.
- Eligible only when Status is `DONE` or `CLOSED`, `executor_plan.py validate PLAN` passes, no same-name file exists at any destination archive path, and every file to move is committed with no local edits.
- Move the plan together with the chain of documents it names as its authority, such as its specification and that specification's requirements brief. A document stays in place while any non-archived plan still cites it. A standalone artifact no active plan cites may also be archived on explicit request.
- Move each file with `git mv` so its bytes stay exact. Update live links in ADRs, skills, rules, and docs to the archive paths.
- Archived bytes are read-only; never edit an archived file, and accept that its internal links go stale.
- Completion never requires, performs, or waits on an archive. No direct edit, host adapter, or lifecycle state creates, replaces, moves, or deletes an archive automatically or removes the active path; adapters have no archive receipt, result, or completion condition, and archive completion gates remain prohibited.

## Stops

An execution-mechanism failure that prevents approved plan work from continuing is assessed under `skill://dev-implementation/references/execution-recovery.md` before escalation. The same execution owner applies its recovery rethink only before an eligible retry, and existing evidence or Handoffs preserve the failure, cause, and allowance without new plan fields. Recovery does not alter plan identity, grant effects, replace a required child or assurance role, or replenish semantic attempts or explicit execution caps. Exhausted semantic repair prohibits another deliverable change, not otherwise eligible machinery recovery. Validation failure, stale approval, undeclared mutation/effect, unavailable required ownership, unresolved direct-check failure after permitted recovery, or an exact stop required by the shared policy halts execution with completed work preserved. A child Handoff's execution-related stop is not final merely from its label: the implementation controller returns any unresolved policy-eligibility question to that same responsible owner without repairing or manufacturing eligibility. Record a settled blocker under the plan's recovery section. `CLOSED` requires explicit authority to stop the plan; it is not an automatic error fallback.
An exhausted explicit execution cap stops autonomous spend; it does not close the plan. A later human grant of additional cap continues the same plan identity.