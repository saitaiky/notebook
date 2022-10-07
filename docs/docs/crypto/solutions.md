



以太坊的困境與解法：側鏈與 Layer 2
---------------------

### 不可能三角

隨著區塊鏈發展，越來越多人使用這項技術的同時，人們也發現了它的局限性，提出區塊鏈的「不可能三角」![](https://lh6.googleusercontent.com/Ygc-pIEDD2Zk-g4GtpD-2RLjx5aUlOuZr6D1DqVitvXJDeIrl_V1YlcWsWWl-YAcel_W8_Th8ddocg9OEs03w8vjKtQtjaaRPONAOH4w8PJIRQz4r9MzVmo-vFHJpAiRy5MnpIYjv6eq6dpkOmr7WqlX632wxYCdb6q5P0Ux945pYaLDTji21cDF)

(Impossible Triangle)，這項理論指出，要在區塊鏈上同時滿足「去中心化」、「安全」、「效率」這三點，是不可能的事情。為了克服這個不可能，人們也提出了許多解決方法，試圖一次達成這三個目標。

有人想從最基本的架構元素下手，包含公私鑰匙、區塊、共識機制等，而這些被稱為 Layer 1，屬於區塊鏈的底層協議。大家提出的解決方法又被稱為 Layer 1 的擴充方案，目前主要專注在提升交易速度，例如：改進鏈的結構、改進區塊的架構、增加區塊大小等。

也有人不想更動區塊鏈，選擇在鏈下增加協議，讓鏈上的交易速度增加，而這些建構在 Layer 1 之上的輔助或協議，又稱為 Layer 2，而這些鏈下的擴充方案好處是不用改變區塊鏈本身，修改較容易。但 Layer 2 並不負責驗證，最終資料還是要傳回 Layer 1，而這資料的傳輸過程的安全性與速度也是 Layer 2 的挑戰之一。

其中一個知名的 Layer 2 擴充方案是「側鏈」，最早出現時是為了讓比特幣交易加速，方法是將原本主鏈上的交易移到側鏈上確認，要結算時再將結果廣播到原本的鏈上。

### What is Layer 2?

> TL;DR - They are Off-chain solutions: off workload from Layer 1

Layer 2 refers to a secondary framework or protocol that is built on top of an existing blockchain system. The main goal of these protocols is to solve the transaction speed and scaling difficulties that are being faced by the major cryptocurrency networks.

For instance, [Bitcoin](https://academy.binance.com/en/glossary/bitcoin) and [Ethereum](https://academy.binance.com/en/articles/what-is-ethereum) are still not able to process thousands of [transactions per second (TPS)](https://academy.binance.com/en/glossary/transactions-per-second), and this is certainly detrimental to their long-term growth. There is a need for higher throughput before these networks can be effectively adopted and used on a wider scale.

In this context, the term "layer 2" refers to the multiple solutions being proposed to the blockchain scalability problem. Two major examples of layer 2 solutions are the [Bitcoin Lightning Network](https://academy.binance.com/en/articles/what-is-lightning-network) and the [Ethereum Plasma](https://academy.binance.com/en/articles/what-is-ethereum-plasma). Despite having their own working mechanisms and particularities, both solutions are striving to provide increased throughput to blockchain systems.

In a broader sense, layer 2 protocols create a secondary framework, where blockchain transactions and processes can take place independently of the layer 1 (main chain). For this reason, these techniques may also be referred to as "[off-chain](https://academy.binance.com/en/glossary/off-chain)" scaling solutions.

One of the main advantages of using off-chain solutions is that the main chain doesn't need to go through any structural change because the second layer is added as an extra layer. As such, layer 2 solutions have the potential to achieve high throughput without sacrificing network security.

In other words, a great portion of the work that would be performed by the main chain can be moved to the second layer. So while the main chain (layer 1) provides security, the second layer offers high throughput, being able to perform hundreds, or even thousands, of transactions per second.

### 如何參與layer 2的獲利機會

layer 2的出現除了加快TPS、降低用戶需要付的GAS費之外，想在layer 2上投資獲利，最簡單可以從以下兩種方式：

-   買入layer 2概念幣(eg: MATIC, SNX, OMG)、賺取質押獎勵
-   進行layer 2流動性挖礦

layer 2前景看好，但部分人依然認為以太坊加強本身（layer 1）的能力才是最終解方，layer 2只能作為過渡的折衷方案。

筆者個人認為一般用戶如我們，在乎的還是使用體驗跟交易成本，layer 2能有效提升以太坊的效率又能降低GAS費，當然是越快普及越好，而且layer 2帶來的投資機會也可以趁機把握，畢竟以太坊2.0完成是至少兩年後的事，這中間瞬息萬變的幣圈沒道理要苦等。(2021.08.22)





## What is Sidechain

To understand Sidechains remember that the Ethereum blockchain is the main chain. So if Ethereum is the main chain, then Sidechains are like sister chains. Essentially, Sidechains run alongside the main chain. Furthermore, these blockchains can communicate with each other so that assets can move between the chains.

To create a Sidechain, developers must first create another blockchain and a consensus mechanism like PoW, PoS, Proof of Authority (PoA), or Delegated Proof of Stake (dPoS).

Next, moving assets between the blockchains requires a smart contract on Ethereum. To get assets to the Sidechain, users would first deposit into an Ethereum smart contract and then recreate them on the Sidechain. Getting the assets back to Ethereum requires removing them from the Sidechain and unlocking them once they're back on Ethereum.  (上網搵既中文版解釋: 側鏈會在以太坊上部屬智能合約，合約負責存款與提款的功能。使用者在Layer 1在合約上存入的以太幣或其他代幣會被鎖住，側鏈收到入帳的訊息指令後，產塊者有權力同步在側鏈上鑄造相應的加密貨幣，使用者就可以在側鏈的系統上與其他使用者進行無數次的交易；直到使用者交易完畢後，想要將餘額在Layer 1上提領時，側鏈產塊者會將最新的餘額狀態回報到以太坊上，讓使用者根據餘額提領，並且側鏈產塊者會同步銷毀在側鏈上相應的加密貨幣。)

### Sidechain Pros and Cons

Pros: The cool thing about Sidechains is that even if users make loads of transactions, the only two that occur on the main chain are the deposit and the withdrawal. Since transactions are less expensive on the Sidechain than on Ethereum itself, scalability is the result.

Cons: There are some flaws with Sidechains, however. Granting the power to create new blocks brings the power to stop producing blocks. Worse yet, Sidechains grant operators the power to prevent users from withdrawing their funds. To see Sidechains in action, check out Polygon (Matic) or xDai.

### What is the key difference between layer-2 and sidechains?

Despite dramatically boosting transaction capacity, both solutions provide significant security tradeoffs in comparison with normal transactions.  The key difference between layer-2 and sidechain solutions lies in the differences in their security mechanisms. While layer-2 generally relies on the security of the main chain, sidechains have their own security properties.

If you have coins inside a layer 2, then as long as the main chain keeps working you are guaranteed to be able to covert those coins into coins on the underlying main chain; even a 51% attack on the layer 2 cannot prevent you from converting. 

In a sidechain, this is not the case; a 51% attack on the sidechai