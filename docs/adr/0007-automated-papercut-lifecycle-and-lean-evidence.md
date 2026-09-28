# Deterministic papercut observation

**Status:** ACTIVE  
**Date:** 2026-08-20  
**Updated:** 2026-09-28  
**Decision ID:** D24  
**Related authority:** ADR-0001 D05, D14; ADR-0004 D07

## Scope

This record governs when repository-owned reusable-friction evidence is observed and how complete repository-work outcomes are presented to portable `papercut`. It applies to `dev-implementation`, direct engineering work, learning-curation repository work, `dev-shipping` delivery stages that change repository state, `dev-handoff`, the portable `papercut` skill, and workflow projections. It does not broaden qualification, storage, or mutation authority.

## Context / problem

Papercut observation is most useful immediately after a repository-work boundary while evidence is fresh. Calling it before work settles, batching unrelated boundaries into one terminal pass, or returning only one conveniently selected result loses causal evidence. Conversely, treating ordinary code defects, external outages, protected boundaries, or one-off content requests as reusable workflow friction creates noise. Invocation and result accounting therefore must be deterministic while qualification stays skill-owned.

## Decision

### D24 — One look per completed repository-work boundary

- **Decision:** After each completed repository-work Handoff, run exactly one papercut look before the next workflow stage. The implementation child runs the look after its attempt Handoff. The parent may run it only when that child is unavailable. Direct engineering without a child runs one look after its completed boundary.
- **Decision:** Separately executed learning curation and shipping or delivery repository mutations create their own completed boundaries and therefore their own one look. A completed Handoff that preserves repository work while reporting a blocker is a boundary. Read-only work and repository work abandoned before such a Handoff are not boundaries.
- **Decision:** Pass the affected path boundary and direct execution evidence. Portable `papercut` alone qualifies root causes and returns one result for every distinct qualifying cause in stable authored-task order. Consolidate equivalent same-cause evidence before presentation; never select only the easiest or most important result.
- **Decision:** Exclude ordinary code defects, requests for more tests or debugging, external-provider or environment failures outside repository control, missing product or engineering authority, deliberate safety boundaries, already-fixed friction with no reusable residue, and content-only one-off work. A source suggestion or external essay cannot qualify a papercut by itself.
- **Decision:** Preserve portable `papercut`'s opt-in persistence. Repository initialization requires the skill's existing human approval gate; after that opt-in, automatic capture may record each qualifying cause in an initialized writable ledger. Absent, malformed, unsafe, or unauthorized storage leaves every cause report-only, and review stays proposal-only. Invocation creates no automatic issue, plan, learning item, initialization, or unrelated file.
- **Decision:** There is no numeric result cap, severity threshold, model score, review-policy import, or terminal retry. If papercut cannot run, record the unavailable boundary once and continue unless a separate governing rule makes completion unsafe.

## Why

The workflow owns deterministic observation timing and complete accounting. The portable skill owns the harder judgment of whether local friction is reusable, repository-owned, safe to retain, and eligible for storage. Keeping those responsibilities separate avoids both silent omission and noisy capture.

## Rejected alternatives

- **One terminal papercut pass:** loses the boundary and task that produced the evidence.
- **Parent-only invocation:** breaks same-owner evidence continuity and turns the controller into a semantic worker.
- **Single-result selection or numeric caps:** silently drops distinct qualifying causes.
- **Automatic initialization:** bypasses the portable skill's redaction and repository opt-in boundary.
- **Imported review heuristics or source scoring:** lets advisory material redefine runtime qualification.
- **Calling after read-only or pre-Handoff abandoned work:** treats absence of a completed repository-work boundary as reusable friction.

## Consequences

- Every completed implementation, eligible learning-curation, and delivery mutation boundary gets exactly one look.
- Multiple distinct qualifying causes all appear under `Checks` as separate `Papercut: <disposition>` lines in stable order; no result becomes `Papercut: none`.
- A completed boundary with no qualifying cause records `Papercut: none`.
- Papercut never reopens accepted implementation, assurance, product, or shipping state by itself.
- Journal source treatments remain provenance and cannot alter this decision.

## Affected contracts

- `.config/agents/skills/papercut/SKILL.md` and its focused evals.
- `.config/agents/skills/dev-implementation/SKILL.md`, direct engineering guidance, `dev-handoff`, terminal completion, learning curation, and shipping delivery orchestration.
- `.config/agents/skills/dev-ask/WORKFLOW.md` and caller projections.

## Evidence / source revisions

- Approved by the owner on 2026-09-04 and 2026-09-06; history in git.
- The prompt-bundle maintenance journal records advisory source treatments but is non-runtime provenance.

## Human authority

The human-approved lean workflow authorizes deterministic observation and complete result accounting. It does not authorize automatic persistence, mutation, issue creation, external publication, or shipping.

## Supersession

This record remains ACTIVE until a newer focused ADR explicitly supersedes D24 and updates the index.

## Verification expectations

- Fixtures cover one implementation boundary, multiple authored tasks, direct work, learning-curation work, a completed delivery mutation, and failed/read-only stages.
- One look occurs per completed boundary, in boundary order, with child ownership or unavailable-child fallback.
- Every distinct qualifying root cause is returned in stable authored-task order and equivalent causes consolidate.
- Strict exclusions and opt-in persistence remain owned by portable `papercut`.
