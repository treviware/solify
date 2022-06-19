<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';
import {computed} from 'vue';
import {TOOL_BUTTONS} from 'src/constants/tools';
import {storeToRefs} from 'pinia';

const rightDrawerStore = useRightDrawerStore();

const toolButtons = TOOL_BUTTONS;

// REFS -----------------------------------------------------------------------

const {drawerTopButtons} = storeToRefs(rightDrawerStore);

// COMPUTED -------------------------------------------------------------------

const activeOption = computed(
    () => toolButtons.find(button => rightDrawerStore.drawerState === button.rightDrawerOption) ?? null);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="full-width full-height row no-wrap right-drawer">
        <div class="content column">
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
            <div class="col">
                <q-scroll-area class="full-width full-height">
                    <component v-if="activeOption" :is="activeOption.component"></component>
                </q-scroll-area>
            </div>
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