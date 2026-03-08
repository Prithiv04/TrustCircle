// Your 4x TrustCircle contract deployments on Creditcoin Testnet
// Replace these with your actual deployed contract addresses

const envAddresses = import.meta.env.VITE_CONTRACT_ADDRESSES?.split(',');

export const TRUSTCIRCLE_ADDRESSES = (envAddresses && envAddresses.length >= 4) ? envAddresses : [
    '0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26',
    '0x8f1Ff851afa75D98753c8aB4352b37D07797f408',
    '0x68409ee9d9D9b7DfdEb4b2dd2bddb7f1312cB947',
    '0x6Cee7aA2E56053e2656a20097eAECbd9AD786E17'
] as const;

// Primary contract address for the DoraHacks demo
export const PRIMARY_CONTRACT_ADDRESS = TRUSTCIRCLE_ADDRESSES[0];

export const CREDITCOIN_TESTNET_RPC =
    import.meta.env.VITE_CREDITCOIN_RPC || 'https://rpc.cc3-testnet.creditcoin.network';

/**
 * Formats wei/bigint values to professional tCTC display
 * @param wei The value in wei (bigint or string)
 * @returns Formatted string with 4 decimal places
 */
export function formatTCTC(wei: bigint | string | number): string {
    try {
        const val = typeof wei === 'bigint' ? wei : BigInt(wei || 0);
        return (Number(val) / 1e18).toFixed(4);
    } catch (e) {
        return "0.0000";
    }
}
