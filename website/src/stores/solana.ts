import {defineStore} from 'pinia';
import {clusterApiUrl, Commitment, Connection} from '@solana/web3.js';
import {Router} from 'src/router';
import {validateUrl} from 'src/utils/urls';
import {COMMITMENT_SETTINGS_KEY, NETWORK_SETTINGS_KEY} from 'src/constants';

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
            for (const net in networks) {
                const url = networks[net];

                if (net === network || url === network) {
                    this.network = url;

                    if (net === 'mainnet-beta') {
                        localStorage.removeItem(NETWORK_SETTINGS_KEY);
                    } else {
                        localStorage.setItem(NETWORK_SETTINGS_KEY, net);
                    }

                    await Router.replace({
                        query: {
                            ...Router.currentRoute.value.query,
                            network: net === 'mainnet-beta' ? undefined : net,
                        },
                    });

                    return;
                }
            }

            if (validateUrl(network)) {
                this.network = network;
                localStorage.setItem(NETWORK_SETTINGS_KEY, network);

                await Router.replace({
                    query: {
                        ...Router.currentRoute.value.query,
                        network,
                    },
                });
            }
        },
        async setCommitment(commitment: string) {
            switch (commitment) {
                case 'confirmed':
                    this.commitment = commitment;
                    localStorage.setItem(COMMITMENT_SETTINGS_KEY, commitment);

                    await Router.replace({
                        query: {
                            ...Router.currentRoute.value.query,
                            commitment: undefined,
                        },
                    });
                    break;
                case 'processed':
                case 'finalized':
                    this.commitment = commitment;
                    localStorage.setItem(COMMITMENT_SETTINGS_KEY, commitment);

                    await Router.replace({
                        query: {
                            ...Router.currentRoute.value.query,
                            commitment,
                        },
                    });
                    break;
            }
        },
    },
});