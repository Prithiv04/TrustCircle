import { useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { TRUSTCIRCLE_ABI } from '@/contracts/TrustCircle';
import { PRIMARY_CONTRACT_ADDRESS } from '@/config/contracts';
import { parseEther } from 'viem';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3600';

type Addr = `0x${string}`;

export interface CircleData {
    id: number;
    name: string;
    creator: string;
    contributionAmount: string;
    contributionAmountEth: string;
    maxMembers: number;
    currentMembers: number;
    currentRound: number;
    totalRounds: number;
    nextPayoutTime: number;
    isActive: boolean;
    pot: string;
    potEth: string;
    contractAddress: string;
}

// Hook to read total count of circles
export function useCircleCount(contractAddress: string = PRIMARY_CONTRACT_ADDRESS) {
    return useReadContract({
        address: contractAddress as Addr,
        abi: TRUSTCIRCLE_ABI,
        functionName: 'nextCircleId',
        query: {
            refetchInterval: 5_000,
        }
    });
}

// Hook to read a specific circle's data - Synced with backend
export function useCircle(
    circleId: bigint,
    contractAddress: string = PRIMARY_CONTRACT_ADDRESS
) {
    return useQuery({
        queryKey: ['circle', contractAddress, circleId.toString()],
        queryFn: async () => {
            const res = await fetch(`${BACKEND_URL}/api/circles/${contractAddress}/${circleId}`);
            if (!res.ok) throw new Error('Network response was not ok');
            const json = await res.json();
            if (!json.success) throw new Error(json.error?.message || 'Failed to fetch circle');
            return json.data;
        },
        refetchInterval: 5_000,
    });
}

// Hook to create a new circle
export function useCreateCircle() {
    const queryClient = useQueryClient();
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries();
            // Force refresh backend update
            fetch(`${BACKEND_URL}/api/circles?refresh=true`).catch(() => { });
        }
    }, [isSuccess, queryClient]);

    const createCircle = (
        walletAddress: string,
        contractAddress: string = PRIMARY_CONTRACT_ADDRESS
    ) => {
        const members = [
            walletAddress,
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

        writeContract({
            address: contractAddress as Addr,
            abi: TRUSTCIRCLE_ABI,
            functionName: 'createCircle',
            args: [members as any],
        });
    };

    return { createCircle, hash, isPending, isConfirming, isSuccess, error };
}

// Hook to make a contribution
export function useContribute() {
    const queryClient = useQueryClient();
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries();
            fetch(`${BACKEND_URL}/api/circles?refresh=true`).catch(() => { });
        }
    }, [isSuccess, queryClient]);

    const contribute = (
        circleId: bigint,
        amountEth: string,
        contractAddress: string = PRIMARY_CONTRACT_ADDRESS
    ) => {
        writeContract({
            address: contractAddress as Addr,
            abi: TRUSTCIRCLE_ABI,
            functionName: 'contribute',
            args: [circleId],
            value: parseEther(amountEth),
        });
    };

    return { contribute, hash, isPending, isConfirming, isSuccess, error };
}

// Hook to join a circle (legacy alias)
export function useJoinCircle() {
    return useContribute();
}
