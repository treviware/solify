import {defineStore} from 'pinia';
import {Keypair} from '@solana/web3.js';

export const useKeypairFormatterToolStore = defineStore('keypairFormatterTool', {
    state: () => ({
        keypair: null as Keypair | null,
    }),
});