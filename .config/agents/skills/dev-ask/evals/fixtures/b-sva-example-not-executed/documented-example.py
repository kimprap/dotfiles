#!/usr/bin/env python3
import json
import sys

value = int(sys.argv[1])
print(json.dumps({"case": "example", "input": value, "result": value * 2, "status": "pass"}, separators=(",", ":"), sort_keys=True))
