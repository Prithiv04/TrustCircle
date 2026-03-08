const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = process.env.CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
const CONTRACTS = (process.env.CONTRACT_ADDRESSES || '').split(',').map(a => a.trim()).filter(Boolean);

const ABI = [
    'function getCircleCount() view returns (uint256)',
    'function nextCircleId() view returns (uint256)',
    'function getCircle(uint256 _circleId) view returns (string name, address creator, uint256 contributionAmount, uint256 maxMembers, uint256 currentMembers, uint256 currentRound, uint256 totalRounds, uint256 nextPayoutTime, bool isActive)'
];

async function test() {
    console.log('Testing RPC:', RPC_URL);
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    for (const addr of CONTRACTS) {
        console.log('\nContract:', addr);
        const contract = new ethers.Contract(addr, ABI, provider);
        try {
            const count = await contract.getCircleCount();
            console.log('getCircleCount:', count.toString());

            for (let i = 0; i < Number(count); i++) {
                const circle = await contract.getCircle(i);
                console.log(`Circle ${i}:`, circle[0]); // name
            }
        } catch (err) {
            console.error('Failed call:', err.message);
        }
    }
}

test();
