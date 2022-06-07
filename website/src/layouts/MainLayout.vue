<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import {storeToRefs} from 'pinia';
import RightDrawer from 'components/MainLayout/RightDrawer.vue';
import {computed} from 'vue';
import LeftDrawer from 'components/MainLayout/LeftDrawer.vue';

const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------

const {
    size: rightDrawerSize,
} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------

const isDrawerStateOpen = computed(() => rightDrawerStore.drawerState !== RightDrawerState.CLOSED);

// METHODS --------------------------------------------------------------------

const openPrograms = rightDrawerStore.openPrograms;

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-layout view="lHr LpR fFf">

        <q-header class="global-toolbar">
            <q-toolbar class="full-height">
                <q-toolbar-title>
                    <b>Solify</b>
                </q-toolbar-title>

                <a @click="openPrograms">Open Programs</a>
            </q-toolbar>
        </q-header>

        <q-drawer :model-value="true"
                  :width="80"
                  behavior="desktop"
                  no-swipe-backdrop
                  no-swipe-close
                  no-swipe-open
                  side="left">
            <LeftDrawer/>
        </q-drawer>

        <q-drawer v-model="isDrawerStateOpen"
                  :width="rightDrawerSize"
                  behavior="desktop"
                  elevated
                  no-swipe-backdrop
                  no-swipe-close
                  no-swipe-open
                  overlay
                  side="right">
            <RightDrawer/>
        </q-drawer>

        <q-page-container>
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<style lang="scss" scoped>
.global-toolbar {
    background-color: transparent;
    border-bottom: 2px solid #1a1e23 !important;
    height: 80px;
}
</style>