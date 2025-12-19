/**
 * TypeScript Type Definitions
 */

export interface PackingData {
    cntr_carton: number;
}

export interface ShiftData {
    shift1: number;
    shift2: number;
    shift3: number;
}

export interface ComponentCounterProps {
    line: string;
    url: string;
    label: string;
    nameOpsi?: string | null;
}

export interface VideoAutoplayConfig {
    videos: string[];
    autoplayEnabled?: boolean;
    intervalHours?: number;
    checkIntervalMinutes?: number;
}

export interface ShiftTimeWindow {
    start: { hour: number; minute: number };
    end: { hour: number; minute: number };
}

