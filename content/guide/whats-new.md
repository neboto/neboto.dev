+++
title = "What's new"
description = "Changes since the first release: a demo mode, a key display for recordings, DMS, X-Ray and Batch, export formats, operational CLI commands behind C, which load balancers hold an instance, the EC2 console log, Route 53 and Resolver fixes. Plus nebaz, the Azure sibling in development."
weight = 90
+++

What changed in each release since `v0.1.0`, newest first. The full notes
and binaries are on the
[releases page](https://github.com/neboto/neboto-tui/releases). The
installer always fetches the latest release, so re-running it upgrades you.

## v0.1.7

### Try it without an AWS account

```bash
neboto --demo
```

opens `acme-prod`, a made-up account with a few problems planted in it: a
failed ECS deploy, SSH open to the world, a drifted CloudFormation stack, a
Lambda whose logs keep streaming. It uses no credentials and makes no network
calls. The recordings on the home page were made with it. See
[First run](@/guide/first-run.md#no-aws-account-try-the-demo).

### `--show-keys`: the keys on screen, for recordings

`--show-keys` (or `show_keys = true` in the config) puts each key you press,
and what it did, in a small box in the corner: `⏎ open`, `2 Deployments`,
`W change timeline`. It's meant for screen recordings, shares and demos,
where the viewer sees the screen change but not the key. Text you type into
a search box, filter or picker is never shown.

### Three new services

- **DMS** (`@dms`): replication tasks, instances, endpoints and serverless
  replications. A task that crashed reads **stopped (error)** with its stop
  reason, its Tables section lists the tables that errored first, and an
  endpoint whose connection test failed says so. <kbd>m</kbd> charts CDC
  latency, <kbd>t</kbd> tails the task log.
- **X-Ray** (`@xray`): the service map (worst node first, with p50/p90/p99
  and callers and callees), traces with their root cause and segments, and
  groups and sampling rules. Everything is scoped to a 5m–6h window you step
  with <kbd>[</kbd> / <kbd>]</kbd>.
- **Batch** (`@batch`): job queues, compute environments, jobs and job
  definitions. neboto works out why a queue is stuck (a compute environment
  that's disabled, invalid or scaled to zero while jobs wait) from what's
  already loaded, and <kbd>t</kbd> tails a job's container log.

### Fixes

- S3 Tables: following a table bucket or table ARN lands on the right
  sub-tab.
- The Referenced-by lens (<kbd>U</kbd>) printed its service column as
  `@@ec2`.

## v0.1.6

### Choose what exports write

`export_formats` picks which files <kbd>X</kbd>, <kbd>Ctrl-X</kbd> and the
deep export write: any of `"json"`, `"csv"`, `"md"`. The default is still all
three. `export_dir` sets where they go (`~/` is expanded, and the directory is
created on first use); `NEBOTO_EXPORT_DIR` still wins. A bad value warns at
startup and is ignored, never stopping neboto from starting.

## v0.1.5

### <kbd>C</kbd> copies operational commands, not just the read one

<kbd>C</kbd> used to copy one thing: the read-only `describe` command for
the selected resource. Where there is more than one useful command, it now
opens a picker in three tiers:

| Tier | Examples |
|---|---|
| **Inspect** | The `describe` / `get` command, always the first row |
| **Connect** | `aws ssm start-session`, `aws ecs execute-command`, `aws eks update-kubeconfig` |
| **Change** | Start / stop / reboot an instance, force a new ECS deployment, scale a service or Auto Scaling group, start an instance refresh |

These are available on EC2 instances, ECS services and tasks, Auto Scaling
groups and EKS clusters. The picker shows the exact command before you copy
it, with `--region`, `--profile` and `--endpoint-url` (when you're pointed at
an emulator) filled in. A resource with only one command still copies it
straight away.

neboto still only **copies** these commands and never runs them. It makes
no new API calls and needs no new permissions, so the
[read-only guarantee](@/guide/permissions.md) is unchanged. A few rules
keep a careless paste safe:

- **Nothing destructive.** No terminate, delete, purge or deregister commands.
- **Value-taking commands are prefilled with the current value.** Pasting
  `update-service --desired-count` or `set-desired-capacity` without editing
  it changes nothing.
- **Change rows are disabled while you're assumed into a member account.** A
  `--profile` flag can't reproduce that session, so a pasted change would run
  as the wrong identity.
- **Visual selection batches.** Select several instances with <kbd>V</kbd> in
  the list and <kbd>C</kbd> offers the commands they share, with every id
  merged into one `--instance-ids a b c` list.

<kbd>C</kbd> also works from the detail pane now. Before this release,
pressing it there did nothing.

### EC2: which load balancers hold this instance

An instance's detail pane has a new **Load Balancing** section (key
<kbd>4</kbd>). It answers "is this instance behind a load balancer, and is it
healthy there?" AWS has no API that answers this directly, so neboto
checks the target groups in the same VPC with `DescribeTargetHealth`. For
an instance in an Auto Scaling group, it checks the group's own target
groups first. Each row shows the health state and reason, port, and zone.
The target group and load balancer ARNs are links you can follow with
<kbd>Enter</kbd>.

The [network access lens](@/guide/lenses.md) (<kbd>N</kbd>) now labels
rules whose source is a load balancer's security group
(`sg-… ⇠ ALB web-alb`). That tells ports forwarded by the load balancer apart
from ports opened to the instance directly.

The instance's later section keys moved up one: Storage <kbd>5</kbd>, User
Data <kbd>6</kbd>, Console <kbd>7</kbd>, Tags <kbd>8</kbd>, Optimizer
<kbd>9</kbd>. Bookmarks restore by section name, so existing ones still land
in the right place.

## v0.1.4

### Route 53: hosted zone tags

Every hosted zone's Tags section read "No tags", whatever the zone was
actually tagged with. Zone tags are now loaded with the list, so they also
feed the ownership line, `tag:` search filters, <kbd>U</kbd> and exports. If
the tag call is refused, the error shows in the Tags section instead of
looking like an untagged zone.

### Route 53: readable record sets

A zone's **Records** section now shows names relative to the zone (`@` for
the apex, `www`, `*.dev`) and puts the record type first:

```
A      @      192.0.2.10 · 300
CNAME  www    example.com · 300
TXT    @      "v=spf1 -all" · 3600
```

Before, the type and TTL were cut off every row. <kbd>Enter</kbd> on a record
opens its own pane, where every value is on its own untruncated line, and
alias targets and health checks can be followed.

## v0.1.3

### EC2: the instance console log

A new **Console** section on the instance pane shows the system log (the
console's *Get system log*). Check it first when an instance fails its
status checks or never registers with SSM. <kbd>e</kbd> opens the whole buffer
in `$EDITOR` as a plain `.log` file, easy to grep for a kernel error.
<kbd>e</kbd> on **User Data** likewise opens the script itself, with a
`.sh` or `.yaml` extension to match its first line.

AWS posts the log a few minutes after the instance starts or stops, so an
empty section right after launch is expected, not an error. The call is
`ec2:GetConsoleOutput`, which `ReadOnlyAccess` already includes.

## v0.1.2

### Route 53 Resolver: DNS delegation and endpoint detail

Resolver endpoints and rules now show the newer features: the
inbound-delegation endpoint type and `DELEGATE` rules, IPv6 targets and
DNS-over-HTTPS protocols. Endpoint panes gain type, protocols and feature
flags. They also get a **Rules** section listing the loaded rules routed
through the endpoint. Three display bugs are fixed: `DELEGATE` rules showed
as system rules, IPv6-only targets showed as a bare `:53`, and <kbd>O</kbd> on
an outbound endpoint opened the inbound page in the Console.

## v0.1.1

### Profile switch with access keys exported

With `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in the environment,
<kbd>P</kbd>, `-p` and `default_profile` showed the new profile's name but
kept signing every call with the exported keys. A profile you choose
explicitly now wins, the same way it does with `aws --profile`.

## Coming soon: nebaz, for Azure

[**nebaz**](https://github.com/neboto/nebaz) is neboto's Azure sibling and
is in active development. It uses the same keyboard-driven, read-only
design on the same core: fuzzy search, detail panes with links you can
follow, visual selection, macros, bookmarks, export and themes. It
authenticates through the Azure CLI (`az login`).

It already covers subscriptions and resource groups, Virtual Machines,
Storage, Networking, Key Vault (names and metadata, never secret values),
AKS, managed identities, App Service, SQL, Container Registry, Cosmos DB and
Foundry. There is no release yet. Follow or star the
[repository](https://github.com/neboto/nebaz) to hear when there is. Its
guide will live here at `neboto.dev/azure`.
