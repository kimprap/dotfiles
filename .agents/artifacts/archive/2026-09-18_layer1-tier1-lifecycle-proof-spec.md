# Layer 1 Stock Retrace/Reconcile Proof with Tier 1 Lifecycle Corroboration

**Revision:** `layer1-tier1-lifecycle-proof/spec-v2`  
**Status:** Final technical specification; planning authority only  
**Date:** 2026-09-18  
**Receiver:** `Main`  
**Next semantic role after finalization:** `dev-ticketing`

## Authority and approved outcome

This specification turns the approved `transport-proof-proposal/v3-unconfirmed` design into implementation authority. It does not authorize implementation, extension loading, a model/account-backed run, contract or eval mutation, Git state changes, shipping, or a change to an ADR.

The approved outcome is one fresh, explicitly authorized Layer 1 proof on stock, unmodified OMP. The run preserves the existing topology and semantic owners:

```text
Retrace root parent
  ├─ optional normalizer
  └─ one scope controller / delegated Reconcile owner
       ├─ persistent reviewer A
       └─ persistent reviewer B
```

The proof must distinguish:

1. the semantic outcome produced by the pinned Retrace/Reconcile contracts; and
2. proof completeness for original, owner-retained, phase-correct native lifecycle observations.

A selected Tier 1 in-session extension may corroborate already-retained controller slots in append-only JSONL. It never becomes a slot source, collector, workflow ledger, report store, admission authority, recovery mechanism, or semantic owner.

The governing transport changes are committed in checkpoint `d209f7a7e9ba14d5b6a1640942135d9910b46f0c` (ObservationSlots attempt 2). Its verification remains INCONCLUSIVE; nested lifecycle admission by the parent is unproved. These contracts must not be projected backward onto the 2026-09-17 failed run. Commit `1baaaf9` remains historical context only. Future execution still binds exact current governing bytes before launch; this checkpoint reference is not an operative pin.

## Current system and constraints

### Governing repository contracts

The future run must bind the exact bytes of these current surfaces before launch:

- [Retrace](../../.config/agents/skills/retrace/SKILL.md), especially **Content and return transport**;
- [Reconcile](../../.config/agents/skills/reconcile/SKILL.md), especially **Preflight and approval** and **Terminal cleanup**;
- [reviewer protocol](../../.config/agents/skills/reconcile/references/reviewer-protocol.md);
- [portable return contract](../../.config/agents/references/agent-return/return.md), especially **Retrace and Reconcile lifecycle observation slots** and **Retrace and Reconcile optional proof export**;
- [OMP return adapter](../../.config/agents/harnesses/omp/agent-return.md), especially **Allocation, addressability, and turns**, **Owner-directed message collection**, **Retrace and Reconcile optional proof export**, **Inbox is not return recovery**, and **Supervise indefinite operations externally**;
- the complete `REC-IRC-REPORT-TRANSPORT` object in [Reconcile evals](../../.config/agents/skills/reconcile/evals/evals.json).

These owners already require separate launch, roster, requested-return, and disposal observations; original current `details.waited` for report authority; immediate owner-side retention before decode; append-only invocation-local slots; prelaunch export authority; exact cleanup; and fail-closed handling when `waited` is absent. This specification adds no semantic field, return channel, correction allowance, timeout, retry, replay, replacement, or default export requirement.

### Stock OMP feasibility established statically

The installed runtime reports exactly `omp/18.1.21`. Static source and installed documentation establish that the selected architecture is implementable without changing the OMP binary:

- [extension loader at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/extensibility/extensions/loader.ts) imports a configured module once and retains its prepared factory;
- [SDK session construction at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/sdk.ts) rebinds prepared extension factories to each session's `ExtensionAPI`;
- [structured subagent construction at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/task/structured-subagent.ts) forwards `preloadedExtensionPaths` and `preloadedPreparedExtensions` to an unrestricted nested child;
- [task executor construction at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/task/executor.ts) supplies those prepared extensions to the child session;
- [extension types at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/extensibility/extensions/types.ts) expose `registerTool`, read-only `sessionManager`, and calling-session `localProtocolOptions`;
- [Eval's JavaScript prelude at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/eval/js/shared/prelude.txt) implements `tool.<name>(args)` through the current session tool bridge and retains JavaScript state across cells;
- [Eval's tool bridge at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/eval/js/tool-bridge.ts) returns `{ text, details, hasError? }` when the native tool has details or an error. `hasError` is the bridge's lossless boolean error discriminator, derived from native top-level `isError` or `details.isError`; `details` retains `hub` receipts, job snapshots, and `waited`. The design never claims the bridge exposes the raw top-level `AgentToolResult`;
- [Eval auto-backgrounding at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/tools/eval.ts) can immediately move a `timeout: 0` cell into an owner-scoped managed async job when the process-only overlay sets `eval.autoBackground.enabled: true` and `thresholdMs: 0`;
- [Hub job control at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/tools/hub/jobs.ts) exposes owner-scoped job snapshots and cancellation, including settled task-job snapshots;
- [the process-global agent registry at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/registry/agent-registry.ts) exposes live agent IDs and sessions;
- [the local protocol at `v18.1.21`](https://github.com/can1357/oh-my-pi/blob/v18.1.21/packages/coding-agent/src/internal-urls/local-protocol.ts) resolves `local://` under the calling session's artifact root.

Installed `omp://extensions.md`, `omp://extension-loading.md`, `omp://tools/eval.md`, `omp://tools/hub.md`, `omp://tools/task.md`, and `omp://config-usage.md` corroborate these APIs. Extensions are explicitly not sandboxed. The source findings prove static feasibility only. The approval-gated native scenario must still prove actual nested tool reachability, same-module run state, immediate Eval backgrounding, and the exact bridge shapes.

A child created with `restrictToolNames` does not inherit configured extensions. The scope-controller launch must therefore be unrestricted. Reviewers need no recorder tool because their actual parent—the scope controller—owns reviewer observations and exports them.

### Non-goals

This work must not:

- patch, fork, rebuild, or replace OMP;
- change Retrace, Reconcile, reviewer protocol, return contracts, or the current eval case;
- add a persistent state file, workflow ledger, search index, replay source, restart protocol, or cross-run accumulation;
- use `set_host_tools`, `set_subagent_subscription`, extension event hooks, inbox, history, agent output, local echoes, rendered cards, RPC message reads, JSONL, or transcript reconstruction as an authoritative return source;
- add a default report field or change any producer grammar;
- introduce a new timeout, retry, resend, semantic correction, actor replacement, or alternate transport;
- inject a crash, hang, lost reply, or other destructive fault;
- implement Tier 2 observation or Layer 2 RPC-worker supervision.

## Architecture and ownership

### Deep module boundary

The new **Lifecycle Proof Recorder** is one deep extension module with a small registered-tool interface and all filesystem, identity, ordering, uniqueness, and cleanup mechanics hidden behind it. A sibling **Lifecycle Proof Controller Helper** is a pure Eval-importable module that owns no file, process, collector, or semantic decision. It implements the exact bridge-envelope retention and slot-to-recorder sequence so the prospective path is executable and deterministically testable rather than prompt-shaped pseudocode.

The actual Retrace or Reconcile controller creates one helper instance in its own retained JavaScript Eval runtime. That instance owns only that controller's invocation maps. The root helper owns normalizer/scope observations; the nested scope helper owns reviewer observations. The root-opened JSONL path is their explicitly prebound shared export destination, not root ownership of reviewer slots.

Dependency direction is one-way:

```text
pinned workflow contract
  → actual controller's Eval helper and invocation-local maps
    → lifecycle_proof_record tool
      → one root-session-local JSONL file
```

The JSONL file has no dependency back into report admission, semantic state, cleanup authority, or recovery.

### Process-shared writer, session-bound identity

The extension module owns one module-scope `Map<runId, RunState>`. Stock OMP imports the configured module once and rebinds its prepared factory to root and unrestricted child sessions, so all bound tool instances use the same per-process run map and serialized writer queue.

Each tool call derives its emitter rather than accepting identity from the model:

1. take `ctx.sessionManager` from the executing session;
2. find exactly one live `AgentRegistry.global()` entry whose `ref.session?.sessionManager` is that same object;
3. require a non-null `ref.sessionFile`;
4. record `ref.id` and `ref.sessionFile`.

Zero or multiple matches is an error and poisons proof for that run. Agent ID and session file are never tool parameters.

This use of same-process module state is intentionally run-local. Process exit, extension reload, session restart, or loss of the `RunState` makes the proof fail. There is no reconstruction.

## Recorder interface

The extension registers one essential tool named `lifecycle_proof_record`. It registers no event handlers and calls neither `pi.appendEntry` nor `sessionManager.getBranch()`.

The parameter schema is a strict discriminated union:

```ts
type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

type SlotKey = {
  operation: string; // non-empty bound operation name
  phase: string;     // non-empty bound phase name
  child: string;     // exact native child ID
  token?: string;    // required exactly when the operation has a fresh authored token
};

type LifecycleProofRecordInput =
  | { action: "begin"; runId: string }
  | { action: "status"; runId: string }
  | { action: "append"; runId: string; key: SlotKey; original: JsonValue }
  | { action: "seal"; runId: string }
  | { action: "discard"; runId: string };
```

`runId` must match `^[a-z0-9][a-z0-9-]{0,79}$`. `operation`, `phase`, `child`, and an applicable `token` must be bounded non-empty strings. The implementation rejects non-JSON values, accessors, cycles, sparse arrays, non-finite numbers, functions, symbols, `undefined`, and non-plain objects instead of changing them during serialization.

### `begin`

`begin` is called by the root proof controller before the scope child launches. It:

- derives `local://<runId>/lifecycle-record.jsonl` from the root caller's `localProtocolOptions`;
- creates the run directory under that exact local root, verifies real-path containment, and rejects symlink escape;
- creates a new mode-`0600` file with `O_CREAT | O_EXCL | O_APPEND | O_WRONLY` and keeps that handle as the sole writer;
- rejects an existing path or duplicate in-memory `runId`;
- initializes sequence zero, no seen keys, a serialized append queue, opener identity, and a healthy state;
- returns only an acknowledgment containing schema version, run ID, canonical destination, and opener identity.

The destination is therefore exact and bound before scope launch without accepting an arbitrary path from a model.

### `status`

`status` performs no write. It returns schema version, run ID, canonical destination, opener identity, current caller identity, current caller session-file byte length as the observation cursor, current entry count, lifecycle state (`open | sealed | poisoned`), and a poison reason when present. The nested scope controller must call it before launching A or B and must observe the same run ID and destination returned to the root. Failure establishes an incompatible stock-runtime seam; stop before reviewer launch and return the exact capability failure.

### `append`

`append` is valid only for an open, healthy run. Under the run's serialized queue it:

1. derives the current emitting agent ID and session file;
2. validates the complete `original` as lossless JSON;
3. canonicalizes the tuple `(operation, phase, child, token-presence, token)` for uniqueness;
4. rejects a duplicate before writing and poisons the proof run;
5. assigns the next strictly increasing integer `sequence`;
6. captures `recordedAt` as a UTC ISO-8601 timestamp;
7. serializes exactly one entry plus one LF to one buffer;
8. writes the entire buffer through the retained `O_APPEND` handle while holding the queue; and
9. acknowledges only the key and assigned sequence, never echoes the original.

A partial or indeterminate write poisons the run. It is never retried, overwritten, truncated, compacted, or repaired. Duplicate rejection does not append a second line. The first line remains evidence of only the first export.

Each line has this shape:

```json
{
  "schema": "omp-layer1-lifecycle-record/v1",
  "runId": "...",
  "key": {
    "operation": "...",
    "phase": "...",
    "child": "...",
    "token": "... when applicable ..."
  },
  "sequence": 1,
  "recordedAt": "2026-09-18T00:00:00.000Z",
  "emitter": {
    "agentId": "...",
    "sessionFile": "..."
  },
  "original": {}
}
```

The example timestamp and values illustrate the fixed shape; no example value is operative run data.

### `seal` and `discard`

Only the opener identity may seal or discard.

`seal` drains the writer queue, calls `sync`, closes the handle, freezes the entry count, and returns the final count and last sequence. It succeeds only for a healthy open run. A poisoned run remains failed but can still be closed for cleanup.

`discard` is permitted only after the run and dependent verification finish. It closes any remaining handle, unlinks the exact JSONL path, removes the now-empty run directory, and removes the in-memory `RunState`. Missing or failed cleanup is reported, not hidden. It never removes a non-empty directory or a path outside the bound local root.

## Mechanical controller-slot export

### Controller helper interface

`.config/agents/harnesses/omp/extensions/lifecycle-proof-controller.js` exports `createLifecycleProofController({ runId, record, display })`. The returned invocation-local object contains append-only `invocations` and `slots` maps, a `failures` list, and:

```ts
observe({
  key: SlotKey,
  kind:
    | "awaited-message"
    | "launch-settlement"
    | "roster-binding"
    | "one-way-delivery"
    | "disposal",
  invoke: () => Promise<unknown>
}): Promise<ObservationResult>
```

`record` is the current Eval session's direct `args => tool.lifecycle_proof_record(args)` closure. `invoke` is a concrete zero-argument closure around the current native `tool.hub(...)` call. Neither a prior result nor an `original` argument is accepted from the model.

`observe` awaits `invoke`, immediately stores the complete available Eval bridge envelope in `invocations` under the canonical key, rejects an existing invocation key, and then applies the fixed selector for `kind`. The available envelope is exactly `{ text, details, hasError? }`; the helper checks `hasError`, error text/details, the requested receipt, and then the selected detail. It does not describe that bridge value as the raw top-level `AgentToolResult`.

Selectors are exact:

- `awaited-message`: require no bridge error, one non-failed receipt for the bound recipient, object `details`, and an own object-valued `details.waited`; the lifecycle-slot original is that complete `waited` object;
- `launch-settlement`: require `details.op === "wait"` and exactly one matching `details.jobs` member for the bound child with terminal `status === "completed"`; the original is the complete bridge envelope from that settled `hub wait` call and remains launch evidence only;
- `roster-binding`: require `details.op === "list"` and exactly one current peer for the bound child whose `parentId` is the actual controller and whose status is addressable; the original is the complete bridge envelope;
- `one-way-delivery`: require no bridge error and one successful bound-recipient receipt; the original is the complete bridge envelope and never a report;
- `disposal`: require `details.op === "cancel"` and one `details.cancelled` member for the exact child with `status === "cancelled"`, which is emitted only after native release/unregistration; `already_completed`, `not_found`, a request receipt, or a later roster is not disposal evidence. The original is the complete bridge envelope.

For `awaited-message`, absent or malformed current `details.waited` leaves the lifecycle slot absent while the invocation envelope and delivery frontier remain retained. For all kinds, a selector failure adds an exact proof failure and does not call the recorder.

After a selector succeeds, `observe` inserts that exact JavaScript value into `slots`, calls `record({ action: "append", runId, key, original: slots.get(canonicalKey) })`, and only then emits the structured display and returns the selected value for contract decoding. A recorder failure leaves the authoritative slot and invocation envelope intact, records proof `FAIL`, and returns the selected original so the semantic owner may continue; it is never retried or backfilled.

### Managed Eval invocation and observable abort

Every potentially indefinite observation (`awaited-message` and `launch-settlement`) runs in one JavaScript Eval cell with `timeout: 0`. Finite roster, one-way-delivery, disposal, recorder, and status calls may settle in the foreground; they never replace or compete with the pending message waiter. The proof process is started with the exact process-only overlay:

```yaml
eval:
  autoBackground:
    enabled: true
    thresholdMs: 0
```

The overlay is a mode-`0600` file at `/tmp/omp-layer1-proof-eval.yml`, created without overwrite, hashed into the run binding, passed only as `omp --config /tmp/omp-layer1-proof-eval.yml`, and deleted after the process exits. It is not a repository setting or workflow state file. In the fresh root and scope sessions, the controller first calls `hub jobs`, counts current `status === "running"` members in `details.jobs`, and requires that count to be below the bound `async.maxJobs` value. It then evaluates the exact no-message probe `await new Promise(() => {});` with Eval `timeout: 0`. That probe must return `details.async = { state: "running", jobId, type: "eval" }` immediately, be visible in the controller's `hub jobs`, and be cancelled by that controller through exact owner-scoped `hub cancel` before any peer dispatch. A foreground fallback at capacity would be unsafe, so the capacity check precedes the probe and every potentially indefinite covered call.

Before every potentially indefinite observation, the controller repeats the capacity check. The Eval call must return the same running async shape immediately; otherwise the run stops before any further covered dispatch and reports the missing safe-invocation capability.

Immediate backgrounding leaves the controller outside the blocked invocation. The already-required time/abort owner observes the exact Eval job every five minutes with non-consuming `hub jobs` snapshots and `lifecycle_proof_record status` session-file byte cursors. When the governing contract separately permits interruption, the controller uses owner-scoped `hub cancel` on that exact Eval job ID; the Eval abort signal propagates to the pending `hub` call and unregisters its waiter. No second message waiter, fixed report timeout, new supervisor, or polling of report content is introduced. Silence never authorizes cancellation.

The async Eval result auto-delivers the helper's structured display after settlement. No dependent semantic action is dispatched while the observation job is running. A process overlay that fails the preflight probe or fails to background a potentially indefinite call is an exact Layer 1 capability stop, not permission to use a foreground unbounded Eval cell.

## Contract binding before execution

No model/account-backed proof action begins until a concrete run packet contains all of the following values, with no symbolic digest or path placeholders:
1. lowercase SHA-256 and readable locator for exact bytes of Retrace, Reconcile, reviewer protocol, portable return, OMP return adapter, and the complete `REC-IRC-REPORT-TRANSPORT` eval object;
2. lowercase SHA-256 for the implemented recorder, controller helper, and exact process-only Eval overlay, plus the literal configured recorder-extension entry and bound `async.maxJobs` value;
3. installed runtime string `omp/18.1.21`, SHA-256 of the invoked binary, and public source tag `v18.1.21`;
4. fresh run ID and the exact canonical destination returned by `begin`;
5. actual root controller identity, the scope role, exact scope-level slot kinds, and proof verdict rules;
6. the approved one-scope Retrace contract, protected behavior, exclusions, and exact content identities already required by Retrace; and
7. the existing time/abort owner, exact managed Eval job observation surface, session-log cursor surface, and exact owner-scoped cancel operation for each controller.

The root proof instructions and scope contract carry this table before scope launch. The initial scope operative request repeats it unchanged. Before reviewer launch, the scope controller verifies `status`, binds its own actual identity plus reviewer A/B slot kinds and the shared destination in its Reconcile launch binding, and repeats the same export binding in operative reviewer requests. The root opens, seals, and discards the proof-run file, but only the scope controller may export its reviewer slots. `begin-reconcile`, a review response, final admission, or cleanup may not introduce or repair export authority.

Any identity drift before or during the run makes the proof fail against the prior binding. It does not authorize pinning, committing, rewriting changed content, or adding a manifest or ledger.

## Native full-path scenario

The scenario runs only after a separate human gate for model/account-backed effects. Create the exact overlay above, then start a fresh stock process with `omp --config /tmp/omp-layer1-proof-eval.yml`. It uses the configured recorder and controller helper; it does not use RPC observation or host-tool injection.

1. **Preflight and open.** Compute the concrete binding table; bind `async.maxJobs`, the existing time/abort owner, non-consuming five-minute `hub jobs` observation, `status` cursor, and exact Eval-job cancellation surface; prove the no-message background/cancel probe in root; call `begin`; verify the returned destination; and include the binding in root instructions.
2. **Optional normalizer.** Invoke a normalizer only when Retrace's existing predicate selects one. If selected, retain/export its settled launch job, exact roster binding, current normalization return, and exact disposal. For the approved already-known single scope, do not manufacture a normalizer merely for coverage.
3. **Scope launch.** Launch one unrestricted scope controller with the frozen approved scope contract and prebound export authority. Retain/export the final settled task-job wait envelope and exact root-owned roster envelope before the candidate-ready request.
4. **Candidate-ready.** Start the helper's `awaited-message` observation around owner-directed `hub send` with `await: true` and `timeoutMs: 0`; require immediate Eval backgrounding; then admit only its returned current `details.waited`.
5. **Nested capability gate.** The scope controller loads the pinned Reconcile owners, imports its own controller helper instance, verifies the shared run through `status`, proves its own no-message background/cancel probe, and stops before reviewer launch on any missing tool, run, destination, owner, safe-Eval, or binding mismatch.
6. **Persistent A/B.** Allocate A and B together as distinct persistent read-only roles. For each, retain/export the final settled launch-job wait envelope and then exact scope-owned roster envelope before a separate fresh-token readiness request. Distinct owner-child operations may overlap.
7. **Reviewer returns.** Retain/export both readiness returns. A performs its naturally required first `initial` review and same-child `post-rethink` exactly once. B remains persistent and participates only as the existing protocol naturally requests: if B receives its first actual review, it likewise uses `initial` then one `post-rethink`; any later or corrected return is exported only when actually authorized and dispatched. No pass or verdict is manufactured for coverage.
8. **Synchronization.** After the first admitted finalized current-identity `VALID`, send the existing one-way context-only packet to the retained counterpart and retain/export its current delivery envelope without treating it as a report.
9. **Reviewer cleanup.** The scope controller uses parent-owned native exact-ID cancellation for both reviewers and retains/exports each successful native release/unregistration envelope. A cancellation request, `already_completed`, `not_found`, or later roster is insufficient.
10. **Scope result.** The scope controller assembles and sends its unchanged `scope-result`. The root retains/exports current `details.waited` before admission and aggregate assembly.
11. **Scope cleanup.** The root disposes the exact scope child and retains/exports its successful native release/unregistration envelope.
12. **Verification and discard.** Seal the recorder, read the JSONL once for dependent verification, compare it with each owning controller helper's structured displays and the actual operation sequence, record separate semantic and proof verdicts, then call `discard`, verify the file/run directory are absent, delete the exact Eval overlay, and exit the process.

Every potentially indefinite message or launch-settlement collector runs only in the immediately managed Eval job described above. Its controller remains outside that invocation, uses no second message waiter, and retains the current contract's five-minute non-mutating observation and separately authorized exact-job abort behavior. If the capacity check, preflight probe, immediate backgrounding, job visibility, session cursor, or exact cancellation is unavailable, stop before dispatch rather than entering an unbounded foreground Eval cell.

The expected key set is derived from the frozen contract and every operation actually dispatched. This is verification logic, not a new workflow ledger. A protocol-permitted path that does not select a normalizer or request B/later review has no invented key. Every operation actually dispatched remains accountable even when its expected original is absent.

## Invariants, errors, and verdicts

### Storage invariants

- exactly one file per run at `.../<session>/local/<runId>/lifecycle-record.jsonl`;
- extension module is the only writer or remover of that path;
- agents never use `write`, `edit`, shell, or another extension to mutate it;
- one complete JSON object per LF-terminated line;
- strictly increasing `sequence` in file order and an extension-generated UTC `recordedAt` timestamp per entry;
- unique `(operation, phase, child, token-presence, token)` key;
- derived emitter agent ID and session file;
- complete lossless JSON `original` from the already-filled owner slot;
- no rewrite, truncate, compact, index, replay, restart recovery, cross-run read, or committed copy.

`O_APPEND`, mode `0600`, real-path checks, and one serialized extension queue reduce accidental corruption. They are not a security sandbox. Same-user code can still mutate files. The proof relies on the explicit one-writer run policy and observable tool history.

### Separate verdicts

The run reports:

- **Semantic disposition:** `complete`, an exact contract-defined terminal `stopped` outcome, or `unresolved`; and
- **Layer 1 proof verdict:** `PASS` or `FAIL`.

A contract-defined terminal stop is settled but must not be presented as semantic success. A pending, paused, or missing-return frontier is not settled.

Layer 1 proof is `PASS` only when:

1. the semantic outcome settles under every pinned identity and existing owner;
2. every required launch, roster, requested-return, synchronization-delivery, and disposal observation occupies the correct controller slot before dependent work;
3. every admitted report came only from original current `details.waited`;
4. every required filled slot was exported exactly once under prelaunch authority;
5. every JSONL original is deeply equal to the corresponding structured Eval display from that slot;
6. key, sequence, timestamp, emitter, and file invariants hold; and
7. exact reviewer and scope cleanup, plus normalizer cleanup only when a normalizer was actually selected, completes with required disposal evidence.

Proof is `FAIL` on missing or wrong slots, wrong-phase substitution, absent current `waited`, model-transcribed or reconstructed originals, duplicate keys, missing or late export authority, identity drift, append/seal/read mismatch, incomplete accounting, unresolved semantic operation, or incomplete cleanup.

A genuine lost reply leaves its exact slot and export absent. Earlier originals remain valid and the operation can be completely accounted for, but the proof verdict is still `FAIL`. No retry, replay, re-emission, backfill, replacement collector, replacement actor, or alternate source is authorized.

Both current [Retrace](../../.config/agents/skills/retrace/evals/evals.json) and [Reconcile](../../.config/agents/skills/reconcile/evals/evals.json) eval catalogs remain unchanged behavioral authority; preserve their cases and assertions by reference, not by duplicating prompts or transport instructions. `REC-IRC-REPORT-TRANSPORT`, `REC-CURRENT-WAITED-REPORT`, and `RETRACE-DELEGATED-REVIEW` retain their distinct synthetic coverage of phase/provenance, nested-owner copying, returned-body fidelity, correction limits, and export authority. One bounded native full-path pass does not replace that coverage or the catalogs' other behavioral and failure branches. No fault, extra reviewer pass, or normalizer is manufactured to inflate native coverage.

## Effects, migration, rollback, and compatibility

### Repository effects authorized by a future approved implementation

The smallest production change surface is:

1. create `.config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.js`;
2. create `.config/agents/harnesses/omp/extensions/lifecycle-proof-controller.js`;
3. create `.config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.test.js` for the recorder and controller helper's observable contracts;
4. append `~/.dotfiles/.config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.js` to `.config/agents/harnesses/omp/config.yml`.

No governing contract, eval, ADR, OMP source, or other extension is changed. Existing Retrace and Reconcile eval coverage is reused unchanged.

The recorder is inert until an explicitly bound controller calls `begin`; normal sessions gain one essential tool but no default file, event listener, semantic behavior, or report field. The controller helper is imported only by an authorized proof Eval cell. The Eval auto-background settings exist only in the exact `/tmp/omp-layer1-proof-eval.yml` process overlay and are never added to repository or global config.

### External effects requiring separate approval

Each native full-path execution invokes configured models/accounts, launches persistent children, writes one session-local JSONL file plus the exact temporary Eval overlay, and disposes those children. The implementation smoke run and the independent verification run each require the applicable explicit human gate before those effects. Static/unit work may complete before that gate. A missing gate blocks only the native effect; it does not authorize a simulated substitute.

### Cutover and rollback

This is an additive clean cutover: add the recorder, controller helper, focused test, and one extension config entry. There is no compatibility shim.

Before a proof run begins, rollback is removal of the config entry and the three new files. During an active proof run, do not unload or change the recorder; first stop under the governing contracts, finish exact child cleanup, close/discard the session-local run if reachable, remove the temporary overlay, and report the failed proof. After no run is active, rollback may remove the additive surfaces. No JSONL or overlay is migrated or retained.

## Acceptance

### AC-L1-01 — stock nested recorder reachability and safe Eval invocation
Behavior: Stock OMP 18.1.21 loads the configured recorder in the root and rebinds the same prepared extension module to the unrestricted scope; the exact process overlay immediately backgrounds each potentially indefinite `timeout: 0` observation cell as an owner-scoped Eval job, and before reviewer launch scope `status` observes the root-opened run and current session cursor.
Check: After the separate account-effect gate, create the exact mode-`0600` `/tmp/omp-layer1-proof-eval.yml` overlay and run `omp --config /tmp/omp-layer1-proof-eval.yml`; expect root and scope no-message probes to return `details.async.state === "running"` with type `eval`, appear in non-consuming job snapshots, and accept exact owner-scoped cancellation before peer dispatch, plus root `begin`, scope `status` for the same run/destination, and the same immediate async shape for every potentially indefinite observation before its controller performs another covered action.

### AC-L1-02 — append-only writer contract
Behavior: The recorder creates a new mode-`0600` session-local file, writes lossless LF-delimited entries in strictly increasing sequence order with UTC timestamps, derives emitter identity, rejects a duplicate key without a second line, poisons indeterminate writes, seals without rewrite, and removes only its exact empty run directory on discard.
Check: Run `bun test .config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.test.js`; expect exit 0 with direct filesystem assertions for create/append/sequence/timestamp/derived identity/duplicate rejection/seal/discard and no residue under the test local root.

### AC-L1-03 — prelaunch identity and export binding
Behavior: Concrete governing-input, recorder, helper, extension-entry, async-capacity, process-overlay, binary, runtime, owner, slot-kind, run-ID, and destination identities are bound in root instructions and the scope contract before scope launch, and scope repeats the unchanged shared-destination/reviewer-owner binding before A/B launch without transferring its slots to root.
Check: Direct static proof over the concrete native-run packet and captured launch inputs; expect every required lowercase SHA-256, locator, actual owner, run ID, and canonical destination before the corresponding launch, byte re-hash equality, root ownership only of file lifecycle/root-observed slots, scope ownership of reviewer slots, and no symbolic value, manifest, ledger, late `begin-reconcile` addition, or drift.

### AC-L1-04 — mechanical owner-slot copy before semantics
Behavior: The controller helper retains the complete available `{ text, details, hasError? }` Eval bridge envelope, checks the fixed operation selector, assigns the selected structured value to its distinct append-only owner slot, and passes that exact slot value to `lifecycle_proof_record` before decode, admission, dependent dispatch, assembly, or cleanup continuation.
Check: Run `bun test .config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.test.js` and the approval-gated native scenario; expect deterministic helper assertions for envelope/error/receipt/selector ordering plus native deep equality between each owner display and JSONL `original`, with no literal, model-transcribed, or reconstructed prior result.

### AC-L1-05 — complete stock Retrace/Reconcile path
Behavior: One run exercises the approved known scope, one unrestricted scope controller, persistent distinct A/B, settled launch then roster binding, separate readiness, A's natural `initial` plus same-child `post-rethink`, only protocol-requested B/later/correction passes, one-way counterpart synchronization, exact reviewer cleanup, scope result, and exact scope cleanup; a normalizer appears only if Retrace's existing predicate selects it.
Check: Execute the approval-gated **Native full-path scenario** once on the implementation target; expect a settled semantic disposition, exact owner/child/token/phase accounting for every actual operation, current `details.waited` for every admitted report, no manufactured normalizer or reviewer pass, context-only delivery with no report admission, terminal disposal evidence for A/B/scope, and equivalent normalizer evidence only when selected.

### AC-L1-06 — deterministic fail-closed controller behavior
Behavior: An absent current `details.waited` retains the invocation envelope but creates no lifecycle slot/export and marks proof `FAIL`; a post-slot recorder failure preserves the authoritative slot, marks only proof failed, permits semantic handling of that retained original, and never retries, backfills, or selects another source.
Check: Run `bun test .config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.test.js`; expect deterministic fake-bridge cases for present waited, absent waited, bridge error/failed receipt, and recorder rejection to prove exact map/export/failure outcomes with zero model/account call or injected runtime crash/hang/lost reply.

### AC-L1-07 — corroboration never becomes authority
Behavior: The extension registers only the explicit recorder tool, never observes tool results automatically, and neither recorder nor controller helper supplies a collector, semantic slot source, admission decision, replay, or recovery; JSONL is never read into workflow semantics.
Check: Direct static proof over `.config/agents/harnesses/omp/extensions/lifecycle-proof-recorder.js`, `.config/agents/harnesses/omp/extensions/lifecycle-proof-controller.js`, unchanged governing contracts, and the native-run packet; expect one `registerTool`, no `pi.on`, no `appendEntry`/branch reconstruction, helper inputs limited to current invocation closures, no JSONL-to-admission path, and no report-grammar or allowance change.

### AC-L1-08 — ephemeral verification and exact cleanup
Behavior: After all dependent operations, root seals the shared export file, verification accounts each line against the slot-owning controller, records separate semantic/proof verdicts, and root discards the JSONL/empty run directory while the operator removes the process overlay without deleting unrelated content.
Check: At the end of each approval-gated native scenario, run the complete key/deep-equality/invariant comparison, call `discard`, remove `/tmp/omp-layer1-proof-eval.yml`, and inspect exact paths; expect recorded verdicts, absent JSONL/run directory/overlay, intact local root, and no repository-owned or committed copy.

## Test seams and proof selection

The new permanent test file is warranted because the recorder and controller helper introduce observable contracts with plausible regressions: silent duplicate append, wrong emitter identity, rewrite instead of append, path escape, unrelated cleanup, loss of the bridge error/receipt envelope, model-shaped selection, absent-`waited` export, or semantic suppression after recorder-only failure. It uses the registered tool with a fake extension API/context, temporary `localProtocolOptions`, temporary registry sessions, and fake bridge invocations, following the neighboring Bun extension-test convention. It keeps the smallest durable success and fail-closed cases.

The permanent test cannot prove nested extension rebinding, immediate managed Eval backgrounding, model behavior, reviewer persistence, or cleanup ordering. One full native journey is the cheapest adequate proof for those compatible integration obligations. The journey must not be multiplied per AC; one run may supply all compatible observations. Independent standard-assurance verification must freshly execute the complete approved check set on the reviewed immutable target, subject to its own explicit external-effect gate.

No new permanent contract/eval test is added. `REC-IRC-REPORT-TRANSPORT` remains unchanged synthetic coverage; native fault injection would add cost and authority not granted by the approved outcome.

## Implementation boundaries and dependencies

This outcome requires a lean dependency plan rather than one direct contract because it combines a repository extension/helper/config cutover with a separately gated, account-backed native effect and ephemeral cleanup evidence.

The future ticket graph must preserve these ownership seams without scheduling changes here:

1. **Recorder and controller-path implementation boundary:** recorder, Eval-importable controller helper, focused Bun test, and config entry stay cohesive because configured loading, shared writer state, identity derivation, bridge selectors, slot ordering, append mechanics, and the public tool schema must agree atomically. Receiver: `Main`.
2. **Native proof boundary:** after the immutable implementation target exists and a human grants the external-effect gate, create the exact process overlay, execute the bound full-path scenario, produce separate semantic/proof verdicts, and perform exact ephemeral cleanup. Receiver: `Main`.

The second boundary depends on the first. Contract binding precedes every covered launch. Recorder and nested export wiring must not be split into independent alternatives. Standard review and verification are assurance over the resulting target, not fabricated implementation-tail scope.

## Risks, assumptions, stops, and deferred work

- **Module-instance assumption:** tagged source says prepared factories are rebound rather than re-imported for unrestricted children. Native `status` is the mandatory stop gate that proves the actual loaded process shares the run state.
- **Safe-Eval assumption:** tagged source documents immediate managed backgrounding, owner-scoped job visibility, and abort propagation. Every potentially indefinite covered cell must actually return the Eval async job handle before further dispatch; foreground fallback, missing capacity, missing cursor, or missing exact-job cancellation stops the run.
- **Bridge-shape boundary:** the helper retains the complete documented Eval bridge envelope, including `hasError`, receipts, jobs, and waited details. It does not claim access to the raw top-level native `isError`; source-version drift or a missing required bridge fact stops the run.
- **Restricted scope risk:** if the scope controller is created with restricted tool names, the recorder is absent. Stop before reviewer launch; do not widen tools after launch or substitute root export.
- **Identity API risk:** exact agent identity depends on one live `AgentRegistry` entry matching the executing `sessionManager`. Ambiguity fails; caller-supplied identity is not a fallback.
- **Filesystem risk:** append and same-user policy are not tamper-proof. Any external mutation, unexpected line, sequence gap, parse error, or file identity change fails proof.
- **Eval lifecycle risk:** kernel reset, cancellation, process loss, or async-result loss destroys the pending owner path. JSONL cannot reconstruct it; the run fails.
- **Liveness risk:** existing external time/abort ownership and five-minute non-consuming observations remain mandatory. Silence authorizes no intervention.
- **Cleanup risk:** a poisoned recorder must still be closed/discarded after dependent failure accounting, but failed cleanup is reported and never hidden.
- **No operative pin:** this specification names only the required governing inputs and run mechanisms. It does not pin current bytes, add a manifest/ledger/default field, modify config, create an overlay, or open a run.

Corroboration Tier 2 remains deferred. `set_subagent_subscription: events` is observation only; root `set_host_tools` does not establish nested controller reachability. Layer 2's external per-worker RPC supervisor remains deferred unless a compliant Layer 1 run demonstrates a concrete stock limitation. Neither deferred design contributes an implementation task to this scope.

There are no open product or architecture decisions. A future implementation must stop and return the exact missing capability if tagged static assumptions fail in the actual stock runtime; it may not replace the selected transport or invent host support.

## Revision and next owner

Final revision `layer1-tier1-lifecycle-proof/spec-v2` preserves spec-v1's design and completed same-author rethink, refreshes the committed baseline, and makes unchanged catalog coverage explicit. It changes no helper contract, task boundary, or acceptance Behavior/Check pair.

The next owner is `Main` acting through `dev-ticketing`, which must project every `AC-L1-*` Behavior/Check pair unchanged into a repository implementation plan. No future plan is executed by this specification.
