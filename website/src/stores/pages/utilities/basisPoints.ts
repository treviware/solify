import {defineStore} from 'pinia';
import BN from 'bn.js';

export const useBpsUtilityStore = defineStore('bpsUtility', {
    state: () => ({
        decimals: 0,
        bps: new BN(100),
        realAmount: 100,
    }),
});