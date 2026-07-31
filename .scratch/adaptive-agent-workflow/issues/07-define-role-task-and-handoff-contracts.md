Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 06
Status: resolved

## Question

What harness-neutral contracts must govern planner or subplanner, bounded worker, independent verifier, and neutral integrator roles; executable task records; dependency-carried context; worker and verifier handoffs; conflict policy; and completion evidence? Preserve the settled boundaries that planners do not code, workers do not redesign shared contracts, verifiers do not repair their targets, and integration is a named task.

## Answer

The portable orchestration seam has two small interfaces:

```text
backend → Task Contract + Context Pack → role
role → Handoff → backend
```

The backend owns scheduling, runtime state, and delivery. Roles own only the semantic work described by their task. Adapters translate the two interfaces into host-native prompts, jobs, branches, worktrees, messages, or state without changing their meaning.

### Planner and subplanner

A separate planner exists only when coordination or decomposition earns it.

- Direct one-owner work has no separate planner.
- A small batch gets a non-coding coordinator/planner only when readiness, ownership, or fan-in must be designed.
- Full orchestration gets one root planner. A subplanner exists only when an approved task explicitly delegates decomposition.
- A planner reads the authoritative PRD/specification/tickets and produces or revises the executable task graph. It does not implement, modify implementation targets, verify its own graph as complete, or make product/architecture/scope/destructive decisions.
- A subplanner may decompose only its approved envelope. Its children must preserve the parent authority, collectively cover its acceptance, stay within its ownership and risk limits, and point back to the parent. It cannot implement any child.
- Planners prefer the fewest coherent tasks, expose real dependencies, and avoid workers created only for concurrency.

The backend itself performs mechanical coordination—state transitions, ready-frontier calculation, dispatch, collection, and routing. That is not a fifth semantic role.

### Bounded worker

A worker receives one immutable task revision and one bounded context pack.

- It owns implementation and implementer smoke proof for that task.
- It may diagnose and repair unexpected failures only inside the task's approved behavior and ownership.
- It may choose local implementation details that do not alter shared interfaces, acceptance, architecture, product intent, scope, or destructive authority.
- It does not redesign its task, renegotiate dependencies with siblings, modify canonical PRD/spec/tickets, declare independent verification, integrate sibling output, or mark the run complete.
- If the work must split or cross its authority, it returns a split/change request to the backend. It cannot delegate. Only the backend/planner may issue revised executable authority; an explicitly designated subplanner may then decompose it.
- It stops rather than hiding a partial implementation behind a successful handoff.

### Independent verifier

The verifier is a separate role and attempt in a fresh context, read-only with respect to the target under verification.

- It receives the governing acceptance, verification recipe, exact target revision, relevant upstream handoffs, and only the implementation summary needed to locate the result—not the worker's reasoning transcript or claimed conclusion as authority.
- It checks observable behavior criterion by criterion, including plausible failure paths and the requested smoke scenario where applicable.
- It records observed evidence and a verdict; it does not edit, repair, reformat, stage, merge, or otherwise mutate the target.
- A failure returns to the backend and implementation owner. The verifier may narrow a reproduction or identify the likely owning contract, but cannot turn that diagnosis into a repair.
- A different model or provider may strengthen verification and may be selected by an adapter, but it is not a portable requirement. Fresh context, separate role/attempt, target immutability, and evidence independence are required.

The exact verifier verdict vocabulary and evidence thresholds belong to the verification-policy ticket.

### Neutral integrator

Integration is an explicit executable task with a named neutral owner. It is required only when multiple isolated output lineages must become one.

- It accepts only the exact verified input revisions named by its task.
- It may perform mechanical combination work whose intended semantics are unambiguous: imports, formatting, generated lock/state updates, and nonsemantic merge conflict resolution.
- It may not add missing behavior, repair a failed worker, redesign an interface, choose between conflicting product/architecture intents, or silently drop one lineage.
- A semantic conflict, unverified input, stale input revision, or missing implementation returns to the backend/planner or governing artifact owner.
- It produces the combined revision and integrated smoke evidence. The combined result then receives the independent checks and final review required by the verification policy.

### Task Contract

Each executable task is a structured Markdown record with fixed semantic fields. Adapters may project it into JSON or native job state, but may not omit or reinterpret fields.

```markdown
# <human-readable task name>

## Authority
- Governing artifacts and exact revisions/digests
- Parent task when decomposed
- Required human approvals

## Objective
<one observable bounded outcome>

## Role
<planner | subplanner | worker | verifier | integrator>

## Ownership
- May read
- May change or produce
- Must not change
- Shared interfaces or state that remain fixed

## Dependencies
- Blocking task names
- Exact upstream handoffs/artifact revisions required

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

Rules:

- A task name is its human-readable identity within the graph; adapter IDs are metadata.
- Authority is referenced, not copied. The governing artifact remains canonical.
- Ownership describes behavioral/state authority as well as file paths. Path disjointness alone does not prove independence.
- Acceptance says what must be observable; verification says how it will be established. Neither may be invented by the worker or verifier.
- The task's semantic fields are immutable for an attempt. A material correction creates a new task revision and invalidates downstream readiness derived from the old revision.
- Runtime state, concrete owner/model, job/process/branch IDs, timestamps, and attempt counters are adapter/backend state, not portable task semantics.

### Context Pack

The backend assembles a minimal, revision-bound context pack for each attempt:

1. the exact Task Contract revision;
2. governing artifact links/revisions;
3. dependency handoffs explicitly named by the task;
4. bounded repository or environment context needed to act;
5. applicable project rules and safety constraints;
6. the receiver and expected Handoff contract.

Do not pass ambient sibling state, full orchestration transcripts, speculative notes, or stale summaries. At dispatch, the role verifies that named authority and inputs still match their expected revisions. Staleness returns to the backend.

### Dependency-carried context

- Semantic information moves only through canonical artifacts and declared dependency handoffs.
- Sibling workers do not privately renegotiate interfaces, scope, acceptance, or ownership.
- A worker may send an operational alert to the backend—collision, blocker, stale input, safety concern—but the alert does not become semantic authority.
- Fan-out consumers receive the same named upstream handoff revision.
- Fan-in tasks receive every required handoff explicitly; arrival order never defines precedence.
- If an upstream handoff disproves a shared assumption, the backend stops affected descendants and routes the issue to the owning artifact/stage.

This preserves inspectability and deterministic recovery while leaving adapters free to use host-native communication for delivery and operational coordination.

### Handoff

The canonical handoff is compact structured Markdown. It is the durable semantic authority for an attempt when durability is required; adapters may also project it into machine state.

```markdown
# Handoff: <task name>

## Outcome
- Task revision
- Attempt
- Outcome class
- Exact produced/inspected revision

## Authority checked
- Governing and dependency revisions actually used
- Any stale, missing, or conflicting authority

## Result
- Observable result
- Artifacts changed, produced, or inspected
- Behavioral/contract effects

## Evidence
- Criterion → exact check/scenario → observed result
- Evidence/log/artifact references

## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved

## Risks and unresolved items
- Blockers, failures, residual risks, or required authority changes

## Next receiver
- Role/task that may consume this handoff
- Preconditions still required
```

Common handoff rules:

- Report observed facts, not completion claims without evidence.
- Name exact revisions so stale output cannot be mistaken for current output.
- Prefer concise evidence references over pasted raw logs, while preserving enough output to establish the claim.
- Do not duplicate canonical decisions; link the governing revision.
- An incomplete, blocked, failed, or authority-changing attempt must still produce a handoff with its real outcome.
- A handoff cannot expand the receiver's authority.

Role-specific payloads:

- **Planner/subplanner:** graph or child task revisions, acceptance-coverage/accounting, dependency rationale, decision gates, and unresolved authority.
- **Worker:** changed artifacts, observable effect, implementer smoke scenario and result, bounded implementation decisions, residual risk, and requested split/change if any.
- **Verifier:** exact target revision, per-criterion observations, expected versus actual behavior, environment/fixtures, reproducible failure details, and verdict.
- **Integrator:** every input revision, conflicts encountered, each permitted mechanical resolution, combined revision, integrated smoke result, and any semantic conflict returned.

Exact failure/retry outcome classes belong to the failure-policy ticket; exact verifier verdict terms belong to the verification-policy ticket. Their future vocabularies must fit these fields without changing the interface.

### Conflict and precedence policy

1. Current explicit human decisions and safety constraints.
2. Current governing PRD/specification/ticket revision according to its authority.
3. Current project rules and repository state.
4. Declared dependency handoffs.
5. Task-local implementation choices.
6. Adapter metadata or incidental worker observations.

Conflicts follow ownership, not arrival time or last writer:

- Product, architecture, scope, destructive, or acceptance conflicts return to the human/governing artifact owner.
- Shared-interface or dependency conflicts return to the planner/specification owner; affected dispatch stops.
- Worker ownership overlap returns to the backend for re-planning unless an explicit integration task already defines safe combination.
- The integrator may resolve only mechanical conflicts with one unambiguous semantics-preserving result.
- Unexpected repository changes are preserved as external work, not overwritten or attributed to another worker.
- No direct peer agreement can override a canonical artifact or Task Contract.

### Completion evidence

No role alone declares the whole run complete. The backend assembles a terminal evidence index containing:

- governing input revisions and approvals;
- every approved task revision and terminal outcome;
- every worker result and implementer smoke proof;
- independent verifier evidence for each acceptance criterion;
- integration inputs, resolutions, combined revision, and integrated proof when applicable;
- final Standards/governing-authority review;
- unresolved risks and explicitly deferred authority;
- proof that no required task remains pending, blocked, failed, stale, unverified, unintegrated, or unreviewed.

The router may present completion only from that evidence-backed terminal state. Planner output is not implementation, worker smoke proof is not independent verification, a clean textual merge is not integrated behavior, and a verifier verdict is not final user-facing completion.
