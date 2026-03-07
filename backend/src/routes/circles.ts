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
router.get('/', cache(30), async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allCircles: ReturnType<typeof formatCircle>[] = [];

        for (const contractAddress of ALL_CONTRACT_ADDRESSES) {
            const contract = getContract(contractAddress);
            const count = await contract.getCircleCount();

            for (let i = 0; i < Number(count); i++) {
                try {
                    const data = await contract.getCircle(i);
                    allCircles.push(formatCircle(i, contractAddress, data));
                } catch {
                    // Skip unreadable circles
                }
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

        const contract = getContract(contractAddress);
        const data = await contract.getCircle(circleId);
        const members = await contract.getMembers(circleId);

        const circle = {
            ...formatCircle(circleId, contractAddress, data),
            members,
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
        const contract = getContract(contractAddress);
        const members = await contract.getMembers(parseInt(id));

        res.json({ success: true, data: { members, count: members.length } });
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
