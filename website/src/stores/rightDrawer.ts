import {defineStore} from 'pinia';
import {useGlobalStore} from 'stores/global';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.CLOSED,
        size: 740,
        overlay: true,
        minWindowSize: 0,
    }),
    getters: {
        isClosed: (state) => state.drawerState === RightDrawerState.CLOSED,
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
            this.drawerState = newState;
        },
        close() {
            this.drawerState = RightDrawerState.CLOSED;
        },
    },
});

export enum RightDrawerState {
    CLOSED,
    PROGRAMS,
}