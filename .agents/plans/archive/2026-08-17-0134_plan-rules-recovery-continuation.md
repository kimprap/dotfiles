# Resume exhausted repair loops in one plan

**Datetime**: 2026-08-17-0134
**Authority kind**: local-authority
**Mode**: standard
**Scope**: Human-gated same-plan continuation for standard/high-consequence work after the existing post-assurance repair token or review rerun is exhausted
**Summary**: Keep the inherited 1-of-1 repair and review-rerun limits as checkpoints. Persist one concise recovery record, ask for Continue or Second opinion, and resume the same outcome only from explicit recorded authority and progress-bearing evidence.
**Status**: DONE
**Completed At**: 2026-08-17-1728

## Objective

- Outcome: OUT-PLAN-RECOVERY
- Observable end state: Standard and high-consequence work keeps its existing one inherited post-assurance repair token, sole review rerun, and two semantic attempts per Task Contract revision. When the token or rerun is consumed and named work remains, mutation stops until one compact record is persisted on the same authoritative plan and the human chooses Continue or Second opinion; eligible work then resumes under the same Datetime, slug, outcome, authority URI, route, owner, and plan.
- Progress signal: A named `AC-...` advances, a stable blocker closes, or authorized evidence materially changes a falsifiable hypothesis. A human grant supplies continuation authority only; it never substitutes for progress or waives no-progress, safety, staleness, or proof gates.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-REC-USER | explicit human revision authority | current conversation | REC-B01 through REC-B08 plus REC2-B01 through REC2-B06 | Revise this exact local-authority plan only; native approval of the new complete bytes is required before execution; no shipping |
| AUTH-REC-D03 | active workflow decision | `docs/adr/0003-bounded-assurance-and-repair.md` D03 | git `9a57dd35040191b05738c82dbfb319708bfc7a20` | Reopen only the repair-count checkpoint and same-plan resume clause; preserve D04, D09, and D22 |
| AUTH-REC-ATLAS | observed failure evidence | `/Users/kim/.omp/agent/sessions/-dev-atlas-app/2026-08-15T16-22-44-587Z_01a0063b-9a6b-7000-8284-a657b1060353.jsonl` | session `01a0063b`; plan `f24039fac03e64034ccc4e07d1d7f51cd49f7f7ca31ee9141e45f77e94024f9b`; repaired target `6c8eb80425a35e71935c175445b16c90faaf66981530f8151e4781d7cdce83d9` | Evidence that a consumed token and review rerun forced a successor plan to continue the same outcome; no Atlas mutation authority |
| AUTH-REC-LEAN | observed failure evidence | `.agents/plans/archive/2026-08-13-1603_dev-workflow-lean-ordinary-path.md`; `.agents/plans/archive/2026-08-15-1744_receipt-skill-digest-binding.md` | predecessor `OUT-DEV-WORKFLOW-LEAN-ORDINARY-PATH`; frozen terminal Handoff `67007e6031082ce8b09db3bda228a20f2aaba8a7dd9f175ed410a63282599162`; residual Datetime `2026-08-15-1744` | Evidence that `REVIEW-LEAN-B03` moved to a fresh outcome because the predecessor lifecycle was exhausted |
| AUTH-REC-BASE | repository state | `/Users/kim/.dotfiles` | git `9a57dd35040191b05738c82dbfb319708bfc7a20`; current `dev-implementation/SKILL.md` SHA-256 `753424649afc59f7d7a66e7b22573aef72e0ffe57734a38c632e75227824856b`; preexisting user-owned planner-removal and unrelated working-tree changes | Layer only the named recovery changes onto current bytes; preserve unrelated user work and never recreate the removed custom planner |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-REC-CHECKPOINT | AUTH-REC-USER plus AUTH-REC-D03 | Keep the original repair token consumed and preserve the current initial-review/rerun counters; eligible exhaustion becomes a human checkpoint rather than automatic terminal failure or automatic retry |
| DEC-REC-GRANT | AUTH-REC-USER | Continue authorizes exactly one additional grant-bound cycle of the existing repair contract with the same owner. Second opinion is one human grant with an advisory prelude and no third prompt when it supports the same route; authority-change or no-progress advice blocks the cycle |
| DEC-REC-REVIEW | AUTH-REC-USER plus AUTH-REC-D03 | A granted cycle consumes an unused original initial review or original rerun before any grant-scoped review; grant-scoped review exists only when both original review slots were already consumed, and no grant restores a consumed original counter |
| DEC-REC-PERSIST | AUTH-REC-USER | Persist the exact compact exhaustion, grant, and optional-opinion record on the same authoritative plan before readiness; the newest record controls continuation and older records remain historical |
| DEC-REC-PROGRESS | AUTH-REC-USER plus D03 | Explicit grants may recur after later eligible exhaustion, but revision churn, another session, another agent, elapsed time, or the grant itself cannot create progress or restore the original token |
| DEC-REC-PRESERVE | AUTH-REC-USER | Preserve compact, D04 assurance boundaries, D09 todo projection, route presentation, plan parsing/storage/approval, removed custom-planner state, and Atlas product behavior |

## Scope, non-goals, and prohibited effects

- Read surfaces: The exact recovery, rerun-eligibility, and stop clauses in `dev-implementation`, `dev-handoff`, `dev-code-review`, the compact checklist, `WORKFLOW.md`, ADR-0003 D03, the five named eval cases with two editable fixture directories, and the two cited historical failures.
- Change surfaces: Only TGT-REC-CHECKPOINT, TGT-REC-PERSISTENCE, and TGT-REC-EVALS.
- Non-goals: Plan-rule or task-index changes; parser, route-template, todo-phase, storage-helper, archive, native-review, D04, D09, or approval changes; recreation of a custom planner; a new recovery skill, stage, todo, Task Contract type, plan, outcome, sidecar, or runtime ledger.
- Prohibited effects: Do not edit either AGENTS.md file, plan rules, executor-plan parser/tests, plan helper/extension, dev-verification, dev-diagnosing-bugs, ADR-0001/0002, ADR index, Atlas files or rule link; do not recreate the removed custom planner persona, OMP/Grok planner definitions, planner role profile, or planner transport scripts; do not stage, commit, push, release, deploy, or mutate external state.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-REC-CONTRACT | repository configuration and active ADR text | AUTH-REC-USER | Edit only the six policy/document targets named by TGT-REC-CHECKPOINT and TGT-REC-PERSISTENCE; ordinary file reversion remains possible before delivery |
| EFF-REC-EVAL | repository evaluation fixture | AUTH-REC-USER | Edit only `evals.json`, `fixtures/b-retry/case.json`, and `fixtures/b-t4-repair-remaining-blocker/case.json`; preserve all other fixture bytes |
| EFF-REC-PLAN | local-authority lifecycle state | AUTH-REC-USER | Edit only this same OMP local plan for ordinary task progress or an actual exhaustion/grant record; automatic existing projection sync owns repository bytes |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-REC-CHECKPOINT | Existing 1-of-1 repair and rerun as a human checkpoint with grant-scoped continuation | T1 | AUTH-REC-USER and D03 | T2, T3 |
| CONTRACT-REC-RECORD | Exact concise plan record, newest-record readiness, same-plan identity, and optional opinion persistence | T2 | AUTH-REC-USER | T3 and future backend continuations |
| CONTRACT-REC-EVAL | Continue, Second opinion, session resume, no-progress, and no-successor observable traces | T3 | CONTRACT-REC-CHECKPOINT and CONTRACT-REC-RECORD | none |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-REC-CHECKPOINT | `.config/agents/skills/dev-implementation/SKILL.md` consolidated repair/state/stop clauses; `.config/agents/skills/dev-implementation/references/compact-checklist.md`; `.config/agents/skills/dev-handoff/SKILL.md`; `.config/agents/skills/dev-code-review/SKILL.md` rerun eligibility only; `.config/agents/skills/dev-ask/WORKFLOW.md`; `docs/adr/0003-bounded-assurance-and-repair.md` D03 only | T1 | AUTH-REC-BASE; current `dev-implementation/SKILL.md` SHA-256 `753424649afc59f7d7a66e7b22573aef72e0ffe57734a38c632e75227824856b`; other five targets at git `9a57dd35040191b05738c82dbfb319708bfc7a20` | repair backend, Common Handoff, human checkpoint, granted review rerun, standard/high-consequence assurance | AC-REC-01, AC-REC-02 |
| TGT-REC-PERSISTENCE | Same files, limited to authoritative-plan record projection, grant transition, opinion disposition, and ready predicate | T2 | TGT-REC-CHECKPOINT execution-start bytes | ordinary plan task records, Executor Plan `Blockers and recovery`, existing OMP local write/edit and sync path | AC-REC-03, AC-REC-04 |
| TGT-REC-EVALS | `.config/agents/skills/dev-ask/evals/evals.json`; `fixtures/b-retry/case.json`; `fixtures/b-t4-repair-remaining-blocker/case.json` | T3 | SHA-256 `a18d63259350ec8c8f6ef7369fa3b483aa9abd404975fdb13c8c899103c00d71`, `eb4d66367e5fa5eea0ec319736d17504c7d79befe63c3eecc2989b4bbad3842c`, and `b7f02e6d5ee0320887fb559d46fbd2e1e2104e9ecf631aeebe60fd94bb9a8385` respectively | unchanged B-RETRY-STANDARD, B-RETRY-HIGH-CONSEQUENCE, and B-T4-REPAIR-CONSOLIDATED regressions; frozen observe/compare trace tools | AC-REC-05 |
| TGT-REC-PRESERVE | Execution-start user-work manifest, removed custom-planner paths, both historical plans, both AGENTS.md files, and `/Users/kim/dev/atlas/app` | T3 | AUTH-REC-BASE plus AUTH-REC-ATLAS and AUTH-REC-LEAN | final before/after manifest and absence checks | AC-REC-06 |
## Execution policy

- Assurance: standard
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared lineage in the current dotfiles worktree; no Atlas mutation
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 completes and smokes before T2; T2 completes and smokes before T3.
- Decomposition: no child delegation
- Effect limit: EFF-REC-CONTRACT, EFF-REC-EVAL, EFF-REC-PLAN
- Orchestrator profile: not required for one-owner sequential execution

### Ordered implementation approach

1. **Turn only the exhausted noncompact repair path into a human checkpoint.**
   - In `.config/agents/skills/dev-implementation/SKILL.md`, preserve the inherited `unused 1/1` or `consumed 1/1` token, initial-review/rerun state, per-revision attempts 1 and 2, attempt-3 prohibition, and all ordinary progress gates. Change `## Consolidated post-assurance repair`, the inherited-convergence state, completion accounting, and `## Stop and next owner` so standard/high-consequence work with a consumed token or review rerun and exact remaining work first completes its current evidence pass, stops mutation, persists CONTRACT-REC-RECORD, and presents exactly Continue and Second opinion to the human owner.
   - A checkpoint is eligible only when authority and target identity are current, effects are safe, the remaining stable finding/blocker IDs and acceptance are exact, and evidence supplies a falsifiable next repair approach. Unchanged hypothesis, repeated frontier, inconclusive proof, exhausted attempts without a changed approach, missing authority, unsafe/uncertain effects, or stale evidence remains `no-progress-stop` before the question; a human grant never makes it eligible.
   - Continue keeps the original repair token marked consumed, preserves the current initial-review/rerun counters, and keeps the same plan/outcome/authority/route/owner/scope/criteria with no dedicated recovery task. It binds the grant timestamp to the next revision of the existing consolidated repair Task Contract and authorizes exactly one grant-scoped repair cycle with normal attempts 1 and 2. Only explicit grant authority opens that cycle; an ungranted derivative revision inherits exhaustion.
   - After a granted cycle reaches fresh VERIFIED proof, select review budget in this exact order: consume the original first-eligible review if it is still `not run`; otherwise consume the original review rerun if it is still `unused`; otherwise use one review pass bound to the current grant identity. A granted review pass exists only when both original review slots were already consumed before that cycle. Once an original 1-of-1 counter is consumed it remains consumed; a grant never restores or relabels it.
   - Second opinion is one human grant with an advisory prelude, not an unconditional retry. Reuse an already-eligible verifier, reviewer, or diagnosis Handoff for the exact target when present; otherwise dispatch only the currently eligible existing role: `dev-verification` at a declared standard/high-consequence verification boundary, `dev-code-review` for an exact VERIFIED review-boundary target, or `dev-diagnosing-bugs` for a hard unexplained reproducible defect. Never dispatch a duplicate opinion for the same target. After persisting the opinion line, a `same-route` disposition starts the already-granted cycle without a third prompt; `authority-change` for route, scope, acceptance, or owner returns without starting; `no-progress` or stop advice returns `no-progress-stop` without starting. The opinion cannot mutate, authorize a rejected route, count as progress, broaden authority, consume a semantic attempt, or satisfy final post-mutation proof.
   - If a granted cycle again ends with eligible progress-bearing remaining work, append a new exhaustion record and ask again; each later grant is explicit and authorizes only its own next cycle. Automatic recursion, revision-churn reset, successor planning, and reuse of an older grant remain forbidden.
   - In `.config/agents/skills/dev-code-review/SKILL.md`, change only rerun intake/accounting so an unused original first review or rerun keeps precedence and one current D03 grant identity admits one post-VERIFIED pass only after both original review slots are consumed. It does not create another initial review, duplicate a same-target review, weaken role independence, or alter D04 boundaries.
   - In `.config/agents/skills/dev-implementation/references/compact-checklist.md`, preserve items 7 through 9 and state that the new post-assurance human checkpoint does not change compact attempts, smoke-only proof, or its prohibition on verifier/reviewer dispatch.
   - In `.config/agents/skills/dev-handoff/SKILL.md`, keep one Common Handoff and one receiver. Add only a reference to the newest persisted exhaustion record, its exact grant/opinion/disposition state, and same-plan resume condition; project existing non-success evidence into the concise plan record rather than creating a second Handoff or rich recovery Task Contract.
   - In `.config/agents/skills/dev-ask/WORKFLOW.md`, describe the direct two-option continuation confirmation from backend evidence: Continue grants the current route; Second opinion grants a cycle only after a persisted `same-route` disposition, while `authority-change` or `no-progress` returns without another prompt or mutation. Do not rerun Route Overview for same-route advice, change its approval template, add a route stage/todo, or make `dev-ask` store run state.
   - Revise only ADR-0003 D03, its human-authority sentence, and AC11/attempt-fixture expectations. State the opinion disposition branches and original-review-budget precedence, and distinguish repeated explicit human grants from rejected automatic/unbounded revision recursion; keep D04, D22, all D09 behavior, and assurance-role neutrality unchanged.

2. **Persist one exact exhaustion record before asking or resuming.**
   - The backend appends the following record under the still-open task for an ordinary plan or as a new entry in `Blockers and recovery` for an implementation-grade plan. Brace tokens are replaced with concrete values; no additional fields are allowed.
     ```markdown
     - exhausted {token|review-rerun} at {YYYY-MM-DD-HHMM}
       - trying: {one line}
       - found: {stable finding/blocker IDs plus one-line cause}
       - tried: {what changed; what did not}
       - target: {exact identity}
       - remaining: {AC IDs / next receiver}
       - grant: pending
       - opinion: absent
     ```
   - Emit that exact record inline and persist the same bytes before presenting the choices. Use the current authoritative-plan path already selected by plan storage/transport rules: OMP local-authority uses anchored `edit` and existing automatic projection sync; direct-repository authority uses its exact active path. Do not invoke, edit, or reimplement a helper protocol.
   - The record body is immutable except two monotonic field transitions. On Continue, change only `grant: pending` to `grant: continue {YYYY-MM-DD-HHMM}`. On Second opinion, first change only that line to `grant: second-opinion {YYYY-MM-DD-HHMM}`; then change `opinion: absent` to one line containing the source role/Handoff, exactly one disposition (`same-route`, `authority-change`, or `no-progress`), recommendation, exact inspected target, and persisted record identity.
   - Preserve every earlier exhaustion record. The newest record is the sole continuation input: `pending` blocks; `continue` may ready the same owner after ordinary gates; `second-opinion` blocks while opinion is absent. A `same-route` opinion may ready the already-granted cycle, while `authority-change` and `no-progress` remain terminal for that grant. A later eligible exhaustion appends a new `pending` record rather than rewriting history or replaying an older grant.
   - A fresh runtime session resolves the executing plan's same authoritative file and reconstructs the checkpoint from its newest record, task/outcome identity, exact target, route, owner, remaining criteria/receiver, and grant/opinion state. It must not require transcript history, a successor plan, a new `OUT-...`, a new authority URI, a token reset, or a new initial approval.
   - T2 worker smoke uses concrete in-memory bytes only; it adds no fixture or runner. Reuse the exact first B-T4 token record defined in step 3 together with executing-plan identity `2030-01-02-0304_repair-trace`, outcome `OUT-REPAIR-TRACE`, authority `authority://repair-trace`, route `dev-implementation backend`, and owner `implementation-owner`. Prove byte-exact placement under an ordinary open task and implementation-grade `Blockers and recovery`, prior-record preservation, and a one-line-only `pending` → `continue` transition.
   - Using copies of those same smoke bytes, prove `pending`, stale target, and `second-opinion` with `opinion: absent` all block ready; `same-route` alone readies the same owner; `authority-change` returns `authority-change-required`; `no-progress` returns `no-progress-stop`. No smoke case may infer progress, restore a counter, create a plan/outcome, or require an authoritative plan file.

3. **Rewrite only the two existing read-only recovery traces.**
   - These cases are backend state traces, not live or multi-session interactions. Keep `scripted_replies: []` in both registry entries and both `case.json` files. Do not add plan files or additional fixture files, run a second observer session, or claim filesystem byte comparison.
   - Within the `B-RETRY` and `B-T4-REPAIR-REMAINING-BLOCKER` entries in `evals.json`, change only `inputs.request`, `expected.outcome`, `required_events`, `forbidden_events`, and `rubric`. Within each matching `case.json`, change only `inputs.request`. Keep case IDs, criteria, proof metadata, owners, capabilities, trace scopes, fixture directories, and all other bytes unchanged. Do not edit `compare_trace.py`, `observe_case.py`, `scan_stale_contracts.py`, or their self-test definitions.
   - Keep B-RETRY a semantic-attempt 2/2 case, not a post-assurance token case. Its one request states that a stray Continue grant appears after attempt 2 fails. Add one terminal backend event and rubric clause saying that the stray grant is inapplicable, cannot create attempt 3, and cannot reset or reclassify the 2/2 budget. Preserve the existing attempt-1 progress gate, attempt-2 trace, and 2/2 failure semantics; append the stray-grant rejection to `expected.outcome`, and add forbidden events for attempt 3 after the stray grant and grant-driven budget reset. Do not use B-RETRY to prove grant-is-progress.
   - Rewrite the B-T4-REPAIR-REMAINING-BLOCKER request as one read-only trace containing two textual checkpoint grants and one same-identity resume. Use executing-plan identity `2030-01-02-0304_repair-trace`, `OUT-REPAIR-TRACE`, `authority://repair-trace`, route `dev-implementation backend`, owner `implementation-owner`, and keep those exact values before and after the resume text. They are neutral fixture values; this plan's `2026-08-17-0134` header and historical Atlas/lean identities appear only as near-miss citations outside the fixture.
   - The request and ordered `required_events` retain initial FIND-1/FIND-2 aggregation, token consumption 1/1, repair attempts 1/2 and 2/2, generic-suite nonclosure, and terminal-finalizer safety, then encode this exact tail:
     1. Emit the eight-line record headed `- exhausted token at 2030-01-02-0304` with `trying: close FIND-2 at caller-B`, `found: FIND-2 — caller-B lacks required closure for AC-TRACE-02`, `tried: attempts 1/2 and 2/2; generic suites passed but caller-B proof did not`, target `sha256:2222222222222222222222222222222222222222222222222222222222222222`, remaining `AC-TRACE-02 / implementation-owner`, `grant: pending`, and `opinion: absent`; block ready while pending.
     2. Show only its grant line changed to `grant: continue 2030-01-02-0305`; restate the same executing-plan identity after a context-resume boundary; authorize grant cycle 1 with the same owner and consumed token.
     3. Grant cycle 1 closes FIND-2, runs fresh impacted verification to VERIFIED, then consumes the still-unused original review rerun. That original rerun, not a grant-scoped review, reports FIND-3.
     4. Emit a second eight-line record headed `- exhausted review-rerun at 2030-01-02-0306` with `trying: close FIND-3 at caller-C`, `found: FIND-3 — caller-C projection was not rederived for AC-TRACE-03`, `tried: grant cycle 1 closed FIND-2; original review rerun found FIND-3`, target `sha256:3333333333333333333333333333333333333333333333333333333333333333`, remaining `AC-TRACE-03 / implementation-owner`, `grant: pending`, and `opinion: absent`.
     5. Change only the grant line to `grant: second-opinion 2030-01-02-0307`; emit a blocked event while opinion remains absent; reuse the existing review Handoff without another role dispatch; then change only the opinion line to `opinion: dev-code-review/HANDOFF-TRACE-03; same-route; rederive caller-C projection; sha256:3333333333333333333333333333333333333333333333333333333333333333; repair-trace#review-rerun-2030-01-02-0306`.
     6. Authorize grant cycle 2 only after that opinion output. Attempt 1 materially changes the FIND-3 hypothesis without closure; that attempt evidence, not the grant or opinion, authorizes attempt 2. Attempt 2 repeats the FIND-3 frontier, returns `no-progress-stop`, and starts no review. Run the unchanged non-consuming finalizer with FIND-3 exact and no completion.
   - In B-T4 `forbidden_events`, remove the old `state:verified`, `review-rerun`, and `second-repair` prohibitions because the new tail requires fresh verification, the unused original rerun, and explicit grant cycles. Keep attempt 3, diagnosis re-entry, token/planning/lifecycle reset, and completion forbidden; add successor plan, new outcome, new authority URI, automatic extra cycle, duplicate opinion, grant-as-progress, ready-before-record, ready-before-opinion, and grant-scoped-review-before-original-budget-consumption.
   - Rewrite B-T4 `expected.outcome` and rubric to require same-plan Continue, same-route Second opinion, original-review-budget precedence, one cycle per grant, neutral identity preservation, FIND-3 no-progress, and finalizer safety. The exact record appears as required event/output text only; the trace does not assert an authoritative plan-file write.
   - Keep `B-RETRY-STANDARD`, `B-RETRY-HIGH-CONSEQUENCE`, their fixture files, and `B-T4-REPAIR-CONSOLIDATED` byte-unchanged as regressions. After T3, run only:
     ```text
     python3 -m json.tool .config/agents/skills/dev-ask/evals/evals.json
     python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test
     python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json
     python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test
     python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --preserve
     ```
   - These self-tests prove frozen observer/comparator/scanner mechanics only. AC-REC-05 still requires fresh read-only observations and normal comparator validation for B-RETRY, B-RETRY-STANDARD, B-RETRY-HIGH-CONSEQUENCE, B-T4-REPAIR-CONSOLIDATED, and B-T4-REPAIR-REMAINING-BLOCKER.

## Tasks

- [x] T1. Add the human-gated repair checkpoint
  completed 2026-08-17-1556
  - Owner: implementation-owner
  - Wave: W0
  - Depends on: none
  - Targets: TGT-REC-CHECKPOINT
  - Contracts: CONTRACT-REC-CHECKPOINT
  - Criteria: AC-REC-01, AC-REC-02
  - Effects: EFF-REC-CONTRACT
  - Output: OUTP-T1
  - Receiver: T2
  - Verification: VR-REC-CHECKPOINT, VR-REC-CHOICES
  - Lineage: shared
- [x] T2. Persist same-plan exhaustion and grant records
  completed 2026-08-17-1600
  - Owner: implementation-owner
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-REC-PERSISTENCE
  - Contracts: CONTRACT-REC-CHECKPOINT, CONTRACT-REC-RECORD
  - Criteria: AC-REC-03, AC-REC-04
  - Effects: EFF-REC-CONTRACT, EFF-REC-PLAN
  - Output: OUTP-T2
  - Receiver: T3
  - Verification: VR-REC-RECORD, VR-REC-RESUME
  - Lineage: shared
- [x] T3. Rebind repair checkpoint evaluations
  completed 2026-08-17-1615
  - Owner: implementation-owner
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-REC-EVALS, TGT-REC-PRESERVE
  - Contracts: CONTRACT-REC-CHECKPOINT, CONTRACT-REC-RECORD, CONTRACT-REC-EVAL
  - Criteria: AC-REC-05, AC-REC-06
  - Effects: EFF-REC-EVAL
  - Output: OUTP-T3
  - Receiver: dev-verification
  - Verification: VR-REC-EVALS, VR-REC-PRESERVE
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-REC-01 | Standard/high work has consumed the inherited repair token or review budget and exact eligible work remains | Mutation stops; the repair token stays consumed; original initial-review/rerun counters retain their current states and are consumed in order before any grant-scoped review; the same plan stays IN_PROGRESS; only a persisted human grant may authorize one additional cycle with normal attempts 1 and 2 | TGT-REC-CHECKPOINT | T1 |
| AC-REC-02 | The newest eligible record has `grant: pending` | The human sees exactly Continue and Second opinion. Continue keeps the same owner and adds no recovery task/skill/stage. Second opinion reuses or dispatches at most one eligible exact-target read-only role and persists one disposition: `same-route` starts the already-granted cycle without another prompt; `authority-change` or `no-progress` starts no cycle. Hard stops win over either grant | TGT-REC-CHECKPOINT | T1 |
| AC-REC-03 | A token or review-rerun checkpoint is reached | Before the question, the exact eight-line record is identical inline and on the executing plan's authoritative file. Only grant and opinion may transition once; prior records remain; a missing, stale, pending, or opinion-incomplete newest record blocks mutation | TGT-REC-PERSISTENCE | T2 |
| AC-REC-04 | Token exhaustion, human Continue or Second opinion, or runtime session loss occurs | The executing plan keeps its own Datetime, slug, `OUT-...`, authority URI, route, owner, target, and remaining criteria. A fresh runtime session resumes from that plan record alone; successor-plan creation solely to regain budget is rejected. This plan's `2026-08-17-0134`, Atlas session `01a0063b`, and the lean `OUT-DEV-WORKFLOW-LEAN-ORDINARY-PATH` to `2026-08-15-1744` residual are historical near misses only | TGT-REC-PERSISTENCE | T2 |
| AC-REC-05 | The five named read-only traces run against the final contracts | B-RETRY preserves semantic 2/2 and rejects attempt 3 from a stray Continue grant; B-RETRY-STANDARD/HIGH-CONSEQUENCE preserve 2/2; B-T4-REPAIR-CONSOLIDATED preserves original-token success; B-T4-REPAIR-REMAINING-BLOCKER encodes exact record text, same-identity resume, Continue, later same-route Second opinion, original-rerun precedence, one cycle per grant, attempt-evidence-only progress, FIND-3 no-progress, no successor plan, and unchanged finalizer safety | TGT-REC-EVALS | T3 |
| AC-REC-06 | Final target and before/after manifests are inspected | Only the six scoped policy/ADR files, `evals.json`, and the two named fixture request files gain this plan's changes. All preexisting user-owned non-target changes remain byte/absence-identical to execution start; the current custom-planner deletions remain absent; planner-removal semantics in the overlapping `dev-implementation/SKILL.md` remain intact; both historical plans, both AGENTS.md files, Atlas, and shipping state remain untouched | TGT-REC-PRESERVE | T3 |

## Verification / Done criteria

- [x] VR-REC-CHECKPOINT. Prove one human grant opens only one bounded repair cycle
  - Criterion: AC-REC-01
  - Proof class: independent verification
  - Scenario / environment / fixture: final contracts plus B-T4-REPAIR-REMAINING-BLOCKER from original token exhaustion through both textual grants
  - Evidence form: ordered trace showing the consumed token, preserved review counters, original-rerun precedence, grant identity, attempts limited to 1/2 and 2/2, same owner/outcome/plan, and no automatic extra cycle
  - Target recheck: TGT-REC-CHECKPOINT
  - Receiver: dev-verification
- [x] VR-REC-CHOICES. Prove Continue and Second opinion preserve all hard stops
  - Criterion: AC-REC-02
  - Proof class: independent verification
  - Scenario / environment / fixture: final branch contract and T2 smoke evidence plus B-RETRY's stray grant and B-T4-REPAIR-REMAINING-BLOCKER's same-route opinion
  - Evidence form: exactly two human choices; same-route opinion-before-ready ordering; authority-change/no-progress non-ready smoke; no duplicate dispatch, rejected-route mutation, grant-as-progress, or attempt 3
  - Target recheck: TGT-REC-CHECKPOINT
  - Receiver: dev-verification
- [x] VR-REC-RECORD. Prove the trace record is exact and monotonic
  - Criterion: AC-REC-03
  - Proof class: independent verification
  - Scenario / environment / fixture: the single B-T4-REPAIR-REMAINING-BLOCKER read-only trace
  - Evidence form: required event/output text contains each exact eight-line record, grant/opinion one-way transitions, pending blocking ready, and second-opinion-with-absent-opinion blocking ready; no authoritative plan-file or cross-format byte claim
  - Target recheck: TGT-REC-PERSISTENCE
  - Receiver: dev-verification
- [x] VR-REC-RESUME. Prove the trace preserves the executing plan identity
  - Criterion: AC-REC-04
  - Proof class: independent verification
  - Scenario / environment / fixture: one B-T4-REPAIR-REMAINING-BLOCKER request containing before/after context-resume snapshots; `2026-08-17-0134`, `01a0063b`, and the lean residual inspected only as historical near misses
  - Evidence form: equal neutral Datetime, slug, `OUT-...`, authority URI, route, owner, target, and remaining-criteria output before/after the textual resume boundary; zero real-session, successor-plan, new-outcome, token-reset, or new-initial-approval claims
  - Target recheck: TGT-REC-PERSISTENCE
  - Receiver: dev-verification
- [x] VR-REC-EVALS. Run the narrowed read-only recovery evaluation set
  - Criterion: AC-REC-05
  - Proof class: independent verification
  - Scenario / environment / fixture: B-RETRY, B-RETRY-STANDARD, B-RETRY-HIGH-CONSEQUENCE, B-T4-REPAIR-CONSOLIDATED, and B-T4-REPAIR-REMAINING-BLOCKER through the existing frozen receipt-backed observer/comparator
  - Evidence form: five passing read-only trace receipts and deterministic observer/comparator self-tests; remaining-blocker receipt ends at exact FIND-3 no-progress and unchanged terminal-finalizer evidence
  - Target recheck: TGT-REC-EVALS
  - Receiver: dev-verification
- [x] VR-REC-PRESERVE. Prove excluded contracts and user work stayed untouched
  - Criterion: AC-REC-06
  - Proof class: independent verification
  - Scenario / environment / fixture: execution-start versus final working-tree manifest, target digests, empty staged diff, deleted custom-planner paths, and Atlas read-only identity checks
  - Evidence form: authorized target deltas only beyond the preexisting manifest; all non-target user-owned hashes/absence unchanged; removed persona/harness/profile/transport assets still absent; overlapping implementation skill retains its no-custom-planner publication contract; historical/AGENTS.md/Atlas bytes and shipping state unchanged
  - Target recheck: TGT-REC-PRESERVE
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | TGT-REC-CHECKPOINT exact changed revision plus task-smoke evidence | completed, blocked | T2 | Common Handoff from dev-handoff |
| OUTP-T2 | T2 | TGT-REC-PERSISTENCE exact changed revision plus record/resume smoke evidence | completed, blocked | T3 | Common Handoff from dev-handoff |
| OUTP-T3 | T3 | One immutable shared target containing every authorized changed file and all receipt-backed smoke evidence | completed, blocked | dev-verification | Common Handoff from dev-handoff |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-REC-AUTHORITY | implementation-parent | Current authoritative plan identity, target digest, and exact human grant record | T1, T2, T3 | New explicit authority is required only when outcome, route, scope, effects, acceptance, or owner changes | Current plan and target still match AUTH-REC-USER and AUTH-REC-BASE |
| BLK-REC-PROGRESS | implementation-owner | Named AC/blocker advancement or a materially changed falsifiable repair approach | T1, T2, T3 | No human grant can waive no-progress or reopen an unchanged frontier | Fresh authorized evidence satisfies D03 progress semantics |
| BLK-REC-OPINION | implementation-owner | One current exact-target independent Handoff or one eligible read-only opinion result | T2, T3 | Second opinion cannot enter ready while opinion is absent, stale, duplicated, mutation-bearing, authority-changing, or no-progress | A persisted `same-route` opinion matches the newest record's target and grant identity |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-REC-IMPLEMENTATION | skill | `.config/agents/skills/dev-implementation/SKILL.md` `## Consolidated post-assurance repair`, inherited convergence state, and `## Stop and next owner` | Owns the checkpoint, grant-scoped cycle, attempts, and completion accounting |
| ANC-REC-HANDOFF | skill | `.config/agents/skills/dev-handoff/SKILL.md` compact persisted recovery envelope and Common Handoff | Carries one record reference and one receiver without a sidecar |
| ANC-REC-REVIEW | skill | `.config/agents/skills/dev-code-review/SKILL.md` rerun intake/accounting | Preserves original first-review/rerun precedence and admits a grant-scoped pass only after both are consumed |
| ANC-REC-COMPACT | checklist | `.config/agents/skills/dev-implementation/references/compact-checklist.md` items 7 through 9 | Preserves compact attempts, smoke-only assurance, and no verifier/reviewer dispatch |
| ANC-REC-ROUTE | workflow | `.config/agents/skills/dev-ask/WORKFLOW.md` convergence, recovery, and human-confirmation paragraphs | Presents exactly two continuation choices and blocks rejected-route or no-progress advice without adding route state |
| ANC-REC-ADR | ADR | `docs/adr/0003-bounded-assurance-and-repair.md` D03 and AC11 only | Authorizes explicit human checkpoints while rejecting automatic recursion |
| ANC-REC-EVAL | fixture registry | `.config/agents/skills/dev-ask/evals/evals.json` five named recovery cases and their canonical fixture files | Proves positive, resume, opinion, and no-progress near-miss behavior |
| ANC-REC-HISTORY | evidence | session `01a0063b`; `.agents/plans/archive/2026-08-13-1603_dev-workflow-lean-ordinary-path.md`; `.agents/plans/archive/2026-08-15-1744_receipt-skill-digest-binding.md` | Supplies the successor-plan and stranded-residual failures without making historical files editable |

- Assumptions: none

## Completion Summary

### Result

- Delivered `OUT-PLAN-RECOVERY`: eligible standard/high-consequence exhaustion now remains on the same executing plan, persists one exact record, presents only Continue or Second opinion, preserves hard stops and counters, and grants at most one evidence-gated cycle without successor planning or automatic recursion.
- Final immutable target: ordered SHA-256 `cf2179129763ca50c9648536ffc3ae2799fadcf5e25a241e4e62d68833b81de8` across the six scoped policy/ADR files, `evals.json`, and the two named fixture requests.
- Tasks and criteria: T1, T2, and T3 completed on their initial implementation attempt; AC-REC-01 through AC-REC-06 and VR-REC-CHECKPOINT through VR-REC-PRESERVE are complete.
- Scope remained one-owner and single-lineage with no fan-in; the approved plan's Orchestrator Role Profile decision remained `not required`.

### Evidence index

- Authority: local plan identity `2026-08-17-0134_plan-rules-recovery-continuation`; approved executor preflight `executor-plan-preflight/v1` was valid before execution; repository projection remained byte-identical to local authority at every lifecycle mutation.
- Worker smoke: T1 exact checkpoint/choice branches passed; T2 exact eight-line placement, monotonic transitions, readiness, and same-plan identity passed; T3 JSON, observer, comparator, scanner self-tests and receipt-backed semantic traces passed.
- Post-review repair: original-initial review found only `REVIEW-REC-B01` on AC-REC-04/AC-REC-05. One consolidated repair attempt added exact target `sha256:2222222222222222222222222222222222222222222222222222222222222222` and remaining `AC-TRACE-02 / implementation-owner` after the resume boundary; repair smoke receipt SHA-256 `9fc80ed1fe2e779431a8db6b23a4a69352ba750745337b18db4b1914f3bbfa32` passed.
- Final independent verification: `VerifyRecoveryRepair`; Handoff preserved at `local://final-verification-handoff-t3.txt`, SHA-256 `2b426c0a06f5f2c6a55503a42693c277d36f3c95b2176cf94f5202c0ecb615c2`; aggregate `VERIFIED`; `REVIEW-REC-B01` closed.
- Final-target receipts: B-RETRY `6d5b8257f39aebae9b5d3f93e903a5f66b3ec698e3341af47b4ca1fd6c78895a`; B-RETRY-STANDARD `f79150b595c15b1200ffe80a2c57ec806b527a0cc321d8cdda05b4f85732255a`; B-RETRY-HIGH-CONSEQUENCE `8b33de155a84ef57f817497658e9bbafbc30de90b96af95f2df625dd2f29b11c`; B-T4-REPAIR-CONSOLIDATED `c492d0b7b5f2d7f41c6618393f80e3c49e1b4432110e1ec8b1c5bdf41e5b10f2`; B-T4-REPAIR-REMAINING-BLOCKER `e69dca97cb56037b2257f8c76137d62fb186fd45d729d3eb049e853228060cf9`.
- Final review: `ReviewRecoveryRepair`; Handoff SHA-256 `e0f994c079827a62ae00da94a348e6f0e02a4649388682b9c72c8a65681d6a39`; Standards `PASS`, Specification `PASS`, Overall `APPROVED`; no blocker or separate-authority finding.
- Terminal curation: `AssessRecoveryLearning`; Handoff SHA-256 `d80862800b64896a948961afe904084d06a87dd12623ecf2d4a48eb29a0f8e21`; `NO DURABLE LEARNING`; no destination or papercut mutation.
- Universal finite maps: all checkpoint/readiness/review consumers, record/resume consumers, and evaluation/receipt consumers were independently proved on the final target. Every bound Compatibility and degraded-behavior field passed; production API, data, migration, security/auth, external mutation, performance, and application degraded-runtime fields were inapplicable with evidence.
- Complete applicable-project-rule and stage manifests were backend-compared before dispatch and rechecked before/after verification, review, and curation; no source was omitted, stale, contradictory, or consumed as lifecycle budget.
- Preservation: before terminal plan storage, the execution-start 15-entry user-work manifest gained exactly eight authorized target statuses and no others. Final local-authority sync atomically moved only this plan's byte-identical projection from active to archive. All supplied non-target hashes and planner-path absences stayed exact; planner-removal semantics, both historical plans, both AGENTS files, Atlas at `23f1e51d5945a2d60655499ade4a218e8298f4f9`, and empty staging remained unchanged.

### Terminal accounting

- Attempts: T1 `1/2`; T2 `1/2`; T3 `1/2`; consolidated repair `1/2`; repaired-target verification `2/2`.
- Run-wide repair token: `consumed 1/1` by final target `cf2179129763ca50c9648536ffc3ae2799fadcf5e25a241e4e62d68833b81de8`.
- Review budget: original initial review `run once`; original review rerun `consumed once`; grant-scoped review `none`.
- Same-plan exhaustion checkpoints and grant/opinion dispositions: none occurred during this execution; no successor lifecycle, new outcome, authority change, or grant-scoped cycle was created.
- Integration: none required. Mutating Learning Candidates: none dispatched. Originating papercut PC-ID: none.
- Terminal finalizer verified the sealed receipt index, found no partial or unsealed evidence, preserved the final verification Handoff, and removed four exact disposable observation roots after directory-kind checks without consuming or resetting semantic, repair, verification, or review budget.
- Route impact: unchanged. No required criterion, task, check, blocker, stale consumable result, failed dependency, or delivery action remains.

### Residual risk and handoff

- Advisory `ADV-REC-01` remains outside this outcome: `scan_stale_contracts.py --preserve` embeds stale `.agents/papercuts.json` SHA-256 `69aa97070cc5b1dca8b7487f301b1ba505d2cb29995c1bece4a73a3d807b8070` while the clean unchanged file is `7149beaed07fffbb41cd339399b6bb6d6fd1020accd11ddcb0277060d92ad901`. Direct manifest proof closed AC-REC-06; fixing the scanner baseline requires separate maintenance authority.
- Completion receiver: current `dev-ask` completion presentation to the human owner. Shipping remains unauthorized and unperformed.
