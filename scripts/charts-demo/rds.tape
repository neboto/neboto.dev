# Blog: "Charts: the surprise feature" — the RDS clip.
# m on an RDS instance, Z for the full width, walk the rows, then 4 for the
# last 7 days.
#
# Recorded against the emu emulator (see ecs-metrics.tape). From the
# neboto.dev root:
#   vhs scripts/charts-demo/rds.tape

Output scripts/charts-demo/out/rds.mp4

Set Shell "zsh"
Set FontFamily "JetBrainsMono Nerd Font"
Set FontSize 14
Set Width 1200
Set Height 700
Set Padding 12
Set Framerate 12
Set TypingSpeed 80ms
Set Theme "Catppuccin Mocha"
Set WindowBar Colorful
Set BorderRadius 8

Env NEBOTO_CONFIG "scripts/charts-demo/neboto.toml"
Env AWS_ACCESS_KEY_ID "test"
Env AWS_SECRET_ACCESS_KEY "test"

# ── Boot off-camera ──────────────────────────────────────────────────────────
Hide
Type "neboto --endpoint-url http://localhost:4566 --show-keys -s rds"
Enter
Sleep 4s
Sleep 2.8s
Show
Sleep 1s

Type "/"
Sleep 400ms
Type "orders-mysql-01"
Sleep 1.2s
Enter
Sleep 2.5s

# m charts it; Z gives the charts the full width.
Type "m"
Sleep 1s
Type "Z"
Sleep 3.5s
# Walk the rows: connections, IOPS, latency…
Type "j"
Sleep 2s
Type "j"
Sleep 2s
Type "j"
Sleep 2s
# 4: the last 7 days.
Type "4"
Sleep 4s

Hide
Escape
Sleep 300ms
Escape
Sleep 300ms
Type "q"
Sleep 300ms
Type "q"
Sleep 300ms
