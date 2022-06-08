import {defineStore} from 'pinia';

export const useBpsUtilityStore = defineStore('bpsUtility', {
    state: () => ({
        decimals: 0,
        bps: 100,
        realAmount: 100,
    }),
});