<script lang="ts" setup>
import {MAX_SPL_DECIMALS} from 'src/constants';
import SplDecimalsInput from 'components/general/input/SplDecimalsInput.vue';
import {useBpsUtilityStore} from 'stores/pages/utilities/basisPoints';
import {storeToRefs} from 'pinia';
import BignumInput from 'components/general/input/BignumInput.vue';
import BN from 'bn.js';
import {computed} from 'vue';
import {formatBasisPoints} from 'src/utils/tokens';

const bpsUtilityStore = useBpsUtilityStore();

// REFS -----------------------------------------------------------------------

const {
    decimals,
    bps,
    realAmount,
} = storeToRefs(bpsUtilityStore);

// COMPUTED -------------------------------------------------------------------

const realAmountStr = computed(() => formatBasisPoints(bps.value, decimals.value));

// METHODS --------------------------------------------------------------------

function onDecimalsUpdate() {
    decimals.value = Math.floor(Math.min(MAX_SPL_DECIMALS, Math.max(0, decimals.value)));
    realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);
}

function onBasisPointsUpdate() {
    bps.value = BN.max(new BN(0), bps.value);
    realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);
}

function onRealAmountUpdate(newRealAmount: string) {
    try {
        const value = parseFloat(newRealAmount);
        if (isNaN(value)) {
            return;
        }

        realAmount.value = Math.max(0, value);
        bps.value = new BN(Math.floor(realAmount.value * Math.pow(10, decimals.value)));
        realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);
    } catch (e) {
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md">
        <p>Pick a SPL token or directly introduce the number of decimals to convert from the token's basis
            points to the real amount or vice versa.</p>
        <div class="text-secondary text-caption text-bold q-mt-md">Decimals</div>
        <SplDecimalsInput v-model.number="decimals" @update:model-value="onDecimalsUpdate"/>
        <q-separator class="q-my-md"/>
        <div class="text-secondary text-caption text-bold">Basis points (BPS)</div>
        <BignumInput v-model="bps" outlined dense min="0" step="1" @update:model-value="onBasisPointsUpdate"/>
        <div class="text-secondary text-caption text-bold q-mt-md">Real Amount</div>
        <q-input :model-value="realAmountStr" outlined dense @update:model-value="onRealAmountUpdate"/>
    </div>
</template>

<style lang="scss" scoped></style>