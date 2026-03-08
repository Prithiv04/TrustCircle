import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
    targetTimestamp: number; // Unix timestamp in seconds
    className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetTimestamp, className = '' }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTime = () => {
            const now = Math.floor(Date.now() / 1000);
            const diff = targetTimestamp - now;

            if (diff <= 0) {
                setTimeLeft('Payout Now! 🎉');
                return;
            }

            const days = Math.floor(diff / 86400);
            const hours = Math.floor((diff % 86400) / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
            } else {
                setTimeLeft(
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                );
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetTimestamp]);

    return <span className={className}>{timeLeft}</span>;
};

export default CountdownTimer;
