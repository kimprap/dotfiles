---
name: dev-implementation
description: >
  Execute an approved direct contract or dependency-wired implementation tickets through
  bounded work, smoke, and evidence-backed completion. Profile-required independent
  verification, neutral fan-in, final review, and curation run only when the selected
  assurance profile or topology requires them. Defer compact Learning Candidates and own
  read-only backend lifecycle or terminal-evidence traces. Reject stale contracts; default
  cohesive work to one owner.
---

# Engineering Implementation

Own execution topology, task projection, runtime state, attempts, recovery, evidence aggregation, and local completion. Do not redesign approved authority or copy leaf-stage procedures.

## Intake

Accept only:

- an approved direct implementation contract; or
- approved implementation tickets bound to current governing requirements and Engineering Specification revisions when present.

Reject missing, stale, or conflicting authority; unbounded scope; non-observable acceptance; missing verification recipes; cyclic or unnamed blockers; unsettled shared interfaces or ownership; missing human approvals; and unavailable hard capabilities. Return each defect to its owning lifecycle stage instead of repairing authority in place.

Changed upstream bytes require a semantic rebind before readiness or completion is consumed. If the diff changes any governing authority, scope, acceptance, fixed contract, dependency, effect, capability, or verification fact, invalidate affected descendants, preserve prior output as historical evidence, and create a new task revision. If every load-bearing fact remains exact, refresh the bound revision and target digest without spending an attempt or requesting human reapproval; unrelated bytes alone do not reset readiness, assurance, or completion.
Revalidate the immutable assurance profile before execution. `compact` requires settled authority, design, acceptance, and verification; bounded one-context and one-lineage ownership; reversible effects; deterministic proof; no prior implementation or verification failure; and no material consequential surface. Disqualify compact for unresolved authority or design; shared or public interfaces or schema; security, privacy, authentication, permission, or credential concerns; stored data, migration, destructive, or external effects; multiple lineages; unresolved UI judgment; hard, flaky, or performance diagnosis; prior failure; durable recovery; broad, ambiguous, or bias-prone work; or an explicit heightened-assurance request. Route material security, privacy, authentication, permission, data-loss, migration, destructive, public/shared compatibility, concurrency, recovery, reliability, performance, or explicitly heightened work to `high-consequence`; route remaining noncompact work to `standard`. An upward reclassification is a material route change returned to `dev-ask`; never silently downgrade an approved profile.

When the bound profile is compact, read [`references/compact-checklist.md`](references/compact-checklist.md) and apply every gate in order before the first ready transition. Compact uses criterion-complete worker smoke as terminal proof. A criterion that requires independent proof disqualifies compact and returns to `dev-ask`; do not paper over the disqualifier by retaining verification, review, or learning.

## Orchestrator Role Profile and capability seam

Before full orchestration, bind a provider-neutral Orchestrator Role Profile to the exact Task Contract digest, Executor Plan digest, and authority revision. It records:

- runtime identity and harness adapter;
- model selector, selector source, resolved identity, reasoning level, and `fallback: none`;
- effective `read`, `write`, `schedule`, `delegate`, `observe`, `control`, `handoff`, `identity`, and `recovery` capabilities as `native | contract-equivalent | unavailable`;
- maximum child depth and concurrency;
- isolation, neutral fan-in, and effect limits; and
- field-level `live-attested | documentation-inferred` evidence.

Read [`references/orchestrator-role-profile.md`](references/orchestrator-role-profile.md) before selecting full orchestration or a simpler projection. Run its provider-neutral assessor at launch. Full orchestration requires exact live-attested agreement and no fallback; skill prose, configuration presence, or a model label cannot supply attestation or upgrade capability. A mismatch may use only the exact plan-approved one-qualified-owner/sequential projection when it preserves authority, Task Contracts, acceptance, assurance, Handoff boundaries, recovery, and effects. Otherwise stop `transport-unavailable`. Never silently dispatch a dedicated orchestrator, weaker model, alternate provider, or nested planner.

The semantic adapter seam is:

```text
profile() → Orchestrator Role Profile
dispatch(Task Contract, Context Pack, Role Profile) → Attempt Handle | Handoff
observe/control(Attempt Handle) → Attempt State | Handoff
recover(Run Reference) → Logical Graph + Attempts + Handoffs
```

`profile` and `dispatch` are mandatory for executable delegated work. Observation/control is required for asynchronous or cancellable work; recovery is required for durable-recovery claims. Adapters own discovery, invocation, runtime identities, isolation/storage/combination mechanics, tools, limits, configured credential references, and actual execution metadata. Filesystem/config presence is not proof of invocability.

Executor Plan publication is performed by the current parent or session owner. Materialize the active repository artifact through the applicable storage and harness companion, invoke `scripts/executor_plan.py validate PLAN` once against its exact bytes, and bind the valid `executor-plan-validation/v1` result and SHA-256 before publication. Do not dispatch a dedicated custom planner user-agent, bind a planner-role-profile, or block publication for missing planner-agent attestation or planner-agent capabilities. Native harness planning modes are outside this contract. Backend readiness consumes that current context-free result; a new or resumed start obtains one fresh result, never a planner/backend variant or duplicate parse.

## Select execution mode

Choose from topology, coordination, and recovery—not size, task count, token estimate, model availability, or the presence of delegation.

### One owner — default

Use one cohesive fresh-context owner when coupled files, interfaces, state, or reasoning should stay together. Large cohesive work remains one owner.

### Small local batch

Use a bounded batch only when all ready slices are genuinely independent: settled interfaces, disjoint behavioral/state ownership, concrete acceptance, low contention, declared fan-in, and one coordinator able to observe one or two waves. Path separation alone is insufficient. A sequential projection is eligible only when the approved plan names it and it preserves identical Task Contract, acceptance, effect, proof, and Handoff boundaries.

### Full orchestration

Use full orchestration for many dependency waves, long-running isolated work, durable cross-context recovery, or neutral fan-in across multiple lineages. A shallow graph without one of those triggers remains one owner or a bounded batch; dependency failure changes quarantine and continuation behavior, not execution mode by itself. Full orchestration has one capable root parent and no nested orchestrator or planner tree.

The launch assessor records `full-orchestration`, explicit `one-owner-sequential`, or `transport-unavailable`. A downgrade governs execution topology only and never authorizes application-visible compatibility or degraded behavior. Escalating one owner → batch or batch → full is a material route change returned to `dev-ask` for a revised Route Overview and human approval.

## Task Contract

Project approved authority without redesign:

```markdown
# <human-readable task name>
## Authority
- Governing artifacts and exact revisions/digests
- Parent task when decomposed
- Required human approvals
## Objective
<one observable bounded outcome>
## Intent
<one short human sentence>
## Methods
- Selected: none | tdd
- Binding authority: <plan task revision | exact current direct authority>
## Outcome progress
- Parent outcome: OUT-<id> @ <authority revision>
- Owned acceptance: AC-<id>...
- Expected progress signal: <observable criterion, blocker, authority, or authorized hypothesis/evidence delta>
- Current frontier: <next unmet criterion or named blocker>
- Inherited convergence: semantic attempts <used>/<maximum for this revision>; run-wide post-assurance repair <unused 1/1 | consumed 1/1 by repair revision>; initial review <not run | run once>; review rerun <unused | consumed>; newest same-plan exhaustion record <none | exact record identity, target, grant, opinion, and disposition state>; eligible next-loop worth frame/action <none | exact frame, selected action, Close disposition, target, evidence, and residual risk>
- Same-outcome repair parent snapshot: <frozen parent acceptance IDs and proof-recipe identities | not applicable>
- Same-outcome repair impact map: <repair-owner proposal covering every pre-existing criterion → impacted | unaffected → causal path/fixture/consumer → fresh proof | exact evidence reuse; backend-frozen action per criterion>
- Review lineage/admission state: <original-initial lineages and receipt | later-slot prior receipt, remaining lineages, exact repair delta, accepted review impact map, affected/unchanged surfaces, finite consumers, reuse identities, and admission disposition | not applicable>
- Allowed return classes: completed | proved | blocker-resolved | authority-change | no-progress-stop
## Role
<router | planner | subplanner | worker | verifier | integrator | reviewer | curator | backend | shipper>
## Assurance
- Profile: compact | standard | high-consequence
- Selection evidence and checked compact disqualifiers
- Verification/review arrangement: none (compact) | separate identities | decorrelated identities
- Curation: deferred (compact) | required
## Ownership
- May read
- May change or produce
- Must not change
- Shared interfaces or state that remain fixed
## Applicable project rules
- Canonical artifact references, exact revisions, and applicable scope
- Backend-bound `none` only with the bounded check that established it
## Compatibility and degraded behavior
- Governing authority: <exact requirements/specification/direct-authority revision>
- Preserve: <supported callers, data, protocols, observable behavior, and failure behavior> | none (<baseline evidence that no existing observable contract is affected>)
- Required degraded behavior: <trigger → observable response → recovery boundary> | none (<approved failure-boundary authority that no degraded path is required>)
- Approved breaks, removals, clean cutover, or hard-failure behavior: <exact behavior and condition> | none (<authority approves no such change>)
## Solution discipline
- Apply only after reading the real changed flow, callers, and relevant existing helpers.
- Choose the first sufficient rung:
  1. reuse current code
  2. standard library
  3. native platform
  4. already-installed dependency
  5. minimum new code
- Preservation floor: all approved behavior, compatibility, failure/degraded behavior, safety, security, privacy, accessibility, project rules, and required smoke/proof remain exact.
- Required worker evidence: real-flow surfaces inspected; selected rung; concise disposition of every earlier rung; resulting root-cause change.
## Dependencies
- Blocking task names
- Exact upstream Handoff and artifact revisions required
## Acceptance
- AC-<id>: <observable criterion>
- Same-outcome repair preserves exactly the frozen parent `AC-...` set; a review finding, changed path, adjacent fixture, or observable consumer is not promoted into a new criterion
## Verification
- AC-<id> → <required scenario/check and evidence form>
- Same-outcome repair: frozen proof-recipe identity plus repair-proposed and backend-frozen complete criterion impact map, verifier-accepted fresh impacted result or exact unaffected-evidence identity/basis for every action, and one fresh aggregate verdict over the unchanged set
- For a mutating Learning Candidate: the reporter's complete proposal plus backend-frozen `CE-... @ <sha256>`; when papercut-originated, exactly one immutable originating `PC-ID`
## Execution policy
- Decomposition permission
- Isolation/integration needs
- Material decision gates
## Completion output
- Required artifacts and exact identities
- On valid successful completion only, terminal values for `dev-ask` validation: status exactly `completed`; one observable outcome; one to three openable human-relevant changes or canonical artifacts; named verification or specialty-authority check, terminal verdict, and fetchable immutable evidence identity; normalized papercut result; normalized learning result; residual risk or `none`; durable Resume from locator with immutable revision or digest; existing Common Handoff locator/reference with immutable revision or approved in-conversation form tied to Resume from; caller-supplied Constraints containing exact `shipping not authorized` once; and local engineering Next exactly `none`
- Exactly one required Handoff receiver
```

For a plan-backed task, copy `Intent` and `Methods` unchanged from the parser-valid Executor Plan into every Task Contract. `Intent` remains the short human sentence and is not replaced by IDs, paths, or procedure. Work tasks accept only `none | tdd`; authored profile-tail tasks accept only `none`. For direct work without an Executor Plan, including same-context compact, derive one short human Intent from the current approved authority and select `tdd` when the current user or approved authority explicitly requires test-first work, otherwise select explicit `none`.

`Methods` changes only how the existing task owner performs the work. It creates no task, stage, criterion, effect, assurance boundary, todo phase, or receiver. The selected value is immutable within an attempt and passes unchanged through its Common Handoff.

Include `Solution discipline` only when the Task Contract's Role is `worker`, and keep it immutable within the attempt. The block binds the procedure, not a preselected result. `minimum new code` means the smallest root-cause implementation that satisfies the complete contract; it never authorizes reduced scope, behavior, compatibility, or proof. A new dependency is not a rung and still requires existing authority.

The worker chooses after reading the flow and records the inspected surfaces, selected rung, every earlier-rung disposition, preservation result, and root-cause change in the existing common Handoff `Decisions and assumptions`/choices payload.

Semantic fields, including the Compatibility and degraded behavior block, are immutable within an attempt. A material correction creates a new revision and invalidates descendants bound to the old one. Operational subdivision is legal only when the parent explicitly delegates it; every child preserves parent authority, scope, acceptance, verification, and fixed shared contracts.
For same-outcome noncompact repair, freeze the parent acceptance IDs and proof recipes. The repair owner proposes a complete causal impact map with one impacted-fresh or unaffected-reuse action for every pre-existing criterion; the backend freezes that complete coverage before verification; and the verifier independently accepts or rejects every action and computes the repaired target's fresh aggregate verdict over that unchanged parent set. Reuse unaffected evidence only when the map proves no causal path from the repair and the criterion's target surface, environment, expectation, proof method, fixture and dependency identities, and evidence integrity remain valid; otherwise rerun it fresh. A material change to the frozen set creates new authority rather than a repair revision.
Within one parent outcome, every `AC-...` has exactly one implementation owner and one proof recipe. A child receives only its owned criteria and cannot split, duplicate, or reassign them without a new approved Task Contract revision.
The assurance profile is immutable within a Task Contract revision. `compact` binds no independent verification or review and defers any mutating Learning Candidate; `standard` binds separate verifier/reviewer identities and required curation; `high-consequence` binds decorrelated identities and required curation. A profile change creates a new Task Contract revision.


Each standard or high-consequence attempt and each cross-context compact dispatch receives one minimal revision-bound Context Pack containing only: the exact Task Contract; exact governing authority; relevant active ADR and fixed-contract revisions; exact dependency Handoffs; the parent outcome and owned-criteria delta; inherited per-revision semantic-attempt count; inherited run-wide post-assurance repair state and consuming revision; initial-review/rerun state; the newest same-plan exhaustion record identity and exact grant/opinion state when applicable; any eligible post-2/2 worth frame and one selected action carried by the Common Handoff without a record; bounded target/repository/environment context; the once-bound applicable-project-rule and target manifests; permitted and prohibited effects; and one expected Handoff receiver. Same-context compact binds the Task Contract and target manifest directly and creates no Context Pack. At the first ready transition for an immutable revision, the backend binds each manifest exactly once with canonical source URI, exact SHA-256 revision, and scope; later roles compare current bytes to those entries and never rebuild or extend them. When a pack exists, its rule manifest names canonical rule artifacts, exact revisions, and scope, or records backend-bound `none` with its bounded check. The backend binds the pack before dispatch; receivers never infer missing authority from filesystem discovery. Missing, stale, mismatched, or contradictory evidence is `INCONCLUSIVE`. Exclude transcripts, conversational history, stale reasoning, unrelated files, broad repository summaries, full-plan duplication, secrets, credentials, volatile noise, and unsupported assumptions.

For a standard/high-consequence Learning Candidate that may mutate guidance, the backend validates reporter ownership, authority, freshness, completeness, adjacent-case independence, and deterministic/semantic proof classification before the `dev-continual-learning` adapter task can become ready. It canonicalizes the proposal as sorted-key compact UTF-8 JSON, embeds the exact object under Task Contract `Verification`, records `CE-... @ <sha256>`, and copies both into the Context Pack. The Task Contract and Context Pack bind portable mode `assess`; the adapter passes the exact object and digest to `continual-learning` unchanged. Neither the adapter nor portable curator can create, replace, weaken, or omit the binding; an unbound candidate discovered during curation is deferred for a later bound route rather than mutated in the same assessment. Compact candidates are deferred before this seam.
A complete papercut-originated candidate on an eligible noncompact route additionally binds exactly one immutable originating `PC-ID` through the Task Contract, Context Pack, adapter Common Handoff, and terminal accounting. The adapter passes it unchanged to `continual-learning`, which returns it unchanged; only the backend validates, maps, and settles that exact ID. A missing or mismatched ID leaves the candidate evidence-only; a non-papercut candidate carries no synthetic ID.

For every worker attempt, the Task Contract carries the immutable `Solution discipline` block. Copy that same block into a Context Pack only when one exists. The backend never preselects its rung.

## Route-to-task and todo projection

Project the approved route and Executor Plan deterministically into only applicable work under these fixed phases:

```text
Authority / Design
Build
Assurance
Completion
```

- `Authority / Design` contains only required authority, decision, specification, or implementation-graph work.
- `Build` contains vertical Task Contracts, each bound to stable owned `AC-...` IDs.
- `Assurance` contains criterion-complete worker smoke for compact. For standard and high-consequence it also contains every required boundary verification, neutral fan-in and post-fan-in proof when applicable, one original-initial whole-scope review or its eligible later closure/impact pass, and one required terminal `dev-continual-learning` assessment that invokes portable `assess` once.
- Consume every explicit topology-required or D04 verification Task Contract at its declared boundary. Earlier isolated-lineage verification, neutral integration, and post-integration verification remain explicit and are never flattened into the final profile tail.
- For standard and high-consequence, use the parser-valid plan shape exactly once: consume an exact final numbered `dev-verification` → `dev-code-review` → `dev-continual-learning` suffix when present, or follow the final non-tail Receiver and backend-schedule those current profile owners when absent. The visible `dev-continual-learning` owner invokes portable `assess` inside that same task. Never use both forms, schedule a second profile tail, or add a direct portable owner.
- Compact, whether a work-only Executor Plan or direct no-plan Task Contract, ends after criterion-complete worker smoke and has no profile tail.
- `Completion` contains terminal criterion/evidence accounting and, only after valid successful completion, the bounded terminal values returned to `dev-ask` for current-fence validation and normalization. It creates no presenter task, dispatch, state, transition, approval, Handoff, fence, or evidence rerun and cannot imply missing proof.
- Omit skipped stages. Sequential task count alone does not add independent proof. Do not create router, Handoff-transfer, already-represented approval, runtime-transition, or per-task assurance ceremony.
- Equivalent route facts yield the same phase/task shape in every semantic harness context. The one post-assurance repair appends one consolidated `Build` repair item and only impacted smoke/proof plus, when eligible, one review item; it does not reopen `Authority / Design`, restore consumed budget, or reset the list.

This view is derivative. Stable plan and acceptance IDs bind it, while `pending|ready|running|...` state remains exclusively backend-owned and is never serialized back into the plan or todo view.

## State machines

Task state for standard and high-consequence work is exact:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated → verified
verified → reviewed → complete
pending|ready|running|handed-off|verified|integration-pending|integrated|reviewed
  → blocked|failed|cancelled
```

Compact state is exact:

```text
accepted → ready → running → handed-off → complete
accepted|ready|running|handed-off → blocked|failed|cancelled
```

The standard/high-consequence run projection is `accepted → ready → running → verifying → integrating? → reviewing → complete`. Compact omits `verifying`, `verified`, `reviewing`, and `reviewed`.

`blocked|failed` are recoverable only under the rules below. `cancelled` never reopens.

The existing backend run state carries the parent outcome identity, per-revision semantic-attempt count, the inherited post-assurance repair token (`unused 1/1 | consumed 1/1 by <revision>`), initial-review/rerun status, and any current same-plan human grant identity with its grant-scoped cycle and review consumption. These are fields of the current execution state, not a plan, todo, router service, or new runtime ledger. Every derivative Task Contract for the same parent outcome inherits them monotonically; changing a revision cannot restore a consumed token or review slot or erase blocker, attempt, diagnosis-entry, review, or grant history. A human grant supplies continuation authority only; it is not progress. An otherwise-eligible post-2/2 worth action is carried once by the Common Handoff and resulting same-plan authority revision, not persisted as a second record or runtime ledger. Close is terminal completion authority and mutates none of these fields.
The same run state carries any exact originating papercut `PC-ID` without making it workflow, candidate, or ledger state. Descendant revisions preserve it unchanged; no broad or unrelated outcome may attach, replace, or clear it.
For standard and high-consequence, that same run state records one immutable profile-tail source: `numbered` with the exact parser-validated final task suffix, or `backend-scheduled` with the final non-tail Receiver; compact records `none`. Boundary consumption is monotonic. A numbered task or backend-scheduled owner is consumed once, and the other form cannot be selected later. This is runtime accounting, not a plan, todo, task, stage, or new ledger.

Across pause or compaction, the existing Common Handoff and its immutable digest-bound references preserve the same completed stages, tail source and selected role slot, semantic-attempt, repair, review, learning, and grant counters, terminal state, and artifact or receipt identities. Before resume or any role dispatch, the backend proves current target and applicable-rule bytes equal the once-bound manifests. An exact repeated tuple of parent outcome, target-manifest digest, applicable-rule-manifest digest, role slot, and semantic-attempt or grant identity is an `idempotency-violation` before dispatch and consumes no call, slot, counter, transition, or Handoff. A distinct authorized slot and a recorded pre-semantic safe transport retry are not duplicates.

Transitions:

- `ready`: every blocker is satisfied and every declared revision is current. Same-context compact rechecks and binds its exact Task Contract, target, environment, checklist, and current authority directly; it has no parser-valid repository-plan readiness. When a task is governed by an Executor Plan, resolve the active repository plan, Task Contract, exact current repository bytes, and current native human approval. Consume one fresh `scripts/executor_plan.py validate PLAN` result and accept only schema `executor-plan-validation/v1`, `status=valid`, empty issues, lifecycle `PENDING` or `IN_PROGRESS`, and one identical SHA-256 across the current repository bytes, result, and approved revision. Initial readiness binds that exact SHA-256. Parser-valid lifecycle bookkeeping may change on continuation without reapproval; every other contract change follows ADR-0001 D02. Any unavailable, invalid, stale, mismatched, terminal, structural-only, or manually constructed evidence keeps every task non-ready. A dependency is satisfied only by the exact current upstream Handoff/artifact plus declared proof or approval. Bind authority for every affected existing observable contract or failure mode; return missing observable policy to `dev-requirements` and settled policy with missing durable technical design to `dev-specification`.

Before any Task Contract enters `ready`, bind its declared `Methods` value against current authority. `none` is an explicit successful binding and loads no method skill. For a work task, `tdd` must load and invoke `dev-tdd` as the implementation method and bind its approved acceptance criterion, observable seam, owner, and test-first authority. An unavailable skill, mismatched binding, or unsupported value blocks before semantic attempt consumption; never fall back to `none`. An authored verification, review, or continual-learning tail task must bind `none` and rejects any other value before an attempt. Direct no-plan work uses the same gate after deriving its authority-selected value.
A standard/high-consequence grant-scoped repair cannot enter `ready` until the backend rereads the executing plan's authoritative file and binds its newest exhaustion record to the same task/outcome, exact target, route, owner, and remaining criteria/receiver. Missing or stale records and `grant: pending` block; `grant: second-opinion ...` also blocks while `opinion: absent`. `grant: continue ...` may ready the same owner after ordinary gates. A current `same-route` opinion may ready the already-granted cycle; `authority-change` yields `authority-change-required`, and `no-progress` yields `no-progress-stop`. For an otherwise-eligible post-2/2 authority return, only a Common Handoff-carried Continue selected from a current worth frame with a materially changed falsifiable hypothesis may ready one same-plan revision; it never readies attempt 3 on the exhausted revision. Continue with hypothesis `none`, rejected Close, eligible terminal Close, and any unselected action ready no implementation cycle. No older record, Handoff, action, or transcript can supply readiness.

A worker task cannot enter `ready` until its Task Contract binds the complete `Solution discipline` block and, when a Context Pack exists, that pack carries the same block.
- `running`: exactly one owner and one semantic attempt holds the task.
- `handed-off`: one bounded result plus exact-revision implementer smoke for that task/attempt and a complete Handoff.

After every work task emits its complete Common Handoff, apply the always-applied papercut rule once as a soft look before consuming the next task or profile boundary. Candidate-triggered activation also remains available throughout current dev, product, custom, and direct work. A qualifying candidate routes through the existing papercut contract without changing task or run state; it is not a task, `Methods` value, stage, todo phase, or learning trigger. No candidate means no papercut skill or ledger access and no papercut output. Narrower or no-ledger authority makes any qualifying capture report-only. A complete captured candidate may become input only to the already-scheduled adapter assessment; the look never dispatches `dev-continual-learning` or invokes portable `continual-learning`.

- `verified`: for standard/high-consequence, fresh criterion-level proof exists for an exact declared isolated-lineage, integrated, final single-lineage, or explicit high-consequence boundary. Sequential intermediate tasks remain smoke-backed.
- `integration-pending`: at least two required isolated lineages are independently verified and the neutral integration contract is current.
- `integrated`: every exact verified lineage was neutrally combined, integrated smoke passed, and the new target identity exists; it is not yet verified.
- `reviewed`: the backend-selected profile-required Standards and Specification slot approved the exact verified single-lineage or post-integration target. Original-initial is the one whole-scope discovery pass and seals predicate-bound finding lineages. Original-rerun and grant-scoped slots are closure/impact passes that bind the prior receipt, remaining lineages, exact repair delta, accepted review impact map, affected/unchanged surfaces, required finite consumers, and exact unchanged-surface reuse identities. Review budget is monotonic: use original-initial while `not run`, otherwise original-rerun while `unused`, and only then one pass bound to the current human grant when both original slots were already consumed before that granted cycle. `APPROVED` requires every prior lineage closed, no repair-caused or disjoint outcome-relevant blocker, and valid unaffected-surface reuse.
- `complete`: compact has criterion-complete exact-target smoke and no unclosed criterion; standard/high-consequence also have every required verification, integration, review, adapter-consumed portable learning result, and evidence-accounting gate terminal. Human-selected Close may move an eligible `proof-ceremony` target to normal completion only when exact current evidence affirmatively establishes the parent outcome and every remaining ID is proof-only: either all normal gates already pass, or named sealed evidence is re-accounted without a semantic call on the unchanged target and only the already-scheduled route tail then finishes once when still required. Completion records the exact target, satisfied outcome, reused evidence identities, Close disposition, and residual risk; it never uses plan `CLOSED`, backend `cancelled`, unverified-failure wording, or a new state.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

For compact, worker `completed` with criterion-complete smoke moves the exact target to `handed-off`; backend validation of the in-conversation Handoff moves the run directly to `complete`. Compact never enters `verified` or `reviewed`.

At a declared standard/high-consequence verification boundary, verifier `VERIFIED` moves the exact target from `handed-off|integrated` to `verified`. Worker `blocked|transport-unavailable|authority-change-required` maps to `blocked`; `failed|timed-out` to `failed`; `cancelled` to `cancelled`. Verifier `NOT VERIFIED` moves its target to `failed` with deduplicated blocking `AC-...` IDs; `INCONCLUSIVE` leaves it unverified and blocks consumption. A universal changed invariant is not `VERIFIED` until its finite current consumer/callsite map is bound and every entry is proved. Semantic integration conflict blocks integration while preserving exact verified inputs as historical evidence. No assurance role repairs.

Profile-required review is ineligible until the exact final target is `VERIFIED` and the backend selects the first available pass in the original-initial, original-rerun, current-grant order. Review `APPROVED` moves it to `reviewed`; `CHANGES REQUIRED` from an incomplete existing lineage or directly evidenced repair-caused lineage moves it to `failed` with deduplicated same-outcome repair-eligible IDs; `CHANGES REQUIRED` from a disjoint outcome-relevant non-safety lineage keeps the parent incomplete and returns `authority-change-required` to the outcome authority without repair, verification restart, learning, approval, or completion; `INCONCLUSIVE` blocks completion pending named evidence. A disjoint non-outcome observation is advisory, and independently serious safety is separate-authority intake. A grant-scoped pass exists only after both original slots were already consumed and admits no duplicate same-target review. Standard requires distinct verifier and reviewer identities; high-consequence requires the bound decorrelation. Advisories never reopen work.

The `dev-continual-learning` adapter accepts portable `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED` with the exact seven-field payload and portable result identity. `CURATED` and `NO DURABLE LEARNING` satisfy a dispatched standard/high-consequence gate; `BLOCKED` names one exact portable resume condition. Compact never dispatches the adapter. A mutating Learning Candidate found during compact work is deferred to a separately approved standard or high-consequence maintenance route. Only the backend records transitions; the adapter and assurance roles never repair, retry, mutate the settled target, restore budget, or grant authority.
For a complete papercut-originated candidate, consume the adapter's exact portable `Papercut outcome` only after validating that it names the unchanged originating `PC-ID` and a candidate-specific authoritative result. `CURATED` with a verified durable correction maps to `fixed`; candidate-specific final rejection or failed frozen evaluation maps to `rejected`; replacement by another record or decision maps to `superseded`; `BLOCKED`, incomplete, deferred, global, non-candidate-specific, or unrelated results map to `open`. After a terminal `fixed | rejected | superseded` mapping, the backend invokes the portable `papercut` skill's settlement procedure once with `{record_id, kind, resolved_on, reference, summary}`. An `open` mapping, narrower authority, or helper failure performs no ledger mutation and is disclosed without weakening the workflow outcome. Never settle another record or infer a terminal kind from a broad portable result.

Read-only dev-implementation lifecycle eval observations project already-bound contract facts; they never dispatch work, record a transition, create a task or owner, satisfy a gate, prove runtime behavior, or mutate state. This grammar does not replace a portable skill's own read-only activation observations; for example, `papercut:...` activation records remain governed by the papercut contract and are not lifecycle events. An explicitly requested lifecycle observation may combine these two forms:

- A bounded lifecycle projection uses `state:<state>|owner:<evidence source>|output:<observable case-bound evidence>`. `state` must be an existing runtime transition, and the included events must preserve causal order. The projection may omit unrelated transitions and non-material prerequisite detail, but omission never bypasses or disproves the real transition gates above. A projected event is unsupported if the bound case contract (registry criterion/expected facts plus fixture request) and current source do not bind the authority, target, result, or evidence it reports, or if it contradicts an existing state definition. Existing state definitions supply prerequisites that are not the requested projection facet; the projection cannot weaken them.
- A non-lifecycle snapshot uses `snapshot:<executor-plan|plan-transport|method-binding|terminal-evidence|resume>|owner:<observation source>|output:<observable case-bound fact>`. It may report only an explicitly requested, source-entitled fact: the shared parser's active repository identity, result, digest, exact-byte binding, parsed lifecycle, and terminal-completeness value; the approved draft-copy or repository transport facts below; a method binding's Intent, Methods, skill revision, criterion, seam, owner, and authority; bounded terminal receipt/accounting facts; or the bounded resume facts below. A snapshot is not a transition or transition evidence. Its `owner` is only the fact's observation source: `owner:planner` may label the current parent or session owner's publication result without dispatching or inventing a planner role. Snapshots may precede, follow, or stand apart from bounded lifecycle projections when explicitly requested.

For `snapshot:resume`, the observation source is `owner:backend`, and the output may report only current equality with the once-bound target and applicable-rule manifests; restoration from the existing Common Handoff of the same completed stages, tail source, selected role slot, semantic-attempt, repair, review, learning, and grant counters, terminal state, and artifact or receipt identities; no reopened completed stage; and pre-dispatch rejection of an exact duplicate tuple as `idempotency-violation` with no call, slot, counter, transition, or second Handoff consumed. A distinct authorized slot and a recorded pre-semantic safe transport retry retain their existing eligibility. The snapshot never performs re-entry, dispatch, restoration, or state mutation.

For `snapshot:plan-transport`, the source-entitled OMP projection is its adapter-owned session-local draft copy, byte-exact active repository copy, synchronization extension, and automatic archival of the active repository plan only; the local copy supplies no execution, continuation, or approval authority and the snapshot never claims Grok-equivalent transport. The source-entitled Grok projection is repository authoring plus adapter-owned identity presentation, model, role, tool, and recovery mechanics; discovered `.grok/rules` is transport input, not validator or parent-attestation proof.

Only the backend records transitions. In a lifecycle projection, `owner:planner` identifies bounded decomposition evidence produced by the current parent or session owner for an already-approved full-orchestration graph; it never denotes or dispatches a dedicated custom planner user-agent, creates a planner tree, or moves Executor Plan publication authority. `owner:worker`, `owner:dev-verification`, `owner:dev-integration`, `owner:dev-code-review`, and `owner:dev-continual-learning` likewise identify bounded evidence sources consumed by backend accounting, not transition owners. The route-visible `dev-continual-learning` adapter remains the sole learning evidence source and carries the exact portable mode and result identity; portable `continual-learning` is not a second owner. Use `owner:dev-verification` for both `verifying` and `verified`, with `verifying` before `verified`; use `owner:dev-code-review` for `reviewing` and `reviewed`. Backend control and terminal-accounting events use `owner:backend`, including `accepted`, `ready`, `blocked`, `failed`, `cancelled`, `integration-pending`, and `complete`. Portable `CURATED | NO DURABLE LEARNING` is evidence for the completion gate; `dev-continual-learning` never owns `state:complete`.

When an observation explicitly requests a full task-shape projection, emit every scenario-mandated event with no prose. `accepted` names the bound human Intent, selected Methods, and, for noncompact work, exactly one `numbered | backend-scheduled` tail source. `ready` follows the exact successful method binding; `running` names one semantic attempt. Each work `handed-off` output names its exact target, exact-revision smoke, and complete Common Handoff before `papercut-soft-look`, then names report-only candidate routing or case-bound no-candidate silence. `verifying` and `verified` name the exact target and fresh criterion-level proof; `reviewing` and `reviewed` name that exact VERIFIED target, the selected eligible review pass, and approval evidence. Fan-in projections retain every D04 lineage proof, neutral integration, and post-integration proof. A noncompact `complete` is backend-owned and names the exact target, terminal evidence accounting, and the adapter's exact portable result identity as a satisfied gate; compact names tail source `none` and ends after backend validation of criterion-complete smoke and the Common Handoff. An unavailable method binding projects `accepted → blocked` with unchanged attempt count and no `ready` or `running`.

For a narrower case-specific lifecycle projection, emit only the requested material facets. An included state still means its full runtime definition and ordinary prerequisites held unless the same case explicitly reports a failed gate; outputs may therefore focus on the named smoke, finding, grant, proof, or review evidence without restating unrelated Handoff or method fields. Multiple explicitly separated scenarios may each begin at `accepted`. A `snapshot:terminal-evidence` may be the sole observation or may follow a bounded lifecycle projection when the request explicitly asks for both; it reports only the named already-reached or blocked accounting facts and cannot imply completion.

`papercut-soft-look` is never a `state:...` event, transition, task, or owner. In a full dev-implementation task-shape lifecycle projection it may appear only inside the output of the preceding work `state:handed-off` event, after the complete Handoff; emit no separate lifecycle soft-look line.

`blocked → ready` requires blocker-resolution evidence plus current authority/input revisions. `failed → ready` requires explicit backend retry authorization. Renewed cancelled work uses a new task revision.

## Execute the ready frontier

1. Snapshot exact accepted authority, applicable Executor Plan and Task Contract digests, outcome/criterion map, Orchestrator Role Profile result or same-context compact mode, target identities, assurance profile, inherited semantic-attempt/post-assurance state, initial-review/rerun state, and human gates.
2. Mark only dependency-satisfied tasks ready. Never dispatch a descendant from partial, stale, diagnostic-only, failed, timed-out, cancelled, or interrupted output.
3. Dispatch one ready owner per Task Contract and minimal Context Pack. Workers do not delegate or alter shared contracts; the capable parent does not implement leaf work while a viable assigned executor owns it. A worker authorized to create, replace, or archive a repository plan must first load `plan-repo-storage.md` and obey its canonical identity, collision, exact-copy, and archive postconditions. Plan storage never supplies approval or readiness.
4. Require worker smoke for every task and every semantic attempt on that attempt's exact produced, current, or safely runnable partial revision before accepting its Handoff. Smoke exercises the frozen acceptance cases, fixtures, oracles, every finite current consumer/callsite entry, and assigned normal/preserved and degraded-behavior scenarios, including trigger, response, and recovery boundary when present. Any mismatch fails before assurance. Bugs rerun the original red-capable reproduction; performance uses like-for-like baseline/treatment; user-visible changes exercise the available surface. Record identity, scenario, environment, fixtures, expected/observed result, artifact reference, rerun status, failure, and uncertainty. Smoke and worker reasoning or conclusions are local evidence and never independent verifier evidence.

Only after the complete work-task Handoff exists, perform its one soft papercut look under the `handed-off` rule above. This observation neither delays nor advances the next runtime state. Candidate handling stays inside the existing papercut authority; no-candidate work remains silent.
At the first ready transition for each immutable revision, enumerate and bind the current applicable-project-rule manifest and target manifest once. Record canonical source URI, exact SHA-256 revision, and scope for every rule, authority, target, fixture, and dependency entry. Before verifier, reviewer, curator, or completion consumption, compare current bytes with those exact entries; never re-enumerate, rebuild, or silently extend a manifest. Omitted, stale, mismatched, or contradictory coverage blocks before dispatch or completion, names one correction receiver, and consumes no semantic attempt, repair token, verification, initial review, review rerun, learning, or criterion recipe.

Before the first final profile-tail boundary, bind the run's immutable tail source from the parser-valid active repository plan or direct Task Contract: consume the exact parser-validated final numbered suffix once when the plan names it, or otherwise follow the final non-tail Task Contract's Receiver and schedule the current profile verification, review, and learning owners once. Bind the selected role slot, and before each role dispatch prove current target and applicable-rule bytes equal the once-bound manifests. A pause or compaction resumes from the existing Common Handoff without reopening a completed boundary or changing the source, slot, counters, terminal state, or artifact identities. Refuse a missing, contradictory, already-consumed, mixed, stale-manifest, stale-revision, stale-Handoff, or duplicate-dispatch source before consuming a call, transition, slot, counter, or new Handoff.
5. For compact, do not schedule independent verification. For standard/high-consequence, schedule fresh `dev-verification` only for the final single-lineage target, each exact isolated lineage before fan-in, the exact integrated target after fan-in, and explicit approved high-consequence checkpoints. For same-outcome repair, bind the frozen parent acceptance/proof identities and backend-frozen complete criterion action map. Schedule fresh proof for impacted entries and propose exact prior evidence for unaffected entries; the verifier independently accepts or rejects every action, runs fresh proof when reuse is invalid, and emits one fresh aggregate verdict over the unchanged set. Freshness requires current target and applicable-rule manifest equality, fresh impacted proof, and that fresh aggregate verdict. A universal changed invariant also binds a finite current consumer/callsite map and proves every entry. Do not add per-task proof or synthesize a criterion from a review finding, changed path, fixture, or consumer.
6. When at least two isolated lineages exist, send only every exact independently `VERIFIED` input to neutral `dev-integration`, then require fresh post-integration verification of the combined identity. Single-lineage work skips integration.
Every explicit topology/D04 verification runs where declared, including each isolated lineage and the post-integration target. These boundaries are not members of the optional final suffix and are not removed or repeated by tail-source selection.
7. After a standard/high-consequence final target is `VERIFIED`, send it to the first eligible read-only `dev-code-review` slot under the monotonic review-budget order and bound identity separation. Compact never dispatches review. Original-initial receives the whole declared scope and seals each finding lineage by violated contract/invariant, trigger and expected/observed predicate, observable consumer or affected parent criterion, causal boundary, finite current consumer map when applicable, and originating target/evidence identity; paths are evidence, not identity. Original-rerun or grant-scoped review receives the prior receipt, remaining lineages, exact repair delta, accepted review impact map, affected and unchanged surfaces, required finite consumers, and exact original evidence proposed for unchanged surfaces. It freshly reviews lineage closure and impacted surfaces; it may reuse original evidence only when byte, authority, contract, and dependency identities are unchanged. Verifier receipts are inputs, never the review verdict. D22 classification remains unchanged. Later same-outcome repair admits only incomplete closure of a sealed lineage or a repair-caused new lineage with exact repaired revision, changed bytes or contract delta, accepted D04 edge, observable failure path, and fresh affected proof; a grant hypothesis cannot admit. Disjoint non-outcome findings are advisory, independently serious safety is separate intake, and disjoint outcome-relevant non-safety findings return `authority-change-required` with the parent incomplete. Aggregate approval requires every prior lineage closed, no repair-caused or disjoint outcome-relevant blocker, and valid unchanged-surface reuse.
8. Apply the consolidated post-assurance algorithm below. No assurance role repairs, and review never receives an unverified target.
9. For standard and high-consequence work, dispatch one terminal Standard `dev-continual-learning` assessment after the settled reviewed outcome. Bind portable mode `assess` and pass the completed Common Handoff, nonempty affected-artifact manifest, every available complete Learning Candidate, incomplete-candidate evidence, frozen evaluation tuple and unchanged originating `PC-ID` when present, current manifest evidence, selected role slot, counters, reached stages, terminal state, advisories, and artifact or receipt identities. The adapter invokes portable `continual-learning` exactly once inside the same task and places its exact result identity and seven-field payload in that adapter attempt's one required Common Handoff; the portable invocation creates no task or Handoff. A wording-only advisory is terminal residual risk: it does not fail the parent or restart verification, review, or learning, and the parent performs its one already-required terminal Standard assessment before completion. Advisory-only approval bypasses repair and continues that already-scheduled assessment; the assessment receives advisories as residual input, not mutation authority. Compact never dispatches this skill; defer a mutating Learning Candidate to a separately approved standard or high-consequence maintenance route. A separately authorized engineering Deep route instead binds portable mode `deep` through the same adapter. Do not add a direct portable tail owner, second task, state, or Handoff.
For a papercut-originated assessment, require the adapter's returned portable `Papercut outcome`, validate its exact ID/result/reference boundary, perform at most the one backend-owned terminal settlement call above, and account for `resolved | unchanged | report-only/open`. An incomplete candidate remains named evidence-only input and never triggers settlement; it neither suppresses nor independently triggers the already-eligible affected-artifact assessment.
10. Account for every task, once-bound manifest entry, frozen parent criterion/proof identity, repair impact-map action, review lineage and admission disposition, terminal advisory, and criterion verdict. After terminal `VERIFIED`, final `APPROVED`, and `CURATED | NO DURABLE LEARNING` receipts exist, completion compares current bytes with the bound manifests and validates receipts, counters, target, lineage, repair-action, and evidence identities while executing zero criterion proof recipes. Then return the bounded terminal values and evidence index to `dev-ask` for current-fence validation and presentation without a new approval unless a reapproval trigger applies. Do not build or expose the presenter fence, invoke the presenter, or create presenter lifecycle state in the backend. If cleanup is later elected, dev-ask classifies a new maintenance outcome with fresh authority, acceptance, Task Contract, target, attempts, and assurance; no parent repair, verification, review, or learning state is inherited.

Shipping is absent from local completion. Invoke `dev-shipping` only under separate explicit human delivery authority.

## Attempts, failure, and recovery

Classify before any continuation: local implementation defect; routine/known-cause assurance defect; hard unexplained defect; context/process defect; shared-assumption defect; authority defect; integration conflict; external blocker; transport failure; or timeout/stall. Routine and known-cause worker, smoke, verifier, or reviewer failures repair directly when budget permits. A hard unexplained defect may enter `dev-diagnosing-bugs` once only when expected behavior and stable reproduction are settled; unchanged hypothesis/evidence cannot re-enter.

Progress return semantics are enforceable:

- `completed`: the observed evidence advances at least one named acceptance criterion, including an authorized diagnosis criterion only when its falsifiable hypothesis/evidence frontier materially changed;
- `proved`: fresh declared proof advances at least one named criterion;
- `blocker-resolved`: exact evidence removes at least one named blocker by mapping its stable ID to the affected `AC-...`, exact target/caller/failure path, impacted proof recipe, expected result, and observed result on the repaired identity, plus every entry in any finite current consumer/callsite map;
- `authority-change`: authorized decision evidence changes governing authority, scope, acceptance, topology, effects, route, or next owner; or
- `no-progress-stop`: none of those deltas occurred.

Only the first four classes with their named observed delta may authorize another attempt or wave. No criterion delta, blocker resolution, changed authority, or authorized changed-hypothesis evidence means `no-progress-stop`, regardless of an available slot, new agent, elapsed time, another audit, or changed artifact count.

For one unchanged Task Contract revision:

```text
attempt 1: initial bounded implementation
attempt 2: optional evidence-gated retry
```

Attempt 2 is legal only when attempt-1 evidence shows criterion progress, exact blocker resolution, or an authorized materially changed falsifiable hypothesis. Exact blocker resolution requires the stable-ID/AC/target-or-caller/proof/expected/observed map on the repaired identity; a universal changed invariant also proves every entry in its finite current consumer map. Reject a generic passing suite, changed fixture, prose assertion, or unchanged-hypothesis retry before it runs. Attempt 3 is forbidden. Derivative revisions inherit consumed attempts, and the repair Task Contract uses the same two-attempt bound. Reaching 2/2 alone is terminal and creates no question. Only when the next receiver would otherwise be human authority for another same-outcome revision, every ordinary hard-stop gate passes, and the current owner can make the worth classification below does the backend frame one otherwise-eligible authority ask; it creates no exhaustion record.

Before semantic work or mutation, adapters may make at most two short additional transport retries when replay is safe and idempotent, failure is plausibly transient, and every error is recorded. Transport retries do not consume semantic attempts or the repair token. Then block or use an already approved contract-equivalent topology; never retry indefinitely, reset the lifecycle, or change accounts/providers without configured authority.

## Consolidated post-assurance repair

The parent outcome begins with one inherited token, `unused 1/1`; no task revision owns a fresh token, and no grant restores it.

1. For compact, aggregate every failed or incomplete smoke-backed `AC-...` once. For standard/high-consequence, complete the current boundary verification pass and aggregate every available deduplicated blocking criterion ID once; review is ineligible while any criterion is `NOT VERIFIED` or `INCONCLUSIVE`.
2. Only after standard/high-consequence final verification succeeds, run the first eligible review. Original-initial is the one whole-scope discovery pass and seals predicate-bound finding lineages. Admit its directly evidenced outcome-relevant blockers into the one available consolidated repair set, mapped to affected parent `AC-...` IDs or to `affected AC: none` plus the exact fixed contract/consumer. An authority conflict never enters repair. Changed paths, prose, metadata, frontmatter, scanner-string equality, stale adjacent explanation, self-referential consistency assertions, and other disjoint non-outcome observations remain terminal advisories; independently serious safety uses separate-authority intake.
3. If the eligible blocker set is nonempty and the token is unused, authorize exactly one consolidated owner repair Task Contract covering the complete set. Mark `consumed 1/1 by <repair revision>` at authorization; every ungranted derivative revision inherits consumption.
4. The repair owner has at most two semantic attempts, exact-revision smoke on every attempt, the progress gate above, and no attempt 3. Assurance roles never repair.
5. After repair, compact reruns impacted and preserved-behavior smoke. Standard/high-consequence use the backend-frozen complete causal impact map: rerun impacted smoke/proof fresh, have the verifier independently accept or reject every unaffected reuse identity and basis, and compute one fresh aggregate verdict over the unchanged frozen parent set. Preserve consumer-only findings as repair-smoke and later-review obligations without synthesizing criteria. Then select review in this order: original-initial if still `not run`; otherwise original-rerun if still `unused`; otherwise one pass bound to the current grant identity only when both original slots were already consumed before that granted cycle. A grant never restores or relabels an original counter. Original-initial is whole-scope discovery. A later slot binds the prior receipt, remaining lineages, exact repair delta, accepted review impact map, affected/unchanged surfaces, required finite consumers, and proposed original evidence for unchanged surfaces; it freshly reviews remaining-lineage closure and impacted surfaces and reuses evidence only for byte-, authority-, contract-, and dependency-identical unaffected surfaces. After original-initial, admit same-outcome repair only for incomplete closure of an existing lineage or a repair-caused new lineage with the exact repaired revision, changed bytes or contract delta, accepted D04 edge, observable failure path, and fresh affected proof. A grant or changed hypothesis is not causal evidence. A disjoint non-outcome observation is advisory; serious safety is separate intake; a disjoint outcome-relevant non-safety defect remains `CHANGES REQUIRED`, keeps the parent incomplete, and returns `authority-change-required` without repair, verification restart, learning, approval, or completion. Aggregate `APPROVED` requires all prior lineages closed, no repair-caused or disjoint outcome-relevant blocker, and valid unchanged-surface reuse; verifier receipts cannot substitute for the verdict.
6. Compact stops with exact deduplicated evidence on any remaining blocker, inconclusive proof, repeated frontier, unchanged hypothesis, exhausted local attempts, or consumed token. It has no human continuation checkpoint.
7. A later-slot disjoint outcome-relevant defect exits through `authority-change-required` before any D03 worth checkpoint; serious safety exits through separate-authority intake. Otherwise standard/high-consequence first completes the current evidence pass and runs authority, exact-target, safety, and conclusive-evidence hard-stop gates. Missing or stale authority/target identity, unsafe or uncertain effects, or contradictory or inconclusive evidence stops before classification, frame, or question. After those gates pass, classify stable remaining IDs as `outcome-blocking` only when affirmative evidence shows that at least one prevents the exact delivered artifact from satisfying its parent `OUT-...`; classify them as `proof-ceremony` only when current affirmative evidence shows that artifact already satisfies the outcome and every remaining ID is a harness, proof-recipe, or evidence-accounting obligation with no causal path to artifact behavior. For `outcome-blocking` only, a repeated frontier, unchanged hypothesis, exhausted attempts without a falsifiable changed approach, or any other `no-progress-stop` is a continuation-only gate that stops before presentation; a human action cannot waive it or substitute for criterion progress. Proof-ceremony may frame hypothesis `none`; those continuation-only gates do not suppress its worth frame, Second opinion, or eligible Close, while Continue remains rejected without mutation when the frame names no changed hypothesis.
8. At an otherwise-eligible exhausted-token/original-review-rerun checkpoint, stop mutation, keep the same plan `IN_PROGRESS`, persist and emit the exact eight-line exhaustion record below, and then emit exactly five presentation lines in this order: `remaining stable IDs`, `relation to OUT-...`, `what already satisfies the goal`, `changed falsifiable hypothesis`, and `recommendation`. Use only relation `outcome-blocking | proof-ceremony`, hypothesis `<materially changed falsifiable approach> | none`, and recommendation `continue-differently | independent check | close with residual`. Then show exactly **Continue**, **Second opinion**, and **Close**. Apply the same frame and actions before an otherwise-eligible post-2/2 same-outcome authority revision, but create no record.
9. **Continue** preserves the current original initial-review/rerun counters, plan, outcome, authority URI, route, owner, scope, criteria, and consumed token when applicable. It binds exactly one same-owner, same-plan cycle or revision named by the materially changed falsifiable hypothesis with normal attempts 1/2 and 2/2; it never creates attempt 3 on an exhausted revision. Continue remains visible but is rejected without plan/runtime/record mutation when the frame says `none`. It creates no recovery task, skill, stage, outcome, ledger, or plan and is authority rather than progress.
10. **Second opinion** is one human-selected grant with an advisory prelude, never an unconditional retry or automatic dispatch. For `proof-ceremony`, dispatch at most one fresh read-only worker context whose sole objective is whether another loop is worth doing; its Handoff names the exact inspected target and returns exactly `same-route`, `authority-change`, or `no-progress`. This branch dispatches no `dev-verification`, `dev-code-review`, or `dev-diagnosing-bugs`, and it does not load `rethink` unless the human explicitly selects `rethink` as the method for this one advisory. For `outcome-blocking`, first reuse one already-eligible exact-target verifier, reviewer, or diagnosis Handoff; otherwise dispatch at most one currently eligible existing role: `dev-verification` at a declared standard/high-consequence proof boundary, `dev-code-review` for an exact `VERIFIED` review-boundary target, or `dev-diagnosing-bugs` for a hard unexplained reproducible defect. Never duplicate a same-target opinion. Persist exactly one disposition. `same-route` starts the already-granted cycle without a third prompt only when the worth frame names a materially changed falsifiable hypothesis; `authority-change`, `no-progress`, stop advice, or hypothesis `none` starts no cycle.
11. A grant-scoped cycle still requires attempt evidence for attempt 2 and fresh exact-target smoke and impacted proof. The grant and opinion are authority, not progress. After fresh `VERIFIED` proof, apply the review order in step 5; a grant-scoped review exists only after both original review slots were already consumed.
12. If a granted cycle later ends with new eligible progress-bearing work, persist a new exhaustion checkpoint, classify the remaining work again, and present a new worth frame before asking. Each explicit action authorizes only its own next cycle or terminal Close. Automatic recursion, revision-churn reset, reuse of an older grant or action, successor planning solely to regain budget, diagnosis re-entry, and lifecycle reset remain forbidden.

### Same-plan exhaustion record

Before a D03 checkpoint asks or resumes, replace every brace token and create exactly these eight logical lines; no additional field is allowed. The worth frame and actions are presentation outside this record. A post-2/2 authority ask creates no record:

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

For an ordinary plan, append the instantiated record under the still-open task. For an implementation-grade plan, append it as a new entry in `Blockers and recovery`. Apply only the container indentation required by that location, emit the resulting eight lines inline, and persist byte-identical lines before showing the worth frame and choices. Edit only the active repository plan with anchored `edit`; do not invoke, edit, or reimplement a helper protocol.

The record body is immutable except these two monotonic transitions. Close changes neither line:

- **Continue:** change only `grant: pending` to `grant: continue {YYYY-MM-DD-HHMM}`.
- **Second opinion:** first change only that line to `grant: second-opinion {YYYY-MM-DD-HHMM}`. After the one opinion completes, change only `opinion: absent` to `opinion: {source role/Handoff}; {same-route|authority-change|no-progress}; {recommendation}; {exact inspected target}; {persisted record identity}`.

Preserve every earlier exhaustion record. The newest record is the sole D03 continuation input: `pending` blocks; `continue` may ready the same owner after ordinary gates; `second-opinion` blocks while opinion is absent; `same-route` may ready the already-granted cycle; `authority-change` and `no-progress` remain terminal for that grant. Close mutates no record line. A pending record becomes inert only when the same exact plan has terminal `DONE` status and matching Close target, goal-satisfaction evidence, and residual-risk accounting; otherwise it retains this readiness meaning. A later eligible exhaustion appends a new `pending` record instead of rewriting history or replaying an older grant.

A fresh runtime session resolves the same active repository plan and reconstructs the checkpoint from its newest record, task/outcome identity, exact target, route, owner, remaining criteria/receiver, and grant/opinion state. A session-local draft, transcript history, successor plan, new `OUT-...`, new authority URI, token reset, or new initial approval is neither required nor eligible.

An otherwise-eligible post-2/2 worth ask carries its exact five frame lines, selected action, target, evidence, and disposition once in the Common Handoff and resulting same-plan authority revision. It does not create or consult a second exhaustion record. Continue may authorize only the new revision named by its changed hypothesis; Close and Second opinion follow their action contracts without resetting attempts or inventing state.

On an upstream failure or shared-assumption break:

- mark the source and stop its transitive dependency cone;
- safely cancel running descendants;
- mark invalid-context output stale and non-consumable;
- preserve attempts, partial effects, and diagnostics;
- return to the authority owner; and
- create revised tasks only after authority is current.

Independent branches continue only when authority, inputs, safety, ownership, and eventual integration target are demonstrably unaffected. Salvage of diagnostic output needs explicit parent authorization into a new fully verified revision.

Timeout recovery records cancellation status, last progress, exact base/current/partial identities, running operations, external effects, idempotence, and process-termination certainty. Ambiguous, irreversible, or non-idempotent effects require human review. Missing permission, service, runtime, hardware, or other human-owned capability blocks with the observed absence, non-secret expected configuration location, tried equivalents, smallest human prerequisite, unaffected branches, and ready condition.

An approved backend terminal-finalizer task is exceptionally eligible after the latest reached task becomes terminal, including a failed predecessor. It may only verify available sealed receipts, inventory partial or unsealed evidence without consuming it, remove exact declared observation roots after path-kind safety checks, prove the bound sentinel unchanged, and report reached/unreached criteria plus the exact blocker and receiver. It cannot advance semantic descendants, imply completion on a stop, or consume or reset semantic, repair, verification, or review budget.

## Completion evidence

Local completion requires:

- current authority and every required approval;
- terminal state for every task and criterion;
- exact-revision implementer smoke for every task/attempt;
- for compact, every owned criterion mapped to a passing deterministic exact-target smoke scenario with expected and observed results;
- for standard/high-consequence, every required declared-boundary criterion `VERIFIED`, every isolated fan-in input and combined target proved when applicable, one profile-required final review `APPROVED`, and terminal curation `CURATED | NO DURABLE LEARNING`;
- the once-bound target and applicable-project-rule manifests freshly match current bytes at every later boundary;
- terminal `VERIFIED`, final `APPROVED`, and `CURATED | NO DURABLE LEARNING` receipt, counter, target, lineage, repair-action, and evidence identities validate without executing any criterion proof recipe during completion;
- every universal changed invariant's finite current consumer/callsite map bound and fully proved;
- for same-outcome repair, the frozen parent acceptance/proof identities, repair-proposed and backend-frozen complete criterion action map, every verifier-accepted fresh impacted result or exact unaffected reuse identity/basis, and one fresh aggregate verdict over exactly the unchanged set;
- every terminal advisory carried as residual risk through the one route-scheduled Standard assessment, with no assurance replay or inherited maintenance state;
- inherited post-assurance repair, original-initial review, later-slot closure/impact review, grant-scoped cycle, repair-admission disposition, and post-2/2 authority-return state accounted with every checkpoint terminal and no outcome-blocking or disjoint outcome-relevant work;
- every accepted Close has affirmative exact-target parent-outcome satisfaction evidence, only proof-ceremony remaining IDs, exact reused-proof accounting when applicable, explicit residual risk, no grant/opinion mutation or ad hoc assurance, and one terminal `complete`/plan `DONE` disposition;
- every rejected Close separately accounts the exact outcome-blocking IDs and rejection reason plus unchanged plan/runtime/record/proof/cycle state, and imposes no proof-ceremony or `DONE` prerequisite on later otherwise-valid completion;
- every dispatched mutating candidate's frozen evaluation and result accounted, while every compact mutating candidate is deferred without dispatch;
- every complete papercut-originated candidate's immutable `PC-ID`, authoritative outcome mapping, exact settlement result or disclosed open/report-only reason accounted;
- any declared terminal-finalizer receipts, partial evidence, exact-root cleanup, sentinel equality, reached/unreached criteria, and non-consumption accounted;
- no outcome-blocking ID, stale/partial consumable result, semantic conflict, failed dependency, or required check; and
- proof no required work remains nonterminal.

Only after every requirement above validates, expose to `dev-ask` one bounded terminal-value record containing status exactly `completed`; one observable outcome; one to three openable human-relevant changes or canonical artifacts; a named verification or specialty-authority check, terminal verdict, and fetchable immutable evidence identity; one normalized papercut result; one normalized learning result; one material residual risk or `none`; one durable Resume from locator with immutable revision or digest; one existing Common Handoff locator/reference with immutable revision or approved in-conversation form tied to Resume from; caller-supplied Constraints containing the exact clause `shipping not authorized` once; and local engineering Next exactly `none`. Compact uses its criterion-complete exact-target smoke as specialty-authority evidence and marks learning `skipped — compact assurance`; standard/high-consequence uses the already-validated assurance and learning receipts. This exposure executes no criterion recipe, reruns no evidence, constructs no presenter fence, and creates no task, stage, dispatch, state, transition, approval, or Handoff.

Return an evidence index naming the parent outcome/authority revision; applicable active repository Executor Plan identity, exact digest, and parser-valid readiness receipt or direct same-context compact Task Contract; every governing/task revision and owned criterion; Orchestrator Role Profile decision or one-owner mode; assurance profile and selection evidence; per-revision attempts; inherited repair token and consuming revision; original initial-review/rerun accounting; every same-plan exhaustion checkpoint and grant/opinion disposition; every eligible worth frame, selected action, post-2/2 no-record handoff, Close eligibility/disposition, exact target, goal-satisfaction evidence, reused proof identities, and residual risk; grant-scoped cycle and review consumption; bound compatibility and degraded-behavior authority and scenarios; every worker result and exact-revision smoke; once-bound target and applicable-rule manifest entries plus every later comparison; any declared verification boundaries and finite consumer maps; verifier/reviewer identities when dispatched; integration evidence; sealed review lineages, later-slot intake and reuse identities, admission dispositions, blockers/advisories; curation or compact deferral outcome; criteria advanced or unchanged; expected versus observed delta; terminal-finalizer evidence; completion receipt/counter/identity validation and zero criterion-recipe invocation; route impact; deferred authority, residual risk, next unmet criterion, one completion receiver, and terminal accounting.
For same-outcome repair, the evidence index also records the frozen parent snapshot, repair-owner proposal, backend-frozen action for every criterion, each criterion's impacted/unaffected classification and causal path/fixture/consumer, each verifier-accepted fresh or reused proof action, eligible blocker mapping or authority conflict, later-slot lineage/admission disposition, terminal advisories, and the fresh repaired aggregate verdict.
The evidence index also names each originating papercut `PC-ID`, the candidate-specific authoritative result, mapped kind, durable reference when terminal, helper result, and proof that unrelated record IDs remained outside the settlement call.
For valid successful completion, the evidence index exposes only that bounded terminal-value record to `dev-ask` and links all detail through the one existing Common Handoff identity and immutable revision. It does not copy raw manifests, counters, receipts, or curation payloads into terminal values, construct or expose a `completion-presentation-input` fence, invoke the presenter, or create a second Handoff.

## Stop and next owner

Stop for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe partial effects, no-progress, exhausted attempts without an eligible changed approach, or any evidence-backed hard stop above. Compact also stops on a consumed repair token with remaining work and never receives a worth frame, opinion, or Close. Eligible standard/high-consequence next-loop authority remains on the same plan and uses the hard-stop-first worth frame instead of creating a successor lifecycle. Reject outcome-blocking Close and Continue without a changed hypothesis without mutation. Eligible proof-ceremony Close completes or re-accounts existing sealed proof through normal terminal accounting; it is never cancellation. Re-enter `dev-ask` only for a material route change; checkpoint actions are presented directly from backend evidence, and complete terminal evidence returns to `dev-ask` for validation and normalization before direct `completion-presentation` invocation without a new approval. Return authority defects to their canonical owner. Never infer completion from a worker Handoff, invent provider policy, or restart the lifecycle to regain budget.
