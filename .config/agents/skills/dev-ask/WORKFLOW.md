# Engineering Flow

## Human overview

This workflow carries a current engineering request or approved product authority through the smallest safe route to a locally complete result. It guarantees one thin stateless router, one stable route approval, targeted human confirmation only for newly created decisions or separately gated effects, one semantic owner per responsibility, stable human authority, immutable assurance, outcome-based continuation, worker smoke, fresh proof at useful boundaries, one final review, bounded repair, terminal learning when required or triggered, and no implied shipping.

Common routes are:

- sufficient current evidence → direct read-only answer;
- explicit raw external issue or pull-request intake → `dev-triage` → route recomputation;
- incomplete observable behavior or acceptance under settled product authority → `dev-requirements`;
- a candidate plan, hypothesis, or design requested for refinement → `grill-with-docs` when repository evidence is decision-bearing, otherwise `grill-me`;
- settled direct authority or a known/routine fix → `dev-implementation`;
- durable technical decisions → `dev-specification`, then `dev-ticketing` only when graph/recovery, multiple owners, or fan-in warrants it;
- a hard unexplained reproducible defect → `dev-diagnosing-bugs`;
- genuine multi-context route fog → `wayfinder` → `dev-ask` recomputation; and
- separately authorized delivery → `dev-shipping`.

Initial route approval authorizes the named prospective route. Downstream artifacts do not create approval gates merely because they exist: requirements request confirmation only for synthesized or materially clarified human-owned behavior; specifications and ticket graphs continue automatically when they faithfully derive current authority; grilling ends with confirmation of shared decision evidence. Reapprove only for a material change in authority, route, scope, acceptance, topology/independence, effects, shipping, shared assumptions, or equivalent capability. `bro` remains an exact-name manual response rewrite, never an automatic route.


Durable workflow decisions and supersession links are indexed in [`docs/adr/INDEX.md`](../../../../docs/adr/INDEX.md); active ADRs carry rationale and rejected alternatives, superseded or rejected records are history rather than executable authority, and this file remains the concise current-behavior reference.

## Engine reference

Classification uses current intent, authority, evidence, consequence, lifecycle state, and capability facts—not keywords alone—and stops at the first matching predicate:

| Observable state | Initial owner | Invalid substitute | Return boundary |
|---|---|---|---|
| Current evidence fully answers a read-only question | Direct answer | Grilling, requirements, implementation | Evidence-backed answer; no approval |
| One bounded factual engineering question needs new evidence | `dev-research` | Product decisions or planning by research | Research Evidence to exactly one requesting owner |
| Raw external issue or pull-request intake is explicitly requested | `dev-triage` | Mandatory triage for project-authored tickets or plans; immediate implementation | Category/state, evidence, optional agent-ready brief, and one state-mapped Common Handoff; `ready-for-agent` returns to `dev-ask` for route composition and `wontfix` returns to `dev-ask` for terminal presentation; tracker mutations require exact external-effect approval |
| Product behavior, priority, or strategy authority is missing | Human product owner | Requirements, specification, or research deciding policy | `PRODUCT AUTHORITY REQUIRED` |
| Product authority exists but observable behavior, scope, constraints, or acceptance are incomplete and no candidate is being refined | `dev-requirements` | Grilling by default; implementation | Current requirements with confirmation only for synthesized/materially clarified human-owned behavior, then unchanged route continuation |
| A candidate approach, hypothesis, plan, or design direction is unsettled and the user asks to refine, challenge, compare, or validate it | `grill-with-docs` with decision-bearing repository evidence; otherwise `grill-me` | Factual lookup, missing-requirements intake, settled edits | User-confirmed immutable decision evidence and Handoff to one requesting owner |
| A hard unexplained reproducible bug or performance regression has settled expected behavior | `dev-diagnosing-bugs` | Feature work, known cause, routine proof failure | One fix contract, blocker, or architecture finding |
| Cause and bounded fix are established, including routine worker, verifier, or reviewer defects | `dev-implementation` repair | Diagnosis or renewed planning without an authority gap | Same outcome with inherited convergence state |
| A runnable logic, state, or UI artifact is needed to answer one design question | `dev-prototype` | Production implementation or prototype-as-final | Disposable evidence to requirements, grilling, or specification owner |
| The user explicitly requests a broad architecture survey and no exact change is approved | `dev-improve-codebase-architecture` | Ordinary refactor, review, or implementation | Selected candidate and constraints to `dev-ask` |
| Complete one-context implementation authority is current | `dev-implementation`, one owner by default | Requirements, specification, ticketing, Wayfinder | Smoke → boundary proof → final review → required or triggered learning → completion |
| Durable multi-context technical decisions remain | `dev-specification`; `dev-ticketing` only when graph/recovery/fan-in warrants it | Direct implementation before authority is complete | Faithful derivatives continue through the stable prospective route |
| Destination or decision route cannot fit one reliable context | `wayfinder` | Large but specified work; implementation inside the map | Resolved decision map to `dev-ask`; no build work |
| An exact current implementation graph is large | `dev-implementation` under the approved topology | Wayfinder or recursive replanning | Ready-frontier execution |
| Local terminal evidence is current | `dev-ask` completion presentation | New approval, replayed lifecycle, inferred shipping | Terminal report only |
| A human separately authorizes delivery | `dev-shipping` | Inference from local completion | Delivery and rollback evidence |

Each procedure has one owner: `dev-ask` classifies and approves; triage qualifies raw external intake; requirements own observable policy; specification owns durable technical design; ticketing owns the derivative graph; `dev-implementation` owns execution and state; workers mutate and smoke; verification proves; integration neutrally combines every named verified isolated lineage; review judges one exact final verified target; continual learning curates only its bounded project-owned surface; shipping alone delivers. Plans, tickets, todos, Context Packs, and Handoffs project authority and never create it.

A semantic pass advances only when it implements or proves a named acceptance criterion, resolves a named blocker, changes approved authority, scope, acceptance, topology, effects, route, or next owner through authorized decision evidence, or materially changes an authorized diagnostic hypothesis/evidence frontier. A terminal budget-consuming blocker is a bounded stop. Planning prose, another audit or review, elapsed time, agent/artifact count, an unchanged Handoff, or a repeated hypothesis is not progress and cannot authorize another attempt or wave.

Approval is required before dispatchable or executable work. Present exactly five compact sections: `Goal`, `Route`, `Plan`, `Safety`, and `Approval`; ask for **approve**. Do not expose a separate why, artifact inventory, gate list, execution mode, first action, target hash, or internal mechanics unless it changes the user's decision.

Immediately before dispatch, reread load-bearing artifact and capability identities. Digest drift triggers semantic comparison, not automatic reapproval: only changed load-bearing route facts invalidate approval, while unrelated bytes remain non-material even in the same target file.

Terminal presentation uses the exact completed `Route`, then `Result` and only relevant `Verification`, `Risks`, or `Next` H2 sections. It never repeats internal artifact inventory, gate mechanics, or an approval request.

When current facts determine an implementation lifecycle, compose the prospective tail by assurance profile. Standard and high-consequence use `dev-implementation → dev-verification → dev-code-review → dev-continual-learning → dev-ask completion presentation`; compact uses `dev-implementation → dev-verification → dev-code-review → [dev-continual-learning only if the post-review trigger screen qualifies] → dev-ask completion presentation`. Insert `dev-integration → dev-verification` only after at least two exact isolated lineages are independently verified and require neutral fan-in. Prepend only actually required authority, decision, research, diagnosis, prototype, specification, ticketing, survey, or Wayfinder work. Terminal presentation resolves the approved conditional branch to the exact completed skill route and omits an untriggered learning stage. Dispatch exactly one immediate owner.

The todo view is a deterministic, non-authoritative projection of equivalent route facts. Render only applicable work under these exact phase names:

1. **Authority / Design** — required authority, intake qualification, decision, specification, or implementation-graph work.
2. **Build** — vertical Task Contracts bound to stable `AC-...` IDs.
3. **Assurance** — smoke, fresh verification, neutral fan-in when required, final review, and one bounded repair if eligible.
4. **Completion** — terminal criterion/evidence accounting and `dev-ask` presentation only; it cannot imply missing proof.

`dev-ask` selects the route and dispatches one first owner. `dev-implementation` is the single execution backend for every semantic stage. It validates intake, binds a Task Contract and Context Pack when needed, chooses topology, records attempts/runtime state, and validates one common Handoff per stage. `dev-triage`, `dev-requirements`, `dev-grilling`, `dev-diagnosing-bugs`, `dev-specification`, `dev-ticketing`, `dev-prototype`, `dev-research`, `dev-verification`, `dev-integration`, `dev-code-review`, `dev-continual-learning`, and `dev-shipping` remain semantic procedure owners, never alternate backends. Backend state projects deterministically into the four phases above; triage states map into `Authority / Design` readiness and never create another phase. Stage returns continue to the exact named receiver and do not loop through `dev-ask` when the route remains unchanged.

Diagnosis is for one hard unexplained defect, never a routine known-cause repair or unchanged re-entry. Every task and semantic attempt receives exact-revision worker smoke. Fresh independent verification occurs at declared consumable isolated-lineage, integrated, final single-lineage, and explicit high-consequence boundaries—not between sequential tasks merely because another task follows. Integration accepts all and only exact verified isolated lineages and never chooses a semantic winner. Review receives only the exact final verified target, runs once, and never repairs.

The parent outcome inherits at most one post-assurance repair token. Aggregate every available blocking criterion or finding once; authorize one consolidated owner repair only when the token is unused; rerun impacted smoke and proof, then the first eligible review or sole review rerun. A remaining blocker, inconclusive proof, repeated frontier, unchanged hypothesis, exhausted three-attempt task budget, consumed repair token, or consumed review rerun stops without a second repair, fourth attempt, diagnosis re-entry, planning reset, or lifecycle reset.

Standard assurance ends with one neutral affected-artifact learning assessment; compact dispatches learning only after its qualifying trigger screen; Deep maintenance requires explicit human authority or settled recurring, cross-contract, stale/conflicting-canonical, or severe-systemic evidence and is a separate route by default. Counts, calendars, background mining, and user-level mutation never trigger it. Shipping is never part of local completion and requires separate exact human authorization.

## Skill catalog

- [`dev-ask`](SKILL.md) — sole thin router, compact route approval/reapproval, first dispatch, and completion presentation.
- [`dev-triage`](../dev-triage/SKILL.md) — optional raw external issue/PR classification and agent-ready intake.
- [`dev-requirements`](../dev-requirements/SKILL.md) — observable behavior, acceptance, scope, constraints, and compatibility/failure policy.
- [`dev-research`](../dev-research/SKILL.md) — bounded cited factual evidence for one requesting owner.
- [`dev-grilling`](../dev-grilling/SKILL.md) — iterative rounds of complete current decision frontiers until shared understanding or a named blocker.
- [`dev-prototype`](../dev-prototype/SKILL.md) — approved disposable runnable or visual decision evidence.
- [`dev-specification`](../dev-specification/SKILL.md) — durable technical design, interfaces, migrations, operations, and test seams.
- [`dev-ticketing`](../dev-ticketing/SKILL.md) — minimum acyclic vertical implementation graph when graph/recovery/fan-in warrants it.
- [`dev-implementation`](../dev-implementation/SKILL.md) — Task Contracts, Context Packs, topology, attempts, smoke, assurance scheduling, repair, and completion accounting.
- [`dev-diagnosing-bugs`](../dev-diagnosing-bugs/SKILL.md) — one bounded hard-defect diagnosis returning a fix contract, blocker, or architecture finding.
- [`dev-verification`](../dev-verification/SKILL.md) — fresh read-only criterion proof at declared immutable boundaries.
- [`dev-integration`](../dev-integration/SKILL.md) — neutral fan-in of every named exact verified isolated lineage.
- [`dev-code-review`](../dev-code-review/SKILL.md) — one final read-only Standards and Specification verdict.
- [`dev-continual-learning`](../dev-continual-learning/SKILL.md) — terminal Standard assessment or separately authorized Deep maintenance.
- [`dev-handoff`](../dev-handoff/SKILL.md) — the one revision-bound result and recovery envelope for every attempt.
- [`dev-shipping`](../dev-shipping/SKILL.md) — separately authorized delivery, complete-check, rollout, and rollback evidence.
- [`dev-domain-modeling`](../dev-domain-modeling/SKILL.md) — canonical terms and exact human-confirmed durable domain/ADR writes; a support discipline, not a route stage.
- [`dev-codebase-design`](../dev-codebase-design/SKILL.md) — deep-module interface vocabulary and design discipline, not an automatic lifecycle stage.
- [`dev-tdd`](../dev-tdd/SKILL.md) — explicitly requested test-first method inside an approved implementation task.
- [`grill-me`](../grill-me/SKILL.md) — thin stateless adapter to `dev-grilling` without repository evidence.
- [`grill-with-docs`](../grill-with-docs/SKILL.md) — thin repository-evidence adapter to `dev-grilling`; domain writes remain human-gated by `dev-domain-modeling`.
- [`dev-improve-codebase-architecture`](../dev-improve-codebase-architecture/SKILL.md) — explicit visual architecture survey and selected-candidate interview.
- [`wayfinder`](../wayfinder/SKILL.md) — explicit multi-session decision map for genuine route fog, never implementation state.

## Maintenance guidance

- `dev-research`: bounded cited evidence for one owner; no product or implementation authority.
- `dev-triage`: optional raw external issue/PR intake, one category/state, evidence, and an agent-ready brief; no implementation or ungated tracker mutation.
- `dev-requirements`: observable engineering behavior, acceptance, scope, constraints, and owned questions with targeted confirmation for synthesized or materially clarified human-owned requirements.
- `dev-diagnosing-bugs`: hard unexplained bug/performance diagnosis with reproducible evidence; no production mutation.
- `dev-specification`: current technical design, interfaces, migration/rollback, operations, and test seams; faithful derivation continues automatically.
- `dev-ticketing`: acyclic vertical ticket graph and criterion accounting when graph/recovery/fan-in warrants it; a faithful graph continues automatically without a graph-completion gate.
- `dev-prototype`: disposable decision evidence returned to requirements, grilling, or specification.
- `dev-domain-modeling`: only writer/qualifier for canonical domain terms and qualifying decisions, with exact human confirmation.
- `dev-verification`, `dev-integration`, `dev-code-review`, `dev-continual-learning`, `dev-shipping`: bounded proof, fan-in, final review, curation, and separately authorized delivery roles.
- `grill-me`, `grill-with-docs`: wrappers over `dev-grilling`'s iterative batched-frontier interview; the documented wrapper may use `dev-domain-modeling`.

## Sources

The design takes bounded inspiration from [Cursor's agent-swarm account](https://cursor.com/blog/agent-swarm-model-economics) for explicit ownership and parent-held intent, [Anthropic's migration workflow](https://claude.com/blog/ai-code-migration) for dependency structure and cheap early feedback, [Matt Pocock's composable engineering skills](https://github.com/mattpocock/skills/tree/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering) for reusable contracts, iterative grilling, and optional triage intake, and [PostHog's skill-authoring guidance](https://posthog.com/handbook/engineering/ai/writing-skills) for narrow reusable contracts and near-miss validation. Sources are advisory only; current local skills and ADRs are authoritative.
