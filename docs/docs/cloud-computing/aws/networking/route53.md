---
title: Route 53
description: Route 53
keywords:
  - Route 53
sidebar_position: 2
---

## Alias record 

You can create* **an alias record** at the top node* of a DNS namespace, also known as the zone apex, however, you *cannot create **a CNAME record** for the top node* of the DNS namespace. 
- So, if you register the DNS name covid19survey.com, the zone apex(an alias record)is covid19survey.com. 
- You can't create a CNAME record for covid19survey.com, but you can create an alias record for covid19survey.com that routes traffic to www.covid19survey.com.
