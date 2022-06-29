<script lang="ts" setup>
import {ref} from 'vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import {PublicKey} from '@solana/web3.js';
import ProgramSelector from 'components/general/selectors/ProgramSelector.vue';
import {ProgramDefinition} from 'src/types/programs/programDefinition';

defineProps<{
    modelValue: PublicKey;
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', value: PublicKey): void;
}>();

// REFS -----------------------------------------------------------------------
const showProgramDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onSelect(program: ProgramDefinition<any, any>) {
    emitUpdate(program.address);
    showProgramDialog.value = false;
}

function emitUpdate(newValue: PublicKey) {
    emits('update:modelValue', newValue);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <PubkeyInput :model-value="modelValue" @update:model-value="emitUpdate" hint="Pick a program" class="program-input">
        <template v-slot:append>
            <q-btn round class="rounded-borders q-px-sm" @click="showProgramDialog = true" flat>Program</q-btn>
            <q-dialog v-model="showProgramDialog">
                <ProgramSelector @select="onSelect"/>
            </q-dialog>
        </template>
    </PubkeyInput>
</template>

<style lang="scss" scoped>
.program-input:deep(.q-field__control) {
    padding-right: 0;
}
</style>