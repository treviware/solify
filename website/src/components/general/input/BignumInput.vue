<script lang="ts" setup>
import BN from 'bn.js';

const props = defineProps<{
    modelValue: BN; min?: BN; max?: BN;
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: BN): void,
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function onUpdate(value: string) {
    try {
        let bn = new BN(value);

        if (props.max !== undefined && props.max.lt(bn)) {
            bn = props.max;
        }

        if (props.min !== undefined && props.min.gt(bn)) {
            bn = props.min;
        }

        emits('update:model-value', bn);
    } catch (e) {
        // ignore
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs" :model-value="modelValue.toString()" @update:model-value="onUpdate" outlined dense/>
</template>

<style lang="scss" scoped></style>