Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 07, 08
Status: resolved

## Question

What exact portable state transitions and evidence rules apply when a shared assumption breaks, a worker blocks or fails, verification fails, integration conflicts, execution times out, or an external account or capability is unavailable? Decide retry ownership and limits, when dependent dispatch stops, when stronger reasoning or a fresh context is warranted, when a human decision is mandatory, and what the durable handoff must contain.

## Answer

Failure handling is evidence-driven and append-only. A retry is a new attempt under the same current Task Contract revision, never a rewrite of the failed attempt and never permission to change authority.

### Task state versus attempt outcome

The settled task states remain:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated
verified|integrated → reviewed → complete
active state → blocked|failed|cancelled
```

An attempt records one exact outcome:

```text
completed
blocked
failed
timed-out
cancelled
transport-unavailable
authority-change-required
```

Mapping:

- `completed` with required implementer evidence moves a worker task to `handed-off`; it is not yet verified.
- `blocked`, `transport-unavailable`, or `authority-change-required` moves the task to `blocked`.
- `failed` or `timed-out` moves the task to `failed`.
- `cancelled` moves the task to `cancelled`.
- A verifier's observed nonconformance moves the target from `handed-off` to `failed`; the verifier itself returns a completed verification handoff containing a failing verdict.
- A semantic integration conflict moves the integration task to `blocked`; individually verified inputs remain historical verified lineages but cannot satisfy the combined result.

`blocked → ready` requires evidence that the named blocker is resolved and all authority/input revisions are still current. `failed → ready` requires an explicit backend retry authorization under this policy. `cancelled` does not reopen; renewed work needs a new task revision. A `complete` result invalidated by changed upstream authority remains historical evidence, while a replacement task revision starts at `pending`.

### What counts as an attempt

A semantic attempt begins when the role receives the Task Contract and starts reasoning or work that can produce task output. Once target mutation or external effects may have begun, the attempt always counts.

A provider spawn failure, rate limit, dropped connection, or unavailable tool that occurs before semantic work begins is an adapter transport attempt, not a semantic task attempt. The adapter records it separately.

A verification failure does not consume a separate implementation attempt by itself; it establishes that the current implementation attempt failed acceptance. Any repair is the next implementation attempt.

### Failure classification before retry

Before authorizing any retry, classify the established cause:

1. **Local implementation defect** — authority and interfaces remain valid; worker output violates acceptance.
2. **Context/process defect** — fixation, contaminated/stale context, missing dependency handoff, or insufficient reasoning/tool capability.
3. **Shared-assumption defect** — an interface, dependency, repository invariant, or execution premise is false.
4. **Authority defect** — product intent, architecture, scope, acceptance, destructive authority, or governing artifact is missing/conflicting.
5. **Integration conflict** — independently valid lineages cannot be combined mechanically without a semantic choice.
6. **External blocker** — credential/account action, service availability, permission, hardware/environment, manual prerequisite, or hard host capability is absent.
7. **Transport failure** — no semantic role execution occurred because the adapter/provider/tool transport failed.
8. **Timeout/stall** — a declared deadline or progress condition expired after execution began.

Do not retry an unclassified failure. Every retry must name the evidence, the falsifiable next hypothesis, and what will differ. Repeating the same prompt/context/approach without a new reason is not a retry strategy.

### Semantic retry ladder

Maximum: three semantic attempts for one unchanged Task Contract revision.

```text
attempt 1: initial bounded implementation
attempt 2: optional same-owner repair
final attempt: fresh-context implementation, optionally stronger
```

Rules:

- The same owner receives attempt 2 only when it has already established a tight task-specific red/green feedback loop, reproduced the exact failure, confirmed authority remains current, and its context shows no fixation or contamination.
- The feedback loop must be fast, deterministic or deliberately high-reproduction for a flaky failure, runnable without hidden human steps, and capable of detecting the exact symptom.
- If that gate is not met, skip the same-owner repair and proceed directly to the final fresh-context attempt. The unused repair slot is not converted into another automatic fresh retry.
- The final attempt receives a fresh Context Pack plus the concise failure handoff and observed evidence—not the prior reasoning transcript. It must independently re-establish the feedback loop and inspect the current target revision.
- Use a stronger reasoning/capability profile only when evidence indicates the prior binding was insufficient: system-wide reasoning, unfamiliar domain depth, context saturation/fixation, or repeated failure despite a valid tight loop. Model escalation is adapter-owned metadata, not a provider/model name in shared behavior.
- Do not escalate reasoning for a missing account, stale authority, unsafe partial effect, or absent prerequisite; stronger inference cannot manufacture facts or permission.
- Three attempts are a ceiling, not an entitlement. Stop earlier when safety, authority, idempotence, or the absence of a plausible changed approach makes retry unjustified.
- Retry exhaustion leaves the task `failed` and requires human/planner escalation. The backend presents evidence and options; it cannot silently widen scope, weaken acceptance, split authority, or declare the task complete.

An operational split that remains inside already delegated decomposition authority may return to the planner. A split that changes the approved route/mode, scope, shared interfaces, or acceptance requires revised artifacts and the applicable human route approval.

### Transport retry allowance

Adapters may make at most two short transport retries in addition to the semantic attempt budget when:

- no semantic role work or target/external mutation occurred;
- the operation is safe and idempotent to replay;
- the failure is plausibly transient;
- each transport attempt and observed error is recorded.

Backoff mechanics are adapter-owned. After two retries, classify the transport/capability unavailable and block or safely reroute the task. Do not hide repeated provider failure, rotate providers/accounts without configured authority, or retry indefinitely.

### Dependency quarantine

When an upstream task fails or a shared assumption breaks:

1. mark the source task `failed` or `blocked` with the classified cause;
2. stop dispatch of its transitive dependency cone;
3. attempt safe cancellation of already-running affected descendants;
4. mark output produced against invalid authority/context as stale and non-consumable;
5. preserve every attempt and partial artifact as historical/diagnostic evidence;
6. return the conflict to the governing task/artifact owner;
7. create revised tasks only after authority and dependencies are current again.

Independent branches may continue only when their authority, inputs, safety, output ownership, and eventual integration target are demonstrably unaffected. Integration waits for every required valid lineage. The backend records the quarantine set; arrival order or partial completion does not restore readiness.

### Shared assumption or authority break

A worker, verifier, or integrator that disproves a shared assumption returns `authority-change-required` when resolving it would alter:

- product intent or success criteria;
- architecture or shared interfaces;
- scope or acceptance;
- destructive/migration authority;
- dependency meaning;
- canonical project rules.

It must not patch around the contradiction. Affected tasks remain blocked until the owning PRD/specification/ticket/rule is explicitly revised, approved when required, and rebound to new task revisions. Prior output may be inspected as evidence but cannot be integrated by default.

### Worker failure

For an in-scope local implementation defect:

1. capture the exact symptom and target revision;
2. build or tighten the red/green feedback loop;
3. minimise the reproduction when useful;
4. record ranked falsifiable hypotheses and probes;
5. authorize the next retry only under the retry ladder;
6. rerun the original smoke scenario after a repair.

A worker may diagnose and repair only within its Task Contract. It requests a split/change rather than self-delegating or redefining shared authority.

### Verification failure

The verifier:

- records the exact target revision and failing acceptance criterion;
- shows expected versus observed behavior and a reproducible check;
- distinguishes product/specification ambiguity from implementation nonconformance;
- returns evidence without editing the target.

An implementation nonconformance enters the retry ladder. An invalid test/criterion, ambiguous expected behavior, or newly exposed authority conflict blocks the task and returns to the governing owner instead. Every repaired output receives a new revision and fresh independent verification; a prior passing criterion may be reused only when the verification policy proves it cannot have been affected.

### Integration conflict

The neutral integrator may resolve only unambiguous mechanical conflicts already authorized by its task.

- Mechanical conflict resolved safely: record the resolution and continue integrated smoke/verification.
- Semantic interface, behavior, ordering, data, or authority choice: return `authority-change-required` or `blocked`.
- Missing/failed implementation: return to the owning worker task; the integrator cannot repair it.
- Stale or unverified input: reject it and quarantine dependent integration.

No retry may turn a semantic conflict into a mechanical one by silently choosing a winner or dropping a lineage.

### Timeout and stalled execution

The Task Contract or adapter metadata supplies the declared deadline/progress policy; the portable workflow does not hard-code provider wall-clock values.

On timeout:

1. request safe cancellation when supported;
2. capture last heartbeat/progress, exact base/current revisions, running operations, partial target mutations, and external effects;
3. mark the attempt `timed-out`;
4. classify the task as retryable `failed`, externally `blocked`, or human-review-required;
5. retry/resume only when idempotence, ownership, and partial-effect safety are established.

Ambiguous mutations, non-idempotent external effects, irreversible operations, or inability to confirm process termination require human review. Never restart blindly or treat elapsed time as proof that no work occurred.

### Partial output

Partial, failed, timed-out, cancelled, stale, or transport-interrupted output is diagnostic only:

- it cannot satisfy dependencies, receive a passing verification verdict, or enter integration;
- it is preserved when deleting it could lose user work or diagnostic evidence;
- it carries its exact revision and failure provenance;
- a planner may explicitly authorize salvage into a new attempt only after checking ownership, completeness, safety, and current authority.

Salvage creates a new output revision and still requires full acceptance and verification. Never label “mostly complete” as a successful handoff.

### External account or capability unavailable

Classify the task `blocked` when safe contract-equivalent fallback is unavailable.

The handoff names:

- the exact missing capability/account/permission;
- the live check that established absence;
- non-secret configuration or credential location expected;
- any safe equivalent or route downgrade tried;
- the smallest human/manual prerequisite;
- which branches may continue;
- the condition that will make the task ready again.

Agents do not fund accounts, authenticate external CLIs, expose secrets, weaken hard invariants, or invent evidence. A human may supply the prerequisite, choose a contract-equivalent adapter, revise the route/artifact, or cancel; they cannot make a weaker result compliant merely by relabeling it.

### Mandatory human decisions

Human approval or intervention is required for:

- product, architecture, scope, acceptance, destructive, migration, or safety authority changes;
- material route/mode escalation;
- retry exhaustion;
- semantic integration conflicts;
- ambiguous, irreversible, or non-idempotent partial effects;
- credentials, account funding/authentication, or manual external prerequisites;
- cancellation or abandonment of required work;
- accepting a revised governing artifact and rebinding descendants;
- any proposal whose only path would weaken a hard adapter/workflow invariant.

The backend may recommend one bounded option and alternatives. It does not stand in for the decision owner.

### Durable failure handoff

Every non-success outcome writes the common Handoff contract plus:

```markdown
## Failure classification
- Attempt outcome and cause class
- Task state before and after
- Semantic attempt number / maximum
- Adapter transport retries

## Exact state
- Task Contract and governing revisions
- Base, target, partial, and produced revisions
- Last confirmed heartbeat/progress
- Running or uncertain external effects

## Feedback evidence
- Exact symptom
- Red/green command or scenario and observed output
- Reproduction rate/determinism
- Hypotheses and probes already tried

## Safety and reuse
- Idempotence/replay assessment
- Partial-output authority: diagnostic only
- Preservation/cleanup requirements
- Stale or invalidated artifacts

## Dependency impact
- Quarantined descendants
- Independent branches allowed to continue
- Integration consequences

## Next decision
- Retry eligibility and changed approach
- Same-context versus fresh-context rationale
- Stronger capability rationale, if any
- Required planner/human/manual action
- Exact ready/resume condition
```

Do not paste secrets or entire reasoning transcripts. The handoff must let a fresh owner reproduce the failure, avoid repeated dead ends, preserve user work, determine safe retry eligibility, and resume from current authority without trusting unsupported claims.
