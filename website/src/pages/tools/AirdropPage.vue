<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {computed, ref, watch} from 'vue';
import {useAirdropToolStore} from 'stores/tools/airdrop';
import SolTokenAmountInput from 'components/general/input/SolTokenAmountInput.vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import AlertBox from 'components/general/AlertBox.vue';
import {useSolanaStore} from 'stores/solana';
import {useQuasar} from 'quasar';
import BN from 'bn.js';
import {processUriStoreDataOnMounted, removeStoreDataFromUriOnUnmounted, writeToolParamsIntoUri} from 'src/utils/tools';
import {PublicKey} from '@solana/web3.js';

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

    if (account.value === null) {
        return;
    }

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

function writeToUri() {
    return writeToolParamsIntoUri({
        account: account.value ?? undefined,
        amount: amount.value ?? new BN(0),
    });
}

// WATCHES --------------------------------------------------------------------
watch([account, amount], () => {
    writeToUri();
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted((query) => {
    const queryAccount = query.account;
    if (queryAccount) {
        try {
            account.value = new PublicKey(queryAccount);
        } catch (e) {
        }
    }

    const queryAmount = query.amount;
    if (queryAmount) {
        try {
            amount.value = BN.max(new BN(0), new BN(queryAmount));
        } catch (e) {
        }
    }

    writeToUri();
});
removeStoreDataFromUriOnUnmounted();

</script>

<template>
    <div class="q-px-lg q-py-md">
        <p>Introduce the account in which you want to receive the funds and the amount to airdrop.</p>
        <AlertBox type="warning" class="q-my-md">
            <div>The airdrop will not work in mainnet</div>
        </AlertBox>
        <div class="text-secondary text-caption text-bold q-mt-md">Account</div>
        <PubkeyInput v-model="account" accept-null/>
        <div class="text-secondary text-caption text-bold q-mt-md">Amount</div>
        <SolTokenAmountInput v-model="amount"/>
        <AlertBox type="warning" class="q-my-md" v-if="isGreaterThan2">
            <div>Trying to airdrop more than 2 SOL at the same time can lead in an error</div>
        </AlertBox>
        <div class="flex flex-center q-mt-md">
            <q-btn :disable="!account"
                   color="secondary"
                   text-color="black"
                   unelevated
                   no-caps
                   :loading="loading"
                   @click="airdrop">
                Airdrop
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>