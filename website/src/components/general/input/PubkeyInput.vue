<script lang="ts" setup>
import {PublicKey} from '@solana/web3.js';
import {useWallet} from 'solana-wallets-vue';

const props = defineProps<{
    modelValue: PublicKey | null; acceptNull?: boolean, showWalletButton?: boolean, disable?: boolean, readonly?: boolean
}>();
const emits = defineEmits<{
    (e: 'update:model-value', value: PublicKey | null): void,
}>();

const wallet = useWallet();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function onUpdate(value: string) {
    try {
        const pubkey = new PublicKey(value);
        emits('update:model-value', pubkey);
    } catch (e) {
        if (props.acceptNull) {
            emits('update:model-value', null);
        }
    }
}

function selectConnectedWallet() {
    if (props.disable) {
        return;
    }

    onUpdate(wallet.publicKey.value!.toBase58());
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-input v-bind="$attrs"
             :model-value="modelValue?.toString() ?? ''"
             @update:model-value="onUpdate"
             outlined
             :readonly="readonly"
             :disable="disable"
             dense
             placeholder="Solana Address">
        <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope ?? {}"/>
        </template>

        <template v-slot:append v-if="showWalletButton && wallet.publicKey.value && !disable && !readonly">
            <q-btn dense flat round size="sm" class="rounded-borders" @click="selectConnectedWallet">
                <q-icon name="fa-solid fa-wallet" size="14px"/>
                <q-tooltip class="text-no-wrap text-white text-bold shadow-2">Connected wallet</q-tooltip>
            </q-btn>
        </template>
    </q-input>
</template>

<style lang="scss" scoped></style>