import { Server as IOServer } from 'socket.io';
import { getContract, ALL_CONTRACT_ADDRESSES } from '../lib/ethers-client';
import { ethers } from 'ethers';

export interface PotUpdate {
  contractAddress: string;
  circleId: number;
  potSize: string;       // formatted ETH string e.g. "0.600"
  potSizeRaw: string;    // bigint as string for precision
  currentMembers: number;
  currentRound: number;
  isActive: boolean;
  timestamp: number;
}

export class ContractPoller {
  private io: IOServer;
  private pollInterval: NodeJS.Timeout | null = null;
  private readonly POLL_MS = 10_000; // 10 seconds
  private history: Map<string, PotUpdate[]> = new Map();
  private readonly MAX_HISTORY = 50;

  constructor(io: IOServer) {
    this.io = io;
  }

  start(): void {
    console.log('[Poller] Starting contract polling every 10s...');
    this.poll(); // immediate first poll
    this.pollInterval = setInterval(() => this.poll(), this.POLL_MS);
  }

  stop(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    console.log('[Poller] Stopped.');
  }

  getHistory(contractAddress: string, circleId: number): PotUpdate[] {
    const key = `${contractAddress.toLowerCase()}:${circleId}`;
    return this.history.get(key) || [];
  }

  private async poll(): Promise<void> {
    for (const contractAddress of ALL_CONTRACT_ADDRESSES) {
      try {
        const contract = getContract(contractAddress) as any;
        console.log(`[Poller] Processing ${contractAddress.slice(0, 10)}...`);
        const count = await contract.nextCircleId();
        const circleCount = Number(count);
        console.log(`[Poller] -> found ${circleCount} circles`);

        for (let i = 0; i < circleCount; i++) {
          try {
            // Fetch pot and current member from mappings
            const potSizeRaw = await contract.pots(i);
            const current = await contract.currentMember(i);

            // Fetch members to count active ones
            const memberPromises = Array.from({ length: 10 }, (_, idx) =>
              contract.circles(i, idx).catch(() => "0x0000000000000000000000000000000000000000")
            );
            const members = await Promise.all(memberPromises);
            const activeMemberCount = members.filter(m => m !== "0x0000000000000000000000000000000000000000").length;

            const update: PotUpdate = {
              contractAddress,
              circleId: i,
              potSize: parseFloat(ethers.formatEther(potSizeRaw)).toFixed(4),
              potSizeRaw: potSizeRaw.toString(),
              currentMembers: activeMemberCount,
              currentRound: Number(current) + 1,
              isActive: true,
              timestamp: Date.now(),
            };

            const normalizedAddress = contractAddress.toLowerCase();
            const historyKey = `${normalizedAddress}:${i}`;
            const currentHistory = this.history.get(historyKey) || [];
            this.history.set(historyKey, [...currentHistory.slice(-(this.MAX_HISTORY - 1)), update]);

            // Room-specific (subscribed clients) - Normalize address to lowercase
            this.io.to(`circle:${normalizedAddress}:${i}`).emit('potUpdate', {
              ...update,
              contractAddress: normalizedAddress
            });

            if (i === 0) console.log(`[Poller] Emitted update for Circle #0 on ${normalizedAddress.slice(0, 10)}... Pot: ${update.potSize}`);
            // Global feed (dashboard overview)
            this.io.emit('feed:potUpdate', {
              ...update,
              contractAddress: normalizedAddress
            });

          } catch (innerErr) {
            console.warn(`[Poller] Failed to poll circle ${i} on ${contractAddress}:`,
              innerErr instanceof Error ? innerErr.message : innerErr);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Placeholder addresses will fail — expected during dev
        console.warn(`[Poller] Skipped ${contractAddress.slice(0, 10)}…: ${msg.slice(0, 60)}`);
      }
    }
    console.log('[Poller] Full poll cycle complete.');
  }
}
