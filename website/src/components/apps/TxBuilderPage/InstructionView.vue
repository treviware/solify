<script lang="ts" setup>
import {computed} from 'vue';
import {TransactionDefinition} from 'src/types/transactions/transactionDefinition';
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import InstructionArgumentBox from 'components/apps/TxBuilderPage/InstructionArgumentBox.vue';

const props = defineProps<{
    transaction: TransactionDefinition<any, any>
    index: number; transactionIndex: number;
}>();

const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
} = storeToRefs(txBuilderApp);

// COMPUTED -------------------------------------------------------------------
const transactions = computed(() => currentGroup.value.transactions);
const transactionMut = computed(() => props.transaction);
const data = computed(() => props.transaction.data[props.index]);
const instruction = computed(() => props.transaction.instructions[props.index]);
const canMoveUp = computed(() => props.index > 0);
const canMoveDown = computed(() => props.index < props.transaction.instructions.length - 1);
const canMoveToPrevTransaction = computed(() => !canMoveUp.value && props.transactionIndex > 0);
const canMoveToNextTransaction = computed(
    () => !canMoveDown.value && props.transactionIndex < transactions.value.length - 1);

// COMPUTED -------------------------------------------------------------------
function remove() {
    transactionMut.value.instructions.splice(props.index, 1);
    transactionMut.value.data.splice(props.index, 1);
}

function moveUp() {
    const value = transactionMut.value.instructions.splice(props.index, 1)[0];
    const valueData = transactionMut.value.data.splice(props.index, 1)[0];
    transactionMut.value.instructions.splice(props.index - 1, 0, value);
    transactionMut.value.data.splice(props.index - 1, 0, valueData);
}

function moveDown() {
    const value = transactionMut.value.instructions.splice(props.index, 1)[0];
    const valueData = transactionMut.value.data.splice(props.index, 1)[0];
    transactionMut.value.instructions.splice(props.index + 1, 0, value);
    transactionMut.value.data.splice(props.index + 1, 0, valueData);
}

function moveToPrevTransaction() {
    const value = transactionMut.value.instructions.splice(props.index, 1)[0];
    const valueData = transactionMut.value.data.splice(props.index, 1)[0];
    const prevTransaction = transactions.value[props.transactionIndex - 1];
    prevTransaction.instructions.push(value);
    prevTransaction.data.push(valueData);
}

function moveToNextTransaction() {
    const value = transactionMut.value.instructions.splice(props.index, 1)[0];
    const valueData = transactionMut.value.data.splice(props.index, 1)[0];
    const nextTransaction = transactions.value[props.transactionIndex + 1];
    nextTransaction.instructions.unshift(value);
    nextTransaction.data.unshift(valueData);
}

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="ixn-box rounded-borders full-width">
        <div class="q-pa-sm full-width">
            <div class="row items-center q-px-md">
                <div class="ellipsis text-bold">#{{ index + 1 }} {{ instruction.name }}</div>
                <div class="relative-position">
                    <q-icon name="fa-regular fa-circle-question" class="q-ml-xs cursor-pointer"/>
                    <q-tooltip class="bg-secondary text-dark"
                               style="font-size: 12px"
                               anchor="bottom middle"
                               self="top middle"
                               max-width="250px">
                        {{ instruction.description }}
                    </q-tooltip>
                </div>
                <q-space/>
                <div class="row gap-sm">
                    <q-btn dense flat icon="fa-solid fa-chevron-up" size="sm" @click="moveUp" v-if="canMoveUp"/>
                    <q-btn dense
                           flat
                           icon="fa-solid fa-angles-up"
                           :disable="!canMoveToPrevTransaction"
                           size="sm"
                           @click="moveToPrevTransaction"
                           v-else>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Move to previous transaction
                        </q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="fa-solid fa-chevron-down" size="sm" @click="moveDown" v-if="canMoveDown"/>
                    <q-btn dense
                           flat
                           icon="fa-solid fa-angles-down"
                           :disable="!canMoveToNextTransaction"
                           size="sm"
                           @click="moveToNextTransaction"
                           v-else>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Move to next transaction
                        </q-tooltip>
                    </q-btn>
                    <q-btn dense flat icon="fa-solid fa-trash" size="sm" color="negative" @click="remove"/>
                </div>
            </div>
            <div v-for="account in instruction.accounts" :key="account.id">
                <InstructionArgumentBox :argument="account" :data="data"/>
            </div>
            <div v-for="arg in instruction.arguments" :key="arg.id">
                <InstructionArgumentBox :argument="arg" :data="data"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ixn-box {
    border: 1px solid $grey-9;
}
</style>