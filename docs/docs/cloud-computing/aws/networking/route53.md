---
title: Route 53
description: Route 53
keywords:
  - Route 53
sidebar_position: 2
---

Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. Amazon Route 53 effectively connects user requests to infrastructure running in AWS – such as Amazon EC2 instances – and can also be used to route users to infrastructure outside of AWS. 


## Private hosted zones

> Usage: You want to set up a custom domain for internal usage such as internaldomainexample.com

A private hosted zone is a container for records for a domain that you host in one or more VPCs. You create a hosted zone for a domain (such as internaldomainexample.com), and then you create records to tell Amazon Route 53 how you want traffic *to be routed for that domain within and among your VPCs*.

For each VPC that you want to associate with the Route 53 hosted zone, change the following VPC settings to true:

- enableDnsHostnames
- enableDnsSupport


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



## Route53 resolver

> Offical document: [Amazon Route 53 Resolver](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-getting-started.html)

By default, Route 53 Resolver automatically answers DNS queries for local VPC domain names for EC2 instances. You can integrate DNS resolution between Resolver and DNS resolvers on your on-premises network by configuring forwarding rules.

:::info 
DNS resolution between AWS VPC and on-premises network can be configured over a **Direct Connect** or ****VPN connection**
:::

:::caution
- On-premises instances cannot resolve Route 53 DNS entries 
- Route 53 cannot resolve on-premises DNS entries
- Route 53 Resolver is a regional service, so objects that you create in one AWS Region are available only in that Region. To use the same rule in more than one Region, you must create the rule in each Region.
:::


### Integrate DNS resolution for hybrid networks

Imagine there are 2 requirements that we need to achieve:
- resolve DNS queries for any resources in the on-premises network from the AWS VPC
- resolve any DNS queries for resources in the AWS VPC from the on-premises network

In order to do so, you need to
- create **an inbound endpoint** on Route 53 Resolver and then DNS resolvers on the on-premises network can forward DNS queries to Route 53 Resolver via this endpoint
  ![Resolver-inbound-endpoint](/img/aws/networking/route53/Resolver-inbound-endpoint.png)
- create **an outbound endpoint** on Route 53 Resolver and then Rorute 53 Resolver can conditionally forward queries to resolvers on the on-premises network via this endpoint
  ![Resolver-outbound-endpoint](/img/aws/networking/route53/Resolver-outbound-endpoint.png)

Source: [AWS Route 53 Resolver – Hybrid DNS](https://jayendrapatil.com/aws-route-53-resolver/)

### Architecture diagram for hybrid networks

**Example 1**
- Amazon Route 53 private hosted zone
- Amazon Route 53 Resolver
- Amazon VPC
- AWS VPN or Direct Connect

![target-architecture](/img/aws/networking/route53/target-architecture.png)

Source: [Set up integrated DNS resolution for hybrid networks in Amazon Route 53](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/set-up-integrated-dns-resolution-for-hybrid-networks-in-amazon-route-53.html)


**Example 2**
![dns-resolvers](/img/aws/networking/route53/dns-resolvers-0.svg)

Source: [DNS Resolvers](https://support.stax.io/hc/en-us/articles/4452175759119-DNS-Resolvers)