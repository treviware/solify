<script lang="ts" setup>
import {
    ProgramIxnAccountDefinition, ProgramIxnArgumentDefinition, ProgramIxnNumberArgument,
} from 'src/types/programs/instructionDefinition';
import {computed} from 'vue';
import BignumInput from 'components/general/input/BignumInput.vue';
import TokenAmountInput from 'components/general/input/TokenAmountInput.vue';
import PubkeyInput from 'components/general/input/PubkeyInput.vue';
import {isPubkey} from 'src/types/filters';
import {Keypair, PublicKey} from '@solana/web3.js';
import ProgramInput from 'components/general/input/ProgramInput.vue';
import BytesInput from 'components/general/input/BytesInput.vue';

const props = defineProps<{
    argument: ProgramIxnArgumentDefinition | ProgramIxnAccountDefinition; data: any;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const dataMut = computed(() => props.data);
const pubkey = computed(() => {
    const value = dataMut.value[props.argument.id] as PublicKey | Keypair;

    return isPubkey(value) ? value : value.publicKey;
});

// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function updateNumberValue(value: string) {
    const dataArg = props.argument.data as ProgramIxnNumberArgument;

    try {
        let number: number;

        if (dataArg.float) {
            number = parseFloat(value);
        } else {
            number = parseInt(value);
        }

        if (dataArg.max !== undefined) {
            number = Math.min(number, dataArg.max);
        }

        if (dataArg.min !== undefined) {
            number = Math.max(number, dataArg.min);
        }

        if (isNaN(number)) {
            number = dataArg.defaultValue ?? 0;
        }

        dataMut.value[props.argument.id] = number;
    } catch (e) {
        // Ignore
    }
}

function updatePubkeyValue(value: PublicKey) {
    dataMut.value[props.argument.id] = value;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-md q-mt-md">
        <div class="text-secondary text-caption text-bold row q-mb-sm">
            <div>{{ argument.name }}</div>
            <div class="relative-position">
                <q-icon name="fa-regular fa-circle-question" class="q-ml-xs cursor-pointer"/>
                <q-tooltip class="bg-secondary text-dark"
                           style="font-size: 12px"
                           anchor="bottom middle"
                           self="top middle"
                           max-width="250px">
                    {{ argument.description }}
                </q-tooltip>
            </div>
            <q-space/>
            <div class="row gap-x-sm">
                <q-badge color="blue" text-color="white" v-if="argument.mutable" class="text-bold">Mutable</q-badge>
                <q-badge color="secondary" text-color="dark" v-if="argument.signer" class="text-bold">Signer
                </q-badge>
            </div>
        </div>
        <div v-if="argument.data.type === 'bool'">
            <q-toggle v-model="dataMut[argument.id]" dense :disable="argument.readonly"/>
        </div>
        <div v-else-if="argument.data.type === 'number'">
            <q-input :model-value="data[argument.id]"
                     :readonly="argument.readonly"
                     outlined
                     dense
                     @update:model-value="updateNumberValue"/>
        </div>
        <div v-else-if="argument.data.type === 'bytes'">
            <BytesInput v-model="dataMut[argument.id]"
                        :readonly="argument.readonly"
                        :max="argument.data.max"
                        outlined
                        dense/>
        </div>
        <div v-else-if="argument.data.type === 'bignum'">
            <BignumInput v-model="dataMut[argument.id]"
                         :readonly="argument.readonly"
                         outlined
                         dense
                         :max="argument.data.max"
                         :min="argument.data.min"/>
        </div>
        <div v-else-if="argument.data.type === 'bps'">
            <TokenAmountInput v-model="dataMut[argument.id]"
                              :token="argument.data.tokenAddress"
                              in-bps
                              :readonly="argument.readonly"/>
        </div>
        <div v-else-if="argument.data.type === 'string'">
            <q-input v-model="dataMut[argument.id]"
                     :readonly="argument.readonly"
                     :maxlength="argument.data.maxLength"
                     outlined
                     dense/>
        </div>
        <div v-else-if="argument.data.type === 'program'">
            <ProgramInput v-model="dataMut[argument.id]" :readonly="argument.readonly" outlined dense/>
        </div>
        <div v-else-if="argument.data.type === 'address'">
            <PubkeyInput :model-value="pubkey"
                         :readonly="argument.readonly"
                         outlined
                         dense
                         show-wallet-button
                         @update:model-value="updatePubkeyValue"/>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>