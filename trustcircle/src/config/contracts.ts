// Your 4x TrustCircle contract deployments on Creditcoin Testnet
// Replace these with your actual deployed contract addresses

export const TRUSTCIRCLE_ADDRESSES = [
    '0x0000000000000000000000000000000000000001', // Replace with actual deployment 1
    '0x0000000000000000000000000000000000000002', // Replace with actual deployment 2
    '0x0000000000000000000000000000000000000003', // Replace with actual deployment 3
    '0x0000000000000000000000000000000000000004', // Replace with actual deployment 4
] as const;

// Primary contract address (most recent deployment)
export const PRIMARY_CONTRACT_ADDRESS = TRUSTCIRCLE_ADDRESSES[0];

export const CREDITCOIN_TESTNET_RPC =
    import.meta.env.VITE_CREDITCOIN_RPC || 'https://rpc.testnet.creditcoin.org';
