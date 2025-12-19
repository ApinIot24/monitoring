/**
 * Routes Configuration
 * Uses centralized route config from config/routes.ts
 */

import React from 'react';
import { routeConfigs } from '../config/routes';

// Convert route configs to React Router format
export const routes = routeConfigs.map((route) => {
    const Component = route.component;
    return {
        path: route.path,
        element: <Component />,
        layout: route.layout,
    };
});
