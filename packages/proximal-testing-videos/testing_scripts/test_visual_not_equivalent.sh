#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $(basename "$0") <video_a> <video_b>" >&2
  exit 2
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
EQUIV="$SCRIPT_DIR/test_visual_equivalence.sh"

if [[ ! -x "$EQUIV" ]]; then
  echo "Error: test_visual_equivalence.sh not found or not executable at $EQUIV" >&2
  exit 2
fi

video_a="$1"
video_b="$2"

# Expect videos to be visually different; invert the equivalence test result
if "$EQUIV" "$video_a" "$video_b" >/dev/null 2>&1; then
  echo "Videos are unexpectedly equivalent (should differ)" >&2
  exit 1
else
  echo "Videos differ as expected" >&2
  exit 0
fi

