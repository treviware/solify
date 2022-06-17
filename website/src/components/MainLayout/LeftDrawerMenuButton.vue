<script lang="ts" setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import {useRightDrawerStore} from 'stores/rightDrawer';
import {RightDrawerState} from 'src/types/drawer';

const props = defineProps<{
    icon: string, name?: string, pathName?: string, rightDrawerOption?: RightDrawerState
}>();

const router = useRouter();
const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => {
    if (props.pathName) {
        return props.pathName === router.currentRoute.value.name;
    } else {
        return rightDrawerStore.drawerState === props.rightDrawerOption;
    }
});

// METHODS --------------------------------------------------------------------

async function open() {
    if (isActive.value) {
        return;
    }

    if (props.pathName) {
        await router.push({
            name: props.pathName,
            query: router.currentRoute.value.query,
        });
    } else {
        await rightDrawerStore.open(props.rightDrawerOption!);
    }
}

// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-item clickable @click="open" :class="{isActive}">
        <q-item-section avatar>
            <q-icon :name="icon" size="18px"/>
        </q-item-section>
        <q-item-section>
            <q-item-label class="text-caption text-bold">{{ name }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<style lang="scss" scoped>
.q-item {
    &:deep(.q-item__section--avatar) {
        min-width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin-right: 10px;
    }

    &::after {
        content: "";
        position: absolute;
        top: 5px;
        right: 0;
        bottom: 5px;
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