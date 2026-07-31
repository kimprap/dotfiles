Type: grilling
Parent: [Portable adaptive agent implementation workflow](../map.md)
Blocked by: 07
Status: resolved

## Question

Where is the exact boundary between the shared router and implementation behavior and each harness adapter, what minimum capabilities may the portable workflow request, what sequential or direct fallbacks apply when a capability is absent, and which provider-specific transports, state identifiers, model choices, isolation mechanics, or invocation metadata may an adapter own without leaking into shared skill bodies?

## Answer

The shared workflow owns semantics; each harness adapter owns transport.

```text
shared router/backend
  requests a semantic capability and supplies Task Contract + Context Pack
adapter
  reports availability, selects a verified transport, executes it, and returns Handoff + metadata
```

The adapter is a real seam because OMP, Grok CLI, Cursor, and future hosts expose different invocation, delegation, model-routing, isolation, state, and observation mechanisms. It must remain thin: changing harnesses changes the adapter profile, not the lifecycle, role contracts, gates, or evidence semantics.

### Shared workflow ownership

Portable router/backend and role skills own:

- lifecycle classification and route selection;
- execution-mode semantics and escalation gates;
- product, architecture, scope, destructive, and approval authority;
- planner, worker, verifier, and integrator responsibilities;
- Task Contract, Context Pack, and Handoff semantics;
- dependency readiness and context-carrying rules;
- state-machine meanings, retry/failure semantics, and completion conditions;
- evidence and verification independence requirements;
- capability/risk profiles such as planning depth, implementation complexity, fresh-context verification, safe isolation, durability, and cost sensitivity;
- fallback equivalence requirements and stop conditions.

An adapter cannot reinterpret these contracts, silently weaken them, add provider behavior to the lifecycle, or promote provider state into product/specification authority.

### Adapter ownership

An adapter may own:

- live skill/agent/tool discovery and invocation syntax;
- slash commands, wrappers, provider extension metadata, globs, activation flags, and manual/model-invocation controls;
- mapping portable role/capability profiles to user-configured model roles, concrete models, providers, reasoning levels, and budgets;
- agent/subagent type names and native role configuration;
- prompt/job/session/process/run identifiers and resume tokens;
- synchronous versus asynchronous dispatch, observation, waiting, messaging, cancellation, and timeout mechanics;
- concurrency limits, queues, and rate-limit/provider availability observations;
- branches, worktrees, copies, sandboxes, locks, output transfer, staging, and merge mechanics;
- native state stores, hook/extension names, adapter-owned state paths, and recovery handles;
- concrete tool names, argument schemas, permission mechanisms, environment variables, and credential references;
- browser, web search, repository tracker, vault, debugger, language-server, and other provider-specific transports;
- actual execution metadata used to reproduce or audit an attempt.

These values may appear in adapter configuration and execution evidence. They must not become requirements or prose branches inside shared skill bodies.

### Thin external profiles

Maintain one portable skill body and stable semantic identity. Harness-specific material lives in a thin external profile/configuration or, when a host requires co-located metadata, a generated/provider wrapper that points to the portable skill without copying its procedure.

- Portable `SKILL.md` frontmatter uses only standard fields needed by all supported hosts.
- Provider-specific invocation flags and spellings belong to the adapter profile or wrapper.
- Do not maintain OMP-, Grok-, Cursor-, Claude-, or Codex-specific copies of the router/backend workflow.
- A provider wrapper may adapt discovery or invocation only; it cannot add a second semantic implementation.
- Exact local directories/files and migration mechanics remain for the inventory and cutover tickets.

### Adapter interface

The portable workflow depends on four conceptual adapter operations. A synchronous host may collapse dispatch and observation into one call.

```text
profile() → Capability Profile
dispatch(Task Contract, Context Pack, Role Profile) → Attempt Handle | Handoff
observe/control(Attempt Handle) → Attempt State | Handoff
recover(Run Reference) → Logical Graph + Attempts + Handoffs
```

- `profile` is mandatory.
- `dispatch` is mandatory for any executable route.
- `observe/control` is required only for asynchronous or cancellable work.
- `recover` is required only for work claiming durable recovery.

Concrete method names and tool calls are not portable. The interface describes the information and guarantees crossing the seam.

### Runtime Capability Profile

At route/execution time, the adapter reports each capability as:

```text
native | contract-equivalent | unavailable
```

It also reports relevant constraints: concurrency, duration, persistence scope, mutation permission, isolation strength, available role/model bindings, network/tool availability, and whether the capability was verified live or inferred from configured documentation.

User configuration may:

- select or disable available transports;
- bind portable role profiles to concrete models/roles;
- lower concurrency/cost/risk limits;
- supply an additional external adapter.

Configuration cannot manufacture a capability. A failed live probe or unavailable loaded transport overrides an optimistic declaration unless another verified equivalent is supplied.

Filesystem presence is evidence only, never proof that a skill, plugin, tool, role, or extension is loaded and invocable.

### Minimum core capabilities

Every route requires:

1. **Capability reporting** — enough truth to select a safe route before execution.
2. **Explicit decision gate** — pause and receive unambiguous approval; host permission/yolo/always-approve settings do not count as workflow approval.
3. **Authority access** — read the current governing artifacts, project rules, and named dependency handoffs.
4. **Revision identity** — bind inputs and outputs to a revision, digest, or equivalent immutable identity; Git is not required.
5. **Single-role execution** — run or directly perform one bounded role under a Task Contract and Context Pack.
6. **Evidence observation** — exercise the requested scenario/check and capture an observed result.
7. **Structured return** — deliver the portable Handoff without silently dropping required fields.
8. **Honest failure** — surface unavailable tools, permission denial, transport failure, stale authority, and partial output.

Mutation additionally requires a safe target-write capability that preserves unrelated user work and respects ownership. A host lacking it is read-only for that target.

### Optional capabilities

The workflow may request these only when the chosen route needs them:

- fresh isolated role context;
- read-only verification against an exact target;
- independent concurrent dispatch;
- dependency-aware scheduling;
- operational role/coordinator messaging;
- collision-safe write isolation;
- separate output lineages and neutral combination;
- asynchronous observation and cancellation;
- durable graph/attempt/handoff persistence and recovery;
- bounded recursive subplanning;
- external research/search/browser/vault access;
- tracker mutation and native dependency/claim support;
- language-aware code intelligence, debugging, or other task-specific tools.

The route overview discloses material substitutions or unavailable optional capabilities that change the proposed route.

### Transport precedence

For each requested capability:

1. use a currently loaded, live-verified host-native skill/agent/tool when it satisfies the portable contract;
2. otherwise use a direct contract-equivalent implementation through available tools;
3. otherwise choose a safe route downgrade/fallback;
4. if no contract-equivalent route exists, stop and report the missing capability and nearest safe route.

Do not emulate a working native facility merely for uniformity. Do not assume a native facility is equivalent because its name sounds similar.

### Model and role binding

Shared tasks declare only a role plus a capability/risk profile. The user owns the concrete mapping in each harness adapter.

Example semantic requests:

- high-depth planning with enough context for a stable task graph;
- bounded implementation at a stated complexity/risk;
- fresh independent verification;
- neutral integration with repository/tool competence;
- read-only primary-source research;
- inexpensive mechanical processing.

The adapter selects from user-configured model roles or host defaults, records the actual model/provider/reasoning selection as execution metadata, and reports when no suitable binding is available.

Using the same model for worker and verifier is allowed when the verifier still has a separate fresh context, role, attempt, immutable target, and independent evidence. Different-model diversity is optional adapter policy, not a shared semantic requirement.

### Persistence and recovery

Full orchestration qualifies as recoverable only when the adapter can reconstruct:

- the logical task graph and task revisions;
- runtime states and attempts;
- authority/dependency revisions;
- handoff locations and exact output lineages;
- integration status;
- terminal evidence and unresolved failures.

An inspectable host-native durable store satisfies this contract. Otherwise the adapter persists a portable projection outside canonical product/specification authority. Do not duplicate native and portable runtime state unless a concrete recovery need justifies it.

Opaque job IDs alone do not qualify. Runtime state may disappear after direct or bounded in-context work only when the governing artifacts and final handoff are sufficient to establish the result.

### Isolation contract

The shared backend requests properties, not Git commands:

- owned writes cannot collide undetected;
- unrelated and pre-existing user work is preserved;
- each output lineage has an exact identity;
- the integrator can receive every required verified lineage;
- abort/retry does not silently overwrite another attempt.

The adapter may satisfy this with branches/worktrees, sandboxes, copies, transactional stores, locks, or safe sequential execution. It may not stash, reset, overwrite, or discard user work merely to manufacture a clean environment.

### Fallback matrix

| Missing capability | Safe portable fallback | Required consequence |
|---|---|---|
| Native skill/agent invocation | Direct contract-equivalent execution | Preserve the same role, artifact, gate, and evidence contract; disclose material substitution |
| Delegation/subagents | One-owner execution, or separate sequential attempts when the host can still provide the required context separation | Do not claim batch/orchestration if roles were collapsed |
| Parallel dispatch | Sequential ready-frontier execution | Preserve task ownership, blockers, handoffs, and integration checks |
| Peer messaging | Backend passes declared handoffs and operational alerts | No semantic sibling negotiation is lost because it was never allowed |
| Safe concurrent isolation | Sequential mutation in one workspace when ownership and user-work safety remain valid | Otherwise downgrade to one owner or stop |
| Git branches/worktrees | Another collision-safe lineage mechanism, or safe sequential execution | Git-specific artifacts are never required |
| Durable inspectable state | Direct or bounded work that completes within the current recoverable context | Full orchestration is unavailable |
| Async observation/waiting | Synchronous bounded dispatch | Long-running unattended orchestration is unavailable |
| Cancellation/control | Bounded synchronous execution | Do not start work whose safe operation requires cancellation |
| Fresh read-only verifier | A verified external/manual adapter providing the same separation | Otherwise stop; worker self-review is not independent verification |
| Separate model binding | Harness default model in the required separate role/context | Record the selection; model diversity is optional |
| Revision identity | Content digest or other immutable identity | Multi-attempt verification/integration stops if no stable identity exists |
| Mutation permission | Read-only analysis or explicit human/manual mutation step | Do not claim implementation completion |
| Search/browser/vault/research transport | Another cited primary-source transport, omit truly optional research, or a precise manual prerequisite | Do not fabricate unavailable evidence |
| Explicit approval channel | Persist a pending gate for later human response | No route executes until unambiguous approval arrives |

### Hard invariants

No fallback or user-facing label may weaken:

- explicit route and material-decision approval;
- current canonical authority and human-owned decisions;
- preservation of unrelated user work;
- task ownership and dependency safety;
- observable evidence;
- fresh-context, immutable-target independent verification;
- required durability/recovery for full orchestration;
- neutral integration where multiple lineages exist;
- honest completion and residual-risk reporting;
- exclusive human ownership of user-level `AGENTS.md`.

When a host cannot preserve one of these guarantees, the adapter stops at the seam. It reports what is unavailable, what was verified, and the nearest safe route; it never silently converts a weaker run into a compliant one.
