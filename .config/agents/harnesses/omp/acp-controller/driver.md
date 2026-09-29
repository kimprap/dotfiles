## Reconcile

### Capability preflight

1. Capability preflight belongs to the controller and runs before any launch.
   It refuses with exit `2` and a `## Controller refused` record on an invalid
   request, `omp --version` or acpx other than the versions pinned in
   `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs`, a missing
   or unparsable model role (`modelRoles.second_opinion_a`
   for A and `modelRoles.second_opinion_b` for B, each `<model>:<thinking>`),
   a missing or duplicated reviewer prompt marker, or an
   abandoned controller run (owner gone and not parked; live and parked runs of
   other sessions never refuse). Present a refusal verbatim and stop. After an
   abandoned-run refusal, ask the human once which listed runs to dispose and
   run `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose {runId}`
   only for runs the human explicitly names; never remove folders or signal
   processes by hand and never retry the refused run automatically: after
   disposal the human re-invokes. If a `dispose` exits `3`, present that record
   verbatim and stop; the human decides. Do not patch the host,
   supply profiles, argv, models, tools, prompts, process factories or
   environment, substitute task/hub/Eval transport, emulate both roles with one
   actor, or weaken a seam.

### Roles check before each brief

Immediately before rendering each brief, including a revised one, run
`node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` through `bash`
from the repository root with no request body. It runs the Reconcile capability
preflight above and launches nothing. On exit `2`, present its refusal verbatim and
stop. On exit `0`, show its `Models:` list stdout verbatim directly after
the brief's reply line. The list reports reviewer A's and B's model and
thinking level from live `modelRoles`; it is not a brief field, is not part of
the approval binding, and no approval changes it. An adjustment naming models
is a conflicting adjustment under the Reconcile brief adjustment rule.

### Controller invocation

After approval, write the approved binding as one JSON object to a
session-local scratch file; it is the controller's only input channel:

```json
{
  "goal": "{Goal}",
  "candidate": {"identity": "{exact identity}", "text": "{complete proposal}"},
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
artifact-native validator. `cap` is `none` or the approved positive integer.
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
request or table, version pin, model role, missing prompt marker, or an
abandoned controller run: owner gone and not parked; live and parked runs of
other sessions never refuse); `3` means cleanup was not established and the
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

The controller binds its models from live `modelRoles`: reviewer A uses
`second_opinion_a`, reviewer B uses `second_opinion_b`, and the scope evaluator
and normalizer use A's pair. Do not supply profiles, tools, prompts, models,
argv, process factories, environments, or an actor graph. A binding changed by
normalization or human table edits is a new approved request, never replay or
replacement of started work.
