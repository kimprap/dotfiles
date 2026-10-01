"""reopen-closed-tab: Cmd+Shift+T reopens the last closed real file, skipping virtual views.

A real file is closed with Cmd+W, then a current-file diff (Cmd+R D) and the
all-files review (Cmd+R Cmd+Shift+D) are opened and closed with Cmd+W after it.
Cmd+Shift+T must bring back the real file with its on-disk text, not a diff or
review buffer.
"""
CASE_ID = "reopen_closed_tab"
REQUIRES = ()


def run(s):
    s.write("keep.txt", "keep\n")
    s.write("closed.txt", "closed\n")
    s.commit()
    s.write("keep.txt", "keep\nchanged\n")  # gives the diff and review something to show
    s.launch("keep.txt")
    s.open("closed.txt")
    s.wait_state(lambda st: st["buffer"]["name"] == "closed.txt", what="closed.txt active (setup)")

    s.keys("super+w")
    s.wait_state(lambda st: all(b["name"] != "closed.txt" for b in st["buffers"]),
                 what="Cmd+W to close closed.txt")
    s.wait_state(lambda st: st["buffer"]["name"] == "keep.txt", what="keep.txt active after the close")

    s.keys("super+r", "d")
    s.wait_state(lambda st: st["buffer"]["is_virtual"] and st["buffer"]["name"] == "*Diff: keep.txt*",
                 what="Cmd+R D to open the keep.txt diff")
    s.keys("super+w")
    s.wait_state(lambda st: not st["buffer"]["is_virtual"] and st["buffer"]["name"] == "keep.txt",
                 what="Cmd+W to close the diff view")

    s.keys("super+r", "super+shift+d")
    s.wait_screen(lambda sc: "Review Diff" in sc and "keep.txt" in sc, what="Cmd+R Cmd+Shift+D review view")
    s.wait_state(lambda st: st["buffer"]["is_virtual"], what="review buffer active")
    s.keys("super+w")
    s.wait_state(lambda st: not st["buffer"]["is_virtual"] and st["buffer"]["name"] == "keep.txt",
                 what="Cmd+W to close the review view")

    s.keys("super+shift+t")
    state = s.wait_state(lambda st: st["buffer"]["name"] != "keep.txt",
                         what="Cmd+Shift+T to reopen a closed tab")
    s.check(state["buffer"]["name"] == "closed.txt" and not state["buffer"]["is_virtual"],
            f"Cmd+Shift+T reopened {state['buffer']['name']!r} instead of the last closed real file closed.txt")
    s.check(state["text"] == "closed\n", f"reopened closed.txt has wrong text: {state['text']!r}")
