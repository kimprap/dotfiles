# Wait Projection and Post-Exhaustion Rethink
**Datetime**: 2026-08-31-1450
**Scope**: Plan-root wait discipline, same-session post-exhaustion continuation-Ask refinement, and two permanent backend catalog cases
**Summary**: Project the existing Hub no-poll rule into plan orchestration and require the same parent session to challenge its own post-2/2 continuation mechanism before presenting an Ask. Preserve the mechanical root, D03 continuation authority, manual-only `rethink` discovery boundary, current eval harness, and every excluded workflow surface.
**Status**: DONE
**Completed At**: 2026-08-31-1704

## Objective

- Outcome: OUT-WPR-01
- Observable end state: One exact five-file cutover where a blocked plan root uses automatic delivery or one indefinite `hub wait`, and the same-session parent explicitly loads `skill://rethink` on its own draft post-2/2 continuation-Ask mechanism before presentation.
- Progress signal: Only an owned acceptance criterion closing or an exact blocker changing state; wait counts, elapsed time, token use, child count, and transcript length are never progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-WPR-USER | Explicit human scope and architecture authority | `authority://wait-rethink/final-revision-2026-08-31` | “Revised proposal handoff — wait projection + post-exhaustion rethink,” including the final correction that the same-session parent/Main challenges its own draft Ask mechanism and no advisory child or exhausted worker is used | Authorizes only the five-file procedure/eval cutover in this plan after native plan approval; forbids ADR, Route-owner, helper, schema, product-repair, and shipping expansion. |
| AUTH-WPR-D06 | Active orchestration authority | `docs/adr/0002-executor-plans-and-orchestration.md#d06--orchestrator-binding` | SHA-256 `28644815d8ac5d74fc56a288953ea1e7ca211c6d627b619a72561a3b7fa2294a` | Preserve the root as the mechanical implementation control plane. The authorized rethink hook is a quality gate on the parent’s own human-facing Ask, not semantic work on, diagnosis of, or review of the child target. |
| AUTH-WPR-D03 | Active attempt and continuation authority | `docs/adr/0003-bounded-assurance-and-repair.md#d03--post-assurance-repair` | SHA-256 `341959a1877d76ec6da0d6cafc302fdb4089ac22c60acef3448a80dd6fcddf73` | Preserve attempt one plus at most one eligible attempt two, the one repair token, blocked `IN_PROGRESS` state, and explicit-human-only continuation receipt and fresh cycle. |
| AUTH-WPR-D13 | Active clean-cutover authority | `docs/adr/0001-dev-workflow-authority-and-routing.md#d13--clean-cutover` | SHA-256 `a4406b0cdf28c93fc5801ba3eb17e8073c6fafe0e4fa95a8214242387da77978` | Synchronize the complete affected inventory atomically and leave no alternate wait, rethink, or compatibility path. |
| AUTH-WPR-RETHINK | Existing explicit advisory method | `skill://rethink` | SHA-256 `06e0cc8ba2124b9319c555fa3934842fbb9c79a29c412acdbcce493a35976118`; frontmatter `disable-model-invocation: true` | Permit one explicit parent load only at the named post-2/2 continuation-Ask boundary; the skill remains byte-unchanged, undiscoverable by ordinary model invocation, non-implementing, and the sole source of truth for its result form. |
| AUTH-WPR-HUB | Current native control capability | `runtime://hub/wait` | Active 2026-08-31 contract: automatic job delivery; one `hub wait` with `timeoutMs: 0` is indefinite; Hub use is event-driven rather than status polling | Project the existing capability into the narrow root procedure and synthetic backend case; do not add a provider helper or live-duration test. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-WPR-WAIT | AUTH-WPR-USER + AUTH-WPR-D06 + AUTH-WPR-HUB | Add the user-supplied wait sentence exactly once beneath the root’s allowed observe/control paragraph. Automatic delivery is preferred; when no other admissible action exists, exactly one indefinite wait is allowed; repeated finite unchanged-child waits are forbidden. |
| DEC-WPR-ASK-CONTEXT | AUTH-WPR-USER final correction | Run `rethink` in the same parent session and turn that authored the draft post-2/2 continuation Ask. The candidate is that Ask’s proposed mechanism. A context-free advisory child, the exhausted worker, a transcript, a Handoff restatement, or a packet of Main-authored claims is rejected because it does not challenge the tunneled Ask author. |
| DEC-WPR-ASK-BOUNDARY | AUTH-WPR-USER + AUTH-WPR-D06 | Treat the hook as a quality gate on an existing human-facing proposal. It performs no child-target diagnosis, repair, smoke, closure, Handoff admission, lifecycle transition, continuation authorization, or independent root grading; an absent or incomplete result under the current skill contract makes the Ask ineligible, while only the complete corrected proposal may be presented. No D06 or other ADR amendment is authorized. |
| DEC-WPR-CONTINUATION | AUTH-WPR-D03 | Attempt two, Build repair, and non-post-exhaustion Asks never load `rethink`. The rethink result never authorizes continuation. Only the unchanged explicit human authorization rule can create a continuation receipt and fresh attempt-one/two cycle. |
| DEC-WPR-EVAL | AUTH-WPR-USER + AUTH-WPR-D13 | Add exactly `B-PLAN-WAIT-NO-POLL` and `B-CONTINUATION-RETHINK` to `evals.json` and exactly their two fixture `case.json` files. Keep both out of `EXECUTOR_PLAN_CASE_IDS`; leave observer, comparator, scanner, all existing cases, and all other fixtures byte-unchanged. |
| DEC-WPR-EXCLUSIONS | AUTH-WPR-USER | Do not add `retrace`, progressive commits, attempt-two/Build-repair rethink, a new stage/helper/envelope/schema/store/owner, a preflight or Handoff sealer, a Context builder, an artifact helper, compact-tail/Handoff/combined-Ask fixtures, ADR/INDEX changes, product repair, or `rethink` discoverability. Reconcile remains accepted. |

## Scope, non-goals, and prohibited effects

- Read surfaces: The exact current procedure, authority, catalog, fixture, and harness surfaces listed below.

- The exact current sections `## Keep the root mechanical` in `.config/agents/skills/dev-implementation/references/plan-orchestration.md`, `## Plan root boundary` and `## Attempts and continuation` in `.config/agents/skills/dev-implementation/SKILL.md`, and complete `.config/agents/skills/rethink/SKILL.md`.
- `docs/adr/0001-dev-workflow-authority-and-routing.md` D13, `docs/adr/0002-executor-plans-and-orchestration.md` D06/D09, `docs/adr/0003-bounded-assurance-and-repair.md` D03, and `docs/adr/INDEX.md` only as protected authority.
- `.config/agents/skills/dev-ask/evals/evals.json`; the comparable `B-RETRY`, `B-T4-REPAIR-REMAINING-BLOCKER`, `B-HANDOFF`, `B-PLAN-TAIL-OMITTED`, and DWO backend cases; the fixture contract; and unchanged `observe_case.py`, `compare_trace.py`, and `scan_stale_contracts.py` behavior.

- Change surfaces: Exactly the five repository files listed below.

1. `.config/agents/skills/dev-implementation/references/plan-orchestration.md`
2. `.config/agents/skills/dev-implementation/SKILL.md`
3. `.config/agents/skills/dev-ask/evals/evals.json`
4. New `.config/agents/skills/dev-ask/evals/fixtures/b-plan-wait-no-poll/case.json`
5. New `.config/agents/skills/dev-ask/evals/fixtures/b-continuation-rethink/case.json`

- Non-goals: Every exclusion below remains outside this plan.

- No change to Reconcile’s accepted product outcome or any implementation artifact from that execution.
- No generic retry redesign, transcript reconstruction, independent evidence audit, planner/parser/transport change, compact-path change, assurance-tail change, test-portfolio audit, documentation campaign, or adjacent cleanup.
- No change to the `rethink` skill, its frontmatter, or its current method; the plan and catalog do not restate its result grammar or body.
- No live long-running child, elapsed-duration benchmark, token measurement, repeated-wait reproduction, or provider-specific timing experiment.

- Prohibited effects: Every prohibition below is mandatory.

- Any write to an ADR, `docs/adr/INDEX.md`, `compact-checklist.md`, `rethink/SKILL.md`, eval observer/comparator/scanner, `EXECUTOR_PLAN_CASE_IDS`, additive/DWO scanner inventories, an existing fixture, or any existing registry object.
- Any hook at attempt two, post-assurance Build repair, a non-post-exhaustion Ask, compact completion, Handoff admission, verification, review, learning, audit, shipping, or completion presentation.
- Any fresh advisory child, exhausted-worker reuse, transcript/Handoff/packet candidate, new Route owner, new task/stage/helper/schema/envelope/store/cache/ledger, compatibility path, service, watcher, credential use, staging, commit, push, release, or deployment.
- Any wording that permits attempt three, resets the repair token, lets a rethink result authorize continuation, copies that result’s grammar or body, adds compact-tail semantics, or makes `rethink` model-discoverable.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-WPR-PROCEDURE | Repository skill/procedure text | AUTH-WPR-USER, AUTH-WPR-D06, AUTH-WPR-D03 | Modify only the two named Markdown files at the exact anchors and within the exact behavior below; reversible by restoring their bound base bytes before delivery. |
| EFF-WPR-EVAL | Repository eval catalog and two new fixtures | AUTH-WPR-USER, AUTH-WPR-D13 | Add exactly two registry objects and two regular UTF-8 JSON fixture files; preserve every existing object, fixture, and harness script. |
| EFF-WPR-EVIDENCE | Disposable verification evidence outside the repository | AUTH-WPR-USER, existing observer/comparator contract | Fresh no-overwrite roots only; no live child or production effect; retain locators through independent verification, then clean them under the existing evidence-root policy. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-WPR-WAIT | Root observe/control wait procedure | T1 | Exact DEC-WPR-WAIT sentence and two-branch state-trace semantics | T1 |
| CONTRACT-WPR-ASK | Same-session post-2/2 continuation-Ask quality gate | T1 | DEC-WPR-ASK-CONTEXT, DEC-WPR-ASK-BOUNDARY, and DEC-WPR-CONTINUATION; portable `parent/root` maps to current OMP Main | T1 |
| CONTRACT-WPR-EVAL | Backend catalog and fixture transport | T1 | Registry schema v2; backend/hard/full trace; exact request parity with `{additional_files: [], inputs, scripted_replies: []}` fixtures; existing observer/comparator behavior | T1 |
| CONTRACT-WPR-PRESERVE | Closed D13 preservation boundary | T1 | AUTH-WPR-D06/D03/D13/RETHINK identities; exact protected case and script identities in ANC-WPR-PRESERVE | T1 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-WPR-WAIT-PROCEDURE | `.config/agents/skills/dev-implementation/references/plan-orchestration.md`, `## Keep the root mechanical` | T1 | SHA-256 `7272eb8b285d1a6461c6a2760692989e1f85c198cadbdbdedc4c49436355a634` | `dev-implementation/SKILL.md` plan-backed read seam; `B-PLAN-WAIT-NO-POLL` | AC-WPR-01, AC-WPR-02 |
| TGT-WPR-ASK-PROCEDURE | `.config/agents/skills/dev-implementation/SKILL.md`, `## Attempts and continuation` | T1 | SHA-256 `bb913b2b8684485d421142a35a33f142bdcdf30ea7d1b0c6260f5811b092a227` | Plan-backed parent/backend; `B-CONTINUATION-RETHINK` | AC-WPR-03, AC-WPR-04, AC-WPR-05 |
| TGT-WPR-REGISTRY | `.config/agents/skills/dev-ask/evals/evals.json` | T1 | SHA-256 `1eef352395cbc5866a52bbadbbc7acce1fe436d38755e46939030e11fd5504f0`; 186 cases; both new IDs absent | Existing observer/comparator/scanner; two new fixtures | AC-WPR-02, AC-WPR-04, AC-WPR-06 |
| TGT-WPR-WAIT-FIXTURE | `.config/agents/skills/dev-ask/evals/fixtures/b-plan-wait-no-poll/case.json` | T1 | Absent at planning; directory absent | `B-PLAN-WAIT-NO-POLL`; observer/comparator | AC-WPR-02, AC-WPR-06 |
| TGT-WPR-ASK-FIXTURE | `.config/agents/skills/dev-ask/evals/fixtures/b-continuation-rethink/case.json` | T1 | Absent at planning; directory absent | `B-CONTINUATION-RETHINK`; observer/comparator | AC-WPR-04, AC-WPR-06 |
| TGT-WPR-FINAL | Sorted changed-path/SHA-256 manifest and evidence identities in OUTP-WPR-T1 | T1 | Absent until worker smoke settles | Fresh `dev-verification`, backend review and learning | AC-WPR-05, AC-WPR-07 |

## Execution policy

- Assurance: standard
- Topology: full-orchestration, one shared lineage
- Max concurrency: 1
- Isolation: shared repository tree with exact five-file target ownership; disposable semantic observations outside the repository
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 rechecks every mutable and protected base identity before writing. Any semantically material drift stops for D02 comparison; unrelated user work is preserved. No other child may overlap these five paths or the disposable observation roots.
- Decomposition: One cohesive `craft-skill` work task owns procedure text, catalog cases, fixtures, smoke, and the final manifest so executable prose and permanent traces cannot drift. The optional standard profile tail is omitted; successful OUTP-WPR-T1 goes to fresh `dev-verification`, after which the existing backend schedules one review and terminal learning exactly once.
- Effect limit: EFF-WPR-PROCEDURE, EFF-WPR-EVAL, EFF-WPR-EVIDENCE
- Orchestrator profile: `orchestrator-role-profile/v1`; `assess-plan-backed`; `full-orchestration`; `downgrade: none`; `PROMOTE-SERIAL-DEFAULT`; missing or mismatched capability stops `transport-unavailable` and never authorizes root work.

## Tasks

- [x] T1. Cut over wait and continuation-Ask discipline
  completed 2026-08-31-1704
  - Owner: craft-skill
  - Intent: Make blocked-plan waiting event-driven and force the Ask author to challenge its own exhausted-run continuation mechanism.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-WPR-WAIT-PROCEDURE, TGT-WPR-ASK-PROCEDURE, TGT-WPR-REGISTRY, TGT-WPR-WAIT-FIXTURE, TGT-WPR-ASK-FIXTURE, TGT-WPR-FINAL
  - Contracts: CONTRACT-WPR-WAIT, CONTRACT-WPR-ASK, CONTRACT-WPR-EVAL, CONTRACT-WPR-PRESERVE
  - Criteria: AC-WPR-01, AC-WPR-02, AC-WPR-03, AC-WPR-04, AC-WPR-05, AC-WPR-06, AC-WPR-07
  - Effects: EFF-WPR-PROCEDURE, EFF-WPR-EVAL, EFF-WPR-EVIDENCE
  - Output: OUTP-WPR-T1
  - Receiver: dev-verification
  - Verification: VR-WPR-01, VR-WPR-02, VR-WPR-03, VR-WPR-04, VR-WPR-05, VR-WPR-06, VR-WPR-07
  - Lineage: shared

### T1 execution contract

1. Explicitly load `skill://craft-skill`. Re-read only the exact mutable sections, the five comparable catalog objects, both fixture-shape examples, and the protected anchors. Rehash all TGT/ANC bases; require the registry to contain 186 cases with both new IDs absent and both new fixture directories absent. Canonically hash every existing registry object before mutation so preservation is object-based rather than line/order-based.
2. In `plan-orchestration.md`, immediately after the paragraph that permits the root to “observe and control the same child” and before the paragraph that prohibits semantic root work, insert exactly:

   > When the root has no other admissible action and is waiting on a bound child, use automatic delivery or exactly one indefinite `hub wait`. Repeated finite waits against the same still-running child are forbidden.

   Add no mirror sentence to the compact checklist, SKILL root-boundary summary, ADR, Hub wrapper, or another reference.
3. In `dev-implementation/SKILL.md`, insert the following two paragraphs after the attempt-one/attempt-two paragraph ending “Attempt three is forbidden.” and before the existing “After exhaustion” paragraph. Preserve that existing paragraph and all D03/repair prose byte-for-byte outside the insertion:

   > After attempts exhaust 2/2, in the same parent session and turn that would otherwise present a continuation Ask, treat that draft Ask’s proposed continuation mechanism as the named candidate. Before presenting the Ask, bind the candidate’s materially changed falsifiable hypothesis, predicted discriminating observation, remaining blockers, and proposed cycle including exactly what the Ask would authorize, then explicitly load `skill://rethink` on that candidate. The candidate is the parent’s own draft mechanism, not a child transcript, Handoff restatement, packet for a fresh advisory child, or the exhausted worker’s context. Do not implement the candidate, spawn a rethink child, or load `rethink` for attempt two, Build repair, or any Ask outside post-exhaustion continuation.
   >
   > Present only the complete corrected proposal returned by the loaded skill. If the skill returns no complete corrected proposal under its current contract, do not present the continuation Ask. This is a same-session quality gate on the parent’s human-facing Ask, not diagnosis or review of the child target, lifecycle authority, repair, smoke, closure, or Handoff admission. The root does not independently diagnose, grade, parse, or restate that result; it only gates presentation on the skill producing a complete corrected proposal.

   Keep the repository prose provider-neutral: “parent” maps to the current OMP Main. Do not replace it with a fresh child, exhausted worker, transcript, packet, or Handoff-locator review. The unchanged next paragraph remains the sole continuation-receipt/fresh-cycle authority.
4. Add `B-PLAN-WAIT-NO-POLL` immediately after `B-PLAN-TAIL-OMITTED` in `evals.json`. Use the common exact catalog fields `absent_capabilities: []`, `layer: "backend"`, `repetition_tier: "hard"`, `required_capabilities: []`, `scripted_replies: []`, and `trace_scope: "full"`, plus:

   - Criterion: `When the plan root has no other admissible action and waits on one bound still-running child, automatic delivery or exactly one indefinite hub wait precedes mechanical Handoff admission, and a second finite wait against unchanged from/running state is forbidden.`
   - Proof: `Fresh read-only backend state trace of plan-root wait discipline and Handoff admission.`
   - Expected artifacts: `plan-root wait state trace`, `current Common Handoff`.
   - Expected assurance profile: `standard`; first owner: `backend`; mode: `full orchestration`; owners in order: `backend`, `worker`; route: `dev-implementation backend`.
   - Expected gates in order: `bound plan, root, child, and Task Contract`, `full-orchestration with downgrade none`, `root has no other admissible action`, `automatic delivery or one indefinite wait`, `current Common Handoff before admission`.
   - Expected outcome: `automatic delivery or one indefinite wait precedes mechanical Handoff admission; unchanged-state finite repeat refused`.
   - Exact request, copied byte-for-byte into the registry and fixture:

     `Read-only backend state-trace matrix over two independent branches from the same bound plan-root snapshot. PLAN-WAIT is parser-valid and ROOT-WAIT has full-orchestration with downgrade none, one exact Task Contract, and distinct still-running CHILD-WAIT after one synthetic dispatch. The root has no other admissible action. In branch A, automatic delivery supplies CHILD-WAIT's current Common Handoff and the root mechanically admits it. In branch B, automatic delivery is unavailable, so the root uses exactly one indefinite hub wait bound to CHILD-WAIT; CHILD-WAIT then supplies its current Common Handoff and the root mechanically admits it. Separately classify a counterfactual state with one prior finite wait and unchanged from CHILD-WAIT/still-running state as invalid, and reject the proposed second finite wait without invoking it. Emit only the finite synthetic state trace. Do not launch or wait on a live child, inspect a transcript, perform root semantic work, or report elapsed-duration or token metrics.`

   - Required events, exactly and in order:
     1. `snapshot:plan-root|owner:backend|output:ROOT-WAIT bound to PLAN-WAIT, CHILD-WAIT, one exact Task Contract, and full-orchestration downgrade none`
     2. `state:running|owner:worker|output:CHILD-WAIT still running after one synthetic dispatch; root has no other admissible action`
     3. `snapshot:auto-delivery|owner:backend|output:branch A receives CHILD-WAIT current Common Handoff through automatic delivery; status queries 0`
     4. `handoff:admitted|owner:backend|output:branch A mechanically admits CHILD-WAIT identity, task, attempt, dependency, target/effect, smoke, closure, test, receiver, and papercut fields`
     5. `snapshot:indefinite-wait|owner:backend|output:branch B uses exactly one indefinite hub wait bound to CHILD-WAIT; finite waits 0`
     6. `state:handed-off|owner:worker|output:branch B returns CHILD-WAIT current Common Handoff after the one blocking wait`
     7. `handoff:admitted|owner:backend|output:branch B mechanically admits the same bounded Handoff fields`
     8. `snapshot:finite-repeat-rejected|owner:backend|output:counterfactual prior finite wait plus unchanged from CHILD-WAIT and still-running state makes the proposed second finite wait forbidden`
   - Forbidden events: `finite-wait-invoked`, `second-finite-wait-invoked`, `status-poll`, `sleep-loop`, `duplicate-dispatch`, `live-child-dispatch`, `transcript-read`, `root-semantic-work`, `root-target-mutation`, `handoff-admission-before-result`, `elapsed-duration`, `token-count`, `new-wait-state`, `implicit shipping`.
   - Rubric, exactly:
     1. `Require independent automatic-delivery and one-indefinite-wait branches from the same bound still-running child state with no other admissible root action.`
     2. `Require the current Common Handoff result before mechanical admission in both branches.`
     3. `Reject every invoked finite or repeated unchanged-state wait, status polling, live-child or duration/token claim, transcript inspection, duplicate dispatch, and root semantic work.`
     4. `Keep runtime wait discipline separate from executor-plan parser, transport, compact-tail, and lifecycle semantics.`
5. Add `.config/agents/skills/dev-ask/evals/fixtures/b-plan-wait-no-poll/case.json` as regular UTF-8 JSON with exactly three top-level keys in current fixture order: `additional_files: []`, `inputs.request` byte-identical to the registry request, and `scripted_replies: []`.
6. Add `B-CONTINUATION-RETHINK` immediately after `B-T4-REPAIR-REMAINING-BLOCKER` in `evals.json`. Use the same common backend/hard/full/empty-capability/empty-replies fields, plus:

   - Criterion: `Only after attempts exhaust 2/2, the same parent session and turn that would present a continuation Ask explicitly loads manual-only rethink on its own draft Ask mechanism; an absent or incomplete result blocks presentation, one complete result is presentable, no child is dispatched, and lifecycle state is unchanged.`
   - Proof: `Fresh read-only backend state trace of same-session post-exhaustion continuation-Ask refinement.`
   - Expected artifacts: `blocked frontier snapshot`, `draft continuation-Ask candidate`, `corrected rethink proposal`.
   - Expected assurance profile: `standard`; first owner: `backend`; mode: `one owner`; owners in order: `backend`, `worker`; route: `dev-implementation backend`.
   - Expected gates in order: `attempts exhausted 2/2`, `same parent session and turn`, `complete draft-Ask candidate`, `explicit skill://rethink load`, `complete corrected proposal`, `existing explicit human continuation authority remains separate`.
   - Expected outcome: `same-session result from the explicitly loaded skill remains opaque and is presentable only when complete; an absent or incomplete result withholds the Ask; lifecycle state is unchanged`.
   - Exact request, copied byte-for-byte into the registry and fixture:

     `Read-only backend state-trace matrix over independent branches around one exhausted plan. TASK-R attempt 1/2 and eligible fresh-child attempt 2/2 are complete with FIND-R2 still blocking AC-R2; attempt two loads rethink zero times and the plan remains IN_PROGRESS with its blocker Common Handoff. In the same parent session and turn that would otherwise emit the post-2/2 continuation Ask, PARENT-R drafts mechanism CAND-R with materially changed falsifiable hypothesis caller-B bypasses the intended public seam, predicted discriminating observation a bounded public-seam probe emits TRACE-B while the bypass path does not, remaining blocker FIND-R2 for AC-R2, and proposed cycle 1 authorizing only one fresh attempt-one/two cycle under the unchanged Task Contract and target. First show that an absent or incomplete result from the loaded skill withholds the continuation Ask. Then PARENT-R explicitly loads skill://rethink on its own draft mechanism in the same session and turn, with disable-model-invocation true unchanged and no child dispatch, and receives one complete corrected proposal under that skill's current contract; only that complete result is eligible for presentation, but do not issue an interactive Ask or create authority or state. Treat the result as opaque: do not encode or assert its lead line, token vocabulary, or body fields. Treat attempt two, Build repair, and a non-post-exhaustion Ask as zero-load controls. Do not use a transcript, Handoff restatement, fresh advisory child, exhausted worker, new schema, or new Route owner, and do not implement or start a cycle.`

   - Required events, exactly and in order:
     1. `state:running|owner:worker|output:CHILD-R2 executes eligible attempt 2/2 under the unchanged Task Contract; rethink loads 0`
     2. `state:blocked|owner:backend|output:attempts exhausted 2/2; FIND-R2 still blocks AC-R2; blocker Common Handoff sealed; plan remains IN_PROGRESS`
     3. `continuation:candidate|owner:backend|output:CAND-R is PARENT-R's draft Ask mechanism binding changed hypothesis caller-B bypasses the intended public seam, predicted TRACE-B discrimination, remaining FIND-R2 for AC-R2, and proposed cycle 1 with exact authorization boundary`
     4. `continuation:ask-withheld|owner:backend|output:branch with an absent or incomplete skill result has presentation count 0`
     5. `continuation:rethink-loaded|owner:backend|output:PARENT-R explicitly loads skill://rethink in the same session and turn on its own draft Ask mechanism; disable-model-invocation true unchanged; child dispatches 0`
     6. `continuation:result-complete|owner:backend|output:skill://rethink returns one complete corrected proposal under its bound current contract; result grammar and body remain outside this case contract`
     7. `continuation:proposal-presentable|owner:backend|output:only the complete corrected proposal is eligible for the continuation Ask; interactive replies 0; authority changes 0; lifecycle transitions 0`
     8. `continuation:scope-controls|owner:backend|output:attempt-two loads 0; Build-repair loads 0; non-post-exhaustion-Ask loads 0; fresh advisory children 0; exhausted-worker reuse 0`
     9. `state:blocked|owner:backend|output:original plan, target, Task Contract, blocker frontier, attempt budget, repair-token state, and continuation-receipt count remain unchanged`
   - Forbidden events: `rethink-on-attempt-two`, `rethink-on-Build-repair`, `rethink-on-non-post-exhaustion-Ask`, `fresh-advisory-child`, `exhausted-worker-rethink`, `transcript-candidate`, `Handoff-as-candidate`, `continuation-Ask-without-complete-result`, `rethink-result-grammar-copied`, `rethink-result-body-copied`, `root-target-diagnosis`, `root-child-review`, `root-independent-grading`, `rethink-implementation`, `new-lifecycle-state`, `new-Route-owner`, `new-Handoff-schema`, `continuation-receipt-created`, `fresh-cycle-created`, `attempt-3`, `repair-token-reset`, `implicit shipping`.
   - Rubric, exactly:
     1. `Require zero rethink loads during attempt two, then an exact blocked 2/2 frontier before the quality gate.`
     2. `Require the same parent session and turn to challenge its own bound draft Ask mechanism; reject a child, exhausted worker, transcript, Handoff, or packet substitute.`
     3. `Require one explicit skill://rethink load with disable-model-invocation true unchanged, no implementation, and one complete corrected proposal under the bound current skill contract; do not inspect or restate its lead grammar or body.`
     4. `Block presentation when the skill result is absent or incomplete; only one complete corrected proposal is presentable.`
     5. `Preserve the existing human-only continuation receipt, attempt budget, repair token, Task Contract, target, blocker frontier, and Route ownership with no full cycle in this trace.`
     6. `Classify rethink as a same-session quality gate on the parent's human-facing Ask, never diagnosis or review of the child target.`
7. Add `.config/agents/skills/dev-ask/evals/fixtures/b-continuation-rethink/case.json` with the same exact three-key fixture shape and byte-identical request. Add neither new ID to `EXECUTOR_PLAN_CASE_IDS`, `ADDED_IDS`, any DWO inventory, or another script; the catalog is `evals.json`, and this plan authorizes only registry plus paired fixture registration.
8. Preserve current local JSON style without reformatting unrelated registry objects. Parse the complete registry and fixtures; require 188 unique case IDs, exact registry/fixture semantic parity, and exactly the two authorized new case IDs. Run the exact static and behavioral proof in VR-WPR-01 through VR-WPR-07. Seal a sorted five-path SHA-256 manifest, the two sealed semantic observation/comparator locators, exact protected-anchor receipts, and one Common Handoff. Do not stage, commit, push, archive the plan, normalize completion, or invoke a presenter from the work child.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-WPR-01 | Root is bound to a still-running child, has no other admissible action, and needs a result | The exact wait sentence appears once at the named anchor; only automatic delivery or one indefinite wait is admissible; repeated finite unchanged-child waits are forbidden | TGT-WPR-WAIT-PROCEDURE | T1 |
| AC-WPR-02 | `B-PLAN-WAIT-NO-POLL` executes as a fresh read-only synthetic backend trace | Both delivery branches reach current-Handoff mechanical admission; the counterfactual second finite wait is rejected; no live child, transcript, duration/token metric, root semantic work, parser, compact-tail, or lifecycle behavior appears | TGT-WPR-WAIT-PROCEDURE, TGT-WPR-REGISTRY, TGT-WPR-WAIT-FIXTURE | T1 |
| AC-WPR-03 | A continuation Ask would be presented after attempts exhaust 2/2 | The same parent session/turn challenges its own draft Ask mechanism with changed hypothesis, predicted discriminating observation, remaining blockers, proposed cycle, and exact authorization boundary; no fresh child, exhausted worker, transcript, Handoff, or packet substitutes | TGT-WPR-ASK-PROCEDURE | T1 |
| AC-WPR-04 | The explicitly loaded skill returns no result, an incomplete result, or one complete corrected proposal | No result or an incomplete result blocks presentation; only the complete corrected proposal is presentable, while its grammar and body remain opaque to the plan and case; no receipt, state change, or full cycle occurs | TGT-WPR-ASK-PROCEDURE, TGT-WPR-REGISTRY, TGT-WPR-ASK-FIXTURE | T1 |
| AC-WPR-05 | Rethink activation and continuation controls are inspected | `rethink/SKILL.md` remains at its bound hash with `disable-model-invocation: true`; attempt two, Build repair, and non-post-exhaustion Asks load it zero times; D03’s explicit-human-only continuation authority remains unchanged | TGT-WPR-ASK-PROCEDURE, TGT-WPR-FINAL | T1 |
| AC-WPR-06 | Catalog and fixture inventory is compared with the bound base | Registry has exactly 188 unique cases and only the two named additions; both backend fixtures have exact request parity and no replies/files; both IDs remain outside `EXECUTOR_PLAN_CASE_IDS`; observer/comparator/scanner and every existing case/fixture are byte- or canonical-object-identical | TGT-WPR-REGISTRY, TGT-WPR-WAIT-FIXTURE, TGT-WPR-ASK-FIXTURE | T1 |
| AC-WPR-07 | Complete changed target and D13 boundary are checked after smoke | Manifest contains exactly the five authorized paths once; normal stale scan and scanner self-test pass; no stale three-attempt allowance, compact-tail semantics, new Route owner/helper/schema/ADR, product repair, unrelated mutation, or shipping effect exists | TGT-WPR-FINAL | T1 |

## Verification / Done criteria

- [x] VR-WPR-01. Inspect the exact wait insertion and protected surrounding procedure.
  - Criterion: AC-WPR-01
  - Proof class: worker smoke
  - Scenario / environment / fixture: Re-read complete `## Keep the root mechanical`; assert the user-supplied two-sentence text occurs exactly once immediately after the allowed observe/control paragraph; compare every other original line in the file with base SHA-256 `7272eb8b...` except that insertion.
  - Evidence form: Exact anchor/occurrence receipt and surgical-delta hash showing no other changed block.
  - Target recheck: TGT-WPR-WAIT-PROCEDURE
  - Receiver: dev-verification
- [x] VR-WPR-02. Execute the permanent no-poll backend case without a live child.
  - Criterion: AC-WPR-02
  - Proof class: worker smoke
  - Scenario / environment / fixture: In a fresh no-overwrite observation root outside the repository, bind `B-PLAN-WAIT-NO-POLL` with `observe_case.py` to the final target digest and `dev-implementation/SKILL.md`; execute only the bound request in one fresh read-only backend semantic context; seal; run `compare_trace.py`; then require observed events to equal the complete registry `required_events` array, not only its ordered subsequence.
  - Evidence form: Sealed observer receipt, `lean-eval-trace/v1 status=pass`, exact-event equality, no forbidden event, and no runtime child/timing/token evidence.
  - Target recheck: TGT-WPR-WAIT-PROCEDURE, TGT-WPR-REGISTRY, TGT-WPR-WAIT-FIXTURE
  - Receiver: dev-verification
- [x] VR-WPR-03. Inspect the exact same-session continuation-Ask insertion and trigger order.
  - Criterion: AC-WPR-03
  - Proof class: worker smoke
  - Scenario / environment / fixture: Re-read complete `## Attempts and continuation`; require the two new paragraphs exactly between “Attempt three is forbidden.” and the unchanged “After exhaustion” authority paragraph; map every required candidate/context exclusion to the inserted text.
  - Evidence form: Ordered anchor receipt plus byte-identical hash of the pre-existing attempt-two, exhaustion-authority, failure, and Build-repair blocks.
  - Target recheck: TGT-WPR-ASK-PROCEDURE
  - Receiver: dev-verification
- [x] VR-WPR-04. Execute the permanent continuation-rethink branch matrix.
  - Criterion: AC-WPR-04
  - Proof class: worker smoke
  - Scenario / environment / fixture: Bind, execute in one fresh read-only backend semantic context, seal, and compare `B-CONTINUATION-RETHINK` exactly as in VR-WPR-02; require exact complete-event equality and exercise absent-result, incomplete-result, complete-opaque-result, and zero-load control branches without interactive replies or a full cycle.
  - Evidence form: Sealed observer receipt, `lean-eval-trace/v1 status=pass`, exact-event equality, unchanged terminal blocked snapshot, and no forbidden event.
  - Target recheck: TGT-WPR-ASK-PROCEDURE, TGT-WPR-REGISTRY, TGT-WPR-ASK-FIXTURE
  - Receiver: dev-verification
- [x] VR-WPR-05. Prove activation, D03, and protected-method preservation.
  - Criterion: AC-WPR-05
  - Proof class: worker smoke
  - Scenario / environment / fixture: Rehash `rethink/SKILL.md`, ADR-0002, ADR-0003, and `compact-checklist.md`; inspect `disable-model-invocation: true`; inspect the changed SKILL and continuation case for the exact post-2/2-only trigger and zero-load controls.
  - Evidence form: Exact hashes `06e0cc8ba2124b9319c555fa3934842fbb9c79a29c412acdbcce493a35976118`, `28644815...`, `341959a1...`, and `1739ce7f...`; frontmatter receipt; no lifecycle-authority delta.
  - Target recheck: TGT-WPR-ASK-PROCEDURE, TGT-WPR-FINAL
  - Receiver: dev-verification
- [x] VR-WPR-06. Prove exact two-case catalog and fixture-only registration.
  - Criterion: AC-WPR-06
  - Proof class: worker smoke
  - Scenario / environment / fixture: Parse registry and both fixtures with the standard library; require the exact catalog/expected/fixture key sets, backend/hard/full metadata, 188 unique IDs, exact request/reply/additional-file parity, and absence from the exact seven-member `EXECUTOR_PLAN_CASE_IDS`. Canonically hash all 186 base objects and require equality, including `B-RETRY` `125e9cc1...` and `B-T4-REPAIR-REMAINING-BLOCKER` `92e2a823...`; rehash unchanged observer/comparator/scanner.
  - Evidence form: Static assertion output `two-case-static-validation: pass`; script hashes `9f2eeae6...`, `d0abc240...`, `7bf1576b...`; unchanged executor-plan set hash `687319a1...`; both registry/fixture parity checks pass.
  - Target recheck: TGT-WPR-REGISTRY, TGT-WPR-WAIT-FIXTURE, TGT-WPR-ASK-FIXTURE
  - Receiver: dev-verification
- [x] VR-WPR-07. Prove the closed D13 cutover and exact final target.
  - Criterion: AC-WPR-07
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test` and the normal scanner; require pass/no hits/no missing required needles. Compare the sorted changed-path manifest with the exact five Change surfaces; assert no compact/profile-tail phrase in either new case, no new Route owner/schema/helper, no ADR/INDEX/eval-script/existing-fixture delta, and no staged or external delivery effect.
  - Evidence form: Scanner self-test and normal `lean-stale-scan/v1` pass receipts, exact five-row SHA-256 manifest, protected-anchor manifest, and explicit prohibited-effect count zero.
  - Target recheck: TGT-WPR-FINAL
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-WPR-T1 | T1 | One Common Handoff binding the exact final five-path SHA-256 manifest, both semantic observation/comparator locators, VR-WPR-01 through VR-WPR-07 worker-smoke receipts, protected-anchor manifest, and applicable rule manifest | completed, blocked, failed, transport-unavailable, authority-change-required | dev-verification | Common Handoff: on success, mechanically admit exact task/attempt, target/effect, criteria/smoke, fixture, preservation, receiver, and papercut fields and dispatch fresh verification. On non-success, retain the same receiver in the Task Contract but the backend preserves the Handoff and frontier without verifier dispatch, hidden repair, or presentation. |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-WPR-BASE-DRIFT | craft-skill | Exact changed path/object, old/new hashes, semantic comparison, affected contract/criterion, and preserved user-work note | T1 | Lifecycle-only plan bytes may continue; any change to authority, scope, target, behavior, acceptance, or proof returns for D02 reapproval | Every mutable/protected base is exact or a human-approved revised contract is bound. |
| BLK-WPR-ROOT-BOUNDARY | craft-skill | Exact proposed behavior that would diagnose/review the child target, grant lifecycle authority, require a fresh semantic owner, or amend D06 | T1 | AUTH-WPR-USER explicitly forbids silent ADR/owner expansion; return `authority-change-required` | The implementation remains solely a same-session quality gate on the parent’s own human-facing Ask with no child-target or lifecycle effect. |
| BLK-WPR-EVAL-TRANSPORT | craft-skill | Failed bind/seal/compare step, missing capability, exact case/target digest, and all completed static receipts | T1 | No easier live-child, source-text-only, or unsealed substitute is authorized | Fresh read-only backend semantic execution can produce sealed receipts for both exact cases on the final target. |
| BLK-WPR-PRESERVATION | craft-skill | Unexpected path/object/inventory/hash delta and its dependency cone | T1 | In-scope accidental edits may be restored; any required extra caller/script/ADR/fixture needs human scope change | Exactly five changed paths, 188 cases with two additions, and every protected identity are re-established. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-WPR-PROCEDURE | Mutable procedure baseline | `plan-orchestration.md@sha256:7272eb8b285d1a6461c6a2760692989e1f85c198cadbdbdedc4c49436355a634`; `dev-implementation/SKILL.md@sha256:bb913b2b8684485d421142a35a33f142bdcdf30ea7d1b0c6260f5811b092a227` | Fix the only two prose anchors and enable surgical preservation checks. |
| ANC-WPR-EVAL | Mutable catalog baseline | `evals.json@sha256:1eef352395cbc5866a52bbadbbc7acce1fe436d38755e46939030e11fd5504f0`; 186 cases; both new IDs and directories absent | Fix additive-only registry and fixture state. |
| ANC-WPR-PRESERVE | Protected executable and case inventory | `observe_case.py@sha256:9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd`; `compare_trace.py@sha256:d0abc240b7e0d0e88f215c5c33f31018a945213d0af598fbd322b4e95aa5a3a6`; `scan_stale_contracts.py@sha256:7bf1576b313d7f1734d08a23b1011ea549b1233cfa7ed92044f6baba5b7f7296`; `EXECUTOR_PLAN_CASE_IDS` canonical hash `687319a127f4333dea8585c0d520049358c22421eba97c73b2e1339b11918fc7`; `ADDED_IDS` canonical hash `2875d356ba7c2894c2096c58766c297b7297dd5c2990ae8ceb4419d820f2495b`; `B-RETRY` canonical hash `125e9cc1edb3db0c051190d08b18614d11f49ea1b7f203b8af297c5a51232256`; `B-T4-REPAIR-REMAINING-BLOCKER` canonical hash `92e2a82395d85eb93d4ee8e1c2c39f2979c840b3043c5a97c6ee2b3e47b92544` | Prove fixture-only catalog registration and unchanged retry/continuation/parser ownership. |
| ANC-WPR-AUTHORITY | Protected durable authority | ADR-0001 `a4406b0c...`; ADR-0002 `28644815...`; ADR-0003 `341959a1...`; INDEX `4fc42933...`; compact checklist `1739ce7f...`; rethink `06e0cc8ba2124b9319c555fa3934842fbb9c79a29c412acdbcce493a35976118` | Preserve D13, D06, D03, discovery, compact behavior, and model-invocation disablement without ADR churn. |
| ANC-WPR-MAIN-CONTEXT | Human-confirmed context boundary | AUTH-WPR-USER final same-session revision: the continuation-Ask author challenges its own immediately preceding draft mechanism; no fresh child, exhausted worker, transcript, Handoff restatement, or Main-authored packet substitute | Prevent a superficially independent but context-free check from replacing the requested tunnel-vision interruption. |
| ANC-WPR-HUB | Native runtime fact | AUTH-WPR-HUB current automatic-delivery and indefinite-wait clauses | Re-attest at execution; capability mismatch is `transport-unavailable`, never a reason to poll or add a helper. |

- Assumptions: none

## Completion Summary

- Outcome: Delivered the exact five-file cutover. Plan-root waiting is event-driven, and post-2/2 continuation-Ask presentation now requires same-session explicit `skill://rethink` refinement of the parent’s own draft mechanism.
- Material decisions: Preserved the mechanical root, D03 human-only continuation authority, manual-only rethink discovery, compact behavior, existing harness scripts and fixtures, and the no-shipping boundary; added no ADR, helper, schema, Route owner, compatibility path, or alternate retry behavior.
- Target: `local://wpr-t1-final-manifest-8e30d0e0.json@sha256:7a6790065870455c5ea94435f6e684e61701af065195e7ecbe40c2d8210d51df`; five-path target `sha256:8e30d0e08a4ddacd06ae8b7a651ba44c0eb2b96a22b8d1a8b9de63e43e4bddf1`.
- Evidence: Worker Handoff `local://wpr-t1-common-handoff-8e30d0e0.md@sha256:5219eec1a7049926de43b0fdb22b267de47c606b465d3c198722c72ffc1b5d0b`; independent aggregate `local://wpr-independent-verification-aggregate-8e30d0e0.json@sha256:522e3cf5b6eebb066c0c0232df42a5fa8a80edd12e6ca6544cde40b7308a82ac` with all seven criteria `VERIFIED`; final review `agent://WprReview` with Standards `PASS`, Specification `PASS`, and overall `APPROVED`; terminal learning `local://wpr-learning-result-8e30d0e0.md@sha256:db57c7cf8fb6c5e4299d7a64e443c5cd293bb530cba82a1fa537ff4fb862fabe` with `NO DURABLE LEARNING`.
- Residual risk: None identified by verification or review. Repository changes remain unstaged; shipping was not authorized.
