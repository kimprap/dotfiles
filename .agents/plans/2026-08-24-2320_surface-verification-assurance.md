# Surface Verification Adapters and Bounded Assurance Collection

**Datetime**: 2026-08-24-2320
**Authority kind**: local-authority
**Mode**: high-consequence
**Scope**: Manual repository-specific surface verification adapters, complete proof binding, and one isolated evidence-collection worth experiment.
**Summary**: Add host-neutral, dead-discovery adapter machinery without changing assurance selection, then evaluate bounded assurance collection against a frozen corpus. Promote collection only on the frozen gate; otherwise remove it and preserve the permanent-adapter baseline exactly.
**Status**: PENDING

## Objective

- Outcome: OUT-SVA-ASSURANCE-01
- Engineering specification: SPEC-SVA-20260824-r1, embedded in this complete plan revision.
- Observable end state: The workflow exposes the exact manual `surface-verification-adapter`, `create-surface-verification-adapter`, and `maintain-surface-verification-adapter` contracts; adapter-backed criteria bind complete immutable proof recipes and doctor readiness; one isolated collection experiment ends in a sealed `PASS | FAIL | INCONCLUSIVE`; only `PASS` changes active collection semantics.
- Progress signal: one owned `AC-SVA-*`, `AC-COL-*`, or terminal criterion advances on an exact target, or a named blocker is resolved. Agent count, elapsed time, wall time, token use, and artifact volume are not progress.

## Authority

| Authority ID | Kind | URI | Revision | Approval |
|---|---|---|---|---|
| AUTH-SVA | human requirements | current-request://AUTH-SVA-20260824-r4 | AUTH-SVA-20260824-r4; HANDOFF-SVA-20260824-r4 | Approved by the current human request; this plan is its self-contained technical projection. |
| AUTH-ADR-0001 | active ADR | docs/adr/0001-dev-workflow-authority-and-routing.md | sha256:508207282491621364834901d698f29c4f3fd1bd8cac2024972b74ff2015e4f2 | Current scope revalidated. |
| AUTH-ADR-0002 | active ADR | docs/adr/0002-executor-plans-and-orchestration.md | sha256:74bf00ccb41c85c223388e38d88193424d051837b9cf36a39c0494ce5c181197 | Current scope revalidated. |
| AUTH-ADR-0003 | active ADR | docs/adr/0003-bounded-assurance-and-repair.md | sha256:78cd7fdeeb73b3d52b48542d0c34f0a1e637237bb863d862807beddfd4a39f86 | Current scope revalidated. |
| AUTH-ADR-0004 | active ADR | docs/adr/0004-canonical-discovery-and-continual-learning.md | sha256:6e25ab8f2fb2aec9b9f2f7c2b945e9684157ebe27fc62c6389b82c03d8d087a7 | Current scope revalidated. |
| AUTH-ADR-0008 | active ADR | docs/adr/0008-repository-agent-integration-setup.md | sha256:e5f3940639e9997e2fcbf3d3bdea5d2a11e91461109b83b95cd01c92a2d382e3 | Current scope revalidated. |
| AUTH-ADR-0009 | active ADR | docs/adr/0009-session-lifecycle-envelope-and-portable-learning.md | sha256:30bf19695051256a47c0bd586dd96db69b39df053fe8842a5770dea64a3a3751 | Current scope revalidated. |
| AUTH-WORKFLOW | current workflow projection | .config/agents/skills/dev-ask/WORKFLOW.md | sha256:4dea8bdebeeb9fe4afe28577a0007ecdcc720fe7a2cd850fe0b3dab3402ee287 | Current scope revalidated. |
| AUTH-PAPERCUT | evidence only | .agents/papercuts.json#pc-ae711c27c4d758b7 | sha256:6653bf3c12330e7985c9f23dbd1fe84a62c3d6abb0b30a4330f958db0ed83d57; resolution null | Not implementation authority; preserve unless existing terminal settlement authority becomes eligible. |

Every bound authority digest above matched the current working-tree bytes during specification. The executor must rehash all authority and target baselines before T1; semantic drift stops before mutation and returns for a same-plan authority revision. A clean Git tree is not assumed, and unrelated user work must remain untouched.

## Governing decisions

| Decision ID | Revision | Execution effect |
|---|---|---|
| DEC-SVA-NAMES | AUTH-SVA-20260824-r4 | Use only `surface-verification-adapter`, `create-surface-verification-adapter`, and `maintain-surface-verification-adapter`; no aliases, redirects, or upstream names. |
| DEC-SVA-MANUAL | AUTH-SVA-20260824-r4 | Put `disable-model-invocation: true` on the shared contract, wrappers, and generated adapters. Explicit host-native invocation remains available; ordinary verification, tests, review, setup, and `dev-*` prompts cannot load them. |
| DEC-SVA-PLACEMENT | AUTH-SVA-20260824-r4 | Permanent machinery lives in this workflow repository. Actual adapters live only in an approved consuming repository under its declared skill seam. This dotfiles repository is the decline case and receives no product adapter. |
| DEC-SVA-GRANULARITY | AUTH-SVA-20260824-r4 | One adapter owns one distinct launch, isolation, drive, evidence, and cleanup contract; visible entry points may share it only when those mechanics are compatible. |
| DEC-SVA-BINDING | AUTH-SVA-20260824-r4 | Resolve an existing adapter only from an exact frozen recipe URI and digest; never search by description or create/maintain one during ordinary workflow execution. |
| DEC-SVA-DOCTOR | AUTH-SVA-20260824-r4 | Run doctor only when a frozen recipe names an adapter. Doctor proves readiness/capability, cleans disposable probes, preserves evidence, and never satisfies an acceptance criterion, worker smoke, or verifier proof. |
| DEC-SVA-PROFILE | ADR-0001 D11 @ AUTH-ADR-0001 | Adapter presence changes no proof class, compact disqualifier, assurance profile, lifecycle depth, route owner, topology, or shipping boundary. |
| DEC-SVA-CUTOVER | ADR-0001 D13 @ AUTH-ADR-0001 | Migrate every affected active caller, fixture, skill, workflow projection, and ADR in one clean logical cutover; retain no stale path or compatibility alias. |
| DEC-SVA-CREATE | ADR-0008 D25 @ AUTH-ADR-0008 | Creation is manual, exact-proposal and exact-approval gated, baseline-rechecked, owner-preserving, delegated to `craft-skill`, and declines shallow or unnecessary adapters. |
| DEC-SVA-MAINTAIN | ADR-0004 D07 @ AUTH-ADR-0004 | Maintenance requires an eligible predicate, edits only the existing adapter-owned surface, never repairs product code or ships, and rebinds affected recipes before assurance. Portable `assess` may update an already-authorized adapter destination but may not create any adapter, wrapper, or shared contract. |
| DEC-COL-ISOLATION | AUTH-SVA-20260824-r4 | Collection experiment source, corpus, runtime, and outputs stay outside the repository and every configured skill/rule root; no `SKILL.md`, live import, registry row, or inventory entry is created. |
| DEC-COL-TOPOLOGY | ADR-0002 D06 @ AUTH-ADR-0002 | Permanent implementation remains one-owner sequential. Experimental collector contexts are evaluation subjects inside T4, gated by fresh provider attestation; they are not plan lineages, route owners, stages, or live topology. |
| DEC-COL-OWNER | ADR-0003 D04/D22 @ AUTH-ADR-0003 | Collectors return evidence only. One verifier or one original-initial reviewer independently aggregates and signs the sole semantic verdict; later review slots never collect. |
| DEC-COL-BOUND | ADR-0003 D03/D22 @ AUTH-ADR-0003 | Preserve one inherited repair token, original-initial/original-rerun/grant budgets, one aggregate verdict, and no automatic Second opinion. |
| DEC-COL-GATE | AUTH-SVA-20260824-r4 | Freeze seeded truth, context-count compute, optional comparable agent-active time, `E ≤ B + N`, invariant gate, quality threshold, and efficiency threshold before observing results. |
| DEC-COL-PROMOTION | ADR-0001 D13 @ AUTH-ADR-0001 | `PASS` performs one active clean cutover. `FAIL` and `INCONCLUSIVE` remove all experiment implementation and leave active collection contracts byte-identical to the post-adapter collection baseline. |
| DEC-SVA-DISTRIBUTION | ADR-0009 D27 @ AUTH-ADR-0009 | Keep semantic bodies host-neutral. OMP's explicit skill command and Grok's explicit slash command are transport only; neither host receives copied ADRs, provider policy, model selection, or cloud policy. |
| DEC-SVA-SHIPPING | ADR-0001 D14 @ AUTH-ADR-0001 | Shipping is not authorized: no staging, commit, push, PR, release, deployment, or rollout. |

## Scope, non-goals, and prohibited effects

- Read surfaces: the bound skills, rules, ADRs, eval infrastructure, host inventory evidence, consuming-repository fixtures, and exact papercut record named by this plan.
- Change surfaces: the three new skill packages; bounded skill-authoring, specification/ticket, implementation, verification, review, Handoff, learning, setup, workflow, ADR, index, evaluator, fixture, and stale-contract projections named in the Target map; collection projections only on `PASS`.
- Non-goals: a real Neovim/Ghostty/product adapter in this repository; automatic adapter creation or maintenance; an upstream-name alias; importing or exposing `swarm`; fixed worker counts; race/vote/best-of selection; compact-tail collection; assurance escalation from adapter presence; a new route owner, stage, repair token, review pass, Second opinion, setup catalog row, terminal schema, or runtime store.
- Prohibited effects: no product repair through an adapter owner; no modification of acceptance from a feature map; no assurance-role mutation; no repository-local experiment source; no user-level skill mutation; no credentials; no staging, commit, push, PR, release, deployment, or rollout.

| Effect ID | Kind | Authority | Limit / reversibility |
|---|---|---|---|
| EFF-PERMANENT | repository-write | AUTH-SVA | Only permanent target paths named under T1 and T2; preserve all unrelated bytes; reversible before separately authorized delivery. |
| EFF-EXPERIMENT | external-temporary-write | AUTH-SVA | Create only owner-tracked, symlink-free roots below the verified system temporary directory and outside the repository/discovery paths; remove them after sealed result capture. |
| EFF-PROMOTION | conditional-repository-write | AUTH-SVA plus a sealed collection `PASS` | Only T5's named active collection sections/fixtures; no effect on `FAIL` or `INCONCLUSIVE`; reversible before delivery. |

Papercut settlement is not a plan effect. The existing backend may perform its separately governed one-record settlement only after a complete candidate-specific terminal curation result; otherwise `pc-ae711c27c4d758b7` remains open and the ledger bytes remain unchanged.

## Fixed shared contracts

| Contract ID | Surface | Owner task | Revision | Consumers |
|---|---|---|---|---|
| CONTRACT-ADAPTER-IDENTITY | Adapter package and immutable identity | T1 | surface-verification-adapter/v1 | T1, T2, T6 |
| CONTRACT-ADAPTER-INTERFACE | Launch, doctor, drive, evidence, isolation, cleanup, and stable paths | T1 | surface-verification-adapter/v1 | T1, T2, T6 |
| CONTRACT-CREATION | Manual consuming-repository creation | T1 | create-surface-verification-adapter/v1 | T1 |
| CONTRACT-MAINTENANCE | Manual existing-adapter maintenance | T1 | maintain-surface-verification-adapter/v1 | T1 |
| CONTRACT-PROOF-RECIPE | Complete criterion-specific proof identity | T2 | surface-proof-recipe/v1 | T2, T6 |
| CONTRACT-DOCTOR-RECEIPT | Readiness-only adapter evidence | T2 | surface-verification-doctor/v1 | T2, T6 |
| CONTRACT-PROFILE-NEUTRALITY | Assurance and route neutrality | T2 | AUTH-SVA-20260824-r4 | T2, T5, T6 |
| CONTRACT-COLLECTOR | Internal collector evidence | T3 | assurance-collector-evidence/v1 | T3, T4, T5 |
| CONTRACT-COLLECTION-AGGREGATE | Required-slice accounting and sole-owner verdict | T3 | assurance-collection-aggregate/v1 | T3, T4, T5 |
| CONTRACT-WORTH-GATE | Paired corpus, compute, time, cap, and promotion decision | T4 | AUTH-SVA-20260824-r4 | T3, T4, T5 |
| CONTRACT-CUTOVER | PASS promotion or no-change cleanup | T5 | D13 + AUTH-SVA-20260824-r4 | T5, T6 |
| CONTRACT-COLLECTION-HANDOFF | PASS-only collector references inside one Common Handoff | T5 | assurance-collection-handoff/v1 after promotion only | T5, T6, T7 |
| CONTRACT-HANDOFF | One digest-bound Common Handoff per semantic attempt | T2 | dev-handoff current contract | T2, T3, T4, T5, T6, T7, T8 |
| CONTRACT-TERMINAL | Exact-target verification, one review, one assessment, and backend accounting | T6 | current high-consequence tail | T6, T7, T8 |

### Adapter identity and package

- A workflow package is one level below `.config/agents/skills/` and has `SKILL.md`; the shared package additionally owns `scripts/adapter_contract.py`, its unit tests, and adapter-specific eval fixtures.
- This surface-proof package is not the `dev-implementation` Orchestrator Role Profile runtime adapter. It owns no profile, dispatch, observe/control, recovery, credential, model, or provider capability and cannot satisfy those capability gates.
- Every shared/wrapper/generated adapter `SKILL.md` has exact `name`, a narrow explicit-invocation description, and literal `disable-model-invocation: true`. Do not emit `alwaysApply`, model, effort, cloud, or Cursor-only path policy.
- Exact descriptions are: shared contract, `Manual shared contract for repository-specific surface verification adapters; load only by exact skill invocation or a frozen adapter recipe.`; creation wrapper, `Create a repository-specific surface verification adapter only after explicit invocation and exact approval; never run for generic verification or tests.`; maintenance wrapper, `Maintain an existing repository-specific surface verification adapter only after explicit invocation or an authorized existing-destination assessment; never run for generic upkeep or product fixes.` Generated adapters substitute their approved lifecycle/surface while preserving the same manual-only boundary.
- Creation resolves only the consuming repository's declared skill seam; it never hardcodes `.cursor/skills` or any other provider directory.
- The adapter URI is the symlink-free canonical `file://` URI of its root `SKILL.md`. The adapter digest is SHA-256 over sorted-key compact UTF-8 JSON `{schema:"surface-verification-adapter-tree/v1",files:[{path,sha256}]}` for every regular file below the adapter root, sorted by POSIX-relative path. Reject symlinks, special files, path escapes, duplicate paths, an absent `SKILL.md`, a name/directory mismatch, or missing manual-invocation metadata.
- `scripts/adapter_contract.py` exposes `adapter --root PATH`, `recipe --input JSON`, `doctor --input JSON`, and `--self-test`. Each success prints one sorted-key JSON object; validation failure prints one stable error object and exits nonzero. It creates no files, launches no process, and mutates no target.
- Required adapter body sections are `Binding`, `Launch and readiness`, `Doctor`, `Stable paths`, `Drive`, `Evidence`, `Isolation`, and `Cleanup`. `Stable paths` contains at least one real user path. An optional external feature map may deepen those paths but cannot add acceptance criteria or task coverage.
- Evidence lives outside the adapter package and survives cleanup. Cleanup removes only adapter-started instances and scratch state; it never kills by process name and never removes evidence.

### Permanent file layout

```text
.config/agents/skills/surface-verification-adapter/
  SKILL.md
  scripts/adapter_contract.py
  scripts/test_adapter_contract.py
  evals/evals.json
  evals/fixtures/ui-service/repository/.agents/AGENTS.md
  evals/fixtures/ui-service/repository/app.py
  evals/fixtures/ui-service/repository/static/index.html
  evals/fixtures/ui-service/expected.json
  evals/fixtures/cli/repository/.agents/AGENTS.md
  evals/fixtures/cli/repository/tool.py
  evals/fixtures/cli/expected.json
  evals/fixtures/library-config/repository/.agents/AGENTS.md
  evals/fixtures/library-config/repository/config.toml
  evals/fixtures/library-config/expected.json
.config/agents/skills/create-surface-verification-adapter/SKILL.md
.config/agents/skills/maintain-surface-verification-adapter/SKILL.md
```

Live evals copy fixture `repository/` roots into system temporary directories, invoke wrappers there, and delete generated project adapters after digest-bound evidence export. Fixture sources contain no generated adapter. The UI fixture uses a real stdlib HTTP service and browser drive; the CLI fixture uses a real PTY/process and filesystem state; the library/config fixture supplies only static/native checks and must decline creation.
Semantic approval-gate evals use an explicit synthetic consuming-owner turn whose entire accepted response is `approve` after byte-comparing the frozen proposal. That response is fixture evidence only and never becomes D25 authority for a real repository; a real invocation still waits for its human's exact approval.

### Complete proof recipe

- For every owned criterion, the backend canonicalizes one exact object with keys: `schema`, `acceptance`, `proof_class`, `target`, `scenario`, `inputs`, `evidence_form`, `adapter`, `fixtures`, `dependencies`, `isolation`, `cleanup`, and `comparison`.
- `schema` is `surface-proof-recipe/v1`. `acceptance` is `{id,claim,expected}`. `target` is `{surface,environment}`. `adapter` is literal `none` or `{uri,digest}`. `fixtures` and `dependencies` are sorted arrays of `{uri,digest}`. `comparison` is literal `none` or `{baseline,treatment}`.
- The recipe identity is `VR-` followed by the stable recipe slug and `@sha256:` followed by the digest. Every semantic field change creates a new digest and follows current Task Contract rebind rules. Adapter digest alone is never the recipe identity.
- Specification and ticketing must supply every field or explicit `none` before implementation readiness. Workers, verifiers, and reviewers load an adapter only from the exact recipe URI; broad search, description matching, filesystem presence, and name similarity are invalid.
- At Task Contract construction, `dev-implementation` runs the shared helper's `recipe --input` command on each specification/ticket object, freezes its returned identity in the Task Contract and Context Pack, and blocks before `ready` on any incomplete or mismatched object. At independent assurance, `dev-verification` rehashes the exact adapter tree and recipe inputs before consuming evidence; compact uses the same binding but no independent tail.
- This plan's own recipes bind adapter `none`: this repository has sufficient native proof guidance and the task must not silently use the adapter machinery it creates.

### Doctor and drift

- A doctor receipt is sorted-key JSON with `schema:"surface-verification-doctor/v1"`, `recipe_id`, `adapter:{uri,digest}`, `target_environment`, `action`, `expected`, `observed`, `status:"ready|blocked"`, `disposable_resources`, `continuing_instance`, `cleanup`, `evidence`, and `product_observation`.
- Doctor runs once at readiness only for a recipe whose adapter is not `none`. `continuing_instance` is `none` unless the Task Contract explicitly owns and identifies the live instance. Cleanup lists every probe resource removed, remaining scratch state, and surviving evidence URI/digest.
- A stale URI/digest, stale guidance, unclean probe, or unavailable capability blocks readiness. A product failure is reported as product evidence. Neither condition starts maintenance, repairs product code, satisfies worker smoke, nor becomes verifier evidence.
- Post-bind adapter drift makes assurance `INCONCLUSIVE`. A task authorized to modify its adapter binds the baseline, treats the adapter as a changed target, runs adapter-specific worker smoke, then rebinds the final tree digest and every affected recipe before independent assurance. A semantic recipe change requires the ordinary authority/Task Contract revision rather than verifier adjustment.

### Creation and maintenance

- `create-surface-verification-adapter` loads the shared contract, then delegates file-authoring mechanics to `craft-skill`. It inspects the consuming repository, proves repeated live-behavior mechanics justify a deep adapter, resolves the repository-declared skill seam, and declines when native tests, static/build checks, measurement, or a task-local recipe suffice.
- Creation proposes the exact adapter root, every file/effect, absent or SHA-256 baseline, ownership, preservation boundary, and end-to-end proof. Only exact `approve` for the unchanged proposal permits mutation. Recheck all affected baselines before the first write; any drift writes nothing and requires a new proposal.
- The default new name is `surface-verification-` followed by the approved lifecycle slug unless the consuming repository already declares a nonconflicting skill naming convention; the exact proposal and approval bind the final name. Never replace or duplicate an equivalent existing adapter.
- Creation produces no empty adapter or empty feature map. It proves launch, doctor, one stable real path, action plus resulting state, evidence survival, and cleanup. Broken checkout/product behavior returns `blocked`; the wrapper never repairs product code.
- Source proximity, adapter age, possible usefulness, ordinary verification, and generic upkeep are not maintenance predicates.
- `maintain-surface-verification-adapter` accepts only an exact existing adapter URI/digest plus one eligible predicate: proven stale doctor/drive guidance, current approved adapter-upkeep scope, explicit full audit, or a complete authorized `continual-learning assess` candidate for that existing destination. It delegates mutation to `craft-skill` and edits only adapter-owned files.
- Maintenance distinguishes documentation drift, harness gap, and product regression; product regressions stay product evidence. Shared live driving is serialized. Every changed path is re-driven and affected recipes are rebound before later assurance. Outcomes are `changed | unchanged | blocked`; no PR, staging, commit, or shipping occurs.
- `init-ask` continues to expose adapters only through the existing `Repository rules and skills` row and its current owners. It gains no tenth row and no setup-owned creation path.

### Collector evidence and aggregation

- A collector receives one parent pass identity, one exact non-overlapping slice ID, owned criteria or review axis, immutable target digest, recipe/review-input digests, expected result, and read-only Context Pack. It never chooses product semantics, acceptance, repair, route, or verdict.
- Derive `N` from the frozen acceptance/effect boundary and proof recipe, never from a preferred worker count. Prefer one slice per finite direct/effect/successor consumer set when such a set exists; otherwise use natural non-overlapping behavior dimensions such as UI versus persisted state or terminal output versus filesystem effect. If no complete non-overlap proof exists, decline collection.
- Its sorted-key compact output uses `schema:"assurance-collector-evidence/v1"` and exact keys `parent_pass`, `slice_id`, `ownership`, `target`, `inputs`, `actions`, `expected`, `observed`, `evidence`, `uncertainty`, `confounding`, `status`, `context`, and `replay_of`. `status` is `complete | failed | inconclusive`; `replay_of` is `none` or the exact prior collector identity.
- Every experimental semantic-owner or collector launch also emits `assurance-subject-context/v1` with exact keys `case_id`, `arm`, `role`, `slice_id`, `target`, `authority`, `recipe`, `context_id`, `parent_context_id`, `provider_transport`, `replay_of`, `entered_evidence`, `agent_active_ms`, `time_comparability`, `status`, and `output`. `entered_evidence` is the sole context-count admission fact; post-entry failure counts, while pre-entry transport failure does not count but may force `INCONCLUSIVE`. `agent_active_ms` is a nonnegative provider measurement or `none`; `time_comparability` is `comparable | unavailable | mixed`.
- Collector reports are internal evidence artifacts, not Common Handoffs, tasks, stages, verdicts, votes, repairs, or criteria. The semantic owner's one Common Handoff references every collector URI/digest and its own independent aggregate reasoning.
- One pre-verdict replay is allowed only for transport loss, missing required fields, explicit confounding, or incomplete execution of the unchanged slice. It keeps target, slice, recipe, expected result, and Context Pack exact. A substantive failed observation is never replayed to seek a pass; a second incomplete/confounded result makes the aggregate `INCONCLUSIVE`.
- The backend may schedule promoted collectors only inside an already-selected noncompact `dev-verification` pass or the `original-initial` `dev-code-review` pass. Planning, requirements, specification, ticketing, implementation work/smoke, integration, curation, compact work, `original-rerun`, `grant-scoped`, and human Second opinion never collect.
- Aggregation accounts for all slices, deduplicates by violated predicate and causal boundary, requires direct evidence for blockers, resolves contradictions only from existing direct evidence, and returns `INCONCLUSIVE` when coverage or contradiction remains unresolved. Only the verifier or reviewer signs the existing aggregate verdict and forwards stable IDs into unchanged D03 accounting.
- Review collection is eligible only in `original-initial`. Its two default slices are Standards evidence and Specification evidence. The final reviewer independently evaluates both axes, cross-axis interactions, relevance, deduplication, all open/closed lineage identities, and valid evidence reuse before signing. `original-rerun` and `grant-scoped` remain direct closure/impact passes.

### Frozen experimental corpus and gate

The experiment source and sample roots are created from this table under the external experiment root; no experiment file enters the repository.

| Case ID | Kind and slices | Immutable seeded truth |
|---|---|---|
| VER-UI-STATE | verification; UI acknowledgement and persisted service state | Python stdlib form service acknowledges the submitted value but persists the prior value; blocker `BLK-V-UI-PERSIST`. |
| VER-CLI-DRYRUN | verification; terminal output and filesystem no-effect | Python CLI prints a no-change dry-run result but writes `result.json`; blocker `BLK-V-CLI-MUTATION`. |
| VER-FINITE-CONSUMERS | verification; direct, effect, and successor consumers | Two consumers satisfy normalization; the successor mishandles empty input; blocker `BLK-V-CONSUMER-EMPTY`. |
| REV-CONFIG-CUTOVER | original-initial review; Standards and Specification | An obsolete alias remains executable after a required clean cutover; both axes map to one causal blocker `BLK-R-CUTOVER`, not two votes. |
| REV-RECOVERY | original-initial review; Standards and Specification | Recovery catches the wrong exception and violates the required trigger-response-recovery contract; one blocker `BLK-R-RECOVERY`. |
| REV-PRIVACY-OUTPUT | original-initial review; Standards and Specification | CLI output exposes a seeded token where the approved contract requires redaction; one blocker `BLK-R-PRIVACY`. |
| NEG-COMPACT | negative; two nominal slices | Compact declines collection and uses unchanged criterion-complete worker smoke. |
| NEG-ONE-SLICE | negative; one slice | Semantic owner performs the slice directly; no batch or spare context. |
| NEG-OVERLAP | negative; overlapping ownership | Collection declines before dispatch because no non-overlap proof exists. |
| NEG-TARGET-UNAVAILABLE | negative; target digest mismatch | No collector runs; result is `INCONCLUSIVE` with exact stale target evidence. |
| NEG-DROPOUT | negative; one required report absent | Aggregate is `INCONCLUSIVE`; `N-1` success is impossible. |
| NEG-CONTRADICTION | negative; direct evidence conflicts | Aggregate is `INCONCLUSIVE` when direct evidence cannot resolve the conflict; no vote. |
| NEG-SHARED-STATE | negative; two slices share one live instance | One coordinator serializes both slices; every slice remains mandatory. |
| NEG-LATER-REVIEW | negative; original-rerun slot | Reviewer performs direct closure/impact work; no collection portfolio. |
| NEG-DEAD-DISCOVERY | negative; ordinary `dev-*` prompt and host inventories | No experiment identity or upstream `swarm` name is discoverable/loadable. |
| NEG-REPLAY-EXHAUST | negative; confounded initial and one identical replay | Aggregate is `INCONCLUSIVE`; the replay counts as another context and the case cannot be a promotion win. |
| NEG-REPRODUCIBILITY | control; fresh repeated baseline and collection arms | The selected claimed wins retain the same fixture digest, verdict, finding set, cap result, and qualifying quality or efficiency result in one fresh repeat. |
Each case's sealed truth manifest also enumerates every clean predicate and axis; any reported issue outside the seeded violated predicates is a false blocker.

For every qualifying case, run paired baseline and collection arms against the same authority, target digest, recipe/review inputs, sample-root bytes, and seeded truth. Baseline uses the semantic owner only. Collection uses that semantic owner plus exactly one collector per declared slice. Use fresh contexts in every arm. Repeat each claimed winning case once with fresh contexts and unchanged bytes.
Each baseline arm uses exactly one semantic-owner context and each treatment arm uses exactly one semantic-owner context plus its required collectors. A pre-evidence transport restart is recorded but not counted; a semantic-owner failure after evidence entry makes that arm `INCONCLUSIVE` and receives no semantic retry.
T4 is the experiment controller and never performs a case's semantic assessment. Each arm launches its semantic owner as a fresh subject context. The controller is outside `B` and `E` only while it limits itself to dispatch, receipt-schema validation, sealed-truth comparison, and deterministic gate computation; if it enters evidence collection or semantic judgment, it becomes an entered semantic-owner context and must be counted.

Compute is entered semantic-owner plus collector contexts. Let `B` be baseline semantic-owner contexts, `N` declared slices, and `E` collection semantic-owner plus collector contexts including replay and post-evidence transport failures. Every winning case must satisfy `E ≤ B + N`. No spare, unused, race, identical-brief, or undeclared context is legal.

The invariant gate requires: no false blocker; no baseline blocker lost; no missing slice; one aggregate verdict; no new criterion/stage/repair/review pass; no increased advisory churn; no repository/runtime residue; no experiment discovery; and every negative case produces its declared decline, serialization, or `INCONCLUSIVE` result.
Advisory churn is the deduplicated set of nonblocking or disjoint advisory lineages after semantic-owner aggregation. Treatment may reduce that set, but may not increase its cardinality or introduce a new advisory without seeded direct evidence.

The sealed gate output uses sorted-key JSON `assurance-collection-aggregate/v1` with exact keys `authority`, `corpus`, `cases`, `context_accounting`, `invariants`, `quality`, `efficiency`, `repeats`, `cleanup`, `discovery`, `status`, and `promotion_eligible`. Each case records target/recipe/review-input digests, baseline/treatment verdict and finding sets, `B`, `N`, `E`, replay identities, false/lost/additional blocker sets, optional comparable time inputs, and repeat identity. `promotion_eligible` is true only when `status` is `PASS`.

After the invariant gate, quality wins only when at least one additional seeded blocker is found in at least two independent cases, each repeats in fresh contexts, and every winning case meets the cap. For efficiency, a case's arm time is the sum of the same provider-reported agent-active milliseconds across every entered context in that arm; compare paired totals, then take the median improvement across all six qualifying cases. Efficiency wins only when verdicts/finding sets equal baseline, that median improves at least 20%, the complete six-case result repeats in fresh contexts, and every original/repeated case meets the cap. If any relevant context lacks the same comparable metric/version/unit, record timing as absent and omit the efficiency arm entirely; wall elapsed time, tool calls, tokens, or event counts are forbidden proxies. `PASS` requires invariants plus quality or efficiency. Complete evidence that misses thresholds is `FAIL`; missing/confounded gate evidence or unknown final manifest/discovery/cleanup is `INCONCLUSIVE`.

### External experiment implementation

T3 creates one random, absent `surface-verification-collection-UUID` directory under the canonical system temporary directory after proving its real path is outside the repository and every configured skill/rule/discovery root. The root and every child are owner-token tracked, contain no symlink or special file, and use this exact layout:

```text
surface-verification-collection-UUID/
  owner.json
  source/collection_harness.py
  source/test_collection_harness.py
  corpus/manifest.json
  corpus/cases/CASE-ID/authority.md
  corpus/cases/CASE-ID/target/
  corpus/cases/CASE-ID/truth.json
  corpus/cases/CASE-ID/baseline-prompt.txt
  corpus/cases/CASE-ID/treatment-owner-prompt.txt
  corpus/cases/CASE-ID/slice-prompts/SLICE-ID.txt
  runtime/RUN-ID/
  evidence/RUN-ID/
```

`collection_harness.py` uses only the Python standard library and exposes `freeze`, `profile`, `plan-case`, `validate-report`, `aggregate-case`, `gate`, `finalize`, and `--self-test`. `freeze` seals the complete corpus before first dispatch. `profile` validates provider attestation without selecting provider/model. `plan-case` emits exact subject envelopes and declared context cap. `validate-report` rejects malformed/stale/cross-slice evidence. `aggregate-case` performs required-slice accounting and seeded-truth comparison without semantic voting. `gate` computes the frozen invariant, quality, optional efficiency, repetition, and context-cap result. `finalize` closes receipts/manifests and emits the exact export/delete inventory.

The controller exports the sealed corpus, receipts, aggregate, manifests, and Common Handoff references to harness-owned `artifact://` or `local://` storage and verifies their digests before deleting the owned temporary root. `test_collection_harness.py` exercises every schema, negative/control branch, replay boundary, cap calculation, gate outcome, unsafe-root rejection, export-before-delete rule, and manifest equality rule without launching subject contexts.

### Atomic result branch

Before T4 dispatch, T3 seals the post-T2 collection-target preimage and region/file manifest. T5 rechecks that exact preimage immediately before any active write. `FAIL` or `INCONCLUSIVE` performs no active write. `PASS` applies every named skill, Handoff, workflow, ADR/index, evaluator, scanner, and fixture change as one T5 delta, removes obsolete internal paths in the same delta, then runs all promoted contract smokes before handing off.

If a PASS delta or smoke fails, T5 restores only its exact delta when current bytes still match the T5 postimage, verifies the post-T2 preimage and discovery inventory, and returns a failed Common Handoff for ordinary bounded repair. Concurrent drift that makes exact restoration unsafe blocks without reset or partial acceptance. No branch may reach T6 with a partial promotion, unknown manifest, or remaining temporary experiment root.

## Target map

| Target ID | Path / surface | Owner task | Base identity | Callers / fixtures | Criteria |
|---|---|---|---|---|---|
| TGT-ADAPTER-MODULES | `.config/agents/skills/{surface-verification-adapter,create-surface-verification-adapter,maintain-surface-verification-adapter}/` | T1 | all three absent | explicit wrappers, craft-skill, consuming fixtures | AC-SVA-01, AC-SVA-03 |
| TGT-SKILL-OWNERS | `craft-skill/{SKILL.md,evals/evals.json}` and `init-ask/{SKILL.md,evals/evals.json}` adapter integration regions | T1 | BM-PERMANENT entries | wrapper delegation and Repository rules and skills row | AC-SVA-04, AC-SVA-05 |
| TGT-LEARNING-BOUNDARY | `continual-learning/SKILL.md` and skill-local adapter-destination evals | T1 | bound current target manifest | terminal assess | AC-SVA-05 |
| TGT-RECIPE-OWNERS | `dev-specification/SKILL.md`, `dev-ticketing/SKILL.md`, `dev-implementation/SKILL.md`, compact checklist, `dev-verification/SKILL.md`, `dev-code-review/SKILL.md`, and `dev-handoff/SKILL.md` permanent adapter regions | T2 | BM-PERMANENT entries plus OUTP-T1 | Task Contracts, Context Packs, proof roles, Common Handoff | AC-SVA-06, AC-SVA-07, AC-SVA-09 |
| TGT-ROUTER-PROJECTIONS | `dev-ask/SKILL.md`, `dev-ask/WORKFLOW.md`, ADR-0001/0002/0003/0004/0008/0009, and `docs/adr/INDEX.md` permanent adapter clauses | T2 | BM-AUTHORITY/BM-PERMANENT entries | router, workflow discovery, focused ADR decisions | AC-SVA-02, AC-SVA-08 |
| TGT-PERMANENT-EVALS | bounded permanent-adapter additions to `dev-ask/evals/{evals.json,fixtures/,scan_stale_contracts.py}` | T2 | existing files from BM-PERMANENT; new case dirs absent | existing `compare_trace.py` plus router, recipe, doctor, drift, self-modification, profile, and compact/noncompact cases | AC-SVA-10 |
| TGT-EXPERIMENT-HARNESS | verified system temporary-directory source/corpus/sample roots with no `SKILL.md` | T3 | absent owner-created roots | T4 only | AC-COL-01, AC-COL-02, AC-COL-08 |
| TGT-EXPERIMENT-RESULT | sealed external receipts, case aggregates, active/discovery manifests, and final aggregate | T4 | OUTP-T3 | T5 | AC-COL-03, AC-COL-04, AC-COL-05, AC-COL-06, AC-COL-GATE |
| TGT-COLLECTION-PROMOTION | conditional collection regions in implementation, verification, review, Handoff, WORKFLOW, ADR-0003/INDEX, and active evals | T5 | OUTP-T2 post-adapter collection baseline | T6 and future assurance | AC-COL-07, AC-COL-CUTOVER |
| TGT-CLEANUP-RECEIPT | external finalizer and post-cleanup active/discovery equality evidence | T5 | OUTP-T4 | T6 | AC-COL-09 |
| TGT-VERIFY-RECEIPT | immutable final target and aggregate verification Handoff | T6 | OUTP-T5 | T7 | AC-TERM-VERIFY |
| TGT-REVIEW-RECEIPT | Standards, Specification, Overall, and sealed lineages | T7 | OUTP-T6 | T8 | AC-TERM-REVIEW |
| TGT-LEARNING-RECEIPT | terminal curation result and existing Common Handoff | T8 | OUTP-T7 | dev-implementation backend | AC-TERM-LEARN |

### Bound target baselines

`BM-PERMANENT` binds these current working-tree bytes; do not reset them to Git history:

```text
6acf45125c57ee7f47996543ca0d8f4e829c42f6f277e23b5df314bea9d5c8bc  .config/agents/skills/craft-skill/SKILL.md
8ee8112b65f9e5405398b1eac84e0252fd14cb5a66039e3e29b3fb61db5c0706  .config/agents/skills/craft-skill/evals/evals.json
4d4f88dd06fa567850aefcff74c00d48007b2aabd4f2b22e7d6a001c24d93ad5  .config/agents/skills/init-ask/SKILL.md
327fda86b016c1c0871e2f21e74c10dae4f7b7fac666acf191399696e5e36829  .config/agents/skills/init-ask/evals/evals.json
7b092d58542473bb6542be275de91bee9d52b86c89641435403c3c0e2b20055d  .config/agents/skills/dev-specification/SKILL.md
e1c8e6a36e787c699fb34c55187c670d005e84487ac9666a9d3df3c1ff0d34f2  .config/agents/skills/dev-ticketing/SKILL.md
34485360c9f4767eadfdcf9e3eb0284098c3b6eed2810f6dc26dea536297cb53  .config/agents/skills/dev-implementation/SKILL.md
b7031103dd766e612f587332d6ef7faad89ebf1d1a9ce3468055e3f5aea030ee  .config/agents/skills/dev-implementation/references/compact-checklist.md
b3ea4075016892b95690661768ec22805c72cd3354504352e37eebf7cf86b674  .config/agents/skills/dev-verification/SKILL.md
7d7893e48c307f7843f53b643d652a7f39523857a4e0b33863f1c24524f842f6  .config/agents/skills/dev-code-review/SKILL.md
04bfffddb8c7b0da5735dd59b72446c6b2b0ff1df3173e7f32993775f5e2dbf3  .config/agents/skills/dev-handoff/SKILL.md
21ee4efe1db24f0ad0cd9fbf028bba86d9b322aa49e24b0b0fcc55d0eaad9320  .config/agents/skills/dev-ask/SKILL.md
65932aaf1771cd35edf106e89fc883d69628b7ed333a077cce07b3348f993b03  .config/agents/skills/dev-ask/evals/evals.json
ba1acd01b9d35b2cc35471dd51363b53dc95b40265b721fa0c1b3d0937714c6c  .config/agents/skills/dev-ask/evals/scan_stale_contracts.py
743f572a5604185c0ba0335c8a13e6f1a512e1959910671458852261374439cf  .config/agents/skills/dev-ask/evals/compare_trace.py
7f3c2efa6609fae8d04c3498858701c7b7a7fd903a0753393bd3115d269982da  .config/agents/skills/continual-learning/SKILL.md
8aab752048a153b0403c2d32ded6bab6fa49fb1533b1bebd587fb6f21abfcbcc  .config/agents/skills/continual-learning/evals/evals.json
```

`BM-AUTHORITY` is the exact Authority table digest set. Any semantic mismatch requires an authority revision; an unrelated target addition remains outside this plan.

## Execution policy

- Assurance: high-consequence
- Topology: one-owner
- Max concurrency: 1
- Isolation: shared implementation lineage; all collection source/runtime/sample roots external, symlink-free, owner-tracked, and disposable.
- Lineages: shared
- Fan-in task: none
- Fan-in inputs: none
- Contention policy: T1 through T8 run strictly in order. T2 consumes T1's exact module manifest; T3 freezes the post-T2 collection baseline; T5 is the sole owner of the conditional branch and may not start before T4's sealed result/finalizer evidence. Collector aggregation remains internal to T4 or the conditionally promoted semantic-owner pass.
- Decomposition: no implementation child delegation. T4 may dispatch only the declared read-only experimental contexts under the frozen cap; T6-T8 use the existing profile-required independent roles.
- Effect limit: EFF-PERMANENT, EFF-EXPERIMENT, EFF-PROMOTION
- Orchestrator profile: not required for one-owner implementation. T4 separately requires a fresh provider-neutral experimental profile/attestation proving the exact dispatch, observation, context-identity, isolation, and available-concurrency facts; concurrency unavailable but delegation available serializes collectors. Missing fresh-context delegation makes the experiment `INCONCLUSIVE`, never a live topology downgrade or scope reduction.
- Experimental transport: on OMP, T4 dispatches each fresh subject through the native `task` context primitive and records returned agent/context and parent identities; on Grok, T4 starts one isolated `grok --no-auto-update -p` process with the sealed subject prompt, `--output-format json`, and `--cwd` set to the exact sample root, then records its process/output identity. Another host may use only its documented equivalent with the same fresh-context, observability, isolation, and identity guarantees. The plan fixes no provider, model, or effort choice.

## Tasks

- [ ] T1. Implement manual adapter contracts and ownership
  - Owner: dev-implementation worker
  - Intent: Provide deep manual guidance for durable real-surface proof mechanics.
  - Methods: none
  - Wave: W0
  - Depends on: none
  - Targets: TGT-ADAPTER-MODULES, TGT-SKILL-OWNERS, TGT-LEARNING-BOUNDARY
  - Contracts: CONTRACT-ADAPTER-IDENTITY, CONTRACT-ADAPTER-INTERFACE, CONTRACT-CREATION, CONTRACT-MAINTENANCE
  - Criteria: AC-SVA-01, AC-SVA-03, AC-SVA-04, AC-SVA-05
  - Effects: EFF-PERMANENT
  - Output: OUTP-T1
  - Receiver: T2
  - Verification: VR-SVA-01, VR-SVA-03, VR-SVA-04, VR-SVA-05
  - Lineage: shared
- [ ] T2. Integrate immutable recipes and readiness behavior
  - Owner: dev-implementation worker
  - Intent: Bind adapter-backed proof without changing assurance ownership or depth.
  - Methods: none
  - Wave: W1
  - Depends on: T1
  - Targets: TGT-RECIPE-OWNERS, TGT-ROUTER-PROJECTIONS, TGT-PERMANENT-EVALS
  - Contracts: CONTRACT-ADAPTER-IDENTITY, CONTRACT-ADAPTER-INTERFACE, CONTRACT-PROOF-RECIPE, CONTRACT-DOCTOR-RECEIPT, CONTRACT-PROFILE-NEUTRALITY, CONTRACT-HANDOFF
  - Criteria: AC-SVA-02, AC-SVA-06, AC-SVA-07, AC-SVA-08, AC-SVA-09, AC-SVA-10
  - Effects: EFF-PERMANENT
  - Output: OUTP-T2
  - Receiver: T3
  - Verification: VR-SVA-02, VR-SVA-06, VR-SVA-07, VR-SVA-08, VR-SVA-09, VR-SVA-10
  - Lineage: shared
- [ ] T3. Build the isolated frozen collection harness
  - Owner: dev-implementation worker
  - Intent: Create a disposable experiment that cannot enter live workflow discovery.
  - Methods: none
  - Wave: W2
  - Depends on: T2
  - Targets: TGT-EXPERIMENT-HARNESS
  - Contracts: CONTRACT-COLLECTOR, CONTRACT-COLLECTION-AGGREGATE, CONTRACT-WORTH-GATE, CONTRACT-HANDOFF
  - Criteria: AC-COL-01, AC-COL-02, AC-COL-08
  - Effects: EFF-EXPERIMENT
  - Output: OUTP-T3
  - Receiver: T4
  - Verification: VR-COL-01, VR-COL-02, VR-COL-08
  - Lineage: shared
- [ ] T4. Run paired collection worth evaluation
  - Owner: dev-implementation worker
  - Intent: Determine whether bounded collection adds reproducible assurance value.
  - Methods: none
  - Wave: W3
  - Depends on: T3
  - Targets: TGT-EXPERIMENT-RESULT
  - Contracts: CONTRACT-COLLECTOR, CONTRACT-COLLECTION-AGGREGATE, CONTRACT-WORTH-GATE, CONTRACT-HANDOFF
  - Criteria: AC-COL-03, AC-COL-04, AC-COL-05, AC-COL-06, AC-COL-GATE
  - Effects: EFF-EXPERIMENT
  - Output: OUTP-T4
  - Receiver: T5
  - Verification: VR-COL-03, VR-COL-04, VR-COL-05, VR-COL-06, VR-COL-GATE
  - Lineage: shared
- [ ] T5. Apply promotion or exact cleanup branch
  - Owner: dev-implementation worker
  - Intent: Keep only collection behavior that passes the frozen worth gate.
  - Methods: none
  - Wave: W4
  - Depends on: T4
  - Targets: TGT-COLLECTION-PROMOTION, TGT-CLEANUP-RECEIPT
  - Contracts: CONTRACT-COLLECTOR, CONTRACT-COLLECTION-AGGREGATE, CONTRACT-WORTH-GATE, CONTRACT-CUTOVER, CONTRACT-COLLECTION-HANDOFF, CONTRACT-PROFILE-NEUTRALITY, CONTRACT-HANDOFF
  - Criteria: AC-COL-07, AC-COL-09, AC-COL-CUTOVER
  - Effects: EFF-EXPERIMENT, EFF-PROMOTION
  - Output: OUTP-T5
  - Receiver: T6
  - Verification: VR-COL-07, VR-COL-09, VR-COL-CUTOVER
  - Lineage: shared
- [ ] T6. Verify the immutable final result
  - Owner: dev-verification
  - Intent: Prove every adapter and collection criterion on the exact final target.
  - Methods: none
  - Wave: W5
  - Depends on: T5
  - Targets: TGT-VERIFY-RECEIPT
  - Contracts: CONTRACT-ADAPTER-IDENTITY, CONTRACT-ADAPTER-INTERFACE, CONTRACT-PROOF-RECIPE, CONTRACT-DOCTOR-RECEIPT, CONTRACT-PROFILE-NEUTRALITY, CONTRACT-CUTOVER, CONTRACT-COLLECTION-HANDOFF, CONTRACT-HANDOFF, CONTRACT-TERMINAL
  - Criteria: AC-TERM-VERIFY
  - Effects: none
  - Output: OUTP-T6
  - Receiver: T7
  - Verification: VR-TERM-VERIFY
  - Lineage: shared
- [ ] T7. Review Standards and Specification once
  - Owner: dev-code-review
  - Intent: Reject any outcome-relevant defect in the verified final target.
  - Methods: none
  - Wave: W6
  - Depends on: T6
  - Targets: TGT-REVIEW-RECEIPT
  - Contracts: CONTRACT-PROFILE-NEUTRALITY, CONTRACT-COLLECTION-HANDOFF, CONTRACT-HANDOFF, CONTRACT-TERMINAL
  - Criteria: AC-TERM-REVIEW
  - Effects: none
  - Output: OUTP-T7
  - Receiver: T8
  - Verification: VR-TERM-REVIEW
  - Lineage: shared
- [ ] T8. Assess terminal durable learning
  - Owner: dev-continual-learning
  - Intent: Curate only qualified durable learning and return complete terminal evidence.
  - Methods: none
  - Wave: W7
  - Depends on: T7
  - Targets: TGT-LEARNING-RECEIPT
  - Contracts: CONTRACT-TERMINAL, CONTRACT-HANDOFF
  - Criteria: AC-TERM-LEARN
  - Effects: none
  - Output: OUTP-T8
  - Receiver: dev-implementation backend
  - Verification: VR-TERM-LEARN
  - Lineage: shared

## Acceptance

| Criterion ID | Condition / input | Expected observable / threshold | Surface | Owning task |
|---|---|---|---|---|
| AC-SVA-01 | UI/service, CLI, and this repository creation cases | UI/service and CLI receive concrete exact proposals; this library/config repository declines with no project adapter or empty artifact. | TGT-ADAPTER-MODULES | T1 |
| AC-SVA-02 | Ordinary setup/verify/test/review/dev prompts and explicit wrapper invocations | Only the three exact names exist; upstream names are absent; ordinary prompts cannot load them or make setup create an adapter; explicit host-native invocation can. | TGT-ROUTER-PROJECTIONS | T2 |
| AC-SVA-03 | Generated adapter in each disposable eligible repository | Adapter exposes launch/readiness, doctor, stable path drive, evidence, isolation, and cleanup through the declared seam with no provider/model/cloud policy. | TGT-ADAPTER-MODULES | T1 |
| AC-SVA-04 | Exact create proposal, approval, baseline drift, broken product, and setup catalog cases | Only exact unchanged approval creates adapter-owned bytes; drift writes nothing; broken product returns blocked; the catalog remains nine rows with no setup-owned creation; no product repair or shipping occurs. | TGT-SKILL-OWNERS | T1 |
| AC-SVA-05 | Eligible and ineligible maintenance cases | Only an eligible exact existing adapter and its owned files change; product regression remains product evidence; final recipes require rebind; `assess` cannot create a missing adapter, shared contract, or wrapper. | TGT-SKILL-OWNERS, TGT-LEARNING-BOUNDARY | T1 |
| AC-SVA-06 | Any adapter-backed acceptance criterion | One complete `surface-proof-recipe/v1` identity binds every required field and exact adapter URI/tree digest; no broad discovery occurs. | TGT-RECIPE-OWNERS | T2 |
| AC-SVA-07 | Readiness with bound adapter, no adapter, disposable probe, and stale guidance | Doctor runs only when bound, proves readiness rather than criterion evidence, cleans undeclared state, preserves evidence, and blocks stale guidance. | TGT-RECIPE-OWNERS | T2 |
| AC-SVA-08 | Same task/criteria with adapter absent versus installed | Compact eligibility, proof class, assurance profile, route, lifecycle depth, and topology remain identical unless independent existing facts differ. | TGT-ROUTER-PROJECTIONS | T2 |
| AC-SVA-09 | Adapter bytes drift after bind or task modifies its adapter | Drift yields `INCONCLUSIVE`; authorized self-modification cannot enter assurance until final adapter and affected recipes are rebound. | TGT-RECIPE-OWNERS | T2 |
| AC-SVA-10 | Compact and noncompact final flow fixtures | Compact remains criterion-complete smoke only; noncompact verification emits one criterion aggregate and review emits one Standards/Specification/Overall result. | TGT-PERMANENT-EVALS | T2 |
| AC-COL-01 | Experiment source, runtime, inventory, route, and registries | No live owner, stage, outcome, task, repair token, opinion path, skill/rule/inventory entry, or discoverable experiment exists. | TGT-EXPERIMENT-HARNESS | T3 |
| AC-COL-02 | Qualifying cases and compact, one-slice, overlap, unavailable target, later review, shared state | Only exact qualifying slices collect; negatives decline, serialize, or become `INCONCLUSIVE` exactly as frozen. | TGT-EXPERIMENT-HARNESS | T3 |
| AC-COL-03 | Every qualifying and dropout/replay case | Every required slice is accounted; missing or exhausted replay coverage is `INCONCLUSIVE`; `N-1` success is impossible. | TGT-EXPERIMENT-RESULT | T4 |
| AC-COL-04 | Seeded blockers, clean evidence, contradictions, and duplicate opinions | Only direct evidence establishes blockers; votes, first-pass, best-of, majority, repetition, and agent count have no authority. | TGT-EXPERIMENT-RESULT | T4 |
| AC-COL-05 | Verification and original-initial review collection | Only the semantic verifier/reviewer emits the aggregate verdict; collector reports contain evidence and candidate lineages only. | TGT-EXPERIMENT-RESULT | T4 |
| AC-COL-06 | Replay-eligible, substantive-failure, and second-confounder cases | At most one identical pre-verdict replay occurs; no substantive failure is replayed to seek a pass; exhausted replay is `INCONCLUSIVE`. | TGT-EXPERIMENT-RESULT | T4 |
| AC-COL-07 | Repair/review/opinion accounting before and after branch | D03, original-initial, original-rerun, grant-scoped, and human Second opinion semantics remain byte- and behavior-equivalent except the approved internal initial-pass collection on PASS. | TGT-COLLECTION-PROMOTION | T5 |
| AC-COL-08 | Corpus freeze before first context | Every expected blocker, clean case, contradiction, and confounder is bound to immutable fixture truth before baseline or collection output exists. | TGT-EXPERIMENT-HARNESS | T3 |
| AC-COL-09 | Experiment result `FAIL` or `INCONCLUSIVE` | No experiment implementation remains; active collection files equal the post-T2 baseline byte for byte; result/Handoff evidence survives. | TGT-CLEANUP-RECEIPT | T5 |
| AC-COL-GATE | Complete paired corpus and optional timing data | Invariants, quality, efficiency, compute, replay, repetition, and `E ≤ B + N` are evaluated exactly; output is one sealed PASS, FAIL, or INCONCLUSIVE. | TGT-EXPERIMENT-RESULT | T4 |
| AC-COL-CUTOVER | Sealed T4 result | PASS alone atomically promotes named semantics/evals; FAIL/INCONCLUSIVE performs no active collection edit; all branches remove experiment runtime. | TGT-COLLECTION-PROMOTION | T5 |
| AC-TERM-VERIFY | Exact immutable OUTP-T5 target | Fresh independent proof covers every applicable SVA/COL/cutover criterion and emits one aggregate `VERIFIED`; no worker conclusion substitutes. | TGT-VERIFY-RECEIPT | T6 |
| AC-TERM-REVIEW | Exact VERIFIED target and original-initial slot | One decorrelated read-only review emits Standards, Specification, and Overall `APPROVED`, with cross-axis interactions and all lineages accounted. | TGT-REVIEW-RECEIPT | T7 |
| AC-TERM-LEARN | Settled exact reviewed target and complete candidate intake | One terminal assessment returns CURATED or NO DURABLE LEARNING with all seven fields and one Common Handoff; backend receives exact terminal evidence without a second envelope. | TGT-LEARNING-RECEIPT | T8 |

## Verification / Done criteria

Each recipe below has adapter `none`; the implementation backend resolves every named target/fixture/dependency identity to its exact digest before the owning task runs or assurance consumes it.

- [ ] VR-SVA-01. Exercise eligible UI, eligible CLI, and repository decline
  - Criterion: AC-SVA-01
  - Proof class: live-behavior
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"delete generated adapters and disposable roots after evidence capture","comparison":"three frozen eligibility classes","dependencies":["AUTH-SVA"],"environment":"disposable UI/service root, disposable CLI root, and current dotfiles root","fixtures":["FIX-SVA-UI","FIX-SVA-CLI","FIX-SVA-DECLINE"],"inputs":"explicit create invocation and exact approval only for eligible roots","isolation":"one fresh root per case","scenario":"propose/create eligible adapters and decline this repository","surface":"create wrapper"}`
  - Evidence form: exact proposals, generated adapter manifests for eligible roots, decline result, absence proof for repository adapter, and post-cleanup manifests
  - Target recheck: TGT-ADAPTER-MODULES
  - Receiver: T2
- [ ] VR-SVA-02. Prove exact names and dead discovery on both hosts
  - Criterion: AC-SVA-02
  - Proof class: external-observation
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"close disposable sessions without repository mutation","comparison":"explicit invocation versus ordinary near misses","dependencies":["OMP skills contract","Grok skills documentation"],"environment":"fresh OMP and Grok inventories","fixtures":["FIX-SVA-DISCOVERY"],"inputs":"explicit wrapper commands plus setup/verify/test/review/dev prompts","isolation":"fresh context per prompt","scenario":"observe inventory and activation timing","surface":"host skill discovery"}`
  - Evidence form: inventory and trace evidence showing explicit load, near-miss non-load, and absence of upstream names
  - Target recheck: TGT-ROUTER-PROJECTIONS
  - Receiver: T2
- [ ] VR-SVA-03. Drive one real path through each generated adapter
  - Criterion: AC-SVA-03
  - Proof class: live-behavior
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"terminate owned process or PTY, remove scratch, retain evidence","comparison":"none","dependencies":["OUTP-T1 adapter contract"],"environment":"disposable HTTP service and CLI PTY","fixtures":["FIX-SVA-UI","FIX-SVA-CLI"],"inputs":"launch, doctor, stable-path drive, evidence, cleanup","isolation":"dedicated port/data root or PTY","scenario":"follow generated instructions end to end","surface":"generated adapter interface"}`
  - Evidence form: readiness receipt, action/result evidence, no residual process/scratch, and surviving evidence digest
  - Target recheck: TGT-ADAPTER-MODULES
  - Receiver: T2
- [ ] VR-SVA-04. Enforce creation authority and drift fail-closed
  - Criterion: AC-SVA-04
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove disposable roots; preserve failure evidence","comparison":"approved unchanged baseline versus drift, broken product, and setup inventory","dependencies":["D25","craft-skill","init-ask"],"environment":"isolated sample repositories and current nine-row catalog","fixtures":["FIX-SVA-CREATE-AUTH"],"inputs":"approve, broad affirmation, affected-path drift, broken checkout, and setup request","isolation":"one root per branch","scenario":"run create wrapper through proposal/apply boundary and inspect setup ownership","surface":"creation authority"}`
  - Evidence form: exact changed/unchanged/blocked outputs, byte manifests proving no unauthorized mutation, and nine-row catalog/no-automatic-create evidence
  - Target recheck: TGT-SKILL-OWNERS
  - Receiver: T2
- [ ] VR-SVA-05. Separate adapter drift from product regression
  - Criterion: AC-SVA-05
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove disposable adapter/root after preserving evidence","comparison":"stale guidance, harness gap, product regression, ineligible proximity, existing assess destination, and missing assess destination","dependencies":["OUTP-T1 maintenance contract","craft-skill","continual-learning"],"environment":"isolated generated adapter roots","fixtures":["FIX-SVA-MAINTAIN"],"inputs":"each eligible/ineligible predicate","isolation":"serialized driving","scenario":"maintain only existing adapter-owned files and reject creation through assess","surface":"maintenance authority"}`
  - Evidence form: before/after manifests, classification, re-drive result, recipe rebind requirement, no product/shipping effect, and no new adapter/shared/wrapper for missing assess destination
  - Target recheck: TGT-SKILL-OWNERS, TGT-LEARNING-BOUNDARY
  - Receiver: T2
- [ ] VR-SVA-06. Canonicalize and bind a complete recipe
  - Criterion: AC-SVA-06
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"temporary JSON inputs removed","comparison":"complete recipe versus each missing, stale, or changed field","dependencies":["OUTP-T1 adapter identity"],"environment":"adapter_contract.py self-test and Task Contract fixtures","fixtures":["FIX-SVA-RECIPE"],"inputs":"complete tuple and one-field negative mutations","isolation":"temporary directory","scenario":"compute identity and reject incomplete or stale bindings","surface":"surface-proof-recipe/v1"}`
  - Evidence form: stable digest for identical canonical input and stable rejection for every omitted/mismatched field
  - Target recheck: TGT-RECIPE-OWNERS
  - Receiver: T3
- [ ] VR-SVA-07. Keep doctor readiness-only and clean
  - Criterion: AC-SVA-07
  - Proof class: live-behavior
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"doctor removes every undeclared probe and preserves receipt evidence","comparison":"bound adapter, explicit none, stale guidance, product failure, continuing instance","dependencies":["OUTP-T1","VR-SVA-06"],"environment":"disposable service and CLI roots","fixtures":["FIX-SVA-DOCTOR"],"inputs":"readiness transitions for each branch","isolation":"owned scratch and process identities","scenario":"run doctor only through bound recipes","surface":"implementation readiness"}`
  - Evidence form: doctor receipts, skipped-none proof, blocked stale/product cases, process/scratch post-state, and proof no criterion/smoke verdict was emitted
  - Target recheck: TGT-RECIPE-OWNERS
  - Receiver: T3
- [ ] VR-SVA-08. Compare profile selection with and without installed adapter
  - Criterion: AC-SVA-08
  - Proof class: identity-check
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"none","comparison":"same Task Contract facts with adapter absent and present","dependencies":["ADR-0001 D11","compact checklist"],"environment":"router/backend fixtures","fixtures":["FIX-SVA-PROFILE"],"inputs":"compact and noncompact cases","isolation":"fresh read-only traces","scenario":"compare route, proof class, assurance, topology, and lifecycle","surface":"profile neutrality"}`
  - Evidence form: field-by-field equal route/profile outputs except explicit recipe binding/doctor facts
  - Target recheck: TGT-ROUTER-PROJECTIONS
  - Receiver: T3
- [ ] VR-SVA-09. Fail drift and rebind self-modification
  - Criterion: AC-SVA-09
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove fixture mutations after sealed evidence","comparison":"post-bind drift versus authorized self-modification with final rebind","dependencies":["VR-SVA-06","VR-SVA-07"],"environment":"isolated adapter tree","fixtures":["FIX-SVA-DRIFT","FIX-SVA-SELF-MODIFY"],"inputs":"one semantic byte change after baseline bind","isolation":"copy-on-write fixture","scenario":"attempt assurance before and after final rebind","surface":"drift and rebind"}`
  - Evidence form: pre-rebind INCONCLUSIVE/block evidence and post-rebind final adapter/recipe identities
  - Target recheck: TGT-RECIPE-OWNERS
  - Receiver: T3
- [ ] VR-SVA-10. Preserve compact and noncompact aggregate shapes
  - Criterion: AC-SVA-10
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"none","comparison":"bound current baseline versus permanent adapter integration","dependencies":["ADR-0003 D04/D22"],"environment":"dev-ask lifecycle fixtures","fixtures":["B-COMPACT","B-VERIFY","B-REVIEW","new SVA near misses"],"inputs":"compact and high-consequence traces","isolation":"fresh sealed case observations","scenario":"compare states, dispatches, verdict counts, and review axes","surface":"existing assurance lifecycle"}`
  - Evidence form: comparator results showing no new compact tail, one verification aggregate, and one review aggregate
  - Target recheck: TGT-PERMANENT-EVALS
  - Receiver: T3
- [ ] VR-COL-01. Prove experiment has no live lifecycle surface
  - Criterion: AC-COL-01
  - Proof class: identity-check
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"finalizer removes all owner-created experiment roots","comparison":"pre/post active and host discovery manifests","dependencies":["OUTP-T2 collection baseline"],"environment":"external temporary root plus fresh host inventories","fixtures":["NEG-DEAD-DISCOVERY"],"inputs":"experiment source/corpus and ordinary dev prompt","isolation":"root outside repository and configured discovery paths","scenario":"enumerate paths, imports, registries, routes, skills, rules, and inventories","surface":"experiment isolation"}`
  - Evidence form: equal active manifests, no-leak inventory receipts, no SKILL.md/import/registry result, and cleanup receipt
  - Target recheck: TGT-EXPERIMENT-HARNESS
  - Receiver: T4
- [ ] VR-COL-02. Enforce exact collection eligibility
  - Criterion: AC-COL-02
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove case runtime roots after receipts","comparison":"qualifying cases versus all frozen eligibility negatives","dependencies":["CONTRACT-COLLECTOR"],"environment":"isolated corpus sample roots","fixtures":["six qualifying cases","NEG-COMPACT","NEG-ONE-SLICE","NEG-OVERLAP","NEG-TARGET-UNAVAILABLE","NEG-SHARED-STATE","NEG-LATER-REVIEW"],"inputs":"frozen profiles, slots, targets, slices, and state contracts","isolation":"per-case root; shared-state case serialized","scenario":"admit, decline, serialize, or stop exactly","surface":"collection eligibility"}`
  - Evidence form: case receipts with declared scheduling and no undeclared collector context
  - Target recheck: TGT-EXPERIMENT-HARNESS
  - Receiver: T4
- [ ] VR-COL-08. Seal fixture truth before execution
  - Criterion: AC-COL-08
  - Proof class: identity-check
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"retain sealed corpus digest in Handoff; remove source root after T5","comparison":"corpus digest before first context and after all outputs","dependencies":["AUTH-SVA"],"environment":"external corpus root","fixtures":["all corpus entries"],"inputs":"expected blockers, clean outcomes, contradictions, confounders","isolation":"write-once corpus then read-only","scenario":"seal truth and reject any post-output change","surface":"seeded truth"}`
  - Evidence form: corpus manifest/digest, first-context ordering receipt, and equal final digest
  - Target recheck: TGT-EXPERIMENT-HARNESS
  - Receiver: T4
- [ ] VR-COL-03. Require complete slice coverage
  - Criterion: AC-COL-03
  - Proof class: external-observation
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"finalizer accounts partial receipts before removing runtime","comparison":"complete qualifying arms versus dropout and replay exhaustion","dependencies":["OUTP-T3 sealed corpus"],"environment":"fresh provider contexts","fixtures":["qualifying cases","NEG-DROPOUT","NEG-REPLAY-EXHAUST"],"inputs":"declared slice maps and collector receipts","isolation":"exact target per case","scenario":"aggregate only after every required slice","surface":"coverage accounting"}`
  - Evidence form: every-slice table, INCONCLUSIVE negatives, and absence of N-1 success
  - Target recheck: TGT-EXPERIMENT-RESULT
  - Receiver: T5
- [ ] VR-COL-04. Reject consensus and resolve only direct evidence
  - Criterion: AC-COL-04
  - Proof class: external-observation
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove runtime after sealed evidence","comparison":"seeded truth versus collected findings","dependencies":["OUTP-T3"],"environment":"paired verification/review contexts","fixtures":["six qualifying cases","NEG-CONTRADICTION"],"inputs":"collector evidence, not opinions","isolation":"non-overlapping slices","scenario":"deduplicate predicates and handle contradiction","surface":"evidence aggregation"}`
  - Evidence form: blocker-to-seeded-truth map, false-positive/lost-blocker counts, deduplicated lineages, and INCONCLUSIVE contradiction
  - Target recheck: TGT-EXPERIMENT-RESULT
  - Receiver: T5
- [ ] VR-COL-05. Preserve one semantic verdict owner
  - Criterion: AC-COL-05
  - Proof class: identity-check
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"none beyond normal experiment finalizer","comparison":"collector outputs versus aggregate owner output","dependencies":["CONTRACT-COLLECTOR","CONTRACT-COLLECTION-AGGREGATE"],"environment":"all qualifying cases","fixtures":["six qualifying cases"],"inputs":"context and result receipts","isolation":"distinct context IDs","scenario":"check report fields and verdict authority","surface":"semantic ownership"}`
  - Evidence form: collector reports without verdict tokens and exactly one verifier/reviewer aggregate identity per pass
  - Target recheck: TGT-EXPERIMENT-RESULT
  - Receiver: T5
- [ ] VR-COL-06. Bound replay before verdict
  - Criterion: AC-COL-06
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove runtime after finalizer","comparison":"eligible transport/confounding replay versus substantive failure and exhausted replay","dependencies":["CONTRACT-COLLECTOR"],"environment":"fresh collector contexts","fixtures":["NEG-REPLAY-EXHAUST","substantive-failure branch"],"inputs":"same target, slice, recipe, expected, and Context Pack","isolation":"new context, unchanged semantic inputs","scenario":"admit at most one exact replay","surface":"replay gate"}`
  - Evidence form: replay-of identities, context counts, rejection of failure-seeking replay, and final INCONCLUSIVE when exhausted
  - Target recheck: TGT-EXPERIMENT-RESULT
  - Receiver: T5
- [ ] VR-COL-GATE. Evaluate frozen worth units and thresholds
  - Criterion: AC-COL-GATE
  - Proof class: measurement
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"seal aggregate before final cleanup","comparison":{"baseline":"semantic owner only","treatment":"semantic owner plus declared collectors"},"dependencies":["AUTH-SVA","OUTP-T3 corpus digest"],"environment":"all paired cases plus fresh repeats of claimed wins","fixtures":["six qualifying cases","all negatives"],"inputs":"context receipts, seeded truth, optional comparable agent-active metrics","isolation":"fresh context per role/arm/repeat","scenario":"compute invariants, quality, optional efficiency, and E<=B+N","surface":"frozen worth gate"}`
  - Evidence form: sealed aggregate with per-case B/N/E, repeat results, invariant table, quality/efficiency eligibility, exact status, and promotion_eligible boolean
  - Target recheck: TGT-EXPERIMENT-RESULT
  - Receiver: T5
- [ ] VR-COL-07. Preserve convergence budgets and later review behavior
  - Criterion: AC-COL-07
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"none","comparison":"post-T2 baseline versus selected T5 branch","dependencies":["ADR-0003 D03/D22","OUTP-T4"],"environment":"active workflow fixtures","fixtures":["repair","original-initial","original-rerun","grant-scoped","Second opinion"],"inputs":"same counters, slots, targets, and findings","isolation":"fresh sealed traces","scenario":"compare tokens, passes, admissions, reruns, and human action","surface":"existing convergence"}`
  - Evidence form: byte/trace comparison showing no D03 change and collection only in original-initial on PASS
  - Target recheck: TGT-COLLECTION-PROMOTION
  - Receiver: T6
- [ ] VR-COL-09. Remove failed or inconclusive experiment completely
  - Criterion: AC-COL-09
  - Proof class: identity-check
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"remove every owner-created source, sample, runtime, and scratch root after evidence export","comparison":"post-T2 active baseline versus post-T5 active state","dependencies":["OUTP-T2","OUTP-T4"],"environment":"repository plus both host inventories","fixtures":["forced FAIL branch","forced INCONCLUSIVE branch"],"inputs":"closed active-path manifest and owner-token cleanup list","isolation":"experiment outside repository","scenario":"run finalizer and compare exact bytes/discovery","surface":"disposable failure"}`
  - Evidence form: zero residual roots, equal manifest digest/path set/bytes, no-leak inventory, and preserved result/Handoff references
  - Target recheck: TGT-CLEANUP-RECEIPT
  - Receiver: T6
- [ ] VR-COL-CUTOVER. Apply exactly one deterministic result branch
  - Criterion: AC-COL-CUTOVER
  - Proof class: targeted-test
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"experiment roots removed on every branch","comparison":"PASS, FAIL, and INCONCLUSIVE branch fixtures","dependencies":["OUTP-T4 sealed result","ADR-0001 D13"],"environment":"active workflow targets","fixtures":["branch matrix"],"inputs":"promotion_eligible and finalizer axes","isolation":"single T5 mutation owner","scenario":"promote named semantics or preserve exact baseline","surface":"conditional cutover"}`
  - Evidence form: PASS active-delta manifest or FAIL/INCONCLUSIVE equality receipt, plus absence of experiment code in every branch
  - Target recheck: TGT-COLLECTION-PROMOTION
  - Receiver: T6
- [ ] VR-TERM-VERIFY. Independently verify all final criteria
  - Criterion: AC-TERM-VERIFY
  - Proof class: independent verification
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"verification is read-only and preserves evidence","comparison":"final target against SPEC-SVA-20260824-r1","dependencies":["OUTP-T5","all worker-smoke identities"],"environment":"immutable final repository target and disposable live fixtures","fixtures":["all applicable SVA fixtures","selected collection branch fixtures"],"inputs":"all AC-SVA, AC-COL, gate, and cutover recipes","isolation":"fresh decorrelated verifier context","scenario":"rerun fresh criterion proof and aggregate once","surface":"final single lineage"}`
  - Evidence form: one criterion table and aggregate VERIFIED Handoff with exact target/rule/recipe manifests
  - Target recheck: TGT-VERIFY-RECEIPT
  - Receiver: T7
- [ ] VR-TERM-REVIEW. Review the exact VERIFIED target once
  - Criterion: AC-TERM-REVIEW
  - Proof class: review
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"read-only review","comparison":"verified target against Standards and SPEC-SVA-20260824-r1","dependencies":["OUTP-T6"],"environment":"fresh decorrelated original-initial reviewer context","fixtures":["verified evidence index"],"inputs":"whole changed scope and conditional branch","isolation":"reviewer distinct from worker and verifier","scenario":"assess both axes and cross-axis interactions","surface":"final review"}`
  - Evidence form: Standards PASS, Specification PASS, Overall APPROVED, sealed lineages, and one review Handoff
  - Target recheck: TGT-REVIEW-RECEIPT
  - Receiver: T8
- [ ] VR-TERM-LEARN. Produce one terminal curation result
  - Criterion: AC-TERM-LEARN
  - Proof class: other authorized class
  - Scenario / environment / fixture: `{"adapter":"none","cleanup":"no experiment runtime remains; curation follows its own exact restoration rules","comparison":"qualifying candidate versus incomplete, deferred, and nonqualifying intake","dependencies":["OUTP-T7"],"environment":"existing high-consequence terminal assessment","fixtures":["current curation contract cases"],"inputs":"completed Handoff, affected-artifact manifest, complete or incomplete candidates","isolation":"one existing dev-continual-learning task","scenario":"assess once and return the seven-field result","surface":"terminal durable learning"}`
  - Evidence form: CURATED or NO DURABLE LEARNING seven-field result, destination identities and restoration evidence when applicable, and one Common Handoff to backend
  - Target recheck: TGT-LEARNING-RECEIPT
  - Receiver: dev-implementation backend

## Result / Handoff

| Output ID | Producing task | Artifact / identity | Allowed outcomes | Receiver | Handoff contract |
|---|---|---|---|---|---|
| OUTP-T1 | T1 | Exact adapter-module and authoring-target manifest | completed, blocked, failed | T2 | Common Handoff from dev-handoff; Methods none; exact worker smoke and no shipping. |
| OUTP-T2 | T2 | Post-adapter immutable target and collection-baseline manifest | completed, blocked, failed, authority-change-required | T3 | Common Handoff with recipe/doctor/profile identities and every permanent criterion result. |
| OUTP-T3 | T3 | External harness/corpus digest, seeded truth, active pre-manifest, and fresh capability prerequisites | completed, blocked | T4 | Common Handoff; no live discovery or repository experiment bytes. |
| OUTP-T4 | T4 | `assurance-collection-aggregate/v1` plus receipts/finalizer evidence | completed, blocked, transport-unavailable | T5 | Common Handoff; semantic result exactly PASS, FAIL, or INCONCLUSIVE; no promotion effect. |
| OUTP-T5 | T5 | PASS promoted target or FAIL/INCONCLUSIVE equality target, plus cleanup receipt | completed, blocked, failed | T6 | Common Handoff with exact branch, final target manifest, worker smoke, and no experiment residue. |
| OUTP-T6 | T6 | Fresh aggregate verification receipt and Handoff | completed, blocked, failed | T7 | Verifier Common Handoff; VERIFIED required for continuation. |
| OUTP-T7 | T7 | Standards/Specification/Overall receipt and Handoff | completed, blocked, authority-change-required | T8 | Original-initial reviewer Common Handoff; APPROVED required for continuation. |
| OUTP-T8 | T8 | Portable curation identity, seven-field payload, and Common Handoff | completed, blocked | dev-implementation backend | Existing dev-continual-learning Common Handoff; no second envelope or portable owner row. |

The backend validates the exact target, once-bound target/rule manifests, recipes, receipts, counters, branch, cleanup, lineages, repair actions, curation identity, and evidence identities without rerunning criterion proof. It then exposes the existing bounded terminal values to `dev-ask`, with `shipping not authorized` and `Next: none`; this plan creates no presenter task.
The exact papercut ID is only a terminal evidence input and friction-accounting obligation, never a task, stage, method, criterion, or plan effect. Under the existing D24 backend authority, one complete candidate-specific result may settle `pc-ae711c27c4d758b7` exactly once: verified `CURATED` durable correction maps to `fixed`; a candidate-specific final rejection or failed frozen evaluation maps to `rejected`; an authoritative replacement maps to `superseded`. Incomplete, deferred, unrelated, global-only, generic `NO DURABLE LEARNING`, missing original adapter-mutation evidence, or otherwise non-candidate-specific results keep it `open` and preserve ledger bytes.

## Blockers and recovery

| Blocker ID | Owner | Recovery evidence | Affected tasks | Revision / approval boundary | Ready condition |
|---|---|---|---|---|---|
| BLK-AUTHORITY-DRIFT | specification/plan authority | Current exact URI/digest comparison and semantic diff | all | Semantic change requires same-plan revision and native reapproval; unrelated non-target bytes do not. | Every bound authority and affected baseline is current before mutation/dispatch. |
| BLK-MANUAL-HOST | T1 owner | Fresh OMP and Grok inventory/explicit-invocation evidence | T1-T2 | No fallback to broad descriptions, alwaysApply, provider-specific duplicate body, or discoverable wrapper. | Both hosts honor manual non-model invocation and explicit command loading; otherwise stop blocked. |
| BLK-ADAPTER-DRIFT | current task/backend | Baseline/final adapter manifests and rebound recipe identities | T2, T6 | Semantic recipe change returns to authority; byte drift alone cannot be accepted in assurance. | Current digest matches bound recipe, or authorized self-modification has final rebind. |
| BLK-EXPERIMENT-ROOT | T3 owner | Canonical outside-repository path, owner token, no symlink/path escape, and absent destination | T3-T5 | Never adopt or delete an unknown pre-existing root. | New owner-created source/runtime roots are safely established. |
| BLK-EXPERIMENT-CAPABILITY | T4 owner | Fresh provider profile/attestation with unique context IDs and delegation facts | T4-T5 | Missing fresh-context delegation yields sealed INCONCLUSIVE and cleanup; it never changes live topology or gate units. | Required fresh contexts can be launched/observed, or T4 has enough evidence to finalize INCONCLUSIVE safely. |
| BLK-EXPERIMENT-FINALIZER | T5 owner | Active-post manifest, discovery receipt, cleanup inventory, and preserved aggregate/Handoff | T5-T6 | Unknown active bytes/discovery/cleanup forbids promotion and blocks final completion until cleanup/equality is proven; do not infer success. | PASS promotion has no experiment residue, or FAIL/INCONCLUSIVE proves exact collection-baseline equality. |
| BLK-PROMOTION | T5 owner | Sealed PASS with every invariant and one reproduced winning arm | T5 | Thresholds, cap, truth, and units cannot change after observation. | `promotion_eligible:true`; every other result takes the no-active-change branch. |

A T4 `FAIL` or `INCONCLUSIVE` is a completed experiment result, not an implementation failure and not retry authority. T5 must execute its deterministic cleanup/no-promotion branch. A failed finalizer is different: it leaves the task blocked until exact cleanup/equality evidence exists.

## Critical anchors and assumptions

| Anchor ID | Kind | Exact reference | Execution role |
|---|---|---|---|
| ANC-IMPLEMENTATION | skill | `.config/agents/skills/dev-implementation/SKILL.md` — Task Contract, readiness, smoke, manifests, tail, completion | Owns recipe/doctor binding, self-modification rebind, collection scheduling after PASS, and terminal accounting. |
| ANC-VERIFICATION | skill | `.config/agents/skills/dev-verification/SKILL.md` — Intake, Procedure, Verdict, Handoff | Owns fresh criterion proof, drift INCONCLUSIVE, optional initial-pass collectors after PASS, and sole aggregate verdict. |
| ANC-CRAFT | skill | `.config/agents/skills/craft-skill/SKILL.md` — Frontmatter, thin orchestrator, activation, create/update/evaluate | Supplies file-authoring mechanics without taking verification semantics or approval authority. |
| ANC-EXPERIMENT | script pattern | `.config/agents/skills/dev-ask/evals/observe_case.py` — canonical external out-dir, manifests, receipts, sealing | Reuse safety and identity patterns; do not import its binary verdict or opaque target token as the worth gate. |
| ANC-ASSURANCE-ADR | ADR | `docs/adr/0003-bounded-assurance-and-repair.md` — D03, D04, D22 | Preserves repair/review budgets and owns conditional collection semantics if PASS. |

- Official host fact: `omp://skills.md` documents normalized `disable-model-invocation` as hidden from model-facing discovery while remaining available through `skill://` and its explicit skill command; xAI `https://docs.x.ai/llms.txt` documents the same field as explicit slash-command-only for Grok. Runtime behavior still receives fresh verification under BLK-MANUAL-HOST.
- Current repository fact: no exact adapter/wrapper path exists; bootstrap distributes the whole `.config/agents` root, manifest already permits it, and no per-skill registry or bootstrap edit is required.
- Current repository fact: the existing `init-ask` Repository rules and skills row can express on-demand project adapters, so no tenth row is permitted.
- Current repository fact: `pc-ae711c27c4d758b7` has one observation and `resolution:null`; it is evidence-only and currently lacks a complete frozen Learning Candidate.
- Assumptions: none
