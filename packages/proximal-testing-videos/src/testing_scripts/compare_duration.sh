#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <gold.mp4> <test.mp4> [tolerance_seconds]" >&2
  exit 2
fi

GOLD="$1"
TEST="$2"
TOL="${3:-0.02}"

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe not found in PATH" >&2
  exit 2
fi

get_duration() {
  ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$1"
}

D1=$(get_duration "$GOLD")
D2=$(get_duration "$TEST")

if [ -z "$D1" ] || [ -z "$D2" ]; then
  echo "Failed to read durations" >&2
  exit 2
fi

DIFF=$(awk -v a="$D1" -v b="$D2" 'BEGIN{d=a-b; if(d<0)d=-d; print d}')
echo "Durations: gold=$D1, test=$D2, diff=$DIFF (tol=$TOL)"

awk -v d="$DIFF" -v t="$TOL" 'BEGIN{exit !(d<=t)}'

