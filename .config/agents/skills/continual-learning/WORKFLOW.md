# Session Lifecycle Envelope

## Human overview

Supported work uses one outer sequence while each work specialty keeps its own lifecycle:

```text
intake → classify → work-specialty → Handoff → papercut look/skip → assess/skip → present
```

The envelope is conceptual and stores nothing. It gives maintainers one ordering vocabulary without making engineering, product, custom, or direct work conform to a second orchestrator. Ordinary continual-learning execution reads only `SKILL.md`; this maintenance document is not executable authority.

## Event envelope

`intake` receives the request. `classify` selects one work specialty. `work-specialty` contains that specialty's current approval, implementation, assurance, recovery, and outcome rules. `Handoff` is the specialty's existing canonical recovery envelope. The same work child performs one post-Handoff papercut look, with root fallback only on child unavailability; the specialty retains all accounting in work-Handoff order. One eligible assessment may run or skip silently. `present` means the same validated specialty caller constructs one current completion fence with only ordered material `papercuts` and applies the generic renderer; it is not a task, worker, dispatch, approval, transition, state, route completion, or second Handoff.

Repair, reapproval, user promotion, explicit review, shipping, pause, compaction, and other re-entry are events against the current envelope, not additional stages or DAG edges. On pause or compaction, the specialty restores its same completed stages, selected role slot, counters, terminal state, and digest-bound artifact and receipt identities. Before any resumed role dispatch or completion decision, it compares current target and applicable-rule bytes with the once-bound manifests. Missing, stale, or contradictory references block rather than reopen completed work.

An exact repeated tuple of parent outcome, target-manifest digest, rule-manifest digest, role slot, and semantic-attempt or continuation-receipt identity blocks before dispatch as `idempotency-violation` and consumes no call, slot, counter, transition, or Handoff. A distinct authorized slot and a recorded pre-semantic safe transport retry keep their existing eligibility. The envelope adds no persistence for this check.

## Continual-learning modes

`assess` handles one settled eligible outcome with its completed Handoff and nonempty affected-artifact manifest. A nonempty outcome with no complete candidate may return `NO DURABLE LEARNING`; empty intake skips silently. `review` requires an explicit human pointer and remains proposal-only. `deep` requires explicit authority or settled severe, recurring, cross-contract, stale, or conflicting evidence. Titles, counts, time, calendars, transcript mining, scores, and unchanged Handoffs do not qualify a mode.

When a specialty adapter already owns an outcome's assessment tail, that adapter is the only path. Without an adapter, one explicit portable invocation is valid when mode-specific eligibility holds. The envelope never auto-dispatches a mode. Continual-learning review, code review, and papercut review remain distinct owners.

Guidance mutation stays bound to the reporter's frozen evaluation tuple and candidate identity. The portable curator owns qualification, least-specific sufficient guidance, source and fresh adjacent proof, safe restoration, and `CURATED | NO DURABLE LEARNING | BLOCKED`. It receives caller-owned recovery identities as opaque evidence and stores none of them.

## Adapters and settlement

Engineering keeps visible owner `dev-continual-learning`. One standard or high-consequence engineering tail invokes portable `assess` once inside that existing task. A separately authorized engineering Deep route invokes portable `deep` through the same adapter. Compact invokes neither owner. The adapter retains engineering Task Contract, Context Pack, Common Handoff, manifest, role-slot, counter, and backend-result mapping only; it does not copy portable qualification or curation.

The work Handoff completes before the same work child performs one soft papercut look; only child unavailability permits root fallback. Papercut capture and assessment remain separate. A complete papercut-originated Learning Candidate carries one immutable originating `PC-ID`; the portable curator returns candidate-specific mapping evidence and never accesses the ledger. The current specialty or session adapter alone may settle one exact terminal record. Incomplete, blocked, deferred, broad, global, unrelated, or helper-failure results remain open.

Completion rendering occurs last. Engineering, product, and custom or direct specialties validate their own completion, settlement, filled evidence, ordered change-scope and key-artifact lists, durable Completion Summary Resume from, existing-Handoff references, shipping constraint, and authorized Next. The caller retains every papercut accounting result in deterministic work-Handoff order, projects only material results into the ordered `papercuts` array, and uses `[]` when all results are none-only. Before normalization, it validates that the referenced Completion Summary records outcome, material decisions, immutable evidence identities, current residual risk, and the exact applicable manifest reference; exhaustive inventory remains in that manifest and/or the Handoff. The same caller orders the twelve values into exactly one current `completion-presentation-input` fence and directly applies the generic presenter, which renders only status `completed` and emits only the report. It never decides completion, inspects recovery mechanics, validates or reruns evidence, settles papercuts, invokes learning, creates a Handoff, or adds a lifecycle stage.

## Authority and maintenance

Current rationale and decision ownership are discoverable through [`docs/adr/INDEX.md`](../../../../docs/adr/INDEX.md). Load the focused active records named there only when changing or diagnosing this workflow. Do not copy ADR text into executable skills or consumer repositories.

Maintain one semantic owner per concern:

- `continual-learning/SKILL.md`: portable mode eligibility, mutation proof, result, and stops.
- `completion-presentation/SKILL.md`: one-current-fence activation, filled and durable terminal input, fixed completed report, and no-lifecycle stops.
- specialty adapters and routers: specialty validation, recovery, settlement, current fence construction, and same-agent presenter application.
- papercut: current-work capture and exact-record mechanics.
- this file: current human-readable envelope and maintenance map only.

Host invocation and storage adapters may differ. They must not change mode semantics, add a lifecycle store, infer qualification from transcripts or titles, create a second Handoff, dispatch the presenter, or turn presentation into state.
