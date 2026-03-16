---
title: Step function
sidebar_position: 2
description: Serverless orchestration service defining workflows as state machines with tasks, choice, map, and parallel states for coordinating distributed applications.
keywords:
  - aws
  - amazon web services
  - integration messaging
  - step function
  - step function aws
  - step function guide
  - integration messaging on aws
  - step function tutorial
---

> Step functions is a much more simplified version of SWF (it was internally developed as **SWFv2** btw) 

## Overview

AWS Step Functions is a serverless orchestration service that lets you combine AWS Lambda functions and other AWS services to build business-critical applications. Using Step Functions, you can design and run workflows where each step's output serves as input for the next step.

Think of Step Functions as a state machine that coordinates the components of distributed applications and microservices using visual workflows. The service automatically triggers and tracks each step, and retries when errors occur, so your application executes predictably and in the right order, every time.

## Benefits of Step Functions
- Build and update apps quickly: AWS Step Functions lets you build visual workflows that enable the fast translation of business requirements into technical requirements. You can build applications in a matter of minutes, and when needs change, you can swap or reorganize components without customizing any code.
- Improve resiliency: AWS Step Functions manages state, checkpoints and restarts for you to make sure that your application executes in order and as expected. Built-in try/catch, retry and rollback capabilities deal with errors and exceptions automatically.
- Write less code: AWS Step Functions manages the logic of your application for you and implements basic primitives such as branching, parallel execution, and timeouts. This removes extra code that may be repeated in your microservices and functions.

## Core Concepts

*   **State Machine:** A workflow defined using the Amazon States Language (ASL). It's essentially a collection of states and the transitions between them.
*   **State:** A single step within a state machine. Each state performs a specific function. The type of state determines the kind of work it does.
*   **Execution:** A single run of a state machine. Each execution receives an input (payload) and progresses through the states according to the definition.
*   **Payload:** The JSON data that flows between states during an execution. The output of one state typically becomes the input of the next state.

## Common State Types

Step Functions offers various state types to define your workflow logic:

*   **`Task`:** Represents a unit of work performed by another AWS service (e.g., invoking a Lambda function, starting an ECS task, putting an item in DynamoDB). This is the most common state type for performing actions.
*   **`Choice`:** Adds branching logic. It evaluates conditions based on the payload and transitions to different states depending on the outcome (like an `if-then-else` or `switch` statement).
*   **`Map`:** Processes items in an array concurrently.
    *   **Inline Map:** Processes items with limited concurrency within the main execution history.
    *   **Distributed Map:** Designed for large-scale parallelism (up to 10,000 concurrent executions). It reads input from S3 and can write results back to S3. It runs child workflows, often in Express mode for cost-effectiveness.
*   **`Parallel`:** Executes multiple branches of states concurrently. Waits for all parallel branches to complete before proceeding.
*   **`Wait`:** Pauses the execution for a specified amount of time or until a specific timestamp.
*   **`Succeed`:** Stops an execution successfully.
*   **`Fail`:** Stops an execution and marks it as failed.
*   **`Pass`:** Simply passes its input to its output, potentially adding fixed data or performing light transformations using intrinsic functions or JSONPath. Useful for manipulating the payload or acting as a placeholder.

## Payload Handling

*   **Input/Output:** Each state receives a JSON payload as input and produces a JSON payload as output. By default, the output of a state replaces its input and becomes the input for the next state.
*   **`InputPath`, `OutputPath`, `ResultPath`, `Parameters`:** These fields within a state definition allow fine-grained control over how the payload is filtered, transformed, and merged as it passes through a state.
*   **JSONPath:** A query language used extensively within Step Functions (e.g., in `InputPath`, `ResultPath`, `Choice` state conditions) to select specific parts of the JSON payload. The `$` symbol typically represents the entire payload object.

## Error Handling

Step Functions provides built-in mechanisms for handling errors that occur within states (especially `Task` states):

*   **`Retry`:** Allows you to specify rules for automatically retrying a failed state, often with backoff delays. Useful for transient errors.
*   **`Catch`:** Defines fallback states to transition to if a state fails with specific error types (or any error using `States.ALL`). This allows for custom error handling logic, logging, or cleanup actions.

## Execution Concepts

*   **Standard Workflows:** Ideal for long-running (up to 1 year), durable, and auditable workflows. They have an exactly-once execution model and detailed visual history. Priced per state transition.
*   **Express Workflows:** Designed for high-volume, short-duration (up to 5 minutes) event-processing workflows. They have an at-least-once execution model and provide logs but not detailed visual history. Priced by the number of executions, duration, and memory consumed. Distributed Map child executions often use Express Workflows.
*   **Execution History Limit:** Standard Workflows have a limit on the number of events recorded in their execution history (currently 25,000). For workflows that might exceed this, strategies like starting a new execution to continue the process are necessary.

## Distributed Map Specifics

When using the `Map` state in `DISTRIBUTED` mode:

*   **`ItemReader`:** Specifies the source of the items to be processed, typically a JSON file or manifest file in S3.
*   **`ItemProcessor`:** Defines the state machine (often an Express Workflow) that will be executed for *each* item read by the `ItemReader`.
*   **`ResultWriter` (Optional):** Specifies an S3 location where Step Functions should write the results (or execution status) of all the child workflow executions (e.g., `manifest.json`, `SUCCEEDED_*.json`).
