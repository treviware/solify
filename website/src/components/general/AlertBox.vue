<script lang="ts" setup>
import {computed} from 'vue';

const props = defineProps<{
    type?: 'error' | 'warning' | 'info';
}>();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
const finalType = computed(() => props.type ?? 'error');
const icon = computed(() => {
    switch (finalType.value) {
        case 'error':
            return 'fa-solid fa-circle-exclamation';
        case 'warning':
            return 'fa-solid fa-triangle-exclamation';
        case 'info':
            return 'fa-solid fa-circle-info';
    }

    return '';
});

// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <div class="alert-box q-px-md q-py-sm row no-wrap items-start justify-start" :class="[finalType]">
        <div class="icon-container q-mr-md">
            <q-icon :name="icon" size="20px"/>
        </div>
        <div class="content col">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.alert-box {
    &.error {
        background-color: transparentize($negative, 0.8);
        border-left: 6px solid $negative;

        .icon-container {
            color: $negative;
        }
    }

    &.warning {
        background-color: transparentize($warning, 0.8);
        border-left: 6px solid $warning;

        .icon-container {
            color: $warning;
        }
    }

    &.info {
        background-color: transparentize($info, 0.8);
        border-left: 6px solid $info;

        .icon-container {
            color: $info;
        }
    }
}
</style>