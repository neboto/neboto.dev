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

## Calls worth a second look

`PERMISSIONS.md` calls out the few reads that deserve a conscious decision:

- **Opt-in reveals**: `secretsmanager:GetSecretValue` and `ssm:GetParameter` with decryption are only issued when you press <kbd>x</kbd> or <kbd>Y</kbd> on a secret. Values are never cached, logged, or written anywhere; they go to the screen or the clipboard and nowhere else. Leave these actions out of the policy and the reveal simply fails.
- **Calls that cost money**: `ce:GetCostAndUsage` bills about $0.01 per request (cached six hours); `dynamodb:Scan` and `Query` consume read capacity; CloudWatch `GetMetricData` bills per metric, which is why the dashboard view caps its series.
- **Data-plane calls that can start things**: Bedrock AgentCore's `GetAgentCard` reaches the running agent and can cold-start it, so it is gated behind <kbd>x</kbd> rather than fired on view.
- **S3 configuration reads** whose IAM action names do not match the `s3:GetBucket*` wildcard.
- **`sts:AssumeRole`** behind the member-account switch.

## Why read-only

This is a design constraint, not a missing feature.

1. The Organizations member-account switch pins every assumed session to a `ReadOnlyAccess` session policy. Write actions would either fail silently cross-account or force that guarantee to be weakened.
2. A permissions document that describes a purely read-only footprint is a trust asset. Security teams can approve neboto precisely *because* it cannot mutate. One gated write action changes that conversation permanently.

Where a mutation is genuinely what you want, <kbd>C</kbd> copies the
ready-to-run AWS CLI command for the selected resource, with the region and
ids filled in. You never reconstruct an ARN by hand, and neboto never holds
the ability to run it.

## Reporting a security issue

Use GitHub's private vulnerability reporting on the repository, or email
`stojan@neboto.dev`. Details are in
[`SECURITY.md`](https://github.com/neboto/neboto-tui/blob/main/SECURITY.md).
