<script lang="ts" setup>
import {computed} from 'vue';
import {useCoingeckoStore} from 'stores/coingecko';
import {PublicKey} from '@solana/web3.js';
import {useRouterStore} from 'stores/router';

const props = defineProps<{
    amount: number, decimals?: number, showEqual?: boolean, token: PublicKey,
}>();

const coingeckoStore = useCoingeckoStore();
const routerStore = useRouterStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const vsCurrencyPrice = computed(() => coingeckoStore.getVsCurrencyPrice());
const tokenPrice = computed(() => coingeckoStore.getTokenPrices([props.token])[0]);
const tokenDivisor = computed(() => tokenPrice.value / vsCurrencyPrice.value);
const price = computed(() => {
    const value = tokenDivisor.value * props.amount;

    if (props.decimals !== undefined) {
        return `${value.toFixed(props.decimals)}`;
    } else {
        return `${value}`;
    }
});

// METHODS --------------------------------------------------------------------

async function openSettings() {
    await routerStore.push({
        name: 'Settings',
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <span>{{ showEqual ? '≈ ' : '' }}{{ price }} <q-btn dense flat color="secondary" @click="openSettings">{{
            coingeckoStore.vsCurrencyName
        }}</q-btn></span>
</template>

<style lang="scss" scoped></style>