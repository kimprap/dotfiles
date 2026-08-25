# Repository-canonical executor plans

**Datetime**: 2026-08-22-1603
**Scope**: Portable Executor Plan artifact grammar, repository execution, OMP draft copying, lifecycle parsing, terminal storage, and preservation of current completion-presentation durability.
**Summary**: Make plan rules harness-agnostic, execute from repository bytes, retain per-write OMP draft copies, migrate every active parser/preflight caller, and reject invalid terminal state without adding approval, archive ceremony, or presenter lifecycle.
**Status**: DONE
**Completed At**: 2026-08-25-1139

## Objective

- Outcome: OUT-REPOSITORY-CANONICAL-PLANS
- Observable end state: Plan rules produce the complete portable Executor Plan body without provenance metadata; agents validate, execute, update, and continue from the active repository identity derived from Datetime and slug; OMP copies each successful slug-matched local plan write or edit into that path; one parser owns artifact and terminal grammar; valid terminal copies archive as a storage side effect; copy/archive failure is visible without becoming an approval or completion gate; and eventual generic presentation uses one current eleven-key fence, a durable immutable `Resume from`, and the current existing Handoff or yields no generic completed report.
- Progress signal: AC-RCP-01 through AC-RCP-06 advances on the current named target bytes, or BLK-RCP-DRIFT is resolved by a parser-valid byte-identical revised projection and native approval of its exact SHA.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-RCP-REVISION | current human-confirmed Plan 1 revision authority | `omp-session://01a02861-00ae-7000-b7ba-1481098422a0/current/repository-canonical-plans-revision-handoff` | AUTH-RCP-REVISION-20260824 rebases `sha256:02f060e89bb870ac0464acb84e15329109a477a34d8af5c38b483de0049a742d` | Revise Plan 1 only; no criterion or lifecycle state advances, and T1 requires native approval of the complete revised bytes. |
| AUTH-RCP-CPRI | immutable completed dependency and preservation authority | `.agents/plans/archive/2026-08-24-1243_completion-presentation-resume-index.md#completion-summary` | sha256:4f707ee83fe89c58d947b1282a5072f8a5c884c4acfb055117709d9b915b6b9d with final target CPRI-T1C at sha256:72d9310967baffa7ccd156cc8b34ca6adeeca016bd76ce14fb128d6477eef936 | Preserve completed D18, D19, and D27 behavior; this dependency grants no Plan 1 implementation approval and must not be reopened, mutated, reverified, or reassessed. |
| AUTH-RCP-CPRI-SURFACES | completed-contract preservation baseline | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md`; `.config/agents/skills/completion-presentation/SKILL.md`; `.config/agents/skills/completion-presentation/evals/evals.json`; `.config/agents/skills/dev-ask/SKILL.md`; `.config/agents/skills/dev-ask/WORKFLOW.md` | sha256 respectively 508207282491621364834901d698f29c4f3fd1bd8cac2024972b74ff2015e4f2, 30bf19695051256a47c0bd586dd96db69b39df053fe8842a5770dea64a3a3751, d46c4fc76f766221a8d03b4b5651912814fc2ed40e5359d5d1af41f4b6be8016, 299e451309b1c4a31216b77e0b54e0700ef71588939d7623fc0ea79eb7196d1e, 21ee4efe1db24f0ad0cd9fbf028bba86d9b322aa49e24b0b0fcc55d0eaad9320, and 4dea8bdebeeb9fe4afe28577a0007ecdcc720fe7a2cd850fe0b3dab3402ee287 | The first five paths are read-only; WORKFLOW permits only T5's exact `plan preflight` phrase replacement and otherwise preserves the completed eleven-field/same-agent contract. |
| AUTH-RCP-SCOPE | current human-confirmed clean-cutover scope correction | `omp-session://01a02861-00ae-7000-b7ba-1481098422a0/current/executor-eval-scope-selection` | AUTH-RCP-SCOPE-20260824 | Expand the mutation set from five to seven Executor Plan eval cases and add the compact checklist; preserve ADR-0001 D26 and every CPRI completion surface. This revises Plan 1 only and grants no T1 approval. |
| AUTH-RCP-T5-PREREQUISITES | current human-confirmed T5 prerequisite authority | `human-confirmation://2026-08-25/t5-prerequisite-resolution` | AUTH-RCP-T5-PREREQUISITES-20260825 | Keep user-owned papercut record `pc-ae711c27c4d758b7`, rebaseline only its scanner preservation digest, and make bare comparator `--self-test` select the canonical sibling fixture while retaining the explicit override. |
| AUTH-RCP-IMPROVE-SLUG-REPAIR | current human-approved post-assurance target/scope revision | `human-confirmation://2026-08-25/repository-canonical-plans-improve-slug-repair` | AUTH-RCP-IMPROVE-SLUG-REPAIR-20260825-1026 | Resolve sealed review lineage `RCP-CANONICAL-SLUG-CUTOVER` by adding `.config/agents/skills/improve/SKILL.md` to the repair target, migrating future `/improve` standard/deep filenames in that skill and its existing template to canonical `Datetime_improve-variant.md` form, preserving historical plan filenames, rebinding manifests, and running the existing standard assurance tail. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-RCP-ARTIFACT | AUTH-RCP-REVISION-20260824 | The repository active/archive identity is the file agents execute and update; a harness-local file is only a draft copy source. |
| DEC-RCP-GRAMMAR | AUTH-RCP-REVISION-20260824 | The portable header has no provenance field; one parser owns the ordered body, lifecycle, and both immediate task-completion record spellings. |
| DEC-RCP-COPY | AUTH-RCP-REVISION-20260824 | `bin/omp-copy-plan-artifact copy --slug SLUG --content-file FILE` is the only OMP helper operation and runs after each successful local plan write or edit. |
| DEC-RCP-READY | AUTH-RCP-REVISION-20260824 | Plan-backed readiness uses current repository bytes, one valid parser result, and current human approval; continuation requires no harness context, local counterpart, authority outcome, or exact-byte lock for lifecycle-only edits. |
| DEC-RCP-CEREMONY | AUTH-RCP-REVISION-20260824 | No store, proposal publication gate, portable contract digest, ORP field migration, caller-facing CAS, explicit archive command, or archive-dependent completion is introduced. |
| DEC-RCP-PRESENTATION | AUTH-RCP-CPRI | Terminal presentation preserves one current eleven-key presenter fence, filled `Completed`/`Evidence`/`Continuation`, durable `Resume from`, a valid existing-Handoff form, same-agent non-dispatchable presentation, and exact `shipping not authorized`; storage remains non-gating but no generic completed report is emitted without a valid durable continuation locator. |
| DEC-RCP-SCOPE | AUTH-RCP-SCOPE-20260824 | D13 clean cutover includes the compact checklist plus B-PLAN-TAIL-OMITTED and R-COMPACT-PLAN-WITH-TAIL with their fixtures; the other registry objects/fixtures and the generic negative `plan preflight` wording in protected ADR-0001 D26 remain unchanged and outside stale scanning. |
| DEC-RCP-T5-PREREQUISITES | AUTH-RCP-T5-PREREQUISITES-20260825 | T5 may rebind only the `.agents/papercuts.json` preservation SHA-256 to the accepted current bytes without mutating the ledger, and `compare_trace.py --self-test` defaults to `compare_trace_selftest.json` while `--self-test-file` remains authoritative when supplied. |
| DEC-RCP-IMPROVE-SLUG-REPAIR | AUTH-RCP-IMPROVE-SLUG-REPAIR-20260825-1026 | The sole lowercase kebab-case repository identity applies to future `/improve` standard/deep plan filenames in both the dispatching skill and its template; historical active/archive filenames remain unchanged. |

## Scope, non-goals, and prohibited effects

- Read surfaces: Current plan rules, parser and fixtures, OMP copy helper/extension, backend readiness and compact checklist, transport companions, active D08 projections, Atlas and OMP traces, bounded seven-case stale-contract/eval surfaces, and the immutable CPRI archive plus its D18, D19, and D27 projections.
- Change surfaces: Only targets owned by T1-T6 below, this active plan's authorized repository cutover, and the exact approved post-assurance repair scope below; CPRI archive, ADR-0001 D26, completion-presentation implementation/evals, and other Plan 2 surfaces are preservation references, never mutation targets.
- Approved repair scope: repair revision `RCP-REPAIR-20260825-1026` may change only `.config/agents/skills/improve/SKILL.md`, `.config/agents/skills/improve/references/plan-template.md`, this active plan's repair accounting, and revision-bound manifests/evidence. Parent AC-RCP-01 through AC-RCP-06 and VR-RCP-01 through VR-RCP-06 remain unchanged.
- Non-goals: A replacement authority taxonomy; completion-presentation redesign; generic negative-prose cleanup; `plan-artifact-store`; `plan-proposal-publish.js`; portable `contract_sha256`; Orchestrator Role Profile digest changes; proposal-only publication; caller-facing multi-writer CAS; archive commands or archive-gated presentation; historical plan migration.
- Prohibited effects: No rewrite of `.agents/plans/archive/**`, `.agents/plans/2026-06-24_flue-omp-integration.md`, protected ADR-0001 D26, Plan 2 implementation/evaluation surfaces, or unrelated user bytes; no staging, commit, push, shipping, credentials, external service, session recovery ledger, compatibility alias, or lifecycle/storage transition during revision.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-RCP-REPOSITORY | repository-write | AUTH-RCP-REVISION | Named active contract, implementation, fixture, and current-plan targets only; preserve unrelated bytes and revert before delivery if proof fails. |
| EFF-RCP-STORAGE | plan-storage transition | AUTH-RCP-REVISION | Copy only the current draft/disposable fixture snapshot to its same identity; archive only byte-identical parser-valid terminal bytes; never overwrite historical or divergent archive bytes. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-RCP-ARTIFACT | Portable header, ordered body, lifecycle grammar, and validation result | T1 | DEC-RCP-GRAMMAR at AUTH-RCP-REVISION-20260824 | T1, T2, T3, T4, T5, T6 |
| CONTRACT-RCP-READY | Repository-file execution/continuation readiness and preserved backend terminal normalization boundary | T1 | DEC-RCP-READY at AUTH-RCP-REVISION-20260824; DEC-RCP-PRESENTATION at AUTH-RCP-CPRI | T1, T4, T5, T6 |
| CONTRACT-RCP-COPY | One-operation OMP copy helper and visible result protocol | T2 | DEC-RCP-COPY at AUTH-RCP-REVISION-20260824 | T2, T3, T4, T6 |
| CONTRACT-RCP-OMP | Per-write local draft discovery and copy invocation | T3 | DEC-RCP-COPY at AUTH-RCP-REVISION-20260824 | T3, T4, T5, T6 |
| CONTRACT-RCP-TRANSPORT | Harness-thin authoring and execution notes | T4 | DEC-RCP-ARTIFACT at AUTH-RCP-REVISION-20260824 | T4, T5, T6 |
| CONTRACT-RCP-CUTOVER | D13-aligned ADR, workflow, template, exact seven-case fixtures, scoped stale-contract registry, and CPRI preservation set | T5 | DEC-RCP-CEREMONY at AUTH-RCP-REVISION-20260824; DEC-RCP-PRESENTATION at AUTH-RCP-CPRI; DEC-RCP-SCOPE at AUTH-RCP-SCOPE-20260824 | T5, T6 |
| CONTRACT-RCP-PROOF | Atlas/OMP regression, terminal durability branch, existing-Handoff validity, and same-agent presentation eligibility | T6 | AUTH-RCP-REVISION-20260824; DEC-RCP-PRESENTATION at AUTH-RCP-CPRI | T6 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RCP-CORE-RULES | `.config/agents/rules/plan.md`; `.config/agents/rules/plan-impl-spec.md`; `.grok/rules/plan.md`; `.grok/rules/plan-impl-spec.md` | T1 | sha256:053627f116078f0144119b7e9b66b44360925469f0cde921cec832dfe615c9fd and sha256:8f53958305b59b20cd19f5b16085afe232d8458d7f08451afc4b667ef2141be1, each canonical/Grok pair byte-equal | all plan authors; parser fixtures; T2-T6 | AC-RCP-01 |
| TGT-RCP-PARSER | `.config/agents/skills/dev-implementation/scripts/executor_plan.py`; `test_executor_plan.py`; `fixtures/executor_plan/complete.md`; `fixtures/executor_plan/fan_in.md` | T1 | sha256:55f913edeb82bc5e48aa4264c5987e55a0bc1895c917aba60d1fbf02c213447c; sha256:63f748714b1cfcf5abdccc7b32d36e5a6e235e15ab1e228572b07a10499013b7; sha256:b6dfff99a25530c211c6eb7d9260431bab51632aba648efd0e1f2451b8883b71; sha256:2ff6954b2d70d3b18f9f30f6a3ccdae01a9e2d06edaa1d87f9bf273cadf7f4fc | helper; backend; complete/fan-in/negative fixtures | AC-RCP-01 |
| TGT-RCP-READY | `.config/agents/skills/dev-implementation/SKILL.md` publication, ready, executor/transport snapshots, direct storage, profile-tail, checkpoint, evidence-index, and adjacent terminal-normalization seams; `.config/agents/skills/dev-implementation/references/compact-checklist.md` lines 5-6 | T1 | SKILL sha256:34485360c9f4767eadfdcf9e3eb0284098c3b6eed2810f6dc26dea536297cb53; checklist sha256:b7031103dd766e612f587332d6ef7faad89ebf1d1a9ce3468055e3f5aea030ee | dev-implementation backend; compact planner; completed CPRI contract; T2-T6 | AC-RCP-01 |
| TGT-RCP-ACTIVE-PLAN | `.agents/plans/2026-08-22-1603_repository-canonical-plans.md` header and execution lifecycle | T1 | native-approved complete revision of AUTH-RCP-REVISION at T1 dispatch | backend; helper; T2-T6 | AC-RCP-01 |
| TGT-RCP-HELPER | `bin/omp-copy-plan-artifact` | T2 | sha256:8d841616c909abc4005aacfdefce3418e260429b564dcea5ed8ae2616376f8e7 | plan-artifact-sync extension and combined Bun suite | AC-RCP-02 |
| TGT-RCP-OMP | `.config/agents/harnesses/omp/extensions/plan-artifact-sync.js`; `plan-artifact-sync.test.js` | T3 | sha256:7828ecc3f2e65b69e9216fb6b497ee3806cc7b2add3a1e4a27074a042faad68e; sha256:51633e5ec97a922e74e12bc534a5d8d19a8867191c0ce2f90091e7183932848f | `.config/agents/harnesses/omp/config.yml`; helper; fake-pi fixtures | AC-RCP-03 |
| TGT-RCP-TRANSPORT | `.config/agents/rules/plan-repo-storage.md`; `plan-omp-transport.md`; `plan-grok-transport.md`; matching `.grok/rules` copies | T4 | sha256:cd537adc74d2908dc08e2c2e380568b9ca78cdaf292915bca28d620e0f898dbd; sha256:df3a4c75c548770513dd738d4bb1fd95577b30d3eaf1c6d3b37c460bce2fb925; sha256:6654a590d7f61a20e56b78b7e2c05c44c522b49cb3754c422a5422c904a91ef4, each canonical/Grok pair byte-equal | OMP, Grok, direct repository authors, backend | AC-RCP-04 |
| TGT-RCP-CUTOVER | `docs/adr/0002-executor-plans-and-orchestration.md`; `docs/adr/INDEX.md`; `.config/agents/skills/improve/references/plan-template.md`; `.config/agents/skills/dev-ask/WORKFLOW.md`; dev-ask `evals.json`, `scan_stale_contracts.py`, `compare_trace.py`, and the seven Executor Plan `case.json` fixtures named in T5 | T5 | ADR2 sha256:74bf00ccb41c85c223388e38d88193424d051837b9cf36a39c0494ce5c181197; INDEX sha256:9c95f0600c924412e41bd5af0c8fdb7d01a55615bad52128c321c41624711bd6; template sha256:077e09552690df346e1f2f542fec7ac0f7cdf957d9619c9733486664ae9733df; WORKFLOW sha256:4dea8bdebeeb9fe4afe28577a0007ecdcc720fe7a2cd850fe0b3dab3402ee287; evals sha256:65932aaf1771cd35edf106e89fc883d69628b7ed333a077cce07b3348f993b03; scanner sha256:ba1acd01b9d35b2cc35471dd51363b53dc95b40265b721fa0c1b3d0937714c6c; trace sha256:743f572a5604185c0ba0335c8a13e6f1a512e1959910671458852261374439cf; fixture hashes bbf384b1840e666273ff1cd83d87de557ca3620218a5496b4ac31d4bf1c6702c, dcb75033adfbbeec9f1cb7dc5e995d5b0a2b3132821b4500427796df1097dc4f, 9e8c0918154be17617bc071fa70546354419f88b442d86a2153cda5b84ac0321, e1870ddb64e0e33080b523fc0f894b0e74836aa5b90ec48e0e5d9a120537da57, 634593f40b9c784bad69f3a2305f6c20a7fe5b0d5b8292d1383ac74552b7c196, 48f767b84fa57bf40ec3ba2157b9cabaaf65b1b472001339a052f3e5d5901cea, 2e0570443fd88e04ecfded2c6bc91c6b00f73d46270c35b66f1c5deb17358a16 | D08/INDEX readers; completion-preservation boundaries; improve; exact seven-case registry/fixture and preservation checks | AC-RCP-05 |
| TGT-RCP-PROOF | Atlas/OMP integration evidence receipt | T6 | absent at plan approval; produced from the frozen Atlas transcript and a disposable OMP session | dev-verification | AC-RCP-06 |

## Execution policy

- Assurance: standard
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared lineage
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 holds the v1-to-repository cutover boundary; T2-T6 run strictly in order after its valid repository Handoff.
- Decomposition: one qualified owner executes all six tasks without child delegation.
- Effect limit: EFF-RCP-REPOSITORY, EFF-RCP-STORAGE
- Orchestrator profile: not required for one-owner execution; existing profile schemas and digest fields remain unchanged.
- Post-assurance repair: token consumed `1/1` by revision `RCP-REPAIR-20260825-1026`; attempt 1 returned aggregate `NOT VERIFIED`; repair attempt `2/2` completed and aggregate verification returned `VERIFIED`; attempt 3 is forbidden; original-initial and original-rerun reviews are consumed; sealed lineage `RCP-CANONICAL-SLUG-CUTOVER` is closed; terminal learning assessment `LEARN-RCP-001` returned `NO DURABLE LEARNING`.
- Repair assurance: freeze all six parent criteria and proof recipes; independently verify the complete impact map, then use the original-rerun slot only for lineage closure and repair-impact review.

## Tasks

- [x] T1. Cut portable grammar and repository execution together
  completed 2026-08-24-2344
  - Owner: repository-plan-worker
  - Intent: Make repository execution and portable grammar agree.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-RCP-CORE-RULES, TGT-RCP-PARSER, TGT-RCP-READY, TGT-RCP-ACTIVE-PLAN
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-READY
  - Criteria: AC-RCP-01
  - Effects: EFF-RCP-REPOSITORY
  - Output: OUTP-RCP-T1
  - Receiver: T2
  - Verification: VR-RCP-01
  - Lineage: shared
- [x] T2. Reduce the helper to parser-backed copying
  completed 2026-08-24-2353
  - Owner: repository-plan-worker
  - Intent: Make local plan copying structurally reliable.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-RCP-HELPER
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-COPY
  - Criteria: AC-RCP-02
  - Effects: EFF-RCP-REPOSITORY, EFF-RCP-STORAGE
  - Output: OUTP-RCP-T2
  - Receiver: T3
  - Verification: VR-RCP-02
  - Lineage: shared
- [x] T3. Preserve per-write OMP draft copying
  completed 2026-08-25-0000
  - Owner: repository-plan-worker
  - Intent: Keep repository drafts current after local edits.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-RCP-OMP
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-COPY, CONTRACT-RCP-OMP
  - Criteria: AC-RCP-03
  - Effects: EFF-RCP-REPOSITORY, EFF-RCP-STORAGE
  - Output: OUTP-RCP-T3
  - Receiver: T4
  - Verification: VR-RCP-03
  - Lineage: shared
- [x] T4. Reduce transport companions to adapter notes
  completed 2026-08-25-0002
  - Owner: repository-plan-worker
  - Intent: Remove transport state from execution readiness.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-RCP-TRANSPORT
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-READY, CONTRACT-RCP-COPY, CONTRACT-RCP-OMP, CONTRACT-RCP-TRANSPORT
  - Criteria: AC-RCP-04
  - Effects: EFF-RCP-REPOSITORY
  - Output: OUTP-RCP-T4
  - Receiver: T5
  - Verification: VR-RCP-04
  - Lineage: shared
- [x] T5. Synchronize durable cutover contracts
  completed 2026-08-25-0034
  - Owner: repository-plan-worker
  - Intent: Align durable guidance and fixtures with the cutover.
  - Methods: none
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-RCP-CUTOVER
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-READY, CONTRACT-RCP-OMP, CONTRACT-RCP-TRANSPORT, CONTRACT-RCP-CUTOVER
  - Criteria: AC-RCP-05
  - Effects: EFF-RCP-REPOSITORY
  - Output: OUTP-RCP-T5
  - Receiver: T6
  - Verification: VR-RCP-05
  - Lineage: shared
- [x] T6. Prove the Atlas and OMP sequences
  completed 2026-08-25-0127
  - Owner: repository-plan-worker
  - Intent: Prove drafting, execution, completion, and failure behavior.
  - Methods: none
  - Wave: W5
  - Depends on: T5
  - Targets: TGT-RCP-PROOF
  - Contracts: CONTRACT-RCP-ARTIFACT, CONTRACT-RCP-READY, CONTRACT-RCP-COPY, CONTRACT-RCP-OMP, CONTRACT-RCP-TRANSPORT, CONTRACT-RCP-CUTOVER, CONTRACT-RCP-PROOF
  - Criteria: AC-RCP-06
  - Effects: EFF-RCP-STORAGE
  - Output: OUTP-RCP-T6
  - Receiver: dev-verification
  - Verification: VR-RCP-06
  - Lineage: shared

### T1 execution contract

- T1 remains blocked until native approval names this complete revised plan SHA. Before that approval, keep `Status: PENDING`, keep `Authority kind: local-authority`, keep the authoritative local draft and repository projection byte-identical, bind no method, and perform no lifecycle or storage transition. After approval, bind the unchanged `Methods: none`, enter `ready`, freeze the local draft, and make every subsequent status, task, criterion, timestamp, recovery, and summary edit only in `.agents/plans/2026-08-22-1603_repository-canonical-plans.md`.
- This revision changes no runtime fact: OUT-REPOSITORY-CANONICAL-PLANS remains `PENDING`, criteria AC-RCP-01 through AC-RCP-06 remain unadvanced, semantic attempts remain `0/2`, the run-wide post-assurance repair remains `unused 1/1`, initial review remains not run, and the standard one-owner T1-T6 route remains unchanged. Attempt 3 stays forbidden after execution begins.
- Change the future portable header to `Datetime`, optional `Mode`, `Scope`, `Summary`, `Status`, and terminal-only `Completed At`. Remove `Authority kind`, local/direct classification, and misplaced-marker validation from `plan.md`, `plan-impl-spec.md`, both Grok-discovered copies, and parser header constants/inspection.
- Change the parser public API to `validate_text(text)`, `validate_file(path)`, and CLI `executor_plan.py validate PLAN`. Keep `executor-plan-validation/v1`; return `schema`, `status`, `issues`, `plan_sha256`, parsed `datetime`, `lifecycle_status`, and `terminal_complete`. Delete `CONTEXTS`, `CONSUMERS`, `PreflightReport`, `preflight_file`, every preflight locator, authority-location, local-counterpart, and projection code or payload, and the old positional-plus-flags CLI; preserve validation of the portable `Authority` section.
- Make the parser the only lifecycle reader. Accept exactly `  completed YYYY-MM-DD-HHMM` or `  - completed YYYY-MM-DD-HHMM` immediately below a checked task and give both identical meaning. Use `LIFECYCLE_TASK_UNCHECKED`, `LIFECYCLE_TASK_COMPLETION_MISSING`, `LIFECYCLE_TASK_COMPLETION_INVALID`, `LIFECYCLE_TASK_COMPLETION_DUPLICATE`, `LIFECYCLE_CRITERION_UNCHECKED`, `LIFECYCLE_COMPLETED_AT_INVALID`, and `LIFECYCLE_COMPLETION_SUMMARY_INVALID` for terminal defects, naming the task or criterion when applicable. `DONE` requires valid `Completed At`, every task and criterion checked, exactly one valid record per task, and a nonempty final Completion Summary. `CLOSED` remains explicit human cancellation, forbids `Completed At`, permits unfinished tasks, and is terminal without requiring a completion summary.
- Replace only obsolete Executor Plan readiness and transport semantics in `.config/agents/skills/dev-implementation/SKILL.md`. At the publication/parser seam, validate the active repository plan once through `scripts/executor_plan.py validate PLAN`; remove planner/backend consumer duplication while preserving publication ownership and no-custom-planner/no-profile-attestation boundaries. At `ready`, compact has no Executor Plan and therefore no parser-valid repository-plan readiness; a plan-backed task resolves the active repository plan and Task Contract and accepts only `executor-plan-validation/v1`, `status=valid`, lifecycle `PENDING` or `IN_PROGRESS`, current repository bytes, and current human approval. Initial readiness binds the exact approved SHA; continuation accepts parser-valid lifecycle bookkeeping without reapproval, while every other semantic change follows ADR-0001 D02.
- Update the executor-plan and plan-transport snapshot seams to report only active repository identity/digest/validation/lifecycle facts and the narrowed OMP-local-copy or direct-repository adapter facts. Remove context/consumer, harness/local locators, counterpart equality, authority classification/outcome, projection authority, and duplicated parser meaning. At the direct repository storage-effect seam, remove the universal generation protocol. At the resume/checkpoint seam, resolve the executing plan only from the active repository file, never the frozen local draft or counterpart. Preserve target/rule manifests, lifecycle and attempt counters, task Methods, ORP launch assessment, existing `executor_plan_sha256` identity fields, read-only snapshot status, and generic D27 `terminal projection` vocabulary.
- At the profile-tail seam, source a numbered suffix from the parser-valid active repository plan or source backend scheduling from the final non-tail Task Contract Receiver; remove “applicable backend preflight.” In the completion evidence index, replace only “Executor Plan digest/preflight” with “applicable active repository Executor Plan identity, exact digest, and parser-valid readiness receipt.” Preserve the remaining semicolon-delimited evidence accounting.
- In `.config/agents/skills/dev-implementation/references/compact-checklist.md`, replace only line 5's `plan preflight` with `parser-valid repository-plan readiness`; replace line 6's `run the normal backend preflight` with `run scripts/executor_plan.py validate PLAN once against the active repository plan before ready`. Preserve compact planlessness, the work-only/tail-free optional-plan shape, direct Task Contract and Context Pack rules, Intent/Methods copying, method binding, smoke, attempt limits, and assurance exclusions.
- Preserve the completed CPRI terminal contract surrounding those seams: the bounded eleven-field terminal-value record; filled `Completed`, `Evidence`, and `Continuation` normalization; durable `Resume from`; one existing Handoff form; caller-supplied exact `shipping not authorized`; local engineering `Next` exactly `none`; and the rule that the backend does not construct/expose the fence, invoke the presenter, or create a second Handoff. Outside the one plan-readiness phrase in the evidence index, keep the current completion contract text unchanged.
- Update parser tests and complete/fan-in fixtures to the provenance-free header and context-free CLI. Replace the preflight matrix with lifecycle grammar, terminal completeness, invalid terminal, plan digest, CLI misuse, strict UTF-8, and current-file safety coverage; preserve all ordered-body, ID/reference closure, topology, task-tail, effect, output, recovery, and placeholder checks.
- At the end of the owner-held boundary, remove only the `Authority kind` line from the active repository plan, set it `IN_PROGRESS`, record T1 completion in the new valid form, and run the new parser on those exact bytes. T1 hands off only when the active file is valid and T2 readiness requires no local artifact. Do not edit the stale local draft or add a second migration plan.

### T2 execution contract

- Keep the filename `bin/omp-copy-plan-artifact`; change only its operation to `copy --slug SLUG --content-file FILE`. Require canonical lowercase kebab slug, an absolute regular non-symlink source whose basename is the slug plus `-plan.md`, and the repository root as cwd.
- Snapshot the source once, validate that exact snapshot through `executor_plan.py validate SNAPSHOT`, and derive Datetime, lifecycle status, and terminal completeness only from its JSON. Delete `HeaderValidationError`, header/lifecycle constants and regexes, `inspectHeaderBytes`, `validatePlanBytes`, `terminalLifecycleComplete`, authority classifications, local/direct branches, caller inode environment variables, exported generation-lock protocol, and every public operation except `copy`; do not add a JavaScript fallback parser.
- Retain only source/target regular-file and no-symlink checks, same-directory temporary writes, atomic active replacement, no-overwrite archive creation, source/target rechecks, and byte-exact postconditions. One lifecycle writer is the concurrency contract; no caller supplies a base digest, inode identity, lock token, authority assertion, or retry state.
- For parser-valid `PENDING` or `IN_PROGRESS`, copy the snapshot to `.agents/plans/Datetime_slug.md` and emit exactly `plan-artifact-copied: .agents/plans/2026-08-22-1603_repository-canonical-plans.md` for this identity shape. For parser-valid `DONE` or `CLOSED`, create the no-overwrite archive from the same snapshot, recheck its exact bytes, remove the regular active counterpart for that identity, and emit `plan-artifact-archived: .agents/plans/archive/2026-08-22-1603_repository-canonical-plans.md`; an already identical archive with no active counterpart returns the same acknowledgement.
- Parser-invalid input exits nonzero as `PLAN_ARTIFACT_INVALID` with the first parser issue in `state=parser:CODE` and mutates neither active nor archive. A terminal-looking invalid file can never emit copied success or remain newly copied active. Active-plus-archive, divergent archive, unsafe kind, source drift, target drift, or uncertain postcondition fails visibly in the existing redacted error envelope and preserves every observed object.

### T3 execution contract

- Keep `plan-artifact-sync.js`, its default export, config loader path, and successful `write`/`edit` `tool_result` listener. Reuse current local URI/physical path discovery, direct-child confinement, canonical slug ordering, unrelated-file silence, sequential multi-plan continuation, and one aggregated warning.
- Change the helper argv to `copy --slug SLUG --content-file FILE`; remove `OMP_PLAN_ARTIFACT_SYNC_ROOT_IDENTITY` and `OMP_PLAN_ARTIFACT_SYNC_SOURCE_IDENTITY`; accept only the copied/archived acknowledgements and the narrowed helper error allowlist. A nonzero or malformed response emits one `plan-artifact-sync:` warning and never blocks or retries the completed local mutation.
- Replace the combined suite's four-section `planBytes` fixture with parser-valid Executor Plan bytes without `Authority kind`. Preserve mutation-discovery and safe-path coverage; replace authority/projection and duplicate-JavaScript-header matrices with copy create/replace, both completion-record spellings, valid terminal archive, terminal-invalid refusal, closed terminal behavior, exact archived repeat, divergent archive refusal, and failure visibility.
- Do not register a pre-execution hook, proposal hook, archive tool, execution gate, base digest, ledger, renamed extension, or alternate helper.

### T4 execution contract

- Reduce `plan-repo-storage.md` and its Grok copy to Datetime/slug identity, active/archive paths, byte-exact local draft copy, ordinary repository editing, parser-valid terminal copy archival, and later ordinary byte-identical active-to-archive movement. Remove authority resolution, counterpart discovery, projection terminology, universal generation protocol, direct-writer restrictions, and exported effect/retry ceremony. Both paths present or a divergent archive remains a visible storage conflict with no overwrite.
- Reduce `plan-omp-transport.md` and its Grok copy to three adapter facts: OMP writes a complete local draft, the extension copies after every successful local mutation, and native approval remains OMP-native; execution and continuation read/edit the repository file. Copy/archive success grants no approval, and archive success is not required for completion presentation.
- Reduce `plan-grok-transport.md` and its Grok copy to discovery plus direct repository authoring and `executor_plan.py validate PLAN`. Other harnesses follow the same direct repository path. Remove provider semantic context, session authority, locator/preflight, generation protocol, counterpart, and authority-outcome requirements.
- State once in portable lifecycle rules that Status, task/done-criterion checkboxes, valid task completion records, `Completed At`, and final Completion Summary are lifecycle bookkeeping and do not require reapproval; every other contract change uses ADR-0001 D02.

### T5 execution contract

- Revise ADR-0002 D08, its D08-specific affected-contract bullets, and its dated transport-correction evidence label for repository execution, harness-agnostic artifact grammar, per-write OMP draft copying, direct Grok/repository authoring, one parser, and non-gating terminal storage. Preserve the old correction identity as superseded historical evidence, not current authority. Update only the ADR row and D08 row in `docs/adr/INDEX.md`; preserve D06, D21, ORP behavior, assurance, task topology, native approval, D13 clean-cutover authority, and the current INDEX wording for D18, D19, and D27 byte-for-byte except unchanged table delimiters.
- Update the improve plan template to omit provenance metadata and `direct-repository` authority labels while preserving direct repository execution and its existing proportional plan shapes. In `dev-ask/evals/evals.json`, change B-T5-EXECUTOR-PLAN-OMP, B-T5-EXECUTOR-PLAN-GROK, B-T5-EXECUTOR-PLAN-MISSING, B-T5-EXECUTOR-PLAN-DANGLING, and B-T5-EXECUTOR-PLAN-CYCLE plus their five same-named lowercase `case.json` fixtures. Each positive case validates one exact active repository plan once through context-free `executor_plan.py validate PLAN`; OMP reports local-draft copying plus repository execution and Grok reports direct repository authoring/discovery without making either adapter part of parser meaning. Each negative case returns its existing SECTION_MISSING, DANGLING_REFERENCE, or CYCLIC_DEPENDENCY code once and blocks before ready, publication, or mutation.
- Also change B-PLAN-TAIL-OMITTED and R-COMPACT-PLAN-WITH-TAIL plus only their same-named lowercase `case.json` fixtures. B-PLAN-TAIL-OMITTED replaces the planner/context/consumer snapshot with one backend-owned context-free active-repository validation receipt, then preserves the work attempt, handoff, backend-scheduled tail, assurance, learning, completion, and resume behavior. R-COMPACT-PLAN-WITH-TAIL has backend as its sole owner, replaces planner/backend preflight and active-context wording with one context-free invalid validation receipt, returns TASK_TAIL_INVALID before `ready` with semantic attempt 0, and consumes no tail. Leave B-COMPACT-PLAN-NO-TAIL and every other registry object/fixture byte-for-byte unchanged, including all CPRI completion, papercut, product, assured, live, and negative-control cases.
- In `.config/agents/skills/dev-ask/WORKFLOW.md`, replace only line 105's obsolete phrase `plan preflight` with `parser-valid repository-plan readiness`. Preserve the surrounding compact rule and every eleven-field, filled-output, durable-Resume-from, existing-Handoff, exact-shipping-constraint, same-agent presentation, and `terminal projection` statement elsewhere in the file.
- Add the five B-T5 executor-plan IDs to `REWRITE_IDS` in both `scan_stale_contracts.py` and `compare_trace.py`; B-PLAN-TAIL-OMITTED and R-COMPACT-PLAN-WITH-TAIL remain in `ADDED_IDS` and are not duplicated. Add all six canonical/Grok storage, OMP, and Grok transport-rule paths to `CORE_SCAN_PATHS`; the workflow and compact checklist already occur there once. Add path-scoped checks for the helper and OMP extension. Reject only exact obsolete Executor Plan artifacts: `executor-plan-preflight/v1`; `authority_outcome`; parser flags `--context`, `--consumer`, `--local-root`, and `--local-plan`; plan-artifact `repository projection` or local-counterpart equality; classification values `local-authority` and `direct-repository`; helper operation `sync`; and duplicated terminal-parser symbols. Never reject bare `projection`, D27 `terminal projection`, the portable `Authority` section, exact plan SHA, ORP fields, generic semantic-context vocabulary, or protected ADR-0001 D26's negative phrase `plan preflight`.
- Under AUTH-RCP-T5-PREREQUISITES-20260825, preserve `.agents/papercuts.json` byte-for-byte at the accepted current SHA-256 `6653bf3c12330e7985c9f23dbd1fe84a62c3d6abb0b30a4330f958db0ed83d57` and rebind only its `PRESERVED` entry in `scan_stale_contracts.py`. Also make bare `compare_trace.py --self-test` resolve the canonical sibling `compare_trace_selftest.json`; retain the existing explicit `--self-test-file` override and every other comparator CLI behavior.
- Remove obsolete active fixtures, code paths, and prose in the same lineage. Do not alter the CPRI archive or completion-presentation implementation/evals, protected ADR-0001 D26, other historical archives, the legacy active plan, any eval/fixture outside the seven named IDs, or any ORP parser/reference/test. A newly discovered active obsolete Executor Plan literal outside the authorized T1-T5 targets blocks T5 and requires an explicit target/scope revision before mutation.

### T6 execution contract
- Reproduce the Atlas causal minimum from `/Users/kim/.omp/agent/sessions/-dev-atlas-app/2026-08-23T18-08-45-625Z_01a02fcf-8a39-7000-94cc-abe193fa0587.jsonl`: parser-valid draft copy, execution from the active repository file with no local locator, valid terminal bytes, and either a byte-identical archive or one visible storage error. The former success acknowledgement with terminal-invalid active bytes remains forbidden.
- In fresh OMP plan-mode sessions rooted at disposable repositories, write and edit complete local drafts before proposal and observe the active repository copy after each successful mutation; prove proposal is not the publication trigger and execution reads only the repository file. Use independent deterministic branches: (a) a valid terminal plan with bulleted `  - completed YYYY-MM-DD-HHMM` reaches a byte-identical archive; (b) a valid terminal plan with bare `  completed YYYY-MM-DD-HHMM` encounters a pre-created divergent archive, refuses overwrite, retains valid terminal active bytes, and emits one storage warning without an archive receipt; and (c) malformed terminal input remains parser-invalid, is not copied as the active plan, and creates no archive success.
- Normalize presentation only after specialty completion and the current final Common Handoff from the standard backend tail are valid; OUTP-RCP-T6's worker Handoff is not frozen as the terminal Handoff when later verification, review, or learning Handoffs supersede it. In success branch (a), `Resume from` is the archived `.agents/plans/archive/2026-08-22-1603_repository-canonical-plans.md` Completion Summary at its resulting full SHA-256 and evidence includes the archive receipt. In storage-failure branch (b), the only fallback is the still-existing active `.agents/plans/2026-08-22-1603_repository-canonical-plans.md` Completion Summary at its full digest; evidence names the visible no-overwrite conflict and residual risk and includes no archive receipt. Never fall back to ADR-0002 or another unrelated canonical document.
- The current eleven-key presenter fence uses the final existing portable Handoff locator, or `in-conversation` only while that exact final Handoff remains current and visible; it preserves filled `Completed`, `Evidence`, and `Continuation`, exact `shipping not authorized`, and local `Next: none`. A `local://`-only, missing, stale, or otherwise unresolved Handoff/continuation locator is not durable. Exercise a durability-negative branch with no valid archive or active-plan fallback: preserve the specialty completion report, do not invoke generic presentation, and emit no generic `## Completed`; do not reopen completed implementation, verification, review, or learning.
- Apply `completion-presentation` only in the same agent after a branch has both a valid durable continuation locator and the current exact Handoff. Archive success grants neither approval nor specialty outcome completion, archive failure does not block specialty completion, and no presenter/backend lifecycle, Handoff, archive, or storage side effect is added.
- Run the exact parser, Bun, scanner, trace, preservation, and actual-surface checks in VR-RCP-01 through VR-RCP-06; preserve their raw outputs and exact target digests in OUTP-RCP-T6. Remove disposable artifacts after the observations.

### Post-assurance repair contract

- Consume `local://repository-canonical-plans-review-handoff.md@sha256:49963da844488f92ea20e10d5ccfda4ae6790794cb577ab2320f30364e39318f` and `local://repository-canonical-plans-repair-verification-handoff.md@sha256:b855656d7119595f93697f5923f191b6870eaa8d114bd2d9689cb4ed83f020de`; preserve sealed lineage `RCP-CANONICAL-SLUG-CUTOVER`, parent semantic attempt `1/2`, repair attempt `2/2`, consumed post-assurance repair `1/1`, consumed original-initial review, and unused original-rerun.
- Change only future `/improve` standard/deep repository-plan naming in `.config/agents/skills/improve/SKILL.md` and `.config/agents/skills/improve/references/plan-template.md`: replace the uppercase-underscore `IMPROVE_variant` slug with canonical lowercase kebab-case `improve-variant` and require `Datetime_improve-variant.md`. Preserve quick/direct no-plan behavior, proportional plan bodies, execution semantics, every historical active/archive filename, and all unrelated guidance.
- Attempt 2 changes the falsifiable composition hypothesis only: `variant` is the unprefixed payload `deep`, `security`, or `standard`; the single `improve-` constructor prefix yields exactly `improve-deep`, `improve-security`, or `improve-standard`. Reject any `improve-improve-` result.
- Freeze AC-RCP-01 through AC-RCP-06 and VR-RCP-01 through VR-RCP-06 unchanged. Bind the expanded target/preservation manifest before verification. Repair smoke must prove the skill and template agree on the canonical path, contain no future uppercase-underscore example, and leave historical repository artifacts untouched.
- Complete causal impact map: AC-RCP-01 is impacted fresh because the active plan authority/accounting bytes changed while its parser, core rules, backend readiness, fixtures, and behavioral expectation remain fixed; AC-RCP-02 is unaffected because helper bytes/protocol/fixtures are unchanged; AC-RCP-03 is unaffected because OMP extension bytes/protocol/fixtures are unchanged; AC-RCP-04 is impacted fresh at the direct-repository authoring consumer from storage identity through `/improve` skill and template; AC-RCP-05 is impacted fresh at the clean-cutover template/consumer seam plus all existing scanner, trace, and preservation checks; AC-RCP-06 is unaffected because its Atlas/OMP source, target, environment, fixtures, proof method, and evidence identities have no causal edge from `/improve` naming or active-plan repair accounting. The verifier independently accepts or rejects every fresh/reuse action and returns one aggregate verdict over exactly the same six criteria.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-RCP-01 | Native-approved complete v1 plan enters the owner-held cutover; future rule, parser, backend, compact checklist, fixtures, and current repository plan bytes are changed together. | The future artifact has no provenance header; `executor_plan.py validate PLAN` is the only public validation path; both immediate completion-record spellings have identical lifecycle meaning; invalid terminal-looking bytes are invalid and nonterminal; publication/readiness/checkpoint seams resolve one active repository plan; the compact checklist uses parser-valid repository-plan readiness; the `IN_PROGRESS` repository plan validates after T1 without a local locator; and dev-implementation's completed CPRI terminal record, durability, existing-Handoff, exact shipping constraint, local Next, and no-presenter/no-second-Handoff boundaries remain intact. | TGT-RCP-CORE-RULES, TGT-RCP-PARSER, TGT-RCP-READY, TGT-RCP-ACTIVE-PLAN | T1 |
| AC-RCP-02 | `copy --slug SLUG --content-file FILE` receives one safe parser-valid or parser-invalid local snapshot. | Valid nonterminal bytes atomically produce the copied acknowledgement; valid terminal bytes produce an exact no-overwrite archive and the archived acknowledgement; invalid terminal-looking bytes return `PLAN_ARTIFACT_INVALID` without copied success or target mutation; every conflict is visible in the redacted error envelope. | TGT-RCP-HELPER | T2 |
| AC-RCP-03 | OMP reports a successful `write` or `edit` of one or more direct-child slug-matched local plan files. | The extension invokes the helper once per changed plan in canonical order after every mutation, accepts only copied/archived acknowledgements, remains silent for unrelated files, and emits one nonblocking `plan-artifact-sync:` warning for any helper or protocol failure. | TGT-RCP-OMP | T3 |
| AC-RCP-04 | OMP, Grok, or another harness authors, continues, or stores a plan under the revised adapters. | OMP alone uses the local draft copy source; Grok and other harnesses write the repository artifact directly; execution and continuation use current parser-valid repository bytes plus current human approval; lifecycle bookkeeping needs no reapproval; storage success grants no approval or completion; terminal normalization may proceed after archive failure only from the valid terminal active repository plan at its exact digest plus the current existing Handoff, and emits no generic report when neither durable plan locator exists. | TGT-RCP-TRANSPORT | T4 |
| AC-RCP-05 | Active ADR, template, workflow, compact checklist, seven named eval cases, rewrite registries, and stale-contract scanner are checked after the clean cutover. | D08, its coupled affected-contract/evidence projection, and only its INDEX projections describe the narrowed design; D18, D19, D27, ADR-0001 D26, completion-presentation surfaces, and every non-target eval/fixture remain unchanged; workflow replaces only `plan preflight`; the seven cases use one context-free active-repository validation result; scoped checks reject exact obsolete Executor Plan artifacts without rejecting generic `projection`, D27 `terminal projection`, semantic-context prose, or protected D26; D06, D21, ORP digests, archives, and the legacy plan remain unchanged. | TGT-RCP-CUTOVER | T5 |
| AC-RCP-06 | Frozen Atlas evidence and fresh disposable OMP plan-mode sessions exercise draft copy, repository execution, both completion records, malformed terminal state, terminal storage, and current D27 normalization. | Bulleted terminal bytes archive exactly and present from the archived summary; bare terminal bytes under a deterministic divergent-archive conflict retain a valid active plan, report one storage error with no archive receipt, and present from that active summary; malformed terminal bytes never replace active bytes or create archive success; every pre-proposal local mutation copies; proposal is not the copy trigger; archive outcomes are non-authoritative; an unresolved Handoff or absent archive/active locator suppresses the generic report without reopening specialty completion; and every eligible presentation uses the current final Handoff, eleven filled/current fields, exact shipping constraint, and no extra lifecycle, Handoff, or storage effect. | TGT-RCP-PROOF | T6 |

## Verification / Done criteria

- [x] VR-RCP-01. Prove the parser and repository-readiness cutover
  - Criterion: AC-RCP-01
  - Proof class: changed-contract tests
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, run `python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`, then `python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-08-22-1603_repository-canonical-plans.md` after the T1 lifecycle edit. Inspect the current publication, `ready`, executor-plan/plan-transport snapshot, direct-storage, profile-tail, resume/checkpoint, evidence-index, and compact-checklist seams and compare the completed terminal-value/evidence-index block with its sealed pre-edit bytes.
  - Evidence form: Passing parser suite; one valid JSON report with `lifecycle_status=IN_PROGRESS`, `terminal_complete=false`, parsed Datetime, and exact plan SHA; byte-equal canonical/Grok core rules; anchored proof that all plan readers use one context-free active-repository result, compact readiness changed only at its two named lines, and all CPRI terminal fields, durability, shipping, Next, normalization, and no-presenter/no-second-Handoff clauses remain.
  - Target recheck: TGT-RCP-CORE-RULES, TGT-RCP-PARSER, TGT-RCP-READY, TGT-RCP-ACTIVE-PLAN
  - Receiver: T2
- [x] VR-RCP-02. Prove parser-backed copy and archival behavior
  - Criterion: AC-RCP-02
  - Proof class: changed-contract tests
  - Scenario / environment / fixture: Run `bun test ./.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js` with helper cases for safe create/replace, both completion spellings, valid `DONE` and `CLOSED`, malformed terminal state, exact archived repeat, active/archive conflict, divergent archive, and drift.
  - Evidence form: Passing helper cases with exact copied/archived acknowledgements, stable first-parser-issue errors, byte equality, and no mutation on every precondition failure.
  - Target recheck: TGT-RCP-HELPER
  - Receiver: T3
- [x] VR-RCP-03. Prove per-mutation OMP invocation and warning behavior
  - Criterion: AC-RCP-03
  - Proof class: changed-contract tests
  - Scenario / environment / fixture: Run the same Bun suite's extension cases with fake-pi successful `write`/`edit` results, multiple local candidates, unrelated files, helper nonzero exit, malformed acknowledgement, and no inode environment variables.
  - Evidence form: Passing extension cases showing canonical sequential helper argv, one invocation per changed plan per mutation, accepted copied/archived acknowledgements, unrelated-file silence, and one aggregated nonblocking warning.
  - Target recheck: TGT-RCP-OMP
  - Receiver: T4
- [x] VR-RCP-04. Prove thin adapters and repository-only readiness
  - Criterion: AC-RCP-04
  - Proof class: contract inspection
  - Scenario / environment / fixture: Compare each canonical storage/OMP/Grok rule with its Grok-discovered copy; inspect all six for direct repository execution, OMP-only draft copying, lifecycle-only approval continuity, non-gating storage, durable fallback eligibility, and absence of removed locator/counterpart/generation semantics.
  - Evidence form: Three byte-equal rule pairs and an anchored inspection receipt proving storage never grants approval/completion, an archive receipt is optional only when the valid terminal active repository plan supplies the durable exact-digest Resume-from locator plus the current existing Handoff, no generic presentation occurs without either archive or active-plan durability, and no adapter owns generic presentation.
  - Target recheck: TGT-RCP-TRANSPORT
  - Receiver: T5
- [x] VR-RCP-05. Prove clean-cutover projections and stale-term rejection
  - Criterion: AC-RCP-05
  - Proof class: contract and fixture checks
  - Scenario / environment / fixture: Before T5 edits, hash the exact INDEX D18/D19/D27 rows, protected ADR-0001 D26, dev-implementation CPRI terminal block, dev-ask workflow completion block, every non-target eval registry object, every non-target fixture, the Plan 2 archive, and completion-presentation skill/evals. Run `python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, the same command with `--preserve` and `--self-test`, and `python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test`; inspect the five B-T5 executor-plan IDs, B-PLAN-TAIL-OMITTED, R-COMPACT-PLAN-WITH-TAIL, and their seven `case.json` fixtures.
  - Evidence form: All commands pass; before/after preservation hashes match. Within multi-concern files, only ADR-0002 D08 and its coupled affected-contract/evidence projection, INDEX's D08 projections, the exact workflow phrase, seven registry objects, and seven fixtures differ; the template, compact checklist, and scanner/trace helpers change only their declared Executor Plan seams. Scoped scanner cases reject exact obsolete artifacts while accepting generic `projection`, D27 `terminal projection`, semantic-context prose, and ADR-0001 D26's protected negative wording; D06, D21, D18, D19, D27, ORP surfaces, archives, completion-presentation surfaces, all other evals/fixtures, and `.agents/plans/2026-06-24_flue-omp-integration.md` remain exact.
  - Target recheck: TGT-RCP-CUTOVER
  - Receiver: T6
- [x] VR-RCP-06. Exercise the Atlas and actual OMP surfaces end to end
  - Criterion: AC-RCP-06
  - Proof class: actual-surface smoke
  - Scenario / environment / fixture: Replay the causal minimum from the named Atlas JSONL and use independent fresh OMP plan-mode sessions in disposable repositories to observe pre-proposal draft copying and repository-only execution. Exercise malformed terminal input; exact archive success with the bulleted record; deterministic divergent-archive refusal with valid active bytes and the bare record; the final full-digest Handoff/archived-summary presentation; the final full-digest Handoff/active-summary fallback presentation; unresolved `local://` Handoff rejection; and no-archive/no-active durable-locator suppression.
  - Evidence form: Raw redacted transcript slices; helper acknowledgements/errors; active/archive byte identities; proof that each local mutation copied before proposal and terminal-invalid success is absent; for each terminal branch, the exact specialty status, storage result, durable Resume-from digest or proven absence, current existing-Handoff form, residual risk, archive-receipt presence/absence, presenter activation or deliberate absence, exact eleven-field/shipping/Next normalization when eligible, unchanged completed-stage counters, final target SHA-256 inventory, and disposable-artifact cleanup receipt.
  - Target recheck: TGT-RCP-PROOF
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-RCP-T1 | T1 | TGT-RCP-CORE-RULES, TGT-RCP-PARSER, TGT-RCP-READY, and TGT-RCP-ACTIVE-PLAN exact revisions plus VR-RCP-01 | completed, blocked | T2 | Common Handoff from dev-handoff with the approved input SHA, resulting target SHAs, parser report, one-time cutover state, and anchored CPRI terminal-contract preservation receipt. |
| OUTP-RCP-T2 | T2 | TGT-RCP-HELPER exact revision plus VR-RCP-02 | completed, blocked | T3 | Common Handoff from dev-handoff with helper argv/result protocol, parser dependency, target SHAs, and Bun receipt. |
| OUTP-RCP-T3 | T3 | TGT-RCP-OMP exact revision plus VR-RCP-03 | completed, blocked | T4 | Common Handoff from dev-handoff with extension event boundary, helper protocol, target SHAs, and Bun receipt. |
| OUTP-RCP-T4 | T4 | TGT-RCP-TRANSPORT exact revision plus VR-RCP-04 | completed, blocked, authority-change-required | T5 | Common Handoff from dev-handoff with all six rule SHAs, pair-equality receipt, and any approval-boundary finding. |
| OUTP-RCP-T5 | T5 | TGT-RCP-CUTOVER exact revision plus VR-RCP-05 | completed, blocked | T6 | Common Handoff from dev-handoff with changed and preserved inventories, exact ADR-0001 D26, D18/D19/D27, and CPRI preservation hashes, workflow one-phrase diff, scanner/trace receipts, and exact seven-case identities. |
| OUTP-RCP-T6 | T6 | TGT-RCP-PROOF evidence receipt plus VR-RCP-06 | completed, blocked, failed | dev-verification | One work-task Common Handoff from dev-handoff with raw redacted surface evidence, final target SHAs, storage result, archived-or-active Plan 1 durable Resume-from identity or proven absence, current-Handoff validity, presenter-eligibility verdict, residual storage risk, and cleanup receipt. It is not a presenter Handoff; after the scheduled tail, normalization uses that tail's current final existing Handoff in a supported portable or approved full-digest in-conversation form and creates no second Handoff. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-RCP-DRIFT | repository-plan-worker | Fresh per-target and preservation-surface SHA inventory, caller/fixture reread, valid current-v1 parser report, byte-identical authoritative local draft/repository projection, and native approval naming the complete revised SHA | T1, T2, T3, T4, T5, T6 | AUTH-RCP-REVISION permits plan revision only; T1 alone may bind `Methods: none`, enter `ready`, remove the provenance header, and transfer lifecycle ownership after exact native approval. Any later semantic difference follows ADR-0001 D02. | The revised target map matches current bytes, Plan 2 preservation identities are sealed, local and repository plan bytes are identical, the current parser reports valid, and native approval names that exact SHA. |
| BLK-RCP-REVIEW-SLUG | repository-plan-worker | `local://repository-canonical-plans-review-handoff.md@sha256:49963da844488f92ea20e10d5ccfda4ae6790794cb577ab2320f30364e39318f` plus review evidence `sha256:9e6fd1d8605fbc41aa6a39a6c40abb69ef79b3e00b988ffe2e7fa9bbe676335a` | T4, T5 | AUTH-RCP-IMPROVE-SLUG-REPAIR-20260825-1026 permits the exact repair target expansion and consumes repair `1/1`; parent criteria/proofs remain frozen. | Both future-authoring surfaces use canonical `Datetime_improve-variant.md` form, the expanded target/preservation manifest is current, repair smoke passes, aggregate independent verification is `VERIFIED`, and original-rerun closes the sealed lineage without a repair-caused blocker. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-RCP-RULES | rules | `.config/agents/rules/plan.md`; `.config/agents/rules/plan-impl-spec.md` | Own the future portable artifact and lifecycle grammar. |
| ANC-RCP-PARSER | parser | `.config/agents/skills/dev-implementation/scripts/executor_plan.py` `validate_text`, `validate_file`, and CLI `validate` | Supplies the only structural and lifecycle verdict consumed by helper and backend. |
| ANC-RCP-HELPER | executable | `bin/omp-copy-plan-artifact` operation `copy` | Copies immutable local snapshots and performs parser-valid terminal archival. |
| ANC-RCP-CPRI | immutable dependency | `.agents/plans/archive/2026-08-24-1243_completion-presentation-resume-index.md@sha256:4f707ee83fe89c58d947b1282a5072f8a5c884c4acfb055117709d9b915b6b9d#completion-summary` | Fixes D18/D19/D27 presentation, durability, existing-Handoff, same-agent, and shipping boundaries without granting T1 approval. |
| ANC-RCP-D08 | durable cutover | `docs/adr/0002-executor-plans-and-orchestration.md` D08 plus its affected-contract/evidence projection; `docs/adr/INDEX.md` D08/D18/D19/D27 rows; `.config/agents/skills/dev-ask/WORKFLOW.md` line 105; compact checklist lines 5-6; seven exact eval IDs and fixtures named in T5 | Owns the plan-shape cutover while preserving ADR-0001 D26 and completed terminal-projection wording. |
| ANC-RCP-IMPROVE-SLUG | direct authoring consumer | `.config/agents/skills/improve/SKILL.md`; `.config/agents/skills/improve/references/plan-template.md` | Both future `/improve` standard/deep authoring instructions must emit the canonical lowercase kebab-case repository identity while historical filenames remain read-only. |

- ASM-RCP-PREREQUISITE: Completion-presentation Plan 2 remains archived `DONE` at sha256:4f707ee83fe89c58d947b1282a5072f8a5c884c4acfb055117709d9b915b6b9d and is never reopened, reverified, or reassessed.
- ASM-RCP-WRITER: One owner mutates a plan lifecycle; simultaneous writers require a separate approved concurrency design rather than restored session provenance or caller CAS.
- ASM-RCP-BASELINES: Task owners recheck every named base and preservation identity before editing and stop on unowned drift.
- ASM-RCP-HISTORY: Archives, protected ADR-0001 D26, completion-presentation implementation/evals, non-target evals/fixtures, and `.agents/plans/2026-06-24_flue-omp-integration.md` remain read-only evidence.
- ASM-RCP-HOST-ADVISORY: Possible same-model or model-family dependence in OMP/Grok host renders remains a nonblocking residual risk and adds no Plan 1 assurance work.

## Completion Summary

- Outcome `OUT-REPOSITORY-CANONICAL-PLANS` is complete. All six tasks and `VR-RCP-01` through `VR-RCP-06` are complete on the approved clean-cutover scope; semantic attempt consumption remains `1/2`.
- Portable plan execution now uses one context-free parser-valid repository artifact. OMP keeps per-mutation local-draft copying, terminal storage remains non-authoritative and no-overwrite, and the transport rules are adapter-only.
- The post-assurance repair consumed `1/1` at repair attempt `2/2`. Future `/improve` standard/deep plans compose one `improve-` prefix with unprefixed `deep`, `security`, or `standard`; exact outputs are `2026-06-14-1530_improve-deep.md`, `2026-06-14-1530_improve-security.md`, and `2026-06-14-1530_improve-standard.md`. Historical filenames and protected surfaces remain unchanged.
- Independent verification is `VERIFIED`: `local://repository-canonical-plans-repair-verification-v2-handoff.md@sha256:cc7b36ba0e6e38ef718952f144260ba8566359c0a424942fc93b17dadb83f8eb`; evidence `local://repository-canonical-plans-repair-verification-v2-evidence.json@sha256:d2a6a7866bd7cb5629557a37e5ef935e78d5c2e57d62fe9576d353607c0cebdb`.
- Original-rerun review is `APPROVED`, with Standards `PASS`, Specification `PASS`, no blocking or remaining lineage, and advisory `ASM-RCP-HOST-ADVISORY`: `local://repository-canonical-plans-review-rerun-handoff.md@sha256:0a4deba99838388fdaca806530a17959608c286753e33df11db4ebd625e54c88`; evidence `local://repository-canonical-plans-review-rerun-evidence.json@sha256:0e239af199181b930da2435124848fa4d90128308c8cb6b63e2439b0a47d8735`.
- Terminal learning result is `NO DURABLE LEARNING`; no guidance or papercut record changed: `local://repository-canonical-plans-learning-handoff.md@sha256:a5e55bf1e2b95f61454f2e8bf8110eb0cdfee8172a6e32e3f8ff1aa737998858`.
- Final target/preservation inventory before backend lifecycle closure: `local://repository-canonical-plans-implementation-target-v4.json@sha256:a395f224b15b87a76701e47bc9a58c2d3e05337da51c5c01ac6f7ad0b914c771`; applicable rules `local://repository-canonical-plans-applicable-rule-manifest.json@sha256:7f4c5656d73869043ed50e67f72487b05d70b14366ec9567f09cc062c6cfba7d`.
- Terminal storage target is `.agents/plans/archive/2026-08-22-1603_repository-canonical-plans.md`; backend archival changes only this lifecycle artifact's location. No staging, commit, push, release, deployment, or shipping was authorized.
- Residual risk is nonblocking: disposable OMP/Grok observations may share model-family behavior (`ASM-RCP-HOST-ADVISORY`). The user-owned papercut record `pc-ae711c27c4d758b7` remains unchanged.
