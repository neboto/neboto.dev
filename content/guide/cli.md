+++
title = "Scripts and agents"
description = "neboto services, ls and get: the same read-only calls as the TUI, printed as a table, JSON, Markdown or CSV for scripts and AI agents."
weight = 65
+++

Subcommands run once and print instead of opening the TUI. They make the same
read-only calls, so they're safe to hand to a script or an AI agent: nothing
neboto can call changes an account. With no subcommand, `neboto` is the TUI
as before.

```bash
neboto services                                   # every @prefix it knows
neboto ls @ec2 -t volume --state available        # unattached EBS volumes
neboto ls @iam -t role -f 'deploy'                # IAM roles, fuzzy-matched
neboto get @lambda orders-api                     # every detail-pane section
neboto get @iam deploy-role --section policies -o json
```

Try any of them with `--demo`, which answers from a built-in fake account
and needs no credentials.

## `ls`: list and filter

`ls <@service>` lists a service's resources, filtered the way the TUI's
search filters them.

| Flag | Effect |
|---|---|
| `-t`, `--type <TYPE>` | Only this resource type, by its name or last word(s): `"Security Group"`, `role`, `role\|policy` |
| `-f`, `--filter <QUERY>` | Fuzzy text plus exact `tag:key[=value]` terms |
| `--state <STATE>` | Only rows in this state (`running`, `available`, …) |
| `--hide-noise` | Drop AWS-managed defaults and other noise rows (the TUI's <kbd>a</kbd>) |
| `--limit <N>` | At most N rows |

## `get`: everything the detail pane shows

`get <@service> <ID|NAME>...` prints every section of a resource's detail
pane, including the ones the TUI loads when you open them: IAM policy
documents, CloudFormation events, template and drift, ECS deployments, and
so on. It takes up to 50 resources, matched by exact id (or ARN, where
that's the id), then exact name.

| Flag | Effect |
|---|---|
| `-t`, `--type <TYPE>` | Pick between resources that share a name (an ECS service and its task definition) |
| `--section <NAME>` | Only this section, any case; repeatable. The other sections' data isn't fetched |
| `--wait <SECS>` | How long to wait for slow sections (default 60); anything still loading prints as not loaded |

## Output

`-o table` is the default on a terminal and `-o json` the default when
piped; `-o md` and `-o csv` work too. JSON is one document carrying
`"schema": "neboto/v1"`. Section rows are the pane's readable `key: value`
rows, not raw API fields, and a section that didn't load is `null`. Warnings
go to stderr, so `| jq` keeps working.

| Exit code | Meaning |
|---|---|
| `0` | Success, including an empty list |
| `1` | AWS error (permissions, throttling, network) |
| `2` | A bad service, region or section, or a resource that isn't there or matches more than one. The message says what to pass instead |

`-p`, `-r`, `--endpoint-url` and `--demo` work on every subcommand. Unlike
the TUI, an unknown profile or region is an error rather than a fallback, so
a script never gets another account's answer. Secret values are never
fetched: the TUI's <kbd>x</kbd> / <kbd>Y</kbd> have no CLI equivalent.

## What scripts can rely on

- **Stable:** the flags; the JSON envelopes; each `ls` row's `type`, `id`,
  `name`, `state` and `tags`; `get`'s `resource` object and `tags`; section
  *names* (`.sections.Permissions`); resource type names; service prefixes;
  the first four CSV columns; the exit codes. Removing or renaming any of
  these is a breaking change: the schema moves to `neboto/v2` and the
  release notes say so. New sections, types, services and flags can arrive
  in any release. A test holds this, so it can't change by accident.
- **Descriptive:** everything *inside* a section, and the extra per-type
  columns on an `ls` row (`"Runtime"`, `"Memory"`, …). These are the detail
  pane, serialized: labels, units and grouping follow the TUI and can change
  in any release. Read them; don't hard-code paths into them. When a script
  needs one field to stay put, the AWS API is that contract (`aws …`).
- **For people only:** `-o table` and `-o md`. Don't parse them.

## For AI agents

[`skills/neboto/SKILL.md`](https://github.com/neboto/neboto-tui/blob/main/skills/neboto/SKILL.md)
teaches an agent the commands, the output shapes and the exit codes. For
Claude Code:

```bash
mkdir -p ~/.claude/skills/neboto
curl -fsSL https://raw.githubusercontent.com/neboto/neboto-tui/main/skills/neboto/SKILL.md \
  -o ~/.claude/skills/neboto/SKILL.md
```
