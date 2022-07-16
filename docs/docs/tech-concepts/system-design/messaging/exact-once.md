---
title: Exactly Once

sidebar_position: 4
---

> For the detailed explaination of this topic, go visit [How Akka Works: 'Exactly Once' Message Delivery](https://www.lightbend.com/blog/how-akka-works-exactly-once-message-delivery) 

> TL;DR - Exactly once is the most difficult delivery semantic to implement. It is friendly to users, but it has a high cost for the system’s performance and complexity.

## Overview

As we just briefly discussed, with the at-least-once messaging approach, the best we can do is implement processes that may result in the delivery of some messages more than once.

Conceptually an exactly-once message approach is much more desirable. But, as the saying goes, “you can’t always get what you want.”

For now, consider that implementing an exactly-once messaging solution is on the same level as creating a vehicle that can travel faster than the speed of light. There are ways to get close, that is to deliver messages essentially-once but it is impossible to implement an exactly-once process that works. In part 3 of this series, we will look at this in more detail.

## Use case

> TL;DR - Financial-related use cases (payment, trading, accounting, etc.). Exactly once is especially important when duplication is not acceptable and the downstream service or third party doesn’t support idempotency.
