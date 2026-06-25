# Flue OMP Integration Implementation Plan

**Datetime**: 2026-06-24-1720
**Scope**: Cloudflare-targeted Flue coding harness primitives, OMP hashline safety, shadcn-style recipe distribution, and optional docs previews.
**Summary**: Build a Flue-native safe file-editing lane by vendoring OMP `packages/hashline`, adding Cloudflare/Flue adapters and OMP-style `read/search/find/write/edit` sandbox tools, then distribute higher-level agents as shadcn-compatible source recipes. Keep full OMP runtime features as an external coarse-grained job backend, not as Worker-native tool-by-tool ports.
**Status**: PENDING

## Context

The literal ask is to turn the prior Flue + OMP + agentcn architecture discussion into an implementation plan. The intended end state is a Cloudflare-compatible Flue harness whose normal file editing path is native to Flue and uses OMP hashline safety properties: content-hash anchors, stale-edit recovery, and seen-line provenance. The plan also carries forward agentcn's useful Flue-facing pattern: a shadcn-style recipe registry where installable agent recipes are source-owned by the consumer, plus an optional docs preview layer that is not part of the core runtime.

Grounded references used for this plan:

- OMP hashline reusable core: `https://github.com/can1357/oh-my-pi/blob/main/packages/hashline/README.md`, `src/patcher.ts`, `src/snapshots.ts`, `src/recovery.ts`, `src/fs.ts`, `src/prompt.md`.
- OMP coding-agent breadth and Bun/runtime coupling: `https://github.com/can1357/oh-my-pi/blob/main/AGENTS.md`, `https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/DEVELOPMENT.md`.
- Flue Cloudflare and sandbox surfaces: `apps/docs/src/content/docs/api/sandbox-api.md`, `apps/docs/src/content/docs/api/agent-api.md`, `examples/cloudflare/src/sandboxes/cloudflare-shell.ts` in `withastro/flue`.
- agentcn registry/docs pattern: `scripts/build-registry.mts`, `registry/flue/chat-with-youtube/registry.json`, `content/docs/agents/flue/chat-with-youtube.mdx`, `components/agent-preview.tsx`, `app/api/preview/[framework]/[agent]/route.ts` in `shadcn-labs/agentcn`.
- shadcn registry schema: `https://ui.shadcn.com/docs/registry/registry-json` and `https://ui.shadcn.com/docs/registry/registry-item-json`.

## Tasks

- [ ] Vendor upstream OMP hashline into an isolated read-mostly subtree.
- [ ] Add the `flue-hashline` package with Cloudflare/Flue adapters and bounded durable snapshot storage.
- [ ] Implement OMP-style model-facing file tools as Flue sandbox session tools.
- [ ] Wire hashline tools into Cloudflare Shell sandbox without replacing the existing `code` tool.
- [ ] Add conformance and integration tests for hashline safety and tool output contracts.
- [ ] Add shadcn-compatible Flue recipe registry build and one smoke-test recipe.
- [ ] Document install, usage, and maintenance procedures for the native harness lane and recipe registry.
- [ ] Integrate the external OMP executor as a coarse-grained Action/job backend.
- [ ] Optional: add docs live previews after the baseline registry and native harness pass verification.

## Approach

### 1. Vendor OMP hashline as the only upstream OMP code imported into the Worker-native runtime

1. Create `vendor/oh-my-pi/hashline/` by copying the upstream OMP `packages/hashline/` directory exactly, including `src/`, `README.md`, `CHANGELOG.md`, and `package.json`.
2. Do not edit vendored files for Cloudflare behavior. If a compatibility patch is unavoidable, place it in `vendor/oh-my-pi/hashline/patches/README.md` with the exact upstream file and reason, then keep the code change as small as possible.
3. Add `vendor/oh-my-pi/hashline/package.json` to the workspace only if the target monorepo package manager supports workspace packages from `vendor/`. Otherwise import vendored source through the wrapper package in Step 2. Do not consume `@oh-my-pi/hashline` directly from npm in the Cloudflare build because upstream currently exports TypeScript source and declares a Bun engine; vendoring keeps the Worker build deterministic.
4. Copy upstream tests only when they can run under the target test runner without Bun-specific globals. Upstream behavior is instead pinned by the conformance tests in Step 5.

### 2. Add the `flue-hashline` package as the only local integration surface

Create `packages/flue-hashline/` with this exact public responsibility: adapt vendored hashline to Flue `SessionEnv`, Cloudflare Durable Object SQLite, and model-facing sandbox tools. Do not put recipe registry or external OMP runner code in this package.

Create these files:

- `packages/flue-hashline/package.json`
  - `name`: `flue-hashline`
  - `type`: `module`
  - dependencies: `diff`, `lru-cache`, `picomatch`
  - peer dependency: `@flue/runtime`
  - exports: `./src/index.ts`
- `packages/flue-hashline/src/index.ts`
  - Re-export only the local stable API:
    - `FlueWorkspaceFilesystem`
    - `DurableSnapshotStore`
    - `createHashlineTools`
    - `withHashlineTools`
    - `createInMemoryHashlineHarnessForTests`
- `packages/flue-hashline/src/filesystem/flue-workspace-filesystem.ts`
- `packages/flue-hashline/src/snapshots/durable-snapshot-store.ts`
- `packages/flue-hashline/src/tools/read.ts`
- `packages/flue-hashline/src/tools/search.ts`
- `packages/flue-hashline/src/tools/find.ts`
- `packages/flue-hashline/src/tools/write.ts`
- `packages/flue-hashline/src/tools/edit.ts`
- `packages/flue-hashline/src/tools/index.ts`
- `packages/flue-hashline/src/sandbox/with-hashline-tools.ts`
- `packages/flue-hashline/src/testing/in-memory-harness.ts`

#### `FlueWorkspaceFilesystem`

Implement `FlueWorkspaceFilesystem extends Filesystem` from vendored hashline.

Constructor signature:

```ts
constructor(env: SessionEnv, options?: { root?: string })
```

Behavior:

- `readText(path)` calls `env.readFile(path)` and throws vendored `NotFoundError` when `env.exists(path)` is false or `readFile` throws a missing-file-like error.
- `writeText(path, content)` calls `env.writeFile(path, content)` and returns `{ text: content }` because Flue `SessionEnv.writeFile` does not return transformed text.
- `exists(path)` delegates to `env.exists(path)`.
- `canonicalPath(path)` returns `env.resolvePath(path)`, normalized to POSIX separators and without trailing slash except `/`.
- Reject paths whose normalized form contains `..` after resolution. Return a tool error; do not silently normalize traversal away.
- Do not add file creation policy here. Creation is owned by `write`; `edit` remains update-only through hashline `Patcher.prepare()`.

#### `DurableSnapshotStore`

Implement `DurableSnapshotStore extends SnapshotStore` from vendored hashline. It is a bounded operational cache, not conversation memory.

Constructor signature:

```ts
constructor(options: {
  sql: SqlStorage;
  sessionId: string;
  limits?: Partial<DurableSnapshotLimits>;
})
```

Define:

```ts
interface DurableSnapshotLimits {
  maxPathsPerSession: number;
  maxVersionsPerPath: number;
  maxSnapshotChars: number;
  maxTotalCharsPerSession: number;
  ttlMs: number;
}
```

Default limits:

```ts
{
  maxPathsPerSession: 64,
  maxVersionsPerPath: 6,
  maxSnapshotChars: 500_000,
  maxTotalCharsPerSession: 16_000_000,
  ttlMs: 86_400_000
}
```

Create a table named `hashline_snapshots` with these columns:

```sql
session_id TEXT NOT NULL,
path TEXT NOT NULL,
hash TEXT NOT NULL,
text TEXT NOT NULL,
seen_lines TEXT NOT NULL,
recorded_at INTEGER NOT NULL,
accessed_at INTEGER NOT NULL,
char_length INTEGER NOT NULL,
PRIMARY KEY (session_id, path, hash)
```

Add indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_hashline_snapshots_session_accessed
  ON hashline_snapshots (session_id, accessed_at);
CREATE INDEX IF NOT EXISTS idx_hashline_snapshots_session_path_recorded
  ON hashline_snapshots (session_id, path, recorded_at);
```

Method behavior:

- `record(path, fullText, seenLines?)`
  - Normalize hash through vendored `computeFileHash(fullText)`.
  - If `fullText.length > maxSnapshotChars`, do not store the text and return the hash. The caller will omit the editable header when storage returns `undefined`; expose this through a helper `recordSnapshotOrUndefined(...)` rather than changing the upstream `SnapshotStore.record(...)` contract.
  - Upsert existing `(session_id, path, hash)` by merging `seenLines`, updating `accessed_at`, and preserving original `recorded_at`.
  - Insert new versions with `recorded_at = accessed_at = Date.now()`.
  - After every insert/upsert, evict in this order: expired rows, versions over `maxVersionsPerPath` per `(session_id,path)`, least-recently-accessed paths over `maxPathsPerSession`, then least-recently-accessed rows until total `char_length` for the session is `<= maxTotalCharsPerSession`.
- `head(path)` returns newest non-expired row by `recorded_at DESC` and refreshes `accessed_at`.
- `byHash(path, hash)` returns matching non-expired row and refreshes `accessed_at`.
- `recordSeenLines(path, hash, lines)` merges lines into the JSON array in `seen_lines`.
- `invalidate(path)` deletes rows for `(session_id,path)`.
- `clear()` deletes rows for `session_id` only.

Use JSON arrays for `seen_lines`; parse into `Set<number>` when returning a vendored `Snapshot` object. The exact `SqlStorage` method names are platform-provided; before coding, read the installed Cloudflare `SqlStorage` type and implement a single local helper `packages/flue-hashline/src/snapshots/sql.ts` with `exec`, `one`, and `all` wrappers. All store code must use only that helper.

### 3. Implement OMP-style model-facing file tools as Flue `SessionToolFactory` tools

Do not implement these as `defineTool(...)` tools because Flue `defineTool` receives only `{ input, signal }` and does not provide `SessionEnv`. Implement them as `AgentTool` objects returned by a `SessionToolFactory`, following the public Flue sandbox API and the `examples/cloudflare/src/sandboxes/cloudflare-shell.ts` `createCodeTool(...)` shape.

Create:

```ts
export function createHashlineTools(options: {
  env: SessionEnv;
  snapshots: SnapshotStore;
  display?: { defaultReadLines?: number; searchContextLines?: number };
}): AgentTool<any>[]
```

Return tools in this order: `read`, `search`, `find`, `write`, `edit`.

#### `read`

Parameters JSON schema:

```json
{
  "type": "object",
  "properties": { "path": { "type": "string" } },
  "required": ["path"]
}
```

Supported path selector grammar for the first implementation:

- `path`
- `path:raw`
- `path:N`
- `path:N-M`
- `path:N+C`
- `path:N-`
- `path:raw:N-M`
- `path:N-M:raw`

Behavior:

- Read UTF-8 text through `FlueWorkspaceFilesystem.readText`.
- Default no-selector output shows the first `300` lines; explicit ranges show only requested lines, no extra context.
- Raw mode suppresses hashline headers and `LINE:` prefixes.
- Non-raw mode records a full normalized snapshot if `text.length <= 500_000`; otherwise it prints `[snapshot omitted: file exceeds 500000 characters]` and no `[PATH#TAG]` header.
- Non-raw output shape:
  - first line `[path#TAG]` when a snapshot was stored
  - following lines `N:content`
- Record `seenLines` for every displayed line. For no-selector reads capped at 300 lines, only lines `1..300` are seen.
- If the file is missing, return a tool error that says `File not found: <path>. Use write to create new files.`

#### `search`

Parameters JSON schema:

```json
{
  "type": "object",
  "properties": {
    "pattern": { "type": "string" },
    "paths": {
      "oneOf": [
        { "type": "string" },
        { "type": "array", "items": { "type": "string" } }
      ]
    },
    "case": { "type": "boolean" }
  },
  "required": ["pattern"]
}
```

Behavior:

- Use JavaScript `RegExp`, not Rust regex. Document this in the tool description.
- Default `paths` is `.`.
- Recursively traverse directories with `env.readdir` and `env.stat`.
- Exclude directories named `.git`, `node_modules`, `.next`, `dist`, `build`, `.turbo`, and `coverage`.
- For each match, display two lines of context before and after.
- Group output by file. For each matched file, record a full snapshot when `text.length <= 500_000`; include `[path#TAG]`; mark match rows as `*N:content` and context rows as ` N:content`.
- Record `seenLines` for all match and context rows shown.
- Limit visible output to 50 matched files and 500 displayed lines. If truncated, append `Result limit reached; narrow paths or pattern.`
- If the regex is invalid, return a tool error with the JavaScript regex error message.

#### `find`

Parameters JSON schema:

```json
{
  "type": "object",
  "properties": {
    "paths": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["paths"]
}
```

Behavior:

- Use `picomatch` for glob matching.
- Recursively traverse from `.` unless a glob contains a non-glob directory prefix; optimization is allowed but must not change results.
- Return files and directories, with directories suffixed by `/`.
- Exclude the same generated/vendor directories as `search` unless the glob explicitly contains that directory name.
- Sort output lexicographically for deterministic docs and tests.
- Limit output to 200 paths and append `Result limit reached; narrow paths.` on truncation.

#### `write`

Parameters JSON schema:

```json
{
  "type": "object",
  "properties": {
    "path": { "type": "string" },
    "content": { "type": "string" }
  },
  "required": ["path", "content"]
}
```

Behavior:

- Write text through `FlueWorkspaceFilesystem.writeText`.
- After success, record a snapshot for the full normalized content when `content.length <= 500_000`.
- Return `Successfully wrote <N> characters to <path>` followed by `[path#TAG]` when a tag was stored.
- Do not implement archive, SQLite, internal URL, generated-file guard, or conflict resolution in this lane.

#### `edit`

Parameters JSON schema:

```json
{
  "type": "object",
  "properties": { "input": { "type": "string" } },
  "required": ["input"]
}
```

Behavior:

- Parse the input with vendored `Patch.parse(input)`.
- Apply with vendored `new Patcher({ fs: new FlueWorkspaceFilesystem(env), snapshots })`.
- Do not pass a `BlockResolver` in the first implementation. `.BLK` operations must fail with hashline's resolver-unavailable error; the tool description must tell the model to use concrete line ranges.
- On success, return each section's fresh `header`, operation (`update` or `noop`), first changed line when present, and warnings.
- Include recovery warnings verbatim so the model can see when stale edit recovery occurred.
- Generate a compact diff preview using vendored `diff-preview` if available without additional Worker build patches. If diff-preview is incompatible, return changed line metadata only and add a conformance test for warning visibility; do not invent a custom diff format in the first pass.
- On `MismatchError`, return the mismatch text as a tool error and do not retry automatically outside hashline recovery.
- On unseen-line errors, return the vendored `unseenLinesMessage(...)` text unchanged.

### 4. Wire hashline tools into Cloudflare Shell without losing `code`

Create `packages/flue-hashline/src/sandbox/with-hashline-tools.ts`:

```ts
export function withHashlineTools(
  base: SandboxFactory,
  options: {
    sql: SqlStorage;
    snapshotLimits?: Partial<DurableSnapshotLimits>;
  }
): SandboxFactory
```

Behavior:

- Maintain `const stores = new WeakMap<SessionEnv, SnapshotStore>()` inside `withHashlineTools`.
- Return a new `SandboxFactory` whose `createSessionEnv({ id })` calls `base.createSessionEnv({ id })`, creates a `DurableSnapshotStore({ sql, sessionId: id, limits })`, stores it in the WeakMap keyed by the returned `SessionEnv`, and returns the same env.
- Its `tools(env, opts)` returns `createHashlineTools({ env, snapshots })` followed by `base.tools?.(env, opts) ?? []`.
- Before returning, detect duplicate tool names and throw `Duplicate sandbox tool name: <name>`.
- Do not remove the Cloudflare Shell `code` tool; it remains after the hashline tools.

Usage in a Flue agent:

```ts
import { getDefaultWorkspace, getShellSandbox } from '../sandboxes/cloudflare-shell';
import { withHashlineTools } from 'flue-hashline';
import { getCloudflareContext } from '@flue/runtime/cloudflare';

export default defineAgent(({ id, env }) => {
  const { storage } = getCloudflareContext();
  const base = getShellSandbox({ workspace: getDefaultWorkspace(), loader: env.LOADER });
  return {
    cwd: '/',
    sandbox: withHashlineTools(base, { sql: storage.sql }),
    model: 'anthropic/claude-sonnet-4-6',
    instructions: 'Use read/search/find before edit. Edit only with hashline anchors from read/search output.'
  };
});
```

If the target app uses Cloudflare Sandbox instead of Cloudflare Shell, still wrap its `SandboxFactory` with `withHashlineTools`; the adapter only requires `SessionEnv` file methods.

### 5. Add conformance and integration tests before adding recipe distribution

Add tests under `packages/flue-hashline/test/`.

Required tests:

1. `hashline-readme-example.test.ts`
   - Use vendored `InMemoryFilesystem` and `InMemorySnapshotStore`.
   - Execute the README quick start: record `hello.ts`, parse `SWAP 1.=1`, apply, assert final text is `const greeting = "hello";\nexport { greeting };\n`.
2. `seen-lines.test.ts`
   - Read only line 1 through the Flue `read` tool.
   - Attempt `edit` anchored on line 2 with the returned tag.
   - Assert the tool returns an unseen-lines error telling the model to re-read line 2.
3. `stale-recovery.test.ts`
   - Record an initial file snapshot.
   - Mutate a non-overlapping line through the filesystem.
   - Apply an edit anchored to an unchanged line using the old tag.
   - Assert edit succeeds and result warnings include one of hashline's recovery warnings.
4. `line-ending-bom.test.ts`
   - Write a CRLF file with UTF-8 BOM through the filesystem.
   - Apply a line edit.
   - Assert BOM and CRLF are preserved in persisted text.
5. `write-fresh-tag.test.ts`
   - Call `write` with a new file.
   - Assert response includes `[path#TAG]` and a follow-up `edit` using that tag succeeds.
6. `with-hashline-tools.test.ts`
   - Wrap a fake `SandboxFactory` with a fake existing `code` tool.
   - Assert returned tools are `read`, `search`, `find`, `write`, `edit`, `code` in that order.
7. `snapshot-eviction.test.ts`
   - Use `DurableSnapshotStore` with tiny limits.
   - Assert old snapshots are evicted by per-path version count and total character limits.

Use a local in-memory SQL shim only for tests if Cloudflare `SqlStorage` cannot run in the test process. The shim must implement the same `exec`, `one`, and `all` helper interface used by production `DurableSnapshotStore`.

### 6. Add shadcn-compatible Flue recipe registry after the core tools pass

Create recipe registry files modelled on agentcn, but keep core primitives in packages rather than copying them into every recipe.

Create:

- `registry/flue/hashline-coding-agent/registry.json`
- `registry/flue/hashline-coding-agent/agents/hashline-coding-agent.ts`
- `registry/flue/hashline-coding-agent/skills/hashline-editing/SKILL.md`
- `scripts/build-agent-registry.ts`
- `public/r/.gitkeep` if the build output directory needs to exist before generation

`registry/flue/hashline-coding-agent/registry.json` must use this shape:

```json
{
  "name": "hashline-coding-agent",
  "type": "registry:block",
  "title": "Hashline Coding Agent",
  "description": "Flue agent recipe that wraps a Cloudflare Shell sandbox with OMP-style hashline read/search/find/write/edit tools.",
  "framework": "flue",
  "files": [
    { "path": "agents/hashline-coding-agent.ts", "type": "registry:file", "target": "agents/hashline-coding-agent.ts" },
    { "path": "skills/hashline-editing/SKILL.md", "type": "registry:file", "target": "skills/hashline-editing/SKILL.md" }
  ],
  "dependencies": ["@flue/runtime", "flue-hashline"]
}
```

`agents/hashline-coding-agent.ts` must demonstrate the exact `withHashlineTools(getShellSandbox(...))` wiring from Step 4. The recipe must not vendor hashline source or duplicate package code.

`skills/hashline-editing/SKILL.md` must instruct the agent:

- always use `read` or `search` before `edit`
- never edit lines not shown under a `[PATH#TAG]` header
- after every successful edit, use the returned fresh tag for follow-up edits
- use `write` for new files
- use concrete line ranges because block ops are disabled in the first implementation

`scripts/build-agent-registry.ts` must:

- Discover `registry/flue/*/registry.json`.
- Inline every referenced file content.
- Emit `public/r/flue/<name>.json` with `$schema: "https://ui.shadcn.com/schema/registry-item.json"`.
- Emit `public/r/registry.json` with `$schema: "https://ui.shadcn.com/schema/registry.json"`, `name`, `homepage`, and an `items` list where item names are `flue/<name>`.
- Preserve each file's `target` field. This is required for `registry:file` entries that should land in `agents/` or `skills/`.
- Fail the build if two items produce the same public name or if any file path escapes its recipe directory.

Add `pnpm registry:build` script that runs `tsx scripts/build-agent-registry.ts`. If the repo does not use `tsx`, add `tsx` as a devDependency; do not use Bun for this build step because the registry tooling is not Worker runtime code and should stay package-manager-neutral.

### 7. Document the native harness and registry maintenance rules

Create docs in the target docs system. If no docs app exists, create `docs/flue-omp-integration.md` and `docs/registry.md` at the repo root.

`docs/flue-omp-integration.md` must include:

- the architectural split: vendored hashline core, Flue-native file lane, structural/dangerous edit lane deferred, external OMP job backend
- the reason `packages/coding-agent` is not ported into Workers
- the exact limits used by `DurableSnapshotStore`
- the first implementation's limitations: no archive/SQLite/internal URL reads, no `.BLK` edits, no LSP, no shell runtime in the native lane
- the rule that snapshots are an operational cache and may expire; after expiration the model must re-read

`docs/registry.md` must include:

- how to add a recipe under `registry/flue/<slug>/`
- exact `registry.json` fields
- how to run `pnpm registry:build`
- install command examples:
  - namespace form: `npx shadcn@latest add @<registry>/flue/hashline-coding-agent`
  - URL form: `npx shadcn@latest add https://<host>/r/flue/hashline-coding-agent.json`
- the rule that recipes may depend on `flue-hashline` but must not copy its source

### 8. Integrate OMP only as an external coarse-grained Action/job backend

Create a separate package or source area `packages/omp-runner-client/` only after the native file lane and registry build pass tests.

Define the client contract:

```ts
export interface OmpCodingJobRequest {
  idempotencyKey: string;
  workspaceRef: { kind: 'r2-prefix' | 'git-ref' | 'sandbox-id'; value: string };
  task: string;
  allowedTools?: string[];
  timeoutMs: number;
}

export interface OmpCodingJobStatus {
  jobId: string;
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  summary?: string;
  artifactRefs: Array<{ name: string; url: string }>;
  error?: string;
}
```

Expose it to Flue as an Action named `run_omp_coding_job`, not as MCP and not as individual OMP tools. The Action must persist job status in the Flue Durable Object state and return artifact references, never raw OMP internal session paths. OMP transcripts are debug artifacts only; Flue Durable Object state remains the source of truth for user-visible workflow/session status.

The external runner itself is out of the Worker-native package. It must run in a Bun/Node-capable environment and pin an OMP version. Do not import `@oh-my-pi/pi-coding-agent` into the Cloudflare Worker bundle.

### 9. Optional docs live preview batch

This batch is optional and excluded from baseline done criteria. Execute it only when the implementation ticket explicitly says docs previews are in scope.

If included, implement a docs-only preview layer modelled on agentcn:

- `components/agent-preview.tsx`
- `lib/preview/events.ts`
- `lib/preview/runner.ts`
- `lib/preview/agents.ts`
- `lib/preview/tools.ts`
- `app/api/preview/flue/[agent]/route.ts` or the equivalent route for the docs framework

Use this event protocol exactly:

```ts
export type PreviewEvent =
  | { type: 'tool:call'; tool: string; input: unknown }
  | { type: 'tool:result'; tool: string }
  | { type: 'text:delta'; text: string }
  | { type: 'done'; result: unknown }
  | { type: 'error'; message: string };
```

Preview policy:

- Safe, read-only demo tools may run for real.
- Editing-heavy recipes must use recorded trace replay first, stored as `registry/flue/<slug>/preview.trace.json`; do not fake hashline editing semantics with a toy implementation.
- Mutating or credentialed tools must degrade with a clear note: `<tool> is disabled in hosted preview. Install the recipe and run it in your own Flue project to enable it.`
- Add IP or session rate limiting. If no durable rate-limit store is available in docs hosting, use in-memory rate limiting and document that it resets on restart.

## Critical files & anchors

- `vendor/oh-my-pi/hashline/src/patcher.ts` — `Patcher`, `prepare`, `commit`, and built-in recovery wiring are the core edit-safety behavior to preserve.
- `vendor/oh-my-pi/hashline/src/snapshots.ts` — `SnapshotStore`, `seenLines`, and version lookup define the durable cache adapter contract.
- `packages/flue-hashline/src/sandbox/with-hashline-tools.ts` — wraps Flue `SandboxFactory` while preserving Cloudflare Shell's existing `code` tool.
- `packages/flue-hashline/src/tools/edit.ts` — the only native tool that mutates existing files through hashline; all safety errors and recovery warnings must surface here.
- `scripts/build-agent-registry.ts` — generates shadcn-compatible recipe output from source-owned registry files.

## Verification / Done criteria

- [ ] `pnpm test --filter flue-hashline` passes the seven required tests listed in Approach Step 5.
- [ ] A manual tool-loop test with an in-memory `SessionEnv` succeeds:
  1. call `write` with `{ path: "hello.ts", content: "const greeting = \"hi\";\nexport { greeting };\n" }`
  2. capture returned `[hello.ts#TAG]`
  3. call `edit` with `SWAP 1.=1:` replacing `hi` with `hello`
  4. call `read` for `hello.ts`
  5. expected output includes `1:const greeting = "hello";`
- [ ] Seen-line protection is observable: read only line 1 of a two-line file, attempt an edit anchored on line 2 with that tag, and confirm the tool returns an unseen-lines error telling the model to re-read line 2.
- [ ] Stale recovery visibility is observable: apply an edit with an old tag after a non-overlapping external change and confirm the edit result includes a hashline recovery warning.
- [ ] `pnpm registry:build` writes `public/r/flue/hashline-coding-agent.json` and `public/r/registry.json`, and the generated recipe item contains `$schema: "https://ui.shadcn.com/schema/registry-item.json"`, `type: "registry:block"`, dependencies `@flue/runtime` and `flue-hashline`, and file contents inlined.
- [ ] Installing the generated recipe into a scratch Flue app with the URL form of `npx shadcn@latest add` writes `agents/hashline-coding-agent.ts` and `skills/hashline-editing/SKILL.md` at the declared targets.
- [ ] A Cloudflare Shell agent wired with `withHashlineTools(getShellSandbox(...))` exposes `read`, `search`, `find`, `write`, `edit`, and `code`; duplicate tool names throw before the agent starts.
- [ ] Documentation states the first native lane limitations: no archive/SQLite/internal URL reads, no block edits, no LSP, no shell runtime, and snapshots expire as bounded cache.
- [ ] External OMP executor integration test uses a fake runner server and proves `run_omp_coding_job` persists job state and returns artifact references without exposing OMP internal paths.
- [ ] If the optional preview batch is executed, the preview route streams `tool:call`, `tool:result`, `text:delta`, and `done` SSE frames for the safe sample recipe, and mutating tools return the required disabled-preview note.

## Assumptions & contingencies

- Assumption: the target project is or will become a monorepo. Use `packages/flue-hashline`, `vendor/oh-my-pi/hashline`, `registry/flue`, `scripts`, and `public/r` exactly as specified. If the repository is a single-package Flue app, still create these directories at the repository root; do not bury the vendored hashline or registry under `src/`.
- Assumption: the first native runtime target is Cloudflare Shell or any Flue sandbox that implements `SessionEnv` file methods. If the project chooses Cloudflare Sandbox instead, keep the same `withHashlineTools(baseFactory, ...)` wrapper and pass the Cloudflare Sandbox `SandboxFactory`; do not fork tool implementations.
- Assumption: docs previews are optional. The baseline implementation stops after native tools, registry build, docs, and external OMP Action contract pass verification. Preview work is a separate final batch and is not required to mark the baseline done.
- If vendored hashline imports fail in the Worker build because of `NodeFilesystem` or `node:path`, do not edit vendored core first. Add a wrapper export in `packages/flue-hashline/src/vendor/hashline.ts` that imports only core modules used by the Worker (`Patch`, `Patcher`, `Filesystem`, `SnapshotStore`, `Recovery`, messages, format helpers). If tree-shaking still includes Bun-only code, apply the smallest vendor patch and record it under `vendor/oh-my-pi/hashline/patches/README.md`.
- If Cloudflare `SqlStorage` is unavailable outside the request/DO context, instantiate `DurableSnapshotStore` only inside `createSessionEnv({ id })` via `getCloudflareContext()`. Tests use the SQL shim from Step 5; production must not fall back to in-memory snapshots on Cloudflare.
- If shadcn CLI rejects `registry:file` targets for `agents/` or `skills/`, switch those entries to `type: "registry:block"` item-level files with explicit `target` fields preserved; do not move recipe files to UI/component aliases.
- If a future upstream OMP release changes hashline behavior, update vendored hashline first, run conformance tests, then update adapters only for changed public interfaces. Do not cherry-pick coding-agent runtime changes into Worker-native packages.
