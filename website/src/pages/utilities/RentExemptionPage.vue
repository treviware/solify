<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {useRentExemptionStore} from 'stores/pages/utilities/rentExemption';
import {computed, ref} from 'vue';
import {useSolanaStore} from 'stores/solana';
import {useQuasar} from 'quasar';
import VsCurrencyText from 'components/general/VsCurrencyText.vue';
import BytesInput from 'components/general/input/BytesInput.vue';

const quasar = useQuasar();
const solanaStore = useSolanaStore();
const rentExemptionStore = useRentExemptionStore();

// REFS -----------------------------------------------------------------------
const {
    bytes,
} = storeToRefs(rentExemptionStore);
const rent = ref(0);
const loading = ref(false);

// COMPUTED -------------------------------------------------------------------
const rentInSol = computed(() => rent.value / Math.pow(10, 9));

// METHODS --------------------------------------------------------------------
async function loadRentExempt() {
    loading.value = true;

    try {
        rent.value = await solanaStore.connection.getMinimumBalanceForRentExemption(bytes.value);
    } catch (e) {
        console.error('Error in getMinimumBalanceForRentExemption', e);
        quasar.notify({
            message: 'Error querying rent exemption',
            color: 'negative',
        });
    } finally {
        loading.value = false;
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md">
        <p>Introduce the number of bytes of the data you want to store in the blockchain or pick a pre-defined
            account size to calculate the amount of SOL to add to be rent exempt.</p>
        <div class="text-secondary text-caption text-bold q-mt-md">Bytes</div>
        <BytesInput v-model="bytes" @keydown.enter="loadRentExempt"/>
        <div class="relative-position">
            <q-separator class="q-my-lg"/>
            <q-btn dense
                   color="secondary"
                   text-color="black"
                   unelevated
                   no-caps
                   :loading="loading"
                   size="md"
                   class="q-px-sm q-py-none absolute-center"
                   @click="loadRentExempt">
                Load
            </q-btn>
        </div>
        <div class="text-secondary text-caption text-bold q-mt-md">Rent (SOL)</div>
        <q-input :model-value="rentInSol" :hint="'LAMPORTS = ' + rent" readonly outlined dense>
            <template v-slot:after>
                <span class="text-bold text-body1 q-pl-sm">
                    <VsCurrencyText :amount="rentInSol" token="SOL" :decimals="2" show-equal/>
                </span>
            </template>
        </q-input>
    </div>
</template>

<style lang="scss" scoped></style>