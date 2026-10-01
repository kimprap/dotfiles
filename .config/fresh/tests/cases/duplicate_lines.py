"""duplicate-lines: duplicate above/below keeps the copied text and the caret and selection
placement for a single caret or selection, with the current undo behavior (one Undo restores
the text; below also restores the caret or selection)."""
CASE_ID = "duplicate_lines"
REQUIRES = ()

TEXT = "hello world\nnext line\n"
ONE = "hello world\nhello world\nnext line\n"
BOTH = TEXT + TEXT
# Opt+Shift+Up copies below; Opt+Shift+Down copies above (Cursor convention).
BELOW, ABOVE = "alt+shift+up", "alt+shift+down"


def _sel(start, end):
    return {"start": start, "end": end}


# (name, setup keys from caret, start caret, before (pos, sel), key, text, after (pos, sel))
VARIANTS = [
    ("caret", (), 2, (2, None), BELOW, ONE, (14, None)),
    ("forward selection", ("shift+right",) * 3, 6, (9, _sel(6, 9)), BELOW, ONE, (21, _sel(18, 21))),
    ("backward selection", ("shift+left",) * 3, 9, (6, _sel(6, 9)), BELOW, ONE, (18, _sel(18, 21))),
    ("two-line selection", ("shift+down",), 6, (18, _sel(6, 18)), BELOW, BOTH, (40, _sel(28, 40))),
    ("caret", (), 2, (2, None), ABOVE, ONE, (2, None)),
    ("forward selection", ("shift+right",) * 3, 6, (9, _sel(6, 9)), ABOVE, ONE, (9, _sel(6, 9))),
    ("backward selection", ("shift+left",) * 3, 9, (6, _sel(6, 9)), ABOVE, ONE, (6, _sel(6, 9))),
    ("two-line selection", ("shift+down",), 6, (18, _sel(6, 18)), ABOVE, BOTH, (18, _sel(6, 18))),
]


def _caret(st):
    return st["primary"]["position"], st["primary"]["selection"]


def run(s):
    s.write("dup.txt", TEXT)
    s.launch("dup.txt")
    s.wait_state(lambda st: st["text"] == TEXT, what="dup.txt active")
    for name, setup, start, before, key, text, after in VARIANTS:
        label = f"{'below' if key == BELOW else 'above'} {name}"
        s.set_cursor(start)
        s.keys(*setup)
        s.wait_state(lambda st: _caret(st) == before and len(st["cursors"]) == 1, what=f"{label}: setup")
        s.keys(key)
        st = s.wait_state(lambda st: st["text"] == text and _caret(st) == after,
                          what=f"{label}: copied text {text!r} with caret/selection {after}")
        s.check(len(st["cursors"]) == 1, f"{label}: one cursor after duplication: {st['cursors']}")
        s.sleep(0.3)
        s.check(_caret(s.state()) == after, f"{label}: placement is stable after duplication")
        s.keys("super+z")
        st = s.wait_state(lambda st: st["text"] == TEXT, what=f"{label}: one Undo restores the text")
        if key == BELOW:
            s.check(_caret(st) == before, f"{label}: Undo restores the caret/selection {before}: {_caret(st)}")
    s.check(s.state()["text"] == TEXT, "every duplication was undone")
