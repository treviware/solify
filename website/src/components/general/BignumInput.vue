<script lang="ts" setup>
import BN from 'bn.js';

defineProps<{
    modelValue: BN;
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: BN): void,
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onUpdate(value: string) {
    try {
        const bn = new BN(value);
        emits('update:model-value', bn);
    } catch (e) {
        // ignore
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs" :model-value="modelValue.toString()" @update:model-value="onUpdate"/>
</template>

<style lang="scss" scoped></style>