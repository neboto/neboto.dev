+++
title = "First run"
description = "Credentials, region, the welcome splash, and the command-line flags."
weight = 20
+++

## Credentials and region

neboto uses the standard AWS credential chain: environment variables,
`~/.aws/credentials`, `~/.aws/config` (SSO profiles, IAM roles), then an
instance or task role. If the `aws` CLI works in your shell, neboto works.

The startup region comes from `AWS_DEFAULT_REGION` or the active profile.
<kbd>R</kbd> switches region at runtime without a restart; <kbd>P</kbd>
switches profile.

The account needs read permissions for the services you browse. The quickest
correct answer is the AWS-managed `ReadOnlyAccess` policy; see
[Permissions](@/guide/permissions.md) for the narrower, auditable grant.

## The welcome splash

With no arguments and no `default_service` configured, neboto shows a welcome
splash and loads nothing until you pick a service, so startup is instant.
Press <kbd>S</kbd> for the service picker, or type <kbd>@</kbd> followed by a
prefix such as `ec2` and press <kbd>Enter</kbd>.

Set `default_service` in the [config file](@/guide/configuration.md) to skip
the splash.

## Command line

Every flag overrides the config file for that run only.

| Flag | Effect |
|---|---|
| `-s`, `--service <SERVICE>` | Open a service on startup (`ec2`, `s3`, `@cw`, …) |
| `-r`, `--region <REGION>` | Start in this region |
| `-p`, `--profile <PROFILE>` | Use this named AWS profile |
| `-w`, `--watch` | Start in watch mode (auto-refresh) |
| `-m`, `--macro <NAME>` | Run a saved macro on startup |
| `--theme <THEME>` | Colour preset |
| `--endpoint-url <URL>` | Point at a local emulator |
| `--banner` / `--no-banner` | Show or hide the ASCII banner |

## The screen

Top to bottom: the service strip with the region and profile badges, the
search bar, the sub-tabs for the current service, then the **list pane** on
the left and the **detail pane** on the right, and a status bar. The status
bar shows contextual key hints, and any error is `y`-copyable from it;
<kbd>M</kbd> reviews past messages.

<kbd>l</kbd>, <kbd>→</kbd> or <kbd>Enter</kbd> moves from the list into the
detail pane; <kbd>h</kbd>, <kbd>←</kbd> or <kbd>Esc</kbd> comes back. That
spatial left-and-right is the whole navigation model.
