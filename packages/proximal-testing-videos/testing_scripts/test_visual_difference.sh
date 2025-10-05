#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $(basename "$0") <video_a> <video_b>" >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if "$SCRIPT_DIR/test_visual_equivalence.sh" "$1" "$2" >/dev/null 2>&1; then
  echo "Videos are visually equivalent but expected a difference" >&2
  exit 1
else
  echo "Videos differ visually as expected" >&2
  exit 0
fi

