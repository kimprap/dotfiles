# Product Development Flow

## Human overview

This workflow turns an unsettled product idea or change into human-approved product authority, then hands that authority to engineering without making technical decisions. It has one external interface, `product-ask`; one round-based decision owner, `product-grilling`; and one durable artifact owner, `product-prd`.

Common routes are:

- sufficient current evidence → direct read-only answer;
- unsettled product candidate → `product-grilling`;
- complete confirmed product authority → `product-prd`;
- unsettled product candidate that needs a PRD → `product-grilling → product-prd`;
- approved PRD ready for engineering → `product-prd → dev-ask`; and
- missing decision-bearing evidence → `PRODUCT EVIDENCE REQUIRED`.

The human product owner retains authority for product strategy, scope, priority, success, and approval. Route approval authorizes the process and artifact locations. It does not approve interview recommendations, a candidate PRD, external research or experiments, engineering work, publication, delivery, or shipping.

## Module design

### `product-ask`

**Interface:** a product request, current authority and iteration identities, and an optional request for a Product Route Overview.

**Implementation hidden behind the interface:** route classification, one compact approval, material reapproval, one first dispatch, and completion presentation.

The module stays thin and stateless. Deleting it would spread route selection and approval rules across every product owner, so it provides leverage and locality without owning product state.

### `product-grilling`

**Interface:** one approved iteration, candidate, target PRD identity or `new`, exact baseline revision, fixed interview scope, current evidence, and one requesting owner.

**Implementation hidden behind the interface:** dependency-ordered product decision trees, complete-frontier rounds, evidence stops, confirmation, resumable decision evidence, and one Product Handoff.

The interview has no explicit round maximum. The finite decision tree is the limit. This keeps the interface small while the implementation handles changing dependencies between product choices.

### `product-prd`

**Interface:** one current iteration, confirmed Product Decision Evidence, one target PRD identity or `new`, the exact approved baseline, fixed artifact locations, and one requesting owner.

**Implementation hidden behind the interface:** candidate drafting, exact approval, stale-baseline detection, sequential identity allocation, historical recovery, revision or supersession, lazy index maintenance, and engineering handoff.

The external seam is the exact approved PRD path and revision named by a Product Handoff. Each PRD owns one independently consumable product contract. Product and engineering callers do not need to know the iteration implementation or unrelated PRDs. This gives callers leverage and keeps candidate history, promotion checks, and revision knowledge local to one module.

## Route and approval model

`product-ask` is the sole product-workflow router. A user can name a leaf skill, but the router validates its prerequisites and adds only the smallest missing product owner.

Before an interview or durable write, it presents `Goal`, `Route`, `Plan`, `Safety`, and `Approval`. The approved route stays current until a material product objective, target-user, scope, route, artifact-location, external-effect, or engineering-handoff fact changes.

Interview rounds, candidate revisions, unchanged Handoffs, and artifact count do not create route approvals. The human separately confirms the final shared interview understanding, then approves the exact PRD candidate, proposed identity and destination, and every publication effect. These prompts settle product authority; they do not repeat route approval.

## Iteration model

Each product iteration uses one stable iteration ID and targets one existing PRD identity and revision or `new`. Other PRDs can be dependencies, not additional mutation targets.

```text
exploring → confirmed → candidate → approved
    └────→ paused | blocked | abandoned
candidate → superseded
```

- Interview rounds do not create iterations.
- Material candidate changes create candidate revisions inside the same iteration while objective, target PRD, and baseline remain current.
- A changed objective, target PRD, or approved baseline creates a new iteration.
- A new independently consumable product contract gets a new PRD identity.
- An approved refinement of the same product contract updates its existing identity with a new revision.
- A material replacement gets a new identity and supersedes the old PRD.
- The approved target revision remains active while a candidate changes.
- Promotion requires explicit approval of the exact candidate revision and digest, proposed identity and destination, and every publication effect.
- A candidate whose baseline changed cannot promote until it is rebound and its product decisions remain valid.
- Abandoned, blocked, and superseded candidates remain history and never become current authority.

This is product-authority state, not execution attempt state. Do not add worker budgets, retry tokens, a router ledger, or an engineering state machine.

## Durable artifacts

Use a repository-declared product-artifact location when one exists. Otherwise create these paths lazily:

```text
docs/product/
├── prds/
│   ├── 0001-<slug>.md
│   ├── 0002-<slug>.md
│   └── INDEX.md                    # only when multiple PRDs need navigation
└── iterations/
    └── <iteration-id>/
        ├── DECISIONS.md
        ├── PRD-CANDIDATE.md
        └── BASELINE.md             # only when the baseline is not recoverable elsewhere
```

- Each published PRD owns one product initiative, capability, or material product change.
- `DECISIONS.md` stores confirmed interview evidence and a resumable open frontier, not a transcript.
- `PRD-CANDIDATE.md` stores the unapproved candidate and its digest.
- A prior approved baseline must remain recoverable from immutable version control, an earlier iteration record, or the conditional historical `BASELINE.md`.
- `INDEX.md` is a navigation registry, not product authority. Create it only after a second published PRD exists or repository convention requires it.

This follows the domain-modeling artifact discipline: create artifacts lazily, keep one owner per durable concern, and require exact human approval before a durable write. A PRD differs from `CONTEXT.md` and an ADR. `CONTEXT.md` owns canonical terms; an ADR records why one qualifying durable decision was made; each PRD owns approved product outcomes, behavior, scope, and constraints. Link those artifacts instead of copying them.

Do not create one repository-wide `PRD.md`. It would mix unrelated product contracts, revisions, and downstream consumers behind one large interface. Only the exact approved PRD file and revision named by a Product Handoff is consumable product authority.

## Product Handoff

Every product owner returns one compact Product Handoff:

```markdown
# Product Handoff: <iteration or task>
## Outcome
- Route approval identity
- Iteration, target PRD, and baseline revision identities
- Outcome: completed | paused | blocked | abandoned | authority-change-required
- Emitting owner
## Progress
- Decisions or artifact state advanced
- Expected progress → observed progress
- Confirmed decisions and unresolved frontier by reference
- Route impact: unchanged | changed
## Artifacts
- Decision evidence, candidate, exact approved PRD path/revision, and optional index identity
- Current authority and stale or historical artifacts
## Evidence and authority
- Human confirmations and source identities
- Missing, conflicting, or stale authority
## Risks and open items
- Product blockers, nonblocking decisions, and affected downstream authority
## Next receiver
- One exact owner
- Required resume condition
## Papercut evidence
- none | one unchanged originating PC-ID, candidate revision, and explicit candidate-specific owner result
```

A Handoff projects authority; it does not create it. Link canonical product artifacts instead of copying them. Use exactly one receiver.

Papercut evidence is non-product evidence. Product owners preserve its optional originating `PC-ID` through the existing Handoff but never read or mutate its ledger. The current leaf owner returns any explicit candidate-specific result to `product-ask`; `product-ask` alone validates the unchanged ID and applies one terminal `fixed | rejected | superseded` settlement through the portable papercut seam. Ordinary `completed`, interview confirmation, PRD or P07 approval, broad/unrelated results, and nonterminal outcomes leave it open without a settlement call. Narrow authority makes no helper call; a helper failure after one attempted procedure performs no successful settlement or retry. Papercut processing never changes the product result or adds product decision, stage, approval, PRD field, or publication authority; exact human approval of product strategy, scope, and PRD effects remains unchanged.

## Engineering seam

Engineering accepts only exact current approved PRD revisions and a Product Handoff. The route is:

```text
product-prd → dev-ask → dev-requirements → dev-specification or dev-implementation
```

`dev-ask` remains the sole engineering router. `dev-requirements` derives observable engineering behavior, acceptance, scope, and constraints. `dev-specification` owns architecture, interfaces, data, migrations, operations, and test seams when needed.

A PRD can state approved external constraints and required product behavior. It must not select technical architecture or implementation. A new approved PRD revision invalidates downstream engineering authority only where its product facts changed; the Product Handoff names known impact without deciding the engineering route.

## Current first-draft limits

The current workflow has no owner for broad customer or market research, product experiments, product analytics implementation, portfolio planning, marketing execution, or launch execution. When one of these is decision-bearing, stop with the exact evidence or authority requirement. Do not invent evidence or create a placeholder owner.

Add a future module only when it has a distinct interface and enough implementation to provide depth. A second adapter must represent real variation, not hypothetical flexibility.

## Design context

This first draft adapts:

- the local engineering flow's thin-router, stable-route, human-authority, and exact-Handoff principles;
- Matt Pocock's round-based grilling pattern: ask the complete current decision frontier, wait, recompute, and continue without an arbitrary round cap;
- the local `dev-domain-modeling` discipline: create durable artifacts lazily, separate canonical terms from decision records, give each concern one owner, and gate exact writes with human approval;
- the useful parts of GitHub Awesome Copilot's PRD skill: discovery for missing information, measurable outcomes, non-goals, AI evaluation when applicable, risks, and section-specific review; and
- deep-module design: one small external workflow interface, one exact approved PRD seam per product contract, and tests or evaluations through that interface rather than internal interview steps.

The workflow rejects a fixed interview-round count, mandatory questions when evidence is complete, technical architecture inside the PRD, arbitrary example metrics, a fixed release sequence, one shared repository-wide PRD, overwriting approved authority with a draft, and an always-growing router-owned state ledger.

Sources are advisory; current local skills and human-approved product artifacts are authoritative:

- [Matt Pocock engineering skills](https://github.com/mattpocock/skills/tree/bfdaef8e989a5c81160e74bc5043bd434da49cac/skills/engineering)
- [GitHub Awesome Copilot PRD skill](https://github.com/github/awesome-copilot/blob/3f0bba475ec40b9680e1d0311b9caffeec5ad4c3/skills/prd/SKILL.md)
