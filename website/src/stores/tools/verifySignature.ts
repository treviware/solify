import {defineStore} from 'pinia';
import {PublicKey} from '@solana/web3.js';

export const useVerifySignatureToolStore = defineStore('verifySignatureTool', {
    state: () => ({
        account: null as PublicKey | null,
        message: '',
        signature: '',
    }),
});