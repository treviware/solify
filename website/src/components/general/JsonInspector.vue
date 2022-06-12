<script lang="ts" setup>

import {computed, ref} from 'vue';

const props = defineProps<{
    obj: any
}>();

// REFS -----------------------------------------------------------------------
const expanded = ref<string[]>([]);

// COMPUTED -------------------------------------------------------------------
const nodes = computed(() => [generateObjectProperties(JSON.parse(JSON.stringify(props.obj)), '"Metadata"', {i: 0})]);

// METHODS --------------------------------------------------------------------

function generateObjectProperties(obj: any, label: string, index: { i: number }): any {
    if (obj === null) {
        return {
            id: `${index.i++}`,
            value: 'null',
            type: 'null',
            label,
        };
    }

    if (Array.isArray(obj)) {
        return {
            id: `${index.i++}`,
            label,
            type: 'array',
            children: obj.map((value, i) => {
                if (value === undefined) {
                    return null;
                }

                return generateObjectProperties(value, `${i}`, index);
            }).filter(x => x !== null),
        };
    }

    switch (typeof obj) {
        case 'undefined':
            throw new Error('Undefined type is not supported');
        case 'object':
            const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
            return {
                id: `${index.i++}`,
                label,
                type: 'object',
                children: keys.map(key => {
                    const value = obj[key];

                    if (value === undefined) {
                        return null;
                    }

                    return generateObjectProperties(value, `"${key}"`, index);
                }).filter(x => x !== null),
            };
        case 'string':
            return {
                id: `${index.i++}`,
                value: `"${obj}"`,
                type: 'string',
                label,
            };
        case 'boolean':
            return {
                id: `${index.i++}`,
                value: obj.toString(),
                type: 'bool',
                label,
            };
        case 'number':
        case 'bigint':
            return {
                id: `${index.i++}`,
                value: obj.toString(),
                type: 'number',
                label,
            };
    }

    return {
        id: `${index.i++}`,
        value: obj.toString(),
        label,
    };
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-tree :nodes="nodes"
            dense
            node-key="id"
            class="json-tree"
            v-model:expanded="expanded"
            icon="fa-solid fa-caret-right"
            default-expand-all>
        <template v-slot:default-header="props">
            <div class="row no-wrap items-start">
                <div class="text-grey-3">{{ props.node.label }}
                    <q-badge v-if="props.node.type === 'array'" color="primary">Array</q-badge>
                    <q-badge v-else-if="props.node.type === 'object'" color="primary">Object</q-badge>
                </div>
                <template v-if="props.node.value">:&nbsp; <span v-if="props.node.type === 'bool'" class="text-primary">{{
                        props.node.value
                    }}</span>
                    <span v-else-if="props.node.type === 'null'" class="text-grey-7">{{ props.node.value }}</span>
                    <span v-else-if="props.node.type === 'number'" class="text-accent">{{ props.node.value }}</span>
                    <span v-else-if="props.node.type === 'string'" class="text-secondary">{{ props.node.value }}</span>
                    <span v-else>{{ props.node.value }}</span>
                </template>
            </div>
        </template>
    </q-tree>
</template>

<style scoped lang="scss">
.json-tree {
    font-family: Inconsolata, consolas, monospace;
    font-size: 14px;
}
</style>