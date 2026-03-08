// Your 4x TrustCircle contract deployments on Creditcoin Testnet
// Replace these with your actual deployed contract addresses

export const TRUSTCIRCLE_ADDRESSES = [
    '0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26',
] as const;

// Primary contract address for the DoraHacks demo
export const PRIMARY_CONTRACT_ADDRESS = '0x842b580EdA9e4930b4f09B05cB39f92a5cD9fF26';

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
