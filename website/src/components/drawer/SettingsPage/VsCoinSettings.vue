<script lang="ts" setup>
import {useCoingeckoStore, VS_COINS} from 'stores/coingecko';

const coingeckoStore = useCoingeckoStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function select(vsCoin: string) {
    coingeckoStore.setVsCoin(vsCoin);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Comparison Currency</h6>
        <p>The currency used to compare the tokens' prices against it:</p>
        <div class="row flex-center q-my-md" style="gap: 20px">
            <q-btn color="primary"
                   :unelevated="coingeckoStore.vsCoinName === vsCoin"
                   :flat="coingeckoStore.vsCoinName !== vsCoin"
                   @click="select(vsCoin)"
                   v-for="vsCoin in VS_COINS"
                   :key="vsCoin">
                {{ vsCoin }}
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