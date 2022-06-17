<script lang="ts" setup>
import {WalletData} from 'stores/wallets';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import {computed, ref} from 'vue';
import {useBlockchainStore} from 'stores/blockchain';
import {PublicKey} from '@solana/web3.js';
import WalletNftInfo from 'components/utilities/WalletsPage/WalletNftInfo.vue';

const props = defineProps<{
    walletData: WalletData, address: PublicKey;
}>();

const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
const showNftDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
const token = computed(() => props.walletData.tokens.find(v => v.account.address.equals(props.address)));
const tokenInfo = computed(() => blockchainStore.getTokenMetadata(token.value.account.mint) ?? null);
const decimals = computed(() => tokenInfo.value?.decimals ?? 0);
const amount = computed(() => Number(token.value.account.amount) / Math.pow(10, decimals.value));
const symbol = computed(() => tokenInfo.value?.symbol ?? '???');
const metadata = computed(() => token.value.metadata);
const name = computed(() => {
    if (metadata.value) {
        return metadata.value?.data?.name ?? 'Unknown token';
    } else {
        return tokenInfo.value?.name ?? 'Unknown token';
    }
});

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item>
        <q-item-section avatar>
            <q-avatar square>
                <img :src="(metadata ? metadata?.external?.image : tokenInfo?.logoURI) ?? '/placeholder.jpg'">
            </q-avatar>
        </q-item-section>
        <q-item-section>
            <q-item-label class="row justify-between">
                <div>
                    <q-badge v-if="metadata" color="primary" class="text-bold">NFT</q-badge>
                    {{ name }}
                </div>
                <div class="text-caption">
                    {{ amount }} {{ metadata ? '' : symbol }}
                </div>
            </q-item-label>
            <q-item-label caption class="row gap-md">
                <div>
                    Account:
                    <PubkeyBadge :pubkey="token.account.address" show-copy class="badge-color" show-menu/>
                </div>
                <div>
                    SPL token:
                    <PubkeyBadge :pubkey="token.account.mint" show-copy class="badge-color" show-menu/>
                </div>
                <div v-if="!metadata">Decimals: {{ decimals }}</div>
                <div v-else class="text-bold text-primary cursor-pointer" @click="showNftDialog = true">More info...
                </div>
            </q-item-label>
        </q-item-section>

        <q-dialog v-model="showNftDialog" v-if="metadata">
            <WalletNftInfo :token="token"/>
        </q-dialog>
    </q-item>
</template>