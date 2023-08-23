---
title: Disaster Recovery
---


Recovery time objective (RTO) – The time it takes a system to return to a working state after a disaster. In other words, RTO measures downtime.

Recovery point objective (RPO) – The amount of data that can be lost (measured in time). For an Aurora global database, RPO is typically measured in seconds.


## High availability & Fault Tolerance

The both want to have the ability of a system to remain in operation even if some of the its components fail. The difference between them is...

- **High availability**: There should be **at least one** running instances/servers in the event of component failures
- **Fault Tolerance**: The number of running instances/servers should not fail below a **specific minimum number** of instances


