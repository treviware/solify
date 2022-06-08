<script lang="ts" setup>
import {MAX_SPL_DECIMALS} from 'src/constants';
import SplDecimalsInput from 'components/general/input/SplDecimalsInput.vue';
import {useBpsUtilityStore} from 'stores/pages/utilities/basisPoints';
import {storeToRefs} from 'pinia';

const bpsUtilityStore = useBpsUtilityStore();

// REFS -----------------------------------------------------------------------

const {
    decimals,
    bps,
    realAmount,
} = storeToRefs(bpsUtilityStore);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onDecimalsUpdate() {
    decimals.value = Math.floor(Math.min(MAX_SPL_DECIMALS, Math.max(0, decimals.value)));
    realAmount.value = bps.value / Math.pow(10, decimals.value);
}

function onBasisPointsUpdate() {
    bps.value = Math.floor(Math.max(0, bps.value));
    realAmount.value = bps.value / Math.pow(10, decimals.value);
}

function onRealAmountUpdate() {
    realAmount.value = Math.max(0, realAmount.value);
    bps.value = Math.floor(realAmount.value * Math.pow(10, decimals.value));
    realAmount.value = bps.value / Math.pow(10, decimals.value);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-page class="flex flex-center">
        <q-card>
            <q-card-section>
                <h6 class="text-center q-mb-sm">Basis Points Utility</h6>
                <p>Pick a SPL token or directly introduce the number of decimals to convert from the token's basis
                    points to the real amount or viceversa.</p>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="text-secondary text-caption text-bold">Decimals</div>
                <SplDecimalsInput v-model.number="decimals" @update:model-value="onDecimalsUpdate"/>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="text-secondary text-caption text-bold">Basis points (BPS)</div>
                <q-input v-model.number="bps"
                         type="number"
                         outlined
                         dense
                         min="0"
                         step="1"
                         @update:model-value="onBasisPointsUpdate"/>
                <div class="text-secondary text-caption text-bold q-mt-md">Real Amount</div>
                <q-input v-model.number="realAmount"
                         type="number"
                         outlined
                         dense
                         @update:model-value="onRealAmountUpdate"/>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<style lang="scss" scoped>
.q-card {
    width: 360px;
}
</style>