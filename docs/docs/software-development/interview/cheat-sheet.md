---
title: CheatSheet
sidebar_position: 100
draft: true
---

## 5-Step Framework for Answering System Design Interview Questions

1. **Define the Problem**:
   - Clarify requirements.
   - Estimate the amount of data.
2. **Design the System at a High Level**:
   - Explain system components and interactions.
   - Design APIs and data model.
   - Create a high-level design diagram.
3. **Deep-Dive into the Design**:
   - Examine system components in detail.
   - Assess tradeoffs and evaluate design choices.
4. **Identify Bottlenecks and Scaling Opportunities**:
   - Consider scalability and performance.
   - Incorporate non-functional requirements.
5. **Review and Summarize**:
   - Summarize design decisions.
   - Justify choices and discuss alternatives.
   - Address any gaps or questions.

## Rubric for System Design Interviews

- **Problem Scope**:
  - Understand and define the problem clearly.
- **Technical Design and Trade-offs**:
  - Create a robust design.
  - Discuss trade-offs between different solutions.
- **Scalability and Performance**:
  - Ensure the system can scale efficiently.
  - Optimize for performance.
- **Fault Tolerance and Reliability**:
  - Design for high availability and fault tolerance.
  - Plan for failure and recovery.
- **Communication and Collaboration**:
  - Communicate ideas effectively.
  - Engage with the interviewer throughout the process.

## Key Concepts to Understand

### System Design Principles

- **UDP vs. TCP**:
  - **UDP**: Low latency, no guarantee of delivery, used for streaming.
  - **TCP**: Reliable delivery, ensures order, used for data requiring consistency.
- **Load Balancing**:
  - Distribute traffic evenly to avoid bottlenecks.
  - Manage user sessions and deployment strategies.
- **PUSH vs. Pull CDN**:
  - **PUSH**: Proactively push content to edge servers.
  - **Pull**: Content is fetched from the origin server as needed.

### API Design

- **Choosing Between APIs**:
  - **REST**: Simple, standard, widely used.
  - **GraphQL**: Flexible queries, reduces over-fetching.
  - **SOAP**: Strict, high security, used in enterprise solutions.
- **API Design Patterns**:
  - **Pagination**: Manage large datasets efficiently.
  - **Long-running Operations**: Handle extended processes gracefully.
  - **API Idempotency**: Ensure consistent results for repeated requests.
  - **API Gateways**: Centralize API management and security.

### CAP Theorem

- **Consistency**:
  - Every read receives the most recent write.
- **Availability**:
  - Every request receives a response, without guarantee it contains the most recent data.
- **Partition Tolerance**:
  - The system continues to function despite network partitions.

### Caching

- **Key Decisions for Cache Design**:
  1. **Cache Size**: How much data should be cached?
  2. **Eviction Policy**: When and how should data be removed from the cache?
  3. **Expiration Policy**: How long should data remain in the cache before expiring?

### SQL vs. NoSQL

- **SQL**:
  - **Pros**: Strong relationships, structured data, supports ACID properties.
  - **Cons**: Requires structured data, harder to scale horizontally.
- **NoSQL**:
  - **Pros**: Handles unstructured data, scales horizontally, supports various data models.
  - **Cons**: Often offers eventual consistency, less structured schema.

### Database Sharding & Replication

**TO-DO**: Distributing and duplicating data for scalability.

### Asynchronous Processing

- **Use Cases**:
  - Handling tasks with long or unpredictable processing times.
  - Situations where immediate processing isn't required, e.g., Facebook's newsfeed propagation.

### Replication Strategy

- **Goals**:
  - Improve read performance.
  - Increase system reliability.
  - Support global scaling and handle high write loads.
  - Implement a multi-region strategy for disaster recovery.

### Authentication and Authorization

- **Considerations**:
  - Evaluate the need for Multi-Factor Authentication (MFA).
  - Determine the security requirements based on user and data sensitivity.
- **Encryption & Authentication**: Securing data and verifying identities.

### Availability vs. Reliability

- **Availability**:
  - Use queue-based load leveling, gateway aggregation.
  - Implement rate limiting to manage traffic spikes.
- **Reliability**:
  - Design for retry mechanisms (simple and delayed) to ensure reliable processing.

## Tips for Success

- **Communication**: Keep the conversation interactive with the interviewer.
- **Trade-offs**: Clearly discuss trade-offs for different design choices.
- **Scalability**: Always consider how your design can handle growth.
- **Preparation**: Practice with whiteboarding tools and review common system design principles.
