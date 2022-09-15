<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {computed, ref, watch} from 'vue';
import AlertBox from 'components/general/AlertBox.vue';
import {copyToClipboard, useQuasar} from 'quasar';
import {processUriStoreDataOnMounted, removeStoreDataFromUriOnUnmounted, writeToolParamsIntoUri} from 'src/utils/tools';
import {useSignMessageToolStore} from 'stores/tools/signMessage';
import base58 from 'bs58';
import {watchDebounced} from '@vueuse/core';
import {useWallet} from 'src/lib/WalletAdapter';
import {PublicKey} from '@solana/web3.js';

const quasar = useQuasar();
const wallet = useWallet();
const signMessageToolStore = useSignMessageToolStore();

// REFS -----------------------------------------------------------------------
const {
    message,
} = storeToRefs(signMessageToolStore);
const loading = ref(false);
const messageHash = ref('');
const signature = ref('');
const signatureMessage = ref('');
const signaturePubkey = ref<PublicKey | null>(null);

// COMPUTED -------------------------------------------------------------------
const isWalletConnected = computed(() => wallet.connected.value);
const signatureError = computed(() => {
    if (signature.value === '') {
        return '';
    }

    if (message.value !== signatureMessage.value) {
        return 'This signature belongs to another message';
    }

    console.log(wallet.publicKey.value?.toBase58(), signaturePubkey.value?.toBase58());
    if (wallet.publicKey.value?.toBase58() !== signaturePubkey.value?.toBase58()) {
        return 'This signature belongs to another wallet';
    }

    return '';
});

// METHODS --------------------------------------------------------------------
async function signMessage() {
    loading.value = true;

    try {
        const bytes = new TextEncoder().encode(message.value);
        const result = await wallet.signMessage.value!(bytes);
        signature.value = base58.encode(result);
        signatureMessage.value = message.value;
        signaturePubkey.value = wallet.publicKey.value;
    } catch (e) {
        console.error('Cannot sign message', e);
        quasar.notify({
            message: 'Cannot sign message',
            color: 'negative',
        });
    } finally {
        loading.value = false;
    }
}

async function hashMessage() {
    const utf8 = new TextEncoder().encode(message.value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    messageHash.value = base58.encode(new Uint8Array(hashBuffer));
}

function writeToUri() {
    return writeToolParamsIntoUri({
        message: btoa(message.value) ?? '',
    });
}

async function copy(data: string) {
    try {
        await copyToClipboard(data);
        quasar.notify({
            message: 'Copied!',
            color: 'positive',
            badgeColor: 'positive',
        });
    } catch (e) {
        console.error('Error copying to clipboard', e);
        quasar.notify({
            message: 'Error copying to clipboard',
            color: 'negative',
            badgeColor: 'negative',
        });
    }
}

// WATCHES --------------------------------------------------------------------
watch([message], () => {
    writeToUri();
});
watchDebounced(message, hashMessage, {
    debounce: 500,
    maxWait: 1000,
    immediate: true,
});

// HOOKS ----------------------------------------------------------------------
processUriStoreDataOnMounted((query) => {
    const queryMessage = query.message;
    if (queryMessage) {
        try {
            message.value = atob(queryMessage);
        } catch (e) {
        }
    }

    writeToUri();
});
removeStoreDataFromUriOnUnmounted();

</script>

<template>
    <div class="q-px-lg q-py-md">
        <p>Type the message you want to sign:</p>
        <div class="text-secondary text-caption text-bold q-mt-md">Message</div>
        <q-input v-model="message" outlined dense type="textarea" autogrow :hint="'Hash: ' + messageHash"/>
        <div class="text-secondary text-caption text-bold q-mt-md">Signature</div>
        <q-input :model-value="signature" outlined dense type="textarea" autogrow readonly>
            <template v-slot:append v-if="signature">
                <q-btn dense flat round size="sm" class="rounded-borders" @click="copy(signature)">
                    <q-icon name="fa-solid fa-clipboard" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy signature</q-tooltip>
                </q-btn>
            </template>
        </q-input>
        <AlertBox type="warning" class="q-my-md" v-if="!isWalletConnected">
            <div>Please connect the wallet to sign up the message</div>
        </AlertBox>
        <AlertBox type="error" class="q-my-md" v-else-if="signatureError">
            <div>{{ signatureError }}</div>
        </AlertBox>
        <div class="flex flex-center q-mt-md">
            <q-btn :disable="!isWalletConnected"
                   color="secondary"
                   text-color="black"
                   unelevated
                   no-caps
                   :loading="loading"
                   @click="signMessage">
                Sign message
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>