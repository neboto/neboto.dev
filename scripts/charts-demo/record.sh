#!/usr/bin/env bash
# Record the charts blog clips and copy them into static/media/blog, minus
# VHS's 30px window bar (the site draws its own).
#
# Needs emu running on :4566, `neboto`, `vhs` and `ffmpeg`. From the repo root:
#   scripts/charts-demo/record.sh            # all clips
#   scripts/charts-demo/record.sh waf        # just one
set -euo pipefail

clips=("$@"); (( ${#clips[@]} )) || clips=(ecs-metrics waf rds)
mkdir -p scripts/charts-demo/out static/media/blog
for n in "${clips[@]}"; do
  vhs "scripts/charts-demo/$n.tape"
  ffmpeg -v error -y -i "scripts/charts-demo/out/$n.mp4" -vf "crop=iw:ih-30:0:30" \
    -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -an \
    "static/media/blog/$n.mp4"
  echo "wrote static/media/blog/$n.mp4"
done
