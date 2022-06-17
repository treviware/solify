<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import {computed} from 'vue';
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
        <div class="content">
            <div class="header row items-center justify-between q-px-lg">
                <div v-if="activeOption">
                    <div class="text-bold">
                        {{ activeOption.headerName ?? activeOption.name }}
                    </div>
                    <div class="text-caption text-bold">
                        {{ activeOption.headerDescription ?? activeOption.description }}
                    </div>
                </div>
                <div class="row gap-md">
                    <div id="right-drawer-buttons" ref="drawerTopButtons"></div>
                    <q-btn dense
                           flat
                           icon="fa-solid fa-times"
                           round
                           class="rounded-borders"
                           @click="rightDrawerStore.close"/>
                </div>
            </div>
            <component v-if="activeOption" :is="activeOption.component"></component>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    & > .header {
        height: 80px;
        font-size: 21px;
        border-bottom: 2px solid $dark;
    }

    background-color: $dark2;
    flex-grow: 1;
    flex-shrink: 1;
}
</style>