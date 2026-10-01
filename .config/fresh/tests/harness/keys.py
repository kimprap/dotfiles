"""Key and mouse encoder for Fresh under a PTY.

Fresh requests kitty keyboard flags 5 (disambiguate + alternate keys), so
modified keys are sent as CSI-u (`ESC [ code ; mods u`), cursor/function keys in
their legacy `ESC [ 1 ; mods X` / `ESC [ n ; mods ~` forms, and text as UTF-8.
Mouse events use SGR (`ESC [ < b ; x ; y M|m`), with 0-based screen cells.
"""
from __future__ import annotations

MODIFIERS = {"shift": 1, "alt": 2, "option": 2, "opt": 2, "ctrl": 4, "control": 4,
             "super": 8, "cmd": 8, "command": 8, "hyper": 16, "meta": 32}

# name -> (unmodified bytes, CSI-u code or None, legacy final/tilde number or None)
_LETTER_FINAL = {"up": "A", "down": "B", "right": "C", "left": "D", "home": "H", "end": "F"}
_SS3_FINAL = {"f1": "P", "f2": "Q", "f3": "R", "f4": "S"}
_TILDE = {"insert": 2, "delete": 3, "pageup": 5, "pagedown": 6, "f5": 15, "f6": 17,
          "f7": 18, "f8": 19, "f9": 20, "f10": 21, "f11": 23, "f12": 24}
_CSI_U = {"enter": (b"\r", 13), "return": (b"\r", 13), "tab": (b"\t", 9),
          "backspace": (b"\x7f", 127), "escape": (b"\x1b[27u", 27), "esc": (b"\x1b[27u", 27),
          "space": (b" ", 32)}
_ALIASES = {"pgup": "pageup", "pgdn": "pagedown", "del": "delete", "ins": "insert",
            "plus": "+", "minus": "-"}


def _split(spec: str) -> tuple[list[str], str]:
    if spec.endswith("++"):
        return [m for m in spec[:-2].split("+") if m], "+"
    parts = spec.split("+")
    return parts[:-1], parts[-1]


def encode(spec: str) -> bytes:
    """Encode one keystroke such as `super+shift+t`, `ctrl+alt+up`, `enter` or `a`."""
    mods, key = _split(spec)
    mask = 0
    for mod in mods:
        try:
            mask |= MODIFIERS[mod.lower()]
        except KeyError:
            raise ValueError(f"unknown modifier {mod!r} in key {spec!r}") from None
    name = _ALIASES.get(key.lower(), key.lower()) if len(key) > 1 else key
    m = 1 + mask
    if name in _LETTER_FINAL:
        final = _LETTER_FINAL[name]
        return f"\x1b[{final}".encode() if not mask else f"\x1b[1;{m}{final}".encode()
    if name in _SS3_FINAL:
        final = _SS3_FINAL[name]
        return f"\x1bO{final}".encode() if not mask else f"\x1b[1;{m}{final}".encode()
    if name in _TILDE:
        number = _TILDE[name]
        return f"\x1b[{number}~".encode() if not mask else f"\x1b[{number};{m}~".encode()
    if name in _CSI_U:
        plain, code = _CSI_U[name]
        if not mask:
            return plain
        if name == "tab" and mask == MODIFIERS["shift"]:
            return b"\x1b[Z"
        return f"\x1b[{code};{m}u".encode()
    if len(name) != 1:
        raise ValueError(f"unknown key {key!r} in {spec!r}")
    if not mask:
        return name.encode()
    if mask == MODIFIERS["shift"] and name.isalpha():
        return name.upper().encode()
    code = ord(name.lower()) if name.isalpha() else ord(name)
    return f"\x1b[{code};{m}u".encode()


_BUTTONS = {"left": 0, "middle": 1, "right": 2, "scroll_up": 64, "scroll_down": 65}
_MOUSE_MODS = {"shift": 4, "alt": 8, "ctrl": 16}


def mouse(kind: str, col: int, row: int, button: str = "left", mods: tuple[str, ...] = ()) -> bytes:
    """Encode an SGR mouse event; `kind` is `click` (press), `release` or `drag`."""
    if kind not in ("click", "press", "release", "drag"):
        raise ValueError(f"unknown mouse event {kind!r}")
    code = _BUTTONS[button] + sum(_MOUSE_MODS[m] for m in mods)
    if kind == "drag":
        code += 32
    final = "m" if kind == "release" else "M"
    return f"\x1b[<{code};{col + 1};{row + 1}{final}".encode()


def paste(text: str) -> bytes:
    """Bracketed paste of `text`."""
    return b"\x1b[200~" + text.encode() + b"\x1b[201~"
