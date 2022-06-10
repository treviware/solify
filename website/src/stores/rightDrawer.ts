import {defineStore} from 'pinia';
import {useGlobalStore} from 'stores/global';
import {Router} from 'src/router';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.Closed,
        size: 740,
        overlay: true,
        minWindowSize: 0,
    }),
    getters: {
        isClosed: (state) => state.drawerState === RightDrawerState.Closed,
        maxSize: (state) => {
            const store = useGlobalStore();
            return Math.min(store.windowWidth, state.size);
        },
    },
    actions: {
        setOverlay(overlay: boolean, minContentSize: number) {
            this.overlay = overlay;
            this.minWindowSize = overlay ? 0 : minContentSize + 80 + this.size;
        },
        open(newState: RightDrawerState) {
            if (newState === RightDrawerState.Closed) {
                this.close();
                return;
            }

            this.drawerState = newState;
            Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    drawer: newState,
                },
            });
        },
        close() {
            this.drawerState = RightDrawerState.Closed;

            Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    drawer: undefined,
                },
            });
        },
    },
});

export enum RightDrawerState {
    Closed = 'closed',
    Programs = 'programs',
    Settings = 'settings',
    Wallets = 'wallets',
}