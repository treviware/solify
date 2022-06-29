<script lang="ts" setup>
import {useTxBuilderApp} from 'stores/apps/txBuilder';
import {storeToRefs} from 'pinia';
import {computed, ref} from 'vue';
import {PACKET_DATA_SIZE} from '@solana/web3.js';
import AlertBox from 'components/general/AlertBox.vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import InstructionSelector from 'components/general/selectors/InstructionSelector.vue';
import {InstructionInfoElement} from 'src/types/instructions';
import InstructionView from 'components/apps/TxBuilderPage/InstructionView.vue';
import {encodeToURI} from 'src/utils/strings';
import {copyToClipboard, useQuasar} from 'quasar';

const props = defineProps<{
    index: number;
}>();

const quasar = useQuasar();
const txBuilderApp = useTxBuilderApp();

// REFS -----------------------------------------------------------------------
const {
    currentGroup,
    web3Transactions,
    encodedTransactions,
} = storeToRefs(txBuilderApp);
const ixnPosition = ref(0);
const showIxnSelectorDialog = ref(false);

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
function openIxnSelector(index: number) {
    ixnPosition.value = index;
    showIxnSelectorDialog.value = true;
}

function selectInstruction(instruction: InstructionInfoElement) {
    transaction.value.instructions.splice(ixnPosition.value, 0, instruction.instruction);
    transaction.value.data.splice(ixnPosition.value, 0, instruction.instruction.instantiate(instruction.instruction));
    showIxnSelectorDialog.value = false;
    ixnPosition.value = 0;
}

async function simulate() {
    const tx = web3Transactions.value[props.index];
    const encoded = tx.serializeMessage().toString('base64');
    const uriEncoded = encodeToURI(encoded);
    window.open(`https://explorer.solana.com/tx/inspector?message=${uriEncoded}`);
}

async function copyEncoded() {
    const tx = web3Transactions.value[props.index];
    const encoded = tx.serializeMessage().toString('base64');

    try {
        await copyToClipboard(encoded);
        quasar.notify({
            message: 'Copied!',
            color: 'positive',
            badgeColor: 'positive',
        });
    } catch (e) {
        console.error('Error copying to clipboard', e);
        quasar.notify({
            message: 'Error copying to clipboard',
            color: 'negative',
            badgeColor: 'negative',
        });
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="tx-box shadow-2 full-width rounded-borders overflow-hidden">
        <q-bar class="justify-between">
            <div class="cursor-pointer text-no-wrap">
                <b>#{{ index + 1 }} {{ transaction.name }}</b>
                <q-popup-edit v-model="transaction.name" auto-save v-slot="scope">
                    <q-input v-model="scope.value" :maxlength="20" dense autofocus @keyup.enter="scope.set"/>
                </q-popup-edit>
            </div>
            <div class="row no-wrap gap-sm">
                <q-btn dense flat icon="fa-solid fa-file" size="sm" @click="copyEncoded">
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy encoded</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="fa-solid fa-laptop-file" size="sm" @click="simulate">
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Simulate in Solana Explorer
                    </q-tooltip>
                </q-btn>
                <q-separator vertical/>
                <q-btn dense flat icon="fa-solid fa-chevron-up" :disable="!canMoveUp" size="sm" @click="moveUp"/>
                <q-btn dense flat icon="fa-solid fa-chevron-down" :disable="!canMoveDown" size="sm" @click="moveDown"/>
                <q-btn dense flat icon="fa-solid fa-trash" size="sm" color="negative" @click="remove"/>
            </div>
        </q-bar>
        <q-separator/>
        <q-bar class="justify-center gap-x-md">
            <div>Fee payer:</div>
            <PubkeyInput v-model="transaction.payer" dense class="fee-payer-input col" show-wallet-button/>
        </q-bar>
        <AlertBox type="error" v-if="isBiggerThanPackageSize">
            <div>The size of this transaction exceeds the maximum allowed for a single transaction which is {{
                    PACKET_DATA_SIZE
                }} bytes. Please move one instruction to another transaction or try to decrease the size of any
                parameter.
            </div>
        </AlertBox>
        <div class="column flex-center">
            <template v-for="(_, i) in transaction.instructions" :key="i">
                <div class="tx-v-bar"></div>
                <q-btn unelevated
                       color="secondary"
                       text-color="dark"
                       size="sm"
                       label="Add instruction"
                       class="text-bold"
                       @click="openIxnSelector(i)"/>
                <div class="tx-v-bar"></div>
                <div class="q-px-lg full-width">
                    <InstructionView :transaction="transaction" :index="i" :transaction-index="index"/>
                </div>
            </template>
            <div class="tx-v-bar"></div>
            <q-btn unelevated
                   color="secondary"
                   text-color="dark"
                   size="sm"
                   label="Add instruction"
                   class="text-bold"
                   @click="openIxnSelector(transaction.instructions.length)"/>
            <div class="tx-v-bar"></div>
        </div>
        <q-dialog v-model="showIxnSelectorDialog">
            <InstructionSelector @select="selectInstruction" v-if="showIxnSelectorDialog"/>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.q-bar {
    flex-wrap: wrap !important;
    height: unset;
    padding-top: 4px;
    padding-bottom: 4px;

    & > div {
        margin-left: 0;
    }
}

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

    &:deep(.q-field__control),
    &:deep(.q-field__append),
    {
        height: 26px;
    }
}
</style>