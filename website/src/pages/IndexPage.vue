<script lang="ts" setup>
import {useRightDrawerStore} from 'stores/rightDrawer';

const rightDrawerStore = useRightDrawerStore();

// REFS -----------------------------------------------------------------------
// COMPUTED -------------------------------------------------------------------
// METHODS --------------------------------------------------------------------
// WATCHES --------------------------------------------------------------------
// HOOKS ----------------------------------------------------------------------
</script>

<template>
    <q-page class="row items-center justify-evenly">
        Home
        <q-input v-model.number="rightDrawerStore.size"/>
    </q-page>
</template>