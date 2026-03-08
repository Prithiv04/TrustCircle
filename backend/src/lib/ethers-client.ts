import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();

const CREDITCOIN_RPC =
    process.env.CREDITCOIN_RPC_URL || 'https://rpc.testnet.creditcoin.org';

// Create a shared provider instance
export const provider = new ethers.JsonRpcProvider(CREDITCOIN_RPC);

// TrustCircle contract ABI (Simplified to match live contracts on Creditcoin Testnet)
export const TRUSTCIRCLE_ABI = [
    'function nextCircleId() view returns (uint256)',
    'function circles(uint256 circleId, uint256 index) view returns (address)',
    'function pots(uint256 circleId) view returns (uint256)',
    'function currentMember(uint256 circleId) view returns (uint256)',
    'function contribute(uint256 circleId) external payable',
    'function claim(uint256 circleId) external',
    'function createCircle(address[10] _members) external returns (uint256)',
];

// Contract addresses from your 4 deployments
const CONTRACT_ADDRESSES: string[] = (
    process.env.CONTRACT_ADDRESSES ||
    '0x0000000000000000000000000000000000000001,0x0000000000000000000000000000000000000002,0x0000000000000000000000000000000000000003,0x0000000000000000000000000000000000000004'
)
    .split(',')
    .map((a) => a.trim());

export const PRIMARY_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[0];
export const ALL_CONTRACT_ADDRESSES = CONTRACT_ADDRESSES;

// Create a contract instance for given address
export function getContract(address: string): ethers.Contract {
    return new ethers.Contract(address, TRUSTCIRCLE_ABI, provider);
}

// Get the primary contract
export function getPrimaryContract(): ethers.Contract {
    return getContract(PRIMARY_CONTRACT_ADDRESS);
}

// Test connectivity
export async function checkConnection(): Promise<void> {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log(`Connected to Creditcoin Testnet. Block: ${blockNumber}`);
    } catch (err) {
        console.error('Failed to connect to Creditcoin RPC:', err);
    }
}

checkConnection();
