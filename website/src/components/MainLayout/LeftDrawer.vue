<script lang="ts" setup>
import LeftDrawerMenuButton from 'components/MainLayout/LeftDrawerMenuButton.vue';

const menuButtons = [{
    icon: 'fa-solid fa-code-commit',
    name: 'Transaction Builder',
    pathName: 'TxBuilder',
    drawerOverlay: true,
}, {
    icon: 'BPS',
    name: 'Basis Points Utility',
    pathName: 'BPSUtility',
    drawerOverlay: false,
    iconAsText: true,
    subText: 'utility',
}];

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height column left-drawer">
        <div class="flex flex-center logo-container">
            <img src="/logos/Logo.png"/>
        </div>
        <div class="menu column" style="gap: 6px">
            <q-space/>
            <div class="flex flex-center" v-for="button in menuButtons" :key="button.name">
                <LeftDrawerMenuButton v-bind="button"></LeftDrawerMenuButton>
            </div>
            <q-space/>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.left-drawer {
    background-color: $dark2;

    .logo-container {
        height: 80px;

        img {
            height: 50px;
            width: 50px;
        }
    }

    .menu {
        flex-grow: 1;
    }
}
</style>