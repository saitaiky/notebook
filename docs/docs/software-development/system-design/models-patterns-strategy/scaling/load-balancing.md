---
title: Load Balancing
---

:::infoLoad balancing algorithms
To check what algorithms available in AWS, please check my other post [Request Routing Algorithms](/aws/networking/elb/#request-routing-algorithms)
:::

## Why do we need it?

### Application availability

Server failure or maintenance can increase application downtime, making your application unavailable to visitors. Load balancers increase the fault tolerance of your systems by automatically detecting server problems and redirecting client traffic to available servers. You can use load balancing to make these tasks easier:
- Run application server maintenance or upgrades without application downtime
- Provide automatic disaster recovery to backup sites
- Perform health checks and prevent issues that can cause downtime

### Application scalability

You can use load balancers to direct network traffic intelligently among multiple servers. Your applications can handle thousands of client requests because load balancing does the following:
- Prevents traffic bottlenecks at any one server
- Predicts application traffic so that you can add or remove different servers, if needed
- Adds redundancy to your system so that you can scale with confidence

### Application security

Load balancers come with built-in security features to add another layer of security to your internet applications. They are a useful tool to deal with distributed denial of service attacks, in which attackers flood an application server with millions of concurrent requests that cause server failure. Load balancers can also do the following:
- Monitor traffic and block malicious content
- Automatically redirect attack traffic to multiple backend servers to minimize impact
- Route traffic through a group of network firewalls for additional security

### Application performance

Load balancers improve application performance by increasing response time and reducing network latency. They perform several critical tasks such as the following:
- Distribute the load evenly between servers to improve application performance
- Redirect client requests to a geographically closer server to reduce latency
- Ensure the reliability and performance of physical and virtual computing resources

## When to use load balancing

You should use a load balancer whenever you think the system you're designing would benefit from increased capacity or redundancy. Often load balancers sit right between external traffic and the application servers. In a microservice architecture, it's common to use load balancers in front of each internal service so that every part of the system can be scaled independently.

Be aware, load balancing *cannot* solve many scaling problems in system design. For example, an application can also succumb to database performance, algorithmic complexity, and other types of resource contention. Adding more web servers won't compensate for inefficient calculations, slow database queries, or unreliable third-party APIs. In these cases, it may be necessary to design a system that can process tasks asynchronously, such as a job queue (see the Web Crawler question for an example).

Load balancing is notably distinct from **rate limiting**, which is when traffic is intentionally throttled or dropped in order to prevent abuse by a particular user or organization.

## Considerations

Below are 3 points to keep in mind when implement load balancing to your application

- **Bottlenecks**. As scale increases, load balancers can themselves become a bottleneck or single point of failure, so multiple load balancers must be used to guarantee availability. [DNS round robin](https://en.wikipedia.org/wiki/Round-robin_DNS) can be used to balance traffic across different load balancers.
- **User sessions**. The same user's requests can be served from different backends unless the load balancer is configured otherwise. This could be problematic for applications that rely on session data that isn't shared across servers.
- **Longer deploys**. Deploying new server versions can take longer and require more machines since the load balancer needs to roll over traffic to the new servers and drain requests from the old machines.