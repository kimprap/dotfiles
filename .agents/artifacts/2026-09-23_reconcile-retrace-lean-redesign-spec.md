# Reconcile and Retrace Lean Redesign

**Revision:** `reconcile-retrace-lean-redesign/spec-v2`  
**Supersedes:** `reconcile-retrace-lean-redesign/spec-v1` (SHA-256 `d31414c5ab4e2d3b650765d97e11e84cec2cd1ec8bf3457e60037eb1f0b91a8d`), revised in place under the revision handoff recorded below  
**Status:** Revision of the human-approved final proposal; execution requires approval of the linked plan  
**Date:** 2026-09-24  
**Receiver:** `Main`  
**Plan:** `.agents/plans/2026-09-23-2154_reconcile-retrace-lean-redesign.md`

## User intent

Keep both skills' mechanics and semantics. Every other accumulated rule, ADR, contract, gate and proof mechanism may be revised or removed, and no backward compatibility is required.

Copy that sentence word for word into every task brief.

## User decisions (verbatim)

These override repository rules for this redesign. If one seems to conflict with a rule, raise it with the user; do not reverse it.

- Guard: "The redesign, my only guard is to keep both skills mechanics/semantics in place. The governing rules/adrs/contracts/gates that previous agents might have accumulated could all be removed, or used only as context during our new redesign for more insights."
- Identity: "Revision labels"
- Reply format: "Keyword + required parts"
- ADR-0010: "'Rewrite in place' - sounds good. Note, however, all current rules/adrs/gates could all be revised/removed. No backward compat is required for the new redesign."
- Map: "Delete it"
- Re-ask budget: "3, all current categories"
- Sync-repair eval: "Re-derive and rename"
- Undisposed-run rule: "Keep in preflight"
- Final fix: "keep D31 clause 9"

## Revision approvals (spec-v2)

The human sent the revision handoff in Main session `01a0cd86-cbaf-74ad-a6c5-267be083b0af` with the instruction "revise per the following revision handoff. report disagreements, if any." The handoff's retained items, verbatim:

- "Revision labels and keyword-plus-required-parts replies."
- "Persistent reviewers, A first, first-review rethink, and lazy B."
- "Removal of readiness, synchronization, locator-freeze machinery, proof export, and the human execution map."
- "Baseline D31 clause 9 **verbatim**."
- "First-reply retention, separate turn/reuse outcomes, observed disposal, and preservation of successful siblings."
- "T1 → T2 and standard assurance unless a demonstrated requirement changes their scope."

Its defaults are adopted: C4 precedence ("Default: C4 precedence."), no `unbound` freshness label, and existing evidence eligibility. No immediate-stop exception to C4 and no narrower evidence-size or source-type boundary has been approved. The handoff approves no implementation.

## Why the transport changes

Children started by the lifecycle plugin get only `read`, `grep`, `glob` and `lifecycle_channel` (`lifecycle-consumers.js:10`, `:243`; `lifecycle-supervisor.js:490-500`). They cannot write files or compute hashes. Everything a child produces therefore travels in its reply text, and only a controller with shell or Eval tools computes hashes.

A child's own `read` shows a bounded window, so text it copies from a read is not a complete observation (see Transport probe). The Retrace root therefore captures every source a claim rests on and pushes those bytes down in a request.

## Keep unchanged (the only hard guard)

Each ID below must map to at least one line in the redesigned files.

### Reconcile

- KR1. The five-field brief and its approval; the order used to pick the candidate.
- KR2. Two modes: Conversation replacement and Artifact edits.
- KR3. Cap is `none` or a positive integer, counts committed applications, and allows one closure-only iteration.
- KR4. Reviewers A and B are persistent and read-only, and are never replaced.
- KR5. A starts every outer iteration; B starts only when a REVISE needs a counterpart.
- KR6. A reviewer's first real review is initial → same-reviewer rethink → post-rethink; later reviews skip the rethink. `source-need` exchanges inside a pass continue that pass; they are not the provisional response and never repeat the rethink.
- KR7. VALID, REVISE and BLOCKED keep their meanings; recommendations are never applied.
- KR8. A REVISE is one complete replacement or one complete edit set against the unchanged outer base.
- KR9. Negotiation ends at the first VALID for the current label. A BLOCKED gets one retry with approved context. There is no turn cap.
- KR10. At most one application per outer iteration; then re-read, count, validate, and start the next iteration with A.
- KR11. In artifact mode, check that the file is unchanged before the final report.
- KR12. The stop list stays, minus the synchronization stop. Its two invalid-return entries become C4's fourth invalid return (user decision "3, all current categories").
- KR13. Identity-preserving repair is allowed; nothing rolls back automatically.
- KR14. Both reviewers are disposed at the end; a failed disposal blocks success.
- KR15. The Review rounds, Final proposal and Reconcile stopped formats stay. The controller never rewrites reviewer text.
- KR16. Delegated use stays report-only.

### Retrace

- KT1. The invocation contract, finding eligibility and the three entry types.
- KT2. The scope table is normalized, then the human approves the complete table, including `requires`, shared-evidence and potential-conflict links.
- KT3. At most 4 direct actors, ordered by `requires` depth and then authored order. A slot frees only when its actor is `disposed`.
- KT4. Per-scope flow: evaluate → `candidate-ready` → parent accepts → `begin-reconcile` → delegated Reconcile → dispose reviewers → `scope-result` → parent accepts → dispose the scope and its subtree. A nonterminal `source-need` or `scope-paused` reply returns to the same step of the same scope; it never advances the flow.
- KT5. Left as written, except the T2 edits at `:444`, `:446`, `:459`, `:461` and `:472`: the status, freshness and outcome labels, Evidence boundary, Method, Readiness G1–G4, Result sections, Freshness and aggregate, Stops, and the read-only stance.

### Both skills

- KB1. Each skill keeps one sentence saying that task, hub, Eval, yield, ordinary output, transcripts, history, agent output and generic collectors never count as a reply and are never a fallback.

### Supervisor mechanics (probe mode removed, C6 added) and ADR-0010 D31 clauses 1–6 and 9

- KS1. The first reply is kept and only the owning parent sees it.
- KS2. The reply, the turn result and the reuse state stay separate.
- KS3. A request stays pending until it gets a reply, a concrete terminal failure, or an explicit abort.
- KS4. Disposal counts only once process exit is observed.
- KS5. When one request in a batch fails, the batch keeps its successful siblings.
- KS6. An actor disposes the children it owns before its terminal reply. A reply marked `terminal: false` (C6) is the only exception.
- KS7. D31 clause 9 stays verbatim: the generic collection contracts in ADR-0002 and the generic execution-recovery policy remain unchanged, and their implementation-child exemptions do not replace or weaken the named custom-controller lifecycle contracts.
- KS8. `delivery-unknown` is an unresolved, non-reusable frontier, not `pending`. A late reply and a successor dispatch get `ACTOR_BUSY`. `observe` shows the frontier but does not admit the late reply or restore reuse. Only the existing abort or disposal authority resolves it. No replay, replacement actor, automatic redispatch or re-ask follows. Cost, disclosed: a lost acknowledgment can make a later legitimate worker reply unusable.

## Contracts

### C1 Identity: labels name exact texts

- The controller keeps every proposal text it sends or accepts, and names it. Iteration n's outer base is `o{n}.r0`; each accepted REVISE that changes the text takes the next `o{n}.r{k}`.
- A VALID accepts exactly the label its request carried.
- Comparisons are exact, with no normalization:
  - "Changed" means the Correction differs from the current text.
  - An A/B cycle means a Correction equals an earlier text from the same iteration.
  - A repeated pair means the same label went to the same reviewer with nothing new.
- Lineage keeps its six fields. Digest values become labels, and the source finalized response is named by its lifecycle request ID.
- Artifact mode (standalone only): the outer base and the freshness check use `{absolute path}@sha256:{hex}` of the file on disk. Edit sets use labels.
- In delegated Reconcile, `o1.r0` is only the report extracted from the admitted `candidate-ready` (its `Report` frame), not the whole envelope. The manifest stays outside the editable target.
- Who hashes: children never compute or echo identities. Only the outer Retrace root computes source identities, from its own captures (C7), and the identity of each admitted report it passes on as a prerequisite. Scopes and reviewers carry and forward captures without hashing. The standalone Reconcile controller hashes its artifact file.

### C2 Replies and requests: keyword line, then only the required parts

The first non-blank line is the exact keyword. Fields start at the beginning of a line with their exact label. Blank lines between fields are allowed, and single-line status fields may come in any order. A multi-line part is a framed field (C5); a list field holds one-line `- ` items. Unknown material outside a frame is invalid. Reconcile field names do not change; only the `Reviewer:` and `Pass:` echo lines and the empty `none` lines go from replies.

Reviewer replies:

```text
VALID
Recommendations:
- none | editorial: … | semantic: …
```

```text
REVISE
Blocking issues:
- …
Correction: {D}
{complete replacement | complete edit set against the outer base}
{D}
Preserve:
- none | …
```

```text
BLOCKED
Blocker: …
Resume with: …
```

Delegated reviewers only (in standalone Reconcile this is an invalid return):

```text
source-need
Sources:
- {locator} | {whole | lines N-M} | {intake | declaration | captured {locator} | conventional}
Need: {one line: the claim or check these sources support}
```

Retrace normalizer and scope terminal replies:

```text
scope-proposal
Proposal: {D}
{scopes, raw-concern coverage, graph}
{D}
```

```text
candidate-ready
Report: {D}
{the report: five Result sections for static evaluation, six when execution evidence is bound}
{D}
Manifest:
- {locator} | {whole | lines N-M} | {current | historical} | {supporting | admitted} | {provenance}
- prerequisite {scope}
```

```text
scope-result
Review status: provisional | stopped | complete
Evaluation disposition: proposal | no-change | blocker
Report: {D}                      (or Stop record: {D})
{final report | exact stop record}
{D}
Manifest:
- {entries as in candidate-ready}
Review events:
- {ordered authoritative Reconcile events, provisional-to-final changes, blocker/resume}
```

Retrace scope nonterminal replies (sent with `terminal: false`, C6):

```text
source-need
Sources:
- {locator} | {whole | lines N-M} | {provenance}
Need: {one line}
Frontier: evaluation | review {A|B} {pass} {label}
```

```text
scope-paused
Frontier: {one line: the exact paused frontier}
Resume with: {one line: the exact input or authority needed}
Review events:
- {ordered authoritative Reconcile events so far; omitted in the evaluation phase}
```

- `source-need` from a scope is allowed in the `evaluation` and `scope-result` phases. A scope relays a reviewer's need only from that reviewer's actual owner-visible reply, never from status, ordinary output or an inferred need.
- `scope-paused` is allowed in the `evaluation` phase (a new human-owned uncertainty) and the `scope-result` phase (an eligible Reconcile repair pause or human-owned frontier, with both reviewers still live). A terminal `scope-result` never reports `paused`; the aggregate shows a paused scope as `paused`. An abandoned paused scope is disposed by the root as a subtree.
- `scope-result` carries no evidence-freshness field; only the root computes freshness.

Requests (downward):

```text
normalize
Input: {D} … {D}
```

```text
evaluate
Table: {D} … {D}
Contract: {D} … {D}
Input: {D} … {D}
Prerequisite {scope}: {D} {admitted report of a true requires predecessor} {D}
{zero or more source entries for locators the approved contract names}
```

```text
source-supply
{one or more source entries}
```

```text
begin-reconcile
Report: {D}
{exact report extracted from the admitted candidate-ready}
{D}
```

```text
resume
Authority: {one line: the explicit continuation authority}
Input: {D} {approved input, such as the human's verbatim answer} {D}      (optional)
```

A source entry is an `Entry:` line followed by exactly one outcome field:

```text
Entry: {locator} | {whole | lines N-M}
Source: {D}
{decoded text of the captured bytes, or of lines N-M of that capture}
{D}
```

```text
Entry: {locator} | {whole | lines N-M}
Observation: absent | unreadable {exact error}
```

```text
Entry: {locator} | {whole | lines N-M}
Not supplied: over-window {lines} lines {bytes} bytes | not-utf8-text | refused {reason}
```

Each (locator, selector) pair appears once per body. `source-supply` continues the phase and semantic frontier of the expectation it answers. A scope forwards captures to its reviewer in a `source-supply` request with the reviewer's current pass as phase.

Reconcile review packets keep the protocol's packet facts (`reviewer-protocol.md:55-69`) minus the protocol locator and hash. Single-line facts are `Mode:`, `Label:`, `Lineage:` (six fields separated by ` | `), `Reviewer:` and `Pass:`. `Context:`, `Original:` (first real review only) and `Proposal:` are framed. A re-ask names the defect in one `Defect:` line. Rethink and other controller requests keep their content with multi-line parts framed.

Requests contain no transport locators: no record or authorization locators, `Kind:` headers, `0444` files, digests or echo lines. Source locators in `Entry:` and `Sources:` lines and file references inside reports stay.

### C3 Delegated Reconcile entry

- Who may start it: Retrace only, after it has accepted a scope's `candidate-ready`.
- Request: the scope's own parent sends `begin-reconcile` with phase `scope-result`. Its `Report` frame is the exact report extracted from the admitted `candidate-ready`; that text is the candidate, `o1.r0`.
- Authority: the table and contract from the scope's evaluation request.
- Settings: Conversation replacement, cap `none`, no brief, report-only limits unchanged.
- Reviewers: `{scope}/reviewer-a` and `{scope}/reviewer-b`, reached through `lifecycle_channel` and disposed before `scope-result`. They stay live across the scope's nonterminal replies.
- Anything else is rejected before any reviewer starts. There is no fallback to artifact mode.

### C4 Re-asks and stops (both skills)

- Original expectation: one expected reply from one actor for one semantic step. These are a reviewer's verdict for one pass on one label, a normalization return, a scope's `candidate-ready`, and a scope's `scope-result`. `source-supply` and `resume` continuations answer the same expectation; a new request ID never creates a new one.
- Invalid return: a reply to the current request that fails the C2 or C5 grammar (keyword, missing or repeated field, frame error). Also invalid: a wrong identity, label, phase or binding; an applicability failure, including an unchanged or non-applicable Correction; a `terminal` flag that contradicts the scope keyword (C6); a manifest that does not match the root's captures for that scope (C7). For Retrace, an eligible failed actor turn is also counted: a concrete lifecycle failure of that exact actor and request while the actor, binding, candidate state and connection remain available.
- Budget: up to 3 re-asks per original expectation, shared by every category above. Each re-ask is a new request to the same actor naming the defect. The 4th invalid return under one expectation stops at its exact frontier. The budget never resets. A new request ID, a changed category, new phase wording or a duplicate never replenishes it.
- Precedence: C4 governs every applicability failure, including an unchanged or non-applicable finalized REVISE. Such a reply is invalid, never valid, and no immediate-stop exception applies.
- Outside the budget, each with its own rule:
  - BLOCKED gets its one approved-context retry (KR9); a persistent BLOCKED after it stops.
  - A valid blocker, a `scope-paused` return and a `source-need` return are valid replies, not failures to fix.
  - Silence and observation-only status wakes leave the request pending, with no re-ask or redispatch.
  - `delivery-unknown` is the fail-closed frontier of KS8.
  - Controller-side observation failures and intermediate tool errors while the actor works leave the request pending.
  - These stop immediately: a revoked or conflicting binding, an ended or lost actor, or an unavailable channel.
  - These semantic loops stop immediately: an A/B cycle, a repeated label/reviewer pair without new evidence, a repeated unresolved frontier, and a new request for a source already supplied or refused to that requester.
- Reconcile preflight: no new run starts while an earlier run's reviewers are still running.
- Controller tool failures: each skill keeps one sentence adopting the generic execution-recovery policy. A delivered request is never replayed.

### C5 Text framing

One convention frames Correction, Report, Stop record, Source and every other multi-line part. Both `reviewer-protocol.md` and `retrace/SKILL.md` carry this block byte for byte as their own `## Text framing` section:

~~~markdown
## Text framing

Frame every multi-line part of a request or reply body as one field. `D` is a
run of at least three backticks, longer than every backtick run in the
payload. The writer emits `Label: `, `D`, an LF, the payload, an LF, `D`, and
an LF. The reader removes exactly that prefix and suffix and keeps every
payload byte, with no trimming or normalization. The LF before the closing `D`
belongs to the frame, so a payload that ends in LF keeps its own LF. A closing
`D` that ends the body may omit its final LF. Headings, keywords and
delimiter-like lines inside a payload are content.

Reject the body when a payload contains a backtick run as long as `D`, a frame
has no closing `D` line, material the body grammar does not allow follows a
frame, or a required field is missing or repeated. A list field holds one-line
`- ` items; a part that needs more than one line is a framed field.
~~~

This is a writing and reading rule for the skills, not a parser service or new runtime. The Retrace root decodes scope bodies mechanically; models apply it when they read.

### C6 Nonterminal replies (`terminal`)

- The injected `lifecycle_channel.reply` schema gains optional boolean `terminal`, default `true`. A non-boolean value gets `INVALID_INPUT` "reply terminal must be boolean".
- `terminal: false` skips only the owned-descendant disposal gate (`lifecycle-supervisor.js:790-799`). Ownership checks, the current-request check and first-reply-only admission stay.
- The reply is stored as `{ body, terminal, acceptedAt }` and the owner's request view shows `terminal`. A nonterminal reply answers its request once; a second reply to that request gets `ACTOR_BUSY`.
- Work continues through a new request to the same actor under the existing turn and reuse rules. The first request sent while the actor is finishing is held as its reserved successor and delivered only after its turn ends; a further request gets `ACTOR_BUSY`.
- Direct capacity stays occupied until the scope's observed disposal. A nonterminal reply implies no completion, cleanup or permit release.
- The plugin never parses keywords. Only a Retrace scope sets `terminal: false`, and only on `source-need` and `scope-paused`. Reviewers and normalizers never set it. The root treats a scope keyword whose flag disagrees as an invalid return (C4).
- D31 treatment: the nonterminal bodies are not `scope-result`, so D31 clauses 1–6 stay unchanged and the `AC-REC-D31` hash stays. ADR-0010 gets one Consequences bullet, outside D31.

### C7 Source supply and freshness binding

Invariant: the root compares the observation that supports the claims, not a later observation collected only to publish them, with the corresponding observation at admission and at aggregation.

- Claims rest only on root captures. A scope or delegated reviewer may read files to find what it needs. Its own reads never support a claim or a manifest entry. Before relying on a source it names it in `source-need` and then works from the pushed bytes. A reviewer checks claims against the supplied captures; a difference between its own read and a capture is not review evidence, and drift is found by the root.
- Capture: the root reads each locator once per scope into one buffer. It takes SHA-256 of those same bytes and decodes them as strict UTF-8 with the BOM kept (`TextDecoder("utf-8", { fatal: true, ignoreBOM: true })`). Identity is whole-file. A `lines N-M` selector (1-based, inclusive, each line with its own terminator) is cut from that same capture. A later need for the same locator in the same scope reuses the capture and never re-reads. "Hash the file, then re-read it to fill the request" is not this path.
- Push, not fetch: the root answers with a `source-supply` request built from its capture, with no re-read and no model retyping. The Retrace root uses Eval with `tool.lifecycle` to capture, frame and dispatch; that is neither a reply nor a fallback. No upward-fetch channel operation, persistent store or new channel operation is added.
- Outcomes:
  - A readable UTF-8 capture gives a `Source`.
  - A known absence or lost readability gives an `Observation` with the exact error, never an invented digest.
  - A whole-file request above 3000 lines or 51,200 bytes (the reader's default window) gives `Not supplied: over-window`, and the requester asks again with line ranges. Explicit line ranges are always pushed in full. This is a paging rule, not an eligibility limit.
  - A capture that is not valid UTF-8 gives `Not supplied: not-utf8-text`. This is a transport limit, not a freshness result: the root keeps its capture identity, and the scope reports the gap without calling the source unreadable or absent.
  - A request the root cannot validate against the Evidence boundary (`retrace/SKILL.md:406-408`) using its stated provenance gives `Not supplied: refused {reason}`. That is a named gap, not an observation, and uses no budget.
- Ordering for a reviewer's need (from the scope's own need, start at step 2):
  1. The reviewer replies `source-need` to its scope. That first accepted reply answers the reviewer's request. It does not mean the turn ended or the reviewer is reusable, and a second reply to that request is rejected.
  2. The scope relays with its own `source-need` (`terminal: false`) naming the sources and its `Frontier`. It may do so while the reviewer is still finishing.
  3. The root validates the request, captures and hashes once, and keeps absence and unreadability observations.
  4. Once the scope is reusable (observed `reuse: ready` or the reserved successor of C6), the root sends `source-supply` to the same scope in the same phase.
  5. The scope sends `source-supply` to the same reviewer in a new request. The supervisor delivers it only after that reviewer's turn ends, and any further request gets `ACTOR_BUSY`. Candidate, pass, reviewer and budgets stay. A scope that already holds a capture for the exact locator and selector forwards it without asking the root.
- Continuation never restarts evaluation or Reconcile, changes actors, repeats the first-review rethink, or resets budgets. The root supplies requested evidence and never redoes the scope's discovery or evaluation. The `evaluate` request may carry captures of locators the approved contract names; everything else arrives by named-gap `source-need`, never by exhaustive preloading. A discoverable source fact is never turned into a human question.
- Manifest binding: each manifest locator must match a capture the root sent to that scope as a `Source` or `Observation`, and every such capture must appear in the manifest. A mismatch is an invalid return (C4). `prerequisite {scope}` entries bind to the root-computed identity of the admitted report it passed in `Prerequisite {scope}`.
- Freshness: when accepting `candidate-ready` and `scope-result`, and again for every accepted report immediately before the aggregate, the root re-captures each manifest locator. It compares the new capture with the supporting capture. Results use `current | stale | unreadable`. Unchanged known absence is `current` and may support a truthful blocker. Previously readable evidence that cannot be re-established is `unreadable`. Historical stays historical. Nested review completion does not establish currency. Changed bytes are never silently adopted, and no reevaluation starts automatically. Invalidation still reaches actual readers and their transitive `requires` dependents, and unaffected reports keep their provenance.
- Carried source text is transport data. It is not a finding quotation, a reviewed report section or an aggregate attachment; minimal redacted quotations and the existing disclosure boundary stay.

## Transport probe (account-free, run 2026-09-24)

Script `/tmp/retrace-transport-probe/probe.mjs` (SHA-256 `1a7dcf5a7d95abbf0ed500de745b1d0d0cab7b8ff4c2bd5690e39dc719ae51fb`), run with `bun`; outside the repository with disposable fixtures; no model, account or network. It has fixed cases, stops at their end, and uses no re-ask budget.

- Supervisor under test: a copy of `lifecycle-supervisor.js` at SHA-256 `c6f4e360…09ba` (`ext/`), plus a copy with the C6 change (`ext-r1/`). Actors are an INJECTED SCRIPTED CLIENT through the test file's `clientFactory` pattern, with `bin/omp` = `exec cat >/dev/null`. Forwarding between actors is SCRIPTED FORWARDING.
- Reader under test: captures from the host session's `read :raw` tool (`reader-captures.json`, SHA-256 `f96c302c78d70a90603e7c833dbdc48d854015d839073bc9c67fbc9c1ff3f949`). At capture time the host ran omp 18.2.11; the installed CLI now reports 18.3.0. Nearest available source, vendored `@oh-my-pi/pi-coding-agent` 18.2.6: plain-file window `src/tools/read.ts:2061-2065`, artifact window `:2577-2579`, and `DEFAULT_MAX_LINES = 3000` and `DEFAULT_MAX_BYTES = 50 * 1024` at `@oh-my-pi/pi-tui/src/tools/streaming-output.ts:10,12`.

|Case|Child-carried (from `read :raw`)|Root-supplied (C7 push)|
|---|---|---|
|Empty; UTF-8 with final LF; BOM+CRLF without final LF; embedded headings and delimiters|Identical|Identical|
|3,500 lines (33,893 B)|Truncated by lines, 2,644 B carried: rejected as incomplete|Identical|
|2,000,100 B|Truncated by bytes, 40,142 B carried: rejected as incomplete|Identical (through the injected client)|

- Decoding: the default decoder strips the BOM (21 → 18 B); `ignoreBOM: true` keeps 21 B.
- Framing: the good frame used a four-backtick `D` for a payload holding a three-backtick run. Collision, early close with trailing lines, incomplete, trailing material, duplicate field and missing final LF were all rejected. Round trips of `""`, `"x\n"`, `"\ufeffa\r\nb"` and `"x\n\n"` held. Under C5 a closing `D` at the end of the body without LF is accepted; that case was not rerun.
- Mutation: an edit after the capture was detected at admission, and the pushed bytes stayed the original. The hash-then-reread race gave `recordedIdentityMatchesPushedBytes: false`.
- Absence and readability: known absence stayed `ENOENT` across reads, and lost readability (`EACCES`) was detected as not current. A binary file was captured (identity recorded) and flagged `not-utf8-text`.
- Late sources: a source first needed in evaluation (`late-eval.md`) and one first needed in nested review (`late-review.md`) went through the full reviewer → scope → root → scope → reviewer path of C7 on the C6 copy. A change to `late-review.md` after capture showed as stale.
- Ordering on the C6 copy:
  - The scope relayed with `terminal: false` while the reviewer was `finishing`.
  - A terminal scope reply with the reviewer live got `ACTOR_BUSY`, as did a second scope reply and a second reviewer reply.
  - The root saw `terminal: false`, a succeeded turn and `reuse: ready`, and capacity stayed 4/4.
  - The continuation reached the same client. The reviewer successor was held until the reviewer's turn ended.
  - Reviewer disposal, then `scope-result`, then scope disposal followed. A 5th scope got `CAPACITY_REACHED` until the scope's disposal, then went pending.
- Baseline supervisor: a scope reply while a reviewer was live got `ACTOR_BUSY`. The first premature reviewer request was held as a reserved successor, not refused; the next got `ACTOR_BUSY`.
- `delivery-unknown`: a late reply and a successor got `ACTOR_BUSY`, `observe` showed `delivery-unknown`, and disposal gave `disposed`.

Evidence limits: scripted copying proves mechanical preservation only, not a model's copying fidelity. That applies both to child-carried text and to any model-mediated forwarding of root-supplied content. The 2 MB push went through the injected client, not the stock RPC stdin path. The probe did not choose an oversized-source policy; C7 keeps eligibility and pages whole-file requests. The production path is exercised only by the planned live D3 run; no other native proof campaign is added.

## Changes by task

Line references are to the baseline bytes below (unchanged since spec-v1). If a target's SHA-256 differs at task start, re-locate each named passage by content before editing; a passage that no longer exists stops the task.

| Baseline file | SHA-256 |
|---|---|
| `.config/agents/skills/reconcile/SKILL.md` | `b33e854319d3ca6e778e095892c5d6fd231e5cb685f8e81a89a7f1d65a07cdf1` |
| `.config/agents/skills/reconcile/references/reviewer-protocol.md` | `934a4c3aa74434e138dafbdc4aebfa77901e470f4e965270c809368cfbf36fc9` |
| `.config/agents/skills/reconcile/references/execution-flow.md` | `3666099fe40d965aec633013e7fca08ca1c19472ce7528d248da277a8da9859f` |
| `.config/agents/skills/reconcile/evals/evals.json` | `2fb09b4ad04528cd4ee3452091166653cfa30129033542be551fe89d3e3e4c01` |
| `.config/agents/harnesses/omp/agents/second-opinion-a.md` | `1a70df01174ecb1705d8728c06dd222cf5d8c9c0cf43380a997b5e5ddbca21d7` |
| `.config/agents/harnesses/omp/agents/second-opinion-b.md` | `f01184bf3448cba59de6fe67c56fc90a80396772861908b2ea874d5202efda0a` |
| `.config/agents/references/agent-return/return.md` | `9ba7e72128e5d5749783d712233fb75c077bcbc3911f7c7755f198abfa360a2d` |
| `.config/agents/harnesses/omp/agent-return.md` | `9575d6bcb29a0b36df7d6fb3cc9373e6885a28510a104cb52eadad4fa79a5a42` |
| `.config/agents/harnesses/omp/extensions/lifecycle-supervisor.js` | `c6f4e360beea17aedab5779584bfa6d12b4292a8c0e8acc42f374577513309ba` |
| `.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js` | `fab56c47d550a5b14d09713e5c7e2683ec8917b5109c8e49cccdbc826accdfa8` |
| `docs/adr/0010-replacement-lifecycle-plugin.md` | `1bf8dd7f1c6215bb76c104982e2063c7465df65a20ca09ab2b6f98672631862a` |
| `docs/adr/0004-canonical-discovery-and-continual-learning.md` | `231017aee9caac67c4378eea6e452caa5fba85fe0e4726a9b72cd46f75c6cb43` |
| `docs/adr/INDEX.md` | `02b236033b01a50ba306f181e6fb6705e3446856667cd7a34e9e0b54e32525b6` |
| `.config/agents/skills/retrace/SKILL.md` | `d5c469d3494f97eb72203502a88e1cbdfa86a7245fdaff3f16b8a541b1a8619d` |
| `.config/agents/skills/retrace/evals/evals.json` | `d52ac51a5a94c6d69c547ac1f1f80a155544a4024c90c2059f05d98bcc0ea099` |

### T1: Reconcile and every shared file

| File | Change |
|---|---|
| `reconcile/SKILL.md` | Delete the map pointer (`:21-24`). Cut `:35-50` to one sentence adopting the generic execution-recovery policy. Replace `:54-101` with C3. Delete the readiness, prohibition and proof text in `:120-150`, keeping the KB1 sentence. Replace the identity rules (`:151-157`, `:215-276`) with C1. Delete the readiness setup (`:286-294`). Replace `:363-402` with C4. Delete the synchronization section (`:453-469`) and every other synchronization mention, including stop `:553`. In the stop list delete `:544` and reword `:549-550` to "a fourth invalid return under one original expectation (C4)". Frame Correction and the review packet parts per C2 and C5. Add the delegated hooks: a reviewer `source-need` is relayed under Retrace's C7 and the same reviewer, pass and label continue, with no re-ask, no rethink, and no provisional response; a standalone `source-need` is an invalid return; an eligible delegated repair pause (`:534-535`) is reported through Retrace's `scope-paused` with both reviewers retained. |
| `reconcile/references/reviewer-protocol.md` | Delete the map pointer and return-doc reads (`:8-12`), the startup section (`:32-51`), the protocol location and hash (`:66`, `:76`), and synchronization (`:193-211`). Add the C5 `## Text framing` section verbatim. Replace the reply templates (`:101-133`) and echo lines with C2, including the framed Correction. Replace `:148-153` with the C4 invalid-return list, frame errors included, and the re-ask rule (one corrected complete response per re-ask; the controller stops at the 4th invalid return). Keep `:71-74` (the one BLOCKED retry). Lineage uses C1 values. Add the delegated-only `source-need` body and the C7 rule that claims rest only on supplied captures. |
| `reconcile/references/execution-flow.md` | Delete the file. |
| `reconcile/evals/evals.json` | Keep all 12 case IDs. Rename `REC-SYNC-REPAIR-RESUME` to `REC-APPLY-REPAIR-RESUME`, dropping branches D and G and keeping E, F and H–M. In the IRC and CURRENT cases, drop `:138` (readiness), `:145` (synchronization) and `:148` (proof), and rewrite `:142` and `:165` to C4. Replace echo-line malformations with C5 frame malformations and add one Correction whose payload ends in LF. Rewrite every assertion that makes an unchanged or non-applicable finalized REVISE an immediate stop, or that allows one corrective request, to C4. In `REC-TRUSTED-RETRACE` and `REC-DELEGATION-REJECT`, re-derive entry to C3 and drop branches that test only kinds, locators or publish-time hashes; add that a delegated reviewer `source-need` is relayed and a standalone one is invalid. Strip transport-only assertions elsewhere. Add the undisposed-run preflight assertion to `REC-ORDER-AUTHORITY`. |
| `omp/agents/second-opinion-a.md`, `omp/agents/second-opinion-b.md` | At most 10 body lines each: read the protocol, stay read-only, reply once through `lifecycle_channel`. |
| `references/agent-return/return.md` | Delete `:153-172`. |
| `omp/agent-return.md` | In `:88-95`, keep only "the plugin exposes no export operation or lifecycle-call destination field". Delete `:324-329`. Cut "or proof-export obligation" at `:177`. Next to the reply facts at `:52-56`, add one sentence stating C6 and one stating KS8. |
| `extensions/lifecycle-supervisor.js` | Remove probe mode: `MECHANICAL_PROBE_PROMPT` (`:42-45`), `#proofOnly` and its option (`:211`, `:228`, `:239`), the branch at `:470`, and `createMechanicalProbeSupervisor` (`:1133-1135`). Add C6: the `terminal` property next to `body` in the channel schema (`:173-191`), boolean validation next to the body check (`:773-775`), `const terminal = params.terminal !== false;`, the gate condition at `:790-793` prefixed with `terminal &&`, and the reply stored at `:800` as `{ body, terminal, acceptedAt }`. This is a declared behavior expansion beyond probe removal, inside the existing T1 targets. |
| `extensions/lifecycle-plugin.test.js` | Remove every probe reference: the import at `:6`, the `proofOnly` harness option (`:57`, `:113`) and the probe assertions (`:223-228`). Keep the production-prompt assertion (`:220-221`), the large-reply test (`:660-669`) and the `delivery-unknown` assertions (`:574-591`). Update any assertion that pins the reply schema or reply record shape. Add one test, `keeps owned reviewers live across nonterminal scope replies`, using the injected-client pattern (`clientFactory`, `:57`, `:98`). It must show: reviewer `source-need` accepted while the reviewer is live, and a second reviewer reply refused; a terminal scope reply refused while the reviewer is live, a non-boolean `terminal` refused, `terminal: false` accepted, and a second scope reply refused; root sees `terminal: false` and not the reviewer's body; the first premature reviewer request held until the reviewer's turn ends, and the next refused with `ACTOR_BUSY`; a 5th scope gets `CAPACITY_REACHED` through the pause; the root continuation reaches the same actor; reviewer disposal, then terminal `scope-result`, then observed scope disposal, after which the 5th scope is accepted. `lifecycle-consumers.js`, `lifecycle-plugin.js` and `fixtures/lifecycle-rpc-worker.js` stay untouched. |
| `docs/adr/0010-replacement-lifecycle-plugin.md` | Rewrite in place (below). |
| `docs/adr/0004-canonical-discovery-and-continual-learning.md` | Delete the second sentence of `:39` and the bullet at `:52`. `:62` stays. |
| `docs/adr/INDEX.md` | Update row `:18` only if its summary no longer matches ADR-0010. At `:26`, replace `lifecycle-plugin.md` with `.config/agents/harnesses/omp/extensions/lifecycle-plugin.js`. |

ADR-0010 rewrite in place:

- Keep D31 clauses 1–6 and clause 9 verbatim. Clause 9 becomes clause 8 by renumbering only.
- Clause 7 becomes: "The plugin owns lifecycle mechanics; Retrace and Reconcile own every semantic rule, including their no-fallback rule."
- Delete clause 8, the consequences at `:35-36`, and the second half of the proof-export rejected alternative (from "; prebound owners" to the end of the bullet).
- Add one Consequences bullet: "A delegated actor may mark a reply `terminal: false`. That skips only the owned-child disposal check: the reply still answers its request once, owned children stay live, and direct capacity stays held until observed disposal."
- Remove "and Reconcile human execution map" from `:59`.
- Authority (`:64`) names the new plan and quotes the ADR-0010 user decision word for word.
- Replace `:72` with: maintenance updates the extension, both skills and the fixtures together; standard review and verification apply; the maintaining plan's approval authorizes model-backed test runs.

### T2: Retrace

| File | Change |
|---|---|
| `retrace/SKILL.md` | Cut `:57-73` to one sentence adopting the generic execution-recovery policy. Replace `:83-261` with a short transport section holding C2, C6, C7 and the KB1 sentence, plus the C5 `## Text framing` section verbatim. In `:262-331` remove the freeze, hash and authorization text: step 1 replies `candidate-ready` per C2; step 2 extracts the report, checks the manifest against C7 and keeps the admitted body; step 3 sends `begin-reconcile` per C3; step 4 drops "synchronization" (`:308`); step 5 replies `scope-result` per C2 with no locator fields; step 6 runs C7 freshness. Add the `source-need`/`source-supply` and `scope-paused`/`resume` loops to steps 1 and 4. Replace `:333-382` with C4. At `:444`, replace from "follows the existing one-correction eligibility check" through "parent-retained hashes." with "is an invalid return under C4: when the same child and required state remain available, re-ask that child to correct only presentation." Keep verbatim quotations, full locators and "The parent never rewrites the report or source quotations." At `:446`, drop the `Kind: conversation` start and the header sentence. At `:459`, the manifest entry holds locator/selector, role, supporting or admitted use and provenance, and the root binds it to its own capture (C7). At `:461`, compare with the supporting capture, never a later read taken to publish, and add "Nested review completion does not establish currency." At `:472`, delete "synchronization, ". |
| `retrace/evals/evals.json` | Edit only these five cases; the other 16 stay byte-identical. `RETRACE-SCHEDULING`: a scope's nonterminal reply holds its permit until observed disposal. `RETRACE-DELEGATED-REVIEW`: drop readiness, counterpart synchronization and proof copying (prompt, expected output, `a0`, `a11`, `a12`); make `a5` C4; add C7 ordering (reviewer reply answered before relay, relay while the reviewer is finishing, reviewer successor not delivered before its turn ends, a further request `ACTOR_BUSY`, a second reviewer reply refused). `RETRACE-REVIEWED-BLOCKER`: a paused review uses `scope-paused` and holds its slot; drop synchronization from `a5` and count `source-need` exchanges as no round. `RETRACE-FINAL-FRESHNESS`: `a0` compares against the supporting capture; add the hash-then-reread race, late sources from evaluation and review, and `not-utf8-text` as a transport limit, not `unreadable`. `RETRACE-QUIESCENCE`: fresh request instead of fresh token; `a5`–`a7` use the shared C4 budget; `delivery-unknown` is KS8. |

## Left alone on purpose

- The `dev-ask` and `dev-implementation` skills and maps, and `return.md:51-74`.
- `lifecycle-consumers.js`, `lifecycle-plugin.js` and `fixtures/lifecycle-rpc-worker.js`.
- The scope sentences in ADR-0001 (including `:93`) and ADR-0003, and ADR-0004 `:62`.
- `scan_stale_contracts.py`, CLOSED plans, earlier specifications, proof artifacts, and the plan-0019 packet folders.

## Handoff coverage

|Handoff item|Where|
|---|---|
|R1 nonterminal replies, conditional D31|C2, C6, KS6, ADR-0010 bullet; D31 clauses 1–6 unchanged|
|R2 delivery uncertainty|KS3, KS8, C4|
|R3 observation binding|C1, C7, KT5 edits at `:459`, `:461`|
|R4 source-transport check|Transport probe|
|R5 root push and ordering|C2 bodies, C6, C7 ordering|
|R6 C4 precedence|C4, KR12, T1 stop-list edits|
|R7 framing and surgical cutover|C1, C2, C5, T2 edits at `:444`, `:446`, `:472`|

## Acceptance

Acceptance lives only in the linked plan.

## Residual risks

- Comparisons are exact, but a model performs them in delegated mode.
- Models may miscount backtick runs when choosing `D`; each resulting collision costs one C4 re-ask.
- A lost acknowledgment strands a later legitimate reply (KS8); only abort or disposal resolves it.
- Each `source-need` wave adds round trips and root work. A large explicit line range can still exceed a child's model context and fail its turn.
- Model copying fidelity for forwarded captures is unproven by the probe; D3 exercises the production path once.
- Dispatch from Eval through `tool.lifecycle` was not exercised (open and close were). D3 exercises it.
- Whether lifecycle children can read `skill://` paths when started with `--no-extensions --no-session` is unverified; D1 records it, and a failure stops the plan.
