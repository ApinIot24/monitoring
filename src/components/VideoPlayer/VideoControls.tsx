/**
 * Video Control Buttons Component
 */

import React from 'react';

interface VideoControlsProps {
    showVideo: boolean;
    isAutoplay: boolean;
    nextPlayTime?: Date | null;
    onShowCounter: () => void;
    onShowVideo: () => void;
    onToggleAutoplay: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
    showVideo,
    isAutoplay,
    nextPlayTime,
    onShowCounter,
    onShowVideo,
    onToggleAutoplay,
}) => {
    return (
        <>
            {/* Autoplay Indicator */}
            <div className="absolute top-2 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded-md">
                Autoplay:{' '}
                <span className={isAutoplay ? 'text-green-400' : 'text-red-400'}>
                    {isAutoplay ? 'ON' : 'OFF'}
                </span>
                {nextPlayTime && (
                    <div className="text-xs text-gray-300 mt-1">
                        Next video: {nextPlayTime.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Manual Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                <button
                    onClick={onShowCounter}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    Counter
                </button>
                <button
                    onClick={onShowVideo}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    Video
                </button>
                <button
                    onClick={onToggleAutoplay}
                    className="bg-white/20 text-black px-4 py-2 rounded hover:bg-white/40"
                >
                    {isAutoplay ? 'Matikan Autoplay' : 'Nyalakan Autoplay'}
                </button>
            </div>
        </>
    );
};

