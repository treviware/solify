<script lang="ts" setup>
import {computed, ref} from 'vue';
import {TokenMeta, useBlockchainStore} from 'stores/blockchain';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import {PublicKey} from '@solana/web3.js';
import TokenSelector from 'components/general/selectors/TokenSelector.vue';

const props = defineProps<{
    modelValue: PublicKey; filter?: (a: TokenMeta) => boolean; showCoingeckoId?: boolean;
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', value: PublicKey): void;
}>();

const blockchainStore = useBlockchainStore();

// REFS -----------------------------------------------------------------------
const showSplDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
const tokenName = computed(() => {
    let meta = blockchainStore.getTokenMetadata(props.modelValue);
    return `${meta?.symbol ?? '???'} - ${meta?.name ?? 'Unknown'}`;
});

// METHODS --------------------------------------------------------------------

function onSelect(token: TokenMeta) {
    emitUpdate(token.address);
    showSplDialog.value = false;
}

function emitUpdate(newValue: PublicKey) {
    emits('update:modelValue', newValue);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <PubkeyInput :model-value="modelValue" @update:model-value="emitUpdate" :hint="tokenName" class="spl-token-input">
        <template v-slot:append>
            <q-btn round class="rounded-borders" @click="showSplDialog = true" flat>SPL</q-btn>
            <q-dialog v-model="showSplDialog">
                <TokenSelector @select="onSelect" :filter="filter" :show-coingecko-id="showCoingeckoId"/>
            </q-dialog>
        </template>
    </PubkeyInput>
</template>

<style lang="scss" scoped>
.spl-token-input:deep(.q-field__control) {
    padding-right: 0;
}
</style>