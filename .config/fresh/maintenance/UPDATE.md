# Fresh maintenance: preserve behavior, then update

## Decision and accepted baseline

Keep **stock Fresh 0.4.10, with no active local patches**. Do not install the inactive native build. The source review found no justified deletion: the existing helpers still supply behavior not established as equivalent upstream. This package preserves the accepted experience; it does not simplify shortcuts or remove explicit preferences merely because a value resembles a default.

The current application is an arm64 Homebrew release build. Its receipt records `runtime_dependencies=[]`. Protected source identities:

| Input | SHA256 |
| --- | --- |
| Stock application | `a98650896db87ee07faa3f3ae4bcd08b2da3ad55f25cc1059e0e491c5bc8ce08` |
| Current config.json, including global Cmd+R correction | `b64e8ef59df623c8a96f915aec2be08019cbd1ae09366f4e7d8c41b3230d0623` |
| Current init.ts | `983c3e0d3b3ce844f97e664979cfe2da78d3bc943ed670ae84377464c84d7a18` |
| Preserved config.json.bak.20260909-182957 | `c487e0b1d467df4664e0f2fa6b5aa2db17c6747b2418a5ac5c8d77095a1f35ef` |

An accepted bundle is identified by its **explicit immutable manifest path and digest**, not a dated directory convention or a mutable `latest` pointer. A directory name is not evidence of acceptance. Its `result.json` must have `scope=full`, `status=pass`, `protected_unchanged=true`, all thirteen canonical IDs in `selected_cases`, and all thirteen case records passing with intact, correlated native evidence and shutdown records. The result's manifest digest and run ID must match; recompute all manifest file hashes. `manifest.json` remains the sole version record within each bundle.

A focused result is never an accepted baseline, including a focused invocation that explicitly names all thirteen IDs. Failed and partial bundles remain useful immutable development evidence, not rollback approval. Full replay preflight checks the selected input bundle's full-scope acceptance, evidence and frozen hashes before launching Fresh. Focused development may inspect frozen inputs, but cannot promote them.

**Current blocker:** the preserved stock duplication wrapper creates one undo entry per copied block. After two selected copies, one Undo leaves three `foo` lines instead of the required two. The checker must report that failure while measuring independently initialized above/comment variants and later groups. Complete copied-selection readiness is required before Undo; neither extra undos nor a known-failure waiver satisfies the contract. No accepted full baseline or replay promotion is allowed while this or another required behavior fails. Production/native repair or a requirement change needs separate authority; continue using the unchanged stock profile meanwhile.

The bundle binds the application, complete profile (config, init, theme, plugin and all seven vendor files), Ghostty source including ordered includes, package metadata, and four exact checker inputs. It retains the real application, not a version string in place of the application. The copied checker allows replay even after the maintained checker evolves. Generated live types, tsconfig, logs, inactive packages and backups are not overwrite targets or substitutes for the source profile.

## Focused checks, full measurements and replay

Use an existing Python environment with the exact versions in `requirements.txt`: pexpect 4.9.0, ptyprocess 0.7.0, pyte 0.8.2, wcwidth 0.8.3. Resolve existing `node`, `prettier`, `basedpyright`, `basedpyright-langserver`, and `git` executables on PATH before HOME isolation. `/bin/sh` and `/bin/ps` provide disposable terminal and process-ownership support. No checker path inserts a temporary dependency directory, installs packages, fetches source, invokes brew/bootstrap, or changes system preferences. Missing prerequisites fail before Fresh launches; obtain separate setup authority rather than adding an automatic installer.

For the initial execution, the already-discovered machine-specific executable directories and Python module location are recorded separately in `$HOME/.local/share/fresh-maintenance/evidence/T1-attempt1-protected.json`. Supply that execution environment when running the following commands; those locations are not permanent checker defaults.

Run from the repository root using the already-resolved Python and tool environment. Choose new unique output paths for every invocation; the checker rejects existing paths, including symlinks, and outputs inside input trees. For example, set `PYTHON` to the resolved executable and choose a new UUID-based key:

```sh
export HOLD="$HOME/.local/share/fresh-maintenance"
export PYTHON="$(command -v python3)"
export RUN_KEY="$("$PYTHON" -c 'import uuid; print(uuid.uuid4())')"
export MEASURE_OUT="$HOLD/runs/$RUN_KEY-measurement"
export FOCUSED_OUT="$HOLD/runs/$RUN_KEY-focused"
```

Full measurement uses no `--case`. It collects independent group results even when required behavior fails:

```sh
"$PYTHON" .config/fresh/maintenance/check.py --binary /opt/homebrew/bin/fresh --profile .config/fresh --ghostty .config/ghostty --upstream-ref v0.4.10 --out "$MEASURE_OUT"
```

Focused development uses the same entry point. Repeat `--case` to select groups; argument order does not change canonical execution order. Unknown or duplicate IDs are input errors. Keep each selected group's complete fixtures and assertions:

```sh
"$PYTHON" .config/fresh/maintenance/check.py --binary /opt/homebrew/bin/fresh --profile .config/fresh --ghostty .config/ghostty --upstream-ref v0.4.10 --case file-chords --case profile-ui --out "$FOCUSED_OUT"
```

Only after every required behavior is eligible, choose a new `RUN_KEY`, an absent `BASELINE_OUT` under `$HOLD/bundles`, and an absent `REPLAY_OUT` under `$HOLD/runs`. Record both exact expanded commands and paths with the execution evidence. The source capture and its paired replay use these relationships, with **no `--case` on either command**:

```sh
export BASELINE_OUT="$HOLD/bundles/$RUN_KEY-stock-0.4.10"
export REPLAY_OUT="$HOLD/runs/$RUN_KEY-replay"
"$PYTHON" .config/fresh/maintenance/check.py --binary /opt/homebrew/bin/fresh --profile .config/fresh --ghostty .config/ghostty --upstream-ref v0.4.10 --out "$BASELINE_OUT"
```

Inspect the completed full result and all evidence before replay. Failed or focused input bundles are ineligible as accepted replay baselines:

```sh
"$PYTHON" "$BASELINE_OUT/checker/check.py" --binary "$BASELINE_OUT/inputs/bin/fresh" --profile "$BASELINE_OUT/inputs/fresh" --ghostty "$BASELINE_OUT/inputs/ghostty" --upstream-ref v0.4.10 --out "$REPLAY_OUT"
```

Run through the process supervisor with readiness pattern `FRESH_COMPAT_READY`, then **wait for process exit**. Readiness is the first matching native probe response, not completion. When the supervisor rewrites login-shell PATH, launch `/usr/bin/env` with the explicitly resolved `PATH`, optional existing `PYTHONPATH`, `PYTHONDONTWRITEBYTECODE=1`, and the Python command as arguments. This is execution-environment setup, not a checker fallback or installation.

| Result | Meaning |
| --- | --- |
| Exit 0, `scope=full`, `status=pass` | Every required group passed with intact evidence; eligible for the explicit bundle acceptance checks above. |
| Exit 0, `scope=focused`, `status=partial` | Only the selected development scope passed; unselected groups are `unrun`, and this is never accepted baseline evidence. |
| Exit 1, `status=fail` | A selected runtime/behavior/integrity/shutdown check failed. Inspect the complete available matrix and preserved evidence. |
| Exit 2 | Invalid input, selection or prerequisite; existing results are never overwritten. |

There is no skip-within-group, eval-only, accept, install, activate or restore-to-live mode. Full measurement failures are not automatically retried or promoted.

The gate runs real 130-column by 42-row Fresh PTYs, one private full-profile session and tiny Git fixture per group. It uses the copied application, correlated native buffer/mode/selection/pane observations, actual key bytes or actual palette entries, rendered pyte cell attributes, real save output, the configured Python language server and a disposable `/bin/sh` terminal. Startup trust remains **Keep Restricted**. Every HOME/XDG/TMP/history location is private. It never attaches to a user session. Runtime homes, caches, probes and fixture repositories are removed after owned processes exit; accepted assets are inputs, checker, manifest/result and small direct evidence. Failures retain relevant logs.

Failed groups additionally retain up to the last 128 KiB of their native and PTY logs as `fresh.log.tail` and `pty.log.tail`, alongside correlated state/screen and sent-key evidence. These are bounded failure tails, not complete transcripts. Later checks never trim or overwrite an existing run.

The thirteen groups, in fixed order, are `profile-ui`, `file-chords`, `dup-comment`, `json-save`, `python-nav`, `search-selection`, `explorer-focus`, `terminal-focus`, `pane-layout`, `tab-move`, `tab-reopen`, `markdown-preview`, and `review-focus`. A group requires every subcase. Ordinary behavioral failures are captured and the owned session is closed before the next independent group runs. Independent duplication/comment fixtures also retain individual results; failed undo does not prevent measuring a freshly initialized above/comment fixture. Interruption, unsafe initialization/effects, changed frozen/protected inputs or failed teardown stop further launches. Unselected or safely unreachable groups remain `unrun`, never passing. No prior temporary snapshots or archived native outputs can satisfy a current run.

Raw PTY evidence does not claim physical macOS/Fn/Ghostty keypress or font-rendering verification. Ghostty's source is preserved; a real-session smoke belongs to separately approved activation.

## Keep-source inventory and retirement conditions

Retirement is conditional on the same observable behavior in the **final combined upstream candidate**, not a similarly named action or release-note promise.

| Keep now | Purpose | Observable upstream replacement required before retirement |
| --- | --- | --- |
| Split-focus macros `n`/`p`, including H/J/I previous and K/L next bindings | Restore keyboard focus to an editor after leaving the explorer, not merely highlighted chrome | `explorer-focus`: next/previous pane geometry and actual sentinel insertion into the intended editor, with the other file unchanged. Plain next_split/prev_split is not equivalent. |
| File-icon overrides | Display the configured folder indicators and Python glyph while showing hidden/gitignored files | `profile-ui`: `.agents`, navigation.py, folder glyph and U+E606 render through the current source profile. |
| Closed-file stack and `reopenClosedTab` | Reopen the last real path, excluding virtual views | `tab-reopen`: close a real tab and a diff; Cmd+Shift+T restores the file, not the diff. |
| `focusIntegratedTerminal` | No-op without a terminal; focus an existing dock PTY | `terminal-focus`: actual printf proof in the private fixture, editor bytes unchanged, no terminal created by the initial Cmd+J. |
| Search painting and cleared-query wrapper | Exact active match yellow, other match grey; retain an intentionally empty search | `search-selection`: forward/reverse native occurrence positions and exact colors, then empty reopened query. |
| Unsaved Markdown preview helper and namespace cleanup | Reversible compose for untitled Markdown without extending file-backed eligibility | `markdown-preview`: exact text preserved, compose/source toggles, visible source markup restored, named-file handling remains native. Preserve its page-width rules. |
| `selectAllOccurrences` and multi-selection paint | Select every exact occurrence once; distinguish multi- from single-selection colors | `search-selection`: two exact foo selections, repeat adds none, multi grey and single blue without file mutation. |
| Directional tab movement helpers and bundled move_tab_left/right bindings | Reorder in-pane; move only the source tab left/down/right/up, creating an editor neighbor and skipping terminals | `tab-move`: rendered tab membership and native geometry for all four directions, a third existing copy retained, terminal not replaced. A moveBufferToSplit call alone is not equivalence. |
| Side-correct resize helpers and thin `equalizeAllPanes` handler | Grow/shrink the active side on both axes; expose distributeSplitsEvenly as a command | `pane-layout`: both sides grow/shrink correctly and siblings equalize within one cell. Keep terminal ratio keys separate. |
| Duplicate/comment wrappers | Preserve stock caret/copy placement and exact required reversible-text behavior | `dup-comment`: single-caret byte positions, complete selected-copy text/count/ranges, one Undo restoring the original text, and indented/UTF-8 comment roundtrips. Current per-block multi-copy undo remains a required FAIL, not an exception. Do not impose inactive native full secondary-cursor undo or disjoint secondary-line guarantees. Ctrl+D remains a separate native binding. |
| cursor-status plugin and unicode-segmenter vendor closure | Unpadded grapheme-aware line:column and total lines, hidden for terminals | `profile-ui` and `terminal-focus`: emoji caret byte 5 renders `1:3|2`, two lines; terminal status omits the custom token. |
| Explicit config/theme preferences, file-command contexts and review binding | Preserve animations=false, active indentation guide, rulers, whitespace/formatting choices, theme colors, global Cmd+R m/d held/released variants and global all-files review | Full gate: ordinary/Markdown/generic-mode language picker/current diff, reversible review focus, JSON comment-preserving formatting, actual basedpyright navigation, and exact editor/tab/selection colors. Do not trim explicit same-as-default values. |

Source review found no justified cleanup in these entries. Keeping working source is the intended result of that review, not an unfinished cleanup task.

## Update and replacement-retirement order

1. **Preserve and confirm the current accepted pair.** Resolve its explicit immutable manifest. Verify result/evidence and every manifest file digest, then confirm installed application and authoritative dotfiles runtime sources agree with the accepted application/profile/Ghostty. Confirm the five live Fresh links and Ghostty link point to their source-of-truth targets. Preserve the pre-fix backup unchanged. Stop on live divergence; never overwrite divergent live files.
2. **Prepare the chosen upstream application/profile in isolation.** Acquisition or installation requires its own authority; this package does neither. With an already-prepared candidate binary, create a new private candidate profile from the accepted frozen profile and a separate Ghostty copy. Work only on that copy, never the active source or links. For example, after choosing unused `CANDIDATE` and the explicit accepted `BUNDLE`:

   ```sh
   python3 -c 'import os, pathlib, shutil; r=pathlib.Path(os.environ["CANDIDATE"]); r.mkdir(mode=0o700); b=pathlib.Path(os.environ["BUNDLE"]); shutil.copytree(b/"inputs/fresh",r/"fresh"); shutil.copytree(b/"inputs/ghostty",r/"ghostty"); [(p.chmod(0o700 if p.is_dir() else 0o600)) for p in r.rglob("*")]'
   ```

   Supply `CANDIDATE_BINARY`, `UPSTREAM_REF`, and an unused `CANDIDATE_OUT`. During development, run the affected group without repeating unrelated tours; this example checks actual explorer-to-editor focus:

   ```sh
   "$PYTHON" .config/fresh/maintenance/check.py --binary "$CANDIDATE_BINARY" --profile "$CANDIDATE/fresh" --ghostty "$CANDIDATE/ghostty" --upstream-ref "$UPSTREAM_REF" --case explorer-focus --out "$CANDIDATE_OUT"
   ```

   Stock upgrades require **no Rust build or patch rebase**. Standalone candidates without package metadata are recorded as such, not guessed to be Homebrew builds.
3. **Retire only proven equivalents, in that candidate.** Match the inventory condition. Migrate every binding, command and caller; delete only now-exclusive helpers/imports/assets; remove the active patch/workaround entry. Retain meaningful behavior-regression cases. Do not keep aliases, shadow fallbacks or obsolete re-exports. Do not delete immutable rollback or inactive evidence as dead code. A replacement that only changes highlighted chrome fails even if its action name looks right.
4. **Run the full gate on the final combined candidate and inspect the relevant delta.** Use a fresh output and the same candidate inputs without `--case`. Do not accept independent focused successes as a combined result. Only a successful full candidate is eligible for full replay from its frozen checker/application/profile/Ghostty into another unused root. Compare application/profile/Ghostty digests and require distinct run IDs and fresh evidence. Preserve failed runs; use a new unique sibling output after an authorized checker correction. Never erase or overwrite a run to make a command appear fresh, weaken an oracle to fit a candidate, or reclassify a required failure as optional.
5. **Obtain activation approval separately, then smoke the real session with paired rollback ready.** The existing delivery owner, not this checker, performs any application/profile activation and agreed session stop/restart. Check real macOS/Fn/Ghostty gestures and visual rendering only under that authority. If rollback is approved, restore the selected application **and its matched dotfiles-source profile** from the same accepted manifest, preserving unrelated/generated files and agreed live links. Do not restore the older inactive candidate wholesale or mix its profile with the accepted stock binary. No user-session restart or actual live restoration is part of this maintenance package.

## Inactive native history

`inactive-native/` is **inactive immutable historical evidence**, not an alternative live profile, fallback loader, install source, or accepted stock bundle. The eight archived files are:

- `IDENTITY.txt`
- `candidate/init.ts`
- `candidate/config.json`
- `proof/native.patch`
- `proof/frozen-manifest.json`
- `proof/FreshNativeCompletion-attempt2-handoff.txt`
- `verification/noncode-recovery-result.json`
- `verification/additional-evidence-checks.txt`

Upstream was `v0.4.10` at `a7dca75c04ebc57c99a9786051729b55fdd72a2f`. The final debug binary SHA256 was `8df58507112cd459e30961d82600eacddc37138c67b0d20b7f6e0427ea14ab12`. **`proof/frozen-manifest.json` takes precedence for the final candidate.** `IDENTITY.txt` describes the initial experiment and contains superseded patched-file hashes. Later proof corrections closed, but this archived candidate config predates the global Cmd+R fix. Never feed it to the stock gate as the current profile or reconstruct an old native candidate from memory.

The archive intentionally excludes the source clone, Cargo caches, debug binary, raw user-file snapshots and complete temporary runtime trees. It preserves evidence only; there is no current native installation decision.

If a future separately approved decision adopts native patches, preserve the upstream base commit, patch set and exact build identity, drop patches already upstream, inspect conflicts, and extend this gate with the archived stronger edit contracts before claiming that **patched combination** ready. That conditional native branch is not implemented or authorized here. Native code quality does not replace full-profile, real-key, formatting, LSP, rendering and paired rollback proof.
