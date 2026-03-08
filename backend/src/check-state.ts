import * as dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { TRUSTCIRCLE_ABI, ALL_CONTRACT_ADDRESSES, provider } from './lib/ethers-client';

async function check() {
    console.log('--- Blockchain State Verification ---');
    console.log('RPC URL:', process.env.CREDITCOIN_RPC_URL);

    for (const address of ALL_CONTRACT_ADDRESSES) {
        const contract = new ethers.Contract(address, TRUSTCIRCLE_ABI, provider);
        try {
            const count = await contract.nextCircleId();
            console.log(`Address: ${address} | nextCircleId: ${count}`);
        } catch (err) {
            console.error(`Address: ${address} | FAILED:`, err instanceof Error ? err.message : err);
        }
    }
}

check().catch(console.error);
