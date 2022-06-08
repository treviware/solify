import {defineStore} from 'pinia';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.CLOSED,
        size: 740,
        overlay: true,
    }),
    getters: {
        isClosed: (state) => state.drawerState === RightDrawerState.CLOSED,
    },
    actions: {
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