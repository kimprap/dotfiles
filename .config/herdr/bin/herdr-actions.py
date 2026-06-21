#!/usr/bin/env python3
"""Herdr helper commands for pane and tab workflows."""

from __future__ import annotations

import json
import subprocess
import sys
from collections.abc import Callable

Command = Callable[[], int]


def herdr(*args: str) -> dict:
    output = subprocess.check_output(["herdr", *args], text=True)
    return json.loads(output)


def herdr_call(*args: str) -> None:
    subprocess.check_call(["herdr", *args], stdout=subprocess.DEVNULL)


def current_pane() -> dict:
    return herdr("pane", "current", "--current")["result"]["pane"]


def current_process_info() -> dict:
    return herdr("pane", "process-info", "--current")["result"]["process_info"]


def renumber_current_tab() -> None:
    layout = herdr("pane", "layout", "--current")["result"]["layout"]
    panes = layout.get("panes", [])

    # Herdr returns layout panes in visual order for the current tab.
    for index, pane in enumerate(panes, start=1):
        herdr_call("pane", "rename", pane["pane_id"], str(index))


def split(direction: str) -> None:
    if direction not in {"right", "down"}:
        raise SystemExit(f"invalid split direction: {direction}")

    source = current_pane()["pane_id"]
    herdr_call("pane", "split", source, "--direction", direction, "--focus")
    renumber_current_tab()


def new_tab() -> None:
    herdr_call("tab", "create", "--focus")
    renumber_current_tab()


def confirm_close_current_pane() -> bool:
    pane = current_pane()
    process_info = current_process_info()
    processes = process_info.get("foreground_processes", [])
    process = processes[0].get("cmdline") if processes else None

    pane_label = pane.get("label") or pane["pane_id"]
    prompt = f"Close pane {pane_label}?"
    if process:
        prompt = f"Close pane {pane_label} running {process}?"

    script = f"""
    display dialog {json.dumps(prompt)} with title "Herdr" buttons {{"Cancel", "Close"}} default button "Close" cancel button "Cancel"
    """
    result = subprocess.run(
        ["osascript", "-e", script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    return result.returncode == 0


def close_current_pane() -> None:
    target = current_pane()["pane_id"]
    herdr_call("pane", "close", target)

    # Closing the last pane can remove the current tab/workspace.
    try:
        renumber_current_tab()
    except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
        pass


def run_renumber() -> int:
    renumber_current_tab()
    return 0


def run_new_tab() -> int:
    new_tab()
    return 0


def run_close() -> int:
    if confirm_close_current_pane():
        close_current_pane()
    return 0


def run_split_right() -> int:
    split("right")
    return 0


def run_split_down() -> int:
    split("down")
    return 0


COMMANDS: dict[tuple[str, ...], Command] = {
    ("renumber",): run_renumber,
    ("new-tab",): run_new_tab,
    ("close",): run_close,
    ("split", "right"): run_split_right,
    ("split", "down"): run_split_down,
}


def main(argv: list[str]) -> int:
    command = COMMANDS.get(tuple(argv))
    if command is not None:
        return command()

    print(
        "usage: herdr-actions.py renumber | new-tab | close | split right|down",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

