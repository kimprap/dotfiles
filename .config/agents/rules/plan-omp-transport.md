---
description: Apply when OMP authors a local execution-plan draft and copies it into repository-owned plan storage.
---

# OMP plan transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for storage. This companion owns only the OMP adapter seam.

## Adapter contract

1. OMP writes a complete draft at `local://<slug>-plan.md` with canonical lowercase kebab-case slug. The draft contains the portable plan bytes and no OMP metadata.
2. After every successful direct-child draft `write` or `edit`, `plan-artifact-sync` invokes `omp-copy-plan-artifact copy --protocol plan-artifact-copy/v1 --slug SLUG --content-file FILE` once per changed slug in canonical order. The helper validates the exact snapshot and returns one copied success for every valid lifecycle state. One redacted `plan-artifact-sync:` warning reports any failure without blocking the completed local mutation or invoking the helper again. The same warning is appended to the successful tool result under `details.planArtifactSync`; UI notification is secondary.
3. The helper accepts only that exact operation and protocol. A missing or unknown protocol, or any obsolete invocation, is rejected before repository mutation. The extension persists structured `PLAN_SYNC_PROTOCOL_MISMATCH` failures. Concurrent sessions use distinct slugs; one slug has one writer, and this adapter supplies no same-slug lease or merge.
4. OMP native plan review remains the sole OMP plan-execution approval mechanism. Approval binds the exact active repository identity, complete bytes, lifecycle status, and explicit human decision.

The helper copies valid `PENDING`, `IN_PROGRESS`, `DONE`, and `CLOSED` bytes exactly to `.agents/plans/<Datetime>_<slug>.md`. Execution, continuation, and completion read and edit that active repository file, never the session-local draft. Validate the current active file through `executor_plan.py validate PLAN` before readiness. The draft-copy adapter supplies no approval or alternate ready transition.

The adapter never creates, replaces, or deletes a historical archive, never removes the active plan because of lifecycle state, and has no archive result or archive completion condition. Existing `.agents/plans/archive/<Datetime>_<slug>.md` files are read-only conflict surfaces governed by `plan-repo-storage.md`.

Copy success grants no approval, execution state, specialty completion, Handoff, or presentation eligibility. Storage failure remains a visible redacted warning while the successful local mutation remains successful.

## Activation checks

Use this rule when OMP creates or changes a local plan draft or executes its repository copy. Skip direct repository authoring without an OMP draft, Grok adapter mechanics, and non-plan Markdown.
