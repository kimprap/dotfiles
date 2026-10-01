"""comment-json-save: toggling a comment round-trips while keeping the caret and selection, even
when toggled twice in quick succession,
saving JSON formats it with Prettier and keeps configured `//` comments, and whitespace and
final-newline preferences survive save."""
import json
import re

CASE_ID = "comment_json_save"
REQUIRES = ("prettier", "node")
TIMEOUT = 120

PY = "    value = 1\n    café = 2\n"   # byte offsets: "value" at 4, "é" at bytes 21-22
LONG = "".join(f"    line_{i:02} = {i:02}\n" for i in range(8))   # 17-byte lines
JSON_IN = '{\n"a":1,\n"b":2\n}\n'
TXT_IN = "keep  \ntrail\t\nlast"


def _caret(st):
    return st["primary"]["position"], st["primary"]["selection"]


def _sel(start, end):
    return {"start": start, "end": end}


def _save(s, rel, predicate, what):
    s.keys("super+s")
    def saved():
        data = s.read_bytes(rel)
        return data if predicate(data) else None
    return s.wait(saved, timeout=20, what=f"saved {rel}: {what}")


def _comment_roundtrip(s):
    # (label, caret setup (start, keys), state before, state while commented)
    variants = [
        ("ASCII caret", 6, (), (6, None), (8, None)),
        ("Unicode caret", 21, (), (21, None), (23, None)),
        ("forward selection", 8, ("shift+right",) * 3, (11, _sel(8, 11)), (13, _sel(10, 13))),
        ("backward selection", 11, ("shift+left",) * 3, (8, _sel(8, 11)), (10, _sel(10, 13))),
        ("two-line selection", 8, ("shift+down",), (23, _sel(8, 23)), (27, _sel(10, 27))),
        ("selection from a line start to the next line start", 0, ("shift+down",), (14, _sel(0, 14)),
         (16, _sel(2, 16))),
    ]
    for label, start, keys, before, commented in variants:
        s.set_cursor(start)
        s.keys(*keys)
        s.wait_state(lambda st: _caret(st) == before, what=f"{label}: setup {before}")
        s.keys("super+/")
        st = s.wait_state(lambda st: st["text"] != PY and _caret(st) == commented,
                          what=f"{label}: commented with caret/selection on the same characters {commented}")
        lines = st["text"].splitlines()
        touched = 2 if label.startswith("two-line") else 1
        s.check(sum(line.lstrip().startswith("#") for line in lines) == touched,
                f"{label}: {touched} line(s) commented: {st['text']!r}")
        s.check(re.sub(r"(?m)^# ", "", st["text"]) == PY, f"{label}: only a '# ' prefix was added: {st['text']!r}")
        s.keys("super+/")
        s.wait_state(lambda st: st["text"] == PY and _caret(st) == before,
                     what=f"{label}: uncomment restores the text and caret/selection {before}")

    # A second Cmd+/ that arrives while the first still restores a long selection.
    s.open("long.py")
    s.action("focus_editor")
    s.wait_state(lambda st: st["text"] == LONG, what="long.py active")
    s.set_cursor(4)
    s.keys(*("shift+down",) * 5)
    s.wait_state(lambda st: _caret(st) == (89, _sel(4, 89)), what="quick toggles: six-line selection")
    s.keys("super+/")
    s.wait_state(lambda st: st["text"] != LONG, what="quick toggles: the first Cmd+/ comments")
    s.sleep(0.2)  # let the first command start restoring the selection
    s.keys("super+/")
    s.wait_state(lambda st: st["text"] == LONG and _caret(st) == (89, _sel(4, 89)),
                 timeout=15, what="quick toggles: the second Cmd+/ restores the text and the six-line selection")


def run(s):
    s.write("code.py", PY)
    s.write("long.py", LONG)
    s.write("data.json", JSON_IN)
    s.write("notes.txt", TXT_IN)
    s.launch("code.py")
    s.wait_state(lambda st: st["text"] == PY, what="code.py active")
    _comment_roundtrip(s)

    s.open("data.json")
    s.action("focus_editor")
    s.wait_state(lambda st: st["text"] == JSON_IN, what="data.json active")
    formatted = _save(s, "data.json", lambda b: b != JSON_IN.encode(), "formatted by Prettier")
    s.check(formatted == b'{\n  "a": 1,\n  "b": 2\n}\n', f"Prettier formatting with 2-space JSON: {formatted!r}")
    s.check(json.loads(formatted) == {"a": 1, "b": 2}, "formatting kept the JSON value")
    s.wait_state(lambda st: st["text"].encode() == formatted, what="buffer shows the formatted text")

    s.set_cursor(formatted.index(b'"b"'))
    s.keys("super+/")
    s.wait_state(lambda st: re.search(r'(?m)^\s*//\s*"b": 2$', st["text"]) is not None,
                 what='Cmd+/ comments the "b" line with //')
    commented = _save(s, "data.json", lambda b: b"//" in b and b != formatted, "comment kept")
    s.check(re.search(rb'(?m)^\s*//\s*"b": 2$', commented) is not None,
            f'saved JSON keeps the // comment line: {commented!r}')
    s.check(re.search(rb'(?m)^ +"a": 1,?$', commented) is not None,
            f"saved commented JSON is still formatted: {commented!r}")

    s.open("notes.txt")
    s.action("focus_editor")
    s.wait_state(lambda st: st["text"] == TXT_IN, what="notes.txt active")
    s.type("x")
    saved = _save(s, "notes.txt", lambda b: b != TXT_IN.encode(), "on-save whitespace cleanup")
    s.check(saved == b"xkeep\ntrail\nlast\n",
            f"save trims trailing whitespace and ensures a final newline: {saved!r}")
