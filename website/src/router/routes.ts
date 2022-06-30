import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        path: '',
        redirect: {
            name: 'Tools',
        },
    }, {
        name: 'TxBuilder',
        path: '/builder',
        component: () => import('pages/apps/TxBuilderPage.vue'),
    }, {
        name: 'ProgramExplorer',
        path: '/programs',
        component: () => import('pages/apps/ProgramExplorerPage/ProgramExplorerPage.vue'),
    }, {
        name: 'Program',
        path: '/program/:programId',
        props: true,
        component: () => import('pages/apps/ProgramExplorerPage/ProgramPage.vue'),
    }, {
        name: 'Tools',
        path: '/tools',
        component: () => import('pages/apps/ToolsPage.vue'),
    }, {
        name: 'Settings',
        path: '/settings',
        component: () => import('pages/apps/SettingsPage.vue'),
    }],
},

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    }];

export default routes;
