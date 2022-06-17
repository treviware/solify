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
    <q-btn class="rounded-borders"
           :color="isActive ? 'primary' : 'grey-8'"
           dense
           :flat="!isActive"
           round
           size="20px"
           :unelevated="isActive"
           @click="open">
        <q-icon :name="icon" size="18px"/>
        <q-tooltip anchor="center start"
                   self="center end"
                   transition-hide="jump-right"
                   transition-show="jump-left"
                   v-if="name"
                   class="text-no-wrap bg-secondary text-black text-bold shadow-2">{{
                name
            }}
        </q-tooltip>
    </q-btn>
</template>

<style lang="scss" scoped></style>