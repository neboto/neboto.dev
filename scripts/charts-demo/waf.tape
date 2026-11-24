# Blog: "Charts: the surprise feature" — the WAF clip.
# m on a web ACL: actions on one chart with the block rate, Tab into the rule
# table, Enter charts one rule, x opens its sampled requests in $EDITOR.
#
# Recorded against the emu emulator (see ecs-metrics.tape). From the
# neboto.dev root:
#   vhs scripts/charts-demo/waf.tape

Output scripts/charts-demo/out/waf.mp4

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
# x opens the sampled requests in $EDITOR; less reads well on camera, and its
# prompt says how to get back.
Env EDITOR "less"
Env LESS "-Psq returns to neboto"

# ── Boot off-camera ──────────────────────────────────────────────────────────
Hide
Type "neboto --endpoint-url http://localhost:4566 --show-keys -s waf"
Enter
Sleep 4s
Sleep 2.8s
Show
Sleep 1s

# m on the web ACL; Z gives the charts the full width.
Type "m"
Sleep 1s
Type "Z"
Sleep 4s

# Tab into the rule table, down to a rule, Enter charts just that rule.
Tab
Sleep 1s
Type "j"
Sleep 600ms
Type "j"
Sleep 600ms
Enter
Sleep 3.5s

# x: that rule's sampled requests in the editor; q comes back.
Type "x"
Sleep 3.5s
Type "q"
Sleep 2s

Hide
Escape
Sleep 300ms
Escape
Sleep 300ms
Type "q"
Sleep 300ms
Type "q"
Sleep 300ms
