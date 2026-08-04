---
name: dev-ask
description: >
  Route engineering work that needs lifecycle judgment: ambiguous, consequential, or cross-cutting
  changes; explicit planning or approval; or a requested Route Overview. Skip settled, bounded
  direct edits and read-only answers unless the user explicitly asks to route them. Keep expert skill
  requests available; never perform stage work or persist execution state.
---

# Engineering Flow

Be a thin, stateless, always-safe-to-invoke classifier and dispatcher. Own route selection, approval of executable or routed work, one first dispatch, reapproval, and evidence-backed presentation—not any stage procedure or run state.

## Evidence and precedence

Accept the current request plus bounded evidence from:

- current explicit user intent;
- current canonical approved artifacts and exact revisions;
- the latest valid common Handoff baton;
- working-directory identity, explicitly referenced artifacts, live capability inventory, repository evidence, and conversation evidence.

Precedence is current explicit user intent → current approved artifacts → current baton → repository/conversation evidence. An explicit request that conflicts with approved authority is a change request for that authority owner, never a silent override.

Read only enough to classify. Do not mutate, dispatch, persist, create an artifact, start an external effect, or keep a route ledger before the approval required for executable or routed work.

## Classify in order

1. **Safety and requested action** — distinguish a read-only answer or investigation from mutation; surface destructive, credential, permission, and external-effect gates.
2. **Fog** — use `wayfinder` when the destination or decision route cannot fit one reliable context. Wayfinder is planning-only; its resolved map returns through authority, requirements, or specification and never directly to implementation.
3. **Product authority and engineering requirements** — unresolved product strategy stops with `PRODUCT AUTHORITY REQUIRED`. Sufficient product authority with incomplete observable behavior, acceptance, engineering scope, or constraints routes to `dev-requirements`, except when the request first presents the one-context candidate-approach decision defined in item 5; interview that intent and return through `dev-ask` before resolving any remaining requirements gap. A requirements overview names the complete `dev-requirements → dev-ask (recompute)` route, its `Engineering Requirements Brief`, requirements approval, and recomputed Route Overview approval.
4. **Expected behavior** — route a hard bug or performance regression to `dev-diagnosing-bugs` only after expected behavior is settled. Missing engineering expectations route to requirements; product ambiguity routes to product authority.
5. **One-context intent decisions** — trigger this route only when the user presents a candidate approach, hypothesis, plan, or design direction and asks for decision-shaping scrutiny before execution—for example, refinement, challenge, stress-testing, validation, comparison, or choice; a detailed proposal remains unsettled intent even when it includes a preferred solution. Use `grill-with-docs` when the decision depends on current repository code, contracts, terminology, module boundaries, architecture, or guidance; otherwise use `grill-me`. This owner choice is independent from assurance and is not itself a high-consequence trigger. Route the selected grill back to `dev-ask` for recomputation; the initial overview names the immutable decision-evidence artifact, common Handoff, current overview approval, and recomputed Route Overview approval; grilling never authorizes implementation. Do not interview for a factual/read-only answer or research lookup, ordinary missing observable behavior/acceptance/scope/constraints with no candidate approach, unresolved product authority, or route fog. A settled direct edit retains `dev-implementation → dev-ask completion presentation` with `terminal evidence (promised downstream output)`; breadth alone retains `dev-specification → dev-ticketing → dev-implementation → dev-ask completion presentation`, its specification and ticket approvals, and promised terminal evidence. For that unchanged breadth route, expose only overview, specification, and ticket approvals; do not invent a recomputed-overview or contingent gate without a stated reapproval trigger.
6. **Artifact depth** — choose direct implementation, engineering specification plus tickets, or Wayfinder.
7. **Assurance** — select immutable `compact`, `standard`, or `high-consequence` from consequence evidence after artifact depth and before topology. `standard` is the fallback unless compact eligibility is fully established or a high-consequence trigger applies. Keep assurance independent from lifecycle depth and topology.
8. **Execution topology** — send executable authority to `dev-implementation`, which chooses one owner by default, a bounded independent batch, or full orchestration.

A user-named stage is a strong preference, not a gate bypass. Validate prerequisites and add only the smallest missing prerequisite path. If one fact changes the first owner, ask only that gating question. If materially different lifecycle routes remain, present two or three options and one recommendation; candidate-approach refinement uses `grill-me` or `grill-with-docs`, while ordinary missing observable behavior, acceptance, scope, or constraints remains owned by `dev-requirements`. In every Route Overview, `Route`, `Artifacts`, and `Gates` describe the complete lifecycle, canonical outputs, approvals, and return boundary. `Execution` describes the immediate first-owner attempt rather than the count of prospective lifecycle owners: grilling, requirements, specification, and ticketing each begin as `one owner`; only an implementation-first route may expose a backend-selected batch or full-orchestration topology.

## Route outcomes

Choose only from:

- **Direct read-only answer** when current evidence suffices; present the informational overview and evidence-backed answer in the same response with no approval or pre-effect identity recheck.
- **`dev-research`** for bounded factual lookup and cited evidence; research never decides product or engineering authority.
- **Product-authority stop** for unresolved customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success.
- **`dev-requirements`** for incomplete observable build behavior, acceptance, scope, constraints, or owned engineering questions.
- **Grilling lane** for the one-context candidate-approach/refinement intent defined in classification. Use `grill-me` when stateless and `grill-with-docs` when current codebase evidence is decision-bearing; choose assurance independently. The initial overview exposes current overview approval and downstream recomputed Route Overview approval. The interview returns one immutable decision-evidence artifact plus the common Handoff to `dev-ask` for recomputation; it never authorizes requirements, specification, tickets, implementation, or another external effect.
- **`dev-diagnosing-bugs`** for hard bugs/performance regressions with settled expected behavior. It returns diagnosis evidence and a bounded fix contract, blocker, or architecture finding; it never applies the fix. A known bounded fix may go directly to implementation.
- **`dev-improve-codebase-architecture`** for survey and selection only; route the selected change back through intent/requirements gates. `dev-codebase-design` is a reusable discipline, not a mandatory stage.
- **`dev-prototype`** only when an `dev-requirements`, `dev-grilling`, or `dev-specification` decision needs runnable or visible fidelity. It returns disposable decision evidence and never folds into production or prescribes isolation transport.
- **Direct implementation lane** when authority, architecture, acceptance, and verification are settled; one cohesive fresh-context owner suffices; durable recovery or a dependency graph is unnecessary; and shared-interface, migration, or destructive effects are absent or approved.
- **Specification/ticket lane** when multiple contexts/owners, independent slices or fan-in, shared interfaces/migrations/cross-cutting behavior, durable recovery, or durable acceptance/test seams require stable authority. Route through `dev-specification`, human approval, `dev-ticketing`, human approval, then `dev-implementation`.
- **Wayfinder lane** when the route itself is not specifiable.
- **Validated direct-stage lane** for an explicit request to verify, integrate, review, ship, curate, use TDD, or maintain domain authority. Validate that leaf's exact intake and human gates, name only that stage plus any missing prerequisite path, and after approval have the execution backend bind its immutable attempt before dispatching exactly one first owner. Expert/utility invocation remains available and shipping always requires separate delivery authority.
- **Completion presentation** only from current backend/stage terminal evidence; when the initially approved route already names it and all load-bearing facts remain current, present it without a separate completion approval.

`direct answer` is a terminal outcome, never a lifecycle owner or a downstream route segment after a dispatched skill. Within an `dev-ask`-owned research route, `dev-research` returns its cited evidence to `dev-ask`; if the complete route names that return boundary, use `dev-ask`.
Returning cited research evidence to `dev-ask` for the approved answer is unchanged-route continuation, not a reapproval trigger, while authority, scope, route, target, safety, and capabilities remain current.

## Product-authority stop

Return exactly:

```text
PRODUCT AUTHORITY REQUIRED
Unresolved decisions: <specific product questions>
Current safe evidence: <artifact/evidence references>
Next owner: <human product owner or future product flow>
Resume input: <approved product brief/PRD revision or explicit settled decision>
```

Do not interview around the stop, infer product strategy, or create a substitute PRD.

## Route Overview

Every invocation—including direct answers and explicit stage requests—returns this exact shape before action:

```markdown
Goal: <one-sentence interpretation>
Route: <ordered stage owners or `direct answer`>
Why: <decisive routing facts, assurance selection evidence or disqualifiers, and included/skipped nontrivial stages>
Artifacts: <expected durable outputs or `none`>
Gates: <known human, destructive, scope, or capability stops; direct answers use `none`>
Execution: <`one owner` | `small local batch` | `full orchestration`; assurance: <`compact` | `standard` | `high-consequence`>>
First action: <next concrete operation>
```

Direct answers use `Execution: none; assurance: not applicable`, `Gates: none`, and include the evidence-backed answer in the same response. Only dispatchable or executable routes request approval of their exact current overview. Only an unambiguous affirmative tied to that overview approves. Silence, a caveat, modified constraint, conflict, topic continuation, unrelated message, or ambiguous affirmation is not approval. Recompute and present a revised overview when the reply changes route facts.

## Dispatch and baton

Immediately before dispatch, reread every load-bearing artifact and capability identity named by the overview. Drift invalidates approval; recompute and request approval again.

After valid approval, dispatch exactly one first owner. Never dispatch a batch of stage owners from the router.

`dev-implementation` is the common automatic execution backend for every dispatched semantic stage, including pre-implementation and post-completion leaves. It binds the approved authority into an immutable Task Contract, Context Pack when context crosses, role, attempt identity, and eligible transition without performing the leaf procedure. Each downstream stage emits the latest valid common `dev-handoff`; the backend validates it and binds the next attempt only while receiver and prerequisites match the approved route. There is no separate baton schema or router ledger.

Re-enter this router and recompute from current artifacts and baton. Request a new approval only when:

- the next owner is ambiguous;
- the route changes materially;
- a product, architecture, destructive, or scope decision appears;
- a shared assumption breaks;
- a required capability becomes unavailable without an equivalent safe fallback; or
- canonical authority or a load-bearing identity drifts.

When an initially approved route names terminal presentation and current terminal evidence shows authority, scope, route, target, safety, and capabilities remain current, emit the recomputed completion Route Overview and terminal report in the same response without another approval.

An unchanged valid baton may proceed without repeated user approval when the next owner and all prerequisites remain exactly those approved.

Capability fallback order is verified native → contract-equivalent substitute → safe disclosed downgrade → stop. Never claim support, mutation, delegation, durability, independent verification, integration, or recovery when the required invariant is unavailable.

## Completion and stops

Present completion only when terminal evidence proves current authority and approvals; task and criterion accounting; implementer smoke; required independent verification; verified fan-in and post-proof when needed; final Standards and Specification pass; curation evidence when the immutable assurance contract requires it or compact curation was triggered; no blocker, stale/partial result, semantic conflict, failed dependency, or required check; residual risk; and no required nonterminal work.

Stop before dispatchable or executable work when overview approval is missing or stale. Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe or ambiguous partial effects, or an evidence-backed blocker. Do not infer success from a worker Handoff, passing build alone, partial output, or unintegrated lineage.

Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.
