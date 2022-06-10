<script lang="ts" setup>
import SolanaNetworkSettings from 'components/drawer/SettingsPage/SolanaNetworkSettings.vue';
import SolanaCommitmentSettings from 'components/drawer/SettingsPage/SolanaCommitmentSettings.vue';
import VsCurrencySettings from 'components/drawer/SettingsPage/VsCurrencySettings.vue';

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <div class="header flex items-center q-px-lg">
            <h5>Settings</h5>
        </div>
        <div class="q-px-lg q-py-md">
            <SolanaNetworkSettings/>
            <SolanaCommitmentSettings class="q-mt-lg"/>
            <VsCurrencySettings class="q-mt-lg"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header {
    height: 80px;
    border-bottom: 2px solid $dark;
}
</style>