---
name: retrace
description: >
  Evaluate one repository's agent-harness configuration through human-approved
  scopes, scope-owned report-only Reconcile, and evidence-current consolidation.
  Use only when explicitly invoked for this read-only multi-scope evaluation,
  including parent-bound scope or normalization entries. Skip arbitrary documents,
  service traces, implementation, mutation, and persistent evaluator storage.
disable-model-invocation: true
---

# Retrace

Evaluate one bound repository harness through approved scopes without taking ownership of the changes that may follow.

## Invocation contract

The human-invoked parent fixes one existing readable workspace or repository root before discovery; a validated session working directory may supply it. Bind the raw human objectives in authored order. When the explicit request is general harness refinement, keep that exact request general rather than asking the human to narrow it. Portability across repositories, agents, harnesses, and topics stays within repository agent-harness configuration; it does not admit arbitrary evaluands.

On first read, bind any supplied expected-leaf locator as an evaluand locator, and bind any supplied execution record or transcript, handoff, plan, prior Retrace result, and implemented-fix locator by exact identity. Their absence never blocks static evaluation. Disclose evidence that is absent or unreadable and cap claims that depend on it.

Ask the whole current human-owned frontier in one round: the objective's intended meaning, protected behavior, exclusions, and remaining trade-offs. Iterate while any part remains missing, including constraints on a generic objective. Do not ask for repository facts that discovery can answer. Ask for later confirmation only when an answer changes the originally bound objective or protected behavior.

An invalid or unreadable root, or contradictory current authorities, produces the stable `blocker` disposition.

### Finding eligibility

Requested desired postconditions authorize findings; protected behavior constrains their evaluation and correction, not a separate cleanup objective. A finding is eligible only when current evidence demonstrates its causal contribution to an approved objective's gap or a necessary consequence of that gap's scoped correction. Readability, shared ownership/loading, or a preexisting conflict with a protection requirement alone is insufficient. Otherwise retain the observation only as an exclusion, boundary, or applicable constraint, not a finding or repair direction. Apply this distinction to the bound objective without narrowing a general harness-refinement request.

An instruction conflict meeting that finding-eligibility rule is a causal candidate, not unresolved authority. Use the blocker only when mutually incompatible current authorities remain after applying the bound human choices.

### Explicit child entries

This file has three entries: the human-invoked parent, the controller-owned
scope evaluator, and the optional controller-owned normalizer. The parent is
the root OMP session running this skill; it owns intake, human questions,
normalization, table approval, and presentation. The coded acpx controller at
`.config/agents/harnesses/omp/acp-controller/` owns every normalizer, scope
evaluator, and nested Reconcile reviewer session through public acpx and native
`omp acp`. The parent never launches, prompts, observes, or disposes those
sessions itself. A worker entry exists only as a controller request rendered
from `## Scope evaluator prompts`; a worker never starts another Retrace
parent, repeats table approval, or impersonates another scope.

Render each table for approval in the layout under "Approval surface" in the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md).

After approval, invoke the controller, handle its exit codes, and bind its models as the "Retrace" section of [the driver](../../harnesses/omp/acp-controller/driver.md) says.

The optional normalizer receives only its frozen normalization input and
returns a scope proposal, not findings, evaluation, or Reconcile. The scope
evaluator applies the complete Evidence boundary, Method, Readiness, and Result
below, which its prompt inserts, to its approved scope. The controller's
scope-owned logic runs that scope's delegated Reconcile, disposes its reviewers,
forms the scope result, and admits it at the root; the parent handles only
scope authority, the request, and presentation of the rendered aggregate.

### Explicit execution-recovery adoption

Retrace explicitly adopts the sole generic
[execution-recovery policy](../dev-implementation/references/execution-recovery.md)
for its approved active-session invocation, setup, transport, collection,
capture, and task-local execution machinery. Each responsible execution owner
assesses and corrects only its own eligible mechanism under that policy: the
outer parent does not take over a scope child's evaluation or its Reconcile
reviewers. This reusable skill-level adoption is known before the controller
run starts but is not retroactive authority for an existing, paused, stopped,
or historical run.

Normal use of an already-supported observation path for the same pending
operation is continuation, not a new evaluation or corrected execution.
Correcting failed machinery follows the generic policy. Return formatting and
semantic correction remain under Retrace or delegated Reconcile below. Neither
path authorizes child-work replay, report re-emission, owner replacement,
allowance reset, durable workflow state, or restart.

## Normalize and approve

1. Bind the root, raw concerns, supplied exact evidence locators, protected behavior, exclusions, and remaining trade-offs. Ask the whole missing human-owned frontier together. Invalid/unreadable root or unresolved contradictory current authority blocks, rather than widening discovery.
2. Normalize in authored order into stable scope IDs and names. Distinguish requested outcomes from cross-cutting tracing, comparison, and nonduplication instructions; allocate those instructions to every affected scope without inventing another outcome. One raw concern may be covered by multiple scopes. Merge overlapping concerns when one coherent objective/evaluand/invariant/evidence walk covers them; do not make one scope per bullet. Propose synthesis only for a genuinely additional combined decision, not shared source tracing or organization of directions. Handle clear cases in the parent. A genuinely vague or overlapping cluster may use one short normalizer actor with frozen identity-bound input: run `node .config/agents/harnesses/omp/acp-controller/cli.mjs normalize` the same way with the request `{"root", "concerns": [..], "input": "<frozen normalization input>"}`. The controller admits only the first valid `scope-proposal`, disposes that exact normalizer with observed exit before releasing its direct permit, and prints a `## Scope proposal` record; exit `0` means a proposal was admitted. That record remains a proposal for step 4, never an approved table.
3. Declare `requires`, `shared-evidence`, and `potential-conflict` separately. Declare `requires` only when the approved objective actually needs a predecessor's report; shared sources or cross-cutting comparison alone do not require one. Do not manufacture that need by rewriting a source walk as consumption of upstream reports. Only `requires` controls readiness, prerequisite depth, and invalidation propagation. Its predecessors must have current resolved results; a reviewed blocker is insufficient. Detect a `requires` cycle before approval and return it to normalization. Merge only under the coherent-scope rule; otherwise expose the exact human-owned coupling decision without dropping an edge or selecting a semantic winner. Shared-evidence and potential-conflict relationships may be cyclic and do not serialize readers.
4. Present only the complete two-column `Scope | Evaluate` table for approval: each row has its stable ID/name and one observable objective. Human edits replace that scope authority; recompute and re-present the entire table until approved. No scope evaluation begins before approval. Immediately before rendering each table, including a re-presented one, run `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` through `bash` from the repository root, with no request body unless a model change is pending; it runs the controller's capability preflight and launches nothing. On exit `2`, present its refusal verbatim and stop, except a `model choice` refusal below. On exit `0`, show its `Models:` list stdout verbatim directly after the table. The list reports the models and thinking levels of reviewers A and B, live `modelRoles` by default; model A also runs every scope evaluator, and the normalizer always runs on live A. It is outside the approved table. A human change of a reviewer's model or thinking level is a valid per-run adjustment under "Per-run model change" in [the driver](../../harnesses/omp/acp-controller/driver.md): pass the human's words as the `roles` body, never pre-resolving them, and never edit `config.yml` or any other `modelRoles` source. On a `model choice` exit `2`, ask the human once, listing the named candidates, and do not guess. On exit `0`, when models are the sole change, including inside `approve — …`, show this short gate and wait; a plain `approve` then starts the run with the override. Table edits keep the full re-presentation, now with the override note after the table. The override applies to every table re-presented for the same pending run and ends when that run's controller call is made; a later table goes back to the live defaults. Bind the exact complete approved table, human objectives/constraints/exclusions, exact scope contracts, actual human approval provenance, and any approved override as the exact `{selector}:{level}` pairs from the shown note in `models` in the `retrace` request.

   ```markdown
   ## Retrace scope table — models changed

   **Scopes**

   - {every scope ID} — table otherwise unchanged

   {roles stdout verbatim}
   ```
5. The request fixes the evidence baseline and each approved scope contract: objective, evaluand, protected behavior, exclusions, `requires` prerequisites, and evidence boundary. The controller freezes each contract, prerequisite report identity, and evidence observation itself before and during fan-out. A newly discovered objective-bound scope, including materially new synthesis, requires an updated complete table gate and a new request; independent already-approved work may continue. Rejected additions become explicit exclusions. Never manufacture an unbounded “other improvements” scope or silently change an approved objective, invariant, or evidence authority.

## Content and return transport

Only the admitted, domain-valid native `yield` candidate counts as a reply. Task, hub, Eval, any other `yield`, ordinary output, transcripts, history, agent output and generic collectors never count and are never a fallback.

The controller admits, per request, the first completed, non-error, terminal
native `yield` result with explicit `data` inside that request's own journal
window, then validates it against the closed domain schema for the phase the
controller expects. Native success alone is not a valid result. The controller
supplies owner, scope, request, and phase bindings in the request header; no
worker echoes them, and no correlation token belongs in the data. Reply, turn
result, and reuse are separate facts: an admitted reply stays authoritative
through a later turn failure, exit, or abort, while reuse needs a completed
turn.

A request stays pending until an admitted reply, a concrete terminal failure,
or an explicit controller abort; the controller sets no turn timeout. After
observer loss or uncertain delivery it re-watches from the last consumed
cursor for the same request and never resubmits the prompt. An unfinished
`yield`, uncertain delivery, an incomplete turn, or a tool outside `read`,
`glob`, `grep`, and `yield` stops that request at its exact frontier without a
re-ask. Workers run read-only with every permission request denied and
address sources by absolute path.

The controller freezes the exact complete UTF-8 bytes of each content record
under a controller-held locator. The record identity is the lowercase SHA-256
of those exact bytes, computed by the controller; prompts carry the complete
record text, and no model-authored digest echo is requested or accepted. Hash
bytes directly, never reconstructed prose, implicit concatenation, normalized
newlines, or tool-rendered anchors. A changed record at a bound locator is
drift and stops, never a new baseline. Keep these bindings in the controller
run, not in a new store. The scope report record starts with the exact line
`Kind: conversation`; that header is part of the reviewed and hashed bytes.

Nested Reconcile requests belong to the scope's own logic, never the Retrace
root. The root admits only scope results, never nested reviewer results, and
the parent session sees only the rendered aggregate.

### Closed return bodies

Workers return `yield` data of these variants; the controller expects exactly
the listed kinds per phase:

- Normalization: `scope-proposal` with `scopes` (each `id`, `name`,
  `objective`, `evaluand`, `requires`, `sharedEvidence`, `potentialConflict`)
  and `coverage` (each raw `concern` with its `scopes`). It carries the
  complete proposed scopes, raw-concern coverage, and graph, without
  evaluation.
- Scope evaluation: `candidate-ready` with `report` (the complete provisional
  scope report text), `manifest` (each supporting source's absolute `locator`
  and role `current` or `historical`), and `disposition` (`proposal`,
  `no-change`, or `blocker`); `source-need` with absolute `locators` and a
  `reason`; or `scope-paused` with the exact `frontier`.

From an admitted `candidate-ready` the controller builds closed LF-delimited
records. The first line is the exact operation; every subsequent
`Label: value` appears exactly once in listed order, with nonempty single-line
values. No blank, extra, or trailing line is allowed. Content stays in the
referenced records, never spliced into a body. Braced terms below are
substitutions, not literal values.

```text
candidate-ready
Parent: {actual parent}
Controller: {scope child}
Scope: {approved scope ID}
Scope approval locator: {readable locator}
Scope contract locator: {readable locator}
Candidate locator: {readable locator}
Evidence manifest locator: {readable locator}
```

```text
scope-result
Parent: {actual parent}
Controller: {scope child}
Scope: {approved scope ID}
Scope approval locator: {exact parent-frozen locator}
Scope contract locator: {exact parent-frozen locator}
Original candidate locator: {exact admitted provisional report locator}
Final report locator: {readable locator or none}
Evidence manifest locator: {readable locator}
Review status: {provisional | paused | stopped | complete}
Evidence freshness: {current | stale | unreadable}
Evaluation disposition: {proposal | no-change | blocker}
Result payload locator: {readable locator}
```

`Final report locator` is literal `none` only when no finalized report exists.
All duplicated locators/statuses must equal the referenced payload; the root
derives record identities itself from the frozen bytes.

### Delegated control body

The controller constructs `begin-reconcile` in process from the admitted
freeze, copying its locators unchanged. It freezes the complete admitted
`candidate-ready` record under a readable authorization locator and retains
that record's hash. The record's exact first line `candidate-ready` is its kind
header: do not prepend `Kind:` or wrap, reconstruct, or splice its content into
the control body. The same closed LF/field/order rules apply:

```text
begin-reconcile
Caller: retrace
Parent: {actual parent}
Controller: {scope child}
Scope: {approved scope ID}
Scope approval locator: {exact admitted locator}
Scope contract locator: {exact admitted locator}
Candidate locator: {exact admitted locator}
Evidence manifest locator: {exact admitted locator}
Mode: Conversation replacement
Authorization locator: {readable locator of the frozen admitted candidate-ready body}
```

Before any reviewer prompt, the delegated Reconcile validates every field: the
exact first line, field order and single-line values; `Caller` exactly
`retrace`; `Scope` equal to the owning scope; `Mode` exactly
`Conversation replacement`; every locator a frozen record of this run; the
candidate locator bytes equal to the report under review; and the
authorization bytes' hash equal to the admitted `candidate-ready` record. A
rejected body stops that scope before any reviewer exists. Neither a locator
nor a matching hash substitutes for the in-process parent binding, current
phase, or one-time admission.

## Scheduler and scope protocol

The controller keeps only run-local approved scope/graph bindings, exact
run/actor/request identities, report/evidence identities, direct-capacity
occupancy, status/frontiers, current return expectations and their re-ask
counts, and results/provenance needed to finish. It creates no searchable
result archive or persistence API.

It orders ready scopes by ascending `requires` depth then authored scope order
and runs them in available direct capacity. At most four direct
normalizer/scope actors may be live at once; nested reviewers do not consume
direct capacity. A reply, turn completion, failure, or abort never frees a
permit: the scope must first dispose its reviewers, and its evaluator must show
observed exit before the permit is released. Free permits remain usable while
siblings continue. Undisposed scopes holding every permit are a quiescent
blocked frontier, not permission to replace actors or exceed capacity. A scope
whose `requires` predecessor finished without a current resolved result stops
with that frontier.

1. The scope evaluator performs the single-scope evaluation from the
   `evaluate` prompt and returns `candidate-ready`. This report is provisional
   and non-authoritative. A `source-need` or `scope-paused` return is answered
   in the same session by a `continue` request for the same step.
2. The controller admits only the first valid reply of that exact request and
   validates the report header, the manifest's absolute locators inside the
   bound root or approved evidence, and the Result shape. A mismatch follows
   the re-ask budget below; the controller does not redo evaluation, rewrite
   findings, or add a loop. It freezes the report, the manifest with each
   locator's observed identity, the scope approval and contract, and the
   `candidate-ready` record, retaining the hashes it computed.
3. It builds the `begin-reconcile` control body above from that freeze and runs
   the scope's delegated Conversation replacement Reconcile in process.
4. Delegated Reconcile owns A-first review with a scope-owned reviewer pair,
   the same-A first-review `rethink`, demand-driven B turns, original-A closure
   when negotiation returns to A, response re-asks, application of the report
   replacement, and exact reviewer disposal. It is report-only and never runs
   Artifact edits. The Retrace root neither consumes reviewer traffic nor
   disposes reviewers.
5. After review, the scope's logic disposes both reviewers with observed exit,
   re-reads the manifest for freshness, and then forms the complete
   `scope-result`. Its immutable payload contains, in this exact order: original
   provisional report locator; ordered authoritative Reconcile events; final
   report locator or exact stop record; final supporting evidence-manifest
   locator; provisional-to-final changes; review status; evidence freshness;
   evaluation disposition; blocker/resume information. Referenced record
   identities are computed from the frozen bytes, not duplicated as
   producer-authored digest fields in this payload.
6. The root admits only the first `scope-result` per scope after checking the
   closed body, the parent and scope bindings, every referenced frozen record,
   and that duplicated statuses and locators equal the payload. Review
   success, matching identities, and freshness cannot expand approved scope. A
   mismatch stops that scope rather than being rewritten. A reviewed blocker
   remains authoritative. After admission the controller disposes the exact
   scope evaluator and releases its direct permit only on observed exit.
   Independently successful siblings and their results survive any other
   scope's failure or cleanup blocker.

### Re-ask budget per original return

Normalization and scope evaluation (`candidate-ready`) are separate original
expectations. Each allows at most three re-asks in total across data format,
applicability, and boundary defects; the fourth invalid return stops that
expectation. A new request, phase wording, error category, or duplicate never
resets or creates another budget.

A return is invalid when the request completes without a `yield`, the `yield`
data fails the phase schema, or an admitted `candidate-ready` breaks the scope
boundary: a report that does not start with `Kind: conversation`, or a manifest
locator that is relative or outside the bound root and approved evidence.
Tool-policy violations, an unfinished `yield`, uncertain delivery, an
incomplete turn, or a controller stop are not invalid returns: they stop that
request at its exact frontier without a re-ask. Foreign, stale, and consumed
replies cannot be relabeled as the attempted current return.

A re-ask is one new `reask` request to the same actor under the original
expectation, naming the concrete defect and the complete required shape.
Preserve the original expectation and its count. Do not restart evaluation,
replay completed work, reset nested review budgets, replace actors, rewrite
findings, change evidence, widen scope, or override Reconcile repair rules.
A `source-need` or `scope-paused` return is not invalid and costs nothing; the
same step continues. Asking again for the same sources or recording the same
frontier again stops the scope.

An exhausted budget, a terminal or unavailable actor, or another stop ends
that scope at its exact frontier while preserving successful siblings and
continuing independent approved work subject to capacity and cleanup. Do not
fabricate a return or start a fresh attempt automatically.

This re-ask budget is semantic protocol authority, not generic execution
recovery. Under Retrace's explicit adoption, the responsible owner may correct
eligible failed call or capture machinery for the already-authorized operation
without issuing another semantic request, refunding a spent re-ask, or
replaying worker work. Supported observation of that same still-pending request
is continuation. A valid blocker or pause and the terminal stops above remain
owned here and cannot be relabeled to bypass them.

### Review, resolution and retention

Review status is `provisional | paused | stopped | complete`; freshness is
`current | stale | unreadable`; disposition remains
`proposal | no-change | blocker`. Resolved means exactly `complete` review,
`current` evidence and `proposal` or `no-change`. A `bounded-validation`
proposal can resolve evaluation, never implementation. A complete/current
reviewed blocker is authoritative about unresolved evaluation but cannot
satisfy `requires`.

An admitted first reply remains authoritative despite later turn failure or
abort; turn/reuse outcome and cleanup remain separate runtime facts. Valid
blocker/paused reports are not failures to retry. A `scope-paused` frontier is
answered once in the same session; no further human input exists inside one
controller run, so the evaluator finishes from the approved evidence and
states that frontier as a limit or blocker. Resume only with explicit
authorized continuation in a new approved request, never by rerunning a
stopped scope. Terminal stops inherit Reconcile cleanup before a final stopped
result. Failed cleanup is neither success nor a released permit. Scope actors
alone dispose reviewers; the outer parent disposes exact scope actors.

## Evidence boundary

Use only the bound root and exact locators admitted by this boundary. Before every target-file operation, classify its exact locator immediately by pointing to locator text that appears verbatim in intake, an injected repository declaration, or already-read content, or to an existing active-harness conventional name while no declaration resolves. Start with repository-declared guidance and configuration entries. The conventional-candidate class is narrow, never materializes a candidate, and expires as soon as any declaration resolves. After declaration resolution, admit only the three verbatim sources and close discovery over exact files. A filename token, role, directory, prefix, suffix, locator pattern, or any combination of those hints cannot supply a locator. If no class applies, do not perform the operation; preserve the exact unresolved gap.

Classify each operation by causality before it runs. An evaluand operation can affect the bound repository evaluation; a supplied-evidence operation reads only an exact optional-evidence locator. Both classes remain inside the locator closure above. A runtime-control operation is authorized only by this explicit normalization/scope/Reconcile protocol (including bound Reconcile/rethink contract loads, reviewer traffic, and native transient content transport) or an independently injected higher-priority obligation; path, name, content, or its own label is never enough. Keep every runtime-control operation and its authority trace-visible, but quarantine its contents from the evaluand: they cannot admit or seed a target locator, role model, finding, evidence claim, readiness input, or direction. Approved upstream reports supplied to a synthesis scope are bounded evidence under its separately approved contract, not incidental control traffic. A runtime-control operation neither widens nor satisfies the evaluand closure; if its contents cross that boundary, do not return an evaluation result.

Build an objective-bound role model covering the guidance entry, setup and injection, maps and indexes, responsibility owners, leaf instructions, protected behavior, and exclusions. Classify authority as current or historical. An exact declared guidance path may be read inside a hidden directory, but do not list, glob, grep, or search that directory for state or prior results.

Read optional execution, history, candidate, cost, check, and implemented-fix evidence only at supplied locators. Treat an explicitly supplied broad-search candidate locator as supplied evidence: read that exact file exactly once before adjudicating its objective and directional linkage. Its contents cannot admit or seed a target locator, role graph or model, finding identity, readiness input, direction, or other discovery. Return exact locators and only the minimal redacted quotations needed for a claim. Do not search an ambient transcript corpus, history, memory, hidden state, prior-result collection, or ledger.

Historical contents cannot prove a current fact or normally admit a current locator. A single provisional-locator bridge applies only when a supplied history identity's normalized objective class exactly matches the current normalized objective class and the current declared walk ends at a missing edge: take only the exact root-relative leaf locator in that identity's evaluand, resolve it beneath the bound current root, and read that exact file as an evaluand. Bind the current owner, invariants, and evaluand only from that current file's contents and the current walk. Do not use the bridge for a different objective class, unsupplied history, an absent or unreadable current file, a directory or ambient search, or a locator outside that exact identity.

Within that closure, never target a directory path with a read, list, glob, grep, search, or other discovery operation, and do not probe a locator outside the closure. Direct reads of exact named files beneath directories remain allowed and are required for every objective-linked file bound by the closure.

## Method

1. Bind the root, objective, human-owned constraints, evidence identities, protected behavior, and exclusions. Stop discovery outside that scope. Apply the Invocation contract's finding-eligibility rule before qualifying any finding or selecting its correction; an admitted evidence locator alone does not establish causal eligibility.
2. Immediately before each file operation in this and later steps, classify it as evaluand, supplied evidence, or runtime control. For an evaluand or supplied-evidence operation, apply the evidence-boundary classification to its exact locator; an unclassified locator remains a named gap rather than an operation. For runtime control, require the explicit orchestration authority or independently injected higher-priority obligation above and enforce its trace-visible quarantine. Independently reconstruct the canonical owners and coverage a correct fresh run should load for the objective. Complete that reconstruction from current authority in both directions before reading a supplied execution locator or comparing its loaded coverage, and keep historical authority separate from current authority.
3. Walk from each declared entry toward required leaves and from each named required leaf back toward its harness entry. A bound expected-leaf locator names required expected coverage: after reading the entry, injection rule, and applicable map in successive waves, read that exact leaf even when the forward chain omits it, assess the leaf on its own terms, and reverse-trace its owner and harness link. Work in named-gap waves: resolve only the next objective-linked missing owner, map, injection edge, or instruction, then repeat until both directions close or an exact gap remains. Do not substitute one exhaustive search. For an explicitly supplied broad-search candidate, perform the required supplied-evidence read before adjudicating linkage; exclude it when it has no objective link or either directional trace, state the missing objective and directional linkage, and derive no finding identity, readiness input, or direction from it.
4. When execution evidence is bound, judge delivered-outcome validity against its acceptance evidence separately from harness quality. Then compare independently reconstructed expected coverage with loaded coverage. Repeated, redundant, or missing harness work may qualify as waste without invalidating a delivered outcome that is valid.
5. For each candidate finding, bind the objective impact, root cause, owner, evaluand, invariants, and one identity with exactly four parts: objective class, owner, root-cause class, and evaluand. Normalize objective class as `<stable scope qualifiers> <missing capability> coverage`: derive the stable scope qualifiers from the complete bound objective, retain every qualifier in its original order, form the missing capability from the desired postcondition that the objective lacks rather than copying the objective's activity head, and exclude symptom and recommendation wording. When that desired-state capability is nonempty without a generic activity head, omit the head so it cannot remain immediately before `coverage`; append `coverage` exactly once. Normative contrasts: `fresh-run` plus omitted `process-cost review` becomes `fresh-run process-cost coverage`, never `fresh run process-cost review coverage` or `fresh-run process-cost review coverage`; preserving all responsibilities and accepted outputs while eliminating duplicate owner resolution becomes `all-responsibilities and accepted-outputs preserving single owner coverage`, never `all-responsibilities and accepted-outputs preserving single owner resolution coverage`. For a directional discovery-chain gap, normalize the root-cause class to `discovery-chain omission` and the evaluand to the exact broken map-to-leaf edge written `<map locator> to <leaf locator>`; do not broaden either part to the whole role model. When either map or leaf locator is beneath the bound root, render it root-relative with portable `/` separators in the identity only and retain its full exact locator in the evidence fields. Keep current evidence and historical claims distinct.
6. If the walk exposes a new human-owned uncertainty, return the whole current frontier to the outer parent for the human together and iterate only under authorized context. Never turn a discoverable fact into a question or change scope authority; a new objective follows the complete table gate.
7. Compare, in order, no change, reuse, the smallest extension, bounded validation, and redesign without favoring the incumbent. Size each candidate against the root-cause class, not only the observed instance: when that class is mechanically detectable, wiring an existing check counts as reuse, and a deterministic guard the repository can own (type, lint rule, test, hook, script, or a purpose-built tool it lacks) outranks added instructions, which stay for judgment calls. Count implementation, integration, migration, review, runtime, conflict, ongoing ownership, and always-loaded context cost, plus the recurrence risk each candidate leaves open; prefer deleting, scoping, or relocating guidance before adding always-loaded text. Select one coherent direction. For every evaluated redesign candidate, determine and report separately whether it preserves the named responsibilities and invariants, names one adjacent check, and proves total cost lower than no change, reuse, the smallest extension, and bounded validation. Mark each gate `proved` or `absent`. If any gate is absent, reject redesign and name every absent gate as a rejection reason; unrelated objective linkage or directional coverage, generic cost, and generic scope cannot substitute for a gate verdict. Admit redesign only when all three gates are proved.
8. Before any proposal, normalize the current objective class and compare it with the objective class in each supplied four-part history identity. Apply the evidence boundary's provisional-locator bridge only after its predicates pass, then complete the current identity from current evidence and compare all four parts. The same identity with the gap proved gone is `no-change`. The same identity with the gap still present after a supplied promoted or implemented fix is `failed-fix`; explain exactly why that resolution missed. A different identity is `novel`. With no prior-result or implemented-fix locator, disclose `history unbound` and continue without a historical claim.

## Readiness

Readiness is cumulative completeness, never confidence or a score:

- **G1** binds a valid root and objective and cites evidence with current or historical classification.
- **G2** closes entry-to-leaf and leaf-to-harness coverage and independently reconstructs expected fresh-run coverage; when execution exists, it also binds loaded coverage.
- **G3** binds root cause, owner, evaluand, invariants, the four-part finding identity, and objective linkage.
- **G4** closes the solution ladder, rejected alternatives, total cost, validation or adjacent proof, canonical and route impact, and the required comparison with supplied history.

No G1 permits only `blocker`. G1 alone is `low`; G1 through G2 is `medium`; G1 through G3 is `mid-high`; G1 through G4 is `high`. The weakest unmet gate caps the label. At `low`, emit no proposal. At `medium`, only a `bounded-validation` proposal is permitted. At `mid-high` or `high`, a `refinement` proposal is permitted only when its ladder rung passes; redesign additionally requires its preservation, adjacent-check, and winning-total-cost gates. A proved `no-change` is not a proposal and remains governed by the history comparison.

## Result

Before returning the result, inspect every section and render every claim-bearing repository-file reference, not only an evidence citation, as its full exact locator resolved against the bound root, or preserve its full URI and selector. Only the evaluand field inside a four-part identity may render a beneath-root locator root-relative; every other repository-file name, shorthand, or root-relative reference blocks return until fully rendered.

Keep source quotations verbatim; never expand a path inside a quotation or exempt quoted paths from the full-locator rule. Select smaller exact source spans that contain no abbreviated file reference, and state the path relationship separately in unquoted prose using full locators. Describe proposed map changes with full-locator prose rather than embedding root-relative map serialization. Preserve the evidence and claim; if no faithful compliant presentation is possible, expose that exact frontier. A current candidate rejected solely for this presentation defect follows the existing one-correction eligibility check: when the same child and required state remain available, have that child correct only presentation and freeze its complete corrected records at fresh locators with parent-retained hashes. The parent never rewrites the report or source quotations.

Each scope report starts with `Kind: conversation`, followed by these Markdown sections in this exact order, omitting only `Outcome Validity` when no execution evidence is bound. The header is part of the reviewed and hashed bytes, not a new Result section. Freeze and retain the complete reviewed report bytes as aggregate supporting detail; never replace them with a status summary or rewrite their headings for nesting:

1. `## Bound Intake and Scope Model` — root, objective, bound or absent evidence, human-owned constraints, role model, protected behavior, and exclusions.
2. `## Outcome Validity` — delivered acceptance judgment and its evidence, kept separate from harness quality.
3. `## Historical and Current Harness Coverage` — current and historical authority, expected fresh-run coverage, both directional walks, loaded-coverage comparison when applicable, history branch, and excluded issues.
4. `## Qualified Findings` — each finding's four-part identity, readiness, root cause, owner, evaluand, invariants, objective impact, full exact evidence locators resolved against the bound root with schemes and selectors preserved, and minimal redacted quotations.
5. `## Refinement Direction, No Change, or Blocker` — exactly one disposition: `proposal`, `no-change`, or `blocker`. A proposal has subtype `refinement` or `bounded-validation` and obeys the readiness cap. State the one direction, five-rung solution ladder, rejected alternatives, total cost, and required validation. For every evaluated redesign candidate, report separate `proved` or `absent` verdicts for named-responsibility-and-invariant preservation, one adjacent check, and total cost lower than each smaller rung; when redesign is rejected, include every absent gate among its rejection reasons. For a blocker, state the exact resume condition. Include a short **Aggregate summary** authored by the scope: put the bold label `**Aggregate summary**` on its own line, then give each distinct finding as four one-line bullets in this order: `- Identity: {objective class} · {owner} · {root-cause class} · {evaluand}` with its complete four-part identity, `- Finding: {finding and consequence}`, `- Direction: {direction}`, and `- Validation: {required validation}`. For `no-change` or `blocker`, Identity may be `none`, Finding states the corresponding disposition and frontier, and Direction and Validation are `none` when nothing applies. This summary remains inside the report reviewed by Reconcile.
6. `## Canonical Impact and Transfer` — canonical and route impact, owners to reopen, and the caller-owned next transfer.

Keep the direction coherent across sections. Do not emit a native handoff.

## Freshness and aggregate

Each evidence-manifest entry records its exact readable locator/selector, current or historical role, admission provenance, and observed exact source-content identity or explicit `absent`/`unreadable` observation and error. Account for all evidence admitted during evaluation and review, distinguishing actual supporting sources and exact prerequisite report identities. Hash exact bytes/content, not rendered anchors; never invent a failed-read digest.

Re-read supporting sources and compare the same locators/observations before final acceptance, then again for all accepted reports immediately before aggregate presentation, including synthesis and reviewed blockers. Unchanged known absence can be current evidence for a truthful blocker; inability to re-establish previously readable evidence is `unreadable`. Historical evidence remains historical even when unchanged. Do not silently adopt changed bytes.

A changed source invalidates every report that actually relied on it plus their transitive `requires` dependents. Shared-source readers may each be directly stale; `shared-evidence` by itself propagates nothing. Preserve unaffected current reports, every reviewed/observed identity, provenance and exact unreadability error. No automatic reevaluation follows drift.

Emit exactly these four H2 aggregate sections in order, using the Result full-locator rule throughout. Use H3 headings for individual scope displays and short bold labels within them. Keep the decision-first front concise: exclude full event tables, raw reviewer answers/findings, and routine request/hash chatter. Do not impose a word cap; material recovery, capacity, cleanup and freshness exceptions remain visible.

1. `## Result` — lead with aggregate `complete | partial | blocked`, resolved/admitted scope count, counts by evaluation disposition, material blockers, and the boundary between completed evaluation and unperformed implementation.
2. `## Scope Results` — include every approved scope in graph order (ascending `requires` depth, then authored order). Lead with a table whose columns are exactly `Scope | Disposition | Outer rounds | Report updates | VALID by round`, then give each scope an H3 display for details not carried by the row. Keep review status, evidence freshness and evaluation disposition distinct. Put each paused, stopped, unavailable, stale or unreadable exception and its exact current frontier alongside that scope; never hide an exception behind a proposal label. State facts shared by several scopes once.
3. `## Findings and Directions` — materialize each distinct finding as one entry in this section of one-line `Identity`, `Finding`, `Direction` and `Validation` bullets: its complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation. Disposition stays in the Scope Results row and is not repeated. A scope-authored summary without those bullets is shown as authored, and no identity is invented for it. A pointer to supporting detail, a statement that the identity exists there, or an identity that appears only in `## Evidence and Limits` or an embedded report does not satisfy this section. Deduplicate only entries with matching complete identities. Preserve material readiness, owner, protections, disagreements and every contributor. Derive the concise wording from the scope-authored summary inside the immutable report reviewed by Reconcile. The parent may organize accepted content; it never authors a novel combined recommendation or maintains a second copy of the same invariant.
4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, authoritative review evidence, and each scope's open notes. Show each scope's ordered events as one arrow-joined line and each manifest entry as `locator (role) identity`, and put the complete immutable reviewed reports last, under `### Reviewed reports`, one bold scope label per report. Open notes are the notes the scope's delegated Reconcile returned because the other reviewer was never sent them; list them under that scope as a bold `Open notes` label with one `{A|B}: {note}` child per note, copied byte-for-byte, and never in `## Result`, `## Scope Results` or `## Findings and Directions`. A note grants no permission to change the repository or evidence. First probe whether the actual harness gives the human terminal/native reader access to existing request-local supporting records; model or tool readability alone is not human access. Use an exact supporting-detail locator only when that human access is established. Otherwise render the complete detail inline after the concise front in a byte-faithful literal block whose delimiter cannot collide with the report, rather than rewriting headings or report content. A local locator alone proves neither readability nor permanence. Add no archive, persistence API or independently maintained duplicate report.

Derive the three review-history columns from the ordered admitted events, never from a second state ledger. An outer round is an actual Reconcile outer iteration entered, including unchanged closure. A report update is only a committed replacement of the canonical conversational report. `VALID by round` names, for each round in chronological outer order, the reviewer whose admitted finalized `VALID` ended that round; a `VALID` that went on to the other reviewer did not end its round. Initial provisional responses, same-child rethink, synchronization, formatting corrections and other control events create no round, update or verdict. Never infer rounds as updates plus one. An entered incomplete round has no finalized `VALID`; show that fact and its exact frontier even when an earlier round ended `VALID`, because earlier acceptance does not complete a stopped or paused run. Within each scope bind `A` and `B` once in supporting detail to the actual reviewer identities; each round entry names only the reviewer that ended that round, not dual approval.

Resolve apparent conflicts only when exact current authority/evidence determines the answer. No majority vote, semantic override or unreviewed claim that independently acceptable changes are safe together.

A materially new combined recommendation needs a newly approved synthesis scope under Normalize and approve's additional-decision test. Bind accepted upstream report identities as bounded evidence, declare true `requires` edges, and use the identical child/Reconcile/freshness path. Do not add a default synthesis or review layer merely to trace shared sources, compare, or organize existing reviewed directions.

Before presenting the aggregate, require every completed or terminal scope to
have its connection-owned reviewers disposed and its exact direct actor
disposed. Close the named run for any remaining declared state and require the
exact `closed` result. A failed, partial, or unobserved disposal/close remains
an unresolved cleanup frontier, retains its stable identities and evidence,
and blocks aggregate `complete`; never infer cleanup from a reply, turn
completion, status wake, terminal report, or host teardown.

Aggregate `complete` means every admitted scope has a current resolved result and no unresolved dependency/conflict/freshness frontier. `partial` means at least one current resolved result and some admitted work/frontier unresolved. `blocked` means graph formation failed or no current resolved result exists, even if truthful blockers were successfully reviewed. Unresolved runtime/cleanup frontiers preclude complete success. Human acceptance of partial never relabels it complete.

At graph quiescence collect all remaining blockers once, preserving review/disposition/freshness distinctions. Continue independent ready work while capacity allows; never replace an actor or release an undisposed direct permit. Recommend the smallest applicable action: supply/select evidence or authority, approve a revised table, authorize a fresh evidence/transport-bound attempt, accept partial, or stop.

## Stops

Bare non-repository URLs, documents, and service traces are ineligible evaluands. Missing optional evidence limits claims but does not stop static evaluation; contradictory current authority does.

Remain a read-only lens. Dispatch only the declared normalization/scope children and scope-owned report-only Reconcile. Permit only request-local runtime state and the host's native transient content transport; no repository/evidence mutation, external effects, persistent evaluator store, ledger, index, result archive, history search, or new persistence API. Reconcile may correct only its scope's conversational report, never source evidence, objectives, protected behavior, exclusions or another scope. Recommendations grant no implementation authority.

Do not approve human decisions, author plans, implement or repair repository changes, own an engineering handoff/route/lifecycle, run automatically, or add an assurance/completion/shipping tail. Stop above planning; all later handoffs, plans, mutations, routes and delivery effects remain caller-owned.

Resume only after changed evidence, authority, transport, scope or a falsifiable hypothesis with applicable explicit continuation/fresh-attempt authority. Do not ask the same unchanged frontier twice; close the affected scope as blocked for that run. Observation expiry alone is not semantic failure. No Retrace time/round cap or automatic retry is added; inherited Reconcile capacity/liveness and cleanup rules remain in force.

## Scope evaluator prompts

The controller reads each section below, from its marker to the next marker or
heading, as the one editable copy of a scope, continuation, re-ask, or
normalizer request. It fills double-brace slots per request and inserts the
named sections of this file by exact heading at load time, so Finding
eligibility, Evidence boundary, Method, Readiness, Result, and Normalize and
approve are never duplicated here. The `reask` template is shared by scope
evaluation and normalization.

<!-- prompt:evaluate -->
You evaluate one approved Retrace scope under the bound repository root `{{ROOT}}` in your own native `omp acp` session. You are read-only: use `read`, `glob`, and `grep` on absolute paths only, never edit files or run commands, and reply only through one final `yield`. The Retrace controller owns the approved table, scheduling, this scope's delegated Reconcile review, freshness, admission, and the aggregate; you perform only the single-scope evaluation. Your working directory is an empty scratch directory.

Approved scope:

- Scope: {{SCOPE_ID}} {{SCOPE_NAME}}
- Objective: {{OBJECTIVE}}
- Evaluand: {{EVALUAND}}
- Protected behavior: {{PROTECTED}}
- Exclusions: {{EXCLUSIONS}}
- Human objectives in authored order: {{OBJECTIVES}}
- Human constraints: {{CONSTRAINTS}}

Approved evidence (locator and role):

{{EVIDENCE}}

Prerequisite scope reports (exact admitted identity, then the complete report):

{{PREREQUISITES}}

Apply these sections of the Retrace skill completely to this scope:

{{SECTION:Finding eligibility}}

{{SECTION:Evidence boundary}}

{{SECTION:Method}}

{{SECTION:Readiness}}

{{SECTION:Result}}

Return one of these through one final `yield` with explicit `data`:

- `candidate-ready`: `report` is the complete scope report text under Result, starting with the exact line `Kind: conversation`; `manifest` lists every supporting source you relied on with its absolute `locator` and role `current` or `historical`, each inside the bound root or the approved evidence; `disposition` is `proposal`, `no-change`, or `blocker`.
- `source-need`: absolute `locators` you need and cannot read yourself, with a `reason`.
- `scope-paused`: the exact whole `frontier` of a new human-owned uncertainty under Method step 6. It is not terminal; the controller answers in this same session.

Task, hub, Eval, a `yield` that is not your one final result, ordinary output, transcripts, history, and agent output are not a reply. Worked example of the shape only:

```json
{{EXAMPLE}}
```

<!-- prompt:continue -->
{{CONTINUATION}}

Continue the same evaluation of scope {{SCOPE_ID}} under the same sections, evidence boundary, and authority, and return one `candidate-ready`, `source-need`, or `scope-paused` through one final `yield` with explicit `data`. Worked example of the shape only:

```json
{{EXAMPLE}}
```

<!-- prompt:reask -->
Your previous return for this step was not accepted: {{DEFECT}}

Repeat the same step with the same authority and evidence; do not restart completed work or widen scope. The only accepted reply is one final `yield` with explicit `data` of this shape:

```json
{{EXAMPLE}}
```

<!-- prompt:normalize -->
You are the optional Retrace normalizer for the bound repository root `{{ROOT}}` in your own native `omp acp` session. You are read-only: use `read`, `glob`, and `grep` on absolute paths only, never edit files or run commands, and reply only through one final `yield`. Return a scope proposal only: no findings, evaluation, or Reconcile.

Raw concerns in authored order:

````text
{{CONCERNS}}
````

Frozen normalization input:

````text
{{INPUT}}
````

Apply steps 2 and 3 of this section of the Retrace skill; the parent owns steps 1, 4, and 5:

{{SECTION:Normalize and approve}}

Return one `scope-proposal` through one final `yield` with explicit `data`: `scopes` lists each scope with a stable `id`, `name`, one observable `objective`, `evaluand`, and its `requires`, `sharedEvidence`, and `potentialConflict` scope IDs; `coverage` maps each raw `concern` to the `scopes` covering it. Every link names another proposed scope, and `requires` stays acyclic. Worked example of the shape only:

```json
{{EXAMPLE}}
```
