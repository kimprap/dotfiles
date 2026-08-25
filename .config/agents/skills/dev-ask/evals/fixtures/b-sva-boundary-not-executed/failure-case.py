#!/usr/bin/env python3
import json
import sys

value = int(sys.argv[1])
if value >= 0:
    print(json.dumps({"case": "failure", "error": "expected-negative-input", "input": value}, separators=(",", ":"), sort_keys=True))
    raise SystemExit(1)
print(json.dumps({"case": "failure", "error": "negative-input", "input": value}, separators=(",", ":"), sort_keys=True))
raise SystemExit(2)
