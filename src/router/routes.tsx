import { lazy } from 'react';
const Index = lazy(() => import('../pages/Index'));
const Biscuit = lazy(() => import('../pages/biscuit'));
const Tcw = lazy(() => import('../pages/tcw'));
const Index2 = lazy(() => import('../pages/Index_2'));
const Index3 = lazy(() => import('../pages/Index_3'));
const MKSL2a = lazy(() => import('../pages/mks_l2a'));
const TilTing = lazy(() => import('../pages/tilting'));
const CAW = lazy(() => import('../pages/adm_5r'))

const routes = [
    // dashboard
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/biscuit',
        element: <Biscuit />,
        layout: 'default',
    },
    {
        path: '/tcw',
        element: <Tcw />,
        layout: 'default',
    },
    {
        path: '/test',
        element: <Index2 />,
        layout: 'default',
    },
    {
        path: '/test2',
        element: <Index3 />,
        layout: 'default',
    },
    {
         path: '/mks_l2a',
        element: <MKSL2a />,
        layout: 'default',    
    },
    {
         path: '/tilting',
        element: <TilTing />,
        layout: 'default',    
    },
    {
         path: '/adm_5r',
        element: <CAW />,
        layout: 'default',    
    }
];

export { routes };
