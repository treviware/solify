import {defineStore} from 'pinia';
import {Keypair, PublicKey} from '@solana/web3.js';
import {ref, watch} from 'vue';
import {useWallet} from 'src/lib/WalletAdapter';
import {Account} from '@solana/spl-token';
import {Data} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/Data';
import {TokenStandard} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/TokenStandard';
import {Collection} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/Collection';
import {Uses} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/Uses';
import {Key} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/types/Key';

export const useWalletListStore = defineStore('walletListTool', {
    state: () => {
        const wallet = useWallet();
        const wallets = ref<WalletData[]>([]);

        watch(wallet.publicKey, (publicKey) => {
            if (publicKey && !wallets.value.find(v => v.address.equals(publicKey))) {
                let walletName = '';
                let index = 0;
                do {
                    index += 1;
                    walletName = `Wallet ${index}`;
                } while (wallets.value.find(v => v.name === walletName));

                wallets.value.push({
                    name: walletName,
                    address: publicKey,
                    keypair: null,
                    listOpen: false,
                    isLoaded: false,
                    tokens: [],
                    amount: 0,
                });
            }
        }, {
            immediate: true,
        });

        return {
            wallets,
        };
    },
});

export interface WalletData {
    name: string,
    address: PublicKey,
    keypair: Keypair | null,
    isLoaded: boolean,
    listOpen: boolean,
    tokens: WalletTokenData[],
    amount: number
}

export interface WalletTokenData {
    account: Account;
    metadata?: WalletTokenMetadata;
}

export interface WalletTokenMetadata {
    address: PublicKey;
    key: Key;
    updateAuthority: PublicKey;
    mint: PublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number;
    tokenStandard: TokenStandard;
    collection: Collection;
    uses: Uses;
    external?: WalletTokenExternalMetadata;
}

export interface WalletTokenExternalMetadata {
    name: string;
    symbol: string;
    image: string;
    animation_url: string;
    description: string;
    seller_fee_basis_points: number;
    external_url: string;
}