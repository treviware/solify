<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';

defineProps<{
    modelValue: PublicKey;
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: PublicKey): void,
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function onUpdate(value: string) {
    try {
        const pubkey = new PublicKey(value);
        emits('update:model-value', pubkey);
    } catch (e) {
        // ignore
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs" :model-value="modelValue.toString()" @update:model-value="onUpdate" outlined dense>
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope ?? {}"/>
        </template>
    </q-input>
</template>

<style lang="scss" scoped></style>