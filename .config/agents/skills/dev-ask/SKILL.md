---
name: dev-ask
description: >
  Route engineering work that needs lifecycle judgment: ambiguous, consequential, or cross-cutting
  changes; explicit planning or approval; or a requested Route Overview. Skip settled, bounded
  direct edits and read-only answers unless the user explicitly asks to route them. Keep expert skill
  requests available; never perform stage work or persist execution state.
---

# Engineering Flow

Be a thin, stateless, always-safe-to-invoke classifier and dispatcher. Own route selection, approval of executable or routed work, one first dispatch, reapproval, and engineering completion validation and normalization—not any stage procedure, run state, or final rendering.

## Evidence and precedence

Accept the current request plus bounded evidence from:

- current explicit user intent;
- current canonical approved artifacts and exact revisions;
- the latest valid common Handoff;
- working-directory identity, explicitly referenced artifacts, live capability inventory, repository evidence, and conversation evidence.

Precedence is current explicit user intent → current approved artifacts → current Handoff → repository/conversation evidence. An explicit request that conflicts with approved authority is a change request for that authority owner, never a silent override.

Read only enough to classify. Do not mutate, dispatch, persist, create an artifact, start an external effect, or keep a route ledger before the approval required for executable or routed work.

## Classify in order

1. **Safety and requested action** — distinguish a read-only answer or investigation from mutation; surface destructive, credential, permission, and external-effect gates. Answer directly when current evidence is sufficient; use `dev-research` only for one bounded factual gap.
2. **Raw external intake** — use `dev-triage` only when the user explicitly asks to inspect or triage an external issue, pull request, or tracker intake. Project-authored tickets, Executor Plans, and current implementation graphs are already qualified and skip triage.
3. **Fog** — use `wayfinder` only when the destination or decision route cannot fit one reliable context. Large work with a current specification and implementation graph is not fog.
4. **Product authority and engineering requirements** — unresolved product strategy routes to `product-ask` only when the user explicitly asks to establish or refine product authority; otherwise stop with `PRODUCT AUTHORITY REQUIRED`. Sufficient product authority with incomplete observable behavior, acceptance, engineering scope, or constraints routes to `dev-requirements`, except when item 6's candidate-approach intent is the current engineering decision.
5. **Expected behavior** — route a hard unexplained reproducible bug or performance regression to `dev-diagnosing-bugs` only after expected behavior is settled. A known cause or routine implementation failure routes directly to bounded `dev-implementation` repair. After the first current-target review, continue same-outcome repair only for incomplete closure of an existing finding lineage or a repair-caused new lineage with direct evidence from the exact repaired revision, changed bytes or contract delta, accepted impact-map edge, observable failure path, and fresh affected proof. A changed hypothesis alone cannot admit a finding. A disjoint non-outcome observation is a terminal advisory; independently serious safety returns separate-authority intake; a disjoint outcome-relevant non-safety defect remains `CHANGES REQUIRED` and returns `authority-change-required` to the outcome authority without silent same-outcome repair, verification restart, learning, approval, or completion. Indeterminate governing authority returns to its owner.
6. **One-context intent decisions** — when the user presents a candidate approach, hypothesis, plan, or design direction and asks to refine, challenge, stress-test, compare, validate, or choose it, use `grill-with-docs` if current repository evidence bears on the decision and otherwise `grill-me`. A detailed preferred proposal remains unsettled intent. Grilling returns immutable decision evidence and one Handoff for recomputation; user confirmation completes that interview artifact and is not another router approval gate.
7. **Outcome-first continuation** — when current executable authority and named acceptance are complete and any named criterion remains unmet, route to `dev-implementation`. Renewed planning, diagnosis, audit, or review is invalid unless it implements or proves a criterion, resolves a named blocker, or produces decision evidence that changes authority. An unchanged Handoff, another artifact or pass, and a repeated hypothesis are not progress. If cleanup is later elected, dev-ask classifies a new maintenance outcome with fresh authority, acceptance, Task Contract, target, attempts, and assurance; no parent repair, verification, review, or learning state is inherited.
8. **Artifact depth and decision support** — choose direct implementation, specification plus tickets, or Wayfinder. Use `dev-prototype` only for a runnable/visible fidelity question owned by requirements, grilling, or specification. Use `dev-improve-codebase-architecture` only for an explicitly requested broad survey whose selected change is not yet settled.
9. **Assurance** — select immutable `compact`, `standard`, or `high-consequence` from consequence evidence after artifact depth and before topology. Compact is the default when every existing compact disqualifier is false. If any disqualifier is true, select standard or high-consequence. Keep assurance independent from lifecycle depth and topology.

The existence, absence, age, or complexity of a repository surface-verification adapter is not consequence evidence and never changes assurance, lifecycle depth, topology, or the catalog owner. Ordinary setup, implementation, testing, verification, and review prompts do not discover, create, or maintain one. Only an already-frozen recipe may load its exact adapter; exact manual wrapper invocation remains outside ordinary route composition.
10. **Execution topology** — send executable authority to `dev-implementation`. Planless direct work keeps the lean one-owner same-context lane. Every approved parser-valid implementation plan uses full orchestration with `downgrade: none`; the implementation root is a mechanical control plane and dispatches every authored work owner as a child.

For ordinary implementation route composition, apply these mandatory router gates in order:

1. Classify safety and whether current evidence already answers the request.
2. If an existing catalog intake predicate is true, prepend that exact owner and do not compose ordinary compact.
3. If any existing compact disqualifier is true, select standard or high-consequence and keep independent verification, review, and required learning.
4. Otherwise select compact. First owner is `dev-implementation`. The prospective route ends with the non-dispatchable terminal marker `completion-presentation`.
5. Implementation size, duration, or solution-rung choice alone does not prepend a catalog skill and does not raise assurance.
6. Present one owner per numbered Route line and dispatch only the first owner after approval.

Keep the near misses distinct: sufficient read-only evidence → direct answer; a bounded factual gap → `dev-research`; raw external tracker intake → `dev-triage`; incomplete observable acceptance without a candidate → `dev-requirements`; a hard unexplained defect → diagnosis; a known or routine fix → implementation; settled direct authority → implementation; a large current graph → implementation; fidelity evidence → prototype; an explicit broad survey → architecture survey; and genuine multi-context route fog → Wayfinder. `recap` remains an exact-name manual response-rewrite fallback, never an automatic workflow route.

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
- **`dev-research`** for bounded factual lookup and cited evidence; research never decides product or engineering authority and returns to its one requesting owner.
- **`dev-triage`** for explicitly requested external issue or pull-request intake. It classifies one category and state, produces an agent-ready brief when qualified, and returns to `dev-ask`; any tracker mutation requires exact external-effect approval.
- **Product-authority route or stop** for unresolved customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success. Use `product-ask` only when the user explicitly requests the product-development workflow; otherwise return `PRODUCT AUTHORITY REQUIRED`.
- **`dev-requirements`** for incomplete observable build behavior, acceptance, scope, constraints, or owned engineering questions. Ask the user only for synthesized or materially clarified human-owned requirements, then continue through the unchanged approved route.
- **Grilling lane** for item 6's candidate-approach intent. Use `grill-me` when stateless and `grill-with-docs` when current repository evidence is decision-bearing. The iterative interview returns immutable decision evidence plus a common Handoff to `dev-ask`; user confirmation settles that evidence and is not a second router gate. Recompute after the evidence, but reapprove only if a named material trigger changed.
- **`dev-diagnosing-bugs`** for hard unexplained bugs or performance regressions with settled expected behavior. A valid fix contract continues through implementation under the stable route; a known or routine fix skips diagnosis.
- **`dev-improve-codebase-architecture`** for explicit survey and selection only. Return the selected candidate and constraints for route recomputation; do not silently start the refactor.
- **`dev-prototype`** only when `dev-requirements`, `dev-grilling`, or `dev-specification` needs runnable or visible fidelity. It returns disposable decision evidence to that exact owner and never folds into production.
- **Direct implementation lane** when current authority, architecture, named acceptance, and verification seams are settled and durable specification/ticket recovery is unnecessary. Before original-initial review, eligible directly evidenced blockers may enter the one bounded repair. After it, only incomplete closure of a sealed finding lineage or a directly evidenced repair-caused regression may continue same-outcome repair. A disjoint outcome-relevant blocker returns `authority-change-required`; wording-only advisory cleanup requested after terminal completion enters this lane only as a fresh maintenance outcome with fresh authority and state.
- **Specification/ticket lane** when durable technical decisions, multiple owners, independent slices or fan-in, shared interfaces or migrations, recovery, or durable acceptance seams require it. Derived specifications and ticket graphs continue automatically under the current approved Route Overview unless they introduce a new human-owned decision, material trigger, or separately gated effect.
- **Wayfinder lane** only when the route itself is not specifiable. A resolved map returns for route recomputation and never authorizes implementation.
- **Validated direct-stage lane** for an explicit request to verify, integrate, review, ship, curate, use TDD, or maintain domain authority. Validate that leaf's exact intake and human gates. Shipping always requires separate delivery authority.
- **Completion normalization** only from current backend/stage terminal evidence. If the approved route already names the `completion-presentation` marker and material facts remain current, validate completion, settlement, filled fields, durability, constraints, and continuation authority; build exactly one current `completion-presentation-input` fence; then apply the presenter directly in the same agent without a separate completion approval.
- **Post-plan read-only test audit** only after an implementation plan is `DONE` through its normal verification, review, learning, and completion gates. Route `dev-test-audit` in the same top-level session against that immutable completed target, accept either its two-opinion Common Handoff or precise `transport-unavailable`, and stop. The audit is not an implementation task or completion gate, never reopens the plan, runs no worker closure, mutates no test, and authorizes no cleanup.

Whenever current facts determine an implementation lifecycle, the prospective `Route` must end with the assurance-specific suffix and non-dispatchable presenter marker. Compact uses `dev-implementation` then `completion-presentation`; the latter is the marker, not a dispatchable owner. Standard and high-consequence use `dev-implementation → dev-verification → dev-code-review → dev-continual-learning → completion-presentation`, where the last segment is likewise only the marker. Insert neutral `dev-integration → dev-verification` only when multiple isolated verified lineages require fan-in. Requirements, grilling, research, diagnosis, prototype, specification, ticketing, survey, or Wayfinder owners appear before that suffix only when an existing intake predicate is true. Implementation size, duration, or solution-rung choice does not add an owner. A terminal advisory does not alter or replay the approved Route; elected cleanup is a new classified maintenance outcome.

`direct answer` is terminal, never a lifecycle owner or a downstream segment. Research returned to the named requesting owner, state-mapped triage returns—including `wontfix` to `dev-ask` for terminal presentation—and any unchanged stage Handoff are stable-route continuations, not reapproval triggers.
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

For dispatchable or executable work, present exactly these standalone H2 sections before any effect. Render every human-facing prospective `Route` as an ordered list with one exact owner per line and the exact final terminal marker `completion-presentation`; never use an inline arrow chain, route table, or unordered list. The marker is never dispatched and receives no task, Task Contract, Context Pack, backend attempt, Handoff, state, transition, or approval:

```markdown
## Goal
  <one concise sentence>

## Route
1. `<first owner>`
2. `<next owner or completion-presentation>`

## Plan
  <one or two concise sentences covering the observable work and assurance>

## Safety
  <only material preservation, destructive, external, credential, or shipping boundaries; otherwise `No destructive, external, or shipping effects.`>

## Approval
  Reply **approve** to start.
```
Repeat the second route row for each actually prospective owner; the final row is always the non-dispatchable `completion-presentation` marker. Compact therefore has exactly two route rows.

Do not add a `Plan Summary`, `Why`, `Artifacts`, `Gates`, `Execution`, or `First action` section. Omit diagnosis IDs, artifact inventories, target hashes, gate machinery, and execution metadata unless one changes the user's decision. For a material reapproval, keep the same five sections, state only the changed decision-bearing facts, and use `Reply **approve** to continue.`

Direct read-only answers need no approval template. Answer from current evidence in the same response; when the user explicitly requests an informational route, use only `Goal`, `Route`, `Plan`, and `Safety` and omit `Approval`.

## Dispatch and Handoff

Immediately before dispatch, reread every load-bearing artifact and capability identity named by the approved route. A digest change triggers semantic comparison, not automatic reapproval. Reapprove only when the changed bytes alter authority, scope, acceptance, route, topology, independence, effects, capability equivalence, or another shared assumption; an unrelated change remains non-material even when it is in the same file as an approved target.

After valid approval, dispatch exactly one first owner. Never dispatch a batch of prospective stage owners from the router.

`dev-implementation` is the common execution backend for every dispatched semantic stage. It binds approved authority into an immutable Task Contract, role, attempt identity, and eligible transition without performing a leaf procedure. Planless same-context compact binds that Task Contract directly and adds a Context Pack only when context crosses. Every parser-valid implementation plan instead uses the plan-backed full/no-downgrade gate, bounded Context Packs, and fresh child ownership for every authored work task; the root remains mechanical. Each attempt emits one Common Handoff with `route-impact: unchanged|changed` and exactly one eligible receiver. The backend checks plan-child Handoffs mechanically, not semantically. One directly evidenced verifier or reviewer blocker may consume the single run-wide repair token; after repair, only incomplete closure of an existing lineage or a directly evidenced repair-caused regression may continue. Disjoint non-outcome observations are advisory, independently serious safety is separate intake, disjoint outcome-relevant blockers return `authority-change-required`, and authority conflicts return to their owner. Later advisory cleanup requires fresh maintenance authority and state.

The approved Route Overview delegates downstream derivation while preserving human authority:

- **Requirements:** ask for confirmation only when the stage synthesizes, materially clarifies, or changes a human-owned observable requirement. A byte-for-byte projection or unchanged extraction continues automatically.
- **Specification:** continue automatically when it only derives technical detail inside approved requirements and architecture. Ask for the one new product, architecture, destructive/external-effect, or shipping decision if such authority is missing.
- **Ticket graph:** continue automatically when it is a faithful acyclic projection of the approved specification. Reapproval is required only when the graph exposes a material route/topology/ownership change or a separately gated effect.
- **Grilling:** the user confirms the shared decision evidence after the frontier is empty. That confirmation settles the interview artifact; it does not repeat route approval.

Each necessary prompt names the smallest current set of human-owned decisions or effects; batch independent decisions when the interview discipline applies, and state that the unchanged approved route resumes automatically afterward. Artifact count, stage transitions, audits, unchanged Handoffs, and review/verification passes never create approval gates.

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

Present completion only when terminal evidence proves current authority and approvals; task and criterion accounting; criterion-complete implementer smoke; any profile- or topology-required independent verification, verified fan-in, final Standards and Specification review, and noncompact curation; no blocker, authority conflict, disjoint outcome-relevant finding, stale/partial result, semantic conflict, failed dependency, or required check; terminal advisories recorded as residual risk; and no required nonterminal work. Advisory-only approval completes after the route's one terminal Standard assessment without assurance replay. Compact terminal evidence contains the exact acceptance-to-smoke map and no verification, review, or continual-learning dispatch.

After that evidence validates and all work-Handoff papercut accounting and learning results settle, validate the twelve terminal values and construct exactly one current fenced `completion-presentation-input` JSON object with keys in this exact order: `status`, `outcome`, `change_scope`, `key_artifacts`, `verification`, `papercuts`, `learning`, `residual_risk`, `resume_from`, `handoff`, `constraints`, `next`. Status is exactly `completed`. Change scope is an ordered array of one to three concise aggregate scope statements; Key artifacts is an ordered array of one to three durable openable entry points. Keep exhaustive changed-path inventory in the exact target manifest and/or existing Handoff. Verification has a named check, terminal verdict, and fetchable evidence locator plus immutable revision or digest. Papercuts is the ordered array of material existing papercut results retained in deterministic work-Handoff order; none-only accounting yields `[]`. The legacy `changed` key, legacy singular papercut key, and scalar list values are invalid. Learning preserves `skipped — compact assurance`, `NO DURABLE LEARNING — ...`, or `CURATED — ...` exactly. Residual risk is current material uncertainty or `none`. Resume from points to an openable durable Completion Summary plus immutable revision or digest and `#completion-summary`; before normalization, validate that the summary records the completed outcome, material decisions, immutable evidence identities, current residual risk, and exact target manifest reference. Planned work uses the current parser-valid terminal repository plan Completion Summary at its durable active or archive locator, bound to the plan's exact bytes; compact uses an already-produced qualifying durable summary and never manufactures a plan or persistence layer. Handoff is the existing portable immutable Common Handoff locator, exact `in-conversation (see Resume from)`, or the approved full-digest in-conversation form tied to Resume from. Constraints contains `shipping not authorized` exactly once and may contain current caller-supplied boundaries. Local engineering Next is exactly `none`.

Once that single current fence exists, apply `completion-presentation` directly in this same agent and emit only its report, never the fence. The presenter is not dispatched and receives no task, Task Contract, Context Pack, backend attempt, Handoff, state, transition, approval, or completed Route. It creates no evidence rerun, plan, workflow, Handoff, or shipping effect.

After a plan's normal terminal state is sealed as `DONE`, invoke the separately routed read-only `dev-test-audit` in the same top-level session against that immutable target, then stop with its Handoff or precise `transport-unavailable`. This post-plan call does not alter completion, run worker closure, schedule assurance repair, authorize mutation, or delay the already completed plan.

Missing, stale, prior-turn, duplicate, malformed, reordered, unknown/duplicate/missing-key, empty, placeholder, scope- or artifact-cardinality, legacy-`changed`, durability-invalid, Completion-Summary-invalid, constraint-invalid, unauthorized-Next, non-`completed`, learning-`BLOCKED`, or otherwise conflicting input emits no completed presentation. Preserve the applicable engineering stop, `wontfix`, authority-change, blocker, or shipping report instead.

Stop before dispatchable or executable work when overview approval is missing or stale. Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe or ambiguous partial effects, an evidence-backed blocker, or a disjoint outcome-relevant review defect returned as `authority-change-required`. Do not infer success from a worker Handoff, passing build alone, partial output, or unintegrated lineage. Do not restart verification, dispatch learning, approve, or complete after that authority return. Do not reopen a terminal parent for advisory cleanup; classify the explicit cleanup request as a fresh maintenance outcome.

Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.
