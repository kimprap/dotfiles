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

## Capability profile

Before execution, require truthful capability reporting with `native`, `contract-equivalent`, or `unavailable`, constraints, and live-verified versus documentation-inferred status.

The semantic adapter seam is:

```text
profile() → Capability Profile
dispatch(Task Contract, Context Pack, Role Profile) → Attempt Handle | Handoff
observe/control(Attempt Handle) → Attempt State | Handoff
recover(Run Reference) → Logical Graph + Attempts + Handoffs
```

`profile` and `dispatch` are mandatory for executable work. Observation/control is required only for asynchronous or cancellable work; recovery is required only for durable-recovery claims. Adapters own discovery, invocation, runtime identities, isolation/storage/combination mechanics, tools, limits, configured credentials references, and actual execution metadata. Filesystem/config presence is not proof of invocability.

Transport precedence is live-verified native → direct contract-equivalent → safe disclosed downgrade → stop. A fallback cannot weaken approval, authority, immutable identity, collision safety, evidence, verification independence, integration, recovery, or honest failure.

## Select execution mode

Choose from topology, coordination, and recovery—not size, task count, token estimate, model availability, or the presence of delegation.

### One owner — default

Use one cohesive fresh-context owner when coupled files, interfaces, state, or reasoning should stay together. Large cohesive work remains one owner.

### Small local batch

Use a bounded batch only when all ready slices are genuinely independent: settled interfaces, disjoint behavioral/state ownership, concrete acceptance, low contention, declared fan-in, and one coordinator able to observe one or two waves. Path separation alone is insufficient. A safe sequential projection with identical task and Handoff boundaries is the fallback when concurrent isolation is unavailable.

### Full orchestration

Use full orchestration for approved recursive decomposition, many dependency waves, long-running isolated work, durable cross-context recovery, persistent operator-visible logical state, or neutral fan-in across multiple lineages. A shallow graph without one of those triggers remains one owner or a bounded batch; dependency failure changes quarantine and continuation behavior, not execution mode by itself.

A contract-preserving downgrade to a simpler mode may be disclosed in the Handoff. Escalating one owner → batch or batch → full is a material route change: return to `dev-ask` for a revised Route Overview and human approval.

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
## Ownership
- May read
- May change or produce
- Must not change
- Shared interfaces or state that remain fixed
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

Semantic fields are immutable within an attempt. A material correction creates a new revision and invalidates descendants bound to the old one. Operational subdivision is legal only when the parent explicitly delegates it; every child preserves parent authority, scope, acceptance, verification, and fixed shared contracts.

Each attempt receives a minimal revision-bound Context Pack: the exact Task Contract; governing artifact links/revisions; declared dependency Handoffs; bounded repository/environment context; applicable project rules and safety constraints; and expected receiver/Handoff contract. Exclude ambient sibling state, orchestration transcripts, speculative notes, stale summaries, and prior reasoning.

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

- `ready`: every blocker is satisfied and every declared revision is current. A dependency is satisfied only by the exact current upstream Handoff/artifact plus any proof or approval that the Task Contract declares; a planning Handoff requires backend contract validation rather than implementation verification unless its contract explicitly says otherwise. Terminal predecessor completion is required only when the Task Contract declares it.
- `running`: exactly one owner and one attempt holds the task.
- `handed-off`: one bounded result plus implementer smoke and a complete Handoff.
- `verified`: fresh criterion-level proof against the exact target.
- `integration-pending`: every required lineage is verified and the integration contract is current.
- `integrated`: exact lineages were neutrally combined, integrated smoke passed, and the new target identity exists.
- `reviewed`: final Standards and Specification review passed on the exact verified single-lineage or post-integration target.
- `complete`: terminal curation and evidence accounting pass with no required nonterminal, stale, failed, unverified, unintegrated, or unreviewed work.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`.

Outcome mapping is exact: worker `completed` with evidence → `handed-off`; `blocked|transport-unavailable|authority-change-required` → `blocked`; `failed|timed-out` → `failed`; `cancelled` → `cancelled`. Verifier `NOT VERIFIED` moves its target `handed-off → failed` while the verifier emits a completed failing Handoff; verifier `INCONCLUSIVE` leaves the target unverified and blocks consumption. Semantic integration conflict blocks the integration task while verified inputs remain historical, insufficient lineages. No role repairs inside verification, integration, or review; an authorized repair always uses a new task revision.

Review and curation mappings are exact. Review `APPROVED` moves the exact current `verified` or `integrated` target to `reviewed`; `CHANGES REQUIRED` leaves the review attempt completed but moves the target to `failed`, and any repair requires a newly authorized implementation revision; `INCONCLUSIVE` preserves the current target identity but blocks completion pending named evidence. Curation `CURATED` and `NO DURABLE LEARNING` satisfy the curation gate; `BLOCKED` preserves `reviewed` and blocks completion. Only the backend records these transitions. Reviewer and curator never repair, retry, mutate the target, or grant authority.
State traces always begin with run `accepted` before any task becomes `ready`. The backend owns `accepted`, `ready`, `blocked`, `failed`, `cancelled`, and terminal accounting transitions; the worker owns running attempt evidence and its Handoff, while verifier, integrator, reviewer, and curator own only their bounded evidence. A worker failure is evidence consumed by a backend-owned `failed` transition. Curation is a completion gate, not a new task or run state.

`blocked → ready` requires blocker-resolution evidence plus current authority/input revisions. `failed → ready` requires explicit backend retry authorization. Renewed cancelled work uses a new task revision.

## Execute the ready frontier

1. Snapshot accepted authority, task graph, capabilities, target identities, and human gates.
2. Mark only dependency-satisfied tasks ready. Never dispatch a descendant from partial, stale, diagnostic-only, failed, timed-out, cancelled, or interrupted output.
3. Dispatch one ready owner per Task Contract and minimal Context Pack. Workers do not delegate or alter shared contracts.
4. Require implementer smoke on the exact produced revision before accepting the worker Handoff. Bugs rerun the original red-capable reproduction; performance uses like-for-like baseline/treatment; user-visible changes exercise the available user-facing surface. Record scenario, environment, fixtures, expected/observed result, artifact reference, rerun status, failure, and uncertainty.
5. Send every changed observable or consequential target to fresh `dev-verification`. A valid deterministic nonbehavioral skip records reason, revision, and identity proof.
6. When multiple lineages exist, send only exact verified inputs to `dev-integration`, then require fresh post-integration verification of the combined identity.
7. Send the exact verified target to read-only `dev-code-review`. Findings create owner-authorized repair work and renewed proof; review never repairs.
8. Run one terminal `dev-continual-learning` assessment. `CURATED` or `NO DURABLE LEARNING` satisfies the gate; `BLOCKED` prevents workflow completion until resolved or human scope changes.
9. Account for every task and criterion, then return terminal evidence to `dev-ask`.

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
- terminal curation outcome `CURATED` or `NO DURABLE LEARNING`;
- no blocker, stale/partial result, semantic conflict, failed dependency, or required check; and
- proof no required work remains nonterminal.

Return an evidence index naming every governing/task revision, worker result and smoke, verification proof and verdict, integration lineage and evidence, review outcome, curation outcome, advisories, deferred authority, residual risk, and terminal accounting.

## Stop and next owner

Stop for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe partial effects, or an evidence-backed blocker. Re-enter `dev-ask` for material route escalation or completion presentation; return authority defects to their canonical owner. Never infer completion from a worker Handoff.
