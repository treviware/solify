<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';
import {computed, ref} from 'vue';
import {copyToClipboard} from 'src/utils/clipboard';
import {abbreviatePubkey} from 'src/utils/wallets';

const props = defineProps<{
    pubkey: PublicKey, showCopy?: boolean, long?: boolean
}>();

// REFS -----------------------------------------------------------------------
const copied = ref(false);

// COMPUTED -------------------------------------------------------------------

const publickKey = computed(() => {
    if (props.long) {
        return props.pubkey.toBase58();
    } else {
        return abbreviatePubkey(props.pubkey);
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
    copied.value = true;

    setTimeout(() => {
        copied.value = false;
    }, 2000);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-badge class="text-bold text-white" @click="copy" :class="{'cursor-pointer': finalShowCopy}">
        <code>{{ publickKey }}</code>
        <q-icon v-if="finalShowCopy && !copied" name="fa-solid fa-clipboard" class="q-ml-xs"/>
        <q-icon v-if="finalShowCopy && copied" name="fa-solid fa-circle-check" class="q-ml-xs"/>
        <q-tooltip class="text-no-wrap text-white text-bold shadow-2" v-if="!long">
            {{ props.pubkey.toBase58() }}
        </q-tooltip>
    </q-badge>
</template>

<style lang="scss" scoped>
.q-badge {
    background-color: transparentize(#fff, 0.8);
}
</style>