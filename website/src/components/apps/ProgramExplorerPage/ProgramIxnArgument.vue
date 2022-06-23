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
            <q-item-label class="text-bold row items-center gap-xs">#{{ index + 1 }} {{ argument.name }}
                <div class="row gap-xs">
                    <q-badge class="text-bold" v-if="argument.isAccount">Account</q-badge>
                    <q-badge class="text-bold" v-else color="secondary" text-color="dark">
                        Parameter
                    </q-badge>
                </div>
            </q-item-label>
            <q-item-label caption class="text-bold">{{ argument.description }}</q-item-label>
            <div v-if="argument.isAccount" class="row items-center gap-x-lg q-mt-sm">
                <div class="text-bold text-caption">
                    Readonly:
                    <q-badge v-if="argument.readonly" class="text-bold" color="green" text-color="black">Yes</q-badge>
                    <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                </div>
                <div class="text-bold text-caption">
                    Mutable:
                    <q-badge v-if="argument.mutable" class="text-bold" color="green" text-color="black">Yes</q-badge>
                    <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                </div>
                <div class="text-bold text-caption">
                    Signer:
                    <q-badge v-if="argument.signer" class="text-bold" color="green" text-color="black">Yes</q-badge>
                    <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                </div>
            </div>
            <q-item-label caption class="text-bold" v-else>Type:
                <ProgramIxnArgumentTypeBadge class="text-bold q-ml-xs q-mt-xs"
                                             color="white"
                                             text-color="black"
                                             :type="argument.data.type"/>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped></style>