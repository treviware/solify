<script lang="ts" setup>
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import ProgramIxnArgument from 'components/apps/ProgramExplorerPage/ProgramIxnArgument.vue';

defineProps<{
    instruction: ProgramIxnDefinition<any>; index: number;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="row items-start gap-md">
        <h6>#{{ index + 1 }}</h6>
        <q-card class="col">
            <q-card-section>
                <p class="title">{{ instruction.name }}</p>
                <p class="text-bold">{{ instruction.description }}</p>
            </q-card-section>
            <q-card-section>
                <p class="text-bold">Configuration:</p>
                <q-list separator>
                    <ProgramIxnArgument v-for="(argument, i) in instruction.arguments"
                                        :key="argument.id"
                                        :index="i"
                                        :argument="argument"/>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<style lang="scss" scoped>
.title {
    font-size: 1.1rem;
    font-weight: 500;
}
</style>