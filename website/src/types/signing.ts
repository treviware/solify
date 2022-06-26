import {Keypair, PublicKey} from '@solana/web3.js';

export interface SignatureInfo {
    type: 'localWallet' | 'keypair';
    pubkey: PublicKey;
    keypair?: Keypair;
    provided?: boolean;
}

export interface TransactionSigningInfo {
    keypairSignatures: SignatureInfo[];
    walletSignatures: (SignatureInfo & { done: boolean }) [];
}