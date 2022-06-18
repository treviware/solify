<script lang="ts" setup>
import {computed} from 'vue';
import {useCoingeckoStore} from 'stores/coingecko';
import {useRouter} from 'vue-router';
import {PublicKey} from '@solana/web3.js';

const props = defineProps<{
    amount: number, decimals?: number, showEqual?: boolean, token: PublicKey,
}>();

const coingeckoStore = useCoingeckoStore();
const router = useRouter();

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
    await router.push({
        name: 'Settings',
        query: router.currentRoute.value.query,
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