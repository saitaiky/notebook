---
title: Event-Driven AI Architectures
description: Common event-driven architecture patterns for AI workloads on AWS — Lambda/EventBridge/SQS for bursty inference, streaming responses, human-approval workflows, circuit breakers, and document-ingestion pipelines.
keywords:
  - aws
  - amazon web services
  - event-driven architecture
  - eventbridge
  - step functions
  - bedrock streaming
  - circuit breaker
sidebar_position: 7
---

Generative AI workloads are rarely a single synchronous request/response call in production — they're usually embedded in a larger event-driven system that has to handle bursty traffic, long-running generation, human approval steps, and downstream failures gracefully. This page covers the recurring architecture patterns for wiring Bedrock and SageMaker into that kind of system.

## Buffering bursty inference traffic: Lambda, EventBridge, and SQS

Direct Lambda invocation on every incoming event has no built-in rate control, which is a problem when the downstream call is a Bedrock model invocation with its own throughput quota (tokens/requests per minute) that a traffic burst can easily exceed. The standard fix is to route events through **EventBridge** for filtering/routing and then into an **SQS** queue in front of the Lambda consumer: SQS absorbs bursts by buffering messages, and the Lambda function's **reserved concurrency** can be tuned to match the downstream model's throughput quota, so the queue drains at a rate the model can actually sustain instead of the consumer hammering the API and hitting throttling errors.

:::tip Exam wording cue
If a scenario mentions bursty or unpredictable request volume hitting a rate-limited downstream model, and durability/no-message-loss matters, that combination points to SQS in front of the consumer — a direct Lambda trigger or an SNS fan-out has no equivalent durable rate-limiting mechanism.
:::

## Streaming responses to the client: API Gateway, WebSockets, and Bedrock streaming

For a chat-style application, returning a Bedrock response only after the entire generation completes creates a long, silent wait before anything appears on screen. The pattern that avoids this pairs a WebSocket API (through API Gateway) with `InvokeModelWithResponseStream`: a Lambda function behind the WebSocket connection streams tokens from Bedrock to the client as they're generated, so the UI can render text progressively instead of waiting for the full response.

It's worth being precise about what this improves: streaming reduces **perceived** latency (time until the user sees the first token) and improves UX responsiveness, but it does not reduce the total number of tokens generated or the total wall-clock time for the full response to finish — those stay the same regardless of whether the response streams or arrives all at once.

## Human-in-the-loop approval: the Step Functions task-token pattern

Some AI-assisted workflows need an explicit human sign-off before proceeding — a legal contract review, a compliance check, a high-risk automated decision. A naive implementation might poll a database for an approval flag, but Step Functions has a purpose-built mechanism for this: a workflow pauses at a step configured with `waitForTaskToken`, storing that token so an external event (an approval submitted through a UI, which publishes to EventBridge or SNS) can call back into Step Functions with the token and resume the exact paused execution, carrying the approval decision forward.

:::warning Exam trap
Polling a database for an approval flag is custom-built overhead that duplicates what Step Functions' task-token callback pattern already provides natively — a scenario describing a pause-for-human-approval requirement is usually pointing at the task-token pattern, not a custom polling loop.
:::

## Circuit breaker pattern for downstream failures

When a downstream dependency (a model endpoint, an external API an agent calls) starts failing, continuing to send it traffic at the same rate can make the underlying problem worse and waste retries on calls that are very likely to fail anyway. A circuit breaker tracks the failure rate for a dependency, "opens" (stops sending traffic) once failures cross a threshold, waits, then periodically allows a small number of test requests through in a "half-open" state — resuming full traffic only if those test requests succeed. This complements retry-with-backoff logic rather than replacing it: retries handle transient blips, while a circuit breaker prevents a struggling dependency from being overwhelmed by continued traffic during a sustained outage.

## Event-driven document ingestion: S3 events into processing pipelines

A common pattern for feeding new content into a RAG system: a document lands in S3, an S3 event notification (routed through EventBridge for more flexible filtering than a direct S3-to-Lambda trigger) invokes a Step Functions workflow (often an Express Workflow for lower-latency synchronous-style execution), which runs the document through [Bedrock Data Automation](./bedrock.md#bedrock-data-automation-bda) for extraction and then into Knowledge Base ingestion — turning "a file was uploaded" into "the file is searchable" without any manual trigger or polling step.

For workloads that need to process a large batch of items in parallel (chunking many documents, running batch inference over many records), Step Functions' **Map state** iterates over an array and executes the same set of steps for each item concurrently, aggregating the results once all iterations complete — the parallelism scales automatically with the size of the input array, though completion order across the parallel branches isn't guaranteed.
