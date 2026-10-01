"""tab-move: held Cmd+Ctrl+Shift doubled letters move only the source pane's tab.

J/K/L/I move left/down/right/up, creating an editor neighbor when absent; a
terminal is skipped as a destination, and a third pane already showing the
buffer keeps its copy. Tab membership is read from each pane's rendered tab row.
"""
CASE_ID = "tab_move"
REQUIRES = ()
TIMEOUT = 150

CHORD = {"left": "j", "down": "k", "right": "l", "up": "i"}


def _active(state):
    panes = [p for p in state["panes"] if p["active"]]
    assert len(panes) == 1, f"expected one active pane: {state['panes']}"
    return panes[0]


def _tabs(screen, pane, name):
    """Whether `name` is on the pane's tab row (the row at the pane's top edge)."""
    return name in screen.lines[pane["y"]][pane["x"]:pane["x"] + pane["width"]]


def _move(s, direction):
    letter = CHORD[direction]
    s.keys(f"ctrl+shift+super+{letter}", f"ctrl+shift+super+{letter}")


def _focus(s, split_id):
    """Setup: cycle next_split (Cmd+Shift+K) until the given pane is active."""
    for _ in range(4):
        if _active(s.state())["splitId"] == split_id:
            return
        s.keys("super+shift+k")
    s.wait_state(lambda st: _active(st)["splitId"] == split_id, what=f"focus on pane {split_id} (setup)")


def _launch_pair(s):
    s.launch("keep.txt")
    s.open("move.txt")
    return s.wait_state(lambda st: st["buffer"]["name"] == "move.txt" and len(st["panes"]) == 1,
                        what="one pane with keep.txt and move.txt open")


def run(s):
    s.write("keep.txt", "keep\n")
    s.write("move.txt", "move\n")
    s.commit()

    # Each direction from one pane: a neighbor is created on that side and only the
    # moved tab leaves the source pane.
    for direction, axis, sign in (("left", "x", -1), ("down", "y", 1), ("right", "x", 1), ("up", "y", -1)):
        before = _launch_pair(s)
        source_id = _active(before)["splitId"]
        _move(s, direction)
        state = s.wait_state(
            lambda st: len(st["panes"]) == 2 and _active(st)["splitId"] != source_id
            and st["buffer"]["name"] == "move.txt",
            what=f"move {direction} to create a neighbor holding move.txt")
        source = next(p for p in state["panes"] if p["splitId"] == source_id)
        dest = _active(state)
        s.check(sign * (dest[axis] - source[axis]) > 0,
                f"move {direction}: destination at {dest[axis]} is not {direction} of the source at {source[axis]}")
        s.wait_screen(lambda sc: _tabs(sc, dest, "move.txt") and not _tabs(sc, source, "move.txt")
                      and _tabs(sc, source, "keep.txt") and not _tabs(sc, dest, "keep.txt"),
                      what=f"move {direction}: move.txt only in the destination tab row, keep.txt only in the source")
        s.check(s.read_bytes("move.txt") == b"move\n", f"move {direction} changed the moved file")
        s.stop()

    # A third pane already showing the moved buffer keeps it: source above, then
    # destination, then third pane (horizontal splits).
    _launch_pair(s)
    source_id = _active(s.state())["splitId"]
    s.action("split_horizontal")
    s.wait_state(lambda st: len(st["panes"]) == 2, what="second pane (setup)")
    s.open("keep.txt")
    dest_id = _active(s.state())["splitId"]
    s.action("split_horizontal")
    s.wait_state(lambda st: len(st["panes"]) == 3, what="third pane (setup)")
    s.open("move.txt")
    third_id = _active(s.state())["splitId"]
    _focus(s, source_id)
    _move(s, "down")
    state = s.wait_state(lambda st: _active(st)["splitId"] == dest_id and st["buffer"]["name"] == "move.txt",
                         what="move down into the existing middle pane")
    panes = {p["splitId"]: p for p in state["panes"]}
    s.check(len(panes) == 3, f"move down changed the pane count: {state['panes']}")
    s.check(panes[third_id]["name"] == "move.txt", "move down stripped the third pane's copy of move.txt")
    s.wait_screen(lambda sc: not _tabs(sc, panes[source_id], "move.txt") and _tabs(sc, panes[dest_id], "move.txt")
                  and _tabs(sc, panes[third_id], "move.txt"),
                  what="move.txt left the source only; destination and third pane both show it")
    s.stop()

    # A terminal below the source is not a destination: the tab goes to a new editor
    # pane and the terminal keeps its buffer.
    _launch_pair(s)
    source_id = _active(s.state())["splitId"]
    s.keys("super+shift+c")
    state = s.wait_state(lambda st: any(p["kind"] == "terminal" for p in st["panes"]), what="dock terminal (setup)")
    terminal = next(p for p in state["panes"] if p["kind"] == "terminal")
    _focus(s, source_id)
    _move(s, "down")
    state = s.wait_state(
        lambda st: _active(st)["splitId"] not in (source_id, terminal["splitId"])
        and _active(st)["kind"] == "file" and st["buffer"]["name"] == "move.txt",
        what="move down into an editor pane, not the terminal")
    kept = next((p for p in state["panes"] if p["splitId"] == terminal["splitId"]), None)
    s.check(kept is not None and kept["kind"] == "terminal" and kept["bufferId"] == terminal["bufferId"],
            "the terminal pane lost its terminal buffer to the moved tab")
    s.check(s.read_bytes("move.txt") == b"move\n" and s.read_bytes("keep.txt") == b"keep\n",
            "tab movement changed a file")
