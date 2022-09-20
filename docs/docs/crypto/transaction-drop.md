---
title: transaction drop
---

## Dropped Transaction

A transaction that is previously broadcasted on the network (but yet to be included in a block) can get dropped from the connected nodes. Dropped transaction happens more frequently during times when the network is busy.

There are several reasons for this:

1.  The Ethereum nodes (i.e., Geth/Parity) that we are connected to has dropped the Pending transaction from the transaction pool (most likely due to a lower gas price compared to other pending transactions or hitting other limits).
2.  There is a maximum amount of Pending transactions an Ethereum node can hold before certain transactions are dropped from its pending pool (this depends on the various settings/limits of the individual clients connected to the network).
3.  If a dropped transaction is not re-broadcasted, it will not be included in a block. If this happens, it would be as if the transaction had not taken place in the first place at all.
4.  If a dropped transaction is successfully re-broadcasted either directly or indirectly (by a different node), then it will re-appear as a Pending transaction.
5.  The transaction fee (gwei) provided for the transaction was too low. Consider replacing the transaction with a higher gas price
6.  For further assistance on dropped transactions, please contact the sender/creator of the transaction (i.e., your exchange, wallet provider, etc.)


## Dropped & Replaced Transaction

A transaction can get dropped and replaced when a newly created transaction with the same `FROM` account nonce is accepted and confirmed by the network. And because it has the same account nonce as the previous transaction, it replaces the previous txhash.

Common reasons a replacement transaction is broadcasted :

1.  The earlier transaction had a low gas price which would take a very long time to confirm, so a second transaction with a higher gas price was created to replace it
2.  The Ethereum Node that the wallet/service connected to was not fully synced, and an incorrect nonce was used
3.  User-initiated to replace or cancel a pending transaction

*A transaction can be {Dropped} or {Dropped & Replaced}. For additional assistance, please contact the sender/transaction creator directly for more information.*


## What is nonce?
A nonce refers to a number or value that can only be used once. Nonces are often used on authentication protocols and cryptographic hash functions. In the context of [blockchain](https://academy.binance.com/en/articles/how-does-blockchain-work) technology, a nonce refers to a pseudo-random number that is utilized as a counter during the process of [mining](https://academy.binance.com/en/articles/what-is-cryptocurrency-mining).

For instance, [Bitcoin](https://academy.binance.com/en/articles/what-is-bitcoin) miners need to try and guess a valid nonce as they perform multiple attempts to calculate a block hash that meets certain requirements (i.e., that starts with a certain number of zeros). When competing to mine a new block, the first miner to find a nonce that results in a valid block hash is granted the right to add the next block into the [blockchain](https://academy.binance.com/en/glossary/blockchain) - and is rewarded for doing so.

In other words, the process of mining consists of miners performing a myriad of hash functions with many different nonce values until a valid output is produced. If the hashing output of a miner falls below the predetermined threshold, the block is considered valid and is added to the blockchain. If the output is not valid, the miner keeps trying with different nonce values. When a new block is successfully mined and validated, the process starts over.

### How is nonce related to the hash value of a block in blockchain?

**Hash** is basically a one-way function in which you input a variable-length input and get a fixed-length unique output. and **nonce** basically means a number used once, now in bitcoin blockchain nonce is a value you add in front of a block to match the current difficulty which in bitcoin is a certain number of zeros at the start of the hash of the block. So you collect your data and get a fixed hash now you have to add a nonce value until you come equal to or closer to the difficulty level.

In Ethereum, The nonce is the number of transactions sent from a given address. the value of nonce related to the address increases as the number of transaction from that address increases.