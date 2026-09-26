# ADR-0010 — Replacement lifecycle plugin for Retrace and Reconcile

**Status:** ACTIVE  
**Date:** 2026-09-18

## Scope

This record governs the persistent actor lifecycle used only by the named Retrace and Reconcile custom-controller consumers. It does not change generic engineering routing, implementation-child collection, assurance, shipping, model/account authority, or producer report grammar.

## Context

Retrace and Reconcile require stable child identities across multiple semantic turns, owner-only reply visibility, durable pending-state inspection, bounded direct capacity, partial sibling accounting, and cleanup proven by observed process exit. Projecting those guarantees onto launch jobs, roster addressability, caller-owned observation windows, local echoes, or `details.waited` made transport mechanics look like semantic authority and could not prove exact disposal.

The approved replacement introduces one opt-in OMP lifecycle extension and migrates both executable consumers to it. The extension is inert until a named consumer opens a run. Stock OMP worker spawning remains behind the extension through `RpcClientOptions.spawn` and `ptree`; no custom transport or generic workflow policy is added.

## Decision

### D31 — Use one named lifecycle supervisor boundary while semantic owners retain admission authority

1. The extension exposes only `open`, `dispatch`, `observe`, `dispose`, `abort`, and `close`, plus its compact human status command. Delegated actors use the connection-bound `lifecycle_channel.request`, `lifecycle_channel.reply`, and `lifecycle_channel.dispose` seam. There is no export operation or destination field.
2. `open` validates the complete named consumer binding and declares stable actor identities without spawning them. `dispatch` starts or addresses the requested actor, records a stable request identity and semantic phase, and returns durable state. For one actor, delivered turns remain serialized; distinct actors may overlap.
3. The supervisor retains the first accepted reply separately from turn completion and reuse outcome. Only the physical owner receives the reply body. Ancestors receive redacted identities, states, turn/reuse results, and cleanup blockers. Ordinary assistant output, launch completion, status wakes, and later observations are not semantic replies.
4. Pending requests remain inspectable and explicitly abortable. Plugin-owned periodic status wakes are observation-only and disclose no body. They create no caller-owned timer, polling loop, semantic retry, replacement actor, or additional allowance.
5. Retrace direct-capacity accounting and Reconcile reviewer semantics remain owned by their executable skills. Batched dispatch preserves successful siblings when another actor is start-failed or delivery-unknown. A reply, turn completion, abort acknowledgment, signal request, or matching identity does not release capacity.
6. Successful cleanup requires supervisor-retained process-exit observation and exact `disposed`/`closed` results. Failed cleanup preserves `failed-cleanup`, the unresolved actor/PID, and retained state. Reconcile disposes reviewers before terminal presentation; a delegated Retrace scope disposes its reviewers before publishing `scope-result`, and its parent then disposes the scope actor with subtree ownership.
7. The plugin owns lifecycle mechanics and result retention. Retrace and Reconcile remain the semantic owners of approval, report grammar, correction budgets, reviewer identity, verdicts, continuation, stops, aggregation, and proof interpretation. They use no task, hub, Eval, yield, transcript, lookup, replay, resend, replacement, or generic collector as a lifecycle fallback.
8. When proof copying was authorized before `open` or the covered `dispatch`, the bound semantic owner may mechanically copy only the plugin-owned returned envelopes and owner-visible reply bodies selected by returned run, actor, and request identities. A late request is rejected. Copying adds no report field, changes no status, and creates no plugin export API.
9. The generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged. Their exact implementation-child exemptions do not replace or weaken these named custom-controller lifecycle contracts.

## Consequences

- Retrace and Reconcile have one shared mechanical lifecycle seam and separate executable semantic contracts.
- Stable actor, request, owner, first-reply, turn/reuse, pending, abort, and observed-exit disposal states are explicit and cannot be inferred from unrelated host surfaces.
- Partial batches and failed cleanup retain exact evidence instead of collapsing into a false all-or-nothing result.
- The previously pending Tier 1 recorder plan is closed as historical planning: superseded before execution by replacement lifecycle plugin.
- The migrated eval catalogs are specification fixtures. Their presence is not a claim that the full catalogs were executed; any native or model-backed execution remains separately gated.

## Rejected alternatives

- **Launch jobs plus roster binding:** rejected because stable ownership, first-reply authority, reuse, and exact disposal remain conflated.
- **Caller-owned timers or external supervisors:** rejected because elapsed time is not semantic failure and callers must not poll or manufacture completion.
- **Generic collection fallback:** rejected because these custom controllers have stricter owner visibility, capacity, and disposal semantics.
- **Recorder-only corroboration:** rejected because passive records do not provide the active persistent-actor lifecycle boundary.
- **Proof-export API:** rejected because export is not a lifecycle concern; prebound owners can copy retained returned results without widening the plugin interface.

## Affected contracts

- `.config/agents/harnesses/omp/extensions/lifecycle-plugin.js`
- `.config/agents/harnesses/omp/extensions/lifecycle-supervisor.js`
- `.config/agents/harnesses/omp/extensions/lifecycle-consumers.js`
- `.config/agents/harnesses/omp/config.yml`
- `.config/agents/harnesses/omp/agent-return.md`
- `.config/agents/harnesses/omp/agents/second-opinion-a.md`
- `.config/agents/harnesses/omp/agents/second-opinion-b.md`
- `.config/agents/references/agent-return/return.md`
- `.config/agents/skills/retrace/SKILL.md`
- `.config/agents/skills/reconcile/SKILL.md`
- `.config/agents/skills/reconcile/references/reviewer-protocol.md`
- the Retrace and Reconcile eval catalogs and Reconcile human execution map
- the custom-controller projections in `dev-ask` and `dev-implementation`

## Authority and evidence

Human authority is bound to `replacement-lifecycle-plugin/spec-v5`, SHA-256 `e9bbcfb931ecce43729b02be6589a8463d259cbe159aea57e920efe3f844ba7f`, in [the replacement lifecycle plugin specification](../../.agents/artifacts/2026-09-18_replacement-lifecycle-plugin-spec.md) and its [approved implementation plan](../../.agents/plans/2026-09-18-2248_replacement-lifecycle-plugin.md). The executable seam and consumer cutover are established by the admitted T1–T3 lineage. Separately gated post-cutover proof remains outside this decision's execution claim.

## Supersession

D31 supersedes no existing ADR decision ID. It displaces the unexecuted architecture direction in `.agents/plans/2026-09-18-1411_layer1-tier1-lifecycle-proof.md`; that plan remains in place as CLOSED history rather than being archived or rewritten as completed work.

## Verification expectations

Behavior-changing maintenance updates the extension, both executable consumers, affected semantic fixtures, and human projections together. Standard review and independent verification remain mandatory. Native/model/account execution, fault injection, and catalog-wide execution require their own current authority.
