import {defineStore} from 'pinia';
import {Router} from 'src/router';
import {VS_CURRENCY_SETTINGS_KEY} from 'src/constants';
import axios from 'axios';
import {PublicKey} from '@solana/web3.js';

const CACHE_RELOAD_INTERVAL = 60 * 1000; // 1 minute
const API_URL = 'https://api.coingecko.com/api/v3';
export const VS_CURRENCYS = ['USD', 'EUR', 'SOL'];

export const useCoingeckoStore = defineStore('coingecko', {
    state: () => ({
        vsCurrencyName: 'USD',
        cache: {
            USD: {
                price: 1,
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24), /* 1 day */
            },
        } as Record<string, {
            price: number, timestamp: Date,
        }>,
    }),
    actions: {
        async setVsCurrency(vsCurrencyName: string) {
            if (VS_CURRENCYS.indexOf(vsCurrencyName) === -1) {
                return;
            }

            this.vsCurrencyName = vsCurrencyName;

            if (vsCurrencyName === 'USD') {
                localStorage.removeItem(VS_CURRENCY_SETTINGS_KEY);
            } else {
                localStorage.setItem(VS_CURRENCY_SETTINGS_KEY, vsCurrencyName);
            }

            await Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    vs_currency: vsCurrencyName === 'USD' ? undefined : vsCurrencyName,
                },
            });
        },

        getVsCurrencyPrice(): number {
            const cachedData = this.cache[this.vsCurrencyName];
            if (cachedData) {
                if (cachedData.timestamp.getTime() + CACHE_RELOAD_INTERVAL <= Date.now()) {
                    this.loadVsCurrencyPrice();
                }

                return cachedData.price;
            } else {
                this.cache[this.vsCurrencyName] = {
                    price: 0,
                    timestamp: new Date(),
                };

                this.loadVsCurrencyPrice();
            }

            return 0;
        },

        getSolPrice(): number {
            const cachedData = this.cache['SOL'];
            if (cachedData) {
                if (cachedData.timestamp.getTime() + CACHE_RELOAD_INTERVAL <= Date.now()) {
                    this.loadSolPrice();
                }

                return cachedData.price;
            } else {
                this.cache['SOL'] = {
                    price: 0,
                    timestamp: new Date(),
                };

                this.loadSolPrice();
            }

            return 0;
        },

        getTokenPrice(token: PublicKey): number {
            const pubkey = token.toBase58();
            const cachedData = this.cache[pubkey];
            if (cachedData) {
                if (cachedData.timestamp.getTime() + CACHE_RELOAD_INTERVAL <= Date.now()) {
                    this.loadTokenPrice(token);
                }

                return cachedData.price;
            } else {
                this.cache[pubkey] = {
                    price: 0,
                    timestamp: new Date(),
                };

                this.loadTokenPrice(token);
            }

            return 0;
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
                        timestamp: new Date(),
                    };

                    return price;
                }
                case 'SOL':
                    return await this.loadSolPrice();
            }

            return 0;
        },

        async loadSolPrice(): Promise<number> {
            const response = await axios.get(`${API_URL}/simple/price?ids=solana&vs_currencies=usd`);
            const price = response.data.solana.usd;

            this.cache['SOL'] = {
                price,
                timestamp: new Date(),
            };

            return price;
        },

        async loadTokenPrice(token: PublicKey): Promise<number> {
            const pubkey = token.toBase58();
            const response = await axios.get(
                `${API_URL}/simple/token_price/solana?contract_addresses=${pubkey}&vs_currencies=usd`);
            const price = response.data[pubkey].usd;

            this.cache[pubkey] = {
                price,
                timestamp: new Date(),
            };

            return price;
        },
    },
});