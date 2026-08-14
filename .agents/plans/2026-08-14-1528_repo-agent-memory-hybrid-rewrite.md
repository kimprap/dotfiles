# Repository agent-memory hybrid plan rewrite

**Datetime**: 2026-08-14-1528
**Authority kind**: direct-repository
**Scope**: Same-identity revision of the existing dotfiles memory design plan for the OptMem hybrid command surface and ownership model
**Summary**: Revise only `2026-08-14-1038_repo-agent-memory-canonical-artifact-integration.md` so the hybrid command surface and ownership model are explicit. Implement no memory, loader, service, or Atlas write.
**Status**: PENDING

## Objective

- Outcome: OUT-DOTFILES-HYBRID-PLAN-REWRITE
- Observable end state: The exact existing 1038 direct-repository plan is PENDING at a new SHA-256, still investigation-only, and its bytes state the hybrid command surface and ownership model below. No other artifact changes.
- Progress signal: One newly satisfied AC-... criterion, one exact blocker-resolution result, or one evidence-backed authority change.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-1038 | existing direct-repository plan | `/Users/kim/.dotfiles/.agents/plans/2026-08-14-1038_repo-agent-memory-canonical-artifact-integration.md` | SHA-256 `3e028e1bcbfc3cebc2b64c45a40b82b0575cd9429e38c99d2f3517f6ab75b597` | Current design authority only. It does not approve this revision. |
| AUTH-RECOVERY | recovery handoff | `/Users/kim/.omp/agent/sessions/-dev-atlas-app/2026-08-13T16-03-28-057Z_019ffbdd-3cb9-7000-9660-91cb64d7698d/local/atlas-explicit-reroute-recovery-handoff-v1.md` | SHA-256 `967ed788d98611fe64c1b3217bb3bbe82d4aebfcde8e3d16d16b1a89780649db` | Requested the 1038 hybrid revision. It is not plan-write authority. |
| AUTH-DESTAGE | destaged sibling engineering plan | `/Users/kim/dev/atlas/app/.agents/plans/2026-08-14-1528_atlas-explicit-reroute-destaged-recovery.md` | Exact published sibling revision after materialization | Separates Atlas repair from this rewrite. This graph does not depend on that plan's completion. |
| AUTH-PLAN-REVIEW | native plan-execution review | `/Users/kim/.dotfiles/.agents/plans/2026-08-14-1528_repo-agent-memory-hybrid-rewrite.md` | Exact published complete-byte revision bound after materialization | Not approved at creation. Every start requires native approval of the exact path, bytes, SHA-256, and PENDING status. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-SAME-IDENTITY | AUTH-1038 exact revision | Revise 1038 in place. Preserve Datetime 2026-08-14-1038, Authority kind direct-repository, and Status PENDING. Create no archive, no local counterpart, and no second 1038 identity. |
| DEC-INVESTIGATION-ONLY | AUTH-1038 header and Authority section | After revision, 1038 remains investigation and design only. rule://plan-impl-spec stays unactivated on 1038. This rewrite grants no implementation, migration, activation, ingestion, delivery, or shipping. |
| DEC-HYBRID-SURFACE | AUTH-1038 Keep and Exclude plus AUTH-RECOVERY requested hybrid outcome | `/atlas-ask` remains the sole public Atlas behavior for living topic work, including later OptMem inclusion in agent-memory. Repository residual memory has no Atlas write and no new slash command, owner command, alias, or combined Atlas-memory command. OptMem the GitHub project is a cited source, not a runtime, loader, daemon, or retrieval service. Residual promotion stays on dev-continual-learning after a settled outcome. |
| DEC-HYBRID-OWNERSHIP | AUTH-1038 six-area owner matrix | The six canonical owners stay exclusive. Atlas agent-memory is living research, not a seventh canonical owner and not residual memory. Residual records remain leftover lessons with no better owner. Exactly one writer per artifact. Index, recall, and retrieval aids never write. |
| DEC-PRESERVE-1038-CONTRACTS | AUTH-1038 Keep, Exclude, Residual memory purpose, Session injection, and Lifecycle | Keep those sections unless a sentence would create a dual writer or a new command. Do not weaken candidate or promotion separation, conflict blocking, evidence-based staleness, or deterministic index rebuild. |
| DEC-INDEPENDENT | AUTH-DESTAGE | This rewrite does not wait for Atlas repair or living OptMem inclusion. It does not mutate Atlas or the destaged recovery plan. |
| DEC-NO-DELIVERY | AUTH-1038 Non-goals and safety | Commit, push, release, deploy, ship, credential use, and user-level guidance mutation remain unapproved. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-1038 complete bytes, AUTH-RECOVERY requested hybrid outcome, current plan rules, and exact active, archive, and local counterpart paths for identity 2026-08-14-1038.
- Change surfaces: only the exact active 1038 path under the direct-repository generation protocol.
- Non-goals: implementing memory, activating a loader, creating a second plan identity, revising the destaged Atlas recovery plan, living Atlas I/O, delivery, and shipping.
- Prohibited effects: No task starts before AUTH-PLAN-REVIEW is satisfied. Never overwrite a drifted, ambiguous, unsafe, or locally conflicted 1038 identity. Never archive 1038. Never implement or activate memory.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-1038-REVISION | existing direct-plan revision | AUTH-1038, AUTH-PLAN-REVIEW | Replace only the exact active same-identity 1038 bytes after fresh classification. Preserve immutable datetime and authority kind. Keep PENDING. Create no archive or local counterpart. Reversible as an unshipped working-tree delta. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-HYBRID | Hybrid command surface and ownership model to materialize in 1038 | T1 | DEC-HYBRID-SURFACE and DEC-HYBRID-OWNERSHIP | T2 |
| CONTRACT-1038-IDENTITY | Same-identity direct-repository storage, header immutables, PENDING, archive absent, local counterpart absent | T1 | AUTH-1038 plus rule://plan-repo-storage | T2 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-1038 | `/Users/kim/.dotfiles/.agents/plans/2026-08-14-1038_repo-agent-memory-canonical-artifact-integration.md` | T1 | SHA-256 `3e028e1bcbfc3cebc2b64c45a40b82b0575cd9429e38c99d2f3517f6ab75b597`, direct-repository, active, PENDING. Same-identity archive and current local counterpart absent. | Native plan review of 1038 after this rewrite | AC-HYBRID-REVISED |
| TGT-1038-PROOF | Fresh read-only proof of the published 1038 identity | T2 | Exact OUTP-T1 path, SHA-256, header, and classification | Terminal completion | AC-HYBRID-VERIFIED |

## Execution policy

- Assurance: standard
- Topology: one-owner-sequential
- Max concurrency: 1
- Isolation: One shared working lineage. T2 is a fresh non-implementer.
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: Exactly one named task may run. Recheck the 1038 active hash, archive absence, and local counterpart absence immediately before mutation and after proof. Drift or contention stops without overwrite.
- Decomposition: No task decomposition or child planning is authorized.
- Effect limit: EFF-1038-REVISION
- Orchestrator profile: One-owner sequential projection is pre-approved. Full orchestration is not required.

No task becomes ready from this plan's presence or structural validity. AUTH-PLAN-REVIEW and a fresh backend executor-plan-preflight/v1 eligible result for the exact approved bytes are mandatory at every start.

## Tasks

- [ ] T1. Revise the exact 1038 authority so the hybrid command surface and ownership model are explicit.
  - Owner: dev-implementation
  - Wave: W0
  - Depends on: none
  - Targets: TGT-1038
  - Contracts: CONTRACT-HYBRID, CONTRACT-1038-IDENTITY
  - Criteria: AC-HYBRID-REVISED
  - Effects: EFF-1038-REVISION
  - Output: OUTP-T1
  - Receiver: dev-implementation
  - Verification: VR-HYBRID-REVISED
  - Lineage: shared
  1. Immediately before mutation, classify the active 1038 path as a safe regular direct-repository PENDING file at SHA-256 `3e028e1bcbfc3cebc2b64c45a40b82b0575cd9429e38c99d2f3517f6ab75b597`, with the exact same-identity archive and local counterpart absent.
  2. Revise only those complete bytes. Materialize DEC-HYBRID-SURFACE and DEC-HYBRID-OWNERSHIP. Preserve DEC-SAME-IDENTITY, DEC-INVESTIGATION-ONLY, and DEC-PRESERVE-1038-CONTRACTS. Do not implement memory, activate a loader, or grant execution or delivery approval.
  3. Publish through the direct-repository generation protocol. Recheck source, active, archive, local counterpart, header, identity, and SHA-256 after publication. Any drift, ambiguity, unsafe path, or raced destination stops without overwrite or archive creation.

- [ ] T2. Freshly verify the published 1038 revision and emit the terminal Handoff.
  - Owner: dev-verification
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-1038-PROOF
  - Contracts: CONTRACT-HYBRID, CONTRACT-1038-IDENTITY
  - Criteria: AC-HYBRID-VERIFIED
  - Effects: none
  - Output: OUTP-T2
  - Receiver: dev-implementation
  - Verification: VR-HYBRID-VERIFIED
  - Lineage: shared
  1. Receive only the exact OUTP-T1 path, old and new SHA-256, and classification evidence. Do not repair.
  2. Reread and hash the active 1038 file. Confirm immutable datetime and authority kind, Status PENDING, hybrid surface and ownership text, investigation-only boundary, absent archive, and absent local counterpart.
  3. Return VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Only VERIFIED permits completion presentation.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-HYBRID-REVISED | Exact current 1038 identity plus DEC-HYBRID-SURFACE and DEC-HYBRID-OWNERSHIP | The same active identity has final complete bytes that state the hybrid command surface and ownership model, preserve immutable header fields, stay PENDING, report a new SHA-256, leave archive and local counterpart absent, and change no other artifact | TGT-1038 | T1 |
| AC-HYBRID-VERIFIED | Exact OUTP-T1 published identity | A fresh non-implementer returns aggregate VERIFIED that the published 1038 bytes match OUTP-T1, implement the hybrid contract, and satisfy the identity and absence checks | TGT-1038-PROOF | T2 |

## Verification / Done criteria

- [ ] VR-HYBRID-REVISED. Prove one safe same-identity 1038 revision.
  - Criterion: AC-HYBRID-REVISED
  - Proof class: worker smoke
  - Scenario / environment / fixture: Classify active, archive, and local counterpart. Snapshot source bytes. Validate final complete bytes against the hybrid contract and 1038 investigation-only boundary. Publish through the direct-repository generation protocol. Reread and hash all identity paths.
  - Evidence form: OUTP-T1 Common Handoff reports old and new SHA-256, exact path and identity, final header, storage classification, absence checks, changed-artifact closure, effect, and execution-approval boundary.
  - Target recheck: TGT-1038
  - Receiver: dev-implementation

- [ ] VR-HYBRID-VERIFIED. Independently prove the published hybrid revision.
  - Criterion: AC-HYBRID-VERIFIED
  - Proof class: independent verification
  - Scenario / environment / fixture: In a fresh read-only pass, reread the exact active 1038 path, rehash it, confirm header immutables, PENDING, hybrid surface and ownership text, investigation-only boundary, archive absence, and local counterpart absence.
  - Evidence form: TGT-1038-PROOF Common Handoff maps both criteria to expected and observed evidence, records identities, and returns one aggregate verdict.
  - Target recheck: TGT-1038-PROOF
  - Receiver: dev-implementation

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | Exact final 1038 bytes, SHA-256, and identity classification | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation | Common Handoff with parent outcome, owned criterion, expected and observed delta, exact plan path and revision, storage classification, approval boundary, blockers, and one receiver. |
| OUTP-T2 | T2 | TGT-1038-PROOF exact verifier result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation | Common Handoff with declared boundary, target, criterion evidence, identities, aggregate verdict, blockers, and one receiver. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-PLAN-APPROVAL | native-plan-reviewer | Fresh native approval bound to the exact active rewrite-plan path, complete bytes, SHA-256, PENDING status, and backend structural preflight | all | AUTH-PLAN-REVIEW is absent at materialization | Exact current revision is approved and fresh backend preflight is eligible before any task becomes ready. |
| BLK-1038-IDENTITY | dev-implementation | Immediate prepublication and postpublication safe-path classification, exact source hash, archive and local absence, generation ownership, and target reread | T1, T2 | AUTH-1038 active identity only. Ambiguity, unsafe kind, local conflict, or drift fails closed. | T1 owns one current generation, the exact approved source remains current, and publication can preserve identity without overwrite or archive creation. |
| BLK-SOURCE-DRIFT | dev-implementation | Rehash AUTH-1038. If the active hash is no longer `3e028e1bcbfc3cebc2b64c45a40b82b0575cd9429e38c99d2f3517f6ab75b597`, stop. | all | Material 1038 drift invalidates this revision | The bound 1038 hash matches, or new authority rebinds it. |
| BLK-VERIFICATION | dev-verification | OUTP-T2 aggregate VERIFIED for the exact published identity | T2 | Historical 1038 bytes are ineligible after T1 | Fresh proof is VERIFIED. |
| BLK-AUTHORITY-CHANGE | dev-ask | Revised approved authority for any changed hybrid decision, identity rule, or extra effect | all | Current revision cannot absorb a new command, runtime, or Atlas write | The canonical owner supplies a current approved revision. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-1038 | existing plan identity | `/Users/kim/.dotfiles/.agents/plans/2026-08-14-1038_repo-agent-memory-canonical-artifact-integration.md` SHA-256 `3e028e1bcbfc3cebc2b64c45a40b82b0575cd9429e38c99d2f3517f6ab75b597` | Sole rewrite target. |
| ANC-RECOVERY | requested hybrid outcome | AUTH-RECOVERY SHA-256 `967ed788d98611fe64c1b3217bb3bbe82d4aebfcde8e3d16d16b1a89780649db` section Original goal item 2 | Names the requested 1038 hybrid revision without supplying write authority. |
| ANC-PLAN-STORAGE | storage rule | rule://plan-repo-storage | Owns exact active and archive identity, local conflict classification, shared generation, publication, and reread protocol. |
| ANC-DESTAGED-SIBLING | sibling plan | `/Users/kim/dev/atlas/app/.agents/plans/2026-08-14-1528_atlas-explicit-reroute-destaged-recovery.md` | Separate Atlas repair plan. Not a write target. |

- Assumptions: none
