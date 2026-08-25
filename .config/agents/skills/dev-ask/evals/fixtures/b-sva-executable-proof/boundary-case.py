#!/usr/bin/env python3
import json
import sys

value = int(sys.argv[1])
print(json.dumps({"case": "boundary", "input": value, "result": max(value, 0), "status": "pass"}, separators=(",", ":"), sort_keys=True))
