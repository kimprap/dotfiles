# Surface-Proof Reuse and Semantic Parity

**Datetime**: 2026-08-27-1415
**Mode**: implementation
**Scope**: Standard
**Summary**: Add per-generation proof-package consistency, exact typed recipe rebinding for later same-outcome assurance, and opt-in registry/fixture semantic parity while preserving independent verification and all existing workflow schemas.
**Status**: DONE
**Completed At**: 2026-08-27-2115

## Objective

- Outcome: OUT-SPR-PLAN-01
- Observable end state: before noncompact verifier dispatch, the backend rejects an internally inconsistent current proof generation; after a complete prior aggregate, an exact later same-outcome target delta may run rebound criteria fresh and reuse only independently accepted exact-identity unaffected evidence; the verifier still emits one fresh complete aggregate. The five authority-declared registry/fixture pairs use one opt-in canonical semantic comparison, while ordinary `compare_case()` and intentional non-parity fixtures remain unchanged.
- Progress signal: T1 proves the internal one-generation validator without changing the public recipe command; T2 proves the pure opt-in semantic comparator and preserves ordinary comparison; T3 closes the typed backend/verifier action map, canonical D04 projection, semantic cases, and caller scan. Reuse-specific changes remain only if every fixed stale-reuse gate passes; otherwise T3 removes the reuse-only delta and completes with the authorized all-fresh fallback while retaining T1/T2 and their integration.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-SPR-REVISION | Human-confirmed plan-correction handoff | `local://HANDOFF-SPR-PLAN-20260827-r2.md@sha256:e86b79e86e33189a5f0b1195db36233b39783776e15928d5fd8cbab1c082ed73`; every binding is restated in this plan | `HANDOFF-SPR-PLAN-20260827-r2` | Highest revision authority: use existing Target IDs, place inventory constants under TGT-SPR-EVALS, use the exact pinned keep baseline below, and require a corrected parser-valid plan plus renewed approval rather than execution. |
| AUTH-SPR-HANDOFF | Human-confirmed engineering design handoff and approval-ready revision | Current conversation beginning `Yes. Both corrections are required and sufficient.` plus the approval-ready revision beginning `Yes. Valid and approval-ready.` | `surface-proof-reuse-handoff-2026-08-27-r1` | Original semantic authority for this plan; AUTH-SPR-REVISION corrects only its execution-plan projection. |
| AUTH-SPR-DWO | Completed predecessor implementation and immutable evidence index | `.agents/plans/archive/2026-08-26-2157_dev-workflow-orchestration-test-value.md@sha256:db75d170c604eb778103e87b7c8f35d8f299765906b0a5152d55584736306d48` | `DONE`, completed `2026-08-27-0610`; target `sha256:472e3dcdd48c2499fe90d907cc18f6b3d8684422aa92f244b34396533913f44a` | Read-only predecessor authority; this plan must not amend it. |
| AUTH-SPR-D02 | Active semantic-drift authority | `docs/adr/0001-dev-workflow-authority-and-routing.md@sha256:375e8f396d73fe74cf8ebff85b70f059f310f290b0d049935e6a38cad45c68c0#d02--approval-model` | current before this plan | D02 remains unchanged and supplies approved-current-contract all-fresh versus unapproved-change `authority-change-required`. |
| AUTH-SPR-D04 | Active assurance authority to extend | `docs/adr/0003-bounded-assurance-and-repair.md@sha256:eeda69c19e87cfa4d58d5e6f29a10ef83c9733c2f9db487d153016fcb18c7e35#d04--assurance-boundaries` | current before this plan | Existing recipe identity, independent action acceptance, and complete aggregate are retained and narrowed by AUTH-SPR-HANDOFF; AUTH-SPR-REVISION changes only plan mechanics and case inventory ownership. |
| AUTH-SPR-WORKFLOW | Current concise workflow projection | `.config/agents/skills/dev-ask/WORKFLOW.md@sha256:4c7d24c9e2e29e335b1e2da5704308dca1bed5540048bf6083fde96c0e802c34` | current before this plan | Subordinate projection; only the assurance/reuse sentence changes. |
| AUTH-SPR-PLAN-RULES | Current Executor Plan v1 contract | `.config/agents/rules/plan.md@sha256:97387afc9bccf8a0d30fe001f3c3eb171a1d70726f047761e38c67773f6e769c`; `.config/agents/rules/plan-impl-spec.md@sha256:eb058c61270160bd356f32283a144c19149ee4d5b61a7d48626b121e9258e043` | Executor Plan v1 | Preservation authority only; no plan grammar, parser, transport, or schema change is permitted. |

Authority precedence is AUTH-SPR-REVISION, then AUTH-SPR-HANDOFF, then the completed predecessor evidence, then D02/D04, then current projections and implementation facts. A material conflict returns `authority-change-required`; exact implementation facts inside this fixed contract follow the decisions below.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-SPR-GENERATION | AUTH-SPR-HANDOFF r1 | Validate one frozen generation per call. Current and prior generations are never unioned; the prior generation is the previously validated snapshot from the last complete aggregate and is never live-reread. |
| DEC-SPR-VALIDATOR | AUTH-SPR-HANDOFF r1 plus current canonicalizer call graph | Add an import-only internal `validate_recipe_generation(...)` operation. Keep the documented `adapter`, `recipe`, `doctor`, and `--self-test` CLI exactly unchanged, so `surface-verification-adapter/SKILL.md`, `SVA-HELPER-CONTRACT`, and `dev-specification` remain preservation controls rather than change targets. |
| DEC-SPR-RESOLUTION | AUTH-SPR-HANDOFF r1 | The validator checks AC coverage, frozen-wrapper recanonicalization, and one digest per URI inside one generation. Backend/verifier retain native `file://`, `local://`, and `agent://` current-byte resolution; existing live adapter-tree validation remains in the public recipe path. |
| DEC-SPR-CONSTRUCTION | AUTH-SPR-HANDOFF r1 | `REUSE-PROMOTED` recipes list only bytes their criterion scenarios read. Lifecycle state, Context Pack copies, Handoffs, prior aggregates/evidence, papercuts, attempt authority, and wrapper manifests remain outside `surface-proof-recipe/v1`; the schema and identity algorithm do not change. `ALL-FRESH-FALLBACK` removes this new construction claim and preserves current construction. |
| DEC-SPR-ACTION | AUTH-SPR-HANDOFF r1 | `REUSE-PROMOTED` freezes exactly `criterion → old recipe ID → new recipe ID → target-delta edge or none → fresh-or-reuse` for every frozen AC. Only digest substitutions on already-listed declared target-delta URIs are allowed rebinds; each rebound criterion runs the new recipe fresh. Exact unchanged identity with no edge is reuse-eligible subject to verifier acceptance. `ALL-FRESH-FALLBACK` preserves current repair-only impacted-fresh versus exact-unaffected reuse, keeps every later same-outcome cycle all-fresh, and adds no typed cross-generation row. |
| DEC-SPR-DISPOSITIONS | AUTH-SPR-HANDOFF r1 plus ADR-0001 D02 | Missing prior aggregate or ambiguous edge with an otherwise valid unchanged current contract selects all-fresh. Approved semantic contract change selects all-fresh under that contract. Unapproved non-digest semantic change returns `authority-change-required`. Invalid current binding stops backend dispatch; verifier-detected invalidity returns `INCONCLUSIVE` before proof. |
| DEC-SPR-PARITY | AUTH-SPR-HANDOFF r1 | Add import-only `compare_semantic_case(registry, case_id, fixture)` over exact `inputs` plus ordered `scripted_replies` and `additional_files`, defaulting the optional lists to `[]`. Only the exact five-case finite map invokes it; ordinary `compare_case()` and `observe_case.py` do not. |
| DEC-SPR-AGGREGATE | AUTH-SPR-HANDOFF r1 | Independent verification stays mandatory. Every frozen action receives an independent accept/reject decision; impacted or rejected-reuse entries run fresh, and one new aggregate covers the complete current criterion set. |
| DEC-SPR-FALLBACK | AUTH-SPR-HANDOFF r1 | Promote typed reuse only if every stale-evidence, delta-edge, semantic-drift, and aggregate gate passes after permitted in-task correction and without a new store/schema. Any remaining failure selects the atomic all-fresh branch: remove the reuse-only construction/action-map/projection delta, preserve current repair behavior, keep later cycles all-fresh, and still ship generation consistency plus opt-in parity. No partial reuse is allowed. |
| DEC-SPR-INVENTORY | AUTH-SPR-REVISION r2 | T2 owns comparator/helper/self-test symbols and preserves `ADDED_IDS` plus `REWRITE_IDS`; T3 alone mutates those constants under existing TGT-SPR-EVALS. Promoted/fallback deltas and the authoritative pinned keep-check baseline are exact below; historical reuse IDs remain in `ADDED_IDS`; no new Target ID is created. |
| DEC-SPR-PRESERVE | AUTH-SPR-HANDOFF r1 | Preserve worker closure, root semantic prohibition, Executor Plan v1, full/no-downgrade orchestration, audit, learning, papercut, completion, one-shot comparison, and the no-general-efficiency-claim decision. |

## Scope, non-goals, and prohibited effects

- Read surfaces: the targets and preservation controls below; AUTH-SPR-DWO completion/evidence index; pinned commit `c6af1aaf58eed506678808da7a2c5b87412486c7`, registry blob `678d4fb1e8c2a4855d57575de867c4e60de051de`, and registry-byte SHA-256 `a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8`; ADR-0001 D02 and ADR-0003 D04; current recipe, assurance, comparator-helper, case-inventory, scanner, and paired fixture contracts.
- Change surfaces: only T1’s canonicalizer/tests; T2’s symbol-scoped comparator/helper/self-test corpus; and T3’s named backend/verifier/projection/eval/scanner files, the `compare_trace.py` `ADDED_IDS`/`REWRITE_IDS` constants, and three new fixture paths. Lifecycle edits to this plan and ordinary evidence/Handoff artifacts remain backend-owned bookkeeping.
- Non-goals: a new recipe field or schema; public recipe-set CLI; URI resolver; identity family; cache/store/ledger; lifecycle stage; owner; Context Pack or Handoff envelope; plan/parser/rule change; global registry/fixture equality; proof-class ordering policy; closure tier; telemetry; efficiency claim; amendment of AUTH-SPR-DWO.
- Prohibited effects: unioning generations; live-rereading prior bindings; old-digest evidence reuse for an impacted rebind; verifier repair; root semantic proof; compatibility reader; public CLI/result schema invention; edits to the five parity fixtures merely to pass equality; broad fixture synchronization; test deletion; staging, commit, push, release, deploy, rollout, or shipping.
- Drift rule: each worker records current SHA-256 for every owned existing target before writing. Expected dependency changes must match accepted dependency Handoffs. Any other semantic drift is preserved and returned as `authority-change-required`.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-SPR-GENERATION | Repository mutation | AUTH-SPR-HANDOFF | T1 only; two existing Python files; public helper commands and recipe-v1 output remain exact. |
| EFF-SPR-PARITY | Repository mutation | AUTH-SPR-HANDOFF, AUTH-SPR-REVISION | T2 only; `canonical_semantic_case`, `compare_semantic_case`, `fixture_sources`, `run_selftest`, and the existing self-test JSON; `ADDED_IDS`, `REWRITE_IDS`, ordinary comparator/producer CLI, and result schemas remain exact. |
| EFF-SPR-CUTOVER | Repository mutation | AUTH-SPR-HANDOFF, AUTH-SPR-REVISION, AUTH-SPR-D02, AUTH-SPR-D04 | T3 only; exact policy/eval/scanner inventory, symbol-scoped `ADDED_IDS`/`REWRITE_IDS`, and three named new fixture files. |
| EFF-SPR-RUNTIME | Plan bookkeeping, Common Handoffs, disposable semantic-eval evidence, and standard assurance artifacts | AUTH-SPR-PLAN-RULES | T1–T3/backend; no shipping or unrelated repository mutation. |

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-SPR-RECIPE-V1 | Existing canonical recipe object, identity bytes, and public command | T1 | `surface-proof-recipe/v1`; exact T1 baseline `VR-DEMO-01@sha256:78016dfe8ee2c9f1b4c19dc45b522afacff676b5a657b3d595939af85ee75bce` | T1, T3 |
| CONTRACT-SPR-GENERATION | Internal one-generation package validator | T1 | `validate_recipe_generation(acceptance_ids: list[str], recipes: list[dict[str, Any]], manifest_bindings: list[dict[str, str]]) -> None` | T1, T3 |
| CONTRACT-SPR-PARITY | Pure opt-in semantic projection and comparison | T2 | `canonical_semantic_case(value: Any) -> dict[str, Any]`; `compare_semantic_case(registry: dict[str, dict[str, Any]], case_id: str, fixture: Any) -> dict[str, Any]` returning existing `lean-eval-trace/v1` | T2, T3 |
| CONTRACT-SPR-PARITY-MAP | Exact registry/fixture equality consumer map | T3 | five fixed IDs and paths named in Target map; `R-COMPLETE-NEAR-MISS` excluded | T3 |
| CONTRACT-SPR-INVENTORY-BASE | T2 preservation receipt for existing `compare_trace.py` inventories | T2 | before/after extracted `ADDED_IDS` and `REWRITE_IDS` are exact; OUTP-SPR-T2 binds the post-T2 whole-file identity | T2, T3 |
| CONTRACT-SPR-INVENTORY | Final branch inventories and pinned keep check | T3 | T3 applies exactly one branch row below against CONTRACT-SPR-INVENTORY-BASE and the pinned predecessor registry | T3 |
| CONTRACT-SPR-ACTION | Existing backend-frozen criterion action map, conditionally typed in place | T3 | `REUSE-PROMOTED` uses the exact old/new/delta/fresh-or-reuse row; `ALL-FRESH-FALLBACK` preserves current repair actions, keeps later cycles all-fresh, and adds no typed cross-generation row | T3 |
| CONTRACT-SPR-DISPOSITIONS | Existing D02/intake outcomes | T3 | exact five-row disposition table from AUTH-SPR-HANDOFF | T3 |
| CONTRACT-SPR-ASSURANCE | Existing independent verification and aggregate boundary | T3 | fresh impacted/rejected-reuse proof plus independently accepted exact unaffected evidence; one complete current aggregate | T3 |
| CONTRACT-SPR-FALLBACK | Atomic promotion/fallback | T3 | `REUSE-PROMOTED` only on complete gate pass; otherwise `ALL-FRESH-FALLBACK` with zero typed-reuse behavior/prose | T3 |

Case-inventory mutation is fixed relative to the planning-base sets. Preserve every unlisted member:

| Final branch | `ADDED_IDS` delta | `REWRITE_IDS` delta | Required keep-check result |
|---|---|---|---|
| `REUSE-PROMOTED` | Add `B-ASSURANCE-RECIPE-CONSTRUCTION`, `B-ASSURANCE-GENERATION-CONFLICT`, and `B-ASSURANCE-REUSE-DISPOSITIONS`; retain historical baseline members `B-ASSURANCE-REUSE-DRIFT` and `B-ASSURANCE-REUSE-UNAFFECTED`. | Add `B-ASSURANCE-REUSE-DRIFT` and `B-ASSURANCE-REUSE-UNAFFECTED`. | `status=pass`; exact promoted inventories; no keep-case or keep-fixture mismatch. |
| `ALL-FRESH-FALLBACK` | Add `B-ASSURANCE-GENERATION-CONFLICT` and `B-ASSURANCE-REUSE-DISPOSITIONS`; retain historical baseline members `B-ASSURANCE-REUSE-DRIFT` and `B-ASSURANCE-REUSE-UNAFFECTED`; `B-ASSURANCE-RECIPE-CONSTRUCTION` is absent. | Add only `B-ASSURANCE-REUSE-DRIFT`; `B-ASSURANCE-REUSE-UNAFFECTED` remains absent from this set because its registry row and fixture stay byte-exact. | `status=pass`; exact fallback inventories; no keep-case or keep-fixture mismatch. |

The keep check is pinned to commit `c6af1aaf58eed506678808da7a2c5b87412486c7`, registry blob `678d4fb1e8c2a4855d57575de867c4e60de051de`, and registry-byte SHA-256 `a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8`. `HEAD` and any substitute baseline are forbidden without separate human revision authority. Its pass result must expose those exact identities, the branch-exact sorted inventories above, and no keep-case or keep-fixture mismatch.

`validate_recipe_generation` accepts only the existing canonical-recipe output wrappers `{schema, identity, digest, recipe}` plus a caller-flattened list of the generation’s existing target/rule/fixture/dependency/helper `{uri,digest}` bindings. It performs no I/O. Refactor recipe normalization behind a private `verify_adapter` switch: public `canonical_recipe()` continues to verify the live adapter exactly as today; the generation validator structurally recanonicalizes frozen nested recipe bytes without resolving a URI, compares the complete wrapper to the recomputed identity, enforces unique AC coverage, and allows repeated same-URI/same-digest entries while rejecting any same-URI/different-digest entry. Current binding resolution and the prior-snapshot identity check remain backend/verifier responsibilities.

The internal validator returns `None` on success and raises the existing `ContractError` with one exact code: `recipe_generation_acceptance_invalid` for a malformed or duplicate AC list; `recipe_generation_recipe_invalid` for a malformed wrapper or recanonicalization/identity mismatch; `recipe_generation_coverage_invalid` for a missing, extra, or duplicate recipe AC; `recipe_generation_binding_invalid` for a malformed flattened binding; or `recipe_generation_binding_conflict` for one URI with different digests. Its URI accumulator includes every non-`none` adapter, fixture, and dependency in the nested recipes plus every supplied flattened manifest binding.

The unchanged recipe schema carries scenario-read adapter bytes in `adapter`, fixture data in `fixtures`, and target-file/rule/helper/other byte dependencies in `dependencies`. Flattened set-level manifests cross-check those bindings but do not enter recipe identity by themselves. A target-delta digest therefore changes a recipe ID only when that recipe already names the URI in one of these identity-bearing fields.

In `REUSE-PROMOTED`, the action row’s edge cell is `none` or the exact ordered sequence of existing target-delta entries `(uri, old digest, new digest)` consumed by that criterion. Every changed binding must name an approved edge, every edge URI must already be listed by the old and new recipe, and the old/new canonical recipes must otherwise be byte-equal. This is a typed use of the existing action map, not a new JSON schema.

Backend/verifier order is fixed:

1. The backend natively resolves every current binding, retains the existing live adapter-tree check, then calls `validate_recipe_generation` on the current AC set, canonical wrappers, and flattened current manifest. Any current failure is invalid intake with zero verifier dispatch.
2. Reuse is considered only when the last complete aggregate names an exact prior AC set, recipe wrappers, manifest bindings, and evidence. The backend byte-compares those frozen identities to that aggregate and calls the validator on the frozen bytes without I/O. A missing or inexact prior snapshot makes reuse unavailable and selects current all-fresh proof; it never causes a live prior reread.
3. Only after both generations pass does the backend freeze the typed map from the approved target delta. Non-digest semantic change exits through D02 before proof.
4. The verifier independently repeats current resolution, current/prior generation checks, and action-map consistency. An invalid current package or invalid dispatched reuse package/map returns `INCONCLUSIVE` before proof; the verifier neither repairs nor silently downgrades invalid intake.
5. For valid intake, the verifier independently accepts or rejects every action. Rebound and rejected-reuse criteria run their current recipes fresh; accepted reuse retains exact current-target unaffected evidence; one fresh aggregate covers the complete current AC set.

`canonical_semantic_case` allocates fresh containers, requires `inputs` to be an object with `request: str`, deep-copies the complete `inputs` object, preserves ordered replies and additional-file declarations, validates additional paths with `safe_additional_path`, rejects duplicates, and defaults missing optional lists to `[]`. `compare_semantic_case` consumes the already validated case map returned by `case_map`/scanner `load_registry`, compares the three fields deterministically, records side-specific mismatches through existing `result(...)`, mutates neither caller, and reads no path.

Semantic normalization failures use deterministic side-prefixed mismatches; an unknown ID retains `unknown case id: CASE_ID`. Valid projections append field mismatches in the fixed order `inputs`, `scripted_replies`, `additional_files`. T3 names the sole finite map `DWO_SEMANTIC_CASE_FIXTURES`, names the resume-only subset `DWO_RESUME_CASE_IDS`, derives `DWO_RESUME_ACTIVE_PATHS` from those two values, and creates no second path map. `dwo_registry_contract_hits` loads each mapped fixture once, reuses the first three objects for resume-fragment checks, and converts each helper mismatch into its existing contract-hit form.

The exact finite map is:

| Registry case ID | Repository-relative fixture |
|---|---|
| `B-FULL` | `.config/agents/skills/dev-ask/evals/fixtures/b-full/case.json` |
| `B-T5-COMPLETION-ASSURED` | `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-assured/case.json` |
| `B-T5-COMPLETION-MISSING-ASSURANCE` | `.config/agents/skills/dev-ask/evals/fixtures/b-t5-completion-missing-assurance/case.json` |
| `R-COMPLETE` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete/case.json` |
| `R-COMPLETE-COMPACT-NO-LEARNING` | `.config/agents/skills/dev-ask/evals/fixtures/r-complete-compact-no-learning/case.json` |

`DWO_RESUME_CASE_IDS` is the ordered tuple `("B-FULL", "B-T5-COMPLETION-ASSURED", "B-T5-COMPLETION-MISSING-ASSURANCE")`. `R-COMPLETE-NEAR-MISS` is not in either collection.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-SPR-GENERATION | `.config/agents/skills/surface-verification-adapter/scripts/adapter_contract.py`; `.config/agents/skills/surface-verification-adapter/scripts/test_adapter_contract.py` | T1 | Record exact execution-start SHA-256; preserve the exact recipe baseline in CONTRACT-SPR-RECIPE-V1. | public `recipe` CLI; internal T3 backend/verifier package checks; existing adapter unit suite | AC-SPR-14 |
| TGT-SPR-PARITY | `.config/agents/skills/dev-ask/evals/compare_trace.py` symbols `canonical_semantic_case`, `compare_semantic_case`, `fixture_sources`, `run_selftest`, and ordinary parser/main preservation; `.config/agents/skills/dev-ask/evals/compare_trace_selftest.json` | T2 | Record exact execution-start SHA-256; `ADDED_IDS` and `REWRITE_IDS` are excluded from T2 ownership and must remain byte-exact. | T2 self-test; T3 scanner import; ordinary `compare_case`/CLI preservation | AC-SPR-16 |
| TGT-SPR-BACKEND | `.config/agents/skills/dev-implementation/SKILL.md`; `.config/agents/skills/dev-implementation/references/plan-orchestration.md`; `.config/agents/skills/dev-verification/SKILL.md` | T3 | Record exact execution-start SHA-256. | Task Contract construction; plan backend; independent verifier; Common Handoff projection | AC-SPR-01, AC-SPR-02, AC-SPR-03, AC-SPR-04, AC-SPR-05, AC-SPR-06, AC-SPR-07, AC-SPR-08, AC-SPR-09, AC-SPR-10, AC-SPR-13, AC-SPR-15 |
| TGT-SPR-AUTHORITY | `docs/adr/0003-bounded-assurance-and-repair.md` D04 only; `.config/agents/skills/dev-ask/WORKFLOW.md` assurance projection only | T3 | AUTH-SPR-D04 and AUTH-SPR-WORKFLOW. | workflow maintainers; backend/verifier projections | AC-SPR-03, AC-SPR-04, AC-SPR-05, AC-SPR-06, AC-SPR-07, AC-SPR-08, AC-SPR-09, AC-SPR-10, AC-SPR-13, AC-SPR-15 |
| TGT-SPR-EVALS | `.config/agents/skills/dev-ask/evals/evals.json`; `.config/agents/skills/dev-ask/evals/scan_stale_contracts.py`; `.config/agents/skills/dev-ask/evals/compare_trace.py` constants `ADDED_IDS` and `REWRITE_IDS` only; existing `fixtures/b-assurance-reuse-unaffected/case.json`; existing `fixtures/b-assurance-reuse-drift/case.json`; conditionally add `fixtures/b-assurance-recipe-construction/case.json`; add `fixtures/b-assurance-generation-conflict/case.json`; add branch-exact `fixtures/b-assurance-reuse-dispositions/case.json` | T3 | Record execution-start SHA-256 for existing files; for the two shared-file constants, use OUTP-SPR-T2’s whole-file after identity with both values still at planning base; three new paths absent. | `keep_check`; scanner IDs/required needles; branch-exact registry/fixture provenance; worker/verifier semantic cases; five parity registry rows; VR-SPR-15 | AC-SPR-01, AC-SPR-02, AC-SPR-03, AC-SPR-04, AC-SPR-05, AC-SPR-06, AC-SPR-07, AC-SPR-08, AC-SPR-09, AC-SPR-10, AC-SPR-11, AC-SPR-12, AC-SPR-13, AC-SPR-15 |
| TGT-SPR-PARITY-INPUTS | Read-only `.config/agents/skills/dev-ask/evals/fixtures/{b-full,b-t5-completion-assured,b-t5-completion-missing-assurance,r-complete,r-complete-compact-no-learning,r-complete-near-miss}/case.json` | T3 | Record execution-start SHA-256 and preserve every byte. | exact five-pair scanner map; excluded negative control | AC-SPR-11, AC-SPR-12 |
| TGT-SPR-PRESERVATION | Read-only AUTH-SPR-DWO; ADR-0001 D02; ADR-0003 D03/D22/D28; `docs/adr/INDEX.md`; Executor Plan v1 rules/parser/transports; `surface-verification-adapter/SKILL.md` and `SVA-HELPER-CONTRACT`; `dev-specification/SKILL.md`; `observe_case.py`; compact checklist; worker closure; Handoff/review/audit/learning/papercut/completion surfaces | T3 | Record focused pre/post identities; no owned mutation. | all existing workflow consumers | AC-SPR-15 |

Planning-base identities, observed 2026-08-27 before this plan:

- TGT-SPR-GENERATION: `adapter_contract.py@sha256:f931b16caccb899f102d32688f65a898609e62c0da76400067a48107acd84c5f`; `test_adapter_contract.py@sha256:9e06dee8197143a5150f6529c458f797fb59767cd57c463f492821605b3d8a9e`.
- TGT-SPR-PARITY: `compare_trace.py@sha256:3ebe2b63fb83691db2c750e5ec29bf730837b73fd9e3b5a52ce1b326d8cf89e1`; `compare_trace_selftest.json@sha256:5f59987650de2f5a2ff153182bc457391f4c8afa1d8d6268e3b2e508cbad7a30`.
- TGT-SPR-BACKEND: `dev-implementation/SKILL.md@sha256:bde3a0d87289abe7212a7290247b92166df235c2c71e41f1fbaa9c2b254fe5c8`; `plan-orchestration.md@sha256:b3c0065bb9949a8d99128d3827a9d7f7201f5cf5a24983e459cbbb49164f6e58`; `dev-verification/SKILL.md@sha256:7f657c5b7a124c729e4111fd1d006f5d28b48bd371477b3ffb75150187d99e6f`.
- TGT-SPR-AUTHORITY: `0003-bounded-assurance-and-repair.md@sha256:eeda69c19e87cfa4d58d5e6f29a10ef83c9733c2f9db487d153016fcb18c7e35`; `dev-ask/WORKFLOW.md@sha256:4c7d24c9e2e29e335b1e2da5704308dca1bed5540048bf6083fde96c0e802c34`.
- TGT-SPR-EVALS: `evals.json@sha256:262e99cd250bba6889a1fdd8aa219734e5a17ff6a060dd5527834b3de162b980`; `scan_stale_contracts.py@sha256:454650e405f97cae581ad31ed96e85fd7cc16901b52d3e825ddbdbb5786eeb69`; shared `compare_trace.py@sha256:3ebe2b63fb83691db2c750e5ec29bf730837b73fd9e3b5a52ce1b326d8cf89e1`, with historical `B-ASSURANCE-REUSE-DRIFT` and `B-ASSURANCE-REUSE-UNAFFECTED` present in `ADDED_IDS` and absent from `REWRITE_IDS`; `b-assurance-reuse-unaffected/case.json@sha256:cd6afce11bb731217416f8e450f651a030cc544e48ce0754a272d8feba3ae3ca`; `b-assurance-reuse-drift/case.json@sha256:c068e39c78f59f924bebb016f64816fcc9cf9ef18933ae57a23d353a2aa1f814`; all three added paths absent. The keep-check baseline is commit `c6af1aaf58eed506678808da7a2c5b87412486c7`, blob `678d4fb1e8c2a4855d57575de867c4e60de051de`, byte SHA-256 `a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8`.
- TGT-SPR-PARITY-INPUTS: `b-full@sha256:b20e28d0927a0f872f1cb99f7ba4b6fc3a9d77f61f3c7bed548c27d231485a62`; `b-t5-completion-assured@sha256:3e0261c1dd2bdc0f72c0785183cbd23de8a79fe99b90af08885b9b2f6056f88e`; `b-t5-completion-missing-assurance@sha256:21f873df9999ee895acedb1f781bfb392867b7c4fa10cfa3b8afd5de3fe47c36`; `r-complete@sha256:333bf867cc8cb721ccd672f45d89fcd5c03bb9ec7a39846895c4e619f917f5a1`; `r-complete-compact-no-learning@sha256:28989438474ebfe8b0f6451788b68f6f8bdf01eee2628f3ce802e89a38ed68e5`; `r-complete-near-miss@sha256:c4036c5071c8acc49f67808ec9b64866bc6b83219604e4480ff0e250491c8cbc`.

Execution-start hashes must match these planning-base identities or close under BLK-SPR-BASE-DRIFT before any write. For shared `compare_trace.py`, T2 binds the planning base and OUTP-SPR-T2 records the post-T2 whole-file SHA-256 plus unchanged inventories; T3 accepts only that after identity and then edits the two owned constants. AUTH-SPR-DWO and the Authority-table hashes remain the preservation base for TGT-SPR-PRESERVATION.

T1 and T2 own dependency-independent mechanics. T2 and T3 share `compare_trace.py` only through the symbol-exact boundary above: T2 owns helper/self-test regions and emits the accepted file identity; T3 later owns only `ADDED_IDS`/`REWRITE_IDS`. T3 consumes both accepted Handoffs and is the sole owner of the semantic cutover, paired action fixtures, canonical D04 projection, branch inventory, and final closed caller scan. The five parity fixtures and `R-COMPLETE-NEAR-MISS` are proof inputs, not mutation targets.

### Semantic case matrix

| Case ID | Repository action | REUSE-PROMOTED | ALL-FRESH-FALLBACK |
|---|---|---|---|
| `B-ASSURANCE-RECIPE-CONSTRUCTION` | Add registry row, `fixtures/b-assurance-recipe-construction/case.json`, and `ADDED_IDS` membership only in the promoted branch. | Lifecycle, Handoff, evidence, and papercut changes produce zero recipe-ID changes; one target URI digest change affects exactly the recipes that already list it. | Registry row, fixture path, and both inventory memberships are absent; scanner rejects the new construction claim. |
| `B-ASSURANCE-GENERATION-CONFLICT` | Always add registry row, `fixtures/b-assurance-generation-conflict/case.json`, and `ADDED_IDS` membership. | One current-generation URI with two digests is invalid intake; verifier dispatch and proof counts are zero. | Same mandatory result. |
| `B-ASSURANCE-REUSE-UNAFFECTED` | Retain its historical `ADDED_IDS` membership in both branches; rewrite the existing registry/fixture pair and add `REWRITE_IDS` membership only if reuse is promoted. | AC-A changes only by an exact declared digest edge and runs its new recipe fresh once; AC-B keeps exact identity/no edge and independently accepted exact evidence with zero invocation; aggregate is complete. | Preserve exact planning-base registry row and fixture bytes; omit `REWRITE_IDS`; current repair-only exact unaffected reuse remains unchanged. |
| `B-ASSURANCE-REUSE-DRIFT` | Retain its historical `ADDED_IDS` membership; extend the existing registry/fixture pair and add `REWRITE_IDS` membership in both branches. | Preserve its current dependency-drift fresh-proof control; add a separately valid backend freeze followed by verifier-detected invalid current binding, yielding `INCONCLUSIVE` before proof. | Same mandatory result; it does not enable cross-generation reuse. |
| `B-ASSURANCE-REUSE-DISPOSITIONS` | Always add registry row, branch-exact `fixtures/b-assurance-reuse-dispositions/case.json`, and `ADDED_IDS` membership. | Missing prior aggregate, ambiguous edge, and approved semantic change each run the complete current set all-fresh; unapproved semantic change returns `authority-change-required`; valid exact-delta and exact-no-edge rows exercise the positive path. | The same valid later-cycle inputs all run fresh with no typed cross-generation row; D02 outcomes and current repair-only controls remain exact. |

## Execution policy

- Assurance: standard
- Topology: full-orchestration
- Max concurrency: 1
- Isolation: shared-tree
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 and T2 are dependency-independent but execute in plan order at concurrency one; T3 starts only after both accepted Handoffs. T2 must leave `ADDED_IDS`/`REWRITE_IDS` exact and hand off the whole-file identity; T3 must bind that identity and may edit only those two constants in the shared file. Declared or unknown overlap serializes; any other T2/T3 cross-symbol write or undeclared write stops the child.
- Decomposition: Three bounded vertical work tasks; no numbered assurance tail. T3 hands the final shared target to the existing standard backend.
- Effect limit: EFF-SPR-GENERATION, EFF-SPR-PARITY, EFF-SPR-CUTOVER, EFF-SPR-RUNTIME
- Orchestrator profile: orchestrator-role-profile/v1; plan-backed full-orchestration required; downgrade: none

## Tasks

- [x] T1. Add internal frozen-generation recipe consistency
  - completed 2026-08-27-1616
  - Owner: dev-implementation worker
  - Intent: Reject inconsistent proof packages without changing recipe identity or public helper transport.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-SPR-GENERATION
  - Contracts: CONTRACT-SPR-RECIPE-V1, CONTRACT-SPR-GENERATION
  - Criteria: AC-SPR-14
  - Effects: EFF-SPR-GENERATION, EFF-SPR-RUNTIME
  - Output: OUTP-SPR-T1
  - Receiver: dev-implementation backend
  - Verification: VR-SPR-14
  - Lineage: shared
  - Execution detail: Preserve `RECIPE_SCHEMA`, `RECIPE_KEYS`, public parser/main modes, success/error objects, and exact current recipe output. Extract pure nested-recipe normalization only as needed so `validate_recipe_generation` can recanonicalize a frozen wrapper without live URI resolution. Add direct unit cases for exact AC coverage, duplicate/missing AC, wrapper identity mismatch, same-generation same-URI/same-digest repetition, conflicting digests across recipe arrays/manifests, and separate prior/current calls with an exact URI digest change. Do not add tautological tests for values that are not inputs, and do not implement an action map or resolver here.

- [x] T2. Add opt-in semantic case comparison
  - completed 2026-08-27-1624
  - Owner: dev-implementation worker
  - Intent: Give declared parity consumers one pure equality operation without changing ordinary trace evaluation.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-SPR-PARITY
  - Contracts: CONTRACT-SPR-PARITY, CONTRACT-SPR-INVENTORY-BASE
  - Criteria: AC-SPR-16
  - Effects: EFF-SPR-PARITY, EFF-SPR-RUNTIME
  - Output: OUTP-SPR-T2
  - Receiver: dev-implementation backend
  - Verification: VR-SPR-16
  - Lineage: shared
  - Execution detail: Add the two import-only functions beside `fixture_sources`; refactor `fixture_sources` to reuse canonical normalization before path hashing. Extend the unchanged self-test schema with exact equality, empty-list defaults, each field mismatch, malformed/unknown input, registry-only mutation, fixture-only mutation, deep-copy before/after equality, and an ordinary non-parity `compare_case` pass. Keep `compare_case`, `parser`, `main`, current 20 checks, `ADDED_IDS`, `REWRITE_IDS`, `observe_case.py`, public CLI arguments, and existing result schemas unchanged. Record the post-T2 whole-file SHA-256 and before/after extracted values for both inventory constants in OUTP-SPR-T2.

- [x] T3. Cut over typed assurance reuse and callers
  - completed 2026-08-27-1712
  - Owner: dev-implementation worker
  - Intent: Apply one coherent assurance contract that either promotes exact safe reuse or retains all-fresh proof.
  - Methods: none
  - Wave: W1
  - Depends on: T1, T2
  - Targets: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS, TGT-SPR-PARITY-INPUTS, TGT-SPR-PRESERVATION
  - Contracts: CONTRACT-SPR-RECIPE-V1, CONTRACT-SPR-GENERATION, CONTRACT-SPR-PARITY, CONTRACT-SPR-PARITY-MAP, CONTRACT-SPR-INVENTORY-BASE, CONTRACT-SPR-INVENTORY, CONTRACT-SPR-ACTION, CONTRACT-SPR-DISPOSITIONS, CONTRACT-SPR-ASSURANCE, CONTRACT-SPR-FALLBACK
  - Criteria: AC-SPR-01, AC-SPR-02, AC-SPR-03, AC-SPR-04, AC-SPR-05, AC-SPR-06, AC-SPR-07, AC-SPR-08, AC-SPR-09, AC-SPR-10, AC-SPR-11, AC-SPR-12, AC-SPR-13, AC-SPR-15
  - Effects: EFF-SPR-CUTOVER, EFF-SPR-RUNTIME
  - Output: OUTP-SPR-T3
  - Receiver: dev-verification
  - Verification: VR-SPR-01, VR-SPR-02, VR-SPR-03, VR-SPR-04, VR-SPR-05, VR-SPR-06, VR-SPR-07, VR-SPR-08, VR-SPR-09, VR-SPR-10, VR-SPR-11, VR-SPR-12, VR-SPR-13, VR-SPR-15
  - Lineage: shared
  - Execution detail: First require OUTP-SPR-T2’s exact `compare_trace.py` after identity and unchanged `ADDED_IDS`/`REWRITE_IDS`, then integrate T1’s current-generation predispatch check and verifier recheck while keeping native current-byte resolution and prior frozen-snapshot validation outside the canonicalizer. Stage the typed old/new recipe action row and five deterministic dispositions in backend, plan-orchestration, verifier intake/procedure/Handoff, D04, and the one WORKFLOW projection. Stage the recipe-construction case, always add the generation-conflict and disposition-matrix pairs, extend the drift pair, and stage the unaffected pair for positive rebound-fresh plus exact reuse. In the scanner, add `plan-orchestration.md` to the closed paths, install the exact five-case parity map and three-ID resume subset, invoke T2’s comparator only for that map, assert `R-COMPLETE-NEAR-MISS` exclusion, and update branch-exact action/aggregate needles and case IDs. T3 alone edits `ADDED_IDS`/`REWRITE_IDS`: apply the exact `REUSE-PROMOTED` row in CONTRACT-SPR-INVENTORY while staging reuse. Run the fixed reuse promotion gate. On complete pass, retain that inventory and seal `REUSE-PROMOTED`. If any gate still fails after permitted in-task correction or requires a prohibited store/schema, remove the construction case and its `ADDED_IDS` member, restore the unaffected registry/fixture pair to planning-base bytes and keep its historical `ADDED_IDS` membership while removing it from `REWRITE_IDS`, restore every other reuse-only construction/action/projection delta, retain the generation-conflict/disposition `ADDED_IDS` members and drift `ADDED_IDS`/`REWRITE_IDS` memberships, preserve current repair behavior and later-cycle all-fresh verification, then run the pinned keep check and seal `ALL-FRESH-FALLBACK`; never leave partial mixed behavior. The promoted branch also runs the same pinned keep check before Handoff.

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-SPR-01 | A current generation contains the same URI with two digests across recipes/manifests. | `validate_recipe_generation` rejects it; backend classifies invalid intake and dispatches no verifier or proof. | TGT-SPR-BACKEND, TGT-SPR-EVALS | T3 |
| AC-SPR-02 | Prior and current generations separately bind the same target URI to old/new digests. | Each call passes its own uniqueness check; only an exact declared target-delta row relates them. In fallback, both packages remain valid but the current set runs all-fresh. | TGT-SPR-BACKEND, TGT-SPR-EVALS | T3 |
| AC-SPR-03 | Lifecycle state, Handoff, evidence, or papercut identity changes while criterion scenario reads do not. | `REUSE-PROMOTED`: zero recipe IDs change. `ALL-FRESH-FALLBACK`: no construction/reuse claim remains and existing all-fresh behavior is exact. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-04 | One exact target-file URI changes and only a subset of recipes lists it. | `REUSE-PROMOTED`: only those recipes receive new IDs; whole-file bindings remain conservative. `ALL-FRESH-FALLBACK`: every criterion remains fresh and no narrower impact claim remains. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-05 | An old/new recipe pair is compared through a declared target delta. | `REUSE-PROMOTED`: only old-digest → declared-delta-digest substitutions on already-listed URIs are accepted; any other field/URI-set change exits reuse through AC-SPR-08. `ALL-FRESH-FALLBACK`: no rebind action is active. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-06 | A recipe identity is exact and the action map has no causal edge. | `REUSE-PROMOTED`: identity and evidence remain exact and reuse is only eligible pending independent verifier acceptance. `ALL-FRESH-FALLBACK`: the recipe runs fresh. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-07 | The prior complete aggregate is missing or the causal edge is ambiguous while current intake is valid and unchanged. | Backend selects all-fresh, runs the complete current recipe set, and emits no reuse action or authority stop. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-08 | A non-digest recipe field or URI set changes. | Approved current authority exits reuse and runs all-fresh under that contract; unapproved change returns `authority-change-required`; fresh proof never cures missing authority. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-09 | A current binding is missing, stale, conflicting, or unresolvable. | Backend detection is invalid intake with zero verifier dispatch; verifier independent detection is `INCONCLUSIVE` before proof with no mutation. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-10 | A recipe changes only by an allowed declared-delta digest substitution. | `REUSE-PROMOTED`: that criterion executes the new recipe fresh exactly once and never consumes old-digest evidence. `ALL-FRESH-FALLBACK`: it executes fresh with every other criterion. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-11 | The exact five declared parity pairs are projected. | All five pass with exact `inputs`, ordered replies, and default-normalized additional files; registry-only and fixture-only mutations fail; neither input object mutates. | TGT-SPR-EVALS, TGT-SPR-PARITY-INPUTS | T3 |
| AC-SPR-12 | `R-COMPLETE-NEAR-MISS` remains intentionally different and absent from the finite parity map. | Direct opt-in comparison of the near miss fails, while scanner normal mode and ordinary case comparison remain pass; no unlisted case receives parity enforcement. | TGT-SPR-EVALS, TGT-SPR-PARITY-INPUTS | T3 |
| AC-SPR-13 | A mixed later cycle or an all-fresh disposition reaches independent verification. | One fresh complete aggregate covers every current AC exactly once from fresh impacted/rejected-reuse proof plus independently accepted exact unaffected evidence, or all-fresh proof; no worker result substitutes. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS | T3 |
| AC-SPR-14 | The internal generation validator and existing public recipe controls run. | Exact AC coverage, frozen wrapper recanonicalization, one digest per URI, separate-generation digest changes, and the identity baseline pass; recipe v1 fields/digest, four adapter helper commands, and existing statuses remain exact with no new public schema. | TGT-SPR-GENERATION | T1 |
| AC-SPR-15 | Any typed-reuse promotion gate remains failing after permitted in-task correction or would require prohibited state/schema. | Final target is a coherent `ALL-FRESH-FALLBACK`: generation consistency and parity remain, current repair behavior is preserved, later cycles are all-fresh, all reuse-enabling bytes/cases/claims are absent, and the authoritative pinned keep check passes with exact fallback inventories and no keep-case/fixture mismatch. Otherwise final target is coherent `REUSE-PROMOTED` with the exact promoted inventories and the same pass conditions. | TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS, TGT-SPR-PRESERVATION | T3 |
| AC-SPR-16 | Pure semantic-case comparison receives equal, mismatched, malformed, unknown, and ordinary non-parity synthetic inputs. | It returns the existing deterministic pass/fail result, applies exact empty-list defaults and ordered-field comparison, mutates no input, and leaves `compare_case`/CLI behavior and schemas unchanged. | TGT-SPR-PARITY | T2 |

## Verification / Done criteria

- [x] VR-SPR-01. Reject one-generation URI conflicts before verifier dispatch.
  - Criterion: AC-SPR-01
  - Proof class: targeted-test plus semantic backend trace
  - Scenario / environment / fixture: From repository root run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/surface-verification-adapter/scripts/test_adapter_contract.py`; run `B-ASSURANCE-GENERATION-CONFLICT` in one fresh no-overwrite semantic context.
  - Evidence form: Unit failure code for same-URI/different-digest and trace ending at backend invalid intake with verifier/proof invocation count zero.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-02. Validate generations separately and relate them only by delta.
  - Criterion: AC-SPR-02
  - Proof class: targeted-test plus semantic backend trace
  - Scenario / environment / fixture: Unit-call the old and new packages separately. In `REUSE-PROMOTED`, run rewritten `B-ASSURANCE-REUSE-UNAFFECTED` with old/new IDs and one exact delta edge; in `ALL-FRESH-FALLBACK`, run the valid later-cycle branch of `B-ASSURANCE-REUSE-DISPOSITIONS`.
  - Evidence form: Two separate generation-pass receipts with no union conflict, plus either one exact typed action row or one complete later-cycle all-fresh receipt.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-03. Prove lifecycle and provenance stay outside recipe identity.
  - Criterion: AC-SPR-03
  - Proof class: identity-check
  - Scenario / environment / fixture: In `REUSE-PROMOTED`, run `B-ASSURANCE-RECIPE-CONSTRUCTION` with identical criterion-read bytes and changed lifecycle, Handoff, evidence, and papercut values. In `ALL-FRESH-FALLBACK`, assert that case/path and every new construction claim are absent.
  - Evidence form: Exact equal recipe-ID sets in promoted mode, or exact fallback inventory with no construction/reuse claim.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-04. Restrict recipe-ID changes to listed target bindings.
  - Criterion: AC-SPR-04
  - Proof class: identity-check
  - Scenario / environment / fixture: In `REUSE-PROMOTED`, run `B-ASSURANCE-RECIPE-CONSTRUCTION` with one target URI present in a strict recipe subset and substitute only its declared digest. In `ALL-FRESH-FALLBACK`, run the disposition case all-fresh and assert the construction case is absent.
  - Evidence form: Exact changed-ID set equals the binding subset in promoted mode; fallback runs every current recipe fresh and makes no narrower impact claim.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-05. Reject every non-delta recipe rebind.
  - Criterion: AC-SPR-05
  - Proof class: targeted-test plus semantic matrix
  - Scenario / environment / fixture: In `REUSE-PROMOTED`, mutate a digest on an undeclared URI, add/remove a URI, and mutate each non-digest field in the disposition case. In `ALL-FRESH-FALLBACK`, inspect the same case and scanner for absence of typed cross-generation rows.
  - Evidence form: Either exact rebind only for declared digest substitution with every other row exiting reuse through D02/invalid intake, or a proved all-fresh later-cycle projection with no rebind action.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-06. Reuse only exact identity and evidence.
  - Criterion: AC-SPR-06
  - Proof class: semantic backend/verifier trace
  - Scenario / environment / fixture: In `REUSE-PROMOTED`, rewritten `B-ASSURANCE-REUSE-UNAFFECTED` binds one exact no-edge recipe and exact prior evidence beside one rebound criterion. In `ALL-FRESH-FALLBACK`, the disposition case runs the complete later-cycle set fresh.
  - Evidence form: Independent accept/reject decision and exact-ID reuse only in promoted mode; fallback has zero cross-generation reuse; neither branch permits stale or partial reuse.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-07. Select all-fresh for missing or ambiguous impact evidence.
  - Criterion: AC-SPR-07
  - Proof class: semantic disposition trace
  - Scenario / environment / fixture: `B-ASSURANCE-REUSE-DISPOSITIONS` runs missing-complete-aggregate and ambiguous-edge branches with valid current intake.
  - Evidence form: Complete current recipe invocation counts and one aggregate for each all-fresh branch; no authority stop or reuse.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-08. Route semantic changes through D02.
  - Criterion: AC-SPR-08
  - Proof class: semantic routing trace
  - Scenario / environment / fixture: Run approved semantic-change and unapproved semantic-change branches in `B-ASSURANCE-REUSE-DISPOSITIONS`; retain current `R-DRIFT` and `R-DRIFT-NEAR-MISS` controls.
  - Evidence form: Approved branch all-fresh under current authority; unapproved branch `authority-change-required`; unrelated drift remains non-material.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-09. Stop invalid current binding at the detecting owner.
  - Criterion: AC-SPR-09
  - Proof class: negative backend/verifier trace
  - Scenario / environment / fixture: Run generation-conflict predispatch branch and rewritten `B-ASSURANCE-REUSE-DRIFT` verifier-recheck branch.
  - Evidence form: Backend zero-dispatch invalid intake; verifier `INCONCLUSIVE` before proof; no fresh fallback, repair, or mutation.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-10. Run the rebound current recipe fresh.
  - Criterion: AC-SPR-10
  - Proof class: semantic backend/verifier trace
  - Scenario / environment / fixture: In `REUSE-PROMOTED`, the positive mixed-action case changes one already-listed URI digest on an exact edge. In `ALL-FRESH-FALLBACK`, the disposition case presents the same valid later cycle without a typed action row.
  - Evidence form: Promoted mode records old/new IDs and edge, invokes the new recipe once, and consumes zero old-digest evidence; fallback invokes every current recipe fresh.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-verification
- [x] VR-SPR-11. Prove the five opt-in parity pairs and mutation failures.
  - Criterion: AC-SPR-11
  - Proof class: deterministic self-test and closed caller scan
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json`, then scanner self-test and normal mode; independently mutate registry then fixture copies in temporary objects.
  - Evidence form: Existing self-test result schema status pass; five exact parity passes; both one-sided mutations fail; before/after deep equality for inputs.
  - Target recheck: TGT-SPR-EVALS, TGT-SPR-PARITY-INPUTS
  - Receiver: dev-verification
- [x] VR-SPR-12. Prove parity remains opt-in.
  - Criterion: AC-SPR-12
  - Proof class: deterministic negative control
  - Scenario / environment / fixture: Direct helper comparison of `R-COMPLETE-NEAR-MISS` fails; scanner normal mode and ordinary `compare_case` still accept their authorized scopes; assert the ID is absent from the five-case map.
  - Evidence form: Direct fail result plus normal pass results and exact map inventory.
  - Target recheck: TGT-SPR-EVALS, TGT-SPR-PARITY-INPUTS
  - Receiver: dev-verification
- [x] VR-SPR-13. Emit one complete independent aggregate.
  - Criterion: AC-SPR-13
  - Proof class: independent verification
  - Scenario / environment / fixture: Run both promoted mixed-action and all-fresh disposition cases when reuse is promoted; in fallback run the all-fresh controls only. Count every current AC/action and proof invocation.
  - Evidence form: Exactly one verdict per current AC, one verifier action decision where active, and one aggregate; no missing, duplicate, mixed-target, worker-evidence, or old-digest row.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS
  - Receiver: dev-implementation backend
- [x] VR-SPR-14. Preserve the internal and public recipe contracts.
  - Criterion: AC-SPR-14
  - Proof class: targeted compatibility and generation-set tests
  - Scenario / environment / fixture: Run adapter unit tests and `adapter_contract.py --self-test`; exercise exact AC coverage, wrapper mismatch, same-generation URI conflict, repeated equal binding, separate old/new generations, and the fixed recipe baseline.
  - Evidence form: Exact recipe baseline identity; deterministic internal failure codes; unchanged public command list/result objects; all existing tests remain pass.
  - Target recheck: TGT-SPR-GENERATION
  - Receiver: dev-implementation backend
- [x] VR-SPR-15. Prove atomic reuse promotion or all-fresh fallback.
  - Criterion: AC-SPR-15
  - Proof class: target-manifest and semantic gate
  - Scenario / environment / fixture: Run the complete fixed reuse gate after T3, select exactly one final branch, then run the exact pinned `compare_trace.py --keep-check` command in the mandatory baseline below. If any reuse gate remains failing after permitted in-task correction or needs prohibited persistent state/schema, compare final bytes with the pre-T3 manifest and declared fallback inventory.
  - Evidence form: One sealed `REUSE-PROMOTED` receipt with every reuse case passing plus keep-check `status=pass`, exact authoritative commit/blob/SHA identities, exact promoted inventories, and no keep-case/fixture mismatch; or one `ALL-FRESH-FALLBACK` receipt proving zero reuse-enabling bytes/claims, preserved repair behavior, later-cycle all-fresh proof, passing set/parity controls, exact fallback inventories, and the same keep-check pass conditions. Both branches retain the two historical reuse IDs in `ADDED_IDS`.
  - Target recheck: TGT-SPR-BACKEND, TGT-SPR-AUTHORITY, TGT-SPR-EVALS, TGT-SPR-PRESERVATION
  - Receiver: dev-verification

- [x] VR-SPR-16. Prove the pure comparator contract and ordinary-path preservation.
  - Criterion: AC-SPR-16
  - Proof class: deterministic self-test
  - Scenario / environment / fixture: Run `PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json` over equal/defaulted, each-field mismatch, malformed, unknown, one-sided mutation, and ordinary non-parity cases.
  - Evidence form: Existing self-test result schema status pass; deterministic mismatch ordering; before/after deep equality; all original 20 checks retain their statuses.
  - Target recheck: TGT-SPR-PARITY
  - Receiver: dev-implementation backend

For each named semantic case, use the established current transport: bind one fresh no-overwrite observation root with `observe_case.py bind`, execute exactly the bound request/replies in one fresh read-only semantic context, seal it with `observe_case.py seal`, and require `compare_trace.py` to return `lean-eval-trace/v1 status=pass` with exact required-event equality. Worker smoke and independent verification use separate roots and do not consume each other’s observations.

Mandatory command baseline, from `/Users/kim/.dotfiles`:

```text
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/surface-verification-adapter/scripts/test_adapter_contract.py
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/surface-verification-adapter/scripts/adapter_contract.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/observe_case.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --self-test --self-test-file .config/agents/skills/dev-ask/evals/compare_trace_selftest.json
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py --self-test
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/scan_stale_contracts.py
python3 -m json.tool .config/agents/skills/dev-ask/evals/evals.json
python3 -m json.tool .config/agents/skills/dev-ask/evals/compare_trace_selftest.json
python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-assurance-reuse-unaffected/case.json
python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-assurance-reuse-drift/case.json
python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-assurance-generation-conflict/case.json
python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-assurance-reuse-dispositions/case.json
PYTHONDONTWRITEBYTECODE=1 python3 .config/agents/skills/dev-ask/evals/compare_trace.py --keep-check --baseline-blob 678d4fb1e8c2a4855d57575de867c4e60de051de --baseline-commit c6af1aaf58eed506678808da7a2c5b87412486c7 --baseline-sha256 a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8 --current .config/agents/skills/dev-ask/evals/evals.json --repo-root /Users/kim/.dotfiles
python3 .config/agents/skills/dev-implementation/scripts/executor_plan.py validate .agents/plans/2026-08-27-1415_surface-proof-reuse-parity.md
```

`REUSE-PROMOTED` additionally runs `python3 -m json.tool .config/agents/skills/dev-ask/evals/fixtures/b-assurance-recipe-construction/case.json`. `ALL-FRESH-FALLBACK` instead proves that exact path and registry ID are absent.

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-SPR-T1 | T1 | Exact generation-helper target manifest, compatibility baseline, unit/self-test evidence | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff with before/after identities, helper signature, unit results, unchanged public-interface proof, changed-test dispositions, and exact T3 dependency reference. |
| OUTP-SPR-T2 | T2 | Exact comparator/helper/self-test target manifest, pure-helper evidence, and post-T2 `compare_trace.py` identity | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-implementation backend | One Common Handoff with helper signatures, self-test results, ordinary-comparator preservation, before/after equal extracted `ADDED_IDS`/`REWRITE_IDS`, the post-T2 whole-file SHA-256, changed-test dispositions, and exact T3 dependency reference. |
| OUTP-SPR-T3 | T3 | Final target manifest plus sealed `REUSE-PROMOTED` or `ALL-FRESH-FALLBACK` decision, branch inventory, pinned keep-check receipt, and focused semantic evidence | completed, blocked, failed, timed-out, cancelled, transport-unavailable, authority-change-required | dev-verification | One Common Handoff with accepted T1/T2 dependency identities, complete disposition/action coverage or exact fallback inventory, exact final `ADDED_IDS`/`REWRITE_IDS`, authoritative pinned baseline identities and pass result, parity map, worker smoke only, changed-test dispositions, preservation proof, and exact standard-assurance receiver. |

T3 is the last numbered task. After OUTP-SPR-T3, the backend obtains fresh current-target `dev-verification`, one current-target `dev-code-review`, and terminal `dev-continual-learning` exactly once. This plan omits a numbered profile tail; no completion or post-plan audit behavior is changed.

Fresh `dev-verification` independently reruns VR-SPR-01 through VR-SPR-16 on the exact final target and produces a new aggregate; OUTP-SPR-T1/T2 smoke and worker conclusions are dependency evidence only. Review and learning consume that verified target under the unchanged standard backend.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-SPR-BASE-DRIFT | dev-implementation worker | Exact current digests, semantic diff, dependency Handoffs, and preservation comparison | all | AUTH-SPR-REVISION, AUTH-SPR-HANDOFF, and current plan revision | Drift is unrelated/preserved or human authority revises the exact plan; never overwrite unexpected work. |
| BLK-SPR-TRANSPORT | dev-implementation backend | Current role profile, attestation, assessment, and concrete mismatch | all | AUTH-SPR-PLAN-RULES | Current `assess-plan-backed` is `full-orchestration` with `downgrade: none`; root rescue is forbidden. |
| BLK-SPR-INTERNAL-INTERFACE | dev-implementation backend | Evidence that current backend/verifier cannot import the internal function and would require a public package command/result contract | T1, T3 | DEC-SPR-VALIDATOR | Existing internal execution seam is usable. Otherwise return `authority-change-required`; do not invent a public command/schema or conditionally edit public helper docs. |
| BLK-SPR-PARITY-MAP | T3 | Exact current five-case map, fixture bytes, negative-control bytes, and mismatch diagnostics | T2, T3 | CONTRACT-SPR-PARITY-MAP | The five authority-declared pairs are exact and the negative control remains intentionally excluded; do not synchronize broad fixtures. |
| BLK-SPR-REUSE-GATE | T3 | Complete remaining gate failure, old/new package/action rows, current target manifest, and attempted in-task correction | T3 | DEC-SPR-FALLBACK | T3 atomically selects and proves `ALL-FRESH-FALLBACK`; this recovery does not remove T1/T2, alter current repair behavior, or authorize partial cross-generation reuse. |
| BLK-SPR-ASSURANCE | dev-implementation backend | Fresh verifier/reviewer Handoff mapped to AC-SPR IDs and exact target | all | Existing D03/D04 repair policy | Existing bounded repair closes the exact implicated task(s), or plan remains IN_PROGRESS with its blocker; no special retry is added. |

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-SPR-HANDOFF | Human semantic authority | AUTH-SPR-HANDOFF | Sole source for generation order, typed dispositions, parity semantics, scope, and fallback; AUTH-SPR-REVISION does not reopen these decisions. |
| ANC-SPR-REVISION | Human plan-correction authority | AUTH-SPR-REVISION | Binds symbol ownership, branch inventories, pinned keep proof, archived predecessor locator, and renewed plan approval. |
| ANC-SPR-D02 | Existing authority | `docs/adr/0001-dev-workflow-authority-and-routing.md#d02--approval-model` | Approved versus unapproved semantic drift outcome; file remains unchanged. |
| ANC-SPR-D04 | Canonical authority | `docs/adr/0003-bounded-assurance-and-repair.md#d04--assurance-boundaries` | Sole ADR section changed for assurance generation/rebind semantics. |
| ANC-SPR-CANONICALIZER | Code seam | `adapter_contract.py::canonical_recipe`, `_canonical_binding`, `_canonical_manifest` | Preserve recipe v1/live adapter checks; add pure internal generation validation only. |
| ANC-SPR-BACKEND | Procedure seam | `dev-implementation/SKILL.md#Assurance-backend-and-repair`; `references/plan-orchestration.md#Schedule-the-backend` | Own package admission, action freeze, fallback, dispatch, and aggregate scheduling. |
| ANC-SPR-VERIFIER | Independent owner | `dev-verification/SKILL.md` Intake, Procedure, Handoff, Required coverage, Stop | Independently recheck packages/actions, run current rebound recipes fresh, and aggregate complete coverage. |
| ANC-SPR-PARITY | T2 code/caller seam | `compare_trace.py::canonical_semantic_case`, `compare_semantic_case`, `fixture_sources`, `run_selftest`, `compare_case`, `result`; `scan_stale_contracts.py::dwo_registry_contract_hits` | T2 adds the import-only comparator and self-test support; T3 consumes it through one exact finite caller map; ordinary one-shot comparison stays exact. |
| ANC-SPR-INVENTORY | T3 symbol/provenance seam under TGT-SPR-EVALS | `compare_trace.py::ADDED_IDS`, `REWRITE_IDS`, `keep_check`; commit `c6af1aaf58eed506678808da7a2c5b87412486c7`; blob `678d4fb1e8c2a4855d57575de867c4e60de051de`; SHA-256 `a5900845a98b3fefda9a23294383a0f19eece004e5a0be389c3acb8a91e103f8` | T2 preserves and hands off the constants; T3 applies the exact branch delta under the existing eval target and proves all other registry rows/fixtures remain pinned. |
| ANC-SPR-FIVE-PAIRS | Finite authority map | `B-FULL`; `B-T5-COMPLETION-ASSURED`; `B-T5-COMPLETION-MISSING-ASSURANCE`; `R-COMPLETE`; `R-COMPLETE-COMPACT-NO-LEARNING` | Only permanent registry/fixture equality callers. |
| ANC-SPR-NONPARITY | Negative control | `R-COMPLETE-NEAR-MISS` registry row and fixture | Proves comparison is opt-in; intentional request difference remains. |
| ANC-SPR-PREDECESSOR | Immutable predecessor | AUTH-SPR-DWO Completion Summary and 81-file target identity | Read-only evidence/base; never amend or use as a live prior-package reread. |
| ANC-SPR-NO-SHIPPING | Effect boundary | ADR-0001 D14 and AUTH-SPR-HANDOFF | No staging, commit, push, review request, release, deploy, rollout, or shipping. |

- ASM-SPR-INTERNAL: Current repository call graph supports an import-only generation validator and import-only parity helper. If execution proves a public command/result is required, stop under BLK-SPR-INTERNAL-INTERFACE rather than choose a schema.
- ASM-SPR-FROZEN: A reusable prior package is available only as the exact previously validated snapshot bound by its complete aggregate/evidence. If absent, select all-fresh; never reconstruct or live-reread it.
- ASM-SPR-WHOLE-FILE: Current fixture/dependency lists remain the conservative impact graph. A changed whole-file fixture may affect seven recipes; no AC-12/14-only claim is authorized.
- ASM-SPR-FALLBACK: Reuse failure does not block the independent set/parity fixes. The fallback removes all reuse-only behavior and claims before final assurance.

## Completion Summary

- **Delivered outcome**: Completed T1–T3 and all 16 acceptance criteria on the `REUSE-PROMOTED` branch. The backend now validates one complete frozen proof generation before verifier dispatch, later same-outcome assurance uses exact typed fresh/reuse actions with one new complete independent aggregate, and semantic registry/fixture equality remains opt-in for exactly five consumers.
- **Material decisions**: Promoted typed reuse because every fixed reuse, parity, inventory, and pinned keep gate passed; the authorized `ALL-FRESH-FALLBACK` was not selected. Preserved the public recipe CLI/schema, ordinary `compare_case()`, Executor Plan v1, repair behavior, and no-shipping boundary. Two assurance-intake recipe-binding lineages were corrected in backend-owned proof packages and freshly reverified without changing the 13-path target or consuming the post-assurance repair token.
- **Immutable evidence**: Final target `sha256:9529c835a472cc99a7a2b988457879843b99b1bc358b7eba5e5efde501e3469e`; exact target manifest `local://OUTP-SPR-T3-target-manifest-attempt-2.json@sha256:4b538581edbb750ee170f6d11e03c9eaf00dc3007b8e177af781b6c2093c93e7`; complete proof package `local://surface-proof-reuse-parity-complete-recipe-generation.json@sha256:55fcddb70fb4739c7a7659f143c6af4a20d6c582c8305f39a0d3859415df4b1e`; fresh verification `local://VER-SPR-COMPLETE.md@sha256:eebab852d5db0fb62f73036e574c74d42cce3dc2321ee2a05653a16993d102cb` with `16/16 VERIFIED` aggregate identity `sha256:b39e03b6e84823eff695352bec8858323ecfa20506d3c4fe1e98d5ec60292e4c`; final review `local://REVIEW-SPR-FINAL.md@sha256:64dbbb2d9e923e30018ac936c1f775919dd545dd14949e55d2412eae3a21b1d5` with Standards/Specification `PASS` and Overall `APPROVED`; terminal learning `local://LEARNING-SPR.md@sha256:0f10b619aaa0a3e3125fc47d84f3fb83913c30bd85859257bd848c63d9677ddf` with `NO DURABLE LEARNING`.
- **Material findings**: `SPR-REVIEW-INTAKE-RECIPE-001`, `SPR-REVIEW-INTAKE-RECIPE-002`, and metadata advisory `SPR-REVIEW-ADV-REF-001` are closed on the complete 51-binding generation. Permanent-test review retained 28 checks and left terminal advisory `SPR-REVIEW-ADV-TEST-001` to merge two diagnostically focused but subsumed comparator checks when that corpus is next maintained.
- **Current residual risk**: Only `SPR-REVIEW-ADV-TEST-001`; it affects no acceptance criterion and does not reopen the outcome. No unresolved correctness, security, privacy, data-loss, compatibility, target-staleness, repair, or assurance blocker remains. Repair token remains `unused 1/1`.
- **Effects and continuation**: Repository target verification observed zero byte drift. Staging, commit, push, review request, release, deployment, rollout, and shipping were not authorized or performed. Resume from this `#completion-summary`; terminal Common Handoff: `local://LEARNING-SPR.md@sha256:0f10b619aaa0a3e3125fc47d84f3fb83913c30bd85859257bd848c63d9677ddf`.
