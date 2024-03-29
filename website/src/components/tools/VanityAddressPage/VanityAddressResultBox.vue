<script lang="ts" setup>
import {VanityAddressResult} from 'src/types/tools/vanityAddress';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import base58 from 'bs58';
import {computed} from 'vue';
import {copyToClipboard, useQuasar} from 'quasar';
import {useGlobalStore} from 'stores/global';

const props = defineProps<{
    result: VanityAddressResult; index: number
}>();

const quasar = useQuasar();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const keypairStr = computed(() => base58.encode(props.result.keypair.secretKey));

// METHODS --------------------------------------------------------------------
async function copyKeypair() {
    try {
        await copyToClipboard(keypairStr.value);
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
    <q-card>
        <q-card-section>
            <div class="row justify-between items-center">
                <div>Result {{ index + 1 }}</div>
                <div>
                    <PubkeyBadge :pubkey="result.keypair.publicKey" show-menu show-copy :long="!globalStore.isMobile"/>
                </div>
            </div>
            <div>Matched rule: {{ result.rule }}</div>
            <q-input :model-value="keypairStr" outlined dense type="textarea" readonly class="keypair-input" autogrow>
                <template v-slot:append>
                    <q-btn dense flat round size="sm" class="rounded-borders" @click="copyKeypair">
                        <q-icon name="fa-solid fa-clipboard" size="14px"/>
                        <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Copy keypair</q-tooltip>
                    </q-btn>
                </template>
            </q-input>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.keypair-input {
    &:deep(textarea) {
        resize: none;
    }
}
</style>