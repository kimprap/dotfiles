Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 04
Status: resolved

## Question

What exact input, state-detection, dispatch, return, stop, and escalation contract should the single user-facing router expose so it can always be invoked, select the next appropriate lifecycle skill, preserve human decision ownership, and hand implementation-phase work to the separate backend without duplicating either the routed skills or the backend?

## Answer

The single user-facing router is a thin, stateless classifier and dispatcher. It is safe to invoke for any engineering request, but it does not own product development, engineering requirements, specification, implementation, verification, durable workflow state, or continual-learning writes.

### Input and evidence precedence

The user supplies an ordinary request, not a router schema. The router may read:

- the current user message and conversation;
- working-directory identity and bounded repository context;
- explicitly referenced artifacts;
- approved external product brief/PRD, engineering-requirements, specification, ticket, or map identities and revisions;
- the current structured baton, when resuming;
- live skill/capability inventory exposed by the host.

Use current explicit user intent first, then canonical approved artifacts, then the current baton, then repository/conversation evidence. A new user instruction that conflicts with an approved artifact is a change request, not a silent override. Surface the conflict and route it to the artifact owner.

The router persists no manifest, status file, hidden run state, approval ledger, or duplicate artifact index. Durable state belongs to the stage that owns it. Resume by rereading canonical artifacts and the latest valid baton.

### Classification

Perform only bounded, read-only inspection needed to distinguish:

- direct answer;
- bounded research;
- stateless or codebase grilling;
- Wayfinder;
- engineering requirements or `PRODUCT AUTHORITY REQUIRED`;
- diagnosis;
- architecture improvement/design;
- direct implementation;
- engineering specification and tickets;
- implementation backend execution;
- verification/review/integration continuation;
- blocked or already complete work.

Apply the lifecycle gate precedence from [Define end-to-end lifecycle](04-define-end-to-end-lifecycle.md). Do not scan or interview broadly inside the router.

If one missing fact changes the first owner or lane, ask the smallest gating question. If materially different routes still survive, present 2–3 route options with one recommendation. Full engineering-intent clarification belongs to `eng-grilling` or `eng-requirements` after route approval. Unresolved market or product strategy does not: stop for its external authority.

### Product authority boundary

When a request cannot proceed without a product decision, the route overview ends at `PRODUCT AUTHORITY REQUIRED` and names the unresolved decisions, current safe evidence, next human/future-flow owner, and exact approved artifact or decision needed to resume. The router does not run product discovery or produce a provisional PRD.

When product authority is sufficient but observable behavior, acceptance, engineering scope, or constraints are incomplete, the router may dispatch `eng-requirements`. A complete approved request skips that stage.

### Route overview

Every invocation—including a direct read-only answer—returns a short overview before action:

1. **Goal:** one-sentence interpretation.
2. **Route:** ordered stage owners, or `direct answer`.
3. **Why:** decisive routing facts and included/skipped nontrivial stages.
4. **Artifacts:** expected durable outputs or `none`.
5. **Gates:** known human, destructive, scope, or capability stops.
6. **Execution:** initial mode, defaulting to one agent.
7. **First action:** the next concrete operation.

End by requesting approval of that exact overview. An unambiguous affirmative reply tied to the current overview is approval. Any caveat, modification, added constraint, or conflicting instruction invalidates it; recompute and present a revised overview before action. Silence, topic continuation, or an unrelated message is not approval.

Immediately before dispatch, reread any load-bearing artifact/capability revision named by the overview. Drift invalidates the approval and triggers a revised overview.

### Explicit skill requests

Treat a user-named underlying skill or phase as a strong route preference. Validate its prerequisites, artifact authority, safety, and human gates. If prerequisites are complete, route there. If not, include the smallest prerequisite path in the overview. Never ignore the request or bypass a required gate silently.

An explicitly invoked underlying skill may still be used directly outside the router; the router contract governs only invocations of the single interface.

### Dispatch and baton

After approval, dispatch exactly one first owner or execute the approved direct-answer route. The router does not run the selected stage's procedure itself.

Clear stages continue through automatic structured batons. A baton may follow the approved route without returning to the router when its next owner and preconditions are unchanged. Re-enter the router when:

- the next owner is ambiguous;
- the approved route changes materially;
- a product, architecture, destructive, or scope decision appears;
- a shared assumption breaks;
- a required capability is unavailable;
- canonical artifact drift invalidates the current handoff;
- work claims completion.

At re-entry, recompute from artifacts and baton rather than trusting prior conversational memory.

### Capability gaps

A host-native or direct substitute is allowed only when it satisfies the same portable behavior, artifact, approval, and evidence contract. Name the substitution in the route overview. If equivalence cannot be established, stop with:

- the missing capability;
- which contract cannot be met;
- work already completed safely;
- the nearest safe route or prerequisite.

Never silently degrade durable artifacts, verification independence, mutation safety, or human gates.

### Stop, escalation, and completion

Stop before execution when route approval is absent or stale. Stop during execution for an unresolved human decision, material scope change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-substitutable capability, or evidence-backed blocker.

Dependent work remains undispatched after a shared-assumption failure. Return the issue to its owning stage; the router does not redesign the contract.

Completion is a route result, not a router assertion. Before presenting completion, require the governing stage/backend to supply authoritative artifact status plus observed implementation, smoke, verification, integration, and review evidence appropriate to the chosen lane. The router may summarize that evidence and report real residual risk; it cannot infer completion from a handoff, unintegrated branch, or partial check.

Continual learning follows the project-scoped terminal gate when eligible. The router and every downstream stage must never modify user-level `AGENTS.md`.

### Separation from the implementation backend

The router decides **where work should go next** and obtains route approval. The implementation backend decides **how approved executable work is run**: single owner, local batch, or full orchestration; task state; retries; worker/verifier/integrator dispatch; and execution completion. Neither duplicates the other.

The router's final name is `eng-flow`; its canonical installed directory is `.config/agents/skills/eng-flow/`.
