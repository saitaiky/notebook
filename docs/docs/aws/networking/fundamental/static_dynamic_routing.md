---
title: Static and Dynamic routing
---

I Found the below video is so handy to understand the concept of Static and Dynamic routing and how they work with Cloud Computing. (I wish AWS can have similar videos like this )

<iframe width="560" height="315" src="https://www.youtube.com/embed/K_xb_j46YOk?si=CHUZWC_XwuDcvBKu" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

## Static routing

Static routes mean the routing table is created, maintained, and updated by you — manually. That means a static route from one resource to another needs to be configured on every router for full connectivity. While this sounds tedious (which it can be) this gives you granular control and is completely manageable on smaller networks. It’s ideal for doing simple routing tasks, like network segmentation. 

### Limitation

Static routes have limitations when it comes to fault tolerance and adaptability in network configurations. They lack the ability to automatically adjust to changes, making manual intervention necessary for updates. In more dynamic cloud environments, where network changes are frequent, relying solely on static routes can be cumbersome and disruptive, especially in scenarios involving multiple networks and VPN configurations.

### Solution

Dynamic routing, introduced in the late 1980s, offers relief in evolving and complex networks. Unlike static routing, dynamic routers exchange route information, enabling intelligent path selection for data. This involves maintaining a dynamic routing table using protocols like BGP, allowing routers to adapt to changes, similar to how Google Maps reroutes based on real-time conditions.

## Border Gateway Protocol

[Border Gateway Protocol](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/) (BGP) is a dynamic network protocol that uses predetermined standards to facilitate communication between network devices. BGP has been likened to a country's postal system --- both seek the fastest among multiple routes to deliver data between a sender and recipient(s).

### How does the Border Gateway Protocol work?

Border Gateway Protocol (BGP) works using a mechanism called *peering*. Administrators assign certain routers as BGP peer or BGP speaker routers. You can think of peers as devices on the edge or boundary of an autonomous system.

BGP peers perform the following main functions.

#### Route discovery

BGP peers exchange routing information with neighboring BGP peers through network-layer reachability information (NLRI) and path attributes. NLRI includes connectivity information about neighbors. Path attributes include information like latency, hop count, and cost of transmission.

After they exchange information, each BGP peer can then construct a graph of network connections around it.

#### Route storage

During the discovery process, every BGP router collects route advertisement information and stores it in the form of routing tables. It uses the routing table for path selection and also updates it frequently.

For instance, the BGP router receives *keep-alive* messages every 30 seconds from neighboring routers. It updates the stored routes accordingly.

#### Path selection

BGP routers use the stored information to route traffic optimally. The primary factor in path selection is the shortest path, as determined by the stored route graphs. When a destination is reachable from multiple paths, BGP selects the best one by sequentially evaluating other path attributes.

### What are the types of Border Gateway Protocol?

Border Gateway Protocol (BGP) is classified as internal and external, depending on where the data is being routed.

External BGP routers connect an autonomous system to the global internet. However, large autonomous systems are themselves made up of smaller autonomous systems within them. Internal BGP routes data within a system.

For more: check [What are the types of Border Gateway Protocol?](https://aws.amazon.com/what-is/border-gateway-protocol/)