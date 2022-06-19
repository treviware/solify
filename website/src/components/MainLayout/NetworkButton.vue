<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';
import {computed} from 'vue';
import {clusterApiUrl} from '@solana/web3.js';
import {useRouterStore} from 'stores/router';

const solanaStore = useSolanaStore();
const routerStore = useRouterStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const text = computed(() => {
    switch (solanaStore.network) {
        case clusterApiUrl('mainnet-beta'):
            return 'Mainnet Beta';
        case clusterApiUrl('testnet'):
            return 'Testnet';
        case clusterApiUrl('devnet'):
            return 'Devnet';
        default:
            return solanaStore.network;
    }
});

// METHODS --------------------------------------------------------------------

async function open() {
    await routerStore.push({
        name: 'Settings',
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-btn class="rounded-borders" color="primary" no-caps unelevated @click="open">
        <q-icon name="fa-solid fa-circle-nodes" size="16px" class="q-mr-sm"></q-icon>
        {{ text }}
    </q-btn>
</template>

<style lang="scss" scoped></style>