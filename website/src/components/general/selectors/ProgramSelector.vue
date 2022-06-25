<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {QInfiniteScroll} from 'quasar';
import {useProgramExplorerAppStore} from 'stores/apps/programExplorer';
import {ProgramDefinition} from 'src/types/programs/programDefinition';

const tokensPerPage = 20;

const props = defineProps<{
    initialSearch?: string
}>();
const emits = defineEmits<{
    (e: 'select', program: ProgramDefinition<any, any>): void,
}>();

const programExplorerAppStore = useProgramExplorerAppStore();

// REFS -----------------------------------------------------------------------
const search = ref(props.initialSearch ?? '');
const maxPage = ref(0);

// COMPUTED -------------------------------------------------------------------
const filteredPrograms = computed<ProgramDefinition<any, any>[]>(() => {
    if (search.value === '') {
        return programExplorerAppStore.programs.slice(0);
    }

    const searchLower = search.value.toLowerCase();
    return programExplorerAppStore.programs
        .filter(program => program.name.toLowerCase().indexOf(searchLower) !== -1 ||
            (program.description && program.description.toLowerCase().indexOf(searchLower) !== -1));
});

const programs = computed(() => {
    return filteredPrograms.value.slice(0, tokensPerPage * (maxPage.value + 1));
});

// METHODS --------------------------------------------------------------------
function selectProgram(program: ProgramDefinition<any, any>) {
    emits('select', program);
}

function onLoad(index: number, done: () => void) {
    maxPage.value += 1;
    done();
}

// WATCHES --------------------------------------------------------------------

watch(search, () => {
    maxPage.value = 0;
});

// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-card class="program-selector">
        <q-card-section class="full-height column">
            <h6 class="text-center q-mb-sm">Program selector</h6>
            <SearchBar v-model="search" placeholder="Search program" :debounce="300"/>
            <div class="overflow-auto col q-mt-md">
                <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScroll" class="full-width">
                    <q-list dense>
                        <q-item class="q-mb-xs"
                                v-for="program in programs"
                                :key="program.name"
                                clickable
                                @click="selectProgram(program)">
                            <q-item-section class="q-py-sm">
                                <q-item-label><b>{{
                                        program.name
                                    }}</b>
                                </q-item-label>
                                <q-item-label caption v-if="program.description">
                                    {{ program.description }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <template v-slot:loading>
                        <div class="row justify-center q-my-md">
                            <q-spinner-dots color="primary" size="40px"/>
                        </div>
                    </template>
                </q-infinite-scroll>
            </div>
        </q-card-section>
    </q-card>
</template>

<style lang="scss" scoped>
.program-selector {
    width: 500px;
    max-width: 100vw;
    height: 999px;
    max-height: 500px;
}
</style>