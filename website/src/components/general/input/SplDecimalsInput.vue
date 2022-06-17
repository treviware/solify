<script lang="ts" setup>
import {MAX_SPL_DECIMALS} from 'src/constants';
import TokenSelector from 'components/general/TokenSelector.vue';
import {ref} from 'vue';
import {TokenMeta} from 'stores/blockchain';

defineProps<{
    modelValue: number;
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

// REFS -----------------------------------------------------------------------

const showSplDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onSelect(token: TokenMeta) {
    emitUpdate(token.decimals ?? 0);
    showSplDialog.value = false;
}

function emitUpdate(newValue: number) {
    emits('update:modelValue', newValue);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input :model-value="modelValue"
             outlined
             dense
             min="0"
             :max="MAX_SPL_DECIMALS"
             class="decimals-input"
             step="1"
             :hint="'Max = ' + MAX_SPL_DECIMALS"
             @update:model-value="emitUpdate">
        <template v-slot:append>
            <q-btn round class="rounded-borders" @click="showSplDialog = true" flat>SPL</q-btn>
            <q-dialog v-model="showSplDialog">
                <TokenSelector @select="onSelect"/>
            </q-dialog>
        </template>
    </q-input>
</template>

<style lang="scss" scoped>
.decimals-input:deep(.q-field__control) {
    padding-right: 0;
}
</style>