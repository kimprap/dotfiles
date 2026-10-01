"""presentation: cursor-dark keeps its background and comment overrides; the grapheme status layout
with the LSP indicator beside the language and neutral one-cell separators, the active indentation
guide, whitespace markers, rulers and per-language indentation hold; animations and viewport fade are
off, and no Welcome opens on start."""
import re

CASE_ID = "presentation"
REQUIRES = ()

EDITOR_BG = "#252525"  # cursor-dark editor.bg (37, 37, 37)
COMMENT_FG = "#BD79A5"  # cursor-dark syntax.comment (189, 121, 165)
GUIDE = "\u258f"
DOT = "\u00b7"  # whitespace marker
PY = "# note\ndef f():\n    if x:\n        return 1  \n    y = 2\n\ndef g():\n    return 3\n"


def _text_row(screen, number):
    """(y, x of the first text cell) of buffer line `number` in the single editor pane."""
    for y, line in enumerate(screen.lines):
        m = re.match(r"^[ \u25be\u25b8]*%d \u2502 " % number, line)
        if m:
            return y, m.end()
    return None


def _status_runs(screen):
    """Maximal runs of equal background on the status row: [(x0, x1, bg, text)]."""
    y = len(screen.lines) - 1
    runs, start = [], 0
    for x in range(1, len(screen.lines[y]) + 1):
        if x == len(screen.lines[y]) or screen.cell(x, y).bg != screen.cell(start, y).bg:
            runs.append((start, x, screen.cell(start, y).bg, screen.lines[y][start:x]))
            start = x
    return runs


def run(s):
    s.write("a.py", PY)
    s.write("notes.txt", "notes\n")
    s.write("Makefile", "all:\n")
    s.write("long.txt", "".join(f"row{i:03d} text\n" for i in range(200)))

    # No Welcome on start (a bare workspace launch is where Welcome would open).
    s.launch()
    state = s.wait_state(lambda st: st["buffers"], what="the startup buffers")
    screen = s.wait_screen(lambda sc: "File Explorer" in sc, what="the startup layout")
    names = [b["name"] for b in state["buffers"]]
    s.check(not any("Welcome" in n for n in names) and "Welcome" not in screen.lines[1],
            f"no Welcome buffer or tab opens on start: {names}")
    s.stop()

    s.launch("a.py", "notes.txt", "Makefile", "long.txt")
    s.open("a.py")
    s.wait_text("def" + DOT + "f():")
    s.check(s.cursor_style() == 5, f"the cursor is a blinking bar (DECSCUSR 5): {s.cursor_style()}")
    screen = s.screen()

    # cursor-dark overrides over its base theme.
    y, x = _text_row(screen, 2)
    s.check(screen.cell(x, y).bg == EDITOR_BG, f"editor background is cursor-dark {EDITOR_BG}: {screen.cell(x, y)}")
    y, x = _text_row(screen, 1)
    s.check(screen.cell(x, y).fg == COMMENT_FG, f"comments use cursor-dark {COMMENT_FG}: {screen.cell(x, y)}")

    # Whitespace markers: leading, inner and trailing spaces.
    y, x = _text_row(screen, 4)
    line = screen.lines[y][x:].rstrip()
    s.check(line == DOT * 8 + "return" + DOT + "1" + DOT * 2,
            f"leading, inner and trailing spaces render as markers: {line!r}")

    # Ruler at column 88 (0-based text column 87) on text rows.
    y, x = _text_row(screen, 2)
    ruler_bg, left_bg = screen.cell(x + 87, y).bg, screen.cell(x + 86, y).bg
    s.check(ruler_bg != left_bg and screen.cell(x + 88, y).bg == left_bg,
            f"a ruler marks column 88 ({ruler_bg} between {left_bg})")

    # Active indentation guide: only the innermost block holding the caret.
    s.set_cursor(PY.index("return 1"))
    screen = s.wait_screen(lambda sc: GUIDE in sc.text, what="an indentation guide for the caret's block")
    guides = sorted((y, x) for y, line in enumerate(screen.lines) for x, ch in enumerate(line) if ch == GUIDE)
    y4, x4 = _text_row(screen, 4)
    s.check(guides == [(y4, x4 + 4)], f"only the caret's innermost block shows a guide, at line 4 column 5: {guides}")

    # Status bar: line:column|total, language, LSP indicator, then a neutral cell before the badge.
    status = s.wait_screen(lambda sc: re.search(r"\[\u26a0 \d+\]", sc.lines[-1]) and "LSP" in sc.lines[-1]
                           and " 4:9|9 " in sc.lines[-1], what="the caret token, LSP indicator and warning badge").lines[-1]
    s.check(re.search(r"\s4:9\|9\s+Python\s+LSP[^\[]*\s\[\u26a0 \d+\]\s*$", status),
            f"status right side reads line:column|total, language, LSP indicator, warning badge: {status.strip()!r}")
    runs = _status_runs(s.screen())
    lsp = max(i for i, r in enumerate(runs) if r[3].strip().startswith("LSP"))
    badge = next(i for i, r in enumerate(runs) if "\u26a0" in r[3])
    gap = runs[lsp + 1:badge]
    s.check(len(gap) == 1 and gap[0][1] - gap[0][0] == 1 and gap[0][2] == runs[0][2],
            f"exactly one neutral status cell separates the LSP indicator and the badge: {gap}")

    # Per-language indentation: Tab inserts 4 spaces in Python, 2 in text, a tab in a Makefile.
    for name, expected in (("a.py", " " * 4), ("notes.txt", " " * 2), ("Makefile", "\t")):
        state = s.open(name)
        s.set_cursor(len(state["text"]))
        before = s.state()["text"]
        s.keys("tab")
        state = s.wait_state(lambda st: st["text"] != before, what=f"Tab to indent in {name}")
        s.check(state["text"] == before + expected, f"Tab in {name} inserts {expected!r}: {state['text'][len(before):]!r}")
        s.keys("super+z")
        s.wait_state(lambda st: st["text"] == before, what=f"undo of the indent in {name}")

    # Viewport fade off: rows at the top edge keep the full text colour when scrolled.
    s.open("long.txt")
    s.set_cursor(len("row000 text\n") * 100)
    screen = s.wait_screen(lambda sc: "row100" in sc.text and "row000" not in sc.text, what="long.txt scrolled")
    rows = [(y, line.index("row")) for y, line in enumerate(screen.lines) if re.search(r"\u2502 row\d{3}", line)]
    top, middle = rows[0], rows[len(rows) // 2]
    s.check(screen.cell(top[1], top[0]).fg == screen.cell(middle[1], middle[0]).fg,
            f"no viewport edge fade: top row fg {screen.cell(top[1], top[0]).fg} "
            f"equals middle row fg {screen.cell(middle[1], middle[0]).fg}")

    # Animations off: switching tabs never renders an intermediate (sliding) frame.
    s.set_cursor(0)
    s.open("notes.txt")
    s.wait_text("1 \u2502 notes")
    frames = set()
    for _ in range(4):
        s.keys("ctrl+tab", delay=0)
        for _ in range(20):
            s.pump(0.01)
            frames.add(s.screen().lines[2][:12])
    moving = sorted(f for f in frames if not re.match(r"^[ \u25be\u25b8]*1 \u2502 ", f))
    s.check(not moving, f"tab switches render no sliding frames: {moving[:3]}")
