"""preview-tabs: explorer clicks open and reuse a preview tab; editing promotes it and the saved content persists."""
CASE_ID = "preview_tabs"
REQUIRES = ()


def _files(state):
    return [(b["name"], b["is_preview"]) for b in state["buffers"] if b.get("path")]


def _click_entry(s, name):
    x, y = s.wait_text(name)
    s.click(x, y)


def run(s):
    s.write("alpha.txt", "alpha\n")
    s.write("beta.txt", "beta\n")
    s.launch()  # the workspace directory: the explorer shows the tree
    s.wait_screen(lambda sc: "alpha.txt" in sc and "beta.txt" in sc, what="both files in the explorer")

    _click_entry(s, "alpha.txt")
    state = s.wait_state(lambda st: (st["buffer"] or {}).get("name") == "alpha.txt",
                         what="alpha.txt to open from an explorer click")
    s.check(_files(state) == [("alpha.txt", True)], f"an explorer click opens a preview tab: {_files(state)}")
    s.wait_text("alpha.txt (preview)")

    _click_entry(s, "beta.txt")
    state = s.wait_state(lambda st: (st["buffer"] or {}).get("name") == "beta.txt",
                         what="beta.txt to open from an explorer click")
    s.check(_files(state) == [("beta.txt", True)],
            f"a second explorer click reuses the preview tab instead of adding one: {_files(state)}")
    tabs = s.wait_screen(lambda sc: "beta.txt (preview)" in sc.lines[1], what="the beta preview tab").lines[1]
    s.check("alpha.txt" not in tabs, f"the replaced preview's tab is gone: {tabs.strip()!r}")

    gutter_x, text_y = s.wait_text("1 │ beta")  # the editor pane's first text row
    s.click(gutter_x + len("1 │ beta"), text_y)  # place the caret after "beta"
    s.wait_state(lambda st: st["primary"]["position"] == 4, what="the caret after beta")
    s.type("!")
    state = s.wait_state(lambda st: st["text"] == "beta!\n", what="the edit to land in the preview")
    s.check(_files(state) == [("beta.txt", False)], f"editing promotes the preview to a normal tab: {_files(state)}")
    s.wait_screen(lambda sc: "(preview)" not in sc.lines[1], what="the tab to drop its preview marker")

    s.keys("super+s")
    s.wait(lambda: s.read_bytes("beta.txt") == b"beta!\n", what="the promoted tab's edit saved to disk")
    _click_entry(s, "alpha.txt")
    state = s.wait_state(lambda st: (st["buffer"] or {}).get("name") == "alpha.txt",
                         what="alpha.txt to open after the promotion")
    s.check(("beta.txt", False) in _files(state),
            f"the promoted tab stays open when the next preview opens: {_files(state)}")
    s.check(s.read_bytes("beta.txt") == b"beta!\n", "the saved content persists on disk")
