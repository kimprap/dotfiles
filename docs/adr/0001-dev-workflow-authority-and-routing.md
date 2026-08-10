# Dev workflow authority and routing

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-10  
**Decision IDs:** D01, D02, D05, D10, D11, D12, D13, D14, D15, D16, D17, D18

## Scope

This decision governs the generic engineering workflow's durable authority, route classification, approval/reapproval, interview completion boundary, optional external-intake triage, presentation contract, ownership boundaries, cutover discipline, and delivery boundary. It applies to `dev-ask`, the lifecycle skills and adapters that return to it, the current `WORKFLOW.md`, active workflow ADRs, and repository discovery. It does not grant authority to change product behavior, executable skills, rules, or delivery state.

## Context / problem

The workflow needs one current route and one durable explanation of why its boundaries exist. A route can otherwise accumulate duplicate routers, stage-by-stage approvals, serialized interviews, hidden execution state, mandatory intake ceremony, or implicit authority to make product, architecture, destructive, or shipping decisions. Current behavior also needs a clean distinction between concise executable guidance, durable rationale, and advisory research. Without that distinction, a future maintainer can mistake a plan, memory, Atlas note, todo, Handoff, or stale record for authority.

## Adopted decision

1. **Durable authority is focused ADRs plus one stable registry.** `docs/adr/INDEX.md` registers the active records and their supersession links. ADRs preserve adopted decisions and rejected alternatives; they are not a queue, runtime ledger, or attempt history.
2. **`dev-ask` is the sole thin, stateless external router.** It classifies from intent, authority, evidence, consequence, and lifecycle facts; dispatches the applicable owner; handles material reapproval; and presents completion. It owns no baton ledger, workflow state machine, execution state, or competing routing policy.
3. **One stable compact route approval is delegated downstream.** The initial approval authorizes the named prospective route. Requirements request targeted confirmation only for synthesized or materially clarified human-owned behavior; a specification or ticket graph that faithfully derives current authority continues automatically. A stage return, artifact completion, audit, or review does not require another approval. Digest drift triggers semantic comparison rather than automatic reapproval: even changed bytes in a named target are non-material when they do not alter authority, scope, acceptance, route, topology, proof/independence, destructive or external effects, shipping, a shared assumption, or equivalent capability.
4. **Grilling is bounded by the decision tree, not an arbitrary round count.** Each round asks the whole current load-bearing frontier, waits for the user's answers, and recomputes dependencies. Continue for as many rounds as required until the frontier is empty and the user confirms shared understanding, or stop with an exact resumable frontier for a user pause, authority/evidence blocker, or repeated no-progress frontier. Candidate/refinement intent can use grilling; ordinary ambiguity, missing requirements, factual lookup, and settled edits use their applicable owner instead.
5. **Authority stays human at the consequential boundaries.** Product behavior, architecture, material scope, acceptance, destructive effects, external effects, and shipping remain human-authorized. Local completion never authorizes staging, commit, push, release, deploy, rollout, or any other delivery action.
6. **Lifecycle depth, assurance profile, and execution topology remain independent dimensions.** A route may choose compact, standard, or high-consequence assurance separately from lifecycle depth and one-owner, bounded parallel, or other approved topology.
7. **Clean cutover is required.** A changed contract migrates every affected caller, fixture, and document and removes obsolete paths rather than retaining aliases, compatibility shims, or silently competing behavior. Active skills, rules, `WORKFLOW.md`, and active ADRs must agree atomically; a conflict fails closed.
8. **Each artifact has one semantic owner.** Existing approved requirements, specifications, and direct authority remain authoritative; plans, tickets, tasks, todos, Context Packs, and Handoffs only project that authority. `WORKFLOW.md` describes concise current behavior, ADRs carry rationale and rejected alternatives, and Atlas carries research evidence only.
9. **Triage is an optional external-intake on-ramp.** Explicitly requested raw issue or pull-request intake may use `dev-triage`; project-authored tickets and plans skip it. Its states map into `Authority / Design` readiness rather than adding a lifecycle phase, and every tracker mutation remains an exact external-effect gate.
10. **Approval and completion presentations are compact.** Initial approval contains only `Goal`, `Route`, `Plan`, `Safety`, and `Approval`. Terminal presentation contains the exact completed `Route`, `Result`, and only relevant `Verification`, `Risks`, or `Next`. Internal artifact identities and gate mechanics remain available to the engine but are omitted unless they affect the human decision.

## Rejected alternatives and reasons

- **One ever-growing decision register:** rejected because it mixes unrelated scope and makes supersession and focused ownership ambiguous.
- **Embedding rationale/history in `WORKFLOW.md`:** rejected because executable guidance must remain concise and current rather than becoming an archive.
- **Treating plans, memory, Atlas, todos, Handoffs, or transcripts as normative authority:** rejected because they are proposals, projections, research, or transfer artifacts and can be stale or instance-specific.
- **Reapproving every stage return or derivative artifact:** rejected because unchanged work would wait on ceremonial approval rather than progress against the stable outcome.
- **Letting initial approval silently cover later material decisions:** rejected because human authority cannot be inferred across changed product, architecture, scope, acceptance, destructive, external-effect, or shipping facts.
- **A competing router, baton ledger, workflow state machine, or router-owned execution state:** rejected because it duplicates classification and creates contradictory lifecycle authority.
- **A fixed two-round interview cap, one-question-at-a-time interview, or scope-unbounded interview:** rejected because the first truncates newly exposed dependencies, the second adds avoidable latency, and the third lacks a finite frontier-based completion condition.
- **Routing ordinary ambiguity, factual lookup, incomplete requirements, or settled direct edits to grilling:** rejected because requirements, research, or implementation already own those bounded cases.
- **Coupling lifecycle depth to assurance or topology:** rejected because consequence and capability are distinct facts and must not be hidden in one label.
- **Automated or inferred product/architecture/destructive/shipping authority:** rejected because the human owner retains those decisions.
- **Leaving old callers, aliases, compatibility shims, or obsolete paths after a cutover:** rejected because dual behavior obscures the active contract and permits drift.
- **Inferring shipping from completion evidence:** rejected because external delivery has a separate explicit authorization and rollback boundary.
- **A model/provider-specific router or policy:** rejected because semantic routing must remain portable and adapters own transport mechanics.
- **A new routing lifecycle stage, generic evaluator, issue tracker, workflow service, or other coordination authority:** rejected because existing owners already classify, execute, transfer, prove, and present the work; another authority would duplicate state and responsibility.
- **Turning ADRs, plans, tickets, todos, Context Packs, or Handoffs into runtime ledgers:** rejected because these artifacts document or project authority while the implementation backend alone owns execution state.
- **Grilling every change or scheduling frequent architecture surveys as blanket policy:** rejected because those routes activate only for actual candidate-refinement or explicit survey intent, not ordinary work.
- **Mandatory triage or wholesale import of an upstream tracker framework:** rejected because project-authored work is already qualified and tracker labels/layout are repository-owned.
- **Additional upstream engineering-skill imports:** rejected because `ask-matt`, code review, codebase design, domain modeling, specification, ticketing, prototyping, architecture survey, and Wayfinder already have current local semantic owners; upstream setup imposes tracker/layout policy; and its merge resolver stages and commits automatically. Only triage fills a distinct intake gap.
- **Verbose approval and completion templates:** rejected because artifact inventories, gate machinery, and execution metadata obscure the one decision or result the user needs.

## Consequences / invariants

- The current route and outcome remain stable until a named material trigger changes them.
- A direct settled implementation does not re-enter requirements, diagnosis, planning, or review merely because a stage returned unchanged evidence.
- A route judgment must cite the relevant evidence and preserve one owner per responsibility.
- A conflict between an active executable contract and an active ADR stops the workflow; no agent silently selects a winner.
- Rejected and superseded records remain discoverable history but never execute.
- Completion is local evidence only. Shipping remains outside this lifecycle.
- The ADR index and this record are documentation authority, not runtime state and not a replacement for executable enforcement.
- Raw external intake can become agent-ready without changing the four todo phases or making triage a universal prerequisite.
- Human prompts correspond to new human-owned decisions or external effects, not stage/artifact count.

## Affected contracts

- `.config/agents/skills/dev-ask/SKILL.md` and `.config/agents/skills/dev-ask/WORKFLOW.md` for router, approval, composition, todo projection, completion, and current behavior.
- `.config/agents/skills/dev-requirements/SKILL.md`, `dev-research/SKILL.md`, `dev-triage/SKILL.md`, `dev-grilling/SKILL.md`, `grill-me/SKILL.md`, `grill-with-docs/SKILL.md`, `dev-prototype/SKILL.md`, `dev-specification/SKILL.md`, `dev-ticketing/SKILL.md`, `dev-implementation/SKILL.md`, `dev-improve-codebase-architecture/SKILL.md`, and `wayfinder/SKILL.md` for targeted confirmation, iterative decision frontiers, optional intake, semantic revision rebinding, adapters, route impact, stops, and exactly one receiver.
- `.config/agents/skills/dev-ask/evals/evals.json` and its route, reapproval, continuation, presentation, discovery, triage, and ordinary-context fixture directories.
- `.agents/AGENTS.md`, `manifest`, `docs/adr/INDEX.md`, and the four ACTIVE workflow ADRs.
- Human approval boundaries for product, architecture, material scope, acceptance, topology/independence, destructive/external effects, and shipping.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains decision authority rather than implementation or run state.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions**, **Fixed shared contracts**, **Deterministic routing model**, **Canonical discovery and continual learning**, **Material approval boundary**, and T1's task contract. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- Repository conventions: `.config/agents/skills/dev-domain-modeling/ADR-FORMAT.md` (ADR destination and numbering), current `.agents/AGENTS.md`, and current `manifest` as read before this record was created.
- Executable lineage revisions: completed T2 Common Handoff `agent://WorkflowRouting`; T5 synchronization of the current paths above under `AUTH-PLAN`, with its exact final target identity returned to T6.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: specialization and shared decision context are useful; hundreds-agent defaults, recursive trees, custom VCS, agent-owned Field Guides, unlimited stacked reviews, and model-specific policy are not adopted.
- Matt Pocock, [`grilling`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/productivity/grilling/SKILL.md), [`grill-with-docs`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering/grill-with-docs/SKILL.md), [`triage`](https://github.com/mattpocock/skills/blob/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering/triage/SKILL.md), and the [engineering catalog](https://github.com/mattpocock/skills/tree/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering), accessed 2026-08-10: round-based complete-frontier interviews and optional tracker intake are adapted; mandatory setup/layout, tracker-specific policy, automatic staging/commit behavior, blanket grilling, and wholesale workflow import are rejected.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: deterministic ownership and feedback placement inform this boundary; the six-step migration sequence and implementer-plus-two-reviewers-plus-fixer pattern are not generic lifecycle policy.
- Atlas references in the governing plan remain advisory research, not normative routing authority.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan, plus the user's 2026-08-10 explicit D16-D18 workflow refinements, are the authority for this record. The parent execution dispatch authorizes their materialization; it does not authorize product decisions, shipping, or mutation of `/Users/kim/.agents/AGENTS.md`. Human approval remains required at the material boundaries named above.

## Supersession / reopen conditions

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Reopen or seek reapproval if the router's sole ownership, stable-route approval model, decision-frontier interview completion, optional triage boundary, compact presentation contract, human authority, lifecycle/assurance/topology independence, cutover policy, source-of-truth split, or shipping boundary changes; if a new mandatory lifecycle skill or competing state authority is proposed; or if current active contracts and ADRs cannot be synchronized atomically. Mechanical wording, formatting, and a contract-preserving sequential downgrade do not reopen it.

## Verification expectations

- **AC01:** A fresh read-only agent given only repository guidance finds the single minimal pointer, opens `docs/adr/INDEX.md`, identifies all four ACTIVE records, and does not load every ADR for ordinary unrelated work.
- **AC02:** Every D01-D18 decision and its relevant rejection is represented by one focused active ADR or a linked focused record, with approval and supersession semantics.
- Route fixtures must distinguish direct answers, research, optional raw external triage, missing requirements, candidate refinement/grilling, hard bugs, known-cause repair, settled implementation, and large specified work without keyword-only routing.
- Approval fixtures must show unchanged derivative stages continue on one route approval, only newly exposed human-owned decisions or material semantic drift reopen approval, compact presentation is stable, and completion does not produce a shipping action.
- A future executable revision must prove current skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
