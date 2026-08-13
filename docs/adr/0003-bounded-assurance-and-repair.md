# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-11  
**Decision IDs:** D03, D04, D22

## Scope

This decision governs worker smoke, independent verification boundaries, neutral fan-in, final review, diagnosis entry, blocker aggregation, semantic attempts, the single post-assurance repair allowance, and the final review's complexity lens for the generic engineering workflow. It applies to `dev-implementation`, `dev-diagnosing-bugs`, `dev-verification`, `dev-integration`, `dev-code-review`, `dev-handoff`, and their targeted fixtures. It does not let an assurance role repair implementation, authorize a lifecycle reset, create a second review stage, or imply shipping.

## Context / problem

Independent proof is necessary, but proof after every small task can cost more than the feedback it provides and can turn ceremony into the convergence signal. The opposite extreme—waiting until the end while combining unverified isolated lineages—allows defects and identity drift into fan-in. Revisions create a loophole if each verifier or reviewer blocker can restart an unlimited repair/reproof/review cycle. The workflow therefore needs cheap local feedback at each effect, fresh independent evidence at consumable boundaries, one final whole-scope standards/specification review, and a run-wide stop condition that survives derivative revision changes. Simplicity concerns must fit that one final review rather than create duplicate assurance or replace correctness.

## Decisions

### D03 — Post-assurance repair

- **Scope:** Blocker aggregation, semantic attempts, transport retries, the same-outcome repair allowance, impacted reruns, and terminal convergence.
- **Decision:** Collect every exact blocking verification criterion and review finding ID in one assurance pass, then allow the implementation owner one consolidated derivative post-assurance repair revision for the same approved outcome. After that repair, rerun only impacted proof plus preserved-behavior coverage and one final review rerun. A remaining blocker, repeated frontier, unchanged hypothesis, exhausted attempt budget, or no progress returns an exact blocker/escalation Handoff and does not restart planning, diagnosis, verification, review, or the lifecycle. Preserve the maximum of three semantic attempts per unchanged Task Contract revision and two safe transport retries. The one post-assurance repair allowance is inherited across derivative revisions for the same outcome, so a revision change cannot reset the assurance tail. A semantic pass must implement or prove a named criterion, remove a named blocker, change authority or route facts through new decision evidence, or terminate explicitly after consuming its authorized budget.
- **Why:** A stable run-wide bound lets one complete blocker set receive one cohesive repair while preventing revision churn, review recursion, or activity from replacing acceptance.
- **Rejected alternatives / why not:** Unlimited repair/review recursion lets each new revision reset convergence. Two automatic post-assurance repairs or per-plan “generous” retry choices make the same-outcome bound unpredictable. A fourth semantic attempt or automatic lifecycle reset treats unchanged evidence as progress. Advisories cannot reopen implementation because only exact blocking criteria or findings justify consuming the one repair. Another evaluator, retry state machine, or review-owned ledger duplicates existing assurance and backend owners.
- **Consequences:** Blocking evidence is consolidated before repair. Derivative revisions retain attempt, blocker, and repair-consumption history. No-progress output, repeated evidence, another audit, elapsed time, review count, or agent activity cannot authorize continuation. A remaining blocker after impacted reproof/review stops with exact authority and receiver; completion is not claimed.
- **Reopen when:** Blocker aggregation, semantic-attempt or transport-retry ceilings, repair count, inheritance across derivative revisions, impacted-rerun policy, or terminal no-progress conditions change.

### D04 — Assurance boundaries

- **Scope:** Worker smoke, independent lineage and final verification, neutral fan-in, final whole-scope review, diagnosis entry, and assurance-role neutrality.
- **Decision:** Smoke every implementation task by exercising the changed path or smallest applicable scenario before Handoff; smoke is local evidence, not independent verification. Use fresh read-only verification at every consumable isolated lineage before fan-in, at the final integrated target after neutral fan-in, and at the final single-lineage target; explicit high-consequence checkpoints may add independent proof. Fan in multiple isolated lineages only after each exact lineage is independently verified, consume every named input without semantic winner selection, verify the combined target, and skip integration for one lineage. Review the exact independently verified final target once with a separate read-only Standards and Specification reviewer; advisories become residual risk and only blockers can authorize repair. Keep diagnosis narrow: one hard unexplained reproducible defect with settled expected behavior may yield a fix contract, blocker, or architecture finding, while routine and known-cause implementation, verification, or review defects repair directly under available authority. Verifiers, integrators, reviewers, curators, planners, and routers never repair implementation in place or choose product/architecture semantics.
- **Why:** Cheap local smoke catches immediate mistakes, while independent proof at consumable boundaries protects exact identities and localizes defects without paying full assurance cost after every microtask. One final whole-scope review preserves independent standards/specification judgment.
- **Rejected alternatives / why not:** Independent verification and review after every task, or continuous proof for each microtask regardless of risk, replaces cheap worker feedback with ceremony. Final-only proof with unverified isolated fan-in inputs combines untrusted identities and obscures failures. A migration-specific implementer-plus-two-reviewers-plus-fixer topology is not universal policy. Assurance roles repairing in place destroy independent evidence. Routine failures entering diagnosis or repeated diagnosis under an unchanged hypothesis add a process loop. Fan-in for one lineage, semantic conflict resolution, or dropping a named input violates neutral integration. Weakening identity, compatibility, degraded behavior, residual-risk disclosure, or shipping boundaries cannot be traded for shorter assurance.
- **Consequences:** Worker smoke stays immediate and independent proof stays fresh and read-only. Every fan-in input and the combined target have exact verified identities. One cohesive lineage avoids per-task independent proof and neutral integration overhead while still receiving final verification and review. Assurance profile remains immutable and independent of lifecycle depth and topology; contract changes synchronize active skills, rules, `WORKFLOW.md`, and active ADRs atomically or fail closed.
- **Reopen when:** Smoke placement, independent lineage/final/high-consequence boundaries, fan-in prerequisites or neutrality, final review count or scope, diagnosis entry, role neutrality, immutable identity, or assurance independence changes.

### D22 — Complexity lens inside the final review

- **Scope:** `dev-code-review` Standards and Review Handoff
- **Decision:** Keep one final `dev-code-review` pass and add `delete`, `reuse`, `stdlib`, `native`, `yagni`, and `shrink` tags under Standards. Findings keep stable IDs, exact paths, governing authority, evidence, and a concrete replacement. Existing blocker/advisory rules decide severity; advisories never reopen work. Carry results in the existing Review Handoff. Add no separate review skill or stage, second Handoff, net-line metric, or `Ship` wording.
- **Why:** This catches over-engineering without duplicating assurance or weakening correctness and Specification coverage.
- **Rejected alternatives / why not:** A standalone or complexity-only review violates the one-review invariant; net lines lack a repeatable method; `Ship` conflicts with separate delivery authority.
- **Consequences:** The final reviewer performs one whole-scope pass with a named simplicity lens; review, repair, Handoff, and delivery ownership remain unchanged.
- **Reopen when:** The one-final-review invariant, finding policy, or Common Handoff ownership changes.

## Affected contracts

- `.config/agents/skills/dev-implementation/SKILL.md` for smoke, boundary scheduling, progress, attempts, inherited repair budget, review accounting, and terminal stops.
- `.config/agents/skills/dev-diagnosing-bugs/SKILL.md` for hard-defect entry, known/routine near misses, same-defect bound, exact return, and one receiver.
- `.config/agents/skills/dev-verification/SKILL.md`, `.config/agents/skills/dev-integration/SKILL.md`, and `.config/agents/skills/dev-code-review/SKILL.md` for fresh boundary proof, neutral verified-only fan-in, one whole-scope final review with the D22 Standards lens, and aggregated blocker/finding returns.
- `.config/agents/skills/dev-handoff/SKILL.md` for exact target, criterion delta, route impact, inherited attempt/repair state, role-specific review evidence, next frontier, and one receiver.
- `.config/agents/skills/dev-ask/WORKFLOW.md` for concise current diagnosis, assurance, repair, stop, learning, and shipping boundaries.
- `.config/agents/skills/dev-ask/evals/evals.json` and its routine/hard diagnosis, shared/isolated boundary, verified-fan-in, one-repair, remaining-blocker, complexity-lens, and completion fixtures.

These current executable/documentation contracts and this ACTIVE ADR are synchronized under the approved plan authority. The ADR remains convergence authority rather than attempt, blocker, or review state.

## Evidence / source revisions

- Governing authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`, especially **Human-confirmed governing decisions** D03 and D04; **Bounded diagnosis, assurance, and repair**; **Fixed shared contracts**; **Target workflow invariants**; **Material approval boundary**; and T4/T6 task contracts. The plan authority declares `revision: null`; no unobserved commit revision is asserted here.
- D22 durable-write authority: `local://dev-workflow-routing-simplicity-decisions.md`, SHA-256 `ef2ac3ddd04239e1c055f25439d81f58f8ec503777c4fa691a3443abe83823be`, explicitly confirmed by the user.
- D22 research evidence: official [`DietrichGebert/ponytail` commit `2ed6c52c9d7e5e56942508591085fd45dea277d3`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3), especially pinned [`skills/ponytail-review/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/skills/ponytail-review/SKILL.md); only its named complexity lens is consumed, inside the existing whole-scope final review and local finding policy.
- Cursor, [Agent swarms and the new model economics](https://cursor.com/blog/agent-swarm-model-economics), accessed 2026-08-09: neutral conflict handling and held-out outcome grading inform boundaries; unlimited stacked reviews do not.
- Anthropic, [How Anthropic runs large-scale code migrations with Claude Code](https://claude.com/blog/ai-code-migration) and [code-migration kit](https://github.com/anthropics/code-migration-kit-with-claude-code), accessed 2026-08-09: cheap smoke before expensive parity and recurring-failure feedback inform ordering; its six-step migration pipeline and implementer-plus-two-reviewers-plus-fixer topology are not generic policy.
- Flexcompute, [The Agent Control Loop—Engineering for Tolerance](https://engineering.flexcompute.com/articles/agent-control-loop/), published 2026-01-19: measurable constraints, blast radius, and verification as termination inform the contract; continuous per-microtask independent proof is limited by feedback cost and risk.
- Atlas references named by the governing plan are advisory evidence only and do not authorize assurance or repair.
- Executable lineage revisions: completed T4 Common Handoff `agent://BoundedConvergence`, consuming T2 `agent://WorkflowRouting` and T3 `agent://ExecutorOrchestration`; T5 documentation/fixture synchronization under `AUTH-PLAN`.

## Human authority

The human-confirmed D01-D09 choices and derived D10-D15 invariants in the T1-authorized plan, plus the exact confirmed D22 evidence artifact above, are the authority for this record. The parent execution dispatch authorizes only this D03/D04/D22 materialization. It does not authorize executable assurance or review changes, a second repair or review stage, weaker independence, topology escalation, product/architecture decisions, destructive effects, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship. Mechanical fixture wording does not supersede any decision.

## Verification expectations

- **AC09:** Routine and known-cause defects bypass diagnosis; one hard unexplained defect produces one fix contract, blocker, or architecture finding and cannot repeat unchanged.
- **AC10:** Every task has worker smoke; independent verification appears at each declared isolated-lineage/final/high-consequence boundary; integration consumes all and only exact verified lineages; the final target receives one whole-scope review.
- **AC11:** One pass aggregates blocking criterion/finding IDs, one consolidated repair revision is allowed, impacted proof and final review rerun once, and a remaining blocker stops without a second repair or lifecycle restart.
- Attempt fixtures must preserve the three-semantic-attempt ceiling per unchanged Task Contract, two safe transport retries, inherited same-outcome repair state, and rejection of no-progress continuation.
- Identity and role fixtures must prove verifier/integrator/reviewer neutrality, fresh target evidence, advisory residual-risk behavior, the D22 lens inside rather than beside the final review, and no implicit shipping effect.
- A future executable revision must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
