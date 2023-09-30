---
title: Route 53
description: Route 53
keywords:
  - Route 53
sidebar_position: 2
---

Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service. Amazon Route 53 effectively connects user requests to infrastructure running in AWS – such as Amazon EC2 instances – and can also be used to route users to infrastructure outside of AWS. 

## Routing policies

1. **Simple Routing**: Distributes traffic across multiple resources, such as EC2 instances, in a round-robin manner.

2. **Weighted Routing**: Allows you to assign different weights to resources, directing a proportion of traffic based on those weights.

3. **Latency-Based Routing**: Routes traffic to the resource with the lowest latency for a user's geographic location. (If your application is hosted in multiple AWS Regions, you can **improve performance** for your users by serving their requests from the AWS Region that provides the lowest latency.)

4. **Failover Routing**: Routes traffic to a standby resource in case the primary resource becomes unhealthy.

5. **Geolocation Routing**: Directs traffic based on the geographic location of the user, helping **tailor content** for different regions.

6. **Geoproximity Routing**: Routes traffic based on the geographic location of the user, with the ability to define **bias**(optionally choose to route more traffic or less to a given resource by specifying a value) towards specific resources. It allows you to **shift traffic** from resources in one location to resources in another.

7. **Multivalue Answer Routing**: Returns multiple healthy records in response to DNS queries, offering a simple form of load balancing.

8. **Traffic Flow**: Allows you to create advanced routing policies using a visual editor to define complex routing logic.

9. **Private DNS for Amazon VPC**: Routes traffic between resources within a Virtual Private Cloud (VPC) using custom DNS names.

10. **Hybrid Routing**: Combines the use of on-premises DNS servers with Route 53 for a hybrid architecture.

## Private hosted zones

> Usage: You want to set up a custom domain for internal usage **within an Amazon VPC**. In contact, A public hosted zone determines **how traffic is routed on the internet**.

A private hosted zone is a container for records for a domain that you host in one or more VPCs. You create a hosted zone for a domain (such as internaldomainexample.com), and then you create records to tell Amazon Route 53 how you want traffic *to be routed for that domain within and among your VPCs*.

:::cautionA record or CName for creating a custom domain to connect to a database with a custom domain in a Route53 private hosted zone?

You should use **A record** directly to point the traffic to db.yourMainDomain.com instead of using **CNAME**, because it will cost an extra DNS lookup instead of routing to the DB IP address directly. 

![private-hosted-zone](/img/aws/networking/route53/private-hosted-zone.jpg)
Credit: tutorialsdojo.com

The full steps of how private hosted zones work:
1. You create a private hosted zone, such as example.com, and specify the VPCs that you want to associate with the hosted zone.
2. You create records in the hosted zone that determine how Route 53 responds to DNS queries for your domain and subdomains within and among your VPCs. For example, suppose you have a database server that runs on an EC2 instance in one of the VPCs that you associated with your private hosted zone. You create an A or AAAA record, such as db.example.com, and you specify the IP address of the database server.
3. When an application submits a DNS query for db.example.com, Route 53 returns the corresponding IP address. The application must also be running on an EC2 instance in one of the VPCs that you associated with the example.com private hosted zone.
4. The application uses the IP address that it got from Route 53 to establish a connection with the database server.
:::

### enableDnsHostnames and enableDnsSupport

For each VPC that you want to associate with the Route 53 hosted zone, change the following VPC settings to true:
- `enableDnsHostnames` - Indicates whether instances launched in the VPC receive public DNS hostnames that correspond to their public IP addresses.
  - For non-default VPCs that aren't created using the Amazon VPC wizard, this option is turned off by default.
  - To use a private hosted zone, this option must be turned on. If you create a private hosted zone for a domain and create records without turning on DNS hostnames, private hosted zones aren't turned on.
- `enableDnsSupport` - Indicates whether the DNS resolution is supported for the VPC. 
  - Private hosted zones accept DNS queries only from a [VPC DNS server](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_DHCP_Options.html#AmazonDNS). The IP address of the VPC DNS server is the reserved IP address at the base of the VPC IPv4 network range plus two. Turning on DNS resolution allows you to use the VPC DNS server as a resolver for performing DNS resolution.
  - Keep this option turned off if you're using **a custom DNS server in the DHCP options set and you're not using a private hosted zone**.
  - This option and DNS hostnames must be turned on to resolve endpoint domains to private IP addresses for AWS Managed Services. Examples of these services include AWS PrivateLink and Amazon Relational Database Service (Amazon RDS).

![AWS-VPC-Settings-DNS](/img/aws/networking/route53/AWS-VPC-Settings-DNS.png)

- By default, both attributes are set to `true` in a default VPC or a VPC created by the VPC wizard. 
- By default, only the `enableDnsSupport` attribute is set to `true` in a VPC created on the Your VPCs page of the VPC console or using the AWS CLI, API, or an AWS SDK.

If both attributes are set to `true`, the following occurs:
- Your instance receives a public DNS hostname.
- The Amazon-provided DNS server can resolve Amazon-provided private DNS hostnames.

If either or both of the attributes is set to `false`, the following occurs:
- Your instance does not receive a public DNS hostname that can be viewed in the Amazon EC2 console or described by a command line tool or AWS SDK.
- The Amazon-provided DNS server cannot resolve Amazon-provided private DNS hostnames.
- Your instance receives a custom private DNS hostname if you've specified a custom domain name in your [DHCP options set](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_DHCP_Options.html). If you are not using the Amazon-provided DNS server, your custom domain name servers must resolve the hostname as appropriate.

## Alias record 

Amazon Route 53 alias records provide a Route 53–specific extension to DNS functionality. Alias records let you **route traffic to selected AWS resources, such as CloudFront distributions and Amazon S3 buckets**. They also let you route traffic from one record in a hosted zone to another record.

:::caution Only alias record can record top node of DNS namespace. CNAME can't
Unlike a **CNAME record**, you can create **an alias record** at the top node of a DNS namespace, also known as the zone apex. For example, if you register the DNS name example.com, the zone apex is example.com. 

You can't create a **CNAME record** for example.com, but you can create **an alias record** for example.com that routes traffic to www.example.com (as long as www.example.com doesn't already have a CNAME record).
:::

When Route 53 receives a DNS query for an alias record, Route 53 responds with the applicable value for that resource(You can't create alias records for EC2):

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

## Route 53 health check

> With Route53 Healthchecks, you can check the status of your endpoints and resources at specified intervals and receive notifications when something goes wrong.

![health-check](/img/aws/networking/route53/health-check.png)

- **Health checks that monitor an endpoint** – You can configure a health check that monitors an endpoint that you specify either by IP address or by domain name. At regular intervals that you specify, Route 53 submits automated requests over the internet to your application, server, or other resources to verify that it’s reachable, available, and functional. Optionally, you can configure the health check to make requests similar to those that your users make, such as requesting a web page from a specific URL.
- **Health checks that monitor other health checks (calculated health checks)** – You can create a health check that monitors whether Route 53 considers other health checks healthy or unhealthy. 
  - One situation where this might be useful is when you have multiple resources that perform the same function, such as multiple web servers, and your chief concern is **whether some minimum number of your resources are healthy**. You can *create a health check for each resource without configuring notifications for those health checks*. Then you can create a health check that monitors the status of the other health checks, and that notifies you only when the number of available web resources drops below a specified threshold.
- **Health checks that monitor CloudWatch alarms** – You can create CloudWatch alarms that monitor the status of CloudWatch metrics, such as the number of throttled read events for an Amazon DynamoDB database or the number of Elastic Load Balancing hosts that are considered healthy. After you create an alarm, you can create a health check that monitors the same data stream that CloudWatch monitors for the alarm.

### Evaluate Target Health

> Note: This option is only available when you create **an alias record** to route traffic to other AWS services.

If you set the target of a record as ALB with a true “Evaluate Target Health” flag on Route 53. Route 53 will check both ALB entry to ensure that your ALBs are responding. Route 53 will then decide to which ALB it will direct the user. If one region goes down, Route 53 will know it via the “Evaluate Target Health” setting and will not redirect users to that region’s ALB.

### Same name, type, routing policy

If you configure health checking for all the records in a group of records that have the same name, the same type (such as A or AAAA), and the same routing policy (such as weighted or failover), Route 53 responds to DNS queries by choosing a healthy record and returning the applicable value from that record.

For example, suppose you create three weighted A records, and you assign health checks to all three. If the health check for one of the records is unhealthy, Route 53 responds to DNS queries with the IP addresses in one of the other two records.

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