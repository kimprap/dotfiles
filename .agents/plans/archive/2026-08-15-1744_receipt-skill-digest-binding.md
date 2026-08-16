# Bind workflow receipt skill digests

**Datetime**: 2026-08-15-1744
**Authority kind**: local-authority
**Scope**: Close REVIEW-LEAN-B03 by binding each comparator receipt to the complete bytes of the registry-selected router or backend skill, then complete a fresh high-consequence assurance lifecycle
**Summary**: Starting from frozen target `5f2f64303f2b8dacbcc27483227993a908aa8febb617aea69f53bc145773419a`, change only the workflow comparator and its self-test definition so a well-formed but false `skill_sha256` fails. Preserve the blocked predecessor unchanged and run fresh independent verification, one initial final review, and assessment-only continual learning under a new parent outcome.
**Status**: DONE
**Completed At**: 2026-08-15-2348

## Objective

- Outcome: OUT-LEAN-RECEIPT-SKILL-DIGEST-BINDING
- Observable end state: `.config/agents/skills/dev-ask/evals/compare_trace.py` resolves the exact skill path from each registry case's `layer`, hashes that skill's complete bytes, and requires equality with receipt `skill_sha256`; the deterministic 20-check self-test proves valid `router`, `backend`, and `live` bindings pass, changing only `skill_sha256` to another lowercase 64-character digest fails with `receipt skill_sha256 mismatch`, and unsupported layer `other` fails closed with `unsupported registry layer: 'other'`; all other bytes from the 167-record base target remain exact; fresh high-consequence verification returns `VERIFIED`, the one initial review returns `APPROVED`, and assessment-only learning returns `NO DURABLE LEARNING` without a guidance write.
- Progress signal: `REVIEW-LEAN-B03` closed on the exact successor target, one of `AC-RSD-01` through `AC-RSD-06` proved, or an authorized material authority revision. Replanning, another audit, another initial review, artifact count, and elapsed time are not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-RSD-USER | human decision | Current request and supplied residual-plan and refinement handoffs | `USER-RSD-20260815-r2` | Native OMP approval of this exact local-authority plan revision is required before execution |
| AUTH-RSD-PREDECESSOR | frozen blocked predecessor | `.agents/plans/2026-08-13-1603_dev-workflow-lean-ordinary-path.md` | SHA-256 `c032dcafbf6fd92ed63cf8232dc20f500b77230929e135664696dc8d809a2c33`; `Status: IN_PROGRESS` | Read and preserve only; never revise, complete, archive, or resume its exhausted repair/review lifecycle |
| AUTH-RSD-TERMINAL | frozen terminal Handoff | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-14T17-14-49-816Z_01a00144-ee58-7000-8036-da1d5fe8b2ee/local/lean-terminal-assurance-handoff.md` | SHA-256 `67007e6031082ce8b09db3bda228a20f2aaba8a7dd9f175ed410a63282599162`; blocked at `REVIEW-LEAN-B03` | Evidence only; no continuation authority for `OUT-DEV-WORKFLOW-LEAN-ORDINARY-PATH` |
| AUTH-RSD-REVIEW | frozen review finding | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-14T17-14-49-816Z_01a00144-ee58-7000-8036-da1d5fe8b2ee/local/review-lean-terminal-handoff.json` | SHA-256 `07ebe8d0b361a4a35bff90da95402eafb9159cfc49ef04e29ec77c41806aa754`; `REVIEW-LEAN-B03` | Defines the sole implementation defect this outcome may close |
| AUTH-RSD-BASE | immutable implementation base | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-14T17-14-49-816Z_01a00144-ee58-7000-8036-da1d5fe8b2ee/local/t1-lean-target-manifest.tsv` | SHA-256 `5f2f64303f2b8dacbcc27483227993a908aa8febb617aea69f53bc145773419a`; 167 records; 23,628 bytes; all records matched the current worktree during planning | T1 must re-establish exact equality before its first edit; no reconstruction or substituted base is authorized |
| AUTH-RSD-WORKFLOW | current lifecycle authority | `docs/adr/0003-bounded-assurance-and-repair.md` D03, D04, D22; `docs/adr/0004-canonical-discovery-and-continual-learning.md` D07; `.config/agents/skills/dev-ask/WORKFLOW.md`; `dev-implementation`, `dev-verification`, `dev-code-review`, `dev-continual-learning`, and `dev-handoff` skills | ADR-0003 `65344607ee803e8ffbec31a7c55a5c93e84f398686c4815081fe459f5d52f459`; ADR-0004 `9d4bc7d4859bca1dbf6ac33ab14bb9e95c33c407f0074d8c311247964ef10605`; WORKFLOW `01c1a9f98765b6c676b67ff304c77168baef2a6a8f844e43734b188be7f5324d`; implementation `ff01349a2d5c9f29e85a95a34376e32b34237323d6deaf52ac6134e52363baec`; verification `1590918c008aa2c25865d3cf78ce8ee43df548ab9d83c5dfa4948e663b953b4f`; review `81aec56b54f97968b96a2cd2e471b17b7e28ea3fed51ba2ddd806eb415adba86`; learning `8be68564b3a852c0ddb488cd725829b821c62ab583d2ce52657793dd08d2a600`; handoff `c936473fa2480ada5bff6e036d4ab5b170d06d5285fce701b8ff2990e207b058` | Apply without changing these contracts |
| AUTH-RSD-RULES | applicable plan and repository rules at planning time | Repository and user `AGENTS.md`; `rule://plan`; `rule://plan-impl-spec`; `rule://plan-omp-transport`; `rule://plan-repo-storage`; `rule://canonical-project-contracts`; `rule://git-dotfiles` | repo AGENTS `840c44a316e5266ab38b9fe9784f6d32bad8b904dda82f2fdbc898e72b38ebe4`; user AGENTS `1ab60d54c0ba71feae07fe64361a0f2acd749ebf368290998a83a11cbd4998e9`; plan `e57cde63de93714f4e30c67a3eda3e4f416987b22ee2412ec3cb7f4c98119448`; implementation-plan `58d6fabcf02fcaf890849dc3b6451719463275731c26e9ca5b5175ab48c006cb`; OMP transport `df3a4c75c548770513dd738d4bb1fd95577b30d3eaf1c6d3b37c460bce2fb925`; repository storage `cd537adc74d2908dc08e2c2e380568b9ca78cdaf292915bca28d620e0f898dbd`; canonical contracts `4c7e6e788cdc03ff6dc4d5e24286f9a3616a9986f92f05bbe57c3dcbcd2a520c`; git-dotfiles `43cada15d3e6dbd4b7bcb86b7eda15c56354556f7c34cc40dd3dbb69dd2482dc` | Backend must freshly enumerate and validate the complete applicable-rule manifest before T2 and T3; planning-time equality is not dispatch authority |

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-RSD-NEW-OUTCOME | AUTH-RSD-USER `USER-RSD-20260815-r2` | Use new parent `OUT-LEAN-RECEIPT-SKILL-DIGEST-BINDING`. It receives fresh D03 state—semantic attempts `0/2`, post-assurance repair `unused 1/1`, initial review `not run`, review rerun `unused`—only because its outcome is the residual receipt-binding defect. None of these fields alters or resets the predecessor's exhausted state. |
| DEC-RSD-SCOPE | AUTH-RSD-USER `USER-RSD-20260815-r2` | Close only `REVIEW-LEAN-B03`. Change no workflow policy, receipt schema, CLI arguments, registry case, fixture, producer/sealer behavior, skill, ADR, or predecessor history. |
| DEC-RSD-BINDING | AUTH-RSD-REVIEW `REVIEW-LEAN-B03`; AUTH-RSD-USER `USER-RSD-20260815-r2` | Derive `router → .config/agents/skills/dev-ask/SKILL.md` and both `backend` and `live → .config/agents/skills/dev-implementation/SKILL.md` from the selected registry case; require a supported layer and a non-symlink regular skill file; add its complete-byte SHA-256 to `validate_receipt()`'s expected digest comparisons. Copy the exact canonical-registry suffix check and `Path(*parts[:-len(suffix)])` root reconstruction from `observe_case.py`; raise `CompareError`, do not import the producer, and keep fixture resolution relative to the registry's `evals` directory. |
| DEC-RSD-SELFTEST | AUTH-RSD-REVIEW `REVIEW-LEAN-B03`; AUTH-RSD-USER `USER-RSD-20260815-r2` | Replace the fabricated baseline `"c" * 64` with the actual synthetic backend-skill digest; implement explicit `apply_selftest_mutation` branches for `router-skill-binding`, `live-skill-binding`, `skill-digest-mismatch`, and `unsupported-layer`; preserve the existing 16 checks and schema. Both JSON checks and `run_selftest.expected_names` must use this exact 20-name order: `pass-observation`, `router-skill-binding`, `live-skill-binding`, `skill-digest-mismatch`, `unsupported-layer`, `raw-result-contradiction`, `route-mismatch`, `owners-mismatch`, `first-owner-mismatch`, `missing-required-event`, `forbidden-event`, `wrong-event-order`, `wrong-state-trace`, `missing-scripted-reply`, `wrong-scripted-reply-order`, `runtime-mismatch`, `undeclared-runtime-mutation`, `source-fixture-mismatch`, `malformed-input`, `unknown-case`. |
| DEC-RSD-ASSURANCE | AUTH-RSD-USER `USER-RSD-20260815-r2` | Prior failure and receipt-authenticity tooling require `high-consequence`; compact is disqualified. Use one sequential implementation owner, fresh independent verification, one eligible initial review, and neutral assessment-only learning. |
| DEC-RSD-NO-SHIP | AUTH-RSD-USER `USER-RSD-20260815-r2` | Local implementation and proof only. No staging, commit, push, review request, release, deployment, or archival of the blocked predecessor. |
| DEC-RSD-D03 | ADR-0003 `65344607ee803e8ffbec31a7c55a5c93e84f398686c4815081fe459f5d52f459`, D03 | This new outcome has at most two semantic attempts and one run-wide consolidated post-assurance repair. Attempt 2 requires criterion progress, exact blocker closure, or an authorized changed hypothesis. One initial review is allowed; only one impacted rerun may follow an eligible repair. |
| DEC-RSD-D04 | ADR-0003 `65344607ee803e8ffbec31a7c55a5c93e84f398686c4815081fe459f5d52f459`, D04 | T1 must smoke the exact changed comparator behavior. T2 independently verifies the final single-lineage target; no assurance owner may repair it. |
| DEC-RSD-D22 | ADR-0003 `65344607ee803e8ffbec31a7c55a5c93e84f398686c4815081fe459f5d52f459`, D22 | T3 is the sole initial whole-scope Standards and Specification review. Only an authority-bound finding on the two changed files or their required current consumers can block this outcome; unrelated mutable drift is advisory or separate intake. |
| DEC-RSD-D07 | ADR-0004 `9d4bc7d4859bca1dbf6ac33ab14bb9e95c33c407f0074d8c311247964ef10605`, D07 | T4 runs once after an approved reviewed target. This plan narrows it to assessment-only: successful completion is `NO DURABLE LEARNING`, with no project or user guidance mutation. |

## Scope, non-goals, and prohibited effects

- Read surfaces: AUTH-RSD-PREDECESSOR, AUTH-RSD-TERMINAL, AUTH-RSD-REVIEW, AUTH-RSD-BASE; `.config/agents/skills/dev-ask/evals/compare_trace.py`; `.config/agents/skills/dev-ask/evals/compare_trace_selftest.json`; `.config/agents/skills/dev-ask/evals/observe_case.py`; `.config/agents/skills/dev-ask/evals/evals.json`; the two layer skill files; applicable plan/repository rules; ADR-0003 D03/D04/D22; ADR-0004 D07; and the named lifecycle skills.
- Change surfaces: only `.config/agents/skills/dev-ask/evals/compare_trace.py`, `.config/agents/skills/dev-ask/evals/compare_trace_selftest.json`, and session-local evidence `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv`.
- Non-goals: no workflow-policy redesign; no receipt, observation, interaction, runtime, or result schema change; no CLI change; no shared helper module; no `observe_case.py`, `evals.json`, fixture, skill, ADR, AGENTS, or plan-rule change; no predecessor continuation, completion, or archival.
- Prohibited effects: changing any of the 165 non-owned records in AUTH-RSD-BASE; changing either frozen predecessor Handoff; changing or moving AUTH-RSD-PREDECESSOR; writing guidance in T4; creating repository observation roots; staging or delivery; editing live symlink targets outside `~/.dotfiles`.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-RSD-REPO | permitted repository write | AUTH-RSD-USER after exact-plan approval | Edit only the two declared repository files from their exact base hashes; locally reversible |
| EFF-RSD-EVIDENCE | permitted session-local write | AUTH-RSD-USER after exact-plan approval | Write only `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv` plus in-conversation Common Handoffs; never treat evidence as authority |
| EFF-RSD-TEMP | permitted disposable runtime effect | AUTH-RSD-USER after exact-plan approval | `compare_trace.py --self-test` may use only its `tempfile.TemporaryDirectory` roots outside the repository and must leave no repository file |
| EFF-RSD-PRESERVE | prohibited mutation | AUTH-RSD-PREDECESSOR and AUTH-RSD-BASE | Predecessor plan stays SHA-256 `c032dcafbf6fd92ed63cf8232dc20f500b77230929e135664696dc8d809a2c33`, terminal Handoff stays `67007e6031082ce8b09db3bda228a20f2aaba8a7dd9f175ed410a63282599162`, review Handoff stays `07ebe8d0b361a4a35bff90da95402eafb9159cfc49ef04e29ec77c41806aa754`, and all 165 non-owned base records stay exact |
| EFF-RSD-GUIDANCE | prohibited mutation | AUTH-RSD-USER and D07 | T4 assesses only; no skill, rule, AGENTS, ADR, index, workflow, memory, or papercut write |
| EFF-RSD-DELIVERY | prohibited external/repository-state effect | AUTH-RSD-USER and repository guide | No staging, commit, push, review request, release, deploy, rollout, tracker mutation, or shipping |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-RSD-LAYER-SKILL | Comparator-local `repository_root_for_registry(registry: Path) -> Path` copies `observe_case.py` lines 153–163 exactly except for error type: `suffix = Path(".config/agents/skills/dev-ask/evals/evals.json").parts`, exact trailing-parts equality, `root = Path(*parts[:-len(suffix)])`, absolute-root normalization, strict resolution, and `CompareError` for the canonical-suffix failure. `expected_skill_path(repository_root: Path, layer: Any) -> Path` maps `router` to `dev-ask/SKILL.md`, maps `backend` and `live` to `dev-implementation/SKILL.md`, raises `CompareError` for every other value, calls existing `require_regular(candidate, "skill")`, then returns the strict resolved candidate. The existing fixture expression stays registry-relative as `registry_path.parent / case.get("fixture_dir", "") / "case.json"`; it is never reconstructed from repository root. Do not import `observe_case.py` or create a shared module. | T1 | `RSD-LAYER-SKILL-20260815-r2` | `compare_case`, `validate_receipt`, `selftest_base`, `apply_selftest_mutation`, `run_selftest`, T2 |
| CONTRACT-RSD-RECEIPT | `validate_receipt(receipt: Any, case_id: str, fixture_path: Path, skill_path: Path, request_sha256: str, reply_hashes: list[str], source_manifest: dict[str, str], target_digest: str, raw_path: Path, observed_path: Path, interaction_path: Path, runtime_evidence_path: Path, mismatches: list[str]) -> None` retains all existing receipt keys and checks, adds `skill_sha256: sha256_file(skill_path)` to `expected_digests`, and reports `receipt skill_sha256 mismatch` through the existing generic digest loop. The coupled self-test contract covers `selftest_base`, `apply_selftest_mutation`, and `run_selftest`: JSON and `expected_names` are exactly `pass-observation`, `router-skill-binding`, `live-skill-binding`, `skill-digest-mismatch`, `unsupported-layer`, `raw-result-contradiction`, `route-mismatch`, `owners-mismatch`, `first-owner-mismatch`, `missing-required-event`, `forbidden-event`, `wrong-event-order`, `wrong-state-trace`, `missing-scripted-reply`, `wrong-scripted-reply-order`, `runtime-mismatch`, `undeclared-runtime-mutation`, `source-fixture-mismatch`, `malformed-input`, `unknown-case`; the first three expect pass and every remaining name expects fail. | T1 | `RSD-RECEIPT-20260815-r2` | Common-bundle comparator, all 149 current registry cases, T2, T3 |
| CONTRACT-RSD-TARGET | The successor manifest at `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv` has the same 167 sorted path records and 23,628-byte serialization as AUTH-RSD-BASE; only the complete-byte hash values for `compare_trace.py` and `compare_trace_selftest.json` differ; its SHA-256 is the immutable T1 target identity | T1 | `RSD-TARGET-20260815-r2` | T2, T3, T4, backend completion accounting |
| CONTRACT-RSD-ASSURANCE | High-consequence single-lineage lifecycle: T1 smoke, fresh T2 verification, one eligible T3 initial review, then T4 assessment-only `NO DURABLE LEARNING`; each role returns one Common Handoff to `dev-implementation backend` | T1 | `RSD-ASSURANCE-20260815-r1` | T2, T3, T4 |

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-RSD-BASE | AUTH-RSD-BASE 167-record manifest and its current worktree projection | T1 | SHA-256 `5f2f64303f2b8dacbcc27483227993a908aa8febb617aea69f53bc145773419a`; 23,628 bytes | All successor identity checks | AC-RSD-03 |
| TGT-RSD-COMPARATOR | `.config/agents/skills/dev-ask/evals/compare_trace.py`: `repository_root_for_registry`, `expected_skill_path`, `compare_case`, `validate_receipt`, `selftest_base`, `apply_selftest_mutation`, and `run_selftest` | T1 | SHA-256 `42cf286938e6813909043212e1940c78f85041d87f84582e1de2bb88037b2242` | One `validate_receipt` call; 149 registry cases: 64 `router`, 80 `backend`, 5 `live` | AC-RSD-01, AC-RSD-02 |
| TGT-RSD-SELFTEST | `.config/agents/skills/dev-ask/evals/compare_trace_selftest.json` | T1 | SHA-256 `66908c3741b54f43de627e4f4cca80f3b8a5d960abce4c283c86eadd660495cf`; 16 ordered checks | `run_selftest` exact ordered-name validator | AC-RSD-01, AC-RSD-02 |
| TGT-RSD-PRODUCER | `.config/agents/skills/dev-ask/evals/observe_case.py` path mapping and bind/seal receipt production | T1 | SHA-256 `9f2eeae63a237476027786c84179648699d0a2250169d053e3fa5a3414bab7cd` | `repository_root_for_registry`, `expected_skill_path`, `canonical_binding_paths`, `revalidate_binding` | AC-RSD-01, AC-RSD-03 |
| TGT-RSD-REGISTRY | `.config/agents/skills/dev-ask/evals/evals.json` current finite consumer map | T1 | SHA-256 `a18d63259350ec8c8f6ef7369fa3b483aa9abd404975fdb13c8c899103c00d71`; 149 cases; layer counts 64/80/5 | `case_map`, `compare_case` | AC-RSD-01, AC-RSD-03 |
| TGT-RSD-FINAL | `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv`, the 167-record successor serialization | T1 | Absent until T1; exact digest produced after smoke | T2 through T4 | AC-RSD-03 |
| TGT-RSD-VERIFY-EVIDENCE | Fresh Verifier Handoff naming TGT-RSD-FINAL and all criterion evidence | T2 | Absent until T2 | Backend then T3 | AC-RSD-04 |
| TGT-RSD-REVIEW-EVIDENCE | Initial Review Handoff naming the unchanged verified target | T3 | Absent until T3 | Backend then T4 | AC-RSD-05 |
| TGT-RSD-LEARN-EVIDENCE | Assessment-only Curator Handoff naming the unchanged reviewed target and zero changed guidance paths | T4 | Absent until T4 | Backend then `dev-ask` completion presentation | AC-RSD-06 |

## Execution policy

- Assurance: `high-consequence`; explicit user requirement, prior failed review, and receipt-authenticity tooling each independently disqualify compact.
- Topology: one-owner-sequential implementation with separate fresh assurance identities.
- Max concurrency: 1
- Isolation: no implementation worktree; the exact dirty worktree represented by AUTH-RSD-BASE is the input. T2, T3, and T4 are fresh role contexts and may not mutate the target.
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: before T1 edits, rehash all 167 AUTH-RSD-BASE records and all frozen predecessor evidence. Any mismatch in those inputs stops at BLK-RSD-BASE without reset or overwrite. After T1 begins, any non-owned manifest change stops descendants; unrelated files outside the declared 167-record causal boundary are preserved and are advisory unless they establish a separate safety stop.
- Decomposition: prohibited for T1; T2, T3, and T4 are required lifecycle owners, not implementation slices. No batch or integration task.
- Effect limit: EFF-RSD-REPO, EFF-RSD-EVIDENCE, EFF-RSD-TEMP, EFF-RSD-PRESERVE, EFF-RSD-GUIDANCE, EFF-RSD-DELIVERY.
- Orchestrator profile: one qualified implementation owner plus fresh, decorrelated high-consequence verifier/reviewer contexts and a neutral curator. A capability substitution that weakens independence is `transport-unavailable`; no compact or same-context assurance downgrade is allowed.

The new outcome begins with semantic attempts `0/2`, post-assurance repair `unused 1/1`, initial review `not run`, and review rerun `unused`. T1 attempt 2 is available only under D03. T2 and T3 dispatch only after the backend freshly validates the complete applicable-rule manifest. If T2 or T3 returns an eligible same-outcome blocker, the backend may use the new outcome's one consolidated repair only within AC-RSD-01 through AC-RSD-03, followed by impacted verification and at most one review rerun; it may not touch or reset the predecessor lifecycle.

## Tasks

- [x] T1. Bind and smoke the receipt skill digest
  completed 2026-08-15-2325
  - Owner: receipt-skill-implementation-owner
  - Wave: W0
  - Depends on: none
  - Targets: TGT-RSD-BASE, TGT-RSD-COMPARATOR, TGT-RSD-SELFTEST, TGT-RSD-PRODUCER, TGT-RSD-REGISTRY, TGT-RSD-FINAL
  - Contracts: CONTRACT-RSD-LAYER-SKILL, CONTRACT-RSD-RECEIPT, CONTRACT-RSD-TARGET, CONTRACT-RSD-ASSURANCE
  - Criteria: AC-RSD-01, AC-RSD-02, AC-RSD-03
  - Effects: EFF-RSD-REPO, EFF-RSD-EVIDENCE, EFF-RSD-TEMP, EFF-RSD-PRESERVE, EFF-RSD-GUIDANCE, EFF-RSD-DELIVERY
  - Output: OUTP-RSD-FINAL
  - Receiver: dev-implementation backend
  - Verification: VR-RSD-01, VR-RSD-02, VR-RSD-03
  - Lineage: shared
  - Implementation:
    1. Re-read both owned files and rehash AUTH-RSD-BASE, AUTH-RSD-PREDECESSOR, AUTH-RSD-TERMINAL, and AUTH-RSD-REVIEW. Stop before editing on any mismatch.
    2. In `compare_trace.py`, add comparator-local `repository_root_for_registry(registry: Path) -> Path` with the exact `observe_case.py` suffix constant, trailing-parts equality, `Path(*parts[:-len(suffix)])` reconstruction, absolute-root normalization, and strict resolution; change only `ObservationError` to `CompareError`. Add `expected_skill_path(repository_root: Path, layer: Any) -> Path` with the exact router/backend/live map from CONTRACT-RSD-LAYER-SKILL; form one candidate, call existing `require_regular(candidate, "skill")`, and return its strict resolution. Do not import `observe_case.py` and do not create a shared module.
    3. In `compare_case`, after the selected case is known, call `repository_root_for_registry(registry_path.resolve(strict=True))` and derive `skill_path = expected_skill_path(repository_root, case.get("layer"))` inside the existing `CompareError`-handled fixture/evidence load block. Pass `skill_path` to the only `validate_receipt` call. Keep fixture resolution exactly registry-relative as `registry_path.parent / case.get("fixture_dir", "") / "case.json"`; do not resolve fixtures from repository root.
    4. Add `skill_path: Path` to `validate_receipt` and add `"skill_sha256": sha256_file(skill_path)` to `expected_digests`. Leave `RECEIPT_KEYS`, schemas, all CLI arguments, and every other expected digest unchanged.
    5. Rewrite `selftest_base` so `repository_root = root / "repository"`, `eval_dir = repository_root / ".config/agents/skills/dev-ask/evals"`, and `fixture_dir = eval_dir / "fixtures/case"`; create the registry at `eval_dir / "evals.json"`, router skill at `repository_root / ".config/agents/skills/dev-ask/SKILL.md"` with complete bytes `router self-test skill\n`, and backend skill at `repository_root / ".config/agents/skills/dev-implementation/SKILL.md"` with complete bytes `backend self-test skill\n`. Return them as `paths["router_skill"]` and `paths["backend_skill"]`. Keep observation, receipt, raw result, interaction, runtime evidence, and runtime together directly under `root`, outside `root / "repository"`. Set baseline receipt `skill_sha256` to `sha256_file(backend_skill)`; `live` intentionally reuses that backend digest.
    6. In `apply_selftest_mutation`, add four named branches immediately after `pass-observation` and before the existing malformed/unknown/observation branches. `router-skill-binding` changes the synthetic registry case layer to `router`, changes receipt `skill_sha256` to `sha256_file(paths["router_skill"])`, writes both JSON objects, and returns `CASE`. `live-skill-binding` changes only the registry layer to `live`, leaves the baseline backend receipt digest untouched, writes the registry, and returns `CASE`. `skill-digest-mismatch` changes only receipt `skill_sha256` to `"0" * SHA256_LENGTH` unless that is the current digest, otherwise `"1" * SHA256_LENGTH`, writes the receipt, and returns `CASE`. `unsupported-layer` changes only the registry layer to `"other"`, writes the registry, and returns `CASE`; `expected_skill_path` must make comparison return `status: fail` with sole mismatch `unsupported registry layer: 'other'`.
    7. In `compare_trace_selftest.json`, insert four checks immediately after `pass-observation`: `router-skill-binding` pass, `live-skill-binding` pass, `skill-digest-mismatch` fail, and `unsupported-layer` fail. Rewrite `run_selftest.expected_names` to the same exact 20-name order frozen in CONTRACT-RSD-RECEIPT; retain every original expected status and the `lean-eval-trace-selftest/v1` and `lean-eval-trace-selftest-result/v1` schemas.
    8. Run VR-RSD-01 through VR-RSD-03. Rebuild the successor manifest from the same 167 ordered paths, require exactly the two owned hashes to differ, write those exact bytes to `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv`, and bind its digest in OUTP-RSD-FINAL.
    9. Return a Common Handoff with the exact blocker closure `REVIEW-LEAN-B03 → AC-RSD-01/02 → validate_receipt/common-bundle comparator → VR-RSD-01/02 → expected false digest and unsupported layer fail → observed false digest and unsupported layer fail on TGT-RSD-FINAL`, plus attempts, preservation, and no-shipping evidence.
- [x] T2. Independently verify the successor target
  completed 2026-08-15-2336
  - Owner: dev-verification
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-RSD-FINAL, TGT-RSD-VERIFY-EVIDENCE
  - Contracts: CONTRACT-RSD-LAYER-SKILL, CONTRACT-RSD-RECEIPT, CONTRACT-RSD-TARGET, CONTRACT-RSD-ASSURANCE
  - Criteria: AC-RSD-04
  - Effects: EFF-RSD-TEMP, EFF-RSD-PRESERVE, EFF-RSD-GUIDANCE, EFF-RSD-DELIVERY
  - Output: OUTP-RSD-VERIFIED
  - Receiver: dev-implementation backend
  - Verification: VR-RSD-04
  - Lineage: shared
  - Implementation:
    1. Start only after backend validation of OUTP-RSD-FINAL and a freshly complete applicable-rule manifest. Bind the exact successor manifest and rehash it before evidence collection.
    2. Without using the worker conclusion as proof, rerun VR-RSD-01 through VR-RSD-03 in a fresh context; inspect the sole `validate_receipt` call and all 149 current layer consumers; confirm `router`, `backend`, and `live` bind actual skill bytes, the receipt-digest negative changes only `skill_sha256`, and `unsupported-layer` changes only the layer to `other` and fails with the intended `CompareError` mismatch.
    3. Rehash TGT-RSD-FINAL after evidence. Return `VERIFIED` only if every criterion passes on one unchanged identity; otherwise return `NOT VERIFIED` or `INCONCLUSIVE` with exact AC and entry. Do not repair or reformat.
- [x] T3. Run the one initial final review
  completed 2026-08-15-2344
  - Owner: dev-code-review
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-RSD-FINAL, TGT-RSD-REVIEW-EVIDENCE
  - Contracts: CONTRACT-RSD-RECEIPT, CONTRACT-RSD-TARGET, CONTRACT-RSD-ASSURANCE
  - Criteria: AC-RSD-05
  - Effects: EFF-RSD-PRESERVE, EFF-RSD-GUIDANCE, EFF-RSD-DELIVERY
  - Output: OUTP-RSD-REVIEWED
  - Receiver: dev-implementation backend
  - Verification: VR-RSD-05
  - Lineage: shared
  - Implementation:
    1. Start only from T2 `VERIFIED`, the unchanged successor manifest, an unused initial-review slot, and a freshly complete applicable-rule manifest.
    2. Perform one Standards and Specification pass over the two-file diff, its one comparator callsite, the producer mapping, the 149-case finite consumer map, all 20 exact self-test names, mutation fault isolation, unsupported-layer fail-closed proof, two-file scope, and preservation evidence. The included causal boundary is the 167-record successor plus the frozen predecessor artifacts; files outside it are excluded mutable state unless they establish a separate safety issue.
    3. Return `APPROVED` only when `REVIEW-LEAN-B03` is closed and both axes pass. Aggregate any eligible blocker once; do not repair, ship, run another initial pass, or treat unrelated drift as a same-outcome blocker.
- [x] T4. Assess learning without guidance mutation
  completed 2026-08-15-2348
  - Owner: dev-continual-learning
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-RSD-FINAL, TGT-RSD-LEARN-EVIDENCE
  - Contracts: CONTRACT-RSD-TARGET, CONTRACT-RSD-ASSURANCE
  - Criteria: AC-RSD-06
  - Effects: EFF-RSD-PRESERVE, EFF-RSD-GUIDANCE, EFF-RSD-DELIVERY
  - Output: OUTP-RSD-LEARNED
  - Receiver: dev-implementation backend
  - Verification: VR-RSD-06
  - Lineage: shared
  - Implementation:
    1. Start only from T3 `APPROVED` on the unchanged successor manifest.
    2. Inspect only the two affected artifacts and settled B03 evidence. Change no guidance. Record any candidate under `Skipped` or `Deep candidate`; do not dispatch Deep maintenance.
    3. Return `NO DURABLE LEARNING` with `Updated: none`, `Added: none`, `Removed: none`, zero changed paths, unchanged target identity, and one backend receiver. Backend then performs existing terminal accounting to `dev-ask`; no new semantic task is added.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-RSD-01 | A selected registry case with `layer` `router`, `backend`, or `live`, plus the canned `unsupported-layer` case with layer `other` | Comparator derives the exact mapped non-symlink regular skill path, hashes complete bytes, and compares that digest through `validate_receipt`; all 149 current registry cases resolve within the finite map 64 router / 80 backend / 5 live; canned `unsupported-layer` returns `status: fail` with sole mismatch `unsupported registry layer: 'other'`, proving unsupported layer values fail closed; missing, symlink, or non-regular mapped skill files raise `CompareError` through existing `require_regular` | TGT-RSD-COMPARATOR, TGT-RSD-SELFTEST, TGT-RSD-PRODUCER, TGT-RSD-REGISTRY | T1 |
| AC-RSD-02 | Comparator deterministic self-test | The original 16 checks retain their statuses; `router-skill-binding` and `live-skill-binding` pass; `skill-digest-mismatch` and `unsupported-layer` fail for their intended isolated faults; overall `lean-eval-trace-selftest-result/v1` is `status: pass` with exactly 20 ordered results matching CONTRACT-RSD-RECEIPT | TGT-RSD-COMPARATOR, TGT-RSD-SELFTEST | T1 |
| AC-RSD-03 | Worktree before and after T1 | Before edit, all 167 AUTH-RSD-BASE records match. After edit, the successor serialization still has 167 records and 23,628 bytes; only the two owned path hashes differ; producer, registry, skills, ADRs, rules, 165 other base records, predecessor plan/Handoffs, staging state, and delivery state remain unchanged | TGT-RSD-BASE, TGT-RSD-PRODUCER, TGT-RSD-REGISTRY, TGT-RSD-FINAL | T1 |
| AC-RSD-04 | Frozen successor manifest plus OUTP-RSD-FINAL and complete backend-validated rule manifest | Fresh verifier independently reruns the binding fault, branch checks, finite consumer map, and preservation proof; target pre/post identity is equal; aggregate verdict is `VERIFIED` | TGT-RSD-VERIFY-EVIDENCE | T2 |
| AC-RSD-05 | Unchanged `VERIFIED` successor and unused initial-review slot | One initial high-consequence review returns `Standards: PASS`, `Specification: PASS`, `Overall: APPROVED`; `REVIEW-LEAN-B03` is closed; no unrelated finding expands the outcome | TGT-RSD-REVIEW-EVIDENCE | T3 |
| AC-RSD-06 | Unchanged reviewed successor | One neutral assessment-only pass returns `NO DURABLE LEARNING`; no guidance or user/global path changes; backend has complete terminal evidence for `dev-ask` | TGT-RSD-LEARN-EVIDENCE | T4 |

## Verification / Done criteria

- [x] VR-RSD-01. Prove complete-byte skill digest enforcement
  - Criterion: AC-RSD-01
  - Proof class: worker smoke
  - Scenario / environment / fixture: from `/Users/kim/.dotfiles`, run `python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`; inspect the exact copied body of `repository_root_for_registry`, `expected_skill_path`, the registry-relative fixture expression, the derived `skill_path` inside the existing handled block, the sole `validate_receipt` call, and `expected_digests`; run `python3 -c 'import collections,json; from pathlib import Path; cases=json.loads(Path(".config/agents/skills/dev-ask/evals/evals.json").read_text(encoding="utf-8"))["cases"]; counts=collections.Counter(case.get("layer") for case in cases); assert len(cases)==149 and counts==collections.Counter({"router":64,"backend":80,"live":5}); print(dict(sorted(counts.items())))'`
  - Evidence form: comparator exit 0 and overall schema `lean-eval-trace-selftest-result/v1`; baseline and all three supported layer branches use actual synthetic skill bytes; `skill-digest-mismatch` expected and observed failing with `receipt skill_sha256 mismatch`; `unsupported-layer` expected and observed failing with sole mismatch `unsupported registry layer: 'other'`; static path shows `skill_sha256` compared to `sha256_file(skill_path)` and skill candidates guarded by `require_regular`; consumer command prints `{'backend': 80, 'live': 5, 'router': 64}`
  - Target recheck: TGT-RSD-COMPARATOR, TGT-RSD-SELFTEST, TGT-RSD-PRODUCER, TGT-RSD-REGISTRY
  - Receiver: dev-implementation backend
- [x] VR-RSD-02. Prove exact self-test and consumer coverage
  - Criterion: AC-RSD-02
  - Proof class: targeted-test and static-inspection
  - Scenario / environment / fixture: inspect `selftest_base`, all four new `apply_selftest_mutation` branches, the 20 ordered JSON checks, and `run_selftest.expected_names`, then from `/Users/kim/.dotfiles` run `python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`; require this exact order in both code and result: `pass-observation`, `router-skill-binding`, `live-skill-binding`, `skill-digest-mismatch`, `unsupported-layer`, `raw-result-contradiction`, `route-mismatch`, `owners-mismatch`, `first-owner-mismatch`, `missing-required-event`, `forbidden-event`, `wrong-event-order`, `wrong-state-trace`, `missing-scripted-reply`, `wrong-scripted-reply-order`, `runtime-mismatch`, `undeclared-runtime-mutation`, `source-fixture-mismatch`, `malformed-input`, `unknown-case`
  - Evidence form: exit 0; self-test result contains exactly those 20 ordered entries; `pass-observation`, `router-skill-binding`, and `live-skill-binding` pass; every other expected and observed status is fail; the original 16 names and statuses are unchanged; observation, receipt, raw result, interaction, runtime evidence, and runtime share one evidence-bundle root while only the synthetic repository occupies its `repository` child
  - Target recheck: TGT-RSD-COMPARATOR, TGT-RSD-SELFTEST
  - Receiver: dev-implementation backend
- [x] VR-RSD-03. Prove exact-base succession and prohibited-effect absence
  - Criterion: AC-RSD-03
  - Proof class: identity-check
  - Scenario / environment / fixture: before edit, hash the absolute AUTH-RSD-BASE bytes and each listed worktree file and require zero mismatches. After smoke, from `/Users/kim/.dotfiles`, run `python3 -c 'import hashlib; from pathlib import Path; root=Path(".").resolve(); base=Path("/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-14T17-14-49-816Z_01a00144-ee58-7000-8036-da1d5fe8b2ee/local/t1-lean-target-manifest.tsv"); rows=[line.split("\t",1) for line in base.read_text(encoding="utf-8").splitlines()]; current=[(path,hashlib.sha256((root/path).read_bytes()).hexdigest()) for path,_ in rows]; changed=[path for (path,old),(_,new) in zip(rows,current) if old!=new]; assert hashlib.sha256(base.read_bytes()).hexdigest()=="5f2f64303f2b8dacbcc27483227993a908aa8febb617aea69f53bc145773419a" and len(rows)==167 and changed==[".config/agents/skills/dev-ask/evals/compare_trace.py",".config/agents/skills/dev-ask/evals/compare_trace_selftest.json"]; payload="".join(f"{path}\t{digest}\n" for path,digest in current).encode("utf-8"); assert len(payload)==23628; print(hashlib.sha256(payload).hexdigest())'`; compare the same payload byte-for-byte with TGT-RSD-FINAL; run `git -C . diff --cached --quiet`; rehash the three frozen predecessor artifacts
  - Evidence form: zero pre-edit mismatches; one printed successor digest matching TGT-RSD-FINAL; exactly two changed records; 167 records; 23,628 bytes; cached diff command exit 0; predecessor hashes remain `c032dcafbf6fd92ed63cf8232dc20f500b77230929e135664696dc8d809a2c33`, `67007e6031082ce8b09db3bda228a20f2aaba8a7dd9f175ed410a63282599162`, and `07ebe8d0b361a4a35bff90da95402eafb9159cfc49ef04e29ec77c41806aa754`; no delivery action
  - Target recheck: TGT-RSD-BASE, TGT-RSD-PRODUCER, TGT-RSD-REGISTRY, TGT-RSD-FINAL
  - Receiver: dev-implementation backend
- [x] VR-RSD-04. Independently verify the successor
  - Criterion: AC-RSD-04
  - Proof class: independent verification
  - Scenario / environment / fixture: backend validates the complete current rule manifest; fresh verifier binds TGT-RSD-FINAL, rehashes before, reruns VR-RSD-01 through VR-RSD-03 without worker conclusions, verifies the exact mismatch fault and all 149 finite consumers, then rehashes after
  - Evidence form: one Verifier Handoff with `VERIFIED`, per-check expected/observed results, complete consumer counts, exact B03 closure, and equal pre/post successor digest; any omitted layer, mismatch reason, or preservation entry yields `NOT VERIFIED` or `INCONCLUSIVE`
  - Target recheck: TGT-RSD-VERIFY-EVIDENCE
  - Receiver: dev-implementation backend
- [x] VR-RSD-05. Review the verified two-file correction
  - Criterion: AC-RSD-05
  - Proof class: review
  - Scenario / environment / fixture: backend validates the complete current rule manifest and unused initial-review slot; reviewer binds the same verified successor and checks Standards, Specification, one-callsite migration, supported-layer mapping, false-digest rejection, self-test fault isolation, two-file scope, and the declared causal boundary
  - Evidence form: one initial Review Handoff with `Standards: PASS`, `Specification: PASS`, `Overall: APPROVED`, unchanged target digest, zero same-outcome blockers, and unrelated observations advisory or separate intake
  - Target recheck: TGT-RSD-REVIEW-EVIDENCE
  - Receiver: dev-implementation backend
- [x] VR-RSD-06. Complete assessment-only learning
  - Criterion: AC-RSD-06
  - Proof class: other authorized class
  - Scenario / environment / fixture: neutral curator binds the unchanged reviewed target, inspects only the two affected artifacts and B03 evidence, and performs no write
  - Evidence form: Curator Handoff `NO DURABLE LEARNING`; `Updated`, `Added`, and `Removed` are `none`; zero changed paths; target digest unchanged; exactly one backend receiver
  - Target recheck: TGT-RSD-LEARN-EVIDENCE
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-RSD-FINAL | T1 | TGT-RSD-FINAL successor manifest plus two-file diff and smoke evidence | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff with AC-RSD-01 through AC-RSD-03, exact B03 blocker-closure map, current attempts/repair/review state, 149-case finite consumer proof, expected/observed self-test results, preservation hashes, target digest, and no shipping |
| OUTP-RSD-VERIFIED | T2 | Verifier Handoff on the immutable successor | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff extended with `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE`, every AC-RSD-04 proof entry, complete current rule-manifest validation, target pre/post identity, and unchanged convergence state |
| OUTP-RSD-REVIEWED | T3 | Initial Review Handoff on the same verified successor | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff extended with both review axes, overall verdict, initial-pass identity, exact eligible blockers/advisories, causal boundary, and unchanged target identity |
| OUTP-RSD-LEARNED | T4 | Assessment-only Curator Handoff on the same reviewed successor | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff with `NO DURABLE LEARNING` on success, zero changed guidance paths, complete required payload fields, unchanged target identity, and terminal receiver for backend accounting |

Do not materialize Common Handoffs as repository files. TGT-RSD-FINAL is the sole session-local evidence file authorized by this plan.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-RSD-BASE | receipt-skill-implementation-owner | Exact missing/drifted path, expected base hash, observed hash, and semantic impact | T1 through T4 | Do not reconstruct, reset, adopt, or overwrite AUTH-RSD-BASE or predecessor evidence; material drift requires new human-approved authority | All 167 base records and three frozen predecessor artifacts match their exact hashes before T1 |
| BLK-RSD-SCOPE | dev-implementation backend | Proposed extra file, schema, CLI, mapping, policy, or behavior and affected criterion | T1 through T4 | Any required change outside the two owned files or AC-RSD-01 through AC-RSD-03 is an authority change; no opportunistic cleanup | The two-file correction is sufficient, or a newly approved plan replaces this one |
| BLK-RSD-PROOF | receipt-skill-implementation-owner | Failed self-test name, mismatch list, layer consumer, preservation record, expected result, and observed result on the current successor | T1, T2 | Attempt 2 only under D03 evidence; generic suite success or a changed fixture is not closure | Every impacted deterministic check and preservation entry passes on one exact successor |
| BLK-RSD-ASSURANCE | dev-implementation backend | Missing/stale rule entry, unavailable independent identity/capability, target drift, or invalid Handoff | T2 through T4 | Intake defects block before dispatch without consuming semantic, repair, initial-review, or rerun counts; no compact downgrade | Complete current manifest, immutable target, and required fresh role capability are present |
| BLK-RSD-REVIEW | dev-implementation backend | Deduplicated eligible finding ID mapped to authority/AC, changed surface or required consumer, direct evidence, and causal boundary | T3, T4 | One initial review only. A same-outcome repair may consume the new outcome's one token and at most one impacted rerun; no second initial pass and no predecessor reset | Review returns `APPROVED`, or one eligible repair closes every mapped blocker and the sole rerun approves |
| BLK-RSD-LEARNING | dev-continual-learning | Exact current-contract conflict or proposed write target | T4 | Assessment-only. A candidate is skipped/deferred; an exact conflict returns `BLOCKED` instead of mutation | `NO DURABLE LEARNING` with zero writes, or separately approved authority resolves a blocking conflict |
| BLK-RSD-DELIVERY | dev-implementation backend | Any attempted staging, commit, push, review request, release, deploy, or predecessor archival effect | T1 through T4 | No delivery authority exists in this plan | No delivery or archival effect is attempted |

A failed task quarantines semantic descendants. No task may revive, amend, complete, archive, ship, or consume counters from `OUT-DEV-WORKFLOW-LEAN-ORDINARY-PATH`.

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-RSD-B03 | review finding | AUTH-RSD-REVIEW line 5, `REVIEW-LEAN-B03` | Sole defect authority: comparator accepts a substituted well-formed `skill_sha256` |
| ANC-RSD-VALIDATE | changed symbol | `.config/agents/skills/dev-ask/evals/compare_trace.py`, `validate_receipt` currently around lines 332-394 | Add the actual layer-skill digest to existing expected digest equality; preserve all other receipt checks |
| ANC-RSD-CALLSITE | changed caller | Same file, `compare_case` currently around lines 437-496 | Derive the selected case's skill once and migrate the only `validate_receipt` call |
| ANC-RSD-PRODUCER-MAP | preserved pattern | `.config/agents/skills/dev-ask/evals/observe_case.py`, `repository_root_for_registry` around lines 153-163 and `expected_skill_path` around lines 259-266 | Exact mapping to mirror without changing or importing the producer CLI |
| ANC-RSD-SELFTEST | changed proof | `.config/agents/skills/dev-ask/evals/compare_trace.py`, `selftest_base`, `apply_selftest_mutation`, `run_selftest`; `.config/agents/skills/dev-ask/evals/compare_trace_selftest.json` | Replace format-only baseline with actual bytes and prove all mappings plus false-digest rejection |
| ANC-RSD-BASE-MANIFEST | frozen target | AUTH-RSD-BASE | Defines every included target byte and the two-file successor boundary |
| ANC-RSD-PLAN | plan contract | AUTH-RSD-RULES plan, implementation-plan, OMP transport, and repository-storage revisions | Validate this Executor Plan; local authority remains canonical and its repository projection is not edited directly |

- Assumptions: none

## Completion Summary

- Delivered complete-byte receipt skill-digest enforcement in `.config/agents/skills/dev-ask/evals/compare_trace.py` and its deterministic 20-check self-test definition. Router, backend, and live cases bind the registry-selected regular skill bytes; a substituted digest and unsupported layer fail with their exact intended mismatches.
- Final target `/Users/kim/.omp/agent/sessions/-.dotfiles/2026-08-15T10-38-54-229Z_01a00500-cf15-7000-a72a-434ed79c1b2a/local/receipt-skill-digest-target-manifest.tsv` is SHA-256 `0b5159632abcd3c5b3d95d458dcaf91380a874444c9359d6918b10d406514c9e`, 167 records, and 23,628 bytes. Exactly the two owned hashes differ from AUTH-RSD-BASE; all other 165 records and the three frozen predecessor artifacts remain exact.
- Fresh verification returned `VERIFIED`; the sole initial review returned `Standards: PASS`, `Specification: PASS`, `Overall: APPROVED`; assessment-only continual learning returned `NO DURABLE LEARNING` with zero guidance changes. `REVIEW-LEAN-B03` is closed.
- Reused the producer's canonical registry-root and layer mapping locally plus the comparator's existing regular-file and digest loop. No shared module, schema, CLI, fixture, producer, registry, skill, ADR, rule, guidance, staging, shipping, or predecessor-lifecycle change was introduced.
- Current plan, OMP transport, and repository-storage rule byte revisions differed from their planning-time snapshots. Backend semantic rebind found their load-bearing authority, readiness, lifecycle, synchronization, effect, and archival facts unchanged; scope, acceptance, and effects remained exact.
- Residual risk: none established inside the declared 167-record causal boundary. Mutable files outside that boundary remain excluded from this outcome.