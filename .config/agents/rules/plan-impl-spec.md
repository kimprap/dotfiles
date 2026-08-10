---
description: Companion to plan.md for drafting or revising handoff-grade coding implementation plans. Apply only while writing a durable future-execution plan for code or agent-behavior changes; skip verification-only, investigation-only, cleanup-only, or direct-execution work.
---

# Executor Plan v1

Apply the base `plan.md` execution-plan contract first. It owns identity, lifecycle, task checkboxes, verification checkboxes, completion, approval separation, and transport precedence. This companion owns only the portable implementation-grade body. Repository and harness companions continue to own storage, projection, synchronization, and archive mechanics; the backend alone owns runtime task state. Do not create a semantic sidecar.

## When to apply this rule

- Apply it when authoring or revising a durable plan whose later executor will change code or agent behavior.
- Do not apply it to verification-only, investigation-only, cleanup-only, or direct-execution work merely because an engineering skill is active.
- Link exact requirements, specification, ADR, ticket, or direct-authority revisions instead of copying their canonical content.

## Ordered portable body

After the base header metadata, use each of these H2 sections exactly once and in this order:

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

### Objective

Name one stable `OUT-...` ID, the observable end state, and the criterion- or blocker-level progress signal. Activity, another plan, elapsed time, agent count, or token use is not progress.

### Authority

Use a table with `Authority ID`, `Kind`, `URI`, `Revision`, and `Approval`. Every row has a stable `AUTH-...` ID and an exact non-placeholder revision and approval state. Plans project this authority and never expand it.

### Governing decisions

Use a table with `Decision ID`, `Revision`, and `Execution effect`. Include only active decisions relevant to this plan and the exact rejected alternatives that constrain execution. Capture approved outputs of requirements, specification, ticketing, design, diagnosis, prototyping, grilling, domain modeling, or other named owner skills by reference rather than reproducing their procedures.

### Scope, non-goals, and prohibited effects

State `Read surfaces`, `Change surfaces`, `Non-goals`, and `Prohibited effects` explicitly. Declare every permitted effect in an `Effect ID | Kind | Authority | Limit / reversibility` table with stable `EFF-...` IDs. A task may cause only effects it references; `none` is valid only as an explicit no-effect declaration backed by the authority boundary.

### Fixed shared contracts

Use a `Contract ID | Surface | Owner task | Revision | Consumers` table with stable `CONTRACT-...` IDs. Record interface, state, data, compatibility, degraded behavior, and approved break/removal ownership that must remain fixed across owners. Every contract has exactly one implementation owner and every task reference resolves.

### Target map

Use a `Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria` table with stable `TGT-...` IDs. Include every changed or produced path, symbol, behavior surface, caller, fixture, and criterion boundary. Every target has exactly one implementation owner and is referenced by at least one task.

### Execution policy

Declare `Assurance`, `Topology`, `Max concurrency`, `Isolation`, `Lineages`, `Fan-in task`, `Fan-in inputs`, `Contention policy`, `Decomposition`, `Effect limit`, and `Orchestrator profile`. Keep lifecycle depth, assurance, and topology independent. One owner is the default. Multiple isolated lineages require distinct lineage IDs, a neutral fan-in task, every lineage input, and post-fan-in proof. A contract-preserving one-owner/sequential projection must be pre-approved here; otherwise missing or mismatched full-orchestration capability stops.

### Tasks

Keep the base checkbox form and monotonic order:

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

Dependencies must form a DAG, reference earlier waves, and match the declared topology. Every task has exactly one implementation owner, one declared output, one receiver, at least one target and acceptance criterion, and a proof recipe for each owned criterion. Workers do not invent tasks, criteria, effects, shared contracts, or receivers.

### Acceptance

Use a `Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task` table with stable `AC-...` IDs. Each criterion has exactly one implementation owner, appears in that task and its target mapping, and is not duplicated or orphaned.

### Verification / Done criteria

Keep the base checkbox form:

```markdown
- [ ] VR-1. <proof recipe>
  - Criterion: AC-...
  - Proof class: <worker smoke | independent verification | review | other authorized class>
  - Scenario / environment / fixture: <exact recipe>
  - Evidence form: <observable artifact or result>
  - Target recheck: TGT-...
  - Receiver: <exactly one receiver>
```

Every acceptance criterion has exactly one `VR-...` recipe. Recipes name the scenario, environment or fixture, evidence form, immutable target recheck, and receiver. They test observable behavior or an explicitly authorized structural contract, not merely prose presence.

### Result / Handoff

Use an `Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract` table with stable `OUTP-...` IDs. Every task output appears exactly once, names one receiver, and uses the one Common Handoff from `dev-handoff`; do not define a second envelope. Allowed outcomes and receivers cannot exceed the Task Contract.

### Blockers and recovery

Use a `Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition` table with stable `BLK-...` IDs. Include exact recovery for capability, dependency, authority, partial-effect, or other plan-relevant stops. Recovery names the affected dependency cone and whether a new revision or approval is required. Runtime attempt state stays out of the plan.

### Critical anchors and assumptions

Use an `Anchor ID | Kind | Exact reference | Execution role` table with stable `ANC-...` IDs for paths, symbols, rules, skills, ADRs, or external contracts that disambiguate execution. Record assumptions as stable `ASM-...` bullets with evidence and only pre-decided fallbacks; when there are none, write exactly `Assumptions: none`. Leave no open implementation choice or unresolved placeholder.

## Structural preflight

Before a planner publishes the plan and before the backend marks any projected task ready, run the one provider-neutral structural validator owned by `dev-implementation`. Both semantic harness contexts use the same parser and contract. The validator checks only required unique sections, stable IDs, checkbox shape, DAG/waves, reference and ownership closure, effects, outputs/receiver, recovery, isolated-lineage topology/fan-in, and unresolved placeholders. It does not approve product or architecture semantics, judge whether an observable is desirable, grant execution authority, or write runtime state.
