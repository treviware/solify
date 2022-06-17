import {defineStore} from 'pinia';
import {UTILITY_BUTTONS} from 'src/constants/utilites';
import {MAX_PINNED_UTILITIES, MAX_RECENT_UTILITIES} from 'src/constants';
import {RightDrawerState} from 'src/types/drawer';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        recentUtilities: UTILITY_BUTTONS.slice(1),
        pinnedUtilities: [UTILITY_BUTTONS[0]],
    }),
    getters: {
        recentMenuUtilities: (state) => {
            const numUtilities = Math.max(MAX_RECENT_UTILITIES - state.pinnedUtilities.length);
            const utilities = state.recentUtilities.slice(-numUtilities).reverse();

            return [...state.pinnedUtilities, ...utilities];
        },
    },
    actions: {
        addRecentUtility(newState: RightDrawerState) {
            const index = this.recentUtilities.findIndex(v => v.rightDrawerOption === newState);

            if (index < 0) {
                return;
            }

            const result = this.recentUtilities.splice(index, 1);
            this.recentUtilities.push(...result);
        },
        pin(newState: RightDrawerState) {
            if (this.pinnedUtilities.length >= MAX_PINNED_UTILITIES) {
                return;
            }

            const index = this.recentUtilities.findIndex(v => v.rightDrawerOption === newState);
            const result = this.recentUtilities.splice(index, 1);
            this.pinnedUtilities.push(...result);
        },
        unpin(newState: RightDrawerState) {
            const index = this.pinnedUtilities.findIndex(v => v.rightDrawerOption === newState);
            if (index < 0) {
                return;
            }

            const result = this.pinnedUtilities.splice(index, 1);
            this.recentUtilities.push(...result);
        },
    },
});