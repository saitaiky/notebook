---
title: ElasticCache
description: ElasticCache
keywords:
  - ElasticCache
sidebar_position: 5
---

## Redis

:::cautionExam alert
- When choosing the replica to promote to primary, ElastiCache for Redis chooses the replica with **the least replication lag**
- You can manually promote read replicas to primary on Redis (cluster mode disabled), only **when Multi-AZ** and **automatic failover are disabled**.
:::

### Cluster Mode

You can leverage ElastiCache for Redis with cluster mode enabled to enhance reliability and availability with little change to your existing workload. Cluster Mode comes with the primary benefit of horizontal scaling up and down of your Redis cluster, with almost zero impact on the performance of the cluster.

Enabling Cluster Mode provides a number of additional benefits in scaling your cluster. There are two ways to scale your Redis (cluster mode enabled) cluster; horizontal and vertical scaling.
- **Horizontal scaling** allows you to change the number of node groups (shards) in the replication group by adding or removing node groups (shards). The online resharding process allows **scaling in/out** while the cluster continues serving incoming requests.
  Configure the slots in your new cluster differently than they were in the old cluster. Offline method only.
- **Vertical Scaling** - Change the node type to resize the cluster. The online vertical scaling allows **scaling up/down** while the cluster continues serving incoming requests. [[AWS: Online vertical scaling by modifying node type]](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/redis-cluster-vertical-scaling.html)

:::info Notes
- All the nodes in a Redis cluster must reside in the same region
  - All the nodes in a Redis cluster (cluster mode enabled or cluster mode disabled) must reside in the same region.
- While using Redis with cluster mode enabled, you cannot manually promote any of the replica nodes to primary
  - You cannot manually promote any of the replica nodes to primary.
  - Multi-AZ is required.
  - You can only change the structure of a cluster, the node type, and the number of nodes by restoring from a backup.
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

A: To address scalability and to provide a shared data storage for sessions that can be accessed from any individual web server, you can abstract the HTTP sessions from the web servers themselves. (The benifit to decouple the caching part.)

![caching-session-management-diagram](/img/aws/database/elastic-cache/caching-session-management-diagram-v2.png)

Source: [AWS: Session Management](https://aws.amazon.com/caching/session-management/)

:::caution Sticky session in ALB
Enable sticky sessions in the Application Load Balancer is not an option here! - As the Application Load Balancer itself is replaced on each new deployment, so maintaining sticky sessions via the Application Load Balancer will not work. 
:::
