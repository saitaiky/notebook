---
title: CAP Theorem
description: 'A precise, practical explanation of consistency and availability during network partitions, including quorum behaviour and system-design decisions.'
keywords:
  - cap theorem
  - linearizability
  - availability
  - network partition
  - distributed systems
  - quorum
---

CAP describes a narrow but important distributed-systems trade-off: **while a network partition prevents some nodes from
communicating, a system cannot guarantee both linearizable consistency and a successful response from every non-failing
node**.

It is not a general instruction to "choose two of three." Outside a partition, a system can provide both consistency and
availability. During a partition, the design must decide which operations can continue and which must reject, block, or
return weaker results.

## Define the terms precisely

| Property | Meaning in CAP |
| --- | --- |
| Consistency | Operations appear to occur in one real-time order; after a completed write, a later read observes that write. This is commonly described as linearizability. |
| Availability | Every request received by a non-failing node eventually receives a non-error response, even if that response contains older data. |
| Partition | Messages between groups of nodes are delayed or lost long enough that the groups cannot coordinate. |

These definitions are stronger and more specific than everyday uses of "consistent" and "available." A quick error
response does not satisfy CAP availability, and eventual consistency is not CAP consistency.

## What CP and AP mean during a partition

Assume five replicas use a majority quorum and the network separates them into groups of three and two.

### Consistency-first behaviour

The majority side can continue if it can prove that it owns the current term or lease. The minority side rejects or
blocks operations that could conflict. The whole system does not necessarily stop; quorum prevents two sides from both
committing incompatible histories.

This is appropriate when returning or accepting conflicting state would violate an invariant, such as allocating the
same unique resource twice.

### Availability-first behaviour

Both sides may continue accepting operations, then reconcile after communication recovers. The application needs an
explicit conflict model: last-write-wins, mergeable data types, domain reconciliation, or compensating action. "We will
fix it later" is not a conflict strategy.

This is appropriate when continued local progress matters more than immediately presenting one global order.

## Reads are part of the trade-off

Reads are not automatically safe during a partition. A linearizable read may need a quorum, a valid leader lease, or
another coordination mechanism. A node that cannot prove its state is current must reject or delay that read to preserve
the guarantee. A stale or eventually consistent read can often remain available.

## Products are not permanently CP or AP

Avoid classifying a database with one CAP label. Behaviour can change with:

- read and write consistency settings;
- quorum size and replica topology;
- leader election and failure detection;
- operation type;
- region and network design;
- conflict resolution and retry policy.

For example, a service can offer strongly consistent reads for one request and eventually consistent reads for another.
Document the guarantee of the operation and configuration you actually use.

## Architecture decision

Ask these questions in order:

1. Which business invariants must never be violated?
2. Which operations may return stale data?
3. During loss of coordination, which side is allowed to accept writes?
4. How will callers distinguish rejection, timeout, and accepted-but-not-yet-reconciled work?
5. How are retries made idempotent?
6. How are conflicts detected and resolved after recovery?
7. What latency trade-offs exist even when there is no partition?

CAP alone does not select a database. Normal operation is often dominated by latency, durability, transaction semantics,
cost, and operational ownership. PACELC is a useful reminder: if there is a partition, consider availability versus
consistency; else, consider latency versus consistency.

## Worked example: inventory reservation

If overselling a unique item is unacceptable, the reservation operation should run only where the system can enforce the
inventory invariant. During a partition, some callers will receive a retryable failure rather than a false success.

If the business accepts provisional orders and later compensation, more partitions may accept work. The architecture must
then expose provisional status and implement reconciliation, customer communication, and refund behaviour. The decision
is a business contract implemented by distributed-systems mechanics.

Continue with [replication](/software-development/system-design/data/horizontal-scaling/replication/),
[queue delivery semantics](/software-development/system-design/sync-async/queue/overview/), and
[AWS databases](/aws/database/).

## References

- [Gilbert and Lynch, Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://www.cs.princeton.edu/courses/archive/spring24/cos418/papers/cap.pdf)
- [Gilbert and Lynch, Perspectives on the CAP Theorem](https://groups.csail.mit.edu/tds/papers/Gilbert/Brewer2.pdf)
