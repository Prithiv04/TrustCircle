import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { formatEther } from 'viem';
import CountdownTimer from './CountdownTimer';

export interface Circle {
    id: number;
    name: string;
    creator: string;
    contributionAmount: bigint;
    maxMembers: bigint;
    currentMembers: bigint;
    currentRound: bigint;
    totalRounds: bigint;
    nextPayoutTime: bigint;
    isActive: boolean;
    contractAddress?: string;
}

interface ROSCACircleCardProps {
    circle: Circle;
    index?: number;
    onJoin?: (circle: Circle) => void;
    onContribute?: (circle: Circle) => void;
    userAddress?: string;
}

const ROSCACircleCard: React.FC<ROSCACircleCardProps> = ({
    circle,
    index = 0,
    onJoin,
    onContribute,
    userAddress,
}) => {
    const progressPct =
        circle.totalRounds > 0n
            ? Number((circle.currentRound * 100n) / circle.totalRounds)
            : 0;

    const memberPct =
        circle.maxMembers > 0n
            ? Number((circle.currentMembers * 100n) / circle.maxMembers)
            : 0;

    const isCreator =
        userAddress && circle.creator.toLowerCase() === userAddress.toLowerCase();

    const isFull = circle.currentMembers >= circle.maxMembers;

    const shortAddr = (addr: string) =>
        addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

    return (
        <motion.div
            className="glass rounded-2xl p-5 card-hover flex flex-col gap-4 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
        >
            {/* Active badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
                {circle.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-400/10 border border-slate-400/20 px-2 py-0.5 rounded-full font-medium">
                        Completed
                    </span>
                )}
            </div>

            {/* Top: Name & Creator */}
            <div>
                <h3 className="text-lg font-bold text-white pr-16">{circle.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                    by{' '}
                    <span className="text-emerald-400/80 font-mono">
                        {shortAddr(circle.creator)}{isCreator ? ' (You)' : ''}
                    </span>
                </p>
            </div>

            {/* Contribution amount */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-slate-400">Per Round</p>
                    <p className="text-2xl font-extrabold gradient-text">
                        {parseFloat(formatEther(circle.contributionAmount)).toFixed(3)}{' '}
                        <span className="text-sm font-semibold text-slate-400">tCTC</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Round</p>
                    <p className="text-2xl font-extrabold text-white">
                        {circle.currentRound.toString()}/{circle.totalRounds.toString()}
                    </p>
                </div>
            </div>

            {/* Round progress bar */}
            <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Progress</span>
                    <span>{progressPct}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPct}%` }}
                        transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
                    />
                </div>
            </div>

            {/* Members */}
            <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Members</span>
                    <span>{circle.currentMembers.toString()}/{circle.maxMembers.toString()}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${memberPct}%` }}
                        transition={{ duration: 0.8, delay: index * 0.08 + 0.4 }}
                    />
                </div>
            </div>

            {/* Next Payout Countdown */}
            {circle.isActive && circle.nextPayoutTime > 0n && (
                <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-400">Next Payout</p>
                        <CountdownTimer
                            targetTimestamp={Number(circle.nextPayoutTime)}
                            className="text-sm font-bold text-white"
                        />
                    </div>
                </div>
            )}

            {/* Contract address */}
            {circle.contractAddress && (
                <p className="text-xs text-slate-600 font-mono text-center truncate">
                    {shortAddr(circle.contractAddress)}
                </p>
            )}

            {/* Action buttons */}
            {circle.isActive && (
                <div className="grid grid-cols-2 gap-2 mt-auto">
                    {!isFull && (
                        <motion.button
                            id={`join-circle-${circle.id}`}
                            className="flex items-center justify-center gap-1 py-2 text-sm font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onJoin?.(circle)}
                        >
                            Join <ArrowRight className="w-3 h-3" />
                        </motion.button>
                    )}
                    <motion.button
                        id={`contribute-circle-${circle.id}`}
                        className={`flex items-center justify-center gap-1 py-2 text-sm font-semibold bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-xl transition-colors ${isFull ? 'col-span-2' : ''}`}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onContribute?.(circle)}
                    >
                        <CheckCircle className="w-3 h-3" /> Contribute
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
};

export default ROSCACircleCard;
