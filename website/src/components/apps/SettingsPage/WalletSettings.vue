<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';

const solanaStore = useSolanaStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function update() {
    solanaStore.setWalletAutoConnect(!solanaStore.walletAutoConnect);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Wallet connection</h6>
        <p>Whether the wallet should auto-connect when the app loads or not.</p>
        <div class="row flex-center q-my-md gap-md">
            <q-toggle :model-value="solanaStore.walletAutoConnect" @update:model-value="update"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>