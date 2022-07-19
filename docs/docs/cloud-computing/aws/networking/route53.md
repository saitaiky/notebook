---
title: Route 53
description: Route 53
keywords:
  - Route 53
sidebar_position: 2
---

## Alias record 

Amazon Route 53 alias records provide a Route 53–specific extension to DNS functionality. Alias records let you route traffic to selected AWS resources, such as CloudFront distributions and Amazon S3 buckets. They also let you route traffic from one record in a hosted zone to another record.

:::caution Only alias record can record top node of DNS namespace. CNAME can't
Unlike a **CNAME record**, you can create **an alias record** at the top node of a DNS namespace, also known as the zone apex. For example, if you register the DNS name example.com, the zone apex is example.com. You can't create a **CNAME record** for example.com, but you can create **an alias record** for example.com that routes traffic to www.example.com (as long as www.example.com doesn't already have a CNAME record).
:::

When Route 53 receives a DNS query for an alias record, Route 53 responds with the applicable value for that resource:

- **An Amazon API Gateway custom regional API or edge-optimized API** - Route 53 responds with one or more IP addresses for your API.
- **An Amazon VPC interface endpoint** - Route 53 responds with one or more IP addresses for your interface endpoint.
- **A CloudFront distribution** - Route 53 responds with one or more IP addresses for CloudFront edge servers that can serve your content.
- **An Elastic Beanstalk environment** - Route 53 responds with one or more IP addresses for the environment.
- **An ELB load balancer** - Route 53 responds with one or more IP addresses for the load balancer.
- **An AWS Global Accelerator accelerator** - Route 53 responds with one of the two IP addresses for the accelerator.
- **An Amazon S3 bucket that is configured as a static website** - Route 53 responds with one IP address for the Amazon S3 bucket.
- **Another Route 53 record in the same hosted zone** - Route 53 responds as if the query is for the record that is referenced by the alias record.

When you use an alias record to route traffic to an AWS resource, Route 53 automatically recognizes changes in the resource. For example, suppose an alias record for example.com points to an ELB load balancer at lb1-1234.us-east-2.elb.amazonaws.com. If the IP address of the load balancer changes, Route 53 automatically starts to respond to DNS queries using the new IP address.

If an alias record points to an AWS resource, you can't set the time to live (TTL); Route 53 uses the default TTL for the resource. If an alias record points to another record in the same hosted zone, Route 53 uses the TTL of the record that the alias record points to. For more information about the current TTL value for Elastic Load Balancing, go to [Request routing](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html#request-routing) in the *Elastic Load Balancing User Guide* and search for "ttl".

> Source: [Choosing between alias and non-alias records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html)