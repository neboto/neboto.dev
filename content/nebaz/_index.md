+++
title = "nebaz"
description = "A fast, keyboard-driven, read-only terminal UI for browsing Azure. The Azure sibling of neboto."
template = "nebaz.html"
aliases = ["/azure/"]
+++

## What you get

- **20 Azure services, one search.** `@vm web`, `@nsg`, `@aca`: an `@prefix` switches service and fuzzy-matches the rest. About 50 lists, every one subscription-wide.
- **Console-style detail panes.** The overview, the type's own sections, then **Access** (the role assignments that apply, principals named through Microsoft Graph), **Activity** (who did what this week) and **Related**.
- **Follow the links.** <kbd>Enter</kbd> on any ARM id jumps to that resource, across services, resource groups and subscriptions. <kbd>⌫</kbd> comes back.
- **Network access lens.** <kbd>N</kbd> on a VM, NIC, subnet or NSG: the NSG rules that apply, in priority order with the defaults, shadowed rules marked.
- **"What changed?"** <kbd>W</kbd> merges the Activity Log, Resource Health and fired alerts for one resource. `@changes` does it subscription-wide.
- **`@audit`.** Over 50 security checks: world-open NSG rules, public storage and vaults, open SQL firewalls, expiring app credentials, privileged guests and service principals.
- **Metrics in place.** <kbd>m</kbd> charts Azure Monitor metrics in the pane, a curated set per type.
- **Copy, never run.** <kbd>C</kbd> picks an `az` command to copy, with the ids filled in. nebaz runs none of them.
