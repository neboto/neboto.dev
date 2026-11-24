# Blog: "Charts: the surprise feature" — the ECS search and metrics clip.
# /@ecs finds the service, m charts it, j moves to memory, 3 widens to 24h.
#
# Recorded against the emu emulator (synthetic, seeded world — safe to
# publish), not --demo. Start it first:
#   (cd ../emu && cargo run --release -p emu-server -- --world medium)
# then, from the neboto.dev root:
#   vhs scripts/charts-demo/ecs-metrics.tape

Output scripts/charts-demo/out/ecs-metrics.mp4

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
Type "neboto --endpoint-url http://localhost:4566 --show-keys -s ecs"
Enter
Sleep 4s
# --show-keys: let the boot's keys fade before the camera rolls.
Sleep 2.8s
Show
Sleep 1s

# Search for the service, the way the post does it.
Type "/"
Sleep 400ms
Type "@ecs legacy-exporter"
Sleep 1.2s
Enter
Sleep 2.5s

# m charts it: CPU, memory, task counts, with the big chart below.
Type "m"
Sleep 3.5s
# Memory, one row down.
Type "j"
Sleep 2.5s
Type "k"
Sleep 1s
# 3 widens the range to 24 hours.
Type "3"
Sleep 4s

# Leave the app before the recording ends so ttyd does not hold the tty.
Hide
Escape
Sleep 300ms
Type "q"
Sleep 300ms
Type "q"
Sleep 300ms
