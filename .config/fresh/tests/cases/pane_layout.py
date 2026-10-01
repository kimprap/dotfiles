"""pane-layout: grow and shrink resize the active editor side on both axes; equalize evens panes.

For a vertical (width) and a horizontal (height) split, and for each side as the
active pane, Cmd+Ctrl+= grows the active pane, Cmd+Ctrl+- shrinks it, and
Ctrl+Shift+= makes the two panes equal within one cell. The shifted glyphs
(Cmd+Ctrl++, Cmd+Ctrl+_, Ctrl+Shift++) do the same. Geometry comes from the probe.
"""
CASE_ID = "pane_layout"
REQUIRES = ()
TIMEOUT = 150

GROW = ("ctrl+super+=", "ctrl+super++")
SHRINK = ("ctrl+super+-", "ctrl+super+_")
EQUALIZE = ("ctrl+shift+=", "ctrl+shift++")


def _active(state):
    panes = [p for p in state["panes"] if p["active"]]
    assert len(panes) == 1, f"expected one active pane: {state['panes']}"
    return panes[0]


def _focus(s, split_id):
    """Setup: cycle next_split (Cmd+Shift+K) until the given pane is active."""
    for _ in range(3):
        if _active(s.state())["splitId"] == split_id:
            return
        s.keys("super+shift+k")
    s.wait_state(lambda st: _active(st)["splitId"] == split_id, what=f"focus on pane {split_id} (setup)")


def _size(state, split_id, axis):
    return next(p[axis] for p in state["panes"] if p["splitId"] == split_id)


def run(s):
    s.write("left.txt", "left\n")
    s.write("right.txt", "right\n")
    s.commit()
    for axis, split in (("width", "split_vertical"), ("height", "split_horizontal")):
        s.launch("left.txt")
        s.action(split)
        s.wait_state(lambda st: len(st["panes"]) == 2, what=f"{split} (setup)")
        s.open("right.txt")
        ids = [p["splitId"] for p in s.state()["panes"]]
        for variant, pane_id in enumerate(ids):
            other = next(i for i in ids if i != pane_id)
            _focus(s, pane_id)
            before = s.state()
            base = _size(before, pane_id, axis)
            s.keys(GROW[variant])
            grown = s.wait_state(lambda st: _size(st, pane_id, axis) > base,
                                 what=f"{GROW[variant]} to grow the active pane's {axis} ({base})")
            s.check(_active(grown)["splitId"] == pane_id, f"{GROW[variant]} moved focus off the active pane")
            s.check(_size(grown, other, axis) < _size(before, other, axis),
                    f"{GROW[variant]}: the other pane's {axis} did not give way")
            big = _size(grown, pane_id, axis)
            s.keys(SHRINK[variant])
            s.wait_state(lambda st: _size(st, pane_id, axis) < big,
                         what=f"{SHRINK[variant]} to shrink the active pane's {axis} ({big})")
            s.keys(SHRINK[variant], SHRINK[variant])
            shrunk = s.wait_state(lambda st: _size(st, pane_id, axis) < base,
                                  what=f"{SHRINK[variant]} to shrink the active pane's {axis} below {base}")
            s.check(abs(_size(shrunk, pane_id, axis) - _size(shrunk, other, axis)) > 1,
                    f"panes already equal on {axis} before equalize; equalize would be unproved")
            s.keys(EQUALIZE[variant])
            s.wait_state(lambda st: abs(_size(st, pane_id, axis) - _size(st, other, axis)) <= 1,
                         what=f"{EQUALIZE[variant]} to make both panes' {axis} equal within one cell")
        for pane_id in ids:
            _focus(s, pane_id)
            state = s.state()
            s.check(state["text"] in ("left\n", "right\n") and not state["buffer"]["modified"],
                    f"resizing edited a buffer: {state['text']!r}")
        s.stop()
