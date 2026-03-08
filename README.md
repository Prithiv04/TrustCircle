# TrustCircle 🔵

> **Production-grade ROSCA dApp on Creditcoin Testnet** — Save together, grow together.

TrustCircle brings the ancient ROSCA (Rotating Savings and Credit Association) savings model on-chain, making it transparent, trustless, and accessible to 1.4B+ unbanked people worldwide.

[![Built on Creditcoin](https://img.shields.io/badge/Chain-Creditcoin_Testnet-10b981?style=flat-square)](https://creditcoin.org)
[![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-61dafb?style=flat-square)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 🏗 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Wallet | RainbowKit + Wagmi v2 + Viem |
| UI | shadcn/ui + Lucide React + Framer Motion |
| Charts | Recharts |
| Backend | Node.js + Express + Socket.io |
| Caching | Redis (ioredis) |
| Blockchain | Ethers.js v6 |
| Frontend Deploy | Netlify / Vercel |
| Backend Deploy | Render |
| Chain | Creditcoin Testnet (Chain ID: 102031) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Setup

```bash
git clone https://github.com/YOURNAME/trustcircle-rosca
cd trustcircle-rosca
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your contract addresses in .env
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

### 3. Backend

```bash
cd backend
cp .env.example .env
# Fill in your RPC URL and contract addresses
npm install
npm run dev
```

Backend runs at: **http://localhost:3001**

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_CONTRACT_ADDRESSES=0xabc...,0xdef...  # Your 4x deployments
VITE_CREDITCOIN_RPC=https://rpc.testnet.creditcoin.org
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
VITE_API_URL=http://localhost:3001
```

### Backend (`backend/.env`)
```env
CREDITCOIN_RPC_URL=https://rpc.testnet.creditcoin.org
CONTRACT_ADDRESSES=0xabc...,0xdef...  # Your 4x deployments
REDIS_URL=redis://localhost:6379
PORT=3001
FRONTEND_URL=http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `GET` | `/api/circles` | All circles from all contracts |
| `GET` | `/api/circles/:contractAddress/:id` | Specific circle + members |
| `GET` | `/api/circles/:contractAddress/:id/members` | Circle member list |
| `POST` | `/api/circles/notify` | Push real-time event |

---

## 🎯 Core Proof (Already Complete)

- ✅ 4x TrustCircle contract deployments on Creditcoin Testnet
- ✅ MetaMask $0.00 gas depletion confirmation
- ✅ Official Discord faucet ticket

---

## 📁 Project Structure

```
trustcircle-rosca/
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Header, Hero, Dashboard, ROSCACircleCard, etc.
│   │   ├── hooks/        # useTrustCircle Wagmi hooks
│   │   ├── lib/          # creditcoin.ts chain definition
│   │   ├── config/       # Contract addresses
│   │   └── contracts/    # TrustCircle ABI
│   └── ...
└── backend/              # Node.js + Express API
    ├── src/
    │   ├── routes/       # circles.ts API routes
    │   ├── lib/          # ethers-client.ts
    │   └── middleware/   # cache.ts, errors.ts
    └── ...
```

---

## 🚢 Deployment

**Frontend → Netlify or Vercel**
1. Push to GitHub
2. Connect repo to Netlify/Vercel
3. Set environment variables in dashboard
4. Deploy!

**Backend → Render.com (free tier)**
1. Create new Web Service
2. Connect GitHub repo, set root to `backend/`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables

---

**Production-grade ROSCA dApp → Portfolio centerpiece + Hackathon winner** 🏆
