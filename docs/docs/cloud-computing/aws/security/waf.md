---
title: WAF
description: WAF
keywords:
  - WAF
sidebar_position: 4
---


AWS WAF is a web application firewall that lets you monitor the HTTP and HTTPS requests that are forwarded to...
- **an Amazon CloudFront distribution**
- **an Amazon API Gateway REST API**
- **an Application Load Balancer**
- **an AWS AppSync GraphQL API**

As new applications are developed, Firewall Manager makes it simple to bring them into compliance by imposing a common set of security rules. You only need to configure your firewall rules once. And the service will apply them to all of your accounts and resources.

Firewall Manager comes in handy whenever you want to safeguard your entire organization rather than just a few specific accounts and resources. It also offers centralized monitoring of DDoS attacks throughout your organization.

At the simplest level, AWS WAF lets you choose one of the following behaviors:

- Allow all requests except the ones that you specify – This is useful when you want Amazon CloudFront, Amazon API Gateway, Application Load Balancer, or AWS AppSync to serve content for a public website, but you also want to block requests from attackers.
- Block all requests except the ones that you specify – This is useful when you want to serve content for a restricted website whose users are readily identifiable by properties in web requests, such as the IP addresses that they use to browse to the website.
- Count the requests that match the properties that you specify – When you want to allow or block requests based on new properties in web requests, you first can configure AWS WAF to count the requests that match those properties without allowing or blocking those requests. This lets you confirm that you didn't accidentally configure AWS WAF to block all the traffic to your website. When you're confident that you specified the correct properties, you can change the behavior to allow or block requests.

## Usage

Using AWS Firewall Manager, you can centrally configure 
- AWS WAF rules
- AWS Shield Advanced protections
- Amazon Virtual Private Cloud (VPC) security groups
- AWS Network Firewalls
- Amazon Route 53 Resolver DNS Firewall rules

across accounts and resources in your organization.

:::caution
AWS Firewall Manager does not support Network ACLs today.
:::