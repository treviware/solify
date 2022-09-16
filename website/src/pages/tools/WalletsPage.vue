<script lang="ts" setup>
import {useWalletListStore} from 'stores/tools/walletList';
import {storeToRefs} from 'pinia';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {computed, ref} from 'vue';
import {Keypair, PublicKey} from '@solana/web3.js';
import {useQuasar} from 'quasar';
import WalletItem from 'components/tools/WalletsPage/WalletItem.vue';
import AlertBox from 'components/general/AlertBox.vue';
import base58 from 'bs58';

const rightDrawerStore = useRightDrawerStore();
const walletListStore = useWalletListStore();
const quasar = useQuasar();

// REFS -----------------------------------------------------------------------
const newWallet = ref('');
const {
    wallets,
} = storeToRefs(walletListStore);
const {
    drawerTopButtons,
} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------
const newWalletPubkey = computed(() => {
    try {
        return new PublicKey(newWallet.value);
    } catch (e) {
        return null;
    }
});

const newWalletAKeypair = computed(() => {
    try {
        return Keypair.fromSecretKey(base58.decode(newWallet.value));
    } catch (e) {
        return null;
    }
});

const isNewWalletOk = computed(() => newWalletPubkey.value !== null || newWalletAKeypair.value !== null);

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
    const address = newWalletPubkey.value ?? newWalletAKeypair.value!.publicKey;
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

    // Generate name.
    let walletName = '';
    let nameIndex = 0;
    do {
        nameIndex += 1;
        walletName = `Wallet ${nameIndex}`;
    } while (walletListStore.wallets.find(v => v.name === walletName));

    wallets.value.push({
        name: walletName,
        address,
        keypair: newWalletAKeypair.value,
        listOpen: false,
        isLoaded: false,
        tokens: [],
        amount: 0,
    });
    newWallet.value = '';
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
                <q-input v-model="newWallet"
                         outlined
                         dense
                         placeholder="Wallet address or keypair in base58 format"
                         class="col"/>
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
            <q-item>
                <AlertBox type="warning" class="full-width">
                    <div>Introducing a keypair will create a wallet with ability to automatically sign transactions ONLY
                        under your request. Otherwise it will create a readonly wallet.
                    </div>
                </AlertBox>
            </q-item>
        </q-list>
    </div>
</template>

<style lang="scss" scoped></style>