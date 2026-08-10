# Planner Role Profile and Transport Contract

`dev-implementation` is the only owner of the provider-neutral `planner` transport. For each attempt it binds one secret-free JSON Role Profile and hashes the exact bytes. The profile is input to static preflight and to runtime attestation; filesystem presence, a model label, or a native `PROFILE` line alone is not proof.

## Role Profile schema

The required top-level fields are:

```json
{
  "schema": "planner-role-profile/v4",
  "attempt_authority_sha256": "<task-contract-sha256>",
  "role": "planner",
  "harness": "omp|grok",
  "environment": "disposable-proof|live",
  "canonical_persona": {"path": ".../personas/planner/PERSONA.md", "sha256": "<digest>"},
  "projection": [{"path": "...", "sha256": "<digest>"}],
  "native": {"kind": "user-agent", "name": "planner", "source_paths": ["..."]},
  "model": {"selector": "@plan|planner", "source": "modelRoles.plan|agent.model", "concrete": "..."},
  "reasoning_effort": {"source": "...", "concrete": "max|high"},
  "capabilities": {"declared": ["..."], "effective": ["..."]},
  "topology": {"parent_depth": 0, "child_depth": 1, "child_can_spawn": false},
  "fallback": "none"
}
```

`projection`, `native.source_paths`, and all digests are bound values, not discovered defaults. Both harnesses resolve one exact-name native `planner` user agent from one generated projection; provider-specific model, effort, tool, and prompt fields remain inside that projection or the bound parent command. An implementation may add `config.path`, `config.sha256`, and `proof_root` to bind a disposable static fixture; those fields contain no secret or credential material. The exact mappings are:

| Field | OMP | Grok |
|---|---|---|
| Native identity | user agent `planner` | custom user agent `planner` |
| Model owner | agent selector `@plan` → `modelRoles.plan` | generated agent `model: grok-4.5`; no per-type override |
| Concrete model | `openai-codex/gpt-5.6-sol` | public selector `grok-4.5`; current native usage label `grok-4.5-build` |
| Effort | `thinking-level: max` | parent launch `--effort high` |
| Declared capabilities | `read,grep,glob,bash,lsp,write,hub` | agent tools project to `read,write,execute` |
| Effective capabilities | declared set plus native `yield` | `read,write,execute` |
| Topology | top-level → planner, no task/spawns/prewalk, child cannot spawn | top-level → exact-name `planner` at depth one; the agent has no child-spawn tool |
| Fallback | `none` | `none` |

The serialized effective capability field in the attestation is `read,grep,glob,bash,lsp,write,hub,yield` for OMP and `read,write,execute` for Grok.

## Fail-closed preflight

The non-launching command is:

```text
python3 <dev-implementation>/scripts/planner_transport.py preflight \
  --harness omp|grok \
  --environment disposable-proof|live \
  --role-profile <exact-json-path> \
  --cwd <exact-working-directory>
```

Preflight reads only the bound canonical persona, generated projections, native role/agent/config files, Role Profile, and exact project-level collision paths under `cwd`. It does not launch a process, call a provider, read credentials, write configuration, or inspect live runtime state. A ready result is one sorted JSON line and exit `0`:

```json
{"role_profile_sha256":"<digest>","schema":"planner-preflight/v3","status":"ready"}
```

A mismatch is one sorted one-line JSON object and exit `69`:

```json
{"capability":"model","expected":"no per-type override; generated agent owns the model","observed":"grok-build","schema":"planner-preflight/v3","source":"subagents.models.planner","status":"transport-unavailable"}
```

The first mismatch wins in this fixed order:

```text
preflight-integrity | canonical-persona | projection-identity |
agent-discovery | role-binding | model | reasoning-effort | read | write |
execute | delegation-depth | subagents-enabled | no-fallback |
state-isolation | auth-isolation
```

CLI misuse emits the `preflight-integrity` capability without reading target files and exits `64`. A fail-closed result never creates a semantic artifact, retries, selects another model/name/harness, inherits a parent prompt, or falls through to a compatibility alias. The adapter dispatches a semantic child only after `ready`.

## Executor Plan publication preflight

The native transport attests planner identity and capability; it does not parse portable plan semantics. When the authorized planner output is an implementation plan, the same attempt must invoke `scripts/executor_plan.py --context omp|grok --consumer planner <exact-plan-path>` after drafting and before publication. The backend invokes that same parser with `consumer=backend` before any projected task becomes ready. Both consumers bind the exact plan digest from the valid result; missing, unavailable, or invalid evidence produces no planning publication and permits no mutation. This adds no parser to this transport and does not weaken the planner's no-implementation and no-delegation limits.

## Runtime attestation and smoke

The first child line is exactly one of:

```text
PROFILE role=planner harness=omp native=planner model=<concrete> effort=max capabilities=read,grep,glob,bash,lsp,write,hub,yield depth=0 fallback=none profile=<role-profile-sha256>
PROFILE role=planner harness=grok native=planner model=grok-4.5 effort=high capabilities=read,write,execute depth=0 fallback=none profile=<role-profile-sha256>
```

Static sources and runtime metadata must both match the same profile. Any mismatch maps to the same closed `transport-unavailable` key and produces no planning artifact.

The post-login wrapper is one command per harness:

```text
python3 <dev-implementation>/scripts/planner_transport.py smoke \
  --harness omp|grok \
  --role-profile <exact-json-path> \
  --proof-root <existing-authenticated-private-root> \
  --evidence <new-redacted-json-path>
```

It uses fixed input bytes `planner-smoke-input\n`, fixed output bytes `planner-smoke-ok\n`, exactly one SHA-256 command, all three native read/write/execute events, no more than six child tool calls, no retry, an eight-turn Grok guard, and a 180-second termination guard. OMP uses the named disposable profile and `--mode rpc`, selects and confirms `openai-codex/gpt-5.6-sol:max`, subscribes to subagent events, and dispatches one exact-name `planner` Task. Because native login may append top-level `setupVersion: 1`, the smoke removes only that one line, only inside the disposable proof root, and only when the resulting bytes recover the exact bound config digest; every other config difference fails closed. Grok installs the already digest-verified generated `planner` agent into the private proof home, uses public selector `grok-4.5`, exact internal usage label `grok-4.5-build`, `high`, `--always-approve`, `streaming-json`, `--no-memory`, `--disable-web-search`, `--no-auto-update`, and `--max-turns 8`, then makes one blocking exact-name `planner` spawn with `capability_mode=all` and `isolation=none`. The ACP event stream must show exactly the spawn, its bounded child tool interval, one completed `SubagentCompleted` record, and the exact parent result.

The wrapper writes one redacted evidence record atomically only after a verified process outcome. Evidence contains versions, source/profile/config digests, identity/model/effort/capabilities/depth facts, bounded event counts, output digest, fallback count, login success, and cleanup state. It never contains prompts, transcripts, credentials, auth bytes/digests, session bodies, or environment dumps. If process termination cannot be proven, it returns `blocked`, retains only that exact proof root, and permits no retry or cleanup.
