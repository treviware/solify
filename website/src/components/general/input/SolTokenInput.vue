<script lang="ts" setup>
import {useBlockchainStore} from 'stores/blockchain';
import TokenInput from 'components/general/input/TokenInput.vue';

const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <TokenInput v-bind="$attrs" bps-label="LAMPORTS" :token="blockchainStore.solToken"/>
</template>

<style lang="scss" scoped></style>