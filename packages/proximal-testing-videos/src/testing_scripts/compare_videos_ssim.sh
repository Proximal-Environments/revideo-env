#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <videoA> <videoB> [min_ssim]" >&2
  exit 2
fi

VIDEO_A="$1"
VIDEO_B="$2"
MIN_SSIM="${3:-0.9999}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found on PATH" >&2
  exit 3
fi

SSIM_LINE=$(ffmpeg -v error -i "$VIDEO_A" -i "$VIDEO_B" -lavfi ssim -f null - 2>&1 | tail -n 1 || true)

if [[ "$SSIM_LINE" =~ All\:\ ([0-9.]+) ]]; then
  SCORE="${BASH_REMATCH[1]}"
  echo "SSIM score: $SCORE"
  awk -v s="$SCORE" -v min="$MIN_SSIM" 'BEGIN{ if (s+0 >= min+0) exit 0; else exit 1 }'
else
  echo "Failed to parse SSIM output: $SSIM_LINE" >&2
  exit 4
fi

