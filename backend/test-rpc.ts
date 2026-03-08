import 'dotenv/config';
import { ethers } from 'ethers';

const RPC_URL = process.env.CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
const CONTRACTS = (process.env.CONTRACT_ADDRESSES || '').split(',');

async function test() {
    console.log('Testing RPC:', RPC_URL);
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    try {
        const network = await provider.getNetwork();
        console.log('Network connected:', network.name, 'ChainId:', network.chainId.toString());

        const block = await provider.getBlockNumber();
        console.log('Current block:', block);

        for (const addr of CONTRACTS) {
            const cleanAddr = addr.trim();
            if (!cleanAddr) continue;
            console.log('Testing Contract:', cleanAddr);
            const code = await provider.getCode(cleanAddr);
            console.log('Contract code length:', code.length);
            if (code === '0x') {
                console.warn('WARNING: No code at address', cleanAddr);
            }
        }
    } catch (err) {
        console.error('Test failed:', err);
    }
}

test();
