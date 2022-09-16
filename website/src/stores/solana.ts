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
        network: clusterApiUrl('mainnet-beta'),
        extraNetworks: useLocalStorage<{
            name: string; url: string;
        }[]>(EXTRA_NETWORKS_SETTINGS_KEY, []),
        commitment: 'confirmed' as Commitment,
        walletAutoConnect: localStorage.getItem(WALLET_AUTO_CONNECT) === 'true',
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

                    if (net === 'mainnet-beta') {
                        localStorage.removeItem(NETWORK_SETTINGS_KEY);
                    } else {
                        localStorage.setItem(NETWORK_SETTINGS_KEY, net);
                    }

                    await routerStore.setQueryEntry(NETWORK_SETTINGS_KEY, net === 'mainnet-beta' ? undefined : net);
                    return;
                }
            }

            if (validateUrl(network)) {
                this.network = network;
                localStorage.setItem(NETWORK_SETTINGS_KEY, network);

                await routerStore.setQueryEntry(NETWORK_SETTINGS_KEY, network);
            }
        },
        async setCommitment(commitment: string) {
            console.log('setCommitment', commitment);
            const routerStore = useRouterStore();

            switch (commitment) {
                case 'confirmed':
                    this.commitment = commitment;
                    localStorage.removeItem(COMMITMENT_SETTINGS_KEY);

                    await routerStore.setQueryEntry(COMMITMENT_SETTINGS_KEY, undefined);
                    break;
                case 'processed':
                case 'finalized':
                    this.commitment = commitment;
                    localStorage.setItem(COMMITMENT_SETTINGS_KEY, commitment);

                    await routerStore.setQueryEntry(COMMITMENT_SETTINGS_KEY, commitment);
                    break;
            }
        },
        async setWalletAutoConnect(autoConnect: boolean) {
            this.walletAutoConnect = autoConnect;

            if (autoConnect) {
                localStorage.setItem(WALLET_AUTO_CONNECT, autoConnect.toString());
            } else {
                localStorage.removeItem(WALLET_AUTO_CONNECT);
            }
        },
    },
});