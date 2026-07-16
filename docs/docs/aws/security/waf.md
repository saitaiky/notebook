---
title: WAF
sidebar_position: 3
description: Web application firewall at layer 7 protecting CloudFront, API Gateway, ALB, and AppSync from attacks with custom rules and managed rule groups.
keywords:
  - aws
  - amazon web services
  - security
  - waf
  - waf aws
  - waf guide
  - security on aws
  - waf tutorial
---

AWS WAF is a web application firewall (**layer 7**) that lets you configure rules that allow, block, or monitor (count) web requests to below 4 services based on conditions that you define. 
- **an Amazon CloudFront distribution**
  - Your rules run in all AWS Edge Locations located around the world close to your end-users. This means security doesn’t come at the expense of performance. Blocked requests are stopped before they reach your web servers. 
- **an Amazon API Gateway REST API**
- **an Application Load Balancer**
  - When you use AWS WAF on Application Load Balancer, your rules run in the region and can be used to protect internet-facing as well as internal load balancers.
- **an AWS AppSync GraphQL API**

As new applications are developed, Firewall Manager makes it simple to bring them into compliance by imposing a common set of security rules. You can use AWS WAF to create custom rules that block common attack patterns, such as SQL injection or cross-site scripting, and rules that are designed for your specific application.

You only need to configure your firewall rules once and the service will apply them to all of your accounts and resources.

Firewall Manager comes in handy whenever you want to safeguard your **entire organization rather than just a few specific accounts and resources**. It also offers centralized monitoring of DDoS attacks throughout your organization.

### Behaviors

At the simplest level, AWS WAF lets you choose one of the following behaviors:

- **Allow all requests except the ones that you specify** – This is useful when you want Amazon CloudFront, Amazon API Gateway, Application Load Balancer, or AWS AppSync to serve content for a public website, but you also want to block requests from attackers.
- **Block all requests except the ones that you specify** – This is useful when you want to serve content for a restricted website whose users are readily identifiable by properties in web requests, such as the IP addresses that they use to browse to the website.
- **Count the requests that match the properties that you specify** – When you want to allow or block requests based on new properties in web requests, you first can configure AWS WAF to count the requests that match those properties without allowing or blocking those requests. This lets you confirm that you didn't accidentally configure AWS WAF to block all the traffic to your website. When you're confident that you specified the correct properties, you can change the behavior to allow or block requests.

## WAF vs Shield vs Shield Advanced

All three sit in front of your application to block bad traffic, but they operate at **different OSI layers** and protect against **different attack types**, which is exactly why exam questions pair them up as distractors:

- **AWS WAF** operates at **Layer 7 (application layer)**. It inspects the content of HTTP(S) requests to block things like SQL injection, cross-site scripting, and bad bots/known attacker IPs, using rules you (or a managed rule group) define.
- **AWS Shield Standard** is **automatically enabled for every AWS customer at no extra cost** and protects against the most common, most frequent **Layer 3/4 (network/transport layer)** DDoS attacks (e.g., SYN floods, UDP reflection).
- **AWS Shield Advanced** is a paid service that adds **enhanced detection and mitigation for larger/more sophisticated Layer 3/4 DDoS attacks**, near real-time visibility during an attack, integration with AWS WAF (to write emergency rules for free during an attack), 24/7 access to the AWS DDoS Response Team (DRT), and cost protection against scaling charges incurred during a DDoS event.

:::tip Exam trap: "DDoS" points to Shield, "application-layer attack pattern" points to WAF
If the scenario mentions **SQL injection, XSS, or a known bad bot/IP list** → think **WAF**. If it mentions **volumetric/DDoS attacks, SYN floods, or needing the DDoS Response Team** → think **Shield Advanced**. Comprehensive protection for internet-facing production applications typically combines **both**: Shield Advanced for the network-layer DDoS protection plus WAF for the application-layer rules, often centrally managed together through **Firewall Manager**.
:::
