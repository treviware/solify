<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
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
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card>
        <q-card-section>
            <div class="row items-center justify-between text-caption text-bold">
                <div class="text-secondary">Transactions</div>
                <div>{{ transactions.length }}</div>
            </div>
            <div>
                <div class="row items-center justify-between text-caption text-bold text-secondary">Instructions
                </div>
                <div class="text-caption text-right text-bold row justify-between"
                     v-for="(tx, i) in transactions"
                     :key="i">
                    <div class="q-pl-md">{{ tx.name }}</div>
                    <div>{{ tx.instructions.length }}</div>
                </div>
                <q-separator/>
                <div class="text-caption text-right text-bold">{{ totalInstructions }}</div>
            </div>
            <div>
                <div class="row items-center justify-between text-caption text-bold text-secondary">Signatures
                </div>
                <div class="text-caption text-right text-bold row justify-between"
                     v-for="(tx, i) in web3Transactions"
                     :key="i">
                    <div class="q-pl-md">{{ transactions[i].name }}</div>
                    <div>{{ tx.signatures.length }}</div>
                </div>
                <q-separator/>
                <div class="text-caption text-right text-bold">{{ totalSignatures }}</div>
            </div>
            <div>
                <div class="row items-center justify-between text-caption text-bold text-secondary">Bytes
                </div>
                <div class="text-caption text-right text-bold row justify-between"
                     v-for="(tx, i) in encodedTransactions"
                     :key="i">
                    <div class="q-pl-md">{{ transactions[i].name }}</div>
                    <div>{{ tx.length }}</div>
                </div>
                <q-separator/>
                <div class="text-caption text-right text-bold">{{ totalBytes }}</div>
            </div>
            <div>
                <div class="row items-center justify-between text-caption text-bold text-secondary">Network fees
                </div>
                <div class="text-caption text-right text-bold row justify-between"
                     v-for="(tx, i) in web3Transactions"
                     :key="i">
                    <div class="q-pl-md">{{ transactions[i].name }}</div>
                    <div>{{ formatRealValue(0.000005 * tx.signatures.length, 9) }} SOL</div>
                </div>
                <q-separator/>
                <div class="text-caption text-right text-bold">{{ totalNetworkFees }} SOL</div>
            </div>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped></style>