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

export const useWalletStore = defineStore('wallets', {
    state: () => {
        const wallet = useWallet();
        const wallets = ref<WalletData[]>([{
            address: new PublicKey('5Q1gHcLSsLPbHmtsyr1AdASf2cuak2DV7DsbFDU993TZ'),
            listOpen: false,
            isLoaded: false,
            tokens: [],
            amount: 0,
        }, {
            address: new PublicKey('3Y1tv6gTrBNBEDrmjxnDef3hCnMtrQuM66TrEgMo9aQ8'),
            listOpen: false,
            isLoaded: false,
            tokens: [],
            amount: 0,
        }, {
            address: new PublicKey('9sJeB18iYziJ3uTG19a2oAHf5TS8zF3sMBjKh5xyJUcT'),
            listOpen: true,
            isLoaded: false,
            tokens: [],
            amount: 0,
        }]);

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