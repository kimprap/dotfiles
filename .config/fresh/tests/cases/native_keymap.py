"""native-keymap: the macos-gui overrides resolve in editor, prompt, explorer and terminal contexts.

Editor: Cmd+P file picker, Cmd+Shift+P command palette, Cmd+Ctrl+Tab buffer
picker, Cmd+Shift+F live grep, Cmd+\\ split and Ctrl+Shift+K maximize/restore,
tab cycling (Cmd+Shift+]/[, the Cmd+}/{ and Cmd+Shift+}/{ glyphs, Ctrl+Tab and
Ctrl+Shift+Tab), in-pane reordering (Cmd+Ctrl+Shift+]/[ and the Cmd+Ctrl(+Shift)+}/{
glyphs), Cmd+Y redo after Cmd+Z, Ctrl+D duplicating the line, Cmd+Alt+I cursors at
line ends and Alt+Backspace deleting a word.
Prompt: Alt+Backspace deletes a word and Ctrl+Q selects the next item.
Explorer: Cmd+Shift+\\, Cmd+|, Cmd+Shift+| and Cmd+Shift+E reveal the active file;
Ctrl+Shift+C there copies its full path (pasted back to observe it).
Terminal: Cmd+P still opens the file picker from a focused terminal.
Physical Ghostty gestures are a physical surface and are not exercised here.
"""
CASE_ID = "native_keymap"
REQUIRES = ()
TIMEOUT = 150

NAMES = ("one.txt", "two.txt", "three.txt")
TEXT = {"one.txt": "alpha one\nbravo two\n", "two.txt": "two\n", "three.txt": "three\n"}


def _prompt(screen):
    """The prompt input row (last row) when a picker is open, else None."""
    if "#buffer" not in screen.lines[-2]:
        return None
    return screen.lines[-1]


def _highlighted(screen):
    """The listed file whose picker row has a background unlike the other rows."""
    rows = {}
    for n in NAMES:
        for x, y in screen.find_all(n):
            if y > 1:
                rows[n] = screen.cell(x, y).bg
    colors = list(rows.values())
    odd = [n for n, bg in rows.items() if colors.count(bg) == 1]
    return odd[0] if len(rows) == len(NAMES) and len(odd) == 1 else None


def _name(s):
    return s.state()["buffer"]["name"]


def _tab_order(s):
    row = s.screen().lines[1]
    return sorted(NAMES, key=row.find)


def _close_prompt(s):
    s.keys("escape")
    s.wait_screen(lambda sc: _prompt(sc) is None and "Live grep:" not in sc, what="Escape to close the prompt")


def _pickers(s):
    for key, prefix, what in (("super+p", "", "file picker"), ("super+shift+p", ">", "command palette"),
                              ("ctrl+super+tab", "#", "buffer picker")):
        s.keys(key)
        screen = s.wait_screen(lambda sc: _prompt(sc) is not None and _prompt(sc).strip() == prefix,
                               what=f"{key} to open the {what} (prompt {prefix!r})")
        if key == "super+p":
            s.check(all(n in screen for n in NAMES), "file picker does not list the workspace files")
        _close_prompt(s)
    s.keys("super+shift+f")
    s.wait_text("Live grep:")
    _close_prompt(s)


def _split_maximize(s):
    s.keys("super+\\")
    split = s.wait_state(lambda st: len(st["panes"]) == 2, what="Cmd+\\ to split")
    left, right = sorted(split["panes"], key=lambda p: p["x"])
    s.check(left["y"] == right["y"] and right["x"] > left["x"], "Cmd+\\ did not split side by side")
    s.keys("ctrl+shift+k")
    s.wait_state(lambda st: len(st["panes"]) == 1 and st["panes"][0]["width"] > right["width"],
                 what="Ctrl+Shift+K to maximize the active split")
    s.keys("ctrl+shift+k")
    s.wait_state(lambda st: len(st["panes"]) == 2, what="Ctrl+Shift+K again to restore the split")
    s.action("close_split")  # setup: back to one pane
    s.wait_state(lambda st: len(st["panes"]) == 1, what="one pane again (setup)")


def _cycling(s):
    s.open("one.txt")
    s.wait_state(lambda st: st["buffer"]["name"] == "one.txt", what="one.txt active (setup)")
    s.check(_tab_order(s) == list(NAMES), f"unexpected initial tab order {_tab_order(s)}")
    for key, expected in (("super+shift+]", "two.txt"), ("super+}", "three.txt"), ("super+shift+}", "one.txt"),
                          ("ctrl+tab", "two.txt"), ("super+shift+[", "one.txt"), ("super+{", "three.txt"),
                          ("super+shift+{", "two.txt"), ("ctrl+shift+tab", "one.txt")):
        s.keys(key)
        s.wait(lambda: _name(s) == expected, what=f"{key} to cycle to {expected}")
    # Reordering the active one.txt: each step moves it one slot and leaves it active.
    for key, index in (("ctrl+shift+super+]", 1), ("ctrl+shift+super+[", 0), ("ctrl+super+}", 1),
                       ("ctrl+super+{", 0), ("ctrl+shift+super+}", 1), ("ctrl+shift+super+{", 0)):
        s.keys(key)
        s.wait(lambda: _tab_order(s).index("one.txt") == index,
               what=f"{key} to move one.txt to tab slot {index}")
        s.check(_name(s) == "one.txt", f"{key} changed the active tab")


def _editing(s):
    s.open("one.txt")
    s.set_cursor(0)
    s.keys("ctrl+d")
    s.wait_state(lambda st: st["text"] == "alpha one\nalpha one\nbravo two\n", what="Ctrl+D to duplicate the line")
    s.keys("super+z")
    s.wait_state(lambda st: st["text"] == TEXT["one.txt"], what="Cmd+Z to undo the duplicate")
    s.keys("super+y")
    s.wait_state(lambda st: st["text"] == "alpha one\nalpha one\nbravo two\n", what="Cmd+Y to redo")
    s.keys("super+z")
    s.wait_state(lambda st: st["text"] == TEXT["one.txt"], what="Cmd+Z (setup: original text)")

    s.set_cursor(0)
    s.keys("shift+down")
    s.wait_state(lambda st: st["primary"]["selection"] is not None, what="a two-line selection (setup)")
    s.keys("alt+super+i")
    state = s.wait_state(lambda st: len(st["cursors"]) == 2, what="Cmd+Alt+I to add cursors at line ends")
    s.check(sorted(c["position"] for c in state["cursors"]) == [9, 19],
            f"Cmd+Alt+I cursors are not at the two line ends: {state['cursors']}")
    s.keys("escape")
    s.wait_state(lambda st: len(st["cursors"]) == 1, what="Escape to one cursor (setup)")

    s.set_cursor(len("alpha one"))
    s.keys("alt+backspace")
    s.wait_state(lambda st: st["text"] == "alpha \nbravo two\n", what="Alt+Backspace to delete the word")
    s.keys("super+z")
    s.wait_state(lambda st: st["text"] == TEXT["one.txt"], what="Cmd+Z (setup: original text)")


def _prompt_keys(s):
    s.open("one.txt")
    s.keys("super+p")
    s.wait_screen(lambda sc: _prompt(sc) is not None, what="file picker (setup)")
    s.type("abc def")
    s.wait_screen(lambda sc: sc.lines[-1].rstrip() == "abc def", what="typed prompt text")
    s.keys("alt+backspace")
    s.wait_screen(lambda sc: sc.lines[-1].rstrip() == "abc", what="Alt+Backspace to delete a prompt word")
    s.keys(*["backspace"] * 4)
    s.wait_screen(lambda sc: _prompt(sc) is not None and _prompt(sc).strip() == "", what="empty prompt (setup)")
    s.keys("ctrl+q")
    first = s.wait(lambda: _highlighted(s.screen()), what="Ctrl+Q to select a listed file")
    s.keys("ctrl+q")
    second = s.wait(lambda: (h := _highlighted(s.screen())) and h != first and h,
                    what=f"Ctrl+Q again to move the selection off {first}")
    s.keys("enter")
    s.wait(lambda: _name(s) == second, what=f"Enter to open the Ctrl+Q selection {second}")


def _explorer(s):
    s.open("two.txt")
    for key in ("super+shift+\\", "super+|", "super+shift+|", "super+shift+e"):
        s.keys(key)
        screen = s.wait_screen(lambda sc: "File Explorer" in sc and any("▌" in l and "two.txt" in l for l in sc.lines),
                               what=f"{key} to reveal two.txt in the file explorer")
        s.check(not any("▌" in l and ("one.txt" in l or "three.txt" in l) for l in screen.lines),
                f"{key} selected another file")
        s.action("toggle_file_explorer")  # setup: hide it again
        s.action("focus_editor")
        s.wait_screen(lambda sc: "File Explorer" not in sc, what="explorer hidden (setup)")
    s.keys("super+shift+e")
    s.wait_text("File Explorer")
    s.keys("ctrl+shift+c")
    path = str(s.path("two.txt"))
    s.wait(lambda: s.screen().find("Copied path") is not None, what="Ctrl+Shift+C in the explorer to copy the path")
    s.action("focus_editor")
    s.set_cursor(0)
    s.keys("super+v")
    state = s.wait_state(lambda st: st["text"] != TEXT["two.txt"], what="Cmd+V to paste the copied path")
    s.check(state["text"] == path + TEXT["two.txt"], f"the explorer copied a wrong path: {state['text']!r}")
    s.keys("super+z")
    s.wait_state(lambda st: st["text"] == TEXT["two.txt"], what="Cmd+Z (setup: original text)")


def _terminal(s):
    s.keys("super+shift+c")
    s.wait_state(lambda st: st["buffer"]["is_terminal"], what="focused dock terminal (setup)")
    s.keys("super+p")
    s.wait_screen(lambda sc: _prompt(sc) is not None and _prompt(sc).strip() == "",
                  what="Cmd+P from the terminal to open the file picker")
    _close_prompt(s)


def run(s):
    for name in NAMES:
        s.write(name, TEXT[name])
    s.commit()
    # Keep the explorer copy away from the real macOS pasteboard: a workspace
    # (project-layer) setting, not the profile under test.
    s.write(".fresh/config.json", '{"clipboard": {"use_system_clipboard": false}}\n')
    s.launch(*NAMES)
    _pickers(s)
    _split_maximize(s)
    _cycling(s)
    _editing(s)
    _prompt_keys(s)
    _explorer(s)
    _terminal(s)
    for name in NAMES:
        s.check(s.read_bytes(name) == TEXT[name].encode(), f"keymap exercise saved {name}")
