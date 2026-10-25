+++
title = "What's new"
description = "What changed in each release since v0.1.0, newest first, with links to the full notes and binaries."
weight = 90
+++

What changed in each release since `v0.1.0`, newest first. The full notes
and binaries are on the
[releases page](https://github.com/neboto/neboto-tui/releases). The
installer always fetches the latest release, so re-running it upgrades you.

## v0.10.0

This release rebuilds the metrics view. Every resource kind now charts
through the same view, so <kbd>m</kbd> works the same everywhere and
shows the same things.

### One metrics view for every kind

<kbd>m</kbd> opens one row per metric, each with a sparkline and its last,
min, max and average in the right unit (`%`, `ms`, `MiB`, bits/s). Below
them is a large chart of the selected row. <kbd>j</kbd> / <kbd>k</kbd> pick
a row, and metrics that belong together, such as bytes in and out, share
one chart.

- **Range:** <kbd>1</kbd>–<kbd>5</kbd> pick 1h, 6h, 24h, 7d or the new
  **30d**, and <kbd>[</kbd> / <kbd>]</kbd> step through them. If nothing
  was published in the window, the view says so and suggests a longer range.
  A stopped instance publishes nothing, for example.
- **Statistic:** <kbd>s</kbd> cycles the selected metric through Average,
  Maximum, Sum, Minimum and p99.
- **Any metric:** <kbd>a</kbd> lists every metric CloudWatch has for the
  resource (from `ListMetrics`), and <kbd>Enter</kbd> charts it.
  <kbd>d</kbd> goes back to the default set.
- **Where it comes from:** the range row ends with the namespace and the
  home region, dimmed. A CloudWatch metric row also shows its dimensions,
  since its name alone doesn't say which queue or instance it's for.
- **One call:** opening the view makes one `GetMetricData` call. If a
  metric can't be read, the others still chart, and the range row counts
  the failures as `unread`.

Every kind that charted before still charts. It's now the same view across
EC2, EBS, Lambda, RDS, ECS, Auto Scaling, EKS, API Gateway, load balancers,
OpenSearch, DMS, DynamoDB, EFS, ElastiCache, Kinesis, Firehose, Redshift,
SQS, SNS, Step Functions, Bedrock, Transfer, NAT, VPN, Direct Connect, ECR,
WorkSpaces, Athena, Glue, Transit Gateway, log groups, EventBridge rules,
Resolver endpoints, CodeBuild, CloudFront, Route 53 and Global Accelerator.
A few kinds also chart more than before:

- **ECS:** service CPU and memory come from `AWS/ECS`, so they chart
  without Container Insights. A task gets one CPU and memory line per
  container.
- **Redshift:** `HealthStatus` charts. It's read as Minimum, which the old
  view never asked for.
- **GENEVE target groups** query `AWS/GatewayELB` instead of `NetworkELB`.

### Changes on the chart, and back again

- **<kbd>W</kbd> from the chart:** <kbd>W</kbd> opens the change timeline
  for the events marked on the chart. <kbd>Esc</kbd> takes you back to the
  charts with the same range, statistic, row and picked metrics. The
  timeline covers the chart's range, up to 30 days.
- **A shorter legend:** the legend on the chart's bottom border lists each
  event once with a count, such as `StopInstances ×7`.
- **Honest about gaps:** CloudTrail's `LookupEvents` stops after 50 matches.
  When it stops early, the timeline counts CloudTrail as `N+` and says
  `nothing before <time> read`. A chart only says `no changes since <time>`
  for the part it actually read. A nightly scheduler's noise can no longer
  make an unread stretch look quiet.
- While the metrics view or another in-pane view is open, the status bar
  shows no keys and <kbd>:</kbd> is off. The view's own key row is the one
  that applies.

## v0.9.0

This release is about finding things without knowing the key, and reading a
pane at a glance.

### Run any command by name with <kbd>:</kbd>

<kbd>:</kbd> opens a command picker. Type what you want, such as `network`
or `metrics`, and <kbd>Enter</kbd> runs its key, exactly as if you'd
pressed it. With nothing typed, the commands that work on the selection come
first. With a query, the best match is on top, and an exact key wins, so
`:m` puts metrics first. It only lists what works in the pane you're in.

### Help you can search

- **Type to filter:** <kbd>?</kbd> filters as you type, over keys,
  descriptions and section titles, and shows the matches at full width
  instead of cutting them off. <kbd>Esc</kbd> clears the filter, then
  closes. The arrow keys scroll; <kbd>j</kbd>, <kbd>k</kbd> and
  <kbd>q</kbd> are now filter text.
- **Here:** help opens with the keys that work on the selected resource.
  On an EC2 instance that's <kbd>m</kbd> <kbd>W</kbd> <kbd>U</kbd>
  <kbd>N</kbd> <kbd>s</kbd>. <kbd>W</kbd> is now called the change
  timeline everywhere.
- **Status bar:** `: commands · ? help · q quit` are always shown. Before,
  they were the first hints cut, so they only appeared on very wide
  terminals. `j/k`, `H/L` and bookmarks left the bar to make room, and
  they're still in <kbd>?</kbd> and <kbd>:</kbd>.

### Overviews that answer the first question

On every pane with more than one section, the first is now called
**Overview**. 66 panes called it Details, and Lambda, RDS, SNS, CloudWatch alarms and StackSets called it
Config. On these panes the Overview also gives a short summary:

- **Security groups:** the rules open to the internet, folded into one line
  per protocol and source, then the first eight rules each way.
- **Network ACLs:** what each direction does (allows all, denies all, or
  how many rules of each), then the first rules and subnets.
- **Route tables:** whether the table is public, private via NAT or
  isolated, from its default routes, plus propagating VPN gateways and blackhole routes.
- **Transit gateway route tables:** default association and propagation,
  attachments by kind, route counts and blackholes.
- **Target groups:** `3 healthy · 1 unhealthy · 1 draining`, why the
  failing targets fail, the health check, and the load balancers in front.
- **Hosted zones:** records against the limit, DNSSEC, query logging, name
  servers or VPCs, then the first records.

> **Scripts:** `neboto get --section details` and `--section config` are
> now `--section overview`. A pane with a single section still calls it
> `details`, and MSK's and Redshift's later Config sections keep their name.

### A calmer detail pane

- **One-row header:** the name, the state in its colour, then the key
  facts, on one line. The rows it frees go to the body.
- **Steady scrolling:** <kbd>k</kbd> moves the cursor, and the view only
  scrolls when the cursor would leave it. No section starts or ends on a
  blank row any more, so <kbd>G</kbd> lands on the last real row.
- **Section bar:** it scrolls to the active section with `‹` / `›`, so you
  can see all nine of an EC2 instance's sections.
- **Body filter:** <kbd>/</kbd> marks its matches in place and counts them
  properly. <kbd>n</kbd> / <kbd>N</kbd> step through them while the filter
  is on.
- **Footer and rows:** every key in the footer is clickable and it no longer
  overlaps the ownership ribbon. Rows are indented evenly under their group
  headers, and `(none)` placeholder rows are now plain notes.

## v0.8.0

### `@changes`: what changed recently, account-wide

<kbd>W</kbd> asks what changed around one resource. `@changes` asks what
changed just before something broke, across the whole account. It's one
list, newest first, over a <kbd>[</kbd> / <kbd>]</kbd> window from 15
minutes to 7 days, with sub-tabs **All**, **IAM & Orgs**, **CloudTrail**,
**Config**, **Deploys** and **Scaling & RDS**:

- CloudTrail write events. AWS-service and session events are noise, so
  <kbd>a</kbd> hides them.
- IAM and Organizations changes, looked up in us-east-1 whichever region
  you're in, because that's the only place CloudTrail records them. Rows show
  the request parameters and the policy document the call wrote.
- Config's recorded changes, CloudFormation stack events, CodePipeline runs,
  CodeBuild builds, Auto Scaling activities and RDS events.
- ECS deployments and service events: the failed-to-start tasks and
  circuit-breaker rollbacks that CloudTrail never sees.

Each source streams in as it finishes, and a denied one is a warning rather
than an error. CloudTrail is read up to its newest 500 write events, and the
warning says how far back that reached. See [Logs, metrics and
lenses](@/guide/lenses.md#what-changed-account-wide-changes).

### Change markers on charts

<kbd>m</kbd> charts now draw the resource's change timeline as vertical
lines: CloudTrail changes, deploys, stack events, Auto Scaling and RDS
events, alarm changes. Failed ones are in the error colour, and a legend on
the pane's bottom border names them newest first. A spike that lines up
with a deploy is now obvious. <kbd>c</kbd> toggles them for the session.

### Several regions at once

- **Config `regions`:** the regions you work in, e.g.
  `regions = ["ap-southeast-2", "us-east-1"]`. See
  [Configuration](@/guide/configuration.md).
- **Counts in <kbd>R</kbd>:** with `regions` set, the region picker lists
  the current service in each of them and shows its row count, or `denied`
  where an SCP blocks the region. Switching to one of them is then instant,
  and switching region no longer throws the cache away.
- **History across regions:** <kbd>Backspace</kbd> and <kbd>Ctrl-F</kbd>
  take you back to the region you were in, and the footer says when they
  will.
- **`neboto ls --regions`:** lists a regional service across your
  configured regions, or `--regions=us-east-1,eu-west-1` for one run, with a
  region column. A denied region is reported and skipped. See [Scripts and
  agents](@/guide/cli.md#across-regions).

### Network ACLs in <kbd>N</kbd>

The network access lens now shows the subnets' network ACLs under the
security-group rules, in rule order. Denies are in the warning colour, and
an ACL that allows everything is labelled `allow-all`. <kbd>Enter</kbd>
jumps to the ACL. Load balancers get them too.

### Fuzzy pickers

The service (<kbd>S</kbd>), region (<kbd>R</kbd>), profile (<kbd>P</kbd>),
Cost group-by and Service Quotas pickers all filter fuzzily now, best match
first: `apadm` finds `acme-prod-admin`. An exact match still wins, so `ec2`,
`s3` and `r53` land on their service. Thanks to
[@jesperalmstrom](https://github.com/jesperalmstrom) for the profile picker,
their first contribution.

### Fixes

- **Dependencies:** `rustls-webpki` 0.103.16 and `webpki-roots` 1.0.10, for
  RUSTSEC-2026-0382 and RUSTSEC-2026-0381. The first applies to every AWS
  connection: it could accept a distrusted intermediate certificate.

## v0.7.0

### `@audit` reads what the lists don't carry

`@audit` no longer stops at what's loaded. After the source lists land,
<kbd>r</kbd> reads the account settings no list carries, once per account
and region:

- the S3 account-level public access block. A bucket finding it fully covers
  drops to low.
- EBS encryption by default.
- a logging, multi-region CloudTrail trail.
- the Config recorder, GuardDuty and an Access Analyzer.

It also checks resources one at a time, up to 100 of each kind: KMS key
rotation on customer-managed keys, IAM users with a console password but no
MFA, access keys older than 90 days, and EBS or RDS snapshots that are
public or shared with another account. KMS joins EC2, RDS, S3, EKS and IAM
as a source.

A denied call is a `not checked — no permission for kms:GetKeyRotationStatus`
row rather than an error, so a narrow role shows what it couldn't see.
`neboto audit` does all of this in one run. Account-level findings, such as
GuardDuty being off, have `service: null` and an empty `resource_id` in
`-o json`.

In an Organizations member account, the organization's analyzer lives in
the management or delegated-admin account and the member can't see it. "No
Access Analyzer" is now *not checked* there instead of a low finding, which
used to fail `neboto audit`'s default `--fail-on low` in every member
account. A standalone account still gets the finding.

### IAM: who used what, and the credential report

- **Last Accessed** (Access Advisor) on roles, users, groups and managed
  policies: every service granted, most recently used first, with when and
  in which region. After those come the services not used in IAM's 400-day
  tracking window, which are the ones to remove for least privilege.
- **Credential Report** on the Account pane: console users without MFA,
  active keys older than 90 days, and keys and passwords unused for 90 days
  or more, then a row per user, root first. neboto only reads the latest
  report and never generates one. With no current report, the section tells
  you to run `aws iam generate-credential-report` and press <kbd>r</kbd>.

### RDS Proxies

RDS has a **Proxies** sub-tab (<kbd>7</kbd>). A proxy's Overview shows its
network, TLS, IAM role, idle timeout and auth entries. Secrets Manager ARNs
appear only as references. **Targets** shows the connection-pool settings
and the health of each target, flags unavailable ones, and jumps to the
instance or cluster.

RDS also shows **blue/green deployments** on the Config section of both
sides, with the other side one jump away. A deployment that has already
switched over is labelled as history.

### More in the detail pane

- **S3:** an **Access Points** section on the bucket: network origin, VPC,
  alias and ARN.
- **Security groups:** a group on no network interface is marked
  **unused**, so <kbd>F</kbd> filters to it like an unattached volume. The
  VPC's default group is never marked. Unused doesn't mean safe to delete:
  rules in other groups, launch templates and shared-VPC interfaces can
  still refer to it, and the **Used By** section says so.
- **ECS clusters:** a **Capacity Providers** section with the backing Auto
  Scaling group, managed scaling, termination protection and the default
  strategy. A Fargate-only cluster makes no call.
- **Auto Scaling groups:** a **Lifecycle** section with lifecycle hooks and
  the warm pool, plus the instances in it.
- **Cognito user pools:** a **Groups** section with precedence, IAM role
  and members. A member whose username is just their `sub` shows their email
  instead.
- **Identity Center applications:** an **Auth** section with authentication
  methods, access scopes and grants. Each part loads separately, so one
  denied call doesn't hide the other two.
- **EBS snapshots:** fast snapshot restore is flagged `⚠` with a row per
  AZ, since AWS bills it per AZ-hour.
- **EC2 instances:** a **CPU Credits** row (standard or unlimited) on
  T-family instances.

### Getting around

- **Forward as well as back.** After <kbd>Backspace</kbd> or
  <kbd>Ctrl-O</kbd>, <kbd>Ctrl-F</kbd> goes forward again, like a browser.
  The detail footer names where each one goes (`⌫ back to EC2 i-0abc`,
  `⌃F forward to …`), and you can click it. <kbd>Backspace</kbd> now works in
  the detail pane as well.
- **Search history:** <kbd>↑</kbd> / <kbd>↓</kbd> in the <kbd>/</kbd> bar
  bring back this session's earlier searches. They're kept in memory only.
- **List summaries:** the list's dim second column now shows the EC2
  instance type, Lambda runtime, RDS engine, version and class, and an ECS
  service's running and desired count.
- **Pinned services:** `pinned_services = ["ec2", "ecs", "lambda"]` puts
  those chips on the service strip at startup. Nothing loads until you open
  one. See [Configuration](@/guide/configuration.md).

### Fixes

- **History:** going back after moving to another row returns to the row
  you left, not one you passed through. Back no longer bounces straight
  into a service you switched to with `@`.
- **`@audit`:** a failed `GetAccessKeyLastUsed` reads `unknown`, not `never
  used`. "Old and never used" sounds like "delete it". An RDS instance
  snapshot and a cluster snapshot with the same name no longer mix up their
  sharing settings.
- **Selections:** in the flat detail view, a <kbd>V</kbd> selection now
  highlights every line <kbd>y</kbd> will copy. An export of mixed `@audit`
  rows is named after the view, not after the first row's check.
- **Dependencies:** `zip` 9, for RUSTSEC-2026-0367 to 0369. neboto never
  called the affected functions.

## v0.6.0

### Security findings: `@audit`

`@audit` is a service whose rows are findings: security checks run over what
neboto has already loaded, with no API calls of its own.

- **Network:** security groups open to the world, graded by port (admin and
  database ports are high).
- **Data:** public or unencrypted RDS, unencrypted EBS volumes and
  snapshots, S3 buckets without a full public access block.
- **Compute:** instances allowing IMDSv1, public AMIs, EKS endpoints open to
  `0.0.0.0/0`.
- **Account:** root MFA, root access keys, the password policy.
- **Access Analyzer:** its public findings, relayed.

Severity is the row's state, so <kbd>F</kbd> filters by it and <kbd>z</kbd>
sorts by it. <kbd>Enter</kbd> opens the resource at the section that shows
the problem (a security group's Inbound rules, an instance's Security).

A check whose service you haven't loaded says `not checked — @rds not
loaded` rather than passing. <kbd>r</kbd> loads every missing source (EC2,
RDS, S3, EKS, IAM) in the background and re-audits as each one lands.

`neboto audit` does the same from a script: it loads those five services,
runs the checks once and exits `3` when it finds something at or above
`--fail-on`. See [CLI](@/guide/cli.md#audit-security-findings).

### Security groups open to the world

A group with any inbound `0.0.0.0/0` or `::/0` rule now shows a red `●`
labelled **open to world**. <kbd>F</kbd> filters to them, <kbd>z</kbd> sorts
them first, and `neboto ls @ec2 -t "Security Group" --state "open to world"`
gives the same list. Outbound to the world is the AWS default and isn't
flagged.

Rules that reference a **prefix list** now list its CIDRs underneath: the
first eight, then a count.

### AppSync (`@appsync`)

GraphQL APIs, with their auth modes, endpoints, logging and WAF. An API's
pane has **Data Sources**, **Resolvers**, **Functions**, **API Keys** and
**Schema**. <kbd>e</kbd> on Resolvers or Functions opens their code as
`.js`, or as `.vtl` for mapping templates. A Cognito user pool, DynamoDB
table or OpenSearch domain jumps to the resource in its own region.

API key ids *are* the secret, so they're masked when loaded and never shown,
exported or copied.

### IAM: instance profiles

IAM has a **Profiles** sub-tab (<kbd>8</kbd>). A role's Overview lists the
instance profiles wrapping it, and an EC2 instance's profile ARN jumps
there.

### More in the detail pane

Most of these come from responses neboto already fetched, so they need no
new calls.

- **EC2 instances:** CPU options, On-Demand or Spot, tenancy, placement
  group, capacity reservation; an IMDS block in Security, with IMDSv1
  flagged.
- **Auto Scaling:** termination policies and scale-in protection.
- **ECS services:** the Service Connect config in Networking.
- **Load balancers:** a **Key Settings** block (deletion protection,
  cross-zone, idle timeout, access logs) and target-group stickiness,
  deregistration delay and algorithm. An ALB shows the **WAF web ACL**
  protecting it, with `⚠ none` on an internet-facing ALB that has none.
- **ACM:** issuer, private CA and managed-renewal status.
- **SNS:** each subscription's filter policy, DLQ, raw message delivery and
  delivery policy.
- **Secrets Manager:** version stages (never a value), and a
  **Replication** section.
- **SSM parameters:** expiration policies in words, flagged when close.
- **Cognito users:** every attribute; user pools page up to 500 users.
- **S3:** Requester Pays. **MSK:** a **Brokers** section. **CodeArtifact:**
  upstreams and external connections. **Glue:** tags on crawlers and jobs.
  **Firehose:** database (CDC) sources. **SES:** bounce and complaint rates
  in <kbd>m</kbd>, against AWS's review line.
- **Organizations:** account creation status and handshakes.
- **CloudFormation:** service-managed stack sets show up when you're a
  delegated StackSets admin.

### Change timeline: Auto Scaling and RDS

<kbd>W</kbd> adds what AWS itself does, which CloudTrail never records: Auto
Scaling activities for a group (or an instance in one), and RDS events for
an instance or cluster. RDS keeps only 14 days of events, and the 30- and
90-day ranges say so.

### Exports

- **<kbd>X</kbd> on one resource** waits for every section to load before
  writing, like a deep export of a selection. <kbd>Esc</kbd> cancels.
- **JSON, CSV and Markdown carry the same data.** A list export's Markdown
  now has every column the CSV and JSON have.
- **Steadier JSON:** a repeated key is an array of its values, not `X (2)`,
  `X (3)`; a group's count stays out of its key (`"Inbound"`, not
  `"Inbound (2 rules)"`); and a row with indented rows under it nests them,
  with its own value as `"summary"`. This changes the inside of sections in
  `neboto get -o json`, which was never [stable](@/guide/cli.md#what-scripts-can-rely-on);
  section names and envelopes are unchanged.

### Fewer throttles

Switching service, profile or region now stops the load it replaces, rather
than letting it keep paging AWS in the background. AWS calls retry with the
SDK's adaptive mode, up to five attempts, unless your AWS config sets its
own retry mode or attempts.

### Fixes

- **Jumps:** an exact id or name always matches, even when the fuzzy filter
  would have dropped it. A jump to the IAM account settings used to land on
  "no matches".
- **`-s audit`** at startup no longer shows an empty list until a key is
  pressed.
- **Dependencies:** `rustls` 0.23.46, for RUSTSEC-2026-0346 to 0349.

## v0.5.0

### ECR: what the lifecycle policy will delete

A repository's **Lifecycle** section now runs the policy against the images
neboto has loaded, rule by rule in priority order: a plain-English summary,
what it matches, what it can expire now, what's due in the next seven days
and, for count rules at their limit, what the next push will expire. Any
image that running ECS tasks use and that expires within a week gets a `⚠`
line naming the tasks. The raw JSON is still underneath.

### ECR and ECS: running images at risk

If a running task's image digest is **untagged**, an untagged-expiry rule
can delete it, and new tasks then fail with `CannotPullContainerError`. A
`⚠` line now says so on the image, the repository, the ECS service and the
task. The same panes say when the digest is **no longer in the repository**.
`Tag Mutability: MUTABLE` becomes a warning when running containers pull
from that repository. None of this makes an API call; it uses what's already
loaded, and stays quiet when it can't be sure.

### Cost: group by tag or cost category

Cost's tab row gains **5 Tag** and **6 Category**. The first press opens a
picker of your cost-allocation tags or cost categories; after that the
choice is remembered (`Tag:team`), and pressing the key again re-picks. The
picker's list is a billed Cost Explorer call, so it's only fetched when the
picker opens.

The tabs are renumbered to match: **Anomalies moves to <kbd>7</kbd>**. The
period is no longer a tab. Its chips sit on the Cost pane's top border:
<kbd>[</kbd> / <kbd>]</kbd> step through them, <kbd>t</kbd> still cycles,
and a click picks one.

## v0.4.0

### Lambda layers

Lambda has a **Layers** sub-tab: one row per layer, with its versions and
**Used By**, the loaded functions that use it, grouped by pinned version.
A function's layer rows jump to the layer. Layers from other accounts (AWS's
own, or a vendor's) are noted on the function instead, since they can't be
listed.

### A newer release, announced

Once a day neboto checks for a newer release. When there is one, a
`↑ vX.Y.Z` chip appears on the service strip; clicking it copies the upgrade
command. It's the only request neboto makes that isn't to AWS, and it can be
turned off. See [Permissions](@/guide/permissions.md#the-one-request-that-isn-t-to-aws).

### Choose where sessions open

`session_launch` (or `--session-launch` for one run) picks where SSM and ECS
Exec sessions open. `auto` keeps the current behaviour: a new tmux window,
else a new terminal window, else this terminal. `window` always opens a new
window, and `inline` always uses this terminal. Credentials are still never
written into the launched command. See
[Configuration](@/guide/configuration.md).

### ECS: services scaled to 0

A service at 0 desired and 0 running used to read as a healthy green `●`. It
now shows a muted `◌ scaled to 0`, which <kbd>F</kbd> and
`neboto ls @ecs --state "scaled to 0"` can filter on.

### Tags in the list for Bedrock, CloudTrail, CloudWatch and Glue

These services' rows now carry their tags as soon as the list loads, so the
ownership line, `tag:` searches, <kbd>U</kbd> and exports see them without
opening each resource. It's one extra `tag:GetResources` call per load; if
it's denied, you get one warning and the list loads as before.

### Compare two resources

Not a feature, a recipe: diff two `neboto get` runs. See
[CLI](@/guide/cli.md#compare-two-resources).

### Fixes

- **Load errors** now carry the AWS message (`AccessDenied: …`) instead of
  the SDK's bare "service error", in the status bar, <kbd>M</kbd> and
  `neboto ls`.
- **`credential_process`:** while one runs, the status bar says so, rather
  than raw text printed over the screen.
- **Demo mode:** CloudWatch loads again.
- **Read-only guard:** its check of `PERMISSIONS.md` was matching nothing
  and always passing; it now checks every listed action. The
  [Permissions](@/guide/permissions.md#the-one-exception-sessions) page now
  names sessions as the one exception and says where the guarantee is
  enforced.

## v0.3.1

### Fixes

- **`credential_process` prompts:** v0.3.0's change to stop the screen
  flashing could interfere with a passphrase prompt. neboto now leaves the
  terminal alone while one runs.

## v0.3.0

### ECR images

ECR has an **Images** sub-tab next to Repositories: the newest 100 images
per repository, each with its own pane.

- **Findings:** the image's scan findings, worst first. Basic and enhanced
  (Inspector) scanning read the same way, and an image that was never
  scanned says so.
- **Used By:** the ECS tasks running this image, matched on the digest they
  actually pulled, so a task started from a `:latest` that has since moved
  still counts. It says what it searched, so an empty list doesn't read as
  "unused".
- **Links:** a digest in a repository, or a digest-pinned image URI in a
  task definition, jumps to the image.

Image layers are left out on purpose: reading them updates the image's
*last pulled* date, which cleanup rules depend on.

### Elastic Beanstalk (`@eb`)

Environments, applications and versions. Environments show their health,
with red, yellow and mid-update ones sorted first, and **Cluster** (EKS)
environments list alongside the classic **Standard** ones. An environment
pane has Overview, Health, Events, Configuration, Resources and Tags, and
links out to its EKS cluster, Auto Scaling group, load balancer, queue and
IAM roles. <kbd>U</kbd> on an EKS cluster lists the Beanstalk environments
sharing it.

### Cost: anomalies

<kbd>8</kbd> on Cost opens **Anomalies**: what Cost Anomaly Detection
flagged in the last 90 days, newest first, each with its dollar impact and
whether it's still going. The pane breaks an anomaly down by service, usage
type, region and account. <kbd>1</kbd>–<kbd>7</kbd> go back to the spend
view as you left it. The view's one `ce:GetAnomalies` call is only made
when you open it, and is cached six hours like the rest of Cost.

### Route 53: test what a record answers

A record has a **Test answer** section. <kbd>x</kbd> asks Route 53 what it
answers for that name and type, and checks the answer against the record.
A weighted or failover record may give a different set member: press
<kbd>x</kbd> again to ask again. A health check's status also shows each
checker's last failure reason, so a check that is healthy now but flapped
an hour ago shows it.

### Wrap long values in the detail pane

<kbd>Ctrl-W</kbd> wraps long values (a DKIM record, a policy summary, a JSON
tag) onto continuation rows under the value column instead of clipping them
at the pane edge. Set `detail_wrap = true` to start with it on. See
[Configuration](@/guide/configuration.md).

### Fixes

- **Tags:** a tag call that fails (a missing permission, a throttle) now
  shows its error, rather than "No tags".
- **Organizations:** the status bar and the account preview now say that
  <kbd>s</kbd> assumes a role into the account. If the assume is denied,
  the error points at `org_access_role` / `org_access_roles`.
- **`credential_process`:** switching profile no longer flashes the shell
  when the process answers from its cache.

## v0.2.1

### `credential_process` prompts

A `credential_process` that asks for something in the terminal, such as
`granted` with the `pass` keyring and gpg's pinentry, used to draw over
neboto and leave the terminal broken. neboto now runs it before the TUI
starts. When it runs again (after <kbd>P</kbd>, or when credentials
expire), neboto steps aside for the prompt and redraws when it's answered.
See [First run](@/guide/first-run.md#credentials-and-region).

## v0.2.0

### The mouse works everywhere

neboto is still keyboard-first, but nothing needs the keyboard any more.

- **Status-bar hints:** clickable. Click `m metrics` or `W trail` and it
  presses that key wherever you are.
- **Region and profile:** the region name opens the region picker, and the
  profile and account badges open the profile picker.
- **Welcome screen:** has one-click starting points (`@ec2`, `@s3`, `@lambda`
  …).
- **Pickers and help:** scroll with the wheel; click to choose, and
  double-click to confirm. A click outside closes them.
- **Browsers, log tail and lenses:** S3, DynamoDB, the log tail and the
  <kbd>W</kbd> / <kbd>U</kbd> / <kbd>N</kbd> lenses scroll, select and drill
  in with the mouse.
- **Smaller targets:** one click on a `→` follows the link. Clicking the
  detail pane's title bar toggles full width, and the `‹` / `›` tab markers
  scroll the tabs.

See [Navigation](@/guide/navigation.md#mouse) for every gesture.

### CloudFormation: stack policies and StackSet results

A live stack has a **Policy** section that reads its stack policy statement
by statement (<kbd>e</kbd> opens the document). <kbd>Enter</kbd> on a
StackSet operation lists its per-account, per-region results inline,
failures first.

### Fixes

- **EC2 user data** compressed with gzip, the default for Terraform's
  `cloudinit_config`, now shows the script instead of raw base64.
- **SSM sessions** never write static AWS keys into the command they launch.
  Sessions running on static keys (rather than a profile) now open in the
  current terminal, so the keys can't end up in shell history or on screen.
  Profile and SSO users see no change.
- **Assumed member accounts:** SSM sessions are off while you're assumed into
  one. The `aws` CLI would run as your base profile, in the wrong account. See
  [Multi-account](@/guide/multi-account.md).
- **Flat view:** with a <kbd>/</kbd> filter active, the section tab follows
  the cursor correctly.

## v0.1.11

### `@all`: see what was searched, narrow it, sort it

The service strip now shows what an `@all` search covered: each service
with its number of matches, and `–` for one whose cache has expired, so
"no results" can't hide "didn't look there". Click a chip, or step through
them with <kbd>Tab</kbd> (<kbd>H</kbd> / <kbd>L</kbd>), to show only that
service's results. <kbd>z</kbd> now sorts `@all` results too, by name,
state or service. See [Search](@/guide/search.md#all).

Also fixed: the strip no longer shows an EC2 chip for a service you never
opened.

## v0.1.10

### See neboto's calls in CloudTrail

Every request now carries `app/neboto` in its user agent, so your own trail
shows exactly what neboto called, and that it only read. See
[Permissions](@/guide/permissions.md#check-it-in-your-own-cloudtrail).

### CloudTrail: a search that runs out of events says so

The Events tab loads the newest 500 events, and <kbd>/</kbd> searches only
those. A capped list now shows `newest 500 only`, a search with no match
says it only looked there, and <kbd>f</kbd> opens CloudTrail's own search
pre-filled from what you typed: `lambda` becomes the event source
`lambda.amazonaws.com`, `ListFunctions20150331` an event name.

### What scripts can rely on

The CLI's output now has a written contract: the envelope, the core keys,
section and type names, flags and exit codes are stable, and what's inside a
section follows the TUI. See
[Scripts and agents](@/guide/cli.md#what-scripts-can-rely-on).

## v0.1.9

### A CLI for scripts and AI agents

`neboto ls` and `neboto get` print instead of opening the TUI, as a table,
JSON, Markdown or CSV. They make the same read-only calls, so an agent handed
`neboto` can look but not touch.

```bash
neboto ls @ec2 -t volume --state available -o json
neboto get @iam deploy-role --section policies -o json
```

`get` prints everything a resource's detail pane shows, including the
sections that need extra calls. There's an agent skill to go with it. See
[Scripts and agents](@/guide/cli.md).

### IAM: what a role can actually do

Roles, users and groups have a new **Policies** section with every attached
and inline policy document, so you no longer open them one at a time.
Permissions still lists them, and <kbd>⏎</kbd> still expands one in place.

### `@all` results: <kbd>⏎</kbd> jumps, <kbd>l</kbd> peeks

In an `@all` result list, <kbd>⏎</kbd> still jumps to the resource in its
service. <kbd>l</kbd> and <kbd>→</kbd> now open its detail pane in place, as
a mouse click does, so the results stay on screen.

### Exports

`X` exports and the <kbd>e</kbd> JSON view drop the TUI's key hints
("press t to tail"), JSON values lose their status glyphs
(`UPDATE_COMPLETE`, not `✓ UPDATE_COMPLETE`), and a section that never
loaded is `null`.

## v0.1.8

### <kbd>H</kbd> / <kbd>L</kbd>: sub-tabs from either pane

<kbd>Tab</kbd> and the digits switch *sections* once you're in the detail
pane, so moving from an instance to the security groups used to take
<kbd>h</kbd>, <kbd>Tab</kbd>, <kbd>l</kbd>. <kbd>H</kbd> and <kbd>L</kbd> now
step to the previous and next sub-tab from either pane. From the detail pane
you land on the new tab's first row and stay in the detail pane.

### <kbd>h</kbd> no longer walks back through history

In the list pane, <kbd>h</kbd> and <kbd>←</kbd> used to go back through
navigation history, often into another service. Tapping <kbd>h</kbd> twice to
get from a detail pane back to its list lost your place. History is now on
<kbd>Ctrl-O</kbd> and <kbd>Backspace</kbd> only; <kbd>h</kbd> keeps meaning
"back to the list".

### Fixes

- <kbd>Ctrl-O</kbd> back to an `@all` result list no longer re-fetches the
  service you typed it over. With that service's cache expired, every round
  trip used to reload it and throw the result away.
- Key hints that named the wrong key: the ECS task pane said `v logs` and an
  OpenSearch access policy said "press v to view"; both are <kbd>e</kbd>.
  The status bar now says `H/L sub-tab`.
- When a picker's footer is too narrow, the position counter (`6/72`) stays
  visible and the hint is trimmed instead.

### Under the hood

Every dependency is up to date, including all the AWS SDKs and the terminal
UI library (ratatui 0.30).

## v0.1.7

### Try it without an AWS account

```bash
neboto --demo
```

opens `acme-prod`, a made-up account with a few problems planted in it: a
failed ECS deploy, SSH open to the world, a drifted CloudFormation stack, a
Lambda whose logs keep streaming. It uses no credentials and makes no network
calls. The recordings on the home page were made with it. See
[First run](@/guide/first-run.md#no-aws-account-try-the-demo).

### `--show-keys`: the keys on screen, for recordings

`--show-keys` (or `show_keys = true` in the config) puts each key you press,
and what it did, in a small box in the corner: `⏎ open`, `2 Deployments`,
`W change timeline`. It's meant for screen recordings, shares and demos,
where the viewer sees the screen change but not the key. Text you type into
a search box, filter or picker is never shown.

### Three new services

- **DMS** (`@dms`): replication tasks, instances, endpoints and serverless
  replications. A task that crashed reads **stopped (error)** with its stop
  reason, its Tables section lists the tables that errored first, and an
  endpoint whose connection test failed says so. <kbd>m</kbd> charts CDC
  latency, <kbd>t</kbd> tails the task log.
- **X-Ray** (`@xray`): the service map (worst node first, with p50/p90/p99
  and callers and callees), traces with their root cause and segments, and
  groups and sampling rules. Everything is scoped to a 5m–6h window you step
  with <kbd>[</kbd> / <kbd>]</kbd>.
- **Batch** (`@batch`): job queues, compute environments, jobs and job
  definitions. neboto works out why a queue is stuck (a compute environment
  that's disabled, invalid or scaled to zero while jobs wait) from what's
  already loaded, and <kbd>t</kbd> tails a job's container log.

### Fixes

- S3 Tables: following a table bucket or table ARN lands on the right
  sub-tab.
- The Referenced-by lens (<kbd>U</kbd>) printed its service column as
  `@@ec2`.

## v0.1.6

### Choose what exports write

`export_formats` picks which files <kbd>X</kbd>, <kbd>Ctrl-X</kbd> and the
deep export write: any of `"json"`, `"csv"`, `"md"`. The default is still all
three. `export_dir` sets where they go (`~/` is expanded, and the directory is
created on first use); `NEBOTO_EXPORT_DIR` still wins. A bad value warns at
startup and is ignored, never stopping neboto from starting.

## v0.1.5

### <kbd>C</kbd> copies operational commands, not just the read one

<kbd>C</kbd> used to copy one thing: the read-only `describe` command for
the selected resource. Where there is more than one useful command, it now
opens a picker in three tiers:

| Tier | Examples |
|---|---|
| **Inspect** | The `describe` / `get` command, always the first row |
| **Connect** | `aws ssm start-session`, `aws ecs execute-command`, `aws eks update-kubeconfig` |
| **Change** | Start / stop / reboot an instance, force a new ECS deployment, scale a service or Auto Scaling group, start an instance refresh |

These are available on EC2 instances, ECS services and tasks, Auto Scaling
groups and EKS clusters. The picker shows the exact command before you copy
it, with `--region`, `--profile` and `--endpoint-url` (when you're pointed at
an emulator) filled in. A resource with only one command still copies it
straight away.

neboto still only **copies** these commands and never runs them. It makes
no new API calls and needs no new permissions, so the
[read-only guarantee](@/guide/permissions.md) is unchanged. A few rules
keep a careless paste safe:

- **Nothing destructive.** No terminate, delete, purge or deregister commands.
- **Value-taking commands are prefilled with the current value.** Pasting
  `update-service --desired-count` or `set-desired-capacity` without editing
  it changes nothing.
- **Change rows are disabled while you're assumed into a member account.** A
  `--profile` flag can't reproduce that session, so a pasted change would run
  as the wrong identity.
- **Visual selection batches.** Select several instances with <kbd>V</kbd> in
  the list and <kbd>C</kbd> offers the commands they share, with every id
  merged into one `--instance-ids a b c` list.

<kbd>C</kbd> also works from the detail pane now. Before this release,
pressing it there did nothing.

### EC2: which load balancers hold this instance

An instance's detail pane has a new **Load Balancing** section (key
<kbd>4</kbd>). It answers "is this instance behind a load balancer, and is it
healthy there?" AWS has no API that answers this directly, so neboto
checks the target groups in the same VPC with `DescribeTargetHealth`. For
an instance in an Auto Scaling group, it checks the group's own target
groups first. Each row shows the health state and reason, port, and zone.
The target group and load balancer ARNs are links you can follow with
<kbd>Enter</kbd>.

The [network access lens](@/guide/lenses.md) (<kbd>N</kbd>) now labels
rules whose source is a load balancer's security group
(`sg-… ⇠ ALB web-alb`). That tells ports forwarded by the load balancer apart
from ports opened to the instance directly.

The instance's later section keys moved up one: Storage <kbd>5</kbd>, User
Data <kbd>6</kbd>, Console <kbd>7</kbd>, Tags <kbd>8</kbd>, Optimizer
<kbd>9</kbd>. Bookmarks restore by section name, so existing ones still land
in the right place.

## v0.1.4

### Route 53: hosted zone tags

Every hosted zone's Tags section read "No tags", whatever the zone was
actually tagged with. Zone tags are now loaded with the list, so they also
feed the ownership line, `tag:` search filters, <kbd>U</kbd> and exports. If
the tag call is refused, the error shows in the Tags section instead of
looking like an untagged zone.

### Route 53: readable record sets

A zone's **Records** section now shows names relative to the zone (`@` for
the apex, `www`, `*.dev`) and puts the record type first:

```
A      @      192.0.2.10 · 300
CNAME  www    example.com · 300
TXT    @      "v=spf1 -all" · 3600
```

Before, the type and TTL were cut off every row. <kbd>Enter</kbd> on a record
opens its own pane, where every value is on its own untruncated line, and
alias targets and health checks can be followed.

## v0.1.3

### EC2: the instance console log

A new **Console** section on the instance pane shows the system log (the
console's *Get system log*). Check it first when an instance fails its
status checks or never registers with SSM. <kbd>e</kbd> opens the whole buffer
in `$EDITOR` as a plain `.log` file, easy to grep for a kernel error.
<kbd>e</kbd> on **User Data** likewise opens the script itself, with a
`.sh` or `.yaml` extension to match its first line.

AWS posts the log a few minutes after the instance starts or stops, so an
empty section right after launch is expected, not an error. The call is
`ec2:GetConsoleOutput`, which `ReadOnlyAccess` already includes.

## v0.1.2

### Route 53 Resolver: DNS delegation and endpoint detail

Resolver endpoints and rules now show the newer features: the
inbound-delegation endpoint type and `DELEGATE` rules, IPv6 targets and
DNS-over-HTTPS protocols. Endpoint panes gain type, protocols and feature
flags. They also get a **Rules** section listing the loaded rules routed
through the endpoint. Three display bugs are fixed: `DELEGATE` rules showed
as system rules, IPv6-only targets showed as a bare `:53`, and <kbd>O</kbd> on
an outbound endpoint opened the inbound page in the Console.

## v0.1.1

### Profile switch with access keys exported

With `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in the environment,
<kbd>P</kbd>, `-p` and `default_profile` showed the new profile's name but
kept signing every call with the exported keys. A profile you choose
explicitly now wins, the same way it does with `aws --profile`.

## Coming soon: nebaz, for Azure

[**nebaz**](https://github.com/neboto/nebaz) is neboto's Azure sibling and
is in active development. It uses the same keyboard-driven, read-only
design on the same core: fuzzy search, detail panes with links you can
follow, visual selection, macros, bookmarks, export and themes. It
authenticates through the Azure CLI (`az login`).

It already covers subscriptions and resource groups, Virtual Machines,
Storage, Networking, Key Vault (names and metadata, never secret values),
AKS, managed identities, App Service, SQL, Container Registry, Cosmos DB and
Foundry. There is no release yet. Follow or star the
[repository](https://github.com/neboto/nebaz) to hear when there is. Its
guide will live here at `neboto.dev/azure`.
