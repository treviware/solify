<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';
import {computed} from 'vue';
import {useRouterStore} from 'stores/router';
import {NETWORK_DEFINITIONS} from 'src/constants/networks';

const solanaStore = useSolanaStore();
const routerStore = useRouterStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const text = computed(() => {
    return NETWORK_DEFINITIONS.find(v => v.url === solanaStore.network)?.name ??
        solanaStore.extraNetworks.find(v => v.url === solanaStore.network)?.name ?? 'Unknown';
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