---
name: continual-learning
description: Assess settled affected-artifact outcomes, review only explicitly pointed-at evidence, or run separately authorized Deep maintenance after an explicit, severe, or recurring trigger. Skip empty or ineligible intake; never mine transcripts, score sessions, keep a learning ledger, or run beside a specialty adapter.
---

# Continual Learning

## Activation and modes

Use exactly one explicit mode:

- `assess`: assess one settled eligible affected-artifact outcome. When a specialty adapter owns that outcome's terminal assessment, invoke only the adapter; reject a second direct invocation. Without an adapter, one explicit portable invocation is valid when the intake below is complete.
- `review`: accept only an explicit human pointer to `this session`, one path, or one ID. Read only the pointed evidence and return proposals or missing evidence. Do not mutate, dispatch, score, or retain state. A session title or name is not a pointer.
- `deep`: accept an explicit human request or settled severe, recurring, cross-contract, stale, or conflicting evidence. Keep Deep separately authorized unless an exact current contradiction blocks correctness.

The envelope never auto-dispatches a mode. A bare `review` does not select this mode instead of code review or papercut review. Count, elapsed time, calendar, artifact volume, title, transcript mining, an unchanged Handoff, or a score never triggers assessment, review, or Deep.

## Session envelope intake

The conceptual order is exactly:

```text
intake → classify → work-specialty → Handoff → papercut look/skip → assess/skip → present
```

A work specialty owns its internal lifecycle. Repair, reapproval, user promotion, explicit review, shipping, pause, compaction, and other re-entry are events against the current envelope, never extra stages, a nested orchestrator, or a persisted DAG. `present` is a final projection of an already-settled Handoff, not a task, approval, transition, state, or second Handoff.

For `assess`, require all of:

- one settled eligible outcome;
- its completed canonical Handoff;
- a nonempty affected-artifact manifest; and
- every available complete Learning Candidate, while incomplete candidates remain named evidence only.

A nonempty affected-artifact outcome remains eligible with zero complete candidates and may return `NO DURABLE LEARNING`. No affected artifact and no complete candidate is empty: do not load this skill and emit no learning output. If a human explicitly invokes `assess` with empty or ineligible input, report only the missing eligibility and do not inspect unrelated evidence. An unnamed single-session plan run qualifies when it has the completed Handoff and affected plan artifact. A title-only session or open-ended discussion does not.

A specialty caller supplies any current target-manifest digest, applicable-rule-manifest digest, role slot, semantic-attempt or grant identity, counters, completed stages, terminal state, and artifact or receipt identities as opaque evidence. This skill stores none of them. On pause or compaction, the caller must preserve those identities and first prove current equality with its once-bound manifests. Missing, stale, or contradictory references block. An exact repeated tuple of parent outcome, target-manifest digest, rule-manifest digest, role slot, and semantic-attempt or grant identity is an `idempotency-violation` before invocation and consumes no call, slot, counter, transition, or Handoff. A distinct authorized slot and a recorded pre-semantic safe transport retry are not duplicates.

## Qualification and authority

A candidate includes the proposed durable statement, exact source revisions, project scope and current destination, recurrence or severity evidence, prevention relationship, sensitivity and redaction, conflicts or supersession, and the complete affected-artifact and applicable-rule inputs supplied by the caller. A candidate and its evaluation proposal are not mutation authority.

- An explicit durable correction or verified stable project fact may qualify from one settled occurrence.
- Ordinary process guidance requires two independent settled outcomes.
- One severe independently verified safety, data-loss, authority, expensive-failure, or high-impact incident may qualify when the statement directly prevents recurrence.
- Reject transient state, guesses, secrets, raw transcripts, unverified claims, unsettled hypotheses, generic advice, provider details outside adapter guidance, and disguised product, architecture, scope, compatibility, destructive, or shipping decisions.

Use the narrowest existing project-owned destination already authorized for the statement. Update, merge, or remove before adding. Do not create a new skill, rule, guidance file, domain artifact, memory service, state service, hidden authority, router, or runtime ledger without explicit human approval. For a surface verification adapter, `assess` is narrower: it may update only an exact already-authorized existing adapter destination through `maintain-surface-verification-adapter`; it may never create an absent adapter, the shared `surface-verification-adapter` contract, or either wrapper. User-level guidance is human-managed: report a cross-repository candidate as a proposal under `Deep candidate`; never mutate it.

A complete papercut-originated candidate carries exactly one immutable originating `PC-ID`. A missing or mismatched ID leaves it evidence only. A non-papercut candidate carries no synthetic ID. The portable owner never reads or writes a papercut ledger.

## Bound evaluation for guidance mutation

A mutating candidate is ready only after its lifecycle caller validates and freezes the reporter-owned proposal before curator work. Preserve this exact tuple:

```text
id; candidate_revision
source: identity, revision, expected, proof, baseline
adjacent: identity, revision, expected, proof, independence, baseline=fresh-required
proof_mode: deterministic | semantic | mixed
semantic_evaluator: none | separate
```

The caller validates reporter ownership, authority, freshness, completeness, adjacent independence, and proof classification; canonicalizes sorted-key compact UTF-8 JSON; and binds one `CE-` identity to its lowercase SHA-256 digest. The curator cannot create, replace, weaken, or omit the binding. Missing, stale, mismatched, tampered, or curator-modified binding permits no write and returns `BLOCKED`. A curator-discovered unbound candidate remains under `Skipped` or `Deep candidate` for a later bound route.

Matching source evidence may be reused only while target revision, environment, expectation, proof method, and evidence integrity remain exact. Otherwise rerun it before mutation. The adjacent baseline always runs fresh before mutation. Both source and adjacent run afterward against the frozen expectations. Deterministic proof needs no second evaluator. Every semantic facet requires one fresh read-only non-curator result bound to the tuple digest with evaluator identity, `PASS | FAIL | FLAKY | INCONCLUSIVE`, both observations, and reasoned comparison. Mixed proof applies each rule to its facet.

For a complete papercut-originated candidate, the caller freezes the same originating `PC-ID` beside the evaluation tuple. Return it unchanged. A stale, missing, replaced, or additional ID invalidates candidate-specific settlement and permits no guidance write under that candidate.

## Procedure

1. Bind the exact settled outcome, completed Handoff, affected-artifact manifest, current applicable-rule evidence, source evidence, residual terminal advisories, destination revisions, and any frozen mutation tuple. Reject empty or adapter-duplicate intake. Do not edit the settled outcome or rerun its assurance.
2. Inspect only affected artifacts. For each candidate, verify recurrence or severity, scope, sensitivity, authority, conflicts, direct impact, and valid frozen evaluation. An advisory without a bound evaluation stays under `Skipped` and permits only `NO DURABLE LEARNING`.
3. Prefer the least-specific sufficient verified guidance: the narrowest durable statement and current destination that cover the source case without capturing the independent adjacent case. This is a curation heuristic, not a score.
4. Snapshot and digest the destination, then reread immediately before apply. Recompute a semantic merge after concurrent change; never reset unrelated work or apply a stale patch.
5. Make the smallest authorized update. Preserve unrelated guidance, precedence, privacy, host boundaries, and human-managed user guidance.
6. Validate the bound source and adjacent baselines, post-mutation results, required semantic evaluator result, syntax or registration, destination scope and precedence, duplication, staleness, and trigger behavior. A complete pass alone permits `CURATED`.
7. On a stable deterministic failure or bound semantic `FAIL`, restore only the exact curator delta when current bytes still match it and return `NO DURABLE LEARNING`. Unsafe restoration, a missing semantic verdict, `FLAKY`, `INCONCLUSIVE`, invalid binding, or exact current-contract conflict returns `BLOCKED`.
8. For a papercut-originated candidate, classify only the candidate-specific result as `fixed | rejected | superseded | open` and return the unchanged originating `PC-ID`. Do not invoke a papercut helper.
9. Do not recursively curate the curator edit. Return one terminal result.

## Terminal result

Return exactly one outcome: `CURATED`, `NO DURABLE LEARNING`, or `BLOCKED`. The result payload contains exactly these fields:

```markdown
## Updated
<existing logical statements changed, with destination and before/after identity, or none>
## Added
<new logical statements added within an existing authorized destination, or none>
## Removed
<stale or conflicting logical statements removed, or none>
## Skipped
<candidate → rejected or deferred reason and exact source identities; for NO DURABLE LEARNING, every source assessed>
## Validation
<source case, independent adjacent or near-miss checks, destination checks, evaluator result when required, and restoration evidence when performed>
## Deep candidate
<none | exact qualifying trigger, evidence, proposed separate route, and whether a current conflict blocks correctness>
## Papercut outcome
<none | record_id: exact originating PC-ID; kind: fixed | rejected | superseded | open; resolved_on, durable reference, and summary when terminal; exact open reason otherwise>
```

`CURATED` requires an authorized guidance delta plus complete proof against the frozen tuple. `NO DURABLE LEARNING` uses `none` for change fields, names every assessed source under `Skipped`, and may follow byte-exact safe restoration after a stable deterministic failure or bound semantic `FAIL`. `BLOCKED` names the exact invalid binding, current-contract conflict, missing verdict, flaky or inconclusive proof, unsafe restoration, or missing authority and its resume condition. It cannot start an audit loop.

For the unchanged originating `PC-ID`, a verified durable `CURATED` correction is `fixed`; candidate-specific final rejection or failed frozen evaluation is `rejected`; replacement by another record or decision is `superseded`; and blocked, incomplete, deferred, global, non-candidate-specific, narrow-authority, helper-failure, or unrelated results are `open`. Only terminal kinds include `resolved_on`, exact durable reference, and summary.

## Portability and stops

Run this body without loading repository ADRs, workflow documents, transcripts, JSONL history, session titles, scores, evaluation ledgers, learning ledgers, memory, or host adapters. OMP and Grok invocation syntax may differ; mode eligibility, authority, inputs, proof, outputs, and stops do not.

Do not auto-dispatch from the envelope, run beside an owning specialty adapter, create another task or Handoff, add lifecycle state, inspect or settle a papercut ledger, infer completion or shipping, change product or architecture authority, or start Deep in place. `BLOCKED` preserves the settled work and blocks only the current learning gate until its exact resume condition is satisfied or a human changes authority. `CURATED` and `NO DURABLE LEARNING` are terminal learning results. Return them to the invoking specialty or direct caller; that caller owns any state, completion, settlement, or presentation action.
