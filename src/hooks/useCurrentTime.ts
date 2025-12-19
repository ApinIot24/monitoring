/**
 * Custom Hook for Current Time
 * Updates time every second
 */

import { useState, useEffect } from 'react';

export const useCurrentTime = (updateInterval: number = 1000): Date => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, updateInterval);

        return () => clearInterval(timer);
    }, [updateInterval]);

    return currentTime;
};

