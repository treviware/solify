<script lang="ts" setup>
import TransactionView from 'components/apps/TxBuilderPage/TransactionView.vue';
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {PublicKey} from '@solana/web3.js';
import {useWallet} from 'solana-wallets-vue';

const wallet = useWallet();
const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const transactions = computed(() => currentGroup.value.transactions);

// METHODS --------------------------------------------------------------------
function addTransaction(index: number) {
    let n = transactions.value.length + 1;
    while (true) {
        const name = `Transaction ${n}`;
        if (!transactions.value.some(tx => tx.name === name)) {
            let payer = wallet.publicKey.value;

            if (payer == null) {
                if (transactions.value.length === 0) {
                    payer = PublicKey.default;
                } else if (index === 0) {
                    payer = transactions.value[0]?.payer ?? PublicKey.default;
                } else {
                    payer = transactions.value[index - 1]?.payer ?? PublicKey.default;
                }
            }

            transactions.value.splice(index, 0, {
                name,
                instructions: [],
                data: [],
                payer,
            });

            break;
        }

        n += 1;
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="column justify-start flex-center">
        <template v-if="transactions.length !== 0">
            <template v-for="(_, i) in transactions" :key="i">
                <div>
                    <q-btn unelevated
                           color="primary"
                           size="sm"
                           label="Add transaction"
                           class="text-bold"
                           @click="addTransaction(i)"/>
                </div>
                <div class="tx-v-bar"></div>
                <TransactionView :index="i"/>
                <div class="tx-v-bar"></div>
            </template>
            <q-btn unelevated
                   color="primary"
                   size="sm"
                   label="Add transaction"
                   class="text-bold"
                   @click="addTransaction(transactions.length)"/>
        </template>
        <template v-else>
            <div class="q-pa-sm bg-grey-9 rounded-borders full-width row flex-center shadow-2">
                No transactions
            </div>
            <div class="tx-v-bar"></div>
            <div>
                <q-btn unelevated
                       color="primary"
                       size="sm"
                       label="Add transaction"
                       class="text-bold"
                       @click="addTransaction(transactions.length)"/>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.tx-v-bar {
    width: 1px;
    background-color: $grey-9;
    height: 20px;
}
</style>