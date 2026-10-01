"""python-nav: basedpyright go-to-definition and references work, and the configured language and
indentation rules apply, including shell filenames and `*.env` detection."""
import re
import time

CASE_ID = "python_nav"
REQUIRES = ("basedpyright-langserver",)
TIMEOUT = 120

SOURCE = "def target(value):\n    return value + 1\n\nresult = target(41)\n"
CALL = SOURCE.index("target(41)") + 2  # caret inside the call's name
DEFINITION = SOURCE.index("target")    # 4

# file -> (detected language, what Tab inserts at column 0)
FILES = {
    ".zshrc": ("bash", "  "),
    ".bashrc": ("bash", "  "),
    ".profile": ("bash", "  "),
    "prod.env": ("bash", "  "),
    "Makefile": ("makefile", "\t"),
    "config.yml": ("yaml", "  "),
    "main.rs": ("rust", "    "),
    "app.ts": ("typescript", "    "),
    "app.js": ("javascript", "    "),
    "data.json": ("json", "    "),
    "tool.py": ("python", "    "),
    "notes.txt": ("text", "  "),
}


def run(s):
    s.write("nav.py", SOURCE)
    for name in FILES:
        s.write(name, "x\n")
    s.launch("nav.py")
    s.wait_state(lambda st: st["text"] == SOURCE, what="nav.py active")

    # Go to definition (F12): retry the gesture until basedpyright has started, bounded.
    deadline = time.monotonic() + 60
    while True:
        s.set_cursor(CALL)
        s.keys("f12")
        try:
            s.wait_state(lambda st: st["primary"]["position"] == DEFINITION, timeout=3,
                         what="F12 jumps to the definition")
            break
        except AssertionError:
            if time.monotonic() > deadline:
                raise AssertionError("F12 did not reach the definition of target within 60s (basedpyright)")
    st = s.state()
    s.check(st["text"] == SOURCE and (st["buffer"] or {}).get("name") == "nav.py",
            "definition is in nav.py and the text is unchanged")

    # Find references (Shift+F12) lists the definition and the call.
    s.set_cursor(DEFINITION + 2)
    s.keys("shift+f12")
    s.wait_screen(lambda sc: re.search(r"References to 'target' \(2\)", sc.text) is not None
                  and re.search(r"nav\.py:1\b", sc.text) is not None
                  and re.search(r"nav\.py:4\b", sc.text) is not None,
                  timeout=30, what="references panel lists nav.py:1 and nav.py:4")
    s.keys("escape")

    for name, (language, indent) in FILES.items():
        s.open(name)
        s.action("focus_editor")
        st = s.wait_state(lambda st: (st["buffer"] or {}).get("name") == name, what=f"{name} active")
        s.check(st["buffer"]["language"] == language,
                f"{name} is detected as {language}, got {st['buffer']['language']!r}")
        s.set_cursor(0)
        s.keys("tab")
        s.wait_state(lambda st: st["text"] == indent + "x\n",
                     what=f"Tab in {name} ({language}) inserts {indent!r}")
