---
description: Apply when OMP authors a local execution-plan draft and copies it into repository-owned plan storage.
---

# OMP plan transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for storage. This companion owns only the OMP adapter seam.

## Adapter contract

1. OMP writes a complete draft at `local://<slug>-plan.md` with canonical lowercase kebab-case slug. The draft contains the portable plan bytes and no OMP metadata.
2. After every successful direct-child draft `write` or `edit`, `plan-artifact-sync` invokes `omp-copy-plan-artifact copy --protocol plan-artifact-copy/v1 --slug SLUG --content-file FILE` once per changed slug in canonical order. The helper validates the exact snapshot and returns only copied or archived success; one redacted `plan-artifact-sync:` warning reports any failure without blocking the completed local mutation or invoking the helper again. The same warning is appended to the successful tool result under `details.planArtifactSync`; UI notification is secondary.
3. The helper accepts only that exact operation and protocol. A missing or unknown protocol, or any obsolete invocation, is rejected before repository mutation. The current extension persists structured `PLAN_SYNC_PROTOCOL_MISMATCH` failures. Concurrent sessions use distinct slugs; one slug has one writer, and this adapter supplies no same-slug lease or merge.
4. OMP native plan review remains the sole OMP plan-execution approval mechanism. Approval binds the exact active repository identity, complete bytes, SHA-256, lifecycle status, and explicit human decision.

Execution and continuation read and edit `.agents/plans/<Datetime>_<slug>.md`, never the session-local draft. Validate the current repository file through `executor_plan.py validate PLAN` before readiness. The draft-copy adapter supplies no approval or alternate ready transition.

Copy or archive success grants no approval, execution state, specialty completion, Handoff, or presentation eligibility. `completion-presentation`, not this adapter, may proceed before archive only when the parser-valid terminal active repository plan remains readable, the current Common Handoff exists, and `Resume from` binds that active file's exact SHA-256. Without either a durable archive or that active-plan durability, generic completion presentation cannot proceed.

Full orchestration separately requires a current provider-neutral Orchestrator Role Profile. For every approved parser-valid implementation plan, bind a fresh attestation and use `assess-plan-backed`; continue only on `full-orchestration` with `downgrade: none`. OMP plan transport never attests capability, authorizes root work, or supplies a fallback topology. Under `PROMOTE-SERIAL-DEFAULT`, native child dispatch uses full orchestration with runtime concurrency one by default, not a sequential-child mode, and makes no general efficiency claim.

## Activation checks

Use this rule when OMP creates or changes a local plan draft or executes its repository copy. Skip direct repository authoring without an OMP draft, Grok adapter mechanics, and non-plan Markdown.
