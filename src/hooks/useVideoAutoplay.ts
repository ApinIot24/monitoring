/**
 * Custom Hook for Video Autoplay
 * Handles video autoplay logic with configurable intervals
 */

import { useState, useEffect, useRef } from 'react';
import { AUTOPLAY_INTERVALS } from '../constants/video';
import { isWithinAutoplayWindow } from '../utils/time';
import type { VideoAutoplayConfig } from '../types';

interface UseVideoAutoplayOptions {
    videos?: string[];
    autoplayEnabled?: boolean;
    intervalHours?: number;
    checkIntervalMinutes?: number;
    useTimeWindow?: boolean;
}

export const useVideoAutoplay = (options: UseVideoAutoplayOptions = {}) => {
    const {
        videos = [],
        autoplayEnabled = false,
        intervalHours = 2,
        checkIntervalMinutes = 1,
        useTimeWindow = false,
    } = options;

    const [showVideo, setShowVideo] = useState(false);
    const [isAutoplay, setIsAutoplay] = useState(autoplayEnabled);
    const nextPlayTime = useRef<Date | null>(null);

    // Schedule next video play time
    const scheduleNextPlay = () => {
        const now = new Date();
        const next = new Date(now.getTime() + intervalHours * 60 * 60 * 1000);
        nextPlayTime.current = next;
    };

    // Check if autoplay should be active based on time window
    useEffect(() => {
        if (useTimeWindow) {
            setIsAutoplay(isWithinAutoplayWindow());
        }
    }, [useTimeWindow]);

    // Handle autoplay interval
    useEffect(() => {
        if (!isAutoplay) return;

        // Initialize schedule on mount
        if (!nextPlayTime.current) {
            scheduleNextPlay();
        }

        const interval = setInterval(() => {
            const now = new Date();

            // Check if it's time to play video
            if (nextPlayTime.current && now >= nextPlayTime.current) {
                setShowVideo(true);
            }
        }, checkIntervalMinutes * 60 * 1000);

        return () => clearInterval(interval);
    }, [isAutoplay, intervalHours, checkIntervalMinutes]);

    // Handle video ended
    const handleVideoEnded = () => {
        setShowVideo(false);
        scheduleNextPlay();
    };

    // Manual controls
    const showCounter = () => setShowVideo(false);
    const showVideoManual = () => setShowVideo(true);
    const toggleAutoplay = () => setIsAutoplay((prev) => !prev);

    return {
        showVideo,
        isAutoplay,
        nextPlayTime: nextPlayTime.current,
        handleVideoEnded,
        showCounter,
        showVideoManual,
        toggleAutoplay,
    };
};

