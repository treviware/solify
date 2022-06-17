<script lang="ts" setup>
import SolanaNetworkSettings from 'components/apps/SettingsPage/SolanaNetworkSettings.vue';
import SolanaCommitmentSettings from 'components/apps/SettingsPage/SolanaCommitmentSettings.vue';
import VsCurrencySettings from 'components/apps/SettingsPage/VsCurrencySettings.vue';

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md viewport-width">
        <SolanaNetworkSettings/>
        <SolanaCommitmentSettings class="q-mt-lg"/>
        <VsCurrencySettings class="q-mt-lg"/>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>