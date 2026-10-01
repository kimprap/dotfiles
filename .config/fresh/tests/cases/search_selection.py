"""search-selection: the current search match is yellow and other matches grey, an intentionally
cleared search stays empty, select-all adds each exact occurrence once, and single selection is
blue while multi-selection is grey."""
import re

CASE_ID = "search_selection"
REQUIRES = ()

YELLOW_BG, YELLOW_FG = "#FAFD54", "#252525"
GREY = "#656565"
BLUE = "#304E75"
SEARCH = "BEGIN foo MID foo END\n"      # matches at 6 and 14
OCCUR = "BEGIN foo MID Foo foo END\n"   # exact "foo" at 6 and 18; "Foo" is not an occurrence
PROMPT = re.compile(r"^Search:(.*)$")


def _bgs(screen, starts, marker="BEGIN"):
    """Background of every cell of each 3-char word starting at byte offsets `starts` (ASCII line)."""
    found = screen.find(marker)
    if found is None:
        return None
    x, y = found
    return [[screen.cell(x + start + n, y) for n in range(3)] for start in starts]


def _search_colors(current):
    def ok(screen):
        words = _bgs(screen, (6, 14))
        if words is None:
            return False
        for index, cells in enumerate(words):
            for cell in cells:
                if index == current and (cell.bg, cell.fg) != (YELLOW_BG, YELLOW_FG):
                    return False
                if index != current and cell.bg != GREY:
                    return False
        return True
    return ok


def _prompt(screen):
    for line in reversed(screen.lines):
        match = PROMPT.match(line)
        if match:
            return match.group(1).strip()
    return None


def _all_bg(starts, color):
    return lambda screen: (words := _bgs(screen, starts)) is not None and all(
        cell.bg == color for cells in words for cell in cells)


def run(s):
    s.write("search.txt", SEARCH)
    s.write("occur.txt", OCCUR)
    s.launch("search.txt")
    s.wait_state(lambda st: st["text"] == SEARCH, what="search.txt active")

    # Stepping: the current match is yellow, the other grey, forward and backward.
    s.keys("super+f")
    s.wait_screen(lambda sc: _prompt(sc) == "", what="empty Search: prompt")
    s.type("foo")
    s.wait_screen(lambda sc: _prompt(sc) == "foo", what="query foo in the Search: prompt")
    s.keys("enter")
    s.wait_state(lambda st: st["search"] and st["primary"]["position"] == 6, what="first match after Enter")
    s.wait_screen(_search_colors(0), what="first match yellow, second grey")
    s.keys("super+g")
    s.wait_state(lambda st: st["primary"]["position"] == 14, what="Cmd+G to the next match")
    s.wait_screen(_search_colors(1), what="after Cmd+G the second match yellow, first grey")
    s.keys("super+shift+g")
    s.wait_state(lambda st: st["primary"]["position"] == 6, what="Cmd+Shift+G to the previous match")
    s.wait_screen(_search_colors(0), what="after Cmd+Shift+G the first match yellow again")
    s.keys("f3")
    s.wait_state(lambda st: st["primary"]["position"] == 14, what="F3 to the next match")
    s.wait_screen(_search_colors(1), what="after F3 the second match yellow")
    s.keys("shift+f3")
    s.wait_state(lambda st: st["primary"]["position"] == 6, what="Shift+F3 to the previous match")
    s.wait_screen(_search_colors(0), what="after Shift+F3 the first match yellow")

    # Clearing: an empty confirm ends the search, and the next Cmd+F opens empty (no history prefill).
    s.keys("super+f")
    s.wait_screen(lambda sc: _prompt(sc) == "foo", what="Cmd+F during a search shows the query")
    s.keys("super+a", "backspace", "enter")
    s.wait_state(lambda st: not st["search"], what="empty confirm clears the search")
    s.wait_screen(lambda sc: _prompt(sc) is None, what="search prompt closed")
    s.wait_screen(lambda sc: _bgs(sc, (6, 14)) is not None and not any(
        cell.bg in (GREY, YELLOW_BG) for cells in _bgs(sc, (6, 14)) for cell in cells),
        what="no search highlight after the clear")
    s.keys("super+f")
    screen = s.wait_screen(lambda sc: _prompt(sc) is not None, what="Search: prompt reopened")
    s.check(_prompt(screen) == "", f"a cleared search reopens empty, got {_prompt(screen)!r}")
    s.keys("escape")
    s.wait_screen(lambda sc: _prompt(sc) is None, what="search prompt dismissed")
    s.check(s.state()["text"] == SEARCH, "searching left the text unchanged")

    # Selection: single selection blue, select-all adds each exact occurrence once, multi grey.
    s.open("occur.txt")
    s.action("focus_editor")
    s.wait_state(lambda st: st["text"] == OCCUR, what="occur.txt active")
    s.set_cursor(6)
    s.keys("super+d")
    s.wait_state(lambda st: st["selected"] == ["foo"] and len(st["cursors"]) == 1, what="Cmd+D selects one foo")
    s.wait_screen(_all_bg((6,), BLUE), what="single selection blue")
    expected = [{"start": 6, "end": 9}, {"start": 18, "end": 21}]
    for attempt in ("first", "repeated"):
        s.keys("super+shift+d")
        st = s.wait_state(lambda st: len(st["cursors"]) == 2 and st["selected"] == ["foo", "foo"],
                          what=f"{attempt} Cmd+Shift+D selects both exact occurrences")
        s.check([c["selection"] for c in st["cursors"]] == expected,
                f"{attempt} Cmd+Shift+D selections: {st['cursors']}")
        s.wait_screen(_all_bg((6, 18), GREY), what=f"multi-selection grey after {attempt} Cmd+Shift+D")
        s.sleep(0.3)
        st = s.state()
        s.check(len(st["cursors"]) == 2, f"{attempt} Cmd+Shift+D adds no duplicate cursor: {st['cursors']}")
    s.keys("escape")
    s.wait_state(lambda st: len(st["cursors"]) == 1, what="Escape back to one cursor")
    s.check(s.state()["text"] == OCCUR, "selection left the text unchanged")
