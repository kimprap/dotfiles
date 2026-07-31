Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 04, 07, 12
Status: resolved

## Question

Where should continual learning sit in the adaptive lifecycle, and what portable contract keeps project guidance current without turning transient transcript noise into always-loaded rules? Cursor's public plugin runs an orchestration-only skill from eligible stop events, delegates incremental transcript mining to one updater, reads the existing file first, updates matching bullets in place, deduplicates, and writes only durable preferences or workspace facts. Decide the shared triggers, candidate and write ownership, project-scoped destination selection, multi-agent conflict policy, staleness and size limits, verification, and adapter boundary for transcript discovery or cadence. The implementation must include continual learning, but it may never modify user-level `AGENTS.md`; Cursor hooks, `.cursor/` state, and fixed section names are source-specific rather than portable defaults.

Recommended default to evaluate: make continual learning a cross-cutting terminal curation gate, not another mandatory build stage. Run one neutral curator after a high-signal outcome is settled—closed decision ticket, approved specification/tickets, or verified and integrated implementation—and before the final handoff/session stop; use an adapter-owned incremental stop/cadence trigger only as a safety net. Workers and verifiers may emit lesson candidates but never edit shared guidance. The curator reads existing guidance first and writes the narrowest project-owned destination: the relevant project skill/rule for process discipline or the repository's canonical `AGENTS.md` for workspace facts. User-level `AGENTS.md` is exclusively human-managed; a genuinely cross-repository preference is reported as a candidate for the user and never written by the workflow. Explicit user corrections are high-priority candidates; one-off task state, inferred preferences, secrets, and unverified worker claims are rejected.

## Answer

Continual learning is a cross-cutting terminal curation gate, not another implementation stage and not background transcript accumulation.

```text
settled high-signal outcome
→ neutral curation assessment
→ optional narrow project-guidance update
→ targeted validation/review of that update
→ terminal evidence and final handoff
```

The assessment is required; a write is not. `NO DURABLE LEARNING` is a successful curation outcome when evidence does not justify a durable update.

### Triggering outcomes

Run one curation assessment after:

- a decision ticket is resolved with human-confirmed authority;
- a PRD/specification or executable ticket set is explicitly approved;
- an implementation is verified, integrated when needed, and finally reviewed;
- a severe failure/postmortem reaches a settled diagnosis and prevention rule;
- an explicit user correction establishes a durable project-scoped rule or fact.

Do not run after every message, exploratory branch, worker handoff, failed hypothesis, or unverified attempt. In batch/full orchestration, workers and verifiers emit candidates, but one curator runs only after fan-in and terminal review. Repeated stop events for the same unchanged outcome do not rerun curation.

For implementation, the gate sits after final Standards/Specification review and before overall evidence-backed completion. If curation writes guidance, validate that new revision before completion; do not recursively curate the curator's own edit in the same run.

### Curation outcomes

Exact outcome:

```text
CURATED
NO DURABLE LEARNING
BLOCKED
```

- `CURATED` — one or more verified narrow updates were applied and validated.
- `NO DURABLE LEARNING` — candidates were assessed and none met retention/write criteria.
- `BLOCKED` — assessment or an authorized required write could not safely complete because evidence, target authority, conflict resolution, or validation was unavailable.

`CURATED` and `NO DURABLE LEARNING` satisfy the terminal gate. `BLOCKED` preserves the already verified implementation/decision result but prevents the overall adaptive workflow from claiming terminal completion until curation is resolved or the human explicitly changes its required scope.

### Candidate ownership

Planners, workers, verifiers, integrators, reviewers, and the router may emit candidates in their structured handoff. They never edit shared guidance as part of their primary role.

A candidate contains:

```markdown
## Learning candidate
- Proposed durable statement
- Project scope and suggested destination
- Source outcome/artifact revisions
- Evidence and verification status
- Recurrence or severity
- Failure/prevention relationship, if procedural
- Sensitivity and redaction concerns
- Known conflicts or superseded guidance
```

A candidate is not authority. The neutral curator verifies it against current evidence and current guidance.

### Qualification evidence

A candidate may qualify when:

- the user explicitly corrected a durable project-scoped behavior;
- a stable repository fact is directly verified against current canonical files/configuration;
- the same process failure/lesson recurs in at least two independent settled outcomes;
- one severe independently verified incident exposes a clear preventive rule involving safety, data loss, authority violation, repeated expensive failure, or high-impact regression;
- a current project rule is demonstrably stale or contradicted by newer approved authority.

Explicit corrections and directly verified stable facts may qualify from one occurrence. Process guidance normally requires recurrence unless severity justifies immediate prevention.

Reject:

- one-off task state, temporary paths, branch/job/session IDs, and transient environment facts;
- inferred preferences, guessed intent, or stylistic speculation;
- secrets, credentials, private/sensitive data, or raw transcript excerpts;
- unverified worker/reviewer claims;
- unresolved hypotheses, partial output, failed attempts without settled diagnosis, and nonterminal decisions;
- generic advice the model already knows;
- provider/model/tool details unless the target is an existing harness-adapter document whose purpose is exactly that configuration;
- product, architecture, scope, acceptance, or destructive decisions disguised as “learning.”

### Evidence inputs

Use, in order:

1. explicit user corrections and decisions;
2. approved/resolved canonical artifacts;
3. terminal Handoffs and evidence indexes;
4. independent verification/final review;
5. current repository/configuration inspection;
6. bounded adapter-provided transcript deltas only when the structured evidence leaves a plausible missed candidate.

Full-history transcript mining is never the default. The adapter supplies only unprocessed/new evidence since the last settled source revision, with redaction and privacy constraints. A transcript statement still must meet the same qualification rules.

### Neutral curator authority

Exactly one curator owns a curation pass for a project/outcome.

The curator:

- reads current guidance before proposing an edit;
- verifies source evidence and target scope;
- chooses the narrowest existing project-owned destination;
- updates matching guidance in place;
- merges semantic duplicates;
- removes/replaces stale guidance when current evidence warrants it;
- preserves unrelated human/agent changes;
- validates the result;
- emits the curation handoff.

It may modify only existing guidance whose current purpose already covers the lesson:

- the repository's canonical project `AGENTS.md` for stable workspace facts and broadly applicable repository constraints/preferences;
- an existing scoped project rule for a proven policy at that rule's existing activation seam;
- an existing project skill for a reusable procedure within that skill's existing trigger/purpose.

It may not:

- create a new skill, rule, `AGENTS.md`, glossary, context map, ADR, specification, or product artifact without human approval;
- broaden a skill/rule activation surface or redefine its interface;
- change product/architecture/scope/acceptance/destructive authority;
- edit implementation code as a learning shortcut;
- use a memory backend or hidden file to bypass destination authority;
- modify user-level `AGENTS.md`.

When deterministic tooling, code, tests, or configuration would enforce the lesson better than prose guidance, report a follow-up candidate to the appropriate implementation owner rather than editing those artifacts as curator.

### Destination selection

| Candidate | Destination |
|---|---|
| Stable repository fact, invariant, or broad workspace convention | Existing canonical project `AGENTS.md`, in the narrowest applicable scope |
| Reusable procedure already governed by one skill | Update that existing skill |
| Proven policy/failure prevention already governed by one rule | Update that existing rule |
| Product/architecture/domain/acceptance decision | Return to PRD/specification/glossary/ADR owner; curator does not write |
| Deterministically enforceable issue | Report implementation/tooling/test/config follow-up |
| Cross-repository user preference | Report to the user as a candidate; do not write project guidance or user-level `AGENTS.md` |
| Transient, speculative, sensitive, duplicated, or unverified item | Reject; write nowhere |

The canonical project destination is discovered from current repository contracts and live scope/precedence. File presence alone does not authorize creating or choosing a new guidance root.

### User-level `AGENTS.md`

User-level `AGENTS.md` is exclusively human-managed.

No router, planner, worker, verifier, integrator, reviewer, curator, hook, adapter, or memory process in this workflow may create, edit, append, merge, deduplicate, reformat, or delete it.

A genuinely cross-repository preference is reported to the user with evidence and suggested wording. The user decides whether and where to retain it. Project guidance must not copy such a preference merely to work around this restriction.

### Context budget

Use a project-declared budget when one exists. Otherwise:

- at most 12 active curator-managed entries per destination;
- at most 3 net-new entries in one curation pass;
- one durable fact/rule per concise entry;
- update/merge/remove before appending;
- no mandatory portable heading or fixed section name;
- do not create a second learning section beside an existing suitable scope.

The curation handoff records the target scope/heading and logical identities of entries added, changed, merged, or removed. If the budget is full, a new entry requires consolidation or removal of lower-value/stale material; otherwise report it as an unapplied candidate.

Always-loaded context cost is part of correctness. A true fact that is too narrow or rarely useful belongs in a scoped skill/rule, canonical domain artifact, or nowhere—not the project-wide file.

### Staleness

Guidance becomes eligible for revalidation when:

- its source artifact/rule/configuration changes;
- the relevant subsystem or ownership moves;
- a current user correction or approved artifact contradicts it;
- a repeated counterexample disproves it;
- its trigger/scope no longer matches actual use;
- it duplicates newer guidance;
- it names a provider/tool/version detail that changed.

Age alone may schedule review but never proves staleness. The curator checks current evidence, then updates, merges, replaces, or removes the statement. Never preserve contradictory guidance “for history”; provenance remains in curation handoffs/version control, not in always-loaded rules.

### Multi-agent conflict policy

- Only one neutral curator may write a given guidance target for one terminal outcome.
- Workers/verifiers submit candidates; they never race to edit guidance.
- The curator snapshots/digests the target, re-reads immediately before applying, and compares current content with the snapshot.
- On concurrent change, recompute the semantic merge from the new current file. Never use last-writer-wins, overwrite, reset, or stale patches.
- Explicit current user decisions and canonical repository authority outrank candidates.
- Conflicting qualified candidates remain `BLOCKED` and return to their authority owner; the curator does not pick a product/architecture/policy winner.
- Unrelated concurrent edits are preserved.

Adapter locks or compare-and-swap mechanics may implement this policy, but the no-stale-write semantics are portable.

### Validation and review

Before writing:

- confirm the destination is project-owned, existing, canonical, and in scope;
- confirm evidence/current authority and check for contradiction/duplication;
- verify the size budget and no sensitive content;
- capture a reversible proposed diff against the current revision.

After writing:

- confirm only intended project guidance changed and user-level `AGENTS.md` did not;
- validate Markdown/frontmatter/registration syntax as applicable;
- verify the statement fits the destination's existing purpose and activation scope;
- run positive and near-miss behavior/trigger checks for material skill/rule changes;
- re-read for duplication, precedence conflict, staleness, and always-loaded context cost;
- independently review observable/consequential guidance changes under the settled verification policy.

If validation fails, do not present the change as retained learning. Recompute or restore only the curator's own reversible proposed change while preserving concurrent/user work, then return `BLOCKED` or an unapplied candidate.

The curation edit is excluded from candidate generation during the same pass, preventing self-referential learning loops.

### Curation handoff

```markdown
## Curation outcome
CURATED | NO DURABLE LEARNING | BLOCKED

## Source outcome
- Exact decision/specification/task/evidence revisions

## Candidates assessed
- Candidate → qualified/rejected/deferred → evidence

## Guidance changes
- Destination and before/after revision
- Added/updated/merged/removed logical statements
- Budget before/after

## Validation
- Syntax/scope/precedence checks
- Positive and near-miss checks when applicable
- Independent review/evidence

## Reported candidates
- Human-owned, cross-repository, new-artifact, or deterministic-tooling follow-ups

## Residual risk
- Conflicts, stale areas, privacy limits, or unprocessed evidence
```

The final workflow evidence index references this handoff. `NO DURABLE LEARNING` names the sources assessed; it is not an empty/no-op claim.

### Adapter boundary and cadence

Shared behavior owns:

- high-signal trigger semantics;
- candidate schema and evidence thresholds;
- neutral curator/write authority;
- destination and user-level boundaries;
- conflict/staleness/size rules;
- validation and completion outcomes.

Harness adapters may own:

- stop/session hooks and terminal-event detection;
- incremental transcript/evidence discovery and checkpoints;
- transcript paths, IDs, mtimes, generation markers, redaction transport, and privacy controls;
- scheduling/rate limits;
- curator model/role binding;
- target locks, compare-and-swap, and retry mechanics;
- provider-specific skill/rule discovery and validation transport.

Primary execution invokes curation explicitly after a settled high-signal outcome. An adapter-owned stop/cadence trigger is only a safety net: it runs when terminal evidence advanced but no curation result exists. It never substitutes periodic transcript mining for the terminal semantic gate and never writes user-level `AGENTS.md`.
