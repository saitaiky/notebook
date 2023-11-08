---
title: The current problem
---


### Impossible Triangle

> The impossible triangle is a well-known dilemma of Blockchain

As blockchain technology continues to develop and gain more users, people are also discovering its limitations, leading to the concept of the "Impossible Triangle" of blockchain. This theory suggests that it is impossible to simultaneously achieve decentralization, security, and efficiency on a blockchain. In an attempt to overcome this impossibility, various solutions have been proposed to address these three objectives.

![scalability-trilemma](/img/crypto/news/scalability-trilemma.png)

Some have chosen to start with the most fundamental architectural elements, including public and private keys, blocks, consensus mechanisms, and more. These are referred to as Layer 1, representing the foundational protocols of the blockchain. The proposed solutions, often called **Layer 1 scaling solutions**, are primarily focused on enhancing transaction speed through improvements to the chain's structure, block architecture, and block size, among other factors.

Alternatively, some prefer not to modify the blockchain itself but opt to add protocols off-chain to increase transaction speed on-chain. These off-chain solutions and protocols, situated on Layer 2, provide benefits such as faster transaction processing without altering the blockchain. However, **Layer 2 solutions** are not responsible for validation, and the final data must still be transmitted back to Layer 1, posing challenges related to data security and speed during the transfer process.

One well-known Layer 2 scaling solution is "sidechains," originally introduced to expedite Bitcoin transactions. Sidechains involve moving transactions from the main chain to a separate sidechain for confirmation and broadcasting the results back to the main chain when settlement is required.

## The solutions..?

Ethereum faces scalability challenges with its limited transaction capacity of 15 transactions/second, causing congestion and high costs. Sidechains and layer 2 solutions offer scalability by moving certain transactions "off-chain." These solutions maintain decentralization while enabling faster transaction processing. 

Traditional on-chain scaling may compromise decentralization. Sidechains and layer 2 solutions allow continuous, incremental innovation without extensive governance overhead, benefiting Ethereum's performance, security, and decentralization.

- Layer-1 refers to a main blockchain, while Layer-2 refers to the network that sits on top of a main blockchain.
- Layer-2 solutions intend to **solve the issue of scalability** by processing transactions off the mainnet.
- The advantages of a Layer-2 solution include increased **transactions per second (tps), reduced gas fees, maintained security, and application-specific networks**.

### Layer 2 blockchains

> TL;DR - Layer 2 blockchains are **Off-chain** solutions which means taking off workload from Layer 1(the main chain). 

:::infoSome Layer 2 scaling solutions include channels, plasma, and rollups.
You may heard of some of these layer 2 scaling solutions, for example, `channels`, `plasma`, and `rollups`. For the detailed explaination, please refer to [Chainlink: What Is Layer 2?](https://chain.link/education-hub/what-is-layer-2#:~:text=A%20layer%202%20refers%20to,such%20as%20higher%20transaction%20throughputs.) 
:::

Layer 2 refers to a secondary framework or protocol that is built on top of an existing blockchain system. The main goal of these protocols is to solve the transaction speed and scaling difficulties that are being faced by the major cryptocurrency networks. 

For instance, [Bitcoin](https://academy.binance.com/en/glossary/bitcoin) and [Ethereum](https://academy.binance.com/en/articles/what-is-ethereum) are still not able to process thousands of [transactions per second (TPS)](https://academy.binance.com/en/glossary/transactions-per-second), and this is certainly detrimental to their long-term growth. There is a need for higher throughput before these networks can be effectively adopted and used on a wider scale.

In this context, the term "layer 2" refers to the multiple solutions being proposed to the blockchain scalability problem. Two major examples of layer 2 solutions are the [Bitcoin Lightning Network](https://academy.binance.com/en/articles/what-is-lightning-network) and the [Ethereum Plasma](https://academy.binance.com/en/articles/what-is-ethereum-plasma). Despite having their own working mechanisms and particularities, both solutions are striving to provide increased throughput to blockchain systems.

In a broader sense, layer 2 protocols create a secondary framework, where blockchain transactions and processes can take place independently of the layer 1 (main chain). For this reason, these techniques may also be referred to as "[off-chain](https://academy.binance.com/en/glossary/off-chain)" scaling solutions.

One of the main advantages of using off-chain solutions is that the main chain doesn't need to go through any structural change because the second layer is added as an extra layer. As such, layer 2 solutions have the potential to achieve high throughput without sacrificing network security.

In other words, a great portion of the work that would be performed by the main chain can be moved to the second layer. So while the main chain (layer 1) provides security, the second layer offers high throughput, being able to perform hundreds, or even thousands, of transactions per second.


### SideChain

:::infoHow sidechain works behind the sense
Sidechains on Ethereum deploy smart contracts responsible for depositing and withdrawing functions. The Ethereum or other tokens users deposit on the Layer 1 contract get locked. Upon receiving the confirmation message on the sidechain, validators of the side chain have the authority to mint corresponding cryptocurrencies on the sidechain. Users can engage in numerous transactions with other users on the sidechain's system. 

When users finish their transactions and wish to withdraw their balances on Layer 1, the sidechain validators report the latest balance status back to Ethereum, enabling users to withdraw based on their balances. Additionally, the sidechain validators synchronize the destruction of the corresponding cryptocurrencies on the sidechain.
:::

:::cautionIs sidechain a layer 2 solution?
One core requirement for a network, system, or technology to be considered a layer 2 is that it **inherits the security of the blockchain it is built on top of**. Transaction data must, in some shape or form, be verified and confirmed by the underlying blockchain network rather than a separate set of nodes. For example, sidechains are often not considered layer 2s because they usually deploy their own consensus mechanisms and validators, leading to a different set of security guarantees than that of the base layer chain.
:::

A sidechain in the Ethereum blockchain is a separate blockchain that operates in parallel with the main Ethereum chain but is interoperable with it. Sidechains are designed to address some of the limitations of the main Ethereum network, such as scalability and transaction speed. They allow developers to create and deploy smart contracts and decentralized applications (DApps) with specific use cases and requirements.

Sidechains typically have their consensus mechanisms, rules, and governance structures, which may differ from the main Ethereum network. They provide a way to offload certain transactions and computations from the main chain, reducing congestion and gas fees while still benefiting from the security of the Ethereum network.

![sidechain](/img/crypto/news/sidechain.webp)

Source: [CoinDesk: An Introduction to Sidechains](https://www.coindesk.com/learn/an-introduction-to-sidechains/)

Users can transfer assets or tokens between the main Ethereum chain and the sidechain, and smart contracts can be deployed on the sidechain to execute specific functions efficiently. Sidechains are often used for activities like gaming, non-fungible tokens (NFTs), and decentralized finance (DeFi) applications, where high transaction throughput and lower fees are crucial.

## Sidechains vs Layer 2 blockchains

> TL;DR - The main difference between sidechains and Ethereum layer 2 solutions is that while layer 2 inherits the security of the main network,  sidechains rely on their own security model. 

:::cautionCan a blockchain be both Layer 2 and sidechain?
Yes! A blockchain can simultaneously function as both a sidechain and a layer-2. A sidechain operates independently with its own consensus mechanism, while a layer-2 enhances Ethereum by increasing scalability and reducing gas fees. One of the example is **Polygon**, which serves as an example of a blockchain that combines these roles.

Reference:
- [Coinbase - Layer 2 networks and sidechains](https://help.coinbase.com/en/wallet/layer2-networks/layer2-networks-and-sidechains)
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/questions/125024/is-polygon-matic-a-layer-2-or-a-sidechain)
:::

Sidechains and Layer 2 blockchains tackle the common challenge of blockchain scalability, but they do so differently. Layer 2 blockchains are extensions of the Layer 1 blockchain, while sidechains operate as distinct, self-contained blockchains with separate consensus mechanisms and native tokens. *This means that Layer 2 blockchains depend on the security of the main chain, whereas sidechains have their security measures.*

Sidechains can also serve as an experimentation platform for developers, enabling them to implement new functionalities or features not present on the main blockchain. This could include enhancements like improved privacy, faster transaction speeds, or more intricate smart contracts.

### 51% atttack

Despite dramatically boosting transaction capacity, both solutions provide significant security tradeoffs in comparison with normal transactions.  The key difference between layer-2 and sidechain solutions lies in the differences in their security mechanisms. *While layer-2 generally relies on the security of the main chain, sidechains have their own security properties. *

- If you have coins inside a layer 2, then as long as the main chain keeps working you are guaranteed to be able to covert those coins into coins on the underlying main chain; even a 51% attack on the layer 2 cannot prevent you from converting. 
- In a sidechain, this is not the case; a 51% attack on the sidechain can steal the coins inside the sidechain.
