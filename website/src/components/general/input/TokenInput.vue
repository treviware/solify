<script lang="ts" setup>
import BN from 'bn.js';
import {TokenMeta} from 'stores/blockchain';
import {computed, ref} from 'vue';
import {formatBasisPoints} from 'src/utils/tokens';

const props = defineProps<{
    modelValue: BN; inBps?: boolean; token: TokenMeta; bpsLabel?: string;
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: BN): void,
}>();

// REFS -----------------------------------------------------------------------
const isBPS = ref(props.inBps);

// COMPUTED -------------------------------------------------------------------
const power = computed(() => Math.pow(10, props.token.decimals ?? 0));
const realValue = computed(() => formatBasisPoints(props.modelValue, props.token.decimals ?? 0));
const inputValue = computed(() => isBPS.value ? props.modelValue.toString() : realValue.value);
const realValueLabel = computed(() => props.token.symbol ?? '???');
const bpsValueLabel = computed(() => props.bpsLabel ?? 'BPS');
const hint = computed(() => {
    if (isBPS.value) {
        return `${realValue.value} ${realValueLabel.value}`;
    } else {
        return `${props.modelValue.toString()} ${bpsValueLabel.value}`;
    }
});

// METHODS --------------------------------------------------------------------
function onUpdate(value: string) {
    if (isBPS.value) {
        try {
            const bn = new BN(value);
            emits('update:model-value', bn);
        } catch (e) {
            // ignore
        }
    } else {
        try {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                return;
            }

            const numNormalized = Math.floor(num * power.value);
            const bn = new BN(numNormalized);
            emits('update:model-value', bn);
        } catch (e) {
            // ignore
        }
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input :model-value="inputValue" @update:model-value="onUpdate" :hint="hint" outlined dense class="token-input">
        <template v-slot:append>
            <q-btn round class="rounded-borders q-px-sm" @click="isBPS = !isBPS" flat no-caps>
                {{ isBPS ? bpsLabel : realValueLabel }}
            </q-btn>
        </template>
    </q-input>
</template>

<style lang="scss" scoped>
.token-input:deep(.q-field__control) {
    padding-right: 0;
}
</style>