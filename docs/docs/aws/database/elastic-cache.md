---
title: ElasticCache
description: ElasticCache
keywords:
  - ElasticCache
sidebar_position: 5
---


For the high level overview of what is caching, please refer to my another post: [What is Caching](/software-development/others/cache/)
## Memcached

:::cautionImportant points
- Amazon ElastiCache for Memcached does not support Multi-AZ for high availability.
- You can use `CreateCacheCluster` API action to create a new ElastiCache cluster.
- Each node is an EC2 instance, thus you can set its `CacheNodeType` parameter to choose the underlying EC2 instance type of the cluster.
:::

> Reference: [Scaling ElastiCache for Memcached clusters](https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/Scaling.html#Scaling.Memcached.Vertically)

### Scaling Memcached Horizontally
The Memcached engine supports partitioning your data across multiple nodes. Because of this, Memcached clusters scale horizontally easily. A Memcached cluster can have from 1 to 40 nodes. To horizontally scale your Memcached cluster, merely add or remove nodes.

### Scaling Memcached vertically

![memcache](/img/aws/database/elastic-cache/memcache.png)

- When you scale your Memcached cluster up or down, you must create a new cluster. Memcached clusters always start out empty unless your application populates it.
- You can downgrade the node type by creating a new cluster and using a lower EC2 type

## Redis

:::cautionImportant Points
- When choosing the replica to promote to primary, ElastiCache for Redis chooses the replica with **the least replication lag**
- You can manually promote read replicas to primary on Redis (cluster mode disabled), only **when Multi-AZ** and **automatic failover are disabled**.
- To maintain high availability, you have to make sure that there are **at least two nodes in the cluster**. 
- You can directly change the instance type of your cluster without creating a new one unlike Memcached
:::

### Cluster Mode

You can leverage ElastiCache for Redis with cluster mode enabled to enhance reliability and availability with little change to your existing workload. Cluster Mode comes with the primary benefit of horizontal scaling up and down of your Redis cluster, with almost zero impact on the performance of the cluster.

Enabling Cluster Mode provides a number of additional benefits in scaling your cluster. There are two ways to scale your Redis (cluster mode enabled) cluster; horizontal and vertical scaling.
- **Horizontal scaling** allows you to change the number of node groups (shards) in the replication group by adding or removing node groups (shards). The online resharding process allows **scaling in/out** while the cluster continues serving incoming requests.
  Configure the slots in your new cluster differently than they were in the old cluster. Offline method only.
- **Vertical Scaling** - Change the node type to resize the cluster. The online vertical scaling allows **scaling up/down** while the cluster continues serving incoming requests. [[AWS: Online vertical scaling by modifying node type]](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/redis-cluster-vertical-scaling.html)

:::infoNotes
- Limitation
  - All the nodes in a Redis cluster (cluster mode enabled or cluster mode disabled) must reside in the same region.
  - While using Redis with cluster mode enabled, you cannot manually promote any of the replica nodes to primary.
- Cost
  - When doing **vertical scaling** by changing the node type **via online resizing**, you won’t have to pay for backups and migration costs, all you have to pay for are the resources provisioned when a scale up or scale out is performed. 
:::
### Cluster Mode Disabled vs Enabled 

Cluster Mode also allows for more flexibility when designing new workloads with unknown storage requirements or heavy write activity. In a read-heavy workload, one can scale a single shard by adding read replicas, up to five, but a write-heavy workload can benefit from additional write endpoints when cluster mode is enabled.

![ElastiCache-NodeGroups](/img/aws/database/elastic-cache/ElasticCache-NodeGroups.png)

Source: [AWS: Redis (Cluster Mode Disabled) vs. Redis (Cluster Mode Enabled)](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Replication.Redis-RedisCluster.html)


## Features
### Geospatial on Amazon ElastiCache for Redis

Amazon ElastiCache for Redis offers *purpose-built in-memory data structures and operators to manage real-time geospatial data at scale and speed*. You can use ElastiCache for Redis to add location-based features such as drive time, drive distance, and points of interests to your applications. Learn how to [build a geospatial application](https://aws.amazon.com/blogs/database/amazon-elasticache-utilizing-redis-geospatial-capabilities/) with ElastiCache for Redis.

![product-page-diagram_ElastiCache_redis-geospatial](/img/aws/database/elastic-cache/product-page-diagram_ElastiCache_redis-geospatial.png)

Example of how to store geospatial information 
```js
const redis = require('redis');

// first, we connect to our Redis cluster
var client = redis.createClient({
  host: ELASTICACHE_HOST,
  port: ELASTICACHE_PORT
});

// next, we can store the user's most recent location
client.send_command('GEOADD',
  [ 'public-bikes:stations',
  latitude,
  longitude,
  stationId ], (error, reply) => {
  client.quit();
  if (error) { ... }
  else { ... }
});
```

Source: [Amazon ElastiCache for Redis](https://aws.amazon.com/elasticache/redis/)

### Use ElastiCache to maintain user sessions

Q: An IT company uses a blue/green deployment policy to provision new Amazon EC2 instances in an Auto Scaling group behind a new Application Load Balancer for each new application version. The current set up requires the users to log in after every new deployment. What will you do to solve the issue?

A: To address scalability and to provide a shared data storage for sessions, using ElastiCache can be accessed from any individual web server, you can abstract the HTTP sessions from the web servers themselves. (The benefit to decouple the caching part.)

![caching-session-management-diagram](/img/aws/database/elastic-cache/caching-session-management-diagram-v2.png)

Source: [AWS: Session Management](https://aws.amazon.com/caching/session-management/)

:::cautionEnable sticky sessions in the ALB is not an option!
As the Application Load Balancer itself is replaced on each new deployment, so maintaining sticky sessions via the Application Load Balancer will not work. 
:::


## Redis VS Memcached

**Amazon ElastiCache** supports both **Memcached** and **Redis** as in-memory caching engines. Each has its own use cases and reasons for implementation:

**Memcached:**
- **Use Cases:** Memcached is ideal for use cases that require simple and fast caching of frequently accessed data. It's suited for scenarios where data does not need to be persisted long-term, and cache eviction can be managed based on Least Recently Used (LRU) principles.
- **Reasons:** Memcached offers high-speed, low-latency caching, making it well-suited for applications that require rapid data retrieval, such as session caching, real-time analytics, and temporary data storage.

**Redis:**
- **Use Cases:** Redis is versatile and suits a wide range of use cases, including caching, real-time analytics, session management, and more. Its advanced features, like data persistence, data structures, and publish/subscribe capabilities, make it suitable for more complex caching needs and scenarios requiring data manipulation.
- **Reasons:** Redis provides richer data types, supports more advanced caching strategies, and can be used for both caching and as a data store. Its persistence options, including snapshots and AOF (Append-Only File), enable data durability and recovery, making it a choice for applications that need both caching and data persistence.
- **Highlights**
  - Multi-AZ failover

In summary, choose **Memcached** for straightforward(simplest model), high-speed caching where data persistence is not a primary concern, and select **Redis** when you need a more versatile caching solution with advanced data structures, persistence options, and additional features beyond caching.

