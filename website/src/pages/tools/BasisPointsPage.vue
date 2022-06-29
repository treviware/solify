<script lang="ts" setup>
import {MAX_SPL_DECIMALS} from 'src/constants';
import SplDecimalsInput from 'components/general/input/SplDecimalsInput.vue';
import {useBpsToolStore} from 'stores/tools/basisPoints';
import {storeToRefs} from 'pinia';
import BignumInput from 'components/general/input/BignumInput.vue';
import BN from 'bn.js';
import {computed} from 'vue';
import {formatBasisPoints} from 'src/utils/tokens';
import {processUriStoreDataOnMounted, removeStoreDataFromUriOnUnmounted, writeToolParamsIntoUri} from 'src/utils/tools';

const bpsToolStore = useBpsToolStore();

// REFS -----------------------------------------------------------------------

const {
    decimals,
    bps,
    realAmount,
} = storeToRefs(bpsToolStore);

// COMPUTED -------------------------------------------------------------------

const realAmountStr = computed(() => formatBasisPoints(bps.value, decimals.value));

// METHODS --------------------------------------------------------------------

function onDecimalsUpdate() {
    if (isNaN(decimals.value)) {
        decimals.value = 0;
    }

    decimals.value = Math.floor(Math.min(MAX_SPL_DECIMALS, Math.max(0, decimals.value)));
    realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);

    writeToUri();
}

function onBasisPointsUpdate() {
    bps.value = BN.max(new BN(0), bps.value);
    realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);

    writeToUri();
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

        writeToUri();
    } catch (e) {
    }
}

function writeToUri() {
    return writeToolParamsIntoUri({
        decimals: decimals.value ?? 0,
        bps: bps.value ?? new BN(0),
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted((query) => {
    const queryDecimals = query.decimals;
    if (queryDecimals) {
        const decimalsNum = parseInt(queryDecimals);
        if (!isNaN(decimalsNum)) {
            decimals.value = Math.floor(Math.min(MAX_SPL_DECIMALS, Math.max(0, decimalsNum)));
        }
    }

    const queryBps = query.bps;
    if (queryBps) {
        try {
            bps.value = BN.max(new BN(0), new BN(queryBps));
            realAmount.value = Number(bps.value) / Math.pow(10, decimals.value);
        } catch (e) {
        }
    }

    onBasisPointsUpdate();
});
removeStoreDataFromUriOnUnmounted();

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