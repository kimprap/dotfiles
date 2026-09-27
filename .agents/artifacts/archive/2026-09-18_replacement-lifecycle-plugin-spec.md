# Replacement Lifecycle Plugin for Persistent Stock OMP Workers

**Revision:** `replacement-lifecycle-plugin/spec-v6`  
**Status:** Human-approved locator-hash contract amendment; no plan amendment or execution authority  
**Date:** 2026-09-22  
**Receiver:** `Main`  
**Next semantic role after finalization:** No automatic continuation; `Main` holds the separate plan-amendment gate

## Authority and outcome

This specification revises the approved replacement architecture for Retrace, Reconcile, and later explicitly migrated consumers after completion of the separately owned generic implementation-collection prerequisite. Earlier records called this direction **Layer 2**; human-facing text calls it the **replacement lifecycle plugin**.

The outcome remains one opt-in OMP extension that supervises persistent, independent stock OMP RPC worker processes while preserving logical parent, scope, and reviewer ownership. The plugin hides process creation, RPC framing, request correlation, authoritative replies, worker continuity, observation, abort, and disposal behind a small reusable interface. Retrace and Reconcile retain their semantic responsibilities and stop spelling low-level `task`/`hub`/Eval lifecycle choreography in prompts.

The completed collection prerequisite is baseline, not a plugin task: its generic candidate/Handoff collection, exact role-and-purpose exemption, native provenance, and one recovery-authorized exact-body restatement remain intact. This plugin revision adds no generic collection runtime code and does not claim that generic collection stayed unchanged across the prerequisite and plugin outcomes. Later plugin migration changes only the still-stale Retrace/Reconcile lifecycle-slot, proof-export, host-adapter, and projection clauses named below.

The current v6 authority is limited to the accepted locator-hash grammar in `retrace/SKILL.md`, `reconcile/references/reviewer-protocol.md`, the corresponding delegated-binding/bootstrap/synchronization clauses of `reconcile/SKILL.md`, and this specification. It authorizes no plugin or packet repair, plan/acceptance edit, extension loading, model/account call, worker launch, native proof, Git, staging, delivery, or shipping. Plan `.agents/plans/2026-09-22-0019_correlated-run-settlement-and-migrated-proof.md` remains the same identity and `IN_PROGRESS`; its native 1/1 is consumed and its T1 remains accepted. Amending and reapproving that plan's acceptance, then granting any new native cap, are separate later human gates. Cap exhaustion does not authorize `CLOSED`, a successor-close, replay, or re-review. The v5 construction evidence and task graph retained below are historical context, not renewed task authority.

The replacement is not the Tier 1 recorder and not an observer-only transport. The prior Tier 1 specification remains immutable source knowledge, not current execution authority or a prerequisite trial. Its no-replacement, no-contract-edit, no-fault-test, and related exclusions governed that old scope only and do not constrain this approved replacement. This revision independently preserves the no-injected-fault rule for both native runs.

## Current evidence and limits

The current source baseline follows the completed generic collection cutover. That prerequisite received one approved review, one complete independent verification, and terminal learning with no durable item; its candidate-admission exception and verifier-capture recovery do not change plugin authority, source rules, proof gates, attempts, or ownership.

At spec-v5 authorship, the existing T1 candidate was preserved. Its exact attempt-1 candidate from required native child `LifecyclePluginInterfaceOwner` (logical owner `lifecycle-plugin-interface-owner`) was admitted under spec-v4. The child had completed the one implementation rethink and bounded correction, run its then-bound checks, and emitted a late Handoff that was not admitted; T1 and every acceptance criterion were then incomplete. No reviewer or verifier finding had established ordinary attempt-2 eligibility. This historical record neither overrides accepted T1 under 0019 nor resets any rethink, semantic attempt, or report allowance.

The prior v4 capability stop was accurate for command-based construction: `RpcClient` keeps that child private. Installed stock OMP `18.2.6` now supplies the documented `RpcClientOptions.spawn(agentArgs)` construction hook. The hook lets the supervisor create the same stock local `ptree.ChildProcess`, retain its PID and `exited` promise before `RpcClient.start()` reaches ready, and return that exact handle to `RpcClient`. This is the approved resolution direction; it is not implementation proof and does not convert the stopped v4 result into a pass.

Installed package metadata pins both `@oh-my-pi/pi-coding-agent` and `@oh-my-pi/pi-utils` at `18.2.6`. Static source establishes:

- `RpcClientOptions.spawn` receives only the complete agent-owned RPC/model argument suffix and takes precedence over `command`;
- `RpcAgentProcess` requires `stdin`, `stdout`, `peekStderr()`, `kill()`, and `exited`;
- `RpcClient.start()` is the sole stdout reader, negotiates protocol v2, installs custom tools, races startup against `child.exited`, and reaps post-ready output/process failure;
- `RpcClient.stop()` signals the retained child and waits for `child.exited`;
- `ptree.spawn()` returns the stock `ChildProcess` implementing that interface, with synchronous `pid`, the normalized `exited` promise, piped stdout/stderr, and managed tree termination;
- `@oh-my-pi/pi-utils` exports the local process utility as `ptree`, while the coding-agent package exports the RPC client and task discovery surfaces.

Primary source pins:

- [`rpc-client.ts` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/coding-agent/src/modes/rpc/rpc-client.ts)
- [`ptree.ts` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/utils/src/ptree.ts)
- [`pi-utils/src/index.ts` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/utils/src/index.ts)
- [`pi-coding-agent/package.json` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/coding-agent/package.json)
- [`pi-utils/package.json` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/utils/package.json)
- [`task/index.ts` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/coding-agent/src/task/index.ts)
- [`extensions/types.ts` at v18.2.6](https://github.com/can1357/oh-my-pi/blob/v18.2.6/packages/coding-agent/src/extensibility/extensions/types.ts)

Installed files under `.config/agents/harnesses/omp/extensions/node_modules/@oh-my-pi/` are the implementation-time source of truth for the pinned workstation package. This is static feasibility evidence only. It does not prove the revised plugin, an account-backed worker path, or cleanup on this workstation. Runtime admission checks capabilities and negotiated protocol, never a version string.

## Design decision

### Smallest deep Module and consumer Seam

The **Lifecycle Supervisor** is the deep Module. Its public Interface is one registered `lifecycle` tool plus one human `/lifecycle` command. Its Implementation owns worker processes, RPC protocol v2, connection-bound identity, request correlation, persistent sessions, owner-scoped visibility, capacity, notifications, abort, and disposal.

Two small **Consumer Definitions** compose that generic Module:

- `reconcile` constructs standalone root-owned A/B or delegated scope-owned A/B from one semantic binding;
- `retrace` constructs direct normalizer/scope actors and reuses the `reconcile` definition for each scope's nested A/B.

Consumer Definitions are policy Adapters, not a workflow DSL or public backend abstraction. They select known agent profiles, ownership, capability edges, and capacity classes. Skills supply only semantic binding data and request payloads; they never author actor graphs, argv, tools, models, prompt files, or RPC policy.

The Module provides Depth behind six model-facing operations:

1. `open` — validate one named Consumer Definition and semantic binding, then create an invocation-local run without launching a worker;
2. `dispatch` — validate one or more logical requests and return a handle for every requested item immediately;
3. `observe` — inspect caller-owned request results and caller-visible lifecycle summaries;
4. `dispose` — release one exact directly owned actor or owned subtree;
5. `abort` — explicitly terminate one pending request, one directly owned actor/subtree, or the whole run;
6. `close` — dispose all remaining run-owned workers and settle the run.

The `/lifecycle status [run]` and `/lifecycle abort <run|request>` command is the human inspection/abort Seam. It exposes no semantic mutation and never reveals nested reply bodies to a non-owning root.

The OMP extension entry is the only Adapter to the host session. The worker-process RPC client is internal Implementation, not a public backend Interface. There is one concrete backend, so implementation must not add a provider registry, general orchestration engine, inheritance hierarchy, or hypothetical transport interface.

The strongest simpler alternative is direct task/hub reuse. It has fewer implementation files but leaves lifecycle identity, waiter placement, capacity, reply provenance, and disposal distributed through prompts—the exact recurring failure surface this replacement must remove. Literal inheritance has no stock OMP base-class Seam and would not supervise independent processes. Composition through the extension plus two narrow Consumer Definitions has lower operating and ownership cost.

### Source-grounded construction

Implementation uses existing exported package surfaces:

- import `RpcClient` and `defineRpcClientTool` from `@oh-my-pi/pi-coding-agent/modes/rpc/rpc-client`;
- import `discoverAgents` and `getAgent` from `@oh-my-pi/pi-coding-agent/task`;
- import the stock local process namespace `ptree` from `@oh-my-pi/pi-utils`;
- use `ExtensionContext.models.resolve()` and `models.current()` from the extension API.

`discoverAgents(cwd)` returns the effective, precedence-resolved `AgentDefinition` set including `systemPrompt`, ordered model selectors, tools, `readSummarize`, and source. Consumer Definitions select exact agent names: bundled `task` for normalizer/scope-controller prompt policy and current `second-opinion-a` / `second-opinion-b` for reviewers. A missing or malformed selected profile fails `open` before worker launch.

For production `open`, the profile resolver passes the exact discovered `systemPrompt` through stock `--system-prompt` and a fixed consumer-owned built-in tool allowlist through `--tools`. It resolves a definition's ordered `model` selectors with `ctx.models.resolve` and uses the first available; when the list is absent it uses `ctx.models.current`. The reviewer and read-only normalizer/scope built-in allowlists are `read,grep,glob`; host-owned `lifecycle_channel` is supplied separately through `RpcClient.customTools`. Obsolete `task`, `hub`, and `yield` transport tools are not exposed. A selected profile with `readSummarize: false` adds the repository-owned read-verbatim config overlay; otherwise current config applies.

Every production worker uses `new RpcClient({ spawn, cwd, env, provider, model, args, customTools: [lifecycleChannel], terminationGraceMs: 1_000 })`. `spawn` is one fixed private callback whose only parameter is `agentArgs`. It calls:

```ts
const child = ptree.spawn(["omp", ...agentArgs], {
  cwd,
  env: { ...Bun.env, ...env },
  stdin: "pipe",
});
```

The callback synchronously records `child.pid` and the exact `child.exited` promise in the actor's generation-bound process record, installs the idempotent exit observer, then returns that same `child` handle unmodified. It does this before `RpcClient.start()` can settle startup or ready. `RpcClient` remains the sole consumer of `child.stdout` and the sole owner of JSONL/v2 framing, request IDs, RPC responses, custom-tool frames, ready negotiation, and internal reaping. The supervisor never tees or reads stdout.

The callback does not accept arbitrary caller argv. No public schema field, provider registry, general transport adapter, wrapper process, output tee, OMP patch/fork/rebuild, new worker-spawn API, or new library is authorized. `command` is not supplied when `spawn` is supplied. The agent-owned `agentArgs` remain the only suffix after the fixed `"omp"` executable, and no caller-controlled string enters command, option, profile, tool, model, or prompt construction.

Before invoking `client.start()`, the supervisor creates the actor generation and marks it `starting`. The spawn callback is the single production and deterministic-smoke construction path. Production uses the inherited environment. Deterministic tests prepend a temporary test-owned directory containing an executable named `omp` to the constructor's private environment; the callback still executes `["omp", ...agentArgs]`, returns a real stock `ptree.ChildProcess`, and stock `RpcClient` owns real framing. A narrowly controlled `RpcAgentProcess` refusal double is permitted only for the cleanup-noncooperation branch that a real child cannot deterministically supply; it does not replace the real fake-process smoke or create a production injection field.

The supervisor waits for ready/protocol negotiation, calls `setAutoRetry(false)`, and only then admits the first prompt. T1 also owns the existing proof-only constructor inside its already-declared plugin files. It remains outside `omp-lifecycle-call/v1`: no skill-visible flag, `systemPrompt` field on `open`, caller-supplied prompt, arbitrary spawn option, or additional registered tool selects it. T2 alone uses it for the pre-cutover native proof. It reuses the named consumer compilation, fixed spawn callback, process observer, supervisor, stock RPC, host tool, ownership, capacity, and disposal implementation. Under this constructor only, the supervisor substitutes one fixed mechanical-probe `systemPrompt` for every T2 actor using `lifecycle_channel`, including normalizer, scope, and reviewer workers. Profile discovery, model selection, read-only tools, and read-verbatim policy remain unchanged.

The fixed prompt is supervisor-owned and directs mechanical work without loading the production semantic review protocols. Workers use only connection-authorized `lifecycle_channel` operations, including `request` where permitted. A scope disposes its reviewers before publishing its own reply. After replying, the worker finishes the current turn; it does not terminate the persistent RPC process. Literal request bodies are dispatched data, not authority to replace a system prompt.

This is the sole authorized prompt-fidelity exception. Production `open`, including T5's migrated-path proof, still uses exact discovered prompts and cannot select the probe policy. T2 establishes mechanics under that fixed policy, not production prompt fidelity; T5 establishes compatibility of the production prompts and migrated protocol.

No runtime rejects merely because the reported OMP version string differs from `18.2.6`. That installed revision qualifies the design. Runtime admission checks negotiated protocol v2, required RPC/custom-tool behavior, selected profiles, and process controls directly.
### Dependency direction

```text
Retrace or Reconcile semantic controller
  -> named Consumer Definition
    -> lifecycle tool Interface
      -> Lifecycle Supervisor
        -> stock OMP RpcClient / RPC worker
          -> lifecycle_channel host tool

scope controller connection
  -> owner-scoped lifecycle_channel
    -> same Supervisor
      -> that scope's declared reviewer workers
```

No worker process, RPC frame, status notification, assistant transcript, prompt acknowledgement, or message-history read bypasses the Lifecycle Supervisor into semantic admission.

## Public contract

All calls use `omp-lifecycle-call/v1`. Required known fields are validated; an optional `metadata` object and unknown nonconflicting extension fields are ignored for behavior and never become authority. Harmless extra metadata is not a capability failure.

```ts
type LifecycleCall =
  | {
      schema: "omp-lifecycle-call/v1";
      op: "open";
      definition: "reconcile";
      binding:
        | { mode: "standalone"; controller: string }
        | { mode: "delegated"; controller: string; scope: string };
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "open";
      definition: "retrace";
      binding: {
        controller: string;
        normalizer?: { id: string };
        scopes: Array<{ id: string; requires: string[] }>;
        maxDirectActors: 4;
      };
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "dispatch";
      runId: string;
      calls: Array<{ target: string; phase: string; body: string }>;
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "observe";
      runId: string;
      requestIds?: string[];
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "dispose";
      runId: string;
      actorId: string;
      subtree: boolean;
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "abort";
      runId: string;
      requestId?: string;
      actorId?: string;
      metadata?: Record<string, unknown>;
    }
  | {
      schema: "omp-lifecycle-call/v1";
      op: "close";
      runId: string;
      metadata?: Record<string, unknown>;
    };
```

`open` returns stable direct-actor handles. For standalone Reconcile those are A and B. For Retrace they are the optional normalizer and approved scope controllers; reviewer handles remain visible only to their owning scope connection. The skills do not construct or receive process profiles.

Every tool result has one of two shapes:

```ts
type LifecycleSuccess<T> = {
  schema: "omp-lifecycle-result/v1";
  ok: true;
  op: LifecycleCall["op"];
  runId: string;
  data: T;
};

type LifecycleFailure = {
  schema: "omp-lifecycle-result/v1";
  ok: false;
  op: LifecycleCall["op"];
  runId?: string;
  error: {
    code:
      | "INVALID_INPUT"
      | "UNKNOWN_DEFINITION"
      | "PROFILE_UNAVAILABLE"
      | "UNAUTHORIZED"
      | "CAPACITY_REACHED"
      | "ACTOR_BUSY"
      | "ACTOR_TERMINAL"
      | "START_FAILED"
      | "DELIVERY_UNKNOWN"
      | "WORKER_FAILED"
      | "NO_REPLY"
      | "ABORTED"
      | "DISPOSAL_FAILED"
      | "RUN_TERMINAL";
    message: string;
    actorId?: string;
    requestId?: string;
  };
};
```

Operation data is fixed:

- `open`: `{ state: "open"; actors: ActorSummary[] }`;
- `dispatch`: `{ requests: Array<{ requestId; actorId; state: "pending" | "start-failed" | "delivery-unknown"; error? }> }`;
- `observe`: `{ run: RunSummary; actors: ActorSummary[]; requests: RequestView[] }`;
- `dispose`: `{ actorId; state: "disposing" | "disposed" | "failed-cleanup"; descendants: ActorSummary[] }`;
- `abort`: `{ target; state: "aborting" | "aborted" | "failed-cleanup" }`;
- `close`: `{ state: "closing" | "closed" | "failed-cleanup"; unresolvedActors: ActorSummary[] }`.

`RequestView` is `{ requestId, actorId, phase, state, reply?, turn, reuse }`. `reply` is present only to the logical owner that authored that request and is `{ body, acceptedAt }`. `turn` is `"running" | "succeeded" | "failed" | "aborted" | "unknown"`. `reuse` is `"busy" | "ready" | "terminal"`. Root observation of a delegated scope includes only nested actor/request IDs, states, turn/reuse status, and cleanup blockers; it never includes reviewer payloads or grants reviewer admission.

Internally, a Consumer Definition compiles to arbitrary string role/profile identifiers, logical owners, allowed edges, and capacity classes. The generic Lifecycle Supervisor contains no Retrace/Reconcile enum or semantic phase list. Invalid definition output is an implementation defect that fails before effects.

### Capacity and ownership

Retrace's `maxDirectActors: 4` is a consumer policy. The optional normalizer and live scope controllers consume that direct capacity; nested reviewers do not. A disposed direct actor releases one permit while siblings continue. Total live RPC processes are separately bounded by the finite compiled topology.

Standalone Reconcile binds root as owner of A/B. Delegated Reconcile binds the actual scope connection as owner of its A/B, never the outer root. Only the logical owner can dispatch to, observe reply bodies from, or semantically dispose its direct children. Root can observe redacted nested lifecycle state for supervision and can emergency-abort/close its run, but cannot admit or read nested reviewer replies.

`lifecycle_channel` exposes `request`, `reply`, and `dispose` according to the connection's compiled capabilities. A scope uses `dispose` on its exact reviewer subtree and waits for terminal disposal before `reply` publishes `scope-result`. Root then disposes that scope actor and releases its direct capacity. Whole-run close is cleanup for remaining actors, not the only disposal path.

## Request, response, and failure protocol

### Dispatch and partial startup

`dispatch` prevalidates the complete batch and reserves stable request handles before external effects. External launch cannot be atomic. Each target then starts independently:

- successful siblings remain live and their handles remain valid;
- a failed startup becomes `start-failed` on only that handle;
- an unacknowledged prompt becomes `delivery-unknown`, retains the same actor/process and handle, and is never resent;
- one failure does not cancel, discard, or relabel successful sibling work;
- the result accounts every authored call in order.

This preserves the inherited controlled sibling-capture obligation: independently successful scopes remain observable and usable when another scope fails. The controller may continue authorized independent work or explicitly abort/dispose affected actors; the plugin never selects a semantic winner.

Distinct targets may run concurrently. One actor has at most one delivered turn. After its reply is accepted but before `agent_end`, one later authorized request may reserve a handle in `pending` state and wait for the same actor to become reusable; it is not delivered early. If that actor becomes terminal, the reserved request fails `ACTOR_TERMINAL` without launch or replacement.

### Authoritative reply and turn outcome

The supervisor injects the request envelope into the worker prompt and registers `lifecycle_channel` through `RpcClient` custom tools. Connection identity plus the actor's current request is authoritative; model-supplied owner or actor metadata is neither required nor trusted.

The first accepted `lifecycle_channel.reply` body is retained byte-for-byte and immediately changes the request from `pending` to `replied`. That reply is immediately owner-observable; it does not wait for `agent_end`. Prompt acknowledgement, assistant output, local echo, message history, status notification, and inferred content never supply a reply.

The actor remains `finishing` until `agent_end`. A later successful end makes it reusable; a failed end, observed process exit, or abort makes it terminal. The already retained reply remains authoritative in every branch, while `turn` and `reuse` report the later outcome separately. No later response overwrites it. `agent_end` without an accepted reply is `NO_REPLY`. If abort occurs after reply, the owner still receives that reply with `turn: "aborted"` and `reuse: "terminal"`.

Each actor generation has one process record `{ pid, exited, exitIntent, settled }`. The callback retains it before startup can settle and immediately attaches one success/rejection continuation to the same `exited` promise. All `RpcClient.start()` rejection, RPC/event failure, `agent_end`, explicit abort/close, and child-exit paths converge on idempotent generation-checked transition functions. A stale generation or already-settled transition is ignored. No race may emit a second terminal wake, overwrite a reply, free capacity twice, resolve cleanup early, or relabel an expected stop as unexpected.

The required cases are:

- a synchronous spawn throw has no PID and yields `START_FAILED`; a spawned child that exits before ready retains its exact PID, settles startup once as `START_FAILED`, and is observed as exited;
- an unexpected exit after prompt acknowledgement but before `agent_end` makes the actor terminal and the current turn failed; without a reply the request reports `WORKER_FAILED`, while an already accepted reply remains owner-visible with failed turn and terminal reuse;
- reply-then-exit never becomes `NO_REPLY`, never erases or replaces the first reply, and never makes the actor reusable;
- an unexpected exit with one reserved successor fails that successor once as `ACTOR_TERMINAL` without delivery, launch, resend, or replacement;
- explicit abort, actor/subtree disposal, run close, and session shutdown set the generation's expected `exitIntent` before requesting RPC abort or calling `RpcClient.stop()`; the same exit observer records the terminal exit, and successful cleanup waits for that observation;
- if termination refuses or exit never settles, cleanup is `failed-cleanup`, capacity and retained state remain held, and the result includes the exact unresolved actor ID and retained PID. A controlled refusal double may prove only this noncooperation branch.

A terminal actor continues to hold its owner's capacity and retained reply buffer until that owner explicitly disposes it (or run close does so) and the retained process record observes exit. Failure never silently frees a slot, transfers ownership, or makes a replacement actor eligible.

Valid unrecognized RPC/session events are ignored or forwarded by the stock client. Only frame-decoder rejection, advertised-limit violation, impossible correlated response, stdout/process loss, or host-tool protocol failure is a transport failure; ordinary interleaving or extra metadata is not.

### State model and guards

Run states are `open -> active -> closing -> closed`, with `failed-cleanup` terminal. Actor states are `declared -> starting -> idle -> running -> finishing -> idle`, with `failed`, `disposing`, `disposed`, and `failed-cleanup` terminal or cleanup states. Request states are `pending -> replied`, `pending -> failed|aborted`, with turn outcome tracked independently.

Guards defend actual behavior:

- complete named-definition and semantic-binding validation before effects;
- exact root/owner/target identity from the session or RPC connection;
- selected known profile and required capability availability;
- one delivered turn per actor and one reserved successor at most;
- immutable first reply and owner-only body visibility;
- protocol v2 framing and advertised size limits;
- direct-capacity and finite-topology limits;
- no request after actor/run terminal state;
- owner-scoped dispose and emergency run-wide abort/close;
- observed process exit before successful disposal.

Guards do not pin version strings, incidental event order, formatting, receipt wording, notification order, harmless metadata, or implementation-private collection shapes.

## Liveness, observation, abort, and disposal

The **pending until explicit abort** policy and the plugin-owned periodic pending wake were selected in the 2026-09-18 interview (`01a0b2c7`), as settled by its ask results and accepted correction exchange. The unconfirmed interview summary is not authority. This attribution does not extend to the separate reply-versus-`agent_end` design fact.

A request leaves pending state on exactly one of:

1. its first authoritative `lifecycle_channel.reply` is retained;
2. a concrete terminal worker/RPC failure proves that no reply was retained; or
3. the bound caller or user explicitly aborts it.

Elapsed silence is not failure. There is no request timeout, inactivity deadline, five-minute stop, automatic retry, resend, replay, re-emission, actor replacement, or unattended-termination guarantee.

Pending work remains usable:

- root `dispatch` returns immediately;
- `observe` and `/lifecycle status` expose root-owned results plus redacted descendant state;
- `abort` and `/lifecycle abort` remain callable while work is pending;
- accepted reply and terminal failure each produce one compact ID/status-only wake message;
- actor reuse becoming ready or terminal produces a compact state-change wake when a successor is reserved;
- while any request is pending, the plugin emits exactly one compact ID/status-only wake per fixed interval, default five minutes; elapsed intervals and their wakes mutate no request, actor, or run state;
- consuming skills never manage Eval capacity, async jobs, `hub wait`, polling loops, or timer ownership.

Deliver status wakes through `sendMessage(..., { deliverAs: "aside" })`, never `appendEntry`, which is persistence-only and is not sent to the model. A periodic pending wake is not a timeout, deadline, abort, replacement, or `lifecycle_channel.reply`, and must never be admitted as a report. An idle aside may start a turn regardless of `triggerTurn`; a turn started by the periodic wake may only observe status. The compact payload must state that observation-only restriction and disclose no reply body. Timer ownership remains inside the plugin.

Each periodic wake can therefore consume an idle controller turn. A longer fixed interval is the cost control if the default is noisy; do not substitute polling, duplicate replies, or dropping the status duty. If the host cannot provide safe aside or next-turn delivery, return to specification under **Notification reentrancy** rather than weakening these constraints.

Owner-scoped `dispose` waits for every selected descendant's retained `exited` promise to settle before reporting `disposed`. For delegated Reconcile the scope connection disposes reviewers before sending `scope-result`; for Retrace root disposes each completed scope independently and releases its direct permit only after that scope's observed exit while siblings continue. Run close disposes remaining descendants before ancestors.

Explicit abort authorizes mechanical termination only. The supervisor marks the exact process generation's exit as expected, requests RPC abort where applicable, then uses `RpcClient.stop()` with its configured short termination grace and awaits the already-retained `exited` observation. That post-abort cleanup escalation is not a request timeout and grants no continuation or replacement. Session shutdown invokes run close. A forced host death or noncooperating termination may prevent an in-session success observation and must remain `failed-cleanup` with the exact unresolved PID.

No lifecycle state, reply, transcript, or workflow record persists across runs. The plugin retains active-run data in memory, stores each reply body once, bounds processes by the compiled definition, releases buffers at owner disposal, and never uses repository files as a ledger or recovery source.

## Semantic ownership

### Plugin-owned mechanics

The plugin owns only:

- named Consumer Definition validation and internal topology construction;
- source-grounded agent-profile resolution and stock RPC construction;
- persistent actor sessions and owner-scoped capacity;
- logical caller/owner/target binding from physical connections;
- request correlation, sibling accounting, partial startup, and state transitions;
- exact first-reply retention and reply-versus-turn separation;
- owner-only reply visibility and redacted ancestor status;
- compact readiness notification, inspection, abort, actor/subtree disposal, and run close;
- process/RPC failure classification without semantic repair.

### Skill-owned semantics

Retrace and Reconcile continue to own:

- human approval and scope/candidate authority;
- evaluand, evidence, and artifact identity;
- when a role should be asked and the exact semantic payload;
- readiness meaning and response grammar;
- A-first initial review and the one same-A rethink after the first admitted reply;
- whether B is needed, remaining findings, A/B proposal exchange, and semantic liveness stops;
- original-A closure and correction/application limits;
- report admission, candidate mutation, validation, freshness, presentation, and every approval boundary;
- no semantic retry, replay, actor replacement, fabricated reply, or authority widening.

Transport replacement must not convert mechanical failure into semantic correction, reset an allowance, start a new actor, or infer a response. Existing semantic responsibilities survive even when their old task/hub expression is deleted.

### Locator-hash admission

Content identity remains lowercase SHA-256 of the complete frozen UTF-8 record
bytes. Producers publish receiver-readable locators; receivers re-read and
hash the referenced records rather than admitting agent-typed digest echoes.
Retrace's **Content and return transport**, **Closed return bodies**, and
**Delegated control body** own the exact field order and kind mapping; Reconcile
and its reviewer protocol consume those bindings without a parallel identity
grammar or a new store.

- Content records begin with `Kind: {kind}`, checked against the referencing
  field. Parent-known normalization input, scope approval and scope contract
  also require the exact locator and hash of the parent's request-local freeze.
  A new record binds on its first successful locator hash; the parent retains
  that publish-time hash. Any later read of that locator must match or stop as
  drift, never silently rebind. Owned filesystem records are write-once;
  `0444` is the OMP/proof method, not a skill-wide transport requirement.
- `scope-proposal`, `candidate-ready` and `scope-result` carry locators and
  low-entropy role/scope/status fields only; remove digest fields rather than
  making them optional. The result payload references records by locator too.
  Record headers remain part of the hashed content, not spliced body content.
- `begin-reconcile` copies locators from the admitted freeze. Its
  `Authorization locator` resolves to the parent's frozen admitted
  `candidate-ready` body; that exact body's first line `candidate-ready` is its
  kind header, without a wrapper or extra header. The scope hashes and checks
  those bytes against its corresponding published reply and approved binding.
- Reviewer replies contain no echoed `Candidate:` identity. Current working
  identity stays bound by the connection-owned request and controller packet.
  Synchronization copies the admitted response verbatim with no added
  current-identity field; all six provenance roles remain. Protocol bootstrap
  and review packets provide the protocol locator, not a retyped digest.
  Controller and reviewers hash that file, check its existing protocol heading,
  retain the binding and reject drift.

Correctability, not digest entropy, governs this change. A wrong or unreadable
locator, wrong kind/field association, or wrong parent-known locator can fail
loudly and use Retrace's existing **One corrective allowance per original
return** when the same nonterminal actor, connection and approved state remain
available. Actual drift at a bound locator stops. A typed digest mismatch would
instead make transcription indistinguishable from changed content.

The proof must implement that single parent-owned corrective request across
format, identity, applicability and eligible actor-turn failure; it must not
hard-assert `reply.body === commandedBody` to demand hex transcription. The
original and corrective requests each retain their own connection-bound first
reply and share the original expectation's one correction budget. A finishing
actor may reserve that request but receives it only when reusable. Correct
only the named return defect: no reevaluation, replay, findings/evidence
rewriting, new loop, allowance reset, or actor replacement. Failed correction
or unavailable required state stops. No body correlation token or alternate
return source is introduced.

## Migration and clean cutover

Future implementation must migrate all OMP callers in one approved plan. No compatibility shim, task/hub fallback, dual transport, deprecated alias, or observer-only path remains for Retrace/Reconcile.

The original v5 cutover sequence required the pre-cutover native plugin proof before executable consumer migration, followed by projection/canonical assembly and the separately gated migrated-path proof. The v6 contract-only amendment has separate human authority as bounded above; it neither repeats that sequence nor authorizes native execution.

| Target | Required disposition |
|---|---|
| `.config/agents/harnesses/omp/extensions/lifecycle-plugin.js` | Revise the existing candidate only as needed to expose the exact public tool/command Adapter; preserve inert loading. |
| `.config/agents/harnesses/omp/extensions/lifecycle-supervisor.js` | Correct the existing candidate to use the fixed stock `RpcClientOptions.spawn` callback, immediate PID/exit capture, idempotent process observation, and exact cleanup reporting while preserving the private proof-only constructor and fixed mechanical-probe prompt for T2. |
| `.config/agents/harnesses/omp/extensions/lifecycle-consumers.js` | Preserve and finish the two narrow named Consumer Definitions and source-grounded profile resolver; keep semantic workflow decisions out. |
| `.config/agents/harnesses/omp/extensions/lifecycle-read-verbatim.yml` | Preserve the fixed `read.summarize.enabled: false` overlay used only for selected discovered profiles that require verbatim reads. |
| `.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js` | Revise deterministic public-contract/state/process tests so fake processes use the same fixed spawn callback and real stock `RpcClient` framing; use a controlled refusal double only for cleanup noncooperation. |
| `.config/agents/harnesses/omp/extensions/fixtures/lifecycle-rpc-worker.js` | Make the deterministic fixture executable as test-owned `omp` while preserving real RPC framing and no model/account effects. |
| `.config/agents/harnesses/omp/extensions/package.json`, `bun.lock`, `tsconfig.json` | Declare the already-pinned `@oh-my-pi/pi-utils` package only as required for the documented direct import and refresh the lock; change TypeScript configuration only if the documented exports require it. Add no new library. |
| `.config/agents/harnesses/omp/config.yml` | Preserve exactly one inert extension load and existing extension order unless a demonstrated collision requires a documented order. |
| `.config/agents/skills/retrace/SKILL.md` | Use named `retrace` lifecycle calls and locator-hash closed bodies while preserving scope/evidence/aggregation semantics, the one parent-owned correction and four-direct-actor capacity. |
| `.config/agents/skills/reconcile/SKILL.md` | Use standalone/delegated `reconcile` lifecycle calls; align delegated locator-hash admission, protocol bootstrap and synchronization while preserving the controller loop and limits. |
| `.config/agents/skills/reconcile/references/reviewer-protocol.md` | Use connection-bound `lifecycle_channel`, locator-bound protocol bytes and reviewer replies without a Candidate echo; preserve verdict/pass semantics and role behavior. |
| `.config/agents/skills/reconcile/references/execution-flow.md` | Update the non-runtime human map to the new mechanical Seam without making it executable authority. |
| `.config/agents/references/agent-return/return.md` | Replace only the Retrace/Reconcile-specific lifecycle-observation-slot and proof-export requirements with host-plugin ownership. Preserve the completed generic declared-body, candidate/Handoff collection, provenance, exact-body-restatement, retention, authority, and recovery clauses byte-for-semantics. |
| `.config/agents/harnesses/omp/agent-return.md` | Add the lifecycle plugin Adapter, reply/turn distinction, owner visibility, pending/abort, capacity, exit observation, and disposal. Preserve the completed generic implementation candidate/Handoff collection and native-observation surfaces byte-for-semantics. |
| `.config/agents/harnesses/omp/agents/second-opinion-a.md`, `second-opinion-b.md` | Replace hub transport instructions with bound host-tool reply/dispose behavior; preserve models, tools, read-only role, and reviewer semantics. |
| `.config/agents/skills/retrace/evals/evals.json` | Migrate transport fixtures and retain all 21 current case IDs and behavioral intent. |
| `.config/agents/skills/reconcile/evals/evals.json` | Migrate transport fixtures and retain all 12 current case IDs and behavioral intent. |
| `.config/agents/skills/dev-ask/SKILL.md`, `WORKFLOW.md`, `references/execution-flow.md`, `.config/agents/skills/dev-implementation/SKILL.md` | Preserve the completed generic collection cutover. Update only still-stale explicit Retrace/Reconcile external-owner, five-minute, lifecycle-slot, proof-export, and task/hub projections to the plugin seam. |
| `docs/adr/0010-replacement-lifecycle-plugin.md`, `docs/adr/INDEX.md` | Create the narrow active architecture decision and make it discoverable while preserving current generic collection decision text and all unrelated history. |

Repository inspection finds one host adapter, `.config/agents/harnesses/omp/agent-return.md`; there is no Grok return adapter. The completed generic collection clauses in both return contracts and the five T4 projection files are current baseline, not remaining plugin work. T3 owns only executable consumer/producer contracts plus lifecycle-slot/proof-export and host-adapter migration. T4 owns only catalogs, the later human/workflow plugin projections, ADR/index, and the authorized historical-plan disposition. No exact target moves between T3 and T4, and no target appears in both tasks.

No new phrase blacklist or source-text test is added. Existing structural checks that only pin obsolete transport wording must be migrated to observable fixture behavior or deleted under the permanent-test value policy.

### Existing artifact disposition

- `.agents/artifacts/2026-09-18_layer1-tier1-lifecycle-proof-spec.md`, revision `layer1-tier1-lifecycle-proof/spec-v2`, SHA-256 `5ed8fd60097f0a7ec52633d1a4600d98b135ba1396a39d1dad21e624b7333f5f`, remains immutable historical/source evidence.
- `.agents/artifacts/2026-09-15_transport-capture-supervision-spec.md` and `.agents/artifacts/2026-09-17_stock-current-waited-transport-spec.md` remain immutable historical evidence.
- `.agents/plans/2026-09-18-1411_layer1-tier1-lifecycle-proof.md` must not execute. Explicit human authority to set it to `CLOSED` with the concise reason “superseded before execution by replacement lifecycle plugin” was granted 2026-09-18. T4 owns that disposition during approved implementation; this planning revision does not perform it. Keep the current path, no `Completed At`, no Completion Summary, no archive, and no completed-task claim.
- The new implementation plan becomes the sole future execution authority only after normal plan approval. This specification alone does not supersede plan lifecycle state.

## Evaluation accounting

The current catalogs contain exactly **33** cases: **21 Retrace + 12 Reconcile**. Every ID remains present; no superseded lookup/replay case is revived.

### Retrace — 21 retained IDs

`RETRACE-STATIC-NO-EXECUTION`, `RETRACE-ZOOM-OUT-DISCOVERY-GAP`, `RETRACE-ZOOM-IN-INSTRUCTION`, `RETRACE-VALID-OUTCOME-HARNESS-WASTE`, `RETRACE-REDESIGN-QUALIFIED`, `RETRACE-REDESIGN-GATE-MISSING`, `RETRACE-UNRELATED-ISSUE-EXCLUDED`, `RETRACE-FICTIONAL-HARNESS-PORTABILITY`, `RETRACE-NO-PERSISTENCE-PROBE`, `RETRACE-HISTORY-GAP-GONE`, `RETRACE-HISTORY-FAILED-FIX`, `RETRACE-HISTORY-NOVEL`, `RETRACE-HISTORY-UNBOUND`, `RETRACE-EXPLICIT-ONLY`, `RETRACE-SCOPE-APPROVAL`, `RETRACE-SCHEDULING`, `RETRACE-DELEGATED-REVIEW`, `RETRACE-REVIEWED-BLOCKER`, `RETRACE-FINAL-FRESHNESS`, `RETRACE-SYNTHESIS`, `RETRACE-QUIESCENCE`.

The first fifteen preserve intake, evidence, scope, read-only, portability, persistence, history, and explicit-use intent. `RETRACE-SCHEDULING` preserves four-direct-actor capacity, dependency order, sibling capture/fault isolation, and exact capacity release. `RETRACE-DELEGATED-REVIEW` preserves scope ownership of persistent A/B, same-A rethink, owner-only authoritative replies, reviewer-before-scope disposal, and root redaction. The final four preserve truthful blocker aggregation, freshness, synthesis authority, and quiescent pending/abort behavior.

### Reconcile — 12 retained IDs

`REC-ORDER-AUTHORITY`, `REC-PARENT-TIMED-FOLLOW-UP`, `REC-SEMANTIC-REVALIDATION`, `REC-VERDICT-PROGRESS-STOPS`, `REC-ARTIFACT-CUMULATIVE-CAP`, `REC-SYNC-REPAIR-RESUME`, `REC-ARTIFACT-TERMINAL-FRESHNESS`, `REC-TERMINAL-CLEANUP-CAPABILITY`, `REC-IRC-REPORT-TRANSPORT`, `REC-CURRENT-WAITED-REPORT`, `REC-TRUSTED-RETRACE`, `REC-DELEGATION-REJECT`.

All semantic negotiation, mutation, cap, repair, freshness, delegation, and rejection assertions remain. The two transport-named cases keep their behavioral intent but are rewritten around connection-bound owner identity, exact first accepted reply, separate turn/reuse outcome, pending inspection/abort, partial sibling accounting, and exact owner-scoped disposal. They must not continue to require `details.waited`, hub receipts, launch/roster slots, or caller-owned five-minute observation after cutover; the plugin-owned periodic status duty remains.

For `REC-IRC-REPORT-TRANSPORT` and `REC-CURRENT-WAITED-REPORT`, migration evidence must map every retired transport assertion one-to-one to its replacement assertion. The one code review reviews that map as part of changed-assertion accounting. It is review evidence, not a new permanent repository artifact; the 21/12 case identity requirement is unchanged.

The repository contains catalog JSON but no configured executable skill-evaluation runner or command. This specification therefore does not invent one or claim that all 33 cases execute. Implementation acceptance proves exact ID/schema preservation and reviewer-inspected semantic projection. Any later model-driven execution of the 33 cases requires a separately named evaluator, fixtures, model/account effects, and human authorization. The two native runs remain integration evidence only.

## Proof strategy

Permanent tests belong only at the stable plugin Interface and process/state boundaries. The focused suite uses independent behavioral oracles. Its real fake-process smoke routes deterministic processes through the same fixed production spawn callback by supplying a test-owned executable named `omp` in the private constructor environment; stock `ptree.spawn`, the unchanged stock child handle, and stock `RpcClient` perform framing and lifecycle work. A controlled `RpcAgentProcess` refusal double is limited to the cleanup-noncooperation branch. Tests do not assert source wording, incidental event order, copied configuration fields, or mock echoes.

The suite covers:

- null/incomplete named-definition input launches no process;
- consumer compilation catches invalid topology/capacity before effects while harmless metadata remains harmless;
- profile discovery resolves current named agent definitions or fails before effects;
- the fixed callback receives only `agentArgs`, launches `["omp", ...agentArgs]` with the bound cwd, `{ ...Bun.env, ...env }`, and piped stdin, then returns the same stock child while the supervisor has already retained its PID and `exited` promise;
- fake-process construction carries the discovered `systemPrompt` for production `open` and the mechanical-probe prompt only under the proof-only constructor;
- real stock `RpcClient` v2 framing and request IDs survive valid interleaved events and lossless large replies without any second stdout reader;
- acknowledgement and assistant text cannot become a reply;
- connection identity prevents impersonation, stale/double reply, unauthorized observation, and undeclared child calls;
- distinct actors overlap; one actor has one delivered turn and at most one reserved successor;
- a worker persists across sequential requests;
- startup exit, post-ack/pre-`agent_end` exit, reply-then-exit, reserved-successor exit, and explicit abort/close races settle once with the specified request, actor, reply, turn, reuse, and wake results;
- first reply becomes immediately owner-visible, remains hidden from ancestors, and survives later turn failure/abort/exit;
- partial startup retains successful sibling handles and exact failed/unknown handles without cancellation or replacement;
- direct capacity excludes nested reviewers and is released only by exact scope disposal after observed exit;
- scope-owned reviewer disposal completes before scope reply; completed scopes can dispose while siblings continue;
- silence remains inspectable pending until explicit abort, with exactly one compact ID/status-only periodic wake per simulated interval and no request, actor, or run state mutation;
- abort, actor/subtree disposal, run close, and session shutdown terminate only exact owned processes; controlled refusal retains the exact unresolved actor/PID and reports `failed-cleanup`.

After deterministic tests pass, T2 uses only T1's proof-only constructor for ephemeral in-session `open`/`dispatch` against the existing named `retrace` definition, with literal non-semantic request bodies. That definition lives in T1's `lifecycle-consumers.js`, not `retrace/SKILL.md`, and already compiles nested `reconcile` A/B; using it before cutover consumes no migrated prose. The constructor applies the fixed mechanical-probe prompt to every participating normalizer, scope, and reviewer worker. A standalone-only `reconcile` root cannot substitute because it has no scope actor or direct-capacity permit. There is no third consumer definition, additional repository file, or T2 repository write.

This run exercises persistence, first-reply authority, owner-only visibility, independently captured sibling results, reviewer-before-scope disposal, capacity release, and inspection followed by explicit abort of an ordinarily pending request without replacement. Partial-dispatch failure branches remain covered by the deterministic fake-RPC suite; native sibling capture does not claim to prove an unexercised failure branch. The throwaway binding is an in-session payload, not a path. Discarding it means disposing that run's state and processes, not deleting the named definition or a repository artifact. This is proof scaffolding, not a compatibility shim, fallback, dual transport, or observer path. It proves mechanics under the probe policy, not production prompt fidelity. A failed pre-cutover proof halts before any consumer contract or projection write.

After executable migration and projection/canonical assembly pass, T5 uses production `open` with exact discovered prompts, never the proof-only constructor, for one post-cutover native run through the real migrated Retrace/Reconcile path end to end. This run establishes production prompt/protocol compatibility: root opens one Retrace scope graph, dispatches a scope controller, the persistent scope invokes distinct persistent A/B only as current Reconcile semantics demand, A performs initial plus same-A rethink, the scope disposes reviewers before publishing one exact scope result, and root disposes that scope.

Each run has its own explicit human gate for its account/model/process effects. Neither run injects a crash, hang, lost reply, or other fault; failure branches stay in the deterministic fake-RPC suite. Neither run stands in for 33 catalog executions.

## Acceptance criteria

### AC-RLP-01 — stock OMP and opt-in boundary

Behavior: The configured extension remains inert until `open`, constructs every worker through the documented stock `RpcClientOptions.spawn` hook and local `ptree.spawn`, and introduces no patch, fork, rebuild, wrapper transport, stdout tee, task/hub fallback, persistent ledger, or alternate return source.

Check: Inspect implementation imports, the fixed private spawn callback, config entry, package metadata, and changed-file map against the pinned `18.2.6` primary sources; expect one inert lifecycle extension, documented `RpcClient`/task-discovery/`ptree` imports, callback-only `["omp", ...agentArgs]` construction with bound cwd, `{ ...Bun.env, ...env }`, and piped stdin, immediate PID/`exited` retention, the same unmodified child returned to the sole stdout reader, and no OMP source/build output, wrapper, fallback transport, or state-file path.

### AC-RLP-02 — named consumer construction

Behavior: `open` accepts only the complete public `reconcile` or `retrace` binding, resolves current named profiles, compiles topology internally, and rejects null/missing/unsafe/invalid bindings before allocating a run or spawning a worker while ignoring harmless metadata. Production `open` passes the discovered `systemPrompt`, and the mechanical-probe prompt appears only under the proof-only constructor.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'compiles named consumers before effects'`; expect invalid variants including `null` to return the specified error with zero spawns/runs, harmless metadata to preserve the same result, and valid standalone, delegated, and Retrace bindings to expose only owner-appropriate actor summaries. Also expect production construction to pass the discovered `systemPrompt` and the mechanical-probe prompt to appear only under the proof-only constructor.

### AC-RLP-03 — complete public Interface and results

Behavior: `open`, `dispatch`, `observe`, `dispose`, `abort`, and `close` use the specified success/failure envelopes and exact operation data; skills never supply graphs, profiles, argv, models, tool lists, prompt files, process factories, or environment overrides.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'implements the complete lifecycle interface'`; expect schema-valid success and every stable error code at its boundary, no extra registered lifecycle tool, and no low-level construction field accepted from a consumer call.

### AC-RLP-04 — ownership, visibility, and capacity

Behavior: Physical session/connection identity enforces declared ownership; standalone root owns A/B, delegated scope owns A/B, root sees only redacted nested status, and Retrace counts at most four live direct normalizer/scope actors independently from bounded nested reviewers.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'enforces owner visibility and direct capacity'`; expect owner-only reply bodies, rejected cross-owner observe/dispose, four direct actors admitted and a fifth refused, nested A/B excluded from that count, and one permit released only after exact direct-actor disposal and observed process exit.

### AC-RLP-05 — authoritative reply and actor outcome

Behavior: The first accepted connection-bound reply becomes immediately owner-visible and remains authoritative through later success, failure, process exit, or abort; turn outcome and reuse eligibility remain separate, startup and post-ack exits settle once, and no acknowledgement/event/transcript/later reply substitutes.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'separates first reply from turn and observed process exit'`; expect deterministic workers to pass through the fixed spawn callback and real stock `RpcClient` framing; exact startup-failure, post-ack/pre-`agent_end`, reply-then-exit, reserved-successor-exit, and explicit-abort outcomes; byte-exact first-reply preservation and ancestor redaction; ignored nonreply sources and duplicate/stale replies; successful reuse only after `agent_end`; `NO_REPLY` only when `agent_end` occurs first; one terminal transition/wake; and no resend or replacement.

### AC-RLP-06 — partial dispatch and sibling capture

Behavior: Batch prevalidation reserves every handle, then non-atomic startup accounts each item; successful siblings remain live when another start or delivery fails, and no handle, retained reply, process, or capacity ownership is lost, replayed, or silently replaced.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'retains successful siblings across partial dispatch failure'`; expect ordered `pending`, `start-failed`, and `delivery-unknown` rows, continued observation of successful replies, unchanged PIDs/handles, no automatic cancellation/retry, and explicit caller control of each frontier.

### AC-RLP-07 — inspectable pending and explicit abort

Behavior: Dispatch returns immediately; silence stays pending without elapsed-time stop; while any request is pending, each fixed interval, default five minutes, produces exactly one compact ID/status-only wake whose payload states the observation-only restriction and mutates no request, actor, or run state, with no body fabrication or nested reply disclosure. Root can inspect redacted state and caller-owned replies, and caller or user can abort the exact request/actor/run without caller-owned Eval/background/timer choreography or replacement.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'keeps silent work pending until explicit abort'`; expect pending after simulated elapsed intervals, ID/status-only wakes carrying the observation-only restriction, exact abort and observed exit, no new PID/request, no body fabrication, and no nested reply disclosure.

### AC-RLP-08 — owner-scoped disposal

Behavior: A scope disposes its reviewers before `scope-result`; root disposes that scope independently while siblings continue; close disposes only remaining descendants before ancestors; expected and unexpected exits are distinguished race-safely; success requires the retained exit observation, and cleanup refusal remains explicit with the exact unresolved PID.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js -t 'disposes observed stock processes before parent replies'`; expect deterministic workers through the same fixed spawn callback and real stock `RpcClient`, reviewer exits before scope reply, direct permit release only after scope exit, unaffected sibling continuation, no unrelated-process signal, cleared owned buffers, idempotent abort/close races, and a narrowly controlled refusal double producing `failed-cleanup` with the exact unresolved actor/PID while retained state and capacity remain held.

### AC-RLP-09 — semantic clean cutover

Behavior: Retrace, Reconcile, reviewer protocol/agents, and return contracts use named lifecycle consumers while preserving A-first/same-A-rethink/B/original-A semantics, correction/application limits, freshness, approval, sibling fault isolation, and no replay/replacement; the already-completed generic candidate/Handoff collection and all other generic portable return consumers remain unchanged by the later plugin migration.

Check: Review the complete changed executable contract set against the post-prerequisite baseline and pinned pre-plugin bytes; expect every old Retrace/Reconcile mechanical obligation either replaced at the OMP Adapter Seam or intentionally preserved as generic semantics, the completed generic collection clauses unchanged, no dual/fallback transport, no new source-wording test, and no unrelated host/caller delta.

### AC-RLP-10 — exact 33-case catalog projection

Behavior: The migrated catalogs contain the same 21 Retrace and 12 Reconcile IDs exactly once, preserve semantic assertions, replace obsolete transport mechanics, and add no lookup/replay revival or claim that an unavailable evaluator ran them.

Check: Parse both JSON catalogs and compare IDs to this specification and the pinned pre-cutover catalogs; expect exact 21/12 identity equality, schema-valid objects, reviewer accounting for every changed assertion, and explicit `not executed` disposition unless a separately authorized named evaluator actually runs them.

### AC-RLP-11 — deterministic plugin proof

Behavior: The focused fake-RPC suite proves the stable plugin and process-observation boundary without model/account effects.

Check: Run `bun test ./.config/agents/harnesses/omp/extensions/lifecycle-plugin.test.js`; expect exit 0, every real fake process launched as test-owned `omp` through the fixed production spawn callback and stock `ptree`/`RpcClient` framing except the isolated cleanup-refusal double, no second stdout reader, no network/model call, and no surviving fake process.

### AC-RLP-12 — canonical cutover and preserved history

Behavior: A new active ADR/index entry owns the replacement architecture; human/workflow projections match the migrated executable seam while preserving the completed generic collection cutover and unrelated generic engineering routes; frozen specifications remain byte-identical; the Tier 1 PENDING plan changes to `CLOSED` only with explicit human authority and no completed-task claim; the approved replacement plan becomes sole future execution authority.

Check: Hash the three frozen specifications, inspect the ADR/index, human/workflow projections, post-prerequisite generic collection clauses, and both plan headers/history, and compare to the bound historical identities; expect exact historical hashes, one discoverable active replacement decision, lifecycle projections matching the migrated executable seam, completed generic collection semantics preserved, authorized Tier 1 `CLOSED` disposition without `Completed At` or Completion Summary, and one approved replacement plan. Standard review and verification remain mandatory workflow stages, not circular acceptance evidence.

### AC-RLP-13 — pre-cutover native plugin proof

Behavior: Only after its separate human gate and deterministic-suite closure, stock OMP demonstrates plugin mechanics before contract cutover through T1's proof-only constructor and ephemeral in-session `open`/`dispatch` against the existing named `retrace` definition with nested `reconcile` A/B and literal non-semantic bodies: persistence, first-reply authority, owner-only visibility, sibling capture, reviewer-before-scope disposal, capacity release, and one explicit-abort branch as integration evidence. Every participating normalizer, scope, and reviewer uses the supervisor-owned fixed mechanical-probe prompt, not a caller-supplied prompt or public flag. No third definition, additional repository file, migrated prose, or injected fault is used; partial-dispatch failure evidence remains in the deterministic suite. T2 does not prove production prompt fidelity.

Check: After separate authorization only, execute the approved pre-cutover native plugin packet through T1's proof-only constructor and the existing named `retrace` definition before any consumer contract or projection write; expect the same worker across sequential requests, the first accepted reply observable before turn completion, owner-only reply bodies and redacted ancestor status, independently retained sibling results, reviewer exits before scope reply, direct capacity released after scope disposal, explicit pending abort with no replacement, all owned processes exited, discarded probe run state, and no catalog-wide claim. Use AC-RLP-06's deterministic evidence for partial-dispatch failure branches rather than injecting a native fault; a failed native proof halts cutover.

### AC-RLP-14 — post-cutover native migrated-path proof

Behavior: Only after its separate human gate and completed contract cutover, stock OMP demonstrates one nested persistent path through the real migrated Retrace/Reconcile consumers using production `open` with exact discovered prompts. Admission hashes referenced frozen records, checks exact bound locators, kinds and enums, retains publish-time hashes and rejects drift without agent-typed digest echoes. The one parent-owned correction per original return remains available under the live Retrace contract, not as replay or reevaluation. This is production prompt/protocol compatibility evidence, with no injected fault, proof-only constructor, or mechanical-probe prompt substitution.

Check: After separate authorization only, execute the approved post-cutover native packet through the real migrated Retrace/Reconcile path using production `open` and exact discovered prompts. Expect locator-hash admission for every exercised return/control body, exact bound locators and kind headers, exact status enums, stable publish-time hashes on later reads, reviewer replies without Candidate echoes and locator-bound protocol bootstrap. Validate the closed grammar and referenced bytes, never require `reply.body === commandedBody` for hex. If an ordinary first return fails and the existing correction predicates hold, issue the single parent-owned correction for that original expectation, retain both request results and continue only after a compliant corrected return; otherwise preserve the exact stop. Account-free grammar fixtures cover the complete scope-proposal/candidate-ready/scope-result/begin-reconcile family plus malformed locators, kind mismatch, bound-byte drift and correction exhaustion; do not inject native faults, add a normalizer solely for coverage, or force a correction on a valid first return. Preserve persistent same-A initial/rethink, only demanded B traffic, reviewer-before-scope disposal, exact scope-result admission, terminal accounting for every original/corrective request, all owned processes exited, and no catalog-wide claim. This revised specification check does not amend or reapprove 0019's currently bound acceptance or grant another native execution.

## Risks and stops

- **Stock export drift:** implementation rechecks the installed `18.2.6` exports before correction. If `RpcClientOptions.spawn`, `RpcAgentProcess`, the root `ptree` export, or required process fields are absent or incompatible, return to specification; do not add a lossy client, wrapper, patch, fork, or output reader.
- **Dual-observer races:** `RpcClient` and the supervisor both observe the same `exited` promise for different responsibilities. The supervisor must use generation-bound idempotent transitions and never consume stdout. Duplicate transition, reply loss, premature cleanup, or missing exact PID stops T1.
- **Profile fidelity:** lifecycle workers intentionally replace task/hub/yield transport tools with `lifecycle_channel`. Production `open` preserves exact discovered prompts. The sole prompt exception is T2's proof-only constructor, which substitutes the supervisor-owned fixed mechanical-probe prompt for every participating actor without changing model selection, read-only tools, or read-verbatim policy. No public flag or caller prompt selects that exception.
- **Control acknowledgement uncertainty:** stock `RpcClient` has bounded startup/command-response checks. A timeout is `DELIVERY_UNKNOWN`, not proof the worker did nothing and not permission to resend.
- **Notification reentrancy:** ID/status-only wakes use `sendMessage(..., { deliverAs: "aside" })`, not persistence-only `appendEntry`; an idle periodic aside may start a turn, restricted to status observation. If the host cannot provide safe aside or next-turn delivery, retain explicit status but return to specification before choosing polling or response duplication.
- **Cleanup:** failed disposal is a visible blocker. Never claim success from an abort acknowledgement, signal send, `RpcClient.stop()` return detached from the retained exit record, missing handle, or ancestor shutdown alone.
- **Completed collection baseline:** generic candidate/Handoff collection changed before this revision and is now settled. T3/T4 must preserve it; any need to revise those generic clauses returns to authority rather than being absorbed into the plugin.
- **Evaluation execution:** no repository runner exists for the 33 catalogs. Do not create an evaluation platform, spend model/account effects, or claim execution without a separately named and authorized evaluator.
- **Portable contract:** repository inspection found no Grok return adapter, but generic consumers share the portable body. Any discovered non-OMP dependency on the removed Retrace/Reconcile custom sections returns to specification.
- **Historical integrity:** the spec-v4 SHA `4403788ee6cb5a44592d677033eed0861a35dfa84491baab8b9387bdbb29e034`, pre-revision plan SHA `9308914299bbe3aa55252cc8c072e47de9810fbba8e56210de00b55bdd074613`, three frozen specification hashes, blocked T1 history, and old Tier 1 plan remain immutable history.
- **Changed-contract continuation approval:** drafting does not authorize further T1 work. The next human execution approval must explicitly grant a special changed-contract continuation; current workflow authority does not classify or grant it as ordinary repair, execution recovery, a fresh attempt, or an automatic allowance. That approval must authorize the still-parked native child `LifecyclePluginInterfaceOwner` (logical `lifecycle-plugin-interface-owner`) to continue original T1 attempt 1 from the admitted v4 candidate under spec-v5; apply one bounded contract-delta correction limited to the stock spawn/PID/exit-observation design and directly affected tests; run the revised T1 checks; and publish one new v5 T1 Handoff under the completed generic collection contract. It must explicitly retire the unadmitted v4 Handoff as non-authoritative for the changed candidate while preserving it as history. It grants no second implementation rethink, no semantic-attempt or allowance reset, no ordinary attempt 2, no replacement child, no native proof, and no work outside T1. Ordinary attempt 2 remains unavailable unless a later required reviewer or verifier finding establishes eligibility.
- **Stops:** halt rather than weaken this specification if bound bytes or acceptance drift, the required parked child becomes unavailable, source capability differs, owner/process identity or cleanup is uncertain, a frozen artifact would change, exact target ownership conflicts, a native run lacks its separate effect gate, or standard review/verification cannot settle the complete assembled target.

## Non-goals

This work does not:

- implement a generic workflow engine, orchestration DSL, inheritance framework, durable actor platform, cross-session resume, or distributed queue;
- change Retrace/Reconcile product meaning, verdict/pass semantics, mutation authority, approval, correction, application or assurance limits; the authorized identity-transport grammar change is only the locator-hash amendment above;
- add semantic retry, replay, response reconstruction, report re-emission, actor replacement, or timeout policy;
- generalize the plugin to unrelated callers during this cutover;
- alter stock OMP source, binary, built-in task/hub behavior, completed generic engineering child collection, or shipping policy;
- treat static source, deterministic fake RPC, the old collector checks, or either native integration run as proof that every semantic eval ran.

## Revision and next owner

`Main` is the concrete receiver of this v6 contract-only amendment. A separately authorized amendment must keep plan 0019's existing identity, explicitly name locator-hash admission and the single parent-owned correction, and obtain reapproval of the changed acceptance before requesting any new native cap. Do not edit that plan, bind a new hash in it, close it, create a successor-close, repair a packet, or replay/re-review under this specification amendment. T1 remains accepted and untouched pending a separate staging decision.

### Prior spec-v5 graph (historical)

The preceding replacement implementation used the following five-task graph. It is retained as history, not as a new grant, task reset, or continuation instruction:

1. T1 — the preserved plugin candidate corrected for the fixed stock spawn callback, immediate PID/exit capture, idempotent process observation, deterministic boundary, and inert config; AC-RLP-01 through AC-RLP-08 and AC-RLP-11. The only eligible owner identity is the still-parked native child `LifecyclePluginInterfaceOwner`, logical `lifecycle-plugin-interface-owner`.
2. T2 — separately gated pre-cutover native plugin proof using the proof-only constructor and existing named `retrace` definition, with only ephemeral in-session binding/process/result/cleanup surfaces; AC-RLP-13.
3. T3 — executable Retrace/Reconcile, reviewer, return-contract lifecycle-slot/proof-export, and OMP lifecycle-adapter seam only; preserve completed generic collection clauses; AC-RLP-09.
4. T4 — catalogs, remaining human/workflow lifecycle projections, ADR/index, and already-authorized Tier 1 `CLOSED` disposition; preserve completed generic collection clauses and do not edit T3 targets; AC-RLP-10 and AC-RLP-12.
5. T5 — separately gated post-cutover real migrated-path native proof using production `open` and exact discovered prompts, with only ephemeral process/result/cleanup surfaces; AC-RLP-14.

Dependencies remain T1 → T2 → T3 → T4 → T5. The existing cohesive slices still fit their real ownership/effect seams; the completed prerequisite neither adds a task nor repartitions the graph. Neither native-proof owner may repair or edit repository files. Standard assurance applies to the final assembled immutable target. This candidate grants no implementation, continuation, native-run, Tier 1 disposition, assurance, Git, or shipping authority.