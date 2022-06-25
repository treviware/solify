<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed} from 'vue';
import {PACKET_DATA_SIZE} from '@solana/web3.js';
import AlertBox from 'components/general/AlertBox.vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';

const props = defineProps<{
    index: number;
}>();

const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
    encodedTransactions,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const transactions = computed(() => currentGroup.value.transactions);
const transaction = computed(() => transactions.value[props.index]);
const canMoveUp = computed(() => props.index > 0);
const canMoveDown = computed(() => props.index < transactions.value.length - 1);
const totalBytes = computed(() => encodedTransactions.value[props.index].length);
const isBiggerThanPackageSize = computed(() => totalBytes.value > PACKET_DATA_SIZE);

// COMPUTED -------------------------------------------------------------------
function remove() {
    transactions.value.splice(props.index, 1);
}

function moveUp() {
    const value = transactions.value.splice(props.index, 1)[0];
    transactions.value.splice(props.index - 1, 0, value);
}

function moveDown() {
    const value = transactions.value.splice(props.index, 1)[0];
    transactions.value.splice(props.index + 1, 0, value);
}

// METHODS --------------------------------------------------------------------
function addInstruction(index: number) {
    console.log('TODO: addInstruction', index);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="tx-box shadow-2 full-width rounded-borders overflow-hidden">
        <div class="q-pa-sm bg-grey-9 full-width">
            <div class="row items-center">
                <div class="cursor-pointer ellipsis">
                    <b style="font-size: 16px">{{ transaction.name }}</b>
                    <q-popup-edit v-model="transaction.name" auto-save v-slot="scope">
                        <q-input v-model="scope.value" :maxlength="20" dense autofocus @keyup.enter="scope.set"/>
                    </q-popup-edit>
                </div>
                <q-space/>
                <div class="row gap-sm">
                    <q-btn dense flat icon="fa-solid fa-chevron-up" :disable="!canMoveUp" size="sm" @click="moveUp"/>
                    <q-btn dense
                           flat
                           icon="fa-solid fa-chevron-down"
                           :disable="!canMoveDown"
                           size="sm"
                           @click="moveDown"/>
                    <q-btn dense flat icon="fa-solid fa-trash" size="sm" color="negative" @click="remove"/>
                </div>
            </div>
            <q-separator class="q-my-sm"/>
            <div class="row flex-center no-wrap gap-sm">
                <div>Fee payer:</div>
                <PubkeyInput v-model="transaction.payer" dense class="fee-payer-input col" show-wallet-button/>
            </div>
        </div>
        <AlertBox type="error" v-if="isBiggerThanPackageSize">
            <div>The size of this transaction exceeds the maximum allowed for a single transaction which is {{
                    PACKET_DATA_SIZE
                }} bytes. Please move one instruction to another transaction or try to decrease the size of any
                parameter.
            </div>
        </AlertBox>
        <div class="column flex-center">
            <div class="tx-v-bar"></div>
            <q-btn unelevated
                   color="secondary"
                   text-color="dark"
                   size="sm"
                   label="Add instruction"
                   class="text-bold"
                   @click="addInstruction(transactions.length)"/>
            <div class="tx-v-bar"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tx-box {
    border: 1px solid $grey-9;
}

.tx-v-bar {
    width: 1px;
    background-color: $grey-9;
    height: 20px;
}

.fee-payer-input {
    max-width: 450px;
}
</style>