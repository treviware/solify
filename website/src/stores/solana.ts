import {defineStore} from 'pinia';
import {clusterApiUrl, Commitment, Connection} from '@solana/web3.js';
import {validateUrl} from 'src/utils/urls';
import {COMMITMENT_SETTINGS_KEY, NETWORK_SETTINGS_KEY} from 'src/constants';
import {useRouterStore} from 'stores/router';

const networks: Record<string, string> = {
    'mainnet-beta': clusterApiUrl('mainnet-beta'),
    'devnet': clusterApiUrl('devnet'),
    'testnet': clusterApiUrl('testnet'),
    'localnet': 'http://localhost:8899',
};

export const useSolanaStore = defineStore('solana', {
    state: () => ({
        network: clusterApiUrl('mainnet-beta'),
        commitment: 'confirmed' as Commitment,
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
    },
});