import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        path: '',
        redirect: {
            name: 'TxBuilder',
        },
    }, {
        name: 'TxBuilder',
        path: '/builder',
        component: () => import('pages/TxBuilderPage.vue'),
    }, {
        name: 'BPSUtility',
        path: '/utility/bps',
        component: () => import('pages/utilities/BasisPointsPage.vue'),
    }, {
        name: 'RentExemptionUtility',
        path: '/utility/rent-exemption',
        component: () => import('pages/utilities/RentExemptionPage.vue'),
    }],
},

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    }];

export default routes;
