+++
title = "Browsers"
description = "Walk a bucket like a file manager, open a Terraform state and jump to its resources, query a DynamoDB table in one line."
weight = 55
+++

Two resources hold data rather than configuration: an S3 bucket and a
DynamoDB table. Each gets a browser that opens **inside the detail pane**,
takes over the keymap while open, and closes with <kbd>Esc</kbd>.
<kbd>Z</kbd> makes it full-width; <kbd>?</kbd> shows its keys.

## S3 object browser (<kbd>o</kbd>)

<kbd>o</kbd> on a bucket opens a file-manager view of it. Folders are the
bucket's `/`-delimited prefixes; <kbd>Enter</kbd> descends, <kbd>h</kbd> goes
up a level, and <kbd>/</kbd> filters the current listing as you type.

| Key | Action |
|---|---|
| <kbd>Enter</kbd> / <kbd>l</kbd> | Open a folder · preview an object |
| <kbd>h</kbd> / <kbd>⌫</kbd> | Up one level |
| <kbd>/</kbd> | Filter the current listing |
| <kbd>f</kbd> | Recursive: every object under this prefix, flat |
| <kbd>V</kbd> | Version history: every version, including the delete markers a normal listing hides |
| <kbd>s</kbd> / <kbd>S</kbd> | Cycle the sort column / flip the direction |
| <kbd>n</kbd> | Load the next page |
| <kbd>i</kbd> | Object metadata panel: size, type, storage class, encryption and KMS key, ETag, user metadata. <kbd>Tab</kbd> focuses it, <kbd>y</kbd> copies a value, <kbd>Y</kbd> copies all |
| <kbd>v</kbd> | View the object as text (the head of a large file) |
| <kbd>e</kbd> | Open the object in `$EDITOR` (up to 1 MiB) |
| <kbd>d</kbd> | Download the object into the working directory |
| <kbd>p</kbd> | Copy a presigned GET URL, valid for one hour |
| <kbd>y</kbd> | Copy the `s3://` URI |
| <kbd>B</kbd> | Bookmark this object; restoring it reopens the browser at the same key |
| <kbd>t</kbd> | Open a `.tfstate` in the Terraform state viewer (below) |

Version mode is the one to reach for when "the object is gone": a deleted
key is simply absent from a normal listing, but its versions and the delete
marker on top are still there, and <kbd>v</kbd>, <kbd>e</kbd>, <kbd>d</kbd>
and <kbd>p</kbd> all act on the selected version.

The browser makes read calls only: `ListObjectsV2`, `ListObjectVersions`,
`HeadObject` and `GetObject`. A presigned URL is signed locally with your
own credentials and is never sent anywhere.

## Terraform state viewer

Select a `.tfstate` (or `.tfstate.backup`) object in the browser and press
<kbd>t</kbd>. neboto fetches and parses it, closes the browser, and shows a
**Terraform State** pane: the state version, serial and Terraform version in
the header, then one row per resource instance grouped by module, with the
Terraform address on the left and the real ARN or id on the right.

```
root  ·  12 resources

  aws_vpc.main                          vpc-0a1b2c3d4e5f60718        →
  aws_nat_gateway.this[0]               nat-0f9e8d7c6b5a49382        →
  aws_iam_role.app                      arn:aws:iam::123456789012:role/app  →

module.db  ·  3 resources

  aws_db_instance.primary               db-ABCDEFGHIJKLMNOPQRSTUVWXYZ  →
```

<kbd>Enter</kbd> on a row jumps to that resource through the same
link-following as any other detail row, across services and regions. That
is the point of the viewer: from a state file to the live resource without
copying an id into a search box. <kbd>y</kbd> copies a row, <kbd>Esc</kbd>
closes the pane.

`count` and `for_each` instances get one row each with their index
(`[0]`, `["blue"]`), data sources read `data.aws_ami.ubuntu`, and the pane
ends with a per-provider count and the state's outputs. Nothing is written
anywhere: the state is read once with `GetObject`, parsed in memory, and
dropped when the pane closes.

## DynamoDB item browser (<kbd>i</kbd>)

<kbd>i</kbd> on a table opens a query line above a result table. You write
conditions, and neboto works out how to read them:

```
pk = "USER#42" and sk begins_with "ORDER#" and total > 100
status in (pending, shipped) or not coupon exists
address.city = Perth and tags contains gift
```

The language has `and`, `or`, `not`, `=`, `<>`, `<`, `<=`, `>`, `>=`,
`between`, `begins_with`, `contains`, `exists` and `in (…)`, with nested
paths (`a.b[0].c`) and backticks for awkward names (`` `order-id` ``). A
quoted value is always a string. A bare one is a number when it looks like
one, otherwise a string, and a key attribute's declared type wins.

**Query or Scan.** If the query pins an index's partition key with `=`,
it's a Query on that index (the table first, then its GSIs and LSIs), with
one sort-key condition as part of the key and everything else as the
filter. Otherwise it's a Scan. The plan line under the query says which,
on which index, why, and roughly what one read costs in RCU, while you
type. <kbd>Ctrl-N</kbd> pins an index yourself, for example to scan a
sparse GSI.

**Reads.** <kbd>Enter</kbd> reads pages until it has 50 matches or has
looked at 5,000 items, whichever comes first, so a selective filter doesn't
come back empty with matches further in. <kbd>n</kbd> reads more of the
query that ran, <kbd>Esc</kbd> stops a read, and <kbd>↑</kbd> /
<kbd>↓</kbd> on the query line step through that table's history.

| Key | In the results |
|---|---|
| <kbd>Enter</kbd> | Open the item |
| <kbd>/</kbd> | Filter the loaded rows (no API call) |
| <kbd>←</kbd> / <kbd>→</kbd> | Move between columns and scroll |
| <kbd>z</kbd> | Sort the loaded rows by the column |
| <kbd>n</kbd> | Read more |
| <kbd>y</kbd> | Copy |
| <kbd>C</kbd> | Copy the read as an `aws dynamodb query` or `scan` command, or `get-item` for the selected item |
| <kbd>Tab</kbd> | Back to the query line |

Key columns are pinned on the left, and the rest follow, most common first.
In the item view, <kbd>v</kbd> switches between typed rows, JSON and
DynamoDB JSON, <kbd>/</kbd> finds lines (<kbd>n</kbd> / <kbd>N</kbd>),
<kbd>V</kbd> selects, <kbd>y</kbd> copies the line's value or the
selection, <kbd>Y</kbd> the whole item and <kbd>e</kbd> opens it in your
editor. The copied CLI command carries `--max-items 50` and `--page-size`
so a pasted Scan doesn't read the whole table.

The same key opens a session browser on a Bedrock AgentCore memory store:
actors, their sessions, and the events within, with <kbd>t</kbd> switching to
the store's long-term records.
