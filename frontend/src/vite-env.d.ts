/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONTRACT_ADDRESSES: string;
    readonly VITE_CREDITCOIN_RPC: string;
    readonly VITE_WALLETCONNECT_PROJECT_ID: string;
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
