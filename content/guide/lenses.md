+++
title = "Logs, metrics and lenses"
description = "The in-pane views: log tail and search, CloudWatch charts with change markers, the change timeline, @changes account-wide, references, network access."
weight = 50
+++

Several views open **inside the detail pane** rather than as full-screen
modals. Each takes over the keymap while open; <kbd>Esc</kbd> closes it and
<kbd>Z</kbd> makes the pane full-width.

| Key | View |
|---|---|
| <kbd>m</kbd> | CloudWatch charts: <kbd>1</kbd>–<kbd>5</kbd> or <kbd>[</kbd> / <kbd>]</kbd> change the range, <kbd>s</kbd> the statistic, <kbd>a</kbd> lists every metric, <kbd>c</kbd> toggles change markers, <kbd>W</kbd> opens them as the timeline |
| <kbd>t</kbd> | Live log tail: <kbd>[</kbd> / <kbd>]</kbd> widen the lookback, <kbd>s</kbd> flips to search, <kbd>w</kbd> wraps long lines |
| <kbd>f</kbd> | Log search (server-side filter pattern) · CloudTrail event filter · ECS/execution status filter |
| <kbd>W</kbd> | Change timeline: who changed this resource; <kbd>[</kbd> / <kbd>]</kbd> widen to 90 days, <kbd>a</kbd> includes reads |
| <kbd>U</kbd> | Referenced by: which loaded resources mention this one |
| <kbd>N</kbd> | Network access: the effective security-group rule table, with load-balancer sources labelled, then the subnets' network ACLs |
| <kbd>o</kbd> | S3 object browser, with a Terraform state viewer inside it (see [Browsers](@/guide/browsers.md)) |
| <kbd>i</kbd> | DynamoDB item browser: Scan / Query (see [Browsers](@/guide/browsers.md)) |
| <kbd>s</kbd> | SSM Session Manager · ECS Exec · assume an Organizations member-account role. Sessions are off while a member-account role is assumed (see [Multi-account](@/guide/multi-account.md)) |
| <kbd>x</kbd> / <kbd>Y</kbd> | Reveal / copy a secret or SSM parameter value (never cached, never logged). On a Route 53 record's **Test answer** section, <kbd>x</kbd> asks Route 53 what it answers, again on each press |
| <kbd>O</kbd> | Open this resource in the AWS Console |

## Metrics (<kbd>m</kbd>)

Charts for most resource kinds that publish CloudWatch metrics, each with
the right namespace and dimension set: EC2, EBS, Lambda, ECS services and tasks, RDS, load balancers,
DynamoDB, SQS, Kinesis, MSK, API Gateway, CloudFront, NAT gateways, VPN and
Direct Connect, and so on.

Every kind opens the same view. Each metric gets a row with a sparkline and
its last, min, max and average in its unit. Below the rows is a large chart
of the selected one, and related metrics, such as bytes in and out, share
it. <kbd>j</kbd> / <kbd>k</kbd> pick the row.

| Key | Does |
|---|---|
| <kbd>1</kbd>–<kbd>5</kbd>, <kbd>[</kbd> / <kbd>]</kbd> | Range: 1h, 6h, 24h, 7d, 30d |
| <kbd>s</kbd> | Cycle the selected metric's statistic: Average, Maximum, Sum, Minimum, p99 |
| <kbd>a</kbd> | List every metric CloudWatch has for the resource; <kbd>Enter</kbd> charts it, <kbd>d</kbd> goes back to the default set |
| <kbd>c</kbd> / <kbd>W</kbd> | Toggle the change markers / open them as the change timeline |
| <kbd>y</kbd> / <kbd>e</kbd> | Copy the view / open it in `$EDITOR` |

The range row ends with where the data comes from: the namespace and the
home region, plus the dimensions for a CloudWatch metric row. If nothing
was published in the window, the view says so and suggests a longer range.

On a CloudWatch dashboard, <kbd>m</kbd> renders
the dashboard itself: its widgets laid out on the console's own grid, with
<kbd>Tab</kbd> walking a widget cursor and <kbd>Enter</kbd> zooming one to
the whole pane.

Each chart also marks what changed: the resource's [change
timeline](#change-timeline-w) events (CloudTrail changes, deploys, stack
events, Auto Scaling and RDS events, alarm changes) are drawn as vertical
lines, failed ones in the error colour. A legend on the pane's bottom
border names each event once, newest first, with a count
(`StopInstances ×7`). <kbd>c</kbd> turns them off and on for the session.
<kbd>W</kbd> opens those events as the change timeline, and <kbd>Esc</kbd>
returns to the charts as you left them. CloudTrail is read up to 50 matched
events. If the chart's window goes back further than that, the legend says
`N+ changes`, or `no changes since <time>`, rather than calling the
unread stretch quiet.
Dashboards and Cost don't get markers.

> `GetMetricData` bills per metric requested, so the dashboard view caps the
> number of series it fetches and never fires automatically.

## Log tail and search (<kbd>t</kbd>, <kbd>f</kbd>)

<kbd>t</kbd> tails a log group live, seeded from a lookback window (default
15 minutes). It also works on things that *have* logs: a Lambda function, an
RDS instance, an ECS task, a WAF web ACL, a CloudTrail trail, a Step
Functions execution, a CodeBuild project. <kbd>f</kbd> on a log group runs a
one-shot server-side search with a CloudWatch filter pattern over a chosen
range; <kbd>s</kbd> flips a live tail into a search on the same group.
<kbd>y</kbd> copies the buffer, <kbd>e</kbd> opens it in `$EDITOR`.

## Change timeline (<kbd>W</kbd>)

"What changed around this resource?" Its sources are merged newest-first,
each row wearing a badge: CloudTrail events that name the resource,
CloudWatch alarm state changes, CloudFormation stack events for the owning
stack, ECS deployments, Auto Scaling activities (for a group, or an instance
in one) and RDS events (RDS keeps only 14 days). The last two are what AWS
itself does, which CloudTrail never records. Works on any resource, from
either pane.
<kbd>Enter</kbd> opens the raw event in `$EDITOR`.

## What changed, account-wide (`@changes`)

<kbd>W</kbd> answers "what changed around this resource?". `@changes` asks
"what changed just before this started?" across the whole account. It's a
service like any other: one regional list, newest first, over a
<kbd>[</kbd> / <kbd>]</kbd> window from 15 minutes to 7 days.

| Sub-tab | What it lists |
|---|---|
| **All** | Everything below, merged |
| **IAM & Orgs** | IAM and Organizations changes, with the request parameters and the policy document the call wrote |
| **CloudTrail** | Write events in this region |
| **Config** | Configuration items Config recorded (what changed, not who) |
| **Deploys** | CloudFormation stack events, CodePipeline runs, CodeBuild builds, ECS deployments and service events |
| **Scaling & RDS** | Auto Scaling activities and RDS events |

IAM and Organizations are global, so CloudTrail records them only in
us-east-1. `@changes` looks them up there whichever region you're in.
AWS-service and session events are noise, so <kbd>a</kbd> hides them; IAM
changes never are. CloudTrail's lookup is rate-limited and shared, so it reads the
newest 500 write events at most, and the warning says how far back that
reached. Each source is optional: a denied one is a warning, and the rest
still list. <kbd>Enter</kbd> follows a row to the resource it changed, where the
source names one.

## Referenced by (<kbd>U</kbd>) and network access (<kbd>N</kbd>)

<kbd>U</kbd> is the reverse of ownership: every loaded resource that mentions
the selected one, by id, name, ARN or tag. It scans only what is cached, so
it makes no API calls and says how much it covered.

<kbd>N</kbd> on anything with security groups (an instance, an RDS instance,
a Lambda, a load balancer…) shows the **effective** rule table across every
attached group in one view, with open-to-world sources highlighted.
<kbd>Enter</kbd> jumps to the group a row came from.

Below the security-group rules come the network ACLs on the resource's
subnets, in rule order, since the first match wins. A deny is in the
warning colour, and an ACL that opens everything both ways is labelled
`allow-all`. <kbd>Enter</kbd> on an ACL row jumps to the ACL. Load
balancers get their subnets' ACLs too.

## The editor (<kbd>e</kbd>)

<kbd>e</kbd> opens the current resource in `$EDITOR` (falling back to
`vim`). What it opens depends on context: a fetched IAM policy document, a
CloudFormation template, an S3 object, a Step Functions payload, a raw
finding JSON, or by default the full detail-pane snapshot as JSON, so
<kbd>e</kbd> always opens something useful.
