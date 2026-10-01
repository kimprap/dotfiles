# Fresh maintenance: tested profile, bump skills and the 0.5.2 proposal

**Datetime**: 2026-09-30-0053
**Scope**: `.config/fresh` catalog, PTY test framework and profile cutover, bootstrap Fresh links, `bump-fresh` skill, `omp-update`→`bump-omp` rename, and the 0.5.1→0.5.2 proposal (spec fresh-maintenance/spec-v8 seams T0–T7)
**Summary**: Land a catalog-driven, isolated PTY test suite, cut the Fresh profile over to the fixed six-link layout with the E1/E2 defects fixed, add `bump-fresh`, rename `omp-update` to `bump-omp`, and stop with the verified 0.5.2 proposal awaiting user approval.
**Status**: DONE
**Completed At**: 2026-10-01-1543

## Outcome and authority

- Outcome: `.config/fresh/FEATURES.md` holds 25 rows in 1:1 correspondence with `.config/fresh/tests/cases/*.py`; `uv run --script .config/fresh/tests/run.py test|drift|live|soak` runs isolated from the real HOME; on installed 0.5.1 the refined repo profile (`config_macos.json`, `plugins/features.ts` + `features/*.ts`, `plugins/cursor-status.ts`, theme, vendor) passes all 23 non-limitation rows and a 30-minute `~/.dotfiles` soak without fd exhaustion or unhandled rejections; bootstrap links the fixed six-path set and retires the `config.json`/`init.ts` links; `maintenance/`, `config.json` and `init.ts` are gone; `bump-fresh` checks, proposes, swaps and rolls back per spec §4.4; `omp-update` is renamed `bump-omp` with no active reference left; the 0.5.1→0.5.2 proposal is saved at `local://fresh-0.5.2-proposal.md`, passes `proposal-check`, and awaits the user's approval with nothing installed, edited or swapped.
- Authority: Technical specification `.agents/artifacts/2026-09-30_fresh-maintenance-spec.md` revision `fresh-maintenance/spec-v8` (SHA-256 `4c245619e21364da0f45bd77093dbf9f06517d42a157f34a3d9fb064271562f2`), derived from Engineering Requirements Brief CONFIRMED r2 (`local://fresh-requirements-draft.md`) under the approved dev-ask route. The spec owns the design (D1–D10, §3–§4), invariants I1–I5, effects and rollback (§5), acceptance AC-1–AC-14 (§6), test seams (§7) and seam boundaries (§8). Spec baseline is `3c7362e`; current HEAD `a70bddf` changes no Fresh, bootstrap, skill or `versions.mjs` path, and commits the user's earlier `cli.mjs` edits, whose L174 still holds the only `omp-update` reference there. Task IDs: plan T1–T7 are spec seams T1–T7; spec seam T0 (rename) is plan T8 because the lean grammar numbers tasks from T1; the spec's post-approval continuation (its seam T8) is not a task of this plan and is named below only as the post-approval continuation. AC-1–AC-13 are projected verbatim, flattened to one line (spec "Expect:" bullets joined after `; expect`). AC-G1–AC-G4 project the spec §8 handoff gates of seams T1–T4, which the spec states with their command and outcomes but without AC IDs; only the IDs and one-line check form are added, and the E1/E2 FAIL allowance stays limited to the two cases §8 names. Ownership deltas against spec §8: AC-5 moves from T5 to T1 (T1 writes every row; T5 owns only the Implementation column), AC-6 moves from T1 to T5 (its sandboxes need `config_macos.json` and the six-link bootstrap set, which exist only after T5), and AC-3 (unassigned in §8) goes to fan-in T5 (it needs all 25 cases).
- Assurance: standard

## Scope and effects

- Scope: Check notation (spec §6): commands run from `~/.dotfiles`; `R=uv run --script .config/fresh/tests/run.py`; `B=~/.local/bin/fresh`. T1 owns the runner, harness, probe template, catalog rows/limitations section, and the reference case `line_wrap_default`; its `test --json OUT` result records the summary counts and the sha256 of `--binary` and of the `--profile` tree, which T6's swap precondition consumes (spec §4.4 step 6.1). Every file under `.config/fresh/tests/`, including T6's test, must stay clear of AC-4's forbidden-string grep. T2, T3 and T4 each own their eight case files and any `tests/fixtures/<case_id>/` inputs for those cases only, written against the current (pre-cutover) profile as a characterization net; a case needing a harness change or a fixture shared across tasks stops and returns to the receiver. T5 performs the D1–D4 cutover repo-only and is the acceptance fan-in for catalog drift, the live check and the full suite. T6 adds the skill, its script and the one retained swap-failure test (spec §7). T7 is the first `bump-fresh` run, phases 1–4 only, and ends at the approval gate. T8 is the rename per spec §4.6 with D9 at its default (rename only). The case-to-task split is spec §8: T2 presentation, interaction-highlights, explorer-icons (E1 regression), preview-tabs, explorer-focus, file-browser-hidden, cursor-status (A2), freshog-isolation; T3 boundary-selection, search-selection, markdown-preview, duplicate-lines, dup-multicopy-undo, comment-json-save, python-nav, document-navigation; T4 native-keymap, file-chords, reopen-closed-tab, terminal-focus, tab-move, pane-layout, review-diff, diff-view-wrap. Sizing: kept at the spec's seams — the harness, each case third, the 1,230-line decomposition with its fan-in runs, and the skill each fit one fresh worker; T2–T4 split case authoring by feature area into disjoint files.
- Effects: Working-tree edits, creations and deletions limited to the task Targets (the deletions of `.config/fresh/config.json`, `.config/fresh/init.ts` and `.config/fresh/maintenance/` are repo-only; Git history is the record); `git mv`-equivalent rename of `.config/agents/skills/omp-update/` to `bump-omp/`. Running the installed `~/.local/bin/fresh` read-only inside per-case `mktemp` roots with private HOME, XDG_* (including `XDG_RUNTIME_DIR`) and TMPDIR, under `ulimit -n 256` where the checks say so, including 30-minute soak runs; teardown `fresh --cmd daemon kill --all` only inside a case env. `uv` may download the pinned `pyte==0.8.2` (with `wcwidth`) from PyPI into its user cache. Sandboxes and scratch under `mktemp -d` only; the AC-8 sandbox may `git clone` the local `~/.dotfiles`. T7 only: read-only GitHub network queries against `sinelaw/fresh` (`gh release view`, release notes, the v0.5.1…v0.5.2 source diff read via `gh` or a temp checkout outside the repo), `run.py live` on the real HOME (read-only), and writing `local://fresh-0.5.2-proposal.md` plus a temp copy outside the repo. No write under the real HOME's Fresh config/data/state, `~/.local/bin/fresh`, `/tmp/fresh-$UID`, `~/.local/share/fresh-maintenance` or `~/.local/share/fresh-bump` (I1); no live-link change, bootstrap run, release download, install, swap, `fresh --cmd update`, Homebrew use, kill of a live Fresh process, git staging or commit, or push. A commit needs a separate explicit shipping request.
- Non-goals: the post-approval continuation — `bump-fresh` phases 5–7 (candidate download, candidate `test`/`soak`, automatic swap, report) and AC-14 — which continues the same skill run only after the user's explicit approval of the T7 proposal and is not dispatched by this plan; U1 (the user runs `~/.dotfiles/.config/scripts/bootstrap` before the next Fresh restart; proof `uv run --script ~/.dotfiles/.config/fresh/tests/run.py live` exits 0), which no task performs; discarding the live user-layer `~/.config/fresh/config.json`; `bin/freshog` and `.config/ghostty/fresh/` changes; any change to `bump-omp` procedure text beyond name/H1 (D9 default); workarounds for upstream limitations, native patches, upstream PRs, other bug hunting; physical Ghostty gestures; historical `.agents/artifacts/**` and `.agents/plans/**` references.

## Tasks

- [x] T1. Isolated PTY runner, harness and probe with the 25-row catalog and one end-to-end reference case
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t1-child
  - Depends on: none
  - Targets: .config/fresh/tests/run.py, .config/fresh/tests/harness/, .config/fresh/tests/cases/line_wrap_default.py, .config/fresh/tests/fixtures/line_wrap_default/, .config/fresh/FEATURES.md (rows' ID/Behavior/Case/Status cells, initial Implementation cells, and ## Upstream limitations)
  - Acceptance: AC-G1, AC-5, AC-12
  - Receiver: route-agent dev-implementation controller

- [x] T2. Characterization cases for the explorer and UI rows, including the E1 and A2 regressions
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t2-child
  - Depends on: T1
  - Targets: .config/fresh/tests/cases/presentation.py, .config/fresh/tests/cases/interaction_highlights.py, .config/fresh/tests/cases/explorer_icons.py, .config/fresh/tests/cases/preview_tabs.py, .config/fresh/tests/cases/explorer_focus.py, .config/fresh/tests/cases/file_browser_hidden.py, .config/fresh/tests/cases/cursor_status.py, .config/fresh/tests/cases/freshog_isolation.py, .config/fresh/tests/fixtures/<case_id>/ for T2's eight cases, .config/fresh/tests/harness/ (additive only: DECSCUSR recording + `cursor_style()`, log-guard upstream-signature exception + `NOTE` line, catalog parsing of `### Log-guard signatures`), .config/fresh/tests/run.py (additive only: NOTE output, `soak-upstream` line), .config/fresh/FEATURES.md (`## Upstream limitations` section only: `### Log-guard signatures` entries `unknown baseline id` and `baseline released during load`, plus the Prettier comment-json-save and #3245-on-0.5.1 notes)
  - Acceptance: AC-G2
  - Receiver: route-agent dev-implementation controller

- [x] T3. Characterization cases for the editing and search rows
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t3-child
  - Depends on: T1
  - Targets: .config/fresh/tests/cases/boundary_selection.py, .config/fresh/tests/cases/search_selection.py, .config/fresh/tests/cases/markdown_preview.py, .config/fresh/tests/cases/duplicate_lines.py, .config/fresh/tests/cases/dup_multicopy_undo.py, .config/fresh/tests/cases/comment_json_save.py, .config/fresh/tests/cases/python_nav.py, .config/fresh/tests/cases/document_navigation.py, .config/fresh/tests/fixtures/<case_id>/ for T3's eight cases
  - Acceptance: AC-G3
  - Receiver: route-agent dev-implementation controller

- [x] T4. Characterization cases for the keymap, pane and tab rows
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t4-child
  - Depends on: T1, T2 (harness signature exception only)
  - Targets: .config/fresh/tests/cases/native_keymap.py, .config/fresh/tests/cases/file_chords.py, .config/fresh/tests/cases/reopen_closed_tab.py, .config/fresh/tests/cases/terminal_focus.py, .config/fresh/tests/cases/tab_move.py, .config/fresh/tests/cases/pane_layout.py, .config/fresh/tests/cases/review_diff.py, .config/fresh/tests/cases/diff_view_wrap.py, .config/fresh/tests/fixtures/<case_id>/ for T4's eight cases
  - Acceptance: AC-G4
  - Receiver: route-agent dev-implementation controller

- [x] T5. Profile cutover to the platform layer, feature modules and fixed six-link bootstrap set with the E1/E2 fixes
  completed 2026-10-01-0129
  - Owner: fresh-maintenance-t5-child
  - Depends on: T2, T3, T4
  - Targets: .config/fresh/config_macos.json, .config/fresh/plugins/features.ts, .config/fresh/features/, .config/fresh/plugins/cursor-status.ts, .config/fresh/FEATURES.md (Implementation column only), .config/fresh/config.json (delete), .config/fresh/init.ts (delete), .config/fresh/maintenance/ (delete), .config/scripts/bootstrap (Fresh SYMLINKS, LEGACY_SYMLINKS and Fresh mkdir lines only)
  - Acceptance: AC-1, AC-2, AC-3, AC-4, AC-6, AC-13
  - Receiver: route-agent dev-implementation controller

- [x] T6. `bump-fresh` skill with check, swap, rollback and proposal-check
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t6-child
  - Depends on: T1
  - Targets: .config/agents/skills/bump-fresh/SKILL.md, .config/agents/skills/bump-fresh/scripts/fresh_bump.py, .config/fresh/tests/test_fresh_bump.py
  - Acceptance: AC-7, AC-8
  - Receiver: route-agent dev-implementation controller

- [x] T7. First `bump-fresh` run to the 0.5.1→0.5.2 proposal, stopping at the approval gate
  completed 2026-10-01-0139
  - Owner: fresh-maintenance-t7-bump-fresh-run
  - Depends on: T5, T6
  - Targets: local://fresh-0.5.2-proposal.md (session artifact; no repository change)
  - Acceptance: AC-10, AC-11
  - Receiver: route-agent dev-implementation controller

- [x] T8. Rename `omp-update` to `bump-omp` and migrate its active references (spec seam T0)
  completed 2026-09-30-0147
  - Owner: fresh-maintenance-t8-child
  - Depends on: none
  - Targets: .config/agents/skills/omp-update/ → .config/agents/skills/bump-omp/ (SKILL.md name and H1 lines only), .config/agents/harnesses/omp/acp-controller/cli.mjs (L174 only), .config/agents/harnesses/omp/acp-controller/lib/versions.mjs (L2–L3 only)
  - Acceptance: AC-9
  - Receiver: route-agent dev-implementation controller

## Acceptance

- [x] AC-G1. Harness proven end to end on the reference case (spec §8 T1 gate)
  Behavior: `line_wrap_default` passes on installed 0.5.1 with a scratch profile containing `config_macos.json`, fails against the pre-cutover repo profile, and `drift` lists exactly the 24 cases not yet written.
  Check: `P=$(mktemp -d); cp -R .config/fresh/. $P/; printf '{"editor":{"line_wrap":true}}\n' > $P/config_macos.json; $R test --binary $B --profile $P --case line_wrap_default`, then `$R test --binary $B --profile .config/fresh --case line_wrap_default`, then `$R drift`; expect a line starting `PASS line-wrap-default line_wrap_default` from the first run, a line starting `FAIL line-wrap-default line_wrap_default` from the second, and from `drift` exit 1 with exactly 24 `DRIFT row <id>: case <case> missing` lines, one for every catalog row except `line-wrap-default`.

- [x] AC-G2. Explorer/UI cases characterize the current profile (spec §8 T2 gate)
  Behavior: on installed 0.5.1 with the current repo profile, each T2 case passes. The exceptions: `explorer_icons` may fail at its E1 regression, and any T2 case may fail solely at the log guard on the E2 `cursor-status` rejection; T5 fixes both. Catalogued upstream log-guard signatures print `NOTE` and do not fail. `presentation` observes the cursor style. Drift reports none of T2's cases missing.
  Check: `$R test --binary $B --profile .config/fresh --case presentation --case interaction_highlights --case explorer_icons --case preview_tabs --case explorer_focus --case file_browser_hidden --case cursor_status --case freshog_isolation`, then `$R drift`. Expect a `PASS` line for each case, with two allowed exceptions: (a) `explorer_icons` may instead print `FAIL` whose first failed assertion is its E1 (`os error 24` or save-failure) assertion; (b) any T2 case may instead print `FAIL` whose first failed assertion is the log-guard `Unhandled Promise rejection` containing `Buffer BufferId(` from `refreshCursorStatus`, with the case's behavior assertions all passing (shown by rerunning that case with `--keep` and reading its assertion log). Also expect `NOTE` lines only for signatures listed under `### Log-guard signatures`, no `UNRUN`, and no `DRIFT row` line for `presentation`, `interaction-highlights`, `explorer-icons`, `preview-tabs`, `explorer-focus`, `file-browser-hidden`, `cursor-status` or `freshog-isolation`.

- [x] AC-G3. Editing/search cases characterize the current profile (spec §8 T3 gate)
  Behavior: on installed 0.5.1 with the current repo profile, each T3 case passes and its limitation row reports `LIMIT`, and drift reports none of T3's cases missing.
  Check: `$R test --binary $B --profile .config/fresh --case boundary_selection --case search_selection --case markdown_preview --case duplicate_lines --case dup_multicopy_undo --case comment_json_save --case python_nav --case document_navigation`, then `$R drift`; expect a line starting `LIMIT dup-multicopy-undo dup_multicopy_undo`, a `PASS` line for each other case, no `UNRUN`, and no `DRIFT row` line for `boundary-selection`, `search-selection`, `markdown-preview`, `duplicate-lines`, `dup-multicopy-undo`, `comment-json-save`, `python-nav` or `document-navigation`; any T3 case may instead print `FAIL` whose first failed assertion is the log-guard `Unhandled Promise rejection` containing `Buffer BufferId(` from `refreshCursorStatus`, with its behavior assertions all passing.

- [x] AC-G4. Keymap/pane/tab cases characterize the current profile (spec §8 T4 gate)
  Behavior: on installed 0.5.1 with the current repo profile, each T4 case passes and its limitation row reports `LIMIT`. The exception: any T4 case may fail solely at the log guard on the E2 `cursor-status` rejection, which T5 fixes. Catalogued upstream log-guard signatures print `NOTE` and do not fail. Drift reports none of T4's cases missing.
  Check: `$R test --binary $B --profile .config/fresh --case native_keymap --case file_chords --case reopen_closed_tab --case terminal_focus --case tab_move --case pane_layout --case review_diff --case diff_view_wrap`, then `$R drift`. Expect a line starting `LIMIT diff-view-wrap diff_view_wrap` and a `PASS` line for each other case. The allowed exception: any case may instead print `FAIL` whose first failed assertion is the log-guard `Unhandled Promise rejection` containing `Buffer BufferId(` from `refreshCursorStatus`, with the case's behavior assertions all passing. Also expect `NOTE` lines only for signatures listed under `### Log-guard signatures`, no `UNRUN`, and no `DRIFT row` line for `native-keymap`, `file-chords`, `reopen-closed-tab`, `terminal-focus`, `tab-move`, `pane-layout`, `review-diff` or `diff-view-wrap`.

- [x] AC-1. 30-minute soak on installed 0.5.1 (A1)
  Behavior: a 30-min isolated session in `~/.dotfiles` on 0.5.1 with the refined profile has no fd exhaustion or save/spawn failure.
  Check: `$R soak --binary $B --profile .config/fresh --workspace ~/.dotfiles --minutes 30`; expect exit 0 and a line matching `soak: minutes=30 emfile=0 recovery=0 workspace=0 spawn=0 rejections=0 fds_peak=<n≤128>`.

- [x] AC-2. No unhandled rejection on vanished targets (A2)
  Behavior: closing buffers and terminals during cursor movement produces no unhandled rejection from repo plugins.
  Check: `$R test --binary $B --profile .config/fresh --case cursor_status`; expect exit 0 and a line starting `PASS cursor-status cursor_status`.

- [x] AC-3. Catalog and cases correspond 1:1 (A3)
  Behavior: the catalog and cases correspond 1:1, and drift is caught in both directions.
  Check: `$R drift`; expect exit 0 and `drift: rows=25 cases=25 ok`. Then `T=$(mktemp -d); cp -R .config/fresh/. $T/; rm $T/tests/cases/pane_layout.py; touch $T/tests/cases/orphan_x.py; uv run --script $T/tests/run.py drift --catalog $T/FEATURES.md`; expect exit 1 with lines `DRIFT row pane-layout: case pane_layout missing` and `DRIFT case orphan_x: no row`.

- [x] AC-4. Full suite passes on installed 0.5.1 (A4)
  Behavior: every non-limitation row passes on installed 0.5.1 with the repo profile, with no Homebrew, backup or live-link dependency. There is one exception, decided by the user: a single catalogued known intermittent failure (§3.3).
  Check: `$R test --binary $B --profile .config/fresh --json <out>`. Expect `unrun=0`, `drift=0`, `isolation=ok` and l+k=2 in the final summary line, plus one of two outcomes: - (a) exit 0 and a final line matching `summary: pass=23 fail=0 unrun=0 limit=<l> lifted=<k> drift=0 isolation=ok`; - (b) exit 1 and a final line matching `summary: pass=22 fail=1 unrun=0 limit=<l> lifted=<k> drift=0 isolation=ok`. The single FAIL's case must be listed under `### Known intermittent failures` in `.config/fresh/FEATURES.md`, and its message must start with that entry's prefix. The message is the case's `detail` in `<out>`, or the text after `FAIL <row> <case> ` on the FAIL line. Any other `FAIL`, or more than one `FAIL`, fails AC-4. Then `grep -rnE '/opt/homebrew|\.bak|fresh-maintenance|\.config/fresh/config\.json' .config/fresh/tests`; expect no output.
- [x] AC-5. Every r1 inventory feature has a row (A5)
  Behavior: every r1 inventory feature has a row.
  Check: `for id in presentation interaction-highlights native-keymap document-navigation boundary-selection explorer-icons preview-tabs explorer-focus file-chords reopen-closed-tab terminal-focus search-selection markdown-preview tab-move pane-layout duplicate-lines comment-json-save python-nav cursor-status review-diff freshog-isolation file-browser-hidden line-wrap-default; do grep -c "^| \`$id\` |" .config/fresh/FEATURES.md; done | sort -u`; expect exactly `1`.

- [x] AC-6. Live-config check flags drift and reports user-layer keys (A6)
  Behavior: the live-config check flags a replaced or diverging repo-owned live file and reports user-layer keys.
  Check: build three sandboxes H1–H3 from a script in `mktemp -d`, each `$H/.config/fresh` holding the bootstrap link set pointing into the repo: H1: `config_macos.json` is a regular-file copy; H2: `config_macos.json` is a regular file with one changed byte, plus a `config.json` containing `{"editor":{"line_wrap":false}}`; H3: intact. Run `$R live --home $H1`, `--home $H2`, `--home $H3`; expect H1: exit 1 with `LIVE config_macos.json: not a symlink to …`; H2: exit 1 with `LIVE config_macos.json: differs from repo` and `USER-LAYER editor.line_wrap = false (shadowed)`; H3: exit 0. Also, `$R test …` output (AC-4 run) contains a `live:` section.

- [x] AC-7. Up-to-date check is one read-only query with no writes (A7)
  Behavior: with nothing newer, the check makes one read-only query, prints one line and writes nothing.
  Check: in `S=$(mktemp -d)`, put a `gh` shim on PATH that appends its argv to `$S/gh.log` and prints `{"tagName":"v0.5.1",…}`; set `HOME=$S/home`; `touch $S/m`; run `python3 .config/agents/skills/bump-fresh/scripts/fresh_bump.py check --live-bin $B`; expect stdout exactly `Fresh up to date (v0.5.1)` and exit 0; `wc -l < $S/gh.log` = `1`; `find $S ~/.dotfiles -newer $S/m -type f ! -path "$S/gh.log" ! -path '*/.git/*'` prints nothing.

- [x] AC-8. Swap installs with a restorable record; failures leave the install byte-identical (A8)
  Behavior: after a pass the swap installs binary + profile and records a restorable pair; any failure leaves the live install byte-identical.
  Check: sandbox `S` with `S/live/fresh` (a copy of 0.5.1), `S/repo` (a `git clone` of `~/.dotfiles` at HEAD), a candidate profile with one changed plugin byte, and a pass-result JSON with matching hashes. Take pre-hashes with `find S/live S/repo/.config/fresh -type f | xargs shasum -a 256`; expect each case: (a) `swap` exits 0; the live sha equals the candidate's; `record.json` exists. (b) `rollback --record` exits 0; the hashes equal the pre-hashes. (c) With the candidate binary `chmod -x`, `swap` exits 4 and the hashes equal the pre-hashes. (d) With `S/live/fresh` replaced by a running `sleep 60` wrapper at that path, `swap` exits 3 and the hashes equal the pre-hashes. (e) With a result JSON containing `fail=1` at a case the candidate catalog does not list, or at a listed case whose `detail` does not start with the entry's prefix, `swap` exits 3 and the hashes equal the pre-hashes. The same holds with `unrun=1` beside a tolerated FAIL. (f) With a result JSON whose only FAIL is a listed case whose `detail` starts with the entry's prefix, and with matching hashes, `swap` exits 0. It prints `TOLERATED <case>: <message>`, and `record.json` `tolerated_failures` lists that case.

- [x] AC-9. No active `omp-update` reference; `bump-omp` resolves (A9)
  Behavior: no active `omp-update` references remain, and `bump-omp` resolves.
  Check: `git grep -n omp-update -- . ':!.agents/artifacts' ':!.agents/plans'`; expect no output. `grep -c '^name: bump-omp$' ~/.agents/skills/bump-omp/SKILL.md`; expect `1`. `test -e .config/agents/skills/omp-update; echo $?`; expect `1`.

- [x] AC-10. The 0.5.2 proposal classifies every row with evidence (A10)
  Behavior: the 0.5.2 proposal classifies every row with evidence and lists limitations separately.
  Check: `python3 .config/agents/skills/bump-fresh/scripts/fresh_bump.py proposal-check --catalog .config/fresh/FEATURES.md <saved proposal>`; expect exit 0 and `proposal: rows=25 classified=25 evidence=25`. The saved proposal is the agent's verbatim proposal text, written by the T7 owner to the session artifact `local://fresh-0.5.2-proposal.md`. The file contains an `**Upstream limitations**` field.

- [x] AC-11. Nothing installed, edited or swapped before approval (A7)
  Behavior: 0 installs, edits or swaps before approval.
  Check: before and after presenting the proposal, run `shasum -a 256 $B; git status --porcelain -- .config/fresh; ls ~/.local/share/fresh-bump 2>&1`; expect identical output.

- [x] AC-12. A test run leaves the real install untouched (isolation)
  Behavior: a full test run leaves the real Fresh install untouched.
  Check: `ls -la ~/.config/fresh | shasum; shasum -a 256 $B` before and after the AC-4 run; expect identical output, and the AC-4 summary contains `isolation=ok`.

- [x] AC-13. Superseded tooling gone; bootstrap retires old links and creates new ones (cleanup)
  Behavior: superseded tooling is gone, and bootstrap retires the old Fresh links and creates the new ones.
  Check: `test -e .config/fresh/maintenance; echo $?` → `1`; `bash -n .config/scripts/bootstrap; echo $?` → `0`; `$R drift` → exit 0 (includes the link-coverage check). Then run `$R live --home <sandbox>` twice; expect for a sandbox holding only the legacy `init.ts`/`config.json` links into the repo: exit 1, with `LIVE init.ts: legacy link still present` and `LIVE config_macos.json: not a symlink …`; for a sandbox holding exactly the six links: exit 0.

## Recovery and stops

- Recovery: Completed tasks and their checked evidence stand; resume from the first unchecked task whose dependencies are checked. Parallel groups: T1 and T8 start together; after T1, T2, T3, T4 and T6 run in parallel; T5 waits for T2–T4; T7 waits for T5 and T6. At T1, `drift` may additionally report link-coverage lines for the pre-cutover `maintenance/` files; only the missing-case lines are gated by AC-G1 until T5 removes them. AC-7's `find … -newer` window must run while no sibling is writing under `~/.dotfiles`; a hit on another task's file is rerun at quiescence, never filtered. When a T5 fan-in check (AC-1, AC-3, AC-4, AC-6, AC-13) fails because of a defect in a T1–T4 target, T5 reports it and the controller returns the repair to that target's task owner; T5 never edits another task's target. The profile cutover is reversible via `git checkout 3c7362e -- .config/fresh .config/scripts/bootstrap`. After T5 the only open obligation is U1 (user runs bootstrap); T5's handoff names it, and T7 reports any `LIVE` finding under **Config drift**. T7's handoff is the proposal; the user's explicit approval of it starts the post-approval continuation of the same `bump-fresh` run outside this plan, and a requested adjustment produces a revised proposal under T7. Execution-mechanism failures follow `skill://dev-implementation/references/execution-recovery.md`.
- Stops: Return to the spec owner when a baseline case fails on 0.5.1 outside the AC-G1–AC-G4 allowances, including a log-guard failure other than E1 in `explorer_icons`, the E2 `refreshCursorStatus` `Buffer BufferId(` rejection in a T2–T4 case, or a catalogued upstream signature (which prints `NOTE`); and any catalogued signature observed originating from a repo file (report it as a possible product bug, never weaken the case), a limitation case reports `LIFTED` on 0.5.1, the harness cannot observe a row through PTY, probe, saved file or log (the row stays `UNRUN` for the user to decide), a feature can be kept only by a new upstream-bug workaround, or any check would need to write the real HOME outside spec §4.4. Stop on `isolation: FAIL`, any write to an I1 path, spec digest mismatch, or any need to change a live link, run bootstrap, kill a live Fresh process, download a release asset, install, swap or commit. T7 stops at the approval gate and never proceeds to phases 5–7.

## Completion Summary

- T1–T8 completed. One dev-code-review (REPAIR REQUIRED: CR-1, CR-2, CR-3). CR-3 was repaired. CR-1 and CR-2 reached Stops, and the user decided them: the subfolder external-create glyph narrowing is accepted, and the inert `review_focus_prev` bindings are removed (spec-v5). The user then authorized one test-wait round, which fixed boundary_selection and interaction_highlights at 20/20. search_selection's intermittent yellow failure was diagnosed as a Fresh 0.5.1 overlay-priority bug; the user chose to keep the feature and record the limitation (spec-v6, AC-4 exception b).
- dev-verification: VERIFIED 16/16 (AC-1–AC-13, CR-1–CR-3). AC-4 gave outcome (a) `pass=23 fail=0 limit=2`; the AC-1 soak gave `fds_peak=31`.
- Learning: no durable learning. Papercut: `pc-ddb862c52c84e10f` (T7).
- The 0.5.2 proposal is stopped at the approval gate (sha256 `be40a70b…b316`): 2 Adapt, 23 Keep, 0 Retire. The open user step is U1 (bootstrap).
