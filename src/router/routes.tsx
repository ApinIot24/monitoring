import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Index2 = lazy(() => import('../pages/Index_2'));

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/test',
        element: <Index2 />,
        layout: 'default',
    }
];

export { routes };
