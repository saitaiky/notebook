---
title: SQS
description: SQS
keywords:
  - SQS
sidebar_position: 2
---

SQS is a fully managed message queuing service which enables decoupling of the components in a cloud application, allowing distributed, loosely-coupled systems to communicate efficiently. With SQS, you can send, store, and receive messages between software components at any volume without the need to manage infrastructure. It offers high availability, durability, and supports various messaging patterns, making it an essential service for building scalable and resilient cloud applications.

## SQS temporary queues 

Temporary queues help you save development time and deployment costs when using common message patterns such as request-response. You can use the **Temporary Queue Client** to create **high-throughput**, cost-effective, application-managed temporary queues.

### Benefits

The **SQS Temporary Queue Client** maps multiple temporary queues—application-managed queues created on demand for a particular process—onto a single Amazon SQS queue automatically. This allows your application *to make fewer API calls and have **a higher throughput** when the traffic to each temporary queue is low*. When a temporary queue is no longer in use, the client cleans up the temporary queue automatically, even if some processes that use the client aren't shut down cleanly.

1. They serve as lightweight communication channels for specific threads or processes.
2. They can be created and deleted without incurring additional costs.
3. They are API-compatible with static (normal) Amazon SQS queues. This means that existing code that sends and receives messages can send messages to and receive messages from virtual queues.

### Amazon SQS Temporary Queue Client

This client makes it easy to create and delete many temporary messaging destinations without inflating your AWS bill. The key concept behind the client is the virtual queue. Virtual queues let you multiplex many low-traffic queues onto a single SQS queue. *Creating a virtual queue only instantiates **a local buffer** to hold messages* for consumers as they arrive; there is no API call to SQS and no costs associated with creating a virtual queue.


![temporary-queu](/img/aws/integration-messaging/temporary-queue.png)

Source: [Simple Two-way Messaging using the Amazon SQS Temporary Queue Client](https://aws.amazon.com/blogs/compute/simple-two-way-messaging-using-the-amazon-sqs-temporary-queue-client/)


## SQS delay queues

> TL;DR - SQS delay quese is a queue with the setting of `DelaySeconds`. What SQS delay queue accomplishes is allow some portion of your solution to run or start or complete before the message should be picked up and processed.

Delay queues let you postpone the delivery of new messages to consumers for a number of seconds, for example, **when your consumer application needs additional time to process messages**. If you create a delay queue, any messages that you send to the queue remain invisible to consumers for the duration of the delay period. The default (minimum) delay for a queue is 0 seconds. The maximum is 15 minutes.

:::info Use cases of delay queues
- Emails - Let's say you have a service that sends reminder emails triggered from queue messages. You'd have to delay enqueueing the message in that case.

- Race conditions - Delivery delays can be used to overcome race conditions in distributed systems. For example, a service could insert a row into a table, and sends a message about its availability to other services. They can't use the new entry just yet, so you have to delay publishing the SQS message.

- Handling retries - Sometimes if a message fails you want to retry with **exponential backoffs**. This requires re-enqueuing the message with longer delays.
:::

Delay queues are similar to [visibility timeouts](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) because both features make messages unavailable to consumers for a specific period of time. The difference between the two is that, for delay queues, a message is hidden *when it is first added to queue*, whereas for visibility timeouts a message is hidden *only after it is consumed from the queue*. The following diagram illustrates the relationship between delay queues and visibility timeouts.

![sqs-delay-queues-diagram](/img/aws/integration-messaging/sqs-delay-queues-diagram.png)

Source: [Amazon SQS delay queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html)


## Visibility timeouts

When using sqs as queuing service, when you read the message off the queue it does not automatically delete the message off the queue. So when you are processing the message, sqs will wait for the time period defined as visibility timeout before other consumers will get the same message again.

The best time value to set for the visibility timeout will be at least the timeout value for the consumer process. If the consumer is able to successfully complete the processing then it would delete the message off the queue else if it times out then the message reappears in the queue for other consumer to pick it again.

## Does SQS guarantee delivery of messages?

- Standard queues provide at-least-once delivery, which means that each message is delivered at least once.

- FIFO queues provide [exactly-once processing](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html#FIFO-queues-exactly-once-processing), which means that each message is delivered once and remains available until a consumer processes it and deletes it. Duplicates are not introduced into the queue.
### At-least-once delivery

:::info Deep dive disucssion
To check different type of messaging systems, visit the [Messaging within distributed system](/software-development/system-design/queue/overview) page. If you want to check the official document, visit [AWS - At-least-once delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html#standard-queues-at-least-once-delivery)
:::

Amazon SQS stores copies of your messages on multiple servers for redundancy and high availability. On rare occasions, one of the servers that stores a copy of a message might be unavailable when you receive or delete a message.

If this occurs, the copy of the message isn't deleted on that unavailable server, and **you might get that message copy again** when you receive messages. Design your applications to be *idempotent* (they should not be affected adversely when processing the same message more than once).


### Exactly-Once Delivery

When duplicates can't be tolerated, [FIFO (first-in-first-out) message queues](https://aws.amazon.com/sqs/) will make sure that each message is delivered exactly once (and only once) by filtering out duplicates automatically.


### Push and Pull Delivery

Most [message queues](https://aws.amazon.com/sqs/) provide both push and pull options for retrieving messages. 
- Pull means continuously querying the queue for new messages. You can also use long-polling to allow pulls to wait a specified amount of time for new messages to arrive before completing.
- Push means that a consumer is notified when a message is available (this is also called [Pub/Sub messaging](https://aws.amazon.com/pub-sub-messaging/) - SQS+SNS). Some of the supported [Pub/Sub publish subscribe patterns](https://cloud.google.com/pubsub/docs/pubsub-basics#choose_a_publish_and_subscribe_pattern) include the following: Fan in (many-to-one)
  - Fan in (many-to-one)
  - Load balanced (many-to-many)
  - Fan out (one-to-many): In this example, a single or multiple publisher applications publish messages to a single topic. This single topic is attached to multiple subscriptions. Each subscription is connected to a single subscriber application. Each of the subscriber applications gets the same set of published messages from the topic. When a topic has multiple subscriptions, then every message has to be sent to a subscriber receiving messages on behalf of each subscription. If you need to *perform different data operations on the same set of messages*, fan out is a good option. You can also attach multiple subscribers to each subscription and get a load-balanced subset of messages for each subscriber.



## Trouble shooting

### How to convert SQS standard queue to FIFO queue with batching?

1. Delete the existing standard queue and recreate it as a FIFO queue
2. Make sure that the name of the FIFO queue ends with the .fifo suffix
3. Make sure that the throughput for the target FIFO queue does not exceed 3,000 messages per second

:::info
By default, FIFO queues support up to 3,000 messages per second with batching, or up to 300 messages per second (300 send, receive, or delete operations per second) without batching. 
:::
