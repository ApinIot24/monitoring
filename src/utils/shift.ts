/**
 * Shift Utility Functions
 */

/**
 * Get current shift number based on time
 * Returns 1, 2, or 3, or 0 for non-working hours
 */
export const getCurrentShiftNumber = (): number => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

    // Logika shift untuk Senin-Jumat
    if (day >= 1 && day <= 5) {
        if ((hours === 6 && minutes >= 46) || (hours > 6 && hours < 14) || (hours === 14 && minutes <= 45)) {
            return 1;
        } else if ((hours === 14 && minutes >= 46) || (hours > 14 && hours < 22) || (hours === 22 && minutes <= 45)) {
            return 2;
        } else {
            return 3;
        }
    }
    // Logika shift untuk Sabtu
    else if (day === 6) {
        if ((hours === 6 && minutes >= 46) || (hours > 6 && hours < 14) || (hours === 14 && minutes <= 45)) {
            return 1;
        } else if ((hours === 14 && minutes >= 46) || (hours > 14 && hours < 22) || (hours === 22 && minutes <= 45)) {
            return 2;
        } else {
            return 3;
        }
    }
    // Minggu atau hari libur
    return 0;
};

/**
 * Check if current time is within a shift window
 */
export const isWithinShiftWindow = (): boolean => {
    return getCurrentShiftNumber() > 0;
};

