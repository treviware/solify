import {ExplorerAction, ExplorerDefinition} from 'src/types/explorers';
import {NetworkType} from 'src/types/networks';
import {LOCAL_NETWORK_URL} from 'src/constants/networks';

export const EXPLORER_DEFINITIONS: ExplorerDefinition[] = [{
    name: 'Solscan',
    url: 'https://solscan.io/',
    resolver: (action: ExplorerAction, data: string, network = NetworkType.MainnetBeta) => {
        let url = 'https://solscan.io/';

        switch (action) {
            case ExplorerAction.Address:
                url += 'account/' + data;
                break;
            case ExplorerAction.Transaction:
                url += 'tx/' + data;
                break;
        }

        switch (network) {
            case NetworkType.MainnetBeta:
                break;
            case NetworkType.Devnet:
                url += '?cluster=devnet';
                break;
            case NetworkType.Testnet:
                url += '?cluster=testnet';
                break;
            case NetworkType.Localnet:
                url += '?cluster=custom&customUrl=' + LOCAL_NETWORK_URL;
                break;
            default:
                url += '?cluster=custom&customUrl=' + network;
                break;
        }

        return url;
    },
}, {
    name: 'Solana Explorer',
    url: 'https://explorer.solana.com/',
    resolver: (action: ExplorerAction, data: string, network = NetworkType.MainnetBeta) => {
        let url = 'https://explorer.solana.com/';

        switch (action) {
            case ExplorerAction.Address:
                url += 'address/' + data;
                break;
            case ExplorerAction.Transaction:
                url += 'tx/' + data;
                break;
        }

        switch (network) {
            case NetworkType.MainnetBeta:
                break;
            case NetworkType.Devnet:
                url += '?cluster=devnet';
                break;
            case NetworkType.Testnet:
                url += '?cluster=testnet';
                break;
            case NetworkType.Localnet:
                url += '?cluster=custom&customUrl=' + LOCAL_NETWORK_URL;
                break;
            default:
                url += '?cluster=custom&customUrl=' + network;
                break;
        }

        return url;
    },
}, {
    name: 'SolanaFM',
    url: 'https://solana.fm/',
    resolver: (action: ExplorerAction, data: string, network = NetworkType.MainnetBeta) => {
        let url = 'https://solana.fm/';

        switch (action) {
            case ExplorerAction.Address:
                url += 'address/' + data;
                break;
            case ExplorerAction.Transaction:
                url += 'tx/' + data;
                break;
        }

        switch (network) {
            case NetworkType.MainnetBeta:
                break;
            case NetworkType.Devnet:
                url += '?cluster=devnet-solana';
                break;
            case NetworkType.Testnet:
                url += '?cluster=testnet-solana';
                break;
            case NetworkType.Localnet:
                url += '?cluster=' + LOCAL_NETWORK_URL;
                break;
            default:
                url += '?cluster=' + network;
                break;
        }

        return url;
    },
}];