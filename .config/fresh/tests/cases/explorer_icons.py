"""explorer-icons: the chosen file and folder glyphs show, including hidden and gitignored entries;
external creates and Save As acquire mapped glyphs without a restart; no fd exhaustion in a large
tree (E1: 2,000 entries under `ulimit -n 256`, then no `os error 24` and a successful save)."""
CASE_ID = "explorer_icons"
REQUIRES = ()
TIMEOUT = 120

FOLDER_CLOSED, FOLDER_OPEN = "\uf07b", "\uf07c"
GLYPHS = {  # entry -> (glyph, glyph colour)
    "a.py": ("\ue606", "#FFBC03"),
    ".gitignore": ("\ue702", "#F34F29"),  # hidden
    "ignored.log": ("\uf15c", "#89979B"),  # gitignored
    "noext": ("\uf15b", "#6D8086"),  # unmapped: the default file glyph
    "package.json": ("\ue718", "#8BC34A"),  # mapped by name, not by the .json extension
}
LOG_EMFILE = "os error 24"


def _row(screen, name):
    """(y, line) of the explorer row naming `name` (the tree occupies the left pane)."""
    for y, line in enumerate(screen.lines):
        head = line[:40]
        if f" {name} " in head or head.rstrip().endswith(f" {name}"):
            return y, line
    return None


def _glyph_before(screen, name):
    """(glyph, fg) of the last non-blank cell before `name` on its explorer row."""
    found = _row(screen, name)
    if found is None:
        return None
    y, line = found
    x = line.index(" " + name) if (" " + name) in line[:40] else line.index(name)
    while x > 0 and line[x - 1] in " \u258c":
        x -= 1
    if x == 0:
        return None
    cell = screen.cell(x - 1, y)
    return cell.char, cell.fg


def _has_glyph(name, glyph, color=None):
    def predicate(screen):
        found = _glyph_before(screen, name)
        return found is not None and found[0] == glyph and (color is None or found[1] == color)
    return predicate


def run(s):
    s.write("a.py", "x = 1\n")
    s.write(".gitignore", "ignored.log\n")
    s.write("ignored.log", "log\n")
    s.write("noext", "plain\n")
    s.write("package.json", "{}\n")
    s.write(".hdir/inner.md", "# inner\n")
    s.launch()  # the workspace directory: the explorer shows the tree
    s.wait_text("package.json")
    for name, (glyph, color) in GLYPHS.items():
        s.wait_screen(_has_glyph(name, glyph, color), what=f"{name} to show glyph U+{ord(glyph):04X} in {color}")
    s.wait_screen(_has_glyph(".hdir", FOLDER_CLOSED), what="the collapsed hidden folder glyph on .hdir")

    # External create: appears after the native explorer refresh, with its mapped glyph, no restart.
    s.write("later.rs", "fn main() {}\n")
    s.keys("super+shift+e")
    s.keys("ctrl+r")  # native file_explorer_refresh
    s.wait_text("later.rs")
    s.wait_screen(_has_glyph("later.rs", "\ue68b", "#DEA584"), what="the externally created later.rs to show the Rust glyph")

    # Save As: the new name acquires its mapped glyph.
    s.open("a.py")  # setup: an editor buffer to save under a new name
    s.keys("super+shift+s")
    s.wait_text("Save as:")
    for _ in range(len("a.py")):
        s.keys("backspace")
    s.wait_screen(lambda sc: sc.lines[-1].rstrip() == "Save as:", what="an empty Save As prompt")
    s.type(str(s.path("saved.ts")))
    s.keys("enter")
    s.wait(lambda: s.path("saved.ts").exists(), what="Save As to write saved.ts")
    s.keys("super+shift+e")
    s.keys("ctrl+r")  # native refresh makes the new entry visible
    s.wait_text("saved.ts")
    s.wait_screen(_has_glyph("saved.ts", "\ue628", "#519ABA"), what="the Save As target saved.ts to show the TypeScript glyph")

    y, _line = _row(s.screen(), ".hdir")
    s.click(8, y)  # expand the hidden folder
    s.wait_screen(_has_glyph(".hdir", FOLDER_OPEN), what="the expanded folder glyph on .hdir")
    s.wait_screen(_has_glyph("inner.md", "\ue609", "#519ABA"), what="the Markdown glyph inside the hidden folder")
    s.stop()

    # E1: a 2,000-entry tree under the launchd soft fd limit.
    for d in range(20):
        for f in range(100):
            s.write(f"tree/d{d:02d}/f{f:03d}.txt", "x\n")
    s.write("note.md", "note\n")
    s.launch("note.md", nofile=256)
    s.wait_text("note")
    s.keys("super+shift+e")
    s.wait_screen(_has_glyph("note.md", "\ue609"), what="explorer glyphs in the large tree")
    x, y = s.wait_text("1 │ note")
    s.click(x + len("1 │ note"), y)  # back into the editor, caret after "note"
    s.wait_state(lambda st: st["primary"]["position"] == 4, what="the caret after note")
    s.type("!")
    s.keys("super+s")
    saved = False
    try:
        s.wait(lambda: s.read_bytes("note.md") == b"note!\n", what="the save")
        saved = True
    except AssertionError:
        pass
    # A bounded window for late descriptor exhaustion after the save; it ends early on the first hit.
    try:
        s.wait(lambda: LOG_EMFILE in s.log_text(), timeout=3, what="late fd exhaustion")
    except AssertionError:
        pass
    emfile = [line for line in s.log_text().splitlines() if LOG_EMFILE in line]
    s.check(not emfile, f"E1: no '{LOG_EMFILE}' in a 2,000-entry tree under ulimit -n 256 "
                        f"({len(emfile)} logged, first: {emfile[0][emfile[0].find('Plugin'):][:160] if emfile else ''})")
    s.check(saved, "E1: the save under ulimit -n 256 writes the edited bytes")
