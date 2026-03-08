import { defineChain } from 'viem';

export const creditcoinTestnet = defineChain({
    id: 102031,
    name: 'Creditcoin Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Testnet CTC',
        symbol: 'tCTC',
    },
    rpcUrls: {
        default: {
            http: [import.meta.env.VITE_CREDITCOIN_RPC || 'https://rpc.cc3-testnet.creditcoin.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Creditcoin Explorer',
            url: 'https://testnet.creditcoin.io',
        },
    },
    testnet: true,
});
