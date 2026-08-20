# Optimize assurance-tail execution

**Datetime**: 2026-08-19-1400
**Authority kind**: local-authority
**Scope**: Engineering workflow assurance execution, evidence transport, and bounded evaluation
**Summary**: Keep independent verification, one final review, and terminal learning. Clarify existing reuse, smoke, manifest, Handoff, later-slot closure, and completion seams so the tail does not rebuild valid proof, restate unchanged state, or silently admit a disjoint finding into another same-outcome repair cycle.
**Status**: PENDING

## Objective

- Outcome: OUT-ASSURANCE-TAIL-EFFICIENCY
- Observable end state: Worker smoke uses frozen acceptance coverage without becoming verifier evidence; same-outcome repair reuses exact valid independent evidence for unaffected criteria; original-initial review remains one whole-scope pass and seals finding lineages; original-rerun and grant-scoped review are closure and impact passes that leave D22 classification unchanged; later same-outcome repair admits only incomplete lineages and repair-caused regressions with direct causal evidence; disjoint outcome-relevant findings stay CHANGES REQUIRED and return authority-change-required without silent repair, verification restart, learning, approval, or completion; manifests bind once per immutable revision; Common Handoffs carry role-local deltas plus digest-bound references; backend completion validates receipts and executes zero criterion recipes; independent verification, one final review plus eligible rerun, and one terminal Standard assessment keep their current owners, order, count, and independence.
- Progress signal: One named AC-SMOKE-PARITY, AC-REPAIR-REUSE, AC-REVIEW-SET, AC-REVIEW-ADMISSION, AC-HANDOFF-DELTA, AC-MANIFEST-COMPLETION, AC-EVAL-QUALITY, AC-EVAL-PORTABILITY, AC-PROOF-INVOCATION, AC-PRESERVE-TAIL, or AC-CUTOVER condition passes on the exact current target, or one named BLK-AUTH, BLK-QUALITY, BLK-HANDOFF-COLDSTART, BLK-GENUINE-PROOF, BLK-REVIEW-ADMISSION, BLK-REVIEW-SAFETY, or BLK-TRANSPORT closes with current authority and target evidence. Elapsed time, sample count, agent count, token use, Continue count, and another audit are not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-USER | confirmed human decision | current 2026-08-19 request to keep verification, review, and learning while making the assurance tail leaner, robust, efficient, harness-agnostic, repository-neutral, deterministic, and lower-ceremony, refined 2026-08-20 with a second named session, the R3 classification/lineage/admission separation, and the cutover that adds router admission plus complete preserve-path equality | USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Planning authority only for the R3 classification, lineage, and repair-admission decisions and this cutover; this confirmation does not authorize execution or shipping; native harness review of this plan's complete bytes is required before T1 |
| AUTH-ADR0003 | active ADR | docs/adr/0003-bounded-assurance-and-repair.md | SHA-256 61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b | Preserve D03, D04, and D22 budgets and classification; clarify later-slot lineage, closure, aggregation, and same-outcome repair admission |
| AUTH-ADRINDEX | active ADR discovery | docs/adr/INDEX.md | SHA-256 64526de3423fd73ef0c3cd00a4483e8f0106db06acbee4bfb9f195351a952b89 | Project the same later-slot lineage, closure/impact review, and bounded repair-admission clarifications into the ADR-0003, D03, D04, and D22 discovery rows |
| AUTH-ADR0004 | active ADR | docs/adr/0004-canonical-discovery-and-continual-learning.md | SHA-256 3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734 | Preserve D07 exactly one terminal Standard assessment, including valid NO DURABLE LEARNING |
| AUTH-WORKFLOW | current workflow authority | .config/agents/skills/dev-ask/WORKFLOW.md | SHA-256 2fc5a46af5be75b3d200c183e79ce4a554037cde3f47f8131d07eb0e3efc4664 | Synchronize manifest binding, later-slot review selection, repair admission, and completion accounting with the clarified seams |
| AUTH-ASK | current router authority | .config/agents/skills/dev-ask/SKILL.md | SHA-256 ea9917411c115241b91edea9ce5821da3177a01390b897d79ac8ebd06062ef0c | Add the disjoint outcome-blocker to authority-change-required routing branch; keep eligible same-lineage blockers on same-outcome repair |
| AUTH-SESSION | read-only timing and failure evidence | /Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-19T04-19-55-861Z_01a0183f-4955-7000-8221-f2aa146b98a5.jsonl | SHA-256 33813f01dc0ddc1a414ad33d3e42c354ac63f47d8c02ac24d8c520af434fc0e1 | Evidence only; do not rewrite the session or treat pause time as workflow cost |
| AUTH-SESSION2 | read-only timing and failure evidence | /Users/kim/.omp/agent/sessions/-dev-atlas-app/2026-08-19T15-35-48-278Z_01a01aaa-1136-7000-92bf-13819ab4a00c.jsonl | SHA-256 d018785f5b7e3ac8bedd7e403b62821dd4e8e83f8b92a8d3bf1ee9dc59056eae | Evidence only; do not rewrite the session, treat human-wait as workflow cost, encode Atlas product IDs into this plan, or treat the session-stop residual as a D22 proof-ceremony reclassification |
| AUTH-BASE | current repository bytes | /Users/kim/.dotfiles | Git HEAD 479dce6de60cde01c8c87627241618765ef05454 plus current unstaged user work | Preserve unrelated hunks; no staging or shipping |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| ADR-0003 | AUTH-ADR0003 61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b | Keep independent proof, one post-assurance repair, causal impact maps, one final review plus its eligible rerun, and terminal convergence. Define verification freshness as fresh target and rule equality, fresh impacted proof, and a fresh aggregate verdict. Repair proposes the impact map; the backend freezes complete parent coverage; the verifier independently accepts or rejects each action. D22 classification is unchanged: direct evidence of a broken parent AC or observable changed-contract consumer remains a blocker; advisories do not threaten the approved outcome; safety intake is separate. |
| ADR-0004 | AUTH-ADR0004 3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734 | Keep exactly one terminal Standard assessment after a settled reviewed standard or high-consequence outcome. |
| DEC-SMOKE-PARITY | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Worker smoke exercises the frozen acceptance cases, fixtures, and oracles and fails before assurance on mismatch. Worker smoke and worker conclusions never become independent verifier evidence. |
| DEC-REVIEW-SET | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Separate finding classification, finding lineage, and same-outcome repair admission. Original-initial review remains one whole-scope pass and seals initial finding lineages. Original-rerun and grant-scoped review are closure and impact passes, not fresh whole-scope discovery. A later pass freshly reviews remaining lineages and impacted surfaces; exact original review evidence may be reused only for byte-, authority-, contract-, and dependency-identical unaffected surfaces. Verifier receipts are review inputs, never the review verdict. Aggregate APPROVED requires every prior lineage closed, no repair-caused blocker, no disjoint outcome-relevant blocker, and every unchanged-surface reuse identity still valid. A grant or changed hypothesis is authority, not causal evidence. |
| DEC-REVIEW-ADMISSION | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Same-outcome repair after original-initial admits only (1) incomplete closure of an existing lineage or (2) a new lineage with direct causal evidence from the exact repaired revision, exact changed bytes or contract delta, accepted D04 impact-map edge, observable failure path from that delta, and fresh affected proof. A later-slot observation that is disjoint and non-outcome is a terminal advisory. Independently serious safety returns separate-authority intake and never consumes the parent repair set. A disjoint outcome-relevant non-safety defect remains CHANGES REQUIRED, keeps the parent incomplete, and returns authority-change-required to the outcome authority; it does not silently create another same-outcome repair cycle, restart verification, dispatch learning, approve, or complete. Continue remains human authority and is not a cap, a progress signal, or a substitute for that causal evidence. |
| DEC-TRANSPORT | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Bind the applicable-rule and target manifests once per immutable revision. Each later role compares current bytes with those exact entries. Common Handoffs carry only role-local deltas plus digest-bound references to unchanged state and evidence. After VERIFIED, final APPROVED, and CURATED or NO DURABLE LEARNING, completion validates receipts, counters, and identities and executes zero criterion proof recipes. |
| DEC-NO-JOBS | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Reject a proof-job scheduler, proof cache, ledger, daemon, resumable partial-verification protocol, semantic-result substitution, verifier-verdict substitution, Continue-count cap, weaker model or provider fallback, and compatibility shim. Existing two safe transport retries remain. |
| DEC-NO-WALLCLOCK | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Named-session pause, Continue ask-response wait, delayed disposal, and wall-clock medians are diagnostic only. When reported, use gross, human-wait, and agent-active consistently. Progress is criterion or blocker evidence, including proof-invocation counts on frozen fixtures. |
| DEC-ONE-OWNER | AUTH-USER USER-ASSURANCE-TAIL-EFFICIENCY-20260820-R3 | Execute as one shared sequential lineage. This section pre-approves a contract-preserving one-owner sequential projection. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-USER through AUTH-BASE; current ADR-0003, ADR index, ADR-0004, WORKFLOW, `dev-ask` skill, implementation, verification, Handoff, review, and learning contracts; existing observer, comparator, and stale-contract scanner tools; the two named session JSONLs; current Git and unstaged user work.
- Change surfaces: T1 may edit only TGT-AUTHORITY and TGT-EXECUTION from their bound current bytes. T2 may edit only TGT-EVAL. T3 produces TGT-FINAL as a Handoff-sealed identity and proves TGT-PRESERVE unchanged.
- Non-goals: Removing or merging assurance roles; changing assurance-profile selection; increasing or capping repair, review, or Continue budgets; caching semantic verdicts; adopting the verifier verdict as the review verdict; reclassifying later-slot outcome-relevant findings as advisory or proof-ceremony from a verifier verdict; live multi-sample wall-clock races; redesigning plan transport or the parser; modifying papercut or continual-learning qualification policy; encoding named-session product IDs into workflow contracts; shipping.
- Prohibited effects: New lifecycle state, durable evidence service, background process, provider-specific workflow rule, mutation of user-level `/Users/kim/.agents/AGENTS.md` at SHA-256 `1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9`, live papercut ledger changes, archived-plan rewrites, reverting unrelated current working-tree hunks, staging, commit, push, release, or deployment.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-CONTRACT | repository configuration and active ADR writes | AUTH-USER | T1 may modify only TGT-AUTHORITY and TGT-EXECUTION; preserve unrelated hunks in those files; reversible before delivery |
| EFF-EVAL | repository evaluation registry, fixture, and harness-allowlist writes | AUTH-USER | T2 may add or update only the named TGT-EVAL registry entries and fixture directories; compare_trace.py and scan_stale_contracts.py case-ID allowlists; scanner stale/required contract needles; and the scanner PRESERVED map, including removal of the changing `dev-ask/SKILL.md` entry. No observation, receipt, comparator, or scanner schema change. observe_case.py remains unchanged. Reversible before delivery |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-ASSURANCE | ADR-0003 independent proof, repair, review, and convergence boundaries | T1 | AUTH-ADR0003 61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b | T1, T2, T3 |
| CONTRACT-SMOKE | Criterion-complete worker smoke using frozen acceptance inputs without becoming verifier evidence | T1 | AUTH-ADR0003 D04; DEC-SMOKE-PARITY | T1, T2 |
| CONTRACT-REUSE | Repair owner proposes; backend freezes complete coverage; verifier independently validates impacted and unaffected evidence actions | T1 | AUTH-ADR0003 D04; DEC-TRANSPORT | T1, T2 |
| CONTRACT-REVIEW-SET | D22 classification unchanged; later-slot lineage, closure, aggregation, and same-outcome repair admission | T1 | AUTH-ADR0003 D03/D22; DEC-REVIEW-SET; DEC-REVIEW-ADMISSION | T1, T2 |
| CONTRACT-HANDOFF | One role-local Common Handoff delta with exact URI and SHA-256 references to unchanged state and evidence | T1 | AUTH-USER DEC-TRANSPORT | T1, T2 |
| CONTRACT-COMPLETION | Backend validates terminal receipts and identities without executing criterion proof | T1 | AUTH-WORKFLOW; DEC-TRANSPORT | T1, T2, T3 |
| CONTRACT-EVAL | Existing observer and comparator receipts, mutation guards, OMP and Grok parity, proof-invocation counts, case-ID allowlists, and scanner preserve-map | T2 | compare_trace.py SHA-256 1f11e6a2ed7c0a0240d1e333be9c3d30528d229927aab2ac6f5dc984224337d6; scan_stale_contracts.py SHA-256 84c6fdcb202c1fea5a296589ec6ab7719d2ba61c70b94783c0d4ded7721dcf87; observe_case.py SHA-256 9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd unchanged | T2, T3 |
| CONTRACT-LEARNING | ADR-0004 terminal Standard assessment boundary | T3 | AUTH-ADR0004 3db01bef5b6e1885fa2249bd17e23c9d28c1acec7cb2f628a552d9f79b846734 | T3 |
| CONTRACT-PRESERVE | Learning, parser, plan-transport, papercut contracts and ledger, repository AGENTS.md, and user-level AGENTS.md remain unchanged | T3 | AUTH-BASE 479dce6de60cde01c8c87627241618765ef05454 plus ANC-PRESERVE per-path hashes | T3 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-AUTHORITY | docs/adr/0003-bounded-assurance-and-repair.md, docs/adr/INDEX.md, .config/agents/skills/dev-ask/WORKFLOW.md, and .config/agents/skills/dev-ask/SKILL.md | T1 | SHA-256 61d176db8e9ac4c1669bded1e5b79c3addefee689ca8480061303c3b50fdd95b, 64526de3423fd73ef0c3cd00a4483e8f0106db06acbee4bfb9f195351a952b89, 2fc5a46af5be75b3d200c183e79ce4a554037cde3f47f8131d07eb0e3efc4664, and ea9917411c115241b91edea9ce5821da3177a01390b897d79ac8ebd06062ef0c | T1 smoke; T2 reuse, later-slot, admission, and completion cases | AC-REPAIR-REUSE, AC-REVIEW-SET, AC-REVIEW-ADMISSION, AC-MANIFEST-COMPLETION |
| TGT-EXECUTION | .config/agents/skills/dev-implementation/SKILL.md, .config/agents/skills/dev-verification/SKILL.md, .config/agents/skills/dev-handoff/SKILL.md, and .config/agents/skills/dev-code-review/SKILL.md | T1 | SHA-256 8c6258b25645d606ebf024335b32baf27a1f019d080aa8d7be1fc56361778585, 179272eb2d73a0b3dde9cfa816307580a61a010c240498d1896ee2462d01c7bd, 1e56911f5fb7ce82cc75234bad94dc60aad4c308d404493a1778e50dc04e9499, and 44274d866a92db4fe5561d464e91e76c7fc76d2abc61ddbd4ccad92c36c0c0d4 | T1 smoke; T2 reuse, later-slot, admission, Handoff, and completion cases | AC-SMOKE-PARITY, AC-REPAIR-REUSE, AC-REVIEW-SET, AC-REVIEW-ADMISSION, AC-HANDOFF-DELTA, AC-MANIFEST-COMPLETION |
| TGT-EVAL | .config/agents/skills/dev-ask/evals/evals.json, .config/agents/skills/dev-ask/evals/compare_trace.py, .config/agents/skills/dev-ask/evals/scan_stale_contracts.py, and the exact case IDs and fixture directories named in ANC-EVAL-CASES | T2 | evals.json SHA-256 6f34a1a793807fb3950c1f4e2d34de00bfefb847ec915f09346da86572f73c76; compare_trace.py SHA-256 1f11e6a2ed7c0a0240d1e333be9c3d30528d229927aab2ac6f5dc984224337d6; scan_stale_contracts.py SHA-256 84c6fdcb202c1fea5a296589ec6ab7719d2ba61c70b94783c0d4ded7721dcf87; named new fixture directories absent | observe_case.py unchanged; compare_trace.py --keep-check baseline blob 3a2053bb1f03e7b32a77895b8fe8748189cda170, commit 479dce6de60cde01c8c87627241618765ef05454, SHA-256 bd5a27fe1b676f69731b7bb5eb931388725f3293a9ebc9db37d9f4bc3db086ba; existing tail, blocker, remaining-blocker, review, and missing-assurance cases named in ANC-EVAL-CASES | AC-EVAL-QUALITY, AC-EVAL-PORTABILITY, AC-PROOF-INVOCATION |
| TGT-PRESERVE | Exact paths named in ANC-PRESERVE | T3 | Per-path SHA-256 values in ANC-PRESERVE | T3 preservation smoke; backend-scheduled review and learning | AC-PRESERVE-TAIL |
| TGT-FINAL | Sorted changed-path and SHA-256 manifest sealed in the T3 Common Handoff; must include docs/adr/INDEX.md, compare_trace.py, and scan_stale_contracts.py | T3 | absent until T3 seal | backend-scheduled verifier | AC-CUTOVER |

## Execution policy

- Assurance: high-consequence
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared lineage
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 completes before T2. T2 completes before T3. Sequential edits of shared files use T1 bytes as T2 base.
- Decomposition: no child delegation
- Effect limit: EFF-CONTRACT, EFF-EVAL
- Orchestrator profile: Contract-preserving one-owner sequential projection; full orchestration is not required.

## Tasks

- [ ] T1. Synchronize assurance execution contracts
  - Owner: dev-implementation
  - Intent: Make existing proof reuse, later-slot closure, and evidence transport deterministic without weakening a gate.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-AUTHORITY, TGT-EXECUTION
  - Contracts: CONTRACT-ASSURANCE, CONTRACT-SMOKE, CONTRACT-REUSE, CONTRACT-REVIEW-SET, CONTRACT-HANDOFF, CONTRACT-COMPLETION
  - Criteria: AC-SMOKE-PARITY, AC-REPAIR-REUSE, AC-REVIEW-SET, AC-REVIEW-ADMISSION, AC-HANDOFF-DELTA, AC-MANIFEST-COMPLETION
  - Effects: EFF-CONTRACT
  - Output: OUTP-T1
  - Receiver: T2
  - Verification: VR-SMOKE-PARITY, VR-REPAIR-REUSE, VR-REVIEW-SET, VR-REVIEW-ADMISSION, VR-HANDOFF-DELTA, VR-MANIFEST-COMPLETION
  - Lineage: shared
- [ ] T2. Add bounded quality and near-miss evals
  - Owner: dev-implementation
  - Intent: Prove the clarified contracts reject every quality-reducing shortcut.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-EVAL
  - Contracts: CONTRACT-ASSURANCE, CONTRACT-SMOKE, CONTRACT-REUSE, CONTRACT-REVIEW-SET, CONTRACT-HANDOFF, CONTRACT-COMPLETION, CONTRACT-EVAL
  - Criteria: AC-EVAL-QUALITY, AC-EVAL-PORTABILITY, AC-PROOF-INVOCATION
  - Effects: EFF-EVAL
  - Output: OUTP-T2
  - Receiver: T3
  - Verification: VR-EVAL-QUALITY, VR-EVAL-PORTABILITY, VR-PROOF-INVOCATION
  - Lineage: shared
- [ ] T3. Seal preservation and the final target identity
  - Owner: dev-implementation
  - Intent: Prove the existing gates and excluded surfaces stayed intact.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-PRESERVE, TGT-FINAL
  - Contracts: CONTRACT-ASSURANCE, CONTRACT-COMPLETION, CONTRACT-EVAL, CONTRACT-LEARNING, CONTRACT-PRESERVE
  - Criteria: AC-PRESERVE-TAIL, AC-CUTOVER
  - Effects: none
  - Output: OUTP-T3
  - Receiver: dev-verification
  - Verification: VR-PRESERVE-TAIL, VR-CUTOVER
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-SMOKE-PARITY | Frozen acceptance cases, fixtures, and oracles plus finite consumer maps where bound | Worker smoke uses those inputs, fails before assurance on mismatch, and is never consumed as independent verifier evidence | TGT-EXECUTION | T1 |
| AC-REPAIR-REUSE | Same-outcome repair of the frozen parent acceptance set | Every parent criterion is impacted or unaffected; impacted proof runs fresh; exact valid prior independent evidence is reused for unaffected criteria; the verifier independently accepts each action and produces a fresh aggregate verdict | TGT-AUTHORITY, TGT-EXECUTION | T1 |
| AC-REVIEW-SET | Original-initial sealed lineages plus a later original-rerun or grant-scoped pass | D22 classification is unchanged; lineage identity follows the defect predicate in ANC-LINEAGE, not file path; the later pass binds the prior review receipt, remaining lineages, exact repair delta, accepted review impact map, affected and unchanged surfaces, and required finite consumers; it freshly reviews closure and impacted surfaces; original review evidence is reused only for byte-, authority-, contract-, and dependency-identical unaffected surfaces; verifier receipts are inputs not the verdict; aggregate APPROVED requires every prior lineage closed, no repair-caused blocker, no disjoint outcome-relevant blocker, and valid unchanged-surface reuse | TGT-AUTHORITY, TGT-EXECUTION | T1 |
| AC-REVIEW-ADMISSION | Later-slot observation plus remaining lineages and exact repair delta | Incomplete same-lineage failure stays CHANGES REQUIRED and remains same-outcome repair-eligible; a repair-caused new lineage is admitted only with exact repaired revision, changed-byte or contract delta, accepted D04 impact-map edge, observable failure path, and fresh affected proof; a grant hypothesis cannot admit; a disjoint non-outcome observation is a terminal advisory; independently serious safety is separate intake; a disjoint outcome-relevant non-safety defect stays CHANGES REQUIRED, keeps the parent incomplete, and the `dev-ask` router returns authority-change-required without silent same-outcome repair, verification restart, learning, approval, or completion | TGT-AUTHORITY, TGT-EXECUTION | T1 |
| AC-HANDOFF-DELTA | Role Handoff after an unchanged Task Contract, manifest, and prior evidence identity | One Common Handoff carries role-local deltas and digest-bound references without body duplication; missing, stale, or mismatched references block cold-start consumption | TGT-EXECUTION | T1 |
| AC-MANIFEST-COMPLETION | Immutable target revision plus terminal VERIFIED, APPROVED, and CURATED or NO DURABLE LEARNING receipts | Target and rule manifests bind once per revision and each later role freshly compares them; terminal completion validates receipts, counters, and identities and executes zero criterion proof recipes | TGT-AUTHORITY, TGT-EXECUTION | T1 |
| AC-EVAL-QUALITY | The exact TGT-EVAL cases named in ANC-EVAL-CASES | No false approval, escaped seeded defect, accepted mutation, stale evidence reuse, duplicate tail or review or learning, cancelled-partial reuse, mixed-target aggregate, false advisory of an outcome-relevant defect, grant-hypothesis-only repair admission, or verifier-verdict substitution | TGT-EVAL | T2 |
| AC-EVAL-PORTABILITY | The same frozen cases under OMP and Grok | Equivalent contract decisions without provider-specific workflow clauses or weaker substitution | TGT-EVAL | T2 |
| AC-PROOF-INVOCATION | Same-outcome repair plus later-slot review, learning, and completion cases on frozen fixtures | Only impacted recipes re-execute; later review slots freshly inspect remaining lineages and impacted surfaces and reuse only valid unaffected review evidence; completion executes zero recipes; cancelled partial proof is unused | TGT-EVAL | T2 |
| AC-PRESERVE-TAIL | Exact ANC-PRESERVE paths at their bound hashes | Independent verification, one original-initial whole-scope review, one eligible original-rerun, grant-scoped existence after both original slots, and one terminal Standard assessment retain their current owners, order, count, and independence; later-slot scope and verdict composition may change under AC-REVIEW-SET and AC-REVIEW-ADMISSION; protected targets are byte-unchanged | TGT-PRESERVE | T3 |
| AC-CUTOVER | T1 and T2 changed paths after T2 smoke | All changed paths appear once in TGT-FINAL, including docs/adr/INDEX.md, compare_trace.py, and scan_stale_contracts.py; protected targets are absent from that manifest; no new service, state, cache, or prohibited effect exists | TGT-FINAL | T3 |

## Verification / Done criteria

- [ ] VR-SMOKE-PARITY. Check worker smoke against frozen acceptance coverage
  - Criterion: AC-SMOKE-PARITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: TGT-EXECUTION smoke and Handoff clauses on current bytes
  - Evidence form: exact-target smoke showing frozen-case coverage and an explicit not-verifier-evidence boundary
  - Target recheck: TGT-EXECUTION
  - Receiver: T2
- [ ] VR-REPAIR-REUSE. Check impact-map acceptance and unaffected reuse
  - Criterion: AC-REPAIR-REUSE
  - Proof class: worker smoke
  - Scenario / environment / fixture: ADR-0003 D04 plus verification and implementation repair clauses
  - Evidence form: exact clauses that assign propose, freeze, and accept roles and define freshness as identity, impacted proof, and aggregate verdict
  - Target recheck: TGT-AUTHORITY, TGT-EXECUTION
  - Receiver: T2
- [ ] VR-REVIEW-SET. Check later-slot lineage, closure, and aggregate verdict
  - Criterion: AC-REVIEW-SET
  - Proof class: worker smoke
  - Scenario / environment / fixture: ADR-0003 D03/D22, docs/adr/INDEX.md ADR-0003/D03/D04/D22 rows, WORKFLOW, `dev-ask` skill, implementation, and review later-slot clauses
  - Evidence form: exact agreeing clauses across ADR, index, skill, and WORKFLOW that keep D22 classification, bind lineage by ANC-LINEAGE, require later-slot intake bindings, and define aggregate APPROVED without verifier-verdict substitution
  - Target recheck: TGT-AUTHORITY, TGT-EXECUTION
  - Receiver: T2
- [ ] VR-REVIEW-ADMISSION. Check same-outcome repair admission
  - Criterion: AC-REVIEW-ADMISSION
  - Proof class: worker smoke
  - Scenario / environment / fixture: ADR-0003 D03/D22, docs/adr/INDEX.md D03/D22 rows, implementation, review, and `dev-ask` router admission clauses
  - Evidence form: exact agreeing clauses across ADR, index, skill, and WORKFLOW that admit only incomplete lineage and causal repair regression, reject grant-hypothesis-only expansion, and route disjoint outcome-relevant defects to authority-change-required without advisory demotion or silent same-outcome repair
  - Target recheck: TGT-AUTHORITY, TGT-EXECUTION
  - Receiver: T2
- [ ] VR-HANDOFF-DELTA. Check role-local Handoff references
  - Criterion: AC-HANDOFF-DELTA
  - Proof class: worker smoke
  - Scenario / environment / fixture: Common Handoff contract on TGT-EXECUTION
  - Evidence form: exact delta-and-reference requirement plus a missing-reference hard stop
  - Target recheck: TGT-EXECUTION
  - Receiver: T2
- [ ] VR-MANIFEST-COMPLETION. Check bind-once manifests and receipt-only completion
  - Criterion: AC-MANIFEST-COMPLETION
  - Proof class: worker smoke
  - Scenario / environment / fixture: WORKFLOW and implementation dispatch and completion clauses
  - Evidence form: exact bind-once-and-compare requirement and a completion path that names receipt validation with zero recipe execution
  - Target recheck: TGT-AUTHORITY, TGT-EXECUTION
  - Receiver: T2
- [ ] VR-EVAL-QUALITY. Run the focused quality and near-miss matrix
  - Criterion: AC-EVAL-QUALITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: observe_case.py --self-test; scan_stale_contracts.py --self-test; scan_stale_contracts.py normal scan; scan_stale_contracts.py --preserve; compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json; compare_trace.py --keep-check against baseline blob 3a2053bb1f03e7b32a77895b8fe8748189cda170, commit 479dce6de60cde01c8c87627241618765ef05454, SHA-256 bd5a27fe1b676f69731b7bb5eb931388725f3293a9ebc9db37d9f4bc3db086ba; and every declared changed or new ANC-EVAL-CASES identity under both OMP and Grok
  - Evidence form: sealed receipts and comparator results with hard-quality counters at zero, keep-check pass, and scanner preserve/normal-scan pass
  - Target recheck: TGT-EVAL
  - Receiver: T3
- [ ] VR-EVAL-PORTABILITY. Compare OMP and Grok decisions on the same frozen cases
  - Criterion: AC-EVAL-PORTABILITY
  - Proof class: worker smoke
  - Scenario / environment / fixture: the T2 sealed cases under both semantic contexts
  - Evidence form: equivalent contract decisions and no provider-specific workflow clause
  - Target recheck: TGT-EVAL
  - Receiver: T3
- [ ] VR-PROOF-INVOCATION. Count recipe executions on frozen fixtures
  - Criterion: AC-PROOF-INVOCATION
  - Proof class: worker smoke
  - Scenario / environment / fixture: same-outcome repair, later-slot review, learning, and completion cases with normalized proof fingerprints
  - Evidence form: invocation counts showing impacted-only re-execution, later-slot closure/impact review, sealed-receipt consumption downstream, zero completion recipes, and unused cancelled partial proof
  - Target recheck: TGT-EVAL
  - Receiver: T3
- [ ] VR-PRESERVE-TAIL. Recheck protected learning and excluded contracts
  - Criterion: AC-PRESERVE-TAIL
  - Proof class: worker smoke
  - Scenario / environment / fixture: pre/post hashes of every ANC-PRESERVE path
  - Evidence form: byte equality on each protected path and unchanged review-slot owner, order, count, and independence clauses
  - Target recheck: TGT-PRESERVE
  - Receiver: dev-verification
- [ ] VR-CUTOVER. Seal the changed-path manifest
  - Criterion: AC-CUTOVER
  - Proof class: worker smoke
  - Scenario / environment / fixture: sorted changed-path inventory after T2 including docs/adr/INDEX.md, compare_trace.py, and scan_stale_contracts.py, empty staged set, and no new runtime store or process
  - Evidence form: TGT-FINAL identity with each changed path once, the three required cutover paths present, protected paths absent, and prohibited-effect check
  - Target recheck: TGT-FINAL
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | TGT-AUTHORITY and TGT-EXECUTION exact revisions | completed, blocked, authority-change-required | T2 | Common Handoff from dev-handoff |
| OUTP-T2 | T2 | TGT-EVAL sealed case receipts and comparator results | completed, blocked, failed, transport-unavailable | T3 | Common Handoff from dev-handoff |
| OUTP-T3 | T3 | TGT-FINAL manifest plus TGT-PRESERVE equality evidence | completed, blocked, failed | dev-verification | Common Handoff from dev-handoff |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-AUTH | implementation-parent | Exact named authority conflict and unchanged D03, D04, D07, D22 budgets | all | New authority revision and approval when ownership, profile, repair or review budget, learning qualification, provider authority, or user-level guidance would change | Do not repair the authority change inside this plan |
| BLK-QUALITY | T2 | Named false approval, escaped seeded defect, accepted mutation, stale reuse, duplicate tail, cancelled-partial reuse, mixed-target aggregate, false advisory of an outcome-relevant defect, grant-hypothesis-only admission, or verifier-verdict substitution | T2, T3 | Current TGT-EVAL revision | Hard-quality counters are zero regardless of latency |
| BLK-HANDOFF-COLDSTART | T1 | Exact missing or stale reference that blocks cold-start consumption in OMP or Grok | T1, T2 | Narrow CONTRACT-HANDOFF to the smallest reference set that recovers; do not add a state service | Both harnesses consume a reference-only Handoff from current artifacts |
| BLK-GENUINE-PROOF | implementation-parent | Evidence that remaining cost is impacted semantic proof, incomplete same-lineage closure, or a causally evidenced repair regression required by ADR-0003 | all | No weakening of freshness, D22 classification, or incomplete-closure blocking | Stop rather than add machinery |
| BLK-REVIEW-ADMISSION | T1 | A later-slot disjoint outcome-relevant non-safety defect with direct D22 evidence | T1, T2 | Keep CHANGES REQUIRED and parent incomplete; return authority-change-required to the outcome authority; do not silently authorize same-outcome repair, restart verification, dispatch learning, approve, or complete | Named authority-change-required stop exists; D22 classification is unchanged |
| BLK-REVIEW-SAFETY | T1 | Evidence that a later-slot disjoint observation is independently serious safety | T1, T2 | Return separate-authority safety intake; never consume the parent repair set | Safety intake is named; same-outcome repair set is unchanged |
| BLK-TRANSPORT | T2 | Exact failed job or harness IDs after the existing two safe retries | T2 | No new retry budget or scheduler | Return transport-unavailable with those IDs |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-ADR0003 | adr | docs/adr/0003-bounded-assurance-and-repair.md D03, D04, D22 | Canonical independent proof, impact-map reuse, one-final-review authority, D22 classification, and later-slot policy |
| ANC-ADRINDEX | adr | docs/adr/INDEX.md ADR-0003 scope and affected-authority row; D03, D04, and D22 discovery descriptions | Project bounded repair admission, review-evidence reuse, predicate lineage, and closure/impact later passes |
| ANC-ADR0004 | adr | docs/adr/0004-canonical-discovery-and-continual-learning.md D07 | Canonical one terminal Standard assessment |
| ANC-WORKFLOW | skill | .config/agents/skills/dev-ask/WORKFLOW.md manifest binding, later-slot review selection, and Completion phase | Current executable composition for manifests, review-slot order, admission, and terminal accounting |
| ANC-ASK | skill | .config/agents/skills/dev-ask/SKILL.md blocker, advisory, and authority-conflict routing | Eligible same-lineage blockers continue same-outcome repair; disjoint outcome-relevant blockers return authority-change-required |
| ANC-IMPLEMENT | skill | .config/agents/skills/dev-implementation/SKILL.md smoke, repair dispatch, later-slot review order, and completion evidence | Backend projection for smoke, impacted proof, remaining lineages, admission, and receipt accounting |
| ANC-VERIFY | skill | .config/agents/skills/dev-verification/SKILL.md intake freshness and reuse clauses | Remove the duplicate same-outcome bullet and the unconditional-fresh reading |
| ANC-REVIEW | skill | .config/agents/skills/dev-code-review/SKILL.md original-initial, original-rerun, and grant-scoped passes | Keep whole-scope original-initial; later slots are closure and impact passes with unchanged D22 classification |
| ANC-HANDOFF | skill | .config/agents/skills/dev-handoff/SKILL.md Common Handoff | Make by-reference transport explicit enough to prevent state restatement |
| ANC-EVAL | script | .config/agents/skills/dev-ask/evals/compare_trace.py SHA-256 1f11e6a2ed7c0a0240d1e333be9c3d30528d229927aab2ac6f5dc984224337d6; scan_stale_contracts.py SHA-256 84c6fdcb202c1fea5a296589ec6ab7719d2ba61c70b94783c0d4ded7721dcf87; observe_case.py SHA-256 9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd unchanged | Existing bind, seal, mutation, comparator, and scanner oracle; no second schema. T2 adds the twelve new ANC-EVAL-CASES IDs to both scripts' ADDED_IDS; B-T4-REPAIR-REMAINING-BLOCKER remains in REWRITE_IDS; scanner PRESERVED drops the changing `dev-ask/SKILL.md` hash |
| ANC-LINEAGE | contract | Stable finding lineage fields | Identity is violated contract or invariant; trigger and expected/observed predicate; observable consumer or affected parent AC; causal boundary; finite current consumer/callsite map when the claim spans multiple consumers; originating target and evidence identity. Paths are evidence, not identity. |
| ANC-EVAL-CASES | eval | Exact T2 case identities | Existing consume/update: B-T4-REPAIR-REMAINING-BLOCKER at fixtures/b-t4-repair-remaining-blocker, retained only after the request records a causal edge from the FIND-2 repair to FIND-3; B-T4-REPAIR-CONSOLIDATED at fixtures/b-t4-repair-consolidated; B-REVIEW at fixtures/b-review; B-REVIEW-BEHAVIOR-BLOCKER-REPAIR at fixtures/b-review-behavior-blocker-repair; B-REVIEW-WORDING-ADVISORY at fixtures/b-review-wording-advisory; B-T5-COMPLETION-ASSURED at fixtures/b-t5-completion-assured; B-T5-COMPLETION-MISSING-ASSURANCE at fixtures/b-t5-completion-missing-assurance. New: B-ASSURANCE-REUSE-UNAFFECTED at fixtures/b-assurance-reuse-unaffected; B-ASSURANCE-REUSE-DRIFT at fixtures/b-assurance-reuse-drift; B-ASSURANCE-RECEIPT-COMPLETION at fixtures/b-assurance-receipt-completion; B-REVIEW-SET-RENAMED-CLOSURE at fixtures/b-review-set-renamed-closure; B-REVIEW-SET-IDENTITY-COLLISION at fixtures/b-review-set-identity-collision; B-REVIEW-SET-REPAIR-REGRESSION at fixtures/b-review-set-repair-regression; B-REVIEW-SET-GRANT-HYPOTHESIS-ONLY at fixtures/b-review-set-grant-hypothesis-only; B-REVIEW-SET-DISJOINT-ADVISORY at fixtures/b-review-set-disjoint-advisory; B-REVIEW-SET-DISJOINT-SAFETY at fixtures/b-review-set-disjoint-safety; B-REVIEW-SET-DISJOINT-OUTCOME at fixtures/b-review-set-disjoint-outcome; B-REVIEW-SET-POST-VERIFIED-BLOCKER at fixtures/b-review-set-post-verified-blocker; B-REVIEW-SET-AGGREGATE-VERDICT at fixtures/b-review-set-aggregate-verdict. |
| ANC-PRESERVE | path | Exact protected byte-equality targets | .config/agents/skills/dev-continual-learning/SKILL.md SHA-256 6a6ccfae27da7ac20412029757ed05d16b9ba63d43bd50e6f4331565cb54d105; .config/agents/skills/dev-implementation/scripts/executor_plan.py SHA-256 55f913edeb82bc5e48aa4264c5987e55a0bc1895c917aba60d1fbf02c213447c; .config/agents/rules/plan.md SHA-256 053627f116078f0144119b7e9b66b44360925469f0cde921cec832dfe615c9fd; .config/agents/rules/plan-impl-spec.md SHA-256 8f53958305b59b20cd19f5b16085afe232d8458d7f08451afc4b667ef2141be1; .config/agents/rules/plan-omp-transport.md SHA-256 df3a4c75c548770513dd738d4bb1fd95577b30d3eaf1c6d3b37c460bce2fb925; .config/agents/rules/plan-repo-storage.md SHA-256 cd537adc74d2908dc08e2c2e380568b9ca78cdaf292915bca28d620e0f898dbd; .config/agents/rules/plan-grok-transport.md SHA-256 6654a590d7f61a20e56b78b7e2c05c44c522b49cb3754c422a5422c904a91ef4; .config/agents/rules/papercut.md SHA-256 c16c0458a0d8561905b1b70b958fac970efbdde7ce3d2bbc7872bf856f97636d; .config/agents/skills/papercut/SKILL.md SHA-256 5a990e08d42a3a7fa83786f8c3b867db599b4b19032d08237c8d82a80341b91d; .config/agents/skills/papercut/WORKFLOW.md SHA-256 3cd6dc39396114cadc68c2d8c5bcf52e959a92d366f9c07aa362dc04a6d605b3; docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md SHA-256 1012162a94bdfd5a9b7f27eb6868f56927352dc39a2ae805cefac6a01317d506; .agents/papercuts.json SHA-256 c7a2b0741028aeb5692656b98f08908de828e9881379ecf7744bbf6879cfad44; .agents/AGENTS.md SHA-256 840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4; /Users/kim/.agents/AGENTS.md SHA-256 1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9; .config/agents/skills/dev-ask/evals/observe_case.py SHA-256 9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd. |
| ANC-SESSION | evidence | AUTH-SESSION JSONL SHA-256 33813f01dc0ddc1a414ad33d3e42c354ac63f47d8c02ac24d8c520af434fc0e1 | Diagnostic only. Implementation 2:55:44.858; gross tail 6:36:37.775; explicit pause 2:42:58.285; agent-active tail after excluding the pause-cancelled verifier 3:24:12.716. Two escaped defects forced required repair cycles; avoidable waste was unaffected replay, manifest rebuild, Handoff restatement, and post-learning recipe execution. |
| ANC-SESSION2 | evidence | AUTH-SESSION2 JSONL SHA-256 d018785f5b7e3ac8bedd7e403b62821dd4e8e83f8b92a8d3bf1ee9dc59056eae | Diagnostic only. Implementation 2:40:51.303. Gross tail from first verification through user stop 15:44:13.382. Human-wait across five ask-response intervals 9:16:39.090, of which first overnight wait 8:19:06.527 and four later Continue waits 0:57:32.563. Agent-active excluding all five waits 6:27:34.292. Do not label elapsed time after the first Continue as agent-active. Lineages: original-initial sealed candidate-revalidation, capability-count, source-upsert-classification, and successor-postvalidation. Incomplete same-lineage reports used new IDs for transaction-reduction, ready-null classification, canonical catalog count, aggregate recovery, and pending-base hash. Disjoint from that set but still mapped to frozen ACs: no-eligible-fallback and candidate-snapshot-terminal. The final human stop accepted residual risk in that session; it does not reclassify those mapped ACs as proof-ceremony. |
| ANC-PARSER | script | .config/agents/skills/dev-implementation/scripts/executor_plan.py | Structural publication and backend preflight; do not change it in this plan |

- ASM-IDENTITIES: The current Task Contract, Context Pack, Common Handoff, local artifacts, observer receipts, and comparator already provide sufficient identities. Fallback: narrow CONTRACT-HANDOFF; do not add a state service or compatibility alias.
- ASM-NO-CACHE: Current receipts do not bind a safe cross-run semantic cache class. Fallback: keep one fresh independent verifier attempt and consume its sealed receipts as review inputs, never as the review verdict.
- ASM-SESSION-PAUSE: Named AUTH-SESSION pause and AUTH-SESSION2 ask-response waits are human-wait, not workflow cost. Fallback: report gross, human-wait, and agent-active separately in diagnostic notes only.
- ASM-FINDING-SET: Later-slot lineage plus repair-admission prevent disjoint automatic same-outcome frontier expansion. They do not guarantee termination while Continue remains uncapped, because causal repair regressions can still form a chain. Fallback: disjoint outcome-relevant uses BLK-REVIEW-ADMISSION; independently serious safety uses BLK-REVIEW-SAFETY; do not demote a D22 blocker to advisory.
