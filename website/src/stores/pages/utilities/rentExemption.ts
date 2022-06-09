import {defineStore} from 'pinia';

export const useRentExemptionStore = defineStore('rentExemption', {
    state: () => ({
        bytes: 0,
    }),
});