# Portable Workflow Optimization Grilling

**Datetime**: 2026-08-24-2313
**Authority kind**: local-authority
**Scope**: Read-only documented decision interview for `OUT-WF-PORTABLE-SEAM-1`
**Summary**: Validate the revised intake as an unsettled repository-bearing architecture candidate, resolve its four human-owned choices, and return immutable decision evidence to `dev-ask`. This plan authorizes no workflow mutation, Executor Plan publication, implementation stage, or external effect.
**Status**: PENDING

## Context

The current intake is revision-bound planning evidence, not a Common Handoff, approved architecture, Task Contract, Executor Plan, semantic attempt, or executable authority. It identifies two defects: decision briefs can acquire Executor Plan identity before architecture and acceptance are fixed, and graph-bound facts are manually recopied across tickets, plans, Task Contracts, todos, and Handoffs. Current repository evidence supports the frontier: `executor_plan.py` validates and preflights but discards its parsed task graph; `/improve` independently chooses audit, mutation, plan, and verification behavior and owns a private template; completion validation/rendering is prompt-side with no contract-equivalent helper yet; existing conditional references already provide a progressive-disclosure pattern. ADR-0001 D05/D10/D12/D15/D16/D20 and the `dev-ask` contract therefore make `grill-with-docs` the only immediate owner after native approval, returning to `dev-ask`; the intended end state is confirmed decision evidence for four choices, not repository changes.

## Approach

1. Immediately before dispatch, `dev-ask` rereads this exact approved local plan, `docs/adr/INDEX.md`, the active clauses named under Critical files, and the live `grill-with-docs`/`dev-grilling` capability. Compare any changed bytes semantically. Continue only when the candidate scope, first owner, read-only effect boundary, and four-question frontier remain unchanged; otherwise stop for a revised native plan approval.
2. Dispatch exactly one first owner, `grill-with-docs`, with this plan revision as requesting authority, `dev-ask` as requesting owner and receiver, and the candidate facts in Context as non-authoritative evidence. The adapter uses `dev-grilling`; it must not dispatch `dev-requirements`, `dev-specification`, `dev-implementation`, a prototype, or another worker during this plan.
3. Resolve repository facts before asking. Read only the current parser/plan rules and two canonical parser fixtures; `/improve`, its private template, and its route/survey callers; the router/backend/Handoff/presenter contracts; the five active core workflow ADRs; and the relevant engineering, product, and presenter evaluation registries. Treat the current PENDING `.agents/plans/2026-08-22-1603_repository-canonical-plans.md`, which also targets parser/plan contracts and the `/improve` template, as non-authoritative drift and preservation evidence that must be rechecked rather than merged or overwritten. Use Atlas only as the already-cited diagnostic case; do not inspect or change Atlas implementation. Product proof, host catalog controls, route-presentation changes, shipping, and all repository mutations remain outside this interview.
4. Ask one numbered first round containing the complete current frontier, with two mutually exclusive options and the stated recommendation for each:
   - **Published graph owner** — keep the Executor Plan as the sole published portable graph with optional `dev-ticketing` (recommended), or make a mandatory `dev-ticketing` graph canonical and demote the Executor Plan to a backend projection.
   - **Serialized authoring contract** — derive convenience fields before publication and materialize every field into the existing full schema before validation, hashing, review, and approval (recommended), or publish a second reduced schema.
   - **`/improve` disposition** — retain the name only as a thin intake adapter into `dev-ask` (recommended), or remove it and use `dev-ask` plus `dev-improve-codebase-architecture` directly.
   - **Core outcome packing** — keep P0-A projection, P0-B adapter cutover, behavior-preserving progressive disclosure, and only capability-proven completion mechanics in one high-consequence core outcome while keeping product proof separate (recommended), or keep only P0-A/P0-B in the core and authorize progressive disclosure and completion mechanics as separate later outcomes.
5. Wait for all four answers, then recompute the bounded decision tree. Surface contradictions and ask only dependent questions needed to make those same four choices executable; do not expand into product, Atlas, harness-catalog, route-presentation, implementation-schema, or shipping decisions. If such authority is required, return an exact blocker and resumable frontier instead of inventing it.
6. When the frontier is empty, present one concise shared-understanding summary containing the four decisions, rejected alternatives and reasons, preserved authority boundaries, and separate follow-on outcomes. Require explicit user confirmation. Confirmation settles only the interview evidence; it does not approve requirements, specification, an Executor Plan, implementation, effects, or shipping.
7. Emit one immutable decision-evidence artifact bound to this plan revision and one Common Handoff to exactly `dev-ask`. Use `route-impact: changed` whenever the exit contains any user-confirmed architecture choice or another changed route, scope, topology, effect, or shared assumption; use `unchanged` only for a pause, blocker, or no-progress exit that confirms no material fact. Stop after the Handoff so `dev-ask` can recompute the route from the confirmed evidence.

## Tasks

- [ ] T1. Resolve the portable workflow decision frontier
  - Owner: grill-with-docs
  - Intent: Decide the portable workflow architecture boundaries.
  - Methods: none
  - Receiver: dev-ask

## Critical files & anchors

- `.config/agents/skills/dev-ask/SKILL.md` — classification item 6, compact approval, and dispatch/Handoff rules establish the sole immediate owner and return boundary.
- `.config/agents/skills/grill-with-docs/SKILL.md` — repository-evidence adapter contract and exact receiver semantics.
- `.config/agents/skills/dev-grilling/SKILL.md` — whole-frontier rounds, explicit confirmation, immutable evidence, and resumable stop contract.
- `docs/adr/0001-dev-workflow-authority-and-routing.md` — D05, D10, D12, D13, D15, D16, and D20 govern candidate refinement, human authority, ownership, and clean cutover.
- `docs/adr/0002-executor-plans-and-orchestration.md` — D08 and D09 govern the single portable plan shape and non-authoritative todo projection under review.

## Verification / Done criteria

- [ ] The exact input scenario—this revised intake with no approved architecture—produces `grill-with-docs` as the only dispatched first owner; no requirements, specification, implementation, verification, review, learning, presenter, prototype, ticketing, or mutation event occurs.
- [ ] The first interview round contains all four independent choices above, each with distinct mutually exclusive options, a concrete recommendation, and evidence-based rationale; the owner waits for the user's full answer before any dependent round.
- [ ] The final decision evidence names this approved plan revision, every confirmed choice, every rejected alternative and reason, the evidence references, any unresolved authority, and an immutable artifact identity. It exists only after the frontier is empty and the user explicitly confirms the shared understanding.
- [ ] The Common Handoff names the evidence identity, a deterministic `route-impact: unchanged|changed` result under Step 7, any exact blocker, and exactly one receiver: `dev-ask`.
- [ ] Direct trace inspection shows no working-tree write, persisted workflow state, Executor Plan publication, external effect, or shipping action. The observable output is the decision evidence plus one Handoff, or an exact resumable blocker/frontier.

## Assumptions & contingencies

- Native approval of this exact local plan authorizes only T1's read-only interview and first dispatch; it does not confirm any recommended architecture choice.
- If repository evidence makes one option impossible under current authority, remove that false choice, cite the governing fact, and ask only the remaining real human trade-off.
- If the user pauses, return the exact settled decisions and unresolved frontier. If current authority is stale or contradictory, return the conflicting identities and required authority owner. Neither case authorizes downstream work.
