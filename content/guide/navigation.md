+++
title = "Navigation"
description = "The keys that do most of the work: list pane, detail pane, links, sub-tabs."
weight = 30
+++

The keymap is vim-flavoured: <kbd>j</kbd>/<kbd>k</kbd> move, <kbd>h</kbd>/<kbd>l</kbd>
move between panes, <kbd>H</kbd>/<kbd>L</kbd> step through sub-tabs, and most
verbs are a single letter. Inside the app, <kbd>?</kbd> opens the full
reference, and <kbd>:</kbd> runs any command by name, so you don't need to
remember the key.

## Anywhere

| Key | Action |
|---|---|
| <kbd>S</kbd> / <kbd>R</kbd> / <kbd>P</kbd> | Service / region / profile picker, each fuzzy-filtered as you type |
| <kbd>@</kbd> | Search bar seeded with `@`, for a fast service switch |
| <kbd>/</kbd> | Fuzzy search the current service |
| <kbd>r</kbd> | Refresh: the whole service from the list, just this resource from the detail pane |
| <kbd>w</kbd> | Watch mode (auto-refresh); <kbd>+</kbd> / <kbd>-</kbd> tune the interval. Over the charts (<kbd>m</kbd>) it refreshes them, at most once a minute |
| <kbd>,</kbd> | Macros: <kbd>Enter</kbd> run, <kbd>n</kbd> record, <kbd>,</kbd> again to stop recording |
| <kbd>`</kbd> | Jump list (navigation history) |
| <kbd>B</kbd> / <kbd>'</kbd> | Bookmark this location / open bookmarks |
| <kbd>M</kbd> | Message history (past errors and toasts) |
| <kbd>&#124;</kbd> | Split out: open this exact place in a second neboto beside this one (see [Split out](#split-out)) |
| <kbd>&#92;</kbd> | Flat detail view: every section in one scroll |
| <kbd>:</kbd> | Command picker: type what you want (`network`, `metrics`) and <kbd>Enter</kbd> runs its key. What works on the selection is listed first |
| <kbd>Ctrl-L</kbd> | Repaint the screen |
| <kbd>?</kbd> / <kbd>q</kbd> | Help, led by the keys that work here; type to filter it / quit |

## List pane

| Key | Action |
|---|---|
| <kbd>j</kbd> <kbd>k</kbd> <kbd>↑</kbd> <kbd>↓</kbd> | Move |
| <kbd>gg</kbd> / <kbd>G</kbd> | Top / bottom |
| <kbd>Ctrl-d</kbd> / <kbd>Ctrl-u</kbd> | Half page |
| <kbd>l</kbd> <kbd>→</kbd> <kbd>Enter</kbd> | Open the detail pane |
| <kbd>Backspace</kbd> <kbd>Ctrl-O</kbd> | Back through history |
| <kbd>Ctrl-F</kbd> | Forward again, after going back |
| <kbd>Tab</kbd> / <kbd>Shift-Tab</kbd>, <kbd>1</kbd>–<kbd>9</kbd>, <kbd>0</kbd> | Switch sub-tab |
| <kbd>H</kbd> / <kbd>L</kbd> | Previous / next sub-tab (from either pane) |
| <kbd>a</kbd> | Hide noisy rows (defaults, automated snapshots, passed checks…) |
| <kbd>z</kbd> | Cycle sort: load order → name ↑ → name ↓ → state (→ service, under `@all`) |
| <kbd>F</kbd> | Cycle a filter over the states present in this view |
| <kbd>V</kbd>, <kbd>J</kbd> / <kbd>K</kbd> | Visual row selection; <kbd>Ctrl-A</kbd> selects all |
| <kbd>y</kbd> | Copy the id or ARN, or the selection as a Markdown table |
| <kbd>C</kbd> | Copy an AWS CLI command: the read command, plus start/stop, scale, force-deploy and connect commands where they apply (copied, never run; see [What's new](@/guide/whats-new.md)) |
| <kbd>X</kbd> / <kbd>Ctrl-X</kbd> | Export the resource (deep) / the list |

## Detail pane

| Key | Action |
|---|---|
| <kbd>j</kbd> <kbd>k</kbd>, <kbd>gg</kbd> / <kbd>G</kbd> | Scroll |
| <kbd>Tab</kbd> / <kbd>Shift-Tab</kbd>, <kbd>1</kbd>–<kbd>9</kbd> | Switch section |
| <kbd>H</kbd> / <kbd>L</kbd> | Previous / next sub-tab, staying in the detail pane |
| <kbd>[[</kbd> / <kbd>]]</kbd> | Previous / next group header |
| <kbd>l</kbd> <kbd>→</kbd> <kbd>Enter</kbd> | Follow the link under the cursor |
| <kbd>h</kbd> <kbd>←</kbd> <kbd>Esc</kbd> | Back to the list |
| <kbd>Backspace</kbd> <kbd>Ctrl-O</kbd> | Back through history (the `←` at the service strip's left edge lights when there's somewhere to go) |
| <kbd>Ctrl-F</kbd> | Forward again, after going back (`→` on the service strip) |
| <kbd>/</kbd> | Filter the body text; matches are marked, and <kbd>n</kbd> / <kbd>N</kbd> step through them |
| <kbd>Ctrl-W</kbd> | Wrap long values onto continuation rows, instead of clipping them at the pane edge |
| <kbd>y</kbd> / <kbd>c</kbd> | Copy the row, or the visual selection (works over SSH too; see [Copying](#copying)) |
| <kbd>C</kbd> | Copy an AWS CLI command for this resource (same picker as the list) |
| <kbd>e</kbd> | Open in `$EDITOR` |
| <kbd>Z</kbd> | Full-width pane |

## Following links

Rows that end in `→` are links: an instance's subnet, a role's ARN, a
CloudFormation stack name in a tag, an S3 URI in a Glue job. <kbd>Enter</kbd>
follows them across services, and across regions where the target lives
elsewhere: an ARN in another region switches you there, and going back
switches you back, even out of a global service like CloudFront. <kbd>Backspace</kbd>, <kbd>Ctrl-O</kbd> or a right-click walks
back through the history you built, <kbd>Ctrl-F</kbd> comes forward again
like a browser, and <kbd>`</kbd> shows the whole jump list. A new jump after
going back drops the forward history.

## Split out

<kbd>&#124;</kbd> opens a second neboto beside this one, at the same place:
service, sub-tab, row, detail section, lens, region and account. The
session's flags (`-r`, `-p`, `--endpoint-url`, `--demo`, `-w`) go with it,
so with watch on the new pane watches too. Credentials are never written
into the command.

It works from the in-pane views as well: the charts come back at their
range, the object browser at the object, and the other views as the pane
behind them. It's off only while a view is taking text.

| Terminal | Opens |
|---|---|
| tmux, zellij, WezTerm, kitty (with remote control), iTerm, Ghostty on macOS | A new pane |
| GNOME Terminal, Konsole | A new tab |
| Alacritty, Terminal.app, foot, kitty without remote control, Ghostty on Linux | A new window |

Each way is tried best first, and the status line says what it opened. For
anything else, set `split_command` (see
[Configuration](@/guide/configuration.md)). If nothing opens, neboto says
why and copies the command so you can run it yourself.

## Copying

Every copy (<kbd>y</kbd>, <kbd>c</kbd>, <kbd>C</kbd>, <kbd>Y</kbd>) goes to
the system clipboard and also out as an OSC 52 escape, which your own
terminal turns into a clipboard write. So copying works on a bastion, over
SSM or inside a container, where there's no local display. Inside tmux,
turn on `set -g set-clipboard on`.

## Mouse

Everything on screen that names a key can be clicked. The keyboard is still
faster, but nothing needs it.

| Gesture | Does |
|---|---|
| Click | Select a row, switch a tab or section, open a picker from a badge, press a status-bar hint (`m metrics`, `W trail`…) |
| Double-click | <kbd>Enter</kbd>: open the detail pane, follow a link, confirm a picker row, drill into a folder |
| Click a `→` | Follow that link |
| Click the detail pane's title bar | Full width (<kbd>Z</kbd>) |
| Click `←` / `→` at the service strip's left edge | Back / forward through history |
| Click a `‹` / `›` | Scroll the tabs |
| Wheel | Scroll the list, the detail body, a picker, or an in-pane view (scrolling up in a log tail pauses it) |
| Drag | Select a range of rows; <kbd>y</kbd> copies them |
| Right-click | Back (<kbd>Ctrl-O</kbd>); in a popup or an in-pane view, close it |
| Click outside a popup | Close it |

neboto captures the mouse, so a plain drag selects rows rather than text.
Hold <kbd>Shift</kbd> while dragging for your terminal's own text selection
(<kbd>Option</kbd> in iTerm2).
