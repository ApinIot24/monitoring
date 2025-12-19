/**
 * Route Configuration
 * Centralized route definitions
 */

import { lazy, type ComponentType } from 'react';

// Lazy load pages
export const Pages = {
    Index: lazy(() => import('../pages/Index')),
    Index2: lazy(() => import('../pages/Index_2')),
    Index3: lazy(() => import('../pages/Index_3')),
    Biscuit: lazy(() => import('../pages/biscuit')),
    Tcw: lazy(() => import('../pages/tcw')),
    MKSL2a: lazy(() => import('../pages/mks_l2a')),
    Tilting: lazy(() => import('../pages/tilting')),
    Malcok2b: lazy(() => import('../pages/malcok')),
} as const;

// Route definitions
export interface RouteConfig {
    path: string;
    component: ComponentType;
    layout: 'default' | 'blank';
    label?: string;
}

export const routeConfigs: RouteConfig[] = [
    {
        path: '/',
        component: Pages.Index,
        layout: 'default',
        label: 'Dashboard',
    },
    {
        path: '/biscuit',
        component: Pages.Biscuit,
        layout: 'default',
        label: 'Biscuit',
    },
    {
        path: '/tcw',
        component: Pages.Tcw,
        layout: 'default',
        label: 'TCW',
    },
    {
        path: '/test',
        component: Pages.Index2,
        layout: 'default',
        label: 'Test 1',
    },
    {
        path: '/test2',
        component: Pages.Index3,
        layout: 'default',
        label: 'Test 2',
    },
    {
        path: '/mks_l2a',
        component: Pages.MKSL2a,
        layout: 'default',
        label: 'MKS L2A',
    },
    {
        path: '/tilting',
        component: Pages.Tilting,
        layout: 'default',
        label: 'Tilting',
    },
    {
        path: '/malcok_2b',
        component: Pages.Malcok2b,
        layout: 'default',
        label: 'Malcok 2B',
    },
];

