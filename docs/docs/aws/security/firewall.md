---
title: Firewall
description: Firewall
sidebar_position: 5
---

## Firewall manager

> TL;DR - AWS Firewall Manager is mainly used to simplify your **AWS WAF administration and maintenance tasks** across multiple accounts and resources

![firewall-manager](/img/aws/security/firewall-manager.png)

### Usage

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

### Change the administrator account

:::infoONly one account in an organization can be the default Firewall Manager administrator
Users can designate only one account in an organization as the default Firewall Manager administrator account. The default administrator account follows the principle of first in, last out.
:::

![WAF-admin](/img/aws/security/WAF-admin.png)

To change the default Firewall Manager administrator account to a different AWS account under the same organization, each administrator must first revoke their own account. Then, the current default administrator can revoke their own account, which also offboards the organization from Firewall Manager. (Revoking an account deletes all policies created by that account.)

To set a new default administrator, sign in with the AWS Organizations management account in Firewall Manager.

## AWS Network Firewall

AWS Network Firewall is a stateful, managed, network firewall, and intrusion detection and prevention service for your virtual private cloud (VPC). With Network Firewall, you can filter traffic at the perimeter of your VPC. This includes traffic going to and coming from an internet gateway, NAT gateway, or over VPN or AWS Direct Connect. Network Firewall uses Suricata — an open-source intrusion prevention system (IPS) for stateful inspection.

![Product-Page-Diagram_AWS-Network-Firewall](/img/aws/security/Product-Page-Diagram_AWS-Network-Firewall.png)

Source: [AWS Network Firewall](https://aws.amazon.com/network-firewall/)
