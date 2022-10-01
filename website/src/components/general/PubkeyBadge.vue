<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';
import {computed, ref} from 'vue';
import {abbreviatePubkey} from 'src/utils/wallets';
import {copyToClipboard} from 'quasar';
import {useSolanaStore} from 'stores/solana';
import {EXPLORER_DEFINITIONS} from 'src/constants/explorers';
import {ExplorerAction} from 'src/types/explorers';

const props = defineProps<{
    pubkey: PublicKey, showCopy?: boolean, long?: boolean, showMenu?: boolean;
}>();

const solanaStore = useSolanaStore();

// REFS -----------------------------------------------------------------------
const copied = ref(false);

// COMPUTED -------------------------------------------------------------------
const publicKey = computed(() => {
    if (props.long) {
        return props.pubkey.toBase58();
    } else {
        return abbreviatePubkey(props.pubkey);
    }
});

const finalShowCopy = computed(() => {
    return props.showMenu && (props.showCopy ?? true);
});

const explorer = computed(() => {
    return EXPLORER_DEFINITIONS.find((e) => e.url === solanaStore.explorer)!;
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

function openInExplorer() {
    const url = explorer.value.resolver(ExplorerAction.Address, props.pubkey.toBase58(), solanaStore.network);
    window.open(url, '_blank');
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-badge class="text-bold text-white" :class="{'cursor-pointer': finalShowCopy}">
        <code>{{ publicKey }}</code>
        <q-icon v-if="finalShowCopy && !copied" name="fa-solid fa-location" class="q-ml-xs"/>
        <q-icon v-if="finalShowCopy && copied" name="fa-solid fa-circle-check" class="q-ml-xs"/>

        <q-menu anchor="bottom middle" self="top middle" :offset="[20, 0]" v-if="showMenu" :fit="long">
            <q-card class="menu-card shadow-9">
                <q-card-section class="text-center text-caption text-secondary" v-if="!long">
                    {{ props.pubkey.toBase58() }}
                </q-card-section>
                <q-separator/>
                <q-list dense separator>
                    <q-item clickable @click="copy" v-close-popup>
                        <q-item-section avatar>
                            <q-icon name="fa-solid fa-clipboard" size="14px"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Copy to clipboard</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item clickable @click="openInExplorer" v-close-popup>
                        <q-item-section avatar>
                            <q-icon name="fa-solid fa-arrow-up-right-from-square" size="14px"/>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>View in {{ explorer.name }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
        </q-menu>
    </q-badge>
</template>

<style lang="scss" scoped>
.q-badge {
  background-color: transparentize(#ffffff, 0.8);
}

.menu-card {
  &:deep(.q-item__section--avatar) {
    min-width: 30px;
  }
}
</style>