# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-15  
**Decision IDs:** D03, D04, D22

## Scope

This decision governs worker smoke, independent verification boundaries, neutral fan-in, final review, diagnosis entry, blocker aggregation, semantic attempts, the single post-assurance repair allowance, and the final review's complexity lens for the generic engineering workflow. It applies to `dev-implementation`, `dev-diagnosing-bugs`, `dev-verification`, `dev-integration`, `dev-code-review`, `dev-handoff`, and their targeted fixtures. It does not let an assurance role repair implementation, authorize a lifecycle reset, create a second review stage, or imply shipping.

## Context / problem

Independent proof is necessary, but proof after every small task can cost more than the feedback it provides and can turn ceremony into the convergence signal. The opposite extreme—waiting until the end while combining unverified isolated lineages—allows defects and identity drift into fan-in. Revisions create a loophole if each verifier or reviewer blocker can restart an unlimited repair/reproof/review cycle. The workflow therefore needs cheap local feedback at each effect, fresh independent evidence at consumable boundaries, one final whole-scope standards/specification review, and a run-wide stop condition that survives derivative revision changes. Simplicity concerns must fit that one final review rather than create duplicate assurance or replace correctness.

## Decisions

### D03 — Post-assurance repair

- **Scope:** Blocker aggregation, semantic attempts, transport retries, the same-outcome repair allowance, impacted reruns, and terminal convergence.
- **Decision:** Allow one initial semantic attempt and at most one retry for every unchanged Task Contract revision, including high-consequence work and the repair Task Contract. Attempt 2 is eligible only from attempt-1 evidence of criterion progress, exact blocker resolution, or an authorized materially changed falsifiable hypothesis. A `blocker-resolved` return is consumable only when the Task Contract and Common Handoff map each stable blocker or finding ID to its affected `AC-...`, exact target/caller/failure path, impacted proof recipe, expected result, and observed result on the repaired identity. A universal changed invariant additionally binds a finite current consumer/callsite map and proves every entry. Generic passing suites, changed fixtures, prose assertions, and unchanged-hypothesis retries are not closure. Attempt 3 on the same outcome revision is forbidden, and derivative revisions inherit consumed attempts. Preserve two safe idempotent transport retries. Collect every exact blocking verification criterion and eligible review finding ID in one assurance pass, then allow one consolidated derivative post-assurance repair revision for the same approved outcome. The run-wide repair token is inherited across derivative revisions and never restored by revision churn.
- **Why:** Two semantic attempts permit one evidence-backed correction while exact closure prevents activity, broad suites, or revision churn from standing in for the failing criterion or caller.
- **Rejected alternatives / why not:** A third semantic attempt, unchanged-hypothesis retry, generic green suite, or reset on derivative revision makes convergence depend on activity instead of closed evidence. Unlimited repair/review recursion lets each new revision reset the same outcome. Per-plan retry choices, a second repair, another evaluator, retry state machine, or review-owned ledger make the bound unpredictable or duplicate existing owners.
- **Consequences:** Every profile and every repair owner stops at 2/2. Blocking evidence is consolidated before the one repair; each claimed resolution is traceable to the repaired identity and every affected finite consumer. No-progress output, repeated evidence, another audit, elapsed time, review count, or agent activity cannot authorize continuation. A remaining blocker after impacted reproof or eligible review stops with exact authority and receiver; completion is not claimed.
- **Reopen when:** Blocker-closure fields, finite-consumer proof, semantic-attempt or transport-retry ceilings, repair count, inheritance across derivative revisions, impacted-rerun policy, or terminal no-progress conditions change.

### D04 — Assurance boundaries

- **Scope:** Worker smoke, profile-required independent lineage and final verification, neutral fan-in, final whole-scope review, diagnosis entry, and assurance-role neutrality.
- **Decision:** Smoke every implementation task by exercising the changed path or smallest applicable scenario before Handoff. For compact, map every owned acceptance criterion to one deterministic exact-target smoke scenario and require complete expected/observed evidence; criterion-complete worker smoke is terminal proof. Any criterion that requires an independent proof class disqualifies compact before completion. For standard and high-consequence, use fresh read-only verification at every consumable isolated lineage before fan-in, at the final integrated target after neutral fan-in, at the final single-lineage target, and at explicit approved high-consequence checkpoints. A universal changed invariant cannot reach `VERIFIED` until a finite current consumer/callsite map is bound and every entry is proved. Fan in multiple isolated lineages only after each exact lineage is independently verified, consume every named input without semantic winner selection, verify the combined target, and skip integration for one lineage. Run a separate final Standards and Specification review only when the selected assurance profile requires review. Keep diagnosis narrow: one hard unexplained reproducible defect with settled expected behavior may yield a fix contract, blocker, or architecture finding, while routine and known-cause implementation, verification, or review defects repair directly under available authority. Assurance roles never repair implementation in place or choose product/architecture semantics.
- **Why:** Criterion-complete smoke directly proves bounded deterministic compact work. Fresh independent proof remains necessary where consequence, topology, or proof class disqualifies compact, and complete finite-consumer evidence prevents universal claims from hiding an unproved caller.
- **Rejected alternatives / why not:** Independent verification and review after every eligible compact task replace direct worker proof with ceremony. Final-only proof with unverified isolated fan-in inputs combines untrusted identities. A generic passing suite cannot prove every consumer of a changed invariant. Assurance roles repairing in place destroy independent evidence. Routine failures entering diagnosis or repeated diagnosis under an unchanged hypothesis add a process loop.
- **Consequences:** Compact completes after exact criterion smoke with no verification or review dispatch. Noncompact worker smoke stays immediate while required independent proof remains fresh and read-only. Every fan-in input and combined target has an exact verified identity, and every universal changed invariant has complete finite-consumer proof. Assurance profile remains immutable and independent of lifecycle depth and topology.
- **Reopen when:** Compact terminal proof, disqualifiers, finite-consumer proof, independent lineage/final/high-consequence boundaries, fan-in prerequisites or neutrality, final review applicability, diagnosis entry, role neutrality, immutable identity, or assurance independence changes.

### D22 — Complexity lens inside the final review

- **Scope:** `dev-code-review` Standards and Review Handoff when the selected assurance profile requires review.
- **Decision:** Keep one final `dev-code-review` pass for standard and high-consequence work and retain the `delete`, `reuse`, `stdlib`, `native`, `yagni`, and `shrink` Standards tags. A same-outcome blocking finding must cite an exact governing authority or `AC-...`, a changed surface or existing consumer required to migrate by the changed contract, and direct behavioral or static evidence. No-effect proof compares the declared causal pre/post boundary and included targets; later changes to explicitly excluded mutable files do not invalidate it. Unrelated pre-existing defects, unrelated dirty bytes, mutable sidecar drift, and unsupported suspicion are advisory or deferred. An independently serious safety issue returns a separate authority stop or intake and never silently enters the same repair set. Carry results in the existing Review Handoff; add no review stage, second Handoff, metric, or shipping wording.
- **Why:** Outcome relevance preserves one credible whole-scope review without letting unrelated state reopen implementation. Causal no-effect boundaries make exclusion evidence stable and falsifiable.
- **Rejected alternatives / why not:** Reviewing compact after criterion-complete smoke adds a disallowed assurance tail. A standalone or complexity-only review violates the one-review invariant. Treating every observed defect or mutable-file drift as a same-outcome blocker silently expands authority. Net lines lack a repeatable method; `Ship` conflicts with separate delivery authority.
- **Consequences:** Profile-required review performs one whole-scope pass with a named simplicity lens. Only authority-bound, changed-surface-or-required-consumer findings with direct evidence enter the repair set; advisories and separate safety intake cannot consume it.
- **Reopen when:** Review applicability, finding relevance, causal no-effect boundaries, the one-final-review invariant, finding policy, or Common Handoff ownership changes.

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
- **AC10:** Every task has worker smoke. Compact maps every owned criterion to criterion-complete deterministic exact-target smoke and dispatches no independent verification or review. Standard and high-consequence use fresh independent verification at each declared isolated-lineage, integrated, final single-lineage, or explicit high-consequence boundary; integration consumes all and only exact verified lineages; the final verified target receives one whole-scope review.
- **AC11:** One pass aggregates blocking criterion/finding IDs and permits one consolidated repair revision. Compact repair reruns impacted and preserved-behavior smoke only. Standard and high-consequence repair reruns impacted smoke/proof and preserved-behavior coverage, then runs the first eligible review or the sole review rerun once; any remaining blocker stops without a second repair or lifecycle restart.
- Attempt fixtures must preserve the two-semantic-attempt ceiling per unchanged Task Contract, two safe transport retries, inherited same-outcome repair state, and rejection of no-progress continuation.
- Identity and role fixtures must prove verifier/reviewer neutrality only when those roles dispatch, integrator neutrality only when fan-in dispatches, fresh target evidence at each declared assurance boundary, advisory residual-risk behavior, the D22 lens inside rather than beside any dispatched final review, and no implicit shipping effect.
- A future executable revision must prove active skills/rules/`WORKFLOW.md` and active ADRs agree; conflicts fail closed.
