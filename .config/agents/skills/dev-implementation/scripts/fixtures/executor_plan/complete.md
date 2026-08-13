# Portable executor fixture

**Datetime**: 2026-08-09-1700
**Authority kind**: direct-repository
**Scope**: Portable plan validation fixture
**Summary**: Change one rule and its shared validator without provider-specific semantics.
**Status**: PENDING

## Objective

- Outcome: OUT-EXECUTOR-PLAN
- Observable end state: The rule and validator expose one closed portable execution contract.
- Progress signal: AC06 or AC07 advances, or a named blocker is resolved.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-PLAN | direct | authority://executor-plan | sha256:1111111111111111111111111111111111111111111111111111111111111111 | approved |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| ADR-0002 | active-2026-08-09 | Use one portable plan body and one structural parser. |

## Scope, non-goals, and prohibited effects

- Read surfaces: Rule, script, and their bounded fixtures.
- Change surfaces: The named rule and validator targets only.
- Non-goals: Runtime state, provider selection, and product semantics.
- Prohibited effects: No staging, shipping, credentials, or external mutation.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-LOCAL | repository-write | AUTH-PLAN | Named fixture targets only; reversible before delivery. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-PLAN | Portable section order | T1 | ADR-0002@active-2026-08-09 | T1, T2 |
| CONTRACT-VALIDATOR | Structural result schema | T2 | executor-plan-validation/v1 | T2 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | planner persona and complete fixture | AC06 |
| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | planner and backend preflight | AC07 |

## Execution policy

- Assurance: standard
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared lineage
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 completes before T2.
- Decomposition: no child delegation
- Effect limit: EFF-LOCAL only
- Orchestrator profile: not required for one-owner execution

## Tasks

- [ ] T1. Define the portable section contract
  - Owner: rule-worker
  - Wave: W0
  - Depends on: none
  - Targets: TGT-RULE
  - Contracts: CONTRACT-PLAN
  - Criteria: AC06
  - Effects: EFF-LOCAL
  - Output: OUTP-T1
  - Receiver: T2
  - Verification: VR-AC06
  - Lineage: shared
- [ ] T2. Implement the shared structural validator
  - Owner: validator-worker
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-SCRIPT
  - Contracts: CONTRACT-PLAN, CONTRACT-VALIDATOR
  - Criteria: AC07
  - Effects: EFF-LOCAL
  - Output: OUTP-T2
  - Receiver: T4
  - Verification: VR-AC07
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC06 | Complete portable body | One validator result is valid in each semantic harness context. | TGT-RULE | T1 |
| AC07 | Mismatched required structure | Preflight stops before mutation with exact structural issues. | TGT-SCRIPT | T2 |

## Verification / Done criteria

- [ ] VR-AC06. Validate the same complete bytes in both semantic contexts
  - Criterion: AC06
  - Proof class: independent verification
  - Scenario / environment / fixture: complete.md in each supported semantic context
  - Evidence form: valid reports with one identical plan digest
  - Target recheck: TGT-RULE
  - Receiver: verifier
- [ ] VR-AC07. Reject a load-bearing structural omission
  - Criterion: AC07
  - Proof class: independent verification
  - Scenario / environment / fixture: negative fixtures before backend mutation
  - Evidence form: invalid report with stable issue code
  - Target recheck: TGT-SCRIPT
  - Receiver: verifier

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | TGT-RULE exact revision | completed, blocked | T2 | Common Handoff from dev-handoff |
| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T4 | Common Handoff from dev-handoff |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-AUTHORITY | implementation-parent | Current exact authority and matching structural preflight | all | New authority revision and approval when semantics change | Exact approved bytes validate before mutation. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-PLAN-RULE | rule | rules/plan-impl-spec.md | Defines portable semantics. |
| ANC-VALIDATOR | script | scripts/executor_plan.py | Performs structural preflight. |

- Assumptions: none
