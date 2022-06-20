import {defineStore} from 'pinia';
import {PublicKey} from '@solana/web3.js';
import BN from 'bn.js';

export const useTokenPriceToolStore = defineStore('tokenPriceTool', {
    state: () => ({
        amount: new BN(1_000_000_000),
        token: new PublicKey('So11111111111111111111111111111111111111112'), // Wrapped SOL
        comparingToken: null as PublicKey | null,
    }),
});