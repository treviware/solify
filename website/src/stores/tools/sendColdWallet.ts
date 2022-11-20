import { defineStore } from 'pinia';
import { PublicKey } from '@solana/web3.js';

export const useSendColdWalletToolStore = defineStore('sendColdWalletToolStore', {
  state: () => ({
    origin: null as PublicKey | null,
    destination: null as PublicKey | null
  })
});