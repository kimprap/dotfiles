"""explorer-focus: from the file explorer, H/J/I move real editor keyboard focus to the previous pane and K/L to the next."""
CASE_ID = "explorer_focus"
REQUIRES = ()

ORIGINAL = {"a.txt": "a-text\n", "b.txt": "b-text\n", "c.txt": "c-text\n"}


def _active(state):
    active = [p["name"] for p in state["panes"] if p["active"]]
    return active[0] if len(active) == 1 else None


def _explorer_focused(screen):
    return " Explorer " in screen.lines[0]  # the Explorer menu shows only while the tree has focus


def run(s):
    for name, text in ORIGINAL.items():
        s.write(name, text)
    s.launch("a.txt")
    s.wait_text("a-text")
    # Setup: three editor panes a | b | c, each showing its own file.
    s.keys("super+\\")
    s.wait_state(lambda st: len(st["panes"]) == 2, what="a second editor pane")
    s.open("b.txt")
    s.keys("super+\\")
    s.wait_state(lambda st: len(st["panes"]) == 3, what="a third editor pane")
    s.open("c.txt")
    s.wait_state(lambda st: [p["name"] for p in st["panes"]] == ["a.txt", "b.txt", "c.txt"],
                 what="panes a | b | c")
    s.keys("super+shift+j")  # editor-context previous pane: start from the middle pane
    s.wait_state(lambda st: _active(st) == "b.txt", what="the middle pane active")

    # (explorer chord, direction, pane active before, expected pane, sentinel)
    steps = (("super+shift+l", "next", "b.txt", "c.txt", "L"),
             ("super+shift+h", "previous", "c.txt", "b.txt", "H"),
             ("super+shift+k", "next", "b.txt", "c.txt", "K"),
             ("super+shift+j", "previous", "c.txt", "b.txt", "J"),
             ("super+shift+i", "previous", "b.txt", "a.txt", "I"))
    for chord, direction, start, target, sentinel in steps:
        s.check(_active(s.state()) == start, f"setup: {start} active before {chord}")
        s.keys("super+shift+e")
        s.wait_screen(_explorer_focused, what=f"the file explorer focused before {chord}")
        s.keys(chord)
        s.type(sentinel)
        state = s.wait_state(lambda st: st["text"] == sentinel + ORIGINAL[target],
                             what=f"{chord} from the explorer to route typing into the {direction} pane {target}")
        s.check(_active(state) == target, f"{chord} from the explorer activates the {direction} pane {target}")
        edited = [p["name"] for p in state["panes"] if p["modified"]]
        s.check(edited == [target], f"{chord}: only {target} received the typed sentinel, got {edited}")
        s.keys("super+z")
        s.wait_state(lambda st: st["text"] == ORIGINAL[target] and not any(p["modified"] for p in st["panes"]),
                     what=f"undo of the {chord} sentinel in {target}")
