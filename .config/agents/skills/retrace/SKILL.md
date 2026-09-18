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

Requested desired postconditions authorize findings; protected behavior constrains their evaluation and correction, not a separate cleanup objective. A finding is eligible only when current evidence demonstrates its causal contribution to an approved objective's gap or a necessary consequence of that gap's scoped correction. Readability, shared ownership/loading, or a preexisting conflict with a protection requirement alone is insufficient. Otherwise retain the observation only as an exclusion, boundary, or applicable constraint, not a finding or repair direction. Apply this distinction to the bound objective without narrowing a general harness-refinement request.

An instruction conflict meeting that finding-eligibility rule is a causal candidate, not unresolved authority. Use the blocker only when mutually incompatible current authorities remain after applying the bound human choices.

### Explicit child entries

This file has three entries: human-invoked parent, parent-bound scope evaluator, and optional parent-bound normalizer. Admit a child entry only from its actual native parent with the matching request and scope authority. A child never starts another Retrace parent, repeats table approval, or impersonates another scope.

Use an existing controller-capable host child for each scope, bound read-only
over repository and evidence. Do not use second-opinion roles as scope
controllers: those restricted reviewers cannot own nested reviewers. Launch
allocation binds only a prospective role, parent, and request/scope contract.
Let the child's launch-only turn settle locally and retain its complete original
native settlement observation in the actual parent's invocation state before
establishing its exact registered, addressable child ID and actual parent through
the current host roster or equivalent native registration evidence. Retain that
complete original roster observation in a separate binding slot before sending
the actual normalization or evaluation request with its own unique reply token.
Launch output, launch settlement, and roster presence are distinct from semantic
readiness or report admission, and later observations cannot replace either
earlier slot.

The optional normalizer receives only its frozen normalization input and returns a scope proposal, not findings, evaluation, or Reconcile. The scope evaluator applies the complete Evidence boundary, Method, Readiness, and Result below to its approved scope, then follows the Scope protocol. It retains control of its own Reconcile and reviewer disposal; the outer parent handles only scope authority, scheduling, return admission, freshness, and aggregation.

### Explicit execution-recovery adoption

Retrace explicitly adopts the sole generic
[execution-recovery policy](../dev-implementation/references/execution-recovery.md)
for its approved active-session invocation, setup, transport, collection,
capture, and task-local execution machinery. Each responsible execution owner
assesses and corrects only its own eligible mechanism under that policy: the
outer parent does not take over a scope child's evaluation or its Reconcile
reviewers. This reusable skill-level adoption is known before launch but is not
retroactive authority for an existing, paused, stopped, or historical run.

Normal use of an already-supported observation path for the same pending
operation is continuation, not a new evaluation or corrected execution.
Correcting failed machinery follows the generic policy. Return formatting and
semantic correction remain under Retrace or delegated Reconcile below. Neither
path authorizes child-work replay, report re-emission, owner replacement,
allowance reset, durable workflow state, or restart.

## Normalize and approve

1. Bind the root, raw concerns, supplied exact evidence locators, protected behavior, exclusions, and remaining trade-offs. Ask the whole missing human-owned frontier together. Invalid/unreadable root or unresolved contradictory current authority blocks, rather than widening discovery.
2. Normalize in authored order into stable scope IDs and names. Distinguish requested outcomes from cross-cutting tracing, comparison, and nonduplication instructions; allocate those instructions to every affected scope without inventing another outcome. One raw concern may be covered by multiple scopes. Merge overlapping concerns when one coherent objective/evaluand/invariant/evidence walk covers them; do not make one scope per bullet. Propose synthesis only for a genuinely additional combined decision, not shared source tracing or organization of directions. Handle clear cases in the parent. A genuinely vague or overlapping cluster may use one short normalizer child with frozen identity-bound input. Admit only its correlated `scope-proposal`, then observe disposal of that exact normalizer before releasing its slot.
3. Declare `requires`, `shared-evidence`, and `potential-conflict` separately. Declare `requires` only when the approved objective actually needs a predecessor's report; shared sources or cross-cutting comparison alone do not require one. Do not manufacture that need by rewriting a source walk as consumption of upstream reports. Only `requires` controls readiness, prerequisite depth, and invalidation propagation. Its predecessors must have current resolved results; a reviewed blocker is insufficient. Detect a `requires` cycle before approval and return it to normalization. Merge only under the coherent-scope rule; otherwise expose the exact human-owned coupling decision without dropping an edge or selecting a semantic winner. Shared-evidence and potential-conflict relationships may be cyclic and do not serialize readers.
4. Present only the complete two-column `Scope | Evaluate` table for approval: each row has its stable ID/name and one observable objective. Human edits replace that scope authority; recompute and re-present the entire table until approved. No scope evaluation begins before approval. Bind the exact complete approved table, human objectives/constraints/exclusions, exact scope contracts, and actual human approval provenance request-locally.
5. Before fan-out freeze a request-local evidence baseline and each approved scope contract: objective, evaluand, protected behavior, exclusions, prerequisite inputs and their exact report identities when available, and evidence boundary. A newly discovered objective-bound scope, including materially new synthesis, requires an updated complete table gate; independent already-approved work may continue. Rejected additions become explicit exclusions. Never manufacture an unbounded “other improvements” scope or silently change an approved objective, invariant, or evidence authority.

## Content and return transport

Load [agent-return](../../references/agent-return/return.md) before the first
requested return. It owns portable declared bodies, lifecycle distinctions,
native-provenance obligations, extraction boundaries, and original current
native return copying, not Retrace admission, budgets, or Reconcile verdicts. On
OMP also load the [OMP agent-return adapter](../../harnesses/omp/agent-return.md)
at this seam for the native envelope, collector, launch settlement,
addressability, supervision, and disposal facts. Use the installed shared
owners, not guessed skill-relative runtime URIs.

The producer freezes the exact complete UTF-8 bytes of each content record
before first dispatch and retains them request-locally with a receiver-readable
immutable locator. Use lowercase SHA-256 identities:
`scope-approval@sha256:{digest}`, `scope-contract@sha256:{digest}`,
`conversation@sha256:{digest}` for reports,
`evidence-manifest@sha256:{digest}`, `scope-proposal@sha256:{digest}`, and
`scope-result-payload@sha256:{digest}`. Bind normalization input by its exact
frozen content identity too. Every receiver re-reads and hashes the complete
referenced bytes before admission. Hash bytes directly, never reconstructed
prose, implicit concatenation, normalized newlines, tool-rendered anchors, or
line wrappers. An opaque cross-session pointer is not readable content.

Each request supplies `Reply token: {fresh unique token}`. The child sends its
complete unchanged return as one non-awaited `hub send` `message` to its bound
parent, copying that token only into native `replyTo`, never into the body.
Ignore local echoes and ordinary output; no Submit Result or successful
producing-turn gate is required.

Before each report operation, bind the exact expected child sender, the actual
receiving controller, current authored token, semantic phase, and current native
invocation before dispatch. For nested Reconcile reviewer traffic this owner is
the actual current scope controller, never the outer Retrace parent; the outer
parent uses only its own normalizer and scope-child expectations.

Keep every original lifecycle observation in a distinct identity- and
phase-bound invocation-local slot owned by the controller that actually observes
it: direct-child launch settlement, pre-operative roster binding, each requested
return, and exact disposal. Preserve filled slots across successive sends
through scope-result admission, aggregate assembly, reviewer-then-scope cleanup,
and any required proof export. Missing originals stay unresolved; matching IDs,
hashes, copied payloads, later snapshots, or later native results cannot
substitute for an earlier kind or phase. These lifecycle slots are distinct from
the four direct-child capacity slots and end with the authorized invocation.

If an authorized proof requires exported lifecycle observations, bind its exact
owner, slot set, and session-local destinations in the root proof instructions
and each affected scope contract before launching that scope. Repeat the same
binding in the initial operative request; for nested reviewer observations the
scope controller remains the responsible owner. Do not introduce it in
`begin-reconcile`, at final admission, or through a new default return field.
Incomplete export blocks the proof, not semantic review, and grants no alternate
observation path.

Keep dispatch, native collection, and admission coupled wherever notifications
could consume queued messages. Preserve independent child concurrency: batch
ready scopes and collect distinct children concurrently, subject to the host and
scope cap, rather than serializing whole evaluations. On OMP, follow the loaded
adapter and use the original owner-directed awaited-send path with exact
`await: true`, `timeoutMs: 0`, and at most one outstanding request per
owner/child. Zero disables only the timer; terminal child events,
unregistration, hard abort, or caller abort can still end and unregister the
collector. Never place this wait in an unbounded Eval invocation: bind an
existing external owner outside it that observes the same operation, process
state, and log cursor every five minutes and can interrupt the exact operation
when separately allowed, or report the missing execution capability without
dispatch.

Inspect operation errors, the requested recipient's delivery receipt, `details`,
and `details.waited` presence in that order before body access. When present,
mechanically copy the complete original current `details.waited` object and its
exact returned body into a new operation- and phase-specific slot in the actual
receiving owner's current invocation state before decoding or semantic work.
Preserve the stock trim boundary: do not restore removed outer bytes or normalize
internal newlines. Do not overwrite launch, roster, earlier return, or disposal
slots with this object.

When `details.waited` is absent, preserve the exact request frontier, child and
receiving-owner identities, token, phase, delivery facts, used or unknown
allowances, and all earlier filled slots. Stop that request without body access,
lookup, working-draft or copied-payload substitution, inbox, events, JSONL,
branch/session or RPC message reads, history, agent output, rendered cards,
report stores, later snapshots, replay, re-emission, a new collector, actor
replacement, nudge for absence, or allowance reset. The outer parent continues
independent ready work where safe but never takes over the blocked scope child's
collection or Reconcile.

After the current object is copied, decode only the complete returned `body` as
`text`, validate the full native and semantic contract, then consume an admitted
token once. Frozen content, direct hashes, matching child IDs, local echoes,
external captures, ordinary completion used as an alternate report, and later
native objects never replace native provenance.

### Closed return bodies

The three return bodies below are LF-delimited plain text. First line is the exact operation; every subsequent `Label: value` appears exactly once in listed order, with nonempty single-line values. No blank, extra, or trailing line is allowed. Content stays in the referenced records, never spliced into a body. Braced terms below are substitutions, not literal values. Tokens are not body fields.

```text
scope-proposal
Parent: {actual parent}
Controller: {normalizer child}
Normalization input: {exact frozen input identity}
Scope proposal: {scope-proposal identity}
Scope proposal locator: {readable locator}
```

```text
candidate-ready
Parent: {actual parent}
Controller: {scope child}
Scope: {approved scope ID}
Scope approval: {scope-approval identity}
Scope approval locator: {readable locator}
Scope contract: {scope-contract identity}
Scope contract locator: {readable locator}
Candidate: {conversation identity}
Candidate locator: {readable locator}
Evidence manifest: {evidence-manifest identity}
Evidence manifest locator: {readable locator}
```

```text
scope-result
Parent: {actual parent}
Controller: {scope child}
Scope: {approved scope ID}
Scope approval: {scope-approval identity}
Scope contract: {scope-contract identity}
Original candidate: {original provisional conversation identity}
Final report: {final conversation identity or none}
Final report locator: {readable locator or none}
Evidence manifest: {evidence-manifest identity}
Evidence manifest locator: {readable locator}
Review status: {provisional | paused | stopped | complete}
Evidence freshness: {current | stale | unreadable}
Evaluation disposition: {proposal | no-change | blocker}
Result payload: {scope-result-payload identity}
Result payload locator: {readable locator}
```

`Final report` and `Final report locator` are both literal `none` only when no finalized report exists. All duplicated identities/statuses must equal the referenced payload. Scope-proposal content is the complete proposed scopes, raw-concern coverage and graph, without evaluation.

## Scheduler and scope protocol

Keep only request-local approved scope/graph bindings, exact native identities,
report/evidence identities, capacity-slot occupancy, status/frontiers, current
return expectations and their correction-used state, and results/provenance
needed to finish. For each direct child, also keep separate original
launch-settlement, roster-binding, operation/phase return, and disposal-evidence
slots until aggregate assembly and cleanup finish. Native transient content
transport may hold large immutable records; it is not a searchable result
archive or persistence API.

Immediately batch ready scopes into available slots, ordered by ascending `requires` depth then authored scope order. At most four direct normalizer/evaluator children may be live, including retained paused controllers. Nested reviewers do not count toward four, but host depth/concurrency limits still apply. A report, echo, turn completion or cancellation acknowledgement never frees a slot. The scope must first settle its own exact reviewer cleanup; the outer parent then observes native disposal of that exact direct child before slot release. Free slots remain usable; four paused/undisposed children are a quiescent blocked frontier, not permission to replace children or exceed capacity.

1. The scope child performs the retained single-scope evaluation and freezes its complete provisional report and evidence manifest. Send one `candidate-ready` on the evaluation token and remain live. This report is provisional and non-authoritative.
2. The parent admits only the current correlated envelope and validates actual sender/controller, scope/approval/contract, readable exact report, Result shape and evidence/authority boundaries, including the Invocation contract's finding eligibility. Reject a mismatch through the existing authorized correction/stop handling; do not redo evaluation, rewrite findings, or add a loop. Consume the token; freeze the exact admitted body and derive `candidate-ready@sha256:{digest}` directly from those bytes, excluding token/native message IDs.
3. Send plain-text `begin-reconcile` to that same child with labeled `Caller: retrace`, actual `Parent`, exact `Controller`, `Scope`, `Scope approval` and locator, `Scope contract` and locator, `Candidate` and locator, `Evidence manifest` and locator, `Mode: Conversation replacement`, and `Authorization: candidate-ready@sha256:{digest}`. Include a fresh parent-authored `Reply token` for `scope-result`, distinct from the consumed evaluation token. The child checks actual native parent origin, current phase and exact approved bindings/provisional candidate before entry; a token or quoted caller label alone grants nothing.
4. That same scope controller loads current `skill://reconcile` and its reviewer protocol, then invokes delegated Conversation replacement. Reconcile admits the complete matching binding and skips only its redundant brief/approval. It alone owns its full reviewer loop, actual nested A/B identities, separate readiness/review tokens, natural original first-review same-child `skill://rethink`, finalized acceptance, synchronization, repair/pause rules and exact reviewer disposal. Do not duplicate negotiation, add a Retrace rethink, mandatory B review, adaptive second reviewer or round cap. The outer parent neither consumes reviewer traffic nor disposes grandchildren. Pass only approved context/evidence closure; additional evidence follows Reconcile's authorized context-supply/stop rules.
5. After review, the scope child sends one complete `scope-result` on the current result token. Its immutable payload contains in this exact order: original provisional report identity/locator; ordered authoritative Reconcile events; final report identity/locator or exact stop record; final supporting evidence-manifest identity/locator; finding identities; provisional-to-final changes; review status; evidence freshness; evaluation disposition; blocker/resume information. Retain every contributing evaluator identity, the distinct original lifecycle slots for native review and cleanup observations, and the exact frontier across this send; do not collapse them into the payload or replace them with its hashes. The parent admits only scope/control reports, never echoes or reviewer traffic.
6. Before accepting a final result, the parent checks the correlated envelope, approved boundaries including the same finding eligibility, exact report and payload identities, applicable Reconcile completion/cleanup evidence, and manifest with actual supporting source freshness reads. Review success, matching identities, and freshness cannot expand approved scope or prove a missing lifecycle slot; a mismatch follows the same correction/stop handling, not parent rewriting. A reviewed blocker remains authoritative, not resolved. After terminal reviewer cleanup, silently dispose the exact scope through native owned-child lifecycle, retain the complete original native disposal observation in that scope child's distinct slot, and observe removal or terminal disposal before releasing its capacity slot; do not await an echo or successful producing-turn completion.

### One corrective allowance per original return

Normalization, candidate-ready and scope-result are separate original expectations. Each has at most one parent-owned corrective follow-up total across delivery, format, identity and eligible child failures. New tokens, wording, categories or duplicates never reset it or create another budget.

Eligibility requires concrete evidence of an invalid attempted current response or native failure of its corresponding child turn, unambiguously bound to the current child/request, with that exact same child, approved binding, channel and necessary candidate/Reconcile state still available. Native failure metadata is diagnostic only, not report authority; invent no failure-envelope schema. Silence, observation expiry or an intermediate tool error while the child is working leaves the expectation pending without correction or redispatch. Foreign, stale and consumed reports cannot be relabeled as attempted current returns.

The parent diagnoses from native failure facts and already-approved context only. Identify one concrete authorized correction and send it once to the same child for that action and one complete compliant return. Retire the old token, issue a fresh one, and preserve the original expectation/spent allowance, scope, candidate and existing review state. Do not restart evaluation, add diagnosis-only child loops, reset nested review allowances, replace children, rewrite findings, change evidence, widen scope or override Reconcile repair/pause rules. Recovery/control observations cannot seed findings or widen evidence closure.

No authorized correction, unavailable child/binding/channel/state, or failed correction stops that request at its exact frontier while preserving work and continuing independent approved work subject to slots and cleanup. Lost receiving envelopes, missing provenance, parent-side collection failure or unavailable transport earn no child correction or report re-emission. Do not fabricate receipts or start a fresh attempt automatically.

This return-correction allowance is semantic protocol authority, not generic
execution recovery. Under Retrace's explicit adoption, the responsible owner may
correct eligible failed outer machinery for the already-authorized dispatch or
collection operation without issuing another child request, changing its token,
refunding the spent return allowance, or replaying child work. Normal supported
observation of that same still-pending operation is continuation. Missing native
provenance, an unavailable required owner, a valid blocker or pause, and the
terminal stop above remain owned here and cannot be relabeled to bypass them.

### Review, resolution and retention

Review status is `provisional | paused | stopped | complete`; freshness is `current | stale | unreadable`; disposition remains `proposal | no-change | blocker`. Resolved means exactly `complete` review, `current` evidence and `proposal` or `no-change`. A `bounded-validation` proposal can resolve evaluation, never implementation. A complete/current reviewed blocker is authoritative about unresolved evaluation but cannot satisfy `requires`.

Delivery proves content delivery, not terminal turn success or disposal. Later producing-turn failure/cancellation does not invalidate an admitted report. Controller loss needed for unfinished work and unresolved cleanup are separate runtime blockers. Valid blocker/paused reports are not failures to retry.

An eligible paused Reconcile run stays provisional under its exact same controller/reviewer frontier and occupies its slot. Resume only with explicit authorized continuation and a fresh return token, preserving underlying review/correction budgets; receipt alone never resumes it. Terminal stops inherit Reconcile cleanup before final stopped output. Failed cleanup is neither success nor a released slot. Scope controllers alone dispose reviewers; the outer parent disposes its exact scope children.

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
7. Compare, in order, no change, reuse, the smallest extension, bounded validation, and redesign without favoring the incumbent. Count implementation, integration, migration, review, runtime, conflict, and ongoing ownership cost. Select one coherent direction. For every evaluated redesign candidate, determine and report separately whether it preserves the named responsibilities and invariants, names one adjacent check, and proves total cost lower than no change, reuse, the smallest extension, and bounded validation. Mark each gate `proved` or `absent`. If any gate is absent, reject redesign and name every absent gate as a rejection reason; unrelated objective linkage or directional coverage, generic cost, and generic scope cannot substitute for a gate verdict. Admit redesign only when all three gates are proved.
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

Keep source quotations verbatim; never expand a path inside a quotation or exempt quoted paths from the full-locator rule. Select smaller exact source spans that contain no abbreviated file reference, and state the path relationship separately in unquoted prose using full locators. Describe proposed map changes with full-locator prose rather than embedding root-relative map serialization. Preserve the evidence and claim; if no faithful compliant presentation is possible, expose that exact frontier. A current candidate rejected solely for this presentation defect follows the existing one-correction eligibility check: when the same child and required state remain available, have that child correct only presentation and freeze its complete corrected records under the fresh token. The parent never rewrites the report or source quotations.

Each scope report contains these Markdown sections in this exact order, omitting only `Outcome Validity` when no execution evidence is bound. Freeze and retain the complete reviewed report bytes as aggregate supporting detail; never replace them with a status summary or rewrite their headings for nesting:

1. `## Bound Intake and Scope Model` — root, objective, bound or absent evidence, human-owned constraints, role model, protected behavior, and exclusions.
2. `## Outcome Validity` — delivered acceptance judgment and its evidence, kept separate from harness quality.
3. `## Historical and Current Harness Coverage` — current and historical authority, expected fresh-run coverage, both directional walks, loaded-coverage comparison when applicable, history branch, and excluded issues.
4. `## Qualified Findings` — each finding's four-part identity, readiness, root cause, owner, evaluand, invariants, objective impact, full exact evidence locators resolved against the bound root with schemes and selectors preserved, and minimal redacted quotations.
5. `## Refinement Direction, No Change, or Blocker` — exactly one disposition: `proposal`, `no-change`, or `blocker`. A proposal has subtype `refinement` or `bounded-validation` and obeys the readiness cap. State the one direction, five-rung solution ladder, rejected alternatives, total cost, and required validation. For every evaluated redesign candidate, report separate `proved` or `absent` verdicts for named-responsibility-and-invariant preservation, one adjacent check, and total cost lower than each smaller rung; when redesign is rejected, include every absent gate among its rejection reasons. For a blocker, state the exact resume condition. Include a short **Aggregate summary** authored by the scope: the applicable finding and consequence, direction, and required validation; for `no-change` or `blocker`, state the corresponding disposition and frontier instead. This summary remains inside the report reviewed by Reconcile.
6. `## Canonical Impact and Transfer` — canonical and route impact, owners to reopen, and the caller-owned next transfer.

Keep the direction coherent across sections. Do not emit a native handoff.

## Freshness and aggregate

Each evidence-manifest entry records its exact readable locator/selector, current or historical role, admission provenance, and observed exact source-content identity or explicit `absent`/`unreadable` observation and error. Account for all evidence admitted during evaluation and review, distinguishing actual supporting sources and exact prerequisite report identities. Hash exact bytes/content, not rendered anchors; never invent a failed-read digest.

Re-read supporting sources and compare the same locators/observations before final acceptance, then again for all accepted reports immediately before aggregate presentation, including synthesis and reviewed blockers. Unchanged known absence can be current evidence for a truthful blocker; inability to re-establish previously readable evidence is `unreadable`. Historical evidence remains historical even when unchanged. Do not silently adopt changed bytes.

A changed source invalidates every report that actually relied on it plus their transitive `requires` dependents. Shared-source readers may each be directly stale; `shared-evidence` by itself propagates nothing. Preserve unaffected current reports, every reviewed/observed identity, provenance and exact unreadability error. No automatic reevaluation follows drift.

Emit exactly these four H2 aggregate sections in order, using the Result full-locator rule throughout. Use H3 headings for individual scope displays and short bold labels within them. Keep the decision-first front concise: exclude full event tables, raw reviewer answers/findings, and routine receipt/token/hash chatter. Do not impose a word cap; material recovery, capacity, cleanup and freshness exceptions remain visible.

1. `## Result` — lead with aggregate `complete | partial | blocked`, resolved/admitted scope count, counts by evaluation disposition, material blockers, and the boundary between completed evaluation and unperformed implementation.
2. `## Scope Results` — include every approved scope in graph order (ascending `requires` depth, then authored order). Lead with a table whose columns are exactly `Scope | Disposition | Outer rounds | Report updates | VALID by round`, then give each scope an H3 display for details not carried by the row. Keep review status, evidence freshness and evaluation disposition distinct. Put each paused, stopped, unavailable, stale or unreadable exception and its exact current frontier alongside that scope; never hide an exception behind a proposal label. State facts shared by several scopes once.
3. `## Findings and Directions` — materialize each distinct finding as one entry in this section whose complete four-part identity gives the `objective class`, `owner`, `root-cause class`, and `evaluand` with all four values together, followed by its concise finding and consequence, reviewed direction, and required validation. A pointer to supporting detail, a statement that the identity exists there, or an identity that appears only in `## Evidence and Limits` or an embedded report does not satisfy this section. Deduplicate only entries with matching complete identities. Preserve material readiness, owner, protections, disagreements and every contributor. Derive the concise wording from the scope-authored summary inside the immutable report reviewed by Reconcile. The parent may organize accepted content; it never authors a novel combined recommendation or maintains a second copy of the same invariant.
4. `## Evidence and Limits` — retain the exact approved table and approval binding, complete immutable reviewed reports, finding identities and contributors, manifests, provisional-to-final changes, disagreements, and authoritative review evidence. First probe whether the actual harness gives the human terminal/native reader access to existing request-local supporting records; model or tool readability alone is not human access. Use an exact supporting-detail locator only when that human access is established. Otherwise render the complete detail inline after the concise front in a byte-faithful literal block whose delimiter cannot collide with the report, rather than rewriting headings or report content. A local locator alone proves neither readability nor permanence. Add no archive, persistence API or independently maintained duplicate report.

Derive the three review-history columns from the ordered admitted events, never from a second state ledger. An outer round is an actual Reconcile outer iteration entered, including unchanged closure. A report update is only a committed replacement of the canonical conversational report. `VALID by round` lists the admitted finalized accepting reviewer ending each round in chronological outer order. Initial provisional responses, same-child rethink, synchronization, formatting corrections and other control events create no round, update or verdict. Never infer rounds as updates plus one. An entered incomplete round has no finalized `VALID`; show that fact and its exact frontier even when an earlier round ended `VALID`, because earlier acceptance does not complete a stopped or paused run. Within each scope bind `A` and `B` once in supporting detail to the actual reviewer identities; each round entry names only the reviewer that ended that round, not dual approval.

Resolve apparent conflicts only when exact current authority/evidence determines the answer. No majority vote, semantic override or unreviewed claim that independently acceptable changes are safe together.

A materially new combined recommendation needs a newly approved synthesis scope under Normalize and approve's additional-decision test. Bind accepted upstream report identities as bounded evidence, declare true `requires` edges, and use the identical child/Reconcile/freshness path. Do not add a default synthesis or review layer merely to trace shared sources, compare, or organize existing reviewed directions.

Aggregate `complete` means every admitted scope has a current resolved result and no unresolved dependency/conflict/freshness frontier. `partial` means at least one current resolved result and some admitted work/frontier unresolved. `blocked` means graph formation failed or no current resolved result exists, even if truthful blockers were successfully reviewed. Unresolved runtime/cleanup frontiers preclude complete success. Human acceptance of partial never relabels it complete.

At graph quiescence collect all remaining blockers once, preserving review/disposition/freshness distinctions. Continue independent ready work while capacity allows; never replace a child or free an undisposed slot. Recommend the smallest applicable action: supply/select evidence or authority, approve a revised table, authorize a fresh evidence/transport-bound attempt, accept partial, or stop.

## Stops

Bare non-repository URLs, documents, and service traces are ineligible evaluands. Missing optional evidence limits claims but does not stop static evaluation; contradictory current authority does.

Remain a read-only lens. Dispatch only the declared normalization/scope children and scope-owned report-only Reconcile. Permit only request-local runtime state and the host's native transient content transport; no repository/evidence mutation, external effects, persistent evaluator store, ledger, index, result archive, history search, or new persistence API. Reconcile may correct only its scope's conversational report, never source evidence, objectives, protected behavior, exclusions or another scope. Recommendations grant no implementation authority.

Do not approve human decisions, author plans, implement or repair repository changes, own an engineering handoff/route/lifecycle, run automatically, or add an assurance/completion/shipping tail. Stop above planning; all later handoffs, plans, mutations, routes and delivery effects remain caller-owned.

Resume only after changed evidence, authority, transport, scope or a falsifiable hypothesis with applicable explicit continuation/fresh-attempt authority. Do not ask the same unchanged frontier twice; close the affected scope as blocked for that run. Observation expiry alone is not semantic failure. No Retrace time/round cap or automatic retry is added; inherited Reconcile capacity/liveness and cleanup rules remain in force.
