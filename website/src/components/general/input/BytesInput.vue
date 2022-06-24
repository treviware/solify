<script lang="ts" setup>
import {computed, ref} from 'vue';
import AccountSizeSelector from 'components/general/selectors/AccountSelector.vue';
import {AccountInfoElement} from 'src/types/accounts';

const props = defineProps<{
    modelValue: number;
}>();
const emits = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

// REFS -----------------------------------------------------------------------

const showSplDialog = ref(false);

// COMPUTED -------------------------------------------------------------------
const byteInHigherUnits = computed(() => {
    const kib = props.modelValue / 1024;
    const mib = kib / 1024;
    const gib = mib / 1024;

    if (gib >= 1) {
        return `≈ ${gib.toFixed(2)} GiB`;
    }

    if (mib >= 1) {
        return `≈ ${mib.toFixed(2)} MiB`;
    }

    if (kib >= 1) {
        return `≈ ${kib.toFixed(2)} KiB`;
    }

    return `= ${props.modelValue} B`;
});

// METHODS --------------------------------------------------------------------

function onBytesUpdate(newValue: number) {
    emits('update:modelValue', Math.floor(newValue));
}

function onSelect(account: AccountInfoElement) {
    emits('update:modelValue', account.account.minSize);
    showSplDialog.value = false;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs"
             :model-value="modelValue"
             outlined
             dense
             :hint="byteInHigherUnits"
             :debounce="300"
             class="bytes-input"
             @update:model-value="onBytesUpdate">
        <template v-slot:append>
            <q-btn round class="rounded-borders q-px-sm" @click="showSplDialog = true" flat no-caps>Account</q-btn>
            <q-dialog v-model="showSplDialog">
                <AccountSizeSelector @select="onSelect" show-size/>
            </q-dialog>
        </template>
    </q-input>
</template>

<style lang="scss" scoped>
.bytes-input:deep(.q-field__control) {
    padding-right: 0;
}
</style>