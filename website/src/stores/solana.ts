import {defineStore} from 'pinia';
import {clusterApiUrl, Commitment, Connection} from '@solana/web3.js';

export const useSolanaStore = defineStore('solana', {
    state: () => ({
        network: clusterApiUrl('mainnet-beta'),
        commitment: 'confirmed' as Commitment,
    }),
    getters: {
        connection: state => new Connection(state.network, state.commitment),
    },
});