<script lang="ts" setup>
import {ProgramIxnDefinition} from 'src/types/programs/instructionDefinition';
import ProgramIxnArgument from 'components/apps/ProgramExplorerPage/ProgramIxnArgument.vue';
import ProgramIxnAccount from 'components/apps/ProgramExplorerPage/ProgramIxnAccount.vue';

defineProps<{
    instruction: ProgramIxnDefinition<any, any>; index: number;
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
                <p class="text-bold">Accounts:</p>
                <q-list separator>
                    <ProgramIxnAccount v-for="(account, i) in instruction.accounts"
                                       :key="account.id"
                                       :index="i"
                                       :argument="account"/>
                </q-list>
                <p class="text-bold q-mt-lg">Parameters:</p>
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