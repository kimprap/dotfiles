# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-08-28  
**Decision IDs:** D03, D04, D22, D28

## Scope

This decision governs semantic attempts, same-child worker closure, task smoke, independent verification, neutral fan-in, one final current-target review, the single post-assurance repair allowance, changed-hypothesis continuation, and permanent-test value for the generic engineering workflow. It applies to `dev-implementation`, `dev-verification`, `dev-integration`, `dev-code-review`, `dev-handoff`, `dev-tdd`, `dev-test-audit`, and their targeted fixtures. It does not let an assurance or audit role repair implementation, authorize mutation, reset a lifecycle, create another review stage, or imply shipping.

## Context / problem

Immediate worker smoke and bounded independent assurance catch different failures. Unlimited retries, repeated broad reviews, or continuation from unchanged evidence make activity rather than proof the convergence signal. Permanent tests can likewise become durable ceremony when they protect no unique observable behavior. The workflow needs finite attempts, exact causal repair, fresh proof at consequence and fan-in boundaries, one final review, explicit human authority for a materially new continuation hypothesis, and one shared value rule for permanent tests.

## Decisions

### D03 — Post-assurance repair

- **Scope:** Planned work attempts, transport retries, blocking verification/review findings, same-outcome Build repair, exhausted tasks, continuation authority, and terminal convergence.
- **Decision:** Each unchanged planned-work Task Contract receives attempt one and at most one eligible fresh-child attempt two. Attempt two requires direct evidence of criterion progress, exact blocker resolution, or a materially changed falsifiable hypothesis already authorized within the unchanged contract and target boundary. No third ordinary attempt exists.
- **Decision:** The run owns one post-assurance repair token. One blocking verifier or reviewer Handoff may consume it for a topologically ordered Build-repair cycle over only the original causally implicated task IDs. Each repair uses a fresh child, the unchanged Task Contract, `worker-closure/v1`, exact impacted smoke, and one Common Handoff. A canonical-projection repair reruns its final projection owner last. The repaired target receives fresh impacted proof and one current-target review.
- **Decision:** Finding classification, finding lineage, and repair admission remain separate. After the first current-target review, same-outcome repair admits only incomplete closure of an existing lineage or a repair-caused lineage proved by the exact repaired revision, changed bytes or contract delta, an accepted impact-map edge, observable failure path, and fresh affected proof. Disjoint non-outcome observations are terminal advisories. Independently serious safety returns separate-authority intake. A disjoint outcome-relevant non-safety defect returns `authority-change-required`.
- **Decision:** Exhaustion leaves the plan `IN_PROGRESS` with one blocker Common Handoff and exact remaining frontier. Bare continue, elapsed time, another opinion, repeated evidence, or an unchanged hypothesis changes no state. Only explicit human authorization naming the active plan and a materially changed falsifiable hypothesis creates one continuation receipt and a fresh attempt-one/two cycle. That receipt binds active plan and target identities, blocked task, remaining criteria, hypothesis, authorizer/time, cycle, and inherited repair-token state.
- **Why:** Two bounded work attempts plus one run-wide repair allow evidence-driven correction while preserving a finite stop. A continuation receipt records the only authority that can reopen the same task without creating a second recovery system.
- **Rejected alternatives / why not:** Attempt three, generic retry, elapsed-time retry, another opinion, derivative revision reset, automatic recursion, or a successor plan solely to regain budget makes progress unfalsifiable. Persisting a second recovery record duplicates the Common Handoff and active plan.
- **Consequences:** Every non-success preserves completed Handoffs and an exact remaining frontier. Continuation is auditable by one immutable receipt and never changes the Task Contract, target boundary, or inherited token state.
- **Reopen when:** Attempt ceilings, repair-token scope, lineage admission, continuation receipt fields, or terminal no-progress conditions change.

### D04 — Assurance boundaries

- **Scope:** Same-owner worker closure, task-local test settlement and smoke, independent lineage/final verification, neutral fan-in, final current-target review, learning, explicit portfolio audit, and role neutrality.
- **Decision:** Every semantic implementation owner runs `worker-closure/v1`, settles its changed permanent tests or no-new-contract basis, and exercises the changed path or smallest applicable scenario before its one Common Handoff. Compact maps every owned criterion to deterministic exact-target smoke; that criterion-complete smoke is terminal proof unless an independent proof class disqualifies compact.
- **Decision:** Standard and high-consequence work use fresh read-only verification at each consumable isolated lineage before fan-in, at the final integrated target after neutral fan-in, at the final single-lineage target, and at explicit high-consequence checkpoints. Neutral integration consumes every named verified lineage and chooses no semantic winner.
- **Decision:** Planless same-context work, plan-backed task children, eligible attempt-two children, and admitted Build-repair workers use same-owner `worker-closure/v1` before smoke. Verification, integration, review, learning, audit controllers, and audit opinions never use worker closure.
- **Decision:** The final backend boundary is fresh current-target `dev-verification`, one current-target `dev-code-review`, then terminal `dev-continual-learning`. An optional numbered profile suffix consumes those exact boundaries once; when omitted, the backend schedules them once. A repair produces fresh impacted proof and one review on the new target identity.
- **Decision:** Successful normal completion is terminal and schedules no audit. `dev-test-audit` starts only from an explicit user or external-scheduler request with an exact frozen target and complete repository or named-subsystem suite boundary; completed-plan provenance is optional. Its availability or result cannot delay assurance, change completion, consume repair, authorize mutation, or reopen lifecycle state.
- **Decision:** Bind every criterion to a canonical `surface-proof-recipe/v1` identity before readiness. Optional adapters remain proof machinery only; doctor receipts establish readiness and never satisfy smoke, proof, review, or completion.
- **Decision:** Before noncompact verifier dispatch, the backend natively resolves all current `file://`, `local://`, and `agent://` bindings, retains live adapter-tree validation, and validates the exact current acceptance set, canonical recipe wrappers, and flattened manifest as one generation. Invalid current intake dispatches no verifier or proof. Current and prior generations are never unioned.
- **Decision:** A reusable prior generation exists only as the exact frozen acceptance set, wrappers, manifest bindings, evidence, and identities named by the last complete aggregate. The backend byte-compares and validates that snapshot without I/O or live prior rereads. Missing or inexact prior state and ambiguous target-delta edges select complete current all-fresh proof.
- **Decision:** After both generations pass and D02 admits the current contract, the backend freezes `criterion → old recipe ID → new recipe ID → target-delta edge or none → fresh-or-reuse` for every frozen criterion. Only approved digest substitutions on URIs already listed by otherwise byte-equal old/new recipes are valid rebinds, and the rebound current recipe always runs fresh. Exact identity with no edge is reuse-eligible only with exact evidence and independent acceptance. Approved semantic change selects all-fresh; unapproved non-digest change returns `authority-change-required`.
- **Decision:** The verifier independently repeats current resolution, current and frozen-prior generation validation, and action-map consistency. Invalid dispatched intake is `INCONCLUSIVE` before proof without repair or silent downgrade. Every action receives an independent decision; rebound and rejected-reuse entries run fresh, exact accepted unaffected evidence may be reused, and one fresh aggregate covers the complete current criterion set. No recipe field, public command/result, store, cache, ledger, compatibility reader, or schema is added.
- **Why:** Same-owner challenge, test settlement, and smoke catch omissions near the work, while independent roles prove the immutable result. Keeping closure off assurance and audit roles and audit off normal completion preserves both independence and terminality.
- **Rejected alternatives / why not:** Independent proof after every compact task replaces direct evidence with ceremony. Final-only proof after unverified isolated work combines untrusted identities. Assurance roles repairing in place, automatic audit tails, or audit roles running worker closure destroy neutrality.
- **Consequences:** Compact remains lean; noncompact assurance is fresh and exact; normal completion terminates. Explicit portfolio audit stays observational, independently requested, and non-gating.
- **Reopen when:** Compact terminal proof, independent boundaries, closure role scope, fan-in neutrality, backend order, explicit audit separation, or recipe identity changes.

### D22 — Complexity lens inside the one final review

- **Scope:** `dev-code-review` Standards and Specification assessment, finding classification, original current-target discovery, one repair-impact rerun, and changed permanent-test materiality.
- **Decision:** Keep one final `dev-code-review` for standard and high-consequence work and retain the `delete`, `reuse`, `stdlib`, `native`, `yagni`, and `shrink` Standards tags. Direct behavioral or static evidence that an existing parent criterion, exact fixed contract, or observable changed-contract consumer is broken may block. A directly evidenced changed-test defect may block when it materially degrades the permanent suite. Structural preference without direct harm and non-material changed-test concerns are advisory.
- **Decision:** The first current-target review seals finding lineages. A post-repair review binds the prior receipt, remaining lineages, exact repair delta, accepted impact map, affected and unchanged surfaces, and finite consumers. It freshly reviews remaining lineages and impacted surfaces and reuses original evidence only for byte-, authority-, contract-, dependency-, and environment-identical unaffected surfaces. It is not a second broad discovery pass.
- **Decision:** The review consumes `test-value/v1` for every changed permanent test. It requires a unique observable contract or regression, a plausible bug, stable public seam, independent oracle, and evidence that existing coverage does not already subsume the case. Redundant, tautological, implementation-coupled, incidental-snapshot, or coverage-only tests are blockers only with direct material-suite-degradation evidence and otherwise advisories.
- **Decision:** A numbered review row consumes the one existing final review; when absent, the backend schedules the same review once. Never execute both forms.
- **Why:** One broad review preserves credible discovery. Bounded lineage closure prevents later review from silently expanding same-outcome authority, while the shared test-value policy distinguishes material suite harm from advisory quality concerns.
- **Rejected alternatives / why not:** Reviewing compact adds a forbidden tail. A standalone complexity review, repeated broad discovery, structural-preference blocker, or test-count/coverage proxy duplicates owners and obscures observable value.
- **Consequences:** Profile-required review applies one named simplicity and test-value lens, seals exact lineages, and returns one aggregate current-target verdict without repair.
- **Reopen when:** Review applicability, blocker/advisory classification, finding relevance, lineage identity, impact scope, test-value consumption, or the one-final-review invariant changes.

### D28 — Permanent test portfolio value

- **Scope:** Permanent tests changed by implementation or explicit TDD and tests assessed by review or read-only audit.
- **Decision:** Retain a permanent test only when it protects an uncovered observable contract, regression, or invariant. Name that value before authoring or keeping the test.
- **Decision:** Find the closest existing test and prove the new contract is not already covered. Extend or merge before adding another case. Use the narrowest stable public seam, an oracle independent from production logic, and name one plausible unique bug that fails while correct behavior passes.
- **Decision:** Reject or consolidate implementation-detail assertions, tautologies, duplicate or subsumed cases, incidental snapshots, coverage-only cases, and oracles that repeat the implementation. Keep the smallest permanent set preserving each unique contract. TDD tracer tests are merged or removed after red/green proof when redundant. Comparison and audit investigation artifacts are never permanent tests.
- **Decision:** Work Handoffs include one disposition row per changed permanent test—path selector, observable contract, plausible unique bug, public seam, independent oracle, keep/merge/remove disposition, and evidence—or a concrete existing-coverage/no-new-contract decision. Audit remains read-only and cannot authorize deletion; unsupported or unknown cases are preserved.
- **Why:** Permanent tests are durable product assets only when they independently protect behavior. Portfolio value, not raw count or coverage, justifies their maintenance cost.
- **Rejected alternatives / why not:** Coverage targets, snapshots without a contract, production-logic oracles, and duplicate cases reward quantity while missing realistic regressions.
- **Consequences:** Implementation, explicit TDD, review, and audit apply one policy identity, `test-value/v1`. Every changed test has an auditable value or disposition.
- **Reopen when:** Permanent-test admission, seam/oracle requirements, TDD consolidation, audit authority, or Handoff test rows change.

## Affected contracts

- `.config/agents/skills/dev-implementation/SKILL.md` and its `worker-closure.md`, `plan-orchestration.md`, and `test-value.md` references.
- `.config/agents/skills/dev-verification/SKILL.md`, `dev-integration/SKILL.md`, `dev-code-review/SKILL.md`, `dev-tdd/SKILL.md`, and `dev-test-audit/SKILL.md`.
- `.config/agents/skills/dev-handoff/SKILL.md` for attempt, closure, test-value, continuation, recovery, and receiver fields.
- `.config/agents/skills/dev-ask/SKILL.md`, `.config/agents/skills/dev-ask/WORKFLOW.md`, semantic fixtures, and stale-contract checks.

These executable and documentation contracts and this ACTIVE ADR are synchronized under approved plan authority. The ADR remains semantic authority rather than runtime state.

## Evidence / source revisions

- Original D03/D04 authority: `local://dev-workflow-convergence-refinement-plan.md`, Datetime `2026-08-09-1616`.
- D22 authority and named simplicity lens: `local://dev-workflow-routing-simplicity-decisions.md`, SHA-256 `ef2ac3ddd04239e1c055f25439d81f58f8ec503777c4fa691a3443abe83823be`.
- Current D03/D04/D22 revision and D28 authority: approved Executor Plan **Dev Workflow Orchestration and Test Value**, Datetime `2026-08-26-2157`, semantic SHA-256 `4a02b0473dfb1cd64baaacf12cbcc8ee91ed3bf5d8117b44acea0a9b4a68894f`.
- Candidate-local structural-review evidence: pinned [`cursor/plugins` commit `6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf`](https://github.com/cursor/plugins/commit/6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf), especially [`cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md`](https://github.com/cursor/plugins/blob/6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md). Evidence only for candidate-local structural smell checks; broad scans, aggressive rewrites, repeated review, provider policy, and executable source branding remain rejected.
- The plan's `test-value/v1` reference, worker-closure reference, semantic fixtures, and T4 `PROMOTE-SERIAL-DEFAULT` receipt provide executable projection evidence.

## Human authority

The human-confirmed original D03/D04/D22 decisions and the approved 2026-08-26 orchestration/test-value plan authorize this revision and D28. That authority removes the superseded multi-action exhaustion workflow and replaces it with the bounded continuation receipt above. It authorizes no product decision, test deletion from audit output, shipping, or external effect.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and the index links that relationship.

## Verification expectations

- Attempt fixtures prove exactly attempt one plus at most one eligible fresh-child attempt two, one run-wide repair token, no state change from bare continue or unchanged hypotheses, and one continuation receipt only after explicit materially changed-hypothesis authority.
- Closure fixtures prove mandatory same-child round one, conditional round two only after correction, no third round, task-local smoke, one Handoff, and no closure for assurance, learning, or audit roles.
- Assurance fixtures prove exact-target compact smoke, fresh noncompact proof, neutral verified-only fan-in, one final current-target review, fresh proof/review after repair, and audit non-coupling.
- Test-value fixtures prove unique regression value, closest-existing reuse, stable public seam, independent oracle, plausible bug, rejection/consolidation classes, TDD tracer consolidation, and unknown preservation in read-only audit.
- Active skills, rules, `WORKFLOW.md`, active ADRs, and the index must agree; conflicts fail closed.
