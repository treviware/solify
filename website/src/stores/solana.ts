import {defineStore} from 'pinia';
import {clusterApiUrl, Commitment, Connection} from '@solana/web3.js';
import {validateUrl} from 'src/utils/urls';
import {
    COMMITMENT_SETTINGS_KEY, EXTRA_NETWORKS_SETTINGS_KEY, NETWORK_SETTINGS_KEY, WALLET_AUTO_CONNECT,
} from 'src/constants';
import {useRouterStore} from 'stores/router';
import {useLocalStorage} from '@vueuse/core';

const networks: Record<string, string> = {
    'mainnet-beta': clusterApiUrl('mainnet-beta'),
    'devnet': clusterApiUrl('devnet'),
    'testnet': clusterApiUrl('testnet'),
    'localnet': 'http://localhost:8899',
};

export const useSolanaStore = defineStore('solana', {
    state: () => ({
        network: useLocalStorage(NETWORK_SETTINGS_KEY, clusterApiUrl('mainnet-beta')),
        extraNetworks: useLocalStorage<{
            name: string; url: string;
        }[]>(EXTRA_NETWORKS_SETTINGS_KEY, []),
        commitment: useLocalStorage<Commitment>(COMMITMENT_SETTINGS_KEY, 'confirmed'),
        walletAutoConnect: useLocalStorage(WALLET_AUTO_CONNECT, true),
    }),
    getters: {
        connection: state => new Connection(state.network, state.commitment),
    },
    actions: {
        async setNetwork(network: string) {
            const routerStore = useRouterStore();

            for (const net in networks) {
                const url = networks[net];

                if (net === network || url === network) {
                    this.network = url;

                    await routerStore.setQueryEntry(NETWORK_SETTINGS_KEY, net === 'mainnet-beta' ? undefined : net);
                    return;
                }
            }

            if (validateUrl(network)) {
                this.network = network;

                await routerStore.setQueryEntry(NETWORK_SETTINGS_KEY, network);
            }
        },
        async setCommitment(commitment: string) {
            const routerStore = useRouterStore();

            switch (commitment) {
                case 'confirmed':
                case 'processed':
                case 'finalized':
                    this.commitment = commitment;
                    await routerStore.setQueryEntry(COMMITMENT_SETTINGS_KEY, undefined);
                    break;
            }
        },
    },
});