#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <gold.mp4> <test.mp4> [min_ssim]" >&2
  exit 2
fi

GOLD="$1"
TEST="$2"
THRESHOLD="${3:-0.99}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found in PATH" >&2
  exit 2
fi

# Compute SSIM (luma Y) aggregated across frames
OUT=$(ffmpeg -i "$GOLD" -i "$TEST" -lavfi ssim -f null - 2>&1 || true)
SSIM=$(echo "$OUT" | awk -F'[: ]+' '/All:/{print $3}' | tail -n1)

if [ -z "$SSIM" ]; then
  echo "Failed to parse SSIM from ffmpeg output" >&2
  echo "$OUT" >&2
  exit 2
fi

echo "SSIM: $SSIM (threshold: $THRESHOLD)"

awk -v s="$SSIM" -v t="$THRESHOLD" 'BEGIN{exit !(s>=t)}'

