import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, RefreshCw, LayoutGrid } from 'lucide-react';
import { useAccount } from 'wagmi';
import ROSCACircleCard, { Circle } from './ROSCACircleCard';
import CreateCircleDialog from './CreateCircleDialog';
import ContributionChart from './ContributionChart';
import { useCircleCount, useCircle } from '@/hooks/useTrustCircle';
import { TRUSTCIRCLE_ADDRESSES } from '@/config/contracts';

// Component to load a single circle
const CircleLoader: React.FC<{
    circleId: bigint;
    contractAddress: string;
    index: number;
    onJoin: (c: Circle) => void;
    onContribute: (c: Circle) => void;
    userAddress?: string;
}> = ({ circleId, contractAddress, index, onJoin, onContribute, userAddress }) => {
    const { data, isLoading } = useCircle(circleId, contractAddress);

    if (isLoading) {
        return (
            <div className="glass rounded-2xl p-5 flex items-center justify-center h-48">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const [name, creator, contributionAmount, maxMembers, currentMembers, currentRound, totalRounds, nextPayoutTime, isActive] = data as [string, string, bigint, bigint, bigint, bigint, bigint, bigint, boolean];

    const circle: Circle = {
        id: Number(circleId),
        name,
        creator,
        contributionAmount,
        maxMembers,
        currentMembers,
        currentRound,
        totalRounds,
        nextPayoutTime,
        isActive,
        contractAddress,
    };

    return (
        <ROSCACircleCard
            circle={circle}
            index={index}
            onJoin={onJoin}
            onContribute={onContribute}
            userAddress={userAddress}
        />
    );
};

// Contract panel that renders circles for a given contract address
const ContractPanel: React.FC<{
    contractAddress: string;
    panelIndex: number;
    onJoin: (c: Circle) => void;
    onContribute: (c: Circle) => void;
    userAddress?: string;
}> = ({ contractAddress, panelIndex, onJoin, onContribute, userAddress }) => {
    const { data: count, isLoading } = useCircleCount(contractAddress);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading circles...
            </div>
        );
    }

    const circleCount = count ? Number(count) : 0;

    if (circleCount === 0) {
        return (
            <div className="glass rounded-2xl p-6 text-center text-slate-500 text-sm">
                No circles yet on this contract. Be the first to create one!
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: circleCount }, (_, i) => (
                <CircleLoader
                    key={i}
                    circleId={BigInt(i)}
                    contractAddress={contractAddress}
                    index={panelIndex * 10 + i}
                    onJoin={onJoin}
                    onContribute={onContribute}
                    userAddress={userAddress}
                />
            ))}
        </div>
    );
};

const Dashboard: React.FC = () => {
    const { address } = useAccount();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const handleJoin = (circle: Circle) => {
        console.log('Join circle:', circle);
        // Could open a join confirmation dialog here
    };

    const handleContribute = (circle: Circle) => {
        console.log('Contribute to circle:', circle);
        // Could open a contribute confirmation dialog here
    };

    return (
        <section id="dashboard" className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 gradient-bg">
            <div className="max-w-7xl mx-auto py-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h2 className="text-3xl font-extrabold text-white flex items-center gap-2">
                            <LayoutGrid className="w-7 h-7 text-emerald-400" /> Dashboard
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">
                            {address
                                ? `Connected: ${address.slice(0, 6)}…${address.slice(-4)}`
                                : 'Connect wallet to interact with circles'}
                        </p>
                    </div>

                    <motion.button
                        id="create-circle-btn"
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl glow text-sm hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4" /> Create Circle
                    </motion.button>
                </motion.div>

                {/* Chart section */}
                <div className="mb-8">
                    <ContributionChart />
                </div>

                {/* Contract tabs */}
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                    {TRUSTCIRCLE_ADDRESSES.map((addr, i) => (
                        <button
                            key={addr}
                            id={`contract-tab-${i}`}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${activeTab === i
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : 'border-slate-700 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400'
                                }`}
                            onClick={() => setActiveTab(i)}
                        >
                            Contract {i + 1}
                            <span className="ml-1 font-mono text-slate-500">
                                {addr.slice(0, 6)}…{addr.slice(-3)}
                            </span>
                        </button>
                    ))}
                    <button
                        id="refresh-circles-btn"
                        className="ml-auto p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                        onClick={() => window.location.reload()}
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Active contract's circles */}
                <ContractPanel
                    contractAddress={TRUSTCIRCLE_ADDRESSES[activeTab]}
                    panelIndex={activeTab}
                    onJoin={handleJoin}
                    onContribute={handleContribute}
                    userAddress={address}
                />
            </div>

            <CreateCircleDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
        </section>
    );
};

export default Dashboard;
