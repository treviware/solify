<script lang="ts" setup>
import {computed} from 'vue';
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';

const props = defineProps<{
    option: RightDrawerState, icon: string, name?: string
}>();

const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------

const isActive = computed(() => rightDrawerStore.drawerState === props.option);

// METHODS --------------------------------------------------------------------

function open() {
    if (isActive.value) {
        return;
    }

    rightDrawerStore.open(props.option);
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