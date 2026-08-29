---
description: Apply when materializing, copying, editing, or archiving an execution plan under .agents/plans.
---

# Repository plan storage

Apply `plan.md` first. This companion owns repository identity, location, exact-byte copying, and archival under `.agents/plans/`; it does not own plan content, lifecycle meaning, approval, or runtime state.

## Identity and paths

- A repository plan's sole identity is `<Datetime>_<slug>`, using its immutable header Datetime and canonical lowercase kebab-case slug.
- Active path: `.agents/plans/<Datetime>_<slug>.md`.
- Archive path: `.agents/plans/archive/<Datetime>_<slug>.md`.
- The active repository file is the only execution, update, and continuation source. A harness-local file may supply draft bytes to its adapter, never an execution source.
- Inspect only the two exact identity paths. Both present is a visible storage conflict; preserve both and stop. Reserve both directories for deliberate plan files.

## Local draft copying

- Snapshot one complete regular non-symlink local draft after each successful adapter-owned mutation. Validate that exact snapshot with `executor_plan.py validate PLAN`; derive Datetime and lifecycle only from its valid result.
- For `PENDING` or `IN_PROGRESS`, copy the snapshot byte-for-byte to the active path with a same-directory staged atomic replacement. Recheck the source, target, and exact-byte postcondition.
- For parser-valid terminal `DONE` or `CLOSED`, create the archive without overwrite from the same snapshot, confirm exact bytes, then remove the regular active path. An already identical archive with no active path returns the same successful result.
- Both paths present, a divergent archive, parser-invalid bytes, an unsafe file kind, drift, or an uncertain postcondition fails visibly. Never overwrite a conflicting archive or infer success from equality alone.

## Direct repository editing

- Harnesses without a local-draft adapter create and edit the active path directly with ordinary repository tools, then validate that exact file with `executor_plan.py validate PLAN`.
- After a direct active plan becomes parser-valid terminal state, an ordinary storage action may move its complete bytes to the archive path only when the destination is absent and the resulting archive is byte-identical. Preserve the active file on any failure.
- Copying or archival grants no approval, runtime transition, completion, or presentation eligibility. A storage error remains visible but does not replace specialty completion evidence.

## Caller-supplied terminal trigger

- The lifecycle caller supplies a terminal trigger only when its initial exact plan validation observed `PENDING` or `IN_PROGRESS` and the same run changes that plan to parser-valid `DONE` or human-authorized `CLOSED`. This storage layer does not infer ownership, retain a transition marker, scan terminal files, reconcile identity paths, or perform a historical sweep.
- The caller requests the existing archive operation only after the applicable terminal bytes are complete and validated. A current successful local-draft archive result may satisfy the required postcondition without a second action; direct repository callers use the ordinary action above.
- The caller validates success as active identity path absent plus archive identity path present as a regular non-symlink file whose complete bytes equal the exact terminal snapshot. Storage remains non-authorizing and is not readiness, approval, semantic completion evidence, a task, or a stage, but this postcondition is required before completion presentation or cancellation-close output.
- After success, planned completion binds `resume_from` only to the archive identity path followed by `@sha256:`, the lowercase SHA-256 of those exact archived bytes, and `#completion-summary`. Already-`DONE` or already-`CLOSED` intake and planless work supply no trigger and perform no repository-plan lookup, archive action, receipt request, reconciliation, or mutation.
- On both-path conflict, divergent archive, parser-invalid terminal bytes, unsafe file kind, source or target drift, or uncertain postcondition, preserve the exact source and destination paths, kinds, and bytes and return the existing visible storage failure. Do not overwrite, blindly retry without changed evidence, continue semantic work, emit another Handoff, present completion, issue cancellation close, or speculatively revert terminal bytes.

## Activation checks

Use this rule when materializing, copying, editing, resolving a storage conflict for, or archiving a repository plan. Skip plan-body design, lifecycle interpretation, approval, unrelated meanings of “plan,” and read-only archive review.
