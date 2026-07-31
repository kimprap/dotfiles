Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 09, 10, 13
Status: resolved

## Question

What exact clean-cutover order, source pinning policy, path-level migration inventory, and acceptance checks should later implementation use to move the current `.config/agents/skills/` graph to the approved router and backend without losing intentional local adaptations or leaving aliases, duplicate behavior, stale references, or undiscoverable skills?

## Answer

Use a non-discovered assembly root and one coherent cutover. Never build the new graph incrementally inside the live canonical skill root.

### Fixed inputs

The implementation specification and every execution task bind to:

- current repository files read from `/Users/kim/.dotfiles` at task start;
- the resolved Wayfinder map and its linked decision tickets;
- Matt Pocock `skills` commit `ed37663cc5fbef691ddfecd080dff42f7e7e350d`;
- Cursor `plugins` commit `91be0f994b5de7a75f4d6f2b3b00958126d9195e`;
- Cursor's canonical “Agent swarms and the new model economics” article as accessed 2026-07-28;
- the exact approved 28-skill inventory and `eng-flow` evaluation contract.

Do not refresh or merge a moving upstream branch during implementation. A newer Matt/Cursor revision is a separate research, compatibility, and approval pass. It cannot silently change accepted local contracts or invalidate held-out evaluation cases.

Current local files are the source of truth for intentional adaptations, including dependency-safe frontier-round `eng-grilling`, harness-neutral Wayfinder research/tracker fallbacks, local architecture/vault guidance, current prototype/TDD/diagnosis behavior, and cross-harness skill names. Upstream is comparison evidence, not overwrite authority.

### Assembly and rollback roots

Use:

```text
.scratch/eng-flow-cutover/
├── pre-cutover/
├── candidate/
│   ├── skills/
│   └── repo-files/
└── evidence/
```

The root is temporary, outside host skill discovery, and never becomes canonical authority. If it already exists, inspect and stop rather than overwrite unknown work.

`pre-cutover/` captures the exact affected live files plus identities/digests before mutation. `candidate/skills/` contains the complete final skill graph. `candidate/repo-files/` contains non-skill live-reference updates such as scoped rules. `evidence/` contains disposable validation reports.

Do not copy secrets, credentials, user-level `AGENTS.md`, unrelated repository state, or provider account data into staging.

Any live drift after the snapshot invalidates the candidate. Re-read the changed source, rebuild the affected candidate output, and rerun staging checks; never overwrite newer user work.

On a hard cutover/runtime failure or required adapter `BLOCKED` result, restore the exact pre-cutover live graph and references. Repair the non-discovered candidate, then attempt a fresh coherent cutover. Never leave an old/new hybrid as the active inventory.

Keep rollback material until terminal refinement, full re-verification, and `WORKFLOW.md` consistency validation all pass. Then remove temporary cutover material as the final cleanup step.

### Exact path inventory

#### Add

Create these canonical directories only at cutover:

```text
.config/agents/skills/eng-flow/
.config/agents/skills/eng-requirements/
.config/agents/skills/eng-research/
.config/agents/skills/eng-specification/
.config/agents/skills/eng-ticketing/
.config/agents/skills/eng-implementation/
.config/agents/skills/eng-handoff/
.config/agents/skills/eng-verification/
.config/agents/skills/eng-integration/
.config/agents/skills/eng-code-review/
.config/agents/skills/eng-shipping/
.config/agents/skills/eng-continual-learning/
```

Every added capability initially has one minimal `SKILL.md`. Add a `references/`, `scripts/`, or local `evals/` entry only when the specification proves that conditional detail, deterministic operation, or unique trigger/behavior case reduces future errors.

`eng-flow/` additionally contains the router-owned shared evaluation definitions:

```text
.config/agents/skills/eng-flow/evals/evals.json
.config/agents/skills/eng-flow/evals/fixtures/
```

Do **not** create `.config/agents/skills/eng-flow/WORKFLOW.md` during assembly or initial cutover. The terminal refinement ticket creates it only from the refined, fully re-verified as-built graph.

#### Rename with full contents

```text
.config/agents/skills/grilling/
  → .config/agents/skills/eng-grilling/

.config/agents/skills/domain-modeling/
  → .config/agents/skills/eng-domain-modeling/
```

Preserve every supporting file while changing directory/frontmatter identity and intended live references. Delete the old paths in the same cutover; no aliases, symlinks, wrappers, or re-exports remain.

The Wayfinder ticket type value `grilling`, prose describing the act of grilling, historical source names, and source citations are not skill-name references and remain when semantically correct.

#### Update retained paths

```text
.config/agents/skills/grill-me/SKILL.md
.config/agents/skills/grill-with-docs/SKILL.md
.config/agents/skills/wayfinder/SKILL.md
.config/agents/skills/eng-improve-codebase-architecture/SKILL.md
.config/agents/skills/craft-skill/evals/evals.json
.config/agents/rules/plan-impl-spec.md
```

Required changes:

- wrappers delegate to `eng-grilling` and, where applicable, `eng-domain-modeling`;
- `grill-with-docs` preserves explicit human approval before qualifying durable artifact writes;
- Wayfinder names the renamed sibling skills while leaving its `grilling` domain value unchanged;
- architecture improvement routes domain writes through the approved `eng-domain-modeling` gate and never creates them automatically;
- craft-skill eval/examples use the final skill identity where they mean the installed discipline;
- plan/spec guidance names the final skills.

Also update every active implementation specification, ticket, rule, eval, example, and runtime reference found by a fresh repository search. Archived plans, closed Wayfinder evidence, source quotations, and historical transcripts remain immutable unless an active executable artifact still depends on the old path.

#### Retain without lifecycle expansion

Preserve these final directories except for source-notice or reference corrections proven necessary by the migration audit:

```text
.config/agents/skills/craft-name/
.config/agents/skills/craft-rule/
.config/agents/skills/craft-skill/
.config/agents/skills/eng-codebase-design/
.config/agents/skills/eng-diagnosing-bugs/
.config/agents/skills/eng-improve-codebase-architecture/
.config/agents/skills/eng-prototype/
.config/agents/skills/eng-tdd/
.config/agents/skills/grill-me/
.config/agents/skills/grill-with-docs/
.config/agents/skills/improve/
.config/agents/skills/mnemopi-cleanup/
.config/agents/skills/mnemopi-retain/
.config/agents/skills/wayfinder/
```

`craft-skill` and `eng-improve-codebase-architecture` have the scoped updates listed above; their remaining procedures are retained.

#### Remove or reject

Final live paths must not contain:

```text
.config/agents/skills/grilling/
.config/agents/skills/domain-modeling/
.config/agents/skills/ask-matt/
.config/agents/skills/router/
.config/agents/skills/flow/
.config/agents/skills/eng-workflow/
.config/agents/skills/eng-product-definition/
.config/agents/skills/implement/
.config/agents/skills/to-spec/
.config/agents/skills/to-tickets/
.config/agents/skills/eng-orchestrate/
.config/agents/skills/eng-smoke-test/
.config/agents/skills/eng-ci-recovery/
.config/agents/skills/eng-resolving-merge-conflicts/
.config/agents/skills/eng-review-and-ship/
```

Do not install source-repository plugin roots, provider-specific copies, generated semantic wrappers, or a parallel versioned skill root.

### Final inventory

The canonical root contains exactly these 28 skill directories:

```text
craft-name
craft-rule
craft-skill
eng-code-review
eng-codebase-design
eng-continual-learning
eng-diagnosing-bugs
eng-domain-modeling
eng-flow
eng-grilling
eng-handoff
eng-implementation
eng-improve-codebase-architecture
eng-integration
eng-prototype
eng-requirements
eng-research
eng-shipping
eng-specification
eng-tdd
eng-ticketing
eng-verification
grill-me
grill-with-docs
improve
mnemopi-cleanup
mnemopi-retain
wayfinder
```

Every directory contains exactly one canonical `SKILL.md`, and every frontmatter `name` equals its directory basename.

### Source provenance and license policy

Write final procedures independently from the settled local contracts. Do not copy article prose or graphics; the Cursor article does not provide a reusable code/text license.

Maintain a source ledger in the implementation specification until the verified as-built ledger moves into `eng-flow/WORKFLOW.md`. For every skill, record:

- local owning decision/contract;
- upstream repository/path and immutable commit when used;
- which behavior was adapted, folded, rejected, or locally changed;
- whether final text/code is independent or contains a substantial copied portion.

Compare all Matt/Cursor-derived current and new files against the pinned source before cutover. When a final skill retains substantial copied text or code, add a sibling:

```text
.config/agents/skills/<skill>/LICENSE.md
```

It contains the applicable full Matt Pocock and/or Cursor MIT copyright and permission notice, plus source repository/path/commit. A skill drawing substantially from both carries both notices.

Do not add `LICENSE.md` merely because a source inspired independently written behavior. Provenance still belongs in the final `WORKFLOW.md`, but inaccurate blanket licensing is noise.

### Exact cutover sequence

1. **Collapse the map first.** Produce and approve one engineering specification, then dependency-wired implementation tickets. No skill migration begins from the raw decision map.
2. **Capture live authority.** Read the current 16-skill graph, affected rules/references, current OMP/Grok configuration, and user changes; record identities in `pre-cutover/`.
3. **Assemble renamed primitives.** Build staged `eng-grilling` and `eng-domain-modeling` from the live copies, preserving supporting files and applying only approved identity/artifact-gate changes.
4. **Assemble leaf authorities.** Build requirements, research, specification, ticketing, handoff, verification, integration, code review, shipping, and continual-learning skills.
5. **Assemble execution depth.** Build `eng-implementation` around the settled Task Contract, Context Pack, Handoff, state, retry, fallback, verification, integration, and completion contracts without duplicating leaf procedures.
6. **Assemble the primary interface.** Build thin `eng-flow` classification/approval/dispatch behavior last, against the actual staged capability names; add the shared eval matrix and fixtures, but not `WORKFLOW.md`.
7. **Apply staged live-reference edits.** Update wrappers, Wayfinder, architecture improvement, craft-skill evals, scoped rules, and active execution artifacts.
8. **Audit staging.** Prove exact inventory, frontmatter, links, ownership, source/license ledger, provider neutrality, user-level `AGENTS.md` exclusion, and no rejected paths or duplicate bodies.
9. **Exercise staging in isolation.** Run deterministic graph/state checks and representative router/near-miss cases without changing live host discovery.
10. **Revalidate live sources.** Compare every captured identity with the current repository. Drift returns to assembly; no stale candidate installs.
11. **Cut over coherently.** Install all additions, both renames, all reference changes, and both old-path removals as one owned mutation. Do not combine it with unrelated repository edits.
12. **Reload fresh host inventories.** Existing processes may cache old skills. Start fresh OMP and Grok contexts and prove the canonical project root discovers the final names with no old names.
13. **Run initial conformance.** Execute the full resolved evaluation layers against OMP and Grok for every capability each claims, including live changed-path smoke and required repetitions.
14. **Rollback on non-acceptance.** Any hard failure or required `BLOCKED` host restores the exact pre-cutover graph; repair staged output and repeat from revalidation.
15. **Enter terminal refinement.** Only after initial conformance passes, resolve and execute the terminal duplicate/trigger/depth/ownership/Matt-style refinement task, rerun the full matrix, and then create/validate `eng-flow/WORKFLOW.md`.
16. **Clean temporary state.** Remove cutover staging/rollback material only after terminal re-verification and overview consistency pass.

Commit, push, PR, release, and deployment remain separately authorized shipping actions. The migration does not stage or ship itself. If staging is later requested, use the repository's `dot-add` allow-list mechanism for `.config/agents`; never broad raw Git staging.

### Harness support

The first release claims **OMP and Grok** support. Their existing configuration files remain user-owned adapter inputs:

```text
.config/agents/harnesses/omp/config.yml
.config/agents/harnesses/grok/config.toml
```

No configuration edit is assumed merely to install shared skills. Live capability/profile evidence decides whether the existing adapters are sufficient. If either host needs new provider-specific mapping, invocation metadata, or recovery transport, stop and add the smallest explicit task under that host's existing harness directory; never patch shared `SKILL.md` behavior to satisfy one host.

Both hosts must prove native discovery and every capability they claim. OMP/Grok account, permission, runtime, or service unavailability is `BLOCKED` and prevents the initial dual-host support claim. Cursor, Claude Code, Codex CLI, and other hosts remain unclaimed until their own thin adapter passes the same suite.

### Acceptance

#### Structure and identity

- exactly 28 canonical skill directories;
- frontmatter names match directory names;
- only `.config/agents/skills/` owns shared bodies;
- no rejected path, alias, old rename source, broken link, or unresolved live reference;
- no duplicate semantic body in a harness directory;
- staging and rollback roots are absent after final completion.

#### Behavior and ownership

- `eng-flow` remains thin, stateless, and read-only before route approval;
- `eng-requirements` never performs product strategy;
- `eng-implementation` defaults to one owner and contains orchestration state without duplicating leaf authorities;
- planners, workers, verifiers, integrators, reviewers, shippers, and curators preserve their settled permissions;
- wrappers and expert entry points enter the same graph;
- smoke, CI recovery, conflict resolution, review, shipping, and learning each have exactly one deep owner.

#### Safety and authority

- no automated path modifies user-level `AGENTS.md`;
- unrelated and pre-existing user work is preserved;
- no credential, provider-account, destructive, or shipping action occurs without its own authority;
- failure/rollback preserves exact pre-cutover state rather than discarding user work;
- human product, architecture, scope, and destructive decisions remain external authority.

#### Provenance

- all implementation inputs use settled immutable pins;
- every source-derived skill has a complete adaptation ledger;
- substantial copied text/code has the applicable sibling `LICENSE.md`;
- no unlicensed substantial Cursor article prose/graphics is copied;
- final `WORKFLOW.md` explicitly cites Matt skills, the Cursor article, Cursor plugin sources, local adaptations, and rejected/folded inputs.

#### Verification

- staging static/simulation checks pass before cutover;
- fresh OMP and Grok inventories show all final names and no old names;
- every hard case in the router-owned suite passes on every required repetition and claimed capability;
- fresh verifier and neutral-integration contracts are observed, not self-reported;
- initial conformance passes before terminal refinement;
- the refined graph passes the full matrix again before `WORKFLOW.md` creation;
- `WORKFLOW.md` describes the final observed inventory and behavior, and all of its links/source pins resolve.
