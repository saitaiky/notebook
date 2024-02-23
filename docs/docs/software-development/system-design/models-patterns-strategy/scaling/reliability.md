---
title: Strategies for reliability
sidebar_position: 9
---

A reliable system can *perform its function*, *tolerate errors,* and *prevent unauthorized access or abuse.* Most failures in distributed systems come from either:

- Hardware errors: Network outages, server failure, etc. These won't be fixed quickly, and are often called non-transient errors.
- Application errors: Bugs, failure to accommodate spikes in traffic, etc. These should resolve quickly and are also known as transient errors.

It should logically follow that beefing up system reliability will have implications for performance and cost in terms of complexity, engineering time, and money. 

:::cautionReliability implies availability,but availability doesn't imply reliability.
Reliability implies availability, but it's more than that. Building for reliability means added security, error-handling, disaster recovery, and countless other contingencies.

Why? Because things will fail. Whether due to network outages, hardware failure, a botched roll-out, or a malicious attack, any system with dependencies must include logic to deal with failures. 
:::

:::cautionReliability in an interview
When implementing reliability techniques in an interview scenario, it's helpful to:
- Refer back to the requirements you've defined upfront. This will help you focus on mitigating the most important / most likely risks.
- Assume failures will happen, and design your system to recover gracefully (in alignment with predefined requirements) from the very beginning.
- Include testing strategies and monitoring techniques to help you benchmark your system in terms of requirements, monitor its health, and make changes as needed. 
:::

## Retries - transient errors

> TL;DR - To handle transient failures by attempting the same operation more than once.

- Under a **simple retry** strategy, an application detecting a failure will immediately retry. This might work well if the failure detected is unusual and unlikely to repeat, but for common transient failures (e.g. network failures) repeat retries may overload the downstream system once the network issue is resolved. People who use **simple retry** usually implement some type of request limit to prevent overload.
- **Delayed retry** holds the retry back for a set amount of time allowing the system to recover. 
- Many engineers implement an **exponential backoff** strategy that systematically decreases the rate of re-transmission in search of an acceptable retry rate.
rce unavailability.

:::cautionTechniques & considerations
Retry buildup in high-traffic systems can lead to extremely high system load once the error is resolved. This is called the **thundering herd** problem, and it can cause even more problems than the transient error as your resource(s) struggle to cope with the request volume. A simple solution is to introduce **jitter**, or "randomness" to the delay intervals so that client requests don't synchronize.

From a UX perspective, keep in mind that in some cases it's better to fail fast and simply let users know. In this case, implement a low retry limit and alert users that they'll need to try again later.
:::


## Circuit Breakers - non-transient errors

> TL;DR - To prevent a flood of requests when a service is struggling and to allow it time to recover.

A circuit breaker is a pattern that detects failures and encloses the failure operation in a circuit. If the errors continue to occur and go beyond a threshold, the circuit breaker 'trips', and further calls to the operation are inhibited. After a predefined period, it allows a limited number of test requests to pass through to check if the underlying problem has been fixed.

**Use Cases:**
- Protecting a system from overload and giving downed services time to recover.
- Preventing a client from trying to perform an operation that is likely to fail.


## Circuit Breakers

- **Use Cases**: Avoiding overloading a failing service, managing repeated service outages, and protecting user experience from repeated failures.

## Saga

> TL;DR - To manage transactions across multiple microservices by ensuring that all associated steps either complete successfully or any partial changes are compensated for.

**Strategy Explanation:**
Saga is a sequence of local transactions, where each transaction updates data within a single service. If a transaction in a saga fails, compensating transactions are triggered to undo the changes made by the preceding transactions in the saga.

- **Use Cases**: Handling sequence of related operations across distributed systems that need to maintain consistent state.


