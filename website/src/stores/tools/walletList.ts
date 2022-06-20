import {defineStore} from 'pinia';
import {PublicKey} from '@solana/web3.js';
import {ref, watch} from 'vue';
import {useWallet} from 'solana-wallets-vue';
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
                wallets.value.push({
                    address: publicKey,
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
    address: PublicKey,
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