#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--state", type=Path, required=True)
    subparsers = parser.add_subparsers(dest="command", required=True)
    set_parser = subparsers.add_parser("set")
    set_parser.add_argument("value")
    subparsers.add_parser("show")
    args = parser.parse_args()
    if args.command == "set":
        args.state.parent.mkdir(parents=True, exist_ok=True)
        args.state.write_text(json.dumps({"value": args.value}, sort_keys=True) + "\n")
        print(f"stored:{args.value}")
        return
    if not args.state.exists():
        raise SystemExit("state-missing")
    print(json.loads(args.state.read_text())["value"])


if __name__ == "__main__":
    main()
