import { defineStore } from 'pinia';
import { PublicKey } from '@solana/web3.js';

export const useCloseEmptyAccountsToolStore = defineStore('closeEmptyAccountsTool', {
  state: () => ({
    wallet: null as PublicKey | null
  })
});