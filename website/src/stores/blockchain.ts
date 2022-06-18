import {defineStore} from 'pinia';
import {PublicKey} from '@solana/web3.js';
import axios from 'axios';
import {ref} from 'vue';
import {MAX_LAST_SPL_TOKENS} from 'src/constants';

export const useBlockchainStore = defineStore('blockchain', {
    state: () => {
        const solToken = ref<TokenMeta>({
            address: PublicKey.default,
            name: 'Solana',
            symbol: 'SOL',
            decimals: 9,
            coingeckoId: 'solana',
            logoURI: 'https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/solana/info/logo.png',
        });

        return {
            solToken,
            loading: false,
            tokenMap: null as Record<string, TokenMeta> | null,
            lastSelectedTokens: [solToken.value] as TokenMeta[],
        };
    },
    getters: {
        tokenList: state => state.tokenMap ?
            Object.values(state.tokenMap).sort((a, b) => (a.name ?? 'Unknown').localeCompare(b.name ?? 'Unknown')) : [],
    },
    actions: {
        getTokenMetadata(address: PublicKey): TokenMeta | null {
            this.loadTokenList();

            if (address.equals(this.solToken.address)) {
                return this.solToken;
            } else if (this.tokenMap != null) {
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
                    i.coingeckoId = i?.extensions?.coingeckoId;
                    tokenMap[i.address] = i;
                }

                this.tokenMap = tokenMap;
            } finally {
                this.loading = false;
            }
        },
        addLastSelectedTokens(token: TokenMeta): void {
            const index = this.lastSelectedTokens.findIndex(t => t.address.equals(token.address));
            if (index !== 0) {
                if (index !== -1) {
                    this.lastSelectedTokens.splice(index, 1);
                }

                this.lastSelectedTokens.splice(1, 0, token);

                if (this.lastSelectedTokens.length > MAX_LAST_SPL_TOKENS) {
                    this.lastSelectedTokens.splice(this.lastSelectedTokens.length - 1, 1);
                }
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
    coingeckoId?: string;
}