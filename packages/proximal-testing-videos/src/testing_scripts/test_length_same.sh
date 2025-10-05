#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <gold.mp4> <candidate.mp4> [max_diff_seconds]" >&2
  exit 2
fi

GOLD="$1"
CAND="$2"
MAX_DIFF="${3:-0.05}"

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe is required" >&2
  exit 3
fi

dur() {
  ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1"
}

DG=$(dur "$GOLD")
DC=$(dur "$CAND")

DIFF=$(awk -v a="$DG" -v b="$DC" 'BEGIN {d=a-b; if(d<0)d=-d; print d}')
echo "Duration gold: $DG s, candidate: $DC s, diff: $DIFF s (max: $MAX_DIFF s)"

awk -v diff="$DIFF" -v max="$MAX_DIFF" 'BEGIN {exit !(diff+0 <= max+0)}' || {
  echo "Duration mismatch: $DIFF > $MAX_DIFF" >&2
  exit 1
}

