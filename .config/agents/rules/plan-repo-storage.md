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

## Activation checks

Use this rule when materializing, copying, editing, resolving a storage conflict for, or archiving a repository plan. Skip plan-body design, lifecycle interpretation, approval, unrelated meanings of “plan,” and read-only archive review.
