---
name: dev-implementation
description: >
  Execute an approved direct contract or dependency-wired implementation tickets
  through bounded work, smoke, independent verification, neutral fan-in when
  needed, review, curation, and evidence-backed completion. Use after authority is
  executable; reject stale contracts and default cohesive work to one owner.
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

When dispatching the canonical planner, also read [`references/planner-role-profile.md`](references/planner-role-profile.md). Its stricter no-code, no-delegation transport remains separate from the parent profile. Both planner and backend validate an Executor Plan through the one shared structural parser before publication or mutation.

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
## Outcome progress
- Parent outcome: OUT-<id> @ <authority revision>
- Owned acceptance: AC-<id>...
- Expected progress signal: <observable criterion, blocker, authority, or authorized hypothesis/evidence delta>
- Current frontier: <next unmet criterion or named blocker>
- Inherited convergence: semantic attempts <used>/<maximum for this revision>; run-wide post-assurance repair <unused 1/1 | consumed 1/1 by repair revision>; initial review <not run | run once>; review rerun <unused | consumed>
- Allowed return classes: completed | proved | blocker-resolved | authority-change | no-progress-stop
## Role
<router | planner | subplanner | worker | verifier | integrator | reviewer | curator | backend | shipper>
## Assurance
- Profile: compact | standard | high-consequence
- Selection evidence and checked compact disqualifiers
- Verification/review arrangement: same non-implementer identity | separate identities | decorrelated identities
- Curation: qualifying-trigger only | required
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
## Dependencies
- Blocking task names
- Exact upstream Handoff and artifact revisions required
## Acceptance
- AC-<id>: <observable criterion>
## Verification
- AC-<id> → <required scenario/check and evidence form>
## Execution policy
- Decomposition permission
- Isolation/integration needs
- Material decision gates
## Completion output
- Required artifacts and exact identities
- Exactly one required Handoff receiver
```

Semantic fields, including the Compatibility and degraded behavior block, are immutable within an attempt. A material correction creates a new revision and invalidates descendants bound to the old one. Operational subdivision is legal only when the parent explicitly delegates it; every child preserves parent authority, scope, acceptance, verification, and fixed shared contracts.
Within one parent outcome, every `AC-...` has exactly one implementation owner and one proof recipe. A child receives only its owned criteria and cannot split, duplicate, or reassign them without a new approved Task Contract revision.
The assurance profile is immutable within a Task Contract revision. `compact` binds `same non-implementer identity` and `qualifying-trigger only`; `standard` binds `separate identities` and `required`; `high-consequence` binds `decorrelated identities` and `required`. A profile change creates a new Task Contract revision.


Each attempt receives one minimal revision-bound Context Pack containing only: the exact Task Contract; exact governing authority; relevant active ADR and fixed-contract revisions; exact dependency Handoffs; the parent outcome and owned-criteria delta; inherited per-revision semantic-attempt count; inherited run-wide post-assurance repair state and consuming revision; initial-review/rerun state; bounded target/repository/environment context; the applicable project-rule manifest; permitted and prohibited effects; and one expected Handoff receiver. The manifest names canonical rule artifacts, exact revisions, and scope, or records backend-bound `none` with its bounded check. The backend binds the pack before dispatch; receivers never infer missing authority from filesystem discovery. Missing or contradictory evidence is `INCONCLUSIVE`. Exclude transcripts, conversational history, stale reasoning, unrelated files, broad repository summaries, full-plan duplication, secrets, credentials, volatile noise, and unsupported assumptions.

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
- `Assurance` explicitly contains every required boundary verification: each exact isolated lineage before fan-in, the exact integrated target after neutral fan-in, the final single-lineage target, and explicit approved high-consequence checkpoints; neutral fan-in only for multiple independently verified isolated lineages; one eligible final review; and required or triggered terminal assessment.
- `Completion` contains terminal criterion/evidence accounting and completion presentation only. It cannot imply missing proof.
- Omit skipped stages. Sequential task count alone does not add independent proof. Do not create router, Handoff-transfer, already-represented approval, runtime-transition, or per-task assurance ceremony.
- Equivalent route facts yield the same phase/task shape in every semantic harness context. The one post-assurance repair appends one consolidated `Build` repair item and only impacted smoke/proof plus, when eligible, one review item; it does not reopen `Authority / Design`, restore consumed budget, or reset the list.

This view is derivative. Stable plan and acceptance IDs bind it, while `pending|ready|running|...` state remains exclusively backend-owned and is never serialized back into the plan or todo view.

## State machines

Task state is exact:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated → verified
verified → reviewed → complete
pending|ready|running|handed-off|verified|integration-pending|integrated|reviewed
  → blocked|failed|cancelled
```

Run projection is exact:

```text
accepted → ready → running → verifying → integrating? → reviewing → complete
```

`blocked|failed` are recoverable only under the rules below. `cancelled` never reopens.

The existing backend run state carries the parent outcome identity, per-revision semantic-attempt count, the inherited post-assurance repair token (`unused 1/1 | consumed 1/1 by <revision>`), and initial-review/rerun status. These are fields of the current execution state, not a plan, todo, router service, or new runtime ledger. Every derivative Task Contract for the same parent outcome inherits them monotonically; changing a revision cannot restore a consumed token or erase blocker, attempt, diagnosis-entry, or review history.

Transitions:

- `ready`: every blocker is satisfied and every declared revision is current. Before the first task becomes ready, invoke `scripts/executor_plan.py` with the current semantic harness context and `consumer=backend`; missing, invalid, or mismatched structural evidence blocks all plan-authorized mutation. A dependency is satisfied only by the exact current upstream Handoff/artifact plus declared proof or approval. A planning Handoff requires backend contract validation rather than implementation verification unless its contract says otherwise. Terminal predecessor completion is required only when declared. Bind authority for every affected existing observable contract or failure mode; return missing observable policy to `dev-requirements` and settled policy with missing durable technical design to `dev-specification`.
- `running`: exactly one owner and one semantic attempt holds the task.
- `handed-off`: one bounded result plus exact-revision implementer smoke for that task/attempt and a complete Handoff.
- `verified`: fresh criterion-level proof exists for an exact declared isolated-lineage, integrated, final single-lineage, or explicit high-consequence boundary. Sequential intermediate tasks remain smoke-backed; they do not become independent-proof boundaries merely because another task follows.
- `integration-pending`: at least two required isolated lineages are independently verified and the neutral integration contract is current.
- `integrated`: every exact verified lineage was neutrally combined, integrated smoke passed, and the new target identity exists; it is not yet verified.
- `reviewed`: one separate final Standards and Specification pass approved the exact verified single-lineage or post-integration target under the assurance arrangement. A repair after an eligible initial review permits only one impacted review rerun.
- `complete`: required or triggered terminal curation and evidence accounting pass with no required nonterminal, stale, failed, unverified, unintegrated, or unreviewed work.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

At a declared verification boundary, verifier `VERIFIED` moves the exact target from `handed-off|integrated` to `verified`; this is the only path from an integrated combined identity into review eligibility.
Outcome mapping is exact: worker `completed` with evidence → `handed-off`; `blocked|transport-unavailable|authority-change-required` → `blocked`; `failed|timed-out` → `failed`; `cancelled` → `cancelled`. At a declared verification boundary, verifier `NOT VERIFIED` moves its target `handed-off|integrated → failed` while the verifier emits a completed failing Handoff with deduplicated blocking `AC-...` IDs; verifier `INCONCLUSIVE` leaves the target unverified and blocks consumption. Semantic integration conflict blocks the integration task with deduplicated conflict/criterion IDs while verified inputs remain historical, insufficient lineages. No assurance role repairs; an authorized consolidated repair always uses a new owner task revision and consumes the inherited token at authorization.

Review and curation mappings are exact. Review is ineligible until the exact final target is `VERIFIED`; a pre-review verification failure proceeds to repair/reverification without review. Review `APPROVED` moves the exact current verified target to `reviewed`; `CHANGES REQUIRED` leaves the one review pass completed but moves the target to `failed` with deduplicated blocking finding IDs; `INCONCLUSIVE` preserves target identity but blocks completion pending named evidence. Advisories are residual risk and never reopen work. Compact binds two ordered semantic attempts to one fresh non-implementer identity: its verifier Handoff must reach `VERIFIED` before that identity receives the immutable target and verification Handoff for a separate reviewer Handoff. If the adapter cannot reuse that identity, use two fresh non-implementers and disclose the stronger-separation fallback. Standard requires distinct verifier and reviewer identities; high-consequence requires the bound decorrelation.

Curation `CURATED` and `NO DURABLE LEARNING` satisfy a dispatched gate; curator `BLOCKED` names one exact current-contract conflict or missing authority and cannot start an audit loop. After compact review, the backend screens for a Learning Candidate, explicit durable correction or decision, qualified settled recurrence, or a severe incident. It dispatches `dev-continual-learning` only when present; otherwise compact `curation not triggered` with checked facts is terminal without a curation task or Handoff. Only the backend records transitions. Verifier, integrator, reviewer, and curator never repair, retry, mutate the target, restore budget, or grant authority.

State traces always begin with run `accepted` before any task becomes `ready`. When a prompt explicitly declares a read-only state-trace simulation and requests only canonical events, emit every scenario-mandated existing transition in causal order as `state:<state>|owner:<canonical owner>|output:<observable output>` with no prose. Use `owner:dev-verification` for both `verifying` and `verified`, and emit `verifying` before `verified`; never substitute generic owner names. Each output names the case-bound authority, Task Contract or Context Pack, target, smoke, or independent proof that justifies its transition. Those events model lifecycle policy without dispatching, mutating, or performing stage work, and they never prove application-runtime behavior. The backend owns `accepted`, `ready`, `blocked`, `failed`, `cancelled`, assurance intake/revalidation, trigger screening, and terminal accounting transitions; the worker owns running attempt evidence and its Handoff, while verifier, integrator, reviewer, and curator own only their bounded evidence. A worker failure is evidence consumed by a backend-owned `failed` transition. Curation is a completion gate, not a new task or run state.
When a read-only simulation declares approved existing application compatibility/degraded behavior and calls for independent proof, model the causal sequence through `verified`: accepted output must name the current approved Task Contract, application compatibility, and degraded behavior binding; ready names the one worker's Task Contract and Context Pack plus normal and unavailable scenarios; running names bounded implementation on the exact target; handed-off names smoke of normal and declared degraded behavior; verifying names fresh criterion-level application proof; and verified names `VERIFIED` exact-target preservation of the existing degraded response under the declared condition. These use existing states and model a required proof path, not live application evidence.
When a read-only intake simulation identifies possible existing application degraded behavior without baseline evidence or approved policy, it models only backend accepted then blocked: accepted names the missing compatibility/degraded authority and that no adapter or topology fallback is evaluated; blocked names return of the missing observable policy to `dev-requirements` and that no task becomes ready. It does not model a task, mutation, or application fallback.

`blocked → ready` requires blocker-resolution evidence plus current authority/input revisions. `failed → ready` requires explicit backend retry authorization. Renewed cancelled work uses a new task revision.

## Execute the ready frontier

1. Snapshot exact accepted authority, Executor Plan and Task Contract digests, outcome/criterion map, Orchestrator Role Profile result, target identities, assurance profile, inherited semantic-attempt/post-assurance state, initial-review/rerun state, and human gates.
2. Mark only dependency-satisfied tasks ready. Never dispatch a descendant from partial, stale, diagnostic-only, failed, timed-out, cancelled, or interrupted output.
3. Dispatch one ready owner per Task Contract and minimal Context Pack. Workers do not delegate or alter shared contracts; the capable parent does not implement leaf work while a viable assigned executor owns it.
4. Require worker smoke for every task and every semantic attempt on that attempt's exact produced, current, or safely runnable partial revision before accepting its Handoff. Smoke exercises the assigned normal/preserved and degraded-behavior scenarios, including trigger, response, and recovery boundary when present. Bugs rerun the original red-capable reproduction; performance uses like-for-like baseline/treatment; user-visible changes exercise the available surface. Record identity, scenario, environment, fixtures, expected/observed result, artifact reference, rerun status, failure, and uncertainty. Smoke is local evidence, never independent proof.
5. Schedule fresh `dev-verification` only for the final single-lineage target, each exact isolated lineage before it becomes a fan-in input, the exact integrated target after fan-in, and explicit approved high-consequence checkpoints. Do not add per-task proof merely because a shared lineage has multiple sequential tasks; do not combine isolated lineages under final-only proof. A valid deterministic nonbehavioral boundary skip records reason, revision, and identity proof.
6. When at least two isolated lineages exist, send only every exact independently `VERIFIED` input to neutral `dev-integration`, then require fresh post-integration verification of the combined identity. Single-lineage work skips integration.
7. After final-target `VERIFIED`, send the exact target to one read-only `dev-code-review` pass. Compact uses an ordered separate reviewer attempt by the verifier identity when capability reuse is reported, or two fresh non-implementers when not; standard uses distinct verifier and reviewer identities; high-consequence uses the bound decorrelation. Review completes the whole scope once, deduplicates blockers, and leaves advisories as terminal residual risk.
8. Apply the consolidated post-assurance algorithm below. No assurance role repairs, and review never receives an unverified target.
9. For standard and high-consequence work, dispatch one terminal Standard `dev-continual-learning` assessment after the settled reviewed outcome. It inspects only affected artifacts and returns exactly `Updated`, `Added`, `Removed`, `Skipped`, `Validation`, and `Deep candidate` in its curation payload. For compact, use the trigger screen above. `CURATED`, `NO DURABLE LEARNING`, or compact `curation not triggered` is terminal; curator `BLOCKED` stops only on its exact current-contract conflict or missing authority.
10. Account for every task and criterion, then return terminal evidence to `dev-ask` for completion presentation without a new approval unless a reapproval trigger applies.

Shipping is absent from local completion. Invoke `dev-shipping` only under separate explicit human delivery authority.

## Attempts, failure, and recovery

Classify before any continuation: local implementation defect; routine/known-cause assurance defect; hard unexplained defect; context/process defect; shared-assumption defect; authority defect; integration conflict; external blocker; transport failure; or timeout/stall. Routine and known-cause worker, smoke, verifier, or reviewer failures repair directly when budget permits. A hard unexplained defect may enter `dev-diagnosing-bugs` once only when expected behavior and stable reproduction are settled; unchanged hypothesis/evidence cannot re-enter.

Progress return semantics are enforceable:

- `completed`: the observed evidence advances at least one named acceptance criterion, including an authorized diagnosis criterion only when its falsifiable hypothesis/evidence frontier materially changed;
- `proved`: fresh declared proof advances at least one named criterion;
- `blocker-resolved`: exact evidence removes at least one named blocker;
- `authority-change`: authorized decision evidence changes governing authority, scope, acceptance, topology, effects, route, or next owner; or
- `no-progress-stop`: none of those deltas occurred.

Only the first four classes with their named observed delta may authorize another attempt or wave. No criterion delta, blocker resolution, changed authority, or authorized changed-hypothesis evidence means `no-progress-stop`, regardless of an available slot, new agent, elapsed time, another audit, or changed artifact count.

For one unchanged Task Contract revision:

```text
attempt 1: initial bounded implementation
attempt 2: optional same-owner repair
attempt 3: final fresh-context implementation, optionally stronger
```

Attempt 2 is legal only after reproducing the exact failure under current authority with a fast deterministic or high-reproduction red/green loop and no hidden human step or context contamination. Otherwise skip it and use the final fresh-context attempt; an unused slot is not another retry. Attempt 3 receives a fresh Context Pack plus concise failure evidence, independently re-establishes the loop, and uses a stronger qualified capability only when evidence shows capability insufficiency. There is no fourth semantic attempt on that revision.

Before semantic work or mutation, adapters may make at most two short additional transport retries when replay is safe and idempotent, failure is plausibly transient, and every error is recorded. Transport retries do not consume semantic attempts or the repair token. Then block or use an already approved contract-equivalent topology; never retry indefinitely, reset the lifecycle, or change accounts/providers without configured authority.

## Consolidated post-assurance repair

The parent outcome begins with one inherited token, `unused 1/1`; no task revision owns a fresh token.

1. Complete the current boundary verification pass and aggregate every available deduplicated blocking criterion ID once. If any criterion is `NOT VERIFIED` or `INCONCLUSIVE`, review is ineligible: do not send the unverified target to review.
2. Only when final verification succeeds, run the one eligible final review pass and aggregate every available deduplicated blocking finding ID once. Advisories remain residual risk and never enter the repair set.
3. If the available blocker set is empty, continue without repair. If nonempty and the token is unused, authorize exactly one consolidated owner repair Task Contract covering the complete set. Mark `consumed 1/1 by <repair revision>` at authorization, before mutation; every derivative revision inherits consumption.
4. The repair owner remains subject to at most three semantic attempts for its unchanged revision, exact-revision smoke on every attempt, the progress gate above, and no fourth attempt. Assurance roles never repair.
5. After repair, rerun impacted smoke and fresh impacted verification plus preserved-behavior coverage. When an eligible review ran before repair, run exactly one review rerun after the target is verified again. When verification failed before any review, reverify first and then run the first eligible review once.
6. Stop with exact deduplicated evidence on any remaining blocker, inconclusive proof, repeated frontier, unchanged hypothesis, exhausted local attempts, ineligible review target, consumed rerun, or consumed repair token. Do not authorize a second repair, a second review rerun, diagnosis re-entry, automatic planning, or a lifecycle reset.

Stop earlier for safety, stale authority, no safe idempotence, ambiguous partial effects, uncertain process termination, or no falsifiable changed approach. Exhaustion leaves the task `failed` and returns exact evidence to the current authority or human owner; it does not reopen planning absent a material authority change.

On an upstream failure or shared-assumption break:

- mark the source and stop its transitive dependency cone;
- safely cancel running descendants;
- mark invalid-context output stale and non-consumable;
- preserve attempts, partial effects, and diagnostics;
- return to the authority owner; and
- create revised tasks only after authority is current.

Independent branches continue only when authority, inputs, safety, ownership, and eventual integration target are demonstrably unaffected. Salvage of diagnostic output needs explicit planner authorization into a new fully verified revision.

Timeout recovery records cancellation status, last progress, exact base/current/partial identities, running operations, external effects, idempotence, and process-termination certainty. Ambiguous, irreversible, or non-idempotent effects require human review. Missing permission, service, runtime, hardware, or other human-owned capability blocks with the observed absence, non-secret expected configuration location, tried equivalents, smallest human prerequisite, unaffected branches, and ready condition.

## Completion evidence

Local completion requires:

- current authority and every required approval;
- terminal state for every task and criterion;
- exact-revision implementer smoke for every task/attempt;
- every required declared-boundary criterion `VERIFIED` or a valid deterministic skip;
- every isolated fan-in input independently verified, exact neutral fan-in, and post-integration proof when needed;
- one final Standards and Specification pass with overall `APPROVED`, or its sole authorized rerun after repair;
- inherited post-assurance repair state accounted with no remaining blocker;
- terminal curation outcome `CURATED` or `NO DURABLE LEARNING` when dispatched, or compact backend evidence of terminal `curation not triggered` with checked trigger facts;
- no blocker, stale/partial result, semantic conflict, failed dependency, or required check; and
- proof no required work remains nonterminal.

Return an evidence index naming the parent outcome/authority revision; Executor Plan digest and structural preflight; every governing/task revision and owned criterion; Orchestrator Role Profile decision or one-owner mode; assurance profile and selection evidence; per-revision attempts; inherited repair token and consuming revision; initial-review/rerun accounting; bound compatibility and degraded-behavior authority and scenarios; every worker result and exact-revision smoke; declared verification boundaries, proof, exact blocking IDs, and verdicts; verifier/reviewer identities and separation mode; integration lineages, criteria, and evidence; review blockers/advisories and curation outcome; criteria advanced or unchanged; expected versus observed delta; route impact; deferred authority, residual risk, next unmet criterion, one completion receiver, and terminal accounting.

## Stop and next owner

Stop for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe partial effects, no-progress, exhausted attempts, consumed repair with a remaining blocker, or any evidence-backed stop above. Re-enter `dev-ask` only for a material route change; return current terminal evidence to it for completion presentation without a new approval when complete. Return authority defects to their canonical owner. Never infer completion from a worker Handoff, invent provider policy, or restart the lifecycle to regain budget.
