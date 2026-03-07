import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import { useCreateCircle } from '@/hooks/useTrustCircle';

interface CreateCircleDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCircleDialog: React.FC<CreateCircleDialogProps> = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        contributionAmount: '0.1',
        maxMembers: '5',
        roundDurationDays: '7',
    });

    const { createCircle, isPending, isConfirming, isSuccess, error } = useCreateCircle();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createCircle(
            form.name,
            form.contributionAmount,
            parseInt(form.maxMembers),
            parseInt(form.roundDurationDays)
        );
    };

    const handleChange = (key: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const inputClass =
        'w-full bg-slate-800/50 border border-slate-700 focus:border-emerald-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-slate-500';
    const labelClass = 'block text-xs text-slate-400 font-medium mb-1.5';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* Dialog */}
                    <motion.div
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[450px] z-50"
                        initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
                        animate={{ opacity: 1, scale: 1, y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
                    >
                        <div className="glass rounded-2xl p-6 shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white">Create New Circle</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Start a ROSCA savings group</p>
                                </div>
                                <button
                                    id="close-dialog-btn"
                                    className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                                    onClick={onClose}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Success state */}
                            {isSuccess ? (
                                <div className="text-center py-8">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <p className="text-emerald-400 font-bold text-lg">Circle Created!</p>
                                    <p className="text-slate-400 text-sm mt-2">Your ROSCA circle is live on Creditcoin</p>
                                    <button
                                        className="mt-6 px-6 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium text-sm"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Circle Name</label>
                                        <input
                                            id="circle-name-input"
                                            type="text"
                                            required
                                            placeholder="e.g. Family Savings Group"
                                            className={inputClass}
                                            value={form.name}
                                            onChange={handleChange('name')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Contribution (tCTC)</label>
                                            <input
                                                id="contribution-amount-input"
                                                type="number"
                                                step="0.01"
                                                min="0.001"
                                                required
                                                className={inputClass}
                                                value={form.contributionAmount}
                                                onChange={handleChange('contributionAmount')}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Max Members</label>
                                            <input
                                                id="max-members-input"
                                                type="number"
                                                min="2"
                                                max="20"
                                                required
                                                className={inputClass}
                                                value={form.maxMembers}
                                                onChange={handleChange('maxMembers')}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Round Duration (Days)</label>
                                        <input
                                            id="round-duration-input"
                                            type="number"
                                            min="1"
                                            max="90"
                                            required
                                            className={inputClass}
                                            value={form.roundDurationDays}
                                            onChange={handleChange('roundDurationDays')}
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-slate-800/30 rounded-xl p-3 text-xs text-slate-400 space-y-1">
                                        <p>💰 Total pool: <span className="text-white font-medium">
                                            {(parseFloat(form.contributionAmount || '0') * parseInt(form.maxMembers || '0')).toFixed(3)} tCTC
                                        </span></p>
                                        <p>👥 Each of {form.maxMembers || 0} members receives the pool once over {form.maxMembers || 0} rounds.</p>
                                        <p>📅 Full cycle: <span className="text-white font-medium">
                                            {(parseInt(form.roundDurationDays || '0') * parseInt(form.maxMembers || '0'))} days
                                        </span></p>
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                                            {error.message?.split('\n')[0]}
                                        </p>
                                    )}

                                    <motion.button
                                        id="create-circle-submit-btn"
                                        type="submit"
                                        disabled={isPending || isConfirming}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl disabled:opacity-60 text-sm hover:opacity-90 transition-opacity"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isPending || isConfirming ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {isConfirming ? 'Confirming…' : 'Creating…'}
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4" /> Create Circle
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CreateCircleDialog;
