# Proposal: controller runs survive a killed caller

Revision 2. It merges the accepted proposal (`sha256:53c0a1da5e99d3a2822c95e2077de141801ed2ee9eda75356bf682c9751ecded`) with the human's refinements of 2026-10-07. Every part of the accepted proposal is kept unless this revision changes it.

## This revision

The accepted design stops a killed call from losing the run. This revision makes the controller, not the agent, keep recovery safe: a broken rule may cost a wait or a refusal, never a second paid run or lost spend.

1. **Identity by meaning.** The request identity covers the request's canonical JSON without `approval`, not its exact bytes. A request with a different meaning for the same target is refused while a run for that target is live, parked or finished.
2. **Visibility.** The caller prints a hand-off notice on stderr. `run.json` keeps each reviewer's spend so far. `roles` lists live, parked and finished runs. `stop` also accepts the launch request instead of a runId.
3. **Fewer states.** One classifier gives each run one of four classes, and one table maps class and command to the action and exit code. A parked run keeps its record until a resume that starts or until `dispose`. That removes the special exit-2 handling of a parked run whose record was already printed.
4. **OMP check.** Every OMP bump checks that the new OMP's `bash` kill does not reach the worker. The check has no reviewer spend; it uses one short print-mode turn of the new OMP.
5. **Live proof required.** The live proof is part of the implementation's acceptance, and its spend is approved with the implementation.

## Problem

On 2026-10-05, five Reconcile launches went out without `timeout: 0`, so OMP's bash tool ran the controller under its 300-second default.

- Launch 1 was killed at 300 seconds. Launches 2 to 5 were cancelled before the kill.
- Every run was left `active` with a dead owner. Each one blocked new runs until a human-approved `dispose`.
- Every run lost its reviewer spend: the controller keeps spend only in memory, so `dispose` reported 0.
- The correction named after launch 1 was never applied in the four retries. In one retry, the stated arguments contradicted the call actually sent. Only a launch through Eval with `timeout: 0` succeeded.
- Today one `cli.mjs` process runs the whole run and has no signal handlers.
- Killing that process leaves the run `active` with a dead owner.
- Preflight then classifies the run as abandoned and refuses every new run until `dispose`.
- An abandoned run cannot be resumed.
- So a single missing tool parameter loses the whole run.

The accepted design fixes that loss, but parts of its recovery still rested on the agent following rules: rerun with byte-identical input, find the runId, and notice a run that keeps spending. It also trusted OMP's current kill scope with nothing to detect a change, and it spread run states over several special exit paths.

## Evidence

- **Tool-call record.** The journal records the five launches with the arguments as sent.
- **How OMP bash kills a call:**
  - `timeout: 0` turns off the deadline. After 60 seconds the call moves to the background and keeps running.
  - The default 300-second deadline sends SIGTERM, then SIGKILL, to the call's process group and to every descendant found by walking parent PIDs.
  - Ending the session cancels every job the same way.
- **Survival probe** on 2026-10-06, run with bash `timeout: 3`:
  - A `detached` + `unref()` child of the still-running caller received SIGTERM at the deadline.
  - A worker started by a helper that had already exited ran its full 20 seconds. Its parent was PID 1 and it had its own process group.
  - So the worker must be handed off through an exiting helper; detaching a direct child is not enough.
- **Current controller behavior:** single process, no signal handlers, the final record goes only to stdout, and `state.json` is written only when a run parks.
- Preflight classifies every run whose owner is gone and that is not parked as abandoned. A parked run with a still-present PID is abandoned too. A live owner does not refuse a new run.
- Disposal observation already polls for ESRCH under a finite post-close bound. A failed disposal blocks success and keeps the folder.
- **Copying the last call.** All five 2026-10-05 launches ran the same command text with the same request path. Launches 1 and 2 sent identical arguments, and so did launches 3, 4 and 5; the two groups differed only in `async: false`. Under this design each copy would have been a correct reattach.
- **Recovery policy.** Only launch 3 broke the execution-recovery policy. Main stopped after it; launches 4 and 5 were retries the human authorized.
- **Partial output.** On 2026-10-07 a bash call with `timeout: 3` wrote one line to stderr and one to stdout, then slept. Both lines appeared in OMP's "Backgrounded" reply and again in the timeout result.
- **Reboot.** The machine rebooted at 03:49 UTC on 2026-10-07. `/tmp` was emptied, including the saved request file and every scratch file of the previous review, and the Eval kernel was lost. A reboot also ends every worker, so it cannot cause a second paid run. Rebuilding a request while a worker still runs can: after a lost kernel, after compaction, or from a new session.
- **Version pin.** `lib/versions.mjs` refuses any omp other than the pinned one before any launch, and bump-omp moves the pin only after its checks pass (ADR-0010, Consequences).
- **The bump agent runs the old OMP.** bump-omp installs the new binary by `mv` while the agent's own session keeps running from the old one. Its quick checks already start the new binary in print mode (`omp -p --no-session --thinking=low` with a short prompt).
- **`dispose` refuses a live run.** It takes a claim, and a claim is refused while a live controller holds the run (`controller.mjs:817-818`, `lib/ports.mjs:81`).
- **Spend.** The controller adds each turn's usage to an in-memory total (`lib/ports.mjs:185-186`) and writes it to disk only at a park (`lib/ports.mjs:236`).
- **Request shapes** (`cli.mjs:57-102`): `reconcile` and `retrace` carry `approval` `{text, at}`; `normalize` has no approval; `resume` carries `repair` `{authority, step}`.
- **Continuation.** The Reconcile skill already counts "normal use of an already-supported observation path for the same pending operation" as continuation, not recovery (`reconcile/SKILL.md:39-40`). Retrace adopts the same policy.

## Design

### 1. Detached worker

- `reconcile`, `resume`, `retrace` and `normalize` still run their preflight in the calling process. A refusal still exits 2 with nothing launched.
- The run itself then executes in one worker process, started by a helper that exits at once. The worker's parent becomes PID 1, and it has its own session and process group, so no kill aimed at the caller reaches it.
- A delegated Reconcile inside Retrace runs in the Retrace worker. It gets no worker of its own.
- The caller chooses the runId and passes it to the worker, so it knows the runId before the worker starts. The helper reports the worker's PID to the caller before it exits.
- The worker confirms the hand-off by seeing its parent PID change. That is the proof that the helper has exited and the worker has been reparented. It creates nothing before that.
- The calling process itself never creates the run folder or a claim.
- The worker's next action creates the run folder and writes its owner claim, the request's identity and target (section 2) and an empty spend so far, together, before any actor starts. It holds the claim until its record is written.
- Nothing is published until that parent PID change. A kill that also kills the worker before then leaves no run folder, no claim and no identity. A following launch is not refused.
- The same kill does not always reach the worker. If the helper exits on an earlier wave, the worker is reparented and the descendant walk misses it. It then publishes its identity and continues. A rerun attaches. Neither case leaves an abandoned run or starts a second run.
- `resume`: the caller checks, before hand-off, in this order. It launches nothing unless the last item says to hand off, and a failed check leaves the run unchanged. In these checks, parked means phase `parked` with `state.json` present, not the section 3 class. That class requires every recorded PID gone, so it cannot be the test for the still-present PID refusal.
  1. If the run folder is missing, it keeps today's handling: exit 1, no parked state, nothing launched.
  2. If this resume's identity is already accepted, this is the same request again (section 3). Do not hand off. Attach and wait if the run is live, including the section 4 notice, and launch no worker. Print a parked or finished record as section 6 says. If the run is abandoned, exit 2, name `dispose`, and do not print an exit 3 record. Never resume twice.
  3. If a live owner holds the run, or the owner's start time cannot be read, exit 2, name the run, and launch nothing. Do not name `dispose`: the owner may still be live.
  4. If the phase is not `parked`, exit 2 and launch nothing. Name the run and both ways to print its record when the run is finished; otherwise name `dispose`. The run's class is unchanged. A recorded PID still present does not change this exit.
  5. If a recorded or matched PID is present, exit 3 and launch nothing. That is today's still-present PID refusal, and it applies only when the phase is `parked`. It says to resume again after those PIDs exit. The phase stays `parked`.
  6. If the repair step is not the parked failed step, exit 1. The record names the parked failed step and says the run stays parked. The caller prints it, and it is not written into the run folder.
  7. Otherwise the phase is `parked`, every recorded or matched PID has exited, and the step matches. Hand off.
- The resume worker mutates the existing run only after it has seen its parent PID change. A kill before that leaves the parked run unchanged. After that it rechecks, in order, and writes nothing unless the last item says to. Parked in this recheck means the same phase predicate as the caller's check.
  1. If this identity is already accepted, start no actors. The caller waits if the owner is live. It prints a parked or finished record as section 6 says. If the run is abandoned, it exits 2, names `dispose`, and does not print an exit 3 record. It does not exit only because this worker exited, and it never resumes twice.
  2. If a live owner holds the claim under a different identity, or that owner's start time cannot be read, write no claim and no record. The caller exits 2, names the run, and does not wait on that other resume. The run's class is unchanged.
  3. If the phase is not `parked`, write no claim and no record, and the caller exits 2. Name both print paths when the run is finished; otherwise name `dispose`. The run's class is unchanged.
  4. If a recorded or matched PID is present and the owner is not live, write nothing. The caller exits 3. The phase stays `parked`.
  5. If the phase is `parked` and the repair step does not match, write no claim and no identity, remove nothing, and the caller exits 1. The run stays parked.
  6. Only then take claim `n+1`, add the resume identity and remove the parked record, atomically, in that same step, before any actor. If that claim is lost, start no actors and apply items 1 and 2 again once. If this identity is now accepted, the caller waits. Otherwise the caller exits 2 and does not start a second resume.
- The worker calls `enterChildEnv` before any runtime. Injected `observePid`, `processStart`, `listProcesses`, the scripted-agent path and the run and session roots are carried across the hand-off. Otherwise the offline suite, the real-process test and the bump check cannot inject them.
- `roles`, `dispose` and `stop` stay in-process and launch no worker.

### 2. Request identity and target

- **Identity:** the lowercase sha256 of the command kind, a NUL, and the request's canonical JSON with `approval` removed. For `resume`, the runId and a NUL come before the canonical JSON.
  - Canonical JSON sorts object keys at every level, has no whitespace between tokens, and keeps array order and every string exactly.
  - So reformatting the file, reordering keys or a new approval time gives the same identity. Changing any word gives a different one.
  - `approval` is left out because it records authority, not meaning. A new approval of the same request attaches to the run that already holds it.
  - A resume's `repair.authority` holds the human's authorization words and the ISO-8601 time they were given. So a later repair of the same run has a new identity even when its words and step repeat. A rerun of a killed resume call reuses its request file and keeps its identity.
- **Target:** what the run works on.
  - `reconcile`: `candidate.identity`.
  - `retrace`: the canonical JSON of its `table`.
  - `normalize`: `root`.
  - `resume`: the runId.
- Before any actor starts, `run.json` holds the run's target and every identity it has accepted: its first request and each resume. A request matches a run when its identity is one of them.
- A request with a different identity but the same target as a live, parked or finished run is refused (section 3). This is the only change to running several runs at once.

### 3. Run classes and actions

One function classifies every run folder, checked in this order:

1. **live:** the highest claim's owner is running (same PID and start time).
2. **parked:** phase `parked`, `state.json` and a parked record with exit 1 present, owner gone, every recorded and matched PID gone.
3. **finished:** owner gone, phase not `parked`, a complete record with exit 0 or 1, every recorded and matched PID gone.
4. **abandoned:** everything else. That includes an owner gone with no record, a record with exit 3, a recorded or matched PID still present, an owner whose start time cannot be read, and a `.init` leftover whose owner is not live.

A new-run request is matched to a run by identity first, then by target. If more than one run matches, the call exits 2, lists them and launches nothing. A `resume` is matched only to the run its runId names. One table then maps the matched run's class and the command to the action:

| Class | Same request again | Different request, same target | `resume` with a new identity | `stop` | `dispose` |
|---|---|---|---|---|---|
| live | Waits with no deadline, then prints the ending record, or exits 3 if the worker died without one | Exit 2; names the run; launches nothing | Exit 2; names the run; launches nothing | Asks the worker to stop, waits, and prints the stopped record (exit 1) | Exit 2: a live owner holds the run, as today |
| parked | Prints the parked record (exit 1); folder, record and `state.json` stay | Exit 2; names the run, `resume` and `dispose` | Resumes the run when the repair step matches and this identity is not yet accepted (section 1) | Prints the parked record (exit 1); stops nothing | Disposes as today |
| finished | Prints the record with its exit code (0 or 1), then removes the folder | Exit 2; names the run and both ways to print its record: the original request, or `stop <runId>` | Exit 2; names the run and both ways to print its record | Prints the record like a rerun; stops nothing | Disposes as today; the unprinted record goes with the folder |
| abandoned | Exit 2: the abandoned-run refusal, naming `dispose` | Exit 2: the abandoned-run refusal | Exit 2 naming `dispose` when the phase is not `parked`; exit 2 naming the run, not `dispose`, when the owner's start time is unreadable; exit 3 when the phase is `parked` and a recorded or matched PID remains | Prints the exit 3 record if one exists, else reports abandoned; exit 3; names `dispose`; removes nothing | Disposes as today |

- A `resume` whose identity its run has already accepted is the same request again. The caller and the resume worker apply that before any parked check, claim, or record removal. So rerunning a killed resume call waits on a live run, prints a parked or finished record, and exits 2 if the run is abandoned. It never resumes twice, including after the run parks again.
- With no matching run, a new-run command starts a new run, unless any abandoned run exists, which refuses with exit 2 as today. `stop` reports that no run exists, with exit 2. `resume` and `dispose` keep today's handling of a missing run.
- Matching comes before the abandoned-run refusal, so attaching to or printing a matched run is never blocked by an unrelated abandoned run.
- A live, parked or finished run never blocks a run for another target. An abandoned run still refuses every new run and `roles` until `dispose`, as today. `resume`, `dispose` and `stop` judge only their own run.
- The waiting call (section 5) uses the same classifier when the worker is gone, then follows section 5. This table applies to a new command that finds the run already in that class, not to a call that waited through the worker's exit.

### 4. Hand-off notice

- Right after the hand-off, and on every call that attaches to a live run, the waiting call writes three lines to stderr, each starting with `acp-controller:`:
  1. the runId, the worker PID and the target;
  2. "If this call ends without a record, run this same command again; it attaches to this run and starts nothing.";
  3. "Stop it only on the human's instruction: `node <absolute path of cli.mjs> stop <runId>`.";
- OMP shows a call's partial output when it backgrounds or kills the call, so the notice reaches the agent in the same result that reports the timeout.
- Stdout still carries only the record.

### 5. The calling process waits

- After the hand-off, the caller waits with no deadline until either the worker's record appears or the worker is observed gone. A record that appears is printed as section 6 says. When the worker is gone, the caller checks for the record once more and prints it the same way if it is there. If there is still no record, and this worker published a claim or an identity and the run is not parked, the waiting call exits 3 and names the abandoned run (section 10). That exit 3 belongs to the waiting call. A later rerun of the same request uses the table and exits 2; it does not start a second run.
- If the worker is gone and never created the run folder, nothing was launched, and the call exits 2.
- If the worker exits without writing a claim or a record, the caller leaves the existing run unchanged and does not treat that as abandonment. It applies section 1's recheck in the same order, using phase `parked` rather than the section 3 class. When this identity is already accepted, it waits if the run is live, prints a parked or finished record as section 6 says, and exits 2 naming `dispose` if the run is abandoned. It does not print an exit 3 record, and it does not exit merely because this worker exited. It exits 2 when another identity holds the run live, or when the phase is not `parked`. It exits 3 only when the phase is `parked` and a recorded or matched PID is present while the owner is not live. It exits 1 when the phase is `parked` and the repair step does not match. Otherwise it exits 2.
- A waiting call whose parked run is taken by a `resume` keeps waiting on the resumed run and prints its record.
- The wait only observes the run folder and the worker's PID through the existing signal-0 check. It never signals, restarts or replaces the worker, and time passing never ends the wait or causes a failure.

### 6. The record stays in the run folder until printed

- The worker first disposes every actor, each with observed exit, as today. It completes the existing cleanup of everything except the run folder. It then writes the record and its exit code atomically into the run folder. The exit code is 3 if cleanup was not established.
- The worker writes only exit 0, 1 or 3. It never writes exit 2.
- At a park, the worker writes the record before it sets phase `parked`, so every parked run has its record.
- The waiting call reads the whole record, prints it word for word on stdout, and exits with the same code. It removes nothing until that print has been written to stdout.
- After the print, it removes the run folder only for a finished run: exit 0 or 1, cleanup established, not parked.
- A parked run keeps its folder, `state.json` and record until a resume that starts, or `dispose`. A resume that does not start leaves them. Every rerun of the same request prints the same parked record again.
- When the exit code is 3, the call prints the record and removes nothing. The folder stays, the run stays abandoned, and the record names `dispose`.
- Several calls may wait on one run, and each one that has read the record prints it.
- A waiting call that had already matched the run, and then finds the folder removed after another call printed the record, prints a short record that names the run as already printed elsewhere, with exit 1. It does not start another run. A call that never matched a run does not use this outcome.

### 7. Spend so far

- After every reviewer turn and every disposal, the worker writes each actor's spend so far into `run.json`, in the same atomic write that already records PIDs and session ids.
- `dispose`, the abandoned-run refusal lines and the `roles` run list report it, so a dead worker's spend is no longer reported as 0.
- A record's `## Spend` stays the account of a run that ends with a record.

### 8. Visible runs

- `roles` runs before every Reconcile brief and every Retrace table. When any run is live, parked or finished, it adds a `Controller runs` list after its models note: runId, kind, class, target, start time, worker PID while live, and spend so far.
- The brief and the table already show the `roles` stdout verbatim, so the human sees any run still spending before approving another.
- The list only reads run folders and launches nothing.

### 9. Stopping on purpose

- Cancelling a call no longer stops a run. `stop` is the deliberate stop, used only on the human's explicit instruction, as `dispose` is.
- `stop` has two forms:
  - `cli.mjs stop <runId>`;
  - the launch command with `stop` before its subcommand and the same request on stdin, for example `cli.mjs stop reconcile < request.json`. It selects the run as section 3 matches that request, so it also finds a run whose request was rebuilt.
- The runId is in the notice, in the `roles` list and in the run-folder name. Guidance forbids disposing a run, signalling any process or starting another run to find a runId.
- `stop` writes a stop request into the run folder and launches no worker.
- The worker learns the request in two ways, and neither is a timer:
  - a filesystem notification on its run folder;
  - a read at every step boundary: before it starts an actor request, and when an artifact application, reread or validation step ends.
- Neither ends, fails, retries, replaces or signals anything because time has passed.
- The worker acts on the stop at once, including while reviewer requests are pending. The exception is an artifact application, reread or validation step that is running. The stop never interrupts such a step and takes effect after the step ends.
- When it acts, the worker:
  - does not park and starts no other actor request;
  - cancels its pending reviewer requests through the adapter's existing cancellation signal, an explicit abort under D31 item 4 (nothing is resent, and only replies already received are kept);
  - disposes its actors with observed exit;
  - writes a "stopped" record (exit 1).
- It does not discard a terminal record it has already started to write.
- `stop` waits with no deadline only while the worker is live. When the worker is gone, it acts on the run's class as section 3 says. It never waits after the worker is gone.
- No process is signalled, so the controller still sends no termination signal.

### 10. The worker dies without a record

- After a SIGKILL of the worker, the waiting call reports the run as abandoned, with exit 3. The existing `dispose` path applies and reports the spend so far. A later rerun of the same request exits 2, names `dispose`, and does not start a second run.
- This covers only a run whose claim or identity was published and that is not parked. A worker that exits without writing either follows section 1 and section 5, not the exit 3 path above.

### 11. OMP kill-scope check in bump-omp

- The bump agent's own session still runs the old OMP after the install, so its `bash` tool cannot test the new kill scope. The check therefore runs in a new print-mode session of the newly installed binary.
- bump-omp gains one step, run on every bump after the quick checks, with no reviewer spend:
  1. A check script in the controller's test fixtures prepares a new folder under `/tmp`. It holds a fake `omp` that prints the pinned version, answers `config list --json` with scripted roles and runs the scripted ACP agent for `acp`; a scripted plan whose first reviewer turn takes about 20 seconds; and run and session roots inside that folder. The script prints one command, which runs the CLI with those roots.
  2. The bump agent runs `~/.local/bin/omp -p --no-session --thinking=low` with a fixed prompt. The prompt tells that session to run the command through its `bash` tool with `timeout: 5`, then run it again with `timeout: 0`, and to reply with both tool results word for word. This is one short agent turn, like the quick check, and no reviewer spend.
  3. Pass: the first result shows OMP's timeout and the notice; the second shows the final record with exit 0; the scripted log shows one start per reviewer; and the folder's run and session roots are empty afterwards.
- A failure rolls the bump back like any failed check, so the old OMP, whose kill scope passed, stays installed.
- The check must run through the new OMP's own `bash` tool, because only that tool applies OMP's kill rules. The offline suite's simulated kill (acceptance item 1) cannot detect an OMP change.

### 12. Guidance

- The driver, the Reconcile and Retrace skills, bump-omp and `agent-return.md` say:
  - Run controller calls only through `bash`, with the request in a file named by absolute path in the command. Never launch through Eval or with a path held in a variable. The last controller command in the transcript is then a complete recovery.
  - `timeout: 0` stays the normal path, because it needs the fewest calls.
  - When a controller call ends without a record (timed out, cancelled or killed), run the same command again, preferably with `timeout: 0`. That rerun is the skills' "already-supported observation path for the same pending operation", which they count as continuation. It uses no recovery attempt and has no attempt limit, because it launches nothing.
  - It attaches to the same run and launches nothing, unless the earlier attempt died before the worker published an identity.
  - Never rebuild a request to recover; reuse the request file. If a rebuilt request is refused as the same target, present the refusal and stop; the human decides.
  - A resume request's `repair.authority` quotes the human's authorization words with the time they were given. Each new repair gets a new request file.
  - Show the `roles` stdout verbatim, including its `Controller runs` list.
  - Use `stop` only on the human's explicit instruction. When the runId is not at hand, use the request form.
  - The existing "never rerun to retry a stopped run" rule still applies once a record has been printed. A rerun of a parked run prints its parked record again and starts nothing. The short already-printed record is not a stopped run to retry and not a reason to dispose.
  - An exit 3 record is not a reason to launch again while that folder remains.
  - Never dispose or relaunch a live run. Use `stop` to end one.
  - The Eval timeout rules in `agent-return.md` are not the controller invocation contract and stay unchanged.
- bump-omp also adds section 11's check to its Procedure, to the Policy's list of what the invocation authorizes (including its print-mode turn), and to Failure as a check that rolls back.

### 13. ADR

- Amend ADR-0010 D31 in place with one new item:
  - each run executes in one detached worker that owns its sessions, its run claim and its spend so far;
  - the invoking command only waits for that worker's record or observed exit, with no deadline; it is not a caller timer or a supervisor;
  - a request attaches to the run that holds its identity, and a different request for the same target is refused while that run is live, parked or finished;
  - a deliberate stop is an explicit abort, requested through the run folder; the worker observes that request through a folder notification or at a step boundary.
- In the same change, amend item 4 and the "Caller-owned timers or external supervisors" rejected alternative. Both name this deadline-free wait as permitted observation. Time passing does not end it, fail it, retry, replace or signal.
- Neither text calls that wait the only observation over time. Neither forbids:
  - the existing bounded post-close ESRCH observation;
  - the existing uncertain-delivery observation;
  - the worker's notification and step-boundary read of a stop request.
- Both still forbid a timer or poll that ends, fails, retries, replaces or signals a pending reviewer request, and both still forbid polling to manufacture completion.
- Amend the Consequences line on version pins: a different version is refused until the offline suite, the hand-off kill check and the live runs the bump-omp skill selects pass on it.
- Record the amendment under the ADR's Supersession section: it amends D31 in place and supersedes no other decision ID or record.
- Add a dated approval line, add the rejected alternatives below, and update the ADR-0010 line in `docs/adr/INDEX.md` to mention the detached worker.

## Rejected alternatives

- **Any fix that still depends on a tool parameter,** such as stronger wording or switching to Eval with `timeout: 0`: a missed parameter still loses the run.
- **A dedicated OMP custom tool:** it runs inside the OMP session, so ending the session still aborts the run. ADR-0010 also already moved away from an in-session extension.
- **Parking the run on SIGTERM or SIGHUP:**
  - After the detach, the caller's signals never reach the worker.
  - Parking in the middle of a reviewer turn would mean sending that request again, which D31 item 4 forbids.
  - It cannot handle SIGKILL.
- **A separate `attach <runId>` command:** a killed call may never have shown the runId. Rerunning the same command is safe and needs nothing extra.
- **Keeping a finished run's record until `dispose`:** every finished run would need a manual cleanup.
- **Exact-byte identity with a rule never to rebuild the request:** recovery would again depend on the agent following a rule, and a rebuilt request would start a second paid run.
- **Identity by meaning without the same-target refusal:** a rebuild that changes one word would still start a second run on the same candidate.
- **Only the live proof to catch an OMP kill-scope change:** nothing would notice a change between proofs.
- **Running the bump check through the bump agent's own `bash`:** that session still runs the old OMP, so the check would never test the new one.
- **A claim index in the resume identity:** rerunning a killed resume call after the run parked again would resume a second time and spend twice.
- **Removing a parked run's record after printing** (the accepted design): it needed special exit-2 handling. Keeping the record until `resume` or `dispose` removes it.

## Change targets

- **Controller:** `.config/agents/harnesses/omp/acp-controller/`
  - `cli.mjs`, including the `stop` command and the `roles` run list
  - `controller.mjs`
  - `lib/ports.mjs`
  - `lib/env.mjs`
  - `lib/preflight.mjs`
  - a worker entry point
- **Tests:** `test/preflight.test.mjs`, `test/reconcile.test.mjs`, `test/retrace.test.mjs`, the scripted ACP agent fixture (a slow turn) and the bump-omp check script.
- **Guidance:**
  - `driver.md`: capability preflight, the roles check, controller invocation, resume (including the repair authority's time), dispose, a new "Stop" section and a new "Call ended without a record" section
  - `.config/agents/skills/reconcile/SKILL.md`, including its execution-recovery adoption
  - `.config/agents/skills/retrace/SKILL.md`, including its execution-recovery adoption and the table's roles check
  - `.config/agents/skills/bump-omp/SKILL.md`
  - `.config/agents/harnesses/omp/agent-return.md`
  - the reviewer protocol, the human projections and any eval fixture, wherever the change contradicts their wording, as ADR-0010's Verification expectations require
- **Records:** `docs/adr/0010-replacement-lifecycle-plugin.md` and `docs/adr/INDEX.md`.

## Out of scope

- Changing the generic execution-recovery policy. It already forbade the third identical launch; the failure was compliance.
- Any other change to running several runs in parallel. Only the same request attaches, and only a different request for the same target is refused. Two overlapping first launches of the same request, before either identity exists, are not closed with a new lock.
- Keeping a printed run's identity after its folder is removed.

## Acceptance

Items 1 to 12 and 14 are offline, with no model spend. Item 13 has no reviewer spend and one short print-mode agent turn:

1. **Killed caller.** A real-process test using the scripted ACP agent kills the waiting call's process group and every descendant, SIGTERM then SIGKILL, the way OMP does.
   - The worker finishes.
   - Running the same command again prints the identical record once, with the same exit code.
   - Only one run folder and one set of actors ever existed.
2. **Killed during the hand-off.** The same kill, sent before the worker has published an identity, has two allowed outcomes. If the worker dies, there is no run folder, no claim and no identity, and a following launch is not refused. If the helper exits first, the worker survives, publishes one identity, and a rerun attaches. Neither outcome leaves an abandoned run or starts a second run.
3. **Rerun while live.** Running the same command while the worker runs waits on that run; no second run starts. A copy of the request with its keys reordered, its whitespace changed and a new approval time also attaches. The identity and target are in the folder before any actor starts.
4. **Same target, different meaning.** A request for the same candidate with one changed Intent word, sent while the first run is live, parked or finished, exits 2, names that run and launches nothing. A request for a different target starts its own run.
5. **Finished, not yet printed.** While a finished run's record waits in its folder, a request for another target and `roles` are not refused, and a rerun of the same command prints that record.
6. **Cleanup not established.** The worker writes exit 3 and the waiting call prints it. The folder remains. A different new run and `roles` are refused. `dispose` then works. The same command does not start a second run.
7. **Worker killed.** SIGKILL to the worker mid-run makes the waiting call exit 3 and name the abandoned run. `dispose` then works as today and reports the spend recorded before the kill, not 0. The same command does not start a second run.
8. **Stop.**
   - `stop <runId>` on a live run prints a stopped record (exit 1). Every actor's exit is observed, and the folder is removed after printing.
   - The request form stops the same run, including with a rebuilt request that has one changed word.
   - A stop sent during a pending reviewer turn cancels that turn without waiting for its reply, and no request is resent.
   - A stop sent during an artifact application takes effect only after that step ends, and it does not park.
   - A stop that finds the worker already gone acts on the run's class as section 3 says and returns. It does not wait.
9. **Park and resume.**
   - A parked run's record prints with exit 1, and its folder, record and `state.json` remain.
   - Rerunning the original command prints the same parked record again with exit 1 and starts nothing.
   - `resume` continues with the same reviewers, through the worker. A call still waiting on the original request prints the resumed run's record.
   - Rerunning the same `resume` waits on that resumed run. After that run parks again, the same `resume` prints the new parked record and resumes nothing; a resume with a new repair resumes it.
   - A resume of a finished run exits 2, names the run and both ways to print its record, launches nothing, and does not dispose it.
   - A resume of a run whose phase is not `parked`, and that is not finished, exits 2, names `dispose`, launches nothing, writes no exit 2 record, and leaves that run's class unchanged, even when a recorded PID is still present.
   - A resume of a phase-`parked` run whose recorded PID is still present exits 3, says to resume again after those PIDs exit, and leaves the phase `parked`.
   - A new resume whose repair step is not the parked failed step exits 1 in the caller, launches nothing, writes no claim and no identity, removes nothing, and leaves the run parked.
   - A rerun of a resume whose identity the run has already accepted does not resume again: it waits while that run is live, prints the parked record after the run parks again, and exits 2 naming `dispose` if that run is abandoned, without printing an exit 3 record.
   - A new repair sent while a resume is live exits 2, names that run, and launches nothing. If its worker already started and then loses the claim to a different identity, it also exits 2 and does not print that other resume's record.
10. **One table.** Each cell of the section 3 table has one test, run through `main` with injected processes.
11. **Notice and visible runs.** The caller's stderr shows the notice right after the hand-off, and its stdout holds only the record. `roles` lists a live run and a finished run, each with its spend so far.
12. **Existing checks.** The existing offline suite passes, the A5 static checks stay at 0 violations, and `node --check` passes for every controller file.
13. **Bump check.** The section 11 check passes once on the installed OMP, run in a new print-mode session of that OMP as that section says.
14. **Review.** Standard review and independent verification of the implementation, as ADR-0010 requires.

Required. It spends on live models, and that spend is approved with the implementation:

15. **Live proof.**
    1. From a new OMP session, run bump-omp's L1, with both models at `:low`, with one change: the first `reconcile` call goes through `bash` with `timeout: 30`, so OMP kills it. The session's prompt does not mention a rerun.
    2. The first call's result must show OMP's timeout and the notice. If the first call ends before the kill, the proof has not passed; the session reports it, and the human decides on a repeat.
    3. Prompted only by the notice, that session runs the same command again. The rerun must print the parked record (exit 1).
    4. Repair and resume then finish as L1 says.
    5. Pass: L1's own pass and cleanup checks hold, and one run with one pair of reviewer sessions existed over the whole proof, so spend is counted once.
    - The implementation's Route Overview asks for this spend up front. The implementation is not complete until the live proof passes.

## Risks

- A worker keeps running and spending after its OMP session ends, until it finishes or the human runs `stop`. The notice and the `roles` list make it visible; nothing stops it automatically.
- A finished run whose record is never asked for keeps its folder until `dispose`. An exit 3 run also keeps its folder until `dispose`, and it keeps refusing new runs.
- Removing the run folder after a successful print also removes `run.json`, so a later rerun cannot attach. If that print never reaches the agent, the same request would start a new run [INFERENCE: rare]. This remains only because the human chose removal after print.
- Leaving `approval` out of the identity means a new approval of the same request attaches to the earlier run while its folder exists. That is intended.
- The same-target refusal also blocks a deliberately changed request for the same candidate while the earlier run is live, parked or finished. The human then waits for, stops, resumes or disposes that run first.
- A kill during hand-off can reap the helper first. The worker then survives and a rerun attaches. That is the intended outcome, not a failed kill.
- Spend so far lives in `/tmp` with the run folder. A reboot ends the worker and loses both.
- The bump check covers OMP's deadline kill. Session-end cancellation takes the same kill path in OMP 18.1.21's source, but no check exercises it.
- The bump check relies on a print-mode model following a fixed prompt. Pass requires the timeout to appear in the first result, so a skipped timeout fails the bump rather than passing it.
- A parked folder written before this change has no parked record, so the new classifier calls it abandoned. Run folders live in `/tmp`. Dispose such a folder; do not resume it.
