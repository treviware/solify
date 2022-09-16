export interface NetworkDefinition {
    name: string;
    type: NetworkType;
    url: string;
}

export enum NetworkType {
    MainnetBeta = 'mainnet-beta',
    Devnet = 'devnet',
    Testnet = 'testnet',
    Localnet = 'localnet',
}