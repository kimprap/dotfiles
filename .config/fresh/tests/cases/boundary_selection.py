"""boundary-selection: a downward selection anchored on the first line clears to document start
on plain Up, and the EOF counterpart clears to document end on plain Down, while interior
movement, multiple cursors and modified keys stay native."""
CASE_ID = "boundary_selection"
REQUIRES = ()

# Offsets are UTF-8 byte offsets (the probe's cursor unit).
PLAIN = "café 🙂 first\nsecond line\nthird line\nlast 🙂 line\n"
MARKDOWN = "# first\n\nmiddle\n- last\n"


def _caret(st):
    return st["primary"]["position"], st["primary"]["selection"]


def _line_start(data: bytes, index: int) -> int:
    start = 0
    for _ in range(index):
        start = data.index(b"\n", start) + 1
    return start


def _boundaries(s, name, text):
    data = text.encode()
    end = len(data)
    last = data.rstrip(b"\n").rfind(b"\n") + 1

    s.set_cursor(3)
    s.keys("shift+down")
    s.wait_state(lambda st: st["primary"]["selection"] == {"start": 3, "end": st["primary"]["position"]}
                 and st["primary"]["line"] == 1, what=f"{name}: Shift+Down selects from the first line")
    s.sleep(0.1)  # modifiers released before the plain arrow
    s.keys("up")
    s.wait_state(lambda st: _caret(st) == (0, None) and len(st["cursors"]) == 1,
                 what=f"{name}: plain Up clears the first-line selection to document start")
    s.keys("up", "down")
    s.wait_state(lambda st: _caret(st) == (_line_start(data, 1), None),
                 what=f"{name}: movement after the clear is ordinary (no stale anchor)")

    s.set_cursor(last + 2)
    s.keys("shift+up")
    s.wait_state(lambda st: st["primary"]["selection"] == {"start": st["primary"]["position"], "end": last + 2},
                 what=f"{name}: Shift+Up selects from the last line")
    s.sleep(0.1)
    s.keys("down")
    s.wait_state(lambda st: _caret(st) == (end, None) and len(st["cursors"]) == 1,
                 what=f"{name}: plain Down clears the last-line selection to document end")

    # Modified keys stay native: Shift+Up shrinks the first-line selection back to its anchor.
    s.set_cursor(3)
    s.keys("shift+down")
    s.wait_state(lambda st: st["primary"]["line"] == 1 and st["primary"]["selection"] is not None,
                 what=f"{name}: Shift+Down selection before Shift+Up")
    s.keys("shift+up")
    st = s.wait_state(lambda st: st["primary"]["position"] == 3,
                      what=f"{name}: Shift+Up extends natively back to the anchor, not to document start")
    s.check(st["primary"]["selection"] in (None, {"start": 3, "end": 3}),
            f"{name}: Shift+Up left an empty selection at the anchor: {st['primary']}")


def run(s):
    s.write("plain.txt", PLAIN)
    s.write("notes.md", MARKDOWN)
    s.launch("plain.txt")
    s.wait_state(lambda st: st["text"] == PLAIN, what="plain.txt active")
    _boundaries(s, "plain.txt", PLAIN)

    # Interior selections move natively: Up leaves from the selection start, Down from its end.
    data = PLAIN.encode()
    second, third, fourth = (_line_start(data, i) for i in (1, 2, 3))
    s.set_cursor(second + 3)
    s.keys("shift+down")
    s.wait_state(lambda st: _caret(st) == (third + 3, {"start": second + 3, "end": third + 3}),
                 what="interior Shift+Down selection")
    s.keys("up")
    s.wait_state(lambda st: _caret(st) == (3, None), what="interior plain Up moves one line up from the selection start")
    s.set_cursor(second + 3)
    s.keys("shift+down")
    s.wait_state(lambda st: st["primary"]["selection"] is not None, what="interior selection again")
    s.keys("down")
    s.wait_state(lambda st: _caret(st) == (fourth + 3, None),
                 what="interior plain Down moves one line down from the selection end")

    # Multiple cursors stay native: plain Up moves every cursor, none is cleared to document start.
    s.set_cursor(3)
    s.keys("shift+down")
    s.wait_state(lambda st: st["primary"]["line"] == 1 and st["primary"]["selection"] is not None,
                 what="first-line selection before adding a cursor")
    s.action("add_cursor_below")
    s.wait_state(lambda st: len(st["cursors"]) == 2, what="a second cursor below")
    s.keys("up")
    st = s.wait_state(lambda st: any(c["selection"] is None and c["line"] == 1 for c in st["cursors"]),
                      what="with two cursors, plain Up moves the free cursor up one line")
    s.check(len(st["cursors"]) == 2, f"plain Up with two cursors keeps both cursors: {st['cursors']}")
    s.keys("escape")
    s.wait_state(lambda st: len(st["cursors"]) == 1, what="Escape back to one cursor")

    s.open("notes.md")
    s.action("focus_editor")
    # The Markdown source mode is applied asynchronously after activation; allow for a loaded host.
    s.wait_state(lambda st: st["text"] == MARKDOWN and st["mode"] == "markdown-source", timeout=20,
                 what="notes.md active in Markdown source mode")
    _boundaries(s, "notes.md", MARKDOWN)
    s.check(s.state()["text"] == MARKDOWN, "movement left notes.md unchanged")
