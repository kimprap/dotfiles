"""shift-click-selection: with the caret at A, Shift+click at B selects exactly A..B (forward and
backward, across lines) and leaves the caret at B; a plain click clears it. Ghostty forwards
Shift+click only with `mouse-shift-capture = true`; the physical gesture is checked by the user."""
import re
from pathlib import Path

CASE_ID = "shift_click_selection"
TIMEOUT = 60

TEXT = "alpha one\nbravo two\ncharlie three\n"   # line starts at bytes 0, 10, 20
GHOSTTY = Path(__file__).resolve().parents[3] / "ghostty" / "fresh" / "keybinds.ghostty"


def _caret(st):
    sel = st["primary"]["selection"]
    return st["primary"]["position"], (sel["start"], sel["end"]) if sel else None


def _shift_click(s, x, y):
    s.mouse("click", x, y, mods=("shift",))
    s.mouse("release", x, y, mods=("shift",))


def run(s):
    s.check(re.search(r"(?m)^mouse-shift-capture\s*=\s*true\s*$", GHOSTTY.read_text()),
            f"Ghostty forwards Shift+click to Fresh: mouse-shift-capture = true in {GHOSTTY}")

    s.write("notes.txt", TEXT)
    s.launch("notes.txt")
    s.wait_state(lambda st: st["text"] == TEXT, what="notes.txt active")
    screen = s.wait_screen(lambda sc: "charlie" in sc, what="the text on screen")
    alpha, two, charlie = (screen.find(word) for word in ("alpha", "two", "charlie"))

    s.set_cursor(2)
    _shift_click(s, charlie[0] + 3, charlie[1])
    st = s.wait_state(lambda st: _caret(st) == (23, (2, 23)),
                      what="forward Shift+click across lines selects 2..23 with the caret at 23")
    s.check(st["selected"] == ["pha one\nbravo two\ncha"], f"forward selection text: {st['selected']}")

    s.click(two[0] + 1, two[1])
    s.wait_state(lambda st: _caret(st) == (17, None), what="a plain click moves the caret and clears the selection")

    _shift_click(s, alpha[0] + 1, alpha[1])
    st = s.wait_state(lambda st: _caret(st) == (1, (1, 17)),
                      what="backward Shift+click across lines selects 1..17 with the caret at 1")
    s.check(st["selected"] == ["lpha one\nbravo t"], f"backward selection text: {st['selected']}")
