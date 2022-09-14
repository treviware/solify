<script lang="ts" setup>
import {storeToRefs} from 'pinia';
import {computed, ref, watch} from 'vue';
import {processUriStoreDataOnMounted, removeStoreDataFromUriOnUnmounted, writeToolParamsIntoUri} from 'src/utils/tools';
import base58 from 'bs58';
import {watchDebounced} from '@vueuse/core';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import {useVerifySignatureToolStore} from 'stores/tools/verifySignature';
import {PublicKey} from '@solana/web3.js';
import nacl from 'tweetnacl';

const verifySignatureToolStore = useVerifySignatureToolStore();

// REFS -----------------------------------------------------------------------
const {
    account,
    message,
    signature,
} = storeToRefs(verifySignatureToolStore);
const messageHash = ref('');

// COMPUTED -------------------------------------------------------------------
const signatureIsOk = computed(() => {
    if (!account.value) {
        return false;
    }

    let messageBytes = new TextEncoder().encode(message.value);
    let signatureBytes = base58.decode(signature.value);
    try {
        return nacl.sign.detached.verify(messageBytes, signatureBytes, account.value.toBuffer());
    } catch (e) {
        return false;
    }
});

// METHODS --------------------------------------------------------------------
async function hashMessage() {
    const utf8 = new TextEncoder().encode(message.value);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    messageHash.value = base58.encode(new Uint8Array(hashBuffer));
}

function writeToUri() {
    return writeToolParamsIntoUri({
        account: account.value ?? undefined,
        message: btoa(message.value) ?? '',
        signature: signature.value ?? '',
    });
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
    const queryAccount = query.account;
    if (queryAccount) {
        try {
            account.value = new PublicKey(queryAccount);
        } catch (e) {
        }
    }

    const queryMessage = query.message;
    if (queryMessage) {
        try {
            message.value = atob(queryMessage);
        } catch (e) {
        }
    }

    const querySignature = query.signature;
    if (querySignature) {
        try {
            message.value = querySignature;
        } catch (e) {
        }
    }

    writeToUri();
});
removeStoreDataFromUriOnUnmounted();

</script>

<template>
    <div class="q-px-lg q-py-md">
        <p>Introduce the address of the account that signed the message, the message itself and the generated signature.
            If the box becomes green, the signature is correct.</p>
        <div class="text-secondary text-caption text-bold q-mt-md">Account</div>
        <PubkeyInput v-model="account" accept-null show-wallet-button/>
        <div class="text-secondary text-caption text-bold q-mt-md">Message</div>
        <q-input v-model="message" outlined dense type="textarea" autogrow :hint="'Hash: ' + messageHash"/>
        <div class="text-secondary text-caption text-bold q-mt-md">Signature</div>
        <q-input v-model="signature" outlined dense type="textarea" autogrow/>
        <div class="flex flex-center q-mt-md">
            <q-checkbox :model-value="signatureIsOk" size="60px"/>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>