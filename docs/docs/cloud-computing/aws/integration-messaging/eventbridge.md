---
title: EventBridge
---

Amazon EventBridge is recommended when you want to build an application that reacts to events from SaaS applications and/or AWS services. Amazon EventBridge is the only **event-based service** that integrates directly with third-party SaaS partners.

:::infoIs EventBridge same as CloudWatch?
Amazon EventBridge is the preferred way to manage your events. CloudWatch Events and EventBridge are the same underlying service and API, but EventBridge provides more features. Changes you make in either CloudWatch or EventBridge will appear in each console. 
[What Is Amazon CloudWatch Events?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html)
:::
## Target

### EBS

![target-ebs](/img/aws/integration-messaging/event-bridge/target-ebs.png)

You can run CloudWatch Events rules according to a schedule. It is possible to create an automated snapshot of an existing Amazon Elastic Block Store (Amazon EBS) volume on a schedule. You can choose a fixed rate to create a snapshot every few minutes or use a cron expression to specify that the snapshot is made at a specific time of day.

Snapshots are incremental backups, which means that only the blocks on the device that have changed after your most recent snapshot are saved. This minimizes the time required to create the snapshot and saves on storage costs by not duplicating data. Each snapshot contains all of the information that is needed to restore your data (from the moment when the snapshot was taken) to a new EBS volume.

[Schedule Automated Amazon EBS Snapshots Using CloudWatch Events](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/TakeScheduledSnapshot.html)


:::infoPermission for different targets
- IAM roles for rules are only used for events related to Kinesis Streams. 
- For Lambda functions and Amazon SNS topics, you need to provide resource-based permissions.
:::