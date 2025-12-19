/**
 * Example Refactored Index Page
 * This demonstrates how to use the new structure with hooks and services
 * 
 * To use this, rename it to Index.tsx and update imports
 */

import React from 'react';
import ComponentCounter from './ComponentCounter_NEW';
import { useVideoAutoplay } from '../hooks/useVideoAutoplay';
import { VideoPlayer, VideoControls } from '../components/VideoPlayer';
import { VIDEO_PATHS } from '../constants/video';

const Index = () => {
    const lines = ['l1', 'l2'];
    const videos = [VIDEO_PATHS.default];

    // Use custom hook for video autoplay
    const {
        showVideo,
        isAutoplay,
        nextPlayTime,
        handleVideoEnded,
        showCounter,
        showVideoManual,
        toggleAutoplay,
    } = useVideoAutoplay({
        videos,
        autoplayEnabled: false,
        useTimeWindow: true, // Use time window check
        intervalHours: 2,
        checkIntervalMinutes: 1,
    });

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            {/* === COUNTER === */}
            {!showVideo && (
                <div className="flex items-center justify-center flex-wrap xl:flex-nowrap">
                    {lines.map((line) => (
                        <div
                            key={line}
                            className="lg:max-w-[100%] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]
                         rounded border border-white-light dark:border-[#1b2e4b]
                         dark:bg-[#191e3a] dark:shadow-none"
                        >
                            <ComponentCounter line={line} url="/biscuit" label="WFR" />
                        </div>
                    ))}
                </div>
            )}

            {/* === VIDEO === */}
            {showVideo && (
                <VideoPlayer src={videos[0]} onEnded={handleVideoEnded} />
            )}

            {/* === CONTROLS === */}
            <VideoControls
                showVideo={showVideo}
                isAutoplay={isAutoplay}
                nextPlayTime={nextPlayTime}
                onShowCounter={showCounter}
                onShowVideo={showVideoManual}
                onToggleAutoplay={toggleAutoplay}
            />
        </div>
    );
};

export default Index;

