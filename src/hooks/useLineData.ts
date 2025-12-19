/**
 * Custom Hook for Line Data Fetching
 * Handles data fetching for production lines with polling
 */

import { useState, useEffect } from 'react';
import { fetchAllLineData } from '../services/api';
import type { PackingData, ShiftData } from '../types';

interface UseLineDataOptions {
    line: string;
    pollingInterval?: number; // in milliseconds
    enabled?: boolean;
}

interface LineData {
    packingData: PackingData;
    shiftData: ShiftData;
    hourlyData: number[];
    currentShift: number | null;
    isLoading: boolean;
    error: string | null;
}

export const useLineData = (options: UseLineDataOptions): LineData => {
    const { line, pollingInterval = 10000, enabled = true } = options;

    const [packingData, setPackingData] = useState<PackingData>({ cntr_carton: 0 });
    const [shiftData, setShiftData] = useState<ShiftData>({ shift1: 0, shift2: 0, shift3: 0 });
    const [hourlyData, setHourlyData] = useState<number[]>([]);
    const [currentShift, setCurrentShift] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const data = await fetchAllLineData(line);
                if (isMounted) {
                    setPackingData(data.packingData);
                    setShiftData(data.shiftData);
                    setHourlyData(data.hourlyData);
                    setCurrentShift(data.currentShift);
                    setError(null);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Gagal memuat data');
                    setIsLoading(false);
                }
            }
        };

        fetchData();
        const interval = setInterval(fetchData, pollingInterval);

        return () => {
            isMounted = false;
            controller.abort();
            clearInterval(interval);
        };
    }, [line, pollingInterval, enabled]);

    return {
        packingData,
        shiftData,
        hourlyData,
        currentShift,
        isLoading,
        error,
    };
};

