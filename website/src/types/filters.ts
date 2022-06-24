import {PublicKey} from '@solana/web3.js';

export function isPubkey(value: any): value is PublicKey {
    return !!value.toBase58;
}