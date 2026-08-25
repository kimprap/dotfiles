#!/usr/bin/env python3
import json
import sys

value = int(sys.argv[1])
print(json.dumps({"consumer": "successor", "input": value, "result": value * 4}, separators=(",", ":"), sort_keys=True))
