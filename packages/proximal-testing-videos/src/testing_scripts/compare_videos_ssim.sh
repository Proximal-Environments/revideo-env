#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <video_a> <video_b> [threshold]" >&2
  echo "Compares two videos with SSIM and duration; exits non-zero if different." >&2
  exit 2
fi

VIDEO_A="$1"
VIDEO_B="$2"
THRESHOLD="${3:-1.0}"

if [[ ! -f "$VIDEO_A" || ! -f "$VIDEO_B" ]]; then
  echo "Video files not found: $VIDEO_A or $VIDEO_B" >&2
  exit 3
fi

# Compare durations (in seconds, rounded to milliseconds)
duration_a=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_A")
duration_b=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$VIDEO_B")

ms_a=$(python - <<PY
import math
print(int(round(float("$duration_a")*1000)))
PY
)
ms_b=$(python - <<PY
import math
print(int(round(float("$duration_b")*1000)))
PY
)

if [[ "$ms_a" -ne "$ms_b" ]]; then
  echo "Duration mismatch: ${ms_a}ms vs ${ms_b}ms" >&2
  exit 4
fi

# Compute SSIM
ssim_line=$(ffmpeg -v error -i "$VIDEO_A" -i "$VIDEO_B" -lavfi ssim -f null - 2>&1 | tail -n 1 || true)
# Expected format: SSIM Y:1.000000 U:... All:0.9999 (assuming)
all_ssim=$(echo "$ssim_line" | sed -n 's/.*All:\([0-9.]*\).*/\1/p')

if [[ -z "$all_ssim" ]]; then
  echo "Could not parse SSIM output: $ssim_line" >&2
  exit 5
fi

echo "SSIM(All) = $all_ssim"

awk -v s="$all_ssim" -v t="$THRESHOLD" 'BEGIN { exit !(s>=t) }'

