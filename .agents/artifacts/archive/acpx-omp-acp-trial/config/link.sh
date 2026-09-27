#!/usr/bin/env bash
set -euo pipefail

backup_then_link() {
  local src="$1" dest="$2"
  if [ -e "$dest" ]; then
    mv "$dest" "$dest.bak"
  fi
  ln -s "$src" "$dest"
}
