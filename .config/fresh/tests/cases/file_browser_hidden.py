"""file-browser-hidden: the open-file browser lists hidden files."""
CASE_ID = "file_browser_hidden"
REQUIRES = ()


def _listed(screen, name):
    """True when a browser row (inside the dialog frame) names `name` as an entry."""
    return any(line.startswith("│" + name) for line in screen.lines)


def run(s):
    s.write("visible.txt", "visible\n")
    s.write(".hidden-file", "hidden\n")
    s.write(".hidden-dir/inside.txt", "inside\n")
    s.launch("visible.txt")
    s.wait_text("visible")
    s.keys("super+o")
    screen = s.wait_screen(lambda sc: _listed(sc, "visible.txt"), what="the open-file browser listing")
    s.check(_listed(screen, ".hidden-file"), "the open-file browser lists the hidden file .hidden-file")
    s.check(_listed(screen, ".hidden-dir/"), "the open-file browser lists the hidden directory .hidden-dir/")
    s.type(".hidden-file")
    s.keys("enter")
    state = s.wait_state(lambda st: (st["buffer"] or {}).get("path", "").endswith("/.hidden-file"),
                         what="the hidden file to open from the browser")
    s.check(state["text"] == "hidden\n", "the hidden file opens with its content")
