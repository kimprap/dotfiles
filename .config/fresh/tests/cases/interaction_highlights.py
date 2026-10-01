"""interaction-highlights: tab backgrounds, the notification badge (including hover), yellow
indentation guides, blue single selection, grey multi-selection/semantic/other-search highlights and
the yellow current search match hold across base-theme switches, same-theme reapply and restart."""
CASE_ID = "interaction_highlights"
REQUIRES = ()
TIMEOUT = 120

TAB_ACTIVE_BG, TAB_INACTIVE_BG = "#5B5B5B", "#323741"
BADGE_BG, BADGE_FG = "#3F78A7", "#FFFFFF"
GUIDE_FG = "#DADC40"
SELECTION_BG = "#304E75"
GREY_BG = "#656565"  # multi-selection and other search matches
SEMANTIC_BG = "#494949"
SEARCH_OTHER_FG = "#DCDCDC"
SEARCH_CURRENT_BG = "#FAFD54"

PY = "def f():\n    if x:\n        foo = foo\n    foo()\n"
FOO_1 = PY.index("foo")  # first occurrence, line 3


def _foo_cells(screen):
    """[(x, y)] of the first cell of each visible `foo` in the editor rows."""
    found = []
    for y, line in enumerate(screen.lines[2:-1], 2):
        start = line.find("\u2502 ")
        x = line.find("foo", start)
        while x >= 0:
            found.append((x, y))
            x = line.find("foo", x + 3)
    return found


def _check_all(s, when):
    s.keys("escape")
    s.action("clear_search")  # setup: the previous round's search would paint over the other checks
    s.open("a.py")
    s.set_cursor(0)
    s.wait_state(lambda st: not st["search"], what=f"no active search ({when})")

    # Tabs: a.py active, b.txt inactive.
    screen = s.wait_screen(lambda sc: " b.txt " in sc.lines[1], what=f"both tabs ({when})")
    xa, xb = screen.lines[1].index(" a.py ") + 1, screen.lines[1].index(" b.txt ") + 1
    s.check(screen.cell(xa, 1).bg == TAB_ACTIVE_BG and screen.cell(xb, 1).bg == TAB_INACTIVE_BG,
            f"active/inactive tab backgrounds are {TAB_ACTIVE_BG}/{TAB_INACTIVE_BG} ({when}): "
            f"{screen.cell(xa, 1).bg}/{screen.cell(xb, 1).bg}")

    # Notification badge, then hovered (SGR motion without a button).
    y = len(screen.lines) - 1
    screen = s.wait_screen(lambda sc: "\u26a0" in sc.lines[y], what=f"the warning badge ({when})")
    xw = screen.lines[y].index("\u26a0")
    badge = screen.cell(xw, y)
    s.check((badge.bg, badge.fg) == (BADGE_BG, BADGE_FG),
            f"the notification badge is white on {BADGE_BG} ({when}): {badge.fg} on {badge.bg}")
    s.keys(f"\x1b[<35;{xw + 1};{y + 1}M".encode())
    s.sleep(0.2)
    badge = s.screen().cell(xw, y)
    s.check((badge.bg, badge.fg) == (BADGE_BG, BADGE_FG),
            f"the hovered notification badge stays white on {BADGE_BG} ({when}): {badge.fg} on {badge.bg}")
    s.keys(f"\x1b[<35;{xw + 1};{y - 5}M".encode())

    # Indentation guide in the caret's block.
    s.set_cursor(FOO_1)
    screen = s.wait_screen(lambda sc: "\u258f" in sc.text, what=f"the indentation guide ({when})")
    gy = next(y for y, line in enumerate(screen.lines) if "\u258f" in line)
    guide = screen.cell(screen.lines[gy].index("\u258f"), gy)
    s.check(guide.fg == GUIDE_FG, f"the indentation guide is yellow {GUIDE_FG} ({when}): {guide.fg}")

    # Single selection is blue; the other occurrences get the grey semantic highlight.
    s.keys("shift+right", "shift+right", "shift+right")
    s.wait_state(lambda st: st["primary"]["selection"] == {"start": FOO_1, "end": FOO_1 + 3},
                 what=f"a single selection of foo ({when})")
    screen = s.wait_screen(lambda sc: len(_foo_cells(sc)) == 3
                           and sc.cell(*_foo_cells(sc)[1]).bg == SEMANTIC_BG, what=f"semantic highlights ({when})")
    first, second, third = _foo_cells(screen)
    s.check(screen.cell(*first).bg == SELECTION_BG,
            f"the single selection is blue {SELECTION_BG} ({when}): {screen.cell(*first).bg}")
    s.check(screen.cell(*third).bg == SEMANTIC_BG,
            f"semantic occurrences are grey {SEMANTIC_BG} ({when}): {screen.cell(*third).bg}")

    # Multi-selection is grey.
    s.keys("super+shift+d")
    s.wait_state(lambda st: len(st["cursors"]) == 3, what=f"three selections ({when})")
    screen = s.wait_screen(lambda sc: all(sc.cell(*p).bg == GREY_BG for p in _foo_cells(sc)),
                           what=f"grey multi-selection on every foo ({when})")
    s.keys("escape")
    s.wait_state(lambda st: len(st["cursors"]) == 1, what=f"back to one cursor ({when})")

    # Search: other matches grey with light text, the current match yellow.
    s.set_cursor(0)
    s.keys("super+f")
    s.wait_screen(lambda sc: any(line.rstrip() == "Search:" for line in sc.lines), what=f"empty Search: prompt ({when})")
    s.type("foo")
    s.wait_screen(lambda sc: any(line.rstrip() == "Search: foo" for line in sc.lines),
                  what=f"query foo in the Search: prompt ({when})")
    s.keys("enter")
    s.wait_state(lambda st: st["search"] and st["primary"]["position"] == FOO_1, what=f"the first match ({when})")
    s.keys("super+g")
    s.wait_state(lambda st: st["primary"]["position"] == FOO_1 + 6, what=f"the next match ({when})")

    def search_ok(sc):
        cells = [sc.cell(*p) for p in _foo_cells(sc)]
        return (len(cells) == 3 and cells[1].bg == SEARCH_CURRENT_BG
                and all((c.bg, c.fg) == (GREY_BG, SEARCH_OTHER_FG) for c in (cells[0], cells[2])))
    try:
        s.wait_screen(search_ok, what="search highlights")
    except AssertionError:
        pass
    cells = [s.screen().cell(*p) for p in _foo_cells(s.screen())]
    s.check(search_ok(s.screen()), f"search: current match yellow {SEARCH_CURRENT_BG}, others {SEARCH_OTHER_FG} on "
                                   f"{GREY_BG} ({when}): {[(c.fg, c.bg) for c in cells]}")
    s.keys("escape")


def _select_theme(s, name):
    s.keys("escape")
    s.keys("super+shift+p")
    s.type("select theme")
    s.wait_text("Choose a color theme")
    s.keys("enter")
    s.wait_screen(lambda sc: sc.lines[-1].startswith("Select theme:"), what="the theme picker prompt")
    s.type(name)
    s.wait_screen(lambda sc: any(line.lstrip("\u2502 ").startswith(name + " ") for line in sc.lines),
                  what=f"theme {name} in the picker")
    s.keys("enter")
    s.wait_screen(lambda sc: "Choose a color theme" not in sc.text and "cursor-dark.json" not in sc.text,
                  what=f"the theme picker to close after choosing {name}")
    s.sleep(0.3)


def run(s):
    s.write("a.py", PY)
    s.write("b.txt", "b\n")
    s.launch("a.py", "b.txt")
    s.wait_text(" b.txt ")
    _check_all(s, "start")
    _select_theme(s, "light")
    _check_all(s, "after switching to light")
    _select_theme(s, "cursor-dark")
    _check_all(s, "after switching back to cursor-dark")
    _select_theme(s, "cursor-dark")
    _check_all(s, "after reapplying cursor-dark")
    s.stop()
    s.launch("a.py", "b.txt")
    s.wait_text(" b.txt ")
    _check_all(s, "after restart")
