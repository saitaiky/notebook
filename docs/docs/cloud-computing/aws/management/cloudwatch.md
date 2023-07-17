---
title: CloudWatch
description: CloudWatch
keywords:
- CloudWatch
sidebar_position: 1
---

## Behaviour

- Alarms continue to evaluate metrics against the configured threshold, even after they have already triggered. You can adjust the alarm threshold if you do not want it to be in ALARM state


## Features
### CloudWatch Synthetics

You can use Amazon CloudWatch Synthetics to create canaries, configurable scripts that run on a schedule, to monitor your endpoints and APIs. Canaries follow the same routes and perform the same actions as a customer, which makes it possible for you to continually verify your customer experience even when you don't have any customer traffic on your applications. By using canaries, you can discover issues before your customers do.

Canaries are Node.js scripts. They create Lambda functions in your account that use Node.js as a framework. Canaries work over both HTTP and HTTPS protocols.

UI canaries offer programmatic access to a headless Google Chrome Browser via Puppeteer. For more information about Puppeteer, see Puppeteer.

Canaries check the availability and latency of your endpoints and can store load time data and screenshots of the UI. They monitor your REST APIs, URLs, and website content, and they can check for unauthorized changes from phishing, code injection and cross-site scripting.


### CloudWatch Event Rules

You can use Amazon CloudWatch Events to detect and react to changes in the state of a pipeline, stage, or action. Then, based on rules you create, CloudWatch Events invokes one or more target actions when a pipeline, stage, or action enters the state you specify in a rule. 

Examples of Amazon CloudWatch Events rules and targets:

- A rule that sends a notification when the **instance state changes**, where an EC2 instance is the event source, and Amazon SNS is the event target.
- A rule that sends a notification when the **build phase changes**, where a CodeBuild configuration is the event source, and Amazon SNS is the event target.
- A rule that detects **pipeline changes** and invokes an AWS Lambda function.

### CloudWatch alarm

Setup a CloudWatch alarm to monitor the health status of the instance. In case of an Instance Health Check failure, an EC2 Reboot CloudWatch Alarm Action can be used to reboot the instance

The reboot alarm action is recommended for **Instance Health Check failures** -  The system status check detects issues with the underlying host that your instance runs on. If the underlying host is unresponsive or unreachable due to network, hardware, or software issues, then this status check fails.

The recover alarm action, which is suited for **System Health Check failures** - An instance status check failure indicates a problem with the instance due to operating system-level errors such as the following:

-   Failure to boot the operating System
-   Failure to mount volumes correctlySystem
-   File system issuesSystem
-   Incompatible driversSystem
-   Kernel panic

## CloudWatch integration

### S3

You can export log data from your CloudWatch log groups to an Amazon S3 bucket and use this data in custom processing and analysis, or to load onto other systems.

### Monitor Trusted Advisor

You can use Amazon CloudWatch Events to detect and react to changes in the status of Trusted Advisor checks. Then, based on the rules that you create, CloudWatch Events invokes one or more target actions when a status check changes to the value you specify in a rule. Some example service check:

![monitor-trusted-advisor-service-check](/img/aws/management/monitor-trusted-advisor-service-check.jpeg)

Depending on the type of status change, you might want to send notifications, capture status information, take corrective action, initiate events, or take other actions.

[Monitor Trusted Advisor - Service limits](https://docs.aws.amazon.com/awssupport/latest/user/service-limits.html)
[AWS trusted-advisor](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/best-practice-checklist/)

## Metrics for EC2

:::infoWhat is Metrics?
Metrics, sometimes called time series, are concerned with events aggregated across time. They count how often each type of event happens, how long each type of event takes and how much data was processed by the event type.
:::

:::caution
RAM is NOT included in the AWS EC2 metrics
:::

- AWS Provided metrics (AWS pushes them):
    - Basic Monitoring (default): metrics are collected at a 5 minute internal
    - Detailed Monitoring (paid): metrics are collected at a 1 minute interval 
    - Includes CPU, Network, Disk and Status Check Metrics
        - CPU: CPU Utilization + Credit Usage / Balance
        - Network: `NetworkIn` and `NetworkOut` 
        - Status Check:
            - Instance status = check the EC2 VM
            - System status = check the underlying hardware
        - Disk: Read / Write for Ops / Bytes (only for instance store)

- Custom metric (yours to push):
    - Basic Resolution: 1 minute resolution
    - High Resolution: all the way to 1 second resolution
    - Include RAM, application level metrics
    - Make sure the IAM permissions on the EC2 instance to push the logs and the metrics.

### Procstat plugin

> TL;DR - Process-level Monitoring: The plugin enables you to monitor individual processes, allowing you to gain insights into their resource consumption and performance.

The CloudWatch Agent procstat plugin is a component of the CloudWatch Agent provided by AWS. The procstat plugin allows you to monitor and collect metrics from specific processes running on your Amazon EC2 instances.

By configuring the procstat plugin, you can specify the processes you want to monitor and collect metrics for, such as CPU usage, memory usage, or custom metrics exposed by the process. The plugin uses the procfs file system on Linux-based systems to retrieve information about the specified processes.

Some key features and use cases of the CloudWatch Agent procstat plugin include:

## CloudWatch Agent

:::infoAWS Unified CloudWatch Agent & AWS CloudWatch Agent
"AWS Unified CloudWatch Agent" and "AWS CloudWatch Agent" are the same thing. AWS Unified CloudWatch Agent is the latest version of the agent used to collect and send logs and metrics to Amazon CloudWatch.
:::

- You must attach the `CloudWatchAgentServerRole` IAM role to the EC2 instance to be able to run the CloudWatch agent on the instance. This role enables the CloudWatch agent to perform actions on the instance.
- If your AMI contains a CloudWatch agent, it’s automatically installed on EC2 instances when you create an EC2 Auto Scaling group. With the stock Amazon Linux AMI, you need to install it (AWS recommends to install via yum).

### The appended option in configuration file 
You can set up the CloudWatch agent to use multiple configuration files. For example, you can use a common configuration file that collects a set of metrics and logs that you always want to collect from all servers in your infrastructure. You can then use additional configuration files that collect metrics from certain applications or in certain situations.

To set this up, first create the configuration files that you want to use. Any configuration files that will be used together on the same server must have different file names. You can store the configuration files on servers or in Parameter Store.

Start the CloudWatch agent using the `fetch-config` option and specify the first configuration file. To append the second configuration file to the running agent, use the same command but with the `append-config` option. All metrics and logs listed in either configuration file are collected.

Any configuration files appended to the configuration must have different file names from each other and from the initial configuration file. If you use `append-config` with a configuration file **with the same file name** as a configuration file that the agent is already using, the append command overwrites the information from the first configuration file instead of appending to it. This is true even if the two configuration files with the same file name are on different file paths.
:::

A CloudWatch Agent is a software component provided by AWS that allows you to collect below information from virtual servers (EC2 instances, on-premises servers, ...)
- Additional system-level metrics such as RAM, processes, used disk space, etc.
- Collect logs file to send to CloudWatch Logs (No logs from inside your EC2 instance will be sent to
CloudWatch Logs without using an agent)

Other points:
- Use SSM Parameter Store to store the json format configuration that Unified CloudWatch Agent needs
- Make sure to attach an IAM role on the EC2 instance for accessing configuration from SSM


### StatsD & collectd

You can retrieve custom metrics from your applications or services using the `StatsD` and `collectd` protocols. `StatsD` is supported on both Linux servers and servers running Windows Server. collectd is supported only on Linux servers. Here, the instances are running on Windows servers, hence `StatsD` is the right protocol.

## CloudWatch interval

- (By default) Basic monitoring Data is available automatically in 5-minute periods at no charge. 
- (Paid) Detailed monitoring Data is available in 1-minute periods for an additional charge. 



## Use X-ray to debug microservices specific issues

Imagine a company uses microservices-based infrastructure to process the API calls from clients, perform request filtering and cache requests using the AWS API Gateway. Users report receiving 501 error code and you have been contacted to find out what is failing. 

You may use X-Ray to debug the issue.

- CloudWatch can collect numbers and respond to AWS service-related events, but it can't help you debug microservices specific issues on AWS.
- X-Ray cannot be used to capture metrics and set up alarms as per the given use-case, so this option is incorrect.

The AWS X-Ray SDK needs permission to run in resources (like Lambda)

Create an IAM role with write permissions and assign it to the resources running your application. You can use AWS Identity and Access Management (IAM) to grant X-Ray permissions to users and compute resources in your account. This should be one of the first places you start by checking that your permissions are properly configured before exploring other troubleshooting options.

Here is an example of X-Ray Read-Only permissions via an IAM policy:


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "xray:GetSamplingRules",
                "xray:GetSamplingTargets",
                "xray:GetSamplingStatisticSummaries",
                "xray:BatchGetTraces",
                "xray:GetServiceGraph",
                "xray:GetTraceGraph",
                "xray:GetTraceSummaries",
                "xray:GetGroups",
                "xray:GetGroup"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```


Another example of write permissions for using X-Ray via an IAM policy:


```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "xray:PutTraceSegments",
                "xray:PutTelemetryRecords",
                "xray:GetSamplingRules",
                "xray:GetSamplingTargets",
                "xray:GetSamplingStatisticSummaries"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

## CloudTail

If you have created an organization in AWS Organizations, you can also create a trail that will log all events for all AWS accounts in that organization (**need root account permission**). This is referred to as an organization trail.

- S3 related
    - By default, CloudTrail tracks only bucket-level actions. To track object-level actions, you need to enable Amazon S3 data events 
    - A bucket owner enabled CloudTrail. It doesn’t mean he can see the object access logs. The bucket owner **also needs to be object owner** to get the object access logs. Otherwise, the bucket owner **must get permissions**, through the object ACL, for the same object API to get the same object-access API logs.
- Member accounts will be **able to see the organization trail**, but cannot modify or delete it. (By default, member accounts will not have access to the log files for the organization trail in the Amazon S3 bucket.)
