import { defineStore } from 'pinia';
import { PublicKey } from '@solana/web3.js';

export const useBurnTokensToolStore = defineStore('burnTokensTool', {
  state: () => ({
    wallet: null as PublicKey | null
  })
});