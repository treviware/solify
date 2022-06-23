<script lang="ts" setup>
import {ProgramIxnArgumentData} from 'src/types/programs/instructionDefinition';
import {computed} from 'vue';

const props = defineProps<{
    type: ProgramIxnArgumentData['type'];
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const realType = computed(() => {
    switch (props.type) {
        case 'bool':
            return 'Boolean';
        case 'number':
        case 'bignum':
            return 'Number';
        case 'bps':
            return 'Token Basis Points';
        case 'string':
            return 'String';
        case 'address':
            return 'Account address';
    }

    return 'Unknown';
});
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-badge>{{ realType }}</q-badge>
</template>

<style lang="scss" scoped></style>