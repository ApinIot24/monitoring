/**
 * Time Utility Functions
 */

import { AUTOPLAY_TIME_WINDOWS } from '../constants/video';
import type { ShiftTimeWindow } from '../types';

/**
 * Check if current time is within any autoplay time window
 */
export const isWithinAutoplayWindow = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    return AUTOPLAY_TIME_WINDOWS.some((window) => {
        const { start, end } = window;
        const startMinutes = start.hour * 60 + start.minute;
        const endMinutes = end.hour * 60 + end.minute;
        const currentMinutes = hour * 60 + minute;

        // Handle overnight windows (e.g., 01:00 - 05:00)
        if (startMinutes > endMinutes) {
            return currentMinutes >= startMinutes || currentMinutes < endMinutes;
        }

        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });
};

/**
 * Format time to readable string
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

