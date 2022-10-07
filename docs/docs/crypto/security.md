---
title: Attack on block chain
---

## What Is a 51% Attack?
A 51% attack refers to an attack on a blockchain for which such an attack is still hypothetical—by a group of miners controlling more than 50% of the network's mining hash rate or computing power.

The attackers would be able to prevent new transactions from gaining confirmations, allowing them to halt payments between some or all users (攔截任何他們不喜歡的交易). They would also be able to reverse transactions that were completed while they were in control of the network, meaning they could double-spend coins.

Double-spending
“Double-spending” means that the same units of a currency could be spent twice
Double-spending would destroy the trust in a cryptocurrency
Cryptocurrencies prevent double-spending by using a blockchain that combines an open ledger with cryptographic algorithms

当一笔从Carl到Alice的转账交易刚被写入一个区块x时，它得到了一个确认。而此刻可能另有一笔从Carl到Bob的交易正被写入区块y。之后如果以y为首的链延伸到更长，那么区块x (Alice個block)就成为了孤块，被矿工们集体遗弃，其中所包含的Carl到Alice的交易记录也随之不被大家所承认，于是Carl在这个过程中就实现了一次双重支付。
