<script lang="ts" setup>
import {computed} from 'vue';
import {useCoingeckoStore} from 'stores/coingecko';
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';

const props = defineProps<{
    amount: number, token: string, decimals?: number, showEqual?: boolean,
}>();

const coingeckoStore = useCoingeckoStore();
const rightDrawerStore = useRightDrawerStore();

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

function openSettings() {
    rightDrawerStore.open(RightDrawerState.Settings);
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