import * as dotenv from 'dotenv';
dotenv.config();

import { ethers } from 'ethers';
import { TRUSTCIRCLE_ABI, ALL_CONTRACT_ADDRESSES, provider } from './lib/ethers-client';

async function seed() {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        console.error('ERROR: PRIVATE_KEY not found in .env file.');
        console.log('Please add PRIVATE_KEY=your_key to backend/.env');
        return;
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    console.log(`Seeding from address: ${wallet.address}`);

    // Skip the first one if it already has circles, move to 2, 3, 4
    const contractsToSeed = ALL_CONTRACT_ADDRESSES.slice(1);

    for (const address of contractsToSeed) {
        console.log(`\n--- Seeding Contract: ${address} ---`);
        const contract = new ethers.Contract(address, TRUSTCIRCLE_ABI, wallet);

        try {
            const countBefore = await contract.nextCircleId();
            console.log(`Address: ${address} | nextCircleId before: ${countBefore}`);

            // Create 3 circles per contract for testing
            for (let i = 0; i < 3; i++) {
                console.log(`Creating circle ${i + 1}/3...`);
                const members = [
                    wallet.address,
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000",
                    "0x0000000000000000000000000000000000000000"
                ];

                const tx = await contract.createCircle(members);
                console.log(`Transaction sent: ${tx.hash}`);
                await tx.wait();
                console.log(`Circle ${i + 1} created successfully!`);
            }
            const countAfter = await contract.nextCircleId();
            console.log(`Address: ${address} | nextCircleId after: ${countAfter}`);
        } catch (err) {
            console.error(`Failed to seed ${address}:`, err instanceof Error ? err.message : err);
        }
    }
}

seed().catch(console.error);
