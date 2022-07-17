---
title: SQS
description: SQS
keywords:
  - SQS
sidebar_position: 2
---


## Amazon SQS delay queues

> TL;DR - What SQS delay queue accomplishes is allow some portion of your solution to run or start or complete before the message should be picked up and processed.

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

## Does Amazon SQS guarantee delivery of messages?

- Standard queues provide at-least-once delivery, which means that each message is delivered at least once.

- FIFO queues provide [exactly-once processing](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html#FIFO-queues-exactly-once-processing), which means that each message is delivered once and remains available until a consumer processes it and deletes it. Duplicates are not introduced into the queue.
### At-least-once delivery

:::info Deep dive disucssion
I have made a note about different type of messaging system before. If you would like to learn more about his topic, visit the [Messaging within distributed system](/tech-concepts/system-design/messaging/overview) page.

If you want to check the official document, visit [AWS - At-least-once delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html#standard-queues-at-least-once-delivery)
:::

Amazon SQS stores copies of your messages on multiple servers for redundancy and high availability. On rare occasions, one of the servers that stores a copy of a message might be unavailable when you receive or delete a message.

If this occurs, the copy of the message isn't deleted on that unavailable server, and **you might get that message copy again** when you receive messages. Design your applications to be *idempotent* (they should not be affected adversely when processing the same message more than once).


### Exactly-Once Delivery

When duplicates can't be tolerated, [FIFO (first-in-first-out) message queues](https://aws.amazon.com/sqs/) will make sure that each message is delivered exactly once (and only once) by filtering out duplicates automatically.


### Push and Pull Delivery

Most [message queues](https://aws.amazon.com/sqs/) provide both push and pull options for retrieving messages. Pull means continuously querying the queue for new messages. Push means that a consumer is notified when a message is available (this is also called [Pub/Sub messaging](https://aws.amazon.com/pub-sub-messaging/) - SQS+SNS). You can also use long-polling to allow pulls to wait a specified amount of time for new messages to arrive before completing.