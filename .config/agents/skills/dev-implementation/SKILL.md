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

A changed upstream revision invalidates affected readiness and completion. Preserve prior output as historical evidence; create a new task revision.
Revalidate the immutable assurance profile before execution. `compact` requires settled authority, design, acceptance, and verification; bounded one-context and one-lineage ownership; reversible effects; deterministic proof; no prior implementation or verification failure; and no material consequential surface. Disqualify compact for unresolved authority or design; shared or public interfaces or schema; security, privacy, authentication, permission, or credential concerns; stored data, migration, destructive, or external effects; multiple lineages; unresolved UI judgment; hard, flaky, or performance diagnosis; prior failure; durable recovery; broad, ambiguous, or bias-prone work; or an explicit heightened-assurance request. Route material security, privacy, authentication, permission, data-loss, migration, destructive, public/shared compatibility, concurrency, recovery, reliability, performance, or explicitly heightened work to `high-consequence`; route remaining noncompact work to `standard`. An upward reclassification is a material route change returned to `dev-ask`; never silently downgrade an approved profile.

## Capability profile

Before execution, require truthful capability reporting with `native`, `contract-equivalent`, or `unavailable`, constraints, live-verified versus documentation-inferred status, and whether one non-implementer identity can be reused across ordered verifier and reviewer attempts.

The semantic adapter seam is:

```text
profile() → Capability Profile
dispatch(Task Contract, Context Pack, Role Profile) → Attempt Handle | Handoff
observe/control(Attempt Handle) → Attempt State | Handoff
recover(Run Reference) → Logical Graph + Attempts + Handoffs
```

`profile` and `dispatch` are mandatory for executable work. Observation/control is required only for asynchronous or cancellable work; recovery is required only for durable-recovery claims. Adapters own discovery, invocation, runtime identities, isolation/storage/combination mechanics, tools, limits, configured credentials references, and actual execution metadata. Filesystem/config presence is not proof of invocability.

Transport precedence is live-verified native → direct contract-equivalent → safe disclosed downgrade → stop. A fallback cannot weaken approval, authority, immutable identity, collision safety, evidence, verification independence, integration, recovery, or honest failure. This capability-profile fallback governs execution transport only and never authorizes application-visible compatibility or degraded behavior.

## Select execution mode

Choose from topology, coordination, and recovery—not size, task count, token estimate, model availability, or the presence of delegation.

### One owner — default

Use one cohesive fresh-context owner when coupled files, interfaces, state, or reasoning should stay together. Large cohesive work remains one owner.

### Small local batch

Use a bounded batch only when all ready slices are genuinely independent: settled interfaces, disjoint behavioral/state ownership, concrete acceptance, low contention, declared fan-in, and one coordinator able to observe one or two waves. Path separation alone is insufficient. A safe sequential projection with identical task and Handoff boundaries is the fallback when concurrent isolation is unavailable; it governs execution topology only and never application-visible compatibility or degraded behavior.

### Full orchestration

Use full orchestration for approved recursive decomposition, many dependency waves, long-running isolated work, durable cross-context recovery, persistent operator-visible logical state, or neutral fan-in across multiple lineages. A shallow graph without one of those triggers remains one owner or a bounded batch; dependency failure changes quarantine and continuation behavior, not execution mode by itself.

A contract-preserving downgrade to a simpler mode may be disclosed in the Handoff. This topology downgrade governs execution topology only and never authorizes application-visible compatibility or degraded behavior. Escalating one owner → batch or batch → full is a material route change: return to `dev-ask` for a revised Route Overview and human approval.

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
- Observable criterion per bullet
## Verification
- Required scenario/check and evidence form per criterion
## Execution policy
- Decomposition permission
- Isolation/integration needs
- Material decision gates
## Completion output
- Required artifacts
- Required handoff receiver
```

Semantic fields, including the Compatibility and degraded behavior block, are immutable within an attempt. A material correction creates a new revision and invalidates descendants bound to the old one. Operational subdivision is legal only when the parent explicitly delegates it; every child preserves parent authority, scope, acceptance, verification, and fixed shared contracts.
The assurance profile is immutable within a Task Contract revision. `compact` binds `same non-implementer identity` and `qualifying-trigger only`; `standard` binds `separate identities` and `required`; `high-consequence` binds `decorrelated identities` and `required`. A profile change creates a new Task Contract revision.


Each attempt receives a minimal revision-bound Context Pack: the exact Task Contract, including its Compatibility and degraded behavior block; governing artifact links/revisions; declared dependency Handoffs; bounded repository/environment context; the applicable project-rule manifest; safety constraints; and expected receiver/Handoff contract. The manifest names canonical rule artifacts, exact revisions, and scope, or records backend-bound `none` with its bounded check. The backend binds it before dispatch; receivers consume it and never infer its absence from filesystem discovery. Missing or contradictory manifest evidence is `INCONCLUSIVE`. Exclude ambient sibling state, orchestration transcripts, speculative notes, stale summaries, and prior reasoning.

## State machines

Task state is exact:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated
verified|integrated → reviewed → complete
pending|ready|running|handed-off|verified|integration-pending|integrated|reviewed
  → blocked|failed|cancelled
```

Run projection is exact:

```text
accepted → ready → running → verifying → integrating? → reviewing → complete
```

`blocked|failed` are recoverable only under the rules below. `cancelled` never reopens.

Transitions:

- `ready`: every blocker is satisfied and every declared revision is current. A dependency is satisfied only by the exact current upstream Handoff/artifact plus any proof or approval that the Task Contract declares; a planning Handoff requires backend contract validation rather than implementation verification unless its contract explicitly says otherwise. Terminal predecessor completion is required only when the Task Contract declares it. Before any task becomes `ready`, bind authority for every affected existing observable contract or failure mode. Return a missing observable-policy decision to `dev-requirements`; return settled policy with unresolved shared or cross-cutting technical design to `dev-specification`. Discovery of an unnamed existing contract during execution yields `authority-change-required`; the backend or worker must not choose preservation, removal, a breaking cutover, hard failure, shim, default, retry, or alternate path.
- `running`: exactly one owner and one attempt holds the task.
- `handed-off`: one bounded result plus implementer smoke and a complete Handoff.
- `verified`: fresh criterion-level proof against the exact target from the canonical verifier; compact verification precedes review even when both semantic attempts use one non-implementer identity.
- `integration-pending`: every required lineage is verified and the integration contract is current.
- `integrated`: exact lineages were neutrally combined, integrated smoke passed, and the new target identity exists.
- `reviewed`: a separate final Standards and Specification review attempt passed on the exact verified single-lineage or post-integration target under the assurance arrangement.
- `complete`: required or triggered terminal curation and evidence accounting pass with no required nonterminal, stale, failed, unverified, unintegrated, or unreviewed work.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

Outcome mapping is exact: worker `completed` with evidence → `handed-off`; `blocked|transport-unavailable|authority-change-required` → `blocked`; `failed|timed-out` → `failed`; `cancelled` → `cancelled`. Verifier `NOT VERIFIED` moves its target `handed-off → failed` while the verifier emits a completed failing Handoff; verifier `INCONCLUSIVE` leaves the target unverified and blocks consumption. Semantic integration conflict blocks the integration task while verified inputs remain historical, insufficient lineages. No role repairs inside verification, integration, or review; an authorized repair always uses a new task revision.

Review and curation mappings are exact. Review `APPROVED` moves the exact current `verified` or `integrated` target to `reviewed`; `CHANGES REQUIRED` leaves the review attempt completed but moves the target to `failed`, and any repair requires a newly authorized implementation revision; `INCONCLUSIVE` preserves the current target identity but blocks completion pending named evidence. Compact binds two ordered semantic attempts to one fresh non-implementer identity: its verifier Handoff must reach `VERIFIED` before that identity receives the immutable target and verification Handoff for a separate reviewer Handoff. If the adapter cannot reuse that identity, use two fresh non-implementers and disclose the stronger-separation fallback. Standard requires distinct verifier and reviewer identities. High-consequence requires distinct non-implementer attempt identities, fresh contexts, and role-specific Context Packs and prompts; use distinct equivalent Role Profiles or model families when available, disclose a same-model residual when they are not, and stop only when the approved Task Contract explicitly requires model-family separation. A reviewer may consume the verification Handoff but never worker reasoning.

Curation `CURATED` and `NO DURABLE LEARNING` satisfy a required or triggered curation gate; `BLOCKED` preserves `reviewed` and blocks completion. After compact review, the backend screens for a Learning Candidate, explicit durable correction or decision, repeated settled process evidence, or a severe qualifying incident. It dispatches `dev-continual-learning` only when one is present; otherwise it records `curation not triggered` and the checked trigger facts in terminal evidence without creating a curation task or Handoff. Only the backend records these transitions. Verifier, reviewer, and curator never repair, retry, mutate the target, or grant authority.

State traces always begin with run `accepted` before any task becomes `ready`. When a prompt explicitly declares a read-only state-trace simulation and requests only canonical events, emit every scenario-mandated existing transition in causal order as `state:<state>|owner:<canonical owner>|output:<observable output>` with no prose. Use `owner:dev-verification` for both `verifying` and `verified`, and emit `verifying` before `verified`; never substitute generic owner names. Each output names the case-bound authority, Task Contract or Context Pack, target, smoke, or independent proof that justifies its transition. Those events model lifecycle policy without dispatching, mutating, or performing stage work, and they never prove application-runtime behavior. The backend owns `accepted`, `ready`, `blocked`, `failed`, `cancelled`, assurance intake/revalidation, trigger screening, and terminal accounting transitions; the worker owns running attempt evidence and its Handoff, while verifier, integrator, reviewer, and curator own only their bounded evidence. A worker failure is evidence consumed by a backend-owned `failed` transition. Curation is a completion gate, not a new task or run state.
When a read-only simulation declares approved existing application compatibility/degraded behavior and calls for independent proof, model the causal sequence through `verified`: accepted output must name the current approved Task Contract, application compatibility, and degraded behavior binding; ready names the one worker's Task Contract and Context Pack plus normal and unavailable scenarios; running names bounded implementation on the exact target; handed-off names smoke of normal and declared degraded behavior; verifying names fresh criterion-level application proof; and verified names `VERIFIED` exact-target preservation of the existing degraded response under the declared condition. These use existing states and model a required proof path, not live application evidence.
When a read-only intake simulation identifies possible existing application degraded behavior without baseline evidence or approved policy, it models only backend accepted then blocked: accepted names the missing compatibility/degraded authority and that no adapter or topology fallback is evaluated; blocked names return of the missing observable policy to `dev-requirements` and that no task becomes ready. It does not model a task, mutation, or application fallback.

`blocked → ready` requires blocker-resolution evidence plus current authority/input revisions. `failed → ready` requires explicit backend retry authorization. Renewed cancelled work uses a new task revision.

## Execute the ready frontier

1. Snapshot accepted authority, task graph, capabilities including ordered verifier/reviewer identity reuse, target identities, assurance profile, and human gates.
2. Mark only dependency-satisfied tasks ready. Never dispatch a descendant from partial, stale, diagnostic-only, failed, timed-out, cancelled, or interrupted output.
3. Dispatch one ready owner per Task Contract and minimal Context Pack. Workers do not delegate or alter shared contracts.
4. Require implementer smoke on the exact produced revision before accepting the worker Handoff. Smoke must exercise the assigned normal/preserved and degraded-behavior acceptance scenarios, including trigger, observable response, and recovery boundary when present. Bugs rerun the original red-capable reproduction; performance uses like-for-like baseline/treatment; user-visible changes exercise the available user-facing surface. Record scenario, environment, fixtures, expected/observed result, artifact reference, rerun status, failure, and uncertainty.
5. Send every changed observable or consequential target to fresh `dev-verification`. Under compact, bind the verifier attempt to one fresh non-implementer identity and require its separate Handoff to reach `VERIFIED`. A valid deterministic nonbehavioral skip records reason, revision, and identity proof.
6. When multiple lineages exist, send only exact verified inputs to `dev-integration`, then require fresh post-integration verification of the combined identity.
7. Send the exact verified target to read-only `dev-code-review`. Compact uses an ordered separate reviewer attempt by the verifier identity when capability reuse is reported, or two fresh non-implementers when it is not; standard uses distinct verifier and reviewer identities; high-consequence uses decorrelated identities. Findings create owner-authorized repair work and renewed proof; review never repairs.
8. For standard and high-consequence work, run one terminal `dev-continual-learning` assessment. For compact work, run the backend trigger screen after review; dispatch that assessment only on a qualifying trigger, otherwise record `curation not triggered` and checked trigger facts in terminal evidence. `CURATED` or `NO DURABLE LEARNING` satisfies a dispatched gate; `BLOCKED` prevents workflow completion until resolved or human scope changes.
9. Account for every task and criterion, then return terminal evidence to `dev-ask` for completion presentation without a new approval unless a reapproval trigger applies.

Shipping is absent from local completion. Invoke `dev-shipping` only under separate explicit human delivery authority.

## Attempts, failure, and recovery

Classify before retry: local implementation defect; context/process defect; shared-assumption defect; authority defect; integration conflict; external blocker; transport failure; or timeout/stall. Every retry records evidence, a falsifiable changed hypothesis, and what differs.

For one unchanged Task Contract revision:

```text
attempt 1: initial bounded implementation
attempt 2: optional same-owner repair
attempt 3: final fresh-context implementation, optionally stronger
```

Attempt 2 is legal only after reproducing the exact failure under current authority with a fast deterministic or high-reproduction red/green loop and no hidden human step or context contamination. Otherwise skip it and use the final fresh-context attempt; an unused slot is not another retry. Attempt 3 receives a fresh Context Pack plus concise failure evidence, independently re-establishes the loop, and uses a stronger qualified capability only when evidence shows capability insufficiency. There is no fourth semantic attempt.

Before semantic work or mutation, adapters may make at most two short extra transport retries when replay is safe and idempotent, failure is plausibly transient, and every error is recorded. Then block or safely reroute; never retry indefinitely or change accounts/providers without configured authority.

Stop earlier for safety, stale authority, no safe idempotence, ambiguous partial effects, uncertain process termination, or no falsifiable changed approach. Exhaustion leaves the task `failed` and requires human/planner escalation.

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
- implementer smoke;
- every required criterion `VERIFIED` or a valid deterministic skip;
- exact verified fan-in and post-integration proof when needed;
- final Standards and Specification `PASS` with overall `APPROVED`;
- terminal curation outcome `CURATED` or `NO DURABLE LEARNING` when the assurance contract requires or triggered it, or compact backend evidence of `curation not triggered` with checked trigger facts;
- no blocker, stale/partial result, semantic conflict, failed dependency, or required check; and
- proof no required work remains nonterminal.

Return an evidence index naming every governing/task revision, assurance profile and selection evidence, bound compatibility and degraded-behavior authority and scenarios, worker result and smoke, verification proof and verdict, verifier/reviewer identities and separation mode, integration lineage and evidence, review outcome, required, triggered, or not-triggered curation evidence, advisories, deferred authority, residual risk, and terminal accounting.

## Stop and next owner

Stop for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe partial effects, or an evidence-backed blocker. Re-enter `dev-ask` for material route escalation; return current terminal evidence to it for completion presentation without a new approval unless a reapproval trigger applies. Return authority defects to their canonical owner. Never infer completion from a worker Handoff.
