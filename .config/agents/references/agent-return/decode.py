#!/usr/bin/env python3
"""Pure declared-body decoder. No I/O, workflow, or native mechanics.

Encoding is chosen before delivery. This module never tries a second
interpretation to make a payload validate.
"""

from __future__ import annotations

DECLARED = frozenset(("text", "response_object"))
_RIVALS = ("data", "body", "text", "message", "content", "payload")


class _DuplicateMembers(ValueError):
    pass


def _unique_object(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            raise _DuplicateMembers(key)
        obj[key] = value
    return obj


def decode(declared, value):
    if declared not in DECLARED:
        return {"ok": False, "reason": "undeclared_encoding"}
    if declared == "text":
        if type(value) is not str:
            return {"ok": False, "reason": "non_string_body"}
        return {"ok": True, "body": value, "declared": "text"}
    if type(value) is not dict:
        return {"ok": False, "reason": "non_object_carrier"}
    if any(not isinstance(k, str) for k in value):
        return {"ok": False, "reason": "non_object_carrier"}
    if "response" in value and any(k != "response" for k in value):
        return {"ok": False, "reason": "competing_payload_fields"}
    nested = _nested_or_ambiguous(value)
    if nested:
        return {"ok": False, "reason": nested}
    if set(value) != {"response"}:
        return {"ok": False, "reason": "undeclared_payload_fields"}
    body = value["response"]
    if type(body) is not str:
        return {"ok": False, "reason": "non_string_body"}
    return {"ok": True, "body": body, "declared": "response_object"}


def _nested_or_ambiguous(value):
    if type(value) is not dict:
        return None
    if "response" in value and type(value["response"]) is dict:
        return "nested_carrier"
    rivals = [k for k in _RIVALS if k in value]
    if rivals:
        return "ambiguous_carrier"
    return None


def main(argv=None):
    import argparse
    import json
    import sys

    parser = argparse.ArgumentParser(description="Decode one declared body.")
    parser.add_argument(
        "--declared",
        required=True,
        help="Encoding chosen before delivery: text or response_object",
    )
    parser.add_argument(
        "value",
        nargs="?",
        help="Body text or JSON object; omit to read stdin exactly",
    )
    args = parser.parse_args(argv)
    if args.value is None:
        raw = sys.stdin.buffer.read()
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError:
            result = {"ok": False, "reason": "non_string_body"}
            json.dump(result, sys.stdout, ensure_ascii=False)
            sys.stdout.write("\n")
            return 1
    else:
        text = args.value
    if args.declared == "response_object":
        try:
            carrier = json.loads(text, object_pairs_hook=_unique_object)
        except json.JSONDecodeError:
            result = {"ok": False, "reason": "non_object_carrier"}
        except _DuplicateMembers:
            result = {"ok": False, "reason": "competing_payload_fields"}
        else:
            result = decode("response_object", carrier)
    else:
        result = decode(args.declared, text)
    json.dump(result, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
