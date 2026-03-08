import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { PotUpdate } from '@/hooks/useLiveCircle';
import { formatTCTC } from '@/config/contracts';

interface ContributionChartProps {
    circleId?: number;
    contractAddress?: string;
    liveData?: PotUpdate[];
    isConnected?: boolean;
}

// Generate seed data for visual appeal before live data arrives
const generateSeedData = () =>
    Array.from({ length: 6 }, (_, i) => ({
        round: i + 1,
        potSize: parseFloat((0.1 * (i + 1) + Math.random() * 0.05).toFixed(4)),
        timestamp: Date.now() - (6 - i) * 10_000,
    }));

const ContributionChart: React.FC<ContributionChartProps> = ({
    liveData = [],
    isConnected = false,
}) => {
    // Merge seed data with live data (live data takes precedence once it arrives)
    const seedData = generateSeedData();
    const chartData = liveData.length > 0
        ? liveData.map((d, i) => ({
            round: i + 1,
            potSize: parseFloat(d.potSize),
            timestamp: d.timestamp,
        }))
        : seedData;

    return (
        <motion.div
            className="glass rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-semibold text-white">Live Pot Growth</h3>
                </div>

                {/* Connection status indicator */}
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${isConnected
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                    : 'text-slate-500 bg-slate-700/30 border-slate-600/20'
                    }`}>
                    {isConnected ? (
                        <><Wifi className="w-3 h-3" /><span className="animate-pulse">LIVE</span></>
                    ) : (
                        <><WifiOff className="w-3 h-3" />Offline</>
                    )}
                </div>
            </div>

            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPot" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="round"
                            tickFormatter={(v) => `#${v}`}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(16,185,129,0.2)',
                                borderRadius: '8px',
                                color: '#f8fafc',
                            }}
                            formatter={(value: any) => [`${parseFloat(value).toFixed(4)} tCTC`, 'Pot Size']}
                            labelFormatter={(label) => `Update #${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="potSize"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#colorPot)"
                            isAnimationActive={true}
                            animationDuration={600}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {liveData.length > 0 && (
                <p className="text-xs text-slate-500 text-right mt-2">
                    {liveData.length} updates · Last: {new Date(liveData[liveData.length - 1].timestamp).toLocaleTimeString()}
                </p>
            )}
        </motion.div>
    );
};

export default ContributionChart;
