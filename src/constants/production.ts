/**
 * Production Constants
 * Target carton values for each production line
 */

export const TOTAL_CARTON = {
    l1: 1016,
    l2: 1016,
    l5: 6640,
    l6: 2432,
    l7: 2432,
} as const;

export const TOTAL_CARTON_SABTU = {
    l1: 630,
    l2: 630,
    l5: 4150,
    l6: 1330,
    l7: 1330,
} as const;

export type ProductionLine = keyof typeof TOTAL_CARTON;

/**
 * Get target carton for a line based on current day
 */
export const getTargetCarton = (line: ProductionLine): number => {
    const currentDay = new Date().getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    if (currentDay === 6) {
        return TOTAL_CARTON_SABTU[line] || 1000;
    }
    return TOTAL_CARTON[line] || 1000;
};

