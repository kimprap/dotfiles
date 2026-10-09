---
name: bump-omp
description: >
  Qualify a new omp, acpx, or ACP SDK version for the Reconcile and Retrace
  acp controller in one unattended run: save the old omp binary, install,
  triage upstream changes, move the pin, run the quick checks, the kill-scope
  check, the offline
  suite when acpx or the ACP SDK moves, and the L1 live run when the changes
  need it, then commit or roll
  back and report. Use only when the user explicitly asks to update,
  upgrade, or bump omp, acpx, or the ACP SDK. Skip ordinary omp use or
  configuration, controller or skill changes, and other tool upgrades.
---

# bump-omp

The single entry point for omp, acpx, and ACP SDK updates. `C` below is `.config/agents/harnesses/omp/acp-controller`; paths are relative to `~/.dotfiles`, and controller commands run from that repository root.

A request that names no component bumps omp, acpx, and the ACP SDK to their latest releases together; do not ask which to update. A request that names components bumps only those, plus a partner the coupling below requires.

## Policy

- The invocation authorizes everything that follows: the install, the pin move, the quick checks, the kill-scope check with its one print-mode turn of the new omp, the L1 live run with both models at `:low` including its validator repair and resume, one rerun of L1 on the final pin after an acpx/SDK hold-back, rollback on failure, and the final commit with exact paths staged and no push.
- Order: save the old binary, install, move the pin, qualify. Reconcile and Retrace refuse with exit 2 until the pin matches the installed versions.
- The pin edit stays uncommitted until every check passes. Any failed check of the committed pin rolls the bump back (step 7). A triage hold-back is not a failed check.
- No live run is repeated to make it pass. The only rerun is L1, once, on the final pin after an acpx/SDK hold-back. Running the same controller command again after a call ended without a record is continuation of the same run, not a repeat.
- acpx and the ACP SDK move as one pair, or not at all: set the SDK to a version inside the new acpx's SDK range.
- Overlay additions for new side-effect settings belong to the bump. A change that needs controller, skill, or protocol code stays separate from the bump and is never made in it.
- The pin commit message is the qualification record. This skill holds no version numbers and no run history.
- The omp pin lives only in `C/lib/versions.mjs`. acpx and the ACP SDK are also pinned in `C/package.json` and `C/package-lock.json` because npm requires it. Tests import the pins. The Reconcile driver (`C/driver.md`) and ADR-0010 name the file, not the numbers. `.config/agents/harnesses/omp/agent-return.md` keeps its source-evidence citations.
- Frozen artifacts, the trial bundle, closed specs, and eval fixtures keep their own versions and do not move with the pin.
- Every repository edit changes only its intended lines. OMP formats files on write (`lsp.formatOnWrite` is on), which can reindent a whole file. If `git -C ~/.dotfiles diff -- <file>` shows lines you did not change, restore that file to its HEAD bytes and reapply only the intended change through `bash`.

## Roles

- The invocation is the user's only step. After it, no step needs user input.
- The agent does every step, writes every approval and repair record itself from the invocation, and presents no brief, models-changed gate, or repair reply for approval.

## Procedure

1. **Start four arms at once.**
   - Install arm: save the old binary, then download the new one, verify its checksum, and install it.
     - Save: if `~/.local/bin/omp` is a symlink, save the target's bytes. `<old version>` is exactly what `omp --version` prints; it may contain a slash, so create `~/.local/share/omp-maintenance/<old version>/` with `mkdir -p` and do not reject the slash. Copy the binary's bytes there, keep the copy executable, and write its `shasum -a 256` beside it. Done when the saved copy's hash equals the installed file's.
     - Install: the agent's own session runs from `~/.local/bin/omp`. Write the new binary beside it and `mv` it into place; never copy onto the existing file. Do not add an installer. Record the exact install command and download source for the commit message.
   - Notes arm: read the release notes for every omp release after the old version up to the new one (`gh release view <tag>` per release), and acpx's notes if it moves.
   - Citation arm: one subagent fetches the source of both versions as two full tag trees, not a blobless clone, so `git grep` and `git diff` stay local: in a scratch directory under `/tmp` run `git init`, add the upstream remote, then `git fetch --depth 1 --no-tags origin tag <old tag> tag <new tag>`. It lists which files cited in `agent-return.md` and which files under `packages/coding-agent/src/modes/acp/` changed, then runs the citation check: start from `git diff <old tag> <new tag> -- <file>` for each cited file, re-verify only claims whose cited code that diff touches, and retarget the links of every cited file that changed. Leave citations whose files did not change. Do not strip the source-pin version from that file.
   - acpx arm, only when acpx/SDK move: compare the acpx API that `C/lib/adapter.mjs` imports between the old and new acpx.

   Join an arm before any step that consumes or undoes it:
   - the settings diff, the pin move, and the quick checks wait until the install `mv` has finished;
   - the pre-L1 git snapshot waits until the citation edits have finished;
   - rollback and a pair hold-back wait until the install arm and the citation arm have finished before `npm ci` or restoring the binary. If the suite was started, also wait until that process has exited. Do not wait for a suite or an L1 that was never started.

   Triage outcomes:
   - If the acpx/SDK pair needs controller code, keep the pair at its pin, continue the omp-only bump through the commit, and report the hold-back and its reason. Do not stop and do not ask.
   - If omp itself needs controller code, roll back (step 7) and report.

2. **After install.**
   - Settings: compare `omp config list --json` from the saved old binary with the new one. Add to `C/config/omp-overlay.yml` every new setting whose default adds context or side effects.
   - Pin: move the omp pin in `C/lib/versions.mjs`. If the acpx/SDK pair moves, edit `C/lib/versions.mjs`, `C/package.json` (the dependency and the SDK override), and `C/package-lock.json` together, then run `npm ci` in `C` and start the suite at once (step 5).
   - Quick checks: `node .config/agents/harnesses/omp/acp-controller/cli.mjs roles` exits 0 and prints its models note, and `omp -p --no-session --thinking=low` with a short prompt answers. Record any startup or extension error either prints.

3. **Kill-scope check.** Run it on every bump, after the quick checks, with no reviewer spend. The agent's own session still runs the old omp, so its `bash` cannot test the new omp's kill rules; the check runs in a new print-mode session of the new binary.
   - Prepare: `node .config/agents/harnesses/omp/acp-controller/test/fixtures/kill-scope-check.mjs` creates a new `/tmp/acp-killscope-*` folder `<check dir>` with a fake `omp`, a scripted plan whose first reviewer turn takes about 20 seconds, and run and session roots, and prints one command, `<check command>`.
   - Run, from the repository root, through `bash` with `timeout: 0` and no `name`, `ready`, `async` or `pty`:

     ```text
     ~/.local/bin/omp -p --no-session --thinking=low '<fixed prompt>'
     ```

     where `<fixed prompt>` is this text with `<check command>` filled in:

     ```text
     Run this exact command with your bash tool, with timeout: 5, from the current directory:

     <check command>

     If the call reports that it was backgrounded, call wait until the result of that job arrives. Then run the same command again with your bash tool, with timeout: 0, and wait the same way if it is backgrounded. Do nothing else: no other command or tool, and no change to the command. Your final reply is both final tool results, word for word, each in its own fenced block, the first call first.
     ```

   - Pass: the first call's result shows omp's `Command timed out after 5 seconds` and the controller's notice line `acp-controller: run <runId> runs in worker PID <pid>; target: ...`; the second shows `## Final proposal` and no non-zero exit; and `node .config/agents/harnesses/omp/acp-controller/test/fixtures/kill-scope-check.mjs verify <check dir>` exits 0 with `kill-scope check: pass` (one start per reviewer, one run, and empty run and session roots). A first result without the timeout fails the check; do not run the turn again. Record both results and the verify output for the commit message, then `rm -rf <check dir>`.
   - Any failure rolls the bump back (step 7), so the old omp, whose kill scope passed, stays installed.

4. **Decide on L1.** Run it if any of these hold; the version number plays no part. Otherwise there is no live run.
   - A release note mentions a controller touchpoint: ACP, `omp acp` and its flags; session create, load, resume, claim or lease, and the session-file layout; the `yield` tool or tool-call validation; the `read`/`glob`/`grep`/`yield` tool set; `omp config list --json` and the settings schema; `omp models --json`, model selectors, and thinking levels.
   - The coding-agent notes have a Breaking Changes section, even when the break is unrelated.
   - A file under `packages/coding-agent/src/modes/acp/` changed.
   - acpx/SDK moved.

5. **Run the suite and L1 at the same time.**
   - Suite: only when the acpx/SDK pair moves. Start `npm test` in `C` right after step 2's `npm ci`, before the quick checks, as an `async` `bash` job with `timeout: 0` and its full output in a log file under `/tmp`. Done when every test passes. On an omp-only bump, including a triage hold-back, do not run it: every test drives a fake omp that echoes the pin, so it cannot fail on the new binary. The commit message records the skip and that reason.
   - L1 waits for the citation arm. Immediately before it, record `git -C ~/.dotfiles status --short --untracked-files=all -- .config/agents/` and `git -C ~/.dotfiles diff -- .config/agents/ | shasum -a 256`; repeat both after L1 and expect them unchanged.
   - Run L1 as "L1 Artifact with park and resume" below says.
   - If the suite fails only with the new acpx/SDK pair:
     - If L1 was started, finish it before any package revert: perform its repair and resume, or dispose it while the pin still matches if repair cannot proceed. Do not wait for a parked run to end by itself. If L1 was not started, do not start it on the pair about to be held back.
     - If the suite process is still running, wait until it has exited.
     - Hold the pair back: revert the pair's lines in `C/lib/versions.mjs` and its package files, and run `npm ci` in `C`. Do not rerun the suite: the bump is now omp-only. The commit message reports the failed pair suite and the hold-back.
     - If L1 had a trigger other than the pair move, run L1 once on the final pin (a rerun if it already ran); it checks the committed pin and must pass. An L1 whose only trigger was the pair move checked the held-back pair, not the committed pin, so its failure alone does not roll the omp bump back; the report names it.

6. **All checks pass: commit.** Commit the pin with any overlay and citation changes. Stage exact paths with `git -C ~/.dotfiles add -- <path>...` per `.agents/AGENTS.md` `## Git`; never `git add -A`, `git add .`, or `git commit -a`; do not push. The message states old to new, the install command and source, each check's result including the kill-scope check, the live-run decision and why, each run's exit and spend, any hold-back and why, and the known limits below. Then report.

7. **Any other failure: roll back** (see Failure).

## Failure

1. Join the install arm and the citation arm. If the suite was started, wait until that process has exited. Do not wait for a suite that was never started.
2. If this bump has a parked or undisposed L1 and the pin still matches the installed omp and the installed and locked acpx/SDK, dispose it: `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose <runId>`. Every subcommand, including dispose, passes the version check. If the pin does not match, or this bump started no run, do not call dispose. Never dispose another session's run. Never dispose or relaunch a live run: finish it as step 5 says, and if it cannot finish, present it to the human, who decides on `stop`.
3. Revert the pin, its package files, and any overlay and citation edits.
4. Run `npm ci` in `C` if the acpx/SDK pair had moved.
5. Write the saved binary beside `~/.local/bin/omp` and `mv` it into place; never copy onto the existing file.
6. Report the failed check, what rollback did, and any hold-back.

## Live run

### L1 Artifact with park and resume

Setup: create a new directory `<dir>` under `/tmp` and use its absolute path everywhere below. `<dir>/truth.txt` contains one line, `/Users/kim/.local/bin/omp`. `<dir>/notes.txt` contains one line, `The installed omp path is /usr/bin/omp.` Do not create `<dir>/validator-ready`. Record `shasum -a 256` of both files. Request files live in `<dir>` as real paths, never `local://`.

Run each controller call as one plain foreground `bash` with `timeout: 0`, no `name`, `ready`, or `async`, from the repository root, with the request file named by its absolute path written in the command, never a shell variable and never Eval, and judge the controller's own exit code and record. If omp backgrounds the call, wait for its result. A call that ends without a record (timed out, cancelled, or killed) leaves the run working: run the same command again, as "Call ended without a record" in `C/driver.md` says; it attaches and starts nothing. Never rebuild a request file.

First call: write `<dir>/reconcile-request.json`, where `<notes digest>` is the lowercase `shasum -a 256` of `<dir>/notes.txt`, the approval text is the invocation's exact words and `at` its ISO-8601 time, and `<A selector>` and `<B selector>` are the exact selectors from the `roles` quick-check note:

```json
{
  "goal": "Make the notes file's path sentence match the first line of the truth file",
  "candidate": {"identity": "<dir>/notes.txt@sha256:<notes digest>", "artifact": "<dir>/notes.txt"},
  "intent": ["The truth file <dir>/truth.txt is read-only. Change only the false path sentence."],
  "context": ["Source of the true path: <dir>/truth.txt"],
  "mode": "artifact",
  "cap": 1,
  "validate": {"argv": ["/bin/test", "-f", "<dir>/validator-ready"]},
  "approval": {"text": "<invocation words>", "at": "<invocation time>"},
  "models": {"a": "<A selector>:low", "b": "<B selector>:low"}
}
```

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs reconcile < <dir>/reconcile-request.json
```

If the controller refuses the `models` override, roll back and report; do not try another selector or level.

Pass, first call: exit 1, `## Review rounds` has a `park` row for validation, and `## Reconcile stopped` has a blocker ending `(step: validation)`. Exit 3 fails; do not resume.

Repair: after the first-call pass, create `<dir>/validator-ready`, write `<dir>/resume-request.json` as `{"repair": {"authority": "<invocation words> (given <invocation time>)", "step": "validation"}}`, quoting the invocation's exact words and its ISO-8601 time, and resume with the runId from the parked record. Resume sends no `models`; the run keeps its parked pair. Do not wait for a reply. The run has not ended until this repair and resume finish, or until the agent disposes it because repair cannot proceed.

```text
node .config/agents/harnesses/omp/acp-controller/cli.mjs resume <runId> < <dir>/resume-request.json
```

Pass, resume: exit 0, `## Final proposal` shows one applied change, **Current identity** is `sha256:` plus the `shasum -a 256` of `<dir>/notes.txt` taken after the resume, not the pre-run hash, and the `<dir>/truth.txt` hash is unchanged.

Cleanup, after the resume, not after the park: no `~/.omp/agent/sessions/acp-controller-*` directory, no `/tmp/acp-controller-*` directory, and `pgrep -fl '[o]mp acp'` prints nothing. A process pgrep finds is a failed check: report it and do not kill it.

## Known limits

- Changes missing from the release notes are caught only by the `modes/acp/` and cited-file checks.
- More than 2 concurrent omp ACP processes are never tested live.
- The skill layer is not tested during a bump.
- Whether print mode reports extension load errors is unverified.
- An acpx/SDK hold-back can add a second L1 run.
- An omp-only bump runs no offline suite, so a controller regression committed outside a bump stays untested until the next acpx/SDK move or a manual `npm test`.
- A coding-agent Breaking Changes section can trigger L1 when the break is unrelated.
- The kill-scope check covers omp's `bash` deadline kill only; session-end cancellation takes the same kill path in omp's source, but no check exercises it.
- The kill-scope check relies on a print-mode model following the fixed prompt; a skipped timeout fails the bump rather than passing it.
