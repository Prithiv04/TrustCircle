import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
    onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Dashboard', href: '#dashboard' },
        { label: 'My Circles', href: '#circles' },
        { label: 'How It Works', href: '#how-it-works' },
    ];

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-emerald-500/10"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onNavigate?.('home')}
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center glow">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold gradient-text">TrustCircle</span>
                    </motion.div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Wallet Connect */}
                    <div className="flex items-center gap-3">
                        <ConnectButton
                            showBalance={{ smallScreen: false, largeScreen: true }}
                            chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
                            accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
                        />
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            id="mobile-menu-btn"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <motion.nav
                        className="md:hidden border-t border-emerald-500/10 py-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="block py-2 text-slate-400 hover:text-emerald-400 transition-colors font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.nav>
                )}
            </div>
        </motion.header>
    );
};

export default Header;
