<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import {storeToRefs} from 'pinia';
import RightDrawer from 'components/MainLayout/RightDrawer.vue';
import LeftDrawer from 'components/MainLayout/LeftDrawer.vue';
import {computed} from 'vue';

const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------

const {
    size: rightDrawerSize,
    overlay: rightDrawerOverlay,
} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------

const isRightDrawerOpen = computed(() => !rightDrawerStore.isClosed);

// METHODS --------------------------------------------------------------------

function openPrograms() {
    rightDrawerStore.open(RightDrawerState.PROGRAMS);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-layout view="lHr LpR fFf">
        <q-header class="global-toolbar">
            <q-toolbar class="full-height">
                <q-toolbar-title style="overflow: visible">
                    <div class="text-bold relative-position" style="overflow: visible">
                        Solify
                        <div class="absolute-bottom-left text-caption text-bold" style="bottom: -10px">by
                            <a class="text-secondary" href="https://treviware.com" target="_blank">Treviware</a>
                        </div>
                    </div>
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

        <q-drawer :model-value="isRightDrawerOpen"
                  @update:model-value="()=>{}"
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

        <q-page-container :style="{'padding-right': rightDrawerStore.isClosed || rightDrawerOverlay ? '0px' : rightDrawerSize + 'px'}">
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