# Portable Terminal Plan Archive Boundary

**Datetime**: 2026-08-29-0045
**Mode**: implementation
**Scope**: Portable terminal repository-plan lifecycle, archive storage projection, completion callers, and semantic guards
**Summary**: Require a repository plan transitioned to `DONE` or `CLOSED` in the current session to reach the existing exact-byte archive postcondition before terminal caller output. Planned completion resumes only from the archived plan; already-terminal intake and planless compact remain mutation-free.
**Status**: DONE
**Completed At**: 2026-08-29-0321

## Objective

- Outcome: OUT-ARCH-01
- Observable end state: Every current-session repository-plan transition from nonterminal state to parser-valid `DONE` or `CLOSED` uses the existing archive operation after all applicable semantic and assurance boundaries settle and before presentation or cancellation close; successful planned `resume_from` identifies the exact archived Completion Summary; already-terminal and planless intake cause no archive action.
- Progress signal: One named AC-ARCH criterion passes against the exact owned target, or one named BLK-ARCH blocker is resolved. Rewording, another archive attempt without new evidence, a historical sweep, or presentation from an active terminal plan is not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-ARCH-HUMAN | Human-confirmed final plan-creation Handoff | `local://portable-terminal-archive-plan-creation-handoff.md@sha256:9a00d9a3c8dfb12fabb08046472330c5fbe8681329d75cce495f28737456ee1f` | `AUTH-ARCH-PLAN-20260829-R1`; source `AUTH-ARCH-REV-20260829-R1` | Highest authority for archive-only scope, D29, two work tasks, standard assurance, preservation, acceptance, and terminal handling; no decision frontier remains. |
| AUTH-ARCH-INVENTORY | Current human authority correction | Current plan-authoring decision selecting “Authorize inventory-only edit” | `AUTH-ARCH-COMPARE-INVENTORY-20260829-R1` | `AUTH-ARCH-HUMAN` remains highest except one narrow supersession: `AUTH-ARCH-INVENTORY` wins only for adding `B-TERMINAL-PLAN-ARCHIVE-MATRIX` to `.config/agents/skills/dev-ask/evals/compare_trace.py` `ADDED_IDS`; it cannot change schema, CLI, comparator behavior, `REWRITE_IDS`, keep-check logic, or any other byte. |
| AUTH-ARCH-BASE | Handoff-bound repository state | `git:4032c0f4a2bb49ec3c2a1893283c007efc8cc311` | Exact clean base commit and hashes in the Target map | Execution starts only from semantically equivalent current bytes; material drift follows BLK-ARCH-DRIFT. |
| AUTH-ARCH-ADR-0002 | Active executor-plan authority | `docs/adr/0002-executor-plans-and-orchestration.md@sha256:c0b0293f43f989c5180804b5a21f6443f3b1830e3e0348d2e1b3bc661ba08a89` | D06, D08, D09, D21 before D29 | Reopen only D06 and D09, add D29, and synchronize affected-contract, evidence, human-authority, and verification projections. D08 and D21 remain semantically unchanged. |
| AUTH-ARCH-PLAN-RULES | Current portable lifecycle and storage contracts | `.config/agents/rules/plan.md@sha256:97387afc9bccf8a0d30fe001f3c3eb171a1d70726f047761e38c67773f6e769c`; `.config/agents/rules/plan-repo-storage.md@sha256:fa1b67b6a137cbcdcb5d4ce276f1388a150ce36cb58f22e5e2a9cb5a17132734`; `.config/agents/rules/plan-omp-transport.md@sha256:08c1e0b4d2abd7a986a2b34169d6652b8c6f6d23073d13754f4103d1c6b98020` | Current before cutover | Preserve Executor Plan v1 grammar and existing archive mechanics; add only the caller trigger and remove the active-plan presentation fallback. |
| AUTH-ARCH-PRESERVE | Exact protected-surface authority | TGT-ARCH-PRESERVATION | Bound hashes and pre-T1 archive manifest | No protected path may change; any required protected mutation is `authority-change-required`. |

Authority precedence leaves `AUTH-ARCH-HUMAN` highest except one narrow supersession: `AUTH-ARCH-INVENTORY` wins only for adding `B-TERMINAL-PLAN-ARCHIVE-MATRIX` to `.config/agents/skills/dev-ask/evals/compare_trace.py` `ADDED_IDS`; it cannot change schema, CLI, comparator behavior, `REWRITE_IDS`, keep-check logic, or any other byte. Active ADR and portable rule authority, then current executable projections, follow that exception. The Handoff’s logical locator need not be re-resolved during execution because this plan projects its complete fixed contracts; its digest remains the immutable authority identity.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-ARCH-D29 | AUTH-ARCH-HUMAN; AUTH-ARCH-ADR-0002 | EFF-ARCH-CONTRACT adds D29 to ADR-0002, narrowly reopens D06/D09, and makes the existing archive postcondition necessary before terminal caller output without turning storage into approval, readiness, semantic completion evidence, a task, or a stage. |
| DEC-ARCH-TRIGGER | AUTH-ARCH-HUMAN | EFF-ARCH-CONTRACT triggers only when the current plan root first validated `PENDING` or `IN_PROGRESS` and the same run changes that plan to parser-valid `DONE` or human-authorized `CLOSED`; no persisted marker, scan, inference, or terminal-file reconciliation is added. |
| DEC-ARCH-ORDER | AUTH-ARCH-HUMAN | EFF-ARCH-CONTRACT orders successful `DONE` as semantic work and settlement, required assurance/review/learning, complete terminal plan bytes, archive postcondition, caller normalization, then unchanged presentation. It orders current-session `CLOSED` as authorized terminal bytes, archive postcondition, then cancellation-close output with no completed presentation. |
| DEC-ARCH-STORAGE | AUTH-ARCH-HUMAN; AUTH-ARCH-PLAN-RULES | EFF-ARCH-CONTRACT reuses current identity, parser validation, regular non-symlink safety, no-overwrite publication, exact-byte comparison, active removal, idempotent exact-archive success, drift checks, and visible conflict behavior. No archive helper, protocol, receipt schema, ledger, daemon, runtime store, or lifecycle state is added. |
| DEC-ARCH-RESUME | AUTH-ARCH-HUMAN | EFF-ARCH-CONTRACT allows planned `resume_from` only from the identity-derived archive path followed by `@sha256:`, the lowercase SHA-256 of the exact archived terminal bytes, and `#completion-summary`. The active path is never a planned terminal locator. |
| DEC-ARCH-EXCLUSIONS | AUTH-ARCH-HUMAN | EFF-ARCH-CONTRACT gives already-`DONE` or already-`CLOSED` intake no archive trigger or historical sweep. Planless compact performs no repository-plan lookup, archive action, receipt request, or synthetic-plan creation and keeps its current durable-summary boundary. |
| DEC-ARCH-FAILURE | AUTH-ARCH-HUMAN | EFF-ARCH-CONTRACT preserves both-path conflict, divergent archive, parser-invalid terminal bytes, unsafe file kind, source drift, target drift, and uncertain postcondition as visible storage blockers. No overwrite, blind retry, semantic continuation, completion fence, cancellation close, or conversion into completion evidence is permitted. |
| DEC-ARCH-CUTOVER | AUTH-ARCH-HUMAN; AUTH-ARCH-INVENTORY | EFF-ARCH-CONTRACT changes canonical authority and callers first; EFF-ARCH-GUARDS then changes exactly five existing semantic cases, one new focused matrix case, the registry, scanner, and comparator inventory membership. No other case, fixture, comparator function, or observer contract changes. |
| DEC-ARCH-PRESERVE | AUTH-ARCH-HUMAN | EFF-ARCH-GUARDS proves D14, ADR-0001, ADR-0009 D27, completion rendering/schema, Common Handoff, shipping/Git rules, parser/grammar, copy binaries, harness extension, Grok transport, and existing archive rows exact. |

## Scope, non-goals, and prohibited effects

- Read surfaces: all authority, mutable targets, semantic fixtures, scanner/comparator inventory anchors, protected hashes, archive manifest, current plan identity, and task/assurance Handoffs named here.
- Change surfaces: TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES, TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, TGT-ARCH-COMPARATOR, ordinary plan lifecycle bookkeeping, and this plan’s one post-tail archive move.
- Non-goals: changing plan status/header/task/criterion/Completion Summary grammar; changing storage mechanics; creating a new archive command, helper, protocol, receipt, stage, task, Handoff field, persistence layer, or historical sweep; changing the renderer; adding archive behavior to planless compact; changing delivery policy or repository-specific adapters.
- Prohibited effects: mutation of TGT-ARCH-PRESERVATION or pre-existing archive rows; presentation from an active terminal plan; presenter-owned archival; semantic work after an archive blocker; staging, commit, push, review request, release, deploy, rollout, branch/history mutation, credential use, or external mutation.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-ARCH-CONTRACT | Repository mutation | AUTH-ARCH-HUMAN | T1 may change only TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, and TGT-ARCH-RULES on their exact current bytes; reversible before separately authorized delivery. |
| EFF-ARCH-GUARDS | Repository mutation | AUTH-ARCH-HUMAN; AUTH-ARCH-INVENTORY | T2 may change only TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, and the single `ADDED_IDS` membership in TGT-ARCH-COMPARATOR; no harness schema or comparator behavior change. |
| EFF-ARCH-LEARNING | Bounded terminal learning mutation | AUTH-ARCH-HUMAN plus current portable learning authority | T5 may apply only a separately qualified proof-bound `CURATED` change within the already mutable T1/T2 guidance surfaces; otherwise return `NO DURABLE LEARNING`. A protected or unowned write returns `BLOCKED`. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-ARCH-TRIGGER | Current-session terminal transition | T1 | `terminal-archive-trigger/r1` from AUTH-ARCH-HUMAN | T2, T3, T4, T5 |
| CONTRACT-ARCH-STORAGE | Existing exact-byte archive postcondition | T1 | AUTH-ARCH-PLAN-RULES current mechanics plus D29 trigger | T2, T3, T4, T5 |
| CONTRACT-ARCH-ORDER | Terminal lifecycle ordering | T1 | ADR-0002 D06/D09/D29 at final T1 bytes | T2, T3, T4, T5 |
| CONTRACT-ARCH-RESUME | Planned Completion Summary locator | T1 | `archive-only-resume/r1` | T2, T3, T4, T5 |
| CONTRACT-ARCH-EXCLUSIONS | Already-terminal and planless preservation | T1 | `terminal-no-sweep-planless/r1` | T2, T3, T4, T5 |
| CONTRACT-ARCH-FAILURE | Visible storage blocker behavior | T1 | Existing storage failures plus D29 caller stop | T2, T3, T4, T5 |
| CONTRACT-ARCH-TRACE | Finite semantic case and exact event vocabulary | T2 | Six-case matrix in the T2 execution contract | T3, T4, T5 |
| CONTRACT-ARCH-PRESERVATION | Protected files and archive rows | T2 | TGT-ARCH-PRESERVATION exact baseline | T1, T3, T4, T5 |

`CONTRACT-ARCH-TRIGGER` defines nonterminal as `PENDING` or `IN_PROGRESS`. “Current session” means the implementation root’s initial exact validation observed one of those states and that same run authored and revalidated `DONE` or `CLOSED`; no clock heuristic, file scan, persisted flag, or inferred ownership qualifies.

`CONTRACT-ARCH-STORAGE` succeeds only when the active identity path is absent and the archive identity path is a regular non-symlink file whose complete bytes equal the exact parser-valid terminal snapshot. A current successful adapter archive result may satisfy this postcondition without a second action. Both paths present is always a conflict. Storage success remains necessary but insufficient for presentation and grants no authority beyond this postcondition.

For `DONE`, `CONTRACT-ARCH-ORDER` requires all semantic work, smoke, Common Handoffs, papercut accounting, required verification/review/learning, task and criterion records, Completion Summary, `Completed At`, and parser-valid terminal bytes before archival. Only a current archive postcondition then permits completion normalization and presentation. For `CLOSED`, explicit human cancellation authority produces parser-valid terminal bytes without `Completed At` or Completion Summary; archival must succeed before one cancellation-close report, and generic completed presentation remains forbidden.

`CONTRACT-ARCH-RESUME` binds this plan’s eventual successful locator to `.agents/plans/archive/2026-08-29-0045_portable-terminal-plan-archive.md`, then literal `@sha256:`, then the computed lowercase 64-hex digest of those archived terminal bytes, then `#completion-summary`. Every other planned route derives the same form from its immutable Datetime and canonical slug. Planless compact keeps its existing qualifying durable summary and does not use this contract to manufacture a repository plan.

`CONTRACT-ARCH-FAILURE` preserves exact source/destination paths, kinds, and digests on any failure. The caller emits the existing visible storage blocker and stops terminal output; it does not revert terminal status speculatively, delete or overwrite an archive, retry without changed evidence, continue semantic work, or emit a second Handoff.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-ARCH-AUTHORITY | `docs/adr/INDEX.md`; `docs/adr/0002-executor-plans-and-orchestration.md` | T1 | SHA-256 respectively `2f1c298cbf3701ad7c04352ca74a8f27a90d9b72b1b759c129309597d7927761`, `c0b0293f43f989c5180804b5a21f6443f3b1830e3e0348d2e1b3bc661ba08a89` | Active decision discovery; every portable caller; T2 scanner | AC-ARCH-08, AC-ARCH-11 |
| TGT-ARCH-CALLERS | `.config/agents/skills/dev-ask/SKILL.md`; `dev-ask/WORKFLOW.md`; `dev-implementation/SKILL.md`; `dev-implementation/references/plan-orchestration.md`; `dev-implementation/references/compact-checklist.md` | T1 | SHA-256 respectively `1bef167205a5f99f57c40d924472ee9d214bd92c58f1446b00b11d37c6ae2c04`, `e8f8ffb1e7777816824c003341709172b09c3ab4641a7e31177d5f9f559643aa`, `e0e3e4f3a41568ac81d2e6ec2fdcd630323a45629abf7b4d89099051817d17ad`, `0acc5daf263b061689972c79a4a2c70869103d881b70fe3624aa7bb72883bf92`, `5def1ef6c2297602a5c6bfb6d2c60e0fdef9825b3dc3a7bd095f749daf48cedb` | Plan root; planned completion normalizer; cancellation close; compact split | AC-ARCH-08, AC-ARCH-11 |
| TGT-ARCH-RULES | `.config/agents/rules/plan.md`; `plan-repo-storage.md`; `plan-omp-transport.md` | T1 | SHA-256 respectively `97387afc9bccf8a0d30fe001f3c3eb171a1d70726f047761e38c67773f6e769c`, `fa1b67b6a137cbcdcb5d4ce276f1388a150ce36cb58f22e5e2a9cb5a17132734`, `08c1e0b4d2abd7a986a2b34169d6652b8c6f6d23073d13754f4103d1c6b98020` | All repository Executor Plans and OMP local-draft projection | AC-ARCH-08, AC-ARCH-11 |
| TGT-ARCH-REGISTRY | `.config/agents/skills/dev-ask/evals/evals.json` | T2 | SHA-256 `4d1fa42715f8e2520f69a74e22d15cc6efafd47367a3d981b127880621f38546`; Git blob `774bbf8a4901f9c24a596113a2c1ab60e36b12ed` at AUTH-ARCH-BASE | Five rewritten cases and one new case in the fixture manifest | AC-ARCH-01, AC-ARCH-02, AC-ARCH-03, AC-ARCH-04, AC-ARCH-05, AC-ARCH-06, AC-ARCH-07, AC-ARCH-13 |
| TGT-ARCH-FIXTURES | Exact six-fixture manifest below | T2 | Five exact hashes plus one path absent at AUTH-ARCH-BASE | Matching registry cases and semantic comparator | AC-ARCH-01, AC-ARCH-02, AC-ARCH-03, AC-ARCH-04, AC-ARCH-05, AC-ARCH-06, AC-ARCH-07, AC-ARCH-13 |
| TGT-ARCH-SCANNER | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` | T2 | SHA-256 `6ff5bbd28d21281cc51e9fb2102af4420921d219b8866a9cc1418477a00cdbe5` | Active caller scan; six-case parity; scanner self-test | AC-ARCH-09, AC-ARCH-10, AC-ARCH-12, AC-ARCH-13 |
| TGT-ARCH-COMPARATOR | `.config/agents/skills/dev-ask/evals/compare_trace.py`, `ADDED_IDS` only | T2 | SHA-256 `545fc0028dac214ab3e315b3900c993d714be5939bc8aa1e5ca5ae56f1fe0b95` | `keep_check`; new case inventory membership | AC-ARCH-13 |
| TGT-ARCH-PRESERVATION | Exact protected hashes and pre-T1 archive manifest below | T2 | Bound list below | Both work tasks and final assurance | AC-ARCH-09, AC-ARCH-10, AC-ARCH-12, AC-ARCH-13 |
| TGT-ARCH-VERIFICATION | Exact immutable T1/T2 target manifest and complete work evidence | T3 | Produced by OUTP-ARCH-T2 and bound by one sorted changed-path SHA-256 manifest | Fresh proof of AC-ARCH-01 through AC-ARCH-13 | AC-ARCH-14 |
| TGT-ARCH-REVIEW | Exact unchanged T3-verified target | T4 | Produced by OUTP-ARCH-T3 with aggregate `VERIFIED` | One Standards and Specification pass | AC-ARCH-15 |
| TGT-ARCH-LEARNING | Exact unchanged T4-approved target and terminal assessment envelope | T5 | Produced by OUTP-ARCH-T4 with overall `APPROVED` | Portable terminal assessment, then backend completion | AC-ARCH-16 |

Finite fixture manifest; no other dev-ask fixture is mutable:

| Case ID | Fixture path | Base identity | Required disposition |
|---|---|---|---|
| `B-COMPACT-PLAN-NO-TAIL` | `.config/agents/skills/dev-ask/evals/fixtures/b-compact-plan-no-tail/case.json` | SHA-256 `c61fc9656f97b86c16038345e7c77f27cafffba0615d195d6a40fbaed5d7d3e3` | Preserve compact child/closure/smoke/no-tail behavior; add `DONE`, archive, archive-only resume, then presentation. |
| `B-PLAN-TAIL-OMITTED` | `.config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-omitted/case.json` | SHA-256 `c57bf196d365ff28279098ef494c384a666303c1e30f79ba52fbdaee0c52be43` | Preserve backend-scheduled assurance once; add terminal bytes and archive after learning, before presentation. |
| `B-PLAN-TAIL-PROFILE` | `.config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-profile/case.json` | SHA-256 `41b3c2608ea0c24fabe2a8bb7ef2c1bd539db5ea5fc676a800bc12a52529abd3` | Preserve authored assurance tail once; add terminal bytes and archive after learning, before presentation. |
| `R-COMPLETE` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json` | SHA-256 `2db4eb07579c3cb421fe9fe7d52be0cd278ed92fa8390e0f40683804db5c213d` | Make the standard completion explicitly planned; validate current archive before normalization and use archive-only Resume from. |
| `R-COMPLETE-COMPACT-NO-LEARNING` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json` | SHA-256 `1e7cb5a27ce8bafd11b2ff4e02f50d8a5228adf904ba9db3dda6f6c8ad7c95c4` | Make the compact completion explicitly planless; require zero repository-plan lookup/archive/receipt/synthetic-plan behavior. |
| `B-TERMINAL-PLAN-ARCHIVE-MATRIX` | `.config/agents/skills/dev-ask/evals/fixtures/b-terminal-plan-archive-matrix/case.json` | Absent at AUTH-ARCH-BASE | Add one backend no-tool semantic matrix for `DONE`, current-session `CLOSED`, already-`CLOSED`, seven storage blockers, and planless compact. |

TGT-ARCH-PRESERVATION binds these exact baseline identities:

- `docs/adr/0001-dev-workflow-authority-and-routing.md@sha256:a4406b0cdf28c93fc5801ba3eb17e8073c6fafe0e4fa95a8214242387da77978`
- `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md@sha256:a0dad54405e7d21e3bcd7a70200964b1bfe9970a0e50f96e4b92ccd4d9bd98d4`
- `.config/agents/skills/completion-presentation/SKILL.md@sha256:ed33a7d039846e2f99a8d5df52e4f4f81b6b0b262d66ec77b417e8d56e1ebc57`
- `.config/agents/skills/completion-presentation/evals/evals.json@sha256:5ee17d07ef33a7284b14ab77ea0c3dd5d17b3741dee6cccbdaa111f0e19acf01`
- `.config/agents/skills/dev-handoff/SKILL.md@sha256:eccf6a95692f22e09bc3aadc486f38957a7255841d9466707650de8b30d8b7e2`
- `.config/agents/skills/dev-shipping/SKILL.md@sha256:0b472f2c25a0313e8efde1323f18e9b9e0a64a7b7f9e5e7f94d660e29fdb7966`
- `.config/agents/rules/git.md@sha256:3fa7cb9e24bb381868947a005698f11bff89a4d3e714d4f61d10bae8e0bef3cc`
- `.agents/rules/git-dotfiles.md@sha256:43cada15d3e6dbd4b7bcb86b7eda15c56354556f7c34cc40dd3dbb69dd2482dc`
- `.config/agents/rules/plan-impl-spec.md@sha256:eb058c61270160bd356f32283a144c19149ee4d5b61a7d48626b121e9258e043`
- `.config/agents/rules/plan-grok-transport.md@sha256:72bd67b5804f23c2f8bf02858c981c70a94194a7a336f9794f1191528fb94e07`
- `.config/agents/skills/dev-implementation/scripts/executor_plan.py@sha256:1e0d7c9c52b6904526d87b3604b4e5057779d0b8377f8972c6f15e7b9fa06f4c`
- `.config/agents/skills/dev-implementation/scripts/test_executor_plan.py@sha256:b1f05da01198e2d0f927708e9a73300c276b4012d2c8ba9d01de55f56f2df187`
- `bin/dot-add@sha256:2ee1b18002f070ac5425a81afbac7883acf00ea278b6af2acc303d07762a8d55`
- `bin/omp-copy-plan-artifact@sha256:4fb0e67acc6b2a1145ca2e03995ad062d7ca0a2e8543cb3ca89a416b4f448fed`
- `.config/agents/harnesses/omp/extensions/plan-artifact-sync.js@sha256:c487568b69d3b1363f59f1fcd3dbeaebf1ae2f5d0c9804ccf203f5d946cd77dc`
- `.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js@sha256:a03b053c8735acfec73168b81fdd587ce19e71521cb40438d955ad06f6120c94`
- `.config/agents/skills/dev-ask/evals/observe_case.py` remains byte-identical; every comparator byte outside the one new `ADDED_IDS` member remains byte-identical.
- Before T1 writes, seal the complete `.agents/plans/archive/` relative-path and SHA-256 manifest and reject symlinks or non-regular entries. Before the backend’s non-task terminal archive operation, every sealed row must remain exact. After that operation, the only permitted addition is this plan’s exact archive identity; no pre-existing row may differ or disappear.

## Execution policy

- Assurance: standard
- Topology: full-orchestration
- Max concurrency: 1
- Isolation: shared repository tree with exact target/effect ownership
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 completes and hands its exact target to T2 before T2 starts. T2 cannot repair T1-owned files; a T1 defect returns through the existing bounded repair path. T3 through T5 receive immutable predecessor targets. Any undeclared write stops the child.
- Decomposition: Exactly two serial work tasks followed by the authored `dev-verification`, `dev-code-review`, and `dev-continual-learning` standard suffix. T5 returns to `dev-implementation backend`; no integration, audit, archive task, or presenter task exists.
- Effect limit: EFF-ARCH-CONTRACT, EFF-ARCH-GUARDS, EFF-ARCH-LEARNING
- Orchestrator profile: `orchestrator-role-profile/v1`; every authored owner runs as a fresh child under plan-backed `full-orchestration`; `downgrade: none`; `PROMOTE-SERIAL-DEFAULT` keeps runtime concurrency one.
- Terminal policy: After accepted OUTP-ARCH-T5, the backend completes all plan bookkeeping in one terminal revision, validates it, performs the existing non-task terminal archive operation under DEC-ARCH-D29, validates the archive postcondition, constructs archive-bound completion input, and invokes the unchanged same-agent presenter. This administrative lifecycle operation is outside the authored task/effect table and grants no task, Handoff, or shipping authority. Archive failure emits no fence or completed report. A later explicit portfolio audit is separate fresh intake.

## Tasks

- [x] T1. Cut over terminal archive authority and callers
  completed 2026-08-29-0156
  - Owner: dev-implementation worker
  - Intent: Make terminal plan archival a caller-owned lifecycle precondition without changing storage or presentation ownership.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES
  - Contracts: CONTRACT-ARCH-TRIGGER, CONTRACT-ARCH-STORAGE, CONTRACT-ARCH-ORDER, CONTRACT-ARCH-RESUME, CONTRACT-ARCH-EXCLUSIONS, CONTRACT-ARCH-FAILURE, CONTRACT-ARCH-PRESERVATION
  - Criteria: AC-ARCH-08, AC-ARCH-11
  - Effects: EFF-ARCH-CONTRACT
  - Output: OUTP-ARCH-T1
  - Receiver: T2
  - Verification: VR-ARCH-08, VR-ARCH-11
  - Lineage: shared
- [x] T2. Close archive semantics and stale fallbacks
  completed 2026-08-29-0234
  - Owner: dev-implementation worker
  - Intent: Make permanent semantic controls prove every terminal archive branch and preserve all protected contracts.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, TGT-ARCH-COMPARATOR, TGT-ARCH-PRESERVATION
  - Contracts: CONTRACT-ARCH-TRIGGER, CONTRACT-ARCH-STORAGE, CONTRACT-ARCH-ORDER, CONTRACT-ARCH-RESUME, CONTRACT-ARCH-EXCLUSIONS, CONTRACT-ARCH-FAILURE, CONTRACT-ARCH-TRACE, CONTRACT-ARCH-PRESERVATION
  - Criteria: AC-ARCH-01, AC-ARCH-02, AC-ARCH-03, AC-ARCH-04, AC-ARCH-05, AC-ARCH-06, AC-ARCH-07, AC-ARCH-09, AC-ARCH-10, AC-ARCH-12, AC-ARCH-13
  - Effects: EFF-ARCH-GUARDS
  - Output: OUTP-ARCH-T2
  - Receiver: T3
  - Verification: VR-ARCH-01, VR-ARCH-02, VR-ARCH-03, VR-ARCH-04, VR-ARCH-05, VR-ARCH-06, VR-ARCH-07, VR-ARCH-09, VR-ARCH-10, VR-ARCH-12, VR-ARCH-13
  - Lineage: shared
- [x] T3. Independently verify the archive cutover
  completed 2026-08-29-0300
  - Owner: dev-verification
  - Intent: Prove every archive criterion afresh on one immutable final work target.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-ARCH-VERIFICATION
  - Contracts: CONTRACT-ARCH-TRIGGER, CONTRACT-ARCH-STORAGE, CONTRACT-ARCH-ORDER, CONTRACT-ARCH-RESUME, CONTRACT-ARCH-EXCLUSIONS, CONTRACT-ARCH-FAILURE, CONTRACT-ARCH-TRACE, CONTRACT-ARCH-PRESERVATION
  - Criteria: AC-ARCH-14
  - Effects: none
  - Output: OUTP-ARCH-T3
  - Receiver: T4
  - Verification: VR-ARCH-14
  - Lineage: shared
- [x] T4. Review standards and specification conformance
  completed 2026-08-29-0313
  - Owner: dev-code-review
  - Intent: Review the exact verified revision for final correctness and maintainability.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-ARCH-REVIEW
  - Contracts: CONTRACT-ARCH-TRIGGER, CONTRACT-ARCH-STORAGE, CONTRACT-ARCH-ORDER, CONTRACT-ARCH-RESUME, CONTRACT-ARCH-EXCLUSIONS, CONTRACT-ARCH-FAILURE, CONTRACT-ARCH-TRACE, CONTRACT-ARCH-PRESERVATION
  - Criteria: AC-ARCH-15
  - Effects: none
  - Output: OUTP-ARCH-T4
  - Receiver: T5
  - Verification: VR-ARCH-15
  - Lineage: shared
- [x] T5. Assess terminal learning and return control
  completed 2026-08-29-0321
  - Owner: dev-continual-learning
  - Intent: Assess the approved terminal evidence once without reopening completed work.
  - Methods: none
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-ARCH-LEARNING
  - Contracts: CONTRACT-ARCH-TRIGGER, CONTRACT-ARCH-STORAGE, CONTRACT-ARCH-ORDER, CONTRACT-ARCH-RESUME, CONTRACT-ARCH-EXCLUSIONS, CONTRACT-ARCH-FAILURE, CONTRACT-ARCH-TRACE, CONTRACT-ARCH-PRESERVATION
  - Criteria: AC-ARCH-16
  - Effects: EFF-ARCH-LEARNING
  - Output: OUTP-ARCH-T5
  - Receiver: dev-implementation backend
  - Verification: VR-ARCH-16
  - Lineage: shared

### T1 implementation contract

1. Rehash all T1 targets and TGT-ARCH-PRESERVATION, seal the pre-T1 archive manifest, and compare them with this plan. Preserve unrelated user work; material authority or target drift enters BLK-ARCH-DRIFT before any write.
2. In ADR-0002, update the change date and Decision IDs; extend Scope/Context only for terminal archive ordering; add the existing archive invocation/postcondition to D06 mechanical bookkeeping; add terminal-bytes → archive → caller-output ordering to D09; insert `### D29 — Terminal plan archive boundary` after D21; replace “non-gating terminal storage” with storage that is non-authorizing but required for terminal caller output; add AUTH-ARCH-HUMAN to Evidence/Human authority; and add one D29 verification expectation. D29 records scope, four fixed decisions, why, rejected alternatives, consequences, and reopen conditions from DEC-ARCH-D29 through DEC-ARCH-FAILURE. Do not alter D08/D21 semantics.
3. In `docs/adr/INDEX.md`, add D29 to ADR-0002 scope/authority, extend discovery through D29, add the D29 owner sentence without moving D27, and append the D29 discovery row anchored at `#d29--terminal-plan-archive-boundary`. Leave every other ADR row and the five-core list unchanged.
4. In `plan.md`, add `## Terminal archive boundary` between verification/completion and plan quality. In `plan-repo-storage.md`, add `## Caller-supplied terminal trigger` between direct editing and activation checks. Project CONTRACT-ARCH-TRIGGER/STORAGE/ORDER/RESUME/EXCLUSIONS/FAILURE without changing identity or byte mechanics. In `plan-omp-transport.md`, replace only the paragraph that permits pre-archive presentation: a current archive result may satisfy the postcondition, but active terminal bytes never do. Leave adapter protocol, helper invocation, warning, approval, and profile clauses unchanged.
5. In `dev-implementation`, explicitly permit the root to invoke/validate existing archival as mechanical bookkeeping; add `DONE`, current-session `CLOSED`, already-terminal, failure, and planless branches. In plan orchestration, place archival after all terminal evidence/learning and terminal bytes but before output; state it is no task or hidden tail. In compact guidance, planned compact archives and planless compact performs zero lookup/action. In `dev-ask`, replace the active-or-archive fallback with archive-only planned normalization and stop on failed/uncertain postcondition. Synchronize WORKFLOW D29 maps and ordering without changing route or presenter ownership.
6. Run VR-ARCH-08 and VR-ARCH-11 on exact T1 bytes, settle no-new-test basis because T2 owns the permanent semantic cases, and emit OUTP-ARCH-T1 with a sorted changed-path manifest, archive-manifest identity, protected hashes, and exact residual risk.

### T2 semantic closure contract

1. Consume OUTP-ARCH-T1, rehash all T2 targets, and reject drift before writing. Update only the exact six-case manifest, registry, scanner, and comparator membership authorized above.
2. Preserve every existing event and contract unrelated to archival. Add these exact terminal events to the three planned backend cases, using each case’s synthetic digest (`c` repeated 64 times for PLAN-C, `a` repeated 64 times for PLAN-O, `b` repeated 64 times for PLAN-P):
   - `state:plan-terminal|owner:backend|output:PLAN-C changed from IN_PROGRESS to parser-valid DONE; exact terminal bytes sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc bound`
   - `plan-archive:postcondition|owner:backend|output:PLAN-C archive action 1; active absent; archive byte-identical sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc`
   - `state:plan-terminal|owner:backend|output:PLAN-O changed from IN_PROGRESS to parser-valid DONE; exact terminal bytes sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa bound`
   - `plan-archive:postcondition|owner:backend|output:PLAN-O archive action 1; active absent; archive byte-identical sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
   - `state:plan-terminal|owner:backend|output:PLAN-P changed from IN_PROGRESS to parser-valid DONE; exact terminal bytes sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb bound`
   - `plan-archive:postcondition|owner:backend|output:PLAN-P archive action 1; active absent; archive byte-identical sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb`
   Each terminal snapshot then states presentation count `1` and the matching archive path `.agents/plans/archive/2030-01-02-0304_plan-c.md`, `2030-01-02-0305_plan-o.md`, or `2030-01-02-0306_plan-p.md`, followed by `@sha256:`, its case digest, and `#completion-summary`. PLAN-C remains tail-free; PLAN-O and PLAN-P archive only after their existing terminal learning event. Forbid archive-before-assurance, completion-before-archive, active-plan resume, historical sweep, and a second archive action.
3. In `R-COMPLETE`, use synthetic PLAN-R digest `dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd`; order `terminal-evidence-check`, then `plan-archive:validated|owner:dev-ask|output:PLAN-R active absent; archive byte-identical sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd; archive actions 0`, then `completion-normalization`, existing field events, `completion-input:resume-archive|owner:dev-ask|output:.agents/plans/archive/2030-01-02-0307_plan-r.md@sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd#completion-summary`, then presentation. Forbid normalization before archive validation, active-plan resume, presenter-owned archival, and archive retry.
4. In `R-COMPLETE-COMPACT-NO-LEARNING`, immediately after terminal evidence require `planless-archive-control|owner:dev-ask|output:repository plan lookups 0; archive actions 0; archive receipts 0; synthetic plans 0`; preserve the existing planless durable summary/Handoff and compact learning token. Forbid any plan-archive event, repository-plan Resume from, or synthetic-plan creation.
5. Add backend case `B-TERMINAL-PLAN-ARCHIVE-MATRIX`, mode `read-only terminal lifecycle matrix`, owner/first owner `backend`, route `dev-implementation backend`, no scripted replies or additional files, and exact required branches: one `IN_PROGRESS` → `DONE` success using digest `eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee` and one presentation from `.agents/plans/archive/2030-01-02-0308_plan-done.md@sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee#completion-summary`; one `IN_PROGRESS` → `CLOSED` success using digest `ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`, one archive action, one cancellation close, and completed presentations `0`; one already-`CLOSED` intake with transitions/lookups/actions/presentations `0` and unchanged path/content identities; and one planless branch with repository-plan lookups/archive actions/synthetic plans `0`.
6. The same matrix contains seven ordered `plan-archive:blocker|owner:backend|output:` events, one each for `both identity paths present`, `divergent archive`, `parser-invalid terminal bytes`, `unsafe file kind`, `source drift`, `target drift`, and `uncertain postcondition`. Every event ends exactly `; visible storage blocker; existing bytes preserved; overwrites 0; completed presentations 0; cancellation closes 0; semantic continuations 0`. Forbid completion-before-archive, cancellation-close-before-archive, active-plan resume, historical sweep, archive overwrite, storage retry, semantic continuation after blocker, presenter-owned archival, second Handoff, and new archive receipt schema.
7. In `scan_stale_contracts.py`, add the new ID to `ADDED_IDS`; add `TERMINAL_ARCHIVE_SEMANTIC_CASE_FIXTURES` containing the six exact registry/fixture pairs; compare each through existing `compare_semantic_case`; require the exact branch/order/count tokens above; and add path-scoped stale fragments `active or archive locator`, `may proceed before archive`, `resume from binds that active file`, and `active plan durability`. Apply those fragments only to caller-owned plan/workflow/implementation/transport projections. Self-tests must reject each on a caller path, ignore the same generic text on the protected renderer path, reject registry-only/fixture-only drift, missing failure branches, wrong archive/output order, active-plan resume, and nonzero planless archive behavior.
8. In `compare_trace.py`, add only `B-TERMINAL-PLAN-ARCHIVE-MATRIX` to `ADDED_IDS`; change no function, schema, CLI, base/rewrite set, or other byte. Run all VR-ARCH-01 through VR-ARCH-07, VR-ARCH-09, VR-ARCH-10, VR-ARCH-12, and VR-ARCH-13 recipes, settle the new matrix as `keep` because it uniquely catches pre-archive output, historical sweep, and failure continuation, and emit OUTP-ARCH-T2 with the exact final target manifest.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-ARCH-01 | A plan changes from `IN_PROGRESS` to parser-valid `DONE` in the current run after all applicable semantic and assurance evidence settles. | Existing archive action runs once; active path is absent; archive bytes equal terminal bytes; only then one completion fence/presentation is permitted. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-02 | A planned successful caller builds `resume_from`. | Locator is the identity-derived archive path, literal `@sha256:`, the exact archived-byte digest, and `#completion-summary`; no active locator is accepted or emitted. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-03 | Explicit human cancellation changes a current nonterminal plan to parser-valid `CLOSED`. | Existing archive action runs once and reaches the same exact-byte postcondition before one cancellation-close report; completed presentations remain zero. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-04 | Intake is already `CLOSED` before this run owns a transition. | Transition, archive lookup/action, reconciliation, historical sweep, and storage mutation counts are zero; exact path/content identities remain unchanged. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-05 | Each of the seven storage failure modes occurs after terminal intent. | Visible blocker preserves bytes and reports exact cause; overwrite, presentation, cancellation close, semantic continuation, blind retry, and second Handoff counts are zero. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-06 | A planless compact route completes. | Repository-plan lookup, archive action, archive receipt, and synthetic-plan counts are zero; existing durable summary/Handoff and compact presentation remain unchanged. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-07 | Compact-plan, standard omitted-tail, and standard authored-tail routes complete. | Compact plan stays tail-free; both standard variants retain verification/review/learning exactly once; every plan archives only after its existing terminal semantic boundary and before one presentation. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES | T2 |
| AC-ARCH-08 | Portable ADR, rule, skill, workflow, and semantic prompt changes are inspected. | They describe only existing archive operation/postconditions and caller ownership; no repository alias, staging helper, host binary, provider behavior, new adapter protocol, or delivery mechanism appears. | TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES | T1 |
| AC-ARCH-09 | Completion renderer and Common Handoff surfaces are compared before/after. | Bound hashes remain exact; fence keys, renderer output, one-Handoff ownership, and presenter effect-free behavior do not change; archive adds no field, Handoff, or output section. | TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION | T2 |
| AC-ARCH-10 | D14, shipping, Git rules/helpers, copy binary, OMP extension, and pre-existing archive rows are compared. | Every bound hash and archive-manifest row remains exact; no staging, delivery, external, or historical archive effect occurs. | TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION | T2 |
| AC-ARCH-11 | Canonical authority, plan rules, storage/transport rules, dev-implementation, plan orchestration, compact guidance, and dev-ask completion normalization are scanned together. | D29 is discoverable; current-session trigger/order/exclusions/failures agree; no caller-owned active-plan terminal fallback remains; nonterminal active-plan execution/continuation references remain valid. | TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES | T1 |
| AC-ARCH-12 | Executor Plan parser and lifecycle tests run unchanged. | Header/status/task/criterion/Completion Summary grammar, parser result schema, `DONE` terminal completeness, and `CLOSED` terminal-without-summary behavior remain exact; no parser or test byte changes. | TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION | T2 |
| AC-ARCH-13 | Registry, six fixtures, scanner, comparator inventory, and semantic harness run from the same final bytes. | JSON parse, six registry/fixture parity checks, observer/comparator/scanner self-tests, pinned keep-check, active scan, and six fresh semantic comparisons pass; only the five existing IDs are rewritten and the one matrix ID is added. | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, TGT-ARCH-COMPARATOR, TGT-ARCH-PRESERVATION | T2 |
| AC-ARCH-14 | T3 receives the exact immutable OUTP-ARCH-T2 target and complete proof generation. | Independent verification reruns every AC-ARCH-01 through AC-ARCH-13 recipe and returns one aggregate `VERIFIED` without repair or unsupported trust. | TGT-ARCH-VERIFICATION | T3 |
| AC-ARCH-15 | T4 receives the unchanged T3-verified target. | One final Standards and Specification pass returns overall `APPROVED` with no blocking correctness, maintainability, lifecycle, portability, fixture-value, or preservation finding. | TGT-ARCH-REVIEW | T4 |
| AC-ARCH-16 | T5 receives the unchanged T4-approved target and terminal assessment envelope. | One portable assessment returns `NO DURABLE LEARNING` or an authorized proof-bound `CURATED` result with one Common Handoff; `BLOCKED` stops before terminal plan bookkeeping or presentation. | TGT-ARCH-LEARNING | T5 |

## Verification / Done criteria

All commands run from `/Users/kim/.dotfiles` with no credential or shipping environment. Semantic case observations use fresh disposable evidence roots outside the repository and the existing `observe_case.py bind` → execute bound request → `seal` → `compare_trace.py` contract; router cases bind `dev-ask/SKILL.md`, backend cases bind `dev-implementation/SKILL.md`, and every receipt binds the final target digest.

- [x] VR-ARCH-01. Prove current-session DONE ordering
  - Criterion: AC-ARCH-01
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare the DONE branch of `B-TERMINAL-PLAN-ARCHIVE-MATRIX` plus `B-COMPACT-PLAN-NO-TAIL`, `B-PLAN-TAIL-OMITTED`, and `B-PLAN-TAIL-PROFILE` against the exact T2 target.
  - Evidence form: Ordered terminal-status, one archive action, active-absent/archive-exact, and presentation events; no output-before-archive token.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-02. Prove archive-only planned Resume from
  - Criterion: AC-ARCH-02
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare `R-COMPLETE` and the three planned backend cases; inspect each exact archive locator/digest event and forbidden active-plan-resume set.
  - Evidence form: Four archive-path locators with matching exact digests and `#completion-summary`; zero active terminal locators.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-03. Prove current-session CLOSED ordering
  - Criterion: AC-ARCH-03
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare the current-session CLOSED branch of `B-TERMINAL-PLAN-ARCHIVE-MATRIX`.
  - Evidence form: `IN_PROGRESS` to `CLOSED`, one exact archive postcondition, one cancellation close after archive, and completed presentation count zero.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-04. Prove already-`CLOSED` preservation
  - Criterion: AC-ARCH-04
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare the already-`CLOSED` branch of `B-TERMINAL-PLAN-ARCHIVE-MATRIX`.
  - Evidence form: Transition, lookup, archive action, sweep, and presentation counts zero with exact path/content identity unchanged.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-05. Prove the complete storage blocker matrix
  - Criterion: AC-ARCH-05
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare all seven blocker events in `B-TERMINAL-PLAN-ARCHIVE-MATRIX`.
  - Evidence form: Seven distinct exact causes; each preserves bytes and records zero overwrite, presentation, cancellation close, semantic continuation, retry, and second Handoff.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-06. Prove planless compact exclusion
  - Criterion: AC-ARCH-06
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare `R-COMPLETE-COMPACT-NO-LEARNING` and the planless control branch in `B-TERMINAL-PLAN-ARCHIVE-MATRIX`.
  - Evidence form: Repository-plan lookups, archive actions/receipts, and synthetic plans all zero; current planless completion events remain present.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-07. Preserve compact and standard profile behavior
  - Criterion: AC-ARCH-07
  - Proof class: worker smoke
  - Scenario / environment / fixture: Freshly observe and compare `B-COMPACT-PLAN-NO-TAIL`, `B-PLAN-TAIL-OMITTED`, and `B-PLAN-TAIL-PROFILE`.
  - Evidence form: Compact has no profile tail; each standard plan consumes verification/review/learning once; all archive after their existing final boundary and before presentation.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES
  - Receiver: T3
- [x] VR-ARCH-08. Enforce portable archive language
  - Criterion: AC-ARCH-08
  - Proof class: worker smoke
  - Scenario / environment / fixture: Inspect every T1 changed paragraph and every changed semantic request against DEC-ARCH-STORAGE/EXCLUSIONS; scan for repository aliases, staging helpers, host commands, provider names, and new adapter/protocol ownership.
  - Evidence form: Exact changed-paragraph inventory with zero prohibited portable terms and no route/adapter/helper addition.
  - Target recheck: TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES
  - Receiver: T2
- [x] VR-ARCH-09. Preserve renderer and Handoff contracts
  - Criterion: AC-ARCH-09
  - Proof class: identity and caller proof
  - Scenario / environment / fixture: Rehash the four renderer/Handoff entries in TGT-ARCH-PRESERVATION; inspect T1/T2 diffs for new fence keys, output sections, Handoff fields, presenter effects, or second Handoff.
  - Evidence form: Four exact bound hashes and zero forbidden schema/ownership deltas.
  - Target recheck: TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION
  - Receiver: T3
- [x] VR-ARCH-10. Preserve D14, delivery, helpers, and archive history
  - Criterion: AC-ARCH-10
  - Proof class: identity and effect proof
  - Scenario / environment / fixture: Rehash every remaining TGT-ARCH-PRESERVATION file and compare the sealed pre-T1 archive manifest immediately before the backend’s non-task terminal archive operation.
  - Evidence form: Every hash and pre-existing archive row exact; no staging/delivery/external effect; current plan archive not yet present during work assurance.
  - Target recheck: TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION
  - Receiver: T3
- [x] VR-ARCH-11. Prove the closed caller cutover
  - Criterion: AC-ARCH-11
  - Proof class: source-bound lifecycle trace
  - Scenario / environment / fixture: Trace D29 through `plan.md`, storage/OMP transport, dev-implementation root/completion/stops, plan orchestration backend order, compact split, and dev-ask normalization. Distinguish terminal fallbacks from valid nonterminal active-plan entry/continuation references.
  - Evidence form: One finite caller map with required current-session `DONE`/`CLOSED`, already-terminal, failure, and planless branches; zero caller-owned active terminal presentation fallback.
  - Target recheck: TGT-ARCH-AUTHORITY, TGT-ARCH-CALLERS, TGT-ARCH-RULES
  - Receiver: T2
- [x] VR-ARCH-12. Preserve Executor Plan v1 grammar and parser behavior
  - Criterion: AC-ARCH-12
  - Proof class: targeted regression suite and identity check
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; validate the active plan with `.config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-08-29-0045_portable-terminal-plan-archive.md`; rehash both protected scripts.
  - Evidence form: Test exit zero; validation schema `executor-plan-validation/v1`, status `valid`, lifecycle `IN_PROGRESS`, terminal_complete false during execution; both script hashes exact.
  - Target recheck: TGT-ARCH-SCANNER, TGT-ARCH-PRESERVATION
  - Receiver: T3
- [x] VR-ARCH-13. Prove semantic registry and scanner closure
  - Criterion: AC-ARCH-13
  - Proof class: permanent semantic fixtures, scanner, and inventory check
  - Scenario / environment / fixture: Parse the registry and six fixture JSON files; run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test`; `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test`; `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`; `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --keep-check --baseline-blob 774bbf8a4901f9c24a596113a2c1ab60e36b12ed --baseline-commit 4032c0f4a2bb49ec3c2a1893283c007efc8cc311 --baseline-sha256 4d1fa42715f8e2520f69a74e22d15cc6efafd47367a3d981b127880621f38546 --current .config/agents/skills/dev-ask/evals/evals.json --repo-root .`; and the disposable one-shot case-map check `PYTHONDONTWRITEBYTECODE=1 python3 -c 'import json,subprocess,sys; p=\".config/agents/skills/dev-ask/evals/evals.json\"; load=lambda x:{c[\"id\"]:c for c in json.loads(x)[\"cases\"]}; base=load(subprocess.check_output([\"git\",\"cat-file\",\"blob\",\"774bbf8a4901f9c24a596113a2c1ab60e36b12ed\"])); current=load(open(p,encoding=\"utf-8\").read()); actual={\"changed_existing_case_ids\":sorted(k for k in base.keys()&current.keys() if base[k]!=current[k]),\"added_ids\":sorted(current.keys()-base.keys()),\"removed_ids\":sorted(base.keys()-current.keys())}; expected={\"changed_existing_case_ids\":[\"B-COMPACT-PLAN-NO-TAIL\",\"B-PLAN-TAIL-OMITTED\",\"B-PLAN-TAIL-PROFILE\",\"R-COMPLETE\",\"R-COMPLETE-COMPACT-NO-LEARNING\"],\"added_ids\":[\"B-TERMINAL-PLAN-ARCHIVE-MATRIX\"],\"removed_ids\":[]}; print(json.dumps(actual,sort_keys=True,separators=(\",\",\":\"))); sys.exit(0 if actual==expected else 1)'`; freshly bind/seal/compare all six cases.
  - Evidence form: Every command exits zero; six parity checks and six fresh `lean-eval-trace/v1` results pass; keep-check exits zero with no keep-case or keep-fixture mismatch; the one-shot case map prints exactly five changed existing IDs (`B-COMPACT-PLAN-NO-TAIL`, `B-PLAN-TAIL-OMITTED`, `B-PLAN-TAIL-PROFILE`, `R-COMPLETE`, `R-COMPLETE-COMPACT-NO-LEARNING`), one added ID (`B-TERMINAL-PLAN-ARCHIVE-MATRIX`), and no removed IDs; scanner reports no stale/missing contract; new case remains one unique permanent matrix.
  - Target recheck: TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, TGT-ARCH-COMPARATOR, TGT-ARCH-PRESERVATION
  - Receiver: T3
- [x] VR-ARCH-14. Independently verify the complete final work target
  - Criterion: AC-ARCH-14
  - Proof class: independent verification
  - Scenario / environment / fixture: T3 rehashes OUTP-ARCH-T2, resolves the complete current recipe generation, reruns VR-ARCH-01 through VR-ARCH-13 with fresh semantic observations and no T2 evidence reuse unless independently accepted exact-identity unaffected evidence qualifies.
  - Evidence form: One complete aggregate `VERIFIED` Handoff naming every criterion, final target manifest digest, fresh/reused disposition, command/case evidence, and zero mutation.
  - Target recheck: TGT-ARCH-VERIFICATION
  - Receiver: T4
- [x] VR-ARCH-15. Review the exact verified target once
  - Criterion: AC-ARCH-15
  - Proof class: final Standards and Specification review
  - Scenario / environment / fixture: T4 reviews the unchanged T3 target, exact Handoff, D29 authority, caller cutover, portable language, failure semantics, permanent-test value, protected hashes, and one-ID comparator exception.
  - Evidence form: Standards `PASS`, Specification `PASS`, overall `APPROVED`, exact target identity unchanged, and no repair or second review.
  - Target recheck: TGT-ARCH-REVIEW
  - Receiver: T5
- [x] VR-ARCH-16. Assess terminal learning once
  - Criterion: AC-ARCH-16
  - Proof class: terminal continual-learning assessment
  - Scenario / environment / fixture: T5 binds the exact T4-approved target, complete affected-artifact manifest, work Handoffs, papercut accounting, and any qualified Learning Candidate under existing `assess` semantics.
  - Evidence form: One Common Handoff with `NO DURABLE LEARNING`, authorized proof-bound `CURATED`, or blocking `BLOCKED`; first two return to backend, while `BLOCKED` prevents terminal plan bookkeeping, archival, and presentation.
  - Target recheck: TGT-ARCH-LEARNING
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-ARCH-T1 | T1 | Exact T1 changed-path manifest, T1 smoke, protected hashes, archive-manifest identity, and final contract target digest | completed, blocked, authority-change-required, transport-unavailable | T2 | One Common Handoff from `dev-handoff`; Methods `none`; exact criteria/evidence/target/effects/risks and one receiver. |
| OUTP-ARCH-T2 | T2 | Exact final work target manifest, six-case receipts/results, scanner/inventory/parser evidence, test disposition, and protected hashes | completed, blocked, authority-change-required, transport-unavailable | T3 | One Common Handoff; Methods `none`; complete AC-ARCH-01 through AC-ARCH-13 accounting and one receiver. |
| OUTP-ARCH-T3 | T3 | Immutable aggregate verification Handoff bound to TGT-ARCH-VERIFICATION | completed, blocked, transport-unavailable | T4 | Existing verifier Common Handoff with aggregate `VERIFIED` or exact blocker; no mutation or repair. |
| OUTP-ARCH-T4 | T4 | One final review Handoff bound to TGT-ARCH-REVIEW | completed, blocked, authority-change-required | T5 | Existing review Common Handoff with Standards, Specification, overall verdict, findings, and one receiver. |
| OUTP-ARCH-T5 | T5 | One terminal learning result and Common Handoff bound to TGT-ARCH-LEARNING | completed, blocked, transport-unavailable | dev-implementation backend | Existing learning Common Handoff with `NO DURABLE LEARNING`, authorized `CURATED`, or `BLOCKED`; no second Handoff. |

On successful OUTP-ARCH-T5, the backend alone performs terminal accounting and the existing non-task archive operation under DEC-ARCH-D29. It appends the final Completion Summary with outcome, material decisions, immutable evidence identities, current residual risk, and exact target-manifest reference; checks every task/criterion and completion record; sets `Status: DONE` and `Completed At` in the same terminal edit; validates those exact bytes; archives them; validates active absence/archive equality; then builds the current completion fence with the archived Completion Summary locator. The presenter receives no task, effect, or Handoff. A successful presentation is terminal and schedules no audit.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-ARCH-DRIFT | dev-implementation backend | Exact old/new path hashes and semantic comparison against AUTH-ARCH-HUMAN | all | Reapproval only if drift changes authority, scope, terminal ordering, storage mechanics, Resume from, preservation, or fixture ownership | Current bytes are exact or an approved material revision is bound. |
| BLK-ARCH-PROTECTED | dev-implementation backend | Exact protected path/clause that would need mutation and smallest proposed authority change | T1, T2 | Always `authority-change-required`; no worker may reinterpret the no-touch set | New explicit human authority names the path, exact permitted delta, and preserved contracts. |
| BLK-ARCH-CALLER | T2 | Scanner evidence for one additional current canonical planned-completion caller and its target identity | T2, T3, T4, T5 | Add only after D02 materiality check; external helpers/adapters are not automatically callers | Canonical ownership is proven and current authority explicitly admits the new mutable target. |
| BLK-ARCH-TRANSPORT | dev-implementation backend | Current profile assessment and exact unavailable/non-equivalent capability | all | No downgrade from full orchestration or independence | Contract-equivalent full/no-downgrade transport is available or human authority changes topology. |
| BLK-ARCH-SEMANTIC | dev-implementation backend | Failed AC/VR, exact target/caller, expected/observed result, and causal task IDs | T1, T2, T3, T4 | Existing two-attempt and one run-wide repair limits; T2 never directly repairs T1 files | Causally owned repair closes the exact criterion and fresh impacted proof passes. |
| BLK-ARCH-STORAGE | dev-implementation backend | Exact terminal source/destination paths, file kinds, digests, parser result, attempted action, and uncertain/failed postcondition | none of T1–T5; post-T5 backend bookkeeping only | No semantic retry, presentation, cancellation close, overwrite, deletion, or inferred success; do not fail or replay T5, consume the run-wide repair token, or reopen learning; terminal status bytes remain evidence | Fresh explicit human storage-resolution authority preserves all existing bytes and supplies changed evidence; recovery is not a task retry. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-ARCH-HANDOFF | Highest semantic authority | AUTH-ARCH-HUMAN and AUTH-ARCH-INVENTORY | `AUTH-ARCH-HUMAN` remains highest except one narrow supersession: `AUTH-ARCH-INVENTORY` wins only for adding `B-TERMINAL-PLAN-ARCHIVE-MATRIX` to `.config/agents/skills/dev-ask/evals/compare_trace.py` `ADDED_IDS`; it cannot change schema, CLI, comparator behavior, `REWRITE_IDS`, keep-check logic, or any other byte. |
| ANC-ARCH-D29 | Durable decision owner | `docs/adr/0002-executor-plans-and-orchestration.md`, D06, D09, and new D29 | Own terminal trigger/order/archive-only Resume from without moving presentation or storage ownership. |
| ANC-ARCH-STORAGE | Reused mechanics | `.config/agents/rules/plan-repo-storage.md`, Identity and paths, Local draft copying, Direct repository editing | Preserve exact byte/safety/conflict behavior; add caller trigger only. |
| ANC-ARCH-CALLERS | Terminal output owners | `dev-implementation/SKILL.md` Completion/Stops; `plan-orchestration.md` Schedule the backend; `dev-ask/SKILL.md` Completion and stops | Enforce archive-before-output for `DONE` and `CLOSED`, while preserving planless and nonterminal active-plan paths. |
| ANC-ARCH-GUARDS | Permanent semantic closure | TGT-ARCH-REGISTRY, TGT-ARCH-FIXTURES, TGT-ARCH-SCANNER, TGT-ARCH-COMPARATOR | Prove six-case parity, complete branch order, scoped stale detection, and one authorized inventory addition. |

Settled assumptions and contingencies:

- ASM-ARCH-BASELINE: AUTH-ARCH-BASE and every bound mutable/protected hash were rechecked during plan authoring. Any execution drift follows BLK-ARCH-DRIFT; no baseline substitution is permitted.
- ASM-ARCH-TRANSITION: Existing plan-root lifecycle bookkeeping can retain the initial validated status and know whether the same run authored terminal bytes without a new field or ledger. If that fact cannot be established, return BLK-ARCH-PROTECTED rather than infer or scan.
- ASM-ARCH-MATRIX: One dedicated matrix case is necessary because existing router/profile cases cannot absorb `CLOSED`, already-terminal, and seven storage failures without losing single-purpose value. AUTH-ARCH-INVENTORY authorizes only its comparator membership.
- ASM-ARCH-SCANNER: A path-scoped scanner check is mandatory so caller fallbacks fail while the protected generic renderer text remains outside lifecycle authority. A global `active` or `archive` ban is invalid.
- ASM-ARCH-ADAPTER: Existing local-draft or direct-repository archive results are sufficient to establish the postcondition; no adapter code or helper change is required. Contrary evidence is BLK-ARCH-PROTECTED.
- ASM-ARCH-TERMINAL: This plan begins nonterminal, so its own successful completion must exercise D29 after OUTP-ARCH-T5. If it is already terminal at execution intake, perform no storage mutation and stop under the already-terminal rule; only fresh explicit human authority may request storage cleanup.

## Completion Summary

- Outcome: `DONE`. Current-session terminal plan transitions now require the existing exact-byte archive postcondition before completion presentation or cancellation-close output; planned `resume_from` is archive-only; already-terminal intake and planless compact remain mutation-free.
- Material decisions: reused existing plan identity, parser, archive publication, no-overwrite, exact-byte, active-removal, and visible-blocker mechanics; kept storage non-authorizing but required for terminal caller output; preserved presenter, Common Handoff, parser, shipping, helper, adapter, and delivery ownership; added only the authorized focused archive matrix membership to comparator inventory.
- Immutable work target: `local://portable-terminal-plan-archive-final-target-manifest.json@sha256:e26cb31e540543e6341609905878da3f84b925dd65f89f548b133312e1f6784a`; canonical target digest `sha256:4f134f4ad1bd81dd7fb57e9c00f820285ed924d7ddfff79e0ba693929849c695`.
- Evidence: T1 `local://portable-terminal-plan-archive-t1-handoff.md@sha256:1dc5ffd431aedf09e08f2c92e00f80c31b821c207e44aad36f4795f0b86f49da`; T2 `local://portable-terminal-plan-archive-t2-handoff.md@sha256:d203a2096b4489f923401f2fcf3e02b3e13da33aeb3feb8ba6e5905658668cd9`; independent verification `local://portable-terminal-plan-archive-t3-verification-handoff.md@sha256:64c9d508baae9f6443e83f782a151b45238b1e516e9736322bb42ce82991a30c` (`VERIFIED`); final review `local://portable-terminal-plan-archive-t4-review-handoff.md@sha256:9cc17452fe191fe18db6ee20772da4a6853f9b2d564f64aa2f6d54f725080121` (`APPROVED`); terminal learning `local://portable-terminal-plan-archive-t5-learning-handoff.md@sha256:13ef97304d1e5a56a030d13c312c01721ca2202aec96c5a13b8944971a1ace2c` (`NO DURABLE LEARNING`).
- Papercut accounting: T1 and T2 each completed one post-Handoff soft look; neither found a qualifying candidate or accessed the ledger.
- Residual risk: none in the verified and approved work target. Any terminal storage conflict or uncertain archive postcondition preserves existing bytes and blocks presentation rather than weakening completion.
- Delivery: shipping was not authorized; no staging, commit, push, review request, release, deploy, or rollout occurred.
