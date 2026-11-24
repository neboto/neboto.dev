+++
title = "Charts: the surprise feature"
description = "I didn't expect to use terminal charts much when they landed in neboto. One Fargate proxy issue later, hitting m became muscle memory."
+++

When charts landed in neboto, it was a moment that took me by surprise. When I saw the first chart in a demo, I thought it looked pretty cool, but I wasn't convinced I'd use it that much.

## The Fargate proxy that wasn't undersized

Then one day I was having trouble with a Fargate service - a small proxy to cater for private network access. It wasn't always required and was sized as small as possible to save costs, shared between myself and another user. When it seemed to stop working, I immediately thought I'd undersized it and reached for the Terraform code to bump the compute and memory without thinking too much.

I quickly made the changes in the code, but before moving forward and submitting a PR, doubts and questions started to whirl around. I shouldn't be making changes without completely understanding the problem.

neboto, as usual, was running in another tmux pane. I jumped over, switched to the right account with <kbd>P</kbd>, and searched for the service with <kbd>/</kbd> and `@ecs proxy`.

<!-- MEDIA TODO: GIF showing an ECS search and metrics example -->

The service had one active task. I jumped to the task and tailed the logs with <kbd>t</kbd>. Nothing. I jumped back to the service with <kbd>Ctrl-O</kbd> and had a little pause - that's when I thought it was time to look at the CPU and metrics to see what was going on.

I hit <kbd>m</kbd>, and to my surprise the server had been pretty idle for the past hour. Widening the chart out to 24 hours showed the same story: steady, with pretty low load.

Maybe it wasn't undersized after all. I asked my colleague and theirs was working fine, which made it look more like a client issue than a compute problem. Troubleshooting locally, I noticed I had multiple defunct AWS SSM sessions across various panes. After terminating them, my proxy was working again.

## Muscle memory

That was the moment <kbd>m</kbd> went into my muscle memory and the feature really won me over. When I jump around services now, I hit <kbd>m</kbd> a lot just to get a quick visual glance of what's happening right now, or what's been happening over the past hour, day or week. You start to build a relationship with the service and the underlying app, and get a much better understanding of it.

From that point on, the ideas started to flow. WAF, CloudFront, RDS - could I visualise these in a way that gives real value?

## WAF

AWS had a basic WAF dashboard with some simple charts that was quite usable to begin with. At some point over the past few years it was modified into something that just missed the mark (though a recent update seems to have fixed that mistake). Nonetheless, the neboto WAF dashboard - with the ability to filter by rule set and visualise what's happening clearly and concisely - more than holds its own.

Being able to then hit <kbd>x</kbd> to open the sampled requests straight in an editor is another nice touch.

<!-- MEDIA TODO: WAF dashboard screenshot or GIF -->

## RDS

<!-- TODO: Expand RDS section -->

## Try it

Next time something looks off - or you just want a quick glance at how a service is behaving - hit <kbd>m</kbd> before reaching for Terraform or opening the console. If you haven't tried neboto yet, the [install guide](@/guide/install.md) will get you up and running in a minute.
