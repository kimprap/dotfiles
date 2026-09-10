"""Consumer-visible stock Fresh contracts; setup actions never stand in for tested keys."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import shlex
import subprocess
import time

CASE_IDS = ("profile-ui", "file-chords", "dup-comment", "json-save", "python-nav",
            "search-selection", "explorer-focus", "terminal-focus", "pane-layout",
            "tab-move", "tab-reopen", "markdown-preview", "review-focus")
BASE = {
    "ordinary.txt": "plain\n", "probe.txt": "plain\n",
    "notes.md": "# Heading\n\n- item\n", "notes.markdown": "# Heading\n\n- item\n",
    "notes.mdx": "# Heading\n\n- item\n", "data.yml": "value: 1\n",
    "data.json": '{"value":1}\n', "code.rs": "fn main() {}\n",
    "navigation.py": "def target(value):\n    return value + 1\n\nresult = target(41)\n",
}
ESC = b"\x1b"
ENTER = b"\r"


def cmd(letter, modifiers=9):
    return f"\x1b[{ord(letter)};{modifiers}u".encode()


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def expect_state(state, *, text, primary=None, count=None, selected=None):
    require(state["text"] == text, f"text mismatch: expected {text!r}, got {state['text']!r}")
    if primary is not None:
        require(state["primary"]["position"] == primary, f"primary byte: expected {primary}, got {state['primary']}")
    if count is not None:
        require(state["cursorCount"] == count and len(state["all"]) == count,
                f"cursor count: expected {count}, got {state['all']}")
    if selected is not None:
        require(state["selected"] == selected, f"selected text: expected {selected!r}, got {state['selected']!r}")


def git(session, *args):
    env = dict(session.env, GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_SYSTEM="/dev/null", GIT_CONFIG_GLOBAL="/dev/null",
               GIT_TERMINAL_PROMPT="0")
    command = [session.tools["git"], "-c", "user.name=FreshCompatibility", "-c",
               "user.email=fresh-compat@example.invalid", "-c", "commit.gpgsign=false",
               "-c", f"core.hooksPath={session.root / 'empty-hooks'}", *args]
    return subprocess.run(command, cwd=session.fixture, env=env, check=True,
                          capture_output=True, text=True, timeout=15).stdout


def prepare(session):
    session.fixture.mkdir()
    (session.root / "empty-hooks").mkdir()
    (session.fixture / ".agents").mkdir()
    (session.fixture / ".agents/visible.txt").write_text("visible\n")
    (session.fixture / ".gitignore").write_text(".agents/\n")
    for name, text in BASE.items():
        (session.fixture / name).write_text(text)
    git(session, "-c", f"init.templateDir={session.root / 'empty-hooks'}", "init", "--quiet")
    git(session, "add", "--", *BASE, ".gitignore")
    git(session, "commit", "--quiet", "-m", "Disposable compatibility baseline")
    require(git(session, "remote").strip() == "", "fixture unexpectedly has a remote")
    originals = {name: git(session, "show", f"HEAD:{name}") for name in BASE}
    require(originals == BASE, "fixture Git baseline differs from exact contract")
    if session.case_id in ("file-chords", "tab-reopen", "review-focus"):
        for name, text in BASE.items():
            (session.fixture / name).write_text('{"value":2}\n' if name == "data.json" else text + "changed\n")
        (session.fixture / "untracked.txt").write_text("untracked\n")
    current = {name: (session.fixture / name).read_text() for name in BASE}
    (session.trace / "fixtures.json").write_text(json.dumps({"run_id": session.run_id, "head": originals,
        "working": current, "gitignore": ".agents/\n", "ignored_visible": "visible\n",
        "untracked": (session.fixture / "untracked.txt").read_text() if (session.fixture / "untracked.txt").exists() else None}, indent=2))


def setup(s, action):
    return s.request("action", {"name": action})


def cursor(s, position):
    s.request("cursor", {"position": position})
    return s.wait_state(lambda st: st["primary"]["position"] == position)


def open_file(s, name, text=None):
    path = s.fixture / name
    if text is not None:
        require(not path.exists(), f"fixture already exists: {name}")
        path.write_text(text)
    s.request("open-path", {"path": str(path)})
    state = s.wait_state(lambda st: st["path"] and Path(st["path"]).resolve() == path.resolve())
    setup(s, "focus_editor")
    return state


def language(s, name, suffix=b"m"):
    before = s.snapshot()
    s.keys(cmd("r"), suffix)
    s.wait_screen(lambda screen: re.search(r"(?m)^\s*Language:\s*", screen["text"]) is not None)
    s.keys(name.encode(), ENTER)
    return s.wait_state(lambda st: st["bufferId"] == before["bufferId"] and st["language"] == name.lower())


def palette(s, label):
    s.keys(cmd("p", 10))
    s.wait_screen(lambda screen: "Command" in screen["text"] or "command" in screen["text"])
    s.keys(label.encode())
    s.wait_screen(lambda screen: label in screen["text"])
    s.keys(ENTER)


def active(state):
    panes = [pane for pane in state["panes"] if pane["active"]]
    require(len(panes) == 1, f"expected one native active pane: {state['panes']}")
    return panes[0]


def editors(state):
    return [pane for pane in state["panes"] if pane["kind"] != "terminal"]


def focus(s, split_id):
    # Setup through real split navigation; never guess a native split ID.
    for _ in range(len(s.snapshot()["panes"]) + 1):
        state = s.snapshot()
        if active(state)["splitId"] == split_id:
            setup(s, "focus_editor")
            return state
        s.keys(cmd("l", 10))
    raise AssertionError(f"cannot focus observed split {split_id}")


def reset_layout(s):
    state = s.snapshot()
    for _ in range(max(0, len(state["panes"]) - 1)):
        count = len(state["panes"])
        if count == 1:
            break
        setup(s, "close_split")
        state = s.wait_state(lambda st: len(st["panes"]) < count)
    require(len(state["panes"]) == 1, "layout reset did not reach one pane")
    setup(s, "focus_editor")


def hide_explorer(s):
    # Setup only. Focus-explorer always reveals it, then toggle hides it deterministically.
    setup(s, "focus_file_explorer")
    setup(s, "toggle_file_explorer")
    setup(s, "focus_editor")


def cell(screen, x, y):
    for run in screen["rows"][y]:
        if run["x"] <= x < run["x"] + run["width"]:
            return run["attrs"]
    raise AssertionError(f"missing rendered cell {x},{y}")


def location(screen, needle):
    matches = [(line.index(needle), y) for y, line in enumerate(screen["text"].splitlines()) if needle in line]
    return matches[0] if len(matches) == 1 else None


def color_on(screen, needle, bg, fg=None):
    found = location(screen, needle)
    if found is None:
        return False
    x, y = found
    for offset in range(len(needle)):
        attrs = cell(screen, x + offset, y)
        if attrs["bg"].lower().lstrip("#") != bg:
            return False
        if fg is not None and attrs["fg"].lower().lstrip("#") != fg:
            return False
    return True


def profile_ui(s):
    hide_explorer(s)
    open_file(s, "status.txt", "a🙂b\nz")
    cursor(s, 5)
    s.wait_screen(lambda screen: "1:3|2" in screen["text"])
    first = s.capture("status-grapheme")
    expect_state(first["state"], text="a🙂b\nz", primary=5)
    require(first["state"]["line_count"] == 2, "wrong native line count")
    open_file(s, "second.txt", "second-buffer\nordinary-background\n")
    s.wait_state(lambda st: st["primary"]["line"] == 0 and st["primary"]["selection"] is None)
    s.wait_screen(lambda screen: "ordinary-background" in screen["text"] and "status.txt" in screen["text"])
    s.wait_screen(lambda sc: color_on(sc, "second.txt", "5b5b5b") and color_on(sc, "status.txt", "323741") and color_on(sc, "ordinary-background", "252525"))
    s.capture("tab-and-editor-colors")
    s.keys(cmd("e", 10))
    s.wait_screen(lambda sc: "File Explorer" in sc["text"] and "navigation.py" in sc["text"])
    s.keys(b"\x1b[5~")
    s.wait_screen(lambda sc: ".agents" in sc["text"] and "navigation.py" in sc["text"] and "\ue606" in sc["text"] and ("\uf07b" in sc["text"] or "\uf07c" in sc["text"]))
    s.capture("explorer-hidden-ignored-icons")


def current_diff(s, name, suffix, evidence_name):
    before = s.snapshot()
    s.keys(cmd("r"), suffix)
    s.wait_state(lambda st: st["name"] == f"*Diff: {name}*" and st["is_virtual"])
    screen = s.wait_screen(lambda sc: "OLD (HEAD)" in sc["text"] and "NEW (Working)" in sc["text"])
    lines = screen["text"].splitlines()
    header_row = next(y for y, line in enumerate(lines) if "OLD (HEAD)" in line and "NEW (Working)" in line)
    new_column = lines[header_row].index("NEW (Working)")
    body = lines[header_row + 1:-2]
    old_text = "\n".join(line[:new_column] for line in body)
    new_text = "\n".join(line[new_column:] for line in body)
    marker = '"value":2' if name == "data.json" else "untracked" if name == "untracked.txt" else "changed"
    require(marker in new_text and marker not in old_text, f"working-only content is not isolated to NEW: {name}")
    if name == "untracked.txt":
        require(not re.search(r"[A-Za-z]", old_text), "untracked OLD contains text")
    s.capture(evidence_name)
    s.keys(b"q")
    state = s.wait_state(lambda st: st["bufferId"] == before["bufferId"] and st["mode"] == before["mode"])
    expect_state(state, text=before["text"])


def file_chords(s):
    hide_explorer(s)
    contexts = ("notes.md", "notes.markdown", "notes.mdx", "data.yml", "data.json", "ordinary.txt", "code.rs", "ordinary.txt", "probe.txt")
    for index, name in enumerate(contexts):
        s.request("mode", {"name": None})
        state = open_file(s, name)
        if index == 7 or name == "notes.mdx":
            language(s, "Markdown")
        if name in ("notes.md", "notes.markdown", "notes.mdx") or index == 7:
            s.wait_state(lambda st: st["mode"] == "markdown-source")
        if name == "probe.txt":
            s.request("mode", {"name": "compat-editable"})
            s.wait_state(lambda st: st["mode"] == "compat-editable")
        if index % 2:
            s.keys(cmd("e", 10))
            setup(s, "focus_editor")
        else:
            hide_explorer(s)
        before = s.capture(f"{index}-mode-before")["state"]
        for variant, suffix in (("released", b"m"), ("held", cmd("m"))):
            s.keys(cmd("r"), suffix)
            s.wait_screen(lambda sc: re.search(r"(?m)^\s*Language:\s*", sc["text"]) is not None)
            s.capture(f"{index}-language-{variant}")
            s.keys(ESC)
            after = s.wait_state(lambda st: st["bufferId"] == before["bufferId"])
            expect_state(after, text=before["text"])
        for variant, suffix in (("released", b"d"), ("held", cmd("d"))):
            current_diff(s, name, suffix, f"{index}-diff-{variant}")
        if name == "notes.md":
            changed = language(s, "JSON")
            require(changed["bufferId"] == before["bufferId"], "language changed a different file")
            s.capture("markdown-selected-json")
        if name == "probe.txt":
            language(s, "Python", cmd("m"))
            s.capture("generic-selected-python")
            cursor(s, 0)
            s.keys(b"m", b"d")
            s.wait_state(lambda st: st["text"] == "md" + before["text"])
            s.capture("generic-bare-md-insert")
            setup(s, "undo")
            if s.snapshot()["text"] != before["text"]:
                setup(s, "undo")
            s.wait_state(lambda st: st["text"] == before["text"])
    s.request("mode", {"name": None})
    open_file(s, "list.md", "# Heading\n\n- item\n")
    s.wait_state(lambda st: st["mode"] == "markdown-source")
    cursor(s, len("# Heading\n\n- item"))
    s.keys(ENTER)
    s.wait_state(lambda st: st["text"] == "# Heading\n\n- item\n- \n")
    s.capture("markdown-list-enter")
    s.request("mode", {"name": None})
    open_file(s, "untracked.txt")
    current_diff(s, "untracked.txt", b"d", "untracked-empty-old")
    for name in BASE:
        expected = '{"value":2}\n' if name == "data.json" else BASE[name] + "changed\n"
        require((s.fixture / name).read_text() == expected, f"file command saved/mutated {name}")


def dup_comment(s):
    hide_explorer(s)
    variants = []

    def measure(name, function, *args):
        try:
            function(*args)
            s.capture(name + "-passed")
            variants.append({"id": name, "status": "pass", "error": None})
        except (AssertionError, TimeoutError) as error:
            message = f"{type(error).__name__}: {error}"
            variants.append({"id": name, "status": "fail", "error": message})
            # A fresh native capture also settles any in-flight deadline snapshot.
            # If observation itself cannot recover, do not reuse this session.
            s.capture(name + "-failed")

    def single(direction, key, position):
        open_file(s, direction + ".txt", "hello\nworld\n")
        cursor(s, 2)
        s.capture(direction + "-before")
        s.keys(key)
        state = s.wait_state(lambda st: st["text"] == "hello\nhello\nworld\n" and
                             st["primary"]["position"] == position and st["cursorCount"] == 1)
        expect_state(state, text="hello\nhello\nworld\n", primary=position, count=1)
        s.capture(direction + "-after")
        s.keys(cmd("z"))
        try:
            s.wait_state(lambda st: st["text"] == "hello\nworld\n")
        finally:
            s.capture(direction + "-undo")

    def multiple(direction, key):
        open_file(s, direction + "-multi.txt", "foo\nfoo\n")
        cursor(s, 0)
        s.keys(cmd("d"), cmd("d"))
        s.wait_state(lambda st: st["cursorCount"] == 2 and st["selected"] == ["foo", "foo"])
        s.capture(direction + "-selected-before")
        expected_ranges = [(4, 7), (12, 15)] if direction == "below" else [(0, 3), (8, 11)]
        s.keys(key)
        st = s.wait_state(lambda st: st["text"] == "foo\nfoo\nfoo\nfoo\n" and
                          st["cursorCount"] == len(st["all"]) == 2 and st["selected"] == ["foo", "foo"] and
                          [(c["selection"]["start"], c["selection"]["end"])
                           for c in st["all"] if c["selection"]] == expected_ranges)
        expect_state(st, text="foo\nfoo\nfoo\nfoo\n", count=2, selected=["foo", "foo"])
        ranges = [(c["selection"]["start"], c["selection"]["end"]) for c in st["all"]]
        require(ranges == expected_ranges, f"selections are not on the copied lines: {ranges}")
        s.capture(direction + "-selected-copies-stock")
        s.keys(cmd("z"))
        try:
            s.wait_state(lambda st: st["text"] == "foo\nfoo\n")
        finally:
            s.capture(direction + "-selected-undo-stock")

    def comment(name, text, caret):
        open_file(s, name + ".py", text)
        cursor(s, caret)
        s.capture(name + "-comment-before")
        s.keys(cmd("/"))
        state = s.wait_state(lambda st: st["text"] != text and st["text"].replace("# ", "", 1) == text and
                             not st["text"].partition("# ")[0].strip() and st["primary"]["position"] == caret + 2)
        s.capture(name + "-commented")
        s.keys(cmd("/"))
        state = s.wait_state(lambda st: st["text"] == text and st["primary"]["position"] == caret)
        expect_state(state, text=text, primary=caret)
        s.capture(name + "-roundtrip")

    def multicomment():
        open_file(s, "stock-multicomment.py", "foo\n  foo\n")
        cursor(s, 0)
        s.keys(cmd("d"), cmd("d"))
        s.wait_state(lambda st: st["cursorCount"] == 2 and st["selected"] == ["foo", "foo"])
        s.capture("multicomment-native-coverage-before")
        s.keys(cmd("/"))
        s.wait_state(lambda st: "#" in st["text"])
        s.capture("multicomment-native-coverage")
        s.keys(cmd("/"))
        s.wait_state(lambda st: st["text"] == "foo\n  foo\n")
        s.capture("multicomment-roundtrip-stock")

    for direction, key, position in (("below", b"\x1b[1;4A", 8), ("above", b"\x1b[1;4B", 2)):
        measure(direction + "-single", single, direction, key, position)
        measure(direction + "-multi", multiple, direction, key)
    for name, text, caret in (("ascii", "    value = 1\n", 4), ("unicode", "    café = 1\n", 10)):
        measure(name + "-comment", comment, name, text, caret)
    measure("stock-multicomment", multicomment)
    s.capture("independent-variants", {"subcases": variants})
    failures = [f"{variant['id']}: {variant['error']}" for variant in variants if variant["status"] == "fail"]
    require(not failures, "; ".join(failures))


def saved(s, predicate):
    # Replace the previous save status with a native setup outcome, so an old
    # success banner cannot acknowledge this save. Only Cmd+S is under test.
    setup(s, "focus_editor")
    s.wait_screen(lambda sc: "Editor focused" in sc["text"].splitlines()[-1])
    before_seq = s.seq
    s.keys(cmd("s"))
    deadline = time.monotonic() + 15
    path = s.fixture / "format.json"
    while time.monotonic() < deadline:
        state = s.snapshot()
        text = path.read_text()
        status_line = s.screen_result()["text"].splitlines()[-1]
        if predicate(text) and state["text"] == text and "Saved (with on-save actions)" in status_line:
            with (s.trace / "on-save-completions.jsonl").open("a") as stream:
                stream.write(json.dumps({"run_id": s.run_id, "after_seq": before_seq,
                    "observed_seq": s.seq, "path": str(path), "native_status": status_line,
                    "saved_sha256": hashlib.sha256(text.encode()).hexdigest()}) + "\n")
            return text
        s.pump()
    raise AssertionError(f"fresh successful on-save completion missing: {path.read_text()!r}; {s.screen_result()['text']}")


def json_save(s):
    hide_explorer(s)
    initial = '{\n"a":1,\n"b":2\n}\n'
    open_file(s, "format.json", initial)
    s.capture("unformatted")
    formatted = saved(s, lambda text: text != initial and re.search(r'(?m)^ +"a": 1,\n +"b": 2$', text) is not None)
    require(json.loads(formatted) == {"a": 1, "b": 2}, "formatter changed JSON value")
    s.capture("formatted-save")
    cursor(s, len(formatted[:formatted.index('"b"')].encode()))
    s.keys(cmd("/"))
    comment_line = r'(?m)^[ \t]*//[ \t]*"b": 2[ \t]*$'
    s.wait_state(lambda st: re.search(comment_line, st["text"]) is not None)
    commented = saved(s, lambda text: re.search(comment_line, text) is not None)
    s.capture("comment-preserved-save")
    cursor(s, len(commented[:commented.index('"b"')].encode()))
    s.keys(cmd("/"))
    s.wait_state(lambda st: "//" not in st["text"])
    restored = saved(s, lambda text: "//" not in text and text == formatted)
    require(json.loads(restored) == {"a": 1, "b": 2}, "uncommented JSON mismatch")
    s.capture("uncommented-save")
    (s.trace / "saved-bytes.json").write_text(json.dumps({"initial": initial, "formatted": formatted,
        "commented": commented, "restored": restored}, indent=2))


def python_nav(s):
    hide_explorer(s)
    open_file(s, "navigation.py")
    call = len("def target(value):\n    return value + 1\n\nresult = ")
    cursor(s, call)
    s.capture("call-before-f12")
    # Native initialization is asynchronous; a Python status label alone is not readiness.
    deadline = time.monotonic() + 45
    log = ""
    while time.monotonic() < deadline:
        s.pump()
        path = s.root / "fresh.log"
        log = path.read_text(errors="replace") if path.exists() else ""
        if "Async LSP server initialized successfully" in log and "basedpyright" in log:
            break
    require("Async LSP server initialized successfully" in log and "basedpyright" in log,
            "configured basedpyright did not initialize within 45 seconds")
    (s.trace / "lsp-readiness.txt").write_text("\n".join(line for line in log.splitlines() if "LSP" in line or "basedpyright" in line))
    s.keys(b"\x1b[24~")
    state = s.wait_state(lambda st: Path(st["path"]).name == "navigation.py" and st["primary"]["line"] == 0 and st["primary"]["position"] == 4, timeout=45)
    expect_state(state, text=BASE["navigation.py"])
    s.capture("definition-line-one")
    s.keys(b"\x1b[24;2~")
    s.wait_screen(lambda sc: re.search(r"navigation\.py:4(?:\D|$)", sc["text"]) is not None, timeout=45)
    s.capture("reference-line-four")


def search_colors(screen, current):
    lines = screen["text"].splitlines()
    matches = [(y, line.index("BEGIN")) for y, line in enumerate(lines)
               if re.search(r"BEGIN[ \u00b7]foo[ \u00b7]MID[ \u00b7]foo[ \u00b7]END", line)]
    if len(matches) != 1:
        return False
    y, x = matches[0]
    for index, offset in enumerate((6, 14)):
        for n in range(3):
            attrs = cell(screen, x + offset + n, y)
            bg = "fafd54" if index == current else "656565"
            if attrs["bg"].lower().lstrip("#") != bg:
                return False
            if index == current and attrs["fg"].lower().lstrip("#") != "252525":
                return False
    return True


def search_selection(s):
    hide_explorer(s)
    text = "BEGIN foo MID foo END\n"
    variants = []

    def measure(name, function):
        s.keys(ESC)
        setup(s, "clear_search")
        open_file(s, name + ".txt", text)
        cursor(s, 0)
        s.wait_state(lambda st: not st["search"] and st["text"] == text)
        try:
            function()
            expect_state(s.snapshot(), text=text)
            s.capture(name + "-passed")
            variants.append({"id": name, "status": "pass", "error": None})
        except (AssertionError, TimeoutError) as error:
            variants.append({"id": name, "status": "fail", "error": f"{type(error).__name__}: {error}"})
            s.capture(name + "-failed")

    def navigation():
        s.keys(cmd("f"))
        s.wait_screen(lambda sc: re.search(r"(?m)^\s*Search:", sc["text"]) is not None)
        s.capture("empty-search-prompt-ready")
        s.keys(b"foo", ENTER)
        s.wait_state(lambda st: st["search"] and st["primary"]["position"] in (6, 9))
        s.wait_screen(lambda sc: search_colors(sc, 0))
        s.capture("search-first-yellow")
        s.keys(cmd("g"))
        s.wait_state(lambda st: st["primary"]["position"] in (14, 17))
        s.wait_screen(lambda sc: search_colors(sc, 1))
        s.capture("search-next-yellow")
        s.keys(cmd("g", 10))
        s.wait_state(lambda st: st["primary"]["position"] in (6, 9))
        s.wait_screen(lambda sc: search_colors(sc, 0))
        s.capture("search-previous-yellow")

    def query_clear():
        # Seed this independent history fixture through the native setup action.
        # Both Cmd+F invocations under test below still use actual key bytes.
        setup(s, "search")
        s.wait_screen(lambda sc: re.search(r"(?m)^\s*Search:", sc["text"]) is not None)
        s.keys(b"foo", ENTER)
        s.wait_state(lambda st: st["search"] and st["primary"]["position"] in (6, 9))
        s.keys(cmd("f"))
        s.wait_screen(lambda sc: re.search(r"(?m)^\s*Search:\s*foo(?:\s|$)", sc["text"]) is not None)
        s.capture("query-history-before-clear")
        s.keys(cmd("a"), b"\x7f", ENTER)
        s.wait_screen(lambda sc: re.search(r"(?m)^\s*Search:", sc["text"]) is None)
        s.keys(cmd("f"))
        s.wait_screen(lambda sc: re.search(r"(?m)^\s*Search:\s*$", sc["text"]) is not None)
        s.capture("cleared-query-stays-empty")
        s.keys(ENTER, ESC)
        s.wait_state(lambda st: not st["search"])

    def selections():
        cursor(s, 6)
        s.keys(cmd("d"))
        s.wait_state(lambda st: st["selected"] == ["foo"])
        s.wait_screen(lambda sc: selection_colors(sc, [6], "304e75"))
        s.capture("single-selection-blue")
        s.keys(cmd("d", 10))
        s.wait_state(lambda st: st["selected"] == ["foo", "foo"] and st["cursorCount"] == 2)
        s.wait_screen(lambda sc: selection_colors(sc, [6, 14], "656565"))
        s.capture("multi-selection-grey")
        s.keys(cmd("d", 10))
        after = s.snapshot()
        expect_state(after, text=text, count=2, selected=["foo", "foo"])
        require([(c["selection"]["start"], c["selection"]["end"]) for c in after["all"]] == [(6, 9), (14, 17)],
                "select-all did not retain the two exact occurrence ranges")
        s.capture("repeated-select-all-idempotent")

    measure("search-navigation", navigation)
    measure("query-clear", query_clear)
    measure("occurrence-selection", selections)
    s.capture("independent-search-variants", {"subcases": variants})
    failures = [f"{variant['id']}: {variant['error']}" for variant in variants if variant["status"] == "fail"]
    require(not failures, "; ".join(failures))


def selection_colors(screen, offsets, color):
    lines = screen["text"].splitlines()
    for y, line in enumerate(lines):
        if re.search(r"BEGIN[ \u00b7]foo[ \u00b7]MID[ \u00b7]foo[ \u00b7]END", line):
            x = line.index("BEGIN")
            return all(cell(screen, x + start + n, y)["bg"].lower().lstrip("#") == color for start in offsets for n in range(3))
    return False


def explorer_focus(s):
    hide_explorer(s)
    open_file(s, "ordinary.txt")
    s.keys(cmd("\\"))
    s.wait_state(lambda st: len(editors(st)) == 2)
    open_file(s, "probe.txt")
    for label, chord, sentinel in (("next", cmd("l", 10), b"X"), ("previous", cmd("h", 10), b"Y")):
        before = s.snapshot()
        current = active(before)["splitId"]
        target = next(pane for pane in editors(before) if pane["splitId"] != current)
        s.keys(cmd("e", 10))
        s.capture(label + "-explorer-before")
        s.keys(chord, sentinel)
        state = s.wait_state(lambda st: active(st)["splitId"] == target["splitId"] and st["text"] != "plain\n")
        require(state["path"] == target["path"] and state["text"] == sentinel.decode() + "plain\n",
                "explorer macro did not route keyboard input into intended editor")
        s.capture(label + "-editor-insertion")
        s.keys(cmd("z"))
        s.wait_state(lambda st: st["text"] == "plain\n")
        other = next(p for p in before["panes"] if p["splitId"] == current)
        focus(s, current)
        expect_state(s.snapshot(), text="plain\n")
        focus(s, target["splitId"])
        s.capture(label + "-both-editors-restored")


def terminal_focus(s):
    hide_explorer(s)
    open_file(s, "ordinary.txt")
    before = s.snapshot()
    s.keys(cmd("j"))
    after = s.snapshot()
    require(after["panes"] == before["panes"] and not any(b["is_terminal"] for b in after["buffers"]),
            "Cmd+J created a terminal instead of remaining a no-op")
    expect_state(after, text="plain\n")
    s.capture("no-terminal-noop")
    # Provide a resizable container for the native action, without imposing
    # the editor helper's active-side policy on terminal-context bindings.
    s.keys(cmd("\\"))
    s.wait_state(lambda st: len(editors(st)) == 2)
    open_file(s, "probe.txt")
    editor_panes = editors(s.snapshot())
    editor_id = active(s.snapshot())["splitId"]
    s.keys(cmd("c", 10))
    s.wait_state(lambda st: any(p["kind"] == "terminal" for p in st["panes"]))
    focus(s, editor_id)
    s.keys(cmd("j"))
    state = s.wait_state(lambda st: active(st)["kind"] == "terminal" and st["is_terminal"])
    terminal_id = active(state)["splitId"]
    proof = s.fixture / "terminal-proof.txt"
    s.keys(("printf terminal-ok > " + shlex.quote(str(proof)) + "\n").encode())
    deadline = time.monotonic() + 10
    while not proof.exists() and time.monotonic() < deadline:
        s.pump()
    require(proof.exists() and proof.read_text() == "terminal-ok", "terminal did not execute the private printf command")
    (s.trace / "terminal-proof.txt").write_text(proof.read_text())
    s.wait_screen(lambda sc: re.search(r"\d+:\d+\|\d+", sc["text"].splitlines()[-1]) is None)
    before_resize = s.capture("terminal-focus-proof")["state"]
    resize_error = None
    try:
        s.keys(cmd("l", 14))
        state = s.wait_state(lambda st: active(st)["splitId"] == terminal_id and
                            [(p["width"], p["height"]) for p in st["panes"]] != [(p["width"], p["height"]) for p in before_resize["panes"]])
        require({(p["splitId"], p["bufferId"]) for p in state["panes"]} == {(p["splitId"], p["bufferId"]) for p in before_resize["panes"]},
                "terminal resize moved an editor tab")
        s.capture("terminal-ratio-change")
    except (AssertionError, TimeoutError) as error:
        resize_error = error
        s.capture("terminal-resize-failed", {"error": f"{type(error).__name__}: {error}"})
    if active(s.snapshot())["splitId"] == terminal_id:
        s.keys(b"exit\n")
    for pane in editor_panes:
        focus(s, pane["splitId"])
        expect_state(s.snapshot(), text="plain\n")
        s.capture(f"editor-{pane['splitId']}-unchanged-terminal-exited")
    if resize_error is not None:
        raise resize_error


def pane_layout(s):
    hide_explorer(s)
    for axis in ("width", "height"):
        reset_layout(s)
        open_file(s, "ordinary.txt")
        if axis == "width":
            s.keys(cmd("\\"))
        else:
            palette(s, "Split Horizontal")
        s.wait_state(lambda st: len(editors(st)) == 2)
        open_file(s, "probe.txt")
        panes = editors(s.snapshot())
        for pane in panes:
            focus(s, pane["splitId"])
            before = s.capture(f"{axis}-{pane['splitId']}-before")["state"]
            base = active(before)[axis]
            s.keys(cmd("=", 13))
            grown = s.wait_state(lambda st: active(st)["splitId"] == pane["splitId"] and active(st)[axis] > base)
            s.capture(f"{axis}-{pane['splitId']}-grown")
            s.keys(cmd("-", 13))
            s.wait_state(lambda st: active(st)["splitId"] == pane["splitId"] and active(st)[axis] < active(grown)[axis])
            s.capture(f"{axis}-{pane['splitId']}-shrunk")
            s.keys(cmd("=", 6))
            s.wait_state(lambda st: abs(editors(st)[0][axis] - editors(st)[1][axis]) <= 1)
            expect_state(s.snapshot(), text="plain\n")
            s.capture(f"{axis}-{pane['splitId']}-equalized")
        for pane in panes:
            focus(s, pane["splitId"])
            expect_state(s.snapshot(), text="plain\n")


def tab_visible(screen, pane, name):
    # Native pane geometry is relative to the editor area below the menu bar.
    rows = screen["text"].splitlines()
    return any(name in line[pane["x"]:pane["x"] + pane["width"]]
               for line in rows[pane["y"]:pane["y"] + 3])


def tab_move(s):
    hide_explorer(s)
    open_file(s, "ordinary.txt")
    open_file(s, "probe.txt")
    s.wait_screen(lambda sc: "ordinary.txt" in sc["text"] and "probe.txt" in sc["text"])
    s.keys(cmd("[", 14))
    s.wait_screen(lambda sc: sc["text"].index("probe.txt") < sc["text"].index("ordinary.txt"))
    s.capture("reorder-left")
    s.keys(cmd("]", 14))
    s.wait_screen(lambda sc: sc["text"].index("ordinary.txt") < sc["text"].index("probe.txt"))
    s.capture("reorder-right")
    for direction, letter, coordinate, sign in (("left", "j", "x", -1), ("down", "k", "y", 1),
                                                ("right", "l", "x", 1), ("up", "i", "y", -1)):
        reset_layout(s)
        open_file(s, "ordinary.txt")
        moving = open_file(s, "probe.txt")
        source_id = active(s.snapshot())["splitId"]
        s.capture(direction + "-source-before")
        s.keys(cmd(letter, 14), cmd(letter, 14))
        state = s.wait_state(lambda st: len(editors(st)) == 2 and active(st)["splitId"] != source_id and st["bufferId"] == moving["bufferId"])
        source = next(p for p in state["panes"] if p["splitId"] == source_id)
        destination = active(state)
        require(sign * (destination[coordinate] - source[coordinate]) > 0, f"wrong {direction} destination")
        s.wait_screen(lambda sc: tab_visible(sc, destination, "probe.txt") and not tab_visible(sc, source, "probe.txt") and tab_visible(sc, source, "ordinary.txt"))
        expect_state(state, text="plain\n")
        s.capture(direction + "-destination-source-tabs")
    # A third pane already displaying the same buffer must survive source-only movement.
    reset_layout(s)
    open_file(s, "ordinary.txt")
    moving = open_file(s, "probe.txt")
    source_id = active(s.snapshot())["splitId"]
    palette(s, "Split Horizontal")
    s.wait_state(lambda st: len(editors(st)) == 2)
    open_file(s, "ordinary.txt")
    destination_id = active(s.snapshot())["splitId"]
    palette(s, "Split Horizontal")
    s.wait_state(lambda st: len(editors(st)) == 3)
    open_file(s, "probe.txt")
    third_id = active(s.snapshot())["splitId"]
    focus(s, source_id)
    s.capture("third-copy-before")
    s.keys(cmd("k", 14), cmd("k", 14))
    state = s.wait_state(lambda st: active(st)["splitId"] == destination_id and st["bufferId"] == moving["bufferId"])
    panes = {p["splitId"]: p for p in state["panes"]}
    require(panes[third_id]["bufferId"] == moving["bufferId"], "tab movement stripped the third pane's buffer")
    s.wait_screen(lambda sc: not tab_visible(sc, panes[source_id], "probe.txt") and
                  tab_visible(sc, panes[destination_id], "probe.txt") and tab_visible(sc, panes[third_id], "probe.txt"))
    s.capture("third-copy-preserved-source-only")
    # A terminal below the source is not an eligible editor-tab destination.
    reset_layout(s)
    open_file(s, "ordinary.txt")
    open_file(s, "probe.txt")
    source_id = active(s.snapshot())["splitId"]
    s.keys(cmd("c", 10))
    state = s.wait_state(lambda st: any(p["kind"] == "terminal" for p in st["panes"]))
    terminal = next(p for p in state["panes"] if p["kind"] == "terminal")
    focus(s, source_id)
    s.keys(cmd("k", 14), cmd("k", 14))
    state = s.wait_state(lambda st: active(st)["splitId"] != source_id and active(st)["kind"] == "file" and Path(st["path"]).name == "probe.txt")
    retained = next(p for p in state["panes"] if p["splitId"] == terminal["splitId"])
    require(retained["bufferId"] == terminal["bufferId"] and retained["kind"] == "terminal", "editor tab replaced terminal")
    s.capture("terminal-skipped")
    s.keys(cmd("j"), b"exit\n")
    for name in ("ordinary.txt", "probe.txt"):
        require((s.fixture / name).read_text() == "plain\n", "tab movement changed a file")


def tab_reopen(s):
    hide_explorer(s)
    open_file(s, "ordinary.txt")
    closed = open_file(s, "probe.txt")
    s.keys(cmd("w"))
    s.wait_state(lambda st: st["bufferId"] != closed["bufferId"])
    open_file(s, "ordinary.txt")
    current_diff(s, "ordinary.txt", b"d", "virtual-diff-open")
    s.keys(cmd("t", 10))
    state = s.wait_state(lambda st: Path(st["path"]).name == "probe.txt" and not st["is_virtual"])
    expect_state(state, text="plain\nchanged\n")
    s.capture("last-real-file-reopened")


def markdown_preview(s):
    hide_explorer(s)
    def source_visible(sc):
        return (re.search(r"#(?: |\u00b7)Heading", sc["text"]) is not None and
                re.search(r"-(?: |\u00b7)item", sc["text"]) is not None)
    setup(s, "new")
    s.wait_state(lambda st: not st["path"] and not st["is_virtual"])
    text = "# Heading\n\n- item\n"
    s.keys(b"\x1b[200~" + text.encode() + b"\x1b[201~")
    s.wait_state(lambda st: st["text"] == text)
    language(s, "Markdown")
    s.capture("untitled-markdown-source")
    palette(s, "Toggle Unsaved Markdown Preview")
    state = s.wait_state(lambda st: st["view_mode"] == "compose")
    require(not state["path"] and state["language"] == "markdown", "preview targeted a file-backed buffer")
    expect_state(state, text=text)
    s.capture("untitled-compose")
    palette(s, "Toggle Unsaved Markdown Preview")
    state = s.wait_state(lambda st: st["view_mode"] == "source")
    expect_state(state, text=text)
    s.wait_screen(source_visible)
    s.capture("untitled-source-markup-restored")
    open_file(s, "notes.md")
    s.wait_state(lambda st: st["mode"] == "markdown-source")
    before = s.snapshot()
    palette(s, "Toggle Unsaved Markdown Preview")
    after = s.snapshot()
    require(after["view_mode"] == before["view_mode"] and after["path"] == before["path"],
            "unsaved-only helper acted on a named file")
    expect_state(after, text=BASE["notes.md"])
    s.capture("named-file-unsaved-helper-ineligible")
    palette(s, "Markdown: Toggle Compose/Preview")
    s.wait_state(lambda st: st["path"] == before["path"] and st["view_mode"] == "compose")
    expect_state(s.snapshot(), text=BASE["notes.md"])
    s.capture("named-native-compose")
    palette(s, "Markdown: Toggle Compose/Preview")
    s.wait_state(lambda st: st["path"] == before["path"] and st["view_mode"] == "source")
    s.wait_screen(source_visible)
    s.capture("named-native-source")


def focus_signature(capture):
    state = capture["state"]
    # Review panels are virtual buffers inside one native editor split.
    # Their active buffer identity measures focus without pinning redraws.
    return active(state)["splitId"], state["bufferId"]


def review_focus(s):
    hide_explorer(s)
    original = {name: (s.fixture / name).read_bytes() for name in (*BASE, "untracked.txt")}
    for name in ("notes.md", "code.rs"):
        s.request("mode", {"name": None})
        open_file(s, name)
        if name == "notes.md":
            s.wait_state(lambda st: st["mode"] == "markdown-source")
        s.capture(name + "-source-before")
        s.keys(cmd("r"), cmd("d", 10))
        view = s.wait_screen(lambda sc: "Review Diff" in sc["text"] and "UNSTAGED" in sc["text"])
        if re.search(r"\[\s*▸\s+Files\s*\]", view["text"]):
            s.keys(b"F")
        s.wait_screen(lambda sc: "Review Diff" in sc["text"] and "UNSTAGED" in sc["text"] and
                      "untracked.txt" in sc["text"] and all(file in sc["text"] for file in BASE))
        before = s.capture(name + "-review-focus-before")
        s.keys(b"\t")
        s.wait_screen(lambda sc: sc["rows"] != before["screen"]["rows"])
        forward = s.capture(name + "-review-focus-next")
        require(focus_signature(forward) != focus_signature(before), "Tab did not change review focus")
        s.keys(b"\x1b[Z")
        s.wait_screen(lambda sc: sc["rows"] != forward["screen"]["rows"])
        back = s.capture(name + "-review-focus-back")
        require(focus_signature(back) == focus_signature(before), "Shift+Tab did not restore previous review focus")
        require("Review Diff" in back["screen"]["text"], "focus navigation left review")
        s.keys(b"q")
        s.wait_state(lambda st: Path(st["path"]).name == name)
    require({name: (s.fixture / name).read_bytes() for name in original} == original, "review navigation mutated fixture files")


CASES = (profile_ui, file_chords, dup_comment, json_save, python_nav, search_selection,
         explorer_focus, terminal_focus, pane_layout, tab_move, tab_reopen, markdown_preview, review_focus)


def run_all(make_session, selected_cases=CASE_IDS, check_boundary=None) -> list[dict]:
    records = [{"id": case_id, "status": "unrun", "evidence": [], "error": None} for case_id in CASE_IDS]
    stopped = False

    def fail(record, context, error):
        message = f"{context}{type(error).__name__}: {error}"
        record.update(status="fail", error=(record["error"] + "; " if record["error"] else "") + message)

    for record, function in zip(records, CASES, strict=True):
        case_id = record["id"]
        if case_id not in selected_cases or stopped:
            continue
        session = None
        try:
            if check_boundary is not None:
                check_boundary()
            session = make_session(case_id)
        except (Exception, KeyboardInterrupt) as error:
            fail(record, "unsafe initialization/boundary: ", error)
            stopped = True
            continue
        try:
            function(session)
            session.capture("complete")
            record["status"] = "pass"
        except (Exception, KeyboardInterrupt) as error:
            fail(record, "", error)
            stopped = isinstance(error, KeyboardInterrupt)
            try:
                session.capture("failure")
            except Exception as capture_error:
                fail(record, "failure capture: ", capture_error)
        finally:
            record["evidence"] = session.evidence
            try:
                session.close()
            except (Exception, KeyboardInterrupt) as error:
                fail(record, "owned-process shutdown: ", error)
                stopped = True
            if check_boundary is not None:
                try:
                    check_boundary()
                except (Exception, KeyboardInterrupt) as error:
                    fail(record, "unsafe boundary: ", error)
                    stopped = True
        print(f"FRESH_COMPAT_CASE {case_id} {record['status']}", flush=True)
    return records
