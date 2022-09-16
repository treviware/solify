import {defineStore} from 'pinia';
import {VS_CURRENCY_SETTINGS_KEY} from 'src/constants';
import axios from 'axios';
import {PublicKey} from '@solana/web3.js';
import {useBlockchainStore} from 'stores/blockchain';
import {useRouterStore} from 'stores/router';
import {useLocalStorage} from '@vueuse/core';

const CACHE_RELOAD_INTERVAL = 60 * 1000; // 1 minute
const API_URL = 'https://api.coingecko.com/api/v3';
export const VS_CURRENCYS = ['USD', 'EUR'];

export const useCoingeckoStore = defineStore('coingecko', {
    state: () => ({
        vsCurrencyName: useLocalStorage(VS_CURRENCY_SETTINGS_KEY, 'USD'),
        cache: {
            USD: {
                price: 1,
                expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), /* 1 year */
            },
        } as Record<string, {
            price: number, expiration: Date,
        }>,
    }),
    actions: {
        async setVsCurrency(vsCurrencyName: string) {
            const routerStore = useRouterStore();

            if (VS_CURRENCYS.indexOf(vsCurrencyName) === -1) {
                return;
            }

            this.vsCurrencyName = vsCurrencyName;

            await routerStore.setQueryEntry(VS_CURRENCY_SETTINGS_KEY,
                vsCurrencyName === 'USD' ? undefined : vsCurrencyName);
        },

        getVsCurrencyPrice(): number {
            const cachedData = this.cache[this.vsCurrencyName];
            if (cachedData) {
                if (Date.now() >= cachedData.expiration.getTime()) {
                    this.loadVsCurrencyPrice();
                }

                return cachedData.price;
            } else {
                this.cache[this.vsCurrencyName] = {
                    price: 0,
                    expiration: new Date(Date.now() + CACHE_RELOAD_INTERVAL),
                };

                this.loadVsCurrencyPrice();
            }

            return 0;
        },

        getOnlyTokenPrice(token: PublicKey): number {
            const pubkey = token.toBase58();
            const cachedData = this.cache[pubkey];
            if (cachedData) {
                return cachedData.price;
            } else {
                this.cache[pubkey] = {
                    price: 0,
                    expiration: new Date(),
                };
            }

            return 0;
        },

        getTokenPrices(tokens: PublicKey[]): number[] {
            const results: number[] = [];
            const toLoad: PublicKey[] = [];

            for (const token of tokens) {
                const pubkey = token.toBase58();
                const cachedData = this.cache[pubkey];
                if (cachedData) {
                    if (Date.now() >= cachedData.expiration.getTime()) {
                        toLoad.push(token);
                    }

                    results.push(cachedData.price);
                    continue;
                } else {
                    this.cache[pubkey] = {
                        price: 0,
                        expiration: new Date(Date.now() + CACHE_RELOAD_INTERVAL),
                    };

                    toLoad.push(token);
                }

                results.push(0);
            }

            if (toLoad.length > 0) {
                this.loadTokenPrices(toLoad);
            }

            return results;
        },

        async loadVsCurrencyPrice(): Promise<number> {
            switch (this.vsCurrencyName) {
                case 'USD':
                    return this.cache['USD'].price;
                case 'EUR': {
                    const response = await axios.get(`${API_URL}/simple/price?ids=usd&vs_currencies=eur`);
                    const price = 1 / response.data.usd.eur;

                    this.cache['EUR'] = {
                        price,
                        expiration: new Date(Date.now() + CACHE_RELOAD_INTERVAL),
                    };

                    return price;
                }
            }

            return 0;
        },

        async loadTokenPrices(tokens: PublicKey[]): Promise<number[]> {
            const blockchainStore = useBlockchainStore();
            await blockchainStore.loadTokenList();

            const byTokens: PublicKey[] = [];
            const byGeckoIds: string[] = [];
            const finalTokens = tokens.map(token => {
                const meta = blockchainStore.getTokenMetadata(token);
                if (meta) {
                    if (meta.coingeckoId) {
                        byGeckoIds.push(meta.coingeckoId);
                        return {
                            byGeckoId: true,
                            token,
                        };
                    }
                }

                byTokens.push(token);
                return {
                    byGeckoId: false,
                    token,
                };
            });

            const promiseByTokens = loadTokenPricesByAddress(byTokens);
            const promiseByGeckoIds = loadTokenPricesByGeckoId(byGeckoIds);

            const resultsByTokens = await promiseByTokens;
            const resultsByGeckoIds = await promiseByGeckoIds;

            return finalTokens.map(v => {
                let result: number;

                if (v.byGeckoId) {
                    result = resultsByGeckoIds.shift()!;
                } else {
                    result = resultsByTokens.shift()!;
                }

                this.cache[v.token.toString()] = {
                    price: result,
                    expiration: new Date(Date.now() + CACHE_RELOAD_INTERVAL),
                };

                return result;
            });
        },
    },
});

async function loadTokenPricesByGeckoId(tokenIds: string[]): Promise<number[]> {
    if (tokenIds.length === 0) {
        return [];
    }

    const response = await axios.get(`${API_URL}/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd`);

    return tokenIds.map(address => response.data[address]?.usd ?? 0);
}

async function loadTokenPricesByAddress(tokens: PublicKey[]): Promise<number[]> {
    if (tokens.length === 0) {
        return [];
    }

    const contractAddresses = tokens.map(v => v.toBase58());
    const response = await axios.get(
        `${API_URL}/simple/token_price/solana?contract_addresses=${contractAddresses.join(',')}&vs_currencies=usd`);

    return contractAddresses.map(address => response.data[address]?.usd ?? 0);
}