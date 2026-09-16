+++
title = "neboto"
template = "index.html"
+++

## What you get

- **65 services, one search.** `@ec2 web`, `@sh`, `@orgs` — an `@prefix` switches service and fuzzy-matches the rest against ids, names, IPs, CIDRs, tags and ARNs. Multi-resource services get numbered sub-tabs.
- **Console-style detail panes.** Fixed header, section tabs, scrollable body, on roughly 160 resource types. Expensive sections load lazily the first time you look.
- **Follow the links.** <kbd>Enter</kbd> on any ARN, id or reference jumps to that resource — across services and even across regions. Tracing a dependency chain is faster here than in the Console.
- **Logs and metrics in place.** <kbd>t</kbd> tails CloudWatch logs live, <kbd>f</kbd> runs a server-side log search, <kbd>m</kbd> charts the right namespace and dimensions for 53 resource kinds.
- **"Who changed this?"** <kbd>W</kbd> opens a CloudTrail lens on any resource, merged with alarm history, stack events and deployments.
- **Multi-account, safely.** Switch profiles with <kbd>P</kbd>, or assume into an Organizations member account with <kbd>s</kbd> — every assumed session is pinned to a `ReadOnlyAccess` session policy.
- **Watch, record, export.** <kbd>w</kbd> auto-refreshes without the list ever blanking, <kbd>,</kbd> records a navigation routine you can replay with one key, <kbd>X</kbd> exports JSON, CSV and Markdown.
- **Your colours.** Ten theme presets, light and dark, plus per-colour overrides. This site uses the same catppuccin-mocha palette as the recording.
