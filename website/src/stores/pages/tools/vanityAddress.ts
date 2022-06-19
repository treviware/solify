import {defineStore} from 'pinia';
import {VanityAddressResult, VanityAddressRule} from 'src/types/tools/vanityAddress';

export const useVanityAddressToolStore = defineStore('vanityAddressTool', {
    state: () => ({
        rules: [] as VanityAddressRule[],
        results: [] as VanityAddressResult[],
    }),
});