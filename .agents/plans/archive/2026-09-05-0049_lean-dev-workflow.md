# Lean dev-* workflow migration

**Datetime**: 2026-09-05-0049
**Scope**: Dev workflow planning, execution, assurance, test audit, papercut, learning, completion, and canonical projections
**Summary**: Replace proof-heavy workflow machinery with direct checks, two semantic attempts, same-worker rethink, one-shot review, final verification, and concise human output.
**Status**: DONE
**Completed At**: 2026-09-05-0311

## Outcome and authority

- Outcome: The installed dev-* workflow implements confirmed evidence revision `dev-workflow-streamlining/v3.1` with no active legacy proof, repair-token, review-rerun, or archive gate.
- Authority: Human-confirmed `local://dev-workflow-streamlining-decision-evidence.md` revision `dev-workflow-streamlining/v3.1`, derived `local://lean-dev-workflow-spec.md` revision `lean-dev-workflow-spec/v1`, and the human-approved 2026-09-05 Route Overview.
- Assurance: standard

## Scope and effects

- Scope: Shared implementation prompts; dev implementation, specification, ticketing, Handoff, TDD, review, verification, test audit, papercut, learning, completion, and routing skills; plan rules/validator/transport; human workflow material; required generic callers; active ADR projections and focused existing evals.
- Effects: Repository changes only inside the five task target sets; reversible before delivery; no staging, commit, push, network service, deployment, release, credential, or shipping effect.
- Non-goals: Reconcile behavior or files, unrelated product workflow behavior, `.config/agents/harnesses/omp/config.yml`, `.agents/plans/2026-09-01-0212_progressive-local-checkpoints.md`, new dependencies, model graders, ablation, or unrelated cleanup.

## Tasks

- [x] T1. Cut over core execution contracts
  completed 2026-09-05-0118
  - Owner: core-workflow-worker
  - Depends on: none
  - Targets: `.config/agents/references/impl-rethink/**`, `.config/agents/skills/dev-implementation/**`, `.config/agents/skills/dev-handoff/SKILL.md`, `.config/agents/skills/dev-specification/SKILL.md`, `.config/agents/skills/dev-ticketing/SKILL.md`, `.config/agents/skills/dev-tdd/SKILL.md`, `.config/agents/rules/plan.md`, `.config/agents/rules/plan-impl-spec.md`, remove `.config/agents/skills/surface-verification-adapter/**`, remove `.config/agents/skills/create-surface-verification-adapter/**`, remove `.config/agents/skills/maintain-surface-verification-adapter/**`
  - Acceptance: AC-1
  - Receiver: dev-implementation
- [x] T2. Replace assurance and audit loops
  completed 2026-09-05-0140
  - Owner: assurance-audit-worker
  - Depends on: T1
  - Targets: `.config/agents/skills/dev-code-review/**`, `.config/agents/skills/dev-verification/**`, `.config/agents/skills/dev-test-audit/**`, `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md`, `.config/agents/harnesses/omp/agents/test-audit-opinion-b.md`
  - Acceptance: AC-3, AC-4
  - Receiver: dev-implementation
- [x] T3. Simplify terminal hooks and output
  completed 2026-09-05-0258
  - Owner: terminal-workflow-worker
  - Depends on: T1
  - Targets: `.config/agents/skills/dev-ask/SKILL.md`, `.config/agents/skills/dev-continual-learning/**`, `.config/agents/skills/continual-learning/**`, `.config/agents/skills/completion-presentation/**`, `.config/agents/skills/papercut/SKILL.md`, `.config/agents/skills/papercut/evals/evals.json`, `.config/agents/rules/papercut.md`, `.config/agents/rules/human-facing-language.md`, `.config/agents/skills/dev-ask/references/execution-flow.md`
  - Acceptance: AC-5, AC-6, AC-7, AC-9
  - Receiver: dev-implementation
- [x] T4. Remove automatic plan archival
  completed 2026-09-05-0128
  - Owner: plan-transport-worker
  - Depends on: T1
  - Targets: `.config/agents/rules/plan-repo-storage.md`, `.config/agents/rules/plan-omp-transport.md`, `.config/agents/rules/plan-grok-transport.md`, `bin/omp-copy-plan-artifact`, `.config/agents/harnesses/omp/extensions/plan-artifact-sync.js`, `.config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js`
  - Acceptance: AC-2
  - Receiver: dev-implementation
- [x] T5. Synchronize canonical workflow projections
  completed 2026-09-05-0258
  - Owner: workflow-projection-worker
  - Depends on: T1, T2, T3, T4
  - Targets: `.config/agents/skills/dev-ask/WORKFLOW.md`, `.config/agents/skills/dev-ask/evals/evals.json`, `.config/agents/skills/dev-ask/evals/fixtures/**`, `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`, `.config/agents/skills/craft-skill/**`, `.config/agents/skills/init-ask/**`, `.config/agents/skills/product-ask/SKILL.md`, `.config/agents/skills/product-ask/WORKFLOW.md`, `.config/agents/skills/product-ask/evals/evals.json`, `.config/agents/rules/canonical-project-contracts.md`, `docs/adr/0001-dev-workflow-authority-and-routing.md`, `docs/adr/0002-executor-plans-and-orchestration.md`, `docs/adr/0003-bounded-assurance-and-repair.md`, `docs/adr/0004-canonical-discovery-and-continual-learning.md`, `docs/adr/0005-product-development-workflow-and-prd-authority.md` only if its generic completion projection is coupled, `docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md`, `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md`, `docs/adr/INDEX.md`
  - Acceptance: AC-8
  - Receiver: dev-code-review

## Acceptance

- [x] AC-1. Lean core execution contract
  Behavior: Plans, direct tasks, and worker Handoffs use direct checks, child-owned code changes, one same-worker code-then-test rethink, two semantic attempts, and one permanent-test policy without active proof-recipe, surface-adapter, worker-closure, generation-map, repair-token, or continuation-receipt machinery.
  Check: run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py` and inspect T1 runtime references; expect every lean-validator case passes and no T1 runtime caller names a removed mechanism.
- [x] AC-2. Active-path plan storage
  Behavior: OMP stores every valid plan lifecycle state, including `DONE` and `CLOSED`, at the active repository identity without automatic archival.
  Check: run `bun test .config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js`; expect all cases pass, terminal fixtures remain exact at the active path, and no archive path is created.
- [x] AC-3. One-shot review and verifier closure
  Behavior: Standard and high work receives one tests-first review before one verifier; required findings carry direct closure checks and the reviewer never reruns after repair.
  Check: inspect `.config/agents/skills/dev-code-review/SKILL.md`, `.config/agents/skills/dev-verification/SKILL.md`, and their focused evals; expect the fixed review axes, three verdicts, exact closure grammar, one clarification, one repair, and verifier-owned final closure with no review-rerun path.
- [x] AC-4. Bounded manual test audit
  Behavior: An explicit full-scope audit runs A first, injects rethink only after each auditor's first return, spawns B only for remaining findings, then exchanges proposals until agreement or a named liveness stop.
  Check: inspect the audit skill, protocol, opinion wrappers, and focused evals; expect every scoped file is accounted, A early success skips B, later ping-pong is proposal-only, all five liveness stops exist, one separately approved mutation batch is allowed, and original A performs closure or is reported unavailable.
- [x] AC-5. Generic uncapped papercut look
  Behavior: Every completed repository-work boundary loads papercut once; the skill owns qualification and returns every distinct qualifying repository-owned root cause in authored-task order without adding code/test-review policy.
  Check: run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/papercut/scripts/test_papercut_ledger.py` and inspect papercut skill/rule/evals; expect ledger tests pass, no numeric result cap remains, strict exclusions/consolidation/opt-in remain, and direct non-workflow work is covered.
- [x] AC-6. Single terminal learning assessment
  Behavior: Standard and high work loads `dev-continual-learning` once after review and verification; ordinary failure is residual and only a current governing-rule conflict blocks completion.
  Check: inspect engineering and portable learning skills, route order, and focused evals; expect lean outcome/path/Handoff/papercut/candidate intake, no manifest/digest/counter transport, no retry, and the exact blocking distinction.
- [x] AC-7. Five-field completion
  Behavior: The generic presenter accepts and renders exactly Outcome, Changes, Checks, Risks, and Next, with Papercut and Learning under Checks and no archive/digest gate.
  Check: exercise one valid five-field input through the real completion-presentation surface; expect only the five named fields, complete Papercut/Learning check lines, and no manifest, Handoff digest, archive, or resume locator requirement.
- [x] AC-8. Canonical and caller synchronization
  Behavior: Runtime skills, generic callers, rules, human map, maintenance journal convention, ADRs, INDEX, and focused evals agree while Reconcile and protected user work remain untouched.
  Check: run the updated stale-contract scanner, parse every changed JSON file, run the targeted validator/transport/papercut tests, and inspect changed paths; expect zero stale active projection, every supplied source row dated 2026-09-04, correct ADR-0004 D23 ownership, and no protected-path change.
- [x] AC-9. Lean standard route
  Behavior: Prospective standard and high routes order implementation, one code review, one verification, one learning assessment, then presentation without a model grader or second reviewer.
  Check: inspect `dev-ask` and `dev-implementation`; expect exactly `dev-implementation → dev-code-review → dev-verification → dev-continual-learning → completion-presentation` and no alternative standard/high assurance order.

## Recovery and stops

- Recovery: Preserve every completed task Handoff and current working-tree change; resume the earliest incomplete dependency-ready task under the same confirmed evidence, specification, ticket graph, protected-path boundary, and remaining semantic attempt.
- Stops: Stop on stale or changed human authority, undeclared path/effect mutation, protected-path drift, unavailable required child/reviewer/verifier, direct-check failure after semantic attempt 2, unresolved governing-rule conflict, unsafe partial effect, or any proposal to restore removed compatibility or add shipping.

## Completion Summary

- Outcome: The confirmed lean dev-* workflow migration is complete.
- Changes: Five implementation tasks installed the lean execution, assurance, audit, plan, papercut, learning, completion, human-map, caller, and canonical contracts; one bounded attempt-2 repair closed CR-1 through CR-4.
- Checks: AC-1 through AC-9 and CR-1 through CR-4 passed final independent verification; the one-shot review did not rerun; learning returned no durable learning.
- Risks: None.
- Next: completion-presentation
