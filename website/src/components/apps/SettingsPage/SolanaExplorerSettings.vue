<script lang="ts" setup>
import {useSolanaStore} from 'stores/solana';
import {EXPLORER_DEFINITIONS} from 'src/constants/explorers';

const solanaStore = useSolanaStore();

const buttons = EXPLORER_DEFINITIONS;

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
function select(explorer: string) {
    solanaStore.explorer = explorer;
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Preferred Explorer</h6>
        <p>The preferred explorer will be used when navigating outside to inspect transactions or addresses:</p>
        <div class="row flex-center q-my-md gap-md">
            <q-btn color="primary"
                   no-caps
                   :unelevated="solanaStore.explorer === button.url"
                   :flat="solanaStore.explorer !== button.url"
                   @click="select(button.url)"
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