<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import RightDrawer from 'components/MainLayout/RightDrawer.vue';
import LeftDrawer from 'components/MainLayout/LeftDrawer.vue';
import {computed} from 'vue';
import {useGlobalStore} from 'stores/global';
import NetworkButton from 'components/MainLayout/NetworkButton.vue';

const rightDrawerStore = useRightDrawerStore();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isRightDrawerOpen = computed(() => !rightDrawerStore.isClosed);
const paddingRight = computed(() => {
    if (rightDrawerStore.isClosed || rightDrawerStore.overlay || globalStore.windowWidth <=
        rightDrawerStore.minWindowSize) {
        return '0px';
    }

    return rightDrawerStore.maxSize + 'px';
});

// METHODS --------------------------------------------------------------------
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

                <NetworkButton class="q-mr-md"/>
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
                  :width="rightDrawerStore.maxSize"
                  behavior="desktop"
                  elevated
                  no-swipe-backdrop
                  no-swipe-close
                  no-swipe-open
                  overlay
                  side="right">
            <RightDrawer/>
        </q-drawer>

        <q-page-container :style="{'padding-right': paddingRight}">
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<style lang="scss" scoped>
.global-toolbar {
    background-color: transparent;
    border-bottom: 2px solid $dark2 !important;
    height: 80px;
}

.q-page-container {
    transition: padding-right 0.3s;
}
</style>