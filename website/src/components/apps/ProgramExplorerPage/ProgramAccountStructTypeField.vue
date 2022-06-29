<script lang="ts" setup>
import {getProgramAccountFieldDataName, ProgramAccountFieldDefinition} from 'src/types/programs/accountDefinition';
import {computed} from 'vue';

const props = defineProps<{
    field: ProgramAccountFieldDefinition;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const typeName = computed(() => getProgramAccountFieldDataName(props.field.data));

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <p v-if="field.description"><span class="comment doc">/// {{ field.description }}</span></p>
        <p><span class="name">{{ field.id }}</span>: <span class="type">{{ typeName }}</span>,</p>
    </div>
</template>

<style lang="scss" scoped></style>