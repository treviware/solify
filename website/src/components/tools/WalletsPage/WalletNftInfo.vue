<script lang="ts" setup>

import {WalletTokenData} from 'stores/pages/tools/walletList';
import {computed, ref} from 'vue';
import JsonInspector from 'components/general/JsonInspector.vue';

const props = defineProps<{
    token: WalletTokenData;
}>();

// REFS -----------------------------------------------------------------------
const tab = ref<'on-chain' | 'off-chain'>('on-chain');

// COMPUTED -------------------------------------------------------------------
const data = computed<any>(() => {
    switch (tab.value) {
        case 'on-chain':
            return {
                ...props.token.metadata,
                external: undefined,
            };
        case 'off-chain':
            return props.token.metadata!.external;
    }

    return {};
});

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="nft-info-card column no-wrap">
        <q-card-section class="row justify-between items-center">
            <h6>Metadata</h6>
            <div>
                <q-btn dense flat icon="fa-solid fa-times" round class="rounded-borders" v-close-popup/>
            </div>
        </q-card-section>
        <q-card-section>
            <q-tabs v-model="tab"
                    class="text-secondary"
                    inline-label
                    no-caps
                    left-icon="fa-solid fa-chevron-left"
                    right-icon="fa-solid fa-chevron-right">
                <q-tab name="on-chain" icon="fa-solid fa-link" label="On-chain"/>
                <q-tab name="off-chain"
                       icon="fa-solid fa-link-slash"
                       label="Off-chain"
                       :disable="!token.metadata?.external"/>
            </q-tabs>
        </q-card-section>
        <q-card-section class="col overflow-auto">
            <JsonInspector :obj="data"></JsonInspector>
        </q-card-section>
    </q-card>
</template>

<style scoped lang="scss">
.nft-info-card {
    min-width: 400px;
    max-width: 90vw;
    max-height: 90vh;

    @media (max-width: 400px) {
        min-width: 100vw;
    }
}
</style>