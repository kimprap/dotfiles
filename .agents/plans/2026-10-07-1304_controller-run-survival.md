# Controller runs survive a killed caller

**Datetime**: 2026-10-07-1304
**Scope**: ACP controller detached worker, request matching by meaning, run classes and command table, stop, roles run list, guidance, ADR-0010 amendment and the bump-omp kill-scope check
**Summary**: Each controller run executes in a detached worker that owns its sessions, claim and spend so far; the calling command only waits for its record, so a killed call loses nothing and a rerun of the same request attaches; one classifier and one table decide every command; guidance, ADR-0010 and bump-omp follow; an offline suite, one bump check and one live L1 proof show it.
**Status**: DONE
**Completed At**: 2026-10-07-2229

## Outcome and authority

- Outcome: `reconcile`, `resume`, `retrace` and `normalize` keep their preflight in the calling process and then run in one worker handed off through an exiting helper (parent PID 1, own session and process group); the caller waits with no deadline for the worker's record or observed exit and prints the record, so a killed, timed-out or cancelled call loses no run and a rerun of the same request attaches and starts nothing. Requests match by meaning (sha256 of kind, NUL and canonical JSON without `approval`; resume prefixes its runId); a different request for the same target is refused while a run for that target is live, parked or finished. One classifier (live, parked, finished, abandoned) and one table map class and command to the action and exit code. The record and its exit code stay in the run folder until printed; a finished folder is removed after the print; a parked run keeps folder, record and `state.json` until a resume that starts or `dispose`. Spend so far persists in `run.json`. `stop <runId>` and `stop <subcommand> < request` are the deliberate stop. `roles` lists live, parked and finished runs. The driver, the Reconcile, Retrace and bump-omp skills and `agent-return.md` carry the proposal §12 guidance; ADR-0010 D31 is amended in place; bump-omp gains the kill-scope check; the bump check passes once on the installed OMP and one live L1 proof from a new OMP session passes with spend counted once.
- Authority: Proposal `.agents/artifacts/2026-10-07_controller-run-survival-proposal.md` ("Proposal: controller runs survive a killed caller", revision 2, SHA-256 `ec7407c77cdc8c0b85844f172d492e8ef3f71ae6c6b0d413f9edb7751dab68c2`, byte-identical to `~/.local/state/controller-run-survival/proposal-2-accepted.md`), accepted by Reconcile run 2 (both reviewers and closure VALID) on approval "approve" at 2026-10-07T04:35:37.798Z, confirmed as the implementation basis ("approve", 2026-10-07T05:47:06.089Z); implementation Route Overview approved with its live-model spend ("approve", 2026-10-07T05:49:41.704Z). Baseline HEAD `94549cd`. The proposal owns the design (§1–13), rejected alternatives, Change targets, Out of scope, Acceptance 1–15 and Risks; this plan only partitions it. Proposal acceptance 1–13 and 15 map to AC-1…AC-21; acceptance 14 is this plan's Assurance.
- Assurance: standard

## Scope and effects

- Scope: Exactly the proposal's Change targets, partitioned by concern. `C` below is `.config/agents/harnesses/omp/acp-controller`. T1 builds the run model in-process: identity and target, the four-class classifier, request matching, the §3 table for every command except waiting on a live run and `stop`, records written into the run folder and printed from it, and spend so far in `run.json`. T2 moves every run into the worker and adds the hand-off, the deadline-free wait, the notice, the resume worker recheck, `stop`, the `roles` run list and the scripted agent's slow turn. T3 writes the guidance, the ADR-0010 and INDEX amendment and the kill-scope check script with its bump-omp step, then runs the bump check and the live proof. Shared files carry a concern qualifier per task; a later task may change any line of a shared file for its own concern and keeps every earlier AC passing. An `RS` check below means `node --test --test-reporter=tap --test-name-pattern '<pattern>' test/*.test.mjs` with cwd `C` (Node 26.3.1 on PATH); test names start with the stated `RS` prefix.
- Effects: Working-tree edits to the Targets only; two new repository files, `C/worker.mjs` and `C/test/fixtures/kill-scope-check.mjs`; the authority copy under `.agents/artifacts/` (already written, hash above); offline suites, `node --check` and the A5 scan (`python3 ~/.local/state/controller-run-survival/a5-scan.py` from the repository root); test scratch under `/tmp`, removed by each test; evidence under `~/.local/state/controller-run-survival/`; one short print-mode turn of `~/.local/bin/omp` for AC-20; one live L1 proof for AC-21 from a new print-mode OMP session with a retained journal and both reviewer models at `:low`, including its validator repair and resume. Every test and live run disposes its actors with observed exit and removes its `/tmp` folders; the kill-scope check folder and the L1 `<dir>` are removed by the role that made them once their evidence is saved; no process is signalled by hand except a test's own simulated kills of the processes it started. No git staging, commit, checkout or push; no OMP install, settings, model-role or `node_modules` change; `.agents/papercuts.json` stays untouched.
- Non-goals: The proposal's Out of scope (the generic execution-recovery policy, any other parallel-run change including a lock for two overlapping first launches, keeping a printed run's identity); `C/lib/adapter.mjs`, `C/lib/versions.mjs`, `C/package.json`, `C/package-lock.json` and every other controller file not in Targets; frozen artifacts, archived plans and the production spec; the Eval timeout rules in `agent-return.md`; skills, rules and references not in Targets; repeating a paid run.

## Tasks

- [x] T1. Match requests by meaning and keep run records and spend so far in the run folder
  completed 2026-10-07-1406
  - Owner: controller-run-survival-t1-child
  - Depends on: none
  - Targets: .config/agents/harnesses/omp/acp-controller/cli.mjs (request identity matching and class actions), .config/agents/harnesses/omp/acp-controller/controller.mjs (run records and spend so far), .config/agents/harnesses/omp/acp-controller/lib/ports.mjs (run identity and record files and spend so far), .config/agents/harnesses/omp/acp-controller/lib/env.mjs (run folder and run.json files), .config/agents/harnesses/omp/acp-controller/lib/preflight.mjs (run classes and request matching), .config/agents/harnesses/omp/acp-controller/test/fixtures/scripted-acp-agent.mjs (run-model observations), .config/agents/harnesses/omp/acp-controller/test/preflight.test.mjs (run-model tests), .config/agents/harnesses/omp/acp-controller/test/reconcile.test.mjs (run-model tests), .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs (run-model tests)
  - Acceptance: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
  - Receiver: route-agent dev-implementation controller

- [x] T2. Run every run in a detached worker with a waiting caller, the notice, stop and the roles run list
  completed 2026-10-07-1549
  - Owner: controller-run-survival-t2-child
  - Depends on: T1
  - Targets: .config/agents/harnesses/omp/acp-controller/worker.mjs, .config/agents/harnesses/omp/acp-controller/lib/env.mjs (worker hand-off and child environment), .config/agents/harnesses/omp/acp-controller/cli.mjs (hand-off and wait and notice and stop and roles run list), .config/agents/harnesses/omp/acp-controller/controller.mjs (worker run and stop observation), .config/agents/harnesses/omp/acp-controller/lib/ports.mjs (worker claim and stop request), .config/agents/harnesses/omp/acp-controller/lib/preflight.mjs (resume recheck and roles run list), .config/agents/harnesses/omp/acp-controller/test/fixtures/scripted-acp-agent.mjs (slow turn and worker observations), .config/agents/harnesses/omp/acp-controller/test/preflight.test.mjs (worker and stop tests), .config/agents/harnesses/omp/acp-controller/test/reconcile.test.mjs (worker and stop tests), .config/agents/harnesses/omp/acp-controller/test/retrace.test.mjs (worker tests)
  - Acceptance: AC-8, AC-9, AC-10, AC-11, AC-12, AC-13, AC-14, AC-15
  - Receiver: route-agent dev-implementation controller

- [x] T3. Update guidance and ADR-0010, add the kill-scope check, and run the bump check and the live proof
  completed 2026-10-07-2201
  - Owner: controller-run-survival-t3-child
  - Depends on: T2
  - Targets: .config/agents/harnesses/omp/acp-controller/test/fixtures/kill-scope-check.mjs, .config/agents/harnesses/omp/acp-controller/driver.md, .config/agents/skills/reconcile/SKILL.md, .config/agents/skills/retrace/SKILL.md, .config/agents/skills/bump-omp/SKILL.md, .config/agents/harnesses/omp/agent-return.md, .config/agents/skills/reconcile/references/reviewer-protocol.md (contradicted wording only), .config/agents/skills/reconcile/evals/evals.json (contradicted wording only), .config/agents/skills/retrace/evals/evals.json (contradicted wording only), docs/adr/0010-replacement-lifecycle-plugin.md, docs/adr/INDEX.md (ADR-0010 line only)
  - Acceptance: AC-16, AC-17, AC-18, AC-19, AC-20, AC-21
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-1. Identity by meaning
  Behavior: The identity is the lowercase sha256 of the command kind, a NUL and the canonical JSON (keys sorted at every level, no whitespace, arrays and strings exact) without `approval`, with the runId and a NUL first for `resume`; the target is `candidate.identity`, the canonical JSON of the Retrace `table`, the normalize `root` or the resume runId; `run.json` holds the target and every accepted identity before any actor starts; a copy with keys reordered, whitespace changed and a new approval time matches the existing run, and one changed word does not (proposal §2, acceptance 3).
  Check: `RS` check with pattern `^RS3 identity:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-2. Same target with a different meaning is refused
  Behavior: A request for the same candidate with one changed Intent word, sent while the first run is live (injected live owner), parked or finished, exits 2, names that run and launches nothing; a request for a different target starts its own run; more than one matching run exits 2, lists them and launches nothing (proposal §3, acceptance 4).
  Check: `RS` check with pattern `^RS4:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-3. A finished record waits for its print
  Behavior: While a finished run's record waits in its folder, a request for another target and `roles` are not refused, and a rerun of the same command prints that record word for word with its exit code and then removes the folder (proposal §6, acceptance 5).
  Check: `RS` check with pattern `^RS5:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-4. Cleanup not established keeps the folder
  Behavior: The run writes its record with exit 3 into the folder after cleanup and the call prints it; the folder remains; a different new run and `roles` are refused; `dispose` then works; the same command does not start a second run (proposal §6, acceptance 6).
  Check: `RS` check with pattern `^RS6:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-5. Spend so far persists
  Behavior: `run.json` holds each actor's spend so far after every reviewer turn and every disposal, in the same atomic write that records PIDs and session ids; `dispose` and the abandoned-run refusal lines report it for a run that ended without a record, not 0; a record's `## Spend` stays the account of a run that ends with a record (proposal §7, acceptance 7 spend part).
  Check: `RS` check with pattern `^RS7 spend:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-6. Park and resume through the caller's checks
  Behavior: A parked run's record prints with exit 1 and its folder, record and `state.json` remain; rerunning the original command prints the same parked record and starts nothing; `resume` continues with the same reviewers, and after the run parks again the same resume prints the new parked record and resumes nothing while a resume with a new repair resumes it; a resume of a finished run exits 2 naming the run and both ways to print its record, launches nothing and does not dispose it; a resume of a run whose phase is not `parked` and that is not finished exits 2 naming `dispose`, launches nothing, writes no exit 2 record and leaves its class unchanged even with a recorded PID present; a resume of a phase-`parked` run with a recorded PID present exits 3, says to resume again after those PIDs exit and leaves the phase `parked`; a new resume with a step other than the parked failed step exits 1 in the caller, launches nothing, writes no claim and no identity and removes nothing; a rerun of an accepted resume whose run is abandoned exits 2 naming `dispose` without printing an exit 3 record; a new repair sent while a resume is live (injected live owner) exits 2, names that run and launches nothing (proposal §1 resume checks 1–7, acceptance 9 caller part).
  Check: `RS` check with pattern `^RS9:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-7. Table cells outside waiting and stop
  Behavior: Each of the 15 cells of the proposal §3 table other than live with the same request and the `stop` column has exactly one test run through `main` with injected processes, named `RS10 <class>/<command>:` with class `live`, `parked`, `finished` or `abandoned` and command `same`, `other`, `resume`, `stop` or `dispose` (acceptance 10 part).
  Check: `RS` check with pattern `^RS10 (live/(other|resume|dispose)|(parked|finished|abandoned)/(same|other|resume|dispose)):`; expect exit 0, `# tests 15`, `# pass 15`, `# fail 0`.

- [x] AC-8. Killed caller
  Behavior: A real-process test using the scripted ACP agent kills the waiting call's process group and every descendant, SIGTERM then SIGKILL as OMP does; the worker finishes; running the same command again prints the identical record once with the same exit code; only one run folder and one set of actors ever existed (acceptance 1).
  Check: `RS` check with pattern `^RS1:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-9. Killed during the hand-off
  Behavior: The same kill sent before the worker has published an identity has two allowed outcomes: the worker dies and there is no run folder, claim or identity and a following launch is not refused; or the helper exits first, the worker survives, publishes one identity and a rerun attaches; neither outcome leaves an abandoned run or starts a second run (acceptance 2).
  Check: `RS` check with pattern `^RS2:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-10. A rerun while live attaches
  Behavior: Running the same command while the worker runs waits on that run with no deadline and starts no second run; a copy with keys reordered, whitespace changed and a new approval time also attaches; the identity and target are in the folder before any actor starts (acceptance 3 live part).
  Check: `RS` check with pattern `^RS3 live:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-11. Worker killed mid-run
  Behavior: SIGKILL to the worker mid-run makes the waiting call exit 3 and name the abandoned run; `dispose` then works as today and reports the spend recorded before the kill, not 0; the same command exits 2 naming `dispose` and does not start a second run (acceptance 7).
  Check: `RS` check with pattern `^RS7 kill:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-12. Stop
  Behavior: `stop <runId>` on a live run prints a stopped record (exit 1), every actor's exit is observed and the folder is removed after printing; the request form stops the same run, including with a rebuilt request that has one changed word; a stop during a pending reviewer turn cancels it without waiting for its reply and resends nothing; a stop during an artifact application takes effect only after that step ends and does not park; a stop that finds the worker already gone acts on the run's class as §3 says and returns without waiting; no process is signalled (proposal §9, acceptance 8).
  Check: `RS` check with pattern `^RS8:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-13. Park and resume through the worker
  Behavior: `resume` runs in a worker with the same reviewers; a call still waiting on the original request prints the resumed run's record; rerunning the same `resume` waits on the resumed run; a new repair whose worker already started and then loses the claim to a different identity exits 2 and does not print that other resume's record (proposal §1 resume worker recheck 1–6, acceptance 9 worker part).
  Check: `RS` check with pattern `^RS9 worker:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-14. The whole table has one test per cell
  Behavior: Live with the same request and the four `stop` cells each have exactly one test through `main` with injected processes, so with AC-7's cells each of the 20 cells of the §3 table has exactly one test (acceptance 10).
  Check: `RS` check with pattern `^RS10 `; expect exit 0, `# tests 20`, `# pass 20`, `# fail 0`.

- [x] AC-15. Notice and visible runs
  Behavior: Right after the hand-off the caller's stderr shows three lines starting `acp-controller:` (the runId, worker PID and target; the rerun line; the stop line with the absolute `cli.mjs` path) and its stdout holds only the record; `roles` adds a `Controller runs` list after its models note that shows a live run and a finished run, each with runId, kind, class, target, start time, worker PID while live and spend so far (proposal §4 and §8, acceptance 11).
  Check: `RS` check with pattern `^RS11:`; expect exit 0, `# fail 0`, `# pass` at least 1.

- [x] AC-16. Guidance
  Behavior: `driver.md`, the Reconcile, Retrace and bump-omp skills and `agent-return.md` each state the proposal §12 rules that apply to them, with `driver.md` covering capability preflight, the roles check, invocation, resume (the repair authority's time), dispose and new "Stop" and "Call ended without a record" sections and both skills adopting the rerun as continuation; the Eval timeout rules in `agent-return.md` are unchanged; the reviewer protocol and both `evals.json` files contradict none of it.
  Check: direct static proof against the T3 Handoff's map of each §12 bullet to file and line: read every mapped line and search the five files, `reviewer-protocol.md` and both `evals.json` for `timeout: 0`, `rerun`, `retry`, `dispose`, `Eval` and `stop`; expect every applicable bullet present, no contradicting sentence, and `git diff -U0 -- .config/agents/harnesses/omp/agent-return.md` touching no Eval timeout rule line.

- [x] AC-17. ADR-0010 amended in place
  Behavior: D31 gains one item stating the detached worker that owns sessions, claim and spend so far, the deadline-free wait that is neither a caller timer nor a supervisor, attachment by identity with the same-target refusal, and the stop as an explicit abort requested through the run folder; item 4 and the "Caller-owned timers or external supervisors" rejected alternative name that wait as permitted observation without calling it the only observation and without forbidding the bounded post-close ESRCH observation, the uncertain-delivery observation or the stop-request notification and step-boundary read, while still forbidding timers or polls that end, fail, retry, replace or signal a pending reviewer request and polling to manufacture completion; the Consequences pin line names the hand-off kill check; Supersession records the in-place amendment superseding nothing else; a dated approval line and the proposal's rejected alternatives are added; the `docs/adr/INDEX.md` ADR-0010 line mentions the detached worker (proposal §13).
  Check: read D31, Consequences, Supersession and the rejected alternatives in `docs/adr/0010-replacement-lifecycle-plugin.md` and the ADR-0010 line of `docs/adr/INDEX.md`; expect each listed point present and `git diff -- docs/adr` changing no other decision or record.

- [x] AC-18. Kill-scope check and its bump-omp step
  Behavior: `C/test/fixtures/kill-scope-check.mjs` prepares a new `/tmp` folder with a fake `omp` that prints the pinned version, answers `config list --json` with scripted roles and runs the scripted ACP agent for `acp`, a scripted plan whose first reviewer turn takes about 20 seconds and run and session roots inside that folder, and prints one command that runs the CLI with those roots; bump-omp's Procedure runs the §11 step on every bump after the quick checks through `~/.local/bin/omp -p --no-session --thinking=low` with a fixed prompt (`timeout: 5`, then `timeout: 0`, reply with both tool results word for word); the Policy's authorization list includes it and its print-mode turn; Failure lists it as a check that rolls back (proposal §11, §12 last bullet).
  Check: run `node test/fixtures/kill-scope-check.mjs` with cwd `C`, run its printed command through plain foreground `bash` with no deadline, then run the log and root verification the T3 Handoff names, and read bump-omp's Procedure, Policy and Failure; expect a final record with exit 0, one start per reviewer, empty run and session roots, and the step, its authorization and its rollback present.

- [x] AC-19. Existing checks
  Behavior: The full offline suite passes, the A5 static checks stay at 0 violations and `node --check` passes for every controller file (acceptance 12).
  Check: `npm test` with cwd `C`; `python3 ~/.local/state/controller-run-survival/a5-scan.py` from the repository root; `find .config/agents/harnesses/omp/acp-controller -name '*.mjs' -not -path '*/node_modules/*' -print0 | xargs -0 -n1 node --check` from the repository root; expect exit 0 with a summary showing fail 0, then `violations: 0` and exit 0, then no output and exit 0.

- [x] AC-20. Bump check on the installed OMP
  Behavior: The §11 check passes once on the installed `~/.local/bin/omp`, run in a new print-mode session of that OMP as bump-omp's new step says: the first tool result shows OMP's timeout and the notice, the second shows the final record with exit 0, the scripted log shows one start per reviewer, and the folder's run and session roots are empty afterwards (acceptance 13). It runs once; verification inspects its retained evidence and does not repeat the paid turn.
  Check: inspect `~/.local/state/controller-run-survival/bump-check/` (the session's complete stdout, the printed command and the verification output the T3 Handoff names); expect all four pass conditions shown.

- [x] AC-21. Live proof
  Behavior: From a new print-mode OMP session with a retained journal, bump-omp's L1 runs with both models at `:low` and one change: the first `reconcile` call goes through `bash` with `timeout: 30`, and the prompt mentions no rerun; the first call's result shows OMP's timeout and the notice; the session then runs the same command again and that rerun prints the parked record (exit 1); repair and resume finish as L1 says; L1's pass and cleanup checks hold; one run with one pair of reviewer sessions existed over the whole proof, so spend is counted once (acceptance 15). It runs once; verification inspects its retained evidence and does not repeat the paid run.
  Check: inspect the session journal and `~/.local/state/controller-run-survival/live-proof/` (the prompt, the first result, the rerun's record, the resume record, the observed run folders and reviewer session ids, and the cleanup output the T3 Handoff names); expect each listed condition shown, one runId and one reviewer pair throughout, and no leftover `omp acp` process, `/tmp/acp-controller-*` folder or `~/.omp/agent/sessions/acp-controller-*` folder.

## Recovery and stops

- Recovery: Preserve each completed task and its Handoff. Tasks run in order. T2 starts only after T1's Handoff reports AC-1…AC-7 and the full offline suite passing; T3 starts only after T2's Handoff reports AC-1…AC-15, the full suite and `node --check` passing. A later task keeps every earlier AC passing and repairs in its own concern a failure it caused; a defect in an earlier task's concern found later goes back to that task's retained child under its remaining semantic attempt. An incomplete task resumes within this plan's authority from its Handoff and the working tree. Before AC-20 and AC-21, T3 confirms from OMP's docs or source, without spend, how a print-mode session receives a backgrounded or timed-out `bash` result, and builds both prompts so the session sees each result it must report. AC-20 and AC-21 each run once; a review or verification repair that changes code or guidance AC-21 exercised makes its evidence stale, and the human decides whether to repeat it. Execution-mechanism failures follow `execution-recovery.md`. A leftover test process or `/tmp` folder is reported, never killed or removed by hand outside the test that made it.
- Stops: The authority hash no longer matches; a change needs a file outside the task's Targets, a different concern of a shared file, or an effect not listed; the proposal is contradictory or incomplete for a required behavior (needs a revised proposal); an owned check still fails after the permitted attempts; the installed OMP's kill reaches the worker in AC-20 (report; no rollback is in scope); in AC-21 the first call ends before OMP's kill, the session ends before L1 finishes, or an L1 pass or cleanup check fails (keep the evidence, dispose the run only as L1 says, and the human decides on a repeat); a leftover `omp acp` process or controller folder after any run; any further live-model spend.

## Completion Summary

- Outcome: Each controller run now executes in a detached worker; a killed caller loses nothing and a rerun of the same command attaches to the same run. Standard assurance: review APPROVED (no required findings, advisories A-1…A-6), verification VERIFIED 21/21, attempt 2 unused.
- Changes: T1 run model (identity, classes, command table, records, spend), T2 worker, wait, notice, stop and roles run list, T3 guidance, ADR-0010 amendment, kill-scope check and bump-omp step; 18 files per `~/.local/state/controller-run-survival/candidate-snapshot.txt`.
- Live spend: AC-20 one `--thinking=low` print-mode turn, no reviewer spend; AC-21 one L1 proof, 83,353 tokens / 0.267121 USD. The first AC-20 launch hung on inherited stdin for 5 h without starting a turn (no spend); one corrected execution with a closed stdin passed.
- AC-21: reviewer session ids were not captured; the human accepted substitute evidence (one runId, same-session resume without `models`, one cleanup row, accumulated spend, offline RS9 worker).
- Learning: curated — one bullet in `agent-return.md` § "Child foreground execution" requires a closed stdin for subprocesses launched from Eval (after verification; the only post-verification delta).
- Papercuts: T1 none, T2 none, T3 report-only (covered by the learning bullet), learning none.
- Residual risks: a SIGKILLed worker leaves reviewer actors under acpx `__queue-owner` until they exit; a kill during `createPrivateRoot` leaves a `.init` folder; review advisories A-1 (resume claim is three steps, not one atomic step) and A-2 (a stop in the claim window is erased); bump-omp `## Failure` does not name the kill-scope check, whose rollback sits in Procedure step 3.
