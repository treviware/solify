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
        name: 'Apps',
        path: '/apps',
        component: () => import('pages/AppsPage.vue'),
    }, {
        name: 'Tools',
        path: '/tools',
        component: () => import('pages/ToolsPage.vue'),
    }, {
        name: 'Settings',
        path: '/settings',
        component: () => import('pages/SettingsPage.vue'),
    }, {
        name: 'TxBuilderApp',
        path: '/apps/tx/builder',
        component: () => import('pages/apps/TxBuilderPage.vue'),
    }, {
        name: 'ProgramExplorer',
        path: '/apps/programs',
        component: () => import('pages/apps/ProgramExplorerPage/ProgramExplorerPage.vue'),
    }, {
        name: 'Program',
        path: '/apps/programs/:programId',
        props: true,
        component: () => import('pages/apps/ProgramExplorerPage/ProgramPage.vue'),
    }],
},

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    }];

export default routes;
