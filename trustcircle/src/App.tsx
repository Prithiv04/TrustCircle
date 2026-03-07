import React, { useRef } from 'react';
import { useAccount } from 'wagmi';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';

const App: React.FC = () => {
    const { isConnected } = useAccount();
    const dashboardRef = useRef<HTMLDivElement>(null);

    const scrollToDashboard = () => {
        dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#020617]">
            <Header onNavigate={(section) => {
                if (section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
                if (section === 'dashboard') scrollToDashboard();
            }} />

            <main>
                <Hero onGetStarted={scrollToDashboard} />

                {isConnected && (
                    <div ref={dashboardRef}>
                        <Dashboard />
                    </div>
                )}

                {!isConnected && (
                    <section id="how-it-works" className="py-24 px-4 max-w-6xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
                            How <span className="gradient-text">TrustCircle</span> Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { step: '01', title: 'Create a Circle', desc: 'Set contribution amount, member count, and round duration. Your ROSCA is deployed on Creditcoin blockchain.', icon: '🔵' },
                                { step: '02', title: 'Members Join', desc: 'Invite friends or family. Each member stakes their first contribution to enter the circle.', icon: '🤝' },
                                { step: '03', title: 'Rotate Payouts', desc: 'Each round, one member receives the entire pool. Trustless rotation continues until everyone is paid.', icon: '💸' },
                            ].map((item) => (
                                <div key={item.step} className="glass rounded-2xl p-6 card-hover">
                                    <div className="text-3xl mb-4">{item.icon}</div>
                                    <div className="text-xs text-emerald-400 font-bold mb-2">STEP {item.step}</div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800">
                TrustCircle © 2025 · Built on Creditcoin Testnet ·
                <span className="text-emerald-600"> Production-grade ROSCA dApp</span>
            </footer>
        </div>
    );
};

export default App;
