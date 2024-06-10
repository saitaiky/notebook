---
title: "System design principle"
---

## System Design Principles

System design involves architecting systems that fulfill functional and non-functional requirements effectively. The goal is to create systems that are scalable, reliable, available, efficient, and maintainable. Here’s a structured overview based on the principles and example provided:

### Purpose of System Design

**Objective**: To architect a system that supports functionality and requirements in the best possible way.

The "best" system is evaluated across several dimensions:

- **Scalability**
   - **Definition**: The ability of a system to handle increased load efficiently.
   - **Design Considerations**: Use of load balancers, caching, and appropriate database choices (e.g., NoSQL, object storage).
- **Reliability**
   - **Definition**: The system performs as expected, tolerates user mistakes, and prevents unauthorized access.
   - **Design Considerations**: Proper API design, error handling mechanisms, and fault tolerance strategies.
- **Availability**
   - **Definition**: The ability of a system to be operational and accessible (uptime/total time).
   - **Design Considerations**: Load balancing, redundancy, and failover mechanisms.
   - **Relation to Reliability**: Reliability implies availability but availability does not necessarily imply reliability.
- **Efficiency**
   - **Definition**: The ability of a system to perform its functionality quickly.
   - **Metrics**: Latency, response time, and bandwidth.
   - **Design Considerations**: Efficient algorithms, data structures, and optimization techniques.
- **Maintainability**
   - **Definition**: The ease with which a system can be operated, understood by new engineers, and modified for new use cases.
   - **Design Considerations**: Modularity, clear API definitions, and documentation.

### Example: Simple Distributed System

Let’s consider a basic distributed system designed for writing and saving information, where users get an associated URL with their text (similar to PasteBin).

#### System Design Properties

- **Scalability**
  - **Example Implementation**: Use of load balancers and caches.
  - **Components**: Object storage (e.g., Amazon S3) and NoSQL databases.
  - **Benefit**: Facilitates handling additional load from more users.
- **Reliability**
  - **Example Implementation**: Reliable handling of write functionality and error handling.
  - **Components**: Well-defined APIs.
  - **Benefit**: Handles user errors and ensures consistent performance.
- **Efficiency**
  - **Example Implementation**: Caching for read requests and load balancing.
  - **Components**: Cache servers, load balancers.
  - **Benefit**: Reduces latency and improves response times.
- **Availability**
  - **Example Implementation**: Load balancing and redundant databases.
  - **Components**: Multiple servers, redundant databases.
  - **Benefit**: Reduces the likelihood of system failure.
- **Maintainability**
  - **Example Implementation**: Modular API design separating read and write operations.
  - **Components**: Modular service architecture.
  - **Benefit**: Simplifies modifications and onboarding of new engineers.

You should **ALWAYS** keep the properties of scalability, reliability, efficiency, availability, and maintainability in mind. Address each property with specific design decisions and examples, demonstrating your understanding of how these principles apply in practice.

### System Design Toolbox

There are so many components, algorithms, and architectures that support optimality in the above dimensions of distributed system design. For example MVC, HTTP VS HTTPS, load Balancers, caching strategies, database sharding or memory management techniques etc.

You will quickly find that each element in the system design may be **great with respect to one dimension but at the cost** of being low-performing in another (i.e. a component might be extremely efficient but not as reliable, or a certain design choice might be really effective at supporting one functionality like providing read access but not as efficient with write access).

In other words, there are tradeoffs that you must consider as you make informed system design choices. The best way to understand these tradeoffs is to understand how each of these components, algorithms and architectural designs work. In particular it is helpful to know how each element (tool):

- Works independently.
- Compares to other tools that perform similarly.
- Fits together in the bigger picture of system-level design.

## [AWS Well-Architected 6 piallar](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc) 

The AWS Well-Architected Framework describes key concepts, design principles, and architectural best practices for designing and running workloads in the cloud. By answering a few foundational questions, learn how well your architecture aligns with cloud best practices and gain guidance for making improvements.

- Operational Excellence
  - Running and monitoring systems, and continually improving processes and procedures.
- Security
  - Confidentiality and integrity of data, managing user permissions, and establishing controls to detect security events.
- Reliability
  - Workloads performing their intended functions and how to recover quickly from failure to meet demands.
  - Distributed system design, recovery planning, and adapting to changing requirements.
- Performance Efficiency
  - Structured and streamlined allocation of IT and computing resources
  - Selecting resource types and sizes optimized for workload requirements, monitoring performance, and maintaining efficiency as business needs evolve.
- Cost Optimization
  - Avoiding unnecessary costs
  - Understanding spending over time and controlling fund allocation, selecting resources of the right type and quantity, and scaling to meet business needs without overspending.
- Sustainability
  - Minimizing the environmental impacts of running cloud workloads. 
  - Key topics include a shared responsibility model for sustainability, understanding impact, and maximizing utilization to minimize required resources and reduce downstream impacts. 

