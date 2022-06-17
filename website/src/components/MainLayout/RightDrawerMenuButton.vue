<script lang="ts" setup>
import {computed} from 'vue';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {RightDrawerState} from 'src/types/drawer';

const props = defineProps<{
    rightDrawerOption: RightDrawerState; icon: string; name: string;
}>();

const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => rightDrawerStore.drawerState === props.rightDrawerOption);

// METHODS --------------------------------------------------------------------

async function open() {
    if (isActive.value) {
        return;
    }

    await rightDrawerStore.open(props.rightDrawerOption!);
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item clickable @click="open" :class="{isActive}">
        <q-item-section avatar>
            <q-icon :name="icon" size="18px"/>
            <q-item-label class="text-caption text-bold text-center q-pt-xs">{{ name }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
.q-item {
    width: 100%;
    height: 70px;
    padding-left: 6px;
    padding-right: 6px;

    &:deep(.q-item__section--avatar) {
        min-width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        width: 100%;
    }

    &:deep(.q-item__label) {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &::after {
        content: "";
        position: absolute;
        top: 6px;
        left: 0;
        bottom: 6px;
        width: 4px;
        background-color: transparent;
    }

    &.isActive {
        color: $secondary;

        &::after {
            background-color: $secondary;
        }
    }
}
</style>