---
description: Use when work changes architecture, product design, domain language, or another durable concern that may be governed by an existing canonical Markdown contract.
---

# Canonical project contracts

Some repositories designate Markdown documents as canonical contracts for durable intent. Apply this rule only when the current task affects a concern owned by an **existing** contract. Never create or require one merely because an example below names it.

## Identify the contract

A document qualifies when repository instructions, the document itself, or an established project convention declares it authoritative for a durable concern. A familiar filename alone is not enough.

| Common name | Typical concern |
|---|---|
| `ARCHITECTURE.md` | System structure, invariants, ownership, integration seams |
| `DESIGN.md` | Product, UI, or interaction decisions |
| `DOMAIN.md` / `MODEL.md` | Domain language, rules, and model boundaries |
| Project-declared equivalent | The concern the repository explicitly assigns to it |

When the task touches one of these concerns, inspect project instructions and likely established locations such as the repository root, `.agents/`, and `docs/`. Stop once ownership is clear; do not inventory unrelated Markdown or assume the full set must exist.

## Operating contract

1. **Read before deciding.** Read the relevant contract before material design or implementation work on the concern it owns.
2. **Separate intended state from observed state.** The contract records durable intent; code, schemas, tests, and runtime behavior show what is implemented or enforced. Treat disagreement as drift to resolve, not permission to ignore either side.
3. **Resolve drift deliberately.** Determine whether the implementation drifted, the document is stale, or the current task intentionally changes the decision. Align the affected artifacts in the same change. Escalate only when the intended state cannot be established from the user, project instructions, or evidence.
4. **Update only durable decisions.** Update the contract in the same change when the work changes an invariant, boundary, ownership rule, public seam, design-system decision, or domain rule it owns. Do not churn it for incidental implementation details.
5. **Follow specific authority.** The user’s explicit request and more local project instructions govern task scope. Within canonical contracts, the document with the narrowest applicable scope wins; explicit statements outrank implications. If a higher-authority instruction intentionally supersedes a durable decision, update the owning contract rather than leaving a known contradiction.
6. **Keep one owner per concern.** Use the repository’s established path. Do not duplicate the same contract in another directory or mirror it into a README.
7. **Cite, do not dump.** In reports, cite the relevant path and clause; do not reproduce the whole document.

## Absence and near misses

- If no canonical contract exists for the concern, infer intent from the user, project instructions, code, tests, and schemas. Create a contract only when the user or an explicit project convention requires one.
- Partial sets are normal. Missing sibling documents are not defects.
- Plans, ADR/history logs, README tours, generated references, and agent skill checklists are not canonical contracts unless the repository explicitly declares otherwise.
- A typo-only documentation edit or a task unrelated to the concern a contract owns does not require loading or updating that contract.
- Canonical contracts complement executable enforcement; they do not replace tests, schemas, types, or validation.
