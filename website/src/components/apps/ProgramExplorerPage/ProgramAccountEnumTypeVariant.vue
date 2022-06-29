<script lang="ts" setup>
import {getProgramAccountFieldDataName, ProgramAccountVariantDefinition} from 'src/types/programs/accountDefinition';
import {computed} from 'vue';

const props = defineProps<{
    variant: ProgramAccountVariantDefinition;
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const isFields = computed(() => Array.isArray(props.variant.data));
const isTuple = computed(() => !isFields.value && props.variant.data !== undefined);

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div>
        <p v-if="variant.description"><span class="comment doc">/// {{ variant.description }}</span></p>
        <template v-if="isFields">
            <p><span class="name">{{ variant.id }}</span> {</p>
            <p>}</p>
        </template>
        <p v-else-if="isTuple">
            <span class="name">{{ variant.id }}</span>(
            <template v-for="(value, index) in variant.data.innerTypes" :key="index">
                <span v-if="index > 0">, </span>
                <span class="type">{{ getProgramAccountFieldDataName(value) }}</span>
            </template>
            )
        </p>
        <p v-else><span class="name">{{ variant.id }}</span>,</p>
    </div>
</template>

<style lang="scss" scoped></style>