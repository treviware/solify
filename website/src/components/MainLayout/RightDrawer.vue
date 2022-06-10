<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import RightDrawerMenuButton from 'components/MainLayout/RightDrawerMenuButton.vue';
import {computed} from 'vue';
import SettingsPage from 'pages/drawer/SettingsPage.vue';
import SolanaProgramsPage from 'pages/drawer/SolanaProgramsPage.vue';
import WalletsPage from 'pages/drawer/WalletsPage.vue';

const rightDrawerStore = useRightDrawerStore();

const menuButtons = [{
    option: RightDrawerState.Programs,
    icon: 'fa-solid fa-code',
    name: 'Solana Programs',
    pageComponent: SolanaProgramsPage,
}, {
    option: RightDrawerState.Wallets,
    icon: 'fa-solid fa-wallet',
    name: 'Wallets',
    pageComponent: WalletsPage,
}, {
    option: RightDrawerState.Settings,
    icon: 'fa-solid fa-gear',
    name: 'Settings',
    pageComponent: SettingsPage,
}];

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const activeOption = computed(() => menuButtons.find(button => rightDrawerStore.drawerState === button.option) ?? null);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height row no-wrap right-drawer">
        <div class="content">
            <component v-if="activeOption" :is="activeOption.pageComponent"></component>
        </div>
        <div class="menu column" style="gap: 6px">
            <div class="close-container flex flex-center">
                <q-btn dense flat icon="fa-solid fa-times" round @click="rightDrawerStore.close"/>
            </div>
            <q-space/>
            <div class="flex flex-center" v-for="button in menuButtons" :key="button.name">
                <RightDrawerMenuButton v-bind="button"></RightDrawerMenuButton>
            </div>
            <q-space/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.right-drawer {
    & > .content {
        background-color: $dark2;
        flex-grow: 1;
        flex-shrink: 1;
    }

    & > .menu {
        background-color: $dark;
        flex-grow: 0;
        flex-shrink: 0;
        width: 80px;

        .close-container {
            height: 80px;
        }
    }
}
</style>