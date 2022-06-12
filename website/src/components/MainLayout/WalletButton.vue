<script lang="ts" setup>
import {computed} from 'vue';
import {useWallet, Wallet} from 'solana-wallets-vue';
import {PublicKey} from '@solana/web3.js';
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import {sleep} from 'src/utils/time';
import {abbreviatePubkey} from 'src/utils/wallets';

const rightDrawerStore = useRightDrawerStore();
const walletStore = useWallet();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const pubkeyAbbreviation = computed(() => abbreviatePubkey(walletStore.publicKey.value ?? PublicKey.default));

// METHODS --------------------------------------------------------------------

async function connect(wallet: Wallet) {
    if (wallet.readyState !== 'Installed') {
        window.open(wallet.url, '_blank');
    }

    try {
        walletStore.select(wallet.name);
        await sleep(100);
        await walletStore.connect();
    } catch (e) {
        console.error('Failed to connect the wallet', e);
    }
}

async function disconnect() {
    try {
        await walletStore.disconnect();
    } catch (e) {
        console.error('Failed to disconnect the wallet', e);
    }
}

function openWallets() {
    rightDrawerStore.open(RightDrawerState.Wallets);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-btn class="wallet-button" color="secondary" no-caps outline>
        <template v-if="walletStore.connected.value">
            <img :src="walletStore.wallet.value.icon" class="q-mr-sm icon-image">
            {{ pubkeyAbbreviation }}
        </template>
        <template v-else-if="walletStore.connecting.value">
            <q-spinner size="16px" class="q-mr-sm"/>
            Connecting...
        </template>
        <template v-else>
            <q-icon name="fa-solid fa-wallet" size="16px" class="q-mr-sm"/>
            Connect Wallet
        </template>

        <q-menu fit>
            <q-card>
                <q-list>
                    <q-item clickable v-close-popup @click="openWallets">
                        <q-item-section class="text-center text-bold">Show wallets</q-item-section>
                    </q-item>
                    <q-separator/>
                    <q-item clickable v-close-popup @click="disconnect" v-if="walletStore.connected.value">
                        <q-item-section class="text-negative text-center text-bold">Disconnect</q-item-section>
                    </q-item>

                    <template v-else-if="!walletStore.connecting.value">
                        <q-item-label header class="q-py-sm q-px-md text-secondary text-caption text-bold">Connect:
                        </q-item-label>
                        <q-item v-for="w in walletStore.wallets.value"
                                :key="w.name"
                                clickable
                                v-close-popup
                                @click="connect(w)">
                            <q-item-section avatar>
                                <q-img :src="w.icon" height="20px" width="20px"/>
                            </q-item-section>
                            <q-item-section> {{ w.name }}</q-item-section>
                            <q-item-section side v-if="w.readyState !== 'Installed'">
                                <q-icon name="fa-solid fa-arrow-up-right-from-square"
                                        size="10px"
                                        class="q-ml-xs"
                                        color="grey-4"/>
                            </q-item-section>
                        </q-item>
                    </template>
                </q-list>
            </q-card>
        </q-menu>
    </q-btn>
</template>

<style lang="scss" scoped>
.wallet-button {
    min-width: 156px;
}

.dialog-card {
    min-width: 300px;
    max-width: 100vw;

    h5 {
        font-size: 30px;
    }
}

.icon-image {
    height: 16px;
    width: 16px;
}

.q-list:deep(.q-item__section--avatar) {
    min-width: unset;
    padding-right: 12px;
}
</style>