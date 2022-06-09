<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import {watch} from 'vue';
import {useRoute} from 'vue-router';
import {reverseEnum} from 'src/utils/objects';
import {useSolanaStore} from 'stores/solana';
import {COMMITMENT_SETTINGS_KEY, NETWORK_SETTINGS_KEY} from 'src/constants';

const route = useRoute();
const rightDrawerStore = useRightDrawerStore();
const solanaStore = useSolanaStore();
const reversedStates = reverseEnum(RightDrawerState);

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

watch(route, async (route) => {
    const drawer = route.query.drawer as string;

    if (reversedStates[drawer]) {
        rightDrawerStore.open(drawer as RightDrawerState);
    } else {
        rightDrawerStore.close();
    }

    const network = route.query.network as string ?? localStorage.getItem(NETWORK_SETTINGS_KEY);
    if (network) {
        await solanaStore.setNetwork(network);
    }

    const commitment = route.query.commitment as string ?? localStorage.getItem(COMMITMENT_SETTINGS_KEY);
    if (commitment) {
        await solanaStore.setCommitment(commitment);
    }
});
</script>

<template>
    <router-view/>
</template>