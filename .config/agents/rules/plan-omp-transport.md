---
description: Apply to OMP materialized execution plans whose session-local authority is mirrored and archived only as a repository projection.
---

# OMP plan artifact transport

Apply `plan.md`, `plan-impl-spec.md` for implementation plans, and `plan-repo-storage.md` for repository projection. This companion owns only OMP transport and tool selection.

| Phase | Authoritative target | Mechanism |
|---|---|---|
| Create | `local://<slug>-plan.md`; lowercase kebab-case slug; `Authority kind: local-authority` | `write` |
| Read/resume | Same valid local artifact | `read` before execution |
| Execute/update | Stable `## Tasks` codes in the local artifact | `todo`, then corresponding `edit`; use task-specific tools for proof |
| Review/approve | Exact local slug and revision | Native OMP plan review via `write` to `xd://propose` |
| Materialize/sync | `.agents/plans/<Datetime>_<slug>.md` or its archive path | Automatic `plan-artifact-sync`; never edit the projection while local authority exists |
| Complete | Local authority remains in place; repository projection alone is archived | Final successful local mutation syncs complete bytes and archives only after every task/criterion, `Status: DONE`, and a nonempty Completion Summary |

## Approval and readiness

- OMP native review is the sole plan-execution approval authority. Each new or resumed start binds the exact authority identity/URI, complete bytes and SHA-256 revision, lifecycle status, and explicit human approval. Missing/stale approval, identity or byte drift, and `DONE`/`CLOSED` stop before plan-authorized work. The provenance marker never approves.
- OMP-created session authority uses `local-authority`; repository-native authority uses `direct-repository`. Actual verified location selects it; `context=omp` and the sync extension do not.
- Executor Plan publication runs `executor_plan.py PLAN --context omp --consumer planner` without locators and consumes only `executor-plan-validation/v1`.
- Before readiness, OMP binds the current canonical repository root, session-local root, exact `<slug>-plan.md` counterpart, slug, and presented authority path, then runs `executor_plan.py PLAN --context omp --consumer backend --slug SLUG --repository-root ABS_REPOSITORY_ROOT --local-root ABS_LOCAL_ROOT --local-plan ABS_LOCAL_PLAN`. `PLAN` presents the exact local path or direct active/archive path; the same local counterpart is always supplied, including when safely absent.
- Only a fresh `executor-plan-preflight/v1` `eligible` result whose locator identity and current top-level/nested digests match the same Context Pack and unchanged native-approved revision may advance. A planner result, missing locator, marker, sync receipt, prior result, or approval alone cannot mark a task ready. Preflight accepts no approval or role assertion.

## Synchronization boundary

- After each successful local-authority `write` or `edit`, `plan-artifact-sync` passes the exact slug and bytes once to the repository helper. The extension identifies paths only; the helper owns validation, generation locking, byte-exact publication, replacement, archival, and postconditions from `plan-repo-storage.md`.
- The helper permits only absence or a valid same-identity local projection. Direct, unclassified, invalid, ambiguous, unsafe, stale, or lock-failed state returns one warning and no inferred recovery. Treat `effect=none|possible-complete` exactly; never auto-retry, roll back, force-write, adopt, promote, or infer success from equality.
- A direct-repository create, replace, or archive must use the shared repository generation protocol; inability to honor it blocks the write.
- The extension never approves, mutates, or archives the `local://` authority and adds no second parser, ledger, approval handler, fallback, alias, or alternate authority.

## Orchestration capability

Full orchestration separately requires a fresh provider-neutral Orchestrator Role Profile assessment against live OMP launch evidence. Config, model overrides, agent discovery, and this rule cannot attest capability. On mismatch, stop `transport-unavailable` unless the exact plan approves a contract-preserving one-qualified-owner sequential projection.

## Activation checks

Use this rule for creating, revising, approving, executing, or completing `local://<slug>-plan.md` and its managed projection. Skip repository-native plans without local OMP authority, Grok plans, and non-plan Markdown.
