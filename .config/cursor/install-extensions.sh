#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
CLI="${CURSOR_CLI:-cursor}"

if ! command -v "$CLI" &>/dev/null; then
  echo "error: '$CLI' not found; install Cursor or set CURSOR_CLI" >&2
  exit 1
fi

while IFS= read -r ext || [[ -n "$ext" ]]; do
  ext="${ext%%#*}"
  ext="${ext// /}"
  [[ -z "$ext" ]] && continue
  echo "→ $ext"
  "$CLI" --install-extension "$ext"
done < "$ROOT/extensions.txt"

echo "✓ Extensions installed."
