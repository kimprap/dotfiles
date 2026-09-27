# Handoff: Correct the v4 amendments to the Reconcile/Retrace native-result revision (v5)

## Outcome

- Completed: review of all seven v4 amendments, with a replacement amendment set below. **Accept the two new human decisions and the 64-MiB correction; do not apply v4 unchanged.**
- Successor identity: `reconcile-retrace-native-result-revision/v5`. Apply the unchanged portions of [v3](./2026-09-24_reconcile-retrace-native-result-revision-handoff-v3.md) plus A1–A7 below. These are complete replacements for the chat-only v4 amendments; Main does not need to reconstruct v4 from chat. Wherever an amendment conflicts with v3—including its summaries, checks, or risk wording—the amendment wins.
- Preserve all three round-1 answers and all four second-review answers. Quote these two newly confirmed answers verbatim in decision evidence v5:
  - `reconcile_no_result: Re-ask it (counts toward the 3)`
  - `native_rerun_after_fix: Rerun anywhere within budget`
- The first answer explicitly extends no-result eligibility relative to the old C4 contract. Do not claim the old grammar already unambiguously authorized this Reconcile re-ask. The second permits corrected executions after an authorized genuine trial-code fix; it does not grant unlimited code repair or relax observed disposal.
- Targets remain decision evidence `acpx-omp-acp-trial-decisions/v4` → `v5`, specification `acpx-omp-acp-trial/spec-v6` → `spec-v7`, and the existing pending trial plan. This review changes none of those targets. No native execution, upstream fix, live cutover, or shipping is approved here.

### Disagreements with v4

1. **A2 overstates causation and suggests a self-dependent fix.** Missing a drain on the normal finish path is source evidence, not a reproduced loss mechanism or measured loss rate. The proposed direct call to `#waitForPromptEventHandlers` inside the tracked `agent_end` handler would wait on that handler's own promise. Also, a controller-cancelled unfinished call is not unexplained native loss.
2. **A4 weakens disposal without a human decision authorizing it.** A missed PID after idle expiry, or no successful turn, does not prove no process remains. Neither newly quoted answer changes KS4. Keep the observable-exit requirement; do not turn an empty observed-PID set into success. A thrown close does not automatically qualify for an unchanged retry.
3. **A5 cites the wrong allowance for deliverable fixes.** The generic execution-recovery policy explicitly excludes corrections to evaluated code. Its two-corrected-executions rule cannot grant two trial-code repairs per cause. Nor is “controller-only” enough to prove that only one production scenario was affected.
4. **A6 is incomplete as a cutover list.** The old preparation run prefix, runner subcommands, prerequisite flag, variables, and aggregate verifier selectors also need migration—not just the old production directory and gate name.
5. **A7 is useful but proves less than its shorthand suggests.** A whitelist prevents unwanted fields from being copied; it does not make arbitrary text or nested objects inside an allowed field secret-free. Keep v3's unsafe-result retention stop and make the projection closed at every structured level.

A1's newly authorized no-result re-ask and A3's reader-limit correction are accepted. V3's 8-MiB reader statement was wrong. The clarifications below preserve the new decisions rather than reversing them.

### A1. C4 closure and independent lifecycle facts

Replace v3 §5's table and the conflicting no-result wording with this section. Preserve all other C4 categories, the shared original-expectation accounting, and the three-re-ask/fourth-invalid-return stop.

Use two distinct meanings of completion:

- A **terminal tool update** has ACP status `completed` or `failed`; it closes one invocation. A failed tool update is not a submitted result.
- A **final result submission** meets v3 §3's native admissibility conditions: completed non-error yield candidate, explicit data, native success, not incremental, not useLastTurn, not schema-overridden. Domain validation follows; native success is not a VALID verdict.

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

Before closure, silence, missing observation, and intermediate tool failures retain v3's rules. Valid BLOCKED, source-need, and scope-paused retain their own rules. A new request/tool ID, duplicate observation, changed category, or phase wording does not reset the expectation's budget. The probe and soak do not use semantic re-asks to rescue their measurements.

### A2. Delivery observations, verdict, and the upstream option

Keep v3's journal-window boundary and remove its stronger implication that source review alone established an actual lost-result race.

**Source-established:** `#trackPromptEvent` records the promise returned by `#handlePromptEvent`; the normal `agent_end` path finishes after its idle wait without calling the all-handler drain; some outside-handler finish paths do drain; events entering after settlement return early. The ordinary tool-result handler invokes `sessionUpdate` before its first delivery await. These facts identify an ordering/completeness question, not a measured loss probability or a demonstrated root cause for a future missing result.

**Do not implement the proposed one-line fix.** During `agent_end`, its promise is itself in `record.promptEventHandlers`. Awaiting `#waitForPromptEventHandlers(record)` there includes the current promise and creates a self-dependency. An offline reproduction of this promise pattern remained pending. Any separately authorized upstream work must first establish the failing interleaving and arrange for settlement to wait for required prior notification delivery **without waiting on the currently executing handler**. Moving that barrier outside the tracked handler is an option to investigate, not an approved or verified patch.

For each probe/soak request, record these independent observations:

- recognized yield-candidate starts and invocation terminal updates, including completed-success, native-aborted, and failed updates;
- the retained first final candidate, if any;
- unfinished observed invocations at window closure;
- actual journal result/stop reason and controller cancellation/ceiling facts;
- completed/no-result compliance misses; and
- whether full required observation was available or a trial-code/evidence fault prevented classification.

Do not describe this as a complete lost-result counter. Entirely unobserved starts/completions cannot be distinguished from no submission using this boundary alone; the tool signature itself is observational, as v3 discloses. A valid retained first result remains delivered even if an extra invocation is unfinished. Record that additional anomaly without relabeling the retained result as lost or treating the semantic row as a complete lifecycle verdict.

Use this decision rule:

1. A required candidate whose invocation was observed but whose terminal update is missing from an otherwise completed, uncancelled, fully observed window makes result delivery **not-supported for this approval** once an evidenced trial-code/capture fault is excluded. Stop that native branch; production is not-run. A longer wait after the journal closes cannot repair it.
2. Deliberate cancellation, an experiment ceiling, an uncertain owner outcome, or unavailable observation does not establish that defect. Preserve the exact cause and use the existing inconclusive/unresolved classification as applicable. Such observations still do not open the production gate or authorize replay.
3. A genuine evidenced trial-code fault remains a trial-code fault and follows A5, not a manufactured native negative. Absence of a result alone is insufficient evidence of that fault.
4. Completed/no-result turns are model/protocol-compliance observations, not proven byte loss. Report them separately and add no soak re-asks. They do not count as delivered structured results: preserve the 40/40 delivery and three size thresholds. An unmet required threshold without an independently established defect is unproved/inconclusive, not supported.

A native capability result, a missing-update observation, or a desired different model outcome is not an A5 rerun trigger. A later diagnosis establishing an actual trial-code cause must carry its evidence; changing the label alone grants nothing. Report the upstream ordering investigation as an option only, not as a fix already proven necessary or sufficient.

### A3. Correct limits and bound actual serialized fixture frames

Replace v3 §6's final size paragraph and every surviving 8-MiB reference:

- The acpx ACP reader defaults to **64 MiB per NDJSON line**, configured by `ACPX_MAX_ACP_MESSAGE_BYTES`; exceeding the effective limit raises non-retryable `ACP_MESSAGE_TOO_LARGE`. This is the accepted source correction supplied by the second review, not a new runtime measurement.
- Journal rotation is separate: five 64-MiB segments by default. It is not the ACP reader's per-line rejection rule.
- Queue IPC has a **10-MiB message buffer**; the separate queue request limit is unset by default. Do not describe that buffer as a guarantee about arbitrary batching or successful partial delivery.
- The reviewed OMP ACP `ndJsonStream` has no corresponding size limit. That does not remove acpx's limits on the composed path.

Before any native run, use the actual scripted message construction to calculate serialized UTF-8 bytes at every traversed ACP/IPC boundary. Include framing, escaping, metadata, nested serialization, batching where relevant, and every payload copy a frame actually contains. Do not assume that the decoded payload's byte count is the wire size.

Offline illustration, not the future fixture measurement: a 2097152-byte UTF-8 string consisting of U+0001 encodes as a JSON string of **12582914 bytes**, already larger than 10 MiB before outer metadata or additional copies. Thus a decoded 2-MiB bound alone is insufficient.

Keep the exact scripted 2097152-byte payload and independent expected content/digest. Select and bound its actual representation before execution; do not silently lower the required payload, raise transport limits, replace the structured boundary, or shrink evidence to make a check pass. Report an incompatible frame as a pre-execution design finding. Native boundary errors remain failures, never partial success. No binary or native experiment is run to make this planning correction.

### A4. Disposal coverage without a missing-evidence exemption

Replace v3 §7's ambiguous coverage wording with the following, retaining its API, public PID sampling, ESRCH semantics, no signal-based termination by the observer, and conservative PID-reuse limitation.

For each closed handle:

1. Record every positive agent `pid=` exposed by public status during operation, at journal settlement, before deliberate idle transitions when observable, after restoration, and immediately before close. Keep the handle-local set; no generation registry or private lease inspection is added.
2. Require close to resolve and the separate public status check to confirm recorded closure. Neither fact substitutes for observed exit.
3. Require ESRCH for every recorded PID. An earlier ESRCH observation after deliberate idle expiry is retained evidence for that ended process; it need not be erased or replaced by a later missing-PID sample. If exit was not established earlier, observe it within the proposed 10-second post-close-return bound.
4. Account for known process starts/restorations in the existing operation evidence. If an owned actor process may have run but no PID/exit observation covers that activity, cleanup remains **unproved**. An empty PID set is not a vacuous exit proof. Only positive evidence that no actor process was started permits a not-applicable PID check.

A normal-TTL handle that completed a turn should expose a PID at settlement or pre-close; the probe must establish actual availability. Do not upgrade “normal TTL has not elapsed” to certainty that the process is still alive: a crash or disconnect can clear the snapshot. Likewise, an idle-expired earlier instance and a failed-before-completion instance are not exempt merely because their PID was missed. No completed turn is not proof of no started process.

This rejects v4's missed-PID waiver. The two new human answers do not relax KS4, the child-before-parent rule, or the requirement to dispose the failed execution before a corrected execution. If the public path cannot supply the required evidence, report the exact limitation and leave evaluation completion false; do not add a private supervisor or silently lower the proof standard. A human may separately decide to change that safety requirement.

For a thrown close, use the existing execution-recovery policy **only if explicitly adopted for that operation before execution** and its eligibility is actually established. A temporary failure with known safe prior effects and no existing finite retry policy may qualify for the single unchanged retry. A throw alone does not establish transience, safe repeatability, or unchanged effects: close can already have stopped processes before a later step fails. Diagnose through safe non-repeating observation; unknown effects, identity failure, or unknown/exhausted allowance prohibits retry. Do not turn the general policy into an unconditional “close twice” rule.

Keep the 10-second post-return bound as a proposed specification default awaiting plan approval, not a new confirmed human answer or a deadline measured from close invocation. A still-present PID, EPERM, insufficient coverage, unconfirmed close, or unresolved cleanup blocks capacity release, terminal parent success, corrected native execution, and evaluation completion. The final report still runs and names the resource/evidence gap. PID reuse can cause conservative false failure; never kill an unrelated process to obtain ESRCH.

### A5. Corrected executions after genuine trial-code fixes

Replace v3's blanket bans on corrected native execution with the new confirmed answer, preserving every budget, ownership rule, and non-replay condition.

**Trigger and scope**

- Establish a concrete fault in the evaluated trial code/configuration under the unchanged approved contract. A fix to the runner, shared adapter, controller, verifier, or config assembly is a deliverable change, not generic machinery recovery merely because the code belongs to an experiment.
- Use the same responsible implementation owner and the remaining semantic-repair/assurance authority. Generic execution-recovery remains available for genuinely disposable outer machinery only while its defined eligibility holds. Its per-cause corrected-execution allowance does not grant extra deliverable changes or replace required owners.
- Preserve v4's proposed ceiling of at most two **corrected native executions** for one evidenced cause as a trial-specific ceiling for the revised plan—not as an entitlement granted by the generic policy. A second requires materially different evidence/correction. Existing semantic-attempt limits and every tighter authority/resource limit still win; a new cause does not mint another semantic-repair allowance. No allowance is reset by wording, task/run identity, or temporary success.
- No correction or rerun is triggered merely by native capability limitations, unexplained delivery uncertainty, model behavior, genuine C4/BLOCKED/loop stops, or a wish for a better result. A controller bug that falsely produced a semantic stop is different: only independent evidence of that code defect can establish eligibility. Do not reclassify a genuine semantic stop to reopen it.

**Smallest complete affected proof**

- First rerun the applicable deterministic mechanics/verifier checks after an authorized fix. For a verifier/export-only fault, a fresh independent assessment of a complete compatible retained execution may suffice without native traffic. Preserve the original failed assessment and record the corrected assessment separately; never rewrite history or manufacture missing observations.
- If native proof must be regenerated, rerun the smallest complete affected unit: the complete probe, complete 4×10 soak, or a whole S1, S2, or S3 production scenario. Never rerun only a failed reviewer/turn or stitch partial executions into a passed scenario.
- Derive the affected set from the actual changed behavior. A common controller change can affect all three production scenarios; “controller-only” is not an automatic one-scenario exemption. Reuse only complete observations shown compatible with the current relevant code/config/pins and required contract.
- A shared native-boundary change invalidates every dependent native proof it affects. The production gate stays closed until the required probe/soak evidence is current again. Verifier changes require rechecking dependent reports, not automatically rerunning every model.

**Identity, artifacts, and budgets**

- Before any corrected native execution, every actor from the failed execution must satisfy A4. Never resend an uncertain request or resume a stopped run under a new name.
- A corrected execution is a distinct complete scenario/run with fresh initial sessions and request IDs under the same approved inputs. Its original expectations have their own C4 budgets; within it reviewers remain persistent and never replaced. New budgets are a consequence of an eligible new execution, not a reason to grant one.
- For an Artifact scenario, create a fresh scenario-owned copy from the same approved immutable input. Preserve the failed execution's copy and any accepted changes. Do not reset that old copy or describe a rollback as starting cleanly.
- Probe plus soak share the remaining **USD2 / 20 minutes**. Production shares the remaining **USD20 / 2000000 reported tokens / 120 minutes**. Count all executions, including failed ones, under the existing cumulative accounting; never reset at task, session, scenario, or rerun boundaries. Preserve unknown/delayed cost and overshoot disclosures.
- Fixed probe/soak/scenario counts describe each complete execution. Additional corrected executions are the explicitly authorized exception to v3's total-traffic wording and must be disclosed in Effects and reports. They do not add an independent budget or permit threshold-rescue traffic inside a failed execution.
- A ceiling stops further native work. It does not convert an unfixed code fault or unresolved cleanup into completed evaluation. If code is corrected but native proof cannot be regenerated within the remaining budget, report the exact unproved capability and resource cause without claiming support or inventing missing evidence.

Keep the native-execution allowance distinct from implementation semantic attempts, custom-protocol C4, and eligible outer-machinery recovery. Record causes, executions, observations, and used allowance in the existing run evidence; create no extra retry ledger.

The plan's concise Recovery field should reference spec-v7's corrected-execution rule and the generic policy for its actual machinery scope. Do not copy the generic algorithm into the plan or substitute a per-cause native allowance for semantic repair. Required review/verification ownership and the single final standard-assurance boundary remain unchanged.

### A6. Complete numbering and ownership cutover

Keep the proposed graph: **T1 native probe; T2 mechanics and lightweight soak; T3 final evaluation with conditional production runs**. Main must migrate the entire pending contract, not just task headings:

| Surface | Required migration |
|---|---|
| Gate | `AC-T1-GATE` → `AC-PRODUCTION-GATE`, owned by T2; update gate producers, consumers, checks, expected output, Stops, and report references. |
| Evidence ownership | New probe evidence uses `runs/t1-*/**`; old preparation/mechanics/soak evidence moves from the pending `runs/t1-*/**` target to `runs/t2-*/**`; old production/final evidence target moves from `runs/t2-*/**` to `runs/t3-*/**`. |
| Runner commands | Old `run.mjs t1` becomes the T2 command; old `run.mjs t2 --t1 <run>` becomes the T3 command consuming T2 evidence. Migrate prerequisite flags and variables such as `--t1` and `$T1_RUN` accordingly. Bind an independently runnable T1 probe command without making T1/T2 write the same executable target. |
| Verifier selectors | Move the old preparation aggregate selector `T1` and its expected output to `T2`; assign a distinct new probe check. Update task selectors, AC owners, all-layer composition, and commands consistently. `ALL` must account for approved not-run branches, not imply all native capabilities passed. |
| Dependencies and wording | Refresh Depends on, Owner/Receiver bindings where needed, task names, scope partition, capability prerequisites, proof-cost explanation, model-spend gate, Recovery/Stops, and both evidence/spec revision bindings. |
| Effects and completion | Disclose the probe's planned work and A5 corrected executions; retain shared budgets. Remove obsolete all-PASS/DONE prohibitions and old mandatory rerun/old-plan recommendations. |

These are pending interfaces/targets, not instructions to rename historical run evidence. Preserve any existing historical records. Do not retain old CLI aliases or two gate names as compatibility shims.

Every acceptance item has one task owner and exact Behavior/Check projection from spec-v7. Keep the required lean plan fields and PENDING state. Detailed mechanics remain in the specification.

The early-negative final-report path must already be runnable from the produced probe artifacts; it cannot depend on the unbuilt T2 runner or verifier. T3's production branch may be not-run while final reporting still executes. Do not mark unbuilt mandatory code as tested; make the conditional branch explicit before approval.

### A7. Closed typed export, not raw-object copying or general redaction

Accept v4's direction: construct retained evidence from closed controller-owned record types. Do not copy a raw journal object and delete a blacklist of properties, spread unknown native metadata, or introduce a general redaction framework.

Before execution, enumerate the permitted fields in the existing evidence types rather than leaving “safe fields” as an open wildcard. Retain only what the existing checks need: machine-owned bindings/cursors and invocation facts; fixed classification/status facts; policy-relevant explicitly selected argument fields; the known domain variant's required result fields and exact payload text; approved nonsecret configuration/input provenance; and lifecycle/timing/usage observations. Native titles, arbitrary error prose, raw details/metadata objects, and unknown nested extras are not implicitly permitted.

Domain validation may ignore unknown extra fields without exporting them. Preserve complete **required** Correction/Report/artifact/source payloads exactly; that does not require retaining every opaque field the model supplied. Invalid-result evidence should identify the structural defect and needed safe facts without dumping unrelated bodies or values.

Keep the single harmless metadata-exclusion fixture, with independently authored expected output:

- Put a canary in env, headers, permission body, embedded resource bytes, non-result tool output, and unknown nested metadata.
- Expect the canary absent and the complete known safe result payload present unchanged, including its meaningful newlines/escaping.
- Do not compute the expected projection using the exporter under test or merely assert that an export exists.

That fixture proves field exclusion and safe-payload preservation, **not that arbitrary allowed strings cannot contain secrets**. Keep v3's separate retention rule: if required result evidence is known unsafe or its required safe-retention condition cannot be met, do not export it, redact it into a claimed exact result, or mark the evidence complete. Report the precise gap and preserve only permitted restricted private evidence pending authorized handling. No live credential inspection, secret-valued fixture, native session copy, or raw journal dump is introduced.

### Application instructions

Main revises the same three bound artifacts together: decision evidence v5, spec-v7, and `.agents/plans/2026-09-24-1115_acpx-omp-acp-reconcile-retrace-trial.md`. Keep the plan PENDING and obtain fresh execution approval.

Preserve the same 29 guard IDs and accountable coverage, recording the explicit C4 eligibility amendment rather than claiming all old wording is unchanged. Preserve v3's native-result channel designation, journal-only admission, source/ownership semantics, trial isolation, profiles/pins, restoration/no-replay boundary, resource accounting, no retained native sessions, and negative-evaluation distinction except where A1–A7 explicitly amend them.

Replace all conflicting old statements, not just the nearest paragraphs: Reconcile no-result prohibition; unconditional missing-update/native-defect attribution; the direct in-handler drain suggestion; 8-MiB limit; missed-PID cleanup success; automatic unchanged close retry; generic-policy permission for deliverable repair; whole-outcome no-rerun wording; stale T1/T2 interfaces; and unsafe whole-object export implications. Do not change the older lean artifacts, live code/skills/rules/ADRs, binary, accounts, or upstream OMP in this revision.

## Changed targets/effects

- Added only `.agents/artifacts/2026-09-24_reconcile-retrace-native-result-revision-handoff-v5.md`: the reviewed replacement amendments, disagreements, and Main's revision instructions.
- Preserved v3, the bound decision evidence/specification/plan, older lean artifacts, live implementation/contracts, binary, and authentication state unchanged.
- Read repository authority and pinned source. Ran two small in-memory counterexamples for promise self-dependency and JSON expansion. No OMP/acpx process, native/model trial, install, credential/live-session inspection, Git operation, upstream edit, or shipping.

## Checks

- V5-C4-AND-CLASSIFICATION
  Behavior: Preserve the new both-skills no-result re-ask without replaying uncertainty, overriding cancellation, or confusing invocation completion with a final result.
  Check: Compare the newly supplied human answer, original C4, v3's separate reply/turn/reuse facts, and acpx's [completed/failed/cancelled contract](https://github.com/openclaw/acpx/blob/v0.19.2/docs/shared-sessions.md#turns-cancellation-and-disconnects); expect explicit new authority, one charge per expectation return, and independent stop/cause handling.
  Observed: PASS for the revised contract review; no native C4 scenario was executed.

- V5-DRAIN-OPTION
  Behavior: Do not turn a plausible ordering investigation into an unsafe or falsely proven upstream fix.
  Check: Inspect pinned OMP [track/drain and agent_end handlers](https://github.com/can1357/oh-my-pi/blob/62bc57be1b03ef0802a33cf7f5f530e534527531/packages/coding-agent/src/modes/acp/acp-agent.ts) and execute an in-memory reproduction of a tracked handler awaiting the whole set containing itself; expect a self-dependent pending promise, not completion.
  Observed: PASS — the source includes the current handler in that set, and the offline reproduction remained pending through its bounded observation. Actual loss/interleaving/frequency is UNRUN.

- V5-SIZE-CORRECTION
  Behavior: Correct the supplied reader-limit error and avoid treating decoded payload bytes as serialized transport size.
  Check: Adopt the user's second-review correction pointing to acpx [ndjson-stream.ts](https://github.com/openclaw/acpx/blob/v0.19.2/src/acp/ndjson-stream.ts); independently JSON-encode an illustrative 2097152-byte control-character payload in memory; expect 12582914 encoded bytes, above 10 MiB.
  Observed: PASS for the offline expansion check. The 64-MiB correction is accepted as supplied, not re-run for confirmation. No actual future fixture or transport frame has been built/measured.

- V5-DISPOSAL
  Behavior: Missing PID evidence and a thrown close do not become proof of exit or automatic retry authority.
  Check: Inspect acpx [public status](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/status.ts), [lifecycle PID clearing](https://github.com/openclaw/acpx/blob/v0.19.2/src/runtime/engine/lifecycle.ts), [close's ordered side effects](https://github.com/openclaw/acpx/blob/v0.19.2/src/session/execution/session-control.ts), KS4, and the execution-recovery eligibility/transient rules; expect recorded-state/exit separation and no empty-set or unknown-effect shortcut.
  Observed: PASS for source/authority review. PID capture and disposal remain UNRUN; no process was probed or signalled.

- V5-REPAIR-AUTHORITY
  Behavior: Permit the newly authorized corrected native executions without borrowing machinery allowances for deliverable changes or retaining stale proof.
  Check: Read [execution-recovery](../../.config/agents/skills/dev-implementation/references/execution-recovery.md), especially Preserve authority and semantics, Recurrence and transient limits, and Evidence and continuation, plus [dev-implementation](../../.config/agents/skills/dev-implementation/SKILL.md)'s attempt ownership; expect evaluated-code repair to remain semantic and all tighter limits to apply.
  Observed: PASS — v4's generic-policy justification is rejected; A5 separately defines the proposed native-execution ceiling and retains implementation authority, affected-proof checks, cumulative budgets, and observed cleanup.

- V5-MIGRATION-AND-EXPORT
  Behavior: Produce one coherent future interface and a closed safe-evidence projection without retaining obsolete commands or inferring secret freedom from field names.
  Check: Inspect the current plan's targets/commands/Recovery and spec-v6's public runner interface; trace both old task prefixes, commands, prerequisite flags, and gate through A6; compare A7 with v3's unsafe-result retention rule.
  Observed: PASS for contract review. No migration/export implementation exists or is claimed verified; its direct checks remain future requirements.

- RUNTIME-PROOF
  Behavior: This review authorizes no native reliability, isolation, restoration, disposal, budget, or production-readiness claim.
  Check: Execute only after Main's coherent artifact revision and fresh plan approval, using the applicable native scenarios and independent checks.
  Observed: UNRUN. The offline counterexamples are not native trial evidence or passed trial ACs.

## Blocker/risk

- Review completion blocker: none. The successor preserves both new human answers and explicitly rejects the unsupported changes rather than silently approving them.
- Missing PID coverage can still prevent safe evaluation completion. Allowing it would be a separate human-owned change to the observed-disposal requirement; neither current answer authorizes that change.
- Actual result-loss cause and frequency remain unproved. The naive in-handler drain is self-dependent; upstream work requires separate authority and a demonstrated safe design.
- The 10-second post-return bound and two-corrected-native-executions-per-cause ceiling are proposed trial details for the revised plan, not independently granted repair authority or measurements. All existing tighter limits remain binding.
- Fixed export fields do not guarantee that free-form result values are safe. Required unsafe/unretainable evidence remains a real blocker, not permission to redact and claim exact retention.

## Next receiver

- **Main**, the bound specification and plan author: use unchanged v3 plus this complete A1–A7 replacement set to revise decision evidence v5, spec-v7, and the pending plan on the next authorized revision. Quote both new human answers verbatim, preserve the stated safety boundaries, and present the revised execution contract for approval. Do not implement or execute from this handoff.
