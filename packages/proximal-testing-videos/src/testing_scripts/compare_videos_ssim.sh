#!/usr/bin/env bash
set -euo pipefail

# compare_videos_ssim.sh <expectation> <video_a> <video_b>
# expectation: "equal" or "diff"

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <equal|diff> <video_a> <video_b>" >&2
  exit 2
fi

EXPECTATION="$1"; shift
A="$1"; shift
B="$1"; shift

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found in PATH" >&2
  exit 3
fi

# Ensure same duration to rule out trivial differences
dur() { ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$1"; }

DA=$(dur "$A" | awk '{printf("%.3f\n", $1)}')
DB=$(dur "$B" | awk '{printf("%.3f\n", $1)}')

if [[ "$DA" != "$DB" ]]; then
  echo "Duration mismatch: $A=$DA vs $B=$DB" >&2
  if [[ "$EXPECTATION" == "diff" ]]; then
    exit 0
  else
    exit 1
  fi
fi

OUT=$(ffmpeg -v error -i "$A" -i "$B" -lavfi ssim -f null - 2>&1 || true)
SSIM=$(echo "$OUT" | awk -F'=' '/All:/ {print $2}')

if [[ -z "${SSIM:-}" ]]; then
  echo "Failed to compute SSIM" >&2
  exit 4
fi

echo "SSIM(All)=$SSIM"

threshold_equal=0.9999

if [[ "$EXPECTATION" == "equal" ]]; then
  awk -v s="$SSIM" -v t="$threshold_equal" 'BEGIN { exit (s+0 >= t) ? 0 : 1 }'
else
  awk -v s="$SSIM" -v t="$threshold_equal" 'BEGIN { exit (s+0 < t) ? 0 : 1 }'
fi

