import {PublicKey} from '@solana/web3.js';

export function abbreviatePubkey(pubkey: PublicKey): string {
    const str = pubkey.toBase58();
    return str.slice(0, 4) + '..' + str.slice(-4);
}

export function abbreviateSignature(signature: string): string {
    return signature.slice(0, 6) + '..' + signature.slice(-6);
}