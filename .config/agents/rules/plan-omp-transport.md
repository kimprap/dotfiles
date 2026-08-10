---
description: Use for materialized OMP execution plans to keep the session-local artifact authoritative while automatically mirroring and archiving only its repository projection.
---

# OMP plan artifact transport

Apply `plan.md` for plan content and lifecycle, then `plan-repo-storage.md` for its repository projection. This rule owns only OMP transport and tool selection.

| Phase | Authoritative target | Agent mechanism |
|---|---|---|
| Draft/create | `local://<slug>-plan.md`, with canonical lowercase kebab-case slug | `write` |
| Read/resume approved work | same `local://` artifact | `read` before execution |
| Track execution | plan `## Tasks` codes | `todo`, with each completed item followed by the corresponding plan `edit` |
| Incremental revision and completion record | same `local://` artifact | `edit`; verification itself uses only the plan’s named task-specific tools |
| Review/approval | approved local slug | native OMP plan review through `write` to `xd://propose` |
| Repository materialization and later sync | `.agents/plans/<Datetime>_<slug>.md` or its archived location | automatic `plan-artifact-sync`; never edit the projection directly while the local authority exists |
| Completion archival | repository projection only | the same successful local mutation synchronizes complete bytes, then automatically archives the projection when every task and verification criterion is complete, `Status: DONE`, and the final Completion Summary is nonempty |

## Activation checks

Expected matches:

- Creating, revising, approving, or executing a materialized OMP plan at `local://<slug>-plan.md`.
- Completing an OMP plan whose repository projection is managed by `plan-artifact-sync`.

Near misses:

- A repository-native `.agents/plans/*.md` plan without a session-local OMP authority.
- Non-plan Markdown, including handoffs, notes, and source summaries.
- A Grok repository- or session-backed plan; use `plan-grok-transport.md`, not OMP local-authority, projection, sync-extension, or archive mechanics.

## Native approval and synchronization

OMP's native plan review is the sole plan-execution approval authority. At each new or resumed approved start, OMP binds the exact authoritative identity and URI, complete bytes and SHA-256 revision, lifecycle status, and explicit human approval of that presentation. Missing, stale, wrong-identity, changed-byte, `DONE`, or `CLOSED` input stops natively before plan-authorized work. This adapter neither receives nor reconstructs approval from prompts, projections, receipts, or current-byte hashes.

For an Executor Plan, invoke `.config/agents/skills/dev-implementation/scripts/executor_plan.py <plan> --context omp --consumer planner` before planner publication and the same parser with `--consumer backend` before backend mutation. Bind the exact plan bytes, returned digest, and complete valid result. Missing or invalid validator evidence, parser disagreement, or a plan/digest mismatch fails closed at that semantic boundary; it does not arm a transport-wide tool blocker.

After each successful `write` or `edit`, `plan-artifact-sync` recognizes the exact local URI or a contained absolute, resolved, or `~` physical path, deduplicates identified slugs, and runs the single `sync` helper operation once per slug. The helper serializes by `<Datetime>_<slug>`, preserves active/archive ambiguity and non-symlink safety, mirrors byte-exactly, and automatically archives only the repository projection when the complete `plan.md` lifecycle is present. Later authoritative overrides update an existing archived projection in place.

A helper failure emits an identity-scoped warning, leaves the successful local authority mutation unchanged, makes no approval or reconciliation claim, and does not block unrelated tools or later identified slugs. A source race or lost acknowledgement leaves the projection unreconciled until exact current bytes are classified; there is no automatic retry, rollback, or force-write.

Full orchestration separately requires the provider-neutral Orchestrator Role Profile assessor against fresh OMP launch attestation with exact Task Contract, Executor Plan digest, authority, runtime identity, capabilities, limits, field-level live evidence, and `fallback: none`. Config, model mapping, agent discovery, or this rule cannot supply attestation. A mismatch stops `transport-unavailable` unless the exact approved one-qualified-owner sequential projection preserves every required contract.

The extension registers only its successful-mutation observer. It adds no approved-start handler, approval API, global `tool_call` state, ledger, alias, retry, force-write, alternate authority, second parser, or provider-specific exception, and it never mutates or archives the `local://` authority.
