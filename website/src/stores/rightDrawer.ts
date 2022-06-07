import {defineStore} from 'pinia';

export const useRightDrawerStore = defineStore('rightDrawer', {
    state: () => ({
        drawerState: RightDrawerState.PROGRAMS,
        size: 740,
    }),
    actions: {
        openPrograms() {
            this.drawerState = RightDrawerState.PROGRAMS;
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