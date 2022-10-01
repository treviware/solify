import {NetworkType} from 'src/types/networks';

export interface ExplorerDefinition {
    name: string;
    url: string;
    resolver: (action: ExplorerAction, data: string, network: NetworkType | string) => string;
}

export enum ExplorerAction {
    Address = 'address',
    Transaction = 'transaction',
}