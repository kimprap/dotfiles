"""comment-multi-cursor: with several cursors, Cmd+/ toggles every line any caret or selection
covers: all are commented unless all already are, then all are uncommented, restoring the text
exactly; carets and selections stay on the same source characters, and a selection ending at a
line start does not cover that line."""
CASE_ID = "comment_multi_cursor"
TIMEOUT = 90

PY = "    alpha = 1\n    bravo = 2\n    charlie = 3\n    delta = 4\n"   # line starts 0, 14, 28, 44


def _cursors(st):
    return [(c["position"], (c["selection"]["start"], c["selection"]["end"]) if c["selection"] else None)
            for c in st["cursors"]]


def _roundtrip(s, label, original, commented, before, after):
    s.wait_state(lambda st: _cursors(st) == before, what=f"{label}: setup cursors {before}")
    s.keys("super+/")
    s.wait_state(lambda st: st["text"] == commented and _cursors(st) == after,
                 what=f"{label}: every covered line commented, cursors {after}")
    s.keys("super+/")
    s.wait_state(lambda st: st["text"] == original and _cursors(st) == before,
                 what=f"{label}: toggling again restores the text and cursors {before}")
    s.keys("escape")
    s.wait_state(lambda st: len(st["cursors"]) == 1, what=f"{label}: back to one cursor")


def run(s):
    s.write("code.py", PY)
    s.launch("code.py")
    s.wait_state(lambda st: st["text"] == PY, what="code.py active")

    s.set_cursor(0)
    s.action("add_cursor_below")
    s.keys("shift+down")
    _roundtrip(s, "line selections ending at line starts", PY,
               "#     alpha = 1\n#     bravo = 2\n    charlie = 3\n    delta = 4\n",
               [(14, (0, 14)), (28, (14, 28))], [(18, (2, 18)), (32, (18, 32))])

    # The primary (last added) cursor's line is already commented; the others are not.
    s.set_cursor(34)
    s.keys("super+/")
    mixed = "    alpha = 1\n    bravo = 2\n#     charlie = 3\n    delta = 4\n"
    s.wait_state(lambda st: st["text"] == mixed and _cursors(st) == [(36, None)],
                 what="one caret comments only the charlie line")
    s.set_cursor(6)
    s.action("add_cursor_below")
    s.action("add_cursor_below")
    _roundtrip(s, "partly commented lines", mixed,
               "#     alpha = 1\n#     bravo = 2\n# #     charlie = 3\n    delta = 4\n",
               [(6, None), (20, None), (34, None)], [(8, None), (24, None), (40, None)])
