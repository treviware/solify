<script lang="ts" setup>
import {computed, onBeforeMount, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {useGlobalStore} from 'stores/global';
import {useToolsAppStore} from 'stores/apps/tools';
import {storeToRefs} from 'pinia';
import {useRouter} from 'vue-router';
import {useRouterStore} from 'stores/router';
import {APP_BUTTONS_BY_CATEGORY} from 'src/constants/apps';
import {AppCategory} from 'src/types/apps';
import AppCard from 'components/apps/AppsPage/AppCard.vue';

const router = useRouter();

const globalStore = useGlobalStore();
const toolsAppStore = useToolsAppStore();
const routerStore = useRouterStore();

// REFS -----------------------------------------------------------------------
const {search} = storeToRefs(toolsAppStore);

// COMPUTED -------------------------------------------------------------------
const filteredCategories = computed(() => APP_BUTTONS_BY_CATEGORY.map(v => {
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
}).filter(v => v !== null) as AppCategory[]);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
watch(search, async (search) => {
    await routerStore.setQueryEntry('search', search === '' ? undefined : search);
});

// HOOKS ----------------------------------------------------------------------
onBeforeMount(() => {
    const searchUri = router.currentRoute.value.query['search'] as string;

    if (searchUri) {
        search.value = searchUri;
    }
});

</script>

<template>
    <div class="q-pa-lg">
        <div class="viewport-width">
            <div class="row justify-between items-end q-mb-xl">
                <h3 class="q-mb-xs">Tools</h3>
                <SearchBar v-model="search" placeholder="Search tool" :debounce="300"/>
            </div>
            <div v-for="category in filteredCategories" :key="category.name">
                <h6 class="q-mt-xl">{{ category.name }}</h6>
                <p>{{ category.description }}</p>
                <q-separator class="q-mt-sm q-mb-md"/>
                <div class="row justify-start items-stretch gap-md" :class="{'justify-center': globalStore.isMobile}">
                    <AppCard v-for="button in category.buttons" :key="button.name" :button="button"></AppCard>
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