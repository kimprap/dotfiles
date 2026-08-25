# Dev workflow authority and routing

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-25
**Decision IDs:** D01, D02, D05, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D26

## Scope

This decision governs the generic engineering workflow's durable authority, route classification, approval/reapproval, interview completion boundary, optional external-intake triage, route recommendation and presentation contract, ownership boundaries, cutover discipline, and delivery boundary. It applies to `dev-ask`, the lifecycle skills and adapters that return to it, the current `WORKFLOW.md`, active workflow ADRs, and repository discovery. It does not grant authority to change product behavior, executable skills, rules, or delivery state.

## Context / problem

The workflow needs one current route and one durable explanation of why its boundaries exist. A route can otherwise accumulate duplicate routers, stage-by-stage approvals, serialized interviews, hidden execution state, mandatory intake ceremony, choice theatre, or implicit authority to make product, architecture, destructive, or shipping decisions. Current behavior also needs a clean distinction between concise executable guidance, durable rationale, and advisory research. Without that distinction, a future maintainer can mistake a plan, memory, Atlas note, todo, Handoff, transcript, or stale record for authority.

## Decisions

### D01 — Durable decision authority

- **Scope:** Generic engineering workflow ADR storage, registry, and supersession.
- **Decision:** Use focused ADRs under `docs/adr/` with one stable `docs/adr/INDEX.md`. The index registers active records and their supersession links. ADRs preserve adopted decisions and rejected alternatives; they are not a queue, runtime ledger, or attempt history.
- **Why:** Focused records keep unrelated concerns, ownership, and supersession clear while preserving rationale outside concise executable guidance.
- **Rejected alternatives / why not:** One ever-growing decision register mixes unrelated scope and blurs focused ownership and supersession. Embedding rationale or history in `WORKFLOW.md` turns current guidance into an archive. Plans, memory, Atlas, todos, Handoffs, and transcripts are proposals, projections, research, or transfer evidence that can be stale or instance-specific, so they are not normative authority.
- **Consequences:** The ADR index and active ADRs are durable documentation authority, not execution state. Rejected and superseded records remain discoverable history but never execute.
- **Reopen when:** ADR storage, the stable registry, focused ownership, status, or supersession semantics change.

### D02 — Approval model

- **Scope:** `dev-ask` route approval, downstream continuation, and material reapproval.
- **Decision:** Approve one stable compact prospective Route. The initial approval authorizes that named route. Requirements request targeted confirmation only for synthesized or materially clarified human-owned behavior; a specification or ticket graph that faithfully derives current authority continues automatically. A stage return, artifact completion, audit, or review does not require another approval. Digest drift triggers semantic comparison rather than automatic reapproval: changed bytes are non-material when they do not alter authority, scope, acceptance, route, topology, proof or independence, destructive or external effects, shipping, a shared assumption, or equivalent capability.
- **Why:** Unchanged work should progress against the stable outcome without ceremonial approval, while every newly exposed human-owned or materially changed fact remains gated.
- **Rejected alternatives / why not:** Reapproving every stage return or derivative artifact adds waiting without changing authority. Letting initial approval silently cover later material product, architecture, scope, acceptance, destructive, external-effect, or shipping decisions infers authority the human did not grant. Treating every byte change as material mistakes identity drift for semantic drift.
- **Consequences:** The current route and outcome remain stable until a named material trigger changes them. Human prompts correspond to new human-owned decisions or external effects, not stage or artifact count.
- **Reopen when:** The stable-route approval model, targeted confirmation boundary, semantic drift test, or list of material route facts changes.

### D05 — Grilling bound

- **Scope:** `dev-grilling` applicability and the composition of each decision frontier.
- **Decision:** Ask the whole current load-bearing decision frontier in each round. Use grilling for explicit candidate, plan, hypothesis, or design refinement; route ordinary ambiguity, missing requirements, factual lookup, and settled direct edits to their applicable owners instead.
- **Why:** Complete-frontier questions reduce avoidable latency while near-miss routing keeps requirements, research, and implementation responsibilities with their existing owners.
- **Rejected alternatives / why not:** One-question-at-a-time interviews serialize decisions unnecessarily. Routing ordinary ambiguity, factual lookup, incomplete requirements, or settled edits to grilling duplicates owners that already handle those cases. Grilling every change is blanket ceremony rather than intent-driven refinement.
- **Consequences:** Each round exposes the full currently known decision surface, and non-grilling work does not acquire an interview stage merely because some ambiguity exists.
- **Reopen when:** Grilling's qualifying intent, near-miss owners, or complete-frontier composition changes.

### D10 — Sole thin, stateless router

- **Scope:** External generic engineering route classification and lifecycle dispatch.
- **Decision:** Keep `dev-ask` the sole thin, stateless external router. It classifies from intent, authority, evidence, consequence, and lifecycle facts; dispatches the applicable owner; handles material reapproval; and presents completion. It owns no baton ledger, workflow state machine, execution state, or competing routing policy.
- **Why:** One semantic router prevents contradictory lifecycle authority and keeps runtime state with the implementation backend.
- **Rejected alternatives / why not:** A competing router, baton ledger, workflow state machine, or router-owned execution state duplicates classification and creates contradictory authority. A model/provider-specific router breaks semantic portability. A new routing stage, generic evaluator, issue tracker, workflow service, or coordination authority duplicates existing owners.
- **Consequences:** Route judgments cite relevant evidence and preserve one owner per responsibility. Router state cannot become a hidden continuation or scheduling authority.
- **Reopen when:** Sole router ownership, statelessness, classification responsibility, or backend ownership of execution state changes.

### D11 — Independent workflow dimensions

- **Scope:** Route lifecycle depth, assurance profile, and execution topology.
- **Decision:** Keep lifecycle depth, assurance profile, and execution topology independent. Compact is the default when every existing compact disqualifier is false; otherwise select standard or high-consequence from consequence evidence. Implementation size, duration, and solution-rung choice do not change lifecycle depth or assurance. A route may choose one-owner, bounded-parallel, or another approved topology independently.
- **Decision:** Optional repository surface-verification adapters are proof machinery, not route, lifecycle, assurance, topology, consequence, or Orchestrator Role Profile inputs. Their existence, absence, age, or complexity cannot change profile selection. Ordinary setup, implementation, testing, verification, and review do not discover, create, or maintain them; only an already-frozen recipe or exact manual invocation may name one.
- **Why:** Consequence, capability, lifecycle need, and dependency shape are distinct facts. Defaulting eligible ordinary work to compact avoids making ceremony a proxy for safety.
- **Rejected alternatives / why not:** Coupling lifecycle depth to assurance or topology hides distinct route facts and can add ceremony or weaken proof for the wrong reason. Defaulting eligible ordinary work to standard adds independent assurance without a disqualifying risk.
- **Consequences:** A change in one dimension does not silently change the others. Compact remains eligible across implementation size or duration, while every real disqualifier remains an explicit escalation trigger.
- **Reopen when:** These dimensions are redefined, merged, or made dependent on one another.

### D12 — Human authority at consequential boundaries

- **Scope:** Product, architecture, scope, acceptance, topology/independence, destructive, and external-effect decisions.
- **Decision:** Preserve human authority for product behavior, architecture, material scope, acceptance, destructive effects, external effects, and shipping. No router, planner, worker, or assurance role may infer those decisions.
- **Why:** These choices change what is built, the safety contract, or the user's external state and therefore require explicit human authority.
- **Rejected alternatives / why not:** Automated or inferred product, architecture, destructive, external-effect, or shipping authority lets procedural artifacts silently decide consequential facts reserved to the human owner.
- **Consequences:** A newly exposed consequential decision returns through the material authority boundary; unchanged derivative work continues without inventing another approval gate.
- **Reopen when:** Human-owned decision boundaries or the materiality rules governing them change.

### D13 — Clean cutover

- **Scope:** Every caller, fixture, document, skill, rule, and active ADR affected by a changed generic workflow contract.
- **Decision:** Migrate every affected caller, fixture, and document and remove obsolete paths rather than leaving aliases or compatibility shims. Active skills, rules, `WORKFLOW.md`, and active ADRs must agree atomically; a conflict fails closed. A completion-rendering cutover includes every specialty normalizer and the single presenter.
- **Decision:** The clean cutover names exactly `surface-verification-adapter`, `create-surface-verification-adapter`, and `maintain-surface-verification-adapter`. The two wrappers remain disabled from ordinary model invocation on both supported hosts. Do not retain upstream names, a `swarm` route, aliases, duplicated wrappers, automatic triggers, or setup rows.
- **Why:** Dual behavior obscures the active contract, permits drift, and makes it impossible to know which path is authoritative.
- **Rejected alternatives / why not:** Leaving old callers, aliases, compatibility shims, or obsolete paths after cutover preserves silently competing behavior instead of completing the migration.
- **Consequences:** A contract change is not complete until every affected projection agrees and obsolete paths are gone. No agent silently chooses a winner when active authorities conflict.
- **Reopen when:** The repository adopts a different explicit migration or compatibility policy, or atomic synchronization becomes impossible under approved authority.

### D14 — Separate shipping authority

- **Scope:** Staging, commit, push, review request, release, deploy, rollout, and other delivery effects.
- **Decision:** Keep shipping separately and explicitly authorized. Local completion never authorizes staging, commit, push, release, deploy, rollout, or another delivery action.
- **Why:** Delivery mutates external state and requires its own exact authorization and rollback boundary.
- **Rejected alternatives / why not:** Inferring shipping from implementation, verification, review approval, or completion evidence crosses an external-effect boundary the local lifecycle does not own.
- **Consequences:** Completion is local evidence only. Delivery remains outside the generic engineering lifecycle until separately authorized.
- **Reopen when:** Delivery ownership, authorization, or rollback policy changes.

### D15 — Semantic ownership and source roles

- **Scope:** Requirements, specifications, direct authority, plans, tasks, todos, Context Packs, Handoffs, `WORKFLOW.md`, ADRs, and research.
- **Decision:** Give each artifact one semantic owner. Approved requirements, specifications, and direct authority govern their concerns; plans, tickets, tasks, todos, Context Packs, and Handoffs only project that authority. `WORKFLOW.md` describes concise current behavior, ADRs carry durable rationale and rejected alternatives, and Atlas and external sources carry advisory research only.
- **Why:** Explicit source roles prevent proposals, projections, stale evidence, or research from masquerading as approved behavior.
- **Rejected alternatives / why not:** Turning plans, tickets, todos, Context Packs, Handoffs, memories, transcripts, or Atlas into normative or runtime ledgers creates competing copies and instance-specific authority. Copying ADR rationale into `WORKFLOW.md` duplicates the durable source and bloats current guidance.
- **Consequences:** Current executable behavior and active ADR rationale remain distinct but synchronized. A source-role conflict fails closed instead of being resolved by convenience.
- **Reopen when:** Any artifact's semantic ownership, source precedence, or executable-versus-advisory boundary changes.

### D16 — Iterative grilling completion

- **Scope:** `dev-grilling` rounds, completion, pause, and no-progress boundaries.
- **Decision:** Bound grilling by the decision tree, not an arbitrary round count. After each complete-frontier round, wait for the user's answers and recompute dependencies. Continue for as many rounds as required until the frontier is empty and the user confirms shared understanding, or stop with an exact resumable frontier for a user pause, authority/evidence blocker, or repeated no-progress frontier. This supersedes D05's former fixed one-follow-up cap while retaining D05's whole-frontier and near-miss authority.
- **Why:** Newly exposed dependencies can require more than one follow-up, while an exact frontier and no-progress stop keep the interview finite and resumable.
- **Rejected alternatives / why not:** A fixed two-round cap truncates newly exposed dependencies. An exhaustive scope-unbounded interview lacks a finite completion condition. Repeating an unchanged frontier treats activity as progress.
- **Consequences:** User confirmation is an interview completion condition rather than a second router approval; pauses and blockers return exact recovery state.
- **Reopen when:** The decision-tree completion condition, user-confirmation boundary, pause semantics, or no-progress stop changes.

### D17 — Optional external-intake triage

- **Scope:** Explicitly requested raw issue or pull-request intake.
- **Decision:** Keep triage an optional external-intake on-ramp. Raw issue or pull-request intake may use `dev-triage`; project-authored tickets and plans skip it. Triage states map into `Authority / Design` readiness rather than adding a lifecycle phase, and every tracker mutation remains an exact external-effect gate.
- **Why:** Raw external work can become agent-ready without imposing tracker ceremony on work the project has already qualified.
- **Rejected alternatives / why not:** Mandatory triage duplicates qualification for project-authored work. Wholesale import of an upstream tracker framework imposes non-project labels and layout. A new lifecycle phase would change the existing route shape without a distinct owner need.
- **Consequences:** External intake can be normalized without changing the four todo phases or making triage universal; tracker writes remain separately authorized effects.
- **Reopen when:** Triage becomes mandatory, its readiness mapping changes, or tracker mutation authority changes.

### D18 — Compact approval and completion presentation

- **Scope:** Human-facing initial route approval and terminal completion output.
- **Decision:** Keep approval and completion presentations compact. Initial approval contains only `Goal`, `Route`, `Plan`, `Safety`, and `Approval`. Terminal completed presentation projects D27's exact `Completed`, `Evidence`, and `Continuation` report from one current validated `completion-presentation-input` fence. It carries filled changed-artifact and verification evidence plus durable Resume from, the existing Handoff, Constraints containing `shipping not authorized`, and specialty-authorized Next; it contains no completed `Route`, exposed fence, or presenter lifecycle mechanics.
- **Why:** Compact output keeps the human's decision or result visible, while D27's filled evidence and durable continuation let the report support later resumption without copying internal manifests or gate machinery.
- **Rejected alternatives / why not:** Verbose templates, implementation inventories, mutable resume pointers, gate machinery, and execution metadata obscure the one decision or result the user needs or fail to support reliable continuation.
- **Consequences:** Presentation remains route-truthful and concise; the human receives current material evidence and a durable resume index, while detailed internal accounting stays behind the existing Handoff.
- **Reopen when:** The human approval fields, completion fields, durability boundary, or threshold for exposing internal mechanics changes.

### D19 — Ordered route presentation

- **Scope:** `dev-ask` prospective route presentation
- **Decision:** Render every human-facing prospective `Route` as an ordered list, one route owner per line, preserving exact order and ending with the literal marker `completion-presentation`. Never render an inline arrow chain. If materially different candidates are required, give each candidate its own labeled ordered list. The final marker is prospective terminal projection only: it is never a dispatchable owner or worker and receives no task, Task Contract, Context Pack, backend attempt, Handoff, state, transition, approval, or completed Route.
- **Why:** Ordered lists scan and wrap better while preserving sequence; treating the final marker as non-dispatchable keeps presentation from becoming a second lifecycle owner.
- **Rejected alternatives / why not:** Arrow chains are dense; unordered bullets lose order; route tables expose unnecessary mechanics; dispatching the presenter duplicates specialty completion ownership and Handoff transfer.
- **Consequences:** Approval templates, prospective examples, and paired eval fixtures use ordered route lists without changing internal route identity or ordering. The same specialty caller applies D27 after it constructs the current valid fence. Completed outputs carry no `Route`.
- **Reopen when:** Prospective route ordering, the terminal projection marker, or presenter ownership changes.

### D20 — Recommended route and conditional decision support

- **Scope:** `dev-ask` route selection and interview boundary
- **Decision:** Evaluate the full skill catalog internally, but present one recommended route by default. Show two or three candidates only for materially different valid routes with user-owned trade-offs. Ask one gating question only when one fact changes the first owner. Use grilling only for explicit candidate, plan, hypothesis, or design refinement; use research, requirements, diagnosis, or implementation for their existing near misses.
- **Why:** Useful skills remain available without choice theatre or routine interview latency.
- **Rejected alternatives / why not:** Always listing candidates burdens predictable choices; interviewing every prompt overlaps other owners; keyword routing misses context.
- **Consequences:** Candidate routes are exceptional decision support, not a catalog tour. The router still considers every applicable skill predicate internally.
- **Reopen when:** Route-discriminating authority or catalog semantics change.

### D26 — Lean ordinary implementation path

- **Scope:** Settled, reversible, one-context, one-lineage coding work with deterministic proof and no existing compact disqualifier.
- **Decision:** Route eligible ordinary work through `dev-implementation` then `completion-presentation`. Criterion-complete worker smoke on the exact final target is terminal proof. Same-context compact binds a minimal revision-bound Task Contract directly; an existing ownership/context-change or durable-recovery crossing predicate adds exactly one Context Pack carrying that Task Contract and its solution discipline. Compact does not require an Executor Plan, plan preflight, filesystem Task Contract, Handoff file, independent verification, final review, or continual-learning dispatch. Standard and high-consequence retain their required independent assurance.
- **Decision:** Compact may remain planless. Its direct Task Contract still binds one short human Intent and one Methods value; if compact work uses an Executor Plan, that plan contains work tasks only and never numbers a verification, review, or continual-learning profile tail.
- **Why:** Settled ordinary work is safest when the route is deterministic, proof is tied directly to acceptance, and lifecycle ceremony appears only for an evidenced boundary.
- **Rejected alternatives / why not:** Standard-by-default assurance makes elapsed work or implementation size a hidden risk proxy. Always requiring plans, Context Packs, verification, review, or learning adds transfer and audit stages without improving criterion proof for bounded same-context work. Removing compact disqualifiers would weaken safety rather than remove ceremony.
- **Consequences:** The router applies one fixed six-gate order, selects compact only after catalog predicates and disqualifiers are checked, dispatches one first owner, and presents one owner per numbered Route line. The implementation backend applies the compact checklist before its first ready transition and stops or returns to the router when independent proof is required.
- **Reopen when:** Compact disqualifiers, terminal proof, same-context/cross-context ownership, ordinary-route owners, or the size/duration independence boundary changes.

## Affected contracts

- `.config/agents/skills/dev-ask/SKILL.md` and `.config/agents/skills/dev-ask/WORKFLOW.md` for router, approval, composition, todo projection, route selection and presentation, completion, and current behavior.
- `.config/agents/skills/dev-requirements/SKILL.md`, `dev-research/SKILL.md`, `dev-triage/SKILL.md`, `dev-grilling/SKILL.md`, `grill-me/SKILL.md`, `grill-with-docs/SKILL.md`, `dev-prototype/SKILL.md`, `dev-specification/SKILL.md`, `dev-ticketing/SKILL.md`, `dev-implementation/SKILL.md`, `dev-improve-codebase-architecture/SKILL.md`, and `wayfinder/SKILL.md` for targeted confirmation, iterative decision frontiers, optional intake, semantic revision rebinding, adapters, route impact, stops, and exactly one receiver.
- `.config/agents/skills/dev-ask/evals/evals.json` and its route, reapproval, continuation, presentation, discovery, triage, and ordinary-context fixture directories.
- `.agents/AGENTS.md`, `manifest`, `docs/adr/INDEX.md`, and the five ACTIVE generic-workflow ADRs.
- Human approval boundaries for product, architecture, material scope, acceptance, topology/independence, destructive/external effects, and shipping.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains decision authority rather than implementation or run state.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions**, **Fixed shared contracts**, **Deterministic routing model**, **Canonical discovery and continual learning**, **Material approval boundary**, and T1's task contract. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- D19-D20 durable-write authority: `local://dev-workflow-routing-simplicity-decisions.md`, SHA-256 `ef2ac3ddd04239e1c055f25439d81f58f8ec503777c4fa691a3443abe83823be`, explicitly confirmed by the user.
- Repository conventions: `.config/agents/skills/dev-domain-modeling/ADR-FORMAT.md` (ADR destination and numbering), current `.agents/AGENTS.md`, and current `manifest` as read before this record was created.
- Executable lineage revisions: completed T2 Common Handoff `agent://WorkflowRouting`; T5 synchronization of the current paths above under `AUTH-PLAN`, with its exact final target identity returned to T6.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: specialization and shared decision context are useful; hundreds-agent defaults, recursive trees, custom VCS, agent-owned Field Guides, unlimited stacked reviews, and model-specific policy are not adopted.
- Matt Pocock, [`grilling`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/productivity/grilling/SKILL.md), [`grill-with-docs`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering/grill-with-docs/SKILL.md), [`triage`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering/triage/SKILL.md), and the [engineering catalog](https://github.com/mattpocock/skills/tree/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering), accessed 2026-08-10: round-based complete-frontier interviews and optional tracker intake are adapted; mandatory setup/layout, tracker-specific policy, automatic staging/commit behavior, blanket grilling, and wholesale workflow import are rejected.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: deterministic ownership and feedback placement inform this boundary; the six-step migration sequence and implementer-plus-two-reviewers-plus-fixer pattern are not generic lifecycle policy.
- Atlas references in the governing plan remain advisory research, not normative routing authority.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan, the user's 2026-08-10 explicit D16-D18 workflow refinements, and the exact confirmed D19-D20 evidence artifact above are the authority for this record. The parent execution dispatch authorizes their materialization; it does not authorize product decisions, executable workflow changes, shipping, or mutation of `/Users/kim/.agents/AGENTS.md`. Human approval remains required at the material boundaries named above.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. D16 supersedes only D05's former fixed one-follow-up cap; D05's whole-frontier and applicability boundaries remain active. Mechanical wording, formatting, and a contract-preserving sequential downgrade do not supersede any decision.

## Verification expectations

- **AC01:** A fresh read-only agent given only repository guidance finds the single minimal pointer, opens `docs/adr/INDEX.md`, identifies the five ACTIVE generic-workflow records and the separate concurrent product-workflow ADR-0005, and does not load every ADR for ordinary unrelated work.
- **AC02:** Every D01-D23 decision and its relevant rejection is represented exactly once by one decision unit in one focused ACTIVE ADR, with approval and supersession semantics.
- Route fixtures must distinguish direct answers, research, optional raw external triage, missing requirements, candidate refinement/grilling, hard bugs, known-cause repair, settled implementation, and large specified work without keyword-only routing.
- Approval fixtures must show unchanged derivative stages continue on one route approval, only newly exposed human-owned decisions or material semantic drift reopen approval, route presentation is an ordered list, route candidates remain exceptional, compact presentation is stable, and completion does not produce a shipping action.
- A future executable revision must prove current skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
