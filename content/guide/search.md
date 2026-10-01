+++
title = "Search"
description = "The @prefix syntax, fuzzy matching, tag filters, and @all across services."
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
tag:env=prod         exact tag filter (composes: tag:env=prod api)
arn:aws:iam::…       paste an ARN — it fuzzy-matches rather than erroring
```

Typing `@e` pops a completion dropdown; <kbd>Tab</kbd> completes to the
first match. <kbd>Enter</kbd> closes the bar and keeps the filter applied;
<kbd>Esc</kbd> clears it.

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

## Filters that are not search

- <kbd>F</kbd> cycles a state filter over the states present in the current view (running, stopped, failed…).
- <kbd>a</kbd> hides rows the service considers noise: default VPCs, automated snapshots, passed checks. Noise shows by default; <kbd>a</kbd> opts in to hiding it.
- <kbd>z</kbd> cycles the sort: load order, name ascending, name descending, state (and service, under `@all`). While a search is active the default is best match first, and a sort you pick overrides it.
