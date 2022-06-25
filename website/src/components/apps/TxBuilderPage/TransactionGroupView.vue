<script lang="ts" setup>
import TransactionView from 'components/apps/TxBuilderPage/TransactionView.vue';
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {PublicKey} from '@solana/web3.js';
import {formatRealValue} from 'src/utils/tokens';

const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
    web3Transactions,
    encodedTransactions,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const transactions = computed(() => currentGroup.value.transactions);
const totalInstructions = computed(() => transactions.value.reduce((acc, tx) => acc + tx.instructions.length, 0));
const totalBytes = computed(() => encodedTransactions.value.reduce((acc, tx) => acc + tx.length, 0));
const totalSignatures = computed(() => web3Transactions.value.reduce((acc, tx) => acc + tx.signatures.length, 0));
const totalNetworkFees = computed(() => formatRealValue(0.000005 * totalSignatures.value, 9));

// METHODS --------------------------------------------------------------------
function addTransaction(index: number) {
    let n = transactions.value.length + 1;
    while (true) {
        const name = `Transaction ${n}`;
        if (!transactions.value.some(tx => tx.name === name)) {
            transactions.value.splice(index, 0, {
                name,
                instructions: [],
                data: [],
                payer: transactions.value[transactions.value.length - 1]?.payer ?? PublicKey.default,
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
            <div class="q-pa-sm bg-grey-9 rounded-borders full-width row flex-center shadow-2 gap-x-lg gap-y-sm">
                <div>Transactions:
                    <q-badge class="text-bold q-ml-sm" color="white" text-color="dark">{{
                            transactions.length
                        }}
                    </q-badge>
                </div>
                <div>Instructions:
                    <q-badge class="text-bold q-ml-sm" color="white" text-color="dark">{{ totalInstructions }}
                    </q-badge>
                </div>
                <div>Signatures:
                    <q-badge class="text-bold q-ml-sm" color="white" text-color="dark">{{ totalSignatures }}</q-badge>
                </div>
                <div>Bytes:
                    <q-badge class="text-bold q-ml-sm" color="white" text-color="dark">{{ totalBytes }}</q-badge>
                </div>
                <div>Network fees:
                    <q-badge class="text-bold q-ml-sm" color="white" text-color="dark">{{ totalNetworkFees }} SOL
                    </q-badge>
                </div>
            </div>
            <div class="tx-v-bar"></div>
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