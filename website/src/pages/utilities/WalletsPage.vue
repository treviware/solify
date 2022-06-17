<script lang="ts" setup>

import {useWalletStore} from 'stores/wallets';
import {storeToRefs} from 'pinia';
import WalletItem from 'components/drawer/WalletsPage/WalletItem.vue';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {computed, ref} from 'vue';
import {PublicKey} from '@solana/web3.js';
import {useQuasar} from 'quasar';

const rightDrawerStore = useRightDrawerStore();
const walletStore = useWalletStore();
const quasar = useQuasar();

// REFS -----------------------------------------------------------------------
const newWallet = ref('');
const {
    wallets,
} = storeToRefs(walletStore);
const {
    drawerTopButtons,
} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------
const isNewWalletOk = computed(() => {
    try {
        new PublicKey(newWallet.value);
        return true;
    } catch (e) {
        return false;
    }
});

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

function addWallet() {
    const address = new PublicKey(newWallet.value);
    const index = wallets.value.findIndex(wallet => wallet.address.equals(address));

    if (index >= 0) {
        quasar.notify({
            message: 'Wallet already exists',
            color: 'warning',
            badgeColor: 'warning',
            textColor: 'black',
            badgeTextColor: 'black',
        });
        return;
    }

    wallets.value.push({
        address,
        listOpen: false,
        isLoaded: false,
        tokens: [],
        amount: 0,
    });
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md">
        <Teleport :to="drawerTopButtons" v-if="drawerTopButtons">
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
        </Teleport>
        <q-list>
            <WalletItem :address="w.address" v-for="w in wallets" :key="w.address" v-model="w.listOpen"/>
            <q-item class="flex row justify-between items-stretch gap-md">
                <q-input v-model="newWallet" outlined dense placeholder="Add new wallet" class="col"/>
                <q-btn color="primary"
                       unelevated
                       class="q-ml-md"
                       no-caps
                       no-wrap
                       :disable="!isNewWalletOk"
                       @click="addWallet">
                    Add wallet
                </q-btn>
            </q-item>
        </q-list>
    </div>
</template>

<style lang="scss" scoped></style>