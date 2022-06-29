<script lang="ts" setup>
import {ProgramAccountDefinition} from 'src/types/programs/accountDefinition';

defineProps<{
    account: ProgramAccountDefinition<any>; index: number;
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
                <p class="title">{{ account.name }}</p>
                <p class="text-bold">{{ account.description }}</p>
            </q-card-section>
            <q-card-section>
                <p class="text-bold">
                    <template v-if="account.fixedSize !== null">
                        Fixed size: {{ account.fixedSize }} B
                    </template>
                    <template v-else>
                        Minimum size: {{ account.minSize }} B
                    </template>
                </p>
                <p class="text-bold">
                    Type:
                    <q-badge class="text-bold" color="white" text-color="black">{{ account.type.name }}</q-badge>
                </p>
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