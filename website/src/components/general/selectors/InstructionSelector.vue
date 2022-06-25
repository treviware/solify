<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import SearchBar from 'components/general/SearchBar.vue';
import {QInfiniteScroll} from 'quasar';
import {useProgramExplorerAppStore} from 'stores/apps/programExplorer';
import {InstructionInfoElement} from 'src/types/instructions';

const tokensPerPage = 20;

const props = defineProps<{
    initialSearch?: string
}>();
const emits = defineEmits<{
    (e: 'select', instruction: InstructionInfoElement): void,
}>();

const programExplorerAppStore = useProgramExplorerAppStore();

// REFS -----------------------------------------------------------------------
const search = ref(props.initialSearch ?? '');
const maxPage = ref(0);

// COMPUTED -------------------------------------------------------------------
const baseInstructions = computed<InstructionInfoElement[]>(
    () => programExplorerAppStore.programs.map(p => p.instructions.map(v => ({
        program: p,
        instruction: v,
    } as InstructionInfoElement))).reduce((a, b) => a.concat(b), []));

const filteredInstruction = computed<InstructionInfoElement[]>(() => {
    if (search.value === '') {
        return baseInstructions.value.slice(0);
    }

    const searchLower = search.value.toLowerCase();
    return baseInstructions.value
        .filter(instructionInfo => instructionInfo.program.name.toLowerCase().indexOf(searchLower) !== -1 ||
            instructionInfo.instruction.name.toLowerCase().indexOf(searchLower) !== -1);
});

const instructions = computed(() => {
    return filteredInstruction.value.slice(0, tokensPerPage * (maxPage.value + 1));
});

// METHODS --------------------------------------------------------------------
function selectInstruction(instruction: InstructionInfoElement) {
    emits('select', instruction);
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
    <q-card class="token-selector">
        <q-card-section class="full-height column">
            <h6 class="text-center q-mb-sm">Instruction selector</h6>
            <SearchBar v-model="search" placeholder="Search instruction" :debounce="300"/>
            <div class="overflow-auto col q-mt-md">
                <q-infinite-scroll @load="onLoad" :offset="250" ref="infiniteScroll" class="full-width">
                    <q-list dense>
                        <q-item class="q-mb-xs"
                                v-for="instructionInfo in instructions"
                                :key="instructionInfo.program.name + '::' + instructionInfo.instruction.name"
                                clickable
                                @click="selectInstruction(instructionInfo)">
                            <q-item-section>
                                <q-item-label><b>{{
                                        instructionInfo.program.name
                                    }}</b>::{{ instructionInfo.instruction.name }}
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
.token-selector {
    width: 500px;
    max-width: 100vw;
    height: 999px;
    max-height: 500px;
}
</style>