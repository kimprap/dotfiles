# acpx controller for Retrace and Reconcile

**Status:** ACTIVE  
**Date:** 2026-09-18  
**Decision IDs:** D31

## Scope

This record governs the persistent actor sessions used only by the named Retrace and Reconcile custom controllers, owned by one Node controller at `.config/agents/harnesses/omp/acp-controller/`. It does not change generic engineering routing, implementation-child collection, assurance, shipping, model/account authority, or producer report grammar.

## Context

Retrace and Reconcile require stable child identities across multiple semantic turns, owner-only reply visibility, durable pending-state inspection, bounded direct capacity, partial sibling accounting, and cleanup proven by observed process exit. Projecting those guarantees onto launch jobs, roster addressability, caller-owned observation windows, local echoes, or `details.waited` made transport mechanics look like semantic authority and could not prove exact disposal.

The controller replaces the earlier in-session OMP extension. The root OMP session runs the skill through the OMP driver, which preflights, obtains approval, and invokes the controller. The controller owns every reviewer, normalizer and scope-evaluator session through public acpx `createSharedAcpRuntime` and native `omp acp`, pins its toolchain versions before any launch, and adds no custom transport, supervisor, mailbox, private acpx import, or generic workflow policy.

## Decision

### D31 — Use one coded acpx controller while the executable skills retain semantic authority

1. The controller alone owns reviewer, normalizer and scope-evaluator sessions through public acpx and native `omp acp`. Only the admitted, domain-valid native `yield` candidate is a reply; prose, failed or unfinished yields, launch completion and turn results never count and are never a fallback.
2. The first admitted reply is kept and is visible only to its owning parent. Ancestors receive identities, states, turn/reuse results and cleanup blockers, never another actor's reply body.
3. Reply, turn result and reuse state stay separate; a failed turn does not discard an admitted reply, and a reply does not imply reuse.
4. A request stays pending until a reply, a concrete terminal failure or an explicit abort. Uncertain delivery is observed without replay; elapsed time creates no caller-owned timer, polling loop, semantic retry, replacement actor, or additional re-ask. The invoking command's deadline-free wait for its run worker's record or observed exit (item 9) is permitted observation: time passing never ends it, fails it, retries, replaces or signals. It is not the only permitted observation over time; the bounded post-close ESRCH observation, the uncertain-delivery observation and the worker's folder notification and step-boundary read of a stop request remain permitted. No timer or poll may end, fail, retry, replace or signal a pending reviewer request, and no poll may manufacture completion.
5. Retrace runs at most four direct actors at once; a permit frees only on observed disposal. A reply, turn completion, abort acknowledgment, signal request, or matching identity does not release capacity. A failed member keeps its successful siblings.
6. Disposal counts only on observed process exit, children before parents, and a failed disposal blocks success. Reconcile disposes its reviewers before its final proposal; a delegated Retrace scope disposes its reviewers before publishing `scope-result`, and its parent then disposes the scope actor.
7. The Retrace and Reconcile skills and the Reconcile reviewer protocol remain the semantic owners of approval, report grammar, re-ask budgets, reviewer identity, verdicts, continuation, stops, aggregation, and proof interpretation. The controller has no fallback reply channel: it uses no task, hub, Eval, transcript, lookup, replay, resend, replacement, or generic collector.
8. The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts.
9. Each `reconcile`, `resume`, `retrace` and `normalize` run executes in one detached worker that owns its sessions, its run claim and its spend so far. The invoking command keeps the preflight, then only waits for that worker's record or observed exit, with no deadline; it is not a caller timer or a supervisor. A request attaches to the run that holds its identity (the request's meaning without its approval), and a different request for the same target is refused while that run is live, parked or finished. A deliberate stop is an explicit abort under item 4, requested through the run folder; the worker observes that request through a folder notification or at a step boundary, and no process is signalled.

## Consequences

- Retrace and Reconcile share one coded controller over public acpx and native `omp acp`, and keep separate executable semantic contracts.
- Stable actor, request, owner, first-reply, turn/reuse, pending, abort, and observed-exit disposal states are explicit and cannot be inferred from unrelated host surfaces.
- Partial batches and failed cleanup retain exact evidence instead of collapsing into a false all-or-nothing result.
- The controller pins exact omp, acpx and ACP SDK versions in `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs`; a different version is refused before any launch until the offline suite, the hand-off kill check and the live runs the bump-omp skill selects pass on it.
- The previously pending Tier 1 recorder plan remains closed as historical planning.
- The eval catalogs are specification fixtures. Their presence is not a claim that the full catalogs were executed; any native or model-backed execution remains separately gated.

## Rejected alternatives

- **Launch jobs plus roster binding:** rejected because stable ownership, first-reply authority, reuse, and exact disposal remain conflated.
- **Caller-owned timers or external supervisors:** rejected because elapsed time is not semantic failure and callers must not poll or manufacture completion. The invoking command's deadline-free wait for its run worker (D31 item 9) is permitted observation, not such a timer or supervisor: time passing never ends it, fails it, retries, replaces or signals. This does not make it the only permitted observation; the bounded post-close ESRCH observation, the uncertain-delivery observation and the worker's stop-request notification and step-boundary read stay permitted, and no timer or poll may end, fail, retry, replace or signal a pending reviewer request.
- **Generic collection fallback:** rejected because these custom controllers have stricter owner visibility, capacity, and disposal semantics.
- **Recorder-only corroboration:** rejected because passive records do not provide the active persistent-actor lifecycle boundary.
- **Proof-export API:** rejected because export is not a lifecycle concern; prebound owners can copy retained returned results without widening the controller interface.
- **A controller run that depends on a tool parameter,** such as stronger wording or switching to Eval with `timeout: 0`: rejected because a missed parameter still loses the run.
- **A dedicated OMP custom tool:** rejected because it runs inside the OMP session, so ending the session still aborts the run, and this record already moved away from an in-session extension.
- **Parking the run on SIGTERM or SIGHUP:** rejected because after the detach the caller's signals never reach the worker, parking mid-turn would resend a request (item 4), and SIGKILL cannot be handled.
- **A separate `attach <runId>` command:** rejected because a killed call may never have shown the runId; rerunning the same command attaches.
- **Keeping a finished run's record until `dispose`:** rejected because every finished run would need a manual cleanup.
- **Exact-byte request identity with a rule never to rebuild the request:** rejected because recovery would again depend on the agent following a rule, and a rebuilt request would start a second paid run.
- **Identity by meaning without the same-target refusal:** rejected because a rebuild that changes one word would still start a second run on the same candidate.
- **Only the live proof to catch an OMP kill-scope change:** rejected because nothing would notice a change between proofs.
- **Running the bump kill check through the bump agent's own `bash`:** rejected because that session still runs the old OMP.
- **A claim index in the resume identity:** rejected because rerunning a killed resume call after the run parked again would resume a second time and spend twice.
- **Removing a parked run's record after printing:** rejected because it needed special exit-2 handling; the record stays until a resume that starts or `dispose`.

## Affected contracts

- `.config/agents/harnesses/omp/acp-controller/`
- `.config/agents/harnesses/omp/acp-controller/driver.md`
- `.config/agents/skills/bump-omp/SKILL.md`
- `.config/agents/harnesses/omp/agent-return.md`
- `.config/agents/references/agent-return/return.md`
- `.config/agents/skills/retrace/SKILL.md`
- `.config/agents/skills/reconcile/SKILL.md`
- `.config/agents/skills/reconcile/references/reviewer-protocol.md`
- the Retrace and Reconcile eval catalogs

## Authority and evidence

Approved by the owner on 2026-09-18, 2026-09-27 and 2026-10-02; history in git. The current contract is the [production cutover specification](../../.agents/artifacts/archive/2026-09-27_reconcile-retrace-acp-production-spec.md) and its [approved implementation plan](../../.agents/plans/archive/2026-09-27-0134_reconcile-retrace-acp-production.md). The original decision is the [replacement lifecycle plugin specification](../../.agents/artifacts/archive/2026-09-18_replacement-lifecycle-plugin-spec.md); the controller cutover replaces its executable seam. The archived production specification and DONE plan still name their pre-archive paths; those citations are historical, and neither file is edited to follow them.

Run-survival amendment (D31 item 9 and the item 4, Consequences and rejected-alternative changes) approved by the owner on 2026-10-07; its authority is the Reconcile-accepted [run survival proposal](../../.agents/artifacts/2026-10-07_controller-run-survival-proposal.md) and its [approved plan](../../.agents/plans/2026-10-07-1304_controller-run-survival.md).

## Supersession

D31 supersedes no existing ADR decision ID. It displaces the unexecuted architecture direction in `.agents/plans/archive/2026-09-18-1411_layer1-tier1-lifecycle-proof.md`; that plan is archived as CLOSED history and not rewritten as completed work. The 2026-10-07 run-survival amendment amends D31 in place and supersedes no other decision ID or record.

## Verification expectations

Behavior-changing maintenance updates the controller and its offline suite (A3 of the linked production specification), both executable skills, the reviewer protocol, affected semantic fixtures, and human projections together, and keeps the static cutover checks (A5) at zero violations. Live proof (A7) runs from a new OMP session through the skills. Standard review and independent verification remain mandatory. Native/model/account execution, fault injection, and catalog-wide execution require their own current authority.
