#!/usr/bin/env python3
"""Decoder contract: exact accepted text or explicit rejection."""

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("decode.py")
SPEC = importlib.util.spec_from_file_location("agent_return_decode", SCRIPT)
assert SPEC and SPEC.loader
decode_mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(decode_mod)
decode = decode_mod.decode


class DeclaredBodyTests(unittest.TestCase):
    def test_text_preserves_unicode_quotes_and_crlf(self) -> None:
        body = 'He said “café” and "hi"\r\nnext'
        result = decode("text", body)
        self.assertEqual(result, {"ok": True, "body": body, "declared": "text"})

    def test_text_keeps_json_looking_literal(self) -> None:
        body = '{"response": "not a carrier"}\n'
        result = decode("text", body)
        self.assertEqual(result["ok"], True)
        self.assertEqual(result["body"], body)

    def test_response_object_preserves_exact_string(self) -> None:
        body = "VALID\nReviewer: A\nPass: initial\n"
        result = decode("response_object", {"response": body})
        self.assertEqual(
            result,
            {"ok": True, "body": body, "declared": "response_object"},
        )

    def test_wrong_declaration_is_not_reinterpreted(self) -> None:
        text_as_object = decode("response_object", "Ready: reviewer A")
        object_as_text = decode("text", {"response": "Ready: reviewer A"})
        unknown = decode("json", {"response": "Ready: reviewer A"})
        self.assertEqual(text_as_object["reason"], "non_object_carrier")
        self.assertEqual(object_as_text["reason"], "non_string_body")
        self.assertEqual(unknown["reason"], "undeclared_encoding")
        self.assertFalse(text_as_object["ok"] or object_as_text["ok"] or unknown["ok"])

    def test_object_rejects_extra_nested_missing_and_non_string(self) -> None:
        cases = [
            ({"response": "ok", "note": "x"}, "competing_payload_fields"),
            ({"response": {"response": "ok"}}, "nested_carrier"),
            ({"text": "ok"}, "ambiguous_carrier"),
            ({}, "undeclared_payload_fields"),
            ({"response": ["ok"]}, "non_string_body"),
            (["ok"], "non_object_carrier"),
        ]
        for value, reason in cases:
            with self.subTest(reason=reason):
                result = decode("response_object", value)
                self.assertEqual(result, {"ok": False, "reason": reason})

    def test_cli_text_and_object_and_rejection(self) -> None:
        text = 'line\r\n{"x": 1}'
        ok_text = subprocess.run(
            [sys.executable, str(SCRIPT), "--declared", "text"],
            input=text.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertEqual(ok_text.returncode, 0)
        self.assertEqual(ok_text.stderr, b"")
        self.assertEqual(
            json.loads(ok_text.stdout.decode("utf-8")),
            {"ok": True, "body": text, "declared": "text"},
        )
        payload = json.dumps({"response": text}, ensure_ascii=False)
        ok_obj = subprocess.run(
            [sys.executable, str(SCRIPT), "--declared", "response_object"],
            input=payload.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertEqual(ok_obj.returncode, 0)
        self.assertEqual(
            json.loads(ok_obj.stdout.decode("utf-8"))["body"],
            text,
        )
        wrong = subprocess.run(
            [sys.executable, str(SCRIPT), "--declared", "response_object"],
            input=text.encode("utf-8"),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertNotEqual(wrong.returncode, 0)
        self.assertEqual(
            json.loads(wrong.stdout.decode("utf-8")),
            {"ok": False, "reason": "non_object_carrier"},
        )
        dup = subprocess.run(
            [
                sys.executable,
                str(SCRIPT),
                "--declared",
                "response_object",
                '{"response":"first","response":"second"}',
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
        self.assertNotEqual(dup.returncode, 0)
        self.assertEqual(dup.stderr, b"")
        dup_out = json.loads(dup.stdout.decode("utf-8"))
        self.assertEqual(
            dup_out,
            {"ok": False, "reason": "competing_payload_fields"},
        )
        self.assertNotIn("body", dup_out)


if __name__ == "__main__":
    unittest.main()
