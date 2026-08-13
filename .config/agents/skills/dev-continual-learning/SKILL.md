---
name: dev-continual-learning
description: >
  Run one neutral terminal Standard assessment after a settled standard or
  high-consequence outcome, or assess a separately authorized Deep maintenance
  route. Curate only directly impacted project-owned guidance; never audit by
  count or calendar, mine in the background, or mutate user-level AGENTS.md.
---

# Engineering Continual Learning

Own one backend-dispatched terminal assessment. Do not accumulate observations, keep scheduling state, or start work from an ambient candidate.

```text
settled reviewed outcome
→ backend dispatch
→ one neutral assessment
→ optional narrow project-guidance update
→ source-case plus adjacent near-miss validation
→ terminal outcome
```

## Modes and trigger

### Standard

Run exactly once after a settled standard or high-consequence outcome. The target is the exact verified/integrated/reviewed outcome and its affected-artifact manifest. Inspect only affected artifacts and update only directly impacted current project-owned guidance. A write is optional; `NO DURABLE LEARNING` is valid.

Compact work reaches this skill only when the backend's post-review screen finds an explicit durable correction or decision, a qualified settled recurring process fact, a Learning Candidate, or a severe qualifying incident. Otherwise the backend records compact `curation not triggered` plus checked trigger facts as terminal evidence without dispatching this skill or creating a curation Handoff.

### Deep

Deep maintenance activates only from:

- an explicit human request; or
- settled evidence of a recurring or cross-contract defect, a stale or conflicting canonical set, or a severe systemic incident.

Deep is a separately authorized route by default. A Deep candidate does not block the settled run unless an exact current-contract conflict prevents correctness of that run; return that conflict as `BLOCKED` rather than beginning Deep in place.

Invocation counts, every-Nth-run counters, elapsed time, calendars, router state or timers, background transcript or memory mining, artifact volume, another audit, and an unchanged Handoff never trigger Standard or Deep. Do not implement formal weakness scoring, broad default audits, autonomous-learning claims, or lifecycle resets.

## Qualification and authority

Any role may report a non-authoritative candidate with the proposed durable statement, exact source revisions, project scope and current destination, recurrence or severity evidence, prevention relationship, sensitivity/redaction, conflicts or supersession, and—for any candidate that may mutate guidance—a complete `Evaluation proposal`. A candidate and its proposal are not authority. A papercut-originated candidate additionally carries exactly one immutable originating `PC-ID`; a missing or mismatched ID leaves it evidence-only, and a non-papercut candidate carries none.

- Explicit durable corrections and verified stable project facts may qualify from one settled occurrence.
- Ordinary process guidance requires two independent settled outcomes.
- One severe independently verified safety, data-loss, authority, expensive-failure, or high-impact incident may qualify when the statement directly prevents recurrence.
- Reject transient state, guesses, secrets, transcripts, unverified claims, unsettled hypotheses, generic advice, provider details outside adapter guidance, and disguised product, architecture, scope, compatibility, destructive, or shipping decisions.

Use the narrowest existing project-owned destination already authorized for the statement: a current canonical project `AGENTS.md`, an existing scoped rule, an existing skill within its trigger, or directly bound current workflow/ADR/index guidance and convergence fixture. Update, merge, or remove before adding. Do not create a new skill, rule, guidance file, domain artifact, memory/state service, hidden file, hook-owned authority, router service, or runtime ledger without explicit human approval.

**Absolute prohibition:** `/Users/kim/.agents/AGENTS.md` is exclusively human-managed. Never create, edit, append, merge, deduplicate, reformat, delete, or indirectly bypass it. Report a cross-repository candidate in `Deep candidate` with evidence and suggested wording only.

## Bound evaluation for guidance mutation

A mutating candidate is ready only after the backend validates the reporter's complete proposal and freezes it in the curator Task Contract and exact Context Pack. The proposal contains:

```text
id; candidate_revision
source: identity, revision, expected, proof, baseline
adjacent: identity, revision, expected, proof, independence, baseline=fresh-required
proof_mode: deterministic | semantic | mixed
semantic_evaluator: none | separate
```

The backend checks reporter ownership, authority, freshness, completeness, adjacent-case independence, and proof classification. It canonicalizes the object as UTF-8 JSON with sorted keys and compact separators, records `CE-... @ <sha256>` under Task Contract `Verification`, and binds the exact object and digest in the Context Pack before curator dispatch. The curator cannot add, replace, weaken, or omit the tuple. A missing, stale, mismatched, or curator-modified binding permits no write and returns `BLOCKED`. A curator-discovered unbound candidate stays in `Skipped` or `Deep candidate` for a later bound assessment.
For a complete papercut-originated candidate, the backend freezes the same originating `PC-ID` beside the proposal and tuple. The curator receives and returns it unchanged but never reads or writes the papercut ledger. A stale, missing, replaced, or additional ID invalidates settlement and permits no guidance write under that candidate.

Exact settled source evidence may be reused only while target revision, environment, expectation, and proof method still match. Otherwise rerun it before mutation. The independent adjacent case always runs fresh before mutation; both source and adjacent rerun afterward against the frozen expectations. Deterministic proof needs no second evaluator. Every semantic facet requires one fresh read-only non-curator result bound to the tuple digest with evaluator identity, `PASS | FAIL | FLAKY | INCONCLUSIVE`, both observations, and reasoned comparison; mixed proof applies each rule to its facet.

## Procedure

1. Use one neutral curator that did not author or assure the settled outcome. Bind the exact target, affected-artifact manifest, source evidence, terminal assurance, current destination revisions, and any backend-frozen mutating-candidate tuple.
2. Inspect only those affected artifacts. For each candidate, verify recurrence or severity, scope, sensitivity, authority, conflict status, direct impact, and whether a valid bound evaluation authorizes mutation. Standard never broadens into a canonical-set audit.
3. Prefer the least-specific sufficient verified rule: the narrowest durable statement and current destination that cover the source case without capturing the independent adjacent case. This is a curation heuristic, not a formal score.
4. Snapshot and digest the destination, then reread immediately before apply. Recompute a semantic merge after concurrent change; never reset unrelated work or apply a stale patch. Block on an exact current-contract conflict, missing authority, or invalid evaluation binding that prevents a correct outcome.
5. Make the smallest authorized update. Preserve unrelated guidance, precedence, privacy, provider boundaries, and the human-owned user-level file.
6. Validate the bound source and adjacent baselines, post-mutation results, required semantic evaluator result, syntax/registration, destination scope and precedence, duplication, staleness, and changed trigger behavior. A complete pass alone permits `CURATED`. A stable deterministic failure or a bound semantic `FAIL` restores only the exact curator delta when current bytes still match it and returns `NO DURABLE LEARNING`; unsafe restoration, a missing semantic verdict, or `FLAKY`/`INCONCLUSIVE` proof returns `BLOCKED`.
7. For a papercut-originated candidate, classify only the candidate-specific authoritative result as `fixed | rejected | superseded | open` under the terminal mapping below and return the unchanged originating `PC-ID`. Do not invoke the papercut helper.
8. Do not recursively curate the curator edit. Return one terminal outcome.

## Terminal result

Use the Common Handoff with exactly one curation outcome: `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED`. Its curation payload contains exactly these fields:

```markdown
## Updated
<existing logical statements changed, with destination and before/after identity, or none>
## Added
<new logical statements added within an existing authorized destination, or none>
## Removed
<stale/conflicting logical statements removed, or none>
## Skipped
<candidate → rejected/deferred reason and exact source identities; for NO DURABLE LEARNING, every source assessed>
## Validation
<source case plus independent adjacent/near-miss checks, destination checks, and independent review when required>
## Deep candidate
<none | exact qualifying trigger, evidence, proposed separate route, and whether a current conflict blocks correctness>
## Papercut outcome
<none | record_id: exact originating PC-ID; kind: fixed | rejected | superseded | open; resolved_on, durable reference, and summary when terminal; exact open reason otherwise>
```

`CURATED` requires an authorized guidance delta plus complete proof against the frozen tuple. `NO DURABLE LEARNING` uses `none` for change fields, names every exact source assessed under `Skipped`, and may follow a byte-exact safe restoration after stable deterministic failure or a bound semantic `FAIL`. `BLOCKED` names only the exact current-contract conflict, invalid binding, missing semantic verdict, `FLAKY`/`INCONCLUSIVE` proof, unsafe restoration, or missing authority and its resume condition; it cannot start an audit loop. `Validation` cites the tuple identity/digest when present, reused or fresh baselines, post-mutation results, semantic result when required, restoration checks when performed, destination checks, and final destination identity. `Papercut outcome` is `none` for non-papercut work. For the unchanged originating `PC-ID`, a verified durable `CURATED` correction is `fixed`; candidate-specific final rejection or failed frozen evaluation is `rejected`; replacement by another record or decision is `superseded`; and `BLOCKED`, incomplete, deferred, global, non-candidate-specific, or unrelated results are `open`. Only terminal kinds include `resolved_on`, exact durable `reference`, and `summary`. Do not close an unrelated record or treat a broad curation result as candidate-specific.

## Stop and next owner

`CURATED`, `NO DURABLE LEARNING`, and compact `curation not triggered` are terminal. `BLOCKED` preserves the verified implementation and blocks only the current adaptive-workflow gate until its exact conflict is resolved or a human changes scope. Return the Handoff to `dev-implementation`; that backend alone validates and applies any terminal `Papercut outcome` through the portable papercut settlement seam. Do not read or mutate papercut storage, repair implementation, change authority, dispatch Deep, ship, or declare completion here.
