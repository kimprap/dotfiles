# Explicit Portfolio Audit and Inline Reconsideration

**Datetime**: 2026-08-28-1414
**Mode**: implementation
**Scope**: Generic engineering completion, worker closure, explicit portfolio audit, final-review classification, and semantic guards
**Summary**: Make engineering completion terminal, move bounded quality reconsideration into each semantic worker through the existing `worker-closure/v1`, and preserve `dev-test-audit` as an explicit read-only whole-portfolio specialty with exact two-opinion transport.
**Status**: DONE
**Completed At**: 2026-08-28-2103

## Objective

- Outcome: OUT-DTA-INLINE-01
- Observable end state: A normal engineering route reaches its existing profile-specific completion presentation and terminal state without automatic portfolio audit; every semantic work attempt performs bounded same-owner `worker-closure/v1` before smoke and one Common Handoff; an explicit user or external-scheduler request can still run exact two-opinion read-only audit against a complete frozen repository or named-subsystem suite boundary.
- Progress signal: T1 synchronizes reopened ADRs, router, backend, closure, review, and audit contracts while preserving fixed identities; T2 closes the selected semantic cases, audit-package matrix, stale scanner, comparator inventories, and protected target manifest before standard independent assurance.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-DTA-HUMAN | Human-confirmed plan-creation Handoff | `local://dev-test-audit-inline-reconsideration-plan-creation-handoff.md@sha256:add5bb3b90213eaf317717df764ad225cd07e4ca60c5df6641a7cebbef3ea50b` | `AUTH-DTA-INLINE-20260827-R1`; `GRILL-DTA-INLINE-20260827-R1` | Highest semantic authority for the complete cutover, preservation boundary, acceptance matrix, and two-task topology; no decision frontier remains. |
| AUTH-DTA-BASE | Handoff-bound repository state | `git:b486f043eb02fb1cbdfeb783e882413ec9909c1d` | exact base commit | Execution starts only from semantically equivalent current bytes; exact load-bearing file identities below are the prewrite drift boundary. |
| AUTH-DTA-INDEX | Active ADR index | `docs/adr/INDEX.md@sha256:ee2dc147d681da5dc0c74ff2a49f66bc3f7eb36457f04a4fa00bf44087a34bb7` | current before cutover | Reopen and synchronize only active projections named by AUTH-DTA-HUMAN. |
| AUTH-DTA-ADR-0001 | Active routing and completion authority | `docs/adr/0001-dev-workflow-authority-and-routing.md@sha256:375e8f396d73fe74cf8ebff85b70f059f310f290b0d049935e6a38cad45c68c0` | D10 and D13 current before cutover | Reopen D10/D13 and preserve D14 exactly. |
| AUTH-DTA-ADR-0002 | Active plan and worker authority | `docs/adr/0002-executor-plans-and-orchestration.md@sha256:f1b87fcdc0ee7c5791df67b81b93691dfb0a8a17b4eccbd5d8fb1be609262670` | D09 and D21 current before cutover | Reopen D09/D21; keep plan grammar and transport unchanged. |
| AUTH-DTA-ADR-0003 | Active assurance, review, and test-value authority | `docs/adr/0003-bounded-assurance-and-repair.md@sha256:39b818c47199c90ac1c842a26fbaaa9d5ef5eb6c413e6d84dcb21c48cc91aed0` | D04 and D22 current before cutover | Reopen D04/D22 and preserve D28 exactly. |
| AUTH-DTA-ADR-0004 | Active discovery and learning authority | `docs/adr/0004-canonical-discovery-and-continual-learning.md@sha256:9acb788a095f5877c9d9fb414519da12a9ab6d5f0621be35d1b859dcf84eed3e` | D07 current before cutover | Change only the D07 consequence required by terminal completion. |
| AUTH-DTA-ADR-0009 | Active session-envelope authority | `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md@sha256:a0dad54405e7d21e3bcd7a70200964b1bfe9970a0e50f96e4b92ccd4d9bd98d4` | D27 and file current before cutover | Preserve the whole file; rejected-alternative references remain historical rationale, not active callers. |

Authority precedence is AUTH-DTA-HUMAN, then the named active ADR decisions, then current executable projections. External sources are evidence only. Any implementation choice not fixed here remains governed by the smallest existing portable contract; no source can broaden the target or effect boundary.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-DTA-TERMINAL | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0001; AUTH-DTA-ADR-0002; AUTH-DTA-ADR-0003 | EFF-DTA-CONTRACT removes every automatic post-`DONE` or post-completion audit transition. An explicit later audit is a new intake, not a completion tail. |
| DEC-DTA-CLOSURE | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0002 | EFF-DTA-CONTRACT runs `worker-closure/v1` in the same semantic owner before smoke and one Common Handoff for planless ownership, each plan-backed task child, an eligible attempt-two child, and an admitted Build-repair worker. Excluded non-work roles never run closure; no alias, schema, role, stage, or Handoff field is created. |
| DEC-DTA-ROUND-ONE | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0002 | EFF-DTA-CONTRACT makes one combined round mandatory over correctness/preservation/effects/acceptance, the existing first-sufficient ladder, candidate-local structural regression, and every changed permanent test or a concrete no-new-contract decision. Exact prompt text exists only in `worker-closure.md`. |
| DEC-DTA-ADMISSION | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT admits every directly evidenced correctness violation even when repair adds complexity. Quality correction requires exact surface, concrete defect, an exact earlier-rung/smaller replacement or test disposition, and preservation proof; without them, record no quality correction. |
| DEC-DTA-ROUND-TWO | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT runs round two only after an actual admitted correction and checks only corrections plus plausible correction regressions. No correction skips round two; no third round exists; remaining correctness makes the attempt non-success. |
| DEC-DTA-TEST-VALUE | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0003 | EFF-DTA-CONTRACT applies unchanged `test-value/v1` only to changed permanent tests or no-new-contract basis, settles merge/remove before final smoke, and never scans untouched portfolio tests during closure. |
| DEC-DTA-AUDIT-INTAKE | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT accepts only explicit user or external-scheduler audit against a content-addressed working-tree manifest or commit plus a complete repository or named-subsystem suite manifest. Completed plan is optional; subsystem results are repository-partial; changed-only, incomplete, stale, or moving boundaries stop before opinions; no scheduler is created. |
| DEC-DTA-AUDIT-PAIR | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT retains exact `test-value/v1`, `test-audit/v1`, stable identities, two fresh distinct roles, fallback none, bounded ledgers/indexes, deterministic evidence aggregation, unknown preservation, stability rehash, cleanup authority none, and one existing Common Handoff. Transport failure affects only that explicit audit. |
| DEC-DTA-ADAPTER-SEAM | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT keeps concrete host bindings only in the audit skill and existing harness adapters. Portable protocol, opinion prompt, and eval prompts use table identity plus controller-supplied binding attestation. Pinned source names remain ADR evidence only. |
| DEC-DTA-CLEANUP | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT routes a later explicit cleanup request fresh through `dev-ask`: bounded/cohesive/settled/one-context work is planless; broad, dependency-ordered, fan-in, or recovery-sensitive work requires a new Executor Plan. No prior state or opinion grants mutation. |
| DEC-DTA-REVIEW | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0003 | EFF-DTA-CONTRACT keeps one Standards/Specification review and current six tags. Direct parent/fixed-contract/consumer harm or materially degrading changed tests may block; structural preference and non-material changed-test findings are advisory. No second review, repair-in-review, or compact tail is added. |
| DEC-DTA-CUTOVER | AUTH-DTA-HUMAN | EFF-DTA-CONTRACT and EFF-DTA-GUARDS change canonical sources then guards serially. No dev-ask ID is added/removed; selected existing cases stay under current inventory membership; all four inventory constants remain byte-identical; only two audit-package IDs are added. |
| DEC-DTA-PRESERVE | AUTH-DTA-HUMAN; AUTH-DTA-ADR-0009 | EFF-DTA-GUARDS proves D14, D27, D28, Common Handoff, plan grammar/parser/transport/storage, audit role/config, compact/full ordering, `/improve`, archived plans, and delivery behavior exact. |

## Scope, non-goals, and prohibited effects

- Read surfaces: all authority, change, guard, verification, and preservation targets named in this plan; the selected current semantic case objects and fixtures; current adapter role table and harness bindings; current parser and scanner contracts; exact dependency Handoffs and evidence locators produced during execution.
- Change surfaces: only T1 contract targets, T2 guard targets, current-plan lifecycle bookkeeping, and local evidence artifacts. No live app config, harness config, VCS state, release surface, or archived plan is a change target.
- Non-goals: creating a scheduler; automatically invoking audit; landing audit cleanup; auditing a changed-tests subset; changing `test-value/v1`; renaming, reversioning, replacing, or adding a compatibility alias for `test-audit/v1`, or changing its deterministic aggregation and result authority beyond the confirmed exact-target intake and portability cutover; changing Common Handoff, plan grammar, parser, or transport; adding D29, a new skill, role, stage, audit fallback, opinion role, context boundary, closure identity, public schema, enum, or alias; altering compact/full assurance order; adding a second review; changing `/improve`; changing host adapter values; generalizing the external source mechanics.
- Prohibited effects: audit mutation; closure on non-work roles; parent/root reinterpretation of child findings; transcript inspection; quality correction without an exact safe replacement/disposition; a smaller-replacement gate on correctness; post-smoke test mutation; untouched-portfolio scanning by closure; moving/stale audit intake; provider branding in portable executable prompts; broad repository scanners that flag ADR evidence or rejected alternatives; raw staging, commit, push, review request, release, deploy, rollout, broad bootstrap, or destructive history operations.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-DTA-CONTRACT | Repository mutation | AUTH-DTA-HUMAN | T1 may mutate only TGT-DTA-AUTHORITY, TGT-DTA-ROUTER, TGT-DTA-CLOSURE, TGT-DTA-REVIEW, and TGT-DTA-AUDIT plus local evidence/current-plan bookkeeping. Any guard, harness, schema, scheduler, cleanup, VCS, or delivery write is prohibited and must be preserved/stopped. |
| EFF-DTA-GUARDS | Repository mutation | AUTH-DTA-HUMAN | T2 may mutate only TGT-DTA-DEV-ASK-EVALS, TGT-DTA-AUDIT-EVALS, and TGT-DTA-SCANNER plus local evidence/current-plan bookkeeping. T1 contract repair, new dev-ask cases, comparator/observer or harness changes, product behavior, cleanup, and delivery effects are prohibited. |
| EFF-DTA-RUNTIME | Local verification and bookkeeping | AUTH-DTA-HUMAN | T1/T2 may read targets; run targeted syntax, parser, scanner, comparator, semantic, portability, and preservation checks; and write native/local evidence plus one Common Handoff per task. Shipping, broad bootstrap/formatter, and full repository audit are excluded. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-DTA-COMPLETION | Normal engineering terminal route | T1 | `completion-terminal/r1` projected through reopened D10/D09/D04 | T2 |
| CONTRACT-DTA-CLOSURE | Same-owner semantic work closure | T1 | `worker-closure/v1` at the final exact `worker-closure.md` digest | T2 |
| CONTRACT-DTA-TEST-VALUE | Permanent-test value policy | T2 | `test-value/v1`; `test-value.md@sha256:7b38d135ea2801835c4d1562fd427ddb61ff053070bb29d5147a7b1ff606e790` | T1 |
| CONTRACT-DTA-AUDIT | Explicit portfolio audit | T1 | `test-audit/v1` at the final exact `audit-protocol.md` digest | T2 |
| CONTRACT-DTA-ADAPTER | Exact audit role binding | T1 | Existing audit-skill table and unchanged harness bindings | T2 |
| CONTRACT-DTA-CLEANUP | Fresh later-maintenance classification | T1 | `fresh-maintenance-classification/r1` | T2 |
| CONTRACT-DTA-REVIEW | One final review classification | T1 | Existing Standards/Specification review with refined direct-harm/materiality boundary | T2 |
| CONTRACT-DTA-GUARDS | Semantic and stale-contract evidence | T2 | Current eval schemas, current dev-ask IDs, and current comparator inventories | none |
| CONTRACT-DTA-PRESERVATION | Protected workflow and delivery boundary | T2 | Exact TGT-DTA-PRESERVATION section/file identities | T1 |

The Common Handoff remains the only task transfer. T1 and T2 may record existing closure, target, test-disposition, smoke, blocker, and evidence fields but cannot add or reinterpret schema values. A named-subsystem audit records its repository-partial scope in the existing audit result/evidence prose, not a new Handoff field.

Changed permanent-test rows retain only keep | merge | remove. When no permanent test changes because no uncovered observable contract exists, the existing separate no-changed-tests branch records closest coverage and the concrete no-new-contract basis. no-new-contract is not a row disposition, enum, or schema addition. Audit opinion ledger dispositions remain exactly `keep`, `merge`, `remove`, or `unknown`; an opinion receipt outcome remains `completed` or `transport-unavailable`; the audit Common Handoff outcome remains `completed`, `transport-unavailable`, or `blocked`. Unsupported, disputed, and unknown tests remain preserved, and none of these values grants cleanup authority.

AUTH-DTA-HUMAN also requires D28, `test-value/v1`, and the Common Handoff schema to remain unchanged. Read its `keep | merge | remove | no-new-contract` phrase consistently with those explicit preservation requirements: `keep | merge | remove` remain changed-test row dispositions, while `no-new-contract` remains the existing separate no-changed-tests basis. This clarifies the higher authority; it does not override it.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-DTA-AUTHORITY | `docs/adr/INDEX.md`; ADR-0001 D10/D13; ADR-0002 D09/D21 plus Evidence; ADR-0003 D04/D22 plus Evidence; ADR-0004 D07 consequence | T1 | AUTH-DTA-INDEX; AUTH-DTA-ADR-0001; AUTH-DTA-ADR-0002; AUTH-DTA-ADR-0003; AUTH-DTA-ADR-0004 | All current generic workflow projections; T2 stale scanner | AC-DTA-01, AC-DTA-09, AC-DTA-14, AC-DTA-15 |
| TGT-DTA-ROUTER | `.config/agents/skills/dev-ask/SKILL.md@sha256:020a7a6967f492db6238b76e2f8acba2cc528a09eaeda6a0cd856675a98c1ac0`; `.config/agents/skills/dev-ask/WORKFLOW.md@sha256:9b6f01369ff069aaee2ae32f2ac26915437276f6d7f67b7aa6a9eb7ccff31b79` | T1 | Exact hashes in path column | Engineering intake, explicit audit dispatch, completion, fresh cleanup classification | AC-DTA-01, AC-DTA-02, AC-DTA-08 |
| TGT-DTA-CLOSURE | `.config/agents/skills/dev-implementation/SKILL.md@sha256:dd55b3d0cbbffe42bb7993c034064d46b2a17cf1df3bc67312209282e0adc468`; `references/worker-closure.md@sha256:32db376ebab5512b26d9d4af4264fb82f3935a8e3c9c9081741ca129cdf7a5f3`; `references/plan-orchestration.md@sha256:2d6b2c1add18784826630ba4872ce28104634561b96eeb25efc4c19cd103fc6a`; `references/compact-checklist.md@sha256:210a8cd97aced95fe4e3f74070ae71434bbe1b99d459c1391503c51cbb9d4055` | T1 | Exact hashes in path column | Four work-attempt shapes, smoke/Handoff order, T2 closure matrix | AC-DTA-01, AC-DTA-09, AC-DTA-10, AC-DTA-11, AC-DTA-12, AC-DTA-13 |
| TGT-DTA-REVIEW | `.config/agents/skills/dev-code-review/SKILL.md@sha256:7e2f45228a18d590a5f2ffb3eceb7ec6e0e037e4801598edc7b982faac0153e9` | T1 | Exact hash in path column | One standard/high final review; T2 review controls | AC-DTA-14 |
| TGT-DTA-AUDIT | `.config/agents/skills/dev-test-audit/SKILL.md@sha256:562957685181b171f8834470fb4984c29ea248b16da1a8231f4a3e559af311db`; `references/audit-protocol.md@sha256:8f96e1e40d4311797b16ac077e632506b7047b06ad6071fc53752d772bdf8343`; `references/opinion-agent.md@sha256:a8f3260189edced4aa9443dd875f9f85418b9701578bfec9c9ecb16b8fa60616` | T1 | Exact hashes in path column | Explicit audit controller, two opinion roles, T2 audit matrix | AC-DTA-02, AC-DTA-03, AC-DTA-04, AC-DTA-05, AC-DTA-06, AC-DTA-07, AC-DTA-08, AC-DTA-15 |
| TGT-DTA-DEV-ASK-EVALS | `.config/agents/skills/dev-ask/evals/evals.json@sha256:2479cf847c0d51560b4b1e4a52c07f113c9dc209665bb7fcf8daceb8583e7528` and only the 13 existing fixture paths in the finite manifest below | T2 | Registry hash plus exact fixture hashes below | Current receipt-backed semantic harness; scanner semantic parity | AC-DTA-17 |
| TGT-DTA-AUDIT-EVALS | `.config/agents/skills/dev-test-audit/evals/evals.json@sha256:b19d1d230771b2d23a8e2bd5f25b90d9178e1ff59276f0e90f9c7ac0c5340e73` | T2 | Exact hash in path column | Eight current audit-package cases plus exactly two additions | AC-DTA-17 |
| TGT-DTA-SCANNER | `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py@sha256:c4e6dcc5aaa877ba7dcf8e25479001c0aa770037d67bf293085ba61a368c52df` | T2 | Exact hash in path column | Active projection scan, selected semantic parity, self-test, preservation checks | AC-DTA-17 |
| TGT-DTA-PRESERVATION | Protected sections/files, harness bindings, comparison support, `/improve`, archive manifest, and unchanged controls below | T2 | Exact identities below plus execution-start archive manifest | Both tasks and final verifier | AC-DTA-16, AC-DTA-17 |

Finite mutable dev-ask semantic fixture manifest:

| Case ID | Fixture path | Base SHA-256 | Required rewrite |
|---|---|---|---|
| `B-DWO-WORKER-CLOSURE` | `.config/agents/skills/dev-ask/evals/fixtures/b-dwo-worker-closure/case.json` | `ee83fe4776c480a07b6a7e0d38e565335c3ea018fd5367bbc45ea5babcdcd5a0` | Four work shapes, four axes, admission split, correction-triggered round two, task-local test settlement, smoke/Handoff order, and role exclusions. |
| `R-DWO-TEST-AUDIT` | `.config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json` | `77ee3bb6fa268de5b71a84bf50ed1a3b196788da2a2717e7b07e410eac062b7f` | Explicit manual/scheduler audit, plan optional, complete repository/subsystem scope, pre-opinion rejection, adapter-bound pair, and fresh cleanup classification. |
| `B-COMPACT` | `.config/agents/skills/dev-ask/evals/fixtures/b-compact/case.json` | `7bd755c8c043c60196b1bbc5bb71eb67203279eea4e1a62c4d06b0cdab57953d` | Preserve planless compact semantics and assert no audit epilogue. |
| `B-COMPACT-PLAN-NO-TAIL` | `.config/agents/skills/dev-ask/evals/fixtures/b-compact-plan-no-tail/case.json` | `19abef26817df204e4e1def1e182fb08770ec9364f27f05e1a626aa00f9d5ba4` | Preserve compact-plan child work and tail omission; assert no audit epilogue. |
| `B-FULL` | `.config/agents/skills/dev-ask/evals/fixtures/b-full/case.json` | `b20e28d0927a0f872f1cb99f7ba4b6fc3a9d77f61f3c7bed548c27d231485a62` | Preserve standard full order and assert terminal completion without audit. |
| `B-PLAN-TAIL-OMITTED` | `.config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-omitted/case.json` | `ff033c9638a821342d25cb50fb5fdb9ad824a44e85eb4330a6e9cfd412c129fe` | Preserve backend-scheduled standard tail; assert terminal completion without audit. |
| `B-PLAN-TAIL-PROFILE` | `.config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-profile/case.json` | `edf73eaf723e9e49dccb5da2a8ca5fd555cb3b831472bb66185057b094b75450` | Preserve optional numbered-tail grammar; assert terminal completion without audit. |
| `R-COMPLETE` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json` | `333bf867cc8cb721ccd672f45d89fcd5c03bb9ec7a39846895c4e619f917f5a1` | Preserve standard completion presentation; remove post-completion audit state. |
| `R-COMPLETE-COMPACT-NO-LEARNING` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json` | `28989438474ebfe8b0f6451788b68f6f8bdf01eee2628f3ce802e89a38ed68e5` | Preserve compact completion; remove post-completion audit state. |
| `B-T5-COMPLETION-ASSURED` | `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json` | `3e0261c1dd2bdc0f72c0785183cbd23de8a79fe99b90af08885b9b2f6056f88e` | Preserve assurance-ready completion and assert no audit epilogue. |
| `B-T5-COMPLETION-MISSING-ASSURANCE` | `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-missing-assurance/case.json` | `21f873df9999ee895acedb1f781bfb392867b7c4fa10cfa3b8afd5de3fe47c36` | Preserve missing-assurance block and ensure audit cannot bypass it. |
| `B-REVIEW` | `.config/agents/skills/dev-ask/evals/fixtures/b-review/case.json` | `8b5c7c84e6857eec25bb426b77dcfde5f3e0c22d4f6d9281bb8b55f051c6de35` | Preserve direct-harm blocker and add directly evidenced material-suite-degradation blocker. |
| `B-REVIEW-WORDING-ADVISORY` | `.config/agents/skills/dev-ask/evals/fixtures/b-review-wording-advisory/case.json` | `a90ad4baf8a9a755700da0e85dc54cef8ad8305bb117b728d2c7d08d0385c44b` | Preserve current advisory/learning contract and add structural/no-direct-harm plus non-material changed-test advisories. |

No other dev-ask case or fixture is mutable. In particular `B-COMPACT-NEAR-MISS-HIGH-CONSEQUENCE` remains a read-only high-consequence completion control at SHA-256 `8a75f38a42d5fc4a2c20f3f163d33ffb2e2787aadbe2b06313733c32da29c5da`; `B-REVIEW-COMPLEXITY-LENS` and its near miss remain read-only direct-harm/current-structure controls.

Finite audit-package case manifest inside `.config/agents/skills/dev-test-audit/evals/evals.json`:

| Audit case ID | Action | Unique contract |
|---|---|---|
| `DTA-DISCOVERY` | Rewrite | Explicit exact-target intake; completed plan optional. |
| `DTA-DISCOVERY-NEAR-MISS` | Rewrite | Preserve unfinished-work near miss; reject missing eligible exact tuple/complete boundary rather than missing completion alone. |
| `DTA-INDEPENDENT-PAIR` | Rewrite | Preserve two fresh distinct opinions and bounded context; replace concrete host literals with controller-supplied binding attestation. |
| `DTA-DISAGREEMENT-EVIDENCE` | Preserve exact | Retain deterministic evidence aggregation. |
| `DTA-TRANSPORT-UNAVAILABLE` | Rewrite | Use exact adapter-binding mismatch and stop only the explicit audit. |
| `DTA-READ-ONLY` | Rewrite | Retain no mutation; route later explicit cleanup through fresh bounded-versus-broad maintenance classification. |
| `DTA-BOUNDED-INDEX` | Preserve exact | Retain the 1,200-row bounded-context and union-order control. |
| `DTA-UNKNOWN-PRESERVED` | Rewrite only cleanup classification | Retain unknown/no-deletion behavior; replace always-plan cleanup with fresh maintenance classification. |
| `DTA-PARTIAL-BOUNDARY` | Add | Accept one complete named subsystem and label the result partial relative to the repository. |
| `DTA-CHANGED-TESTS-ONLY-NEAR-MISS` | Add | Reject changed-tests-only intake before opinion dispatch. |

TGT-DTA-PRESERVATION exact controls:

- D14 section bytes, from `### D14 — Separate shipping authority` through the byte before the next same-or-higher-level heading, SHA-256 `6fbf3635ae509400b85c6fe0190126e502159df75b6f555a9ea9911d0097a629`.
- D28 section bytes, from `### D28 — Permanent test portfolio value` through the byte before the next same-or-higher-level heading, SHA-256 `e56ffe40b4c392b3b3b5502d8f8f5b4ac79d5db6560010e283ad27e18c2cbc26`.
- `docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md@sha256:a0dad54405e7d21e3bcd7a70200964b1bfe9970a0e50f96e4b92ccd4d9bd98d4`.
- `.config/agents/skills/dev-implementation/references/test-value.md@sha256:7b38d135ea2801835c4d1562fd427ddb61ff053070bb29d5147a7b1ff606e790`.
- `.config/agents/skills/dev-handoff/SKILL.md@sha256:eccf6a95692f22e09bc3aadc486f38957a7255841d9466707650de8b30d8b7e2`.
- `.config/agents/rules/plan.md@sha256:97387afc9bccf8a0d30fe001f3c3eb171a1d70726f047761e38c67773f6e769c`.
- `.config/agents/rules/plan-impl-spec.md@sha256:eb058c61270160bd356f32283a144c19149ee4d5b61a7d48626b121e9258e043`.
- `.config/agents/skills/dev-implementation/scripts/executor_plan.py@sha256:1e0d7c9c52b6904526d87b3604b4e5057779d0b8377f8972c6f15e7b9fa06f4c`.
- `.config/agents/skills/dev-ask/evals/compare_trace.py@sha256:545fc0028dac214ab3e315b3900c993d714be5939bc8aa1e5ca5ae56f1fe0b95` and `.config/agents/skills/dev-ask/evals/observe_case.py@sha256:9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd`.
- `.config/agents/harnesses/omp/agents/test-audit-opinion-a.md@sha256:c57ef51eccca02b9adc56cd1c2c615b3433ab4b0ca2724f611d5a2cb9ef71dc5`, `test-audit-opinion-b.md@sha256:c6243ec490a2b23975fdfd6ed34f28b5b1cc4153d43b9a29ee953ca239955794`, `.config/agents/harnesses/omp/config.yml@sha256:764ffafc2a40ba013660834d13868a720454a77b565eb0713da72ffd0511d471`, and `.config/agents/harnesses/grok/config.toml@sha256:a49237129b6b2508fc759e2931eb37d5feb3724363e5bdf0de29892853dd5162`.
- `.config/agents/skills/improve/SKILL.md@sha256:745675e343611bf60b49e45b0b93c9379d5c332dca91e51c10c2bdb2838c3768` and `.config/agents/skills/improve/references/plan-template.md@sha256:031f00bead4e5d2fdee9231fd81ddd193e4e4360cc06ce4c40815a2b4401c9c1`.
- The complete `.agents/plans/archive/` path/content manifest recorded immediately before T1 writes; all rows must be identical after T2. No archived plan is opened for mutation.

## Execution policy

- Assurance: standard
- Topology: full-orchestration
- Max concurrency: 1
- Isolation: shared-tree
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 completes and hands its exact final contract target to the backend before T2 starts. T2 consumes that identity and may not repair a T1-owned file; a detected T1 semantic defect returns through the existing bounded repair path to T1’s ownership. Any undeclared or unknown write stops the child. No concurrent mutation exists.
- Decomposition: exactly two serial vertical work tasks. The plan intentionally omits a numbered assurance tail; T2 hands the final shared lineage to the existing standard backend, which schedules fresh independent verification, one final review, continual learning, and completion presentation once.
- Effect limit: EFF-DTA-CONTRACT, EFF-DTA-GUARDS, EFF-DTA-RUNTIME
- Orchestrator profile: `orchestrator-role-profile/v1`; plan-backed full-orchestration required; downgrade: none
- Repair policy: use only the current standard attempt-two and one run-wide post-assurance Build-repair authority. This plan creates no attempt, grant, review, audit, or cleanup authority.
- Completion policy: after accepted assurance and presentation this plan becomes `DONE`; the new terminal contract schedules no automatic `dev-test-audit`.

## Tasks

- [x] T1. Cut over workflow and audit contracts
  completed 2026-08-28-1646
  - Owner: dev-implementation worker
  - Intent: Make completion terminal and move bounded reconsideration to the semantic owner while retaining explicit whole-portfolio audit.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-DTA-AUTHORITY, TGT-DTA-ROUTER, TGT-DTA-CLOSURE, TGT-DTA-REVIEW, TGT-DTA-AUDIT
  - Contracts: CONTRACT-DTA-COMPLETION, CONTRACT-DTA-CLOSURE, CONTRACT-DTA-TEST-VALUE, CONTRACT-DTA-AUDIT, CONTRACT-DTA-ADAPTER, CONTRACT-DTA-CLEANUP, CONTRACT-DTA-REVIEW, CONTRACT-DTA-PRESERVATION
  - Criteria: AC-DTA-01, AC-DTA-02, AC-DTA-03, AC-DTA-04, AC-DTA-05, AC-DTA-06, AC-DTA-07, AC-DTA-08, AC-DTA-09, AC-DTA-10, AC-DTA-11, AC-DTA-12, AC-DTA-13, AC-DTA-14, AC-DTA-15
  - Effects: EFF-DTA-CONTRACT, EFF-DTA-RUNTIME
  - Output: OUTP-DTA-T1
  - Receiver: dev-implementation backend
  - Verification: VR-DTA-01, VR-DTA-02, VR-DTA-03, VR-DTA-04, VR-DTA-05, VR-DTA-06, VR-DTA-07, VR-DTA-08, VR-DTA-09, VR-DTA-10, VR-DTA-11, VR-DTA-12, VR-DTA-13, VR-DTA-14, VR-DTA-15
  - Lineage: shared
  - Execution detail: Rehash every T1 target and all TGT-DTA-PRESERVATION controls before writing. Reopen only D10/D13, D09/D21, D04/D22, the D07 consequence, and INDEX; record EVID-DTA-SOURCE-2 only in ADR-0003 Evidence/source revisions and preserve source branding outside executable text. In router/workflow/backend projections, delete automatic audit from every normal completion and add explicit `dev-test-audit` intake through the existing validated direct-stage seam. In the implementation skill and its three references, project all four semantic-work shapes onto the sole exact prompt in `worker-closure.md`; make round one cover the four fixed axes; encode correctness admission without a complexity gate, quality admission only with exact replacement/disposition and preservation proof, and correction-only round two. Settle changed tests before final smoke, keep one Common Handoff, and leave `test-value.md` untouched. In review, retain one Standards/Specification pass and current tags while applying the fixed blocker/advisory boundary. In audit, make completed plan optional, bind exact working-tree/commit targets and complete repository/subsystem manifests, reject ineligible boundaries before opinions, label subsystem output repository-partial using existing result prose, keep exact two-opinion aggregation and cleanup authority none, route later cleanup as fresh maintenance, and remove host literals from the portable opinion prompt while retaining the exact adapter table in the skill. Run disposable source-bound smoke scenarios for VR-DTA-01 through VR-DTA-15; do not create fixtures or a second Handoff.

- [x] T2. Cut over semantic guards and preservation
  completed 2026-08-28-1733
  - Owner: dev-implementation worker
  - Intent: Make permanent controls prove the new contract atomically without widening schemas or case inventory.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-DTA-DEV-ASK-EVALS, TGT-DTA-AUDIT-EVALS, TGT-DTA-SCANNER, TGT-DTA-PRESERVATION
  - Contracts: CONTRACT-DTA-COMPLETION, CONTRACT-DTA-CLOSURE, CONTRACT-DTA-TEST-VALUE, CONTRACT-DTA-AUDIT, CONTRACT-DTA-ADAPTER, CONTRACT-DTA-CLEANUP, CONTRACT-DTA-REVIEW, CONTRACT-DTA-GUARDS, CONTRACT-DTA-PRESERVATION
  - Criteria: AC-DTA-16, AC-DTA-17
  - Effects: EFF-DTA-GUARDS, EFF-DTA-RUNTIME
  - Output: OUTP-DTA-T2
  - Receiver: dev-verification
  - Verification: VR-DTA-16, VR-DTA-17
  - Lineage: shared
  - Execution detail: Bind OUTP-DTA-T1’s exact final target, rehash every T2 target, and refuse any unexpected change before writing. Rewrite `B-DWO-WORKER-CLOSURE`, `R-DWO-TEST-AUDIT`, the nine listed completion controls, `B-REVIEW`, and `B-REVIEW-WORDING-ADVISORY` in the registry and their exact existing fixtures; add no dev-ask ID or fixture. The DWO closure matrix covers every work shape, all four axes, both admission branches, task-local tests/no-new-contract, round trigger/no-third, smoke/Handoff order, and role exclusions. The DWO audit matrix covers manual/scheduler equivalence, optional plan, repository/subsystem scope, pre-opinion rejection, adapter binding, transport locality, aggregation, and fresh cleanup. Completion controls explicitly forbid audit epilogues; review controls prove direct/material blockers and structural/non-material advisories without adding a review. Rewrite the eight existing audit-package cases as classified by their current unique contracts; add exactly `DTA-PARTIAL-BOUNDARY` and `DTA-CHANGED-TESTS-ONLY-NEAR-MISS`. Extend `scan_stale_contracts.py` with both DWO registry/fixture pairs in its exact semantic map/self-test and with active path/section-aware checks for stale completion-gated audit, blanket closure admission, identity/schema aliases, changed-tests-only audit, source branding in executable prompts, and host binding outside the audit-skill/harness allowlist. Keep ADR Evidence and rejected alternatives exempt where appropriate; compare protected D14/D28 slices exactly. Leave `compare_trace.py`, `observe_case.py`, their schemas/CLI, and all four `ADDED_IDS`/`REWRITE_IDS` values byte-identical. Run every command and semantic matrix in VR-DTA-16/17; hand off the closed final manifest to fresh `dev-verification`.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-DTA-01 | Planless compact, compact-plan, standard, high-consequence, optional-tail, presenter, assurance-ready, and missing-assurance completion paths run. | Existing profile-specific order remains exact. Successful normal completion reaches presentation and terminal state with no automatic audit event; missing assurance remains blocked and audit cannot bypass it. | TGT-DTA-AUTHORITY, TGT-DTA-ROUTER, TGT-DTA-CLOSURE | T1 |
| AC-DTA-02 | An explicit user or external scheduler requests portfolio audit against the same exact frozen target and complete suite boundary. | Both enter the same `dev-test-audit` specialty and exact two-opinion protocol; no scheduler implementation or completion-tail dependency exists. | TGT-DTA-ROUTER, TGT-DTA-AUDIT | T1 |
| AC-DTA-03 | Explicit audit supplies an exact content-addressed working-tree target or commit and complete suite boundary but no completed plan. | Intake remains eligible; completed plan provenance is optional and contributes no authority. | TGT-DTA-AUDIT | T1 |
| AC-DTA-04 | Explicit audit supplies a complete manifest for one named subsystem rather than the whole repository. | Intake is eligible, every test in that subsystem boundary is covered exactly once per opinion, and the aggregate is explicitly labeled partial relative to the repository. | TGT-DTA-AUDIT | T1 |
| AC-DTA-05 | Audit intake is changed-tests-only, incomplete, stale, or moving. | Controller returns blocked/ineligible before either opinion dispatch; no partial portfolio claim, cleanup authority, or completion-state effect is produced. | TGT-DTA-AUDIT | T1 |
| AC-DTA-06 | Exact adapter transport is available, then unavailable or mismatched in a control. | Available transport launches exactly the two fresh distinct bound roles with fallback none. Unavailable/mismatched transport yields the existing local audit failure outcome and changes no implementation/completion state. | TGT-DTA-AUDIT | T1 |
| AC-DTA-07 | Opinions disagree or one disposition lacks support under `test-value/v1`. | Existing deterministic evidence aggregation runs; unsupported, disputed, and unknown tests are preserved; vote count/model identity is not evidence. | TGT-DTA-AUDIT | T1 |
| AC-DTA-08 | A later explicit request asks to apply audit cleanup. | Audit remains read-only. Fresh `dev-ask` classification selects planless implementation only for bounded/cohesive/settled/one-context work and a new Executor Plan for broad/dependent/fan-in/recovery-sensitive work; no prior lifecycle state or opinion grants mutation. | TGT-DTA-ROUTER, TGT-DTA-AUDIT | T1 |
| AC-DTA-09 | Each of the four semantic work shapes has a candidate. | The same semantic owner runs one mandatory `worker-closure/v1` round over all four axes before task-local smoke and one Common Handoff. Excluded non-work roles run no closure. | TGT-DTA-AUTHORITY, TGT-DTA-CLOSURE | T1 |
| AC-DTA-10 | Round one finds a directly evidenced correctness, preservation, effect, or owned-acceptance violation whose repair adds code or complexity. | The finding is admitted and repaired within the existing target/effect boundary; no smaller-replacement or quality gate suppresses it. If it cannot be repaired under current authority, the attempt is non-success with the finding visible. | TGT-DTA-CLOSURE | T1 |
| AC-DTA-11 | Round one proposes simplification, structural, or permanent-test quality correction with and without an exact safe replacement/disposition. | The qualified proposal is corrected only with exact surface, concrete defect, exact earlier/smaller replacement or test disposition, and preservation proof. The unqualified proposal produces no quality correction and no correctness blocker. | TGT-DTA-CLOSURE | T1 |
| AC-DTA-12 | Round one makes an admitted correction, makes none, or round two finds another issue. | Actual correction triggers exactly one correction/regression-only round two; no correction skips it; neither branch can run a third round or reopen unaffected candidate work. | TGT-DTA-CLOSURE | T1 |
| AC-DTA-13 | A work attempt changes permanent tests, changes none because current coverage is sufficient, and has untouched portfolio tests. | Changed tests receive exact keep, merge, or remove value rows and settle before smoke, or the Handoff records a concrete `no-new-contract` basis. Untouched portfolio tests are not inspected by closure. | TGT-DTA-CLOSURE | T1 |
| AC-DTA-14 | One final standard/high review sees direct contract harm, structural preference without direct harm, directly evidenced material suite degradation, and a non-material changed-test concern. | Direct parent/fixed-contract/changed-consumer harm and material suite degradation may block. Structural preference and non-material changed-test concerns are advisory. Standards/Specification axes, six tags, one review, no repair-in-review, and compact no-tail remain exact. | TGT-DTA-AUTHORITY, TGT-DTA-REVIEW | T1 |
| AC-DTA-15 | Portable prompts, active ADR projections, eval prompts, and host adapters are scanned. | No host/model/product/repository-helper or pinned-source branding appears in portable executable prompts. Pinned names/locators remain only ADR evidence. The exact adapter table remains only in the audit skill plus existing harness adapters and agrees byte/semantically without a fallback. | TGT-DTA-AUTHORITY, TGT-DTA-AUDIT | T1 |
| AC-DTA-16 | The complete final target and preservation manifest are compared with the plan bases. | D14, D27, D28, `test-value.md`, Common Handoff, plan rules/parser/transport/storage, audit role/config, `/improve`, archive manifest, and all unowned paths are exact; no D29, new skill/scheduler/schema/alias, audit cleanup dispatch, or VCS/delivery effect exists. | TGT-DTA-PRESERVATION | T2 |
| AC-DTA-17 | All current contract projections, selected registry/fixture pairs, audit-package cases, comparator inventories, and stale scanner execute from the same final bytes. | JSON parse, observer/comparator/scanner self-tests, comparator keep check, semantic parity, scanner normal mode, selected behavioral matrices, and plan validation pass atomically; no active automatic audit or blanket quality admission remains and all four comparator inventory values are byte-identical. | TGT-DTA-DEV-ASK-EVALS, TGT-DTA-AUDIT-EVALS, TGT-DTA-SCANNER, TGT-DTA-PRESERVATION | T2 |

## Verification / Done criteria

Named cases in VR-DTA-01 through VR-DTA-15 are final-verifier scenarios; T1 smoke stays source-bound on T1-owned bytes, must not wait for T2-mutated registry/fixture/audit-eval/scanner bytes, and the T1 Handoff carries task-local smoke evidence rather than the final independent verdicts.

- [x] VR-DTA-01. Prove terminal completion across assurance profiles.
  - Criterion: AC-DTA-01
  - Proof class: receipt-backed completion matrix plus active-projection scan
  - Scenario / environment / fixture: Run `B-COMPACT`, `B-COMPACT-PLAN-NO-TAIL`, `B-FULL`, `B-COMPACT-NEAR-MISS-HIGH-CONSEQUENCE`, `B-PLAN-TAIL-OMITTED`, `B-PLAN-TAIL-PROFILE`, `R-COMPLETE`, `R-COMPLETE-COMPACT-NO-LEARNING`, `B-T5-COMPLETION-ASSURED`, and `B-T5-COMPLETION-MISSING-ASSURANCE` from the final sources.
  - Evidence form: Exact ordered events per current profile, one presentation on successful normal routes, missing-assurance stop, and zero automatic audit events or audit epilogues.
  - Target recheck: TGT-DTA-AUTHORITY, TGT-DTA-ROUTER, TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-02. Prove manual and scheduled explicit audit equivalence.
  - Criterion: AC-DTA-02
  - Proof class: explicit route matrix
  - Scenario / environment / fixture: Run `R-DWO-TEST-AUDIT` with an explicit user request and an otherwise identical external-scheduler request against one exact commit target and complete repository suite manifest.
  - Evidence form: Same specialty/protocol identity, frozen tuple, exact pair dispatch, and aggregate shape; origin differs only as request provenance; no scheduler code or completion-tail transition.
  - Target recheck: TGT-DTA-ROUTER, TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-03. Accept exact audit without plan provenance.
  - Criterion: AC-DTA-03
  - Proof class: intake positive control
  - Scenario / environment / fixture: Run rewritten `DTA-DISCOVERY` and the no-completed-plan branch of `R-DWO-TEST-AUDIT` with a sealed working-tree manifest, complete repository suite manifest, exact policies, exact adapter table identity, and receiver.
  - Evidence form: Eligible frozen tuple and opinion dispatch with no completed-plan field or inherited plan authority.
  - Target recheck: TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-04. Accept a complete subsystem and label partial scope.
  - Criterion: AC-DTA-04
  - Proof class: bounded-scope audit matrix
  - Scenario / environment / fixture: Run `DTA-PARTIAL-BOUNDARY` for one named subsystem whose manifest enumerates every permanent test in that subsystem and excludes repository tests outside it by declared boundary.
  - Evidence form: Each opinion ledger covers every subsystem selector exactly once; aggregate and Common Handoff state that the result is partial relative to the repository without a schema addition.
  - Target recheck: TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-05. Reject incomplete or moving portfolio boundaries before dispatch.
  - Criterion: AC-DTA-05
  - Proof class: negative intake matrix
  - Scenario / environment / fixture: Run `DTA-DISCOVERY-NEAR-MISS`, `DTA-CHANGED-TESTS-ONLY-NEAR-MISS`, and stale/moving branches of `R-DWO-TEST-AUDIT`; count opinion dispatches.
  - Evidence form: Blocked/ineligible outcomes with dispatch count zero, exact failing tuple field, no partial portfolio result, and no implementation/completion mutation.
  - Target recheck: TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-06. Keep exact two-opinion transport local to audit.
  - Criterion: AC-DTA-06
  - Proof class: role identity and transport-failure matrix
  - Scenario / environment / fixture: Run `DTA-INDEPENDENT-PAIR`, `DTA-TRANSPORT-UNAVAILABLE`, and both matching branches of `R-DWO-TEST-AUDIT` using controller-supplied adapter attestations; inspect the unchanged harness mappings.
  - Evidence form: Exactly two fresh distinct role receipts when exact; fallback none; mismatched/unavailable binding stops only the explicit audit with existing transport outcome and no parent lifecycle change.
  - Target recheck: TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-07. Preserve evidence aggregation and unknown tests.
  - Criterion: AC-DTA-07
  - Proof class: deterministic aggregation matrix
  - Scenario / environment / fixture: Run `DTA-DISAGREEMENT-EVIDENCE`, `DTA-UNKNOWN-PRESERVED`, and `DTA-BOUNDED-INDEX` with disagreement, unsupported evidence, explicit unknown, and the existing 1,200-row bounded-index control.
  - Evidence form: Existing opinion-A order plus unseen opinion-B selector union, counterpart fetch only, evidence validation, unknown preservation, and no vote/model shortcut or cleanup authority.
  - Target recheck: TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-08. Classify later cleanup as fresh maintenance.
  - Criterion: AC-DTA-08
  - Proof class: route-decision matrix
  - Scenario / environment / fixture: Run rewritten `DTA-READ-ONLY`, `DTA-UNKNOWN-PRESERVED`, and cleanup branches of `R-DWO-TEST-AUDIT` for one bounded/cohesive/settled/one-context request and one dependency-ordered recovery-sensitive request.
  - Evidence form: Audit Handoff keeps `Cleanup authority: none`; fresh intake routes the first planless and the second to plan creation; both use new task/lifecycle state and inherit no opinion, attempt, token, review, completion, or audit authority.
  - Target recheck: TGT-DTA-ROUTER, TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-09. Run closure in every semantic work shape only.
  - Criterion: AC-DTA-09
  - Proof class: same-owner identity and role-negative matrix
  - Scenario / environment / fixture: Run all four branches of `B-DWO-WORKER-CLOSURE`: planless same-context owner, plan-backed task child, eligible attempt-two child, and admitted Build-repair worker. Exercise neutral integration, verification, review, learning, audit-controller, and opinion controls.
  - Evidence form: Same owner/child, task, attempt, target, and `worker-closure/v1` identities through mandatory four-axis round one; closure precedes smoke and one Common Handoff; excluded-role invocation count zero.
  - Target recheck: TGT-DTA-AUTHORITY, TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-10. Admit correctness even when repair adds complexity.
  - Criterion: AC-DTA-10
  - Proof class: seeded correctness repair
  - Scenario / environment / fixture: In `B-DWO-WORKER-CLOSURE`, seed one directly evidenced acceptance violation whose smallest correct in-boundary repair adds code and one unrepairable-under-authority correctness control.
  - Evidence form: First finding admitted/corrected without an earlier-rung gate and correction-triggered round two; second remains an explicit non-success blocker rather than being reclassified as quality.
  - Target recheck: TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-11. Gate quality correction on an exact safe replacement.
  - Criterion: AC-DTA-11
  - Proof class: qualified-versus-unqualified quality matrix
  - Scenario / environment / fixture: In `B-DWO-WORKER-CLOSURE`, provide one candidate-local structural regression with an exact earlier-rung smaller replacement and preservation proof, one redundant changed-test merge disposition with proof, and otherwise similar proposals missing their replacement/disposition.
  - Evidence form: Only qualified rows produce corrections; unqualified rows record no quality correction and do not block correctness; every applied correction stays inside declared targets/effects.
  - Target recheck: TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-12. Bound closure to correction-triggered round two.
  - Criterion: AC-DTA-12
  - Proof class: finite round-state matrix
  - Scenario / environment / fixture: Run no-correction, correctness-correction, and quality-correction branches of `B-DWO-WORKER-CLOSURE`; seed one plausible correction-caused regression in each correction branch and request another round.
  - Evidence form: Round counts exactly one, two, and two; round two reads only correction rows/plausible regressions; third-round request and unaffected-candidate reopening are rejected.
  - Target recheck: TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-13. Keep closure test-value accounting task-local.
  - Criterion: AC-DTA-13
  - Proof class: changed-test disposition matrix
  - Scenario / environment / fixture: In `B-DWO-WORKER-CLOSURE`, exercise unique changed-test keep, redundant merge, unsupported remove, and sufficient-existing-coverage/no-new-contract branches beside an untouched repository suite manifest.
  - Evidence form: Exact task-local value/disposition rows settle before smoke; concrete no-new-contract basis when no test changes; untouched portfolio selectors are absent from closure reads; unchanged `test-value/v1` identity.
  - Target recheck: TGT-DTA-CLOSURE
  - Receiver: dev-implementation backend
- [x] VR-DTA-14. Enforce final-review blocker and advisory boundaries.
  - Criterion: AC-DTA-14
  - Proof class: final-review semantic matrix
  - Scenario / environment / fixture: Run current `B-REVIEW-COMPLEXITY-LENS` direct-harm control, rewritten `B-REVIEW` with direct material suite-degradation evidence, and rewritten `B-REVIEW-WORDING-ADVISORY` with structural/no-direct-harm and non-material changed-test findings; retain a compact no-review control.
  - Evidence form: Direct contract and materially degrading test findings are blockers; structural and non-material test findings are advisories; one Standards/Specification Handoff, six current tags, no repair or second review, and no compact tail.
  - Target recheck: TGT-DTA-AUTHORITY, TGT-DTA-REVIEW
  - Receiver: dev-implementation backend
- [x] VR-DTA-15. Prove portable prompts and exact adapter ownership.
  - Criterion: AC-DTA-15
  - Proof class: path/section-aware portability scan plus adapter inspection
  - Scenario / environment / fixture: Run scanner self-test/normal mode and mutate temporary active prompt copies with each forbidden host/model/product/helper/source literal. Inspect the audit-skill adapter table against all four unchanged harness controls and run adapter-bound audit cases.
  - Evidence form: Every executable-prompt mutation fails; ADR Evidence source locators remain accepted; only the audit skill/harness allowlist contains concrete bindings; exact role/model/reasoning/tool/isolation values and fallback none agree.
  - Target recheck: TGT-DTA-AUTHORITY, TGT-DTA-AUDIT
  - Receiver: dev-implementation backend
- [x] VR-DTA-16. Preserve every protected contract and effect boundary.
  - Criterion: AC-DTA-16
  - Proof class: exact section/file/path manifest comparison
  - Scenario / environment / fixture: Extract D14 and D28 with the fixed heading-to-next-peer algorithm; rehash every whole-file control; compare the execution-start archive manifest and final repository mutation manifest; inspect for forbidden new D29/skill/scheduler/schema/alias/cleanup/VCS effects.
  - Evidence form: Exact protected hashes, identical archive rows, zero unowned mutations, unchanged adapter count/config and `/improve`, and a finite final changed-path set equal to T1 plus T2 targets.
  - Target recheck: TGT-DTA-PRESERVATION
  - Receiver: dev-verification
- [x] VR-DTA-17. Prove atomic guard and projection closure.
  - Criterion: AC-DTA-17
  - Proof class: parser, syntax, comparator, scanner, semantic parity, and behavioral smoke
  - Scenario / environment / fixture: From repository root validate this plan; parse the two changed registries and all 13 changed fixture JSON files; run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test`, `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test`, `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test`, and `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; run the authoritative comparator keep check against commit `c6af1aaf58eed506678808da7a2c5b87412486c7`, blob `678d4fb1e8c2a4855d57575de867c4e60de051de`, SHA-256 `a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8`, current registry, and repository root. Run both DWO cases, all ten audit-package cases, all completion/review controls named by the other recipes, and scanner temporary-mutation negatives.
  - Evidence form: Valid `executor-plan-validation/v1`; JSON and four self-test/normal/keep-check pass receipts; exact unchanged four inventory values; two exact DWO semantic parity rows including one-sided mutation failures; ten exact audit IDs; expected semantic verdicts; zero stale active projections; no automatic audit, blanket quality admission, identity alias, portability leak, or protected change.
  - Target recheck: TGT-DTA-DEV-ASK-EVALS, TGT-DTA-AUDIT-EVALS, TGT-DTA-SCANNER, TGT-DTA-PRESERVATION
  - Receiver: dev-verification


Required deterministic commands, from `/Users/kim/.dotfiles`, after the repository plan artifact exists:

```text
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-08-28-1414_dev-test-audit-inline-reconsideration.md
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/evals.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-test-audit/evals/evals.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-dwo-worker-closure/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/r-dwo-test-audit/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-compact/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-compact-plan-no-tail/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-full/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-omitted/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-plan-tail-profile/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-missing-assurance/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-review/case.json
PYTHONDONTWRITEBYTECODE=1 python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-review-wording-advisory/case.json
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --keep-check --baseline-blob 678d4fb1e8c2a4855d57575de867c4e60de051de --baseline-commit c6af1aaf58eed506678808da7a2c5b87412486c7 --baseline-sha256 a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8 --current .config/agents/skills/dev-ask/evals/evals.json --repo-root /Users/kim/.dotfiles
```
Final `dev-verification` reruns VR-DTA-01 through VR-DTA-17 against one immutable final target. It produces one fresh aggregate verdict covering every criterion exactly once; it does not repair, reformat, merge, or trust T1/T2 conclusions. The standard backend then runs one fresh `dev-code-review`, `dev-continual-learning`, and `completion-presentation` in existing order. No explicit audit request exists in this plan, so no portfolio audit follows completion.

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-DTA-T1 | T1 | Final contract manifest; reopened ADR/index sections; final closure/audit digests; adapter-table identity; VR-DTA-01 through VR-DTA-15 smoke receipts; protected-section checks; changed-test rows or the existing no-changed-tests/no-new-contract basis; one Common Handoff | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | Existing Common Handoff binding AUTH-DTA-HUMAN, unchanged Task Contract, child/attempt/closure provenance, exact target/effect manifest, criterion verdicts, smoke evidence, blockers, and no shipping/audit-cleanup authority. |
| OUTP-DTA-T2 | T2 | Final guard manifest; selected case/fixture inventory; ten audit-package IDs; semantic-parity map; syntax/self-test/scanner/keep-check/behavior receipts; preservation manifest; changed-test rows or the existing no-changed-tests/no-new-contract basis; one Common Handoff | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-verification | Existing Common Handoff binding OUTP-DTA-T1, the final shared-lineage target, AC-DTA-16/17 verdicts, dependent proof locators, zero unowned mutation, no inherited audit/cleanup/shipping authority, and one exact receiver. |

The backend accepts T1/T2 only mechanically against IDs, digests, target/effect manifests, criteria, receipts, and allowed outcomes. It never reinterprets closure findings or audit opinions. After T2, any independent-verification blocker uses only the existing bounded repair policy and returns to the owning work boundary; no audit participates in repair or completion.

Terminal success requires: both work Handoffs accepted; all 17 independent verdicts `VERIFIED`; one final review `APPROVED`; continual learning settled under its existing policy; one valid completion-presentation input rendered; this plan validated and stored under normal plan lifecycle; status `DONE`; and zero automatic `dev-test-audit` dispatch. Shipping remains separately unauthorized.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-DTA-BASE-DRIFT | dev-implementation backend | Exact path/base/current digests and semantic delta against AUTH-DTA-HUMAN; preserve unexpected work. | T1, T2 | AUTH-DTA-HUMAN or new human authority | Every load-bearing target matches its bound or newly approved identity before its owner writes. |
| BLK-DTA-PRESERVATION | T2 | Exact protected section/file/archive/harness conflict and affected acceptance; finish only disjoint proof that remains valid. | T1, T2 | AUTH-DTA-HUMAN or new human authority | Every protected identity is exact and no protected mutation is required. |
| BLK-DTA-TRANSPORT | dev-implementation backend | Existing `transport-unavailable` Handoff with profile, attempted launch, and unchanged target identity. | T1, T2 | Current orchestrator profile; downgrade none | Full-orchestration and the exact plan-backed child are available without downgrade. |
| BLK-DTA-T1-CONTRACT | dev-implementation backend | Exact criterion, evidence, T1 target identity, and dependent T2 guards requiring regeneration. | T1, T2 | Existing bounded repair policy | Owning T1 repair is accepted and every affected T2 guard/proof is regenerated from that target. |
| BLK-DTA-GUARD-INVENTORY | T2 | Registry/fixture/map/inventory delta, keep-check receipt, and exact required correction inside T2 targets. | T2 | AUTH-DTA-HUMAN; new authority if a dev-ask ID/comparator change is required | Current IDs/fixtures/parity pass and all four comparator inventory values remain byte-identical. |
| BLK-DTA-ADAPTER | T1 | Exact skill-table versus harness-binding mismatch or unavailable exact pair receipt. | T1, T2 | AUTH-DTA-HUMAN; new authority for any harness mutation | Exact two-role binding attests successfully, or the explicit audit alone returns its existing local transport outcome. |
| BLK-DTA-SCOPE | dev-implementation backend | Exact proposed D29/skill/role/stage/scheduler/schema/Handoff/alias/cleanup/host/shipping expansion and smallest affected target set. | T1, T2 | New human authority required | Approved revised authority explicitly names the expansion; otherwise current targets remain unchanged. |
| BLK-DTA-ASSURANCE | dev-implementation backend | Existing blocker Handoff with consumed ordinary attempts/repair and current immutable target. | T1, T2 | Existing backend policy; no implicit continuation | New explicit authority arrives or the run stops incomplete without another attempt, token, review, opinion, or audit. |

Recovery preserves one shared lineage. Any accepted repair invalidates dependent proof at or after the changed target, not unaffected exact evidence permitted by current assurance policy. There is no integration fan-in and no special audit recovery path.

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-DTA-HANDOFF | Human authority | AUTH-DTA-HUMAN locator/digest and freeze IDs | Resolve every semantic fork; there is no open decision frontier. |
| ANC-DTA-CANONICAL | Active decisions | D10/D13, D09/D21, D04/D22, D07 consequence, INDEX | Bind the atomic durable contract cutover. |
| ANC-DTA-CLOSURE | Sole executable closure prompt | `.config/agents/skills/dev-implementation/references/worker-closure.md`; `worker-closure/v1` | Prevent prompt copies, aliases, parent review, and unbounded rounds. |
| ANC-DTA-TEST-VALUE | Unchanged permanent-test policy | `.config/agents/skills/dev-implementation/references/test-value.md`; D28 | Keep task-local closure and explicit portfolio audit on one exact value policy. |
| ANC-DTA-AUDIT | Explicit audit protocol | `.config/agents/skills/dev-test-audit/SKILL.md`; `references/audit-protocol.md`; `references/opinion-agent.md`; `test-audit/v1` | Bind intake, adapter seam, two opinions, aggregation, unknown preservation, and no mutation. |
| ANC-DTA-REVIEW | One final review | `.config/agents/skills/dev-code-review/SKILL.md`; D22 | Preserve axes/tags and apply the fixed harm/materiality classifier. |
| ANC-DTA-GUARDS | Semantic evidence | Selected IDs/fixtures in TGT-DTA-DEV-ASK-EVALS; ten audit-package IDs; scanner semantic map | Prove cutover without new dev-ask inventory. |
| ANC-DTA-COMPARATOR | Preserved comparison baseline | `compare_trace.py` plus commit/blob/SHA in VR-DTA-17 | Keep schemas, keep semantics, and inventory values exact. |
| ANC-DTA-PROTECTION | No-touch boundary | TGT-DTA-PRESERVATION | Detect accidental lifecycle, harness, plan, `/improve`, archive, or delivery drift. |
| ANC-DTA-SOURCES | Advisory evidence only | EVID-DTA-SOURCE-1 and EVID-DTA-SOURCE-2 | Cite ADR Evidence only; exclude source names/mechanics from portable prompts. |

### Non-authoritative ADR Evidence / source-revisions provenance

- EVID-DTA-SOURCE-1: pinned [`DietrichGebert/ponytail` commit `2ed6c52c9d7e5e56942508591085fd45dea277d3`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3), especially [`skills/ponytail/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/skills/ponytail/SKILL.md). Evidence only for the existing reuse/standard-library/native/already-installed-dependency ladder; upstream scope-reduction and proof-ceiling mechanics remain rejected.
- EVID-DTA-SOURCE-2: pinned [`cursor/plugins` commit `6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf`](https://github.com/cursor/plugins/commit/6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf), especially [`cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md`](https://github.com/cursor/plugins/blob/6e3d2ea56d7d446b955eaae6ac4c8eef8bf504cf/cursor-team-kit/skills/thermo-nuclear-code-quality-review/SKILL.md). Evidence only for candidate-local structural smell checks; broad scans, aggressive rewrites, repeated review, provider policy, and executable source branding remain rejected.

Settled implementation assumptions and contingencies:

- ASM-DTA-ADAPTER: Current exact audit harness bindings are sufficient and remain unchanged. Any direct inconsistency requiring harness edits is BLK-DTA-ADAPTER, not an implementation choice.
- ASM-DTA-HANDOFF: The existing Common Handoff and audit result prose can state repository versus repository-partial subsystem scope without a schema field. Any contrary parser/schema constraint is BLK-DTA-SCOPE.
- ASM-DTA-DEV-ASK-MATRIX: `B-DWO-WORKER-CLOSURE` and `R-DWO-TEST-AUDIT` are the complete dev-ask matrix owners for this cutover. Selected existing completion/review cases already have current comparator inventory membership; no dev-ask ID, fixture, or inventory value changes.
- ASM-DTA-AUDIT-MATRIX: `DTA-PARTIAL-BOUNDARY` and `DTA-CHANGED-TESTS-ONLY-NEAR-MISS` are the only new audit-package cases because no current case can absorb those independent boundary contracts without losing unique value. Audit-package cases have no dev-ask comparator inventory or fixture directory.
- ASM-DTA-SCANNER: `active_normalized_lines()` and the existing semantic comparator are the scanner extension seams. Active executable projections are strict; ADR Evidence, rejected alternatives, and historical prose retain provenance.
- ASM-DTA-BASELINE: The authoritative comparator baseline in VR-DTA-17 remains available and exact. Missing or mismatched baseline is BLK-DTA-GUARD-INVENTORY; execution cannot substitute a newer baseline.
- ASM-DTA-SCHEDULER: There is no current external scheduler to implement. A future scheduler may invoke the same explicit specialty contract, but this plan creates no process, role, config, or trigger.
- ASM-DTA-TERMINAL: No explicit portfolio audit or shipping action is part of this plan’s terminal route. A later human request starts fresh authority through the revised router.

## Completion Summary

- Delivered outcome: Engineering completion is terminal for compact, standard, and high-consequence routes; every semantic work shape uses bounded same-owner `worker-closure/v1`; `dev-test-audit` remains a separately requested, read-only, exact two-opinion specialty for complete frozen repository or named-subsystem boundaries.
- Material findings and decisions: The first final review found the stale WORKFLOW phrase `after plan completion`. The sole post-assurance repair corrected that projection and added an exact former-phrase scanner control. The concurrent user commit `11ace2cf0de20f30cdf34590d8711d0d20b635b8` replacing the manual `bro` fallback with `recap` was preserved and rebound as an orthogonal one-line target revision.
- Exact target: `sha256:13e752acddf32aacb7a979932c5c0bd0ea166dec370a769f759bdd2af8bcc56f`; manifest `local://dta-stable-rebound-verification-target-manifest.json@sha256:52b66bb616fb7c98fb288f2a5bcca8fe15194cbc2eb2ffa45149a96b21e704b2`.
- Independent evidence: verification aggregate `local://dta-stable-rebound-verification-aggregate.json@sha256:2877d9e795fe9c8b3081c3a611f1b796ec5c3a788b3d909d972164a4e407459f` is `VERIFIED` for all 17 criteria with fresh `17`, reused `0`, and mutation `none`; final review receipt `local://dta-stable-rebound-final-review-receipt.json@sha256:a07b9158200c7c5140fd71dede3bb1f33962fa1863fdfb5613ee1f38c26c3470` is `APPROVED` with zero blockers.
- Learning: `local://dta-terminal-learning-result.json@sha256:551b557cfc385f788b6d8fd876c804773ef0fb65e8c7af79283e2c16d8c61a19` settled `NO DURABLE LEARNING`; no repository or papercut-ledger mutation occurred.
- Residual risks: The final review carries two non-reopening advisories: an old local receipt mistypes its historical target-manifest digest, and `R-DWO-TEST-AUDIT` contains one non-material expected-Handoff wording ambiguity between `audit execution` and `audited-test execution`. Current behavior, independent audit oracles, protected contracts, and exact target evidence remain verified.
- Delivery boundary: No automatic `dev-test-audit` ran. No staging, commit, push, release, deployment, cleanup route, or other shipping action was authorized or performed.
