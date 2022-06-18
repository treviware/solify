import {defineStore} from 'pinia';
import BN from 'bn.js';
import {PublicKey} from '@solana/web3.js';

export const useAirdropUtilityStore = defineStore('airdropUtility', {
    state: () => ({
        account: PublicKey.default,
        amount: new BN(1_000_000_000),
    }),
});