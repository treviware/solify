import {defineStore} from 'pinia';
import {Commitment, Connection} from '@solana/web3.js';
import {validateUrl} from 'src/utils/urls';
import {
    COMMITMENT_SETTINGS_KEY, EXTRA_NETWORKS_SETTINGS_KEY, NETWORK_SETTINGS_KEY, PREFERRED_EXPLORER, WALLET_AUTO_CONNECT,
} from 'src/constants';
import {useRouterStore} from 'stores/router';
import {useLocalStorage} from '@vueuse/core';
import {NETWORK_DEFINITIONS} from 'src/constants/networks';
import {NetworkType} from 'src/types/networks';
import {EXPLORER_DEFINITIONS} from 'src/constants/explorers';

export const useSolanaStore = defineStore('solana', {
    state: () => ({
        network: useLocalStorage(NETWORK_SETTINGS_KEY,
            NETWORK_DEFINITIONS.find(v => v.type === NetworkType.MainnetBeta)!.url),
        extraNetworks: useLocalStorage<{
            name: string; url: string;
        }[]>(EXTRA_NETWORKS_SETTINGS_KEY, []),
        commitment: useLocalStorage<Commitment>(COMMITMENT_SETTINGS_KEY, 'confirmed'),
        walletAutoConnect: useLocalStorage(WALLET_AUTO_CONNECT, true),
        explorer: useLocalStorage(PREFERRED_EXPLORER, EXPLORER_DEFINITIONS[0].url),
    }),
    getters: {
        connection: state => new Connection(state.network, state.commitment),
    },
    actions: {
        async setNetwork(network: string) {
            const routerStore = useRouterStore();

            for (const net of NETWORK_DEFINITIONS) {
                const netType = net.type;
                const url = net.url;

                if (netType === network || url === network) {
                    this.network = url;

                    await routerStore.setQueryEntry(NETWORK_SETTINGS_KEY,
                        netType === NetworkType.MainnetBeta ? undefined : netType);
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