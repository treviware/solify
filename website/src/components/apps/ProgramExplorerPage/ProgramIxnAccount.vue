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
            <div class="row justify-between items-start container gap-x-md">
                <div>
                    <q-item-label class="text-bold">#{{ index + 1 }} {{ argument.name }}</q-item-label>
                    <q-item-label caption class="text-bold">{{ argument.description }}</q-item-label>
                </div>
                <div class="badges row items-center gap-md q-mt-sm">
                    <q-badge v-if="argument.readonly" class="text-bold" color="primary" text-color="black">Readonly
                    </q-badge>
                    <q-badge v-if="argument.mutable" class="text-bold" color="secondary" text-color="black">Mutable
                    </q-badge>
                    <q-badge v-if="argument.signer" class="text-bold" color="accent" text-color="black">Signer</q-badge>
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

@media (max-width: 660px) {
    .badges {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>