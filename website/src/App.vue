<script lang="ts" setup>
import {RightDrawerState, useRightDrawerStore} from 'stores/rightDrawer';
import {watch} from 'vue';
import {useRoute} from 'vue-router';
import {reverseEnum} from 'src/utils/objects';

const route = useRoute();
const rightDrawerStore = useRightDrawerStore();
const reversedStates = reverseEnum(RightDrawerState);

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------

watch(route, (route) => {
    const drawer = route.query.drawer as string;

    if (reversedStates[drawer]) {
        rightDrawerStore.open(drawer as RightDrawerState);
    } else {
        rightDrawerStore.close();
    }
});
</script>

<template>
    <router-view/>
</template>