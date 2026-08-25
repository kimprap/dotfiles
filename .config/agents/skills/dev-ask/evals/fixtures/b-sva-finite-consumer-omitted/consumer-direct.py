#!/usr/bin/env python3
import json
import sys

value = int(sys.argv[1])
print(json.dumps({"consumer": "direct", "input": value, "result": value * 2}, separators=(",", ":"), sort_keys=True))
