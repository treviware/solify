<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';

const solanaStore = useSolanaStore();

const buttons = [{
    commitment: 'processed',
    name: 'Processed',
}, {
    commitment: 'confirmed',
    name: 'Confirmed',
}, {
    commitment: 'finalized',
    name: 'Finalized',
}];

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function select(commitment: string) {
    solanaStore.setCommitment(commitment);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Solana Commitment</h6>
        <p>The commitment defines in which state of approval the data of the blockchain must be queried:</p>
        <div class="row flex-center q-my-md gap-md">
            <q-btn color="primary"
                   :unelevated="solanaStore.commitment === button.commitment"
                   :flat="solanaStore.commitment !== button.commitment"
                   @click="select(button.commitment)"
                   v-for="button in buttons"
                   :key="button.name">
                {{ button.name }}
            </q-btn>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>