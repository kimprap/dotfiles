# Keep assurance focused on parent acceptance

**Datetime**: 2026-08-17-1428
**Authority kind**: local-authority
**Mode**: high-consequence
**Scope**: Generic engineering review relevance, repair proof scope, terminal advisory handling, and the compact deferred-learning Handoff fixture
**Summary**: Make final review block only on evidenced outcome-relevant defects, keep repair verification bound to the unchanged parent acceptance set, and prevent wording-only advisories from restarting completed assurance. Correct the compact fixture collision without changing compact's no-verification, no-review, and no-learning boundary.
**Status**: DONE
**Completed At**: 2026-08-17-2334

## Objective

- Outcome: OUT-ASSURANCE-RELEVANCE-AND-PROOF-SCOPE
- Observable end state: Active review, verification, implementation, Handoff, routing, learning, workflow, ADR, and evaluation contracts agree that same-outcome blockers require direct evidence of a broken parent criterion or observable changed-contract consumer; repair preserves the parent acceptance set and reruns only causally impacted proof; wording-only advisories remain terminal; and `B-COMPACT-DEFERRED-LEARNING-CANDIDATE` emits the required worker Handoff and exact five-event compact trace without assurance or learning dispatch.
- Progress signal: One named `AC-CER-*` condition passes on the exact final target, one stable behavior-regression case distinguishes blocker from advisory or authority conflict, or one named `BLK-CER-*` closes with current authority and target evidence. Prose churn, changed-path count, generic suite success, another review, an unrelated fixture, or elapsed effort is not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-CER-USER | confirmed human decision evidence | `local://ceremony-assurance-decisions.md` | SHA-256 `1807037e24e66bba9fbdb99799153fcf01e045010c88fbfb9aab779475544b09` | Decisions 1 through 5 are approved planning authority; implementation still requires native approval of this plan's complete bytes and revision |
| AUTH-CER-RETRY | explicit human runtime correction | current conversation | `USER-CER-PLANNER-REMOVAL-20260817` | Retry plan creation after removal of the custom OMP/Grok planner persona; use current-session publication under ADR-0002 D08, not a dedicated planner fallback |
| AUTH-CER-D26 | active compact authority | `docs/adr/0001-dev-workflow-authority-and-routing.md` D26 | SHA-256 `0d5d82fef0a305ad51d5dd16775fb1184f83b457925eccad29f834c426c29f5b` | Preserve compact criterion-complete worker smoke and no verification, review, or continual-learning dispatch |
| AUTH-CER-D08 | active plan-publication authority | `docs/adr/0002-executor-plans-and-orchestration.md` D08 | SHA-256 `e355e2c97e4eee9478f6f21488c5412c58bfb3ece4b175f06aa5bcde66a1bad0` | The current parent/session owner may publish through the shared parser; no dedicated planner user-agent is part of the contract |
| AUTH-CER-D04-D22 | active assurance and review authority | `docs/adr/0003-bounded-assurance-and-repair.md` D04 and D22 | SHA-256 `cc78fd401e73de94d218b235a6cfe5f81e35e72aa215abb1ee2b8de113964488` | Refine only parent-proof selection, finding relevance, authority-conflict classification, and advisory completion; layer the new proof language onto current AC11; preserve the completed D03 recovery contract |
| AUTH-CER-WORKFLOW | active composition authority | `.config/agents/skills/dev-ask/WORKFLOW.md` | SHA-256 `e101101123f76ecd0720251b15d516707e4ea9ab050ec2040d83befa3e40df98` | Synchronize the confirmed boundaries without adding a lifecycle stage or route owner and without changing the landed Continue / Second opinion contract |
| AUTH-CER-COMPACT | active compact execution contract | `.config/agents/skills/dev-implementation/references/compact-checklist.md` items 8–9 and item 15's noncompact-checkpoint exclusion | SHA-256 `76ed562d2b8d34ab77877b6b9e213793d70f04a29c9f7027728e002efe1a8990` | Preserve one in-conversation Common Handoff, exact five-state compact order, and omission of verification, review, curation, opinion, and continual-learning dispatch |
| AUTH-CER-T6 | immutable initial-review evidence | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-16T09-24-23-205Z_01a009e2-f225-7000-9d97-18245b0f20a0/ReviewRestoredLiveR3.jsonl` | SHA-256 `09948b20ac329576758b96835ce4e2b2034334f1ce7d275de785d17566f8d68e` | Evidence that `FIND-RST-06-01` and `FIND-RST-06-02` originated from wording/alignment review after parent restore proof; read-only |
| AUTH-CER-T9 | immutable failed-proof evidence | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-16T09-24-23-205Z_01a009e2-f225-7000-9d97-18245b0f20a0/VerifyCorrectedSuccessorR4.jsonl` | SHA-256 `a8b6853368fae979c8e330ad5e4b66e909bb17a571aa3a0e433cd0f9a38eb00d` | Evidence that the compact fixture's Handoff contradiction expanded restore re-proof and produced `NOT VERIFIED`; read-only |
| AUTH-CER-RECOVERY | completed adjacent plan authority | `.agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md` | SHA-256 `512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375`; 42,655 bytes; `DONE`; `Completed At: 2026-08-17-1728`; final target `cf2179129763ca50c9648536ffc3ae2799fadcf5e25a241e4e62d68833b81de8` | Read-only exclusion and landed-contract base; keep the archive immutable and `.agents/plans/2026-08-17-0134_plan-rules-recovery-continuation.md` absent; do not revive the outcome or copy its D03 design |
| AUTH-CER-BASE | repository base and current user work | `/Users/kim/.dotfiles` | Git HEAD `9a57dd35040191b05738c82dbfb319708bfc7a20`; current unstaged planner-removal, completed-recovery, and other user changes described in TGT-CER-PRESERVE | Rebase from current bytes; preserve all unrelated and explicitly removed planner infrastructure; no staging or shipping |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-CEREMONY-01 | AUTH-CER-USER `1807037e...` decision 1 | A same-outcome blocker must show with direct behavioral or direct static evidence that an existing parent criterion or observable changed-contract consumer is broken. Changed paths, prose, metadata, frontmatter, scanner string equality, stale adjacent explanation, and self-referential consistency assertions alone are advisory. |
| DEC-CER-AUTHORITY-CONFLICT | AUTH-CER-USER `1807037e...` decision 1 | When current governing authority is contradictory enough that expected behavior is indeterminate, return `INCONCLUSIVE` to the authority owner; do not guess blocker or advisory status. |
| DEC-CEREMONY-02 | AUTH-CER-USER `1807037e...` decision 2 | Freeze the parent's acceptance IDs and proof recipes across same-outcome repair. Freshly prove impacted pre-existing criteria, explicitly reuse unaffected valid evidence through a causal impact map, and issue the repaired target's aggregate verdict over that unchanged set. |
| DEC-CEREMONY-03 | AUTH-CER-USER `1807037e...` decision 3; AUTH-CER-D26; AUTH-CER-COMPACT | Correct both copies of the compact fixture request to require the one in-conversation worker Common Handoff while still forbidding a curation task, curation Handoff, trigger screen, and continual-learning dispatch. Keep exactly `accepted -> ready -> running -> handed-off -> complete`. |
| DEC-CEREMONY-04 | AUTH-CER-USER `1807037e...` decision 4 | Wording-only advisories do not fail the parent or restart verification, review, or learning. The parent records residual risk, performs its one normal terminal learning assessment, and completes; elected cleanup starts a separately classified maintenance outcome with fresh state. |
| DEC-CEREMONY-05 | AUTH-CER-USER `1807037e...` decision 5; AUTH-CER-RECOVERY | Completed `OUT-PLAN-RECOVERY` exclusively owns the landed D03 token, attempt, checkpoint, grant/opinion, same-plan continuation, and review-budget policy. This outcome layers no replacement, weakening, or duplicate. |
| DEC-CER-PUBLISHER | AUTH-CER-RETRY; AUTH-CER-D08 | Publish this plan from the current OMP plan-mode session through the existing local-authority/parser/native-review path. Do not restore or emulate the removed custom planner persona. |
| DEC-CER-ASSURANCE | AUTH-CER-USER; AUTH-CER-D04-D22 | Use high-consequence assurance because this changes generic review and verification authority. Use one shared sequential implementation lineage, one final independent verification of this parent's criteria, one final review, and one terminal Standard learning assessment; no per-task independent proof. |
| DEC-CER-NO-SHIP | AUTH-CER-USER; AUTH-CER-BASE | No staging, commit, push, review request, release, deployment, bootstrap execution, or external mutation. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-CER-USER through AUTH-CER-BASE; current review, verification, implementation, Handoff, router, continual-learning, workflow, ADR-0001 D26, ADR-0002 D08, ADR-0003 D03/D04/D22, ADR index, compact checklist items 8–9 and 15, completed recovery archive and absent active twin, recovery-owned registry entries and fixtures, stale-contract scanner, evaluation registry, observer/comparator contracts, the named compact fixture, and exact current Git/user-work state.
- Change surfaces: Exactly the existing T1 and T2 paths in the Target map plus the four explicitly absent T2 fixture files. This plan's local-authority lifecycle and managed projection may change only through the plan transport.
- Non-goals: No change to compact assurance behavior; no change to D03 repair counts, checkpoint eligibility, exact exhaustion record, grant/opinion monotonicity, same-plan continuation, semantic-attempt ceilings, original-review precedence, plan/task schema, orchestration, todo phases, transport, storage, parser, comparison/observation tools, solution discipline, product behavior, or shipping. No restoration or replacement of the removed planner persona, projections, profile, transport scripts, tests, or bootstrap entries.
- Prohibited effects: Do not edit ADR-0001 or ADR-0002, ADR-0003 D03, the compact checklist, plan rules, executor-plan parser/tests, compare/observe tools, the completed recovery archive, archived restore/lean/residual outcomes, either AGENTS.md, `.agents/papercuts.json`, Atlas files, `.config/scripts/bootstrap`, Git metadata, or any removed planner path; do not recreate the recovery plan's active twin. Do not mutate registry entries `B-RETRY`, `B-T4-REPAIR-REMAINING-BLOCKER`, `B-RETRY-STANDARD`, `B-RETRY-HIGH-CONSEQUENCE`, or `B-T4-REPAIR-CONSOLIDATED`, any of their five fixture files, their scanner memberships, or scanner `PRESERVED`. Do not treat scanner/static success, the known `ADV-REC-01` failure, fixture presence, or wording equality as autonomous acceptance. Do not add an alias, compatibility path, lifecycle skill, state machine, recovery token, or dedicated maintenance dispatch.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-CER-POLICY | repository configuration and active ADR/index writes | AUTH-CER-USER | T1 may modify only its nine exact existing targets from their bound current bytes; ordinary file reversion remains possible before delivery |
| EFF-CER-EVAL | repository evaluation registry/scanner/fixture writes | AUTH-CER-USER | T2 may change only the existing compact registry entry and fixture, add the four named registry entries and fixture files, and add their authorized scanner IDs/needles; no recovery case/fixture, scanner `PRESERVED` entry, comparator/observer, or unrelated case change |
| EFF-CER-PLAN | local-authority lifecycle and managed projection | AUTH-CER-RETRY under `rule://plan` and `rule://plan-omp-transport` | Create/update only `local://assurance-relevance-and-proof-scope-plan.md` and its automatic exact projection for planning/lifecycle state |
| EFF-CER-PRESERVE | prohibited mutation | AUTH-CER-BASE; AUTH-CER-RECOVERY | User planner removals, bootstrap/ADR-0002 edits, the completed recovery archive, active-twin absence, landed D03 clauses, five recovery registry objects/fixtures/memberships, scanner `PRESERVED`, `.agents/papercuts.json`, frozen outcomes, unrelated files, Git state, and external state remain unchanged |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-CER-REVIEW-RELEVANCE | Blocker/advisory/authority-conflict classification requires outcome relevance and direct evidence; wording/string/path drift alone cannot block | T1 | AUTH-CER-USER `1807037e...` decision 1 | T1, T2 |
| CONTRACT-CER-REPAIR-PROOF | Same-outcome repair keeps one immutable parent acceptance/proof set; impact map selects fresh impacted proof versus explicit unaffected-evidence reuse; aggregate verdict covers the unchanged set | T1 | AUTH-CER-USER `1807037e...` decision 2 | T1, T2 |
| CONTRACT-CER-ADVISORY-TAIL | Advisories are terminal residual risk; parent completes its normal tail once; elected cleanup is a new maintenance outcome with fresh authority and state | T1 | AUTH-CER-USER `1807037e...` decision 4 | T1, T2 |
| CONTRACT-CER-COMPACT-FIXTURE | The byte-identical registry and fixture requests require one worker Common Handoff and forbid a curation task, curation Handoff, trigger screen, and `dev-continual-learning` dispatch; the event order remains exact five-state equality with no verification or review | T2 | AUTH-CER-USER `1807037e...` decision 3 | T2 |
| CONTRACT-CER-RECOVERY-EXCLUSION | Completed `OUT-PLAN-RECOVERY` and active D03 exclusively own token, attempt, checkpoint, exact eight-line record, grant/opinion monotonicity, same-plan continuation, and original-initial → original-rerun → grant-scoped review order. Relevance and impact-map data lives in the Task Contract, Common Handoff, and evidence index, never in that record; this outcome neither changes nor copies the landed contract | T1 | AUTH-CER-USER `1807037e...` decision 5; AUTH-CER-RECOVERY `512b2934...` | T1, T2 |
| CONTRACT-CER-USER-WORK | Current planner-persona removal and associated modified/deleted repository bytes remain the user's work and are preserved through every task and assurance pass | T1 | AUTH-CER-RETRY; AUTH-CER-BASE | T1, T2 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-CER-REVIEW | `.config/agents/skills/dev-code-review/SKILL.md` finding procedure/policy, verdict, Handoff, and stop clauses around the landed review-slot/grant intake | T1 | SHA-256 `e1a60e43eed4ca1f28bf3921a8d7175dda46a3510544b8ed301806f2d10d9c36` | backend review dispatch; review Handoff; three new backend cases | AC-CER-01, AC-CER-03, AC-CER-04, AC-CER-05 |
| TGT-CER-VERIFY | `.config/agents/skills/dev-verification/SKILL.md` repair intake, criterion coverage, evidence reuse, verdict, and Handoff clauses | T1 | SHA-256 `1590918c008aa2c25865d3cf78ce8ee43df548ab9d83c5dfa4948e663b953b4f` | backend verification dispatch; behavior-blocker repair case | AC-CER-02, AC-CER-05 |
| TGT-CER-BACKEND | `.config/agents/skills/dev-implementation/SKILL.md` Task Contract immutability, review admission, post-assurance impact proof, advisory completion, and evidence index around the landed D03 state/checkpoint contract | T1 | SHA-256 `7aa417e794e96e85f607783f70b751c2798477d3b3cd2d74ab426298f5c8f9d3`; includes current planner-removal and completed-recovery edits | verifier/reviewer/curator scheduling; all new cases | AC-CER-01, AC-CER-02, AC-CER-03, AC-CER-04, AC-CER-05 |
| TGT-CER-HANDOFF | `.config/agents/skills/dev-handoff/SKILL.md` repair closure and assurance impact-map payload around the landed newest-record pointer and same-plan resume fields | T1 | SHA-256 `3b066c134211494caf2ac9657e3a61fcc83016935deda25325b9971c4a19254b` | worker, verifier, reviewer, backend Handoffs | AC-CER-02, AC-CER-05 |
| TGT-CER-ROUTER | `.config/agents/skills/dev-ask/SKILL.md` known-fix classification and advisory-maintenance recomputation | T1 | SHA-256 `2262d84987d340c85994a3b077d77f520c2b958574c3a7808ea2a5466b716a96` | `R-REVIEW-ADVISORY-MAINTENANCE` | AC-CER-03, AC-CER-05 |
| TGT-CER-WORKFLOW | `.config/agents/skills/dev-ask/WORKFLOW.md` review relevance, fixed parent proof, advisory tail, and separate-maintenance composition around the landed Continue / Second opinion paragraphs | T1 | SHA-256 `e101101123f76ecd0720251b15d516707e4ea9ab050ec2040d83befa3e40df98` | all lifecycle skills and evals | AC-CER-01, AC-CER-02, AC-CER-03, AC-CER-04, AC-CER-05 |
| TGT-CER-LEARNING | `.config/agents/skills/dev-continual-learning/SKILL.md` same-parent treatment of review advisories | T1 | SHA-256 `8be68564b3a852c0ddb488cd725829b821c62ab583d2ce52657793dd08d2a600` | terminal Standard assessment; advisory cases | AC-CER-03, AC-CER-05 |
| TGT-CER-ADR3 | `docs/adr/0003-bounded-assurance-and-repair.md` D04/D22, consequences, affected contracts, Human authority, AC10, additive AC11 proof language, and identity/role fixture expectations | T1 | SHA-256 `cc78fd401e73de94d218b235a6cfe5f81e35e72aa215abb1ee2b8de113964488`; current D03 section and AC11 recovery tail remain excluded from rewrite | active assurance consumers and index | AC-CER-01, AC-CER-02, AC-CER-03, AC-CER-04, AC-CER-05 |
| TGT-CER-INDEX | `docs/adr/INDEX.md` ADR-0003 and D04/D22 discovery summaries only | T1 | SHA-256 `c5cd57e3eab65c65ebd54bd271afa3353762bdbf06155f310abbd0ba4405e9f2`; includes current user ADR-0002 index edits | decision discovery | AC-CER-05 |
| TGT-CER-EVALS | `.config/agents/skills/dev-ask/evals/evals.json` existing compact case plus four new exact cases; five recovery-owned complete case objects and their fixtures remain frozen | T2 | SHA-256 `92040a5db031933bfb52bf9d76f16071ff1be5047734eb4a0f2f21df2275517d` | observer/comparator; named fixture directories; frozen recovery identity map below | AC-CER-06, AC-CER-07 |
| TGT-CER-SCANNER | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` changed-case inventory and required/stale executable contract checks | T2 | SHA-256 `061f1f5d290392d44cf76847cc150b9abc7846e075e7f2d638df2ef2749de204`; includes current user planner-removal checks | active skill/ADR/workflow paths; eval registry | AC-CER-07 |
| TGT-CER-COMPACT-CASE | `.config/agents/skills/dev-ask/evals/fixtures/b-compact-deferred-learning-candidate/case.json` `inputs.request` plus `scripted_replies` parity with the registry | T2 | SHA-256 `7820e8f03d4c6d3772c6738cd224fdd8cfbe02ec838d01eac73562e3d4b8bd02` | `B-COMPACT-DEFERRED-LEARNING-CANDIDATE` | AC-CER-06 |
| TGT-CER-WORDING-CASE | `.config/agents/skills/dev-ask/evals/fixtures/b-review-wording-advisory/case.json` | T2 | absent; new regular UTF-8 JSON fixture | `B-REVIEW-WORDING-ADVISORY` | AC-CER-07 |
| TGT-CER-BEHAVIOR-CASE | `.config/agents/skills/dev-ask/evals/fixtures/b-review-behavior-blocker-repair/case.json` | T2 | absent; new regular UTF-8 JSON fixture | `B-REVIEW-BEHAVIOR-BLOCKER-REPAIR` | AC-CER-07 |
| TGT-CER-CONFLICT-CASE | `.config/agents/skills/dev-ask/evals/fixtures/b-review-authority-conflict/case.json` | T2 | absent; new regular UTF-8 JSON fixture | `B-REVIEW-AUTHORITY-CONFLICT` | AC-CER-07 |
| TGT-CER-MAINTENANCE-CASE | `.config/agents/skills/dev-ask/evals/fixtures/r-review-advisory-maintenance/case.json` | T2 | absent; new regular UTF-8 JSON fixture | `R-REVIEW-ADVISORY-MAINTENANCE` | AC-CER-07 |
| TGT-CER-PRESERVE | AUTH-CER-RECOVERY archive and active-twin absence; landed D03 segments in implementation/review/Handoff/WORKFLOW/ADR AC11; recovery-owned registry entries and fixtures; archived restore/lean/residual plans; ADR-0001/0002; compact checklist; plan rules/transports/parser/tests; compare/observe tools; scanner `PRESERVED`; `.agents/papercuts.json`; `.config/scripts/bootstrap`; deleted planner persona/projections/profile/transport scripts/tests; both AGENTS.md files; Atlas; Git index/HEAD/staging | T2 | Recovery archive `512b2934...`, 42,655 bytes, `DONE`, active twin absent, final target `cf217912...`; D03 segment hashes in T1 smoke; frozen registry/fixture identities below; ADR-0001 `0d5d82fe...`; ADR-0002 `e355e2c9...`; compact checklist `76ed562d...`; papercuts ledger `7149beae...`; bootstrap `4a7c48c...`; planner paths intentionally `D`; Git HEAD `9a57dd35...`; staging empty at rebind | pre-mutation, per-task, and final changed-path/identity checks | AC-CER-08 |

Frozen recovery-regression identities:

| Case ID | Canonical registry-object SHA-256 | Exact fixture path | Fixture SHA-256 | Scanner membership |
|---|---|---|---|---|
| `B-RETRY` | `125e9cc1edb3db0c051190d08b18614d11f49ea1b7f203b8af297c5a51232256` | `.config/agents/skills/dev-ask/evals/fixtures/b-retry/case.json` | `d60ccd84477a55da4296b3fb9d1e74976675e7fd1e4e77b06b6d077a72cd7f79` | `REWRITE_IDS` |
| `B-RETRY-STANDARD` | `7cdd7a0c4e11b4fea3b60e7997ee0851c0378329b6d7fcc1d2729575adcf2c1c` | `.config/agents/skills/dev-ask/evals/fixtures/b-retry-standard/case.json` | `640d8c4ad2701fdc9feecf55836addc5b65452b945432d7772223fa8cf1f5f98` | `ADDED_IDS` |
| `B-RETRY-HIGH-CONSEQUENCE` | `204cc900a656b3999165a66c259f5225a1e6ce19c5a04329923669826f8c8177` | `.config/agents/skills/dev-ask/evals/fixtures/b-retry-high-consequence/case.json` | `6b1fa457048ac362cb1562e51dde35ae78901474cb59f1cd0c1dd016ee1f7601` | `ADDED_IDS` |
| `B-T4-REPAIR-CONSOLIDATED` | `6c7fc8028b998e26fd48b2dc8d5e7e416675035ae8dfeba380daaf1d9b07099a` | `.config/agents/skills/dev-ask/evals/fixtures/b-t4-repair-consolidated/case.json` | `2d0b196a6638fc8740a4c5b9733e64f2f334d2aa5e894ef8cb2e1767d7b01a98` | `REWRITE_IDS` |
| `B-T4-REPAIR-REMAINING-BLOCKER` | `5e32e832b7b96cf485bf0f3214d5ea394f3e9f2519d4b2523247ac162c4c2bb6` | `.config/agents/skills/dev-ask/evals/fixtures/b-t4-repair-remaining-blocker/case.json` | `4f64c0fa1dfbecba87125543931d93eefefc6282c547594565d595c2de2fc35b` | `REWRITE_IDS` |


## Execution policy

- Assurance: `high-consequence`.
- Topology: one-owner
- Max concurrency: 1
- Isolation: current dotfiles worktree; no isolated lineage and no external workspace mutation.
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: `OUT-PLAN-RECOVERY` is terminal, not concurrent work. Immediately before T1 and before every shared-path mutation, recheck the archived AUTH-CER-RECOVERY digest/status/completion time, active-twin absence, every landed D03 preservation anchor, and every target base identity. Archive drift, active-path reappearance, D03 drift, or any shared-base mismatch stops before mutation with `authority-change-required` and requires a same-identity plan rebind. Never execute or revive the recovery outcome, edit its archive, reverse its changes, or copy its policy into this outcome.
- Decomposition: T1 owns the complete canonical policy cutover; T2 owns executable cases and scanner convergence. Each is one bounded vertical task; no child delegation and no lifecycle-only task.
- Effect limit: EFF-CER-POLICY, EFF-CER-EVAL, EFF-CER-PLAN, and EFF-CER-PRESERVE only.
- Orchestrator profile: not required for one-owner sequential execution. ADR-0002 D08 authorizes current-session plan publication and expressly excludes a dedicated planner user-agent from the contract.
- Assurance boundary: T1 performs clause-only worker smoke. T2 performs five exact-target receipt-backed worker-smoke cases and one Common Handoff, but no worker may execute or claim a `VR-CER-*` verdict. After OUTP-CER-T2 freezes the final shared target, one fresh independent `dev-verification` pass executes VR-CER-01 through VR-CER-08 exactly once with distinct roots and attempt identities; within that pass each of the five cases is observed once, shared receipts are consumed by later aggregate recipes without re-observation, and worker conclusions are not reused as proof.
- Post-T2 lifecycle tail: Only the aggregate `VERIFIED` verdict schedules one final read-only `dev-code-review` pass. Only a settled reviewed target schedules one terminal Standard `dev-continual-learning` assessment, after which `dev-ask` presents completion. Review and learning are high-consequence route owners, not implementation tasks, parent acceptance owners, or proof recipes: add no T3, T4, lifecycle output, `AC-CER-*`, or `VR-CER-*` for them. No per-task independent proof, second verifier pass, pre-VERIFIED review, second final review, second terminal assessment, unrelated eval sweep, restore re-proof, or additional checkpoint is scheduled.

## Tasks

- [x] T1. Bind outcome-relevant review and fixed parent proof
  completed 2026-08-17-2145
  - Owner: dev-implementation worker
  - Wave: W0
  - Depends on: none
  - Targets: TGT-CER-REVIEW, TGT-CER-VERIFY, TGT-CER-BACKEND, TGT-CER-HANDOFF, TGT-CER-ROUTER, TGT-CER-WORKFLOW, TGT-CER-LEARNING, TGT-CER-ADR3, TGT-CER-INDEX
  - Contracts: CONTRACT-CER-REVIEW-RELEVANCE, CONTRACT-CER-REPAIR-PROOF, CONTRACT-CER-ADVISORY-TAIL, CONTRACT-CER-RECOVERY-EXCLUSION, CONTRACT-CER-USER-WORK
  - Criteria: AC-CER-01, AC-CER-02, AC-CER-03, AC-CER-04, AC-CER-05
  - Effects: EFF-CER-POLICY, EFF-CER-PLAN, EFF-CER-PRESERVE
  - Output: OUTP-CER-T1
  - Receiver: T2
  - Verification: VR-CER-01, VR-CER-02, VR-CER-03, VR-CER-04, VR-CER-05
  - Lineage: shared
- [x] T2. Add relevance fixtures and correct compact Handoff
  completed 2026-08-17-2207
  - Owner: dev-implementation worker
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-CER-EVALS, TGT-CER-SCANNER, TGT-CER-COMPACT-CASE, TGT-CER-WORDING-CASE, TGT-CER-BEHAVIOR-CASE, TGT-CER-CONFLICT-CASE, TGT-CER-MAINTENANCE-CASE, TGT-CER-PRESERVE
  - Contracts: CONTRACT-CER-REVIEW-RELEVANCE, CONTRACT-CER-REPAIR-PROOF, CONTRACT-CER-ADVISORY-TAIL, CONTRACT-CER-COMPACT-FIXTURE, CONTRACT-CER-RECOVERY-EXCLUSION, CONTRACT-CER-USER-WORK
  - Criteria: AC-CER-06, AC-CER-07, AC-CER-08
  - Effects: EFF-CER-EVAL, EFF-CER-PRESERVE
  - Output: OUTP-CER-T2
  - Receiver: dev-verification
  - Verification: VR-CER-06, VR-CER-07, VR-CER-08
  - Lineage: shared

### T1 Implementation

T1 is a clean policy-contract cutover on the nine existing T1 targets. It changes and worker-smokes clauses only. It does not create, bind, execute, or claim any of the five T2 fixtures; it does not run independent verification; and its Handoff leaves AC-CER-01 through AC-CER-05 pending for the one post-T2 verifier.

Before the first T1 write, snapshot and assert all nine bound T1 base hashes, the five protected landed-D03 segment hashes used by the post-edit body below, the full archive/checklist/papercut hashes, and active-recovery-twin absence. Record that preflight in OUTP-CER-T1. Any mismatch stops before mutation with `authority-change-required`; it is never repaired by retyping, restoring, or normalizing the protected bytes.

Project these nine exact normative sentences without weaker local variants:

1. `A same-outcome blocking finding requires direct behavioral or direct static evidence that an existing parent AC-... or an observable changed-contract consumer is broken.`
2. `Changed paths, prose, metadata, frontmatter, scanner-string equality, stale adjacent explanation, and self-referential consistency assertions alone are advisory.`
3. `When contradictory current governing authority makes expected behavior indeterminate, return INCONCLUSIVE to the authority owner without classifying a blocker or advisory, authorizing repair, or completing.`
4. `For same-outcome noncompact repair, freeze the parent acceptance IDs and proof recipes; a complete causal impact map marks every pre-existing criterion impacted or unaffected, reruns impacted proof fresh, and computes the repaired target's aggregate verdict over that unchanged parent set.`
5. `Reuse unaffected evidence only when the map proves no causal path from the repair and the criterion's target surface, environment, expectation, proof method, fixture and dependency identities, and evidence integrity remain valid; otherwise rerun it fresh.`
6. `A wording-only advisory is terminal residual risk: it does not fail the parent or restart verification, review, or learning, and the parent performs its one already-required terminal Standard assessment before completion.`
7. `If cleanup is later elected, dev-ask classifies a new maintenance outcome with fresh authority, acceptance, Task Contract, target, attempts, and assurance; no parent repair, verification, review, or learning state is inherited.`
8. `For a same-outcome repair, carry the unchanged parent acceptance and proof-recipe identities, the complete criterion impact map, every fresh impacted result, every reused unaffected evidence identity and validity basis, and the repaired aggregate verdict.`
9. `outcome-relevant final review, fixed parent repair proof, terminal advisories, and separate maintenance`

Apply them at these existing seams:

| Target | Exact implementation seam |
|---|---|
| `.config/agents/skills/dev-code-review/SKILL.md` | Extend `## Intake` authority-conflict rejection; rewrite `## Procedure` items 5–7 and the first two `## Finding policy` paragraphs around sentences 1–3 and 6; make both-axis PASS yield Overall `APPROVED` with terminal advisories; allow a blocker to map to affected parent `AC-...` IDs or `none` plus its exact fixed contract/observable consumer in `## Review Handoff`; route eligible blockers to the backend, authority conflicts to the authority owner, and approved advisories to the already-scheduled backend tail in `## Stop and next owner`. Review never schedules repair, maintenance, learning, or shipping. Preserve the pre-`## Intake` profile/review-budget paragraph and original-initial → original-rerun → grant-scoped admission order byte-exact. |
| `.config/agents/skills/dev-verification/SKILL.md` | Extend `## Intake`, `## Procedure` items 2–7, `## Verification Handoff`, `## Required and skippable coverage`, and `## Stop and next owner` around sentences 4–5. Require the frozen pre-repair parent acceptance/proof identity and an every-criterion impact map; reject added, removed, or semantically changed parent criteria/proof recipes as `INCONCLUSIVE`; run impacted entries fresh; validate each unaffected reuse; and emit every criterion verdict plus one repaired-target aggregate over exactly the frozen set. A review finding or consumer not already a parent criterion is not promoted into a verifier-owned `AC-...`. |
| `.config/agents/skills/dev-implementation/SKILL.md` | Extend `## Task Contract` outcome/acceptance/verification fields and immutability paragraphs with the frozen parent snapshot and repair-only impact map; update ready-frontier items 5, 7, 9, and 10; update consolidated post-assurance repair items 2 and 5 only around finding relevance and causal proof; and extend completion evidence/index. Only sentence-1-eligible blockers enter repair. An authority conflict never does. Repair schedules impacted smoke/proof, explicit unaffected reuse, and the already-eligible review boundary without synthesizing a criterion. Consumer-only findings remain repair-smoke and fresh-review obligations. Advisory-only approval bypasses repair, continues the one route-scheduled terminal assessment, and completes. Keep consolidated-repair items 6–12, the exact eight-line exhaustion record, monotonic transitions, same-plan resume, and original-review precedence byte-exact; add impact-map data outside those D03-owned clauses and record. |
| `.config/agents/skills/dev-handoff/SKILL.md` | Extend Intake, Procedure items 3–6, Common Handoff Progress, role payloads, non-success payload, and Stop/next-owner clauses. Project sentence 8 once and carry every criterion's impacted/unaffected classification; causal path/fixture/consumer; fresh/reuse action; eligible blocker mapping or exact authority conflict; and terminal advisories. A consumer-only finding may carry `affected AC: none` plus its fixed contract/consumer. Preserve the current newest-record pointer, grant/opinion state, same-plan resume, and non-success continuation fields byte-exact; place impact-map payload outside the exact D03 exhaustion record and do not add a sidecar. |
| `.config/agents/skills/dev-ask/SKILL.md` | Replace the broad proof/review-finding branch in classification item 5: only an eligible directly evidenced blocker continues to bounded repair; advisory leaves the approved parent route unchanged; indeterminate authority returns to its owner. Extend item 7, Direct implementation lane, route-scheduling paragraph, Dispatch/Handoff, and Completion/stops with sentence 7 and the rule that later cleanup is a fresh maintenance outcome. |
| `.config/agents/skills/dev-ask/WORKFLOW.md` | Update the Engine reference known-fix row, route-scheduling paragraph, Assurance todo phase, diagnosis/review paragraph, and terminal-learning paragraph with sentences 1–7. Add the revised parent-proof/relevance composition outside the protected landed-D03 checkpoint, Continue / Second opinion, record, and same-plan continuation region. Add no owner, phase, state machine, approval gate, lifecycle stage, or duplicate recovery mechanism. |
| `.config/agents/skills/dev-continual-learning/SKILL.md` | In `### Standard`, Procedure items 1–2, and Stop/next owner, treat review advisories as residual input to the one already-scheduled assessment, not as candidate or mutation authority. A write remains eligible only through the existing independently qualified backend-frozen Evaluation contract; otherwise record the advisory under `Skipped`/`NO DURABLE LEARNING`. Never edit the reviewed target, schedule assurance replay, or dispatch elected maintenance. |
| `docs/adr/0003-bounded-assurance-and-repair.md` | Extend D04 Decision/Why/Consequences/Reopen with sentences 4–5. Extend D22 Decision/Consequences/Reopen with sentences 1–3 and 6–7 while preserving one review, six complexity tags, causal no-effect boundaries, serious-safety intake, one Handoff, and no shipping. Add router and continual-learning to Affected contracts; project AUTH-CER-USER decisions 1–5 in Human authority; refine AC10 and add frozen-parent/impact-map proof to AC11 without deleting, reordering, or weakening its existing recovery sentence; refine the identity/role fixture line. Do not edit D03. |
| `docs/adr/INDEX.md` | Change only the ADR-0003 row and D04/D22 discovery rows; include sentence 9 once and additionally name causal impact selection, valid evidence reuse, and authority conflict. Preserve every ADR-0002/index planner-removal byte outside those cells. |

T1 worker smoke is clause placement and preservation only. After all nine target edits, run this exact standard-library body through the Python Eval tool from the repository root:

```python
import hashlib
from pathlib import Path

def file_sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def segment_sha256(path, start, end):
    text = Path(path).read_text(encoding="utf-8")
    left = text.index(start)
    right = text.index(end, left)
    return hashlib.sha256(text[left:right].encode("utf-8")).hexdigest()

checks = {
    ".config/agents/skills/dev-code-review/SKILL.md": "A same-outcome blocking finding requires direct behavioral or direct static evidence that an existing parent AC-... or an observable changed-contract consumer is broken.",
    ".config/agents/skills/dev-verification/SKILL.md": "For same-outcome noncompact repair, freeze the parent acceptance IDs and proof recipes; a complete causal impact map marks every pre-existing criterion impacted or unaffected, reruns impacted proof fresh, and computes the repaired target's aggregate verdict over that unchanged parent set.",
    ".config/agents/skills/dev-implementation/SKILL.md": "A wording-only advisory is terminal residual risk: it does not fail the parent or restart verification, review, or learning, and the parent performs its one already-required terminal Standard assessment before completion.",
    ".config/agents/skills/dev-handoff/SKILL.md": "For a same-outcome repair, carry the unchanged parent acceptance and proof-recipe identities, the complete criterion impact map, every fresh impacted result, every reused unaffected evidence identity and validity basis, and the repaired aggregate verdict.",
    ".config/agents/skills/dev-ask/SKILL.md": "If cleanup is later elected, dev-ask classifies a new maintenance outcome with fresh authority, acceptance, Task Contract, target, attempts, and assurance; no parent repair, verification, review, or learning state is inherited.",
    ".config/agents/skills/dev-ask/WORKFLOW.md": "Changed paths, prose, metadata, frontmatter, scanner-string equality, stale adjacent explanation, and self-referential consistency assertions alone are advisory.",
    ".config/agents/skills/dev-continual-learning/SKILL.md": "A wording-only advisory is terminal residual risk: it does not fail the parent or restart verification, review, or learning, and the parent performs its one already-required terminal Standard assessment before completion.",
    "docs/adr/0003-bounded-assurance-and-repair.md": "When contradictory current governing authority makes expected behavior indeterminate, return INCONCLUSIVE to the authority owner without classifying a blocker or advisory, authorizing repair, or completing.",
    "docs/adr/INDEX.md": "outcome-relevant final review, fixed parent repair proof, terminal advisories, and separate maintenance",
}
for path, clause in checks.items():
    text = Path(path).read_text(encoding="utf-8")
    count = text.count(clause)
    assert count == 1, (path, count, clause)

protected_segments = {
    "backend-items-6-12-and-record": (".config/agents/skills/dev-implementation/SKILL.md", "6. Compact stops with exact deduplicated evidence", "On an upstream failure or shared-assumption break:", "988d618331da951af528a49ed1096a5f4fe9c4f26e06bb30f65e206bda737422"),
    "workflow-d03-composition": (".config/agents/skills/dev-ask/WORKFLOW.md", "After a standard/high-consequence evidence pass", "Executable workflow evaluations bind", "cc5bc006227d929407e2bdc1ea35d488fa39cb63a345a4c19beca788613f209e"),
    "adr3-d03": ("docs/adr/0003-bounded-assurance-and-repair.md", "### D03 — Post-assurance repair", "### D04 — Assurance boundaries", "1ba441720c21ff8cf89b9abb1687b1beea8e6d2addafc6d2d8c3117246581f88"),
    "handoff-record-pointer": (".config/agents/skills/dev-handoff/SKILL.md", "- Newest same-plan exhaustion record:", "- Impacted smoke/verification/review reruns required or observed", "9f38491924a7fdf9f73029d8d828ac8703b90a428dc69706453e6841ed507fdf"),
    "review-budget-owner": (".config/agents/skills/dev-code-review/SKILL.md", "Own one read-only Standards and Specification verdict", "## Intake", "e4416e8f0c9c0e3f8b484bd1f0dffdd87e6f3496c8cf9cc5d70b4a2087b4537f"),
}
for label, (path, start, end, expected) in protected_segments.items():
    observed = segment_sha256(path, start, end)
    assert observed == expected, (label, observed, expected)

implementation = Path(".config/agents/skills/dev-implementation/SKILL.md").read_text(encoding="utf-8")
review_order = "then select review in this order: the original initial review if still `not run`; otherwise the original review rerun if still `unused`; otherwise one review pass bound to the current grant identity only when both original slots were already consumed before that granted cycle. A grant never restores or relabels an original counter."
assert implementation.count(review_order) == 1
adr3 = Path("docs/adr/0003-bounded-assurance-and-repair.md").read_text(encoding="utf-8")
for clause in (
    "consumes an unused original initial review before the unused original rerun and either before a grant-scoped review",
    "persists and emits the exact eight-line newest-record checkpoint before same-plan Continue or Second opinion",
    "Only grant/opinion transition monotonically; pending, stale, or opinion-incomplete state blocks.",
):
    assert adr3.count(clause) == 1, clause

archive = ".agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md"
assert file_sha256(archive) == "512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375"
archive_text = Path(archive).read_text(encoding="utf-8")
assert "**Status**: DONE" in archive_text
assert "**Completed At**: 2026-08-17-1728" in archive_text
assert not Path(".agents/plans/2026-08-17-0134_plan-rules-recovery-continuation.md").exists()
assert file_sha256(".config/agents/skills/dev-implementation/references/compact-checklist.md") == "76ed562d2b8d34ab77877b6b9e213793d70f04a29c9f7027728e002efe1a8990"
assert file_sha256(".agents/papercuts.json") == "7149beaed07fffbb41cd339399b6bb6d6fd1020accd11ddcb0277060d92ad901"
print("T1-WORKER-SMOKE status=pass files=9 clauses=9 d03_segments=5 archive=done active_recovery=absent")
```

Record the nine output SHA-256 identities, the clause-to-decision map, and preserved-target identity map in OUTP-CER-T1. The Common Handoff must state `AC-CER-01..05 pending independent proof`, `fixture observations: none`, and `verifier verdict: none`.

Do not edit or duplicate the completed ADR-0003 D03 contract; ADR-0001 D26; `.agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md` / `OUT-PLAN-RECOVERY`; the absent active recovery twin; frozen recovery registry cases/fixtures; frozen restore/lean/residual outcomes; the compact checklist; scanner `PRESERVED`; `.agents/papercuts.json`; plan rules/transports/parser/tests; compare/observe tools; current planner-persona removals, projections, profile, transport scripts/tests, bootstrap entries, or ADR-0002/index planner-removal work. Do not stage, commit, push, ship, or create a replacement planner path.

### T2 Implementation

T2 starts only from completed OUTP-CER-T1, rechecks every bound base and preservation identity, creates/rebinds the five exact evaluation pairs below, updates scanner discovery, and worker-smokes only those five cases. T2 does not claim a `VR-CER-*` verdict. Its receipts are worker evidence and cannot be reused as the independent verifier's behavioral conclusion.

Before any T2 write, snapshot each complete frozen recovery registry object, all five frozen fixture hashes, the five scanner memberships, and the canonical `PRESERVED` mapping hash from the identity table above. After every registry/scanner/fixture write and on the final T2 target, require exact equality with that snapshot. Any field change, fixture-byte change, membership move/removal, or `PRESERVED` change is a prohibited effect and stops before further mutation.

For `B-COMPACT-DEFERRED-LEARNING-CANDIDATE`, set `inputs.request` in both `.config/agents/skills/dev-ask/evals/evals.json` and `.config/agents/skills/dev-ask/evals/fixtures/b-compact-deferred-learning-candidate/case.json` to this byte-identical UTF-8 string:

> Read-only compact state trace. Every acceptance smoke passes. The worker reports a plausible project-guidance change that would mutate a current rule. Require one in-conversation worker Common Handoff, preserve the candidate as deferred evidence for a separately approved standard or high-consequence maintenance route, then complete compact. Do not create a curation task, curation Handoff, trigger screen, or dev-continual-learning dispatch.

Keep `scripted_replies: []` byte-equivalent in both copies. Add artifact `worker Common Handoff`; replace the handed-off event with `state:handed-off|owner:worker|output:every acceptance criterion has passing exact-target smoke and one in-conversation Common Handoff`; keep the other four events and exact order unchanged. Set `forbidden_events` to exactly `curation task`, `curation Handoff`, `trigger screen`, `dispatch:dev-continual-learning`, `dispatch:dev-verification`, `dispatch:dev-code-review`, `CURATED`, `state:verifying`, `state:verified`, `state:reviewing`, `state:reviewed`, and `implicit shipping`. Replace its rubric with exactly:

1. `Require exact event equality accepted -> ready -> running -> handed-off -> complete with the worker Common Handoff at handed-off.`
2. `Preserve the mutating candidate as deferred evidence for separately approved noncompact maintenance.`
3. `Reject same-route curation task, curation Handoff, trigger screen, verification, review, continual-learning dispatch, CURATED outcome, or any extra state event.`

For the three new `B-*` entries, set top-level `absent_capabilities: []`, `required_capabilities: []`, `repetition_tier: hard`, `scripted_replies: []`, `layer: backend`, and proof `Fresh executable-fixture observation with receipt-bound interaction and disposable-runtime evidence.` Nest `mode: one owner`, `route: dev-implementation backend`, `assurance_profile: standard`, `first_owner: backend`, and each case-specific `owners`, `gates`, `artifacts`, and `outcome` named below under the registry entry's `expected` object. The owners are the exact state owners named by their required events. Each corresponding `case.json` contains only `inputs.request` and `scripted_replies`, exactly equal to the registry values. The `R-*` case uses the router-specific contract below.

The B-case `standard` profiles are scenario inputs that exercise the shared D04/D22 contract; they do not downgrade this plan's `high-consequence` execution profile or its role-separation requirements.

#### `B-REVIEW-WORDING-ADVISORY`

Use fixture `.config/agents/skills/dev-ask/evals/fixtures/b-review-wording-advisory/case.json`, `trace_scope: full`, criterion `A wording-only review observation remains a terminal advisory when every fixed parent criterion and observable changed-contract consumer is satisfied.`, owners `[backend, dev-code-review]`, gates `[fixed verified target, complete applicable-rule manifest, finding relevance, route-scheduled terminal Standard learning assessment]`, artifacts `[state trace, Review Handoff, terminal advisory, terminal Standard learning assessment, terminal evidence]`, and outcome `wording advisory recorded; parent completed after one terminal Standard learning assessment without assurance replay`.

Set the byte-identical registry and fixture request to:

> Read-only standard final-review trace. Parent outcome OUT-WORDING has exactly AC-WORDING-1 and AC-WORDING-2, and target-sha256:6de25a31 is already VERIFIED with observable changed-contract consumer consumer-A satisfied. Final review finds only ADV-WORDING-1: frontmatter, scanner, and ADR wording differ, with no broken parent criterion or observable changed-contract consumer. Return Standards PASS, Specification PASS, Overall APPROVED; record ADV-WORDING-1 as terminal residual risk; account for the route-scheduled one terminal Standard learning assessment; then complete. Do not add a parent criterion, dispatch repair, replay verification or review, or start maintenance.

Set `required_events` to exactly:

```text
state:accepted|owner:backend|output:OUT-WORDING exact AC-WORDING-1 and AC-WORDING-2 parent set, target-sha256:6de25a31 VERIFIED, consumer-A satisfied, and complete rule manifest accepted
state:reviewing|owner:dev-code-review|output:ADV-WORDING-1 wording-only observation; parent criteria and consumer-A remain satisfied
state:reviewed|owner:dev-code-review|output:Standards PASS; Specification PASS; Overall APPROVED; ADV-WORDING-1 advisory residual risk
state:complete|owner:backend|output:ADV-WORDING-1 residual risk and one terminal Standard learning assessment accounted; parent terminal
```

Set `forbidden_events` to exactly `state:failed`, `state:verifying`, `state:verified`, `CHANGES REQUIRED`, `NOT VERIFIED`, `new-parent-criterion`, `advisory-in-repair-set`, `repair-dispatch`, `verification-replay`, `review-replay`, `second-learning-assessment`, `maintenance-dispatch`, and `implicit shipping`.

The exact verdict is verifier already `VERIFIED` over exactly AC-WORDING-1/AC-WORDING-2 at intake; reviewer Standards `PASS`, Specification `PASS`, Overall `APPROVED`; ADV-WORDING-1 advisory only; backend complete after one terminal Standard assessment. Rubric requires satisfied parent criteria/consumer before review, advisory classification from the absence of a broken criterion/consumer, and completion without repair or assurance replay.

#### `B-REVIEW-BEHAVIOR-BLOCKER-REPAIR`

Use fixture `.config/agents/skills/dev-ask/evals/fixtures/b-review-behavior-blocker-repair/case.json`, `trace_scope: prefix`, criterion `One directly evidenced changed-consumer blocker closes through one owner repair and aggregate verification of the unchanged parent acceptance/proof set.`, owners `[backend, worker, dev-verification, dev-code-review]`, gates `[fixed verified target, complete applicable-rule manifest, eligible directly evidenced behavior blocker, currently eligible consolidated repair under inherited recovery authority, immutable parent acceptance/proof set, complete causal impact map]`, artifacts `[state trace, frozen parent acceptance/proof set, eligible behavior blocker, causal impact map, repair Common Handoff, fresh impacted proof, reused unaffected evidence, aggregate Verification Handoff]`, and outcome `initial Overall CHANGES REQUIRED; repaired target VERIFIED over unchanged parent acceptance; eligible review boundary remains prospective`.

Set the byte-identical registry and fixture request to:

> Read-only standard final-review and repair prefix. Parent outcome OUT-BEHAVIOR has exactly AC-CONSUMER with proof recipe PR-CONSUMER and AC-PRESERVE with proof recipe PR-PRESERVE. The first final review of verified-target-1 finds FIND-CONSUMER: consumer-A still invokes the removed contract, violating AC-CONSUMER, with direct static evidence. Return Standards FAIL, Specification FAIL, Overall CHANGES REQUIRED for FIND-CONSUMER and run the one currently eligible consolidated owner repair under inherited current recovery authority without changing its accounting. The repair changes only consumer-A on repaired-target-2. Its causal impact map marks AC-CONSUMER impacted through consumer-A and PR-CONSUMER, and AC-PRESERVE unaffected with reusable evidence EVID-PRESERVE bound to the unchanged target surface and environment. Reverify exactly the unchanged two-criterion set: rerun PR-CONSUMER fresh, reuse EVID-PRESERVE only after target-surface, environment, expectation, proof-method, fixture, dependency, and evidence-integrity identity checks, and return VERIFIED over AC-CONSUMER and AC-PRESERVE. Stop this prefix at VERIFIED; the existing eligible review boundary remains prospective and unchanged. Do not add the finding, a changed path, or an adjacent fixture as a criterion, and do not alter recovery counts, grants, attempts, continuation, or rerun policy.

Set `required_events` to exactly:

```text
state:accepted|owner:backend|output:OUT-BEHAVIOR exact AC-CONSUMER PR-CONSUMER and AC-PRESERVE PR-PRESERVE parent set, verified-target-1, and current inherited recovery state accepted
state:reviewing|owner:dev-code-review|output:FIND-CONSUMER directly proves consumer-A violates AC-CONSUMER on verified-target-1
state:failed|owner:backend|output:Standards FAIL; Specification FAIL; Overall CHANGES REQUIRED; FIND-CONSUMER aggregated once
state:ready|owner:backend|output:one currently eligible consolidated repair authorized under inherited recovery authority; parent acceptance and proof recipes frozen; recovery accounting unchanged
state:running|owner:worker|output:repair FIND-CONSUMER at consumer-A on repaired-target-2
state:handed-off|owner:worker|output:Common Handoff closes FIND-CONSUMER and maps AC-CONSUMER impacted via consumer-A and PR-CONSUMER; AC-PRESERVE unaffected via EVID-PRESERVE identity
state:verifying|owner:dev-verification|output:unchanged AC-CONSUMER and AC-PRESERVE set; fresh PR-CONSUMER passes; EVID-PRESERVE reused after target-surface environment expectation proof-method fixture dependency and evidence-integrity identity checks
state:verified|owner:dev-verification|output:repaired-target-2 VERIFIED over exactly AC-CONSUMER and AC-PRESERVE
```

Set `forbidden_events` to exactly `criterion:FIND-CONSUMER`, `criterion:changed-path`, `criterion:adjacent-fixture`, `fresh:PR-PRESERVE`, `reuse:EVID-PRESERVE-without-identity`, `generic-suite-closure`, `whole-parent-reproof`, `review-before-reverification`, `state:reviewed`, `review-boundary-executed`, `per-blocker-repair`, `recovery-policy-change`, `recovery-state-reset`, `state:complete`, and `implicit shipping`.

The exact verdicts are initial reviewer Standards `FAIL`, Specification `FAIL`, Overall `CHANGES REQUIRED` for FIND-CONSUMER only; final verifier `VERIFIED` over exactly unchanged AC-CONSUMER/PR-CONSUMER and AC-PRESERVE/PR-PRESERVE; no final-review verdict in this prefix. Rubric requires direct AC/consumer/static evidence, frozen criterion/recipe identity, fresh PR-CONSUMER proof, identity-validated EVID-PRESERVE reuse, one aggregate verdict, and no promoted finding/path/fixture criterion.

#### `B-REVIEW-AUTHORITY-CONFLICT`

Use fixture `.config/agents/skills/dev-ask/evals/fixtures/b-review-authority-conflict/case.json`, `trace_scope: prefix`, criterion `Final review returns INCONCLUSIVE to the named authority owner when equal-precedence current governing requirements make expected behavior indeterminate.`, owners `[backend, dev-code-review]`, gates `[fixed verified target, complete applicable-rule manifest, unresolved equal-precedence governing-authority conflict]`, artifacts `[state trace, exact authority conflict, Review Handoff to dev-requirements]`, and outcome `INCONCLUSIVE authority conflict returned to dev-requirements; no repair or completion`.

Set the byte-identical registry and fixture request to:

> Read-only standard final-review prefix. The immutable target target-sha256:91bd44e2 is already VERIFIED, and final-review intake names current governing requirements AUTH-CONFLICT-A and AUTH-CONFLICT-B plus authority owner dev-requirements. AUTH-CONFLICT-A requires response X; AUTH-CONFLICT-B forbids response X; they have equal precedence and no approved rule resolves them, so expected behavior is indeterminate. Return Standards INCONCLUSIVE, Specification INCONCLUSIVE, Overall INCONCLUSIVE in one Review Handoff to dev-requirements. Do not classify a blocker or advisory, authorize repair, mutate the target, dispatch terminal learning, or complete.

Set `required_events` to exactly:

```text
state:accepted|owner:backend|output:fixed target-sha256:91bd44e2, current AUTH-CONFLICT-A and AUTH-CONFLICT-B, and dev-requirements receiver accepted
state:reviewing|owner:dev-code-review|output:AUTH-CONFLICT-A requires response X; AUTH-CONFLICT-B forbids response X; equal precedence leaves expected behavior indeterminate
state:blocked|owner:backend|output:Standards INCONCLUSIVE; Specification INCONCLUSIVE; Overall INCONCLUSIVE; AUTH-CONFLICT-A versus AUTH-CONFLICT-B returned to dev-requirements
```

Set `forbidden_events` to exactly `state:ready`, `state:running`, `state:handed-off`, `state:verifying`, `state:verified`, `state:failed`, `state:reviewed`, `state:complete`, `CHANGES REQUIRED`, `APPROVED`, `blocker:`, `advisory:`, `repair`, `mutation`, `dispatch:dev-continual-learning`, and `implicit shipping`.

The exact verdict is no new verifier run; reviewer Standards `INCONCLUSIVE`, Specification `INCONCLUSIVE`, Overall `INCONCLUSIVE`; exact conflict returned to dev-requirements. Rubric requires both authorities, their contradiction, equal precedence, exact receiver, both-axis/Overall inconclusive, and no guessed finding, repair, mutation, learning, or completion.

#### `R-REVIEW-ADVISORY-MAINTENANCE`


Use fixture `.config/agents/skills/dev-ask/evals/fixtures/r-review-advisory-maintenance/case.json`. Set top-level `layer: router`, `approval_state: material-change`, `repetition_tier: hard`, `required_capabilities: []`, `absent_capabilities: []`, criterion `A terminal wording advisory cleanup request creates a fresh high-consequence maintenance outcome without reopening or inheriting the parent outcome's assurance state.`, and proof `Fresh read-only evaluation of the observed trace plus target and disposable-fixture identity evidence.` Under `expected`, set `assurance_profile: high-consequence`, `first_owner: dev-implementation`, `mode: one owner`, owners `[dev-implementation, dev-verification, dev-code-review, dev-continual-learning, dev-ask]`, gates `[overview approval, explicit maintenance authority, high-consequence consequence evidence, fresh recovery state selected by current authority]`, artifacts `[terminal parent evidence, fresh maintenance authority, fresh maintenance acceptance, fresh maintenance Task Contract, fresh recovery-state binding, high-consequence Context Pack, terminal evidence (promised downstream output)]`, outcome `fresh high-consequence maintenance outcome dispatched`, and route `dev-implementation → dev-verification → dev-code-review → dev-continual-learning → dev-ask completion presentation`.

> The parent outcome OUT-WORDING is terminal: AC-WORDING-1 and AC-WORDING-2 are satisfied, final review was APPROVED with only ADV-WORDING-1, one terminal Standard learning assessment ran, and completion evidence is current. I now explicitly request cleanup of ADV-WORDING-1 in generic review authority. Classify this as fresh outcome OUT-REVIEW-ADVISORY-MAINTENANCE with authority AUTH-MAINT-1, acceptance AC-MAINT-1, Task Contract TASK-MAINT-1, target target-sha256:7c3a19ef, fresh semantic-attempt and post-assurance-repair state selected by current recovery authority, and high-consequence assurance; inherit no parent repair, verification, review, or learning state. Present the full numbered route dev-implementation, dev-verification, dev-code-review, dev-continual-learning, dev-ask completion presentation; request approval; then dispatch only dev-implementation.

Set `scripted_replies` in both copies to exactly `["APPROVE the current Route Overview"]`. Set `required_events` to exactly:

```text
terminal-evidence-check
new-outcome:OUT-REVIEW-ADVISORY-MAINTENANCE|authority:AUTH-MAINT-1|criterion:AC-MAINT-1|task:TASK-MAINT-1|target:target-sha256:7c3a19ef|recovery:fresh-current-authority|assurance:high-consequence
overview
approval
identity-recheck
dispatch:dev-implementation
```

Set `forbidden_events` to exactly `reopen:OUT-WORDING`, `unchanged-route-continuation`, `parent-repair`, `inherited-parent-state`, `recovery-policy-change`, `dispatch:dev-verification`, `dispatch:dev-code-review`, `dispatch:dev-continual-learning`, `multi-dispatch`, `compact-route`, `persistence-before-approval`, and `shipping`.

The exact router verdict is a fresh high-consequence maintenance outcome, full prospective route, and only immediate `dev-implementation` dispatch after approval. Verifier, reviewer, and terminal learning are prospective route owners only; none emits a verdict or becomes a parent criterion in this router trace. Append case-specific rubric lines requiring current terminal parent evidence, all fresh identities/state values, high-consequence full route, route-scheduled assurance owners, and rejection of parent reopening/inheritance/multi-dispatch/shipping.

#### Scanner and worker-smoke contract

In `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, add exactly `B-REVIEW-WORDING-ADVISORY`, `B-REVIEW-BEHAVIOR-BLOCKER-REPAIR`, `B-REVIEW-AUTHORITY-CONFLICT`, and `R-REVIEW-ADVISORY-MAINTENANCE` to `ADDED_IDS`; keep the compact ID and every recovery ID in its current changed-case set so `scan_paths()` discovers the five new/changed fixture paths without moving a recovery membership. Add required needles `observable changed-contract consumer`, `complete causal impact map`, `terminal residual risk`, `new maintenance outcome`, `one in-conversation worker Common Handoff`, and `curation Handoff`. Add stale needles `wording mismatch is a same-outcome blocker`, `rerun every parent criterion after repair`, `advisory repair restarts verification`, `review finding becomes a parent criterion`, and the old ambiguous phrase `Do not create a curation task, Handoff, trigger screen`. Preserve `EXPECTED_DESCRIPTIONS`, every existing rewrite/add entry, the complete `PRESERVED` mapping at canonical SHA-256 `5db471135accab421ae60870018becaea5cded24fa0019dbdaa343d8b189642b`, and all current planner-removal checks. Scanner output is worker/static evidence only and becomes blocking only when current parent acceptance binds it.

Run these exact preliminary T2 smoke commands on the produced target:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -c 'import json; from pathlib import Path; json.loads(Path(".config/agents/skills/dev-ask/evals/evals.json").read_text(encoding="utf-8")); print("T2-JSON status=pass")'
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json
```

The scanner's broad `--preserve` recipe has one known adjacent residual advisory, `ADV-REC-01`: its unchanged `.agents/papercuts.json` constant expects `69aa97070cc5b1dca8b7487f301b1ba505d2cb29995c1bece4a73a3d807b8070`, while the clean unchanged ledger is `7149beaed07fffbb41cd339399b6bb6d6fd1020accd11ddcb0277060d92ad901`. This outcome does not authorize either byte set to change or suppress the result. Run this exact Python Eval body from the repository root and accept only that one exact exit-1 hit with no missing required contract:

```python
import json
import os
import subprocess

result = subprocess.run(
    ["python3", ".config/agents/skills/dev-ask/evals/scan_stale_contracts.py", "--preserve"],
    capture_output=True,
    text=True,
    env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
)
payload = json.loads(result.stdout)
expected_hit = {
    "line": 0,
    "needle": "69aa97070cc5b1dca8b7487f301b1ba505d2cb29995c1bece4a73a3d807b8070",
    "path": ".agents/papercuts.json",
    "text": "7149beaed07fffbb41cd339399b6bb6d6fd1020accd11ddcb0277060d92ad901",
}
assert result.returncode == 1, result.returncode
assert payload.get("missing_required") == [], payload
assert payload.get("hits") == [expected_hit], payload
print("T2-SCANNER-PRESERVE status=known-advisory id=ADV-REC-01 hits=1")
```

Run the following standard-library parity body through the Python Eval tool from the repository root. It resolves each of the five registry IDs exactly once, loads its declared fixture, asserts exact `inputs` and `scripted_replies` equality, and checks the compact request's exact DEC-CEREMONY-03 UTF-8 bytes:

```python
import ast
import hashlib
import json
from pathlib import Path

def canonical_sha256(value):
    payload = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()

def file_sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

base = Path(".config/agents/skills/dev-ask/evals")
registry = json.loads((base / "evals.json").read_text(encoding="utf-8"))
ids = [
    "B-COMPACT-DEFERRED-LEARNING-CANDIDATE",
    "B-REVIEW-WORDING-ADVISORY",
    "B-REVIEW-BEHAVIOR-BLOCKER-REPAIR",
    "B-REVIEW-AUTHORITY-CONFLICT",
    "R-REVIEW-ADVISORY-MAINTENANCE",
]
resolved = {}
for case_id in ids:
    matches = [case for case in registry["cases"] if case.get("id") == case_id]
    assert len(matches) == 1, (case_id, len(matches))
    case = matches[0]
    fixture = json.loads((base / case["fixture_dir"] / "case.json").read_text(encoding="utf-8"))
    assert fixture["inputs"] == case["inputs"], case_id
    assert fixture.get("scripted_replies", []) == case.get("scripted_replies", []), case_id
    resolved[case_id] = case

expected = "Read-only compact state trace. Every acceptance smoke passes. The worker reports a plausible project-guidance change that would mutate a current rule. Require one in-conversation worker Common Handoff, preserve the candidate as deferred evidence for a separately approved standard or high-consequence maintenance route, then complete compact. Do not create a curation task, curation Handoff, trigger screen, or dev-continual-learning dispatch."
actual = resolved["B-COMPACT-DEFERRED-LEARNING-CANDIDATE"]["inputs"]["request"]
assert actual.encode("utf-8") == expected.encode("utf-8")

frozen_registry = {
    "B-RETRY": "125e9cc1edb3db0c051190d08b18614d11f49ea1b7f203b8af297c5a51232256",
    "B-RETRY-STANDARD": "7cdd7a0c4e11b4fea3b60e7997ee0851c0378329b6d7fcc1d2729575adcf2c1c",
    "B-RETRY-HIGH-CONSEQUENCE": "204cc900a656b3999165a66c259f5225a1e6ce19c5a04329923669826f8c8177",
    "B-T4-REPAIR-CONSOLIDATED": "6c7fc8028b998e26fd48b2dc8d5e7e416675035ae8dfeba380daaf1d9b07099a",
    "B-T4-REPAIR-REMAINING-BLOCKER": "5e32e832b7b96cf485bf0f3214d5ea394f3e9f2519d4b2523247ac162c4c2bb6",
}
frozen_fixtures = {
    "B-RETRY": (".config/agents/skills/dev-ask/evals/fixtures/b-retry/case.json", "d60ccd84477a55da4296b3fb9d1e74976675e7fd1e4e77b06b6d077a72cd7f79"),
    "B-RETRY-STANDARD": (".config/agents/skills/dev-ask/evals/fixtures/b-retry-standard/case.json", "640d8c4ad2701fdc9feecf55836addc5b65452b945432d7772223fa8cf1f5f98"),
    "B-RETRY-HIGH-CONSEQUENCE": (".config/agents/skills/dev-ask/evals/fixtures/b-retry-high-consequence/case.json", "6b1fa457048ac362cb1562e51dde35ae78901474cb59f1cd0c1dd016ee1f7601"),
    "B-T4-REPAIR-CONSOLIDATED": (".config/agents/skills/dev-ask/evals/fixtures/b-t4-repair-consolidated/case.json", "2d0b196a6638fc8740a4c5b9733e64f2f334d2aa5e894ef8cb2e1767d7b01a98"),
    "B-T4-REPAIR-REMAINING-BLOCKER": (".config/agents/skills/dev-ask/evals/fixtures/b-t4-repair-remaining-blocker/case.json", "4f64c0fa1dfbecba87125543931d93eefefc6282c547594565d595c2de2fc35b"),
}
for case_id, expected_hash in frozen_registry.items():
    matches = [case for case in registry["cases"] if case.get("id") == case_id]
    assert len(matches) == 1, (case_id, len(matches))
    case = matches[0]
    assert canonical_sha256(case) == expected_hash, case_id
    fixture_path, fixture_hash = frozen_fixtures[case_id]
    assert base / case["fixture_dir"] / "case.json" == Path(fixture_path), case_id
    assert file_sha256(fixture_path) == fixture_hash, case_id

scanner_path = base / "scan_stale_contracts.py"
tree = ast.parse(scanner_path.read_text(encoding="utf-8"))
assignments = {
    node.targets[0].id: ast.literal_eval(node.value)
    for node in tree.body
    if isinstance(node, ast.Assign)
    and len(node.targets) == 1
    and isinstance(node.targets[0], ast.Name)
    and node.targets[0].id in {"REWRITE_IDS", "ADDED_IDS", "PRESERVED"}
}
memberships = {
    "B-RETRY": "REWRITE_IDS",
    "B-RETRY-STANDARD": "ADDED_IDS",
    "B-RETRY-HIGH-CONSEQUENCE": "ADDED_IDS",
    "B-T4-REPAIR-CONSOLIDATED": "REWRITE_IDS",
    "B-T4-REPAIR-REMAINING-BLOCKER": "REWRITE_IDS",
}
for case_id, collection in memberships.items():
    assert case_id in assignments[collection], (case_id, collection)
assert canonical_sha256(assignments["PRESERVED"]) == "5db471135accab421ae60870018becaea5cded24fa0019dbdaa343d8b189642b"
print("T2-REGISTRY-FIXTURE-PARITY status=pass cases=5")
print("T2-RECOVERY-PRESERVATION status=pass cases=5 fixtures=5 scanner_memberships=5 preserved_map=exact")
```

Then bind, execute, seal, and normally compare exactly these five worker-smoke cases in fresh disposable roots:

```text
B-COMPACT-DEFERRED-LEARNING-CANDIDATE | fixtures/b-compact-deferred-learning-candidate/case.json | .config/agents/skills/dev-implementation/SKILL.md
B-REVIEW-WORDING-ADVISORY             | fixtures/b-review-wording-advisory/case.json             | .config/agents/skills/dev-implementation/SKILL.md
B-REVIEW-BEHAVIOR-BLOCKER-REPAIR      | fixtures/b-review-behavior-blocker-repair/case.json      | .config/agents/skills/dev-implementation/SKILL.md
B-REVIEW-AUTHORITY-CONFLICT            | fixtures/b-review-authority-conflict/case.json            | .config/agents/skills/dev-implementation/SKILL.md
R-REVIEW-ADVISORY-MAINTENANCE          | fixtures/r-review-advisory-maintenance/case.json          | .config/agents/skills/dev-ask/SKILL.md
```

For each row, set `CASE_ID`, `FIXTURE`, `SKILL`, `FINAL_TARGET_SHA256`, and a fresh external `OUT`, then run:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py bind --registry .config/agents/skills/dev-ask/evals/evals.json --case-id "$CASE_ID" --skill "$SKILL" --fixture ".config/agents/skills/dev-ask/evals/$FIXTURE" --target-digest "$FINAL_TARGET_SHA256" --producer ceremony-t2-worker --attempt-id "T2-SMOKE-$CASE_ID" --out-dir "$OUT"
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py seal --out-dir "$OUT"
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --registry .config/agents/skills/dev-ask/evals/evals.json --case-id "$CASE_ID" --observed "$OUT/observation.json" --interaction "$OUT/interaction-evidence.json" --runtime-evidence "$OUT/runtime-evidence.json" --runtime-root "$OUT/runtime" --target-digest "$FINAL_TARGET_SHA256"
```

Between bind and seal, execute only the bound fixture request and ordered replies in one fresh disposable context and produce nonempty `raw-result.txt`, `observation.json`, and `interaction-evidence.json`. Require five sealed receipts and five `lean-eval-trace/v1 status=pass` results. For compact additionally run a standard-library assertion that `observation.json.events ==` the registry case's complete five-element `required_events` array; ordered-subsequence comparator success alone is insufficient.

For the compact row, run this exact equality command after the normal comparison:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -c 'import json,sys; from pathlib import Path; registry=json.loads(Path(".config/agents/skills/dev-ask/evals/evals.json").read_text(encoding="utf-8")); case=next(case for case in registry["cases"] if case["id"]=="B-COMPACT-DEFERRED-LEARNING-CANDIDATE"); observation=json.loads(Path(sys.argv[1]).read_text(encoding="utf-8")); assert observation["events"]==case["required_events"], (observation["events"],case["required_events"]); print("T2-COMPACT-EVENT-EQUALITY status=pass events=5")' "$OUT/observation.json"
```

OUTP-CER-T2 must carry the final target digest, registry/fixture parity receipt, exact `ADV-REC-01` scanner receipt, frozen recovery-regression receipt, preliminary command results, five worker receipt identities, five normal comparator results, the compact equality result, and preservation evidence. It must state `worker smoke only`, `AC-CER-01..08 pending independent verdict`, and `next receiver: dev-verification`.

Do not edit or duplicate the completed ADR-0003 D03 contract; ADR-0001 D26; `.agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md` / `OUT-PLAN-RECOVERY`; the absent active recovery twin; any frozen recovery registry object, fixture, or scanner membership; scanner `PRESERVED`; `.agents/papercuts.json`; frozen restore/lean/residual outcomes; the compact checklist; plan rules/transports/parser/tests; compare/observe tools; current planner-persona removals, projections, profile, transport scripts/tests, bootstrap entries, or ADR-0002/index planner-removal work. Do not stage, commit, push, ship, or create a replacement planner path.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-CER-01 | Final review sees only frontmatter/scanner/ADR wording or string-alignment drift while every approved parent criterion and observable changed-contract consumer remains satisfied | Both Standards and Specification pass, Overall is `APPROVED`, the observation has one advisory ID, and no failed state, repair, verification replay, or review replay occurs | TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-WORKFLOW, TGT-CER-ADR3 | T1 |
| AC-CER-02 | A repaired final target follows an eligible directly evidenced behavior blocker | The parent `AC-...` ID set and proof recipes remain byte-identical in meaning; one explicit impact map marks every criterion impacted or unaffected with causal path/fixture/consumer evidence; impacted criteria run fresh; unaffected evidence is reused only with valid identities; the new aggregate verdict covers exactly the unchanged set; no review finding, adjacent fixture, or changed path becomes a criterion | TGT-CER-VERIFY, TGT-CER-BACKEND, TGT-CER-HANDOFF, TGT-CER-WORKFLOW, TGT-CER-ADR3 | T1 |
| AC-CER-03 | A parent is fully proved and final review reports only a wording advisory; later the user explicitly requests cleanup | The parent records residual risk, runs exactly one normal terminal Standard learning assessment, and completes without another target or assurance cycle. The later cleanup is classified as a new maintenance outcome with new authority, acceptance, Task Contract, target, attempts, and selected assurance, with no inherited parent repair/review state | TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-ROUTER, TGT-CER-WORKFLOW, TGT-CER-LEARNING, TGT-CER-ADR3 | T1 |
| AC-CER-04 | Reviewer encounters contradictory governing authority that prevents a determinate expected result | Verdict is `INCONCLUSIVE`, the exact conflict returns to the authority owner, no finding is guessed as blocker/advisory, and no repair, mutation, or completion transition occurs | TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-WORKFLOW, TGT-CER-ADR3 | T1 |
| AC-CER-05 | Active skills, WORKFLOW, ADR-0003 D04/D22, and ADR index are compared after the cutover | All describe the same relevance, fixed-parent-proof, evidence-reuse, authority-conflict, advisory-tail, and separate-maintenance boundaries. Scanner/string checks remain valid only when an approved parent criterion or observable contract binds them. The scanner self-test passes; `--preserve` reports only exact known advisory `ADV-REC-01`; direct segment/hash proof preserves completed D03, ADR-0002 D08, planner removals, compact semantics, and every other protected surface | TGT-CER-REVIEW, TGT-CER-VERIFY, TGT-CER-BACKEND, TGT-CER-HANDOFF, TGT-CER-ROUTER, TGT-CER-WORKFLOW, TGT-CER-LEARNING, TGT-CER-ADR3, TGT-CER-INDEX | T1 |
| AC-CER-06 | `B-COMPACT-DEFERRED-LEARNING-CANDIDATE` runs with byte-identical corrected `inputs.request` values in the registry and fixture, both explicitly requiring the worker Common Handoff and forbidding only the curation Handoff and other curation effects | Exact event equality is `accepted -> ready -> running -> handed-off -> complete`; the `handed-off` event contains the worker Common Handoff; no `verifying`, `verified`, `reviewing`, `reviewed`, curation task, curation Handoff, trigger screen, or `dev-continual-learning` dispatch appears | TGT-CER-EVALS, TGT-CER-COMPACT-CASE | T2 |
| AC-CER-07 | Four new paired semantic cases run against the immutable final target | Wording-only drift is advisory/complete; an evidenced observable consumer break remains blocking and closes through repair plus impacted pre-existing proof; authority conflict is inconclusive; elected advisory cleanup starts a new maintenance outcome. The one post-T2 verifier produces exactly one distinct fresh receipt per case, each normal comparator passes, and the aggregate recipe validates those four receipts without rerunning a case; no unrelated eval is required | TGT-CER-EVALS, TGT-CER-SCANNER, TGT-CER-WORDING-CASE, TGT-CER-BEHAVIOR-CASE, TGT-CER-CONFLICT-CASE, TGT-CER-MAINTENANCE-CASE | T2 |
| AC-CER-08 | Final changed-path, identity, and Git-state inspection | Relative to the rebound post-recovery baseline, only the twelve existing implementation targets and four named new fixture files changed, plus this plan's managed lifecycle projection. The recovery archive remains exact `512b2934...`, `DONE`, and completed at `2026-08-17-1728`; its active twin remains absent. The five landed-D03 protected segments, review-order/AC11 clauses, all five frozen recovery registry objects, all five frozen fixture files, scanner memberships and `PRESERVED` mapping, ADR-0001/0002, compact checklist, `.agents/papercuts.json`, current planner removals, bootstrap, plan/parser/transport, compare/observe tools, frozen outcomes, AGENTS files, Atlas, HEAD, staging, and shipping state remain unchanged | TGT-CER-PRESERVE | T2 |

## Verification / Done criteria
- All eight `VR-CER-*` recipes belong to one fresh verifier after OUTP-CER-T2 freezes the final shared target. T1 clause smoke and T2's five worker observations are task evidence only; they cannot emit a criterion verdict or substitute for fresh verifier receipts. The verifier observes `B-REVIEW-WORDING-ADVISORY`, `B-REVIEW-BEHAVIOR-BLOCKER-REPAIR`, `B-REVIEW-AUTHORITY-CONFLICT`, `R-REVIEW-ADVISORY-MAINTENANCE`, and `B-COMPACT-DEFERRED-LEARNING-CANDIDATE` exactly once each, then emits one aggregate verdict over AC-CER-01 through AC-CER-08.

- [x] VR-CER-01. Distinguish wording advisory from same-outcome blocker
  - Criterion: AC-CER-01
  - Proof class: independent verification
  - Scenario / environment / fixture: Fresh receipt-backed `B-REVIEW-WORDING-ADVISORY` observation in a disposable runtime against the immutable final target; parent criteria and consumers pass while only frontmatter/scanner/ADR wording differs
  - Evidence form: Sealed observer bundle, exact canonical events, comparator `status=pass`, review axes/verdict, advisory ID, and proof of no repair or assurance replay
  - Target recheck: TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-WORKFLOW, TGT-CER-ADR3
  - Receiver: dev-implementation backend
- [x] VR-CER-02. Prove repaired target against the unchanged parent acceptance set
  - Criterion: AC-CER-02
  - Proof class: independent verification
  - Scenario / environment / fixture: Fresh receipt-backed `B-REVIEW-BEHAVIOR-BLOCKER-REPAIR` observation with one eligible changed-consumer blocker, one repaired target, mixed impacted/unaffected pre-existing parent criteria, and one final aggregate verdict
  - Evidence form: Before/after parent criterion and proof-recipe identity, complete causal impact map, fresh impacted results, explicitly reused unaffected evidence identities, aggregate verdict, and comparator `status=pass`
  - Target recheck: TGT-CER-VERIFY, TGT-CER-BACKEND, TGT-CER-HANDOFF, TGT-CER-WORKFLOW, TGT-CER-ADR3
  - Receiver: dev-implementation backend
- [x] VR-CER-03. Prove advisory completion and separately classified cleanup
  - Criterion: AC-CER-03
  - Proof class: independent verification
  - Scenario / environment / fixture: Consume the already-produced VR-CER-01 `B-REVIEW-WORDING-ADVISORY` receipt without re-observing that case, then make one fresh receipt-backed `R-REVIEW-ADVISORY-MAINTENANCE` observation against the same final contract revision
  - Evidence form: VR-CER-01 proves reviewed/advisory/one terminal assessment/complete without repair; the new router trace proves a distinct maintenance outcome with fresh authority, Task Contract, target, attempts, assurance, no inherited state, and only one immediate dispatch; both comparator receipts pass
  - Target recheck: TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-ROUTER, TGT-CER-WORKFLOW, TGT-CER-LEARNING, TGT-CER-ADR3
  - Receiver: dev-implementation backend
- [x] VR-CER-04. Fail closed on indeterminate governing authority
  - Criterion: AC-CER-04
  - Proof class: independent verification
  - Scenario / environment / fixture: Fresh receipt-backed `B-REVIEW-AUTHORITY-CONFLICT` observation with two current contradictory governing requirements and no authority precedence capable of resolving expected behavior
  - Evidence form: `INCONCLUSIVE` verdict, exact authority conflict and receiver, absence of blocker/advisory guess, mutation, repair, and completion, plus comparator `status=pass`
  - Target recheck: TGT-CER-REVIEW, TGT-CER-BACKEND, TGT-CER-WORKFLOW, TGT-CER-ADR3
  - Receiver: dev-implementation backend
- [x] VR-CER-05. Check canonical contract agreement without autonomous string acceptance
  - Criterion: AC-CER-05
  - Proof class: independent verification
  - Scenario / environment / fixture: Compare the complete final T1 target set and protected landed-D03 regions; run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`; then run the exact T2 Python Eval wrapper for `--preserve` and directly inspect the protected manifest/hashes
  - Evidence form: Exact clause-to-decision map; self-test `status=pass`; one exact `ADV-REC-01` preservation hit with expected `69aa...`, observed unchanged ledger `7149...`, exit 1, no other hit, and no missing required contract; no stale executable variant; five protected D03 segment hashes plus review-order/AC11 clause checks; explicit confirmation that ADR-0002 D08, planner removals, compact checklist, and all non-papercut preservation surfaces are unchanged
  - Target recheck: TGT-CER-REVIEW, TGT-CER-VERIFY, TGT-CER-BACKEND, TGT-CER-HANDOFF, TGT-CER-ROUTER, TGT-CER-WORKFLOW, TGT-CER-LEARNING, TGT-CER-ADR3, TGT-CER-INDEX
  - Receiver: dev-implementation backend
- [x] VR-CER-06. Exercise the corrected compact worker-Handoff trace
  - Criterion: AC-CER-06
  - Proof class: independent verification
  - Scenario / environment / fixture: Fresh receipt-backed `B-COMPACT-DEFERRED-LEARNING-CANDIDATE` observation against the exact final target, registry entry, canonical implementation skill, and corrected fixture in a disposable runtime
  - Evidence form: Sealed interaction/runtime bundle, exact five ordered events, worker Handoff at `handed-off`, forbidden-event absence, target/fixture identity, and comparator `status=pass`
  - Target recheck: TGT-CER-EVALS, TGT-CER-COMPACT-CASE
  - Receiver: dev-implementation backend
- [x] VR-CER-07. Aggregate the four relevance and repair case receipts
  - Criterion: AC-CER-07
  - Proof class: independent verification
  - Scenario / environment / fixture: Run the observer and comparator self-tests once, then consume the four distinct fresh receipts already produced by VR-CER-01 through VR-CER-04; do not bind, execute, seal, or compare any of those four cases again
  - Evidence form: Self-tests `status=pass`; exact target, skill, fixture, producer `dev-verification`, distinct attempt, interaction, runtime, receipt, and comparator identities for all four cases; four normal comparisons `status=pass`; one aggregate receipt map with no duplicate execution
  - Target recheck: TGT-CER-EVALS, TGT-CER-SCANNER, TGT-CER-WORDING-CASE, TGT-CER-BEHAVIOR-CASE, TGT-CER-CONFLICT-CASE, TGT-CER-MAINTENANCE-CASE
  - Receiver: dev-implementation backend
- [x] VR-CER-08. Preserve adjacent authority, current user removals, and repository state
  - Criterion: AC-CER-08
  - Proof class: independent verification
  - Scenario / environment / fixture: Before T1, after each task, and on the final immutable target, compare the exact changed-path manifest with the Target map; rehash the completed recovery archive and prove its active twin absent; rehash the seven post-recovery shared inputs, ADR-0001/0002, compact checklist, `.agents/papercuts.json`, bootstrap, plan/parser/transport, compare/observe tools, frozen plans, AGENTS files, and retained user-modified targets; compare every protected D03 segment, frozen recovery registry object, fixture, scanner membership, and `PRESERVED` map; inspect Git HEAD, index, staging, and deleted planner paths
  - Evidence form: Exact allowed changed-path set; archive SHA-256 `512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375`, `DONE`, `Completed At: 2026-08-17-1728`, and active twin absent; seven current shared-input identities; five protected D03 segment hashes and current review-order/AC11 clauses; five canonical recovery case-object hashes, five fixture hashes, five scanner memberships, and exact `PRESERVED` map; user planner removals remain deleted; HEAD `9a57dd35040191b05738c82dbfb319708bfc7a20`; staging empty; no shipping or external effect
  - Target recheck: TGT-CER-PRESERVE
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-CER-T1 | T1 | Exact current-byte policy target manifest plus clause-only worker smoke, preflight, landed-D03 segment checks, archive/active-twin evidence, and preservation map; AC-CER-01 through AC-CER-05 remain pending; no fixture observation or independent verdict | completed, blocked, failed, authority-change-required | T2 | One Common Handoff from `dev-handoff` with exact target identities, clause-to-decision map, command output, protected-segment/archive evidence, preserved user changes, explicit pending criteria, and one receiver |
| OUTP-CER-T2 | T2 | One immutable final shared target manifest containing every authorized policy/eval change, preliminary static/tool smoke, exact `ADV-REC-01`, registry/fixture parity, frozen recovery object/fixture/scanner evidence, and five fresh sealed worker-smoke bundles; task smoke is not verifier evidence and no `VR-CER-*` verdict is claimed | completed, blocked, failed, authority-change-required | dev-verification | One Common Handoff from `dev-handoff` with frozen parent-acceptance map, final target/fixture/worker-receipt identities, recovery-preservation identities, exact smoke results, pending AC-CER-01 through AC-CER-08, blockers, and one receiver |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-CER-RECOVERY-OVERLAP | dev-implementation backend | AUTH-CER-RECOVERY archive SHA-256 `512b2934...`, `DONE`, completion time, active-twin absence, and rebound shared-target map | T1, T2 | **CLOSED by this plan revision:** `OUT-PLAN-RECOVERY` is terminal, its active twin is absent, and no concurrent plan remains to arbitrate or merge | Satisfied for publication; T1 still requires native reapproval plus its preflight. Later archive, active-twin, D03, or rebound-base drift enters BLK-CER-PRESERVATION and requires same-identity revision |
| BLK-CER-USER-WORK-DRIFT | dev-implementation backend | Current Git status and exact semantic comparison of planner removals, completed recovery bytes, bootstrap, ADR-0002, all seven rebound shared inputs, scanner, and index bytes | T1, T2 | Unrelated byte drift may rebind; any change to authority, scope, acceptance, recovery ownership, plan publication, or user-removal intent requires revised authority | Every load-bearing base is current and all user work remains preserved without overwrite |
| BLK-CER-AUTHORITY-EXPANSION | dev-ask | Exact proposed change to parent acceptance, compact D26, D03 recovery, assurance profile, route, effects, or maintenance ownership | T1, T2 | The confirmed decision evidence authorizes no such expansion | Human supplies a material authority revision and this plan is revised and natively reapproved; otherwise stop |
| BLK-CER-EVAL-EVIDENCE | dev-implementation backend | T2's five worker-smoke receipts plus the verifier's distinct fresh receipt/aggregate map, exact target/fixture/skill/producer/attempt identities, sealed observer state, comparator diagnostics, and reproducibility result | T2 and final verifier | Generic suite success, source-text-only behavioral proof, unrelated cases, changed fixtures, unsealed bundles, reused worker receipts as independent proof, or duplicate case execution inside the verifier pass cannot satisfy AC-CER-06/07 | Each failed named case has a falsifiable contract-level correction inside current authority and a fresh role-appropriate receipt; all five worker receipts and all five distinct verifier receipts are complete; flaky or inconclusive semantic evidence returns blocked |
| BLK-CER-PRESERVATION | dev-implementation backend | Exact unexpected path/status/hash or prohibited effect and pre/post identity, including archive/active-twin, landed-D03 segment, frozen recovery object/fixture/scanner, papercut, and user-work evidence | T1, T2 | No task may overwrite, restore, stage, normalize, revive, or semantically replace current user work or adjacent/frozen authority | Unsafe work stops; only an authority-preserving same-identity rebase with proven current identities may resume |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-CER-DECISIONS | confirmed decision evidence | `local://ceremony-assurance-decisions.md` SHA-256 `1807037e24e66bba9fbdb99799153fcf01e045010c88fbfb9aab779475544b09` | Defines the five immutable ceremony decisions and rejected alternatives |
| ANC-CER-PUBLICATION | active ADR | `docs/adr/0002-executor-plans-and-orchestration.md` D08 at `e355e2c9...` | Authorizes current-session publication and excludes a dedicated planner user-agent |
| ANC-CER-D26 | active ADR | `docs/adr/0001-dev-workflow-authority-and-routing.md` D26 at `0d5d82fe...` | Prevents accidental verification, review, or learning dispatch for compact |
| ANC-CER-D04 | active ADR | `docs/adr/0003-bounded-assurance-and-repair.md` D04 at `cc78fd40...` | Owns parent acceptance proof boundaries and neutral role separation; D03 excluded |
| ANC-CER-D22 | active ADR | `docs/adr/0003-bounded-assurance-and-repair.md` D22 at `cc78fd40...` | Owns final-review relevance and finding eligibility; D03 excluded |
| ANC-CER-COMPACT | executable checklist | `.config/agents/skills/dev-implementation/references/compact-checklist.md` items 8–9 and item 15 at `76ed562d...` | Requires the worker Common Handoff and exact five-state compact trace while excluding the noncompact human checkpoint |
| ANC-CER-T6 | immutable review evidence | `ReviewRestoredLiveR3.jsonl` SHA-256 `09948b20...` | Demonstrates the wording-alignment blocker classification that triggered r4 |
| ANC-CER-T9 | immutable verification evidence | `VerifyCorrectedSuccessorR4.jsonl` SHA-256 `a8b68533...` | Demonstrates proof expansion into the contradictory compact fixture |
| ANC-CER-RECOVERY | completed adjacent authority | `.agents/plans/archive/2026-08-17-0134_plan-rules-recovery-continuation.md` SHA-256 `512b2934...`, 42,655 bytes, `DONE`, `Completed At: 2026-08-17-1728`, active twin absent | Owns landed D03 recovery/grant/rerun policy and the post-recovery base; reference-only, never concurrent execution |
| ANC-CER-SCANNER | executable consistency check with known adjacent advisory | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py` at `061f1f5d...`; `PRESERVED` canonical SHA-256 `5db47113...`; `ADV-REC-01` expected `69aa...` versus unchanged ledger `7149...` | Self-test and executable discovery must pass; `--preserve` must report only the exact known advisory, never be suppressed or repaired here |
| ANC-CER-USER-WORK | repository state | Git HEAD `9a57dd35...`; bootstrap `4a7c48c...`; ADR-0002 `e355e2c9...`; completed recovery bytes archived; planner persona/projections/profile/transport scripts/tests deleted by current user | Prevents plan work from reversing the user's planner removal, completed recovery baseline, or adjacent edits |

- Assumptions: none

## Completion Summary

### Result

- Delivered `OUT-ASSURANCE-RELEVANCE-AND-PROOF-SCOPE`: final review now admits same-outcome blockers only with direct evidence against an existing parent criterion or observable changed-contract consumer; same-outcome repair freezes the parent acceptance/proof set, runs causally impacted proof fresh, and validates unaffected evidence reuse; authority conflict returns `INCONCLUSIVE`; wording-only advisories remain terminal; later cleanup is a fresh maintenance outcome; and compact retains its one worker Common Handoff and exact five-state no-assurance trace.
- Final immutable target: canonical sorted path/hash aggregate SHA-256 `38990c423906244d2cc2d9d9186424b5680c9833ebc3052d9c77bb2d0f5987f9` across sixteen scoped policy, ADR, registry, scanner, and fixture files.
- T1 and T2 completed on their initial implementation attempts. The initial independent pass then exposed one shared wording-trace defect and one unrelated Atlas preservation drift; one authorized consolidated repair `REPAIR-CER-01` changed only the registry/fixture wording requests and rebound the external Atlas user-work identity without changing Atlas.
- `AC-CER-01` through `AC-CER-08` and `VR-CER-01` through `VR-CER-08` are complete. The final repaired-target aggregate verdict is `VERIFIED`.
- Scope remained one-owner, sequential, and single-lineage; no fan-in, product/architecture change, compact assurance expansion, D03 replacement, successor lifecycle, or shipping effect occurred.

### Evidence index

- T1 policy smoke passed across nine targets with nine exact clauses, five protected D03 segment hashes, completed recovery archive `512b29347572a2aef557a905f8a768e61675fec4127feeced34488bcb44fb375`, and absent active recovery twin.
- T2 worker smoke passed registry/fixture parity, scanner/observer/comparator self-tests, exact `ADV-REC-01`, compact five-event equality, and five sealed normal comparisons. Common Handoff `local://assurance-relevance-t2-handoff.md` SHA-256 `c218682ff48cdf2bd96f083184db942b215ec1fac5a306e9c8cd9d72a11c5404`.
- Initial independent verification `VerifyCeremonyAssurance`, artifact SHA-256 `6ae1ce165d0cbda781c94862dcbb7f95404441dabff95de0e4ce2b98da73bac1`, completed the full boundary and returned aggregate `NOT VERIFIED`: the wording case emitted a forbidden inherited `state:verified` line, affecting AC-CER-01/03/07, and Atlas HEAD had moved from recovery baseline `23f1e51d...` to `31ab430c...`, affecting AC-CER-08.
- Consolidated repair contract `local://assurance-relevance-repair-contract.md` SHA-256 `885538202a34cc591bc2c7eb9741cc938d114c2d835f9938b95aa2c32e570bbb`; repair Handoff SHA-256 `8f8121a09671bd06b8a34ba73ebb6d8612eac323934d51eb8ac5208f1aa69c81`. The repair changed exactly `.config/agents/skills/dev-ask/evals/evals.json` and its paired wording fixture request, preserved required/forbidden events and every other case, and produced worker receipt SHA-256 `3368ad05059a3e390842b1b2eaa817ca0ca19eb7321d112386b22b34e0eaeba0` with comparator pass and exact four-event equality.
- Atlas rebind evidence: `/Users/kim/dev/atlas/app` remained clean at `31ab430c46d65e39988f749f1e55cb9dc3aae374`; the intervening user commit `chore: remove abandoned agent memory draft` touched only Atlas `.agents/AGENTS.md` and abandoned `.agents/memory` files. This plan made no Atlas write.
- Repaired-target verification `VerifyRepairedCeremony`; Handoff `local://assurance-relevance-repaired-verification-handoff.md` SHA-256 `aa8f325269843219c16cfc1a6e0976d379005e5a259953e65bab0d9967968764`; aggregate `VERIFIED`. It ran one fresh wording observation, validated four causally unaffected prior receipts without re-observation, reran final static/preservation proof, and covered exactly the unchanged eight-criterion set.
- Final review `ReviewCeremonyTransportRetry`, artifact SHA-256 `2e74cfcd8fe160aaaeb3385a3772173822705a08ac5b3613facc660cee3962c3`: Standards `PASS`, Specification `PASS`, Overall `APPROVED`, blockers `none`. One prior URL/port transport failure produced no review evidence and consumed no slot.
- Terminal Standard assessment `AssessCeremonyLearning`, artifact SHA-256 `87e57c724c947a5aba64a7584a0ceda35924da1b03f8e21c95182e1512786d31`: `NO DURABLE LEARNING`; updated/added/removed `none`; no destination, papercut, reviewed-target, assurance, maintenance, or external mutation.
- Final preservation: all sixteen target hashes, five protected D03 segments, recovery archive/status/completion, active-twin absence, frozen recovery registry objects/fixtures/scanner memberships, scanner `PRESERVED`, ADR-0001/0002, compact checklist, planner removals, plan/parser/transport and compare/observe tools, bootstrap, both AGENTS files, repository HEAD `9a57dd35040191b05738c82dbfb319708bfc7a20`, and empty staging passed. The final Git status set contained only the sixteen target paths, this plan's managed projection, and fourteen accounted pre-existing user/recovery paths.

### Decisions and terminal accounting

- Kept the frozen parent acceptance/proof set unchanged through repair. Fixed the under-specified wording fixture request instead of weakening comparator rules, deleting the forbidden event, changing required events, or promoting a fixture/path into a criterion.
- Treated Atlas `31ab430c...` as an unrelated current-user-work rebind under `BLK-CER-USER-WORK-DRIFT`; did not rewrite recovery history or mutate the external repository.
- Attempts: T1 `1/2`; T2 `1/2`; consolidated repair `1/2`. Run-wide post-assurance repair token: `consumed 1/1 by REPAIR-CER-01`.
- Review budget: original initial review `run once`; original review rerun `unused`; grant-scoped review `none`. The one pre-review transport failure was safely retried once and consumed no semantic or review budget.
- Same-plan exhaustion checkpoints and grant/opinion dispositions: none. Integration: none. Terminal Standard learning assessment: `1/1`. Mutating Learning Candidates and originating papercut IDs: none.
- Route impact: unchanged. No required task, criterion, check, blocker, stale consumable result, failed dependency, or authorized delivery action remains.

### Residual risk and handoff

- `ADV-REC-01` remains terminal residual risk outside this outcome: the scanner's preserved expectation is `69aa97070cc5b1dca8b7487f301b1ba505d2cb29995c1bece4a73a3d807b8070`, while unchanged `.agents/papercuts.json` is `7149beaed07fffbb41cd339399b6bb6d6fd1020accd11ddcb0277060d92ad901`. It authorized no scanner or papercut mutation.
- `ADV-CER-SAME-MODEL-01` remains terminal residual risk: verifier and reviewer used distinct identities, prompts, and contexts but the same `openai-codex/gpt-5.6-sol` model family. The Task Contract did not require model-family separation.
- Completion receiver: current `dev-ask` completion presentation to the human owner. Staging, commit, push, release, deployment, and shipping remain unauthorized and unperformed.
