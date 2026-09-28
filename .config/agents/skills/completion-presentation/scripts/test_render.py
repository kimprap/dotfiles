#!/usr/bin/env python3
"""Contract tests for the completion report render script."""

from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "render.py"

VALID = {
    "Outcome": "The lean workflow migration is complete.",
    "Changes": ["Simplified routing.", "Updated focused semantic evals."],
    "Checks": [
        "AC-5 through AC-9: VERIFIED",
        "Plan: .agents/plans/2026-09-05-0049_lean-dev-workflow.md — DONE",
        "Papercut: pc-0000000000000100 recorded",
        "Papercut: report-only — workflow boundary",
        "Learning: curated",
    ],
    "Risks": ["none"],
    "Next": "none",
}

EXPECTED = """## Outcome

- The lean workflow migration is complete.

## Changes

- Simplified routing.
- Updated focused semantic evals.

## Checks

- AC-5 through AC-9: VERIFIED
- Plan: .agents/plans/2026-09-05-0049_lean-dev-workflow.md — DONE
- Papercut: pc-0000000000000100 recorded
- Papercut: report-only — workflow boundary
- Learning: curated

## Risks

- none

## Next

- none"""


def run(stdin: bytes) -> subprocess.CompletedProcess[bytes]:
    return subprocess.run(
        [sys.executable, str(SCRIPT)], input=stdin, capture_output=True, check=False
    )


def encode(**changes: object) -> bytes:
    return json.dumps({**VALID, **changes}, ensure_ascii=False).encode("utf-8")


def with_checks(*lines: str) -> bytes:
    return encode(Checks=list(lines))


class RenderTests(unittest.TestCase):
    def test_valid_input_renders_exact_report(self) -> None:
        result = run(encode())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.decode("utf-8"), EXPECTED)

    def test_invalid_input_prints_nothing_and_fails(self) -> None:
        keys = list(VALID)
        cases = {
            "empty stdin": b"",
            "malformed JSON": b'{"Outcome": ',
            "excessive nesting": b"[" * 1_000_000 + b"]" * 1_000_000,
            "duplicate key": b'{"Outcome": "a", ' + encode()[1:],
            "missing key": json.dumps({k: VALID[k] for k in keys[:-1]}).encode(),
            "extra key": encode(Status="done"),
            "reordered keys": json.dumps({k: VALID[k] for k in reversed(keys)}).encode(),
            "scalar array field": encode(Changes="one change"),
            "nested value": encode(Changes=[["one change"]]),
            "empty array": encode(Risks=[]),
            "empty string": encode(Outcome=""),
            "multi-line string": encode(Next="line one\nline two"),
            "terminal escape": encode(Outcome="done \x1b[31mred"),
            "lone surrogate": json.dumps({**VALID, "Outcome": "done \ud800"}).encode(),
            "no Papercut line": with_checks("check: PASS", "Learning: curated"),
            "empty Papercut result": with_checks("Papercut: ", "Learning: curated"),
            "Papercut none mixed": with_checks(
                "Papercut: none", "Papercut: pc-1 recorded", "Learning: curated"
            ),
            "no Learning line": with_checks("Papercut: none"),
            "two Learning lines": with_checks(
                "Papercut: none", "Learning: curated", "Learning: skipped for compact"
            ),
            "unknown Learning wording": with_checks("Papercut: none", "Learning: done"),
            "archived plan": with_checks(
                "Plan: .agents/plans/archive/x.md — DONE",
                "Papercut: none",
                "Learning: curated",
            ),
        }
        for name, stdin in cases.items():
            with self.subTest(name):
                result = run(stdin)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(result.stdout, b"")
                self.assertEqual(result.stderr, b"")


if __name__ == "__main__":
    unittest.main()
