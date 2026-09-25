#!/usr/bin/env bash
set -euo pipefail

case "$1" in
  .config/*|bin|manifest|README.md) exit 0 ;;
  *) exit 1 ;;
esac
