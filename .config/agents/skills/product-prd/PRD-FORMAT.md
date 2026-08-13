# PRD Artifact Format

Use this format only after `product-prd` has current route authority, confirmed Product Decision Evidence, an exact target PRD identity or `new`, and the required artifact locations. This reference does not approve product decisions or publication.

## Default file structure

Create product directories lazily:

```text
docs/product/
├── prds/
│   ├── 0001-checkout.md
│   ├── 0002-team-billing.md
│   └── INDEX.md                    # only when navigation across multiple PRDs is useful
└── iterations/
    └── <iteration-id>/
        ├── DECISIONS.md
        ├── PRD-CANDIDATE.md
        └── BASELINE.md             # only when the approved baseline is not recoverable elsewhere
```

Use a repository-declared product-artifact location instead when one exists.

Each published PRD owns one product initiative, capability, or material product change. Do not create one repository-wide `PRD.md`. An iteration targets exactly one PRD identity or `new`; it may reference other PRDs as dependencies.

`INDEX.md` is a navigation registry, not product authority. Create it only after a second published PRD exists or repository convention requires it. List each PRD ID, path, status, current revision, and supersession link. The PRD file remains authoritative if the index drifts.

## Identity and numbering

Published PRDs use sequential filenames:

```text
0001-<slug>.md
0002-<slug>.md
```

The durable PRD identity is `PRD-0001`, independent of its revision. For a new candidate, scan the published directory and assign the proposed next identity and destination before requesting approval. The proposal is not current authority. Recheck it immediately before promotion; a collision or changed destination makes the candidate stale and requires renewed exact approval. Do not encode the revision in the filename.

- A new product initiative or independently consumable product contract gets a new PRD identity.
- An approved refinement of the same product contract updates the same file with a new revision.
- A material replacement with a new product contract gets a new identity and `supersedes: PRD-NNNN`.
- Do not create a PRD for brainstorming, a minor implementation detail, a transcript, or a decision already owned by another current PRD.

Unlike an ADR, a PRD can receive approved revisions while its product-contract identity remains stable. An ADR records why a durable decision was made; a PRD states approved product outcomes, behavior, scope, and constraints. Link applicable `CONTEXT.md` terminology and ADRs instead of copying their content.

## Candidate and promotion

Draft only at the iteration path. Required candidate identity fields are:

```yaml
status: candidate
candidate-revision: <positive integer>
target-prd: new | PRD-NNNN
proposed-prd: PRD-NNNN
proposed-published-path: <exact path>
baseline-prd: none | PRD-NNNN@<revision>
source-iteration: <iteration-id>
decision-evidence: <path and digest>
promotion-effects: <published PRD, supersession, and index files to create or update>
content-digest: <digest>
```

A material confirmed product decision creates a new candidate revision and digest. Interview round count does not.

Promotion requires explicit human approval of the exact candidate revision and digest, proposed identity and destination, and every publication effect. Immediately before promotion:

1. Recheck candidate, decision evidence, target PRD, baseline revision, proposed destination, promotion effects, and published directory.
2. Preserve an exact historical `BASELINE.md` only when the approved baseline is not recoverable from immutable version control or an earlier iteration record.
3. For a new PRD, publish only the approved content at the exact approved identity and path.
4. For a revision, update only the approved target PRD after proving its baseline is current.
5. When a new PRD supersedes another, update the old PRD's status and `superseded-by` field only when that exact delta was included in approval.
6. Record approved revision, supersession, approval evidence, source iteration, and content digest.
7. Create or update `INDEX.md` only when it qualifies and its exact delta was included in approval.

A stale candidate, occupied proposed identity, changed destination, or changed promotion effect cannot promote. Candidate approval does not approve engineering work, publication outside the repository, delivery, or shipping.

## Published PRD template

```markdown
---
id: PRD-NNNN
status: approved | superseded | retired
revision: <positive integer>
supersedes-revision: none | <positive integer>
supersedes: none | PRD-NNNN
superseded-by: none | PRD-NNNN
source-iteration: <iteration-id>
decision-evidence: <path and digest>
content-digest: <digest>
approval-evidence: <exact human confirmation identity>
---

# <Product initiative or change>

## Product problem and evidence
- Problem, affected context, evidence, and why now

## Target users and stakeholders
- User, buyer, operator, or other product roles and priority

## Outcomes and success measures
- Product outcomes, measurable indicators, thresholds, and evaluation window

## Product experience and behavior
- Primary journeys, required behavior, trust expectations, and product failure behavior

## Scope and priorities
- Included scope, priority order, trade-offs, and non-goals

## Product strategy
- Positioning, pricing, business model, launch, or growth only when applicable

## Constraints and dependencies
- Product, customer, legal, privacy, security, operational, financial, and timing constraints
- Related PRDs, canonical domain terms, and durable decisions by reference

## Rollout and learning
- Release approach, instrumentation, feedback, and decision points

## Risks and open decisions
- Risks, mitigations, and nonblocking open decisions with owners

## Engineering handoff
- Observable product outcomes, required behavior, constraints, success measures, and non-goals
- No technical architecture or implementation prescription unless an approved external constraint requires it
```

Omit sections that add no product information. Do not force personas, user stories, an AI section, a fixed release sequence, or arbitrary example thresholds.
