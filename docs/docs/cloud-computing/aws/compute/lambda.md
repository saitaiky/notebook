---
title: Lambda
description: Lambda
keywords:
  - Lambda
sidebar_position: 5
---

## Features

### Deploy Lambda functions as container images

-   You can deploy Lambda function as a container image, with a maximum size of 15 GB 
-   You must create the Lambda function from the same account as the container registry in Amazon ECR
-   To deploy a container image to Lambda, the container image must implement the Lambda Runtime API

### Lambda data storage

Comparing the different data storage options

This table compares the characteristics of these four different data storage options for Lambda:

![](/img/aws/compute/lambda/data-storage-table.png)



## Working in VPC

**Why can't an AWS lambda function inside a public subnet in a VPC connect to the internet?**

Lambda functions connected to a VPC public subnet cannot typically access the internet.

To access the internet from a public subnet you need a public IP or you need to route via a NAT that itself has a public IP. You also need an [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) (IGW). However:

1.  Lambda functions do not, and cannot, have public IP addresses, and
2.  the default route target in a VPC public subnet is the IGW, not a NAT

So, because the Lambda function only has a private IP and its traffic is routed to the IGW rather than to a NAT, all packets to the internet from the Lambda function will be dropped at the IGW.

> Further reading: [Stack overflow: Why can't an AWS lambda function inside a public subnet in a VPC connect to the internet?](https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the#:~:text=The%20difference%20between%20public%20and,default%20route%20is%20the%20IGW.)


:::info  Best Practices
When configuring Lambda functions for VPC access, it is an HA best practice to configure multiple (private) subnets across different Availability Zones (AZs).
:::
### When do you need a VPC Access?

If your Lambda function *does not need to reach private resources* inside your VPC (e.g. an RDS database or Elasticsearch cluster) then do not configure the Lambda function to connect to the VPC.

If your Lambda function *does need to reach private resources* inside your VPC, then configure the Lambda function to connect to private subnets (and only private subnets). When you configure your Lambda function to connect to your own VPC, it creates an elastic network interface in your VPC and then does a cross-account attachment. These network interfaces allow network access from your Lambda functions to your private resources. Check the below image

![aws-lambda-function-connection-to-vpc.jpg](/img/aws/compute/lambda/aws-lambda-function-connection-to-vpc.jpg)

### When do you need to connect to NAT?

If the Lambda function only needs access to resources in the VPC (e.g. an RDS database in a private subnet) then you don't need to route through NAT.

If the Lambda function only needs access to resources in the VPC and access to AWS services that are all available via private [VPC Endpoint](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-endpoints.html) then you don't need to route through NAT. Use VPC Endpoints.

If your Lambda function needs to reach endpoints on the internet then ensure a default route from the Lambda function's private subnets to a NAT instance or NAT Gateway in a public subnet. And configure an IGW, if needed, without which internet access is not possible.

Be aware that [NAT gateway charges](https://aws.amazon.com/vpc/pricing/) per hour and per GB processed so it's worth understanding [how to reduce data transfer costs for NAT gateway](https://aws.amazon.com/premiumsupport/knowledge-center/vpc-reduce-nat-gateway-transfer-costs/).

### Intermittent Connectivity

Be sure that *all the subnets you configure for your **Lambda function** are **private subnets** *. It is a common mistake to configure.

For example, 1 private subnet and 1 public subnet. This will result in your Lambda function working OK sometimes and failing at other times without any obvious cause. The Lambda function may succeed 5 times in a row, and then fail with a timeout (being unable to access some internet resource or AWS service). 

This happens because the first launch was in a private subnet, launches 2-5 reused the same Lambda function execution environment in the same private subnet (the so-called "warm start"), and then launch 6 was a "cold start" where the AWS Lambda service deployed the Lambda a function in a public subnet where the Lambda function *has no route to the internet*.

### How to use AWS services from a Lambda in a VPC

Belows are the different ways to use AWS Services in our Lambda function that is in a VPC. 

| Method                                   | Works for                                                                                     | Cost                                                                   |
|------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| NAT Gateway                              | Any AWS service / third-party service                                                         | $0.045/hr (~$33.50 monthly) PLUS $0.045/GB processing                  |
| VPC gateway endpoint                     | S3, DynamoDB                                                                                  | None                                                                   |
| VPC interface endpoint                   | [66 different AWS services](https://docs.aws.amazon.com/vpc/latest/privatelink/create-interface-endpoint.html) , including Amazon CloudWatch, Kinesis Firehose, SNS, SQS, and SSM. | $0.01/hr per endpoint per PLUS (~$7.45 monthly) or $0.01/GB processing |
| Amazon CloudWatch Embedded Metric Format | Amazon CloudWatch only                                                                        | None                                                                   |
| Lambda Destinations                      | SNS, SQS, EventBridge But: only for asynchronous Lambda invocation results                    | None                                                                   |

> Further reading: [Three ways to use AWS services from a Lambda in a VPC](https://www.alexdebrie.com/posts/aws-lambda-vpc/)


## Scaling 

### Concurrency in Lambda

A Lambda function scales by creating enough execution environments to be able to process the amount of concurrent requests it receives at any given time. The scaling works as follows:

1.  Let's say I have set the total number of concurrent executions in my AWS account to 5000.

2.  Then, a popular news website mentions my product and my function suddenly receives a burst of traffic, and the number of concurrent requests grows rapidly, up to more than 5000 requests.

3.  Lambda will start from 500 to 3000 (this number depends on a region) instances of my function really fast. This is called burst concurrency limit. Let's say, my function is in the US East region and the burst limit is 3000. So, I'd get 3000 instances quickly to handle that burst of traffic.

4.  Once the burst concurrency limit is reached, my function will scale by only 500 instances per minute until my account's concurrency execution limit is reached (until 5000 instances) and no more instances are being created to accommodate new concurrent requests.

5.  If this concurrency limit won't be enough to serve additional requests, those requests are gonna be throttled.

6.  Also, before the account's concurrency limit is reached, the requests for which Lambda won't be able to set up an execution environment on time are gonna be throttled as well.

> Further reading: [Concurrency in Lambda](https://dd.engineering/blog/concurrency-in-aws-lambda)

### Provisioned Concurrency

A major problem with Lambda concurrency is the possibility of Lambda cold starts. A cold start is the first request handled by new Lambda workers and may take up to five seconds to execute. This can significantly impact both latency and user experience (read more in our guide to [Lambda performance](https://lumigo.io/aws-lambda-performance-optimization/)).

A cold start occurs because Lambda must initialize the worker (a container that runs your functions on the server) and the function module before passing the request to the handler function. When invoking a  function, Lambda needs a container to be ready. After invoking a function, a container stays warm for a limited amount of time (usually 30-45 minutes) before it is shut down.

![](/img/aws/compute/lambda/function-lifecycle.png)

### Application Auto Scaling

Application Auto Scaling takes this a step further by providing autoscaling for provisioned concurrency. With Application Auto Scaling, you can create a target tracking scaling policy that adjusts provisioned concurrency levels automatically, based on the utilization metric (sai: CloudWatch metric) that Lambda emits. Use the Application Auto Scaling API to register an alias as a scalable target and create a scaling policy.

In the following example, a function scales between a minimum and maximum amount of provisioned concurrency based on utilization. When the number of open requests increases, Application Auto Scaling increases provisioned concurrency in large steps until it reaches the configured maximum. The function continues to scale on standard concurrency until utilization starts to drop. When utilization is consistently low, Application Auto Scaling decreases provisioned concurrency in smaller periodic steps.

![](/img/aws/compute/lambda/autoscalling-provision-concurrency.png)

Source: [Lambda function scaling](https://docs.aws.amazon.com/lambda/latest/dg/invocation-scaling.html)

> Futher reading: Comamnd example [Scheduling AWS Lambda Provisioned Concurrency for recurring peak usage](https://aws.amazon.com/de/blogs/compute/scheduling-aws-lambda-provisioned-concurrency-for-recurring-peak-usage/)



### [Concurrency Limits and Scalability](https://lumigo.io/aws-lambda-performance-optimization/aws-lambda-concurrency/)

Lambda concurrency limits will depend on the Region where the function is deployed. It will vary from 500 to 3,000.

New functions are limited to this default concurrency threshold set by Lambda. After an initial burst of traffic, Lambda can scale up every minute by an additional 500 microVMs[1](https://dashbird.io/knowledge-base/aws-lambda/scalability-and-concurrency/#fn:1) (or instances of a function).

This scaling process continues until the concurrency limit is met. Developers can request a concurrency increase in the AWS Support Center[2](https://dashbird.io/knowledge-base/aws-lambda/scalability-and-concurrency/#fn:2).

When Lambda is not able to cope with the amount of concurrent requests an application is experiencing, requesters will receive a throttling error (429 HTTP status code)[3](https://dashbird.io/knowledge-base/aws-lambda/scalability-and-concurrency/#fn:3).

### How is the Burst Capacity related to the Baseline (execution limit)?

Lambda functions run in execution environments. The burst limit is the number of new execution environments that need to be created to handle the requests. We use a bucket algorithm with a predefined token capacity (500 / 1,000 / 3,000, depending on the region) and a fixed refill rate of 500 tokens / min. When we need to create a new execution environment, we first take a token from the bucket, if one exists. If the bucket is empty, the request is throttled.

This means that in the larger regions for example, if you are running at a steady 1,000 concurrency for some period of time, which allows the bucket to get full (6 minutes), you will be able to invoke additional 3,000 concurrent functions and get to 4,000 concurrency immediately.

Note that the burst limit is shared across all functions in the account and that you can't scale beyond the account's concurrency limit, which is 1,000 by default.

![](/img/aws/compute/lambda/fucntion-scaling.png)

:::info Burst limit
After the capacity reaches the burst limit, the system will add 500 capcity per minute linearly, until it reaches concurrency limit
:::

> Further reading: [How is the Burst Capacity related to the Baseline (execution limit)?](https://repost.aws/questions/QUtk6b7KN_QkabwGGn6PLs4w/how-is-the-burst-capacity-related-to-the-baseline)


### Lambda Throttling

![](/img/aws/compute/lambda/prevent.png)

Source: [What is Lambda Throttling? (and how to fix it!) ](https://www.youtube.com/watch?v=2tmsyweB3k4)

1.  Request unreserved concurrency limit increase: The first and probably the easiest thing that you can do is that you can request an unreserved concurrency limit increase, and this is at no cost to you. So the default limit per account per region is 1000 concurrent invocations

2.  Specify reserve concurrency per function: The second mitigation technique is to specify a reserved concurrency per function, and the way you do this is by going to your Lambda function in the configuration section, and there's a concurrency section where you can see some details about the provision concurrency limits. So what reserved concurrency does? It reserves several concurrent execution requests for a particular Lambda function. So in the example that we were discussing before, we had three Lambda functions and they were all kind of competing for that 1000 concurrency limit. Now, using this approach, you can slot a 200 concurrent limit for a particular function. So at any point in time, regardless of what your other functions are doing, this function will always be able to handle 200 concurrent requests, and the other two functions going back to the previous example will have to compete for this pool. So, in this case, it is 800. This is a mitigation technique.

3.  Configure a DLQ to capture failure: The most important is to configure a dead letter Q to capture failure as I've kind of described before. This is very important if you are receiving Throttling and you need to redirect those messages at a later point in time.

4.  Alarm on throttling exceptions: Possibly the most important is to alarm on Throttling and the presence of messages in your DLQ if you are using one. So obviously setting up a bunch of these mechanisms will help mitigate the issue But in the case that it does happen, you do need to become aware of it so that you can deal with it appropriately.




## Limitation

Some numbers for reference:

- The total size of all environment variables doesn't exceed 4 KB.

### 3 Ways to Overcome AWS Lambda Deployment Size Limit

AWS Lambda imposes certain quotas and limits on the size of the deployment package, i.e. 50MB for zipped + direct upload, and 250MB (actual figure around 262MB) for uncompressed package.

![](/img/aws/compute/lambda/deployment-package-size.png)

The belows are the workaround to overcome the limit.

1.  [Using S3 to store certain files/data](https://medium.com/geekculture/3-ways-to-overcome-aws-lambda-deployment-size-limit-part-1-f2eb2170b75b#8a5c)
2.  [Using Amazon Elastic File System --- EFS](https://medium.com/geekculture/3-ways-to-overcome-aws-lambda-deployment-size-limit-part-1-f2eb2170b75b#42f4)
3.  (This is pretty new!) Using Container Image, covered in [Part 2](https://medium.com/geekculture/3-ways-to-overcome-aws-lambda-deployment-size-limit-part-2-8d0e8d0264b0)
