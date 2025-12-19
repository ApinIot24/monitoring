/**
 * Reusable Video Player Component
 */

import React from 'react';

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    onEnded?: () => void;
    className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    autoPlay = true,
    onEnded,
    className = 'absolute inset-0 w-full h-full object-cover',
}) => {
    return (
        <video
            src={src}
            autoPlay={autoPlay}
            className={className}
            onEnded={onEnded}
        />
    );
};

