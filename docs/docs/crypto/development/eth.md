---
title: Ethereum Ecosystem
description: 'The following sections outline essential concepts for constructing smart contracts to develop decentralised applications (DApps) on the Ethereum platform. The int.'
keywords:
  - crypto
  - development
  - ethereum ecosystem
  - ethereum
  - ecosystem
  - following
  - sections
  - outline
---
The following sections outline essential concepts for constructing smart contracts to develop decentralised applications (DApps) on the Ethereum platform. The intention is to **provide key insights** and a **practical developer path** from zero to deployed contract.

## Ethereum & the EVM (Quick Primer)

At a high level, Ethereum is a global state machine. Users submit **transactions** that execute code on the **Ethereum Virtual Machine (EVM)**, changing state if they succeed. Every state change costs **gas** (paid in ETH or the native token on L2s), which accounts for computation and storage.

### Transaction lifecycle (mental model)

1. You sign a transaction in a wallet (e.g., MetaMask).
2. A node receives it via JSON-RPC and propagates it to the network.
3. A block builder includes it in a block; the EVM executes the call.
4. If execution succeeds, state changes are committed; if not, it reverts and still spends gas for work done.

Understanding this flow helps you reason about errors, gas, and why on-chain changes are irreversible after finality.


## Solidity

Solidity is the primary language for EVM smart contracts. You’ll define **storage**, **functions**, **events**, **modifiers**, and **errors**. Key concepts to master:

- **Types & storage**: `uint256`, `address`, `mapping`, `struct`, storage vs memory.
- **Function visibility**: `public`, `external`, `internal`, `private`.
- **Access control**: `onlyOwner` via modifiers; or role-based access with OpenZeppelin.
- **Events** for off-chain indexing; **errors** (`revert`, `require`, `assert`) for correctness.
- **Inheritance & interfaces** for composability (e.g., ERC interfaces).

### SPDX-License-Identifier

`SPDX-License-Identifier` is a comment pragma specifying the licence for your Solidity source.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MyContract {
    // Contract code goes here
}
````

Use the identifier matching your chosen licence (e.g., `MIT`, `GPL-3.0-or-later`). See the full list at [https://spdx.org/licenses/](https://spdx.org/licenses/). An explainer on why SPDX reduces licence ambiguity is here.

:::info What is Software Package Data Exchange (SPDX)?
Licence rights depend on the chosen licence and version. SPDX standardises how projects declare licences so consumers know exactly what terms apply. Further reading: [SPDX clears confusion around software licenses](https://opensource.com/article/18/1/spdx-and-licensing)
:::


## Developer Tooling

These are the battle-tested tools you’ll actually use day-to-day:

* **Hardhat** — development environment / task runner for compiling, testing, deploying, verifying. Recent versions are documented here. 
* **Ethers.js** — concise library for wallet connections, contract calls, and deployments.
* **OpenZeppelin Contracts** — audited implementations (ERC-20/721/1155, access control, upgradeability). Start here.
* **Local chains** — Anvil (foundry) or Hardhat Network for instant local testing.
* **IPFS** — content-addressed storage for off-chain assets/metadata (use Infura/Pinata clients).
* **MetaMask** — wallet for testnets/L2s; add networks manually when needed.

### Minimal setup (Node.js project)

```bash
# Initialise project
npm init -y

# Install core tooling
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install ethers @openzeppelin/contracts dotenv
npx hardhat --init
```

This gives you a ready project with tests, scripts, and config.


## Smart Contract Lifecycle (Happy Path)

1. **Write** contract in `contracts/`.
2. **Compile**: `npx hardhat compile`.
3. **Test** (Mocha/Chai):

```js
// test/Counter.t.js
const { expect } = require("chai");
describe("Counter", () => {
  it("increments", async () => {
    const Counter = await ethers.getContractFactory("Counter");
    const c = await Counter.deploy();
    await c.increment();
    expect(await c.count()).to.equal(1n);
  });
});
```

4. **Deploy** (example: Sepolia):

```js
// scripts/deploy.js
const hre = require("hardhat");
async function main() {
  const Counter = await hre.ethers.getContractFactory("Counter");
  const c = await Counter.deploy();
  await c.waitForDeployment();
  console.log("Counter:", await c.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });
```

```bash
SEPOLIA_URL=https://sepolia.infura.io/v3/<key>
PRIVATE_KEY=<deployer_pk>

npx hardhat run scripts/deploy.js --network sepolia
```

5. **Verify** on a block explorer (Hardhat has plugins for Etherscan/Polygonscan).
6. **Interact** with Ethers.js or a front end (see “Front-End Integration”).


## Ethereum Services

* **Infura** — API access to Ethereum and IPFS without running your own node; handy for test and prod RPCs.

(Alternatives include Alchemy, QuickNode, Tenderly, etc.)


## ERC Standards (What to Use, When)

| Standard     | What it’s for                         | Typical use                | Start here             |
| ------------ | ------------------------------------- | -------------------------- | ---------------------- |
| **ERC-20**   | Fungible tokens                       | Currencies, governance     | OpenZeppelin Contracts |
| **ERC-721**  | Non-fungible tokens (single ID)       | NFTs, collectibles         | OZ `ERC721`            |
| **ERC-1155** | Multi-token (fungible & non-fungible) | Games, bundles             | OZ `ERC1155`           |
| **EIP-2981** | Royalty info for NFTs                 | Marketplaces and royalties | OZ `ERC2981`           |

### ERC-721 (NFTs)

If you’re building NFTs, reuse OpenZeppelin’s implementation rather than reinventing. It’s standards-compliant and audited.


## Networks & Testnets

### Ethereum testnets

* **Sepolia** — the primary public testnet for application developers (use this for deploying/test driving your dApp). (See MetaMask and Ethereum.org network docs.)
* (**Holesky** has been used for staking/infrastructure testing and is being phased out per EF updates; apps generally use Sepolia.) 

### Polygon (PoS) & its testnet

* **Polygon PoS** — EVM-compatible L2/sidechain with cheap fees.
* **Amoy** — **current** Polygon PoS testnet (replaces deprecated **Mumbai**). Chain ID **80002**. Mumbai was deprecated in April 2024; migrate to **Amoy**.

**Add Amoy to MetaMask** (example values; always check latest docs):

* Network Name: **Polygon Amoy Testnet**
* RPC URL: `https://rpc-amoy.polygon.technology/`
* Chain ID: **80002**
* Currency Symbol: **MATIC** (or POL as ecosystem transitions)
* Block Explorer: [https://amoy.polygonscan.com/](https://amoy.polygonscan.com/)

> Tip: Many infra providers (Alchemy, Tenderly, Infura, etc.) expose Amoy RPCs; use their dashboard APIs in `.env`.


## Front-End Integration (Ethers.js sketch)

```ts
import { BrowserProvider, Contract } from "ethers";
import abi from "./abis/Counter.json";

const provider = new BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();

const counter = new Contract("<DEPLOYED_ADDRESS>", abi, signer);
await (await counter.increment()).wait();
console.log(await counter.count());
```

This pattern (provider → signer → contract instance) underlies most dApps.


## Security & Best Practices (Must-Do)

* **Use audited libraries** (OpenZeppelin) for tokens, access control, and guards.
* Defend against **re-entrancy** (use `ReentrancyGuard`, checks-effects-interactions).
* Prefer **pull over push** payments; avoid `tx.origin`; validate external calls.
* Add **pausable**/emergency stops; design **upgrade paths** carefully (proxy patterns are powerful but require discipline).
* Run **static analysis** (e.g., Slither), add **property-based tests**, and keep high test coverage.


## Polygon

Polygon is a framework and EVM-compatible network suite that addresses scalability and cost, while remaining developer-friendly for Ethereum tooling. For PoS apps, test on **Amoy** (not Mumbai). See Polygon’s wallet docs for adding networks and RPC endpoints.

### Testnet (Amoy)

:::info What is a testnet?
A testnet is a separate blockchain used for risk-free testing with valueless tokens. It mirrors mainnet behaviour so you can deploy, test, and iterate quickly.
:::

* Use faucets to obtain test MATIC/POL on **Amoy**.
* Configure MetaMask using the values above or via Polygon’s “Add network” guide.

### Local node development

* Develop contracts locally (Anvil/Hardhat Network) for fast feedback.
* Use **OpenZeppelin Contracts** for ERC-721/20/1155 implementations.
* Store NFT metadata on **IPFS** (via Infura/Pinata).
* **Compile & deploy** with **Hardhat** (and verify on the appropriate explorer).
