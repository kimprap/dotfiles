# acpx + OMP ACP Reconcile/Retrace Trial

**Revision:** `acpx-omp-acp-trial/spec-v10`  
**Status:** Current technical authority for the completed spec-v9 trial record and its S3 completion follow-up  
**Date:** 2026-09-26  
**Receiver:** `Main`  
**Next-owner role:** Main executes the S3 completion follow-up plan after its one approval

## Authority and approved outcome

[Decision evidence v8](./2026-09-24_acpx-omp-acp-trial-decision-evidence.md), exact revision `acpx-omp-acp-trial-decisions/v8`, owns the confirmed human choices and verbatim option/question record. This specification integrates v3, v5 A1–A7, v7 B1–B6, the final integration corrections and the v8 S3 completion decisions into one technical authority. Historical handoffs remain unchanged provenance, not extra executable rule layers. Unnamed rules retain their operative content; only the named supersessions and necessary internal references are changed.

Produce a retained, production-shaped but non-adopted experiment answering whether acpx's supported shared runtime and native `omp acp` carry the complete Reconcile/Retrace semantics without a custom low-level supervisor. The calling LLM collects the five-field brief/full scope-table approval and genuine models judge the work; code owns scheduling, binding, semantic progression, admission, application, observation and cleanup. Complete the evaluation truthfully, not by forcing support or a preferred semantic outcome.

Spec-v9 governed the completed plan `.agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md` (`DONE`; plan, bundle and `runs/` committed at `63d3664`). Spec-v10 changes only the resource limits, the runs root and the authority bindings needed for one S3 completion follow-up; its execution contract is [S3 completion follow-up (spec-v10)](#s3-completion-follow-up-spec-v10). The one human approval of the follow-up plan approves this revision, decision evidence v8 and that plan, and authorizes exactly the follow-up effects named there. Nothing else is approved: no dependency install, credential inspection, live-config change, fault injection, Git or shipping action, or production adoption. The older lean specification/plan and live skills/rules/ADRs remain untouched. Rehearsal, diagnostics, replay, typed export, debugging policy and PID sampling are trial-proof mechanics, not generic workflow or future live-skill mandates.

## Pins and public runtime constraints

- Preserve exact acpx `0.19.2`, npm integrity `sha512-wLeY2T3vfa63/Oa6fsrbtCXAx6PhfdWvAvw+F6mv3gO/NYWTQf6MpGAWWvmO2JYq8YAhRJ+zt48/BWKz1JiMWg==`, and Node `>=22.13.0`. The human-approved OMP pin is `/Users/kim/.local/bin/omp`, `omp/18.3.0`, **208460816 bytes**, SHA-256 **`d61fb411f24146bed48dd901b13b5912a297d899ee691dda69c4b5b7ab8c35dc`**. The reviewing session measured this binary; the human adopted the pin. Do not repeat the measurement during planning. Future S0 checks this exact pin and stops before model launch on mismatch; no backup inspection, binary swap/downgrade, or installation outside the bundle. A matching binary identifies the executable, not its ACP capability.
- Explicit trial launch pins: production reviewer A and every actor using A's exact profile, including S3 scope evaluators, use `--model anthropic/claude-opus-5-5 --thinking medium`; production reviewer B uses `--model xai-oauth/grok-4.7 --thinking medium`; tiny (canary, layer (b), soak and rehearsal) uses `--model xai-oauth/grok-4.7 --thinking low`. S0 and AC-ENV compare the launched arguments with these explicit trial pins. S0 records live `modelRoles` from nonsecret `omp config list --json` at run time as provenance only; a difference from the trial pins is not profile drift. No trial launch uses `xhigh`. Tiny shares B's underlying `grok-4.7` at low thinking; low thinking is **not evidence of cheaper per-token pricing**. Medium is a cost choice, not a measured price, and does not enlarge any grid, pool or rerun allowance. T1's “no production-model spend” means no production A/B review runs at their production profiles. Acceptance of the medium thinking setting remains unproved until T1; a provider rejection is an evidenced environment stop, not authority to choose another level. No automatic model fallback or substitution.
- Existing live store is `/Users/kim/.omp/agent`; prior metadata observed owner-only `0700` directory and `0600` `agent.db`. Credentials are not inspected now. `PI_CODING_AGENT_DIR` selects this existing store. No provider API-key or auth-broker variables are forwarded. Source: [OMP secrets/auth](https://omp.sh/docs/secrets).

acpx exports `acpx/runtime` and `acpx/agent-registry`. `createSharedAcpRuntime` accepts cwd, registry, permission/auth policy, `timeoutMs`, and `ttlMs`; persistent prompt turns expose request ID, `promptStarted`, events and result. Public watch, status, close, cancel and shutdown are available. Shared runtime rejects custom stores, child-env overlays, `processLifecycle`, fs/terminal switches, per-turn callbacks and steering. Use `resumePolicy: "same-session-only"`; `shutdown()` detaches and does not close owned sessions. No private imports, custom queue/IPC, registry or substitute supervisor may fill a missing capability.

The installed binary's actual native behavior is unproved here. Source facts refer to acpx v0.19.2 and OMP source `62bc57be1b03ef0802a33cf7f5f530e534527531`; they do not establish native reliability, tool isolation, restoration, disposal or model-size support. The previously observed help/config/TUI facts remain prior evidence, not new measurements or an ACP session-text oracle.

## Architecture and guarded semantics

Keep acpx's public shared runtime and native `omp acp`, with two application responsibilities:

- The transport adapter owns handles, request/window correlation, journal observation, cancellation, and observed disposal.
- One coded semantic controller owns approvals, bindings, reviewer progression, scopes/dependencies, budgets, application, validation, freshness, and admission.

No custom supervisor, mailbox, broker, independent receipt ledger, private acpx imports, or result extension. Logical ownership does not require nested controller processes.

The LLM-side input contains immutable candidate bytes/identity, run-original, mode, Goal/Context, cap, exact five-field brief and human approval provenance; the normalized scope table, stable IDs, objectives/protections/exclusions, requires/shared-evidence/potential-conflict links and approval provenance; and the separately authorized layer/effect envelope. Runtime input validates these bindings before any model process. Delegated Reconcile receives the scope's admitted candidate-ready report and approved scope contract, skips only the redundant standalone brief, and remains report-only. Source strings cannot impersonate approval or parent ownership.

One coded semantic controller owns approvals, bindings, reviewer progression, scopes/dependencies, budgets, application, validation, freshness and admission. The shared native adapter owns handles, request/window correlation, journal observation, cancellation and observed disposal. Logical scope ownership uses ordinary owner-bound objects/dispatch closures, not nested controller processes or a second registry. Root admits scope results, never nested review results.

Keep the necessary state separate:

```text
Reviewer = role, ownerScope, handle, backendSessionId, firstActualReviewComplete,
           request, lastConsumedCursor, state
Review = approvedContext, runOriginal, canonical, immutableOuterBase,
         workingProposal, lineage, originalExpectation, invalidReturns,
         blockedRetryUsed, applications, cap, closureOnly, seenFrontiers
Request = requestId, owner, handle, backendSessionId, expectedPhase,
          candidateIdentity, windowStartCursor, lastConsumedCursor,
          invocationLifecycles, firstCandidate, admittedReply,
          turnResult, cancellationCause, reuseState, observationAvailability,
          submittedAt, promptStartedAt, settledAt
Scope = approvedContract, requires, state, candidate, reviewedReport, manifest,
        childHandles, disposalObservation
```

The fields above are implementation state, not model-authored binding echoes or an extra receipt ledger. Submit every request ID once. Preserve every admitted first reply owner-locally. Session state remains `active | idle | restoring | unrestored | closing | closed`; restoration does not reset first-review flags, identity, allowances or other consumed state. Fresh session creation is allowed only for initial first creation of a previously unstarted role in an authorized complete execution. Reply/candidate, turn settlement, reuse and disposal are independent facts.

### Complete accountable guard

The semantic baseline is [KR1–KR16, KT1–KT5, KB1 and KS1–KS7](./2026-09-23_reconcile-retrace-lean-redesign-spec.md#keep-unchanged-the-only-hard-guard). All 29 obligations are allocated here. A1/B1 contain the expressly amended C4 eligibility/accounting; KB1 below is trial-only. KS8 is not an additional trial guard. The preserved brief, review/report content, current Retrace evidence rules and KT5 presentation/freshness edits remain binding; no removed transport ceremony is reintroduced merely to preserve an old implementation.

| Guard | Accountable boundary and observable enforcement |
|---|---|
| KR1 | **LLM before runner:** infer explicitly named candidate, else latest substantive proposal, else unresolved; collect exact five-field Goal/Candidate/Context/Mode/Maximum-controller-applied-outer-iterations approval. Runner rejects missing/ambiguous approval or unreadable sole-source candidate/authority. |
| KR2 | **Runner:** distinct Conversation replacement and Artifact edits paths; no delegated artifact fallback. |
| KR3 | **Runner:** cap `none` or positive integer, count only committed changed applications, permit one closure-only iteration; invalid cap rejected. |
| KR4 | **Runner:** same persistent read-only A/B; only same-ID process restoration; never replace a reviewer. |
| KR5 | **Runner:** A starts every outer iteration, including closure; B starts only on applicable finalized REVISE needing counterpart. |
| KR6 | **Runner:** first real review in a reviewer session is initial → same-session rethink → post-rethink; only later thereafter. Source-need continues its pass and cannot trigger another rethink. Restore preserves the flag. |
| KR7 | **Runner/parser:** VALID accepts exact current proposal; REVISE changes it; BLOCKED authorizes no mutation. Recommendations are never applied. |
| KR8 | **Runner:** complete conversation replacement or complete exact edit set against unchanged outer base; reject unchanged/nonapplicable Correction via C4. Never layer unapplied patches. |
| KR9 | **Runner:** first VALID ends negotiation; BLOCKED gets one approved-context retry; persistent BLOCKED stops; no review-turn cap. |
| KR10 | **Runner:** at most one application per outer iteration; then reread, count once, validate, begin A-led next iteration. |
| KR11 | **Runner:** immediate terminal artifact reread; changed bytes are drift, not an adopted baseline. |
| KR12 | **Runner:** complete stop list minus synchronization; up to three invalid-return re-asks per original expectation, fourth invalid return stops, all categories share budget. |
| KR13 | **Runner:** only explicitly authorized identity-preserving repair at the exact failed step; no automatic rollback or allowance reset. |
| KR14 | **Runner:** close/dispose both actual reviewers (unused B need not be created); failed disposal prevents final success. |
| KR15 | **Runner rendering, LLM display:** Review rounds + Final proposal or Reconcile stopped formats; preserve reviewer text byte-for-byte, no controller rewrite. |
| KR16 | **Runner:** scope-delegated Reconcile can replace only its report; evidence/artifact/source edits forbidden. |
| KT1 | **LLM intake + runner validation/scope prompt:** readable bound repository root, authored objectives, causal finding eligibility, parent/scope/optional-normalizer entries with exact ownership. No arbitrary evaluands. |
| KT2 | **LLM before runner:** normalize complete Scope/Evaluate table and separately declared requires/shared-evidence/potential-conflict links; human approves full table. Runner validates DAG and immutable contract; new scope needs a new human-approved table, not automatic discovery. |
| KT3 | **Runner scheduler:** at most four direct active actors, ascending requires depth then authored order, only requires controls readiness; slot frees on observed disposal. Ready independent scopes overlap. |
| KT4 | **Runner:** evaluate → candidate-ready → parent accept → begin-reconcile → scope-owned delegated Reconcile → reviewers disposed → scope-result → parent accept → scope subtree disposed. Source-need/scope-paused continue the same frontier. |
| KT5 | **Scope/evaluator model + coded boundaries/validation:** full Evidence boundary, Method, G1–G4, status/freshness/disposition labels, Result formats, supporting manifests, both final freshness checks, aggregate/stops and read-only stance; root cannot invent findings or upgrade model claims. |
| KB1 | **Trial-only runner admission + LLM instructions:** the only reply source is the native `yield` candidate defined by the Submission/Journal sections and A1, admitted only after domain validation. An invalid candidate is a C4 invalid return, not a reply. Task, hub, Eval, any `yield` not admitted under those rules, ordinary output, transcripts, history, agent output and generic collectors never count as a reply or fallback. C2 keyword lines and C5 frames are neither admission rules nor fallback. Live skills/ADRs remain under the separately authorized live-cutover boundary. |
| KS1 | **Runner:** preserve first reply and deliver only to its owning logical parent; no root admission of nested review. |
| KS2 | **Runner:** reply, turn result, reuse state distinct; later turn failure does not erase first reply. |
| KS3 | **Runner:** pending until reply, concrete terminal failure or explicit abort; uncertain delivery observed without replay. |
| KS4 | **Runner:** disposal requires observed process exit, never just returned close/turn/shutdown. |
| KS5 | **Runner:** batch/dependent failure preserves successful siblings, evidence and admitted IDs. |
| KS6 | **Runner:** children disposed before parent terminal reply; terminal:false source-need/scope-paused only exception. |
| KS7 | **Runner/LLM boundary:** generic ADR-0002 collection contracts and generic execution-recovery policy remain unchanged; implementation-child exemptions never bypass named custom-controller ownership/lifecycle requirements. |

At outer iteration start, copy canonical candidate into immutable outer base and working proposal, reset only outer working lineage, and select A. Preserve run-original and consumed budgets. REVISE updates only ephemeral working proposal until VALID. C4 original expectation survives new request IDs, category changes and source-supply continuations. The surviving invalid domain fields, identity/applicability, required manifest and other C4 categories share the original-expectation allowance in A1; code supplies phase/binding/terminal ownership rather than requiring model echoes. Valid source-need, scope-paused and BLOCKED are not malformed returns; BLOCKED uses its separate one retry. Silence, status wakes and observer errors earn no re-ask. Stop on repeated A/B cycle, label/reviewer pair without new evidence, repeated unresolved frontier, repeated supplied/refused source request, authority conflict, unavailable same session/channel, cap, terminal drift, and failed/partial application/validation. Synchronization is not added back.

Artifact failure reports exact accepted base, Correction, observed bytes, failed step/error and required repair authority. Identity-preserving repair retains target/mode/scope/authority/reviewer identities/lineage/content and retries only the failed step; changed candidate authority needs a new approved binding. Never auto-rollback. Closure-only may validate but cannot apply another change.

Scope prompts preserve Retrace's current evidence-locator closure, evaluand/supplied-evidence/runtime-control distinction and quarantine, current/historical classification, causal eligibility, bidirectional coverage walk, four-part finding identity, no-change/reuse/small-extension/bounded-validation/redesign ladder, and G1–G4 completeness caps. Code validates structure, manifests and admissible locators; it does not replace semantic judgment with a score. Resolved means review `complete`, freshness `current`, disposition `proposal|no-change`; reviewed `blocker` cannot satisfy requires. Recheck actual supporting sources before acceptance and aggregate; drift invalidates actual consumers and transitive requires dependents, not unrelated shared-evidence neighbors. Preserve unaffected results; no automatic reevaluation. Render the six scope-report sections (Outcome Validity only with execution evidence) and four aggregate sections exactly as bound by KT5, complete immutable reviewed reports, correct full locators and four-part identities. Derive rounds/updates/VALID-by-round from admitted events, not a second counter ledger.

## Launch, isolation, retention scope and effects

Only `.agents/artifacts/acpx-omp-acp-trial/` is the future implementation/retained-evidence target. Keep trial code, harmless inputs/copies, prompts, complete safe results and bindings, typed runtime observations, code/native verdicts, source/config provenance, fixtures, timings/usage and `report.json`/`report.md`. Native OMP session files and raw journals remain private temporary material outside retained evidence; no native-session copies, JSONL sanitizer/parent relinker, stored-user nonce/assistant-shape oracle or live/watch/session-text equality is retained.

The launcher creates private `HOME` and `TMPDIR` outside the retained bundle, then starts the controller with only PATH, required locale/TLS settings, those private paths, and `PI_CODING_AGENT_DIR=/Users/kim/.omp/agent`. It drops provider API-key, broker, profile, model-override, and inherited session-directory variables. Do not copy credentials or the live database. Existing configured OAuth accounts authenticate directly; ordinary OAuth refresh/account-affinity bookkeeping through that shared store is the explicitly disclosed future effect. Do not log tokens, query credentials, migrate accounts, perform login/logout, or write live config.

Registry argv arrays launch the pinned executable, not a shell-composed command:

```text
/Users/kim/.local/bin/omp acp --model <exact model ID> --thinking <low|medium>
  --tools read,glob,grep,yield --no-extensions --no-skills --no-rules --no-lsp
  --no-title --config <trial-owned overlay> --session-dir /Users/kim/.omp/agent/sessions/acpx-trial-<runId>
```

2026-09-25 user decision (spec 374/516): OMP 18.3.0 applies `--session-dir` when creating a session (`main.ts` 512; ACP `session/new` writes the file before any prompt, `acp-agent.ts` 692–701, 1234–1241) but ignores it when loading: `#findStoredSession` (2239) searches the cwd-derived folder and then only `<agentDir>/sessions/*/*.jsonl` (`session-listing.ts` 656), else throws `ACP session not found`. The session directory is therefore the direct child `/Users/kim/.omp/agent/sessions/acpx-trial-<runId>` (one level deeper fails). This is a disclosed live-store effect: other OMP session lists can see trial sessions while a run is active, and load-by-id reads every live session header. Cleanup runs only after every published PID shows ESRCH and never reads file contents: (1) delete `<ts>_<id>.jsonl` for each recorded session ID in the run folder, and its exact OMP lock `.<ts>_<id>.jsonl.lock.os` only when that is an empty regular file; (2) recursively delete only its same-name `<ts>_<id>/` folder if present; (3) `rmdir` the run folder, then the empty cwd-named live-store folder for that run, if present; (4) keep and report anything else or any non-empty folder, with no other recursive delete in the live store; (5) a reproduction half using an old private `--session-dir` removes that private root like other private roots after ESRCH, then `rmdir`s the empty cwd-named live-store folder it created. Exactly one corrected T1 execution is authorized for this cause; any further native T1 run needs a new user decision. Run 1 (`t1-probe-20260925T095041Z-f08505`) alone may close its cleanup without published PIDs, on no remaining `omp acp`/acpx/queue-owner process, no `/private/tmp/acpx*` folder, and removal of its two empty live-store folders by plain `rmdir`; all other runs keep ESRCH for every published PID.

Use a harmless scenario working directory without discovery files. The nested trial overlay contains no secrets and sets:

```yaml
memory:
  backend: off
autolearn:
  enabled: false
  autoContinue: false
advisor:
  enabled: false
mcp:
  enableProjectConfig: false
  notifications: false
retry:
  modelFallback: false
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

Send `mcpServers: []` in public ACP session creation/resumption. The shared runtime supplies this empty argument by default and rejects a top-level shared-runtime `mcpServers` initializer option; do not pass that unsupported option. Shared-runtime permission mode is `deny-all` with noninteractive denial, supplementary to the native tool restriction. Do not change native mode/config options to obtain another tool surface. Pinned OMP's ACP factory disables host MCP; that is not a claim that every custom or extension-owned tool is excluded.


Keep the human-selected runtime check over **journaled** tool-call events, supported by exact launch/config evidence, absent canary, and unchanged protected sources. This replaces the old mandatory positive inventory/denial proof. It is a trusted-process, detect-after check, not a sandbox or complete tool inventory.

Correct the yield-input claim: the pinned declared keys are exactly `type`, `data`, and `error`. `YieldTool.intent = "omit"`; the generic `i` field is stripped before normal ACP rawInput. Do not let a probe expand the allowlist with arbitrary observed keys. An unexpected key is an observation to explain, not new permission.

The proposed observable policy permits `kind: read`, `kind: search`, and a `kind: other` yield candidate with the declared input shape. **This signature does not authenticate the tool name.** Search kinds cover more than grep/glob; other tools can have overlapping argument shapes; internal `write(agent://...)` traffic can be omitted from ACP. Record these limits in the scope and report. Do not claim that this check proves all actual calls were seen, that only four tools exist, or that no mutation was possible.

A start event proves an attempt, not execution: OMP emits starts before not-found, validation, preparation, blocked, and transform failures. Record attempted, failed/denied, and completed observations separately. An unexpected start may stop further work under the conservative runtime policy, but it is not by itself evidence of an executed forbidden tool or a native isolation defect. A failed update likewise does not prove absence of partial side effects. Use actual completion/effect evidence for a decisive violation; otherwise report the precise isolation uncertainty. Do not add an exact-title or error-prose parser to turn these observations into stronger proof. Never admit a failed call as a result.

The controller alone may mutate trial copies. Hash the protected live Reconcile/Retrace sources, governing ADRs, older lean artifacts/plan and approved input fixtures before/after; source drift fails the trial. Never hash/log live credentials. Ordinary disclosed OAuth refresh/account-affinity bookkeeping is not forbidden source drift. Only the typed A7 projection enters retained storage. Retain the complete safe result and binding before admission/dependent advancement or private evidence deletion; preserve failed-close evidence and remove private storage only after required safe retention and observed disposal.

After separate execution approval, disclosed effects are: one pinned local npm install inside the bundle; scripted ACP and native OMP/queue processes; assigned provider/model traffic and ordinary live-store OAuth bookkeeping; harmless copied-artifact writes; private HOME/TMPDIR/session storage creation/removal; the probe's deliberate idle expiry and the soak's four planned expiries; public observer detach/re-watch; supported close/cancel; and read-only signal-0 PID observations. Re-asks, rehearsal and corrected complete executions are the exceptions to old fixed-total-traffic wording and obey their cumulative pools. No observer termination signal, OS-signal fault injection, private process supervision, foreign-session attachment, credential/config copy, unrelated mutation, global install, fallback broker/model, shipping or live adoption is granted. Rollback means stop submissions, dispose owned resources and preserve evidence/frontiers, never automatically undo accepted artifact changes or delete failed scenario copies.

## Native result and lifecycle contract

### Submission and tolerant domain validation

Each ordinary result-producing prompt asks for exactly one final native `yield` with explicit `data` and includes a short worked example for its current expectation. Model-authored hashes, receipt echoes, lifecycle declarations, and wire delimiters are unnecessary. Code supplies owner/session/request/phase/revision bindings and terminal scope status.

Use one controller-owned schema with variants for the existing exchanges. The first completed, non-error, terminal native result submission is the candidate; native success is not a VALID verdict. Require explicit `rawOutput.details.data` and native `details.status: success`; exclude incremental array `type`, `useLastTurn`, data-less/prose fallback, aborted native results, and schema-override admission. Do not require an exact full key set in `details`; optional native metadata is not a protocol failure. Validate the candidate once against the domain schema, retaining an invalid first candidate rather than selecting a later valid one to evade C4. Later terminal submissions for that request do not replace it.

The ordinary ACP launch supplies no application output schema, so native schema retries/overrides are not expected on this path. They exist in OMP generally and must not waive controller validation. OMP's separate empty-result counter persists across ACP prompts: the first three consecutive empty calls throw; the fourth returns an aborted terminal result; a subsequent non-empty return resets it. This is native behavior, not another controller allowance or a reason to reset C4.

Accept unambiguous syntactic variations in declared control keywords, and ignore irrelevant extra domain fields. Reject missing or conflicting required fields. Do not case-fold identifiers, paths, revision references, hashes, or payload text. Correction, Report, artifact content, and supplied source excerpts retain their actual content, including whitespace and newlines. Re-asks name the specific validator defect without silently repairing the payload or manufacturing a verdict.

### Journal windows

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

### A1. C4 closure

Use two distinct meanings of completion:

- A **terminal tool update** has ACP status `completed` or `failed`; it closes one invocation. A failed tool update is not a submitted result.
- A **final result submission** meets the Submission section's native admissibility conditions: completed non-error yield candidate, explicit data, native success, not incremental, not useLastTurn, not schema-overridden. Domain validation follows; native success is not a VALID verdict.

Retain and validate the first such candidate as soon as it is observed in its owning journal window. Do not delay retention until `turn_result`, replace an invalid first candidate with a later one, or erase it after a later turn failure. Track unfinished invocations, window settlement, cancellation, reuse, and cleanup separately. An existing candidate does not conceal those other facts or by itself authorize another request.

At closure, apply the following semantic action. A request receives at most one invalid-return charge from this closure; individual intermediate tool errors do not each consume C4.

| Observation | Semantic action |
|---|---|
| A retained first candidate exists | Validate once. A valid result keeps its ordinary meaning; an invalid domain result consumes one C4 invalid return. Re-ask only if the actor remains available and all independent stop/resource conditions permit it. Later failure does not erase the candidate. |
| No candidate, and the controller intentionally cancelled, the experiment ceiling was reached, or authority was revoked | Stop under that cause. Do not spend C4 or issue a new request to undo the stop. Preserve partial evidence. |
| No candidate, and an observed relevant yield invocation lacks its terminal tool update in the closed window | Delivery uncertainty: no C4 charge, re-ask, or replay. Preserve and stop the affected expectation. Classify the native observation under A2; do not infer its cause from the missing update alone. |
| No candidate or unfinished relevant yield, and the journal result is `failed` or `cancelled` for another reason | Preserve the existing failed-turn distinction. Retrace may count one eligible concrete failed turn only while the exact actor, binding, candidate state, and connection remain available. Reconcile does not gain a general failed-turn allowance. Lost actor/channel or an uncertain original outcome stops both. |
| No candidate or unfinished relevant yield, and the journal result is `completed` | One C4 invalid return in **both skills**, under the new human answer. This includes prose-only/empty/output-limit returns, only failed or denied yields, only incremental submissions, useLastTurn, or a native aborted result. Name the defect and restate the allowed verdicts; never convert native error text into semantic BLOCKED. |

Use the journal's actual `completed | failed | cancelled` status, its stop reason, and the controller's own cancellation/effect record. `WATCH_OUTCOME_UNKNOWN` is uncertainty, not an eligible concrete failed turn merely because it is encoded in a failed result.

OMP can map provider errors to `end_turn`, so a provider error may reach the completed/no-result row. This is an explicitly disclosed consequence of the new decision, not a transport-integrity claim. Do not introduce error-prose parsing. Every re-ask still requires the same available actor, remaining C4 allowance, and remaining experiment authority/resources.

Before closure, silence, missing observation, and intermediate tool failures retain the journal-window and observation-recovery rules. Valid BLOCKED, source-need, and scope-paused retain their own rules. A new request/tool ID, duplicate observation, changed category, or phase wording does not reset the expectation's budget. Probe/soak expectation accounting is specified in B1.

### A2. Delivery observations and source limitations

**Source-established:** `#trackPromptEvent` records the promise returned by `#handlePromptEvent`; the normal `agent_end` path finishes after its idle wait without calling the all-handler drain; some outside-handler finish paths do drain; events entering after settlement return early. The ordinary tool-result handler invokes `sessionUpdate` before its first delivery await. These facts identify an ordering/completeness question, not a measured loss probability or a demonstrated root cause for a future missing result.

**Do not implement the proposed one-line fix.** During `agent_end`, its promise is itself in `record.promptEventHandlers`. Awaiting `#waitForPromptEventHandlers(record)` there includes the current promise and creates a self-dependency. An offline reproduction of this promise pattern remained pending. Any separately authorized upstream work must first establish the failing interleaving and arrange for settlement to wait for required prior notification delivery **without waiting on the currently executing handler**. Moving that barrier outside the tracked handler is an option to investigate, not an approved or verified patch.

For each probe/soak request, record these independent observations:

- recognized yield-candidate starts and invocation terminal updates, including completed-success, native-aborted, and failed updates;
- the retained first final candidate, if any;
- unfinished observed invocations at window closure;
- actual journal result/stop reason and controller cancellation/ceiling facts;
- completed/no-result compliance misses; and
- whether full required observation was available or a trial-code/evidence fault prevented classification.

Do not describe this as a complete lost-result counter. Entirely unobserved starts/completions cannot be distinguished from no submission using this boundary alone; the tool signature itself is observational, as the tool-policy section discloses. A valid retained first result remains delivered even if an extra invocation is unfinished. Record that additional anomaly without relabeling the retained result as lost or treating the semantic row as a complete lifecycle verdict.

B2 is the sole bounded capture-fault diagnostic and required-missing-update classification rule. A genuine evidenced trial-code fault remains a trial-code fault and follows B4, not a manufactured native negative. Absence of a result alone is insufficient evidence of that fault. Completed/no-result turns are model/protocol-compliance observations, not proven byte loss; B1 controls eligible re-asks and eventual delivery counts. An unmet required threshold without an independently established defect is unproved/inconclusive, not supported.

A native capability result, a missing-update observation, or a desired different model outcome is not a B4 rerun trigger. A later diagnosis establishing an actual trial-code cause must carry its evidence; changing the label alone grants nothing. Report the upstream ordering investigation as an option only, not as a fix already proven necessary or sufficient.


### Observation recovery and same-session restoration

After observer loss or uncertain submission acknowledgement, re-watch from the last consumed opaque cursor for the original request. Admit an already captured original candidate at most once. Do not resubmit the prompt: requestId reuse is not idempotence. A synthetic `WATCH_OUTCOME_UNKNOWN` records uncertainty about the prior owner; it does not reopen the closed window or authorize a later-window result. A retained result can survive that failure without making the session reusable.

Expired history or an unresolved original outcome stops the affected work with successful siblings retained. Invalid/foreign/future cursors, corrupt journals, and unknown bindings require cause attribution. A cursor constructed incorrectly by the trial is a trial-code fault, not proof that acpx is unsupported. No error code automatically grants replay, new actors, or fresh allowance.

Keep `same-session-only`. acpx selects resume when advertised, otherwise load when supported; an advertised resume that fails does not fall through to load or new. Pinned OMP advertises resume. Load's replay updates are suppressed by acpx; native resume does not replay the old tool history. Do not justify blanket tool-ID deduplication using hypothetical lossy history replay.

Restore identity is the unchanged public native `backendSessionId` on the existing acpx record plus evidence of successful same-session restoration, with zero fresh-session fallback. A subsequent successful turn is separate continuation evidence; provider failure does not by itself change session identity. `SESSION_RESUME_REQUIRED`, even when marked retryable, remains an unrestored stop without prompt replay.

OMP persistence caps ordinary strings at 500,000 JavaScript string characters, not UTF-8 bytes or total JSON size. Record exposure of actual sent/observed strings to this limit. A stable ID does not prove complete restored context. A flag based only on sent/admitted sizes cannot prove that every other persisted field survived. If required restored context is exposed to loss, report that integrity as unproved unless evidence resolves it; observed required loss is a defect. Do not silently repair it with transcript reconstruction, splitting, replacement actors, or a new semantic payload cap.

### A3. Exact public-acpx 2 MiB fixture and serialized hops

**Settled route.** Layer (a)'s exact-size fixture is a dedicated, fresh, one-turn scripted ACP server reached through the **public shared acpx runtime**: `ensureSession` → `startTurn` with concurrent diagnostic drain and `watchSession` → ordinary close/status/disposal. It is not an in-process-only adapter test. No prior prompt/payload history shares this fixture's session. The first `ensureSession` uses initialize/new and closes that client; the queue owner subsequently initializes and resumes the same scripted session. The server advertises `agentCapabilities: {sessionCapabilities: {resume: {}}}`—an object, not `true`—and no auth methods, modes, model/config options, usage, `_meta`, or unsolicited messages. It implements the advertised resume and the single prompt; it never calls a model. This mechanics fixture proves the stated public transport path, not native OMP behavior or provider context persistence.

Use acpx 0.19.2 with the calculation's SDK **1.4.0 locked in the bundle's package-lock**; acpx's published `^1.4.0` range alone does not bind a serializer revision. Do not float that calculation dependency. The isolated fixture launcher leaves `npm_package_name`/`npm_package_version` unset so the pinned installed acpx package supplies client version `0.19.2`. The shared-runtime initializer does not accept a top-level `mcpServers` option; its public session creation/resumption sends the required `mcpServers: []` by default. No private import or unsupported option is needed.

**Actual fixture, not an invented worst-case character class.** Define exactly:

```js
const P = "BEGIN-2M\n" + "x".repeat(2097152 - 17) + "\nEND-2M\n";
const D = { kind: "transport-result", payload: P };
const rawInput = { data: D };
const rawOutput = {
  content: [{ type: "text", text: "Result submitted." }],
  details: { data: D, status: "success" },
};
```

The prefix is 9 bytes, suffix 8, and x-run 2,097,135. `P` is exactly **2,097,152 UTF-8 bytes**, with three LF characters and no quotes/backslashes. Its SHA-256 is **`9c9214717e58d8ceaf581255faab35c026e5d6b408a0a9df56169b7e247cfebf`**. The independent oracle checks that full decoded value against this byte count and digest after the real public route. `JSON.stringify(P)` is 2,097,157 bytes: payload + three escape bytes + two quotes. Compact `D`, `rawInput`, and `rawOutput` are respectively **2,097,195**, **2,097,204**, and **2,097,290** bytes. Do not drop the input copy, output envelope/content, required evidence or payload bytes to make the calculation fit.

The fixture-selected values are `SID = "fixture-2m"`, `TID = "yield-2m"`, `RID = "fixture-request"`, prompt `"large-payload"`, and public `sessionKey = SID`. Public registry argv is `["node", "/Users/kim/.dotfiles/.agents/artifacts/acpx-omp-acp-trial/fixture-agent/large.mjs"]`. Its rendered command has 86 ASCII bytes and its script path 81. A fresh UUID-named private root `/tmp/acpx-2m-<36-character UUID>` supplies `HOME = root + "/home"` (54 bytes) and `cwd = root + "/cwd"` (53); both are ASCII and private. UUID values and actual ISO timestamps are not predicted: UUIDs occupy 36 ASCII characters and the source's ISO timestamps 24. The ACP SDK's fresh connection request counter gives initialize/new or resume/prompt IDs 0/1/2. The created acpx record ID equals the fixture's returned SID on this route; this equality is not assumed for other native sessions.

The two **separate** LF-terminated update messages are `JSON.stringify({jsonrpc:"2.0",method:"session/update",params:{sessionId:SID,update}}) + "\n"`, using these complete updates:

```js
const startUpdate = {
  sessionUpdate: "tool_call", toolCallId: TID,
  title: "yield", kind: "other", status: "in_progress", rawInput,
};
const terminalUpdate = {
  sessionUpdate: "tool_call_update", toolCallId: TID,
  title: "yield", kind: "other", status: "completed",
  content: [{ type: "content", content: { type: "text", text: "Result submitted." } }],
  rawOutput,
};
```

The start uses the declared native input shape and carries the full P; the terminal carries it again at `rawOutput.details.data.payload`. The extra ACP content is the short text block, not another P. `details.status` is `success`; ACP tool status is `completed`, never `success`. Omitted optional native-yield fields are undefined, not fabricated values. Admission still follows the native-result contract and domain validation; this recipe does not authorize ordinary text as a reply.

**ACP stdio and journal sizes.** Every entry below is compact JSON **including one trailing LF**. Initialize params are `{protocolVersion:1,clientCapabilities:{fs:{readTextFile:true,writeTextFile:true},terminal:true},clientInfo:{name:"acpx",version:"0.19.2"}}`. Its response is `{protocolVersion:1,agentCapabilities:{sessionCapabilities:{resume:{}}}}`. New params are `{cwd,mcpServers:[]}` and result `{sessionId:SID}`; resume params `{sessionId:SID,cwd,mcpServers:[]}` and result `{}`. Prompt params are `{sessionId:SID,prompt:[{type:"text",text:"large-payload"}]}`; prompt result is `{stopReason:"end_turn"}`. Requests/responses have the JSON-RPC 2.0 envelope and their matching numeric IDs; notifications have no ID.

| Message | ACP bytes incl. LF | Occurrence / journal |
|---|---:|---|
| initialize request | 213 | once at creation and once at the owner connection; only the latter is in this turn's journal |
| initialize response | 114 | same |
| session/new request | 137 | creation only; no turn-journal entry |
| session/new response | 61 | creation only; no turn-journal entry |
| session/resume request | 165 | owner connection and turn journal |
| session/resume response | 37 | owner connection and turn journal |
| session/prompt request | 137 | one turn and journal |
| tool_call start | 2,097,413 | one full P; journal stores this JSON line, not a queue envelope |
| tool_call_update terminal | 2,097,589 | one full P; same journal rule |
| session/prompt response | 60 | one turn and journal |

Journal markers use `schema:"acpx.session.journal.v1"`: segment `{type:"segment",record_id:SID,sequence:0,message_sequence:0,request_id:null}` is 131 bytes; `{type:"turn_started",request_id:RID}` is 90; `{type:"turn_result",request_id:RID,result:{status:"completed",stopReason:"end_turn"}}` is 145. The full one-turn journal is therefore **4,196,094 bytes**, including every LF, anchor and marker. Appending a batch writes its members as separate lines, not an enclosing JSON array. The watch reader's 1 MiB page target does not truncate an oversized complete line; it returns that line whole. Watch cursors are base64url encodings of `[recordId,sequence]`, not another serialization of P. Watch yields in-process message/cursor objects from this journal, **not another queue-IPC hop**.

**Queue IPC, including the hidden completion-record copies.** Let `g` be the actual decimal digit count of the owner generation (1–15), and `p` the actual positive Darwin PID digit count (at most 10). These are size parameters, not claimed runtime observations. Each event line is compact `{type:"event",requestId:RID,direction,message:<ACP object>,ownerGeneration:G}` plus LF. Values below use the upper-width instantiation `g=15`, `p=10`; each event/ack line's exact size is its displayed value **+ (g−15)**. The input request uses public `permissionMode:"deny-all"`, `nonInteractivePermissions:"deny"`, `timeoutMs:7200000`, the shared same-session-only policy, zero prompt retries, completion waiting and prompt-start reporting; unset options are omitted.

| Queue message | Bytes incl. LF at upper widths |
|---|---:|
| client → owner submit_prompt, including both message and prompt text | 353 |
| owner → client accepted | 84 |
| initialize request event (outbound) | 327 |
| initialize response event (inbound) | 227 |
| resume request event (outbound) | 279 |
| resume response event (inbound) | 150 |
| prompt request event (outbound) | 251 |
| prompt_started | 90 |
| start event (inbound) | 2,097,526 |
| terminal event (inbound) | 2,097,702 |
| prompt response event (inbound) | 173 |
| result, including the complete SessionSendResult record | 4,204,190 |

The exact result-line size is **4,204,190 + (g−15) + (p−10)**. It contains `{type:"result",requestId:RID,result:{stopReason:"end_turn",sessionId:SID,permissionStats:{requested:0,approved:0,denied:0,cancelled:0},record,resumed:true},ownerGeneration:G}` plus LF. `record` is the in-memory camelCase session record, **not** the snake_case disk serializer. Its fully accounted fields on this fresh route are:

- `schema:"acpx.session.v1"`, `acpxRecordId:SID`, `acpSessionId:SID`, `agentCommand`, `agentArgv`, `cwd`, `name:SID`, `createdAt`, `lastUsedAt`, `lastSeq:8`, `lastRequestId:"2"`;
- `eventLog:{active_path:HOME+"/.acpx/sessions/fixture-2m.stream.ndjson",segment_count:5,max_segment_bytes:67108864,max_segments:5,last_write_at:<ISO>,last_write_error:null}`;
- `closed:false`, actual `pid`, ISO `agentStartedAt` and `lastPromptAt`, `protocolVersion:1`, the initialize `agentCapabilities`, `title:null`, `messages`, ISO `updated_at`, `cumulative_token_usage:{}`, `request_token_usage:{}`, `acpx:{}`. Undefined optional agent-session/close/exit/import/cost fields are omitted.

`messages` contains the 36-character UUID user message with `{Text:"large-payload"}`, then one Agent message. Its ToolUse is `{id:TID,name:"yield",raw_input:IN_PREFIX,input:rawInput,is_input_complete:true,thought_signature:null}`; `tool_results[TID]` is `{tool_use_id:TID,tool_name:"yield",is_error:false,content:{Text:OUT_PREFIX},output:rawOutput}`. Both full objects remain present. Each prefix is the source's `JSON.stringify(value).slice(0,3997) + "..."`, applied to **rawInput** and rawOutput respectively—not D alone and not a U+2026 ellipsis. Each prefix has 4,000 ASCII characters; its re-encoded JSON string occupies **4,012** and **4,024** bytes respectively, including quote/backslash re-escaping. The conversation is **4,202,886 bytes**, and the record **4,203,951 + (p−10)**. This accounts for the two full P copies in the result as well as both summaries and every metadata field above.

There are **four full encoded P occurrences** across the two payload events plus the completion record. The entire owner→client turn burst—eight events, accepted, prompt_started and result—is exactly **8,400,999 + 11(g−15) + (p−10)** bytes/code units for this all-ASCII fixture. It is at most **8,400,999**, leaving **2,084,761** below the client's 10,485,760 limit even if a receive callback sees the whole still-unread burst. Source writes one JSON line per message in 65,536-byte slices (33, 33 and 65 slices for the two large events and result); it does not batch several events into one JSON message. OS coalescing is not asserted to have a fixed size. The client checks its accumulated JavaScript string length **before** splitting complete lines, not just the current line and not UTF-8 bytes generally; ASCII makes the units equal here. The client→owner request limit is unset by default, and that 353-byte request contains no P.

**Other copies and limits.** The largest ACP reader line is the terminal update: **2,097,588 bytes excluding LF**, leaving **65,011,276** below 67,108,864 (64 MiB). No used payload hop exceeds its existing limit. Diagnostic formatting re-stringifies each already-decoded ACP message in process (2,097,412 and 2,097,588 bytes for the two updates without LF); it is not another queue frame or reply source. Normalized conversation checkpoint storage also keeps its two full objects and summaries, but it is not the watch/admission source and does not pass through either reader limit. A typed retained fixture result `JSON.stringify(D)+"\n"` is **2,097,196** bytes; no unknown session/metadata dump is needed or authorized as evidence. Status reads are local, and ordinary close/shutdown do not resubmit this prompt or emit another P. Disposal controls contain IDs/booleans or their actual error, not the payload; their outcome must still satisfy A4 rather than be inferred from this size calculation.

These are **offline serialization results**, not an observed acpx trace or binary/model measurement. The UUID/PID/time values were not fabricated as observations. T2 binds the specified fixture and dependency/environment shape. The runtime check passes only when the decoded payload is exactly 2,097,152 bytes with the digest above, it traversed the settled public acpx route, no used hop exceeded its existing limit (the 10 MiB queue IPC buffer or the 64 MiB ACP line limit), and no required evidence was removed; failure of any of these fails the check. The byte tables above are pre-approval feasibility evidence, not an equality oracle: a difference in timestamp, sequence, segment count, PID width or other incidental metadata is reported and is not a failure. None of this permits stripping evidence, shrinking the payload, raising a reader limit, or moving to an easier boundary. This fixed route and its conservative complete-burst accounting are settled here, before approval; implementation does not choose whether the 2 MiB proof uses public acpx.

Source authority: [shared runtime and supported options](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/shared.ts), [session creation](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/session-management.ts), [turn/output/result assembly](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/runtime.ts), [client request construction](https://github.com/openclaw/acpx/blob/v0.19.2/src/acp/client.ts), [client capabilities](https://github.com/openclaw/acpx/blob/v0.19.2/src/acp/client-protocol.ts), [client version](https://github.com/openclaw/acpx/blob/v0.19.2/src/version.ts), [queue framing and pre-split limit](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/queue/ipc.ts), [socket slicing](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/queue/socket-output.ts), [journal writer](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/events.ts), [journal reader](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/journal.ts), [conversation normalization](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/conversation-model.ts), [record parser](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/persistence/parse.ts), [journal defaults](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/event-log.ts), [ACP line reader](https://github.com/openclaw/acpx/blob/v0.19.2/src/acp/ndjson-stream.ts), [SDK 1.4.0 request counter](https://cdn.jsdelivr.net/npm/@agentclientprotocol/sdk@1.4.0/dist/jsonrpc.js), and [native yield result envelope](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/tools/yield.ts).

### A4. Observed disposal

Preserve the chosen public-status-plus-read-only-observation method. No processLifecycle hook, private lease inspection, process registry, process-tree supervisor, or controller-issued termination signal is added.

Use the actual API:

```text
await runtime.close({ handle, reason })       # Promise<void>
status = await runtime.getStatus({ handle }) # separate persisted status
```

A resolved close and `status.details.closed === true` establish recorded closure, not observed exit. A thrown close means closure is unconfirmed, not proof that no close effect occurred. Do not ensure/reopen a closed handle to inspect it.

After close resolves, observe every recorded PID with signal 0 under a fixed finite post-return bound. `ESRCH` proves that PID is absent at observation; success means present; `EPERM` or another error does not prove exit. Never send a termination signal from the observer. Do not copy acpx's helper that treats every signal-0 error as dead.

Retain the disclosed conservative PID-reuse limitation rather than add birth-time tracking or a registry. A PID now belonging to another process may cause a false cleanup failure; do not kill that process to make the check pass. Public `pid=` identifies the OMP agent child, not every queue-owner/helper/descendant. Describe exactly what was observed; do not claim a process-tree exit proof.

For each closed handle:

1. Record every positive agent `pid=` exposed by public status during operation, at journal settlement, before deliberate idle transitions when observable, after restoration, and immediately before close. Keep the handle-local set; no generation registry or private lease inspection is added.
2. Require close to resolve and the separate public status check to confirm recorded closure. Neither fact substitutes for observed exit.
3. Require ESRCH for every recorded PID. An earlier ESRCH observation after deliberate idle expiry is retained evidence for that ended process; it need not be erased or replaced by a later missing-PID sample. If exit was not established earlier, observe it within the proposed 10-second post-close-return bound.
4. Account for known process starts/restorations in the existing operation evidence. If an owned actor process may have run but no PID/exit observation covers that activity, cleanup remains **unproved**. An empty PID set is not a vacuous exit proof. Only positive evidence that no actor process was started permits a not-applicable PID check.

A normal-TTL handle that completed a turn should expose a PID at settlement or pre-close; the probe must establish actual availability. Do not upgrade “normal TTL has not elapsed” to certainty that the process is still alive: a crash or disconnect can clear the snapshot. Likewise, an idle-expired earlier instance and a failed-before-completion instance are not exempt merely because their PID was missed. No completed turn is not proof of no started process.

The observed-disposal requirement, child-before-parent rule, and disposal of a failed execution before a corrected execution remain binding. If the public path cannot supply the required evidence, report the exact limitation and leave evaluation completion false; do not add a private supervisor or silently lower the proof standard. A human may separately decide to change that safety requirement.

For a thrown close, use the existing execution-recovery policy **only if explicitly adopted for that operation before execution** and its eligibility is actually established. A temporary failure with known safe prior effects and no existing finite retry policy may qualify for the single unchanged retry. A throw alone does not establish transience, safe repeatability, or unchanged effects: close can already have stopped processes before a later step fails. Diagnose through safe non-repeating observation; unknown effects, identity failure, or unknown/exhausted allowance prohibits retry. Do not turn the general policy into an unconditional “close twice” rule.

Keep the 10-second post-return bound as a proposed specification default awaiting plan approval, not a new confirmed human answer or a deadline measured from close invocation. A still-present PID, EPERM, insufficient coverage, unconfirmed close, or unresolved cleanup blocks capacity release, terminal parent success, corrected native execution, and evaluation completion. The final report still runs and names the resource/evidence gap. PID reuse can cause conservative false failure; never kill an unrelated process to obtain ESRCH.

### A7. Closed typed export

Construct retained evidence from closed controller-owned record types. Do not copy a raw journal object and delete a blacklist of properties, spread unknown native metadata, or introduce a general redaction framework.

Before execution, enumerate the permitted fields in the existing evidence types rather than leaving “safe fields” as an open wildcard. Retain only what the existing checks need: machine-owned bindings/cursors and invocation facts; fixed classification/status facts; policy-relevant explicitly selected argument fields; the known domain variant's required result fields and exact payload text; approved nonsecret configuration/input provenance; and lifecycle/timing/usage observations. Native titles, arbitrary error prose, raw details/metadata objects, and unknown nested extras are not implicitly permitted.

Domain validation may ignore unknown extra fields without exporting them. Preserve complete **required** Correction/Report/artifact/source payloads exactly; that does not require retaining every opaque field the model supplied. Invalid-result evidence should identify the structural defect and needed safe facts without dumping unrelated bodies or values.

Keep the single harmless metadata-exclusion fixture, with independently authored expected output:

- Put a canary in env, headers, permission body, embedded resource bytes, non-result tool output, and unknown nested metadata.
- Expect the canary absent and the complete known safe result payload present unchanged, including its meaningful newlines/escaping.
- Do not compute the expected projection using the exporter under test or merely assert that an export exists.

That fixture proves field exclusion and safe-payload preservation, **not that arbitrary allowed strings cannot contain secrets**. Keep the separate retention rule: if required result evidence is known unsafe or its required safe-retention condition cannot be met, do not export it, redact it into a claimed exact result, or mark the evidence complete. Report the precise gap and preserve only permitted restricted private evidence pending authorized handling. No live credential inspection, secret-valued fixture, native session copy, or raw journal dump is introduced.

## Trial proof, expectations and resource ownership

### T1 native probe and S0

The probe is a complete minimal launcher/shared native adapter/configuration, safe observation, independent minimal reader/checker and early-negative reporting path. It is not a full semantic-controller scaffold. T1 is independently runnable before investment in T2.

Use two tiny-profile sessions and four planned expected results: two on the normal-TTL handle for canary/submission and same-session reuse, then two on a short-TTL handle spanning one deliberate between-settled-expectation idle expiry and same-ID restoration. B1 governs the re-asks within each expectation. Close both handles with A4 observations. Stop on the first decisive negative; never add expectations to obtain a preferred result. The extra probe expiry is separate from the soak's four planned expiries. Do not force live empty-yield failures or rare branches just to calibrate a counter; record those if observed and keep source/scripted proof separate.

S0 checks the exact toolchain/pin, actual launch and configured restrictions, private paths, live-store authentication, and supported runtime/existing-owner compatibility before production-role work. Pin mismatch stops before model launch, without swapping the binary. The canary asks for one sentence and then write/bash against a harmless canary path, plus its expected structured final result; it is the probe's first normal-TTL expectation, not an extra canary outside the recipe. Apply the specified observational tool policy and keep the canary absent and protected sources unchanged. No mandatory positive inventory, exact-title parser, model self-description, TUI/session-text oracle or imagined effective-setting diagnostic is substituted for the selected check. Record its attempted/failed/denied/completed facts and limits, not an inferred sandbox guarantee.

The probe records exact launch/pins/authentication, available supported configuration evidence, the chosen observable tool policy, native result delivery before the journal closes, terminal behavior, next-prompt reuse, same-ID restore, PID availability, and disposal. Do not require an imaginary diagnostic exposing every effective setting or treat model self-description as that diagnostic. Confirm configured restrictions and report the limits of runtime observation. No model-discovered intent key or post-journal grace window is a calibrated setting.

### T2 deterministic mechanics and lightweight native soak

Use independent, transition-oriented scripted checks through the public acpx boundary, including the fixed scripted ACP server for the 2 MiB case below. Scripted results are labeled mechanics-only, never native OMP/model judgments. Do not repeat every branch three times or turn implementation-line coverage into an acceptance contract.

Cover valid and malformed domain results; intermediate tool errors; duplicate cursor versus lifecycle update; two terminal submissions; original captured result recovered after observer loss; retained result followed by turn failure; missing completion at a closed journal window; null/foreign/ambiguous ownership; applicable versus ineligible C4 failures; same-session restore and failure; preserved siblings/dependency gating; application/cap/closure/freshness; PID sampling/failed disposal; safe export; and early negative/inconclusive evaluation with a closed production gate. Keep the exact scripted large-payload oracle. Do not force rare live verdicts or repeat models solely to obtain a fixture-like branch.

Retain the full 29-guard mapping and meaningful successful/error/transition observations: approvals and invalid bindings, both modes and cap validation, A-first/lazy-B and applicable REVISE, first-review/rethink/later/source-need progression, VALID recommendations ignored, complete/applicable corrections, approved-context BLOCKED retry, shared C4 stop, loop/freshness/application/validation and report-only boundaries, sibling preservation and dependency gating, first-result/turn/reuse/disposal separation. Expected outcomes must be independent of the code under test. Reuse the harmless A7 fixture for safe export and exact payload preservation; remove the superseded JSONL sanitizer/parent-chain/assistant-text equality fixtures.

Add the selected diagnostic/debug boundary cases to the same behavioral fixture harness: capture mismatch versus recovered observation; snapshot before cleanup mutates state; effect-free offline replay; rehearsal cap versus production limit; offline correction while the affected entry is closed by its bug; second-fix recurrence closing B4 for other causes; exhausted-cause rejection during final assurance; a truthful not-supported result not treated as a code defect; and conditional evaluation completion with an actually closed production gate. These defend different consumer-visible transitions, not source wording or echoed booleans. A real native fault's new reproducer is added only when B4 requires it.

When T1 support permits entry, run the B1 four-session/ten-expectation native soak on `xai-oauth/grok-4.7:low`. Use the fixed in-bundle `prompts/transport-soak.md` and a short worked example; load no external reference and write no reference directory. The three size expectations are session 1 expectation 3, session 2 expectation 3 and session 3 expectation 3. The five observer exercises are the first request of session 1 expectations 2 and 7, and sessions 2, 3 and 4 expectation 2. Re-watch the same original request, never resubmit it. The four deliberate restores occur between fully settled expectations 5 and 6; detach the short-TTL client only after settlement, attach a normal-TTL shared client to the same records/handles, and require same-session-only restoration. Do not close to induce expiry.

The supported soak result requires all B1 native thresholds: 40/40 eventually valid expected results, four overlapping sessions, four planned same-ID restores, five successful original-request re-watches, three admitted payloads meeting the size requirement, four observed closes before shutdown, zero fresh-session fallback and zero replay. Additional actual process activity/restoration must satisfy the same identity/coverage rules. An unproved threshold is not automatically a defect. Mechanics cannot fill a native gap.

### T3 production scenarios

Each scenario has one planned production execution. The rehearsal and authorized corrected executions are additional complete executions, never stitched together from partial runs. B5 owns rehearsal and entry; B4 owns corrected-execution eligibility. Naturally absent real-model branches are informational because their mechanics are required in T2; no model verdict is fabricated or demanded to match a fixture.

- **S1 — Conversation Reconcile:** prior in-session discussion and one flawed candidate, approved five-field brief, cap none. Actual A/B negotiation, persistent session first-review/later phases, immutable replacement and retained real report. Follow the actual branch; do not demand B when A returns VALID.
- **S2 — Artifact Reconcile:** harmless copied artifact, approved Artifact edits brief and cap 1. Controller-only accepted edit application, validator, count/freshness and closure if naturally reached. No forced close or fresh session. Real models may return unchanged VALID or BLOCKED; retain that outcome and mark unentered apply/closure branch informational because (a) proved its mechanics.
- **S3 — three-scope Retrace:** approved table with s1 independent, s2 requires s1, s3 independent. Dispatch s1/s3 concurrently and retain overlapping evaluation intervals. s2 starts only after s1 is resolved/current and receives its exact admitted report identity. Scope-owned delegated Reconcile remains report-only. If s2 fails, preserve s1 and s3; if s1 is unresolved, s2 is correctly blocked rather than improperly dispatched. A natural dependent failure is informational; (a) proves its mechanics. Evidence inputs remain immutable.

Production A/B use the pinned production profiles. S3 scope evaluators use production A's exact profile; root/scope control is code and intake normalization introduces no new model role. Every created production reviewer performs its first-review rethink; same-session restoration preserves that flag. Both review modes, actual s1/s3 overlap where production S3 is entered, per-scope ownership, truthful full reports, no unauthorized mutation, exact request admission and cleanup remain required. Real-model REVISE/B, BLOCKED/retry, application/closure, repair and process-loss paths need not occur merely to tick a box.

Apply A1/B1 to format/no-result returns and preserve valid semantic budget/BLOCKED stops without mistaking them for transport loss. Report every `length` stop as a model output-limit cutoff, and any other actually observed cutoff without inferring it from `error` or `aborted` alone. Observed native incomplete-output recovery is recorded, never treated as trial authorization for padding, continuation, extra result boundaries or uncertain replay.


### B1. Expected results, re-asks and budgets

**Expectation accounting**

- Probe: four planned expected results in the existing two-session recipe. Soak: four concurrent sessions, ten sequential expected results per session. A re-ask is a new request for the same expectation and same available actor; it is not a fifth probe expectation, eleventh soak expectation, new actor, or replay of the prior request.
- A malformed admitted candidate or a completed/no-result return eligible under A1 can lead to at most three re-asks, shared across those categories for that original expectation. Four invalid returns stop that expectation. Count actual re-ask submissions separately from observed invalid returns; a ceiling preventing the next submission is not an extra submitted re-ask.
- Thus the proposal permits at most **16 probe submissions** or **160 soak submissions per complete execution**, not four or forty total submissions. These are upper bounds, not traffic targets. Effects must disclose the change. B4-authorized corrected executions are additional complete executions under the same cumulative resource limits.
- Intermediate failed tool calls, silence, an unfinished required yield, unresolved original outcome, actor loss, deliberate cancellation, revoked authority, and exhausted resources do not acquire retry eligibility. Do not charge multiple invalid returns for intermediate errors within one request.
- For the transport-only probe/soak, a genuinely failed or cancelled turn is not retried by this new no-result allowance. The rehearsal runs the actual skill controllers and therefore preserves the same C4 rules as production, including A1's narrow existing Retrace failed-turn eligibility. Do not silently remove that Retrace failed-turn rule from rehearsal.
- Rehearsal expectations are the controller's original semantic expectations, not whole S1/S2/S3 scenarios or a new arbitrary turn cap. Keep source-need, scope-paused, valid BLOCKED, first-review/rethink progression, and the absence of a negotiation cap unchanged.

**Measurements and scheduled observations**

- “40/40 delivered” means forty expected results each admitted as domain-valid, first try or after eligible re-asks. It is **not** a claim of forty first-try successes. Report planned/completed expectations, first-try compliance, re-asks actually used per expectation, invalid-candidate versus completed/no-result counts, unresolved delivery, actual submissions, and the observed native/cancellation causes separately.
- Keep ten sequential expectations per session and four overlapping native session intervals. Move the four planned restores to between expectations 5 and 6, after expectation 5 and all its re-asks settle. Keep five designated observation-recovery exercises; bind their original turn selectors to expectation indices and one designated request within each, not to a shifting global submission count. Re-asks do not multiply the planned five exercises.
- Preserve the existing rule for additional incidental idle exits: record every actual restoration and require unchanged provider identity/no fresh-session fallback and PID coverage. Four planned restore exercises do not authorize ignoring additional process activity or failing an otherwise valid run merely because an eligible re-ask crossed an idle boundary.
- Keep exactly three designated size expectations, each requesting approximately 48 KiB of substantive payload with a required observation of at least 32768 UTF-8 bytes in the designated decoded string field. An eligible format/no-result re-ask repeats the **same** size request and threshold. Never increase the requested size, concatenate attempts, pad a result, add a continuation, or add an expectation to rescue the threshold. Retain the first candidate for each request; do not select a later yield from that request.
- Delivery/domain validity and the size measurement remain separate. A domain-valid result below the size threshold leaves that measurement inconclusive; it is not a new format/no-result failure authorizing a size-only re-ask. This retains the existing undersize classification rather than inferring an additional threshold-rescue grant from `probe_soak_no_result`.
- Record the confirmed amendment to “No padding, continuation, extra turn or re-ask may inflate size”: the three permitted semantic re-asks may repeat a designated size expectation unchanged; they do not permit size-only rescue traffic. Payload bytes are measured on the admitted result, never summed across attempts. Keep first-try and eventual-size observations distinguishable.

**Resources**

- T1 probe plus T2 native soak, including their re-asks and eligible corrected executions, share the **probe/soak pool** in [Follow-up limits](#follow-up-limits) cumulatively.
- T3 rehearsal, including its re-asks and fix reruns, uses the **rehearsal subcap inside the production limit**, not the probe/soak pool. All rehearsal and production work shares the **production limit** in [Follow-up limits](#follow-up-limits). The rehearsal subcap does not reset between scenarios or fixes.
- Re-establishing an invalidated T1/T2 native proof still consumes that proof layer's remaining pool, even when the defect was discovered in T3. There is no transfer from the production pool or reset of either pool. A remaining production balance does not repair an exhausted upstream proof allowance.
- Keep the Resource accounting section, mandatory cleanup after ceilings, unknown/delayed cost and overshoot disclosures. A ceiling leaves unfinished expectations unproved/inconclusive; it does not erase an already observed defect or failed cleanup. No supported verdict may be inferred from the revised “40/40” denominator.

### B2. Bounded independent capture diagnosis

Keep all A2 prerequisites and exclusions: the required missing completion must be in an otherwise completed, uncancelled, observable request, with no retained valid first result that already satisfied delivery. Missing updates after intentional cancellation, resource stops, or an unknown owner outcome are not converted into unexplained native loss.

1. Perform **one** fresh passive `watchSession` replay of the exact original request window, using the retained cursor before its `turn_started`. For an initial window with no predecessor cursor, use the public no-cursor replay only if it actually includes that request's start and end. Never fabricate/decode a cursor, substitute another request, or read native session files as a second result channel.
2. The diagnostic reader checks request/session/tool-call association and start-to-result completeness independently of the controller's state machine. Stop at the matching `turn_result` and close/abort only that observer. Watch follows an open session indefinitely unless stopped, so bind a finite remaining observation deadline within the applicable native-evaluation allowance. One watch invocation is not itself a time bound.
3. If the relevant terminal update is present inside that complete window, **it was journaled**. Compare that fact with the controller's retained observation. This alone does not prove a trial-code bug: ordinary observer recovery, an observation-path discrepancy, or an evidenced controller/reader fault must remain distinguishable. An original captured result can be recovered at most once under the Observation recovery section, using its own binding and normal domain validation; this authorizes neither resubmission nor reopening an already terminal protocol outcome.
4. B4 repair is available only after the required independent evidence and offline reproduction establish a fault in the evaluated trial code. A replay that the unchanged controller already handles correctly is not proof of such a code fault. Report an unresolved observation discrepancy without manufacturing repair eligibility.
5. If a complete, correctly bound independent window really lacks the required update, and A2's uncancelled/completed/observable prerequisites hold, record **not-supported for this approval's required observable path** under A2 rule 1. Do not claim that this proves a particular OMP race or excludes every possible trial-side cause. No further investigation gates that classification.
6. An unavailable or incomplete window, expired/corrupt/foreign/future cursor, deadline expiry, uncertain owner outcome, or ambiguous binding cannot prove absence. Report the exact unproved observation under A2 rule 2. A demonstrated trial-generated cursor/binding defect remains a trial-code fault; do not attribute it to native capability merely from the error code.

This is one runtime diagnostic path, not a new independent assurance pass or a requirement to dispatch the final verifier early. T1 must already provide the independent minimal reader/checker needed for an early probe result; it cannot depend on T2 code that does not exist yet. Later code reuses that boundary. Additional re-watches after a corrected execution belong to a new eligible execution, not unlimited attempts to change the original classification.

Read and safely project the necessary window before deleting private journal storage. Keep the observer passive: attaching/closing it does not cancel or replay the actor. The diagnostic has no permission to retain a raw journal dump. Preserve failed observations and subsequent recovered evidence separately.

### B3. Public PID sampling feasibility

- In the four-expectation T1 recipe, exercise candidate public sampling points during work, at settlement, before deliberate idle expiry/close, and after same-session restoration. Include every process instance used by the normal-TTL and short-TTL/restored handles. The public `promptStarted` point is a concrete during-turn candidate to try; it is not a guarantee of continued process liveness.
- Pinned acpx applies the lifecycle snapshot during connect; `runtime.ts` also awaits a live checkpoint **before** `runPromptWithRetries`, and requests checkpoints on session updates. This supports testing earlier public samples. It does not establish that all checkpoint writes succeed or prove public PID availability in the actual pinned binary/runtime. The probe decides what was observed.
- Record which public points actually produced PID coverage, then sample those points in T2/T3 for every known process start/restoration, including short-TTL instances before deliberate expiry. A few successful probe samples are a strategy, not proof that later instances were covered. Check actual coverage every time. Keep the handle-local PID set and existing operation evidence; add no generation registry, process-tree supervisor, private lease access, or signal-based termination by the observer.
- If the authorized probe establishes that the required public capture method cannot supply coverage for a needed instance type, report not-supported for that disposal-proof method and do not enter dependent native work. If resource/provider/observation failure prevented the test, report the precise inconclusive gap instead of an established method limitation. A demonstrated sampling/parser defect in trial code follows B4 within its approved scope.
- **A negative capability result does not discharge cleanup.** If an actor may have run without PID/exit coverage, cleanup and evaluation completion remain unproved. Require close to resolve, separately observed recorded-closed status, and ESRCH for every covered PID; preserve earlier observed exits. Only positive evidence that no actor started permits a not-applicable PID check. No automatic close retry, missing-PID waiver, or inference from no completed turn is introduced.

### Resource accounting and measured durations

T1 probe and T2 native soak **share** the probe/soak pool's reported cost and native-evaluation wall time ([Follow-up limits](#follow-up-limits)). Cumulative accounting for the separate tasks: sum elapsed execution intervals, including native launch/observation and ordinary cleanup; exclude only implementation/approval gaps with all trial resources observed closed and no model work. Enforce the remaining wall allowance in each interval; never reset it per task, session, or retry. Cleanup required after a ceiling still runs without new model submissions, with any overrun disclosed. This is approval-bound accounting, not a measurement or two separate budgets.

Normal runtime `ttlMs = 7800000` (130 minutes), active turn `timeoutMs = 7200000` (120 minutes), and deliberate idle-expiry `ttlMs = 1000` are separate from the native-evaluation deadlines. A global deadline can cancel an active turn without making it an idle-restore observation. No finite experiment limit becomes a semantic review-turn cap or authorizes a replacement reviewer. Record actual in-flight/idle failures, not the removed JSONL forbidden-abort classifier.

OAuth cost/usage may be absent or delayed. Preserve USD/token ceilings as observable stop thresholds, label unavailable data `unknown` and inability to guarantee a monetary hard cap explicitly; never fabricate zero cost or assume tiny is cheaper per token. Wall time is independently enforced. Disclose actual reported overshoot. All failed/corrected execution intervals count; cleanup still runs after a ceiling without new model work. Production's cumulative interval clock excludes only gaps with all trial resources observed disposed and no model work, not active diagnostic/observation time.

For every layer-(c) request record monotonic `submittedAt`, `promptStartedAt` when observed, terminal time, submit-to-terminal and prompt-to-terminal durations, terminal status and censoring. Final report gives actual longest completed production turn, count of missing/incomplete durations, maximum observed censored duration separately, and arithmetic **2× and 3×** of the completed maximum. These are inputs to a later production timeout design, not an automatically selected timeout. Measured durations describe the trial's medium production profiles; they are not timeout inputs for other profiles, including live xhigh roles. “30–60 minutes for xhigh” remains an unverified inference only, never default or observation. No completed measurement means no derived numeric recommendation.

## Trial debugging and final assurance

### B4. Native-debugging loop

**Eligibility and ownership**

- For evidenced trial-code faults found by native execution **before final independent assurance starts**, the confirmed production debug loop permits distinct causes while the applicable resources remain, with at most two fixes per cause. This replaces the ordinary single-later-repair limit for those faults only. The same-rule extension to T1/T2 was approved on 2026-09-25 and remains in force.
- Native capability limitations, unexplained delivery uncertainty, model behavior, legitimate BLOCKED/C4/dependency stops, desired different outcomes, and a wish to reach an unvisited branch are not code-fix triggers. A controller fault falsely producing such a stop needs its own independent evidence and reproducer.
- The fixer is the retained implementation owner of the exact faulty target. Under the ownership allocation below, the T1 owner owns the shared native adapter/config; the T2 owner owns the semantic controller and experiment verifier. “Found during T3” changes neither ownership nor write authority. Bind/retain the needed owners through native debugging and final repair; unavailable required ownership stops rather than authorizing a replacement.
- Distinguish **experiment-verifier code** from **final independent verification**. A native-evidenced defect in the evaluated experiment checker/reader before assurance is a trial-code fault, not excluded merely because its filename or component says verifier. Findings from final review/verification use the ordinary later-repair rule below. A verifier's disposable observation machinery remains in generic recovery's actual narrow scope.
- Completed task records remain historical and are not rewritten. Record each later fix, its owner, cause, source change, deterministic result, affected proof, and native execution outcome in the discovering task's existing run evidence. Mark affected proof stale until it is re-established; old checked boxes or a successful historical run are not current proof. Introduce no separate retry ledger.

**Per fix, in this order**

1. Preserve the fail-fast snapshot/observations and establish one evidenced cause, with the smallest authorized correction and its affected scope.
2. The target's retained owner first adds an isolated offline regression check/replay that runs the faulty evaluated code and reproduces the consumer-visible invariant/transition failure. Observe it fail before changing that code. A test of source wording, a copied status, a mock echo, or a fixture that merely asserts the recorded failure label is not a reproducer.
3. Apply the correction; observe that check pass and run the full applicable deterministic check set. During T3, **T2's full automated checks must pass**, even when the correction belongs to T1; also run the owning task's full checks. For the proposed early T1 extension, T2 does not yet exist: require T1's full existing check set, then require the complete T2 set before any T3 admission. Do not claim unbuilt T2 checks passed or build the full controller merely to permit cheap T1 diagnosis.
4. Regenerate only the complete proof units actually invalidated. The unit remains the complete probe, entire 4×10 soak, or whole S1/S2/S3 execution as applicable. A shared boundary correction may invalidate several layers/scenarios; a controller change may affect all three scenarios. Do not rerun a single failed reviewer/turn or combine incompatible partial executions into a pass. A verifier/export-only correction can instead re-assess complete compatible retained evidence without model traffic.

Rehearsal uses the same affected-scope rule. Each eligible corrected execution starts fresh initial scenario actors under the same approved immutable inputs; no reviewer is replaced inside an execution and no uncertain request is replayed. Preserve failed copies/results. For an Artifact rerun, create a separate scenario copy from the original approved input, never reset the failed copy or disguise rollback.

**Limits and stops**

- Two fixes per evidenced cause across the approved trial outcome, not per task, profile, run, actor, or wording. Record applied corrections and their validation outcomes honestly; unsuccessful correction does not reset history. The debug loop ends for every cause when one evidenced cause recurs after its second fix, or when the production limit ([Follow-up limits](#follow-up-limits)) is used up. Additional native proof units required by one fix do not each count as a new code fix, but all spend/time still counts.
- Identify recurrence by the evidenced causal defect and failed invariant; code/check locations support that identity. Moving code, renaming a check, changing error text, or a temporary pass does not mint a new cause. Conversely, distinct independently evidenced bugs are not automatically the same cause just because they fail the same aggregate check.
- No offline reproduction, exhausted relevant budget/allowance, unknown history/effects, required owner unavailable, unresolved A4 disposal, or a correction requiring changed approved behavior/acceptance/effects stops the affected work. Obtain a human decision for changed authority; never make an acceptance change look like a code fix.
- A timing-dependent fault may be reproduced using an evidenced controlled schedule in the offline harness. An invented schedule that only forces an error is not proof of the diagnosed native cause. If an adequate reproduction cannot be built, stop; do not weaken the selected red-before/green-after requirement.
- Global pool accounting and any rehearsal subcap remain cumulative. Close all failed execution actors under A4 before corrected native work. An upstream proof invalidated during T3 must be regenerated within its own remaining pool before the production gate can reopen. If it cannot, report that exact unproved prerequisite.

**One final assurance boundary**

- Finish eligible native debugging and settle the candidate/evidence before the single independent code/test review. Final independent verification follows under the existing standard-assurance contract. There is no independent review per fix.
- Once that final review starts, the open-ended distinct-cause debug loop is over. Findings from that review or final verification—including code faults exposed by native checks there—use dev-implementation's remaining attempt-2 authority with the same responsible owner. Do not relabel a post-review finding as a new pre-review native bug to reopen this loop.
- An authorized final repair can invalidate native evidence. Regenerate its affected complete units within remaining budgets and re-run the fixed verification/closure checks with the retained verifier. This rerun permission grants no further semantic repair if attempt 2 is exhausted. Review is not repeated.
- Each plan's Recovery field references this spec-owned trial-specific loop and generic execution recovery **only for machinery that does not change the evaluated deliverable**. Bind the trial-specific repair operation explicitly in owner contracts; do not reset or falsely label generic attempt counters. No generic skill/rule or unrelated controller receives this exception.

**Loop end, narrower pools, and final assurance**

The rehearsal subcap and the shared probe/soak pool ([Follow-up limits](#follow-up-limits)) stop only the work charged to them. Using them up does not end the loop. An unfixed bug closes the affected production entry until a B4 fix passes its offline test (fails before, passes after) and the full required checks. B4 fixes remain available after the rehearsal cap is spent. The affected rehearsal scenario then stays unproved, and production provides the native observation under B5. Bugs found in production are fixed the same way, within the production limit. Extra production executions are only for evidenced bugs that appeared in production; a rehearsal-only discovery does not authorize an extra production execution.

After the loop ends, the single independent review and final verification still run. Neither may repair a cause that already used both fixes; these roles remain independent and read-only toward the evaluated implementation, and any otherwise authorized repair returns to the retained target owner. The ordinary final-assurance repair rule does not replenish an exhausted cause.

A known unfixed trial-code bug blocks `DONE`. The plan then waits for a human decision: `CLOSED` or new authority. Using up the production limit with no known unfixed trial-code bug does not by itself block `DONE`; the other conditional-completion conditions still apply. No further model work is allowed at that production limit, but required cleanup, review, verification and the report still run. Do not relabel a truthful `not-supported` result as an unfixed trial-code bug. For the S3 completion follow-up only, AC-S3-FINISH makes a production-limit stop block `DONE` until the user decides.


### B5. Rehearsal, diagnostics and offline replay

**Rehearsal and production admission**

- T3 begins rehearsal only when the current production permission is actually open: required T1/T2 capability proof supported, applicable code checks passed, identities/config/pins current, and required safety/cleanup settled. A checker successfully validating a **closed** gate is not permission to spend. Use the same controller, approved inputs, scenario semantics, and configuration as production, changing the scenario actors' model/thinking selection to `xai-oauth/grok-4.7:low`.
- Plan one execution each of S1, S2, and S3 before production, subject to the shared rehearsal subcap ([Follow-up limits](#follow-up-limits)). Eligible fix reruns share it. Rehearsal tokens/time/cost also count inside the production limit; no separate production balance starts afterward. Low thinking is not evidence of cheaper per-token pricing.
- Rehearsal is diagnostic, never substitute production-profile evidence. Genuine tiny-model semantic BLOCKED/C4 stops are not code faults and do not require a passing rehearsal before production. Record unvisited or cap-censored scenarios rather than manufacturing coverage or retrying to obtain a preferred verdict.
- When the subcap is spent, stop further rehearsal submissions, settle/cancel under the existing rules, retain evidence, and complete A4 cleanup. **Proceed to production only if the production prerequisites still hold and sufficient relevant budget/authority remains.** Cap expiry cannot bypass an unresolved code fault, a newly invalidated native capability proof, unsafe evidence, or failed cleanup.
- Do not add a new requirement that every rehearsal scenario pass. A corrected code fault with its reproducer/full checks passed and all required upstream proof current can leave a rehearsal scenario unproved when its subcap is exhausted; production can then provide the remaining native observation. Preserve that gap and fix history. An unfixed fault is different and closes affected production entry.

**Fail-fast ordering**

- Check the controller's approved invariants at state transitions. On the first violation, stop new affected submissions and freeze the permitted diagnostic state **before cleanup mutates it**: exact invariant, controller state needed for that invariant, owning request/window/cursor/toolCallId, and relevant A7-projected events.
- Freeze does not mean dumping arbitrary controller objects, whole prompts, native error prose, or raw journals. Enumerate the additional closed diagnostic fields under A7. Keep required result data exact and apply the existing unsafe-retention stop.
- Perform B2's one bounded read when applicable while its private journal is available; then complete cancellation/closure and A4 disposal as required. Append cleanup observations without overwriting the fault snapshot. Delete private storage only after required safe evidence and observed cleanup. Necessary cleanup is never suppressed merely because a diagnostic is unavailable.
- Preserve proven independent work. “Affected” follows the actual failed invariant/component: a fault in shared scheduling, binding, budget, or lifecycle code can affect multiple active actors. Pause new work relying on that component until safety is established; do not assume only the actor exposing the fault is affected.
- Resume through an eligible owner-directed B4 correction or ordinary permitted observation recovery, never automatically merely because a snapshot was written. A fail-fast condition and its cleanup failure stay visible in final evidence.

**Offline replay**

- The fixture harness feeds retained **A7-safe exports**, not raw saved journals or native session copies, into the actual controller logic with a controlled clock/event ordering and isolated scripted effect ports. There are zero provider/model calls and no dispatch to the native runtime. Native/network fall-through must fail closed; filesystem application is confined to disposable scenario fixtures. Do not load credentials or mutate live/failed-run artifacts to replay.
- Include only explicitly needed replay fields in the closed schema: kinds/statuses, machine-owned associations, required exact result data, event order/relative timing, approved nonsecret inputs, and observed lifecycle/effect outcomes needed by the diagnosed path. Deterministic replay cannot be promised from timing order alone if a required clock/input/effect observation is missing.
- If safe retained evidence is insufficient, build a small independent scripted reproducer from established permitted facts where possible. Do not fill gaps with invented “observations,” broaden raw retention, or declare a replay adequate solely because it consumes every exported event. No adequate offline reproduction means no B4 fix for that cause.
- Replay checks controller behavior and the correction's observable outcome. It does not prove native transport delivery, process disposal, restoration, or model semantics and cannot replace native evidence in an acceptance criterion.

## Conditional evaluation and implementation ownership

### B6. Conditional completion

- Every task has a runnable approved branch **when its dependencies have completed**. A correctly completed T1 negative/inconclusive evaluation can satisfy T2's dependency while prohibiting its implementation/native branch; T2 then performs its explicit not-run/report branch. T3 similarly finalizes the evaluation without production. An unfinished prerequisite caused by broken required code or unresolved cleanup is not a completed negative and does not authorize bypassing the dependency.
- T1 owns a complete minimal report/finalization and independent branch-checking path before native work. It must work without T2's controller/verifier or a T3 production run. Bind exact early-branch commands and nonoverlapping target ownership in the revised spec/plan. T2/T3 use that available code to produce their own not-run records; they do not need to build otherwise skipped implementation merely to render a report.
- Each AC's **Behavior and Check** must explicitly cover its approved taken/not-run branches, with exact expected results and a checker available at that point. Spec-v7 owns those texts; project them exactly into the plan. Do not leave an unconditional “40/40 passed” or “production ran” Behavior and add only a not-run exception in prose elsewhere.
- A branch check can pass because the native capability was correctly measured as not-supported/inconclusive and its dependent work was correctly skipped. Keep separate fields/results for implementation/check correctness, capability verdict and observed thresholds, production permission, and evaluation completion. A passing evaluation/guard check never means an unmet native threshold was met or the spending gate is open. Check not-run evidence against its bound prerequisite and absence of forbidden downstream activity, not merely a runner's own boolean.
- For any entered implementation phase, its required code/mechanics checks still have to pass. A known unfixed code defect, missing/contradictory required evidence, unauthorized effect, invalid approval, or unresolved disposal cannot be hidden as a successful negative branch. If the finalization/checker path itself is broken or unavailable, report a real implementation blocker; do not claim a complete evaluation.
- Keep independent final review/verification over the actually produced target and complete approved conditional check set. Native acceptance checks validate current retained native observations independently; they do not create an extra paid execution merely because the checker is rerun. Regeneration is required when relevant proof is invalidated or missing, under the existing execution authority and budgets. Do not turn verification into runner self-attestation.
- `DONE` is available only when every task/AC is checked on its actual authorized branch, immutable task completion records exist, current assurance is settled, required cleanup/evidence are complete, and the final summary/Completed At requirements are met. A clean negative capability verdict can meet that contract. Unresolved code/cleanup/authority cannot. Budget exhaustion stops spending, not automatically the plan; `CLOSED` still needs explicit authority.
- T3 targets include rehearsal and final evaluation evidence under `runs/t3-*/**`. Use the current interfaces below; no obsolete command aliases or gate names are retained. The concise plan Recovery references the spec's B4 semantic exception and the generic policy's separate machinery scope; Effects disclose the re-asks, rehearsal, approved early-phase loop extension, and corrected native executions with their actual budget pools.

### Verdicts and required evidence

Keep separate implementation/check correctness, native capability `supported | not-supported | inconclusive`, per-branch `not-run`/censored observations, production permission and `evaluation_complete`. Supported requires all assigned current native thresholds and semantic/safety obligations, passed produced-code checks and complete safe evidence/cleanup. Independently established decisive native defects take precedence over unrelated resource/provider/size gaps; retain all causes. A native negative is not itself a trial-code bug. Conversely, a known unfixed code bug or unretainable/contradictory required evidence cannot be hidden by labelling it a native negative.

A1/A2/B2 own result/uncertainty classification; B1 owns eventual validity and undersize observations. Same-session fallback/identity changes, observed required context loss and actually evidenced policy violations are recorded as the corresponding unsupported capability, not rescued by another model, private API or supervisor. Actual provider/resource/history/observation limitations without an established decisive defect leave the capability inconclusive. Missing PID coverage remains unproved cleanup even when it establishes an unsupported public proof method. Legitimate semantic BLOCKED/C4 stops need not prove useful task completion or transport support. Never fabricate naturally absent branches.

If native capability is negative/inconclusive, dependent work may take only its explicitly approved branch. A completed negative prerequisite is distinct from unfinished code or unresolved cleanup. Missing native observations caused by a recorded permitted ceiling are identified as censored/unproved, not claimed measurements; all required evidence about that cause, bindings, entered work and cleanup must still be present. Final reporting always preserves code/cleanup blockers. Return actual causes and justified options without mandated old-plan routing, automatic execution, supersession or adoption.

### Public interfaces

Public commands are repository-root commands. All emit one absolute `RUN=...` locator and no credentials. The follow-up's `--runs-root` invocations are listed in [Runs root, copied T1 record and bindings](#runs-root-copied-t1-record-and-bindings).

- `node .agents/artifacts/acpx-omp-acp-trial/probe.mjs preflight --approval "$APPROVAL"`: perform the probe's preflight without duplicating a canary already recorded for the same compatible execution.
- `node .agents/artifacts/acpx-omp-acp-trial/probe.mjs probe --approval "$APPROVAL"`: one complete T1 probe execution, including native preflight, the four expectations, evidence, report and cleanup.
- `node .agents/artifacts/acpx-omp-acp-trial/run.mjs t2 --approval "$APPROVAL" --probe "$T1_RUN"`: T2 mechanics and soak after supported T1 proof.
- `node .agents/artifacts/acpx-omp-acp-trial/run.mjs t3 --approval "$APPROVAL" --t2 "$T2_RUN"`: T3 rehearsal, conditional planned production executions and final evaluation.
- For an eligible corrected execution, the applicable command additionally takes `--corrects "$PRIOR_RUN" --cause "$CAUSE"`; T3 also takes `--stage rehearsal|production --scenarios S1[,S2,S3]`. The cause/fix record is in the discovering execution's existing evidence. The runner checks its owner, unchanged approved contract, prior effects/disposal, applied correction, offline/full-check results, actual invalidated proof units, compatibility and all remaining limits before starting any model work. CLI flags never grant eligibility. Probe and soak corrections always rerun their complete unit. T3's default initial command is not reused to silently rerun all scenarios/rehearsal after a fix.
- `node .agents/artifacts/acpx-omp-acp-trial/probe.mjs not-run --task T2|T3 --approval "$APPROVAL" --upstream "$UPSTREAM_RUN"`: the owning task writes its authorized not-run/final report using the T1-provided path, without loading an unbuilt later controller/verifier or starting model work.
- `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" <AC-ID|T1|T2|T3|ALL>` independently checks T1 proof and approved upstream-blocked branch evidence. It does not claim unbuilt T2 code passed.
- `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" <AC-ID|T2|T3|ALL>` independently checks entered T2/T3 evidence, consuming the T1 reader/checker and current compatible upstream records. It does not repeat runner verdict booleans.

`APPROVAL` is the complete immutable approved-input JSON; `T1_RUN`, `T2_RUN`, `PRIOR_RUN` and `UPSTREAM_RUN` are exact retained execution directories; `CAUSE` selects an evidenced cause already recorded there. Each run's report binds its upstream paths and relevant current source/config/pin identities. A changed native boundary invalidates its affected probe/soak proof; adding semantic code alone does not invalidate an unchanged native boundary. No old `run.mjs t1`, production `run.mjs t2 --t1`, or `AC-T1-GATE` compatibility alias is provided. Historical run records are not renamed.

Aggregate selectors evaluate their constituent direct checks and then emit the aggregate; neither a gate nor ALL requires its own prior pass. Experiment checks and `evaluation_complete` do not settle the independent assurance tail or plan DONE. Main settles that separate lifecycle condition after the final review and verification.


### Implementation ownership

The three vertical slices split at feasibility and proof cost, not library scaffolding or individual scenarios. T1 delivers a usable native probe, shared boundary and early-negative checker/report path; T2 adds the semantic controller, independent mechanics/verifier and soak only when permitted; T3 consumes current proof for eligible rehearsal/production and final reporting. Each has one retained owner and exact exclusive write targets. T1 must not depend on unbuilt T2 code. T2 reuses rather than copies the shared native boundary. T3 never repairs T1/T2 source itself; B4 returns that write to the retained target owner. Keep those owners available for authorized debugging/final repair. Completed task records remain immutable; later repairs and invalidated/re-established proof are current execution evidence, not rewritten history.


### T1. Implement the complete native probe and establish observable launch, journal-result, reuse, restoration and disposal feasibility

- Owner: AcpTrialNativeProbe
- Depends on: none
- Targets: .agents/artifacts/acpx-omp-acp-trial/package.json, .agents/artifacts/acpx-omp-acp-trial/package-lock.json, .agents/artifacts/acpx-omp-acp-trial/node_modules/**, .agents/artifacts/acpx-omp-acp-trial/probe.mjs, .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs, .agents/artifacts/acpx-omp-acp-trial/lib/native/**, .agents/artifacts/acpx-omp-acp-trial/lib/evidence/**, .agents/artifacts/acpx-omp-acp-trial/config/**, .agents/artifacts/acpx-omp-acp-trial/prompts/native-probe.md, .agents/artifacts/acpx-omp-acp-trial/fixtures/native/**, .agents/artifacts/acpx-omp-acp-trial/runs/t1-*/**
- Acceptance: AC-ENV, AC-READONLY, AC-PROBE
- Receiver: Main

### T2. Conditionally establish complete semantic mechanics and lightweight native proof, or emit the verified upstream-blocked branch

- Owner: AcpTrialPreparation
- Depends on: T1
- Targets: .agents/artifacts/acpx-omp-acp-trial/run.mjs, .agents/artifacts/acpx-omp-acp-trial/controller.mjs, .agents/artifacts/acpx-omp-acp-trial/verify.mjs, .agents/artifacts/acpx-omp-acp-trial/lib/semantic/**, .agents/artifacts/acpx-omp-acp-trial/prompts/transport-soak.md, .agents/artifacts/acpx-omp-acp-trial/prompts/semantic/**, .agents/artifacts/acpx-omp-acp-trial/fixtures/mechanics/**, .agents/artifacts/acpx-omp-acp-trial/fixture-agent/**, .agents/artifacts/acpx-omp-acp-trial/runs/t2-*/**
- Acceptance: AC-MAPPING, AC-MECHANICS, AC-TRANSPORT, AC-RESTORE, AC-REQUESTS, AC-DIAGNOSTICS, AC-DEBUGLOOP, AC-PRODUCTION-GATE
- Receiver: Main

### T3. Perform eligible rehearsal and production scenarios and finalize the independently checkable evaluation on its actual branch

- Owner: AcpTrialProduction
- Depends on: T2
- Targets: .agents/artifacts/acpx-omp-acp-trial/runs/t3-*/**
- Acceptance: AC-REHEARSAL, AC-CONVERSATION, AC-RETHINK, AC-ARTIFACT, AC-RETRACE, AC-DURATIONS, AC-CLEANUP, AC-REPORT
- Receiver: Main

## S3 completion follow-up (spec-v10)

### Purpose and base

- The spec-v9 plan is `DONE` and committed at `63d3664`: production S1 `supported`, S2 `supported`, S3 `inconclusive` because production S3 s2 stopped at reviewer A's rethink point when the production token limit was reached (2,028,749 of 2,000,000 reported tokens). Decision evidence v8 records the user's decisions: a budget limit, whether a retry limit or a token limit, must not be what ends S3, and finishing S3 is preferred.
- The follow-up executes one new complete T3 run, rehearsal S1–S3 then production S1–S3, so that S3 obtains `supported`, `not-supported`, or `inconclusive` for a cause other than a budget limit. The new run becomes the record for S1–S3. The spec-v9 T3 run `runs/t3-run-20260925T162921Z-e42472` stays history; the two T3 runs are never combined or stitched.
- The sole active follow-up plan is `.agents/plans/2026-09-26-0220_acpx-omp-acp-s3-completion.md`. The DONE plan and everything under `runs/` stay byte-unchanged. The spec-v9 PASS results are reproducible only from commit `63d3664`, because the follow-up changes `verify.mjs`.
- Unchanged: all 29 guards, KS8 not adopted, the pins, two fixes per evidenced cause, the B4 loop rules, B5, B6, the C2/C3 verifier rules and the non-adoption boundary. The follow-up adds no launch option. Besides the limit and binding values in this section, its only code-behavior change is that `correctionScoped` in `verify.mjs` applies only when the run has a production record for that scenario, whatever its status. A scenario with no record keeps the existing not-planned skip. One case block in `fixtures/mechanics/t3-cases.mjs`, outside the existing `CASES` loop, proves the change. This is not a guard, pin, B4, C2/C3 or trial-semantics change. `--corrects` stays for evidenced trial-code bugs only; the spec-v9 limit stop is not a cause.
- B4 cause history carries over across the trial outcome: `t1-session-location`, C1, C2 and C3 have each used one of their two fixes. Inside `runs-s3/` the debug loop is open again under the follow-up production limit; the spec-v9 loop end in `runs/` is history. Each follow-up plan task has its own dev-implementation semantic attempts.
- This follow-up does not authorize production adoption. Revising the lean redesign specification and plan is a separate, later handoff after the S3 result.

### Follow-up limits

This is the single definition of every current limit. Approval JSON uses `usd`, `reported_tokens` and `wall_minutes`; JS uses `usd`, `tokens` and `wallMs` (minutes × 60,000). Every listed copy must equal this table in its field's existing unit.

| Pool | USD | Reported tokens | Wall | Copies |
|---|---|---|---|---|
| Production (includes rehearsal) | 20 | 8,000,000 | 240 minutes | `config/approval.json` `pools.production`; `lib/semantic/debugloop.mjs` `PRODUCTION_LIMIT`; `verify.mjs` `PRODUCTION` |
| Rehearsal subcap, inside production | 3.00 | — | 45 minutes | `config/approval.json` `execution_approval.approved_proposals.rehearsal_subcap`; `lib/semantic/debugloop.mjs` `NARROW_POOLS.rehearsal`; `verify.mjs` `REHEARSAL` |
| Probe/soak (planned T2 soak and any B4 re-establishment soak) | 6.00 | — | 30 minutes | `config/approval.json` `pools.probe_soak`; `lib/native/pins.mjs` `PROBE_SOAK_POOL`; `verify.mjs` `POOL` (`NARROW_POOLS["probe-soak"]` reads `PROBE_SOAK_POOL`) |

- These are the caps of `runs-s3/` alone, not additions to the spec-v9 spend: the runners account only for runs in their `--runs-root`. The copied T1 record's USD 0.031834 and 17,250 ms count against the new probe/soak pool; that is expected, not exhaustion.
- The stored T1 record keeps its original binding: `probe-verify.mjs` `POOL` stays USD 2 / 20 minutes.
- Spec-v9 history, DONE plan only: production USD 20 / 2,000,000 tokens / 120 minutes; rehearsal USD 1 / 15 minutes; probe/soak USD 2 / 20 minutes, cost cap raised to USD 4.50 by the 2026-09-25 grant.
- `config/approval.json` `pools.probe_soak.grant` is replaced by a record of the v8 decision: date 2026-09-26, the user's words, the caps above, scope "caps of `runs-s3/` only". It is not a gate.
- `fixtures/mechanics/boundary-cases.json` keeps every exhaustion expectation and moves only the charges that sit on the old caps. In `narrow-pool-exhaustion-keeps-offline-eligibility`, the probe/soak charge becomes USD 6 (wall and both expectations unchanged). In `rehearsal-cap-versus-production-limit`, the rehearsal charge becomes USD 3.0 and the following production charge USD 16.5; the final USD 0.5 charge is unchanged, so rehearsal is blocked, production is still allowed at 19.5 and production is blocked at 20.
- Rehearsal subcap reached: production continues under B5. Production limit reached before S3 settles: stop model work, complete cleanup, report the measured use and ask the user. There is no automatic raise, and a limit stop is never a finished follow-up S3 result; for the follow-up, AC-S3-FINISH makes it block `DONE`.

### Runs root, copied T1 record and bindings

- The follow-up uses `.agents/artifacts/acpx-omp-acp-trial/runs-s3/`, never `runs/`: `priorT3Usage` would otherwise charge the spec-v9 run's tokens and rehearsal spend to the new caps.
- Copy `runs/t1-probe-20260925T120636Z-0324bc` byte-for-byte to `runs-s3/t1-probe-20260925T120636Z-0324bc`. The copy is not a T1 rerun and the original is not modified.
- Repository-root commands:
  - `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs .agents/artifacts/acpx-omp-acp-trial/runs-s3/t1-probe-20260925T120636Z-0324bc T1`
  - `node .agents/artifacts/acpx-omp-acp-trial/run.mjs t2 --approval .agents/artifacts/acpx-omp-acp-trial/config/approval.json --probe .agents/artifacts/acpx-omp-acp-trial/runs-s3/t1-probe-20260925T120636Z-0324bc --runs-root .agents/artifacts/acpx-omp-acp-trial/runs-s3`
  - `node .agents/artifacts/acpx-omp-acp-trial/run.mjs t3 --approval .agents/artifacts/acpx-omp-acp-trial/config/approval.json --t2 "$T2_RUN" --runs-root .agents/artifacts/acpx-omp-acp-trial/runs-s3`, with `T2_RUN` the new passing T2 run.
- Rebind, only after approval: `lib/native/pins.mjs` `AUTHORITY` and `config/approval.json` `authority` name spec-v10 with the approved spec file's SHA-256, decisions v8 and the follow-up plan path; `verify.mjs` `PLAN_PATH` names the follow-up plan and its report `authority:spec` check uses the approved spec-v10 SHA-256; `fixtures/mechanics/t3-cases.mjs` reads the follow-up plan. `config/approval.json` `execution_approval.date` and `instruction` record the follow-up approval's date and verbatim words. No hash is written before the spec bytes are final.
- `fixtures/mechanics/t3-cases.mjs` must pass both while the follow-up plan's T3 is unchecked and after it is checked. It must not require a live `- [ ] T3.` line; that requirement caused review advisory A1.
- T1 code stays unchanged except `probe-verify.mjs`'s not-run authority check (`rep.authority?.specSha256 === SPEC.sha`), which inlines the approved spec-v10 SHA-256, because the T1 self-test creates fresh not-run records through `probe.mjs`, which hashes the live spec. `SPEC`, `DECISIONS_REV` and the stored-record check stay at spec-v9 / decisions v7, since they check the stored T1 record run under that binding. `probe.mjs` and `fixtures/native/approval-drift.json` are not edited. Any other change that would force a T1 rerun stops for the user.
- The `pins.mjs` owner updates the header comment and the pool comment above `PROBE_SOAK_POOL`; other spec-v9 provenance comments stay.

### Follow-up order

1. T1 owner: rebind the T1-owned files, create `runs-s3/`, copy the T1 record and require `PASS T1` on the copy.
2. T2 owner: rebind the T2-owned files and limits. Change `correctionScoped` as above. Add a separate block in `fixtures/mechanics/t3-cases.mjs`, not an entry in the existing `CASES` loop. Build both copies from the scripted run. Positive copy: in `t3.json` and `launch.json`, set `corrects` to `{stage: "production", scenarios: ["S3"], ok: true}` and `plan` to `[{stage: "production", scenarios: ["S3"]}]`. In `scenarios.json`, remove the production S1 and S2 records and their actors, and leave the S3 record and actors unchanged. Negative copy: the same, but keep the S1 production record. The block asserts that the positive copy passes AC-CONVERSATION, AC-ARTIFACT and AC-RETRACE, and that the negative copy fails AC-CONVERSATION. Against the committed `verify.mjs`, only the positive AC-CONVERSATION and AC-ARTIFACT assertions fail; after the change, all of those assertions pass. Make both edits before the soak, because the T2 gate binds the hashes of `verify.mjs` and `fixtures/mechanics/`. Then require the scripted T3 self-test run to pass `verify.mjs ... ALL` (the self-test's exit code is not proof), `t3-cases.mjs` to pass, and `run.mjs`'s deterministic mechanics, including the two exhaustion cases, to pass before the soak; then run one fresh T2 soak in `runs-s3/` and require `PASS T2` with `production_allowed=true`. A fresh soak that fails for a real reason stops for the user; T3 is not run.
3. T3 owner: one full T3 run in `runs-s3/` with `--t2` set to that T2 run. An eligible `--corrects` run in `runs-s3/` is the existing B4 path, not a second planned run. A verifier-only fix does not start a `--corrects` run. Re-check the affected runs under the existing verifier-only correction rules. Those rules accept the change only when the T2 run itself recorded it, or exactly one T3 run used that T2 run and recorded it. If they do not accept it, stop for the user; do not soak and do not `--corrects` to force acceptance. A `--corrects` run whose fix changes a source the T2 gate binds (`run.mjs` `sourceIdentities`) first re-establishes T2 with a fresh soak in `runs-s3/` on the same probe/soak pool, and passes that run as `--t2`. Check every follow-up T3 run with `verify.mjs <run> ALL` under the `$RUN` rule below.
4. Main: one review, one verification and one learning assessment, then the Completion Summary and `DONE`. The summary reports S1, S2 and S3, compares S1 and S2 with the spec-v9 run (a difference is model variation unless a code fault is evidenced), states the `runs-s3/` spend, and does not authorize production adoption.

The follow-up's acceptance items bind `$RUN` as follows. T1 items bind to `runs-s3/t1-probe-20260925T120636Z-0324bc`. T2 items bind to the `runs-s3/t2-soak-*` run that the last follow-up T3 run used as `--t2`. An earlier T2 run replaced by a B4 re-establishment is stale proof, not a failure. T3 items bind to every follow-up `runs-s3/t3-run-*` run. A failure is excused only when it is confined to a production scenario that a later eligible `--corrects` run in `runs-s3/` re-executed. Map a criterion failure to its scenario: AC-CONVERSATION is S1, AC-ARTIFACT is S2, AC-RETRACE is S3, and an AC-RETHINK failure is confined to the scenario named in its message. An AC-REPORT failure is excused only when each of its failure lines is excused: a `<criterion> FAIL` line by that map, and a `trial-code faults:` line when every entry it lists is `production <scenario>` for a re-executed scenario. These are never excused: any other AC-REPORT line, AC-DURATIONS and AC-CLEANUP failures, a production-limit stop, and any failure on a scenario's final execution. A run's `PASS` proves only the scenarios it executed. AC-S3-FINISH binds to the run that holds the final production S3 execution.

## Acceptance

The twenty-three acceptance pairs below are the current authority: the nineteen original pairs and the four follow-up pairs (AC-S3-*). Their plan copies are exact projections. A passing evaluation check does not imply native support or permission to enter production. Conditional not-run/censored branches do not waive failures in produced code, required evidence or disposal.

### AC-ENV. Pinned environment and actual launch (T1)

Behavior: T1 establishes the exact toolchain, profiles, live-store boundary, private runtime and actual supported launch, or records the evidenced native/environment stop without falsely claiming readiness.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-ENV`; expect `PASS AC-ENV` only for independently consistent exact-pin/profile/argv/config/path/authentication observations (launched `--model`/`--thinking` must match the explicit trial pins; runtime live `modelRoles` are provenance only, and differences are not profile drift) or the approved evidenced negative/inconclusive preflight branch; pin drift stops before model launch, no binary substitution or credential copying/inspection occurs, and capability readiness remains false on the negative branch.

### AC-READONLY. Observed trial tool policy and protected sources (T1)

Behavior: The canary and actual native tool observations apply the selected detect-after policy, distinguish attempts from execution, and preserve the absent canary and protected sources without claiming complete tool inventory or sandbox proof.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-READONLY`; expect `PASS AC-READONLY` only with exact launch restrictions, canary before/after observations, recognized/failed/denied/completed tool facts and unchanged protected-source evidence, or a directly evidenced approved not-supported/inconclusive branch; unknown starts are not automatically executed violations, and unobserved actual isolation is never fabricated.

### AC-PROBE. Complete first native feasibility slice (T1)

Behavior: T1 independently completes its four-expectation probe or its truthful early negative/inconclusive branch, including original-window result handling, reuse, same-ID restoration, public PID sampling and required observed disposal.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-PROBE`; expect `PASS AC-PROBE` only with the exact two-handle recipe, bounded same-expectation re-asks and separate first-try counts, observed applicable reuse/restore/results or identified unproved capabilities, full actual process coverage/closure and safe retention, and a runnable independently checked early-negative report path; any known unfixed code defect, unsafe/missing required evidence or unresolved cleanup fails this criterion, never passes from the capability verdict alone.

### AC-MAPPING. Complete accountable semantic allocation (T2)

Behavior: Entered T2 maps all 29 semantic guard IDs to accountable pre-run LLM responsibility or coded enforcement with their required proof, including the trial-only KB1 admission amendment; an upstream-blocked branch makes no implemented-coverage claim.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-MAPPING` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-MAPPING` for an approved upstream-blocked branch; expect `PASS AC-MAPPING` only for the exact KR1–KR16/KT1–KT5/KB1/KS1–KS7 set, actual authority/enforcement and independent proof locators with no omitted obligation, or verified not-run status caused by the bound completed T1 negative/inconclusive result; C2/C5 and every unadmitted/ordinary-output source stay excluded.

### AC-MECHANICS. Independent semantic and boundary transitions (T2)

Behavior: Entered T2 proves the complete specified semantic and error/transition contract through independent scripted checks, including the exact public-acpx 2 MiB fixture and safe export; a permitted skipped implementation is not reported as tested.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-MECHANICS` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-MECHANICS` for an approved upstream-blocked branch; expect `PASS AC-MECHANICS` only with successful full deterministic checks for the specified transitions and 29-guard allocation, exact 2097152-byte payload/prefix/suffix/independent digest and measured permitted wire frames through the specified public route, independent harmless export expectations, and no failed check concealed by a native negative; or verify the approved upstream-blocked not-run branch using T1's available checker.

### AC-TRANSPORT. Eventual expected-result delivery and size (T2)

Behavior: The native soak measures forty valid expected results separately from first-try compliance, restore/rewatch/size/overlap/cleanup thresholds and actual submissions, applying the specified supported/not-supported/inconclusive classification without padding or replay.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-TRANSPORT` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-TRANSPORT` for an approved upstream-blocked branch; expect `PASS AC-TRANSPORT` only for independently classified current observations: support requires 40/40 eventual valid expectations, four overlapping sessions, 4/4 planned restores, 5/5 designated re-watches, 3/3 admitted size payloads at least 32768 UTF-8 bytes, 4/4 observed closes and zero fallback/replay; failed thresholds remain explicit negative/inconclusive with correct causes and a closed production gate; an approved upstream-blocked branch records no soak execution. Confirm original-expectation re-asks, first-try/miss counters and the cumulative USD2/20-minute pool without fabricating unknown cost.

### AC-RESTORE. Same-session restoration or truthful stop (T2)

Behavior: Restoration preserves the exact native backendSessionId and reviewer state on existing handles, never freshens or replays, and remains distinct from a subsequent successful continuation or intact persisted context.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-RESTORE` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-RESTORE` for an approved upstream-blocked branch; expect `PASS AC-RESTORE` only with same-session-only source/runtime/config evidence, actual planned and incidental restoration identities/results and PID coverage, preserved first-review flags, zero fresh-session fallback/replay, independently checked restore-failure/changed-ID/unknown-outcome mechanics, and truthful required-context truncation exposure; or verify the exact upstream-blocked not-run branch. Unavailable/changed identity and unresolved context integrity cannot be reported as supported.

### AC-REQUESTS. Single journal boundary and first-result ownership (T2)

Behavior: Each request is submitted once; its first native candidate and any admitted reply remain owner/window-local, with tolerant domain validation, independent turn/reuse/disposal facts and no alternative reply source or uncertainty replay.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-REQUESTS` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-REQUESTS` for an approved upstream-blocked branch; expect `PASS AC-REQUESTS` only with independent request/window/cursor/toolCallId association checks, first-candidate retention and once-only validation, duplicate-cursor versus lifecycle-update handling, cancellation/C4 precedence, recovered original captured results without resubmission, and rejected foreign/null/post-window/unadmitted/ordinary-output fallbacks; or verify the exact upstream-blocked not-run branch.

### AC-DIAGNOSTICS. Bounded diagnosis and safe deterministic replay (T2)

Behavior: Entered diagnostic machinery performs one finite independent window re-watch, preserves a typed pre-cleanup snapshot, and replays sufficient safe evidence through controller logic with no native/model/network fall-through or live artifact mutation.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-DIAGNOSTICS` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-DIAGNOSTICS` for an approved upstream-blocked branch; expect `PASS AC-DIAGNOSTICS` only with independent transition fixtures for present/absent/unavailable complete windows, no automatic code-fault attribution from presence alone, retained pre-cleanup versus appended cleanup facts, A7 field exclusion/exact required payload, deterministic clock/effect isolation and observable bug reproduction rather than echoed labels; or verify the exact upstream-blocked not-run branch. Any naturally used diagnostic must preserve those same boundaries.

### AC-DEBUGLOOP. Authorized owner repair and global termination (T2)

Behavior: The trial debugging policy permits only evidenced eligible target-owner fixes with offline red/green/full-check proof, preserves cause history and affected complete proof units, and enforces the specified global loop-end, narrow-pool and final-assurance boundaries.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-DEBUGLOOP` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-DEBUGLOOP` for an approved upstream-blocked branch; expect `PASS AC-DEBUGLOOP` only with behavioral fixtures and any actual fix records proving two fixes per cause without relabel/reset, multiple proof units not counted as new fixes, global termination for every cause after one second-fix recurrence or production-limit exhaustion, narrow-pool exhaustion not ending offline eligibility, repair of a bug that closed its own entry, no exhausted-cause assurance repair, no code-fault relabel of truthful not-supported, target-owner/full-check provenance, and no production rerun for a rehearsal-only bug; or verify the exact upstream-blocked not-run branch. T1/T2 extra repair authority requires explicit approval of that proposal.

### AC-PRODUCTION-GATE. Current proof-cost spending permission (T2)

Behavior: Rehearsal and production entry remain closed until supported current upstream native proof, passed required code checks, valid authority and observed safety/cleanup permit them; correctly validating a closed gate is not permission to spend.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-PRODUCTION-GATE` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-PRODUCTION-GATE` for an approved upstream-blocked branch; expect `PASS AC-PRODUCTION-GATE` only with the actual allow/deny decision independently derived from T1 and the other seven T2 criteria, current relevant source/config/pin identities and resource/cleanup facts; supported compatible inputs allow, while missing/failed/stale/inconclusive/unsafe inputs deny before model work. A legitimate upstream-blocked branch must pass the denial check with `production_allowed:false`, not claim a self-referential preexisting gate pass.

### AC-REHEARSAL. Cheap diagnostic rehearsal without false production proof (T3)

Behavior: Eligible T3 plans one tiny-profile S1/S2/S3 rehearsal before production, shares its approved subcap and production pool, truthfully records semantic/cap stops, and never treats rehearsal as production evidence or cap expiry as permission to bypass unresolved prerequisites.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-REHEARSAL` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-REHEARSAL` for an approved upstream-blocked branch; expect `PASS AC-REHEARSAL` only with actual low-profile scenario/fix/re-ask/censoring and cumulative accounting records or a directly evidenced approved not-run branch; no compulsory passing tiny verdict, no new pool, no extra production execution from rehearsal-only discovery, and production entry only after current code/proof/cleanup/authority permit it. At subcap exhaustion further rehearsal model work stops, while eligible offline correction and mandatory cleanup remain possible.

### AC-CONVERSATION. Truthful production Conversation evaluation (T3)

Behavior: S1 has one planned production execution plus only authorized complete corrected executions, following the approved Conversation candidate/context and actual review branches or reporting the approved blocked/censored path without fabrication.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-CONVERSATION` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-CONVERSATION` for an approved upstream-blocked branch; expect `PASS AC-CONVERSATION` only with real production-profile S1 evidence under current bindings and canonical/outer-base semantics, complete final/stopped rendering and actual A1/C4 outcomes, authorized production-origin correction provenance for any extra execution, or independently verified prerequisite/limit not-run or incomplete-native branch. Never stitch partial executions, demand a preferred verdict, or use rehearsal as production evidence.

### AC-RETHINK. Persistent actual first-review progression (T3)

Behavior: Every reviewer actually created for a production execution uses its same-session initial/rethink/post-rethink first review and later-only progression thereafter, with source-need and restoration preserving the phase.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-RETHINK` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-RETHINK` for an approved upstream-blocked branch; expect `PASS AC-RETHINK` only with the required phase sequence and no provisional verdict admitted as final, no reviewer replacement or restoration reset, or the explicitly verified not-run/censored branch and exact unproved phase observations. Do not infer absent reviewer work or fabricate first-review completion.

### AC-ARTIFACT. Isolated Artifact application and lineage (T3)

Behavior: S2 uses the approved immutable input and its own harmless artifact copy, obeys actual verdicts, cap-one committed application/validation/closure/freshness semantics and preserves failed execution copies on authorized rerun.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-ARTIFACT` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-ARTIFACT` for an approved upstream-blocked branch; expect `PASS AC-ARTIFACT` only with real eligible S2 evidence, controller-only at-most-one committed application per outer iteration within cap 1, no closure mutation, actual terminal reread/drift outcome, unchanged protected sources and separate original-input-derived rerun copies; or verify the approved blocked/censored native branch. Naturally absent application/closure paths remain informational with required mechanics proof, not fabricated.

### AC-RETRACE. Owned concurrent scope evaluation and dependencies (T3)

Behavior: S3 obeys its approved s1/s2/s3 graph, actual independent overlap and scope-owned report-only review, resolved/current prerequisite admission, four-slot/disposal limits and preservation of unaffected results.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-RETRACE` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-RETRACE` for an approved upstream-blocked branch; expect `PASS AC-RETRACE` only with observed s1/s3 evaluation overlap for a completed production S3, s2 starting only after admitted resolved/current s1 or correctly blocked, exact prerequisite/report identities, observed slot release and child-before-parent cleanup, unchanged evidence, manifests/freshness and truthful aggregation; or verify the approved blocked/censored branch and explicit unproved observations without claiming a completed concurrency proof.

### AC-DURATIONS. Honest resource and duration measurements (T3)

Behavior: Rehearsal/production accounting is cumulative, distinct from the probe/soak pool and transport TTL/timeout, and retained actual production durations yield honest maximum/2×/3× inputs without fabricated meters or timeout defaults.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-DURATIONS` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-DURATIONS` for an approved upstream-blocked branch; expect `PASS AC-DURATIONS` only with actual per-turn timestamps/status/censoring, completed maximum and exact 2×/3× arithmetic or explicit unavailable values, separate censored maximum, correct pool/subcap/production-limit observations, unknown/delayed cost and overshoot disclosed, cleanup after limits and no further model work at the production limit; a no-production branch must report unavailable production duration values, not zeros or a 30–60-minute default.

### AC-CLEANUP. Observed disposal and safe complete evidence (T3)

Behavior: Every actually owned handle has the required observed closure/exit coverage and child-before-parent ordering, and complete required safe evidence is retained before private storage removal without native-session copies or raw-journal retention.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-CLEANUP` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" AC-CLEANUP` for an approved upstream-blocked branch; expect `PASS AC-CLEANUP` only with all actual T1/T2/T3 close-resolution/recorded-closed/PID-ESRCH coverage, preserved earlier exits and separate close/post-close timings, complete exact safe result bindings and typed-export checks, and close-before-shutdown/retention-before-removal evidence. Positive proof that no process started alone permits not-applicable PID coverage. Missing PID evidence, EPERM, unresolved close, unsafe/unretainable required data or a raw/native-session copy fails this criterion even on an otherwise truthful negative branch.

### AC-REPORT. Complete conditional evaluation, not forced support (T3)

Behavior: The final evaluation separately reports implementation correctness, native capability, production permission and evaluation completion, preserving actual supported/not-supported/inconclusive/not-run/censored outcomes, causes, limits, fix history and unproved obligations.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" ALL` for an entered T2/T3 branch, or `node .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs "$RUN" ALL` for an approved upstream-blocked branch; expect `PASS ALL` only when the independent report check and every other criterion pass on their approved actual branches, required produced code/checks and safe evidence/disposal are complete, and no known unfixed trial-code bug remains. A truthful clean negative/inconclusive evaluation can complete without opening production; a resource stop alone does not prohibit completion or stop cleanup/review/verification/reporting. Preserve original failed/stale evidence, no exhausted-cause repair, no native-negative-to-code-bug relabel, no automatic old-plan routing or adoption, and `production adoption: not authorized`; any real required-code/evidence/cleanup/authority blocker remains blocking. This aggregate emits its own report result, never requires a preexisting PASS ALL/AC-REPORT or its own future assurance result; Main separately requires settled final assurance and all lifecycle conditions before plan DONE.

### AC-S3-BASE. Historical base and bounded T1 rebinding (follow-up T1)

Behavior: The committed spec-v9 base stays reproducible: historical `runs/`, the DONE plan, `probe.mjs` and `fixtures/native/approval-drift.json` are byte-unchanged from commit `63d3664`, `probe-verify.mjs` differs only at its not-run authority check, and the follow-up T1 record is a byte-identical copy rather than a rerun.

Check: from the repository root run `git diff --quiet 63d3664 -- .agents/artifacts/acpx-omp-acp-trial/runs .agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md .agents/artifacts/acpx-omp-acp-trial/probe.mjs .agents/artifacts/acpx-omp-acp-trial/fixtures/native/approval-drift.json && git status --porcelain -- .agents/artifacts/acpx-omp-acp-trial/runs .agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md && git diff -U0 63d3664 -- .agents/artifacts/acpx-omp-acp-trial/probe-verify.mjs && diff -r .agents/artifacts/acpx-omp-acp-trial/runs/t1-probe-20260925T120636Z-0324bc .agents/artifacts/acpx-omp-acp-trial/runs-s3/t1-probe-20260925T120636Z-0324bc`; expect exit 0, empty `git status` output, a `probe-verify.mjs` diff of exactly one removed and one added line, both the not-run `rep.authority?.specSha256` check, the added line naming the approved spec-v10 SHA-256 with `SPEC` unchanged, and no `diff -r` output.

### AC-S3-LIMITS. Single-source follow-up limits and bindings (follow-up T2)

Behavior: Every approval and code copy of the production, rehearsal and probe/soak limits equals the single spec-v10 definition in its field's existing unit, `probe-verify.mjs` keeps T1's original pool, every current authority binding names spec-v10, decisions v8 and the follow-up plan, and the two narrow-pool boundary cases still expect exhaustion at the new caps.

Check: direct static inspection of `config/approval.json` (`authority`, `execution_approval`, `pools`), `lib/native/pins.mjs` (`AUTHORITY`, `PROBE_SOAK_POOL`), `lib/semantic/debugloop.mjs` (`PRODUCTION_LIMIT`, `NARROW_POOLS`), `verify.mjs` (`PRODUCTION`, `REHEARSAL`, `POOL`, `PLAN_PATH`, the report `authority:spec` check), `probe-verify.mjs` (`POOL`) and `fixtures/mechanics/boundary-cases.json` (`narrow-pool-exhaustion-keeps-offline-eligibility`, `rehearsal-cap-versus-production-limit`) against spec-v10 Follow-up limits; expect every limit to match exactly, the approved spec-v10 SHA-256 in each spec binding, `probe-verify.mjs` `POOL` equal to `{ usd: 2, wallMs: 20 * 60_000 }`, charges USD 6, then USD 3.0, 16.5 and 0.5 with unchanged exhaustion expectations, a v8 grant record, and no binding in those files naming spec-v9, decisions v7, the DONE plan or a superseded limit, except `probe-verify.mjs`'s stored-record constants.

### AC-S3-PLANCASES. Plan-identity cases in both lifecycle states (follow-up T2)

Behavior: The T3 verifier cases and plan-identity lifecycle cases run against the follow-up plan whether its T3 is unchecked or checked, without depending on a live `- [ ] T3.` line.

Check: run `node .agents/artifacts/acpx-omp-acp-trial/fixtures/mechanics/t3-selftest.mjs --base /tmp/<private-dir>`, then `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$SELFTEST_RUN" ALL` and `node .agents/artifacts/acpx-omp-acp-trial/fixtures/mechanics/t3-cases.mjs --run "$SELFTEST_RUN" --scratch /tmp/<private-dir-2>` with `SELFTEST_RUN` the printed `RUN=`; expect `PASS ALL` and a final `PASS t3-cases (<n>)` line with exit 0, both before the follow-up T2 soak while T3 is unchecked and at final verification after T3 is checked; the private directories are removed afterwards.

### AC-S3-FINISH. S3 result not caused by a budget limit (follow-up T3)

Behavior: The follow-up T3 run ends production S3 `supported`, `not-supported`, or `inconclusive` for a named cause other than a budget limit, with no production-limit stop, and reports its spend against the `runs-s3/` caps only.

Check: `$RUN` is the `runs-s3/` T3 run that holds the final production S3 execution: the planned run, or an eligible `--corrects` run that includes S3. Eligible means the existing correction check accepted it; it is not a new approval. On that run, run `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" AC-RETRACE` and `node .agents/artifacts/acpx-omp-acp-trial/verify.mjs "$RUN" ALL` and inspect `"$RUN"/accounting.json` and `"$RUN"/report.json`; expect AC-RETRACE to pass, every other failure from `ALL` to be excused by the follow-up `$RUN` rule, `accounting.limitReached.production` absent, no production S3 actor censored by a limit, the S3 capability with its non-limit cause, and every run named in `accounting.prior.runs` to exist under `runs-s3/`. A production-limit stop fails this criterion and waits for the user.

## Recovery and stops

- Recovery: Apply `skill://dev-implementation/references/execution-recovery.md` only for eligible machinery recovery, without changing authority, effects, consumed allowances, experimental pools or fix counts. Trial recovery follows spec-v10's native-result/lifecycle contract, B4 and B6. Preserve admitted results, first-review state, successful scopes, safe snapshots and unresolved frontiers; rollback is isolation-only, never automatic artifact rollback. Retained target owners repair their own targets under Implementation ownership, including T1 shared adapter/config repairs discovered later; T3 stays evidence-only. Re-establish invalidated dependent proof under B4 and the public-interface binding rules, or preserve its exact unproved branch. Completed task records remain immutable and later repairs remain in existing run evidence, not a new retry ledger. Ordinary remaining attempt-2 handling governs eligible final-assurance repair and cannot override B4's exhausted-cause restriction. Required cleanup follows A4/A7 even after model work stops. The plan is not automatically CLOSED.
- Stops: No implementation or native execution without the one approval of the follow-up plan, which also approves spec-v10 and decision evidence v8. Stale authority, exact-pin/profile drift (profile drift means the launched model or thinking arguments differ from the explicit trial pins), forbidden effects, unsafe or unobservable required isolation, identity/restoration failure, uncertain replay or failed disposal stop the affected path under the native-result/lifecycle contract. B4 owns global debug-loop termination, per-pool stops, production entry and corrected-execution eligibility, remaining final-assurance repair, known-unfixed-bug disposition and production-limit exhaustion without a known bug; these are not interchangeable conditions. In the follow-up, a production-limit stop before S3 settles stops model work and waits for the user. B6 and the exact acceptance pairs own truthful negative/inconclusive/not-run/censored completion: no failed code/evidence/cleanup check becomes a skipped pass. The accepted OMP pin is not remeasured; S0 checks it before model launch. Preserve the explicit semantic/resource stops and the non-adoption boundary. Human CLOSED or new authority is required for the known-unfixed-bug terminal state described by B4.

## Approval record and current status

On 2026-09-25 the human approved the spec-v9 plan together with its three proposals, recorded in `config/approval.json` `execution_approval.approved_proposals`:

1. The B4 loop also applies to T1/T2 failures in the existing narrow trial-owned transport, controller, verifier, observation, disposal and test-code areas. Native work remains within its own pool and every other eligibility rule.
2. The rehearsal subcap is exact and charged within, not in addition to, the production limit. Its current value is in [Follow-up limits](#follow-up-limits); the spec-v9 value was USD 1.00 / 15 minutes.
3. PID disappearance is observed for at most 10 seconds **after `runtime.close` returns**. This is not a 10-second bound on the close call itself, not a grace waiver, and not permission to kill a PID from the observer.

The spec-v9 plan is `DONE` and its acceptance results are recorded in its Completion Summary. The follow-up's acceptance is unrun until its plan is approved and executed. Before that approval there is no code edit, model spend or native process; after it, Main executes the follow-up order to the S3 result within the follow-up limits without a further go-ahead.

## Residual risks and later live adoption

The selected observation policy is not a sandbox, authenticated tool-name inventory or proof of unavailable tools. The supported-looking OMP yield surface is not proof of its actual terminal delivery; the native probe owns that observation. Same backend/provider ID after restore is not proof of full prior-context integrity. PID reuse may conservatively fail disposal, and an opaque or remaining process cannot be waved through. Report these constraints rather than repairing upstream acpx/OMP or weakening evidence.

For the eventual separately authorized live cutover, allocate one semantic owner per invariant: skills for skill semantics, shared schema/controller for wire mechanics, trial specification for proof/effects, ADRs for rationale/boundaries, and the derived plan for execution. Narrow KB1/D31 to authorize only the owner-bound native ACP result channel; generic task/hub/Eval/TUI/transcript collectors remain nonauthoritative. Remove superseded readiness/synchronization, identity echoes, text-framing admission, duplicate receipts, and permanently poisoned-observation rules only on the affected custom-controller surfaces. Unrelated generic workflow contracts are not revised by this handoff.
