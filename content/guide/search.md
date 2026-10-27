+++
title = "Search"
description = "The @prefix syntax, fuzzy matching, tag filters, @all across services, and @audit's security findings."
weight = 40
+++

<kbd>/</kbd> opens the search bar. What you type does two things at once:
an `@prefix` switches service, and the rest fuzzy-matches against every
indexed field of the resources in view.

```
@ec2                 switch to EC2
@ec2 web             switch to EC2 and fuzzy-search "web"
ec2:web              colon syntax, same thing
@all payments        search every warm cache entry, across services
@audit               security findings from what's loaded (r fetches the rest)
tag:env=prod         exact tag filter (composes: tag:env=prod api)
arn:aws:iam::…       paste an ARN — it fuzzy-matches rather than erroring
```

Typing `@e` pops a completion dropdown; <kbd>Tab</kbd> completes to the
first match. <kbd>Enter</kbd> closes the bar and keeps the filter applied;
<kbd>Esc</kbd> clears it. <kbd>↑</kbd> / <kbd>↓</kbd> in the bar recall this
session's earlier searches. They're kept in memory only and never written
to disk. <kbd>←</kbd> / <kbd>→</kbd> / <kbd>Home</kbd> / <kbd>End</kbd> move
through the query, so <kbd>/</kbd> <kbd>↑</kbd> <kbd>←</kbd><kbd>←</kbd><kbd>←</kbd>
fixes a typo in the last search; the usual shell keys (<kbd>Ctrl-W</kbd>,
<kbd>Ctrl-U</kbd>, <kbd>Alt-←</kbd>…) work too. The detail pane's
<kbd>/</kbd> filter edits the same way.

## Sub-tabs

On a service with sub-tabs, search covers every tab. Tabs it found nothing
on are dimmed, and while you type, a tab with no matches gives way to the
first tab that has some: `@vpc private` lands on Subnets. Search returns to
the tab you started on once that tab matches again, or on <kbd>Esc</kbd>;
<kbd>Enter</kbd> keeps the tab it found. A tab you pick yourself is never
switched away from.

## What is indexed

Matching is fuzzy with a score threshold, over ids, names, IPs, CIDRs,
availability zones, tags, ARNs, usernames, emails, and per-service extras
such as every secondary private IP on a network interface or every resource
id in a GuardDuty finding. A pasted ARN or instance id lands on the exact
resource.

## Tag filters

`tag:key=value` terms are exact, case-insensitive tag filters that compose
with the fuzzy part: `tag:env=prod api` shows resources tagged `env=prod`
whose fields match `api`. `tag:key` alone matches any value.

## `@all`

`@all <text>` searches everything already cached this session, across
services, and shows a service badge on every row. It never fires a fetch,
and it says how many services it covered, so visit the services you care
about first. <kbd>Enter</kbd> on a result jumps to it in its own service;
<kbd>l</kbd> or <kbd>→</kbd> opens its detail pane in place, as a click
does, so the result list stays on screen.

The service strip at the top shows what the search covered:

```
neboto │  @all  │  EC2 –  │  ECS 7  │  λ 1  │  IAM 4
```

Each service you've opened this session shows how many results it has. `–`
marks one whose cache has expired, so it wasn't searched; open it again to
include it. Click a chip, or step through them with <kbd>Tab</kbd> /
<kbd>Shift</kbd>+<kbd>Tab</kbd> (<kbd>H</kbd> / <kbd>L</kbd>), to show only
that service's results; `@all` shows them all again. <kbd>z</kbd> sorts the
results, including grouped by service.

## `@audit`

`@audit` runs security checks over the same warm caches, with no API calls
until you press <kbd>r</kbd>. It flags security groups open to the world (graded by port), public or
unencrypted RDS, unencrypted EBS, IMDSv1, public AMIs, S3 buckets without a
full public access block, EKS endpoints open to `0.0.0.0/0`, root MFA and
access keys, the password policy, and Access Analyzer's public findings.

Severity is the row's state, so <kbd>F</kbd> filters by it and <kbd>z</kbd>
sorts by it. <kbd>Enter</kbd> opens the resource at the section that shows
the problem; <kbd>l</kbd> reads the finding in place. A check whose service
you haven't loaded says `not checked — @rds not loaded` rather than passing;
<kbd>r</kbd> loads every missing one (EC2, RDS, S3, EKS, IAM, KMS) in the
background and re-audits as each lands.

Then <kbd>r</kbd> reads what no list carries, once per account and region:
the S3 account-level public access block (a bucket finding it covers drops
to low), EBS encryption by default, a logging multi-region CloudTrail trail,
the Config recorder, GuardDuty and Access Analyzer. It also makes capped
per-resource reads, 100 of each kind: KMS key rotation, IAM users with a
console password but no MFA, access-key age, and EBS and RDS snapshots that
are public or shared. A denied call becomes a `not checked — no permission
for kms:GetKeyRotationStatus` row, not an error. In an Organizations member
account, a missing Access Analyzer is *not checked*, since the
organization's analyzer isn't visible from there.

`neboto audit` does all of it from a script; see
[CLI](@/guide/cli.md#audit-security-findings).

## Filters that are not search

- <kbd>F</kbd> cycles a state filter over the states present in the current view (running, stopped, failed…).
- <kbd>a</kbd> hides rows the service considers noise: default VPCs, automated snapshots, passed checks. Noise shows by default; <kbd>a</kbd> opts in to hiding it.
- <kbd>z</kbd> cycles the sort: load order, name ascending, name descending, state (and service, under `@all`). While a search is active the default is best match first, and a sort you pick overrides it.
