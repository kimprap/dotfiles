# Product development workflow and PRD authority

**Status:** ACTIVE
**Date:** 2026-08-10
**Decision IDs:** P01-P09

## Scope

This decision governs product-development routing, product decision refinement, Product Requirements Document identity and publication, iteration artifacts, product authority, and engineering handoff. It applies to `product-ask`, `product-grilling`, `product-prd`, their workflow and format references, and the product-authority seam consumed by `dev-ask`.

## Context and problem

Product work needs a durable authority boundary before engineering derives requirements or technical design. A single repository-wide `PRD.md` would mix unrelated initiatives, revisions, and downstream consumers. Candidate work must also remain distinguishable from approved authority, and publication must not silently overwrite a current approved contract or create unapproved side effects.

## Decision

1. **P01 — One product interface.** `product-ask` is the sole product-development router. It owns route selection and approval, not interviewing, PRD authorship, product decisions, or engineering work.
2. **P02 — Human product authority.** The human product owner retains authority over product strategy, scope, priority, success, and approval. Route approval does not approve interview recommendations, candidate PRDs, engineering work, publication outside the repository, delivery, or shipping.
3. **P03 — Round-based refinement.** `product-grilling` owns dependency-ordered, complete-frontier product decision rounds. It has no fixed round count and returns confirmed decision evidence or an exact blocker.
4. **P04 — One PRD per product contract.** Each independently consumable product initiative, capability, or material product change owns one published file under `docs/product/prds/<number>-<slug>.md`. Do not create one shared repository-wide `PRD.md`.
5. **P05 — Stable identity and revision.** A PRD has a stable `PRD-NNNN` identity and an explicit revision. An approved refinement updates the same identity. A material replacement gets a new identity and supersedes the old PRD. Revisions are not encoded in filenames.
6. **P06 — Candidate isolation.** Unapproved work remains under `docs/product/iterations/<iteration-id>/`. `DECISIONS.md` owns confirmed evidence and the open frontier; `PRD-CANDIDATE.md` owns the unapproved candidate; `BASELINE.md` exists only when the approved baseline cannot be recovered elsewhere.
7. **P07 — Exact promotion authority.** Promotion requires explicit human approval of the exact candidate revision and digest, proposed identity and destination, baseline, supersession changes, and every file creation or update. Drift in any approved effect makes the candidate stale.
8. **P08 — Registry is navigation only.** `docs/product/prds/INDEX.md` is created lazily when multiple PRDs need navigation or repository convention requires it. It is not product authority; the exact approved PRD file and revision remain authoritative.
9. **P09 — Narrow engineering handoff.** `product-prd` hands `dev-ask` the exact approved PRD identity, path, revision, digest, approval evidence, changed product outcomes, and unresolved nonblocking product decisions. The handoff grants no technical-design, implementation, delivery, or shipping authority.

## Rejected alternatives

- One shared root `PRD.md`: rejected because unrelated contracts and revisions would form one shallow interface.
- Candidate content in published PRD files: rejected because it would overwrite current authority before approval.
- `INDEX.md` as product authority: rejected because registry drift must not invalidate the authoritative PRD.
- Revision numbers in filenames: rejected because a stable product-contract identity should survive approved refinements.
- Technical architecture in PRDs: rejected because `dev-specification` owns technical design after product authority is settled.
- Fixed interview rounds or mandatory boilerplate: rejected because evidence completeness, not ceremony, determines progress.

## Consequences and invariants

- Product and engineering callers consume only the exact approved PRD named by a Product Handoff.
- Every iteration targets one existing PRD identity and revision or `new`; other PRDs may be dependencies but are not additional mutation targets.
- The approved target remains current until exact candidate promotion.
- Abandoned, blocked, stale, and superseded candidates remain history and never become current authority.
- A revised approved product contract invalidates affected downstream requirements and bindings until they are rebound and reapproved.
- No product-workflow approval implies engineering execution, destructive effects, delivery, or shipping.

## Canonical projection

- `.config/agents/skills/product-ask/WORKFLOW.md` describes current product-flow behavior.
- `.config/agents/skills/product-prd/PRD-FORMAT.md` defines the current artifact and promotion format.
- `product-ask`, `product-grilling`, and `product-prd` enforce their owner contracts.
- `dev-ask` and `dev-requirements` consume approved product authority without taking product ownership.

## Reopen when

Reopen this decision if the repository adopts a product-authority store other than revisioned Markdown, requires concurrent mutation of one PRD baseline, changes the human approval boundary, or replaces the exact-PRD Product Handoff seam.

## Human authority

The human owner approved the product-development workflow, round-based product grilling, durable per-product PRDs, explicit candidate promotion, revision and supersession handling, and handoff to the engineering workflow on 2026-08-10.
