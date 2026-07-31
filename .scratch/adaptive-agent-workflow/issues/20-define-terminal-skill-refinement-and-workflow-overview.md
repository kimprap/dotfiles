Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 14
Status: resolved

## Question

What exact terminal execution-task sequence should run after the complete `eng-flow` skill graph has been implemented, integrated, and initially verified so the result is lean, robust, and truthful before handoff? Decide the duplicate/overlap and separation-of-concerns audit across every involved skill; the refinement authority and deletion/merge criteria; Matt-Pocock-style instruction and frontmatter checks; full positive/near-miss/runtime re-verification; and only then creation of one canonical as-built overview under `.config/agents/skills/eng-flow/` that records purpose, scope, lifecycle, capability ownership, decisions, research, provenance, adapters, and maintenance rules without duplicating executable skill procedures.

Recommended default to evaluate: use `WORKFLOW.md` as the cross-department canonical basename (`<department-flow>/WORKFLOW.md`), with `OVERVIEW.md` as backup. Make the final order: implement and integrate → audit duplicates, triggers, depth, and ownership → refine/merge/delete with clean cutover → re-run the full workflow evaluation matrix on every supported harness → create `eng-flow/WORKFLOW.md` from the verified as-built state → validate its links, source pins, and consistency. The artifact must explicitly reference Matt Pocock's pinned skills/catalog and adapted instruction style, Cursor's agent-swarm model-economics article, and the pinned `cursor/plugins` sources used from `orchestrate`, `cursor-team-kit`, and `continual-learning`; detailed source findings stay linked rather than copied. Skill bodies remain the executable authority, while `WORKFLOW.md` owns the durable architecture/context/provenance overview and is loaded only when understanding or changing the flow.

## Answer

Run one terminal refinement workstream after the complete 28-skill graph has passed initial static, semantic, simulation, and live OMP/Grok conformance. Its job is not to redesign the approved workflow. It proves that the implemented graph expresses the approved contracts once, at the right depth, through precise activation surfaces, and then publishes the verified as-built architecture.

The terminal workstream has four separate authorities:

```text
fresh read-only auditor
  → evidence-backed findings
one refinement owner
  → contract-preserving staged changes
original contract owner or human
  → semantic/authority decisions
fresh evaluators and live adapters
  → final truth verdict
```

The auditor never edits. The refinement owner never silently changes settled inventory, lifecycle, human gates, or stage authority. Evaluators never repair. A semantic conflict returns to the owning specification/decision or the human rather than being hidden as cleanup.

### Preconditions

Do not start terminal refinement until all are true:

- all 28 approved skill directories are installed under `.config/agents/skills/`;
- old names, compatibility aliases, and provider-owned body copies are absent;
- current live references and source/license ledgers pass the migration checks;
- the router-owned static, semantic, simulation, and live-runtime matrix reports `PASS` for one named skill-graph revision;
- both required initial adapters, OMP and Grok, completed every mode/capability they claim;
- the exact initial passing graph and its evidence are available as the rollback target;
- no implementation or migration task is still mutating an affected path.

`FAIL`, `BLOCKED`, missing evidence, or an unnamed target revision returns to implementation. It is not a terminal-audit precondition.

Extend the temporary cutover root without making it discoverable:

```text
.scratch/eng-flow-cutover/
├── pre-terminal/
├── terminal-candidate/
│   ├── skills/
│   └── repo-files/
└── evidence/
    └── terminal-skill-audit.md
```

`pre-terminal/` captures the exact initially passing live revision. `terminal-candidate/` starts as an identity-checked copy of that revision. The audit report is disposable execution evidence, not a second architecture authority.

### Audit universe

Audit activation and structural integrity across all 28 skills:

- directory/frontmatter identity;
- description and trigger surface;
- natural-language and explicit discovery;
- live references and conditional loading;
- duplicate names, aliases, stale paths, and provider copies;
- frontmatter necessity and host support;
- source/license placement.

Deeply audit procedures, lifecycle boundaries, ownership, and handoffs across the 22 workflow-facing skills:

```text
eng-flow
grill-me
grill-with-docs
wayfinder
eng-grilling
eng-domain-modeling
eng-requirements
eng-research
eng-specification
eng-ticketing
eng-implementation
eng-handoff
eng-verification
eng-integration
eng-code-review
eng-shipping
eng-continual-learning
eng-codebase-design
eng-improve-codebase-architecture
eng-prototype
eng-tdd
eng-diagnosing-bugs
```

Inspect the six retained utilities—`craft-name`, `craft-rule`, `craft-skill`, `improve`, `mnemopi-cleanup`, and `mnemopi-retain`—only deeply enough to prove that broad activation or copied procedures do not collide with the workflow-facing graph. Do not refactor their unrelated behavior.

Inspect active scoped rules and OMP/Grok harness material only at their interfaces with shared skills: references, discovery, capabilities, permissions, and adapter-owned transport. They are not additional skill bodies and do not become subjects of unrelated cleanup.

### Canonical ownership test

Every procedure must resolve to one deepest owner:

| Concern | Canonical owner |
|---|---|
| ordinary engineering classification, route overview, approval, first dispatch, changed-route reapproval | `eng-flow` |
| dependency-safe human interview | `eng-grilling` |
| glossary/context/qualifying ADR discipline | `eng-domain-modeling` |
| foggy multi-session decision mapping | `wayfinder` |
| engineering-facing behavior, acceptance, scope, constraints | `eng-requirements` |
| primary-source evidence and optional qualified Atlas coverage | `eng-research` |
| revision-bound engineering specification and test seams | `eng-specification` |
| dependency-wired executable tracer-bullet tickets | `eng-ticketing` |
| execution topology, state, attempts, dependency readiness, smoke aggregation, and terminal evidence | `eng-implementation` |
| cross-session/ownership transfer contract | `eng-handoff` |
| test-first implementation discipline | `eng-tdd` |
| hard-bug and performance diagnosis | `eng-diagnosing-bugs` |
| reusable deep-module design vocabulary | `eng-codebase-design` |
| architecture survey and approved improvement route | `eng-improve-codebase-architecture` |
| decision-fidelity prototype detour | `eng-prototype` |
| fresh claim-first truth verification | `eng-verification` |
| neutral multi-lineage fan-in and mechanical conflict handling | `eng-integration` |
| final Standards and Specification review | `eng-code-review` |
| explicitly authorized commit/push/PR/release/deployment and complete-check-set CI recovery | `eng-shipping` |
| terminal project-scoped durable-learning assessment | `eng-continual-learning` |
| expert interview entry | `grill-me`, delegating without copying |
| expert interview plus approved domain-artifact entry | `grill-with-docs`, delegating without copying |

Wrappers, router, and backend may state when and why to invoke an owner, the input contract, and the expected return. They may not restate the owner's operating procedure.

### Required audit passes

#### Identity and activation

- names are kebab-case, at most 64 characters, and exactly match directory basenames;
- descriptions are at most 1024 characters and state both the concrete job and when to use it;
- descriptions preserve decisive trigger nouns while distinguishing positive cases from near misses;
- `eng-flow` is the broad ordinary-engineering default without absorbing explicit expert or utility intent;
- direct stage invocation remains possible when the user intentionally names a valid capability;
- expert wrappers do not compete as alternate end-to-end routers;
- no retained utility accidentally captures ordinary flow, architecture, diagnosis, review, or learning requests;
- explicit invocation and natural-language discovery agree with the final installed inventory on OMP and Grok.

#### Duplicate behavior and depth

- one canonical owner implements each procedure;
- router and wrappers are shallow by design; stage owners and the implementation backend are deep enough to be useful;
- `eng-flow` contains no stage procedure, task graph, retry machine, or completion aggregator;
- `eng-implementation` contains orchestration/state semantics but not copied TDD, diagnosis, verification, integration, review, shipping, or learning procedures;
- smoke proof belongs to the worker/backend completion contract;
- CI recovery belongs to shipping;
- merge/conflict convergence belongs to neutral integration;
- Standards/Specification review remains independent from verification and shipping;
- research informs decisions but never owns product or engineering decisions;
- continual learning curates settled evidence but never owns architecture or user-level guidance;
- no sibling repeats generic approval, verification, retry, handoff, integration, or completion boilerplate that a deeper owner already defines.

#### Lifecycle and handoff integrity

- every transition names its authority, required input, output, stop condition, and next owner;
- Task Contract, Context Pack, Handoff, attempt identity, and immutable target semantics remain consistent across callers;
- no stage can bypass product, architecture, scope, destructive, test-seam, ticket-publication, route, escalation, or shipping approval;
- single-owner execution remains the default;
- dependency-independent batch and full orchestration triggers remain narrow and explicit;
- worker, verifier, integrator, reviewer, shipper, and curator permissions remain non-overlapping;
- fallback never silently weakens authority, user-work safety, evidence, or verifier independence.

#### References, scripts, metadata, and provenance

- every bundled reference is linked directly from its owning `SKILL.md` with an exact read condition;
- every script provides repeated deterministic value that is clearer and safer than inline agent work;
- every eval is owned at the narrowest valid level and does not duplicate the router's cross-stage suite;
- assets and examples prevent a demonstrated error rather than decorate the package;
- optional frontmatter fields carry real portable or verified adapter signal;
- provider-specific fields, commands, model bindings, state paths, and transports remain in adapters;
- every live link resolves and every old skill-name reference is either migrated or proven historical/domain data;
- substantial copied source material has its sibling MIT notice and immutable source identity;
- independently expressed behavior does not receive inaccurate blanket licensing.

#### Safety and authority

- no workflow role, hook, skill, rule, eval, reference, or adapter may modify user-level `AGENTS.md`;
- project-guidance writes remain narrowly owned by the continual-learning curator and require qualifying settled evidence;
- unrelated user work is preserved;
- no cleanup grants commit, push, PR, release, deployment, credential, provider-account, destructive, or migration authority;
- no style compression removes a rationale needed to preserve a fragile safety or authority boundary.

### Finding contract

Record each finding in `.scratch/eng-flow-cutover/evidence/terminal-skill-audit.md` with:

- stable finding ID;
- category and severity;
- exact target path(s);
- observed evidence;
- canonical owner and governing decision/contract;
- duplicated, missing, stale, shallow, or over-broad behavior;
- proposed `KEEP`, `COMPACT`, `MOVE`, `MERGE`, `DELETE`, or `ESCALATE` disposition;
- whether the change is mechanical or semantic;
- affected trigger/eval families and required proof;
- final disposition and target revision.

Use three severities:

- **BLOCKING** — violates inventory, authority, safety, ownership, discovery, dependency, evidence, portability, licensing, or a hard instruction-quality contract.
- **REQUIRED CLEANUP** — contract-preserving duplication, stale material, shallow pass-through detail, unresolved references, or needless support files that make the graph less truthful or maintainable.
- **ADVISORY** — wording or presentation polish that does not obscure behavior or ownership.

All blocking and required-cleanup findings must close. Every advisory receives an explicit `APPLIED` or `RETAINED` disposition with a short reason; advisories are never silently ignored or allowed to drive semantic rewrites.

### Merge and deletion authority

The refinement owner may perform a contract-preserving move, merge, compaction, or deletion only when all are true:

1. the kept canonical owner exists in the final inventory and is proven loaded;
2. the removed material has no unique authority, safety gate, trigger noun, edge case, output contract, or provider-neutral fallback;
3. any unique useful detail moves to the canonical owner before the duplicate disappears;
4. every caller, wrapper, rule, reference, eval, and description migrates in the same staged change;
5. no observable lifecycle or user-facing invocation contract changes;
6. source/license obligations remain accurate after the move;
7. deterministic checks and affected behavioral cases cover the cutover;
8. the final graph contains no alias or dead path.

Delete a reference when its unique conditional detail is absent, obsolete, duplicated, or cheaper and clearer inline. Delete a script when it is unused, one-off, environment-specific, nondeterministic without value, or duplicates clearer agent/tool behavior. Delete metadata when the target harness does not support it or it carries no verified discovery/permission signal.

Do not remove or rename any of the approved 28 skill directories, change public stage ownership, widen or narrow the lifecycle, weaken a human/safety gate, or alter a semantic contract under cleanup authority. Those changes require explicit human approval and a revised governing specification/inventory decision.

When evidence cannot distinguish redundancy from a unique contract, retain the material and escalate. Destructive uncertainty is not a reason to guess.

### Matt-Pocock-style instruction gate

Apply a hybrid gate: behavioral clarity is hard; subjective prose polish is advisory.

Hard requirements:

- minimal valid frontmatter;
- `name`/directory equality;
- description states what and when with non-overlapping trigger boundaries;
- one concrete job and one canonical owner per skill;
- one clear default, with alternatives only as real escape hatches;
- concise imperative procedure close to the action it governs;
- checkable completion for fragile ordered steps;
- no generic motivation, repeated sibling rationale, compatibility prose, or provider transport in shared behavior;
- references loaded only under explicit conditions;
- no unused scripts/references/assets/evals;
- no false-trigger training phrases copied from held-out eval prompts;
- enough rationale to preserve non-obvious safety, authority, and sequencing constraints.

Advisory findings:

- heading preference;
- sentence rhythm;
- optional example compression;
- harmless terminology polish;
- further terseness that does not alter discovery, authority, or execution.

Prefer cuts and clearer ownership over new abstractions. Do not make a precise contract shorter merely to imitate surface style.

### Exact terminal execution sequence

1. **Freeze the passing target.** Name the exact skill-graph revision, adapter profiles, source ledger, initial conformance evidence, and affected live file identities. Stop concurrent mutations.
2. **Capture the pre-terminal rollback.** Copy the exact initially passing live graph and affected references into `pre-terminal/`; verify identities.
3. **Create the terminal candidate.** Build `terminal-candidate/` from the captured passing revision, outside skill discovery.
4. **Run the fresh read-only audit.** Audit all 28 activation surfaces, the 22 workflow bodies, relevant utility boundaries, active rules, and OMP/Grok adapter seams. Produce findings without editing.
5. **Classify authority.** Map every finding to a canonical owner and governing contract. Pre-authorize only contract-preserving cleanup; route semantic or destructive findings to their original authority/human.
6. **Settle merge destinations first.** Before deleting text or files, identify the kept owner, unique behavior to preserve, migrated callers, source/license effect, and proof cases.
7. **Refine leaf owners.** Fix stage-specific bodies, references, scripts, and evals so each deep owner fully contains its unique procedure.
8. **Refine the backend.** Remove copied leaf procedures from `eng-implementation` while preserving topology, state, attempts, dependency, recovery, evidence, and aggregation semantics.
9. **Refine router and expert entries.** Make `eng-flow`, `grill-me`, `grill-with-docs`, and Wayfinder dispatch precisely without restating the downstream procedure.
10. **Refine activation last.** Rewrite descriptions/frontmatter against the resulting behavior, then remove stale references, unused support files, aliases, and obsolete metadata.
11. **Run targeted checks during repair.** Every edit passes its affected static, trigger, state, and behavior cases before the next dependent cleanup. Failed repair follows the settled attempt policy.
12. **Run the complete static/provenance audit.** Prove inventory, names, links, ownership, provider neutrality, user-level `AGENTS.md` prohibition, source notices, and zero unresolved blocking/required findings.
13. **Run the first full terminal matrix.** Against the isolated refined candidate, run static graph checks, all semantic route families/held-out near misses, deterministic backend simulations, fresh semantic evaluation, and every required OMP/Grok live mode/repetition.
14. **Repair only from evidence.** A failure returns to its canonical owner and invalidates affected descendants. After any behavioral, trigger, ownership, or interface edit, rerun affected cases and then the complete matrix. A required unavailable environment remains `BLOCKED`.
15. **Create the as-built overview.** Only after the refined candidate reports full `PASS`, create `terminal-candidate/skills/eng-flow/WORKFLOW.md` from that exact passing revision.
16. **Add the conditional pointer.** Add one short link in `eng-flow/SKILL.md`: read `WORKFLOW.md` only when understanding, auditing, maintaining, or extending the complete flow; ordinary routing does not load it.
17. **Validate the overview.** Deterministically check its structure, inventory, links, source pins, adapter claims, revision identity, and absence of copied executable procedures. A fresh read-only semantic evaluator compares it with the actual candidate bodies and governing contracts.
18. **Revalidate live source identities.** Any drift in the live initially passing graph or affected references invalidates the terminal candidate and returns to reconciliation.
19. **Install the terminal candidate coherently.** Replace the live refined paths, overview, pointer, and reference cleanups as one owned mutation. On failure restore `pre-terminal/`.
20. **Run the final full matrix.** Start fresh OMP and Grok contexts and rerun the complete suite on the resulting live final revision. The extra run is required because the conditional `SKILL.md` pointer changed the graph after the first terminal pass.
21. **Close evidence and clean up.** Require final `PASS`, close every finding, preserve the durable completion/source record, remove temporary audit/candidate/rollback material, and report residual advisories or risks.

If overview wording alone changes after step 20, rerun overview structure/link/semantic consistency checks. If `SKILL.md`, an eval, a reference used at runtime, ownership, trigger, adapter claim, or behavior changes, rerun the full matrix again.

### Re-verification contract

Both terminal full runs reuse the exact suite and gate from [Design routing and orchestration evaluations](13-design-routing-and-orchestration-evaluations.md):

- one static graph/ownership pass per exact revision;
- every router family with positive paraphrases, held-out near misses, and forbidden effects;
- every backend authority/topology/state/retry/fallback/handoff/verification/integration/review/shipping/learning/completion simulation;
- deterministic trace assertions before semantic grading;
- a fresh read-only evaluator with no expected-route leakage;
- three fresh attempts for authority, approval, mutation safety, and routing;
- two fresh attempts for ordinary semantic cases;
- immediate rerun of successful live changed-path smoke;
- timing-sensitive recovery/fan-in repetition when needed;
- every capability claimed by OMP and Grok exercised live;
- no score averaging or majority pass.

Any required `FAIL` fails the candidate. Any required inconclusive or unavailable proof is `BLOCKED`. An advisory cannot override a hard pass or failure.

### Canonical as-built artifact

Use:

```text
.config/agents/skills/eng-flow/WORKFLOW.md
```

`WORKFLOW.md` is the canonical uppercase basename for departmental flow architecture:

```text
<department>-flow/WORKFLOW.md
```

Examples may later include `product-flow/WORKFLOW.md` or `marketing-flow/WORKFLOW.md`, but this effort creates only `eng-flow/WORKFLOW.md`. Do not create `OVERVIEW.md`, a duplicate root document, a generated manifest, `CONTEXT.md`, `CONTEXT-MAP.md`, or an ADR merely to describe this workflow.

`WORKFLOW.md` is an on-demand architecture/context/provenance view. It is not a skill, router prompt, implementation state file, runbook, or substitute for the executable `SKILL.md` bodies. When prose conflicts, the current verified skill/rule/specification contract remains runtime authority; the mismatch makes the workflow-system change incomplete until corrected.

The file uses exactly these top-level sections:

```markdown
# Engineering Flow

## Status
## Purpose and scope
## Interfaces and lifecycle
## Capability ownership
## Contracts and artifacts
## Decisions
## Research and provenance
## Harness adapters
## Evaluation and release gate
## Maintenance
```

#### Status

Record:

- as-built graph identity/revision;
- last fully verified date;
- exact inventory count;
- currently claimed adapters and capability levels;
- final gate outcome;
- durable completion-evidence pointer.

Do not embed transient job IDs, model IDs, raw traces, or disposable reports.

#### Purpose and scope

State:

- the engineering workflow's accepted inputs and destination;
- `eng-flow` as the primary ordinary-engineering interface;
- conditional engineering requirements and the external product-authority boundary;
- direct, specification/ticket, bug, prototype, grill, and Wayfinder lanes;
- explicit non-goals: product discovery/growth flow, provider transport, provider accounts, unpublished Cursor swarm parity, and implicit domain artifacts.

#### Interfaces and lifecycle

Show the lifecycle and gates at low resolution:

```text
classify → approve route → establish missing authority/requirements
→ specify/ticket when needed → implement/smoke
→ independently verify → neutrally integrate when needed
→ final review → continual-learning assessment
→ evidence-backed completion → separately authorized shipping
```

Name stop/resume boundaries and handoff artifacts. Do not reproduce stage procedures.

#### Capability ownership

List:

- the exact 28-skill inventory, split into workflow-facing capabilities and retained utilities;
- one-line authority for each workflow-facing skill;
- thin router, backend, wrapper, and expert-entry relationships;
- one canonical owner for smoke, retry, CI recovery, integration, review, shipping, and learning.

#### Contracts and artifacts

Summarize and link, rather than restate:

- Route Overview;
- Engineering Requirements;
- Engineering Specification;
- executable ticket/task graph;
- Task Contract;
- Context Pack;
- Handoff;
- attempt/recovery state;
- verifier verdict/proof classes;
- integration identity/evidence;
- final review;
- curation outcome;
- completion and shipping evidence.

#### Decisions

Provide a concise decision index: one line per durable architecture/inventory choice with a link to its governing specification, resolved decision record, or durable implementation artifact. Do not paste ticket answers or meeting history.

#### Research and provenance

Record:

- Matt Pocock `skills` commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`, catalog/taxonomy, selected source paths, adapted instruction style, local frontier-round divergence, and folded/rejected inputs;
- Cursor `plugins` commit `91be0f994b5de7a75f4d6f2b3b00958126d9195e`;
- Wilson Lin/Cursor “Agent swarms and the new model economics,” canonical URL and 2026-07-28 access date;
- selected `orchestrate`, `cursor-team-kit`, and `continual-learning` source paths;
- excluded `pstack`, unpublished swarm mechanisms, provider details, and unrelated plugins;
- local adaptations and applicable sibling license notices.

Link detailed findings and immutable primary sources. Do not copy source prose, full research reports, or license text into the overview.

#### Harness adapters

Name:

- the portable semantic boundary;
- OMP and Grok as initially claimed adapters;
- the capabilities each last proved;
- adapter-owned discovery, invocation, model binding, job/state, isolation, recovery, and transport;
- unsupported/unclaimed hosts;
- the rule that a claim changes only after live conformance.

Do not copy concrete model bindings, credentials, or host command syntax.

#### Evaluation and release gate

Link the router-owned eval definitions and state:

- proof layers;
- hard `PASS`/`FAIL`/`BLOCKED` semantics;
- risk-tiered repetition;
- fresh-evaluator independence;
- final verified revision and supported adapters;
- location of durable completion evidence.

Do not embed prompt cases, expected traces, or disposable run logs.

#### Maintenance

State the change contract below and the absolute user-level `AGENTS.md` prohibition.

### Overview maintenance

The owner changing any of these must update `WORKFLOW.md` after the changed graph passes its required verification:

- inventory or public skill identity;
- lifecycle or route boundary;
- capability/stage ownership;
- Task Contract, Context Pack, Handoff, evidence, or completion contract;
- source pin, selected input, local adaptation, exclusion, or licensing status;
- evaluation architecture or release gate;
- claimed adapter or capability support.

The final reviewer checks overview consistency before the workflow-system change is complete. A known mismatch blocks completion of that maintenance/change effort, but does not invent a failure in unrelated ordinary engineering work.

Do not update the overview for:

- ordinary workflow executions;
- application implementation details;
- transient task/run state;
- provider model choices;
- job IDs or logs;
- disposable evaluation reports;
- stylistic edits with no architectural/provenance effect.

The continual-learning curator does not own `WORKFLOW.md` and may only report an architecture candidate to the responsible contract owner. No hook or automatic generator rewrites the overview.

### Terminal completion

The terminal workstream is complete only when:

- all 28 activation/identity surfaces and all 22 workflow procedures were audited;
- every blocking and required-cleanup finding is closed;
- every advisory has an explicit disposition;
- no duplicate procedure, alias, stale reference, broad false trigger, unclear owner, or provider body copy remains;
- frontmatter and instruction hard requirements pass;
- source/license placement remains accurate;
- the isolated refined candidate passed the complete matrix;
- `WORKFLOW.md` was created from that named passing state and its conditional pointer is the only ordinary skill-body reference to it;
- overview structure, links, pins, inventory, adapter claims, and semantics pass deterministic and fresh read-only checks;
- the final live revision passed the complete matrix again on OMP and Grok;
- user-level `AGENTS.md` was not modified;
- temporary terminal audit/candidate/rollback artifacts were removed;
- completion evidence names the final revision, outcomes, advisories, and residual risks.
