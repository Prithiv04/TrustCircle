import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Shield, Zap, Globe } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const stats = [
    { label: 'Unbanked Served', value: '1.4B+', icon: Globe },
    { label: 'Contract Deployments', value: '4x', icon: Shield },
    { label: 'Zero Gas Fees', value: '$0.00', icon: Zap },
    { label: 'Active Circles', value: '100%', icon: Users },
];

const Hero: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => {
    const { isConnected } = useAccount();

    return (
        <section className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                {/* Tagline badge */}
                <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Shield className="w-4 h-4" />
                    Built on Creditcoin Testnet · Powered by Web3
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    <span className="text-white">Save Together,</span>
                    <br />
                    <span className="gradient-text">Grow Together</span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    TrustCircle brings the ancient ROSCA savings model on-chain — transparent, trustless, and accessible to{' '}
                    <span className="text-emerald-400 font-semibold">1.4 billion unbanked people</span> worldwide.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                >
                    {isConnected ? (
                        <motion.button
                            id="get-started-btn"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl glow hover:opacity-90 transition-opacity text-lg"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onGetStarted}
                        >
                            Open Dashboard <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <ConnectButton label="Connect Wallet to Start" />
                            <p className="text-slate-500 text-sm">Connect your wallet to join or create circles</p>
                        </div>
                    )}
                </motion.div>

                {/* Stats row */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                className="glass rounded-2xl p-4 card-hover"
                                whileHover={{ scale: 1.03 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                            >
                                <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                                <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
                                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
