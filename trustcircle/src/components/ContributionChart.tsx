import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ContributionChartProps {
    circleId?: number;
    data?: { round: number; amount: number; cumulative: number }[];
}

// Generate mock historical data (replace with actual contract event data)
const generateMockData = (rounds = 6) =>
    Array.from({ length: rounds }, (_, i) => ({
        round: i + 1,
        amount: 0.1 + Math.random() * 0.05,
        cumulative: (i + 1) * (0.1 + Math.random() * 0.02),
    }));

const ContributionChart: React.FC<ContributionChartProps> = ({ data }) => {
    const chartData = data?.length ? data : generateMockData();

    return (
        <motion.div
            className="glass rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Contribution History</h3>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis
                            dataKey="round"
                            tickFormatter={(v) => `R${v}`}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#0f172a',
                                border: '1px solid rgba(16,185,129,0.2)',
                                borderRadius: '8px',
                                color: '#f8fafc',
                            }}
                            formatter={(value: number) => [`${value.toFixed(3)} tCTC`]}
                            labelFormatter={(label) => `Round ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#colorCumulative)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ContributionChart;
