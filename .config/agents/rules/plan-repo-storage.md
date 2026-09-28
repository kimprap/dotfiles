---
description: Apply when materializing, copying, editing, or archiving on request an execution plan under .agents/plans.
---

# Repository plan storage

Apply `plan.md` first. This companion owns repository identity, active location, exact-byte persistence, on-request archiving, and historical archive conflicts under `.agents/plans/`; it does not own plan content, lifecycle meaning, approval, or runtime state.

## Identity and paths

- A repository plan's sole identity is `<Datetime>_<slug>`, using its immutable header Datetime and canonical lowercase kebab-case slug.
- Active path: `.agents/plans/<Datetime>_<slug>.md`.
- Archive path: `.agents/plans/archive/<Datetime>_<slug>.md`; archived artifacts use `.agents/artifacts/archive/<name>`.
- The active repository file is the only execution, update, continuation, and completion source for every lifecycle state. A harness-local file may supply draft bytes to its adapter, never an execution source.
- Inspect only the two exact identity paths. Both present is a visible storage conflict; preserve both and stop. An archive identity without an active identity is also a visible conflict for materialization; preserve it and stop. Reserve both directories for deliberate plan files.

## Local draft copying

- Snapshot one complete regular non-symlink local draft after each successful adapter-owned mutation. Validate that exact snapshot with `executor_plan.py validate PLAN`; derive Datetime and lifecycle only from its valid result.
- For every valid `PENDING`, `IN_PROGRESS`, `DONE`, or `CLOSED` snapshot, copy the bytes exactly to the active path with a same-directory staged atomic replacement.
- Recheck the source, active target, historical archive conflict path, and exact-byte active result around publication. Both identity paths present, any historical archive at the identity, parser-invalid bytes, an unsafe file kind, source or target drift, or an uncertain active publication result fails visibly.
- Never create, replace, move, or delete a historical archive. Never remove the active path because of lifecycle state. The adapter has one copied success result and no archive receipt or archive completion condition.

## Direct repository editing

- Harnesses without a local-draft adapter create and edit the active path directly with ordinary repository tools, including when the valid lifecycle is `DONE` or `CLOSED`, then validate that exact file with `executor_plan.py validate PLAN`.
- Direct editing does not automatically create, move, replace, or delete an archive. An existing exact archive identity is a read-only conflict surface; preserve it and resolve the conflict deliberately outside automatic storage behavior.
- Persistence grants no approval, runtime transition, completion, Handoff, or presentation eligibility. A storage error remains visible but does not replace specialty completion evidence.

## On-request archiving

- Archive only on explicit human request, any time after the plan reaches `DONE` or `CLOSED`, including right after the completion report. Completion still cites the active `DONE` path and never requires, performs, or waits on an archive.
- Eligible only when Status is `DONE` or `CLOSED`, `executor_plan.py validate PLAN` passes, no same-name file exists at any destination archive path, and every file to move is committed with no local edits.
- Move the plan together with the chain of documents it names as its authority, such as its specification and that specification's requirements brief. A document stays in place while any non-archived plan still cites it. A standalone artifact no active plan cites may also be archived on explicit request.
- Move each file with `git mv` so its bytes stay exact. Update live links in ADRs, skills, rules, and docs to the archive paths.
- Archived bytes are read-only; never edit an archived file, and accept that its internal links go stale.
- Automatic or lifecycle-triggered archiving, active-path removal as part of completion, and archive completion gates remain prohibited.

## Activation checks

Use this rule when materializing, copying, editing, archiving on request, or resolving an identity conflict for a repository plan. Skip plan-body design, lifecycle interpretation, approval, unrelated meanings of “plan,” and read-only historical archive review.
