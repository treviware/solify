<script lang="ts" setup>
import {useCoingeckoStore, VS_CURRENCYS} from 'stores/coingecko';

const coingeckoStore = useCoingeckoStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------

function select(vsCurrency: string) {
    coingeckoStore.setVsCurrency(vsCurrency);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <h6>Comparison Currency</h6>
        <p>The currency used to compare the tokens' prices against it:</p>
        <div class="row flex-center q-my-md gap-md">
            <q-btn color="primary"
                   :unelevated="coingeckoStore.vsCurrencyName === vsCurrency"
                   :flat="coingeckoStore.vsCurrencyName !== vsCurrency"
                   @click="select(vsCurrency)"
                   v-for="vsCurrency in VS_CURRENCYS"
                   :key="vsCurrency">
                {{ vsCurrency }}
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