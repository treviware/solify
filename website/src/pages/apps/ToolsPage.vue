<script lang="ts" setup>
import {computed} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {TOOL_BUTTONS_BY_CATEGORY} from 'src/constants/tools';
import {ToolCategory} from 'src/types/tools';
import ToolCard from 'components/apps/ToolsPage/ToolCard.vue';
import {useMenuStore} from 'stores/menu';
import {useGlobalStore} from 'stores/global';
import {useToolsAppStore} from 'stores/apps/tools';
import {storeToRefs} from 'pinia';

const menuStore = useMenuStore();
const globalStore = useGlobalStore();
const toolsAppStore = useToolsAppStore();

// REFS -----------------------------------------------------------------------
const {search} = storeToRefs(toolsAppStore);

// COMPUTED -------------------------------------------------------------------
const filteredCategories = computed(() => TOOL_BUTTONS_BY_CATEGORY.map(v => {
    if (search.value === '') {
        return {
            ...v,
            buttons: v.buttons.map(b => ({...b})),
        };
    }

    const buttons = v.buttons.filter(
        b => b.name.toLowerCase().indexOf(search.value) >= 0 || b.description.toLowerCase().indexOf(search.value) >= 0);

    if (buttons.length === 0) {
        return null;
    }

    return {
        ...v,
        buttons,
    };
}).filter(v => v !== null) as ToolCategory[]);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="q-pa-lg">
        <div class="viewport-width">
            <div class="row justify-between items-end q-mb-xl">
                <h3 class="q-mb-xs">Tools</h3>
                <SearchBar v-model="search" placeholder="Search tool" :debounce="300"/>
            </div>
            <template v-if="menuStore.pinnedTools.length > 0">
                <h6 class="q-mt-xl">Pinned tools</h6>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div class="row justify-start items-stretch gap-md" :class="{'justify-center': globalStore.isMobile}">
                    <ToolCard v-for="button in menuStore.pinnedTools" :key="button.name" :button="button"></ToolCard>
                </div>
            </template>
            <div v-for="category in filteredCategories" :key="category.name">
                <h6 class="q-mt-xl">{{ category.name }}</h6>
                <p>{{ category.description }}</p>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div class="row justify-start items-stretch gap-md" :class="{'justify-center': globalStore.isMobile}">
                    <ToolCard v-for="button in category.buttons" :key="button.name" :button="button"></ToolCard>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.searchbar {
    width: 400px;
}
</style>