"""line-wrap-default: a line longer than the pane renders wrapped when a file opens."""
CASE_ID = "line_wrap_default"
REQUIRES = ()


def run(s):
    s.fixture()  # long.txt: one ~500-char line from WRAPSTART to WRAPEND, then NEXTLINE
    s.launch("long.txt")
    s.wait_text("WRAPSTART")
    screen = s.wait_screen(lambda sc: "NEXTLINE" in sc, what="the file to render")
    start, end, following = (screen.find(m) for m in ("WRAPSTART", "WRAPEND", "NEXTLINE"))
    s.check(end is not None and end[1] > start[1],
            "long line renders wrapped: its end is visible on a row below its start")
    s.check(following[1] > end[1], "the next line renders after the wrapped continuation rows")
