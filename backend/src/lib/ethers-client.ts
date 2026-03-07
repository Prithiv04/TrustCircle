import { ethers } from 'ethers';

const CREDITCOIN_RPC =
    process.env.CREDITCOIN_RPC_URL || 'https://rpc.testnet.creditcoin.org';

// Create a shared provider instance
export const provider = new ethers.JsonRpcProvider(CREDITCOIN_RPC);

// TrustCircle contract ABI (minimal for backend read operations)
export const TRUSTCIRCLE_ABI = [
    'function getCircleCount() view returns (uint256)',
    'function getCircle(uint256 _circleId) view returns (string name, address creator, uint256 contributionAmount, uint256 maxMembers, uint256 currentMembers, uint256 currentRound, uint256 totalRounds, uint256 nextPayoutTime, bool isActive)',
    'function getMembers(uint256 _circleId) view returns (address[])',
    'function hasContributed(uint256 _circleId, address _member, uint256 _round) view returns (bool)',
    'event CircleCreated(uint256 indexed circleId, address indexed creator, string name, uint256 contributionAmount, uint256 memberCount)',
    'event ContributionMade(uint256 indexed circleId, address indexed member, uint256 amount, uint256 round)',
    'event PayoutDistributed(uint256 indexed circleId, address indexed recipient, uint256 amount, uint256 round)',
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
