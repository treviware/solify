import {defineStore} from 'pinia';
import {useRoute} from 'vue-router';
import {MENU_BUTTONS} from 'src/constants/menu';
import {DrawerAppButtonChild} from 'src/types/drawer';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    }),
    getters: {
        isMobile: (state) => state.windowWidth <= 600,
        currentAppButton: () => {
            const route = useRoute();
            return MENU_BUTTONS.find(b => route.name === b.pathName) ??
                MENU_BUTTONS.find(b => b.children && checkChildren(b.children, route.name as string));
        },
    },
});

function checkChildren(children: DrawerAppButtonChild[], routeName: string): boolean {
    return children.some(b => b.pathName === routeName || (b.children && checkChildren(b.children, routeName)));
}