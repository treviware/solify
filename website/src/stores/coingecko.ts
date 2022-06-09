import {defineStore} from 'pinia';
import {Router} from 'src/router';
import {VS_COIN_SETTINGS_KEY} from 'src/constants';
import axios from 'axios';
import {PublicKey} from '@solana/web3.js';

const CACHE_RELOAD_INTERVAL = 60 * 1000; // 1 minute
const API_URL = 'https://api.coingecko.com/api/v3';
export const VS_COINS = ['USD', 'EUR', 'SOL'];

export const useCoingeckoStore = defineStore('coingecko', {
    state: () => ({
        vsCoinName: 'USD',
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
        async setVsCoin(vsCoinName: string) {
            if (VS_COINS.indexOf(vsCoinName) === -1) {
                return;
            }

            this.vsCoinName = vsCoinName;

            if (vsCoinName === 'USD') {
                localStorage.removeItem(VS_COIN_SETTINGS_KEY);
            } else {
                localStorage.setItem(VS_COIN_SETTINGS_KEY, vsCoinName);
            }

            await Router.replace({
                query: {
                    ...Router.currentRoute.value.query,
                    vs_coin: vsCoinName === 'USD' ? undefined : vsCoinName,
                },
            });
        },

        getVsCoinPrice(): number {
            const cachedData = this.cache[this.vsCoinName];
            if (cachedData) {
                if (cachedData.timestamp.getTime() + CACHE_RELOAD_INTERVAL <= Date.now()) {
                    this.loadVsCoinPrice();
                }

                return cachedData.price;
            } else {
                this.cache[this.vsCoinName] = {
                    price: 0,
                    timestamp: new Date(),
                };

                this.loadVsCoinPrice();
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

        async loadVsCoinPrice(): Promise<number> {
            switch (this.vsCoinName) {
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