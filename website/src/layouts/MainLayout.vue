<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import RightDrawer from 'components/MainLayout/RightDrawer.vue';
import LeftDrawer from 'components/MainLayout/LeftDrawer.vue';
import {computed, ref} from 'vue';
import NetworkButton from 'components/MainLayout/NetworkButton.vue';
import WalletButton from 'components/MainLayout/WalletButton.vue';
import {LEFT_MENU_WIDTH} from 'src/constants';
import {useGlobalStore} from 'stores/global';
import {useRoute} from 'vue-router';
import {getBreadcrumbsForPathName} from 'src/constants/menu';

const route = useRoute();
const rightDrawerStore = useRightDrawerStore();
const globalStore = useGlobalStore();

// REFS -----------------------------------------------------------------------
const isLeftDrawerOpen = ref(!globalStore.isMobile);

// COMPUTED -------------------------------------------------------------------
const isRightDrawerOpen = computed(() => !rightDrawerStore.isClosed);
const paddingRight = computed(() => {
    if (rightDrawerStore.isClosed || rightDrawerStore.overlay) {
        return '0px';
    }

    return rightDrawerStore.maxSize + 'px';
});

const breadcrumbs = computed(() => getBreadcrumbsForPathName(route.name as string));

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-layout view="lHr LpR fFf">
        <q-header class="global-toolbar">
            <q-toolbar class="full-height" :style="{'padding-right': paddingRight}">
                <q-btn dense
                       flat
                       icon="fa-solid fa-bars"
                       round
                       class="rounded-borders"
                       @click="isLeftDrawerOpen = !isLeftDrawerOpen"
                       v-if="globalStore.isMobile"/>
                <q-toolbar-title>
                    <div class="text-bold">
                        {{ globalStore.currentAppButton.headerName ?? globalStore.currentAppButton.name }}
                    </div>
                    <div class="text-caption text-bold overflow-hidden">
                        <q-breadcrumbs>
                            <q-breadcrumbs-el v-for="(breadcrumb, i) in breadcrumbs"
                                              :icon="i === 0 ? 'fa-solid fa-house' : undefined"
                                              :label="breadcrumb.name"
                                              :to="{name: breadcrumb.pathName}"
                                              :key="breadcrumb.pathName"
                                              class="no-wrap"/>
                        </q-breadcrumbs>
                    </div>
                </q-toolbar-title>

                <NetworkButton class="q-mr-md" v-if="!globalStore.isMobile"/>
                <WalletButton class="q-mr-md"/>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="isLeftDrawerOpen"
                  :width="LEFT_MENU_WIDTH"
                  :behavior="globalStore.isMobile ? 'mobile' : 'desktop'"
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
            <q-page style="height: 0" class="main-layout-page">
                <q-scroll-area class="full-width full-height">
                    <router-view/>
                </q-scroll-area>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<style lang="scss" scoped>
.global-toolbar {
    background-color: $dark;
    border-bottom: 2px solid $dark2 !important;
    height: 80px;
}

.q-toolbar {
    transition: padding-right 0.15s;
}

.q-page-container {
    transition: padding-right 0.3s;
}

.main-layout-page:deep(.q-scrollarea__content) {
    max-width: 100%;
    height: 0;
}

.q-breadcrumbs {
    :deep(> div) {
        flex-wrap: nowrap;
    }
}
</style>