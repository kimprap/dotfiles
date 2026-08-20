# Portable fan-in executor fixture

**Datetime**: 2026-08-19-1200
**Authority kind**: direct-repository
**Scope**: Portable isolated-lineage plan validation fixture
**Summary**: Preserve lineage verification and neutral integration before one optional numbered profile tail.
**Status**: PENDING

## Objective

- Outcome: OUT-FAN-IN-PLAN
- Observable end state: Both isolated lineages are verified and integrated before the profile tail.
- Progress signal: One criterion passes or a named blocker is resolved.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-FAN-IN | direct | authority://fan-in-plan | sha256:1111111111111111111111111111111111111111111111111111111111111111 | approved |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-FAN-IN | active-2026-08-19 | Preserve both verification lineages and neutral integration. |

## Scope, non-goals, and prohibited effects

- Read surfaces: The bounded lineage fixtures and shared parser.
- Change surfaces: The named fixture targets only.
- Non-goals: Runtime scheduling and provider-specific behavior.
- Prohibited effects: No staging, shipping, credentials, or external mutation.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-FIXTURE | repository-write | AUTH-FAN-IN | Named fixture targets only; reversible before delivery. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-A | First lineage result | T1 | active-2026-08-19 | T1 |
| CONTRACT-B | Second lineage result | T2 | active-2026-08-19 | T2 |
| CONTRACT-VERIFY-A | First lineage verification | T3 | active-2026-08-19 | T3 |
| CONTRACT-VERIFY-B | Second lineage verification | T4 | active-2026-08-19 | T4 |
| CONTRACT-INTEGRATE | Neutral fan-in | T5 | active-2026-08-19 | T5 |
| CONTRACT-PROFILE-VERIFY | Profile verification | T6 | active-2026-08-19 | T6 |
| CONTRACT-PROFILE-REVIEW | Profile review | T7 | active-2026-08-19 | T7 |
| CONTRACT-PROFILE-LEARN | Terminal learning | T8 | active-2026-08-19 | T8 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-A | lineage-a result | T1 | sha256:2222222222222222222222222222222222222222222222222222222222222222 | first verifier | AC01 |
| TGT-B | lineage-b result | T2 | sha256:3333333333333333333333333333333333333333333333333333333333333333 | second verifier | AC02 |
| TGT-VERIFY-A | lineage-a receipt | T3 | sha256:4444444444444444444444444444444444444444444444444444444444444444 | fan-in | AC03 |
| TGT-VERIFY-B | lineage-b receipt | T4 | sha256:5555555555555555555555555555555555555555555555555555555555555555 | fan-in | AC04 |
| TGT-INTEGRATE | integrated result | T5 | sha256:6666666666666666666666666666666666666666666666666666666666666666 | profile verifier | AC05 |
| TGT-PROFILE-VERIFY | profile receipt | T6 | sha256:7777777777777777777777777777777777777777777777777777777777777777 | reviewer | AC06 |
| TGT-PROFILE-REVIEW | review receipt | T7 | sha256:8888888888888888888888888888888888888888888888888888888888888888 | assessor | AC07 |
| TGT-PROFILE-LEARN | learning receipt | T8 | sha256:9999999999999999999999999999999999999999999999999999999999999999 | backend | AC08 |

## Execution policy

- Assurance: standard
- Topology: isolated-lineages
- Max concurrency: 2
- Isolation: distinct worktrees
- Lineages: LIN-A, LIN-B
- Fan-in task: T5
- Fan-in inputs: T3, T4
- Contention policy: Lineages remain disjoint until neutral fan-in.
- Decomposition: Each lineage and assurance boundary has one owner.
- Effect limit: EFF-FIXTURE only
- Orchestrator profile: Full orchestration preserves both lineage inputs.

## Tasks

- [ ] T1. Implement the first lineage
  - Owner: worker-a
  - Intent: Produce the first isolated result.
  - Methods: tdd
  - Wave: W0
  - Depends on: none
  - Targets: TGT-A
  - Contracts: CONTRACT-A
  - Criteria: AC01
  - Effects: EFF-FIXTURE
  - Output: OUTP-T1
  - Receiver: T3
  - Verification: VR-AC01
  - Lineage: LIN-A
- [ ] T2. Implement the second lineage
  - Owner: worker-b
  - Intent: Produce the second isolated result.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-B
  - Contracts: CONTRACT-B
  - Criteria: AC02
  - Effects: EFF-FIXTURE
  - Output: OUTP-T2
  - Receiver: T4
  - Verification: VR-AC02
  - Lineage: LIN-B
- [ ] T3. Verify the first lineage
  - Owner: dev-verification
  - Intent: Prove the first lineage independently.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-VERIFY-A
  - Contracts: CONTRACT-VERIFY-A
  - Criteria: AC03
  - Effects: none
  - Output: OUTP-T3
  - Receiver: T5
  - Verification: VR-AC03
  - Lineage: LIN-A
- [ ] T4. Verify the second lineage
  - Owner: dev-verification
  - Intent: Prove the second lineage independently.
  - Methods: none
  - Wave: W1
  - Depends on: T2
  - Targets: TGT-VERIFY-B
  - Contracts: CONTRACT-VERIFY-B
  - Criteria: AC04
  - Effects: none
  - Output: OUTP-T4
  - Receiver: T5
  - Verification: VR-AC04
  - Lineage: LIN-B
- [ ] T5. Integrate every verified lineage
  - Owner: dev-integration
  - Intent: Combine both verified lineages neutrally.
  - Methods: none
  - Wave: W2
  - Depends on: T3, T4
  - Targets: TGT-INTEGRATE
  - Contracts: CONTRACT-INTEGRATE
  - Criteria: AC05
  - Effects: none
  - Output: OUTP-T5
  - Receiver: T6
  - Verification: VR-AC05
  - Lineage: shared
- [ ] T6. Verify the integrated result
  - Owner: dev-verification
  - Intent: Prove the integrated result independently.
  - Methods: none
  - Wave: W3
  - Depends on: T5
  - Targets: TGT-PROFILE-VERIFY
  - Contracts: CONTRACT-PROFILE-VERIFY
  - Criteria: AC06
  - Effects: none
  - Output: OUTP-T6
  - Receiver: T7
  - Verification: VR-AC06
  - Lineage: shared
- [ ] T7. Review the verified result
  - Owner: dev-code-review
  - Intent: Identify any outcome-relevant defect in the verified result.
  - Methods: none
  - Wave: W4
  - Depends on: T6
  - Targets: TGT-PROFILE-REVIEW
  - Contracts: CONTRACT-PROFILE-REVIEW
  - Criteria: AC07
  - Effects: none
  - Output: OUTP-T7
  - Receiver: T8
  - Verification: VR-AC07
  - Lineage: shared
- [ ] T8. Assess terminal learning
  - Owner: dev-continual-learning
  - Intent: Assess whether the settled result warrants durable learning.
  - Methods: none
  - Wave: W5
  - Depends on: T7
  - Targets: TGT-PROFILE-LEARN
  - Contracts: CONTRACT-PROFILE-LEARN
  - Criteria: AC08
  - Effects: none
  - Output: OUTP-T8
  - Receiver: dev-implementation backend
  - Verification: VR-AC08
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC01 | First lineage authority | The first result satisfies its contract. | TGT-A | T1 |
| AC02 | Second lineage authority | The second result satisfies its contract. | TGT-B | T2 |
| AC03 | First lineage result | Independent verification passes. | TGT-VERIFY-A | T3 |
| AC04 | Second lineage result | Independent verification passes. | TGT-VERIFY-B | T4 |
| AC05 | Both verified lineages | Neutral integration consumes both inputs. | TGT-INTEGRATE | T5 |
| AC06 | Integrated result | Profile verification passes once. | TGT-PROFILE-VERIFY | T6 |
| AC07 | Verified integrated result | One final review settles. | TGT-PROFILE-REVIEW | T7 |
| AC08 | Settled reviewed result | One terminal assessment records the outcome. | TGT-PROFILE-LEARN | T8 |

## Verification / Done criteria

- [ ] VR-AC01. Check the first result
  - Criterion: AC01
  - Proof class: worker smoke
  - Scenario / environment / fixture: first isolated lineage
  - Evidence form: passing result receipt
  - Target recheck: TGT-A
  - Receiver: first verifier
- [ ] VR-AC02. Check the second result
  - Criterion: AC02
  - Proof class: worker smoke
  - Scenario / environment / fixture: second isolated lineage
  - Evidence form: passing result receipt
  - Target recheck: TGT-B
  - Receiver: second verifier
- [ ] VR-AC03. Verify the first lineage
  - Criterion: AC03
  - Proof class: independent verification
  - Scenario / environment / fixture: first lineage result
  - Evidence form: independent receipt
  - Target recheck: TGT-VERIFY-A
  - Receiver: fan-in owner
- [ ] VR-AC04. Verify the second lineage
  - Criterion: AC04
  - Proof class: independent verification
  - Scenario / environment / fixture: second lineage result
  - Evidence form: independent receipt
  - Target recheck: TGT-VERIFY-B
  - Receiver: fan-in owner
- [ ] VR-AC05. Check neutral integration
  - Criterion: AC05
  - Proof class: worker smoke
  - Scenario / environment / fixture: both verified lineage receipts
  - Evidence form: integrated result receipt
  - Target recheck: TGT-INTEGRATE
  - Receiver: profile verifier
- [ ] VR-AC06. Verify the integrated result
  - Criterion: AC06
  - Proof class: independent verification
  - Scenario / environment / fixture: integrated immutable result
  - Evidence form: profile verification receipt
  - Target recheck: TGT-PROFILE-VERIFY
  - Receiver: reviewer
- [ ] VR-AC07. Review the verified result
  - Criterion: AC07
  - Proof class: review
  - Scenario / environment / fixture: verified integrated result
  - Evidence form: settled review result
  - Target recheck: TGT-PROFILE-REVIEW
  - Receiver: assessor
- [ ] VR-AC08. Assess terminal learning
  - Criterion: AC08
  - Proof class: other authorized class
  - Scenario / environment / fixture: settled reviewed result
  - Evidence form: terminal assessment result
  - Target recheck: TGT-PROFILE-LEARN
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | TGT-A exact revision | completed, blocked | T3 | Common Handoff from dev-handoff |
| OUTP-T2 | T2 | TGT-B exact revision | completed, blocked | T4 | Common Handoff from dev-handoff |
| OUTP-T3 | T3 | TGT-VERIFY-A receipt | completed, blocked, failed | T5 | Common Handoff from dev-handoff |
| OUTP-T4 | T4 | TGT-VERIFY-B receipt | completed, blocked, failed | T5 | Common Handoff from dev-handoff |
| OUTP-T5 | T5 | TGT-INTEGRATE exact revision | completed, blocked | T6 | Common Handoff from dev-handoff |
| OUTP-T6 | T6 | TGT-PROFILE-VERIFY receipt | completed, blocked, failed | T7 | Common Handoff from dev-handoff |
| OUTP-T7 | T7 | TGT-PROFILE-REVIEW receipt | completed, blocked, authority-change-required | T8 | Common Handoff from dev-handoff |
| OUTP-T8 | T8 | TGT-PROFILE-LEARN receipt | completed, blocked, transport-unavailable | dev-implementation backend | Common Handoff from dev-handoff |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-FAN-IN | implementation-parent | Current lineage receipts and exact authority | all | New authority revision and approval when semantics change | Both lineage boundaries validate before fan-in. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-PARSER | script | scripts/executor_plan.py | Enforces the shared structural contract. |
| ANC-FAN-IN | fixture | scripts/fixtures/executor_plan/fan_in.md | Exercises topology-aware suffix validation. |

- Assumptions: none
