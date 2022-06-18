<script lang="ts" setup>
import {useBlockchainStore} from 'stores/blockchain';
import TokenAmountInput from 'components/general/input/TokenAmountInput.vue';

const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <TokenAmountInput v-bind="$attrs" bps-label="LAMPORTS" :token="blockchainStore.solToken.address"/>
</template>

<style lang="scss" scoped></style>