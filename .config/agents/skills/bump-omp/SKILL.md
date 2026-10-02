---
name: bump-omp
description: >
  Qualify a new omp, acpx, or ACP SDK version for the Reconcile and Retrace
  acp controller: save the old omp binary, triage upstream changes, install,
  move the pin, run the offline suite, and hand the user only the live runs
  the changes need. Use only when the user explicitly asks to update,
  upgrade, or bump omp, acpx, or the ACP SDK. Skip ordinary omp use or
  configuration, controller or skill changes, and other tool upgrades.
---

# bump-omp

The single entry point for omp, acpx, and ACP SDK updates. `C` below is `.config/agents/harnesses/omp/acp-controller`; paths are relative to `~/.dotfiles`.

A request that names no component bumps omp, acpx, and the ACP SDK to their latest releases together; do not ask which to update. A request that names components bumps only those, plus a partner the coupling below requires.

## Policy

- Every bump runs the offline suite before the new pin is committed. Live runs are the agent's call from the step b triage: a patch bump with no flagged touchpoint may skip all three; otherwise run R1 first, add R2 or R3 only for flagged session-lifecycle or Retrace surfaces, and stop once the selected runs pass. An unneeded run is an acceptable false positive.
- Order: save the old binary, install, move the pin, qualify. Reconcile and Retrace refuse with exit 2 until the pin matches the installed versions.
- The pin edit stays uncommitted until every selected check passes. Revert it on failure.
- A failed check stops the procedure. Rerun a live run only with a named cause and a changed input.
- acpx and the ACP SDK move as one pair: set the SDK to a version inside the new acpx's SDK range. If triage finds the pair needs controller code, keep the pair at its pin, bump omp alone, and report the hold-back and its reason instead of asking. When omp itself needs controller code, the fix stays the user's decision.
- Overlay additions for new side-effect settings belong to the bump. Any controller, skill, or protocol code change is a separate change, not part of the bump.
- The pin commit message is the qualification record. This skill holds no version numbers and no run history.
- The omp pin lives only in `C/lib/versions.mjs`. acpx and the ACP SDK are also pinned in `C/package.json` and `C/package-lock.json` because npm requires it. Tests import the pins. The Reconcile driver (`.config/agents/harnesses/omp/acp-controller/driver.md`) and ADR-0010 name the file, not the numbers. `.config/agents/harnesses/omp/agent-return.md` keeps its source-evidence citations.
- Frozen artifacts, the trial bundle, closed specs, and eval fixtures keep their own versions and do not move with the pin.

## Roles

- Agent: steps a–f and h, the live-run decision, plus each live run's setup and checks.
- User: the startup check and the selected live runs, each in a new OMP session with the user's own approvals, including R2's repair. The user reports back each run's approved brief or scope table, the controller stdout, and the `controller-exit=<n>` line, but not the prompt: a pasted prompt's first line would invoke a skill in the agent's session.
- The agent never runs live runs itself, never pastes a run prompt into its own session, and never approves on the user's behalf.
- Step i happens only on a later explicit request.

## Procedure

Steps follow their dependencies, not their letters: a before d; d before e; e before the user's first new OMP session, because Reconcile and Retrace refuse until the pin matches; f and the selected live runs before i. Step h only needs to finish before i. A failed check stops the bump.

Every repository edit here must change only its intended lines. OMP formats files on write (`lsp.formatOnWrite` is on), which can reindent a whole file. If `git -C ~/.dotfiles diff -- <file>` shows lines you did not change, restore that file to its HEAD bytes and reapply only your change through `bash`.

a. **Save the old binary.** Confirm `~/.local/bin/omp` is a regular file, not a symlink; if a future install is a symlink, save the target's bytes instead. `<old version>` is exactly what `omp --version` prints. It contains a slash, so create `~/.local/share/omp-maintenance/<old version>/` with `mkdir -p` and do not reject the slash. Copy the binary's bytes there and write its `shasum -a 256` beside it. Done when the saved copy's hash equals the installed file's.

b. **Triage upstream changes** between the two tags. Read the release notes or changelog and the tag-compare file list, filtered to the controller's touchpoints: `omp acp` and its flags; session create, load, and resume, and the session-file layout; the `yield` tool and the tool set; `omp config list --json` and the settings schema; the files cited in `agent-return.md`; and, when acpx or the SDK moves, the acpx API that `C/lib/adapter.mjs` imports. Dig deeper only into flagged touchpoints. Done when a rough change summary, the flagged touchpoints, and the live-run decision are written down.

c. **Diff settings defaults.** Compare the new version's settings-schema defaults against `C/config/omp-overlay.yml`. Add to the overlay every new setting whose default adds context or side effects.

d. **Install** the new binary at `~/.local/bin/omp`. The agent's own session runs from that file: write the new binary beside it and `mv` it into place; never copy onto the existing file. Do not add an installer. Record the exact install command and download source for the commit message.

e. **Move the pin** in `C/lib/versions.mjs`. For an acpx or SDK bump, also edit `C/package.json` and `C/package-lock.json`, then run `npm ci` in `C`.

f. **Offline suite:** `npm test` in `C`, started in the background before the step g hand-off so it overlaps the user's session. Done when every test passes; a failure stops the bump before commit.

g. **User session and selected live runs.**
   - Agent, immediately before the first hand-off and after the pin edit: record `git -C ~/.dotfiles status --short --untracked-files=all -- .config/agents/harnesses/omp/` and `git -C ~/.dotfiles diff -- .config/agents/harnesses/omp/ | shasum -a 256`.
   - No live run selected: the user starts one new OMP session, notes any startup errors, including extensions and custom agents, and exits without sending a prompt.
   - Live runs selected: run them one at a time; the first run's session doubles as the startup check, and the user notes any startup errors with the run's report.
   - Agent, before each run: record `shasum -a 256` of `.config/agents/skills/reconcile/SKILL.md`, `.config/agents/skills/retrace/SKILL.md`, `.config/agents/skills/reconcile/references/reviewer-protocol.md`, `.config/agents/harnesses/omp/acp-controller/driver.md`, `.config/agents/harnesses/omp/config.yml`, and every evidence file that run reads (R2: `<dir>/truth.txt` and `<dir>/notes.txt`; R3: `C/lib/versions.mjs` and `C/cli.mjs`). For R2, do its setup first.
   - Agent: give the user the run's prompt, with R2's `<dir>` filled in.
   - User: run it in a new OMP session through the skill. Approve a brief or scope table only when every field matches the prompt; otherwise reply with the exact correction in the same session and approve the revised one that matches. Report back.
   - Agent, after each run: check the pass conditions. Repeat the hashes; all must be unchanged except R2's `<dir>/notes.txt`.
   - Agent, after the run's final controller call (for R2, after the resume; its parked first call keeps its folders by design): no `~/.omp/agent/sessions/acp-controller-*` directory, no `/tmp/acp-controller-*` directory, and `pgrep -fl '[o]mp acp'` prints nothing. If pgrep finds a process, stop and report it. Do not kill it.
   - Done when the user reports no startup error, the selected runs pass, and the repeated status and diff hash are unchanged.

h. **Citations.** For each file cited in `agent-return.md` that changed between the tags, re-verify the claim and retarget its links. Leave citations whose files did not change. Do not strip the source-pin version from that file.

i. **Commit**, only on a later explicit request: the pin with any overlay and citation changes. The message states old to new, the install command and source, each check's result, the live-run decision with which runs ran or were skipped and why, each run's exit and spend, any held-back component and why, and known limits. If a request asks to stage, stage exact paths with `git -C ~/.dotfiles add -- <path>...` per `.agents/AGENTS.md` `## Git`; never `git add -A`, `git add .`, or `git commit -a`.

## Failure

Stop at the first failed check.

1. If a controller run is parked or undisposed, dispose it first, from the repository root, while the pin still matches the installed omp: `node .config/agents/harnesses/omp/acp-controller/cli.mjs dispose <runId>`. Every subcommand, including dispose, passes the version check.
2. Revert the pin.
3. Either roll back to the saved binary (copy it beside `~/.local/bin/omp`, then `mv` it into place), or stay on the new omp with Reconcile and Retrace refusing.

Do not repeat a live run to make it pass.

## Live runs

### R1 Conversation

```text
/skill:reconcile
Reconcile the following proposal (Conversation replacement mode).
Goal (copy byte-for-byte into the brief's Goal, no added punctuation): Make this explanation of git stash accurate and concise
Candidate proposal, exact text between the markers (the bytes between the lines, without a trailing newline):
<<<CANDIDATE
`git stash` saves your uncommitted changes and resets the working tree to HEAD so you can switch tasks; `git stash pop` reapplies the most recent stash and removes it from the stash list.
CANDIDATE>>>
Context: none.
Maximum controller-applied outer iterations: none.
Render the Reconcile brief and wait for my approval.
After presenting the controller stdout verbatim, add one final line `controller-exit=<n>` with the controller command's exit code as the bash tool reported it (0 when the tool reported success).
```

Pass: the approved brief's Goal is exactly `Make this explanation of git stash accurate and concise`. The added line is `controller-exit=0`. `## Review rounds` shows a first admitted VALID. `## Final proposal` has **Proposal**.

### R2 Artifact with park and resume

Setup (agent): create a new directory `<dir>` under `/tmp`. `<dir>/truth.txt` contains one line, `/Users/kim/.local/bin/omp`. `<dir>/notes.txt` contains one line, `The installed omp path is /usr/bin/omp.` Do not create `<dir>/validator-ready`.

```text
/skill:reconcile
Reconcile the following proposal (Artifact edits only).
Goal (copy byte-for-byte into the brief's Goal, no added punctuation): Make the notes file's path sentence match the first line of the truth file
Candidate artifact: <dir>/notes.txt
Context: the truth file <dir>/truth.txt is read-only. Change only the false path sentence.
Maximum controller-applied outer iterations: 1
Validator for the request's `validate` field, exact, run with no shell: {"argv": ["/bin/test", "-f", "<dir>/validator-ready"]}. That file is absent at start.
Render the Reconcile brief and wait for my approval.
After presenting the controller stdout verbatim, add one final line `controller-exit=<n>` with the controller command's exit code as the bash tool reported it (0 when the tool reported success).
```

Pass, first call: `controller-exit=1`. `## Review rounds` has a `park` row for validation. `## Reconcile stopped` has a blocker ending `(step: validation)`. Exit 3 fails the qualification; do not resume.

Repair (user, only after the agent confirms the first-call pass), in the same session, reply: `Authorized repair: create <dir>/validator-ready, then resume the parked run with step validation.` The root session performs that repair and resumes per the Reconcile skill, using the runId printed in the parked record. The user reports the resume result.

Pass, resume: `controller-exit=0`. `## Final proposal` shows one applied change. **Current identity** is `sha256:` plus the `shasum -a 256` of `<dir>/notes.txt` taken after the resume, not the pre-run hash.

### R3 Retrace

Pin-independent: it checks the version refusal, not the pin values.

```text
/skill:retrace
Root: /Users/kim/.dotfiles
Objective (verbatim): Assess whether `.config/agents/harnesses/omp/acp-controller/lib/versions.mjs` and `.config/agents/harnesses/omp/acp-controller/cli.mjs` implement the version refusal, without depending on the current pin values.
Scopes, use these IDs and objectives verbatim:
- s1: `lib/versions.mjs` `checkVersions` compares `omp --version` and the installed and locked acpx and ACP SDK versions to its own constants
- s2: `cli.mjs` calls `checkVersions` before `readModelRoles` and any runtime
Dependency: s2 requires s1. No other links.
Evidence (current, read-only): those two files only.
Protected behavior: the evidence files are read-only and must not change. Exclusions: none.
Present the scope table for approval and wait.
After presenting the controller stdout verbatim, add one final line `controller-exit=<n>` with the controller command's exit code as the bash tool reported it (0 when the tool reported success).
```

Pass: `controller-exit=0`. Both scopes show a delegated Reconcile. The requires link is shown. These four H2 sections appear in this order: `## Result`, `## Scope Results`, `## Findings and Directions`, `## Evidence and Limits`. The aggregate is not `blocked`. Exit 1, 2, or 3 fails the qualification.
