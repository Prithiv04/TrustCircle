import React from 'react';
import { motion, motionValue, useMotionTemplate } from 'framer-motion';
import { Users, Clock, TrendingUp, ArrowRight, CheckCircle, Radio } from 'lucide-react';
import { formatEther } from 'viem';
import CountdownTimer from './CountdownTimer';
import { useLiveCircle } from '@/hooks/useLiveCircle';

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
    pot?: string; // Mock data fallback
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
    // Live WebSocket data
    const { currentPot: livePot, isConnected: socketConnected, lastUpdated } = useLiveCircle(
        circle.id,
        circle.contractAddress ?? ''
    );

    const isConnected = socketConnected || !!circle.pot;
    const currentPot = circle.pot || livePot;

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

    const mouseX = motionValue(0);
    const mouseY = motionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const shortAddr = (addr: string) =>
        addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';

    return (
        <motion.div
            className="glass-card rounded-3xl p-6 flex flex-col gap-5 relative overflow-hidden group/card"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5 }}
        >
            {/* Reactive Spotlight Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-0"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            450px circle at ${mouseX}px ${mouseY}px,
                            rgba(16, 185, 129, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div className="relative z-10 flex flex-col gap-5">
                {/* Status badges */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {/* Live indicator */}
                    {isConnected && (
                        <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 px-2 py-0.5 rounded-full font-medium">
                            <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                        </span>
                    )}
                    {/* Active/Completed badge */}
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

                {/* Name & Creator */}
                <div>
                    <h3 className="text-lg font-bold text-white pr-24">{circle.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        by{' '}
                        <span className="text-emerald-400/80 font-mono">
                            {shortAddr(circle.creator)}{isCreator ? ' (You)' : ''}
                        </span>
                    </p>
                </div>

                {/* Live Pot Counter */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 mb-0.5">
                            {isConnected ? '🔴 Live Pot' : 'Contribution / Round'}
                        </p>
                        {isConnected ? (
                            /* Animate whenever currentPot changes */
                            <motion.div
                                key={currentPot}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="text-2xl font-extrabold gradient-text"
                            >
                                {currentPot}{' '}
                                <span className="text-sm font-semibold text-slate-400">tCTC ↗</span>
                            </motion.div>
                        ) : (
                            <p className="text-2xl font-extrabold gradient-text">
                                {parseFloat(formatEther(circle.contributionAmount)).toFixed(3)}{' '}
                                <span className="text-sm font-semibold text-slate-400">tCTC</span>
                            </p>
                        )}
                        {lastUpdated && (
                            <p className="text-[10px] text-slate-600 mt-0.5">
                                Updated {new Date(lastUpdated).toLocaleTimeString()}
                            </p>
                        )}
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
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative z-10"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
                        />
                        {/* Animated Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[50%] skew-x-[-20deg] z-20"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    </div>
                </div>

                {/* Members progress bar */}
                <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Members</span>
                        <span>{circle.currentMembers.toString()}/{circle.maxMembers.toString()}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full relative z-10"
                            initial={{ width: 0 }}
                            animate={{ width: `${memberPct}%` }}
                            transition={{ duration: 0.8, delay: index * 0.08 + 0.4 }}
                        />
                        {/* Animated Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[50%] skew-x-[-20deg] z-20"
                            animate={{ left: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
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
            </div>
        </motion.div>
    );
};

export default ROSCACircleCard;
