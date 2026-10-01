"""file-chords: Cmd+R chords and held Cmd+Ctrl+Shift doubled letters in ordinary and Markdown source.

In a plain file and in a Markdown file (markdown-source mode), with Cmd released
or held for the second key:
- Cmd+R M opens the language picker for that buffer (Escape leaves it unchanged;
  choosing a language applies it to the same buffer);
- Cmd+R D opens the current-file diff; Cmd+R Cmd+Shift+D opens the all-files review;
- Cmd+R Cmd+Shift+C opens a terminal.
In Markdown source, the doubled Cmd+Ctrl+Shift J/K/L/I move the tab left, down,
right and up into a new neighbor pane (the ordinary-mode moves are the tab-move
row), and Enter continues a list item while Tab nests it (native Markdown).
The chords never modify the workspace files.
"""
CASE_ID = "file_chords"
REQUIRES = ()
TIMEOUT = 150

HEAD = {"plain.txt": "plain\n", "notes.md": "# Heading\n\n- item\n"}
WORK = {"plain.txt": "plain\nchanged\n", "notes.md": "# Heading\n\n- item\n- changed\n"}
PICK = {"plain.txt": ("Python", "python"), "notes.md": ("JSON", "json")}
MODE = {"plain.txt": None, "notes.md": "markdown-source"}


def _active(state):
    panes = [p for p in state["panes"] if p["active"]]
    assert len(panes) == 1, f"expected one active pane: {state['panes']}"
    return panes[0]


def _language_prompt(screen):
    return screen.lines[-1].lstrip().startswith("Language:")


def _in_file(s, name, what):
    return s.wait_state(lambda st: st["buffer"]["name"] == name and st["mode"] == MODE[name], what=what)


def _chords(s, name):
    before = _in_file(s, name, f"{name} active in its mode")
    for second in ("m", "super+m"):
        s.keys("super+r", second)
        s.wait_screen(_language_prompt, what=f"Cmd+R {second} language picker from {name}")
        s.keys("escape")
        s.wait_screen(lambda sc: not _language_prompt(sc), what="Escape to close the language picker")
        after = _in_file(s, name, f"back in {name} after Escape")
        s.check(after["buffer"]["id"] == before["buffer"]["id"] and after["text"] == before["text"]
                and after["buffer"]["language"] == before["buffer"]["language"],
                f"Cmd+R {second} then Escape changed {name}")
    for second in ("d", "super+d"):
        s.keys("super+r", second)
        s.wait_state(lambda st: st["buffer"]["is_virtual"] and st["buffer"]["name"] == f"*Diff: {name}*",
                     what=f"Cmd+R {second} diff of {name}")
        s.wait_screen(lambda sc: "OLD (HEAD)" in sc and "NEW (Working)" in sc, what=f"{name} diff rendered")
        s.keys("q")
        _in_file(s, name, f"q to return from the diff to {name}")
    s.keys("super+r", "super+shift+d")
    s.wait_screen(lambda sc: "Review Diff" in sc and "UNSTAGED" in sc, what=f"Cmd+R Cmd+Shift+D review from {name}")
    s.keys("q")
    _in_file(s, name, f"q to return from the review to {name}")
    terminals = sum(b["is_terminal"] for b in s.state()["buffers"])
    _in_file(s, name, f"{name} still in its mode before the terminal chord")
    s.keys("super+r", "super+shift+c")
    s.wait_state(lambda st: sum(b["is_terminal"] for b in st["buffers"]) == terminals + 1
                 and st["buffer"]["is_terminal"], what=f"Cmd+R Cmd+Shift+C to open a terminal from {name}")
    s.open(name)
    _in_file(s, name, f"{name} active again after the terminal (setup)")

    label, language = PICK[name]
    s.keys("super+r", "m")
    s.wait_screen(_language_prompt, what="language picker (to choose a language)")
    s.type(label)
    s.wait_screen(lambda sc: label in "\n".join(sc.lines[-12:]), what=f"{label} listed in the picker")
    s.keys("enter")
    chosen = s.wait_state(lambda st: st["buffer"]["language"] == language,
                          what=f"choosing {label} to set {name}'s language")
    s.check(chosen["buffer"]["id"] == before["buffer"]["id"], "the language picker changed a different buffer")


def _markdown_moves(s):
    for direction, letter, axis, sign in (("left", "j", "x", -1), ("down", "k", "y", 1),
                                          ("right", "l", "x", 1), ("up", "i", "y", -1)):
        s.launch("plain.txt")
        s.open("notes.md")
        before = _in_file(s, "notes.md", "notes.md in markdown-source mode")
        source_id = _active(before)["splitId"]
        s.keys(f"ctrl+shift+super+{letter}", f"ctrl+shift+super+{letter}")
        state = s.wait_state(lambda st: len(st["panes"]) == 2 and _active(st)["splitId"] != source_id
                             and st["buffer"]["name"] == "notes.md",
                             what=f"Markdown source: doubled Cmd+Ctrl+Shift+{letter.upper()} to move the tab {direction}")
        source = next(p for p in state["panes"] if p["splitId"] == source_id)
        dest = _active(state)
        s.check(sign * (dest[axis] - source[axis]) > 0, f"Markdown tab moved to the wrong side for {direction}")
        s.check(source["name"] == "plain.txt", "the Markdown tab move left the moved buffer in the source pane")
        s.stop()


def run(s):
    for name, text in HEAD.items():
        s.write(name, text)
    s.commit()
    for name, text in WORK.items():
        s.write(name, text)

    s.launch("plain.txt")
    _chords(s, "plain.txt")
    s.open("notes.md")
    _chords(s, "notes.md")
    s.stop()

    _markdown_moves(s)

    s.write("list.md", "# List\n\n- item\n")
    s.launch("list.md")
    s.wait_state(lambda st: st["mode"] == "markdown-source", what="list.md in markdown-source mode")
    s.set_cursor(len("# List\n\n- item"))
    s.keys("enter")
    s.wait_state(lambda st: st["text"] == "# List\n\n- item\n- \n", what="Markdown Enter to continue the list")
    s.keys("tab")
    state = s.wait_state(lambda st: st["text"] != "# List\n\n- item\n- \n", what="Markdown Tab to act on the new item")
    new_item = state["text"].split("\n")[3]
    s.check(new_item.startswith((" ", "\t")) and new_item.strip() in ("-", "+", "*"),
            f"Markdown Tab did not nest the list item: {new_item!r}")

    for name, text in WORK.items():
        s.check(s.read_bytes(name) == text.encode(), f"file chords changed {name} on disk")
