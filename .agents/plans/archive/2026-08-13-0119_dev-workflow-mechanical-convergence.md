# Mechanical convergence for the generic dev workflow

**Datetime**: 2026-08-13-0119
**Authority kind**: local-authority
**Scope**: Generic dev-workflow convergence state, attempt and assurance mechanics, OMP and Grok adapters, recovery, and papercut-compatible terminal accounting
**Summary**: Implement one portable fail-closed convergence state engine with instance-specific OMP and Grok adapters, revision-invariant budgets, an affected-boundary feedback ladder, coalesced asynchronous observation, compact recovery, and targeted semantic proof while preserving current papercut, product, memory, shipping, and plan authority boundaries.
**Status**: CLOSED

## Execution gate

```json
{"version":1,"authority":{"kind":"omp-local","uri":"local://dev-workflow-mechanical-convergence-plan.md"},"bindings":[],"blockers":[]}
```

## Route Overview

Goal: Turn the confirmed dev-workflow convergence decisions into executable, provider-neutral behavior without creating another lifecycle skill, repository runtime ledger, or artifact ceremony.

Route: `dev-implementation → dev-verification → dev-code-review → dev-continual-learning → dev-ask completion presentation`.

Execution is one qualified implementation owner working T1 through T5 sequentially, followed by T6 assurance. The implementation is high-consequence because it changes workflow state, concurrency, recovery, and harness gates. Its own final verification and review therefore remain ordered even though T2 implements standard-assurance speculative review for later eligible runs. No implementation, staging, commit, push, release, deployment, or real papercut-ledger mutation is authorized by plan approval.

## Objective

- Outcome: OUT-DEV-WORKFLOW-MECHANICAL-CONVERGENCE
- Observable end state: every AC-CONV criterion passes on one exact target; a newly approved dev run in OMP or Grok uses one canonical adapter-owned state snapshot, cannot reset semantic attempts or repair by revising authority, cannot resume orchestration from unchanged nonterminal delegate observations, accounts for the feedback ladder before costly seams, preserves review ordering rules, and recovers only from an exact run reference plus fresh `dev-ask` rebind.
- Progress signal: one named AC-CONV observable, one named blocker resolution, or an authorized revision change. More files, attempts, agents, reviews, Handoffs, state generations, repeated status observations, or elapsed time alone is not progress.
- Current-run bootstrap boundary: this plan is the legacy implementation run that creates the new mechanism. It continues under its approved plan lifecycle and must not fabricate a pre-existing convergence snapshot. T5 proves a disposable newly approved run through the new mechanism; only later newly approved work is required to self-host it.
- Completion boundary: T1 through T5 complete with exact-revision smoke; T6 independently verifies the final target, obtains one separate final review, runs terminal Standard learning, and accounts for all effects and preserved surfaces.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-USER-CONVERGENCE | human decision evidence | `local://dev-workflow-atlas-convergence-decision-evidence.md` | SHA-256 `80c46c0d60d899c96519805f426473238ef9b20e36c812c23b6fb4d120e07274` | Confirmed decisions 1 through 12; implementation requires approval of this plan |
| AUTH-GRILL-HANDOFF | engineering decision Handoff | `local://dev-workflow-atlas-convergence-grilling-handoff.md` | SHA-256 `48965a452a6c81d5319e88fdc485bc813bfd4645509f31bb137718001ee33662` | Route impact changed; exact implementation authority intentionally deferred to this plan |
| AUTH-WORKFLOW-CURRENT | current repository authority | `docs/adr/INDEX.md`, active ADR-0001 through ADR-0004, `.config/agents/skills/dev-ask/WORKFLOW.md` | Working bytes inspected 2026-08-13 before plan publication | Preserve semantic owners; revise only the decisions named here after approval |
| AUTH-PAPERCUT-CURRENT | current repository authority | ADR-0007, `.config/agents/rules/papercut.md`, `.config/agents/skills/papercut/`, `.agents/papercuts.json` | Current user-modified v2 framework inspected 2026-08-13 | Preservation authority; no redesign, migration, or production-ledger write |
| AUTH-HARNESS-OMP | installed harness contract | OMP 17.2.15 docs plus `.config/agents/harnesses/omp/config.yml` | Current installed extension API inspected 2026-08-13 | Implement only documented extension events, custom tools, session-local identity, and storage seams |
| AUTH-HARNESS-GROK | installed harness contract | Grok 1.0.3 docs/source plus `.config/agents/harnesses/grok/config.toml` | Current plugin, MCP, and hook contracts inspected 2026-08-13 | Implement provider-specific plugin/MCP/hook mechanics and disclose hook fail-open limits |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-CONV-DIRECT | Confirmed decision 1 at AUTH-USER-CONVERGENCE | Settled one-context work stays with one implementation owner; assurance alone never adds requirements, specification, ticketing, or planning stages |
| DEC-CONV-STATE | Confirmed decisions 2, 3, and 9 | `dev-implementation` owns one portable state schema; adapters store one atomic snapshot; outcome identity survives revisions; missing, stale, unreadable, or conflicting state blocks active-run dispatch and recovery never scans miscellaneous artifacts |
| DEC-CONV-BUDGET | Confirmed decisions 4 and 5 | Each immutable outcome plus owned-criterion frontier has one initial semantic attempt and at most one evidence-backed changed-approach retry; the outcome has one repair; the ordered feedback ladder gates expensive seams and the sole repair; adapters coalesce unchanged nonterminal delegate observations below the model instead of treating them as progress or new turns |
| DEC-CONV-PAYLOAD | Confirmed decisions 6 and 12 | Attempt payloads stay structured and ephemeral unless recovery or an external durable receiver requires materialization; terminal storage retains one compact state snapshot and one terminal or recovery Handoff |
| DEC-CONV-REVIEW | Confirmed decision 7 | Standard assurance may run distinct verifier and reviewer identities concurrently against one immutable target, but review remains quarantined until verification; compact and high-consequence remain ordered |
| DEC-CONV-APPROVAL | Confirmed decisions 8 and 11 | Approval binds one route revision and effect set, never unseen material changes or restored budgets; legacy active runs require a clean Handoff and explicit fresh `dev-ask` rebind |
| DEC-CONV-TOPOLOGY | Confirmed decision 10 | Deepen existing semantic owners and add no convergence skill, merged assurance role, stateful router, or second result envelope |
| ADR-0007 | ACTIVE D24 current working revision | Papercut qualification, v2 ledger, candidate delivery, exact-record settlement, and helper ownership remain separate from convergence state |

## Scope, non-goals, and prohibited effects

- Read surfaces: confirmed decision evidence and Handoff; active dev workflow, ADRs, skills, profiles, evals, and recovery contracts; current papercut v2 boundary; installed OMP and Grok adapter APIs/configuration; plan and repository guidance needed to prove preservation.
- Change surfaces: named TGT-CONV repository targets only after native approval; adapter-owned disposable runtime state and exact test fixtures during smoke.
- Non-goals: product/custom workflow redesign, papercut v2 redesign or migration, memory/tracker/plan/todo/bootstrap/manifest changes, a new lifecycle role or convergence skill, automatic migration of active legacy runs, provider/model/account changes, or delivery.
- Prohibited effects: production papercut-ledger mutation; user-level guidance or Mnemopi mutation; credential or external-service access; staging, commit, push, review request, release, deployment, rollout, tracker mutation, or unrelated-work overwrite.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-CONV-REPO | permitted repository write | AUTH-USER-CONVERGENCE after plan approval | Only named TGT-CONV targets; preserve unrelated and concurrent user changes; every edit is locally reversible |
| EFF-CONV-ADAPTER | permitted harness activation | AUTH-HARNESS-OMP and AUTH-HARNESS-GROK after plan approval | Add one OMP extension and one Grok plugin/config binding; no account, credential, provider, model, permission, installer, or unrelated hook change |
| EFF-CONV-DISPOSABLE | permitted local runtime test | AUTH-USER-CONVERGENCE after plan approval | Create state, payloads, and Handoffs only in disposable directories or a disposable newly approved smoke run; delete test state after proof |
| EFF-CONV-PAPERCUT | prohibited production mutation | AUTH-PAPERCUT-CURRENT | Do not record, resolve, reopen, migrate, or otherwise change `.agents/papercuts.json`; use disposable copies only |
| EFF-CONV-EXTERNAL | prohibited delivery effect | AUTH-USER-CONVERGENCE | No staging, commit, push, review request, release, deploy, rollout, tracker mutation, or external service write |
| EFF-CONV-USER | prohibited user/global authority mutation | AUTH-WORKFLOW-CURRENT | Do not edit `/Users/kim/.agents/AGENTS.md`, Mnemopi data, product authority, secrets, accounts, or unrelated dotfiles |

## Current versus proposed behavior

| Area | Current observed behavior | Required behavior |
|---|---|---|
| Runtime convergence | Prose and eval contracts describe state, attempts, repair, and recovery but no canonical runtime state implementation exists | One strict schema, transition engine, atomic compare-and-swap snapshot, and adapter run reference mechanically own current execution state |
| Outcome lineage | Task and plan revisions can reconstruct counters from prose and Handoffs | One immutable outcome ID owns frontier attempts, blockers, repair, review, and originating papercut identity across every revision |
| Asynchronous observation | Background jobs can surface repeated unchanged nonterminal `jobs`/`wait` results and resume costly model turns | For one active job and state generation, one outstanding adapter wait coalesces unchanged snapshots below the model; only a generation change, terminal delivery, cancellation, transport failure, or decision-bearing timeout resumes orchestration |
| Semantic attempts | Current guidance permits three attempts per unchanged Task Contract revision | One initial attempt plus at most one materially changed evidence-backed retry per outcome/criterion frontier; no revision, reapproval, or recovery reset |
| Feedback cost | Smoke is required but cost ordering is not validated | `contract/static → deterministic local → disposable real seam → external/public` is recorded in order before an external/public seam or sole repair |
| Attempt artifacts | Task Contracts, Context Packs, Handoffs, and evidence can become routine materialized chains | Runtime payloads stay structured and digest-bound in adapter storage; only a real recovery/external boundary materializes; terminal state plus one Handoff survive |
| Standard assurance | Verification precedes review for every assurance profile | Standard may execute verifier and reviewer concurrently on one immutable target, but state consumption stays verification-first; compact/high-consequence remain ordered |
| Recovery | Skills describe recovery but no canonical locator/state implementation exists | Exact run reference plus exact terminal/recovery Handoff and fresh `dev-ask` rebind recover monotonically; no scan, inference, migration, or counter restoration |
| Harnesses | OMP has plan-only synchronization; Grok has config and planner persona but no convergence adapter | OMP extension and Grok plugin use different native mechanisms behind one state contract and attest their limits truthfully |
| Papercut | Current v2 module and exact-record settlement are independent repository evidence | State carries only the exact originating `PC-ID` and backend settlement evidence; the papercut helper remains the sole ledger mutation seam |

## Mechanical convergence contract

### Canonical snapshot

`executor_state.py` owns `dev-execution-state/v1`. Persisted JSON rejects unknown keys, duplicate IDs, malformed identities, invalid states, unsorted or duplicate sets, dangling task/frontier references, non-monotonic generation, and all invariant violations. It serializes sorted keys with two-space indentation, UTF-8, LF, and one final newline. SHA-256 over those exact bytes is the state identity.

The exact top-level domains are:

1. `schema` and monotonic `generation`.
2. `identity`: immutable outcome ID, harness adapter, native instance identity digest, canonical repository identity, creation mode `new | legacy-rebind`, and optional exact parent run reference.
3. `authority`: current authority, route, Executor Plan, Task Contract, approval/effect, compatibility/degraded-behavior, and Orchestrator Role Profile identities. Revision fields may advance only through an authorized transition and never alter the outcome ID or budgets.
4. `lifecycle`: current run state, exact target identity, next frontier, and terminal or blocker status.
5. `tasks`: exact Task Contract digest, owner, owned criteria, dependencies, task state, active attempt, smoke evidence, and output identity for every task.
6. `frontiers`: stable frontier ID derived from the immutable outcome ID plus sorted owned criterion IDs, semantic attempts used, prior failure evidence, changed-approach evidence, and progress result.
7. `assurance`: profile, verifier/reviewer identities and results, speculative quarantine state, integration state, one inherited post-assurance repair token, and initial-review/rerun accounting.
8. `feedback`: one ordered four-rung record for each costly external/public seam and for the sole repair, with observed evidence for every available rung and an exact reason for every unavailable or inapplicable rung.
9. `artifacts`: content-addressed Task Contract, Context Pack, result, smoke, proof, effect, and cleanup references; materialization reason and retention class are explicit.
10. `papercut`: absent for ordinary work or exactly one immutable originating `PC-ID`, candidate-specific result, mapped kind, durable reference, helper result, and unrelated-record preservation evidence.
11. `terminal`: terminal evidence accounting, terminal/recovery Handoff digest, payload-accounting proof, cleanup proof, and compact-retention status.

### State engine interface

The private helper exposes exactly `init`, `show`, `transition`, `gate`, `recover`, and `compact` CLI operations. Adapters, not model-supplied input, bind canonical repository root, adapter storage root, native instance identity, and harness. Mutations require the exact current snapshot SHA-256 and generation. A stale compare-and-swap, path escape, symlink, lock conflict, collision, malformed payload, missing authority, invalid transition, or invariant failure returns one stable JSON error and writes nothing.

`transition` accepts only named events: authority/task binding, task readiness, attempt start/result, Handoff, verification, integration, speculative review start/result/discard, review consumption, repair authorization/result, curation result, papercut settlement evidence, block, cancel, and complete. It computes the next snapshot; callers cannot patch arbitrary fields. Content-addressed payloads are immutable. A transition writes payload bytes first, atomically replaces the one canonical snapshot under a per-instance lock, and tolerates only unreferenced orphan payloads after interruption. Cleanup removes intermediates only after the canonical terminal snapshot accounts for their digests, effects, evidence, and cleanup.

`gate` is read-only and returns an explicit allow or deny reason for the current native instance, requested lifecycle action, and tool class. `recover` accepts one exact adapter run reference, matching Handoff bytes/digest, current destination instance, and fresh `dev-ask` rebind identity; it never searches. `compact` keeps exactly the terminal snapshot and terminal/recovery Handoff after all referenced intermediate payloads are accounted and removed.
Adapters expose one transient coalescing observation action against the bound native instance and state generation. It keeps at most one outstanding terminal wait per active job, uses native auto-delivery when available, and otherwise waits below the model. It does not add a persisted counter, event ledger, lifecycle state, or semantic attempt.

### Transition and budget invariants

- Run state remains the existing causal model: `accepted → ready → running → verifying → integrating? → reviewing → curating? → complete`, with exact blocked, failed, and cancelled exits. Task state remains the existing task state vocabulary. The implementation does not invent a router state or write runtime state to plans, todos, ADRs, or repository guidance.
- A frontier ID never changes when route, plan, Task Contract, owner, or implementation revision changes while owned criterion IDs remain the same. Splitting or merging owned criteria is a material Task Contract/route change and inherits the union of consumed budgets; it cannot create fresh attempts.
- Each frontier has at most two semantic attempts: initial plus one retry. Retry readiness requires exact prior failure reproduction, observed criterion or blocker delta, a different approach digest, and evidence for why the changed approach can affect the failure. An unchanged frontier returns `no-progress-stop` even when a slot is numerically unused.
- Each dispatch may use at most two safe idempotent pre-semantic transport retries. Transport retries are recorded separately and cannot change semantic counters.
- The immutable outcome begins with one post-assurance repair token. Authorization consumes it before mutation. No revision, reapproval, recovery, agent replacement, context reset, or new plan restores it.
- Before an external/public seam or repair, the four feedback rungs are recorded in order. A later rung cannot be marked before every earlier rung is `passed`, or `unavailable | inapplicable` with an exact reason. The state engine does not prescribe project-specific commands.
- For one active task or job and state generation, an unchanged nonterminal observation is coalesced below the model: it does not resume a model turn, count as progress, create or consume a semantic attempt, or authorize an immediate duplicate status read. Only a state-generation change, terminal delivery, cancellation, transport failure, or timeout requiring an explicit owner decision may resume orchestration. Explicit human-requested status remains available and never mutates convergence state. Adapter-local outstanding-wait state is transient.
- Approval stores the exact current route revision and closed effect set. Unchanged continuation is allowed. Any material route, authority, topology, destructive/external-effect, or shipping change blocks with `authority-change-required`; approval cannot reset counters.
- Legacy state is never inferred. An active pre-cutover run stops at a clean Handoff and requires an explicit fresh `dev-ask` rebind. The recovered state preserves outcome lineage and all known consumed budgets; unknown counters block rather than defaulting.

### Speculative standard assurance

Only standard assurance may start distinct verifier and reviewer attempts concurrently against one immutable target. Both record the same target digest and independent identities. Reviewer output is `quarantined` until verifier `VERIFIED` on that exact target.

- Verifier `VERIFIED`: consume the completed reviewer result if exact and current; reviewer `APPROVED` advances review, `CHANGES REQUIRED` enters the one blocker census, and `INCONCLUSIVE` blocks.
- Verifier `NOT VERIFIED`: review approval is discarded; completed reviewer blockers are diagnostic inputs to the consolidated repair census; no review state is approved.
- Verifier `INCONCLUSIVE`: reviewer output stays quarantined and completion blocks on named evidence.
- Any repair requires fresh verification. If a speculative reviewer ran before repair, one fresh eligible post-repair review is required and consumes the sole rerun.
- Compact and high-consequence profiles reject speculative review start and remain verification-then-review.

### Adapter run reference

Both adapters return `adapter-run-reference/v1` with harness, opaque native-instance key, immutable outcome ID, generation, state SHA-256, terminal/recovery Handoff SHA-256 when present, and adapter contract version. The reference contains no authority or mutable counter of its own. It is a locator and identity proof only.

OMP binds the current persistent session file identity and session-local `local://` root through the extension context. Grok binds the hook-provided `GROK_SESSION_ID`, `GROK_WORKSPACE_ROOT`, and plugin-provided `GROK_PLUGIN_DATA`. Neither adapter scans by newest file, slug, outcome title, transcript, plan list, memory, or artifact count.

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-CONV-ADR | ADR-0009 D26 plus reconciled D02/D03/D04/D08/D10/D11/D13 and workflow discovery | T1 | CONV-ADR-20260813-r1 | T2, T3, T4, T5, T6 |
| CONTRACT-CONV-STATE | `dev-execution-state/v1`, strict transition API, atomic storage, run reference, and retention | T2 | CONV-STATE-20260813-r1 | T3, T4, T5, T6 |
| CONTRACT-CONV-SEMANTIC | Direct lane, immutable outcome, two-attempt frontier, coalesced asynchronous observation, feedback ladder, approval, recovery, and assurance semantics | T2 | CONV-SEMANTIC-20260813-r1 | T3, T4, T5, T6 |
| CONTRACT-CONV-OMP | OMP extension binding, native identity, state tool, mutation/dispatch gate, stop gate, and recovery | T3 | CONV-OMP-20260813-r1 | T5, T6 |
| CONTRACT-CONV-GROK | Grok plugin/MCP/hook binding, permit handshake, session state, gates, and recovery | T4 | CONV-GROK-20260813-r1 | T5, T6 |
| CONTRACT-CONV-PAPERCUT | Existing ADR-0007 D24 semantics plus state-only exact `PC-ID` and terminal helper evidence | T5 | Current v2 working bytes at plan approval | T6 |
| CONTRACT-CONV-ASSURANCE | Exact worker smoke, final independent verification, separate final review, terminal learning, and evidence accounting | T6 | CONV-ASSURANCE-20260813-r1 | none |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-CONV-ADR | `docs/adr/0001-*`, `0002-*`, `0003-*`, `0004-*`, new `0009-dev-workflow-mechanical-convergence.md`, `docs/adr/INDEX.md`, `.config/agents/skills/dev-ask/WORKFLOW.md` | T1 | Current working bytes at approved PLAN-SHA; ADR-0007 and ADR-0008 preserved | Repository discovery, every dev lifecycle owner, workflow evals | AC-CONV-01 |
| TGT-CONV-STATE | New `.config/agents/skills/dev-implementation/scripts/executor_state.py`, focused fixtures, and `test_executor_state.py` | T2 | Absent before plan execution | OMP and Grok adapters, backend, recovery, state tests | AC-CONV-02, AC-CONV-03, AC-CONV-04, AC-CONV-05, AC-CONV-06, AC-CONV-07, AC-CONV-14 |
| TGT-CONV-PROFILE | `references/orchestrator-role-profile.md`, `scripts/orchestrator_profile.py`, `scripts/test_orchestrator_profile.py`, affected planner/profile fixtures | T2 | Current v1 profile and assessor bytes at approved PLAN-SHA | Backend launch, OMP/Grok attestations, profile evals | AC-CONV-02, AC-CONV-06, AC-CONV-14 |
| TGT-CONV-BACKEND | `.config/agents/skills/dev-implementation/SKILL.md`, `.config/agents/skills/dev-handoff/SKILL.md` | T2 | Current user-modified workflow bytes at approved PLAN-SHA | All implementation tasks, Handoffs, recovery, completion | AC-CONV-03, AC-CONV-04, AC-CONV-05, AC-CONV-06, AC-CONV-07, AC-CONV-14 |
| TGT-CONV-ASSURANCE | `.config/agents/skills/dev-verification/SKILL.md`, `dev-code-review/SKILL.md`, `dev-integration/SKILL.md`, and directly affected assurance fixtures | T2 | Current working bytes at approved PLAN-SHA | Verification, speculative review, repair census, fan-in | AC-CONV-06, AC-CONV-14 |
| TGT-CONV-ROUTER | `.config/agents/skills/dev-ask/SKILL.md` and only directly affected route/recovery fixtures | T2 | Current working bytes at approved PLAN-SHA | Initial approval, material reapproval, legacy rebind, completion | AC-CONV-07, AC-CONV-14 |
| TGT-CONV-OMP | New `.config/agents/harnesses/omp/extensions/execution-state.js`, focused test, and `.config/agents/harnesses/omp/config.yml` | T3 | Extension absent; current config has key-remaps and plan-artifact-sync exactly once | OMP session lifecycle, custom state tool, tool and stop events | AC-CONV-08 |
| TGT-CONV-GROK | New `.config/agents/harnesses/grok/plugins/dev-workflow-state/` with manifest, MCP server, hook config/scripts, tests, and `.config/agents/harnesses/grok/config.toml` | T4 | Plugin absent; current config has no custom plugin path or convergence MCP | Grok plugin registry, MCP merge, PreToolUse/Stop hooks, session recovery | AC-CONV-09 |
| TGT-CONV-EVAL | `.config/agents/skills/dev-ask/evals/evals.json` and the minimum new/changed `b-convergence-*` fixtures | T5 | Current working eval registry and fixtures at approved PLAN-SHA | Router/backend/assurance semantic regression checks | AC-CONV-10, AC-CONV-11 |
| TGT-CONV-PAPERCUT | Read-only current ADR-0007, papercut rule/skill/helper/evals/ledger plus disposable compatibility fixtures | T5 | Current user-modified v2 bytes and ledger at approved PLAN-SHA | Candidate delivery, state `PC-ID`, terminal settlement accounting | AC-CONV-11, AC-CONV-12 |
| TGT-CONV-PRESERVE | `/Users/kim/.agents/AGENTS.md`, Mnemopi, product workflow/PRDs, plan transport, `executor_plan.py`, bootstrap, manifest, shipping, tracker, unrelated work | T5 | Exact pre-task hashes and status snapshot | Negative-effect and clean-cutover checks | AC-CONV-12 |
| TGT-CONV-FINAL | One exact changed-path manifest and aggregate digest for TGT-CONV-ADR through TGT-CONV-EVAL | T6 | Produced after T5 smoke | Independent verification, final review, terminal learning | AC-CONV-13 |

## Execution policy

- Assurance: high-consequence
- Topology: one-owner-sequential
- Max concurrency: 1
- Isolation: no implementation worktree; use disposable temporary directories and disposable harness sessions for state, recovery, concurrency, and live-adapter proof
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: preserve all current user/uncommitted work; before each edit reread and digest the exact target; use minimum anchored changes; never reset, stash, overwrite, or normalize unrelated bytes; stop at BLK-CONV-DRIFT on semantic conflict
- Decomposition: prohibited; one owner keeps schema, semantics, adapters, fixtures, and papercut boundary coherent; final verification/review remain independent lifecycle roles
- Effect limit: EFF-CONV-REPO, EFF-CONV-ADAPTER, EFF-CONV-DISPOSABLE, EFF-CONV-PAPERCUT, EFF-CONV-EXTERNAL, EFF-CONV-USER
- Orchestrator profile: exact approved one-qualified-owner sequential profile with `state` as a required direct capability after T2; no fallback, alternate provider/model/account, hidden subplan, or topology escalation

This current implementation run uses its already-approved plan authority until the state engine exists. It does not backfill or infer state for itself. After T2, all adapter and semantic tests create explicit disposable `new` runs. The clean cutover applies to newly approved future runs only after T6 verifies the feature.

## Tasks

- [ ] T1. Establish canonical mechanical convergence authority
  - Owner: convergence-implementation-owner
  - Wave: W0
  - Depends on: none
  - Targets: TGT-CONV-ADR
  - Contracts: CONTRACT-CONV-ADR
  - Criteria: AC-CONV-01
  - Effects: EFF-CONV-REPO
  - Output: OUTP-CONV-ADR
  - Receiver: T2
  - Verification: VR-CONV-01
  - Lineage: shared
- [ ] T2. Implement portable state and semantic cutover
  - Owner: convergence-implementation-owner
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-CONV-STATE, TGT-CONV-PROFILE, TGT-CONV-BACKEND, TGT-CONV-ASSURANCE, TGT-CONV-ROUTER
  - Contracts: CONTRACT-CONV-ADR, CONTRACT-CONV-STATE, CONTRACT-CONV-SEMANTIC
  - Criteria: AC-CONV-02, AC-CONV-03, AC-CONV-04, AC-CONV-05, AC-CONV-06, AC-CONV-07, AC-CONV-14
  - Effects: EFF-CONV-REPO, EFF-CONV-DISPOSABLE
  - Output: OUTP-CONV-CORE
  - Receiver: T3
  - Verification: VR-CONV-02, VR-CONV-03, VR-CONV-04, VR-CONV-05, VR-CONV-06, VR-CONV-07, VR-CONV-14
  - Lineage: shared
- [ ] T3. Bind and prove the OMP adapter
  - Owner: convergence-implementation-owner
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-CONV-OMP
  - Contracts: CONTRACT-CONV-ADR, CONTRACT-CONV-STATE, CONTRACT-CONV-SEMANTIC, CONTRACT-CONV-OMP
  - Criteria: AC-CONV-08
  - Effects: EFF-CONV-REPO, EFF-CONV-ADAPTER, EFF-CONV-DISPOSABLE
  - Output: OUTP-CONV-OMP
  - Receiver: T4
  - Verification: VR-CONV-08
  - Lineage: shared
- [ ] T4. Bind and prove the Grok adapter
  - Owner: convergence-implementation-owner
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-CONV-GROK
  - Contracts: CONTRACT-CONV-ADR, CONTRACT-CONV-STATE, CONTRACT-CONV-SEMANTIC, CONTRACT-CONV-GROK
  - Criteria: AC-CONV-09
  - Effects: EFF-CONV-REPO, EFF-CONV-ADAPTER, EFF-CONV-DISPOSABLE
  - Output: OUTP-CONV-GROK
  - Receiver: T5
  - Verification: VR-CONV-09
  - Lineage: shared
- [ ] T5. Synchronize evals papercut boundary and final smoke
  - Owner: convergence-implementation-owner
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-CONV-EVAL, TGT-CONV-PAPERCUT, TGT-CONV-PRESERVE
  - Contracts: CONTRACT-CONV-ADR, CONTRACT-CONV-STATE, CONTRACT-CONV-SEMANTIC, CONTRACT-CONV-OMP, CONTRACT-CONV-GROK, CONTRACT-CONV-PAPERCUT
  - Criteria: AC-CONV-10, AC-CONV-11, AC-CONV-12
  - Effects: EFF-CONV-REPO, EFF-CONV-DISPOSABLE, EFF-CONV-PAPERCUT, EFF-CONV-EXTERNAL, EFF-CONV-USER
  - Output: OUTP-CONV-FINAL
  - Receiver: dev-verification
  - Verification: VR-CONV-10, VR-CONV-11, VR-CONV-12
  - Lineage: shared
- [ ] T6. Verify review learn and account outcome
  - Owner: assurance-backend
  - Wave: W5
  - Depends on: T5
  - Targets: TGT-CONV-FINAL
  - Contracts: CONTRACT-CONV-ADR, CONTRACT-CONV-STATE, CONTRACT-CONV-SEMANTIC, CONTRACT-CONV-OMP, CONTRACT-CONV-GROK, CONTRACT-CONV-PAPERCUT, CONTRACT-CONV-ASSURANCE
  - Criteria: AC-CONV-13
  - Effects: EFF-CONV-DISPOSABLE
  - Output: OUTP-CONV-ASSURANCE
  - Receiver: dev-ask
  - Verification: VR-CONV-13
  - Lineage: shared

## Detailed task contracts

### T1. Establish canonical mechanical convergence authority

**Objective:** Create one active D26 owner for runtime convergence while revising existing decision owners only where the confirmed behavior changes.

**Procedure:**

1. Create ADR-0009 for D26: portable state materialization, strict transitions, adapter storage, atomicity, exact recovery, legacy cutover, ephemeral payloads, and terminal retention.
2. Update ADR-0001 D02/D10/D11/D13 for bounded approval, strict direct lane, independent lifecycle dimensions, and clean legacy cutover.
3. Update ADR-0002 D08 to keep plans, todos, Task Contracts, Context Packs, and Handoffs as projections or payloads rather than canonical runtime state.
4. Update ADR-0003 D03/D04 for the two-attempt frontier, ordered feedback ladder, one repair, and standard-only speculative review quarantine.
5. Update ADR-0004 only for source attribution if required; keep D07/D23 curation ownership unchanged.
6. Add one index row and D26 discovery row; update only the five-section `WORKFLOW.md` statements affected by this plan.
7. Record every rejected alternative from AUTH-USER-CONVERGENCE and explicit reopen/supersession triggers. Do not copy the Atlas transcript or create a decision/state registry beyond the ADR.

**Acceptance:** AC-CONV-01. One canonical owner exists per current convergence decision; the strict direct lane and assurance dimensions are unambiguous; unrelated ADR-0005 through ADR-0008 semantics are unchanged.

**Prohibited:** no runtime code in ADRs; no new convergence skill; no global AGENTS change; no execution-state field in the plan or todo schema.

**Output/receiver:** OUTP-CONV-ADR is one runtime Handoff payload with exact changed ADR/index/workflow identities and a no-conflict recheck for T2. Do not materialize it as a repository file.

### T2. Implement portable state and semantic cutover

**Objective:** Make convergence mechanically enforceable through one small state engine and align every current semantic owner with that engine.

**Procedure:**

1. Implement `executor_state.py` with the exact schema, six-operation CLI, stable JSON outputs/errors, path containment, canonical serialization, per-instance locking, content-addressed immutable payloads, atomic compare-and-swap snapshot replacement, and compact terminal retention in CONTRACT-CONV-STATE.
2. Add deterministic fixture constructors and focused unit/concurrency tests. Exercise all legal transitions and every invalid boundary: stale digest, same-generation rewrite, path escape, symlink, lock contention, unknown key, duplicate ID, dangling dependency, impossible task/run state, unsafe cleanup, and interrupted write.
3. Derive frontier identity from immutable outcome plus sorted owned criteria. Enforce two semantic attempts, materially changed retry evidence, no-progress stop, two separate transport retries, one repair token, and no reset across every revision/reapproval/recovery case. Add a provider-neutral fake-adapter case in which 50 unchanged nonterminal observations cause no model resume or state/counter change and one terminal transition causes one delivery.
4. Encode the four-rung feedback ladder and block external/public or repair transitions until earlier rungs are observed or explicitly unavailable/inapplicable with reasons.
5. Encode exact route/effect approval and legacy recovery. Reject wildcard authority, unbound effect changes, unknown counters, stale Handoff, mismatched run reference, inferred state, and artifact scans.
6. Encode standard speculative review quarantine and terminal mapping. Reject speculation for compact/high-consequence; preserve independent identities; discard approval after verifier failure; retain blockers only as diagnostics; require fresh post-repair verification and one eligible review rerun.
7. Cut Orchestrator Role Profile to the next explicit schema version with `state` as a required direct capability and exact adapter/state contract attestation. Update its assessor and tests; do not infer capability from config, prose, or file presence.
8. Update `dev-implementation` to invoke state transitions and consume state as backend authority, including the one-outstanding-wait and no-unchanged-resume scheduling contract. Replace the current three-attempt prose cleanly. Update `dev-handoff` for one exact run reference and conditional materialization. Update `dev-code-review`, `dev-verification`, and `dev-integration` only for speculative quarantine/consumption and inherited state. Update `dev-ask` only for initial outcome creation, bounded approval, material reapproval, legacy rebind, and terminal presentation.
9. Keep `dev-requirements`, `dev-specification`, `dev-ticketing`, `dev-diagnosing-bugs`, `dev-continual-learning`, and `dev-shipping` unchanged unless a direct contradiction is demonstrated by a named criterion; if changed, use the minimum clean cutover and add a matching fixture.
10. Prove `executor_plan.py`, plan rules, and todo state remain separate and unchanged; no runtime fields are serialized into plan or todo artifacts.

**Acceptance:** AC-CONV-02, AC-CONV-03, AC-CONV-04, AC-CONV-05, AC-CONV-06, AC-CONV-07, and AC-CONV-14. Focused tests fail against the old three-attempt, reconstructed-state, and stage-expanded direct-lane behavior and pass against the exact new contract.

**Prohibited:** arbitrary JSON patching; append-only event ledger; repository state; default counters; attempt/repair reset; project-specific feedback commands; new lifecycle role; reviewer self-verification; routine payload Markdown files.

**Output/receiver:** OUTP-CONV-CORE is one runtime Handoff payload with exact core target digest, unit/concurrency command evidence, state traces, preserved-surface hashes, and T3 ready condition.

### T3. Bind and prove the OMP adapter

**Objective:** Bind the portable engine to OMP native session, extension, tool, interception, and stop mechanics without changing the existing plan-artifact transport.

**Procedure:**

1. Add `execution-state.js` as a sibling extension and load it exactly once after current extensions. Do not edit `plan-artifact-sync.js` except for a demonstrated test-only collision, and never merge their responsibilities.
2. Derive native instance identity from the persistent session file plus session-local `local://` root supplied by the extension context. Return `transport-unavailable` when durable identity or the required root is absent. The model never supplies storage paths.
3. Register one strict `dev_workflow_state` tool that maps adapter actions to the helper and returns the exact run reference/state digest. Its transient observe action uses the bound async-job snapshot and state generation to keep one cancellable outstanding terminal wait, suppress unchanged nonterminal updates below the model, and deliver only a meaningful change; it never writes observation counters. Rebuild the active binding on session start/switch/branch/tree from the exact instance locator, never by scanning.
4. Intercept mutating, dispatch, integration, curation-settlement, shipping, and other effectful tool classes while an active convergence run exists. Call `gate`; deny missing/stale/mismatched/non-running state. Allow the state tool and explicitly classified read-only inspection. Do not infer state transitions from arbitrary tool results.
5. Use `session_stop` to continue an attempted normal stop while active state is nonterminal, returning the exact next frontier or blocker. Interrupted/error termination leaves state recoverable and never marks completion.
6. Add focused Bun tests for registration, instance isolation, state creation, resume, concurrent compare-and-swap, denied stale mutation, allowed read-only work, stop gating, exact terminal completion, extension reload, no interaction with plan synchronization, and 50 unchanged async-job snapshots followed by one terminal snapshot.
7. Run one disposable OMP session smoke through `accept → ready → running → handed-off → verifying → reviewing → complete`, observe a denied early stop/mutation case, keep one wait open across repeated unchanged nonterminal snapshots, deliver one terminal change, resume by exact run reference, and verify only terminal compact state plus Handoff remain.

**Acceptance:** AC-CONV-08. OMP behavior is observed through its real extension seam and truthful capability attestation; unchanged delegate status never resumes the model, one meaningful change delivers once, and a missing extension, unavailable durable identity, or unavailable coalescing observation seam cannot report state capability.

**Prohibited:** session transcript parsing; newest-session scan; model-driven status polling; plan projection changes; global alias or provider/model change; state in `pi.appendEntry` as a second authority; automatic recovery.

**Output/receiver:** OUTP-CONV-OMP is one runtime Handoff payload with extension/config identities, Bun results, live smoke run reference, storage/identity disclosure, and T4 ready condition.

### T4. Bind and prove the Grok adapter

**Objective:** Bind the same state engine to Grok plugin/MCP/hook mechanics while acknowledging and containing Grok's documented hook failure model.

**Procedure:**

1. Add one user-configured plugin path and a `dev-workflow-state` plugin with `plugin.json`, one stdio MCP server, plugin hooks, and focused tests. Use standard-library Python and shell only; add no package dependency or background daemon.
2. Store state under the plugin-provided data root keyed by SHA-256 of the hook-authenticated native session ID. The MCP model-facing schema never accepts a storage path or authoritative repository root.
3. Expose one MCP state tool with the same semantic actions as OMP. Every call carries an opaque nonce. The plugin `PreToolUse` hook writes one short-lived, single-use permit keyed by nonce and bound to actual `GROK_SESSION_ID`, workspace root, tool name, input digest, and tool-use identity; the MCP server atomically consumes it before deriving the instance locator. Its transient observe action keeps one cancellable outstanding wait on the bound run and generation, coalesces unchanged nonterminal snapshots below the model, and never persists observation counters. Missing, replayed, expired, conflicting, or mismatched permits fail closed.
4. The same `PreToolUse` hook calls `gate` for mutating, dispatch, integration, settlement, shipping, unknown effectful tools, and duplicate model-driven status observations while an active run exists. Its wrapper catches helper/script/malformed-state errors and emits explicit deny. Read-only core tools and explicit human-requested status remain available. Document that a harness-level hook timeout/crash is natively fail-open and therefore prevents a truthful `state` capability attestation for that session rather than authorizing completion.
5. Add a `Stop` hook that checks only genuine `end_turn`, blocks nonterminal active state with the exact frontier, and tolerates the harness eight-continuation cap by leaving state nonterminal. `SessionEnd` never marks completion.
6. Add JSON-RPC subprocess tests for MCP initialize/list/call, permit consumption/replay, strict input, state transitions, concurrent sessions, recovery, terminal compaction, and 50 unchanged observations followed by one terminal transition. Add direct hook-envelope tests for allow/deny/error, duplicate status suppression, and state isolation.
7. Run one disposable trusted Grok session that discovers the plugin, proves MCP plus hook attestation, performs the normal lifecycle, observes a denied stale/missing-state mutation and early stop, keeps one observation wait across unchanged nonterminal snapshots, delivers one meaningful change, then recovers through an exact run reference. Record actual plugin/MCP/hook, identity, storage, tool, model, observation, and recovery mechanics; do not claim OMP-identical behavior.

**Acceptance:** AC-CONV-09. The plugin proves exact session separation, fail-closed state calls, and no model resumption from unchanged delegate status. Native fail-open hook failure or an unavailable coalescing observation seam is surfaced as capability unavailability and cannot silently satisfy completion.

**Prohibited:** remote MCP service; background daemon; model-driven status polling; transcript/memory scan; project-trust bypass; static fake session ID; shared mutable current-session pointer; model-selected storage; hook-owned authority; provider/model/account changes.

**Output/receiver:** OUTP-CONV-GROK is one runtime Handoff payload with plugin/config identities, MCP/hook test results, live smoke run reference, documented native limit, and T5 ready condition.

### T5. Synchronize evals papercut boundary and final smoke

**Objective:** Prove semantic behavior, cleanly remove superseded active contracts, and preserve the user's current papercut framework and unrelated work.

**Procedure:**

1. Add the minimum `b-convergence-*` eval cases and registry entries for direct-lane selection, immutable outcome, two-attempt frontier, changed-approach retry, revision/reapproval no-reset, 50 unchanged observations plus one terminal delivery, feedback order, standard speculation, compact/high-consequence ordering, bounded approval, legacy rebind, exact recovery, terminal retention, and OMP/Grok mechanism disclosure.
2. Each changed positive case gets a near-miss that would pass a broad keyword rule but violates one boundary. Keep fixtures deterministic, identity-bound, and strict-parseable.
3. Search every active workflow skill, ADR, workflow doc, profile, fixture, and adapter for removed three-attempt, revision-local budget, always-ordered standard review, routine-Handoff materialization, inferred recovery, wildcard approval, or repository-runtime-state contracts. Remove or supersede every executable occurrence; preserve explicit historical/rejected references.
4. Run a disposable papercut-originated lifecycle: state carries one exact `PC-ID`; curation result maps candidate-specifically; backend invokes the existing papercut helper only after authoritative terminal outcome; state records helper result and unrelated-record proof. Test fixed, rejected, superseded, open/blocked, incomplete candidate, mismatched ID, and unrelated result. Production `.agents/papercuts.json` must remain byte-identical.
5. Prove the state helper cannot initialize, list, record, resolve, reopen, deduplicate, or infer papercut records. Prove the papercut helper cannot mutate execution state. Keep memory, product, custom workflow, tracker, plan, and shipping owners separate.
6. Run all focused core, profile, adapter, semantic, syntax/frontmatter, and changed-fixture checks once against the final T1-T5 bytes. Run the two live disposable harness smokes once after static/unit checks pass. Capture one exact changed-path manifest and aggregate target digest.
7. Remove disposable state and fixture repositories after their digests and results are captured. Leave no daemon, lock, permit, temporary payload, test ledger, or live nonterminal run.

**Acceptance:** AC-CONV-10, AC-CONV-11, and AC-CONV-12. Cross-harness semantic vectors agree, papercut ownership remains separate, and every protected surface is byte-preserved; old behavior cannot pass through a stale fixture or undocumented adapter.

**Prohibited:** production papercut mutation; broad eval rewrite; transcript/memory mining; generated artifact count as proof; unrelated formatting; shipping.

**Output/receiver:** OUTP-CONV-FINAL is one terminal/recovery Handoff materialized in adapter-owned test storage only, plus a returned Common Handoff naming PLAN-SHA, exact target digest, every AC/VR result, run references, smoke, effects, preserved hashes, cleanup, and dev-verification as sole receiver.

### T6. Verify review learn and account outcome

**Objective:** Independently prove the exact T5 target, review it once under current Standards/Specification authority, run terminal learning, and return complete evidence without repair by assurance roles.

**Procedure:**

1. Freeze TGT-CONV-FINAL and its changed-path manifest. A fresh `dev-verification` owner reruns every VR-CONV recipe against that exact identity, including real adapter seams and preserved-byte checks.
2. Aggregate all `NOT VERIFIED` or `INCONCLUSIVE` criteria once. Do not review an unverified target. If the inherited repair token is unused, the backend may authorize one consolidated owner repair under the existing lifecycle; assurance roles never edit.
3. After `VERIFIED`, run one distinct `dev-code-review` pass on the same target. This implementation is high-consequence, so its own review is ordered. Review checks specification compliance, state safety, concurrency, security/privacy, adapter truthfulness, test quality, and the D22 complexity lens.
4. If final review approves, run exactly one terminal Standard `dev-continual-learning` assessment against the reviewed target and affected-artifact manifest. Update only directly impacted project-owned guidance if a qualified frozen candidate exists; otherwise return `NO DURABLE LEARNING`.
5. Account for every task, criterion, effect, attempt, repair/review state, adapter run, payload cleanup, papercut preservation check, residual risk, and prohibited effect. Return terminal evidence to `dev-ask` for completion presentation; do not ship.

**Acceptance:** AC-CONV-13. Exact final target is independently `VERIFIED`, separate review is `APPROVED`, terminal learning is settled, no blocker or required nonterminal work remains, and no unapproved effect occurred.

**Prohibited:** verifier/reviewer repair; speculative review for this high-consequence implementation; second review without the one authorized post-repair rerun; completion from worker smoke; shipping.

**Output/receiver:** OUTP-CONV-ASSURANCE is one Common Handoff and evidence index to `dev-ask`, with `route-impact: unchanged` unless new evidence materially changes approved authority.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-CONV-01 | Current ADR/index/workflow decision catalog after D26 materialization | Exactly one canonical owner exists per current convergence decision; the strict direct lane is distinct from assurance depth; no active decision conflict or unrelated ADR semantic change remains | TGT-CONV-ADR | T1 |
| AC-CONV-02 | New approved run, valid adapter binding, and concurrent state writers | One canonical strict snapshot; exactly one compare-and-swap succeeds per generation; invalid/stale/path/symlink/lock cases write nothing and return stable errors | TGT-CONV-STATE, TGT-CONV-PROFILE | T2 |
| AC-CONV-03 | Same outcome and owned criteria across route, plan, Task Contract, owner, implementation, reapproval, and recovery revisions, plus 50 unchanged nonterminal delegate observations | Outcome/frontier identity and counters persist; attempt 1 plus at most one changed-approach retry; attempt 3 and every reset path are rejected; one repair never restores; unchanged observations cause zero model resumes and one terminal change causes one delivery | TGT-CONV-STATE, TGT-CONV-BACKEND | T2 |
| AC-CONV-04 | Task is about to use an external/public seam or authorize the sole repair | Four generic rungs appear in order; every available rung has observed evidence and every unavailable/inapplicable rung has exact reason; later rung or repair is blocked otherwise | TGT-CONV-STATE, TGT-CONV-BACKEND | T2 |
| AC-CONV-05 | Normal attempts, recovery boundary, and terminal completion | Attempt payloads remain structured/digest-bound and unmaterialized by default; exact recovery may materialize one Handoff; terminal compaction retains one state snapshot plus one Handoff only after full accounting | TGT-CONV-STATE, TGT-CONV-BACKEND | T2 |
| AC-CONV-06 | Standard immutable target versus compact/high-consequence target | Standard verifier/reviewer may run concurrently with review quarantined and consumed only after exact verification; failed verification discards approval and retains blockers diagnostically; compact/high-consequence reject speculation | TGT-CONV-STATE, TGT-CONV-PROFILE, TGT-CONV-BACKEND, TGT-CONV-ASSURANCE | T2 |
| AC-CONV-07 | Unchanged continuation, material route/effect change, and legacy active run | Current route/effects continue; unseen material change blocks for explicit authority and cannot reset budgets; legacy run requires clean Handoff plus fresh exact `dev-ask` rebind and no inferred migration | TGT-CONV-STATE, TGT-CONV-BACKEND, TGT-CONV-ROUTER | T2 |
| AC-CONV-08 | OMP persistent disposable session with active state, resume, mutation, one long-running delegate, and attempted early stop | Extension derives native identity/storage, exposes one state tool, denies stale/non-running effectful work, blocks normal early stop, coalesces 50 unchanged snapshots below the model, delivers one terminal change once, resumes exactly, and retains terminal pair without changing plan sync | TGT-CONV-OMP | T3 |
| AC-CONV-09 | Grok disposable trusted session with plugin, MCP state calls, native hooks, concurrent sessions, one long-running delegate, and attempted permit replay | Permit binds actual session/workspace/tool/input; replay/mismatch fails; state is session-isolated; mutation/stop gates observe state; 50 unchanged snapshots cause no model turns and one terminal change delivers once; hook failure makes capability unavailable rather than terminal; terminal pair and exact recovery work | TGT-CONV-GROK | T4 |
| AC-CONV-10 | Equivalent direct-lane, retry, repair, asynchronous-observation, assurance, recovery, and terminal scenarios through both harness adapters | The same semantic state transitions, budgets, coalescing boundary, gates, results, and Handoff fields are asserted by strict shared vectors; adapter-specific mechanics stay explicitly distinct; neither claims inferred capability | TGT-CONV-EVAL | T5 |
| AC-CONV-11 | Complete and incomplete papercut-originated candidates across every terminal mapping | State preserves exactly one immutable `PC-ID`; backend alone invokes the existing helper after authoritative outcome; fixed/rejected/superseded settle exactly one record; open/blocked/incomplete/global/mismatch writes none; execution state and ledger remain separate | TGT-CONV-EVAL, TGT-CONV-PAPERCUT | T5 |
| AC-CONV-12 | Final T1-T5 target versus all preservation surfaces | Production ledger, user-level AGENTS, Mnemopi, product/custom workflows, tracker, plan transport/parser, bootstrap, manifest, shipping, credentials, and unrelated work remain unchanged except named authorized targets | TGT-CONV-PAPERCUT, TGT-CONV-PRESERVE | T5 |
| AC-CONV-13 | Exact T5 target and complete changed-path manifest | Fresh independent verification returns `VERIFIED`; separate review returns `APPROVED`; terminal Standard learning settles; evidence index proves every task/criterion/effect terminal with no shipping | TGT-CONV-FINAL | T6 |
| AC-CONV-14 | Active core workflow after clean cutover | One direct implementation owner handles settled one-context work without automatic requirements/specification/ticketing/planning stages; no executable old three-attempt, revision-reset, always-ordered-standard, routine-artifact, wildcard-approval, inferred-recovery, or repository-state contract remains | TGT-CONV-STATE, TGT-CONV-PROFILE, TGT-CONV-BACKEND, TGT-CONV-ASSURANCE, TGT-CONV-ROUTER | T2 |

## Verification / Done criteria

- [ ] VR-CONV-01. Prove canonical ownership and direct-lane contract
  - Criterion: AC-CONV-01
  - Proof class: authoritative ADR/index/workflow inspection plus independent verification
  - Scenario / environment / fixture: current D26 discovery, supersession, strict direct-lane, assurance-dimension, and one-owner checks
  - Evidence form: exactly one owner per current decision, no active conflict, no unrelated ADR semantic change
  - Target recheck: TGT-CONV-ADR
  - Receiver: dev-verification
- [ ] VR-CONV-02. Prove atomic canonical state
  - Criterion: AC-CONV-02
  - Proof class: Python unit, filesystem, and multiprocess concurrency tests plus independent verification
  - Scenario / environment / fixture: legal lifecycle, 32 concurrent same-generation writers, stale compare-and-swap, malformed schema, symlink/path escape, lock contention, interrupted payload/snapshot writes
  - Evidence form: one winner; canonical bytes/digest; zero partial or unauthorized writes; stable error codes
  - Target recheck: TGT-CONV-STATE, TGT-CONV-PROFILE
  - Receiver: dev-verification
- [ ] VR-CONV-03. Prove revision-invariant convergence budgets
  - Criterion: AC-CONV-03
  - Proof class: state transition tests and semantic fixtures plus independent verification
  - Scenario / environment / fixture: initial failure, changed-approach retry, same-approach no-progress, attempt 3, route/plan/task/owner revisions, reapproval, recovery, split/merge frontier, first and second repair, and 50 unchanged observations followed by one terminal change
  - Evidence form: only two semantic attempts and one repair ever authorize; all reset paths fail closed with unchanged counters; unchanged observations cause zero model resumes and the terminal change delivers once
  - Target recheck: TGT-CONV-STATE, TGT-CONV-BACKEND
  - Receiver: dev-verification
- [ ] VR-CONV-04. Prove affected-boundary feedback ordering
  - Criterion: AC-CONV-04
  - Proof class: deterministic state and semantic fixtures plus independent verification
  - Scenario / environment / fixture: available, unavailable, and inapplicable rungs before disposable/external seam and sole repair; out-of-order and missing-evidence cases
  - Evidence form: exact four-rung accounting in order; blocked later rung/repair until complete; no project-specific command requirement
  - Target recheck: TGT-CONV-STATE, TGT-CONV-BACKEND
  - Receiver: dev-verification
- [ ] VR-CONV-05. Prove ephemeral payload and compact recovery
  - Criterion: AC-CONV-05
  - Proof class: filesystem lifecycle tests plus independent verification
  - Scenario / environment / fixture: routine attempts, explicit cross-session recovery, stale/mismatched run reference, pre-accounting compact attempt, complete terminal compact, exact Handoff rebind
  - Evidence form: routine payloads not materialized as repository artifacts; recovery exact; terminal storage contains only canonical snapshot and one Handoff after accounting
  - Target recheck: TGT-CONV-STATE, TGT-CONV-BACKEND
  - Receiver: dev-verification
- [ ] VR-CONV-06. Prove speculative review quarantine
  - Criterion: AC-CONV-06
  - Proof class: state transition tests and semantic verifier/reviewer fixtures plus independent verification
  - Scenario / environment / fixture: standard verified/failed/inconclusive targets with reviewer approve/block/inconclusive; post-repair rerun; compact and high-consequence speculation attempts
  - Evidence form: concurrent execution only for standard; exact verification-first consumption; approval discard and diagnostic blocker behavior; ordered profiles reject speculation
  - Target recheck: TGT-CONV-STATE, TGT-CONV-PROFILE, TGT-CONV-BACKEND, TGT-CONV-ASSURANCE
  - Receiver: dev-verification
- [ ] VR-CONV-07. Prove bounded approval and explicit legacy recovery
  - Criterion: AC-CONV-07
  - Proof class: state/recovery tests and route fixtures plus independent verification
  - Scenario / environment / fixture: unchanged continuation, route/authority/topology/effect/shipping changes, wildcard approval, legacy active Handoff, missing counters, fresh exact rebind
  - Evidence form: only unchanged continuation proceeds; material changes block without reset; legacy recovery requires exact Handoff/rebind and known monotonic state
  - Target recheck: TGT-CONV-STATE, TGT-CONV-BACKEND, TGT-CONV-ROUTER
  - Receiver: dev-verification
- [ ] VR-CONV-08. Prove native OMP adapter behavior
  - Criterion: AC-CONV-08
  - Proof class: Bun extension tests plus one disposable live OMP smoke and independent verification
  - Scenario / environment / fixture: persistent session identity, extension registration/reload, state tool, read-only and effectful tools, 50 unchanged async-job snapshots, one terminal snapshot, early stop, resume/recovery, completion/compact, plan-sync coexistence
  - Evidence form: exact state/run references, zero model resumes for unchanged snapshots, one terminal delivery, deny/allow/stop outputs, native adapter attestation, terminal pair, unchanged plan sync
  - Target recheck: TGT-CONV-OMP
  - Receiver: dev-verification
- [ ] VR-CONV-09. Prove native Grok adapter behavior
  - Criterion: AC-CONV-09
  - Proof class: JSON-RPC/plugin/hook tests plus one disposable live Grok smoke and independent verification
  - Scenario / environment / fixture: plugin discovery, MCP initialize/list/call, hook-authenticated nonce permit, replay/mismatch/expiry, two sessions, 50 unchanged observations, one terminal transition, mutation and stop gates, hook failure, exact recovery, completion/compact
  - Evidence form: exact session-isolated run references and state; zero model resumes for unchanged snapshots and one terminal delivery; fail-closed state calls; explicit deny outputs; truthful unavailable capability on native hook failure; terminal pair
  - Target recheck: TGT-CONV-GROK
  - Receiver: dev-verification
- [ ] VR-CONV-10. Prove cross-harness semantic equivalence
  - Criterion: AC-CONV-10
  - Proof class: shared golden state vectors, adapter tests, live disclosures, and independent verification
  - Scenario / environment / fixture: same new-run, retry, repair, observation-coalescing, speculation, recovery, terminal, and blocker vectors through OMP and Grok adapters
  - Evidence form: same portable state/result identities, budgets, and no-unchanged-resume semantics; different native mechanics explicitly reported; no fallback or inferred attestation
  - Target recheck: TGT-CONV-EVAL
  - Receiver: dev-verification
- [ ] VR-CONV-11. Preserve papercut ownership and settlement
  - Criterion: AC-CONV-11
  - Proof class: disposable-ledger integration tests and current semantic fixtures plus independent verification
  - Scenario / environment / fixture: fixed/rejected/superseded/open/blocked/incomplete/global/mismatched-ID outcomes with at least one unrelated record
  - Evidence form: exact one-record terminal writes only through existing helper; unchanged production ledger; no ledger logic in state engine and no state logic in helper
  - Target recheck: TGT-CONV-EVAL, TGT-CONV-PAPERCUT
  - Receiver: dev-verification
- [ ] VR-CONV-12. Prove preservation and cleanup
  - Criterion: AC-CONV-12
  - Proof class: exact pre/post hashes, repository status, disposable-root inventory, and independent verification
  - Scenario / environment / fixture: all named preserved repository/local surfaces plus interrupted and successful adapter smokes
  - Evidence form: byte-identical protected files/data; no daemon/lock/permit/payload/test-ledger residue; no external or shipping effect
  - Target recheck: TGT-CONV-PAPERCUT, TGT-CONV-PRESERVE
  - Receiver: dev-verification
- [ ] VR-CONV-13. Independently verify review and settle final target
  - Criterion: AC-CONV-13
  - Proof class: fresh dev-verification, separate dev-code-review, terminal Standard continual learning, and backend accounting
  - Scenario / environment / fixture: immutable TGT-CONV-FINAL; rerun VR-CONV-01 through VR-CONV-12 and clean-cutover scan; ordered high-consequence assurance
  - Evidence form: `VERIFIED`, then `APPROVED`, then terminal learning; complete evidence index and zero required nonterminal work
  - Target recheck: TGT-CONV-FINAL
  - Receiver: dev-ask
- [ ] VR-CONV-14. Prove clean removal of superseded contracts
  - Criterion: AC-CONV-14
  - Proof class: targeted active-surface search, strict frontmatter/JSON validation, and independent verification
  - Scenario / environment / fixture: every active dev skill, ADR/index/workflow, profile/script, eval registry/fixture, adapter, and plan/todo separation check
  - Evidence form: zero executable stale contracts; explicit historical/rejected references only; one canonical owner per current decision
  - Target recheck: TGT-CONV-STATE, TGT-CONV-PROFILE, TGT-CONV-BACKEND, TGT-CONV-ASSURANCE, TGT-CONV-ROUTER
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-CONV-ADR | T1 | Exact ADR/index/workflow target digest and runtime result payload | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T2 | One Common Handoff payload with AC/VR mapping, changed identities, current owner map, conflict check, effects, and route impact; unmaterialized unless recovery is real |
| OUTP-CONV-CORE | T2 | Exact state/profile/semantic target digest and runtime result payload | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T3 | One Common Handoff payload with state schema/API identity, tests, semantic traces, preserved hashes, blockers, and T3 readiness |
| OUTP-CONV-OMP | T3 | Exact OMP adapter/config target digest and disposable run reference | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T4 | One Common Handoff payload with native mechanics, unit/live proof, state identity, effects, cleanup, and T4 readiness |
| OUTP-CONV-GROK | T4 | Exact Grok plugin/config target digest and disposable run reference | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | T5 | One Common Handoff payload with native mechanics/limits, unit/live proof, state identity, effects, cleanup, and T5 readiness |
| OUTP-CONV-FINAL | T5 | TGT-CONV-FINAL aggregate digest, changed-path manifest, terminal/recovery Handoff, and exact smoke evidence | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-verification | One Common Handoff with every criterion/recipe, task attempt, state/run reference, papercut boundary, effect, protected hash, cleanup, blocker, and route impact |
| OUTP-CONV-ASSURANCE | T6 | Exact verified/reviewed target and terminal evidence index | completed, blocked, failed | dev-ask | One Common Handoff with verification/review/learning outcomes, repair/rerun accounting, residual risk, prohibited-effect proof, and completion eligibility |

No routine task output becomes a repository Markdown artifact. An actual context/session recovery may materialize the one Handoff authorized by CONTRACT-CONV-STATE. Arrival of a Handoff never changes canonical state without a valid compare-and-swap transition.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-CONV-DRIFT | current authority owner | Exact changed bytes, prior/current hashes, semantic conflict, and affected contract/criteria | T1, T2, T3, T4, T5 | Fresh semantic rebind; material route/authority change requires revised approval | Current bytes preserve this plan or an approved revision replaces it |
| BLK-CONV-STATE | convergence-implementation-owner | Stable helper error, exact run reference, state/Handoff digest, no-write proof, and smallest failed invariant | T2, T3, T4, T5, T6 | No default, reset, alternate store, or inferred recovery | Root cause fixed within current authority and exact state validates, or fresh `dev-ask` rebind authorizes recovery |
| BLK-CONV-OMP | OMP adapter owner | Missing native identity/root/extension capability, observed version/config, attempted equivalent, and no-effect proof | T3, T5, T6 | Non-equivalent adapter/topology change requires revised route approval | Required documented native capability is live-attested and focused smoke passes |
| BLK-CONV-GROK | Grok adapter owner | Plugin/MCP/hook failure, exact hook fail-open evidence, observed version/config, attempted equivalent, and preserved state | T4, T5, T6 | Hook failure cannot be treated as state capability; non-equivalent mechanism requires revised approval | Plugin, permit, state call, and gates are live-attested in one session or task returns transport-unavailable |
| BLK-CONV-PAPERCUT | ADR-0007/current papercut owner | Exact current v2 conflict, affected PC-ID mapping, disposable reproduction, and production-ledger hash | T5, T6 | No papercut redesign or ledger migration inside this plan | Existing v2 seam remains compatible through adapter/backend-only changes, or a material conflict returns for new authority |
| BLK-CONV-ASSURANCE | backend | Deduplicated AC/finding IDs, exact target, verifier/reviewer evidence, inherited repair/review state, and next unmet criterion | T6 | One consolidated repair only if token unused; no assurance repair or lifecycle reset | Repaired exact target passes impacted smoke and fresh proof/review, or outcome stops with blocker |

A failed task quarantines its descendants. Demonstrably unaffected read-only checks may continue, but no descendant consumes partial, stale, diagnostic-only, failed, timed-out, cancelled, or inferred output. Recovery always uses one exact run reference and Handoff; no transcript, history, memory, artifact directory, newest-file, or slug scan is permitted.

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-CONV-DESIGN | confirmed decision evidence | AUTH-USER-CONVERGENCE SHA-256 `80c46c0d60d899c96519805f426473238ef9b20e36c812c23b6fb4d120e07274` | Governs all twelve behavior decisions; implementation may derive mechanics but not change outcomes |
| ANC-CONV-HANDOFF | decision Handoff | AUTH-GRILL-HANDOFF SHA-256 `48965a452a6c81d5319e88fdc485bc813bfd4645509f31bb137718001ee33662` | Proves no unresolved human design decision and names implementation as next owner after plan approval |
| ANC-CONV-PAPERCUT | current separate authority | ADR-0007 D24 and current v2 helper/ledger contract | Prevents convergence state from becoming a second ledger, curator, or record owner |
| ANC-CONV-PLAN | portable plan boundary | `rule://plan`, `rule://plan-impl-spec`, `rule://plan-omp-transport`, `rule://plan-repo-storage`, current `executor_plan.py` | Keeps approved plan authority and projection separate from runtime state; validates this exact plan before execution |
| ANC-CONV-OMP-API | native adapter evidence | OMP 17.2.15 `session_start`, session switch/branch/tree, `tool_call`, `session_stop`, `registerTool`, session manager, and local root contracts | Limits OMP implementation to supported instance-specific mechanics |
| ANC-CONV-GROK-API | native adapter evidence | Grok 1.0.3 plugin manifest/MCP, hook envelope, `GROK_SESSION_ID`, `GROK_WORKSPACE_ROOT`, `GROK_PLUGIN_DATA`, PreToolUse/Stop, and documented hook fail-open behavior | Limits Grok implementation and forces truthful unavailable-capability mapping on hook failure |

- ASM-CONV-01: `/usr/bin/python3`, `/bin/sh`, Bun, OMP 17.2.15, and Grok 1.0.3 remain available during implementation smoke; if a required non-equivalent runtime is unavailable, return the exact blocker rather than adding a dependency or fallback.
- ASM-CONV-02: Current user papercut changes remain semantically stable through execution; concurrent semantic drift triggers BLK-CONV-PAPERCUT, while unrelated byte drift is rebound surgically.
- ASM-CONV-03: One owner can change the coupled state, semantic, and adapter surface sequentially within this plan; isolated lineages or neutral fan-in require revised route approval.
- ASM-CONV-04: No production session needs automatic migration at cutover; any real active legacy run receives a clean Handoff and explicit rebind, and unknown state blocks.

## Material approval boundary

Approval of this plan authorizes only T1 through T5 repository implementation and disposable proof under the named contracts and effects, followed by T6 read-only assurance and any already-governed terminal project-guidance curation. It confirms:

1. The exact confirmed decisions in AUTH-USER-CONVERGENCE remain current.
2. One sequential implementation owner is the intended topology.
3. ADR-0009 D26 may be created and affected current ADR/skill/profile/eval/harness contracts may be cleanly cut over.
4. OMP may load one new extension and Grok may load one new local plugin through the existing dotfiles-managed configs.
5. Disposable harness sessions and state roots may be created and removed for verification.
6. No production papercut record, Mnemopi memory, product authority, external service, Git staging/commit/push, or shipping effect is approved.

Any material change to observable workflow behavior, state ownership, adapter topology, external/destructive effects, production data, or shipping returns to `dev-ask` before mutation. A technical derivation that preserves these contracts continues without another approval.

## Sources

Primary evidence inspected while drafting:

- `local://dev-workflow-atlas-convergence-decision-evidence.md` and its exact SHA-256.
- `local://dev-workflow-atlas-convergence-grilling-handoff.md` and its exact SHA-256.
- Current `dev-ask`, `dev-implementation`, `dev-handoff`, `dev-verification`, `dev-code-review`, `dev-integration`, `dev-continual-learning`, papercut, plan, ADR, and workflow contracts.
- Current OMP extension documentation and 17.2.15 session/extension APIs.
- Current Grok 1.0.3 plugin manifest, MCP merge, custom hook guide, hook runner environment, and native hook failure semantics from the official `xai-org/grok-build` source.
- The exact six-day Atlas transcript metrics and failure findings recorded in AUTH-USER-CONVERGENCE, plus the current bounded efficiency inspection that found at least 56 unchanged nonterminal status observations; transcript text is not copied into this plan.

## Completion Summary

Pending execution. No implementation, adapter activation, production state migration, papercut mutation, external effect, or shipping action has occurred under this plan.
