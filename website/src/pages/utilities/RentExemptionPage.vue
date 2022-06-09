<script lang="ts" setup>
import {MAX_SPL_DECIMALS} from 'src/constants';
import {storeToRefs} from 'pinia';
import {useRentExemptionStore} from 'stores/pages/utilities/rentExemption';
import {computed, onBeforeMount, ref} from 'vue';
import {useSolanaStore} from 'stores/solana';
import {useQuasar} from 'quasar';

const quasar = useQuasar();
const solanaStore = useSolanaStore();
const rentExemptionStore = useRentExemptionStore();

// REFS -----------------------------------------------------------------------

const {
    bytes,
} = storeToRefs(rentExemptionStore);
const rent = ref(0);

// COMPUTED -------------------------------------------------------------------

const byteInHigherUnits = computed(() => {
    const kib = bytes.value / 1024;
    const mib = kib / 1024;
    const gib = mib / 1024;

    if (gib >= 1) {
        return `≈ ${gib.toFixed(2)} GiB`;
    }

    if (mib >= 1) {
        return `≈ ${mib.toFixed(2)} MiB`;
    }

    if (kib >= 1) {
        return `≈ ${kib.toFixed(2)} KiB`;
    }

    return `= ${bytes.value} B`;
});

// METHODS --------------------------------------------------------------------

function onBytesUpdate(newValue: number) {
    bytes.value = Math.floor(newValue);
}

async function loadRentExempt() {
    try {
        rent.value = await solanaStore.connection.getMinimumBalanceForRentExemption(bytes.value);
    } catch (e) {
        console.error('Error in getMinimumBalanceForRentExemption', e);
        quasar.notify({
            message: 'Error querying rent exemption',
            color: 'negative',
        });
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

onBeforeMount(() => {
    loadRentExempt();
});
</script>

<template>
    <q-page class="flex flex-center">
        <q-card>
            <q-card-section>
                <h6 class="text-center q-mb-sm">Rent Exemption Utility</h6>
                <p>Introduce the number of bytes of the data you want to store in the blockchain or pick a pre-defined
                    account size to calculate the amount of SOL to add to be rent exempt.</p>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="text-secondary text-caption text-bold">Bytes</div>
                <q-input :model-value="bytes"
                         type="number"
                         outlined
                         dense
                         min="0"
                         :max="MAX_SPL_DECIMALS"
                         class="decimals-input"
                         step="1"
                         :hint="byteInHigherUnits"
                         :debounce="300"
                         @update:model-value="onBytesUpdate"
                         @keydown.enter="loadRentExempt"
                         @blur="loadRentExempt"></q-input>
            </q-card-section>
            <q-separator/>
            <q-card-section>
                <div class="text-secondary text-caption text-bold q-mt-md">Rent (SOL)</div>
                <q-input :model-value="rent / Math.pow(10, 9)" :hint="'LAMPORTS = ' + rent" readonly outlined dense/>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<style lang="scss" scoped>
.q-card {
    width: 360px;
}
</style>