# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-10-02  
**Decision IDs:** D03, D04, D22, D28

## Scope

This record governs semantic attempts, portable execution recovery, direct checks, compact and noncompact assurance, one-shot code review, verifier-owned closure, ordinary planned fan-in, common proof selection, and permanent-test value including the explicit manual audit. It applies to the existing concrete-check authors, `dev-implementation`, `dev-code-review`, `dev-verification`, `dev-test-audit`, `dev-handoff`, and their focused evals. Assurance and audit roles remain read-only toward evaluated targets and gain no semantic mutation, delivery, or shipping authority.

## Context / problem

Implementation smoke, independent review, and independent verification find different classes of defects. Repeating broad reviews or allowing unbounded semantic repair makes activity rather than evidence the convergence signal, while an unconditional stop after the first corrected execution can discard new decisive recovery evidence. Permanent tests likewise add lasting cost when they protect no unique observable behavior. The workflow needs one bounded semantic correction opportunity, evidence-bounded execution recovery, a fixed final check set, one owner for test-value policy, and exact terminal stops.

## Decisions

### D03 — Two semantic attempts

- **Decision:** A semantic attempt changes the evaluated implementation or deliverable. Attempt 1 includes implementation, the explicit same-child code-then-test rethink, at most one correction, direct checks, and a lean Handoff.
- **Decision:** Attempt 2 is the only later code-changing repair. It may close required review findings before verification or one directly evidenced verifier code defect when still unused. It resumes the same responsible child without another task job, admits one schema-valid repair candidate through the host return adapter, then follows the same-child rethink, optional correction, impacted checks, Handoff, and papercut sequence.
- **Decision:** Portable execution recovery restores an already approved operation without changing the deliverable, required behavior, acceptance, required evidence, ownership, evaluated target, or authorized effects. A concrete machinery failure is assessed by the current owner before an execution-related blocker is escalated. Role, not location, code-free form, or change size, distinguishes execution recovery from semantic repair.
- **Decision:** Recovery is limited per concrete cause, with no workflow-wide numeric ceiling; every explicit total execution, spending, duration, effect, and custom-protocol cap remains binding. Each eligible retry first receives one same-owner recovery rethink, separate from the implementation rethink, that adds no independent review, semantic attempt, or assurance stage. Exhausted semantic repair prohibits another deliverable change, not otherwise eligible machinery recovery.
- **Decision:** Required execution and assurance owners are never replaced by disposable resources. Recovery never reconstructs authority or provenance, pretends to resume a disposed actor, or resets allowances through a fresh resource.
- **Decision:** Custom controllers inherit no generic recovery automatically. Adoption must be explicit before the affected operation and never overrides the custom protocol's required actors, evidence admission, correction and return budgets, terminal decisions, or cleanup.
- **Decision:** `.config/agents/skills/dev-implementation/references/execution-recovery.md` alone owns recovery eligibility, per-cause and transient limits, evidence preservation, adoption forms, continuation, and stops.
- **Why:** Two semantic passes permit one evidence-driven implementation repair, while pre-escalation assessment and stable per-cause corrected limits restore already-approved execution without discarding eligible continuation or weakening required ownership and custom protocols.
- **Rejected alternatives:** A shared workflow-wide corrected-retry ceiling can be exhausted by unrelated causes; waiting for a retry proposal or treating every blocked return, transport failure, disposed resource, or exhausted semantic attempt as terminal discards existing authority. Dynamically increasing counts, blind or unchanged unbounded retries, category or resource resets, a retry ledger, replacement required owners, generic protocol override, an independent reviewer for every retry, a separate repair grant, or attempt three duplicate control or make progress unfalsifiable.
- **Consequences:** Review and verifier findings must identify an exact closure condition; the implementation parent never performs repair. Handoff validation returns an unresolved recovery-eligibility question to the responsible owner rather than accepting a premature blocker. A sequence of genuinely distinct eligible causes has no guaranteed finite total duration or cost, and same-owner recovery rethink provides no independent assurance.
- **Reopen when:** Semantic-attempt count, recovery activation or eligibility, resource identity, recurrence, transient fallback, explicit-cap handling, custom-protocol adoption, rethink ownership, or terminal stops change.

### D04 — Assurance boundaries

- **Decision:** Compact ends after attempt-1 rethink, direct smoke for every owned acceptance item, one lean Handoff, and papercut accounting. It dispatches no independent review, verifier, learning, integration, or audit unless topology or a compact disqualifier makes compact ineligible.
- **Decision:** Standard and high operate on the complete changed target in this order: one independent `dev-code-review`, one independent `dev-verification`, then one `dev-continual-learning` assessment. Review occurs once and never reruns after repair.
- **Decision:** Verification executes every original acceptance check in governing order followed by every required review closure check in finding order. It emits one fresh aggregate over the complete fixed set. A passing subset cannot verify the target.
- **Decision:** Within one fresh pass, an approved shared scenario can establish multiple exact observations on the same target under compatible conditions without repetition solely for each criterion. Execute at its first required occurrence and retain ordered per-item accounting. Command text alone does not establish equivalence; incompatible conditions remain separate. A prevented observation is unproved, not filled from another role's result; continue required checks when safe. Sharing never weakens complete unchanged same-verifier closure after code repair.
- **Decision:** If review repair consumed attempt 2, verification is final for semantic repair. If attempt 2 remains and verification directly proves a code defect, the responsible child may repair once; the same persistent verifier reruns the complete unchanged fixed check set. Verifier machinery failures follow D03 recovery without consuming a semantic attempt; the verifier stays read-only toward the evaluated target and corrects only permitted task-local machinery. Loss of the required verifier, an explicit exhausted cap, or another shared-policy stop remains terminal; no second verifier or parent repair substitutes. Semantic repair still requires the complete unchanged fixed set, and review does not reopen.
- **Decision:** Ordinary planned fan-in is an authored child-owned implementation task completed before the assembled target's one final review and verification. No standalone integration stage exists; combining separately produced work is likewise an authored child-owned implementation task. Manual permanent-test audit is separate explicit intake and never follows normal completion automatically.
- **Why:** Tests-first review provides one independent discovery pass; verifier-owned fixed checks provide terminal truth without review loops.
- **Rejected alternatives:** Review after verification, review reruns after repair, assurance roles repairing in place, and final-only proof of unverified isolated inputs weaken independence or add nondeterministic loops.
- **Consequences:** Standard/high order is review → verification → learning. Compact remains lean. Exhausted attempt 2 is terminal for further deliverable repair while eligible machinery correction remains governed by its separate existing allowance.
- **Reopen when:** Assurance order, compact eligibility, verifier closure, semantic-versus-machinery finality, or fan-in ownership changes.

### D22 — Tests-first one-shot review

- **Decision:** `dev-code-review` reads the installed code and test rethink cores, then inspects every changed file once in this fixed order: changed tests; contract and correctness; changed-test value; readability, ownership, reuse, and architecture; security and performance when relevant.
- **Decision:** Account for every changed or deleted file. Use exactly `APPROVED`, `REPAIR REQUIRED`, or `INCONCLUSIVE`. A required finding needs direct evidence of observable or invariant failure, security/privacy/data-loss risk, governing scope or rule violation, or a changed permanent test that creates material false confidence.
- **Decision:** Every required finding identifies its location, violated authority, direct evidence, smallest safe correction, and closure check in the exact grammar:

  ```text
  Behavior: <observable closure condition>
  Check: <command or direct static proof>; expect <exact result>
  ```

- **Decision:** Required closure-check selection consumes the common proof-selection policy in `dev-implementation/references/test-value.md`, retaining each finding's exact closure observation and material marginal rationale. Selection neither broadens the finding boundary nor executes acceptance or changes original checks.
- **Decision:** One clarification may fill missing fields or evidence from already completed discovery. It cannot add findings, inspect a new target, or restart review. A repaired target goes directly to verification.
- **Why:** One complete, material, evidence-backed discovery pass is useful; repeated discovery is nondeterministic and can continuously invent work.
- **Rejected alternatives:** Mandatory praise, nits, numeric limits, speculative blockers, taste-only architecture, and repeated review do not establish a required defect.
- **Consequences:** Advisories do not consume attempt 2. Review never runs closure checks or claims verifier authority.
- **Reopen when:** Review order, materiality, verdicts, clarification, or closure-check ownership changes.

### D28 — Proof selection and permanent test portfolio value

- **Decision:** The existing `dev-implementation/references/test-value.md` owns selection for permanent tests, temporary smoke checks, native end-to-end scenarios, and model-driven evaluations. Select distinct outcomes, meaningful boundaries, and failure mechanisms with representative inputs and the cheapest adequate behavioral evidence. Static facts and simulated answers cannot substitute for required live behavior.
- **Decision:** Combine compatible observations while preserving every exact result; separate contradictory outcomes, independent starting conditions, and necessary isolation. Each additional expensive scenario briefly explains its otherwise-unproved behavior and why existing or cheaper proof is inadequate, including setup, nested work, generation/grading, and independent repetition. Keep rationale in existing prose, not a count cap, quota, ledger, or new stage.
- **Decision:** Apply selection before acceptance binds in specification, self-contained plan, and direct-contract authoring. Later meaning changes return to authority. Common principles do not impose permanent-only admission, placement, retention, determinism, isolation, or disposition requirements on disposable proof, initiate unrelated audits, or add checks to unrelated read-only answers.
- **Decision:** Tests listed in a proposal or other pre-plan decision are coverage intent, not required permanent tests, unless the human explicitly required a specific permanent test; the specification, plan, or direct-contract author selects the checks, and implementation settles permanent placement under the permanent-only criteria.
- **Decision:** Keep a permanent test only when it protects an uncovered observable contract, regression, or invariant. Reuse or extend the closest existing test file before creating another; test at the lowest level that captures the behavior; keep tests deterministic and isolated.
- **Decision:** Prefer a stable public seam, an oracle independent from production logic, and a named plausible bug that fails while correct behavior passes. Merge or remove duplicate, subsumed, tautological, incidental-snapshot, implementation-detail, coverage-only, or production-logic-oracle cases when their unique value is absent.
- **Decision:** `.config/agents/skills/dev-implementation/references/test-value.md` is the sole repository policy owner. Runtime rethink, review, and audit references resolve through the installed skill root rather than copying it.
- **Decision:** `dev-test-audit` is explicit and read-only. Before its initial Route Overview approval, show the exact requested scope or entire permanent suite and the ordered list of every file; launch no auditor. After approval, persistent A goes first; persistent B starts only if findings remain after A's rethink. Each auditor receives test rethink once, only after its first return; later turns exchange proposals only.
- **Decision:** The audit ends on agreement or one named liveness stop. `.config/agents/skills/dev-test-audit/references/audit-protocol.md` owns turn order and agreement; `.config/agents/skills/dev-test-audit/references/opinion-agent.md` owns proposal rows, file accounting, and stop results.
- **Decision:** Accepted changes require one separately approved direct or planned mutation batch, adjustable only by the human. Original A performs one read-only closure after the batch and before normal final assurance. If original A is unavailable only for closure, omit and report closure unavailable, do not substitute or claim closure, and continue normal assurance without opening another batch.
- **Why:** Observable value, not test count or coverage, justifies permanent maintenance cost; A-first audit avoids a second opinion when rethink already settles the portfolio.
- **Rejected alternatives:** Automatic audits, audit-owned mutation, a fixed opinion cap, voting, a replacement auditor, and policy duplication create ceremony or weaken authority.
- **Consequences:** Unknown tests are preserved. Audit output never changes implementation, completion, attempt, or shipping state by itself.
- **Reopen when:** Test admission, sole policy ownership, audit scope, A/B sequencing, liveness stops, mutation authority, or original-A closure changes.

## Affected contracts

- `dev-implementation` and its `test-value.md` reference.
- `dev-code-review`, `dev-verification`, `dev-test-audit` with `.config/agents/skills/dev-test-audit/references/audit-protocol.md`, `.config/agents/skills/dev-test-audit/references/opinion-agent.md` and its host wrappers, and `dev-handoff`.
- `dev-ask`, its human map, and focused evals.

## Evidence / source revisions

- Approved by the owner on 2026-09-04, 2026-09-06, 2026-09-11, 2026-09-13 and 2026-10-02; history in git.
- The append-only prompt-bundle maintenance journal records source treatments as provenance; executable rethink and test-value files own behavior.

## Human authority

The human-approved lean workflow authorizes the two-attempt, one-review, verifier-closure, and A-first audit decisions. It authorizes no audit mutation, scope expansion, delivery, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D22 now owns a single discovery pass without post-repair review.

## Verification expectations

- Attempt cases prove one implementation/rethink attempt and at most one later code repair, with no extra semantic pass.
- Review cases prove tests-first axes, complete changed-file accounting, three verdicts, material required findings, exact closure grammar, one clarification, and no rerun.
- Verification cases prove all original and review closure checks execute, the same verifier owns eligible repaired-delta closure, and a concrete non-code defect permits only affected-check recovery under unchanged acceptance before repeat-failure or authority-change stops.
- Focused authoring exercises preserve every required outcome, combine compatible proof, separate necessary runtime outcomes, and justify expensive additions without a required reduction percentage. Verifier exercises distinguish fresh shared observations from missing, contradicted, incompatible, or other-role evidence.
- Audit cases prove pre-approval scope/list display with no A launch, compact file accounting, A early success without B, conditional persistent B, first-return-only rethink, proposal-only later turns, proposal-loop stops, one approved batch, and original-A closure or unavailable closure followed by normal assurance.
