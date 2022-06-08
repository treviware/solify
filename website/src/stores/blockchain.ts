import {defineStore} from 'pinia';
import {PublicKey} from '@solana/web3.js';
import axios from 'axios';

export const useBlockchainStore = defineStore('blockchain', {
    state: () => ({
        loading: false,
        tokenMap: null as Record<string, TokenMeta> | null,
    }),
    getters: {
        tokenList: state => state.tokenMap ?
            Object.values(state.tokenMap).sort((a, b) => (a.name ?? 'Unknown').localeCompare(b.name ?? 'Unknown')) : [],
    },
    actions: {
        getTokenMetadata(address: PublicKey): TokenMeta | null {
            this.loadTokenList();

            if (this.tokenMap != null) {
                return this.tokenMap[address.toBase58()] || null;
            } else {
                return null;
            }
        },
        async loadTokenList(): Promise<undefined> {
            if (this.tokenMap !== null || this.loading) {
                return;
            }

            this.loading = true;

            try {
                const response = await axios.get(
                    'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');

                const tokenMap: Record<string, TokenMeta> = {};

                for (const i of response.data.tokens) {
                    i.address = new PublicKey(i.address);
                    tokenMap[i.address] = i;
                }

                this.tokenMap = tokenMap;
            } finally {
                this.loading = false;
            }
        },
    },
});

export interface TokenMeta {
    address: PublicKey,
    name?: string,
    symbol?: string,
    decimals?: number,
    logoURI?: string
}