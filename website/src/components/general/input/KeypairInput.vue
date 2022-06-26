<script lang="ts" setup>
import {Keypair} from '@solana/web3.js';
import base58 from 'bs58';
import {computed} from 'vue';

const props = defineProps<{
    modelValue: Keypair | null; acceptNull?: boolean
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: Keypair | null): void,
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const value = computed(() => {
    if (props.modelValue) {
        return base58.encode(props.modelValue.secretKey);
    } else {
        return '';
    }
});

// METHODS --------------------------------------------------------------------
function onUpdate(value: string) {
    try {
        const json = JSON.parse(value);
        const bytes = Uint8Array.from(json);
        emits('update:model-value', Keypair.fromSecretKey(bytes));
        return;
    } catch (e) {
    }

    try {
        const bytes = base58.decode(value);
        emits('update:model-value', Keypair.fromSecretKey(bytes));
        return;
    } catch (e) {
        if (props.acceptNull) {
            emits('update:model-value', null);
        }
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs"
             :model-value="value"
             @update:model-value="onUpdate"
             outlined
             dense
             autogrow
             placeholder="Keypair"
             class="keypair-input"
             type="textarea">
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope ?? {}"/>
        </template>
    </q-input>
</template>

<style lang="scss" scoped>
.keypair-input {
    &:deep(textarea) {
        resize: none;
    }
}
</style>