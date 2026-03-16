---
title: SSH Tunneling vs VPN vs SSM
sidebar_position: 6
description: Secure access comparison of SSH tunneling via bastion, VPN connections, and SSM Session Manager port forwarding for private AWS resources.
keywords:
  - aws
  - amazon web services
  - networking
  - private access comparison
  - ssh tunneling vs vpn vs ssm aws
  - ssh tunneling vs vpn vs ssm guide
  - networking on aws
  - ssh tunneling vs tutorial
---

# Comparing Secure Access Methods for Private AWS Resources

When deploying resources like databases (RDS, Aurora) or internal applications within private subnets in your AWS VPC, a common challenge arises: how do developers, administrators, or services securely access these resources from outside the VPC? Exposing them directly to the internet is generally insecure. AWS offers several secure methods, and choosing the right one depends on your specific needs regarding security, cost, management overhead, and user experience.

Let's compare three common approaches:

1.  **SSH Tunneling via Bastion Host**
2.  **VPN (Client VPN / Site-to-Site)**
3.  **AWS Systems Manager (SSM) Session Manager Port Forwarding**

## 1. SSH Tunneling via Bastion Host

*   **How it works:**
    *   Deploy a dedicated EC2 instance (the "bastion" or "jump host") in a public subnet within your VPC.
    *   Configure the bastion's security group to allow SSH connections (port 22), ideally restricted to trusted IP addresses (like your office or specific developer IPs).
    *   Configure the security group of your private resource (e.g., RDS instance) to allow traffic (e.g., PostgreSQL port 5432) from the bastion host's private IP or security group.
    *   Users SSH into the bastion host. From their local machine, they use an SSH command to create a tunnel that forwards a local port (e.g., `localhost:5433`) through the bastion to the private resource's endpoint and port (e.g., `private-db-endpoint.region.rds.amazonaws.com:5432`).
    *   The user's local client (like DBeaver) connects to `localhost:5433`.

*   **Pros:**
    *   **Familiar:** A traditional and widely understood method for secure remote access.
    *   **Flexible:** Can tunnel various TCP-based protocols, not just database connections.
    *   **Standard Tooling:** Uses standard SSH clients available on most operating systems.

*   **Cons:**
    *   **Bastion Host Management:** Requires provisioning, patching, securing, monitoring, and paying for an additional EC2 instance.
    *   **Increased Attack Surface:** The bastion has a public IP and an open SSH port, making it a direct target. Requires careful security group configuration and potentially intrusion detection.
    *   **SSH Key Management:** Requires secure generation, distribution, rotation, and revocation of SSH keys for users.
    *   **Cost:** Incurs costs for the EC2 instance, its EBS volume, potentially an Elastic IP address, and data transfer.
    *   **User Setup:** Users need to manage SSH keys and correctly configure the tunnel command.

## 2. VPN (Client VPN / Site-to-Site)

*   **How it works:**
    *   **AWS Client VPN:** A managed service where users install a VPN client on their machines and connect to a Client VPN endpoint deployed in your VPC. Once connected, their machine effectively becomes part of the VPC network, allowing direct access to private resources (controlled by security groups and network ACLs).
    *   **AWS Site-to-Site VPN:** Connects your on-premises network (or another VPC) directly to your AWS VPC via an IPsec tunnel. Users on the connected network can access private resources in the VPC.
*   **Pros:**
    *   **Network-Level Access:** Provides broader network connectivity, not just port forwarding. Useful if users need access to multiple resources or protocols.
    *   **Centralized Management:** Access can often be managed via directory services (like Active Directory) integrated with Client VPN.
    *   **Security:** Encrypted tunnels provide secure communication. Client VPN offers features like multi-factor authentication (MFA).

*   **Cons:**
    *   **Cost:** Can be expensive, especially Client VPN which charges per endpoint-hour *and* per connection-hour. Site-to-Site VPN also has endpoint and data transfer costs.
    *   **Setup Complexity:** Configuring VPN endpoints, customer gateways, routing, and authentication can be complex.
    *   **Client Software:** Users need to install and configure VPN client software (for Client VPN).
    *   **Performance:** VPN performance can sometimes be a bottleneck depending on the connection and configuration.

## 3. AWS Systems Manager (SSM) Session Manager Port Forwarding

*   **How it works:**
    *   Leverages the AWS Systems Manager (SSM) agent, which runs on EC2 instances.
    *   Requires *an* EC2 instance within the VPC (can be in a private subnet) running the SSM agent and having appropriate IAM permissions (`AmazonSSMManagedInstanceCore` policy). This instance acts as a secure relay.
    *   The instance *does not* need a public IP or open inbound ports (like SSH). It communicates with the SSM service via outbound HTTPS (port 443), typically through a NAT Gateway or VPC Endpoints for SSM.
    *   Users on their local machine use the AWS CLI (v2) with the Session Manager plugin installed.
    *   They run an `aws ssm start-session` command specifying the relay instance ID, the target private resource's endpoint (`host`) and port, and a local port to forward.
    *   SSM establishes a secure tunnel through the AWS backbone to the SSM agent on the relay instance, which then forwards the traffic to the target private resource.
    *   The user's local client (like DBeaver) connects to `localhost:<localPort>`.

*   **Pros:**
    *   **Enhanced Security:** No open inbound ports required on any instance for access, significantly reducing the attack surface. No bastion host exposed to the internet.
    *   **No Bastion/VPN Endpoint Cost:** Eliminates the direct cost of a dedicated bastion EC2 instance or a managed VPN endpoint.
    *   **IAM Control:** Access is controlled entirely via IAM policies (`ssm:StartSession` permissions), allowing fine-grained control without managing SSH keys or VPN credentials. Can be easily integrated with existing IAM users/roles.
    *   **Auditing:** Sessions can be logged via CloudTrail, CloudWatch Logs, or S3, providing a clear audit trail of who accessed what and when.
    *   **Operational Simplicity:** Reduces the management overhead associated with patching/securing bastions or managing complex VPN configurations.

*   **Cons:**
    *   **Requires AWS Tooling:** Users need the AWS CLI v2 and the Session Manager plugin installed locally.
    *   **Requires SSM Agent:** Relies on having at least one managed EC2 instance in the VPC with the SSM agent and correct IAM permissions/network connectivity (though this instance can be very small and private).
    *   **Learning Curve:** Might be less familiar than SSH/VPN for some users initially.
    *   **Port Forwarding Specific:** Primarily designed for forwarding specific ports, less suitable for general network-level access compared to VPN.

## SSM Relay Instance vs. Bastion Host

With SSM, it still uses an EC2 instance as a `Relay`. So, how is it more cost-effective than a bastion?

1.  **Instance Size & Purpose:**
    *   **SSM Relay:** This instance's *only* job is to run the lightweight SSM agent and relay encrypted tunnel traffic. It doesn't handle user logins, run interactive shells, or potentially host other tools. Therefore, it can be a *very small and cheap* instance type, like `t3.nano`.
    *   **Bastion Host:** Bastions often need to handle multiple concurrent SSH sessions, potentially run monitoring agents, or host diagnostic tools. They are typically sized slightly larger (e.g., `t3.micro` or `t3.small`) to provide a reasonable user experience, incurring higher EC2 costs.
2.  **No Public/Elastic IP Cost:**
    *   **SSM Relay:** Resides in a *private* subnet. It does not need a public IP address or an Elastic IP address. This saves the cost associated with Elastic IPs (which incur charges if not associated with a running instance or if more than one is associated).
    *   **Bastion Host:** Requires a public IP address (usually an Elastic IP for stability) to be reachable from the internet, adding to the cost.
3.  **Reduced Management Overhead (Indirect Cost Saving):**
    *   **SSM Relay:** Because it has no open inbound ports and no public IP, the security management overhead is drastically lower. You primarily rely on AWS managing the SSM service security and use IAM for access control. Patching is handled via standard EC2 patching mechanisms (often automated).
    *   **Bastion Host:** Requires significant ongoing effort: hardening the OS, managing SSH keys, monitoring for intrusions, patching vulnerabilities promptly, managing security group rules meticulously. This operational effort translates to significant indirect costs (engineer time).
4.  **NAT Gateway/VPC Endpoints:** Both the SSM relay (in a private subnet) and potentially the bastion host might require outbound internet access (e.g., for patching). The SSM relay specifically needs connectivity to the SSM service endpoints. This is usually achieved via a NAT Gateway or VPC Endpoints. While these have costs, they are often shared resources needed by many instances in private subnets, not solely attributable to the access method itself. The bastion *adds* a direct public endpoint cost (its EIP) on top of any shared NAT/VPC Endpoint costs.

**Conclusion on Cost:** While the SSM approach isn't *zero* EC2 cost, it is generally **more cost-effective** than a dedicated bastion host due to the potential for using much smaller instance types, the elimination of Elastic IP costs, and, most significantly, the vastly reduced security and operational management overhead.

## Recommendation

For accessing specific private resources like databases or internal web services, **AWS Systems Manager Session Manager Port Forwarding** is often the **preferred modern approach**. It offers the best balance of high security (no open inbound ports, IAM control, auditing) and lower operational overhead/cost compared to bastion hosts.

*   Use **VPN** when broader network-level access is required for users or entire networks.
*   Use **Bastion Hosts** if you have specific requirements that SSM/VPN don't meet, or if your team has deep existing investments and expertise in managing them securely (though migrating to SSM is often beneficial).
