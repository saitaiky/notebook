---
title: The framework
sidebar_position: 3
draft: true
---

## A Framework for Answering System Design Questions

Designing a complex system in a 45-minute interview can be daunting. Using a framework is an effective way to structure your response and ensure you address all the key aspects an interviewer is looking for. This lesson covers a five-step interview framework that helps you:

- Design a complicated system under tight time pressure.
- Allocate your time wisely by focusing on the essential aspects of the design.
- Clearly communicate with the interviewer.
- Lead the discussion toward a productive outcome.

By using this framework, you’ll stand out as an experienced candidate who not only envisions the design at a high level but also dives deep to address realistic constraints and various operational scenarios.

### The 5-Step Framework

A system design interview answer typically consists of five steps:

1. **Define the Problem**:
   - Ask clarifying questions to gather more information about the system requirements.
   - Estimate the amount of data.
   - Time estimate: 8 minutes.

2. **Design the System at a High Level**:
   - Explain how each part of the system works together.
   - Design the APIs and data model.
   - Create a high-level design diagram.
   - Time estimate: 10 minutes.

3. **Deep-Dive into the Design**:
   - Examine the system components and their relationships in detail.
   - Assess tradeoffs and evaluate design choices.
   - Time estimate: 10 minutes.

4. **Identify Bottlenecks and Scaling Opportunities**:
   - Zoom out and consider if the system can scale.
   - Incorporate non-functional requirements through optimization techniques.
   - Time estimate: 10 minutes.

5. **Review and Summarize**:
   - Summarize requirements, justify decisions, suggest alternatives, discuss additional tradeoffs, and answer any questions.
   - Time estimate: 4 minutes.

![System Design Framework](/img/software-development/interview/How_to_Answer_System_Design_Interview_Questions_Framework_-_Lesson.png)

> 💡 **Note**: While it’s important to integrate all the steps into a structured interview framework, you can adjust the time allotted for each step based on your interview style and the problem you're trying to solve.

> 📖 **Example**: We’ll use the example, “**How would you design Instagram?**” throughout the framework to demonstrate how you can apply the framework steps in a real-world system design interview.

## Step 1: Define the Problem

**Time estimate: 8 minutes**

System design interview questions are often vague. Asking clarifying questions is a critical first step as it lays the foundation for your system design.

Your main objective in this step is to narrow down the key features and/or aspects of the system your interviewer is most interested in. Prioritize these features (e.g., P0, P1) to focus your design approach effectively. This demonstrates your ability to translate an ambiguous problem into tangible requirements.

### Clarifying Questions

- What specific features are we going to build?
- How many users does the product have?
- Are we creating the system from scratch? Do we need to integrate with existing systems?
- Who are our clients/consumers?

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might ask:
>
> 1. What is the scale of the product we are building (number of users)?
> 2. How should user feeds be generated? Should they be ordered in any way?
> 3. What kind of data are we expected to support (text, images, video)?
> 4. Should we support updating/editing of posts?

### Define Functional Requirements

Identify and discuss the system's functional requirements using insights from your clarifying questions. Establishing the core functionality helps determine what is in and out of scope for the interview.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> Based on the insights gathered, the primary areas and features of Instagram include:
> 
> - Viewing and contributing posts on the feed.
> - Customizing each feed based on the user’s following.
>
> Functional requirements include:
> 
> - Users can upload images from a mobile client to create a post.
> - Users can follow other users.
> - Users can view a feed of images.

### Define Non-Functional Requirements

After aligning on the functional requirements, consider the non-functional requirements, which often link to business objectives or the user experience. Common non-functional requirements include scalability, latency, security, consistency, reliability, availability, and maintainability.

### Questions to Ask

- What scale is this system?
- How many users should our app support?
- How many requests should our system handle?
- Are most use cases read-only?
- How important is it that users see accurate, up-to-date data?
- How important is it for services to be available and to scale horizontally?

> 📖 **Tip**: To understand how these questions map to non-functional requirements, review our lesson on [System Design Principles](https://www.tryexponent.com/courses/system-design-interview/fundamentals-system-design/system-design-principles).

### Estimate the Amount of Data

After defining your requirements, make quick calculations to estimate the data volume. These estimates inform decisions around storage solutions and scaling.

#### Key Calculations

- **Storage**: Estimate how much data the system will generate.
- **Throughput**: Estimate the number of requests per second (RPS), split into read and write RPS. You may also need to estimate bandwidth requirements.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> To estimate storage for a year’s worth of user data:
> 
> - 10M Monthly Active Users
> - 2 Photos uploaded per month
> - 5MB per photo
>
> Result: 10^7 * 2 * 5MB = 10^8MB = 100TB per month = **1.2PB per year**
>
> For throughput:
> 
> - 10M Monthly Active Users
> - ~3M Daily Active Users
>
> Write QPS: ~600k photo uploads = 6*10^5/86400 = **~10 uploads per sec**
>
> Read QPS: 10 reads per day * 3M DAU / 86400 = ~**350 reads per sec**

> 📖 **Tip**: For strategies on estimating unknowns, review Exponent’s [Estimation Strategies and Tricks lesson](https://www.tryexponent.com/courses/estimation/estimation-strategies-tricks).

## Step 2: Design the System at a High Level

**Time estimate: 10 minutes**

Based on the requirements from Step 1, design a high-level system and explain how each component works together. Your main objective is to incorporate the requirements into the system's main components without diving into too many details too soon.

### Design Your APIs

Introduce your system by designing your [APIs](https://www.tryexponent.com/courses/system-design-interview/fundamentals-system-design/system-design-apis). These APIs become the foundation of your architecture and should be stable once established.

#### API Types to Consider

- REST (Representational State Transfer)
- SOAP (Simple Object Access Protocol)
- RPC (Remote Procedure Call)
- GraphQL

Each requirement should map to one or more APIs. Consider the request's parameters and the response type. Clarify your choices with the interviewer and explain why you chose them.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> Given our requirements, standard REST APIs can facilitate communication between the client and server:
>
> ![API Design for Instagram](/img/software-development/interview/Design_Instagram_APIs_transparent_.png)

### Design Your Data Model

After designing your APIs, focus on your data model. Determine:

1. The types of data to collect/capture (e.g., metadata, video files, blob storage).
2. The attributes of the data (e.g., user-specific, submission time).
3. How to store the data considering functional requirements.
4. How the data interacts with each other, users/clients, and APIs.
5. Whether to use SQL or NoSQL databases.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> Instagram collects three types of data:
>
> - **User data**: Metadata relevant to users.
> - **Photos**: Data related to user-uploaded posts/photos.
> - **User Followers**: Relationships between users.
>
> Attributes include:
>
> - Photos are associated with specific users.
> - User followers have a 1:1 mapping.
> - The Photos table stores only metadata with content referenced via URL.
>
> Given the need for relational queries, a SQL database is suitable for maintaining these relationships.

![Data Model for Instagram](/img/software-development/interview/Design_Instagram_Data_Model_transparent_.png)

### Create a High-Level Design Diagram

Create a high-level design diagram as a

 blueprint, highlighting critical pieces to fulfill the functional requirements. This diagram should communicate how the system will function as a whole.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> Our high-level design incorporates these workflows:
>
> 1. **Uploading Images**: Users issue a request to the write server, which stores post metadata and photos.
> 2. **Following Users**: The write server processes follow requests and updates the database.
> 3. **Viewing Feeds**: Users issue a request to the read server, which queries the database for posts from followed users.
>
> ![High-Level Design for Instagram](https://images.ctfassets.net/x78yjrjc11pq/6aQux1XXbCw6hYmLKaJKZe/334e39fc37b7187d292dfe29395491fb/Design_Instagram_High_Level_Design_transparent_.png)

## Step 3: Deep-Dive into the Design

**Time estimate: 10 minutes**

After creating the high-level diagram, delve into the system components and their relationships in detail. Walk through the lifecycle of a user request to show how components interact.

### Key Discussion Points

- How is a user feed generated?
- What data storage options optimize performance?
- What benefits do read/write server separation provide?

### Assess Tradeoffs and Evaluate Design Choices

Discuss the tradeoffs you considered and how the system’s requirements impacted your design choices. Communicating these decisions shows your ability to evaluate options logically.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might discuss:
>
> **Relational vs. Non-Relational Database**: SQL databases are chosen for their JOIN operation benefits, essential for feed generation, despite needing manual sharding.
>
> **Distribution vs. Query Performance**: Using a sharding key based on timestamp and user ID to optimize for recent posts.
>
> **Read/Write Service Separation**: This minimizes noisy neighbor problems and supports fault tolerance, allowing independent horizontal scaling despite added complexity.

## Step 4: Identify Bottlenecks and Scaling Opportunities

**Time estimate: 10 minutes**

Consider if the system can scale and how it operates under various conditions. Address non-functional requirements through optimization techniques.

### Potential Topics

- Single points of failure and system robustness.
- Data replication and consistency requirements.
- Global service deployment and data locality improvements.
- Handling peak usage patterns and scaling to support more users.
- Upgrading components or migrating architectures for growth.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might address:
>
> 1. **High Latency**: Use Redis cache and CDN for data/photos access.
> 2. **Feed Generation Latency**: Maintain a cache or secondary table updated on write.
> 3. **High Availability**: Add replicas across servers and database clusters.
> 4. **Celebrity Use Case**: Batch updates and add redundancy in tables to handle high traffic.
>
> ![High-Level Design with Scalability](/img/software-development/interview/Design_Instagram_High_Level_Design_2_transparent_.png)

## Step 5: Review and Summarize

**Time estimate: 4 minutes**

Summarize your design, calling out any topics not addressed during the interview. Highlight your comprehensive understanding of the system and fill potential gaps.

### Summary Points

- Review requirements.
- Justify decisions.
- Suggest alternatives.
- Discuss additional tradeoffs.
- Answer any questions.

> 📖 **Example**: For the “**How would you design Instagram?**” question, you might say:
>
> The system meets our basic requirements, but additional features could include:
>
> 1. **Comments**: Add a service and table for handling comments.
> 2. **Feed Customization**: Add a ranking service to enhance user feed relevance.
>
> Additional considerations:
>
> 1. **Security**: Implement a reverse proxy.
> 2. **Cache Policy**: Identify optimal cache update strategies.
> 3. **Availability**: Ensure the system can handle service/table failures without single points of failure.
> 4. **Idempotency**: Ensure Object Storage operations are idempotent and the message queue can retry writes.
> 5. **Operational Continuity**: Rely on cache for service continuity during Metadata DB outages.

Check out the full lesson "[Design Instagram](/img/software-development/interview/mock-interview-design-instagram)" for a mock interview video and written solution guide.

## Common Pitfalls

- **Clarify the Problem**: Don’t jump straight into the design without clarifying requirements. Misunderstandings can lead you off-track.
- **Budget Time Carefully**: Create a high-level design before diving into details to avoid over-focusing on less important components.
- **Refer Back to Requirements**: Regularly revisit requirements to stay on track.
- **Communicate Tradeoffs**: Explicitly state the tradeoffs you’ve considered to demonstrate your ability to evaluate pros and cons.
- **Take Interviewer Hints**: Focus on areas the interviewer shows interest in to optimize your time.

> 📖 **Tip**: “The biggest misconception with system design interviews is that you should focus on creating the ‘optimal solution’. These interviews assess your ability to analyze trade-offs, make informed decisions, and communicate effectively. Asking clarifying questions is crucial to break down complex problems into manageable parts.” - Jared, Exponent Coach
