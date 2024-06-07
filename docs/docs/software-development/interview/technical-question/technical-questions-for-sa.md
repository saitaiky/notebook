---
title: Technical Questions for SA
sidebar_position: 1
draft: true
---

In this course, you'll prepare for technical questions you're likely to encounter as a Solutions Architect. You'll review key cloud architecture concepts as they apply in the real world, practice choosing APIs, designing database schemas, and more, through interview answers written by senior solutions architects.

## API Questions

When addressing API-related questions, consider:

- **Network Traffic**: Evaluate the amount of network traffic sent between consumers and the client’s server. This impacts performance and scalability.
- **Skill Level**: Assess whether the client has the skills to build and maintain complex APIs or if they will need to outsource these tasks. This impacts the design and support strategy.

## Database Schema Questions

**Determine the Database Schema for a Pizza Ordering System**

1. **Identify Entities and Attributes**:
    - Begin by clarifying the possible entities in the schema for a pizza ordering system. Use your own experience as a reference if needed. For example:
        - **Pizza**: ID, Name, Type, Description
        - **Order**: ID, Number, Order Description, Order Type, Delivery Address, Delivery Address Type (home/business)
        - **Customer**: ID, Name, Phone, Email, Address
        - **Payments**: ID, Date, Time, Amount, Method (card/cash), various fields for storing credit card details, expiry dates, etc.
        - **Coupons**: ID, Type, Description
2. **Clarify Requirements**:
    - Follow up until you've arrived at a specific set of requirements. For example:
        - Can single orders have multiple vouchers? No, an order can have a single voucher, not more.
        - Can an order have multiple pizzas? Yes.
        - Can a customer have multiple orders? Yes.
        - Can an order have only one payment? Yes.
3. **Design Adaptability**:
    - Interviewers look for clear, logical thinking and user-centric design. Is your design adaptable to changing business requirements?
4. **Scope Management**:
    - Database schemas, especially those including payments, can become complex. Clarify what is out of scope. For example, do we need to store multiple payment methods/preferences?
5. **Final Design**:
    - Creating entity-relationship diagrams or database schemas can range from simple to very complex. It's crucial to clarify every requirement before starting the design to avoid costly changes later. When in doubt, include some empty fields for future use.

![Entity-Relationship Diagram](/img/software-development/interview/pizza-model.png)

## Design an Architecture

**Design an Architecture for a Self-Serve Insurance Product**

1. **Platform Selection (Cloud Provider / On-Premise)**:
    - Decide whether to use a cloud provider or an on-premise solution based on the product's needs and scalability requirements.
2. **Design Methodology (Monolithic vs. Microservice)**:
    - Consider starting with a monolithic design and later breaking it up into components if needed.
    - Alternatively, choose a microservices architecture from the start for better scalability, despite initial added complexity.
3. **Cloud-Native Preference**:
    - For cloud-native services, develop on platforms like AWS Lambda and orchestrate through tools like AWS Step Functions. These tools provide built-in capabilities like error-handling and retries, reducing the need for custom coding. Use supported languages by AWS Lambda for development.
4. **Database Selection (SQL vs. NoSQL)**:
    - SQL databases like Amazon RDS offer scalability improvements and are suitable for relational storage.
    - NoSQL databases, such as DocumentDB, can store related information (e.g., user policy details, family policy information, and previous claims) in a single document, reducing the need for complex table joins.
5. **Define Success Metrics**:
    - Define uptime metrics to balance high availability with cost. The API gateway and Lambda functions provide high availability and can scale to thousands of requests per second.
6. **Discuss Integrations / API Considerations**:
    - Plan for API usage by defining different tiers for user needs. For example:
        - Free tier: Processing 50 policies per year.
        - Commercial tier: Processing 500 policies per year.
        - Enterprise tier: Processing 10,000 policies per year.
    - Use an API gateway to manage these tiers and facilitate integration.
