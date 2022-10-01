<script lang="ts" setup>
import AlertBox from 'components/general/AlertBox.vue';
import {computed} from 'vue';
import {Keypair} from '@solana/web3.js';
import base58 from 'bs58';
import {useKeypairFormatterToolStore} from 'stores/tools/keypairFormatter';
import {storeToRefs} from 'pinia';
import {copyToClipboard, useQuasar} from 'quasar';

const quasar = useQuasar();
const keypairFormatterToolStore = useKeypairFormatterToolStore();

// REFS -----------------------------------------------------------------------
const {keypair} = storeToRefs(keypairFormatterToolStore);

// COMPUTED -------------------------------------------------------------------
const pubkey = computed(() => keypair.value ? keypair.value.publicKey.toBase58() : '');
const keypairStr = computed(() => keypair.value ? base58.encode(keypair.value.secretKey) : '');
const keypairBytes = computed(() => keypair.value ? `[${keypair.value.secretKey.toString()}]` : '');

// METHODS --------------------------------------------------------------------

function update(value: string) {
    if (value === '') {
        keypair.value = null;
        return;
    }

    try {
        const json = JSON.parse(value);
        const bytes = Uint8Array.from(json);
        keypair.value = Keypair.fromSecretKey(bytes);
        return;
    } catch (e) {
    }

    try {
        const bytes = base58.decode(value);
        keypair.value = Keypair.fromSecretKey(bytes);
    } catch (e) {
    }
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
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md keypair-generator">
        <AlertBox type="warning">
            <div>This tool does not send anything though internet so it is safe to use. Anyways if you want to
                make sure of it, you can disconnect the internet and use this tool offline.
            </div>
        </AlertBox>
        <p class="q-my-md">Paste your keypair in any field to see all the encodings.</p>
        <div class="text-secondary text-caption text-bold q-mt-md">Pubkey</div>
        <q-input :model-value="pubkey" outlined dense readonly>
            <template v-slot:append v-if="keypair">
                <q-btn dense flat round size="sm" class="rounded-borders" @click="copy(pubkey)">
                    <q-icon name="fa-solid fa-clipboard" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy keypair</q-tooltip>
                </q-btn>
            </template>
        </q-input>
        <div class="text-secondary text-caption text-bold q-mt-md">Base58 Encoding</div>
        <q-input :model-value="keypairStr" outlined dense type="textarea" autogrow @update:model-value="update">
            <template v-slot:append v-if="keypair">
                <q-btn dense flat round size="sm" class="rounded-borders" @click="copy(keypairStr)">
                    <q-icon name="fa-solid fa-clipboard" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy keypair</q-tooltip>
                </q-btn>
            </template>
        </q-input>
        <div class="text-secondary text-caption text-bold q-mt-md">Byte array Encoding</div>
        <q-input :model-value="keypairBytes" outlined dense type="textarea" autogrow @update:model-value="update">
            <template v-slot:append v-if="keypair">
                <q-btn dense flat round size="sm" class="rounded-borders" @click="copy(keypairBytes)">
                    <q-icon name="fa-solid fa-clipboard" size="14px"/>
                    <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy keypair</q-tooltip>
                </q-btn>
            </template>
        </q-input>
    </div>
</template>

<style lang="scss" scoped>
code {
  font-size: 0.9em;
  background-color: rgba(0, 0, 0, 0.5);
  padding-left: 2px;
  padding-right: 2px;
  border-radius: 4px;
}

.keypair-formatter {
  &:deep(textarea) {
    resize: none;
  }
}
</style>