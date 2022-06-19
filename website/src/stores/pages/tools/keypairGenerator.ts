import {defineStore} from 'pinia';
import {Keypair} from '@solana/web3.js';

export const useKeypairGeneratorToolStore = defineStore('keypairGeneratorTool', {
    state: () => ({
        keypair: null as Keypair | null,
    }),
});