<script lang="ts" setup>
import {ProgramIxnArgumentDefinition} from 'src/types/programs/instructionDefinition';
import ProgramIxnArgumentTypeBadge from 'components/apps/ProgramExplorerPage/ProgramIxnArgumentTypeBadge.vue';

defineProps<{
    argument: ProgramIxnArgumentDefinition; index: number;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item>
        <q-item-section>
            <div class="row justify-between items-start container gap-x-md">
                <div>
                    <q-item-label class="text-bold">#{{ index + 1 }} {{ argument.name }}</q-item-label>
                    <q-item-label caption class="text-bold">{{ argument.description }}</q-item-label>
                </div>
                <div>
                    <q-item-label caption>
                        <ProgramIxnArgumentTypeBadge class="text-bold q-mt-xs"
                                                     color="white"
                                                     text-color="black"
                                                     :type="argument.data.type"/>
                    </q-item-label>
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
@media (max-width: 1000px) {
    .container {
        flex-direction: column;
    }
}
</style>