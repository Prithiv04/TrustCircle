import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { TRUSTCIRCLE_ABI } from '@/contracts/TrustCircle';
import { PRIMARY_CONTRACT_ADDRESS } from '@/config/contracts';
import { parseEther } from 'viem';

type Addr = `0x${string}`;

export interface CircleData {
    name: string;
    creator: string;
    contributionAmount: bigint;
    maxMembers: bigint;
    currentMembers: bigint;
    currentRound: bigint;
    totalRounds: bigint;
    nextPayoutTime: bigint;
    isActive: boolean;
}

// Hook to read total count of circles
export function useCircleCount(contractAddress: string = PRIMARY_CONTRACT_ADDRESS) {
    return useReadContract({
        address: contractAddress as Addr,
        abi: TRUSTCIRCLE_ABI,
        functionName: 'getCircleCount',
    });
}

// Hook to read a specific circle's data
export function useCircle(
    circleId: bigint,
    contractAddress: string = PRIMARY_CONTRACT_ADDRESS
) {
    return useReadContract({
        address: contractAddress as Addr,
        abi: TRUSTCIRCLE_ABI,
        functionName: 'getCircle',
        args: [circleId],
    });
}

// Hook to get members of a circle
export function useCircleMembers(
    circleId: bigint,
    contractAddress: string = PRIMARY_CONTRACT_ADDRESS
) {
    return useReadContract({
        address: contractAddress as Addr,
        abi: TRUSTCIRCLE_ABI,
        functionName: 'getMembers',
        args: [circleId],
    });
}

// Hook to create a new circle
export function useCreateCircle() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createCircle = (
        name: string,
        contributionAmountEth: string,
        maxMembers: number,
        roundDurationDays: number,
        contractAddress = PRIMARY_CONTRACT_ADDRESS
    ) => {
        writeContract({
            address: contractAddress as Addr,
            abi: TRUSTCIRCLE_ABI,
            functionName: 'createCircle',
            args: [
                name,
                parseEther(contributionAmountEth),
                BigInt(maxMembers),
                BigInt(roundDurationDays * 86400), // convert days to seconds
            ],
        });
    };

    return { createCircle, hash, isPending, isConfirming, isSuccess, error };
}

// Hook to join a circle
export function useJoinCircle() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const joinCircle = (
        circleId: bigint,
        contributionAmountEth: string,
        contractAddress = PRIMARY_CONTRACT_ADDRESS
    ) => {
        writeContract({
            address: contractAddress as Addr,
            abi: TRUSTCIRCLE_ABI,
            functionName: 'joinCircle',
            args: [circleId],
            value: parseEther(contributionAmountEth),
        });
    };

    return { joinCircle, hash, isPending, isConfirming, isSuccess, error };
}

// Hook to make a contribution
export function useContribute() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const contribute = (
        circleId: bigint,
        amountEth: string,
        contractAddress = PRIMARY_CONTRACT_ADDRESS
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
