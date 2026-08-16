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
## Verification
- AC-<id> → <required scenario/check and evidence form>
- For a mutating Learning Candidate: the reporter's complete proposal plus backend-frozen `CE-... @ <sha256>`; when papercut-originated, exactly one immutable originating `PC-ID`
## Execution policy
- Decomposition permission
- Isolation/integration needs
- Material decision gates
## Completion output
- Required artifacts and exact identities
- Exactly one required Handoff receiver
```

Include `Solution discipline` only when the Task Contract's Role is `worker`, and keep it immutable within the attempt. The block binds the procedure, not a preselected result. `minimum new code` means the smallest root-cause implementation that satisfies the complete contract; it never authorizes reduced scope, behavior, compatibility, or proof. A new dependency is not a rung and still requires existing authority.

The worker chooses after reading the flow and records the inspected surfaces, selected rung, every earlier-rung disposition, preservation result, and root-cause change in the existing common Handoff `Decisions and assumptions`/choices payload.

Semantic fields, including the Compatibility and degraded behavior block, are immutable within an attempt. A material correction creates a new revision and invalidates descendants bound to the old one. Operational subdivision is legal only when the parent explicitly delegates it; every child preserves parent authority, scope, acceptance, verification, and fixed shared contracts.
Within one parent outcome, every `AC-...` has exactly one implementation owner and one proof recipe. A child receives only its owned criteria and cannot split, duplicate, or reassign them without a new approved Task Contract revision.
The assurance profile is immutable within a Task Contract revision. `compact` binds no independent verification or review and defers any mutating Learning Candidate; `standard` binds separate verifier/reviewer identities and required curation; `high-consequence` binds decorrelated identities and required curation. A profile change creates a new Task Contract revision.


Each standard or high-consequence attempt and each cross-context compact dispatch receives one minimal revision-bound Context Pack containing only: the exact Task Contract; exact governing authority; relevant active ADR and fixed-contract revisions; exact dependency Handoffs; the parent outcome and owned-criteria delta; inherited per-revision semantic-attempt count; inherited run-wide post-assurance repair state and consuming revision; initial-review/rerun state; bounded target/repository/environment context; the applicable project-rule manifest; permitted and prohibited effects; and one expected Handoff receiver. Same-context compact binds the Task Contract directly and creates no Context Pack. When a pack exists, its manifest names canonical rule artifacts, exact revisions, and scope, or records backend-bound `none` with its bounded check. The backend binds the pack before dispatch; receivers never infer missing authority from filesystem discovery. Missing or contradictory evidence is `INCONCLUSIVE`. Exclude transcripts, conversational history, stale reasoning, unrelated files, broad repository summaries, full-plan duplication, secrets, credentials, volatile noise, and unsupported assumptions.

For a standard/high-consequence Learning Candidate that may mutate guidance, the backend validates reporter ownership, authority, freshness, completeness, adjacent-case independence, and deterministic/semantic proof classification before the curator task can become ready. It canonicalizes the proposal as sorted-key compact UTF-8 JSON, embeds the exact object under Task Contract `Verification`, records `CE-... @ <sha256>`, and copies both into the Context Pack. The curator cannot create, replace, weaken, or omit the binding; a curator-discovered unbound candidate is deferred for a later bound route rather than mutated in the same assessment. Compact candidates are deferred before this seam.
A complete papercut-originated candidate on an eligible noncompact route additionally binds exactly one immutable originating `PC-ID` through the Task Contract, Context Pack, curator Handoff, and terminal accounting. A missing or mismatched ID leaves the candidate evidence-only; a non-papercut candidate carries no synthetic ID.

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
- `Assurance` contains criterion-complete worker smoke for compact. For standard and high-consequence it also contains every required boundary verification, neutral fan-in and post-fan-in proof when applicable, one eligible final review, and required terminal assessment.
- `Completion` contains terminal criterion/evidence accounting and completion presentation only. It cannot imply missing proof.
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

The existing backend run state carries the parent outcome identity, per-revision semantic-attempt count, the inherited post-assurance repair token (`unused 1/1 | consumed 1/1 by <revision>`), and initial-review/rerun status. These are fields of the current execution state, not a plan, todo, router service, or new runtime ledger. Every derivative Task Contract for the same parent outcome inherits them monotonically; changing a revision cannot restore a consumed token or erase blocker, attempt, diagnosis-entry, or review history.
The same run state carries any exact originating papercut `PC-ID` without making it workflow, candidate, or ledger state. Descendant revisions preserve it unchanged; no broad or unrelated outcome may attach, replace, or clear it.

Transitions:

- `ready`: every blocker is satisfied and every declared revision is current. Same-context compact rechecks and binds its exact Task Contract, target, environment, checklist, and current authority directly; it has no Executor Plan preflight. When a task is governed by an Executor Plan, resolve and bind from the current Context Pack the semantic `context`, stable `slug`, canonical repository root, canonical harness/session-local root and exact local counterpart path, presented authority path, Task Contract, current authoritative bytes, and harness-owned native-approved complete SHA-256. Invoke `scripts/executor_plan.py PLAN --context omp|grok --consumer backend --slug SLUG --repository-root ABS_REPOSITORY_ROOT --local-root ABS_LOCAL_ROOT --local-plan ABS_LOCAL_PLAN` exactly once against those current inputs. Accept only schema `executor-plan-preflight/v1`, `status=eligible`, `authority_outcome=local|direct`, empty top-level issues, nested `executor-plan-validation/v1` `status=valid`, locator identity matching the Context Pack, and one identical SHA-256 across current presented bytes, every branch-required authority/projection record, top-level report, nested report, and unchanged native-approved revision. Any unavailable, invalid, blocked, stale, mismatched, structural-only, or manually constructed applicable-plan evidence keeps every task non-ready. A dependency is satisfied only by the exact current upstream Handoff/artifact plus declared proof or approval. Bind authority for every affected existing observable contract or failure mode; return missing observable policy to `dev-requirements` and settled policy with missing durable technical design to `dev-specification`.

A worker task cannot enter `ready` until its Task Contract binds the complete `Solution discipline` block and, when a Context Pack exists, that pack carries the same block.
- `running`: exactly one owner and one semantic attempt holds the task.
- `handed-off`: one bounded result plus exact-revision implementer smoke for that task/attempt and a complete Handoff.

- `verified`: for standard/high-consequence, fresh criterion-level proof exists for an exact declared isolated-lineage, integrated, final single-lineage, or explicit high-consequence boundary. Sequential intermediate tasks remain smoke-backed.
- `integration-pending`: at least two required isolated lineages are independently verified and the neutral integration contract is current.
- `integrated`: every exact verified lineage was neutrally combined, integrated smoke passed, and the new target identity exists; it is not yet verified.
- `reviewed`: one profile-required separate Standards and Specification pass approved the exact verified single-lineage or post-integration target. A repair after an eligible initial review permits only one impacted review rerun.
- `complete`: compact has criterion-complete exact-target smoke and no unclosed criterion; standard/high-consequence also have every required verification, integration, review, curation, and evidence-accounting gate terminal.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

For compact, worker `completed` with criterion-complete smoke moves the exact target to `handed-off`; backend validation of the in-conversation Handoff moves the run directly to `complete`. Compact never enters `verified` or `reviewed`.

At a declared standard/high-consequence verification boundary, verifier `VERIFIED` moves the exact target from `handed-off|integrated` to `verified`. Worker `blocked|transport-unavailable|authority-change-required` maps to `blocked`; `failed|timed-out` to `failed`; `cancelled` to `cancelled`. Verifier `NOT VERIFIED` moves its target to `failed` with deduplicated blocking `AC-...` IDs; `INCONCLUSIVE` leaves it unverified and blocks consumption. A universal changed invariant is not `VERIFIED` until its finite current consumer/callsite map is bound and every entry is proved. Semantic integration conflict blocks integration while preserving exact verified inputs as historical evidence. No assurance role repairs.

Profile-required review is ineligible until the exact final target is `VERIFIED`. Review `APPROVED` moves it to `reviewed`; `CHANGES REQUIRED` moves it to `failed` with deduplicated eligible blocking finding IDs; `INCONCLUSIVE` blocks completion pending named evidence. Standard requires distinct verifier and reviewer identities; high-consequence requires the bound decorrelation. Advisories never reopen work.

Curation `CURATED` and `NO DURABLE LEARNING` satisfy a dispatched standard/high-consequence gate; curator `BLOCKED` names one exact current-contract conflict or missing authority. Compact never dispatches curation. A mutating Learning Candidate found during compact work is deferred to a separately approved standard or high-consequence maintenance route. Only the backend records transitions; assurance roles never repair, retry, mutate the target, restore budget, or grant authority.
For a complete papercut-originated candidate, consume the curator's exact `Papercut outcome` only after validating that it names the unchanged originating `PC-ID` and a candidate-specific authoritative result. `CURATED` with a verified durable correction maps to `fixed`; candidate-specific final rejection or failed frozen evaluation maps to `rejected`; replacement by another record or decision maps to `superseded`; `BLOCKED`, incomplete, deferred, global, non-candidate-specific, or unrelated results map to `open`. After a terminal `fixed | rejected | superseded` mapping, invoke the portable `papercut` skill's settlement procedure once with `{record_id, kind, resolved_on, reference, summary}`. An `open` mapping, narrower authority, or helper failure performs no ledger mutation and is disclosed without weakening the workflow outcome. Never settle another record or infer a terminal kind from a broad curation result.

State traces always begin with run `accepted` before any task becomes `ready`. When a prompt explicitly declares a read-only state-trace simulation and requests only canonical events, emit every scenario-mandated existing transition in causal order as `state:<state>|owner:<canonical owner>|output:<observable output>` with no prose. Use `owner:dev-verification` for both `verifying` and `verified`, and emit `verifying` before `verified`; never substitute generic owner names. Each output names the case-bound authority, Task Contract or Context Pack, target, smoke, or independent proof that justifies its transition. Those events model lifecycle policy without dispatching, mutating, or performing stage work, and they never prove application-runtime behavior. The backend owns `accepted`, `ready`, `blocked`, `failed`, `cancelled`, assurance intake/revalidation, trigger screening, and terminal accounting transitions; the worker owns running attempt evidence and its Handoff, while verifier, integrator, reviewer, and curator own only their bounded evidence. A worker failure is evidence consumed by a backend-owned `failed` transition. Curation is a completion gate, not a new task or run state.
When that prompt instead explicitly requests one terminal-evidence snapshot, emit exactly one `snapshot:terminal-evidence|owner:backend|output:<observable output>` line with no prose; it summarizes an already-complete or blocked gate and does not invent a new lifecycle state.
When a read-only simulation declares approved existing application compatibility/degraded behavior and calls for independent proof, model the causal sequence through `verified`: accepted output must name the current approved Task Contract, application compatibility, and degraded behavior binding; ready names the one worker's Task Contract and Context Pack plus normal and unavailable scenarios; running names bounded implementation on the exact target; handed-off names smoke of normal and declared degraded behavior; verifying names fresh criterion-level application proof; and verified names `VERIFIED` exact-target preservation of the existing degraded response under the declared condition. These use existing states and model a required proof path, not live application evidence.
When a read-only intake simulation identifies possible existing application degraded behavior without baseline evidence or approved policy, it models only backend accepted then blocked: accepted names the missing compatibility/degraded authority and that no adapter or topology fallback is evaluated; blocked names return of the missing observable policy to `dev-requirements` and that no task becomes ready. It does not model a task, mutation, or application fallback.

`blocked → ready` requires blocker-resolution evidence plus current authority/input revisions. `failed → ready` requires explicit backend retry authorization. Renewed cancelled work uses a new task revision.

## Execute the ready frontier

1. Snapshot exact accepted authority, applicable Executor Plan and Task Contract digests, outcome/criterion map, Orchestrator Role Profile result or same-context compact mode, target identities, assurance profile, inherited semantic-attempt/post-assurance state, initial-review/rerun state, and human gates.
2. Mark only dependency-satisfied tasks ready. Never dispatch a descendant from partial, stale, diagnostic-only, failed, timed-out, cancelled, or interrupted output.
3. Dispatch one ready owner per Task Contract and minimal Context Pack. Workers do not delegate or alter shared contracts; the capable parent does not implement leaf work while a viable assigned executor owns it. A worker authorized to create, replace, or archive a direct repository plan must first load `plan-repo-storage.md`, acquire its exact universally shared generation, retain it through postcondition, and release only its still-owned generation; inability to honor that protocol blocks the plan-storage effect.
4. Require worker smoke for every task and every semantic attempt on that attempt's exact produced, current, or safely runnable partial revision before accepting its Handoff. Smoke exercises the assigned normal/preserved and degraded-behavior scenarios, including trigger, response, and recovery boundary when present. Bugs rerun the original red-capable reproduction; performance uses like-for-like baseline/treatment; user-visible changes exercise the available surface. Record identity, scenario, environment, fixtures, expected/observed result, artifact reference, rerun status, failure, and uncertainty. Smoke is local evidence, never independent proof.
Before any verifier or reviewer dispatch, enumerate the current applicable rules from canonical repository instruction and rule sources available at intake. Bind the canonical source identity plus every exact rule revision and scope, then compare that complete set with the Context Pack manifest. Omitted, stale, or contradictory coverage blocks before dispatch, names one correction receiver, and consumes no semantic attempt, repair token, initial review, or review rerun.
5. For compact, do not schedule independent verification. For standard/high-consequence, schedule fresh `dev-verification` only for the final single-lineage target, each exact isolated lineage before fan-in, the exact integrated target after fan-in, and explicit approved high-consequence checkpoints. A universal changed invariant also binds a finite current consumer/callsite map and proves every entry. Do not add per-task proof merely because a shared lineage has multiple sequential tasks.
6. When at least two isolated lineages exist, send only every exact independently `VERIFIED` input to neutral `dev-integration`, then require fresh post-integration verification of the combined identity. Single-lineage work skips integration.
7. After a standard/high-consequence final target is `VERIFIED`, send it to one read-only `dev-code-review` pass under the bound identity separation. Compact never dispatches review. Review completes the declared scope once, admits same-outcome blockers only when they cite exact authority or `AC-...`, a changed surface or required existing consumer, and direct evidence, and leaves unrelated observations as advisory/deferred.
8. Apply the consolidated post-assurance algorithm below. No assurance role repairs, and review never receives an unverified target.
9. For standard and high-consequence work, dispatch one terminal Standard `dev-continual-learning` assessment after the settled reviewed outcome. Before dispatch, bind any reporter-proposed mutating candidate exactly as required by the curation Task Contract. Compact never dispatches this skill; defer a mutating Learning Candidate to a separately approved standard or high-consequence maintenance route. An eligible assessment returns exactly `Updated`, `Added`, `Removed`, `Skipped`, `Validation`, `Deep candidate`, and `Papercut outcome`; `CURATED` or `NO DURABLE LEARNING` is terminal, while `BLOCKED` names its exact contract or authority defect.
For a papercut-originated assessment, require the returned `Papercut outcome`, validate its exact ID/result/reference boundary, perform at most the one terminal settlement call above, and account for `resolved | unchanged | report-only/open`. An incomplete candidate never dispatches curation or settlement.
10. Account for every task and criterion, then return terminal evidence to `dev-ask` for completion presentation without a new approval unless a reapproval trigger applies.

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

Attempt 2 is legal only when attempt-1 evidence shows criterion progress, exact blocker resolution, or an authorized materially changed falsifiable hypothesis. Exact blocker resolution requires the stable-ID/AC/target-or-caller/proof/expected/observed map on the repaired identity; a universal changed invariant also proves every entry in its finite current consumer map. Reject a generic passing suite, changed fixture, prose assertion, or unchanged-hypothesis retry before it runs. Attempt 3 is forbidden. Derivative revisions inherit consumed attempts, and the repair Task Contract uses the same two-attempt bound.

Before semantic work or mutation, adapters may make at most two short additional transport retries when replay is safe and idempotent, failure is plausibly transient, and every error is recorded. Transport retries do not consume semantic attempts or the repair token. Then block or use an already approved contract-equivalent topology; never retry indefinitely, reset the lifecycle, or change accounts/providers without configured authority.

## Consolidated post-assurance repair

The parent outcome begins with one inherited token, `unused 1/1`; no task revision owns a fresh token.

1. For compact, aggregate every failed or incomplete smoke-backed `AC-...` once. For standard/high-consequence, complete the current boundary verification pass and aggregate every available deduplicated blocking criterion ID once; review is ineligible while any criterion is `NOT VERIFIED` or `INCONCLUSIVE`.
2. Only after standard/high-consequence final verification succeeds, run the one eligible final review and admit a same-outcome blocking finding only when it satisfies the authority/criterion, changed-surface-or-required-consumer, direct-evidence, and causal-boundary requirements. Advisories remain residual risk.
3. If the eligible blocker set is nonempty and the token is unused, authorize exactly one consolidated owner repair Task Contract covering the complete set. Mark `consumed 1/1 by <repair revision>` at authorization; every derivative revision inherits consumption.
4. The repair owner has at most two semantic attempts, exact-revision smoke on every attempt, the progress gate above, and no attempt 3. Assurance roles never repair.
5. After repair, compact reruns impacted and preserved-behavior smoke. Standard/high-consequence rerun impacted smoke, fresh impacted verification, and preserved-behavior coverage; run the first eligible review or the sole review rerun only after the target is verified.
6. Stop with exact deduplicated evidence on any remaining blocker, inconclusive proof, repeated frontier, unchanged hypothesis, exhausted local attempts, ineligible review target, consumed rerun, or consumed repair token. Do not authorize a second repair, second review rerun, diagnosis re-entry, automatic planning, or lifecycle reset.

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

An approved backend terminal-finalizer task is exceptionally eligible after the latest reached task becomes terminal, including a failed predecessor. It may only verify available sealed receipts, inventory partial or unsealed evidence without consuming it, remove exact declared observation roots after path-kind safety checks, prove the bound sentinel unchanged, and report reached/unreached criteria plus the exact blocker and receiver. It cannot advance semantic descendants, imply completion on a stop, or consume or reset semantic, repair, verification, or review budget.

## Completion evidence

Local completion requires:

- current authority and every required approval;
- terminal state for every task and criterion;
- exact-revision implementer smoke for every task/attempt;
- for compact, every owned criterion mapped to a passing deterministic exact-target smoke scenario with expected and observed results;
- for standard/high-consequence, every required declared-boundary criterion `VERIFIED`, every isolated fan-in input and combined target proved when applicable, one profile-required final review `APPROVED`, and terminal curation `CURATED | NO DURABLE LEARNING`;
- every universal changed invariant's finite current consumer/callsite map bound and fully proved;
- inherited post-assurance repair state accounted with no remaining blocker;
- every dispatched mutating candidate's frozen evaluation and result accounted, while every compact mutating candidate is deferred without dispatch;
- every complete papercut-originated candidate's immutable `PC-ID`, authoritative outcome mapping, exact settlement result or disclosed open/report-only reason accounted;
- any declared terminal-finalizer receipts, partial evidence, exact-root cleanup, sentinel equality, reached/unreached criteria, and non-consumption accounted;
- no blocker, stale/partial consumable result, semantic conflict, failed dependency, or required check; and
- proof no required work remains nonterminal.

Return an evidence index naming the parent outcome/authority revision; applicable Executor Plan digest/preflight or direct same-context compact Task Contract; every governing/task revision and owned criterion; Orchestrator Role Profile decision or one-owner mode; assurance profile and selection evidence; per-revision attempts; inherited repair token and consuming revision; initial-review/rerun accounting; bound compatibility and degraded-behavior authority and scenarios; every worker result and exact-revision smoke; any declared verification boundaries and finite consumer maps; verifier/reviewer identities when dispatched; integration evidence; eligible review blockers/advisories; curation or compact deferral outcome; applicable-rule manifest intake and non-consumption; criteria advanced or unchanged; expected versus observed delta; terminal-finalizer evidence; route impact; deferred authority, residual risk, next unmet criterion, one completion receiver, and terminal accounting.
The evidence index also names each originating papercut `PC-ID`, the candidate-specific authoritative result, mapped kind, durable reference when terminal, helper result, and proof that unrelated record IDs remained outside the settlement call.

## Stop and next owner

Stop for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe partial effects, no-progress, exhausted attempts, consumed repair with a remaining blocker, or any evidence-backed stop above. Re-enter `dev-ask` only for a material route change; return current terminal evidence to it for completion presentation without a new approval when complete. Return authority defects to their canonical owner. Never infer completion from a worker Handoff, invent provider policy, or restart the lifecycle to regain budget.
