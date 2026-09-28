# Plan rethink

Re-examine the current candidate once in the same author. Treat its proposed
mechanisms, boundaries, and proof choices as hypotheses. Preserve confirmed
outcomes and constraints; reconsider only decisions this author owns.

Resolve the applicable current sources:
- skill://dev-ticketing/references/task-sizing.md for new task boundaries;
- skill://dev-implementation/references/test-value.md for new proof choices;
- rule://plan and rule://plan-impl-spec for execution-plan artifacts;
- the bound specification and applicable canonical project contracts;
- the actual host's draft adapter that rule://plan names, only when publishing
  a plan.

Reuse current material already loaded. Retrieve missing or stale sources;
do not replace authoritative content with remembered summaries.

1. Separate the required outcome from the proposed mechanism. Compare the
   strongest viable simpler approach, including reuse or planless execution
   where the current authority permits it. Count ownership, integration,
   operating cost, and maintenance—not merely files, tasks, or lines.
2. Apply the sizing policy to new boundaries. Consider the complete worker
   attempt and reliable context fit separately. Reject artificial scaffolding,
   hidden work, conflicting ownership, and unnecessary dependencies.
3. Apply the shared proof-selection policy to checks this author may select.
   Preserve every obligation. Challenge incidental implementation constraints,
   and expensive execution that policy shows redundant; fewer tests is not
   itself success.
4. Check that a fresh owner can act from the candidate: required inputs,
   capabilities, effects, fixtures, observations, and cleanup must be clear.
   Distinguish established facts from unresolved assumptions; invent no proof.
   Each owner must be able to meet everything that gates its own handoff from
   what exists by then; a later role's result cannot satisfy it. Every
   obligation, including cleanup that must wait for a later role, needs an
   owner whose role permits it and who can complete it when due.
5. Check authoritative revisions and exact projections. Do not silently change
   inherited acceptance, repartition an approved graph, expand effects, or
   alter assurance. Return an out-of-authority correction to its owner.
6. Make one bounded correction pass for concrete gaps or a demonstrably better
   eligible choice; otherwise preserve the candidate. Run applicable structural
   validation and return through the existing approval or handoff procedure.

Keep material rationale and unresolved risks in existing prose. Add no sizing
fields, rethink ledger, approval gate, or recursive review. Structural validity
does not establish design quality or runtime success.

## When it runs

Run it once after a substantive specification, plan, ticket-graph, or planless
direct-contract candidate exists, before final submission, approval, execution
readiness, child dispatch, or Handoff. A graph that newly selects ownership or
dependencies is substantive even when acceptance is an exact projection.

- An inline author explicitly reads it as a separate post-candidate step.
- A delegated author first returns the candidate. The caller then sends this
  file once as an explicit follow-up to that same author before accepting the
  final Handoff or execution-ready plan; the author applies it and returns the
  revised or preserved candidate through its existing procedure.
- Make at most one bounded correction to decisions the author owns; otherwise
  preserve the candidate.
- An exact unchanged projection of an approved contract or graph, a storage
  copy, a checkbox or lifecycle-only update, and an unchanged approved contract
  do not trigger another pass.
- The follow-up adds no route owner, stage, approval gate, or caller authority.
  If the same author cannot receive it, stop rather than substitute another
  author.
- This is a pre-readiness planning-author pass, distinct from implementation
  code-then-test rethink and execution-recovery rethink, and it never
  manufactures a repository plan.
