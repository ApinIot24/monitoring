/**
 * API Configuration
 * Centralized API base URL and endpoints
 */

export const API_BASE_URL = 'http://10.37.12.34:3000';

export const API_ENDPOINTS = {
    packing: (line: string) => `${API_BASE_URL}/packing_${line}`,
    shift: (line: string) => `${API_BASE_URL}/shift_${line}`,
    hourly: {
        shift1: (line: string) => `${API_BASE_URL}/shift1_${line}_hourly`,
        shift2: (line: string) => `${API_BASE_URL}/shift2_${line}_hourly`,
        shift3: (line: string) => `${API_BASE_URL}/shift3_${line}_hourly`,
    },
    // Special endpoints for tilting
    tilting: {
        packing: (line: string) => `${API_BASE_URL}/tilting_${line}`,
        variance: (line: string) => `${API_BASE_URL}/tilting_${line}_variance`,
        variancePerShift: (line: string) => `${API_BASE_URL}/tilting_${line}_variance_per_shift`,
        hourly: {
            shift1: (line: string) => `${API_BASE_URL}/shift1_${line}_tilting_hourly`,
            shift2: (line: string) => `${API_BASE_URL}/shift2_${line}_tilting_hourly`,
            shift3: (line: string) => `${API_BASE_URL}/shift3_${line}_tilting_hourly`,
        },
    },
} as const;

