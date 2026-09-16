+++
title = "Logs, metrics and lenses"
description = "The in-pane views: log tail and search, CloudWatch charts, the change timeline, references, network access."
weight = 50
+++

Several views open **inside the detail pane** rather than as full-screen
modals. Each takes over the keymap while open; <kbd>Esc</kbd> closes it and
<kbd>Z</kbd> makes the pane full-width.

| Key | View |
|---|---|
| <kbd>m</kbd> | CloudWatch charts: <kbd>[</kbd> / <kbd>]</kbd> change the window, <kbd>r</kbd> refreshes |
| <kbd>t</kbd> | Live log tail: <kbd>[</kbd> / <kbd>]</kbd> widen the lookback, <kbd>s</kbd> flips to search, <kbd>w</kbd> wraps long lines |
| <kbd>f</kbd> | Log search (server-side filter pattern) · CloudTrail event filter · ECS/execution status filter |
| <kbd>W</kbd> | Change timeline: who changed this resource; <kbd>[</kbd> / <kbd>]</kbd> widen to 90 days, <kbd>a</kbd> includes reads |
| <kbd>U</kbd> | Referenced by: which loaded resources mention this one |
| <kbd>N</kbd> | Network access: the effective security-group rule table |
| <kbd>o</kbd> | S3 object browser |
| <kbd>i</kbd> | DynamoDB item browser (Scan / Query) |
| <kbd>s</kbd> | SSM Session Manager · ECS Exec · assume an Organizations member-account role |
| <kbd>x</kbd> / <kbd>Y</kbd> | Reveal / copy a secret or SSM parameter value (never cached, never logged) |
| <kbd>O</kbd> | Open this resource in the AWS Console |

## Metrics (<kbd>m</kbd>)

Charts for 53 resource kinds, each with the right namespace and dimension
set: EC2, EBS, Lambda, ECS services and tasks, RDS, load balancers,
DynamoDB, SQS, Kinesis, MSK, API Gateway, CloudFront, NAT gateways, VPN and
Direct Connect, and so on. On a CloudWatch dashboard, <kbd>m</kbd> renders
the dashboard itself: its widgets laid out on the console's own grid, with
<kbd>Tab</kbd> walking a widget cursor and <kbd>Enter</kbd> zooming one to
the whole pane.

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

"What changed around this resource?" Four sources merged newest-first, each
row wearing a badge: CloudTrail events that name the resource, CloudWatch
alarm state changes, CloudFormation stack events for the owning stack, and
ECS deployments. Works on any resource, from either pane.
<kbd>Enter</kbd> opens the raw event in `$EDITOR`.

## Referenced by (<kbd>U</kbd>) and network access (<kbd>N</kbd>)

<kbd>U</kbd> is the reverse of ownership: every loaded resource that mentions
the selected one, by id, name, ARN or tag. It scans only what is cached, so
it makes no API calls and says how much it covered.

<kbd>N</kbd> on anything with security groups (an instance, an RDS instance,
a Lambda, a load balancer…) shows the **effective** rule table across every
attached group in one view, with open-to-world sources highlighted.
<kbd>Enter</kbd> jumps to the group a row came from.

## The editor (<kbd>e</kbd>)

<kbd>e</kbd> opens the current resource in `$EDITOR` (falling back to
`vim`). What it opens depends on context: a fetched IAM policy document, a
CloudFormation template, an S3 object, a Step Functions payload, a raw
finding JSON, or by default the full detail-pane snapshot as JSON, so
<kbd>e</kbd> always opens something useful.
