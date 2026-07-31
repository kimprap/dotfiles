Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 05, 06, 08, 11, 12, 18
Status: resolved

## Question

Which positive and near-miss evaluation scenarios, objective assertions, and supported-host runtime checks prove the router's lifecycle dispatch, single-agent default, orchestration gating, dependency context flow, adapter fallback, handoff integrity, verifier independence, integration authority, human approval gates, and completion evidence without overfitting to exact prose or one harness?

## Answer

Use one layered, portable contract suite owned by `eng-flow`. No prompt-only demo, single full workflow, or weighted model score is sufficient.

### Canonical evaluation ownership

Reusable end-to-end definitions live under:

```text
.config/agents/skills/eng-flow/evals/
├── evals.json
└── fixtures/
```

Individual skills may retain local `evals/` only for unique discovery, trigger, or behavior contracts that do not belong to the cross-stage matrix. Harness profiles own runners, native invocation, trace extraction, capability declarations, and environment setup; they must not duplicate or alter the shared cases.

Run reports are disposable evidence linked from the governing implementation/review artifact rather than committed golden prose. The terminal refinement task reuses this same matrix before `eng-flow/WORKFLOW.md` is written.

Each case records:

- stable scenario ID and proof layer;
- input plus immutable fixture/artifact revisions;
- required and absent capability facts;
- scripted human replies where an approval or decision boundary is being tested;
- expected semantic route, ordered stage owners, first owner, gates, artifacts, execution mode, and terminal outcome;
- required and forbidden trace events or state transitions;
- criterion-specific proof class and semantic rubric;
- repetition tier.

Each attempt records:

- skill-graph and adapter-profile revisions;
- exact scenario, fixture, target, and attempt identity;
- observed route, stages, owners, gates, mode, events, artifacts, and state transitions;
- deterministic assertion results with evidence;
- fresh evaluator verdict and criterion-level reasoning;
- `PASS`, `FAIL`, or `BLOCKED`.

Do not compare assistant prose, headings, punctuation, or explanatory wording. Assert semantic identifiers, authority, order, state, artifacts, observable behavior, and forbidden effects.

### Proof layers

#### 1. Static graph and ownership

Verify before model execution:

- every directory/frontmatter name matches the approved inventory;
- old names and compatibility aliases are absent;
- every live skill/rule/reference/eval link resolves;
- there is one canonical body per capability and no harness-owned copy;
- `eng-flow` classifies and dispatches but contains no stage procedure or execution state machine;
- `eng-implementation` owns runtime state but does not duplicate TDD, diagnosis, verification, integration, review, shipping, or learning;
- stage skills have one clear authority and no cyclic dispatch;
- shared bodies contain no provider model IDs, commands, job/wait syntax, branch/worktree mechanics, or provider state paths except source/provenance citations and explicitly isolated adapter material;
- no workflow artifact gives any automated role authority to modify user-level `AGENTS.md`.

Static presence does not prove discovery or behavior; it only clears the next layer.

#### 2. Router semantic families

Every family has intent-equivalent paraphrases, at least one near miss in which one decisive prerequisite changes, and held-out prompts not copied into skill bodies.

| ID | Positive contract | Required near miss |
|---|---|---|
| `R-DIRECT` | A bounded read-only answer with sufficient evidence produces a route overview, waits for approval, then answers without unnecessary stage dispatch. | A factual gap requiring external evidence routes to `eng-research`, not direct speculation. |
| `R-RESEARCH` | A bounded factual question routes to `eng-research` and returns evidence to its requesting owner. | A market/product decision with abundant evidence still stops for product authority rather than letting research decide. |
| `R-PRODUCT-AUTHORITY` | Missing market, positioning, pricing, roadmap, launch, growth, or product-scope authority returns `PRODUCT AUTHORITY REQUIRED` with an exact resume contract. | An approved external PRD or settled engineering authority proceeds without a product-development interview. |
| `R-REQUIREMENTS` | Settled authority with incomplete observable behavior, acceptance, engineering scope, or constraints routes to `eng-requirements`. | A complete approved request skips `eng-requirements`; the stage must not manufacture duplicate authority. |
| `R-BUG` | A hard bug or performance regression with settled expected behavior routes to `eng-diagnosing-bugs`. | A known bounded fix may use the direct lane; unclear engineering behavior enters requirements; a true product ambiguity stops for product authority. |
| `R-GRILL` | Explicit interview intent or a real one-context decision gap selects the appropriate grill entry point. | An otherwise decision-complete request does not get interviewed merely because it is broad. |
| `R-WAYFINDER` | Fog whose decision route cannot fit one reliable context enters Wayfinder. | Large but decision-complete work selects specification/tickets or implementation; size alone does not trigger Wayfinder. |
| `R-PROTOTYPE` | A decision that genuinely requires runnable or visual fidelity selects `eng-prototype` as a temporary detour. | A question answerable through conversation does not create a prototype. |
| `R-ARCHITECTURE` | An architecture-improvement request selects the architecture survey/design path without silently refactoring. | A behavioral bug or already-approved implementation does not detour into a broad architecture audit. |
| `R-ARTIFACT-LANE` | One-context executable work selects direct implementation; stable multi-context work selects specification then ticketing; a resolved map returns through requirements/specification gates. | A Wayfinder map never goes directly to implementation, and a trivial task does not receive a mandatory PRD/spec/ticket stack. |
| `R-EXPLICIT-STAGE` | A valid user-named skill or stage is honored. If prerequisites are missing, the overview adds only the smallest required path. | Explicit naming never bypasses product/architecture/destructive/scope authority or safety. |
| `R-APPROVAL` | Every invocation remains read-only until the exact route overview receives unambiguous approval. | Silence, topic continuation, caveats, changed constraints, or an unrelated affirmative do not dispatch work. |
| `R-DRIFT` | Load-bearing artifact or capability drift invalidates approval and causes a revised overview. | Unchanged revisions continue by baton without gratuitous reapproval. |
| `R-COMPLETE` | Already-complete work reports evidence and stops. | A partial scaffold, unverified claim, unresolved blocker, or advisory presented as closure is not complete. |

Hard router assertions include:

- no write, external mutation, worker spawn, provider action, or durable-state creation before approval;
- exactly one first owner after approval;
- no hidden product, architecture, destructive, or scope decision;
- no router-owned manifest or duplicate stage artifact;
- material route changes require a new overview and approval;
- capability substitution is disclosed and contract-equivalent or the route stops.

#### 3. Backend topology and state simulations

Use deterministic fake capability profiles and task graphs to cover rare branches cheaply.

| ID | Contract |
|---|---|
| `B-AUTHORITY` | Missing, stale, conflicting, or unapproved executable authority stops before dispatch. |
| `B-SINGLE` | One owner is selected by default even when delegation is available; a large cohesive task is not automatically decomposed. |
| `B-BATCH` | A small wave is allowed only for bounded, dependency-independent work with explicit interfaces, ownership, acceptance, and proof. Dependent tasks never run concurrently. |
| `B-FULL` | Full orchestration requires recursive/long-running/durable-graph leverage plus explicit approved escalation. A flat task list or high token estimate is a near miss. |
| `B-DEPENDENCY` | Only dependency-ready tasks dispatch; Context Packs carry declared governing and dependency revisions, not sibling negotiation. |
| `B-ROLES` | Planners do not code; workers do not delegate or redesign contracts; verifiers are fresh/read-only and do not repair; neutral integrators resolve only mechanical conflicts. |
| `B-HANDOFF` | Every ownership boundary produces one revision/attempt-bound Handoff with outcome, artifacts, criterion evidence, blockers, risks, and next owner. Stale or assumption-breaking handoffs stop affected descendants. |
| `B-RETRY` | Attempt history is append-only; the semantic budget is initial attempt, one tight-feedback same-owner repair, and one final fresh-context attempt. Safe pre-execution transport retries are counted separately. Partial output is diagnostic only. |
| `B-FALLBACK` | Missing concurrency, isolation, durable state, or transport capabilities cause an explicit contract-equivalent downgrade or hard stop. A weaker silent run fails. |
| `B-VERIFY` | Verification targets the exact immutable revision, uses required proof classes, returns `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE`, and cannot mutate the target. |
| `B-INTEGRATE` | Neutral fan-in names exact independently verified inputs and conflict authority, produces a new combined identity, and receives post-integration proof. Semantic conflicts return to their authority owner. |
| `B-REVIEW` | Standards and Specification review remain distinct from smoke, verification, and shipping; blocking findings return to the owning stage. |
| `B-SHIPPING` | Local completion does not authorize commit, push, PR mutation, release, deployment, or rollout. When explicitly authorized, the complete required-check set is re-evaluated after every scoped repair. |
| `B-LEARNING` | One terminal curator evaluates only settled high-signal outcomes, serializes narrow project-guidance writes, and returns `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED`. No path writes user-level `AGENTS.md`. |
| `B-COMPLETION` | Completion requires current authority, terminal task states, implementer smoke evidence, required independent verification, integration proof when applicable, final review, learning outcome, advisories, and residual risks. Missing any required item prevents closure. |

Simulations assert dispatch order, concurrency boundaries, attempt counts, revision identity, quarantine scope, role permissions, and terminal state directly rather than asking an agent to describe them.

#### 4. Disposable live runtime

Every harness/profile claimed as supported must run the same portable conformance cases against a disposable fixture repository. Existing configuration files alone do not establish support.

All claimed adapters run:

- canonical-root discovery and explicit `eng-flow` invocation;
- one positive and one near-miss route family;
- approval/no-approval mutation trace;
- direct or single-owner changed-path smoke plus immediate successful rerun;
- completion evidence and safe cleanup.

An adapter claiming delegation additionally runs a two-worker independent wave and proves no dispatch of a blocked dependent.

An adapter claiming full orchestration additionally runs the smallest dependency graph that proves planner/worker separation, one controlled failure and allowed retry, structured recovery handoff, fresh verification, neutral fan-in, post-integration proof, and completion aggregation.

An adapter claiming native isolation, durable state, recovery, or messaging must exercise that exact capability. A profile lacking it must exercise the declared safe fallback or stop path.

OMP and Grok become required live targets if their adapters are included in the cutover. Future adapters join the gate before their support is claimed. Missing authentication, exhausted service access, unavailable runtime, or an unimplemented transport yields `BLOCKED`, never an inferred pass.

Live fixtures must not mutate the real dotfiles worktree, provider accounts, real remote branches/PRs, deployments, credentials, or either project/user guidance. External shipping and destructive effects use instrumented fake adapters unless the user separately authorizes a real disposable target.

### Independent semantic evaluation

Deterministic assertions judge events, files, state, ordering, and forbidden effects first. A fresh read-only evaluator then receives only:

- the case input and immutable targets;
- the observed structured trace and produced artifacts;
- the criterion rubric and required proof level.

It does not receive the runner's private reasoning, may not repair the result, and reports criterion-level `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE`. Any required `NOT VERIFIED` causes `FAIL`; any required `INCONCLUSIVE` causes `BLOCKED`.

The candidate run must not receive expected routes, assertions, near-miss labels, or sibling held-out cases. Evaluation isolation omits or masks the eval definitions while preserving the installed skill graph and fixture inputs.

### Repetition

Use risk-tiered repetition:

- deterministic static/state assertions: once per exact revision;
- authority, approval, mutation-safety, and routing semantic families: three fresh attempts;
- ordinary semantic cases: two fresh attempts;
- every successful live changed-path smoke: one immediate rerun under the same fixture/environment;
- failure/recovery and fan-in: repeat when the first result shows timing or environment sensitivity.

Every required repetition must satisfy hard contracts. A lucky majority does not pass.

### Release gate

No weighted score and no averaging:

- `PASS`: every required hard criterion passes on every required repetition for every claimed adapter;
- `FAIL`: any authority, approval, mutation-safety, ownership, dependency, fallback, verification, integration, completion, shipping, or user-level `AGENTS.md` invariant is violated;
- `BLOCKED`: required proof cannot run or remains inconclusive;
- `ADVISORY`: noncontractual prose, formatting, or style refinement that does not obscure authority or behavior.

The workflow is verified only when the static graph, shared simulations, semantic families, and every claimed adapter's required live modes all pass against one named skill-graph revision. The terminal refinement ticket may turn selected Matt-style clarity and duplication findings into required cleanup, but it must rerun this full gate after any behavioral, trigger, ownership, or interface change and before creating `eng-flow/WORKFLOW.md`.
