---
title: Blockchain Oracles Explained
---

## Blockchain Oracles Explained: Why Do We Need Oracles?

> Reference: [Blockchain Oracles Explained: Why Do We Need Oracles?](https://www.gemini.com/cryptopedia/crypto-oracle-blockchain-overview#section-blockchain-oracles-providers-of-external-data)


![oracle](/img/crypto/oracle.png)

Oracles are computer programs that connect data from the outside world (off-chain) with the blockchain world (on-chain).

Most blockchains have native cryptocurrencies that are used to transfer value, enable the operations of the protocol, or facilitate governance. Some blockchains also enable smart contracts: computer programs that run within a blockchain protocol and execute a predetermined set of actions automatically when certain conditions are met in a traceable and irreversible manner. Smart contracts are executed without a third party, and can be designed to carry out almost any contract imaginable.

For example, if you were purchasing a house with cryptocurrency, a simple smart contract might be drafted for the sale. It would say something like “if person A sends the required funds to person B, then the deed for the house is transferred from person B to person A.” Once the conditions of the smart contract are met, it is irreversibly executed according to its coded programming. **There is no need to rely on traditional third parties to initiate or execute the contract.**

However, there needs to be a way for blockchains and on-chain smart contracts to make use of external, off-chain data in order for smart contracts to have any real-world applications. In the above example of a real estate transaction, off-chain data might be proof of successful payment, or proof of receipt of the deed. And as blockchains are self-contained systems, this is where oracles come into play.

## Blockchain Oracles: Providers of External Data
Oracles present a way for a blockchain or smart contract to interact with external data. They act like an application programming interface (API) to the world outside of blockchain. There are many cases where outside data needs to be communicated to the closed blockchain system — particularly when smart contracts are connected to real-world events. Crypto oracles **query, verify, and authenticate** external data and then relay it to the closed system. That authenticated data would then be used to validate a smart contract.


## Inbound Versus Outbound Oracles
Oracles establish a two-way line of communication with blockchains: data can be sent in, or transferred out. While outbound oracles can bring blockchain data to the outside world, it’s more common for inbound oracles to bring off-chain — or real-world data —  to the blockchain. The imported information can represent almost anything — from asset price fluctuations, to weather conditions, to proof of successful payments.

### Example of inbound oracle
A frequent programmable scenario for inbound oracles could be: “If an asset hits a certain price, then place a buy order.” As another example, imagine person A bets person B that it’s going to rain for one week straight. The bet amounts would be locked in a smart contract, an oracle would provide accurate and immutable weather data reporting, and the funds would be delivered to person A or person B — depending on if the data showed that it rained for one week straight.

### Example of outbound oracle
In contrast, outbound oracles inform the outside world of an event that took place on-chain. For example, a smart contract might be programmed to unlock an internet-enabled smart lock on a rental unit in the real world if a cryptocurrency payment is received at a specific crypto wallet address.

## Software Versus Hardware Oracles
Most crypto oracles process digital information, though this isn’t always the case. Software oracles deliver data from digital sources such as websites, servers, or databases, while hardware oracles deliver data from the real world. Software oracles can deliver real-time information such as exchange rates, price fluctuations, or flight information. Hardware oracles can deliver and relay information from camera motion sensors, radio frequency identification (RFID) sensors, thermometers, or barcode scanners.


## Centralized Versus Decentralized Oracles: Which is Better?

### Centralized Oracles
Centralized oracles act as a single entity that provides data from an external source to a smart contract operating with a set of security features. Such oracles are controlled by a single entity and the only provider of information for smart contracts. Since it works similarly to the traditional financial system where a single entity is responsible for everything, it suffers from a bottleneck problem, or we can say a single point of failure. 

These oracles have a simple architecture with lesser investment in terms of infrastructure and maintenance. Although they provide protection against game theory attacks, these are still prone to vulnerabilities to being corrupted and attacked.

### Decentralized Oracles
Decentralized oracles do not rely on a single source of truth; thereby, such oracles increase the authenticity of the information provided to smart contracts. Unlike centralized oracles, such oracles rely on multiple external sources and aim at achieving trustlessness. It utilizes the ShellingCoin mechanism, where all the independent sources report the data without coordinating with one another. But this mechanism is vulnerable to various problems like collusion between parties, signaling, and even bribing (各方勾結、發出信號，甚至行賄). 

Such oracles are considered to be ideal for businesses with multiple plans running at different times but require higher investment in infrastructure and maintenance.

### Concluding Lines 
Now to state which is better, remember that decentralized oracles are faster in operations, but they are insecure. Centralized oracles, on the other hand, are slower but secured. Thus from the above discussion, it is clear that decentralized oracles are a must for the DeFi ecosystem. But Blockchain developers and experts have to figure out the problems associated with oracles. The well-known ‘oracle problem’ ( trust conflict that centralized third-party systems bring to smart contracts) and lower latency rates are the major risks of running oracles on a blockchain.
