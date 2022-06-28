<script lang="ts" setup>
import {ProgramIxnAccountDefinition} from 'src/types/programs/instructionDefinition';

defineProps<{
    argument: ProgramIxnAccountDefinition; index: number;
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
            <div class="row justify-between items-start">
                <div>
                    <q-item-label class="text-bold">#{{ index + 1 }} {{ argument.name }}</q-item-label>
                    <q-item-label caption class="text-bold">{{ argument.description }}</q-item-label>
                </div>
                <div class="badges row items-center gap-x-lg q-mt-sm">
                    <div class="text-bold text-caption">
                        Readonly:
                        <q-badge v-if="argument.readonly" class="text-bold" color="green" text-color="black">Yes
                        </q-badge>
                        <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                    </div>
                    <div class="text-bold text-caption">
                        Mutable:
                        <q-badge v-if="argument.mutable" class="text-bold" color="green" text-color="black">Yes
                        </q-badge>
                        <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                    </div>
                    <div class="text-bold text-caption">
                        Signer:
                        <q-badge v-if="argument.signer" class="text-bold" color="green" text-color="black">Yes</q-badge>
                        <q-badge v-else class="text-bold" color="grey" text-color="black">No</q-badge>
                    </div>
                </div>
            </div>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
@media (max-width: 660px) {
    .badges {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>