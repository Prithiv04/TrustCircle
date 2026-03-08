# 📄 TrustCircle: Project Documentation

TrustCircle is a decentralized Rotating Savings and Credit Association (ROSCA) platform built on the **Creditcoin Testnet (CC3)**. It enables community-based savings where members contribute fixed amounts and take turns receiving the "pot."

---

## 🏗️ Architecture Overview

The system is composed of three primary layers:

### 1. Smart Contracts (On-Chain)
- **Language**: Solidity
- **Network**: Creditcoin Testnet (CC3)
- **Deployment**: 4 instances of the `TrustCircle` contract are deployed to demonstrate scalability across different regions or communities.
- **Core Logic**: Handles member joins, contributions, round management, and payouts. Contributions are fixed at `0.01 tCTC` (test Creditcoin).

### 2. Backend (Synchronization Layer)
- **Tech Stack**: Node.js, Express, Socket.io, Ethers.js
- **Role**: 
    - **Contract Poller**: A background service that polls the Creditcoin blockchain every 10 seconds.
    - **Real-time Engine**: Pushes contract events (new members, pot growth) to the frontend via WebSockets.
    - **History API**: Caches the last 50 pot updates to provide immediate historical data to users upon page refresh.

### 3. Frontend (User Interface)
- **Tech Stack**: React, Vite, Framer Motion, Recharts, Wagmi, Viem, RainbowKit.
- **Role**: 
    - **Dashboard**: High-fidelity interface for managing circles.
    - **Live Pot Graph**: Visual representation of community wealth growth.
    - **Wallet Integration**: Seamless connection via RainbowKit to the Creditcoin network.

---

## 📊 Data Sources: Real vs. Mock

For the **DoraHacks Demo**, we utilize a hybrid data model to ensure a stable and visually impressive presentation.

### ✅ What is REAL Data?
- **Blockchain Connectivity**: The dApp is fully integrated with the Creditcoin Testnet.
- **Smart Contract Addresses**: The addresses listed in the dashboard are real, deployed contract instances.
- **Wallet Connection**: Every transaction sign-off or member "Join" uses the real `wagmi` / `viem` provider.
- **Backend Polling**: The backend server is actively listening to the blockchain. If you check the server logs, you will see real-time block detection.
- **RPC Link**: The `creditcoin-testnet` chain configuration in the frontend is real.

### 🎨 What is MOCK Data? (The Demo Layer)
To guarantee a high-impact demo without waiting for block confirmations or external transaction triggers, we use a **Mock-over-Live** toggle (`USE_MOCK = true`):
- **Chennai Farmers Circle**: This is a curated demo case defined in `mockCircles.ts` to showcase a "complete" community story (farmers, specific member counts, etc.).
- **Animated Growth**: The pot growth graph animates from `0.01` to `0.07 tCTC` automatically to simulate active contributions during short demo windows.
- **Member Status**: Contribution ticks (green circles) are pre-filled to show what a "healthy" circle looks like.

> [!NOTE]
> Setting `USE_MOCK = false` in `Dashboard.tsx` will revert the UI to the raw blockchain state, fetching only data that has been explicitly written to the smart contracts.

---

## 🚀 Technical Highlights

- **Web3 Reactivity**: Uses a custom `useLiveCircle` hook that merges initial API history with live WebSocket updates for a "gapless" user experience.
- **18-Decimal Precision**: Implements a `formatTCTC` utility to correctly handle EVM-compatible BigInt values and display them with high precision.
- **Glassmorphic Design**: A premium UI built with vanilla CSS and Framer Motion, designed to "WOW" judges in under 10 seconds.

---

## 🛠️ Connectivity Details

| Component | Detail |
| :--- | :--- |
| **RPC URL** | `https://rpc.testnet.creditcoin.org` |
| **Backend Port** | `3600` (Socket.io & REST) |
| **Frontend Port** | `5173` (Vite) |
| **Chain ID** | `102030` (Creditcoin Testnet) |
| **Currency** | `tCTC` (Gwei-based, 18 decimals) |
