<script lang="ts" setup>
import {VanityAddressResult} from 'src/types/tools/vanityAddress';
import PubkeyBadge from 'components/general/PubkeyBadge.vue';
import base58 from 'bs58';
import {computed} from 'vue';
import {copyToClipboard} from 'quasar';

const props = defineProps<{
    result: VanityAddressResult; index: number
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const keypairStr = computed(() => base58.encode(props.result.keypair.secretKey));

// METHODS --------------------------------------------------------------------
function copyKeypair() {
    copyToClipboard(keypairStr.value);
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
                    <PubkeyBadge :pubkey="result.keypair.publicKey" show-menu show-copy long/>
                </div>
            </div>
            <div>Matched rule: {{ result.rule }}</div>
            <q-input :model-value="keypairStr" outlined dense type="textarea" readonly class="keypair-input" autogrow>
                <template v-slot:after>
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