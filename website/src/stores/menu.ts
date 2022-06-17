import {defineStore} from 'pinia';
import {UTILITY_BUTTONS} from 'src/constants/utilites';
import {MAX_PINNED_UTILITIES, MAX_RECENT_UTILITIES, PINNED_UTILITIES_KEY} from 'src/constants';
import {DrawerUtilityButton, RightDrawerState} from 'src/types/drawer';

export const useMenuStore = defineStore('menu', {
    state: () => {
        const pins = loadPins();
        return {
            ...pins,
        };
    },
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

            savePins(this.pinnedUtilities);
        },
        unpin(newState: RightDrawerState) {
            const index = this.pinnedUtilities.findIndex(v => v.rightDrawerOption === newState);
            if (index < 0) {
                return;
            }

            const result = this.pinnedUtilities.splice(index, 1);
            this.recentUtilities.push(...result);

            savePins(this.pinnedUtilities);
        },
    },
});

function loadPins() {
    const pinnedUtilities = localStorage.getItem(PINNED_UTILITIES_KEY);
    if (pinnedUtilities) {
        const pinIndexes: number[] = JSON.parse(pinnedUtilities);

        if (validatePinList(pinIndexes)) {
            const recentUtilities = UTILITY_BUTTONS.slice(0);
            const pinnedUtilities: DrawerUtilityButton[] = [];
            pinIndexes.splice(MAX_PINNED_UTILITIES, pinIndexes.length);

            for (const pin of pinIndexes) {
                pinnedUtilities.push(recentUtilities[pin]);
            }

            const sortedPinIndexes = pinIndexes.sort((a, b) => b - a);
            for (const pin of sortedPinIndexes) {
                recentUtilities.splice(pin, 1);
            }

            return {
                recentUtilities,
                pinnedUtilities,
            };
        }
    }

    return {
        recentUtilities: UTILITY_BUTTONS.slice(1),
        pinnedUtilities: [UTILITY_BUTTONS[0]],
    };
}

function validatePinList(pinList: any): boolean {
    if (!Array.isArray(pinList)) {
        return false;
    }

    for (const pin of pinList) {
        const pinType = typeof pin;
        if (pinType !== 'number') {
            return false;
        }

        if (pin < 0 || pin >= UTILITY_BUTTONS.length) {
            return false;
        }
    }

    return true;
}

function savePins(pinnedUtilities: DrawerUtilityButton[]) {
    if (pinnedUtilities.length === 0) {
        localStorage.removeItem(PINNED_UTILITIES_KEY);
        return;
    }

    const pins = JSON.stringify(
        pinnedUtilities.map(v => UTILITY_BUTTONS.findIndex(v2 => v.rightDrawerOption === v2.rightDrawerOption)));

    localStorage.setItem(PINNED_UTILITIES_KEY, pins);
}