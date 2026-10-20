+++
title = "neboto - the beginning"
description = "Why I built a fast, keyboard-driven terminal UI for AWS"
+++

The last 12 months have changed how we work. The models and agents have got so good that everything we do has sped up - and our patience has gone with it. We want instant gratification. We want the API to return quicker and the screen to load quicker. We get frustrated when we have to click through multiple screens and browser tabs just to find that one piece of detail (an ID or a metric) we need to move on to the next thing.

Mario Zechner, the creator of the Pi coding agent, said in a recent talk: "slow the f### down". Great advice, but it's hard to do when it feels like we're all on the bus from *Speed* - drop under 50 and everything blows up.

Wanting things to be faster, better and more secure isn't new - it's just been amplified 10x.

Developers have spent years tuning their workflows, trying to find just the right mix that lets them move fast in their chosen domain. Those setups have spawned cult-like followings and plenty of online arguments about which toolset is best. For me, the last decade has mostly been AWS and the terminal.

## The AWS Console

It's a great place to view resources and, contrary to some, I like the look and feel of it. But there are rough edges that have frustrated me for the past decade - switching regions, jumping between services, hunting for the right resource, copying and pasting data. Each one is small on its own, but they add up.

Something as simple as an alert with an instance ID, and the question "what's letting traffic into this?", means switching to the right region, opening EC2, searching for the instance, going to the Security tab, clicking through to each security group and reading its inbound rules. Then doing it all again for the next one.

## The AWS CLI

The CLI fixes some of that, but not all of it. I've always wanted to be able to cache results, fuzzy search them and get back to parts of the data without running the command again or working out which parameter I need to add to my query.

I really enjoyed using JMESPath and jq to filter and extract data. I loved the challenge of building a long-winded filter just to pull out that one field or group things a certain way. It felt so rewarding when you got there, even if it took hours - or in some cases days, when you just kept tweaking it to answer different questions.

Now an agent writes that filter for me in seconds, and that part of my day-to-day work has gone. What used to be a challenge I looked forward to every day feels slow and a bit of a waste of my time. Things have changed so quickly that there's a little bit of sadness, but there's also a lot of excitement and hope about all the other things I can build that bring me joy and solve problems.

## The terminal and the TUI

I've always loved being in the terminal. It's where I feel most comfortable, and the current ecosystem - the tooling, the look and feel, the investment going into the platform - gets me super excited.

What I love most is the speed: moving through things without taking my hands off the keyboard. Tools like tmux, neovim and fzf drive my day. If I can fuzzy search something, I'm happy.

## Years of scripts and tools

Over the years I've built plenty of scripts and tools to make my life easier. If there was a way to automate something, I'd do it. In the early days it was mainly Perl and Bash - I fondly remember my Perl Oracle RAC TUI, which showed the active sessions across a 4-node cluster. Since then it's mostly been Python, and more recently Go. Now I'm jumping on the Rust bandwagon - with agents doing a lot of the driving. All aboard.

## neboto

neboto is a terminal UI for AWS. One search bar across all your services, console-style detail panes for every resource, and every ID, ARN and reference is a link you can follow - across services and even across regions. It only reads, so it never changes anything in your account.

![neboto showing a security group's inbound rules in the detail pane](/media/screenshot.png)

That security group hunt from earlier? <kbd>R</kbd> to pick the region, <kbd>/</kbd> and paste the instance ID, then <kbd>N</kbd>. Every inbound rule from every attached security group in one table, with anything open to the world highlighted. A few keystrokes, no tabs.

neboto was built out of all of the above. I wanted:

- a quicker way to move around AWS that felt like using my terminal tools
- answers to small questions without writing Python or Bash scripts, or configuring anything
- an easy way to fuzzy search AWS data
- an experience that is pure speed - Rust gives me that, even though the API and the network are still most of the bottleneck

## Why not just ask an agent?

I don't think we're at the point where an agent gives you answers in a way that sticks, or is as fast as you if you're really good in the terminal. Why waste tokens on an answer that's a few keystrokes away? Being able to find a resource, look at it and work out what's going on is still a fundamentally great skill. We'll always need the console, or neboto, or some other tool that visualises the thing. You still need to be in control and understand the data in front of you. That muscle memory only grows by using these tools - not by asking a chatbot.

If any of this sounds like you, give [neboto](https://neboto.dev) a go. The [install guide](@/guide/install.md) will get you up and running in a minute, and the source is on [GitHub](https://github.com/neboto/neboto-tui). I'd love to hear what you think - and what you'd want it to do next.
