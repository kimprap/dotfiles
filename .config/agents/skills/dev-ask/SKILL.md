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
- the latest valid common Handoff;
- working-directory identity, explicitly referenced artifacts, live capability inventory, repository evidence, and conversation evidence.

Precedence is current explicit user intent → current approved artifacts → current Handoff → repository/conversation evidence. An explicit request that conflicts with approved authority is a change request for that authority owner, never a silent override.

Read only enough to classify. Do not mutate, dispatch, persist, create an artifact, start an external effect, or keep a route ledger before the approval required for executable or routed work.

## Classify in order

1. **Safety and requested action** — distinguish a read-only answer or investigation from mutation; surface destructive, credential, permission, and external-effect gates. Answer directly when current evidence is sufficient; use `dev-research` only for one bounded factual gap.
2. **Raw external intake** — use `dev-triage` only when the user explicitly asks to inspect or triage an external issue, pull request, or tracker intake. Project-authored tickets, Executor Plans, and current implementation graphs are already qualified and skip triage.
3. **Fog** — use `wayfinder` only when the destination or decision route cannot fit one reliable context. Large work with a current specification and implementation graph is not fog.
4. **Product authority and engineering requirements** — unresolved product strategy stops with `PRODUCT AUTHORITY REQUIRED`. Sufficient product authority with incomplete observable behavior, acceptance, engineering scope, or constraints routes to `dev-requirements`, except when item 6's candidate-approach intent is the current decision.
5. **Expected behavior** — route a hard unexplained reproducible bug or performance regression to `dev-diagnosing-bugs` only after expected behavior is settled. A known cause, routine implementation failure, or proof/review finding routes directly to bounded `dev-implementation` repair.
6. **One-context intent decisions** — when the user presents a candidate approach, hypothesis, plan, or design direction and asks to refine, challenge, stress-test, compare, validate, or choose it, use `grill-with-docs` if current repository evidence bears on the decision and otherwise `grill-me`. A detailed preferred proposal remains unsettled intent. Grilling returns immutable decision evidence and one Handoff for recomputation; user confirmation completes that interview artifact and is not another router approval gate.
7. **Outcome-first continuation** — when current executable authority and named acceptance are complete and any named criterion remains unmet, route to `dev-implementation`. Renewed planning, diagnosis, audit, or review is invalid unless it implements or proves a criterion, resolves a named blocker, or produces decision evidence that changes authority. An unchanged Handoff, another artifact or pass, and a repeated hypothesis are not progress.
8. **Artifact depth and decision support** — choose direct implementation, specification plus tickets, or Wayfinder. Use `dev-prototype` only for a runnable/visible fidelity question owned by requirements, grilling, or specification. Use `dev-improve-codebase-architecture` only for an explicitly requested broad survey whose selected change is not yet settled.
9. **Assurance** — select immutable `compact`, `standard`, or `high-consequence` from consequence evidence after artifact depth and before topology. `standard` is the fallback unless compact eligibility is fully established or a high-consequence trigger applies. Keep assurance independent from lifecycle depth and topology.
10. **Execution topology** — send executable authority to `dev-implementation`, which chooses one owner by default, a bounded independent batch, or full orchestration.

Keep the near misses distinct: sufficient read-only evidence → direct answer; a bounded factual gap → `dev-research`; raw external tracker intake → `dev-triage`; incomplete observable acceptance without a candidate → `dev-requirements`; a hard unexplained defect → diagnosis; a known or routine fix → implementation; settled direct authority → implementation; a large current graph → implementation; fidelity evidence → prototype; an explicit broad survey → architecture survey; and genuine multi-context route fog → Wayfinder. `bro` remains an exact-name manual response-rewrite fallback, never an automatic workflow route.

A user-named stage is a strong preference, not a gate bypass. Validate prerequisites and add only the smallest missing prerequisite path. If one fact changes the first owner, ask only that gating question. If materially different lifecycle routes remain, present two or three options and one recommendation. Internally, every route binds the complete prospective owners, durable artifacts, human/effect gates, assurance profile, execution topology, and one immediate owner. Present only the compact approval contract below; do not expose stage mechanics, identity digests, or first-action metadata unless they affect the user's decision.

## Route outcomes

Choose only from:

- **Direct read-only answer** when current evidence suffices; deliver the evidence-backed answer in the same response with no approval or pre-effect identity recheck. Add an informational route only when the user requests it.
- **`dev-research`** for bounded factual lookup and cited evidence; research never decides product or engineering authority and returns to its one requesting owner.
- **`dev-triage`** for explicitly requested external issue or pull-request intake. It classifies one category and state, produces an agent-ready brief when qualified, and returns to `dev-ask`; any tracker mutation requires exact external-effect approval.
- **Product-authority stop** for unresolved customers, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success.
- **`dev-requirements`** for incomplete observable build behavior, acceptance, scope, constraints, or owned engineering questions. Ask the user only for synthesized or materially clarified human-owned requirements, then continue through the unchanged approved route.
- **Grilling lane** for item 6's candidate-approach intent. Use `grill-me` when stateless and `grill-with-docs` when current repository evidence is decision-bearing. The iterative interview returns immutable decision evidence plus a common Handoff to `dev-ask`; user confirmation settles that evidence and is not a second router gate. Recompute after the evidence, but reapprove only if a named material trigger changed.
- **`dev-diagnosing-bugs`** for hard unexplained bugs or performance regressions with settled expected behavior. A valid fix contract continues through implementation under the stable route; a known or routine fix skips diagnosis.
- **`dev-improve-codebase-architecture`** for explicit survey and selection only. Return the selected candidate and constraints for route recomputation; do not silently start the refactor.
- **`dev-prototype`** only when `dev-requirements`, `dev-grilling`, or `dev-specification` needs runnable or visible fidelity. It returns disposable decision evidence to that exact owner and never folds into production.
- **Direct implementation lane** when current authority, architecture, named acceptance, and verification seams are settled and durable specification/ticket recovery is unnecessary.
- **Specification/ticket lane** when durable technical decisions, multiple owners, independent slices or fan-in, shared interfaces or migrations, recovery, or durable acceptance seams require it. Derived specifications and ticket graphs continue automatically under the current approved Route Overview unless they introduce a new human-owned decision, material trigger, or separately gated effect.
- **Wayfinder lane** only when the route itself is not specifiable. A resolved map returns for route recomputation and never authorizes implementation.
- **Validated direct-stage lane** for an explicit request to verify, integrate, review, ship, curate, use TDD, or maintain domain authority. Validate that leaf's exact intake and human gates. Shipping always requires separate delivery authority.
- **Completion presentation** only from current backend/stage terminal evidence. If the approved route already names it and material facts remain current, present it without a separate completion approval.

Whenever current facts determine an implementation lifecycle, the prospective `Route` must end with the assurance-specific suffix: standard and high-consequence use `dev-implementation → dev-verification → dev-code-review → dev-continual-learning → dev-ask completion presentation`; compact uses `dev-implementation → dev-verification → dev-code-review → [dev-continual-learning only if the post-review trigger screen qualifies] → dev-ask completion presentation`. Insert neutral `dev-integration → dev-verification` only when multiple isolated verified lineages require fan-in. Requirements, grilling, research, diagnosis, prototype, specification, ticketing, survey, or Wayfinder owners appear before that suffix only when applicable. If a decision-stage result is required before downstream ownership can be known, end the current route at its one recomputation receiver rather than inventing owners.

`direct answer` is terminal, never a lifecycle owner or a downstream segment. Research returned to the named requesting owner, state-mapped triage returns—including `wontfix` to `dev-ask` for terminal presentation—and any unchanged stage Handoff are stable-route continuations, not reapproval triggers.
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

## Compact approval presentation

For dispatchable or executable work, present exactly these standalone H2 sections before any effect:

```markdown
## Goal
  <one concise sentence>

## Route
  <exact ordered skill route>

## Plan
  <one or two concise sentences covering the observable work and assurance>

## Safety
  <only material preservation, destructive, external, credential, or shipping boundaries; otherwise `No destructive, external, or shipping effects.`>

## Approval
  Reply **approve** to start.
```

Do not add a `Plan Summary`, `Why`, `Artifacts`, `Gates`, `Execution`, or `First action` section. Omit diagnosis IDs, artifact inventories, target hashes, gate machinery, and execution metadata unless one changes the user's decision. For a material reapproval, keep the same five sections, state only the changed decision-bearing facts, and use `Reply **approve** to continue.`

Direct read-only answers need no approval template. Answer from current evidence in the same response; when the user explicitly requests an informational route, use only `Goal`, `Route`, `Plan`, and `Safety` and omit `Approval`.

## Dispatch and Handoff

Immediately before dispatch, reread every load-bearing artifact and capability identity named by the approved route. A digest change triggers semantic comparison, not automatic reapproval. Reapprove only when the changed bytes alter authority, scope, acceptance, route, topology, independence, effects, capability equivalence, or another shared assumption; an unrelated change remains non-material even when it is in the same file as an approved target.

After valid approval, dispatch exactly one first owner. Never dispatch a batch of prospective stage owners from the router.

`dev-implementation` is the common execution backend for every dispatched semantic stage, including pre-implementation and post-completion leaves. It binds approved authority into an immutable Task Contract, Context Pack when context crosses, role, attempt identity, and eligible transition without performing the leaf procedure. Each stage emits one common Handoff with `route-impact: unchanged|changed` and exactly one eligible receiver. The backend validates that return; support stages do not authorize implementation.

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

## Compact completion presentation

Present terminal evidence with the same heading-and-indented-content style. Include the resolved completed path of the approved prospective route, then only the completion sections that add decision-bearing value:

```markdown
## Route
  <exact completed skill route; omit any untriggered conditional stage>

## Result
  <observable outcome and changed behavior>

## Verification
  <fresh checks and verdict>

## Risks
  <real residual risk>

## Next
  <one required next action>
```

`Route` and `Result` are required. Include `Verification` when checks ran, `Risks` only for a material residual risk, and `Next` only when user action remains. Do not add artifact inventories, gate mechanics, or approval requests to a terminal completion.

## Completion and stops

Present completion only when terminal evidence proves current authority and approvals; task and criterion accounting; implementer smoke; required independent verification; verified fan-in and post-proof when needed; final Standards and Specification pass; curation evidence when the immutable assurance contract requires it or compact curation was triggered; no blocker, stale/partial result, semantic conflict, failed dependency, or required check; residual risk; and no required nonterminal work.

Stop before dispatchable or executable work when overview approval is missing or stale. Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe or ambiguous partial effects, or an evidence-backed blocker. Do not infer success from a worker Handoff, passing build alone, partial output, or unintegrated lineage.

Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.
