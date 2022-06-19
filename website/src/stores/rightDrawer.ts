import {defineStore} from 'pinia';
import {useGlobalStore} from 'stores/global';
import {DRAWER_SETTINGS_KEY, LEFT_MENU_WIDTH, MIN_CONTENT_SIZE, RIGHT_DRAWER_WIDTH} from 'src/constants';
import {RightDrawerState} from 'src/types/drawer';
import {useMenuStore} from 'stores/menu';
import {useRouterStore} from 'stores/router';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.Closed,
        drawerTopButtons: null as HTMLElement | null,
    }),
    getters: {
        isClosed: (state) => state.drawerState === RightDrawerState.Closed,
        overlay: () => {
            const globalStore = useGlobalStore();
            return globalStore.windowWidth <= RIGHT_DRAWER_WIDTH + MIN_CONTENT_SIZE + LEFT_MENU_WIDTH;
        },
        maxSize: () => {
            const store = useGlobalStore();
            return Math.min(store.windowWidth, RIGHT_DRAWER_WIDTH);
        },
    },
    actions: {
        async open(newState: RightDrawerState) {
            if (newState === RightDrawerState.Closed) {
                await this.close();
                return;
            }

            const routerStore = useRouterStore();
            const menuStore = useMenuStore();
            menuStore.addRecentTool(newState);

            this.drawerState = newState;
            await routerStore.setQueryEntry(DRAWER_SETTINGS_KEY, newState);
        },
        async close() {
            const routerStore = useRouterStore();

            this.drawerState = RightDrawerState.Closed;

            await routerStore.setQueryEntry(DRAWER_SETTINGS_KEY, undefined);
        },
    },
});