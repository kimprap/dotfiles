"""review-diff: all-files review and per-file diff from ordinary and Markdown source; Alt+Z in editors.

From a plain file and from a Markdown file in markdown-source mode:
- Cmd+R Cmd+Shift+D opens the all-files review listing tracked changes and the
  untracked file; with the file panel, a review comment and the comments rail
  shown there are three focus targets, and Shift+Tab from the first reaches the
  one Tab reaches last (reverse order); q returns to the source file.
- Cmd+R D opens the per-file diff whose working-only line appears only in the NEW
  column; q returns. An untracked file's diff has an empty OLD column.
In an ordinary editor, Alt+Z toggles wrapping of a long line and back.
Review and diff never modify the workspace files.
"""
CASE_ID = "review_diff"
REQUIRES = ()
TIMEOUT = 120

LONG = "WRAPSTART " + "word " * 40 + "WRAPEND"
HEAD = {"plain.txt": "plain\n", "notes.md": "# Heading\n\n- item\n"}
WORK = {"plain.txt": "plain\nchanged plain\n", "notes.md": "# Heading\n\n- item\n- changed md\n"}
MARK = {"plain.txt": "changed plain", "notes.md": "changed md", "untracked.txt": "untracked only"}
NOTE = "t4 focus note"


def _columns(screen):
    """(old, new) text of a side-by-side diff, split at the NEW header column."""
    header = next(y for y, line in enumerate(screen.lines) if "OLD (HEAD)" in line and "NEW (Working)" in line)
    split = screen.lines[header].index("NEW (Working)")
    body = screen.lines[header + 1:-1]
    return "\n".join(l[:split] for l in body), "\n".join(l[split:] for l in body)


def _diff(s, name):
    s.keys("super+r", "d")
    s.wait_state(lambda st: st["buffer"]["is_virtual"] and st["buffer"]["name"] == f"*Diff: {name}*",
                 what=f"Cmd+R D to open the {name} diff")
    screen = s.wait_screen(lambda sc: "OLD (HEAD)" in sc and "NEW (Working)" in sc and MARK[name] in sc,
                           what=f"{name} side-by-side diff")
    old, new = _columns(screen)
    s.check(MARK[name] in new and MARK[name] not in old, f"{name}: working-only line is not only in NEW")
    if name == "untracked.txt":
        s.check(not any(c.isalpha() for c in old), f"untracked diff OLD column is not empty: {old!r}")
    s.keys("q")
    s.wait_state(lambda st: st["buffer"]["name"] == name, what=f"q to return from the diff to {name}")


def _focus(s):
    return s.state()["buffer"]["name"]


def _tab_order(s):
    """Review focus targets in Tab order, starting from the focused one."""
    order = [_focus(s)]
    for _ in range(6):
        s.keys("tab")
        s.wait(lambda: _focus(s) != order[-1], what=f"Tab to move review focus from {order[-1]}")
        if _focus(s) == order[0]:
            return order
        order.append(_focus(s))
    s.check(False, f"Tab never cycled review focus back to {order[0]}: {order}")


def _add_focus_targets(s):
    """Setup: file panel, one review comment and the comments rail, so focus has three targets."""
    if "[ ▸ File ]" in s.screen():
        s.keys("F")
    s.wait_screen(lambda sc: "FILES" in sc and "UNTRACKED" in sc, what="review file panel")
    if "COMMENTS" not in s.screen():
        s.keys("C")
        s.wait_screen(lambda sc: "COMMENTS" in sc, what="review comments rail")
    if NOTE not in s.screen():
        for _ in range(3):
            if _focus(s) == "*diff*":
                break
            s.keys("tab")
            s.sleep(0.3)
        s.check(_focus(s) == "*diff*", "review focus never reached the diff (setup)")
        s.keys("n")
        s.sleep(0.3)
        s.keys("c")
        s.wait_screen(lambda sc: "Comment on" in sc.lines[-1], what="review comment prompt (setup)")
        s.type(NOTE + "\n")
        s.wait_screen(lambda sc: NOTE in sc, what="review comment in the rail (setup)")


def _review(s, name):
    s.keys("super+r", "super+shift+d")
    s.wait_screen(lambda sc: "Review Diff" in sc and "UNSTAGED" in sc, what=f"Cmd+R Cmd+Shift+D review from {name}")
    _add_focus_targets(s)
    screen = s.screen()
    body = "\n".join(screen.lines[2:])  # below the menu and tab rows
    for listed in ("plain.txt", "notes.md", "untracked.txt"):
        s.check(listed in body, f"review does not list {listed}")
    order = _tab_order(s)
    s.check(len(order) >= 3, f"review focus cycles only {order}; reverse order is not observable")
    s.keys("shift+tab")
    s.wait(lambda: _focus(s) == order[-1],
           what=f"Shift+Tab to move review focus in reverse, from {order[0]} to {order[-1]} (Tab order {order})")
    s.check("Review Diff" in s.screen(), "Shift+Tab left the review")
    s.keys("q")
    s.wait_state(lambda st: st["buffer"]["name"] == name, what=f"q to return from the review to {name}")


def _wrapped(screen):
    return "WRAPSTART" in screen and "WRAPEND" in screen


def run(s):
    for name, text in HEAD.items():
        s.write(name, text)
    s.write("long.txt", LONG + "\n")
    s.commit()
    for name, text in WORK.items():
        s.write(name, text)
    s.write("untracked.txt", MARK["untracked.txt"] + "\n")

    s.launch("plain.txt")
    s.open("notes.md")
    s.wait_state(lambda st: st["buffer"]["name"] == "notes.md" and st["mode"] == "markdown-source",
                 what="notes.md in markdown-source mode")
    _review(s, "notes.md")
    _diff(s, "notes.md")
    s.check(s.state()["mode"] == "markdown-source", "returning from review/diff left markdown-source mode")
    s.open("plain.txt")
    s.wait_state(lambda st: st["buffer"]["name"] == "plain.txt" and st["mode"] != "markdown-source",
                 what="plain.txt in an ordinary editor")
    _review(s, "plain.txt")
    _diff(s, "plain.txt")
    s.open("untracked.txt")
    s.wait_state(lambda st: st["buffer"]["name"] == "untracked.txt", what="untracked.txt open (setup)")
    _diff(s, "untracked.txt")

    s.open("long.txt")
    screen = s.wait_screen(lambda sc: "WRAPSTART" in sc, what="long.txt rendered")
    before = _wrapped(screen)
    s.keys("alt+z")
    s.wait_screen(lambda sc: _wrapped(sc) != before, what="Alt+Z to toggle wrapping in the editor")
    s.keys("alt+z")
    s.wait_screen(lambda sc: _wrapped(sc) == before, what="a second Alt+Z to restore wrapping in the editor")

    for name in (*WORK, "untracked.txt", "long.txt"):
        expected = {**WORK, "untracked.txt": MARK["untracked.txt"] + "\n", "long.txt": LONG + "\n"}[name]
        s.check(s.read_bytes(name) == expected.encode(), f"review/diff changed {name} on disk")
