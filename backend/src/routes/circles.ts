import { Router, Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import { getContract, ALL_CONTRACT_ADDRESSES } from '../lib/ethers-client';
import { cache } from '../middleware/cache';
import { io } from '../server';

const router = Router();

// Helper to format a circle from contract data
function formatCircle(
    id: number,
    contractAddress: string,
    data: [string, string, bigint, bigint, bigint, bigint, bigint, bigint, boolean]
) {
    const [name, creator, contributionAmount, maxMembers, currentMembers, currentRound, totalRounds, nextPayoutTime, isActive] = data;
    return {
        id,
        contractAddress,
        name,
        creator,
        contributionAmount: contributionAmount.toString(),
        contributionAmountEth: ethers.formatEther(contributionAmount),
        maxMembers: Number(maxMembers),
        currentMembers: Number(currentMembers),
        currentRound: Number(currentRound),
        totalRounds: Number(totalRounds),
        nextPayoutTime: Number(nextPayoutTime),
        isActive,
    };
}

// GET /api/circles - Get all circles from all contracts
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allCircles: any[] = [];

        for (const contractAddress of ALL_CONTRACT_ADDRESSES) {
            try {
                const contract = getContract(contractAddress) as any;
                const count = await contract.nextCircleId();

                for (let i = 0; i < Number(count); i++) {
                    try {
                        // Fetch all 10 members from the mapping
                        const memberPromises = Array.from({ length: 10 }, (_, idx) =>
                            contract.circles(i, idx).catch(() => "0x0000000000000000000000000000000000000000")
                        );
                        const members = await Promise.all(memberPromises);
                        const pot = await contract.pots(i);
                        const current = await contract.currentMember(i);

                        // Match the frontend's expected structure as closely as possible
                        allCircles.push({
                            id: i,
                            contractAddress,
                            name: `Circle #${i}`,
                            creator: members[0],
                            contributionAmount: "10000000000000000", // Fixed 0.01 ether in this version
                            contributionAmountEth: "0.01",
                            maxMembers: 10,
                            currentMembers: members.filter(m => m !== "0x0000000000000000000000000000000000000000").length,
                            currentRound: Number(current) + 1,
                            totalRounds: 10,
                            nextPayoutTime: 0, // Not available in this version
                            isActive: true,
                            pot: pot.toString(),
                            potEth: ethers.formatEther(pot),
                            members
                        });
                    } catch (innerErr) {
                        console.warn(`[API] Skipping circle ${i} on ${contractAddress}:`,
                            innerErr instanceof Error ? innerErr.message : innerErr);
                    }
                }
            } catch (contractErr) {
                console.error(`[API] Contract error at ${contractAddress}:`,
                    contractErr instanceof Error ? contractErr.message : contractErr);
            }
        }

        res.json({
            success: true,
            data: allCircles,
            total: allCircles.length,
            contracts: ALL_CONTRACT_ADDRESSES.length,
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/circles/:contractAddress/:id - Get a specific circle
router.get('/:contractAddress/:id', cache(15), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contractAddress, id } = req.params;
        const circleId = parseInt(id);

        if (isNaN(circleId) || circleId < 0) {
            return res.status(400).json({ error: { message: 'Invalid circle ID', status: 400 } });
        }

        const contract = getContract(contractAddress) as any;

        // Fetch all 10 members from the mapping
        const memberPromises = Array.from({ length: 10 }, (_, idx) =>
            contract.circles(circleId, idx).catch(() => "0x0000000000000000000000000000000000000000")
        );
        const members = await Promise.all(memberPromises);
        const pot = await contract.pots(circleId);
        const current = await contract.currentMember(circleId);

        const circle = {
            id: circleId,
            contractAddress,
            name: `Circle #${circleId}`,
            creator: members[0],
            contributionAmount: "10000000000000000",
            contributionAmountEth: "0.01",
            maxMembers: 10,
            currentMembers: members.filter(m => m !== "0x0000000000000000000000000000000000000000").length,
            currentRound: Number(current) + 1,
            totalRounds: 10,
            nextPayoutTime: 0,
            isActive: true,
            pot: pot.toString(),
            potEth: ethers.formatEther(pot),
            members
        };

        res.json({ success: true, data: circle });
    } catch (err) {
        next(err);
    }
});

// GET /api/circles/:contractAddress/:id/members - Get circle members
router.get('/:contractAddress/:id/members', cache(30), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contractAddress, id } = req.params;
        const circleId = parseInt(id);
        const contract = getContract(contractAddress) as any;

        const memberPromises = Array.from({ length: 10 }, (_, idx) =>
            contract.circles(circleId, idx).catch(() => "0x0000000000000000000000000000000000000000")
        );
        const allMembers = await Promise.all(memberPromises);
        const members = allMembers.filter(m => m !== "0x0000000000000000000000000000000000000000");

        res.json({ success: true, data: { members, count: members.length } });
    } catch (err) {
        next(err);
    }
});

// GET /api/circles/:contractAddress/:id/history - Get circle pot history
router.get('/:contractAddress/:id/history', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { contractAddress, id } = req.params;
        const circleId = parseInt(id);
        const { poller } = req.app.get('services');

        if (!poller) {
            return res.json({ success: true, data: [] });
        }

        const history = poller.getHistory(contractAddress, circleId);
        res.json({ success: true, data: history });
    } catch (err) {
        next(err);
    }
});

// POST /api/circles/notify - Emit real-time event for blockchain events
// (Called by a webhook or listener when contract events fire)
router.post('/notify', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { event, circleId, contractAddress, data } = req.body;

        if (!event || !circleId) {
            return res.status(400).json({ error: { message: 'Missing event or circleId', status: 400 } });
        }

        // Emit to socket.io room
        io.to(`circle:${circleId}`).emit(`circle:${event}`, {
            circleId,
            contractAddress,
            ...data,
        });

        // Also emit to global feed
        io.emit('feed:event', { event, circleId, contractAddress, data, timestamp: Date.now() });

        res.json({ success: true, emitted: true });
    } catch (err) {
        next(err);
    }
});

export default router;
