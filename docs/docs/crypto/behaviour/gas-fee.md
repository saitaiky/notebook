---
title: Gas Price
---

## Gas Limit

Gas Limit represents the maximum number of Gas units you're willing to pay for in a given transaction. The amount of Gas units needed to complete a transaction depends on its complexity. More complex transactions require more computational resources, hence more Gas.

It's crucial to note that setting insufficient Gas units will result in a failed transaction. The default Gas Limit for a typical transfer transaction is 21,000, but for activities like participating in token sales or using DApps that involve intricate smart contracts, a higher Gas Limit is necessary.

## Gas Price

Gas Price is the cost per unit of Gas, measured in GWEI. This value influences the speed at which miners prioritize and include your transaction on the blockchain. GWEI represents 0.000000001 ETH. For example, setting the Gas Price at 20 Gwei means Gas Price = 0.00000002 ETH.

A higher Gas Price offers miners a greater incentive to process your transaction more promptly, whereas a lower Gas Price may result in longer waiting times. If time isn't a concern, opting for a lower Gas Price can save you money.

Transaction Fee (Tx Fee) is calculated as Gas Limit multiplied by Gas Price.

To simplify, consider this metaphor: Gas Limit is akin to how many liters of fuel your car requires, and Gas Price is the price per liter of fuel. If driving from Taipei to Kaohsiung requires 21,000 liters at a rate of 20 NT per liter, the total fuel cost would be 21,000 liters * 20 NT = 420,000 NT.

## Executional notes

- **Pay attention to the Gas Limit when participating in token sales**: Follow the recommended Gas Limit set by the token sale provider. Smart contracts for token sales are more complex than standard transfers, requiring a higher Gas Limit. Setting it too low might lead to an "out of gas" error, as I encountered during an ICO when I forgot to adjust the Gas Limit from 21,000 to 100,000.
- **To save on miner fees, adjust Gas Price, not Gas Limit**: Lowering Gas Limit may render your transaction incapable of completing, resulting in failure. To economize on miner fees, reduce Gas Price and patiently await transaction completion.
- **You can reclaim unused Gas**: Setting a high Gas Limit doesn't risk your funds, as any unused Gas is refunded to your account upon transaction completion. You can verify these details on Etherscan. In the screenshot below, you can see the Gas Limit was set to 100,000, but only 35,826 were utilized, with the remainder refunded.
- **You still pay miner fees if a transaction fails**: If you inadvertently set the Gas Limit too low, leading to transaction failure, miner fees are not refunded. You are still required to pay fees for the computational work performed on the blockchain.
- **Ensure you have sufficient ETH for miner fees**: Regardless of whether you're sending ETH or ERC20 tokens, you must have ETH in your wallet to cover miner fees. Sometimes, people forget that ETH is necessary to send tokens.