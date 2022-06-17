<script lang="ts" setup>
import {computed} from 'vue';
import {useCoingeckoStore} from 'stores/coingecko';
import {useRouter} from 'vue-router';

const props = defineProps<{
    amount: number, token: string, decimals?: number, showEqual?: boolean,
}>();

const coingeckoStore = useCoingeckoStore();
const router = useRouter();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const vsCurrencyPrice = computed(() => coingeckoStore.getVsCurrencyPrice());
const tokenPrice = computed(() => coingeckoStore.getSolPrice() / vsCurrencyPrice.value);
const price = computed(() => {
    const value = tokenPrice.value * props.amount;

    if (props.decimals !== undefined) {
        return `${value.toFixed(props.decimals)}`;
    } else {
        return `${value}`;
    }
});
const equal = computed(() => {
    if (props.showEqual) {
        if (coingeckoStore.vsCurrencyName === props.token) {
            return '=';
        } else {
            return '≈';
        }
    } else {
        return '';
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
    <span>{{ equal }} {{ price }} <q-btn dense flat color="secondary" @click="openSettings">{{
            coingeckoStore.vsCurrencyName
        }}</q-btn></span>
</template>

<style lang="scss" scoped></style>