import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, LayoutGrid } from 'lucide-react';
import { useAccount } from 'wagmi';
import ROSCACircleCard, { Circle } from './ROSCACircleCard';
import CreateCircleDialog from './CreateCircleDialog';
import ContributionChart from './ContributionChart';
import { useCircleCount, useCircle } from '@/hooks/useTrustCircle';
import { useLiveCircle } from '@/hooks/useLiveCircle';
import { TRUSTCIRCLE_ADDRESSES } from '@/config/contracts';
import ContractTabs from './ContractTabs';
import Magnetic from './Magnetic';
import { useQueryClient } from '@tanstack/react-query';
import { presetCircles } from '@/data/presetCircles';

const USE_PRESET_DATA = true; // High-performance demo data

// Premium Skeleton Component
const SkeletonCard = () => (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 overflow-hidden relative">
        <div className="flex justify-between items-start">
            <div className="w-24 h-6 rounded-lg skeleton-shimmer" />
            <div className="w-16 h-4 rounded-full skeleton-shimmer" />
        </div>
        <div className="space-y-2">
            <div className="w-full h-8 rounded-xl skeleton-shimmer" />
            <div className="w-2/3 h-4 rounded-lg skeleton-shimmer opacity-50" />
        </div>
        <div className="pt-4 space-y-3">
            <div className="flex justify-between text-xs">
                <div className="w-12 h-3 rounded skeleton-shimmer" />
                <div className="w-12 h-3 rounded skeleton-shimmer" />
            </div>
            <div className="w-full h-2 rounded-full skeleton-shimmer" />
        </div>
        <div className="pt-4 flex gap-2">
            <div className="flex-1 h-10 rounded-xl skeleton-shimmer" />
            <div className="flex-1 h-10 rounded-xl skeleton-shimmer" />
        </div>
    </div>
);

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
        return <SkeletonCard />;
    }

    if (!data) return null;

    try {
        // Handle both array and object returns from wagmi/viem for max compatibility
        const d = data as any;
        const circle: Circle = {
            id: Number(circleId),
            name: d.name ?? d[0],
            creator: d.creator ?? d[1],
            contributionAmount: d.contributionAmount ?? d[2],
            maxMembers: d.maxMembers ?? d[3],
            currentMembers: d.currentMembers ?? d[4],
            currentRound: d.currentRound ?? d[5],
            totalRounds: d.totalRounds ?? d[6],
            nextPayoutTime: d.nextPayoutTime ?? d[7],
            isActive: d.isActive ?? d[8],
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
    } catch (err) {
        console.error(`[CircleLoader] Data Parsing Error (ID: ${circleId}):`, err);
        return null;
    }
};

// Contract panel that renders circles for a given contract address
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const ContractPanel: React.FC<{
    contractAddress: string;
    panelIndex: number;
    onJoin: (c: Circle) => void;
    onContribute: (c: Circle) => void;
    userAddress?: string;
}> = ({ contractAddress, panelIndex, onJoin, onContribute, userAddress }) => {
    const { data: count, isLoading } = useCircleCount(contractAddress);

    if (USE_PRESET_DATA) {
        return (
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {presetCircles.map((circle, i) => (
                    <ROSCACircleCard
                        key={circle.id}
                        circle={{
                            ...circle,
                            contributionAmount: BigInt(parseFloat(circle.contributionAmount) * 1e18),
                            maxMembers: BigInt(circle.maxMembers),
                            currentMembers: BigInt(circle.currentMembers),
                            currentRound: 1n,
                            totalRounds: 10n,
                            nextPayoutTime: 0n,
                            isActive: true,
                            contractAddress: contractAddress,
                        } as any}
                        index={i}
                        onJoin={onJoin}
                        onContribute={onContribute}
                        userAddress={userAddress}
                    />
                ))}
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
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
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
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
        </motion.div>
    );
};

const Dashboard: React.FC = () => {
    const { address, isConnected: isWalletConnected } = useAccount();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Debug account status
    React.useEffect(() => {
        console.log(`[Dashboard] Wallet: ${address} | Connected: ${isWalletConnected}`);
    }, [address, isWalletConnected]);

    const handleForceRefresh = async () => {
        console.log('[Dashboard] Purging all caches...');
        await queryClient.resetQueries();
        await queryClient.refetchQueries();
        console.log('[Dashboard] Global refresh complete.');
    };

    // Subscribe to live data for the first circle of the active contract
    const { liveData: actualLiveData, isConnected: socketConnected } = useLiveCircle(0, TRUSTCIRCLE_ADDRESSES[activeTab]);

    const demoLiveData = [
        { contractAddress: TRUSTCIRCLE_ADDRESSES[activeTab], circleId: 0, potSize: "0.0100", potSizeRaw: "10000000000000000", currentMembers: 3, currentRound: 1, isActive: true, timestamp: Date.now() - 30000 },
        { contractAddress: TRUSTCIRCLE_ADDRESSES[activeTab], circleId: 0, potSize: "0.0300", potSizeRaw: "30000000000000000", currentMembers: 3, currentRound: 1, isActive: true, timestamp: Date.now() - 20000 },
        { contractAddress: TRUSTCIRCLE_ADDRESSES[activeTab], circleId: 0, potSize: "0.0700", potSizeRaw: "70000000000000000", currentMembers: 3, currentRound: 1, isActive: true, timestamp: Date.now() - 10000 },
    ];

    const liveData = USE_PRESET_DATA ? demoLiveData : actualLiveData;
    const isConnected = USE_PRESET_DATA ? true : socketConnected;

    const handleJoin = (circle: Circle) => {
        console.log('Join circle:', circle);
    };

    const handleContribute = (circle: Circle) => {
        console.log('Contribute to circle:', circle);
    };

    return (
        <section id="dashboard" className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 gradient-bg">
            {/* Real-time sync feedback */}
            <div className="fixed bottom-4 right-4 z-[100]">
                {isConnected ? (
                    <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] text-emerald-400 font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE SYNC ACTIVE
                    </div>
                ) : (
                    <div className="bg-slate-800/80 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full text-[10px] text-slate-500 font-bold flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        OFFLINE
                    </div>
                )}
            </div>
            <div className="max-w-7xl mx-auto py-10">
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
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

                    <Magnetic strength={0.4}>
                        <motion.button
                            id="create-circle-btn"
                            className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-[0_0_30px_#10b98140] text-sm hover:opacity-95 transition-opacity relative overflow-hidden group"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            Create Circle
                        </motion.button>
                    </Magnetic>
                </motion.div>

                {/* Chart section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <ContributionChart liveData={liveData} isConnected={isConnected} />
                </motion.div>

                {/* Contract tabs */}
                <div className="mb-4 flex items-center gap-2">
                    <ContractTabs
                        addresses={TRUSTCIRCLE_ADDRESSES}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    <button
                        id="refresh-circles-btn"
                        className="ml-auto flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/20"
                        onClick={handleForceRefresh}
                        title="Force Refresh Data"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Force Refresh</span>
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
                contractAddress={TRUSTCIRCLE_ADDRESSES[activeTab]}
            />
        </section>
    );
};

export default Dashboard;
