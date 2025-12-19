/**
 * Video Configuration
 */

export const VIDEO_PATHS = {
    default: '/videos/R2_fixed.mp4',
} as const;

/**
 * Video autoplay time windows
 */
export const AUTOPLAY_TIME_WINDOWS = [
    { start: { hour: 10, minute: 0 }, end: { hour: 13, minute: 0 } }, // 10:00 - 13:00
    { start: { hour: 17, minute: 20 }, end: { hour: 21, minute: 0 } }, // 17:20 - 21:00
    { start: { hour: 1, minute: 0 }, end: { hour: 5, minute: 0 } }, // 01:00 - 05:00
] as const;

/**
 * Video autoplay interval (in milliseconds)
 */
export const AUTOPLAY_INTERVALS = {
    default: 120 * 60 * 1000, // 2 hours
    checkInterval: 1 * 60 * 1000, // 1 minute (check interval)
} as const;

