# Dev workflow authority and routing

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-16  
**Decision IDs:** D01, D02, D05, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D26

## Scope

This record governs the generic engineering workflow's durable authority, route classification, approval and reapproval, ownership boundaries, clean cutover, human presentation, explicit permanent-test-audit intake, and shipping boundary. It applies to `dev-ask`, its current human workflow projections, active workflow ADR discovery, generic completion callers, and lifecycle skills that return to the router. It grants no product, implementation, destructive-effect, delivery, or shipping authority.

## Context / problem

The workflow needs one current route and one durable explanation of its boundaries. Without explicit ownership, a router can become a second implementation controller, stage returns can create ceremonial approvals, projections can masquerade as authority, and completion can expose internal transport instead of the human result. The workflow must remain lean while preserving human control of consequential decisions and an exact stop when current authority is insufficient.

## Decisions

### D01 — Durable decision authority

- **Decision:** Keep focused ADRs under `docs/adr/` and one stable `docs/adr/INDEX.md`. The index exposes active records and supersession links. ADRs preserve decisions and rationale; they are not runtime, a queue, or attempt history.
- **Why:** Focused ownership keeps current authority discoverable without loading unrelated history.
- **Rejected alternatives:** One growing decision ledger, transcripts, memories, plans, Handoffs, and source notes are too broad, mutable, or instance-specific to own durable workflow decisions.
- **Consequences:** Rejected and superseded records remain history but never execute.
- **Reopen when:** ADR storage, registry, status, or supersession semantics change.

### D02 — Approval model

- **Decision:** Present one compact prospective Route Overview and obtain one approval before routed or executable effects, including dispatch of bounded `dev-research`. Reapprove only when authority, route, material scope, acceptance, topology or independence, destructive or external effects, shipping, a shared assumption, or equivalent capability changes.
- **Decision:** Requirements request targeted confirmation only when they synthesize or materially clarify human-owned behavior. Faithful research return, specification, ticket, stage, Handoff, review, verification, learning, and presentation continuations need no additional approval.
- **Why:** Approval should track human decisions and effects, not artifact count or phase transitions.
- **Rejected alternatives:** Reapproving every return adds waiting without changing authority; letting the first approval cover later consequential changes infers authority the human did not grant.
- **Consequences:** Byte drift triggers semantic comparison. Unrelated or non-material drift does not reopen the route.
- **Reopen when:** The material trigger list or targeted-confirmation boundary changes.

### D05 — Grilling bound

- **Decision:** Use grilling only when the user asks to refine, challenge, compare, validate, or choose a candidate plan, design, approach, or hypothesis. Ask the complete current load-bearing decision frontier in each round.
- **Why:** Complete-frontier rounds reduce latency while preserving existing owners for factual lookup, requirements, diagnosis, and implementation.
- **Rejected alternatives:** One-question rounds serialize independent decisions; blanket grilling duplicates other owners.
- **Consequences:** Ordinary ambiguity and settled work do not acquire an interview stage.
- **Reopen when:** Grilling intent or frontier composition changes.

### D10 — Sole thin, stateless router

- **Decision:** `dev-ask` is the sole generic engineering router. While acting in that role, the route-owning agent classifies, presents one route approval, starts only the first owner, handles material reapproval, validates terminal success, constructs the five-field completion fence, and applies the presenter in the same agent. Delegated first owners are dispatched; when implementation is reached, the route-owning agent activates `dev-implementation` in place by default, including after unchanged prerequisite continuation. Standalone implementation likewise uses the invoking agent as controller.
- **Decision:** The router role owns no execution state, implementation, semantic repair, audit opinion, learning policy, rendering policy, or workflow ledger. In-place controller activation is a role change under approved authority, not router-owned stage work, and creates no self-Handoff. A separate implementation controller is valid only when the current approved topology explicitly binds it.
- **Decision:** `dev-test-audit` is a separate explicit read-only route. Before its initial Route Overview approval, show the exact scope and ordered list of every in-scope test file and launch no auditor. Normal completion never schedules it. Accepted audit fixes return for one fresh direct or planned mutation approval.
- **Why:** One thin router prevents competing lifecycle authority while keeping specialist procedure in specialist skills; in-place controller activation avoids a ceremonial controller hop without moving controller procedure into the router.
- **Rejected alternatives:** A second router, an unconditionally spawned implementation controller, hidden scheduler, automatic completion-tail audit, or router-owned state store duplicates existing owners. Letting an in-place controller spawn another controller recursively weakens approved topology and double-schedules work.
- **Consequences:** `dev-implementation` remains the semantic route owner while the invoking route agent normally supplies its physical controller identity. Prerequisite next-owner roles remain intact: `dev-implementation` reaches the bound controller, and `dev-ask` reaches the bound router. A completed engineering route is terminal; later cleanup is a new maintenance outcome.
- **Reopen when:** Router ownership, controller-entry topology, explicit audit intake, or terminal normalization ownership changes.

### D11 — Independent workflow dimensions

- **Decision:** Keep lifecycle depth, assurance, and execution topology independent. Compact is the default when no compact disqualifier applies; otherwise use standard or high assurance from consequence evidence. Size or duration alone changes none of these dimensions.
- **Decision:** New implementation boundaries consult the shared read-only policy at `.config/agents/skills/dev-ticketing/references/task-sizing.md`, which alone owns the sizing heuristic. Record a material boundary rationale in existing Route Overview, specification, direct-contract, or plan prose; reading the policy invokes no stage.
- **Decision:** A cohesive one-owner result that fits one reliable fresh context uses a planless direct contract. Necessary multiple owners or dependencies, fan-in, ordered effects or migration, or cross-context recovery at known safe seams require a lean repository plan. Specification remains conditional on missing technical authority; ticketing remains conditional on missing task or dependency ownership; complete specifications and graphs are reused.
- **Decision:** Ordinary planned fan-in is an authored child-owned implementation task. It assembles all task inputs before the complete target's single final review and verification; it does not route through pre-fan-in lineage verification or standalone `dev-integration`.
- **Why:** Consequence, design depth, context fit, and graph execution are different facts.
- **Rejected alternatives:** Letting file count or a rough estimate choose assurance, requiring sizing metadata or runtime quotas, letting task count grant parent semantic work, or imposing standalone verified-lineage integration on ordinary planned assembly couples unrelated decisions.
- **Consequences:** Every code-changing task remains child-owned, planned or direct. A later estimate alone does not authorize an implementation parent to repartition an approved graph.
- **Reopen when:** Assurance selection, task-sizing ownership, plan threshold, or child-ownership topology changes.

### D12 — Human authority at consequential boundaries

- **Decision:** Preserve explicit human authority for product behavior, architecture, material scope, acceptance, topology or independence, destructive and external effects, and shipping.
- **Why:** These choices change what is built or the user's state.
- **Rejected alternatives:** A router, plan, or specialist may not infer consequential authority from procedural evidence.
- **Consequences:** Newly exposed decisions return to the appropriate human owner; unchanged derivation continues.
- **Reopen when:** Human-owned boundaries change.

### D13 — Clean cutover

- **Decision:** Migrate every active caller, skill, rule, focused eval, workflow projection, and active ADR together when a generic contract changes. Remove obsolete files and behavior rather than keeping aliases or compatibility readers.
- **Decision:** The lean cutover has no active proof-recipe, surface-adapter, worker-closure, generation-map, repair-token, continuation-receipt, repeated-review, model-grader, twelve-field-completion, or automatic-plan-archive path. Negative prohibition text and historical records may name replaced behavior without reviving it.
- **Why:** Dual behavior makes authoritative selection impossible.
- **Rejected alternatives:** Compatibility schemas and silent legacy fallbacks preserve contradictory contracts.
- **Consequences:** A remaining active legacy caller is a release blocker; Reconcile and historical archives remain outside this cutover unless separately authorized.
- **Reopen when:** The repository adopts a different migration policy or caller ownership changes.

### D14 — Separate shipping authority

- **Decision:** Staging, commit, push, review request, release, deploy, rollout, and other delivery effects require separate explicit authority. Local completion authorizes none of them.
- **Why:** Delivery changes external state.
- **Rejected alternatives:** Passing checks or an approved review is not permission to ship.
- **Consequences:** Completion reports local evidence only.
- **Reopen when:** Delivery authorization or rollback ownership changes.

### D15 — Semantic ownership and source roles

- **Decision:** Current human and approved product or engineering artifacts own intent within their scopes. Executable skills and rules own live procedure. Lean plans and Handoffs project and transfer authority but do not create it. Active ADRs own durable rationale. `dev-ask/WORKFLOW.md` and `dev-ask/references/execution-flow.md` are non-runtime human projections.
- **Decision:** Retrace is an explicit-only, read-only custom controller for repository agent-harness configuration, not a generic engineering route. Human approval binds its complete scope table and constraints. Each approved scope delegates report-only conversational Reconcile to that same scope child, which owns its nested reviewers; delegation grants correction of that conversational report only. This seam grants no generic routing, implementation, assurance, repository/evidence mutation, or shipping authority and preserves D13's separate authorization for Reconcile changes. Executable Retrace and Reconcile contracts own the custom mechanics; this decision and discovery maps do not execute them.
- **Decision:** External sources and skill-local maintenance journals are provenance only. ADR-0004 D23 owns the human-map and maintenance-journal authority relationship.
- **Why:** One semantic owner per concern prevents stale projections from controlling execution.
- **Rejected alternatives:** Runtime-loading maps or journals, or treating plans and Handoffs as independent authority, creates competing owners.
- **Consequences:** A projection mismatch is an edit-time defect and stops rather than overriding executable prose.
- **Reopen when:** Artifact ownership or source precedence changes.

### D16 — Iterative grilling completion

- **Decision:** Bound grilling by its decision tree, not a fixed round count. After each complete-frontier round, wait for the user's answers and recompute. Finish when the frontier is empty and shared understanding is confirmed, or return the exact frontier for a pause, blocker, or repeated no progress.
- **Why:** New dependencies may require further rounds while unchanged questions are not progress.
- **Rejected alternatives:** A fixed round cap can truncate decisions; an unbounded scope has no completion condition.
- **Consequences:** User confirmation completes decision evidence but is not another Route Overview approval.
- **Reopen when:** Interview completion or stop semantics change.

### D17 — Optional external-intake triage

- **Decision:** Use `dev-triage` only for explicitly requested raw external issue or pull-request intake. Project-authored tickets and repository plans skip it. Tracker mutation keeps its own external-effect gate.
- **Why:** External intake may need normalization without imposing tracker ceremony everywhere.
- **Rejected alternatives:** Mandatory triage duplicates already qualified work.
- **Consequences:** Triage returns qualified evidence to `dev-ask`; it is not a lifecycle phase.
- **Reopen when:** Triage becomes mandatory or tracker authority changes.

### D18 — Compact approval and completion presentation

- **Decision:** The Route Overview has exactly `Goal`, `Route`, `Plan`, `Safety`, and `Approval`; informational routes omit `Approval`. Terminal completion renders exactly `Outcome`, `Changes`, `Checks`, `Risks`, and `Next` from one valid same-turn fence.
- **Decision:** `Checks` contains material direct and assurance evidence, every material Papercut result or `Papercut: none`, and exactly one normalized Learning line. Planned completion names the current active plan as `DONE`.
- **Why:** Five human fields expose the decision and result without internal transport machinery.
- **Rejected alternatives:** Large reports and internal proof identities obscure the outcome; incomplete or stale input must remain a stop.
- **Consequences:** The generic presenter validates and renders only; the caller owns success and values.
- **Reopen when:** Route approval or completion fields change.

### D19 — Ordered route presentation

- **Decision:** Render every prospective `Route` as a numbered list with one owner per line and the literal final marker `completion-presentation`. The marker is never dispatched and receives no task, state, approval, or Handoff.
- **Why:** Ordered lists preserve sequence without implying a second lifecycle owner.
- **Rejected alternatives:** Inline chains are dense and unordered lists lose order.
- **Consequences:** Completed reports contain no prospective Route.
- **Reopen when:** Route ordering or presenter ownership changes.

### D20 — Recommended route and conditional decision support

- **Decision:** Present one recommended route by default. Show two or three candidates only when multiple valid routes remain and the choice is a human-owned trade-off. Ask one gating question only when one fact changes the first owner.
- **Why:** The catalog stays available without choice theatre or router interviews.
- **Rejected alternatives:** Always showing candidates burdens predictable choices.
- **Consequences:** Research, requirements, diagnosis, and implementation retain their distinct near misses.
- **Reopen when:** Route-discriminating authority changes.

### D26 — Lean ordinary implementation path

- **Decision:** Eligible compact work uses `dev-implementation → completion-presentation`. Attempt 1 includes the implementation child's one code-then-test rethink, direct checks, one lean Handoff, and one papercut look. Compact dispatches no independent review, verifier, learning, or audit and records `Learning: skipped for compact`.
- **Decision:** Compact may be planless when one child owns the cohesive result. An authored plan still uses child ownership and the same lean task contract but adds no assurance tail.
- **Decision:** Ordinary planned standard/high work uses `dev-specification → dev-ticketing → dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation`; an authored implementation task owns any fan-in before final assurance.
- **Why:** Bounded direct work should avoid graph and assurance ceremony while preserving a real changed-path check, and ordinary planned work should assemble once before final assurance.
- **Rejected alternatives:** Requiring a plan or independent assurance for every small reversible change adds cost without a disqualifying consequence; pre-fan-in verification and ordinary standalone integration duplicate the authored implementation task.
- **Consequences:** Direct work never manufactures a plan; planned compact work remains work-only.
- **Reopen when:** Compact eligibility, direct proof, or plan threshold changes.

## Affected contracts

- `.config/agents/skills/dev-ask/SKILL.md`, `WORKFLOW.md`, and `references/execution-flow.md`.
- `dev-specification`, `dev-ticketing` and its `references/task-sizing.md`, `dev-implementation`, `dev-code-review`, `dev-verification`, `dev-continual-learning`, `dev-test-audit`, `dev-handoff`, `papercut`, and `completion-presentation` at their owned seams.
- The base plan rule, generic completion callers, focused evals, `.agents/AGENTS.md`, and `docs/adr/INDEX.md`.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`, confirmed 2026-09-04; `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`; and the human-approved `local://task-sizing-direct-contract.md`, confirmed 2026-09-06.
- Earlier approved routing and grilling evidence remains historical support where it does not conflict with the current governing revision.
- External sources are advisory and cannot supersede current human authority or executable contracts.

## Human authority

The human-approved lean workflow route authorizes this projection. It does not authorize product decisions, mutation outside the approved target map, delivery, shipping, or changes to Reconcile.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D16 supersedes only D05's former fixed-round interpretation; D05's intent and complete-frontier boundary remain active.

## Verification expectations

- Router cases distinguish direct answers, research, triage, requirements, grilling, diagnosis, implementation, plans, explicit audit, and shipping.
- Sizing cases distinguish a small cohesive direct task, a coupled above-target direct task, context-fit recovery through ticketing, and unchanged projection of an approved graph.
- One approval covers unchanged derivation; only D02 material facts reopen it.
- Compact uses one child rethink, direct checks, one lean Handoff, papercut, and five-field completion.
- Standard and high use one review before one verifier, one learning assessment, and five-field completion.
- Active callers agree and no replaced contract remains authoritative.
