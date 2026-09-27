# Handoff: Revise the Reconcile/Retrace native-result trial from reviewed v2

## Outcome

- Review complete: **revise v2; do not apply it unchanged**. Its direction and all four additional human decisions survive. The corrections below remove unsupported recovery, false failure classifications, and contradictory completion requirements; they do not authorize a different backend or weaken the preserved skill mechanics.
- Successor identity: `reconcile-retrace-native-result-revision/v3`. This supersedes the operative instructions in the user-supplied v2. Preserve the confirmed v1 artifact as historical decision evidence, not a second editable protocol.
- This handoff is revision input for Main. No bound decision evidence, specification, plan, live skill, rule, ADR, or trial implementation was changed. No execution is approved here.

### Authority and targets

The user's goal remains reliable execution without repair/rerun loops caused by presentation, newline/hash comparisons, duplicated protocol machinery, or treating a truthful negative experiment as unfinished implementation. Core Reconcile/Retrace semantics remain. Old custom-controller rules and gates have no backward-compatibility entitlement.

Preserve the earlier confirmed answers: `Structured result tool`, `One result boundary`, and `Complete the evaluation`. Preserve these second-review answers exactly:

- `isolation_evidence: Runtime tool-call check`
- `disposal_evidence: Record PID, then check`
- `session_copies: Don't keep them`
- `probe_placement: Separate first task`

On the next authorized revision, Main changes these three existing artifacts together:

1. `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-decision-evidence.md`: `acpx-omp-acp-trial-decisions/v4` → `v5`; distinguish confirmed decisions from proposed technical defaults below.
2. `.agents/artifacts/2026-09-24_acpx-omp-acp-trial-spec.md`: `acpx-omp-acp-trial/spec-v6` → `spec-v7`; replace superseded mechanics and acceptance, not merely their names.
3. `.agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md`: rederive the graph and exact acceptance projection, refresh the authority binding, and keep it `PENDING`, awaiting fresh execution approval.

Leave `.agents/artifacts/2026-09-23_reconcile-retrace-lean-redesign-spec.md`, its older plan, live skills, supervisor, rules, and ADRs unchanged during this revision. The preserved semantic baseline is KR1–KR16, KT1–KT5, KB1, and KS1–KS7: 29 obligations. KS8 is not an additional trial guard; its permanent rejection of an otherwise provable original reply conflicts with the confirmed observation-recovery direction.

### 1. Keep the architecture and semantic guard

Keep acpx's public shared runtime and native `omp acp`, with two application responsibilities:

- The transport adapter owns handles, request/window correlation, journal observation, cancellation, and observed disposal.
- One coded semantic controller owns approvals, bindings, reviewer progression, scopes/dependencies, budgets, application, validation, freshness, and admission.

No custom supervisor, mailbox, broker, independent receipt ledger, private acpx imports, or result extension. Logical ownership does not require nested controller processes.

Preserve the five-field brief and approved complete scope table; both Reconcile modes; run-original/immutable outer-base lineage; persistent read-only A/B, never replaced; A-first/lazy-B; first-review initial/rethink/post-rethink and later-review behavior; source-need continuing the same pass; exact VALID/REVISE/BLOCKED meanings; complete Correction and applicability; BLOCKED's approved-context retry; C4's original-expectation budget; no negotiation cap; controller-only, at-most-one committed application per outer iteration; application cap/closure; validators, final reread and drift stops; identity-preserving repair only within authority; no automatic rollback.

Preserve Retrace's approved dependency graph, authored scheduling order, at most four direct active actors per owner, independent-scope concurrency, resolved/current prerequisites, candidate-ready/parent-accept/delegated-Reconcile/scope-result ownership, source-need/scope-paused continuation, report-only review, evidence boundaries, manifests, G1–G4, freshness/dispositions, and truthful aggregation. Keep first-result ownership and successful siblings. Reply, turn result, reuse, and disposal are separate facts. Required children must be disposed before terminal parent/scope admission; capacity is freed only by observed disposal.

### 2. Keep native yield and the approved observational isolation check

Use `--tools read,glob,grep,yield`, retaining the other spec-v6 launch restrictions, private HOME/TMPDIR/session directory, harmless working directory, deny-all ACP permission policy, exact profiles, and live OAuth-store boundary. Retain the existing overlay, including memory/autolearn/advisor restrictions and `retry.modelFallback: false`; add the v2 keys:

```yaml
tools:
  xdev: false
goal:
  enabled: false
compaction:
  autoContinue: false
  experimentalContextManagement: false
contextPromotion:
  enabled: false
astGrep:
  enabled: false
externalThinking: false
```

Merge these into the existing nested configuration; do not replace it with this fragment. Send `mcpServers: []` through the public session-creation option. Do not change native mode/config options to obtain another tool surface. Pinned OMP's ACP factory disables host MCP; that is not a claim that every custom or extension-owned tool is excluded.

Keep the human-selected runtime check over **journaled** tool-call events, supported by exact launch/config evidence, absent canary, and unchanged protected sources. This replaces the old mandatory positive inventory/denial proof. It is a trusted-process, detect-after check, not a sandbox or complete tool inventory.

Correct the yield-input claim: the pinned declared keys are exactly `type`, `data`, and `error`. `YieldTool.intent = "omit"`; the generic `i` field is stripped before normal ACP rawInput. Do not let a probe expand the allowlist with arbitrary observed keys. An unexpected key is an observation to explain, not new permission.

The proposed observable policy permits `kind: read`, `kind: search`, and a `kind: other` yield candidate with the declared input shape. **This signature does not authenticate the tool name.** Search kinds cover more than grep/glob; other tools can have overlapping argument shapes; internal `write(agent://...)` traffic can be omitted from ACP. Record these limits in the scope and report. Do not claim that this check proves all actual calls were seen, that only four tools exist, or that no mutation was possible.

A start event proves an attempt, not execution: OMP emits starts before not-found, validation, preparation, blocked, and transform failures. Record attempted, failed/denied, and completed observations separately. An unexpected start may stop further work under the conservative runtime policy, but it is not by itself evidence of an executed forbidden tool or a native isolation defect. A failed update likewise does not prove absence of partial side effects. Use actual completion/effect evidence for a decisive violation; otherwise report the precise isolation uncertainty. Do not add an exact-title or error-prose parser to turn these observations into stronger proof. Never admit a failed call as a result.

### 3. Submission and tolerant domain validation

Each ordinary result-producing prompt asks for exactly one final native `yield` with explicit `data` and includes a short worked example for its current expectation. Model-authored hashes, receipt echoes, lifecycle declarations, and wire delimiters are unnecessary. Code supplies owner/session/request/phase/revision bindings and terminal scope status.

Use one controller-owned schema with variants for the existing exchanges. The first completed, non-error, terminal native result submission is the candidate; native success is not a VALID verdict. Require explicit `rawOutput.details.data` and native `details.status: success`; exclude incremental array `type`, `useLastTurn`, data-less/prose fallback, aborted native results, and schema-override admission. Do not require an exact full key set in `details`; optional native metadata is not a protocol failure. Validate the candidate once against the domain schema, retaining an invalid first candidate rather than selecting a later valid one to evade C4. Later terminal submissions for that request do not replace it.

The ordinary ACP launch supplies no application output schema, so native schema retries/overrides are not expected on this path. They exist in OMP generally and must not waive controller validation. OMP's separate empty-result counter persists across ACP prompts: the first three consecutive empty calls throw; the fourth returns an aborted terminal result; a subsequent non-empty return resets it. This is native behavior, not another controller allowance or a reason to reset C4.

Accept unambiguous syntactic variations in declared control keywords, and ignore irrelevant extra domain fields. Reject missing or conflicting required fields. Do not case-fold identifiers, paths, revision references, hashes, or payload text. Correction, Report, artifact content, and supplied source excerpts retain their actual content, including whitespace and newlines. Re-asks name the specific validator defect without silently repairing the payload or manufacturing a verdict.

### 4. One journal boundary; no post-window result rescue

Use public `watchSession` as the sole replayable result boundary. Drain `startTurn().events` for the submitter connection and diagnostics only; do not admit from it. Do not parse display previews, assistant prose, session JSONL, TUI output, or generic collectors as another result channel.

The pinned journal has a concrete ordering contract:

1. `turn_started` opens the owning request window.
2. Captured ACP messages carry that window's requestId.
3. Prompt cleanup clears message handlers and flushes captured messages.
4. `turn_result` closes the window.

The native prompt RPC can resolve before its final ACP tool update. acpx makes a best-effort 1-second-idle/5-second drain before cleanup. That is not complete-delivery proof. **Once the watch journal shows R's `turn_result`, a completion for R is already in R's captured window or is absent.** An update arriving after handler removal can be dropped; waiting after the journal marker cannot restore it. A later window or null-requestId line must never be bound backward to R by toolCallId. Delete v2's contrary rule and its post-`turn_result` late-wait calibration.

Keep only the state needed to apply that contract:

- An opaque last-consumed cursor and the machine-owned request/window association.
- Invocation lifecycle state keyed by the owning session/request and toolCallId. A start or in-progress update does not mark the invocation handled. A later cursor for that invocation can be its completed/failed update.
- The request's first terminal candidate, retained with its binding as soon as observed; semantic validation, turn settlement, reuse, and disposal remain separate.

The same cursor is duplicate observation. A new cursor is not automatically a duplicate merely because toolCallId repeats. Record the first terminal update for each invocation; never overwrite it with later observations. Do not assume provider IDs are unique forever, reassociate a dangling update across windows, or turn an ambiguous binding into a fresh reply. No repeated-value or cross-serialization equality gate is required.

Null-requestId/bootstrap/status traffic has no result authority and is not automatically a foreign-request defect. Known other requests are routed to their own state or ignored for the current request. A genuinely unknown non-null request on a trial-owned handle is a binding/integrity fault to explain, not a candidate to admit.

Retain a complete first result before advancing dependents or deleting temporary evidence. Later turn failure does not erase it. Do not wait for every unrelated tool update to retain that result, and do not turn a missing unrelated update into a missing-result claim. Unfinished relevant delivery, uncertain settlement, or failed required cleanup still cannot authorize reuse or terminal parent success.

### 5. Preserve C4 eligibility, not just its number

C4 still permits three re-asks per original expectation, shared across its existing categories; the fourth invalid return stops. A changed request ID, tool ID, category, phase wording, or re-watch neither resets nor consumes that allowance. A re-ask is a new authorized semantic request to the same available actor, never replay of uncertain execution.

| Observation | Required treatment |
|---|---|
| An attributable completed candidate fails required domain fields, identity/applicability, or another preserved invalid-return category | One C4 invalid return; re-ask only within the original expectation and after safe availability is established. |
| Intermediate failed tool call while the actor is working | Not a C4 return; the turn may continue. |
| Silence, observer loss, missing/unsettled relevant completion, or delivery uncertainty | No C4 charge and no re-ask/redispatch. Observe the original request within existing bounds; otherwise preserve its unresolved frontier and stop. |
| Concrete failed actor turn, native aborted result, or completed turn without a result | Apply existing mode-specific eligibility. Retrace counts an eligible concrete failure only while the exact actor, binding, candidate state, and connection remain available. Reconcile does not gain a new generic failed-turn allowance. Lost actor/channel stops. |
| Provider error or output-token limit | Record the actual cause. Neither implies malformed delivered data, byte loss, or C4 eligibility by itself. |
| Valid BLOCKED, source-need, or scope-paused | Preserve their own existing rules; they are not invalid-return failures. |

In particular, delete v2's “no admissible yield counts C4 whatever the cause.” Native `end_turn` is not a success oracle: a successful terminal yield, an aborted yield result, and some provider errors can all produce it. Do not map native error text to semantic BLOCKED. A yielded but incomplete Correction can be C4-invalid; an unobserved tool completion is not that same fact.

The lightweight transport probe/soak do not gain semantic re-asks to rescue missing payloads or size thresholds. Keep transport delivery, model protocol compliance, semantic outcome, and cleanup separately reported.

### 6. Observation recovery and same-session restoration

After observer loss or uncertain submission acknowledgement, re-watch from the last consumed opaque cursor for the original request. Admit an already captured original candidate at most once. Do not resubmit the prompt: requestId reuse is not idempotence. A synthetic `WATCH_OUTCOME_UNKNOWN` records uncertainty about the prior owner; it does not reopen the closed window or authorize a later-window result. A retained result can survive that failure without making the session reusable.

Expired history or an unresolved original outcome stops the affected work with successful siblings retained. Invalid/foreign/future cursors, corrupt journals, and unknown bindings require cause attribution. A cursor constructed incorrectly by the trial is a trial-code fault, not proof that acpx is unsupported. No error code automatically grants replay, new actors, or fresh allowance.

Keep `same-session-only`. acpx selects resume when advertised, otherwise load when supported; an advertised resume that fails does not fall through to load or new. Pinned OMP advertises resume. Load's replay updates are suppressed by acpx; native resume does not replay the old tool history. Do not justify blanket tool-ID deduplication using hypothetical lossy history replay.

Restore identity is the unchanged public native `backendSessionId` on the existing acpx record plus evidence of successful same-session restoration, with zero fresh-session fallback. A subsequent successful turn is separate continuation evidence; provider failure does not by itself change session identity. `SESSION_RESUME_REQUIRED`, even when marked retryable, remains an unrestored stop without prompt replay.

OMP persistence caps ordinary strings at 500,000 JavaScript string characters, not UTF-8 bytes or total JSON size. Record exposure of actual sent/observed strings to this limit. A stable ID does not prove complete restored context. A flag based only on sent/admitted sizes cannot prove that every other persisted field survived. If required restored context is exposed to loss, report that integrity as unproved unless evidence resolves it; observed required loss is a defect. Do not silently repair it with transcript reconstruction, splitting, replacement actors, or a new semantic payload cap.

Correct v2's size claims: journal rotation defaults to five 64-MiB segments; 64 MiB is not a hard per-line rejection rule. The queue IPC's 10-MiB buffer and the agent reader's separate default 8-MiB message limit are different boundaries. Overflow/connection failure is not successful partial delivery. Record actual boundary errors; do not invent a 64-MiB rejection classifier or promise unlimited retention.

### 7. Record public PIDs, then verify disposal

Preserve the chosen public-status-plus-read-only-observation method. No processLifecycle hook, private lease inspection, process registry, process-tree supervisor, or controller-issued termination signal is added.

Sample public `getStatus` opportunistically during a turn, at the journaled `turn_result`, and immediately before close. Parse positive `pid=` summary tokens and keep every distinct agent PID observed for that handle, including after idle restoration. Do not fail merely because an individual sample has no PID: acpx can publish the new agent PID only at prompt cleanup, and short idle expiry can clear it soon afterward. The first journal message is not a PID-publication guarantee.

Use the actual API:

```text
await runtime.close({ handle, reason })       # Promise<void>
status = await runtime.getStatus({ handle }) # separate persisted status
```

A resolved close and `status.details.closed === true` establish recorded closure, not observed exit. A thrown close means closure is unconfirmed, not proof that no close effect occurred. Do not ensure/reopen a closed handle to inspect it.

After close resolves, observe every recorded PID with signal 0 under a fixed finite post-return bound. `ESRCH` proves that PID is absent at observation; success means present; `EPERM` or another error does not prove exit. Never send a termination signal from the observer. Do not copy acpx's helper that treats every signal-0 error as dead.

Retain v2's disclosed conservative PID-reuse limitation rather than add birth-time tracking or a registry. A PID now belonging to another process may cause a false cleanup failure; do not kill that process to make the check pass. Public `pid=` identifies the OMP agent child, not every queue-owner/helper/descendant. Describe exactly what was observed; do not claim a process-tree exit proof.

Proposed approval-time default: a 10-second observation ceiling **after close returns**, with bounded polling. This is a proposal, not a human-approved number or a timeout on close itself. Record close-call duration and post-return exit-observation latency separately. Censored or failed observations are not successful latency samples. Remove the circular automatic `max(10s, 3×observed)` ratchet; measurement does not silently enlarge a bound.

A still-present PID, unconfirmed close, or lack of sufficient PID coverage leaves required disposal unproved. Missing PID evidence is not “PID still alive,” but neither is it success. Do not release capacity, admit a terminal parent, erase the only evidence, or claim evaluation completion while required cleanup remains unresolved. Report the exact owned resource/evidence gap for authorized human resolution.

### 8. No retained native session copies; safe journal export remains necessary

Keep native OMP session files only in private temporary storage needed for native restoration. Do not retain them. Remove native-session credential-pin stripping, parent relinking, nonce/own-user/parent-chain matching, assistant-shape mapping, and their obsolete fixtures/AC clauses. Remove both assistant-text decoders, live/watch/session text equality, superseded-text classification, and the old JSONL forbidden-abort classifier.

Do not replace these with blind copies of raw acpx journals. The journal writer records raw ACP messages, potentially including prompt/resource bytes, tool inputs/outputs, permissions, and MCP/config values. The trial bundle does not yet exist; there is no implemented “existing no-secrets checker” to cite.

Specify one small safe export projection before retention: machine-owned session/request/window/cursor/tool-call associations, statuses and kinds, policy-relevant safe argument fields, complete safe result data, timings/usage, approved inputs/configuration, and classification evidence. Omit irrelevant authentication/MCP env/headers, permission bodies, embedded resource bytes, and non-result tool output. Record all policy observations without retaining unrelated raw bodies. Prove the export boundary with harmless synthetic records; never inspect live credentials to populate fixtures or redaction values.

Do not redact or rewrite an authoritative Correction/Report and then call it an exact retained result. If required result evidence cannot be retained safely, stop that export and report the evidence gap, preserving private material under the existing restricted cleanup boundary. A field-name filter is not a universal credential detector. No credentials, native session copy, or unrelated personal data may enter the retained bundle.

Retain the safe result and its binding before admitting/advancing dependent work or deleting private evidence. Delete temporary storage only after required observed disposal and safe evidence retention. Failed-close evidence must survive. The retained result is application state, not a second transport or an equality oracle.

### 9. Separate first probe task, with finite work and unchanged ceilings

Keep the separate native feasibility task before investment in the full semantic runner. “T0” may name that probe phase in prose; the lean plan grammar starts task IDs at T1. Use this pending graph, migrating old task-number references consistently:

- **T1 — native probe:** complete minimal launcher/probe, shared native adapter/config and safe observation needed for that probe, its findings, and its cleanup. No full Reconcile/Retrace controller or production-profile work.
- **T2 — mechanics and lightweight soak:** depends on T1; implement the semantic controller, independent experiment verifier/fixtures, 29-guard mapping, and the existing 4×10 native soak when probe support permits. Reuse, rather than copy, the shared native boundary.
- **T3 — final evaluation:** depends on T2; run production scenarios only when the support gate permits, and always finalize the evaluation/report and required cleanup account, including an explicitly skipped production branch.

Give each task one owner and exact nonoverlapping write targets. The probe must be independently runnable, not an unfinished library scaffold. The later runner consumes its stable shared implementation. Bind probe evidence to the pins/config and shared native implementation it actually exercised; later addition of semantic code is not a change to that evidence. A material change to the exercised native boundary invalidates the affected proof; it does not authorize an automatic native rerun.

Proposed finite probe recipe for the revised approval: two tiny-profile sessions, at most four planned prompts total—two on the normal-TTL session for canary/submission and same-session reuse, then two on a short-TTL session spanning one deliberate between-settled-turn expiry and same-ID restoration. Close both with PID observations. Stop on the first decisive negative; never add prompts to obtain a preferred result. The extra probe expiry is separate from the soak's four planned expiries and must be explicitly disclosed in the future Effects field, not hidden behind “counts unchanged.” Do not force live empty-yield failures or rare branches just to calibrate a counter; record those if observed and keep source/scripted proof separate.

The probe records exact launch/pins/authentication, available supported configuration evidence, the chosen observable tool policy, native result delivery before the journal closes, terminal behavior, next-prompt reuse, same-ID restore, PID availability, and disposal. Do not require an imaginary diagnostic exposing every effective setting or treat model self-description as that diagnostic. Confirm configured restrictions and report the limits of runtime observation. No model-discovered intent key or post-journal grace window is a calibrated setting.

T1 probe and T2 native soak **share** USD2 reported cost and 20 minutes of native-evaluation wall time. Proposed explicit accounting for the separate tasks: sum elapsed execution intervals, including native launch/observation and ordinary cleanup; exclude only implementation/approval gaps with all trial resources observed closed and no model work. Enforce the remaining wall allowance in each interval; never reset it per task, session, or retry. Cleanup required after a ceiling still runs without new model submissions, with any overrun disclosed. State this accounting in the revised approval rather than claiming it was measured or granting two separate budgets.

These probe traffic/timing details are technical proposals for the revised plan, not new confirmed interview answers. Fresh plan approval binds them before execution.

Preserve all established pins and production bounds:

- acpx `0.19.2` and its existing npm integrity; Node >=22.13. OMP `/Users/kim/.local/bin/omp`, `omp/18.3.0`, 208460816 bytes, SHA-256 `d61fb411f24146bed48dd901b13b5912a297d899ee691dda69c4b5b7ab8c35dc`. No planning-time remeasurement, backup inspection, downgrade, or binary swap.
- A `openai-codex/gpt-5.6-sol:xhigh`; B `xai-oauth/grok-4.6:xhigh`; tiny `xai-oauth/grok-4.6:low`. No automatic model fallback or assumed cheaper per-token pricing.
- `PI_CODING_AGENT_DIR=/Users/kim/.omp/agent`, no credential copy/inspection, no inherited provider API-key/broker overrides; only the already disclosed future OAuth refresh/bookkeeping effect.
- Soak: four concurrent native sessions × ten sequential turns; four planned restores at turns 5/6; five designated re-watches; exactly three designated requests for approximately 48 KiB of substantive payload, requiring at least 32768 UTF-8 payload bytes. No padding, continuation, added turn, or re-ask to rescue size/delivery.
- Scripted mechanics: exact 2097152-byte UTF-8 payload with independent expected content/digest. Measure native soak payload bytes from the designated decoded string field, not JSON serialization, tool receipts, or another representation.
- Production: one S1 Conversation case, one S2 copied-artifact case with cap 1, one S3 with s1/s3 overlap and s2 depending on resolved/current s1. Preserve the genuine-model and naturally-absent-branch rules.
- 120-minute turn timeout, 130-minute finite normal idle TTL, 1-second deliberate idle-expiry TTL; production ceilings USD20, 2000000 reported tokens, and 120 minutes. No indefinite TTL, replacement reviewer, or uncertain-request replay.
- Cost/token data can be absent, delayed, or overshoot in flight. Report unknown/overshoot and enforce wall time independently; do not claim a monetary hard cap without a meter. Keep per-turn production durations, censored observations, actual completed maximum and its 2×/3× arithmetic, never an invented default.

### 10. Complete an evaluation without passing an unsupported capability

Keep three distinct conclusions: trial implementation/check correctness, native capability result, and whether the approved evaluation is complete. A capability can be `supported`, `not-supported`, or directly evidenced `inconclusive`; a dependent branch can be `not-run` because its prerequisite is not supported **including an inconclusive prerequisite**. Do not restrict this to decisive negatives while the production gate also rejects inconclusive inputs.

Define these conditional paths in the specification and plan acceptance before execution:

- If a phase is entered, its required implementation/mechanics/verifier checks must actually pass. A code defect, contradictory/missing required evidence, unauthorized effect, or unresolved required cleanup is not an acceptable native negative and cannot be hidden by `not-run`.
- If an upstream native result prevents entry, dependent capability/implementation work may be explicitly not run only where the approved conditional contract says so. Record the blocking prerequisite and direct evidence. Do not claim that an unbuilt runner passed its code checks or that a skipped native threshold was met.
- The final-report path remains runnable after an early negative. It reports completed/skipped work, actual evidence, exact causes, remaining limits, and cleanup; it does not depend on an unbuilt later verifier or a production run.
- Production spending requires all required upstream capabilities supported, required code/mechanics checks passed, and proof bound to the relevant current candidate/config/pins. A successful evaluation-status check alone cannot open that gate.
- Correct semantic BLOCKED/C4 stops can be valid protocol outcomes without proving useful task completion or transport reliability. Report that distinction.

Use one independently checked evaluation report, not another assurance lifecycle. Preserve standard assurance: one final independent code/test review and verification of the produced target and its actual conditional check set. The experiment's production-spend gate is not an extra review cycle. Normal bounded repair applies to genuine trial-code faults; it grants no request replay, extra native traffic, or reset of resource/semantic limits.

Remove prescribed rerun recommendations and automatic routing back to the old lean design. Return the actual cause and justified options. A narrow extension or upstream transport correction can be named as a separately authorized option when evidence warrants it, never treated as an approved fallback or assumed cure.

### 11. Proof and governing-document cutover

Replace “every implementation branch, identical 3/3” with independent, transition-oriented experiment checks. Cover valid and malformed domain results; intermediate tool errors; duplicate cursor versus lifecycle update; two terminal submissions; original captured result recovered after observer loss; retained result followed by turn failure; missing completion at a closed journal window; null/foreign/ambiguous ownership; applicable versus ineligible C4 failures; same-session restore and failure; preserved siblings/dependency gating; application/cap/closure/freshness; PID sampling/failed disposal; safe export; and early negative/inconclusive evaluation with a closed production gate. Keep the exact scripted large-payload oracle. Do not force rare live verdicts or repeat models solely to obtain a fixture-like branch.

Allocate revised AC ownership by capability and task, not by the old 15-ID count. Preserve IDs whose meaning survives; merge AC-REQUESTS into transport only if all surviving obligations remain directly checked. Add native-probe acceptance; keep mapping/mechanics strict; separate production permission from evaluation completion; reduce AC-CLEANUP to actual observed closure/safe retention; make AC-REPORT valid on approved negative/skipped branches. Treat the soak prompt and independent verifier as test code, not runner self-assertions.

The specification owns detailed mechanics. The lean plan must still contain its required Outcome/Authority, Scope/Effects/Non-goals, Tasks, Acceptance, and Recovery/Stops fields. Project each referenced AC's exact Behavior and Check text as required by `plan-impl-spec`; those copies are not independently editable authority. Do not remove the plan's direct checks or add a T0 parser exception to avoid a harmless numbering change.

For the eventual separately authorized live cutover, allocate one semantic owner per invariant: skills for skill semantics, shared schema/controller for wire mechanics, trial specification for proof/effects, ADRs for rationale/boundaries, and the derived plan for execution. Narrow KB1/D31 to authorize only the owner-bound native ACP result channel; generic task/hub/Eval/TUI/transcript collectors remain nonauthoritative. Remove superseded readiness/synchronization, identity echoes, text-framing admission, duplicate receipts, and permanently poisoned-observation rules only on the affected custom-controller surfaces. Unrelated generic workflow contracts are not revised by this handoff.

## Changed targets/effects

- Added only `.agents/artifacts/2026-09-24_reconcile-retrace-native-result-revision-handoff-v3.md`: the integrated v2 review and successor revision instructions for Main.
- Preserved the bound decision evidence/specification/plan, v1 handoff, older lean artifacts, live code/skills/rules/ADRs, and binary/authentication state unchanged. No trial bundle was created.
- Performed read-only repository/source inspection and three bounded source-research slices. No installs, builds, tests, model trials, credential/live-session inspection, binary checks, Git operations, shipping, or production changes.

## Checks

- REVIEW-AUTHORITY-C4
  Behavior: Preserve the confirmed decisions and original invalid-return eligibility rather than silently widening the budget.
  Check: Compare v1's confirmed direction, the four second-review answers, and [lean C4](./2026-09-23_reconcile-retrace-lean-redesign-spec.md#c4-re-asks-and-stops-both-skills) lines 270–285; expect original-expectation accounting with silence/observation failures excluded and Retrace's failed-turn eligibility preserved.
  Observed: PASS for source review; v2's catch-all C4 rule is removed, and all four additional answers remain explicit.

- REVIEW-YIELD-ISOLATION
  Behavior: Use actual native result fields and distinguish observable attempts from successful submission and from complete isolation proof.
  Check: Inspect pinned OMP [yield](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/tools/yield.ts), [agent loop](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/agent/src/agent-loop.ts), [ACP mapper](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/modes/acp/acp-event-mapper.ts), and [ACP factory](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/main.ts); expect the declared keys, intent omission, native counters, completed-result fields, coarse kinds, and pre-execution start events described above.
  Observed: PASS for source findings; the observable signature is not a unique tool identity, and no installed-runtime isolation/result proof is claimed.

- REVIEW-JOURNAL-RECOVERY
  Behavior: Admit only a captured original result in its owning journal window and preserve it independently of later turn failure.
  Check: Inspect acpx v0.19.2 [runFinalizedSessionPrompt/cleanupPrompt](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/runtime.ts), [event writer](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/events.ts), [journal reader](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/journal.ts), and [best-effort prompt drain](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/prompt-turn.ts); expect handler removal/flush before journal turn_result, cursor-based observation identity, and no later-window/null-ID rescue.
  Observed: PASS for source findings. The initial research hypothesis allowing post-journal-result binding was rejected against the writer/cleanup ordering and is not part of this successor. Real delivery completeness remains UNRUN.

- REVIEW-RESTORE-LIMITS
  Behavior: Separate same-session identity from successful continuation and avoid fictitious replay/size guarantees.
  Check: Inspect acpx [reconnect selection and failure](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/reconnect.ts), [client replay suppression](https://github.com/openclaw/acpx/blob/v0.19.2/src/acp/client.ts), [journal defaults](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/event-log.ts), and OMP [session persistence](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/session/session-persistence.ts); expect resume-first/load-if-unsupported selection, no same-session fallback after failure, and the stated distinction between persistence and transport limits.
  Observed: PASS for source findings; no restore was executed and no lossless-context guarantee was established.

- REVIEW-DISPOSAL
  Behavior: Use public API shapes correctly and require observed agent-process absence rather than a closed flag or missing PID sample.
  Check: Inspect acpx [shared close/getStatus](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/shared.ts), [status](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/status.ts), [closeSession](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/session-control.ts), and [lifecycle snapshot](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/lifecycle.ts); expect void close, separate status, agent PID publication/clearing, and no proof of exit from record closure alone.
  Observed: PASS for source findings; PID availability and exit timings are UNRUN. The 10-second post-return proposal is not a measurement.

- REVIEW-RETENTION-AND-COMPLETION
  Behavior: Remove native session copies without inventing safe raw-journal retention, and permit evidenced negative evaluation without concealing code or cleanup failures.
  Check: Inspect the current spec's retention/acceptance clauses, the raw journal append path, the absent trial-bundle location, and current plan/plan-impl-spec grammar; expect an explicit future safe export, conditional direct checks, final reporting after early stops, T1-based task numbering, and no automatic native rerun.
  Observed: PASS for review findings and revised instructions; there is no implemented trial exporter/verifier to claim tested.

- RUNTIME-PROOF
  Behavior: Source review and a handoff do not establish native reliability, isolation, restore, disposal, resource, or production-readiness acceptance.
  Check: After Main's artifact revision and fresh execution approval, exercise the actual native probe, applicable experiment branches, independent checks, and required cleanup; expect measured results or truthful evidenced limitations under the approved conditional contract.
  Observed: UNRUN; no current trial AC is claimed passed by this review.

## Blocker/risk

- Review completion blocker: none. All four human answers are preserved; the source corrections and proposed approval-time defaults are explicit.
- Runtime result delivery remains an actual feasibility question. The native ACP-handler/drain race can lose a completion before the journal closes; a longer post-journal wait is not a repair. Do not conceal this behind C4 or a fallback result channel.
- The selected runtime tool-call check is incomplete observation, not positive tool identity/isolation proof. PID-only observation has conservative reuse risk and does not prove every helper/descendant exited. Carry those limits into the next approval and report rather than enlarging the mechanism silently.
- Missing required safe evidence or unresolved required disposal still blocks evaluation completion. A negative capability result does not make those obligations disappear.
- Probe traffic, cumulative execution-time accounting, and the fixed post-close observation bound are proposed specification details awaiting the revised plan's approval. No binary/model/account/network execution or production cutover follows from this handoff.

## Next receiver

- **Main**, the bound specification/plan author: receive this successor for the next authorized revision of decision evidence, specification, and pending plan; present the revised execution contract for approval. Do not implement or execute from this handoff.
