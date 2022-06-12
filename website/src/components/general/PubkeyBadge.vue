<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';
import {computed, ref} from 'vue';
import {copyToClipboard} from 'src/utils/clipboard';
import {abbreviatePubkey} from 'src/utils/wallets';

const props = defineProps<{
    pubkey: PublicKey, showCopy?: boolean, long?: boolean, showMenu?: boolean;
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
    return props.showMenu && (props.showCopy ?? true);
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

function openSolscan() {
    window.open(`https://solscan.io/account/${props.pubkey}`, '_blank');
}

function openSolanaExplorer() {
    window.open(`https://explorer.solana.com/address/${props.pubkey}`, '_blank');
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-badge class="text-bold text-white" :class="{'cursor-pointer': finalShowCopy}">
        <code>{{ publickKey }}</code>
        <q-icon v-if="finalShowCopy && !copied" name="fa-solid fa-location" class="q-ml-xs"/>
        <q-icon v-if="finalShowCopy && copied" name="fa-solid fa-circle-check" class="q-ml-xs"/>

        <q-menu anchor="bottom middle" self="top middle" :offset="[20, 0]" v-if="showMenu" :fit="long">
            <q-card class="menu-card">
                <q-card-section class="text-center text-caption text-secondary" v-if="!long">
                    {{ props.pubkey.toBase58() }}
                </q-card-section>
                <q-card-actions class="row no-wrap justify-between">
                    <q-btn @click="copy" flat color="white" class="rounded-borders" v-close-popup round>
                        <q-icon name="fa-solid fa-clipboard" size="20px"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy to clipboard</q-tooltip>
                    </q-btn>
                    <q-btn @click="openSolscan" flat color="white" class="rounded-borders" v-close-popup>
                        <img class="solscan-icon"
                             src="https://solscan.io/static/media/solana-solana-scan-blue.5ffb9996.svg"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">View in Solscan</q-tooltip>
                    </q-btn>
                    <q-btn @click="openSolanaExplorer" flat color="white" class="rounded-borders" v-close-popup>
                        <img class="solana-explorer-icon"
                             src="https://explorer.solana.com/static/media/dark-explorer-logo.2d910a55.svg">
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">View in Solana Explorer
                        </q-tooltip>
                    </q-btn>
                </q-card-actions>
            </q-card>
        </q-menu>
    </q-badge>
</template>

<style lang="scss" scoped>
.q-badge {
    background-color: transparentize(#fff, 0.8);
}

.menu-card {
    background-color: $grey-9;
}

.solscan-icon {
    height: 12px;
}

.solana-explorer-icon {
    height: 18px;
    width: 170px;
    object-fit: cover;
    object-position: left top;
}
</style>