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
   abandoned controller run (owner gone without a parked or finished record, a
   record with exit `3`, or a recorded process still present; live, parked and
   finished runs never refuse a run for another target). A request that matches
   an existing run is judged by that run first, as "Call ended without a
   record" says, so an unrelated abandoned run never blocks it. Present a
   refusal verbatim and stop. After an
   abandoned-run refusal, which lists each run's spend so far, ask the human
   once which listed runs to dispose and
   run `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
   only for runs the human explicitly names; never remove folders or signal
   processes by hand and never retry the refused run automatically: after
   disposal the human re-invokes. If a `dispose` exits `3`, present that record
   verbatim and stop; the human decides. Never dispose or relaunch a live run;
   end one only with "Stop". Do not patch the host,
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
model change". On exit `0`, show its stdout verbatim directly after the brief's
reply line: the `Models:` list and, when any run is live, parked or finished,
the `Controller runs` list after it. `Models:` reports reviewer A's and B's
model and thinking level: the live `modelRoles`, or a pending per-run model
change with each changed line naming its live default. `Controller runs` gives
each run's runId, kind, class, target, start time, worker PID while live and
spend so far, so the human sees a run still spending before approving another.
Neither list is a brief field.

### Per-run model change

This applies to Reconcile and Retrace. A human change of a reviewer's model or
thinking level is a valid per-run adjustment, including inside
`approve — {adjustments}`. It is carried only by the controller calls below:
never edit `.config/agents/harnesses/omp/config.yml` or any other `modelRoles`
source for a model change.

1. Pass the human's words unresolved as the `roles` body; never pre-resolve a
   name or level yourself. Write
   `{"models": {"a": {"model": "{human's name}", "thinking": "{human's level}"}, "b": {...}}}`,
   with only the roles and fields the human named, to a real file under `/tmp`
   as "Controller invocation" describes and run
   `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles < {absolute request directory}/roles-body.json`
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

After approval, write the approved binding as one JSON object to a new real
request file under `/tmp`, in a directory whose name does not start with
`acp-controller-`, never `local://`; it is the controller's only input channel:

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
repository root as working directory, naming the request file by its absolute
path written out in the command:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs reconcile < {absolute request directory}/reconcile-request.json
```

Run controller calls only this way: through `bash`, never through Eval, and
never with the path held in a shell variable, so the last controller command
in the transcript is a complete recovery. `timeout: 0` stays the normal path
because it needs the fewest calls; a call that still ends without a record
follows "Call ended without a record".
The `bash` call sets only `command` and `timeout: 0`, with the repository root
as working directory, and never `name`, `ready`, `async` or `pty`.

The call hands the run to a detached worker and writes a three-line notice to
stderr, each line starting with `acp-controller:`: the runId, worker PID and
target; "If this call ends without a record, run this same command again; it
attaches to this run and starts nothing."; and the `stop` command for the run.
It then waits with no deadline for the record. Except for a successful `roles`
call, stdout carries only the rendered record followed by `## Spend`; stderr
carries the notice and diagnostics. Exit `0` is `## Final proposal`; `1` is a
stop or a parked repair pause with `## Reconcile stopped`, or the short
`## Controller run printed elsewhere` record; `2` is a refusal before any
launch; `3` means cleanup was not established or the run was abandoned, and the
record names the unresolved actor, PID, or folder and `dispose`. Run one
controller call per approved binding. Once a record has been printed, never
rerun the call to retry a stopped run; continue a parked run only under the
Reconcile skill's Liveness, failure, and repair.

### Resume and abandon a parked run

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs resume {runId} < {absolute request directory}/resume-request.json
```

run like any controller call, with the request
`{"repair": {"authority": "{the human's exact authorization words} (given {ISO-8601 time they were given})", "step": "{exact failed step}"}}`.
`repair.authority` quotes the human's authorization words with the time they
were given. Each new repair gets a new request file; rerunning the same resume
command is the same request again. Resume restores both reviewer sessions under
their parked session identities with no fresh-session fallback, and keeps the
models and thinking levels bound at the run's first call rather than live
`modelRoles`; a parked run without recorded models stops as a lost identity.
It then retries
only the exact failed application, reread, or validator step. A repair for a
different step exits `1`, launches nothing and leaves the run parked.
Application repair does not add a capacity count until
one changed canonical application commits; validation repair on the unchanged
applied identity does not add a second count. If either reviewer's same-session
restore fails, resume stops and asks: it disposes both sessions, names the lost
identity, and exits `1`; nothing rolls back and no fresh A or B is created.
Resume runs in its own worker and claims the run exclusively. A new repair sent
while a resume is live exits `2` and names that run. Resume restores no
reviewer until every recorded or matched reviewer PID shows observed exit; a
still-present PID exits `3` with the run still parked, and the root presents
that record verbatim and stops. A resume of a finished run exits `2` and names
both ways to print its record; a resume of a run that is neither parked nor
finished exits `2` and names `dispose`. A parked run keeps its folder and
record until a resume that starts or `dispose`, and never blocks other runs; a
resumed run whose worker then dies without a record is abandoned and can only
be disposed. Abandon a parked run with
`node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
and no request body, only on the human's explicit instruction. `dispose`
reports the run's spend so far and refuses a live run with exit `2`.

### Stop

This applies to Reconcile and Retrace. Cancelling, timing out or killing a
controller call never stops its run: the worker keeps running and spending
until it ends or is stopped. Use `stop` only on the human's explicit
instruction, as `dispose`, and run it like any controller call:

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs stop {runId}
```

The runId is in the notice, in the `roles` `Controller runs` list and in the
run-folder name. When it is not at hand, use the request form: the launch
command with `stop` before its subcommand and the same request file, for
example `node .config/agents/harnesses/omp/acp-controller/cli.mjs stop reconcile < {absolute request directory}/reconcile-request.json`
(also `stop retrace`, `stop normalize` and `stop resume {runId}`). Never
dispose a run, signal any process or start another run to find a runId.

On a live run, `stop` waits with no deadline for the worker to cancel its
pending reviewer requests, dispose its actors with observed exit and write a
stopped record, then prints it with exit `1`. A stop during an artifact
application, reread or validation step takes effect after that step ends, and
the run does not park. On a parked or finished run it prints that run's record
and stops nothing; on an abandoned run it prints the exit `3` record or reports
the run abandoned, names `dispose` and removes nothing; with no matching run it
exits `2`. Present the record verbatim. Never dispose or relaunch a live run;
end one only with `stop`.

### Call ended without a record

This applies to Reconcile and Retrace. When a controller call ends without a
record (timed out, cancelled or killed), its run keeps working in its worker.
Run the same command again, the last controller command in the transcript with
the same request file, through `bash`, preferably with `timeout: 0`. It
attaches to the same run and launches nothing: it waits on a live run and
prints its ending record (or exits `3` naming the abandoned run if the worker
dies without one), prints a parked or finished record, or refuses an
abandoned run naming `dispose`. Only when the earlier attempt died before the
worker published an identity does it start the run, because nothing was
launched. This rerun is the skills' already-supported observation path for the
same pending operation, which they count as continuation; it uses no recovery
attempt and has no attempt limit, because it launches nothing.

Never rebuild a request to recover; reuse the request file. A rebuilt request
for the same target is refused with exit `2` naming the run; present the
refusal and stop, and the human decides.

Once a record has been printed, the "never rerun to retry a stopped run" rule
applies. A rerun of a parked run prints its parked record again and starts
nothing. The short `## Controller run printed elsewhere` record means another
call already printed the run's record; it is not a stopped run to retry and not
a reason to dispose. An exit `3` record is not a reason to launch again while
that run's folder remains: follow the abandoned-run handling under "Capability
preflight".

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
exactly as "Controller invocation" under Reconcile says: through `bash` with
`timeout: 0`, never Eval, the repository root as working directory, and the
request file named by its absolute path in the command. `normalize` runs the
same way.

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs retrace < {absolute request directory}/retrace-request.json
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
rendered record, or the short `## Controller run printed elsewhere` record; `2`
means the controller refused before any launch (invalid request or table,
version pin, model role, model override, missing prompt marker, a different
request for the target of a live, parked or finished run, or an abandoned
controller run as "Capability preflight" defines it); `3` means cleanup was not
established or the run was abandoned, and the record names the unresolved
actor, PID, or folder and `dispose`. The notice, "Stop" and "Call ended without
a record" under Reconcile apply unchanged. Except for a successful
`roles` call, stdout carries only the rendered record, laid out as Retrace's
"Freshness and aggregate" section describes, followed by `## Spend`;
stderr carries the notice and diagnostics. Present stdout
verbatim. Once a record has been printed, never rerun the controller to retry a
stopped or partial scope; a
fresh attempt needs the changed evidence or authority that Retrace's Stops section requires.
After an abandoned-run refusal, ask the human once which listed runs to
dispose and run
`node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
only for runs the human explicitly names; never remove folders or signal
processes by hand and never retry the refused run automatically: after
disposal the human re-invokes. If a `dispose` exits `3`, present that record
verbatim and stop; the human decides. Never dispose or relaunch a live run.

By default the controller binds its models from live `modelRoles`: reviewer A
uses `second_opinion_a`, reviewer B uses `second_opinion_b`, and the scope
evaluator and normalizer use A's pair. An approved request's `models` field
replaces them for that run only, as "Per-run model change" says; the
normalizer always uses the live pair. Do not supply profiles, tools, prompts,
argv, process factories, environments, or an actor graph. A binding changed by
normalization or human table edits is a new approved request, never replay or
replacement of started work.
