# Progressive Local Checkpoint Commits

**Datetime**: 2026-09-01-0212
**Mode**: implementation
**Scope**: Progressive local checkpoint authority, orchestration, Git safety, recovery accounting, completion ordering, and permanent semantic evaluation
**Summary**: Make repository-local progressive checkpoint commits default mechanical bookkeeping for mutating dev-* execution while preserving separate authority for delivery and destructive history. Prove safe exact-path staging, nonblocking failure, ledger-free recovery, terminal self-reference handling, and the eight required permanent cases without adding a workflow owner or persistence layer.
**Status**: CLOSED

## Objective

- Outcome: OUT-PLC-01
- Observable end state: New mutating Executor Plans and direct Task Contracts declare one local-checkpoint policy; the implementation backend alone serializes exact-path normal commits at proven barriers, records all four dispositions, archives plan-backed DONE bytes before one terminal commit attempt, emits one post-attempt terminal Common Handoff, and presents completion without authorizing any remote or destructive Git effect.
- Progress signal: One owned AC-PLC criterion closes on the exact current target, or a named BLK-PLC blocker gains the evidence required by its ready condition. Commit count, file count, elapsed time, and agent count are not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-PLC-USER | Direct human architecture and acceptance authority | authority://progressive-local-checkpoints | Final design SHA-256 `3a8153e16e53125f274322d9e6c6eca54a18c20a1e8b1b01cae434f213944e99` and current Handoff | The design is settled; repository mutation and checkpoint effects begin only after native approval of this exact plan. |
| AUTH-PLC-WORKFLOW | Current generic engineering authority | `docs/adr/0001-dev-workflow-authority-and-routing.md`, `docs/adr/0002-executor-plans-and-orchestration.md`, `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md`, and `docs/adr/INDEX.md` | Git commit `aae79088e60aa888f4ca62fa570627d2c69afbff`; tracked targets clean at planning | Governs D14, D06, D08, D09, D27, and D29 until T1 performs the approved canonical revision. |
| AUTH-PLC-PLAN | Current Executor Plan and transport authority | `.config/agents/rules/plan.md`, `plan-impl-spec.md`, `plan-repo-storage.md`, `plan-omp-transport.md`, and `plan-grok-transport.md` | Git commit `aae79088e60aa888f4ca62fa570627d2c69afbff`; `.grok/rules` hardlinks share the same inodes | Governs plan identity, readiness, lifecycle records, exact-byte archive behavior, and native approval. |
| AUTH-PLC-GIT | Current generic and repository Git authority | `.config/agents/rules/git.md`, `.agents/rules/git-dotfiles.md`, `.agents/AGENTS.md`, `bin/dot-add`, and `manifest` | Git commit `aae79088e60aa888f4ca62fa570627d2c69afbff` | Requires allow-listed staging, staged-diff inspection, Conventional Commits, hook use, user-work preservation, and separate push authority. |
| AUTH-PLC-ASSURANCE | Current bounded assurance authority | `docs/adr/0003-bounded-assurance-and-repair.md` D03, D04, D22, and D28 | Git commit `aae79088e60aa888f4ca62fa570627d2c69afbff` | Selects standard assurance, one shared lineage, bounded repair, fresh verification, one review, and permanent-test value. |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-PLC-AUTHORITY | AUTH-PLC-USER final | Policy-authorized in-lifecycle exact-path staging and normal local commits are mechanical `dev-implementation` bookkeeping. Standalone commit requests, push, review request, release, deploy, rollout, destructive history, hook bypass, and every remote effect remain separately gated. |
| DEC-PLC-POLICY | AUTH-PLC-USER final | Every new mutating Executor Plan and direct Task Contract contains exactly one `Local checkpoints` value: `enabled`, `disabled by` one exact human AUTH ID, or `not-applicable`. Missing Git or commit failure never changes enabled to not-applicable. |
| DEC-PLC-OWNER | AUTH-PLC-USER final | Workers, verifiers, reviewers, curators, and integration children never stage or commit. The implementation root/backend owns one serialized repository/index critical section and creates no task, stage, skill, receipt schema, store, or ledger. |
| DEC-PLC-BARRIER | AUTH-PLC-USER final | A barrier is eligible only after same-owner closure, criterion-complete smoke, and every required proof needed for the output to be consumed. Root rechecks plan or direct-contract binding, ref, index, target manifest, proof identity, exact owned paths, and staged patch before one normal commit. |
| DEC-PLC-DIRTY | AUTH-PLC-USER final | Disjoint unstaged user paths remain untouched. Any pre-staged entry, same-file mixed ownership, or helper expansion beyond exact paths triggers one focused Ask naming every affected path; exact human authority may include those paths or skip that barrier. This repository exposes no ownership-safe partial-staging mode. |
| DEC-PLC-FAILURE | AUTH-PLC-USER final | Every barrier records exactly one committed, disabled, not-applicable, or failed disposition. Failure is nonblocking, consumes no semantic attempt or repair token, does not reopen proof, is attempted once for the exact barrier tuple, and is retried only after repository or capability evidence changes or exact human authority requests it. |
| DEC-PLC-ACCOUNTING | AUTH-PLC-USER final | Normal commits carry the four fixed `Checkpoint-*` trailers. Existing plan lifecycle lines, Completion Summary, Git ancestry, and the terminal Common Handoff recover the ordered chain; history alone is never authoritative and no new persistent record is added. |
| DEC-PLC-TERMINAL | AUTH-PLC-USER final | Plan-backed order is proof and progressive dispositions, Completion Summary, parser-valid DONE and exact archive, terminal commit attempt, terminal Common Handoff, then presentation. The archived Summary records earlier SHAs and the exact terminal payload but never the SHA of the commit containing itself. |
| DEC-PLC-PLANLESS | AUTH-PLC-USER final | A planless final verified-slice checkpoint is its final commit. Its terminal Common Handoff embeds a role-local `### Completion Summary`; both durable resume and Handoff locators may bind that one immutable artifact without a synthetic plan or store. |
| DEC-PLC-CUTOVER | AUTH-PLC-USER final | Update the existing ADRs, skills, rules, Git adapter, parser, completion accounting, workflow projection, and permanent semantic evals in place. Archived plans remain byte-identical; active or resumed pre-policy mutating plans require one bounded semantic revision and native reapproval. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-PLC-USER; the exact active ADR decisions; plan rules and hardlinked Grok mirrors; implementation, router, Handoff, shipping, presenter, and workflow contracts; Git rules/helper/manifest; exact papercut `pc-1bbd03aa0a592ee3`; parser, fixtures, tests, semantic registry, fixture producers, comparator, scanner, and current completion goldens.
- Change surfaces: Only TGT-PLC-AUTH-GIT, TGT-PLC-PLAN, TGT-PLC-RUNTIME, and TGT-PLC-EVAL. Preserve unrelated active plan `.agents/plans/2026-08-31-2116_retrace-repo-harness-evaluator.md`, every archived plan, user-level `/Users/kim/.agents/AGENTS.md`, every unrelated papercut record, product workflow, and unrelated fixtures.
- Non-goals: A new ADR or decision ID; a checkpoint route owner, stage, skill, task kind, outcome class, receipt schema, sidecar, store, ledger, temporary Git index, partial-hunk engine, compatibility reader, remote shipping automation, or retrospective rewrite of existing history.
- Prohibited effects: No push, review request, release, deploy, rollout, force operation, amend, squash, reset, rebase, stash, branch deletion, hook bypass, Git-configuration change, broad staging, raw staging bypass, credential/account change, live bootstrap, user-work unstage, archived-plan rewrite, or mutation outside declared targets. Root-owned local checkpoints follow `Local checkpoints: enabled` and do not grant any prohibited effect.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-PLC-AUTHORITY | Repository workflow authority mutation | AUTH-PLC-USER, AUTH-PLC-WORKFLOW | T1 changes only the named active ADR decisions and index projection; no new ADR; ordinary local reversal before delivery remains possible. |
| EFF-PLC-GIT | Repository Git contract, adapter, and exact papercut settlement | AUTH-PLC-USER, AUTH-PLC-GIT | T1 changes the generic and dotfiles Git rules, `bin/dot-add`, one new isolated test, and only the resolution fields of `pc-1bbd03aa0a592ee3`; no raw staging path or partial-hunk implementation. |
| EFF-PLC-PLAN | Executor Plan contract and parser mutation | AUTH-PLC-USER, AUTH-PLC-PLAN | T2 changes existing plan/transport rules, improve plan projection, parser, parser tests, and two fixtures; hardlinked `.grok/rules` bytes remain identical; report schema remains v1. |
| EFF-PLC-RUNTIME | Engineering lifecycle contract mutation | AUTH-PLC-USER, AUTH-PLC-WORKFLOW | T3 changes only existing router, implementation, orchestration, compact, Handoff, shipping, and workflow projections; completion-presentation remains byte-identical. |
| EFF-PLC-EVAL | Permanent semantic evaluation mutation | AUTH-PLC-USER, AUTH-PLC-ASSURANCE | T4 changes the central registry, exact old/new fixture objects, and comparator/scanner ownership sets; unrelated cases and completion-presentation goldens remain byte-identical. |
| EFF-PLC-EVIDENCE | Disposable local verification effect | AUTH-PLC-USER | Tasks may create only owner-tracked temporary Git repositories and session-local semantic observation roots outside the repository, then remove them after immutable evidence is sealed. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-PLC-POLICY | Local checkpoint authority | T1 | DEC-PLC-AUTHORITY, DEC-PLC-POLICY | T1, T2, T3, T4, router, backend, shipping |
| CONTRACT-PLC-GIT | Root-only checkpoint transaction | T1 | DEC-PLC-OWNER, DEC-PLC-BARRIER, DEC-PLC-DIRTY, DEC-PLC-FAILURE | T1, T3, T4, repository Git adapter |
| CONTRACT-PLC-PLAN | Executor Plan field and lifecycle projection | T2 | `Local checkpoints` in Execution policy; `executor-plan-validation/v1` output unchanged | T2, T3, T4, plan transports |
| CONTRACT-PLC-DISPOSITION | Barrier accounting and recovery | T2 | Exact adjacent `  - Local checkpoint: ...` lifecycle line, four exact disposition classes, and four fixed trailer keys; no new result schema | T2, T3, T4, terminal validation |
| CONTRACT-PLC-RUNTIME | Direct and plan-backed checkpoint lifecycle | T3 | DEC-PLC-BARRIER through DEC-PLC-PLANLESS | T3, T4, dev-ask, dev-implementation, dev-handoff, dev-shipping |
| CONTRACT-PLC-TERMINAL | Terminal self-reference and presentation order | T3 | Proof → checkpoints → Summary → DONE/archive → terminal attempt → terminal Handoff → presentation | T3, T4, completion callers, presenter |
| CONTRACT-PLC-EVAL | Permanent behavior matrix | T4 | Eight required local-checkpoint cases plus rewritten conflicting callers | T4, fresh verifier, final reviewer |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-PLC-AUTH-GIT | ADR-0001 D14; ADR-0002 D06/D08/D09/D29; ADR-0009 D27; `docs/adr/INDEX.md`; `.config/agents/rules/git.md` and hardlinked `.grok/rules/git.md`; `.agents/rules/git-dotfiles.md`; `bin/dot-add`; new `bin/test_dot_add.py`; exact `.agents/papercuts.json` record `pc-1bbd03aa0a592ee3` | T1 | Tracked paths at Git `aae79088e60aa888f4ca62fa570627d2c69afbff`; generic Git-rule hardlink inode `236107621`; new test absent; named papercut open | dev-ask, dev-implementation, dev-shipping, plan rules, repository staging callers, papercut resolver | AC-PLC-01, AC-PLC-02 |
| TGT-PLC-PLAN | `.config/agents/rules/plan.md`, `plan-impl-spec.md`, `plan-repo-storage.md`, `plan-omp-transport.md`, `plan-grok-transport.md`; hardlinked `.grok/rules` consumers; `.config/agents/skills/improve/references/plan-template.md`; `executor_plan.py`; `test_executor_plan.py`; `complete.md`; `fan_in.md` | T2 | Git `aae79088e60aa888f4ca62fa570627d2c69afbff`; hardlink inode pairing observed | plan authoring, OMP/Grok transport, improve plan authoring, archive helper, implementation readiness, parser fixtures | AC-PLC-03, AC-PLC-04 |
| TGT-PLC-RUNTIME | `dev-ask/SKILL.md`; `dev-implementation/SKILL.md`; `references/plan-orchestration.md`; `references/compact-checklist.md`; `dev-handoff/SKILL.md`; `dev-shipping/SKILL.md`; `dev-ask/WORKFLOW.md` | T3 | Git `aae79088e60aa888f4ca62fa570627d2c69afbff` | direct and planned execution, terminal normalization, Common Handoff, completion-presentation caller | AC-PLC-05, AC-PLC-06, AC-PLC-07, AC-PLC-08 |
| TGT-PLC-EVAL | `dev-ask/evals/evals.json`; the eight explicit checkpoint fixture paths named in T4; `compare_trace.py`; `compare_trace_selftest.json`; `scan_stale_contracts.py` | T4 | Git `aae79088e60aa888f4ca62fa570627d2c69afbff`; eight checkpoint fixture directories absent | semantic observer/comparator/scanner, parser cases, unchanged completion-presentation goldens, fresh standard verification | AC-PLC-09, AC-PLC-10, AC-PLC-11, AC-PLC-12, AC-PLC-13, AC-PLC-14, AC-PLC-15, AC-PLC-16 |

## Execution policy

- Assurance: standard
- Topology: full-orchestration, one shared lineage
- Max concurrency: 1
- Isolation: shared tree
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 through T4 run in order. Each child owns only its target group. The implementation root alone owns Git HEAD/index/commit as one exclusive critical section; no semantic worker performs a checkpoint effect. Recheck every tracked target against Git `aae79088e60aa888f4ca62fa570627d2c69afbff` and preserve the unrelated active plan before the first write.
- Decomposition: T1 establishes the canonical authority split and hardens the existing staging adapter so its first post-Handoff checkpoint can bootstrap the new policy. T2 adds the portable field and parser closure. T3 wires direct, planned, recovery, Handoff, terminal, and shipping behavior. T4 performs the clean permanent-case cutover. The standard profile tail is omitted; T4 receives fresh `dev-verification`, then the backend schedules one final review and one terminal learning assessment exactly once.
- Effect limit: EFF-PLC-AUTHORITY, EFF-PLC-GIT, EFF-PLC-PLAN, EFF-PLC-RUNTIME, EFF-PLC-EVAL, EFF-PLC-EVIDENCE
- Local checkpoints: enabled
- Orchestrator profile: `orchestrator-role-profile/v1`; `assess-plan-backed`; `full-orchestration`; `downgrade: none`; `PROMOTE-SERIAL-DEFAULT`. Missing or non-equivalent checkpoint-effect serialization yields BLK-PLC-CAPABILITY and never grants worker commit permission.

## Tasks

- [ ] T1. Establish checkpoint authority and safe repository staging
  - Owner: checkpoint-authority worker
  - Intent: Make reversible local recovery automatic without weakening delivery safety.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-PLC-AUTH-GIT
  - Contracts: CONTRACT-PLC-POLICY, CONTRACT-PLC-GIT
  - Criteria: AC-PLC-01, AC-PLC-02
  - Effects: EFF-PLC-AUTHORITY, EFF-PLC-GIT, EFF-PLC-EVIDENCE
  - Output: OUTP-PLC-T1
  - Receiver: T2
  - Verification: VR-PLC-01, VR-PLC-02
  - Lineage: shared

### T1 execution contract

1. Load `craft-rule`; re-read the six named ADR decisions, index rows, generic Git rule and its hardlinked Grok mirror, dotfiles Git companion, `bin/dot-add`, `manifest`, and all direct helper callers. Confirm tracked targets still match Git `aae79088e60aa888f4ca62fa570627d2c69afbff`; preserve every unrelated path and the user-owned active plan `.agents/plans/2026-08-31-2116_retrace-repo-harness-evaluator.md`.
2. Revise D14 so only policy-authorized in-lifecycle exact-path normal checkpoint commits leave `dev-shipping`; completion alone and standalone commit requests do not authorize them. Keep push, review request, release, deploy, rollout, credentials, hook bypass, and destructive history separately authorized. Revise D06/D08/D09/D29 and D27 to make the root-only operation, policy field, invisible mechanical accounting rather than an eighth event or task, terminal order, one terminal Common Handoff, unchanged twelve-key fence, and no-ledger boundary canonical. Update only the corresponding INDEX scope and decision summaries.
3. Deepen `bin/dot-add` in place without adding a second adapter: reject empty, absolute, dot, dot-dot, and traversal-bearing path components; derive direct repository-relative roots from `manifest` rather than a duplicated hardcoded root list; otherwise preserve `.config/` short-name expansion; resolve and manifest-check every argument before the first index mutation; accept an absent exact path only when Git resolves exactly that tracked path; invoke one `git add --` with the complete prevalidated exact path array; print one existing `added:` line per resolved argument after success. This must make explicit `.grok/...` hardlink paths stageable. Do not add partial staging, index replacement, commit behavior, locking, or broad fallback.
4. Add `bin/test_dot_add.py` using `unittest`, `tempfile`, and `subprocess` against `DOTFILES_REPO`. Cover short `.config` and explicit manifest-root paths including `.grok`, exact/descendant allow-listing, traversal rejection, rejection before mutation, atomic multi-path staging, exact tracked deletion, one active-plan-to-archive delete/add transition in a single call, a changed sibling left unstaged, directory-broadening characterization, and unchanged index on an invalid later argument. The test never touches the live repository index.
5. Keep rule layering thin. The generic Git base rule owns cross-repository policy-authorized normal-commit safety, fixed trailers, hook use, user-work preservation, and retained delivery/destructive gates. The dotfiles companion owns only explicit-file `dot-add`/manifest usage, no short directory alias for backend staging, and staging both tracked hardlink paths. Detailed critical-section procedure stays in `dev-implementation` orchestration, not duplicated into either rule. Preserve both rule names, minimal frontmatter, and the hardlinked Grok generic-rule bytes; add no TTSR, path trigger, or `alwaysApply`.
6. Run VR-PLC-01 and VR-PLC-02. The worker first emits one pre-checkpoint Common Handoff proving zero staging/commit effects by the child. After that Handoff and the durable VR-PLC-02 correction evidence exist, invoke the existing papercut resolver once for `pc-1bbd03aa0a592ee3` with outcome `fixed`, the execution date, and the Handoff/test evidence as durable reference; bind the compact result to the Handoff and preserve every other ledger record. After mechanical admission, the root may perform this plan's first enabled checkpoint only because the same exact T1 target has already established D14/D06 authority and the hardened helper has passed its disposable-repository smoke; its allowed staged set is the T1 semantic paths, the exact papercut settlement, and this plan's active lifecycle path, never the other active plan.

- [ ] T2. Enforce the portable checkpoint policy and plan accounting
  - Owner: checkpoint-plan worker
  - Intent: Make every execution contract state its local recovery policy explicitly.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-PLC-PLAN
  - Contracts: CONTRACT-PLC-POLICY, CONTRACT-PLC-PLAN, CONTRACT-PLC-DISPOSITION, CONTRACT-PLC-TERMINAL
  - Criteria: AC-PLC-03, AC-PLC-04
  - Effects: EFF-PLC-PLAN, EFF-PLC-EVIDENCE
  - Output: OUTP-PLC-T2
  - Receiver: T3
  - Verification: VR-PLC-03, VR-PLC-04
  - Lineage: shared

### T2 execution contract

1. Load `craft-rule`. Add `Local checkpoints` to `## Execution policy` after `Effect limit` and before `Orchestrator profile`. Define only exact `enabled`, exact `not-applicable`, or `disabled by` one current human Authority-table ID. The field authorizes root bookkeeping only, changes semantically under D02, and projects unchanged into each plan Task Contract and Context Pack. Keep `plan.md` as the generic lifecycle base, `plan-impl-spec.md` as the exact Executor Plan companion, and transport files mechanical; preserve names/frontmatter and add no TTSR or always-loaded duplicate. Do not add a header field, task field, output key, plan version, or compatibility default.
2. In `executor_plan.py`, add the required execution label; count its canonical label occurrences explicitly because `_labels` does not prove uniqueness; accept only the three forms; resolve a disabled AUTH through the existing Authority table; reject malformed, duplicate, missing, case-variant, multi-authority, or dangling values. Reuse existing missing/dangling issue codes and add only one focused invalid-value code. Preserve `executor-plan-validation/v1` and its exact seven-key payload.
3. Reject `enabled` when `Prohibited effects` contains a blanket staging-and-commit ban; allow exact-path local checkpoint language alongside remote/destructive prohibitions. Do not infer repository mutability from free-text effect kinds or targets; backend/Task Contract readiness owns the `not-applicable` basis.
4. Update `complete.md` to `enabled` and remove only its blanket local staging ban; update `fan_in.md` to `disabled by AUTH-FAN-IN` using its current direct Authority row and keep worker no-commit semantics. Extend parser tests for all valid/invalid policy forms, pre-policy omission, unchanged report keys, and fixture validity. Update the improve plan-template projection so any mutating Executor Plan it emits carries the exact field; do not redesign compact proportionality. Inspect but do not edit the plan-sync extension unless its existing exact-byte assertion fails after the fixture-only change.
5. Update plan lifecycle rules so each completed work or repair barrier gets exactly one line immediately after its existing completion record. The four literal prefixes are `  - Local checkpoint: committed ` followed by the full SHA, `  - Local checkpoint: disabled ` followed by the exact AUTH ID, `  - Local checkpoint: not-applicable ` followed by the exact basis, and `  - Local checkpoint: failed ` followed by the stable reason and evidence identity. The root writes the line only after the corresponding attempt or skip is known; exact Git evidence may restore it after interruption. Every semantic/work/assurance Handoff settles before Completion Summary, while exactly one backend-owned terminal Handoff is intentionally post-archive and post-attempt. Completion Summary carries the ordered pre-terminal chain, target-manifest reference, known failure residuals, and exact terminal archive-transition path set, but never the future terminal commit SHA. The parser continues to validate lifecycle structure and a nonempty Summary without introducing a disposition result schema.
6. Update repository/OMP/Grok transport rules so archive success gates the terminal attempt rather than presentation directly. The archive addition and, when previously tracked, active-plan deletion form the terminal archive-transition path set. Archive blockers still prevent terminal attempt, terminal Handoff, and output. Keep direct writers, OMP copying, hardlinked Grok semantics, and already-terminal exclusions exact.
7. Run VR-PLC-03 and VR-PLC-04, including validation of this exact in-progress active plan after the parser cutover. Emit one worker Handoff with no Git effect; root records T2's checkpoint disposition beside its completion record.

- [ ] T3. Wire checkpoint execution recovery and terminal reporting
  - Owner: checkpoint-runtime worker
  - Intent: Preserve every proven slice and expose failures without blocking valid work.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-PLC-RUNTIME
  - Contracts: CONTRACT-PLC-POLICY, CONTRACT-PLC-GIT, CONTRACT-PLC-PLAN, CONTRACT-PLC-DISPOSITION, CONTRACT-PLC-RUNTIME, CONTRACT-PLC-TERMINAL
  - Criteria: AC-PLC-05, AC-PLC-06, AC-PLC-07, AC-PLC-08
  - Effects: EFF-PLC-RUNTIME, EFF-PLC-EVIDENCE
  - Output: OUTP-PLC-T3
  - Receiver: T4
  - Verification: VR-PLC-05, VR-PLC-06, VR-PLC-07, VR-PLC-08
  - Lineage: shared

### T3 execution contract

1. In `dev-ask`, disclose the exact policy once in the five-section approval `## Safety`: mutating repository routes say `Local checkpoints: enabled` unless exact human authority supplies disabled; zero-delta or intentionally non-repository routes say not-applicable with the exact basis. Missing Git capability inside an otherwise eligible repository is failed, never not-applicable. Keep `shipping not authorized`, no sixth section, and no per-commit approval. A policy or exact additional-path authority change uses existing material reapproval; commit success/failure alone does not.
2. Add the exact field to direct Task Contract readiness and plan projection in `dev-implementation`; omission, mismatch, stale approval, or unresolved disabled authority blocks before `ready` with attempt 0. Active/resumed pre-policy plans receive one bounded semantic revision and native reapproval; archived plans remain untouched and silence never means disabled.
3. Define one session-local backend repository critical section keyed by the exact worktree/Git identity and reuse the existing Task Contract exclusive-resource field; add no lock file, store, coordinator, or schema. In deterministic accepted-work-Handoff order, require an ordinary usable ref with no unmerged entries or in-progress merge/rebase/cherry-pick/revert/bisect, then recheck policy, current ref, absence or exact human authorization of staged paths, exact semantic target-manifest bytes, proof locator, whole-file ownership, and exact stageable file list. Workers issue zero Git mutation commands. For planned progressive barriers the allowed staged set is the approved semantic paths plus the current root-owned active-plan lifecycle path when it has a delta; planless barriers have no plan path; exact human inclusion may add only the paths named in its authority. Before staging, derive one aggregate checkpoint target manifest in the existing target-manifest form covering every allowed path, state, and identity; add no manifest schema. Use only the repository helper, require the global staged patch to equal that manifest, capture the pre-commit ref/index-tree identity, recheck ref/index immediately before commit, validate the Conventional Commit first line, and run one normal commit with these fixed trailers: `Checkpoint-Plan`, `Checkpoint-Task`, `Checkpoint-Target-SHA256`, and `Checkpoint-Proof`.
4. Fix trailer values: planned `Checkpoint-Plan` is the stable Datetime/slug identity and direct work is `direct`; planned `Checkpoint-Task` is `Tn/OUTP-ID`, direct work is `direct/OUT-ID`, repairs are `repair-N/OUT-ID`, and the terminal barrier is `terminal/OUT-ID`. `Checkpoint-Target-SHA256` is the lowercase SHA-256 of the exact aggregate checkpoint target manifest, including authorized lifecycle or human-included paths; the terminal value hashes the archive-transition manifest. `Checkpoint-Proof` is the immutable semantic recipe or aggregate locator, using the terminal validation plus archive-postcondition locator at the terminal barrier. Git parent order plus full returned object IDs supplies successful ordering.
5. Record exactly `committed` plus the full 40- or 64-character lowercase object ID, `disabled` plus the exact AUTH ID, `not-applicable` plus a concrete no-delta basis, or `failed` plus one stable reason and immutable evidence identity. Do not classify from process status alone: an exact new commit with the expected parent, tree, and four trailers that remains reachable from the current ref is committed; any later descendant triggers ordinary ref-drift handling separately. An unchanged ref after rejection is failed; an unexpected ref/tree/trailer state is failed as ambiguous and invokes existing drift/recovery handling without history mutation. Seal one disposition per retry-suppression tuple: plan or direct-contract revision, task/attempt/barrier, ordered proof identities, and aggregate target-manifest identity. A changed repository/capability state may open a new explicitly identified barrier while the earlier failed disposition remains immutable; do not rerun an unchanged barrier, consume semantic attempts, reopen proof, diagnose, amend, or bypass hooks.
6. Before staging, one focused Ask names all ordinary pre-staged or same-file mixed paths and offers only exact inclusion or checkpoint skip. Inclusion authority binds those paths into the aggregate checkpoint target manifest and final global patch inspection; skip records a failed mixed-work disposition. Unmerged entries or an in-progress Git operation are never includable and fail before staging. Dotfiles partial staging remains unavailable. After any post-stage failure, preserve the index, stop further compounding checkpoint attempts, continue non-checkpoint lifecycle work where safe, and report every staged/uncommitted path.
7. Extend the existing Common Handoff, not its schema family. Worker Handoffs bind policy, task/output, semantic target manifest, proof, exact semantic paths, and the root-owned active-plan path when applicable while stating that the worker made no commit. Root accounting binds the aggregate checkpoint target-manifest identity and exact additional authority. The terminal backend Handoff `## Result` carries policy and every ordered disposition, `## Evidence` carries each immutable attempt observation and checkpoint manifest, and `## Risks and unresolved items` carries failed consequences. It is the only owner of the terminal full SHA or failed terminal disposition.
8. Plan-backed DONE order is exact: all semantic and assurance evidence; remaining progressive disposition; Completion Summary and parser-valid DONE bytes; exact archive postcondition; one terminal commit attempt whose staged set is exactly the archive addition plus the active-plan deletion when that path was previously tracked; terminal backend Handoff; dev-ask normalization; same-agent presenter. Exclude every semantic path from an earlier failed checkpoint and every unrelated path from the terminal payload. Archive failure blocks all later steps; terminal commit failure does not and is unioned into completion residual risk. A current-session human-authorized CLOSED transition follows terminal-byte validation → archive postcondition → the same policy-controlled terminal attempt → one cancellation Common Handoff/report, with no Completion Summary or completion presentation. Intake already at DONE or CLOSED performs no archive lookup, checkpoint attempt, or new Handoff.
9. Planless work performs zero repository-plan or archive actions. After the final verified-slice checkpoint, its immutable terminal Common Handoff embeds `### Completion Summary` with outcome, decisions, evidence, target manifest, ordered dispositions, and current risk. `resume_from` and `handoff` may bind the same durable Handoff identity at `#completion-summary`.
10. Resume validates existing disposition plus plan/task binding, exact trailers, target digest, proof identity, and ancestry. Exactly matching successful Git evidence may restore an interrupted committed disposition; Git history alone may not. Ambiguous evidence records failed and never rewrites history. If interruption occurs after a terminal failure but before durable Handoff sealing, return BLK-PLC-RECOVERY; do not infer, retry, add persistence, or present completion.
11. Keep `completion-presentation/SKILL.md` and its twelve-key eval registry byte-identical: no checkpoint input key, heading, commit effect, or Handoff creation. Its caller may map a failed local checkpoint into existing `residual_risk`; planned `resume_from` remains the archive Summary and `handoff` names the post-attempt terminal Handoff. Revise `dev-shipping` so policy-authorized lifecycle checkpoints are excluded while standalone commit requests and every delivery/destructive action remain exact-human-authority work.
12. Load `craft-skill` and preserve every skill name, directory, transport, and frontmatter field except the two discovery descriptions whose role boundary changes. In `dev-implementation`, replace the current read-only-backend clause with `Defer compact Learning Candidates and own backend lifecycle, local-checkpoint bookkeeping, or terminal-evidence traces.` Set the `dev-shipping` description to `Perform only explicitly authorized delivery actions and complete-check-set CI recovery with rollback evidence. Use when a human separately requests standalone staging or commit, push, review-request, release, deploy, or rollout; skip policy-authorized dev-implementation local checkpoints and never infer shipping permission from local completion, review approval, or a passing subset of checks.` Keep activation-critical authority/worker-prohibition text in each `SKILL.md`, transaction detail in existing `references/plan-orchestration.md`, planless detail in `references/compact-checklist.md`, and do not add a skill/reference/script. Project only the portable current behavior into `WORKFLOW.md`. Run VR-PLC-05 through VR-PLC-08, then emit a worker Handoff with no Git effect; root records T3's checkpoint disposition.

- [ ] T4. Lock the checkpoint lifecycle with permanent behavior cases
  - Owner: checkpoint-eval worker
  - Intent: Keep local recovery reliable across success failure repair and completion.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-PLC-EVAL
  - Contracts: CONTRACT-PLC-POLICY, CONTRACT-PLC-GIT, CONTRACT-PLC-PLAN, CONTRACT-PLC-DISPOSITION, CONTRACT-PLC-RUNTIME, CONTRACT-PLC-TERMINAL, CONTRACT-PLC-EVAL
  - Criteria: AC-PLC-09, AC-PLC-10, AC-PLC-11, AC-PLC-12, AC-PLC-13, AC-PLC-14, AC-PLC-15, AC-PLC-16
  - Effects: EFF-PLC-EVAL, EFF-PLC-EVIDENCE
  - Output: OUTP-PLC-T4
  - Receiver: dev-verification
  - Verification: VR-PLC-09, VR-PLC-10, VR-PLC-11, VR-PLC-12, VR-PLC-13, VR-PLC-14, VR-PLC-15, VR-PLC-16
  - Lineage: shared

### T4 execution contract

1. Add exactly these eight permanent dev-ask cases and matching explicit fixture inputs: `B-LOCAL-CHECKPOINT-PLAN-TERMINAL` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-plan-terminal/case.json`, `B-LOCAL-CHECKPOINT-PLANLESS-PROGRESSIVE` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-planless-progressive/case.json`, `R-LOCAL-CHECKPOINT-STALE-PLAN-REAPPROVAL` in `.config/agents/skills/dev-ask/evals/fixtures/r-local-checkpoint-stale-plan-reapproval/case.json`, `B-LOCAL-CHECKPOINT-HUMAN-OPT-OUT` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-human-opt-out/case.json`, `B-LOCAL-CHECKPOINT-MIXED-WORK` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-mixed-work/case.json`, `B-LOCAL-CHECKPOINT-GIT-FAILURES` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-git-failures/case.json`, `B-LOCAL-CHECKPOINT-REPAIR-LATER-COMMIT` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-repair-later-commit/case.json`, and `B-LOCAL-CHECKPOINT-TERMINAL-ORDER` in `.config/agents/skills/dev-ask/evals/fixtures/b-local-checkpoint-terminal-order/case.json`. The stale-plan case is a router prefix trace bound to `.config/agents/skills/dev-ask/SKILL.md`; the other seven are backend full traces bound to `.config/agents/skills/dev-implementation/SKILL.md`.
2. `B-LOCAL-CHECKPOINT-PLAN-TERMINAL` proves a semantic-slice commit and the post-archive terminal attempt with worker Git count zero, fixed trailers, full SHAs, plan disposition lines, terminal Handoff, and no remote/destructive effect. Its five-file Wait/Rethink target is exactly `.config/agents/skills/dev-implementation/references/plan-orchestration.md`, `.config/agents/skills/dev-implementation/SKILL.md`, `.config/agents/skills/dev-ask/evals/evals.json`, `.config/agents/skills/dev-ask/evals/fixtures/b-plan-wait-no-poll/case.json`, and `.config/agents/skills/dev-ask/evals/fixtures/b-continuation-rethink/case.json`. Its seven-file Reconcile target is exactly `.config/agents/skills/reconcile/SKILL.md`, `.config/agents/skills/reconcile/references/reviewer-protocol.md`, `.config/agents/skills/reconcile/evals/evals.json`, `.config/agents/harnesses/omp/agents/second-opinion-a.md`, `.config/agents/harnesses/omp/agents/second-opinion-b.md`, `.config/agents/harnesses/omp/config.yml`, and `.config/scripts/bootstrap`. Mirror those paths as fixture data only; do not edit the completed Reconcile suite.
3. `B-LOCAL-CHECKPOINT-PLANLESS-PROGRESSIVE` proves an enabled direct Task Contract, ordered independently proved normal commits, a final verified-slice commit, embedded terminal-Handoff Completion Summary, both durable locators, and zero plan lookup/archive/synthetic-store activity.
4. `R-LOCAL-CHECKPOINT-STALE-PLAN-REAPPROVAL` proves a missing/conflicting field or blanket prohibition stops before ready/effects and receives exactly one native reapproval bound to the revised digest while preserving completed history, attempts, and repair state. `B-LOCAL-CHECKPOINT-HUMAN-OPT-OUT` proves exact human AUTH binding, zero Git discovery/stage/commit calls, and `disabled AUTH-ID` at every eligible barrier without treating silence, missing Git, or failure as disabled.
5. `B-LOCAL-CHECKPOINT-MIXED-WORK` has exact-path include and skip branches. Both name every pre-staged and same-file path in one Ask; include commits only the exact authorized global staged patch, skip records one failed disposition, a no-owned-delta branch records a concrete not-applicable basis, and no branch broad-stages, unstages, or uses partial staging.
6. `B-LOCAL-CHECKPOINT-GIT-FAILURES` independently covers missing Git, unusable/in-progress repository state, commit-hook rejection, repository/index/object permission rejection, and a post-invocation ambiguous-ref branch. Each exact barrier is attempted at most once, classifies outcome from exact ref/tree/trailer evidence rather than exit status alone, preserves semantic success and unrelated work, consumes no semantic attempt/reapproval, suppresses unchanged retry, and forbids hook/config bypass, permission escalation, raw staging, amend, reset, and rebase.
7. `B-LOCAL-CHECKPOINT-REPAIR-LATER-COMMIT` proves an immutable earlier checkpoint followed by fresh repair proof and a distinct normal descendant commit with no history rewrite. `B-LOCAL-CHECKPOINT-TERMINAL-ORDER` proves proof → preterminal dispositions → Summary → DONE/archive → terminal attempt → terminal Handoff → normalization → presentation, terminal self-reference exclusion, CLOSED and already-terminal branches, archive blockers, and nonblocking terminal failure. Its exact forbidden tuple covers worker Git effects, early terminal actions, a second terminal Handoff, push, review request, release, deploy, rollout, remote mutation, stash, amend, reset, rebase, squash, force operations, hook bypass, and any new stage/task/skill/receipt/store/ledger owner.
8. Rewrite every existing case that conflicts with the cutover rather than adding compatibility semantics: `B-SHIPPING`, `B-SHIPPING-NEAR-MISS-LOCAL-COMPLETION`, `R-T5-REAPPROVAL-SHIPPING`, `R-APPROVAL`, `R-ORDINARY-COMPACT-DIRECT`, `L-MUTATION`, `L-ONE-OWNER`, `R-COMPLETE`, `R-COMPLETE-COMPACT-NO-LEARNING`, `R-COMPLETE-NEAR-MISS`, `B-COMPLETION`, `B-T5-COMPLETION-ASSURED`, `B-T5-COMPLETION-MISSING-ASSURANCE`, `B-ASSURANCE-RECEIPT-COMPLETION`, `B-PLAN-TAIL-PROFILE`, `B-PLAN-TAIL-OMITTED`, `B-COMPACT-PLAN-NO-TAIL`, `B-TERMINAL-PLAN-ARCHIVE-MATRIX`, `B-DWO-WORKER-CLOSURE`, `B-T5-EXECUTOR-PLAN-CYCLE`, `B-T5-EXECUTOR-PLAN-DANGLING`, `B-T5-EXECUTOR-PLAN-GROK`, `B-T5-EXECUTOR-PLAN-MISSING`, and `B-T5-EXECUTOR-PLAN-OMP`. Keep `B-PLAN-WAIT-NO-POLL` and `B-CONTINUATION-RETHINK` as explicit no-checkpoint controls because waiting and draft-Ask rethink are not proved mutation. Bind `L-MUTATION` to not-applicable with exact basis `disposable runtime is not a Git repository`; never invent a committed SHA. Preserve missing semantic assurance as blocking before checkpoints; distinguish standalone commit shipping from automatic lifecycle checkpoints.
9. Add all eight IDs to `compare_trace.py` `ADDED_IDS`, add every rewritten baseline to `REWRITE_IDS`, and update matching fixture source manifests, `scan_stale_contracts.py` semantic maps, terminal event constants, caller paths, forbidden fragments, protected D14/dev-shipping identities, exact expected `dev-implementation` and `dev-shipping` descriptions, and self-tests. Reuse the existing registry, bind/seal observer, `lean-eval-receipt/v1`, ordered-subsequence comparator, and observation/runtime schemas unchanged.
10. Keep completion-presentation code and goldens unchanged. Validate caller-owned failed-checkpoint `residual_risk`, archive Summary `resume_from`, and terminal-Handoff `handoff` through the rewritten backend/router completion cases; forbid presenter-owned checkpoint fields, Handoffs, or Git effects. Keep Reconcile reviewers and its eval registry read-only and unchanged.
11. Run VR-PLC-09 through VR-PLC-16 using the final target digest and disposable observation roots. Settle every changed permanent case under `test-value/v1`; merge any new case whose unique bug is already defended. Seal the exact changed-case/fixture manifest, target manifest, receipts, and one Common Handoff before the root attempts T4's checkpoint.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-PLC-01 | New mutating route and later standalone delivery request | One approval discloses local checkpoints; backend may checkpoint; standalone commit/push remains separately gated; completion still says shipping not authorized. | TGT-PLC-AUTH-GIT | T1 |
| AC-PLC-02 | Exact multi-file slice, explicit `.grok` path, tracked deletion/archive addition, traversal/invalid later path, disjoint user change, and open staging papercut | Hardened `dot-add` resolves manifest roots without a duplicate root list, stages one prevalidated exact set atomically including the terminal delete/add pair, rejects traversal, leaves disjoint work unstaged and the index unchanged on preflight failure, then only `pc-1bbd03aa0a592ee3` settles fixed from durable proof. | TGT-PLC-AUTH-GIT | T1 |
| AC-PLC-03 | Executor Plans using enabled, disabled, not-applicable, missing, duplicate, malformed, or dangling policy | Only the three exact closed forms validate; disabled authority resolves; field is unique; report schema and keys remain unchanged. | TGT-PLC-PLAN | T2 |
| AC-PLC-04 | Active/resumed pre-policy plan or enabled plan with blanket local staging/commit ban | Readiness stops before mutation and requires one bounded semantic revision plus native reapproval; archived plans remain unchanged. | TGT-PLC-PLAN | T2 |
| AC-PLC-05 | Two checkpoint-ready outputs and one repair output | Workers commit zero times; root critical sections never overlap; each exact barrier receives one disposition and repair creates a later normal commit. | TGT-PLC-RUNTIME | T3 |
| AC-PLC-06 | Pre-staged entries or same-file mixed ownership | One focused Ask names exact files; include and skip branches preserve user authority; no broad/partial staging or automatic unstage occurs. | TGT-PLC-RUNTIME | T3 |
| AC-PLC-07 | Missing Git, ref/helper/permission/hook failure, repeated barrier, or ambiguous recovery | One stable failed disposition is nonblocking and visible; unchanged retry count is zero; proof remains closed unless actual target/index/ref drift invokes existing rules. | TGT-PLC-RUNTIME | T3 |
| AC-PLC-08 | Successful and failed plan-backed terminal attempts plus planless completion | Exact terminal order holds; archive remains the planned resume source; final SHA or failure exists only in terminal Handoff; planless Handoff supplies its own Completion Summary. | TGT-PLC-RUNTIME | T3 |
| AC-PLC-09 | Plan-backed progressive success | At least one semantic slice commit and one terminal archive commit have full SHAs, fixed trailers, exact ancestry, and ordered accounting. | TGT-PLC-EVAL | T4 |
| AC-PLC-10 | Planless progressive success | Final verified-slice commit precedes one durable terminal Handoff/Completion Summary with zero plan/archive/store activity. | TGT-PLC-EVAL | T4 |
| AC-PLC-11 | Stale conflict and exact human opt-out | Conflict stops for reapproval; opt-out makes zero Git effects and records exact disabled authority. | TGT-PLC-EVAL | T4 |
| AC-PLC-12 | Mixed-work include and skip inputs | Exact Ask branches commit only authorized content or record one nonblocking failed skip while preserving the index/worktree. | TGT-PLC-EVAL | T4 |
| AC-PLC-13 | Missing Git plus hook and permission failures | Each failure is attempted once, evidenced, nonblocking, and rendered as current residual risk with uncommitted paths. | TGT-PLC-EVAL | T4 |
| AC-PLC-14 | Post-assurance repair after an earlier checkpoint | A later child produces a new normal descendant commit; prior SHA remains unchanged; no history rewrite command occurs. | TGT-PLC-EVAL | T4 |
| AC-PLC-15 | Terminal success, archive blocker, and terminal commit failure | Success order is exact; archive blocker prevents later actions; commit failure still emits terminal Handoff and presentation without rollback. | TGT-PLC-EVAL | T4 |
| AC-PLC-16 | Wait/Rethink five-file and Reconcile seven-file target branches | Each verified target is checkpointed before its plan archive; each archive is then included in one terminal bookkeeping commit; forbidden remote/destructive counts are zero. | TGT-PLC-EVAL | T4 |

## Verification / Done criteria

- [ ] VR-PLC-01. Prove the authority and shipping cutover
  - Criterion: AC-PLC-01
  - Proof class: worker smoke
  - Scenario / environment / fixture: From `/Users/kim/.dotfiles`, inspect exact D14/D06/D08/D09/D27/D29, INDEX, generic/dotfiles Git rules and the generic Grok hardlink, and `dev-shipping` projections after T1; search the declared caller set for blanket checkpoint prohibition and retained delivery/destructive gates.
  - Evidence form: One decision-to-caller matrix shows local lifecycle checkpoints allowed once and push/review/release/deploy/rollout/destructive history still separately authorized; the generic Git-rule hardlink remains byte-identical.
  - Target recheck: TGT-PLC-AUTH-GIT
  - Receiver: T2
- [ ] VR-PLC-02. Exercise exact-path staging in disposable repositories
  - Criterion: AC-PLC-02
  - Proof class: worker smoke
  - Scenario / environment / fixture: From repository root run `bash -n bin/dot-add` and `PYTHONDONTWRITEBYTECODE=1 python3 bin/test_dot_add.py`; tests create only temporary Git repositories through `DOTFILES_REPO`.
  - Evidence form: Both commands exit zero; the test receipt names manifest-derived `.grok` resolution, traversal rejection, atomic multi-path staging, exact tracked deletion/archive addition, disjoint unstaged preservation, and zero index delta on preflight rejection; the papercut resolver reports `fixed` for `pc-1bbd03aa0a592ee3` with every unrelated record preserved.
  - Target recheck: TGT-PLC-AUTH-GIT
  - Receiver: T2
- [ ] VR-PLC-03. Validate every checkpoint policy form
  - Criterion: AC-PLC-03
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/test_executor_plan.py`, then validate `complete.md`, `fan_in.md`, and this plan's exact active repository path with `.config/agents/skills/dev-implementation/scripts/executor_plan.py validate`.
  - Evidence form: Unit suite exits zero; all three reports are valid `executor-plan-validation/v1` objects with the unchanged seven keys; the negative matrix reports the expected missing/dangling/focused-invalid codes.
  - Target recheck: TGT-PLC-PLAN
  - Receiver: T3
- [ ] VR-PLC-04. Prove plan transport and reapproval boundaries
  - Criterion: AC-PLC-04
  - Proof class: worker smoke
  - Scenario / environment / fixture: Run `bun test .config/agents/harnesses/omp/extensions/plan-artifact-sync.test.js`; inspect OMP/Grok hardlink identities; run parser negatives for old missing field and enabled plus blanket prohibition.
  - Evidence form: Extension tests exit zero; hardlinked rule pairs remain inode-identical and byte-identical; both stale-policy plans stop before ready with no mutation.
  - Target recheck: TGT-PLC-PLAN
  - Receiver: T3
- [ ] VR-PLC-05. Prove serialized root-only checkpoint barriers
  - Criterion: AC-PLC-05
  - Proof class: worker smoke
  - Scenario / environment / fixture: Execute `B-LOCAL-CHECKPOINT-PLAN-TERMINAL` and `B-LOCAL-CHECKPOINT-REPAIR-LATER-COMMIT` through the final dev-ask semantic observer/comparator contract on the exact target digest.
  - Evidence form: PASS receipts show worker commit count zero, nonoverlapping root critical sections, exact staged sets, ordered full SHAs, and later repair ancestry without rewrite.
  - Target recheck: TGT-PLC-RUNTIME
  - Receiver: T4
- [ ] VR-PLC-06. Prove focused mixed-work preservation
  - Criterion: AC-PLC-06
  - Proof class: worker smoke
  - Scenario / environment / fixture: Execute `B-LOCAL-CHECKPOINT-MIXED-WORK` against include and skip branches with exact pre-staged and same-file paths.
  - Evidence form: PASS receipt shows one exact Ask per branch, no automatic partial/broad stage or unstage, and the required committed-or-failed disposition.
  - Target recheck: TGT-PLC-RUNTIME
  - Receiver: T4
- [ ] VR-PLC-07. Prove nonblocking failures and retry suppression
  - Criterion: AC-PLC-07
  - Proof class: worker smoke
  - Scenario / environment / fixture: Execute `B-LOCAL-CHECKPOINT-GIT-FAILURES` and the stale/recovery branch of `R-LOCAL-CHECKPOINT-STALE-PLAN-REAPPROVAL`.
  - Evidence form: PASS receipt shows one attempt per exact tuple, zero unchanged retries, semantic completion preserved, current residual risk, and bounded architecture finding on unrecoverable post-archive failure interruption.
  - Target recheck: TGT-PLC-RUNTIME
  - Receiver: T4
- [ ] VR-PLC-08. Prove terminal and planless self-reference boundaries
  - Criterion: AC-PLC-08
  - Proof class: worker smoke
  - Scenario / environment / fixture: Execute `B-LOCAL-CHECKPOINT-TERMINAL-ORDER` and `B-LOCAL-CHECKPOINT-PLANLESS-PROGRESSIVE`; verify presenter input retains twelve keys and the planned archive digest is distinct from the terminal Git SHA.
  - Evidence form: PASS receipts show exact order, final disposition only in terminal Handoff, embedded planless Completion Summary, and zero synthetic plan/store behavior.
  - Target recheck: TGT-PLC-RUNTIME
  - Receiver: T4
- [ ] VR-PLC-09. Lock plan-backed progressive success
  - Criterion: AC-PLC-09
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare `B-LOCAL-CHECKPOINT-PLAN-TERMINAL` from a fresh disposable root using final `evals.json`, matching case fixture, `dev-implementation/SKILL.md`, and final target digest.
  - Evidence form: One sealed `lean-eval-receipt/v1` PASS with semantic-slice and terminal full SHAs, trailers, ancestry, plan Summary rows, and terminal Handoff.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-10. Lock planless progressive success
  - Criterion: AC-PLC-10
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare `B-LOCAL-CHECKPOINT-PLANLESS-PROGRESSIVE` with the backend binding selected by its registry layer and exact final target digest.
  - Evidence form: Sealed PASS receipt with final commit SHA, embedded Handoff Summary, two resolvable locators, and plan/archive/store counts zero.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-11. Lock stale-plan and opt-out handling
  - Criterion: AC-PLC-11
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare `R-LOCAL-CHECKPOINT-STALE-PLAN-REAPPROVAL` and `B-LOCAL-CHECKPOINT-HUMAN-OPT-OUT` on the final target.
  - Evidence form: Two PASS receipts showing pre-ready bounded reapproval and exact AUTH-disabled zero-effect accounting.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-12. Lock mixed-work branches
  - Criterion: AC-PLC-12
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare both scripted branches of `B-LOCAL-CHECKPOINT-MIXED-WORK`.
  - Evidence form: PASS receipt maps exact affected paths to include/skip authority, committed/failed disposition, and preserved unrelated state.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-13. Lock unavailable and failed checkpoint reporting
  - Criterion: AC-PLC-13
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare every independent branch of `B-LOCAL-CHECKPOINT-GIT-FAILURES` plus the rewritten backend/router completion cases that carry failed terminal checkpoint risk.
  - Evidence form: PASS receipts show one attempt, stable evidence identity, zero bypass/retry, complete status, visible residual risk, and exact uncommitted paths.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-14. Lock repair history preservation
  - Criterion: AC-PLC-14
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare `B-LOCAL-CHECKPOINT-REPAIR-LATER-COMMIT` on a trace with one initial and one repaired target.
  - Evidence form: PASS receipt shows two distinct normal descendant SHAs and zero amend/reset/rebase/squash/force events.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-15. Lock exact terminal ordering and blockers
  - Criterion: AC-PLC-15
  - Proof class: worker smoke
  - Scenario / environment / fixture: Observe and compare `B-LOCAL-CHECKPOINT-TERMINAL-ORDER`, rewritten `B-TERMINAL-PLAN-ARCHIVE-MATRIX`, `R-COMPLETE`, and `R-COMPLETE-COMPACT-NO-LEARNING`.
  - Evidence form: PASS receipts prove success, archive-blocked, failed-terminal-commit, CLOSED, already-terminal, and planless branches with the exact allowed stop/output boundaries.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification
- [ ] VR-PLC-16. Prove closed caller and required-case completeness
  - Criterion: AC-PLC-16
  - Proof class: worker smoke
  - Scenario / environment / fixture: From repository root run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test`, `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`, `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`, and `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; parse `evals.json` and every changed fixture JSON before the scanner.
  - Evidence form: All commands exit zero; scanner reports no stale/missing contract; exactly eight new checkpoint cases and the declared rewritten set are owned; Wait/Rethink controls stay checkpoint-free while the exact five-file and seven-file historical target branches pass; no new ADR/stage/skill/schema/store/ledger token appears as an implemented owner.
  - Target recheck: TGT-PLC-EVAL
  - Receiver: dev-verification

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-PLC-T1 | T1 | TGT-PLC-AUTH-GIT exact target manifest and staging smoke | completed, blocked, authority-change-required | T2 | Existing Common Handoff with zero worker commit and root checkpoint input |
| OUTP-PLC-T2 | T2 | TGT-PLC-PLAN exact target manifest and parser receipts | completed, blocked, transport-unavailable | T3 | Existing Common Handoff with policy projection and root checkpoint input |
| OUTP-PLC-T3 | T3 | TGT-PLC-RUNTIME exact target manifest and semantic receipts | completed, blocked, authority-change-required | T4 | Existing Common Handoff with runtime/accounting delta and root checkpoint input |
| OUTP-PLC-T4 | T4 | TGT-PLC-EVAL exact changed-case manifest and receipts | completed, blocked, failed, transport-unavailable | dev-verification | Existing Common Handoff with permanent-test dispositions and root checkpoint input |

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-PLC-DRIFT | implementation root | Exact changed path, old/new digest, authority effect, and preservation state | T1, T2, T3, T4 | Material target/authority change uses D02; unrelated drift is preserved | Current target and authority manifests match or one approved bounded revision replaces them. |
| BLK-PLC-CAPABILITY | implementation root | Disposable-repository proof of one serialized exact-path normal commit critical section, or exact missing capability and unsafe state | all | No silent topology or effect downgrade; architecture finding returns to dev-ask | Live root can prove serialization and exact staged-set postconditions, or the bounded finding is accepted as the terminal result. |
| BLK-PLC-STAGING | implementation root | HEAD/index/path/proof snapshots, helper result, staged patch, and preservation identity | T1, T2, T3, T4 | Checkpoint remains nonblocking; semantic authority unchanged unless target/ref drift exists | One allowed disposition is recorded; no unsafe cleanup or duplicate attempt remains. |
| BLK-PLC-RECOVERY | implementation root | Bound plan/direct revision, exact barrier tuple, trailers, target/proof identities, ancestry, terminal archive, and durable Handoff state | all | No history-only inference, automatic retry, archive rewrite, or new store | Cross-check is exact, or one failed/architecture disposition and residual risk is durably sealed before presentation. |
| BLK-PLC-EVAL | T4 | Case ID, fixture digest, observed trace, failed assertion, and target digest | T4 | Repair only under existing D03 budget and unchanged contract | Every owned permanent case passes against the exact final target and all unrelated cases remain preserved. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-PLC-ADR | Canonical decision | `docs/adr/0002-executor-plans-and-orchestration.md` D06, D08, D09, D29 | Root authority, field shape, accounting, and terminal order. |
| ANC-PLC-RUNTIME | Executable skill | `.config/agents/skills/dev-implementation/SKILL.md` Task Contract, scheduler, Handoff, and Completion | Direct/plan-backed backend owner and exact checkpoint critical section. |
| ANC-PLC-ORCHESTRATION | Procedure | `.config/agents/skills/dev-implementation/references/plan-orchestration.md` work attempt and backend schedule | Deterministic barrier order, repair, archive, and terminal Handoff. |
| ANC-PLC-PARSER | Validator | `.config/agents/skills/dev-implementation/scripts/executor_plan.py` `EXECUTION_FIELDS`, `_labels`, and `validate_text` | Exact policy syntax and unchanged v1 result. |
| ANC-PLC-GIT | Repository adapter | `bin/dot-add`, `.config/agents/rules/git.md`, hardlinked `.grok/rules/git.md`, and `.agents/rules/git-dotfiles.md` | Allow-listed exact-path staging and normal commit safety. |

- ASM-PLC-01: The live implementation root can serialize its own checkpoint operations and detect external ref/index drift while holding the session-local repository critical section. If it cannot prove that contract at T1, stop with BLK-PLC-CAPABILITY; do not add a stage, worker commit path, lock ledger, or weaker staging mode.
- ASM-PLC-02: Existing target manifests and immutable Common Handoff transport can bind exact paths, target digests, and proof locators. If only free-text target prose is available, record failed and return BLK-PLC-CAPABILITY instead of deriving stage paths.
- ASM-PLC-03: Git ancestry plus the four fixed trailers and existing plan/Handoff accounting recover every successfully committed barrier without a ledger. If a failed post-archive attempt is interrupted before durable terminal Handoff sealing, return BLK-PLC-RECOVERY; do not infer failure history or retry automatically.
- ASM-PLC-04: `.config/agents/rules/plan*.md` and `.grok/rules/plan*.md`, plus `.config/agents/rules/git.md` and `.grok/rules/git.md`, remain hardlinked pairs. If identity changed, edit both exact current files in their owning task and prove byte equality; never assume mirror propagation.
