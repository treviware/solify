<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import {ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {reverseEnum} from 'src/utils/objects';
import {useSolanaStore} from 'stores/solana';
import {
    COMMITMENT_SETTINGS_KEY, DRAWER_SETTINGS_KEY, NETWORK_SETTINGS_KEY, VS_CURRENCY_SETTINGS_KEY,
} from 'src/constants';
import {useCoingeckoStore} from 'stores/coingecko';
import {RightDrawerState} from 'src/types/drawer';

const route = useRoute();
const rightDrawerStore = useRightDrawerStore();
const solanaStore = useSolanaStore();
const coingeckoStore = useCoingeckoStore();
const reversedStates = reverseEnum(RightDrawerState);

// REFS -----------------------------------------------------------------------
const isLoaded = ref(false);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

watch(route, async (route) => {
    if (isLoaded.value) {
        return;
    }

    isLoaded.value = true;

    const drawer = route.query[DRAWER_SETTINGS_KEY] as string;

    if (reversedStates[drawer]) {
        await rightDrawerStore.open(drawer as RightDrawerState);
    } else {
        await rightDrawerStore.close();
    }

    const network = route.query[NETWORK_SETTINGS_KEY] as string ?? localStorage.getItem(NETWORK_SETTINGS_KEY);
    if (network) {
        await solanaStore.setNetwork(network);
    }

    const commitment = route.query[VS_CURRENCY_SETTINGS_KEY] as string ?? localStorage.getItem(COMMITMENT_SETTINGS_KEY);
    if (commitment) {
        await solanaStore.setCommitment(commitment);
    }

    const vs_currency = route.query[VS_CURRENCY_SETTINGS_KEY] as string ??
        localStorage.getItem(VS_CURRENCY_SETTINGS_KEY);
    if (vs_currency) {
        await coingeckoStore.setVsCurrency(vs_currency);
    }
});
</script>

<template>
    <router-view/>
</template>