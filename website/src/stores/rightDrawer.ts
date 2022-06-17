import {defineStore} from 'pinia';
import {useGlobalStore} from 'stores/global';
import {Router} from 'src/router';
import {LEFT_MENU_WIDTH, MIN_CONTENT_SIZE, RIGHT_DRAWER_WIDTH} from 'src/constants';
import {RightDrawerState} from 'src/types/drawer';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.Closed,
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

            this.drawerState = newState;
            await Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    drawer: newState,
                },
            });
        },
        async close() {
            this.drawerState = RightDrawerState.Closed;

            await Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    drawer: undefined,
                },
            });
        },
    },
});