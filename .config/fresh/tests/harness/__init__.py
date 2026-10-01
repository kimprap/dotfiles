"""PTY harness for the Fresh profile catalog (`FEATURES.md` <-> `tests/cases/`).

Adding a case
-------------
One file per catalog row: `tests/cases/<case_id>.py`, where <case_id> is the
row's Case cell. Optional inputs live in `tests/fixtures/<case_id>/`.

    CASE_ID = "my_case"            # must equal the file stem
    REQUIRES = ("prettier",)       # PATH tools resolved before isolation; missing -> UNRUN
    TIMEOUT = 90                   # optional wall-clock seconds (default 90)

    def run(s):                    # s: harness.session.Session, not yet launched
        s.write("a.txt", "hello\\n")        # or s.fixture() to copy fixtures/<case_id>/
        s.commit()                          # optional: commit the workspace (a private git repo)
        s.launch("a.txt")                   # Fresh on file args; waits for the probe
        s.keys("super+shift+t")             # keystrokes; chords: s.keys("super+r", "m")
        s.wait_state(lambda st: st["text"] == "hello\\n", what="text restored")
        s.check(s.read_bytes("a.txt").endswith(b"\\n"), "saved file keeps final newline")

Outcome: returning normally is PASS; an AssertionError (from `s.check`, a
`s.wait*` timeout or `assert`) is FAIL with its message as the first failed
assertion; `raise Unrun("reason")` is UNRUN; any other exception (probe
timeout, PTY EOF, unparsable probe reply) is FAIL with that reason. After the
case, teardown problems and log-guard hits (`Unhandled Promise rejection`,
`os error 24`, `ERROR … Plugin:`) turn a PASS into FAIL. A rejection carrying a
signature listed in FEATURES.md `## Upstream limitations` → `### Log-guard
signatures` does not fail the case; the runner prints `NOTE <row> <case>
upstream rejection: <signature>` (unless the line names a repo plugin file). For an
`upstream-limitation` row the case asserts the desired behavior: PASS prints
LIFTED, FAIL prints LIMIT.

Session API (`s`)
-----------------
Setup (before launch): `s.work` (workspace, cwd), `s.home`, `s.config_dir`
(the profile copy; edit it to vary config), `s.env`, `s.path(rel)`,
`s.write(rel, text|bytes)`, `s.fixture(name=None)`, `s.git(*args)`, `s.commit(msg)`.

Process: `s.launch(*files, nofile=None, args=(), cwd=None)` returns the first
probe reply; `nofile=256` applies `ulimit -n`. `s.stop(force=True)` quits
(`force=False` runs the normal `quit` action) so a case may relaunch.
`s.alive()`, `s.pid`.

Input: `s.keys(*strokes)` (spec `mods+key`, mods shift|alt|ctrl|super; keys are
characters or enter, tab, backspace, escape, space, up/down/left/right, home,
end, pageup, pagedown, insert, delete, f1..f12; raw bytes pass through),
`s.type(text)`, `s.paste(text)`, `s.mouse(click|release|drag, col, row,
button="left")`, `s.click(col, row)`, `s.sleep(sec)` (key-release timing only).

Observation: `s.state()` probe snapshot with keys buffer (BufferInfo), text,
primary, cursors, selected (text per cursor), mode, search, viewport, panes
(describeWorkspace), splits, buffers. `s.screen()` -> Screen with `.lines`,
`.text`, `.cursor`, `.cell(x, y)` (char, fg, bg as `#RRGGBB`), `.find(needle)`,
`.find_all(needle)`; `s.cell(x, y)`. `s.read_bytes(rel)` for saved bytes.
`s.log_text()`, `s.log_problems()` (guard hits minus catalogued signatures),
`s.cursor_style()` (last DECSCUSR parameter, e.g. 5 = blinking bar; None if none).

Waits are bounded polls (default 5 s): `s.wait(fn, timeout, what)`,
`s.wait_screen(pred)`, `s.wait_text(needle)`, `s.wait_state(pred)`.
Setup-only probe helpers (never the behavior under test): `s.open(path)`,
`s.set_cursor(byte_offset)`, `s.action(name)`.

Isolation: each case gets a new mktemp root with private HOME,
XDG_{CONFIG,DATA,STATE,CACHE,RUNTIME}_DIR and TMPDIR, a minimal environment
(no FRESH_*/GIT_*/DYLD_*), a 120x40 xterm-256color PTY, and the profile copied
from --profile with the test probe injected as plugins/zz-test-probe.ts.
"""
from .session import Unrun

__all__ = ["Unrun"]
