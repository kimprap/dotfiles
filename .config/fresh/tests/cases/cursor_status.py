"""cursor-status: the status bar shows an unpadded grapheme-aware line:column and total line count,
absent in terminals, and closing buffers or terminals during cursor movement raises no unhandled
rejection (A2)."""
import re

CASE_ID = "cursor_status"
REQUIRES = ()

TOKEN = re.compile(r"[\d?]+:[\d?]+\|[\d?]+")
REJECTION = "Unhandled Promise rejection"


def _status(screen):
    return screen.lines[-1]


def _shows(value):
    """The status bar holds exactly `value` as one space-delimited token (no padding inside)."""
    pattern = re.compile(r"(?:^|\s)" + re.escape(value) + r"(?:\s|$)")
    return lambda screen: pattern.search(_status(screen)) is not None


def run(s):
    # a, 🙂 (4 UTF-8 bytes, 2 UTF-16 units), e + combining acute (2 code points), b: four graphemes.
    s.write("graphemes.txt", "a🙂e\u0301b\nz\n")
    for i in range(6):
        s.write(f"churn{i}.txt", "".join(f"churn {i} line {j} 🙂\n" for j in range(40)))
    s.launch("graphemes.txt")
    s.wait_screen(_shows("1:1|3"), what="the status token 1:1|3 at the start of a three-line file")

    s.keys("right", "right", "right")
    s.wait_state(lambda st: st["primary"]["position"] == 8, what="the caret after three graphemes (byte 8)")
    s.wait_screen(_shows("1:4|3"), what="the unpadded status token 1:4|3 after three graphemes")
    s.keys("end")
    s.wait_screen(_shows("1:5|3"), what="the status token 1:5|3 at the end of the grapheme line")
    s.keys("enter")
    s.wait_screen(_shows("2:1|4"), what="the status token 2:1|4 after inserting a line")

    s.keys("super+shift+c")  # dock terminal
    s.wait_state(lambda st: st["buffer"]["is_terminal"], what="a terminal to open and take focus")
    s.wait_text("$")  # the shell prompt rendered, so the status bar has refreshed for the terminal
    screen = s.wait_screen(lambda sc: "Terminal" in _status(sc), what="the terminal status message")
    s.check(not TOKEN.search(_status(screen)),
            f"the cursor status token is absent in a terminal: {_status(screen).strip()!r}")

    # A2: close a terminal and a stream of buffers while the caret keeps moving.
    s.type("exit\n")
    s.wait_state(lambda st: any("(exited)" in b["name"] for b in st["buffers"]), what="the terminal shell to exit")
    s.keys("super+w", "right", "down")  # close the exited terminal, then keep moving
    s.wait_state(lambda st: not any("(exited)" in b["name"] for b in st["buffers"]),
                 what="the exited terminal to close")
    s.keys("super+shift+e")  # the explorer: each click replaces (closes) the previous preview buffer
    screen = s.wait_screen(lambda sc: "churn5.txt" in sc, what="the churn files in the explorer")
    entries = [screen.find(f"churn{i}.txt") for i in range(6)]
    for round_ in range(12):
        x, y = entries[round_ % 6]
        s.click(x, y)  # opens a preview, closing the previous one
        s.keys("down", "down", delay=0.0)  # tree movement previews (and closes) the next entries
        s.click(80, 10)  # into the editor pane: the caret moves there
        s.keys("down", "down", "right", delay=0.0)
    s.wait_screen(lambda sc: TOKEN.search(_status(sc)), what="the status token after the churn")
    rejections = [re.sub(r"\x1b\[[0-9;]*m", "", line) for line in s.log_text().splitlines()
                  if REJECTION in line and s.upstream_signature(line) is None]
    first = rejections[0][rejections[0].find(REJECTION):] if rejections else ""
    s.check(not rejections, f"A2: no unhandled promise rejection while closing buffers and terminals "
                            f"during cursor movement ({len(rejections)} logged, first: {first})")
