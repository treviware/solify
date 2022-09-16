<script lang="ts" setup>
import SolanaNetworkSettings from 'components/apps/SettingsPage/SolanaNetworkSettings.vue';
import SolanaCommitmentSettings from 'components/apps/SettingsPage/SolanaCommitmentSettings.vue';
import VsCurrencySettings from 'components/apps/SettingsPage/VsCurrencySettings.vue';
import WalletSettings from 'components/apps/SettingsPage/WalletSettings.vue';
import SolanaExplorerSettings from 'components/apps/SettingsPage/SolanaExplorerSettings.vue';

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-px-lg q-py-md viewport-width">
        <SolanaNetworkSettings/>
        <SolanaExplorerSettings class="q-mt-lg"/>
        <SolanaCommitmentSettings class="q-mt-lg"/>
        <VsCurrencySettings class="q-mt-lg"/>
        <WalletSettings class="q-mt-lg"/>
    </div>
</template>

<style lang="scss" scoped>
.header {
  height: 80px;
  border-bottom: 2px solid $dark;
}
</style>