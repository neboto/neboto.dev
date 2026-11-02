+++
title = "Speed: one search bar for all of AWS"
description = "The small questions that eat a day - a VPC CIDR, a CVE, a failing Lambda - answered in a few keystrokes without leaving the terminal."
draft = true
+++

<!--
OUTLINE (theme: speed - you're already in the terminal, the answer is a few keystrokes away)
1. Intro: the small questions, and the cost of context switching
2. One bar, two jobs: @prefix + fuzzy, and what gets matched
3. Quick jumps (the core of the post, one short story each):
   a. "What's the VPC CIDR?"           neboto -s vpc -p <profile>
   b. "What are our private ranges?"   docs/Confluence vs @vpc private / neboto ls
   c. "Which containers have this CVE?" @inspector CVE-...
   d. "Why is this Lambda failing?"    @lambda, t, Code, d, nvim in tmux, ticket
   e. Rapid fire: IP from a flow log, a role, a parameter, a tag, @all
4. Why it's fast: fetch once, search in memory
5. Try it
MEDIA TODO: the Lambda flow as a clip (search, t, error, Code, d) is the strongest
-->

Most of my day isn't spent on the hard problems. It's the small questions that keep coming up - what's the CIDR on that VPC, which of our containers has this CVE, why did that Lambda start failing at 10:40? They're easy to answer, yet somehow they always take longer than they should. Reading the answer takes seconds. Getting to it is the slow part.

For me that usually means switching to the browser and finding the right tab (good luck with that when I've got dozens open), then the right account, then the right region. Then I open the service, find its search box and try to remember what it actually searches on. Or I go to Confluence and hope the page someone wrote two years ago still matches what's deployed. By the time I've got the answer, I've half forgotten why I needed it.

I spend most of my day in the terminal anyway, so I want the answer right there - a few keystrokes, no browser. That's why I built the search bar in neboto.

"But you're in the terminal," you might say. "Just use the AWS CLI!" Then I have to remember the service, the API call and its filters, and then write a JMESPath query or pipe it to jq to turn a wall of JSON into something I can actually read. Here's the private subnets question from further down:

```
aws ec2 describe-subnets --profile prod \
  --filters "Name=tag:Name,Values=*private*" \
  --query 'Subnets[].{Name: Tags[?Key==`Name`] | [0].Value, CIDR: CidrBlock, AZ: AvailabilityZone}' \
  --output table
```

It works, but nobody types that from memory.

## One bar, two jobs

<kbd>/</kbd> opens the search bar, and what you type does two things at once. An `@prefix` switches service, and everything after it fuzzy-matches the resources in view. `@lambda orders` is "go to Lambda and find orders" in one go. <kbd>Tab</kbd> completes the prefix, so you never have to remember whether it's `@elb` or `@alb`.

The fuzzy part doesn't just look at names. It matches ids, names, IPs, CIDRs, tags, ARNs, usernames and emails, plus the places things hide, such as every secondary IP on a network interface. Whatever's in your clipboard, paste it. You don't have to know what kind of thing it is first.

Here's what that looks like on a normal day. In each example, press <kbd>/</kbd> first, then type what's shown.

## "What's the CIDR on that VPC?"

```
neboto -s vpc -p prod
```

That's it. neboto opens straight on VPC in the prod account, and the CIDR is right there in the list. No console, no `aws ec2 describe-vpcs --query` to remember, no piping into jq. <kbd>y</kbd> copies it.

## "What are the private subnet ranges in this account?"

This one comes up every time someone needs a firewall rule, a peering request or a new security group. The answer is written down somewhere - in a design doc, on a Confluence page, in a Terraform module - and finding it is cumbersome. And the doc tells you what was planned, not what's actually deployed.

You're already in the terminal, so ask the account:

```
@vpc private
```

It lands on the Subnets tab, because that's where the matches are: every subnet whose name, tags or ids match `private`, with its CIDR and availability zone. If you need it in a ticket or a chat message, <kbd>V</kbd> then <kbd>Ctrl-A</kbd> selects every subnet, and <kbd>y</kbd> copies them as a Markdown table ready to paste (or <kbd>Ctrl-X</kbd> exports the list). The same search works from the CLI:

```
neboto ls @vpc -t subnet -f private -p prod -o md
```

That prints a Markdown table, ready to paste.

## "Which of our containers have this CVE?"

Today we had a security issue: a CVE that needed checking across our container images. In the console that's Inspector, then the findings filter, then picking the right field to filter on.

In neboto it was:

```
@inspector CVE-2026-111497
```

The CVE id is indexed on every finding, so the list collapsed to just the affected resources. <kbd>Enter</kbd> on each showed the vulnerable package, the version that fixes it and the image it's in. A few minutes later I knew exactly which containers needed rebuilding, and I hadn't opened a browser.

## "Why is this Lambda failing?"

An alert, a Lambda, a service ticket or someone asking for help.

1. `@lambda my-function` and <kbd>Enter</kbd>.
2. <kbd>t</kbd> tails its log group. The error is in the last few lines, with the stack trace.
3. Back to the **Code** section, and <kbd>d</kbd> downloads the deployment package into the working directory.
4. A new tmux pane, `nvim`, and I'm reading the line from the stack trace.

From there I've got enough to write the ticket properly: the error, the line, what I think is going on. The engineer who picks it up starts with the answer instead of the question.

<!-- TODO: how long that used to take in the console, if you've got a feel for it -->

## Rapid fire

A few more that are a handful of keystrokes each:

- **An IP from a flow log or an alert.** `@ec2 10.20.1.12` finds the instance and the network interface that own it. <kbd>N</kbd> then shows every inbound rule that applies to it.
- **"Which role does the pipeline use?"** `@iam deploy`, then <kbd>Enter</kbd> for its policies and trust policy.
- **"Where's the database password kept?"** `@ssm /orders/db` or `@secrets prod/orders`. neboto shows names and metadata, and only fetches a value when you press <kbd>x</kbd> to reveal it.
- **"Everything the data team owns."** `tag:team=data` is an exact tag filter. It combines with fuzzy text, so `tag:env=prod api` gives you the prod things that look like the API.
- **"I don't even know which service this is."** `@all <anything>` searches everything you've already loaded this session, across services, with a badge on each row saying where it came from. To get clever, record a macro that loads the services you work with and start with `neboto --macro <name>`, so `@all` covers all of them from the first keystroke.
- **"What changed?"** `@changes` lists who changed what across the account, newest first.

## Why it feels instant

Every keystroke filters data that's already in memory. Lists are fetched once, cached and searched locally, so typing never waits on the network. The AWS API is still the slow part of any AWS tool. neboto just makes you pay for it once instead of on every question.

That's the speed I wanted when I started building it: not a faster console, but no console at all for the small questions.

## Try it

Next time one of these questions comes up, try <kbd>/</kbd> before you open the browser. The [search guide](@/guide/search.md) has every prefix and filter, and the [install guide](@/guide/install.md) gets you running in a minute.
