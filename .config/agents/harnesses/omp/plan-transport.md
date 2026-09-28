# OMP plan transport

OMP host adapter for the [plan rule](../../rules/plan.md). The plan rule owns
identity, lifecycle, the active path, validation, identity conflicts, and what
persistence grants; this file owns only OMP's local-draft copy mechanics.

## Adapter contract

1. OMP writes a complete draft at `local://<slug>-plan.md` with canonical lowercase kebab-case slug. The draft contains the portable plan bytes and no OMP metadata.
2. After every successful direct-child draft `write` or `edit`, `plan-artifact-sync` invokes `omp-copy-plan-artifact copy --protocol plan-artifact-copy/v1 --slug SLUG --content-file FILE` once per changed slug in canonical order. The helper validates the exact snapshot and returns one copied success for every valid lifecycle state. One redacted `plan-artifact-sync:` warning reports any failure without blocking the completed local mutation or invoking the helper again. The same warning is appended to the successful tool result under `details.planArtifactSync`; UI notification is secondary.
3. The helper accepts only that exact operation and protocol. A missing or unknown protocol, or any obsolete invocation, is rejected before repository mutation. The extension persists structured `PLAN_SYNC_PROTOCOL_MISMATCH` failures. Concurrent sessions use distinct slugs; one slug has one writer, and this adapter supplies no same-slug lease or merge.
4. OMP native plan review remains the sole OMP plan-execution approval mechanism. Approval binds the exact active repository identity, complete bytes, lifecycle status, and explicit human decision.

## Snapshot copy

- Snapshot one complete regular non-symlink local draft after each successful adapter-owned mutation. Validate that exact snapshot with `executor_plan.py validate PLAN`; derive Datetime and lifecycle only from its valid result.
- For every valid `PENDING`, `IN_PROGRESS`, `DONE`, or `CLOSED` snapshot, copy the bytes exactly to the active path `.agents/plans/<Datetime>_<slug>.md` with a same-directory staged atomic replacement.
- Recheck the source, the active target, the plan rule's second identity path, and the exact-byte active result around publication. Both identity paths present, any existing second identity, parser-invalid bytes, an unsafe file kind, source or target drift, or an uncertain active publication result fails visibly.
- The adapter has one copied success result. Storage failure remains a visible redacted warning while the successful local mutation remains successful.
