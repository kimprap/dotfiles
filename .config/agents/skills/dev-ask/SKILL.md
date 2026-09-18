---
name: dev-ask
description: >
  Route engineering work that needs lifecycle judgment: ambiguous, consequential, or cross-cutting
  changes; explicit planning or approval; or a requested Route Overview. Skip settled, bounded
  direct edits and read-only answers unless the user explicitly asks to route them. Keep expert skill
  requests available; while acting as router, never perform stage work or persist execution state.
---

# Engineering Flow

Be a thin, stateless, always-safe-to-invoke classifier and dispatcher. While acting as `dev-ask`, own route selection, approval of executable or routed work, one first-owner start, reapproval, explicit portfolio-audit intake, and engineering completion validation and normalization—not any stage procedure, run state, scheduler, or final rendering. A later in-place `dev-implementation` activation is a role change under approved authority, not router implementation work.

## Evidence and precedence

Accept the current request plus bounded evidence from:

- current explicit user intent;
- current canonical approved artifacts and exact revisions;
- the latest valid lean Handoff;
- working-directory identity, explicitly referenced artifacts, live capability inventory, repository evidence, and conversation evidence.

Precedence is current explicit user intent → current approved artifacts → current Handoff → repository/conversation evidence. An explicit request that conflicts with approved authority is a change request for that authority owner, never a silent override.

Read only enough to classify. Do not mutate, dispatch, persist, create an artifact, start an external effect, or keep a route ledger before the approval required for executable or routed work.

## Classify in order

Before deciding implementation artifact depth or topology, read
`skill://dev-ticketing/references/task-sizing.md`. Apply that shared guidance to
new task boundaries and state the material boundary rationale briefly in the
Route Overview's existing `Plan` prose. Reading it does not invoke ticketing,
add a stage, or determine assurance.
Route presentation is not dispatch. Every sizing proposal that identifies a
prospective dispatchable owner MUST use the existing five-field Route Overview
in full, including the final `Approval`, even when the requested outcome is
proposal only; do not dispatch or execute unless that approval becomes current.

1. **Safety and requested action** — distinguish a read-only answer or investigation from mutation; surface destructive, credential, permission, and external-effect gates. Answer directly when current evidence is sufficient. Use `dev-research` only for one bounded factual gap, show the existing Route Overview and obtain approval before dispatch, then return its evidence to the concrete requesting route owner acting as `dev-ask`.
2. **Raw external intake** — use `dev-triage` only when the user explicitly asks to inspect or triage an external issue, pull request, or tracker intake. Project-authored tickets, repository plans, and current implementation graphs are already qualified and skip triage.
3. **Fog** — use `wayfinder` only when the destination or decision route cannot fit one reliable context. Large work with a current specification and implementation graph is not fog. Work that does not fit one fresh implementation context is not route fog when safe ownership or dependency seams are already known.
4. **Product authority and engineering requirements** — unresolved product strategy routes to `product-ask` only when the user explicitly asks to establish or refine product authority; otherwise stop with `PRODUCT AUTHORITY REQUIRED`. Sufficient product authority with incomplete observable behavior, acceptance, engineering scope, or constraints routes to `dev-requirements`, except when item 6's candidate-approach intent is the current engineering decision.
5. **Expected behavior** — route a hard unexplained reproducible bug or performance regression to `dev-diagnosing-bugs` only after expected behavior is settled. A known cause or routine implementation failure routes directly to bounded `dev-implementation` repair. During standard or high assurance, only one required reviewer or verifier finding may use semantic attempt 2. Review never reruns; when verifier repair is eligible, the same verifier closes the unchanged check set. A disjoint non-outcome observation is a terminal advisory; independently serious safety returns separate-authority intake; a disjoint outcome-relevant non-safety defect returns `authority-change-required` to the outcome authority without silent repair, verification restart, learning, approval, or completion. Indeterminate governing authority returns to its owner.
6. **One-context intent decisions** — when the user presents a candidate approach, hypothesis, plan, or design direction and asks to refine, challenge, stress-test, compare, validate, or choose it, use `grill-with-docs` if current repository evidence bears on the decision and otherwise `grill-me`. A detailed preferred proposal remains unsettled intent. Grilling returns immutable decision evidence and one Handoff for recomputation; user confirmation completes that interview artifact and is not another router approval gate.
7. **Outcome-first continuation** — when current executable authority and named acceptance are complete and any named criterion remains unmet, route to `dev-implementation`. Renewed planning, diagnosis, audit, or review is invalid unless it implements or checks a criterion, resolves a named blocker, or produces decision evidence that changes authority. An unchanged Handoff, another artifact pass, and a repeated hypothesis are not progress. If cleanup is later elected, classify a new maintenance outcome with fresh authority, acceptance, targets, attempts, and assurance. Use planless implementation only when it is bounded, cohesive, settled, and one-context; multiple owners or dependencies, fan-in, ordered effects or migration, or likely cross-context recovery require a lean repository plan. No parent repair, verification, review, completion, audit, or learning state is inherited.
8. **Validated direct stages and artifact depth** — an explicit user or external-scheduler portfolio-audit request routes to `dev-test-audit` only when its exact target and complete repository or named-subsystem suite intake is eligible. Other explicit leaf-stage requests use the existing validated direct-stage seam. Otherwise use direct implementation when technical authority and task ownership are complete, `dev-specification` only when technical authority is missing, and `dev-ticketing` only when necessary task or dependency ownership is missing from otherwise complete authority. Use Wayfinder only for item 3's route fog. Use `dev-prototype` only for a runnable/visible fidelity question owned by requirements, grilling, or specification. Use `dev-improve-codebase-architecture` only for an explicitly requested broad survey whose selected change is not yet settled.
9. **Assurance** — before classification, read `skill://dev-implementation/references/compact-checklist.md` and apply its compact disqualifiers by reference rather than duplicating them here. Select immutable `compact`, `standard`, or `high` from consequence evidence after artifact depth and before topology. Compact is the default when every referenced disqualifier is false. If any is true, select standard or high. Keep assurance independent from lifecycle depth and topology.

10. **Execution topology** — send executable authority to `dev-implementation`. By default, the route-owning agent activates that skill in place and becomes the controller; `dev-implementation` is the role, not a required new actor named Main. Planless direct work keeps the lean one-owner lane. Every approved parser-valid repository plan uses child ownership for each authored work task; the controller remains mechanical. Ordinary planned fan-in is an authored child-owned implementation task that assembles the target before its single final review and verification; it does not add `dev-integration` or pre-fan-in lineage verification to the ordinary route. A separate controller is valid only when the currently approved topology explicitly names that delegation.

After the first owner starts, generic execution recovery remains inside the
current execution owner under
`skill://dev-implementation/references/execution-recovery.md`. While acting as
`dev-ask`, the route-owning agent does not grant retries, apply the recovery
rethink, or persist cause and allowance state. Eligible recovery preserves the
approved route; a proposed authority, acceptance, ownership, target, effect, or
other material change uses the existing return and reapproval rules.

The approved implementation route also covers the `dev-implementation`
controller's awaited collection of the same child's authorized attempt-2
repair candidate, implementation-rethink Handoff in attempt 1 or 2, and return
from an already-authorized same-child execution-recovery operation. Do not
re-enter router intake or ask for human consent, attendance, supervision, or an
abort-capability inventory for those three exact role-and-purpose calls. This
does not widen authority, add a recovery allowance, or exempt Reconcile,
Retrace, or another custom collector from its own preflight.

For ordinary implementation route composition, apply these mandatory router gates in order:

1. Classify safety and whether current evidence already answers the request.
2. If an existing catalog intake predicate is true, prepend that exact owner and do not compose ordinary compact.
3. If any existing compact disqualifier is true, select standard or high and keep one independent review, one independent verification, and one learning assessment in that order.
4. Otherwise select compact. First owner is `dev-implementation`. The prospective route ends with the non-dispatchable terminal marker `completion-presentation`.
5. Implementation sizing, duration, or solution-rung choice alone does not prepend a catalog skill or raise assurance.
6. Present one owner per numbered Route line and start only the first owner after approval. Dispatch a delegated first owner; when that owner is `dev-implementation`, activate it in the route-owning agent by default.

Keep the near misses distinct: sufficient read-only evidence → direct answer; a bounded factual gap → `dev-research`; raw external tracker intake → `dev-triage`; incomplete observable acceptance without a candidate → `dev-requirements`; a hard unexplained defect → diagnosis; a known or routine fix → implementation; settled direct authority → implementation; a complete specification with known safe seams but no task graph → ticketing; a large current graph → implementation; fidelity evidence → prototype; an explicit broad survey → architecture survey; and genuine multi-context route fog → Wayfinder. `recap` remains an exact-name manual response-rewrite fallback, never an automatic workflow route.

A user-named stage is a strong preference, not a gate bypass. Validate prerequisites and add only the smallest missing prerequisite path. After evaluating the full skill catalog, apply these presentation rules in order:

1. When evidence determines one route, present only that recommended route.
2. When exactly one unknown fact changes the first owner, ask exactly one bounded gating question and stop; show no candidate routes, approval, or dispatch first.
3. When multiple facts remain unresolved, use the existing requirements, research, or human-authority owner instead of serializing them into a router interview.
4. Only when two or three materially different routes are each valid and the remaining choice is a user-owned trade-off, show exceptional candidates. Give each candidate a label, its own ordered list, and one concise trade-off sentence; mark exactly one `Recommended`, ask exactly one selection question, and do not request route approval or dispatch until selection.

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

Grilling remains limited to explicit refinement of a candidate approach, hypothesis, plan, or design direction. Breadth alone never triggers it, and the direct-answer, research, requirements, diagnosis, and implementation near misses above remain distinct.

Internally, every route binds the complete prospective owners, durable artifacts, human/effect gates, assurance profile, execution topology, and one immediate owner. Present only the compact approval contract below; do not expose stage mechanics, identity digests, or first-action metadata unless they affect the user's decision.

## Route outcomes

Choose only from:

- **Direct read-only answer** when current evidence suffices; deliver the evidence-backed answer in the same response with no approval or pre-effect identity recheck. Add an informational route only when the user requests it.
- **`dev-research`** for bounded factual lookup and cited evidence. Obtain the existing Route Overview approval before dispatch; research never decides product or engineering authority and returns to the concrete requesting route owner, whose next-owner role is `dev-ask`.
- **`dev-triage`** for explicitly requested external issue or pull-request intake. It classifies one category and state, produces an agent-ready brief when qualified, and returns to the concrete requesting route owner acting as `dev-ask`; any tracker mutation requires exact external-effect approval.
- **Product-authority route or stop** for unresolved customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success. Use `product-ask` only when the user explicitly requests the product-development workflow; otherwise return `PRODUCT AUTHORITY REQUIRED`.
- **`dev-requirements`** for incomplete observable build behavior, acceptance, scope, constraints, or owned engineering questions. Ask the user only for synthesized or materially clarified human-owned requirements, then continue through the unchanged approved route.
- **Grilling lane** for item 6's candidate-approach intent. Use `grill-me` when stateless and `grill-with-docs` when current repository evidence is decision-bearing. The iterative interview returns immutable decision evidence plus one Handoff to the concrete requesting route owner, whose next-owner role is `dev-ask`; user confirmation settles that evidence and is not a second router gate. Recompute after the evidence, but reapprove only if a named material trigger changed.
- **`dev-diagnosing-bugs`** for hard unexplained bugs or performance regressions with settled expected behavior. A valid fix contract continues through implementation under the stable route; a known or routine fix skips diagnosis.
- **`dev-improve-codebase-architecture`** for explicit survey and selection only. Return the selected candidate and constraints for route recomputation; do not silently start the refactor.
- **`dev-prototype`** only when `dev-requirements`, `dev-grilling`, or `dev-specification` needs runnable or visible fidelity. It returns disposable decision evidence to that exact owner and never folds into production.
- **Direct implementation lane** when current authority, architecture, named acceptance, and direct checks are settled and durable plan recovery is unnecessary. The route-owning agent activates `dev-implementation` in place by default; standalone invocation likewise uses the invoking agent as controller. Attempt 1 includes the implementation child's one code-then-test rethink and direct checks. Eligible execution-machinery recovery stays with the same owner under `skill://dev-implementation/references/execution-recovery.md` and neither creates a route stage nor replenishes semantic attempts. Only a required finding from the one review or the verifier may admit attempt 2; review never reruns, and the same verifier owns eligible repair closure. A disjoint outcome-relevant blocker returns `authority-change-required`; wording-only advisory cleanup requested after terminal completion is a fresh maintenance outcome.
- **Specification/ticket lane** only when its corresponding authority is missing. Start with `dev-specification` when durable technical decisions are unresolved; start with `dev-ticketing` when a complete current specification has known implementation seams but still lacks necessary task or dependency ownership. Reuse a complete specification or graph rather than regenerating it for task sizing. Faithful specifications and ticket graphs continue automatically under the current approved Route Overview unless they introduce a new human-owned decision, material trigger, or separately gated effect. Ticketing authors ordinary fan-in as a child-owned `dev-implementation` task; assembly completes before the assembled target's one final review and verification.
- **Wayfinder lane** only when the route itself is not specifiable. A resolved map returns for route recomputation and never authorizes implementation.
- **Validated direct-stage lane** for an explicit request to verify, integrate, review, audit permanent-test value, ship, curate, use TDD, or maintain domain authority. Validate that leaf's exact intake and human gates. Shipping always requires separate delivery authority.
- **Completion normalization** only from current backend and stage terminal evidence. When the approved route names the `completion-presentation` marker and material facts remain current, validate success, all completed-boundary papercut results, the one applicable learning result, residual risks, and authorized continuation. For planned work, require the current active repository plan to be `DONE`. Build exactly one current five-field `completion-presentation-input` fence and apply the presenter directly in the same agent without separate approval. The completed report is terminal and schedules no audit.
- **Explicit read-only portfolio audit** only when a user explicitly requests `dev-test-audit` against an enumerable repository or named-subsystem permanent-test scope. Before the initial Route Overview approval, show the exact scope and ordered list of every in-scope test file; launch no auditor. After approval, the manual audit uses its installed A-first protocol and grants no mutation authority. Accepted fixes require a fresh direct or planned mutation approval.

Whenever current facts determine an implementation lifecycle, the prospective `Route` must end with the assurance-specific suffix and non-dispatchable presenter marker. Compact uses `dev-implementation → completion-presentation`. Standard and high use exactly `dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation`. These are semantic owners; when implementation is reached, the route-owning agent normally activates its controller role in place while review, verification, and learning retain their independent actor boundaries. The presenter marker is never dispatched. Requirements, grilling, research, diagnosis, prototype, specification, ticketing, survey, or Wayfinder owners appear before that suffix only when an existing intake predicate is true. Implementation size or duration does not add an owner. Manual `dev-test-audit` remains a separate explicit route. A terminal advisory does not replay the approved lifecycle.

For ordinary planned fan-in, the exact standard/high prospective route is `dev-specification → dev-ticketing → dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation`. The authored implementation fan-in task assembles its child outputs before the one final review and verification. Standalone `dev-integration` remains only a validated direct-stage lane for independently verified lineages.

`direct answer` is terminal, never a lifecycle owner or a downstream segment. Research returned to the concrete requesting route owner, state-mapped triage returns—including `wontfix` to the route owner acting as `dev-ask` for terminal presentation—and any unchanged stage Handoff are stable-route continuations, not reapproval triggers.
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

For dispatchable or executable work, present exactly one `## Route overview`
before any effect. Read and follow
[packed-label](../../references/packed-label.md). This skill owns only the
field map below. Render every
human-facing prospective `Route` as an ordered list with one exact owner per
line and the exact final terminal marker `completion-presentation`; never use
an inline arrow chain, route table, or unordered list. The marker is never
dispatched and receives no task, Task Contract, Context Pack, backend attempt,
Handoff, state, transition, or approval:

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

Repeat the second route row for each actually prospective owner; the final row
is always the non-dispatchable `completion-presentation` marker. Compact
therefore has exactly two route rows.

For explicit permanent-test audit intake, the `Plan` field shows the exact audit scope and ordered list of every in-scope test file before approval. Do not launch auditor A or B until the approval reply is current.

Do not add a `Plan Summary`, `Why`, `Artifacts`, `Gates`, `Execution`, or
`First action` field. Omit diagnosis IDs, artifact inventories, target hashes,
gate machinery, and execution metadata unless one changes the user's decision.
For a material reapproval, keep the same five fields, state only the changed
decision-bearing facts, and use `Reply **approve** to continue.`

Direct read-only answers need no approval template. Answer from current
evidence in the same response; when the user explicitly requests an
informational route, use only `Goal`, `Route`, `Plan`, and `Safety` and omit
`Approval`.

## Dispatch and Handoff

Immediately before starting the first owner, reread every load-bearing artifact and capability named by the approved route. Reapprove only when current evidence changes authority, scope, acceptance, route, topology, independence, effects, capability equivalence, or another shared assumption; unrelated repository changes remain non-material.

After valid approval, start exactly one first owner. Never dispatch a batch of prospective stage owners from the router. Dispatch a delegated specialty, but activate `dev-implementation` in the route-owning agent by default. The in-place role change creates no self-Handoff.

After a delegated `dev-specification`, `dev-ticketing`, or standalone
execution-plan author returns its first substantive candidate, send
`~/.agents/references/plan-rethink.md` once as an explicit follow-up to that
same author before accepting the final Handoff or execution-ready plan. The
author may make at most one bounded correction and returns the revised or
preserved candidate through its existing procedure. A graph that newly selects
ownership or dependencies is substantive even when acceptance is projected
unchanged. Do not send this follow-up for an exact unchanged projection,
storage copy, lifecycle-only update, or unchanged approved contract. This
follow-up adds no route owner, stage, approval gate, or caller authority; if the
same author cannot receive it, stop rather than substitute another author.

`dev-implementation` is the common execution controller for approved code-changing work. The current route-owning agent activates it in place by default, including after an unchanged prerequisite return whose next-owner role is `dev-implementation`; a return whose next-owner role is `dev-ask` resumes router recomputation first. A separately delegated controller is permitted only when the approved topology already names it. That controller owns its editors, does not recursively delegate another controller, and returns across the real boundary to the concrete route owner; the outer agent does not double-schedule. Every bound controller, implementation child, and verifier identity is reused or resumed when required rather than replaced. The controller binds the direct contract or lean repository plan, dispatches each code-changing task to its child, sends the one same-child rethink after each candidate, accepts lean Handoffs with direct-check observations, and schedules assurance. It never implements or semantically repairs. Attempt 1 performs the work and rethink; one required reviewer or verifier finding may admit attempt 2. Review runs once before verification and never reruns. When verifier repair is eligible, the same verifier closes the complete unchanged check set. Disjoint outcome-relevant blockers return `authority-change-required`, authority conflicts return to their owner, and later advisory cleanup is a new outcome.

The approved Route Overview delegates downstream derivation while preserving human authority:

- **Requirements:** ask for confirmation only when the stage synthesizes, materially clarifies, or changes a human-owned observable requirement. A byte-for-byte projection or unchanged extraction continues automatically.
- **Specification:** continue automatically when it only derives technical detail inside approved requirements and architecture. Ask for the one new product, architecture, destructive/external-effect, or shipping decision if such authority is missing.
- **Ticket graph:** continue automatically when it is a faithful acyclic projection of the approved specification. Reapproval is required only when the graph exposes a material route/topology/ownership change or a separately gated effect.
- **Grilling:** the user confirms the shared decision evidence after the frontier is empty. That confirmation settles the interview artifact; it does not repeat route approval.

Each necessary prompt names the smallest current set of human-owned decisions or effects; batch independent decisions when the interview discipline applies, and state that the unchanged approved route resumes automatically afterward. Artifact count, stage transitions, audits, unchanged Handoffs, and review/verification passes never create approval gates.
Prerequisite Handoffs preserve their authored next-owner role and name the concrete bound receiver. Reaching `dev-implementation` activates the same route agent's controller unless the approved topology bound a separate controller; reaching `dev-ask` resumes the same route agent's router role. Neither unchanged continuation adds a router hop, approval, or self-Handoff.

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

No other stage return, Handoff, artifact count, audit, review, unchanged evidence, or unrelated target byte drift authorizes or requires another route approval. Capability fallback order is verified native → contract-equivalent substitute → safe disclosed contract-preserving downgrade → stop; a non-equivalent substitution is a material trigger, not an automatic fallback.

## Completion and stops

Present completion only when terminal evidence proves current authority and approvals; every task and acceptance item complete; implementer direct checks pass; every completed repository-work boundary has exactly one papercut look with its complete result set; and the selected assurance path is settled. Compact has no independent review, verifier, or learning and records `Learning: skipped for compact`. Standard and high require the one review before the one verifier and then exactly one learning assessment. An ordinary blocked learning assessment is a residual risk; only a current governing-rule conflict that makes the implementation invalid or unsafe stops completion. No unresolved authority conflict, required finding, failed dependency, or required check may remain.

For planned work, require the current active repository plan to contain its completed task and acceptance records, nonempty Completion Summary, `Completed At`, and `Status: DONE`. Keep and cite that active plan. Do not require or create an archive, manifest, digest, receipt, or archive-only locator. Direct work uses its lean Handoffs and current terminal evidence without manufacturing a plan.

After terminal evidence validates, read [the canonical completion input contract](../../references/completion-presentation-input.md) before constructing exactly one current `completion-presentation-input` fence. Follow its schema and validation rules; do not activate the presenter to discover the input grammar.

Once that single current fence exists, apply `completion-presentation` directly in this same agent and emit only its five-field report, never the fence. The presenter is not dispatched and receives no task, plan, backend attempt, Handoff, state, transition, approval, or completed Route. It does not verify, repair, settle, archive, or ship.
The in-place controller consumes accepted child and assurance returns, its own conclusions, and current plan evidence directly before terminal validation. It emits no Handoff to itself or merely to `dev-ask`; a Handoff is required only when ownership or context actually crosses to a concrete receiver.

After the report, the normal engineering route is terminal. Do not dispatch `dev-test-audit` from presentation, plan `DONE`, assurance, review, verification, or learning. A later explicit permanent-test audit is fresh validated direct-stage intake and cannot alter the completed lifecycle.

Missing, stale, duplicate, malformed, reordered, unknown, empty, placeholder, or non-success completion input emits no completed presentation. Preserve the applicable engineering stop, `wontfix`, authority-change, blocker, or shipping report instead; do not repair the input, continue semantic work, or emit a second Handoff.

Stop before dispatchable or executable work when overview approval is missing or stale. Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe or ambiguous partial effects, an evidence-backed blocker, or a disjoint outcome-relevant review defect returned as `authority-change-required`. Do not infer success from a worker Handoff, passing build alone, partial output, or unintegrated lineage. Do not restart verification, dispatch learning, approve, or complete after that authority return. Do not reopen a terminal parent for advisory cleanup; classify the explicit cleanup request as a fresh maintenance outcome.

Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.

Read [references/execution-flow.md](references/execution-flow.md) only to explain the flow to a human. It is non-runtime and subordinate to this skill and the executable stage skills.
