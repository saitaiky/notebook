---
title: Rubric for System Design
sidebar_position: 2
---

System design interviews evaluate your ability to construct systems that are performant, scalable, efficient, and fault-tolerant while exhibiting excellent communication skills. This article outlines 5 rubrics used to assess candidates during system design interview. 

- Problem scope
- Technical design and tradeoffs
- Scalability and performance
- Fault tolerance and reliability 
- Communication and collaboration



## Problem Understanding and Requirement Collection

:::infoTL;DR
- Demonstrates the ability to ask relevant and clarifying questions.
- Understands the problem, system requirements, and constraints.
- Scopes the problem effectively within the interview's time constraints.
- Incorporates anticipated future project and business requirements where applicable.
:::

For an interview question about an unreliable network, you might ask: “Do we prefer to ensure the successful delivery of a message (at the cost of certain redundancy), or can we tolerate a lossy message transfer?” This clarifying question considers potentially conflicting design requirements/constraints. It identifies the most common operating conditions that satisfy the requirements for the given constraints.

## Technical Design and Tradeoffs

:::infoTL;DR
- Capably explains design decisions and the tradeoffs between different design choices.
- Analyzes design components and their interactions within the system.
- Demonstrates technical depth and real-world application of design principles.
:::

- **Performance vs. cost**: Performance-enhancing resources, such as computational power, memory, or network bandwidth, come at a cost. Strike a balance between optimal performance and budgetary constraints.
- **Consistency vs. availability**: Strong consistency across a distributed system can ensure data integrity and prevent conflicts, but it often requires coordination and synchronization, which can hinder system availability.
- **Latency vs. consistency**: In distributed systems, ensuring strong consistency can increase latency, which compromises the user experience. Balance the need for low latency with the level of consistency required for the application.
- **Security vs. usability**: Implementing stringent security measures, such as complex authentication or encryption protocols, to enhance system security can introduce usability challenges and hinder the user experience. Balance the need for strong security and usability to ensure both are prioritized appropriately.
- **Storage efficiency vs. read/write performance**: Optimizing storage efficiency by using compression or compact data formats to reduce storage costs can compromise read and write performance due to the additional processing required. Determine the optimal tradeoff based on the specific requirements of the system.

## Scalability and Performance

:::infoTL;DR
- Distinguishes potential bottlenecks and selects appropriate scaling techniques.
- Uses realistic data and calculations to project solutions for scalability and performance challenges.
:::

- **Horizontal scaling vs. vertical scaling**: Horizontal scaling adds more instances or nodes to the system to handle increased load. Explore approaches like load balancing, sharding, or partitioning to distribute the workload across multiple servers or resources. Introduce vertical scaling, which increases the resources of individual nodes, such as CPU or memory, to handle increased load. Consider opting for horizontal scaling for a large distributed system, given that it's a more common and cost-effective pattern.
- **Caching and content delivery**: Caching helps reduce the load on backend systems and improve response times. Explore caching strategies like in-memory caches, distributed caching, or content delivery networks (CDNs) to serve static content closer to users.
- **Asynchronous processing**: For offline/non-real-time tasks, asynchronous processing could remove a large portion of a system from a latency-critical or resource-sensitive path. Consider message queues, event-driven architectures, or asynchronous workflows to decouple components and improve system responsiveness.
- **Database scaling**: Discuss approaches like database partitioning, sharding, replication, or utilizing distributed databases to handle increasing data volumes and achieve high performance.

## Fault Tolerance and Reliability

:::infoTL;DR
Incorporates strategies in the design to support fault tolerance and system reliability while considering potential failures.
:::

- Present redundancy measures like data replication or backup systems and their role in system resilience.
- Describe automated failure recovery methods to handle failover scenarios without manual oversight.
- **Failure detection and monitoring**: Discuss techniques such as health checks, heartbeat mechanisms, or distributed monitoring systems to identify and respond to failures promptly.
- **Error handling and retry mechanisms**: Discuss approaches such as exponential backoff, circuit breakers, or retry queues to handle transient failures and prevent cascading failures.
- **Data durability and consistency**: Explain concepts like write-ahead logging, distributed transactions, or eventual consistency models to handle failures without compromising data integrity.
- **Testing and simulations**: Discuss techniques such as chaos engineering, fault injection, or stress testing to proactively identify weaknesses and validate the system's fault tolerance mechanisms.

## Communication and Collaboration

:::infoTL;DR
- Communicates ideas clearly and listens actively to the interviewer's feedback throughout the interview.
- Seeks collaboration and maintains a two-way dialogue with the interviewer.
:::

- **Structured approach**: 
    - It’s often desirable to present the solution in a hierarchical approach, providing a high-level overview of the system first before diving into details. 
    - Break down complex problems into smaller components, explain the reasoning behind your choices, and clearly justify your design tradeoffs.
- **Contextualize your design**: 
    - Clearly explain the context and assumptions underlying your design decisions. Discuss the specific problem domain, user requirements, and any constraints that influenced your design. This demonstrates your ability to understand the broader context of the system.
    - Employ visual aids to bolster understanding of complex system designs.
- **Collaboration & Communicate**: 
    - Seek the interviewer’s input and feedback, and encourage a dialogue to foster a collaborative atmosphere. 
    - If faced with a challenging problem during the interview, actively collaborate with the interviewer to explore potential solutions. Engage in a discussion, brainstorm alternative ideas, and consider different perspectives.
    - Engage in active listening and seek clarity on any ambiguities by asking targeted follow-up questions.
    - Communicate clearly and concisely, avoiding unnecessary jargon and presenting ideas coherently.
- **Positive attitude**: Maintain a positive and enthusiastic demeanor throughout the interview. Show genuine interest in the interviewer's feedback and be receptive to constructive criticism. Demonstrating a positive attitude indicates your willingness to collaborate and learn from others.

## Other

Depending on the role's specifications, additional factors might be evaluated:

- **Security and Privacy**:
    - Implement security aspects including authentication, authorization, encryption, and data privacy considerations.
    - Apply security practices like password hashing, token-based authentication, OAuth, SSL/TLS, and RBAC to protect user data and system integrity.
- **API Design**
    - Demonstrate the design of functional APIs that facilitate easy interaction between system components and meet end-user needs.

