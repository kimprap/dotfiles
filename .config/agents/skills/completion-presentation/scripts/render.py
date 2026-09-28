#!/usr/bin/env python3
"""Render one five-field completion input from stdin as the completed report.

The input format is owned by .config/agents/references/completion-presentation-input.md.
This script checks only that format; the caller owns success and every value.
Valid input prints the five H2 sections and exits 0. Invalid input prints
nothing and exits 1.
"""

from __future__ import annotations

import json
import re
import sys
import unicodedata

KEYS = ("Outcome", "Changes", "Checks", "Risks", "Next")
SCALAR_KEYS = {"Outcome", "Next"}
PAPERCUT_RE = re.compile(r"Papercut: \S")
PAPERCUT_NONE = "Papercut: none"
REJECTED_CATEGORIES = {"Cc", "Cs", "Zl", "Zp"}
LEARNING_RE = re.compile(
    r"Learning: (?:curated|no durable learning|skipped for compact|blocked \S(?:.*\S)?)\Z"
)
PLAN_RE = re.compile(r"Plan: (\S+) — DONE\Z")


class InvalidInput(Exception):
    """The input does not match the canonical format."""


def reject_duplicates(pairs: list[tuple[str, object]]) -> dict[str, object]:
    keys = [key for key, _ in pairs]
    if len(keys) != len(set(keys)):
        raise InvalidInput("duplicate key")
    return dict(pairs)


def check_string(value: object) -> str:
    if not isinstance(value, str) or not value.strip():
        raise InvalidInput("value is not a nonempty string")
    for char in value:
        if unicodedata.category(char) in REJECTED_CATEGORIES:
            raise InvalidInput("value is multi-line or has a control character")
    return value


def check_list(value: object) -> list[str]:
    if not isinstance(value, list) or not value:
        raise InvalidInput("value is not a nonempty array")
    return [check_string(item) for item in value]


def check_checks(lines: list[str]) -> None:
    papercuts = [line for line in lines if line.startswith("Papercut:")]
    if not papercuts or not all(PAPERCUT_RE.match(line) for line in papercuts):
        raise InvalidInput("Checks needs nonempty Papercut lines")
    if PAPERCUT_NONE in papercuts and len(papercuts) > 1:
        raise InvalidInput("Papercut: none mixed with other Papercut lines")
    learning = [line for line in lines if line.startswith("Learning:")]
    if len(learning) != 1 or not LEARNING_RE.match(learning[0]):
        raise InvalidInput("Checks needs exactly one valid Learning line")
    for line in lines:
        if not line.startswith("Plan:"):
            continue
        match = PLAN_RE.match(line)
        if not match or "archive" in match.group(1).split("/"):
            raise InvalidInput("Plan line is not an active plan path marked DONE")


def parse(text: str) -> dict[str, list[str]]:
    """Return each field as its ordered list of report lines."""
    try:
        data = json.loads(text, object_pairs_hook=reject_duplicates)
    except (ValueError, RecursionError) as error:
        raise InvalidInput("malformed JSON") from error
    if not isinstance(data, dict) or tuple(data) != KEYS:
        raise InvalidInput("keys are not exactly the five fields in order")
    fields = {
        key: [check_string(data[key])] if key in SCALAR_KEYS else check_list(data[key])
        for key in KEYS
    }
    check_checks(fields["Checks"])
    return fields


def render(fields: dict[str, list[str]]) -> str:
    return "\n\n".join(
        f"## {key}\n\n" + "\n".join(f"- {item}" for item in fields[key]) for key in KEYS
    )


def main() -> int:
    try:
        text = sys.stdin.buffer.read().decode("utf-8")
        report = render(parse(text))
    except (InvalidInput, UnicodeDecodeError):
        return 1
    sys.stdout.buffer.write(report.encode("utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
