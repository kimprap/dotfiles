# Dev Workflow Orchestration and Test Value

**Datetime**: 2026-08-26-2157
**Mode**: implementation
**Scope**: Standard
**Summary**: Cleanly replace plan-backed parent-as-worker execution with native full child orchestration, add same-child worker closure and value-gated tests, run a read-only two-model test audit, and preserve the lean planless direct path.
**Status**: DONE
**Completed At**: 2026-08-27-0610

## Objective

- Outcome: OUT-DWO-PLAN-01
- Observable end state: every approved parser-valid implementation Executor Plan launches through the existing Orchestrator Role Profile as full orchestration with `downgrade: none`; the root remains a mechanical control plane while fresh children own semantic work, same-child closure, smoke, and one Common Handoff. Shared-tree admission, test-value decisions, plural papercut presentation, and the read-only two-opinion audit capability are live without invalidating compact work-only plans, portable fan-in, planless direct work, or direct `dev-integration`.
- Progress signal: T1 through T6 each closes its owned criteria with one accepted Common Handoff; T4 seals one paired comparison receipt; T5 remains the sole canonical D13 mutating owner; and the human-authorized T6 closes exactly seven residual semantic caller projections before handing the expanded final target to `dev-verification`. The backend then completes fresh verification, review, and learning; only after this plan is terminal does `dev-ask` invoke the read-only audit in the same top-level session, without making that audit a task or completion gate.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-DWO-CONTINUATION-2 | Human verifier-block continuation | local://dwo-t6-attempt-two-authority.json@sha256:1bbf8e4a9134281127deaf7fdcbf3c2bb81a92379f27f0cc07f6eb1d013521e7 | authority-change-continuation-2 | Explicit user approval at 2026-08-27T04:22:54Z authorizes the last ordinary T6 attempt under the unchanged Task Contract, exactly one fixture write path, fresh assurance, no restored repair token, and no shipping. |
| AUTH-DWO-CONTINUATION | Human authority-change continuation | local://dwo-authority-change-continuation-r3.json@sha256:dbf6b77891833a1af5c035fa0f2d17f313eababb334998439c17d18471c0c481 | authority-change-continuation-1 | Explicit user approval at 2026-08-27T01:08:17Z authorizes exactly T6, its seven-path write set, and fresh standard assurance; the inherited repair token remains consumed. |
| AUTH-DWO-REVISION | Human revision handoff | Current conversation, beginning `The plan is structurally valid as Executor Plan v1` | revision-handoff-2026-08-26 | Supersedes every expansion unique to plan sha256:5bafacf73c82122467fce01420436ba1e807a035499c6546d23d8fd8afde7f3a; requires the corrections projected here. |
| AUTH-DWO-R2 | Human-approved planning handoff | HANDOFF-DWO-PLAN-20260825-r2 | r2 | Semantic authority for the requested implementation, as narrowed and clarified by AUTH-DWO-REVISION. |
| AUTH-DWO-DECISIONS | Confirmed interview decisions | local://dev-workflow-orchestration-test-value-decisions.md@sha256:7f829a03c83960f125b4342c614a0891379df26962206359343aa15992b316e5 | DEC-DWO-20260825-r2 | Human-confirmed design authority referenced by AUTH-DWO-R2. |
| AUTH-DWO-OUTCOME | Outcome contract | OUT-DWO-PLAN-01 | AUTH-DWO-20260825-r2 | Names the approved implementation outcome and unchanged acceptance boundary. |
| AUTH-ADR-0001 | Active canonical authority | docs/adr/0001-dev-workflow-authority-and-routing.md@sha256:a02c34ebb01dd15be166b2c1ffb83b424618dc7309ef2b0a353669f090ae06f0 | current before cutover | Existing D10, D11, D13, and D26 authority to revise without creating another ADR. |
| AUTH-ADR-0002 | Active canonical authority | docs/adr/0002-executor-plans-and-orchestration.md@sha256:5c6311e4791dfb2e44504ec1702a0d425960cb3e0384abd887d7f87f176b19a7 | current before cutover | Existing D06, D08, D09, and D21 authority to revise while preserving portable compact and fan-in grammar. |
| AUTH-ADR-0003 | Active canonical authority | docs/adr/0003-bounded-assurance-and-repair.md@sha256:67a411bcb1ab82cbee0a8ca78106348e7f1a7c981ea3b1bff4372f9816dd5130 | current before cutover | Existing D03, D04, and D22 authority plus approved new D28 test-portfolio-value decision. |
| AUTH-ADR-0004 | Active canonical authority | docs/adr/0004-canonical-discovery-and-continual-learning.md@sha256:86006794ae370a6935fd4eb59254294043fdf1041be39073ff3661410a2aedcf | current before cutover | Existing D07 authority to revise. |
| AUTH-ADR-0007 | Active canonical authority | docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md@sha256:08a935fa4de62b2a8b15ff72e66a4b9dd5cee7ac10144385ad500b6b6c9b280c | current before cutover | Existing D24 authority to revise. |
| AUTH-ADR-0009 | Active canonical authority | docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md@sha256:212339335e615338ab44c481b433fc8144bf97e5e651aed57222546d75293d4c | current before cutover | Existing D27 authority to revise. |
| AUTH-DWO-WORKFLOW | Current projection | .config/agents/skills/dev-ask/WORKFLOW.md@sha256:0bfc33ab7f1905d12638184aa33e60d8dfbb762fc364a17eeb156c74274e4d66 | current before cutover | Five-section workflow projection; subordinate to active ADRs and human authority. |
| AUTH-DWO-PLAN-RULES | Current plan grammar | .config/agents/rules/plan.md@sha256:bdc80e0de1bd5a43b4accf88ca7b4ee76b09936be363ea6324d1f07f28c817a9; .config/agents/rules/plan-impl-spec.md@sha256:43f7dc3c8b13df1a788ca973d13a48b93ce5ba8889e73382a08e086a2a4b0ebe | Executor Plan v1 | Preserve the portable grammar; strengthen only the implementation companion's shared-tree admission. |
| AUTH-DWO-OMP-DOC | Native harness evidence | omp://task-agent-discovery.md | runtime documentation observed 2026-08-26 | Confirms user custom-agent discovery, exact-name dispatch, role aliases, model resolution, read-summarize, and no worker-model field on task dispatch. |
| AUTH-DWO-GROK-DOC | Native harness evidence | https://docs.x.ai/build/features/subagents; xai-org/grok-build crates/codegen/xai-grok-pager/docs/user-guide/16-subagents.md; crates/codegen/xai-grok-subagent-resolution/src/config.rs | source commit 77cd7eb; observed 2026-08-26 | Confirms inline roles, read-only mode, model and reasoning fields, prompt_file, shared-tree isolation none, and current model limitation. Transport evidence only. |

Authority precedence is AUTH-DWO-CONTINUATION-2 for the bounded T6 attempt-two correction, then AUTH-DWO-CONTINUATION for the original seven-path continuation, then AUTH-DWO-REVISION, then AUTH-DWO-R2 and AUTH-DWO-DECISIONS, then the active ADR units being revised, then current projections and transport evidence. Transport documentation cannot choose workflow semantics. A material conflict with this chain is `authority-change-required`; a mechanically discoverable implementation fact follows the fixed contracts below.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-DWO-ACTIVATION | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | Every approved parser-valid implementation Executor Plan, including a compact work-only plan, enters `dev-implementation` plan orchestration. Launch requires full orchestration and `downgrade: none`. Planless direct work remains the current one-owner same-context lane. |
| DEC-DWO-BOOTSTRAP | AUTH-DWO-REVISION | Before T1, assess this plan with the current live `orchestrator-role-profile/v1` and current attestation. Start only when the existing assessment is `full-orchestration` and the bound downgrade is `none`; otherwise stop `transport-unavailable`. T1 implements the later plan-backed gate, so this plan cannot require a not-yet-existing assessment or let the root become a leaf. |
| DEC-DWO-ROOT | DEC-DWO-20260825-r2 | The plan-backed implementation root is a pure control plane. It validates, binds, schedules, dispatches, observes, controls, recovers, mechanically accepts bounded Handoffs, performs plan and papercut bookkeeping, schedules the backend, and prepares presenter input; it performs no semantic task, repair, test-audit opinion, or semantic review. |
| DEC-DWO-NATIVE | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | Use only native task/subagent dispatch, hub control, existing Context Packs, Common Handoffs, and native artifact locators. Add no SDK, daemon, database, queue, sidecar, external CLI orchestrator, nested planner, worktree, branch, or merge path. Preserve the portable fan-in grammar and the existing direct `dev-integration` specialty. |
| DEC-DWO-SCHEDULING | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | Shared-tree admission is runtime policy, not a portable grammar ban. The scheduler changes timing only: mechanically disjoint ready tasks may overlap, declared or unknown overlap serializes, undeclared mutation stops, and an isolation requirement the native shared tree cannot preserve stops rather than rewriting the plan. |
| DEC-DWO-CLOSURE | DEC-DWO-20260825-r2 | Work attempt one, eligible work attempt two, and post-assurance Build repair use the same child's `worker-closure/v1`: mandatory round one, conditional round two after a concrete correction, repair all findings, task-local smoke, then one Common Handoff. Verification, review, learning, and test audit never use worker closure. |
| DEC-DWO-ATTEMPTS | DEC-DWO-20260825-r2 + AUTH-DWO-CONTINUATION | Each planned work task has attempt one and at most one eligible fresh-child attempt two. The original run-wide post-assurance repair token was consumed after OUTP-T5 and is not restored. AUTH-DWO-CONTINUATION creates one fresh T6 attempt-one/two cycle under its changed falsifiable hypothesis; bare continue remains a no-op, no third attempt exists, and no post-T6 repair is authorized. |
| DEC-DWO-ASSURANCE | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION + AUTH-DWO-CONTINUATION | T5's historical receiver remains `dev-verification`; the resulting repaired-target review produced the two lineages authorizing T6. T6 is now this plan's last numbered task and its receiver is `dev-verification`. The backend then schedules fresh review and learning. This plan omits a numbered assurance tail; the portable grammar's current optional-tail support remains unchanged. |
| DEC-DWO-PAPERCUTS | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | After each work Common Handoff, the same child performs one soft papercut look and returns the existing compact receipt; the root falls back only when the child cannot. Retain every receipt internally and rename the existing completion fence's singular `papercut` field to ordered plural `papercuts`; do not introduce a new completion schema. |
| DEC-DWO-TEST-VALUE | DEC-DWO-20260825-r2 | A permanent test is justified only by an uncovered observable contract, regression, or invariant; existing tests are reused first; the seam is public and the oracle independent; a plausible bug is named. Tautological, duplicate, subsumed, incidental-snapshot, implementation-detail, and coverage-only tests are rejected or consolidated. |
| DEC-DWO-AUDIT | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | `dev-test-audit` is a model-discoverable read-only specialty routed by `dev-ask`, not a numbered implementation task or completion gate. T2 implements and validates the capability. After this plan is DONE, the same top-level session invokes it and then stops for any separately approved cleanup plan. |
| DEC-DWO-MODELS | DEC-DWO-20260825-r2 | Audit opinion A is GPT-5.6-sol at xhigh and opinion B is Grok-4.6 at xhigh. Each opinion attests exact model, effort, read-only mode, no fallback, child identity, suite identity, and policy identity. Any mismatch is `transport-unavailable`; one opinion never substitutes for two. |
| DEC-DWO-COMPARISON | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | T4 runs one deterministic paired live serial/hybrid comparison. Correctness parity, distinct child identities, root non-mutation, barrier order, seeded-omission closure, bounded parent payload, cleanup, and no acceptance regression are hard gates. Timing selects serial-default or dynamic when directional and otherwise remains inconclusive; no percentage threshold or general efficiency claim exists. |
| DEC-DWO-CUTOVER | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | T5 alone mutates canonical D13 projections. It resolves the four live conflicts in `orchestrator-role-profile.md`, `dev-implementation/SKILL.md`, `compact-checklist.md`, and `dev-ask/WORKFLOW.md` D03 grant/worth/Close handling; adds D28 to ADR-0003 without a new ADR; and preserves compact plans, fan-in grammar, and direct integration. |
| DEC-DWO-CALLER-CLOSURE | AUTH-DWO-CONTINUATION | T6 owns exactly the registry, stale-contract scanner, three named legacy-grant fixtures, and two named singular-`Papercut` completion fixtures in its continuation receipt. It removes no additional behavior, changes no canonical D13 projection, preserves every other target byte, and proves the seven-path hypothesis through targeted semantic cases, scanner coverage, and current registry/file parity. |
| DEC-DWO-DIRECT | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | Planless direct work keeps the lean one-owner same-context path. Planned compact work dispatches its work owners as children without gaining an assurance tail. No sequential-child profile or root-rescue path is added. |
| DEC-DWO-LIVE | DEC-DWO-20260825-r2 + AUTH-DWO-REVISION | T2 may install the two OMP user-agent links only when collision-safe and records a skipped or preserved collision without blocking repository capability. Do not run broad bootstrap or replace the diverged regular `~/.grok/config.toml`; repository Grok changes affect future bootstrap only. |
| DEC-DWO-SHIPPING | AUTH-DWO-R2 | No stage, commit, push, review request, release, deploy, rollout, force operation, or broad bootstrap execution is authorized. |

## Scope, non-goals, and prohibited effects

- Read surfaces: the owned targets in Target map; applicable active ADRs; current Executor Plan v1 grammar and fixtures; the current Orchestrator Role Profile and assessor; current Common Handoff, Context Pack, papercut, completion, compact, audit, OMP, and Grok contracts; current permanent-test discovery surfaces; dependency Handoffs and native artifact indexes named by this plan.
- Change surfaces: only T1, T2, T3, T5, and T6 repository targets; T2's two optional collision-safe live OMP links; T4's owner-tracked local comparison artifacts; current-plan lifecycle bookkeeping; conditional D24 papercut settlement. T6 is limited to the seven exact continuation paths in TGT-DWO-CALLER-CLOSURE. The post-plan audit is repository-read-only and owns no numbered task or cleanup effect.
- Non-goals: a schema-version migration; a second envelope catalog; invalidating compact work-only Executor Plans; deleting portable fan-in or direct `dev-integration`; a new orchestration ADR; a sequential-child profile; root semantic work or review; worktree isolation; grant/worth/Close restoration; one-opinion audit fallback; test-cleanup mutation; broad bootstrap; live Grok replacement; shipping.
- Prohibited effects: root leaf execution, hidden task invention, task splitting or merging, parent semantic acceptance, undeclared mutation, isolation weakening, transcript mining, unknown-test deletion, test-audit mutation, raw git staging, commit, push, release, deployment, broad formatter passes, and modification of unexpected user work.
- Unchanged behavior: `plan.md` remains workflow-agnostic; `executor-plan-validation/v1`, `orchestrator-role-profile/v1`, current Common Handoff, and current completion fence remain the named surfaces; compact work-only plans and `fan_in.md` remain valid; planless direct remains one-owner same-context; direct `dev-integration` remains available; Methods stays `none | tdd`; verification remains independent and read-only.
- Drift rule: before writing, each child records the current digest of every owned existing target. Expected dependency changes must match a dependency Handoff. Any other byte drift is preserved and returned as `authority-change-required`; no child overwrites it.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-DWO-MECHANICS | Repository mutation | AUTH-DWO-R2 | T1 only; existing v1 schema names remain. |
| EFF-DWO-AUDIT-CAPABILITY | Repository mutation | AUTH-DWO-R2 | T2 only. |
| EFF-DWO-LIVE-OMP | Optional live symlink creation with backup-before-overwrite safeguards | AUTH-DWO-REVISION | T2 only; collision or discovery failure is recorded without blocking repository capability. |
| EFF-DWO-EVALS | Repository mutation | AUTH-DWO-R2 | T3 only. |
| EFF-DWO-COMPARISON | Owner-tracked local experiment artifacts and cleanup | AUTH-DWO-R2 | T4 only. |
| EFF-DWO-CANONICAL | Repository mutation | AUTH-DWO-R2 | T5 only; sole D13 projection owner. |
| EFF-DWO-CALLER-CLOSURE | Repository mutation | AUTH-DWO-CONTINUATION | T6 only; exactly seven named dev-ask eval paths; every other repository byte is preserved. |
| EFF-DWO-RUNTIME-EVIDENCE | Plan lifecycle bookkeeping, Handoffs, receipts, assurance artifacts, and conditional D24 settlement | AUTH-DWO-PLAN-RULES, AUTH-ADR-0007, AUTH-ADR-0009 | T1 through T6 and the backend; no semantic target mutation by the root. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-DWO-PLAN-V1 | Existing Executor Plan grammar and plan-backed admission | T1 | executor-plan-validation/v1 plus shared-tree runtime admission | T1, T3, T5, T6 |
| CONTRACT-DWO-PROFILE-V1 | Existing Orchestrator Role Profile with a plan-backed full-orchestration gate | T1 | orchestrator-role-profile/v1 | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-CONTEXT | Existing bounded Context Pack projection | T1 | current Context Pack, extended in place | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-CLOSURE-V1 | Same-child worker closure | T1 | worker-closure/v1 | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-TEST-VALUE-V1 | Permanent-test value and changed-test disposition | T1 | test-value/v1 | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-ATTEMPT | Work attempts, repair token, and continuation receipt | T1 | existing attempt contract, extended in place | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-HANDOFF | Common Handoff additions and mechanical parent gate | T1 | existing Common Handoff, extended in place | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-PAPERCUT | Existing post-Handoff papercut result and root fallback | T1 | current papercut workflow result | T1, T2, T3, T4, T5, T6 |
| CONTRACT-DWO-ASSURANCE | Existing verification, review, and learning backend | T6 | current backend lifecycle, T6 receiver bound to dev-verification | T5 historical assurance, T6 final assurance |
| CONTRACT-DWO-AUDIT-V1 | Read-only two-opinion test audit protocol and bounded result projection | T2 | test-audit/v1 | T2, T3, T5, post-plan audit |
| CONTRACT-DWO-HARNESS | Exact OMP and Grok audit opinion role binding | T2 | repository harness role mapping | T2, T5, post-plan audit |
| CONTRACT-DWO-EVAL-MATRIX | Semantic fixture and stale-contract coverage | T3 | DWO semantic matrix, finitely extended by T6 | T3, T4, T5, T6 |
| CONTRACT-DWO-COMPARISON | One-pair serial-versus-hybrid promotion receipt | T4 | DWO comparison receipt | T4, T5 |
| CONTRACT-DWO-COMPLETION | Existing presenter input with plural material papercuts | T5 | completion-presentation-input, field cutover in place | T3, T5, T6 |
| CONTRACT-DWO-CUTOVER | Finite D13 canonical caller closure | T5 | DWO cutover manifest | T5, T6 preservation check |
| CONTRACT-DWO-CONTINUATION-CLOSURE | Finite residual eval caller closure | T6 | authority-change-continuation-1 | T6, final verification, final review |

### Existing Executor Plan v1 and bootstrap

The parser command and result remain `.config/agents/skills/dev-implementation/scripts/executor_plan.py validate PLAN` and `executor-plan-validation/v1`. This plan, `complete.md`, `fan_in.md`, and the existing compact work-only cases remain valid v1 inputs. T1 must not rename the schema constants, delete `fan_in.md`, reject compact plans, prohibit isolated lineages, remove generic fan-in, or change `plan.md`.

`plan-impl-spec.md` is the only portable-plan companion T5 strengthens. Its shared-tree admission text must make these distinctions explicit:

1. An approved parser-valid implementation plan enters plan orchestration regardless of assurance profile or task count. A compact work-only plan dispatches its authored work owner or owners as children; compact assurance still has no independent verification, review, or learning tail.
2. `Topology`, `Lineages`, `Isolation`, and `Fan-in` describe the authored task graph and proof boundaries, not permission for the implementation root to perform a work task.
3. In a shared tree, exact declared target and effect ownership controls admission. Mechanically disjoint ready tasks may overlap; declared overlap, unknown overlap, or an exclusive resource serializes. An undeclared write stops the child.
4. A portable fan-in plan remains structurally valid. If its declared isolation or neutral integration cannot be preserved by the live shared-tree transport, runtime stops `transport-unavailable`; it never edits the plan into a weaker topology. Direct `dev-integration` remains unchanged.
5. Current optional profile-tail grammar remains valid. This plan chooses to omit the tail and uses T6's receiver plus backend scheduling.

Bootstrap is asymmetric by design. Before T1, the implementation root uses the current `orchestrator_profile.py assess` path, current `orchestrator-role-profile/v1`, and a fresh current attestation. It may begin only when the result is `full-orchestration` and the profile's `downgrade` is exactly `none`. A `one-owner-sequential` result is rejected for this plan. No new profile assessment, reference file, or T1 output is a precondition for T1, and transport failure never authorizes root leaf work.

### Existing profile and control-plane boundary

T1 extends `.config/agents/skills/dev-implementation/scripts/orchestrator_profile.py` without changing `PROFILE_SCHEMA`, `ATTESTATION_SCHEMA`, `ASSESSMENT_SCHEMA`, `assess`, or the existing direct/non-plan downgrade behavior. Add:

```python
def assess_plan_backed(
    profile: Mapping[str, object], attestation: Mapping[str, object]
) -> Assessment:
```

The function calls the existing `assess`. It returns that result only when the profile's downgrade is exactly `none` and the result is `full-orchestration`; otherwise it returns the existing assessment type with decision `transport-unavailable`, the same plan digest, and a concrete mismatch naming either the prohibited downgrade or non-full result. Add CLI subcommand `assess-plan-backed` with the existing `--profile` and `--attestation` inputs. It exits zero only for `full-orchestration`. Keep `assess` and its current one-owner-sequential tests for planless/direct compatibility; the new subcommand is the only later-plan launch seam.

The root may validate and bind the plan, project todos, calculate the ready frontier, dispatch exact child work, record child identity and monotonic timing, use hub control with that same child, validate bounded Handoff and artifact references, enforce target/effect ownership, pause or recover, perform lifecycle and papercut bookkeeping, and schedule the declared backend. It may not edit a task target, run task smoke, inspect a child transcript, judge semantic sufficiency, repair, perform an audit opinion, or substitute itself for a child. `Max concurrency` is a ceiling: running one ready child because only one slot or one safe frontier exists is scheduling, not a sequential-child profile or downgrade.

### Existing Context Pack, Common Handoff, papercut, and completion surfaces

Reuse the current Context Pack from `dev-implementation`. For each child, project only its unchanged Task Contract; owned criteria and proof recipes; exact authority and private-reference identities; declared dependency Handoffs; target/effect boundary; attempt and repair-token state; continuation receipt when applicable; bounded environment facts; and native artifact locators. Do not create a numbered context schema, an exact field order, a second result envelope, or a transcript projection.

Extend the existing Common Handoff in `dev-handoff` rather than replacing it. A work Handoff adds:

- the exact child and attempt identity, target before/after identity, and task outcome;
- `worker-closure/v1` identity, round count, finding IDs, corrections, and final smoke evidence;
- one changed-test row per changed permanent test, recording path selector, observable contract, plausible unique bug, public seam, independent oracle, keep/merge/remove disposition, and evidence; or a concrete existing-coverage/no-new-contract decision when tests do not change;
- the current continuation receipt identity and changed falsifiable hypothesis when a human-authorized continuation exists; and
- the existing papercut accounting state needed to require one post-Handoff soft look.

The work child seals one Common Handoff, then performs the current papercut soft look and returns the existing compact result referencing that Handoff. No second completion envelope is introduced. The root checks child/task/attempt identity, declared target/effect ownership, dependency digests, criterion-to-smoke coverage, closure receipt presence, Handoff completeness, and papercut accounting mechanically; it never decides whether the implementation is semantically good.

The existing `completion-presentation-input` fence keeps its current activation and all current fields except the clean field rename `papercut` to `papercuts`. `papercuts` is an ordered array of material existing papercut results; none-only accounting becomes an empty array. The renderer emits `Papercuts: none` for an empty array or one nested bullet per material result. Apply the field rename to engineering, product, custom, and direct normalizers and fixtures without introducing a versioned fence or compatibility reader.

### Worker closure and solution discipline

`.config/agents/skills/dev-implementation/references/worker-closure.md` owns the sole exact round-one and round-two prompts and is identified as `worker-closure/v1` by its file digest. Do not copy either prompt into another skill, rule, ADR, eval, or this plan's implementation.

For work attempt one, eligible work attempt two, and each Build repair admitted by the single post-assurance token, the root invokes the reference-defined round-one challenge through same-child control after the child has a candidate. The candidate is nonterminal. The child checks only the unchanged Task Contract, repairs every concrete finding, and records the dispositions. Round two runs only when round one caused a contract-relevant correction; it checks only corrected findings and repair-caused regressions. The child repairs every round-two finding, runs task-local smoke, and emits one final Common Handoff. There is no third round. Verification, review, learning, audit controller, and audit opinion children never run this closure. The root checks receipt structure and identity only; it does not conduct a semantic challenge.

`plan-orchestration.md` owns the progressive root/scheduler/attempt/backend procedure and references the existing profile, Context Pack, Common Handoff, papercut, and completion surfaces. `test-value.md` owns the shared permanent-test policy. These three private references are progressive instructions, not another schema catalog.

### Test-value policy

`test-value/v1` fixes this decision order:

1. Name the new observable contract, regression, or invariant. If none exists, do not add a permanent test.
2. Find the closest existing test and prove the new contract is not already covered. Extend or merge before adding another test.
3. Use the narrowest stable public seam and an oracle independent from the implementation under test.
4. Name one plausible bug that the test fails on while correct behavior passes.
5. Reject or consolidate implementation-detail assertions, tautologies, duplicate or subsumed cases, incidental snapshots, coverage-only cases, and tests whose oracle repeats production logic.
6. Keep the smallest permanent set preserving each unique contract. Comparison artifacts and audit investigation data are not permanent tests.

Implementation, explicit TDD, review, and audit consume this same reference. TDD retains red/green proof, then merges or removes redundant tracer tests before Handoff.

### Attempts, assurance, and continuation

Each T1 through T6 Task Contract starts with attempt one. Attempt two is a fresh child and is eligible only when attempt-one evidence shows criterion progress, exact blocker resolution, or a materially changed falsifiable hypothesis under the unchanged Task Contract and target boundary. No third ordinary attempt exists.

The backend originally owned one run-wide post-assurance repair token. The repair after OUTP-T5 consumed it 1/1. AUTH-DWO-CONTINUATION does not restore that token or authorize another Build repair; it adds T6 as a revised-plan work task with its own ordinary attempt-one/two boundary, worker closure, and exact impacted smoke. Any blocking verifier or reviewer finding after OUTP-T6 leaves the plan IN_PROGRESS pending new human authority.

After an exhausted task, only an explicit human authorization naming this plan and a materially changed falsifiable hypothesis creates a continuation receipt. The receipt binds the active plan and target identities, blocked task, remaining criteria, changed hypothesis, authorizer/time, cycle, and inherited repair-token state; the next Common Handoff references it. AUTH-DWO-CONTINUATION is that receipt for T6 and binds the pre-revision plan identity, repaired 79-file target identity, two open review lineages, seven exact write paths, changed hypothesis, and consumed repair token. Bare continue, another opinion, elapsed time, a generic retry, or an unchanged hypothesis changes no state. Remove the current grant counter, worth frame, Continue/Second-opinion/Close menu, and persisted exhaustion-record grammar; do not recreate them under new names.

T6 is the last numbered task and its receiver is `dev-verification`. On OUTP-T6, the existing backend obtains fresh verification of the expanded current target, then one current-target `dev-code-review`, then terminal `dev-continual-learning`. These roles are fresh children and do not use worker closure. The prior OUTP-T5 verification and repaired-target review remain provenance for AUTH-DWO-CONTINUATION, not substitutes for fresh T6 assurance. Audit availability and results do not gate this sequence or plan DONE.

### Read-only test audit capability and post-plan call

T2 creates model-discoverable `dev-test-audit`, one shared read-only opinion prompt, repository harness roles, and semantic evals. The audit freezes one repository target identity, one permanent-suite manifest, and `test-value/v1` before dispatching two independent opinion children. Required bindings are:

- opinion A: OMP role `@test_audit_opinion_a`, exact selector `openai-codex/gpt-5.6-sol:xhigh`; Grok logical role `test-audit-opinion-a`, requested model `gpt-5.6-sol`, reasoning `xhigh`;
- opinion B: OMP role `@test_audit_opinion_b`, exact selector `xai-oauth/grok-4.6:xhigh`; Grok logical role `test-audit-opinion-b`, model `grok-4.6`, reasoning `xhigh`.

Each opinion attests its agent name, distinct child identity, requested and resolved model, reasoning, read-only tools, fallback `none`, repository target, suite identity, and policy identity. A mismatch or unavailable exact model returns `transport-unavailable`; no substitute model or one-opinion result is accepted.

The audit protocol reference, not this plan, owns its result format. Each opinion keeps its complete test ledger behind a native artifact locator and returns a digest plus a bounded candidate index that proves complete suite coverage and names every non-keep candidate. The controller receives neither full ledger, unions both candidate sets, fetches only counterpart rows needed for that union, preserves every unsupported or unknown case, applies deterministic evidence rules, rehashes the target and suite, and emits one read-only Common Handoff. No audit result authorizes test mutation.

After this plan reaches DONE through its normal assurance backend, `dev-ask` invokes `dev-test-audit` in the same top-level session against that immutable completed target. The audit returns its Common Handoff or a precise `transport-unavailable` Handoff and then stops. Missing OMP discovery, unavailable Grok opinion A, or other audit transport failure does not reopen this plan, block T6, delay assurance, or authorize cleanup. Any cleanup is a separately approved future plan.

### Comparison gate

T4 runs one live pair against the exact T3 fixtures `B-DWO-WORKER-CLOSURE` and `B-DWO-UNDECLARED-MUTATION`. The serial control uses one fresh child to consume both fixtures and satisfy the complete comparison Task Contract. The hybrid treatment uses distinct fresh slice-A and slice-B children, one per fixture; waits at a barrier for both final Handoffs; then sends only those Handoffs and a deliberately incomplete combined candidate that omits slice B to one fresh Build child. The same Build child must identify and repair that seeded omission through `worker-closure/v1`, smoke both fixture outcomes, and emit its final Handoff. Neither the main root nor the T4 coordinating child performs the serial or hybrid semantic result computation.

The sealed comparison receipt records the common model/reasoning/repository/fixture/acceptance identities; every subject child ID and Handoff; barrier order; seeded finding and repair; serial and hybrid results; main-root target manifest before/after; monotonic elapsed times; coordinating-context semantic payload byte counts; and cleanup. Payload bytes include only materialized Task Contracts, Context Packs, fixture bytes, result envelopes, artifact locators, and Handoffs entering the coordinating context; hidden reasoning and transcripts are excluded. The hybrid coordinator must receive no full fixture or leaf-result body, and its counted payload must be lower than the serial control's counted payload.

Promotion is mechanical:

- `STOP` when correctness parity, distinct-child identity, root non-mutation, barrier, seeded closure, acceptance parity, payload bound, or cleanup fails.
- `PROMOTE-DYNAMIC` when all hard gates pass, the pair is unconfounded, and hybrid elapsed time is lower than serial elapsed time.
- `PROMOTE-SERIAL-DEFAULT` when all hard gates pass and hybrid is not faster or the timing observation is confounded/inconclusive.

One pair supports only its recorded directional observation. `PROMOTE-DYNAMIC` does not authorize a general efficiency claim; `PROMOTE-SERIAL-DEFAULT` still means full orchestration with runtime concurrency one by default, not a sequential-child profile. T4 removes its temporary working root and preserves only the sealed receipt and referenced native artifacts.

## Target map

### Owned targets

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-DWO-MECHANICS | `.config/agents/skills/dev-implementation/scripts/orchestrator_profile.py`; `.config/agents/skills/dev-implementation/scripts/test_orchestrator_profile.py` | T1 | Record execution-start SHA-256 before first write. | `dev-implementation`; current profile reference; current CLI callers | AC-DWO-11 |
| TGT-DWO-PRIVATE-REFS | add `.config/agents/skills/dev-implementation/references/plan-orchestration.md`; add `.config/agents/skills/dev-implementation/references/worker-closure.md`; add `.config/agents/skills/dev-implementation/references/test-value.md` | T1 | Paths absent before execution. | T1 through T6; implementation backend; TDD; review; audit | AC-DWO-11 |
| TGT-DWO-AUDIT-PACKAGE | add `.config/agents/skills/dev-test-audit/SKILL.md`; add `.config/agents/skills/dev-test-audit/references/audit-protocol.md`; add `.config/agents/skills/dev-test-audit/references/opinion-agent.md`; add `.config/agents/skills/dev-test-audit/evals/evals.json` | T2 | Paths absent before execution. | `dev-ask`; post-plan audit; OMP and Grok role prompts | AC-DWO-08 |
| TGT-DWO-HARNESS | `.config/agents/harnesses/omp/config.yml`; `.config/agents/harnesses/grok/config.toml`; `.config/scripts/bootstrap`; add `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md`; add `.config/agents/harnesses/omp/agents/test-audit-opinion-b.md` | T2 | Record execution-start SHA-256 for existing files; agent files absent. | OMP user-agent discovery; Grok future bootstrap; dotfiles bootstrap | AC-DWO-08 |
| TGT-DWO-LIVE-OMP | optional `/Users/kim/.omp/agent/agents/test-audit-opinion-a.md`; optional `/Users/kim/.omp/agent/agents/test-audit-opinion-b.md`; read-only check of existing `/Users/kim/.omp/agent/config.yml` projection | T2 | Two agent links absent and config symlink to repository when observed 2026-08-26; recheck before action. | Current-session OMP audit discovery only | AC-DWO-08 |
| TGT-DWO-EVALS | `.config/agents/skills/dev-ask/evals/evals.json`; `.config/agents/skills/dev-ask/evals/compare_trace.py`; `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; affected case files selected by current registry IDs named in T3; add the five DWO fixture paths below; `.config/agents/skills/completion-presentation/evals/evals.json`; `.config/agents/skills/papercut/evals/evals.json`; `.config/agents/skills/product-ask/evals/evals.json`; `.config/agents/skills/continual-learning/evals/evals.json` | T3 | Record execution-start digests only for selected owned files; do not freeze a repository-wide inventory. | semantic comparator; stale scanner; completion, papercut, product, and learning registries | AC-DWO-12 |
| TGT-DWO-CALLER-CLOSURE | `.config/agents/skills/dev-ask/evals/evals.json`; `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; `.config/agents/skills/dev-ask/evals/fixtures/b-full/case.json`; `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json`; `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-missing-assurance/case.json`; `.config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json`; `.config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json` | T6 | Exact pre-write manifest in AUTH-DWO-CONTINUATION; two fixture paths extend the repaired 79-file target to 81 files. | `dev-ask` semantic harness; stale scanner; completion route goldens; final verifier/reviewer | AC-DWO-14 |
| TGT-DWO-COMPARISON | temporary `local://dwo-orchestration-comparison-out-dwo-plan-01/`; sealed `local://dwo-orchestration-comparison-receipt.json` | T4 | Paths absent before T4. | T5 promotion branch; final verifier | AC-DWO-13 |
| TGT-DWO-ADRS | `docs/adr/0001-dev-workflow-authority-and-routing.md`; `docs/adr/0002-executor-plans-and-orchestration.md`; `docs/adr/0003-bounded-assurance-and-repair.md`; `docs/adr/0004-canonical-discovery-and-continual-learning.md`; `docs/adr/0007-automated-papercut-lifecycle-and-lean-evidence.md`; `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md`; `docs/adr/INDEX.md` | T5 | Record execution-start SHA-256 for each exact path. | all active workflow projections and maintainers | AC-DWO-01, AC-DWO-02, AC-DWO-03, AC-DWO-04, AC-DWO-05, AC-DWO-06, AC-DWO-07, AC-DWO-09, AC-DWO-10 |
| TGT-DWO-ROUTER | `.config/agents/skills/dev-ask/SKILL.md`; `.config/agents/skills/dev-ask/WORKFLOW.md` | T5 | Record execution-start SHA-256 for each exact path. | engineering intake; plan execution; post-plan audit routing | AC-DWO-01, AC-DWO-05, AC-DWO-06, AC-DWO-10 |
| TGT-DWO-IMPLEMENTATION | `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/references/orchestrator-role-profile.md`; `.config/agents/skills/dev-implementation/references/compact-checklist.md`; `.config/agents/skills/dev-handoff/SKILL.md`; `.config/agents/skills/dev-code-review/SKILL.md`; `.config/agents/skills/dev-continual-learning/SKILL.md`; `.config/agents/skills/continual-learning/SKILL.md`; `.config/agents/skills/continual-learning/WORKFLOW.md`; `.config/agents/skills/dev-tdd/SKILL.md` | T5 | Record execution-start SHA-256 for each exact path. | plan orchestration; workers; Handoffs; review; learning; TDD | AC-DWO-01, AC-DWO-02, AC-DWO-03, AC-DWO-04, AC-DWO-05, AC-DWO-06, AC-DWO-07, AC-DWO-09, AC-DWO-10 |
| TGT-DWO-PLAN-RULES | `.config/agents/rules/plan-impl-spec.md`; `.config/agents/rules/plan-omp-transport.md`; `.config/agents/rules/plan-grok-transport.md` | T5 | Record execution-start SHA-256 for each exact path. | plan-backed shared-tree admission and native launch transport | AC-DWO-01, AC-DWO-02, AC-DWO-03, AC-DWO-05, AC-DWO-07, AC-DWO-09, AC-DWO-10 |
| TGT-DWO-TERMINAL | `.config/agents/rules/papercut.md`; `.config/agents/skills/papercut/SKILL.md`; `.config/agents/skills/papercut/WORKFLOW.md`; `.config/agents/skills/completion-presentation/SKILL.md`; `.config/agents/skills/product-ask/SKILL.md`; `.config/agents/skills/product-ask/WORKFLOW.md` | T5 | Record execution-start SHA-256 for each exact path. | engineering, product, custom, and direct terminal callers | AC-DWO-05, AC-DWO-06, AC-DWO-10 |

### Target and preservation rules

- T5's five target rows remain the closed canonical D13 mutation inventory. T6 does not reopen canonical projections; it owns only the seven exact eval paths in TGT-DWO-CALLER-CLOSURE.
- T1 and T2 own disjoint repository paths. T2 depends on T1 because it consumes `worker-closure/v1` and `test-value/v1`; no T1-owned contract is consumed before that dependency Handoff.
- T3 selected existing fixture files from the then-current registries only when their asserted behavior changed. T6 supersedes T3 ownership only for the seven continuation paths named above and preserves every other T3 target byte.
- T4 owns no repository file. It may create and delete only its named local comparison root and may preserve only the sealed receipt and native artifact locators.
- `.config/agents/rules/plan.md`, `.config/agents/skills/dev-implementation/scripts/executor_plan.py`, `.config/agents/skills/dev-implementation/scripts/test_executor_plan.py`, `.config/agents/skills/dev-implementation/scripts/fixtures/executor_plan/complete.md`, and `.config/agents/skills/dev-implementation/scripts/fixtures/executor_plan/fan_in.md` are preservation controls. Their accepted pre-execution digests remain byte-unchanged after T6.
- Before T6 writes, rehash all seven continuation paths against AUTH-DWO-CONTINUATION. Any mismatch or any needed eighth semantic path is `authority-change-required`; preserve it and stop.
- `/Users/kim/.grok/config.toml` is a preservation control. Rehash it before and after T2; never write it.

T3 adds exactly these central fixture IDs and paths:

```text
B-DWO-WORKER-CLOSURE	.config/agents/skills/dev-ask/evals/fixtures/b-dwo-worker-closure/case.json
B-DWO-UNDECLARED-MUTATION	.config/agents/skills/dev-ask/evals/fixtures/b-dwo-undeclared-mutation/case.json
B-DWO-PAPERCUT-RECEIPTS	.config/agents/skills/dev-ask/evals/fixtures/b-dwo-papercut-receipts/case.json
B-DWO-TEST-VALUE	.config/agents/skills/dev-ask/evals/fixtures/b-dwo-test-value/case.json
R-DWO-TEST-AUDIT	.config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json
```

Rewrite existing affected cases in place: plan-backed compact cases must dispatch child work while remaining compact and tail-free; planless direct cases must remain same-context; fan-in cases must remain structurally valid and exercise runtime preserve-or-stop admission; optional-tail cases must remain valid while this plan's omitted-tail case schedules the backend; grant/worth/opinion/Close cases must prove no state change without a changed-hypothesis continuation receipt; scalar papercut cases must fail the clean plural field contract. T6 then removes the residual `attempt-or-grant`/grant-counter expectations from exactly `B-FULL`, `B-T5-COMPLETION-ASSURED`, and `B-T5-COMPLETION-MISSING-ASSURANCE`; extends stale scanning to those active registry/fixture projections; and changes the two `R-COMPLETE*` goldens from singular `Papercut` to `Papercuts`, with exact registry/file parity.

## Execution policy

- Assurance: standard
- Topology: full-orchestration
- Max concurrency: 2
- Isolation: shared-tree
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: The root releases only dependency-ready work whose declared targets and effects are admitted under the shared-tree rules. This graph is intentionally serial because T2 consumes T1's private references and T6 consumes the accepted OUTP-T5 lineage plus AUTH-DWO-CONTINUATION: W0 T1; W1 T2; W2 T3; W3 T4; W4 T5; W5 T6. T4 may use two internal subject slots for its fixed hybrid pair. The post-plan audit may use two opinion slots only after this plan is terminal. Unknown overlap or an exclusive resource serializes; undeclared mutation stops.
- Decomposition: Exact numbered graph is T1 → T2 → T3 → T4 → T5 → T6. The root cannot add, split, merge, substitute, or perform a task. T6 is the single human-authorized continuation task, not a hidden repair. T4's serial/hybrid subjects are fixed experiment roles under T4, not hidden repository tasks. The audit controller and opinions are a separately routed post-plan specialty, not descendants of this task graph.
- Effect limit: EFF-DWO-MECHANICS, EFF-DWO-AUDIT-CAPABILITY, EFF-DWO-LIVE-OMP, EFF-DWO-EVALS, EFF-DWO-COMPARISON, EFF-DWO-CANONICAL, EFF-DWO-CALLER-CLOSURE, EFF-DWO-RUNTIME-EVIDENCE
- Orchestrator profile: orchestrator-role-profile/v1; plan-backed full-orchestration required; downgrade: none

Before T1, run the current v1 assessment and accept only live-attested `full-orchestration` with the bound profile's downgrade equal to `none`. If current native dispatch, stable child identity, same-child control, shared-tree operation, native artifact references, or required depth is unavailable, stop `transport-unavailable`. Do not call the new T1 subcommand before T1 exists, and do not execute any numbered task in the root.

Each work child receives the existing bounded Context Pack and returns one extended Common Handoff, followed by its current papercut soft-look result. Work attempts run worker closure. The root admits Handoffs mechanically and cannot make semantic corrections.

After OUTP-T6, the backend starts current-target `dev-verification`, then `dev-code-review`, then `dev-continual-learning`; those are not task rows in this plan and do not run worker closure. Completion requires their normal terminal evidence, all T1–T6 criteria and receipts, stable current target, plan status `DONE`, and one valid existing completion fence using `papercuts`. The post-plan `dev-ask` → `dev-test-audit` call begins only after DONE and cannot change this plan's completion state.

## Tasks

- [x] T1. Extend v1 orchestration mechanics and private references
  - completed 2026-08-27-0013
  - Owner: dev-implementation worker
  - Intent: Add the plan-backed launch gate and progressive worker protocols without replacing existing portable schemas.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-DWO-MECHANICS, TGT-DWO-PRIVATE-REFS
  - Contracts: CONTRACT-DWO-PLAN-V1, CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT
  - Criteria: AC-DWO-11
  - Effects: EFF-DWO-MECHANICS, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T1
  - Receiver: dev-implementation backend
  - Verification: VR-DWO-11
  - Lineage: shared
  - Execution detail: Rehash both existing targets and record the preservation-control digests. Add `assess_plan_backed` and `assess-plan-backed` exactly as CONTRACT-DWO-PROFILE-V1 specifies while retaining all v1 constants, `assess`, and current direct/non-plan downgrade cases. Author `plan-orchestration.md`, `worker-closure.md`, and `test-value.md` as progressive references over existing surfaces; place the only exact round-one and round-two prompt text in `worker-closure.md`. Do not edit the Executor Plan parser, parser tests, `complete.md`, `fan_in.md`, or `plan.md`. Update existing profile tests with full-plan success, downgrade rejection, non-full rejection, CLI exit, and unchanged generic downgrade cases. Run targeted profile tests plus the unchanged parser suite and validate this current plan as v1. Once the candidate exists, apply the newly written worker-closure reference in the same T1 child, run task smoke, emit one Common Handoff, then perform the papercut soft look.
- [x] T2. Add test-audit capability and exact harness roles
  - completed 2026-08-27-0037
  - Owner: dev-implementation worker
  - Intent: Create the read-only audit specialty and exact two-model native role bindings without running the audit.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-DWO-AUDIT-PACKAGE, TGT-DWO-HARNESS, TGT-DWO-LIVE-OMP
  - Contracts: CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT, CONTRACT-DWO-AUDIT-V1, CONTRACT-DWO-HARNESS
  - Criteria: AC-DWO-08
  - Effects: EFF-DWO-AUDIT-CAPABILITY, EFF-DWO-LIVE-OMP, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T2
  - Receiver: dev-implementation backend
  - Verification: VR-DWO-08
  - Lineage: shared
  - Execution detail: Consume OUTP-T1 and its exact closure/test-value references. Create the skill, audit protocol, shared opinion prompt, and semantic cases `DTA-DISCOVERY`, `DTA-DISCOVERY-NEAR-MISS`, `DTA-INDEPENDENT-PAIR`, `DTA-DISAGREEMENT-EVIDENCE`, `DTA-TRANSPORT-UNAVAILABLE`, `DTA-READ-ONLY`, `DTA-BOUNDED-INDEX`, and `DTA-UNKNOWN-PRESERVED`. Add OMP model roles `test_audit_opinion_a` and `test_audit_opinion_b` with the exact selectors. Agent frontmatter uses the matching `@test_audit_opinion_a` or `@test_audit_opinion_b`, exact agent name, `tools: read, grep, glob`, and `read-summarize: false`; it has no task, write, bash, or fallback. Add Grok inline roles with read-only capability, isolation none, matching logical model/reasoning, and prompt_file `.config/agents/skills/dev-test-audit/references/opinion-agent.md`. Preserve live Grok bytes. Extend bootstrap with backup-before-overwrite handling for future OMP links. For the current live OMP paths, create a symlink only when absent; preserve and record any collision or discovery failure as optional-install evidence, not task failure. Parse all configs and evals, apply worker closure, smoke repository capability, emit one Common Handoff, then perform the papercut soft look. Do not invoke a live audit.
- [x] T3. Cut over semantic fixtures and stale-contract detection
  - completed 2026-08-27-0121
  - Owner: dev-implementation worker
  - Intent: Make semantic evidence distinguish plan-backed child orchestration from the preserved direct and portable plan paths.
  - Methods: none
  - Wave: W2
  - Depends on: T1, T2
  - Targets: TGT-DWO-EVALS
  - Contracts: CONTRACT-DWO-PLAN-V1, CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT, CONTRACT-DWO-AUDIT-V1, CONTRACT-DWO-EVAL-MATRIX, CONTRACT-DWO-COMPLETION
  - Criteria: AC-DWO-12
  - Effects: EFF-DWO-EVALS, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T3
  - Receiver: dev-implementation backend
  - Verification: VR-DWO-12
  - Lineage: shared
  - Execution detail: Consume OUTP-T1 and OUTP-T2. Add exactly the five central DWO fixtures in Target map and update only currently registered cases whose asserted semantics change. Cover plan-backed compact child dispatch, planless direct same-context work, preserved portable fan-in with runtime preserve-or-stop admission, this plan's omitted backend tail plus preserved optional-tail grammar, mechanical parent admission, worker closure, undeclared mutation, changed-hypothesis continuation, test value, two-opinion audit capability, and no one-opinion fallback. Rewrite completion examples and engineering/product/custom/direct normalizers from scalar `papercut` to plural `papercuts`; add multiple-material and scalar-near-miss cases. Add per-work-child papercut, root-fallback, and deterministic-order cases. Keep the parser, `plan.md`, `complete.md`, and `fan_in.md` byte-unchanged. Extend the stale scanner only for truly removed grant/worth/Close state, scalar papercut, root-worker plan fallback, and plan-backed selection of one-owner-sequential; preserve the existing generic direct downgrade token and do not forbid v1, compact plans, optional tails, fan-in, or direct integration. Record the exact selected fixture paths in OUTP-T3, run registry parity/self-tests, apply worker closure, smoke, emit one Common Handoff, then perform the papercut soft look.
- [x] T4. Run one paired serial and hybrid comparison
  - completed 2026-08-27-0215
  - Owner: dev-implementation worker
  - Intent: Produce bounded live evidence for correctness-preserving serial-default or dynamic child scheduling.
  - Methods: none
  - Wave: W3
  - Depends on: T1, T2, T3
  - Targets: TGT-DWO-COMPARISON
  - Contracts: CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT, CONTRACT-DWO-EVAL-MATRIX, CONTRACT-DWO-COMPARISON
  - Criteria: AC-DWO-13
  - Effects: EFF-DWO-COMPARISON, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T4
  - Receiver: dev-implementation backend
  - Verification: VR-DWO-13
  - Lineage: shared
  - Execution detail: Use the fixed T3 fixtures and current native dispatch; make no repository change. Run one fresh serial control child, then one hybrid treatment with distinct slice-A, slice-B, and Build children. Bind the same model, reasoning, repository, fixtures, Task Contract, and acceptance. Enforce the barrier, seed the Build candidate's missing slice-B result, and run `worker-closure/v1` in that same Build child until its permitted closure completes. Record identities, Handoffs, root before/after manifest, outcomes, payload objects/byte counts, monotonic elapsed times, confounders, and cleanup. The T4 child mechanically validates fixture verdict parity, computes the receipt fields, selects exactly one promotion outcome, removes the temporary root, applies worker closure to its own receipt candidate, smokes every hard predicate, emits one Common Handoff, then performs the papercut soft look. No timing threshold, repetition loop, synthetic corpus, root semantic computation, or efficiency claim is allowed.
- [x] T5. Apply the sole canonical D13 cutover
  - completed 2026-08-27-0239
  - Owner: dev-implementation worker
  - Intent: Project the corrected orchestration contract through every active canonical caller in one final mutating task.
  - Methods: none
  - Wave: W4
  - Depends on: T1, T2, T3, T4
  - Targets: TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES, TGT-DWO-TERMINAL
  - Contracts: CONTRACT-DWO-PLAN-V1, CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT, CONTRACT-DWO-ASSURANCE, CONTRACT-DWO-AUDIT-V1, CONTRACT-DWO-HARNESS, CONTRACT-DWO-EVAL-MATRIX, CONTRACT-DWO-COMPARISON, CONTRACT-DWO-COMPLETION, CONTRACT-DWO-CUTOVER
  - Criteria: AC-DWO-01, AC-DWO-02, AC-DWO-03, AC-DWO-04, AC-DWO-05, AC-DWO-06, AC-DWO-07, AC-DWO-09, AC-DWO-10
  - Effects: EFF-DWO-CANONICAL, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T5
  - Receiver: dev-verification
  - Verification: VR-DWO-01, VR-DWO-02, VR-DWO-03, VR-DWO-04, VR-DWO-05, VR-DWO-06, VR-DWO-07, VR-DWO-09, VR-DWO-10
  - Lineage: shared
  - Execution detail: Require T4 `PROMOTE-SERIAL-DEFAULT` or `PROMOTE-DYNAMIC`; apply only its scheduling branch and recorded directional claim. Rehash the closed T5 target inventory and explicitly resolve the four current conflicts: extend `orchestrator-role-profile.md` v1 with plan-backed full/no-downgrade launch while retaining direct/non-plan downgrade behavior; replace `dev-implementation/SKILL.md` plan-backed parent-as-worker and eligible-downgrade language with pure-root child dispatch; make `compact-checklist.md` dispatch every compact-with-plan work owner as a child while preserving planless same-context compact; and replace `dev-ask/WORKFLOW.md` D03 grant/worth/Close route state with changed-hypothesis continuation while keeping direct integration and current portable tail grammar. Revise ADR-0001 D10/D11/D13/D26; ADR-0002 D06/D08/D09/D21; ADR-0003 D03/D04/D22 and add D28 Test portfolio value; ADR-0004 D07; ADR-0007 D24; ADR-0009 D27; update INDEX through D28; create no ADR. Project the same contract through the remaining exact T5 paths: current Context Pack and Common Handoff additions, closure-off-tail, post-Handoff papercut accounting, plural unversioned completion fence, review/TDD/test-value consumers, plan-backed OMP/Grok transport, post-DONE audit routing, and backend assurance. Change only `plan-impl-spec.md` among portable plan grammar files; preserve `plan.md`, parser code/tests, `complete.md`, and `fan_in.md` byte-for-byte. Remove obsolete root-worker plan fallback, sequential-child plan mode, grant counters, worth/Continue/Second-opinion/Close state, and scalar papercut callers without removing compact plans, optional tails, fan-in, direct integration, or generic direct downgrade support. Run the closed stale/caller scan and targeted semantic checks, apply worker closure, smoke every owned criterion, emit one Common Handoff to `dev-verification`, then perform the papercut soft look.


- [x] T6. Close stale semantic caller projections
  - completed 2026-08-27-0440
  - Owner: dev-implementation worker
  - Intent: Close the two fresh review lineages through the finite seven-path caller set without reopening the canonical D13 cutover.
  - Methods: none
  - Wave: W5
  - Depends on: T1, T2, T3, T4, T5, AUTH-DWO-CONTINUATION, AUTH-DWO-CONTINUATION-2, and the sealed repaired-target review and NOT VERIFIED verifier Handoffs
  - Targets: TGT-DWO-CALLER-CLOSURE
  - Contracts: CONTRACT-DWO-PLAN-V1, CONTRACT-DWO-PROFILE-V1, CONTRACT-DWO-CONTEXT, CONTRACT-DWO-CLOSURE-V1, CONTRACT-DWO-TEST-VALUE-V1, CONTRACT-DWO-ATTEMPT, CONTRACT-DWO-HANDOFF, CONTRACT-DWO-PAPERCUT, CONTRACT-DWO-ASSURANCE, CONTRACT-DWO-EVAL-MATRIX, CONTRACT-DWO-COMPLETION, CONTRACT-DWO-CUTOVER, CONTRACT-DWO-CONTINUATION-CLOSURE
  - Criteria: AC-DWO-14
  - Effects: EFF-DWO-CALLER-CLOSURE, EFF-DWO-RUNTIME-EVIDENCE
  - Output: OUTP-T6
  - Receiver: dev-verification
  - Verification: VR-DWO-14
  - Lineage: shared
  - Execution detail: Rehash exactly the seven continuation paths against AUTH-DWO-CONTINUATION before writing. In the registry and matching fixture copies, replace the removed `attempt-or-grant` idempotency tuple and grant counters in `B-FULL`, `B-T5-COMPLETION-ASSURED`, and `B-T5-COMPLETION-MISSING-ASSURANCE` with the already-canonical attempt/continuation semantics; do not restore grant state under another name. Extend `scan_stale_contracts.py` and its self-test so those stale fragments are rejected in active registry/fixture projections without flagging ordinary historical prose. Change both the registry rows and fixture copies for `R-COMPLETE` and `R-COMPLETE-COMPACT-NO-LEARNING` to expect the fixed `Papercuts` label and reject the singular near miss. Preserve every other case and target byte. Apply `test-value/v1`, run same-child `worker-closure/v1`, then run JSON parsing, scanner self-test and normal mode, current registry/file parity, and exactly the five named semantic cases. Emit one Common Handoff referencing AUTH-DWO-CONTINUATION and both closed review lineages; only after sealing it, perform the same-child papercut soft look.
## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-DWO-01 | An approved parser-valid implementation plan is launched, including a compact work-only plan; a planless direct control is also exercised. | The plan path uses current v1 validation, distinct root/work-child identities, full orchestration, downgrade none, and no root target mutation; planned compact remains tail-free; planless direct remains same-context one-owner. | TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES | T5 |
| AC-DWO-02 | Each plan child and eligible attempt two is dispatched through existing transfer/Handoff surfaces. | Context is bounded to the unchanged task/dependencies; attempt two has fresh identity and prior failure frontier; the root checks identities/coverage mechanically and performs no semantic acceptance or repair; no new context/result envelope exists. | TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES | T5 |
| AC-DWO-03 | Shared-tree tasks, portable fan-in, and an undeclared-write case are admitted. | Disjoint work may overlap, declared or unknown overlap serializes, undeclared mutation stops, and unpreservable isolation returns transport-unavailable; v1 compact and fan-in inputs remain structurally valid and direct integration remains unchanged. | TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES | T5 |
| AC-DWO-04 | Work attempt one, eligible attempt two, and Build repair produce candidate results; assurance and audit controls also run. | The same work child executes mandatory round one, conditional round two only after correction, repairs findings, smokes, and emits one Common Handoff; prompts exist only in `worker-closure.md`; verification, review, learning, and audit show no closure. | TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION | T5 |
| AC-DWO-05 | T5 completes and hands the current target to `dev-verification`. | The backend obtains verification, review, and learning on the current target without a numbered task in this plan; a repair gets fresh impacted proof/review; audit availability cannot delay assurance or DONE; generic optional-tail grammar still passes. | TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES, TGT-DWO-TERMINAL | T5 |
| AC-DWO-06 | Every work child completes its Common Handoff and the completion presenter receives zero, one, or multiple material papercut results. | One post-Handoff soft look is accounted per work child; root fallback happens only on child unavailability; existing receipt data is retained; the existing fence accepts ordered `papercuts`, renders none or nested material rows, and rejects scalar input without a versioned compatibility path. | TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-TERMINAL | T5 |
| AC-DWO-07 | Implementation, explicit TDD, review, and audit evaluate changed or proposed permanent tests. | Each retained test names unique observable value, a plausible bug, stable public seam, and independent oracle; existing coverage is reused; duplicate, tautological, subsumed, incidental, implementation-detail, and coverage-only cases are merged or removed. | TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES | T5 |
| AC-DWO-08 | The repository audit package and harness roles are loaded and syntax-checked; optional live OMP paths are inspected. | The specialty and eight eval cases parse; exact OMP/Grok logical bindings name GPT-5.6-sol xhigh and Grok-4.6 xhigh with read-only tools and fallback none; live Grok bytes are unchanged; absent live OMP destinations may become symlinks, while collisions/discovery failure are preserved and reported without failing repository capability. | TGT-DWO-AUDIT-PACKAGE, TGT-DWO-HARNESS, TGT-DWO-LIVE-OMP | T2 |
| AC-DWO-09 | A task exhausts attempts and receives bare continue, unchanged hypothesis, and explicit changed-hypothesis inputs. | Only explicit changed-hypothesis authority creates a continuation receipt and fresh attempt cycle; all other inputs are no-ops or stops; one repair token remains inherited; no grant counter, worth frame, Second-opinion/Close menu, or exhaustion-record grammar remains. | TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES | T5 |
| AC-DWO-10 | T5 applies the closed canonical target map after a valid T4 promotion. | Active ADRs and projections agree; ADR-0003 contains D28 and no new ADR exists; the four named live conflicts are resolved; v1 identifiers, `plan.md`, parser/tests, `complete.md`, `fan_in.md`, compact-plan validity, optional tails, direct integration, and generic direct downgrade controls remain unchanged. | TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES, TGT-DWO-TERMINAL | T5 |
| AC-DWO-11 | T1 exercises current profile mechanics, the new plan-backed assessment, and the three private references. | Existing v1 schemas and generic downgrade tests still pass; plan-backed full/no-downgrade passes; plan-backed downgrade/non-full cases return transport-unavailable; parser preservation controls are byte-identical and validate; each prompt appears only in worker closure. | TGT-DWO-MECHANICS, TGT-DWO-PRIVATE-REFS | T1 |
| AC-DWO-12 | Changed semantic registries and scanner cases are run after T1/T2. | The five central DWO fixtures and eight audit-package cases exist; current registry/file parity holds; new orchestration semantics pass; compact, fan-in, optional-tail, and direct controls pass; stale removed behavior fails; no frozen global fixture count or unowned support-file mutation is introduced. | TGT-DWO-EVALS | T3 |
| AC-DWO-13 | One controlled serial/hybrid pair runs against the two fixed T3 fixtures. | Correctness/acceptance parity, distinct subject identities, root non-mutation, barrier order, seeded same-Build closure, lower hybrid coordinating payload, and cleanup all pass; receipt is PROMOTE-DYNAMIC or PROMOTE-SERIAL-DEFAULT; timing is directional or inconclusive with no general efficiency claim. | TGT-DWO-COMPARISON | T4 |
| AC-DWO-14 | AUTH-DWO-CONTINUATION is applied to the exact seven-path T6 manifest after the repaired-target review. | `B-FULL` and both `B-T5-COMPLETION-*` registry/fixture copies use current attempt/continuation semantics with no grant counters or `attempt-or-grant` tuple; the stale scanner self-test and normal mode detect those obsolete active projections without flagging ordinary historical prose; both `R-COMPLETE*` registry/fixture copies require `Papercuts`; current parity and all five semantic cases pass; REV-DWO-R2-001 and REV-DWO-R2-002 close; the final target has 81 files and every non-T6 target byte is preserved. | TGT-DWO-CALLER-CLOSURE | T6 |

## Verification / Done criteria

- [x] VR-DWO-01. Prove plan-backed activation and direct-path separation.
  - Criterion: AC-DWO-01
  - Proof class: Live route trace plus identity and mutation check
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, exercise the standard plan-backed full route, a compact work-only v1 plan, a missing/full-capability mismatch, and the planless `L-ONE-OWNER` direct control through the semantic harness. Capture root and work-child IDs, profile decision, downgrade value, task owner, and target manifests.
  - Evidence form: Plan cases show distinct child ownership and no root mutation; missing capability is transport-unavailable; planned compact dispatches child work without a tail; planless direct enters no plan gate.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, and TGT-DWO-PLAN-RULES against OUTP-T5.
  - Receiver: dev-verification
- [x] VR-DWO-02. Prove bounded existing Context Packs and mechanical Handoff admission.
  - Criterion: AC-DWO-02
  - Proof class: State-transition and projection conformance
  - Scenario / environment / fixture: Exercise first attempt, eligible fresh attempt two, undeclared mutation, unrelated dependency, and transcript-injection near misses. Compare the unchanged Task Contract and exact prior-failure frontier across attempts.
  - Evidence form: Bounded current Context Packs, Common Handoffs, fresh child IDs, unchanged contract digest, inherited repair state, and rejection traces for unrelated/transcript/undeclared input; no new envelope or parent semantic verdict.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, and TGT-DWO-PLAN-RULES and resolve every referenced private-reference digest.
  - Receiver: dev-verification
- [x] VR-DWO-03. Prove shared-tree admission while preserving portable fan-in.
  - Criterion: AC-DWO-03
  - Proof class: Existing parser tests plus controlled runtime scenarios
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`. Validate `complete.md`, `fan_in.md`, and a compact work-only case. Exercise disjoint ready tasks, declared overlap, unknown overlap, exclusive resource, barrier, undeclared write, and unpreservable isolation through the runtime semantic cases.
  - Evidence form: Valid `executor-plan-validation/v1` results for preserved fixtures; scheduler trace showing overlap/unknown serialization, undeclared-write stop, isolation transport stop, and unchanged direct `dev-integration`.
  - Target recheck: Verify the preserved parser, parser test, `complete.md`, and `fan_in.md` digests equal their pre-execution values; rehash TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, and TGT-DWO-PLAN-RULES.
  - Receiver: dev-verification
- [x] VR-DWO-04. Prove same-child closure only on work and Build repair.
  - Criterion: AC-DWO-04
  - Proof class: Seeded omission plus role-negative controls
  - Scenario / environment / fixture: Run `B-DWO-WORKER-CLOSURE` and T4's one hybrid Build. Seed missing slice B, invoke round one in the same Build child, require its concrete correction, invoke round two only if that correction occurred, then smoke. Exercise verification, review, learning, audit-controller, and audit-opinion controls.
  - Evidence form: Stable work-child identity, closure protocol digest, finding/correction rows, permitted round count, final smoke, one Common Handoff, role controls with no closure, and repository search proving prompt text exists only in `worker-closure.md`.
  - Target recheck: Rehash TGT-DWO-ADRS and TGT-DWO-IMPLEMENTATION; compare every work Handoff's closure identity with the final reference digest.
  - Receiver: dev-verification
- [x] VR-DWO-05. Prove T6-to-backend continuation assurance without audit coupling.
  - Criterion: AC-DWO-05
  - Proof class: Deterministic backend state trace
  - Scenario / environment / fixture: Starting with the OUTP-T5 repaired-target review blocker, resolve AUTH-DWO-CONTINUATION and accepted OUTP-T6, then trace fresh `dev-verification`, successful review, and terminal learning. Confirm the original repair token remains consumed and no post-T6 repair transition exists. In separate controls, make audit discovery unavailable and validate an existing optional-tail plan.
  - Evidence form: T6 receiver `dev-verification`; continuation receipt; current-target proof/review/learning identities; no restored repair token; plan DONE despite audit transport failure; optional-tail v1 fixture still valid.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES, and TGT-DWO-TERMINAL; confirm this plan has exactly T1–T6 while preserved optional-tail fixtures remain byte-identical.
  - Receiver: dev-verification
- [x] VR-DWO-06. Prove post-Handoff papercut accounting and plural presentation.
  - Criterion: AC-DWO-06
  - Proof class: Cross-package semantic matrix
  - Scenario / environment / fixture: Exercise work-child none/material results, child-unavailable root fallback, attempt two, Build repair, multiple material results, none-only completion, scalar near miss, `R-COMPLETE`, and `R-COMPLETE-COMPACT-NO-LEARNING` across papercut, completion, product, custom, and engineering cases.
  - Evidence form: One Common Handoff followed by one existing compact papercut result per work child; fallback only for unavailable; ordered material array; `Papercuts: none` or nested material bullets; scalar and singular-label rejection; no versioned fence or second completion envelope.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, and TGT-DWO-TERMINAL; compare all changed registries with OUTP-T3 and the final assurance evidence.
  - Receiver: dev-verification
- [x] VR-DWO-07. Prove shared test-value decisions.
  - Criterion: AC-DWO-07
  - Proof class: Behavioral decision matrix
  - Scenario / environment / fixture: Run `B-DWO-TEST-VALUE`, `B-FULL`, `B-T5-COMPLETION-ASSURED`, explicit-TDD controls, review cases, and audit value cases over unique regression, existing coverage, duplicate, subsumed, tautological, implementation-coupled, incidental snapshot, independent-oracle, and redundant tracer inputs.
  - Evidence form: Common Handoff changed-test rows and audit dispositions naming observable contract, plausible unique bug, seam, oracle, evidence, and keep/merge/remove result; TDD red/green proof survives consolidation; no changed-test oracle depends on removed grant state.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, and TGT-DWO-PLAN-RULES; account for every permanent test changed by T1–T6.
  - Receiver: dev-verification
- [x] VR-DWO-08. Prove repository audit capability and exact harness bindings.
  - Criterion: AC-DWO-08
  - Proof class: Syntax, semantic eval, role identity, and preservation checks
  - Scenario / environment / fixture: Run `python3 -m json.tool .config/agents/skills/dev-test-audit/evals/evals.json`, parse `.config/agents/harnesses/grok/config.toml` with Python `tomllib`, run `bash -n .config/scripts/bootstrap`, inspect both OMP agent frontmatters/tool allowlists and both OMP/Grok role mappings, and run all eight audit-package semantic cases. Inspect current live OMP destinations and rehash live Grok config.
  - Evidence form: Passing syntax/evals; exact selectors, names, xhigh reasoning, read-only tools, and fallback none; optional live-link outcome recorded as linked/skipped-collision/discovery-unavailable; live Grok SHA-256 unchanged.
  - Target recheck: Rehash TGT-DWO-AUDIT-PACKAGE, TGT-DWO-HARNESS, and TGT-DWO-LIVE-OMP; when links exist, resolve them to repository agent sources; compare live Grok with its pre-task digest.
  - Receiver: dev-implementation backend
- [x] VR-DWO-09. Prove bounded continuation and removal of grant state.
  - Criterion: AC-DWO-09
  - Proof class: Finite transition-system semantic eval
  - Scenario / environment / fixture: Exercise attempt one/two exhaustion, bare continue, unchanged hypothesis, explicit changed falsifiable hypothesis, repeated explicit authorization, semantic authority change, consumed repair token, `B-FULL`, `B-T5-COMPLETION-ASSURED`, and `B-T5-COMPLETION-MISSING-ASSURANCE`.
  - Evidence form: Attempt/child IDs, blocker Common Handoff, continuation receipt and cycle when eligible, inherited consumed token, exact no-op or authority-change result, and absence of grant/worth/Second-opinion/Close/exhaustion-record transitions and active grant-state oracles.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-IMPLEMENTATION, and TGT-DWO-PLAN-RULES; run the stale scanner self-test and normal mode over active registry/fixture projections without flagging ordinary historical prose.
  - Receiver: dev-verification
- [x] VR-DWO-10. Prove finite D13 cutover and continuation caller closure.
  - Criterion: AC-DWO-10
  - Proof class: Closed caller scan plus targeted behavior controls
  - Scenario / environment / fixture: Run `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test` and normal mode; run `compare_trace.py --self-test` and `observe_case.py --self-test`; parse changed registries; validate this plan; exercise planless direct, compact-with-plan, optional-tail, portable fan-in, direct-integration, and all five T6 cases.
  - Evidence form: Zero stale/required-contract failures, closed T5 canonical manifest, closed T6 seven-path manifest, active INDEX through D28, no new ADR, four conflict resolutions, both review lineages closed, all controls passing, and no unauthorized changed path.
  - Target recheck: Rehash TGT-DWO-ADRS, TGT-DWO-ROUTER, TGT-DWO-IMPLEMENTATION, TGT-DWO-PLAN-RULES, and TGT-DWO-TERMINAL against OUTP-T5; prove `.config/agents/rules/plan.md`, the parser/test, `complete.md`, and `fan_in.md` equal their preservation-control digests.
  - Receiver: dev-verification
- [x] VR-DWO-11. Prove v1 profile extension and private references.
  - Criterion: AC-DWO-11
  - Proof class: Targeted Python unit and reference-integrity checks
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_orchestrator_profile.py`; run the unchanged executor-plan test program; run the new CLI against full/no-downgrade, approved-generic-downgrade, and non-full fixtures; validate `.agents/plans/2026-08-26-2157_dev-workflow-orchestration-test-value.md`.
  - Evidence form: Existing v1 schema values in every result; new plan-backed success and transport-unavailable cases; unchanged generic one-owner assessment behavior; current plan valid as Executor Plan v1; three private-reference digests; prompt uniqueness scan.
  - Target recheck: Rehash TGT-DWO-MECHANICS and TGT-DWO-PRIVATE-REFS; prove all parser/plan preservation controls unchanged.
  - Receiver: dev-implementation backend
- [x] VR-DWO-12. Prove semantic fixture closure without a frozen global inventory.
  - Criterion: AC-DWO-12
  - Proof class: Registry parsing, comparator self-tests, and current-ID parity
  - Scenario / environment / fixture: Parse every changed JSON registry; run `observe_case.py --self-test`, `compare_trace.py --self-test`, and `scan_stale_contracts.py --self-test`; compute registry-to-file parity from current bytes; run the five central DWO and eight audit-package cases plus changed compact/fan-in/tail/continuation/papercut controls and exactly `B-FULL`, both `B-T5-COMPLETION-*`, and both `R-COMPLETE*` cases.
  - Evidence form: Parse/self-test receipts, current selected-path manifest, exact new and continuation case IDs, one-to-one current parity, expected semantic verdicts, scanner rejection of stale active projections, and preservation digests for unowned support files.
  - Target recheck: Rehash TGT-DWO-EVALS against OUTP-T3; prove parser, portable grammar, and every non-T6 target preservation control unchanged.
  - Receiver: dev-implementation backend
- [x] VR-DWO-13. Prove one-pair comparison promotion evidence.
  - Criterion: AC-DWO-13
  - Proof class: One controlled paired live comparison
  - Scenario / environment / fixture: Resolve the sealed T4 receipt and native subject artifacts; independently recompute fixture/result parity, subject identity distinctness, barrier order, seeded-finding correction, root before/after manifest, counted payload bytes, monotonic pair timing, confounder classification, promotion branch, and cleanup.
  - Evidence form: One serial row, one hybrid row, subject locators/digests, lower hybrid coordinating payload, one exact promotion value, directional/inconclusive timing statement, and cleanup proof; no repetition median, percentage threshold, synthetic corpus, or efficiency claim.
  - Target recheck: Resolve and hash TGT-DWO-COMPARISON; prove the temporary root is absent, sealed receipt remains, and no repository target changed during T4.
  - Receiver: dev-implementation backend

- [x] VR-DWO-14. Prove the finite authority-change caller closure.
  - Criterion: AC-DWO-14
  - Proof class: Exact seven-path manifest, semantic fixtures, and stale-scanner boundary
  - Scenario / environment / fixture: Rehash TGT-DWO-CALLER-CLOSURE against AUTH-DWO-CONTINUATION; parse the registry and five fixture files; run `scan_stale_contracts.py --self-test` and normal mode; compute exact registry/file parity; run exactly `B-FULL`, `B-T5-COMPLETION-ASSURED`, `B-T5-COMPLETION-MISSING-ASSURANCE`, `R-COMPLETE`, and `R-COMPLETE-COMPACT-NO-LEARNING`.
  - Evidence form: Seven before/after digests; zero unauthorized paths; no active grant-state oracle; plural presenter goldens; scanner boundary proof; five expected semantic verdicts; closed REV-DWO-R2-001/002; expanded 81-file target identity; changed-test dispositions.
  - Target recheck: Rehash TGT-DWO-CALLER-CLOSURE against OUTP-T6 and compare every other accepted target byte with the repaired 79-file manifest.
  - Receiver: dev-verification
## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | Profile mechanics manifest; v1 unit and preservation receipts; three private-reference digests; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | Existing Common Handoff with plan-backed assessment evidence, unchanged v1/generic downgrade evidence, child/attempt/closure provenance, changed-test decision, and exact T2/T3/T4/T5 dependency references. |
| OUTP-T2 | T2 | Audit-package and harness manifests; optional live-link receipt; syntax/eval evidence; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | Existing Common Handoff with exact role selectors/tool limits, repository capability verdict, optional link outcome, live Grok preservation proof, child/attempt/closure provenance, and changed-test decision. |
| OUTP-T3 | T3 | Eval target manifest; selected current fixture paths; registry/self-test receipts; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | Existing Common Handoff with current registry parity, five central and eight audit case identities, preservation-control equality, child/attempt/closure provenance, and changed-test dispositions. |
| OUTP-T4 | T4 | Sealed `local://dwo-orchestration-comparison-receipt.json`; native subject locators; cleanup proof; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | Existing Common Handoff with one promotion outcome, serial/hybrid rows, directional or inconclusive timing, payload bound, distinct child identities, seeded repair, main-root non-mutation, cleanup, task closure, and test decision. |
| OUTP-T5 | T5 | Final canonical target manifest; D13 caller/preservation manifest; targeted check receipts; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-verification | Existing Common Handoff with final repository target identity, applied promotion branch, AC-DWO-01 through AC-DWO-10 owned verdicts excluding T2's AC-DWO-08, final profile/reference identities, child/attempt/closure provenance, and changed-test rows. |
| OUTP-T6 | T6 | Expanded 81-file repository target identity; exact seven-path before/after manifest; targeted registry, scanner, parity, and five-case receipts; one Common Handoff; current post-Handoff papercut result | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-verification | Existing Common Handoff referencing AUTH-DWO-CONTINUATION, closed REV-DWO-R2-001 and REV-DWO-R2-002 evidence, exact child/attempt/closure provenance, target preservation, changed-test dispositions, and current final target identity. |

A numbered task completes only when its owned criteria and recipes pass, its target is stable, its one Common Handoff is mechanically accepted, and its post-Handoff papercut result is accounted. A child conclusion alone is not proof. Any non-success preserves completed Handoffs and the exact remaining frontier and keeps the plan IN_PROGRESS.

T6 is the last numbered task. After OUTP-T6, the backend runs fresh current-target verification, one current-target review, and terminal learning. `DONE` requires those normal gates, every T1–T6 task and recipe checked with completion records, settled work-child papercut accounting, zero unresolved implementation blocker, final lifecycle fields, and the existing completion fence with `papercuts`.

After DONE is sealed, the same top-level session routes `dev-ask` → `dev-test-audit` against the immutable completed target. That read-only specialty emits its own Common Handoff with both exact opinions and aggregate candidates, or a precise `transport-unavailable` Handoff. This post-plan result is linked from the final session report but is not an OUTP-T* artifact, does not change plan status, does not trigger worker closure or assurance repair, and cannot authorize cleanup. Stop after the audit result; any test cleanup requires a separately approved plan, and every `unknown` remains non-deletable.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-DWO-AUTHORITY | Child discovering unexpected drift | Pre-write owned-target manifest, unexpected changed paths/digests, current dependency Handoffs, and one `authority-change-required` Common Handoff | all | AUTH-DWO-REVISION, AUTH-DWO-R2, AUTH-DWO-CONTINUATION, and the active plan revision | Human approves a revised plan or explicitly rebinds the preserved revision; root does not infer permission. |
| BLK-DWO-BOOTSTRAP-TRANSPORT | dev-implementation backend | Current `orchestrator-attestation/v1`, current assessment, profile downgrade value, and concrete missing/mismatched native capability | all | Current orchestrator-role-profile/v1 plus this plan's bootstrap rule | Current assessment is live-attested `full-orchestration` and downgrade is `none`; no not-yet-built gate, root leaf, or sequential-child rescue is allowed. |
| BLK-DWO-WORK-EXHAUSTED | dev-implementation backend | Attempt-one/two Common Handoffs, direct failure evidence, progress comparison, remaining criteria, target digest, and repair-token state | T1, T2, T3, T4, T5, T6 | Same unchanged Task Contract or a revised plan | Human explicitly authorizes this exact plan with a changed falsifiable hypothesis, producing the continuation receipt; otherwise the plan remains IN_PROGRESS. |
| BLK-DWO-ASSURANCE | dev-implementation backend | Fresh verifier or reviewer Handoff mapped to fixed acceptance/contract, current target, impacted task IDs, and consumed repair-token state | all | AUTH-DWO-CONTINUATION-2 and current target | The explicit changed hypothesis admits only T6 attempt two on its one-path delta. No repair remains; any later blocker preserves IN_PROGRESS and requires new explicit human authority. |
| BLK-DWO-COMPARISON | T4 | Serial/hybrid artifacts, failed hard predicate, target manifest, payload arithmetic, timing/confounder observation, and cleanup state | T4, T5 | CONTRACT-DWO-COMPARISON | A T4 attempt passes every hard predicate; timing may be directional or inconclusive and cannot be weakened into an efficiency claim. |
| BLK-DWO-COMPARISON-CLEANUP | T4 | Temporary local-root inventory, preserved sealed receipt, failed removal evidence, and repository no-mutation proof | T4, T5 | EFF-DWO-COMPARISON | The named temporary root is removed without deleting the sealed receipt or unrelated local artifacts. |

No implementation blocker becomes a fallback topology, root task, broader target set, hidden repair, test deletion, audit substitute, or shipping action. The root records one blocker Common Handoff, leaves the plan IN_PROGRESS, and retains completed artifacts for exact continuation. Optional live OMP link/discovery outcomes are T2 evidence, not blockers. After DONE, an audit `transport-unavailable` Handoff is a post-plan stop and never changes these task or assurance states.

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-DWO-REVISION | Current human correction | Current conversation revision handoff beginning `The plan is structurally valid as Executor Plan v1` | Removes the unauthorized schema family, grammar bans, self-hosting gate, numbered audit task, and oversized comparison from the prior plan revision. |
| ANC-DWO-CONTINUATION | Current human continuation | local://dwo-authority-change-continuation-r3.json@sha256:dbf6b77891833a1af5c035fa0f2d17f313eababb334998439c17d18471c0c481 | Binds the pre-revision plan and repaired 79-file target, REV-DWO-R2-001/002, exact seven-path T6 manifest, fresh attempt boundary, consumed repair token, and fresh standard assurance route. |
| ANC-DWO-CONTINUATION-2 | Current human attempt-two continuation | local://dwo-t6-attempt-two-authority.json@sha256:1bbf8e4a9134281127deaf7fdcbf3c2bb81a92379f27f0cc07f6eb1d013521e7 | Binds the NOT VERIFIED 81-file target, AC-DWO-12/14 parity blocker, exact one-path attempt-two delta, unchanged T6 Task Contract, consumed repair token, and fresh assurance route. |
| ANC-DWO-HANDOFF | Approved authority | HANDOFF-DWO-PLAN-20260825-r2 | Primary semantic source after applying ANC-DWO-REVISION. |
| ANC-DWO-DECISIONS | Approved authority | local://dev-workflow-orchestration-test-value-decisions.md@sha256:7f829a03c83960f125b4342c614a0891379df26962206359343aa15992b316e5 | Binds the unchanged r2 decisions. |
| ANC-DWO-PLAN | Active execution artifact | .agents/plans/2026-08-26-2157_dev-workflow-orchestration-test-value.md | Sole repository execution and continuation locator after proposal sync; Datetime and slug remain immutable. |
| ANC-DWO-PROFILE | Existing launch contract | `.config/agents/skills/dev-implementation/references/orchestrator-role-profile.md`; `.config/agents/skills/dev-implementation/scripts/orchestrator_profile.py` | Bootstrap uses current v1; T1 adds the plan-backed assessment; T5 updates the canonical reference. |
| ANC-DWO-PLAN-GRAMMAR | Existing portable contract | `.config/agents/rules/plan.md`; `.config/agents/rules/plan-impl-spec.md`; v1 parser and `complete.md`/`fan_in.md` fixtures | `plan.md`, parser, and fixtures are preservation controls; only the implementation companion gains shared-tree admission policy. |
| ANC-DWO-HANDOFF-SURFACE | Existing transfer contract | `.config/agents/skills/dev-handoff/SKILL.md#Common-Handoff`; `.config/agents/skills/dev-implementation/SKILL.md#Context-Pack` | Extend in place; no versioned Context Pack or child-completion envelope. |
| ANC-DWO-PAPERCUT | Existing receipt lifecycle | `.config/agents/skills/papercut/SKILL.md`; `.config/agents/skills/papercut/WORKFLOW.md`; `.config/agents/skills/completion-presentation/SKILL.md` | Reuse the post-Handoff soft look/result and rename only the completion field to plural. |
| ANC-DWO-OMP-DOC | Transport evidence | omp://task-agent-discovery.md | Native exact-name custom agents, `@role` expansion, runtime rediscovery, output-schema precedence, depth, and spawn guards. |
| ANC-DWO-GROK-DOC | Transport evidence | https://docs.x.ai/build/features/subagents and xai-org/grok-build source commit 77cd7eb | Native inline role fields, read-only capability, isolation none, prompt_file, and current model inventory boundary. |
| ANC-DWO-OMP-LIVE | Observed live state | `/Users/kim/.omp/agent/config.yml` projects repository config; both opinion-agent paths were absent on 2026-08-26 | Recheck before optional collision-safe link creation; discovery/link failure cannot gate canonical work. |
| ANC-DWO-GROK-LIVE | Observed live state | `/Users/kim/.grok/config.toml` is a regular diverged file at sha256:1c1e7ecfedff4cd095e86905c5001b79d96e134ea1aeffac3780875b0656eaa2 | Must remain byte-unchanged; repository Grok role config is future-bootstrap source only. |
| ANC-DWO-COMPARISON | Promotion authority | CONTRACT-DWO-COMPARISON and `local://dwo-orchestration-comparison-receipt.json` | One-pair hard correctness/payload/cleanup gate and serial-default/dynamic branch. |
| ANC-DWO-AUDIT | Post-plan boundary | CONTRACT-DWO-AUDIT-V1 and the post-DONE audit Common Handoff | Audit is read-only, separately routed, non-gating, and never cleanup authority. |
| ANC-DWO-NO-SHIPPING | Effect boundary | AUTH-DWO-R2 and ADR-0001 D14 | No stage, commit, push, review request, release, deploy, rollout, force operation, or broad bootstrap. |

- ASM-DWO-BOOTSTRAP: Current native OMP is expected to satisfy the existing v1 full-orchestration assessment. If it does not, stop before T1; do not use the T1 implementation as a precondition or let the root perform leaf work.
- ASM-DWO-LIVE-LINKS: Optional OMP links improve same-session audit discovery but are not required for repository capability, T5 cutover, assurance, or DONE; collision is preserved and reported.
- ASM-DWO-COMPARISON: One paired observation selects only the runtime default for this contract. A confounded or inconclusive observation selects serial-default and supports no efficiency claim.
- ASM-DWO-AUDIT: The post-plan audit may return `transport-unavailable`; that leaves the plan DONE. No audit finding carries cleanup authority, and unknown is never deletion authority.


## Completion Summary

- Outcome: `OUT-DWO-PLAN-01` completed on immutable 81-file target `sha256:472e3dcdd48c2499fe90d907cc18f6b3d8684422aa92f244b34396533913f44a`.
- Delivered: plan-backed full child orchestration with `downgrade: none`; pure-root control; same-child worker closure; shared-tree admission; value-gated permanent tests; plural ordered `papercuts`; bounded changed-hypothesis continuation; exact OMP/Grok read-only audit roles; and a separately routed post-DONE two-opinion audit capability. Planless direct work, compact plans, optional tails, portable fan-in, direct integration, and generic direct downgrade remain available.
- Scheduling decision: the controlled T4 pair selected `PROMOTE-SERIAL-DEFAULT`. The result sets only this workflow's runtime default and supports no general efficiency claim.
- Continuation: AUTH-DWO-CONTINUATION and AUTH-DWO-CONTINUATION-2 closed the finite caller set and the final one-path registry/fixture parity defect. T6 ordinary attempts are consumed `2/2`; the run-wide repair remains consumed `1/1`; no third attempt or later repair exists.
- Verification: `VERIFIED` for AC-DWO-01 through AC-DWO-14 with 149/149 declared bindings exact before and after proof, 33/33 semantic cases, 5/5 required registry/fixture parity rows, and stable target bytes. Evidence: `local://dwo-t6-attempt-two-verification-evidence.json@sha256:ed04d8d9af905bb7298499eddd47a8c6cef56c9b03c74a278c31049fd4d50b7f`; Handoff: `local://dwo-t6-attempt-two-verification-handoff.md@sha256:23ce9370527a780f4ed9dcf84a9678c9a445d13dfd104e3b7a41ab9e10093118`.
- Review: `APPROVED`; Standards `PASS`; Specification `PASS`; REV-DWO-001, REV-DWO-002, REV-DWO-R2-001, REV-DWO-R2-002, and `VR-BLOCK-DWO-REGISTRY-FIXTURE-PARITY` are closed; 90/90 changed permanent-test rows have current `keep` dispositions. Evidence: `local://dwo-t6-attempt-two-review-evidence.json@sha256:b4794784c3bb814f6b82d1047c85ac2baae80ea7eae581bc833c77c83f23e2b2`; Handoff: `local://dwo-t6-attempt-two-review-handoff.md@sha256:4a73070a19ef54b81e152440a3b04597eff3e570f501968c5c23629ca691c63a`.
- Learning: `NO DURABLE LEARNING`; both residual items were assessed as incomplete, with no complete candidate, mutation authority, qualifying Deep trigger, or papercut settlement. Handoff: `local://dwo-terminal-learning-handoff.md@sha256:3c93fa5dfe88768696421b21cd91f5b922c0dcbc9f049cd2793185fe84dc2154`.
- Residual risk: none within the approved implementation and finite consumer maps. The post-plan audit may still return `transport-unavailable`; it is read-only, non-gating, and cannot reopen this `DONE` state or authorize cleanup.
- Shipping: not authorized and not performed.
