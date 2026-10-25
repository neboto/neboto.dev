#!/usr/bin/env bash
# Build /nebaz/'s clips from a nebaz checkout's raw takes.
#
# nebaz's demo/render.sh records each tape to demo/.raw/ with the terminal
# background keyed out, then lays it over its bright demo/backdrop.png for the
# README. The site uses the same takes over a muted backdrop
# (scripts/nebaz-backdrop.py) and encodes MP4s straight from them, so a
# re-recorded nebaz only needs this re-run, not a re-recording.
#
# Usage (after demo/render.sh in nebaz, which leaves demo/.raw/ behind):
#   scripts/nebaz-media.sh ../nebaz
#
# Needs uv, ffmpeg and ImageMagick (`magick`).
set -euo pipefail
cd "$(dirname "$0")/.."

nebaz=${1:?usage: scripts/nebaz-media.sh <nebaz checkout>}
raw="$nebaz/demo/.raw"
[ -d "$raw" ] || { echo "no $raw: run demo/render.sh in $nebaz first" >&2; exit 1; }

media=static/nebaz/media
mkdir -p "$media/scenes"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
uv run --quiet scripts/nebaz-backdrop.py "$work/bg.png"

mp4() {
  # The top-left pixel is margin, so it is always the key colour (the GIF
  # encoder can shift it a step from the tapes' #010203).
  local key
  key=$(magick "$1[0]" -format '%[hex:p{0,0}]' info: | cut -c1-6)
  ffmpeg -v error -y -loop 1 -framerate 12 -i "$work/bg.png" -i "$1" -filter_complex \
    "[1:v]format=rgba,colorkey=0x${key}:similarity=0.015:blend=0[fg];[0:v][fg]overlay=shortest=1,format=yuv420p" \
    -r 12 -c:v libx264 -crf 20 -preset slow -movflags +faststart -an "$2"
}

mp4 "$raw/nebaz.gif" "$media/demo.mp4"
ffmpeg -v error -y -i "$media/demo.mp4" -frames:v 1 -q:v 3 "$media/poster.jpg"
for scene in power-platform-outage audit identities dns follow-links; do
  mp4 "$raw/$scene.gif" "$media/scenes/$scene.mp4"
done
du -sh "$media"
