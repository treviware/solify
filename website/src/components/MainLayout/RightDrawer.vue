<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import RightDrawerMenuButton from 'components/MainLayout/RightDrawerMenuButton.vue';
import {computed} from 'vue';
import {RIGHT_MENU_WIDTH} from 'src/constants';
import {UTILITY_BUTTONS} from 'src/constants/utilites';
import {storeToRefs} from 'pinia';

const rightDrawerStore = useRightDrawerStore();

// const fixedButtons = FIXED_UTILITY_BUTTONS;
const utilityButtons = UTILITY_BUTTONS;

// REFS -----------------------------------------------------------------------

const {drawerTopButtons} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------

const activeOption = computed(
    () => utilityButtons.find(button => rightDrawerStore.drawerState === button.rightDrawerOption) ?? null);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height row no-wrap right-drawer">
        <div class="content" v-if="activeOption">
            <div class="header row items-center justify-between q-px-lg">
                <div>
                    <div class="text-bold">
                        {{ activeOption.headerName ?? activeOption.name }}
                    </div>
                    <div class="text-caption text-bold">
                        {{ activeOption.headerDescription ?? activeOption.description }}
                    </div>
                </div>
                <div id="right-drawer-buttons" ref="drawerTopButtons"></div>
            </div>
            <component :is="activeOption.component"></component>
        </div>
        <div class="menu column" style="gap: 6px" :style="{'--right-menu-width': RIGHT_MENU_WIDTH + 'px'}">
            <div class="close-container flex flex-center">
                <q-btn dense
                       flat
                       icon="fa-solid fa-times"
                       round
                       class="rounded-borders"
                       @click="rightDrawerStore.close"/>
            </div>
            <q-space/>
            <q-list style="width: 100%;">
                <RightDrawerMenuButton v-bind="button"
                                       v-for="button in utilityButtons"
                                       :key="button.name"></RightDrawerMenuButton>
            </q-list>
            <q-space/>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.right-drawer {
    & > .content {
        & > .header {
            height: 80px;
            font-size: 21px;
            border-bottom: 2px solid $dark;
        }

        background-color: $dark2;
        flex-grow: 1;
        flex-shrink: 1;
    }

    & > .menu {
        background-color: $dark;
        flex-grow: 0;
        flex-shrink: 0;
        width: var(--right-menu-width);

        .close-container {
            height: var(--right-menu-width);
        }
    }
}
</style>