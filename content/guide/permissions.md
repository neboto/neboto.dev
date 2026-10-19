+++
title = "Permissions"
description = "What IAM access neboto needs, the read-only guarantee, and the handful of calls worth a second look."
weight = 80
+++

neboto needs read permissions for the services you actually browse. The
quickest correct answer is the AWS-managed **`ReadOnlyAccess`** policy.

For accounts that need a narrower, auditable grant, the complete per-service
action list is maintained in
[`PERMISSIONS.md`](https://github.com/neboto/neboto-tui/blob/main/PERMISSIONS.md),
updated in the same commit as any change that adds an API call. A guard in
the project's CI checks every SDK operation and every listed IAM action
against a read-only vocabulary, so a write call cannot slip in unnoticed.

`@audit` makes no calls of its own until you press <kbd>r</kbd>: in the TUI
it reads only what other services have already loaded. <kbd>r</kbd> (and
`neboto audit`) runs the EC2, RDS, S3, EKS, IAM and KMS list calls, then a
few account-setting reads (S3 Block Public Access, EBS default encryption,
CloudTrail, Config, GuardDuty, Access Analyzer, Organizations) and capped
per-resource reads (KMS rotation, IAM users' keys and MFA, snapshot
sharing). `PERMISSIONS.md` lists every action. A denied call doesn't fail
the audit; its checks report as *not checked* and name the action.

## Calls worth a second look

`PERMISSIONS.md` calls out the few reads that deserve a conscious decision:

- **Opt-in reveals**: `secretsmanager:GetSecretValue` and `ssm:GetParameter` with decryption are only issued when you press <kbd>x</kbd> or <kbd>Y</kbd> on a secret. Values are never cached, logged, or written anywhere; they go to the screen or the clipboard and nowhere else. Leave these actions out of the policy and the reveal simply fails.
- **Calls that cost money**: `ce:GetCostAndUsage` bills about $0.01 per request (cached six hours), as do `ce:GetAnomalies`, `ce:GetTags` and `ce:ListCostCategoryDefinitions`, which only run when you open Cost's Anomalies view or its tag or cost-category picker; `dynamodb:Scan` and `Query` consume read capacity; CloudWatch `GetMetricData` bills per metric, which is why the dashboard view caps its series.
- **Data-plane calls that can start things**: Bedrock AgentCore's `GetAgentCard` reaches the running agent and can cold-start it, so it is gated behind <kbd>x</kbd> rather than fired on view.
- **IAM reports**: the Last Accessed section calls `iam:GenerateServiceLastAccessedDetails`, the one IAM call neboto makes that isn't a Get or List. It starts a report job and creates no resource, AWS rates it a Read action and `IAMReadOnlyAccess` includes it, so the read-only guard allows it by name. `GenerateCredentialReport` stays out: the Credential Report section only reads the latest report.
- **S3 configuration reads** whose IAM action names do not match the `s3:GetBucket*` wildcard.
- **`sts:AssumeRole`** behind the member-account switch.

## Why read-only

This is a design constraint, not a missing feature.

1. The Organizations member-account switch pins every assumed session to a `ReadOnlyAccess` session policy. Write actions would either fail silently cross-account or force that guarantee to be weakened.
2. A permissions document that describes a purely read-only footprint is a trust asset. Security teams can approve neboto precisely *because* it cannot mutate. One gated write action changes that conversation permanently.

### The one exception: sessions

<kbd>s</kbd> on an instance or ECS task opens an SSM Session Manager or ECS
Exec shell, through the `aws` CLI rather than neboto's own calls. It's always
your keypress, and opening a session changes no resource, but a shell on the
box can change anything there. Sessions are off while a member-account role
is assumed.

No credential is ever written into the command a session launches, where it
would reach shell history, `ps` or the screen. One leak belongs to the AWS
CLI and is outside neboto's reach: `session-manager-plugin` receives the
session's token as a command-line argument, so it is visible in `ps` while
the session runs. Where sessions open is the `session_launch` setting; see
[Configuration](@/guide/configuration.md).

### Where the guarantee comes from

Under an assumed member-account role, AWS enforces it through the
`ReadOnlyAccess` session policy. On your own credentials it's enforced by the
code and the CI guard above: every SDK call and every action in
`PERMISSIONS.md` must be a read. Nothing at runtime stops a write there, so
for a hard boundary run neboto on a read-only profile, such as
`ReadOnlyAccess` or the `PERMISSIONS.md` policy. If you don't want shells
either, add an explicit deny on `ssm:StartSession` and `ecs:ExecuteCommand`.

### Check it in your own CloudTrail

Every request neboto makes carries `app/neboto` in its user agent. In
CloudTrail Lake or Athena, filter on `userAgent LIKE '%app/neboto%'` and
every row should be `readOnly = true`. Event history can't filter on the
user agent, so look up an event name there (Lambda's is
`ListFunctions20150331`, for example) and check its `userAgent`.

Where a mutation is genuinely what you want, <kbd>C</kbd> copies the
ready-to-run AWS CLI command for the selected resource, with the region,
profile and ids filled in: stop an instance, force an ECS redeployment, set
an Auto Scaling group's capacity, open an SSM session, write a kubeconfig. A
picker groups the commands as Inspect / Connect / Change and shows the exact
text before copying. Nothing destructive is offered, and commands that take
a value are prefilled with the current one, so pasting without editing
changes nothing. You never reconstruct an ARN by hand, and neboto never
holds the ability to run the command.

## The one request that isn't to AWS

Once a day, neboto asks GitHub whether there's a newer release: an anonymous
`GET https://api.github.com/repos/neboto/neboto-tui/releases/latest`. It
sends nothing about you or your account, and a failed request (offline,
behind a proxy) is silent. It never runs under `--demo`, when `CI` is set,
or for `neboto ls` / `get`. Turn it off with `update_check = false`,
`--no-update-check` for one run, or `NEBOTO_NO_UPDATE_CHECK=1`.

## Reporting a security issue

Use GitHub's private vulnerability reporting on the repository, or email
`stojan@neboto.dev`. Details are in
[`SECURITY.md`](https://github.com/neboto/neboto-tui/blob/main/SECURITY.md).
