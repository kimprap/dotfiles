# Dev workflow authority and routing

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-28
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

- **Scope:** External generic engineering classification, lifecycle dispatch, explicit portfolio-audit intake, and terminal completion normalization.
- **Decision:** Keep `dev-ask` the sole thin, stateless external router. It classifies from intent, authority, evidence, consequence, and lifecycle facts; dispatches one first owner; handles material reapproval; validates terminal evidence; constructs the current completion fence; and routes an explicit user or external-scheduler portfolio-audit request through the existing validated direct-stage seam.
- **Decision:** Successful normal engineering completion is terminal after its profile-specific presentation. No audit is scheduled from presentation, plan `DONE`, assurance, review, or learning. An explicit audit is a new intake against its own exact frozen target and complete repository or named-subsystem suite boundary; completed-plan provenance is optional and grants no authority.
- **Decision:** The router owns no baton ledger, workflow state machine, execution state, semantic plan work, audit opinion, audit scheduler, test mutation, cleanup authority, or competing routing policy. A later explicit cleanup request is fresh maintenance: bounded, cohesive, settled one-context work may be planless; broad, dependency-ordered, fan-in, or recovery-sensitive work requires a new Executor Plan.
- **Why:** One semantic router prevents contradictory lifecycle authority while keeping execution state with `dev-implementation`, audit opinions with the audit specialty, and rendering with `completion-presentation`.
- **Rejected alternatives / why not:** A competing router, runtime ledger, routing stage, generic evaluator, issue tracker, scheduler, automatic completion-tail audit, or provider-specific coordination authority duplicates existing owners and couples read-only assessment to delivery.
- **Consequences:** Route judgments remain evidence-backed and stateless. Normal completion terminates without audit; a separately requested audit or cleanup starts fresh and cannot reopen or inherit authority from completed work.
- **Reopen when:** Sole router ownership, statelessness, completion normalization, explicit audit routing, fresh maintenance classification, or backend execution-state ownership changes.
### D11 — Independent workflow dimensions

- **Scope:** Route lifecycle depth, assurance profile, execution topology, plan-backed activation, and proof adapters.
- **Decision:** Keep lifecycle depth, assurance profile, and execution topology independent. Compact is the default when every compact disqualifier is false; otherwise select standard or high-consequence from consequence evidence. Implementation size, duration, and solution-rung choice do not change lifecycle depth or assurance.
- **Decision:** Planless direct work remains the lean one-owner same-context lane. Every approved parser-valid implementation Executor Plan uses full orchestration with `downgrade: none`, including compact work-only plans; compact assurance remains tail-free. `PROMOTE-SERIAL-DEFAULT` sets runtime concurrency one by default inside full orchestration, not a different profile or downgrade, and supports no general efficiency claim.
- **Decision:** Optional repository surface-verification adapters are proof machinery, not route, lifecycle, assurance, topology, consequence, or Orchestrator Role Profile inputs. Their existence, absence, age, or complexity cannot change profile selection.
- **Why:** Consequence, lifecycle, proof, and graph execution are distinct facts. Strict plan-backed child ownership prevents assurance or task count from becoming permission for root semantic work while preserving lean planless direct work.
- **Rejected alternatives / why not:** Coupling lifecycle depth to assurance or topology adds or removes ceremony for the wrong reason. A separate sequential-child profile or plan-root semantic fallback disguises unavailable orchestration as equivalent execution.
- **Consequences:** A change in one dimension does not silently change another. Compact remains eligible across size or duration; a compact plan still dispatches child work, while planless compact stays same-context.
- **Reopen when:** These dimensions, the plan-backed activation gate, serial default, direct-path separation, or proof-adapter neutrality changes.
### D12 — Human authority at consequential boundaries

- **Scope:** Product, architecture, scope, acceptance, topology/independence, destructive, and external-effect decisions.
- **Decision:** Preserve human authority for product behavior, architecture, material scope, acceptance, destructive effects, external effects, and shipping. No router, planner, worker, or assurance role may infer those decisions.
- **Why:** These choices change what is built, the safety contract, or the user's external state and therefore require explicit human authority.
- **Rejected alternatives / why not:** Automated or inferred product, architecture, destructive, external-effect, or shipping authority lets procedural artifacts silently decide consequential facts reserved to the human owner.
- **Consequences:** A newly exposed consequential decision returns through the material authority boundary; unchanged derivative work continues without inventing another approval gate.
- **Reopen when:** Human-owned decision boundaries or the materiality rules governing them change.

### D13 — Clean cutover

- **Scope:** Every caller, fixture, document, skill, rule, and active ADR affected by a changed generic workflow contract.
- **Decision:** Migrate every affected caller, fixture, and document and remove obsolete paths rather than leaving aliases or compatibility shims. Active skills, rules, `WORKFLOW.md`, and active ADRs must agree atomically; a conflict fails closed.
- **Decision:** The orchestration cutover has a closed canonical caller inventory. It removes plan-root semantic fallback and plan-specific downgrade language while preserving planless direct behavior, compact plan validity, optional profile tails, portable fan-in, direct `dev-integration`, and generic direct capability downgrade support.
- **Decision:** The completion cutover cleanly renames the unversioned fence field to ordered `papercuts` across engineering, product, custom, direct, and presenter callers. None-only accounting becomes `[]`; scalar input is rejected without a compatibility reader.
- **Decision:** The completion presentation cutover removes the legacy `changed` field and `Changed` label across every active caller and fixture. One ordered `change_scope` list carries concise aggregate count/category statements; one ordered `key_artifacts` list carries one to three durable entry points; exhaustive inventory remains in the exact target manifest and/or Handoff. `resume_from` now targets a durable Completion Summary that records outcome, material decisions, immutable evidence identities, current residual risk, and the exact applicable manifest reference. There is no compatibility reader.
- **Decision:** The clean surface-verification cutover still names exactly `surface-verification-adapter`, `create-surface-verification-adapter`, and `maintain-surface-verification-adapter`, with both wrappers disabled from ordinary model invocation.
- **Decision:** The terminal-completion and explicit-audit cutover removes every automatic post-`DONE` or post-presentation audit transition. It keeps `test-audit/v1` only as an explicit validated direct-stage intake and leaves no compatibility path from normal completion.
- **Why:** Dual behavior obscures the active contract and makes authoritative selection impossible.
- **Rejected alternatives / why not:** Aliases, compatibility readers, obsolete callers, a second completion schema, or a second orchestration mode preserve silently competing behavior.
- **Consequences:** The cutover is complete only when every owned projection agrees and the closed caller scan passes. An outside live canonical caller requires authority change rather than silent scope expansion.
- **Reopen when:** The repository adopts a different migration policy, canonical caller ownership changes, or atomic synchronization becomes impossible under approved authority.
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
- **Decision:** Keep approval and completion presentations compact. Initial approval contains only `Goal`, `Route`, `Plan`, `Safety`, and `Approval`. Terminal completed presentation projects D27's exact `Completed`, `Evidence`, and `Continuation` report from one current validated `completion-presentation-input` fence. It carries ordered aggregate Change scope, one to three durable Key artifacts, filled verification evidence, and a durable Completion Summary Resume from, plus the existing Handoff, Constraints containing `shipping not authorized`, and specialty-authorized Next; it contains no `Changed` label, exhaustive implementation inventory, completed `Route`, exposed fence, or presenter lifecycle mechanics.

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

- **Scope:** Settled, reversible, one-context, one-lineage coding work with deterministic proof and no compact disqualifier.
- **Decision:** Route eligible planless ordinary work through `dev-implementation` then `completion-presentation`. Criterion-complete worker smoke on the exact final target is terminal proof. Same-context compact binds a minimal Task Contract directly; a real ownership/context-change or durable-recovery crossing adds one Context Pack. It requires no Executor Plan, independent verification, final review, or continual-learning dispatch.
- **Decision:** Compact may remain planless. Its direct Task Contract binds one human Intent and one Methods value. If compact work has an Executor Plan, that plan remains work-only and tail-free but enters the plan-backed full/no-downgrade gate and dispatches every authored work owner as a fresh child. The root remains mechanical.
- **Why:** Bounded direct work should avoid graph ceremony, while an authored durable plan must preserve the same root/child ownership boundary as every other implementation plan.
- **Rejected alternatives / why not:** Requiring plans for direct work adds no proof value. Letting a compact plan execute in the root would make task count or assurance select a hidden topology and conflict with plan-backed orchestration.
- **Consequences:** The router preserves the planless same-context lane. The compact checklist distinguishes planless binding from planned child dispatch without adding an assurance tail.
- **Reopen when:** Compact disqualifiers, terminal proof, same-context ownership, compact-plan activation, or the size/duration independence boundary changes.
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
