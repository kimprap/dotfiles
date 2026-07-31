Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 04, 07, 19
Status: resolved

## Question

How must the implementation backend separate implementer smoke proof, independent verification, neutral integration, and final review against the approved specification and repository standards? Decide when a fresh or decorrelated verifier is required, the portable verifier verdict vocabulary and required observed evidence, integration acceptance and conflict authority, and the conditions that make the overall workflow complete.

## Answer

The backend treats four stages as separate contracts:

```text
implementer smoke proof
→ independent verification
→ neutral integration when multiple lineages exist
→ final Standards/Specification review
```

No stage substitutes for another. A worker's passing test is not independent verification; a verifier's behavior verdict is not code/intent review; a clean merge is not integrated behavior; review prose is not observed proof.

### Evidence is declared before execution

Every observable acceptance criterion states:

- the falsifiable claim;
- relevant condition/input;
- expected behavior, metric, or threshold;
- minimum sufficient proof class;
- target surface/environment;
- whether baseline/treatment comparison is required.

The worker and verifier may choose the smallest concrete command/scenario that satisfies the criterion, but cannot lower its proof requirement. Missing or invalid acceptance returns to the specification/ticket owner rather than being invented during verification.

### Implementer smoke proof

Every implementation task must exercise its narrow changed path against the exact produced revision before handoff.

The worker records:

- scenario/command actually run;
- environment/fixture and relevant inputs;
- expected versus observed behavior;
- exact target revision;
- meaningful output, artifact, measurement, or screenshot reference;
- whether a passing result was rerun for flake risk;
- failures, missing environments, and residual uncertainty.

For bug fixes, rerun the original red-capable reproduction after repair. For performance/resource claims, compare like-for-like baseline and treatment. For UI/API/CLI/system behavior, exercise that user-visible surface when available rather than substituting compilation.

The worker may return blocked or failed evidence. It cannot issue the independent verdict on its own target.

### Independent-verifier gate

A fresh independent verifier is required for:

- new or changed observable behavior;
- bug fixes and regression claims;
- APIs, schemas, shared interfaces, or compatibility contracts;
- security, privacy, permissions, authentication, or authorization;
- data/storage changes, migrations, destructive operations, or external effects;
- concurrency, recovery, reliability, performance, or resource claims;
- uncertain, flaky, environment-sensitive, or disputed implementer proof;
- every output that passed through multi-lineage integration;
- any governing task/specification that explicitly requires it.

It may be skipped only for demonstrably nonbehavioral mechanical work such as prose/comments, formatting-only edits, or exact generated refreshes whose deterministic identity/validation check proves the intended transformation. The backend records the skip reason, exact revision, and identity/validation evidence. “Small change” alone is not a skip criterion.

### Verifier independence

Required verification uses:

- a separate role and attempt;
- a fresh context without the worker's reasoning transcript;
- the exact immutable target revision;
- governing acceptance and required proof classes;
- read-only authority over the target;
- observed execution evidence rather than trust in worker claims.

A different model/provider is optional adapter policy, not a portable requirement.

Use decorrelated verification and review attempts for:

- high-consequence security/data/migration/permission/destructive work;
- broad or ambiguous changes;
- multi-lineage integration;
- repeated implementation or verifier failure;
- work where one lens could bias the other;
- an explicit governing requirement.

Decorrelation may use a different context, model capability profile, tool/evidence surface, or reviewer lens. It never weakens the fresh-context/read-only requirements.

### Portable verdict vocabulary

Truth verdict and proof mechanism are orthogonal.

Exact verifier verdict:

```text
VERIFIED
NOT VERIFIED
INCONCLUSIVE
```

Proof classes, one or more per criterion:

```text
live-behavior
targeted-test
regression-suite
measurement
build-typecheck
static-inspection
external-observation
identity-check
```

Definitions:

- `live-behavior` — exercised the actual UI, CLI, API, service, device, or user-visible flow.
- `targeted-test` — a focused automated check reached the changed behavior.
- `regression-suite` — a broader suite established relevant non-regression.
- `measurement` — comparable baseline/treatment artifacts established a metric/threshold claim.
- `build-typecheck` — compilation, schema validation, static typing, or equivalent build validity.
- `static-inspection` — source/diff/config review without runtime execution.
- `external-observation` — CI, deployed environment, monitoring, or a qualified human/external system observed the result.
- `identity-check` — deterministic content/tree/digest comparison established a mechanical transformation.

Proof classes are not one universal strength ladder. `build-typecheck` is sufficient for a typing-only change but insufficient for runtime behavior; `live-behavior` may prove one path while a regression suite covers broader invariants. Each criterion's declared claim determines sufficiency.

Verdict rules:

- `VERIFIED` — every required criterion was observed at sufficient proof, the environment/target identity is valid, and no evidence contradicts acceptance.
- `NOT VERIFIED` — at least one required criterion was observed not met or missed its declared threshold.
- `INCONCLUSIVE` — no required criterion is demonstrated false, but one or more remain unproven because evidence, environment, baseline, target identity, or capability is invalid/missing/confounded.

A passing build, static review, worker claim, or absent failure never upgrades insufficient evidence to `VERIFIED`. An environment blocker is `INCONCLUSIVE`, not a weak pass. Any target revision change invalidates the verdict until impact is assessed and required proof reruns.

### Verifier handoff

The common Handoff includes:

```markdown
## Verification verdict
VERIFIED | NOT VERIFIED | INCONCLUSIVE

## Target
- Exact task and output revision
- Governing acceptance/specification revision

## Execution
- Scenario/command
- Environment/fixtures/inputs
- Observed output/artifact

## Criterion evidence
- Criterion
- Proof class(es)
- Expected
- Observed
- Met | Not met | Unproven

## Confounds and residual risk
- Missing/invalid evidence
- Flakes, environment limits, baseline differences
- Adjacent findings
```

Evidence references should be minimal, reproducible, non-secret, and preserved long enough for review/recovery. Raw logs or sensitive artifacts are not copied merely for volume.

### Verification failure

- `NOT VERIFIED` returns the target to its implementation owner under the settled retry policy.
- `INCONCLUSIVE` returns the exact missing capability/environment/evidence prerequisite; it does not consume an implementation retry unless implementation actually failed.
- Invalid or contradictory acceptance returns to the governing specification/ticket owner.
- The verifier reports and reproduces; it never repairs.
- Any repair creates a new target revision and requires fresh verification of every affected criterion.

### Neutral integration prerequisites

An integration task starts only when:

- every required input lineage has an exact identity;
- every input has its required `VERIFIED` verdict;
- the integration task names all inputs, ordering/precedence, mechanical conflict authority, acceptance, and proof;
- no input is stale, blocked, partial, failed, or diagnostic-only.

The integrator may resolve only semantics-preserving mechanical conflicts already allowed by its Task Contract. Shared-interface, behavior, data, ordering, product, architecture, scope, or acceptance conflicts stop and return to their authority owner.

### Integration evidence

The integrator produces:

- exact input revisions;
- combined output revision;
- conflicts encountered and each permitted resolution;
- explicit confirmation that no lineage was dropped;
- integrated smoke scenario and observed result;
- affected criteria and recommended proof reruns;
- unresolved semantic conflict or risk.

Individually verified inputs are necessary but not sufficient. Combination creates a new target revision.

After fan-in, an independent verifier checks:

1. integration-specific acceptance;
2. every input criterion whose behavior could be affected by combination;
3. shared interfaces, ordering, migrations, startup/build, or cross-slice paths touched by integration;
4. required regression/CI checks from the project/task contract.

Unchanged criterion evidence may be referenced only after an explicit impact analysis establishes that integration could not affect it. A textual merge, clean compile, or individually passing branches alone cannot produce a verified integrated result.

### Final review

Final review is read-only and targets the exact verified single-lineage or post-integration revision plus its governing artifacts.

It reports two independent axes:

```text
Standards: PASS | FAIL | INCONCLUSIVE
Specification: PASS | FAIL | INCONCLUSIVE
Overall: APPROVED | CHANGES REQUIRED | INCONCLUSIVE
```

**Standards** checks:

- applicable repository rules;
- correctness, security, privacy, data-loss, reliability, and regression risk;
- maintainability issues material to the change;
- unsafe operations, bypassed checks, or unrelated modifications;
- quality of tests/evidence at the actual seam.

**Specification** checks:

- every approved requirement/acceptance criterion;
- omissions and partial implementation;
- scope creep or silently changed product/architecture intent;
- interface/compatibility and migration decisions;
- required approvals and out-of-scope boundaries.

Finding severity:

- `blocking` — specification nonconformance; correctness/security/privacy/data-loss/regression risk; violated applicable project rule; stale/unverified/incomplete evidence; unauthorized scope/destructive behavior.
- `advisory` — nonrequired maintainability, naming, style, or future improvement that does not threaten the approved behavior or standards.

Any blocking finding yields `CHANGES REQUIRED` or `INCONCLUSIVE` and returns to its owner. Reviewers do not repair. Advisory findings may remain only when explicitly recorded in residual risk; they do not become hidden follow-up promises.

### Proportional review separation

For a low-risk single-lineage change, one fresh non-implementer may perform verification and final review in the same attempt if it emits separate verdict/evidence and Standards/Specification results.

Use separate decorrelated attempts when:

- the work is high consequence;
- multiple lineages were integrated;
- the diff or authority is broad/ambiguous;
- verification/review previously failed;
- one lens could anchor or bias the other;
- the governing artifact requires it.

The implementation owner cannot fill either independent role.

### CI and required checks

The Task Contract and repository rules determine the required local/remote check set. Do not impose one universal full suite when a smaller proof is authoritative, and do not narrow away required checks.

For CI-bound delivery:

- inspect the complete required-check set;
- establish and repair one real cause at a time;
- re-evaluate the whole set after every changed revision;
- distinguish deterministic failure, flake, infrastructure blockage, and unrelated failure with evidence;
- never bypass hooks/checks to manufacture green status.

A required failing check blocks completion of the shipping contract. An unavailable or unrelated required check leaves shipping `INCONCLUSIVE`/blocked until the governing authority explicitly resolves it.

### Implementation-completion conditions

The backend may mark local implementation complete only when:

- governing PRD/specification/ticket/task revisions and approvals are current;
- every required task has a valid terminal outcome;
- each worker supplied implementer smoke proof;
- every criterion requiring independent verification is `VERIFIED`;
- each permitted verification skip has recorded deterministic evidence;
- all required multi-lineage inputs were verified, neutrally integrated, and post-integration verified;
- final Standards and Specification review both pass;
- no blocking finding, stale result, partial output, unresolved semantic conflict, failed dependency, or required check remains;
- the terminal evidence index names exact revisions, proof, verdicts, integration lineage, advisories, and residual risks;
- all human-owned decision gates have been satisfied.

Completion is evidence-backed state, not a worker/planner/reviewer claim. The router presents it to the user.

### Shipping boundary

Commit, staging, push, PR creation/update, history rewrite, release, deployment, and rollout are not part of local implementation completion by default.

They occur only when:

- explicitly requested, or required by the approved task/repository contract;
- the relevant repository/destructive authorization exists;
- the adapter can perform them safely;
- their own delivery, CI, rollout, and rollback evidence requirements are satisfied.

If shipping is in the approved scope, the overall shipping contract remains incomplete until those required actions and checks finish. If it is not in scope, the workflow stops after local terminal evidence without silently committing, pushing, opening a PR, or deploying.

### Source synthesis

The portable truth verdict comes from the falsifiable claim discipline in Cursor Team Kit's `verify-this`; proof classes preserve the useful evidence-strength distinction from public Orchestrate without coupling truth to Cursor's `live-ui-verified`/`unit-test-verified`/`type-check-only` transport vocabulary. Matt's separate Standards and Specification review axes remain the final review authority. The resulting contract combines distinct strengths rather than installing overlapping procedures unchanged.
