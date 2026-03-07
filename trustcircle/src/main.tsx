import React from 'react';
import ReactDOM from 'react-dom/client';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { creditcoinTestnet } from '@/lib/creditcoin';
import App from './App';
import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
    appName: 'TrustCircle',
    projectId: 'trustcircle-rosca-dapp',
    chains: [creditcoinTestnet],
    ssr: false,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <App />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
);
