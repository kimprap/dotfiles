---
name: bump-fresh
description: >
  Check for a new Fresh editor release and bump to it against the repo
  profile: one read-only version check, a proposal that classifies every
  FEATURES.md row as retire, adapt or keep, and after the user's approval a
  tested candidate, an automatic swap and a rollback record. Use only when the
  user explicitly asks to check, update, upgrade or bump Fresh. Skip ordinary
  Fresh use, profile or plugin edits, and other tool upgrades.
---

# bump-fresh

The single entry point for Fresh updates. Paths are relative to `~/.dotfiles`. `S` below is `python3 .config/agents/skills/bump-fresh/scripts/fresh_bump.py`, `R` is `uv run --script .config/fresh/tests/run.py`, and `B` is `~/.local/bin/fresh`.

## Policy

- `.config/fresh/FEATURES.md` is the catalog. Every row has one case in `.config/fresh/tests/cases/`. A bump classifies every row.
- Nothing is downloaded, edited, installed or swapped before the user approves the proposal. Phases 1–4 are read-only.
- Upstream bugs and limitations are never worked around. List them under **Upstream limitations**. Build no workaround, native patch or upstream PR.
- The swap runs automatically after a full candidate pass. There is no second approval.
- Never run bootstrap, `fresh --cmd update` or Homebrew. Never kill a Fresh process, and never commit, stage or push. The swap never creates, changes or deletes links.
- Never delete live data. Session data is restored only with `--with-session-data`.
- This skill holds no version numbers and no run history.

## Procedure

Each phase must pass before the next starts.

1. **Check.** Run `S check`. It runs `B --version` and exactly one read-only `gh release view --repo sinelaw/fresh --json tagName,publishedAt,url`.
   - Exit 0 prints `Fresh up to date (v<X>)`. Relay that line and stop.
   - Exit 10 prints `Fresh update available v<X> -> v<Y>`. Continue.
   - Exit 1 means the query failed. Report the reason and stop.
2. **Evaluate** (read-only). Read `FEATURES.md`, the v<Y> release notes, and the source diff between `v<X>` and `v<Y>` (read with `gh`, or in a temp checkout outside the repo).
   - Classify every row:
     - **retire**: upstream now covers it. The evidence names the release item or the source at `v<Y>`.
     - **adapt**: an API or behavior change touches it.
     - **keep**: neither applies.
   - Also collect:
     - features the release blocks;
     - new upstream defaults that change our behavior;
     - upstream limitations, including `upstream-limitation` rows that may lift;
     - the findings of `R live` (read-only).
3. **Propose.** Render the proposal below.
   - Save its exact text to a temp file outside the repo (`mktemp -t fresh-proposal`).
   - Run `S proposal-check --catalog .config/fresh/FEATURES.md <file>`. Present the proposal only after exit 0 and `proposal: rows=N classified=N evidence=N`.
4. **Approval gate.** Wait for an explicit approval of that proposal.
   - Adjustments produce a revised proposal, checked again, and another wait.
5. **Candidate.** Create a new private dir `D=~/.local/share/fresh-bump/<X>-to-<Y>-<UTC stamp>/` (`mkdir -m 700`).
   - Download the release asset for this machine with its published `.sha256` into `D/download/` (`gh release download v<Y> --repo sinelaw/fresh --pattern …`). Verify the checksum, and stop on a mismatch.
   - Put the binary at `D/bin/fresh`.
   - Copy the repo profile: `cp -R .config/fresh/. D/profile/`. Apply the approved retirements and adaptations there only, including their `FEATURES.md` rows and cases. The repo stays untouched.
   - Test: `uv run --script D/profile/tests/run.py test --binary D/bin/fresh --profile D/profile --json D/result.json`. It must show `unrun=0 drift=0 isolation=ok`, and every `FAIL` must be a tolerated failure (below).
   - Soak: `uv run --script D/profile/tests/run.py soak --binary D/bin/fresh --profile D/profile --workspace ~/.dotfiles --minutes 30`. It must exit 0. The soak tolerates nothing.
   - Tolerated failure: a `FAIL` whose case is listed under `### Known intermittent failures` in `D/profile/FEATURES.md` and whose message starts with that entry's prefix. These are catalogued upstream intermittent bugs. `run.py test` still exits 1 for them; `S swap` decides.
   - Any other `FAIL`, any `UNRUN`, drift or a nonzero soak count stops the bump. Report it with Outcome `blocked at candidate`. The live install is untouched.
   - `NOTE` lines from `test` and the `soak-upstream:` line are catalogued upstream signatures, not failures. List them under **Upstream limitations**.
   - Lifting a known failure is a separate check: the case must pass the solo runs its limitation names (20 of 20, or 30 of 30) before its entry is removed. One passing full run lifts nothing.
6. **Swap.** Run it right after a full pass:

   ```sh
   S swap --record D/record --candidate-bin D/bin/fresh --candidate-profile D/profile \
     --result D/result.json --repo ~/.dotfiles --live-bin ~/.local/bin/fresh --home ~
   ```

   - **Exit 3: refused, nothing changed.** Each `REFUSED` line names a failed precondition:
     - Fresh is running from the live binary;
     - a Fresh daemon socket under the runtime dir (`$XDG_RUNTIME_DIR/fresh`, else `/tmp/fresh-<uid>`) is held open, seen read-only with `lsof -U`. Never use `fresh --cmd daemon list` here: it deletes stale socket files as it lists;
     - the result JSON is not a pass (a `FAIL` that is not tolerated, `unrun`, drift or isolation), or its hashes differ from the candidate's;
     - the repo Fresh paths have uncommitted changes;
     - `run.py live` fails;
     - the candidate needs a different bootstrap link list. The user must update bootstrap and rerun it first.

     Report the lines and stop. Never quit or kill Fresh yourself, and never run bootstrap for the user.
   - Each tolerated failure prints `TOLERATED <case>: <message>`, also on a refusal.
   - **Exit 0: activated.** The record in `D/record/` holds:
     - the old binary;
     - the pre-bump bytes of every repo Fresh path the swap changed or deleted;
     - a copy of `~/Library/Application Support/fresh`;
     - the live link map;
     - `record.json`, with all hashes, the tolerated failures and the dotfiles revision.

     The swap wrote the repo profile and moved the new binary into place. It then checked the binary sha, `--version` in an isolated HOME, the profile bytes and `run.py live`.
   - **Exit 4: rolled back.** Steps 3–4 failed and the automatic rollback restored the pre-bump bytes. Report the `FAILED` lines.
   - **Exit 5: the automatic rollback failed.** Report it at once, with the record path, for a manual restore.
7. **Report** in the form below. List each `TOLERATED` failure under **Upstream limitations** with its limitation row. Physical Ghostty checks are listed under **Tests** as `unrun (physical surface)`.

Rollback on request: `S rollback --record D/record [--with-session-data]`.

- It restores the binary (beside + `mv`) and the repo paths' bytes, restores removed files, and deletes the files the swap added. Each restored path is printed.
- If a path changed after the swap, it exits 3 with `CONFLICT` lines and changes nothing.
- `--with-session-data` moves the current session data into the record before restoring the copy.

The profile change stays uncommitted. Committing it needs a separate shipping request. If a request asks to stage, stage exact paths with `git -C ~/.dotfiles add -- <path>...`; never `git add -A`, `git add .` or `git commit -a`.

## Proposal

Read and follow [packed-label](../../references/packed-label.md). This skill owns the field map below.

- Keep each section clear. Each child is one simple, high-level bullet with no sub-bullets.
- Omit an empty field, except **Versions** and **Approval**, which are always present.
- **Retire**, **Adapt** and **Keep** together name every catalog row exactly once, each as `- <row-id>: <one-line reason> (<evidence link>)`.
  - A **Keep** link points at the release notes or source at `v<Y>` that shows the area unchanged.
- **Upstream limitations** lists the rows from `FEATURES.md`'s `## Upstream limitations` and any new limitation. Each says whether it stays blocked or may lift, with a link.
- **Config drift** lists the `LIVE` and `USER-LAYER` lines from `R live`. A `LIVE` line blocks the swap until the user reruns bootstrap.

```markdown
## Fresh bump proposal

**Versions**

- v<X> -> v<Y> (<release url>)

**Retire**

- <row-id>: <what upstream now covers> (<evidence link>)

**Adapt**

- <row-id>: <what changes and how we follow> (<evidence link>)

**Keep**

- <row-id>: <why it still holds> (<evidence link>)

**Blocked**

- <feature>: <what the release breaks> (<evidence link>)

**New defaults**

- <setting>: <old> -> <new>, <effect on us> (<evidence link>)

**Upstream limitations**

- <row-id>: <still blocked | may lift>, <why> (<evidence link>)

**Config drift**

- <LIVE or USER-LAYER line>: <what the user should do>

**Candidate plan**

1. Download v<Y> and verify its sha256
2. Apply the retirements and adaptations to a candidate copy of the profile
3. Run the full test and a 30-minute soak on the candidate
4. Swap automatically after a full pass, with a rollback record; nothing is committed

**Approval**

- Reply **approve** to build the candidate and swap after a full pass, or **approve — {adjustments}**.
```

## Report

Same grammar. Omit an empty field.

```markdown
## Fresh bump result

**Versions**

- v<X> -> v<Y>

**Outcome**

- activated | blocked at <phase> | rolled back

**Changes**

- <repo path>: <changed | added | removed>

**Tests**

- <summary: line from run.py test>
- <soak: line from run.py soak, and its soak-upstream: line if printed>
- <physical check>: unrun (physical surface)

**Upstream limitations**

- <row-id>: <still blocked | lifted>, <why> (<evidence link>)

**Blocked**

- <REFUSED, FAILED or FAIL line>

**Rollback**

- `python3 .config/agents/skills/bump-fresh/scripts/fresh_bump.py rollback --record <D>/record`

**Uncommitted**

- <repo path>
```
