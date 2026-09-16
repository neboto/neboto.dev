+++
title = "Configuration"
description = "The TOML config file, themes, cache TTLs, and where the file lives."
weight = 70
+++

The config file is TOML, found at `$NEBOTO_CONFIG`, then
`$XDG_CONFIG_HOME/neboto/config.toml` (default
`~/.config/neboto/config.toml`), then `~/.neboto.toml`. Every key is
optional; [`config.example.toml`](https://github.com/neboto/neboto-tui/blob/main/config.example.toml)
is a commented template. A file that fails to parse warns in the status bar
at startup rather than silently falling back to defaults.

```toml
default_service = "ec2"
default_region  = "eu-west-1"
default_profile = "prod-readonly"
theme = "catppuccin-mocha"
show_banner = false

org_access_role = "OrganizationAccountAccessRole"

cache_ttl = 300               # seconds
[cache_ttls]
cost = 21600                  # per-service overrides, keyed by @prefix
```

| Key | Meaning |
|---|---|
| `default_service` | Load this service on startup (omit for the welcome splash) |
| `default_region`, `default_profile` | Where to start |
| `show_banner` | ASCII banner on startup |
| `watch`, `watch_interval` | Start in watch mode, and its cadence in seconds |
| `detail_flat` | Start with the flat all-sections detail view |
| `log_wrap` | Start log panes with long lines wrapped |
| `theme`, `[theme_colors]` | Preset name and per-colour overrides |
| `cache_ttl`, `[cache_ttls]` | Base cache freshness in seconds, and per-service overrides keyed by `@`-prefix |
| `org_access_role`, `org_access_roles` | Role name(s) for the member-account switch |
| `controltower_audit_account`, `controltower_audit_role` | The account holding the Control Tower Config aggregator. **Quote the id**: a bare 12-digit number is a TOML integer |
| `owner_tags`, `managed_by_tags`, `ownership_ribbon` | Which tags feed the ownership line under each detail pane, and whether to show it |
| `endpoint_url` | Point every client at a local emulator |

## Themes

`dark` (default), `light`, `solarized-dark`, `solarized-light`,
`gruvbox-dark`, `gruvbox-light`, `dracula`, `nord`, `catppuccin-mocha`,
`catppuccin-latte`. Separators are optional and `mocha` / `latte` also
resolve. Override individual colours under `[theme_colors]` by palette field
name (`#rrggbb` or an ANSI name); a bad key or value warns at startup and is
never fatal.

```toml
theme = "nord"
[theme_colors]
accent = "#ff9900"
```

## Caching

Each service's list is cached for `cache_ttl` seconds (default 300) per
region and profile. <kbd>r</kbd> in the list pane forces a reload;
<kbd>r</kbd> in the detail pane refreshes just that resource. Cost Explorer
defaults to six hours because each request costs money.

## Local emulator

Point every client at a local emulator such as floci or LocalStack with
`endpoint_url` in the config or the `AWS_ENDPOINT_URL` environment variable.
neboto injects dummy credentials, forces path-style S3, and shows a
`⚙ host:port` badge in the tab bar. The demo on the front page was recorded
this way.
