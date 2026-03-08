import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Users, Shield, Zap, Globe, Activity } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Magnetic from './Magnetic';
import { useAccount } from 'wagmi';

const stats = [
    { label: 'Unbanked Served', value: '1.4B+', icon: Globe },
    { label: 'Contracts Deployed', value: '4x', icon: Shield },
    { label: 'Zero Gas Fees', value: '$0.00', icon: Zap },
    { label: 'Active Circles', value: '100%', icon: Users },
];

const Hero: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => {
    const { isConnected } = useAccount();
    const { scrollY } = useScroll();

    // Parallax Transforms
    const gridY = useTransform(scrollY, [0, 500], [0, 100]);
    const blur1Y = useTransform(scrollY, [0, 500], [0, -150]);
    const blur2Y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
            {/* Absolute Parallax Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    style={{ y: gridY }}
                    className="absolute inset-0 grid-pattern opacity-[0.04]"
                />
                <motion.div
                    style={{ y: blur1Y }}
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full"
                />
                <motion.div
                    style={{ y: blur2Y }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-teal-600/10 blur-[130px] rounded-full"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-20">
                {/* LIVE Badge */}
                <motion.div
                    className="flex justify-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="glass-card rounded-full px-4 py-1.5 flex items-center gap-2 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                        </div>
                        <span className="text-rose-400 text-xs font-bold tracking-wide">LIVE ON CREDITCOIN TESTNET</span>
                        <div className="h-4 w-[1px] bg-slate-700/50 mx-1" />
                        <Activity className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-semibold">4/4 Nodes Syncing</span>
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-white text-shine">Trustless Savings.</span><br />
                    <span className="gradient-text">Infinite Growth.</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    The ancient ROSCA model brought strictly on-chain. <br className="hidden sm:block" />
                    Built to bank the <span className="text-emerald-400">1.4 billion unbanked</span> with absolute transparency.
                </motion.p>

                {/* CTA */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {isConnected ? (
                        <Magnetic strength={0.3}>
                            <button
                                onClick={onGetStarted}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-full flex items-center gap-3 transition-all shadow-[0_0_40px_#10b98140] hover:shadow-[0_0_60px_#10b98160] relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Launch Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Magnetic>
                    ) : (
                        <div className="p-1 rounded-2xl glass-card inline-block">
                            <ConnectButton label="Connect to Creditcoin" />
                        </div>
                    )}
                </motion.div>

                {/* Floating Stats */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl text-left border-t border-white/10 hover:border-emerald-500/30 transition-colors group">
                            <stat.icon className="w-6 h-6 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
