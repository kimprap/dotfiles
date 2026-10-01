"""terminal-focus: Cmd+J focuses an existing terminal and never creates one.

With no terminal, Cmd+J leaves the layout, buffers and file text unchanged. With a
dock terminal opened (Cmd+Shift+C) and focus back in the editor, Cmd+J focuses
the terminal: a shell command typed next writes a proof file, and the editor text
is untouched. In the terminal, the doubled Cmd+Ctrl+Shift letters (terminal resize
keys) do not act as the editor tab-move chord: every pane keeps its buffer.
"""
import shlex

CASE_ID = "terminal_focus"
REQUIRES = ()


def _active(state):
    panes = [p for p in state["panes"] if p["active"]]
    assert len(panes) == 1, f"expected one active pane: {state['panes']}"
    return panes[0]


def _membership(state):
    return sorted((p["splitId"], p["bufferId"], p["kind"]) for p in state["panes"])


def run(s):
    s.write("plain.txt", "plain\n")
    s.commit()
    s.launch("plain.txt")
    before = s.state()

    s.keys("super+j")
    s.sleep(0.5)  # a no-op has no event to wait for; give a wrongly created terminal time to appear
    after = s.state()
    s.check(not any(b["is_terminal"] for b in after["buffers"]), "Cmd+J created a terminal when none existed")
    s.check(_membership(after) == _membership(before), "Cmd+J changed the pane layout with no terminal")
    s.check(after["text"] == "plain\n" and after["buffer"]["name"] == "plain.txt",
            f"Cmd+J with no terminal changed the editor: {after['buffer']['name']} {after['text']!r}")

    s.keys("super+shift+c")
    s.wait_state(lambda st: any(p["kind"] == "terminal" for p in st["panes"]), what="dock terminal (setup)")
    s.keys("super+shift+h")  # previous split: back to the editor
    s.wait_state(lambda st: _active(st)["kind"] == "file", what="editor focused again (setup)")

    s.keys("super+j")
    state = s.wait_state(lambda st: _active(st)["kind"] == "terminal" and st["buffer"]["is_terminal"],
                         what="Cmd+J to focus the existing terminal")
    s.check(sum(b["is_terminal"] for b in state["buffers"]) == 1, "Cmd+J created a second terminal")
    s.wait_screen(lambda sc: "$" in sc.text, what="shell prompt")
    proof = s.path("terminal-proof.txt")
    s.type(f"printf terminal-ok > {shlex.quote(str(proof))}\n")
    s.wait(lambda: proof.exists() and proof.read_text() == "terminal-ok", timeout=10,
           what="the focused terminal's shell to write terminal-proof.txt")

    layout = _membership(s.state())
    for letter in ("l", "j"):
        s.keys(f"ctrl+shift+super+{letter}", f"ctrl+shift+super+{letter}")
        s.sleep(0.3)  # the tab-move chord must not fire; nothing to wait for
        now = s.state()
        s.check(_membership(now) == layout,
                f"Cmd+Ctrl+Shift+{letter.upper()} twice in the terminal moved a tab: {now['panes']}")
        s.check(_active(now)["kind"] == "terminal", "terminal resize keys moved focus out of the terminal")

    s.keys("super+shift+h")
    editor = s.wait_state(lambda st: _active(st)["kind"] == "file", what="editor focused again")
    s.check(editor["text"] == "plain\n" and not editor["buffer"]["modified"],
            f"terminal input reached the editor: {editor['text']!r}")
    s.check(s.read_bytes("plain.txt") == b"plain\n", "plain.txt changed on disk")
