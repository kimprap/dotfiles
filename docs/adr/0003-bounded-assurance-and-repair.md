# Bounded assurance and repair

**Status:** ACTIVE  
**Date:** 2026-08-09  
**Updated:** 2026-09-11  
**Decision IDs:** D03, D04, D22, D28

## Scope

This record governs semantic attempts, direct checks, compact and noncompact assurance, one-shot code review, verifier-owned closure, neutral fan-in, common proof selection, and permanent-test value including the explicit manual audit. It applies to the existing concrete-check authors, `dev-implementation`, `dev-code-review`, `dev-verification`, `dev-integration`, `dev-test-audit`, `dev-tdd`, `dev-handoff`, and their focused evals. Assurance and audit roles remain read-only and gain no mutation, delivery, or shipping authority.

## Context / problem

Implementation smoke, independent review, and independent verification find different classes of defects. Repeating broad reviews or allowing unbounded repair makes activity rather than evidence the convergence signal. Permanent tests likewise add lasting cost when they protect no unique observable behavior. The workflow needs one bounded implementation correction opportunity, a fixed final check set, one owner for test-value policy, and exact terminal stops.

## Decisions

### D03 — Two semantic attempts

- **Decision:** A semantic attempt is a product- or code-changing pass. Attempt 1 includes implementation, the explicit same-child code-then-test rethink, at most one correction, direct checks, and a lean Handoff.
- **Decision:** Attempt 2 is the only later code-changing repair. It may close required review findings before verification or one directly evidenced verifier code defect when still unused. It follows the same candidate, rethink, optional correction, impacted checks, Handoff, and papercut sequence.
- **Decision:** A proof, tool, or transport correction that changes no product or code bytes consumes no semantic attempt. After a concrete runner, transport, environment, or capture defect is corrected without target mutation, the same verifier may retry only the affected check while required behavior, check meaning, and expected result stay unchanged. An unchanged repeated failure stops; changed acceptance meaning returns to authority. Undeclared mutation, failed child transport, exhausted attempt 2, or unresolved code failure after attempt 2 also stops with completed independent work preserved.
- **Why:** Two semantic passes permit one evidence-driven repair while keeping convergence finite.
- **Rejected alternatives:** A separate repair grant, continuation state, elapsed-time retry, another opinion, or attempt three duplicates control and makes progress unfalsifiable.
- **Consequences:** Review and verifier findings must identify an exact closure condition; the implementation parent never performs repair.
- **Reopen when:** Attempt count, eligibility, or terminal stop changes.

### D04 — Assurance boundaries

- **Decision:** Compact ends after attempt-1 rethink, direct smoke for every owned acceptance item, one lean Handoff, and papercut accounting. It dispatches no independent review, verifier, learning, integration, or audit unless topology or a compact disqualifier makes compact ineligible.
- **Decision:** Standard and high operate on the complete changed target in this order: one independent `dev-code-review`, one independent `dev-verification`, then one `dev-continual-learning` assessment. Review occurs once and never reruns after repair.
- **Decision:** Verification executes every original acceptance check in governing order followed by every required review closure check in finding order. It emits one fresh aggregate over the complete fixed set. A passing subset cannot verify the target.
- **Decision:** Within one fresh pass, an approved shared scenario can establish multiple exact observations on the same target under compatible conditions without repetition solely for each criterion. Execute at its first required occurrence and retain ordered per-item accounting. Command text alone does not establish equivalence; incompatible conditions remain separate. A prevented observation is unproved, not filled from another role's result; continue required checks when safe. Sharing never weakens complete unchanged same-verifier closure after code repair.
- **Decision:** If review repair consumed attempt 2, verification is final for code repair. If attempt 2 remains and verification directly proves a code defect, the responsible child may repair once; the same persistent verifier reruns the complete unchanged fixed check set. After a concrete non-code proof defect is corrected without target mutation, that verifier may instead retry only the affected check under unchanged acceptance meaning, without consuming an attempt. Review does not reopen and no second verifier substitutes for a lost original.
- **Decision:** Ordinary planned fan-in is an authored child-owned implementation task completed before the assembled target's one final review and verification. Standalone neutral `dev-integration` remains only for independently verified lineages, chooses no semantic winner, and is followed by verification of its new combined target. Manual permanent-test audit is separate explicit intake and never follows normal completion automatically.
- **Why:** Tests-first review provides one independent discovery pass; verifier-owned fixed checks provide terminal truth without review loops.
- **Rejected alternatives:** Review after verification, review reruns after repair, assurance roles repairing in place, and final-only proof of unverified isolated inputs weaken independence or add nondeterministic loops.
- **Consequences:** Standard/high order is review → verification → learning. Compact remains lean, and unresolved failure after attempt 2 is terminal.
- **Reopen when:** Assurance order, compact eligibility, verifier closure, or fan-in neutrality changes.

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
- **Decision:** Keep a permanent test only when it protects an uncovered observable contract, regression, or invariant. Reuse or extend the closest existing test file before creating another; test at the lowest level that captures the behavior; keep tests deterministic and isolated.
- **Decision:** Prefer a stable public seam, an oracle independent from production logic, and a named plausible bug that fails while correct behavior passes. Merge or remove duplicate, subsumed, tautological, incidental-snapshot, implementation-detail, coverage-only, or production-logic-oracle cases when their unique value is absent.
- **Decision:** `.config/agents/skills/dev-implementation/references/test-value.md` is the sole repository policy owner. Runtime rethink, review, TDD, and audit references resolve through the installed skill root rather than copying it.
- **Decision:** `dev-test-audit` is explicit and read-only. Before its initial Route Overview approval, show the exact requested scope or entire permanent suite and the ordered list of every file; launch no auditor. After approval, persistent A accounts for every file, then receives test rethink only after its first return. If A has no findings after rethink, stop without B. Otherwise persistent B receives the same boundary and A's revised proposal, then receives rethink only after B's first return. Later turns exchange proposals only.
- **Decision:** Every audit proposal gives each file compact `reviewed` or `skipped: reason` accounting and a `keep | merge | remove | unknown` disposition. Detailed evidence, closest coverage, stable seam, independent oracle, plausible bug or concrete absence, uncertainty, and destination appear only for findings or unknown-value tests. Agreement accepts; stop on unchanged/repeated proposals, non-applicable revision, persistent blockage, lost reviewer during proposal exchange, or authority conflict.
- **Decision:** Accepted changes require one separately approved direct or planned mutation batch, adjustable only by the human. Original A performs one read-only closure after the batch and before normal final assurance. If original A is unavailable only for closure, omit and report closure unavailable, do not substitute or claim closure, and continue normal assurance without opening another batch.
- **Why:** Observable value, not test count or coverage, justifies permanent maintenance cost; A-first audit avoids a second opinion when rethink already settles the portfolio.
- **Rejected alternatives:** Automatic audits, audit-owned mutation, a fixed opinion cap, voting, a replacement auditor, and policy duplication create ceremony or weaken authority.
- **Consequences:** Unknown tests are preserved. Audit output never changes implementation, completion, attempt, or shipping state by itself.
- **Reopen when:** Test admission, sole policy ownership, audit scope, A/B sequencing, liveness stops, mutation authority, or original-A closure changes.

## Affected contracts

- `dev-implementation` and its `test-value.md` reference.
- `dev-code-review`, `dev-verification`, `dev-integration`, `dev-test-audit`, both persistent audit opinion wrappers, `dev-tdd`, and `dev-handoff`.
- `dev-ask`, its human maps, focused evals, and stale-contract scanner.

## Evidence / source revisions

- Current governing authority: `local://dev-workflow-streamlining-decision-evidence.md`, revision `dev-workflow-streamlining/v3.1`, and `local://lean-dev-workflow-spec.md`, revision `lean-dev-workflow-spec/v1`.
- Confirmed `verification-proof-design/v1` and separately approved `verification-policy-implementation/v1`, 2026-09-11, extend the existing shared policy and execution accounting while preserving independent assurance and bounded repair.
- The append-only prompt-bundle maintenance journal records source treatments as provenance; executable rethink and test-value files own behavior.
- Earlier assurance and test-value records remain historical support only where consistent with this revision.

## Human authority

The human-approved lean workflow authorizes the two-attempt, one-review, verifier-closure, and A-first audit decisions. It authorizes no audit mutation, scope expansion, delivery, shipping, or changes to Reconcile.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes it and updates the index. D22 now owns a single discovery pass without post-repair review.

## Verification expectations

- Attempt cases prove one implementation/rethink attempt and at most one later code repair, with no extra semantic pass.
- Review cases prove tests-first axes, complete changed-file accounting, three verdicts, material required findings, exact closure grammar, one clarification, and no rerun.
- Verification cases prove all original and review closure checks execute, the same verifier owns eligible repaired-delta closure, and a concrete non-code defect permits only affected-check recovery under unchanged acceptance before repeat-failure or authority-change stops.
- Focused authoring exercises preserve every required outcome, combine compatible proof, separate necessary runtime outcomes, and justify expensive additions without a required reduction percentage. Verifier exercises distinguish fresh shared observations from missing, contradicted, incompatible, or other-role evidence.
- Audit cases prove pre-approval scope/list display with no A launch, compact file accounting, A early success without B, conditional persistent B, first-return-only rethink, proposal-only later turns, proposal-loop stops, one approved batch, and original-A closure or unavailable closure followed by normal assurance.
