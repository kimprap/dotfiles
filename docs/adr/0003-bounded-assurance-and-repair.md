# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Decision IDs:** D03, D04

## Scope

This decision governs worker smoke, independent verification boundaries, neutral fan-in, final review, diagnosis entry, blocker aggregation, semantic attempts, and the single post-assurance repair allowance for the generic engineering workflow. It applies to `dev-implementation`, `dev-diagnosing-bugs`, `dev-verification`, `dev-integration`, `dev-code-review`, `dev-handoff`, and their targeted fixtures. It does not let an assurance role repair implementation or authorize a lifecycle reset.

## Context / problem

Independent proof is necessary, but proof after every small task can cost more than the feedback it provides and can turn ceremony into the convergence signal. The opposite extreme—waiting until the end while combining unverified isolated lineages—allows defects and identity drift into fan-in. Revisions also create a loophole if each verifier or reviewer blocker can restart an unlimited repair/reproof/review cycle. The workflow needs cheap local feedback at each effect, fresh independent evidence at consumable boundaries, one final standards review, and a run-wide stop condition that survives derivative revision changes.

## Adopted decision

1. **Smoke every implementation task.** The worker exercises the changed path or smallest applicable scenario before handing off. Smoke is local evidence, not independent verification.
2. **Verify at useful immutable boundaries.** Fresh read-only verification covers every consumable isolated lineage before it becomes a fan-in input, the final integrated target after neutral fan-in, or the final single-lineage target. Explicit high-consequence checkpoints may require additional independent proof. Multiple isolated lineages fan in only after each exact lineage is verified; single-lineage work skips integration.
3. **Review the final target once.** A separate read-only reviewer evaluates the exact independently verified final target against current standards and specification. Advisories become residual risk; only blocking findings can authorize repair.
4. **Collect blockers before repairing.** One verification/review pass aggregates every exact blocking criterion and finding ID. The implementation owner may receive one consolidated derivative post-assurance repair revision for the same approved outcome.
5. **Rerun only impacted assurance once, then stop.** After that repair, rerun the impacted proof plus preserved-behavior coverage and one final review rerun. A remaining blocker, repeated frontier, unchanged hypothesis, exhausted attempt budget, or no progress produces an exact blocker/escalation Handoff; it does not restart planning, diagnosis, verification, review, or the lifecycle.
6. **Preserve local bounded recovery.** The existing maximum of three semantic attempts per unchanged Task Contract revision and two safe transport retries remain. The one post-assurance repair allowance is inherited across derivative revisions for the same outcome, so changing a revision cannot reset the assurance tail. A semantic pass must implement/prove a named criterion, remove a named blocker, change authority/route facts through new decision evidence, or terminate explicitly after consuming the authorized budget.
7. **Keep diagnosis narrow and assurance roles non-repairing.** Hard unexplained reproducible defects with settled expected behavior may receive one bounded diagnosis that returns a fix contract, blocker, or architecture finding. Known-cause and routine implementation, verification, or review defects repair directly under the available budget. Verifiers, integrators, reviewers, curators, planners, and routers never repair implementation in place.

## Rejected alternatives and reasons

- **Unlimited repair/review recursion:** rejected because another revision must not reset convergence and make procedure replace acceptance.
- **Two automatic post-assurance repair rounds or per-plan “generous” retry choices:** rejected because the run-wide same-outcome bound must be stable and predictable.
- **A fourth semantic attempt per unchanged Task Contract or an automatic lifecycle reset:** rejected because unchanged evidence or a repeated frontier is not progress.
- **Independent verification and review after every task:** rejected because worker smoke supplies cheap immediate feedback and boundary proof gives independent evidence where outputs become consumable.
- **Final-only proof when unverified isolated lineages are fan-in inputs:** rejected because integration would combine untrusted identities and make failures harder to localize.
- **Continuous independent proof for every microtask regardless of risk or feedback cost:** rejected because assurance depth and placement must follow consequence and boundary value, not ceremony count.
- **An implementer plus two reviewers plus a fixer for every unit, or Anthropic's six migration steps as generic policy:** rejected because a migration-specific pipeline is not the universal engineering lifecycle.
- **A verifier, integrator, reviewer, curator, planner, or router repairing implementation in place:** rejected because it destroys independent evidence and responsibility boundaries.
- **A verifier or reviewer silently choosing product/architecture semantics, planning a new route, or redirecting to diagnosis without an authority gap:** rejected because assurance reports evidence and blockers; it does not gain decision authority.
- **Routine or known-cause failures entering diagnosis, or repeated diagnosis with an unchanged hypothesis:** rejected because the fix owner already has enough information and diagnosis would add a process-only loop.
- **Advisories reopening implementation or granting another repair:** rejected because only aggregated blocking criteria/findings consume the one repair allowance.
- **Fan-in for one lineage, semantic conflict resolution by the integrator, or fan-in that drops an input:** rejected because integration is neutral and only combines every named exact verified lineage.
- **Another evaluator role, review stage, retry state machine, or review-owned runtime ledger:** rejected because existing smoke, verification, integration, review, Handoff, and backend contracts already own the required responsibilities.
- **Weakening immutable identity, compatibility/degraded behavior, residual-risk disclosure, or shipping boundaries to shorten assurance:** rejected because convergence cannot trade away the approved safety contract.

## Consequences / invariants

- Worker smoke remains cheap and immediate; independent proof remains fresh and read-only.
- Every fan-in input has exact independently verified identity, and the combined target is verified again.
- One cohesive lineage avoids per-task independent proof and neutral integration overhead while still receiving final verification and review.
- Blocking evidence is consolidated before repair. The inherited same-outcome allowance permits no automatic second post-assurance repair.
- A new derivative revision does not erase prior attempts, blocker history, or repair consumption.
- No-progress output, repeated evidence, another audit, elapsed time, review count, or agent activity cannot authorize continuation.
- A remaining blocker after impacted reproof/review stops with exact authority and receiver; completion is not claimed.
- Assurance profile remains immutable and independent of lifecycle depth and execution topology.
- Active skills, rules, `WORKFLOW.md`, and active ADRs must be updated atomically when this contract changes; conflict fails closed.

## Affected contracts

- `.config/agents/skills/dev-implementation/SKILL.md` for smoke, boundary scheduling, progress, attempts, inherited repair budget, review accounting, and terminal stops.
- `.config/agents/skills/dev-diagnosing-bugs/SKILL.md` for hard-defect entry, known/routine near misses, same-defect bound, exact return, and one receiver.
- `.config/agents/skills/dev-verification/SKILL.md`, `.config/agents/skills/dev-integration/SKILL.md`, and `.config/agents/skills/dev-code-review/SKILL.md` for fresh boundary proof, neutral verified-only fan-in, one final review, and aggregated blocker/finding returns.
- `.config/agents/skills/dev-handoff/SKILL.md` for exact target, criterion delta, route impact, inherited attempt/repair state, next frontier, and one receiver.
- `.config/agents/skills/dev-ask/WORKFLOW.md` for concise current diagnosis, assurance, repair, stop, learning, and shipping boundaries.
- `.config/agents/skills/dev-ask/evals/evals.json` and its routine/hard diagnosis, shared/isolated boundary, verified-fan-in, one-repair, remaining-blocker, and completion fixtures.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains convergence authority rather than attempt, blocker, or review state.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D03 and D04; **Bounded diagnosis, assurance, and repair**; **Fixed shared contracts**; **Target workflow invariants**; **Material approval boundary**; and T4/T6 task contracts. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: neutral conflict handling and held-out outcome grading inform boundaries; unlimited stacked reviews do not.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: cheap smoke before expensive parity and recurring-failure feedback inform ordering; its six-step migration pipeline and implementer-plus-two-reviewers-plus-fixer topology are not generic policy.
- Flexcompute, [The Agent Control Loop—Engineering for Tolerance](https://engineering.flexcompute.com/articles/agent-control-loop/), published 2026-01-19: measurable constraints, blast radius, and verification as termination inform the contract; continuous per-microtask independent proof is limited by feedback cost and risk.
- Atlas references named by the governing plan are advisory evidence only and do not authorize assurance or repair.
- Executable lineage revisions: completed T4 Common Handoff `agent://BoundedConvergence`, consuming T2 `agent://WorkflowRouting` and T3 `agent://ExecutorOrchestration`; T5 documentation/fixture synchronization under `AUTH-PLAN`.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan are the authority for adopting this record. The parent execution dispatch authorizes only this exact D03/D04 materialization. It does not authorize executable assurance changes, a second repair, weaker independence, topology escalation, product/architecture decisions, destructive effects, or shipping.

## Supersession / reopen conditions

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Reopen or seek reapproval if smoke placement, independent lineage/final boundaries, fan-in prerequisites, final review count, blocker aggregation, the inherited one-repair allowance, local attempt ceiling, diagnosis entry, assurance-role neutrality, immutable identity, or stop conditions change. Adding a repair round, weakening proof/independence, changing authority, or introducing external effects always requires reapproval; mechanical fixture wording does not.

## Verification expectations

- **AC09:** Routine and known-cause defects bypass diagnosis; one hard unexplained defect produces one fix contract, blocker, or architecture finding and cannot repeat unchanged.
- **AC10:** Every task has worker smoke; independent verification appears at each declared isolated-lineage/final/high-consequence boundary; integration consumes all and only exact verified lineages; the final target receives one review.
- **AC11:** One pass aggregates blocking criterion/finding IDs, one consolidated repair revision is allowed, impacted proof and final review rerun once, and a remaining blocker stops without a second repair or lifecycle restart.
- Attempt fixtures must preserve the three-semantic-attempt ceiling per unchanged Task Contract, two safe transport retries, inherited same-outcome repair state, and rejection of no-progress continuation.
- Identity and role fixtures must prove verifier/integrator/reviewer neutrality, fresh target evidence, advisory residual-risk behavior, and no implicit shipping effect.
- A future executable revision must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
