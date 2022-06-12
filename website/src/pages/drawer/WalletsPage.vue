<script lang="ts" setup>

import {useWalletStore} from 'stores/wallets';
import {storeToRefs} from 'pinia';
import WalletItem from 'components/drawer/WalletsPage/WalletItem.vue';

const walletStore = useWalletStore();

// REFS -----------------------------------------------------------------------
const {
    wallets,
} = storeToRefs(walletStore);

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function maximize() {
    for (const wallet of wallets.value) {
        wallet.listOpen = true;
    }
}

function minimize() {
    for (const wallet of wallets.value) {
        wallet.listOpen = false;
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="header row items-center justify-between q-px-lg">
        <h5>Wallets</h5>
        <div>
            <q-btn color="white" flat dense @click="maximize" round class="rounded-borders">
                <q-icon name="fa-solid fa-maximize" size="20px"/>
                <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Open all
                </q-tooltip>
            </q-btn>
            <q-btn color="white" flat dense @click="minimize" round class="rounded-borders">
                <q-icon name="fa-solid fa-minimize" size="20px"/>
                <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Close all
                </q-tooltip>
            </q-btn>
        </div>
    </div>
    <div class="q-px-lg q-py-md">
        <q-list>
            <WalletItem :address="w.address" v-for="w in wallets" :key="w.address" v-model="w.listOpen"/>
        </q-list>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>