import {clusterApiUrl} from '@solana/web3.js';
import {NetworkDefinition, NetworkType} from 'src/types/networks';

export const LOCAL_NETWORK_URL = 'http://localhost:8899';

export const NETWORK_DEFINITIONS: NetworkDefinition[] = [{
    name: 'Mainnet Beta',
    type: NetworkType.MainnetBeta,
    url: clusterApiUrl(NetworkType.MainnetBeta),
}, {
    name: 'Devnet',
    type: NetworkType.Devnet,
    url: clusterApiUrl(NetworkType.Devnet),
}, {
    name: 'Testnet',
    type: NetworkType.Testnet,
    url: clusterApiUrl(NetworkType.Testnet),
}, {
    name: 'Localnet',
    type: NetworkType.Localnet,
    url: LOCAL_NETWORK_URL,
}];