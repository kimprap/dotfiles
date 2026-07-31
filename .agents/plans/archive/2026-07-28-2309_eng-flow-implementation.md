# Eng Flow Implementation Plan

**Datetime**: 2026-07-28-2309
**Scope**: Clean-cutover implementation of the resolved portable adaptive engineering workflow and exact local 28-skill graph under `.config/agents/skills/`
**Summary**: Execute the frozen workflow specification through non-discovered candidate assembly, transactional dual-host cutover, complete conformance, terminal refinement, as-built `eng-flow/WORKFLOW.md`, and evidence-backed cleanup.
**Status**: COMPLETE
**Specification state**: Pass 1 authority is frozen; the dependency-ordered Pass 2 execution graph is appended below

## Context and pass boundary

This specification collapses the authoritative resolved Wayfinder map at `.scratch/adaptive-agent-workflow/map.md` into the implementation contract for a harness- and model-agnostic adaptive engineering flow. The end state accepts an approved external product brief/PRD, a settled engineering request, or a bounded maintenance objective; conditionally establishes build-facing engineering requirements; and moves approved work through specification, implementation, verification, integration, review, learning, and completion.

The sections through **Authority resolutions** are the frozen Pass 1 execution authority. The canonical `## Tasks` checklist and matching T1…TN sections appended after that authority derive execution boundaries without reopening architecture, lifecycle, inventory, ownership, migration, source, or verification decisions.

The resolved ticket answers linked from the map are authoritative except where the user's explicit authority resolutions below supersede their three retained-skill conflicts. Current files under `/Users/kim/.dotfiles` remain authoritative for existing local behavior. Shared skill bodies must remain provider-neutral; live OMP and Grok mechanics belong to verified adapters and evaluation metadata.

## Intended end state and bounded scope

- Install one coherent, clean-cutover 28-skill graph rooted at `.config/agents/skills/`, with `eng-flow` as the single primary engineering router and `eng-implementation` as the separate execution backend.
- Preserve `grill-me`, `grill-with-docs`, and `wayfinder` as explicit expert entry points; rename `grilling` and `domain-modeling` to their final `eng-*` identities; retain unrelated utilities; remove superseded workflow skills and duplicated provider copies without aliases.
- Preserve human authority over product, architecture, destructive actions, and scope. When product authority is unresolved, stop with the exact `PRODUCT AUTHORITY REQUIRED` handoff rather than inventing product strategy.
- Keep research as optional bounded evidence coverage. Atlas is an optional capability, never a repository or harness requirement; broad product discovery belongs to a future separate product flow.
- Complete initial live OMP/Grok conformance, then the terminal 28-skill audit/refinement, the first terminal full matrix, canonical as-built `eng-flow/WORKFLOW.md` plus its conditional pointer, and the second terminal full matrix on the resulting live revision.
- Never modify user-level `/Users/kim/.agents/AGENTS.md`. No workflow role, skill, hook, adapter, migration step, or learning process may bypass that prohibition.

## Authoritative inputs

- Resolved map and ticket index: `.scratch/adaptive-agent-workflow/map.md`, especially standing decisions at lines 13–32 and resolved ticket links at lines 37–56.
- Local skill source of truth: `.config/agents/skills/` and every live local file/reference identified by the migration inventory.
- External source revisions, exact local adaptations, licensing treatment, and harness evidence are pinned below after reading the linked research and cutover tickets.

## Final skill inventory

The canonical root is `.config/agents/skills/`. It contains exactly the following 28 directories, each with one canonical `SKILL.md` whose frontmatter `name` equals the directory basename:

```text
craft-name
craft-rule
craft-skill
eng-code-review
eng-codebase-design
eng-continual-learning
eng-diagnosing-bugs
eng-domain-modeling
eng-flow
eng-grilling
eng-handoff
eng-implementation
eng-improve-codebase-architecture
eng-integration
eng-prototype
eng-requirements
eng-research
eng-shipping
eng-specification
eng-tdd
eng-ticketing
eng-verification
grill-me
grill-with-docs
improve
mnemopi-cleanup
mnemopi-retain
wayfinder
```

Disposition is exact:

- **Add**: `eng-flow`, `eng-requirements`, `eng-research`, `eng-specification`, `eng-ticketing`, `eng-implementation`, `eng-handoff`, `eng-verification`, `eng-integration`, `eng-code-review`, `eng-shipping`, and `eng-continual-learning`.
- **Rename with full contents and no alias**: `grilling` → `eng-grilling`; `domain-modeling` → `eng-domain-modeling`. Update frontmatter identity and every live skill-name reference. Preserve the Wayfinder domain value `Type: grilling`, ordinary prose, source names, and historical citations where they are not installed-skill references.
- **Retain path with narrow updates**: `grill-me` delegates only to `eng-grilling`; `grill-with-docs` delegates to `eng-grilling` plus `eng-domain-modeling` and preserves human confirmation before durable writes; `wayfinder` names both renamed capabilities, preserves its `grilling` domain value, and removes the Notes execution override so it is planning-only; `eng-diagnosing-bugs` stops after a bounded fix contract, blocker, or architecture finding and never applies the fix; `eng-prototype` returns decision evidence without folding into real code or prescribing branch transport; `eng-improve-codebase-architecture` routes qualifying glossary/context/ADR writes through the human-confirmed `eng-domain-modeling` gate; `craft-skill` updates live eval/example references that mean the installed discipline.
- **Retain without lifecycle expansion**: `craft-name`, `craft-rule`, `eng-codebase-design`, `eng-tdd`, `improve`, `mnemopi-cleanup`, and `mnemopi-retain`. Preserve all other behavior and supporting files. The narrowly updated retained paths above are otherwise preserved.

The 22 workflow-facing skills are `eng-flow`, the three expert entries, the two renamed disciplines, the 11 added stage/backend authorities, and `eng-codebase-design`, `eng-improve-codebase-architecture`, `eng-prototype`, `eng-tdd`, and `eng-diagnosing-bugs`. The six retained utilities are `craft-name`, `craft-rule`, `craft-skill`, `improve`, `mnemopi-cleanup`, and `mnemopi-retain`.

Do not add or retain `ask-matt`, `router`, `flow`, `eng-workflow`, `eng-product-definition`, `implement`, `to-spec`, `to-tickets`, `eng-orchestrate`, `eng-smoke-test`, `eng-ci-recovery`, `eng-resolving-merge-conflicts`, `eng-review-and-ship`, source-repository plugin roots, generated semantic wrappers, provider-specific body copies, or a parallel versioned root. `eng-workflow` is an uninstalled naming backup only. Smoke belongs to worker/backend completion, CI recovery to `eng-shipping`, conflict convergence to `eng-integration`, and review and shipping remain separate.

Source: resolved tickets 09 and 14.

## Router, backend, and lifecycle interfaces

### `eng-flow`: primary interface

`eng-flow` is a thin, stateless, always-safe-to-invoke classifier and dispatcher. Its interface accepts an ordinary engineering request plus bounded evidence available from the conversation, working-directory identity, explicitly referenced artifacts, approved artifact identities/revisions, a structured resume baton, and live host capability inventory. Evidence precedence is: current explicit user intent; current canonical approved artifacts; current baton; repository/conversation evidence. A conflict with approved authority is a change request routed to that authority owner, never a silent override.

The router performs bounded read-only classification only. It owns no stage procedure, product development, engineering requirements, engineering specification, implementation, verification, durable run state, artifact index, approval ledger, or continual-learning write. It persists nothing; resume rereads canonical artifacts and the latest valid baton.

Every invocation, including direct answers and explicit stage requests, returns this exact short Route Overview before action:

```markdown
Goal: <one-sentence interpretation>
Route: <ordered stage owners or `direct answer`>
Why: <decisive routing facts and included/skipped nontrivial stages>
Artifacts: <expected durable outputs or `none`>
Gates: <known human, destructive, scope, or capability stops>
Execution: <initial mode; default `one owner`>
First action: <next concrete operation>
```

The router requests approval of that exact overview. Only an unambiguous affirmative tied to the current overview approves it. A caveat, modified constraint, conflict, topic continuation, unrelated message, or silence is not approval. Immediately before dispatch, reread every load-bearing artifact/capability identity named by the overview; drift invalidates approval and requires a recomputed overview.

A user-named stage is a strong preference, not gate bypass. Validate prerequisites and add only the smallest missing prerequisite path. If one fact changes the first owner, ask only that gating question; if several materially different routes remain, present 2–3 options and one recommendation. Full intent clarification belongs downstream to `eng-grilling` or `eng-requirements`.

After approval, dispatch exactly one first owner or execute the approved direct answer. Downstream stages pass a structured baton automatically while the next owner and prerequisites match the approved route. The baton is the latest valid common Handoff plus its next-receiver/precondition fields; there is no separate competing baton schema. Re-enter `eng-flow`, recompute from artifacts/baton, and reapprove when the next owner is ambiguous, the route changes materially, a product/architecture/destructive/scope decision appears, a shared assumption breaks, a required capability becomes unavailable, canonical authority drifts, or completion is claimed. The router presents completion only from backend/stage terminal evidence; it never infers completion from a handoff, partial check, scaffold, or unintegrated result.

### Route gates and lifecycle

Evaluate gates in this order:

1. **Safety/requested action** — distinguish read-only advice/investigation from mutation; surface destructive, credential, and permission gates.
2. **Fog** — use `wayfinder` when the destination or decision route cannot fit one reliable context. A resolved map returns through authority/requirements/specification; it never enters implementation directly.
3. **Product authority/requirements** — unresolved product strategy stops with `PRODUCT AUTHORITY REQUIRED`; sufficient product authority with incomplete observable behavior, acceptance, engineering scope, or constraints enters conditional `eng-requirements`.
4. **Expected behavior** — diagnose only after expected behavior is settled; route missing engineering expectations to requirements and true product ambiguity to product authority.
5. **One-context decisions** — use `grill-me` for stateless intent decisions and `grill-with-docs` for codebase intent, terminology, or architecture decisions; skip interviewing when authority is complete.
6. **Artifact depth** — choose direct implementation, specification/tickets, or Wayfinder.
7. **Execution topology** — `eng-implementation` chooses one owner, small batch, or full orchestration.

Supported route outcomes:

- Direct read-only answer when current evidence suffices.
- `eng-research` for bounded factual lookup/synthesis; research returns cited evidence to the requesting owner and never decides product or engineering authority.
- `PRODUCT AUTHORITY REQUIRED` when customer, market, positioning, pricing, business model, roadmap, launch, growth, product scope, or product success remains unresolved.
- Conditional `eng-requirements` for build-facing behavior, acceptance, scope, constraints, and owned engineering questions.
- `eng-diagnosing-bugs` for hard bugs/performance regressions after expected behavior is settled; it establishes evidence and returns a bounded fix contract, blocker, or architecture finding without mutating the target. Known bounded fixes may skip diagnosis and enter implementation directly.
- `eng-improve-codebase-architecture` for survey/selection only, then return the selected change through intent/requirements gates; `eng-codebase-design` is a reusable discipline, not a mandatory stage.
- `eng-prototype` only as a fresh-context decision-fidelity detour from requirements, grilling, or specification; return observed evidence to the owning stage, do not fold the result into real code, and express preservation/isolation as adapter-neutral artifact identity rather than branch commands.
- **Direct implementation lane** when authority/architecture/acceptance are settled, one cohesive fresh-context owner suffices, no durable recovery/task graph is required, shared-interface/migration/destructive effects are absent or approved, and verification is concrete. The approved overview plus acceptance/verification context is its executable authority.
- **Specification/ticket lane** when multiple contexts/owners, independent slices/fan-in, shared interfaces/migrations/cross-cutting behavior, durable recovery, or durable acceptance/test-seam confirmation require stable authority. `eng-specification` creates a human-approved revision-bound engineering specification; `eng-ticketing` derives human-approved dependency-wired vertical tracer-bullet tickets.
- **Wayfinder lane** when the route itself is not yet specifiable; it remains planning-only.

Once executable authority exists, the spine is: implementation backend → bounded implementation → implementer smoke → independent verification → neutral integration when multiple lineages exist → final Standards/Specification review → terminal continual-learning assessment → evidence-backed local completion → separately authorized shipping when requested. `eng-handoff` is cross-cutting only when context/recovery/ownership transfer requires it; it points to canonical artifacts rather than duplicating them.

Stop before execution when route approval is missing/stale. Stop during execution for unresolved human authority, material scope/route change, destructive approval, broken shared contract, irreconcilable authority conflict, unavailable non-equivalent capability, unsafe/ambiguous partial effects, or an evidence-backed blocker. Do not dispatch dependency descendants after a shared-assumption failure.

### `eng-implementation`: backend interface and state

The backend accepts only an approved direct contract or approved implementation tickets bound to current governing PRD/engineering-specification revisions when present. Intake rejects missing/stale/conflicting authority, unbounded scope, non-observable acceptance, absent verification recipes, cyclic/unnamed blockers, unsettled interfaces/ownership, missing human approvals, or insufficient host capability; return defects to the owning lifecycle stage rather than repairing authority in place.

Mode selection uses topology, coordination, and recovery:

- **One owner — default**: one cohesive fresh-context owner; keep coupled files/interfaces/reasoning together and never invent parallel slices.
- **Small local batch**: a few ready, genuinely independent slices with settled interfaces, disjoint behavioral/state ownership, concrete acceptance, low contention, and one coordinator able to observe one or two bounded waves. Sequential execution with identical task/handoff boundaries is the adapter fallback when safe concurrent isolation is unavailable.
- **Full orchestration**: approved recursive decomposition, many dependency waves, long-running isolated work, durable cross-context recovery, persistent operator-visible state, or neutral integration across multiple lineages. A flat list, raw task count, token estimate, or available delegation is insufficient.

The backend may disclose a contract-preserving downgrade to a simpler mode in its baton. Escalation from one owner to batch or batch to full is a material route change and returns to `eng-flow` for a revised overview and human approval.

Project approved work into Task Contracts without redesign. Operational subdivision is legal only when the parent explicitly delegates decomposition; every child preserves the parent authority/scope/acceptance/verification and the non-coding subplanner stays inside that envelope. Dependencies carry declared artifacts/handoffs, never ambient sibling state.

Use proportional state: one owner needs only governing authority plus final baton; small batch records projections, owners, dependencies, attempts, and handoff locations in recoverable coordinating/adapter state, with repository persistence only when the run must outlive context; full orchestration persists a provider-neutral logical graph and restartable attempt/handoff state. Runtime projection never supersedes PRD/specification/ticket authority.

Exact task state machine:

```text
pending → ready → running → handed-off → verified
verified → integration-pending → integrated
verified|integrated → reviewed → complete
pending|ready|running|handed-off|verified|integration-pending|integrated|reviewed
  → blocked|failed|cancelled
```

Transitions are strict: blockers complete plus declared revisions available before `ready`; exactly one owner/attempt at `running`; bounded result plus implementer smoke before `handed-off`; fresh criterion-level proof before `verified`; exact verified lineages plus neutral combination and integrated smoke before `integrated`; final Standards/Specification pass before `reviewed`; current terminal accounting/evidence with no pending, blocked, failed, stale, unverified, unintegrated, or unreviewed required work before `complete`. Outcome mapping is exact: worker `completed` plus evidence → `handed-off`; `blocked|transport-unavailable|authority-change-required` → `blocked`; `failed|timed-out` → `failed`; `cancelled` → `cancelled`; verifier nonconformance moves its target `handed-off → failed` while the verifier emits a completed failing Handoff; semantic integration conflict blocks the integration task while verified inputs remain historical, insufficient lineages.

`blocked → ready` requires evidence that the blocker is resolved and all authority/input revisions remain current. `failed → ready` requires explicit backend retry authorization. `cancelled` never reopens; renewed work uses a new task revision. A complete result invalidated by changed upstream authority remains historical evidence while its replacement begins `pending`. Retry history is append-only under unchanged authority.

Run projection is `accepted → ready → running → verifying → integrating? → reviewing → complete`, with recoverable `blocked|failed` and non-reopening `cancelled` branches. Dispatch only the ready frontier; collect one Handoff per task/attempt; verify independently; integrate named lineages when required; review the exact verified result; run terminal curation; return exact terminal evidence and artifact/task status to `eng-flow`.

### Harness adapter seam

Shared workflow owns semantics. Thin external harness profiles own transport. The conceptual interface is:

```text
profile() → Capability Profile
dispatch(Task Contract, Context Pack, Role Profile) → Attempt Handle | Handoff
observe/control(Attempt Handle) → Attempt State | Handoff
recover(Run Reference) → Logical Graph + Attempts + Handoffs
```

`profile` is mandatory; `dispatch` is mandatory for executable routes; `observe/control` is required only for asynchronous/cancellable work; `recover` is required only for durable-recovery claims. Each capability reports `native`, `contract-equivalent`, or `unavailable`, plus constraints and whether availability is live-verified or documentation-inferred. Filesystem/config presence is never proof of invocability.

Every route requires truthful capability reporting, an explicit workflow approval channel, current authority access, immutable revision/digest identity, single-role execution, observed evidence, complete structured return, and honest failure. Mutation additionally requires collision-safe target writes preserving unrelated work. Optional capabilities include fresh read-only roles, concurrency, dependency scheduling, messaging, isolation, multiple lineages, cancellation, durable recovery, recursive subplanning, research/tracker/vault access, and task-specific code tools.

Transport precedence is live-verified native → direct contract-equivalent → safe disclosed downgrade → stop. Safe fallbacks may serialize ready work, use another collision-safe identity mechanism, collapse to bounded synchronous execution, omit optional research, or use a verified external/manual independent verifier. Never claim batch/full orchestration, durability, independent verification, mutation, or support when the corresponding invariant cannot be preserved.

Adapters exclusively own discovery/invocation syntax, provider metadata, configured role/model bindings, IDs/tokens, observation/cancellation, concurrency/rate limits, isolation/storage/merge mechanics, tool schemas, credentials references, and actual execution metadata. Shared `SKILL.md` bodies contain none of those provider-specific details. A harness-specific wrapper may point to the canonical body but may not duplicate or alter semantics.

Sources: resolved tickets 04–06 and 08.

## Contract model and authority

### Product authority, engineering requirements, and research

`eng-flow` accepts: a human-approved external product brief/PRD; a settled engineering request with clear product authority; or a bounded non-product objective such as a bug, security repair, maintenance, migration, refactor, internal tooling, reliability, or architecture improvement. A PRD is not mandatory for non-product engineering work.

External product authority owns opportunity/customer/market validation, target market, strategy, positioning, business model, pricing, prioritization, roadmap, launch/go-to-market, sales, success measures, growth, and the approved product brief/PRD. `eng-requirements` owns only the observable bounded engineering contract. `eng-specification` owns architecture, interfaces, data/implementation decisions, technical seams, and test strategy.

When product authority is missing, return exactly:

```text
PRODUCT AUTHORITY REQUIRED
Unresolved decisions: <specific product questions>
Current safe evidence: <artifact/evidence references>
Next owner: <human product owner or future product flow>
Resume input: <approved product brief/PRD revision or explicit settled decision>
```

The router does not interview around this stop, infer assumptions, or create a substitute PRD. Conditional `eng-requirements` may establish only expected observable behavior/outcome; already-authorized actors/systems/context; acceptance and failure boundaries; engineering scope/non-goals; applicable compatibility, migration, preservation, security, privacy, reliability, performance, and operational constraints; evidence versus explicit assumptions; and unresolved engineering questions with owners/blocking status. It may call bounded research, grilling, domain-modeling, or prototype support without expanding product scope.

Bind directly to an already-sufficient approved artifact. One-context direct work may use the approved Route Overview plus explicit acceptance. Otherwise create one revision-bound Engineering Requirements Brief through the configured tracker adapter. Any synthesized/materially clarified requirement needs explicit human approval. A material product change returns to external authority; a revised product artifact forces affected requirements/specifications/tickets to rebind or regenerate and regain required approval.

`eng-research` owns question framing, primary-source investigation, contradictions/gaps, synthesis, and citations. Active hosts own web/browser/model/job transport. Atlas is an optional adapter for durable source identity, evidence/provenance artifacts, topic routing, freshness, refresh, and topic lookup only when the workspace/user configuration exposes a qualified capability:

- `current` topics may answer with source-artifact citations.
- `dirty`, `refreshing`, or `blocked` stops with freshness details; refresh is an explicit separate action.
- Missing/insufficient topics may use direct portable research.
- Persist to Atlas only for Atlas-scoped work or explicit durable-capture opt-in; otherwise use the repository's normal cited research artifact.
- Until Atlas Plan A proves an operation, treat advertised-but-undispatched capability as unavailable. Scheduling/daily acquisition belongs to Atlas or an external adapter after its contracts exist, never shared research behavior.

No domain artifact is scaffolded by this workflow. Create root `CONTEXT.md` only after human confirmation of the first canonical domain term; create `CONTEXT-MAP.md` only when multiple bounded contexts actually require separate glossaries; create `docs/adr/` only for a human-confirmed decision that is simultaneously hard to reverse, surprising without rationale, and the result of a real trade-off. The resolving session owns the qualified write through `eng-domain-modeling`.

Sources: resolved tickets 03, 15–17.

### Capability and artifact ownership

| Authority | May own/change | Must not do |
|---|---|---|
| Router (`eng-flow`) | Classification, Route Overview, approval/reapproval, first dispatch, evidence-backed presentation | Run stage procedures; keep execution state; decide product/architecture/scope/destructive matters |
| Backend (`eng-implementation`) | Mode selection, task projection, runtime state, ready-frontier scheduling, attempts, recovery, evidence aggregation | Redesign approved authority; duplicate leaf procedures; make final user-facing route/product approval |
| Planner/subplanner | Minimum coherent executable graph; bounded child decomposition when explicitly delegated | Code, mutate targets, self-verify completion, or decide product/architecture/scope/destructive matters |
| Worker | One immutable task revision, in-scope implementation details, diagnosis/repair, implementer smoke | Delegate; redesign task/shared contracts; alter canonical authority; independently verify; integrate siblings; complete the run |
| Verifier (`eng-verification`) | Fresh read-only criterion execution and truth verdict on an immutable target | Edit, repair, reformat, stage, merge, or trust worker reasoning/conclusion as authority |
| Integrator (`eng-integration`) | Named neutral fan-in of exact verified lineages; explicitly authorized semantics-preserving mechanical conflicts; integrated smoke | Add missing behavior; repair workers; choose semantic/product/architecture/interface winners; drop a lineage |
| Reviewer (`eng-code-review`) | Read-only Standards and Specification verdicts/findings against exact verified target | Repair, ship, substitute prose for observed proof |
| Shipper (`eng-shipping`) | Only explicitly authorized staging/commit/push/PR/release/deploy/rollout and complete-required-check-set recovery | Infer shipping authority from local completion; bypass hooks/checks; combine with review authority |
| Curator (`eng-continual-learning`) | One terminal assessment; qualifying narrow updates to an existing project-owned `AGENTS.md`, skill, or rule; validation | Create guidance/artifacts without approval; broaden interfaces; decide product/architecture/scope; edit code; write user-level `AGENTS.md` |

One canonical stage owns each durable artifact/gate: external product owner → product brief/PRD; `eng-requirements` → Engineering Requirements Brief; `eng-specification` → approved revision-bound engineering specification/test seams; `eng-ticketing` → approved dependency-wired tickets; backend/planner → derivative executable Task Contracts/state; each role attempt → Handoff; verifier → criterion evidence/verdict; integrator → combined identity/integration evidence; reviewer → final axes; curator → curation handoff; backend → terminal evidence index; shipper → separately authorized delivery/CI/rollback evidence.

### Task Contract and Context Pack

The deep orchestration seam is exactly:

```text
backend → Task Contract + Context Pack → role
role → Handoff → backend
```

Each Task Contract is structured Markdown with fixed semantics:

```markdown
# <human-readable task name>
## Authority
- Governing artifacts and exact revisions/digests
- Parent task when decomposed
- Required human approvals
## Objective
<one observable bounded outcome>
## Role
<planner | subplanner | worker | verifier | integrator>
## Ownership
- May read
- May change or produce
- Must not change
- Shared interfaces or state that remain fixed
## Dependencies
- Blocking task names
- Exact upstream handoffs/artifact revisions required
## Acceptance
- Observable criterion per bullet
## Verification
- Required scenario/check and evidence form per criterion
## Execution policy
- Decomposition permission
- Isolation/integration needs
- Material decision gates
## Completion output
- Required artifacts
- Required handoff receiver
```

Authority is referenced, not copied. Ownership includes behavioral/state authority; path disjointness alone is not independence. Acceptance states what is observable; Verification states how to establish it. Semantic fields are immutable within an attempt; a material correction creates a new task revision and invalidates downstream readiness based on the old revision. Runtime owner/model, IDs, timestamps, counters, and branch/process details are adapter/backend metadata.

Each attempt receives a minimal revision-bound Context Pack containing: exact Task Contract revision; governing artifact links/revisions; task-declared dependency handoffs; bounded repository/environment context; applicable project rules/safety constraints; and expected receiver/Handoff contract. Exclude ambient sibling state, orchestration transcripts, speculative notes, stale summaries, and prior reasoning. The receiver checks revisions at dispatch and returns staleness to the backend.

Semantic context travels only through canonical artifacts and declared dependency handoffs. Fan-out consumers receive the same upstream revision; fan-in names every required handoff; arrival order has no precedence. Operational alerts may report collision/blocker/staleness/safety to the backend but create no semantic authority. Precedence is: current human decisions/safety → current governing PRD/spec/ticket → project rules/current repository state → declared dependency handoffs → task-local choices → adapter metadata/incidental observations. Preserve unexpected repository changes as external work.

Source: resolved ticket 07.

### Handoff, attempts, recovery, and failure

Every attempt emits one compact structured Handoff, including non-success:

```markdown
# Handoff: <task name>
## Outcome
- Task revision
- Attempt
- Outcome class
- Exact produced/inspected revision
## Authority checked
- Governing/dependency revisions used
- Stale, missing, or conflicting authority
## Result
- Observable result
- Artifacts changed, produced, or inspected
- Behavioral/contract effects
## Evidence
- Criterion → exact check/scenario → observed result
- Evidence/log/artifact references
## Decisions and assumptions
- Bounded implementation choices
- Assumptions confirmed or disproved
## Risks and unresolved items
- Blockers, failures, residual risks, required authority changes
## Next receiver
- Role/task allowed to consume this handoff
- Preconditions still required
```

Role additions: planner/subplanner include graph/child revisions, acceptance accounting, dependency rationale/gates; worker includes changed artifacts/effect/smoke/choices/risks/split request; verifier includes exact target, criterion evidence, fixtures, reproduction, verdict; integrator includes all inputs/conflicts/permitted resolutions/combined revision/integrated smoke. Link canonical decisions and concise evidence; do not paste transcripts/secrets. A Handoff never expands receiver authority.

Attempt outcomes are exactly `completed`, `blocked`, `failed`, `timed-out`, `cancelled`, `transport-unavailable`, and `authority-change-required`. A semantic attempt begins when the role starts output-producing reasoning/work; once mutation/external effect may have begun, it counts. A pre-semantic transport failure is separately recorded.

Classify before retry: local implementation defect; context/process defect; shared-assumption defect; authority defect; integration conflict; external blocker; transport failure; or timeout/stall. Every retry records evidence, a falsifiable changed hypothesis, and what differs.

Maximum for one unchanged Task Contract revision:

```text
attempt 1: initial bounded implementation
attempt 2: optional same-owner repair
attempt 3: final fresh-context implementation, optionally stronger
```

Attempt 2 requires reproduced exact failure, current authority, a fast deterministic/high-reproduction red/green loop with no hidden human step, and no context fixation/contamination. Otherwise skip it and use the final fresh-context attempt; the unused slot does not become another retry. Attempt 3 receives a fresh Context Pack plus concise failure evidence, independently re-establishes the loop, and uses a stronger capability profile only when evidence shows reasoning/context capability was insufficient. Stop earlier for safety, authority, idempotence, unsafe partial effects, or no plausible changed approach. Exhaustion leaves `failed` and requires human/planner escalation.

Adapters may make at most two short extra transport retries only before semantic work/mutation, when replay is safe/idempotent, failure is plausibly transient, and every error is recorded. Then block or safely reroute; never rotate accounts/providers or retry indefinitely without configured authority.

On upstream failure/shared-assumption break, mark the source, stop its transitive dependency cone, safely cancel running descendants, mark invalid-context output stale/non-consumable, preserve attempt/partial diagnostics, return to the authority owner, and create revised tasks only after authority is current. Independent branches continue only when authority, inputs, safety, ownership, and eventual integration target are demonstrably unaffected. Partial/failed/timed-out/cancelled/stale/transport-interrupted output is diagnostic only; salvage needs explicit planner authorization into a new fully verified revision.

Timeout records cancellation status, last heartbeat/progress, base/current/partial revisions, running operations, and external effects. Retry/resume only after idempotence, ownership, and partial-effect safety are established. Ambiguous, irreversible, non-idempotent effects or uncertain process termination require human review. Missing credential/account/permission/service/hardware/manual capability blocks and reports the live absence check, non-secret expected configuration location, tried equivalents, smallest human prerequisite, unaffected branches, and ready condition; agents never fund/authenticate accounts or expose secrets.

Every non-success Handoff additionally records failure outcome/class and pre/post task state; semantic attempt/max and transport retries; all exact revisions/heartbeat/effects; symptom, feedback scenario, reproduction rate, hypotheses/probes; idempotence, diagnostic-only status, preservation/staleness; quarantined/continuing descendants and integration impact; retry eligibility/changed approach/freshness/capability rationale; required owner action and exact resume condition.

Sources: resolved ticket 11.

### Smoke, verification, integration, review, shipping, and completion

Before execution, each observable acceptance criterion declares falsifiable claim, condition/input, expected behavior/metric/threshold, minimum proof class, target surface/environment, and whether baseline/treatment comparison is required. Worker/verifier may choose the smallest qualifying check but may not lower proof.

Every implementation task runs implementer smoke against its exact produced revision and records scenario/command, environment/fixtures/inputs, expected/observed result, meaningful output/artifact/measurement/screenshot reference, flake rerun status, failure, and uncertainty. Bugs rerun the original red-capable reproduction; performance compares like-for-like baseline/treatment; UI/API/CLI/system changes exercise the user-visible surface when available.

Fresh independent verification is mandatory for changed observable behavior; bugs/regressions; APIs/schemas/shared/compatibility contracts; security/privacy/permissions/auth; data/storage/migration/destructive/external effects; concurrency/recovery/reliability/performance/resources; uncertain/flaky/disputed smoke; every integrated output; and explicit governing requirements. Skip only demonstrably nonbehavioral prose/comments, formatting-only changes, or exact generated refreshes with deterministic identity proof; record reason/revision/evidence. Smallness never justifies skipping.

Verifier verdict is exactly `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE`. Per-criterion proof classes are `live-behavior`, `targeted-test`, `regression-suite`, `measurement`, `build-typecheck`, `static-inspection`, `external-observation`, and `identity-check`; they are not a universal strength ranking. `VERIFIED` requires every criterion at its declared proof with valid target/environment and no contradiction; observed nonconformance is `NOT VERIFIED`; missing/invalid/confounded proof is `INCONCLUSIVE`. Any target change invalidates the verdict until impact and required reruns are established.

Neutral integration starts only with exact `VERIFIED` identities for every required lineage and a task naming all inputs, ordering/precedence, mechanical conflict authority, acceptance, and proof. It emits exact combined identity, every conflict/permitted resolution, confirmation no lineage dropped, integrated smoke, affected criteria/reruns, and semantic risks. Combination creates a new target; fresh post-integration verification covers integration acceptance, every potentially affected input criterion, touched shared interfaces/order/migrations/startup/build/cross-slice paths, and required regression/CI. Reuse evidence only after explicit no-impact analysis.

Final review is read-only against the exact verified single-lineage or post-integration revision:

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

Blocking findings include specification nonconformance; correctness/security/privacy/data-loss/regression risk; violated project rules; stale/unverified/incomplete evidence; unauthorized scope/destructive behavior. Advisories are nonrequired maintainability/naming/style/future improvements that do not threaten contract and remain only as explicit residual risk. Reviewers do not repair. One fresh non-implementer may verify and review low-risk single-lineage work only with separate outputs; high-consequence, integrated, broad/ambiguous, previously failed, bias-prone, or explicitly required work uses separate decorrelated attempts.

`eng-shipping` is a separately approved boundary. Local completion authorizes no stage/commit/push/PR/history rewrite/release/deploy/rollout. When shipping is in scope, require repository/destructive authority, a safe adapter, and delivery/CI/rollout/rollback evidence. CI recovery inspects the complete required-check set, fixes one established cause at a time, reruns the entire set after every revision, distinguishes deterministic/flake/infrastructure/unrelated failure, and never bypasses hooks/checks.

Backend local completion requires current authority/approvals; terminal accounting for every task; implementer smoke; every required criterion `VERIFIED` or a valid deterministic skip; exact verified fan-in and post-integration proof when needed; final Standards and Specification pass; no blocker, stale/partial result, semantic conflict, failed dependency, or required check; satisfied human gates; and a terminal evidence index naming every governing/task revision, worker result/smoke, verification proof/verdict, integration lineage/evidence, review outcome, curation outcome, advisories, deferred authority, residual risk, and proof that no required work remains nonterminal.

Source: resolved ticket 12.

### Continual-learning contract

Curation is a required terminal assessment, not background accumulation: settled high-signal outcome → one neutral assessment → optional narrow project-guidance update → targeted validation/independent review → terminal evidence. Trigger after a human-confirmed resolved decision, approved PRD/spec/ticket set, verified/integrated/reviewed implementation, settled severe postmortem, or explicit durable project correction; never after every message/worker/hypothesis. Exact outcome is `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED`. The first two satisfy the gate; `BLOCKED` preserves the verified implementation but prevents adaptive-workflow terminal completion until resolved or human scope changes.

Any role may emit a non-authoritative Learning Candidate containing proposed durable statement, project scope/destination, source revisions, evidence/verification, recurrence/severity, prevention relationship, sensitivity/redaction, and conflicts/supersession. Qualify explicit durable corrections and verified stable project facts from one occurrence; ordinary process guidance needs two independent settled outcomes unless one severe independently verified safety/data-loss/authority/expensive-failure/high-impact incident justifies prevention. Reject transient IDs/paths/state, guesses, secrets/transcripts, unverified claims, unsettled hypotheses, generic advice, provider details outside adapter docs, and disguised authority decisions.

Exactly one neutral curator reads current guidance, verifies evidence/scope, selects the narrowest existing project-owned destination, updates/merges/removes in place, preserves concurrent work, validates, and emits the curation Handoff. It may modify only an existing canonical project `AGENTS.md` for broad stable workspace facts, an existing scoped rule at its current seam, or an existing skill within its current trigger/purpose. It cannot create a new skill/rule/guidance/domain artifact without human approval, broaden interfaces, change authority, edit implementation code, or bypass scope with memory/hidden files.

Use a project-declared size budget, otherwise at most 12 active curator-managed entries per destination and 3 net-new entries per pass; merge/update/remove before appending. Snapshot/digest and reread before apply; on concurrent change recompute the semantic merge from current content, never last-writer-wins/reset/stale patch. Conflicting qualified candidates return `BLOCKED`. Validate syntax/registration, destination scope/precedence, trigger positives/near misses for material skill/rule changes, duplication/staleness/context cost, and consequential writes independently. Do not recursively curate the curator edit.

The curation Handoff adds this exact payload to the common Handoff:

```markdown
## Curation outcome
CURATED | NO DURABLE LEARNING | BLOCKED
## Source outcome
- Exact decision/specification/task/evidence revisions
## Candidates assessed
- Candidate → qualified/rejected/deferred → evidence
## Guidance changes
- Destination and before/after revision
- Added/updated/merged/removed logical statements
- Budget before/after
## Validation
- Syntax/scope/precedence checks
- Positive and near-miss checks when applicable
- Independent review/evidence
## Reported candidates
- Human-owned, cross-repository, new-artifact, or deterministic-tooling follow-ups
## Residual risk
- Conflicts, stale areas, privacy limits, or unprocessed evidence
```

`NO DURABLE LEARNING` names the exact sources assessed; it is not an empty claim.

**Absolute prohibition:** `/Users/kim/.agents/AGENTS.md` is exclusively human-managed. No router, planner, worker, verifier, integrator, reviewer, shipper, curator, hook, adapter, memory process, migration, or cleanup may create, edit, append, merge, deduplicate, reformat, delete, or indirectly bypass it. Cross-repository candidates are reported to the user with evidence and suggested wording only.

Source: resolved ticket 18.

## Migration, source pins, and cutover

### Immutable inputs and source ledger

Bind every implementation artifact and task to current repository files read at task start, this specification plus the resolved map/tickets, and these immutable external inputs:

- Matt Pocock `skills` commit [`ed37663cc5fbef691ddfecd080dff42f7e7e350d`](https://github.com/mattpocock/skills/commit/ed37663cc5fbef691ddfecd080dff42f7e7e350d), package `1.1.0`, observed 2026-07-28.
- Cursor `plugins` commit [`91be0f994b5de7a75f4d6f2b3b00958126d9195e`](https://github.com/cursor/plugins/commit/91be0f994b5de7a75f4d6f2b3b00958126d9195e), observed 2026-07-28. This later fixed pin in tickets 14/19 supersedes ticket 02's earlier research snapshot `ba7b5907843e1e21ec692418c180e1f912cbf7d3` for implementation; do not merge either moving branch.
- Wilson Lin/Cursor, [“Agent swarms and the new model economics”](https://cursor.com/blog/agent-swarm-model-economics), published 2026-07-20 and accessed 2026-07-28. It has no immutable public revision and is design evidence only.

Selected Matt inputs are the pinned catalog/taxonomy and `skills/engineering/{ask-matt,wayfinder,to-spec,to-tickets,implement,tdd,diagnosing-bugs,research,code-review,resolving-merge-conflicts}/SKILL.md`, `skills/productivity/handoff/SKILL.md`, stable `skills/productivity/grilling/SKILL.md`, and experimental `skills/in-progress/batch-grill-me/SKILL.md`. Adapt lifecycle/artifact boundaries and instruction clarity; do not install upstream names or wholesale directories. Preserve the local frontier-round interview as an explicit local experimental divergence from stable serial grilling.

Selected Cursor inputs are pinned `orchestrate/skills/orchestrate/{references/planner.md,references/handoffs.md,prompts/subplanner.md,prompts/worker.md,prompts/verifier.md,schemas/plan.schema.json,schemas/state.schema.json}`; `cursor-team-kit/skills/{run-smoke-tests,verify-this,loop-on-ci,review-and-ship,make-pr-easy-to-review}/SKILL.md`; and `continual-learning/{agents/agents-memory-updater.md,hooks/continual-learning-stop.ts}`. Adapt only explicit graph/context/handoff/recovery, falsifiable smoke/verification, neutral fan-in, complete-check-set CI, reviewer handoff, and incremental neutral curation disciplines. Do not copy Cursor state schemas/taxonomy/paths as the portable schema.

Current local files override upstream behavior where intentionally adapted: frontier-round grilling; harness-neutral Wayfinder research/tracker fallbacks; architecture/vault guidance; current TDD/codebase-design behavior; current cross-harness identities; and the resolved human-confirmation gates. The user's authority resolutions deliberately narrow current Wayfinder, diagnosis, and prototype behavior as specified above. Upstream sources are evidence, never overwrite authority.

Exclude deprecated/experimental inputs not explicitly selected; `pstack`; government product-development material; compiler-check/fix-CI/Canvas/SDK/plugin-authoring skills; provider manifests; Cursor SDK/cloud agents; concrete model catalogs/prices; Git/branch/worktree/PR/Slack/Playwright/hook/state paths; unpublished SQLite swarm/VCS/reconciler/Field Guide mechanisms; article prose/graphics; and all product discovery/growth behavior.

Maintain an adaptation ledger through implementation, then move the verified as-built ledger into `eng-flow/WORKFLOW.md`. For each final skill, record local governing tickets/current source, pinned upstream path(s) used, adapted/folded/rejected/local behavior, and whether final text/code is independent or substantially copied. Required grouping:

| Final skills | Governing source |
|---|---|
| `eng-flow` | Local tickets 04, 05, 10, 13; selected Matt `ask-matt` predicates only |
| `eng-requirements` | Local ticket 16 |
| `eng-research` | Local tickets 15/17 plus Matt `research` |
| `eng-specification` | Local tickets 03/04/16 plus Matt `to-spec` |
| `eng-ticketing` | Local tickets 04/06/07/08 plus Matt `to-tickets` |
| `eng-implementation` | Local tickets 06–08/11/12 plus selected Matt `implement` and Cursor Orchestrate/smoke behaviors |
| `eng-handoff` | Local tickets 07/11 plus Matt `handoff` |
| `eng-verification` | Local ticket 12 plus Cursor Orchestrate verifier and Team Kit `verify-this` |
| `eng-integration` | Local tickets 07/12 plus Matt conflict resolution and Cursor neutral merge evidence |
| `eng-code-review` | Local ticket 12 plus Matt `code-review` and Cursor reviewer-handoff evidence |
| `eng-shipping` | Local ticket 12 plus Cursor `loop-on-ci`, `review-and-ship`, and `make-pr-easy-to-review` |
| `eng-continual-learning` | Local ticket 18 plus Cursor continual-learning updater discipline |
| `eng-grilling`, `eng-domain-modeling`, expert wrappers, Wayfinder, existing `eng-*`, `craft-*`, `improve`, `mnemopi-*` | Current live local contents plus the explicit identity/gate/reference changes in tickets 03/09/14/20 and the user-resolved planning-only Wayfinder, diagnosis-only, and decision-evidence-only prototype cutovers |

Write final procedures independently. Before cutover, compare every Matt/Cursor-derived current/new file with the pins. Only when a final skill retains copied source text/code constituting a copy or substantial portion, add sibling `.config/agents/skills/<skill>/LICENSE.md` containing the complete applicable Matt Pocock and/or Cursor MIT copyright and permission notice plus source repository/path/commit; include both notices when both apply. Do not add blanket notices to independent adaptations. The Cursor article supplies no reusable text/graphics license: never copy it substantially.

### Live baseline and exact path delta

The observed canonical root currently has 16 directories: `craft-name`, `craft-rule`, `craft-skill`, `domain-modeling`, `eng-codebase-design`, `eng-diagnosing-bugs`, `eng-improve-codebase-architecture`, `eng-prototype`, `eng-tdd`, `grill-me`, `grill-with-docs`, `grilling`, `improve`, `mnemopi-cleanup`, `mnemopi-retain`, and `wayfinder`. No added final path exists yet.

Build additions only in candidate staging, then install these at cutover:

```text
.config/agents/skills/eng-flow/
.config/agents/skills/eng-requirements/
.config/agents/skills/eng-research/
.config/agents/skills/eng-specification/
.config/agents/skills/eng-ticketing/
.config/agents/skills/eng-implementation/
.config/agents/skills/eng-handoff/
.config/agents/skills/eng-verification/
.config/agents/skills/eng-integration/
.config/agents/skills/eng-code-review/
.config/agents/skills/eng-shipping/
.config/agents/skills/eng-continual-learning/
```

Each addition starts with one minimal `SKILL.md`; create `references/`, `scripts/`, assets, or local evals only when conditional detail, repeated deterministic operation, or a unique behavior/trigger case demonstrably reduces errors. `eng-flow` additionally contains `evals/evals.json` and `evals/fixtures/`. It does not contain `WORKFLOW.md` during assembly or initial cutover.

Rename full directory contents at the same cutover:

```text
.config/agents/skills/grilling/ → .config/agents/skills/eng-grilling/
.config/agents/skills/domain-modeling/ → .config/agents/skills/eng-domain-modeling/
```

Preserve all bundled files, change directory/frontmatter identity, and remove old paths in the same mutation. No symlink, wrapper, re-export, or compatibility alias remains.

Candidate `repo-files/` must contain these known live-reference updates:

```text
.config/agents/skills/grill-me/SKILL.md
.config/agents/skills/grill-with-docs/SKILL.md
.config/agents/skills/wayfinder/SKILL.md
.config/agents/skills/eng-improve-codebase-architecture/SKILL.md
.config/agents/skills/craft-skill/evals/evals.json
.config/agents/skills/eng-diagnosing-bugs/SKILL.md
.config/agents/skills/eng-prototype/SKILL.md
.config/agents/rules/plan-impl-spec.md
.agents/plans/2026-07-28-0033_chart-agent-workflow-map.md
```

The current live references establish the exact migration intent: wrappers call the old skills; architecture improvement names both old skills and automatically writes glossary/ADR content; the rule and craft-skill eval use old installed identities; Wayfinder mixes replaceable installed-skill references with preserved `grilling` domain types/labels/prose and a Notes execution override that must be removed; diagnosis currently applies a fix and must stop at the evidence-backed fix contract/blocker/architecture finding; prototype currently folds into real code and prescribes a throwaway branch and must instead return adapter-neutral decision evidence. The still-`PENDING` chart plan under `.agents/plans/` is active under the plan lifecycle contract, so candidate `repo-files/` must replace its live installed-skill names and dead `/Users/kim/.agents/skills/wayfinder/...` fallback with the canonical `.config/agents/skills/wayfinder/...` path. A fresh whole-repository reference classification at candidate build time must add any other active specification, ticket, rule, eval, example, description, or runtime caller. Leave resolved Wayfinder tickets, archives, source quotations, and historical transcripts immutable unless they remain active executable authority.

Retain all 14 final existing paths with only the narrow changes specified in the inventory and migration list. Final live state rejects the two old rename sources and every prohibited path listed in the inventory section, all source plugin roots, provider body copies, generated wrappers, and parallel roots.

### Non-discovered assembly, coherent cutover, and rollback

Use only:

```text
.scratch/eng-flow-cutover/
├── pre-cutover/
├── candidate/
│   ├── skills/
│   └── repo-files/
└── evidence/
```

This root is temporary, outside skill discovery, and never canonical. If it already exists, inspect and stop rather than overwrite unknown work. `pre-cutover/` captures every affected live file plus exact identity/digest before mutation; candidate contains the complete final graph and non-skill reference edits; evidence holds disposable reports. Never copy secrets, credentials, user-level `AGENTS.md`, unrelated state, or provider account data.

Assembly order is fixed: snapshot current authority → build renamed primitives from live copies → build leaf authorities → build backend depth → build router and shared evals last against staged names → stage all live-reference edits → audit exact structure/links/ownership/provenance/provider neutrality → run isolated static/simulation/route checks → revalidate every live source identity → cut over all additions/renames/reference edits/old-path removals as one owned mutation.

Any drift after snapshot invalidates affected candidate output: reread current source, rebuild the affected candidate, and rerun staging checks. Never overwrite newer user work. Any hard cutover/runtime failure or required adapter `BLOCKED` restores the exact pre-cutover live graph/references; repair only the non-discovered candidate, then perform a fresh full revalidation and coherent cutover. Never leave an old/new hybrid active.

After cutover, start fresh host contexts to avoid cached inventory, run initial full conformance, and enter terminal refinement only after both hosts pass. Keep rollback material until terminal refinement, both required full-matrix passes, final live-matrix pass, and overview consistency succeed. Then remove staging/rollback/evidence as final cleanup. Migration itself does not stage/commit/push; any later Git staging uses `./bin/dot-add .config/agents` or the narrower accepted manifest name, never raw broad staging.

### Initial support claims

First release claims OMP and Grok only. Existing adapter inputs are `.config/agents/harnesses/omp/config.yml` and `.config/agents/harnesses/grok/config.toml`; no edit is assumed. Configuration/filesystem presence alone is not support evidence. Fresh OMP and Grok contexts must discover all 28 names and no old names, invoke the canonical bodies, and exercise every mode/capability each claims.

If either host needs provider-specific mapping, invocation metadata, or recovery transport, stop and add the smallest explicit implementation task under its existing harness directory; do not patch shared bodies. Missing account, permission, service, runtime, or required transport is `BLOCKED` and prevents the dual-host claim. Cursor, Claude Code, Codex CLI, and all other hosts remain unclaimed until a thin adapter passes the same suite.

Sources: resolved tickets 01, 02, 09, 14, and 19; current `.config/agents/skills/`, `.config/agents/rules/plan-impl-spec.md`, and harness configs.

## Evaluation, terminal refinement, and workflow overview

### Router-owned evaluation architecture

`eng-flow` owns one portable cross-stage contract suite:

```text
.config/agents/skills/eng-flow/evals/
├── evals.json
└── fixtures/
```

Local skill evals remain only for unique discovery/trigger/behavior contracts outside this matrix. Harness profiles own runners, invocation, trace extraction, capability declarations, and environment setup without copying/changing cases. Reports are disposable evidence linked from governing artifacts, never committed golden prose.

Each case records stable scenario ID/proof layer; immutable inputs/fixtures/artifact revisions; required and absent capabilities; scripted human replies; expected route, ordered owners, first owner, gates, artifacts, execution mode, and outcome; required/forbidden trace events/transitions; criterion proof/rubric; and repetition tier. Each attempt records skill-graph/adapter revisions, scenario/fixture/target/attempt identity, observed semantic trace/state/artifacts, deterministic evidence, fresh evaluator verdict, and `PASS|FAIL|BLOCKED`. Never assert exact prose/formatting.

The four layers are mandatory:

1. **Static graph/ownership** — exact 28 identities, no old/alias paths, all live links, one body per capability, shallow stateless router, backend state without copied leaf procedures, one owner/no cyclic dispatch, provider-neutral bodies, correct license/source placement, and no user-level `AGENTS.md` write authority.
2. **Router semantic families** — intent-equivalent paraphrases, held-out prompts, and at least one decisive near miss for every family:

| ID | Positive contract | Required boundary |
|---|---|---|
| `R-DIRECT` | Overview → approval → bounded read-only answer | Evidence gap routes to research |
| `R-RESEARCH` | Bounded factual lookup returns cited evidence | Evidence never decides product strategy |
| `R-PRODUCT-AUTHORITY` | Exact stop/resume handoff for missing product authority | Approved authority proceeds without product interview |
| `R-REQUIREMENTS` | Incomplete engineering contract routes to requirements | Complete authority skips duplicate requirements |
| `R-BUG` | Settled-expectation hard bug/performance issue routes to diagnosis | Known fix may be direct; ambiguity routes to its authority |
| `R-GRILL` | Explicit interview or real one-context decision gap routes to correct grill entry | Breadth alone does not trigger interview |
| `R-WAYFINDER` | Multi-context decision fog routes to Wayfinder | Large but decision-complete work does not |
| `R-PROTOTYPE` | Fidelity-dependent decision takes temporary prototype detour | Conversational decision does not |
| `R-ARCHITECTURE` | Architecture improvement selects survey/design without mutation | Bug/approved implementation avoids broad audit |
| `R-ARTIFACT-LANE` | Direct vs specification/tickets follows settled coordination depth | Map never goes directly to implementation; trivial work avoids ceremony |
| `R-EXPLICIT-STAGE` | Honor valid named stage plus smallest prerequisites | Explicit naming bypasses no gate |
| `R-APPROVAL` | No effect before exact unambiguous overview approval | Silence/caveat/changed constraint/unrelated affirmative does not dispatch |
| `R-DRIFT` | Load-bearing drift invalidates approval and re-overviews | Unchanged baton proceeds without reapproval |
| `R-COMPLETE` | Evidence-backed complete work reports and stops | Partial/unverified/blocked work cannot close |

Hard router traces require no write/external mutation/spawn/provider action/durable state before approval; exactly one first owner after approval; no hidden authority decision; no router manifest/duplicate artifact; route-change reapproval; and disclosed contract-equivalent substitution or stop.

3. **Deterministic backend simulations** — fake profiles/graphs directly assert state/order/concurrency/attempt/revision/quarantine/permission/terminal behavior for `B-AUTHORITY`, `B-SINGLE`, `B-BATCH`, `B-FULL`, `B-DEPENDENCY`, `B-ROLES`, `B-HANDOFF`, `B-RETRY`, `B-FALLBACK`, `B-VERIFY`, `B-INTEGRATE`, `B-REVIEW`, `B-SHIPPING`, `B-LEARNING`, and `B-COMPLETION`, with exactly the contracts defined above. Explicit near misses include cohesive large work remaining single-owner, dependent slices never concurrent, flat/high-token graphs not full orchestration, silent weaker fallbacks failing, partial output never consumable, and shipping never inferred from local completion.
4. **Disposable live runtime** — every claimed adapter uses the same portable cases in a disposable fixture repository. All run canonical-root discovery plus explicit `eng-flow`, one positive/near-miss route family, approval/no-approval mutation trace, direct/single-owner changed-path smoke with immediate passing rerun, terminal evidence, and safe cleanup. Delegation claims add a two-worker independent wave and blocked-dependent proof. Full-orchestration claims add the smallest planner/worker graph with controlled failure/retry, recovery Handoff, fresh verification, neutral fan-in/post-proof, and completion aggregation. Each claimed isolation/durability/recovery/messaging capability is exercised; otherwise test fallback/stop.

Live fixtures never mutate real dotfiles, accounts, remote branches/PRs, deployments, credentials, or project/user guidance. Destructive/shipping effects use instrumented fakes absent separate authority.

Deterministic assertions run before semantic grading. A fresh read-only evaluator receives only case input/immutable targets, observed trace/artifacts, and rubric/proof level; it sees no runner reasoning or expected-route/near-miss labels, cannot repair, and returns criterion `VERIFIED|NOT VERIFIED|INCONCLUSIVE`. Required nonverification produces `FAIL`; required inconclusive proof produces `BLOCKED`.

Repetition is exact: deterministic static/state once per named revision; authority/approval/mutation-safety/routing families three fresh attempts; ordinary semantic cases two fresh attempts; every successful live changed-path smoke one immediate same-fixture rerun; recovery/fan-in repeated when timing/environment sensitivity appears. Every repetition must pass; no majority, score, or averaging.

Release status is hard: `PASS` only when every hard criterion passes every repetition for every claimed adapter; `FAIL` for any authority/approval/mutation/ownership/dependency/fallback/verification/integration/completion/shipping/user-level-AGENTS violation; `BLOCKED` for unavailable/inconclusive required proof; `ADVISORY` only for noncontractual presentation that obscures no behavior. One named graph revision must pass static, semantic, simulation, and every claimed live capability.

Source: resolved ticket 13.

### Terminal audit and refinement

Start only after exact 28-skill installation, old/alias/provider-copy removal, live-reference/source-license checks, a named initial full-suite `PASS`, complete initial OMP and Grok claimed-mode conformance, preserved passing rollback target/evidence, and no concurrent affected-path mutation. `FAIL`, `BLOCKED`, missing evidence, or unnamed revision returns to implementation.

Extend non-discovered staging:

```text
.scratch/eng-flow-cutover/
├── pre-terminal/
├── terminal-candidate/
│   ├── skills/
│   └── repo-files/
└── evidence/
    └── terminal-skill-audit.md
```

Use four separate authorities: fresh read-only auditor → evidence findings; one refinement owner → staged contract-preserving changes; original contract owner/human → semantic/authority decisions; fresh evaluators/live adapters → truth verdict. Auditor/evaluators never edit; refinement never silently changes inventory, lifecycle, human gates, stage authority, or semantic contracts.

Audit identity/activation/source placement across all 28 skills. Deeply audit procedures/lifecycle/ownership/handoffs across the 22 workflow-facing skills. Inspect the six utilities only enough to prove no broad activation/copied-procedure collision. Inspect active rules and OMP/Grok profiles only at shared interfaces.

Required passes:

- **Identity/activation** — kebab-case names ≤64 and exact basename; descriptions ≤1024 stating what/when with distinct positive/near-miss triggers; explicit/natural discovery agreement; direct valid stages; broad default router that does not absorb expert/utilities; no retained utility false capture.
- **Depth/ownership** — one deepest owner per procedure; thin router/wrappers, deep stage/backend; no router state/procedure; backend keeps topology/state/attempts without leaf procedures; canonical owners for smoke, CI, integration, review, shipping, learning; no repeated sibling boilerplate.
- **Lifecycle/handoff** — every transition names authority/input/output/stop/next owner; consistent immutable Task Contract/Context Pack/Handoff/attempt identities; no approval bypass; single-owner default and narrow batch/full triggers; non-overlapping role permissions; no weakened fallback.
- **Support/provenance/safety** — references linked from owner with explicit read condition; scripts only for repeated deterministic value; evals at narrowest owner; no ornamental assets/examples; only verified metadata; provider transport in adapters; old references migrated or proven historical/domain data; accurate source notices; preserved unrelated work; absolute user-level `AGENTS.md` prohibition.

Each audit finding records stable ID, category/severity, exact paths, observed evidence, canonical owner/governing contract, defect type, proposed `KEEP|COMPACT|MOVE|MERGE|DELETE|ESCALATE`, mechanical/semantic class, affected evals/proof, final disposition, and target revision. Severities are `BLOCKING` for hard inventory/authority/safety/ownership/discovery/dependency/evidence/portability/licensing/instruction violation; `REQUIRED CLEANUP` for contract-preserving duplication/staleness/shallow pass-through/unresolved reference/needless support; `ADVISORY` for harmless polish. Close every blocking/required finding; mark each advisory `APPLIED` or `RETAINED` with reason.

The refinement owner may move/merge/compact/delete only when all hold: kept owner is final and proven loaded; removed material has no unique authority/gate/trigger/edge/output/fallback; unique useful detail moves first; all callers/rules/references/evals/descriptions migrate together; no lifecycle/invocation change; licenses remain accurate; deterministic plus affected behavior checks cover the cutover; no alias/dead path remains. Delete references/scripts/metadata only when their unique value is absent, obsolete, duplicated, one-off/environment-specific, unsupported, or clearer inline. Uncertain uniqueness is retained and escalated. Cleanup may not rename/remove an approved skill, change ownership/lifecycle, or weaken/widen/narrow a gate/contract.

Matt-style instruction hard gate: minimal valid frontmatter; exact name/basename; non-overlapping what/when description; one job/owner; one default with real escape hatches only; concise imperative procedure near action; checkable fragile steps; no generic motivation/repeated rationale/compatibility/provider transport; conditional references; no unused support; no held-out prompt leakage; preserve rationale needed for safety/authority/sequence. Heading/rhythm/harmless terminology/example compression/further safe terseness are advisory.

Terminal sequence is fixed: freeze the named staged ledger aggregate, host profiles, evidence, and live identities → capture identity-checked `pre-terminal` rollback → copy to isolated candidate → run the terminal audit in parallel read-only slices → neutrally consolidate one finding table → classify findings by authority → apply one contract-preserving refinement batch → run complete deterministic proof plus only the semantic closure invalidated by that batch → aggregate retained and new case evidence → create `WORKFLOW.md` only from hard `PASS` → add one conditional pointer → deterministic/fresh overview validation → revalidate live source identities → coherently install the terminal candidate with rollback on failure → run compact fresh OMP/Grok adapter proof plus any genuinely invalidated semantic cases → close evidence and remove temporary state.

**Execution amendment 2026-07-29 — lean evidence reuse.** This user-approved amendment supersedes the former monolithic initial/terminal double-matrix policy without weakening any acceptance criterion. Shared router/backend semantics are proved once in staging and retained in an append-only case ledger. Cache validity uses the exact case-contract epoch and consumed authority/protocol component identities, never a whole-candidate or whole-runner hash. A failed attempt remains immutable, resets only that case's passing streak, and cannot be cherry-picked away. Deterministic changes replay stored outputs; evaluator-only changes reevaluate stored worker output; adapter/profile changes rerun only capability-dependent cases. Initial and final OMP/Grok gates prove host discovery, identity, capabilities, five live scenarios, isolation/cancellation where claimed, fresh verification independence, mutation safety, and rollback rather than repeating shared semantics. A complete semantic sweep is required only when shared authority, the worker-prompt protocol, or the evaluator contract changes globally.

Source: resolved ticket 20.

### Canonical `eng-flow/WORKFLOW.md`

Create only after the first terminal full matrix passes:

```text
.config/agents/skills/eng-flow/WORKFLOW.md
```

This is the uppercase canonical basename for future departmental flow architecture (`<department>-flow/WORKFLOW.md`), but this effort creates only `eng-flow/WORKFLOW.md`. Do not create `OVERVIEW.md`, root duplicate, generated manifest, `CONTEXT.md`, `CONTEXT-MAP.md`, or ADR for the workflow.

It is an on-demand as-built architecture/context/provenance view, not a skill, prompt, procedure, state file, runbook, or runtime authority. `eng-flow/SKILL.md` contains the only ordinary body pointer: read `WORKFLOW.md` only when understanding, auditing, maintaining, or extending the complete flow; ordinary routing does not load it. Current verified skills/rules/specification remain authority; any mismatch blocks the workflow-system change until corrected.

Use exactly:

```markdown
# Engineering Flow

## Status
## Purpose and scope
## Interfaces and lifecycle
## Capability ownership
## Contracts and artifacts
## Decisions
## Research and provenance
## Harness adapters
## Evaluation and release gate
## Maintenance
```

- **Status** — graph identity/revision, last fully verified date, count 28, claimed adapters/capability levels, final gate, durable completion-evidence pointer; no transient IDs/models/traces.
- **Purpose and scope** — accepted inputs/destination, primary router, conditional requirements/product authority, route lanes, and explicit product/provider/account/unpublished-swarm/implicit-domain-artifact exclusions.
- **Interfaces and lifecycle** — low-resolution `classify → approve → establish authority/requirements → specify/ticket when needed → implement/smoke → verify → integrate when needed → review → curation → completion → separately authorized shipping`, with stop/resume and handoff artifacts, no procedures.
- **Capability ownership** — exact inventory split, one-line workflow authorities, thin router/backend/wrapper/expert relations, canonical owners for smoke/retry/CI/integration/review/shipping/learning.
- **Contracts and artifacts** — links/concise summaries for Route Overview, requirements, specification, tickets/graph, Task Contract, Context Pack, Handoff, attempt/recovery, verification, integration, review, curation, completion, and shipping.
- **Decisions** — one-line durable architecture/inventory index with governing links; no ticket-answer/history dump.
- **Research and provenance** — exact Matt/Cursor pins, selected paths/style, local frontier divergence, folded/rejected inputs, article URL/access date, `pstack`/unpublished/provider exclusions, local adaptations, sibling license notices; link sources, never copy reports/prose/license text.
- **Harness adapters** — semantic seam, OMP/Grok claimed/last-proved capabilities, adapter ownership, unclaimed hosts, and live-conformance-only claim changes; no bindings/credentials/commands.
- **Evaluation and release gate** — eval link, layers, hard statuses, repetition, evaluator independence, final revision/adapters/evidence; no cases/traces/logs.
- **Maintenance** — update/no-update rule and absolute user-level `AGENTS.md` prohibition.

The owner of any change to inventory/public identity, lifecycle/route, capability ownership, core contracts/evidence/completion, source/adaptation/exclusion/license status, eval/release architecture, or adapter support updates the overview only after the changed graph passes required verification. Final review checks consistency. Do not update for ordinary runs, application details, transient state, model choices, job logs, disposable reports, or style-only changes. The curator may report an overview candidate but cannot edit it; no hook/generator owns it.

## Critical files and anchors

- `.scratch/adaptive-agent-workflow/map.md` and resolved tickets `01`–`20` linked at map lines 37–56 — canonical decision index; tickets 04–08/11–14/16/18/20 carry the load-bearing lifecycle, interface, recovery, verification, migration, and terminal contracts.
- `.config/agents/skills/{grilling,domain-modeling,wayfinder,eng-improve-codebase-architecture}/` plus `grill-me/SKILL.md`, `grill-with-docs/SKILL.md`, and `craft-skill/evals/evals.json` — current local source behavior, rename bundles, domain-value exceptions, human-gate deltas, and concrete callers.
- `.config/agents/rules/plan-impl-spec.md`, `.config/agents/harnesses/{omp/config.yml,grok/config.toml}`, and linked `.grok/skills` — scoped rule caller and user-owned adapter/discovery inputs; `.grok/skills` is an alias/link identity surface, not a second canonical body.
- Matt [`skills@ed37663cc5fbef691ddfecd080dff42f7e7e350d`](https://github.com/mattpocock/skills/commit/ed37663cc5fbef691ddfecd080dff42f7e7e350d), Cursor [`plugins@91be0f994b5de7a75f4d6f2b3b00958126d9195e`](https://github.com/cursor/plugins/commit/91be0f994b5de7a75f4d6f2b3b00958126d9195e), and the [Cursor model-economics article](https://cursor.com/blog/agent-swarm-model-economics) — immutable repository evidence and dated article evidence; use only the selected paths in the source ledger.
- `/Users/kim/dev/atlas/app/.agents/{AGENTS.md,ARCHITECTURE.md}`, `skills/atlas-core/assets/{markdown-registry-contracts.md,operating-cadence-and-guardrails.md}`, and `skills/{atlas-research,atlas-answer,atlas-refresh}/SKILL.md` — consult only when implementing/testing the optional Atlas adapter; capability discovery, opaque logical URIs, freshness states, and manual-first scheduling remain Atlas-owned.

## Verification and completion gates

Verification targets one named skill-graph revision and named OMP/Grok adapter-profile revisions. Harness-specific commands, environment variables, fixture launch, and trace extraction are recorded by those adapter runners; shared skills and this portable specification intentionally contain no provider command syntax. Pass 2 must bind concrete live commands to the existing adapter interfaces without changing these criteria.

The implementation is complete only after this ordered evidence:

1. **Candidate structure** — isolated candidate contains exactly 28 directories and 28 matching `SKILL.md` frontmatter names; all bundled links resolve; known and fresh-discovered live installed-skill references use final names; preserved Wayfinder `grilling` domain values remain; prohibited/old/alias/provider-body paths are absent; shared bodies contain no provider transport; source ledger and conditional licenses are correct; user-level `AGENTS.md` identity is unchanged.
2. **Candidate contract behavior** — static ownership plus every `R-*` family/near miss and every `B-*` simulation passes at required repetition. Required observable input/output includes: before affirmative approval, a disposable request produces only the exact Route Overview and zero mutation/dispatch; a caveated reply produces a revised overview; missing product strategy returns the exact `PRODUCT AUTHORITY REQUIRED` block; a cohesive executable change selects one owner; an approved independent graph selects only its ready batch; an approved durable recursive graph selects full orchestration; failed upstream work quarantines descendants; partial output never satisfies dependencies.
3. **Candidate end-to-end runtime** — in an isolated disposable repository, each claimed adapter discovers/invokes canonical `eng-flow`, performs one approved single-owner changed-path mutation, observes implementer smoke, immediately reruns the passing smoke, obtains fresh immutable-target verification, final review, curation outcome, and terminal evidence, then safely cleans the fixture. Delegation/full claims additionally prove their respective two-worker/dependency and recovery/fan-in paths. Real dotfiles, user/project guidance, accounts, remotes, deployments, and credentials remain unchanged.
4. **Drift-safe coherent install** — immediately before mutation, every live identity/digest equals its snapshot. Install additions, both renames, all reference edits, and old-path removals as one owned cutover. A forced failure exercise or equivalent identity-backed rollback proof demonstrates exact pre-cutover restoration without losing unrelated work or leaving a hybrid.
5. **Fresh initial live conformance** — a fail-fast Grok canary proves fresh discovery plus one minimal live scenario before further host calls. If it passes, newly started OMP and Grok contexts concurrently prove all 28 final names and no old names, canonical body identities, fresh capability profiles, the five disposable live scenarios, direct/delegated transport, cancellation/isolation where claimed, fresh verification independence, mutation safety, cleanup, and rollback. Shared router/backend semantics come from the current staged-ledger aggregate and are not rerun per host. Missing auth/runtime/service/transport is `BLOCKED`, not a partial support claim.
6. **Terminal refinement closure** — parallel read-only audit slices collectively cover all 28 activation surfaces, all 22 workflow bodies, utilities/support/provenance, and both host seams; a neutral consolidation accounts for every slice and finding. All `BLOCKING`/`REQUIRED CLEANUP` findings close in one contract-preserving refinement batch; every advisory is explicitly applied/retained; the exact final candidate has no duplicate procedure, broad false trigger, unclear owner, stale reference, provider copy, or inaccurate notice.
7. **Refined candidate aggregate** — the refined isolated candidate passes complete deterministic proof plus the exact semantic closure invalidated by the refinement batch. Current ledger records whose consumed authority and protocol identities are unchanged remain valid. Every affected case obtains its frozen consecutive passing streak with fresh evaluator separation before overview creation.
8. **Overview and compact final host proof** — create exact-structure `eng-flow/WORKFLOW.md` from the named passing aggregate, add its sole conditional `SKILL.md` pointer, pass deterministic link/inventory/pin/adapter/revision checks and fresh semantic consistency review, coherently install, then run the compact live adapter gate in fresh OMP/Grok contexts. Rerun only semantic cases whose consumed authority closure changed; the overview-only pointer uses deterministic structure/load-boundary proof unless observed discovery or routing behavior changed.
9. **Terminal evidence and cleanup** — final evidence index names exact graph/profile/source revisions, all hard outcomes, role evidence, integration lineage where used, curation outcome, advisories, residual risks, and dual-host support. `WORKFLOW.md` matches the observed graph. `.scratch/eng-flow-cutover/` staging/audit/rollback material is removed only now. User-level `/Users/kim/.agents/AGENTS.md` remains byte-identical to its pre-work identity.

Any required `FAIL` fails the candidate; any unavailable/inconclusive required proof is `BLOCKED`; an advisory cannot override either. No staging/commit/push/PR/release/deploy is part of these local completion gates unless separately authorized.

## Assumptions and contingencies

- No implementation fallback may weaken approval, authority, preservation of user work, dependency ownership, observable evidence, fresh immutable-target verification, neutral fan-in, required recovery, honest completion, or user-level `AGENTS.md` ownership. If a host cannot preserve one, stop at the adapter seam with exact missing capability, verified safe work, and nearest safe route.
- No canonical domain artifact currently exists in this repository. Do not create one for the workflow. If a real term/decision later earns one, use ticket-03 criteria and explicit human confirmation through `eng-domain-modeling`.
- Ticket 14/19's Cursor pin `91be0f…` is the implementation authority; ticket 02's `ba7b590…` is historical research evidence only. A newer upstream revision requires separate research, compatibility review, and approval.
- Current Atlas façade source and a completed façade plan do not establish portable capability by presence. At execution, use Atlas's live capability surface; unavailable/undispatched operations fall back to direct cited research, and the still-pending continuous-research plan provides no scheduler claim.
- If `.scratch/eng-flow-cutover/` pre-exists, stop and inspect ownership rather than overwrite it. If any live source drifts, rebuild affected candidate content and rerun its checks. If either initial adapter needs a mapping/transport change, create the smallest harness-local implementation task in Pass 2; never alter shared skill semantics for one host.
- The configured OMP `plan-artifact-sync` mirror at `.agents/plans/2026-07-28-2309_eng-flow-implementation.md` is accepted as noncanonical transport, not a second specification or execution authority. `local://eng-flow-implementation-plan.md` remains the sole Plan-mode artifact and the only file Pass 2 extends with T1…TN.

## Authority resolutions

The user resolved the three ticket/current-behavior conflicts with these binding choices:

1. **Wayfinder is planning-only.** Remove `.config/agents/skills/wayfinder/SKILL.md:13` language that lets Notes carry execution into the map. Notes may supply domain, skills, preferences, and explicit planning constraints, but cannot turn Wayfinder tickets into implementation. A resolved map always re-enters authority/requirements/specification gates.
2. **Diagnosis is diagnosis-only.** Rewrite `.config/agents/skills/eng-diagnosing-bugs/SKILL.md:108-134` so the skill establishes the red-capable feedback loop, reproduction, hypotheses, and evidence, then returns a bounded fix contract, blocker, or architecture finding. It does not write the regression test or apply the production fix; `eng-implementation` issues that mutation authority to a worker, which may reuse the diagnosis evidence.
3. **Prototype returns decision evidence only.** Rewrite `.config/agents/skills/eng-prototype/SKILL.md:19-31` so it may build a disposable decision artifact inside its approved prototype task, but never folds a winner into production code or mandates Git/branch transport. It returns the question, observed verdict, artifact identity/location, disposal/preservation requirement, and next owner; the adapter chooses any isolation/preservation mechanism.

These explicit decisions supersede only the conflicting retain-unchanged language in ticket 09 and current bodies. All other resolved ticket and local behavior remains authoritative. No implementation occurred during Pass 1; the approved Pass 2 task graph begins below.

## Tasks

- [x] **T1 — Capture live authority and rollback identities** (`depends: none`)
  - completed 2026-07-29-0035
- [x] **T2 — Assemble the non-discovered candidate baseline** (`depends: T1`)
  - completed 2026-07-29-0043
- [x] **T3 — Apply the two clean-cutover renames** (`depends: T2`)
  - completed 2026-07-29-0044
- [x] **T4 — Implement planning and evidence leaf authorities** (`depends: T3`)
  - completed 2026-07-29-0049
- [x] **T5 — Implement handoff, verification, and integration authorities** (`depends: T3`)
  - completed 2026-07-29-0051
- [x] **T6 — Implement review, shipping, and learning authorities** (`depends: T3`)
  - completed 2026-07-29-0053
- [x] **T7 — Implement the portable execution backend** (`depends: T4, T5, T6`)
  - completed 2026-07-29-0056
- [x] **T8 — Implement the thin engineering router** (`depends: T4, T5, T6, T7`)
  - completed 2026-07-29-0059
- [x] **T9 — Complete cross-graph references, evaluations, and provenance** (`depends: T3–T8`)
  - completed 2026-07-29-0121
- [x] **T10 — Pass staged ledger-backed semantic gates** (`depends: T9`)
  - completed 2026-07-29-2325
- [x] **T11 — Install the initial candidate transactionally** (`depends: T10`)
  - completed 2026-07-29-2332
- [x] **T12 — Reload and prove fresh OMP/Grok inventories** (`depends: T11`)
  - completed 2026-07-29-2339
- [x] **T13 — Pass compact initial dual-host conformance** (`depends: T12`)
  - completed 2026-07-30-0051
- [x] **T14 — Audit the fresh terminal 28-skill graph** (`depends: T13`)
  - completed 2026-07-29-1829
- [x] **T13R — Repair conservative host capability evidence** (`depends: T14 authority decision`)
  - approved 2026-07-29-1834; preserve the provider- and harness-neutral shared contract
  - completed 2026-07-30-0531
- [x] **T15 — Refine contracts only in terminal staging** (`depends: T13R`)
  - completed 2026-07-30-0717
- [x] **T16 — Pass the refined candidate’s affected semantic closure** (`depends: T15`)
  - completed 2026-07-30-0720
- [x] **T17 — Create the as-built engineering-flow overview** (`depends: T16`)
  - completed 2026-07-30-0927
- [x] **T18 — Add the conditional overview pointer** (`depends: T17`)
  - completed 2026-07-30-0935
- [x] **T19 — Validate overview structure and semantic consistency** (`depends: T18`)
  - completed 2026-07-30-1006
- [x] **T20 — Install the terminal candidate coherently** (`depends: T19`)
  - completed 2026-07-30-1310
- [x] **T21 — Pass compact final live OMP/Grok conformance** (`depends: T20`)
  - completed 2026-07-30-1437
- [x] **T22 — Close durable evidence and remove cutover staging** (`depends: T21`)
  - completed 2026-07-30-1514

## T1 — Capture live authority and rollback identities

- **Governing authority**: **Authoritative inputs**, **Final skill inventory**, **Immutable inputs and source ledger**, **Live baseline and exact path delta**, **Non-discovered assembly, coherent cutover, and rollback**, and resolved tickets [`01`](.scratch/adaptive-agent-workflow/issues/01-research-current-matt-workflow-skills.md), [`02`](.scratch/adaptive-agent-workflow/issues/02-research-public-cursor-agent-workflows.md), [`09`](.scratch/adaptive-agent-workflow/issues/09-choose-exact-portable-skill-inventory.md), [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md), and [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md).
- **Prerequisites / blockers**: none. Before creating anything, check `.scratch/eng-flow-cutover/`. If it exists, stop with its tree, identities, and ownership evidence; never merge into, delete, or overwrite it.
- **Owned targets / allowed mutation**: create only `.scratch/eng-flow-cutover/pre-cutover/` and `.scratch/eng-flow-cutover/evidence/{handoffs,manifests}/`. Read the repository, immutable source pins, `.grok/skills`, and `/Users/kim/.agents/AGENTS.md`; do not mutate any live/configured path and do not copy the user-level file.
- **Implementation behavior**: reread `local://eng-flow-implementation-plan.md`, `.scratch/adaptive-agent-workflow/map.md`, all linked resolved tickets `01`–`20`, current `.config/agents/skills/`, the nine known live-reference paths listed in **Live baseline and exact path delta**, `.config/agents/harnesses/{omp/config.yml,grok/config.toml}`, `.grok/skills`, and the active chart plan. Mirror every affected live skill and repo file byte-for-byte under `pre-cutover/{skills,repo-files}/`. Write `evidence/manifests/T1-authority.json` with sorted records `{path, kind, mode, symlink_target, size, sha256}`; directory identities are SHA-256 over sorted child relative paths, kinds, modes, symlink targets, and file hashes. Record only the path and SHA-256 of `/Users/kim/.agents/AGENTS.md`. Verify the Matt commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`, Cursor commit `91be0f994b5de7a75f4d6f2b3b00958126d9195e`, selected source paths, package/article metadata, current executable versions, and the actual `.grok/skills` link target.
- **Acceptance criteria**: the manifest accounts for exactly 16 live skill directories, every file that a later task may replace/remove, both harness profiles, the discovery alias identity, both immutable source pins, the frozen plan/map/ticket identities, and the user-level `AGENTS.md` hash. The copied rollback tree reproduces every affected live byte and mode without secrets or user-level guidance content.
- **Targeted checks**: independently recompute every recorded hash from live sources and compare it with the rollback copy; compare the sorted 16-name list with **Live baseline and exact path delta**; resolve `.grok/skills` and prove whether it is the same canonical body surface; fetch selected source files by the pinned commit, never a moving branch.
- **Handoff / evidence**: emit `evidence/handoffs/T1.md` using the frozen Handoff schema, naming the manifest digest, rollback-tree digest, discovered adapter surfaces, source-pin proof, exact live deviations, and T2 as receiver.
- **Rollback / stop**: because no live state changes, remove only a root created by this attempt if capture fails before a valid manifest exists. Stop on a pre-existing root, unreadable affected input, source-pin mismatch, unknown discovery target, secret-bearing candidate input, or authority conflict.

## T2 — Assemble the non-discovered candidate baseline

- **Governing authority**: **Final skill inventory**, **Live baseline and exact path delta**, **Non-discovered assembly, coherent cutover, and rollback**, and ticket [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md).
- **Prerequisites / blockers**: T1 `completed`; `T1-authority.json`, rollback tree, source pins, and live identities remain current. Any drift returns to T1 for a new manifest revision.
- **Owned targets / allowed mutation**: `.scratch/eng-flow-cutover/candidate/{skills,repo-files}/` plus `.scratch/eng-flow-cutover/evidence/{handoffs,manifests,runners,results}/`; no live `.config`, `.agents`, `.grok`, or user-level path.
- **Implementation behavior**: create the exact staging tree from **Non-discovered assembly**. Copy the 14 retained final-name skill directories from T1’s rollback snapshot into `candidate/skills/`, preserving files, modes, and symlinks; exclude only the two rename sources pending T3. Copy the nine known active reference files into repository-relative locations under `candidate/repo-files/`. Create deterministic, dependency-free Python runners at `evidence/runners/{build_manifest.py,check_candidate.py,run_matrix.py,transactional_install.py}`: manifest generation uses the T1 identity algorithm; candidate checking validates inventory/frontmatter/links/provider-neutrality/references/licenses; matrix running reads the canonical eval manifest and keeps host commands in adapter-specific functions; transactional installation performs compare-before-replace, reverse-order rollback, post-write verification, and a durable operation journal. Runners may use only the Python standard library and subprocess calls to installed OMP/Grok executables.
- **Acceptance criteria**: candidate baseline contains exactly the 14 retained directories at their final names, no `grilling`, `domain-modeling`, added-skill placeholder, alias, `WORKFLOW.md`, or provider copy; `repo-files/` has byte-identical baselines for all nine known callers; each runner has a documented CLI/help path and deterministic fixture-level self-check.
- **Targeted checks**: run each runner’s `--self-check`; generate `evidence/manifests/T2-baseline.json`; prove its retained-skill files match T1 except for repository-relative location; prove candidate/root paths are outside both OMP and Grok discovery.
- **Handoff / evidence**: emit `evidence/handoffs/T2.md` with baseline manifest/digest, runner self-check results, excluded paths, and T3/T4/T5/T6 as allowed receivers.
- **Rollback / stop**: delete only T2-owned candidate/evidence outputs on failure. Stop if the staging root is discoverable, a retained bundle cannot be reproduced, a runner needs a third-party dependency, or any live path would need mutation.

## T3 — Apply the two clean-cutover renames

- **Governing authority**: **Final skill inventory**, **Live baseline and exact path delta**, **Authority resolutions**, and tickets [`09`](.scratch/adaptive-agent-workflow/issues/09-choose-exact-portable-skill-inventory.md) and [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md).
- **Prerequisites / blockers**: T2 `completed`; T1 identities for `.config/agents/skills/{grilling,domain-modeling}/` still match. Drift invalidates both rename candidates and returns to T1/T2.
- **Owned targets / allowed mutation**: only `.scratch/eng-flow-cutover/candidate/skills/{eng-grilling,eng-domain-modeling}/` and T3 evidence. Do not edit wrappers/callers yet and do not create old-name aliases.
- **Implementation behavior**: copy the complete `grilling/` bundle to `eng-grilling/` and `domain-modeling/` bundle to `eng-domain-modeling/`. Change each `SKILL.md` frontmatter `name` to its final basename and change only installed-skill self-identity references inside those bundles. Preserve the local frontier-round grilling procedure, `ADR-FORMAT.md`, `CONTEXT-FORMAT.md`, ordinary prose, source citations, and Wayfinder’s `Type: grilling` domain value. Do not create symlinks, redirects, wrapper bodies, deprecation prose, or old directories.
- **Acceptance criteria**: candidate has 16 final-name directories; renamed bundle file sets and non-identity bytes match the captured sources; frontmatter names are exact; old names are absent as paths; no behavior, gate, or supporting artifact was lost.
- **Targeted checks**: compare sorted bundle trees against T1; parse frontmatter and assert basename equality; classify every `grilling|domain-modeling` occurrence in the two bundles as changed installed identity or intentionally preserved prose/domain/source data.
- **Handoff / evidence**: emit `evidence/handoffs/T3.md` with both source/target digests, classified occurrence report, preservation proof, and T4/T5/T6/T9 as receivers.
- **Rollback / stop**: remove only the two staged targets on failure. Stop on ambiguous identity text, missing bundle content, or any required behavior change beyond the clean rename.

## T4 — Implement planning and evidence leaf authorities

- **Governing authority**: **Product authority, engineering requirements, and research**, **Capability and artifact ownership**, **Task Contract and Context Pack**, and resolved tickets [`03`](.scratch/adaptive-agent-workflow/issues/03-decide-durable-domain-artifacts.md), [`04`](.scratch/adaptive-agent-workflow/issues/04-define-end-to-end-lifecycle.md), [`15`](.scratch/adaptive-agent-workflow/issues/15-research-product-discovery-workflows.md), [`16`](.scratch/adaptive-agent-workflow/issues/16-define-product-to-engineering-bridge.md), and [`17`](.scratch/adaptive-agent-workflow/issues/17-define-atlas-research-integration-contract.md).
- **Prerequisites / blockers**: T3 `completed`. This task is independent of T5 and T6 but must not infer product, adapter, or backend policy.
- **Owned targets / allowed mutation**: only `candidate/skills/{eng-requirements,eng-research,eng-specification,eng-ticketing}/SKILL.md` and T4 evidence. No `WORKFLOW.md`, provider metadata, tracker implementation, Atlas code, domain artifact, or live path.
- **Implementation behavior**: write four independent, minimal Agent Skills bodies from the frozen contracts rather than copying upstream prose. `eng-requirements` accepts sufficient authority, emits one revision-bound Engineering Requirements Brief only when needed, requires human approval for synthesized/materially clarified requirements, and returns product changes to external authority. `eng-research` frames bounded questions, prefers primary sources, returns cited evidence without deciding authority, and uses Atlas only through the qualified freshness/capture fallback. `eng-specification` converts approved requirements into revision-bound architecture/interfaces/test seams without product expansion. `eng-ticketing` derives human-approved acyclic vertical tracer-bullet tickets with explicit dependencies, ownership, acceptance, and verification, never implementation. Each description states distinct positive and near-miss triggers.
- **Acceptance criteria**: all four final names/frontmatter match; each skill has one deepest procedure owner, explicit inputs/outputs/stops/next owner, and no copied sibling/backend procedure. The exact `PRODUCT AUTHORITY REQUIRED` literal appears only where the requirements boundary needs it. Domain artifacts remain lazy and human-confirmed. Atlas absence falls back to direct cited research, while `dirty|refreshing|blocked` freshness stops rather than silently using stale evidence.
- **Targeted checks**: parse frontmatter; scan for provider/model/account/branch/worktree/transport details; exercise static scenarios for missing product authority, sufficient approved requirements, bounded research with no Atlas, blocked Atlas freshness, direct one-context specification, and cyclic ticket input. Expected outputs are respectively exact stop, bound/approved brief or skip, cited evidence, freshness stop, revision-bound specification, and ticketing rejection.
- **Handoff / evidence**: emit `evidence/handoffs/T4.md` with each body digest, trigger/near-miss table, input/output/stop mapping, source-path adaptation record, and T7/T8/T9 as receivers.
- **Rollback / stop**: remove only these four staged directories on failure. Stop rather than inventing product discovery, product success, tracker transport, Atlas scheduling, or domain-document scaffolding.

## T5 — Implement handoff, verification, and integration authorities

- **Governing authority**: **Capability and artifact ownership**, **Task Contract and Context Pack**, **Handoff, attempts, recovery, and failure**, **Smoke, verification, integration, review, shipping, and completion**, and tickets [`07`](.scratch/adaptive-agent-workflow/issues/07-define-role-task-and-handoff-contracts.md), [`11`](.scratch/adaptive-agent-workflow/issues/11-decide-failure-retry-and-escalation-policy.md), and [`12`](.scratch/adaptive-agent-workflow/issues/12-decide-verification-review-and-integration-policy.md).
- **Prerequisites / blockers**: T3 `completed`; independent of T4/T6. The exact shared Task Contract, Context Pack, Handoff, attempt outcomes, proof classes, and verifier verdicts are immutable.
- **Owned targets / allowed mutation**: only `candidate/skills/{eng-handoff,eng-verification,eng-integration}/SKILL.md` and T5 evidence.
- **Implementation behavior**: `eng-handoff` owns compact revision-bound transfer/recovery packaging and the exact common Handoff fields; it references canonical authority and never duplicates it. `eng-verification` is a fresh read-only role that verifies every declared criterion against one immutable target and emits only `VERIFIED|NOT VERIFIED|INCONCLUSIVE` with criterion-level proof. `eng-integration` accepts only exact verified lineages, performs neutral fan-in under declared precedence/mechanical-conflict authority, emits a new combined identity and integrated smoke, then requires fresh post-integration verification. Keep repair, product/architecture choice, final review, and shipping outside these bodies.
- **Acceptance criteria**: Handoff covers every success/non-success attempt and cannot expand receiver authority; verifier has no write/repair path; integration cannot drop a lineage or choose a semantic winner. Target change invalidates verification. Missing proof is `INCONCLUSIVE`, observed nonconformance is `NOT VERIFIED`, and only complete declared proof is `VERIFIED`.
- **Targeted checks**: statically project a completed worker, blocked worker, stale dependency, target mutation after verification, two verified nonconflicting lineages, and a semantic conflict. Expected behavior is complete Handoff, non-success Handoff, stale rejection, verdict invalidation, neutral combined identity plus re-verification, and authority stop.
- **Handoff / evidence**: emit `evidence/handoffs/T5.md` with three body digests, schema/literal comparison against the frozen specification, negative-permission audit, scenario results, and T7/T8/T9 as receivers.
- **Rollback / stop**: remove only these three staged directories on failure. Stop on any body that permits self-verification, worker repair by verifier/integrator, semantic conflict choice, lineage loss, or proof weakening.

## T6 — Implement review, shipping, and learning authorities

- **Governing authority**: **Capability and artifact ownership**, **Smoke, verification, integration, review, shipping, and completion**, **Continual-learning contract**, and tickets [`12`](.scratch/adaptive-agent-workflow/issues/12-decide-verification-review-and-integration-policy.md) and [`18`](.scratch/adaptive-agent-workflow/issues/18-place-continual-learning-and-agents-updates.md).
- **Prerequisites / blockers**: T3 `completed`; independent of T4/T5. Review and shipping must remain separate, and user-level guidance ownership is absolute.
- **Owned targets / allowed mutation**: only `candidate/skills/{eng-code-review,eng-shipping,eng-continual-learning}/SKILL.md` and T6 evidence.
- **Implementation behavior**: `eng-code-review` performs read-only Standards and Specification review on the exact verified target and emits the exact three-axis literals. `eng-shipping` activates only on separate explicit delivery authority, owns complete-required-check-set CI recovery and delivery/rollback evidence, and never infers permission from local completion. `eng-continual-learning` runs one terminal neutral assessment, emits `CURATED|NO DURABLE LEARNING|BLOCKED`, applies only qualifying narrow changes to an existing project-owned guidance destination with confirmation/validation, and can never touch user-level `/Users/kim/.agents/AGENTS.md`.
- **Acceptance criteria**: reviewer cannot repair or ship; shipper cannot bypass hooks/checks or combine with review authority; curator enforces trigger, budget, concurrent-change merge, destination, human/new-artifact, and recursion gates. `NO DURABLE LEARNING` names assessed sources. No body treats memory, hook, hidden file, or provider transport as a guidance-authority bypass.
- **Targeted checks**: inspect scenarios for a verified target with blocking specification drift, local completion without shipping request, one failed required CI check among a larger set, an ordinary one-off lesson, a severe verified safety correction, a new-rule proposal, concurrent destination drift, and a proposed user-level AGENTS edit. Expected outputs preserve exact review axes, refuse shipping, inspect/rerun all checks, reject/qualify correctly, request human artifact authority, recompute or block, and absolutely reject the user-level write.
- **Handoff / evidence**: emit `evidence/handoffs/T6.md` with digests, permission matrix, exact verdict/outcome literal audit, curation positive/near-miss results, and T7/T8/T9 as receivers.
- **Rollback / stop**: remove only these three staged directories on failure. Stop on combined review/shipping authority, inferred shipping permission, background accumulation, broad learning writes, new guidance without approval, or any direct/indirect user-level AGENTS mutation.

## T7 — Implement the portable execution backend

- **Governing authority**: **`eng-implementation`: backend interface and state**, **Harness adapter seam**, all of **Contract model and authority**, and tickets [`06`](.scratch/adaptive-agent-workflow/issues/06-design-portable-implementation-backend.md), [`07`](.scratch/adaptive-agent-workflow/issues/07-define-role-task-and-handoff-contracts.md), [`08`](.scratch/adaptive-agent-workflow/issues/08-define-harness-adapter-boundary.md), [`11`](.scratch/adaptive-agent-workflow/issues/11-decide-failure-retry-and-escalation-policy.md), and [`12`](.scratch/adaptive-agent-workflow/issues/12-decide-verification-review-and-integration-policy.md).
- **Prerequisites / blockers**: T4, T5, and T6 `completed`; consume their exact revisions. Any mismatch between leaf contracts and frozen authority blocks rather than being reconciled inside the backend.
- **Owned targets / allowed mutation**: only `candidate/skills/eng-implementation/SKILL.md` and T7 evidence. Do not copy leaf procedures, provider transport, model selection, or product/architecture decisions into the backend.
- **Implementation behavior**: implement approved-authority intake/rejection; default one-owner, bounded batch, and full-orchestration selection; legal child projection; the exact task/run state machines; ready-frontier scheduling; Task Contract/Context Pack dispatch; attempt accounting and fixed semantic/transport retry budgets; failure classification, quarantine, recovery, safe downgrade/escalation; Handoff collection; independent verification; optional neutral integration; final review; terminal curation; and complete-evidence return. Expose the conceptual adapter calls `profile()`, `dispatch(...)`, `observe/control(...)`, and `recover(...)` only as semantic requirements, not code/provider APIs.
- **Acceptance criteria**: cohesive work stays one owner regardless of size; only genuinely independent ready tasks batch; full orchestration requires approved topology/recovery conditions; descendants never consume partial/stale output; one-owner completion still receives fresh required verification/review/curation; escalation returns to `eng-flow`; shipping is absent unless separately authorized. Every state transition, outcome, retry, and terminal condition matches the frozen literal.
- **Targeted checks**: walk deterministic examples for `B-AUTHORITY`, `B-SINGLE`, `B-BATCH`, `B-FULL`, `B-DEPENDENCY`, `B-ROLES`, `B-HANDOFF`, `B-RETRY`, `B-FALLBACK`, `B-VERIFY`, `B-INTEGRATE`, `B-REVIEW`, `B-SHIPPING`, `B-LEARNING`, and `B-COMPLETION`; record state/owner/output at each transition. Explicit near misses must reject token/task-count escalation, dependent concurrency, silent fallback, fourth semantic attempt, partial dependency satisfaction, and local-completion shipping.
- **Handoff / evidence**: emit `evidence/handoffs/T7.md` with backend digest, state-transition table, leaf-reference map, all B-family traces, negative duplication scan, and T8/T9 as receivers.
- **Rollback / stop**: remove the staged backend on failure. Stop on a cyclic/ambiguous state transition, missing authority gate, leaf-procedure duplication, unsafe retry/resume, unverifiable completion, or host requirement that belongs in an adapter.

## T8 — Implement the thin engineering router

- **Governing authority**: **Router, backend, and lifecycle interfaces**, **Product authority, engineering requirements, and research**, **Authority resolutions**, and tickets [`04`](.scratch/adaptive-agent-workflow/issues/04-define-end-to-end-lifecycle.md), [`05`](.scratch/adaptive-agent-workflow/issues/05-define-user-facing-router-contract.md), [`10`](.scratch/adaptive-agent-workflow/issues/10-name-the-user-facing-router.md), and [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md).
- **Prerequisites / blockers**: T4–T7 `completed`; T3 final expert/discipline identities available. The actual staged capability graph and adapter support facts, not proposed names, drive routes.
- **Owned targets / allowed mutation**: only `candidate/skills/eng-flow/SKILL.md` and T8 evidence. Do not create evals, `WORKFLOW.md`, its pointer, durable state, leaf procedures, provider bindings, or side effects.
- **Implementation behavior**: write a stateless classifier that accepts the frozen evidence inputs/precedence, evaluates the seven gates in order, emits the exact seven-field Route Overview on every invocation, requests exact-current approval, rechecks load-bearing identities before one first dispatch, and uses the common Handoff baton for automatic downstream transitions. Encode all supported outcomes and exact `PRODUCT AUTHORITY REQUIRED` stop. Route Wayfinder planning-only, diagnosis evidence-only, prototype decision-evidence-only, one-context decisions to expert wrappers, execution to `eng-implementation`, and completion only from terminal evidence. Reapproval conditions remain exact.
- **Acceptance criteria**: the body is shallow and provider-neutral; no mutation/dispatch/persistence occurs before approval; an explicit stage cannot bypass prerequisites; only one first owner dispatches; unchanged downstream baton may proceed automatically; drift/material route change returns a revised overview for approval; router never stores run state, duplicates stage/backend contracts, or invents product authority.
- **Targeted checks**: perform a static route walk for every `R-*` family and near miss from **Router-owned evaluation architecture**, including silence/caveat/unrelated affirmative, changed authority digest, planning-only Wayfinder return, diagnosis/prototype boundaries, cohesive direct implementation, multi-context ticket lane, and partial completion. Compare required outputs and forbidden effects to the frozen literals.
- **Handoff / evidence**: emit `evidence/handoffs/T8.md` with body digest, route/gate/owner table, exact literal audit, preapproval-effect scan, R-family walk results, and T9 as receiver.
- **Rollback / stop**: remove the staged router on failure. Stop if a route requires unapproved product/architecture/scope/destructive choice, an unavailable capability has no equivalent safe fallback, or router depth duplicates a downstream owner.

## T9 — Complete cross-graph references, evaluations, and provenance

- **Governing authority**: **Final skill inventory**, **Immutable inputs and source ledger**, **Live baseline and exact path delta**, all of **Evaluation, terminal refinement, and workflow overview**, **Authority resolutions**, and tickets [`03`](.scratch/adaptive-agent-workflow/issues/03-decide-durable-domain-artifacts.md), [`09`](.scratch/adaptive-agent-workflow/issues/09-choose-exact-portable-skill-inventory.md), [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md), [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md), [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md), and [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T3–T8 `completed`; all consumed manifests/digests current. Any live reference drift returns to T1/T2 before editing the staged copy.
- **Owned targets / allowed mutation**: staged `candidate/skills/{grill-me,grill-with-docs,wayfinder,eng-improve-codebase-architecture,eng-diagnosing-bugs,eng-prototype,craft-skill,eng-flow}/`; `candidate/repo-files/` copies of active callers; conditional sibling `LICENSE.md` only under a final skill whose selected Matt/Cursor source survives as copied/substantial text; `evidence/{adaptation-ledger.md,handoffs/T9.md,manifests/T9-candidate.json,runners,results}/`. Preserve all other retained files. No live path or `WORKFLOW.md`.
- **Implementation behavior**:
  - Update `grill-me/SKILL.md` to delegate only to `eng-grilling`; update `grill-with-docs/SKILL.md` to delegate to `eng-grilling` plus `eng-domain-modeling` while preserving human confirmation before durable writes.
  - Update `wayfinder/SKILL.md` installed-skill references and remove its Notes execution override; preserve `Type: grilling`, domain labels, ordinary prose, and `references/issue-tracker-local.md`. Update `eng-improve-codebase-architecture/SKILL.md` to use final names and route qualifying glossary/context/ADR writes through human-confirmed `eng-domain-modeling`.
  - Rewrite the bounded sections of `eng-diagnosing-bugs/SKILL.md` so it returns a fix contract, blocker, or architecture finding without testing/fixing production; preserve `scripts/hitl-loop.template.sh`. Rewrite `eng-prototype/SKILL.md` so disposable work returns decision evidence without production folding or branch transport; preserve `UI.md` and `LOGIC.md`.
  - Update `craft-skill/evals/evals.json`, `candidate/repo-files/.config/agents/rules/plan-impl-spec.md`, and `candidate/repo-files/.agents/plans/2026-07-28-0033_chart-agent-workflow-map.md` only where text is an active installed-skill/path reference. Replace the dead `/Users/kim/.agents/skills/wayfinder/references/issue-tracker-local.md` fallback with `.config/agents/skills/wayfinder/references/issue-tracker-local.md`. Search the entire current repository for `grilling`, `domain-modeling`, old absolute roots, and prohibited workflow identities; classify every occurrence as active caller, preserved domain/prose/source/history, or prohibited stale path. If the search finds an additional active caller, return first to T1/T2 to add its exact live bytes/identity to rollback and the candidate baseline; only then stage it under `repo-files/`.
  - Create `eng-flow/evals/evals.json` as an object with `skill_name: "eng-flow"`, `schema_version: 1`, and `cases` containing case objects. Every case contains `id`, `layer`, `fixture_dir`, immutable `inputs`, `required_capabilities`, `absent_capabilities`, `scripted_replies`, expected route/owners/first owner/gates/artifacts/mode/outcome, `required_events`, `forbidden_events`, criterion/rubric/proof, and repetition tier. Include every `R-*` and `B-*` family named in the frozen evaluation section. For each case ID, use `evals/fixtures/<lowercase-case-id>/case.json` where lowercasing preserves hyphens (`R-DIRECT` → `r-direct`); that file carries the immutable payload and names only additional fixture files it uses. Expected labels stay runner-side and are withheld from fresh evaluators.
  - Finish the T2 runners so `check_candidate.py`, `run_matrix.py`, and `transactional_install.py` implement their declared interfaces. `run_matrix.py` has adapter functions only for `staged`, `omp`, and `grok`; it stores immutable prompt/trace/result/evaluator records under the requested output directory and verifies fixture pre/post digests. Staged OMP calls explicitly read the candidate with `--no-skills`; live OMP calls use normal discovery. OMP worker calls use `omp --cwd "$FIXTURE" --no-session --mode json --approval-mode yolo -p @"$PROMPT_FILE"` and evaluator calls add `--tools read,grep,glob`. Grok worker calls use `grok --cwd "$FIXTURE" --single --output-format json --permission-mode bypassPermissions --prompt-file "$PROMPT_FILE" --json-schema "$JSON_SCHEMA"` and evaluator calls replace the permission mode with `plan`. Staged Grok fixtures expose only the candidate through their fixture-local `.grok/skills` link. Mutation-enabled calls operate only in digest-guarded disposable fixture copies; evaluator targets are read-only and pre/post hashed.
  - Write `evidence/adaptation-ledger.md` with the exact grouped source table, pinned paths, independently written/adapted/folded/rejected behavior, local divergence, and copied-text status. Compare final text against every selected pinned source. Prefer independent rewrite; if any necessary final fragment is a copy or substantial portion, add the complete applicable Matt and/or Cursor MIT notice with repository/path/commit in that skill’s sibling `LICENSE.md`. If uncertain, rewrite independently rather than applying a blanket notice. Never copy Cursor article prose/graphics.
- **Acceptance criteria**: candidate contains exactly 28 directories and 28 matching canonical `SKILL.md` names; no old/alias/provider-copy/prohibited path exists; all active callers use final identities; all preserved exceptions are classified; one body owns each capability; wrappers/router stay thin; evaluations contain every required family/near miss/repetition and no held-out label leakage; ledger/pins/licenses are exact; user-level AGENTS hash still matches T1.
- **Targeted checks**: run `build_manifest.py` and `check_candidate.py --phase assembly`; parse all frontmatter and Markdown links; compare source/candidate text for copied fragments; execute runner self-checks; validate JSON and every eval ID exactly once; verify `WORKFLOW.md` is absent; run the fresh repository reference classification twice, with the second pass returning only final identities plus documented domain/prose/source/history exceptions.
- **Handoff / evidence**: emit `evidence/handoffs/T9.md` with final candidate manifest/digest, exact 28 names, classified reference report, eval inventory/schema digest, runner digests/self-checks, adaptation/license ledger, unchanged user-level hash, and T10 as receiver.
- **Rollback / stop**: revert only T9 staged edits to their T2/T3/T4–T8 manifests. Stop on unclassifiable active references, source-pin drift, accidental substantial copy without valid notice, unsupported provider metadata, missing eval family, leaked expected labels, or any user-level AGENTS difference.

## T10 — Pass staged ledger-backed semantic gates

- **Governing authority**: **Router-owned evaluation architecture**, the **Execution amendment 2026-07-29 — lean evidence reuse**, **Verification and completion gates** items 1–3, and tickets [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md) and [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md).
- **Prerequisites / blockers**: T9 `completed`; named candidate, eval, runner, source-ledger, and user-level identities match the T9 Handoff. No evaluator may have authored the target under review. Let the already-running complete staged pass finish once; do not start another whole sweep for isolated failures.
- **Owned targets / allowed mutation**: read-only candidate/repo inputs; write only `evidence/runners/` for ledger/aggregation mechanics, `evidence/ledger/staged/`, `evidence/results/staged/`, `evidence/manifests/T10-verdict.json`, and `evidence/handoffs/T10.md`. Runner changes may record/replay/aggregate evidence but may not weaken rubrics, assertions, repetition tiers, evaluator separation, or candidate behavior. No live mutation.
- **Implementation behavior**: preserve/import every immutable attempt from the current complete pass into an append-only case ledger. Each record names case ID, case-contract epoch, exact consumed authority-closure SHA, fixture SHA, rendered worker-prompt SHA, worker schema/transport-protocol SHA, rendered evaluator-prompt/schema SHA, deterministic assertion-policy SHA, adapter/capability-profile SHA, worker/evaluator invocation identities, observed output, machine result, evaluator verdict, repetition tier/slot, and global attempt sequence. Complete-candidate and complete-runner SHAs remain provenance only. Invalidation is exact: authority/fixture/worker-protocol changes rerun affected worker plus evaluation; evaluator-only changes reevaluate retained worker output; assertion/aggregation changes replay retained output; adapter/profile changes rerun only cases claiming that capability. Run complete deterministic graph/identity/link/reference/license/provider-neutrality and rollback checks. Aggregate all 49 shared R/B cases from current records; rerun only cases lacking their required current consecutive passing streak. A nonpass resets only its case streak and remains visible. Under one unchanged epoch, allow at most `2 × required-streak` attempts after the latest candidate/protocol change; failure to obtain the streak is blocking instability.
- **Acceptance criteria**: one named candidate revision earns deterministic `PASS`; every shared semantic/simulation case has its frozen consecutive passing streak under one current case epoch; every attempt is retained; every evaluator is fresh and independent; and no current hard nonpass, missing/duplicate slot, mixed epoch, stale profile, identity mismatch, mutation leak, or advisory masking a hard gate remains. A forced-failure transaction restores exact pre-test identities and leaves no hybrid.
- **Targeted checks**: run the complete static gate and current staged pass once; import its `matrix.json` into `evidence/ledger/staged/`; use case-targeted `run_matrix.py --case-ids ... --ledger evidence/ledger/staged` only for deficient streaks; run the ledger aggregator fail-closed against the current candidate/eval/profile identities; run `transactional_install.py --self-check --inject-failure after-first-replace`. Machine adversarial self-checks must prove rejection of duplicate slots, mixed epochs, stale identities, malformed evaluator output, unavailable required capability, runtime mutation, and changed aggregation policy.
- **Handoff / evidence**: emit `evidence/handoffs/T10.md` naming exact target/evaluator/protocol/assertion/runner revisions, the immutable ledger root and aggregate digest, per-case streaks and retained failures, deterministic and rollback results, hard verdict `PASS`, advisories, and T11 as receiver.
- **Rollback / stop**: on a hard nonpass, return only the exact case/evidence to T3–T9’s owning task, create a revised candidate or protocol identity there, invalidate that case's exact affected evidence layer, and rerun its required streak. A global shared-authority, worker-protocol, or evaluator-contract change invalidates the corresponding complete shared layer. Stop if proof is unavailable, evaluator independence fails, or the bounded retry window establishes instability.
## T11 — Install the initial candidate transactionally

- **Governing authority**: **Non-discovered assembly, coherent cutover, and rollback**, **Verification and completion gates** item 4, and tickets [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md) and [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md).
- **Prerequisites / blockers**: T10 hard `PASS`; no concurrent affected-path mutation; all current live identities equal T1. A single drifted byte blocks installation and returns to T1/T2 plus affected build/check tasks.
- **Owned targets / allowed mutation**: `.config/agents/skills/` as one complete root; only the repository-relative files present in `candidate/repo-files/`; conditional existing `.config/agents/harnesses/{omp,grok}/` files already staged by a verified repair branch; T11 journal/Handoff. Never touch `/Users/kim/.agents/AGENTS.md`, credentials, provider accounts, Git index/history/remotes, or unrelated files.
- **Implementation behavior**: quiesce workflow invocations and rehash live/pre-cutover/candidate. Use `transactional_install.py --phase initial` to prepare same-filesystem temporary replacements, compare every live source to T1 before its first write, atomically replace individual files/root entries with `os.replace`, journal each operation with old/new identities, fsync files and containing directories, and roll back completed operations in reverse on any exception or post-write mismatch. Replace the complete skills root with the verified 28-skill candidate, apply all staged caller/rule/active-plan edits, remove old rename paths through the root replacement, and leave `.grok/skills` pointing to the canonical root. Do not edit the candidate or rollback copy during installation.
- **Acceptance criteria**: live root exposes exactly the T9 28-name/digest graph, all staged repo files match candidate identities, old paths are absent, discovery alias resolves to the same canonical bodies, no unrelated live identity changed, install journal is complete, and user-level AGENTS hash is unchanged.
- **Targeted checks**: from repository root run `python3 .scratch/eng-flow-cutover/evidence/runners/transactional_install.py --verify-only --phase initial --candidate-skills .scratch/eng-flow-cutover/candidate/skills --candidate-repo-files .scratch/eng-flow-cutover/candidate/repo-files --live-root . --rollback-root .scratch/eng-flow-cutover/pre-cutover --source-manifest .scratch/eng-flow-cutover/evidence/manifests/T1-authority.json --candidate-manifest .scratch/eng-flow-cutover/evidence/manifests/T9-candidate.json --journal .scratch/eng-flow-cutover/evidence/results/install-initial/journal.json`; rerun the same command with `--apply` replacing `--verify-only`; then run `python3 .scratch/eng-flow-cutover/evidence/runners/check_candidate.py --phase installed-initial --skills .config/agents/skills --repo-root . --manifest .scratch/eng-flow-cutover/evidence/manifests/T9-candidate.json --output .scratch/eng-flow-cutover/evidence/results/install-initial/postcheck.json`. Compare every non-target identity sampled by the journal and the user-level hash.
- **Handoff / evidence**: emit `evidence/handoffs/T11.md` with pre/post graph and repo-file digests, `evidence/results/install-initial/journal.json`, exact replaced/removed paths, alias proof, rollback command/reference, and T12 as receiver.
- **Rollback / stop**: any write/postcheck failure invokes `python3 .scratch/eng-flow-cutover/evidence/runners/transactional_install.py --rollback .scratch/eng-flow-cutover/evidence/results/install-initial/journal.json` and verifies exact T1 restoration before returning failure. Never leave a hybrid. A successful install remains rollback-capable until T22.

## T12 — Reload and prove fresh OMP/Grok inventories

- **Governing authority**: **Harness adapter seam**, **Initial support claims**, **Verification and completion gates** item 5, and tickets [`08`](.scratch/adaptive-agent-workflow/issues/08-define-harness-adapter-boundary.md), [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md), and [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md).
- **Prerequisites / blockers**: T11 `completed`; live identities match its post-install manifest; configured OMP/Grok executables and required existing authentication/runtime are available. Do not authenticate, fund, install, update, or mutate accounts.
- **Owned targets / allowed mutation**: fresh disposable host sessions/fixture state and `evidence/results/initial-discovery/`, `evidence/manifests/T12-discovery.json`, and T12 Handoff. A provider-mapping repair may touch only the affected staged copy under `candidate/repo-files/.config/agents/harnesses/{omp,grok}/` after T11 rollback; shared skill bodies remain immutable.
- **Implementation behavior**: start non-resumed OMP and Grok contexts. Ask each to return a sorted discovered-skill inventory plus resolved source path for `eng-flow`, both renamed disciplines, and one retained utility; explicitly invoke `eng-flow` read-only and record the loaded canonical body digest. Require 28 final names and zero old names. If failure is solely a verified discovery/invocation mapping gap, roll back T11; the only permitted repair is the installed host version’s documented native skill-root path mapping to `.config/agents/skills`, written in its existing harness profile and without a wrapper/body copy. Stage that exact mapping under candidate `repo-files/`, record capability level/constraints, rerun T10 and T11 in full, then rerun T12. If no documented native mapping exists, more than one inequivalent mapping survives inspection, or absence is account/permission/service/runtime/transport, remain `BLOCKED` and restore the exact T1 graph.
- **Acceptance criteria**: both fresh hosts independently discover the same 28 canonical identities, resolve one body per capability, load `eng-flow` on explicit invocation, report no `grilling`/`domain-modeling` skill, and produce matching graph digests. Provider-specific mapping, if needed, exists only in the verified harness file and changes no shared semantics.
- **Targeted checks**: run the adapter inventory mode through `run_matrix.py --phase initial-discovery --target .config/agents/skills --adapter omp` and again with `--adapter grok`; runners use fresh `omp --no-session` and `grok --single` calls and store raw/normalized output plus pre/post live hashes. Compare normalized lists to the frozen 28-name inventory.
- **Handoff / evidence**: emit `evidence/handoffs/T12.md` with executable/profile versions, fresh-session identities, discovered names/source paths/body digests, capability levels, any adapter-only repair/revalidation lineage, and T13 as receiver.
- **Rollback / stop**: on any unresolved host nonpass, restore T1 using T11’s journal, verify exact restoration, preserve diagnostics, and stop. Never weaken the dual-host claim, copy a shared body, or continue with one host.

## T13 — Pass compact initial dual-host conformance

- **Governing authority**: **Smoke, verification, integration, review, shipping, and completion**, **Router-owned evaluation architecture**, **Initial support claims**, the **Execution amendment 2026-07-29 — lean evidence reuse**, **Verification and completion gates** items 2, 3, and 5, and tickets [`12`](.scratch/adaptive-agent-workflow/issues/12-decide-verification-review-and-integration-policy.md), [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md), and [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md).
- **Prerequisites / blockers**: T12 `completed` on both hosts; T10 ledger aggregate remains current; live graph/profile revisions are named and unchanged; disposable fixture repository is available. No real dotfile, guidance, account, remote, deployment, or credential may be a mutation target.
- **Owned targets / allowed mutation**: disposable fixture repositories/sessions and `evidence/results/initial-host/`, its manifest, ledger adapter records, and T13 Handoff only. Live skills/profiles are immutable under test.
- **Implementation behavior**: first run one fresh Grok Build canary containing canonical discovery and one minimal `L-ONE-OWNER` live scenario with fresh evaluation. Capacity, provider, credential, or transport unavailability records the exact blocked profile and stops before any remaining Grok or OMP calls. After the canary passes, run compact OMP and Grok host gates concurrently. Each proves fresh 28-name discovery and exact source/body identities, a fresh executable capability profile, all five live scenarios, mutation guard, direct and delegated execution transport, cancellation and isolation where claimed, fresh immutable-target verification, and rollback/restoration identity. Each live scenario receives a separate fresh evaluator. Use instrumented fakes for destructive/shipping effects. Do not rerun shared R/B semantics under either host; consume the T10 staged-ledger aggregate.
- **Acceptance criteria**: the current staged aggregate plus one named live graph and two named profile revisions achieve hard `PASS`; Grok canary passes; both compact host gates pass every claimed capability and all five live scenarios; no authority, approval, ownership, dependency, fallback, verification, integration, completion, shipping, mutation, or user-level-AGENTS violation occurs; fixture cleanup restores its baseline.
- **Targeted checks**: invoke `run_matrix.py` in Grok canary mode for discovery plus `L-ONE-OWNER`; only after `PASS`, invoke OMP and Grok compact host modes concurrently for discovery, capability, and the five `L-*` scenarios. Run installed identity/static postcheck once, compare host discovery/body digests, aggregate host records with the current T10 ledger, and exercise transactional rollback in a disposable copy.
- **Handoff / evidence**: emit `evidence/handoffs/T13.md` with canary outcome, exact staged aggregate, graph/profile/runner/evaluator identities, five-scenario results per host, discovery/capability/mutation/isolation/cancellation/verification/rollback proof, advisories/residuals, hard `PASS`, and T14 as receiver.
- **Rollback / stop**: any canary or host `FAIL`, required `INCONCLUSIVE`, unavailable claimed capability, live drift, or unsafe effect triggers exact T11 rollback to T1 and verification of restoration. Return semantic defects only to their owning staged task and invalidate only their exact ledger closure. Terminal refinement cannot begin without complete compact dual-host `PASS`.
## T14 — Audit the fresh terminal 28-skill graph

- **Governing authority**: **Terminal audit and refinement**, the **Execution amendment 2026-07-29 — lean evidence reuse**, **Critical files and anchors**, **Verification and completion gates** item 6, and ticket [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T13 hard `PASS`; live graph/profiles/ledger/evidence identities frozen; T11 rollback still valid; no concurrent mutation under affected live/staging paths.
- **Owned targets / allowed mutation**: create only `.scratch/eng-flow-cutover/pre-terminal/`, `.scratch/eng-flow-cutover/terminal-candidate/{skills,repo-files}/`, `evidence/terminal-audit-slices/`, `evidence/terminal-skill-audit.md`, T14 manifest/Handoff/results. Auditors and combiner are read-only against named live/candidate inputs.
- **Implementation behavior**: capture an identity-checked `pre-terminal` copy of the passing live skills and affected repo files; copy it into `terminal-candidate` without `WORKFLOW.md`; copy current adaptation-ledger/eval/runner identities as inputs. Dispatch fresh read-only auditors concurrently in four named slices: (1) all 28 identity/activation/source surfaces; (2) deep lifecycle/ownership/handoff review of all 22 workflow-facing skills; (3) six utilities plus references/scripts/licenses/provenance/user-level safety; and (4) active rules and OMP/Grok adapter seams. Auditors receive no implementation transcript and have no write tools. A separate neutral combiner verifies complete coverage, deduplicates without losing distinct evidence, and writes one disposition table. Every finding uses the exact ticket-20 schema with severity, evidence, owner/contract, proposal, mechanical/semantic class, affected proof closure, and target revision.
- **Acceptance criteria**: slice accounting names all 28 and separately all 22 workflow-facing plus six utilities; collectively covers the four required passes; every observation points to exact current paths/revisions and governing contract; auditors/combiner make no edit or hidden authority decision; all slice results reach the combiner; no finding is silently omitted, semantically merged, or prematurely closed.
- **Targeted checks**: compare pre-terminal and terminal-candidate manifests byte-for-byte; verify every auditor/combiner identity, read-only restriction, and pre/post target hash; validate slice coverage and unique finding IDs; validate every consolidated finding has category/severity/path/evidence/owner/defect/proposal/class/proof/disposition/target fields; reconcile input/output finding counts.
- **Handoff / evidence**: emit `evidence/handoffs/T14.md` with passing-live identity, pre-terminal rollback identity, terminal-candidate identity, four auditor identities, combiner identity, slice/coverage accounting, finding counts by severity/category, and T15 as receiver.
- **Rollback / stop**: live graph remains unchanged. Remove only an invalid T14 staging copy/report. Stop on live drift, missing slice, incomplete coverage, auditor/combiner mutation, ambiguous source authority, or any semantic issue needing human/original-contract authority.
## T13R — Repair conservative host capability evidence

- **Governing authority**: the user/original-contract decision recorded at `evidence/authority-decisions/T14-user.md`; the frozen provider- and harness-neutral workflow contract; T13 capability, evaluation, safety, and Handoff requirements; findings `ARSA-CAP-001`, `ARSA-CAP-002`, `ARSA-EVAL-003`, and `ARSA-SAFE-004`.
- **Execution intent**: preserve the approved 28-skill lifecycle and shared behavior while making OMP and Grok CLI only truthful test adapters. Never move provider commands, capability limits, state, evidence paths, or fallback mechanics into shared skills.
- **Owned targets / allowed mutation**: only `evidence/manifests/T13-host-profile.json`, `evidence/runners/run_matrix.py`, affected T13 ledger/results/manifests/Handoff, and finding dispositions. The live, pre-terminal, terminal-candidate, rollback, repository-source, and user-level graphs remain read-only.
- **Implementation behavior**: report each adapter capability as live-observed `native`, `contract-equivalent`, or `unavailable`; remove unsupported top-level native claims. Replace one-response narrated topology proof with distinct captured Task Contract, Context Pack, Attempt, and Handoff identities. Use native dispatch when proven; otherwise use separate sequential attempts with identical logical boundaries; otherwise select and disclose one-owner fallback. Grok verification through a separate OMP evaluator is `contract-equivalent`, never Grok-native. Add process-group/tree timeout cancellation and positive termination accounting; uncertainty remains `BLOCKED`.
- **Acceptance criteria**: no shared skill changes; no capability is broader than its selected immutable evidence; delegated/full cases contain independently identified attempts, causal Handoff consumption, dependency blocking, fan-in, and a fresh verifier, or truthfully select one-owner fallback; timeout captures prove descendant termination and protected-path stability; current OMP/Grok commands remain adapter-local; live skills and user-level `AGENTS.md` identities remain unchanged.
- **Targeted checks**: run runner self-check; run the affected OMP and Grok topology cases with bounded sequential fallback and fresh verification; rerun the compact five-case host aggregates if runner protocol components changed; validate ledger freshness, profile-to-record consistency, process termination, rollback self-check, and exact live/user identities.
- **Handoff / evidence**: emit revised T13 profile/verdict/Handoff and a T13R manifest with before/after runner/profile identities, selected attempt identities, capability classifications, affected case results, finding closures, residual unavailable capabilities, and T15 as receiver.
- **Rollback / stop**: restore the pre-T13R runner/profile/evidence identities on any unsafe partial effect. Stop on ambiguous process termination, protected-path drift, provider-account/credential need, or inability to preserve the shared contract; never overfit a shared skill to make an adapter pass.

## T15 — Refine contracts only in terminal staging

- **Governing authority**: all frozen specification sections plus the **Execution amendment 2026-07-29 — lean evidence reuse** as nonchangeable contract; **Terminal audit and refinement** as mutation authority; ticket [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T14 `completed`; one named refinement owner; every finding classified. A proposed inventory, lifecycle, human-gate, stage-authority, public-interface, or semantic-contract change is not refinement and blocks for the original owner/human rather than being implemented.
- **Owned targets / allowed mutation**: only `terminal-candidate/skills/`, `terminal-candidate/repo-files/`, `evidence/adaptation-ledger.md`, `evidence/manifests/T15-terminal-candidate.json`, finding dispositions, targeted results, and T15 Handoff. No live, pre-terminal, initial candidate, rollback, or user-level path.
- **Implementation behavior**: form one complete finding disposition table before editing. Process one contract-preserving batch in fixed dependency order: leaf owners → backend → router/wrappers/Wayfinder → activation descriptions/references/scripts/evals/support last. Apply `KEEP|COMPACT|MOVE|MERGE|DELETE` only when ticket-20 uniqueness/owner/caller/license/eval conditions hold; move unique detail before deletion; update all callers/rules/references/evals/descriptions together; preserve source/license accuracy; remove no approved skill and leave no alias/dead path. Close every `BLOCKING` and `REQUIRED CLEANUP`; mark each advisory `APPLIED` or `RETAINED` with reason. Update the staged adaptation ledger for every move/merge/delete. Produce one terminal candidate revision and derive its invalidation closure by changed authority paths and protocol components.
- **Acceptance criteria**: exact 28 inventory and frozen behaviors remain; one deepest owner exists per procedure; router/wrappers remain thin; backend contains topology/state but no leaf procedures; triggers are distinct with near misses; all transitions name authority/input/output/stop/next owner; shared bodies remain provider-neutral; support files are referenced/used; no stale caller, duplicate procedure, inaccurate notice, or broad false trigger remains.
- **Targeted checks**: after the complete batch, run the full deterministic candidate/reference/provenance classifier once; run only smallest contract checks needed to establish the change-closure map; compare every declared unaffected authority/protocol component with T14; independently verify every closed blocking/required finding against its original evidence. Do not launch a semantic matrix from T15.
- **Handoff / evidence**: emit `evidence/handoffs/T15.md` with before/after candidate digests, complete finding disposition table, unique-detail movement proof, changed paths/components, derived affected semantic cases/evidence layers, authority-escalation status, and T16 as receiver.
- **Rollback / stop**: revert the whole refinement batch to the T14 terminal-candidate manifest if deterministic checks fail, then rebuild one corrected batch. Stop rather than approximate any semantic/authority decision; preserve the last passing initial live graph and pre-terminal rollback.
## T16 — Pass the refined candidate’s affected semantic closure

- **Governing authority**: **Router-owned evaluation architecture**, **Terminal audit and refinement**, the **Execution amendment 2026-07-29 — lean evidence reuse**, **Verification and completion gates** items 6–7, and tickets [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md) and [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T15 `completed`; no open `BLOCKING`/`REQUIRED CLEANUP`; refined candidate, profiles, evals, ledger, finding table, and T15 invalidation closure are named and immutable under test.
- **Owned targets / allowed mutation**: read-only terminal candidate; write only the append-only ledger, `evidence/results/terminal-first/`, `evidence/manifests/T16-terminal-first.json`, and T16 Handoff. Evaluators cannot repair.
- **Implementation behavior**: run complete static/identity/reference/provenance/rollback proof against the isolated refined candidate. Recompute exact case fingerprints. Reuse T10 records only where the consumed authority closure, fixture, worker protocol, evaluator protocol, assertion policy, and required capability profile are unchanged. Rerun affected worker/evaluator cases, reevaluate retained worker outputs for evaluator-only changes, or replay retained outputs for deterministic-policy changes. `eng-flow` changes invalidate router cases; `eng-implementation` changes invalidate backend cases; leaf changes invalidate only routes whose declared authority closure consumes that leaf; adapter changes do not invalidate staged semantics; metadata/provenance/overview-only changes need deterministic proof unless discovery behavior changed. Aggregate old and new records fail-closed under the terminal candidate's exact component identities.
- **Acceptance criteria**: the refined candidate earns deterministic hard `PASS`; every affected case has its frozen current consecutive passing streak with fresh evaluator separation; every unaffected retained case matches exact component identities; the combined ledger aggregate has no current hard nonpass, missing/duplicate slot, mixed epoch, stale profile, or identity mismatch; finding closure and rollback identities pass; no `WORKFLOW.md` or pointer exists yet.
- **Targeted checks**: run `check_candidate.py` against `terminal-candidate`; materialize and inspect the T15 change-closure map; invoke `run_matrix.py --case-ids ... --ledger ...` only for affected cases/evidence layers; run fail-closed ledger aggregation against the refined component identities; replay machine adversarial checks. A whole shared semantic sweep is allowed only if shared authority, worker protocol, or evaluator contract changed globally.
- **Handoff / evidence**: emit `evidence/handoffs/T16.md` with exact candidate/component/evaluator identities, T15 invalidation closure, retained and new record accounting, per-case current streaks, aggregate digest, audit closure linkage, advisories/residuals, and T17 as receiver.
- **Rollback / stop**: any hard nonpass returns exact evidence to T15 for one revised contract-preserving batch, then invalidates and reruns only the affected closure. Bounded repeated failure under one epoch is blocking instability. A required semantic/authority change returns to its owner; T17 cannot begin.
## T17 — Create the as-built engineering-flow overview

- **Governing authority**: **Canonical `eng-flow/WORKFLOW.md`**, the full frozen specification, T16’s passing as-built evidence, and ticket [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T16 hard `PASS` on one immutable terminal-candidate revision. No overview is legal from a failed, partial, unnamed, or subsequently changed graph.
- **Owned targets / allowed mutation**: create only `.scratch/eng-flow-cutover/terminal-candidate/skills/eng-flow/WORKFLOW.md`, update the staged adaptation ledger disposition, and write T17 evidence/Handoff. Do not edit `SKILL.md` yet or any live path.
- **Implementation behavior**: write the on-demand as-built view with exactly `# Engineering Flow` and the nine ordered H2 sections in the frozen structure. Populate Status with graph identity/date/count 28/OMP-Grok capabilities/final gate and the durable link `[Execution evidence](../../../../.agents/plans/2026-07-28-2309_eng-flow-implementation.md#execution-evidence)`; populate the remaining sections only with the specified low-resolution interfaces, ownership, linked contracts/decisions, exact source pins/adaptations/licenses, verified adapter claims, evaluation gate, and maintenance rule. Fold the verified adaptation ledger into **Research and provenance**. Include no procedures, prompts, transient IDs/models/traces, case payloads, provider commands/bindings/credentials, or unsupported claims.
- **Acceptance criteria**: heading text/order is exact; all 28 skills and canonical owners are accounted for at the required resolution; every link/pin/revision/support claim points to T16-passing reality; overview is non-runtime authority and contains the absolute user-level AGENTS prohibition; no `OVERVIEW.md`, root duplicate, manifest, domain artifact, ADR, or generated copy exists.
- **Targeted checks**: parse the Markdown heading sequence; resolve every repository-relative link; compare inventory, owner table, pin/adapter claims, and graph revision with T16; scan forbidden transient/provider/procedure material; use a fresh read-only semantic reviewer to compare overview statements with immutable candidate/specification/evidence.
- **Handoff / evidence**: emit `evidence/handoffs/T17.md` with overview digest, exact heading/link results, statement-to-authority mapping, provenance-ledger incorporation, reviewer findings, and T18 as receiver.
- **Rollback / stop**: remove only the staged `WORKFLOW.md` if it cannot match T16 without changing the graph. Any graph/contract inconsistency returns to T15/T16; never alter authority to make prose pass.

## T18 — Add the conditional overview pointer

- **Governing authority**: **Canonical `eng-flow/WORKFLOW.md`** pointer contract and ticket [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T17 `completed`; overview target/link/digest valid; terminal candidate otherwise identical to T16.
- **Owned targets / allowed mutation**: only `.scratch/eng-flow-cutover/terminal-candidate/skills/eng-flow/SKILL.md` plus T18 evidence/Handoff.
- **Implementation behavior**: add exactly one ordinary-body conditional pointer: `Read [WORKFLOW.md](WORKFLOW.md) only when understanding, auditing, maintaining, or extending the complete engineering flow; do not load it for ordinary routing.` Place it at the router’s maintenance/context boundary, not in frontmatter or the ordinary routing procedure. Add no second pointer, automatic load, generated reference, or overview content copy.
- **Acceptance criteria**: one exact link occurrence exists; ordinary route triggers/procedure remain byte-identical to T16 apart from that line and required surrounding whitespace; the relative link resolves; routine routing does not require loading `WORKFLOW.md`.
- **Targeted checks**: compare T16/current `eng-flow/SKILL.md`; assert the only semantic diff is the exact pointer; count one `WORKFLOW.md` link; run the `R-DIRECT`, `R-APPROVAL`, `R-DRIFT`, and `R-COMPLETE` static scenarios to detect routing interference.
- **Handoff / evidence**: emit `evidence/handoffs/T18.md` with before/after SKILL digests, exact diff, link resolution, targeted results, and T19 as receiver.
- **Rollback / stop**: restore the T16 router body on any trigger/procedure drift. Stop if a single conditional pointer cannot express the relationship without changing runtime authority.

## T19 — Validate overview structure and semantic consistency

- **Governing authority**: **Canonical `eng-flow/WORKFLOW.md`**, **Terminal audit and refinement** terminal sequence, **Verification and completion gates** item 8, and ticket [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T18 `completed`; overview/router/terminal-candidate revisions fixed; fresh reviewer did not author T17/T18.
- **Owned targets / allowed mutation**: read-only terminal candidate/specification/tickets/T16–T18 evidence; write only `evidence/results/overview/`, `evidence/manifests/T19-terminal.json`, and T19 Handoff.
- **Implementation behavior**: deterministically validate exact heading order/count, one conditional pointer, all links, 28 inventory, source pins, adapter/profile and graph revisions, license references, evidence pointer, no forbidden duplicate artifact, and user-level prohibition. Run a fresh semantic consistency review across lifecycle, ownership, contracts, decisions, provenance, adapter claims, evaluation gate, and maintenance rules. Distinguish overview-only prose defects from graph/SKILL/eval/ownership defects.
- **Acceptance criteria**: every deterministic assertion passes and reviewer returns no blocking semantic mismatch. The overview describes exactly the T16 graph plus T18 pointer, makes no runtime-authority/support claim beyond evidence, and its evidence pointer resolves to the existing plan record rather than a new artifact.
- **Targeted checks**: run `python3 .scratch/eng-flow-cutover/evidence/runners/check_candidate.py --phase overview --skills .scratch/eng-flow-cutover/terminal-candidate/skills --repo-files .scratch/eng-flow-cutover/terminal-candidate/repo-files --manifest .scratch/eng-flow-cutover/evidence/manifests/T16-terminal-first.json --manifest-out .scratch/eng-flow-cutover/evidence/manifests/T19-terminal.json --output .scratch/eng-flow-cutover/evidence/results/overview/static.json`; independently resolve every link and compare all literal pins/counts/revisions; verify target hashes unchanged after review.
- **Handoff / evidence**: emit `evidence/handoffs/T19.md` with structure/link/pin/inventory/revision results, semantic reviewer identity/verdict, exact terminal-candidate digest, and T20 as receiver.
- **Rollback / stop**: an overview-only prose defect returns to T17 then reruns T19; a pointer defect returns to T18 then reruns T19; any SKILL/eval/runtime-reference/ownership/trigger/adapter/behavior defect returns to T15 and requires T16–T19 again. Do not install on any nonpass.

## T20 — Install the terminal candidate coherently

- **Governing authority**: **Non-discovered assembly, coherent cutover, and rollback**, **Terminal audit and refinement** terminal sequence, **Verification and completion gates** item 8, and tickets [`14`](.scratch/adaptive-agent-workflow/issues/14-decide-local-skill-migration-cutover.md) and [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T19 hard `PASS`; live skills/repo files still equal T14’s pre-terminal source identities; T13 initial graph remains the proven rollback target; no concurrent affected-path mutation. Drift blocks installation.
- **Owned targets / allowed mutation**: complete live `.config/agents/skills/` root and only terminal-candidate repo files; transactional journal/Handoff. No user-level path, provider account, Git index/history/remote, or unrelated file.
- **Implementation behavior**: run the same T11 compare-and-swap installer with `--phase terminal`, using the T19 terminal-candidate manifest and T14 pre-terminal snapshot. Replace the complete live skill root so `eng-flow/WORKFLOW.md` and its pointer arrive in the same transaction as every refined body/eval/support change; apply any terminal repo-file changes; preserve discovery alias and adapter profiles unless they are manifest-owned. Journal, fsync, post-verify, and reverse rollback exactly as T11. If live drift exists, do not overwrite it: recapture a new pre-terminal revision, rebuild affected terminal-candidate files from current live plus only approved refinement deltas, and rerun T15–T19 before another install.
- **Acceptance criteria**: live graph/repo targets match T19 exactly; 28 final names, overview, one pointer, final references/licenses, and provider-neutral bodies are coherent; old/alias/provider-copy paths are absent; unrelated live identities and user-level AGENTS hash remain unchanged; rollback restores the T13-passing pre-terminal graph exactly.
- **Targeted checks**: from repository root run `python3 .scratch/eng-flow-cutover/evidence/runners/transactional_install.py --verify-only --phase terminal --candidate-skills .scratch/eng-flow-cutover/terminal-candidate/skills --candidate-repo-files .scratch/eng-flow-cutover/terminal-candidate/repo-files --live-root . --rollback-root .scratch/eng-flow-cutover/pre-terminal --source-manifest .scratch/eng-flow-cutover/evidence/manifests/T14-pre-terminal.json --candidate-manifest .scratch/eng-flow-cutover/evidence/manifests/T19-terminal.json --journal .scratch/eng-flow-cutover/evidence/results/install-terminal/journal.json`; rerun with `--apply` replacing `--verify-only`; then run `python3 .scratch/eng-flow-cutover/evidence/runners/check_candidate.py --phase installed-terminal --skills .config/agents/skills --repo-root . --manifest .scratch/eng-flow-cutover/evidence/manifests/T19-terminal.json --output .scratch/eng-flow-cutover/evidence/results/install-terminal/postcheck.json`. Resolve all links/discovery aliases and compare every journaled pre/post identity.
- **Handoff / evidence**: emit `evidence/handoffs/T20.md` with terminal transaction journal, old/new graph/repo-file digests, installed overview/pointer identities, drift result, rollback reference, and T21 as receiver.
- **Rollback / stop**: any transactional or postcheck failure immediately restores T14 pre-terminal identities and proves the T13 graph live. Never leave a hybrid or repair live files in place.

## T21 — Pass compact final live OMP/Grok conformance

- **Governing authority**: **Router-owned evaluation architecture**, **Terminal audit and refinement**, the **Execution amendment 2026-07-29 — lean evidence reuse**, **Canonical `eng-flow/WORKFLOW.md`**, **Verification and completion gates** item 8, and tickets [`13`](.scratch/adaptive-agent-workflow/issues/13-design-routing-and-orchestration-evaluations.md), [`19`](.scratch/adaptive-agent-workflow/issues/19-research-approved-cursor-workflow-inputs.md), and [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T20 `completed`; T16 semantic aggregate remains current except explicitly classified overview/pointer changes; live graph/profile/overview/eval revisions immutable under test; both fresh host runtimes available; T14 rollback retained.
- **Owned targets / allowed mutation**: disposable fixture/session state, append-only adapter ledger records, `evidence/results/terminal-live/`, `evidence/manifests/T21-terminal-live.json`, and T21 Handoff. Live skills, rules, plans, profiles, overview, and guidance are read-only.
- **Implementation behavior**: run a fresh Grok discovery plus `L-ONE-OWNER` canary first and fail fast on capacity/provider/credential/transport unavailability. After it passes, run compact OMP and Grok host gates concurrently: rediscover 28 names/canonical paths and exact installed identities; refresh capability profiles; run the five live scenarios with separate fresh evaluators; exercise direct/delegated transport, cancellation/isolation where claimed, mutation guard, fresh verification independence, safe cleanup, and rollback/restoration identity. Recheck overview semantics/links and user-level AGENTS identity. Rerun only staged semantic cases whose exact consumed authority/protocol closure changed since T16. The conditional `WORKFLOW.md` pointer receives deterministic single-occurrence/link/load-boundary proof plus the routine live canary; it does not by itself trigger a complete shared sweep unless observed discovery/routing changed.
- **Acceptance criteria**: the current semantic ledger aggregate plus both compact host gates produce hard `PASS` on the same final graph and named profiles; Grok canary and all five live scenarios per host pass; every claimed host capability is observed; overview matches reality; live and fixture pre/post hashes prove no unintended mutation; no current semantic case is stale.
- **Targeted checks**: run Grok canary mode; only after `PASS`, run OMP/Grok compact host modes concurrently for discovery, capabilities, and all five `L-*` scenarios. Run installed identity/static/overview postcheck once, aggregate adapter and any targeted semantic records with T16, compare discovery/body/overview digests across hosts, and exercise rollback in a disposable copy. Do not invoke full router/backend suites per host.
- **Handoff / evidence**: emit `evidence/handoffs/T21.md` with canary outcome, final semantic aggregate, compact dual-host results, graph/profile/runner/evaluator revisions, capability levels, discovery/mutation/isolation/cancellation/verification/rollback proof, overview consistency, advisories/residuals, and T22 as receiver.
- **Rollback / stop**: any canary or host hard nonpass, unavailable claimed capability, stale semantic closure, overview inconsistency, or live drift restores T14’s T13-passing graph through the T20 journal. Repair only terminal staging under T15 authority, then rerun the affected closure and T17–T21; never retain a failed terminal live graph.
## T22 — Close durable evidence and remove cutover staging

- **Governing authority**: **Smoke, verification, integration, review, shipping, and completion**, **Continual-learning contract**, **Canonical `eng-flow/WORKFLOW.md`**, **Verification and completion gates** item 9, and tickets [`12`](.scratch/adaptive-agent-workflow/issues/12-decide-verification-review-and-integration-policy.md), [`18`](.scratch/adaptive-agent-workflow/issues/18-place-continual-learning-and-agents-updates.md), and [`20`](.scratch/adaptive-agent-workflow/issues/20-define-terminal-skill-refinement-and-workflow-overview.md).
- **Prerequisites / blockers**: T21 hard `PASS`; final live graph/profile/overview identities unchanged; every T1–T21 Handoff present; no required work, finding, criterion, review, curation, or human gate nonterminal.
- **Owned targets / allowed mutation**: execution bookkeeping in the existing canonical `local://eng-flow-implementation-plan.md`, its configured automatic noncanonical transport mirror, and owned `.scratch/eng-flow-cutover/` removal. No new plan/specification/ticket/overview/evidence file, `WORKFLOW.md`, skill behavior, eval, rule, adapter, guidance, Git, remote, release, or account mutation.
- **Implementation behavior**: replace the `PENDING` line under **Execution evidence** with this fixed field order: `Completed at`; `Plan revision`; `Final skill graph`; `Source pins`; `OMP profile and matrix`; `Grok profile and matrix`; `Task outcomes` with one T1–T22 code/outcome/Handoff digest row; `Audit dispositions`; `Role, smoke, verification, integration, review, curation, and completion evidence`; `Rollback proof`; `Cleanup proof`; `User-level AGENTS identity`; `Advisories and residual risk`. Mark T1–T22 checklist items complete and change header `Status` from `PENDING` to `COMPLETE` only after every field is grounded. Let configured `plan-artifact-sync` mirror the canonical update; never edit the mirror independently. Verify the prewritten `WORKFLOW.md` evidence link resolves to the mirrored **Execution evidence** anchor. After all essential evidence is embedded or linked by durable harness artifact identity, remove the owned `.scratch/eng-flow-cutover/` tree and prove no cutover/rollback/staging root remains.
- **Acceptance criteria**: execution record proves all completion gates with no unresolved hard item; `WORKFLOW.md` matches final live graph/support and its evidence link resolves; both hosts remain fresh-pass; temporary candidate/pre-cutover/pre-terminal/rollback/results/Handoffs are removed; user-level AGENTS remains byte-identical; no stage/commit/push/PR/release/deploy occurred.
- **Targeted checks**: rerun final inventory/frontmatter/link/pin/reference/provider-neutrality/user-level-hash assertions directly on live state; verify the transport mirror contains the same completed checklist/evidence revision and link anchor; verify `.scratch/eng-flow-cutover/` is absent.
- **Handoff / evidence**: place the terminal backend Handoff fields into **Execution evidence** before deleting scratch, naming the exact completed plan/graph/profile identities, `APPROVED` final review, `CURATED|NO DURABLE LEARNING`, dual-host `PASS`, residuals, and proof no required work remains.
- **Rollback / stop**: if durable evidence cannot be completed or cleanup cannot safely remove only owned staging, leave the verified live graph and owned staging intact, mark T22 `BLOCKED`, and report the exact obstacle. Never delete unknown work or weaken evidence to claim completion.

## Verification / Done criteria

The plan is done only when T1–T22 complete in order and the existing plan record contains grounded evidence for every assertion below:

1. T1 proves current authority, exact rollback bytes/modes/links, immutable Matt/Cursor pins, live OMP/Grok inputs, and unchanged user-level AGENTS identity.
2. T9/T10 prove a non-discovered candidate with exactly 28 canonical names, one body per capability, no old/alias/provider copies, final active references, valid eval/schema/fixtures/runners, accurate provenance/licenses, and a hard deterministic plus ledger-aggregated shared semantic/simulation `PASS` with every failed attempt retained.
3. T11/T12 prove drift-checked transactional initial installation, exact rollback, fresh 28-name OMP and Grok discovery, canonical body resolution, and no old identities.
4. T13 proves the Grok fail-fast canary and compact initial host gate on both adapters, including exact identity/capability profiles, five live scenarios, mutation safety, direct/delegated transport, cancellation/isolation where claimed, fresh verification, rollback, and disposable cleanup without rerunning shared semantics per host.
5. T14/T15 prove the parallel fresh 28-skill/22-workflow terminal audit, neutral consolidation, and one contract-preserving refinement batch closing every `BLOCKING`/`REQUIRED CLEANUP` finding with advisories explicitly dispositioned.
6. T16 proves complete deterministic conformance plus the exact affected semantic closure on the refined isolated candidate, with retained records matching component identities and one hard aggregate before any overview exists.
7. T17–T19 prove exact `eng-flow/WORKFLOW.md` structure/content, one conditional pointer, links/pins/inventory/revisions/licenses/evidence reference, and fresh semantic consistency without runtime-authority drift.
8. T20/T21 prove coherent terminal installation, current affected semantic evidence, and compact final live conformance in fresh OMP/Grok contexts on the final graph/profile revisions.
9. T22 proves final evidence accounting, plan/transport identity, final overview/live consistency, unchanged `/Users/kim/.agents/AGENTS.md`, absence of temporary cutover material, and absence of staging/commit/push/PR/release/deploy/account mutation.

Any required `FAIL`, `NOT VERIFIED`, `INCONCLUSIVE`, missing repetition, stale identity, unsafe partial effect, unavailable claimed capability, unresolved blocking/required audit finding, or user-level AGENTS difference means **not done**. `ADVISORY` never overrides a hard gate.

## Execution assumptions and fallbacks

- The current 16-skill/root/reference/profile facts are inputs, not assumptions: T1 must re-read and hash them. Any drift rebuilds the snapshot and every affected staged artifact/check; no stale patch applies.
- `.grok/skills` is expected to resolve to the canonical skill root. If T1 disproves that, preserve one canonical body and treat the alternate surface only as an adapter mapping; never copy bodies.
- Existing OMP/Grok authentication/runtime is expected. Missing account, permission, service, executable, or non-equivalent transport yields `BLOCKED`; no task logs in, pays, installs/updates a provider, or drops the dual-host claim.
- If a host needs only provider-local discovery/invocation metadata, T12 rolls back live, stages the smallest change under its existing harness directory, and reruns T10–T12. Shared semantics never change for a host.
- If transactional compare/replace/fsync/reverse-rollback cannot be proved on the current filesystem, stop before live mutation. Do not substitute direct copy, broad deletion, or a best-effort hybrid.
- If live user work appears after any snapshot, preserve it, recapture from current state, reapply only approved staged deltas, and rerun all invalidated checks before cutover.
- If terminal audit finds a semantic/inventory/lifecycle/authority change, T15 blocks for the original authority/human. Contract-preserving cleanup proceeds only under ticket-20 conditions.
- No canonical domain artifact is created. Atlas absence uses direct cited research; stale Atlas freshness stops; unimplemented Atlas scheduling remains unclaimed.
- Independently written procedures are the default. If selected source text remains a copy/substantial portion, the exact applicable sibling MIT notice is mandatory; uncertain text is rewritten independently.
- The configured `.agents/plans/2026-07-28-2309_eng-flow-implementation.md` remains a noncanonical transport mirror of this one artifact. It may carry the durable execution-evidence anchor but never becomes competing semantic authority.
- Cleanup removes only the identity-proven `.scratch/eng-flow-cutover/` tree after evidence closure. Ownership ambiguity leaves staging in place and T22 blocked.

## Execution evidence

### Completed at

`2026-07-30-1514 UTC`

### Plan revision

- Canonical authority entering T22: `local://eng-flow-implementation-plan.md` SHA-256 `b43f0f16d3a789a0d2c134481f01d7a49c5ab8063b2593299ad2f18a6f30fb45`.
- Final plan/transport semantic revision: `ef9208309c1958af39f3f5a5bb36e309c00793591ea14c18f485b8ca8b55fa2a`. Identity algorithm: SHA-256 over the canonical file’s UTF-8 bytes after exactly three substitutions and no other normalization: replace the first full line matching `**Datetime**: ...` with `**Datetime**: <TRANSPORT>`; replace this field’s backticked digest value with `<PLAN-REVISION>`; replace the T22 task-outcome row’s backticked Handoff digest value with `<T22-HANDOFF>`.
- T22 embedded-Handoff identity: SHA-256 over the UTF-8 bytes beginning with `## Execution evidence` and ending immediately before `## Completion Summary`, after replacing only the T22 task-outcome row’s backticked Handoff digest value with `<T22-HANDOFF>`.
- Configured transport: `.agents/plans/2026-07-28-2309_eng-flow-implementation.md`; noncanonical mirror only.

### Final skill graph

- Live `.config/agents/skills/` tree SHA-256: `b77644e531d44b7b2cf85730b81e14b0cb1099f4cc0087b9056404d4569934ba`.
- Installed graph SHA-256: `d3dd0539b0b95afb1f62b0de0f06154cd23a760f6f510b6b88c8bed1e9773302`; terminal manifest SHA-256 `38ad391cdb73d95db14723de256f8726321eee5f1b1ffd0e31f6df98b5149b1f`.
- Exact inventory: 28 canonical skill names; 22 workflow-facing and six retained utilities; no old identity, alias body, or provider copy.
- `eng-flow/SKILL.md` SHA-256 `70b44572b938481ce621d18ab1945b77fb6a72aa55848b52b7a45e2983041cee`; `eng-flow/WORKFLOW.md` SHA-256 `5c09da80ada48f17074acbeefe41030964909a1ec020fc52fb496a3efa784747`; exactly one conditional overview pointer.

### Source pins

- Authority manifest SHA-256 `c1d781374a8d4159836656f1791c321dd57dc8dd8c98374e47b65a112d8c48db`; all 27 selected paths were fetched from immutable commits.
- Matt Pocock skills: `mattpocock/skills@ed37663cc5fbef691ddfecd080dff42f7e7e350d`, package `1.1.0`, MIT.
- Cursor design inputs: `cursor/plugins@91be0f994b5de7a75f4d6f2b3b00958126d9195e`, component-local MIT notices; no root license at the pin and no copied Cursor prose or graphics.
- Public design evidence: Wilson Lin, “Agent swarms and the new model economics,” published `2026-07-20`, accessed `2026-07-29`; non-immutable public revision, design evidence only.

### OMP profile and matrix

- OMP `17.2.0`; profile SHA-256 `f58dc0e58728927a712df7f0ce9de352bc2fbd9148117f0a442459573f6bec07`.
- Fresh discovery inventory SHA-256 `0726c2ca2dc0f7a24d871627d1e68e303c18361d5c735841ccb6990373a7b46d`: 28 exact names and installed router body.
- Final five-case matrix SHA-256 `3dd9091fd7844e53509720764ecf17a5c335afe98b6584892e660c6ae784d679`: five `PASS`, five machine `VERIFIED`, five fresh evaluator `VERIFIED`.

### Grok profile and matrix

- Grok `0.2.114 (0c785038798) [stable]`; profile SHA-256 `a104579a8e1595d113b012e8400893e1e15b1a036cc36098402cec6e619b1350`.
- Fresh discovery inventory SHA-256 `b669ebafbe655457b0ca891686698426be563edf7746a83cd035b22bd975aefd`: 28 exact names and installed router body.
- Fail-fast `L-ONE-OWNER` canary SHA-256 `ed3741faa0dccf8b79fc04d232948ff17d716c599995523638da3a69f58796fb`: `PASS`.
- Final five-case matrix SHA-256 `59ef82b627245cf552b284653a22d3733b1a5de1dd89bcf0c3cc20404bb05252`: five `PASS`, five machine `VERIFIED`, five fresh evaluator `VERIFIED`.

### Task outcomes

| Task | Outcome | Handoff SHA-256 |
|---|---|---|
| T1 | completed after authority recapture | `20c9077093acededc06605b2aa5bfeb901b556d70e7af8c6be800d1d34f2a1cf` |
| T2 | completed | `75b76d4825ce432ddfbb1d66e6ea7722a53a14880c254dd47cc30b1778cf9363` |
| T3 | completed | `c1eef6c1bf7863a867d29bb3f63aa6352e1a2a54420cd01a4058983607c2ae4a` |
| T4 | completed | `264182519f97b9609144e2ae142e7ffb7711a49123204c6cbbb839a97cfebd30` |
| T5 | completed | `e956b11aa8fc0514eacaa45148ef7db00a6e698086b272c80bdba6c044ae1970` |
| T6 | completed | `710ca1d7601c06640288f5df03d3343ac7e9cc769ae0f0e46df4bd8a44a6705f` |
| T7 | completed | `cb7ea0b162d25d9f5c2a65c3dc13c82f27bfc3457a93402afcb0cbd0221efa0f` |
| T8 | completed | `54fa31ab29b92fe563c84c2a438ae0de4e88d8a19cb95a7db3f43499949dbf54` |
| T9 | completed | `40b9850a3a5cd278cc7cdb94cad1402e7cdb8101008dd56cc48215784d9a0823` |
| T10 | completed | `916b60c2ec998a06dd02f793af3bea255a7018ba58fb36df5800ef1c0555f9c6` |
| T11 | completed | `7c9f2b59c657e66972a18b016c969e7474916a59ad65b6e89f20c63d386af9db` |
| T12 | completed | `807d11d318275867ae043515bbe2b61f8e0bbe82b2bee11cc8a02aeabebebd20` |
| T13 | completed after conservative repair continuation T13R (`056aac3198b1eefb8b45b35a5e8ca62e8bf80d5baa3e669fd2e5f2fc7abd0d48`) | `924389b3a0705ea9e27aa58564e8ace8708001615439b4007f32a8c52cffb191` |
| T14 | completed audit; authority-required set resolved before refinement | `9cd249a6445371a53658befe0bfd56f37604f8b16c078b8f041915ba7740b750` |
| T15 | completed after one bounded stale-fixture correction | `401aa5a8391d84010b6d3f0bb95b054a2e06d8b42aa67718244d5fc38f48c814` |
| T16 | completed | `15ea2dc2e7a2cb3177e9c9450977d42c7c8abf9292b6ac4e2c4284712de11b54` |
| T17 | completed | `7d9b2beedabf0ce911025f60a24f2c0cc39aded21dfa244645c2a9077fc98694` |
| T18 | completed | `9cc72fe7e45f5906bb04a4b3baf8cde4da40af813d24d789e6d05ee28eb15b5a` |
| T19 | completed with final review `APPROVED` | `ea1b470e601f565d1e3032833ddab3014587dd289560832e1b43ec9ff036ff9e` |
| T20 | completed after one rolled-back evidence-infrastructure attempt | `c4e8db5c8ca5ecfae9405cc98f43832722fac82252d83f8d16536279ff92aa7c` |
| T21 | completed; independent verifier `PASS`, zero blockers/advisories | `3739354d4fa64e6b87c4ad9d40024cc5191f298d0c0808dd897609b30584e32a` |
| T22 | completed; cleanup passed and fresh closure-verification attempt 2 returned `PASS`, no blocker/advisory | `e855748bf508afbda2d4c57913a5d6c9da7eeab8ddc5398aa19553b7e77b4d6b` |

### Audit dispositions

- T14 accounted 36 source findings over all 28 skills and the exact 22/6 partition: 34 `BLOCKING`, two `REQUIRED CLEANUP`; 20 initially required original authority and 16 were contract-preserving.
- Original authority SHA-256 `77cad48acbcc9f21d5e01bbb5a1a7fc4e268d8dd73cd0c7829bcf097757da371` preserved the approved inventory, lifecycle, human gates, and provider-neutral contracts.
- T15 disposition SHA-256 `c25ce7c679513ffefa79ab158112898f1b6940f78e480082ffb941953a4caf70`: all 36 findings exactly once as authorized contract-preserving repairs; zero unresolved `BLOCKING`, `REQUIRED CLEANUP`, or `AUTHORITY_REQUIRED` finding.

### Role, smoke, verification, integration, review, curation, and completion evidence

- Role/authority: one thin `eng-flow` router, one deep `eng-implementation` backend, separate leaf owners, 22 workflow-facing skills, six utilities, and immutable common Task Contract/Context Pack/Handoff identities.
- Smoke: transactional initial and terminal installation postchecks passed; final live `L-MUTATION` and `L-ONE-OWNER` changed only their disposable fixture target and observed the exact requested result.
- Verification: T16 retained 148 records and selected a hard 49-case aggregate `PASS`; T18 passed the four-case pointer closure; T21 passed ten final host cases with ten distinct fresh evaluator processes. Independent T21 verification returned nine criterion-level `PASS`, no blockers, and no advisories.
- Integration: one coherent candidate lineage was transactionally installed; no multi-lineage semantic fan-in was required. T14’s four read-only audit slices were neutrally combined before authority resolution and refinement.
- Review: fresh T19 reviewer recomputed the terminal graph/overview/router and returned Standards `PASS`, Specification `PASS`, Overall `APPROVED`, blockers none, advisories none; T20/T21 left that exact reviewed target unchanged.
- Curation: neutral T22 curator returned `NO DURABLE LEARNING` on target `b77644e531d44b7b2cf85730b81e14b0cb1099f4cc0087b9056404d4569934ba` and T21 Handoff `3739354d4fa64e6b87c4ad9d40024cc5191f298d0c0808dd897609b30584e32a`; six qualifying lessons were already covered, one generic evidence-runner lesson was rejected, and closure/transient-state candidates were deferred or rejected. Guidance changes, blockers, and curation residual risk: none.
- Completion: `PASS`. All T1–T22 tasks, criteria, findings, review, curation, cleanup actions, and human gates are terminal; no required work remains nonterminal.

### Rollback proof

- T20 journal SHA-256 `d2350f33bb43d0f43e78be203d5aa5141a6863daeb9bdee54a7c6ab2052cbc48` records coherent terminal apply after its exact first attempt rolled back.
- Pre-terminal graph `986417f871d35acaf9eaa438fc5d239533d869e236904b542a1b5d3cbbe8eb38` and exact rollback bytes/modes/links remained available through T21.
- Disposable rollback self-check SHA-256 `c4028e4f6012545084e2c2097c75c8efce195cf24a39ab1726c12123a68dcada` forced failure after first replacement and restored identical baseline `c599e5a7f25caec4c5a7ae9587dde20292983fa4e6c6b43b60f3589decb35ff2`.

### Cleanup proof

- Pre-cleanup ownership check: `.scratch/eng-flow-cutover/` was absent before T1 and contained only the plan-owned `candidate/`, `pre-cutover/`, `pre-terminal/`, `terminal-candidate/`, and `evidence/` roots; no unknown owner or path was present. Frozen pre-removal tree SHA-256: `be7faa2eaacf7e0d93f822d43e11113d43f0099427a4936e8548c4b466ef00ef`.
- Essential evidence was embedded before deletion. At that pre-cleanup revision, canonical SHA-256 `8925e91a1d2b766bbf2ffb71a7d785bdeb95d634e080f7372bb328d441f990a2` and mirror SHA-256 `19a9a4043746241abfd8064e62b00b6d02fe1ff5f3d07874ebb22e1f4c4d5bef` became the same `5fba6b7b41d1df962193ca33fa3fc4feda5822a4cd9deb82d8208041e299f93d` only after replacing their first full `Datetime` lines with `**Datetime**: <TRANSPORT>`; both `WORKFLOW.md` links resolved to the mirror’s `Execution evidence` anchor.
- Removed only `.scratch/eng-flow-cutover/`; exact-path absence proof passed. Fresh T22 closure-verification attempt 2 rechecked the live graph, router, overview, protected AGENTS, plan/mirror, links, evidence gates, and cleanup; verdict `PASS`, final refresh safe.
- Operation accounting: no `dot-add`, Git staging, commit, push, PR, release, deploy, provider login, credential, subscription, or account mutation occurred.

### User-level AGENTS identity

- `/Users/kim/.agents/AGENTS.md` SHA-256 `1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9`; content was never copied or modified. The final direct installed-state check reproduced this identity.

### Advisories and residual risk

- No hard blocker, unresolved audit finding, stale selected attempt, unverified claimed capability, partial live effect, or curation blocker.
- Cursor’s public article is non-immutable and remains design evidence only. OMP/Grok outputs are runtime-stochastic; exact current profiles, matrices, and immutable ledgers passed.
- Public isolation, peer messaging, durable recovery, and native nested/concurrent delegation remain explicit non-claims where unavailable. Contract-equivalent sequential projection is not native concurrency.
- T22 closure-verification attempt 1 returned `INCONCLUSIVE` only because the normalized-identity byte algorithm and the pre-cleanup digest scope were ambiguous. The plan-only correction declared both; fresh attempt 2 returned `PASS`. The final status and digest insertion are deterministic nonbehavioral identity refreshes. Residual T22 risk: none.

## Completion Summary

- Delivered one clean-cutover 28-skill graph with a thin `eng-flow` router, deep shared execution backend, separate lifecycle authorities, exact provenance/licenses, portable evaluation contracts, and one on-demand as-built `eng-flow/WORKFLOW.md`.
- Installed the terminal graph transactionally and proved exact OMP/Grok discovery, five live scenarios per host, fresh verification, bounded mutation, Handoff topology, conservative capability levels, cancellation, rollback, review `APPROVED`, and curation `NO DURABLE LEARNING`.
- Closed all 36 terminal-audit findings without changing the approved inventory, lifecycle, human gates, or provider-neutral contracts. No hard finding, stale selected attempt, unverified claim, unsafe partial effect, or required nonterminal work remains.
- Removed only the identity-proven `.scratch/eng-flow-cutover/` staging and recovery tree after embedding the durable evidence above. `/Users/kim/.agents/AGENTS.md` remained byte-identical.
- T22’s first direct live check used the installed manifest as though it were the source candidate manifest and correctly returned a diagnostic nonpass; the governing T19 source manifest rerun reproduced the exact prior `PASS` and unchanged target. Closure-verification attempt 1 then exposed only an ambiguous plan-identity algorithm; the plan-only correction and fresh attempt 2 passed.
- No Git staging, commit, push, PR, release, deploy, provider login, credential, subscription, or account mutation occurred. The configured repository file remains a noncanonical transport mirror because `WORKFLOW.md` intentionally resolves its durable evidence anchor there.
- Residual advisories: the cited public Cursor article is non-immutable design evidence; provider outputs remain runtime-stochastic; unavailable isolation, messaging, durability, and native concurrent/nested delegation remain explicit non-claims. Residual hard risk: none.
