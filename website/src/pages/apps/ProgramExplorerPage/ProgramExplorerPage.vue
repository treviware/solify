<script lang="ts" setup>
import {computed, onBeforeMount, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {useProgramExplorerAppStore} from 'stores/apps/programExplorer';
import {storeToRefs} from 'pinia';
import {ProgramDefinition} from 'src/types/programs/programDefinition';
import {useGlobalStore} from 'stores/global';
import ProgramCard from 'components/apps/ProgramExplorerPage/ProgramCard.vue';
import {useRouterStore} from 'stores/router';
import {useRouter} from 'vue-router';

const router = useRouter();

const globalStore = useGlobalStore();
const programExplorerAppStore = useProgramExplorerAppStore();
const routerStore = useRouterStore();

// REFS -----------------------------------------------------------------------
const {search} = storeToRefs(programExplorerAppStore);

// COMPUTED -------------------------------------------------------------------
const filteredPrograms = computed(() => programExplorerAppStore.programs.filter(v => {
    if (search.value === '') {
        return true;
    }

    return v.name.toLowerCase().indexOf(search.value) >= 0 ||
        (v.description && v.description.toLowerCase().indexOf(search.value) >= 0);
}) as ProgramDefinition<any, any>[]);

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
                <h3 class="q-mb-xs">Programs</h3>
                <SearchBar v-model="search" placeholder="Search program" :debounce="300"/>
            </div>
            <div class="row justify-start items-stretch gap-md" :class="{'justify-center': globalStore.isMobile}">
                <ProgramCard v-for="program in filteredPrograms" :key="program.address.toBase58()" :program="program"/>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.searchbar {
    width: 400px;
}
</style>