"""diff-view-wrap (upstream limitation): Alt+Z toggles wrapping of long lines in diff and review views.

Desired behavior: in the current-file diff (Cmd+R D) and in the all-files review
(Cmd+R Cmd+Shift+D), Alt+Z flips whether a long changed line renders wrapped
(its end marker visible) and a second Alt+Z flips it back, whatever the default
wrap state. On 0.5.1 Alt+Z has no effect there, so this reports LIMIT.
"""
CASE_ID = "diff_view_wrap"
REQUIRES = ()

LONG = "WRAPSTART " + "word " * 40 + "WRAPEND"


def _wrapped(screen):
    return "WRAPSTART" in screen and "WRAPEND" in screen


def _toggles(s, view):
    start = s.screen()
    before = _wrapped(start)
    s.keys("alt+z")
    s.wait_screen(lambda sc: _wrapped(sc) != before, what=f"Alt+Z to toggle long-line wrapping in the {view}")
    s.keys("alt+z")
    s.wait_screen(lambda sc: _wrapped(sc) == before, what=f"a second Alt+Z to restore wrapping in the {view}")


def run(s):
    s.write("long.txt", "plain\n")
    s.commit()
    s.write("long.txt", "plain\n" + LONG + "\n")

    s.launch("long.txt")
    s.keys("super+r", "d")
    s.wait_screen(lambda sc: "OLD (HEAD)" in sc and "WRAPSTART" in sc, what="Cmd+R D diff showing the long line")
    _toggles(s, "current-file diff")
    s.stop()

    s.launch("long.txt")
    s.keys("super+r", "super+shift+d")
    s.wait_screen(lambda sc: "Review Diff" in sc and "WRAPSTART" in sc, what="review showing the long line")
    _toggles(s, "all-files review")
