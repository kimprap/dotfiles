# Portable executor fixture

**Datetime**: 2026-08-09-1700
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
| CONTRACT-VERIFY | Independent structural proof | T3 | executor-plan-validation/v1 | T3 |
| CONTRACT-REVIEW | Final standards review | T4 | active-2026-08-09 | T4 |
| CONTRACT-LEARN | Terminal learning assessment | T5 | active-2026-08-09 | T5 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RULE | rules/plan-impl-spec.md | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | plan author and complete fixture | AC06 |
| TGT-SCRIPT | scripts/executor_plan.py | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | helper and backend readiness | AC07 |
| TGT-VERIFY | verification receipt | T3 | sha256:4444444444444444444444444444444444444444444444444444444444444444 | independent verifier | AC08 |
| TGT-REVIEW | review receipt | T4 | sha256:5555555555555555555555555555555555555555555555555555555555555555 | final reviewer | AC09 |
| TGT-LEARN | learning receipt | T5 | sha256:6666666666666666666666666666666666666666666666666666666666666666 | terminal assessor | AC10 |

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
  - Intent: Make the portable contract explicit.
  - Methods: none
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
  - Intent: Reject structurally invalid plans consistently.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-SCRIPT
  - Contracts: CONTRACT-PLAN, CONTRACT-VALIDATOR
  - Criteria: AC07
  - Effects: EFF-LOCAL
  - Output: OUTP-T2
  - Receiver: T3
  - Verification: VR-AC07
  - Lineage: shared
- [ ] T3. Verify the shared structural validator
  - Owner: dev-verification
  - Intent: Prove the resulting plan contract independently.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-VERIFY
  - Contracts: CONTRACT-VERIFY
  - Criteria: AC08
  - Effects: none
  - Output: OUTP-T3
  - Receiver: T4
  - Verification: VR-AC08
  - Lineage: shared
- [ ] T4. Review the verified plan contract
  - Owner: dev-code-review
  - Intent: Identify any outcome-relevant defect in the verified result.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-REVIEW
  - Contracts: CONTRACT-REVIEW
  - Criteria: AC09
  - Effects: none
  - Output: OUTP-T4
  - Receiver: T5
  - Verification: VR-AC09
  - Lineage: shared
- [ ] T5. Assess terminal workflow learning
  - Owner: dev-continual-learning
  - Intent: Assess whether the settled result warrants durable learning.
  - Methods: none
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-LEARN
  - Contracts: CONTRACT-LEARN
  - Criteria: AC10
  - Effects: none
  - Output: OUTP-T5
  - Receiver: dev-implementation backend
  - Verification: VR-AC10
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC06 | Complete portable body | One validation result is valid from complete repository bytes. | TGT-RULE | T1 |
| AC07 | Mismatched required structure | Validation stops before mutation with exact structural issues. | TGT-SCRIPT | T2 |
| AC08 | Structurally complete result | Independent validation reproduces the expected report. | TGT-VERIFY | T3 |
| AC09 | Verified immutable result | One final review settles without mutation. | TGT-REVIEW | T4 |
| AC10 | Settled reviewed result | One terminal assessment records the learning outcome. | TGT-LEARN | T5 |

## Verification / Done criteria

- [ ] VR-AC06. Validate the complete repository bytes once
  - Criterion: AC06
  - Proof class: independent verification
  - Scenario / environment / fixture: complete.md as an active repository plan
  - Evidence form: one valid report with the exact plan digest
  - Target recheck: TGT-RULE
  - Receiver: verifier
- [ ] VR-AC07. Reject a load-bearing structural omission
  - Criterion: AC07
  - Proof class: independent verification
  - Scenario / environment / fixture: negative fixtures before backend mutation
  - Evidence form: invalid report with stable issue code
  - Target recheck: TGT-SCRIPT
  - Receiver: verifier
- [ ] VR-AC08. Reproduce the structural result independently
  - Criterion: AC08
  - Proof class: independent verification
  - Scenario / environment / fixture: exact complete bytes in a fresh verifier
  - Evidence form: valid report and matching digest
  - Target recheck: TGT-VERIFY
  - Receiver: reviewer
- [ ] VR-AC09. Review the verified structural result
  - Criterion: AC09
  - Proof class: review
  - Scenario / environment / fixture: unchanged independently verified target
  - Evidence form: one settled review result
  - Target recheck: TGT-REVIEW
  - Receiver: assessor
- [ ] VR-AC10. Assess terminal learning
  - Criterion: AC10
  - Proof class: other authorized class
  - Scenario / environment / fixture: settled reviewed target
  - Evidence form: one terminal assessment result
  - Target recheck: TGT-LEARN
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | TGT-RULE exact revision | completed, blocked | T2 | Common Handoff from dev-handoff |
| OUTP-T2 | T2 | TGT-SCRIPT exact revision | completed, blocked, transport-unavailable | T3 | Common Handoff from dev-handoff |
| OUTP-T3 | T3 | TGT-VERIFY exact revision | completed, blocked, failed | T4 | Common Handoff from dev-handoff |
| OUTP-T4 | T4 | TGT-REVIEW exact revision | completed, blocked, authority-change-required | T5 | Common Handoff from dev-handoff |
| OUTP-T5 | T5 | TGT-LEARN exact revision | completed, blocked, transport-unavailable | dev-implementation backend | Common Handoff from dev-handoff |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-AUTHORITY | implementation-parent | Current exact authority and matching structural validation | all | New authority revision and approval when semantics change | Exact approved bytes validate before mutation. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-PLAN-RULE | rule | rules/plan-impl-spec.md | Defines portable semantics. |
| ANC-VALIDATOR | script | scripts/executor_plan.py | Performs structural and lifecycle validation. |

- Assumptions: none
