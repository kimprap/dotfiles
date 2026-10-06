## Reconcile

### Capability preflight

1. Capability preflight belongs to the controller and runs before any launch.
   It refuses with exit `2` and a `## Controller refused` record on an invalid
   request, `omp --version` or acpx other than the versions pinned in
   `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs`, a missing
   or unparsable model role (`modelRoles.second_opinion_a`
   for A and `modelRoles.second_opinion_b` for B, each `<model>:<thinking>`),
   an invalid per-run `models` override (`model override`), a missing or
   duplicated reviewer prompt marker, or an
   abandoned controller run (owner gone and not parked; live and parked runs of
   other sessions never refuse). Present a refusal verbatim and stop. After an
   abandoned-run refusal, ask the human once which listed runs to dispose and
   run `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
   only for runs the human explicitly names; never remove folders or signal
   processes by hand and never retry the refused run automatically: after
   disposal the human re-invokes. If a `dispose` exits `3`, present that record
   verbatim and stop; the human decides. Do not patch the host,
   supply profiles, argv, models (except the request's `models` field under
   "Per-run model change"), tools, prompts, process factories or
   environment, substitute task/hub/Eval transport, emulate both roles with one
   actor, or weaken a seam.

### Roles check before each brief

Immediately before rendering each brief, including a revised one, run
`node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` through `bash`
from the repository root. With no pending model change it takes no request
body; plain `roles` returns at once because it reads stdin only when stdin is
not a TTY, and the OMP `bash` tool gives it an empty stdin. It runs the
Reconcile capability preflight above and launches nothing. On exit `2`, present
its refusal verbatim and stop, except a `model choice` refusal under "Per-run
model change". On exit `0`, show its `Models:` list stdout verbatim directly
after the brief's reply line. The list reports reviewer A's and B's model and
thinking level: the live `modelRoles`, or a pending per-run model change with
each changed line naming its live default. It is not a brief field.

### Per-run model change

This applies to Reconcile and Retrace. A human change of a reviewer's model or
thinking level is a valid per-run adjustment, including inside
`approve — {adjustments}`. It is carried only by the controller calls below:
never edit `.config/agents/harnesses/omp/config.yml` or any other `modelRoles`
source for a model change.

1. Pass the human's words unresolved as the `roles` body; never pre-resolve a
   name or level yourself. Write
   `{"models": {"a": {"model": "{human's name}", "thinking": "{human's level}"}, "b": {...}}}`,
   with only the roles and fields the human named, to a session-local scratch
   file and run
   `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles < {session-local scratch}/roles-body.json`
   through `bash` from the repository root. The file redirect always closes
   stdin, so the call cannot wait on an open stream. A role or field left out
   keeps its live value. The controller resolves each value against
   `omp models --json`: a name searches only the reviewer's current provider,
   skips dated snapshots and takes the newest version; `provider/name` or an
   exact selector overrides that scope; a level is an exact supported level or
   the one supported level it starts. A kept live level must be supported by a
   changed model.
2. On exit `2` with **Reason** `model choice`, ask the human once, listing the
   candidates each refusal line names, and do not guess; run `roles` again with
   the human's answer. Any other refusal is presented verbatim and stops.
3. On exit `0`, render the skill's short `models changed` gate with the stdout
   verbatim and wait, even when the change came inside `approve — …`. A plain
   `approve` then starts the run with the override.
4. The approved request carries the exact pair from the shown note for each
   changed role, `"models": {"a": "{selector}:{level}", "b": "{selector}:{level}"}`,
   omitting unchanged roles. The controller checks that each selector is in
   `omp models --json` and supports the level, does no loose resolution, and
   otherwise refuses with exit `2`, **Reason** `model override`, and nothing
   launched. Reviewers A and B use the pairs, Retrace scope evaluators use A's
   pair, a parked Reconcile run keeps them at resume, and `## Spend` shows
   them. `normalize` always uses the live roles and refuses `models`.
5. The override applies to every gate re-presented for the same pending run;
   rerun `roles` with the same body before each. It ends when that run's
   controller call is made; a later brief or table goes back to the live
   defaults and a plain `roles` call.

### Session journal recovery

When the skill sends Main to the session journal to rebuild Intent:

1. Open the current session's journal: the newest `.jsonl` file in
   `~/.omp/agent/sessions/` under the folder named after the working directory
   (`-.dotfiles` for `~/.dotfiles`) whose first `"type":"session"` line has
   that directory as `cwd`. Compaction does not shorten it; earlier entries
   stay in the file.
2. `grep` it for `"role":"user"` (human messages) and
   `"attribution":"user"` (also skill invocations, whose `details.args` hold the
   human's request), then `read` the matching lines and the assistant
   questions just before them.
3. Treat `"type":"compaction"` summaries as Main's words, never the human's.

### Controller invocation

After approval, write the approved binding as one JSON object to a
session-local scratch file; it is the controller's only input channel:

```json
{
  "goal": "{Goal}",
  "candidate": {"identity": "{exact identity}", "text": "{complete proposal}"},
  "intent": ["{each Intent child}"],
  "context": ["{each Context child}"],
  "mode": "conversation",
  "cap": "none",
  "approval": {"text": "{the human's exact approval words}", "at": "{ISO-8601 time}"}
}
```

`mode` is `conversation` for Conversation replacement and `artifact` for
Artifact edits only. In Artifact edits, `candidate` is
`{"identity": "{exact identity}", "artifact": "{absolute artifact path}"}` with
no `text`, and an optional `"validate": {"argv": [..]}` names the existing
artifact-native validator. `intent` is required and holds each Intent child as
a non-empty string; a request without it is refused with exit `2` before any
launch. `cap` is `none` or the approved positive integer. An approved per-run
model change adds `models` as "Per-run model change" says.
Then run the controller once, through `bash` with `timeout: 0` and the
repository root as working directory:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs reconcile < {session-local scratch}/reconcile-request.json
```

Except for a successful `roles` call, stdout carries only the rendered record
followed by `## Spend`; stderr carries diagnostics. Exit `0` is `## Final proposal`; `1` is a stop or a parked repair
pause with `## Reconcile stopped`; `2` is a refusal before any launch; `3`
means cleanup was not established and the record names the unresolved actor,
PID, or folder. Run one controller call per approved binding. Never rerun it to
retry a stopped run; continue a parked run only under the Reconcile skill's Liveness, failure, and
repair.

### Resume and abandon a parked run

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs resume {runId} < {session-local scratch}/resume-request.json
```

with the request `{"repair": {"authority": "{the human's authorization words}",
"step": "{exact failed step}"}}`. Resume restores both reviewer sessions under
their parked session identities with no fresh-session fallback, and keeps the
models and thinking levels bound at the run's first call rather than live
`modelRoles`; a parked run without recorded models stops as a lost identity.
It then retries
only the exact failed application, reread, or validator step. A different step
keeps the run parked. Application repair does not add a capacity count until
one changed canonical application commits; validation repair on the unchanged
applied identity does not add a second count. If either reviewer's same-session
restore fails, resume stops and asks: it disposes both sessions, names the lost
identity, and exits `1`; nothing rolls back and no fresh A or B is created.
Resume claims the run exclusively, refuses while another live controller owns
it, and restores no reviewer until every recorded or matched reviewer PID shows
observed exit; a still-present PID exits `3` with the run unchanged, and the
root presents that record verbatim and stops. A parked run never blocks other
sessions' runs; a resumed run whose controller then dies is abandoned and can
only be disposed. Abandon a parked run with
`node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
and no request body, only on the human's explicit instruction.

## Retrace

### Approval surface

Render each table that step 4 of Retrace's "Normalize and approve" presents,
including a re-presented one, in this layout. Step 4 alone owns the table, its
approval and re-presentation rules, and the `roles` check with its `Models:`
list; this layout only adds labelled context lines before the table.

```markdown
## Retrace scope table

**Root**

- {bound absolute root}

**Objective**

- {each raw human objective, in authored order}

**Evidence**

- {each exact evidence locator} ({current | historical})

**Protected behavior**

- {each protected behavior}

**Exclusions**

- {each exclusion}

**Links**

- {each edge as `{ID} requires {ID}`, `{ID} shares evidence with {ID}`, or `{ID} may conflict with {ID}`}

**Scopes**

| Scope | Evaluate |
|---|---|
| {ID} {name} | {one observable objective} |
```

Give each item its own child line; an item bound to only some scopes starts
with their IDs and a colon. A field with no item has the one child `- none`.
The labelled lines add no binding: the request binds what step 4 names.

### Invoke the controller

After approval the parent invokes the controller once for the approved graph,
through `bash` with `timeout: 0` and the repository root as working directory:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs retrace < {session-local scratch}/retrace-request.json
```

The request file holds one JSON object, the only input channel:

```json
{
  "root": "/absolute/bound/root",
  "objectives": ["raw human objective, in authored order"],
  "constraints": ["human-owned constraint"],
  "exclusions": ["exclusion"],
  "evidence": [{"locator": "/absolute/locator", "role": "current"}],
  "table": {"scopes": [{"id": "S1", "name": "Name", "objective": "One observable objective.", "evaluand": "path or surface", "protected": ["protected behavior"], "exclusions": [], "requires": [], "sharedEvidence": [], "potentialConflict": []}]},
  "approval": {"text": "the human's exact approval words", "at": "ISO-8601 time"}
}
```

Exit `0` means aggregate `complete`; `1` means `partial` or `blocked` with a
rendered record; `2` means the controller refused before any launch (invalid
request or table, version pin, model role, model override, missing prompt
marker, or an abandoned controller run: owner gone and not parked; live and
parked runs of other sessions never refuse); `3` means cleanup was not
established and the
record names the unresolved actor, PID, or folder. Except for a successful
`roles` call, stdout carries only the rendered record, laid out as Retrace's
"Freshness and aggregate" section describes, followed by `## Spend`;
stderr carries diagnostics. Present stdout
verbatim. Never rerun the controller to retry a stopped or partial scope; a
fresh attempt needs the changed evidence or authority that Retrace's Stops section requires.
After an abandoned-run refusal, ask the human once which listed runs to
dispose and run
`node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
only for runs the human explicitly names; never remove folders or signal
processes by hand and never retry the refused run automatically: after
disposal the human re-invokes. If a `dispose` exits `3`, present that record
verbatim and stop; the human decides.

By default the controller binds its models from live `modelRoles`: reviewer A
uses `second_opinion_a`, reviewer B uses `second_opinion_b`, and the scope
evaluator and normalizer use A's pair. An approved request's `models` field
replaces them for that run only, as "Per-run model change" says; the
normalizer always uses the live pair. Do not supply profiles, tools, prompts,
argv, process factories, environments, or an actor graph. A binding changed by
normalization or human table edits is a new approved request, never replay or
replacement of started work.
