/**
 * API Service Layer
 * Centralized API calls for data fetching
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../constants/api';
import type { PackingData, ShiftData } from '../types';

import { getCurrentShiftNumber } from '../utils/shift';

/**
 * Get current shift based on time
 */
export const getCurrentShift = (): { shift: number; url: string | null } => {
    const shift = getCurrentShiftNumber();
    return { shift, url: null };
};

/**
 * Get hourly data URL for current shift
 */
export const getHourlyDataUrl = (line: string, shift: number): string | null => {
    if (shift === 0) return null;

    const urlMap: Record<number, (line: string) => string> = {
        1: API_ENDPOINTS.hourly.shift1,
        2: API_ENDPOINTS.hourly.shift2,
        3: API_ENDPOINTS.hourly.shift3,
    };

    const urlFn = urlMap[shift];
    return urlFn ? urlFn(line) : null;
};

/**
 * Fetch packing data for a line
 */
export const fetchPackingData = async (line: string): Promise<PackingData> => {
    const response = await axios.get(API_ENDPOINTS.packing(line));
    return response.data[0] || { cntr_carton: 0 };
};

/**
 * Fetch shift data for a line
 */
export const fetchShiftData = async (line: string): Promise<ShiftData> => {
    const response = await axios.get(API_ENDPOINTS.shift(line));
    return response.data[0] || { shift1: 0, shift2: 0, shift3: 0 };
};

/**
 * Fetch hourly data for a line and shift
 */
export const fetchHourlyData = async (line: string, shift: number): Promise<{ cntr_carton: number }[]> => {
    const url = getHourlyDataUrl(line, shift);
    if (!url) {
        return [];
    }
    const response = await axios.get(url);
    return response.data || [];
};

/**
 * Calculate difference between consecutive hourly data points
 */
export const calculateHourlyDiff = (data: { cntr_carton: number }[]): number[] => {
    return data.map((val, i) => (i === 0 ? val.cntr_carton : val.cntr_carton - data[i - 1].cntr_carton));
};

/**
 * Fetch all data for a line (packing, shift, hourly)
 */
export const fetchAllLineData = async (line: string) => {
    const shiftInfo = getCurrentShift();
    const hourlyUrl = getHourlyDataUrl(line, shiftInfo.shift);

    const [packingData, shiftData, hourlyData] = await Promise.all([
        fetchPackingData(line),
        fetchShiftData(line),
        hourlyUrl ? fetchHourlyData(line, shiftInfo.shift) : Promise.resolve([]),
    ]);

    return {
        packingData,
        shiftData,
        hourlyData: calculateHourlyDiff(hourlyData),
        currentShift: shiftInfo.shift,
    };
};

