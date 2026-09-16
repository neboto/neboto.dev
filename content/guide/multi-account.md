+++
title = "Multi-account"
description = "Profiles, assuming into Organizations member accounts, and why an assumed session cannot mutate."
weight = 60
+++

## Profiles

<kbd>P</kbd> switches AWS profile, read from `~/.aws/config` and
`~/.aws/credentials`. Every client is rebuilt and every cache cleared, so
the next load is against the new account. The active profile shows in the
top bar.

## Assume into a member account

<kbd>s</kbd> on an Organizations account row (`@orgs`) assumes a role into
that member account and re-points the whole app at it. While assumed, the
tab bar shows a `⇄ name (id)` badge, and exiting lands you back on the
account list, so *assume → inspect → exit → next account* is a tight loop.

Configure the role name with `org_access_role` (default
`OrganizationAccountAccessRole`); a list under `org_access_roles` opens a
picker.

<kbd>P</kbd> also offers **assume by account id**, for hopping to an account
you cannot enumerate with `organizations:ListAccounts`.

## The read-only guarantee holds across accounts

Every assumed session is scoped with the AWS-managed `ReadOnlyAccess`
**session policy**. Even if the underlying role is an administrator, the
credentials neboto holds cannot mutate anything. This is the reason neboto
stays read-only as a design constraint: a write action would either fail
silently cross-account or force that guarantee to be weakened.

## Macros for the routine

`@orgs → Accounts → that account → assume → @sh` is a routine. Press
<kbd>,</kbd>, <kbd>n</kbd> to record it once, name it, and replay it with one
key or from the command line with `--macro NAME`. Macros record the
*meaning* of each step (the account you selected, the service you switched
to) rather than raw keystrokes, so they survive a reordered list.
