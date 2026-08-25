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
| `Authority` | `Authority ID \| Kind \| URI \| Revision \| Approval`; stable `AUTH-...` IDs and exact non-placeholder revisions/states. Project the governing authority; never expand it. |
| `Governing decisions` | `Decision ID \| Revision \| Execution effect`; only active relevant decisions and constraining rejected alternatives, referenced rather than reproduced. |
| `Scope, non-goals, and prohibited effects` | Explicit `Read surfaces`, `Change surfaces`, `Non-goals`, and `Prohibited effects`, plus `Effect ID \| Kind \| Authority \| Limit / reversibility`. Every permitted effect has a stable `EFF-...` ID; tasks may cause only referenced effects. `none` is valid only as an explicit no-effect declaration backed by the authority boundary. |
| `Fixed shared contracts` | `Contract ID \| Surface \| Owner task \| Revision \| Consumers`; stable `CONTRACT-...` IDs for fixed interface, state, data, compatibility, degraded behavior, and approved break/removal ownership. Exactly one implementation owner; all references resolve. |
| `Target map` | `Target ID \| Path / surface \| Owner task \| Base identity \| Callers / fixtures \| Criteria`; stable `TGT-...` IDs covering every changed/produced path, symbol, behavior, caller, fixture, and criterion boundary. Exactly one implementation owner; every target is tasked. |
| `Execution policy` | Declare `Assurance`, `Topology`, `Max concurrency`, `Isolation`, `Lineages`, `Fan-in task`, `Fan-in inputs`, `Contention policy`, `Decomposition`, `Effect limit`, and `Orchestrator profile`. Keep lifecycle, assurance, and topology independent. Default to one owner. Multiple isolated lineages require distinct IDs, neutral fan-in of every input, and post-fan-in proof. Missing or mismatched full-orchestration capability stops unless this section pre-approves a contract-preserving one-owner/sequential projection. |
| `Tasks` | One monotonic `T*` family. Every task has exactly one Owner, Receiver, short human Intent sentence, and Methods value; implementation leaves fit one fresh worker session. |
| `Acceptance` | `Criterion ID \| Condition / input \| Expected observable / threshold \| Surface \| Owning task`; stable `AC-...` IDs, exactly one owner each, and no duplicate or orphan. |
| `Result / Handoff` | `Output ID \| Producing task \| Artifact / identity \| Allowed outcomes \| Receiver \| Handoff contract`; each `OUTP-...` appears once, has one receiver, and uses the Common Handoff from `dev-handoff`. Outcomes and receivers stay within the Task Contract. |
| `Blockers and recovery` | `Blocker ID \| Owner \| Recovery evidence \| Affected tasks \| Revision / approval boundary \| Ready condition`; stable `BLK-...` IDs with exact recovery, dependency cone, and reapproval rule. Keep runtime attempt state out of the plan. |
| `Critical anchors and assumptions` | `Anchor ID \| Kind \| Exact reference \| Execution role`; stable `ANC-...` IDs for disambiguating paths, symbols, rules, skills, ADRs, and external contracts. Record evidenced `ASM-...` assumptions with only pre-decided fallbacks, or write exactly `Assumptions: none`. No unresolved placeholders. |

### Tasks

Use the base checkbox form and monotonic order:

```markdown
- [ ] T1. <bounded vertical task>
  - Owner: <exactly one owner>
  - Intent: <one short human sentence without IDs, paths, or procedure>
  - Methods: none | tdd
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

Dependencies form a DAG, reference earlier waves, and match topology. Every task has one implementation owner, one output, one receiver, one target, one acceptance criterion, and one proof recipe for each owned criterion. Intent is one short human sentence with no IDs, paths, or procedure. Work-task Methods is exactly `none` or `tdd`; every authored profile-tail task uses `none`. `ponytail` is reserved and rejected until a separately authorized skill exists. Workers never invent tasks, criteria, effects, contracts, or receivers. Size each implementation task to one fresh worker context using the same best-effort ~150k guidance in `plan.md`; never record or validate the estimate or invent a lifecycle task to satisfy it.

Standard and high-consequence plans may omit the numbered profile tail or append one exact final suffix owned, in order, by `dev-verification`, `dev-code-review`, and `dev-continual-learning`. A present suffix consumes those existing profile boundaries once. The last work task—or, after fan-in, the last non-tail D04 verification or integration boundary—receives the first suffix task; the suffix then forms one dependency and receiver chain, ending at `dev-implementation backend`. Without the suffix, the last non-tail task receives the existing scheduled owner `dev-verification` or `dev-implementation backend`; never invent a `T*` row solely to satisfy a Receiver. Earlier topology-required D04 verification and neutral integration tasks remain explicit and are not replaced, flattened, or repeated by either shape.

Compact work may use a direct Task Contract without an Executor Plan. If a compact plan is authored, it contains only work tasks and no numbered profile tail. Plan tasks project exact route ownership; the todo view remains a narrower phase projection and need not mirror task rows or route owners.

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

## Validation and readiness

Validate the exact active repository plan once:

```text
.config/agents/skills/dev-implementation/scripts/executor_plan.py validate PLAN
```

Consume only its `executor-plan-validation/v1` result. It enforces the portable header, ordered body, stable references, ownership, DAG/waves, effects, outputs/receivers, recovery, topology/fan-in, lifecycle records, and terminal completeness against the complete-byte revision. The result contains only `schema`, `status`, `issues`, `plan_sha256`, parsed `datetime`, `lifecycle_status`, and `terminal_complete`.

Before initial readiness, resolve the active repository plan and Task Contract and accept only a valid result with lifecycle `PENDING` or `IN_PROGRESS`, current repository bytes, and current human approval. Bind the exact approved SHA-256. On continuation, parser-valid lifecycle bookkeeping may change without reapproval; every other semantic change follows ADR-0001 D02. Structural validity supplies no approval, product or architecture authority, storage authority, or runtime state, and no adapter supplies an alternate ready transition.

## Activation checks

Use this companion for a durable plan that a later executor will use to change code or agent behavior. Skip direct execution and plans limited to investigation, verification, or cleanup.
