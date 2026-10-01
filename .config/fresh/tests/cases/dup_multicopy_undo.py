"""dup-multicopy-undo (upstream limitation): duplicating several carets or selections at once
undoes in one step. Asserts the desired behavior, so it FAILs (LIMIT) while blocked upstream."""
CASE_ID = "dup_multicopy_undo"
REQUIRES = ()

CARETS = "alpha\nbravo\n"
SELECTIONS = "foo\nfoo\n"
BELOW, ABOVE = "alt+shift+up", "alt+shift+down"


def run(s):
    s.write("carets.txt", CARETS)
    s.write("selections.txt", SELECTIONS)
    s.launch("carets.txt")
    s.wait_state(lambda st: st["text"] == CARETS, what="carets.txt active")
    for key in (BELOW, ABOVE):
        s.set_cursor(2)
        s.action("add_cursor_below")
        s.wait_state(lambda st: len(st["cursors"]) == 2, what="two carets")
        s.keys(key)
        s.wait_state(lambda st: st["text"] == "alpha\nalpha\nbravo\nbravo\n",
                     what=f"{key}: both caret lines duplicated")
        s.keys("super+z")
        s.wait_state(lambda st: st["text"] == CARETS,
                     what=f"{key}: one Undo removes every copy made from two carets")
        s.keys("escape")
        s.wait_state(lambda st: len(st["cursors"]) == 1, what="back to one cursor")

    s.open("selections.txt")
    s.action("focus_editor")
    s.wait_state(lambda st: st["text"] == SELECTIONS, what="selections.txt active")
    for key in (BELOW, ABOVE):
        s.set_cursor(0)
        s.keys("super+d", "super+d")
        s.wait_state(lambda st: st["selected"] == ["foo", "foo"], what="two foo selections")
        s.keys(key)
        s.wait_state(lambda st: st["text"] == "foo\nfoo\nfoo\nfoo\n", what=f"{key}: both selected lines duplicated")
        s.keys("super+z")
        s.wait_state(lambda st: st["text"] == SELECTIONS,
                     what=f"{key}: one Undo removes every copy made from two selections")
        s.keys("escape")
        s.wait_state(lambda st: len(st["cursors"]) == 1, what="back to one cursor")
