Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 02, 04
Status: resolved

## Question

What portable execution state machine and evidence gates should the separate implementation backend use to choose among one-agent execution, a small independent local batch, and full orchestration, then coordinate implementation, debugging, verification, integration, and review without embedding any host's tools, model IDs, branch commands, or waiting primitives?

## Answer

The implementation backend accepts only executable authority: an approved direct contract or approved implementation tickets bound to their governing PRD/engineering specification when those artifacts exist. It does not discover product intent, rewrite specifications, or invent acceptance criteria.

### Intake gate

Before mode selection, validate:

- authoritative artifact identities/revisions or digests are readable and current;
- every task has bounded scope, observable acceptance, and a concrete verification recipe;
- blockers form an acyclic graph and all external prerequisites are named;
- shared interfaces and ownership boundaries are settled;
- required product, architecture, destructive, migration, or scope approvals exist;
- the host exposes the minimum capabilities needed by the candidate mode.

Missing or conflicting authority returns to its owning lifecycle stage. The backend never repairs an invalid specification/ticket graph in place.

### Mode selection

Choose by dependency topology, coordination, and recovery needs—not raw task count.

**One owner — default**

Use when one cohesive owner can complete the executable scope in one fresh context, especially when files, interfaces, or reasoning are coupled. Lack of genuine independent slices is a reason to remain single-owner, not to invent parallel work.

**Small local batch**

Use for a few ready, genuinely independent slices with settled interfaces, separate ownership, concrete acceptance, low path/state contention, and one coordinating context capable of observing the run through one or two bounded waves. Use the host's safe isolation mechanism when concurrent writes require it; otherwise sequential execution with the same task/handoff boundaries is a valid adapter fallback.

**Full orchestration**

Use when the approved graph requires recursive decomposition explicitly delegated by a task, many dependency waves, long-running isolated work, durable recovery across contexts, persistent operator-visible state, or neutral integration across multiple branches. The graph and contracts must already be stable enough to dispatch.

If the approved route names a more expensive mode than needed, the backend may downgrade to a simpler mode when every contract remains satisfied; disclose the downgrade in the execution baton. Escalation from one owner to a batch, or from a batch to full orchestration, is a material route change: return to the router for a revised overview and human approval before dispatch.

### Task authority

- Project approved direct work or tickets into executable tasks; do not redesign them.
- Operational subdivision is legal only when the approved task explicitly delegates decomposition and every child preserves its parent authority, scope envelope, acceptance, and verification. A subplanner owns that bounded slice but does not code.
- Any proposed change to product/architecture intent, shared interface, scope, acceptance, blocker semantics, or destructive authority returns to specification/ticket ownership and human approval.
- Dependencies carry both readiness and required upstream handoff context. A downstream task receives only declared authoritative handoffs/artifacts, not ambient sibling state.
- Prefer fewer broad, coherent tasks. Do not create workers merely to maximize concurrency.

### Proportional execution state

Do not create one universal state file.

- **One owner:** governing contract plus final baton; no backend manifest.
- **Small batch:** record the task projection, owners, dependency readiness, attempts, and handoff locations in the coordinating context or host adapter's recoverable job state. Persist a repository artifact only when the run must survive that context.
- **Full orchestration:** persist a provider-neutral logical task graph and runtime state sufficient to restart from canonical artifacts and handoffs. The adapter owns physical storage, branch/run IDs, process handles, and provider metadata.

Backend state is a derivative execution projection. It references but never copies or supersedes PRD/spec/ticket authority.

### Portable state machine

Each executable task uses:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated
verified|integrated → reviewed → complete
pending|ready|running|handed-off|verified|integration-pending|integrated|reviewed
  → blocked|failed|cancelled
```

Transitions:

- `pending → ready` only when every blocker is `complete` and required handoff/artifact revisions are available.
- `ready → running` assigns exactly one implementation owner and one attempt.
- `running → handed-off` requires a bounded result plus implementer smoke evidence; incomplete or silently terminated work is a failure handoff, not success.
- `handed-off → verified` requires independent criterion-level evidence. A verifier cannot repair its target.
- Multiple isolated outputs enter `integration-pending`; a named neutral integrator produces the combined result and integrated smoke evidence before `integrated`.
- A single-owner result may proceed from `verified` directly to final review.
- `verified|integrated → reviewed` requires the final Standards and governing-authority review to pass or return findings to the owning implementation stage.
- `reviewed → complete` requires terminal accounting for every approved task, no unresolved integration output, and all required evidence/artifact status.
- `blocked` and `failed` never satisfy dependencies. Retry creates a new attempt under the same authority; it never rewrites history. Exact retry, prune, cancel, and escalation rules belong to the failure-policy ticket.

The run projects task state:

```text
accepted → ready → running → verifying → integrating? → reviewing → complete
                    ↘ blocked|failed|cancelled
```

`integrating` is omitted only when there is one output lineage. A run cannot enter `complete` while any required task is nonterminal, failed, blocked, unverified, unintegrated, or unreviewed.

### Dispatch loop

1. Validate authority and create the proportional execution projection.
2. Select a mode and obtain revised route approval if escalation is required.
3. Dispatch only the current ready frontier; never start blocked dependents.
4. Collect one structured handoff per task/attempt.
5. Dispatch independent verification against the produced result and original acceptance.
6. Integrate named output lineages when required, then exercise the integrated behavior.
7. Run final Standards and governing-authority review.
8. Return terminal evidence and artifact/task status to the router; the router presents completion.

Mechanical scheduling, waiting, process/job observation, branch creation, and state persistence belong to adapters. Semantic decisions remain with the backend/planner and human gates.

### Debugging and repair

An implementation owner may use the portable diagnosis discipline for an unexpected in-scope failure after establishing a tight feedback loop. It may repair only its bounded task.

A failure that disproves a shared interface/assumption stops dependent dispatch and returns to the owning specification/ticket stage. Verifiers report failure; integrators resolve only conflicts permitted by their explicit conflict authority. Neither silently redesigns or repairs upstream contracts.

### Capability and model boundary

The backend expresses capability/risk needs—planning depth, implementation complexity, verification independence, context freshness, isolation, duration, and cost sensitivity. A harness adapter selects concrete agents/models/tools and records them as execution metadata.

No shared skill contains provider names, model IDs, spawn syntax, wait primitives, branch commands, or host state paths. If a host lacks parallel execution, run independent tasks sequentially with identical contracts. If it lacks required durability/isolation/verification semantics and no equivalent exists, stop rather than label a weaker run full orchestration.

### Completion boundary

The backend may return `complete` only with:

- authoritative input revisions;
- terminal accounting for every executable task;
- implementation and smoke evidence;
- independent verification evidence;
- integration evidence when applicable;
- final review outcome;
- real residual risks and any intentionally deferred authority.

It never owns the final user-facing route, product/spec approval, or user-level `AGENTS.md`.
