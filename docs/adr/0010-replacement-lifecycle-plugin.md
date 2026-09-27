# ADR-0010 — acpx controller for Retrace and Reconcile

**Status:** ACTIVE  
**Date:** 2026-09-18

## Scope

This record governs the persistent actor sessions used only by the named Retrace and Reconcile custom controllers, owned by one Node controller at `.config/agents/harnesses/omp/acp-controller/`. It does not change generic engineering routing, implementation-child collection, assurance, shipping, model/account authority, or producer report grammar.

## Context

Retrace and Reconcile require stable child identities across multiple semantic turns, owner-only reply visibility, durable pending-state inspection, bounded direct capacity, partial sibling accounting, and cleanup proven by observed process exit. Projecting those guarantees onto launch jobs, roster addressability, caller-owned observation windows, local echoes, or `details.waited` made transport mechanics look like semantic authority and could not prove exact disposal.

The controller replaces the earlier in-session OMP extension. The root OMP session runs the skill, runs the controller's read-only `roles` preflight through `bash` before showing each brief or scope table, obtains approval, invokes the controller CLI once per approved binding through `bash`, and presents its record. The controller owns every reviewer, normalizer and scope-evaluator session through public acpx `createSharedAcpRuntime` and native `omp acp`, pins both versions before any launch, and adds no custom transport, supervisor, mailbox, private acpx import, or generic workflow policy.

## Decision

### D31 — Use one coded acpx controller while the executable skills retain semantic authority

1. The controller alone owns reviewer, normalizer and scope-evaluator sessions through public acpx and native `omp acp`. Only the admitted, domain-valid native `yield` candidate is a reply; prose, failed or unfinished yields, launch completion and turn results never count and are never a fallback.
2. The first admitted reply is kept and is visible only to its owning parent. Ancestors receive identities, states, turn/reuse results and cleanup blockers, never another actor's reply body.
3. Reply, turn result and reuse state stay separate; a failed turn does not discard an admitted reply, and a reply does not imply reuse.
4. A request stays pending until a reply, a concrete terminal failure or an explicit abort. Uncertain delivery is observed without replay; elapsed time creates no caller-owned timer, polling loop, semantic retry, replacement actor, or additional re-ask.
5. Retrace runs at most four direct actors at once; a permit frees only on observed disposal. A reply, turn completion, abort acknowledgment, signal request, or matching identity does not release capacity. A failed member keeps its successful siblings.
6. Disposal counts only on observed process exit, children before parents, and a failed disposal blocks success. Reconcile disposes its reviewers before its final proposal; a delegated Retrace scope disposes its reviewers before publishing `scope-result`, and its parent then disposes the scope actor.
7. The Retrace and Reconcile skills and the Reconcile reviewer protocol remain the semantic owners of approval, report grammar, re-ask budgets, reviewer identity, verdicts, continuation, stops, aggregation, and proof interpretation. The controller has no fallback reply channel: it uses no task, hub, Eval, transcript, lookup, replay, resend, replacement, or generic collector.
8. The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts.

## Consequences

- Retrace and Reconcile share one coded controller over public acpx and native `omp acp`, and keep separate executable semantic contracts.
- Stable actor, request, owner, first-reply, turn/reuse, pending, abort, and observed-exit disposal states are explicit and cannot be inferred from unrelated host surfaces.
- Partial batches and failed cleanup retain exact evidence instead of collapsing into a false all-or-nothing result.
- The controller pins exact omp and acpx versions in `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs`; a different version is refused before any launch until the offline suite and live runs pass on it.
- The previously pending Tier 1 recorder plan remains closed as historical planning.
- The eval catalogs are specification fixtures. Their presence is not a claim that the full catalogs were executed; any native or model-backed execution remains separately gated.

## Rejected alternatives

- **Launch jobs plus roster binding:** rejected because stable ownership, first-reply authority, reuse, and exact disposal remain conflated.
- **Caller-owned timers or external supervisors:** rejected because elapsed time is not semantic failure and callers must not poll or manufacture completion.
- **Generic collection fallback:** rejected because these custom controllers have stricter owner visibility, capacity, and disposal semantics.
- **Recorder-only corroboration:** rejected because passive records do not provide the active persistent-actor lifecycle boundary.
- **Proof-export API:** rejected because export is not a lifecycle concern; prebound owners can copy retained returned results without widening the plugin interface.

## Affected contracts

- `.config/agents/harnesses/omp/acp-controller/`
- `.config/agents/harnesses/omp/agent-return.md`
- `.config/agents/references/agent-return/return.md`
- `.config/agents/skills/retrace/SKILL.md`
- `.config/agents/skills/reconcile/SKILL.md`
- `.config/agents/skills/reconcile/references/reviewer-protocol.md`
- the Retrace and Reconcile eval catalogs
- the custom-controller projections in `dev-ask` and `dev-implementation`

## Authority and evidence

Human authority is bound to `reconcile-retrace-acp-production/spec-v3`, SHA-256 `2c1628c741a2870b584268527dd33fcf26e2483edb53c9d7cf77e3f80692e958`, in [the production cutover specification](../../.agents/artifacts/2026-09-27_reconcile-retrace-acp-production-spec.md) and its [approved implementation plan](../../.agents/plans/2026-09-27-0134_reconcile-retrace-acp-production.md). The original decision was bound to `replacement-lifecycle-plugin/spec-v5`, SHA-256 `e9bbcfb931ecce43729b02be6589a8463d259cbe159aea57e920efe3f844ba7f`, in [the replacement lifecycle plugin specification](../../.agents/artifacts/archive/2026-09-18_replacement-lifecycle-plugin-spec.md); the controller cutover replaces its executable seam. Spec-v3 and the DONE plan still name pre-archive paths; those citations are historical, and neither file is edited to follow them.

## Supersession

D31 supersedes no existing ADR decision ID. It displaces the unexecuted architecture direction in `.agents/plans/archive/2026-09-18-1411_layer1-tier1-lifecycle-proof.md`; that plan is archived as CLOSED history and not rewritten as completed work.

## Verification expectations

Behavior-changing maintenance updates the controller and its offline suite (spec-v3 A3), both executable skills, the reviewer protocol, affected semantic fixtures, and human projections together, and keeps the static cutover checks (A5) at zero violations. Live proof (A7) runs from a new OMP session through the skills. Standard review and independent verification remain mandatory. Native/model/account execution, fault injection, and catalog-wide execution require their own current authority.
