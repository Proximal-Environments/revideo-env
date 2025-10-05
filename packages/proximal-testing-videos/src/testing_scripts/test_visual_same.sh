#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <gold.mp4> <candidate.mp4> [min_ssim]" >&2
  exit 2
fi

GOLD="$1"
CAND="$2"
MIN_SSIM="${3:-0.999}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required" >&2
  exit 3
fi

OUT=$(ffmpeg -v error -i "$GOLD" -i "$CAND" -lavfi ssim -f null - 2>&1 || true)
SSIM=$(echo "$OUT" | sed -n 's/.*All:\s*\([0-9.]*\).*/\1/p' | tail -n1)

if [ -z "$SSIM" ]; then
  echo "Could not parse SSIM from ffmpeg output" >&2
  echo "$OUT" >&2
  exit 4
fi

echo "SSIM: $SSIM (threshold: $MIN_SSIM)"

awk -v ssim="$SSIM" -v min="$MIN_SSIM" 'BEGIN {exit !(ssim+0 >= min+0)}' || {
  echo "Visual mismatch: SSIM $SSIM < $MIN_SSIM" >&2
  exit 1
}

