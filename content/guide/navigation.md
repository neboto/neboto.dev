+++
title = "Navigation"
description = "The keys that do most of the work: list pane, detail pane, links, sub-tabs."
weight = 30
+++

The keymap is vim-flavoured: <kbd>j</kbd>/<kbd>k</kbd> move, <kbd>h</kbd>/<kbd>l</kbd>
move between panes, and most verbs are a single letter. Inside the app,
<kbd>?</kbd> opens the full reference.

## Anywhere

| Key | Action |
|---|---|
| <kbd>S</kbd> / <kbd>R</kbd> / <kbd>P</kbd> | Service / region / profile picker |
| <kbd>@</kbd> | Search bar seeded with `@`, for a fast service switch |
| <kbd>/</kbd> | Fuzzy search the current service |
| <kbd>r</kbd> | Refresh: the whole service from the list, just this resource from the detail pane |
| <kbd>w</kbd> | Watch mode (auto-refresh); <kbd>+</kbd> / <kbd>-</kbd> tune the interval |
| <kbd>,</kbd> | Macros: <kbd>Enter</kbd> run, <kbd>n</kbd> record, <kbd>,</kbd> again to stop recording |
| <kbd>`</kbd> | Jump list (navigation history) |
| <kbd>B</kbd> / <kbd>'</kbd> | Bookmark this location / open bookmarks |
| <kbd>M</kbd> | Message history (past errors and toasts) |
| <kbd>&#92;</kbd> | Flat detail view: every section in one scroll |
| <kbd>?</kbd> / <kbd>q</kbd> | Help / quit |

## List pane

| Key | Action |
|---|---|
| <kbd>j</kbd> <kbd>k</kbd> <kbd>↑</kbd> <kbd>↓</kbd> | Move |
| <kbd>gg</kbd> / <kbd>G</kbd> | Top / bottom |
| <kbd>Ctrl-d</kbd> / <kbd>Ctrl-u</kbd> | Half page |
| <kbd>l</kbd> <kbd>→</kbd> <kbd>Enter</kbd> | Open the detail pane |
| <kbd>h</kbd> <kbd>←</kbd> <kbd>Backspace</kbd> <kbd>Ctrl-O</kbd> | Back through history |
| <kbd>Tab</kbd> / <kbd>Shift-Tab</kbd>, <kbd>1</kbd>–<kbd>9</kbd>, <kbd>0</kbd> | Switch sub-tab |
| <kbd>a</kbd> | Hide noisy rows (defaults, automated snapshots, passed checks…) |
| <kbd>z</kbd> | Cycle sort: load order → name ↑ → name ↓ → state |
| <kbd>F</kbd> | Cycle a filter over the states present in this view |
| <kbd>V</kbd>, <kbd>J</kbd> / <kbd>K</kbd> | Visual row selection; <kbd>Ctrl-A</kbd> selects all |
| <kbd>y</kbd> | Copy the id or ARN, or the selection as a Markdown table |
| <kbd>C</kbd> | Copy the equivalent read-only AWS CLI command |
| <kbd>X</kbd> / <kbd>Ctrl-X</kbd> | Export the resource (deep) / the list |

## Detail pane

| Key | Action |
|---|---|
| <kbd>j</kbd> <kbd>k</kbd>, <kbd>gg</kbd> / <kbd>G</kbd> | Scroll |
| <kbd>Tab</kbd> / <kbd>Shift-Tab</kbd>, <kbd>1</kbd>–<kbd>9</kbd> | Switch section |
| <kbd>[[</kbd> / <kbd>]]</kbd> | Previous / next group header |
| <kbd>l</kbd> <kbd>→</kbd> <kbd>Enter</kbd> | Follow the link under the cursor |
| <kbd>h</kbd> <kbd>←</kbd> <kbd>Esc</kbd> <kbd>Ctrl-O</kbd> | Back |
| <kbd>/</kbd> | Filter the body text |
| <kbd>y</kbd> / <kbd>c</kbd> | Copy the row, or the visual selection |
| <kbd>e</kbd> | Open in `$EDITOR` |
| <kbd>Z</kbd> | Full-width pane |

## Following links

Rows that end in `→` are links: an instance's subnet, a role's ARN, a
CloudFormation stack name in a tag, an S3 URI in a Glue job. <kbd>Enter</kbd>
follows them across services, and across regions where the target lives
elsewhere. <kbd>Ctrl-O</kbd> or a right-click walks back through the history
you built, and <kbd>`</kbd> shows the whole jump list.

## Mouse

Clicks select rows and sub-tabs, double-click drills in or follows a link,
right-click goes back, and the wheel scrolls. Hold <kbd>Shift</kbd> while
dragging for your terminal's native text selection.
