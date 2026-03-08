import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3600';

export interface PotUpdate {
    contractAddress: string;
    circleId: number;
    potSize: string;
    potSizeRaw: string;
    currentMembers: number;
    currentRound: number;
    isActive: boolean;
    timestamp: number;
}

interface UseLiveCircleReturn {
    liveData: PotUpdate[];
    currentPot: string;
    currentMembers: number;
    isConnected: boolean;
    lastUpdated: number | null;
}

const MAX_POINTS = 50;

export function useLiveCircle(
    circleId: number,
    contractAddress: string
): UseLiveCircleReturn {
    const [liveData, setLiveData] = useState<PotUpdate[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!contractAddress || contractAddress.startsWith('0x000000000000')) {
            // Skip placeholder addresses during dev
            return;
        }

        const socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });
        socketRef.current = socket;

        // Fetch initial history
        fetch(`${BACKEND_URL}/api/circles/${contractAddress}/${circleId}/history`)
            .then(res => res.json())
            .then(json => {
                if (json.success && Array.isArray(json.data)) {
                    setLiveData(json.data);
                }
            })
            .catch(err => console.error('[useLiveCircle] History fetch failed:', err));

        socket.on('connect', () => {
            setIsConnected(true);
            const roomKey = `${contractAddress.toLowerCase()}:${circleId}`;
            socket.emit('subscribe:circle', roomKey);
        });

        socket.on('disconnect', () => setIsConnected(false));

        socket.on('potUpdate', (data: PotUpdate) => {
            const normalizedDataAddr = data.contractAddress.toLowerCase();
            const normalizedTargetAddr = contractAddress.toLowerCase();

            if (data.circleId === circleId && normalizedDataAddr === normalizedTargetAddr) {
                setLiveData((prev) => [...prev.slice(-(MAX_POINTS - 1)), data]);
            }
        });

        return () => {
            socket.emit('unsubscribe:circle', `${contractAddress}:${circleId}`);
            socket.disconnect();
            setIsConnected(false);
        };
    }, [circleId, contractAddress]);

    const latest = liveData[liveData.length - 1];

    return {
        liveData,
        currentPot: latest?.potSize ?? '0.0000',
        currentMembers: latest?.currentMembers ?? 0,
        isConnected,
        lastUpdated: latest?.timestamp ?? null,
    };
}
