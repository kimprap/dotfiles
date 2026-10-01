"""markdown-preview: an unnamed Markdown buffer toggles reversibly between compose and source with
its exact text and markup preserved, while named files keep native compose."""
import re

CASE_ID = "markdown_preview"
REQUIRES = ()

TEXT = "# Heading\n\nSome **bold** text\n\n- item\n"
UNSAVED = "Toggle Unsaved Markdown Preview"
NATIVE = "Markdown: Toggle Compose/Preview"
SEP = "[ \u00b7]"  # whitespace renders as a middle dot
SOURCE_BOLD = re.compile(rf"Some{SEP}\*\*bold\*\*{SEP}text")
COMPOSE_BOLD = re.compile(rf"Some{SEP}bold{SEP}text")
SOURCE_HEADING = re.compile(rf"#{SEP}Heading")


def _palette(s, label):
    s.keys("super+shift+p")
    s.wait_screen(lambda sc: any(line.startswith(">") for line in sc.lines), what="command palette open")
    s.type(label)
    s.wait_screen(lambda sc: sum(label in line for line in sc.lines) >= 2, what=f"palette lists {label!r}")
    s.keys("enter")
    s.wait_screen(lambda sc: not any(line.startswith(">") for line in sc.lines), what="command palette closed")


def _source(screen):
    return SOURCE_BOLD.search(screen.text) is not None and SOURCE_HEADING.search(screen.text) is not None


def _compose(screen):
    return COMPOSE_BOLD.search(screen.text) is not None and SOURCE_BOLD.search(screen.text) is None


def _buffer(st):
    return st["buffer"] or {}


def run(s):
    s.write("notes.md", TEXT)
    s.launch("notes.md")
    named = s.wait_state(lambda st: st["text"] == TEXT, what="notes.md active")
    named_id = _buffer(named)["id"]

    # Setup: an unnamed buffer holding Markdown text, with its language set to Markdown.
    s.action("new")
    new = s.wait_state(lambda st: _buffer(st).get("id") != named_id and not _buffer(st).get("path"),
                       what="unnamed buffer active")
    new_id = _buffer(new)["id"]
    s.paste(TEXT)
    s.wait_state(lambda st: st["text"] == TEXT, what="pasted Markdown text")
    s.action("set_language")
    s.wait_screen(lambda sc: re.search(r"(?m)^\s*Language:", sc.text) is not None, what="language prompt")
    s.type("Markdown")
    s.keys("enter")
    st = s.wait_state(lambda st: _buffer(st).get("language") == "markdown", what="unnamed buffer is Markdown")
    s.check(_buffer(st)["view_mode"] == "source", f"unnamed buffer starts in source: {_buffer(st)}")
    s.wait_screen(_source, what="source markup visible before the toggle")

    _palette(s, UNSAVED)
    st = s.wait_state(lambda st: _buffer(st).get("view_mode") == "compose", what="unnamed buffer in compose")
    s.check(_buffer(st)["id"] == new_id and not _buffer(st)["path"], "compose applied to the unnamed buffer")
    s.check(st["text"] == TEXT, f"compose keeps the exact text: {st['text']!r}")
    s.wait_screen(_compose, what="compose renders **bold** without its markup")

    _palette(s, UNSAVED)
    st = s.wait_state(lambda st: _buffer(st).get("view_mode") == "source", what="unnamed buffer back in source")
    s.check(_buffer(st)["id"] == new_id and not _buffer(st)["path"], "source restored on the unnamed buffer")
    s.check(st["text"] == TEXT, f"source keeps the exact text: {st['text']!r}")
    s.wait_screen(_source, what="source markup restored after the second toggle")

    # Named file: the unsaved-only toggle leaves it alone; native compose works on it.
    s.open("notes.md")
    s.action("focus_editor")
    s.wait_state(lambda st: _buffer(st).get("id") == named_id and st["mode"] == "markdown-source",
                 what="notes.md active in Markdown source mode")
    s.wait_screen(_source, what="notes.md source visible")
    _palette(s, UNSAVED)
    s.sleep(0.3)
    st = s.state()
    s.check(_buffer(st)["id"] == named_id and _buffer(st)["view_mode"] == "source",
            f"the unsaved-only toggle leaves a named file in source: {_buffer(st)}")
    _palette(s, NATIVE)
    st = s.wait_state(lambda st: _buffer(st).get("view_mode") == "compose", what="named file in native compose")
    s.check(_buffer(st)["id"] == named_id and st["text"] == TEXT, "native compose keeps the named file's text")
    s.wait_screen(_compose, what="native compose renders the named file")
    _palette(s, NATIVE)
    s.wait_state(lambda st: _buffer(st).get("view_mode") == "source", what="named file back in source")
    s.wait_screen(_source, what="named file source markup restored")
    s.check(s.read_bytes("notes.md") == TEXT.encode(), "the named file on disk is unchanged")
