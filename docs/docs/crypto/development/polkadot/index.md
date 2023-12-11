---
title: Polkadot
---



## FAQ

- Is there any recommended resource for creating a boilerplate Dapp application with Polkadot?
    - ink contracts boilerplate ⁠dev-discussions⁠ - https://github.com/scio-labs/inkathon
- When developing a new application, should we create a new token or utilize an existing one (e.g., Moonbeam, Acala within Polkadot)?
    - If you want to build dApp or smart/ink contracts its suitable to build on top of parachain like Acala, Moonbeam and utilize their tokens
- Is it necessary to start with Kusama as the test net before deploying on Polkadot?
    - Kusama only if you want to build your own parachain using rust + substrate
- Has anyone successfully secured sponsorship from the treasury, as outlined in the document? Could you share your experience with the process?
    - There are different kinds of grants from Polkadot treasury, web3 foundation grants and ink contracts grants





- Can I develop my dApp with ink on any parachain (e.g., Acala, Moonbeam) since they are all built on Substrate?
    - you can deploy ink contracts on parachains which only supports it, likewise for evm smart contracts. here's a list of parachains which support it https://wiki.polkadot.network/docs/build-smart-contracts#smart-contract-environments
- When should I consider creating my own parachain instead of using an existing one?
    - with parachains, code can be more customized according to your needs, more which may not be possible through smart contracts(due to limited capabilities) , also more scalable, secure and Interoperable with other parachains. but operational heavy due to infra costs and more validators required. https://wiki.polkadot.network/docs/build-pdk
- If I opt not to build my own parachain, is it accurate that I don't require the Polkadot testnet (Kusama) but should utilize the chosen parachain's testnet, such as Moonbase Alpha for Moonbeam?
    - If you don't plan to build your own parachain you can deploy your smart/ink contracts on the parachains testnet.


## Kusama

Kusama is an independent network not an Polkadot testnet. They have common testnet like rococo for parachains and westend for testing the latest metadata, extrinsics etc. https://wiki.polkadot.network/docs/maintain-networks#test-networks 

----
dev-discussions
⁠watercooler
substrate.stackexchange.com

also we have a heroes program, a community driven learning based initiative at ⁠heroes-introduction.
check channel description or ping @ zsofi_m for clarification regarding heroes program


Let me know if you need more clarification, wiki.polkadot.network has all the info you need 🙂 might as well check there




## Parathread

Technically they are the same as parachains but differ from the latter by the economic model. 

Parathreads use a pay as you go model and pay for each block to be validated by the relay chain 

That is during times of high network congestion para threads can become quite expensive to use and during times of low activity the fees on them are low. 

The polkadot network can hold up to 10,000 Parathreads

## Substrate

The polkadot network itself was built by using substrate, but building parachains using substrate is not at all a prerequisite and vice versa. Blockchains with substrate can exist on their own without connecting to polkadot or kusama