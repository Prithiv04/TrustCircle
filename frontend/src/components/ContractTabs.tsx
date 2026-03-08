import React from 'react';
import { motion } from 'framer-motion';

interface ContractTabsProps {
    addresses: readonly string[];
    activeTab: number;
    onChange: (index: number) => void;
}

const ContractTabs: React.FC<ContractTabsProps> = ({ addresses, activeTab, onChange }) => {
    return (
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 pt-1 w-full">
            {addresses.slice(0, 1).map((addr, i) => {
                const isActive = activeTab === i;
                return (
                    <button
                        key={addr}
                        onClick={() => onChange(i)}
                        className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden
                            ${isActive
                                ? 'text-emerald-400'
                                : 'text-slate-400 hover:text-white glass-card hover:border-slate-600'
                            }`}
                    >
                        {/* Active State Glassmorphism Background */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabBackground"
                                className="absolute inset-0 glass-card-active rounded-2xl -z-10"
                                initial={false}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}

                        <div className="flex items-center gap-2 relative z-10">
                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
                            )}
                            Primary Demo Contract
                            <span className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                                {addr.slice(0, 6)}…{addr.slice(-4)}
                            </span>
                        </div>
                    </button>
                );
            })}

            {/* Multi-circle V2 Placeholder */}
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-slate-900/40 border border-white/5 cursor-not-allowed">
                <span>Multi-circle v2</span>
                <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded italic">Coming Soon</span>
            </div>
        </div>
    );
};

export default ContractTabs;
