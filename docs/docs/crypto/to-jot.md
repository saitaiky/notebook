
## For reference 

PoS Testnet
https://docs.polygon.technology/docs/develop/network-details/network/


## To-be clarify

### Course

Hardhat vs Truffle
https://blog.cryptostars.is/hardhat-vs-truffle-c0c4a8a64f21


Why adding hardhat-waffle in hardhat.config file?




What are RPCs?
remove procedure call
https://moralis.io/ethereum-rpc-nodes-what-they-are-and-why-you-shouldnt-use-them/


What is ABI
https://www.quicknode.com/guides/solidity/what-is-an-abi
ABI (Application Binary Interface) in the context of computer science is an interface between two program modules, often between operating systems and user programs.

The Contract Application Binary Interface (ABI) is the standard way to interact with contracts in the Ethereum ecosystem, both from outside the blockchain and for contract-to-contract interaction.
Contract ABI is represented in JSON format. There are clear specifications of how to encode and decode a contract ABI. 


in pages/indes.js
Why buying NFTs need signer and loading NFT need provider??
What is the different between provider and signer?


[Signers](https://docs.ethers.io/v5/api/signer/)
A Signer in ethers is an abstraction of an Ethereum Account, which can be used to sign messages and transactions and send signed transactions to the Ethereum Network to execute state changing operations.

The available operations depend largely on the sub-class used.

For example, a Signer from MetaMask can send transactions and sign messages but cannot sign a transaction (without broadcasting it).

The most common Signers you will encounter are:

Wallet, which is a class which knows its private key and can execute any operations with it
JsonRpcSigner, which is connected to a JsonRpcProvider (or sub-class) and is acquired using getSigner





What is IPFS??


CID - Content Identifier
https://help.coinbase.com/en/coinbase/getting-started/crypto-education/glossary/content-identifier
A Content Identifier or CID is a label that is formed using a unique string of letters and numbers (known as a cryptographic hash) to represent content like pictures, videos or other files on the IPFS network.


what is chainid? why 
why do we need pay gas fee for localhost?  who calulate the minting fee?
why metamask know it is Mint Token?


why these steps work?
run the blockchain
deploy contract




### Side

Understanding EVM, virtual machines and EVM chains
https://pontem.network/posts/understanding-evm-virtual-machines-and-evm-chains