---
name: product-prd
description: >
  Draft, revise, approve, and hand off a revision-bound Product Requirements Document from
  confirmed product authority. Use only when product-ask dispatches a current product iteration
  with complete decision evidence, or requests engineering handoff of an approved PRD. Skip
  product discovery, unresolved strategy, technical architecture, implementation, and marketing.
---

# Product Requirements Document

Own the durable product-authority artifacts and their publication seam. For one iteration, turn confirmed Product Decision Evidence into one candidate for one target PRD identity or `new`, obtain exact human approval, publish the approved PRD at its own path, and hand that exact revision to `dev-ask` when requested.

## Intake

Require:

- the approved Product Route Overview;
- the stable product iteration ID;
- the current `DECISIONS.md` revision and digest;
- the exact target PRD identity, path, approved revision, and digest, or `new`;
- complete confirmed product decisions for every blocking PRD section;
- fixed scope, non-goals, artifact locations, and one requesting owner.
- optional complete papercut candidate identity and its one immutable originating `PC-ID` from the current Product Handoff, or `none`; this is non-product evidence and grants no PRD authority.

Return unresolved product decisions to `product-grilling`. Stop for stale or conflicting baselines, unconfirmed decisions, unavailable required evidence, or missing human product authority. Do not choose customers, positioning, pricing, priority, scope, success measures, rollout policy, technical architecture, or implementation.

## Artifact seam

Use the repository's declared product-artifact location. Otherwise use the structure in [PRD-FORMAT.md](PRD-FORMAT.md).

Each published PRD owns one product initiative, capability, or material product change at `docs/product/prds/<number>-<slug>.md`. An iteration targets exactly one PRD identity or `new`. The iteration candidate is never product authority.

Create the PRD directory lazily. Create `docs/product/prds/INDEX.md` only when multiple published PRDs need navigation or repository convention requires it. The index is a registry, not product authority. Downstream callers consume the exact human-approved PRD path, identity, revision, and digest named by a Product Handoff.

Before replacing an approved PRD revision, prove its exact content is recoverable from an immutable version-control revision or an earlier iteration record. If it is not, preserve one exact historical baseline inside the current iteration. Label it historical and never current.

## Procedure

1. Recheck the route, iteration, decision evidence, target PRD or `new`, baseline identity, artifact location, and human authority.
2. Read [PRD-FORMAT.md](PRD-FORMAT.md), then draft the complete candidate at the iteration path. Include only confirmed product decisions and cited evidence. Mark unknown nonblocking facts explicitly; a blocking unknown stops the draft.
3. For a new PRD, scan the published directory and assign the proposed sequential identity and destination. For every candidate, assign its revision and digest and enumerate all promotion effects. A material confirmed decision change creates a new candidate revision; interview round count does not.
4. Present the exact candidate revision and digest, proposed identity and destination, target PRD, changed sections, promotion effects, and material trade-offs for human approval. Silence, route approval, or prior interview confirmation is not PRD approval.
5. On explicit approval, recheck that the baseline, candidate, proposed destination, target PRD, promotion effects, and published registry are unchanged. Any drift makes the candidate stale and requires renewed exact approval.
6. Publish only the exact approved destination and effects. For a new PRD, create its approved file. For a revision, update only the exact target PRD after proving its baseline is current. Record revision, supersession, approval evidence, source iteration, and digest; update the index only when it exists or now qualifies and its delta was approved.
7. Emit one Product Handoff. Return to `product-ask`, or to `dev-ask` when the approved route requests engineering handoff. Preserve any originating papercut `PC-ID` unchanged with only an explicit candidate-specific owner result; otherwise return `none`. Never inspect or mutate papercut storage.

Never overwrite an approved PRD with candidate content before exact approval. Never let two candidates revise the same stale baseline or allocate the same published identity without rebinding.

## Artifact format

[PRD-FORMAT.md](PRD-FORMAT.md) defines lazy directory creation, identity and numbering, candidate metadata, promotion, supersession, index semantics, and the published PRD template. Use it only after the intake and durable-write authority above are current.

A PRD is not a glossary, transcript, implementation specification, or ADR. Link canonical `CONTEXT.md` terminology and qualifying durable decisions instead of copying them. Use concrete measures where evidence supports them; never copy arbitrary example thresholds or force sections that add no product information.

## Iteration rules

- A new proposed product change creates one iteration targeting one existing PRD identity or `new`.
- A new independently consumable product contract gets a new PRD identity. An approved refinement of the same contract updates its existing identity with a new revision. A material replacement gets a new identity and supersedes the old PRD.
- New interview rounds remain in the same iteration.
- Candidate revisions preserve the same iteration while its objective, target PRD, and baseline remain current.
- The approved target revision stays active until exact candidate promotion.
- Promotion records the new revision and any supersession; it does not erase prior authority or evidence.
- If new evidence invalidates the safety, legality, or viability of an approved PRD, stop and return the exact impact to `product-ask` and any named downstream owner.
- An abandoned or superseded candidate remains history and cannot be consumed as current authority.

## Engineering handoff

A handoff to `dev-ask` must name:

- exact approved PRD identity, path, revision, digest, and approval evidence;
- source iteration and superseded revision;
- changed product outcomes, behavior, scope, constraints, success measures, and non-goals by reference;
- all blocking product decisions as `none`;
- nonblocking open decisions and owners;
- known downstream artifacts made stale, when evidenced;
- `route-impact: changed` for new engineering authority;
- exactly one receiver: `dev-ask`.
- optional unchanged originating papercut `PC-ID` and explicit candidate-specific owner result, or `none`; this is not part of the approved PRD and grants no engineering authority.

`dev-ask` decides whether `dev-requirements` or another engineering owner is next. The Product Handoff grants no technical-design, implementation, destructive-effect, delivery, or shipping authority.
