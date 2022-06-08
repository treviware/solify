<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';
import {computed} from 'vue';
import {copyToClipboard} from 'src/utils/clipboard';

const props = defineProps<{
    pubkey: PublicKey, showCopy?: boolean, long?: boolean
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const publickKey = computed(() => {
    const str = props.pubkey.toBase58();

    if (props.long) {
        return str;
    } else {
        return str.slice(0, 4) + '..' + str.slice(-4);
    }
});

const finalShowCopy = computed(() => {
    return props.showCopy ?? true;
});

// METHODS --------------------------------------------------------------------

function copy() {
    if (!finalShowCopy.value) {
        return;
    }

    copyToClipboard(props.pubkey.toBase58());
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-badge class="text-bold text-dark" @click="copy">
        <code>{{ publickKey }}</code>
        <q-icon v-if="finalShowCopy" name="fa-solid fa-clipboard" class="q-ml-xs"/>
    </q-badge>
</template>

<style lang="scss" scoped>
.q-badge {
    background-color: rgba(255, 255, 255, 0.6);
}
</style>