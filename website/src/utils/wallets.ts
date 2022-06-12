import {PublicKey} from '@solana/web3.js';

export function abbreviatePubkey(pubkey: PublicKey): string {
    const str = pubkey.toBase58();
    return str.slice(0, 4) + '..' + str.slice(-4);
}