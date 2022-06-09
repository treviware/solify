<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';
import {ref} from 'vue';
import {clusterApiUrl} from '@solana/web3.js';
import {validateUrl} from 'src/utils/urls';

const solanaStore = useSolanaStore();

const buttons = [{
    url: clusterApiUrl('mainnet-beta'),
    name: 'Mainnet-beta',
}, {
    url: clusterApiUrl('devnet'),
    name: 'Devnet',
}, {
    url: clusterApiUrl('testnet'),
    name: 'Testnet',
}, {
    url: 'http://localhost:8899',
    name: 'Localnet',
}];

// REFS -----------------------------------------------------------------------
const customRpc = ref(solanaStore.network);
const showError = ref(false);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function select(url: string) {
    customRpc.value = url;

    if (!validateUrl(url)) {
        showError.value = true;
        return;
    }

    showError.value = false;
    solanaStore.setNetwork(url);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Solana RPC Endpoint</h6>
        <p>The RPC endpoint used to communicate with the network:</p>
        <div class="row flex-center q-my-md" style="gap: 20px">
            <q-btn color="primary"
                   :unelevated="customRpc === button.url"
                   :flat="customRpc !== button.url"
                   @click="select(button.url)"
                   v-for="button in buttons"
                   :key="button.name">
                {{ button.name }}
            </q-btn>
        </div>
        <h6 class="text-secondary text-caption text-bold">Custom RPC endpoint</h6>
        <q-input v-model="customRpc"
                 outlined
                 dense
                 @blur="select(customRpc)"
                 @keydown.enter="select(customRpc)"
                 :error="showError"
                 :error-message="showError ? 'Invalid URL' : ''"
                 no-error-icon>
            <template v-slot:append v-if="showError">
                <q-icon name="fa-solid fa-triangle-exclamation" color="negative" size="xs"></q-icon>
            </template>
        </q-input>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>