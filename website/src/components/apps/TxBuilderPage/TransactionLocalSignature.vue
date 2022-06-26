<script lang="ts" setup>
import {computed} from 'vue';
import {SignatureInfo} from 'src/types/instructions';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import {useWallet} from 'solana-wallets-vue';
import KeypairInput from 'components/general/input/KeypairInput.vue';
import {Keypair} from '@solana/web3.js';
import {useQuasar} from 'quasar';

const props = defineProps<{
    signature: SignatureInfo;
}>();

const quasar = useQuasar();
const wallet = useWallet();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const signatureMut = computed(() => props.signature);
const isConnectedWallet = computed(
    () => wallet.publicKey.value && props.signature.pubkey.equals(wallet.publicKey.value));
const useKeypair = computed(() => signatureMut.value.type === 'keypair');

// METHODS --------------------------------------------------------------------
function update(newValue: boolean) {
    if (newValue) {
        signatureMut.value.type = 'keypair';
    } else {
        signatureMut.value.type = 'localWallet';
    }
}

function updateKeypair(keypair: Keypair) {
    if (!keypair.publicKey.equals(props.signature.pubkey)) {
        quasar.notify({
            color: 'negative',
            message: 'The keypair does not belong to the requested pubkey',
        });

        return;
    }

    signatureMut.value.keypair = keypair;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item>
        <q-item-section class="q-py-sm">
            <q-item-label class="row gap-x-md justify-between">
                <PubkeyBadge long :pubkey="signature.pubkey"/>
                <q-badge color="primary" v-if="signature.provided">Provided</q-badge>
                <q-badge color="primary" v-else-if="isConnectedWallet">Connected Wallet</q-badge>
                <q-toggle color="primary"
                          v-else
                          label="Use keypair?"
                          left-label
                          dense
                          size="sm"
                          :model-value="useKeypair"
                          @update:model-value="update"/>
            </q-item-label>
            <q-item-label v-if="useKeypair" class="q-mt-sm">
                <KeypairInput :model-value="signature.keypair ?? null"
                              accept-null
                              outlined
                              dense
                              :rows="2"
                              @update:model-value="updateKeypair"/>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>