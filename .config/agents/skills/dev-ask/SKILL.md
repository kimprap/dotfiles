---
name: dev-ask
description: >
  Route engineering work that needs lifecycle judgment: ambiguous, consequential, or cross-cutting
  changes; explicit planning or approval; or a requested Route Overview. Skip settled, bounded
  direct edits and read-only answers unless the user explicitly asks to route them. Keep expert skill
  requests available; while acting as router, never perform stage work or persist execution state.
---

# Engineering Flow

Be a thin, stateless, always-safe-to-invoke classifier and dispatcher.
While acting as `dev-ask`, own route selection, approval of executable or routed work, one first-owner start, reapproval, explicit portfolio-audit intake, and engineering completion validation and normalization.
Own no stage procedure, run state, scheduler, or final rendering; a later in-place `dev-implementation` activation is a role change under approved authority, not router implementation work.

## Evidence and precedence

Accept the current request plus bounded evidence from:

- current explicit user intent;
- current canonical approved artifacts and exact revisions;
- the latest valid lean Handoff;
- working-directory identity, explicitly referenced artifacts, live capability inventory, repository evidence, and conversation evidence.

Precedence is current explicit user intent → current approved artifacts → current Handoff → repository/conversation evidence.
An explicit request that conflicts with approved authority is a change request for that authority owner, never a silent override.
Read only enough to classify. Before the approval required for executable or routed work, do not mutate, dispatch, persist, create an artifact, start an external effect, or keep a route ledger.

## Classify

Before deciding implementation artifact depth or topology, read `skill://dev-ticketing/references/task-sizing.md`, apply it to new task boundaries, and state the material boundary rationale briefly in the Route Overview `Plan` prose.
Reading it does not invoke ticketing, add a stage, or determine assurance.
Route presentation is not dispatch: every sizing proposal that identifies a prospective dispatchable owner MUST use the full five-field Route Overview, including `Approval`, even when only a proposal is requested; dispatch or execute nothing until that approval is current.

First classify safety and the requested action: separate a read-only answer or investigation from mutation, and surface destructive, credential, permission, and external-effect gates.
Then take the first matching row:

| Trigger (first match wins) | Owner and route facts |
|---|---|
| Current evidence answers the request | Direct read-only answer in the same response: no approval or pre-effect identity recheck; an informational route only on request; terminal, never a lifecycle owner or downstream segment. |
| One bounded factual gap | `dev-research`: Route Overview approval before dispatch; cited evidence only, never product or engineering authority; returns to the concrete requesting route owner, next-owner role `dev-ask`. |
| Explicit request to inspect or triage an external issue, pull request, or tracker intake | `dev-triage`: one category and state, an agent-ready brief when qualified; returns to the requesting route owner acting as `dev-ask`; a tracker mutation needs exact external-effect approval. |
| The destination or decision route cannot fit one reliable context | `wayfinder`: a resolved map returns for recomputation and never authorizes work; large work with a current spec and graph, or with known safe seams, is not fog. |
| Unresolved customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success | `product-ask` only when the user explicitly asks to establish or refine product authority; otherwise stop with `PRODUCT AUTHORITY REQUIRED`. |
| Product authority suffices, but observable behavior, acceptance, scope, constraints, or owned engineering questions are incomplete, with no candidate approach under decision | `dev-requirements`: asks the user only about synthesized or materially clarified human-owned requirements. |
| Hard unexplained reproducible bug or performance regression; expected behavior settled | `dev-diagnosing-bugs`: a valid fix contract continues through implementation under the stable route; a known cause or routine failure skips diagnosis for bounded `dev-implementation` repair. |
| The user presents a candidate approach, hypothesis, plan, or design direction to refine, challenge, stress-test, compare, validate, or choose | `dev-grilling`: read repository evidence when it bears on the decision; breadth alone never triggers it. |
| Current executable authority and named acceptance are complete, and a named criterion is unmet | `dev-implementation` (outcome-first continuation). |
| Explicit user or external-scheduler portfolio-audit request with an eligible exact target and complete repository or named-subsystem permanent-test suite intake | `dev-test-audit`: read-only; see the audit intake rule under the Route Overview. |
| Explicit request to verify, review, ship, curate, or maintain domain authority | Validated direct stage: check its exact intake and human gates; shipping needs separate delivery authority. |
| Technical authority, architecture, named acceptance, direct checks, and task ownership are settled | `dev-implementation` directly. |
| Durable technical decisions are unresolved | `dev-specification`, then the standard suffix; reuse a complete specification rather than regenerating it for task sizing. |
| A complete current specification has known seams but lacks necessary task or dependency ownership | `dev-ticketing`, then the standard suffix; reuse a complete graph rather than regenerating it. |
| Requirements, grilling, or specification needs runnable or visible fidelity | `dev-prototype`: disposable decision evidence returned to that exact owner; never folds into production. |
| Explicitly requested broad survey whose selected change is not settled | `dev-improve-codebase-architecture`: returns the selected candidate and constraints for recomputation; starts no refactor. |
| Exact-name request only | `recap`: manual response-rewrite fallback, never an automatic workflow route. |

A user-named stage is a strong preference, not a gate bypass: validate prerequisites and add only the smallest missing prerequisite path.
Project-authored tickets, repository plans, and current implementation graphs are already qualified and skip triage.

## Assurance

Before classification, read `skill://dev-implementation/references/compact-checklist.md` and apply its compact disqualifiers by reference; never duplicate them here.
Select immutable `compact`, `standard`, or `high` from consequence evidence after artifact depth and before topology; compact is the default when every disqualifier is false, otherwise select standard or high.
Keep assurance independent from lifecycle depth and topology.

## Implementation

Implementation is `dev-implementation`, a role the route-owning agent activates in place by default, not a new actor; attempts, repair, review, verification closure, execution recovery, controller topology, and planless-versus-plan choice follow `dev-implementation`.
The router grants no retries and holds no cause, allowance, or run state; a proposed material change during recovery uses the return and reapproval rules below.
The approved implementation route also covers the collections `dev-implementation` exempts in its owner-directed return preflight; do not re-enter router intake or seek further human consent for them.
A finite host observation window ending does not reopen routing or prove a missing report.

Compose an ordinary implementation route through these gates in order:

1. Classify safety and whether current evidence already answers the request.
2. If an existing catalog intake predicate is true, prepend that exact owner and do not compose ordinary compact.
3. If any compact disqualifier is true, select standard or high.
4. Otherwise select compact: first owner `dev-implementation`, and the route ends with the non-dispatchable terminal marker `completion-presentation`.
5. Implementation sizing, duration, or solution-rung choice alone never prepends a catalog skill or raises assurance.
6. Present one owner per numbered Route line and start only the first owner after approval; dispatch a delegated first owner, but activate `dev-implementation` in the route-owning agent by default.

## Router-owned outcomes and stops

- Outcome-first: renewed planning, diagnosis, audit, or review is invalid unless it implements or checks a criterion, resolves a named blocker, or produces decision evidence that changes authority.
- An unchanged Handoff, another artifact pass, or a repeated hypothesis is not progress; no parent repair, verification, review, completion, audit, or learning state is inherited.
- A disjoint non-outcome observation is a terminal advisory; a terminal advisory does not replay the approved lifecycle.
- Independently serious safety returns separate-authority intake.
- A disjoint outcome-relevant non-safety defect returns `authority-change-required` to the outcome authority, with no silent repair, verification restart, learning, approval, or completion.
- Indeterminate governing authority returns to its owner.
- Cleanup elected after terminal completion, including wording-only advisory cleanup, is a fresh maintenance outcome with fresh authority, acceptance, targets, attempts, and assurance.
- Faithful specifications and ticket graphs continue automatically under the current approved Route Overview unless they introduce a new human-owned decision, material trigger, or separately gated effect.
- A detailed preferred proposal is still unsettled intent. Grilling returns immutable decision evidence plus one Handoff to the requesting route owner, next-owner role `dev-ask`.
- User confirmation settles that grilling evidence and is not a router gate; recompute after it, but reapprove only if a named material trigger changed.
- The requirements owner continues through the unchanged approved route after its human-owned questions are answered.
- Returned research, state-mapped triage returns (including `wontfix` to the route owner acting as `dev-ask` for terminal presentation), and any unchanged stage Handoff are stable-route continuations, not reapproval triggers.

## Route-ending suffix

Whenever current facts determine an implementation lifecycle, the prospective `Route` ends with the assurance-specific suffix and the non-dispatchable presenter marker.
Compact uses `dev-implementation → completion-presentation`.
Standard and high use exactly `dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation`.
Review, verification, and learning keep their independent actor boundaries; the presenter marker is never dispatched.
Requirements, grilling, research, diagnosis, prototype, specification, ticketing, survey, or Wayfinder owners appear before that suffix only when an existing intake predicate is true; implementation size or duration adds no owner.
Manual `dev-test-audit` remains a separate explicit route.

## Presentation

After evaluating the full skill catalog, apply these presentation rules in order:

1. When evidence determines one route, present only that recommended route.
2. When exactly one unknown fact changes the first owner, ask exactly one bounded gating question and stop; show no candidate routes, approval, or dispatch first.
3. When multiple facts remain unresolved, use the existing requirements, research, or human-authority owner instead of serializing them into a router interview.
4. Only when two or three materially different routes are each valid and the remaining choice is a user-owned trade-off, show exceptional candidates.

Give each candidate a label, its own ordered list, and one concise trade-off sentence; mark exactly one `Recommended`, ask exactly one selection question, and request no route approval or dispatch until selection.
Use this exceptional form:

```markdown
## Route candidates
### Recommended — <label>
1. `<owner>`
2. `<owner>`

Trade-off: <one decision-bearing sentence>.

### Alternative — <label>
1. `<owner>`
2. `<owner>`

Trade-off: <one decision-bearing sentence>.

<one selection question>
```

Internally, every route binds the complete prospective owners, durable artifacts, human/effect gates, assurance profile, execution topology, and one immediate owner.
Present only the compact approval contract below; expose no stage mechanics, identity digests, or first-action metadata unless they affect the user's decision.

## Product-authority stop

Return exactly:

```text
PRODUCT AUTHORITY REQUIRED
Unresolved decisions: <specific product questions>
Current safe evidence: <artifact/evidence references>
Next owner: <human product owner or product-ask>
Resume input: <approved product brief/PRD revision or explicit settled decision>
```

Do not interview around the stop, infer product strategy, or create a substitute PRD.

## Compact approval presentation

For dispatchable or executable work, present exactly one `## Route overview` before any effect.
Read and follow [packed-label](../../references/packed-label.md); this skill owns only the field map below.
Render every human-facing prospective `Route` as an ordered list with one exact owner per line and the exact final terminal marker `completion-presentation`; never use an inline arrow chain, route table, or unordered list.
The marker is never dispatched and receives no task, Task Contract, Context Pack, backend attempt, Handoff, state, transition, or approval:

```markdown
## Route overview

**Goal**

- <one concise sentence>

**Route**

1. `<first owner>`
2. `<next owner or completion-presentation>`

**Plan**

- <one or two concise sentences covering the observable work, material task-boundary rationale, and assurance>

**Safety**

- <only material preservation, destructive, external, credential, or shipping boundaries; otherwise `No destructive, external, or shipping effects.`>

**Approval**

- Reply **approve** to start.
```

Repeat the second route row for each actually prospective owner; the final row is always the non-dispatchable `completion-presentation` marker, so compact has exactly two route rows.
For explicit permanent-test audit intake, the `Plan` field shows the exact audit scope and ordered list of every in-scope test file before approval; do not launch auditor A or B until the approval reply is current.
After approval, the manual audit uses its installed A-first protocol and grants no mutation authority; accepted fixes require a fresh direct or planned mutation approval.
Do not add a `Plan Summary`, `Why`, `Artifacts`, `Gates`, `Execution`, or `First action` field.
Omit diagnosis IDs, artifact inventories, target hashes, gate machinery, and execution metadata unless one changes the user's decision.
For a material reapproval, keep the same five fields, state only the changed decision-bearing facts, and use `Reply **approve** to continue.`
Direct read-only answers need no approval template; when the user explicitly requests an informational route, use only `Goal`, `Route`, `Plan`, and `Safety` and omit `Approval`.

## Dispatch and Handoff

Immediately before starting the first owner, reread every load-bearing artifact and capability named by the approved route.
Reapprove only when current evidence changes authority, scope, acceptance, route, topology, independence, effects, capability equivalence, or another shared assumption; unrelated repository changes remain non-material.
After valid approval, start exactly one first owner; never dispatch a batch of prospective stage owners from the router.
Dispatch a delegated specialty, but activate `dev-implementation` in the route-owning agent by default; the in-place role change creates no self-Handoff.

After a delegated `dev-specification`, `dev-ticketing`, or standalone execution-plan author returns its first substantive candidate, send [`plan-rethink.md`](../../references/plan-rethink.md) once to that same author as it directs.

The approved Route Overview delegates downstream derivation while preserving human authority:

- **Requirements:** ask for confirmation only when the stage synthesizes, materially clarifies, or changes a human-owned observable requirement. A byte-for-byte projection or unchanged extraction continues automatically.
- **Specification:** continue automatically when it only derives technical detail inside approved requirements and architecture. Ask for the one new product, architecture, destructive/external-effect, or shipping decision if such authority is missing.
- **Ticket graph:** continue automatically when it is a faithful acyclic projection of the approved specification. Reapproval is required only when the graph exposes a material route/topology/ownership change or a separately gated effect.
- **Grilling:** the user confirms the shared decision evidence after the frontier is empty. That confirmation settles the interview artifact; it does not repeat route approval.

Each necessary prompt names the smallest current set of human-owned decisions or effects; batch independent decisions when the interview discipline applies, and state that the unchanged approved route resumes automatically afterward.
Artifact count, stage transitions, audits, unchanged Handoffs, and review/verification passes never create approval gates.
Prerequisite Handoffs preserve their authored next-owner role and name the concrete bound receiver.
Reaching `dev-implementation` activates the same route agent's controller unless the approved topology bound a separate controller; reaching `dev-ask` resumes the same route agent's router role.
Neither unchanged continuation adds a router hop, approval, or self-Handoff.

Recompute the route after a changed Handoff. Request material reapproval exactly for:

- changed product or architecture authority;
- changed route;
- changed material scope;
- changed acceptance;
- topology escalation or weakened independence;
- destructive or external effects;
- shipping;
- a broken shared assumption;
- a non-equivalent capability;
- load-bearing semantic authority or identity drift.

No other stage return, Handoff, artifact count, audit, review, unchanged evidence, or unrelated target byte drift authorizes or requires another route approval.
Capability fallback order is verified native → contract-equivalent substitute → safe disclosed contract-preserving downgrade → stop; a non-equivalent substitution is a material trigger, not an automatic fallback.

## Completion and stops

Normalize completion only from current backend and stage terminal evidence, when the approved route names the `completion-presentation` marker and material facts remain current.
Present completion only when terminal evidence proves current authority and approvals; every task and acceptance item complete; implementer direct checks pass; and the selected assurance path is settled (per `dev-implementation` Assurance; compact records `Learning: skipped for compact`).
Every completed repository-work boundary must have exactly one papercut look with its complete result set; validate success, all completed-boundary papercut results, the one applicable learning result, residual risks, and authorized continuation.
An ordinary blocked learning assessment is a residual risk; only a current governing-rule conflict that makes the implementation invalid or unsafe stops completion.
No unresolved authority conflict, required finding, failed dependency, or required check may remain.
For planned work, require the current active repository plan to contain its completed task and acceptance records, nonempty Completion Summary, `Completed At`, and `Status: DONE`; keep and cite that active plan.
Do not require or create an archive, manifest, digest, receipt, or archive-only locator; direct work uses its lean Handoffs and current terminal evidence without manufacturing a plan.

After terminal evidence validates, read [the canonical completion input contract](../../references/completion-presentation-input.md) before building the one current five-field input; follow its schema and validation rules, and do not activate the presenter to discover the input grammar.
Then apply `completion-presentation` directly in this same agent without separate approval: pass the input to the render script `python3 skill://completion-presentation/scripts/render.py` in a tool call and reply with only its five-field output, never the input.
The presenter is not dispatched and receives no task, plan, backend attempt, Handoff, state, transition, approval, or completed Route; it does not verify, repair, settle, archive, or ship.
After the report, the normal engineering route is terminal and schedules no audit: never dispatch `dev-test-audit` from presentation, plan `DONE`, assurance, review, verification, or learning.
A later explicit permanent-test audit is fresh validated direct-stage intake and cannot alter the completed lifecycle.
Missing, stale, duplicate, malformed, reordered, unknown, empty, placeholder, or non-success completion input emits no completed presentation.
Then preserve the applicable engineering stop, `wontfix`, authority-change, blocker, or shipping report instead; do not repair the input, continue semantic work, or emit a second Handoff.

Stop before dispatchable or executable work when overview approval is missing or stale.
Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe or ambiguous partial effects, or an evidence-backed blocker.
Also stop for a disjoint outcome-relevant review defect returned as `authority-change-required`; after that return, do not restart verification, dispatch learning, approve, or complete.
Do not infer success from a worker Handoff, passing build alone, partial output, or unintegrated lineage.
Do not reopen a terminal parent for advisory cleanup; classify the explicit cleanup request as a fresh maintenance outcome.

Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.
