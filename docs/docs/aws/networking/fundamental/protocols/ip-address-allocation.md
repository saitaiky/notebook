---
title: IP Address Allocation
---

## Network segmentation VS IP address allocation

> TL;DR - Network segmentation is a broader concept that encompasses the organization and separation of network traffic, while IP address allocation specifically deals with assigning IP addresses to devices within the segmented network.

Network segmentation and IP address allocation are two distinct concepts, although they are related in the context of network design and management.

Network Segmentation:
Network segmentation refers to dividing a network into smaller subnets or segments for various purposes, such as security, performance, and management. It involves creating logical boundaries within a network to isolate different types of network traffic, enforce security controls, and enhance overall network efficiency. Network segmentation can be achieved through techniques like VLANs, subnetting, or physical separation.

IP Address Allocation:
IP address allocation, on the other hand, is the process of assigning IP addresses to devices within a network. It involves the distribution of IP addresses from a designated address space to individual hosts, subnets, or networks. IP address allocation can be done manually or dynamically using protocols like DHCP (Dynamic Host Configuration Protocol).

While network segmentation can influence IP address allocation by dividing a network into smaller segments or subnets, network segmentation is not solely concerned with IP address allocation. It focuses on creating logical boundaries and organizing network traffic, whereas IP address allocation specifically addresses the assignment and management of IP addresses.

:::infoHow does IPv6 solve the problem of IPv4 address exhaustion?
IPv6 uses 128-bit addresses as opposed to the 32-bit addresses used by IPv4, allowing for a substantially larger number of possible addresses. With each bit corresponding to a ‘0’ or ‘1’, this theoretically allows 2^128 combinations or 340 trillion, trillion, trillion addresses. By contrast, IPv4 permits 2^32 combinations for a maximum of approximately 4.3 billion addresses.
:::

## Strategies to allocate IPs

When it comes to allocating IP address space, there are several strategies and techniques that can be used based on the specific requirements and goals of an organization. Here are some common strategies:

- Classful Addressing:
   - Classful addressing was the original IP addressing scheme that divided IP address space into three classes: Class A, Class B, and Class C. Each class had a fixed range of IP addresses, with Class A providing a large number of addresses and Class C offering a smaller range. However, classful addressing is no longer widely used due to its inefficient allocation of IP addresses.
- Classless Inter-Domain Routing (CIDR):
   - CIDR introduced a more flexible approach to IP address allocation by using variable-length subnet masks (VLSM). CIDR allows for subnetting IP address blocks with varying sizes, enabling more efficient utilization of IP address space. CIDR is the prevailing addressing scheme used on the internet today.
- Subnetting:
   - Subnetting is the process of dividing a network into smaller subnets. By subnetting, organizations can create smaller network segments that meet their specific requirements, such as departmental divisions, geographical locations, or security zones. Subnetting helps optimize IP address utilization and provides logical separation of network traffic.
- Variable-Length Subnet Masking (VLSM):
   - VLSM is a technique used in CIDR to allocate different subnet mask lengths to different subnets within an IP address range. VLSM allows for more granular subnetting, enabling organizations to allocate larger subnets to networks that require more hosts and smaller subnets to networks with fewer hosts. This results in efficient use of IP address space.
- Private IP Addressing:
   - Private IP addressing utilizes IP address ranges reserved for internal networks, as defined by RFC 1918. Private IP addresses can be used within an organization's internal network and are not routable over the internet. This conserves public IP address space and allows for secure and private communication within the organization.
- Network Address Translation (NAT):
   - NAT is a technique used to translate private IP addresses to public IP addresses and vice versa. NAT allows multiple devices within a private network to share a single public IP address, enabling more efficient use of public IP address space.
- IPv6 Adoption:
   - IPv6 is the next generation of IP addressing that provides a significantly larger address space compared to IPv4. IPv6 adoption allows for the allocation of a vast number of unique IP addresses, mitigating the concerns of address exhaustion faced by IPv4. Transitioning to IPv6 can help ensure ample IP address space for future growth.

These strategies and techniques can be used individually or in combination to allocate IP address space efficiently, based on the specific needs of an organization. It's important to plan IP address allocation carefully to avoid address conflicts, optimize resource utilization, and accommodate future scalability.

## In-depth explanation on Classful and CIDR

There are two strategies the RIRs(Regional Internet Registries) use to allocate IP address space: the legacy strategy called Classful addressing, and the current strategy of Classless addressing (known as Classless Inter-Domain Routing, or CIDR).

### Classful
Classful addressing is how the early Internet was formed. IP assignments were given on the Octet boundaries:

The idea behind Classful address assignments was, if you were a company that …
![classful-diagram](/img/aws/networking/fundamental/ip-address-classes.png)

- … needed 200 IP addresses, a /24 IP address block from the Class C range would be assigned.
- … needed 50,000 IP addresses, a /16 IP address block from the Class B range would be assigned.
- … needed over 65,000~ IP addresses, a /8 IP address block from the Class A range would be assigned.
However, this led to a lot of wasted IP addresses. If, for instance, you only needed 300 IP addresses, a Class C would not suffice, so you would end up with a Class B and nearly 60,000 IP addresses would be wasted.

You could argue, why not simply assign two /24 blocks from the Class C range (providing 512 IP addresses)? Good point, and this frequently was done. But what if you needed 25,000 IP addresses? That would require 98 different /24 blocks from the Class C range. Instead, a single Class B was assigned — which still meant about 40,000 IP addresses were wasted.

### CIDR
With **Classless Inter-Domain Routing (CIDR)**, IP assignments are not limited to the three classes. The whole unicast range (any IP address with a first octet of 0 – 223) can be allocated in any size block. In effect, the whole concept of IP address classes is done away with entirely.

#### Example 1
![CDIR-1](/img/aws/networking/fundamental/CIDR.png)

CIDR consists of two group of bits, first group (most significant bits) represents the network prefix and second group (least significant bits) forms host identifier. In image[1], first 28 bit represents a subnet and last 4 digit represents hosts. Since it has only 4 bits to form host identifier, At max it can have 2⁴ = 16 hosts.

#### Example 2
![CDIR-2](/img/aws/networking/fundamental/CIDR2.png)
Image[2] has subnet mask of 32, which means all bits will be fixed. It represents a cider block with single IP.


#### Example 3
![CDIR-3](/img/aws/networking/fundamental/CIDR3.png)
Image[3], represents a CIDR block with 24 subnet mask. Bits which are grayed in above image can only be changed. Maximum hosts will be 2⁸ = 256 and range will be from 10.88.135.1 to 10.88.135.254. Here two IP’s are reserved 10.88.135.0 and 10.88.135.255 for network use.


#### Example 4
![CDIR-4](/img/aws/networking/fundamental/CIDR4.png)
Image[4], Fourth octet will have range from 0 to 255. In third octet, only 4 bits can changed, so it will form total of **2⁴ = 16 hosts**. Third octet will have multiple ranges of **16 hosts**. It will be like 0 to 15, 16 to 31 and so on till 255. 

0-15, 16-31, 32-47, 48-63, 64-79, 80-95, 96-111, 112-127, 128-143, 144-159... etc 

In CIDR block third octet has a value of **135**, which fall between **128 to 143**. So the IP range of above CIDR will be from 10.88.128.1 to 10.88.143.254. As mentioned in previous paragraph two IP’s are reserved.

#### Example 5
![CDIR-5](/img/aws/networking/fundamental/CIDR5.png)
Image[5], It also has subnet mask 20 and third octet has value 90, which falls in range of 80 to 95. So IP range will be from 10.88.80.1 to 10.88.95.254.

