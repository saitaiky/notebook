

## Solidity

From Solidity ^0.6.8 SPDX license is introduced. So you need to use SPDX-License-Identifier in the code. Have a look at this: <https://forum.openzeppelin.com/t/solidity-0-6-8-introduces-spdx-license-identifiers/2859>

To use SPDX LIDs in your project’s source code,  just add a single line in the following format, tailored to your license(s) and the comment style for that file’s language.  For example in Solidity:
```
// SPDX-License-Identifier: MIT

pragma solidity ^0.7.5;
contract TestContract {
    // Some logic
}
```

You need to use license according to your project. Some other licenses are:`// SPDX-License-Identifier: GPL-3.0-or-later`

You can find list of licenses here: <https://spdx.org/licenses/>

:::info What is Software Package Data Exchange(SPDX)?
The right which granted by an application owner depends on which license the developer selects. Most projects use one of a few standard licenses, but they're not always clearly communicated. For example, a project may be released under "the GNU General Public License (GPL)." But which version? And can the recipient choose a later version if they wish? 

SPDX is intended to solve the confusion of above questions. Futher reading: [SPDX clears confusion around software licenses](https://opensource.com/article/18/1/spdx-and-licensing)
:::

## Libraries

- `Ethers` is a very it's a great library for interacting with the Ethereum blockchain.
- `Hardhat` is going to be our development environment. It's what's going to allow our project to compile contracts and to deploy contracts.
hardhat can also initialize our solidity contracts for us and get the project rolling so it can do a little bit of that boilerplate, 
- `Web3 model` in order to be connecting with our provider.
- `OpenZeppelin` is a library which actually contains the ERC-721 contracts already built to standard. So in this project, we're not going to be building out all of our NFT tokens from scratch. We're going to be leveraging this library, which is an excellent library and resource to use when building a Marketplace
- `ipfs-http-client` - IPFS is a decentralized way of hosting our NFT images and our files, the actual files we're going to be storing with IPFS. With IPFS client, we can actually run promises and use JavaScript to hook up to our IPFS so that when our users are actually tokenizing these NFT is they're going to be hosting it with IPFS


## ERC 721
ERC 721 is standard protocol of what we need in order to be compliant at an industry level of our NFT.

For the full explaination of why they have this compliant contract and why every contract must be compliant. Every compliant contract must implement the following functionality. You may check 
[openzeppelin-contracts ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol)


## Polygon

### Testnet

The Polygon testnet is called Mumbai, which is a layer-two (L2) scaling platform for Ethereum. Like other testnets, Mumbai allows developers to deploy and test their applications on the Polygon network without having to spend real money. 

In the case of [Polygon](https://www.alchemy.com/overviews/mumbai-testnet#), their native token is called MATIC, which is trading at around $1 as of May 2022. On the other hand, the test tokens for Mumbai, or testnet MATIC, are distinct from the actual MATIC tokens and do not carry any monetary value. Therefore, developers often use what are called [faucets to receive free testnet MATIC](https://www.alchemy.com/overviews/mumbai-faucet) for development on Mumbai.

The Mumbai testnet is the testnet of the Polygon network, which replicates the Polygon mainnet. It enables developers to deploy, test, and execute their dApps in the blockchain environment risk-free and at no cost. 


### How to get started using the Mumbai testnet?

To use Mumbai to test your dApps, you will first need to set up a node in the network. A popular method is to connect your wallet to the virtual crypto wallet Metamask, which connects to a node by using a node provider like **Alchemy**.

After you have created a new app with the Mumbai testnet in **Alchemy**, there is some information you may need to fill out in the Metamask settings to connect to the network:

-   Network Name: Mumbai Testnet
-   New RPC URL: https://polygon-mumbai.g.alchemy.com/v2/your-api-key
-   Chain ID: 80001
-   Currency Symbol: MATIC
-   Block Explorer URL: https://mumbai.polygonscan.com/

Remember to replace "your-api-key" in New RPC URL with the API key of your Alchemy app. The Chain ID is one of the default Ethereum chains supported by Metamask. The block explorer URL points to Mumbai Polygonscan, the Mumbai block explorer.  For more details, you can also check out the [Mumbai testnet RPC URL documentation](https://docs.polygon.technology/docs/develop/network-details/network/).


### Local node devleopment

So you want to go to and if you're a dot lawyer and essentially