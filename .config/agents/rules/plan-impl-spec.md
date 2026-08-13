---
description: Apply with plan.md when drafting or revising a durable future-execution plan for code or agent-behavior changes; skip direct, investigation-only, verification-only, and cleanup-only work.
---

# Executor Plan v1

Apply `plan.md` first. It owns the H1/header, identity, lifecycle, checkboxes, completion, approval, and transport precedence. This companion owns only the portable implementation-grade body. Storage and harness companions own materialization; the backend owns runtime task state. Reference exact requirements, specifications, ADRs, tickets, or direct authority instead of copying them. Never create a semantic sidecar or duplicate header schema.

## Ordered portable body

After the base header, include each H2 exactly once in this order:

1. `Objective`
2. `Authority`
3. `Governing decisions`
4. `Scope, non-goals, and prohibited effects`
5. `Fixed shared contracts`
6. `Target map`
7. `Execution policy`
8. `Tasks`
9. `Acceptance`
10. `Verification / Done criteria`
11. `Result / Handoff`
12. `Blockers and recovery`
13. `Critical anchors and assumptions`

| Section | Required contract |
|---|---|
| `Objective` | One stable `OUT-...` ID, observable end state, and criterion- or blocker-level progress signal. Activity, elapsed time, agent count, or token use is not progress. |
| `Authority` | `Authority ID \| Kind \| URI \| Revision \| Approval`; stable `AUTH-...` IDs and exact non-placeholder revisions/states. Project authority; never expand it. |
| `Governing decisions` | `Decision ID \| Revision \| Execution effect`; only active relevant decisions and constraining rejected alternatives, referenced rather than reproduced. |
| `Scope, non-goals, and prohibited effects` | Explicit `Read surfaces`, `Change surfaces`, `Non-goals`, and `Prohibited effects`, plus `Effect ID \| Kind \| Authority \| Limit / reversibility`. Every permitted effect has a stable `EFF-...` ID; tasks may cause only referenced effects. |
| `Fixed shared contracts` | `Contract ID \| Surface \| Owner task \| Revision \| Consumers`; stable `CONTRACT-...` IDs for fixed interface, state, data, compatibility, degraded behavior, and approved break/removal ownership. Exactly one implementation owner; all references resolve. |
| `Target map` | `Target ID \| Path / surface \| Owner task \| Base identity \| Callers / fixtures \| Criteria`; stable `TGT-...` IDs covering every changed/produced path, symbol, behavior, caller, fixture, and criterion boundary. Exactly one implementation owner; every target is tasked. |
| `Execution policy` | Declare `Assurance`, `Topology`, `Max concurrency`, `Isolation`, `Lineages`, `Fan-in task`, `Fan-in inputs`, `Contention policy`, `Decomposition`, `Effect limit`, and `Orchestrator profile`. Keep lifecycle, assurance, and topology independent. Default to one owner. Multiple isolated lineages require distinct IDs, neutral fan-in of every input, and post-fan-in proof. Any one-owner/sequential downgrade must be pre-approved and contract-preserving. |
| `Acceptance` | `Criterion ID \| Condition / input \| Expected observable / threshold \| Surface \| Owning task`; stable `AC-...` IDs, exactly one owner each, and no duplicate or orphan. |
| `Result / Handoff` | `Output ID \| Producing task \| Artifact / identity \| Allowed outcomes \| Receiver \| Handoff contract`; each `OUTP-...` appears once, has one receiver, and uses the Common Handoff from `dev-handoff`. Outcomes and receivers stay within the Task Contract. |
| `Blockers and recovery` | `Blocker ID \| Owner \| Recovery evidence \| Affected tasks \| Revision / approval boundary \| Ready condition`; stable `BLK-...` IDs with exact recovery, dependency cone, and reapproval rule. Keep runtime attempt state out of the plan. |
| `Critical anchors and assumptions` | `Anchor ID \| Kind \| Exact reference \| Execution role`; stable `ANC-...` IDs for disambiguating paths, symbols, rules, skills, ADRs, and external contracts. Record evidenced `ASM-...` assumptions with only pre-decided fallbacks, or write exactly `Assumptions: none`. No unresolved placeholders. |

### Tasks

Use the base checkbox form and monotonic order:

```markdown
- [ ] T1. <bounded vertical task>
  - Owner: <exactly one owner>
  - Wave: W0
  - Depends on: none | T...
  - Targets: TGT-...
  - Contracts: CONTRACT-...
  - Criteria: AC-...
  - Effects: none | EFF-...
  - Output: OUTP-...
  - Receiver: <exactly one receiver>
  - Verification: VR-...
  - Lineage: shared | LIN-...
```

Dependencies form a DAG, reference earlier waves, and match topology. Every task has one implementation owner, output, receiver, target, acceptance criterion, and proof recipe for each owned criterion. Workers never invent tasks, criteria, effects, contracts, or receivers.

### Verification / Done criteria

```markdown
- [ ] VR-1. <proof recipe>
  - Criterion: AC-...
  - Proof class: <worker smoke | independent verification | review | other authorized class>
  - Scenario / environment / fixture: <exact recipe>
  - Evidence form: <observable artifact or result>
  - Target recheck: TGT-...
  - Receiver: <exactly one receiver>
```

Give every `AC-...` exactly one `VR-...` recipe naming its scenario/fixture, evidence, immutable target recheck, and receiver. Prove observable behavior or an explicitly authorized structural contract, not prose presence.

## Structural preflight

Before publication, run:

```text
executor_plan.py PLAN --context <omp|grok> --consumer planner
```

Consume only its `executor-plan-validation/v1` result. It enforces the base header, ordered body, stable references, ownership, DAG/waves, effects, outputs/receivers, recovery, topology/fan-in, and placeholder rules against the complete-byte revision. Context never infers authority.

Before backend readiness, the transport invokes the same file with `--consumer backend` and current `--slug`, `--repository-root`, `--local-root`, and `--local-plan` locators. Only a fresh `executor-plan-preflight/v1` `eligible` result with valid nested structure and matching current/native-approved digests may advance. Structural validity alone supplies no provenance, approval, product/architecture authority, storage authority, or runtime state.

## Activation checks

Use this companion for a durable plan that a later executor will use to change code or agent behavior. Skip direct execution and plans limited to investigation, verification, or cleanup.
