# Implement plan-task shape and post-work capture

**Datetime**: 2026-08-18-1639
**Authority kind**: local-authority
**Mode**: implementation
**Scope**: Portable Executor Plan task shape, method binding, optional human projection of profile-gated tail tasks, runtime tail scheduling, and post-work papercut capture across OMP and Grok
**Summary**: Make every task carry a human Intent and closed Methods value. Let standard and high-consequence plans optionally number their existing verification, review, and learning suffix for humans: consume it once when present, or let the backend schedule the same profile tail once when omitted. Keep compact work and papercut capture outside that tail, and layer policy, parser, runtime, and semantic proof onto the completed worth-frame work as one clean high-consequence cutover without changing the live papercut ledger, the completed 1815 archive, or any other historical archive.
**Status**: DONE
**Completed At**: 2026-08-19-2049

## Objective

- Outcome: OUT-PLAN-TASK-SHAPE-AND-CAPTURE
- Observable end state: The shared OMP/Grok plan contract, parser, runtime skills, active ADRs, workflow reference, and evals agree on one `T1`-family task model with required `Intent` and `Methods`; standard and high-consequence plans may contain one exact numbered `dev-verification` → `dev-code-review` → `dev-continual-learning` suffix or omit those rows and rely on the backend to schedule the same profile tail once; either shape preserves earlier topology-required verification and integration tasks and produces no duplicate pass; compact work may be planless or use a work-only tail-free Executor Plan; every current papercut candidate remains eligible and the always-applied rule gets one soft look after each work-task Handoff without becoming a task, method, todo phase, route stage, or per-task learning dispatch.
- Progress signal: One owned `AC-*` criterion passes on its exact target, one named blocker is closed with current evidence, or the human authority changes. File count, task count, elapsed time, model calls, and a merely valid parser report are not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-DEC-LOCK | human decision lock | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/78985ba1 | sha256:fdbe997e425afd2028d19bc06c5555befb5f4c7f2dc8510e6829c850497e81ff | human-confirmed 2026-08-18 |
| AUTH-HANDOFF | common Handoff | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/f0e748ad | sha256:3321432d730071dffc2eda63971137dcf9cd5678e374e46a3f186ad12e16d72c | accepted authority transfer 2026-08-18 |
| AUTH-REVIEW-HANDOFF | common Handoff | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/d4e581d9 | sha256:844d17142aa9fafeb4dba299160775390756a72f4e0517100a35c65b2beb918e | accepted round-one plan correction 2026-08-18 |
| AUTH-FINAL-REVISION | human authority change | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/30d0df36 | sha256:000cb71e88f68783a110c05fea137c688d4ec8d3f41201f0d04fc2abe6ba9948 | user-approved optional-tail override 2026-08-18 |
| AUTH-REBASE-HANDOFF | common Handoff | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/1f3193c2 | sha256:bc846853c92508d1bc371adbeb6c5890a32f09197bcca7a2aff591d8a9104aa0 | accepted post-worth-frame rebase 2026-08-19 |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-PC-CAPTURE | AUTH-DEC-LOCK@fdbe997e; AUTH-REVIEW-HANDOFF@844d1714 | Preserve candidate-triggered activation throughout current work; after each work-task Handoff take one soft look through the always-applied rule and capture at most one current candidate if present; never dispatch continual learning per task. |
| DEC-PC-NOT-STAGE | AUTH-DEC-LOCK@fdbe997e | Papercut remains the always-applied module and is not a task, Methods token, todo phase, or dev route stage. |
| DEC-CL-ONCE | AUTH-DEC-LOCK@fdbe997e | Keep one terminal Standard assessment after the settled reviewed standard or high-consequence outcome; compact never dispatches it. |
| DEC-WORK-SPLIT | AUTH-DEC-LOCK@fdbe997e | Use vertical work leaves that fit one fresh worker session; split oversized leaves without splitting coupled work. |
| DEC-TAIL-PROFILE | AUTH-DEC-LOCK@fdbe997e; AUTH-FINAL-REVISION@000cb71e | Standard and high-consequence plans may optionally number the existing verification, review, and continual-learning suffix for human readability; absence is valid and leaves the backend to schedule the same profile tail once; presence consumes it once and adds no proof pass. Compact plans have work tasks only and never number a profile tail. |
| DEC-ONE-OWNER | AUTH-DEC-LOCK@fdbe997e; AUTH-FINAL-REVISION@000cb71e; AUTH-REBASE-HANDOFF@bc846853 | Every authored task has one Owner and one Receiver. With a numbered suffix, the last work task receives into its first task, except that on fan-in the last non-tail D04 boundary receives into it. Without a numbered suffix, the last non-tail task receives into the existing scheduled owner `dev-verification` or `dev-implementation backend`; never invent `T*` rows solely to satisfy a receiver. |
| DEC-INTENT | AUTH-DEC-LOCK@fdbe997e | Every task has one short human `Intent` sentence containing no IDs, paths, or procedure. |
| DEC-METHODS | AUTH-DEC-LOCK@fdbe997e; AUTH-REVIEW-HANDOFF@844d1714 | Every task has `Methods`; work tasks accept `none` or the closed current token `tdd`, tail tasks accept only `none`, readiness requires plan-backed method binding, direct or compact no-plan work still honors an explicit test-first authority selection, and the Handoff carries method evidence. |
| DEC-PONYTAIL | AUTH-DEC-LOCK@fdbe997e | Reserve `ponytail` as a future per-task token but reject it until a separately authorized skill exists; do not turn it into a task or review behavior. |
| DEC-CUTOVER | AUTH-DEC-LOCK@fdbe997e; AUTH-REVIEW-HANDOFF@844d1714 | Change policy, parser, runtime, ADR, workflow, and eval contracts together without compatibility aliases or partial authoring/runtime states; bind every affected projection and current preservation baseline. |
| DEC-ADR-0001-D13-D26 | sha256:0d5d82fef0a305ad51d5dd16775fb1184f83b457925eccad29f834c426c29f5b; AUTH-REVIEW-HANDOFF@844d1714 | Preserve D13's decision text and clean cutover; amend D26 only to clarify that compact still does not require an Executor Plan and any compact plan has no numbered profile tail. |
| DEC-ADR-0002-D08-D09-D21 | sha256:5bd4acf172766983a05013c2743cebe6403f52accd068aa46eabdb77180b962e; AUTH-FINAL-REVISION@000cb71e | Extend the Executor Plan task contract, keep todo projection narrower than route ownership, make a numbered profile suffix an optional human projection rather than a required todo/plan mirror, and keep built-in solution discipline distinct from future `ponytail`. |
| DEC-ADR-0003-D04-D22 | sha256:40bb437cc659ea1b14850c3fefc5b7bb07718237933f774d295f0cf2d590d44a; AUTH-FINAL-REVISION@000cb71e; AUTH-REBASE-HANDOFF@bc846853 | Preserve landed D03 byte-exact. Amend only D04 and D22 so a present numbered final suffix consumes existing assurance and review boundaries while an absent suffix leaves the backend to schedule those boundaries once; earlier D04 lineage verification and neutral integration remain explicit, neither shape creates an extra pass, and only this plan's INDEX projections change. |
| DEC-ADR-0004-D07 | sha256:9d4bc7d4859bca1dbf6ac33ab14bb9e95c33c407f0074d8c311247964ef10605 | Papercut capture is not a continual-learning trigger; one terminal assessment remains profile-gated. |
| DEC-ADR-0007-D24 | sha256:052806a41a605c81461edb5e38e1d504a3b59cc6029f697e4b1d9ad747e13246; AUTH-REVIEW-HANDOFF@844d1714 | Add the post-work-Handoff point as one soft always-rule look while preserving candidate-triggered activation throughout current dev, product, custom, and direct work; create no lifecycle stage. |
| DEC-WF-LAYER-PRESERVE | AUTH-REBASE-HANDOFF@bc846853; `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md`@bdf7a743 | Preserve DEC-WF-01..06, landed D03's five-line frame, Close, 2/2 no-record ask, exact eight-line record, compact exclusion, and existing Handoff fields; layer Intent, Methods, optional numbered-suffix handling, and soft post-work capture without another profile tail. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-DEC-LOCK, AUTH-HANDOFF, AUTH-REVIEW-HANDOFF, AUTH-FINAL-REVISION, AUTH-REBASE-HANDOFF, the completed 1815 archive, the named changed targets, their finite parser/runtime/eval callers, the current papercut helper interface, the current continual-learning and assurance contracts, and the exact preservation targets below.
- Change surfaces: TGT-POLICY-RULES, TGT-POLICY-ADRS, TGT-POLICY-WORKFLOW, TGT-PARSER, TGT-RUNTIME, TGT-METHOD-CAPTURE, and TGT-EVAL only.
- Non-goals: Implementing a `ponytail` skill; requiring all plans to use one visual shape; changing landed D03 worth framing, Close, 2/2, record, or compact-exclusion behavior; changing assurance count, repair budget, review relevance, product behavior, shipping, repository setup, plan transport, papercut storage mechanics, or continual-learning evaluation semantics; making todos mirror route owners; adding a completion task; rewriting `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md` or any other historical plan.
- Prohibited effects: No mutation of `.agents/papercuts.json`; no change to `/Users/kim/.agents/AGENTS.md` or `.config/agents/AGENTS.md`; no edit to `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md` or any pre-existing archived plan; no restoration of the user's two deleted active plan paths; no staging, commit, push, release, deploy, credentials, network account change, product ADR mutation, or external system mutation. Disposable semantic proof must use no-overwrite session-local roots and must never point a write-capable case at the live ledger.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-POLICY | repository-write | AUTH-DEC-LOCK | TGT-POLICY-RULES, TGT-POLICY-ADRS, and TGT-POLICY-WORKFLOW only; reversible before delivery; hardlinked rule copies remain byte-identical. |
| EFF-PARSER | repository-write | AUTH-DEC-LOCK | TGT-PARSER only; preserve one shared v1 parser and extra-field tolerance; reversible before delivery. |
| EFF-RUNTIME | repository-write | AUTH-DEC-LOCK | TGT-RUNTIME only; prose/runtime contract changes, no ledger or external mutation; reversible before delivery. |
| EFF-BEHAVIOR | repository-write | AUTH-DEC-LOCK | TGT-METHOD-CAPTURE and TGT-EVAL only; new fixture files plus bounded contract edits; reversible before delivery. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-AUTHORITY | Exact ten-decision lock, round-one five-finding clarification, final optional-tail override, post-worth-frame rebase, rejected alternatives, exclusions, and one clean-cutover boundary | T1 | PLAN-TASK-SHAPE-20260818-r1 | T1, T2, T3, T4, T5, T6, T7 |
| CONTRACT-PLAN-SHAPE | One `T*` family; one-session vertical work leaves; required Intent and Methods; optional exact standard/high-consequence human suffix; optional compact work-only plan or direct no-plan contract; plan tasks distinct from todo phases | T1 | PLAN-TASK-SHAPE-20260818-r1 | T2, T3, T4, T5, T6, T7 |
| CONTRACT-PARSER | `executor-plan-validation/v1` and `executor-plan-preflight/v1` remain the sole OMP/Grok structural seam; required fields use stable issue codes; a missing standard/high-consequence suffix is valid, a present suffix is validated exactly, compact tails are invalid, and topology-required verification/integration tasks remain legal | T2 | EXECUTOR-PLAN-V1-TASK-SHAPE-20260818-r1 | T3, T4, T5, T6, T7 |
| CONTRACT-RUNTIME | Exact Task Contract projection, method ready-gate, each tasked D04 verification boundary, numbered-suffix consumption or omitted-suffix scheduling exactly once, method evidence in the existing Common Handoff, and byte-preservation of landed D03 worth/Close/record semantics | T3 | DEV-IMPLEMENTATION-TASK-SHAPE-20260818-r1 | T4, T5, T6, T7 |
| CONTRACT-CAPTURE | Candidate-triggered papercut activation remains available throughout current work; the backend also takes one soft always-rule look after every work-task Handoff; no candidate remains silent, and capture never schedules learning or changes task state | T3 | POST-WORK-CAPTURE-20260818-r1 | T4, T5, T6, T7 |
| CONTRACT-EVAL | Cross-context numbered-tail, omitted-tail, fan-in, compact-plan, method, and complete-fixture cases; unchanged landed 1815 worth-frame cases and scanner needles; papercut activation cases; stale-contract scan; three hardlink pairs; exact current source bases; and the historical commit-bound keep-check baseline | T4 | TASK-SHAPE-EVAL-20260818-r1 | T5, T6, T7 |
| CONTRACT-VERIFY | Fresh independent proof over the unchanged final manifest and complete applicable-rule manifest; no repair or reuse of worker conclusions | T5 | TASK-SHAPE-VERIFY-20260818-r1 | T6, T7 |
| CONTRACT-REVIEW | One eligible final review task over the exact verified target; existing blocker relevance and bounded repair/rerun semantics remain unchanged | T6 | TASK-SHAPE-REVIEW-20260818-r1 | T7 |
| CONTRACT-LEARN | One terminal Standard assessment of the settled reviewed outcome; assessment-only here because no bound mutating Learning Candidate is authorized | T7 | TASK-SHAPE-LEARN-20260818-r1 | none |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-POLICY-RULES | `.config/agents/rules/plan.md` plus `.grok/rules/plan.md`; `.config/agents/rules/plan-impl-spec.md` plus `.grok/rules/plan-impl-spec.md` | T1 | plan copies: device 16777229 inode 253705992 sha256:5a8c9363f5a8b08037197af4a52bbccddafaa80864504adb62ca088b6e933e12; impl-spec copies: device 16777229 inode 252495992 sha256:85dd72c84a50dd5837ab3f2260676c37fff9010f585155662805d09b7fcba9bc | Planner publication, planner/backend parser, OMP and Grok transports, complete fixture | AC-POLICY-SHAPE |
| TGT-POLICY-ADRS | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `0002-executor-plans-and-orchestration.md`; `0003-bounded-assurance-and-repair.md`; `0004-canonical-discovery-and-continual-learning.md`; `0007-automated-papercut-lifecycle-and-lean-evidence.md`; `docs/adr/INDEX.md` | T1 | sha256 respectively: 0d5d82fef0a305ad51d5dd16775fb1184f83b457925eccad29f834c426c29f5b; 5bd4acf172766983a05013c2743cebe6403f52accd068aa46eabdb77180b962e; 40bb437cc659ea1b14850c3fefc5b7bb07718237933f774d295f0cf2d590d44a; 9d4bc7d4859bca1dbf6ac33ab14bb9e95c33c407f0074d8c311247964ef10605; 052806a41a605c81461edb5e38e1d504a3b59cc6029f697e4b1d9ad747e13246; d039f7b1bdb5848afcb19fffb2312ec6ced865809f8d444012d1b00c94f49dee | Active decision discovery, WORKFLOW authority map, plan/runtime skills, stale scanner, and protected landed D03 projection | AC-POLICY-SYNC |
| TGT-POLICY-WORKFLOW | `.config/agents/skills/dev-ask/WORKFLOW.md` | T1 | sha256:5230a9ecd7f583065e2d91a9b1feeb9900e167c988314e9508d35e0edd2a5605 | Human overview, plan/todo projection, route tail, landed worth-frame/Close flow, maintenance, and eval discovery | AC-POLICY-SYNC |
| TGT-PARSER | `.config/agents/skills/dev-implementation/scripts/executor_plan.py`; `test_executor_plan.py`; `fixtures/executor_plan/complete.md`; new `fixtures/executor_plan/fan_in.md` | T2 | sha256 respectively: 53b3446d073f6b27c4d60dca007e30e7260e8b287bd69083fb7d0dba4937c8d3; 87108bbf3313e07c9f9767442b091e884c5b2c9e72f2189c6db6ac92a69d2348; e6cce4f34fbc8e7dd3184091897be24f8ada5341062553955af74b142318a69b; new fan-in fixture absent | Both semantic contexts, planner/backend consumers, transport preflight, numbered and omitted-tail parser matrices, parser unit suite, `B-T4-FANIN-VERIFIED`, `B-T5-EXECUTOR-PLAN-OMP`, and `B-T5-EXECUTOR-PLAN-GROK` | AC-PARSER-FIELDS, AC-PARSER-TAIL |
| TGT-RUNTIME | `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/references/compact-checklist.md`; `.config/agents/skills/dev-handoff/SKILL.md` | T3 | sha256 respectively: 190653ebfa28db99a083ee360788abd825d2f70cd1eec97b54051b5d6d00c586; 76ed562d2b8d34ab77877b6b9e213793d70f04a29c9f7027728e002efe1a8990; 4975e448342f8ec90e93fa8efa4c3cb3c200ff28a61edc5fe7042df6c41d68b5 | Task Contract, ready transition, route-to-task projection, tail scheduling, landed worth-frame/Close and eight-line-record flow, Common Handoff, compact direct route | AC-RUNTIME-METHODS, AC-RUNTIME-TAIL |
| TGT-METHOD-CAPTURE | `.config/agents/skills/dev-tdd/SKILL.md`; `.config/agents/rules/papercut.md` plus `.grok/rules/papercut.md`; `.config/agents/skills/papercut/SKILL.md`; `.config/agents/skills/papercut/WORKFLOW.md`; `.config/agents/skills/papercut/evals/evals.json` | T4 | dev-tdd sha256:305fd437c45be3c9a917069ae42a02fc1e128f76e9474951c17d5d9d369df516; papercut rule copies: device 16777229 inode 252633712 sha256:272b302f560178c560ccb014b31d860fc2d3386e71d9c504671ec7140f89dd4a; papercut skill sha256:864385d73605107cc0a37b71d4639537c4d41e177874726d0ef3bb6c1bb9e311; WORKFLOW sha256:e7123d22ab5e96c3d124f823524b49323c8fc8f00eb4935c67dcc2cf92009626; evals sha256:46367562a028441fb207580c5e81043f35374d06d10744fe4f7b3cd508c37774 | Plan-backed and explicit direct TDD binding, candidate-triggered activation, soft post-Handoff look, current-flow maintenance reference, `P-POST-WORK-HANDOFF`, `P-CROSS-WORKFLOW`, and `P-NO-CANDIDATE` | AC-EVAL-BEHAVIOR |
| TGT-EVAL | `.config/agents/skills/dev-ask/evals/evals.json`; `scan_stale_contracts.py`; `compare_trace.py`; existing `fixtures/b-t4-repair-remaining-blocker/case.json`; `fixtures/b-t4-checkpoint-proof-close/case.json`; `fixtures/b-t4-revision-worth-opinion/case.json`; `fixtures/b-t4-compact-worth-not-triggered/case.json`; new `fixtures/b-plan-tail-profile/case.json`; new `fixtures/b-plan-tail-omitted/case.json`; new `fixtures/b-compact-plan-no-tail/case.json`; new `fixtures/r-compact-plan-with-tail/case.json`; new `fixtures/b-task-method-tdd/case.json` | T4 | current sha256 respectively: 1ac4b89b68828029fcc32661e2399082b67352ba5ef7a65af4e496844ff4c045; 2c55f39e67f7831a2fb1eb727f7e48750be506a00c74d124db763153d45a4ad5; 58a1caf2b00d2086cb2da75d762c6085df9829ece0461f5bd00e1dde77896b9a; landed fixture sha256 respectively: 7c0fa2aaf16c1ec24c9f11d8845c32921feb258e97cf0d6475f77b758d483a70; 1fec312f1bacf2f6e83c22eacb87c741e5f11186d6397fa53665521a65653245; 8db03771415d3011e150cf5f5cdd15da25a2cef08fee5e711367e81298f1599c; 0a213129e800602d50867f58ace844aa911268cc4da8388a3d5ee13248e5b4bc; new fixture paths absent; historical keep-check base commit 479dce6de60cde01c8c87627241618765ef05454, blob 3a2053bb1f03e7b32a77895b8fe8748189cda170, sha256 bd5a27fe1b676f69731b7bb5eb931388725f3293a9ebc9db37d9f4bc3db086ba | Receipt-bound comparator; stale scanner; preserved worth-frame cases; numbered-tail and omitted-tail positive cases; fan-in, compact-plan positive/negative, TDD, complete-fixture OMP/Grok, and compact keep cases | AC-EVAL-BEHAVIOR, AC-CUTOVER-PRESERVE |
| TGT-PRESERVE | `/Users/kim/.agents/AGENTS.md`; `.config/agents/AGENTS.md`; `.config/agents/skills/dev-ask/SKILL.md`; `.agents/papercuts.json`; `.config/agents/skills/papercut/scripts/papercut_ledger.py`; `.config/agents/skills/dev-continual-learning/SKILL.md`; `docs/adr/0005-product-development-workflow-and-prd-authority.md`; `docs/adr/0008-repository-agent-integration-setup.md`; `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md`; every other pre-existing archived plan; absent active `.agents/plans/2026-08-18-1815_checkpoint-worth-frame.md`; absent `.config/agents/skills/ponytail` and `.grok/skills/ponytail`; user-deleted active plans `2026-08-14-1038_repo-agent-memory-canonical-artifact-integration.md` and `2026-08-14-1528_repo-agent-memory-hybrid-rewrite.md` | T4 | AGENTS copies sha256:1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9; dev-ask skill sha256:ea9917411c115241b91edea9ce5821da3177a01390b897d79ac8ebd06062ef0c; ledger sha256:c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44; helper sha256:2c1d15522362d2aebcb1de58635dc8fa61454ebe6567d61f820f2b552f97e431; continual-learning sha256:6a6ccfae27da7ac20412029757ed05d16b9ba63d43bd50e6f4331565cb54d105; ADR-0005 sha256:5c4978ccb225ea04a65dde02742c1b39c2366ef27ca848d73ee1a70a1624a9ff; ADR-0008 sha256:e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3; completed 1815 archive sha256:bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755; 27-entry historical archive manifest sha256:59df34c41cd6d7a74f53e3908f2397942a46467de70c0fe9249dfe0752f67fd7; reserved skill, deleted plan paths, and active 1815 path absent | Preservation scanner, applicable-rule manifest, automatic plan projection, and completed-plan archival boundary | AC-CUTOVER-PRESERVE |
| TGT-FINAL | Sorted changed-path and SHA-256 manifest embedded in OUTP-T4, excluding this mutable plan authority/projection and disposable observation roots | T4 | absent until T4 seals all work-task smoke | T5 independent proof, T6 review, T7 assessment, backend completion accounting | AC-CUTOVER-PRESERVE |
| TGT-VERIFY-EVIDENCE | Fresh verifier Common Handoff with aggregate verdict, pre/post target digest equality, complete rule manifest, and independent observation receipts | T5 | absent | T6 review and backend accounting | AC-INDEPENDENT-VERIFY |
| TGT-REVIEW-EVIDENCE | One final read-only Review Handoff bound to TGT-FINAL and TGT-VERIFY-EVIDENCE | T6 | absent | T7 assessment and backend accounting | AC-FINAL-REVIEW |
| TGT-LEARN-EVIDENCE | One assessment-only Standard continual-learning Handoff bound to the settled reviewed target | T7 | absent | dev-implementation backend and dev-ask completion presentation | AC-TERMINAL-LEARNING |

## Execution policy

- Assurance: high-consequence
- Topology: sequential-specialized-owners
- Max concurrency: 1
- Isolation: shared working lineage with a fresh owner context for every task; T5 through T7 are read-only against one immutable final target
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: Execute one task at a time in dependency order. No later owner reads a partial predecessor result; T1 through T4 may write only their disjoint named targets, and each rechecks current bytes before mutation.
- Decomposition: This plan deliberately uses exactly four work leaves followed by its allowed numbered verification, review, and continual-learning suffix. That choice is not a policy requirement for other standard/high-consequence plans. No child semantic delegation, nested planner, extra papercut task, extra assurance task, or completion task. If a work leaf cannot fit one fresh worker context without splitting a coupled contract, return authority-change-required before mutation.
- Effect limit: EFF-POLICY, EFF-PARSER, EFF-RUNTIME, and EFF-BEHAVIOR only; T5 through T7 have no repository, ledger, delivery, or external effect.
- Orchestrator profile: Full orchestration is not required. The capable parent retains authority, dependency, and completion accounting while dispatching the approved sequential specialized-owner projection; missing fresh-owner or independent-role capability is transport-unavailable, not permission to self-combine roles.

## Tasks

- [x] T1. Synchronize policy and decision contracts
  completed 2026-08-19-1131
  - Owner: policy-worker
  - Intent: Make planned work and its profile-gated tail unambiguous.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-POLICY-RULES, TGT-POLICY-ADRS, TGT-POLICY-WORKFLOW
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE
  - Criteria: AC-POLICY-SHAPE, AC-POLICY-SYNC
  - Effects: EFF-POLICY
  - Output: OUTP-T1
  - Receiver: T2
  - Verification: VR-POLICY-SHAPE, VR-POLICY-SYNC
  - Lineage: shared
  - Execution notes: Preserve D13's decision text and use it as the clean-cutover boundary. Keep the existing `plan.md` warning not to number verification, review, or learning merely to hit the 150k heuristic, and state that a standard/high-consequence numbered suffix is optional human projection: it consumes the existing backend tail when present, while absence leaves backend scheduling unchanged. Within ADR-0003 leave D03 byte-exact and amend only D04 and D22; update only this plan's INDEX projections. Preserve the landed five-line worth frame, Close, 2/2 no-record ask, exact eight-line record, compact exclusion, and current WORKFLOW checkpoint paragraphs. In other ADRs keep the optional-tail edits to scoped D09 and D26: preserve every D04 lineage/fan-in boundary, preserve one review, keep todos from mirroring route owners, and ensure compact never numbers a tail. Keep D08/D21 edits limited to required Intent/Methods and rejected `ponytail`; keep D07/D24 edits limited to the unchanged soft papercut contract. Update both shared plan rules and layer concise task-shape clauses into current WORKFLOW text without dropping landed worth-frame or Close behavior. Do not edit or approve the completed 1815 archive.
- [x] T2. Enforce task shape in the shared parser
  completed 2026-08-19-1146
  - Owner: parser-worker
  - Intent: Reject plans whose task shape or methods are not executable.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-PARSER
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER
  - Criteria: AC-PARSER-FIELDS, AC-PARSER-TAIL
  - Effects: EFF-PARSER
  - Output: OUTP-T2
  - Receiver: T3
  - Verification: VR-PARSER-FIELDS, VR-PARSER-TAIL
  - Lineage: shared
  - Execution notes: Add Intent and Methods to TASK_FIELDS while preserving unknown extra-field tolerance. Accept exact `none` or a unique inline closed token list whose only current non-none member is `tdd`; reject empty, duplicates, `none` mixed with another token, `ponytail`, unknown, and case variants with `TASK_METHODS_INVALID`. Accept compact, standard, and high-consequence Executor Plans. Compact is valid only with work tasks, locked Methods, and no tail owner; compact plus any tail owner or the last three returns `TASK_TAIL_INVALID`. A standard/high-consequence plan with no final numbered suffix is valid and must not emit `TASK_TAIL_INVALID`; its last non-tail task has exactly one Receiver naming `dev-verification` or `dev-implementation backend`, not an invented task. If a numbered suffix is present, require the exact final owners, order, `Methods: none`, dependencies, preceding-non-tail receiver, and internal receiver chain; any partial, wrong, or broken attempted suffix returns `TASK_TAIL_INVALID`. Unsupported Assurance returns `ASSURANCE_PROFILE_INVALID`. Identify only the final suffix as the optional human tail so earlier topology-declared `dev-verification` and `dev-integration` tasks remain legal. Update `complete.md` as a numbered example rather than the sole legal shape, retain a parser-valid standard fan-in fixture, and prove both contexts and consumers for numbered, omitted, fan-in, and compact matrices.
- [x] T3. Bind method and tail runtime semantics
  completed 2026-08-19-1214
  - Owner: runtime-worker
  - Intent: Execute each task with its declared method and no duplicate lifecycle work.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-RUNTIME
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER, CONTRACT-RUNTIME, CONTRACT-CAPTURE
  - Criteria: AC-RUNTIME-METHODS, AC-RUNTIME-TAIL
  - Effects: EFF-RUNTIME
  - Output: OUTP-T3
  - Receiver: T4
  - Verification: VR-RUNTIME-METHODS, VR-RUNTIME-TAIL
  - Lineage: shared
  - Execution notes: Layer Intent and Methods onto the existing Task Contract, runtime checkpoint, and Common Handoff contracts without replacing any landed worth-frame, Close, 2/2 no-record, eight-line-record, blocked-return, or same-plan-resume field. Project Intent and Methods unchanged into every plan-backed Task Contract and append their evidence to the existing Common Handoff intake/body/result. Bind `tdd` to `dev-tdd` before a plan-backed work task can become ready; `none` loads no method; authored tail tasks require none. For direct or compact work with no plan, derive the human Intent and bind `dev-tdd` whenever current explicit user or approved authority selects test-first; otherwise bind explicit none. Consume every tasked verification at its D04 boundary. When an exact numbered profile suffix exists, consume its verification, review, and learning rows once and do not schedule duplicates; when it is absent, use the final non-tail Receiver and schedule the current profile verification, review, and learning owners once. Preserve earlier lineage verification and integration in both shapes and never schedule a second profile tail. Candidate-triggered papercut activation remains available throughout current work; after each work-task Handoff take one soft always-rule look, and route any candidate without changing task state or dispatching learning. This plan's no-ledger authority makes every capture result report-only.
- [x] T4. Align capture and semantic eval contracts
  completed 2026-08-19-1413
  - Owner: behavior-worker
  - Intent: Keep post-work friction capture separate from assurance and learning.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-METHOD-CAPTURE, TGT-EVAL, TGT-PRESERVE, TGT-FINAL
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER, CONTRACT-RUNTIME, CONTRACT-CAPTURE, CONTRACT-EVAL
  - Criteria: AC-EVAL-BEHAVIOR, AC-CUTOVER-PRESERVE
  - Effects: EFF-BEHAVIOR
  - Output: OUTP-T4
  - Receiver: T5
  - Verification: VR-EVAL-BEHAVIOR, VR-CUTOVER-PRESERVE
  - Lineage: shared
  - Execution notes: On an Executor Plan and its Task Contract, bind `dev-tdd` from `Methods: tdd` before ready and load no method for `none`; preserve the live explicit user/authority test-first trigger for compact or direct work with no plan, and reject `ponytail`. In the papercut rule, skill, and maintenance WORKFLOW, preserve candidate-triggered activation in dev, product, custom, and direct work and add one soft application of the always-applied rule after every work-task Handoff; create `P-POST-WORK-HANDOFF` and keep `P-CROSS-WORKFLOW` plus `P-NO-CANDIDATE`. Preserve the landed worth-frame registry objects, fixture bytes, and scanner needles for `B-T4-REPAIR-REMAINING-BLOCKER`, `B-T4-CHECKPOINT-PROOF-CLOSE`, `B-T4-REVISION-WORTH-OPINION`, and `B-T4-COMPACT-WORTH-NOT-TRIGGERED`. Add `B-PLAN-TAIL-PROFILE` for numbered consumption, `B-PLAN-TAIL-OMITTED` for work-only standard/high-consequence parsing plus backend scheduling, `B-COMPACT-PLAN-NO-TAIL`, `R-COMPACT-PLAN-WITH-TAIL`, and `B-TASK-METHOD-TDD`; rewrite only this plan's `B-COMPACT`, `B-COMPACT-CURATION-TRIGGER`, and `R-COMPLETE-COMPACT-NO-LEARNING`; rerun unchanged live consumers `B-T4-FANIN-VERIFIED`, `B-T5-EXECUTOR-PLAN-OMP`, and `B-T5-EXECUTOR-PLAN-GROK` against the revised complete and fan-in fixture bytes. Keep the historical keep-check base and declare the four landed 1815 IDs plus only this plan's five additions and three rewrites. In scanner `PRESERVED`, retain every landed worth-frame needle, remove ADR-0007 and the changed papercut rule, skill, WORKFLOW, and eval registry, retain the helper, and bind the live ledger to sha256:c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44 without writing it. Preserve `.config/agents/skills/dev-ask/SKILL.md`, edit the papercut rule inode once, verify its `.config` and `.grok` paths remain byte-identical, never edit the completed 1815 archive, and seal TGT-FINAL only after all smoke passes.
- [x] T5. Independently verify the immutable cutover
  completed 2026-08-19-1617
  - Owner: dev-verification
  - Intent: Prove the complete cutover independently on one immutable target.
  - Methods: none
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-FINAL, TGT-PRESERVE, TGT-VERIFY-EVIDENCE
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER, CONTRACT-RUNTIME, CONTRACT-CAPTURE, CONTRACT-EVAL, CONTRACT-VERIFY
  - Criteria: AC-INDEPENDENT-VERIFY
  - Effects: none
  - Output: OUTP-T5
  - Receiver: T6
  - Verification: VR-INDEPENDENT-VERIFY
  - Lineage: shared
  - Execution notes: Use a fresh read-only verifier and fresh no-overwrite observation roots. Rebuild every structural and semantic result without reading T4 observation outputs, prove the complete applicable-rule manifest, and hash TGT-FINAL before and after. Return NOT VERIFIED with exact criteria for any omission or drift; never repair.
- [x] T6. Review the verified cutover once
  completed 2026-08-19-2038
  - Owner: dev-code-review
  - Intent: Identify any outcome-relevant defect remaining in the verified target.
  - Methods: none
  - Wave: W5
  - Depends on: T5
  - Targets: TGT-FINAL, TGT-VERIFY-EVIDENCE, TGT-REVIEW-EVIDENCE
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER, CONTRACT-RUNTIME, CONTRACT-CAPTURE, CONTRACT-EVAL, CONTRACT-VERIFY, CONTRACT-REVIEW
  - Criteria: AC-FINAL-REVIEW
  - Effects: none
  - Output: OUTP-T6
  - Receiver: T7
  - Verification: VR-FINAL-REVIEW
  - Lineage: shared
  - Execution notes: Run one read-only Standards and Specification review task on the exact VERIFIED target. Numbering consumes the existing review boundary and adds no second pass. If direct evidence establishes an eligible blocker, return it to the backend under unchanged ADR-0003 repair and rerun semantics; do not mutate or dispatch maintenance.
- [x] T7. Run the terminal Standard learning assessment
  completed 2026-08-19-2048
  - Owner: dev-continual-learning
  - Intent: Assess whether this settled workflow change warrants durable learning.
  - Methods: none
  - Wave: W6
  - Depends on: T6
  - Targets: TGT-FINAL, TGT-REVIEW-EVIDENCE, TGT-LEARN-EVIDENCE
  - Contracts: CONTRACT-AUTHORITY, CONTRACT-PLAN-SHAPE, CONTRACT-PARSER, CONTRACT-RUNTIME, CONTRACT-CAPTURE, CONTRACT-EVAL, CONTRACT-VERIFY, CONTRACT-REVIEW, CONTRACT-LEARN
  - Criteria: AC-TERMINAL-LEARNING
  - Effects: none
  - Output: OUTP-T7
  - Receiver: dev-implementation backend
  - Verification: VR-TERMINAL-LEARNING
  - Lineage: shared
  - Execution notes: Run exactly one terminal Standard assessment after the reviewed outcome settles. No bound mutating Learning Candidate exists in this plan, so report `NO DURABLE LEARNING` or an exact blocker/deferred candidate without guidance mutation. Do not treat any post-work papercut capture as another assessment trigger.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-POLICY-SHAPE | A fresh planner authors a numbered or unnumbered standard/high-consequence plan, a compact plan, or a direct compact Task Contract | Every authored plan task is `T*`, has one Owner, one Receiver, one-sentence Intent, and Methods; work leaves fit fresh sessions. Standard/high-consequence may contain one exact numbered profile suffix or omit it and name the existing backend-scheduled receiver; neither shape changes proof count. Compact work does not require a plan, and any compact plan contains work only and no numbered tail. Plans need not look identical, and todo phases remain a non-authoritative projection rather than an owner mirror. | TGT-POLICY-RULES | T1 |
| AC-POLICY-SYNC | The active decisions and current workflow are read together | Landed D03 worth framing, Close, 2/2 no-record asks, exact eight-line record, and compact exclusion remain byte-exact; D13, D26, D08, scoped D09, D21, D04, D22, D07, D24, this plan's INDEX rows, and WORKFLOW express the same required task fields, optional standard/high-consequence suffix, compact no-tail, method, soft capture, and no-duplicate-pass boundaries; the 150k guidance never creates lifecycle rows. | TGT-POLICY-ADRS, TGT-POLICY-WORKFLOW | T1 |
| AC-PARSER-FIELDS | Complete and mutated Executor Plan fixtures are validated by both consumers in OMP and Grok contexts | Complete bytes with nonempty Intent and valid Methods pass identically; missing or empty fields return `TASK_FIELD_MISSING`; invalid lists, `ponytail`, unknown tokens, duplicates, mixed none, and case variants return `TASK_METHODS_INVALID`; unrelated extra fields remain accepted. | TGT-PARSER | T2 |
| AC-PARSER-TAIL | Assurance profile, topology, optional task suffix, and final Receiver are valid or malformed | Standard/high-consequence with no numbered last-three passes and emits no missing-tail issue; if the suffix is present, only the exact final owners, order, dependencies, receivers, and `Methods: none` pass. The first numbered task receives from the preceding non-tail task; an unnumbered plan's final non-tail Receiver is `dev-verification` or `dev-implementation backend`; earlier D04 verification and integration remain legal. Partial, wrong, or broken attempted suffixes and any compact tail owner return `TASK_TAIL_INVALID`; unsupported profiles return `ASSURANCE_PROFILE_INVALID`. | TGT-PARSER | T2 |
| AC-RUNTIME-METHODS | A plan-backed work task declares none or tdd, a tail task declares none, or explicit authority selects test-first for direct no-plan work | The backend copies plan-backed Intent and Methods unchanged, binds tdd to `dev-tdd` before ready, loads no method for none, refuses an unavailable binding without consuming an attempt, admits no method on authored tail tasks, preserves explicit user/authority TDD selection without a plan, and every Common Handoff carries the selected value and exact method evidence. | TGT-RUNTIME | T3 |
| AC-RUNTIME-TAIL | Numbered and unnumbered sequential/fan-in standard/high-consequence plans, a compact plan, and direct compact work execute | With an exact numbered suffix, the backend consumes those rows once; without one, it schedules the current profile verification, review, and learning owners once. It never does both, preserves each D04 topology boundary, and lets compact execute work and smoke with no tail. Existing D03 worth-frame, Close, 2/2 no-record, eight-line-record, and Common Handoff recovery behavior remains intact. Candidate-triggered papercut activation remains available in current work; after each work Handoff the always rule gets one soft look, capture changes no task state and dispatches no per-task learning, and no-candidate work has no papercut access or output. | TGT-RUNTIME | T3 |
| AC-EVAL-BEHAVIOR | The focused numbered-tail, omitted-tail, fan-in, TDD, compact-plan, complete-fixture, landed worth-frame, and papercut positive and near-miss cases run in supported semantic contexts | Receipt-bound cases prove numbered suffix consumption once, omitted suffix parser validity plus backend scheduling once, no flattening of D04 boundaries, valid compact work-only plans, invalid compact tails, plan-backed and explicit direct method binding, revised `complete.md` acceptance by both B-T5 consumers, soft post-work-Handoff capture order, current-work cross-flow activation, no capture-as-stage/method/task, no per-task learning, and no-candidate silence while all four landed worth-frame cases remain unchanged and passing. | TGT-METHOD-CAPTURE, TGT-EVAL | T4 |
| AC-CUTOVER-PRESERVE | The whole work target is sealed after smoke | The stale scanner has no old task-shape clause, all new required clauses, and every landed worth-frame needle; changed ADR-0007 and papercut contracts are not frozen; the live ledger is rebound but unchanged; all three rule hardlink pairs remain byte-identical; keep-check uses the historical pinned registry baseline and permits exactly the four landed 1815 mutations plus this plan's declared IDs; all changed paths appear once in TGT-FINAL; AGENTS copies, dev-ask and continual-learning skills, helper, product/setup ADRs, completed 1815 archive at bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755, all 27 historical archive entries, absent active 1815 path, absent reserved skill, and user-deleted active plans receive no effect from this plan; no staging or shipping effect exists. | TGT-EVAL, TGT-PRESERVE, TGT-FINAL | T4 |
| AC-INDEPENDENT-VERIFY | A fresh verifier receives OUTP-T4 and the complete current rule manifest | Every AC-POLICY through AC-CUTOVER claim is reproved from source with independent OMP/Grok observations and parser runs; TGT-FINAL is unchanged before and after; aggregate verdict is VERIFIED or exact NOT VERIFIED with no mutation. | TGT-VERIFY-EVIDENCE | T5 |
| AC-FINAL-REVIEW | One eligible reviewer receives the unchanged VERIFIED target | Review covers correctness, security, performance, maintainability, locked specification, consumer closure, and no-effect evidence; it returns approved, exact eligible blockers, authority conflict, or terminal advisories without editing or creating another review task. | TGT-REVIEW-EVIDENCE | T6 |
| AC-TERMINAL-LEARNING | The standard/high-consequence target has a settled review result | Exactly one Standard assessment returns a complete terminal Handoff, preserves TGT-FINAL, performs no guidance or ledger mutation, and does not recursively assess post-work capture. | TGT-LEARN-EVIDENCE | T7 |

## Verification / Done criteria

- [x] VR-POLICY-SHAPE. Validate the authored task and profile contract
  - Criterion: AC-POLICY-SHAPE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Read the amended `plan.md` sizing clause and complete `plan-impl-spec.md` task contract as one finite matrix against a numbered standard plan, an unnumbered work-only high-consequence plan, a high-consequence fan-in plan, a compact work-only plan, and a direct compact Task Contract; run this local plan through `executor_plan.py` with `--context omp --consumer planner` and `--context grok --consumer planner`.
  - Evidence form: Both planner reports are `executor-plan-validation/v1` valid with one identical plan SHA-256; the clause matrix records exact optional-suffix, topology-aware receiver, optional compact-plan, direct compact, 150k-guidance, and no-extra-lifecycle-task outcomes.
  - Target recheck: TGT-POLICY-RULES
  - Receiver: T2
- [x] VR-POLICY-SYNC. Prove active policy and rationale agree
  - Criterion: AC-POLICY-SYNC
  - Proof class: worker smoke
  - Scenario / environment / fixture: Compare only the amended decision units, this plan's INDEX rows, and layered WORKFLOW statements against all ten rows and rejected alternatives in AUTH-DEC-LOCK plus AUTH-REBASE-HANDOFF; byte-compare the landed D03 decision unit and recheck its five-line frame, Close, 2/2 no-record ask, exact eight-line record, and compact exclusion.
  - Evidence form: A closed ten-row mapping plus worth-layer preservation receipt names each exact target clause, proves D03 unchanged, preserves every D04 and D22 proof count, and identifies no contradictory active statement.
  - Target recheck: TGT-POLICY-ADRS, TGT-POLICY-WORKFLOW
  - Receiver: T2
- [x] VR-PARSER-FIELDS. Exercise required Intent and closed Methods grammar
  - Criterion: AC-PARSER-FIELDS
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`; validate numbered `complete.md`, fan-in, and standard/high-consequence work-only variants for both contexts and consumers, plus mutations for missing, empty, valid none, valid tdd, ponytail, unknown, duplicate, mixed-none, case-variant, and unrelated extra field.
  - Evidence form: Unit suite exits 0; positive numbered, omitted-tail, and fan-in reports share their exact expected digests across contexts/consumers; each negative returns its required stable issue code and no backend-ready result.
  - Target recheck: TGT-PARSER
  - Receiver: T3
- [x] VR-PARSER-TAIL. Exercise profile-gated suffix closure
  - Criterion: AC-PARSER-TAIL
  - Proof class: worker smoke
  - Scenario / environment / fixture: In the same suite, exercise valid standard/high-consequence numbered suffixes, valid work-only standard/high-consequence plans with final Receiver `dev-verification` and `dev-implementation backend`, a valid standard fan-in with earlier lineage verification and integration, and a valid compact work-only plan. Mutate through partial suffix, missing numbered task, wrong order, wrong owner, non-none tail method, broken dependency, broken receiver, invented receiver task, no work task, compact plus the last three, compact with any tail owner, and unsupported Assurance.
  - Evidence form: Exact valid numbered, omitted-tail, fan-in, and compact-no-tail reports; a missing standard/high-consequence suffix never emits an issue; exact `TASK_TAIL_INVALID` or `ASSURANCE_PROFILE_INVALID` failures cover only malformed/forbidden shapes in OMP/Grok planner/backend paths; numbered and unnumbered receiver contracts pass; earlier D04 verification/integration tasks are not misclassified; no alternate preflight becomes eligible.
  - Target recheck: TGT-PARSER
  - Receiver: T3
- [x] VR-RUNTIME-METHODS. Smoke method binding and evidence
  - Criterion: AC-RUNTIME-METHODS
  - Proof class: worker smoke
  - Scenario / environment / fixture: Fresh read-only OMP and Grok state-trace simulations cover one plan-backed tdd work task, one none work task, one unavailable method binding, all three none-only tail tasks, and explicit test-first compact/direct work with no plan against the same authority revision.
  - Evidence form: Canonical traces show binding before ready, one worker attempt, no method-generated task/stage/receiver, exact tdd red/green evidence or explicit none in the Common Handoff, a pre-attempt block for unavailable binding, and equivalent `dev-tdd` binding from explicit no-plan authority.
  - Target recheck: TGT-RUNTIME
  - Receiver: T4
- [x] VR-RUNTIME-TAIL. Smoke task consumption and post-Handoff capture order
  - Criterion: AC-RUNTIME-TAIL
  - Proof class: worker smoke
  - Scenario / environment / fixture: Fresh read-only OMP and Grok traces cover a numbered sequential standard plan whose last work Handoff has a qualifying candidate, an unnumbered work-only standard plan, a numbered standard fan-in plan with lineage verification and integration, an unnumbered standard no-candidate plan, a compact work-only plan, and direct compact work with a candidate.
  - Evidence form: Every tasked verification runs at its D04 boundary. A numbered suffix is consumed once with no backend duplicate; an omitted suffix causes one backend-scheduled verification, review, and learning sequence; no trace contains both forms or an extra assurance event. Work ends in Handoff before the soft always-rule look; current candidates in every supported flow remain eligible; compact reaches completion with no tail; no candidate produces no papercut access/output.
  - Target recheck: TGT-RUNTIME
  - Receiver: T4
- [x] VR-EVAL-BEHAVIOR. Run focused receipt-bound semantic regressions
  - Criterion: AC-EVAL-BEHAVIOR
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `observe_case.py --self-test`; run `compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`; bind, execute, seal, and compare fresh OMP and Grok observations for new `B-PLAN-TAIL-PROFILE`, `B-PLAN-TAIL-OMITTED`, `B-COMPACT-PLAN-NO-TAIL`, `R-COMPACT-PLAN-WITH-TAIL`, and `B-TASK-METHOD-TDD`, rewritten `B-COMPACT`, `B-COMPACT-CURATION-TRIGGER`, and `R-COMPLETE-COMPACT-NO-LEARNING`, unchanged landed `B-T4-REPAIR-REMAINING-BLOCKER`, `B-T4-CHECKPOINT-PROOF-CLOSE`, `B-T4-REVISION-WORTH-OPINION`, and `B-T4-COMPACT-WORTH-NOT-TRIGGERED`, plus unchanged live consumers `B-T4-FANIN-VERIFIED`, `B-T5-EXECUTOR-PLAN-OMP`, and `B-T5-EXECUTOR-PLAN-GROK`; run papercut `P-POST-WORK-HANDOFF`, `P-CROSS-WORKFLOW`, and `P-NO-CANDIDATE` prompts in fresh supported contexts.
  - Evidence form: Observer/comparator self-tests exit 0; every sealed receipt binds exact request, target digest, interaction, and disposable runtime; every comparator result passes; all four landed worth-frame cases retain their exact objects, fixtures, and observed behavior; `B-PLAN-TAIL-PROFILE` consumes its numbered suffix once, `B-PLAN-TAIL-OMITTED` parses work-only and schedules one backend tail, the B-T5 pair accepts the numbered example fixture in its named context, fan-in retains every D04 boundary, and compact plus papercut contracts all match.
  - Target recheck: TGT-METHOD-CAPTURE, TGT-EVAL
  - Receiver: T5
- [x] VR-CUTOVER-PRESERVE. Prove clean cutover and preserved boundaries
  - Criterion: AC-CUTOVER-PRESERVE
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `scan_stale_contracts.py --self-test`, normal scan, and `--preserve`; confirm its preservation set retains all landed worth-frame needles, omits changed ADR-0007 and papercut rule/skill/WORKFLOW/evals, retains the helper, and binds `.agents/papercuts.json` at sha256:c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44. Run `compare_trace.py --keep-check --baseline-blob 3a2053bb1f03e7b32a77895b8fe8748189cda170 --baseline-commit 479dce6de60cde01c8c87627241618765ef05454 --baseline-sha256 bd5a27fe1b676f69731b7bb5eb931388725f3293a9ebc9db37d9f4bc3db086ba --current .config/agents/skills/dev-ask/evals/evals.json --repo-root .`; declare added `B-T4-CHECKPOINT-PROOF-CLOSE`, `B-T4-REVISION-WORTH-OPINION`, `B-T4-COMPACT-WORTH-NOT-TRIGGERED`, `B-PLAN-TAIL-PROFILE`, `B-PLAN-TAIL-OMITTED`, `B-COMPACT-PLAN-NO-TAIL`, `R-COMPACT-PLAN-WITH-TAIL`, and `B-TASK-METHOD-TDD`, and rewritten `B-T4-REPAIR-REMAINING-BLOCKER`, `B-COMPACT`, `B-COMPACT-CURATION-TRIGGER`, and `R-COMPLETE-COMPACT-NO-LEARNING`. Compare all three shared rule pairs and every TGT-PRESERVE base; prove the completed `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md` remains at sha256:bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755, its active path remains absent, and the 27-entry archive manifest remains sha256:59df34c41cd6d7a74f53e3908f2397942a46467de70c0fe9249dfe0752f67fd7; inspect staged state without staging; seal the sorted changed-path digest as TGT-FINAL.
  - Evidence form: All commands exit 0; scanner reports no stale or missing clause and retains the landed needles; keep-check changes exactly the four landed 1815 IDs plus this plan's declared IDs and preserves every other case; changed papercut contracts are outside preservation while ledger/helper and every other base remain exact; three hardlink byte/inode checks pass; the completed 1815 archive has no effect from this execution and no active sibling path is recreated; staged set is empty; TGT-FINAL names every and only changed source/fixture path.
  - Target recheck: TGT-EVAL, TGT-PRESERVE, TGT-FINAL
  - Receiver: T5
- [x] VR-INDEPENDENT-VERIFY. Reprove the exact final target independently
  - Criterion: AC-INDEPENDENT-VERIFY
  - Proof class: independent verification
  - Scenario / environment / fixture: A fresh `dev-verification` context binds TGT-FINAL, all prior Handoffs, the complete current applicable-rule manifest, fresh no-overwrite evidence roots, and reruns VR-POLICY-SHAPE through VR-CUTOVER-PRESERVE without reading T4 observation files.
  - Evidence form: TGT-VERIFY-EVIDENCE contains every criterion result, fresh receipts and parser reports, exact preservation results, pre/post TGT-FINAL digest equality, and one aggregate VERIFIED or exact NOT VERIFIED verdict.
  - Target recheck: TGT-VERIFY-EVIDENCE
  - Receiver: T6
- [x] VR-FINAL-REVIEW. Review only the immutable verified target
  - Criterion: AC-FINAL-REVIEW
  - Proof class: review
  - Scenario / environment / fixture: One fresh `dev-code-review` pass reads TGT-FINAL, TGT-VERIFY-EVIDENCE, AUTH-DEC-LOCK, the applicable rules, and each finite changed-contract caller/fixture; it applies current Standards and Specification finding relevance.
  - Evidence form: TGT-REVIEW-EVIDENCE returns approved, exact eligible blockers, authority conflict, or terminal advisories; target digest is unchanged and no repair occurs in the review context.
  - Target recheck: TGT-REVIEW-EVIDENCE
  - Receiver: T7
- [x] VR-TERMINAL-LEARNING. Run one assessment-only terminal evaluation
  - Criterion: AC-TERMINAL-LEARNING
  - Proof class: other authorized class
  - Scenario / environment / fixture: One `dev-continual-learning` Standard assessment receives the settled reviewed TGT-FINAL, complete affected-artifact and rule manifests, and terminal advisories; no frozen mutating candidate or repository-write effect is supplied.
  - Evidence form: TGT-LEARN-EVIDENCE is a complete `NO DURABLE LEARNING` or exact `BLOCKED`/deferred result, names no recursive papercut trigger, and proves TGT-FINAL plus TGT-PRESERVE unchanged.
  - Target recheck: TGT-LEARN-EVIDENCE
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | Exact TGT-POLICY-RULES, TGT-POLICY-ADRS, and TGT-POLICY-WORKFLOW revisions plus ten-row lock mapping | completed, blocked, authority-change-required, transport-unavailable | T2 | Common Handoff carries Intent none-method evidence, changed contract identities, worker smoke, and no unrelated effects. |
| OUTP-T2 | T2 | Exact TGT-PARSER revision, numbered/omitted/fan-in/compact positive digests, unit result, and stable malformed-shape issue matrix | completed, blocked, authority-change-required, transport-unavailable | T3 | Common Handoff carries Intent none-method evidence, parser schema, both-context/consumer proof, valid missing-tail evidence, and no ready result for any true negative. |
| OUTP-T3 | T3 | Exact TGT-RUNTIME revision and fresh OMP/Grok method, numbered-tail, omitted-tail, compact, and capture state traces | completed, blocked, authority-change-required, transport-unavailable | T4 | Common Handoff carries Intent none-method evidence, exactly one profile tail under either plan shape, soft post-work-Handoff ordering, and report-only ledger boundary. |
| OUTP-T4 | T4 | Exact TGT-METHOD-CAPTURE and TGT-EVAL revisions, sealed worker receipts, preservation proof, and TGT-FINAL digest | completed, blocked, authority-change-required, transport-unavailable | T5 | Common Handoff carries Intent none-method evidence, every changed/preserved identity, exact smoke, and immutable final manifest. |
| OUTP-T5 | T5 | TGT-VERIFY-EVIDENCE bound to unchanged TGT-FINAL | completed, blocked, failed, transport-unavailable | T6 | Verifier Common Handoff returns one aggregate VERIFIED or exact NOT VERIFIED verdict and never repairs. |
| OUTP-T6 | T6 | TGT-REVIEW-EVIDENCE bound to TGT-FINAL and OUTP-T5 | completed, blocked, authority-change-required, transport-unavailable | T7 | Review Common Handoff deduplicates eligible blockers, authority conflicts, and advisories; method evidence is none; no mutation. |
| OUTP-T7 | T7 | TGT-LEARN-EVIDENCE bound to the settled reviewed target | completed, blocked, transport-unavailable | dev-implementation backend | Curator Common Handoff records the one terminal assessment, method evidence none, no write, and no papercut-triggered recursion. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-AUTHORITY-DRIFT | dev-implementation backend | Current AUTH-DEC-LOCK, AUTH-HANDOFF, AUTH-REVIEW-HANDOFF, AUTH-FINAL-REVISION, AUTH-REBASE-HANDOFF, local plan bytes, SHA-256, status, and native approval | all | Any plan-byte change requires native reapproval; any changed locked semantic requires new human authority and a revised plan. | Exact current PENDING or IN_PROGRESS local authority validates and matches native approval before task readiness. |
| BLK-TARGET-DRIFT | dev-implementation backend | Current hash and semantic diff for every drifted changed or preservation target, including the three rule hardlink pairs and the current eval baseline | T1, T2, T3, T4 | A contract-equivalent base refresh requires plan revision and native reapproval; semantic, scope, or effect drift returns to the human authority owner. | Every task rechecks its named base; user work is preserved and the plan is rebound before mutation. |
| BLK-METHOD-BINDING | dev-implementation backend | Exact Methods value, closed-token validation, task role, and available current skill binding | T2, T3, T4 | Unknown or reserved token requires separate method authority and clean-cutover revision; no fallback to none. | Parser accepts the token and runtime binds every named method before ready without consuming an attempt. |
| BLK-FINAL-TARGET | dev-implementation backend | OUTP-T4, complete TGT-FINAL manifest, current applicable-rule manifest, preservation proof, and worker receipts | T5, T6, T7 | Source drift returns to the owning work task under existing attempt/repair authority; material authority drift requires reapproval. | T5 sees one immutable, complete, current target and fresh independent-proof capability. |
| BLK-ASSURANCE | dev-implementation backend | Exact verifier or reviewer Handoff, affected criteria or fixed-contract consumers, current repair token, impact map, and rerun state | T5, T6, T7 | Preserve ADR-0003 bounded same-outcome repair and rerun semantics; do not add another planned tail task. Material scope or acceptance change requires new authority. | T5 is VERIFIED and T6 is settled approved/advisory-only before T7; any eligible blocker is closed under existing backend recovery first. |
| BLK-TRANSPORT | dev-implementation backend | Fresh OMP/Grok context availability, independent-role availability, exact error, and proof that no semantic work or effect began | all | No provider/account/tool substitution, weaker self-proof, or automatic retry beyond current transport limits. | Required context and independent role are available under the unchanged contract, or return transport-unavailable. |

- exhausted token at 2026-08-19-1634
  - trying: Reject forbidden compact receivers and lifecycle owners without changing frozen criteria or proof recipes.
  - found: OBS-T6-COMPACT-RECEIVER, OBS-T6-COMPACT-WORK-ONLY; compact validation accepts a verification receiver and integration owner.
  - tried: Repaired eval-runtime alignment and independently verified the target; compact receiver and lifecycle-owner negatives remained uncovered.
  - target: sha256:0725654f010b48423318a55cbf0ad61ebc16da179563ec401dfae7ec291af904
  - remaining: AC-POLICY-SHAPE, AC-PARSER-TAIL, AC-RUNTIME-TAIL / dev-implementation backend
  - grant: continue 2026-08-19-1638
  - opinion: absent

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-LOCK | authority | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/78985ba1 at sha256:fdbe997e425afd2028d19bc06c5555befb5f4c7f2dc8510e6829c850497e81ff | Sole human decision table, rejected alternatives, file groups, eval requirements, exclusions, and four-work-slice shape. |
| ANC-REVIEW | authority | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/d4e581d9 at sha256:844d17142aa9fafeb4dba299160775390756a72f4e0517100a35c65b2beb918e | Round-one correction authority for compact legality, D04 fan-in, current-work capture, direct TDD binding, and runnable D13 eval/cutover projection. |
| ANC-FINAL-REVISION | authority | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/30d0df36 at sha256:000cb71e88f68783a110c05fea137c688d4ec8d3f41201f0d04fc2abe6ba9948 | Supersedes the universal numbered-tail mandate while preserving task fields, compact no-tail, profile proof count, TDD binding, and soft papercut capture. |
| ANC-REBASE | authority | omp-session://01a01427-c32e-7000-8939-fa5438ead225/message/1f3193c2 at sha256:bc846853c92508d1bc371adbeb6c5890a32f09197bcca7a2aff591d8a9104aa0 | Rebinds this plan to completed 1815 bytes, fixes the numbered-tail predecessor wording, and freezes landed D03, worth-frame, Close, record, compact, Handoff, eval, and archive behavior. |
| ANC-PLAN-CONTRACT | rule | `.config/agents/rules/plan.md:38-56`; `.config/agents/rules/plan-impl-spec.md:41-60` | Own task numbering, sizing, task fields, and profile suffix authoring semantics. |
| ANC-PARSER | code | `.config/agents/skills/dev-implementation/scripts/executor_plan.py:TASK_FIELDS,_parse_tasks,validate_text,preflight_file` | Sole shared OMP/Grok structural enforcement and backend eligibility seam. |
| ANC-RUNTIME | skill | `.config/agents/skills/dev-implementation/SKILL.md:Task Contract,Route-to-task and todo projection,State transitions`; `.config/agents/skills/dev-handoff/SKILL.md:Common Handoff` | Own field projection, method ready-gate, task consumption, post-work hook, and method evidence. |
| ANC-CAPTURE | rule and skill | `.config/agents/rules/papercut.md` plus `.grok/rules/papercut.md`; `.config/agents/skills/papercut/SKILL.md:Capture and candidate delivery`; `.config/agents/skills/papercut/WORKFLOW.md`; `docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md:D24` | Own candidate-triggered current-work activation, soft post-work-Handoff look, and no-stage/no-learning boundary; helper mechanics remain unchanged. |
- ASM-HARDLINKS: The plan, implementation-plan, and papercut rule pairs share the device and inode identities recorded in TGT-POLICY-RULES and TGT-METHOD-CAPTURE. Edit each shared inode once. If any pair has diverged before its owner task, edit both named paths to byte-identical content and include both exact final hashes; do not create a compatibility copy or choose one provider as semantic authority.
- ASM-SCHEMA-V1: The lock extends the existing portable Executor Plan v1 rather than authorizing a v2 parser, sidecar, or compatibility mode. Keep both result schema names and the one parser path; add stable issues inside v1.
- ASM-EVAL-BASELINE: The current landed eval registry is repository-modified at sha256:1ac4b89b68828029fcc32661e2399082b67352ba5ef7a65af4e496844ff4c045 and is not bound to a current commit/blob pair, while `compare_trace.py --keep-check` requires both. Use the authorized historical-baseline alternate: preserve the four landed 1815 IDs and fixture bytes explicitly, declare them together with only this plan's additions/rewrites, and keep every other historical case exact.
- ASM-EVAL-TRANSPORT: Fresh OMP and Grok semantic contexts plus fresh independent verifier/reviewer roles are available during execution. If unavailable after current bounded transport handling, return transport-unavailable and leave the plan IN_PROGRESS; do not replace semantic proof with source-string checks or self-review.
- ASM-SIBLING-PLAN: The 1815 plan is terminal and archived at `.agents/plans/archive/2026-08-18-1815_checkpoint-worth-frame.md` with sha256:bdf7a7432ecec22f5bb51e5e7b66ef2d39461b0086e116b621cc25d9fd057755; its former active path is absent. This plan never edits or approves that archive, recreates its active path, or rewrites its policy, tail, Close behavior, or bytes.

## Completion Summary

- Delivered one portable OMP/Grok Executor Plan task contract with required human `Intent`, closed `Methods: none | tdd` for work, `Methods: none` for authored tail tasks, one Owner, one Receiver, and one `T*` task family.
- Standard and high-consequence plans now accept either one exact numbered verification-review-learning suffix or an omitted suffix scheduled once by the backend. Compact remains plan-optional, work-only, smoke-terminal, and tail-free; its final Receiver is `dev-implementation backend`, and current non-work lifecycle Owners are rejected.
- The shared v1 parser, runtime Task Contract, Common Handoff, `dev-tdd` binding, papercut soft post-work-Handoff look, active ADRs, workflow reference, stale scanner, and focused OMP/Grok evals now implement the same contract without a compatibility parser or second fixture convention.
- Final target: 32 entries at SHA-256 `3f486635708ec85c0ebf1154d96fc005d94e8c198baad20ef2aae327b22a31c9`.
- Assurance:
  - Initial independent proof exposed `OBS-T5-EVAL-SNAPSHOT` and `OBS-T5-EVAL-COMPLETE-OWNER`; one consolidated repair aligned bounded observation grammar and backend-only transition ownership.
  - Initial review exposed `OBS-T6-COMPACT-RECEIVER` and `OBS-T6-COMPACT-WORK-ONLY`; the persisted human Continue grant authorized one compact-parser cycle. Both findings closed across OMP/Grok planner, backend, and preflight consumers.
  - Grant-cycle verification attempt 2/2 returned `VERIFIED` in `local://outp-granted-verification-r2.json` at SHA-256 `1d3489eb402e76e4194733d512bcecb35ff1df70138e18ccd5d81315ed387c2d`.
  - The original review rerun returned `APPROVED` in `local://outp-t6-rerun.json` at SHA-256 `f2d6c9aa7296757e37808b58ebf808b9c8acf6bd01a82a6e3f8a8e3d604a5bb4`.
  - The one terminal Standard assessment returned `NO DURABLE LEARNING` in `local://outp-t7.json` at SHA-256 `6de9d15b79131fa51d0debc288f30bece778f19606d2dbd2b62b07a9432a95bf`; no guidance or papercut mutation was authorized.
- Final deterministic checks: parser unit suite 20/20; stale scanner normal and preservation modes reported zero hits and zero missing clauses; historical keep-check preserved 149 cases with exactly eight authorized additions and four rewrites; staged state remained empty.
- Preservation: the live papercut ledger, helper, both AGENTS copies, product/setup ADRs, all 27 historical plan archives, completed 1815 archive, reserved skill absences, and user-deleted active plans remained exact. No staging, commit, push, release, deployment, credential, ledger, shipping, or external-system effect occurred.
- Decisions: the approved fixture hash and sole current caller resolved the plan's shorthand `fixtures/executor_plan` target to the existing `scripts/fixtures/executor_plan` location; no duplicate fixture tree was created. The repair token remained consumed, the initial review and its rerun were each consumed once, and the historical Continue checkpoint record remains intact.
- Residual risk: none identified by the final verifier, review rerun, or terminal assessment.
