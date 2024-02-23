---
title: "System design principle"
---

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


## System Design element

There are so many components, algorithms, and architectures that support optimality in the above dimensions of distributed system design.

You will quickly find that each element in the system design may be great with respect to one dimension but at the cost of being low-performing in another (i.e. a component might be extremely efficient but not as reliable, or a certain design choice might be really effective at supporting one functionality like providing read access but not as efficient with write access).

In other words, there are tradeoffs that you must consider as you make informed system design choices. The best way to understand these tradeoffs is to understand how each of these components, algorithms and architectural designs work. In particular it is helpful to know how each element (tool):

- Works independently.
- Compares to other tools that perform similarly.
- Fits together in the bigger picture of system-level design.