<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import RightDrawerMenuButton from 'components/MainLayout/RightDrawerMenuButton.vue';

const rightDrawerStore = useRightDrawerStore();

const menuButtons = [{
    option: RightDrawerState.Programs,
    icon: 'fa-solid fa-code',
    name: 'Solana Programs',
}, {
    option: RightDrawerState.Settings,
    icon: 'fa-solid fa-gear',
    name: 'Settings',
}];

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height row no-wrap right-drawer">
        <div class="content">content</div>
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