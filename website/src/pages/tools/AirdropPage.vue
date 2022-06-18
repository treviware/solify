<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {computed, ref} from 'vue';
import {useAirdropToolStore} from 'stores/pages/tools/airdrop';
import SolTokenInput from 'components/general/input/SolTokenInput.vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import AlertBox from 'components/general/AlertBox.vue';
import {useSolanaStore} from 'stores/solana';
import {useQuasar} from 'quasar';
import BN from 'bn.js';

const quasar = useQuasar();
const solanaStore = useSolanaStore();
const airdropToolStore = useAirdropToolStore();

// REFS -----------------------------------------------------------------------
const {
    account,
    amount,
} = storeToRefs(airdropToolStore);
const loading = ref(false);

// COMPUTED -------------------------------------------------------------------
const isGreaterThan2 = computed(() => amount.value.gt(new BN(2_000_000_000)));

// METHODS --------------------------------------------------------------------
async function airdrop() {
    loading.value = true;

    try {
        await solanaStore.connection.requestAirdrop(account.value, Number(amount.value));
        quasar.notify({
            message: 'Airdrop successful',
            color: 'positive',
            badgeColor: 'positive',
        });
    } catch (e) {
        console.error('Cannot request the airdrop', e);
        quasar.notify({
            message: 'Cannot request the airdrop',
            type: 'negative',
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
        <p>Introduce the account in which you want to receive the funds and the amount to airdrop.</p>
        <AlertBox type="warning" class="q-my-md">
            <div>The airdrop will not work in mainnet</div>
        </AlertBox>
        <div class="text-secondary text-caption text-bold q-mt-md">Account</div>
        <PubkeyInput v-model="account"></PubkeyInput>
        <div class="text-secondary text-caption text-bold q-mt-md">Amount</div>
        <SolTokenInput v-model="amount"></SolTokenInput>
        <AlertBox type="warning" class="q-my-md" v-if="isGreaterThan2">
            <div>Trying to airdrop more than 2 SOL at the same time can lead in an error</div>
        </AlertBox>
        <div class="flex flex-center">
            <q-btn color="secondary" text-color="black" unelevated no-caps :loading="loading" @click="airdrop">
                Airdrop
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>