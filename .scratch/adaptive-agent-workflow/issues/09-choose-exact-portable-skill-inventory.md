Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 01, 04, 05, 06, 08, 18, 19
Status: resolved

## Question

Which exact directories under `.config/agents/skills/` should be added, prefixed with `eng-`, combined, updated, retained unchanged, renamed, or removed to realize the settled lifecycle, router, and implementation backend, and which source or local contract owns each retained behavior? Prefer thin orchestration and clean cutover over duplicated procedures, compatibility aliases, or importing every upstream skill.

## Answer

Use `.config/agents/skills/` as the one canonical skill-body root inherited by every configured harness. Do not install shared copies under a harness directory, `.cursor/`, or another provider-owned skill root. Thin harness adapters may carry discovery and presentation metadata, capability detection, and model bindings, but never a second skill body.

The final DX has three levels:

1. **Primary interface:** `eng-flow` is the single documented default for ordinary engineering work.
2. **Expert entry points:** retain `grill-me`, `grill-with-docs`, and `wayfinder` for users intentionally selecting an interview or foggy multi-session planning lane. These are stage overrides, not competing end-to-end routers.
3. **Routable capabilities:** use descriptive `eng-*` skills for reusable engineering lifecycle authorities. They remain directly invocable when a user deliberately pins a valid stage, but the normal path is automatic baton dispatch from `eng-flow`.

“Single interface” therefore means one reliable default, not a portability-dependent attempt to hide every underlying skill from host discovery. Provider UI grouping or visibility is adapter metadata. Shared behavior must not depend on it.

No current `implement` directory exists. Add `eng-implementation` as the separate backend; do not add an `implement` shortcut or compatibility alias.

### Add

Add these exact capability directories:

| Directory | Authority and owned behavior | Primary source ownership |
|---|---|---|
| `eng-requirements/` | Conditional engineering-intake gate that preserves approved external product authority while establishing build-facing behavior, acceptance criteria, scope, constraints, and owned open questions; it stops rather than making market or product-strategy decisions. | Local product-to-engineering bridge in ticket 16, constrained by lifecycle and router authority decisions. |
| `eng-research/` | Primary-source research, cited durable findings, bounded retrieval, and optional qualified Atlas persistence/freshness/lookup coverage. Research informs decisions but does not make them. | Matt `research`, refined by local tickets 15 and 17. |
| `eng-specification/` | Translate approved engineering requirements—and an external product brief or PRD when one governs—into a revision-bound engineering specification with explicit test seams; never redefine product authority. | Matt `to-spec`, refined by local tickets 03, 04, and 16. |
| `eng-ticketing/` | Turn an approved engineering specification into dependency-wired, single-context, demoable tracer-bullet tickets with human approval before publication. | Matt `to-tickets`, refined by local lifecycle, backend, role, and adapter contracts. |
| `eng-implementation/` | The sole implementation backend: validate executable authority, project approved work into Task Contracts, choose single/batch/full execution topology, coordinate dependency-ready work, attempts, recovery, smoke proof, verification, integration, review, learning, and terminal evidence. It orchestrates but does not absorb the independent authorities below. | Local tickets 06, 07, 08, 11, and 12; selected Matt `implement` behavior; selected Cursor `orchestrate` graph/handoff/recovery and smoke behavior. |
| `eng-handoff/` | Redacted cross-session and ownership-boundary transfer that points to canonical artifacts and preserves task revision, attempt, outcome, evidence, blockers, risks, and next owner without dumping transcripts. | Matt `handoff`, constrained by the local Task Contract, Context Pack, Handoff, and failure contracts in tickets 07 and 11. |
| `eng-verification/` | Fresh read-only, claim-first independent verification against the exact target revision, producing `VERIFIED`, `NOT VERIFIED`, or `INCONCLUSIVE` with criterion-specific proof classes. It never repairs its target. | Local ticket 12 plus Cursor `verify-this` and `orchestrate` verifier evidence disciplines. |
| `eng-integration/` | Separately owned neutral fan-in across exact verified inputs, mechanical conflict handling, preservation of both change intents where compatible, authority-owner escalation for semantic conflict, and post-integration proof. | Local tickets 07 and 12; Matt `resolving-merge-conflicts`; Cursor “merges are tasks” and neutral convergence behavior. |
| `eng-code-review/` | Final revision-bound Standards and Specification review, reported independently from behavioral verification and from shipping mutation. | Matt `code-review`, refined by local ticket 12 and Cursor reviewer-handoff evidence. |
| `eng-shipping/` | Explicitly authorized commit/push/PR/release/deployment boundary; reviewer-facing intent/risk/coverage handoff; complete-required-check-set CI recovery with one established cause repaired at a time. It never treats local completion as shipping authority. | Local ticket 12 plus Cursor `loop-on-ci`, `review-and-ship`, and `make-pr-easy-to-review`, with all provider commands in adapters. |
| `eng-continual-learning/` | One neutral terminal curation assessment with `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED`; optional narrow project-guidance writes, serialized conflict handling, tiered evidence, size/staleness controls, and the absolute user-level `AGENTS.md` prohibition. | Local ticket 18 plus the selected Cursor continual-learning updater discipline. |

Also add `.config/agents/skills/eng-flow/` as the single primary router directory. Do not create `ask-matt`, `router`, `flow`, `eng-workflow`, or another compatibility path.

### Rename by clean cutover

| Current directory | Final directory | Required behavior |
|---|---|---|
| `grilling/` | `eng-grilling/` | Preserve the current local dependency-safe frontier-round interview adaptation. Change the frontmatter name and every live skill/rule/specification reference. Do not leave `grilling/` as an alias. The Wayfinder ticket type value `grilling` remains unchanged because it is domain data, not a skill name. |
| `domain-modeling/` | `eng-domain-modeling/` | Preserve glossary/context/ADR discipline but enforce ticket 03: write a qualifying artifact only after explicit human confirmation. Change the frontmatter name and every live reference. Do not leave `domain-modeling/` as an alias. |

The user-level `AGENTS.md` is not a migration target and must never be edited.

### Retain path, with narrow updates

| Directory | Disposition |
|---|---|
| `grill-me/` | Keep as a thin user-invoked expert shortcut; update its delegation to `eng-grilling`. It owns no interview procedure. |
| `grill-with-docs/` | Keep as a thin user-invoked expert shortcut; delegate to `eng-grilling` plus `eng-domain-modeling`, and make explicit that qualifying durable artifacts are written only after human confirmation. |
| `wayfinder/` | Keep its familiar direct invocation and current locally adapted protocol; update skill references to `eng-grilling` and `eng-domain-modeling`. Do not rename it to `eng-wayfinder`. |
| `eng-improve-codebase-architecture/` | Keep its interface; update renamed skill references and remove automatic glossary/ADR writes. It may route qualifying terms or decisions to `eng-domain-modeling`, whose human-confirmation gate owns the write. |
| `craft-skill/` | Keep behavior; update any live eval/example that names the renamed `eng-grilling` skill. |

Update every other live reference discovered during migration, including `.config/agents/rules/plan-impl-spec.md`, active specifications/tickets, wrapper bodies, descriptions, examples, and evaluations. Search distinguishes semantic Wayfinder type values such as `Type: grilling` from skill-name references. Archived plans, source citations, and historical transcripts remain immutable unless they are still active execution authority.

### Retain unchanged

Retain these directories without lifecycle expansion:

- `craft-name/`
- `craft-rule/`
- `eng-codebase-design/`
- `eng-diagnosing-bugs/`
- `eng-prototype/`
- `eng-tdd/`
- `improve/`
- `mnemopi-cleanup/`
- `mnemopi-retain/`

`craft-*`, `improve`, and `mnemopi-*` are cross-cutting local utilities rather than stages in the end-to-end engineering namespace. Existing `eng-*` disciplines remain focused implementation or design capabilities that the router/backend may select without copying their procedures.

### Do not add

Do not create:

- `ask-matt/`, `to-spec/`, `to-tickets/`, `implement/`, `research/`, `handoff/`, `code-review/`, or `resolving-merge-conflicts/`;
- `eng-orchestrate/` — orchestration topology belongs to `eng-implementation`;
- `eng-smoke-test/` — smoke proof belongs to implementer/backend completion;
- `eng-ci-recovery/` — the complete-check-set repair loop belongs to `eng-shipping`;
- `eng-resolving-merge-conflicts/` — conflict resolution belongs to neutral `eng-integration`;
- a combined `eng-review-and-ship/` — review authority and shipping mutation remain separate;
- standalone compiler-check, fix-CI, Cursor plugin, Canvas, SDK, `pstack`, or provider-specific skills.

This is deliberate behavioral adaptation, not source-directory parity. Direct overlap is folded into the deepest existing owner.

### Final inventory shape

After migration, the root contains 28 skill directories: the 16 current capabilities after two renames, 11 added `eng-*` capabilities, and one router whose exact name is still to be chosen. There are no aliases or duplicate skill bodies.

The workflow-facing set is:

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

The remaining retained utilities are:

```text
craft-name
craft-rule
craft-skill
improve
mnemopi-cleanup
mnemopi-retain
```

### Composition rules

- The router owns classification, route overview, approval, first dispatch, and changed-route reapproval. It contains no stage procedure and no implementation runtime state.
- `eng-implementation` owns execution state and coordination. It invokes or delegates independent authorities rather than reimplementing TDD, diagnosis, verification, integration, review, shipping, or learning.
- Expert entry points enter the same graph. They do not fork a second lifecycle.
- A stage skill owns its artifact and gate. Upstream and Cursor sources supply evidence and reusable procedures; the settled local tickets own final semantics.
- Shared skill bodies contain no model IDs, provider commands, job syntax, branches/worktrees, concrete tracker APIs, or harness waiting primitives.
- Prefer independently expressed behavior. If implementation copies substantial Matt or Cursor text/code, retain the applicable pinned-source MIT notice with that material; the migration ticket decides exact provenance placement.

### Migration acceptance carried forward

[Decide local skill migration cutover](14-decide-local-skill-migration-cutover.md) must turn this inventory into a path-by-path order and verify:

- all skill bodies live only under `.config/agents/skills/`;
- both renames update every live reference and remove the old directories;
- no temporary router name or old-name alias remains;
- all 28 frontmatter names equal their directory basenames and are discoverable from each configured harness;
- wrapper and router dispatch reaches the same canonical capability bodies;
- near-miss requests do not activate broad stages;
- artifact writes respect human approval and user-level `AGENTS.md` remains untouched;
- source pins/notices are preserved where substantial copying requires them.
