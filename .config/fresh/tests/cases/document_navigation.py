"""document-navigation: Cmd+Up/Down reach the document bounds, Cmd+Shift+Up/Down select to
them and Cmd+Left stays smart Home, in plain text and Markdown source."""
CASE_ID = "document_navigation"
REQUIRES = ()

# Line 2 of each file is indented by four spaces; MID is a byte offset inside its text.
FILES = {
    "plain.txt": ("alpha\n    bravo words\ncharlie\n", 6, 13),
    "notes.md": ("# Title\n\n    indented words\n- item\n", 9, 16),
}


def _caret(st):
    return st["primary"]["position"], st["primary"]["selection"]


def run(s):
    for name, (text, _, _) in FILES.items():
        s.write(name, text)
    s.launch("plain.txt")
    for name, (text, line_start, mid) in FILES.items():
        s.open(name)
        s.action("focus_editor")
        st = s.wait_state(lambda st: (st["buffer"] or {}).get("name") == name and st["text"] == text,
                          what=f"{name} active")
        if name.endswith(".md"):
            s.check(st["mode"] == "markdown-source", f"{name} opens in Markdown source mode: {st['mode']!r}")
        end = len(text.encode())
        first = line_start + 4

        s.set_cursor(mid)
        s.keys("super+down")
        st = s.wait_state(lambda st: _caret(st) == (end, None), what=f"{name}: Cmd+Down to document end")
        s.set_cursor(mid)
        s.keys("super+up")
        s.wait_state(lambda st: _caret(st) == (0, None), what=f"{name}: Cmd+Up to document start")

        s.set_cursor(mid)
        s.keys("super+shift+down")
        st = s.wait_state(lambda st: _caret(st) == (end, {"start": mid, "end": end}),
                          what=f"{name}: Cmd+Shift+Down selects to document end")
        s.check(st["selected"] == [text.encode()[mid:].decode()], f"{name}: selection text {st['selected']!r}")
        s.keys("left")
        st = s.wait_state(lambda st: _caret(st) == (mid, None),
                          what=f"{name}: Left collapses the selection to its start")
        line = st["primary"]["line"]
        s.keys("down")
        s.wait_state(lambda st: st["primary"]["line"] == line + 1 and st["primary"]["selection"] is None,
                     what=f"{name}: plain Down then moves one line")

        s.set_cursor(mid)
        s.keys("super+shift+up")
        st = s.wait_state(lambda st: _caret(st) == (0, {"start": 0, "end": mid}),
                          what=f"{name}: Cmd+Shift+Up selects to document start")
        s.keys("right")
        s.wait_state(lambda st: _caret(st) == (mid, None),
                     what=f"{name}: Right collapses the selection to its end")

        s.set_cursor(mid)
        s.keys("super+left")
        s.wait_state(lambda st: _caret(st) == (first, None),
                     what=f"{name}: Cmd+Left goes to the first non-blank character")
        s.keys("super+left")
        s.wait_state(lambda st: _caret(st) == (line_start, None),
                     what=f"{name}: second Cmd+Left goes to column 0")
        s.keys("super+left")
        s.wait_state(lambda st: _caret(st) == (first, None),
                     what=f"{name}: third Cmd+Left returns to the first non-blank character")
        s.check(s.state()["text"] == text, f"{name}: navigation left the text unchanged")
